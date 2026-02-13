import { SessionManager, CSRFProtection } from './encryption';
import { supabase, isSupabaseConfigured, getTableName, getCurrentUserEmail } from './supabaseClient';

// Cache en mémoire pour réduire les appels Supabase
const dataCache: Map<string, { data: any[], timestamp: number }> = new Map();
const CACHE_DURATION = 30000; // 30 secondes

// Vérifier si le cache est valide
const isCacheValid = (moduleName: string): boolean => {
    const cached = dataCache.get(moduleName);
    if (!cached) return false;
    return Date.now() - cached.timestamp < CACHE_DURATION;
};

// Obtenir les données du cache
const getCachedData = (moduleName: string): any[] | null => {
    if (!isCacheValid(moduleName)) return null;
    return dataCache.get(moduleName)?.data || null;
};

// Mettre à jour le cache
const updateCache = (moduleName: string, data: any[]): void => {
    dataCache.set(moduleName, { data, timestamp: Date.now() });
};

// Invalider le cache pour un module
const invalidateCache = (moduleName: string): void => {
    dataCache.delete(moduleName);
};

// Fallback localStorage functions
const getLocalStorageData = (moduleName: string): any[] => {
    try {
        const data = localStorage.getItem(`module_${moduleName}`);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error(`Error reading localStorage for ${moduleName}:`, error);
        return [];
    }
};

const setLocalStorageData = (moduleName: string, data: any[]): void => {
    try {
        localStorage.setItem(`module_${moduleName}`, JSON.stringify(data));
    } catch (error) {
        console.error(`Error writing localStorage for ${moduleName}:`, error);
    }
};

// Supabase functions
const fetchFromSupabase = async (moduleName: string): Promise<any[]> => {
    if (!supabase) return [];
    
    try {
        const tableName = getTableName(moduleName);
        const userEmail = getCurrentUserEmail();
        
        // Pour les messages, récupérer ceux où l'utilisateur est expéditeur OU destinataire
        if (moduleName === 'messaging') {
            const { data, error } = await supabase
                .from(tableName)
                .select('*')
                .or(`sender.eq.${userEmail},recipient.eq.${userEmail}`)
                .order('created_at', { ascending: false });
            
            if (error) {
                console.error('Supabase fetch error:', error);
                return [];
            }
            
            return data || [];
        }
        
        // Pour les autres modules, filtrer par user_email
        const { data, error } = await supabase
            .from(tableName)
            .select('*')
            .eq('user_email', userEmail)
            .order('created_at', { ascending: false });
        
        if (error) {
            console.error('Supabase fetch error:', error);
            return [];
        }
        
        // Transformer les données du Planning si nécessaire
        if (moduleName === 'planning' && data) {
            return data.map(transformPlanningFromSupabase);
        }
        
        return data || [];
    } catch (error) {
        console.error('Error fetching from Supabase:', error);
        return [];
    }
};

// Transformer les données du Planning pour Supabase
const transformPlanningForSupabase = (item: any): any => {
    if (!item.date || !item.time) return item;
    
    try {
        // La date est au format ISO (YYYY-MM-DD) depuis l'input type="date"
        const dateISO = item.date;
        
        // Parser l'heure (format: "14:30" ou "14:00")
        const timeParts = item.time.split(':');
        const hour = timeParts[0].padStart(2, '0');
        const minute = (timeParts[1] || '00').padStart(2, '0');
        
        // Créer le timestamp ISO complet
        const dateTimeISO = `${dateISO}T${hour}:${minute}:00`;
        
        return {
            title: item.title,
            description: item.module || '',
            start_date: dateTimeISO,
            end_date: dateTimeISO, // Même heure pour début et fin
            location: item.resource || '',
            attendees: item.user ? [item.user] : [],
            reminder: item.reminder || false
        };
    } catch (error) {
        console.error('Error transforming planning data:', error, item);
        // En cas d'erreur, retourner l'item original
        return item;
    }
};

// Transformer les données Supabase pour le Planning
const transformPlanningFromSupabase = (item: any): any => {
    if (!item.start_date) return item;
    
    const startDate = new Date(item.start_date);
    
    // Garder le format ISO pour la date (YYYY-MM-DD) pour compatibilité avec input type="date"
    const year = startDate.getFullYear();
    const month = String(startDate.getMonth() + 1).padStart(2, '0');
    const day = String(startDate.getDate()).padStart(2, '0');
    const dateISO = `${year}-${month}-${day}`;
    
    const time = startDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    
    return {
        id: item.id,
        title: item.title,
        resource: item.location || '',
        time: time,
        date: dateISO, // Format ISO pour compatibilité
        user: item.attendees?.[0] || '',
        module: item.description || '',
        reminder: item.reminder || false
    };
};

const saveToSupabase = async (moduleName: string, item: any): Promise<any> => {
    if (!supabase) return null;
    
    try {
        const tableName = getTableName(moduleName);
        const userEmail = getCurrentUserEmail();
        
        // Transformer les données du Planning si nécessaire
        let itemToSave = { ...item };
        if (moduleName === 'planning') {
            itemToSave = transformPlanningForSupabase(item);
        }
        
        // Préparer l'item pour Supabase
        const itemWithUser = {
            ...itemToSave,
            user_email: userEmail
        };
        
        // Si l'item a un UUID (format avec tirets), c'est un UPDATE
        if (itemWithUser.id && typeof itemWithUser.id === 'string' && itemWithUser.id.includes('-')) {
            // UPDATE
            const { data, error } = await supabase
                .from(tableName)
                .update(itemWithUser)
                .eq('id', itemWithUser.id)
                .select()
                .single();
            
            if (error) {
                console.error('Supabase update error:', error);
                return null;
            }
            
            return data;
        }
        
        // Supprimer l'ID si c'est une string générée localement (pas un UUID)
        // Supabase générera automatiquement un UUID
        if (itemWithUser.id && typeof itemWithUser.id === 'string' && !itemWithUser.id.includes('-')) {
            delete itemWithUser.id;
        }
        
        // INSERT (Supabase génère l'ID)
        const { data, error } = await supabase
            .from(tableName)
            .insert(itemWithUser)
            .select()
            .single();
        
        if (error) {
            console.error('Supabase insert error:', error);
            return null;
        }
        
        return data;
    } catch (error) {
        console.error('Error saving to Supabase:', error);
        return null;
    }
};

