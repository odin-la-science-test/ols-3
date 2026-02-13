import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    BookOpen, Plus, Search, Trash2, Edit2,
    ChevronLeft, Save, FileText, Tag,
    Layers, Clock
} from 'lucide-react';
import { useToast } from '../../components/ToastContext';
import { fetchModuleData, saveModuleItem, deleteModuleItem } from '../../utils/persistence';

interface SOP {
    id: string;
    title: string;
    category: string;
    content: string;
    version: string;
    lastUpdated: string;
    author: string;
    status: 'Draft' | 'Approved' | 'Obsolete';
}

const SOPLibrary = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();

    const [sops, setSops] = useState<SOP[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');
    const [selectedSop, setSelectedSop] = useState<SOP | null>(null);
    const [isEditing, setIsEditing] = useState(false);

    const categories = ['Biologie Moléculaire', 'Biochimie', 'Microbiologie', 'Sécurité', 'Analytique'];

    useEffect(() => {
        const loadDocs = async () => {
            const data = await fetchModuleData('hugin_sops');
            if (data && data.length > 0) {
                setSops(data);
            } else {

                const initial: SOP[] = [{ id: "sop1", title: "Extraction d'ADN Génomique", category: "Biologie Moléculaire", content: "1. Lyse cellulaire...", version: "1.0", lastUpdated: "2026-01-15", author: "D. Drider", status: "Approved" }];
                setSops(initial);
                await saveModuleItem('hugin_sops', initial[0]);
            }
        };
        loadDocs();
    }, []);

    const handleSave = async (sop: SOP) => {
        try {
            await saveModuleItem('hugin_sops', sop);
            if (sops.find(s => s.id === sop.id)) {
                setSops(sops.map(s => s.id === sop.id ? sop : s));
                showToast('SOP mise à jour', 'success');
            } else {
                setSops([sop, ...sops]);
                showToast('Nouvelle SOP ajoutée', 'success');
            }
            setIsEditing(false);
            setSelectedSop(sop);
        } catch (e) {
            showToast('Erreur de sauvegarde', 'error');
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Supprimer cette SOP définitivement ?')) {
            try {
                await deleteModuleItem('hugin_sops', id);
                setSops(sops.filter(s => s.id !== id));
                setSelectedSop(null);
                showToast('SOP supprimée', 'success');
            } catch (e) {
                showToast('Erreur de suppression', 'error');
            }
        }
    };

    const filteredSops = sops.filter(s => {
        const matchesSearch = s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.content.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = filterCategory === 'all' || s.category === filterCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', color: 'white', display: 'flex', flexDirection: 'column' }}>
            <header className="glass-panel" style={{ padding: '1.5rem 2rem', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <button onClick={() => navigate('/hugin')} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: 'inherit', padding: '0.6rem', borderRadius: '0.75rem', cursor: 'pointer' }}>
                        <ChevronLeft size={20} />
                    </button>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ padding: '0.75rem', background: 'rgba(167, 139, 250, 0.2)', borderRadius: '1rem', color: '#a78bfa' }}>
                            <BookOpen size={24} />
                        </div>
                        <div>
                            <h1 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>SOPLibrary</h1>
                            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Procédures Opérationnelles Normalisées</p>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button onClick={() => { setSelectedSop(null); setIsEditing(true); }} className="btn" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#a78bfa' }}>
                        <Plus size={18} /> Nouvelle SOP
                    </button>
                </div>
            </header>

            <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '320px 1fr', gap: '2rem', padding: '2rem' }}>
                <aside style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="glass-panel" style={{ padding: '1.5rem' }}>
                        <h3 style={{ fontSize: '0.9rem', marginBottom: '1rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Recherche & Filtres</h3>

                        <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
                            <Search size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                            <input
                                type="text"
                                placeholder="Rechercher une SOP..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.5rem', borderRadius: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                            />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {['all', ...categories].map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setFilterCategory(cat)}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', borderRadius: '0.5rem',
                                        background: filterCategory === cat ? 'rgba(167, 139, 250, 0.15)' : 'transparent',
                                        color: filterCategory === cat ? '#a78bfa' : 'var(--text-secondary)',
                                        border: 'none', cursor: 'pointer', textAlign: 'left', width: '100%', transition: 'all 0.2s'
                                    }}
                                >
                                    <Tag size={16} /> {cat === 'all' ? 'Toutes les catégories' : cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="glass-panel" style={{ padding: '1.5rem', flex: 1, overflowY: 'auto' }}>
                        <h3 style={{ fontSize: '0.9rem', marginBottom: '1rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Liste des SOPs</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {filteredSops.map(s => (
                                <div
                                    key={s.id}
                                    onClick={() => { setSelectedSop(s); setIsEditing(false); }}
                                    style={{
                                        padding: '1rem', borderRadius: '0.75rem', cursor: 'pointer',
                                        background: selectedSop?.id === s.id ? 'rgba(167, 139, 250, 0.1)' : 'rgba(255,255,255,0.02)',
                                        border: `1px solid ${selectedSop?.id === s.id ? '#a78bfa' : 'rgba(255,255,255,0.05)'}`
                                    }}
                                >
                                    <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.3rem' }}>{s.title}</div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontSize: '0.7rem', opacity: 0.5 }}>v{s.version}</span>
                                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: s.status === 'Approved' ? '#10b981' : (s.status === 'Draft' ? '#f59e0b' : '#ef4444') }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </aside>

                <main>
                    {isEditing ? (
                        <div className="glass-panel" style={{ padding: '2rem' }}>
                            <h2 style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>{selectedSop ? 'Modifier la SOP' : 'Créer une SOP'}</h2>
                            <SopForm
                                sop={selectedSop}
                                categories={categories}
                                onSave={handleSave}
                                onCancel={() => setIsEditing(false)}
                            />
                        </div>
                    ) : selectedSop ? (
                        <div className="glass-panel" style={{ padding: '2.5rem', minHeight: '100%' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
                                <div>
                                    <div style={{ fontSize: '0.8rem', color: '#a78bfa', background: 'rgba(167, 139, 250, 0.1)', padding: '0.2rem 0.6rem', borderRadius: '1rem', display: 'inline-block', marginBottom: '0.75rem' }}>{selectedSop.category}</div>
                                    <h2 style={{ fontSize: '2rem', fontWeight: 800, margin: 0 }}>{selectedSop.title}</h2>
                                    <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Layers size={16} /> Version {selectedSop.version}</span>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Clock size={16} /> Mis à jour le {new Date(selectedSop.lastUpdated).toLocaleDateString()}</span>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><FileText size={16} /> Auteur: {selectedSop.author}</span>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '0.75rem' }}>
                                    <button onClick={() => setIsEditing(true)} className="btn btn-small" style={{ background: 'rgba(255,255,255,0.05)' }}><Edit2 size={16} /></button>
                                    <button onClick={() => handleDelete(selectedSop.id)} className="btn btn-small" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}><Trash2 size={16} /></button>
                                </div>
                            </div>

                            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '2rem', borderRadius: '1.5rem', border: '1px solid rgba(255,255,255,0.05)', whiteSpace: 'pre-wrap', lineHeight: '1.8', fontSize: '1.05rem', color: 'rgba(255,255,255,0.9)' }}>
                                {selectedSop.content}
                            </div>
                        </div>
                    ) : (
                        <div className="glass-panel" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.5, minHeight: '400px' }}>
                            Sélectionnez une procédure opérationnelle pour l'afficher
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

