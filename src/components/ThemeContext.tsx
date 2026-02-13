import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export type ThemeName = 'cosmic-glass' | 'neumorphic-soft' | 'brutalist-minimal' | 'cyberpunk-neon' | 'botanical-journal';

export interface DesignSystem {
    // Typography
    fontFamily: string;
    fontWeightNormal: number;
    fontWeightBold: number;

    // Spacing & Sizing
    borderRadius: string;
    spacing: string;

    // Visual Effects
    shadowStyle: 'glow' | 'soft' | 'none';
    effectStyle: 'blur' | 'emboss' | 'flat';

    // Component Styles
    buttonStyle: 'glass' | 'neumorphic' | 'brutalist';
    cardStyle: 'glass' | 'neumorphic' | 'brutalist';
    inputStyle: 'glass' | 'neumorphic' | 'brutalist';
}

export interface Theme {
    name: ThemeName;
    label: string;
    description: string;
    designSystem: DesignSystem;
    colors: {
        // Backgrounds
        bgPrimary: string;
        bgSecondary: string;
        bgTertiary: string;

        // Text
        textPrimary: string;
        textSecondary: string;

        // Accents
        accentPrimary: string;
        accentSecondary: string;
        accentMunin: string;
        accentHugin: string;

        // UI Elements
        borderColor: string;
        cardBg: string;
        inputBg: string;

        // Gradients
        gradientStart: string;
        gradientEnd: string;

        // Design-specific
        shadowColor?: string;
        glowColor?: string;
    };
}

