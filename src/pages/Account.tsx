import React, { useState } from 'react';
import { useToast } from '../components/ToastContext';
import Navbar from '../components/Navbar';
import { useDeviceDetection } from '../hooks/useDeviceDetection';

const Account = () => {
    const { showToast } = useToast();
    const { isMobile } = useDeviceDetection();

    // Fetch profile from localStorage
    const currentUser = localStorage.getItem('currentUser') || 'User';
    const profileStr = localStorage.getItem(`user_profile_${currentUser}`);
    const profile = profileStr ? JSON.parse(profileStr) : null;

    const [user, setUser] = useState({
        username: currentUser,
        email: profile?.email || 'user@odinlascience.lab',
        role: profile?.role === 'admin' ? 'Administrateur' : 'Utilisateur',
        joinedDate: '2024-02-12',
        subscription: profile?.subscription || { status: 'none', type: 'Gratuit', modules: [] },
        hiddenTools: profile?.hiddenTools || []
    });

    const toggleToolVisibility = (toolId: string) => {
        const isHidden = user.hiddenTools.includes(toolId);
        const newHidden = isHidden
            ? user.hiddenTools.filter((id: string) => id !== toolId)
            : [...user.hiddenTools, toolId];

        const updatedUser = { ...user, hiddenTools: newHidden };
        setUser(updatedUser);

        // Save to localStorage
        if (profile) {
            const updatedProfile = { ...profile, hiddenTools: newHidden };
            localStorage.setItem(`user_profile_${currentUser}`, JSON.stringify(updatedProfile));
        }
    };

    const [passwords, setPasswords] = useState({
        current: '',
        new: '',
        confirm: ''
    });

    const handleUpdateProfile = () => {
        localStorage.setItem('currentUser', user.username);
        showToast('✅ Profil mis à jour avec succès', 'success');
    };

    const handleChangePassword = () => {
        if (!passwords.current || !passwords.new || !passwords.confirm) {
            showToast('⚠️ Veuillez remplir tous les champs', 'error'); // Changed to error as warning might not be supported
            return;
        }
        if (passwords.new !== passwords.confirm) {
            showToast('❌ Les mots de passe ne correspondent pas', 'error');
            return;
        }
        showToast('🔒 Mot de passe modifié', 'success');
        setPasswords({ current: '', new: '', confirm: '' });
    };

    return (
        <div style={{
            position: 'relative',
            minHeight: '100vh',
            // CSS Variable Mapping: User's --cosmic- variables mapped to our ThemeContext variables
            '--cosmic-bg-primary': 'var(--bg-primary)',
            '--cosmic-bg-secondary': 'var(--bg-secondary)',
            '--cosmic-bg-card': 'var(--card-bg)',
            '--cosmic-text-primary': 'var(--text-primary)',
            '--cosmic-text-secondary': 'var(--text-secondary)',
            '--cosmic-border': 'var(--border-color)',
            '--cosmic-accent': 'var(--accent-primary)',
            '--cosmic-accent-2': 'var(--accent-secondary)',
            '--cosmic-shadow': '0 10px 40px rgba(0,0,0,0.5)',
        } as React.CSSProperties}>
            <Navbar />

            {/* Main Container */}
            <div className="container" style={{ position: 'relative', zIndex: 1, padding: isMobile ? '20px 15px' : '40px 20px', maxWidth: '1000px', margin: '0 auto' }}>

                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: isMobile ? '30px' : '50px' }}>
                    <div style={{
                        width: isMobile ? '80px' : '120px', height: isMobile ? '80px' : '120px', margin: '0 auto 15px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, var(--cosmic-accent), var(--cosmic-accent-2))',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: isMobile ? '2rem' : '3em', color: 'white', fontWeight: 'bold',
                        boxShadow: '0 10px 30px rgba(102, 126, 234, 0.4)'
                    }}>
                        {user.username.charAt(0).toUpperCase()}
                    </div>
                    <h1 style={{
                        fontSize: isMobile ? '1.8rem' : '2.5em',
                        fontWeight: 700,
                        color: 'var(--cosmic-text-primary)',
                        marginBottom: '8px'
                    }}>{user.username}</h1>
                    <div style={{
                        display: 'inline-block', padding: '4px 12px',
                        borderRadius: '20px', background: 'rgba(102, 126, 234, 0.1)',
                        border: '1px solid var(--cosmic-accent)', color: 'var(--cosmic-accent)',
                        fontSize: isMobile ? '0.8rem' : '0.9rem'
                    }}>{user.role}</div>
                </div>

                <div style={{ display: 'grid', gap: '30px' }}>

                    {/* Profile Section */}
                    <Section title="Informations Personnelles" icon="👤" description="Gérez votre identité">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div className="setting-item-modern">
                                <label style={{ display: 'block', marginBottom: '0.6rem', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Nom d'utilisateur</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    value={user.username}
                                    onChange={(e) => setUser({ ...user, username: e.target.value })}
                                />
                            </div>
                            <div className="setting-item-modern">
                                <label style={{ display: 'block', marginBottom: '0.6rem', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email</label>
                                <input
                                    type="email"
                                    className="input-field"
                                    value={user.email}
                                    onChange={(e) => setUser({ ...user, email: e.target.value })}
                                />
                            </div>
                            <button className="btn btn-primary" onClick={handleUpdateProfile} style={{ width: '100%', marginTop: '0.5rem' }}>
                                💾 Enregistrer les modifications
                            </button>
                        </div>
                    </Section>

                    {/* Security Section */}
                    <Section title="Sécurité" icon="🛡️" description="Protégez votre compte">
                        {/* ... existing password fields ... */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.6rem', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Mot de passe actuel</label>
                                <input
                                    type="password"
                                    className="input-field"
                                    value={passwords.current}
                                    onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                                    placeholder="••••••••"
                                />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '1.25rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.6rem', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Nouveau mot de passe</label>
                                    <input
                                        type="password"
                                        className="input-field"
                                        value={passwords.new}
                                        onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                                        placeholder="Min. 8 caractères"
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.6rem', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Confirmation</label>
                                    <input
                                        type="password"
                                        className="input-field"
                                        value={passwords.confirm}
                                        onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>
                            <button className="btn btn-secondary" onClick={handleChangePassword} style={{ width: '100%', marginTop: '0.5rem', justifyContent: 'center' }}>
                                🔒 Mettre à jour le secret
                            </button>
                        </div>
                    </Section>

                    {/* Subscription Section */}
                    <Section title="Abonnement" icon="💳" description="Détails de votre licence">
                        <div className="setting-item">
                            <div style={{ flex: 1 }}>
                                <h3 style={{ fontSize: '1.1rem', marginBottom: '5px' }}>Statut du plan</h3>
                                <p style={{ color: 'var(--cosmic-text-secondary)', fontSize: '0.9rem' }}>
                                    {user.subscription.status === 'active' ? '✅ Actif' : '❌ Inactif'} —
                                    {user.subscription.type === 'full' ? ' Licence Site Complète' : ' Paiement au module'}
                                </p>
                            </div>
                            <div style={{
                                padding: '8px 16px', borderRadius: '12px',
                                background: user.subscription.status === 'active' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                color: user.subscription.status === 'active' ? '#10b981' : '#ef4444',
                                fontWeight: 600
                            }}>
                                {user.subscription.cycle === 'annual' ? 'Annuel' : 'Mensuel'}
                            </div>
                        </div>

                        {user.subscription.type === 'per_module' && Array.isArray(user.subscription.modules) && (
                            <div className="setting-item" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                                <h3 style={{ fontSize: '1.1rem', marginBottom: '15px' }}>Modules activés</h3>
                                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                    {user.subscription.modules.map((m: string) => (
                                        <span key={m} style={{
                                            padding: '4px 12px', background: 'var(--cosmic-bg-primary)',
                                            borderRadius: '15px', border: '1px solid var(--cosmic-border)',
                                            fontSize: '0.8rem', color: 'var(--cosmic-text-primary)'
                                        }}>
                                            {m.replace('hugin_', 'Hugin ').replace('munin', 'Munin Atlas').toUpperCase()}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div style={{ textAlign: 'center', marginTop: '10px' }}>
                            <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
                                🔄 Gérer l'abonnement ou Upgrader
                            </button>
                        </div>
                    </Section>

                    {/* Tool Customization Section */}
                    {user.subscription.status === 'active' && (
                        <Section title="Personnalisation de l'interface" icon="🔧" description="Masquez les outils inutiles de vos disciplines">
                            <div style={{ display: 'grid', gap: '10px' }}>
                                {[
                                    { id: 'inventory', name: 'Stock & Inventaire (Core)' },
                                    { id: 'planning', name: 'Planning & Calendrier (Core)' },
                                    { id: 'messaging', name: 'Messagerie Interne (Core)' },
                                    { id: 'research', name: 'Cahier de Laboratoire (Lab)' },
                                    { id: 'biotools', name: 'Bio-informatique (Analysis)' },
                                    { id: 'sequence', name: 'Analyse de Séquences (Analysis)' }
                                ].map(tool => (
                                    <div key={tool.id} className="setting-item" style={{ padding: '15px 20px' }}>
                                        <span>{tool.name}</span>
                                        <button
                                            onClick={() => toggleToolVisibility(tool.id)}
                                            style={{
                                                padding: '6px 15px',
                                                borderRadius: '20px',
                                                background: user.hiddenTools.includes(tool.id) ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                                                color: user.hiddenTools.includes(tool.id) ? '#ef4444' : '#10b981',
                                                border: `1px solid ${user.hiddenTools.includes(tool.id) ? '#ef4444' : '#10b981'}`,
                                                fontSize: '0.8rem',
                                                cursor: 'pointer',
                                                transition: 'all 0.3s ease',
                                                minWidth: '80px'
                                            }}
                                        >
                                            {user.hiddenTools.includes(tool.id) ? 'Masqué' : 'Visible'}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </Section>
                    )}

                </div>
            </div>

            <style>{`
                .btn {
                    padding: 10px 20px;
                    border-radius: 10px;
                    font-weight: 600;
                    border: none;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 0.9em;
                }
                .btn-secondary {
                    background: var(--cosmic-bg-card);
                    color: var(--cosmic-text-primary);
                    border: 2px solid var(--cosmic-border);
                }
                .btn-secondary:hover {
                    border-color: var(--cosmic-accent);
                    transform: translateY(-2px);
                }
                .btn-primary {
                    background: linear-gradient(135deg, var(--cosmic-accent), var(--cosmic-accent-2));
                    color: white;
                    box-shadow: 0 5px 20px rgba(102, 126, 234, 0.3);
                    padding: 12px 30px;
                }
                .btn-primary:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 30px rgba(102, 126, 234, 0.5);
                }
                .settings-section {
                    background: var(--cosmic-bg-secondary);
                    border-radius: 20px;
                    padding: 30px;
                    border: 2px solid var(--cosmic-border);
                    box-shadow: var(--cosmic-shadow);
                    transition: all 0.3s ease;
                }
                .settings-section:hover {
                    border-color: var(--cosmic-accent);
                    transform: translateY(-3px);
                }
                .setting-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 20px;
                    background: var(--cosmic-bg-card);
                    border-radius: 15px;
                    border: 1px solid var(--cosmic-border);
                    margin-bottom: 15px;
                    transition: all 0.3s ease;
                }
                .setting-item:hover {
                    background: rgba(102, 126, 234, 0.05);
                    border-color: var(--cosmic-accent);
                }
                .text-input {
                    padding: 12px 18px;
                    background: var(--cosmic-bg-primary);
                    border: 2px solid var(--cosmic-border);
                    border-radius: 10px;
                    color: var(--cosmic-text-primary);
                    font-size: 1em;
                    transition: all 0.3s ease;
                }
                .text-input:focus {
                    border-color: var(--cosmic-accent);
                    outline: none;
                    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
                }
            `}</style>
        </div>
    );
};

// Helper Components
const Section = ({ title, icon, description, children }: any) => (
    <div className="settings-section">
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px', paddingBottom: '20px', borderBottom: '2px solid var(--cosmic-border)' }}>
            <span style={{ fontSize: '2em', filter: 'drop-shadow(0 0 10px rgba(102, 126, 234, 0.3))' }}>{icon}</span>
            <div>
                <h2 style={{ fontSize: '1.5em', fontWeight: 700, color: 'var(--cosmic-text-primary)' }}>{title}</h2>
                <p style={{ color: 'var(--cosmic-text-secondary)', fontSize: '0.9em', marginTop: '5px' }}>{description}</p>
            </div>
        </div>
        {children}
    </div>
);

export default Account;
