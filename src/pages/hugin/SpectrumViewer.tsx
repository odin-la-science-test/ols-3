import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Zap, Download } from 'lucide-react';
import Plot from 'react-plotly.js';

const SpectrumViewer = () => {
    const navigate = useNavigate();

    const generateSpectrum = () => {
        const x = [];
        const y = [];
        for (let w = 200; w <= 800; w += 2) {
            x.push(w);

            const proteinPeak = 1.2 * Math.exp(-Math.pow(w - 280, 2) / 800);
            const secondaryPeak = 0.4 * Math.exp(-Math.pow(w - 450, 2) / 2000);
            const noise = Math.random() * 0.02;
            y.push(proteinPeak + secondaryPeak + noise);
        }
        return { x, y };
    };

    const spectrum = generateSpectrum();

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', color: 'white', display: 'flex', flexDirection: 'column' }}>
            <header className="glass-panel" style={{ padding: '1.5rem 2rem', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <button onClick={() => navigate('/hugin')} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: 'inherit', padding: '0.6rem', borderRadius: '0.75rem', cursor: 'pointer' }}>
                        <ChevronLeft size={20} />
                    </button>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ padding: '0.75rem', background: 'rgba(239, 68, 68, 0.2)', borderRadius: '1rem', color: '#ef4444' }}>
                            <Zap size={24} />
                        </div>
                        <div>
                            <h1 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>SpectrumViewer</h1>
                            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Analyse Spectrophotométrique</p>
                        </div>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className="btn" style={{ background: 'rgba(255,255,255,0.05)' }}><Download size={18} style={{ marginRight: '0.5rem' }} /> Export CSV</button>
                </div>
            </header>

            <div style={{ flex: 1, padding: '2rem', display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem' }}>
                <main className="glass-panel" style={{ padding: '1rem', background: 'rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Plot
                        data={[
                            {
                                x: spectrum.x,
                                y: spectrum.y,
                                type: 'scatter',
                                mode: 'lines',
                                name: 'Absorbance',
                                line: { color: '#ef4444', width: 2 },
                                fill: 'tozeroy',
                                fillcolor: 'rgba(239, 68, 68, 0.1)'
                            }
                        ]}
                        layout={{
                            width: 850,
                            height: 600,
                            paper_bgcolor: 'transparent',
                            plot_bgcolor: 'rgba(0,0,0,0.1)',
                            margin: { t: 40, b: 60, l: 80, r: 40 },
                            xaxis: { title: { text: 'Wavelength (nm)' }, color: '#fff', gridcolor: 'rgba(255,255,255,0.1)', range: [spectrum.x[0], spectrum.x[spectrum.x.length - 1]] },
                            yaxis: { title: { text: 'Absorbance (AU)' }, color: '#fff', gridcolor: 'rgba(255,255,255,0.1)' }
                        }}
                        config={{ responsive: true, displaylogo: false }}
                    />
                </main>

                <aside style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="glass-panel" style={{ padding: '1.5rem' }}>
                        <h3 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '1.5rem' }}>Paramètres d'Affichage</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                            <div style={{ fontSize: '0.8rem', display: 'flex', justifyContent: 'space-between' }}>
                                <span>Plage: 200 - 800 nm</span>
                            </div>
                            <input type="range" min="200" max="800" step="10" style={{ width: '100%' }} />
                        </div>
                    </div>

                    <div className="glass-panel" style={{ padding: '1.5rem', flex: 1 }}>
                        <h3 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '1.5rem' }}>Résultats & Peaks</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <PeakResult wavelength="280.4" absorbance="1.204" type="Protein (Tyr/Trp)" />
                            <PeakResult wavelength="452.1" absorbance="0.412" type="Cofactor/Secondary" />
                            <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '0.5rem 0' }} />
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                                <span style={{ color: 'var(--text-secondary)' }}>Ratio 260/280</span>
                                <span style={{ fontWeight: 700 }}>1.84</span>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
};

const PeakResult = ({ wavelength, absorbance, type }: any) => (
    <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.05)', borderRadius: '0.75rem', border: '1px solid rgba(239, 68, 68, 0.1)' }}>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Peak detected at:</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '0.25rem' }}>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ef4444' }}>{wavelength} <span style={{ fontSize: '0.8rem' }}>nm</span></div>
            <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{absorbance} AU</div>
        </div>
        <div style={{ fontSize: '0.7rem', opacity: 0.6 }}>{type}</div>
    </div>
);

export default SpectrumViewer;
