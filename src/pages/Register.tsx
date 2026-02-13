import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../components/ThemeContext';
import { useToast } from '../components/ToastContext';
import { useDeviceDetection } from '../hooks/useDeviceDetection';
import { 
    checkPasswordStrength, 
    isValidEmail, 
    hashPassword,
    SessionManager,
    RateLimiter
} from '../utils/encryption';
import {
    Users, Building2, ChevronRight, CheckCircle,
    LayoutDashboard, Beaker, BookOpen, Activity, ShieldCheck,
    ArrowLeft, Package, Check, Layers, Eye, EyeOff, AlertCircle, Mail, Lock
} from 'lucide-react';

const MODULE_OPTIONS = [
    { id: 'munin', name: 'Munin Atlas', price: 250, icon: <BookOpen size={20} />, description: 'Encyclopédie scientifique et gestion des entités' },
    { id: 'hugin_core', name: 'Hugin Core', price: 450, icon: <LayoutDashboard size={20} />, description: 'Messagerie, Planning, Documents, Inventaire' },
    { id: 'hugin_lab', name: 'Hugin Lab', price: 850, icon: <Beaker size={20} />, description: 'Suivi de cultures, Recherches, Cahier de labo, Stocks' },
    { id: 'hugin_analysis', name: 'Hugin Analysis', price: 1200, icon: <Activity size={20} />, description: 'Spectrométrie, Cytométrie, Cinétique, Gels' },
];

const FULL_PACK_PRICE_25K = 2600;
const ANNUAL_DISCOUNT = 0.20;

