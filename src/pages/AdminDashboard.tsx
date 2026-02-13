import React, { useState, useEffect } from 'react';
import { useToast } from '../components/ToastContext';
import {
    LayoutDashboard, Users, CreditCard,
    CheckCircle, XCircle, AlertTriangle, Plus, Trash2, Edit
} from 'lucide-react';
import Navbar from '../components/Navbar';
import { useDeviceDetection } from '../hooks/useDeviceDetection';

interface UserData {
    username: string;
    role: string;
    permissions: string[];
    organizationId?: string;
}

interface OrgData {
    id: string;
    name: string;
    paymentStatus: 'paid' | 'pending' | 'late';
    lastPaymentDate: string | null;
    adminUser: string;
}

const AdminDashboard = () => {
    const [currentUser, setCurrentUser] = useState<string>('');
    const [role, setRole] = useState<string>('');
    const { showToast } = useToast();
    const { isMobile } = useDeviceDetection();

    // Data States
    const [orgUsers, setOrgUsers] = useState<UserData[]>([]);
    const [allOrgs, setAllOrgs] = useState<OrgData[]>([]);
    const [activeTab, setActiveTab] = useState<'users' | 'payments'>('users');

    useEffect(() => {
        const user = localStorage.getItem('currentUser');
        const userRole = localStorage.getItem('currentUserRole');

        if (user) setCurrentUser(user);
        if (userRole) setRole(userRole);

        loadData(userRole || '', user || '');
    }, [activeTab]);

    const loadData = (userRole: string, currentUsername: string) => {
        // Load Users
        const users: UserData[] = [];

        if (userRole === 'super_admin') {
            // Super admin: Load ALL users from local storage
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith('user_profile_')) {
                    try {
                        const profile = JSON.parse(localStorage.getItem(key) || '{}');
                        users.push({ ...profile, permissions: profile.permissions || [] });
                    } catch (e) { }
                }
            }
        } else {
            // Regular Admin: See users in their Organization
            const myProfileStr = localStorage.getItem(`user_profile_${currentUsername}`);
            if (myProfileStr) {
                const myProfile = JSON.parse(myProfileStr);
                const myOrgId = myProfile.organizationId;

                for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i);
                    if (key && key.startsWith('user_profile_')) {
                        try {
                            const profile = JSON.parse(localStorage.getItem(key) || '{}');
                            if (profile.organizationId === myOrgId) {
                                users.push({ ...profile, permissions: profile.permissions || [] });
                            }
                        } catch (e) { }
                    }
                }
            } else {
                // Fallback for hardcoded admin if separate profile not created
                users.push({ username: currentUsername, role: userRole, permissions: ['all'] });
            }
        }
        setOrgUsers(users);

        // Load Orgs for Super Admin
        if (userRole === 'super_admin') {
            const orgs: OrgData[] = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith('org_')) {
                    try {
                        const data = JSON.parse(localStorage.getItem(key) || '{}');
                        orgs.push({ id: key, ...data });
                    } catch (e) { }
                }
            }
            setAllOrgs(orgs);
        }
    };

    const [selectedModules, setSelectedModules] = useState<string[]>(['hugin_core']);

    const handleAddUser = (e: React.FormEvent) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const username = (form.elements.namedItem('username') as HTMLInputElement).value;
        const password = (form.elements.namedItem('password') as HTMLInputElement).value;
        const userRole = (form.elements.namedItem('role') as HTMLSelectElement).value;

        if (!username || !password) {
            showToast('Veuillez remplir tous les champs', 'error');
            return;
        }

        // Check if exists
        if (localStorage.getItem(`user_profile_${username}`)) {
            showToast('Utilisateur existant', 'error');
            return;
        }

        // Get Current Admin Org ID & Subscription base
        let orgId = 'default_org';
        let planType = 'per_module';
        const myProfileStr = localStorage.getItem(`user_profile_${currentUser}`);
        if (myProfileStr) {
            const myProfile = JSON.parse(myProfileStr);
            orgId = myProfile.organizationId;
            planType = myProfile.subscription?.planType || 'per_module';
        } else if (role === 'super_admin') {
            orgId = 'super_admin_org';
            planType = 'full';
        }

        const newUser = {
            username,
            password,
            role: userRole,
            permissions: userRole === 'admin' ? ['all'] : ['read'],
            organizationId: orgId,
            createdBy: currentUser,
            subscription: {
                status: 'active',
                planType: planType,
                modules: userRole === 'admin' ? 'all' : selectedModules
            }
        };

        localStorage.setItem(`user_profile_${username}`, JSON.stringify(newUser));
        showToast('Utilisateur créé avec succès', 'success');

        // Refresh data
        loadData(role, currentUser);
        form.reset();
        setSelectedModules(['hugin_core']);
    };

    const toggleModule = (mod: string) => {
        setSelectedModules(prev => prev.includes(mod) ? prev.filter(m => m !== mod) : [...prev, mod]);
    };

    const handleDeleteUser = (usernameToDelete: string) => {
        if (window.confirm(`Supprimer l'utilisateur ${usernameToDelete} ?`)) {
            localStorage.removeItem(`user_profile_${usernameToDelete}`);
            showToast('Utilisateur supprimé', 'success');
            loadData(role, currentUser);
        }
    };

    const StatusBadge = ({ status }: { status: string }) => {
        switch (status) {
            case 'paid': return <span style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '5px' }}><CheckCircle size={16} /> Payé</span>;
            case 'late': return <span style={{ color: '#ef4444', display: 'flex', alignItems: 'center', gap: '5px' }}><XCircle size={16} /> En retard</span>;
            default: return <span style={{ color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '5px' }}><AlertTriangle size={16} /> En attente</span>;
        }
    };

    if (!role) return <div style={{ padding: '2rem', textAlign: 'center' }}>Chargement...</div>;

    if (role !== 'admin' && role !== 'super_admin') {
        return (
            <div className="page-container">
                <Navbar />
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-error)' }}>
                    Accès non autorisé. Vous n'êtes pas administrateur.
                </div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', position: 'relative', paddingBottom: '4rem' }}>
            <Navbar />

            <div className="container" style={{ paddingTop: isMobile ? '1.5rem' : '2rem', paddingLeft: isMobile ? '10px' : '20px', paddingRight: isMobile ? '10px' : '20px' }}>
                <header style={{ marginBottom: isMobile ? '2rem' : '3rem', textAlign: 'center' }}>
                    <div style={{ display: 'inline-flex', padding: isMobile ? '0.75rem' : '1rem', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '1rem', marginBottom: isMobile ? '1rem' : '1.5rem', color: 'var(--accent-primary)' }}>
                        <LayoutDashboard size={isMobile ? 32 : 48} />
                    </div>
                    <h1 className="text-gradient" style={{ fontSize: isMobile ? '2rem' : '3rem', marginBottom: '0.5rem' }}>
                        {role === 'super_admin' ? 'Super Admin' : 'Admin'}
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: isMobile ? '0.95rem' : '1.2rem', maxWidth: '800px', margin: '0 auto', padding: isMobile ? '0 10px' : '0' }}>
                        Gestion des utilisateurs et monitoring des organismes.
                    </p>
                </header>

                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: isMobile ? '2rem' : '3rem' }}>
                    <div className="glass-panel" style={{ padding: isMobile ? '0.25rem' : '0.4rem', display: 'flex', gap: '0.25rem', borderRadius: isMobile ? '1rem' : '1.2rem', background: 'rgba(255, 255, 255, 0.05)' }}>
                        <button
                            onClick={() => setActiveTab('users')}
                            style={{
                                padding: isMobile ? '0.6rem 1rem' : '0.8rem 2rem',
                                borderRadius: isMobile ? '0.75rem' : '1rem',
                                background: activeTab === 'users' ? 'var(--accent-primary)' : 'transparent',
                                color: activeTab === 'users' ? 'white' : 'var(--text-secondary)',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                fontWeight: 600,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                fontSize: isMobile ? '0.85rem' : '1rem'
                            }}
                        >
                            <Users size={isMobile ? 16 : 18} /> {isMobile ? 'Comptes' : 'Utilisateurs'}
                        </button>
                        {role === 'super_admin' && (
                            <button
                                onClick={() => setActiveTab('payments')}
                                style={{
                                    padding: isMobile ? '0.6rem 1rem' : '0.8rem 2rem',
                                    borderRadius: isMobile ? '0.75rem' : '1rem',
                                    background: activeTab === 'payments' ? 'var(--accent-primary)' : 'transparent',
                                    color: activeTab === 'payments' ? 'white' : 'var(--text-secondary)',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    fontWeight: 600,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    fontSize: isMobile ? '0.85rem' : '1rem'
                                }}
                            >
                                <CreditCard size={isMobile ? 16 : 18} /> {isMobile ? 'Orgs' : 'Organismes'}
                            </button>
                        )}
                    </div>
                </div>

                {/* USERS TAB */}
                {activeTab === 'users' && (
                    <div className="glass-panel" style={{ padding: isMobile ? '1.5rem 1rem' : '2.5rem', animation: 'fadeIn 0.5s ease-out' }}>
                        <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'flex-end', marginBottom: '2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.5rem', gap: isMobile ? '1rem' : '0' }}>
                            <div>
                                <h2 style={{ fontSize: isMobile ? '1.4rem' : '1.8rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <Users className="text-gradient" /> {isMobile ? 'Comptes' : 'Liste des Comptes'}
                                </h2>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                    {role === 'super_admin' ? 'Aperçu global du système.' : 'Gestion des membres.'}
                                </p>
                            </div>
                            <div style={{ textAlign: isMobile ? 'left' : 'right' }}>
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Licences actives</span>
                                <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--accent-primary)' }}>
                                    {orgUsers.length} <small style={{ fontSize: '0.7rem', opacity: 0.6 }}>/ {role === 'super_admin' ? '∞' : '10'}</small>
                                </div>
                            </div>
                        </div>

                        {/* Add User Form */}
                        <form onSubmit={handleAddUser} style={{ marginBottom: isMobile ? '2rem' : '3rem', padding: isMobile ? '1.25rem' : '2rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', borderRadius: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', alignItems: 'end' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Email / Identifiant</label>
                                <input name="username" type="text" className="input-field" placeholder="ex: jean.dupont@lab.fr" style={{ marginBottom: 0, fontSize: '0.9rem' }} required />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Mot de passe initial</label>
                                <input name="password" type="password" className="input-field" placeholder="••••••••" style={{ marginBottom: 0, fontSize: '0.9rem' }} required />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Rôle système</label>
                                <select name="role" className="input-field" style={{ marginBottom: 0, fontSize: '0.9rem' }}>
                                    <option value="user">Utilisateur Standard</option>
                                    <option value="admin">Administrateur</option>
                                </select>
                            </div>
                            <div style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '1rem', fontSize: '0.9rem', fontWeight: 600 }}>Accès Hugin ( Disciplines )</label>
                                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                    {[
                                        { id: 'hugin_core', label: 'Core / Management' },
                                        { id: 'hugin_lab', label: 'Lab / Research' },
                                        { id: 'hugin_analysis', label: 'Analysis / Bio' }
                                    ].map(mod => (
                                        <label key={mod.id} style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            padding: '0.5rem 1rem',
                                            background: selectedModules.includes(mod.id) ? 'rgba(99, 102, 241, 0.1)' : 'rgba(255,255,255,0.02)',
                                            border: '1px solid',
                                            borderColor: selectedModules.includes(mod.id) ? 'var(--accent-primary)' : 'var(--border-color)',
                                            borderRadius: '0.75rem',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s'
                                        }}>
                                            <input
                                                type="checkbox"
                                                checked={selectedModules.includes(mod.id)}
                                                onChange={() => toggleModule(mod.id)}
                                                style={{ display: 'none' }}
                                            />
                                            <div style={{
                                                width: '18px',
                                                height: '18px',
                                                borderRadius: '4px',
                                                border: '2px solid var(--accent-primary)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                background: selectedModules.includes(mod.id) ? 'var(--accent-primary)' : 'transparent'
                                            }}>
                                                {selectedModules.includes(mod.id) && <Plus size={14} color="white" />}
                                            </div>
                                            <span style={{ fontSize: '0.85rem' }}>{mod.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 2rem' }}>
                                <Plus size={20} /> Créer le compte
                            </button>
                        </form>

                        <div style={{ overflowX: 'auto', margin: '0 -1rem', padding: '0 1rem' }}>
                            <table style={{ width: '100%', minWidth: isMobile ? '600px' : 'auto', borderCollapse: 'separate', borderSpacing: '0 0.75rem' }}>
                                <thead>
                                    <tr style={{ color: 'var(--text-secondary)', textAlign: 'left', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                        <th style={{ padding: '1rem 1.5rem' }}>Utilisateur</th>
                                        <th style={{ padding: '1rem 1.5rem' }}>Rôle</th>
                                        <th style={{ padding: '1rem 1.5rem' }}>Accès Hugin</th>
                                        <th style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orgUsers.map((user, idx) => (
                                        <tr key={idx} className="table-row-hover" style={{ background: 'rgba(255,255,255,0.02)', transition: 'all 0.2s' }}>
                                            <td style={{ padding: '1.25rem 1.5rem', borderTopLeftRadius: '1rem', borderBottomLeftRadius: '1rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 800, color: 'white' }}>
                                                        {user.username.charAt(0).toUpperCase()}
                                                    </div>
                                                    <span style={{ fontWeight: 600 }}>{user.username}</span>
                                                </div>
                                            </td>
                                            <td style={{ padding: '1.25rem 1.5rem' }}>
                                                <span style={{
                                                    padding: '0.3rem 0.75rem',
                                                    borderRadius: '2rem',
                                                    background: user.role === 'admin' ? 'rgba(99, 102, 241, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                                                    color: user.role === 'admin' ? 'var(--accent-primary)' : '#10b981',
                                                    fontSize: '0.7rem',
                                                    fontWeight: 700,
                                                    textTransform: 'uppercase',
                                                    border: `1px solid ${user.role === 'admin' ? 'rgba(99, 102, 241, 0.2)' : 'rgba(16, 185, 129, 0.2)'}`
                                                }}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td style={{ padding: '1.25rem 1.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                                                {user.permissions.join(', ')}
                                            </td>
                                            <td style={{ padding: '1.25rem 1.5rem', borderTopRightRadius: '1rem', borderBottomRightRadius: '1rem', textAlign: 'right' }}>
                                                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                                    <button className="btn-icon" title="Éditer"><Edit size={16} /></button>
                                                    <button onClick={() => handleDeleteUser(user.username)} className="btn-icon delete" title="Supprimer"><Trash2 size={16} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {orgUsers.length === 0 && (
                                        <tr><td colSpan={4} style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-secondary)', opacity: 0.5 }}>Aucun utilisateur enregistré.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* PAYMENTS TAB (Super Admin Only) */}
                {activeTab === 'payments' && role === 'super_admin' && (
                    <div className="glass-panel" style={{ padding: '2.5rem', animation: 'fadeIn 0.5s ease-out' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.5rem' }}>
                            <div>
                                <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <CreditCard className="text-gradient" /> Suivi des Organismes
                                </h2>
                                <p style={{ color: 'var(--text-secondary)' }}>Monitoring de la facturation et de l'état des abonnements par structure.</p>
                            </div>
                            <div style={{ padding: '0.75rem 1.5rem', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '1rem', border: '1px solid rgba(99, 102, 241, 0.2)', color: 'var(--accent-primary)', fontWeight: 600 }}>
                                {allOrgs.length} Organismes enregistrés
                            </div>
                        </div>

                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 0.75rem' }}>
                                <thead>
                                    <tr style={{ color: 'var(--text-secondary)', textAlign: 'left', fontSize: '0.9rem' }}>
                                        <th style={{ padding: '1rem 1.5rem' }}>ORGANISME</th>
                                        <th style={{ padding: '1rem 1.5rem' }}>ADMINISTRATEUR</th>
                                        <th style={{ padding: '1rem 1.5rem' }}>STATUT PAIEMENT</th>
                                        <th style={{ padding: '1rem 1.5rem' }}>DERNIÈRE TRANSACTION</th>
                                        <th style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>ACTIONS</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {allOrgs.map(org => (
                                        <tr key={org.id} style={{ background: 'rgba(255,255,255,0.02)', transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'} onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}>
                                            <td style={{ padding: '1.25rem 1.5rem', borderTopLeftRadius: '1rem', borderBottomLeftRadius: '1rem' }}>
                                                <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{org.name}</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>ID: {org.id.split('_')[1]}</div>
                                            </td>
                                            <td style={{ padding: '1.25rem 1.5rem', color: 'var(--text-secondary)' }}>{org.adminUser}</td>
                                            <td style={{ padding: '1.25rem 1.5rem' }}>
                                                <StatusBadge status={org.paymentStatus} />
                                            </td>
                                            <td style={{ padding: '1.25rem 1.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                                {org.lastPaymentDate || <span style={{ opacity: 0.3 }}>N/A</span>}
                                            </td>
                                            <td style={{ padding: '1.25rem 1.5rem', borderTopRightRadius: '1rem', borderBottomRightRadius: '1rem', textAlign: 'right' }}>
                                                <button className="btn" style={{ padding: '0.5rem 1.25rem', borderRadius: '0.75rem', background: 'rgba(255,255,255,0.05)', fontSize: '0.8rem' }}>Modifier l'offre</button>
                                            </td>
                                        </tr>
                                    ))}
                                    {allOrgs.length === 0 && (
                                        <tr><td colSpan={5} style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-secondary)', opacity: 0.5 }}>Aucun organisme détecté dans la base de données Locale.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            <style>{`
                .btn-icon {
                    padding: 0.6rem;
                    border-radius: 0.75rem;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid var(--border-color);
                    color: var(--text-primary);
                    cursor: pointer;
                    transition: all 0.2s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .btn-icon:hover {
                    background: rgba(255, 255, 255, 0.1);
                    border-color: var(--accent-primary);
                    color: var(--accent-primary);
                }
                .btn-icon.delete:hover {
                    background: rgba(239, 68, 68, 0.1);
                    border-color: #ef4444;
                    color: #ef4444;
                }
                .table-row-hover:hover {
                    background: rgba(255, 255, 255, 0.04) !important;
                }
            `}</style>
        </div>
    );
};

export default AdminDashboard;
