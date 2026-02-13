import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Dna, CheckCircle } from 'lucide-react';

const PrimerStep = () => {
    const navigate = useNavigate();
    const [sequence, setSequence] = useState('GATCGATCGATCGATC');

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', color: 'white', display: 'flex', flexDirection: 'column' }}>
            <header className="glass-panel" style={{ padding: '1.5rem 2rem', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <button onClick={() => navigate('/hugin')} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: 'inherit', padding: '0.6rem', borderRadius: '0.75rem', cursor: 'pointer' }}>
                        <ChevronLeft size={20} />
                    </button>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ padding: '0.75rem', background: 'rgba(251, 191, 36, 0.2)', borderRadius: '1rem', color: '#fbbf24' }}>
                            <Dna size={24} />
                        </div>
                        <div>
                            <h1 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>PrimerStep</h1>
                            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Design & Vérification d'Armorces PCR</p>
                        </div>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className="btn" style={{ background: '#fbbf24', color: '#000' }}>Calculer Tm</button>
                </div>
            </header>

            <div style={{ flex: 1, padding: '2rem', display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem' }}>
                <main className="glass-panel" style={{ padding: '2rem' }}>
                    <h3 style={{ marginBottom: '1.5rem' }}>Séquence de l'Amorce (5' → 3')</h3>
                    <textarea
                        value={sequence}
                        onChange={(e) => setSequence(e.target.value.toUpperCase())}
                        style={{ width: '100%', height: '120px', padding: '1.5rem', fontSize: '1.5rem', fontFamily: 'monospace', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(251, 191, 36, 0.3)', borderRadius: '1rem', color: '#fbbf24', letterSpacing: '0.2rem' }}
                    />

                    <div style={{ marginTop: '2.5rem', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
                        <StatCard label="Tm (Salt Adjusted)" value="58.4" unit="°C" />
                        <StatCard label="Contenu GC" value="50.0" unit="%" />
                        <StatCard label="Longueur" value={sequence.length} unit="nt" />
                        <StatCard label="Poids Mol." value="4920.4" unit="Da" />
                    </div>
                </main>

                <aside style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="glass-panel" style={{ padding: '1.5rem' }}>
                        <h3 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '1.5rem' }}>Auto-Dimer / Hairpin</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <ValidationItem label="Self-Dimer DeltaG" value="-1.2 kcal/mol" status="success" />
                            <ValidationItem label="Hairpin DeltaG" value="-0.5 kcal/mol" status="success" />
                            <ValidationItem label="3' Complementarity" value="Low" status="success" />
                        </div>
                    </div>

                    <div className="glass-panel" style={{ padding: '1.5rem', flex: 1 }}>
                        <h3 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '1.5rem' }}>In-Silico PCR</h3>
                        <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '0.75rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <div style={{ fontSize: '0.85rem', marginBottom: '0.5rem' }}>Produit unique attendu:</div>
                            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fbbf24' }}>342 bp</div>
                            <div style={{ fontSize: '0.7rem', opacity: 0.5, marginTop: '0.25rem' }}>Match perfect on target exon 4.</div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
};

const StatCard = ({ label, value, unit }: any) => (
    <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>{label}</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.3rem' }}>
            <span style={{ fontSize: '1.5rem', fontWeight: 800 }}>{value}</span>
            <span style={{ fontSize: '0.8rem', opacity: 0.6 }}>{unit}</span>
        </div>
    </div>
);

const ValidationItem = ({ label, value }: any) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'rgba(16, 185, 129, 0.05)', borderRadius: '0.5rem' }}>
        <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{label}</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>{value}</div>
        </div>
        <CheckCircle size={18} style={{ color: '#10b981' }} />
    </div>
);

export default PrimerStep;
