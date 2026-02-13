import { SessionManager, CSRFProtection } from './encryption';
import { supabase, isSupabaseConfigured, getTableName, getCurrentUserEmail } from './supabaseClient';

const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
const API_BASE_URL = isProduction 
    ? 'https://odin-la-science.infinityfree.me'
    : 'http://localhost:3001';

// Vérifier si le serveur backend est disponible
let serverAvailable: boolean | null = null;

const checkServerAvailability = async (): Promise<boolean> => {
    if (serverAvailable !== null) return serverAvailable;
    
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000); // 2s timeout
        
        const response = await fetch(`${API_BASE_URL}/api/health`, {
            signal: controller.signal,
            headers: { 'Content-Type': 'application/json' }
        });
        
        clearTimeout(timeoutId);
        serverAvailable = response.ok;
        return serverAvailable;
    } catch (error) {
        console.log('Backend server not available');
        serverAvailable = false;
        return false;
    }
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
        
        const { data, error } = await supabase
            .from(tableName)
            .select('*')
            .eq('user_email', userEmail)
            .order('created_at', { ascending: false });
        
        if (error) {
            console.error('Supabase fetch error:', error);
            return [];
        }
        
        return data || [];
    } catch (error) {
        console.error('Error fetching from Supabase:', error);
        return [];
    }
};

const saveToSupabase = async (moduleName: string, item: any): Promise<any> => {
    if (!supabase) return null;
    
    try {
        const tableName = getTableName(moduleName);
        const userEmail = getCurrentUserEmail();
        
        // Ajouter l'email de l'utilisateur
        const itemWithUser = {
            ...item,
            user_email: userEmail
        };
        
        // Si l'item a un ID, c'est une mise à jour
        if (item.id) {
            const { data, error } = await supabase
                .from(tableName)
                .upsert(itemWithUser)
                .select()
                .single();
            
            if (error) {
                console.error('Supabase upsert error:', error);
                return null;
            }
            
            return data;
        } else {
            // Sinon, c'est une insertion
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
        }
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
        
        // Priorité 1: Supabase si configuré
        if (isSupabaseConfigured()) {
            console.log('Using Supabase for:', moduleName);
            const data = await fetchFromSupabase(moduleName);
            if (data.length > 0 || data.length === 0) {
                return data;
            }
        }
        
        // Priorité 2: Backend server
        const isServerAvailable = await checkServerAvailability();
        
        if (isServerAvailable) {
            const response = await fetch(`${API_BASE_URL}/api/module/${moduleName}`, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                console.log('Fetch successful from backend, items:', data.length);
                return data;
            }
        }
        
        // Priorité 3: localStorage fallback
        console.log('Using localStorage fallback for:', moduleName);
        return getLocalStorageData(moduleName);
    } catch (error) {
        console.error(`Error fetching ${moduleName}:`, error);
        console.log('Falling back to localStorage');
        return getLocalStorageData(moduleName);
    }
};

export const saveModuleItem = async (moduleName: string, item: any) => {
    try {
        console.log('saveModuleItem called with:', moduleName, item);
        
        // Priorité 1: Supabase si configuré
        if (isSupabaseConfigured()) {
            console.log('Using Supabase for save:', moduleName);
            const result = await saveToSupabase(moduleName, item);
            if (result) {
                return { success: true, id: result.id, data: result };
            }
        }
        
        // Priorité 2: Backend server
        const isServerAvailable = await checkServerAvailability();
        
        if (isServerAvailable) {
            const response = await fetch(`${API_BASE_URL}/api/module/${moduleName}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(item)
            });
            
            if (response.ok) {
                const result = await response.json();
                console.log('Save successful to backend:', result);
                return result;
            }
        }
        
        // Priorité 3: localStorage fallback
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
        
        // Priorité 1: Supabase si configuré
        if (isSupabaseConfigured()) {
            console.log('Using Supabase for delete:', moduleName);
            const success = await deleteFromSupabase(moduleName, id.toString());
            if (success) {
                return { success: true };
            }
        }
        
        // Priorité 2: Backend server
        const isServerAvailable = await checkServerAvailability();
        
        if (isServerAvailable) {
            const response = await fetch(`${API_BASE_URL}/api/module/${moduleName}/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            
            if (response.ok) {
                const result = await response.json();
                console.log('Delete successful from backend:', result);
                return result;
            }
        }
        
        // Priorité 3: localStorage fallback
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

