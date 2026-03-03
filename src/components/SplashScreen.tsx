import { useState, useEffect } from 'react';
import { LOGOS } from '../utils/logoCache';
import { Loader2 } from 'lucide-react';

interface SplashScreenProps {
    onComplete: () => void;
}

const SplashScreen = ({ onComplete }: SplashScreenProps) => {
    const [progress, setProgress] = useState(0);
    const [loadingText, setLoadingText] = useState('Initialisation...');

    useEffect(() => {
        const steps = [
            { progress: 20, text: 'Chargement des modules...', delay: 300 },
            { progress: 40, text: 'Connexion au serveur...', delay: 500 },
            { progress: 60, text: 'Chargement des données...', delay: 400 },
            { progress: 80, text: 'Préparation de l\'interface...', delay: 300 },
            { progress: 100, text: 'Prêt!', delay: 200 }
        ];

        let currentStep = 0;

        const runStep = () => {
            if (currentStep < steps.length) {
                const step = steps[currentStep];
                setProgress(step.progress);
                setLoadingText(step.text);
                currentStep++;
                setTimeout(runStep, step.delay);
            } else {
                setTimeout(onComplete, 300);
            }
        };

        runStep();
    }, [onComplete]);

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999
        }}>
            {/* Logo animé */}
            <div style={{
                marginBottom: '3rem',
                animation: 'pulse 2s ease-in-out infinite'
            }}>
                <img 
                    src={LOGOS.main}
                    alt="Odin La Science" 
                    style={{ 
                        width: '120px', 
                        height: '120px',
                        filter: 'drop-shadow(0 0 30px rgba(59, 130, 246, 0.5))'
                    }} 
                />
            </div>

            {/* Titre */}
            <h1 style={{
                fontSize: '2.5rem',
                fontWeight: 900,
                marginBottom: '1rem',
                background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textAlign: 'center'
            }}>
                Odin La Science
            </h1>

            {/* Spinner */}
            <div style={{ marginBottom: '2rem' }}>
                <Loader2 
                    size={48} 
                    color="#3b82f6" 
                    style={{ 
                        animation: 'spin 1s linear infinite'
                    }} 
                />
            </div>

            {/* Texte de chargement */}
            <p style={{
                color: '#94a3b8',
                fontSize: '1.1rem',
                marginBottom: '2rem',
                textAlign: 'center'
            }}>
                {loadingText}
            </p>

            {/* Barre de progression */}
            <div style={{
                width: '400px',
                height: '6px',
                background: 'rgba(59, 130, 246, 0.1)',
                borderRadius: '3px',
                overflow: 'hidden',
                position: 'relative'
            }}>
                <div style={{
                    width: `${progress}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)',
                    borderRadius: '3px',
                    transition: 'width 0.3s ease-out',
                    boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)'
                }} />
            </div>

            {/* Pourcentage */}
            <p style={{
                color: '#3b82f6',
                fontSize: '0.9rem',
                marginTop: '1rem',
                fontWeight: 600
            }}>
                {progress}%
            </p>

            {/* Version */}
            <p style={{
                position: 'absolute',
                bottom: '2rem',
                color: '#64748b',
                fontSize: '0.85rem'
            }}>
                Version 1.0.0
            </p>

            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes pulse {
                    0%, 100% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.05); opacity: 0.8; }
                }
            `}</style>
        </div>
    );
};

export default SplashScreen;
