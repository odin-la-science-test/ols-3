import { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Search, Package, Trash2, Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../../components/ToastContext';
import { fetchModuleData, saveModuleItem, deleteModuleItem } from '../../../utils/persistence';

type InventoryItem = {
    id: string;
    name: string;
    category: string;
    quantity: number;
    unit: string;
    location: string;
    minStock: number;
};

const MobileInventory = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [items, setItems] = useState<InventoryItem[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isAdding, setIsAdding] = useState(false);
    const [newItem, setNewItem] = useState({
        name: '',
        category: 'Réactifs',
        quantity: 0,
        unit: 'mL',
        location: '',
        minStock: 0
    });

    useEffect(() => {
        loadItems();
    }, []);

    const loadItems = async () => {
        const data = await fetchModuleData('inventory');
        if (data) setItems(data);
    };

    const handleAdd = async () => {
        if (!newItem.name) {
            showToast('Nom requis', 'error');
            return;
        }

        const item: InventoryItem = {
            id: Date.now().toString(),
            ...newItem
        };

        await saveModuleItem('inventory', item);
        setItems([...items, item]);
        setIsAdding(false);
        setNewItem({ name: '', category: 'Réactifs', quantity: 0, unit: 'mL', location: '', minStock: 0 });
        showToast('Article ajouté', 'success');
    };

    const handleDelete = async (id: string) => {
        await deleteModuleItem('inventory', id);
        setItems(items.filter(i => i.id !== id));
        showToast('Article supprimé', 'info');
    };

    const filteredItems = items.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const lowStockItems = items.filter(i => i.quantity <= i.minStock);

    return (
        <div className="app-viewport">
            {/* Header */}
            <div style={{
                position: 'sticky',
                top: 0,
                background: 'var(--bg-primary)',
                borderBottom: '1px solid var(--border-color)',
                zIndex: 100
            }}>
                <div style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button
                        onClick={() => navigate('/hugin')}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--text-primary)',
                            padding: '0.5rem',
                            cursor: 'pointer',
                            display: 'flex'
                        }}
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <div style={{ flex: 1 }}>
                        <h1 style={{ fontSize: '1.25rem', margin: 0 }}>Inventaire</h1>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
                            {items.length} articles
                        </p>
                    </div>
                    <button
                        onClick={() => setIsAdding(true)}
                        style={{
                            background: 'var(--accent-hugin)',
                            border: 'none',
                            color: 'white',
                            padding: '0.75rem',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            display: 'flex',
                            minWidth: '44px',
                            minHeight: '44px',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <Plus size={20} />
                    </button>
                </div>

                {/* Search */}
                <div style={{ padding: '0 1rem 1rem' }}>
                    <div style={{ position: 'relative' }}>
                        <Search
                            size={18}
                            style={{
                                position: 'absolute',
                                left: '1rem',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: 'var(--text-secondary)'
                            }}
                        />
                        <input
                            type="text"
                            placeholder="Rechercher..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '0.75rem 1rem 0.75rem 3rem',
                                background: 'var(--bg-secondary)',
                                border: '1px solid var(--border-color)',
                                borderRadius: '12px',
                                color: 'var(--text-primary)',
                                fontSize: '1rem'
                            }}
                        />
                    </div>
                </div>

                {/* Low Stock Alert */}
                {lowStockItems.length > 0 && (
                    <div style={{
                        margin: '0 1rem 1rem',
                        padding: '0.75rem',
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        borderRadius: '8px',
                        fontSize: '0.9rem',
                        color: '#ef4444'
                    }}>
                        ⚠️ {lowStockItems.length} article(s) en stock faible
                    </div>
                )}
            </div>

            {/* Add Form */}
            {isAdding && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.5)',
                    zIndex: 200,
                    display: 'flex',
                    alignItems: 'flex-end'
                }}>
                    <div style={{
                        background: 'var(--bg-primary)',
                        borderRadius: '20px 20px 0 0',
                        padding: '1.5rem',
                        width: '100%',
                        maxHeight: '80vh',
                        overflowY: 'auto'
                    }}>
                        <h2 style={{ marginBottom: '1.5rem' }}>Nouvel Article</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <input
                                type="text"
                                placeholder="Nom"
                                value={newItem.name}
                                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                                style={{
                                    padding: '0.75rem',
                                    background: 'var(--bg-secondary)',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: '8px',
                                    color: 'var(--text-primary)',
                                    fontSize: '1rem'
                                }}
                            />
                            <select
                                value={newItem.category}
                                onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                                style={{
                                    padding: '0.75rem',
                                    background: 'var(--bg-secondary)',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: '8px',
                                    color: 'var(--text-primary)',
                                    fontSize: '1rem'
                                }}
                            >
                                <option>Réactifs</option>
                                <option>Consommables</option>
                                <option>Équipement</option>
                                <option>Milieux</option>
                            </select>
                            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.5rem' }}>
                                <input
                                    type="number"
                                    placeholder="Quantité"
                                    value={newItem.quantity}
                                    onChange={(e) => setNewItem({ ...newItem, quantity: Number(e.target.value) })}
                                    style={{
                                        padding: '0.75rem',
                                        background: 'var(--bg-secondary)',
                                        border: '1px solid var(--border-color)',
                                        borderRadius: '8px',
                                        color: 'var(--text-primary)',
                                        fontSize: '1rem'
                                    }}
                                />
                                <input
                                    type="text"
                                    placeholder="Unité"
                                    value={newItem.unit}
                                    onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                                    style={{
                                        padding: '0.75rem',
                                        background: 'var(--bg-secondary)',
                                        border: '1px solid var(--border-color)',
                                        borderRadius: '8px',
                                        color: 'var(--text-primary)',
                                        fontSize: '1rem'
                                    }}
                                />
                            </div>
                            <input
                                type="text"
                                placeholder="Emplacement"
                                value={newItem.location}
                                onChange={(e) => setNewItem({ ...newItem, location: e.target.value })}
                                style={{
                                    padding: '0.75rem',
                                    background: 'var(--bg-secondary)',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: '8px',
                                    color: 'var(--text-primary)',
                                    fontSize: '1rem'
                                }}
                            />
                            <input
                                type="number"
                                placeholder="Stock minimum"
                                value={newItem.minStock}
                                onChange={(e) => setNewItem({ ...newItem, minStock: Number(e.target.value) })}
                                style={{
                                    padding: '0.75rem',
                                    background: 'var(--bg-secondary)',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: '8px',
                                    color: 'var(--text-primary)',
                                    fontSize: '1rem'
                                }}
                            />
                        </div>
                        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                            <button
                                onClick={() => setIsAdding(false)}
                                style={{
                                    flex: 1,
                                    padding: '0.75rem',
                                    background: 'var(--bg-secondary)',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: '8px',
                                    color: 'var(--text-primary)',
                                    fontSize: '1rem',
                                    cursor: 'pointer',
                                    minHeight: '44px'
                                }}
                            >
                                Annuler
                            </button>
                            <button
                                onClick={handleAdd}
                                style={{
                                    flex: 1,
                                    padding: '0.75rem',
                                    background: 'var(--accent-hugin)',
                                    border: 'none',
                                    borderRadius: '8px',
                                    color: 'white',
                                    fontSize: '1rem',
                                    cursor: 'pointer',
                                    minHeight: '44px'
                                }}
                            >
                                Ajouter
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Content */}
            <div className="app-scrollbox" style={{ padding: '1rem' }}>
                {filteredItems.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-secondary)' }}>
                        <Package size={48} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
                        <p>Aucun article</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {filteredItems.map((item) => (
                            <div
                                key={item.id}
                                style={{
                                    background: 'var(--bg-secondary)',
                                    border: `1px solid ${item.quantity <= item.minStock ? '#ef4444' : 'var(--border-color)'}`,
                                    borderRadius: '12px',
                                    padding: '1rem'
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 600, fontSize: '1rem', marginBottom: '0.25rem' }}>
                                            {item.name}
                                        </div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                            {item.category} • {item.location}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(item.id)}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            color: '#ef4444',
                                            padding: '0.5rem',
                                            cursor: 'pointer',
                                            minWidth: '44px',
                                            minHeight: '44px'
                                        }}
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    fontSize: '1.1rem',
                                    fontWeight: 700,
                                    color: item.quantity <= item.minStock ? '#ef4444' : 'var(--accent-hugin)'
                                }}>
                                    <Package size={18} />
                                    {item.quantity} {item.unit}
                                    {item.quantity <= item.minStock && (
                                        <span style={{ fontSize: '0.85rem', fontWeight: 400 }}>
                                            (min: {item.minStock})
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MobileInventory;
