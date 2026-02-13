import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../components/ThemeContext';
import { useDeviceDetection } from '../hooks/useDeviceDetection';
import {
    Building2, CreditCard, ChevronRight, CheckCircle,
    LayoutDashboard, Beaker, BookOpen, Activity, ShieldCheck,
    ArrowLeft, Eye, EyeOff, AlertCircle, Mail, Lock, Loader
} from 'lucide-react';
import {
    hashPassword,
    isValidEmail,
    SessionManager,
    RateLimiter
} from '../utils/encryption';

// Pricing Configuration
const MODULES = [
    { id: 'munin', name: 'Munin (Base de Connaissances)', price: 15, icon: <BookOpen size={20} />, description: 'Encyclopédie et gestion des entités' },
    { id: 'hugin_core', name: 'Hugin Core (Gestion)', price: 25, icon: <LayoutDashboard size={20} />, description: 'Plannings, Messagerie, Documents, Inventaire' },
    { id: 'hugin_lab', name: 'Hugin Lab (Laboratoire)', price: 45, icon: <Beaker size={20} />, description: 'Cultures, Recherches, Cahier de Labo, Stocks' },
    { id: 'hugin_analysis', name: 'Hugin Analysis (Analyses)', price: 60, icon: <Activity size={20} />, description: 'Outils d\'analyse poussés (Spectre, Flux, Cinétique)' },
];

const FULL_ACCESS_PRICE = 120; // Discounted bundle price
const ANNUAL_DISCOUNT = 0.20; // 20% off

