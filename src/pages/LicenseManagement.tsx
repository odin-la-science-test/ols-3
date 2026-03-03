import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../components/ThemeContext';
import Navbar from '../components/Navbar';
import {
  Users, UserPlus, UserMinus, CreditCard, AlertCircle,
  CheckCircle, Mail, ArrowLeft, RefreshCw, Shield
} from 'lucide-react';
import {
  getLicenseByOwner,
  assignUserToLicense,
  removeUserFromLicense,
  canCreateAccount,
  type License
} from '../utils/licenseManagement';
import { useToast } from '../components/ToastContext';

const LicenseManagement = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { showToast } = useToast();
  const c = theme.colors;

  const [license, setLicense] = useState<License | null>(null);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  const currentUserEmail = localStorage.getItem('currentUser');

  useEffect(() => {
    loadLicense();
  }, []);

  const loadLicense = () => {
    if (!currentUserEmail) {
      navigate('/login');
      return;
    }

    const userLicense = getLicenseByOwner(currentUserEmail);
    if (!userLicense) {
      showToast('Aucune licence trouvée pour votre compte', 'error');
      return;
    }

    setLicense(userLicense);
  };

  const handleAddUser = async () => {
    if (!license || !newUserEmail.trim()) {
      showToast('Veuillez entrer un email valide', 'error');
      return;
    }

    // Vérifier si on peut créer un compte
    const { can, message } = canCreateAccount(currentUserEmail!);
    if (!can) {
      showToast(message, 'error');
      return;
    }

    setLoading(true);

    // Simuler la création du compte (à remplacer par vraie logique)
    setTimeout(() => {
      const result = assignUserToLicense(license.id, newUserEmail.trim());
      
      if (result.success) {
        showToast(`Compte créé pour ${newUserEmail}`, 'success');
        setNewUserEmail('');
        setShowAddForm(false);
        loadLicense();
      } else {
        showToast(result.message, 'error');
      }
      
      setLoading(false);
    }, 1000);
  };

  const handleRemoveUser = (userEmail: string) => {
    if (!license) return;

    if (window.confirm(`Êtes-vous sûr de vouloir retirer ${userEmail} ?`)) {
      const result = removeUserFromLicense(license.id, userEmail);
      
      if (result.success) {
        showToast(`${userEmail} a été retiré`, 'success');
        loadLicense();
      } else {
        showToast(result.message, 'error');
      }
    }
  };

  if (!license) {
    return (
      <div style={{ minHeight: '100vh', background: c.bgPrimary }}>
        <Navbar />
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <AlertCircle size={48} color={c.textSecondary} style={{ opacity: 0.5 }} />
          <p style={{ marginTop: '1rem', color: c.textSecondary }}>
            Chargement de votre licence...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: c.bgPrimary }}>
      <Navbar />
      
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            onClick={() => navigate('/account')}
            style={{
              padding: '0.75rem',
              background: c.cardBg,
              border: `1px solid ${c.borderColor}`,
              borderRadius: '0.75rem',
              color: c.textPrimary,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: c.textPrimary, marginBottom: '0.25rem' }}>
              <Shield size={32} style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'middle' }} />
              Gestion des Licences
            </h1>
            <p style={{ color: c.textSecondary }}>
              Gérez les comptes de votre équipe
            </p>
          </div>
        </div>

        {/* Statistiques */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            padding: '1.5rem',
            background: c.cardBg,
            borderRadius: '1rem',
            border: `1px solid ${c.borderColor}`
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <CreditCard size={24} color={c.accentPrimary} />
              <p style={{ color: c.textSecondary, fontSize: '0.85rem', fontWeight: 600 }}>
                LICENCES TOTALES
              </p>
            </div>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: c.accentPrimary }}>
              {license.totalSeats}
            </h2>
            <p style={{ fontSize: '0.85rem', color: c.textSecondary, marginTop: '0.25rem' }}>
              Sièges achetés
            </p>
          </div>

          <div style={{
            padding: '1.5rem',
            background: c.cardBg,
            borderRadius: '1rem',
            border: `1px solid ${c.borderColor}`
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <Users size={24} color="#10b981" />
              <p style={{ color: c.textSecondary, fontSize: '0.85rem', fontWeight: 600 }}>
                SIÈGES UTILISÉS
              </p>
            </div>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#10b981' }}>
              {license.usedSeats}
            </h2>
            <p style={{ fontSize: '0.85rem', color: c.textSecondary, marginTop: '0.25rem' }}>
              Comptes actifs
            </p>
          </div>

          <div style={{
            padding: '1.5rem',
            background: c.cardBg,
            borderRadius: '1rem',
            border: `1px solid ${c.borderColor}`
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <CheckCircle size={24} color="#f59e0b" />
              <p style={{ color: c.textSecondary, fontSize: '0.85rem', fontWeight: 600 }}>
                SIÈGES DISPONIBLES
              </p>
            </div>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#f59e0b' }}>
              {license.availableSeats}
            </h2>
            <p style={{ fontSize: '0.85rem', color: c.textSecondary, marginTop: '0.25rem' }}>
              Prêts à utiliser
            </p>
          </div>
        </div>

        {/* Bouton Ajouter */}
        {license.availableSeats > 0 && !showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            style={{
              width: '100%',
              padding: '1rem',
              background: `linear-gradient(135deg, ${c.accentPrimary}, ${c.accentSecondary})`,
              border: 'none',
              borderRadius: '0.75rem',
              color: 'white',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              marginBottom: '2rem',
              transition: 'transform 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <UserPlus size={20} />
            Créer un nouveau compte ({license.availableSeats} disponible{license.availableSeats > 1 ? 's' : ''})
          </button>
        )}

        {/* Formulaire d'ajout */}
        {showAddForm && (
          <div style={{
            padding: '1.5rem',
            background: c.cardBg,
            borderRadius: '1rem',
            border: `2px solid ${c.accentPrimary}`,
            marginBottom: '2rem'
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: c.textPrimary, marginBottom: '1rem' }}>
              Créer un nouveau compte
            </h3>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: c.textSecondary, fontSize: '0.9rem' }}>
                  Email de l'utilisateur
                </label>
                <input
                  type="email"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  placeholder="utilisateur@example.com"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: c.bgPrimary,
                    border: `1px solid ${c.borderColor}`,
                    borderRadius: '0.5rem',
                    color: c.textPrimary,
                    fontSize: '1rem'
                  }}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddUser()}
                />
              </div>
              <button
                onClick={handleAddUser}
                disabled={loading || !newUserEmail.trim()}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: loading ? c.textSecondary : c.accentPrimary,
                  border: 'none',
                  borderRadius: '0.5rem',
                  color: 'white',
                  fontWeight: 600,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading || !newUserEmail.trim() ? 0.5 : 1
                }}
              >
                {loading ? 'Création...' : 'Créer'}
              </button>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setNewUserEmail('');
                }}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: 'transparent',
                  border: `1px solid ${c.borderColor}`,
                  borderRadius: '0.5rem',
                  color: c.textPrimary,
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Annuler
              </button>
            </div>
          </div>
        )}

        {/* Liste des utilisateurs */}
        <div style={{
          background: c.cardBg,
          borderRadius: '1rem',
          border: `1px solid ${c.borderColor}`,
          overflow: 'hidden'
        }}>
          <div style={{
            padding: '1.5rem',
            borderBottom: `1px solid ${c.borderColor}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: c.textPrimary }}>
              Utilisateurs ({license.assignedUsers.length})
            </h3>
            <button
              onClick={loadLicense}
              style={{
                padding: '0.5rem 1rem',
                background: 'transparent',
                border: `1px solid ${c.borderColor}`,
                borderRadius: '0.5rem',
                color: c.textPrimary,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <RefreshCw size={16} />
              Actualiser
            </button>
          </div>

          <div style={{ padding: '1rem' }}>
            {license.assignedUsers.map((userEmail, index) => {
              const isOwner = userEmail === license.ownerEmail;
              
              return (
                <div
                  key={index}
                  style={{
                    padding: '1rem',
                    background: isOwner ? 'rgba(99, 102, 241, 0.1)' : c.bgPrimary,
                    borderRadius: '0.75rem',
                    marginBottom: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    border: isOwner ? '1px solid rgba(99, 102, 241, 0.3)' : `1px solid ${c.borderColor}`
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: isOwner ? c.accentPrimary : c.textSecondary,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 700
                    }}>
                      {userEmail.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Mail size={16} color={c.textSecondary} />
                        <span style={{ color: c.textPrimary, fontWeight: 600 }}>
                          {userEmail}
                        </span>
                        {isOwner && (
                          <span style={{
                            padding: '0.25rem 0.75rem',
                            background: c.accentPrimary,
                            borderRadius: '0.5rem',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            color: 'white'
                          }}>
                            PROPRIÉTAIRE
                          </span>
                        )}
                      </div>
                      <p style={{ fontSize: '0.85rem', color: c.textSecondary, marginTop: '0.25rem' }}>
                        Siège #{index + 1}
                      </p>
                    </div>
                  </div>

                  {!isOwner && (
                    <button
                      onClick={() => handleRemoveUser(userEmail)}
                      style={{
                        padding: '0.5rem 1rem',
                        background: 'transparent',
                        border: '1px solid #ef4444',
                        borderRadius: '0.5rem',
                        color: '#ef4444',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#ef4444';
                        e.currentTarget.style.color = 'white';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = '#ef4444';
                      }}
                    >
                      <UserMinus size={16} />
                      Retirer
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Informations */}
        <div style={{
          marginTop: '2rem',
          padding: '1rem',
          background: 'rgba(99, 102, 241, 0.1)',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          borderRadius: '0.75rem',
          fontSize: '0.9rem',
          color: c.textSecondary
        }}>
          <p style={{ marginBottom: '0.5rem' }}>
            💡 <strong style={{ color: c.textPrimary }}>Informations importantes :</strong>
          </p>
          <ul style={{ marginLeft: '1.5rem', lineHeight: 1.6 }}>
            <li>Vous avez acheté {license.totalSeats} licences pour votre équipe</li>
            <li>Chaque utilisateur créé recevra un email pour configurer son compte</li>
            <li>Vous pouvez retirer un utilisateur à tout moment pour libérer un siège</li>
            <li>Le propriétaire (vous) ne peut pas être retiré</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LicenseManagement;
