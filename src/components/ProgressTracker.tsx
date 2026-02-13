import { useState, useEffect } from 'react';
import { TrendingUp, Target, Award } from 'lucide-react';

interface Progress {
  analyses: number;
  documents: number;
  projects: number;
}

const ProgressTracker = () => {
  const [progress, setProgress] = useState<Progress>({
    analyses: 0,
    documents: 0,
    projects: 0
  });

  useEffect(() => {
    const stored = localStorage.getItem('progressTracker');
    if (stored) {
      setProgress(JSON.parse(stored));
    } else {
      // Valeurs par défaut
      const defaultProgress = {
        analyses: Math.floor(Math.random() * 50) + 10,
        documents: Math.floor(Math.random() * 100) + 20,
        projects: Math.floor(Math.random() * 10) + 2
      };
      setProgress(defaultProgress);
      localStorage.setItem('progressTracker', JSON.stringify(defaultProgress));
    }
  }, []);

  const goals = {
    analyses: 100,
    documents: 200,
    projects: 15
  };

  const getPercentage = (current: number, goal: number) => {
    return Math.min((current / goal) * 100, 100);
  };

  const items = [
    {
      icon: <TrendingUp size={24} />,
      label: 'Analyses complétées',
      current: progress.analyses,
      goal: goals.analyses,
      color: '#6366f1'
    },
    {
      icon: <Target size={24} />,
      label: 'Documents traités',
      current: progress.documents,
      goal: goals.documents,
      color: '#10b981'
    },
    {
      icon: <Award size={24} />,
      label: 'Projets actifs',
      current: progress.projects,
      goal: goals.projects,
      color: '#f59e0b'
    }
  ];

  return (
    <div style={{ width: '100%', maxWidth: '1200px', marginBottom: '2rem' }}>
      <h3 style={{
        fontSize: '1.5rem',
        fontWeight: 700,
        marginBottom: '1.5rem',
        color: 'white'
      }}>
        Progression
      </h3>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1rem'
      }}>
        {items.map((item, i) => {
          const percentage = getPercentage(item.current, item.goal);
          return (
            <div
              key={i}
              className="glass-panel"
              style={{
                padding: '1.5rem',
                borderRadius: '1rem',
                borderLeft: `3px solid ${item.color}`
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: `${item.color}15`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: item.color
                }}>
                  {item.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', margin: 0 }}>
                    {item.label}
                  </p>
                  <p style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>
                    {item.current} / {item.goal}
                  </p>
                </div>
              </div>
              <div style={{
                width: '100%',
                height: '8px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '1rem',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${percentage}%`,
                  height: '100%',
                  background: `linear-gradient(90deg, ${item.color}, ${item.color}dd)`,
                  borderRadius: '1rem',
                  transition: 'width 0.5s ease'
                }} />
              </div>
              <p style={{
                fontSize: '0.75rem',
                color: 'rgba(255,255,255,0.4)',
                marginTop: '0.5rem',
                textAlign: 'right'
              }}>
                {percentage.toFixed(0)}% complété
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressTracker;
