import { useState } from 'react';
import {
    GitBranch, PieChart, Database,
    ArrowLeft, RefreshCw, Plus, Minus
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { ScientificEngine } from '../../logic/ScientificEngine';

const PhyloMega = () => {
    const navigate = useNavigate();
    const [speciesList, setSpeciesList] = useState<string[]>(['S. aureus Newman', 'S. aureus USA300', 'S. aureus MW2', 'S. aureus NCTC8325']);
    const [distances, setDistances] = useState<number[][] | null>(null);
    const [tree, setTree] = useState<string | null>(null);
    const [isAnalysisRunning, setIsAnalysisRunning] = useState(false);
    const [bootstraps, setBootstraps] = useState<string | null>(null);

    const handleAddSpecies = () => {
        if (speciesList.length < 30) {
            setSpeciesList([...speciesList, `New_Strain_${speciesList.length + 1}`]);
        }
    };

    const handleRemoveSpecies = (index: number) => {
        if (speciesList.length > 2) {
            setSpeciesList(speciesList.filter((_, i) => i !== index));
        }
    };

    const handleSpeciesChange = (index: number, value: string) => {
        const newList = [...speciesList];
        newList[index] = value;
        setSpeciesList(newList);
    };

    const runAnalysis = () => {
        setIsAnalysisRunning(true);
        setTimeout(() => {
            const matrix = ScientificEngine.bacteriology.calculatePhyloDistances(speciesList);
            const newick = ScientificEngine.bacteriology.buildNJTree(speciesList);
            const boot = ScientificEngine.bacteriology.runBootstrapTest(speciesList, 100);

            setDistances(matrix);
            setTree(newick);
            setBootstraps(boot);
            setIsAnalysisRunning(false);
        }, 1500);
    };

    const renderTree = () => {
        if (!tree) return null;

        const count = speciesList.length;
        const leafHeight = 30; // pixels per leaf
        const padding = 40;
        const width = 600;
        const height = Math.max(400, count * leafHeight + padding * 2);

        const plotPaddingLeft = 50;
        const plotPaddingRight = 180; // Space for labels
        const plotWidth = width - plotPaddingLeft - plotPaddingRight;
        const plotHeight = height - padding * 2;

        const stepY = plotHeight / (count - 1 || 1);

        return (
            <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
                <g stroke="var(--accent-hugin)" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    {/* Trunk */}
                    <path d={`M ${plotPaddingLeft} ${height / 2} L ${plotPaddingLeft + 30} ${height / 2}`} />

                    {/* Main Vertical Bar */}
                    <path d={`M ${plotPaddingLeft + 30} ${padding} L ${plotPaddingLeft + 30} ${height - padding}`} />

                    {/* Horizontal branches and labels */}
                    {speciesList.map((s, i) => {
                        const y = padding + i * stepY;
                        return (
                            <g key={i}>
                                {/* Branch */}
                                <path d={`M ${plotPaddingLeft + 30} ${y} L ${plotPaddingLeft + 30 + plotWidth} ${y}`} />
                                <circle cx={plotPaddingLeft + 30} cy={y} r="2" fill="var(--accent-hugin)" />

                                {/* Label */}
                                <text
                                    x={plotPaddingLeft + 30 + plotWidth + 10}
                                    y={y + 4}
                                    fill="white"
                                    fontSize="11"
                                    fontFamily="'Inter', sans-serif"
                                    fontWeight="500"
                                >
                                    {s}
                                </text>

                                {/* Mock Bootstrap value for some branches */}
                                {i % 3 === 0 && (
                                    <text
                                        x={plotPaddingLeft + 35}
                                        y={y - 5}
                                        fill="#10b981"
                                        fontSize="9"
                                        fontWeight="bold"
                                    >
                                        {90 + (i % 10)}
                                    </text>
                                )}
                            </g>
                        );
                    })}
                </g>
            </svg>
        );
    };

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-main)', color: 'white' }}>
            <Navbar />

            <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                    <button
                        onClick={() => navigate('/hugin')}
                        style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: 'white', padding: '0.8rem', borderRadius: '1rem', cursor: 'pointer' }}
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 style={{ fontSize: '2rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <GitBranch className="text-gradient" /> MEGA Evolutionary Analysis
                        </h1>
                        <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Phylogenetic Trees • Genetic Distance Matrix • Bootstrap Support</p>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '400px 1fr', gap: '2rem' }}>
                    {/* Left Panel: Configuration */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <div className="glass-panel" style={{ padding: '2rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Liste des Souches ({speciesList.length})</h3>
                                <button
                                    onClick={handleAddSpecies}
                                    style={{ background: 'var(--accent-hugin)', border: 'none', color: 'white', padding: '0.4rem 0.8rem', borderRadius: '0.5rem', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                                >
                                    <Plus size={14} /> Ajouter
                                </button>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', maxHeight: '400px', overflowY: 'auto', paddingRight: '0.5rem' }}>
                                {speciesList.map((s, i) => (
                                    <div key={i} style={{ display: 'flex', gap: '0.5rem' }}>
                                        <input
                                            value={s}
                                            onChange={(e) => handleSpeciesChange(i, e.target.value)}
                                            style={{ flex: 1, background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '0.6rem', borderRadius: '0.5rem', fontSize: '0.85rem' }}
                                        />
                                        <button
                                            onClick={() => handleRemoveSpecies(i)}
                                            style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#ef4444', padding: '0.4rem', borderRadius: '0.5rem', cursor: 'pointer' }}
                                        >
                                            <Minus size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <div style={{ marginTop: '2rem' }}>
                                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Modèle de Substitution</label>
                                <select style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '0.8rem', borderRadius: '0.5rem', marginBottom: '1.5rem' }}>
                                    <option>Jukes-Cantor (JC)</option>
                                    <option>Kimura 2-parameter (K2P)</option>
                                    <option>Tamura-Nei (TN93)</option>
                                    <option>Maximum Likelihood</option>
                                </select>

                                <button
                                    className="btn-primary"
                                    style={{ width: '100%', padding: '1rem' }}
                                    onClick={runAnalysis}
                                    disabled={isAnalysisRunning}
                                >
                                    {isAnalysisRunning ? <RefreshCw className="animate-spin" /> : 'Lancer l\'Analyse Phylogénique'}
                                </button>
                            </div>
                        </div>

                        {distances && (
                            <div className="glass-panel" style={{ padding: '1.5rem' }}>
                                <h3 style={{ fontSize: '1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Database size={18} color="var(--accent-hugin)" /> Materiality Matrix
                                </h3>
                                <div style={{ overflowX: 'auto' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10px' }}>
                                        <thead>
                                            <tr>
                                                <th style={{ padding: '4px' }}></th>
                                                {speciesList.slice(0, 5).map((s, i) => (
                                                    <th key={i} style={{ padding: '4px', opacity: 0.5 }}>{s.substring(0, 3)}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {distances.slice(0, 5).map((row, i) => (
                                                <tr key={i}>
                                                    <td style={{ padding: '4px', opacity: 0.5 }}>{speciesList[i].substring(0, 3)}</td>
                                                    {row.slice(0, 5).map((d, j) => (
                                                        <td key={j} style={{ padding: '4px', textAlign: 'center', background: i === j ? 'rgba(99,102,241,0.1)' : 'transparent' }}>
                                                            {d.toFixed(3)}
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    {speciesList.length > 5 && <div style={{ textAlign: 'center', fontSize: '9px', marginTop: '5px', opacity: 0.5 }}>... matrix truncated ...</div>}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Panel: Visualization */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', minHeight: '600px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                <h3 style={{ margin: 0 }}>Arbre de Consensus (Neighbor-Joining)</h3>
                                {bootstraps && (
                                    <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '0.4rem 0.8rem', borderRadius: '2rem', fontSize: '0.75rem', fontWeight: 600 }}>
                                        Bootstrap Support: {bootstraps}
                                    </div>
                                )}
                            </div>

                            {tree ? (
                                <div style={{ flex: 1, background: 'rgba(0,0,0,0.2)', borderRadius: '1rem', padding: '2rem', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', border: '1px dashed rgba(255,255,255,0.1)', overflowY: 'auto' }}>
                                    <div style={{ textAlign: 'center' }}>
                                        {renderTree()}
                                        <div style={{ marginTop: '1.5rem', background: 'rgba(0,0,0,0.3)', padding: '0.8rem', borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.05)', maxWidth: '600px' }}>
                                            <code style={{ fontSize: '0.8rem', color: '#a5b4fc', wordBreak: 'break-all' }}>Newick: {tree}</code>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.3, flexDirection: 'column', gap: '1rem' }}>
                                    <PieChart size={64} />
                                    <p>Configurez les souches et lancez l'analyse pour visualiser l'arbre.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PhyloMega;
