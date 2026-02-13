import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Package, Plus, Search, Trash2, Edit2,
    AlertTriangle, Calendar, MapPin, Tag, ChevronLeft,
    X, Save, Box
} from 'lucide-react';
import { useToast } from '../../components/ToastContext';
import { fetchModuleData, saveModuleItem, deleteModuleItem } from '../../utils/persistence';

interface StockItem {
    id: string;
    name: string;
    category: string;
    quantity: number;
    unit: string;
    location: string;
    expiryDate: string;
    minThreshold: number;
    supplier?: string;
    reference?: string;
}

const StockManager = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();

    const [items, setItems] = useState<StockItem[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [editingItem, setEditingItem] = useState<StockItem | null>(null);

    const categories = ['Réactifs', 'Consommables', 'Milieux de Culture', 'Verrerie', 'Équipement'];

    useEffect(() => {
        const loadStock = async () => {
            const data = await fetchModuleData('hugin_stock');
            if (data) setItems(data);
        };
        loadStock();
    }, []);

    const handleDelete = async (id: string) => {
        if (confirm('Supprimer cet article de l\'inventaire ?')) {
            try {
                await deleteModuleItem('hugin_stock', id);
                setItems(items.filter(i => i.id !== id));
                showToast('Article supprimé', 'success');
            } catch (e) {
                showToast('Erreur de suppression', 'error');
            }
        }
    };

    const handleSave = async (item: StockItem) => {
        try {
            await saveModuleItem('hugin_stock', item);
            if (items.find(i => i.id === item.id)) {
                setItems(items.map(i => i.id === item.id ? item : i));
                showToast('Inventaire mis à jour', 'success');
            } else {
                setItems([item, ...items]);
                showToast('Nouvel article ajouté', 'success');
            }
            setIsAddingNew(false);
            setEditingItem(null);
        } catch (e) {
            showToast('Erreur de sauvegarde', 'error');
        }
    };

    const filteredItems = items.filter(i => {
        const matchesSearch = i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            i.reference?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = filterCategory === 'all' || i.category === filterCategory;
        return matchesSearch && matchesCategory;
    });

    const isLowStock = (item: StockItem) => item.quantity <= item.minThreshold;
    const isExpired = (item: StockItem) => new Date(item.expiryDate) < new Date();

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', color: 'white', display: 'flex', flexDirection: 'column' }}>
            <header className="glass-panel" style={{ padding: '1.5rem 2rem', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <button onClick={() => navigate('/hugin')} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: 'inherit', padding: '0.6rem', borderRadius: '0.75rem', cursor: 'pointer' }}>
                        <ChevronLeft size={20} />
                    </button>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ padding: '0.75rem', background: 'rgba(16, 185, 129, 0.2)', borderRadius: '1rem', color: '#10b981' }}>
                            <Package size={24} />
                        </div>
                        <div>
                            <h1 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>StockManager</h1>
                            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Gestion d'inventaire scientifique</p>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button onClick={() => setIsAddingNew(true)} className="btn" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#10b981' }}>
                        <Plus size={18} /> Ajouter un Article
                    </button>
                </div>
            </header>

            <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '280px 1fr', gap: '2rem', padding: '2rem' }}>
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
                            <FilterButton active={filterCategory === 'all'} label="Tout le stock" onClick={() => setFilterCategory('all')} icon={<Box size={16} />} />
                            {categories.map(cat => (
                                <FilterButton
                                    key={cat}
                                    active={filterCategory === cat}
                                    label={cat}
                                    onClick={() => setFilterCategory(cat)}
                                    icon={<Tag size={16} />}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="glass-panel" style={{ padding: '1.5rem' }}>
                        <h3 style={{ fontSize: '0.9rem', marginBottom: '1rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Statut</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#f59e0b' }}>
                                <AlertTriangle size={18} />
                                <span style={{ fontSize: '0.9rem' }}>{items.filter(isLowStock).length} En rupture/bas</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#ef4444' }}>
                                <AlertTriangle size={18} />
                                <span style={{ fontSize: '0.9rem' }}>{items.filter(isExpired).length} Périmés</span>
                            </div>
                        </div>
                    </div>
                </aside>

                <main>
                    <div className="glass-panel" style={{ overflow: 'hidden' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead style={{ background: 'rgba(255,255,255,0.05)', fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                                <tr>
                                    <th style={{ padding: '1rem' }}>Article</th>
                                    <th style={{ padding: '1rem' }}>Catégorie</th>
                                    <th style={{ padding: '1rem' }}>Quantité</th>
                                    <th style={{ padding: '1rem' }}>Emplacement</th>
                                    <th style={{ padding: '1rem' }}>Échéance</th>
                                    <th style={{ padding: '1rem' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredItems.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} style={{ padding: '4rem', textAlign: 'center', opacity: 0.5 }}>
                                            Aucun article trouvé dans cette catégorie.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredItems.map(item => (
                                        <tr key={item.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                            <td style={{ padding: '1rem' }}>
                                                <div style={{ fontWeight: 600 }}>{item.name}</div>
                                                <div style={{ fontSize: '0.7rem', opacity: 0.5 }}>Ref: {item.reference || 'N/A'}</div>
                                            </td>
                                            <td style={{ padding: '1rem' }}>
                                                <span style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', background: 'rgba(255,255,255,0.1)', borderRadius: '0.5rem' }}>{item.category}</span>
                                            </td>
                                            <td style={{ padding: '1rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    <span style={{ color: isLowStock(item) ? '#f59e0b' : 'inherit', fontWeight: 700 }}>{item.quantity} {item.unit}</span>
                                                    {isLowStock(item) && <AlertTriangle size={14} color="#f59e0b" />}
                                                </div>
                                            </td>
                                            <td style={{ padding: '1rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem' }}>
                                                    <MapPin size={14} opacity={0.5} /> {item.location}
                                                </div>
                                            </td>
                                            <td style={{ padding: '1rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem', color: isExpired(item) ? '#ef4444' : 'inherit' }}>
                                                    <Calendar size={14} opacity={0.5} /> {new Date(item.expiryDate).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td style={{ padding: '1rem' }}>
                                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                    <button onClick={() => setEditingItem(item)} className="btn-icon" style={{ opacity: 0.6 }}><Edit2 size={16} /></button>
                                                    <button onClick={() => handleDelete(item.id)} className="btn-icon" style={{ opacity: 0.6, color: '#ef4444' }}><Trash2 size={16} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </main>
            </div>

            {(isAddingNew || editingItem) && (
                <ItemModal
                    item={editingItem}
                    categories={categories}
                    onClose={() => { setIsAddingNew(false); setEditingItem(null); }}
                    onSave={handleSave}
                />
            )}
        </div>
    );
};

const FilterButton = ({ active, label, onClick, icon }: any) => (
    <button
        onClick={onClick}
        style={{
            display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', borderRadius: '0.5rem',
            background: active ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
            color: active ? '#10b981' : 'var(--text-secondary)',
            border: 'none', cursor: 'pointer', textAlign: 'left', width: '100%', transition: 'all 0.2s'
        }}
    >
        {icon} {label}
    </button>
);

const ItemModal = ({ item, categories, onClose, onSave }: any) => {
    const [formData, setFormData] = useState<StockItem>(item || {
        id: Date.now().toString(),
        name: '',
        category: categories[0],
        quantity: 0,
        unit: 'ml',
        location: '',
        expiryDate: new Date().toISOString().split('T')[0],
        minThreshold: 1,
        reference: ''
    });

    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
            <div className="glass-panel" style={{ width: '100%', maxWidth: '600px', padding: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>{item ? 'Modifier l\'Article' : 'Ajouter un Article'}</h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}><X size={24} /></button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    <div style={{ gridColumn: '1/-1' }}>
                        <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Nom de l'article</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Catégorie</label>
                        <select
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '0.75rem', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white' }}
                        >
                            {categories.map((c: string) => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Référence / Lot</label>
                        <input
                            type="text"
                            value={formData.reference}
                            onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Quantité</label>
                        <input
                            type="number"
                            value={formData.quantity}
                            onChange={(e) => setFormData({ ...formData, quantity: parseFloat(e.target.value) })}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Unité (ml, g, boîtes...)</label>
                        <input
                            type="text"
                            value={formData.unit}
                            onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Emplacement</label>
                        <input
                            type="text"
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            placeholder="Ex: Armoire A, Tiroir 2"
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Date d'Expiration</label>
                        <input
                            type="date"
                            value={formData.expiryDate}
                            onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Seuil Alerte (Min)</label>
                        <input
                            type="number"
                            value={formData.minThreshold}
                            onChange={(e) => setFormData({ ...formData, minThreshold: parseFloat(e.target.value) })}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                        />
                    </div>
                </div>

                <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                    <button onClick={onClose} className="btn" style={{ background: 'rgba(255,255,255,0.05)' }}>Annuler</button>
                    <button onClick={() => onSave(formData)} className="btn" style={{ background: '#10b981', padding: '0.75rem 2rem' }}>
                        <Save size={18} style={{ marginRight: '0.5rem' }} /> Enregistrer
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StockManager;
