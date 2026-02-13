import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Zap, Shield, Users, Database, BarChart3, Globe, Cpu, Lock } from 'lucide-react';

const Features = () => {
    const navigate = useNavigate();

    const features = [
        {
            icon: <Database size={40} />,
            title: 'Munin Atlas',
            description: 'Encyclopédie scientifique complète avec plus de 250 disciplines référencées',
            details: ['Base de connaissances exhaustive', 'Recherche avancée', 'Comparaison d\'entités']
        },
        {
            icon: <Users size={40} />,
            title: 'Hugin Core',
            description: 'Gestion complète de votre laboratoire',
            details: ['Messagerie interne', 'Planning partagé', 'Gestion documentaire', 'Inventaire']
        },
        {
            icon: <BarChart3 size={40} />,
            title: 'Hugin Lab',
            description: 'Outils spécialisés pour la recherche',
            details: ['Suivi de cultures', 'Cahier de laboratoire', 'Gestion des stocks', 'Recherche scientifique']
        },
        {
            icon: <Cpu size={40} />,
            title: 'Hugin Analysis',
            description: 'Analyses avancées et visualisation',
            details: ['Spectrométrie', 'Cytométrie en flux', 'Analyse cinétique', 'Électrophorèse']
        },
        {
            icon: <Shield size={40} />,
            title: 'Sécurité',
            description: 'Protection maximale de vos données',
            details: ['Cryptage AES-256', 'Authentification sécurisée', 'Sauvegardes automatiques']
        },
        {
            icon: <Globe size={40} />,
            title: 'Collaboration',
            description: 'Travaillez en équipe efficacement',
            details: ['Partage de documents', 'Visioconférence', 'Gestion de projets']
        },
        {
            icon: <Zap size={40} />,
            title: 'Performance',
            description: 'Interface rapide et réactive',
            details: ['Chargement instantané', 'Synchronisation temps réel', 'Mode hors ligne']
        },
        {
            icon: <Lock size={40} />,
            title: 'Conformité',
            description: 'Respect des normes et réglementations',
            details: ['RGPD compliant', 'Traçabilité complète', 'Audit logs']
        }
    ];

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            color: '#f8fafc',
            padding: '2rem'
        }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
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

                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <h1 style={{
                        fontSize: '3rem',
                        fontWeight: 900,
                        marginBottom: '1rem',
                        background: 'linear-gradient(135deg, #f8fafc 0%, #cbd5e1 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>
                        Fonctionnalités
                    </h1>
                    <p style={{ fontSize: '1.25rem', color: '#94a3b8' }}>
                        Découvrez tous les outils pour optimiser votre recherche scientifique
                    </p>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '2rem'
                }}>
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            style={{
                                background: 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: '1rem',
                                padding: '2rem',
                                transition: 'all 0.3s'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-8px)';
                                e.currentTarget.style.borderColor = '#3b82f6';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                            }}
                        >
                            <div style={{ color: '#3b82f6', marginBottom: '1rem' }}>
                                {feature.icon}
                            </div>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                                {feature.title}
                            </h3>
                            <p style={{ color: '#94a3b8', marginBottom: '1rem' }}>
                                {feature.description}
                            </p>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                {feature.details.map((detail, i) => (
                                    <li key={i} style={{
                                        color: '#cbd5e1',
                                        fontSize: '0.9rem',
                                        marginBottom: '0.5rem',
                                        paddingLeft: '1.5rem',
                                        position: 'relative'
                                    }}>
                                        <span style={{
                                            position: 'absolute',
                                            left: 0,
                                            color: '#10b981'
                                        }}>✓</span>
                                        {detail}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Features;
