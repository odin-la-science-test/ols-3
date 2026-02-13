import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { DisciplineData, Entity } from '../types/munin.types';

const CompareEntities = () => {
    const { id: disciplineId } = useParams<{ id: string }>();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [disciplineData, setDisciplineData] = useState<DisciplineData | null>(null);
    const [entities, setEntities] = useState<Entity[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<'all' | 'diff'>('all');

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const data = await import(`../data/${disciplineId}.json`);
                const loadedData: DisciplineData = data.default || data;
                setDisciplineData(loadedData);

                // Get entity IDs from URL params
                const entityIds = searchParams.get('entities')?.split(',') || [];
                const selectedEntities = loadedData.entities.filter(e => entityIds.includes(e.id));
                setEntities(selectedEntities);
            } catch (error) {
                console.error('Error loading data:', error);
            } finally {
                setLoading(false);
            }
        };

        if (disciplineId) {
            loadData();
        }
    }, [disciplineId, searchParams]);

    const removeEntity = (entityId: string) => {
        const currentIds = searchParams.get('entities')?.split(',') || [];
        const newIds = currentIds.filter(id => id !== entityId);

        if (newIds.length < 2) {
            navigate(`/munin/${disciplineId}`);
        } else {
            navigate(`/munin/${disciplineId}/compare?entities=${newIds.join(',')}`);
        }
    };

    const getValue = (entity: Entity, key: string, section?: string) => {
        if (section) {
            return entity.additionalInfo?.[section];
        }
        const val = entity.properties[key];
        return (val && typeof val === 'object' && 'value' in val) ? (val as any).value : val;
    };

    const checkIfIdentical = (key: string, section?: string) => {
        if (entities.length < 2) return true;
        const firstVal = JSON.stringify(getValue(entities[0], key, section));
        return entities.every(e => JSON.stringify(getValue(e, key, section)) === firstVal);
    };

    // Get all unique property keys across selected entities
    const allPropertyKeys = Array.from(
        new Set(entities.flatMap(e => Object.keys(e.properties)))
    );

    // Get all unique additional info sections
    const allAdditionalSections = Array.from(
        new Set(entities.flatMap(e => e.additionalInfo ? Object.keys(e.additionalInfo) : []))
    );

    if (loading) {
        return (
            <div className="container" style={{ paddingTop: '2rem', textAlign: 'center' }}>
                <p style={{ color: 'var(--text-secondary)' }}>Chargement...</p>
            </div>
        );
    }

    if (!disciplineData || entities.length < 2) {
        return (
            <div className="container" style={{ paddingTop: '2rem', textAlign: 'center' }}>
                <p style={{ color: 'var(--text-secondary)' }}>Sélectionnez au moins 2 entités à comparer</p>
            </div>
        );
    }

    return (
        <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button
                        onClick={() => navigate(`/munin/${disciplineId}`)}
                        className="btn"
                        style={{ background: 'var(--bg-secondary)', padding: '0.5rem' }}
                    >
                        <ArrowLeft size={20} color="var(--text-secondary)" />
                    </button>
                    <div>
                        <h1 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
                            Comparaison
                        </h1>
                        <p style={{ color: 'var(--text-secondary)' }}>
                            {entities.length} entités sélectionnées
                        </p>
                    </div>
                </div>

                <div style={{
                    display: 'flex',
                    background: 'var(--bg-secondary)',
                    padding: '0.25rem',
                    borderRadius: '8px',
                    gap: '0.25rem'
                }}>
                    <button
                        onClick={() => setViewMode('all')}
                        className="btn"
                        style={{
                            background: viewMode === 'all' ? 'var(--bg-primary)' : 'transparent',
                            boxShadow: viewMode === 'all' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
                            padding: '0.5rem 1rem',
                            fontSize: '0.9rem',
                            color: viewMode === 'all' ? 'var(--text-primary)' : 'var(--text-secondary)'
                        }}
                    >
                        Tout afficher
                    </button>
                    <button
                        onClick={() => setViewMode('diff')}
                        className="btn"
                        style={{
                            background: viewMode === 'diff' ? 'var(--bg-primary)' : 'transparent',
                            boxShadow: viewMode === 'diff' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
                            padding: '0.5rem 1rem',
                            fontSize: '0.9rem',
                            color: viewMode === 'diff' ? 'var(--text-primary)' : 'var(--text-secondary)'
                        }}
                    >
                        Différences uniquement
                    </button>
                </div>
            </div>

            {/* Comparison Table */}
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 0.5rem' }}>
                    <thead>
                        <tr>
                            <th style={{
                                position: 'sticky',
                                left: 0,
                                background: 'var(--bg-primary)',
                                padding: '1rem',
                                zIndex: 10,
                                minWidth: '200px'
                            }}>
                                <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>Propriété</div>
                            </th>
                            {entities.map((entity) => (
                                <th key={entity.id} style={{ padding: '1rem', minWidth: '300px' }}>
                                    <div className="glass-panel" style={{ padding: '1rem', position: 'relative' }}>
                                        <button
                                            onClick={() => removeEntity(entity.id)}
                                            style={{
                                                position: 'absolute',
                                                top: '0.5rem',
                                                right: '0.5rem',
                                                background: 'rgba(239, 68, 68, 0.1)',
                                                color: '#ef4444',
                                                padding: '0.25rem',
                                                borderRadius: '4px'
                                            }}
                                            title="Retirer de la comparaison"
                                        >
                                            <X size={16} />
                                        </button>
                                        <div style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '0.25rem' }}>
                                            {entity.name}
                                        </div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--accent-munin)' }}>
                                            {entity.category}
                                        </div>
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {/* Overview Row */}
                        {(viewMode === 'all' || !checkIfIdentical('overview')) && (
                            <tr>
                                <td style={{
                                    position: 'sticky',
                                    left: 0,
                                    background: 'var(--bg-primary)',
                                    padding: '1rem',
                                    fontWeight: 600,
                                    verticalAlign: 'top',
                                    borderLeft: checkIfIdentical('overview') ? '4px solid #10b981' : '4px solid #ef4444'
                                }}>
                                    Description
                                </td>
                                {entities.map((entity) => (
                                    <td key={entity.id} style={{ padding: '0.5rem', verticalAlign: 'top' }}>
                                        <div className="glass-panel" style={{
                                            padding: '1rem',
                                            height: '100%',
                                            background: checkIfIdentical('overview') ? 'rgba(16, 185, 129, 0.05)' : 'rgba(239, 68, 68, 0.05)'
                                        }}>
                                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                                                {entity.overview}
                                            </p>
                                        </div>
                                    </td>
                                ))}
                            </tr>
                        )}

                        {/* Property Rows */}
                        {allPropertyKeys
                            .filter(key => viewMode === 'all' || !checkIfIdentical(key))
                            .map((key) => {
                                const isSame = checkIfIdentical(key);
                                return (
                                    <tr key={key}>
                                        <td style={{
                                            position: 'sticky',
                                            left: 0,
                                            background: 'var(--bg-primary)',
                                            padding: '1rem',
                                            fontWeight: 600,
                                            textTransform: 'capitalize',
                                            verticalAlign: 'top',
                                            borderLeft: isSame ? '4px solid #10b981' : '4px solid #ef4444'
                                        }}>
                                            {key.replace(/([A-Z])/g, ' $1').trim()}
                                        </td>
                                        {entities.map((entity) => {
                                            const value = entity.properties[key];
                                            return (
                                                <td key={entity.id} style={{ padding: '0.5rem', verticalAlign: 'top' }}>
                                                    <div className="glass-panel" style={{
                                                        padding: '1rem',
                                                        height: '100%',
                                                        background: isSame ? 'rgba(16, 185, 129, 0.05)' : 'rgba(239, 68, 68, 0.05)'
                                                    }}>
                                                        {value ? (
                                                            typeof value === 'string' ? (
                                                                <span style={{ color: 'var(--text-secondary)' }}>{value}</span>
                                                            ) : (
                                                                <span style={{ color: 'var(--text-secondary)' }}>{value.value}</span>
                                                            )
                                                        ) : (
                                                            <span style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>-</span>
                                                        )}
                                                    </div>
                                                </td>
                                            );
                                        })}
                                    </tr>
                                );
                            })}

                        {/* Additional Info Sections */}
                        {allAdditionalSections
                            .filter(section => viewMode === 'all' || !checkIfIdentical('', section))
                            .map((section) => {
                                const isSame = checkIfIdentical('', section);
                                return (
                                    <tr key={section}>
                                        <td style={{
                                            position: 'sticky',
                                            left: 0,
                                            background: 'var(--bg-primary)',
                                            padding: '1rem',
                                            fontWeight: 600,
                                            textTransform: 'capitalize',
                                            verticalAlign: 'top',
                                            borderLeft: isSame ? '4px solid #10b981' : '4px solid #ef4444'
                                        }}>
                                            {section.replace(/([A-Z])/g, ' $1').trim()}
                                        </td>
                                        {entities.map((entity) => {
                                            const content = entity.additionalInfo?.[section];
                                            return (
                                                <td key={entity.id} style={{ padding: '0.5rem', verticalAlign: 'top' }}>
                                                    <div className="glass-panel" style={{
                                                        padding: '1rem',
                                                        height: '100%',
                                                        background: isSame ? 'rgba(16, 185, 129, 0.05)' : 'rgba(239, 68, 68, 0.05)'
                                                    }}>
                                                        {content ? (
                                                            Array.isArray(content) ? (
                                                                <ul style={{ margin: 0, paddingLeft: '1.25rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                                                    {content.map((item, idx) => (
                                                                        <li key={idx} style={{ marginBottom: '0.5rem' }}>{item as string}</li>
                                                                    ))}
                                                                </ul>
                                                            ) : typeof content === 'object' ? (
                                                                <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                                                    {Object.entries(content).map(([key, val]) => (
                                                                        <div key={key} style={{ marginBottom: '0.75rem' }}>
                                                                            <strong style={{ textTransform: 'capitalize' }}>
                                                                                {key.replace(/([A-Z])/g, ' $1').trim()}:
                                                                            </strong>
                                                                            {Array.isArray(val) ? (
                                                                                <ul style={{ margin: '0.25rem 0 0 1.25rem' }}>
                                                                                    {val.map((v, i) => <li key={i}>{v as string}</li>)}
                                                                                </ul>
                                                                            ) : (
                                                                                <span> {String(val)}</span>
                                                                            )}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            ) : (
                                                                <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{content as string}</span>
                                                            )
                                                        ) : (
                                                            <span style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>-</span>
                                                        )}
                                                    </div>
                                                </td>
                                            );
                                        })}
                                    </tr>
                                );
                            })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CompareEntities;
