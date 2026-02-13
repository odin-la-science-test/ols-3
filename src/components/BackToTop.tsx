import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { useTheme } from './ThemeContext';

const BackToTop = () => {
    const { theme } = useTheme();
    const c = theme.colors;
    const [isVisible, setIsVisible] = useState(false);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.pageYOffset > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            // Check for Ctrl + X
            if (event.ctrlKey && (event.key === 'x' || event.key === 'X')) {
                event.preventDefault();
                scrollToTop();
            }
        };

        window.addEventListener('scroll', toggleVisibility);
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('scroll', toggleVisibility);
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    if (!isVisible) {
        return null;
    }

    return (
        <button
            onClick={scrollToTop}
            title="Retour en haut (Ctrl + X)"
            style={{
                position: 'fixed',
                bottom: '30px',
                right: '30px',
                zIndex: 1000,
                padding: '12px',
                borderRadius: '50%',
                background: c.accentPrimary,
                color: 'white',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease',
                transform: isVisible ? 'scale(1)' : 'scale(0)',
                opacity: isVisible ? 1 : 0
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = `0 8px 25px ${c.accentPrimary}66`;
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.3)';
            }}
        >
            <ArrowUp size={24} />
        </button>
    );
};

export default BackToTop;