const themes: Record<ThemeName, Theme> = {
    'cosmic-glass': {
        name: 'cosmic-glass',
        label: 'Cosmic Glass',
        description: 'Glassmorphism with transparent layers and blur effects',
        designSystem: {
            fontFamily: "'Inter', sans-serif",
            fontWeightNormal: 400,
            fontWeightBold: 600,
            borderRadius: '1.5rem',
            spacing: '1.5rem',
            shadowStyle: 'glow',
            effectStyle: 'blur',
            buttonStyle: 'glass',
            cardStyle: 'glass',
            inputStyle: 'glass',
        },
        colors: {
            bgPrimary: '#0a0e27',
            bgSecondary: 'rgba(255, 255, 255, 0.05)',
            bgTertiary: 'rgba(255, 255, 255, 0.1)',
            textPrimary: '#ffffff',
            textSecondary: 'rgba(255, 255, 255, 0.7)',
            accentPrimary: '#6366f1',
            accentSecondary: '#8b5cf6',
            accentMunin: '#10b981',
            accentHugin: '#6366f1',
            borderColor: 'rgba(255, 255, 255, 0.2)',
            cardBg: 'rgba(255, 255, 255, 0.08)',
            inputBg: 'rgba(255, 255, 255, 0.05)',
            gradientStart: '#6366f1',
            gradientEnd: '#8b5cf6',
            glowColor: 'rgba(99, 102, 241, 0.5)',
        }
    },
    'neumorphic-soft': {
        name: 'neumorphic-soft',
        label: 'Neumorphic Soft',
        description: 'Soft 3D UI with tactile shadows and embossed elements',
        designSystem: {
            fontFamily: "'Poppins', sans-serif",
            fontWeightNormal: 400,
            fontWeightBold: 600,
            borderRadius: '2rem',
            spacing: '2rem',
            shadowStyle: 'soft',
            effectStyle: 'emboss',
            buttonStyle: 'neumorphic',
            cardStyle: 'neumorphic',
            inputStyle: 'neumorphic',
        },
        colors: {
            bgPrimary: '#e0e5ec',
            bgSecondary: '#e0e5ec',
            bgTertiary: '#e0e5ec',
            textPrimary: '#4a5568',
            textSecondary: '#718096',
            accentPrimary: '#667eea',
            accentSecondary: '#764ba2',
            accentMunin: '#48bb78',
            accentHugin: '#667eea',
            borderColor: 'transparent',
            cardBg: '#e0e5ec',
            inputBg: '#e0e5ec',
            gradientStart: '#667eea',
            gradientEnd: '#764ba2',
            shadowColor: '#a3b1c6',
        }
    },
    'brutalist-minimal': {
        name: 'brutalist-minimal',
        label: 'Brutalist Minimal',
        description: 'Raw, stark design with high contrast and no decoration',
        designSystem: {
            fontFamily: "'JetBrains Mono', monospace",
            fontWeightNormal: 400,
            fontWeightBold: 700,
            borderRadius: '0',
            spacing: '1rem',
            shadowStyle: 'none',
            effectStyle: 'flat',
            buttonStyle: 'brutalist',
            cardStyle: 'brutalist',
            inputStyle: 'brutalist',
        },
        colors: {
            bgPrimary: '#ffffff',
            bgSecondary: '#f5f5f5',
            bgTertiary: '#e5e5e5',
            textPrimary: '#000000',
            textSecondary: '#666666',
            accentPrimary: '#000000',
            accentSecondary: '#333333',
            accentMunin: '#000000',
            accentHugin: '#000000',
            borderColor: '#000000',
            cardBg: '#ffffff',
            inputBg: '#ffffff',
            gradientStart: '#000000',
            gradientEnd: '#000000',
        }
    },
    'cyberpunk-neon': {
        name: 'cyberpunk-neon',
        label: 'Cyberpunk Neon',
        description: 'High-tech dystopian future with vibrant neon accents',
        designSystem: {
            fontFamily: "'Orbitron', sans-serif",
            fontWeightNormal: 400,
            fontWeightBold: 700,
            borderRadius: '0.25rem',
            spacing: '1.5rem',
            shadowStyle: 'glow',
            effectStyle: 'flat', // Uses glow via CSS
            buttonStyle: 'brutalist', // Sharp edges
            cardStyle: 'glass', // Semi-transparent
            inputStyle: 'glass',
        },
        colors: {
            bgPrimary: '#050510', // Deep black/blue
            bgSecondary: '#0a0a1f',
            bgTertiary: '#12122b',
            textPrimary: '#00ff41', // Matrix green or Neon cyan? Let's verify.. User wants NO commonality. Let's go Neon Pink/Cyan.
            // Let's use Cyan/Magenta for high contrast
            textSecondary: '#a0a0ff',
            accentPrimary: '#ff00ff', // Magenta
            accentSecondary: '#00ffff', // Cyan
            accentMunin: '#00ff00', // Neon Green
            accentHugin: '#ff00ff', // Neon Pink
            borderColor: '#ff00ff', // Vivid borders
            cardBg: 'rgba(5, 5, 16, 0.8)',
            inputBg: 'rgba(10, 10, 31, 0.8)',
            gradientStart: '#ff00ff',
            gradientEnd: '#00ffff',
            glowColor: '#ff00ff',
            shadowColor: '#00ffff',
        }
    },
    'botanical-journal': {
        name: 'botanical-journal',
        label: 'Botanical Journal',
        description: 'Organic, paper-textured design with serif typography',
        designSystem: {
            fontFamily: "'Playfair Display', serif", // Headings
            // We'll set body font in CSS if needed or rely on fallback?
            // Actually, let's use Playfair for headings and Lato for body via CSS overrides if possible,
            // or just use a nice serif/sans pairing here.
            // Let's stick with Playfair as the primary font variable for now, or maybe Lato as primary and Playfair as headers manually?
            // The prompt says "fontFamily" variable. Let's use 'Lato', sans-serif for UI readability, and use Playfair for headers in CSS.
            // Or just allow serif UI. Serif UI is very "journal". Let's try 'Lato', sans-serif for readability and override headers.
            // Wait, ThemeContext defines one fontFamily. Let's use 'Lato', sans-serif to be safe, visually distinct.
            fontWeightNormal: 400,
            fontWeightBold: 700,
            borderRadius: '1rem', // Soft corners
            spacing: '2rem',
            shadowStyle: 'soft',
            effectStyle: 'emboss', // Texture feel
            buttonStyle: 'neumorphic', // Soft touch
            cardStyle: 'neumorphic',
            inputStyle: 'neumorphic',
        },
        colors: {
            bgPrimary: '#fdfbf7', // Warm paper
            bgSecondary: '#f4f1ea',
            bgTertiary: '#e9e5dc',
            textPrimary: '#2d3a2d', // Dark forest green
            textSecondary: '#5d4037', // Earthy brown
            accentPrimary: '#4a6741', // Muted Green
            accentSecondary: '#8c6b5d', // Muted Terracotta
            accentMunin: '#556b2f', // Dark Olive Green
            accentHugin: '#8b4513', // Saddle Brown
            borderColor: '#dcd7cd',
            cardBg: '#fffefb',
            inputBg: '#fcfaf5',
            gradientStart: '#4a6741',
            gradientEnd: '#8c6b5d',
            shadowColor: '#d6d2c4',
            glowColor: 'transparent',
        }
    }

};

