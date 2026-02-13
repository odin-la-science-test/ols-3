import { useNavigate, useLocation } from 'react-router-dom';
import { Home, BookOpen, FlaskConical, Settings } from 'lucide-react';
import '../styles/mobile-app.css';

const MobileBottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: Home, label: 'Accueil', path: '/home' },
    { icon: BookOpen, label: 'Munin', path: '/munin' },
    { icon: null, label: 'Logo', path: null }, // Logo au centre
    { icon: FlaskConical, label: 'Hugin', path: '/hugin' },
    { icon: Settings, label: 'Compte', path: '/settings' }
  ];

  return (
    <nav className="mobile-bottom-nav">
      {navItems.map((item, index) => {
        if (item.label === 'Logo') {
          return (
            <div
              key="logo"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0.5rem'
              }}
            >
              <img 
                src="/logo1.png" 
                alt="Odin Logo" 
                style={{ 
                  height: '40px',
                  filter: 'drop-shadow(0 0 8px rgba(99, 102, 241, 0.3))'
                }} 
              />
            </div>
          );
        }

        const Icon = item.icon!;
        const isActive = location.pathname === item.path;
        
        return (
          <div
            key={item.path}
            className={`mobile-nav-item ${isActive ? 'active' : ''}`}
            onClick={() => navigate(item.path!)}
          >
            <Icon size={24} />
            <span>{item.label}</span>
          </div>
        );
      })}
    </nav>
  );
};

export default MobileBottomNav;
