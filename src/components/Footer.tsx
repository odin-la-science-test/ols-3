import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from './ThemeContext';

const Footer = () => {
    const { theme } = useTheme();
    const c = theme.colors;
    const navigate = useNavigate();

    return (
        <footer style={{ background: 'rgba(0,0,0,0.5)', borderTop: `1px solid ${c.borderColor}`, padding: '6rem 2rem 2rem', position: 'relative', zIndex: 1 }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '4rem', marginBottom: '6rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <img src="/logo1.png" alt="Logo" style={{ width: '40px', height: '40px', filter: 'drop-shadow(0 0 10px var(--accent-primary))' }} />
                        <span className="text-gradient">Odin</span>
                    </h2>
                    <p style={{ color: c.textSecondary, fontSize: '0.95rem', lineHeight: 1.6 }}>La plateforme ultime pour la recherche scientifique moderne et accélérée.</p>
                </div>
                <FooterList title="Plateforme" items={[
                    { label: 'Pourquoi Odin', path: '/why-odin' },
                    { label: 'Entreprise', path: '/enterprise' },
                    { label: 'Applications', path: '/mobile-apps' },
                    { label: 'Tarification', path: '/pricing' }
                ]} navigate={navigate} />
                <FooterList title="Fonctionnalités" items={[
                    { label: 'Design UI', path: '/features/design' }, // Placeholder paths for now
                    { label: 'Collaboration', path: '/features/collaboration' },
                    { label: 'Sécurité Lab', path: '/features/security' },
                    { label: 'Analyses Data', path: '/features/analytics' }
                ]} navigate={navigate} />
                <FooterList title="Support" items={[
                    { label: 'Centre d\'aide', path: '/support' },
                    { label: 'API Docs', path: '/docs' },
                    { label: 'Blog', path: '/blog' },
                    { label: 'Carrières', path: '/careers' }
                ]} navigate={navigate} />
            </div>
            <div style={{ maxWidth: '1200px', margin: '0 auto', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', color: c.textSecondary, fontSize: '0.85rem', opacity: 0.6 }}>
                <div>© 2026 Odin La Science. Tous droits réservés.</div>
                <div style={{ display: 'flex', gap: '2rem' }}>
                    <span style={{ cursor: 'pointer' }} onClick={() => navigate('/privacy')}>Confidentialité</span>
                    <span style={{ cursor: 'pointer' }} onClick={() => navigate('/terms')}>Conditions</span>
                    <span style={{ cursor: 'pointer' }} onClick={() => navigate('/company')}>À propos</span>
                </div>
            </div>
        </footer>
    );
};

const FooterList = ({ title, items, navigate }: { title: string, items: { label: string, path: string }[], navigate: any }) => (
    <div>
        <h4 style={{
            fontSize: '0.9rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            marginBottom: '1.75rem',
            color: 'var(--text-primary)',
            opacity: 0.9
        }}>{title}</h4>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {items.map(item => (
                <li key={item.label} style={{ marginBottom: '0.85rem', color: 'var(--text-secondary)', fontSize: '0.95rem', cursor: 'pointer', transition: 'color 0.2s' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-primary)'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
                    onClick={() => navigate(item.path)}
                >
                    {item.label}
                </li>
            ))}
        </ul>
    </div>
);

export default Footer;
