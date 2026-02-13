import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Camera, Upload, Layers } from 'lucide-react';
import { useToast } from '../../components/ToastContext';

const GelPro = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [image, setImage] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [results, setResults] = useState<any[] | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setImage(event.target?.result as string);
                setResults(null);
                showToast('Gel uploadé', 'success');
            };
            reader.readAsDataURL(file);
        }
    };

    const analyzeGel = () => {
        setIsAnalyzing(true);
        setTimeout(() => {
            setResults([
                { id: 1, lane: 1, bands: [500, 350, 200], mw: "Vector DNA" },
                { id: 2, lane: 2, bands: [500, 350, 100], mw: "Sample A" },
                { id: 3, lane: 3, bands: [350], mw: "Marker Ref" }
            ]);
            setIsAnalyzing(false);
            showToast('Analyse du gel terminée', 'success');
        }, 2500);
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
                            <Layers size={24} />
                        </div>
                        <div>
                            <h1 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>GelPro</h1>
                            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Analyse d'Électrophorèse</p>
                        </div>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button onClick={() => fileInputRef.current?.click()} className="btn" style={{ background: 'rgba(255,255,255,0.05)' }}><Upload size={18} style={{ marginRight: '0.5rem' }} /> Importer Gel</button>
                    <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleUpload} />
                    <button onClick={analyzeGel} disabled={!image || isAnalyzing} className="btn" style={{ background: '#10b981', opacity: (!image || isAnalyzing) ? 0.5 : 1 }}>Lancer l'Analyse</button>
                </div>
            </header>

            <div style={{ flex: 1, padding: '2rem', display: 'grid', gridTemplateColumns: '1fr 380px', gap: '2rem' }}>
                <main className="glass-panel" style={{ background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
                    {image ? (
                        <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <img src={image} alt="Gel" style={{ maxWidth: '80%', maxHeight: '90%', filter: 'grayscale(100%) contrast(150%) brightness(80%)' }} />
                            {isAnalyzing && (
                                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(2px)' }}>
                                    <div style={{ color: '#10b981', textAlign: 'center' }}>
                                        <div style={{ width: '40px', height: '40px', border: '4px solid #10b981', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }} />
                                        <span>Détection des bandes...</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', opacity: 0.3 }}>
                            <Camera size={64} style={{ marginBottom: '1rem' }} />
                            <p>Importez une image de votre gel (.jpg, .png)</p>
                        </div>
                    )}
                </main>

                <aside style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="glass-panel" style={{ padding: '1.5rem' }}>
                        <h3 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '1.2rem' }}>Réglages d'Analyse</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <ParamSlider label="Sensibilité de détection" value={65} />
                            <ParamSlider label="Seuil de bruit" value={20} />
                        </div>
                    </div>

                    <div className="glass-panel" style={{ padding: '1.5rem', flex: 1 }}>
                        <h3 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '1.5rem' }}>Résultats (MW Estimation)</h3>
                        {results ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {results.map(r => (
                                    <div key={r.id} style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '0.75rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                            <span style={{ fontWeight: 700 }}>Lane {r.lane}</span>
                                            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{r.mw}</span>
                                        </div>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                            {r.bands.map((b: number, i: number) => (
                                                <span key={i} style={{ fontSize: '0.8rem', padding: '0.2rem 0.5rem', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderRadius: '4px' }}>{b} bp</span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div style={{ opacity: 0.3, textAlign: 'center', paddingTop: '4rem' }}>En attente de traitement...</div>
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
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.4rem' }}>
            <span>{label}</span>
            <span>{value}%</span>
        </div>
        <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px' }}>
            <div style={{ width: `${value}%`, height: '100%', background: '#10b981', borderRadius: '2px' }} />
        </div>
    </div>
);

export default GelPro;
