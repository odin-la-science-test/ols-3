import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    ChevronLeft, Settings, Database, Activity,
    Calendar, CheckCircle, Package, ShieldCheck, Users,
    Dna, Locate, Zap, Layers, RefreshCw, FlaskConical,
    Maximize, Shield, GitBranch, Eye, BarChart3, ClipboardList,
    AlertTriangle, TrendingUp, Filter, FileCheck, Box, Clock, Link,
    Search, FileText, Wind, Map, Globe, Calculator, Lightbulb,
    GitMerge, Target, RotateCw, UserCheck, CheckCircle2, Camera,
    AlertCircle, Sun, Hash, Hexagon, PlusCircle, Minimize2, Trash2,
    Heart, Watch, MinusCircle, PieChart, Bell, TrendingDown, Shuffle,
    Thermometer, Barcode, Truck, Wrench, Scale, Tag, CheckSquare,
    CloudRain, PauseCircle, ScatterChart, AlignLeft, Book, BarChart,
    Anchor, AlertOctagon, Repeat, History, ArrowDown, Droplets, BookOpen,
    Snowflake, Cpu, Award
} from 'lucide-react';
import { advancedModules, type Tool as ToolType } from '../../data/modulesConfig';
import { ScientificEngine } from '../../logic/ScientificEngine';

const iconMap: Record<string, React.ReactNode> = {
    Calendar: <Calendar size={18} />,
    CheckCircle: <CheckCircle size={18} />,
    Package: <Package size={18} />,
    ShieldCheck: <ShieldCheck size={18} />,
    Users: <Users size={18} />,
    Dna: <Dna size={18} />,
    Locate: <Locate size={18} />,
    Zap: <Zap size={18} />,
    Layers: <Layers size={18} />,
    RefreshCw: <RefreshCw size={18} />,
    FlaskConical: <FlaskConical size={18} />,
    Maximize: <Maximize size={18} />,
    Shield: <Shield size={18} />,
    GitBranch: <GitBranch size={18} />,
    Eye: <Eye size={18} />,
    BarChart3: <BarChart3 size={18} />,
    ClipboardList: <ClipboardList size={18} />,
    AlertTriangle: <AlertTriangle size={18} />,
    TrendingUp: <TrendingUp size={18} />,
    Filter: <Filter size={18} />,
    FileCheck: <FileCheck size={18} />,
    Box: <Box size={18} />,
    Clock: <Clock size={18} />,
    Link: <Link size={18} />,
    Activity: <Activity size={18} />,
    Settings: <Settings size={18} />,
    Search: <Search size={18} />,
    FileText: <FileText size={18} />,
    Wind: <Wind size={18} />,
    Map: <Map size={18} />,
    Globe: <Globe size={18} />,
    Calculator: <Calculator size={18} />,
    Lightbulb: <Lightbulb size={18} />,
    GitMerge: <GitMerge size={18} />,
    Target: <Target size={18} />,
    RotateCw: <RotateCw size={18} />,
    UserCheck: <UserCheck size={18} />,
    CheckCircle2: <CheckCircle2 size={18} />,
    Camera: <Camera size={18} />,
    AlertCircle: <AlertCircle size={18} />,
    Sun: <Sun size={18} />,
    Hash: <Hash size={18} />,
    Hexagon: <Hexagon size={18} />,
    PlusCircle: <PlusCircle size={18} />,
    Minimize2: <Minimize2 size={18} />,
    Trash2: <Trash2 size={18} />,
    Heart: <Heart size={18} />,
    Watch: <Watch size={18} />,
    MinusCircle: <MinusCircle size={18} />,
    PieChart: <PieChart size={18} />,
    Bell: <Bell size={18} />,
    TrendingDown: <TrendingDown size={18} />,
    Shuffle: <Shuffle size={18} />,
    Thermometer: <Thermometer size={18} />,
    Barcode: <Barcode size={18} />,
    Truck: <Truck size={18} />,
    Wrench: <Wrench size={18} />,
    Scale: <Scale size={18} />,
    Tag: <Tag size={18} />,
    CheckSquare: <CheckSquare size={18} />,
    CloudRain: <CloudRain size={18} />,
    PauseCircle: <PauseCircle size={18} />,
    ScatterChart: <ScatterChart size={18} />,
    AlignLeft: <AlignLeft size={18} />,
    Book: <Book size={18} />,
    BarChart: <BarChart size={18} />,
    Anchor: <Anchor size={18} />,
    AlertOctagon: <AlertOctagon size={18} />,
    Repeat: <Repeat size={18} />,
    History: <History size={18} />,
    ArrowDown: <ArrowDown size={18} />,
    Database: <Database size={18} />,
    Droplets: <Droplets size={18} />,
    BookOpen: <BookOpen size={18} />,
    Snowflake: <Snowflake size={18} />,
    Cpu: <Cpu size={18} />,
    Award: <Award size={18} />,
};

