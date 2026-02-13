import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Lock, Eye, Database, UserCheck, FileText } from 'lucide-react';

const Privacy = () => {
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
                    <Shield size={60} style={{ color: '#3b82f6', marginBottom: '1rem' }} />
                    <h1 style={{
                        fontSize: '3rem',
                        fontWeight: 900,
                        marginBottom: '1rem',
                        background: 'linear-gradient(135deg, #f8fafc 0%, #cbd5e1 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>
                        Politique de Confidentialité
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
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Database size={24} color="#3b82f6" />
                        Collecte des données
                    </h2>
                    <p style={{ color: '#cbd5e1', lineHeight: 1.8, marginBottom: '1rem' }}>
                        Nous collectons uniquement les données nécessaires au fonctionnement de nos services :
                    </p>
                    <ul style={{ color: '#cbd5e1', lineHeight: 1.8, paddingLeft: '1.5rem' }}>
                        <li>Informations d'identification (nom, email, téléphone)</li>
                        <li>Données d'utilisation de la plateforme</li>
                        <li>Données scientifiques que vous choisissez de stocker</li>
                        <li>Informations de facturation</li>
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
                        <Lock size={24} color="#3b82f6" />
                        Protection des données
                    </h2>
                    <p style={{ color: '#cbd5e1', lineHeight: 1.8, marginBottom: '1rem' }}>
                        Vos données sont protégées par des mesures de sécurité de niveau entreprise :
                    </p>
                    <ul style={{ color: '#cbd5e1', lineHeight: 1.8, paddingLeft: '1.5rem' }}>
                        <li>Cryptage AES-256 pour toutes les données sensibles</li>
                        <li>Authentification multi-facteurs disponible</li>
                        <li>Sauvegardes automatiques quotidiennes</li>
                        <li>Serveurs sécurisés en Europe</li>
                        <li>Conformité RGPD</li>
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
                        <Eye size={24} color="#3b82f6" />
                        Utilisation des données
                    </h2>
                    <p style={{ color: '#cbd5e1', lineHeight: 1.8, marginBottom: '1rem' }}>
                        Nous utilisons vos données uniquement pour :
                    </p>
                    <ul style={{ color: '#cbd5e1', lineHeight: 1.8, paddingLeft: '1.5rem' }}>
                        <li>Fournir et améliorer nos services</li>
                        <li>Vous contacter concernant votre compte</li>
                        <li>Assurer la sécurité de la plateforme</li>
                        <li>Respecter nos obligations légales</li>
                    </ul>
                    <p style={{ color: '#cbd5e1', lineHeight: 1.8, marginTop: '1rem', fontWeight: 600 }}>
                        Nous ne vendons jamais vos données à des tiers.
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
                        <UserCheck size={24} color="#3b82f6" />
                        Vos droits
                    </h2>
                    <p style={{ color: '#cbd5e1', lineHeight: 1.8, marginBottom: '1rem' }}>
                        Conformément au RGPD, vous disposez des droits suivants :
                    </p>
                    <ul style={{ color: '#cbd5e1', lineHeight: 1.8, paddingLeft: '1.5rem' }}>
                        <li>Droit d'accès à vos données personnelles</li>
                        <li>Droit de rectification de vos données</li>
                        <li>Droit à l'effacement (droit à l'oubli)</li>
                        <li>Droit à la portabilité de vos données</li>
                        <li>Droit d'opposition au traitement</li>
                    </ul>
                    <p style={{ color: '#cbd5e1', lineHeight: 1.8, marginTop: '1rem' }}>
                        Pour exercer ces droits, contactez-nous à : <a href="mailto:privacy@odin-la-science.com" style={{ color: '#3b82f6' }}>privacy@odin-la-science.com</a>
                    </p>
                </div>

                <div style={{
                    background: 'rgba(59, 130, 246, 0.1)',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    borderRadius: '1rem',
                    padding: '2rem',
                    textAlign: 'center'
                }}>
                    <FileText size={40} style={{ color: '#3b82f6', marginBottom: '1rem' }} />
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                        Questions sur la confidentialité ?
                    </h3>
                    <p style={{ color: '#94a3b8', marginBottom: '1.5rem' }}>
                        Notre équipe est à votre disposition pour répondre à toutes vos questions
                    </p>
                    <button
                        onClick={() => navigate('/support')}
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
                        Nous contacter
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Privacy;
