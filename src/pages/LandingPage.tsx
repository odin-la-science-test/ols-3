import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Beaker, BookOpen, Activity, Database,
    ChevronRight, Sparkles, ArrowRight,
    Play, Zap, Shield, Users, TrendingUp,
    CheckCircle, Star, Award, Target,
    Microscope, FlaskConical, Dna, Brain
} from 'lucide-react';

const LandingPage = () => {
    const navigate = useNavigate();
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const features = [
        {
            icon: <BookOpen size={24} />,
            title: 'Munin Atlas',
            description: 'Encyclopédie scientifique complète avec des milliers d\'entités référencées',
            color: '#10b981'
        },
        {
            icon: <Beaker size={24} />,
            title: 'Hugin Lab',
            description: 'Gestion de cultures, suivi d\'expériences et cahier de laboratoire numérique',
            color: '#6366f1'
        },
        {
            icon: <Activity size={24} />,
            title: 'Analyse Avancée',
            description: 'Spectrométrie, cytométrie et analyse de données en temps réel',
            color: '#8b5cf6'
        },
        {
            icon: <Database size={24} />,
            title: 'Gestion de Données',
            description: 'Stockage sécurisé et organisation intelligente de vos résultats',
            color: '#3b82f6'
        }
    ];

    const benefits = [
        {
            icon: <Zap size={32} />,
            title: 'Gain de temps',
            description: 'Automatisez vos tâches répétitives et concentrez-vous sur la recherche',
            color: '#f59e0b'
        },
        {
            icon: <Shield size={32} />,
            title: 'Sécurité maximale',
            description: 'Vos données sont cryptées et sauvegardées en temps réel',
            color: '#10b981'
        },
        {
            icon: <Users size={32} />,
            title: 'Collaboration',
            description: 'Travaillez en équipe avec des outils de partage avancés',
            color: '#6366f1'
        },
        {
            icon: <TrendingUp size={32} />,
            title: 'Adaptable mobile',
            description: 'Accédez à vos données depuis n\'importe quel appareil, partout',
            color: '#8b5cf6'
        }
    ];

    const modules = [
        {
            icon: <Microscope size={40} />,
            title: 'CryoKeeper',
            description: 'Gestion complète de vos échantillons cryogéniques',
            features: ['Suivi température', 'Inventaire automatique', 'Alertes en temps réel']
        },
        {
            icon: <FlaskConical size={40} />,
            title: 'CultureTracking',
            description: 'Suivi précis de vos cultures microbiennes',
            features: ['Courbes de croissance', 'Protocoles intégrés', 'Export automatique']
        },
        {
            icon: <Dna size={40} />,
            title: 'SequenceLens',
            description: 'Analyse et visualisation de séquences génétiques',
            features: ['Alignement multiple', 'Annotation automatique', 'Phylogénie']
        },
        {
            icon: <Brain size={40} />,
            title: 'Excel Lab',
            description: 'Tableur scientifique avec graphiques avancés',
            features: ['Formules scientifiques', 'Graphiques interactifs', 'Multi-sélection']
        }
    ];

    const testimonials = [
        {
            name: 'Dr. Marie Dubois',
            role: 'Directrice de recherche, BioEcoAgro',
            content: 'Odin a transformé notre façon de travailler. Nous avons gagné 40% de temps sur la gestion administrative.',
            rating: 5
        },
        {
            name: 'Prof. Jean Martin',
            role: 'Chef de laboratoire, INRAE',
            content: 'La meilleure plateforme pour la recherche scientifique. Interface intuitive et fonctionnalités puissantes.',
            rating: 5
        },
        {
            name: 'Dr. Sophie Laurent',
            role: 'Chercheuse, C9',
            content: 'Indispensable pour notre équipe. Le suivi des cultures et l\'analyse de données sont remarquables.',
            rating: 5
        }
    ];

    const companies = [
        { name: 'BioEcoAgro', logo: '🌱' },
        { name: 'INRAE', logo: '🌾' },
        { name: 'C9', logo: '🧪' }
    ];

    const stats = [
        { value: '10K+', label: 'Chercheurs' },
        { value: '500+', label: 'Laboratoires' },
        { value: '1M+', label: 'Expériences' }
    ];

    return (
        <div style={{
            minHeight: '100vh',
            background: '#0b1120',
            color: '#f8fafc',
            fontFamily: 'Inter, system-ui, sans-serif',
            overflow: 'hidden'
        }}>

            <nav style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 100,
                background: scrollY > 50 ? 'rgba(11, 17, 32, 0.95)' : 'transparent',
                backdropFilter: scrollY > 50 ? 'blur(20px)' : 'none',
                borderBottom: scrollY > 50 ? '1px solid rgba(255,255,255,0.1)' : 'none',
                transition: 'all 0.3s ease',
                padding: '1rem 0'
            }}>
                <div style={{
                    maxWidth: '1400px',
                    margin: '0 auto',
                    padding: '0 2rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}
                         onClick={() => navigate('/')}>
                        <img src="/logo1.png" alt="Odin" style={{ height: '40px' }} />
                        <span style={{
                            fontSize: '1.5rem',
                            fontWeight: 800,
                            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}>
                            Odin la Science
                        </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                        <a href="#features" style={{ color: '#94a3b8', textDecoration: 'none', fontWeight: 500 }}>
                            Fonctionnalités
                        </a>
                        <a href="#pricing" style={{ color: '#94a3b8', textDecoration: 'none', fontWeight: 500 }}>
                            Tarifs
                        </a>
                        <button
                            onClick={() => navigate('/login')}
                            style={{
                                padding: '0.5rem 1rem',
                                background: 'transparent',
                                border: '1px solid rgba(255,255,255,0.2)',
                                borderRadius: '0.5rem',
                                color: '#f8fafc',
                                cursor: 'pointer',
                                fontWeight: 600
                            }}
                        >
                            Connexion
                        </button>
                        <button
                            onClick={() => navigate('/register')}
                            style={{
                                padding: '0.5rem 1.5rem',
                                background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                                border: 'none',
                                borderRadius: '0.5rem',
                                color: '#fff',
                                cursor: 'pointer',
                                fontWeight: 700,
                                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)'
                            }}
                        >
                            Inscription
                        </button>
                    </div>
                </div>
            </nav>

            <section style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                position: 'relative',
                overflow: 'hidden',
                paddingTop: '80px'
            }}>
                <div style={{
                    position: 'absolute',
                    top: '10%',
                    left: '5%',
                    width: '500px',
                    height: '500px',
                    background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)',
                    filter: 'blur(80px)',
                    animation: 'float 8s ease-in-out infinite'
                }} />
                <div style={{
                    position: 'absolute',
                    bottom: '10%',
                    right: '5%',
                    width: '400px',
                    height: '400px',
                    background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)',
                    filter: 'blur(80px)',
                    animation: 'float 10s ease-in-out infinite reverse'
                }} />

                <div style={{
                    maxWidth: '1400px',
                    margin: '0 auto',
                    padding: '0 2rem',
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '4rem',
                    alignItems: 'center',
                    position: 'relative',
                    zIndex: 1
                }}>
                    <div>
                        <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.5rem 1rem',
                            background: 'rgba(59, 130, 246, 0.1)',
                            border: '1px solid rgba(59, 130, 246, 0.3)',
                            borderRadius: '2rem',
                            marginBottom: '2rem',
                            fontSize: '0.9rem',
                            fontWeight: 600
                        }}>
                            <Sparkles size={16} color="#3b82f6" />
                            Plateforme scientifique nouvelle génération
                        </div>

                        <h1 style={{
                            fontSize: '4rem',
                            fontWeight: 900,
                            lineHeight: 1.1,
                            marginBottom: '1.5rem',
                            background: 'linear-gradient(135deg, #f8fafc 0%, #cbd5e1 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}>
                            La science à portée de main
                        </h1>

                        <p style={{
                            fontSize: '1.25rem',
                            color: '#94a3b8',
                            lineHeight: 1.6,
                            marginBottom: '2.5rem'
                        }}>
                            Odin révolutionne la recherche scientifique avec des outils puissants pour 
                            gérer vos expériences, analyser vos données et collaborer avec votre équipe.
                        </p>

                        <div style={{ display: 'flex', gap: '1rem', marginBottom: '3rem' }}>
                            <button
                                onClick={() => navigate('/register')}
                                style={{
                                    padding: '1rem 2rem',
                                    background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                                    border: 'none',
                                    borderRadius: '0.75rem',
                                    color: '#fff',
                                    fontSize: '1.1rem',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    boxShadow: '0 8px 24px rgba(59, 130, 246, 0.4)',
                                    transition: 'transform 0.2s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                            >
                                S'inscrire
                                <ArrowRight size={20} />
                            </button>
                            <button
                                style={{
                                    padding: '1rem 2rem',
                                    background: 'rgba(255, 255, 255, 0.05)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    borderRadius: '0.75rem',
                                    color: '#f8fafc',
                                    fontSize: '1.1rem',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem'
                                }}
                            >
                                <Play size={20} />
                                Voir la démo
                            </button>
                        </div>

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(3, 1fr)',
                            gap: '2rem',
                            paddingTop: '2rem',
                            borderTop: '1px solid rgba(255, 255, 255, 0.1)'
                        }}>
                            {stats.map((stat, i) => (
                                <div key={i}>
                                    <div style={{
                                        fontSize: '2rem',
                                        fontWeight: 800,
                                        color: '#3b82f6',
                                        marginBottom: '0.25rem'
                                    }}>
                                        {stat.value}
                                    </div>
                                    <div style={{ fontSize: '0.9rem', color: '#64748b' }}>
                                        {stat.label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: '1rem',
                        position: 'relative'
                    }}>
                        <div style={{
                            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.05))',
                            border: '1px solid rgba(16, 185, 129, 0.2)',
                            borderRadius: '1.5rem',
                            padding: '2rem',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            textAlign: 'center',
                            aspectRatio: '1',
                            animation: 'fadeInUp 0.6s ease-out'
                        }}>
                            <BookOpen size={48} color="#10b981" style={{ marginBottom: '1rem' }} />
                            <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>Munin</div>
                            <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '0.5rem' }}>
                                Atlas Scientifique
                            </div>
                        </div>

                        <div style={{
                            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(99, 102, 241, 0.05))',
                            border: '1px solid rgba(99, 102, 241, 0.2)',
                            borderRadius: '1.5rem',
                            padding: '2rem',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            textAlign: 'center',
                            aspectRatio: '1',
                            animation: 'fadeInUp 0.6s ease-out 0.1s',
                            animationFillMode: 'backwards'
                        }}>
                            <Beaker size={48} color="#6366f1" style={{ marginBottom: '1rem' }} />
                            <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>Hugin</div>
                            <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '0.5rem' }}>
                                Gestion Lab
                            </div>
                        </div>

                        <div style={{
                            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(139, 92, 246, 0.05))',
                            border: '1px solid rgba(139, 92, 246, 0.2)',
                            borderRadius: '1.5rem',
                            padding: '2rem',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            textAlign: 'center',
                            aspectRatio: '1',
                            animation: 'fadeInUp 0.6s ease-out 0.2s',
                            animationFillMode: 'backwards'
                        }}>
                            <Activity size={48} color="#8b5cf6" style={{ marginBottom: '1rem' }} />
                            <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>Analyse</div>
                            <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '0.5rem' }}>
                                Données Avancées
                            </div>
                        </div>

                        <div style={{
                            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(59, 130, 246, 0.05))',
                            border: '1px solid rgba(59, 130, 246, 0.2)',
                            borderRadius: '1.5rem',
                            padding: '2rem',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            textAlign: 'center',
                            aspectRatio: '1',
                            animation: 'fadeInUp 0.6s ease-out 0.3s',
                            animationFillMode: 'backwards'
                        }}>
                            <Database size={48} color="#3b82f6" style={{ marginBottom: '1rem' }} />
                            <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>Stockage</div>
                            <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '0.5rem' }}>
                                Cloud Sécurisé
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section style={{
                padding: '4rem 2rem',
                background: 'rgba(255, 255, 255, 0.02)',
                borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
            }}>
                <div style={{ maxWidth: '1400px', margin: '0 auto', textAlign: 'center' }}>
                    <p style={{ color: '#64748b', marginBottom: '2rem', fontSize: '0.9rem', fontWeight: 600 }}>
                        Ils nous font confiance
                    </p>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '4rem',
                        flexWrap: 'wrap'
                    }}>
                        {companies.map((company, i) => (
                            <div key={i} style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                opacity: 0.6,
                                transition: 'opacity 0.3s'
                            }}>
                                <span style={{ fontSize: '2rem' }}>{company.logo}</span>
                                <span style={{ fontSize: '1.25rem', fontWeight: 700 }}>{company.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section id="features" style={{
                padding: '8rem 2rem',
                position: 'relative'
            }}>
                <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
                        <h2 style={{
                            fontSize: '3rem',
                            fontWeight: 900,
                            marginBottom: '1rem',
                            background: 'linear-gradient(135deg, #f8fafc 0%, #cbd5e1 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}>
                            Tout ce dont vous avez besoin
                        </h2>
                        <p style={{ fontSize: '1.25rem', color: '#94a3b8' }}>
                            Des outils puissants pour accélérer votre recherche
                        </p>
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: '2rem'
                    }}>
                        {features.map((feature, i) => (
                            <div key={i} style={{
                                background: 'rgba(255, 255, 255, 0.02)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: '1.5rem',
                                padding: '2.5rem',
                                transition: 'all 0.3s',
                                cursor: 'pointer'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-4px)';
                                e.currentTarget.style.borderColor = feature.color;
                                e.currentTarget.style.boxShadow = `0 12px 24px ${feature.color}22`;
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}>
                                <div style={{
                                    width: '56px',
                                    height: '56px',
                                    borderRadius: '1rem',
                                    background: `${feature.color}15`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginBottom: '1.5rem'
                                }}>
                                    {React.cloneElement(feature.icon, { color: feature.color })}
                                </div>
                                <h3 style={{
                                    fontSize: '1.5rem',
                                    fontWeight: 700,
                                    marginBottom: '0.75rem'
                                }}>
                                    {feature.title}
                                </h3>
                                <p style={{
                                    color: '#94a3b8',
                                    lineHeight: 1.6
                                }}>
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section style={{
                padding: '8rem 2rem',
                background: 'rgba(255, 255, 255, 0.02)',
                borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
            }}>
                <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
                        <h2 style={{
                            fontSize: '3rem',
                            fontWeight: 900,
                            marginBottom: '1rem',
                            background: 'linear-gradient(135deg, #f8fafc 0%, #cbd5e1 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}>
                            Pourquoi choisir Odin ?
                        </h2>
                        <p style={{ fontSize: '1.25rem', color: '#94a3b8' }}>
                            Des avantages concrets pour votre laboratoire
                        </p>
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(4, 1fr)',
                        gap: '2rem'
                    }}>
                        {benefits.map((benefit, i) => (
                            <div key={i} style={{
                                textAlign: 'center',
                                padding: '2rem',
                                background: 'rgba(255, 255, 255, 0.02)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: '1.5rem',
                                transition: 'all 0.3s'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-8px)';
                                e.currentTarget.style.borderColor = benefit.color;
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                            }}>
                                <div style={{
                                    width: '80px',
                                    height: '80px',
                                    borderRadius: '50%',
                                    background: `${benefit.color}15`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto 1.5rem'
                                }}>
                                    {React.cloneElement(benefit.icon, { color: benefit.color })}
                                </div>
                                <h3 style={{
                                    fontSize: '1.25rem',
                                    fontWeight: 700,
                                    marginBottom: '0.75rem'
                                }}>
                                    {benefit.title}
                                </h3>
                                <p style={{
                                    color: '#94a3b8',
                                    fontSize: '0.95rem',
                                    lineHeight: 1.6
                                }}>
                                    {benefit.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section style={{
                padding: '8rem 2rem',
                position: 'relative'
            }}>
                <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
                        <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.5rem 1rem',
                            background: 'rgba(139, 92, 246, 0.1)',
                            border: '1px solid rgba(139, 92, 246, 0.3)',
                            borderRadius: '2rem',
                            marginBottom: '1.5rem',
                            fontSize: '0.9rem',
                            fontWeight: 600
                        }}>
                            <Award size={16} color="#8b5cf6" />
                            Modules spécialisés
                        </div>
                        <h2 style={{
                            fontSize: '3rem',
                            fontWeight: 900,
                            marginBottom: '1rem',
                            background: 'linear-gradient(135deg, #f8fafc 0%, #cbd5e1 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}>
                            Des outils pour chaque besoin
                        </h2>
                        <p style={{ fontSize: '1.25rem', color: '#94a3b8' }}>
                            Plus de 40 modules intégrés pour couvrir tous vos besoins scientifiques
                        </p>
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: '2rem'
                    }}>
                        {modules.map((module, i) => (
                            <div key={i} style={{
                                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05), rgba(139, 92, 246, 0.05))',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: '1.5rem',
                                padding: '2.5rem',
                                transition: 'all 0.3s',
                                cursor: 'pointer'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'scale(1.02)';
                                e.currentTarget.style.borderColor = '#8b5cf6';
                                e.currentTarget.style.boxShadow = '0 20px 40px rgba(139, 92, 246, 0.2)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'scale(1)';
                                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}>
                                <div style={{
                                    width: '80px',
                                    height: '80px',
                                    borderRadius: '1.25rem',
                                    background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginBottom: '1.5rem',
                                    boxShadow: '0 8px 16px rgba(59, 130, 246, 0.3)'
                                }}>
                                    {React.cloneElement(module.icon, { color: '#fff' })}
                                </div>
                                <h3 style={{
                                    fontSize: '1.75rem',
                                    fontWeight: 700,
                                    marginBottom: '0.75rem'
                                }}>
                                    {module.title}
                                </h3>
                                <p style={{
                                    color: '#94a3b8',
                                    lineHeight: 1.6,
                                    marginBottom: '1.5rem'
                                }}>
                                    {module.description}
                                </p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    {module.features.map((feat, j) => (
                                        <div key={j} style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            color: '#cbd5e1',
                                            fontSize: '0.95rem'
                                        }}>
                                            <CheckCircle size={18} color="#10b981" />
                                            {feat}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section style={{
                padding: '8rem 2rem',
                background: 'rgba(255, 255, 255, 0.02)',
                borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
            }}>
                <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
                        <h2 style={{
                            fontSize: '3rem',
                            fontWeight: 900,
                            marginBottom: '1rem',
                            background: 'linear-gradient(135deg, #f8fafc 0%, #cbd5e1 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}>
                            Ils nous font confiance
                        </h2>
                        <p style={{ fontSize: '1.25rem', color: '#94a3b8' }}>
                            Découvrez ce que nos utilisateurs disent d'Odin
                        </p>
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '2rem'
                    }}>
                        {testimonials.map((testimonial, i) => (
                            <div key={i} style={{
                                background: 'rgba(255, 255, 255, 0.02)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: '1.5rem',
                                padding: '2rem',
                                transition: 'all 0.3s'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-4px)';
                                e.currentTarget.style.borderColor = '#3b82f6';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                            }}>
                                <div style={{
                                    display: 'flex',
                                    gap: '0.25rem',
                                    marginBottom: '1.5rem'
                                }}>
                                    {[...Array(testimonial.rating)].map((_, j) => (
                                        <Star key={j} size={20} fill="#f59e0b" color="#f59e0b" />
                                    ))}
                                </div>
                                <p style={{
                                    color: '#cbd5e1',
                                    lineHeight: 1.7,
                                    marginBottom: '1.5rem',
                                    fontSize: '1.05rem'
                                }}>
                                    "{testimonial.content}"
                                </p>
                                <div style={{
                                    paddingTop: '1rem',
                                    borderTop: '1px solid rgba(255, 255, 255, 0.1)'
                                }}>
                                    <div style={{
                                        fontWeight: 700,
                                        marginBottom: '0.25rem'
                                    }}>
                                        {testimonial.name}
                                    </div>
                                    <div style={{
                                        color: '#64748b',
                                        fontSize: '0.9rem'
                                    }}>
                                        {testimonial.role}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section id="pricing" style={{
                padding: '8rem 2rem',
                position: 'relative'
            }}>
                <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
                        <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.5rem 1rem',
                            background: 'rgba(16, 185, 129, 0.1)',
                            border: '1px solid rgba(16, 185, 129, 0.3)',
                            borderRadius: '2rem',
                            marginBottom: '1.5rem',
                            fontSize: '0.9rem',
                            fontWeight: 600
                        }}>
                            <TrendingUp size={16} color="#10b981" />
                            Tarifs transparents
                        </div>
                        <h2 style={{
                            fontSize: '3rem',
                            fontWeight: 900,
                            marginBottom: '1rem',
                            background: 'linear-gradient(135deg, #f8fafc 0%, #cbd5e1 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}>
                            Choisissez votre formule
                        </h2>
                        <p style={{ fontSize: '1.25rem', color: '#94a3b8' }}>
                            Des plans adaptés à tous les besoins, du chercheur individuel au laboratoire complet
                        </p>
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '2rem',
                        marginBottom: '3rem'
                    }}>
                        <div style={{
                            background: 'rgba(255, 255, 255, 0.02)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '1.5rem',
                            padding: '2.5rem',
                            transition: 'all 0.3s',
                            display: 'flex',
                            flexDirection: 'column'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-8px)';
                            e.currentTarget.style.borderColor = '#64748b';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                        }}>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <h3 style={{
                                    fontSize: '1.5rem',
                                    fontWeight: 700,
                                    marginBottom: '0.5rem',
                                    color: '#94a3b8'
                                }}>
                                    Munin Atlas
                                </h3>
                                <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
                                    Encyclopédie scientifique
                                </p>
                            </div>
                            <div style={{ marginBottom: '2rem' }}>
                                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                                    <span style={{
                                        fontSize: '3rem',
                                        fontWeight: 900,
                                        color: '#f8fafc'
                                    }}>
                                        250€
                                    </span>
                                    <span style={{ color: '#64748b', fontSize: '1rem' }}>
                                        /mois
                                    </span>
                                </div>
                            </div>
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '1rem',
                                marginBottom: '2rem',
                                flex: 1
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <CheckCircle size={20} color="#10b981" />
                                    <span style={{ color: '#cbd5e1' }}>Encyclopédie scientifique complète</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <CheckCircle size={20} color="#10b981" />
                                    <span style={{ color: '#cbd5e1' }}>Gestion des entités</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <CheckCircle size={20} color="#10b981" />
                                    <span style={{ color: '#cbd5e1' }}>Base de connaissances</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <CheckCircle size={20} color="#10b981" />
                                    <span style={{ color: '#cbd5e1' }}>Support par email</span>
                                </div>
                            </div>
                            <button
                                onClick={() => navigate('/register')}
                                style={{
                                    padding: '1rem',
                                    background: 'rgba(255, 255, 255, 0.05)',
                                    border: '1px solid rgba(255, 255, 255, 0.2)',
                                    borderRadius: '0.75rem',
                                    color: '#f8fafc',
                                    fontSize: '1rem',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                                }}
                            >
                                Commencer
                            </button>
                        </div>

                        <div style={{
                            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1))',
                            border: '2px solid #3b82f6',
                            borderRadius: '1.5rem',
                            padding: '2.5rem',
                            transition: 'all 0.3s',
                            display: 'flex',
                            flexDirection: 'column',
                            position: 'relative',
                            transform: 'scale(1.05)'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'scale(1.08) translateY(-8px)';
                            e.currentTarget.style.boxShadow = '0 20px 40px rgba(59, 130, 246, 0.3)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scale(1.05) translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                        }}>
                            <div style={{
                                position: 'absolute',
                                top: '-12px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                padding: '0.5rem 1.5rem',
                                background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                                borderRadius: '2rem',
                                fontSize: '0.8rem',
                                fontWeight: 700,
                                color: '#fff',
                                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)'
                            }}>
                                ⭐ POPULAIRE
                            </div>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <h3 style={{
                                    fontSize: '1.5rem',
                                    fontWeight: 700,
                                    marginBottom: '0.5rem',
                                    color: '#3b82f6'
                                }}>
                                    Pack Complet
                                </h3>
                                <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                                    Tous les modules inclus
                                </p>
                            </div>
                            <div style={{ marginBottom: '2rem' }}>
                                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                                    <span style={{
                                        fontSize: '3rem',
                                        fontWeight: 900,
                                        color: '#f8fafc'
                                    }}>
                                        2600€
                                    </span>
                                    <span style={{ color: '#94a3b8', fontSize: '1rem' }}>
                                        /mois
                                    </span>
                                </div>
                            </div>
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '1rem',
                                marginBottom: '2rem',
                                flex: 1
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <CheckCircle size={20} color="#10b981" />
                                    <span style={{ color: '#cbd5e1', fontWeight: 600 }}>Munin Atlas</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <CheckCircle size={20} color="#10b981" />
                                    <span style={{ color: '#cbd5e1' }}>Hugin Core (Messagerie, Planning, Documents)</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <CheckCircle size={20} color="#10b981" />
                                    <span style={{ color: '#cbd5e1' }}>Hugin Lab (Cultures, Recherches, Stocks)</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <CheckCircle size={20} color="#10b981" />
                                    <span style={{ color: '#cbd5e1' }}>Hugin Analysis (Spectrométrie, Cytométrie)</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <CheckCircle size={20} color="#10b981" />
                                    <span style={{ color: '#cbd5e1' }}>Support prioritaire 24/7</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <CheckCircle size={20} color="#10b981" />
                                    <span style={{ color: '#cbd5e1' }}>API & intégrations</span>
                                </div>
                            </div>
                            <button
                                onClick={() => navigate('/register')}
                                style={{
                                    padding: '1rem',
                                    background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                                    border: 'none',
                                    borderRadius: '0.75rem',
                                    color: '#fff',
                                    fontSize: '1rem',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    boxShadow: '0 8px 16px rgba(59, 130, 246, 0.4)',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.boxShadow = '0 12px 24px rgba(59, 130, 246, 0.5)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 8px 16px rgba(59, 130, 246, 0.4)';
                                }}
                            >
                                Commencer l'essai gratuit
                            </button>
                        </div>

                        <div style={{
                            background: 'rgba(255, 255, 255, 0.02)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '1.5rem',
                            padding: '2.5rem',
                            transition: 'all 0.3s',
                            display: 'flex',
                            flexDirection: 'column'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-8px)';
                            e.currentTarget.style.borderColor = '#8b5cf6';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                        }}>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <h3 style={{
                                    fontSize: '1.5rem',
                                    fontWeight: 700,
                                    marginBottom: '0.5rem',
                                    color: '#8b5cf6'
                                }}>
                                    Enterprise
                                </h3>
                                <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
                                    Pour les grands laboratoires
                                </p>
                            </div>
                            <div style={{ marginBottom: '2rem' }}>
                                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                                    <span style={{
                                        fontSize: '2rem',
                                        fontWeight: 900,
                                        color: '#f8fafc'
                                    }}>
                                        Sur mesure
                                    </span>
                                </div>
                            </div>
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '1rem',
                                marginBottom: '2rem',
                                flex: 1
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <CheckCircle size={20} color="#10b981" />
                                    <span style={{ color: '#cbd5e1', fontWeight: 600 }}>Tout du plan Professional</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <CheckCircle size={20} color="#10b981" />
                                    <span style={{ color: '#cbd5e1' }}>Utilisateurs illimités</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <CheckCircle size={20} color="#10b981" />
                                    <span style={{ color: '#cbd5e1' }}>Stockage illimité</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <CheckCircle size={20} color="#10b981" />
                                    <span style={{ color: '#cbd5e1' }}>Modules personnalisés</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <CheckCircle size={20} color="#10b981" />
                                    <span style={{ color: '#cbd5e1' }}>Support dédié</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <CheckCircle size={20} color="#10b981" />
                                    <span style={{ color: '#cbd5e1' }}>Formation sur site</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <CheckCircle size={20} color="#10b981" />
                                    <span style={{ color: '#cbd5e1' }}>SLA garanti</span>
                                </div>
                            </div>
                            <button
                                onClick={() => navigate('/register')}
                                style={{
                                    padding: '1rem',
                                    background: 'rgba(139, 92, 246, 0.1)',
                                    border: '1px solid #8b5cf6',
                                    borderRadius: '0.75rem',
                                    color: '#8b5cf6',
                                    fontSize: '1rem',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'rgba(139, 92, 246, 0.2)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'rgba(139, 92, 246, 0.1)';
                                }}
                            >
                                Nous contacter
                            </button>
                        </div>
                    </div>

                    <div style={{
                        textAlign: 'center',
                        padding: '2rem',
                        background: 'rgba(16, 185, 129, 0.05)',
                        border: '1px solid rgba(16, 185, 129, 0.2)',
                        borderRadius: '1rem'
                    }}>
                        <p style={{ color: '#cbd5e1', fontSize: '1.05rem', marginBottom: '0.5rem' }}>
                            🎓 <strong>Tarif académique disponible</strong>
                        </p>
                        <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
                            -30% pour les institutions académiques et de recherche publique
                        </p>
                    </div>
                </div>
            </section>

            <section style={{
                padding: '8rem 2rem',
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1))',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '800px',
                    height: '800px',
                    background: 'radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, transparent 70%)',
                    filter: 'blur(100px)'
                }} />

                <div style={{
                    maxWidth: '900px',
                    margin: '0 auto',
                    textAlign: 'center',
                    position: 'relative',
                    zIndex: 1
                }}>
                    <h2 style={{
                        fontSize: '3.5rem',
                        fontWeight: 900,
                        marginBottom: '1.5rem',
                        background: 'linear-gradient(135deg, #f8fafc 0%, #cbd5e1 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>
                        Prêt à révolutionner votre recherche ?
                    </h2>
                    <p style={{
                        fontSize: '1.25rem',
                        color: '#94a3b8',
                        marginBottom: '3rem',
                        lineHeight: 1.6
                    }}>
                        Rejoignez des milliers de chercheurs qui utilisent Odin pour accélérer leurs découvertes
                    </p>
                    <button
                        onClick={() => navigate('/register')}
                        style={{
                            padding: '1.25rem 3rem',
                            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                            border: 'none',
                            borderRadius: '0.75rem',
                            color: '#fff',
                            fontSize: '1.25rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            boxShadow: '0 12px 32px rgba(59, 130, 246, 0.5)',
                            transition: 'transform 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                        S'inscrire maintenant
                        <ChevronRight size={24} />
                    </button>
                </div>
            </section>

            <footer style={{
                padding: '4rem 2rem 2rem',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
                <div style={{
                    maxWidth: '1400px',
                    margin: '0 auto',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '3rem',
                    marginBottom: '3rem'
                }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                            <img src="/logo1.png" alt="Odin" style={{ height: '32px' }} />
                            <span style={{ fontSize: '1.25rem', fontWeight: 800 }}>Odin</span>
                        </div>
                        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
                            La plateforme scientifique nouvelle génération
                        </p>
                    </div>
                    <div>
                        <h4 style={{ marginBottom: '1rem', fontWeight: 700 }}>Produit</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <a href="/features" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.9rem' }}>Fonctionnalités</a>
                            <a href="/pricing" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.9rem' }}>Tarifs</a>
                            <a href="/documentation" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.9rem' }}>Documentation</a>
                        </div>
                    </div>
                    <div>
                        <h4 style={{ marginBottom: '1rem', fontWeight: 700 }}>Entreprise</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <a href="#" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.9rem' }}>À propos</a>
                            <a href="#" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.9rem' }}>Blog</a>
                            <a href="#" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.9rem' }}>Carrières</a>
                        </div>
                    </div>
                    <div>
                        <h4 style={{ marginBottom: '1rem', fontWeight: 700 }}>Légal</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <a href="/privacy" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.9rem' }}>Confidentialité</a>
                            <a href="/terms" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.9rem' }}>CGU</a>
                            <a href="/cookies" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.9rem' }}>Cookies</a>
                        </div>
                    </div>
                </div>
                <div style={{
                    paddingTop: '2rem',
                    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                    textAlign: 'center',
                    color: '#64748b',
                    fontSize: '0.9rem'
                }}>
                    © 2026 Odin la Science. Tous droits réservés.
                </div>
            </footer>

            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-20px); }
                }
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
                @keyframes slideInLeft {
                    from {
                        opacity: 0;
                        transform: translateX(-50px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
                @keyframes slideInRight {
                    from {
                        opacity: 0;
                        transform: translateX(50px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                html {
                    scroll-behavior: smooth;
                }
                body {
                    overflow-x: hidden;
                }
            `}</style>
        </div>
    );
};

export default LandingPage;
