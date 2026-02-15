import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useState, useEffect } from 'react';
import MobileBottomNav from '../../components/MobileBottomNav';
import '../../styles/mobile-app.css';

const MobileEntityDetail = () => {
  const navigate = useNavigate();
  const { disciplineId, entityId } = useParams();
  const [entity, setEntity] = useState<any>(null);
  const [discipline, setDiscipline] = useState<any>(null);

  useEffect(() => {
    const loadEntity = async () => {
      try {
        const response = await fetch('/data/disciplines.json');
        const disciplines = await response.json();
        const foundDiscipline = disciplines.find((d: any) => d.id === disciplineId);
        setDiscipline(foundDiscipline);

        if (foundDiscipline?.entities) {
          const foundEntity = foundDiscipline.entities.find((e: any) => e.id === entityId);
          setEntity(foundEntity);
        }
      } catch (error) {
        console.error('Error loading entity:', error);
      }
    };
    loadEntity();
  }, [disciplineId, entityId]);

  if (!entity) {
    return (
      <div className="mobile-container">
        <div className="mobile-content">
          <p style={{ textAlign: 'center', color: 'var(--mobile-text-secondary)' }}>
            Chargement...
          </p>
        </div>
        <MobileBottomNav />
      </div>
    );
  }

  return (
    <div className="mobile-container">
      {/* Header */}
      <div className="mobile-header" style={{ position: 'sticky', top: 0, zIndex: 10, background: 'var(--mobile-bg)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <button
            onClick={() => navigate(`/munin/${disciplineId}`)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--mobile-text)',
              padding: '0.5rem',
              cursor: 'pointer'
            }}
          >
            <ArrowLeft size={24} />
          </button>
          <div style={{ flex: 1 }}>
            <span style={{
              fontSize: '0.75rem',
              padding: '0.25rem 0.75rem',
              background: 'rgba(16, 185, 129, 0.1)',
              color: 'var(--mobile-munin)',
              borderRadius: '1rem',
              display: 'inline-block',
              marginBottom: '0.5rem'
            }}>
              {entity.category}
            </span>
            <h1 className="mobile-title" style={{ marginBottom: 0, fontStyle: 'italic' }}>
              {entity.name}
            </h1>
          </div>
        </div>
        {entity.overview && (
          <p className="mobile-subtitle" style={{ marginBottom: 0, lineHeight: 1.5 }}>
            {entity.overview}
          </p>
        )}
      </div>

      <div className="mobile-content">
        {/* Classification Taxonomique */}
        {entity.taxonomy && (
          <div className="mobile-card" style={{ marginBottom: '1rem' }}>
            <h2 style={{
              fontSize: '1.1rem',
              fontWeight: 700,
              color: 'var(--mobile-munin)',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              🧬 Classification Taxonomique
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {Object.entries(entity.taxonomy).map(([key, value]) => (
                <div key={key} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '0.75rem',
                  background: 'rgba(255, 255, 255, 0.02)',
                  borderRadius: '0.5rem'
                }}>
                  <span style={{ color: 'var(--mobile-text-secondary)', fontSize: '0.85rem' }}>{key}</span>
                  <span style={{ fontWeight: 600, fontSize: '0.85rem', textAlign: 'right' }}>{String(value)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Données Génomiques */}
        {entity.genomics && (
          <div className="mobile-card" style={{ marginBottom: '1rem' }}>
            <h2 style={{
              fontSize: '1.1rem',
              fontWeight: 700,
              color: 'var(--mobile-munin)',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              🔬 Données Génomiques
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '0.75rem'
            }}>
              {Object.entries(entity.genomics).map(([key, value]) => (
                <div key={key} style={{
                  background: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  borderRadius: '0.75rem',
                  padding: '1rem',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--mobile-munin)', marginBottom: '0.25rem' }}>
                    {String(value)}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--mobile-text-secondary)' }}>
                    {key}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Conditions de Culture */}
        {entity.culture && (
          <div className="mobile-card" style={{ marginBottom: '1rem' }}>
            <h2 style={{
              fontSize: '1.1rem',
              fontWeight: 700,
              color: 'var(--mobile-munin)',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              🧫 Conditions de Culture
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {Object.entries(entity.culture).map(([key, value]) => (
                <div key={key} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '0.75rem',
                  background: 'rgba(255, 255, 255, 0.02)',
                  borderRadius: '0.5rem'
                }}>
                  <span style={{ color: 'var(--mobile-text-secondary)', fontSize: '0.85rem' }}>{key}</span>
                  <span style={{ fontWeight: 600, fontSize: '0.85rem', textAlign: 'right' }}>{String(value)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pathologie et Virulence */}
        {entity.pathology && (
          <div className="mobile-card" style={{ marginBottom: '1rem' }}>
            <h2 style={{
              fontSize: '1.1rem',
              fontWeight: 700,
              color: 'var(--mobile-munin)',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              ⚕️ Pathologie et Virulence
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {Object.entries(entity.pathology).map(([key, value]) => (
                <div key={key}>
                  <div style={{ color: 'var(--mobile-text-secondary)', fontSize: '0.75rem', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
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
                          fontSize: '0.8rem'
                        }}>
                          {item}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{String(value)}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Résistance aux Antibiotiques */}
        {entity.resistance && (
          <div className="mobile-card" style={{ marginBottom: '1rem', background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
            <h2 style={{
              fontSize: '1.1rem',
              fontWeight: 700,
              color: '#ef4444',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              🛡️ Résistance aux Antibiotiques
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {Object.entries(entity.resistance).map(([key, value]) => (
                <div key={key} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '0.75rem',
                  background: 'rgba(0, 0, 0, 0.2)',
                  borderRadius: '0.5rem'
                }}>
                  <span style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.85rem' }}>{key}</span>
                  <span style={{ fontWeight: 600, fontSize: '0.85rem', textAlign: 'right', maxWidth: '60%' }}>{String(value)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Identification API */}
        {entity.api && (
          <div className="mobile-card" style={{ marginBottom: '1rem' }}>
            <h2 style={{
              fontSize: '1.1rem',
              fontWeight: 700,
              color: 'var(--mobile-munin)',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              🔢 Identification API
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {Object.entries(entity.api).map(([key, value]) => (
                <div key={key} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '0.75rem',
                  background: 'rgba(59, 130, 246, 0.1)',
                  borderRadius: '0.5rem'
                }}>
                  <span style={{ color: 'var(--mobile-text-secondary)', fontSize: '0.85rem' }}>{key}</span>
                  <span style={{ fontWeight: 600, fontSize: '0.85rem', color: '#3b82f6', fontFamily: 'monospace' }}>{String(value)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Toutes les propriétés */}
        {entity.properties && Object.keys(entity.properties).length > 0 && (
          <div className="mobile-card" style={{ marginBottom: '1rem' }}>
            <h2 style={{
              fontSize: '1.1rem',
              fontWeight: 700,
              color: 'var(--mobile-munin)',
              marginBottom: '1rem'
            }}>
              📋 Propriétés
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {Object.entries(entity.properties).map(([key, prop]) => {
                const value = typeof prop === 'string' ? prop : (prop as any).value;
                return (
                  <div key={key} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '0.75rem',
                    background: 'rgba(255, 255, 255, 0.02)',
                    borderRadius: '0.5rem'
                  }}>
                    <span style={{ color: 'var(--mobile-text-secondary)', fontSize: '0.85rem' }}>{key}</span>
                    <span style={{ fontWeight: 600, fontSize: '0.85rem', textAlign: 'right' }}>{value || '-'}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <MobileBottomNav />
    </div>
  );
};

export default MobileEntityDetail;
