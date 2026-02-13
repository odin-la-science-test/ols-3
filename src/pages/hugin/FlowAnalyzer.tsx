import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Activity, Download, Plus } from 'lucide-react';
import Plot from 'react-plotly.js';

const FlowAnalyzer = () => {
    const navigate = useNavigate();
    const [sampleName, setSampleName] = useState('Sample_001');

    const generateData = (count: number, centerX: number, centerY: number, sigma: number) => {
        return {
            x: Array.from({ length: count }, () => centerX + (Math.random() - 0.5) * sigma),
            y: Array.from({ length: count }, () => centerY + (Math.random() - 0.5) * sigma)
        };
    };

    const pop1 = generateData(800, 200000, 150000, 80000);
    const pop2 = generateData(300, 450000, 400000, 120000);

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', color: 'white', display: 'flex', flexDirection: 'column' }}>
            <header className="glass-panel" style={{ padding: '1.5rem 2rem', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <button onClick={() => navigate('/hugin')} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: 'inherit', padding: '0.6rem', borderRadius: '0.75rem', cursor: 'pointer' }}>
                        <ChevronLeft size={20} />
                    </button>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ padding: '0.75rem', background: 'rgba(139, 92, 246, 0.2)', borderRadius: '1rem', color: '#8b5cf6' }}>
                            <Activity size={24} />
                        </div>
                        <div>
                            <h1 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>FlowAnalyzer</h1>
                            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Cytométrie de flux & Gating</p>
                        </div>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className="btn" style={{ background: 'rgba(255,255,255,0.05)' }}><Download size={18} style={{ marginRight: '0.5rem' }} /> Export FCS</button>
                    <button className="btn" style={{ background: '#8b5cf6' }}><Plus size={18} style={{ marginRight: '0.5rem' }} /> New Gate</button>
                </div>
            </header>

            <div style={{ flex: 1, padding: '2rem', display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem' }}>
                <main className="glass-panel" style={{ padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.2)' }}>
                    <Plot
                        data={[
                            {
                                x: pop1.x,
                                y: pop1.y,
                                mode: 'markers',
                                type: 'scattergl',
                                name: 'Population A',
                                marker: { color: 'rgba(139, 92, 246, 0.5)', size: 3 }
                            },
                            {
                                x: pop2.x,
                                y: pop2.y,
                                mode: 'markers',
                                type: 'scattergl',
                                name: 'Population B',
                                marker: { color: 'rgba(16, 185, 129, 0.5)', size: 3 }
                            }
                        ]}
                        layout={{
                            width: 800,
                            height: 600,
                            paper_bgcolor: 'transparent',
                            plot_bgcolor: 'rgba(0,0,0,0.2)',
                            margin: { t: 40, b: 60, l: 80, r: 40 },
                            xaxis: { title: { text: 'FSC-A (Size)' }, color: '#fff', gridcolor: 'rgba(255,255,255,0.1)' },
                            yaxis: { title: { text: 'SSC-A (Granularity)' }, color: '#fff', gridcolor: 'rgba(255,255,255,0.1)' },
                            legend: { font: { color: '#fff' } }
                        }}
                        config={{ responsive: true, displaylogo: false }}
                    />
                </main>

                <aside style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="glass-panel" style={{ padding: '1.5rem' }}>
                        <h3 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '1rem' }}>Configuration du Plot</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <InputGroup label="Nom de l'échantillon" value={sampleName} onChange={setSampleName} />
                            <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>X-Axis: FSC-A</div>
                            <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>Y-Axis: SSC-A</div>
                        </div>
                    </div>

                    <div className="glass-panel" style={{ padding: '1.5rem', flex: 1 }}>
                        <h3 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '1.2rem' }}>Hiérarchie de Gating</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <GateItem label="Root (All Events)" count="15,402" color="#fff" />
                            <GateItem label="Lymphocytes" count="8,231" color="#8b5cf6" indent />
                            <GateItem label="CD4+" count="3,120" color="#10b981" indent={2} />
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
};

const InputGroup = ({ label, value, onChange }: any) => (
    <div>
        <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>{label}</label>
        <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
        />
    </div>
);

const GateItem = ({ label, count, color, indent = 0 }: any) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingLeft: `${indent * 1.5}rem` }}>
        <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: color }} />
        <div style={{ flex: 1, fontSize: '0.85rem' }}>{label}</div>
        <div style={{ fontSize: '0.75rem', opacity: 0.6 }}>{count}</div>
    </div>
);

export default FlowAnalyzer;
