import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, UserCheck, Save, RefreshCcw } from 'lucide-react';

const CellTracker = () => {
    const navigate = useNavigate();
    const [counts, setCounts] = useState([45, 38, 52, 41]);
    const [dilution, setDilution] = useState(10);

    const avg = counts.reduce((a, b) => a + b, 0) / counts.length;
    const concentration = avg * dilution * 10000;

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', color: 'white', display: 'flex', flexDirection: 'column' }}>
            <header className="glass-panel" style={{ padding: '1.5rem 2rem', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <button onClick={() => navigate('/hugin')} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: 'inherit', padding: '0.6rem', borderRadius: '0.75rem', cursor: 'pointer' }}>
                        <ChevronLeft size={20} />
                    </button>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ padding: '0.75rem', background: 'rgba(59, 130, 246, 0.2)', borderRadius: '1rem', color: '#3b82f6' }}>
                            <UserCheck size={24} />
                        </div>
                        <div>
                            <h1 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>CellTracker</h1>
                            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Comptage Cellulaire & Viabilité</p>
                        </div>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className="btn" style={{ background: '#3b82f6' }}><Save size={18} style={{ marginRight: '0.5rem' }} /> Save Result</button>
                </div>
            </header>

            <div style={{ flex: 1, padding: '2rem', display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem' }}>
                <main className="glass-panel" style={{ padding: '2rem' }}>
                    <h2 style={{ fontSize: '1.25rem', marginBottom: '2rem' }}>Hématocymètre (Carrés de comptage)</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                        {counts.map((c, i) => (
                            <div key={i} style={{ padding: '2rem', background: 'rgba(255,255,255,0.02)', borderRadius: '1rem', border: '2px solid rgba(59, 130, 246, 0.2)', textAlign: 'center' }}>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>Square {i + 1}</div>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.5rem' }}>
                                    <button onClick={() => {
                                        const newCounts = [...counts];
                                        newCounts[i] = Math.max(0, counts[i] - 1);
                                        setCounts(newCounts);
                                    }} style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#ef4444', cursor: 'pointer' }}>-</button>
                                    <span style={{ fontSize: '2rem', fontWeight: 900, width: '60px' }}>{c}</span>
                                    <button onClick={() => {
                                        const newCounts = [...counts];
                                        newCounts[i] = counts[i] + 1;
                                        setCounts(newCounts);
                                    }} style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', color: '#10b981', cursor: 'pointer' }}>+</button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div style={{ marginTop: '3rem', display: 'flex', gap: '2rem', alignItems: 'center' }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Facteur de Dilution</label>
                            <input type="number" value={dilution} onChange={(e) => setDilution(parseInt(e.target.value))} style={{ width: '100%', padding: '1rem', fontSize: '1.25rem', background: 'rgba(0,0,0,0.3)', border: '1px solid #3b82f6', borderRadius: '0.75rem', color: 'white', marginTop: '0.5rem' }} />
                        </div>
                        <button onClick={() => setCounts([0, 0, 0, 0])} className="btn" style={{ background: 'rgba(255,255,255,0.05)', alignSelf: 'flex-end', height: '54px' }}>
                            <RefreshCcw size={18} style={{ marginRight: '0.5rem' }} /> Reset
                        </button>
                    </div>
                </main>

                <aside style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
                        <h3 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '1.5rem' }}>Concentration Totale</h3>
                        <div style={{ fontSize: '2.5rem', fontWeight: 950, color: '#3b82f6' }}>
                            {concentration.toLocaleString()}
                        </div>
                        <div style={{ fontSize: '1rem', opacity: 0.6, marginTop: '0.5rem' }}>cells / mL</div>
                        <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '2rem 0' }} />
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                            <span style={{ color: 'var(--text-secondary)' }}>Moyenne / Carré</span>
                            <span style={{ fontWeight: 700 }}>{avg.toFixed(1)}</span>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default CellTracker;