const AdvancedModule = () => {
    const { moduleId } = useParams();
    const navigate = useNavigate();
    const module = advancedModules.find(m => m.id === moduleId);

    const [activeToolId, setActiveToolId] = useState<string | null>(null);

    if (!module) {
        return <div style={{ padding: '5rem', textAlign: 'center' }}>Module non trouvé</div>;
    }

    const allTools = [...module.managementTools, ...module.informaticsTools];
    const currentTool = allTools.find(t => t.id === activeToolId) || allTools[0];

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', color: 'white', display: 'flex', flexDirection: 'column' }}>
            <header className="glass-panel" style={{ padding: '1.5rem 2rem', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <button onClick={() => navigate('/hugin')} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: 'inherit', padding: '0.6rem', borderRadius: '0.75rem', cursor: 'pointer' }}>
                        <ChevronLeft size={20} />
                    </button>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ padding: '0.75rem', background: 'rgba(99, 102, 241, 0.2)', borderRadius: '1rem', color: 'var(--accent-hugin)' }}>
                            {currentTool && iconMap[currentTool.icon] ? iconMap[currentTool.icon] : <Settings size={24} />}
                        </div>
                        <div>
                            <h1 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>{module.name}</h1>
                            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{module.category} - Intelligence Lab Suite</p>
                        </div>
                    </div>
                </div>
            </header>

            <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'minmax(300px, 340px) 1fr', gap: '2rem', padding: '2rem' }}>
                <aside style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div className="glass-panel" style={{ padding: '1.5rem' }}>
                        <h3 style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--accent-hugin)', letterSpacing: '0.1em', marginBottom: '1rem', fontWeight: 700 }}>Management</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {module.managementTools.map(tool => (
                                <ToolButton
                                    key={tool.id}
                                    active={currentTool.id === tool.id}
                                    tool={tool}
                                    onClick={() => setActiveToolId(tool.id)}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="glass-panel" style={{ padding: '1.5rem' }}>
                        <h3 style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#10b981', letterSpacing: '0.1em', marginBottom: '1rem', fontWeight: 700 }}>Informatique & Simulation</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {module.informaticsTools.map(tool => (
                                <ToolButton
                                    key={tool.id}
                                    active={currentTool.id === tool.id}
                                    tool={tool}
                                    onClick={() => setActiveToolId(tool.id)}
                                    accentColor="#10b981"
                                />
                            ))}
                        </div>
                    </div>
                </aside>

                <main>
                    <div className="glass-panel" style={{ padding: '3rem', minHeight: '750px', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2.5rem' }}>
                            <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '1.5rem', color: currentTool?.type !== 'registry' ? '#10b981' : 'var(--accent-hugin)' }}>
                                {React.cloneElement(iconMap[currentTool.icon] as React.ReactElement<any>, { size: 40 })}
                            </div>
                            <div>
                                <h2 style={{ fontSize: '2rem', margin: 0, fontWeight: 800 }}>{currentTool.label}</h2>
                                <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>{currentTool.description}</p>
                            </div>
                        </div>

                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <ToolResolver tool={currentTool} category={module.category} />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

