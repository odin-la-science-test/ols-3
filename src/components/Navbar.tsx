import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { User, LogOut, ChevronDown, ChevronLeft, Settings, LayoutDashboard, StickyNote, Layers } from 'lucide-react';
import { useToast } from './ToastContext';
import { useDeviceDetection } from '../hooks/useDeviceDetection';
import NotificationCenter from './NotificationCenter';
import Avatar from './Avatar';
import QuickNotes from './QuickNotes';
import StudentViewToggle from './StudentViewToggle';
import { LOGOS } from '../utils/logoCache';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { showToast } = useToast();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isNotesOpen, setIsNotesOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { isMobile } = useDeviceDetection();
    const [refreshAvatar, setRefreshAvatar] = useState(0);

    const languages: { code: string; label: string; flag: string }[] = [];

    const currentUser = localStorage.getItem('currentUser');
    const profileStr = currentUser ? localStorage.getItem(`user_profile_${currentUser}`) : null;
    const profile = profileStr ? JSON.parse(profileStr) : null;
    const currentUserEmail = profile?.email || currentUser || '';
    const username = currentUser || 'User';
    const isLoggedIn = !!currentUser;
    
    // Vérifier si l'utilisateur est super admin
    const superAdmins = ['ethan@ols.com', 'bastien@ols.com', 'issam@ols.com'];
    const isSuperAdmin = currentUserEmail && superAdmins.includes(currentUserEmail.toLowerCase().trim());

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
                            <img src={LOGOS.main} alt="Odin Logo" style={{ width: '60px', height: '60px', objectFit: 'contain' }} />
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
                                if (location.pathname.startsWith('/hugin/')) {
                                    // Si on est dans un sous-module de Hugin, retourner à /hugin
                                    navigate('/hugin');
                                } else if (location.pathname === '/hugin') {
                                    // Si on est sur la page Hugin principale, retourner à /home
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
                            <ChevronLeft size={16} /> Retour
                        </button>
                    )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }} ref={dropdownRef}>
                    {isLoggedIn ? (
                        <>
                            {isSuperAdmin && !isMobile && (
                                <StudentViewToggle />
                            )}
                            {!isMobile && location.pathname !== '/home' && location.pathname !== '/' && (
                                <button
                                    onClick={() => setIsNotesOpen(!isNotesOpen)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '50%',
                                        background: isNotesOpen ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'var(--bg-secondary)',
                                        border: '1px solid var(--border-color)',
                                        color: isNotesOpen ? 'white' : 'var(--text-primary)',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s'
                                    }}
                                    title="Notes rapides"
                                >
                                    <StickyNote size={18} />
                                </button>
                            )}
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
                                        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Compte</p>
                                        <p style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{username}</p>
                                    </div>

                                    <button onClick={() => { navigate('/account'); setIsDropdownOpen(false); }} style={dropdownItemStyle}>
                                        <User size={16} /> Profil
                                    </button>
                                    <button onClick={() => { navigate('/settings'); setIsDropdownOpen(false); }} style={dropdownItemStyle}>
                                        <Settings size={16} /> Paramètres
                                    </button>

                                    <div style={{ margin: '0.5rem 0', borderBottom: '1px solid var(--border-color)' }}></div>

                                    <button onClick={handleLogout} style={{ ...dropdownItemStyle, color: '#ef4444' }}>
                                        <LogOut size={16} /> Déconnexion
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
                {/* QuickNotes Modal pour Desktop (hors /home et /) */}
                {isNotesOpen && location.pathname !== '/home' && location.pathname !== '/' && (
                    <QuickNotes isOpen={isNotesOpen} onClose={() => setIsNotesOpen(false)} showFloatingButton={false} />
                )}
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
                        if (location.pathname.startsWith('/hugin/')) {
                            // Si on est dans un sous-module de Hugin, retourner à /hugin
                            navigate('/hugin');
                        } else if (location.pathname === '/hugin') {
                            // Si on est sur la page Hugin principale, retourner à /home
                            navigate('/home');
                        } else if (location.pathname.startsWith('/munin')) {
                            navigate('/home');
                        } else {
                            navigate(-1);
                        }
                    }} style={{ color: 'var(--text-primary)', background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem' }}>
                        <ChevronLeft size={24} />
                    </button>
                ) : (
                    <img src={LOGOS.main} alt="Logo" style={{ width: '32px', height: '32px' }} />
                )}

                <h1 style={{ fontSize: '1.1rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'white' }}>{pageTitle}</h1>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    {isLoggedIn && location.pathname !== '/' && (
                        <button
                            onClick={() => setIsNotesOpen(!isNotesOpen)}
                            style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: isNotesOpen ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'rgba(255, 255, 255, 0.1)',
                                border: 'none',
                                padding: 0,
                                cursor: 'pointer',
                                color: isNotesOpen ? 'white' : 'var(--text-primary)',
                                transition: 'all 0.2s'
                            }}
                        >
                            <StickyNote size={18} />
                        </button>
                    )}
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
                </div>
            </header>

            {/* QuickNotes Modal pour Mobile */}
            {isNotesOpen && isMobile && location.pathname !== '/' && (
                <QuickNotes isOpen={isNotesOpen} onClose={() => setIsNotesOpen(false)} showFloatingButton={false} />
            )}

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
                        <Layers size={24} />
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
