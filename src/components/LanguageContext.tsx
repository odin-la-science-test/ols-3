import { createContext, useContext, useState, type ReactNode } from 'react';

export type Language = 'FR' | 'EN' | 'ES' | 'DE' | 'HU' | 'ZH' | 'IT' | 'PT' | 'RU' | 'JP' | 'AR' | 'KO';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

import { translations } from '../translations';

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
    const [language, setLanguageState] = useState<Language>(() => {
        const saved = localStorage.getItem('hugin_lang');
        return (saved as Language) || 'FR';
    });

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem('hugin_lang', lang);
    };

    const t = (key: string): string => {
        const keys = key.split('.');
        let current: any = translations[language];

        for (const k of keys) {
            if (current && current[k]) {
                current = current[k];
            } else {
                return key; // Return key if translation not found
            }
        }

        return current;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
