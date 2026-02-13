import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Info, TrendingUp, BookOpen, ExternalLink } from 'lucide-react';
import disciplinesData from '../../data/disciplines.json';

const MobilePropertyDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [property, setProperty] = useState<any>(null);
    const [relatedEntities, setRelatedEntities] = useState<any[]>([]);

    useEffect(() => {
        // Rechercher la propriété dans toutes les disciplines
        let foundProperty: any = null;
        const entities: any[] = [];

        disciplinesData.forEach((discipline: any) => {
            discipline.entities?.forEach((entity: any) => {
                entity.properties?.forEach((prop: any) => {
                    if (prop.id === id) {
                        foundProperty = { ...prop, entityName: entity.name, disciplineName: discipline.name };
                    }
                    // Collecter les entités avec cette propriété
                    if (prop.name === foundProperty?.name) {
                        entities.push({
                            ...entity,
                            disciplineName: discipline.name,
                            disciplineId: discipline.id,
                            propertyValue: prop.value
                        });
                    }
                });
            });
        });

        setProperty(foundProperty);
        setRelatedEntities(entities);
    }, [id]);

    if (!property) {
        return (
            <div className="app-viewport">
                <div style={{ padding: '2rem', textAlign: 'center' }}>
                    <p>Propriété non trouvée</p>
                </div>
            </div>
        );
    }

    return (
        <div className="app-viewport">
            {/* Header */}
            <div style={{
                position: 'sticky',
                top: 0,
                background: 'var(--bg-primary)',
                borderBottom: '1px solid var(--border-color)',
                zIndex: 100,
                padding: '1rem'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                    <button
                        onClick={() => navigate(-1)}
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
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                            {property.disciplineName} • {property.entityName}
                        </div>
                        <h1 style={{ fontSize: '1.5rem', margin: 0 }}>{property.name}</h1>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="app-scrollbox" style={{ padding: '1rem' }}>
                {/* Valeur Principale */}
                <div style={{
                    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%)',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    marginBottom: '1rem',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                        Valeur
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--accent-hugin)', marginBottom: '0.25rem' }}>
                        {property.value}
                    </div>
                    {property.unit && (
                        <div style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>
                            {property.unit}
                        </div>
                    )}
                </div>

                {/* Description */}
                {property.description && (
                    <div style={{
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '12px',
                        padding: '1rem',
                        marginBottom: '1rem'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                            <Info size={18} color="#3b82f6" />
                            <h3 style={{ margin: 0, fontSize: '1rem' }}>Description</h3>
                        </div>
                        <p style={{ margin: 0, lineHeight: 1.6, color: 'var(--text-secondary)' }}>
                            {property.description}
                        </p>
                    </div>
                )}

                {/* Méthode de Mesure */}
                {property.measurementMethod && (
                    <div style={{
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '12px',
                        padding: '1rem',
                        marginBottom: '1rem'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                            <TrendingUp size={18} color="#3b82f6" />
                            <h3 style={{ margin: 0, fontSize: '1rem' }}>Méthode de Mesure</h3>
                        </div>
                        <p style={{ margin: 0, lineHeight: 1.6, color: 'var(--text-secondary)' }}>
                            {property.measurementMethod}
                        </p>
                    </div>
                )}

                {/* Plage de Valeurs */}
                {(property.minValue || property.maxValue) && (
                    <div style={{
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '12px',
                        padding: '1rem',
                        marginBottom: '1rem'
                    }}>
                        <h3 style={{ margin: '0 0 0.75rem 0', fontSize: '1rem' }}>Plage de Valeurs</h3>
                        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                            {property.minValue && (
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                                        Minimum
                                    </div>
                                    <div style={{ fontSize: '1.25rem', fontWeight: 600 }}>
                                        {property.minValue}
                                    </div>
                                </div>
                            )}
                            {property.maxValue && (
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                                        Maximum
                                    </div>
                                    <div style={{ fontSize: '1.25rem', fontWeight: 600 }}>
                                        {property.maxValue}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Entités Associées */}
                {relatedEntities.length > 0 && (
                    <div style={{
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '12px',
                        padding: '1rem'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                            <BookOpen size={18} color="#3b82f6" />
                            <h3 style={{ margin: 0, fontSize: '1rem' }}>Entités Associées ({relatedEntities.length})</h3>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {relatedEntities.slice(0, 5).map((entity: any, idx: number) => (
                                <button
                                    key={idx}
                                    onClick={() => navigate(`/munin/${entity.disciplineId}/${entity.id}`)}
                                    style={{
                                        background: 'var(--bg-primary)',
                                        border: '1px solid var(--border-color)',
                                        borderRadius: '8px',
                                        padding: '0.75rem',
                                        textAlign: 'left',
                                        cursor: 'pointer',
                                        minHeight: '44px'
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>
                                                {entity.name}
                                            </div>
                                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                                {entity.disciplineName}
                                            </div>
                                        </div>
                                        <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--accent-hugin)' }}>
                                            {entity.propertyValue}
                                        </div>
                                    </div>
                                </button>
                            ))}
                            {relatedEntities.length > 5 && (
                                <div style={{ textAlign: 'center', padding: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                    +{relatedEntities.length - 5} autres entités
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Références */}
                {property.references && property.references.length > 0 && (
                    <div style={{
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '12px',
                        padding: '1rem',
                        marginTop: '1rem'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                            <ExternalLink size={18} color="#3b82f6" />
                            <h3 style={{ margin: 0, fontSize: '1rem' }}>Références</h3>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {property.references.map((ref: any, idx: number) => (
                                <a
                                    key={idx}
                                    href={ref.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        padding: '0.75rem',
                                        background: 'var(--bg-primary)',
                                        border: '1px solid var(--border-color)',
                                        borderRadius: '8px',
                                        color: '#3b82f6',
                                        textDecoration: 'none',
                                        minHeight: '44px'
                                    }}
                                >
                                    <span>{ref.title}</span>
                                    <ExternalLink size={16} />
                                </a>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MobilePropertyDetail;
