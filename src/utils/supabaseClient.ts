import { createClient } from '@supabase/supabase-js';

// Configuration Supabase depuis les variables d'environnement
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Créer le client Supabase
export const supabase = supabaseUrl && supabaseAnonKey 
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

// Vérifier si Supabase est configuré
export const isSupabaseConfigured = (): boolean => {
    return supabase !== null;
};

// Mapping des noms de modules vers les tables Supabase
const MODULE_TABLE_MAP: Record<string, string> = {
    'messaging': 'messages',
    'research_archives': 'research_archives',
    'research_watchlist': 'research_watchlist',
    'planning': 'planning_events',
    'inventory': 'inventory_items',
    'cultures': 'culture_tracking',
    'documents': 'documents',
    'it_archives': 'it_archives',
    'meeting_signals': 'meeting_signals'
};

// Obtenir le nom de la table pour un module
export const getTableName = (moduleName: string): string => {
    return MODULE_TABLE_MAP[moduleName] || moduleName;
};

// Obtenir l'email de l'utilisateur connecté
export const getCurrentUserEmail = (): string => {
    try {
        const userStr = localStorage.getItem('currentUser');
        if (!userStr) return 'anonymous@ols.com';
        
        const user = JSON.parse(userStr);
        return user.email || 'anonymous@ols.com';
    } catch (error) {
        console.error('Error getting current user email:', error);
        return 'anonymous@ols.com';
    }
};
