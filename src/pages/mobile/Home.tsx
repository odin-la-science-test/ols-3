import { useNavigate } from 'react-router-dom';
import { BookOpen, FlaskConical, Bell, Calendar } from 'lucide-react';
import { useLanguage } from '../../components/LanguageContext';
import Navbar from '../../components/Navbar';

const MobileHome = () => {
    const navigate = useNavigate();
    const { t } = useLanguage();
    const username = localStorage.getItem('currentUser')?.split('@')[0] || 'User';

    return (
        <div className="app-viewport">
            <Navbar />
            <div className="app-scrollbox" style={{ padding: '1.5rem' }}>
                <div style={{ marginBottom: '2rem' }}>
                    <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)', fontWeight: 500, marginBottom: '0.25rem' }}>
                        Bienvenue,
                    </p>
                    <h2 style={{ fontSize: '2rem', fontWeight: 900, letterSpacing: '-0.03em' }}>
                        {username} 👋
                    </h2>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                    <div
                        onClick={() => navigate('/munin')}
                        className="card-native"
                        style={{
                            padding: '1.5rem',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                            cursor: 'pointer'
                        }}
                    >
                        <div style={{
                            padding: '1rem',
                            background: 'rgba(16, 185, 129, 0.15)',
                            borderRadius: '1rem',
                            color: '#10b981',
                            marginBottom: '1rem'
                        }}>
                            <BookOpen size={32} />
                        </div>
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', fontWeight: 700 }}>
                            {t('munin.title')}
                        </h3>
                        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', lineHeight: 1.4 }}>
                            Accédez à vos documents
                        </p>
                    </div>

                    <div
                        onClick={() => navigate('/hugin')}
                        className="card-native"
                        style={{
                            padding: '1.5rem',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                            cursor: 'pointer'
                        }}
                    >
                        <div style={{
                            padding: '1rem',
                            background: 'rgba(99, 102, 241, 0.15)',
                            borderRadius: '1rem',
                            color: '#6366f1',
                            marginBottom: '1rem'
                        }}>
                            <FlaskConical size={32} />
                        </div>
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', fontWeight: 700 }}>
                            {t('hugin.title')}
                        </h3>
                        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', lineHeight: 1.4 }}>
                            Lancez vos analyses
                        </p>
                    </div>
                </div>

                <div style={{ marginBottom: '2rem' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem', color: 'white' }}>
                        Accès Rapide
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {[
                            { icon: <Bell size={20} />, title: 'Messages', path: '/hugin/messaging', color: '#3b82f6' },
                            { icon: <Calendar size={20} />, title: 'Planning', path: '/hugin/planning', color: '#f59e0b' },
                            { icon: <FlaskConical size={20} />, title: 'Cultures', path: '/hugin/culture', color: '#10b981' }
                        ].map((item, i) => (
                            <div
                                key={i}
                                onClick={() => navigate(item.path)}
                                className="card-native"
                                style={{
                                    padding: '1rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1rem',
                                    cursor: 'pointer'
                                }}
                            >
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '10px',
                                    background: `${item.color}15`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: item.color
                                }}>
                                    {item.icon}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.title}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MobileHome;