const ToolResolver = ({ tool, category }: { tool: ToolType, category: any }) => {
    switch (tool.type) {
        case 'calculator':
            return <ScientificCalculator tool={tool} category={category} />;
        case 'analyzer':
            return <ScientificAnalyzer tool={tool} category={category} />;
        case 'simulation':
            return <ProcessSimulation tool={tool} category={category} />;
        case 'monitor':
            return <RealTimeMonitor tool={tool} category={category} />;
        case 'registry':
        default:
            return <RecordRegistry tool={tool} category={category} />;
    }
};

const ScientificCalculator = ({ tool }: any) => {
    const [inputs, setInputs] = useState<any>({ v1: 1, v2: 10, v3: 0.5 });
    const [result, setResult] = useState<any>(null);

    const calculate = () => {

        if (tool.id.includes('blast_n') || tool.id.includes('blast_p')) {
            const results = ScientificEngine.bacteriology.blastSearch(inputs.v1_seq || 'ATGCGT', tool.id.includes('_p') ? 'protein' : 'dna');
            setResult({ type: 'blast', data: results });
        } else if (tool.id.includes('e_value')) {
            const eVal = (ScientificEngine.bacteriology as any).calculateEValue(parseFloat(inputs.v1) || 50, 500);
            setResult(`Expect (E) Value: ${eVal}`);
        }

        else if (tool.id.includes('viability')) {
            setResult(`${ScientificEngine.cellCulture.calculateViability(inputs.v1, inputs.v2 || 100).toFixed(2)}%`);
        } else if (tool.id.includes('indices')) {
            const res = ScientificEngine.hematology.calculateIndices(14, 42, 4.5);
            setResult(`MCV: ${res.mcv.toFixed(1)}, MCH: ${res.mch.toFixed(1)}`);
        } else if (tool.id.includes('mm_fit')) {
            setResult(`${ScientificEngine.biochemistry.calculateReactionRate(100, 5, inputs.v1).toFixed(2)} units/sec`);
        } else {
            setResult("Traitement algorithmique terminé.");
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', padding: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div className="glass-panel" style={{ padding: '1.5rem' }}>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        {tool.id.includes('blast') ? 'Séquence Query (FASTA)' : 'Paramètre Global'}
                    </label>
                    {tool.id.includes('blast') ? (
                        <textarea
                            value={inputs.v1_seq || ''}
                            onChange={(e) => setInputs({ ...inputs, v1_seq: e.target.value })}
                            placeholder=">sequence_1\nATGCGT..."
                            style={{ width: '100%', minHeight: '100px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '0.8rem', borderRadius: '0.5rem', marginTop: '0.5rem' }}
                        />
                    ) : (
                        <input
                            type="number"
                            value={inputs.v1}
                            onChange={(e) => setInputs({ ...inputs, v1: parseFloat(e.target.value) })}
                            style={{ width: '100%', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '0.8rem', borderRadius: '0.5rem', marginTop: '0.5rem' }}
                        />
                    )}
                </div>
            </div>
            <button className="btn-primary" onClick={calculate} style={{ alignSelf: 'flex-start', padding: '1rem 3rem' }}>Lancer l'Algorithme</button>

            {result && result.type === 'blast' ? (
                <div className="glass-panel" style={{ padding: '1.5rem', border: '1px solid #10b981', background: 'rgba(16, 185, 129, 0.05)' }}>
                    <h3 style={{ margin: 0, fontSize: '0.9rem', color: '#10b981', marginBottom: '1rem' }}>RÉSULTATS DU BLAST (NCBI)</h3>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', fontSize: '0.85rem' }}>
                            <thead>
                                <tr style={{ color: 'var(--text-secondary)' }}>
                                    <th style={{ textAlign: 'left', padding: '0.5rem' }}>Accession</th>
                                    <th style={{ textAlign: 'left', padding: '0.5rem' }}>Description</th>
                                    <th style={{ textAlign: 'left', padding: '0.5rem' }}>Score</th>
                                    <th style={{ textAlign: 'left', padding: '0.5rem' }}>E-Value</th>
                                    <th style={{ textAlign: 'left', padding: '0.5rem' }}>Identity</th>
                                </tr>
                            </thead>
                            <tbody>
                                {result.data.map((row: any, i: number) => (
                                    <tr key={i} style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                                        <td style={{ padding: '0.5rem', color: 'var(--accent-hugin)' }}>{row.accession}</td>
                                        <td style={{ padding: '0.5rem' }}>{row.description}</td>
                                        <td style={{ padding: '0.5rem' }}>{row.score}</td>
                                        <td style={{ padding: '0.5rem' }}>{row.eValue}</td>
                                        <td style={{ padding: '0.5rem', fontWeight: 700 }}>{row.identity}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : result && (
                <div className="glass-panel" style={{ padding: '2rem', border: '1px solid #10b981', background: 'rgba(16, 185, 129, 0.05)' }}>
                    <h3 style={{ margin: 0, fontSize: '0.9rem', color: '#10b981' }}>RÉSULTAT DU MOTEUR SCIENTIFIQUE</h3>
                    <div style={{ fontSize: '2rem', fontWeight: 800, marginTop: '1rem' }}>{typeof result === 'string' ? result : JSON.stringify(result)}</div>
                </div>
            )}
        </div>
    );
};

const ScientificAnalyzer = ({ tool }: any) => {
    return (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ flex: 1, background: 'rgba(0,0,0,0.2)', borderRadius: '1.5rem', padding: '2rem', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                    <h4 style={{ margin: 0 }}>Visualisation Morphologique / Génomique</h4>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="btn-secondary" style={{ padding: '0.3rem 0.8rem', fontSize: '0.7rem' }}>Zoom</button>
                        <button className="btn-secondary" style={{ padding: '0.3rem 0.8rem', fontSize: '0.7rem' }}>Filter</button>
                    </div>
                </div>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.1 }}>
                    <Activity size={120} />
                </div>
                <div style={{ height: '100px', display: 'flex', gap: '4px', alignItems: 'flex-end' }}>
                    {Array.from({ length: 50 }).map((_, i) => (
                        <div key={i} style={{ flex: 1, background: '#10b981', height: `${Math.random() * 100}%`, opacity: 0.5 }}></div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const ProcessSimulation = ({ tool }: any) => {
    const [active, setActive] = useState(false);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (active) {
            const timer = setInterval(() => {
                setProgress(p => (p >= 100 ? 100 : p + 1));
            }, 100);
            return () => clearInterval(timer);
        }
    }, [active]);

    return (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2rem', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ width: '200px', height: '200px', borderRadius: '50%', border: '8px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                <div style={{ position: 'absolute', width: '100%', height: '100%', borderRadius: '50%', border: '8px solid #10b981', borderTopColor: 'transparent', animation: active ? 'spin 2s linear infinite' : 'none' }}></div>
                <Zap size={60} color={active ? '#10b981' : 'white'} style={{ opacity: active ? 1 : 0.2 }} />
            </div>
            <div style={{ textAlign: 'center' }}>
                <h3>{active ? "Simulation en cours" : "Simulation en pause"}</h3>
                <p style={{ color: 'var(--text-secondary)' }}>Workflow: {tool.label}</p>
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
                <button className="btn-primary" onClick={() => setActive(!active)}>{active ? "Arrêter" : "Initialiser"}</button>
                <button className="btn-secondary">Réinitialiser</button>
            </div>
            <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        </div>
    );
};

const RealTimeMonitor = ({ tool }: any) => {
    const [value, setValue] = useState(50);
    useEffect(() => {
        const t = setInterval(() => setValue(v => v + (Math.random() * 2 - 1)), 1000);
        return () => clearInterval(t);
    }, []);

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Valeur Instantanée</label>
                <div style={{ fontSize: '4rem', fontWeight: 900, color: '#10b981' }}>{value.toFixed(2)}</div>
                <div style={{ display: 'flex', gap: '2px', height: '40px', alignItems: 'flex-end' }}>
                    {Array.from({ length: 20 }).map((_, i) => (
                        <div key={i} style={{ flex: 1, background: '#10b981', height: `${Math.random() * 100}%`, opacity: 0.3 }}></div>
                    ))}
                </div>
            </div>
            <div className="glass-panel" style={{ padding: '2rem' }}>
                <h4>Statut du Système</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Stabilité</span><span style={{ color: '#10b981' }}>OPTIMALE</span></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Connectivité</span><span style={{ color: '#10b981' }}>OK</span></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Alertes</span><span style={{ color: value > 60 ? '#ef4444' : 'white' }}>0</span></div>
                </div>
            </div>
        </div>
    );
};

const RecordRegistry = ({ tool }: any) => {
    const data = useMemo(() => Array.from({ length: 8 }).map(() => ({
        id: Math.random().toString(36).substr(2, 6).toUpperCase(),
        date: new Date().toLocaleDateString(),
        status: ['Validé', 'En attente', 'Complété'][Math.floor(Math.random() * 3)]
    })), [tool.id]);

    return (
        <div className="glass-panel" style={{ flex: 1, padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead style={{ background: 'rgba(255,255,255,0.05)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    <tr>
                        <th style={{ padding: '1rem 1.5rem' }}>ID ENREGISTREMENT</th>
                        <th style={{ padding: '1rem 1.5rem' }}>DATE</th>
                        <th style={{ padding: '1rem 1.5rem' }}>STATUT</th>
                        <th style={{ padding: '1rem 1.5rem' }}>ACTIONS</th>
                    </tr>
                </thead>
                <tbody style={{ fontSize: '0.9rem' }}>
                    {data.map((row, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                            <td style={{ padding: '1rem 1.5rem', fontFamily: 'monospace' }}>{row.id}</td>
                            <td style={{ padding: '1rem 1.5rem' }}>{row.date}</td>
                            <td style={{ padding: '1rem 1.5rem' }}>
                                <span style={{ padding: '0.25rem 0.6rem', background: 'rgba(255,255,255,0.05)', borderRadius: '0.5rem', fontSize: '0.75rem' }}>{row.status}</span>
                            </td>
                            <td style={{ padding: '1rem 1.5rem' }}>
                                <button style={{ background: 'none', border: 'none', color: 'var(--accent-hugin)', cursor: 'pointer', fontSize: '0.8rem' }}>Consulter</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const ToolButton = ({ active, tool, onClick, accentColor = 'var(--accent-hugin)' }: { active: boolean, tool: ToolType, onClick: () => void, accentColor?: string }) => {
    const icon = iconMap[tool.icon] || <Activity size={18} />;

    return (
        <button
            onClick={onClick}
            style={{
                display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.8rem 1.2rem', borderRadius: '1rem',
                background: active ? `rgba(${accentColor === '#10b981' ? '16, 185, 129' : '99, 102, 241'}, 0.12)` : 'rgba(255,255,255,0.02)',
                color: active ? accentColor : 'var(--text-secondary)',
                border: active ? `1px solid ${accentColor}55` : '1px solid rgba(255,255,255,0.05)',
                cursor: 'pointer', textAlign: 'left', width: '100%', transition: 'all 0.2s',
                boxShadow: active ? `0 0 20px -5px ${accentColor}33` : 'none'
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '20px' }}>
                {icon}
            </div>
            <span style={{ fontWeight: 600, fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{tool.label}</span>
        </button>
    );
};

export default AdvancedModule;