const Register = () => {
    const navigate = useNavigate();
    const { theme, loadThemeForUser } = useTheme();
    const { showToast } = useToast();
    const { isMobile } = useDeviceDetection();
    const [step, setStep] = useState(1);
    const [isEnterprise, setIsEnterprise] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState({ score: 0, feedback: [] as string[] });
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const registrationLimiter = new RateLimiter(3, 60 * 60 * 1000);

    const [formData, setFormData] = useState({
        adminName: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',

        companyName: '',
        sections: 1,
        employees: 1,

        billingCycle: 'monthly' as 'monthly' | 'annual',
        planType: 'full' as 'full' | 'per_module',
        selectedModules: [] as string[],

        cardHolder: '',
        cardNumber: '',
        expiry: '',
        cvv: '',

        acceptTerms: false,
        acceptPrivacy: false
    });

    const c = theme.colors;
    const ds = theme.designSystem;

    const calculatePrice = () => {
        let basePrice = 0;

        if (formData.planType === 'full') {
            basePrice = FULL_PACK_PRICE_25K;
        } else {
            basePrice = MODULE_OPTIONS
                .filter(m => formData.selectedModules.includes(m.id))
                .reduce((acc, m) => acc + m.price, 0);
        }

        let total = basePrice;
        if (formData.billingCycle === 'annual') {
            total = total * 12 * (1 - ANNUAL_DISCOUNT);
        }

        return {
            perUser: isEnterprise ? Math.round(basePrice / formData.employees) : basePrice,
            totalMonthly: basePrice,
            finalPrice: Math.round(total)
        };
    };

    const cost = calculatePrice();

    const nextStep = () => {
        // Validation avant de passer à l'étape suivante
        if (step === 2) {
            // Valider l'email
            if (!isValidEmail(formData.email)) {
                setEmailError('Email invalide');
                showToast('Veuillez entrer un email valide', 'error');
                return;
            }
            setEmailError('');

            // Valider le mot de passe
            if (passwordStrength.score < 4) {
                setPasswordError('Mot de passe trop faible');
                showToast('Veuillez choisir un mot de passe plus fort', 'error');
                return;
            }

            if (formData.password !== formData.confirmPassword) {
                setPasswordError('Les mots de passe ne correspondent pas');
                showToast('Les mots de passe ne correspondent pas', 'error');
                return;
            }
            setPasswordError('');
        }

        if (step === 4 && formData.planType === 'per_module' && formData.selectedModules.length === 0) {
            showToast('Veuillez sélectionner au moins un module', 'error');
            return;
        }

        if (step === 1) setIsEnterprise(formData.companyName !== '');
        setStep(s => s + 1);
    };
    const prevStep = () => setStep(s => s - 1);

    // Validation en temps réel du mot de passe
    const handlePasswordChange = (password: string) => {
        setFormData({ ...formData, password });
        const strength = checkPasswordStrength(password);
        setPasswordStrength(strength);
    };

    // Validation en temps réel de l'email
    const handleEmailChange = (email: string) => {
        setFormData({ ...formData, email });
        if (email && !isValidEmail(email)) {
            setEmailError('Format d\'email invalide');
        } else {
            setEmailError('');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Vérifier le rate limiting
        if (!registrationLimiter.checkLimit(formData.email)) {
            showToast('Trop de tentatives. Veuillez réessayer plus tard.', 'error');
            return;
        }

        // Vérifier les conditions
        if (!formData.acceptTerms || !formData.acceptPrivacy) {
            showToast('Veuillez accepter les conditions d\'utilisation', 'error');
            return;
        }

        setIsSubmitting(true);

        try {
            // Hasher le mot de passe
            const hashedPassword = await hashPassword(formData.password);

            // Save Mock Profile
            const userProfile = {
                email: formData.email,
                password: hashedPassword,
                username: formData.email.split('@')[0],
                role: isEnterprise ? 'admin' : 'user',
                isEnterprise,
                subscription: {
                    status: 'active',
                    type: formData.planType,
                    cycle: formData.billingCycle,
                    modules: formData.planType === 'full' ? 'all' : formData.selectedModules
                },
                createdAt: new Date().toISOString()
            };

            localStorage.setItem(`user_profile_${formData.email}`, JSON.stringify(userProfile));
            localStorage.setItem('currentUser', formData.email);
            localStorage.setItem('currentUserRole', userProfile.role);

            // Créer une session sécurisée
            SessionManager.createSession(formData.email);

            showToast('🚀 Inscription réussie ! Bienvenue sur Odin la Science.', 'success');
            loadThemeForUser(formData.email);
            
            setTimeout(() => {
                navigate('/home');
            }, 1500);
        } catch (error) {
            console.error('Registration error:', error);
            showToast('Erreur lors de l\'inscription', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderStepIndicator = () => (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: isMobile ? '2rem' : '3rem', position: 'relative' }}>
            <div style={{ position: 'absolute', top: isMobile ? '12px' : '16px', left: 0, right: 0, height: '2px', background: c.borderColor, zIndex: 0 }}></div>
            {[1, 2, 3, 4, 5, 6].map(s => (
                <div key={s} style={{
                    width: isMobile ? '24px' : '32px', height: isMobile ? '24px' : '32px', borderRadius: '50%',
                    background: step >= s ? c.accentPrimary : c.bgSecondary,
                    border: `2px solid ${step >= s ? c.accentPrimary : c.borderColor}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 1, position: 'relative',
                    color: step >= s ? '#fff' : c.textSecondary,
                    fontWeight: 700, transition: 'all 0.3s ease',
                    boxShadow: step === s ? `0 0 10px ${c.accentPrimary}66` : 'none',
                    fontSize: isMobile ? '0.7rem' : '0.9rem'
                }}>
                    {step > s ? <Check size={isMobile ? 14 : 18} /> : s}
                </div>
            ))}
        </div>
    );

    return (
        <div className={isMobile ? "app-viewport" : ""} style={{
            minHeight: '100vh', width: '100vw', background: c.bgPrimary, color: c.textPrimary,
            fontFamily: ds.fontFamily, display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: !isMobile ? '40px 20px' : '0', position: 'relative', overflow: 'hidden'
        }}>
            {/* Background elements */}
            <div style={{ position: 'absolute', top: '10%', left: '5%', width: isMobile ? '200px' : '400px', height: isMobile ? '200px' : '400px', background: `${c.accentPrimary}08`, borderRadius: '50%', filter: 'blur(100px)' }}></div>
            <div style={{ position: 'absolute', bottom: '10%', right: '5%', width: isMobile ? '150px' : '300px', height: isMobile ? '150px' : '300px', background: `${c.accentHugin}08`, borderRadius: '50%', filter: 'blur(80px)' }}></div>

            <div className={isMobile ? "app-scrollbox" : ""} style={{
                width: '100%', maxWidth: isMobile ? 'none' : '900px',
                background: isMobile ? 'transparent' : c.cardBg,
                backdropFilter: isMobile ? 'none' : 'blur(20px)',
                borderRadius: isMobile ? '0' : ds.borderRadius,
                border: isMobile ? 'none' : `1px solid ${c.borderColor}`,
                boxShadow: isMobile ? 'none' : '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                overflow: 'visible', zIndex: 1,
                paddingBottom: isMobile ? '100px' : '0' // Space for fixed buttons on mobile
            }}>
                {/* Header - Mobile vs Desktop */}
                <div style={{
                    padding: isMobile ? '40px 20px 20px' : '3rem 2rem',
                    background: isMobile ? 'transparent' : 'rgba(255, 255, 255, 0.02)',
                    textAlign: 'center',
                    borderBottom: isMobile ? 'none' : `1px solid ${c.borderColor}`
                }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                        <img src="/logo1.png" alt="Odin" style={{ height: isMobile ? '50px' : '80px', filter: 'drop-shadow(0 0 10px rgba(99, 102, 241, 0.2))' }} />
                        <h1 style={{ fontSize: isMobile ? '1.25rem' : '2.25rem', fontWeight: 800, background: `linear-gradient(135deg, ${c.accentPrimary}, ${c.accentSecondary})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            Odin la Science
                        </h1>
                    </div>
                </div>

                <div style={{ padding: isMobile ? '15px' : '40px' }}>
                    {renderStepIndicator()}

                    <form onSubmit={handleSubmit} style={{ position: 'relative' }}>
                        {/* STEP 1: ACCOUNT TYPE */}
                        {step === 1 && (
                            <div style={{ animation: 'fadeInUp 0.4s ease-out' }}>
                                <h2 style={{ fontSize: isMobile ? '1.2rem' : '1.5rem', marginBottom: '2rem', textAlign: 'center', fontWeight: 800 }}>Type de profil</h2>
                                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: isMobile ? '1rem' : '1.5rem' }}>
                                    <div
                                        onClick={() => { setIsEnterprise(false); setFormData({ ...formData, companyName: '' }); }}
                                        className="card-native"
                                        style={{
                                            padding: isMobile ? '1.5rem' : '2rem', borderRadius: '1.5rem',
                                            border: `2px solid ${!isEnterprise ? c.accentPrimary : 'transparent'}`,
                                            background: !isEnterprise ? `${c.accentPrimary}15` : c.bgSecondary,
                                            cursor: 'pointer', transition: 'all 0.3s',
                                            display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
                                            boxShadow: !isEnterprise ? `0 10px 20px ${c.accentPrimary}22` : 'none'
                                        }}
                                    >
                                        <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '1.25rem', marginBottom: '1rem' }}>
                                            <Users size={isMobile ? 32 : 40} color={!isEnterprise ? c.accentPrimary : c.textSecondary} />
                                        </div>
                                        <h3 style={{ marginBottom: '0.5rem', fontSize: '1.1rem', fontWeight: 800 }}>Chercheur</h3>
                                        <p style={{ fontSize: '0.85rem', color: c.textSecondary, lineHeight: 1.4 }}>Indépendant ou étudiant</p>
                                    </div>
                                    <div
                                        onClick={() => setIsEnterprise(true)}
                                        className="card-native"
                                        style={{
                                            padding: isMobile ? '1.5rem' : '2rem', borderRadius: '1.5rem',
                                            border: `2px solid ${isEnterprise ? c.accentPrimary : 'transparent'}`,
                                            background: isEnterprise ? `${c.accentPrimary}15` : c.bgSecondary,
                                            cursor: 'pointer', transition: 'all 0.3s',
                                            display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
                                            boxShadow: isEnterprise ? `0 10px 20px ${c.accentPrimary}22` : 'none'
                                        }}
                                    >
                                        <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '1.25rem', marginBottom: '1rem' }}>
                                            <Building2 size={isMobile ? 32 : 40} color={isEnterprise ? c.accentPrimary : c.textSecondary} />
                                        </div>
                                        <h3 style={{ marginBottom: '0.5rem', fontSize: '1.1rem', fontWeight: 800 }}>Laboratoire</h3>
                                        <p style={{ fontSize: '0.85rem', color: c.textSecondary, lineHeight: 1.4 }}>Équipe ou Structure Pro</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* STEP 2: DETAILS */}
                        {step === 2 && (
                            <div style={{ animation: 'fadeInUp 0.4s ease-out' }}>
                                <h2 style={{ fontSize: isMobile ? '1.2rem' : '1.5rem', marginBottom: '1.5rem', fontWeight: 800 }}>{isEnterprise ? 'La structure' : 'Vos informations'}</h2>
                                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? '15px' : '20px' }}>
                                    <div style={{ gridColumn: isMobile ? 'auto' : 'span 2' }}>
                                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.8rem', fontWeight: 700, color: c.textSecondary, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                            {isEnterprise ? "Nom de l'établissement" : "Nom complet"}
                                        </label>
                                        <div style={{ position: 'relative' }}>
                                            <input
                                                type="text" required
                                                placeholder={isEnterprise ? "ex: BioEcoAgro Lab 42" : "ex: Jean Dupont"}
                                                style={{ width: '100%', padding: '16px', borderRadius: '1rem', border: `1px solid ${c.borderColor}`, background: c.bgSecondary, color: c.textPrimary, fontSize: '1rem' }}
                                                value={isEnterprise ? formData.companyName : formData.adminName}
                                                onChange={e => setFormData({ ...formData, [isEnterprise ? 'companyName' : 'adminName']: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    {isEnterprise && (
                                        <>
                                            <div>
                                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.8rem', fontWeight: 700, color: c.textSecondary, textTransform: 'uppercase' }}>Équipes</label>
                                                <input
                                                    type="number" min="1" required
                                                    style={{ width: '100%', padding: '16px', borderRadius: '1rem', border: `1px solid ${c.borderColor}`, background: c.bgSecondary, color: c.textPrimary }}
                                                    value={formData.sections}
                                                    onChange={e => setFormData({ ...formData, sections: parseInt(e.target.value) })}
                                                />
                                            </div>
                                            <div>
                                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.8rem', fontWeight: 700, color: c.textSecondary, textTransform: 'uppercase' }}>Effectif</label>
                                                <input
                                                    type="number" min="1" required
                                                    style={{ width: '100%', padding: '16px', borderRadius: '1rem', border: `1px solid ${c.borderColor}`, background: c.bgSecondary, color: c.textPrimary }}
                                                    value={formData.employees}
                                                    onChange={e => setFormData({ ...formData, employees: parseInt(e.target.value) })}
                                                />
                                            </div>
                                        </>
                                    )}

                                    <div>
                                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.8rem', fontWeight: 700, color: c.textSecondary, textTransform: 'uppercase' }}>
                                            <Mail size={14} style={{ display: 'inline', marginRight: '6px' }} />
                                            Email Professionnel
                                        </label>
                                        <div style={{ position: 'relative' }}>
                                            <input
                                                type="email" required placeholder="contact@lab.com"
                                                style={{ 
                                                    width: '100%', padding: '16px', borderRadius: '1rem', 
                                                    border: `2px solid ${emailError ? '#ef4444' : c.borderColor}`, 
                                                    background: c.bgSecondary, color: c.textPrimary 
                                                }}
                                                value={formData.email}
                                                onChange={e => handleEmailChange(e.target.value)}
                                            />
                                            {emailError && (
                                                <div style={{ 
                                                    position: 'absolute', right: '12px', top: '50%', 
                                                    transform: 'translateY(-50%)', color: '#ef4444' 
                                                }}>
                                                    <AlertCircle size={20} />
                                                </div>
                                            )}
                                        </div>
                                        {emailError && (
                                            <div style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <AlertCircle size={12} /> {emailError}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.8rem', fontWeight: 700, color: c.textSecondary, textTransform: 'uppercase' }}>
                                            <Lock size={14} style={{ display: 'inline', marginRight: '6px' }} />
                                            Mot de passe
                                        </label>
                                        <div style={{ position: 'relative' }}>
                                            <input
                                                type={showPassword ? 'text' : 'password'} 
                                                required 
                                                placeholder="••••••••"
                                                style={{ 
                                                    width: '100%', padding: '16px', paddingRight: '50px', borderRadius: '1rem', 
                                                    border: `2px solid ${passwordError ? '#ef4444' : c.borderColor}`, 
                                                    background: c.bgSecondary, color: c.textPrimary 
                                                }}
                                                value={formData.password}
                                                onChange={e => handlePasswordChange(e.target.value)}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                style={{
                                                    position: 'absolute', right: '12px', top: '50%',
                                                    transform: 'translateY(-50%)', background: 'none',
                                                    border: 'none', cursor: 'pointer', color: c.textSecondary,
                                                    padding: '4px', display: 'flex', alignItems: 'center'
                                                }}
                                            >
                                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                            </button>
                                        </div>
                                        {formData.password && (
                                            <div style={{ marginTop: '8px' }}>
                                                <div style={{ display: 'flex', gap: '4px', marginBottom: '6px' }}>
                                                    {[1, 2, 3, 4, 5, 6].map(level => (
                                                        <div
                                                            key={level}
                                                            style={{
                                                                flex: 1,
                                                                height: '4px',
                                                                borderRadius: '2px',
                                                                background: passwordStrength.score >= level
                                                                    ? passwordStrength.score <= 2 ? '#ef4444'
                                                                    : passwordStrength.score <= 4 ? '#f59e0b'
                                                                    : '#10b981'
                                                                    : 'rgba(255,255,255,0.1)',
                                                                transition: 'all 0.3s'
                                                            }}
                                                        />
                                                    ))}
                                                </div>
                                                <div style={{ fontSize: '0.75rem', color: c.textSecondary }}>
                                                    Force: {
                                                        passwordStrength.score <= 2 ? '❌ Faible' :
                                                        passwordStrength.score <= 4 ? '⚠️ Moyen' :
                                                        '✅ Fort'
                                                    }
                                                </div>
                                                {passwordStrength.feedback.length > 0 && (
                                                    <div style={{ fontSize: '0.7rem', color: '#f59e0b', marginTop: '4px' }}>
                                                        {passwordStrength.feedback.slice(0, 2).map((fb, i) => (
                                                            <div key={i}>• {fb}</div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    <div style={{ gridColumn: isMobile ? 'auto' : 'span 2' }}>
                                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.8rem', fontWeight: 700, color: c.textSecondary, textTransform: 'uppercase' }}>
                                            <Lock size={14} style={{ display: 'inline', marginRight: '6px' }} />
                                            Confirmer le mot de passe
                                        </label>
                                        <div style={{ position: 'relative' }}>
                                            <input
                                                type={showConfirmPassword ? 'text' : 'password'}
                                                required
                                                placeholder="••••••••"
                                                style={{
                                                    width: '100%', padding: '16px', paddingRight: '50px', borderRadius: '1rem',
                                                    border: `2px solid ${formData.confirmPassword && formData.password !== formData.confirmPassword ? '#ef4444' : c.borderColor}`,
                                                    background: c.bgSecondary, color: c.textPrimary
                                                }}
                                                value={formData.confirmPassword}
                                                onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                style={{
                                                    position: 'absolute', right: '12px', top: '50%',
                                                    transform: 'translateY(-50%)', background: 'none',
                                                    border: 'none', cursor: 'pointer', color: c.textSecondary,
                                                    padding: '4px', display: 'flex', alignItems: 'center'
                                                }}
                                            >
                                                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                            </button>
                                            {formData.confirmPassword && formData.password === formData.confirmPassword && (
                                                <div style={{
                                                    position: 'absolute', right: '50px', top: '50%',
                                                    transform: 'translateY(-50%)', color: '#10b981'
                                                }}>
                                                    <CheckCircle size={20} />
                                                </div>
                                            )}
                                        </div>
                                        {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                                            <div style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <AlertCircle size={12} /> Les mots de passe ne correspondent pas
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* STEP 3: BILLING CYCLE */}
                        {step === 3 && (
                            <div style={{ animation: 'fadeInUp 0.4s ease-out', textAlign: 'center' }}>
                                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', fontWeight: 800 }}>Cycle de facturation</h2>
                                <p style={{ color: c.textSecondary, marginBottom: '2.5rem' }}>Optimisez vos coûts</p>

                                <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'center', gap: isMobile ? '1rem' : '1.5rem', maxWidth: '600px', margin: '0 auto' }}>
                                    <div
                                        onClick={() => setFormData({ ...formData, billingCycle: 'monthly' })}
                                        className="card-native"
                                        style={{
                                            padding: isMobile ? '1.5rem' : '2.5rem', flex: 1, borderRadius: '1.5rem', position: 'relative', cursor: 'pointer',
                                            border: `2px solid ${formData.billingCycle === 'monthly' ? c.accentPrimary : 'transparent'}`,
                                            background: formData.billingCycle === 'monthly' ? `${c.accentPrimary}15` : c.bgSecondary,
                                            transition: 'all 0.3s', textAlign: 'center'
                                        }}
                                    >
                                        <div style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.25rem' }}>Mensuel</div>
                                        <div style={{ color: c.textSecondary, fontSize: '0.85rem' }}>Sans engagement</div>
                                    </div>
                                    <div
                                        onClick={() => setFormData({ ...formData, billingCycle: 'annual' })}
                                        className="card-native"
                                        style={{
                                            padding: isMobile ? '1.5rem' : '2.5rem', flex: 1, borderRadius: '1.5rem', position: 'relative', cursor: 'pointer',
                                            border: `2px solid ${formData.billingCycle === 'annual' ? c.accentPrimary : 'transparent'}`,
                                            background: formData.billingCycle === 'annual' ? `${c.accentPrimary}15` : c.bgSecondary,
                                            transition: 'all 0.3s', textAlign: 'center'
                                        }}
                                    >
                                        <div style={{ position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)', background: '#10b981', color: '#fff', fontSize: '0.7rem', padding: '4px 12px', borderRadius: '1rem', fontWeight: 800, whiteSpace: 'nowrap' }}>
                                            -20% ANNUEL
                                        </div>
                                        <div style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.25rem' }}>Annuel</div>
                                        <div style={{ color: c.textSecondary, fontSize: '0.85rem' }}>Facturation annuelle</div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* STEP 4: MODULE SELECTION */}
                        {step === 4 && (
                            <div style={{ animation: 'fadeInUp 0.4s ease-out' }}>
                                <h2 style={{ fontSize: '1.5rem', marginBottom: '2rem', fontWeight: 800 }}>Votre Pack</h2>

                                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? '15px' : '20px', marginBottom: '30px' }}>
                                    <div
                                        onClick={() => setFormData({ ...formData, planType: 'full' })}
                                        className="card-native"
                                        style={{
                                            padding: isMobile ? '20px' : '24px', borderRadius: '1.5rem', cursor: 'pointer', border: `2px solid ${formData.planType === 'full' ? c.accentPrimary : 'transparent'}`,
                                            background: formData.planType === 'full' ? `${c.accentPrimary}15` : c.bgSecondary, transition: 'all 0.3s'
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                                            <Package size={isMobile ? 20 : 24} color={c.accentPrimary} />
                                            <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Pack Intégral</h3>
                                        </div>
                                        <p style={{ fontSize: '0.8rem', color: c.textSecondary, marginBottom: '1rem' }}>Toutes les fonctionnalités incluses.</p>
                                        <div style={{ fontWeight: 800, fontSize: isMobile ? '1.25rem' : '1.5rem', color: c.accentPrimary }}>
                                            {formData.billingCycle === 'annual' 
                                                ? `${Math.round(FULL_PACK_PRICE_25K * 12 * (1 - ANNUAL_DISCOUNT))}€`
                                                : `${FULL_PACK_PRICE_25K}€`
                                            }
                                            <span style={{ fontSize: '0.8rem', fontWeight: 400, color: c.textSecondary }}>
                                                {formData.billingCycle === 'annual' ? ' / an' : ' / mois'}
                                            </span>
                                        </div>
                                        {formData.billingCycle === 'annual' && (
                                            <div style={{ fontSize: '0.75rem', color: '#10b981', marginTop: '0.5rem', fontWeight: 600 }}>
                                                Soit {Math.round(FULL_PACK_PRICE_25K * 12 * (1 - ANNUAL_DISCOUNT) / 12)}€/mois
                                            </div>
                                        )}
                                    </div>
                                    <div
                                        onClick={() => setFormData({ ...formData, planType: 'per_module' })}
                                        className="card-native"
                                        style={{
                                            padding: isMobile ? '20px' : '24px', borderRadius: '1.5rem', cursor: 'pointer', border: `2px solid ${formData.planType === 'per_module' ? c.accentPrimary : 'transparent'}`,
                                            background: formData.planType === 'per_module' ? `${c.accentPrimary}15` : c.bgSecondary, transition: 'all 0.3s'
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                                            <Layers size={isMobile ? 20 : 24} color={c.accentHugin} />
                                            <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>À la carte</h3>
                                        </div>
                                        <p style={{ fontSize: '0.8rem', color: c.textSecondary, marginBottom: '1rem' }}>Choisissez vos briques.</p>
                                        <div style={{ fontWeight: 800, fontSize: isMobile ? '1.25rem' : '1.5rem' }}>Sélection libre</div>
                                    </div>
                                </div>

                                {formData.planType === 'per_module' && (
                                    <div style={{ display: 'grid', gap: '12px' }}>
                                        {MODULE_OPTIONS.map(mod => {
                                            const modulePrice = formData.billingCycle === 'annual' 
                                                ? Math.round(mod.price * 12 * (1 - ANNUAL_DISCOUNT))
                                                : mod.price;
                                            const priceLabel = formData.billingCycle === 'annual' ? ' / an' : ' / mois';
                                            const monthlyEquivalent = formData.billingCycle === 'annual' 
                                                ? Math.round(mod.price * 12 * (1 - ANNUAL_DISCOUNT) / 12)
                                                : null;

                                            return (
                                                <div
                                                    key={mod.id}
                                                    onClick={() => {
                                                        const selected = formData.selectedModules.includes(mod.id)
                                                            ? formData.selectedModules.filter(id => id !== mod.id)
                                                            : [...formData.selectedModules, mod.id];
                                                        setFormData({ ...formData, selectedModules: selected });
                                                    }}
                                                    className="card-native"
                                                    style={{
                                                        display: 'flex', alignItems: 'center', gap: '15px', padding: '16px 20px', borderRadius: '1.25rem',
                                                        border: `2px solid ${formData.selectedModules.includes(mod.id) ? c.accentPrimary : 'transparent'}`,
                                                        background: formData.selectedModules.includes(mod.id) ? `${c.accentPrimary}10` : c.bgSecondary,
                                                        cursor: 'pointer', transition: 'all 0.2s'
                                                    }}
                                                >
                                                    <div style={{
                                                        width: '24px', height: '24px', borderRadius: '8px', border: `2px solid ${c.borderColor}`,
                                                        background: formData.selectedModules.includes(mod.id) ? c.accentPrimary : 'transparent',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                                                    }}>
                                                        {formData.selectedModules.includes(mod.id) && <Check size={16} color="#fff" strokeWidth={3} />}
                                                    </div>
                                                    <div style={{ flex: 1 }}>
                                                        <div style={{ fontWeight: 700, fontSize: '1rem' }}>{mod.name}</div>
                                                        <div style={{ fontSize: '0.8rem', color: c.textSecondary }}>
                                                            {modulePrice}€{priceLabel}
                                                            {monthlyEquivalent && (
                                                                <span style={{ color: '#10b981', marginLeft: '8px' }}>
                                                                    (soit {monthlyEquivalent}€/mois)
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* STEP 5: PAYMENT */}
                        {step === 5 && (
                            <div style={{ animation: 'fadeInUp 0.4s ease-out' }}>
                                <h2 style={{ fontSize: '1.5rem', marginBottom: '2rem', fontWeight: 800 }}>Paiement</h2>
                                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? '15px' : '20px' }}>
                                    <div style={{ gridColumn: isMobile ? 'auto' : 'span 2' }}>
                                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.8rem', fontWeight: 700, color: c.textSecondary, textTransform: 'uppercase' }}>Titulaire</label>
                                        <input
                                            type="text" required placeholder="NOM PRÉNOM"
                                            style={{ width: '100%', padding: '16px', borderRadius: '1rem', border: `1px solid ${c.borderColor}`, background: c.bgSecondary, color: c.textPrimary }}
                                            value={formData.cardHolder} onChange={e => setFormData({ ...formData, cardHolder: e.target.value.toUpperCase() })}
                                        />
                                    </div>
                                    <div style={{ gridColumn: isMobile ? 'auto' : 'span 2' }}>
                                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.8rem', fontWeight: 700, color: c.textSecondary, textTransform: 'uppercase' }}>Numéro de carte</label>
                                        <div style={{ position: 'relative' }}>
                                            <input
                                                type="text" required placeholder="0000 0000 0000 0000" maxLength={19}
                                                style={{ width: '100%', padding: '16px', borderRadius: '1rem', border: `1px solid ${c.borderColor}`, background: c.bgSecondary, color: c.textPrimary, fontSize: '1.1rem', letterSpacing: '0.1em' }}
                                                value={formData.cardNumber}
                                                onChange={e => {
                                                    const val = e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim();
                                                    setFormData({ ...formData, cardNumber: val });
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', gridColumn: isMobile ? 'auto' : 'span 2' }}>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.8rem', fontWeight: 700, color: c.textSecondary, textTransform: 'uppercase' }}>Expire</label>
                                            <input
                                                type="text" required placeholder="12/28" maxLength={5}
                                                style={{ width: '100%', padding: '16px', borderRadius: '1rem', border: `1px solid ${c.borderColor}`, background: c.bgSecondary, color: c.textPrimary }}
                                                value={formData.expiry}
                                                onChange={e => {
                                                    const val = e.target.value.replace(/\D/g, '');
                                                    const formatted = val.length >= 2 ? val.slice(0, 2) + '/' + val.slice(2, 4) : val;
                                                    setFormData({ ...formData, expiry: formatted });
                                                }}
                                            />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.8rem', fontWeight: 700, color: c.textSecondary, textTransform: 'uppercase' }}>CVV</label>
                                            <input
                                                type="text" required placeholder="123" maxLength={3}
                                                style={{ width: '100%', padding: '16px', borderRadius: '1rem', border: `1px solid ${c.borderColor}`, background: c.bgSecondary, color: c.textPrimary }}
                                                value={formData.cvv} onChange={e => setFormData({ ...formData, cvv: e.target.value.replace(/\D/g, '') })}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div style={{ marginTop: '24px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.8rem', color: c.textSecondary, padding: '1rem', background: 'rgba(16, 185, 129, 0.05)', borderRadius: '1rem', border: '1px solid rgba(16, 185, 129, 0.1)' }}>
                                    <ShieldCheck size={18} color="#10b981" />
                                    Transaction sécurisée via Odin Gateway
                                </div>
                            </div>
                        )}

                        {/* STEP 6: SUMMARY */}
                        {step === 6 && (
                            <div style={{ animation: 'fadeInUp 0.4s ease-out' }}>
                                <h2 style={{ fontSize: '1.5rem', marginBottom: '2rem', textAlign: 'center', fontWeight: 800 }}>Récapitulatif</h2>

                                <div className="card-native" style={{ borderRadius: '1.5rem', overflow: 'hidden', background: c.bgSecondary, border: `1px solid ${c.borderColor}`, marginBottom: '2rem' }}>
                                    <div style={{ padding: '1.5rem', borderBottom: `1px solid ${c.borderColor}` }}>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.9rem' }}>
                                            <span style={{ color: c.textSecondary }}>Établissement:</span>
                                            <strong style={{ textAlign: 'right' }}>{isEnterprise ? formData.companyName : (formData.adminName || "Individuel")}</strong>

                                            <span style={{ color: c.textSecondary }}>Email:</span>
                                            <strong style={{ textAlign: 'right' }}>{formData.email}</strong>

                                            <span style={{ color: c.textSecondary }}>Facturation:</span>
                                            <strong style={{ textAlign: 'right', color: formData.billingCycle === 'annual' ? '#10b981' : 'inherit' }}>
                                                {formData.billingCycle === 'annual' ? 'Annuelle' : 'Mensuelle'}
                                            </strong>
                                        </div>
                                    </div>

                                    <div style={{ padding: '1.5rem', textAlign: 'center' }}>
                                        <div style={{ fontSize: '0.9rem', color: c.textSecondary, marginBottom: '0.5rem' }}>
                                            {formData.billingCycle === 'annual' ? 'Total annuel' : 'Montant mensuel'}
                                        </div>
                                        <div style={{ fontSize: '2.5rem', fontWeight: 900, color: c.accentPrimary }}>
                                            {cost.finalPrice}€
                                        </div>
                                        {formData.billingCycle === 'annual' ? (
                                            <>
                                                <div style={{ color: '#10b981', fontSize: '0.85rem', fontWeight: 700, marginTop: '0.5rem' }}>
                                                    Économie de {(cost.totalMonthly * 12 * ANNUAL_DISCOUNT).toFixed(0)}€ incluse
                                                </div>
                                                <div style={{ 
                                                    marginTop: '1rem', 
                                                    padding: '0.75rem', 
                                                    background: 'rgba(16, 185, 129, 0.1)', 
                                                    borderRadius: '0.5rem',
                                                    fontSize: '0.85rem'
                                                }}>
                                                    <div style={{ color: c.textSecondary, marginBottom: '0.25rem' }}>Équivalent mensuel</div>
                                                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#10b981' }}>
                                                        {Math.round(cost.finalPrice / 12)}€/mois
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <div style={{ 
                                                marginTop: '1rem', 
                                                padding: '0.75rem', 
                                                background: 'rgba(59, 130, 246, 0.1)', 
                                                borderRadius: '0.5rem',
                                                fontSize: '0.85rem'
                                            }}>
                                                <div style={{ color: c.textSecondary, marginBottom: '0.25rem' }}>Si vous passiez en annuel</div>
                                                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#3b82f6' }}>
                                                    Économisez {(cost.totalMonthly * 12 * ANNUAL_DISCOUNT).toFixed(0)}€/an
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Conditions d'utilisation */}
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <label style={{
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        gap: '12px',
                                        cursor: 'pointer',
                                        padding: '12px',
                                        borderRadius: '0.75rem',
                                        background: formData.acceptTerms ? 'rgba(16, 185, 129, 0.05)' : 'transparent',
                                        border: `1px solid ${formData.acceptTerms ? '#10b981' : c.borderColor}`,
                                        transition: 'all 0.3s'
                                    }}>
                                        <input
                                            type="checkbox"
                                            checked={formData.acceptTerms}
                                            onChange={e => setFormData({ ...formData, acceptTerms: e.target.checked })}
                                            style={{
                                                width: '20px',
                                                height: '20px',
                                                cursor: 'pointer',
                                                accentColor: c.accentPrimary
                                            }}
                                        />
                                        <span style={{ fontSize: '0.85rem', lineHeight: 1.5 }}>
                                            J'accepte les <a href="#" style={{ color: c.accentPrimary, textDecoration: 'underline' }}>conditions d'utilisation</a> et je reconnais avoir pris connaissance de la politique de confidentialité
                                        </span>
                                    </label>
                                </div>

                                <div style={{ marginBottom: '1.5rem' }}>
                                    <label style={{
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        gap: '12px',
                                        cursor: 'pointer',
                                        padding: '12px',
                                        borderRadius: '0.75rem',
                                        background: formData.acceptPrivacy ? 'rgba(16, 185, 129, 0.05)' : 'transparent',
                                        border: `1px solid ${formData.acceptPrivacy ? '#10b981' : c.borderColor}`,
                                        transition: 'all 0.3s'
                                    }}>
                                        <input
                                            type="checkbox"
                                            checked={formData.acceptPrivacy}
                                            onChange={e => setFormData({ ...formData, acceptPrivacy: e.target.checked })}
                                            style={{
                                                width: '20px',
                                                height: '20px',
                                                cursor: 'pointer',
                                                accentColor: c.accentPrimary
                                            }}
                                        />
                                        <span style={{ fontSize: '0.85rem', lineHeight: 1.5 }}>
                                            J'accepte que mes données soient traitées conformément au <a href="#" style={{ color: c.accentPrimary, textDecoration: 'underline' }}>RGPD</a> et je consens au traitement de mes données personnelles
                                        </span>
                                    </label>
                                </div>

                                {/* Sécurité */}
                                <div style={{
                                    padding: '1rem',
                                    background: 'rgba(16, 185, 129, 0.05)',
                                    border: '1px solid rgba(16, 185, 129, 0.2)',
                                    borderRadius: '0.75rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    fontSize: '0.8rem',
                                    color: c.textSecondary
                                }}>
                                    <ShieldCheck size={20} color="#10b981" />
                                    <div>
                                        <div style={{ fontWeight: 700, color: '#10b981', marginBottom: '4px' }}>Sécurité maximale</div>
                                        <div>Vos données sont cryptées avec AES-256-GCM et protégées par des protocoles de sécurité avancés</div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Navigation Buttons */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            marginTop: '40px',
                            paddingTop: '20px',
                            borderTop: isMobile ? 'none' : `1px solid ${c.borderColor}`,
                            position: isMobile ? 'fixed' : 'relative',
                            bottom: isMobile ? '20px' : 'auto',
                            left: isMobile ? '20px' : 'auto',
                            right: isMobile ? '20px' : 'auto',
                            background: isMobile ? 'transparent' : 'none',
                            zIndex: 10
                        }}>
                            {step > 1 ? (
                                <button type="button" onClick={prevStep} style={{
                                    padding: '16px 24px', borderRadius: '1.25rem', border: `1px solid ${c.borderColor}`,
                                    background: isMobile ? 'rgba(255,255,255,0.05)' : 'transparent', color: c.textPrimary, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
                                    backdropFilter: isMobile ? 'blur(10px)' : 'none'
                                }}>
                                    <ArrowLeft size={18} />
                                </button>
                            ) : (
                                <button type="button" onClick={() => navigate('/login')} style={{
                                    padding: '16px 24px', borderRadius: '1.25rem', border: 'none',
                                    background: 'transparent', color: c.textSecondary, cursor: 'pointer'
                                }}>
                                    Annuler
                                </button>
                            )}

                            {step < 6 ? (
                                <button type="button" onClick={nextStep} style={{
                                    padding: isMobile ? '16px 40px' : '16px 32px', borderRadius: '1.25rem', border: 'none',
                                    background: `linear-gradient(135deg, ${c.gradientStart}, ${c.gradientEnd})`,
                                    color: '#fff', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
                                    boxShadow: `0 8px 20px ${c.accentPrimary}44`,
                                    flex: isMobile ? 1 : 'none', marginLeft: isMobile ? '10px' : '0',
                                    justifyContent: 'center'
                                }}>
                                    Suivant <ChevronRight size={18} />
                                </button>
                            ) : (
                                <button 
                                    type="submit" 
                                    disabled={isSubmitting || !formData.acceptTerms || !formData.acceptPrivacy}
                                    style={{
                                        padding: isMobile ? '16px 40px' : '16px 40px', 
                                        borderRadius: '1.25rem', 
                                        border: 'none',
                                        background: isSubmitting || !formData.acceptTerms || !formData.acceptPrivacy 
                                            ? 'rgba(16, 185, 129, 0.3)' 
                                            : '#10b981', 
                                        color: '#fff', 
                                        fontWeight: 800, 
                                        cursor: isSubmitting || !formData.acceptTerms || !formData.acceptPrivacy ? 'not-allowed' : 'pointer',
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        gap: '10px', 
                                        boxShadow: isSubmitting || !formData.acceptTerms || !formData.acceptPrivacy 
                                            ? 'none' 
                                            : '0 8px 20px rgba(16, 185, 129, 0.4)',
                                        flex: isMobile ? 1 : 'none', 
                                        marginLeft: isMobile ? '10px' : '0',
                                        justifyContent: 'center',
                                        opacity: isSubmitting || !formData.acceptTerms || !formData.acceptPrivacy ? 0.5 : 1
                                    }}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div style={{
                                                width: '18px',
                                                height: '18px',
                                                border: '2px solid #fff',
                                                borderTopColor: 'transparent',
                                                borderRadius: '50%',
                                                animation: 'spin 0.8s linear infinite'
                                            }} />
                                            Traitement...
                                        </>
                                    ) : (
                                        <>
                                            Payer <CheckCircle size={18} />
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>

            <style>{`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(15px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                input:focus {
                    outline: none;
                    border-color: ${c.accentPrimary} !important;
                    box-shadow: 0 0 0 2px ${c.accentPrimary}33;
                }
                .card-native:active {
                    transform: scale(0.98);
                }
            `}</style>
        </div>
    );
};

export default Register;
