import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Beaker, BookOpen, Activity, Database,
    ChevronRight, ArrowRight, Zap, Shield, 
    Users, TrendingUp, Microscope, FlaskConical, 
    Dna, Brain, Star, Menu, X
} from 'lucide-react';
import { useDeviceDetection } from '../hooks/useDeviceDetection';

const LandingPage = () => {
    const navigate = useNavigate();
    const [scrollY, setScrollY] = useState(0);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { isMobile } = useDeviceDetection();

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const features = [
        {
            icon: <BookOpen size={isMobile ? 20 : 24} />,
            title: 'Munin Atlas',
            description: 'Encyclopédie scientifique complète',
            color: '#10b981'
        },
        {
            icon: <Beaker size={isMobile ? 20 : 24} />,
            title: 'Hugin Lab',
            description: 'Gestion de laboratoire numérique',
            color: '#6366f1'
        },
        {
            icon: <Activity size={isMobile ? 20 : 24} />,
            title: 'Analyse Avancée',
            description: 'Analyse de données en temps réel',
            color: '#8b5cf6'
        },
        {
            icon: <Database size={isMobile ? 20 : 24} />,
            title: 'Gestion de Données',
            description: 'Stockage sécurisé et intelligent',
            color: '#3b82f6'
        }
    ];

    const benefits = [
        { icon: <Zap size={isMobile ? 24 : 32} />, title: 'Gain de temps', description: 'Automatisez vos tâches répétitives', color: '#f59e0b' },
        { icon: <Shield size={isMobile ? 24 : 32} />, title: 'Sécurité maximale', description: 'Données cryptées et sauvegardées', color: '#10b981' },
        { icon: <Users size={isMobile ? 24 : 32} />, title: 'Collaboration', description: 'Travaillez en équipe facilement', color: '#6366f1' },
        { icon: <TrendingUp size={isMobile ? 24 : 32} />, title: 'Mobile', description: 'Accès depuis n\'importe où', color: '#8b5cf6' }
    ];

    const modules = [
        { icon: <Microscope size={isMobile ? 32 : 40} />, title: 'CryoKeeper', description: 'Gestion d\'échantillons cryogéniques' },
        { icon: <FlaskConical size={isMobile ? 32 : 40} />, title: 'CultureTracking', description: 'Suivi de cultures microbiennes' },
        { icon: <Dna size={isMobile ? 32 : 40} />, title: 'SequenceLens', description: 'Analyse de séquences génétiques' },
        { icon: <Brain size={isMobile ? 32 : 40} />, title: 'Excel Lab', description: 'Tableur scientifique avancé' }
    ];

    return (
        <div style={{ minHeight: '100vh', background: '#0b1120', color: '#f8fafc', fontFamily: 'Inter, system-ui, sans-serif' }}>
            {/* Navigation */}
            <nav style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 1000,
                background: scrollY > 50 ? 'rgba(11, 17, 32, 0.95)' : 'transparent',
                backdropFilter: scrollY > 50 ? 'blur(10px)' : 'none',
                borderBottom: scrollY > 50 ? '1px solid rgba(255,255,255,0.1)' : 'none',
                transition: 'all 0.3s',
                padding: isMobile ? '1rem' : '1.5rem 3rem'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1400px', margin: '0 auto' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }} onClick={() => navigate('/')}>
                        <img src="/logo1.png" alt="Odin" style={{ width: isMobile ? '40px' : '50px', height: isMobile ? '40px' : '50px' }} />
                        <span style={{ fontSize: isMobile ? '1.25rem' : '1.5rem', fontWeight: 800, background: 'linear-gradient(135deg, #10b981, #6366f1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            Odin la Science
                        </span>
                    </div>

                    {isMobile ? (
                        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} style={{ background: 'none', border: 'none', color: '#f8fafc', cursor: 'pointer' }}>
                            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    ) : (
                        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                            <button onClick={() => navigate('/login')} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '1rem' }}>Connexion</button>
                            <button onClick={() => navigate('/register')} style={{ background: 'linear-gradient(135deg, #10b981, #6366f1)', border: 'none', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '12px', cursor: 'pointer', fontSize: '1rem', fontWeight: 600 }}>
                                Commencer
                            </button>
                        </div>
                    )}
                </div>

                {/* Mobile Menu */}
                {isMobile && mobileMenuOpen && (
                    <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(15, 23, 42, 0.95)', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <button onClick={() => { navigate('/login'); setMobileMenuOpen(false); }} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '1rem', textAlign: 'left', padding: '0.5rem' }}>Connexion</button>
                        <button onClick={() => { navigate('/register'); setMobileMenuOpen(false); }} style={{ background: 'linear-gradient(135deg, #10b981, #6366f1)', border: 'none', color: 'white', padding: '0.75rem', borderRadius: '12px', cursor: 'pointer', fontSize: '1rem', fontWeight: 600 }}>
                            Commencer
                        </button>
                    </div>
                )}
            </nav>

            {/* Hero Section */}
            <section style={{ padding: isMobile ? '8rem 1.5rem 4rem' : '12rem 3rem 6rem', textAlign: 'center', maxWidth: '1400px', margin: '0 auto' }}>
                <h1 style={{ fontSize: isMobile ? '2.5rem' : '4rem', fontWeight: 900, marginBottom: '1.5rem', lineHeight: 1.1 }}>
                    La plateforme scientifique
                    <br />
                    <span style={{ background: 'linear-gradient(135deg, #10b981, #6366f1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        nouvelle génération
                    </span>
                </h1>
                <p style={{ fontSize: isMobile ? '1.1rem' : '1.3rem', color: '#94a3b8', marginBottom: '2.5rem', maxWidth: '700px', margin: '0 auto 2.5rem' }}>
                    Gérez vos expériences, analysez vos données et collaborez avec votre équipe sur une seule plateforme
                </p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <button onClick={() => navigate('/register')} style={{ background: 'linear-gradient(135deg, #10b981, #6366f1)', border: 'none', color: 'white', padding: isMobile ? '1rem 2rem' : '1.25rem 2.5rem', borderRadius: '12px', cursor: 'pointer', fontSize: isMobile ? '1rem' : '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        Essai gratuit <ArrowRight size={20} />
                    </button>
                    <button onClick={() => navigate('/login')} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', padding: isMobile ? '1rem 2rem' : '1.25rem 2.5rem', borderRadius: '12px', cursor: 'pointer', fontSize: isMobile ? '1rem' : '1.1rem', fontWeight: 600 }}>
                        Voir la démo
                    </button>
                </div>
            </section>

            {/* Features */}
            <section style={{ padding: isMobile ? '3rem 1.5rem' : '5rem 3rem', background: 'rgba(15, 23, 42, 0.5)', maxWidth: '1400px', margin: '0 auto' }}>
                <h2 style={{ fontSize: isMobile ? '2rem' : '2.5rem', fontWeight: 800, textAlign: 'center', marginBottom: isMobile ? '2rem' : '3rem' }}>Fonctionnalités principales</h2>
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(280px, 1fr))', gap: isMobile ? '1.5rem' : '2rem' }}>
                    {features.map((feature, idx) => (
                        <div key={idx} style={{ background: 'rgba(15, 23, 42, 0.8)', padding: isMobile ? '1.5rem' : '2rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
                            <div style={{ width: isMobile ? '48px' : '56px', height: isMobile ? '48px' : '56px', borderRadius: '12px', background: `${feature.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', color: feature.color }}>
                                {feature.icon}
                            </div>
                            <h3 style={{ fontSize: isMobile ? '1.2rem' : '1.3rem', fontWeight: 700, marginBottom: '0.5rem' }}>{feature.title}</h3>
                            <p style={{ color: '#94a3b8', fontSize: isMobile ? '0.95rem' : '1rem' }}>{feature.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Benefits */}
            <section style={{ padding: isMobile ? '3rem 1.5rem' : '5rem 3rem', maxWidth: '1400px', margin: '0 auto' }}>
                <h2 style={{ fontSize: isMobile ? '2rem' : '2.5rem', fontWeight: 800, textAlign: 'center', marginBottom: isMobile ? '2rem' : '3rem' }}>Pourquoi Odin?</h2>
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: isMobile ? '1.5rem' : '2rem' }}>
                    {benefits.map((benefit, idx) => (
                        <div key={idx} style={{ display: 'flex', gap: '1rem', padding: isMobile ? '1.5rem' : '2rem', background: 'rgba(15, 23, 42, 0.5)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
                            <div style={{ color: benefit.color, flexShrink: 0 }}>{benefit.icon}</div>
                            <div>
                                <h3 style={{ fontSize: isMobile ? '1.2rem' : '1.3rem', fontWeight: 700, marginBottom: '0.5rem' }}>{benefit.title}</h3>
                                <p style={{ color: '#94a3b8', fontSize: isMobile ? '0.95rem' : '1rem' }}>{benefit.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Modules */}
            <section style={{ padding: isMobile ? '3rem 1.5rem' : '5rem 3rem', background: 'rgba(15, 23, 42, 0.5)', maxWidth: '1400px', margin: '0 auto' }}>
                <h2 style={{ fontSize: isMobile ? '2rem' : '2.5rem', fontWeight: 800, textAlign: 'center', marginBottom: isMobile ? '2rem' : '3rem' }}>Modules spécialisés</h2>
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(280px, 1fr))', gap: isMobile ? '1.5rem' : '2rem' }}>
                    {modules.map((module, idx) => (
                        <div key={idx} style={{ background: 'rgba(15, 23, 42, 0.8)', padding: isMobile ? '1.5rem' : '2rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
                            <div style={{ color: '#10b981', marginBottom: '1rem' }}>{module.icon}</div>
                            <h3 style={{ fontSize: isMobile ? '1.2rem' : '1.3rem', fontWeight: 700, marginBottom: '0.5rem' }}>{module.title}</h3>
                            <p style={{ color: '#94a3b8', fontSize: isMobile ? '0.95rem' : '1rem' }}>{module.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section style={{ padding: isMobile ? '3rem 1.5rem' : '5rem 3rem', textAlign: 'center', maxWidth: '1400px', margin: '0 auto' }}>
                <div style={{ background: 'linear-gradient(135deg, #10b981, #6366f1)', padding: isMobile ? '3rem 1.5rem' : '4rem 3rem', borderRadius: '24px' }}>
                    <h2 style={{ fontSize: isMobile ? '2rem' : '3rem', fontWeight: 900, marginBottom: '1rem' }}>Prêt à commencer?</h2>
                    <p style={{ fontSize: isMobile ? '1.1rem' : '1.3rem', marginBottom: '2rem', opacity: 0.9 }}>Rejoignez des milliers de chercheurs qui utilisent Odin</p>
                    <button onClick={() => navigate('/register')} style={{ background: 'white', border: 'none', color: '#0b1120', padding: isMobile ? '1rem 2rem' : '1.25rem 2.5rem', borderRadius: '12px', cursor: 'pointer', fontSize: isMobile ? '1rem' : '1.1rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                        Commencer gratuitement <ChevronRight size={20} />
                    </button>
                </div>
            </section>

            {/* Footer */}
            <footer style={{ padding: isMobile ? '2rem 1.5rem' : '3rem', background: 'rgba(15, 23, 42, 0.8)', borderTop: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
                <p style={{ color: '#94a3b8', fontSize: isMobile ? '0.9rem' : '1rem' }}>© 2026 Odin la Science. Tous droits réservés.</p>
            </footer>
        </div>
    );
};

export default LandingPage;
