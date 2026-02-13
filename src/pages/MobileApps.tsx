import React from 'react';
import PageLayout from '../components/PageLayout';
import { useTheme } from '../components/ThemeContext';
import { Smartphone, Activity, Map, MessageCircle, Database } from 'lucide-react';

const MobileApps = () => {
    const { theme } = useTheme();
    const c = theme.colors;

    return (
        <PageLayout>
            <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '4rem 2rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <h1 className="text-gradient" style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>Odin dans votre poche</h1>
                    <p style={{ fontSize: '1.3rem', color: c.textSecondary, maxWidth: '700px', margin: '0 auto' }}>
                        Le premier compagnon de laboratoire qui ne craint ni les produits chimiques ni les zones blanches.
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', alignItems: 'center', marginBottom: '5rem' }}>
                    <div className="glass-panel" style={{ padding: '2rem', borderRadius: '1.5rem', border: `1px solid ${c.borderColor}`, minHeight: '300px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.75rem' }}><Map size={24} color={c.accentPrimary} /> Navigation Labo</h3>
                        <p style={{ color: c.textSecondary, lineHeight: 1.6 }}>Retrouvez n'importe quel échantillon ou équipement grâce à la géolocalisation indoor précise au centimètre près.</p>

                        <h3 style={{ fontSize: '1.5rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.75rem' }}><MessageCircle size={24} color={c.accentHugin} /> Chat Sécurisé</h3>
                        <p style={{ color: c.textSecondary, lineHeight: 1.6 }}>Communiquez avec votre équipe sans quitter vos gants. Dictée vocale optimisée pour le vocabulaire scientifique.</p>

                        <h3 style={{ fontSize: '1.5rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.75rem' }}><Database size={24} color={c.accentMunin} /> Scan & Go</h3>
                        <p style={{ color: c.textSecondary, lineHeight: 1.6 }}>Scannez un code-barres pour voir instantanément l'historique complet d'un réactif ou d'un échantillon.</p>
                    </div>

                    <div style={{ textAlign: 'center' }}>
                        <div style={{
                            width: '280px',
                            height: '560px',
                            background: '#111',
                            borderRadius: '3rem',
                            border: '8px solid #222',
                            margin: '0 auto',
                            boxShadow: '0 50px 100px -20px rgba(0,0,0,0.5)',
                            overflow: 'hidden',
                            position: 'relative'
                        }}>
                            {/* Mockup content */}
                            <div style={{ height: '100%', background: 'linear-gradient(180deg, #1a1a2e 0%, #0f0f1a 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Smartphone size={64} color={c.accentPrimary} style={{ opacity: 0.5 }} />
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
                    <button style={{
                        padding: '1rem 2rem',
                        background: '#000',
                        borderRadius: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        border: '1px solid rgba(255,255,255,0.1)',
                        cursor: 'pointer',
                        color: 'white'
                    }}>
                        <Smartphone size={32} />
                        <div style={{ textAlign: 'left' }}>
                            <div style={{ fontSize: '0.8rem', color: '#999' }}>Télécharger sur</div>
                            <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>App Store</div>
                        </div>
                    </button>
                    <button style={{
                        padding: '1rem 2rem',
                        background: '#000',
                        borderRadius: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        border: '1px solid rgba(255,255,255,0.1)',
                        cursor: 'pointer',
                        color: 'white'
                    }}>
                        <Activity size={32} />
                        <div style={{ textAlign: 'left' }}>
                            <div style={{ fontSize: '0.8rem', color: '#999' }}>Disponible sur</div>
                            <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>Google Play</div>
                        </div>
                    </button>
                </div>
            </div>
        </PageLayout>
    );
};

export default MobileApps;
