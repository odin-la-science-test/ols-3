import { useParams, useNavigate } from 'react-router-dom';
import { X, ExternalLink, ArrowLeft } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { DisciplineData, Entity, Property } from '../types/munin.types';

const EntityDetail = () => {
    const params = useParams<{ disciplineId?: string; entityId?: string; id?: string }>();
    const navigate = useNavigate();
    const [disciplineData, setDisciplineData] = useState<DisciplineData | null>(null);
    const [entity, setEntity] = useState<Entity | null>(null);
    const [loading, setLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);

    // Support both route formats
    const disciplineId = params.disciplineId || params.id?.split('/')[0];
    const entityId = params.entityId || params.id?.split('/')[1];

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const data = await import(`../data/${disciplineId}.json`);
                const loadedData: DisciplineData = data.default || data;
                setDisciplineData(loadedData);

                const foundEntity = loadedData.entities.find(e => e.id === entityId);
                setEntity(foundEntity || null);
                
                // Trigger animation after data is loaded
                setTimeout(() => setIsOpen(true), 50);
            } catch (error) {
                console.error('Error loading entity data:', error);
            } finally {
                setLoading(false);
            }
        };

        if (disciplineId && entityId) {
            loadData();
        }
    }, [disciplineId, entityId]);

    const handleClose = () => {
        setIsOpen(false);
        setTimeout(() => navigate(`/munin/${disciplineId}`), 300);
    };

    const renderPropertyValue = (value: Property | string) => {
        if (typeof value === 'string') {
            return <span>{value}</span>;
        }

        return (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>{value.value}</span>
                {value.link && (
                    <button
                        onClick={() => navigate(value.link!)}
                        style={{
                            background: 'none',
                            color: 'var(--accent-munin)',
                            padding: '0.25rem',
                            display: 'flex',
                            alignItems: 'center'
                        }}
                        title="En savoir plus"
                    >
                        <ExternalLink size={14} />
                    </button>
                )}
            </div>
        );
    };

    if (loading) {
        return (
            <div className="container" style={{ paddingTop: '2rem', textAlign: 'center' }}>
                <p style={{ color: 'var(--text-secondary)' }}>Chargement...</p>
            </div>
        );
    }

    if (!entity || !disciplineData) {
        return (
            <div className="container" style={{ paddingTop: '2rem', textAlign: 'center' }}>
                <p style={{ color: 'var(--text-secondary)' }}>Entité non trouvée</p>
            </div>
        );
    }

    return (
        <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
            {/* Breadcrumb */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                <button
                    onClick={() => navigate('/munin')}
                    style={{ background: 'none', color: 'var(--text-secondary)' }}
                >
                    Munin Atlas
                </button>
                <span style={{ color: 'var(--text-secondary)' }}>/</span>
                <button
                    onClick={() => navigate(`/munin/${disciplineId}`)}
                    style={{ background: 'none', color: 'var(--text-secondary)' }}
                >
                    {disciplineData.displayName}
                </button>
                <span style={{ color: 'var(--text-secondary)' }}>/</span>
                <span style={{ color: 'var(--text-primary)' }}>{entity.name}</span>
            </div>

            {/* Header */}
            <header style={{ marginBottom: '3rem' }}>
                <div style={{ marginBottom: '1rem' }}>
                    <span style={{
                        fontSize: '0.9rem',
                        padding: '0.5rem 1rem',
                        background: 'rgba(16, 185, 129, 0.1)',
                        color: 'var(--accent-munin)',
                        borderRadius: '20px'
                    }}>
                        {entity.category}
                    </span>
                </div>
                <h1 className="text-gradient" style={{ fontSize: '3rem', marginBottom: '1rem' }}>
                    {entity.name}
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', lineHeight: 1.8, maxWidth: '900px' }}>
                    {entity.overview}
                </p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                {/* Main Content */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {/* Properties */}
                    <div className="glass-panel" style={{ padding: '2rem' }}>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--accent-munin)' }}>
                            Propriétés
                        </h2>
                        <div style={{ display: 'grid', gap: '1rem' }}>
                            {Object.entries(entity.properties).map(([key, value]) => (
                                <div
                                    key={key}
                                    style={{
                                        display: 'grid',
                                        gridTemplateColumns: '200px 1fr',
                                        gap: '1rem',
                                        padding: '1rem',
                                        background: 'var(--bg-secondary)',
                                        borderRadius: '8px',
                                        alignItems: 'center'
                                    }}
                                >
                                    <strong style={{ color: 'var(--text-primary)', textTransform: 'capitalize' }}>
                                        {key.replace(/([A-Z])/g, ' $1').trim()}
                                    </strong>
                                    <div style={{ color: 'var(--text-secondary)' }}>
                                        {renderPropertyValue(value)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Additional Info Sections */}
                    {entity.additionalInfo && Object.entries(entity.additionalInfo).map(([section, content]) => (
                        <div key={section} className="glass-panel" style={{ padding: '2rem' }}>
                            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--accent-munin)', textTransform: 'capitalize' }}>
                                {section.replace(/([A-Z])/g, ' $1').trim()}
                            </h2>
                            {Array.isArray(content) ? (
                                <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    {content.map((item, idx) => (
                                        <li
                                            key={idx}
                                            style={{
                                                padding: '0.75rem 1rem',
                                                background: 'var(--bg-secondary)',
                                                borderRadius: '6px',
                                                borderLeft: '3px solid var(--accent-munin)'
                                            }}
                                        >
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>{content}</p>
                            )}
                        </div>
                    ))}
                </div>

                {/* Sidebar */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {/* Related Entities */}
                    {entity.relatedEntities && entity.relatedEntities.length > 0 && (
                        <div className="glass-panel" style={{ padding: '1.5rem' }}>
                            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--accent-munin)' }}>
                                Entités liées
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {entity.relatedEntities.map((related) => (
                                    <button
                                        key={related.id}
                                        onClick={() => navigate(related.link)}
                                        className="card"
                                        style={{
                                            padding: '1rem',
                                            textAlign: 'left',
                                            background: 'var(--bg-secondary)',
                                            cursor: 'pointer',
                                            transition: 'transform 0.2s'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(4px)'}
                                        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}
                                    >
                                        <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{related.name}</div>
                                        {related.description && (
                                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                                {related.description}
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Quick Actions */}
                    <div className="glass-panel" style={{ padding: '1.5rem' }}>
                        <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Actions rapides</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <button
                                onClick={() => navigate(`/munin/${disciplineId}`)}
                                className="btn"
                                style={{ background: 'var(--bg-secondary)', justifyContent: 'flex-start' }}
                            >
                                <ArrowLeft size={16} />
                                Retour à {disciplineData.displayName}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EntityDetail;
