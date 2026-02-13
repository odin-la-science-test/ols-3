import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { DisciplineData, PropertyDefinition } from '../types/munin.types';

const PropertyDetail = () => {
    const { id: disciplineId, propertyId } = useParams<{ id: string; propertyId: string }>();
    const navigate = useNavigate();
    const [disciplineData, setDisciplineData] = useState<DisciplineData | null>(null);
    const [property, setProperty] = useState<PropertyDefinition | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const data = await import(`../data/${disciplineId}.json`);
                const loadedData: DisciplineData = data.default || data;
                setDisciplineData(loadedData);

                const foundProperty = loadedData.properties.find(p => p.id === propertyId);
                setProperty(foundProperty || null);
            } catch (error) {
                console.error('Error loading property data:', error);
            } finally {
                setLoading(false);
            }
        };

        if (disciplineId && propertyId) {
            loadData();
        }
    }, [disciplineId, propertyId]);

    // Find entities that have this property
    const relatedEntities = disciplineData?.entities.filter(entity => {
        return Object.keys(entity.properties).some(key =>
            key.toLowerCase().includes(propertyId?.replace('-', '') || '')
        );
    }) || [];

    if (loading) {
        return (
            <div className="container" style={{ paddingTop: '2rem', textAlign: 'center' }}>
                <p style={{ color: 'var(--text-secondary)' }}>Chargement...</p>
            </div>
        );
    }

    if (!property || !disciplineData) {
        return (
            <div className="container" style={{ paddingTop: '2rem', textAlign: 'center' }}>
                <p style={{ color: 'var(--text-secondary)' }}>Propriété non trouvée</p>
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
                <span style={{ color: 'var(--text-primary)' }}>{property.name}</span>
            </div>

            {/* Header */}
            <header style={{ marginBottom: '3rem' }}>
                <h1 className="text-gradient" style={{ fontSize: '3rem', marginBottom: '1rem' }}>
                    {property.name}
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', lineHeight: 1.8, maxWidth: '900px' }}>
                    {property.description}
                </p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                {/* Main Content */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {/* Types */}
                    {property.types && property.types.length > 0 && (
                        <div className="glass-panel" style={{ padding: '2rem' }}>
                            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--accent-munin)' }}>
                                Types / Catégories
                            </h2>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                                {property.types.map((type, idx) => (
                                    <div
                                        key={idx}
                                        style={{
                                            padding: '1rem',
                                            background: 'var(--bg-secondary)',
                                            borderRadius: '8px',
                                            borderLeft: '3px solid var(--accent-munin)',
                                            fontWeight: 500
                                        }}
                                    >
                                        {type}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Related Concepts */}
                    {property.relatedConcepts && property.relatedConcepts.length > 0 && (
                        <div className="glass-panel" style={{ padding: '2rem' }}>
                            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--accent-munin)' }}>
                                Concepts liés
                            </h2>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                                {property.relatedConcepts.map((concept, idx) => (
                                    <span
                                        key={idx}
                                        style={{
                                            padding: '0.5rem 1rem',
                                            background: 'rgba(16, 185, 129, 0.1)',
                                            color: 'var(--accent-munin)',
                                            borderRadius: '20px',
                                            fontSize: '0.95rem'
                                        }}
                                    >
                                        {concept}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Related Entities */}
                    {relatedEntities.length > 0 && (
                        <div className="glass-panel" style={{ padding: '2rem' }}>
                            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--accent-munin)' }}>
                                Entités avec cette propriété
                            </h2>
                            <div style={{ display: 'grid', gap: '1rem' }}>
                                {relatedEntities.map((entity) => (
                                    <button
                                        key={entity.id}
                                        onClick={() => navigate(`/munin/${disciplineId}/${entity.id}`)}
                                        className="card"
                                        style={{
                                            padding: '1.5rem',
                                            textAlign: 'left',
                                            background: 'var(--bg-secondary)',
                                            cursor: 'pointer',
                                            transition: 'transform 0.2s',
                                            border: '1px solid var(--border-color)'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(4px)'}
                                        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}
                                    >
                                        <div style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                                            {entity.name}
                                        </div>
                                        <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                            {entity.category}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div className="glass-panel" style={{ padding: '1.5rem' }}>
                        <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Navigation</h3>
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

export default PropertyDetail;
