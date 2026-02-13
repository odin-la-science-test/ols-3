import { useState, useMemo } from 'react';
import {
    Layout, ZoomIn, ZoomOut, Save,
    ArrowLeft, Download, RefreshCw, Info,
    ChevronRight, ChevronLeft, Database
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { ScientificEngine } from '../../logic/ScientificEngine';

const Artemis = () => {
    const navigate = useNavigate();
    const [offset, setOffset] = useState(150000); // Genome position
    const [sequence] = useState('ATGCGTCGTAGCTAGCTAGCTAGCTGATCGATCGTAGC...');

    const [zoom, setZoom] = useState(1);

    const gcContent = useMemo(() => ScientificEngine.bacteriology.calculateGC(sequence), [sequence]);

    const handleSave = () => {
        alert('Projet Artemis sauvegardé avec succès.');
    };

    const features = [
        { start: 100, end: 1200, label: 'dnaA', type: 'gene', strand: '+' },
        { start: 1500, end: 2800, label: 'dnaN', type: 'gene', strand: '+' },
        { start: 3000, end: 3500, label: 'recF', type: 'regulatory', strand: '-' },
        { start: 4000, end: 5500, label: 'gyrB', type: 'gene', strand: '+' },
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
                            <Layout className="text-gradient" /> Artemis Genome Viewer
                        </h1>
                        <p style={{ color: 'var(--text-secondary)', margin: 0 }}>DNA Sequence Viewer & Annotation Tool • Visualization de Tracks & Contenu GC</p>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {/* Viewer Controls */}
                    <div className="glass-panel" style={{ padding: '1.2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Position: {offset} bp</div>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button onClick={() => setOffset(o => Math.max(0, o - 1000))} className="btn-secondary" style={{ padding: '0.4rem' }}><ChevronLeft size={16} /></button>
                                <button onClick={() => setOffset(o => o + 1000)} className="btn-secondary" style={{ padding: '0.4rem' }}><ChevronRight size={16} /></button>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button onClick={() => setZoom(z => Math.max(0.5, z - 0.1))} className="btn-secondary" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><ZoomOut size={16} /> Dézoomer</button>
                            <button onClick={() => setZoom(z => Math.min(2, z + 0.1))} className="btn-secondary" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><ZoomIn size={16} /> Zoomer</button>
                            <button onClick={handleSave} className="btn-primary" style={{ padding: '0.5rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Save size={16} /> Sauvegarder</button>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem' }}>
                        {/* Genome Tracks */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div className="glass-panel" style={{ padding: '2rem', height: '100%', minHeight: '500px', display: 'flex', flexDirection: 'column' }}>
                                <div style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem', marginBottom: '2rem' }}>
                                    <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Visualisation Linéaire</h3>
                                </div>

                                {/* GC Content Track */}
                                <div style={{ marginBottom: '2rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                                        <span>GC Content Graph</span>
                                        <span style={{ color: 'var(--accent-hugin)' }}>Avg: {gcContent}%</span>
                                    </div>
                                    <div style={{ height: '60px', background: 'rgba(99, 102, 241, 0.05)', borderRadius: '0.5rem', position: 'relative', overflow: 'hidden' }}>
                                        {/* Mock GC Waveform */}
                                        <svg width="100%" height="100%" preserveAspectRatio="none">
                                            <path d="M0 40 Q 50 10, 100 45 T 200 20 T 300 50 T 400 15 T 500 40 T 600 25 T 700 35 T 800 10 T 900 45" stroke="var(--accent-hugin)" fill="none" strokeWidth="1.5" />
                                        </svg>
                                    </div>
                                </div>

                                {/* CDS Track (+ Strand) */}
                                <div style={{ marginBottom: '1rem' }}>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Forward Strand (+)</div>
                                    <div style={{ height: '80px', background: 'rgba(255,255,255,0.02)', borderRadius: '0.5rem', position: 'relative', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}>
                                        <div style={{ position: 'absolute', width: `${zoom * 100}%`, height: '100%', left: 0 }}>
                                            {features.filter(f => f.strand === '+').map((f, i) => (
                                                <div key={i} style={{
                                                    position: 'absolute', left: `${(f.start / 6000) * 100}%`, width: `${((f.end - f.start) / 6000) * 100}%`,
                                                    height: '30px', top: '25px', background: 'var(--accent-hugin)', borderRadius: '4px',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 600, color: 'white',
                                                    boxShadow: '0 2px 5px rgba(0,0,0,0.3)', cursor: 'pointer'
                                                }}>
                                                    {f.label}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* CDS Track (- Strand) */}
                                <div style={{ marginBottom: '1rem' }}>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Reverse Strand (-)</div>
                                    <div style={{ height: '80px', background: 'rgba(255,255,255,0.02)', borderRadius: '0.5rem', position: 'relative', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}>
                                        <div style={{ position: 'absolute', width: `${zoom * 100}%`, height: '100%', left: 0 }}>
                                            {features.filter(f => f.strand === '-').map((f, i) => (
                                                <div key={i} style={{
                                                    position: 'absolute', left: `${(f.start / 6000) * 100}%`, width: `${((f.end - f.start) / 6000) * 100}%`,
                                                    height: '30px', top: '25px', background: '#ec4899', borderRadius: '4px',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 600, color: 'white',
                                                    boxShadow: '0 2px 5px rgba(0,0,0,0.3)', cursor: 'pointer'
                                                }}>
                                                    {f.label}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Sequence Ruler */}
                                <div style={{ marginTop: 'auto', paddingTop: '2rem' }}>
                                    <div style={{ height: '2px', background: 'rgba(255,255,255,0.1)', position: 'relative', overflow: 'hidden' }}>
                                        <div style={{ position: 'absolute', width: `${zoom * 100}%`, height: '10px', left: 0 }}>
                                            {[0, 1000, 2000, 3000, 4000, 5000, 6000].map(val => (
                                                <div key={val} style={{ position: 'absolute', left: `${(val / 6000) * 100}%`, top: '-5px', textAlign: 'center' }}>
                                                    <div style={{ height: '10px', width: '1px', background: 'rgba(255,255,255,0.5)', margin: '0 auto' }}></div>
                                                    <span style={{ fontSize: '8px', opacity: 0.5 }}>{offset + val}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar: Feature List */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            <div className="glass-panel" style={{ padding: '1.5rem' }}>
                                <h3 style={{ fontSize: '1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Database size={18} color="var(--accent-hugin)" /> Propriétés du Feature
                                </h3>
                                <div style={{ fontSize: '0.85rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
                                        <span style={{ color: 'var(--text-secondary)' }}>Séquence ID:</span>
                                        <span>NC_000913.3</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
                                        <span style={{ color: 'var(--text-secondary)' }}>Longueur:</span>
                                        <span>4,641,652 bp</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
                                        <span style={{ color: 'var(--text-secondary)' }}>GC global:</span>
                                        <span>50.79%</span>
                                    </div>
                                </div>
                                <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.05)', margin: '1.5rem 0' }} />
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                    <h4 style={{ fontSize: '0.9rem', margin: 0 }}>Gènes identifiés (Visible)</h4>
                                    {features.map(f => (
                                        <div key={f.label} style={{ fontSize: '0.8rem', padding: '0.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '0.4rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                                            <div style={{ fontWeight: 600 }}>{f.label}</div>
                                            <div style={{ opacity: 0.6 }}>{f.start} .. {f.end} ({f.strand})</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="glass-panel" style={{ padding: '1.5rem' }}>
                                <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Analyse Statistique</h3>
                                <div style={{ height: '200px', display: 'flex', alignItems: 'flex-end', gap: '5px' }}>
                                    {/* Mock Bar Chart */}
                                    {[30, 70, 45, 90, 60, 85, 40].map((h, i) => (
                                        <div key={i} style={{ flex: 1, background: 'var(--accent-hugin)', height: `${h}%`, borderRadius: '4px 4px 0 0', opacity: 0.5 + (h / 200) }}></div>
                                    ))}
                                </div>
                                <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                    Distribution de l'usage des codons
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Artemis;
