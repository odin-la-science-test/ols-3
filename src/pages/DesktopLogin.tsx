import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../components/ToastContext';
import './DesktopLogin.css';

const DesktopLogin = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulation de connexion
    setTimeout(() => {
      if (email && password) {
        localStorage.setItem('currentUser', email);
        localStorage.setItem('isAuthenticated', 'true');
        sessionStorage.setItem('fromDesktopLogin', 'true'); // Flag pour déclencher l'animation splash
        showToast('✅ Connexion réussie!', 'success');
        navigate('/desktop-home'); // Navigation vers desktop-home au lieu de /home
      } else {
        showToast('❌ Email et mot de passe requis', 'error');
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="desktop-login">
      <div className="desktop-login-container">
        <div className="desktop-login-header">
          <img src={LOGOS.main} alt="Odin La Science" className="desktop-login-logo" />
          <h1>Odin La Science</h1>
          <p>Application Desktop</p>
        </div>

        <form onSubmit={handleLogin} className="desktop-login-form">
          <div className="desktop-form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
              required
              autoFocus
            />
          </div>

          <div className="desktop-form-group">
            <label htmlFor="password">Mot de passe</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button 
            type="submit" 
            className="desktop-login-btn"
            disabled={isLoading}
          >
            {isLoading ? 'Connexion...' : 'Se connecter'}
          </button>

          <div className="desktop-login-footer">
            <button 
              type="button"
              onClick={() => navigate('/register')}
              className="desktop-link-btn"
            >
              Créer un compte
            </button>
          </div>
        </form>

        <div className="desktop-login-info">
          <p>Version Desktop 1.0.0</p>
        </div>
      </div>
    </div>
  );
};

export default DesktopLogin;
