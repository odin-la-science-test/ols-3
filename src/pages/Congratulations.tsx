import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Star, ArrowLeft, Download, PartyPopper } from 'lucide-react';
import { useTheme } from '../components/ThemeContext';
import PageLayout from '../components/PageLayout';

const Congratulations = () => {
    const { theme } = useTheme();
    const c = theme.colors;
    const navigate = useNavigate();
    const [confetti, setConfetti] = useState<any[]>([]);

    useEffect(() => {
        // Simple confetti effect
        const items = Array.from({ length: 50 }).map((_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: -10,
            size: Math.random() * 10 + 5,
            color: [c.accentPrimary, c.accentHugin, c.accentMunin][Math.floor(Math.random() * 3)],
            delay: Math.random() * 5,
            duration: Math.random() * 3 + 2
        }));
        setConfetti(items);
    }, [c]);

    return (
        <PageLayout>
            <div style={{
                minHeight: '80vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2rem',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {confetti.map(p => (
                    <div key={p.id} style={{
                        position: 'absolute',
                        left: `${p.x}%`,
                        top: `${p.y}%`,
                        width: `${p.size}px`,
                        height: `${p.size}px`,
                        background: p.color,
                        borderRadius: '50%',
                        opacity: 0.6,
                        animation: `fall ${p.duration}s linear ${p.delay}s infinite`
                    }} />
                ))}

                <style>{`
                    @keyframes fall {
                        to { transform: translateY(120vh) rotate(360deg); }
                    }
                    @keyframes celebrate {
                        0% { transform: scale(1); }
                        50% { transform: scale(1.1); }
                        100% { transform: scale(1); }
                    }
                `}</style>

                <div className="glass-panel" style={{
                    padding: '4rem',
                    borderRadius: '2rem',
                    maxWidth: '800px',
                    width: '100%',
                    border: `1px solid ${c.borderColor}`,
                    position: 'relative',
                    zIndex: 1,
                    background: 'rgba(255,255,255,0.02)',
                    backdropFilter: 'blur(20px)'
                }}>
                    <div style={{ marginBottom: '2rem', animation: 'celebrate 2s infinite' }}>
                        <Trophy size={100} color={c.accentPrimary} style={{ filter: `drop-shadow(0 0 20px ${c.accentPrimary})` }} />
                    </div>

                    <h1 className="text-gradient" style={{ fontSize: '3.5rem', fontWeight: 900, marginBottom: '1rem' }}>
                        Expert Tracker Détecté !
                    </h1>

                    <p style={{ fontSize: '1.4rem', color: c.textSecondary, marginBottom: '2rem', lineHeight: 1.6 }}>
                        Félicitations ! Vous avez découvert l'accès secret d'Odin.
                        Peu de chercheurs ont la patience et la curiosité nécessaires pour remonter le flux jusqu'à la source.
                    </p>

                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1.5rem',
                        alignItems: 'center',
                        marginTop: '3rem'
                    }}>
                        <div style={{
                            padding: '1.5rem',
                            background: 'rgba(255,255,255,0.05)',
                            borderRadius: '1.5rem',
                            border: `1px dashed ${c.borderColor}`,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem'
                        }}>
                            <Star color="#ffd700" fill="#ffd700" size={32} />
                            <div style={{ textAlign: 'left' }}>
                                <div style={{ fontWeight: 800, fontSize: '1.2rem' }}>Badge : Expert Curiosité</div>
                                <div style={{ color: c.textSecondary, fontSize: '0.9rem' }}>Niveau 1 débloqué</div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                            <button onClick={() => navigate('/')} style={{
                                padding: '1rem 2rem',
                                borderRadius: '1rem',
                                border: `1px solid ${c.borderColor}`,
                                background: 'transparent',
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                cursor: 'pointer',
                                transition: 'all 0.3s'
                            }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                <ArrowLeft size={20} /> Retour
                            </button>

                            <button style={{
                                padding: '1rem 2rem',
                                borderRadius: '1rem',
                                border: 'none',
                                background: `linear-gradient(135deg, ${c.accentPrimary}, ${c.accentHugin})`,
                                color: 'white',
                                fontWeight: 700,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                cursor: 'pointer',
                                boxShadow: `0 10px 20px ${c.accentPrimary}33`
                            }}>
                                <Download size={20} /> Certificat OLS <PartyPopper size={20} />
                            </button>
                        </div>
                    </div>

                    <div style={{ marginTop: '3rem', fontSize: '0.9rem', color: c.textSecondary, opacity: 0.5 }}>
                        Code Promo Secret : <span style={{ fontFamily: 'monospace', fontWeight: 800, color: c.accentPrimary }}>ODIN-LEGACY-2026</span>
                    </div>
                </div>
            </div>
        </PageLayout>
    );
};

export default Congratulations;
