import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Plus,
    ChevronLeft, Save, Box, Snowflake, Thermometer, Info
} from 'lucide-react';
import { useToast } from '../../components/ToastContext';
import { fetchModuleData, saveModuleItem } from '../../utils/persistence';

interface Sample {
    id: string;
    name: string;
    type: string;
    owner: string;
    date: string;
    notes?: string;
}

interface CryoBox {
    id: string;
    name: string;
    freezerId: string;
    rows: number;
    cols: number;
    samples: Record<string, Sample>; // "row-col" -> Sample
}

interface Freezer {
    id: string;
    name: string;
    type: '-20°C' | '-80°C' | 'N2';
    location: string;
}

const CryoKeeper = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();

    const [freezers, setFreezers] = useState<Freezer[]>([]);
    const [boxes, setBoxes] = useState<CryoBox[]>([]);

    const [selectedFreezer, setSelectedFreezer] = useState<Freezer | null>(null);
    const [selectedBox, setSelectedBox] = useState<CryoBox | null>(null);
    const [editingCell, setEditingCell] = useState<{ row: number, col: number } | null>(null);

    useEffect(() => {
        const loadData = async () => {
            const [savedFreezers, savedBoxes] = await Promise.all([
                fetchModuleData('cryo_freezers'),
                fetchModuleData('cryo_boxes')
            ]);

            if (savedFreezers && savedFreezers.length > 0) {
                setFreezers(savedFreezers);
                setSelectedFreezer(savedFreezers[0]);
            } else {
                const initial = [{ id: "f1", name: "Congélateur Principal", type: "-80°C" as const, location: "Zone A" }];
                setFreezers(initial);
                setSelectedFreezer(initial[0]);
                await saveModuleItem('cryo_freezers', initial[0]);
            }

            if (savedBoxes) setBoxes(savedBoxes);
        };
        loadData();
    }, []);

    const handleAddBox = async () => {
        if (!selectedFreezer) return;
        const newBox: CryoBox = {
            id: Date.now().toString(),
            name: `Boite ${boxes.length + 1}`,
            freezerId: selectedFreezer.id,
            rows: 9,
            cols: 9,
            samples: {}
        };
        try {
            await saveModuleItem('cryo_boxes', newBox);
            setBoxes([...boxes, newBox]);
            setSelectedBox(newBox);
            showToast('Nouvelle boite créée', 'success');
        } catch (e) {
            showToast('Erreur de création de boite', 'error');
        }
    };

    const handleSaveSample = async (sample: Sample) => {
        if (!selectedBox || !editingCell) return;
        const key = `${editingCell.row}-${editingCell.col}`;
        const updatedBox = {
            ...selectedBox,
            samples: { ...selectedBox.samples, [key]: sample }
        };
        try {
            await saveModuleItem('cryo_boxes', updatedBox);
            setBoxes(boxes.map(b => b.id === selectedBox.id ? updatedBox : b));
            setSelectedBox(updatedBox);
            setEditingCell(null);
            showToast('Échantillon enregistré', 'success');
        } catch (e) {
            showToast('Erreur d\'enregistrement', 'error');
        }
    };

    const renderGrid = () => {
        if (!selectedBox) return null;
        const grid = [];
        for (let r = 0; r < selectedBox.rows; r++) {
            const rowCells = [];
            for (let c = 0; c < selectedBox.cols; c++) {
                const key = `${r}-${c}`;
                const sample = selectedBox.samples[key];
                rowCells.push(
                    <div
                        key={key}
                        onClick={() => setEditingCell({ row: r, col: c })}
                        style={{
                            width: '40px', height: '40px', border: '1px solid rgba(255,255,255,0.1)',
                            background: sample ? 'rgba(99, 102, 241, 0.4)' : 'rgba(255,255,255,0.02)',
                            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '0.6rem', transition: 'all 0.2s', borderRadius: '4px'
                        }}
                        title={sample ? `${sample.name} (${sample.owner})` : 'Vide'}
                    >
                        {sample ? '🧬' : ''}
                    </div>
                );
            }
            grid.push(<div key={r} style={{ display: 'flex', gap: '4px' }}>{rowCells}</div>);
        }
        return <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>{grid}</div>;
    };

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', color: 'white', display: 'flex', flexDirection: 'column' }}>
            <header className="glass-panel" style={{ padding: '1.5rem 2rem', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <button onClick={() => navigate('/hugin')} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: 'inherit', padding: '0.6rem', borderRadius: '0.75rem', cursor: 'pointer' }}>
                        <ChevronLeft size={20} />
                    </button>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ padding: '0.75rem', background: 'rgba(99, 102, 241, 0.2)', borderRadius: '1rem', color: 'var(--accent-hugin)' }}>
                            <Snowflake size={24} />
                        </div>
                        <div>
                            <h1 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>CryoKeeper</h1>
                            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Mapping de stockage ultra-froid</p>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button onClick={handleAddBox} className="btn" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--accent-hugin)' }}>
                        <Plus size={18} /> Nouvelle Boîte
                    </button>
                </div>
            </header>

            <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '300px 1fr', gap: '2rem', padding: '2rem' }}>
                <aside style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="glass-panel" style={{ padding: '1.5rem' }}>
                        <h3 style={{ fontSize: '0.9rem', marginBottom: '1rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Congélateurs</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {freezers.map(f => (
                                <button
                                    key={f.id}
                                    onClick={() => setSelectedFreezer(f)}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', borderRadius: '0.5rem',
                                        background: selectedFreezer?.id === f.id ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                                        color: selectedFreezer?.id === f.id ? 'var(--accent-hugin)' : 'var(--text-secondary)',
                                        border: 'none', cursor: 'pointer', textAlign: 'left', width: '100%'
                                    }}
                                >
                                    <Thermometer size={16} /> {f.name} ({f.type})
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="glass-panel" style={{ padding: '1.5rem', flex: 1 }}>
                        <h3 style={{ fontSize: '0.9rem', marginBottom: '1rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Boîtes dans {selectedFreezer?.name}</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {boxes.filter(b => b.freezerId === selectedFreezer?.id).map(b => (
                                <button
                                    key={b.id}
                                    onClick={() => setSelectedBox(b)}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', borderRadius: '0.5rem',
                                        background: selectedBox?.id === b.id ? 'rgba(255,255,255,0.1)' : 'transparent',
                                        color: selectedBox?.id === b.id ? 'white' : 'var(--text-secondary)',
                                        border: 'none', cursor: 'pointer', textAlign: 'left', width: '100%'
                                    }}
                                >
                                    <Box size={16} /> {b.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </aside>

                <main style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {selectedBox ? (
                        <div className="glass-panel" style={{ padding: '2rem', display: 'flex', gap: '2rem' }}>
                            <div>
                                <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Configuration: {selectedBox.name}</h2>
                                {renderGrid()}
                                <div style={{ marginTop: '1.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', gap: '1rem' }}>
                                    <span>Taille: {selectedBox.rows} x {selectedBox.cols}</span>
                                    <span>Échantillons: {Object.keys(selectedBox.samples).length}</span>
                                </div>
                            </div>

                            <div style={{ flex: 1, background: 'rgba(255,255,255,0.02)', borderRadius: '1rem', padding: '1.5rem' }}>
                                <h3 style={{ fontSize: '1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Info size={18} /> Détails de l'emplacement
                                </h3>
                                {editingCell ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        <div style={{ fontSize: '0.8rem', opacity: 0.5 }}>Position: Ligne {editingCell.row + 1}, Col {editingCell.col + 1}</div>
                                        <SampleForm
                                            sample={selectedBox.samples[`${editingCell.row}-${editingCell.col}`]}
                                            onSave={handleSaveSample}
                                            onCancel={() => setEditingCell(null)}
                                        />
                                    </div>
                                ) : (
                                    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', textAlign: 'center' }}>
                                        Cliquez sur une case du rack<br />pour voir ou ajouter un échantillon
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="glass-panel" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.5 }}>
                            Sélectionnez une boîte ou créez-en une nouvelle
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

const SampleForm = ({ sample, onSave, onCancel }: any) => {
    const [formData, setFormData] = useState<Sample>(sample || {
        id: Date.now().toString(),
        name: '',
        type: 'Plasmide',
        owner: '',
        date: new Date().toISOString().split('T')[0],
        notes: ''
    });

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Nom de l'échantillon</label>
                <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '0.5rem' }}
                />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Type</label>
                    <select
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        style={{ width: '100%', padding: '0.6rem', background: 'rgba(0,0,0,0.3)', border: 'none', color: 'white', borderRadius: '0.5rem' }}
                    >
                        {['Plasmide', 'Bactérie', 'Protéine', 'ARN', 'ADN', 'Autre'].map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                </div>
                <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Propriétaire</label>
                    <input
                        type="text"
                        value={formData.owner}
                        onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                        style={{ width: '100%', padding: '0.6rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '0.5rem' }}
                    />
                </div>
            </div>
            <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Notes</label>
                <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    style={{ width: '100%', height: '80px', padding: '0.6rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '0.5rem', resize: 'none' }}
                />
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                <button onClick={() => onSave(formData)} className="btn" style={{ flex: 1, background: 'var(--accent-hugin)' }}><Save size={16} /> Sauver</button>
                <button onClick={onCancel} className="btn" style={{ flex: 1, background: 'rgba(255,255,255,0.05)' }}>Annuler</button>
            </div>
        </div>
    );
};

export default CryoKeeper;
