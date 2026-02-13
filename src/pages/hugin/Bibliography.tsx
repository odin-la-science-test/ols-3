import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Book, Quote, Download, Trash2, Edit2, Plus,
    ChevronLeft, Search,
    Tag, Calendar, User, Globe, Info, X
} from 'lucide-react';
import { useToast } from '../../components/ToastContext';
import { fetchModuleData, saveModuleItem, deleteModuleItem } from '../../utils/persistence';

interface Article {
    title: string;
    abstract: string;
    year: string;
    authors: string;
    doi: string;
    source: string;
    url: string;
    dateAdded?: string;
    folderId?: string;
    citationKey?: string;
}

const Bibliography = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();

    const [archives, setArchives] = useState<Article[]>([]);
    const [folders, setFolders] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [filterFolder, setFilterFolder] = useState('all');
    const [editingItem, setEditingItem] = useState<Article | null>(null);
    const [isAddingManual, setIsAddingManual] = useState(false);

    useEffect(() => {
        const loadBibData = async () => {
            const aData = await fetchModuleData('research_archives');
            const fData = await fetchModuleData('research_folders');
            if (aData) setArchives(aData);
            if (fData) setFolders(fData);
        };
        loadBibData();
    }, []);

    const generateCitationKey = (article: Article) => {
        const firstAuthor = article.authors.split(',')[0].split(' ').pop() || 'Unknown';
        const year = article.year || '0000';
        const titleFirstWord = article.title.split(' ')[0].replace(/[^a-zA-Z]/g, '');
        return `${firstAuthor.toLowerCase()}${year}${titleFirstWord.toLowerCase()}`;
    };

    const exportToBibTeX = (items: Article[]) => {
        const bibtex = items.map(item => {
            const key = item.citationKey || generateCitationKey(item);
            return `@article{${key},
  title = {${item.title}},
  author = {${item.authors}},
  year = {${item.year}},
  journal = {${item.source}},
  doi = {${item.doi}},
  url = {${item.url}}
}`;
        }).join('\n\n');
        copyToClipboard(bibtex, 'BibTeX exporté');
    };

    const exportToAPA = (item: Article) => {
        const apa = `${item.authors} (${item.year}). ${item.title}. ${item.source}. DOI: ${item.doi}`;
        copyToClipboard(apa, 'Citation APA copiée');
    };

    const copyToClipboard = (text: string, message: string) => {
        navigator.clipboard.writeText(text);
        showToast(message, 'success');
    };

    const handleDelete = async (title: string) => {
        if (confirm('Supprimer cet article de la bibliographie ?')) {
            const item = archives.find(a => a.title === title);
            if (item && item.doi) {
                try {
                    await deleteModuleItem('research_archives', item.doi);
                    setArchives(archives.filter(a => a.title !== title));
                    showToast('Article supprimé', 'success');
                } catch (e) {
                    showToast('Erreur de suppression', 'error');
                }
            } else {
                setArchives(archives.filter(a => a.title !== title));
            }
        }
    };

    const handleUpdate = async (updated: Article) => {
        try {
            await saveModuleItem('research_archives', updated);
            setArchives(archives.map(a => a.title === editingItem?.title ? updated : a));
            setEditingItem(null);
            showToast('Métadonnées mises à jour', 'success');
        } catch (e) {
            showToast('Erreur de mise à jour', 'error');
        }
    };

    const filteredArchives = archives.filter(a => {
        const matchesSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            a.authors.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFolder = filterFolder === 'all' || a.folderId === filterFolder;
        return matchesSearch && matchesFolder;
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
                            <Quote size={24} />
                        </div>
                        <div>
                            <h1 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>Gestion Bibliographique</h1>
                            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{archives.length} références sauvegardées</p>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button onClick={() => setIsAddingManual(true)} className="btn" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.05)' }}>
                        <Plus size={18} /> Entrée manuelle
                    </button>
                    <button
                        onClick={() => exportToBibTeX(selectedItems.length > 0 ? archives.filter(a => selectedItems.includes(a.doi || a.title)) : archives)}
                        className="btn"
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--accent-hugin)' }}
                    >
                        <Download size={18} /> Export BibTeX {selectedItems.length > 0 ? `(${selectedItems.length})` : ''}
                    </button>
                </div>
            </header>

            <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '300px 1fr', gap: '2rem', padding: '2rem' }}>
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
                            <FilterItem active={filterFolder === 'all'} label="Toute la bibliothèque" count={archives.length} onClick={() => setFilterFolder('all')} icon={<Book size={16} />} />
                            <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '0.5rem 0' }} />
                            {folders.map((f: any) => (
                                <FilterItem
                                    key={f.id}
                                    active={filterFolder === f.id}
                                    label={f.name}
                                    count={archives.filter(a => a.folderId === f.id).length}
                                    onClick={() => setFilterFolder(f.id)}
                                    icon={<Tag size={16} />}
                                />
                            ))}
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main>
                    <div style={{ display: 'grid', gap: '1rem' }}>
                        {filteredArchives.length === 0 ? (
                            <div className="glass-panel" style={{ padding: '5rem', textAlign: 'center', opacity: 0.5 }}>
                                <Info size={48} style={{ marginBottom: '1rem' }} />
                                <p>Aucune référence trouvée dans cet onglet.</p>
                            </div>
                        ) : (
                            filteredArchives.map((item, idx) => (
                                <BibCard
                                    key={idx}
                                    item={item}
                                    isSelected={selectedItems.includes(item.doi || item.title)}
                                    onSelect={() => {
                                        const id = item.doi || item.title;
                                        setSelectedItems(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
                                    }}
                                    onDelete={() => handleDelete(item.title)}
                                    onEdit={() => setEditingItem(item)}
                                    onExportAPA={() => exportToAPA(item)}
                                />
                            ))
                        )}
                    </div>
                </main>
            </div>

            {/* Modals */}
            {editingItem && (
                <MetadataModal
                    item={editingItem}
                    onClose={() => setEditingItem(null)}
                    onSave={handleUpdate}
                />
            )}

            {isAddingManual && (
                <ManualEntryModal
                    onClose={() => setIsAddingManual(false)}
                    onSave={(newItem: any) => {
                        setArchives([{ ...newItem, dateAdded: new Date().toISOString() }, ...archives]);
                        setIsAddingManual(false);
                        showToast('Référence ajoutée', 'success');
                    }}
                />
            )}
        </div>
    );
};

