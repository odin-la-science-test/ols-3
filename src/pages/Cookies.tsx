import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Cookie, Settings, Shield, BarChart } from 'lucide-react';

const Cookies = () => {
    const navigate = useNavigate();

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            color: '#f8fafc',
            padding: '2rem'
        }}>
            <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                <button
                    onClick={() => navigate('/')}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        background: 'none',
                        border: 'none',
                        color: '#94a3b8',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        marginBottom: '2rem'
                    }}
                >
                    <ArrowLeft size={20} />
                    Retour
                </button>

                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <Cookie size={60} style={{ color: '#3b82f6', marginBottom: '1rem' }} />
                    <h1 style={{
                        fontSize: '3rem',
                        fontWeight: 900,
                        marginBottom: '1rem',
                        background: 'linear-gradient(135deg, #f8fafc 0%, #cbd5e1 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>
                        Politique des Cookies
                    </h1>
                    <p style={{ color: '#94a3b8' }}>
                        Dernière mise à jour : 12 février 2026
                    </p>
                </div>

                <div style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '1rem',
                    padding: '2rem',
                    marginBottom: '2rem'
                }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>
                        Qu'est-ce qu'un cookie ?
                    </h2>
                    <p style={{ color: '#cbd5e1', lineHeight: 1.8 }}>
                        Un cookie est un petit fichier texte stocké sur votre appareil lorsque vous visitez un site web. 
                        Les cookies nous permettent de reconnaître votre navigateur et de mémoriser vos préférences.
                    </p>
                </div>

                <div style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '1rem',
                    padding: '2rem',
                    marginBottom: '2rem'
                }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Shield size={24} color="#3b82f6" />
                        Cookies essentiels
                    </h2>
                    <p style={{ color: '#cbd5e1', lineHeight: 1.8, marginBottom: '1rem' }}>
                        Ces cookies sont nécessaires au fonctionnement du site et ne peuvent pas être désactivés :
                    </p>
                    <ul style={{ color: '#cbd5e1', lineHeight: 1.8, paddingLeft: '1.5rem' }}>
                        <li>Authentification et sécurité</li>
                        <li>Gestion de session</li>
                        <li>Préférences de langue</li>
                        <li>Protection CSRF</li>
                    </ul>
                </div>

                <div style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '1rem',
                    padding: '2rem',
                    marginBottom: '2rem'
                }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Settings size={24} color="#3b82f6" />
                        Cookies de fonctionnalité
                    </h2>
                    <p style={{ color: '#cbd5e1', lineHeight: 1.8, marginBottom: '1rem' }}>
                        Ces cookies améliorent votre expérience utilisateur :
                    </p>
                    <ul style={{ color: '#cbd5e1', lineHeight: 1.8, paddingLeft: '1.5rem' }}>
                        <li>Mémorisation de vos préférences d'affichage</li>
                        <li>Thème sombre/clair</li>
                        <li>Paramètres de zoom</li>
                        <li>Dernières recherches</li>
                    </ul>
                </div>

                <div style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '1rem',
                    padding: '2rem',
                    marginBottom: '2rem'
                }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <BarChart size={24} color="#3b82f6" />
                        Cookies analytiques
                    </h2>
                    <p style={{ color: '#cbd5e1', lineHeight: 1.8, marginBottom: '1rem' }}>
                        Ces cookies nous aident à comprendre comment vous utilisez notre site :
                    </p>
                    <ul style={{ color: '#cbd5e1', lineHeight: 1.8, paddingLeft: '1.5rem' }}>
                        <li>Pages visitées</li>
                        <li>Temps passé sur le site</li>
                        <li>Fonctionnalités utilisées</li>
                        <li>Erreurs rencontrées</li>
                    </ul>
                    <p style={{ color: '#cbd5e1', lineHeight: 1.8, marginTop: '1rem', fontStyle: 'italic' }}>
                        Ces données sont anonymisées et ne permettent pas de vous identifier personnellement.
                    </p>
                </div>

                <div style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '1rem',
                    padding: '2rem',
                    marginBottom: '2rem'
                }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>
                        Gestion des cookies
                    </h2>
                    <p style={{ color: '#cbd5e1', lineHeight: 1.8, marginBottom: '1rem' }}>
                        Vous pouvez contrôler et gérer les cookies de plusieurs façons :
                    </p>
                    <ul style={{ color: '#cbd5e1', lineHeight: 1.8, paddingLeft: '1.5rem' }}>
                        <li>Via les paramètres de votre navigateur</li>
                        <li>En utilisant notre centre de préférences cookies</li>
                        <li>En refusant les cookies non essentiels lors de votre première visite</li>
                    </ul>
                    <p style={{ color: '#cbd5e1', lineHeight: 1.8, marginTop: '1rem' }}>
                        Note : La désactivation de certains cookies peut affecter le fonctionnement du site.
                    </p>
                </div>

                <div style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '1rem',
                    padding: '2rem',
                    marginBottom: '2rem'
                }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>
                        Durée de conservation
                    </h2>
                    <p style={{ color: '#cbd5e1', lineHeight: 1.8 }}>
                        La durée de conservation des cookies varie selon leur type :
                    </p>
                    <ul style={{ color: '#cbd5e1', lineHeight: 1.8, paddingLeft: '1.5rem', marginTop: '1rem' }}>
                        <li>Cookies de session : supprimés à la fermeture du navigateur</li>
                        <li>Cookies de fonctionnalité : 1 an</li>
                        <li>Cookies analytiques : 2 ans</li>
                    </ul>
                </div>

                <div style={{
                    background: 'rgba(59, 130, 246, 0.1)',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    borderRadius: '1rem',
                    padding: '2rem',
                    textAlign: 'center'
                }}>
                    <Cookie size={40} style={{ color: '#3b82f6', marginBottom: '1rem' }} />
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                        Gérer vos préférences
                    </h3>
                    <p style={{ color: '#94a3b8', marginBottom: '1.5rem' }}>
                        Accédez aux paramètres pour personnaliser vos préférences de cookies
                    </p>
                    <button
                        onClick={() => navigate('/settings')}
                        style={{
                            padding: '1rem 2rem',
                            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                            border: 'none',
                            borderRadius: '0.75rem',
                            color: '#fff',
                            fontSize: '1rem',
                            fontWeight: 600,
                            cursor: 'pointer'
                        }}
                    >
                        Paramètres des cookies
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Cookies;
