import { useState } from 'react';
import {
    PieChart, Activity,
    ArrowLeft, RefreshCw,
    Sliders, Filter, Database
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { ScientificEngine } from '../../logic/ScientificEngine';

const Qiime2 = () => {
    const navigate = useNavigate();
    const [diversity, setDiversity] = useState<string | null>(null);
    const [isAnalysisRunning, setIsAnalysisRunning] = useState(false);

    const handleRunAnalysis = () => {
        setIsAnalysisRunning(true);
        setTimeout(() => {
            const h = ScientificEngine.bacteriology.calculateShannon([120, 450, 89, 230, 15, 67, 210]);
            setDiversity(h);
            setIsAnalysisRunning(false);
        }, 1500);
    };

    const taxa = [
        { name: 'Bacteroidetes', color: '#6366f1', value: 45 },
        { name: 'Firmicutes', color: '#10b981', value: 30 },
        { name: 'Proteobacteria', color: '#f59e0b', value: 15 },
        { name: 'Actinobacteria', color: '#ec4899', value: 7 },
        { name: 'Other', color: '#64748b', value: 3 },
    ];

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-main)', color: 'white' }}>
            <Navbar />

            <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
                {/* Header Section */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                    <button
                        onClick={() => navigate('/hugin')}
                        style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: 'white', padding: '0.8rem', borderRadius: '1rem', cursor: 'pointer' }}
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 style={{ fontSize: '2rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <PieChart className="text-gradient" /> QIIME 2 (Microbiome)
                        </h1>
                        <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Metagenomics Analysis Pipeline • Taxa Barplots & Alpha Diversity</p>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem' }}>
                    {/* Main Workspace */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        {/* Taxa Barplot Section */}
                        <div className="glass-panel" style={{ padding: '2rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                                <h3 style={{ margin: 0 }}>Distribution des Taxons (Niveau Phylum)</h3>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button className="btn-secondary" style={{ fontSize: '0.75rem', padding: '0.4rem 0.8rem' }}><Filter size={14} /> Filtres</button>
                                    <button className="btn-secondary" style={{ fontSize: '0.75rem', padding: '0.4rem 0.8rem' }}><Sliders size={14} /> Paramètres</button>
                                </div>
                            </div>

                            {/* Mock Barplot */}
                            <div style={{ height: '350px', display: 'flex', gap: '40px', alignItems: 'flex-end', padding: '0 40px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                {[1, 2, 3, 4, 5].map(sample => (
                                    <div key={sample} style={{ flex: 1, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: '2px' }}>
                                        {taxa.map((t, i) => (
                                            <div
                                                key={i}
                                                style={{
                                                    height: `${t.value + (Math.random() * 10 - 5)}%`,
                                                    background: t.color,
                                                    borderRadius: '2px',
                                                    transition: '0.5s ease'
                                                }}
                                                title={`${t.name}: ${t.value}%`}
                                            />
                                        ))}
                                        <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.7rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>Échantillon {sample}</div>
                                    </div>
                                ))}
                            </div>

                            {/* Legend */}
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', marginTop: '3rem', paddingTop: '2rem', justifyContent: 'center' }}>
                                {taxa.map(t => (
                                    <div key={t.name} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                                        <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: t.color }}></div>
                                        <span>{t.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Diversity Analysis */}
                        <div className="glass-panel" style={{ padding: '2rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Activity size={20} color="var(--accent-hugin)" /> Analyse d'Alpha-Diversité
                                </h3>
                                <button className="btn-primary" onClick={handleRunAnalysis} disabled={isAnalysisRunning}>
                                    {isAnalysisRunning ? <RefreshCw className="animate-spin" size={18} /> : 'Calculer les Indices'}
                                </button>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
                                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '1rem', textAlign: 'center' }}>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Shannon Index (H')</div>
                                    <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--accent-hugin)' }}>{diversity || '--'}</div>
                                </div>
                                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '1rem', textAlign: 'center' }}>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Simpson Index (D)</div>
                                    <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#10b981' }}>{diversity ? (parseFloat(diversity) * 0.23).toFixed(3) : '--'}</div>
                                </div>
                                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '1rem', textAlign: 'center' }}>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Chao1 Richness</div>
                                    <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#f59e0b' }}>{diversity ? '842' : '--'}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar: Pipeline Info */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <div className="glass-panel" style={{ padding: '1.5rem' }}>
                            <h3 style={{ fontSize: '1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Database size={18} color="var(--accent-hugin)" /> Bio-Informatique
                            </h3>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                                <p>QIIME 2 permet l'analyse haute performance des données de séquençage d'amplicons.</p>
                                <ul style={{ paddingLeft: '1.2rem', marginTop: '1rem' }}>
                                    <li>DADA2 Denosing</li>
                                    <li>Greengenes2 Database</li>
                                    <li>ASV (Amplicon Sequence Variants)</li>
                                </ul>
                            </div>
                        </div>

                        <div className="glass-panel" style={{ padding: '1.5rem' }}>
                            <h3 style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>Workflow Métagénomique</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {[
                                    { step: 'Import .fastq', status: 'Done', color: '#10b981' },
                                    { step: 'Démultiplexage', status: 'Done', color: '#10b981' },
                                    { step: 'Calcul Diversité', status: 'Running', color: 'var(--accent-hugin)' },
                                    { step: 'Export .qzv', status: 'Pending', color: 'rgba(255,255,255,0.1)' },
                                ].map((s, i) => (
                                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.8rem' }}>
                                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: s.color }}></div>
                                        <span style={{ flex: 1 }}>{s.step}</span>
                                        <span style={{ opacity: 0.5, fontSize: '0.7rem' }}>{s.status}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="glass-panel" style={{ padding: '1.5rem' }}>
                            <button style={{ width: '100%', marginBottom: '0.8rem' }} className="btn-secondary">
                                Rapport Complet
                            </button>
                            <button style={{ width: '100%' }} className="btn-secondary">
                                Vue PCoA (3D)
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Qiime2;
