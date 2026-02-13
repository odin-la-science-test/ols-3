import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Plus, Clock, MapPin, Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import MobileBottomNav from '../../../components/MobileBottomNav';
import '../../../styles/mobile-app.css';

const MobilePlanning = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const { fetchModuleData } = await import('../../../utils/persistence');
        const data = await fetchModuleData('planning');
        if (data && Array.isArray(data)) {
          setEvents(data);
        }
      } catch (error) {
        console.error('Error loading events:', error);
      }
    };
    loadEvents();
  }, []);

  const filteredEvents = events
    .filter(e => e.date === selectedDate)
    .filter(e => 
      e.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.resource?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => a.time.localeCompare(b.time));

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

  const statusColors = {
    completed: { bg: 'rgba(16, 185, 129, 0.1)', color: '#10b981', text: '✓ Terminé' },
    'in-progress': { bg: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', text: '⏳ En cours' },
    upcoming: { bg: 'rgba(100, 116, 139, 0.1)', color: '#64748b', text: '⏰ À venir' }
  };

  return (
    <div className="mobile-container">
      <div className="mobile-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <button
            onClick={() => navigate('/hugin')}
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
          <h1 className="mobile-title" style={{ marginBottom: 0 }}>Planning</h1>
        </div>
      </div>

      <div className="mobile-content">
        {/* Date Selector */}
        <div className="mobile-card" style={{ marginBottom: '1rem' }}>
          <label style={{ fontSize: '0.85rem', color: 'var(--mobile-text-secondary)', marginBottom: '0.5rem', display: 'block' }}>
            Date
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="mobile-input"
            style={{ marginBottom: 0 }}
          />
        </div>

        {/* Search Bar */}
        <div className="mobile-search">
          <Search className="mobile-search-icon" size={20} />
          <input
            type="text"
            placeholder="Rechercher un événement..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Events List */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>
            Événements ({filteredEvents.length})
          </h2>
          <button
            className="mobile-btn-primary"
            style={{
              width: 'auto',
              padding: '0.5rem 1rem',
              fontSize: '0.85rem'
            }}
          >
            <Plus size={18} />
            Ajouter
          </button>
        </div>

        {filteredEvents.length === 0 ? (
          <div className="mobile-card" style={{ textAlign: 'center', padding: '2rem' }}>
            <Calendar size={32} style={{ margin: '0 auto 0.75rem', color: 'var(--mobile-text-secondary)' }} />
            <p style={{ color: 'var(--mobile-text-secondary)' }}>
              Aucun événement pour cette date
            </p>
          </div>
        ) : (
          filteredEvents.map((event, index) => {
            const status = getEventStatus(event.time);
            const statusStyle = statusColors[status];

            return (
              <div
                key={index}
                className="mobile-card"
                style={{
                  borderLeft: `3px solid ${statusStyle.color}`,
                  marginBottom: '0.75rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <div style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '12px',
                    background: statusStyle.bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: statusStyle.color,
                    flexShrink: 0,
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    flexDirection: 'column',
                    padding: '0.25rem'
                  }}>
                    <Clock size={18} />
                    <span style={{ fontSize: '0.7rem', marginTop: '0.25rem' }}>
                      {event.time}
                    </span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                      {event.title}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                      <MapPin size={14} style={{ color: 'var(--mobile-text-secondary)' }} />
                      <p style={{ fontSize: '0.85rem', color: 'var(--mobile-text-secondary)' }}>
                        {event.resource}
                      </p>
                    </div>
                    <div style={{
                      display: 'inline-block',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '1rem',
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      background: statusStyle.bg,
                      color: statusStyle.color,
                      marginTop: '0.5rem'
                    }}>
                      {statusStyle.text}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <MobileBottomNav />
    </div>
  );
};

export default MobilePlanning;
