import { useState } from 'react';
import {
    Activity, Table, ShieldAlert,
    ArrowLeft, Database, Search, FileText, Plus
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { ScientificEngine } from '../../logic/ScientificEngine';

const Whonet = () => {
    const navigate = useNavigate();
    const [patientId] = useState('P-10293');
    const [isolate] = useState('E. coli');
    const [astResults, setAstResults] = useState([
        { antibiotic: 'Ampicillin', mic: 32, sir: 'R' },
        { antibiotic: 'Ciprofloxacin', mic: 0.5, sir: 'S' },
        { antibiotic: 'Gentamicin', mic: 4, sir: 'I' },
        { antibiotic: 'Imipenem', mic: 0.12, sir: 'S' },
    ]);

    const updateSIR = (index: number, mic: number) => {
        const newResults = [...astResults];
        newResults[index].mic = mic;
        newResults[index].sir = ScientificEngine.bacteriology.interpretAST(newResults[index].antibiotic, mic);
        setAstResults(newResults);
    };

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
                            <ShieldAlert className="text-gradient" /> WHONET (AMR)
                        </h1>
                        <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Antimicrobial Resistance Surveillance • AST Data Management & Reporting</p>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem' }}>
                    {/* Main Workspace: Antibiogram Table */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <div className="glass-panel" style={{ padding: '2rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Table size={20} color="var(--accent-hugin)" /> Résultats d'Antibiogramme (AST)
                                </h3>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <div style={{ fontSize: '0.85rem' }}><span style={{ color: 'var(--text-secondary)' }}>Isolat:</span> <span style={{ fontWeight: 600 }}>{isolate}</span></div>
                                    <div style={{ fontSize: '0.85rem' }}><span style={{ color: 'var(--text-secondary)' }}>ID Patient:</span> <span style={{ fontWeight: 600 }}>{patientId}</span></div>
                                </div>
                            </div>

                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ textAlign: 'left', color: 'var(--text-secondary)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                            <th style={{ padding: '1rem' }}>Antibiotique</th>
                                            <th style={{ padding: '1rem' }}>CMI (µg/mL)</th>
                                            <th style={{ padding: '1rem' }}>Interprétation</th>
                                            <th style={{ padding: '1rem' }}>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {astResults.map((r, i) => (
                                            <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                                <td style={{ padding: '1rem', fontWeight: 600 }}>{r.antibiotic}</td>
                                                <td style={{ padding: '1rem' }}>
                                                    <input
                                                        type="number" value={r.mic}
                                                        onChange={(e) => updateSIR(i, parseFloat(e.target.value) || 0)}
                                                        style={{ width: '80px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '0.4rem', borderRadius: '0.4rem', textAlign: 'center' }}
                                                    />
                                                </td>
                                                <td style={{ padding: '1rem' }}>
                                                    <span style={{
                                                        padding: '0.3rem 0.8rem', borderRadius: '2rem', fontSize: '0.8rem', fontWeight: 700,
                                                        background: r.sir === 'S' ? 'rgba(16, 185, 129, 0.1)' : r.sir === 'I' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                                        color: r.sir === 'S' ? '#10b981' : r.sir === 'I' ? '#f59e0b' : '#ef4444',
                                                        border: `1px solid ${r.sir === 'S' ? '#10b981' : r.sir === 'I' ? '#f59e0b' : '#ef4444'}`
                                                    }}>
                                                        {r.sir === 'S' ? 'Sensible' : r.sir === 'I' ? 'Intermédiaire' : 'Résistant'}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '1rem' }}>
                                                    <button style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}><Plus size={16} /></button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Summary Stats */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                            <div className="glass-panel" style={{ padding: '2rem' }}>
                                <h4 style={{ margin: '0 0 1rem 0', fontSize: '1rem' }}>Profil de Résistance Global</h4>
                                <div style={{ height: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '5px', overflow: 'hidden', display: 'flex', marginBottom: '1rem' }}>
                                    <div style={{ width: '40%', background: '#10b981' }}></div>
                                    <div style={{ width: '20%', background: '#f59e0b' }}></div>
                                    <div style={{ width: '40%', background: '#ef4444' }}></div>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                    <span>Sensible: 40%</span>
                                    <span>Intérm: 20%</span>
                                    <span>Résistant: 40%</span>
                                </div>
                            </div>
                            <div className="glass-panel" style={{ padding: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <button className="btn-primary" style={{ padding: '1rem 2rem' }}>
                                    Exporter le Rapport OMS (.bac)
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar: Database & Alerts */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <div className="glass-panel" style={{ padding: '1.5rem' }}>
                            <h3 style={{ fontSize: '1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Database size={18} color="var(--accent-hugin)" /> CLSI / EUCAST 2024
                            </h3>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                                <p>Interprétation automatique basée sur les derniers seuils critiques (Breakpoints).</p>
                                <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(245, 158, 11, 0.05)', border: '1px solid #f59e0b', borderRadius: '0.5rem', color: '#f59e0b' }}>
                                    <div style={{ fontWeight: 600, marginBottom: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}><ShieldAlert size={14} /> Alerte MDRO</div>
                                    <span style={{ fontSize: '0.75rem' }}>Profil suspect de BLSE détecté sur cet isolat.</span>
                                </div>
                            </div>
                        </div>

                        <div className="glass-panel" style={{ padding: '1.5rem' }}>
                            <h3 style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>Actions WHONET</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                <button className="btn-secondary" style={{ width: '100%', textAlign: 'left', fontSize: '0.8rem' }}>
                                    <Plus size={14} /> Ajouter un Antibio
                                </button>
                                <button className="btn-secondary" style={{ width: '100%', textAlign: 'left', fontSize: '0.8rem' }}>
                                    <Search size={14} /> Rechercher Isolat
                                </button>
                                <button className="btn-secondary" style={{ width: '100%', textAlign: 'left', fontSize: '0.8rem' }}>
                                    <FileText size={14} /> Générer Cumulative
                                </button>
                            </div>
                        </div>

                        <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center' }}>
                            <Activity size={32} color="var(--accent-hugin)" style={{ margin: '0 auto 1rem auto' }} />
                            <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>Réseau de Surveillance</div>
                            <div style={{ fontSize: '0.7rem', opacity: 0.6 }}>Connecté au réseau national de santé.</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Whonet;
