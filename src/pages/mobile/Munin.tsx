import { useNavigate } from 'react-router-dom';
import { Search, BookOpen, ArrowLeft } from 'lucide-react';
import { useState, useEffect } from 'react';
import MobileBottomNav from '../../components/MobileBottomNav';
import '../../styles/mobile-app.css';

const MobileMunin = () => {
  const navigate = useNavigate();
  const [disciplines, setDisciplines] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadDisciplines = async () => {
      try {
        const data = await import('../../data/disciplines.json');
        setDisciplines(data.default || []);
      } catch (error) {
        console.error('Error loading disciplines:', error);
      }
    };
    loadDisciplines();
  }, []);

  const filteredDisciplines = disciplines.filter(d =>
    d.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="mobile-container">
      <div className="mobile-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <button
            onClick={() => navigate('/home')}
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
          <h1 className="mobile-title" style={{ marginBottom: 0 }}>Munin</h1>
        </div>
        <p className="mobile-subtitle" style={{ marginBottom: 0 }}>
          Base de connaissances scientifiques
        </p>
      </div>

      <div className="mobile-content">
        {/* Search Bar */}
        <div className="mobile-search">
          <Search className="mobile-search-icon" size={20} />
          <input
            type="text"
            placeholder="Rechercher une discipline..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Disciplines List */}
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>
          Disciplines ({filteredDisciplines.length})
        </h2>

        {filteredDisciplines.map((discipline) => (
          <div
            key={discipline.id}
            className="mobile-list-item"
            onClick={() => navigate(`/munin/${discipline.id}`)}
          >
            <div className="mobile-icon mobile-icon-munin">
              <BookOpen size={24} />
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                {discipline.name}
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--mobile-text-secondary)' }}>
                {discipline.description || 'Discipline scientifique'}
              </p>
            </div>
          </div>
        ))}

        {filteredDisciplines.length === 0 && (
          <div className="mobile-card" style={{ textAlign: 'center', padding: '2rem' }}>
            <p style={{ color: 'var(--mobile-text-secondary)' }}>
              Aucune discipline trouvée
            </p>
          </div>
        )}
      </div>

      <MobileBottomNav />
    </div>
  );
};

export default MobileMunin;
