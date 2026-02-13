import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Clock, BookOpen, FlaskConical, TrendingUp } from 'lucide-react';
import { useDeviceDetection } from '../hooks/useDeviceDetection';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  path: string;
  type: 'page' | 'module' | 'discipline' | 'recent';
  icon: any;
}

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

const GlobalSearch = ({ isOpen, onClose }: GlobalSearchProps) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { isMobile } = useDeviceDetection();

  // Données de recherche
  const searchData: SearchResult[] = [
    { id: '1', title: 'Munin', description: 'Base de connaissances scientifiques', path: '/munin', type: 'page', icon: BookOpen },
    { id: '2', title: 'Hugin', description: 'Outils de laboratoire', path: '/hugin', type: 'page', icon: FlaskConical },
    { id: '3', title: 'Messagerie', description: 'Messages et communications', path: '/hugin/messaging', type: 'module', icon: FlaskConical },
    { id: '4', title: 'Planning', description: 'Gestion du temps', path: '/hugin/planning', type: 'module', icon: FlaskConical },
    { id: '5', title: 'Documents', description: 'Fichiers et archives', path: '/hugin/documents', type: 'module', icon: FlaskConical },
    { id: '6', title: 'Inventaire', description: 'Gestion des stocks', path: '/hugin/inventory', type: 'module', icon: FlaskConical },
    { id: '7', title: 'Statistiques', description: 'Analyses statistiques', path: '/hugin/statistics', type: 'module', icon: TrendingUp },
    { id: '8', title: 'BioAnalyzer', description: 'Analyse biologique', path: '/hugin/bioanalyzer', type: 'module', icon: FlaskConical },
    { id: '9', title: 'Compte', description: 'Paramètres du compte', path: '/account', type: 'page', icon: BookOpen },
    { id: '10', title: 'Paramètres', description: 'Configuration', path: '/settings', type: 'page', icon: BookOpen }
  ];

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const stored = localStorage.getItem('recentSearches');
    if (stored) {
      setRecentSearches(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    if (query.trim()) {
      const filtered = searchData.filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
    } else {
      setResults([]);
    }
  }, [query]);

  const handleSelect = (result: SearchResult) => {
    // Sauvegarder dans l'historique
    const updated = [result.title, ...recentSearches.filter(s => s !== result.title)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
    
    navigate(result.path);
    onClose();
    setQuery('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(4px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: isMobile ? 'flex-start' : 'center',
        justifyContent: 'center',
        padding: isMobile ? '0' : '2rem',
        animation: 'fadeIn 0.2s ease-out'
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: isMobile ? '100%' : '600px',
          maxHeight: isMobile ? '100vh' : '80vh',
          background: 'var(--bg-secondary)',
          borderRadius: isMobile ? '0' : '1rem',
          border: isMobile ? 'none' : '1px solid var(--border-color)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <div style={{
          padding: '1.5rem',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <Search size={20} style={{ color: 'var(--text-secondary)' }} />
          <input
            ref={inputRef}
            type="text"
            placeholder="Rechercher..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--text-primary)',
              fontSize: '1.1rem',
              fontWeight: 500
            }}
          />
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              padding: '0.5rem',
              borderRadius: '0.5rem',
              transition: 'all 0.2s'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Results */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '1rem'
        }}>
          {query.trim() === '' && recentSearches.length > 0 && (
            <>
              <p style={{
                fontSize: '0.85rem',
                color: 'var(--text-secondary)',
                marginBottom: '0.75rem',
                paddingLeft: '0.5rem',
                fontWeight: 600
              }}>
                Recherches récentes
              </p>
              {recentSearches.map((search, index) => (
                <div
                  key={index}
                  onClick={() => setQuery(search)}
                  style={{
                    padding: '0.75rem 1rem',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    transition: 'all 0.2s',
                    marginBottom: '0.5rem'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-tertiary)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <Clock size={16} style={{ color: 'var(--text-secondary)' }} />
                  <span style={{ fontSize: '0.95rem' }}>{search}</span>
                </div>
              ))}
            </>
          )}

          {results.length > 0 && (
            <>
              <p style={{
                fontSize: '0.85rem',
                color: 'var(--text-secondary)',
                marginBottom: '0.75rem',
                paddingLeft: '0.5rem',
                fontWeight: 600
              }}>
                Résultats ({results.length})
              </p>
              {results.map((result) => {
                const Icon = result.icon;
                return (
                  <div
                    key={result.id}
                    onClick={() => handleSelect(result)}
                    style={{
                      padding: '1rem',
                      borderRadius: '0.75rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      transition: 'all 0.2s',
                      marginBottom: '0.5rem',
                      border: '1px solid transparent'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'var(--bg-tertiary)';
                      e.currentTarget.style.borderColor = 'var(--accent-primary)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.borderColor = 'transparent';
                    }}
                  >
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      background: 'rgba(99, 102, 241, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--accent-primary)',
                      flexShrink: 0
                    }}>
                      <Icon size={20} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: 600, marginBottom: '0.25rem' }}>
                        {result.title}
                      </p>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        {result.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </>
          )}

          {query.trim() !== '' && results.length === 0 && (
            <div style={{
              textAlign: 'center',
              padding: '3rem 1rem',
              color: 'var(--text-secondary)'
            }}>
              <Search size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
              <p>Aucun résultat trouvé pour "{query}"</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '1rem 1.5rem',
          borderTop: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          fontSize: '0.85rem',
          color: 'var(--text-secondary)'
        }}>
          <kbd style={{
            padding: '0.25rem 0.5rem',
            background: 'var(--bg-tertiary)',
            borderRadius: '0.25rem',
            border: '1px solid var(--border-color)',
            fontSize: '0.75rem'
          }}>ESC</kbd>
          <span>pour fermer</span>
        </div>
      </div>
    </div>
  );
};

export default GlobalSearch;