const FilterItem = ({ active, label, count, onClick, icon }: any) => (
    <button
        onClick={onClick}
        style={{
            display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', borderRadius: '0.5rem',
            background: active ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
            color: active ? 'var(--accent-hugin)' : 'var(--text-secondary)',
            border: 'none', cursor: 'pointer', textAlign: 'left', width: '100%', transition: 'all 0.2s'
        }}
    >
        {icon} <span style={{ flex: 1 }}>{label}</span>
        <span style={{ fontSize: '0.7rem', opacity: 0.5 }}>({count})</span>
    </button>
);

const BibCard = ({ item, isSelected, onSelect, onDelete, onEdit, onExportAPA }: any) => (
    <div className="glass-panel" style={{ padding: '1.25rem', borderLeft: isSelected ? '4px solid var(--accent-hugin)' : '1px solid rgba(255,255,255,0.05)', transition: 'all 0.2s' }}>
        <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'start' }}>
            <input
                type="checkbox"
                checked={isSelected}
                onChange={onSelect}
                style={{ marginTop: '0.4rem', cursor: 'pointer', width: '18px', height: '18px', accentColor: 'var(--accent-hugin)' }}
            />
            <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>{item.title}</h4>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={onEdit} className="btn-icon" style={{ padding: '0.4rem', borderRadius: '0.5rem', background: 'rgba(255,255,255,0.05)', color: 'white', border: 'none', cursor: 'pointer' }}>
                            <Edit2 size={14} />
                        </button>
                        <button onClick={onDelete} className="btn-icon" style={{ padding: '0.4rem', borderRadius: '0.5rem', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: 'none', cursor: 'pointer' }}>
                            <Trash2 size={14} />
                        </button>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><User size={14} /> {item.authors}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Calendar size={14} /> {item.year}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Globe size={14} /> {item.source}</span>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button onClick={onExportAPA} className="btn btn-small" style={{ background: 'rgba(255,255,255,0.05)', fontSize: '0.7rem' }}>
                        Copier APA
                    </button>
                    <a href={item.url} target="_blank" rel="noreferrer" className="btn btn-small" style={{ background: 'rgba(255,255,255,0.05)', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '0.3rem', textDecoration: 'none', color: 'inherit' }}>
                        Lien source <Globe size={10} />
                    </a>
                    {item.doi && (
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center' }}>DOI: {item.doi}</span>
                    )}
                </div>
            </div>
        </div>
    </div>
);

