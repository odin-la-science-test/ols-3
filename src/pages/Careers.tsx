import React from 'react';
import PageLayout from '../components/PageLayout';
import { useTheme } from '../components/ThemeContext';
import { Briefcase, ArrowRight } from 'lucide-react';

const Careers = () => {
    const { theme } = useTheme();
    const c = theme.colors;

    const jobs = [
        { title: "Senior Full Stack Engineer", dept: "Engineering", loc: "Remote (EU)" },
        { title: "Product Designer - Scientific UX", dept: "Design", loc: "Paris / Remote" },
        { title: "Customer Success Manager", dept: "Sales", loc: "London / Remote" },
    ];

    return (
        <PageLayout>
            <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '4rem 2rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
                    <h1 className="text-gradient" style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>Rejoignez la Révolution</h1>
                    <p style={{ fontSize: '1.3rem', color: c.textSecondary }}>
                        Aidez-nous à construire les outils qui permettront les découvertes du prochain siècle.
                    </p>
                </div>

                <div style={{ display: 'grid', gap: '2rem' }}>
                    {jobs.map((job, i) => (
                        <div key={i} className="glass-panel" style={{ padding: '2rem', borderRadius: '1.5rem', border: `1px solid ${c.borderColor}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
                            onMouseEnter={(e) => { e.currentTarget.style.borderColor = c.accentPrimary; }}
                            onMouseLeave={(e) => { e.currentTarget.style.borderColor = c.borderColor; }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '1rem' }}>
                                    <Briefcase size={24} color={c.textPrimary} />
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem' }}>{job.title}</h3>
                                    <div style={{ color: c.textSecondary }}>{job.dept} • {job.loc}</div>
                                </div>
                            </div>
                            <div style={{ padding: '1rem', background: c.accentPrimary, borderRadius: '50%', color: 'white' }}>
                                <ArrowRight size={20} />
                            </div>
                        </div>
                    ))}
                </div>

                <div style={{ textAlign: 'center', marginTop: '4rem', color: c.textSecondary }}>
                    <p>Aucun poste ne vous correspond ? Envoyez-nous une candidature spontanée à <strong style={{ color: c.accentPrimary }}>jobs@odin.science</strong></p>
                </div>
            </div>
        </PageLayout>
    );
};

export default Careers;
