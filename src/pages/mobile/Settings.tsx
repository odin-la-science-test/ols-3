import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail, Shield, Bell, Palette, Globe, LogOut, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import MobileBottomNav from '../../components/MobileBottomNav';
import Avatar from '../../components/Avatar';
import '../../styles/mobile-app.css';

const MobileSettings = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [refreshAvatar, setRefreshAvatar] = useState(0);

  useEffect(() => {
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      try {
        const userData = JSON.parse(userStr);
        setUser(userData);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, [refreshAvatar]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const accountItems = [
    {
      icon: User,
      label: 'Profil',
      value: user?.name || user?.email?.split('@')[0] || 'Utilisateur',
      action: () => navigate('/account')
    },
    {
      icon: Mail,
      label: 'Email',
      value: user?.email || 'Non défini',
      action: () => navigate('/account')
    },
    {
      icon: Shield,
      label: 'Rôle',
      value: user?.role === 'admin' ? 'Administrateur' : 'Utilisateur',
      action: () => {}
    }
  ];

  const settingsItems = [
    {
      icon: Bell,
      label: 'Notifications',
      value: 'Activées',
      action: () => navigate('/settings')
    },
    {
      icon: Palette,
      label: 'Thème',
      value: 'Sombre',
      action: () => navigate('/settings')
    },
    {
      icon: Globe,
      label: 'Langue',
      value: 'Français',
      action: () => navigate('/settings')
    }
  ];

  return (
    <div className="mobile-container">
      <div className="mobile-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <button
            onClick={() => navigate('/home')}
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
          <h1 className="mobile-title" style={{ marginBottom: 0 }}>Compte</h1>
        </div>
      </div>

      <div className="mobile-content">
        {/* User Profile Card */}
        <div className="mobile-card" style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ marginBottom: '1rem' }}>
            <Avatar 
              email={user?.email}
              name={user?.name}
              size={80}
              editable={true}
              onImageChange={() => setRefreshAvatar(prev => prev + 1)}
            />
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.25rem' }}>
            {user?.name || user?.email?.split('@')[0] || 'Utilisateur'}
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--mobile-text-secondary)' }}>
            {user?.email || 'email@example.com'}
          </p>
        </div>

        {/* Account Section */}
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>
          Informations du compte
        </h2>

        {accountItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className="mobile-list-item"
              onClick={item.action}
              style={{ marginBottom: '0.75rem' }}
            >
              <div className="mobile-icon mobile-icon-primary" style={{ width: '40px', height: '40px' }}>
                <Icon size={20} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '0.85rem', color: 'var(--mobile-text-secondary)', marginBottom: '0.25rem' }}>
                  {item.label}
                </p>
                <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>
                  {item.value}
                </p>
              </div>
              <ChevronRight size={20} style={{ color: 'var(--mobile-text-secondary)' }} />
            </div>
          );
        })}

        {/* Settings Section */}
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '2rem 0 1rem' }}>
          Paramètres
        </h2>

        {settingsItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className="mobile-list-item"
              onClick={item.action}
              style={{ marginBottom: '0.75rem' }}
            >
              <div className="mobile-icon mobile-icon-primary" style={{ width: '40px', height: '40px' }}>
                <Icon size={20} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '0.85rem', color: 'var(--mobile-text-secondary)', marginBottom: '0.25rem' }}>
                  {item.label}
                </p>
                <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>
                  {item.value}
                </p>
              </div>
              <ChevronRight size={20} style={{ color: 'var(--mobile-text-secondary)' }} />
            </div>
          );
        })}

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="mobile-btn"
          style={{
            marginTop: '2rem',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#ef4444'
          }}
        >
          <LogOut size={20} />
          Déconnexion
        </button>

        {/* Version Info */}
        <div style={{ textAlign: 'center', marginTop: '2rem', paddingBottom: '1rem' }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--mobile-text-secondary)' }}>
            Odin La Science v1.0.0
          </p>
        </div>
      </div>

      <MobileBottomNav />
    </div>
  );
};

export default MobileSettings;
