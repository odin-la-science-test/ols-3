import React from 'react';
import PageLayout from '../components/PageLayout';
import { useTheme } from '../components/ThemeContext';
import { Calendar, User, ArrowRight } from 'lucide-react';

const Blog = () => {
    const { theme } = useTheme();
    const c = theme.colors;

    const posts = [
        { title: "L'IA générative dans la recherche moléculaire", date: "12 Oct 2025", author: "Dr. Sarah Conner", category: "Intelligence Artificielle" },
        { title: "Optimiser les stocks de labo : Guide complet", date: "05 Oct 2025", author: "Marc Dupont", category: "Gestion" },
        { title: "Mise à jour Hugin 4.0 : Quoi de neuf ?", date: "28 Sep 2025", author: "Team Odin", category: "Produit" },
    ];

    return (
        <PageLayout>
            <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '4rem 2rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
                    <h1 className="text-gradient" style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>Le Journal d'Odin</h1>
                    <p style={{ fontSize: '1.3rem', color: c.textSecondary }}>Actualités, découvertes et conseils pour la science de demain.</p>
                </div>

                <div style={{ display: 'grid', gap: '3rem' }}>
                    {posts.map((post, i) => (
                        <div key={i} className="glass-panel" style={{ padding: '2rem', borderRadius: '1.5rem', border: `1px solid ${c.borderColor}`, display: 'flex', flexDirection: 'column', gap: '1rem', cursor: 'pointer', transition: 'all 0.2s' }}
                            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateX(10px)'; e.currentTarget.style.borderColor = c.accentPrimary; }}
                            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateX(0)'; e.currentTarget.style.borderColor = c.borderColor; }}
                        >
                            <div style={{ display: 'flex', gap: '1rem', fontSize: '0.9rem', color: c.textSecondary }}>
                                <span style={{ color: c.accentPrimary, fontWeight: 700 }}>{post.category}</span>
                                <span>•</span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Calendar size={14} /> {post.date}</span>
                                <span>•</span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><User size={14} /> {post.author}</span>
                            </div>
                            <h2 style={{ fontSize: '2rem', fontWeight: 700 }}>{post.title}</h2>
                            <p style={{ color: c.textSecondary, lineHeight: 1.6 }}>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam...
                            </p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: c.accentPrimary, marginTop: '1rem' }}>
                                Lire l'article <ArrowRight size={18} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </PageLayout>
    );
};

export default Blog;
