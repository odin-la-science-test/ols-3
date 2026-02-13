import { useState } from 'react';
import { Palette, Check } from 'lucide-react';
import { useDeviceDetection } from '../hooks/useDeviceDetection';

interface ThemeOption {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  accent: string;
}

const ThemeSelector = () => {
  const { isMobile } = useDeviceDetection();
  const themes: ThemeOption[] = [
    { id: 'default', name: 'Défaut', primary: '#6366f1', secondary: '#8b5cf6', accent: '#10b981' },
    { id: 'ocean', name: 'Océan', primary: '#0ea5e9', secondary: '#06b6d4', accent: '#14b8a6' },
    { id: 'sunset', name: 'Coucher de soleil', primary: '#f59e0b', secondary: '#f97316', accent: '#ef4444' },
    { id: 'forest', name: 'Forêt', primary: '#10b981', secondary: '#059669', accent: '#84cc16' },
    { id: 'purple', name: 'Violet', primary: '#8b5cf6', secondary: '#a855f7', accent: '#ec4899' },
    { id: 'monochrome', name: 'Monochrome', primary: '#64748b', secondary: '#475569', accent: '#94a3b8' }
  ];

  const [selectedTheme, setSelectedTheme] = useState(() => {
    return localStorage.getItem('selectedTheme') || 'default';
  });
  const [isOpen, setIsOpen] = useState(false);

  const applyTheme = (theme: ThemeOption) => {
    setSelectedTheme(theme.id);
    localStorage.setItem('selectedTheme', theme.id);
    
    document.documentElement.style.setProperty('--accent-primary', theme.primary);
    document.documentElement.style.setProperty('--accent-secondary', theme.secondary);
    document.documentElement.style.setProperty('--accent-munin', theme.accent);
    
    setIsOpen(false);
  };

  if (isMobile) return null;

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        title="Changer le thème"
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '5rem',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
          border: 'none',
          color: 'white',
          cursor: 'pointer',
          boxShadow: '0 8px 24px rgba(139, 92, 246, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 998,
          transition: 'all 0.3s'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        <Palette size={24} />
      </button>
    );
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '2rem',
        right: '5rem',
        width: '320px',
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-color)',
        borderRadius: '1rem',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
        zIndex: 998,
        padding: '1.5rem',
        animation: 'slideUp 0.3s ease-out'
      }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Palette size={20} style={{ color: '#8b5cf6' }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Thèmes</h3>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            fontSize: '1.5rem',
            lineHeight: 1
          }}
        >
          ×
        </button>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '0.75rem'
      }}>
        {themes.map((theme) => (
          <div
            key={theme.id}
            onClick={() => applyTheme(theme)}
            style={{
              padding: '1rem',
              borderRadius: '0.75rem',
              background: 'var(--bg-tertiary)',
              border: selectedTheme === theme.id ? `2px solid ${theme.primary}` : '2px solid transparent',
              cursor: 'pointer',
              transition: 'all 0.2s',
              position: 'relative'
            }}
          >
            {selectedTheme === theme.id && (
              <div style={{
                position: 'absolute',
                top: '0.5rem',
                right: '0.5rem',
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                background: theme.primary,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white'
              }}>
                <Check size={12} />
              </div>
            )}
            <div style={{
              display: 'flex',
              gap: '0.25rem',
              marginBottom: '0.5rem'
            }}>
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '6px',
                background: theme.primary
              }} />
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '6px',
                background: theme.secondary
              }} />
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '6px',
                background: theme.accent
              }} />
            </div>
            <p style={{
              fontSize: '0.85rem',
              fontWeight: 600,
              margin: 0,
              color: 'var(--text-primary)'
            }}>
              {theme.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ThemeSelector;
