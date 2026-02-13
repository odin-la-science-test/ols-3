import React from 'react';
import PageLayout from '../components/PageLayout';
import { useTheme } from '../components/ThemeContext';
import { Zap, Shield, Globe } from 'lucide-react';

const WhyOdin = () => {
    const { theme } = useTheme();
    const c = theme.colors;

    return (
        <PageLayout>
            <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '4rem 2rem' }}>
                <h1 className="text-gradient" style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: '2rem', textAlign: 'center' }}>Pourquoi choisir Odin ?</h1>
                <p style={{ fontSize: '1.3rem', lineHeight: 1.7, color: c.textSecondary, marginBottom: '4rem', textAlign: 'center', maxWidth: '800px', margin: '0 auto 4rem' }}>
                    Odin n'est pas juste un autre logiciel de laboratoire. C'est une extension de votre esprit scientifique, conçue pour éliminer les frictions entre votre idée et sa réalisation.
                </p>

                <div style={{ display: 'grid', gap: '4rem' }}>
                    <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
                        <div style={{ padding: '1rem', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '1rem' }}>
                            <Zap size={32} color={c.accentPrimary} />
                        </div>
                        <div>
                            <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '1rem' }}>Vitesse Extrême</h2>
                            <p style={{ fontSize: '1.1rem', color: c.textSecondary, lineHeight: 1.6 }}>
                                Nous avons optimisé chaque interaction pour qu'elle soit instantanée. De la recherche dans la base de données à la saisie de vos résultats, tout se fait à la vitesse de la pensée.
                            </p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
                        <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '1rem' }}>
                            <Globe size={32} color="#10b981" />
                        </div>
                        <div>
                            <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '1rem' }}>Connectivité Totale</h2>
                            <p style={{ fontSize: '1.1rem', color: c.textSecondary, lineHeight: 1.6 }}>
                                Vos données ne sont plus isolées. Odin relie vos expériences, vos inventaires et votre bibliographie dans un graphe de connaissances dynamique.
                            </p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
                        <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '1rem' }}>
                            <Shield size={32} color="#ef4444" />
                        </div>
                        <div>
                            <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '1rem' }}>Souveraineté des Données</h2>
                            <p style={{ fontSize: '1.1rem', color: c.textSecondary, lineHeight: 1.6 }}>
                                Vos découvertes vous appartiennent. Avec un chiffrement de bout en bout et des options d'hébergement flexibles, vous gardez le contrôle total.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </PageLayout>
    );
};

export default WhyOdin;
