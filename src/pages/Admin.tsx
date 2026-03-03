import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../components/ThemeContext';
import Navbar from '../components/Navbar';
import {
    Users, Building2, CreditCard, TrendingUp, CheckCircle, XCircle,
    Clock, Search, Filter, Download, Eye, Edit, Trash2, Shield,
    AlertTriangle, FileText, GraduationCap, Landmark, Beaker,
    DollarSign, PieChart, TrendingDown, Wallet
} from 'lucide-react';
import { checkBetaAccess } from '../utils/betaAccess';
import { 
    calculateFinancialMetrics, 
    calculateAnnualProjections,
    formatCurrency,
    formatPercentage,
    isSuperAdminFinance
} from '../utils/financialAnalytics';

interface User {
    email: string;
    fullName: string;
    accountCategory: 'personal' | 'enterprise';
    isStudent: boolean;
    enterpriseType?: 'private' | 'public';
    companyName?: string;
    numberOfEmployees?: number;
    subscription: {
        type: string;
        cycle: string;
        modules: string[] | string;
        price: number;
        status: string;
    };
    createdAt: string;
    studentCardImage?: File | null;
    publicJustification?: File | null;
}

const Admin = () => {
    const navigate = useNavigate();
    const { theme } = useTheme();
    const c = theme.colors;
    
    const [users, setUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState<'all' | 'personal' | 'enterprise'>('all');
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [showModal, setShowModal] = useState(false);

    // Add pulse animation
    const pulseAnimation = `
        @keyframes pulse {
            0%, 100% {
                transform: scale(1);
                opacity: 1;
            }
            50% {
                transform: scale(1.05);
                opacity: 0.9;
            }
        }
    `;

    useEffect(() => {
        // Vérifier si l'utilisateur est un des trois super admins
        const currentUserEmail = localStorage.getItem('currentUser');
        const superAdmins = ['ethan@OLS.com', 'bastien@OLS.com', 'issam@OLS.com'];
        
        if (!currentUserEmail || !superAdmins.includes(currentUserEmail)) {
            navigate('/home');
            return;
        }

        // Charger tous les utilisateurs
        loadUsers();
    }, [navigate]);

    // Vérifier si l'utilisateur actuel est un super admin pour les finances
    const currentUserEmail = localStorage.getItem('currentUser');
    const canViewFinances = isSuperAdminFinance(currentUserEmail);

    const loadUsers = () => {
        const allUsers: User[] = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('user_profile_')) {
                const userData = localStorage.getItem(key);
                if (userData) {
                    try {
                        allUsers.push(JSON.parse(userData));
                    } catch (e) {
                        console.error('Error parsing user data:', e);
                    }
                }
            }
        }
        setUsers(allUsers);
        setFilteredUsers(allUsers);
    };

    useEffect(() => {
        let filtered = users;

        // Filtre par catégorie
        if (filterCategory !== 'all') {
            filtered = filtered.filter(u => u.accountCategory === filterCategory);
        }

        // Filtre par recherche
        if (searchTerm) {
            filtered = filtered.filter(u =>
                u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                u.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                u.companyName?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredUsers(filtered);
    }, [searchTerm, filterCategory, users]);

    const getStats = () => {
        const totalUsers = users.length;
        const personalUsers = users.filter(u => u.accountCategory === 'personal').length;
        const enterpriseUsers = users.filter(u => u.accountCategory === 'enterprise').length;
        const students = users.filter(u => u.isStudent).length;
        const totalRevenue = users.reduce((sum, u) => sum + (u.subscription?.price || 0), 0);
        const pendingValidations = users.filter(u => 
            (u.isStudent && u.studentCardImage) || 
            (u.enterpriseType === 'public' && u.publicJustification)
        ).length;

        // Calculs financiers
        const financialMetrics = calculateFinancialMetrics(users);
        const annualProjections = calculateAnnualProjections(financialMetrics);

        return {
            totalUsers,
            personalUsers,
            enterpriseUsers,
            students,
            totalRevenue,
            pendingValidations,
            financial: financialMetrics,
            annual: annualProjections
        };
    };

    const stats = getStats();

    const deleteUser = (email: string) => {
        if (window.confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur ${email} ?`)) {
            localStorage.removeItem(`user_profile_${email}`);
            loadUsers();
        }
    };

    return (
        <div style={{ minHeight: '100vh', background: c.bgPrimary }}>
            <style>{pulseAnimation}</style>
            <Navbar />
            
            <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem' }}>
                {/* Header */}
                <div style={{ marginBottom: '2rem' }}>
                    <h1 style={{
                        fontSize: '2rem',
                        fontWeight: 800,
                        marginBottom: '0.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem'
                    }}>
                        <Shield size={32} color={c.accentPrimary} />
                        Panneau d'administration
                    </h1>
                    <p style={{ color: c.textSecondary }}>
                        Gestion des utilisateurs et des abonnements
                    </p>
                </div>

                {/* Stats Cards */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '1.5rem',
                    marginBottom: '2rem'
                }}>
                    <div style={{
                        padding: '1.5rem',
                        background: c.cardBg,
                        borderRadius: '1rem',
                        border: `1px solid ${c.borderColor}`
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <p style={{ color: c.textSecondary, fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                                    Total Utilisateurs
                                </p>
                                <h2 style={{ fontSize: '2rem', fontWeight: 800, color: c.accentPrimary }}>
                                    {stats.totalUsers}
                                </h2>
                            </div>
                            <Users size={32} color={c.accentPrimary} style={{ opacity: 0.5 }} />
                        </div>
                    </div>

                    <div style={{
                        padding: '1.5rem',
                        background: c.cardBg,
                        borderRadius: '1rem',
                        border: `1px solid ${c.borderColor}`
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <p style={{ color: c.textSecondary, fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                                    Entreprises
                                </p>
                                <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#8b5cf6' }}>
                                    {stats.enterpriseUsers}
                                </h2>
                            </div>
                            <Building2 size={32} color="#8b5cf6" style={{ opacity: 0.5 }} />
                        </div>
                    </div>

                    <div style={{
                        padding: '1.5rem',
                        background: c.cardBg,
                        borderRadius: '1rem',
                        border: `1px solid ${c.borderColor}`
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <p style={{ color: c.textSecondary, fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                                    Étudiants
                                </p>
                                <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#10b981' }}>
                                    {stats.students}
                                </h2>
                            </div>
                            <GraduationCap size={32} color="#10b981" style={{ opacity: 0.5 }} />
                        </div>
                    </div>

                    <div style={{
                        padding: '1.5rem',
                        background: c.cardBg,
                        borderRadius: '1rem',
                        border: `1px solid ${c.borderColor}`
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <p style={{ color: c.textSecondary, fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                                    Revenu Mensuel
                                </p>
                                <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#f59e0b' }}>
                                    {stats.totalRevenue}€
                                </h2>
                            </div>
                            <TrendingUp size={32} color="#f59e0b" style={{ opacity: 0.5 }} />
                        </div>
                    </div>

                    <div style={{
                        padding: '1.5rem',
                        background: c.cardBg,
                        borderRadius: '1rem',
                        border: `1px solid ${c.borderColor}`
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <p style={{ color: c.textSecondary, fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                                    Validations en attente
                                </p>
                                <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#ef4444' }}>
                                    {stats.pendingValidations}
                                </h2>
                            </div>
                            <Clock size={32} color="#ef4444" style={{ opacity: 0.5 }} />
                        </div>
                    </div>
                </div>

                {/* Section Financière - Réservée aux Super Admins */}
                {canViewFinances && (
                <div style={{
                    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.05))',
                    border: '2px solid rgba(16, 185, 129, 0.3)',
                    borderRadius: '1.5rem',
                    padding: '2rem',
                    marginBottom: '2rem'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                        <h2 style={{
                            fontSize: '1.5rem',
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            color: c.textPrimary
                        }}>
                            <Wallet size={28} color="#10b981" />
                            Analyse Financière Mensuelle
                        </h2>
                        <div style={{
                            padding: '0.5rem 1rem',
                            background: 'rgba(245, 158, 11, 0.2)',
                            border: '1px solid rgba(245, 158, 11, 0.4)',
                            borderRadius: '0.5rem',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            color: '#f59e0b'
                        }}>
                            🔒 Super Admin Only
                        </div>
                    </div>

                    {/* Métriques principales */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '1rem',
                        marginBottom: '1.5rem'
                    }}>
                        <div style={{
                            padding: '1.25rem',
                            background: 'rgba(16, 185, 129, 0.1)',
                            borderRadius: '1rem',
                            border: '1px solid rgba(16, 185, 129, 0.2)'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                <DollarSign size={20} color="#10b981" />
                                <p style={{ color: c.textSecondary, fontSize: '0.85rem', fontWeight: 600 }}>
                                    REVENU MENSUEL
                                </p>
                            </div>
                            <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#10b981' }}>
                                {formatCurrency(stats.financial.totalRevenue)}
                            </h3>
                            <p style={{ fontSize: '0.75rem', color: c.textSecondary, marginTop: '0.25rem' }}>
                                Équivalent mensuel
                            </p>
                        </div>

                        <div style={{
                            padding: '1.25rem',
                            background: 'rgba(34, 197, 94, 0.1)',
                            borderRadius: '1rem',
                            border: '1px solid rgba(34, 197, 94, 0.2)'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                <Wallet size={20} color="#22c55e" />
                                <p style={{ color: c.textSecondary, fontSize: '0.85rem', fontWeight: 600 }}>
                                    ARGENT COLLECTÉ
                                </p>
                            </div>
                            <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#22c55e' }}>
                                {formatCurrency(stats.financial.totalRevenueCollected)}
                            </h3>
                            <p style={{ fontSize: '0.75rem', color: c.textSecondary, marginTop: '0.25rem' }}>
                                Incluant annuels
                            </p>
                        </div>

                        <div style={{
                            padding: '1.25rem',
                            background: 'rgba(239, 68, 68, 0.1)',
                            borderRadius: '1rem',
                            border: '1px solid rgba(239, 68, 68, 0.2)'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                <TrendingDown size={20} color="#ef4444" />
                                <p style={{ color: c.textSecondary, fontSize: '0.85rem', fontWeight: 600 }}>
                                    COÛTS TOTAUX
                                </p>
                            </div>
                            <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#ef4444' }}>
                                {formatCurrency(stats.financial.totalCosts)}
                            </h3>
                            <p style={{ fontSize: '0.75rem', color: c.textSecondary, marginTop: '0.25rem' }}>
                                {formatCurrency(stats.financial.costPerUser)} / utilisateur
                            </p>
                            <p style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '0.15rem' }}>
                                {formatCurrency(stats.financial.costPerSeat)} / licence payée
                            </p>
                        </div>

                        <div style={{
                            padding: '1.25rem',
                            background: stats.financial.grossProfit >= 0 
                                ? 'rgba(34, 197, 94, 0.1)' 
                                : 'rgba(239, 68, 68, 0.1)',
                            borderRadius: '1rem',
                            border: stats.financial.grossProfit >= 0 
                                ? '1px solid rgba(34, 197, 94, 0.2)' 
                                : '1px solid rgba(239, 68, 68, 0.2)'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                <TrendingUp size={20} color={stats.financial.grossProfit >= 0 ? '#22c55e' : '#ef4444'} />
                                <p style={{ color: c.textSecondary, fontSize: '0.85rem', fontWeight: 600 }}>
                                    BÉNÉFICE BRUT
                                </p>
                            </div>
                            <h3 style={{ 
                                fontSize: '1.75rem', 
                                fontWeight: 800, 
                                color: stats.financial.grossProfit >= 0 ? '#22c55e' : '#ef4444'
                            }}>
                                {formatCurrency(stats.financial.grossProfit)}
                            </h3>
                            <p style={{ fontSize: '0.75rem', color: c.textSecondary, marginTop: '0.25rem' }}>
                                {formatCurrency(stats.financial.profitPerUser)} / utilisateur
                            </p>
                            <p style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '0.15rem' }}>
                                {formatCurrency(stats.financial.profitPerSeat)} / licence payée
                            </p>
                        </div>

                        <div style={{
                            padding: '1.25rem',
                            background: 'rgba(139, 92, 246, 0.1)',
                            borderRadius: '1rem',
                            border: '1px solid rgba(139, 92, 246, 0.2)'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                <PieChart size={20} color="#8b5cf6" />
                                <p style={{ color: c.textSecondary, fontSize: '0.85rem', fontWeight: 600 }}>
                                    MARGE BRUTE
                                </p>
                            </div>
                            <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#8b5cf6' }}>
                                {formatPercentage(stats.financial.grossMargin)}
                            </h3>
                            <p style={{ fontSize: '0.75rem', color: c.textSecondary, marginTop: '0.25rem' }}>
                                {stats.financial.grossMargin >= 0 ? 'Rentable' : 'Déficitaire'}
                            </p>
                        </div>
                    </div>

                    {/* Informations sur les Licences/Sièges */}
                    <div style={{
                        background: 'rgba(99, 102, 241, 0.1)',
                        borderRadius: '1rem',
                        padding: '1.5rem',
                        marginBottom: '1.5rem',
                        border: '1px solid rgba(99, 102, 241, 0.2)'
                    }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: c.textPrimary }}>
                            📊 Gestion des Licences
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                            <div>
                                <p style={{ fontSize: '0.85rem', color: c.textSecondary, marginBottom: '0.25rem' }}>
                                    Licences Payées
                                </p>
                                <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#6366f1' }}>
                                    {stats.financial.seatsInfo.totalPaidSeats}
                                </p>
                                <p style={{ fontSize: '0.75rem', color: c.textSecondary, marginTop: '0.25rem' }}>
                                    Sièges achetés
                                </p>
                            </div>
                            <div>
                                <p style={{ fontSize: '0.85rem', color: c.textSecondary, marginBottom: '0.25rem' }}>
                                    Utilisateurs Actifs
                                </p>
                                <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#10b981' }}>
                                    {stats.financial.seatsInfo.totalActiveUsers}
                                </p>
                                <p style={{ fontSize: '0.75rem', color: c.textSecondary, marginTop: '0.25rem' }}>
                                    Comptes créés
                                </p>
                            </div>
                            <div>
                                <p style={{ fontSize: '0.85rem', color: c.textSecondary, marginBottom: '0.25rem' }}>
                                    Taux d'Utilisation
                                </p>
                                <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#8b5cf6' }}>
                                    {stats.financial.seatsInfo.utilizationRate.toFixed(1)}%
                                </p>
                                <p style={{ fontSize: '0.75rem', color: c.textSecondary, marginTop: '0.25rem' }}>
                                    Licences utilisées
                                </p>
                            </div>
                            <div>
                                <p style={{ fontSize: '0.85rem', color: c.textSecondary, marginBottom: '0.25rem' }}>
                                    Licences Disponibles
                                </p>
                                <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f59e0b' }}>
                                    {stats.financial.seatsInfo.totalPaidSeats - stats.financial.seatsInfo.totalActiveUsers}
                                </p>
                                <p style={{ fontSize: '0.75rem', color: c.textSecondary, marginTop: '0.25rem' }}>
                                    Sièges libres
                                </p>
                            </div>
                        </div>
                        <div style={{ 
                            marginTop: '1rem', 
                            padding: '0.75rem', 
                            background: 'rgba(0, 0, 0, 0.2)', 
                            borderRadius: '0.5rem',
                            fontSize: '0.85rem',
                            color: c.textSecondary
                        }}>
                            💡 Les coûts sont calculés sur les <strong style={{ color: c.textPrimary }}>{stats.financial.seatsInfo.totalPaidSeats} licences payées</strong>, pas sur les {stats.financial.seatsInfo.totalActiveUsers} utilisateurs actifs
                        </div>
                    </div>

                    {/* Détail des coûts */}
                    <div style={{
                        background: 'rgba(0, 0, 0, 0.2)',
                        borderRadius: '1rem',
                        padding: '1.5rem',
                        marginBottom: '1.5rem'
                    }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: c.textPrimary }}>
                            Répartition des Coûts Fixes
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
                            <div>
                                <p style={{ fontSize: '0.85rem', color: c.textSecondary, marginBottom: '0.25rem' }}>
                                    Salaires
                                </p>
                                <p style={{ fontSize: '1.25rem', fontWeight: 700, color: c.textPrimary }}>
                                    {formatCurrency(stats.financial.costBreakdown.salaries)}
                                </p>
                            </div>
                            <div>
                                <p style={{ fontSize: '0.85rem', color: c.textSecondary, marginBottom: '0.25rem' }}>
                                    Infrastructure
                                </p>
                                <p style={{ fontSize: '1.25rem', fontWeight: 700, color: c.textPrimary }}>
                                    {formatCurrency(stats.financial.costBreakdown.infrastructure)}
                                </p>
                            </div>
                            <div>
                                <p style={{ fontSize: '0.85rem', color: c.textSecondary, marginBottom: '0.25rem' }}>
                                    Marketing
                                </p>
                                <p style={{ fontSize: '1.25rem', fontWeight: 700, color: c.textPrimary }}>
                                    {formatCurrency(stats.financial.costBreakdown.marketing)}
                                </p>
                            </div>
                            <div>
                                <p style={{ fontSize: '0.85rem', color: c.textSecondary, marginBottom: '0.25rem' }}>
                                    Support
                                </p>
                                <p style={{ fontSize: '1.25rem', fontWeight: 700, color: c.textPrimary }}>
                                    {formatCurrency(stats.financial.costBreakdown.support)}
                                </p>
                            </div>
                            <div>
                                <p style={{ fontSize: '0.85rem', color: c.textSecondary, marginBottom: '0.25rem' }}>
                                    Maintenance
                                </p>
                                <p style={{ fontSize: '1.25rem', fontWeight: 700, color: c.textPrimary }}>
                                    {formatCurrency(stats.financial.costBreakdown.maintenance)}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Projections annuelles */}
                    <div style={{
                        background: 'rgba(0, 0, 0, 0.2)',
                        borderRadius: '1rem',
                        padding: '1.5rem'
                    }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: c.textPrimary }}>
                            Projections Annuelles
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                            <div>
                                <p style={{ fontSize: '0.85rem', color: c.textSecondary, marginBottom: '0.25rem' }}>
                                    Revenu Annuel
                                </p>
                                <p style={{ fontSize: '1.25rem', fontWeight: 700, color: '#10b981' }}>
                                    {formatCurrency(stats.annual.annualRevenue)}
                                </p>
                            </div>
                            <div>
                                <p style={{ fontSize: '0.85rem', color: c.textSecondary, marginBottom: '0.25rem' }}>
                                    Coûts Annuels
                                </p>
                                <p style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ef4444' }}>
                                    {formatCurrency(stats.annual.annualCosts)}
                                </p>
                            </div>
                            <div>
                                <p style={{ fontSize: '0.85rem', color: c.textSecondary, marginBottom: '0.25rem' }}>
                                    Bénéfice Annuel
                                </p>
                                <p style={{ 
                                    fontSize: '1.25rem', 
                                    fontWeight: 700, 
                                    color: stats.annual.annualProfit >= 0 ? '#22c55e' : '#ef4444'
                                }}>
                                    {formatCurrency(stats.annual.annualProfit)}
                                </p>
                            </div>
                            <div>
                                <p style={{ fontSize: '0.85rem', color: c.textSecondary, marginBottom: '0.25rem' }}>
                                    Seuil de Rentabilité
                                </p>
                                <p style={{ fontSize: '1.25rem', fontWeight: 700, color: '#8b5cf6' }}>
                                    {stats.annual.breakEvenUsers} users
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Détail des revenus par type */}
                    <div style={{
                        background: 'rgba(0, 0, 0, 0.2)',
                        borderRadius: '1rem',
                        padding: '1.5rem',
                        marginTop: '1.5rem'
                    }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: c.textPrimary }}>
                            Répartition des Revenus
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                            <div>
                                <p style={{ fontSize: '0.85rem', color: c.textSecondary, marginBottom: '0.25rem' }}>
                                    Abonnements Mensuels
                                </p>
                                <p style={{ fontSize: '1.25rem', fontWeight: 700, color: '#10b981' }}>
                                    {formatCurrency(stats.financial.revenueByType.monthly)}
                                </p>
                            </div>
                            <div>
                                <p style={{ fontSize: '0.85rem', color: c.textSecondary, marginBottom: '0.25rem' }}>
                                    Abonnements Annuels
                                </p>
                                <p style={{ fontSize: '1.25rem', fontWeight: 700, color: '#22c55e' }}>
                                    {formatCurrency(stats.financial.revenueByType.annual)}
                                </p>
                            </div>
                            <div>
                                <p style={{ fontSize: '0.85rem', color: c.textSecondary, marginBottom: '0.25rem' }}>
                                    Annuels (Mensuel Équiv.)
                                </p>
                                <p style={{ fontSize: '1.25rem', fontWeight: 700, color: '#8b5cf6' }}>
                                    {formatCurrency(stats.financial.revenueByType.annualEquivalent)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                )}

                {/* Beta Hub Access Button */}
                {checkBetaAccess() && (
                    <div style={{
                        marginBottom: '2rem',
                        padding: '1.5rem',
                        background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(239, 68, 68, 0.1) 100%)',
                        border: '2px solid rgba(245, 158, 11, 0.3)',
                        borderRadius: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        <div style={{
                            position: 'absolute',
                            top: '-50%',
                            right: '-10%',
                            width: '300px',
                            height: '300px',
                            background: 'radial-gradient(circle, rgba(245, 158, 11, 0.2) 0%, transparent 70%)',
                            borderRadius: '50%',
                            filter: 'blur(40px)'
                        }} />
                        
                        <div style={{ position: 'relative', zIndex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                                <div style={{
                                    width: '48px',
                                    height: '48px',
                                    background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
                                    borderRadius: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: '0 8px 24px rgba(245, 158, 11, 0.4)',
                                    animation: 'pulse 2s infinite'
                                }}>
                                    <Beaker size={24} color="white" />
                                </div>
                                <div>
                                    <h3 style={{
                                        fontSize: '1.25rem',
                                        fontWeight: '800',
                                        margin: 0,
                                        color: c.textPrimary
                                    }}>
                                        Beta Test Hub
                                    </h3>
                                    <p style={{ color: c.textSecondary, fontSize: '0.9rem', margin: '0.25rem 0 0 0' }}>
                                        Accès aux fonctionnalités expérimentales (Super Admin uniquement)
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        <button
                            onClick={() => navigate('/beta-hub')}
                            style={{
                                position: 'relative',
                                zIndex: 1,
                                padding: '1rem 2rem',
                                background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
                                border: 'none',
                                borderRadius: '0.75rem',
                                color: 'white',
                                fontWeight: '700',
                                fontSize: '1rem',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                boxShadow: '0 4px 20px rgba(245, 158, 11, 0.4)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 8px 30px rgba(245, 158, 11, 0.6)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 4px 20px rgba(245, 158, 11, 0.4)';
                            }}
                        >
                            <Beaker size={20} />
                            Accéder au Beta Hub
                        </button>
                    </div>
                )}

                {/* Filters and Search */}
                <div style={{
                    display: 'flex',
                    gap: '1rem',
                    marginBottom: '1.5rem',
                    flexWrap: 'wrap'
                }}>
                    <div style={{ flex: 1, minWidth: '300px', position: 'relative' }}>
                        <Search
                            size={20}
                            style={{
                                position: 'absolute',
                                left: '1rem',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: c.textSecondary
                            }}
                        />
                        <input
                            type="text"
                            placeholder="Rechercher par email, nom ou entreprise..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '1rem 1rem 1rem 3rem',
                                borderRadius: '0.75rem',
                                border: `1px solid ${c.borderColor}`,
                                background: c.cardBg,
                                color: c.textPrimary,
                                fontSize: '0.95rem'
                            }}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                            onClick={() => setFilterCategory('all')}
                            style={{
                                padding: '1rem 1.5rem',
                                borderRadius: '0.75rem',
                                border: `1px solid ${filterCategory === 'all' ? c.accentPrimary : c.borderColor}`,
                                background: filterCategory === 'all' ? `${c.accentPrimary}20` : c.cardBg,
                                color: filterCategory === 'all' ? c.accentPrimary : c.textPrimary,
                                cursor: 'pointer',
                                fontWeight: 600,
                                transition: 'all 0.2s'
                            }}
                        >
                            Tous
                        </button>
                        <button
                            onClick={() => setFilterCategory('personal')}
                            style={{
                                padding: '1rem 1.5rem',
                                borderRadius: '0.75rem',
                                border: `1px solid ${filterCategory === 'personal' ? c.accentPrimary : c.borderColor}`,
                                background: filterCategory === 'personal' ? `${c.accentPrimary}20` : c.cardBg,
                                color: filterCategory === 'personal' ? c.accentPrimary : c.textPrimary,
                                cursor: 'pointer',
                                fontWeight: 600,
                                transition: 'all 0.2s'
                            }}
                        >
                            Personnel
                        </button>
                        <button
                            onClick={() => setFilterCategory('enterprise')}
                            style={{
                                padding: '1rem 1.5rem',
                                borderRadius: '0.75rem',
                                border: `1px solid ${filterCategory === 'enterprise' ? c.accentPrimary : c.borderColor}`,
                                background: filterCategory === 'enterprise' ? `${c.accentPrimary}20` : c.cardBg,
                                color: filterCategory === 'enterprise' ? c.accentPrimary : c.textPrimary,
                                cursor: 'pointer',
                                fontWeight: 600,
                                transition: 'all 0.2s'
                            }}
                        >
                            Entreprise
                        </button>
                    </div>
                </div>

                {/* Users Table */}
                <div style={{
                    background: c.cardBg,
                    borderRadius: '1rem',
                    border: `1px solid ${c.borderColor}`,
                    overflow: 'hidden'
                }}>
                    <div style={{
                        overflowX: 'auto'
                    }}>
                        <table style={{
                            width: '100%',
                            borderCollapse: 'collapse'
                        }}>
                            <thead>
                                <tr style={{ background: c.bgSecondary }}>
                                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 700, fontSize: '0.85rem', color: c.textSecondary }}>
                                        Utilisateur
                                    </th>
                                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 700, fontSize: '0.85rem', color: c.textSecondary }}>
                                        Type
                                    </th>
                                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 700, fontSize: '0.85rem', color: c.textSecondary }}>
                                        Abonnement
                                    </th>
                                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 700, fontSize: '0.85rem', color: c.textSecondary }}>
                                        Prix
                                    </th>
                                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 700, fontSize: '0.85rem', color: c.textSecondary }}>
                                        Statut
                                    </th>
                                    <th style={{ padding: '1rem', textAlign: 'center', fontWeight: 700, fontSize: '0.85rem', color: c.textSecondary }}>
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map((user, index) => (
                                    <tr
                                        key={user.email}
                                        style={{
                                            borderTop: `1px solid ${c.borderColor}`,
                                            transition: 'background 0.2s'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.background = c.bgSecondary}
                                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                    >
                                        <td style={{ padding: '1rem' }}>
                                            <div>
                                                <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>
                                                    {user.fullName || user.email.split('@')[0]}
                                                </div>
                                                <div style={{ fontSize: '0.85rem', color: c.textSecondary }}>
                                                    {user.email}
                                                </div>
                                                {user.companyName && (
                                                    <div style={{ fontSize: '0.8rem', color: c.textSecondary, marginTop: '0.25rem' }}>
                                                        🏢 {user.companyName}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <div style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '0.5rem',
                                                padding: '0.5rem 0.75rem',
                                                borderRadius: '0.5rem',
                                                background: user.accountCategory === 'enterprise' ? 'rgba(139, 92, 246, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                                                fontSize: '0.85rem',
                                                fontWeight: 600
                                            }}>
                                                {user.accountCategory === 'enterprise' ? <Building2 size={14} /> : <Users size={14} />}
                                                {user.accountCategory === 'enterprise' ? 'Entreprise' : 'Personnel'}
                                                {user.isStudent && <GraduationCap size={14} color="#10b981" />}
                                            </div>
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <div style={{ fontSize: '0.9rem' }}>
                                                {user.subscription?.type === 'full' ? 'Site complet' : 'Par modules'}
                                            </div>
                                            <div style={{ fontSize: '0.8rem', color: c.textSecondary }}>
                                                {user.subscription?.cycle === 'annual' ? 'Annuel' : 'Mensuel'}
                                            </div>
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <div style={{ fontWeight: 700, fontSize: '1.05rem' }}>
                                                {user.subscription?.price}€
                                            </div>
                                            <div style={{ fontSize: '0.75rem', color: c.textSecondary }}>
                                                /{user.subscription?.cycle === 'annual' ? 'an' : 'mois'}
                                            </div>
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <div style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '0.5rem',
                                                padding: '0.5rem 0.75rem',
                                                borderRadius: '0.5rem',
                                                background: 'rgba(16, 185, 129, 0.1)',
                                                color: '#10b981',
                                                fontSize: '0.85rem',
                                                fontWeight: 600
                                            }}>
                                                <CheckCircle size={14} />
                                                Actif
                                            </div>
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <div style={{
                                                display: 'flex',
                                                gap: '0.5rem',
                                                justifyContent: 'center'
                                            }}>
                                                <button
                                                    onClick={() => {
                                                        setSelectedUser(user);
                                                        setShowModal(true);
                                                    }}
                                                    style={{
                                                        padding: '0.5rem',
                                                        borderRadius: '0.5rem',
                                                        border: 'none',
                                                        background: `${c.accentPrimary}20`,
                                                        color: c.accentPrimary,
                                                        cursor: 'pointer',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        transition: 'all 0.2s'
                                                    }}
                                                    title="Voir détails"
                                                >
                                                    <Eye size={16} />
                                                </button>
                                                <button
                                                    onClick={() => deleteUser(user.email)}
                                                    style={{
                                                        padding: '0.5rem',
                                                        borderRadius: '0.5rem',
                                                        border: 'none',
                                                        background: 'rgba(239, 68, 68, 0.1)',
                                                        color: '#ef4444',
                                                        cursor: 'pointer',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        transition: 'all 0.2s'
                                                    }}
                                                    title="Supprimer"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {filteredUsers.length === 0 && (
                        <div style={{
                            padding: '3rem',
                            textAlign: 'center',
                            color: c.textSecondary
                        }}>
                            <AlertTriangle size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                            <p>Aucun utilisateur trouvé</p>
                        </div>
                    )}
                </div>

                {/* Modal détails utilisateur */}
                {showModal && selectedUser && (
                    <div
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'rgba(0, 0, 0, 0.8)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 9999,
                            padding: '2rem'
                        }}
                        onClick={() => setShowModal(false)}
                    >
                        <div
                            style={{
                                background: c.cardBg,
                                borderRadius: '1rem',
                                border: `1px solid ${c.borderColor}`,
                                maxWidth: '600px',
                                width: '100%',
                                maxHeight: '80vh',
                                overflow: 'auto',
                                padding: '2rem'
                            }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: 800 }}>
                                Détails de l'utilisateur
                            </h2>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div>
                                    <label style={{ fontSize: '0.85rem', color: c.textSecondary, display: 'block', marginBottom: '0.5rem' }}>
                                        Nom complet
                                    </label>
                                    <div style={{ fontWeight: 600 }}>{selectedUser.fullName}</div>
                                </div>

                                <div>
                                    <label style={{ fontSize: '0.85rem', color: c.textSecondary, display: 'block', marginBottom: '0.5rem' }}>
                                        Email
                                    </label>
                                    <div style={{ fontWeight: 600 }}>{selectedUser.email}</div>
                                </div>

                                {selectedUser.companyName && (
                                    <div>
                                        <label style={{ fontSize: '0.85rem', color: c.textSecondary, display: 'block', marginBottom: '0.5rem' }}>
                                            Entreprise
                                        </label>
                                        <div style={{ fontWeight: 600 }}>{selectedUser.companyName}</div>
                                        <div style={{ fontSize: '0.85rem', color: c.textSecondary, marginTop: '0.25rem' }}>
                                            {selectedUser.enterpriseType === 'public' ? '🏛️ Structure publique' : '🏢 Entreprise privée'}
                                        </div>
                                        {selectedUser.numberOfEmployees && (
                                            <div style={{ fontSize: '0.85rem', color: c.textSecondary, marginTop: '0.25rem' }}>
                                                👥 {selectedUser.numberOfEmployees} employés
                                            </div>
                                        )}
                                    </div>
                                )}

                                {selectedUser.isStudent && (
                                    <div style={{
                                        padding: '1rem',
                                        background: 'rgba(16, 185, 129, 0.1)',
                                        borderRadius: '0.75rem',
                                        border: '1px solid rgba(16, 185, 129, 0.3)'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                            <GraduationCap size={20} color="#10b981" />
                                            <strong>Étudiant</strong>
                                        </div>
                                        <div style={{ fontSize: '0.85rem', color: c.textSecondary }}>
                                            Bénéficie de 50% de réduction
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <label style={{ fontSize: '0.85rem', color: c.textSecondary, display: 'block', marginBottom: '0.5rem' }}>
                                        Abonnement
                                    </label>
                                    <div style={{ fontWeight: 600 }}>
                                        {selectedUser.subscription?.type === 'full' ? 'Site complet' : 'Par modules'}
                                    </div>
                                    <div style={{ fontSize: '0.85rem', color: c.textSecondary, marginTop: '0.25rem' }}>
                                        Facturation {selectedUser.subscription?.cycle === 'annual' ? 'annuelle' : 'mensuelle'}
                                    </div>
                                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: c.accentPrimary, marginTop: '0.5rem' }}>
                                        {selectedUser.subscription?.price}€
                                    </div>
                                </div>

                                <div>
                                    <label style={{ fontSize: '0.85rem', color: c.textSecondary, display: 'block', marginBottom: '0.5rem' }}>
                                        Date d'inscription
                                    </label>
                                    <div style={{ fontWeight: 600 }}>
                                        {new Date(selectedUser.createdAt).toLocaleDateString('fr-FR', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => setShowModal(false)}
                                style={{
                                    marginTop: '2rem',
                                    width: '100%',
                                    padding: '1rem',
                                    borderRadius: '0.75rem',
                                    border: 'none',
                                    background: c.accentPrimary,
                                    color: '#fff',
                                    fontWeight: 700,
                                    cursor: 'pointer'
                                }}
                            >
                                Fermer
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Admin;