interface ThemeContextType {
    currentTheme: ThemeName;
    theme: Theme;
    setTheme: (theme: ThemeName) => void;
    themes: Record<ThemeName, Theme>;
    loadThemeForUser: (username: string | null) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [currentTheme, setCurrentTheme] = useState<ThemeName>(() => {
        // Initial load: check for logged in user first, then device default
        const currentUser = localStorage.getItem('currentUser');
        if (currentUser) {
            const userTheme = localStorage.getItem(`theme_${currentUser}`);
            if (userTheme && themes[userTheme as ThemeName]) {
                return userTheme as ThemeName;
            }
        }

        const saved = localStorage.getItem('selectedTheme');
        // Validate that the saved theme exists
        if (saved && themes[saved as ThemeName]) {
            return saved as ThemeName;
        }
        return 'cosmic-glass';
    });

    useEffect(() => {
        const theme = themes[currentTheme];
        const root = document.documentElement;

        // Apply CSS variables
        root.style.setProperty('--bg-primary', theme.colors.bgPrimary);
        root.style.setProperty('--bg-secondary', theme.colors.bgSecondary);
        root.style.setProperty('--bg-tertiary', theme.colors.bgTertiary);
        root.style.setProperty('--text-primary', theme.colors.textPrimary);
        root.style.setProperty('--text-secondary', theme.colors.textSecondary);
        root.style.setProperty('--accent-primary', theme.colors.accentPrimary);
        root.style.setProperty('--accent-secondary', theme.colors.accentSecondary);
        root.style.setProperty('--accent-munin', theme.colors.accentMunin);
        root.style.setProperty('--accent-hugin', theme.colors.accentHugin);
        root.style.setProperty('--border-color', theme.colors.borderColor);
        root.style.setProperty('--card-bg', theme.colors.cardBg);
        root.style.setProperty('--input-bg', theme.colors.inputBg);
        root.style.setProperty('--gradient-start', theme.colors.gradientStart);
        root.style.setProperty('--gradient-end', theme.colors.gradientEnd);

        // Apply design system variables
        root.style.setProperty('--font-family', theme.designSystem.fontFamily);
        root.style.setProperty('--font-weight-normal', theme.designSystem.fontWeightNormal.toString());
        root.style.setProperty('--font-weight-bold', theme.designSystem.fontWeightBold.toString());
        root.style.setProperty('--border-radius', theme.designSystem.borderRadius);
        root.style.setProperty('--spacing', theme.designSystem.spacing);

        // Apply design-specific colors
        if (theme.colors.shadowColor) {
            root.style.setProperty('--shadow-color', theme.colors.shadowColor);
        } else {
            root.style.removeProperty('--shadow-color');
        }
        if (theme.colors.glowColor) {
            root.style.setProperty('--glow-color', theme.colors.glowColor);
        } else {
            root.style.removeProperty('--glow-color');
        }

        // Set data attribute for CSS targeting
        root.setAttribute('data-theme', currentTheme);

        // Save to localStorage
        // Always save to device preference for fallback
        localStorage.setItem('selectedTheme', currentTheme);

        // If user is logged in, save to their profile
        const currentUser = localStorage.getItem('currentUser');
        if (currentUser) {
            localStorage.setItem(`theme_${currentUser}`, currentTheme);
        }

    }, [currentTheme]);

    const setTheme = (theme: ThemeName) => {
        setCurrentTheme(theme);
    };

    const loadThemeForUser = (username: string | null) => {
        if (username) {
            const userTheme = localStorage.getItem(`theme_${username}`);
            if (userTheme && themes[userTheme as ThemeName]) {
                setCurrentTheme(userTheme as ThemeName);
            } else {
                // Keep current if new user
            }
        } else {
            // User logged out, revert to device default
            const deviceTheme = localStorage.getItem('selectedTheme');
            if (deviceTheme && themes[deviceTheme as ThemeName]) {
                setCurrentTheme(deviceTheme as ThemeName);
            }
        }
    }

    return (
        <ThemeContext.Provider value={{ currentTheme, theme: themes[currentTheme], setTheme, themes, loadThemeForUser }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider');
    }
    return context;
};
