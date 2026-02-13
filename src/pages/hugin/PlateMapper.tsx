import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Grid, Save, Download, Plus } from 'lucide-react';

const PlateMapper = () => {
    const navigate = useNavigate();
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const cols = Array.from({ length: 12 }, (_, i) => i + 1);

    const [selectedWells, setSelectedWells] = useState<string[]>([]);
    const [plateName, setPlateName] = useState('Plate_701');

    const toggleWell = (well: string) => {
        setSelectedWells(prev =>
            prev.includes(well) ? prev.filter(w => w !== well) : [...prev, well]
        );
    };

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', color: 'white', display: 'flex', flexDirection: 'column' }}>
            <header className="glass-panel" style={{ padding: '1.5rem 2rem', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <button onClick={() => navigate('/hugin')} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: 'inherit', padding: '0.6rem', borderRadius: '0.75rem', cursor: 'pointer' }}>
                        <ChevronLeft size={20} />
                    </button>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ padding: '0.75rem', background: 'rgba(236, 72, 153, 0.2)', borderRadius: '1rem', color: '#ec4899' }}>
                            <Grid size={24} />
                        </div>
                        <div>
                            <h1 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>PlateMapper</h1>
                            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Design de Plaque 96 puits</p>
                        </div>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className="btn" style={{ background: 'rgba(255,255,255,0.05)' }}><Download size={18} style={{ marginRight: '0.5rem' }} /> Export Layout</button>
                    <button className="btn" style={{ background: '#ec4899' }}><Save size={18} style={{ marginRight: '0.5rem' }} /> Save Map</button>
                </div>
            </header>

            <div style={{ flex: 1, padding: '2rem', display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem' }}>
                <main className="glass-panel" style={{ padding: '2rem', overflow: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(13, 1fr)', gap: '0.5rem', width: 'fit-content' }}>
                        <div />
                        {cols.map(c => <div key={c} style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{c}</div>)}

                        {rows.map(r => (
                            <>
                                <div key={r} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 800 }}>{r}</div>
                                {cols.map(c => {
                                    const id = `${r}${c}`;
                                    const isSelected = selectedWells.includes(id);
                                    return (
                                        <div
                                            key={id}
                                            onClick={() => toggleWell(id)}
                                            style={{
                                                width: '36px', height: '36px', borderRadius: '50%',
                                                background: isSelected ? '#ec4899' : 'rgba(255,255,255,0.05)',
                                                border: '1px solid rgba(255,255,255,0.1)',
                                                cursor: 'pointer', transition: 'all 0.15s'
                                            }}
                                        />
                                    );
                                })}
                            </>
                        ))}
                    </div>
                </main>

                <aside style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="glass-panel" style={{ padding: '1.5rem' }}>
                        <h3 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '1.2rem' }}>Détails de la Plaque</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Nom</label>
                                <input type="text" value={plateName} onChange={(e) => setPlateName(e.target.value)} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', marginTop: '0.3rem' }} />
                            </div>
                            <div style={{ fontSize: '0.85rem' }}>Puits Sélectionnés: <span style={{ color: '#ec4899', fontWeight: 700 }}>{selectedWells.length}</span></div>
                        </div>
                    </div>

                    <div className="glass-panel" style={{ padding: '1.5rem', flex: 1 }}>
                        <h3 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '1.2rem' }}>Légende / Groupes</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <GroupItem label="Standards (Ladder)" color="#8b5cf6" />
                            <GroupItem label="Contrôles (+)" color="#10b981" />
                            <GroupItem label="Unknown Samples" color="#ec4899" />
                            <button className="btn" style={{ width: '100%', marginTop: '1rem', border: '1px dashed rgba(255,255,255,0.2)', background: 'transparent' }}>
                                <Plus size={16} /> Add Group
                            </button>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
};

const GroupItem = ({ label, color }: any) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '0.5rem' }}>
        <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: color }} />
        <span style={{ fontSize: '0.8rem' }}>{label}</span>
    </div>
);

export default PlateMapper;
