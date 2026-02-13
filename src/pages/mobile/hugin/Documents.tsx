import { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Search, FileText, Trash2, Download, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../../components/ToastContext';
import { fetchModuleData, saveModuleItem, deleteModuleItem } from '../../../utils/persistence';

type Document = {
    id: string;
    name: string;
    type: string;
    size: string;
    date: string;
    category: string;
};

const MobileDocuments = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [documents, setDocuments] = useState<Document[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Tous');

    const categories = ['Tous', 'Protocoles', 'Rapports', 'Résultats', 'Administratif'];

    useEffect(() => {
        loadDocuments();
    }, []);

    const loadDocuments = async () => {
        const data = await fetchModuleData('documents');
        if (data) setDocuments(data);
    };

    const handleDelete = async (id: string) => {
        await deleteModuleItem('documents', id);
        setDocuments(documents.filter(d => d.id !== id));
        showToast('Document supprimé', 'info');
    };

    const filteredDocs = documents.filter(doc => {
        const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'Tous' || doc.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

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
                        <h1 style={{ fontSize: '1.25rem', margin: 0 }}>Documents</h1>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
                            {documents.length} fichiers
                        </p>
                    </div>
                    <button
                        onClick={() => showToast('Upload depuis mobile bientôt disponible', 'info')}
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
                        <Upload size={20} />
                    </button>
                </div>

                {/* Search */}
                <div style={{ padding: '0 1rem 1rem' }}>
                    <div style={{ position: 'relative', marginBottom: '0.75rem' }}>
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

                    {/* Categories */}
                    <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                style={{
                                    padding: '0.5rem 1rem',
                                    background: selectedCategory === cat ? 'var(--accent-hugin)' : 'var(--bg-secondary)',
                                    border: 'none',
                                    borderRadius: '20px',
                                    color: selectedCategory === cat ? 'white' : 'var(--text-primary)',
                                    fontSize: '0.9rem',
                                    cursor: 'pointer',
                                    whiteSpace: 'nowrap',
                                    minHeight: '36px'
                                }}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="app-scrollbox" style={{ padding: '1rem' }}>
                {filteredDocs.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-secondary)' }}>
                        <FileText size={48} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
                        <p>Aucun document</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {filteredDocs.map((doc) => (
                            <div
                                key={doc.id}
                                style={{
                                    background: 'var(--bg-secondary)',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: '12px',
                                    padding: '1rem'
                                }}
                            >
                                <div style={{ display: 'flex', gap: '0.75rem' }}>
                                    <div style={{
                                        width: '44px',
                                        height: '44px',
                                        borderRadius: '10px',
                                        background: 'rgba(59, 130, 246, 0.1)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0
                                    }}>
                                        <FileText size={20} color="#3b82f6" />
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ fontWeight: 600, fontSize: '1rem', marginBottom: '0.25rem' }}>
                                            {doc.name}
                                        </div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                            {doc.type} • {doc.size} • {doc.date}
                                        </div>
                                        <div style={{
                                            display: 'inline-block',
                                            marginTop: '0.5rem',
                                            padding: '0.25rem 0.5rem',
                                            background: 'rgba(59, 130, 246, 0.1)',
                                            borderRadius: '4px',
                                            fontSize: '0.75rem',
                                            color: 'var(--accent-hugin)'
                                        }}>
                                            {doc.category}
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <button
                                            onClick={() => showToast('Téléchargement...', 'info')}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                color: 'var(--accent-hugin)',
                                                padding: '0.5rem',
                                                cursor: 'pointer',
                                                minWidth: '44px',
                                                minHeight: '44px'
                                            }}
                                        >
                                            <Download size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(doc.id)}
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
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MobileDocuments;
