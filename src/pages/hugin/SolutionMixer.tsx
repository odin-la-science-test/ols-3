import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Beaker, Plus, Trash2, Save, Calculator } from 'lucide-react';

interface Component {
    id: string;
    name: string;
    concentration: number;
    unit: string;
}

const SolutionMixer = () => {
    const navigate = useNavigate();
    const [components] = useState<Component[]>([
        { id: '1', name: 'Tris-HCl pH 8.0', concentration: 50, unit: 'mM' },
        { id: '2', name: 'NaCl', concentration: 150, unit: 'mM' }
    ]);
    const [finalVolume, setFinalVolume] = useState(500);

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', color: 'white', display: 'flex', flexDirection: 'column' }}>
            <header className="glass-panel" style={{ padding: '1.5rem 2rem', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <button onClick={() => navigate('/hugin')} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: 'inherit', padding: '0.6rem', borderRadius: '0.75rem', cursor: 'pointer' }}>
                        <ChevronLeft size={20} />
                    </button>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ padding: '0.75rem', background: 'rgba(16, 185, 129, 0.2)', borderRadius: '1rem', color: '#10b981' }}>
                            <Beaker size={24} />
                        </div>
                        <div>
                            <h1 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>SolutionMixer</h1>
                            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Préparation de Tampons Complexes</p>
                        </div>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className="btn" style={{ background: '#10b981' }}><Save size={18} style={{ marginRight: '0.5rem' }} /> Enregistrer Recette</button>
                </div>
            </header>

            <div style={{ flex: 1, padding: '2rem', display: 'grid', gridTemplateColumns: '1fr 380px', gap: '2rem' }}>
                <main className="glass-panel" style={{ padding: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '1.25rem' }}>Composition de la Solution</h2>
                        <button className="btn" style={{ background: 'rgba(255,255,255,0.05)' }}><Plus size={18} /> Add Reagent</button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {components.map(c => (
                            <div key={c.id} style={{ display: 'grid', gridTemplateColumns: '1fr 120px 80px 50px', gap: '1rem', alignItems: 'center', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '0.75rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <input type="text" value={c.name} readOnly style={{ background: 'transparent', border: 'none', color: 'white', fontWeight: 600 }} />
                                <input type="number" value={c.concentration} readOnly style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.4rem', padding: '0.4rem', color: '#10b981', textAlign: 'center' }} />
                                <span style={{ color: 'var(--text-secondary)' }}>{c.unit}</span>
                                <button style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={18} /></button>
                            </div>
                        ))}
                    </div>

                    <div style={{ marginTop: '3rem', padding: '2rem', background: 'rgba(16, 185, 129, 0.05)', borderRadius: '1rem', border: '1px dashed rgba(16, 185, 129, 0.2)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                            <Calculator size={20} style={{ color: '#10b981' }} />
                            <h3 style={{ fontSize: '1.1rem' }}>Mélangeur Dynamique</h3>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                            <div>
                                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Volume Final (mL)</label>
                                <input type="number" value={finalVolume} onChange={(e) => setFinalVolume(parseInt(e.target.value))} style={{ width: '100%', padding: '1rem', fontSize: '1.25rem', background: 'rgba(0,0,0,0.3)', border: '1px solid #10b981', borderRadius: '0.75rem', color: 'white', marginTop: '0.5rem' }} />
                            </div>
                        </div>
                    </div>
                </main>

                <aside style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="glass-panel" style={{ padding: '1.5rem' }}>
                        <h3 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '1.5rem' }}>Feuille de Pesée</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <WeighItem name="NaCl" weight="4.38" unit="g" />
                            <WeighItem name="Tris-HCl" weight="3.94" unit="g" />
                            <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '0.75rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                                <span>Eau ultra-pure</span>
                                <span style={{ fontWeight: 700 }}>qsp {finalVolume} mL</span>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
};

const WeighItem = ({ name, weight, unit }: any) => (
    <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.05)', borderRadius: '0.75rem', border: '1px solid rgba(16, 185, 129, 0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontWeight: 600 }}>{name}</span>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.2rem' }}>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#10b981' }}>{weight}</span>
            <span style={{ fontSize: '0.75rem', opacity: 0.6 }}>{unit}</span>
        </div>
    </div>
);

export default SolutionMixer;
