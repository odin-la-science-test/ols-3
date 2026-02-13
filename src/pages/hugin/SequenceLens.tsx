import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Dna, ChevronLeft, Copy,
    Layers, Zap, ArrowLeftRight
} from 'lucide-react';
import { useToast } from '../../components/ToastContext';

const SequenceLens = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [sequence, setSequence] = useState('');

    const cleanSeq = sequence.replace(/[^ATCGUatcgu]/g, '').toUpperCase();
    const length = cleanSeq.length;

    const gcContent = length > 0 ? ((cleanSeq.split('').filter(b => b === 'G' || b === 'C').length / length) * 100).toFixed(2) : 0;

    const complement = cleanSeq.split('').map(b => {
        if (b === 'A') return 'T';
        if (b === 'T') return 'A';
        if (b === 'C') return 'G';
        if (b === 'G') return 'C';
        return b;
    }).join('');

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        showToast('Copié dans le presse-papier', 'success');
    };

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', color: 'white', display: 'flex', flexDirection: 'column' }}>
            <header className="glass-panel" style={{ padding: '1.5rem 2rem', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <button onClick={() => navigate('/hugin')} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: 'inherit', padding: '0.6rem', borderRadius: '0.75rem', cursor: 'pointer' }}>
                        <ChevronLeft size={20} />
                    </button>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ padding: '0.75rem', background: 'rgba(236, 72, 153, 0.2)', borderRadius: '1rem', color: '#ec4899' }}>
                            <Dna size={24} />
                        </div>
                        <div>
                            <h1 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>SequenceLens</h1>
                            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Analyseur de séquences nucléotidiques</p>
                        </div>
                    </div>
                </div>
            </header>

            <div style={{ flex: 1, padding: '2rem', display: 'flex', gap: '2rem' }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="glass-panel" style={{ padding: '2rem' }}>
                        <h3 style={{ fontSize: '1rem', marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                            <Layers size={18} color="#ec4899" /> Saisie de la séquence (FASTA ou brute)
                        </h3>
                        <textarea
                            value={sequence}
                            onChange={(e) => setSequence(e.target.value)}
                            placeholder="ATGC..."
                            style={{
                                width: '100%', height: '250px', padding: '1.5rem', borderRadius: '1rem',
                                background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)',
                                color: '#10b981', fontFamily: '"Fira Code", monospace', fontSize: '1.1rem',
                                resize: 'none', lineHeight: '1.6'
                            }}
                        />
                    </div>

                    <div className="glass-panel" style={{ padding: '2rem' }}>
                        <h3 style={{ fontSize: '1rem', marginBottom: '1.5rem' }}>Visualisation & Propriétés</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
                            <PropCard label="Longueur" value={`${length} bp`} />
                            <PropCard label="GC Content" value={`${gcContent} %`} />
                            <PropCard label="Poids Mol." value={`${(length * 330 / 1000).toFixed(1)} kDa`} />
                        </div>
                    </div>
                </div>

                <aside style={{ width: '400px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="glass-panel" style={{ padding: '2rem' }}>
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '2rem' }}>Outils de Manipulation</h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <ActionButton
                                icon={<ArrowLeftRight size={18} />}
                                label="Complément"
                                onClick={() => handleCopy(complement)}
                            />
                            <ActionButton
                                icon={<Zap size={18} />}
                                label="Traduction (ORF)"
                                onClick={() => showToast('Module de traduction en cours de développement', 'info')}
                            />
                            <ActionButton
                                icon={<Copy size={18} />}
                                label="Copier Séquence Nettoyée"
                                onClick={() => handleCopy(cleanSeq)}
                            />
                        </div>
                    </div>

                    <div className="glass-panel" style={{ padding: '2rem', flex: 1 }}>
                        <h3 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '1.5rem' }}>Composition</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <BaseGauge label="A" count={cleanSeq.split('A').length - 1} total={length} color="#fbbf24" />
                            <BaseGauge label="T" count={cleanSeq.split('T').length - 1} total={length} color="#ef4444" />
                            <BaseGauge label="C" count={cleanSeq.split('C').length - 1} total={length} color="#3b82f6" />
                            <BaseGauge label="G" count={cleanSeq.split('G').length - 1} total={length} color="#10b981" />
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
};

const PropCard = ({ label, value }: any) => (
    <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>{label}</div>
        <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>{value}</div>
    </div>
);

const ActionButton = ({ icon, label, onClick }: any) => (
    <button
        onClick={onClick}
        style={{
            display: 'flex', alignItems: 'center', gap: '1rem', width: '100%', padding: '1rem',
            borderRadius: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
            color: 'white', cursor: 'pointer', transition: 'all 0.2s'
        }}
    >
        {icon} <span>{label}</span>
    </button>
);

const BaseGauge = ({ label, count, total, color }: any) => {
    const pct = total > 0 ? (count / total) * 100 : 0;
    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.4rem' }}>
                <span>{label}</span>
                <span>{count} ({pct.toFixed(1)}%)</span>
            </div>
            <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: `${pct}%`, height: '100%', background: color }} />
            </div>
        </div>
    );
};

export default SequenceLens;
