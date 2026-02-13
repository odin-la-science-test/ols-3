import { useNavigate } from 'react-router-dom';
import { Star, Trash2, ExternalLink } from 'lucide-react';
import { getFavorites, removeFavorite, type Favorite } from '../utils/favorites';
import { useState, useEffect } from 'react';

const FavoritesPanel = () => {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    setFavorites(getFavorites());
    
    // Écouter les changements de favoris
    const handleStorage = () => {
      setFavorites(getFavorites());
    };
    
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const handleRemove = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    removeFavorite(id);
    setFavorites(getFavorites());
  };

  if (favorites.length === 0) {
    return null;
  }

  return (
    <div style={{ width: '100%' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        marginBottom: '1.5rem'
      }}>
        <Star size={20} style={{ color: '#f59e0b' }} fill="#f59e0b" />
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: 700,
          margin: 0,
          color: 'var(--text-primary)'
        }}>
          Favoris
        </h2>
        <span style={{
          padding: '0.25rem 0.75rem',
          borderRadius: '1rem',
          background: 'rgba(245, 158, 11, 0.1)',
          color: '#f59e0b',
          fontSize: '0.85rem',
          fontWeight: 600
        }}>
          {favorites.length}
        </span>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '1rem'
      }}>
        {favorites.map((fav) => (
          <div
            key={fav.id}
            onClick={() => navigate(fav.path)}
            className="glass-panel"
            style={{
              padding: '1.25rem',
              borderRadius: '1rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              transition: 'all 0.3s',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'rgba(245, 158, 11, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#f59e0b',
              flexShrink: 0
            }}>
              <Star size={20} fill="#f59e0b" />
            </div>
            
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{
                fontWeight: 600,
                marginBottom: '0.25rem',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {fav.title}
              </p>
              <p style={{
                fontSize: '0.85rem',
                color: 'var(--text-secondary)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {fav.path}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(fav.path);
                }}
                style={{
                  background: 'rgba(99, 102, 241, 0.1)',
                  border: 'none',
                  borderRadius: '0.5rem',
                  padding: '0.5rem',
                  cursor: 'pointer',
                  color: '#6366f1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                title="Ouvrir"
              >
                <ExternalLink size={16} />
              </button>
              
              <button
                onClick={(e) => handleRemove(fav.id, e)}
                style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: 'none',
                  borderRadius: '0.5rem',
                  padding: '0.5rem',
                  cursor: 'pointer',
                  color: '#ef4444',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                title="Retirer des favoris"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FavoritesPanel;
