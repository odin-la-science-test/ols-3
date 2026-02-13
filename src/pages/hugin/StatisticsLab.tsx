import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BarChart3, TrendingUp, Calculator } from 'lucide-react';
import { useToast } from '../../components/ToastContext';
import Plot from 'react-plotly.js';

const StatisticsLab = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [dataInput, setDataInput] = useState('');
    const [results, setResults] = useState<any>(null);
    const [testType, setTestType] = useState<'descriptive' | 'ttest' | 'anova' | 'correlation'>('descriptive');

    const parseData = (input: string): number[] => {
        return input.split(/[\s,;]+/).map(Number).filter(n => !isNaN(n));
    };

    const calculateDescriptive = (data: number[]) => {
        const n = data.length;
        const mean = data.reduce((a, b) => a + b, 0) / n;
        const sorted = [...data].sort((a, b) => a - b);
        const median = n % 2 === 0 ? (sorted[n / 2 - 1] + sorted[n / 2]) / 2 : sorted[Math.floor(n / 2)];
        const variance = data.reduce((sum, x) => sum + Math.pow(x - mean, 2), 0) / (n - 1);
        const stdDev = Math.sqrt(variance);
        const min = Math.min(...data);
        const max = Math.max(...data);
        const q1 = sorted[Math.floor(n * 0.25)];
        const q3 = sorted[Math.floor(n * 0.75)];

        return { n, mean, median, stdDev, variance, min, max, q1, q3 };
    };

    const calculateTTest = (data: number[], mu0: number = 0) => {
        const stats = calculateDescriptive(data);
        const t = (stats.mean - mu0) / (stats.stdDev / Math.sqrt(stats.n));
        const df = stats.n - 1;
        return { ...stats, t, df, mu0 };
    };

    const calculateCorrelation = (x: number[], y: number[]) => {
        const n = Math.min(x.length, y.length);
        const meanX = x.slice(0, n).reduce((a, b) => a + b, 0) / n;
        const meanY = y.slice(0, n).reduce((a, b) => a + b, 0) / n;
        
        let num = 0, denX = 0, denY = 0;
        for (let i = 0; i < n; i++) {
            const dx = x[i] - meanX;
            const dy = y[i] - meanY;
            num += dx * dy;
            denX += dx * dx;
            denY += dy * dy;
        }
        
        const r = num / Math.sqrt(denX * denY);
        const r2 = r * r;
        
        return { r, r2, n };
    };

    const runAnalysis = () => {
        const data = parseData(dataInput);
        
        if (data.length === 0) {
            showToast('Données invalides', 'error');
            return;
        }

        if (testType === 'descriptive') {
            setResults({ type: 'descriptive', data: calculateDescriptive(data), rawData: data });
        } else if (testType === 'ttest') {
            setResults({ type: 'ttest', data: calculateTTest(data), rawData: data });
        } else if (testType === 'correlation') {
            const half = Math.floor(data.length / 2);
            const x = data.slice(0, half);
            const y = data.slice(half);
            setResults({ type: 'correlation', data: calculateCorrelation(x, y), x, y });
        }

        showToast('Analyse terminée', 'success');
    };

    return (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)' }}>
            <div style={{
                padding: '1rem 1.5rem',
                borderBottom: '1px solid var(--border-color)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'var(--bg-secondary)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button onClick={() => navigate('/hugin')} className="btn" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <ArrowLeft size={18} />
                        Retour
                    </button>
                    <BarChart3 size={24} color="var(--accent-hugin)" />
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>StatisticsLab</h1>
                </div>

                <button onClick={runAnalysis} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Calculator size={18} />
                    Analyser
                </button>
            </div>

            <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
                <div style={{ width: '350px', borderRight: '1px solid var(--border-color)', padding: '1.5rem', overflowY: 'auto' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>Type d'analyse</h3>
                    
                    <div style={{ marginBottom: '1.5rem' }}>
                        {[
                            { id: 'descriptive', label: 'Statistiques descriptives', icon: <BarChart3 size={16} /> },
                            { id: 'ttest', label: 'Test t de Student', icon: <TrendingUp size={16} /> },
                            { id: 'correlation', label: 'Corrélation', icon: <TrendingUp size={16} /> }
                        ].map(test => (
                            <button
                                key={test.id}
                                onClick={() => setTestType(test.id as any)}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    marginBottom: '0.5rem',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: '0.5rem',
                                    background: testType === test.id ? 'var(--accent-hugin)' : 'var(--bg-secondary)',
                                    color: testType === test.id ? 'white' : 'var(--text-primary)',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem'
                                }}
                            >
                                {test.icon}
                                {test.label}
                            </button>
                        ))}
                    </div>

                    <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem' }}>Données</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                        {testType === 'correlation' 
                            ? 'Entrez les valeurs X puis Y (séparées par espaces/virgules)'
                            : 'Entrez vos valeurs (séparées par espaces, virgules ou points-virgules)'}
                    </p>
                    <textarea
                        value={dataInput}
                        onChange={(e) => setDataInput(e.target.value)}
                        placeholder="Ex: 12.5, 14.2, 13.8, 15.1, 14.9"
                        style={{
                            width: '100%',
                            height: '200px',
                            padding: '1rem',
                            border: '1px solid var(--border-color)',
                            borderRadius: '0.5rem',
                            background: 'var(--bg-primary)',
                            color: 'var(--text-primary)',
                            fontFamily: 'monospace',
                            fontSize: '0.9rem',
                            resize: 'vertical'
                        }}
                    />
                </div>

                <div style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
                    {results ? (
                        <>
                            {results.type === 'descriptive' && (
                                <div>
                                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>Statistiques Descriptives</h2>
                                    
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                                        {[
                                            { label: 'N', value: results.data.n },
                                            { label: 'Moyenne', value: results.data.mean.toFixed(3) },
                                            { label: 'Médiane', value: results.data.median.toFixed(3) },
                                            { label: 'Écart-type', value: results.data.stdDev.toFixed(3) },
                                            { label: 'Variance', value: results.data.variance.toFixed(3) },
                                            { label: 'Min', value: results.data.min.toFixed(3) },
                                            { label: 'Max', value: results.data.max.toFixed(3) },
                                            { label: 'Q1', value: results.data.q1.toFixed(3) },
                                            { label: 'Q3', value: results.data.q3.toFixed(3) }
                                        ].map(stat => (
                                            <div key={stat.label} style={{
                                                padding: '1rem',
                                                background: 'var(--bg-secondary)',
                                                borderRadius: '0.5rem',
                                                border: '1px solid var(--border-color)'
                                            }}>
                                                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                                                    {stat.label}
                                                </div>
                                                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--accent-hugin)' }}>
                                                    {stat.value}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <Plot
                                        data={[{
                                            type: 'box' as const,
                                            y: results.rawData,
                                            name: 'Distribution',
                                            marker: { color: 'var(--accent-hugin)' }
                                        }]}
                                        layout={{
                                            title: { text: 'Boîte à moustaches' },
                                            yaxis: { title: { text: 'Valeurs' } },
                                            paper_bgcolor: 'transparent',
                                            plot_bgcolor: 'transparent',
                                            font: { color: '#cbd5e1' }
                                        }}
                                        style={{ width: '100%', height: '400px' }}
                                        config={{ responsive: true }}
                                    />
                                </div>
                            )}

                            {results.type === 'ttest' && (
                                <div>
                                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>Test t de Student</h2>
                                    
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                                        {[
                                            { label: 'Statistique t', value: results.data.t.toFixed(4) },
                                            { label: 'Degrés de liberté', value: results.data.df },
                                            { label: 'Moyenne', value: results.data.mean.toFixed(3) },
                                            { label: 'Écart-type', value: results.data.stdDev.toFixed(3) }
                                        ].map(stat => (
                                            <div key={stat.label} style={{
                                                padding: '1rem',
                                                background: 'var(--bg-secondary)',
                                                borderRadius: '0.5rem',
                                                border: '1px solid var(--border-color)'
                                            }}>
                                                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                                                    {stat.label}
                                                </div>
                                                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--accent-hugin)' }}>
                                                    {stat.value}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {results.type === 'correlation' && (
                                <div>
                                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>Analyse de Corrélation</h2>
                                    
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                                        {[
                                            { label: 'Coefficient r', value: results.data.r.toFixed(4) },
                                            { label: 'R²', value: results.data.r2.toFixed(4) },
                                            { label: 'N', value: results.data.n }
                                        ].map(stat => (
                                            <div key={stat.label} style={{
                                                padding: '1rem',
                                                background: 'var(--bg-secondary)',
                                                borderRadius: '0.5rem',
                                                border: '1px solid var(--border-color)'
                                            }}>
                                                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                                                    {stat.label}
                                                </div>
                                                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--accent-hugin)' }}>
                                                    {stat.value}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <Plot
                                        data={[{
                                            type: 'scatter' as const,
                                            mode: 'markers' as const,
                                            x: results.x,
                                            y: results.y,
                                            marker: { color: 'var(--accent-hugin)', size: 10 }
                                        }]}
                                        layout={{
                                            title: { text: 'Nuage de points' },
                                            xaxis: { title: { text: 'Variable X' } },
                                            yaxis: { title: { text: 'Variable Y' } },
                                            paper_bgcolor: 'transparent',
                                            plot_bgcolor: 'transparent',
                                            font: { color: '#cbd5e1' }
                                        }}
                                        style={{ width: '100%', height: '400px' }}
                                        config={{ responsive: true }}
                                    />
                                </div>
                            )}
                        </>
                    ) : (
                        <div style={{
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--text-secondary)'
                        }}>
                            <BarChart3 size={80} style={{ marginBottom: '1rem', opacity: 0.3 }} />
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Entrez vos données</h3>
                            <p>Sélectionnez un test et entrez vos valeurs pour commencer</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StatisticsLab;
