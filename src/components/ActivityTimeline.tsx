import { useState, useEffect } from 'react';
import { Clock, CheckCircle, AlertCircle, Info } from 'lucide-react';

interface Activity {
  id: string;
  type: 'success' | 'info' | 'warning';
  title: string;
  description: string;
  timestamp: string;
}

const ActivityTimeline = () => {
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('activityTimeline');
    if (stored) {
      setActivities(JSON.parse(stored));
    } else {
      const defaultActivities: Activity[] = [
        {
          id: '1',
          type: 'success',
          title: 'Connexion réussie',
          description: 'Vous vous êtes connecté avec succès',
          timestamp: new Date().toISOString()
        },
        {
          id: '2',
          type: 'info',
          title: 'Bienvenue',
          description: 'Découvrez les fonctionnalités de la plateforme',
          timestamp: new Date(Date.now() - 3600000).toISOString()
        }
      ];
      setActivities(defaultActivities);
      localStorage.setItem('activityTimeline', JSON.stringify(defaultActivities));
    }
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle size={20} />;
      case 'warning': return <AlertCircle size={20} />;
      default: return <Info size={20} />;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case 'success': return '#10b981';
      case 'warning': return '#f59e0b';
      default: return '#3b82f6';
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'À l\'instant';
    if (minutes < 60) return `Il y a ${minutes}min`;
    if (hours < 24) return `Il y a ${hours}h`;
    return `Il y a ${days}j`;
  };

  if (activities.length === 0) return null;

  return (
    <div style={{ width: '100%', maxWidth: '1200px', marginBottom: '2rem' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        marginBottom: '1.5rem'
      }}>
        <Clock size={20} style={{ color: '#3b82f6' }} />
        <h3 style={{
          fontSize: '1.5rem',
          fontWeight: 700,
          margin: 0,
          color: 'white'
        }}>
          Activité récente
        </h3>
      </div>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        {activities.slice(0, 5).map((activity, index) => (
          <div
            key={activity.id}
            className="glass-panel"
            style={{
              padding: '1.25rem',
              borderRadius: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              borderLeft: `3px solid ${getColor(activity.type)}`,
              animation: `fadeIn 0.3s ease-out ${index * 0.1}s both`
            }}
          >
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: `${getColor(activity.type)}15`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: getColor(activity.type),
              flexShrink: 0
            }}>
              {getIcon(activity.type)}
            </div>
            <div style={{ flex: 1 }}>
              <p style={{
                fontWeight: 600,
                fontSize: '0.95rem',
                marginBottom: '0.25rem'
              }}>
                {activity.title}
              </p>
              <p style={{
                fontSize: '0.85rem',
                color: 'rgba(255,255,255,0.5)',
                margin: 0
              }}>
                {activity.description}
              </p>
            </div>
            <span style={{
              fontSize: '0.75rem',
              color: 'rgba(255,255,255,0.4)',
              whiteSpace: 'nowrap'
            }}>
              {formatTime(activity.timestamp)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityTimeline;
