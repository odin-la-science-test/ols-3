import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Box, Download } from 'lucide-react';

const MoleculeBox = () => {
    const navigate = useNavigate();
    const [smiles, setSmiles] = useState('CC(=O)OC1=CC=CC=C1C(=O)O'); // Aspirin

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', color: 'white', display: 'flex', flexDirection: 'column' }}>
            <header className="glass-panel" style={{ padding: '1.5rem 2rem', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <button onClick={() => navigate('/hugin')} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: 'inherit', padding: '0.6rem', borderRadius: '0.75rem', cursor: 'pointer' }}>
                        <ChevronLeft size={20} />
                    </button>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ padding: '0.75rem', background: 'rgba(59, 130, 246, 0.2)', borderRadius: '1rem', color: '#3b82f6' }}>
                            <Box size={24} />
                        </div>
                        <div>
                            <h1 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>MoleculeBox</h1>
                            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Cheminformatique & Structures 2D</p>
                        </div>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className="btn" style={{ background: 'rgba(255,255,255,0.05)' }}><Download size={18} style={{ marginRight: '0.5rem' }} /> Export Mol</button>
                </div>
            </header>

            <div style={{ flex: 1, padding: '2rem', display: 'grid', gridTemplateColumns: '1fr 380px', gap: '2rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="glass-panel" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.01)' }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ width: '400px', height: '300px', border: '2px dashed rgba(255,255,255,0.1)', borderRadius: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6', background: 'rgba(0,0,0,0.3)', marginBottom: '1.5rem' }}>
                                <div style={{ fontSize: '0.9rem', opacity: 0.5 }}>[ Visuel 2D de la structure ici ]</div>
                            </div>
                            <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>{smiles === 'CC(=O)OC1=CC=CC=C1C(=O)O' ? 'Aspirine' : 'Molécule Inconnue'}</div>
                            <div style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', fontFamily: 'monospace' }}>{smiles}</div>
                        </div>
                    </div>

                    <div className="glass-panel" style={{ padding: '2rem' }}>
                        <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Entrée SMILES</h3>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <input
                                type="text"
                                value={smiles}
                                onChange={(e) => setSmiles(e.target.value)}
                                style={{ flex: 1, padding: '1rem', borderRadius: '1rem', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: '#3b82f6', fontFamily: 'monospace' }}
                            />
                            <button className="btn" style={{ background: '#3b82f6' }}>Générer</button>
                        </div>
                    </div>
                </div>

                <aside style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="glass-panel" style={{ padding: '1.5rem' }}>
                        <h3 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '1.5rem' }}>Propriétés Physico-Chimiques</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <PropRow label="Masse Molaire" value="180.16 g/mol" />
                            <PropRow label="LogP" value="1.19" />
                            <PropRow label="Donneurs H" value="1" />
                            <PropRow label="Accepteurs H" value="4" />
                            <PropRow label="Atomes Lourds" value="13" />
                        </div>
                    </div>

                    <div className="glass-panel" style={{ padding: '1.5rem', flex: 1 }}>
                        <h3 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '1.5rem' }}>Inventaire Lié</h3>
                        <div style={{ opacity: 0.5, textAlign: 'center', padding: '2rem' }}>
                            Aucun flacon trouvé en stock pour cette structure.
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
};

const PropRow = ({ label, value }: any) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', padding: '0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: '0.5rem' }}>
        <span style={{ color: 'var(--text-secondary)' }}>{label}</span>
        <span style={{ fontWeight: 600 }}>{value}</span>
    </div>
);

export default MoleculeBox;
