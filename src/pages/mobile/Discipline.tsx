import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Search, BookOpen } from 'lucide-react';
import { useState, useEffect } from 'react';
import MobileBottomNav from '../../components/MobileBottomNav';
import '../../styles/mobile-app.css';

const MobileDiscipline = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [discipline, setDiscipline] = useState<any>(null);
  const [entities, setEntities] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadDiscipline = async () => {
      try {
        const disciplinesData = await import('../../data/disciplines.json');
        const disciplines = disciplinesData.default || [];
        const found = disciplines.find((d: any) => d.id === id);
        setDiscipline(found);

        if (found?.entities) {
          setEntities(found.entities);
        }
      } catch (error) {
        console.error('Error loading discipline:', error);
      }
    };
    loadDiscipline();
  }, [id]);

  const filteredEntities = entities.filter(e =>
    e.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!discipline) {
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
      <div className="mobile-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <button
            onClick={() => navigate('/munin')}
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
          <h1 className="mobile-title" style={{ marginBottom: 0 }}>{discipline.name}</h1>
        </div>
        {discipline.description && (
          <p className="mobile-subtitle" style={{ marginBottom: 0 }}>
            {discipline.description}
          </p>
        )}
      </div>

      <div className="mobile-content">
        {/* Search Bar */}
        <div className="mobile-search">
          <Search className="mobile-search-icon" size={20} />
          <input
            type="text"
            placeholder="Rechercher une entité..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Entities List */}
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>
          Entités ({filteredEntities.length})
        </h2>

        {filteredEntities.length === 0 ? (
          <div className="mobile-card" style={{ textAlign: 'center', padding: '2rem' }}>
            <BookOpen size={32} style={{ margin: '0 auto 0.75rem', color: 'var(--mobile-text-secondary)' }} />
            <p style={{ color: 'var(--mobile-text-secondary)' }}>
              Aucune entité trouvée
            </p>
          </div>
        ) : (
          filteredEntities.map((entity) => (
            <div
              key={entity.id}
              className="mobile-list-item"
              onClick={() => navigate(`/munin/${id}/${entity.id}`)}
            >
              <div className="mobile-icon mobile-icon-munin">
                <BookOpen size={24} />
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                  {entity.name}
                </h3>
                {entity.description && (
                  <p style={{ fontSize: '0.85rem', color: 'var(--mobile-text-secondary)' }}>
                    {entity.description}
                  </p>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <MobileBottomNav />
    </div>
  );
};

export default MobileDiscipline;
