import { useState } from 'react';
import {
    Fingerprint, List, Microscope, Layers,
    ArrowLeft, RefreshCw,
    Search, FileText, ChevronRight, Activity
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { ScientificEngine } from '../../logic/ScientificEngine';

const BioNumerics = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'mlst' | 'pfge'>('mlst');
    const [alleles, setAlleles] = useState<number[]>([1, 1, 1, 1, 1, 1, 1]);
    const [stResult, setStResult] = useState<string | null>(null);
    const [enzyme, setEnzyme] = useState('XbaI');
    const [gelBands, setGelBands] = useState<any[] | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleMLST = () => {
        setIsProcessing(true);
        setTimeout(() => {
            const st = ScientificEngine.bacteriology.matchMLST(alleles);
            setStResult(st);
            setIsProcessing(false);
        }, 1000);
    };

    const handlePFGE = () => {
        setIsProcessing(true);
        setTimeout(() => {
            const bands = ScientificEngine.bacteriology.simulatePFGE(enzyme);
            setGelBands(bands);
            setIsProcessing(false);
        }, 1200);
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
                            <Fingerprint className="text-gradient" /> BioNumerics
                        </h1>
                        <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Professional Bacterial Typing • PFGE Fingerprinting & MLST Typing</p>
                    </div>
                </div>

                {/* Tabs */}
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                    <button
                        onClick={() => setActiveTab('mlst')}
                        className={`glass-panel ${activeTab === 'mlst' ? 'active-tab' : ''}`}
                        style={{
                            padding: '1rem 2rem', border: activeTab === 'mlst' ? '1px solid var(--accent-hugin)' : '1px solid rgba(255,255,255,0.1)',
                            background: activeTab === 'mlst' ? 'rgba(99, 102, 241, 0.1)' : 'transparent', cursor: 'pointer', transition: '0.3s'
                        }}
                    >
                        Multi-Locus Sequence Typing (MLST)
                    </button>
                    <button
                        onClick={() => setActiveTab('pfge')}
                        className={`glass-panel ${activeTab === 'pfge' ? 'active-tab' : ''}`}
                        style={{
                            padding: '1rem 2rem', border: activeTab === 'pfge' ? '1px solid var(--accent-hugin)' : '1px solid rgba(255,255,255,0.1)',
                            background: activeTab === 'pfge' ? 'rgba(99, 102, 241, 0.1)' : 'transparent', cursor: 'pointer', transition: '0.3s'
                        }}
                    >
                        Electrophorèse (PFGE)
                    </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem' }}>
                    {/* Main Workspace */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        {activeTab === 'mlst' ? (
                            <div className="glass-panel" style={{ padding: '2rem' }}>
                                <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <List size={20} color="var(--accent-hugin)" /> Profil Allélique
                                </h3>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
                                    {alleles.map((a, i) => (
                                        <div key={i}>
                                            <label style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.4rem' }}>Locus {i + 1}</label>
                                            <input
                                                type="number" value={a}
                                                onChange={(e) => {
                                                    const newAlleles = [...alleles];
                                                    newAlleles[i] = parseInt(e.target.value) || 0;
                                                    setAlleles(newAlleles);
                                                }}
                                                style={{ width: '100%', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '0.8rem', borderRadius: '0.5rem', textAlign: 'center' }}
                                            />
                                        </div>
                                    ))}
                                </div>
                                <button className="btn-primary" onClick={handleMLST} disabled={isProcessing} style={{ padding: '1rem 2rem' }}>
                                    {isProcessing ? <RefreshCw className="animate-spin" size={18} /> : 'Identifier le Sequence Type (ST)'}
                                </button>

                                {stResult && (
                                    <div style={{ marginTop: '2rem', padding: '2rem', background: 'rgba(16, 185, 129, 0.05)', border: '1px solid #10b981', borderRadius: '1rem', textAlign: 'center' }}>
                                        <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Identification Réussie</div>
                                        <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#10b981' }}>{stResult}</div>
                                        <div style={{ fontSize: '0.8rem', marginTop: '0.5rem', opacity: 0.7 }}>Base de données PubMLST synchronisée</div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="glass-panel" style={{ padding: '2rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                    <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Microscope size={20} color="var(--accent-hugin)" /> Analyse de Gel PFGE
                                    </h3>
                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        <select
                                            value={enzyme} onChange={(e) => setEnzyme(e.target.value)}
                                            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '0.5rem', borderRadius: '0.5rem' }}
                                        >
                                            <option value="XbaI">Enzyme: XbaI</option>
                                            <option value="BlnI">Enzyme: BlnI</option>
                                            <option value="NotI">Enzyme: NotI</option>
                                        </select>
                                        <button className="btn-primary" onClick={handlePFGE} disabled={isProcessing}>
                                            {isProcessing ? <RefreshCw className="animate-spin" size={18} /> : 'Analyser les Bandes'}
                                        </button>
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '2rem' }}>
                                    {/* Mock Gel Image */}
                                    <div style={{
                                        width: '100px', height: '400px', background: 'linear-gradient(to bottom, #111, #333)',
                                        borderRadius: '0.5rem', position: 'relative', border: '2px solid #555', margin: '0 auto'
                                    }}>
                                        <div style={{ height: '30px', background: '#222', borderBottom: '1px solid #555', textAlign: 'center', fontSize: '10px', paddingTop: '5px' }}>PUITS</div>
                                        {gelBands ? gelBands.map((b, i) => (
                                            <div key={i} style={{
                                                position: 'absolute', top: `${(b.size / 500) * 100}%`, left: 0, right: 0,
                                                height: '3px', background: `rgba(255,255,255, ${b.intensity})`,
                                                boxShadow: '0 0 5px rgba(255,255,255, 0.5)'
                                            }} />
                                        )) : (
                                            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.1, transform: 'rotate(-90deg)', fontSize: '12px', whiteSpace: 'nowrap' }}>
                                                EN ATTENTE
                                            </div>
                                        )}
                                    </div>

                                    {/* Band Data Table */}
                                    <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '1rem' }}>
                                        <h3 style={{ margin: '0 0 1rem 0', fontSize: '0.9rem' }}>Profil de Restriction</h3>
                                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                                            <thead>
                                                <tr style={{ color: 'var(--text-secondary)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                                    <th style={{ padding: '0.5rem', textAlign: 'left' }}>Bande #</th>
                                                    <th style={{ padding: '0.5rem', textAlign: 'left' }}>Taille (kDa)</th>
                                                    <th style={{ padding: '0.5rem', textAlign: 'left' }}>Intensité</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {gelBands?.map((b, i) => (
                                                    <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                                        <td style={{ padding: '0.5rem' }}>{String(i + 1).padStart(2, '0')}</td>
                                                        <td style={{ padding: '0.5rem', color: 'var(--accent-hugin)', fontWeight: 600 }}>{b.size}</td>
                                                        <td style={{ padding: '0.5rem' }}>{(b.intensity * 100).toFixed(0)}%</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar: Details */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <div className="glass-panel" style={{ padding: '1.5rem' }}>
                            <h3 style={{ fontSize: '1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Layers size={18} color="var(--accent-hugin)" /> Base de Données
                            </h3>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                                <p>BioNumerics centralise les profils moléculaires pour la surveillance épidémiologique.</p>
                                <ul style={{ paddingLeft: '1.2rem', marginTop: '1rem' }}>
                                    <li>PulseNet International</li>
                                    <li>MLST Databases</li>
                                    <li>WG-MLST (Whole Genome)</li>
                                </ul>
                            </div>
                        </div>

                        <div className="glass-panel" style={{ padding: '1.5rem' }}>
                            <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Rapport Automatisé</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                <button style={{ width: '100%', textAlign: 'left', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.8rem', borderRadius: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' }}><FileText size={14} /> PDF Summary</span>
                                    <ChevronRight size={14} />
                                </button>
                                <button style={{ width: '100%', textAlign: 'left', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.8rem', borderRadius: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' }}><Search size={14} /> Compare Database</span>
                                    <ChevronRight size={14} />
                                </button>
                            </div>
                        </div>

                        <div className="glass-panel" style={{ padding: '1.5rem', background: 'rgba(16, 185, 129, 0.05)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                <Activity size={18} color="#10b981" />
                                <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Analyse Active</span>
                            </div>
                            <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>Instance synchronisée avec CDC/PulseNet.</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BioNumerics;
