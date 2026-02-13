import { useState, useEffect } from 'react';
import { ChevronRight, Search, AlertTriangle, Beaker, Box, Microscope, Archive, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../components/ToastContext';
import { fetchModuleData, saveModuleItem, deleteModuleItem } from '../../utils/persistence';

type InventoryItem = {
    id: string;
    name: string;
    category: 'Reagent' | 'Equipment' | 'Glassware';
    quantity: number;
    unit: string;
    status: 'Good' | 'Low' | 'Critical';
    location: string;
};

const Inventory = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [inventory, setInventory] = useState<InventoryItem[]>([]);
    const [activeTab, setActiveTab] = useState<'All' | 'Reagent' | 'Equipment' | 'Glassware'>('All');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const loadInventory = async () => {
            const data = await fetchModuleData('hugin_inventory');
            if (data && data.length > 0) {
                setInventory(data);
            } else {
                const initial: InventoryItem[] = [
                    { id: '1', name: 'Agarose Powder', category: 'Reagent', quantity: 50, unit: 'g', status: 'Critical', location: 'Shelf A1' },
                    { id: '2', name: 'Petri Dishes (90mm)', category: 'Glassware', quantity: 450, unit: 'units', status: 'Good', location: 'Drawer C2' },
                    { id: '3', name: 'Ethanol (99%)', category: 'Reagent', quantity: 1.5, unit: 'L', status: 'Low', location: 'Cabinet Flammables' },
                    { id: '4', name: 'Microscope Slides', category: 'Glassware', quantity: 200, unit: 'box', status: 'Good', location: 'Drawer C1' },
                    { id: '5', name: 'Centrifuge 5424', category: 'Equipment', quantity: 2, unit: 'units', status: 'Good', location: 'Bench 4' },
                ];
                setInventory(initial);
                for (const item of initial) {
                    await saveModuleItem('hugin_inventory', item);
                }
            }
        };
        loadInventory();
    }, []);

    const archiveItem = async (item: InventoryItem) => {
        try {
            const archiveData = {
                id: `arch_${item.id}_${Date.now()}`,
                name: `Inventory: ${item.name}`,
                category: 'Hardware',
                size: `${item.quantity} ${item.unit}`,
                date: new Date().toISOString().split('T')[0],
                description: `Article d'inventaire archivé de l'emplacement ${item.location}.`
            };

            await saveModuleItem('hugin_it_archives', archiveData);
            await deleteModuleItem('hugin_inventory', item.id);

            setInventory(inventory.filter(i => i.id !== item.id));
            showToast('Article transféré aux archives IT', 'success');
        } catch (e) {
            showToast('Erreur lors de l\'archivage', 'error');
        }
    };

    const filteredItems = inventory.filter(item => {
        const matchesTab = activeTab === 'All' || item.category === activeTab;
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesTab && matchesSearch;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Good': return 'var(--accent-munin)';
            case 'Low': return '#f59e0b'; // Amber
            case 'Critical': return '#ef4444'; // Red
            default: return 'var(--text-secondary)';
        }
    };

    const getIcon = (category: string) => {
        switch (category) {
            case 'Reagent': return <Beaker size={18} />;
            case 'Equipment': return <Microscope size={18} />;
            case 'Glassware': return <Box size={18} />;
            default: return <Box size={18} />;
        }
    };

    return (
        <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>

            {/* Header & Nav */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <button
                    onClick={() => navigate('/hugin')}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', background: 'none' }}
                >
                    <ChevronRight size={16} style={{ transform: 'rotate(180deg)' }} /> Back to Lab
                </button>
                <button className="btn btn-primary"><Box size={18} /> Add Item</button>
            </div>

            <header style={{ marginBottom: '2rem' }}>
                <h1 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Lab Inventory</h1>
                <p style={{ color: 'var(--text-secondary)' }}>Track reagents, equipment status, and consumable stock.</p>
            </header>

            {/* Controls */}
            <div className="glass-panel" style={{ padding: '1rem', marginBottom: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, minWidth: '250px' }}>
                    <Search size={20} color="var(--text-secondary)" />
                    <input
                        placeholder="Search items..."
                        className="input-field"
                        style={{ marginBottom: 0, background: 'transparent', border: 'none' }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {['All', 'Reagent', 'Equipment', 'Glassware'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className="btn"
                            style={{
                                background: activeTab === tab ? 'var(--accent-hugin)' : 'transparent',
                                color: activeTab === tab ? 'white' : 'var(--text-secondary)',
                                border: activeTab === tab ? 'none' : '1px solid var(--border-color)',
                                padding: '0.5rem 1rem',
                                fontSize: '0.9rem'
                            }}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {filteredItems.map(item => (
                    <div key={item.id} className="card glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                <div style={{ padding: '0.75rem', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '0.5rem', color: 'var(--text-primary)' }}>
                                    {getIcon(item.category)}
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '1.1rem' }}>{item.name}</h3>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{item.location}</span>
                                </div>
                            </div>
                            {item.status !== 'Good' && (
                                <AlertTriangle size={18} color={getStatusColor(item.status)} />
                            )}
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border-color)', gap: '1rem' }}>
                            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', flex: 1 }}>
                                Stock: <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{item.quantity} {item.unit}</span>
                            </div>
                            <span style={{
                                padding: '0.25rem 0.5rem',
                                borderRadius: '1rem',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                background: `${getStatusColor(item.status)}20`,
                                color: getStatusColor(item.status),
                                border: `1px solid ${getStatusColor(item.status)}40`
                            }}>
                                {item.status.toUpperCase()}
                            </span>
                            <button className="btn" style={{ padding: '0.25rem 0.5rem', background: 'transparent' }} title="Archiver" onClick={() => archiveItem(item)}>
                                <Archive size={16} color="var(--text-secondary)" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Inventory;
