import { useState, useEffect } from 'react';
import { Target, Check, X, Trophy } from 'lucide-react';
import Confetti from 'react-confetti';

interface Mission {
    id: string;
    title: string;
    desc: string;
    completed: boolean;
}

const OnboardingMissions = ({ onComplete }: { onComplete: () => void }) => {
    const [missions, setMissions] = useState<Mission[]>([
        { id: 'home', title: 'Retour au bercail', desc: 'Utilisez Ctrl+H pour revenir à l\'accueil', completed: false },
        { id: 'settings', title: 'Maître des paramètres', desc: 'Accédez aux paramètres via Ctrl+S', completed: false },
        { id: 'hugin', title: 'Explorateur Hugin', desc: 'Ouvrez le module Hugin (Ctrl+U)', completed: false },
        { id: 'about', title: 'Curieux ?', desc: 'Visitez la page À propos (Ctrl+A)', completed: false }
    ]);
    const [showConfetti, setShowConfetti] = useState(false);
    const [isOpen, setIsOpen] = useState(true);

    const markComplete = (id: string) => {
        setMissions(prev => {
            const alreadyCompleted = prev.find(m => m.id === id)?.completed;
            if (alreadyCompleted) return prev;

            const newMissions = prev.map(m => m.id === id ? { ...m, completed: true } : m);
            const allCompleted = newMissions.every(m => m.completed);

            if (allCompleted) {
                setShowConfetti(true);
                setTimeout(() => {
                    // Logic to show alert or completion
                    // We can't really do alert() in a nice way, maybe just a console log or toast
                    if (onComplete) onComplete();
                }, 4000);
            }
            return newMissions;
        });
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.ctrlKey || e.altKey) {
                const key = e.key.toLowerCase();
                if (key === 'h') markComplete('home');
                if (key === 's') markComplete('settings');
                if (key === 'u') markComplete('hugin');
                if (key === 'a') markComplete('about');
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    if (!isOpen) return (
        <button
            onClick={() => setIsOpen(true)}
            style={{
                position: 'fixed', bottom: '20px', right: '20px',
                background: 'linear-gradient(135deg, #f1c40f, #e67e22)',
                border: 'none', borderRadius: '50%', width: '50px', height: '50px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 5px 15px rgba(0,0,0,0.3)', cursor: 'pointer', zIndex: 9999
            }}
        >
            <Trophy color="white" size={24} />
        </button>
    );

    return (
        <div style={{
            position: 'fixed', bottom: '20px', right: '20px',
            width: '320px', background: 'white', borderRadius: '15px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.2)', zIndex: 9999,
            overflow: 'hidden', fontFamily: "'Inter', sans-serif"
        }}>
            {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} style={{ position: 'fixed', top: 0, left: 0, zIndex: 10000 }} />}

            <div style={{
                background: 'linear-gradient(135deg, #8e44ad, #3498db)',
                padding: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 'bold' }}>
                    <Target size={20} />
                    Missions (Raccourcis)
                </div>
                <button onClick={() => setIsOpen(false)} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}>
                    <X size={20} />
                </button>
            </div>

            <div style={{ padding: '15px' }}>
                <p style={{ fontSize: '0.9rem', color: '#7f8c8d', marginBottom: '15px' }}>
                    Complétez ces missions pour maîtriser la navigation rapide !
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {missions.map(mission => (
                        <div key={mission.id} style={{
                            display: 'flex', alignItems: 'center', gap: '10px',
                            padding: '10px', borderRadius: '10px',
                            background: mission.completed ? 'rgba(46, 204, 113, 0.1)' : '#f8f9fa',
                            border: `1px solid ${mission.completed ? '#2ecc71' : '#eee'}`
                        }}>
                            <div style={{
                                width: '24px', height: '24px', borderRadius: '50%',
                                background: mission.completed ? '#2ecc71' : '#bdc3c7',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                            }}>
                                {mission.completed && <Check size={14} color="white" />}
                            </div>
                            <div>
                                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: mission.completed ? '#27ae60' : '#34495e', textDecoration: mission.completed ? 'line-through' : 'none' }}>
                                    {mission.title}
                                </div>
                                <div style={{ fontSize: '0.8rem', color: '#95a5a6' }}>{mission.desc}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div style={{ padding: '10px', background: '#f1f2f6', borderTop: '1px solid #e0e0e0', textAlign: 'center', fontSize: '0.8rem', color: '#7f8c8d' }}>
                {missions.filter(m => m.completed).length} / {missions.length} accomplies
            </div>
        </div>
    );
};

export default OnboardingMissions;
