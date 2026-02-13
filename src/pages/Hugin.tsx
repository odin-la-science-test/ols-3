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

import { advancedModules } from '../data/modulesConfig';
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
        // Lab Management
        { id: 'inventory', icon: <Beaker size={24} />, category: 'Management', path: '/hugin/inventory' },
        { id: 'stock', icon: <Package size={24} />, category: 'Management', path: '/hugin/stock' },
        { id: 'budget', icon: <Wallet size={24} />, category: 'Management', path: '/hugin/budget' },
        { id: 'planning', icon: <Calendar size={24} />, category: 'Management', path: '/hugin/planning' },
        { id: 'safety', icon: <ShieldAlert size={24} />, category: 'Management', path: '/hugin/safety' },
        { id: 'sop', icon: <BookOpen size={24} />, category: 'Management', path: '/hugin/sop' },
        { id: 'cryo', icon: <Snowflake size={24} />, category: 'Management', path: '/hugin/cryo' },
        { id: 'equip', icon: <Activity size={24} />, category: 'Management', path: '/hugin/equip' },

        // Communication
        { id: 'messaging', icon: <Mail size={24} />, category: 'Communication', path: '/hugin/messaging' },
        { id: 'meetings', icon: <Video size={24} />, category: 'Communication', path: '/hugin/meetings' },
        { id: 'projects', icon: <Layers size={24} />, category: 'Communication', path: '/hugin/projects' },

        // Research & Data
        { id: 'research', icon: <Brain size={24} />, category: 'Research', path: '/hugin/research' },
        { id: 'mimir', icon: <Brain size={24} />, category: 'Research', path: '/hugin/mimir' },
        { id: 'bibliography', icon: <Quote size={24} />, category: 'Research', path: '/hugin/bibliography' },
        { id: 'notebook', icon: <Book size={24} />, category: 'Research', path: '/hugin/notebook' },
        { id: 'it_archive', icon: <HardDrive size={24} />, category: 'Research', path: '/hugin/it-archive' },
        { id: 'tableur', icon: <Grid size={24} />, category: 'Research', path: '/hugin/tableur' },

        // Scientific Analysis
        { id: 'bioanalyzer', icon: <Dna size={24} />, category: 'Analysis', path: '/hugin/bioanalyzer' },
        { id: 'imageanalyzer', icon: <Camera size={24} />, category: 'Analysis', path: '/hugin/imageanalyzer' },
        { id: 'statistics', icon: <TrendingUp size={24} />, category: 'Analysis', path: '/hugin/statistics' },
        { id: 'biotools', icon: <Calculator size={24} />, category: 'Analysis', path: '/hugin/biotools' },
        { id: 'sequence', icon: <Dna size={24} />, category: 'Analysis', path: '/hugin/sequence' },
        { id: 'flow', icon: <Activity size={24} />, category: 'Analysis', path: '/hugin/flow' },
        { id: 'spectrum', icon: <Zap size={24} />, category: 'Analysis', path: '/hugin/spectrum' },
        { id: 'gel', icon: <Layers size={24} />, category: 'Analysis', path: '/hugin/gel' },
        { id: 'phylo', icon: <Share2 size={24} />, category: 'Analysis', path: '/hugin/phylo' },
        { id: 'molecules', icon: <Box size={24} />, category: 'Analysis', path: '/hugin/molecules' },
        { id: 'kinetics', icon: <TrendingUp size={24} />, category: 'Analysis', path: '/hugin/kinetics' },
        { id: 'plates', icon: <Grid size={24} />, category: 'Analysis', path: '/hugin/plates' },
        { id: 'mixer', icon: <Beaker size={24} />, category: 'Analysis', path: '/hugin/mixer' },
        { id: 'primers', icon: <Dna size={24} />, category: 'Analysis', path: '/hugin/primers' },
        { id: 'cells', icon: <UserCheck size={24} />, category: 'Analysis', path: '/hugin/cells' },
        { id: 'colony', icon: <Camera size={24} />, category: 'Analysis', path: '/hugin/colony' },
        { id: 'culture', icon: <Beaker size={24} />, category: 'Analysis', path: '/hugin/culture' },

        // Advanced Modules
        ...advancedModules.map(m => ({
            id: m.id,
            icon: <Activity size={24} />,
            category: m.category,
            path: `/hugin/advanced/${m.id}`,
            name: m.name,
            desc: m.description
        }))
    ];

    const categories = ['All', 'Management', 'Communication', 'Research', 'Analysis', 'Bacteriology', 'Cell Culture', 'Hematology', 'Bio Production', 'Biochemistry'];

    const accessibleModules = modules.filter(m => hasAccess(m.id));

    const filteredModules = accessibleModules.filter(m => {
        const name = (m as any).name || t(`hugin.${m.id}`);
        const desc = (m as any).desc || t(`hugin.${m.id}_desc`);
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
                                {cat === 'Management' && <Package size={16} />}
                                {cat === 'Communication' && <Mail size={16} />}
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
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                                {catModules.map(m => {
                                    return (
                                        <div
                                            key={m.id}
                                            className="card glass-panel"
                                            onClick={() => {
                                                if (m.id === 'bact_blast') navigate('/hugin/blast');
                                                else if (m.id === 'bact_mega') navigate('/hugin/mega');
                                                else if (m.id === 'bact_bionumerics') navigate('/hugin/bionumerics');
                                                else if (m.id === 'bact_artemis') navigate('/hugin/artemis');
                                                else if (m.id === 'bact_qiime2') navigate('/hugin/qiime2');
                                                else if (m.id === 'bact_whonet') navigate('/hugin/whonet');
                                                else navigate(m.path);
                                            }}
                                            style={{
                                                cursor: 'pointer',
                                                position: 'relative'
                                            }}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                                                <div style={{ padding: '0.75rem', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '0.5rem', color: 'var(--accent-hugin)' }}>
                                                    {m.icon}
                                                </div>
                                                <h3 style={{ fontSize: '1.25rem' }}>{(m as any).name || t(`hugin.${m.id}`)}</h3>
                                            </div>
                                            <p style={{ color: 'var(--text-secondary)' }}>
                                                {(m as any).desc || t(`hugin.${m.id}_desc`)}
                                            </p>
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
