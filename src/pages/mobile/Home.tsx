import { useNavigate } from 'react-router-dom';
import { BookOpen, FlaskConical, Clock, Mail, Calendar, Target, Zap, TrendingUp, FileText, Search, StickyNote } from 'lucide-react';
import { useState, useEffect } from 'react';
import MobileBottomNav from '../../components/MobileBottomNav';
import OfflineIndicator from '../../components/OfflineIndicator';
import GlobalSearch from '../../components/GlobalSearch';
import QuickNotes from '../../components/QuickNotes';
import '../../styles/mobile-app.css';

const MobileHome = () => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [unreadCount, setUnreadCount] = useState(0);
  const [todayEvents, setTodayEvents] = useState<any[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotesOpen, setIsNotesOpen] = useState(false);

  const username = localStorage.getItem('currentUser')?.split('@')[0] || 'User';

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const loadUnreadMessages = async () => {
      try {
        const { fetchModuleData } = await import('../../utils/persistence');
        const messages = await fetchModuleData('messaging');
        if (messages && Array.isArray(messages)) {
          const unread = messages.filter((msg: any) => 
            msg.folder === 'inbox' && msg.read === false
          ).length;
          setUnreadCount(unread);
        }
      } catch (error) {
        console.error('Error loading messages:', error);
        setUnreadCount(0);
      }
    };

    loadUnreadMessages();
    const interval = setInterval(loadUnreadMessages, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const loadTodayEvents = async () => {
      try {
        const { fetchModuleData} = await import('../../utils/persistence');
        const events = await fetchModuleData('planning');
        if (events && Array.isArray(events)) {
          const today = new Date().toISOString().split('T')[0];
          const todayEventsFiltered = events
            .filter((event: any) => event.date === today)
            .sort((a: any, b: any) => a.time.localeCompare(b.time))
            .slice(0, 3);
          setTodayEvents(todayEventsFiltered);
        }
      } catch (error) {
        console.error('Error loading events:', error);
      }
    };

    loadTodayEvents();
    const interval = setInterval(loadTodayEvents, 30000);
    return () => clearInterval(interval);
  }, []);

  const getEventStatus = (eventTime: string) => {
    const now = new Date();
    const [hours, minutes] = eventTime.split(':').map(Number);
    const eventDate = new Date();
    eventDate.setHours(hours, minutes, 0, 0);
    
    const eventEndDate = new Date(eventDate);
    eventEndDate.setHours(eventEndDate.getHours() + 1);
    
    if (now > eventEndDate) return 'completed';
    if (now >= eventDate && now <= eventEndDate) return 'in-progress';
    return 'upcoming';
  };

  const getEventIcon = (title: string) => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('réunion') || lowerTitle.includes('meeting')) return <Clock size={18} />;
    if (lowerTitle.includes('analyse') || lowerTitle.includes('test') || lowerTitle.includes('pcr')) return <FlaskConical size={18} />;
    if (lowerTitle.includes('rapport') || lowerTitle.includes('rédaction') || lowerTitle.includes('document')) return <BookOpen size={18} />;
    return <Target size={18} />;
  };

  const quickActions = [
    { icon: Zap, label: 'Analyses', path: '/hugin/biotools', color: '#f59e0b' },
    { icon: FileText, label: 'Documents', path: '/hugin/documents', color: '#3b82f6' },
    { icon: TrendingUp, label: 'Statistiques', path: '/hugin/statistics', color: '#8b5cf6' }
  ];

  return (
    <div className="mobile-container">
      <OfflineIndicator />
      <GlobalSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <QuickNotes isOpen={isNotesOpen} onClose={() => setIsNotesOpen(false)} />
      
      <div className="mobile-header">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontSize: '0.9rem', color: 'var(--mobile-text-secondary)', marginBottom: '0.25rem' }}>
              Bienvenue,
            </p>
            <h1 className="mobile-title" style={{ marginBottom: 0 }}>{username}</h1>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => setIsNotesOpen(true)}
              style={{
                background: 'rgba(245, 158, 11, 0.1)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                borderRadius: '0.75rem',
                padding: '0.75rem',
                cursor: 'pointer',
                color: '#f59e0b'
              }}
            >
              <StickyNote size={20} />
            </button>
            <button
              onClick={() => setIsSearchOpen(true)}
              style={{
                background: 'rgba(99, 102, 241, 0.1)',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                borderRadius: '0.75rem',
                padding: '0.75rem',
                cursor: 'pointer',
                color: 'var(--mobile-primary)'
              }}
            >
              <Search size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="mobile-content">
        {/* Quick Stats */}
        <div className="mobile-grid" style={{ marginBottom: '1.5rem' }}>
          <div className="mobile-card" onClick={() => navigate('/hugin/messaging')} style={{ textAlign: 'center' }}>
            <div className="mobile-icon mobile-icon-primary" style={{ margin: '0 auto 0.75rem' }}>
              <Mail size={24} />
            </div>
            <div className="mobile-stat-value" style={{ color: 'var(--mobile-primary)' }}>
              {unreadCount}
            </div>
            <div className="mobile-stat-label">Messages</div>
          </div>

          <div className="mobile-card" style={{ textAlign: 'center' }}>
            <div className="mobile-icon mobile-icon-primary" style={{ margin: '0 auto 0.75rem' }}>
              <Clock size={24} />
            </div>
            <div className="mobile-stat-value" style={{ color: 'var(--mobile-primary)', fontSize: '1.5rem' }}>
              {currentTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
            </div>
            <div className="mobile-stat-label">Heure</div>
          </div>
        </div>

        {/* Emploi du temps */}
        {todayEvents.length > 0 && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>
                Aujourd'hui
              </h2>
              <button
                onClick={() => navigate('/hugin/planning')}
                style={{
                  background: 'rgba(99, 102, 241, 0.1)',
                  border: '1px solid rgba(99, 102, 241, 0.3)',
                  borderRadius: '0.5rem',
                  color: 'var(--mobile-primary)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  padding: '0.5rem 1rem',
                  cursor: 'pointer'
                }}
              >
                Voir tout →
              </button>
            </div>

            {todayEvents.map((event, index) => {
              const status = getEventStatus(event.time);
              const statusColors = {
                completed: { bg: 'rgba(16, 185, 129, 0.1)', color: '#10b981', text: '✓' },
                'in-progress': { bg: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', text: '⏳' },
                upcoming: { bg: 'rgba(100, 116, 139, 0.1)', color: '#64748b', text: '⏰' }
              };
              const statusStyle = statusColors[status];

              return (
                <div
                  key={index}
                  className="mobile-card"
                  onClick={() => navigate('/hugin/planning')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    borderLeft: `3px solid ${statusStyle.color}`,
                    marginBottom: '0.75rem'
                  }}
                >
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    background: statusStyle.bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: statusStyle.color,
                    flexShrink: 0
                  }}>
                    {getEventIcon(event.title)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                      {event.time} - {event.title}
                    </p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--mobile-text-secondary)' }}>
                      📍 {event.resource}
                    </p>
                  </div>
                  <div style={{
                    padding: '0.25rem 0.5rem',
                    borderRadius: '0.5rem',
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    background: statusStyle.bg,
                    color: statusStyle.color,
                    flexShrink: 0
                  }}>
                    {statusStyle.text}
                  </div>
                </div>
              );
            })}
          </>
        )}

        {todayEvents.length === 0 && (
          <div className="mobile-card" style={{ textAlign: 'center', padding: '2rem', marginBottom: '1.5rem' }}>
            <Calendar size={32} style={{ margin: '0 auto 0.75rem', color: 'var(--mobile-text-secondary)' }} />
            <p style={{ color: 'var(--mobile-text-secondary)', fontSize: '0.9rem' }}>
              Aucun événement prévu aujourd'hui
            </p>
          </div>
        )}

        {/* Quick Actions */}
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', marginTop: '2rem' }}>
          Actions rapides
        </h2>
        <div className="mobile-grid" style={{ marginBottom: '1.5rem' }}>
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <div
                key={index}
                className="mobile-card"
                onClick={() => navigate(action.path)}
                style={{
                  textAlign: 'center',
                  padding: '1.5rem 1rem',
                  cursor: 'pointer'
                }}
              >
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: `${action.color}15`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 0.75rem',
                  color: action.color
                }}>
                  <Icon size={24} />
                </div>
                <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>
                  {action.label}
                </p>
              </div>
            );
          })}
        </div>

        {/* Main Actions */}
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>
          Accès rapide
        </h2>

        <div className="mobile-list-item" onClick={() => navigate('/munin')}>
          <div className="mobile-icon mobile-icon-munin">
            <BookOpen size={24} />
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.25rem' }}>
              Munin
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--mobile-text-secondary)' }}>
              Base de connaissances scientifiques
            </p>
          </div>
        </div>

        <div className="mobile-list-item" onClick={() => navigate('/hugin')}>
          <div className="mobile-icon mobile-icon-hugin">
            <FlaskConical size={24} />
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.25rem' }}>
              Hugin
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--mobile-text-secondary)' }}>
              Outils de laboratoire et analyses
            </p>
          </div>
        </div>
      </div>

      <MobileBottomNav />
    </div>
  );
};

export default MobileHome;
