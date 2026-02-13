import { encryptData, decryptData, SessionManager, CSRFProtection, sanitizeInput } from './encryption';

// Détection automatique de l'environnement
const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
const API_BASE_URL = isProduction 
    ? 'https://odin-la-science.infinityfree.me'
    : 'http://localhost:3001';

// Clé de cryptage dérivée de la session utilisateur
const getEncryptionKey = (): string => {
    const sessionData = SessionManager.getSessionData();
    if (!sessionData) {
        throw new Error('No active session');
    }
    return sessionData.token;
};

// Headers sécurisés pour toutes les requêtes
const getSecureHeaders = (): HeadersInit => {
    const csrfToken = CSRFProtection.getToken() || CSRFProtection.generateToken();
    const sessionData = SessionManager.getSessionData();
    
    return {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken,
        'Authorization': sessionData ? `Bearer ${sessionData.token}` : '',
        'X-Requested-With': 'XMLHttpRequest'
    };
};

export const fetchModuleData = async (moduleName: string) => {
    try {
        console.log('fetchModuleData called for:', moduleName);
        
        const response = await fetch(`${API_BASE_URL}/api/module/${moduleName}`, {
            headers: {
                'Content-Type': 'application/json',
            }
        });
        
        if (!response.ok) {
            console.error('Fetch failed with status:', response.status);
            throw new Error(`Failed to fetch data for ${moduleName}`);
        }
        
        const data = await response.json();
        console.log('Fetch successful, items:', data.length);
        return data;
    } catch (error) {
        console.error(`Error fetching ${moduleName}:`, error);
        return [];
    }
};

export const saveModuleItem = async (moduleName: string, item: any) => {
    try {
        console.log('saveModuleItem called with:', moduleName, item);
        
        // Envoyer directement sans cryptage pour le développement
        const response = await fetch(`${API_BASE_URL}/api/module/${moduleName}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(item)
        });
        
        console.log('Response status:', response.status);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Response error:', errorText);
            throw new Error(`Failed to save item for ${moduleName}: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('Save successful:', result);
        return result;
    } catch (error) {
        console.error(`Error saving to ${moduleName}:`, error);
        throw error;
    }
};

export const deleteModuleItem = async (moduleName: string, id: string | number) => {
    try {
        console.log('deleteModuleItem called:', moduleName, id);
        
        const response = await fetch(`${API_BASE_URL}/api/module/${moduleName}/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        
        if (!response.ok) {
            throw new Error(`Failed to delete item from ${moduleName}`);
        }
        
        const result = await response.json();
        console.log('Delete successful:', result);
        return result;
    } catch (error) {
        console.error(`Error deleting from ${moduleName}:`, error);
        throw error;
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

