import { useNavigate } from 'react-router-dom';
import { Beaker, BookOpen, Bell, TrendingUp, Calendar, Mail, Package } from 'lucide-react';
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

    const quickActions = [
        { icon: Beaker, label: 'Hugin Lab', path: '/hugin', color: '#3b82f6', gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' },
        { icon: BookOpen, label: 'Munin Atlas', path: '/munin', color: '#10b981', gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' },
        { icon: Calendar, label: 'Planning', path: '/hugin/planning', color: '#8b5cf6', gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' },
        { icon: Mail, label: 'Messages', path: '/hugin/messaging', color: '#f59e0b', gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }
    ];

    const recentActivities = [
        { icon: Package, title: 'Inventaire mis à jour', subtitle: 'Il y a 2 heures', color: '#3b82f6' },
        { icon: Calendar, title: 'Nouveau planning', subtitle: 'Il y a 5 heures', color: '#8b5cf6' },
        { icon: Mail, title: '3 nouveaux messages', subtitle: 'Aujourd\'hui', color: '#f59e0b' }
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

                {/* Statistiques */}
                <div className="mobile-section">
                    <h2 className="mobile-section-title">Aujourd'hui</h2>
                    <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                        <div className="mobile-card" style={{ minWidth: '140px', textAlign: 'center' }}>
                            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#3b82f6', marginBottom: '0.25rem' }}>
                                12
                            </div>
                            <div style={{ fontSize: '0.875rem', color: 'var(--mobile-text-secondary)' }}>
                                Tâches
                            </div>
                        </div>
                        <div className="mobile-card" style={{ minWidth: '140px', textAlign: 'center' }}>
                            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#10b981', marginBottom: '0.25rem' }}>
                                5
                            </div>
                            <div style={{ fontSize: '0.875rem', color: 'var(--mobile-text-secondary)' }}>
                                Messages
                            </div>
                        </div>
                        <div className="mobile-card" style={{ minWidth: '140px', textAlign: 'center' }}>
                            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#8b5cf6', marginBottom: '0.25rem' }}>
                                3
                            </div>
                            <div style={{ fontSize: '0.875rem', color: 'var(--mobile-text-secondary)' }}>
                                Événements
                            </div>
                        </div>
                    </div>
                </div>

                {/* Activités Récentes */}
                <div className="mobile-section">
                    <h2 className="mobile-section-title">Activités Récentes</h2>
                    <div className="mobile-list">
                        {recentActivities.map((activity, idx) => (
                            <div key={idx} className="mobile-list-item">
                                <div 
                                    className="mobile-list-item-icon"
                                    style={{ 
                                        background: `${activity.color}15`,
                                        color: activity.color
                                    }}
                                >
                                    <activity.icon size={24} />
                                </div>
                                <div className="mobile-list-item-content">
                                    <div className="mobile-list-item-title">
                                        {activity.title}
                                    </div>
                                    <div className="mobile-list-item-subtitle">
                                        {activity.subtitle}
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