const MetadataModal = ({ item, onClose, onSave }: any) => {
    const [formData, setFormData] = useState({ ...item });

    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="glass-panel" style={{ width: '600px', padding: '2rem', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>Modifier la Référence</h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}><X size={24} /></button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <Field label="Titre" value={formData.title} onChange={(v: string) => setFormData({ ...formData, title: v })} />
                    <Field label="Auteurs" value={formData.authors} onChange={(v: string) => setFormData({ ...formData, authors: v })} />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <Field label="Année" value={formData.year} onChange={(v: string) => setFormData({ ...formData, year: v })} />
                        <Field label="Source/Journal" value={formData.source} onChange={(v: string) => setFormData({ ...formData, source: v })} />
                    </div>
                    <Field label="DOI" value={formData.doi} onChange={(v: string) => setFormData({ ...formData, doi: v })} />
                    <Field label="URL" value={formData.url} onChange={(v: string) => setFormData({ ...formData, url: v })} />
                </div>

                <div style={{ marginTop: '2.5rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                    <button onClick={onClose} className="btn" style={{ background: 'rgba(255,255,255,0.05)' }}>Annuler</button>
                    <button onClick={() => onSave(formData)} className="btn" style={{ background: 'var(--accent-hugin)' }}>Enregistrer</button>
                </div>
            </div>
        </div>
    );
};

const ManualEntryModal = ({ onClose, onSave }: any) => {
    const [formData, setFormData] = useState({
        title: '', authors: '', year: '', source: '', doi: '', url: '', abstract: ''
    });

    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="glass-panel" style={{ width: '600px', padding: '2rem', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>Ajout Manuel</h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}><X size={24} /></button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <Field label="Titre" value={formData.title} onChange={(v: string) => setFormData({ ...formData, title: v })} placeholder="Ex: Etude sur les bactéries..." />
                    <Field label="Auteurs" value={formData.authors} onChange={(v: string) => setFormData({ ...formData, authors: v })} placeholder="Ex: Jean Dupont, Marie Curie" />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <Field label="Année" value={formData.year} onChange={(v: string) => setFormData({ ...formData, year: v })} placeholder="2024" />
                        <Field label="Source" value={formData.source} onChange={(v: string) => setFormData({ ...formData, source: v })} placeholder="Nature, Science..." />
                    </div>
                </div>

                <div style={{ marginTop: '2.5rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                    <button onClick={onClose} className="btn" style={{ background: 'rgba(255,255,255,0.05)' }}>Annuler</button>
                    <button onClick={() => onSave({ ...formData, source: formData.source || 'Manuel' })} className="btn" style={{ background: 'var(--accent-hugin)' }}>Ajouter</button>
                </div>
            </div>
        </div>
    );
};

const Field = ({ label, value, onChange, placeholder }: any) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{label}</label>
        <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            style={{ width: '100%', padding: '0.75rem', borderRadius: '0.75rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
        />
    </div>
);

export default Bibliography;
