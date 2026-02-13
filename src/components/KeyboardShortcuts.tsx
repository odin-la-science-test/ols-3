import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Command, X } from 'lucide-react';

const KeyboardShortcuts = () => {
    const navigate = useNavigate();
    const [showHelp, setShowHelp] = useState(false);

    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key.toLowerCase()) {
                    case 'r':
                        e.preventDefault();
                        setShowHelp(!showHelp);
                        break;
                    case 'h':
                        e.preventDefault();
                        navigate('/home');
                        break;
                    case 'm':
                        e.preventDefault();
                        navigate('/munin');
                        break;
                    case 'l':
                        e.preventDefault();
                        navigate('/hugin');
                        break;
                    case 's':
                        e.preventDefault();
                        navigate('/settings');
                        break;
                }
            }

            if (e.key === 'Escape') {
                setShowHelp(false);
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [navigate, showHelp]);

    const shortcuts = [
        { keys: ['Ctrl', 'R'], description: 'Afficher/Masquer les raccourcis' },
        { keys: ['Ctrl', 'H'], description: 'Aller à l\'accueil' },
        { keys: ['Ctrl', 'M'], description: 'Ouvrir Munin Atlas' },
        { keys: ['Ctrl', 'L'], description: 'Ouvrir Hugin Lab' },
        { keys: ['Ctrl', 'S'], description: 'Ouvrir les paramètres' },
        { keys: ['Esc'], description: 'Fermer les dialogues' }
    ];

    if (!showHelp) return null;

    return (
        <>
            <div
                onClick={() => setShowHelp(false)}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0, 0, 0, 0.7)',
                    backdropFilter: 'blur(4px)',
                    zIndex: 9998
                }}
            />
            <div style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '90%',
                maxWidth: '600px',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                borderRadius: '1rem',
                boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                zIndex: 9999,
                padding: '2rem'
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '1.5rem'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Command size={24} color="var(--accent-hugin)" />
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>
                            Raccourcis Clavier
                        </h2>
                    </div>
                    <button
                        onClick={() => setShowHelp(false)}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--text-secondary)',
                            cursor: 'pointer',
                            padding: '0.5rem'
                        }}
                    >
                        <X size={24} />
                    </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {shortcuts.map((shortcut, i) => (
                        <div
                            key={i}
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '1rem',
                                background: 'rgba(255, 255, 255, 0.03)',
                                borderRadius: '0.5rem',
                                border: '1px solid var(--border-color)'
                            }}
                        >
                            <span style={{ color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                                {shortcut.description}
                            </span>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                {shortcut.keys.map((key, j) => (
                                    <kbd
                                        key={j}
                                        style={{
                                            padding: '0.25rem 0.75rem',
                                            background: 'var(--bg-primary)',
                                            border: '1px solid var(--border-color)',
                                            borderRadius: '0.375rem',
                                            fontSize: '0.85rem',
                                            fontWeight: 600,
                                            color: 'var(--accent-hugin)',
                                            fontFamily: 'monospace',
                                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                                        }}
                                    >
                                        {key}
                                    </kbd>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div style={{
                    marginTop: '1.5rem',
                    padding: '1rem',
                    background: 'rgba(99, 102, 241, 0.1)',
                    border: '1px solid rgba(99, 102, 241, 0.3)',
                    borderRadius: '0.5rem',
                    fontSize: '0.85rem',
                    color: 'var(--text-secondary)'
                }}>
                    💡 Astuce : Utilisez <kbd style={{
                        padding: '0.125rem 0.5rem',
                        background: 'var(--bg-primary)',
                        borderRadius: '0.25rem',
                        fontFamily: 'monospace',
                        color: 'var(--accent-hugin)'
                    }}>Ctrl+R</kbd> à tout moment pour afficher cette aide
                </div>
            </div>
        </>
    );
};

export default KeyboardShortcuts;