const Login = () => {
    const navigate = useNavigate();
    const { loadThemeForUser } = useTheme(); // Use the hook
    const { isMobile } = useDeviceDetection();

    const [isLogin, setIsLogin] = useState(true);
    const [step, setStep] = useState(1);

    // Login State
    const [loginIdentifier, setLoginIdentifier] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [emailError, setEmailError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Rate limiter pour la connexion (5 tentatives par minute)
    const loginLimiter = new RateLimiter(5, 60000);

    // Signup State
    const [formData, setFormData] = useState({
        // Identity
        username: '',
        email: '',
        password: '',
        phone: '',

        // Structure
        orgName: '',
        establishments: 1,
        teams: 1,
        employeesPerTeam: 5,

        // Subscription
        billing: 'monthly' as 'monthly' | 'annual',
        planType: 'full' as 'full' | 'modules',
        selectedModules: [] as string[]
    });

    // Helper: Total Employees
    const totalEmployees = formData.teams * formData.employeesPerTeam;

    // Helper: Calculate Price
    const calculatePrice = () => {
        let basePricePerUser = 0;

        if (formData.planType === 'full') {
            basePricePerUser = FULL_ACCESS_PRICE;
        } else {
            basePricePerUser = MODULES
                .filter(m => formData.selectedModules.includes(m.id))
                .reduce((acc, m) => acc + m.price, 0);
        }

        let total = basePricePerUser * totalEmployees;

        // Annual Calculation (billed at once, but let's show monthly equivalent or total annual cost)
        // User asked for "monthly and annual depending on complexity".
        // Let's calculate the TOTAL bill amount.

        if (formData.billing === 'annual') {
            total = total * 12 * (1 - ANNUAL_DISCOUNT);
        }

        return {
            perUser: basePricePerUser,
            total: Math.round(total),
            isAnnual: formData.billing === 'annual'
        };
    };

    const price = calculatePrice();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation de l'email
        if (!isValidEmail(loginIdentifier) && !['admin', 'ethan@OLS.com', 'bastien@OLS.com', 'issam@OLS.com'].includes(loginIdentifier)) {
            setEmailError('Format d\'email invalide');
            setErrorMessage('Veuillez entrer un email valide');
            return;
        }
        setEmailError('');

        // Rate limiting
        if (!loginLimiter.checkLimit(loginIdentifier)) {
            setErrorMessage('Trop de tentatives. Veuillez patienter avant de réessayer.');
            return;
        }

        setIsSubmitting(true);
        setErrorMessage('');

        try {
            // 1. Check Hardcoded Super Admins
            if (['ethan@OLS.com', 'bastien@OLS.com', 'issam@OLS.com'].includes(loginIdentifier)) {
                if (loginPassword === loginIdentifier.split('@')[0] + '123') {
                    localStorage.setItem('currentUser', loginIdentifier);
                    localStorage.setItem('currentUserRole', 'super_admin');
                    
                    // Créer session sécurisée
                    SessionManager.createSession(loginIdentifier);
                    
                    loadThemeForUser(loginIdentifier);
                    navigate('/home');
                    return;
                }
            }

            // 2. Check LocalStorage avec mot de passe hashé
            const userProfileStr = localStorage.getItem(`user_profile_${loginIdentifier}`);
            if (userProfileStr) {
                const userProfile = JSON.parse(userProfileStr);
                const hashedInputPassword = await hashPassword(loginPassword);
                
                if (userProfile.password === hashedInputPassword) {
                    localStorage.setItem('currentUser', loginIdentifier);
                    localStorage.setItem('currentUserRole', userProfile.role || 'user');
                    
                    // Créer session sécurisée
                    SessionManager.createSession(loginIdentifier);
                    
                    loadThemeForUser(loginIdentifier);
                    navigate('/home');
                    return;
                }
            }

            // 3. Fallback for basic predefined users (admin/user)
            if (loginIdentifier === 'admin' && loginPassword === 'admin123') {
                localStorage.setItem('currentUser', 'admin');
                localStorage.setItem('currentUserRole', 'admin');
                
                // Créer session sécurisée
                SessionManager.createSession('admin');
                
                loadThemeForUser('admin');
                navigate('/home');
                return;
            }

            setErrorMessage('❌ Identifiants incorrects');
        } catch (error) {
            console.error('Login error:', error);
            setErrorMessage('Une erreur est survenue lors de la connexion');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSignupSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Create User Profile
        const newUserProfile = {
            username: formData.email, // Use email as username
            password: formData.password,
            phone: formData.phone,
            role: 'admin', // Organization Admin
            organizationId: `org_${Date.now()}`,
            firstName: formData.username,
            permissions: ['all_org_access']
        };

        // Create Organization Data with Subscription
        const newOrgData = {
            id: newUserProfile.organizationId,
            name: formData.orgName,
            structure: {
                establishments: formData.establishments,
                teams: formData.teams,
                employeesPerTeam: formData.employeesPerTeam,
                totalEmployees
            },
            subscription: {
                billing: formData.billing,
                planType: formData.planType,
                modules: formData.planType === 'full' ? 'all' : formData.selectedModules,
                price: price.total,
                status: 'active'
            },
            paymentStatus: 'pending', // Awaiting payment
            adminUser: formData.email,
            creationDate: new Date().toISOString()
        };

        // Save
        localStorage.setItem(`user_profile_${formData.email}`, JSON.stringify(newUserProfile));
        localStorage.setItem(`org_${newUserProfile.organizationId}`, JSON.stringify(newOrgData));

        // Auto Login
        localStorage.setItem('currentUser', formData.email);
        localStorage.setItem('currentUserRole', 'admin');
        localStorage.setItem('firstTimeLogin', 'true');
        loadThemeForUser(formData.email);
        navigate('/home');
    };

    const nextStep = () => setStep(s => s + 1);
    const prevStep = () => setStep(s => s - 1);

    const updateAuthMode = (mode: boolean) => {
        setIsLogin(mode);
        setStep(1);
    };

    return (
        <div className="login-container" style={{
            minHeight: '100vh',
            width: '100vw',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--bg-primary)',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Background Effects */}
            {/* Background Effects */}
            <div className="orbital-ring" style={{ position: 'absolute', width: '800px', height: '800px', opacity: 0.1, borderRadius: '50%', border: '2px solid var(--accent-primary)', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', pointerEvents: 'none' }}></div>
            <div className="orbital-ring" style={{ position: 'absolute', width: '600px', height: '600px', animationDirection: 'reverse', opacity: 0.1, borderRadius: '50%', border: '2px dashed var(--accent-secondary)', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', pointerEvents: 'none' }}></div>

            <div className="card glass-panel" style={{
                width: isMobile ? '95%' : '100%',
                maxWidth: isLogin ? '400px' : '800px',
                padding: '0',
                position: 'relative',
                zIndex: 1,
                transition: 'all 0.5s ease',
                overflow: 'hidden',
                borderRadius: isMobile ? '1rem' : '1.5rem',
                margin: isMobile ? '1rem' : '0'
            }}>

                {/* Header - Pillar 1: Clarity */}
                <div style={{
                    padding: isMobile ? '1.5rem 1rem' : '2.5rem 2rem',
                    background: 'rgba(255, 255, 255, 0.02)',
                    textAlign: 'center',
                    borderBottom: '1px solid var(--border-color)'
                }}>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '1rem',
                        marginBottom: '1rem'
                    }}>
                        <img src="/logo1.png" alt="Odin Logo" style={{ width: isMobile ? '80px' : '100px', height: 'auto', filter: 'drop-shadow(0 0 10px rgba(99, 102, 241, 0.3))' }} />
                        <h1 className="text-gradient" style={{ fontSize: isMobile ? '1.5rem' : '2rem', fontWeight: 800 }}>
                            Odin La Science
                        </h1>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5, maxWidth: '280px', margin: '0 auto' }}>
                        {isLogin ? 'Accédez à votre laboratoire numérique' : 'Configurez votre espace de recherche'}
                    </p>
                </div>

                <div style={{ padding: isMobile ? '1.5rem' : '2rem' }}>
                    {isLogin ? (
                        /* LOGIN FORM */
                        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div style={{ position: 'relative' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Identifiant</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    value={loginIdentifier}
                                    onChange={(e) => {
                                        setLoginIdentifier(e.target.value);
                                        if (errorMessage) setErrorMessage('');
                                    }}
                                    placeholder="nom@OLS.com"
                                    required
                                />
                            </div>
                            <div style={{ position: 'relative' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Mot de passe</label>
                                <input
                                    type="password"
                                    className="input-field"
                                    value={loginPassword}
                                    onChange={(e) => {
                                        setLoginPassword(e.target.value);
                                        if (errorMessage) setErrorMessage('');
                                    }}
                                    placeholder="••••••••"
                                    required
                                />
                            </div>

                            {errorMessage && (
                                <div style={{
                                    color: '#ef4444',
                                    fontSize: '0.85rem',
                                    textAlign: 'center',
                                    padding: '0.75rem',
                                    background: 'rgba(239, 68, 68, 0.1)',
                                    borderRadius: '0.75rem',
                                    border: '1px solid rgba(239, 68, 68, 0.2)',
                                    animation: 'fadeInUp 0.3s ease'
                                }}>
                                    {errorMessage}
                                </div>
                            )}

                            <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem', width: '100%' }}>
                                Déverrouiller l'accès
                            </button>

                            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                    Première visite ? <br />
                                    <button type="button" onClick={() => navigate('/register')} style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', cursor: 'pointer', fontWeight: 700, marginTop: '0.5rem', fontSize: '1rem' }}>
                                        Créer une organisation
                                    </button>
                                </p>
                            </div>
                        </form>
                    ) : (
                        /* SIGNUP WIZARD */
                        <div>
                            {/* Wizard Progress */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', position: 'relative' }}>
                                <div style={{ position: 'absolute', top: '15px', left: 0, right: 0, height: '2px', background: 'var(--border-color)', zIndex: 0 }}></div>
                                {[1, 2, 3, 4].map(s => (
                                    <div key={s} style={{
                                        width: '32px', height: '32px', borderRadius: '50%',
                                        background: step >= s ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                                        border: `2px solid ${step >= s ? 'var(--accent-primary)' : 'var(--border-color)'}`,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        zIndex: 1, position: 'relative',
                                        color: step >= s ? 'white' : 'var(--text-secondary)', fontWeight: 700
                                    }}>
                                        {s}
                                    </div>
                                ))}
                            </div>

                            {/* Forms */}
                            <form onSubmit={handleSignupSubmit}>
                                {/* STEP 1: IDENTITY */}
                                {step === 1 && (
                                    <div className="wizard-step" style={{ animation: 'fadeIn 0.5s' }}>
                                        <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}><ShieldCheck size={20} /> Informations Admin</h3>
                                        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? '1rem' : '1.5rem' }}>
                                            <div>
                                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Nom complet</label>
                                                <input type="text" className="input-field" required
                                                    value={formData.username} onChange={e => setFormData({ ...formData, username: e.target.value })} />
                                            </div>
                                            <div>
                                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Email Professionnel</label>
                                                <input type="email" className="input-field" required
                                                    value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                                            </div>
                                            <div>
                                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Mot de passe</label>
                                                <input type="password" className="input-field" required
                                                    value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />
                                            </div>
                                            <div>
                                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Téléphone</label>
                                                <input type="tel" className="input-field" required
                                                    value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* STEP 2: ORGANIZATION STRUCTURE */}
                                {step === 2 && (
                                    <div className="wizard-step" style={{ animation: 'fadeIn 0.5s' }}>
                                        <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}><Building2 size={20} /> Structure de l'Organisation</h3>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                            <div>
                                                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Nom de l'Organisation</label>
                                                <input type="text" className="input-field" required
                                                    value={formData.orgName} onChange={e => setFormData({ ...formData, orgName: e.target.value })} />
                                            </div>
                                            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr', gap: isMobile ? '0.75rem' : '1rem' }}>
                                                <div>
                                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem' }}>Établissements</label>
                                                    <input type="number" min="1" className="input-field" required
                                                        value={formData.establishments} onChange={e => setFormData({ ...formData, establishments: parseInt(e.target.value) })} />
                                                </div>
                                                <div>
                                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem' }}>Équipes Total</label>
                                                    <input type="number" min="1" className="input-field" required
                                                        value={formData.teams} onChange={e => setFormData({ ...formData, teams: parseInt(e.target.value) })} />
                                                </div>
                                                <div>
                                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem' }}>Employés / Équipe</label>
                                                    <input type="number" min="1" className="input-field" required
                                                        value={formData.employeesPerTeam} onChange={e => setFormData({ ...formData, employeesPerTeam: parseInt(e.target.value) })} />
                                                </div>
                                            </div>
                                            <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '1rem', textAlign: 'center' }}>
                                                <span style={{ color: 'var(--text-secondary)' }}>Total Utilisateurs estimés : </span>
                                                <strong style={{ color: 'var(--accent-primary)', fontSize: '1.2rem' }}>{totalEmployees}</strong>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* STEP 3: SUBSCRIPTION */}
                                {step === 3 && (
                                    <div className="wizard-step" style={{ animation: 'fadeIn 0.5s' }}>
                                        <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}><CreditCard size={20} /> Offre & Modules</h3>

                                        {/* Frequency Toggle */}
                                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem', background: 'var(--bg-secondary)', padding: '0.5rem', borderRadius: '2rem', width: 'fit-content', margin: '0 auto 2rem' }}>
                                            <button type="button"
                                                onClick={() => setFormData({ ...formData, billing: 'monthly' })}
                                                className={`btn ${formData.billing === 'monthly' ? 'btn-primary' : 'btn-ghost'}`}
                                                style={{ borderRadius: '1.5rem', padding: '0.5rem 1.5rem' }}>Mensuel</button>
                                            <button type="button"
                                                onClick={() => setFormData({ ...formData, billing: 'annual' })}
                                                className={`btn ${formData.billing === 'annual' ? 'btn-primary' : 'btn-ghost'}`}
                                                style={{ borderRadius: '1.5rem', padding: '0.5rem 1.5rem' }}>Annuel (-20%)</button>
                                        </div>

                                        {/* Plan Type Toggle */}
                                        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                                            <div
                                                onClick={() => setFormData({ ...formData, planType: 'full' })}
                                                style={{
                                                    padding: isMobile ? '1rem' : '1.5rem', borderRadius: '1rem', cursor: 'pointer', border: '1px solid',
                                                    borderColor: formData.planType === 'full' ? 'var(--accent-primary)' : 'var(--border-color)',
                                                    background: formData.planType === 'full' ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                                                    textAlign: 'center'
                                                }}>
                                                <h4 style={{ marginBottom: '0.5rem', fontSize: isMobile ? '1rem' : '1.1rem' }}>Accès Complet</h4>
                                                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Tous les modules</p>
                                                <div style={{ marginTop: '1rem', fontWeight: 700, fontSize: isMobile ? '1.1rem' : '1.2rem', color: 'var(--accent-primary)' }}>{FULL_ACCESS_PRICE}€ <span style={{ fontSize: '0.8rem', fontWeight: 400 }}>/ user</span></div>
                                            </div>
                                            <div
                                                onClick={() => setFormData({ ...formData, planType: 'modules' })}
                                                style={{
                                                    padding: isMobile ? '1rem' : '1.5rem', borderRadius: '1rem', cursor: 'pointer', border: '1px solid',
                                                    borderColor: formData.planType === 'modules' ? 'var(--accent-primary)' : 'var(--border-color)',
                                                    background: formData.planType === 'modules' ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                                                    textAlign: 'center'
                                                }}>
                                                <h4 style={{ marginBottom: '0.5rem', fontSize: isMobile ? '1rem' : '1.1rem' }}>À la carte</h4>
                                                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Sélectionnez outils</p>
                                                <div style={{ marginTop: '1rem', fontWeight: 700, fontSize: isMobile ? '1.1rem' : '1.2rem' }}>De {Math.min(...MODULES.map(m => m.price))}€</div>
                                            </div>
                                        </div>

                                        {/* Module Selection (if 'modules') */}
                                        {formData.planType === 'modules' && (
                                            <div style={{ display: 'grid', gap: '0.75rem' }}>
                                                {MODULES.map(module => (
                                                    <div key={module.id}
                                                        onClick={() => {
                                                            const current = formData.selectedModules;
                                                            const updated = current.includes(module.id)
                                                                ? current.filter(id => id !== module.id)
                                                                : [...current, module.id];
                                                            setFormData({ ...formData, selectedModules: updated });
                                                        }}
                                                        style={{
                                                            display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', borderRadius: '0.75rem',
                                                            border: '1px solid var(--border-color)', cursor: 'pointer',
                                                            background: formData.selectedModules.includes(module.id) ? 'rgba(255,255,255,0.05)' : 'transparent'
                                                        }}>
                                                        <div style={{
                                                            width: '20px', height: '20px', borderRadius: '4px', border: '2px solid var(--border-color)',
                                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                            background: formData.selectedModules.includes(module.id) ? 'var(--accent-primary)' : 'transparent',
                                                            borderColor: formData.selectedModules.includes(module.id) ? 'var(--accent-primary)' : 'var(--border-color)'
                                                        }}>
                                                            {formData.selectedModules.includes(module.id) && <CheckCircle size={14} color="white" />}
                                                        </div>
                                                        <div style={{ flex: 1 }}>
                                                            <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{module.name}</div>
                                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{module.description}</div>
                                                        </div>
                                                        <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{module.price}€</div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* STEP 4: SUMMARY & VALIDATION */}
                                {step === 4 && (
                                    <div className="wizard-step" style={{ animation: 'fadeIn 0.5s' }}>
                                        <h3 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Récapitulatif</h3>

                                        <div className="glass-panel" style={{ padding: isMobile ? '1rem' : '1.5rem', marginBottom: '1.5rem' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: isMobile ? '0.85rem' : '1rem' }}>
                                                <span style={{ color: 'var(--text-secondary)' }}>Organisation</span>
                                                <strong style={{ textAlign: 'right' }}>{formData.orgName}</strong>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: isMobile ? '0.85rem' : '1rem' }}>
                                                <span style={{ color: 'var(--text-secondary)' }}>Utilisateurs</span>
                                                <strong>{totalEmployees}</strong>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: isMobile ? '0.85rem' : '1rem' }}>
                                                <span style={{ color: 'var(--text-secondary)' }}>Formule</span>
                                                <strong style={{ textAlign: 'right' }}>{formData.planType === 'full' ? 'Complet' : 'Sur Mesure'}</strong>
                                            </div>
                                            <div className="divider" style={{ margin: '1rem 0' }}></div>
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Total Estimé ({formData.billing})</span>
                                                <span style={{ fontSize: isMobile ? '1.5rem' : '2rem', fontWeight: 800, color: '#10b981' }}>{price.total}€</span>
                                                {formData.billing === 'annual' && <span style={{ color: '#10b981', fontSize: '0.75rem' }}>Économie {(price.total / (1 - ANNUAL_DISCOUNT) * 0.2).toFixed(0)}€</span>}
                                            </div>
                                        </div>

                                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '1.5rem' }}>
                                            En cliquant sur "Confirmer & Payer", vous acceptez les CGV d'Odin La Science. Le paiement sera traité via Stripe (simulation).
                                        </p>
                                    </div>
                                )}

                                {/* Navigation Buttons */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
                                    {step > 1 ? (
                                        <button type="button" onClick={prevStep} className="btn btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <ArrowLeft size={18} /> Retour
                                        </button>
                                    ) : (
                                        <button type="button" onClick={() => updateAuthMode(true)} className="btn btn-ghost">
                                            Annuler
                                        </button>
                                    )}

                                    {step < 4 ? (
                                        <button type="button" onClick={nextStep} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            Suivant <ChevronRight size={18} />
                                        </button>
                                    ) : (
                                        <button type="submit" className="btn btn-primary" style={{ background: '#10b981', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            Confirmer & Payer <CheckCircle size={18} />
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>

            {/* Footer / Copyright */}
            <div style={{ position: 'absolute', bottom: '1rem', width: '100%', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.8rem', zIndex: 10 }}>
                © 2026 Odin La Science. Tous droits réservés.
            </div>
        </div>
    );
};

export default Login;
