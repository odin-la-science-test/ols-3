import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, BookOpen, Beaker, Microscope } from 'lucide-react';
import disciplinesData from '../data/disciplines.json';

const MobileDiscipline = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [discipline, setDiscipline] = useState<any>(null);

    useEffect(() => {
        const found = disciplinesData.disciplines.find((d: any) => d.id === id);
        setDiscipline(found);
    }, [id]);

    if (!discipline) {
        return (
            <div className="app-viewport">
                <div style={{ padding: '2rem', textAlign: 'center' }}>
                    <p>Discipline non trouvée</p>
                </div>
            </div>
        );
    }

    const filteredEntities = discipline.entities?.filter((e: any) =>
        e.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

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
                        onClick={() => navigate('/munin')}
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
                        <h1 style={{ fontSize: '1.25rem', margin: 0 }}>{discipline.name}</h1>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
                            {discipline.entities?.length || 0} entités
                        </p>
                    </div>
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
                            placeholder="Rechercher une entité..."
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
            </div>

            {/* Content */}
            <div className="app-scrollbox" style={{ padding: '1rem' }}>
                {filteredEntities.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-secondary)' }}>
                        <Microscope size={48} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
                        <p>Aucune entité trouvée</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {filteredEntities.map((entity: any) => (
                            <button
                                key={entity.id}
                                onClick={() => navigate(`/munin/${id}/${entity.id}`)}
                                style={{
                                    background: 'var(--bg-secondary)',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: '12px',
                                    padding: '1rem',
                                    textAlign: 'left',
                                    cursor: 'pointer',
                                    minHeight: '44px'
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <div style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '10px',
                                        background: 'rgba(59, 130, 246, 0.1)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0
                                    }}>
                                        <Beaker size={20} color="#3b82f6" />
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ fontWeight: 600, fontSize: '1rem', marginBottom: '0.25rem' }}>
                                            {entity.name}
                                        </div>
                                        {entity.description && (
                                            <div style={{
                                                fontSize: '0.85rem',
                                                color: 'var(--text-secondary)',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }}>
                                                {entity.description}
                                            </div>
                                        )}
                                    </div>
                                    <BookOpen size={18} style={{ color: 'var(--text-secondary)', flexShrink: 0 }} />
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MobileDiscipline;
