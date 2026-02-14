import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { User, LogOut, Globe, ChevronDown, ChevronLeft, Settings, LayoutDashboard } from 'lucide-react';
import { useLanguage, type Language } from './LanguageContext';
import { useToast } from './ToastContext';
import { useDeviceDetection } from '../hooks/useDeviceDetection';
import NotificationCenter from './NotificationCenter';
import Avatar from './Avatar';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { t, language, setLanguage } = useLanguage();
    const { showToast } = useToast();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { isMobile } = useDeviceDetection();
    const [refreshAvatar, setRefreshAvatar] = useState(0);

    const languages: { code: Language; label: string; flag: string }[] = [
        { code: 'FR', label: 'Français', flag: '🇫🇷' },
        { code: 'EN', label: 'English', flag: '🇺🇸' },
        { code: 'ES', label: 'Español', flag: '🇪🇸' },
        { code: 'DE', label: 'Deutsch', flag: '🇩🇪' },
        { code: 'IT', label: 'Italiano', flag: '🇮🇹' },
        { code: 'PT', label: 'Português', flag: '🇵🇹' },
        { code: 'RU', label: 'Русский', flag: '🇷🇺' },
        { code: 'JP', label: '日本語', flag: '🇯🇵' },
        { code: 'HU', label: 'Magyar', flag: '🇭🇺' },
        { code: 'ZH', label: '中文', flag: '🇨🇳' },
        { code: 'AR', label: 'العربية', flag: '🇸🇦' },
        { code: 'KO', label: '한국어', flag: '🇰🇷' }
    ];

    const currentUser = localStorage.getItem('currentUser');
    const profileStr = currentUser ? localStorage.getItem(`user_profile_${currentUser}`) : null;
    const profile = profileStr ? JSON.parse(profileStr) : null;
    const currentUserEmail = profile?.email || currentUser || '';
    const username = currentUser || 'User';
    const isLoggedIn = !!currentUser;

    const handleLogout = () => {
        localStorage.removeItem('currentUser');
        navigate('/');
    };

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Check if we're on Munin, Hugin, or Account pages
    const showBackButton = location.pathname.startsWith('/munin') ||
        location.pathname.startsWith('/hugin') ||
        location.pathname.startsWith('/account') ||
        location.pathname.startsWith('/admin') ||
        location.pathname.startsWith('/settings');

    // Add CSS for fadein if not already in index.css
    const styleString = `
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        nav a:hover {
            color: var(--text-primary) !important;
        }
        .active-tab {
            color: var(--accent-primary) !important;
        }
        .active-tab::after {
            content: '';
            position: absolute;
            bottom: -5px;
            width: 4px;
            height: 4px;
            border-radius: 50%;
            background: var(--accent-primary);
            box-shadow: 0 0 8px var(--accent-primary);
        }
    `;

    // Separate Desktop Nav, Mobile Header, and Mobile Bottom Nav
    if (!isMobile) {
        return (
            <nav style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1rem 2rem',
                background: 'rgba(11, 17, 32, 0.8)',
                backdropFilter: 'blur(10px)',
                borderBottom: '1px solid var(--border-color)',
                position: 'sticky',
                top: 0,
                zIndex: 1000,
                height: '70px'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                    <Link to="/home" style={{ textDecoration: 'none', color: 'inherit', fontWeight: 700, fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <img src="/logo1.png" alt="Odin Logo" style={{ width: '60px', height: '60px', objectFit: 'contain' }} />
                            <span className="text-gradient">Odin la Science</span>
                        </div>
                    </Link>

                    {(localStorage.getItem('currentUserRole') === 'admin' || localStorage.getItem('currentUserRole') === 'super_admin') &&
                        !['/', '/login', '/register', '/why-odin', '/enterprise', '/pricing', '/mobile-apps', '/support', '/blog', '/careers', '/company', '/congratulations'].includes(location.pathname) && (
                            <Link to="/admin" style={{
                                textDecoration: 'none',
                                color: location.pathname === '/admin' ? 'var(--accent-primary)' : 'var(--text-secondary)',
                                fontWeight: 600,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '0.5rem 1rem',
                                borderRadius: '0.5rem',
                                background: location.pathname === '/admin' ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                                transition: 'all 0.2s',
                                fontSize: '1rem'
                            }}>
                                <LayoutDashboard size={18} />
                                <span>Admin</span>
                            </Link>
                        )}

                    {showBackButton && (
                        <button
                            onClick={() => {
                                if (location.pathname.startsWith('/hugin')) {
                                    navigate('/home');
                                } else if (location.pathname.startsWith('/munin')) {
                                    navigate('/home');
                                } else {
                                    navigate(-1);
                                }
                            }}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                color: 'var(--text-secondary)',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: '0.9rem',
                                fontWeight: 500,
                                transition: 'color 0.2s',
                                marginLeft: '1rem'
                            }}
                        >
                            <ChevronLeft size={16} /> {t('common.back')}
                        </button>
                    )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }} ref={dropdownRef}>
                    {isLoggedIn ? (
                        <>
                            <NotificationCenter />
                            <div style={{ position: 'relative' }}>
                                <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.75rem',
                                        padding: '0.5rem 1rem',
                                        background: 'var(--bg-secondary)',
                                        border: '1px solid var(--border-color)',
                                        borderRadius: '50px',
                                        color: 'var(--text-primary)',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <Avatar 
                                            email={currentUserEmail || ''}
                                            name={username}
                                            size={28}
                                        />
                                    </div>
                                    <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{username.split('@')[0]}</span>
                                    <ChevronDown size={14} style={{ transform: isDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                                </button>

                            {isDropdownOpen && (
                                <div style={{
                                    position: 'absolute',
                                    top: 'calc(100% + 0.5rem)',
                                    right: 0,
                                    width: '280px',
                                    background: 'var(--bg-secondary)',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: '1rem',
                                    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.5)',
                                    padding: '0.75rem',
                                    zIndex: 1001,
                                    animation: 'fadeIn 0.2s ease'
                                }}>
                                    <div style={{ padding: '0.5rem 0.75rem 1rem', borderBottom: '1px solid var(--border-color)', marginBottom: '0.5rem' }}>
                                        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>{t('common.account')}</p>
                                        <p style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{username}</p>
                                    </div>

                                    <button onClick={() => { navigate('/account'); setIsDropdownOpen(false); }} style={dropdownItemStyle}>
                                        <User size={16} /> {t('common.profile') || 'Compte'}
                                    </button>
                                    <button onClick={() => { navigate('/settings'); setIsDropdownOpen(false); }} style={dropdownItemStyle}>
                                        <Settings size={16} /> {t('common.settings') || 'Paramètres'}
                                    </button>

                                    <div style={{ margin: '0.5rem 0', borderBottom: '1px solid var(--border-color)' }}></div>

                                    <div style={{ padding: '0.5rem 0.75rem' }}>
                                        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <Globe size={14} /> {t('common.language')}
                                        </p>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
                                            {languages.map((lang) => (
                                                <button
                                                    key={lang.code}
                                                    onClick={() => {
                                                        setLanguage(lang.code);
                                                        showToast(`${lang.label} selected`, 'success');
                                                    }}
                                                    style={{
                                                        padding: '0.4rem',
                                                        borderRadius: '0.5rem',
                                                        background: language === lang.code ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
                                                        border: language === lang.code ? '1px solid var(--accent-munin)' : '1px solid transparent',
                                                        color: language === lang.code ? 'var(--accent-munin)' : 'var(--text-secondary)',
                                                        fontSize: '0.8rem',
                                                        cursor: 'pointer',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '0.4rem',
                                                        transition: 'all 0.2s'
                                                    }}
                                                >
                                                    <span>{lang.flag}</span>
                                                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{lang.label}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div style={{ margin: '0.5rem 0', borderBottom: '1px solid var(--border-color)' }}></div>

                                    <button onClick={handleLogout} style={{ ...dropdownItemStyle, color: '#ef4444' }}>
                                        <LogOut size={16} /> {t('common.logout')}
                                    </button>
                                </div>
                            )}
                        </div>
                        </>
                    ) : (
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button
                                onClick={() => navigate('/login')}
                                style={{
                                    background: 'transparent',
                                    border: '1px solid var(--border-color)',
                                    color: 'var(--text-primary)',
                                    padding: '0.5rem 1.25rem',
                                    borderRadius: '50px',
                                    cursor: 'pointer',
                                    fontSize: '0.9rem',
                                    fontWeight: 500,
                                    transition: 'all 0.2s'
                                }}
                            >
                                Connexion
                            </button>
                            <button
                                onClick={() => navigate('/register')}
                                style={{
                                    background: 'linear-gradient(135deg, var(--accent-munin), var(--accent-hugin))',
                                    border: 'none',
                                    color: 'white',
                                    padding: '0.5rem 1.25rem',
                                    borderRadius: '50px',
                                    cursor: 'pointer',
                                    fontSize: '0.9rem',
                                    fontWeight: 700,
                                    transition: 'all 0.2s',
                                    boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)'
                                }}
                            >
                                Inscription
                            </button>
                        </div>
                    )}
                </div>
            </nav>
        );
    }

    // MOBILE VIEW
    const currentPath = location.pathname;
    const pageTitle = currentPath === '/home' ? 'Odin Pro' :
        currentPath === '/munin' ? 'Munin' :
            currentPath === '/hugin' ? 'Hugin' :
                currentPath === '/account' ? 'Compte' : 'Plateforme';

    return (
        <>
            <style dangerouslySetInnerHTML={{ __html: styleString }} />

            {/* Native Top Bar */}
            <header style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                height: 'var(--header-height)',
                background: 'rgba(0,0,0,0.8)',
                backdropFilter: 'blur(20px)',
                borderBottom: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 1.25rem',
                zIndex: 2000,
                paddingTop: 'var(--safe-top)'
            }}>
                {showBackButton ? (
                    <button onClick={() => {
                        if (location.pathname.startsWith('/hugin')) {
                            navigate('/home');
                        } else if (location.pathname.startsWith('/munin')) {
                            navigate('/home');
                        } else {
                            navigate(-1);
                        }
                    }} style={{ color: 'var(--text-primary)', background: 'none' }}>
                        <ChevronLeft size={24} />
                    </button>
                ) : (
                    <img src="/logo1.png" alt="Logo" style={{ width: '32px', height: '32px' }} />
                )}

                <h1 style={{ fontSize: '1.1rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'white' }}>{pageTitle}</h1>

                <button
                    onClick={() => navigate(isLoggedIn ? '/account' : '/login')}
                    style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'transparent',
                        border: 'none',
                        padding: 0,
                        cursor: 'pointer'
                    }}
                >
                    <Avatar 
                        email={currentUserEmail || ''}
                        name={username}
                        size={32}
                    />
                </button>
            </header>

            {/* Native Bottom Tab Bar */}
            <footer style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                height: 'var(--tabbar-height)',
                background: 'rgba(10, 10, 15, 0.95)',
                backdropFilter: 'blur(25px)',
                borderTop: '1px solid rgba(255,255,255,0.1)',
                display: 'flex',
                justifyContent: 'space-around',
                alignItems: 'center',
                paddingBottom: 'var(--safe-bottom)',
                zIndex: 2000
            }}>
                <Link to="/home" className={currentPath === '/home' ? 'active-tab' : ''} style={mobileTabStyle}>
                    <LayoutDashboard size={24} />
                    <span style={{ fontSize: '0.65rem', fontWeight: 600 }}>Home</span>
                </Link>
                <Link to="/hugin" className={currentPath.startsWith('/hugin') ? 'active-tab' : ''} style={mobileTabStyle}>
                    <div style={{ padding: '0.5rem', borderRadius: '1rem', background: currentPath.startsWith('/hugin') ? 'var(--accent-primary)' : 'rgba(255,255,255,0.05)', color: currentPath.startsWith('/hugin') ? 'white' : 'var(--text-secondary)', transition: 'all 0.3s' }}>
                        <Globe size={24} />
                    </div>
                    <span style={{ fontSize: '0.65rem', fontWeight: 600 }}>Hugin</span>
                </Link>
                <Link to="/munin" className={currentPath.startsWith('/munin') ? 'active-tab' : ''} style={mobileTabStyle}>
                    <div style={{ padding: '0.5rem', borderRadius: '1rem', background: currentPath.startsWith('/munin') ? 'var(--accent-munin)' : 'rgba(255,255,255,0.05)', color: currentPath.startsWith('/munin') ? 'white' : 'var(--text-secondary)', transition: 'all 0.3s' }}>
                        <LayoutDashboard size={24} />
                    </div>
                    <span style={{ fontSize: '0.65rem', fontWeight: 600 }}>Munin</span>
                </Link>
                <Link to="/account" className={currentPath === '/account' ? 'active-tab' : ''} style={mobileTabStyle}>
                    <User size={24} />
                    <span style={{ fontSize: '0.65rem', fontWeight: 600 }}>Profil</span>
                </Link>
            </footer>
        </>
    );
};

const mobileTabStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
    color: 'var(--text-secondary)',
    textDecoration: 'none',
    width: '20%',
    position: 'relative',
    transition: 'all 0.2s'
};

const dropdownItemStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    width: '100%',
    padding: '0.75rem',
    background: 'transparent',
    border: 'none',
    borderRadius: '0.5rem',
    color: 'var(--text-primary)',
    fontSize: '0.9rem',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'background 0.2s'
};

export default Navbar;
