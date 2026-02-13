import { useParams, useNavigate } from 'react-router-dom';
import { Search, ChevronRight, GitCompare } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { DisciplineData } from '../types/munin.types';
import { useLanguage } from '../components/LanguageContext';
import { useDeviceDetection } from '../hooks/useDeviceDetection';
import Navbar from '../components/Navbar';

const Discipline = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { t } = useLanguage();
    const { isMobile } = useDeviceDetection();
    const [searchTerm, setSearchTerm] = useState('');
    const [disciplineData, setDisciplineData] = useState<DisciplineData | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedEntities, setSelectedEntities] = useState<string[]>([]);
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState<Record<string, string>>({});
    const [selectedEntity, setSelectedEntity] = useState<any | null>(null);
    const [isPanelOpen, setIsPanelOpen] = useState(false);

    useEffect(() => {
        const loadDisciplineData = async () => {
            try {
                setLoading(true);
                const data = await import(`../data/${id}.json`);
                setDisciplineData(data.default || data);
                // Reset filters when discipline changes
                setFilters({});
            } catch (error) {
                console.error('Error loading discipline data:', error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            loadDisciplineData();
        }
    }, [id]);

    // Extract unique property keys and their possible values
    const availableProperties = disciplineData?.entities.reduce((acc, entity) => {
        Object.entries(entity.properties).forEach(([key, prop]) => {
            if (!acc[key]) acc[key] = new Set<string>();
            const value = typeof prop === 'string' ? prop : prop.value;
            if (value) acc[key].add(value);
        });
        return acc;
    }, {} as Record<string, Set<string>>) || {};

    const filteredEntities = disciplineData?.entities.filter(entity => {
        const matchesSearch = entity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            entity.category.toLowerCase().includes(searchTerm.toLowerCase());

        // Dynamic filtering based on property values
        const matchesFilters = Object.entries(filters).every(([key, value]) => {
            if (!value) return true;
            const prop = entity.properties[key];
            const propValue = typeof prop === 'string' ? prop : prop?.value;
            return propValue === value;
        });

        return matchesSearch && matchesFilters;
    }) || [];

    const toggleEntitySelection = (entityId: string) => {
        setSelectedEntities(prev =>
            prev.includes(entityId)
                ? prev.filter(id => id !== entityId)
                : [...prev, entityId]
        );
    };

    const openEntityPanel = (entity: any) => {
        setSelectedEntity(entity);
        setIsPanelOpen(true);
    };

    const closeEntityPanel = () => {
        setIsPanelOpen(false);
        setTimeout(() => setSelectedEntity(null), 300);
    };

    const handleCompare = () => {
        if (selectedEntities.length >= 2) {
            navigate(`/munin/${id}/compare?entities=${selectedEntities.join(',')}`);
        }
    };

    if (loading) {
        return (
            <div style={{ minHeight: '100vh' }}>
                <Navbar />
                <div className="container" style={{ paddingTop: '2rem', textAlign: 'center' }}>
                    <p style={{ color: 'var(--text-secondary)' }}>{t('common.loading')}</p>
                </div>
            </div>
        );
    }

    if (!disciplineData) {
        return (
            <div style={{ minHeight: '100vh' }}>
                <Navbar />
                <div className="container" style={{ paddingTop: '2rem', textAlign: 'center' }}>
                    <p style={{ color: 'var(--text-secondary)' }}>Discipline non trouvée</p>
                </div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', position: 'relative' }}>
            <Navbar />

            <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>

                {/* Header Actions */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <button
                        onClick={() => navigate('/munin')}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            color: 'var(--text-secondary)',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '0.95rem',
                            transition: 'color 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-munin)'}
                        onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
                    >
                        <ChevronRight size={16} style={{ transform: 'rotate(180deg)' }} /> Retour à Munin Atlas
                    </button>

                    {selectedEntities.length > 0 && (
                        <button
                            onClick={handleCompare}
                            disabled={selectedEntities.length < 2}
                            className={`btn ${selectedEntities.length >= 2 ? 'btn-primary' : ''}`}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                opacity: selectedEntities.length < 2 ? 0.5 : 1
                            }}
                        >
                            <GitCompare size={18} /> {t('common.compare')} ({selectedEntities.length})
                        </button>
                    )}
                </div>

                <header style={{ marginBottom: '3rem' }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        marginBottom: '2rem'
                    }}>
                        <div style={{ flex: 1 }}>
                            <h1 className="text-gradient" style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>
                                {disciplineData.displayName}
                            </h1>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '800px', margin: 0 }}>
                                {disciplineData.description}
                            </p>
                        </div>
                    </div>

                    {/* Statistics Cards */}
                    <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
                        gap: '1rem',
                        marginTop: '2rem'
                    }}>
                        <div style={{ 
                            padding: '1.5rem', 
                            textAlign: 'center',
                            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.05))',
                            border: '1px solid rgba(16, 185, 129, 0.3)',
                            borderRadius: '1rem',
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
                            <div style={{
                                position: 'absolute',
                                top: '-20px',
                                right: '-20px',
                                width: '80px',
                                height: '80px',
                                borderRadius: '50%',
                                background: 'radial-gradient(circle, rgba(16, 185, 129, 0.2), transparent)',
                                filter: 'blur(20px)'
                            }} />
                            <div style={{ 
                                fontSize: '2.5rem', 
                                fontWeight: 800, 
                                color: 'var(--accent-munin)',
                                marginBottom: '0.5rem',
                                position: 'relative'
                            }}>
                                {disciplineData.entities.length}
                            </div>
                            <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', fontWeight: 600, position: 'relative' }}>
                                Total
                            </div>
                        </div>

                        {/* Count by Gram type if available */}
                        {(() => {
                            const gramPositive = disciplineData.entities.filter(e => {
                                const gram = e.properties['GRAM'] || e.properties['gram'];
                                const value = typeof gram === 'string' ? gram : gram?.value;
                                return value === '+' || value === 'Positive';
                            }).length;
                            
                            const gramNegative = disciplineData.entities.filter(e => {
                                const gram = e.properties['GRAM'] || e.properties['gram'];
                                const value = typeof gram === 'string' ? gram : gram?.value;
                                return value === '-' || value === 'Negative' || value === '−';
                            }).length;

                            if (gramPositive > 0 || gramNegative > 0) {
                                return (
                                    <>
                                        <div style={{ 
                                            padding: '1.5rem', 
                                            textAlign: 'center',
                                            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(59, 130, 246, 0.05))',
                                            border: '1px solid rgba(59, 130, 246, 0.3)',
                                            borderRadius: '1rem',
                                            position: 'relative',
                                            overflow: 'hidden'
                                        }}>
                                            <div style={{
                                                position: 'absolute',
                                                top: '-20px',
                                                right: '-20px',
                                                width: '80px',
                                                height: '80px',
                                                borderRadius: '50%',
                                                background: 'radial-gradient(circle, rgba(59, 130, 246, 0.2), transparent)',
                                                filter: 'blur(20px)'
                                            }} />
                                            <div style={{ 
                                                fontSize: '2.5rem', 
                                                fontWeight: 800, 
                                                color: '#3b82f6',
                                                marginBottom: '0.5rem',
                                                position: 'relative'
                                            }}>
                                                {gramPositive}
                                            </div>
                                            <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', fontWeight: 600, position: 'relative' }}>
                                                Gram +
                                            </div>
                                        </div>

                                        <div style={{ 
                                            padding: '1.5rem', 
                                            textAlign: 'center',
                                            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(139, 92, 246, 0.05))',
                                            border: '1px solid rgba(139, 92, 246, 0.3)',
                                            borderRadius: '1rem',
                                            position: 'relative',
                                            overflow: 'hidden'
                                        }}>
                                            <div style={{
                                                position: 'absolute',
                                                top: '-20px',
                                                right: '-20px',
                                                width: '80px',
                                                height: '80px',
                                                borderRadius: '50%',
                                                background: 'radial-gradient(circle, rgba(139, 92, 246, 0.2), transparent)',
                                                filter: 'blur(20px)'
                                            }} />
                                            <div style={{ 
                                                fontSize: '2.5rem', 
                                                fontWeight: 800, 
                                                color: '#8b5cf6',
                                                marginBottom: '0.5rem',
                                                position: 'relative'
                                            }}>
                                                {gramNegative}
                                            </div>
                                            <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', fontWeight: 600, position: 'relative' }}>
                                                Gram -
                                            </div>
                                        </div>
                                    </>
                                );
                            }
                            return null;
                        })()}

                        {/* Resistance count if available */}
                        {(() => {
                            const resistant = disciplineData.entities.filter(e => {
                                const resistance = e.properties['Résistance'] || e.properties['resistance'];
                                return resistance;
                            }).length;

                            if (resistant > 0) {
                                return (
                                    <div style={{ 
                                        padding: '1.5rem', 
                                        textAlign: 'center',
                                        background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(239, 68, 68, 0.05))',
                                        border: '1px solid rgba(239, 68, 68, 0.3)',
                                        borderRadius: '1rem',
                                        position: 'relative',
                                        overflow: 'hidden'
                                    }}>
                                        <div style={{
                                            position: 'absolute',
                                            top: '-20px',
                                            right: '-20px',
                                            width: '80px',
                                            height: '80px',
                                            borderRadius: '50%',
                                            background: 'radial-gradient(circle, rgba(239, 68, 68, 0.2), transparent)',
                                            filter: 'blur(20px)'
                                        }} />
                                        <div style={{ 
                                            fontSize: '2.5rem', 
                                            fontWeight: 800, 
                                            color: '#ef4444',
                                            marginBottom: '0.5rem',
                                            position: 'relative'
                                        }}>
                                            {resistant}
                                        </div>
                                        <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', fontWeight: 600, position: 'relative' }}>
                                            Résistance
                                        </div>
                                    </div>
                                );
                            }
                            return null;
                        })()}
                    </div>
                </header>

                {/* Search Bar */}
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                    <div className="glass-panel" style={{ flex: 1, padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <Search size={20} color="var(--text-secondary)" />
                        <input
                            type="text"
                            placeholder={`${t('common.search')} ${disciplineData.displayName}...`}
                            className="input-field"
                            style={{ marginBottom: 0, background: 'transparent', border: 'none', padding: '0.5rem', fontSize: '1.1rem', width: '100%' }}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="btn"
                        style={{
                            background: showFilters ? 'var(--accent-munin)' : 'var(--bg-secondary)',
                            color: showFilters ? 'white' : 'var(--text-primary)',
                            padding: '0 1.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}
                    >
                        {t('common.filters')} {showFilters ? '▲' : '▼'}
                    </button>
                </div>

                {/* Advanced Filters Panel */}
                {showFilters && (
                    <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem', background: 'rgba(255,255,255,0.02)' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                            {Object.entries(availableProperties).map(([key, values]) => (
                                <div key={key}>
                                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'capitalize' }}>
                                        {key.replace(/([A-Z])/g, ' $1').trim()}
                                    </label>
                                    <select
                                        className="input-field"
                                        style={{ marginBottom: 0 }}
                                        value={filters[key] || ''}
                                        onChange={(e) => setFilters({ ...filters, [key]: e.target.value })}
                                    >
                                        <option value="">{t('common.all')}</option>
                                        {Array.from(values).sort().map(val => (
                                            <option key={val} value={val}>{val}</option>
                                        ))}
                                    </select>
                                </div>
                            ))}
                        </div>

                        <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
                            <button
                                className="btn"
                                style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}
                                onClick={() => setFilters({})}
                            >
                                {t('common.reset_filters')}
                            </button>
                        </div>
                    </div>
                )}

                {/* Entity Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                    {filteredEntities.map((entity) => (
                        <div
                            key={entity.id}
                            className="card glass-panel"
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '1rem',
                                cursor: 'pointer',
                                transition: 'all 0.3s',
                                position: 'relative',
                                padding: '1.5rem',
                                background: 'rgba(255, 255, 255, 0.02)',
                                border: '1px solid rgba(255, 255, 255, 0.1)'
                            }}
                            onClick={() => openEntityPanel(entity)}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-4px)';
                                e.currentTarget.style.borderColor = 'var(--accent-munin)';
                                e.currentTarget.style.boxShadow = '0 8px 16px rgba(16, 185, 129, 0.2)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        >
                            <div
                                style={{
                                    position: 'absolute',
                                    top: '1rem',
                                    right: '1rem',
                                    zIndex: 10
                                }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    toggleEntitySelection(entity.id);
                                }}
                            >
                                <div style={{
                                    width: '24px',
                                    height: '24px',
                                    borderRadius: '6px',
                                    border: '2px solid var(--accent-munin)',
                                    background: selectedEntities.includes(entity.id) ? 'var(--accent-munin)' : 'transparent',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'all 0.2s',
                                    cursor: 'pointer'
                                }}>
                                    {selectedEntities.includes(entity.id) && (
                                        <span style={{ color: 'white', fontSize: '1rem', fontWeight: 'bold' }}>✓</span>
                                    )}
                                </div>
                            </div>

                            <div>
                                <h3 style={{ 
                                    fontSize: '1.25rem', 
                                    marginBottom: '0.5rem',
                                    fontWeight: 700,
                                    fontStyle: 'italic'
                                }}>
                                    {entity.name}
                                </h3>
                                <span style={{ 
                                    fontSize: '0.85rem', 
                                    color: 'var(--accent-munin)',
                                    background: 'rgba(16, 185, 129, 0.1)',
                                    padding: '0.25rem 0.75rem',
                                    borderRadius: '1rem',
                                    display: 'inline-block'
                                }}>
                                    {entity.category}
                                </span>
                            </div>

                            {/* Properties Grid */}
                            <div style={{ 
                                display: 'grid', 
                                gridTemplateColumns: '1fr 1fr', 
                                gap: '0.75rem',
                                padding: '1rem',
                                background: 'rgba(255, 255, 255, 0.02)',
                                borderRadius: '0.5rem',
                                fontSize: '0.85rem'
                            }}>
                                {Object.entries(entity.properties).slice(0, 4).map(([key, prop]) => {
                                    const value = typeof prop === 'string' ? prop : prop.value;
                                    return (
                                        <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                            <div style={{ 
                                                color: 'var(--text-secondary)', 
                                                fontSize: '0.75rem',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.05em'
                                            }}>
                                                {key}
                                            </div>
                                            <div style={{ 
                                                color: 'white',
                                                fontWeight: 600
                                            }}>
                                                {value || '-'}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div style={{ 
                                marginTop: 'auto', 
                                paddingTop: '1rem', 
                                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                    {Object.keys(entity.properties).length} propriétés
                                </span>
                                <span style={{ 
                                    fontSize: '0.9rem', 
                                    color: 'var(--accent-munin)',
                                    fontWeight: 600
                                }}>
                                    Voir détails →
                                </span>
                            </div>
                        </div>
                    ))}

                    {filteredEntities.length === 0 && (
                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
                            <Search size={48} style={{ marginBottom: '1rem', opacity: 0.3 }} />
                            <p style={{ fontSize: '1.1rem' }}>{t('common.no_results_found')} "{searchTerm}"</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Side Panel */}
            {selectedEntity && (
                <>
                    {/* Overlay */}
                    <div
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'rgba(0, 0, 0, 0.7)',
                            zIndex: 999,
                            opacity: isPanelOpen ? 1 : 0,
                            transition: 'opacity 0.3s',
                            pointerEvents: isPanelOpen ? 'auto' : 'none'
                        }}
                        onClick={closeEntityPanel}
                    />

                    {/* Panel */}
                    <div
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: isPanelOpen ? 0 : '-600px',
                            bottom: 0,
                            width: '600px',
                            background: '#0b1120',
                            zIndex: 1000,
                            transition: 'left 0.3s ease-out',
                            overflowY: 'auto',
                            boxShadow: '4px 0 20px rgba(0, 0, 0, 0.5)',
                            borderRight: '1px solid rgba(255, 255, 255, 0.1)'
                        }}
                    >
                        {/* Header */}
                        <div style={{
                            position: 'sticky',
                            top: 0,
                            background: '#0b1120',
                            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                            padding: '1.5rem',
                            zIndex: 10
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                <div>
                                    <span style={{
                                        fontSize: '0.85rem',
                                        padding: '0.25rem 0.75rem',
                                        background: 'rgba(16, 185, 129, 0.1)',
                                        color: 'var(--accent-munin)',
                                        borderRadius: '1rem',
                                        display: 'inline-block',
                                        marginBottom: '0.75rem'
                                    }}>
                                        {selectedEntity.category}
                                    </span>
                                    <h2 style={{
                                        fontSize: '2rem',
                                        fontWeight: 800,
                                        fontStyle: 'italic',
                                        margin: 0
                                    }}>
                                        {selectedEntity.name}
                                    </h2>
                                </div>
                                <button
                                    onClick={closeEntityPanel}
                                    style={{
                                        background: 'rgba(255, 255, 255, 0.05)',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        borderRadius: '0.5rem',
                                        padding: '0.5rem',
                                        cursor: 'pointer',
                                        color: 'white',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    <ChevronRight size={20} />
                                </button>
                            </div>
                            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.95rem', lineHeight: 1.6, margin: 0 }}>
                                {selectedEntity.overview}
                            </p>
                        </div>

                        {/* Content */}
                        <div style={{ padding: '1.5rem' }}>
                            {/* Taxonomie */}
                            {selectedEntity.taxonomy && (
                                <div style={{ marginBottom: '2rem' }}>
                                    <h3 style={{
                                        fontSize: '1.1rem',
                                        fontWeight: 700,
                                        color: 'var(--accent-munin)',
                                        marginBottom: '1rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem'
                                    }}>
                                        🧬 Classification Taxonomique
                                    </h3>
                                    <div style={{
                                        background: 'rgba(255, 255, 255, 0.02)',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        borderRadius: '0.75rem',
                                        padding: '1rem'
                                    }}>
                                        {Object.entries(selectedEntity.taxonomy).map(([key, value]) => (
                                            <div key={key} style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                padding: '0.5rem 0',
                                                borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
                                            }}>
                                                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>{key}</span>
                                                <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Génomique */}
                            {selectedEntity.genomics && (
                                <div style={{ marginBottom: '2rem' }}>
                                    <h3 style={{
                                        fontSize: '1.1rem',
                                        fontWeight: 700,
                                        color: 'var(--accent-munin)',
                                        marginBottom: '1rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem'
                                    }}>
                                        🔬 Données Génomiques
                                    </h3>
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: '1fr 1fr',
                                        gap: '1rem'
                                    }}>
                                        {Object.entries(selectedEntity.genomics).map(([key, value]) => (
                                            <div key={key} style={{
                                                background: 'rgba(16, 185, 129, 0.05)',
                                                border: '1px solid rgba(16, 185, 129, 0.2)',
                                                borderRadius: '0.5rem',
                                                padding: '1rem',
                                                textAlign: 'center'
                                            }}>
                                                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-munin)', marginBottom: '0.25rem' }}>
                                                    {value}
                                                </div>
                                                <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>
                                                    {key}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Culture */}
                            {selectedEntity.culture && (
                                <div style={{ marginBottom: '2rem' }}>
                                    <h3 style={{
                                        fontSize: '1.1rem',
                                        fontWeight: 700,
                                        color: 'var(--accent-munin)',
                                        marginBottom: '1rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem'
                                    }}>
                                        🧫 Conditions de Culture
                                    </h3>
                                    <div style={{
                                        background: 'rgba(255, 255, 255, 0.02)',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        borderRadius: '0.75rem',
                                        padding: '1rem'
                                    }}>
                                        {Object.entries(selectedEntity.culture).map(([key, value]) => (
                                            <div key={key} style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                padding: '0.5rem 0',
                                                borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
                                            }}>
                                                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>{key}</span>
                                                <span style={{ fontWeight: 600, fontSize: '0.9rem', textAlign: 'right' }}>{value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Pathologie */}
                            {selectedEntity.pathology && (
                                <div style={{ marginBottom: '2rem' }}>
                                    <h3 style={{
                                        fontSize: '1.1rem',
                                        fontWeight: 700,
                                        color: 'var(--accent-munin)',
                                        marginBottom: '1rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem'
                                    }}>
                                        ⚕️ Pathologie et Virulence
                                    </h3>
                                    <div style={{
                                        background: 'rgba(255, 255, 255, 0.02)',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        borderRadius: '0.75rem',
                                        padding: '1rem'
                                    }}>
                                        {Object.entries(selectedEntity.pathology).map(([key, value]) => (
                                            <div key={key} style={{ marginBottom: '1rem' }}>
                                                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                                    {key}
                                                </div>
                                                {Array.isArray(value) ? (
                                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                                        {value.map((item, idx) => (
                                                            <span key={idx} style={{
                                                                padding: '0.25rem 0.75rem',
                                                                background: 'rgba(239, 68, 68, 0.1)',
                                                                color: '#ef4444',
                                                                borderRadius: '1rem',
                                                                fontSize: '0.85rem'
                                                            }}>
                                                                {item}
                                                            </span>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{value}</div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Résistance */}
                            {selectedEntity.resistance && (
                                <div style={{ marginBottom: '2rem' }}>
                                    <h3 style={{
                                        fontSize: '1.1rem',
                                        fontWeight: 700,
                                        color: '#ef4444',
                                        marginBottom: '1rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem'
                                    }}>
                                        🛡️ Résistance aux Antibiotiques
                                    </h3>
                                    <div style={{
                                        background: 'rgba(239, 68, 68, 0.05)',
                                        border: '1px solid rgba(239, 68, 68, 0.2)',
                                        borderRadius: '0.75rem',
                                        padding: '1rem'
                                    }}>
                                        {Object.entries(selectedEntity.resistance).map(([key, value]) => (
                                            <div key={key} style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                padding: '0.5rem 0',
                                                borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
                                            }}>
                                                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>{key}</span>
                                                <span style={{ fontWeight: 600, fontSize: '0.9rem', textAlign: 'right', maxWidth: '60%' }}>{value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* API */}
                            {selectedEntity.api && (
                                <div style={{ marginBottom: '2rem' }}>
                                    <h3 style={{
                                        fontSize: '1.1rem',
                                        fontWeight: 700,
                                        color: 'var(--accent-munin)',
                                        marginBottom: '1rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem'
                                    }}>
                                        🔢 Identification API
                                    </h3>
                                    <div style={{
                                        background: 'rgba(59, 130, 246, 0.05)',
                                        border: '1px solid rgba(59, 130, 246, 0.2)',
                                        borderRadius: '0.75rem',
                                        padding: '1rem'
                                    }}>
                                        {Object.entries(selectedEntity.api).map(([key, value]) => (
                                            <div key={key} style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                padding: '0.5rem 0',
                                                borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
                                            }}>
                                                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>{key}</span>
                                                <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#3b82f6', fontFamily: 'monospace' }}>{value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Discipline;
