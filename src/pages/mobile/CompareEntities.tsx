import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Plus, X, GitCompare, Check, Minus } from 'lucide-react';
import disciplinesData from '../../data/disciplines.json';

const MobileCompareEntities = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [selectedEntities, setSelectedEntities] = useState<any[]>([]);
    const [availableEntities, setAvailableEntities] = useState<any[]>([]);
    const [isSelecting, setIsSelecting] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        // Charger les entités depuis les paramètres URL
        const entityIds = searchParams.get('entities')?.split(',') || [];
        const entities: any[] = [];
        const allEntities: any[] = [];

        disciplinesData.forEach((discipline: any) => {
            discipline.entities?.forEach((entity: any) => {
                const fullEntity = {
                    ...entity,
                    disciplineName: discipline.name,
                    disciplineId: discipline.id
                };
                allEntities.push(fullEntity);
                
                if (entityIds.includes(entity.id)) {
                    entities.push(fullEntity);
                }
            });
        });

        setSelectedEntities(entities);
        setAvailableEntities(allEntities);
    }, [searchParams]);

    const addEntity = (entity: any) => {
        if (selectedEntities.length >= 4) {
            alert('Maximum 4 entités à comparer');
            return;
        }
        if (!selectedEntities.find(e => e.id === entity.id)) {
            setSelectedEntities([...selectedEntities, entity]);
        }
        setIsSelecting(false);
    };

    const removeEntity = (entityId: string) => {
        setSelectedEntities(selectedEntities.filter(e => e.id !== entityId));
    };

    // Collecter toutes les propriétés uniques
    const allProperties = new Set<string>();
    selectedEntities.forEach(entity => {
        entity.properties?.forEach((prop: any) => {
            allProperties.add(prop.name);
        });
    });

    const getPropertyValue = (entity: any, propertyName: string) => {
        const prop = entity.properties?.find((p: any) => p.name === propertyName);
        return prop ? `${prop.value}${prop.unit ? ' ' + prop.unit : ''}` : '-';
    };

    const filteredEntities = availableEntities.filter(e =>
        e.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !selectedEntities.find(se => se.id === e.id)
    );

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
                        <h1 style={{ fontSize: '1.25rem', margin: 0 }}>Comparaison</h1>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
                            {selectedEntities.length} entité(s) sélectionnée(s)
                        </p>
                    </div>
                    {selectedEntities.length < 4 && (
                        <button
                            onClick={() => setIsSelecting(true)}
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
                    )}
                </div>

                {/* Selected Entities Pills */}
                {selectedEntities.length > 0 && (
                    <div style={{ padding: '0 1rem 1rem', display: 'flex', gap: '0.5rem', overflowX: 'auto' }}>
                        {selectedEntities.map(entity => (
                            <div
                                key={entity.id}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    padding: '0.5rem 0.75rem',
                                    background: 'rgba(59, 130, 246, 0.1)',
                                    border: '1px solid rgba(59, 130, 246, 0.3)',
                                    borderRadius: '20px',
                                    fontSize: '0.9rem',
                                    whiteSpace: 'nowrap'
                                }}
                            >
                                <span>{entity.name}</span>
                                <button
                                    onClick={() => removeEntity(entity.id)}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: 'var(--text-primary)',
                                        padding: 0,
                                        cursor: 'pointer',
                                        display: 'flex'
                                    }}
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Selection Modal */}
            {isSelecting && (
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
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h2 style={{ margin: 0 }}>Ajouter une Entité</h2>
                            <button
                                onClick={() => setIsSelecting(false)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: 'var(--text-primary)',
                                    padding: '0.5rem',
                                    cursor: 'pointer',
                                    display: 'flex'
                                }}
                            >
                                <X size={24} />
                            </button>
                        </div>
                        
                        <input
                            type="text"
                            placeholder="Rechercher..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                background: 'var(--bg-secondary)',
                                border: '1px solid var(--border-color)',
                                borderRadius: '8px',
                                color: 'var(--text-primary)',
                                fontSize: '1rem',
                                marginBottom: '1rem'
                            }}
                        />

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {filteredEntities.slice(0, 20).map(entity => (
                                <button
                                    key={entity.id}
                                    onClick={() => addEntity(entity)}
                                    style={{
                                        background: 'var(--bg-secondary)',
                                        border: '1px solid var(--border-color)',
                                        borderRadius: '8px',
                                        padding: '0.75rem',
                                        textAlign: 'left',
                                        cursor: 'pointer',
                                        minHeight: '44px'
                                    }}
                                >
                                    <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>
                                        {entity.name}
                                    </div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                        {entity.disciplineName}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Comparison Content */}
            <div className="app-scrollbox" style={{ padding: '1rem' }}>
                {selectedEntities.length < 2 ? (
                    <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-secondary)' }}>
                        <GitCompare size={48} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
                        <p>Sélectionnez au moins 2 entités pour comparer</p>
                        <button
                            onClick={() => setIsSelecting(true)}
                            style={{
                                marginTop: '1rem',
                                padding: '0.75rem 1.5rem',
                                background: 'var(--accent-hugin)',
                                border: 'none',
                                borderRadius: '8px',
                                color: 'white',
                                fontSize: '1rem',
                                cursor: 'pointer',
                                minHeight: '44px'
                            }}
                        >
                            Ajouter des Entités
                        </button>
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        {/* Comparison Table */}
                        <div style={{ minWidth: '600px' }}>
                            {/* Header Row */}
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: `200px repeat(${selectedEntities.length}, 1fr)`,
                                gap: '0.5rem',
                                marginBottom: '0.5rem'
                            }}>
                                <div style={{
                                    padding: '0.75rem',
                                    background: 'var(--bg-secondary)',
                                    borderRadius: '8px',
                                    fontWeight: 600
                                }}>
                                    Propriété
                                </div>
                                {selectedEntities.map(entity => (
                                    <div
                                        key={entity.id}
                                        style={{
                                            padding: '0.75rem',
                                            background: 'rgba(59, 130, 246, 0.1)',
                                            border: '1px solid rgba(59, 130, 246, 0.3)',
                                            borderRadius: '8px',
                                            fontWeight: 600,
                                            fontSize: '0.9rem',
                                            textAlign: 'center'
                                        }}
                                    >
                                        {entity.name}
                                    </div>
                                ))}
                            </div>

                            {/* Property Rows */}
                            {Array.from(allProperties).map((propName, idx) => (
                                <div
                                    key={idx}
                                    style={{
                                        display: 'grid',
                                        gridTemplateColumns: `200px repeat(${selectedEntities.length}, 1fr)`,
                                        gap: '0.5rem',
                                        marginBottom: '0.5rem'
                                    }}
                                >
                                    <div style={{
                                        padding: '0.75rem',
                                        background: 'var(--bg-secondary)',
                                        borderRadius: '8px',
                                        fontSize: '0.9rem',
                                        fontWeight: 500
                                    }}>
                                        {propName}
                                    </div>
                                    {selectedEntities.map(entity => {
                                        const value = getPropertyValue(entity, propName);
                                        const hasValue = value !== '-';
                                        return (
                                            <div
                                                key={entity.id}
                                                style={{
                                                    padding: '0.75rem',
                                                    background: 'var(--bg-secondary)',
                                                    borderRadius: '8px',
                                                    fontSize: '0.9rem',
                                                    textAlign: 'center',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: '0.5rem',
                                                    color: hasValue ? 'var(--text-primary)' : 'var(--text-secondary)'
                                                }}
                                            >
                                                {hasValue ? (
                                                    <>
                                                        <Check size={14} color="#10b981" />
                                                        {value}
                                                    </>
                                                ) : (
                                                    <>
                                                        <Minus size={14} />
                                                        {value}
                                                    </>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MobileCompareEntities;