const deleteFromSupabase = async (moduleName: string, id: string): Promise<boolean> => {
    if (!supabase) return false;
    
    try {
        const tableName = getTableName(moduleName);
        const userEmail = getCurrentUserEmail();
        
        const { error } = await supabase
            .from(tableName)
            .delete()
            .eq('id', id)
            .eq('user_email', userEmail);
        
        if (error) {
            console.error('Supabase delete error:', error);
            return false;
        }
        
        return true;
    } catch (error) {
        console.error('Error deleting from Supabase:', error);
        return false;
    }
};

export const fetchModuleData = async (moduleName: string) => {
    try {
        console.log('fetchModuleData called for:', moduleName);
        
        // Vérifier le cache d'abord
        const cachedData = getCachedData(moduleName);
        if (cachedData !== null) {
            console.log('Using cached data for:', moduleName);
            return cachedData;
        }
        
        // Priorité 1: Supabase si configuré
        if (isSupabaseConfigured()) {
            console.log('Using Supabase for:', moduleName);
            const data = await fetchFromSupabase(moduleName);
            updateCache(moduleName, data); // Mettre en cache
            return data;
        }
        
        // Priorité 2: localStorage fallback
        console.log('Using localStorage fallback for:', moduleName);
        const data = getLocalStorageData(moduleName);
        updateCache(moduleName, data); // Mettre en cache
        return data;
    } catch (error) {
        console.error(`Error fetching ${moduleName}:`, error);
        console.log('Falling back to localStorage');
        const data = getLocalStorageData(moduleName);
        updateCache(moduleName, data);
        return data;
    }
};

export const saveModuleItem = async (moduleName: string, item: any) => {
    try {
        console.log('saveModuleItem called with:', moduleName, item);
        
        // Invalider le cache lors de la sauvegarde
        invalidateCache(moduleName);
        
        // Priorité 1: Supabase si configuré
        if (isSupabaseConfigured()) {
            console.log('Using Supabase for save:', moduleName);
            const result = await saveToSupabase(moduleName, item);
            if (result) {
                return { success: true, id: result.id, data: result };
            }
        }
        
        // Priorité 2: localStorage fallback
        console.log('Using localStorage fallback for save:', moduleName);
        const currentData = getLocalStorageData(moduleName);
        
        // Générer un ID si nécessaire
        if (!item.id) {
            item.id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
        }
        
        // Vérifier si l'item existe déjà (update)
        const existingIndex = currentData.findIndex((d: any) => d.id === item.id);
        if (existingIndex >= 0) {
            currentData[existingIndex] = item;
        } else {
            currentData.push(item);
        }
        
        setLocalStorageData(moduleName, currentData);
        return { success: true, id: item.id };
    } catch (error) {
        console.error(`Error saving to ${moduleName}:`, error);
        console.log('Falling back to localStorage');
        
        // Fallback to localStorage on error
        const currentData = getLocalStorageData(moduleName);
        if (!item.id) {
            item.id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
        }
        currentData.push(item);
        setLocalStorageData(moduleName, currentData);
        return { success: true, id: item.id };
    }
};

export const deleteModuleItem = async (moduleName: string, id: string | number) => {
    try {
        console.log('deleteModuleItem called:', moduleName, id);
        
        // Invalider le cache lors de la suppression
        invalidateCache(moduleName);
        
        // Priorité 1: Supabase si configuré
        if (isSupabaseConfigured()) {
            console.log('Using Supabase for delete:', moduleName);
            const success = await deleteFromSupabase(moduleName, id.toString());
            if (success) {
                return { success: true };
            }
        }
        
        // Priorité 2: localStorage fallback
        console.log('Using localStorage fallback for delete:', moduleName);
        const currentData = getLocalStorageData(moduleName);
        const filteredData = currentData.filter((item: any) => item.id !== id);
        setLocalStorageData(moduleName, filteredData);
        return { success: true };
    } catch (error) {
        console.error(`Error deleting from ${moduleName}:`, error);
        console.log('Falling back to localStorage');
        
        // Fallback to localStorage on error
        const currentData = getLocalStorageData(moduleName);
        const filteredData = currentData.filter((item: any) => item.id !== id);
        setLocalStorageData(moduleName, filteredData);
        return { success: true };
    }
};

// Fonction pour nettoyer les données sensibles de la mémoire
export const clearSensitiveData = () => {
    SessionManager.destroySession();
    CSRFProtection.clearToken();
    localStorage.clear();
    sessionStorage.clear();
};

// Fonction pour vérifier l'intégrité des données
export const verifyDataIntegrity = async (data: any, signature: string): Promise<boolean> => {
    try {
        const encoder = new TextEncoder();
        const dataString = JSON.stringify(data);
        const dataBuffer = encoder.encode(dataString);
        
        const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        
        return hashHex === signature;
    } catch (error) {
        console.error('Data integrity check failed:', error);
        return false;
    }
};

