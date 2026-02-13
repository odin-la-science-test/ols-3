import { useVersion } from '../hooks/useVersion';
import { refreshCache } from '../utils/cacheRefresh';
import { RefreshCw } from 'lucide-react';

interface VersionBadgeProps {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  className?: string;
}

export default function VersionBadge({ 
  position = 'bottom-right',
  className = '' 
}: VersionBadgeProps) {
  const { version, gitHash, isLoading, error, environment } = useVersion();

  const handleClick = async () => {
    await refreshCache({
      showConfirmation: true,
      confirmationMessage: '🔄 Vider le cache et recharger la page ?\n\nCela garantira que vous voyez la dernière version.'
    });
  };

  // Déterminer la position
  const positionStyles: Record<string, React.CSSProperties> = {
    'top-left': { top: '10px', left: '10px' },
    'top-right': { top: '10px', right: '10px' },
    'bottom-left': { bottom: '80px', left: '10px' },
    'bottom-right': { bottom: '80px', right: '10px' }
  };

  const displayVersion = environment === 'development' 
    ? 'DEV' 
    : gitHash 
      ? `v${version.split('.').slice(0, 3).join('.')}-${gitHash}` 
      : `v${version}`;

  return (
    <button
      onClick={handleClick}
      className={`version-badge ${className}`}
      style={{
        position: 'fixed',
        ...positionStyles[position],
        zIndex: 999,
        padding: '6px 12px',
        background: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(10px)',
        color: 'white',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '20px',
        fontSize: '11px',
        fontWeight: 600,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        transition: 'all 0.2s ease',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
        userSelect: 'none',
        WebkitTapHighlightColor: 'transparent'
      }}
      title="Cliquer pour vider le cache et recharger"
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(0, 0, 0, 0.85)';
        e.currentTarget.style.transform = 'scale(1.05)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'rgba(0, 0, 0, 0.7)';
        e.currentTarget.style.transform = 'scale(1)';
      }}
    >
      {isLoading ? (
        <>
          <div style={{
            width: '10px',
            height: '10px',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            borderTop: '2px solid white',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          <span>...</span>
        </>
      ) : error ? (
        <>
          <span style={{ color: '#ff6b6b' }}>⚠</span>
          <span>Unknown</span>
        </>
      ) : (
        <>
          <RefreshCw size={12} />
          <span>{displayVersion}</span>
        </>
      )}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        @media (max-width: 767px) {
          .version-badge {
            font-size: 10px !important;
            padding: 5px 10px !important;
          }
        }
      `}</style>
    </button>
  );
}
