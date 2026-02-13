import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Camera, ChevronLeft, Upload
} from 'lucide-react';
import { useToast } from '../../components/ToastContext';

const ColonyVision = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [image, setImage] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [coloniesCount, setColoniesCount] = useState<number | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setImage(event.target?.result as string);
                setColoniesCount(null);
                showToast('Image chargée', 'success');
            };
            reader.readAsDataURL(file);
        }
    };

    const processImage = () => {
        if (!image) return;
        setIsProcessing(true);

        setTimeout(() => {
            const mockCount = Math.floor(Math.random() * 150) + 20;
            setColoniesCount(mockCount);
            setIsProcessing(false);
            showToast('Analyse terminée', 'success');
        }, 2000);
    };

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', color: 'white', display: 'flex', flexDirection: 'column' }}>
            <header className="glass-panel" style={{ padding: '1.5rem 2rem', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <button onClick={() => navigate('/hugin')} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: 'inherit', padding: '0.6rem', borderRadius: '0.75rem', cursor: 'pointer' }}>
                        <ChevronLeft size={20} />
                    </button>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ padding: '0.75rem', background: 'rgba(16, 185, 129, 0.2)', borderRadius: '1rem', color: '#10b981' }}>
                            <Camera size={24} />
                        </div>
                        <div>
                            <h1 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>ColonyVision</h1>
                            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Comptage de colonies par IA</p>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button onClick={() => fileInputRef.current?.click()} className="btn" style={{ background: 'rgba(255,255,255,0.05)' }}>
                        <Upload size={18} style={{ marginRight: '0.5rem' }} /> Charger Petri
                    </button>
                    <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleUpload} />

                    <button
                        onClick={processImage}
                        disabled={!image || isProcessing}
                        className="btn"
                        style={{ background: '#10b981', opacity: (!image || isProcessing) ? 0.5 : 1 }}
                    >
                        {isProcessing ? 'Analyse...' : 'Lancer le Comptage'}
                    </button>
                </div>
            </header>

            <div style={{ flex: 1, padding: '2rem', display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem' }}>
                <main className="glass-panel" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
                    {image ? (
                        <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <img src={image} alt="Petri Dish" style={{ maxWidth: '90%', maxHeight: '90%', borderRadius: '1rem', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }} />
                            {isProcessing && (
                                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(2px)' }}>
                                    <div style={{ width: '40px', height: '40px', border: '4px solid #10b981', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                                </div>
                            )}
                            {coloniesCount !== null && (
                                <div style={{ position: 'absolute', top: '2rem', right: '2rem', padding: '1.5rem', background: 'rgba(16, 185, 129, 0.9)', borderRadius: '1.5rem', textAlign: 'center', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)' }}>
                                    <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>Total Estimé</div>
                                    <div style={{ fontSize: '3rem', fontWeight: 900 }}>{coloniesCount}</div>
                                    <div style={{ fontSize: '0.7rem' }}>unités / boîte</div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', opacity: 0.5 }}>
                            <Camera size={64} style={{ marginBottom: '1.5rem', color: '#10b981' }} />
                            <p style={{ fontSize: '1.2rem' }}>Déposez une photo de votre boîte de Petri</p>
                            <p style={{ fontSize: '0.9rem' }}>Format attendu : JPG, PNG</p>
                        </div>
                    )}
                </main>

                <aside style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="glass-panel" style={{ padding: '1.5rem' }}>
                        <h3 style={{ fontSize: '0.9rem', marginBottom: '1.2rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Paramètres d'Analyse</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                            <ParamSlider label="Seuil de détection" value={75} />
                            <ParamSlider label="Taille min. colonie" value={30} />
                            <ParamToggle label="Détection des amas" active={true} />
                        </div>
                    </div>

                    <div className="glass-panel" style={{ padding: '1.5rem', flex: 1 }}>
                        <h3 style={{ fontSize: '0.9rem', marginBottom: '1.2rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Détails Statistiques</h3>
                        {coloniesCount ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <StatRow label="Moyenne" value="~112 µm" />
                                <StatRow label="Luminescence" value="78%" />
                                <StatRow label="Surface couverte" value="22%" />
                            </div>
                        ) : (
                            <div style={{ opacity: 0.3, textAlign: 'center', marginTop: '4rem' }}>En attente d'analyse...</div>
                        )}
                    </div>
                </aside>
            </div>

            <style>{`
                @keyframes spin { to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
};

const ParamSlider = ({ label, value }: any) => (
    <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.5rem' }}>
            <span>{label}</span>
            <span>{value}%</span>
        </div>
        <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px' }}>
            <div style={{ width: `${value}%`, height: '100%', background: '#10b981', borderRadius: '2px' }} />
        </div>
    </div>
);

const ParamToggle = ({ label, active }: any) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.8rem' }}>{label}</span>
        <div style={{ width: '40px', height: '20px', background: active ? '#10b981' : 'rgba(255,255,255,0.1)', borderRadius: '10px', position: 'relative' }}>
            <div style={{ width: '16px', height: '16px', background: 'white', borderRadius: '50%', position: 'absolute', top: '2px', right: active ? '2px' : '22px', transition: 'all 0.2s' }} />
        </div>
    </div>
);

const StatRow = ({ label, value }: any) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', padding: '0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: '0.5rem' }}>
        <span style={{ color: 'var(--text-secondary)' }}>{label}</span>
        <span style={{ fontWeight: 600 }}>{value}</span>
    </div>
);

export default ColonyVision;
