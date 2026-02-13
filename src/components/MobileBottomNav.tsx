import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Beaker, BookOpen, User } from 'lucide-react';
import '../styles/mobile-app.css';

const MobileBottomNav = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const navItems = [
        { path: '/home', icon: Home, label: 'Accueil' },
        { path: '/hugin', icon: Beaker, label: 'Hugin' },
        { path: '/munin', icon: BookOpen, label: 'Munin' },
        { path: '/account', icon: User, label: 'Profil' }
    ];

    const isActive = (path: string) => {
        return location.pathname === path || location.pathname.startsWith(path + '/');
    };

    return (
        <nav className="mobile-bottom-nav">
            {navItems.map((item) => (
                <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={`mobile-nav-item ${isActive(item.path) ? 'active' : ''}`}
                >
                    <item.icon size={24} />
                    <span className="mobile-nav-item-label">{item.label}</span>
                </button>
            ))}
        </nav>
    );
};

export default MobileBottomNav;
