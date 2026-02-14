import { useState, useEffect } from 'react';
import {
    Beaker, Calendar, Mail, HardDrive, Video, Brain, Quote, Book,
    Package, Snowflake, Activity, Wallet, BookOpen, Calculator,
    Dna, Camera, Layers, ShieldAlert, Zap, Share2, Box,
    TrendingUp, Grid, UserCheck, Search
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../components/LanguageContext';
import { useToast } from '../components/ToastContext';
import { useDeviceDetection } from '../hooks/useDeviceDetection';
import Navbar from '../components/Navbar';
import { checkHasAccess, getAccessData } from '../utils/ShieldUtils';

const Hugin = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useLanguage();
    const { showToast } = useToast();
    const { isMobile } = useDeviceDetection();
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');

    // Subscription Check logic
    const userStr = localStorage.getItem('currentUser');
    const { sub, hiddenTools } = getAccessData(userStr);

    // Check for denied access message
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        if (params.get('denied')) {
            showToast("Accès refusé. Ce module n'est pas inclus dans votre abonnement actuel.", "error");
            // Clean URL
            navigate('/hugin', { replace: true });
        }
    }, [location]);

    const hasAccess = (moduleId: string) => checkHasAccess(moduleId, userStr, sub || undefined, hiddenTools);

    const modules = [
        // Core
        { id: 'messaging', name: 'Messagerie', desc: 'Messages et communications', icon: <Mail size={24} />, category: 'Core', path: '/hugin/messaging' },
        { id: 'planning', name: 'Planning', desc: 'Gestion du temps', icon: <Calendar size={24} />, category: 'Core', path: '/hugin/planning' },
        { id: 'documents', name: 'Documents', desc: 'Fichiers et archives', icon: <HardDrive size={24} />, category: 'Core', path: '/hugin/documents' },
        { id: 'inventory', name: 'Inventaire', desc: 'Gestion des stocks', icon: <Beaker size={24} />, category: 'Core', path: '/hugin/inventory' },
        { id: 'meetings', name: 'Réunions', desc: 'Gestion des réunions', icon: <Video size={24} />, category: 'Core', path: '/hugin/meetings' },
        { id: 'projects', name: 'Projets', desc: 'Gestion de projets', icon: <Layers size={24} />, category: 'Core', path: '/hugin/projects' },
        { id: 'tableur', name: 'Tableur', desc: 'Tableur de laboratoire', icon: <Grid size={24} />, category: 'Core', path: '/hugin/tableur' },
        { id: 'it_archive', name: 'Archives IT', desc: 'Archives informatiques', icon: <HardDrive size={24} />, category: 'Core', path: '/hugin/it-archive' },

        // Lab Management
        { id: 'stock', name: 'Stocks', desc: 'Gestion des stocks', icon: <Package size={24} />, category: 'Lab', path: '/hugin/stock' },
        { id: 'cryo', name: 'Cryoconservation', desc: 'Gestion cryo', icon: <Snowflake size={24} />, category: 'Lab', path: '/hugin/cryo' },
        { id: 'equip', name: 'Équipements', desc: 'Gestion équipements', icon: <Activity size={24} />, category: 'Lab', path: '/hugin/equip' },
        { id: 'budget', name: 'Budget', desc: 'Gestion budgétaire', icon: <Wallet size={24} />, category: 'Lab', path: '/hugin/budget' },
        { id: 'safety', name: 'Sécurité', desc: 'Protocoles de sécurité', icon: <ShieldAlert size={24} />, category: 'Lab', path: '/hugin/safety' },
        { id: 'sop', name: 'SOPs', desc: 'Procédures opératoires', icon: <BookOpen size={24} />, category: 'Lab', path: '/hugin/sop' },

        // Research
        { id: 'culture', name: 'Cultures', desc: 'Suivi des cultures', icon: <Beaker size={24} />, category: 'Research', path: '/hugin/culture' },
        { id: 'research', name: 'Recherche', desc: 'Projets scientifiques', icon: <Brain size={24} />, category: 'Research', path: '/hugin/research' },
        { id: 'mimir', name: 'Mimir', desc: 'Assistant IA', icon: <Brain size={24} />, category: 'Research', path: '/hugin/mimir' },
        { id: 'bibliography', name: 'Bibliographie', desc: 'Références scientifiques', icon: <Quote size={24} />, category: 'Research', path: '/hugin/bibliography' },
        { id: 'notebook', name: 'Cahier de labo', desc: 'Notes de laboratoire', icon: <Book size={24} />, category: 'Research', path: '/hugin/notebook' },

        // Analysis
        { id: 'bioanalyzer', name: 'BioAnalyzer', desc: 'Analyses biologiques', icon: <Dna size={24} />, category: 'Analysis', path: '/hugin/bioanalyzer' },
        { id: 'imageanalyzer', name: 'Image Analyzer', desc: 'Analyse d\'images', icon: <Camera size={24} />, category: 'Analysis', path: '/hugin/imageanalyzer' },
        { id: 'statistics', name: 'Statistiques', desc: 'Analyses statistiques', icon: <TrendingUp size={24} />, category: 'Analysis', path: '/hugin/statistics' },
        { id: 'biotools', name: 'BioTools', desc: 'Outils biologiques', icon: <Calculator size={24} />, category: 'Analysis', path: '/hugin/biotools' },
        { id: 'sequence', name: 'Séquences', desc: 'Analyse de séquences', icon: <Dna size={24} />, category: 'Analysis', path: '/hugin/sequence' },
        { id: 'flow', name: 'Cytométrie', desc: 'Analyse de flux', icon: <Activity size={24} />, category: 'Analysis', path: '/hugin/flow' },
        { id: 'spectrum', name: 'Spectres', desc: 'Analyse spectrale', icon: <Zap size={24} />, category: 'Analysis', path: '/hugin/spectrum' },
        { id: 'gel', name: 'Gels', desc: 'Analyse de gels', icon: <Layers size={24} />, category: 'Analysis', path: '/hugin/gel' },
        { id: 'phylo', name: 'Phylogénie', desc: 'Arbres phylogénétiques', icon: <Share2 size={24} />, category: 'Analysis', path: '/hugin/phylo' },
        { id: 'molecules', name: 'Molécules', desc: 'Structures moléculaires', icon: <Box size={24} />, category: 'Analysis', path: '/hugin/molecules' },
        { id: 'kinetics', name: 'Cinétique', desc: 'Analyses cinétiques', icon: <TrendingUp size={24} />, category: 'Analysis', path: '/hugin/kinetics' },
        { id: 'plates', name: 'Plaques', desc: 'Gestion de plaques', icon: <Grid size={24} />, category: 'Analysis', path: '/hugin/plates' },
        { id: 'mixer', name: 'Solutions', desc: 'Préparation solutions', icon: <Beaker size={24} />, category: 'Analysis', path: '/hugin/mixer' },
        { id: 'primers', name: 'Primers', desc: 'Design de primers', icon: <Dna size={24} />, category: 'Analysis', path: '/hugin/primers' },
        { id: 'cells', name: 'Cellules', desc: 'Suivi cellulaire', icon: <UserCheck size={24} />, category: 'Analysis', path: '/hugin/cells' },
        { id: 'colony', name: 'Colonies', desc: 'Comptage colonies', icon: <Camera size={24} />, category: 'Analysis', path: '/hugin/colony' }
    ];

    const categories = ['All', 'Core', 'Lab', 'Research', 'Analysis'];

    const accessibleModules = modules.filter(m => hasAccess(m.id));

    const filteredModules = accessibleModules.filter(m => {
        const name = (m as any).name;
        const desc = (m as any).desc;
        const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            desc.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = activeCategory === 'All' || m.category === activeCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div style={{ minHeight: '100vh', position: 'relative', paddingBottom: '4rem' }}>
            <Navbar />

            <div className="container" style={{ paddingTop: '2rem' }}>
                <header style={{ marginBottom: '3rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <img src="/logo3.png" alt="Hugin Lab Logo" style={{ width: '240px', height: '240px', objectFit: 'contain', marginBottom: '1.5rem', filter: 'drop-shadow(0 0 2px #fff) drop-shadow(0 0 5px rgba(99, 102, 241, 0.3))' }} />
                    <h1 className="text-gradient" style={{ fontSize: '3rem', marginBottom: '1rem' }}>{t('hugin.title')}</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', marginBottom: '2rem' }}>
                        {t('hugin.subtitle')}
                    </p>

                    <div style={{ position: 'relative', width: '100%', maxWidth: '600px', margin: '0 auto 2rem auto' }}>
                        <Search
                            size={20}
                            style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--accent-hugin)' }}
                        />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder={t('hugin.global_search')}
                            className="input-field"
                            style={{
                                paddingLeft: '3.5rem',
                                height: '54px',
                                fontSize: '1rem',
                                background: 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: '1.5rem',
                                boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
                            }}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '2rem' }}>
                        {categories.filter(cat => {
                            if (cat === 'All') return true;
                            return accessibleModules.some(m => m.category === cat);
                        }).map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                style={{
                                    padding: '0.6rem 1.25rem',
                                    borderRadius: '1rem',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    background: activeCategory === cat ? 'var(--accent-hugin)' : 'rgba(255, 255, 255, 0.05)',
                                    color: activeCategory === cat ? 'white' : 'var(--text-secondary)',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    fontWeight: activeCategory === cat ? 600 : 400,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem'
                                }}
                            >
                                {cat === 'All' && <Grid size={16} />}
                                {cat === 'Core' && <Layers size={16} />}
                                {cat === 'Lab' && <Package size={16} />}
                                {cat === 'Research' && <Brain size={16} />}
                                {cat === 'Analysis' && <Activity size={16} />}
                                {cat}
                            </button>
                        ))}
                    </div>
                </header>

                {categories.filter(cat => cat !== 'All' && (activeCategory === 'All' || activeCategory === cat)).map(cat => {
                    const catModules = filteredModules.filter(m => m.category === cat);
                    if (catModules.length === 0) return null;

                    return (
                        <div key={cat} style={{ marginBottom: '3rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                                <div style={{ height: '1px', flex: 1, background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.1))' }}></div>
                                <h2 style={{ fontSize: '1.25rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--accent-hugin)', fontWeight: 700 }}>{cat}</h2>
                                <div style={{ height: '1px', flex: 1, background: 'linear-gradient(to left, transparent, rgba(255,255,255,0.1))' }}></div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                                {catModules.map(m => {
                                    return (
                                        <div
                                            key={m.id}
                                            className="card glass-panel"
                                            onClick={() => navigate(m.path)}
                                            style={{
                                                cursor: 'pointer',
                                                position: 'relative',
                                                padding: '1.25rem',
                                                transition: 'all 0.2s',
                                                border: '1px solid rgba(255, 255, 255, 0.1)'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.transform = 'translateY(-4px)';
                                                e.currentTarget.style.boxShadow = '0 8px 24px rgba(99, 102, 241, 0.2)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.transform = 'translateY(0)';
                                                e.currentTarget.style.boxShadow = '';
                                            }}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                                                <div style={{ 
                                                    padding: '0.75rem', 
                                                    background: 'rgba(99, 102, 241, 0.15)', 
                                                    borderRadius: '0.75rem', 
                                                    color: 'var(--accent-hugin)',
                                                    flexShrink: 0
                                                }}>
                                                    {m.icon}
                                                </div>
                                                <div style={{ flex: 1 }}>
                                                    <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                                                        {(m as any).name}
                                                    </h3>
                                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.4, margin: 0 }}>
                                                        {(m as any).desc}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}

                {filteredModules.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '5rem', opacity: 0.5 }}>
                        <Search size={48} style={{ marginBottom: '1rem' }} />
                        <p style={{ fontSize: '1.2rem' }}>Aucun module trouvé pour "{searchQuery}"</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Hugin;
