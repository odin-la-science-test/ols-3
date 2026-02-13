import PageLayout from '../components/PageLayout';
import { useTheme } from '../components/ThemeContext';
import { Check } from 'lucide-react';

const Enterprise = () => {
    const { theme } = useTheme();
    const c = theme.colors;

    return (
        <PageLayout>
            <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '4rem 2rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <h1 className="text-gradient" style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>Odin Enterprise</h1>
                    <p style={{ fontSize: '1.3rem', color: c.textSecondary }}>
                        Pour les organisations qui changent le monde. Déployez Odin à grande échelle avec sécurité, conformité et support dédié.
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
                    <div className="glass-panel" style={{ padding: '2rem', borderRadius: '1.5rem', border: `1px solid ${c.borderColor}` }}>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>Sécurité Avancée</h3>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            {['SSO / SAML', 'Audit Logs', 'VPC Privé', 'Certifications ISO'].map(item => (
                                <li key={item} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', color: c.textSecondary }}>
                                    <Check size={20} color={c.accentPrimary} /> {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="glass-panel" style={{ padding: '2rem', borderRadius: '1.5rem', border: `1px solid ${c.borderColor}` }}>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>Support Dédié</h3>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            {['Manager de Compte', 'SLA 99.99%', 'Formation sur site', 'Migration assistée'].map(item => (
                                <li key={item} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', color: c.textSecondary }}>
                                    <Check size={20} color={c.accentPrimary} /> {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div style={{ textAlign: 'center' }}>
                    <button style={{
                        padding: '1rem 3rem',
                        fontSize: '1.2rem',
                        fontWeight: 700,
                        background: c.accentPrimary,
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.75rem',
                        cursor: 'pointer'
                    }}>
                        Contacter les ventes
                    </button>
                </div>
                <div style={{ marginTop: '5rem', padding: '3rem', background: 'rgba(255,255,255,0.02)', borderRadius: '2rem', border: `1px solid ${c.borderColor}` }}>
                    <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                        <h2 className="text-gradient" style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem' }}>Contactez l'équipe Entreprise</h2>
                        <p style={{ color: c.textSecondary, fontSize: '1.1rem' }}>
                            Prêt à déployer Odin à grande échelle ? Nos experts, Bastien, Ethan et Issam, sont là pour vous guider.
                        </p>
                    </div>

                    <form onSubmit={(e) => {
                        e.preventDefault();
                        const formData = new FormData(e.currentTarget);
                        const data = Object.fromEntries(formData.entries());
                        console.log('--- ENVOI FORMULAIRE CONTACT ENTREPRISE ---');
                        console.log('De:', data.name, '(', data.email, ')');
                        console.log('Sujet:', data.subject);
                        console.log('Message:', data.message);
                        console.log('Destinataires: bastien@OLS.com, ethan@OLS.com, issam@OLS.com');
                        console.log('-------------------------------------------');
                        alert('Votre demande a été envoyée à nos responsables grands comptes.');
                        e.currentTarget.reset();
                    }} style={{ display: 'grid', gap: '1.5rem', maxWidth: '600px', margin: '0 auto' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <input required name="name" type="text" placeholder="Nom complet" style={{ padding: '1rem', borderRadius: '0.8rem', border: `1px solid ${c.borderColor}`, background: '#000', color: 'white' }} />
                            <input required name="email" type="email" placeholder="Email professionnel" style={{ padding: '1rem', borderRadius: '0.8rem', border: `1px solid ${c.borderColor}`, background: '#000', color: 'white' }} />
                        </div>
                        <input required name="subject" type="text" placeholder="Sujet (ex: Déploiement multi-sites)" style={{ padding: '1rem', borderRadius: '0.8rem', border: `1px solid ${c.borderColor}`, background: '#000', color: 'white' }} />
                        <textarea required name="message" rows={5} placeholder="Décrivez votre projet..." style={{ padding: '1rem', borderRadius: '0.8rem', border: `1px solid ${c.borderColor}`, background: '#000', color: 'white', resize: 'vertical' }}></textarea>

                        <button type="submit" style={{
                            padding: '1rem', borderRadius: '0.8rem', border: 'none',
                            background: `linear-gradient(135deg, ${c.accentPrimary}, ${c.accentHugin})`,
                            color: 'white', fontWeight: 700, fontSize: '1.1rem', cursor: 'pointer',
                            marginTop: '1rem'
                        }}>
                            Envoyer la demande
                        </button>
                    </form>
                </div>
            </div>
        </PageLayout>
    );
};

export default Enterprise;
