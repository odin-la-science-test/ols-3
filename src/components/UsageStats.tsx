import { useState, useEffect } from 'react';
import { TrendingUp, Activity, Clock, Zap } from 'lucide-react';

interface UsageData {
  totalVisits: number;
  lastVisit: string;
  favoriteModule: string;
  timeSpent: number; // en minutes
  streak: number; // jours consécutifs
}

const UsageStats = () => {
  const [stats, setStats] = useState<UsageData>({
    totalVisits: 0,
    lastVisit: new Date().toISOString(),
    favoriteModule: 'Hugin',
    timeSpent: 0,
    streak: 1
  });

  useEffect(() => {
    // Charger les stats
    const stored = localStorage.getItem('usageStats');
    if (stored) {
      const data = JSON.parse(stored);
      setStats(data);
    }

    // Incrémenter les visites
    const today = new Date().toISOString().split('T')[0];
    const lastVisitDate = stored ? JSON.parse(stored).lastVisit.split('T')[0] : null;
    
    if (lastVisitDate !== today) {
      const newStats = {
        ...stats,
        totalVisits: stats.totalVisits + 1,
        lastVisit: new Date().toISOString(),
        streak: lastVisitDate === new Date(Date.now() - 86400000).toISOString().split('T')[0] 
          ? stats.streak + 1 
          : 1
      };
      setStats(newStats);
      localStorage.setItem('usageStats', JSON.stringify(newStats));
    }

    // Tracker le temps passé
    const startTime = Date.now();
    return () => {
      const timeSpent = Math.floor((Date.now() - startTime) / 60000);
      if (timeSpent > 0) {
        const updated = {
          ...stats,
          timeSpent: stats.timeSpent + timeSpent
        };
        localStorage.setItem('usageStats', JSON.stringify(updated));
      }
    };
  }, []);

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}min`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h${minutes % 60}min`;
  };

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '1rem',
      width: '100%'
    }}>
      <div className="glass-panel" style={{
        padding: '1.5rem',
        borderRadius: '1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem'
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          background: 'rgba(99, 102, 241, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#6366f1'
        }}>
          <Activity size={24} />
        </div>
        <div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
            Visites totales
          </p>
          <p style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            {stats.totalVisits}
          </p>
        </div>
      </div>

      <div className="glass-panel" style={{
        padding: '1.5rem',
        borderRadius: '1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem'
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          background: 'rgba(16, 185, 129, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#10b981'
        }}>
          <Zap size={24} />
        </div>
        <div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
            Série de jours
          </p>
          <p style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            {stats.streak} 🔥
          </p>
        </div>
      </div>

      <div className="glass-panel" style={{
        padding: '1.5rem',
        borderRadius: '1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem'
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          background: 'rgba(245, 158, 11, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#f59e0b'
        }}>
          <Clock size={24} />
        </div>
        <div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
            Temps total
          </p>
          <p style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            {formatTime(stats.timeSpent)}
          </p>
        </div>
      </div>

      <div className="glass-panel" style={{
        padding: '1.5rem',
        borderRadius: '1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem'
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          background: 'rgba(139, 92, 246, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#8b5cf6'
        }}>
          <TrendingUp size={24} />
        </div>
        <div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
            Module favori
          </p>
          <p style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            {stats.favoriteModule}
          </p>
        </div>
      </div>
    </div>
  );
};

export default UsageStats;
