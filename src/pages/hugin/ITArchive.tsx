import { useState, useEffect } from 'react';
import { ChevronRight, Download, Search, HardDrive, Cpu, Globe, FolderOpen, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { fetchModuleData, saveModuleItem } from '../../utils/persistence';

type ITDoc = {
    id: number;
    name: string;
    category: 'Software' | 'Hardware' | 'Network' | 'Internal';
    size: string;
    date: string;
    description: string;
};

const ITArchive = () => {
    const navigate = useNavigate();
    const [archives, setArchives] = useState<ITDoc[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('All');

    const categories = ['All', 'Software', 'Hardware', 'Network', 'Internal'];

    useEffect(() => {
        const loadArchives = async () => {
            const data = await fetchModuleData('hugin_it_archives');
            if (data && data.length > 0) {
                setArchives(data);
            } else {
                const initial: ITDoc[] = [
                    { id: 1, name: 'Server_Configuration_2025.log', category: 'Network', size: '125 KB', date: '2025-12-15', description: 'Main server configuration and port mapping.' },
                    { id: 2, name: 'Lab_Inventory_System_Manual.pdf', category: 'Software', size: '4.2 MB', date: '2026-01-10', description: 'User guide for the inventory tracking software.' },
                    { id: 3, name: 'Switch_Layer3_topology.png', category: 'Network', size: '1.8 MB', date: '2026-01-22', description: 'Visual mapping of the lab internal network.' },
                    { id: 4, name: 'Workstation_Pro_Specifications.pdf', category: 'Hardware', size: '2.1 MB', date: '2025-11-30', description: 'Hardware specs for high-performance lab computers.' },
                    { id: 5, name: 'Database_Backup_Schema.sql', category: 'Software', size: '850 KB', date: '2026-02-05', description: 'SQL structure for Hugin DB backups.' },
                    { id: 6, name: 'Internal_IT_Policy_v2.docx', category: 'Internal', size: '320 KB', date: '2026-01-05', description: 'Security and usage policy for IT resources.' },
                ];
                setArchives(initial);
                for (const item of initial) {
                    await saveModuleItem('hugin_it_archives', item);
                }
            }
        };
        loadArchives();
    }, []);

    const combinedDocs = archives;

    const filteredDocs = combinedDocs.filter(doc => {
        const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doc.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || doc.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const getCategoryIcon = (cat: string) => {
        switch (cat) {
            case 'Software': return <Cpu size={18} />;
            case 'Hardware': return <HardDrive size={18} />;
            case 'Network': return <Globe size={18} />;
            default: return <FolderOpen size={18} />;
        }
    };

    return (
        <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
            {/* Header / Breadcrumb */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <button
                    onClick={() => navigate('/hugin')}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                    <ChevronRight size={16} style={{ transform: 'rotate(180deg)' }} /> Retour au Labo
                </button>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        Total: <strong>{combinedDocs.length} archives</strong>
                    </span>
                </div>
            </div>

            <header style={{ marginBottom: '3rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <div style={{ padding: '1.2rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '1rem', color: 'var(--accent-hugin)' }}>
                    <HardDrive size={48} />
                </div>
                <div>
                    <h1 className="text-gradient" style={{ fontSize: '2.8rem', marginBottom: '0.25rem' }}>Archives Informatiques</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Centralisation des documents techniques et spécifications système.</p>
                </div>
            </header>

            {/* Controls Bar */}
            <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem', display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, minWidth: '300px', background: 'rgba(255,255,255,0.03)', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                    <Search size={20} color="var(--text-secondary)" />
                    <input
                        placeholder="Rechercher une archive ou une description..."
                        style={{ background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-primary)', width: '100%', fontSize: '1rem' }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            style={{
                                padding: '0.5rem 1rem',
                                borderRadius: '6px',
                                border: '1px solid var(--border-color)',
                                background: selectedCategory === cat ? 'var(--accent-hugin)' : 'rgba(255,255,255,0.05)',
                                color: selectedCategory === cat ? 'white' : 'var(--text-secondary)',
                                cursor: 'pointer',
                                fontSize: '0.9rem',
                                transition: 'all 0.2s',
                                fontWeight: selectedCategory === cat ? 600 : 400
                            }}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Archive List */}
            <div style={{ display: 'grid', gap: '1rem' }}>
                {filteredDocs.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--text-secondary)', opacity: 0.5 }} className="glass-panel">
                        <FolderOpen size={64} style={{ marginBottom: '1rem' }} />
                        <p>Aucune archive ne correspond à votre recherche.</p>
                    </div>
                ) : (
                    filteredDocs.map(doc => (
                        <div key={doc.id} className="card glass-panel hover-bg-secondary" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                            <div style={{
                                width: '50px',
                                height: '50px',
                                borderRadius: '10px',
                                background: 'rgba(255,255,255,0.05)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'var(--accent-hugin)'
                            }}>
                                {getCategoryIcon(doc.category)}
                            </div>

                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.25rem' }}>
                                    <h3 style={{ fontSize: '1.2rem', margin: 0 }}>{doc.name}</h3>
                                    <span style={{
                                        fontSize: '0.7rem',
                                        padding: '0.2rem 0.6rem',
                                        borderRadius: '10px',
                                        background: 'rgba(59, 130, 246, 0.1)',
                                        color: 'var(--accent-hugin)',
                                        border: '1px solid rgba(59, 130, 246, 0.2)',
                                        textTransform: 'uppercase',
                                        fontWeight: 700
                                    }}>
                                        {doc.category}
                                    </span>
                                </div>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Info size={14} /> {doc.description}
                                </p>
                            </div>

                            <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{doc.date} • {doc.size}</span>
                                <button className="btn btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Download size={14} /> Download
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ITArchive;
