import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Calculator, ChevronLeft, Beaker, Zap,
    RefreshCcw
} from 'lucide-react';

const BioToolBox = () => {
    const navigate = useNavigate();
    const [activeTool, setActiveTool] = useState<'molarity' | 'dilution' | 'conversion'>('molarity');

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', color: 'white', display: 'flex', flexDirection: 'column' }}>
            <header className="glass-panel" style={{ padding: '1.5rem 2rem', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <button onClick={() => navigate('/hugin')} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: 'inherit', padding: '0.6rem', borderRadius: '0.75rem', cursor: 'pointer' }}>
                        <ChevronLeft size={20} />
                    </button>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ padding: '0.75rem', background: 'rgba(59, 130, 246, 0.2)', borderRadius: '1rem', color: '#3b82f6' }}>
                            <Calculator size={24} />
                        </div>
                        <div>
                            <h1 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>BioToolBox</h1>
                            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Calculateurs scientifiques essentiels</p>
                        </div>
                    </div>
                </div>
            </header>

            <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '280px 1fr', gap: '2rem', padding: '2rem' }}>
                <aside style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <ToolNavButton
                        active={activeTool === 'molarity'}
                        icon={<Beaker size={18} />}
                        label="Molarité"
                        onClick={() => setActiveTool('molarity')}
                    />
                    <ToolNavButton
                        active={activeTool === 'dilution'}
                        icon={<RefreshCcw size={18} />}
                        label="Dilutions (C1V1=C2V2)"
                        onClick={() => setActiveTool('dilution')}
                    />
                    <ToolNavButton
                        active={activeTool === 'conversion'}
                        icon={<Zap size={18} />}
                        label="Unités & Masse"
                        onClick={() => setActiveTool('conversion')}
                    />
                </aside>

                <main>
                    <div className="glass-panel" style={{ padding: '2.5rem', minHeight: '500px' }}>
                        {activeTool === 'molarity' && <MolarityCalculator />}
                        {activeTool === 'dilution' && <DilutionCalculator />}
                        {activeTool === 'conversion' && <ConversionCalculator />}
                    </div>
                </main>
            </div>
        </div>
    );
};

const ToolNavButton = ({ active, icon, label, onClick }: any) => (
    <button
        onClick={onClick}
        style={{
            display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', borderRadius: '0.75rem',
            background: active ? 'rgba(59, 130, 246, 0.15)' : 'rgba(255,255,255,0.02)',
            color: active ? '#3b82f6' : 'var(--text-secondary)',
            border: active ? '1px solid rgba(59, 130, 246, 0.3)' : '1px solid rgba(255,255,255,0.05)',
            cursor: 'pointer', textAlign: 'left', width: '100%', transition: 'all 0.2s'
        }}
    >
        {icon} <span style={{ fontWeight: 600 }}>{label}</span>
    </button>
);

const MolarityCalculator = () => {
    const [mw, setMw] = useState<number>(0);
    const [concentration, setConcentration] = useState<number>(0);
    const [volume, setVolume] = useState<number>(0);

    const mass = (mw * concentration * volume).toFixed(4);

    return (
        <div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Beaker color="#3b82f6" /> Calcul de Molarité
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <InputGroup label="Masse Molaire (g/mol)" value={mw} onChange={setMw} />
                    <InputGroup label="Concentration Souhaitée (M)" value={concentration} onChange={setConcentration} />
                    <InputGroup label="Volume Final (L)" value={volume} onChange={setVolume} />
                </div>
                <div style={{ background: 'rgba(59, 130, 246, 0.05)', borderRadius: '1.5rem', padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', border: '1px solid rgba(59, 130, 246, 0.1)' }}>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>Masse de soluté requise :</div>
                    <div style={{ fontSize: '3rem', fontWeight: 800, color: '#3b82f6' }}>{mass} <span style={{ fontSize: '1.5rem' }}>g</span></div>
                    <div style={{ marginTop: '2rem', fontSize: '0.8rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
                        Formule : m = PM × C × V
                    </div>
                </div>
            </div>
        </div>
    );
};

const DilutionCalculator = () => {
    const [c1, setC1] = useState<number>(0);
    const [v1, setV1] = useState<number>(0);
    const [c2, setC2] = useState<number>(0);
    const [v2, setV2] = useState<number>(0);

    let result = "Calcul...";
    if (c1 > 0 && v2 > 0 && c2 > 0 && v1 === 0) result = `V1 = ${(c2 * v2 / c1).toFixed(4)}`;
    if (c1 > 0 && v1 > 0 && v2 > 0 && c2 === 0) result = `C2 = ${(c1 * v1 / v2).toFixed(4)}`;
    if (c2 > 0 && v2 > 0 && v1 > 0 && c1 === 0) result = `C1 = ${(c2 * v2 / v1).toFixed(4)}`;
    if (c1 > 0 && v1 > 0 && c2 > 0 && v2 === 0) result = `V2 = ${(c1 * v1 / c2).toFixed(4)}`;

    return (
        <div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <RefreshCcw color="#3b82f6" /> Dilution (C1V1 = C2V2)
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Laissez un champ à 0 pour calculer sa valeur.</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                    <InputGroup label="C1 (Conc. initiale)" value={c1} onChange={setC1} />
                    <InputGroup label="V1 (Vol. initial)" value={v1} onChange={setV1} />
                    <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '0.5rem 0' }} />
                    <InputGroup label="C2 (Conc. finale)" value={c2} onChange={setC2} />
                    <InputGroup label="V2 (Vol. final)" value={v2} onChange={setV2} />
                </div>
                <div style={{ background: 'rgba(59, 130, 246, 0.1)', borderRadius: '1.5rem', padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <div style={{ fontSize: '2rem', fontWeight: 800 }}>{result}</div>
                </div>
            </div>
        </div>
    );
};

const ConversionCalculator = () => {
    return (
        <div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>Conversions d'Unités</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                <ConversionCard label="Litre vers µL" factor={1000000} />
                <ConversionCard label="Molaire vers mM" factor={1000} />
                <ConversionCard label="Gramme vers mg" factor={1000} />
            </div>
        </div>
    );
};

const ConversionCard = ({ label, factor }: any) => {
    const [val, setVal] = useState(1);
    return (
        <div className="glass-panel" style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>{label}</div>
            <input
                type="number"
                value={val}
                onChange={(e) => setVal(parseFloat(e.target.value))}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '0.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', marginBottom: '1rem' }}
            />
            <div style={{ fontWeight: 700, fontSize: '1.2rem', color: '#3b82f6' }}>= {(val * factor).toLocaleString()}</div>
        </div>
    );
};

const InputGroup = ({ label, value, onChange }: any) => (
    <div>
        <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>{label}</label>
        <input
            type="number"
            value={value}
            onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
            style={{ width: '100%', padding: '1rem', borderRadius: '1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '1.1rem' }}
        />
    </div>
);

export default BioToolBox;
