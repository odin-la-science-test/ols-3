import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Info, Layers, ExternalLink } from 'lucide-react';
import disciplinesData from '../data/disciplines.json';

const MobileEntityDetail = () => {
    const { disciplineId, entityId } = useParams();
    const navigate = useNavigate();
    const [entity, setEntity] = useState<any>(null);
    const [discipline, setDiscipline] = useState<any>(null);

    useEffect(() => {
        const disc = disciplinesData.disciplines.find((d: any) => d.id === disciplineId);
        setDiscipline(disc);
        
        if (disc) {
            const ent = disc.entities?.find((e: any) => e.id === entityId);
            setEntity(ent);
        }
    }, [disciplineId, entityId]);

    if (!entity || !discipline) {
        return (
            <div className="app-viewport">
                <div style={{ padding: '2rem', textAlign: 'center' }}>
                    <p>Entité non trouvée</p>
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
                        onClick={() => navigate(`/munin/${disciplineId}`)}
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
                            {discipline.name}
                        </div>
                        <h1 style={{ fontSize: '1.5rem', margin: 0 }}>{entity.name}</h1>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="app-scrollbox" style={{ padding: '1rem' }}>
                {/* Description */}
                {entity.description && (
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
                            {entity.description}
                        </p>
                    </div>
                )}

                {/* Properties */}
                {entity.properties && entity.properties.length > 0 && (
                    <div style={{
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '12px',
                        padding: '1rem',
                        marginBottom: '1rem'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                            <Layers size={18} color="#3b82f6" />
                            <h3 style={{ margin: 0, fontSize: '1rem' }}>Propriétés</h3>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {entity.properties.map((prop: any, idx: number) => (
                                <div
                                    key={idx}
                                    style={{
                                        background: 'var(--bg-primary)',
                                        border: '1px solid var(--border-color)',
                                        borderRadius: '8px',
                                        padding: '0.75rem'
                                    }}
                                >
                                    <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>
                                        {prop.name}
                                    </div>
                                    <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                        {prop.value}
                                    </div>
                                    {prop.unit && (
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                                            Unité: {prop.unit}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Related Links */}
                {entity.relatedLinks && entity.relatedLinks.length > 0 && (
                    <div style={{
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '12px',
                        padding: '1rem'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                            <ExternalLink size={18} color="#3b82f6" />
                            <h3 style={{ margin: 0, fontSize: '1rem' }}>Liens Externes</h3>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {entity.relatedLinks.map((link: any, idx: number) => (
                                <a
                                    key={idx}
                                    href={link.url}
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
                                    <span>{link.title}</span>
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

export default MobileEntityDetail;
