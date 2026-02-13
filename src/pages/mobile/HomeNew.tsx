import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Beaker, BookOpen, Bell, TrendingUp, Calendar, Mail, Package, Clock, FlaskConical, Target, Award, Zap, Star } from 'lucide-react';
import MobileBottomNav from '../../components/MobileBottomNav';
import '../../styles/mobile-app.css';

const MobileHomeNew = () => {
    const navigate = useNavigate();
    const currentUser = localStorage.getItem('currentUser') || 'Utilisateur';
    
    // Extraire le prénom
    let firstName = 'Utilisateur';
    try {
        const userData = JSON.parse(currentUser);
        firstName = userData.firstName || userData.name?.split(' ')[0] || 'Utilisateur';
    } catch {
        firstName = currentUser.split('@')[0] || 'Utilisateur';
    }

    const [currentTime, setCurrentTime] = useState(new Date());
    const [unreadCount, setUnreadCount] = useState(0);
    const [todayEvents, setTodayEvents] = useState<any[]>([]);

    // Update time every second
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // Load unread messages
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

    // Load today's events
    useEffect(() => {
        const loadTodayEvents = async () => {
            try {
                const { fetchModuleData } = await import('../../utils/persistence');
                const events = await fetchModuleData('planning');
                if (events && Array.isArray(events)) {
                    const today = new Date().toISOString().split('T')[0];
                    const todayEventsFiltered = events
                        .filter((event: any) => event.date === today)
                        .sort((a: any, b: any) => a.time.localeCompare(b.time))
                        .slice(0, 4);
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
        if (lowerTitle.includes('réunion') || lowerTitle.includes('meeting')) return Clock;
        if (lowerTitle.includes('analyse') || lowerTitle.includes('test') || lowerTitle.includes('pcr')) return FlaskConical;
        if (lowerTitle.includes('rapport') || lowerTitle.includes('rédaction') || lowerTitle.includes('document')) return BookOpen;
        return Target;
    };

    const getEventColor = (index: number) => {
        const colors = ['#6366f1', '#10b981', '#8b5cf6', '#f59e0b'];
        return colors[index % colors.length];
    };

    const quickActions = [
        { icon: Beaker, label: 'Hugin Lab', path: '/hugin', color: '#3b82f6', gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' },
        { icon: BookOpen, label: 'Munin Atlas', path: '/munin', color: '#10b981', gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' },
        { icon: Calendar, label: 'Planning', path: '/hugin/planning', color: '#8b5cf6', gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' },
        { icon: Mail, label: 'Messages', path: '/hugin/messaging', color: '#f59e0b', gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }
    ];

    const achievements = [
        { icon: Award, title: 'Premier projet', desc: 'Complété', color: '#f59e0b' },
        { icon: Zap, title: 'Productif', desc: '10 analyses', color: '#3b82f6' },
        { icon: Star, title: 'Expert', desc: 'Niveau 5', color: '#8b5cf6' }
    ];

    return (
        <div className="mobile-app">
            {/* Header avec gradient */}
            <div className="mobile-header">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <h1 className="mobile-header-title">
                            Bonjour, {firstName} 👋
                        </h1>
                        <p className="mobile-header-subtitle">
                            Bienvenue sur OLS
                        </p>
                    </div>
                    <button 
                        onClick={() => navigate('/account')}
                        className="mobile-avatar"
                    >
                        {firstName[0].toUpperCase()}
                    </button>
                </div>
            </div>

            {/* Contenu */}
            <div className="mobile-content">
                {/* Quick Stats */}
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div 
                        className="mobile-card mobile-card-elevated"
                        onClick={() => navigate('/hugin/messaging')}
                        style={{ flex: 1, textAlign: 'center', cursor: 'pointer' }}
                    >
                        <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            marginBottom: '0.5rem',
                            color: '#3b82f6'
                        }}>
                            <Mail size={20} />
                        </div>
                        <div style={{ fontSize: '2rem', fontWeight: 800, color: '#3b82f6', marginBottom: '0.25rem' }}>
                            {unreadCount}
                        </div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--mobile-text-secondary)' }}>
                            Messages
                        </div>
                    </div>
                    <div className="mobile-card mobile-card-elevated" style={{ flex: 1, textAlign: 'center' }}>
                        <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            marginBottom: '0.5rem',
                            color: '#f59e0b'
                        }}>
                            <Clock size={20} />
                        </div>
                        <div style={{ fontSize: '2rem', fontWeight: 800, color: '#f59e0b', marginBottom: '0.25rem' }}>
                            {currentTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--mobile-text-secondary)' }}>
                            Heure
                        </div>
                    </div>
                </div>

                {/* Actions Rapides */}
                <div className="mobile-section">
                    <h2 className="mobile-section-title">Actions Rapides</h2>
                    <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(2, 1fr)', 
                        gap: '1rem' 
                    }}>
                        {quickActions.map((action, idx) => (
                            <button
                                key={idx}
                                onClick={() => navigate(action.path)}
                                className="mobile-card mobile-card-elevated"
                                style={{
                                    background: action.gradient,
                                    color: 'white',
                                    border: 'none',
                                    cursor: 'pointer',
                                    padding: '1.5rem 1rem',
                                    textAlign: 'center',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    minHeight: '120px'
                                }}
                            >
                                <action.icon size={32} strokeWidth={2.5} />
                                <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>
                                    {action.label}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Emploi du temps du jour */}
                <div className="mobile-section">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h2 className="mobile-section-title" style={{ margin: 0 }}>Aujourd'hui</h2>
                        <button
                            onClick={() => navigate('/hugin/planning')}
                            className="mobile-badge mobile-badge-primary"
                            style={{ cursor: 'pointer' }}
                        >
                            Voir tout →
                        </button>
                    </div>
                    
                    {todayEvents.length === 0 ? (
                        <div className="mobile-card" style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                            <Calendar size={48} style={{ margin: '0 auto 1rem', opacity: 0.3, color: 'var(--mobile-text-secondary)' }} />
                            <div style={{ color: 'var(--mobile-text-secondary)', fontSize: '0.9rem' }}>
                                Aucun événement prévu aujourd'hui
                            </div>
                        </div>
                    ) : (
                        <div className="mobile-list">
                            {todayEvents.map((event, idx) => {
                                const EventIcon = getEventIcon(event.title);
                                const color = getEventColor(idx);
                                const status = getEventStatus(event.time);
                                
                                return (
                                    <div 
                                        key={event.id}
                                        className="mobile-card mobile-card-elevated"
                                        onClick={() => navigate('/hugin/planning')}
                                        style={{
                                            borderLeft: `4px solid ${color}`,
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                                            <div 
                                                className="mobile-list-item-icon"
                                                style={{ 
                                                    background: `${color}15`,
                                                    color: color
                                                }}
                                            >
                                                <EventIcon size={24} />
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <div className="mobile-card-title" style={{ marginBottom: '0.5rem' }}>
                                                    {event.time} - {event.title}
                                                </div>
                                                {event.resource && (
                                                    <div className="mobile-card-subtitle" style={{ marginBottom: '0.5rem' }}>
                                                        📍 {event.resource}
                                                    </div>
                                                )}
                                                <span 
                                                    className={`mobile-badge ${
                                                        status === 'completed' ? 'mobile-badge-success' : 
                                                        status === 'in-progress' ? 'mobile-badge-primary' : 
                                                        'mobile-badge'
                                                    }`}
                                                    style={{ fontSize: '0.75rem' }}
                                                >
                                                    {status === 'completed' ? '✓ Terminé' : 
                                                     status === 'in-progress' ? '⏳ En cours' : 
                                                     '⏰ À venir'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Succès */}
                <div className="mobile-section">
                    <h2 className="mobile-section-title">Succès</h2>
                    <div className="mobile-list">
                        {achievements.map((achievement, idx) => (
                            <div key={idx} className="mobile-list-item">
                                <div 
                                    className="mobile-list-item-icon"
                                    style={{ 
                                        background: `${achievement.color}15`,
                                        color: achievement.color
                                    }}
                                >
                                    <achievement.icon size={24} />
                                </div>
                                <div className="mobile-list-item-content">
                                    <div className="mobile-list-item-title">
                                        {achievement.title}
                                    </div>
                                    <div className="mobile-list-item-subtitle">
                                        {achievement.desc}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Navigation */}
            <MobileBottomNav />
        </div>
    );
};

export default MobileHomeNew;
