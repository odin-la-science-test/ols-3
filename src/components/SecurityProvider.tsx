import React, { createContext, useContext, useEffect, useState } from 'react';
import { SessionManager, CSRFProtection, RateLimiter } from '../utils/encryption';

interface SecurityContextType {
    isAuthenticated: boolean;
    login: (userId: string) => void;
    logout: () => void;
    checkRateLimit: (action: string) => boolean;
}

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

const loginLimiter = new RateLimiter(5, 60000); // 5 tentatives par minute
const apiLimiter = new RateLimiter(100, 60000); // 100 requêtes par minute

export const SecurityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        // Vérifier la session au chargement
        const isValid = SessionManager.validateSession();
        setIsAuthenticated(isValid);

        // Générer un token CSRF
        if (!CSRFProtection.getToken()) {
            CSRFProtection.generateToken();
        }

        // Rafraîchir la session toutes les 5 minutes
        const interval = setInterval(() => {
            if (SessionManager.validateSession()) {
                SessionManager.refreshSession();
            } else {
                setIsAuthenticated(false);
            }
        }, 5 * 60 * 1000);

        // Nettoyer à la fermeture de la page
        const handleBeforeUnload = () => {
            // Ne pas détruire la session, juste rafraîchir
            if (SessionManager.validateSession()) {
                SessionManager.refreshSession();
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            clearInterval(interval);
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);

    // Détecter l'inactivité
    useEffect(() => {
        let inactivityTimer: number;
        const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes

        const resetTimer = () => {
            clearTimeout(inactivityTimer);
            inactivityTimer = setTimeout(() => {
                if (isAuthenticated) {
                    logout();
                    alert('Session expirée pour cause d\'inactivité');
                }
            }, INACTIVITY_TIMEOUT);
        };

        const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
        events.forEach(event => {
            document.addEventListener(event, resetTimer);
        });

        resetTimer();

        return () => {
            clearTimeout(inactivityTimer);
            events.forEach(event => {
                document.removeEventListener(event, resetTimer);
            });
        };
    }, [isAuthenticated]);

    const login = (userId: string) => {
        SessionManager.createSession(userId);
        CSRFProtection.generateToken();
        setIsAuthenticated(true);
    };

    const logout = () => {
        SessionManager.destroySession();
        CSRFProtection.clearToken();
        setIsAuthenticated(false);
        
        // Nettoyer toutes les données sensibles
        localStorage.clear();
        sessionStorage.clear();
        
        // Rediriger vers la page de connexion
        window.location.href = '/login';
    };

    const checkRateLimit = (action: string): boolean => {
        const limiter = action === 'login' ? loginLimiter : apiLimiter;
        const userId = SessionManager.getSessionData()?.userId || 'anonymous';
        return limiter.checkLimit(`${userId}:${action}`);
    };

    return (
        <SecurityContext.Provider value={{ isAuthenticated, login, logout, checkRateLimit }}>
            {children}
        </SecurityContext.Provider>
    );
};

export const useSecurity = () => {
    const context = useContext(SecurityContext);
    if (!context) {
        throw new Error('useSecurity must be used within SecurityProvider');
    }
    return context;
};

export default SecurityProvider;
