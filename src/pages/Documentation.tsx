import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Book, Search, FileText, Video, Code, HelpCircle } from 'lucide-react';

const Documentation = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');

    const sections = [
        {
            icon: <Book size={32} />,
            title: 'Guide de démarrage',
            description: 'Premiers pas avec Odin La Science',
            articles: [
                'Créer votre compte',
                'Configuration initiale',
                'Inviter des membres',
                'Personnaliser votre espace'
            ]
        },
        {
            icon: <FileText size={32} />,
            title: 'Munin Atlas',
            description: 'Utiliser l\'encyclopédie scientifique',
            articles: [
                'Rechercher une discipline',
                'Comparer des entités',
                'Exporter des données',
                'Créer des favoris'
            ]
        },
        {
            icon: <Video size={32} />,
            title: 'Hugin Lab',
            description: 'Gestion de laboratoire',
            articles: [
                'Suivi des cultures',
                'Cahier de laboratoire',
                'Gestion des stocks',
                'Planification des expériences'
            ]
        },
        {
            icon: <Code size={32} />,
            title: 'API & Intégrations',
            description: 'Développeurs et intégrations',
            articles: [
                'Documentation API',
                'Authentification',
                'Webhooks',
                'Exemples de code'
            ]
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

                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <h1 style={{
                        fontSize: '3rem',
                        fontWeight: 900,
                        marginBottom: '1rem',
                        background: 'linear-gradient(135deg, #f8fafc 0%, #cbd5e1 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>
                        Documentation
                    </h1>
                    <p style={{ fontSize: '1.25rem', color: '#94a3b8', marginBottom: '2rem' }}>
                        Guides, tutoriels et ressources pour maîtriser Odin La Science
                    </p>

                    <div style={{ maxWidth: '600px', margin: '0 auto', position: 'relative' }}>
                        <Search size={20} style={{
                            position: 'absolute',
                            left: '1rem',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: '#64748b'
                        }} />
                        <input
                            type="text"
                            placeholder="Rechercher dans la documentation..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '1rem 1rem 1rem 3rem',
                                background: 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: '0.75rem',
                                color: '#f8fafc',
                                fontSize: '1rem',
                                outline: 'none'
                            }}
                        />
                    </div>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '2rem',
                    marginBottom: '3rem'
                }}>
                    {sections.map((section, index) => (
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
                                e.currentTarget.style.transform = 'translateY(-4px)';
                                e.currentTarget.style.borderColor = '#3b82f6';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                            }}
                        >
                            <div style={{ color: '#3b82f6', marginBottom: '1rem' }}>
                                {section.icon}
                            </div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                                {section.title}
                            </h3>
                            <p style={{ color: '#94a3b8', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                                {section.description}
                            </p>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                {section.articles.map((article, i) => (
                                    <li key={i} style={{
                                        padding: '0.5rem 0',
                                        borderBottom: i < section.articles.length - 1 ? '1px solid rgba(255, 255, 255, 0.05)' : 'none'
                                    }}>
                                        <a href="#" style={{
                                            color: '#cbd5e1',
                                            textDecoration: 'none',
                                            fontSize: '0.9rem',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem'
                                        }}>
                                            <HelpCircle size={16} />
                                            {article}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div style={{
                    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(139, 92, 246, 0.2))',
                    border: '1px solid rgba(99, 102, 241, 0.4)',
                    borderRadius: '1rem',
                    padding: '2.5rem',
                    textAlign: 'center',
                    marginBottom: '2rem'
                }}>
                    <h3 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem' }}>
                        📚 Tutoriel des Modifications
                    </h3>
                    <p style={{ color: '#cbd5e1', marginBottom: '1.5rem', fontSize: '1.1rem' }}>
                        Guide interactif pour utiliser et personnaliser les nouveaux modules
                    </p>
                    <button
                        onClick={() => navigate('/tutorial')}
                        style={{
                            padding: '1rem 2.5rem',
                            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                            border: 'none',
                            borderRadius: '0.75rem',
                            color: 'white',
                            fontSize: '1.05rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.3s',
                            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 6px 20px rgba(99, 102, 241, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(99, 102, 241, 0.3)';
                        }}
                    >
                        Accéder au Tutoriel →
                    </button>
                </div>

                <div style={{
                    background: 'rgba(59, 130, 246, 0.1)',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    borderRadius: '1rem',
                    padding: '2rem',
                    textAlign: 'center'
                }}>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>
                        Besoin d'aide supplémentaire ?
                    </h3>
                    <p style={{ color: '#94a3b8', marginBottom: '1.5rem' }}>
                        Notre équipe support est disponible 24/7 pour répondre à vos questions
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
                        Contacter le support
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Documentation;
