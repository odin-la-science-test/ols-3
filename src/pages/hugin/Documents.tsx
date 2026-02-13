import { useState, useEffect } from 'react';
import { ChevronRight, FileText, Lock, Shield, Upload, Download, Search, Archive } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../components/ToastContext';
import { fetchModuleData, saveModuleItem, deleteModuleItem } from '../../utils/persistence';

type Doc = {
    id: string;
    name: string;
    type: 'pdf' | 'docx' | 'xlsx';
    size: string;
    security: 'Confidential' | 'Internal' | 'Public';
    date: string;
};

const Documents = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [searchTerm, setSearchTerm] = useState('');
    const [docs, setDocs] = useState<Doc[]>([]);

    useEffect(() => {
        const loadDocs = async () => {
            const data = await fetchModuleData('hugin_documents');
            if (data && data.length > 0) {
                setDocs(data);
            } else {
                const initial: Doc[] = [
                    { id: '1', name: 'Project_Hugin_Specs.pdf', type: 'pdf', size: '2.4 MB', security: 'Confidential', date: '2026-02-01' },
                    { id: '2', name: 'Lab_Budget_2026.xlsx', type: 'xlsx', size: '1.1 MB', security: 'Confidential', date: '2026-01-20' },
                    { id: '3', name: 'Safety_Manual_v12.pdf', type: 'pdf', size: '5.6 MB', security: 'Public', date: '2026-01-05' },
                    { id: '4', name: 'Meeting_Notes_Feb.docx', type: 'docx', size: '500 KB', security: 'Internal', date: '2026-02-05' },
                ];
                setDocs(initial);
                for (const item of initial) {
                    await saveModuleItem('hugin_documents', item);
                }
            }
        };
        loadDocs();
    }, []);

    const archiveDocument = async (doc: Doc) => {
        try {
            const archiveItem = {
                id: `arch_${doc.id}_${Date.now()}`,
                name: doc.name,
                category: doc.security === 'Confidential' ? 'Internal' : 'Software',
                size: doc.size,
                date: new Date().toISOString().split('T')[0],
                description: `Document sécurisé archivé (${doc.security}).`
            };

            await saveModuleItem('hugin_it_archives', archiveItem);
            await deleteModuleItem('hugin_documents', doc.id);

            setDocs(docs.filter(d => d.id !== doc.id));
            showToast('Document transféré aux archives', 'success');
        } catch (e) {
            showToast('Erreur lors de l\'archivage', 'error');
        }
    };

    const filteredDocs = docs.filter(doc => doc.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const getSecurityColor = (sec: string) => {
        switch (sec) {
            case 'Confidential': return '#ef4444';
            case 'Internal': return '#f59e0b';
            case 'Public': return 'var(--accent-munin)';
            default: return 'var(--text-secondary)';
        }
    };

    return (
        <div className="container" style={{ paddingTop: '2rem' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <button
                    onClick={() => navigate('/hugin')}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', background: 'none' }}
                >
                    <ChevronRight size={16} style={{ transform: 'rotate(180deg)' }} /> Back to Lab
                </button>
                <button className="btn btn-primary"><Upload size={18} /> Upload Secure File</button>
            </div>

            <header style={{ marginBottom: '3rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ padding: '1rem', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '1rem', color: 'var(--accent-hugin)' }}>
                    <Shield size={40} />
                </div>
                <div>
                    <h1 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '0.25rem' }}>Secure Documents</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Encrypted vault for sensitive laboratory data.</p>
                </div>
            </header>

            {/* Filter Bar */}
            <div className="glass-panel" style={{ padding: '1rem', marginBottom: '2rem', display: 'flex' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                    <Search size={20} color="var(--text-secondary)" />
                    <input
                        placeholder="Search secure files..."
                        className="input-field"
                        style={{ marginBottom: 0, background: 'transparent', border: 'none' }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* List */}
            <div className="glass-panel" style={{ padding: '0' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', padding: '1rem', borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontWeight: 600 }}>
                    <div>Name</div>
                    <div>Security Level</div>
                    <div>Type</div>
                    <div>Size</div>
                    <div>Action</div>
                </div>

                {filteredDocs.map(doc => (
                    <div key={doc.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', padding: '1rem', alignItems: 'center', borderBottom: '1px solid var(--border-color)' }} className="hover-bg-secondary">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <FileText size={18} color="var(--text-secondary)" />
                            {doc.name}
                        </div>
                        <div>
                            <span style={{
                                padding: '0.25rem 0.75rem',
                                borderRadius: '1rem',
                                fontSize: '0.75rem',
                                background: `${getSecurityColor(doc.security)}20`,
                                color: getSecurityColor(doc.security),
                                border: `1px solid ${getSecurityColor(doc.security)}40`,
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.25rem'
                            }}>
                                {doc.security === 'Confidential' && <Lock size={10} />}
                                {doc.security.toUpperCase()}
                            </span>
                        </div>
                        <div style={{ color: 'var(--text-secondary)' }}>{doc.type.toUpperCase()}</div>
                        <div style={{ color: 'var(--text-secondary)' }}>{doc.size}</div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button className="btn" style={{ padding: '0.25rem 0.5rem' }} title="Télécharger">
                                <Download size={16} />
                            </button>
                            <button className="btn" style={{ padding: '0.25rem 0.5rem' }} title="Archiver" onClick={() => archiveDocument(doc)}>
                                <Archive size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Documents;