const SopForm = ({ sop, categories, onSave, onCancel }: any) => {
    const [formData, setFormData] = useState<SOP>(sop || {
        id: Date.now().toString(),
        title: '',
        category: categories[0],
        content: '',
        version: '1.0',
        lastUpdated: new Date().toISOString().split('T')[0],
        author: 'Chercheur',
        status: 'Draft'
    });

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div style={{ gridColumn: '1/-1' }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Titre de la SOP</label>
                    <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        style={{ width: '100%', padding: '1rem', borderRadius: '1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '1.1rem' }}
                    />
                </div>
                <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Catégorie</label>
                    <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        style={{ width: '100%', padding: '0.8rem', borderRadius: '0.8rem', background: 'rgba(0,0,0,0.3)', border: 'none', color: 'white' }}
                    >
                        {categories.map((c: any) => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Version</label>
                        <input
                            type="text"
                            value={formData.version}
                            onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                            style={{ width: '100%', padding: '0.8rem', borderRadius: '0.8rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                        />
                    </div>
                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Statut</label>
                        <select
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                            style={{ width: '100%', padding: '0.8rem', borderRadius: '0.8rem', background: 'rgba(0,0,0,0.3)', border: 'none', color: 'white' }}
                        >
                            <option value="Draft">Draft</option>
                            <option value="Approved">Approved</option>
                            <option value="Obsolete">Obsolete</option>
                        </select>
                    </div>
                </div>
            </div>
            <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Contenu de la procédure</label>
                <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Décrivez ici toutes les étapes détaillées..."
                    style={{ width: '100%', height: '400px', padding: '1.5rem', borderRadius: '1.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', resize: 'none', lineHeight: '1.6', fontFamily: 'inherit' }}
                />
            </div>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button onClick={onCancel} className="btn" style={{ background: 'rgba(255,255,255,0.05)' }}>Annuler</button>
                <button onClick={() => onSave({ ...formData, lastUpdated: new Date().toISOString().split('T')[0] })} className="btn" style={{ background: '#a78bfa', padding: '0.75rem 2rem' }}>
                    <Save size={18} style={{ marginRight: '0.5rem' }} /> Enregistrer la SOP
                </button>
            </div>
        </div>
    );
};

export default SOPLibrary;
