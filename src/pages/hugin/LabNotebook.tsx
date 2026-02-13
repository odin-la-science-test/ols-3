import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Book, Plus, ChevronLeft, Search,
    Calendar, Tag, Link as LinkIcon, Edit2, Trash2,
    Save, X, FileText, Clipboard, Activity, Microscope
} from 'lucide-react';
import { useToast } from '../../components/ToastContext';
import { fetchModuleData, saveModuleItem, deleteModuleItem } from '../../utils/persistence';

interface LabEntry {
    id: string;
    title: string;
    date: string;
    category: string;
    protocol: string;
    observations: string;
    results: string;
    linkedSheets: string[]; // Names of sheets in localStorage (sheet_...)
}

const LabNotebook = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();

    const [entries, setEntries] = useState<LabEntry[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [editingEntry, setEditingEntry] = useState<LabEntry | null>(null);

    const categories = ['Culture Bactérienne', 'PCR', 'Analyse Protéine', 'Microscopie', 'Cinétique'];

    useEffect(() => {
        const loadEntries = async () => {
            const data = await fetchModuleData('eln_entries');
            if (data) setEntries(data);
        };
        loadEntries();
    }, []);

    const handleDelete = async (id: string) => {
        if (confirm('Supprimer cette entrée définitivement ?')) {
            try {
                await deleteModuleItem('eln_entries', id);
                setEntries(entries.filter(e => e.id !== id));
                showToast('Entrée supprimée', 'success');
            } catch (e) {
                showToast('Erreur de suppression', 'error');
            }
        }
    };

    const handleSave = async (entry: LabEntry) => {
        try {
            await saveModuleItem('eln_entries', entry);
            if (entries.find(e => e.id === entry.id)) {
                setEntries(entries.map(e => e.id === entry.id ? entry : e));
                showToast('Entrée mise à jour', 'success');
            } else {
                setEntries([entry, ...entries]);
                showToast('Nouvelle entrée créée', 'success');
            }
            setIsAddingNew(false);
            setEditingEntry(null);
        } catch (e) {
            showToast('Erreur de sauvegarde', 'error');
        }
    };

    const filteredEntries = entries.filter(e => {
        const matchesSearch = e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            e.protocol.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = filterCategory === 'all' || e.category === filterCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', color: 'white', display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <header className="glass-panel" style={{ padding: '1.5rem 2rem', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <button onClick={() => navigate('/hugin')} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: 'inherit', padding: '0.6rem', borderRadius: '0.75rem', cursor: 'pointer' }}>
                        <ChevronLeft size={20} />
                    </button>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ padding: '0.75rem', background: 'rgba(99, 102, 241, 0.2)', borderRadius: '1rem', color: 'var(--accent-hugin)' }}>
                            <Book size={24} />
                        </div>
                        <div>
                            <h1 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>Cahier de Laboratoire</h1>
                            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{entries.length} expériences consignées</p>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button onClick={() => setIsAddingNew(true)} className="btn" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--accent-hugin)' }}>
                        <Plus size={18} /> Nouvelle Expérience
                    </button>
                </div>
            </header>

            <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '280px 1fr', gap: '2rem', padding: '2rem' }}>
                {/* Sidebar Filter */}
                <aside style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="glass-panel" style={{ padding: '1.5rem' }}>
                        <h3 style={{ fontSize: '0.9rem', marginBottom: '1rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Filtres</h3>

                        <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
                            <Search size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                            <input
                                type="text"
                                placeholder="Rechercher..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.5rem', borderRadius: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                            />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <FilterButton active={filterCategory === 'all'} label="Toutes les entrées" onClick={() => setFilterCategory('all')} />
                            {categories.map((cat: string) => (
                                <FilterButton
                                    key={cat}
                                    active={filterCategory === cat}
                                    label={cat}
                                    onClick={() => setFilterCategory(cat)}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="glass-panel" style={{ padding: '1.5rem' }}>
                        <h3 style={{ fontSize: '0.9rem', marginBottom: '1rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Ressources</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', fontSize: '0.9rem' }}>
                            <button onClick={() => navigate('/hugin/tableur')} className="link-btn"><Clipboard size={16} /> Ouvrir Tableur Lab</button>
                            <button onClick={() => navigate('/hugin/research')} className="link-btn"><Microscope size={16} /> Recherche Scientifique</button>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '1.5rem' }}>
                        {filteredEntries.length === 0 ? (
                            <div className="glass-panel" style={{ gridColumn: '1/-1', padding: '5rem', textAlign: 'center', opacity: 0.5 }}>
                                <FileText size={48} style={{ marginBottom: '1rem' }} />
                                <p>Aucun compte-rendu d'expérience pour le moment.</p>
                            </div>
                        ) : (
                            filteredEntries.map(entry => (
                                <EntryCard
                                    key={entry.id}
                                    entry={entry}
                                    onEdit={() => setEditingEntry(entry)}
                                    onDelete={() => handleDelete(entry.id)}
                                />
                            ))
                        )}
                    </div>
                </main>
            </div>

            {/* Entry Modal */}
            {(isAddingNew || editingEntry) && (
                <EntryModal
                    entry={editingEntry}
                    categories={categories}
                    onClose={() => { setIsAddingNew(false); setEditingEntry(null); }}
                    onSave={handleSave}
                />
            )}

            <style>{`
                .link-btn {
                    display: flex; alignItems: center; gap: 0.5rem; background: none; border: none;
                    color: var(--text-secondary); cursor: pointer; transition: color 0.2s;
                    text-align: left; padding: 0.2rem 0;
                }
                .link-btn:hover { color: var(--accent-hugin); }
            `}</style>
        </div>
    );
};

const FilterButton = ({ active, label, onClick }: any) => (
    <button
        onClick={onClick}
        style={{
            display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', borderRadius: '0.5rem',
            background: active ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
            color: active ? 'var(--accent-hugin)' : 'var(--text-secondary)',
            border: 'none', cursor: 'pointer', textAlign: 'left', width: '100%', transition: 'all 0.2s'
        }}
    >
        <Tag size={16} /> {label}
    </button>
);

const EntryCard = ({ entry, onEdit, onDelete }: any) => {
    const navigate = useNavigate();
    return (
        <div className="card glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--accent-hugin)', background: 'rgba(99, 102, 241, 0.1)', padding: '0.2rem 0.6rem', borderRadius: '1rem', fontWeight: 600 }}>{entry.category}</span>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={onEdit} className="btn-icon" style={{ opacity: 0.6 }}><Edit2 size={14} /></button>
                    <button onClick={onDelete} className="btn-icon" style={{ opacity: 0.6, color: '#ef4444' }}><Trash2 size={14} /></button>
                </div>
            </div>

            <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700 }}>{entry.title}</h3>

            <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Calendar size={14} /> {new Date(entry.date).toLocaleDateString()}</span>
                {entry.linkedSheets.length > 0 && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#10b981' }}><Activity size={14} /> {entry.linkedSheets.length} Tableur(s)</span>
                )}
            </div>

            <p style={{ margin: 0, fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {entry.observations}
            </p>

            <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto', paddingTop: '1rem' }}>
                {entry.linkedSheets.map((sheetName: string) => (
                    <button
                        key={sheetName}
                        onClick={() => navigate('/hugin/tableur')}
                        className="btn btn-small"
                        style={{ fontSize: '0.7rem', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.2)' }}
                    >
                        <LinkIcon size={12} /> {sheetName}
                    </button>
                ))}
            </div>
        </div>
    );
};

const EntryModal = ({ entry, categories, onClose, onSave }: any) => {
    const [formData, setFormData] = useState<LabEntry>(entry || {
        id: Date.now().toString(),
        title: '',
        date: new Date().toISOString().split('T')[0],
        category: categories[0],
        protocol: '',
        observations: '',
        results: '',
        linkedSheets: []
    });

    const [availableSheets, setAvailableSheets] = useState<string[]>([]);
    const [showLinkSelector, setShowLinkSelector] = useState(false);

    useEffect(() => {
        const loadSheets = async () => {
            const data = await fetchModuleData('hugin_spreadsheets');
            if (data) {
                setAvailableSheets(data.map((s: any) => s.id));
            }
        };
        loadSheets();
    }, []);

    const toggleSheet = (name: string) => {
        const updated = formData.linkedSheets.includes(name)
            ? formData.linkedSheets.filter(s => s !== name)
            : [...formData.linkedSheets, name];
        setFormData({ ...formData, linkedSheets: updated });
    };

    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
            <div className="glass-panel" style={{ width: '100%', maxWidth: '900px', maxHeight: '90vh', overflowY: 'auto', padding: '2.5rem', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: 700, margin: 0 }}>{entry ? 'Modifier l\'Entrée' : 'Nouveau Compte-Rendu'}</h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}><X size={24} /></button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <Field label="Titre de l'expérience" value={formData.title} onChange={(v: string) => setFormData({ ...formData, title: v })} placeholder="Ex: Analyse de la croissance d'E. coli..." />

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Catégorie</label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                                >
                                    {categories.map((c: string) => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <Field label="Date" type="date" value={formData.date} onChange={(v: string) => setFormData({ ...formData, date: v })} />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Lien Tableur Lab</label>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', padding: '0.5rem', background: 'rgba(0,0,0,0.2)', borderRadius: '0.75rem', minHeight: '45px' }}>
                                {formData.linkedSheets.map(s => (
                                    <span key={s} className="tag-chip">
                                        {s} <X size={12} onClick={() => toggleSheet(s)} style={{ cursor: 'pointer' }} />
                                    </span>
                                ))}
                                <button onClick={() => setShowLinkSelector(!showLinkSelector)} className="add-link-btn">
                                    <Plus size={14} /> Lier une feuille
                                </button>
                            </div>
                            {showLinkSelector && (
                                <div className="selector-popup glass-panel">
                                    {availableSheets.length === 0 ? <p style={{ fontSize: '0.8rem', opacity: 0.5, padding: '0.5rem' }}>Aucun tableur trouvé</p> :
                                        availableSheets.map(s => (
                                            <div key={s} onClick={() => toggleSheet(s)} className={`selector-item ${formData.linkedSheets.includes(s) ? 'active' : ''}`}>
                                                {s}
                                            </div>
                                        ))
                                    }
                                </div>
                            )}
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <AreaField label="Protocole" value={formData.protocol} onChange={(v: string) => setFormData({ ...formData, protocol: v })} placeholder="Décrivez les étapes de la manipulation..." />
                        <AreaField label="Observations / Résultats" value={formData.observations} onChange={(v: string) => setFormData({ ...formData, observations: v })} placeholder="Qu'avez-vous observé ? Données brutes..." />
                    </div>
                </div>

                <div style={{ marginTop: '3rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                    <button onClick={onClose} className="btn" style={{ background: 'rgba(255,255,255,0.05)' }}>Annuler</button>
                    <button onClick={() => onSave(formData)} className="btn" style={{ background: 'var(--accent-hugin)', padding: '0.75rem 2rem' }}>
                        <Save size={18} style={{ marginRight: '0.5rem' }} /> Enregistrer l'entrée
                    </button>
                </div>
            </div>

            <style>{`
                .tag-chip {
                    display: flex; alignItems: center; gap: 0.4rem; background: rgba(16, 185, 129, 0.2);
                    color: #10b981; padding: 0.2rem 0.6rem; borderRadius: 0.5rem; font-size: 0.75rem;
                }
                .add-link-btn {
                    background: rgba(255,255,255,0.1); border: none; color: white; padding: 0.2rem 0.6rem;
                    borderRadius: 0.5rem; font-size: 0.75rem; cursor: pointer; display: flex; align-items: center; gap: 0.2rem;
                }
                .add-link-btn:hover { background: rgba(255,255,255,0.2); }
                .selector-popup {
                    margin-top: 0.5rem; border: 1px solid rgba(255,255,255,0.1); padding: 0.5rem;
                    max-height: 150px; overflow-y: auto;
                }
                .selector-item {
                    padding: 0.5rem; border-radius: 0.4rem; cursor: pointer; font-size: 0.85rem; transition: background 0.2s;
                }
                .selector-item:hover { background: rgba(255,255,255,0.05); }
                .selector-item.active { color: var(--accent-hugin); background: rgba(99, 102, 241, 0.1); }
            `}</style>
        </div>
    );
};

const Field = ({ label, value, onChange, placeholder, type = "text" }: any) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{label}</label>
        <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            style={{ width: '100%', padding: '0.75rem', borderRadius: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
        />
    </div>
);

const AreaField = ({ label, value, onChange, placeholder }: any) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', flex: 1 }}>
        <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{label}</label>
        <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            style={{ width: '100%', flex: 1, minHeight: '150px', padding: '0.75rem', borderRadius: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', resize: 'none', fontFamily: 'inherit' }}
        />
    </div>
);

export default LabNotebook;
