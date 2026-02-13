import { useNavigate } from 'react-router-dom';
import { ChevronLeft, TrendingUp, Save } from 'lucide-react';
import Plot from 'react-plotly.js';

const KineticsLab = () => {
    const navigate = useNavigate();

    const substrate = [1, 2, 5, 10, 20, 50, 100];
    const velocity = [1.2, 2.1, 4.4, 7.5, 12, 22, 35];

    const vMax = 45;
    const km = 25;

    const fitX = Array.from({ length: 100 }, (_, i) => i);
    const fitY = fitX.map(s => (vMax * s) / (km + s));

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', color: 'white', display: 'flex', flexDirection: 'column' }}>
            <header className="glass-panel" style={{ padding: '1.5rem 2rem', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <button onClick={() => navigate('/hugin')} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: 'inherit', padding: '0.6rem', borderRadius: '0.75rem', cursor: 'pointer' }}>
                        <ChevronLeft size={20} />
                    </button>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ padding: '0.75rem', background: 'rgba(234, 179, 8, 0.2)', borderRadius: '1rem', color: '#eab308' }}>
                            <TrendingUp size={24} />
                        </div>
                        <div>
                            <h1 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>KineticsLab</h1>
                            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Cinétique Enzymatique & Michaelis-Menten</p>
                        </div>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className="btn" style={{ background: 'rgba(255,255,255,0.05)' }}><Save size={18} style={{ marginRight: '0.5rem' }} /> Enregistrer Exp</button>
                </div>
            </header>

            <div style={{ flex: 1, padding: '2rem', display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem' }}>
                <main className="glass-panel" style={{ padding: '1rem', background: 'rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Plot
                        data={[
                            {
                                x: substrate,
                                y: velocity,
                                mode: 'markers',
                                type: 'scatter',
                                name: 'Données Exp.',
                                marker: { color: '#eab308', size: 10 }
                            },
                            {
                                x: fitX,
                                y: fitY,
                                mode: 'lines',
                                type: 'scatter',
                                name: 'Ajustement (M-M)',
                                line: { color: 'rgba(234, 179, 8, 0.5)', width: 3, dash: 'dash' }
                            }
                        ]}
                        layout={{
                            width: 850,
                            height: 600,
                            paper_bgcolor: 'transparent',
                            plot_bgcolor: 'rgba(0,0,0,0.1)',
                            margin: { t: 40, b: 60, l: 80, r: 40 },
                            xaxis: { title: { text: '[Substrat] (mM)' }, color: '#fff', gridcolor: 'rgba(255,255,255,0.1)' },
                            yaxis: { title: { text: 'Vitesse (v)' }, color: '#fff', gridcolor: 'rgba(255,255,255,0.1)' },
                            legend: { font: { color: '#fff' } }
                        }}
                        config={{ responsive: true, displaylogo: false }}
                    />
                </main>

                <aside style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="glass-panel" style={{ padding: '1.5rem' }}>
                        <h3 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '1.5rem' }}>Paramètres Dérivés</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <ResultCard label="Vmax" value="45.2" unit="µmol/min" color="#eab308" />
                            <ResultCard label="Km" value="25.4" unit="mM" color="#eab308" />
                            <ResultCard label="kcat" value="122.5" unit="s⁻¹" color="#eab308" />
                        </div>
                    </div>

                    <div className="glass-panel" style={{ padding: '1.5rem', flex: 1 }}>
                        <h3 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '1.5rem' }}>Données Brutes</h3>
                        <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                            <table style={{ width: '100%', fontSize: '0.85rem', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ color: 'var(--text-secondary)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                        <th style={{ textAlign: 'left', padding: '0.5rem' }}>[S]</th>
                                        <th style={{ textAlign: 'left', padding: '0.5rem' }}>Vel</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {substrate.map((s, i) => (
                                        <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                            <td style={{ padding: '0.5rem' }}>{s}</td>
                                            <td style={{ padding: '0.5rem' }}>{velocity[i]}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
};

const ResultCard = ({ label, value, unit, color }: any) => (
    <div style={{ padding: '1rem', background: 'rgba(234, 179, 8, 0.05)', borderRadius: '1rem', border: '1px solid rgba(234, 179, 8, 0.1)' }}>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>{label}</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 900, color }}>{value}</div>
            <div style={{ fontSize: '0.75rem', opacity: 0.6 }}>{unit}</div>
        </div>
    </div>
);

export default KineticsLab;
