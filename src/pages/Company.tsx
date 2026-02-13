import React from 'react';
import PageLayout from '../components/PageLayout';
import { useTheme } from '../components/ThemeContext';
import { Users, Target, Heart } from 'lucide-react';

const Company = () => {
    const { theme } = useTheme();
    const c = theme.colors;

    return (
        <PageLayout>
            <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '4rem 2rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
                    <h1 className="text-gradient" style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>À propos d'Odin</h1>
                    <p style={{ fontSize: '1.3rem', color: c.textSecondary, maxWidth: '700px', margin: '0 auto' }}>
                        Nous construisons le système d'exploitation de la découverte scientifique.
                    </p>
                </div>

                <div style={{ display: 'grid', gap: '4rem' }}>
                    <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
                        <div style={{ padding: '1rem', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '1rem' }}>
                            <Target size={32} color={c.accentPrimary} />
                        </div>
                        <div>
                            <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1rem' }}>Notre Mission</h2>
                            <p style={{ fontSize: '1.1rem', color: c.textSecondary, lineHeight: 1.6 }}>
                                Accélérer le rythme de l'innovation scientifique en fournissant aux chercheurs les outils les plus intuitifs et les plus puissants jamais créés. Nous croyons que la science doit être limitée par l'imagination, pas par le logiciel.
                            </p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
                        <div style={{ padding: '1rem', background: 'rgba(236, 72, 153, 0.1)', borderRadius: '1rem' }}>
                            <Heart size={32} color="#ec4899" />
                        </div>
                        <div>
                            <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1rem' }}>Nos Valeurs</h2>
                            <ul style={{ listStyle: 'none', padding: 0, fontSize: '1.1rem', color: c.textSecondary, lineHeight: 1.8 }}>
                                <li><strong>Rigueur :</strong> La précision est notre obsession.</li>
                                <li><strong>Transparence :</strong> Open source, open science, open mind.</li>
                                <li><strong>Impact :</strong> Nous mesurons notre succès aux découvertes de nos utilisateurs.</li>
                            </ul>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
                        <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '1rem' }}>
                            <Users size={32} color="#10b981" />
                        </div>
                        <div>
                            <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1rem' }}>L'Équipe</h2>
                            <p style={{ fontSize: '1.1rem', color: c.textSecondary, lineHeight: 1.6 }}>
                                Fondée par d'anciens chercheurs et ingénieurs de la tech, Odin réunit le meilleur des deux mondes. Basés à Paris, nous sommes une équipe distribuée passionnée par le futur de la science.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </PageLayout>
    );
};

export default Company;
