import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const ShortcutManager: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // We use 'g' as a prefix for "Go to" shortcuts
            const isInput = e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement;
            if (isInput) return;

            if (e.key.toLowerCase() === 'h' && (e.ctrlKey || e.altKey)) {
                e.preventDefault();
                navigate('/home');
            }
            if (e.key.toLowerCase() === 's' && (e.ctrlKey || e.altKey)) {
                e.preventDefault();
                navigate('/settings');
            }
            if (e.key.toLowerCase() === 'u' && (e.ctrlKey || e.altKey)) {
                e.preventDefault();
                navigate('/hugin');
            }
            if (e.key.toLowerCase() === 'l' && (e.ctrlKey || e.altKey)) {
                e.preventDefault();
                navigate('/login');
            }
            if (e.key.toLowerCase() === 'a' && (e.ctrlKey || e.altKey)) {
                e.preventDefault();
                navigate('/about');
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [navigate]);

    return null; // This component doesn't render anything
};

export default ShortcutManager;
