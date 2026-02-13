import React from 'react';
import PageLayout from '../components/PageLayout';
import { useTheme } from '../components/ThemeContext';
import { Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Pricing = () => {
    const { theme } = useTheme();
    const c = theme.colors;
    const navigate = useNavigate();

    return (
        <PageLayout>
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 2rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
                    <h1 className="text-gradient" style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>Tarification Simple</h1>
                    <p style={{ fontSize: '1.3rem', color: c.textSecondary }}>
                        Commencez petit, grandissez sans limites.
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                    {/* Free Tier */}
                    <div className="glass-panel" style={{ padding: '3rem', borderRadius: '2rem', border: `1px solid ${c.borderColor}`, position: 'relative' }}>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>Découverte</h3>
                        <div style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '2rem' }}>0€ <span style={{ fontSize: '1rem', fontWeight: 400, color: c.textSecondary }}>/mois</span></div>
                        <p style={{ color: c.textSecondary, marginBottom: '2rem' }}>Pour les étudiants et chercheurs indépendants.</p>
                        <button onClick={() => navigate('/register')} style={{ width: '100%', padding: '1rem', borderRadius: '0.75rem', border: `1px solid ${c.borderColor}`, background: 'transparent', color: c.textPrimary, fontWeight: 700, cursor: 'pointer', marginBottom: '2rem' }}>Commencer</button>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            {['Accès Munin Atlas', '1 Carnet de Labo', 'Stockage 1GB', 'Support Communautaire'].map(item => (
                                <li key={item} style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}><Check size={20} color={c.textSecondary} /> {item}</li>
                            ))}
                        </ul>
                    </div>

                    {/* Pro Tier */}
                    <div className="glass-panel" style={{ padding: '3rem', borderRadius: '2rem', border: `1px solid ${c.accentPrimary}`, background: `linear-gradient(180deg, ${c.accentPrimary}11, transparent)`, position: 'relative' }}>
                        <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: c.accentPrimary, color: 'white', padding: '0.25rem 1rem', borderRadius: '1rem', fontSize: '0.8rem', fontWeight: 700 }}>RECOMMANDÉ</div>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>Chercheur</h3>
                        <div style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '2rem' }}>29€ <span style={{ fontSize: '1rem', fontWeight: 400, color: c.textSecondary }}>/mois</span></div>
                        <p style={{ color: c.textSecondary, marginBottom: '2rem' }}>Pour les professionnels et doctorants.</p>
                        <button onClick={() => navigate('/register')} style={{ width: '100%', padding: '1rem', borderRadius: '0.75rem', border: 'none', background: c.accentPrimary, color: 'white', fontWeight: 700, cursor: 'pointer', marginBottom: '2rem' }}>Essai gratuit 14j</button>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            {['Tout Découverte +', 'Hugin Lab Complet', 'IA Assistant Illimité', 'Stockage 100GB', 'Export PDF/Word'].map(item => (
                                <li key={item} style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}><Check size={20} color={c.accentPrimary} /> {item}</li>
                            ))}
                        </ul>
                    </div>

                    {/* Lab Tier */}
                    <div className="glass-panel" style={{ padding: '3rem', borderRadius: '2rem', border: `1px solid ${c.borderColor}`, position: 'relative' }}>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>Laboratoire</h3>
                        <div style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '2rem' }}>99€ <span style={{ fontSize: '1rem', fontWeight: 400, color: c.textSecondary }}>/mois</span></div>
                        <p style={{ color: c.textSecondary, marginBottom: '2rem' }}>Pour les petites équipes (jusqu'à 5).</p>
                        <button onClick={() => navigate('/register')} style={{ width: '100%', padding: '1rem', borderRadius: '0.75rem', border: `1px solid ${c.borderColor}`, background: 'transparent', color: c.textPrimary, fontWeight: 700, cursor: 'pointer', marginBottom: '2rem' }}>Contacter</button>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            {['Tout Chercheur +', 'Fonctions Collaboratives', 'Gestion des Stocks', 'Validation Hiérarchique', 'Support Prioritaire'].map(item => (
                                <li key={item} style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}><Check size={20} color={c.textSecondary} /> {item}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </PageLayout>
    );
};

export default Pricing;
