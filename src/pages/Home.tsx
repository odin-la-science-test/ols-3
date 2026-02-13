import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { BookOpen, FlaskConical, TrendingUp, Clock, Star, Zap, Award, Target } from 'lucide-react';
import { useLanguage } from '../components/LanguageContext';
import Navbar from '../components/Navbar';
import OnboardingMissions from '../components/OnboardingMissions';
import { useTheme } from '../components/ThemeContext';
import { useDeviceDetection } from '../hooks/useDeviceDetection';

const Home = () => {
    const navigate = useNavigate();
    const { t } = useLanguage();
    const { theme } = useTheme();
    const { isMobile } = useDeviceDetection();
    const c = theme.colors;
    const [showOnboarding, setShowOnboarding] = useState(false);

    useEffect(() => {
        const isFirstTime = localStorage.getItem('firstTimeLogin') === 'true';
        if (isFirstTime) {
            setShowOnboarding(true);
        }
    }, []);

    const handleCompleteOnboarding = () => {
        localStorage.removeItem('firstTimeLogin');
        setShowOnboarding(false);
    };

    const username = localStorage.getItem('currentUser')?.split('@')[0] || 'User';

    const [currentTime, setCurrentTime] = useState(new Date());
    const [unreadCount, setUnreadCount] = useState(0);
    const [todayEvents, setTodayEvents] = useState<any[]>([]);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const loadUnreadMessages = async () => {
            try {
                const { fetchModuleData } = await import('../utils/persistence');
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
                const { fetchModuleData } = await import('../utils/persistence');
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
        if (lowerTitle.includes('réunion') || lowerTitle.includes('meeting')) return <Clock size={20} />;
        if (lowerTitle.includes('analyse') || lowerTitle.includes('test') || lowerTitle.includes('pcr')) return <FlaskConical size={20} />;
        if (lowerTitle.includes('rapport') || lowerTitle.includes('rédaction') || lowerTitle.includes('document')) return <BookOpen size={20} />;
        return <Target size={20} />;
    };

    const getEventColor = (index: number) => {
        const colors = ['#6366f1', '#10b981', '#8b5cf6', '#f59e0b'];
        return colors[index % colors.length];
    };

    const quickStats = [
        { 
            icon: <BookOpen size={20} />, 
            label: 'Messages non lus', 
            value: unreadCount.toString(), 
            color: '#3b82f6' 
        },
        { 
            icon: <Clock size={20} />, 
            label: 'Heure', 
            value: currentTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }), 
            color: '#f59e0b' 
        }
    ];

    const recentActivities = todayEvents.length > 0 ? todayEvents.map((event, index) => ({
        icon: getEventIcon(event.title),
        title: `${event.time} - ${event.title}`,
        time: event.resource,
        date: new Date(event.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }),
        color: getEventColor(index),
        status: getEventStatus(event.time)
    })) : [
        { icon: <Clock size={20} />, title: '09:00 - Aucun événement prévu', time: 'Journée libre', date: new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }), color: '#64748b', status: 'upcoming' }
    ];

    const achievements = [
        { icon: <Award size={24} />, title: 'Premier projet', desc: 'Complété', color: '#f59e0b' },
        { icon: <Zap size={24} />, title: 'Productif', desc: '10 analyses', color: '#3b82f6' },
        { icon: <Star size={24} />, title: 'Expert', desc: 'Niveau 5', color: '#8b5cf6' }
    ];

    const content = (
        <main className={isMobile ? "" : "container"} style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: isMobile ? 'flex-start' : 'center',
            justifyContent: 'center',
            minHeight: isMobile ? 'auto' : '60vh',
            position: 'relative',
            zIndex: 1,
            paddingTop: isMobile ? '1rem' : '4rem',
            paddingBottom: isMobile ? '2rem' : '4rem'
        }}>
            {isMobile && (
                <div style={{ marginBottom: '2rem', width: '100%' }}>
                    <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)', fontWeight: 500, marginBottom: '0.25rem' }}>Bienvenue,</p>
                    <h2 style={{ fontSize: '2rem', fontWeight: 900, letterSpacing: '-0.03em' }}>{username} 👋</h2>
                </div>
            )}

            {!isMobile && (
                <>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: '100%',
                        maxWidth: '1200px',
                        marginBottom: '3rem'
                    }}>
                        <div>
                            <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.5)', fontWeight: 500, marginBottom: '0.5rem' }}>
                                Bienvenue de retour,
                            </p>
                            <h1 style={{
                                fontSize: '3rem',
                                fontWeight: 900,
                                letterSpacing: '-0.03em',
                                marginBottom: '0.5rem'
                            }}>
                                {username} 👋
                            </h1>
                            <p style={{
                                color: c.textSecondary,
                                fontSize: 'var(--font-size-base)',
                                lineHeight: 1.6,
                                opacity: 0.9
                            }}>
                                {t('home.subtitle')}
                            </p>
                        </div>
                        <div style={{
                            display: 'flex',
                            gap: '1rem',
                            flexWrap: 'wrap'
                        }}>
                            {quickStats.map((stat, i) => (
                                <div 
                                    key={i} 
                                    onClick={() => {
                                        if (stat.label === 'Messages non lus') {
                                            navigate('/hugin/messaging');
                                        }
                                    }}
                                    style={{
                                        background: 'rgba(255, 255, 255, 0.03)',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        borderRadius: '1rem',
                                        padding: '1.25rem',
                                        minWidth: '140px',
                                        textAlign: 'center',
                                        cursor: stat.label === 'Messages non lus' ? 'pointer' : 'default',
                                        transition: 'all 0.3s'
                                    }}
                                    onMouseEnter={(e) => {
                                        if (stat.label === 'Messages non lus') {
                                            e.currentTarget.style.transform = 'translateY(-2px)';
                                            e.currentTarget.style.borderColor = stat.color;
                                            e.currentTarget.style.boxShadow = `0 4px 12px ${stat.color}33`;
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (stat.label === 'Messages non lus') {
                                            e.currentTarget.style.transform = 'translateY(0)';
                                            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                                            e.currentTarget.style.boxShadow = 'none';
                                        }
                                    }}
                                >
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.5rem',
                                        marginBottom: '0.5rem',
                                        color: stat.color
                                    }}>
                                        {stat.icon}
                                    </div>
                                    <div style={{
                                        fontSize: '2rem',
                                        fontWeight: 800,
                                        color: stat.color,
                                        marginBottom: '0.25rem'
                                    }}>
                                        {stat.value}
                                    </div>
                                    <div style={{
                                        fontSize: '0.85rem',
                                        color: 'rgba(255,255,255,0.5)'
                                    }}>
                                        {stat.label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}

            <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(auto-fit, minmax(350px, 1fr))',
                gap: isMobile ? '1rem' : '2rem',
                width: '100%',
                maxWidth: isMobile ? '100%' : '1200px',
                marginBottom: isMobile ? '0' : '3rem'
            }}>
                {/* Munin Card */}
                <div
                    onClick={() => navigate('/munin')}
                    className={isMobile ? "card-native" : "card glass-panel home-card"}
                    style={{
                        cursor: 'pointer',
                        padding: isMobile ? '1.5rem' : '3rem',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: isMobile ? 'flex-start' : 'center',
                        textAlign: isMobile ? 'left' : 'center',
                        borderTop: isMobile ? 'none' : `4px solid ${c.accentMunin}`,
                        position: 'relative',
                        overflow: 'hidden'
                    }}
                >
                    <div style={{
                        padding: '1.25rem',
                        background: 'rgba(16, 185, 129, 0.15)',
                        borderRadius: '1.25rem',
                        color: c.accentMunin,
                        marginBottom: '1.5rem',
                    }}>
                        <BookOpen size={isMobile ? 32 : 48} />
                    </div>
                    <div>
                        <h2 style={{ fontSize: isMobile ? '1.1rem' : 'var(--font-size-xl)', marginBottom: '0.5rem', fontWeight: 700 }}>{t('munin.title')}</h2>
                        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', lineHeight: 1.4, display: isMobile ? 'block' : 'none' }}>
                            Accédez à vos documents et recherche scientifique.
                        </p>
                        {!isMobile && <p style={{ color: c.textSecondary, fontSize: 'var(--font-size-sm)', lineHeight: 1.6 }}>{t('home.munin_desc')}</p>}
                    </div>
                </div>

                {/* Hugin Card */}
                <div
                    onClick={() => navigate('/hugin')}
                    className={isMobile ? "card-native" : "card glass-panel home-card"}
                    style={{
                        cursor: 'pointer',
                        padding: isMobile ? '1.5rem' : '3rem',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: isMobile ? 'flex-start' : 'center',
                        textAlign: isMobile ? 'left' : 'center',
                        borderTop: isMobile ? 'none' : `4px solid ${c.accentHugin}`,
                        position: 'relative',
                        overflow: 'hidden'
                    }}
                >
                    <div style={{
                        padding: '1.25rem',
                        background: 'rgba(99, 102, 241, 0.15)',
                        borderRadius: '1.25rem',
                        color: c.accentHugin,
                        marginBottom: '1.5rem',
                    }}>
                        <FlaskConical size={isMobile ? 32 : 48} />
                    </div>
                    <div>
                        <h2 style={{ fontSize: isMobile ? '1.1rem' : 'var(--font-size-xl)', marginBottom: '0.5rem', fontWeight: 700 }}>{t('hugin.title')}</h2>
                        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', lineHeight: 1.4, display: isMobile ? 'block' : 'none' }}>
                            Lancez vos analyses et tests de laboratoire.
                        </p>
                        {!isMobile && <p style={{ color: c.textSecondary, fontSize: 'var(--font-size-sm)', lineHeight: 1.6 }}>{t('home.hugin_desc')}</p>}
                    </div>
                </div>
            </div>

            {isMobile && (
                <div style={{ marginTop: '2.5rem', width: '100%' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem', color: 'white' }}>Récents</h3>
                    <div className="card-native" style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <FlaskConical size={20} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>Analyse Bio-Tech #42</p>
                                <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>Il y a 2 heures</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {!isMobile && (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '2fr 1fr',
                    gap: '2rem',
                    width: '100%',
                    maxWidth: '1200px'
                }}>
                    <div>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: '1.5rem'
                        }}>
                            <h3 style={{
                                fontSize: '1.5rem',
                                fontWeight: 700,
                                color: 'white'
                            }}>
                                Emploi du temps du jour
                            </h3>
                            <button
                                onClick={() => navigate('/hugin/planning')}
                                style={{
                                    padding: '0.5rem 1rem',
                                    background: 'rgba(59, 130, 246, 0.1)',
                                    border: '1px solid rgba(59, 130, 246, 0.3)',
                                    borderRadius: '0.5rem',
                                    color: '#3b82f6',
                                    fontSize: '0.9rem',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    transition: 'all 0.3s'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'rgba(59, 130, 246, 0.2)';
                                    e.currentTarget.style.borderColor = '#3b82f6';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)';
                                    e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.3)';
                                }}
                            >
                                Voir le planning complet →
                            </button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {recentActivities.map((activity, i) => (
                                <div 
                                    key={i} 
                                    className="glass-panel" 
                                    onClick={() => navigate('/hugin/planning')}
                                    style={{
                                        padding: '1.5rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '1.5rem',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s',
                                        borderLeft: `4px solid ${activity.color}`,
                                        position: 'relative',
                                        overflow: 'hidden'
                                    }}
                                >
                                    <div style={{
                                        width: '50px',
                                        height: '50px',
                                        borderRadius: '12px',
                                        background: `${activity.color}15`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: activity.color
                                    }}>
                                        {activity.icon}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <p style={{ fontWeight: 600, fontSize: '1rem', marginBottom: '0.25rem' }}>
                                            {activity.title}
                                        </p>
                                        <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>
                                            📍 {activity.time}
                                        </p>
                                        <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.25rem' }}>
                                            📅 {activity.date}
                                        </p>
                                    </div>
                                    <div style={{
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '1rem',
                                        fontSize: '0.75rem',
                                        fontWeight: 600,
                                        background: activity.status === 'completed' 
                                            ? 'rgba(16, 185, 129, 0.1)' 
                                            : activity.status === 'in-progress'
                                            ? 'rgba(59, 130, 246, 0.1)'
                                            : 'rgba(100, 116, 139, 0.1)',
                                        color: activity.status === 'completed' 
                                            ? '#10b981' 
                                            : activity.status === 'in-progress'
                                            ? '#3b82f6'
                                            : '#64748b'
                                    }}>
                                        {activity.status === 'completed' ? '✓ Terminé' : activity.status === 'in-progress' ? '⏳ En cours' : '⏰ À venir'}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 style={{
                            fontSize: '1.5rem',
                            fontWeight: 700,
                            marginBottom: '1.5rem',
                            color: 'white'
                        }}>
                            Succès
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {achievements.map((achievement, i) => (
                                <div key={i} className="glass-panel" style={{
                                    padding: '1.5rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1rem',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s'
                                }}>
                                    <div style={{
                                        width: '50px',
                                        height: '50px',
                                        borderRadius: '12px',
                                        background: `${achievement.color}15`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: achievement.color
                                    }}>
                                        {achievement.icon}
                                    </div>
                                    <div>
                                        <p style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '0.25rem' }}>
                                            {achievement.title}
                                        </p>
                                        <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>
                                            {achievement.desc}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </main>
    );

    if (isMobile) {
        return (
            <div className="app-viewport">
                <Navbar />
                <div className="app-scrollbox" style={{ padding: '1.5rem' }}>
                    {content}
                    {showOnboarding && <OnboardingMissions onComplete={handleCompleteOnboarding} />}
                </div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', position: 'relative' }}>
            <Navbar />
            <div style={{ padding: '2rem', position: 'relative' }}>
                {content}
                {showOnboarding && <OnboardingMissions onComplete={handleCompleteOnboarding} />}
            </div>

            <style>{`
                .text-gradient {
                    background: linear-gradient(135deg, ${c.accentPrimary}, ${c.accentSecondary});
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                .glass-panel {
                    background: ${c.cardBg};
                    backdrop-filter: blur(12px);
                    border: 1px solid ${c.borderColor};
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
                    transition: transform 0.3s ease, border-color 0.3s ease;
                }
                .glass-panel:hover {
                    transform: translateY(-5px);
                    border-color: ${c.accentPrimary}44;
                    background: rgba(255, 255, 255, 0.05) !important;
                }
                .home-card:active {
                    transform: scale(0.98);
                    opacity: 0.9;
                }
            `}</style>
        </div>
    );
};

export default Home;
