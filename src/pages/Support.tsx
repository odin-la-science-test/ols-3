import React from 'react';
import PageLayout from '../components/PageLayout';
import { useTheme } from '../components/ThemeContext';
import { Search, Book, MessageSquare, LifeBuoy, Server } from 'lucide-react';

const Support = () => {
    const { theme } = useTheme();
    const c = theme.colors;

    return (
        <PageLayout>
            <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '4rem 2rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <h1 className="text-gradient" style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1.5rem' }}>Comment pouvons-nous aider ?</h1>
                    <div style={{ position: 'relative', maxWidth: '600px', margin: '0 auto' }}>
                        <input
                            type="text"
                            placeholder="Rechercher dans la documentation..."
                            style={{
                                width: '100%',
                                padding: '1rem 1rem 1rem 3rem',
                                borderRadius: '1rem',
                                border: `1px solid ${c.borderColor}`,
                                background: c.cardBg,
                                color: c.textPrimary,
                                fontSize: '1.1rem'
                            }}
                        />
                        <Search size={20} color={c.textSecondary} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
                    {[
                        { icon: <Book size={32} />, title: "Documentation", desc: "Guides détaillés et tutoriels pas-à-pas." },
                        { icon: <MessageSquare size={32} />, title: "Communauté", desc: "Échangez avec d'autres chercheurs." },
                        { icon: <LifeBuoy size={32} />, title: "Contact Support", desc: "Notre équipe vous répond sous 24h." },
                        { icon: <Server size={32} />, title: "État du système", desc: "Vérifiez la disponibilité des services." },
                    ].map((item, i) => (
                        <div key={i} className="glass-panel" style={{ padding: '2rem', borderRadius: '1.5rem', border: `1px solid ${c.borderColor}`, textAlign: 'center', cursor: 'pointer', transition: 'transform 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                            <div style={{ marginBottom: '1rem', color: c.accentPrimary }}>{item.icon}</div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>{item.title}</h3>
                            <p style={{ color: c.textSecondary, fontSize: '0.95rem' }}>{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </PageLayout>
    );
};

export default Support;
