import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Search, X, Command, ArrowRight, Beaker, Mail,
    Calendar, Grid, Video, Brain, BookOpen, Quote,
    Calculator, Dna, Activity, Zap, Layers, Box,
    TrendingUp, UserCheck, ShieldAlert, Package,
    HardDrive, Snowflake, Wallet, Share2, Star
} from 'lucide-react';
import { advancedModules } from '../data/modulesConfig';
import { checkHasAccess, getAccessData } from '../utils/ShieldUtils';
import { useDeviceDetection } from '../hooks/useDeviceDetection';

interface PageItem {
    id: string;
    label: string;
    category: string;
    path: string;
    icon: React.ReactNode;
    moduleId: string; // The ID used for hasAccess checks
}

const CommandPalette = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [favorites, setFavorites] = useState<string[]>([]);
    const navigate = useNavigate();
    const inputRef = useRef<HTMLInputElement>(null);
    const { isMobile } = useDeviceDetection();

    // Get access data
    const userStr = localStorage.getItem('currentUser');
    const { sub, hiddenTools } = getAccessData(userStr);

    const hasAccess = (moduleId: string) => checkHasAccess(moduleId, userStr, sub || undefined, hiddenTools);

    // Initialize favorites from localStorage
    useEffect(() => {
        const storedFavorites = localStorage.getItem('ols_favorites');
        if (storedFavorites) {
            try {
                setFavorites(JSON.parse(storedFavorites));
            } catch (e) {
                console.error("Error parsing favorites", e);
            }
        }
    }, []);

    const toggleFavorite = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        const newFavorites = favorites.includes(id)
            ? favorites.filter(fav => fav !== id)
            : [...favorites, id];

        setFavorites(newFavorites);
        localStorage.setItem('ols_favorites', JSON.stringify(newFavorites));
    };

    const allPages: PageItem[] = [
        // Hugin Core
        { id: 'messaging', label: 'Messaging & Chat', category: 'Communication', path: '/hugin/messaging', icon: <Mail size={18} />, moduleId: 'messaging' },
        { id: 'planning', label: 'Lab Planning', category: 'Management', path: '/hugin/planning', icon: <Calendar size={18} />, moduleId: 'planning' },
        { id: 'projects', label: 'Project Mind', category: 'Management', path: '/hugin/projects', icon: <Layers size={18} />, moduleId: 'projects' },
        { id: 'inventory', label: 'LIMS Inventory', category: 'Management', path: '/hugin/inventory', icon: <Package size={18} />, moduleId: 'inventory' },
        { id: 'tableur', label: 'Tableur Lab', category: 'Research', path: '/hugin/tableur', icon: <Grid size={18} />, moduleId: 'tableur' },
        { id: 'meetings', label: 'Video Meetings', category: 'Communication', path: '/hugin/meetings', icon: <Video size={18} />, moduleId: 'meetings' },
        { id: 'it_archive', label: 'IT Data Archive', category: 'Research', path: '/hugin/it-archive', icon: <HardDrive size={18} />, moduleId: 'it_archive' },

        // Hugin Lab
        { id: 'culture', label: 'Culture Tracking', category: 'Analysis', path: '/hugin/culture', icon: <Activity size={18} />, moduleId: 'culture' },
        { id: 'research', label: 'Scientific Research', category: 'Research', path: '/hugin/research', icon: <Brain size={18} />, moduleId: 'research' },
        { id: 'mimir', label: 'Mimir AI Knowledge', category: 'Research', path: '/hugin/mimir', icon: <Brain size={18} />, moduleId: 'mimir' },
        { id: 'bibliography', label: 'Bibliography', category: 'Research', path: '/hugin/bibliography', icon: <Quote size={18} />, moduleId: 'bibliography' },
        { id: 'notebook', label: 'Lab Notebook', category: 'Research', path: '/hugin/notebook', icon: <BookOpen size={18} />, moduleId: 'notebook' },
        { id: 'stock', label: 'Reagent Stock', category: 'Management', path: '/hugin/stock', icon: <Package size={18} />, moduleId: 'stock' },
        { id: 'cryo', label: 'CryoKeeper', category: 'Management', path: '/hugin/cryo', icon: <Snowflake size={18} />, moduleId: 'cryo' },
        { id: 'equip', label: 'EquipFlow', category: 'Management', path: '/hugin/equip', icon: <Activity size={18} />, moduleId: 'equip' },
        { id: 'budget', label: 'Grant Budget', category: 'Management', path: '/hugin/budget', icon: <Wallet size={18} />, moduleId: 'budget' },
        { id: 'sop', label: 'SOP Library', category: 'Management', path: '/hugin/sop', icon: <BookOpen size={18} />, moduleId: 'sop' },
        { id: 'safety', label: 'Safety Hub', category: 'Management', path: '/hugin/safety', icon: <ShieldAlert size={18} />, moduleId: 'safety' },

        // Hugin Analysis
        { id: 'biotools', label: 'Bio ToolBox', category: 'Analysis', path: '/hugin/biotools', icon: <Calculator size={18} />, moduleId: 'biotools' },
        { id: 'sequence', label: 'Sequence Lens', category: 'Analysis', path: '/hugin/sequence', icon: <Dna size={18} />, moduleId: 'sequence' },
        { id: 'flow', label: 'Flow Analyzer', category: 'Analysis', path: '/hugin/flow', icon: <Activity size={18} />, moduleId: 'flow' },
        { id: 'spectrum', label: 'Spectrum Viewer', category: 'Analysis', path: '/hugin/spectrum', icon: <Zap size={18} />, moduleId: 'spectrum' },
        { id: 'gel', label: 'GelPro', category: 'Analysis', path: '/hugin/gel', icon: <Layers size={18} />, moduleId: 'gel' },
        { id: 'phylo', label: 'PhyloGen', category: 'Analysis', path: '/hugin/phylo', icon: <Share2 size={18} />, moduleId: 'phylo' },
        { id: 'molecules', label: 'Molecule Box', category: 'Analysis', path: '/hugin/molecules', icon: <Box size={18} />, moduleId: 'molecules' },
        { id: 'kinetics', label: 'Kinetics Lab', category: 'Analysis', path: '/hugin/kinetics', icon: <TrendingUp size={18} />, moduleId: 'kinetics' },
        { id: 'plates', label: 'Plate Mapper', category: 'Analysis', path: '/hugin/plates', icon: <Grid size={18} />, moduleId: 'plates' },
        { id: 'mixer', label: 'Solution Mixer', category: 'Analysis', path: '/hugin/mixer', icon: <Package size={18} />, moduleId: 'mixer' },
        { id: 'primers', label: 'Primer Step', category: 'Analysis', path: '/hugin/primers', icon: <Dna size={18} />, moduleId: 'primers' },
        { id: 'cells', label: 'Cell Tracker', category: 'Analysis', path: '/hugin/cells', icon: <UserCheck size={18} />, moduleId: 'cells' },
        { id: 'colony', label: 'Colony Vision', category: 'Analysis', path: '/hugin/colony', icon: <Activity size={18} />, moduleId: 'colony' },

        // Advanced
        ...advancedModules.map(m => ({
            id: m.id,
            label: (m as any).name || m.id,
            category: m.category,
            path: `/hugin/advanced/${m.id}`,
            icon: <Beaker size={18} />,
            moduleId: m.id
        })),

        // General
        { id: 'home', label: 'Dashboard Home', category: 'General', path: '/home', icon: <Grid size={18} />, moduleId: 'any' },
        { id: 'munin', label: 'Munin Atlas', category: 'General', path: '/munin', icon: <BookOpen size={18} />, moduleId: 'any' },
        { id: 'account', label: 'Mon Compte', category: 'Settings', path: '/account', icon: <UserCheck size={18} />, moduleId: 'any' }
    ];

    const accessiblePages = allPages.filter(p => hasAccess(p.moduleId));

    // Sort: favorites first if no search
    const filteredPages = accessiblePages.filter(p =>
        p.label.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase())
    ).sort((a, b) => {
        if (search) return 0; // Don't sort by fav when searching
        const aFav = favorites.includes(a.id);
        const bFav = favorites.includes(b.id);
        if (aFav && !bFav) return -1;
        if (!aFav && bFav) return 1;
        return 0;
    });

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault();
                setIsOpen(prev => !prev);
                setSearch('');
            }
            if (e.key === 'Escape') setIsOpen(false);
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    useEffect(() => {
        if (isOpen) {
            inputRef.current?.focus();
            setSelectedIndex(0);
        }
    }, [isOpen]);

    const handleSelect = (page: PageItem) => {
        navigate(page.path);
        setIsOpen(false);
    };

    const onKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(prev => (prev + 1) % filteredPages.length);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => (prev - 1 + filteredPages.length) % filteredPages.length);
        } else if (e.key === 'Enter') {
            if (filteredPages[selectedIndex]) {
                handleSelect(filteredPages[selectedIndex]);
            }
        }
    };

    if (!isOpen) return null;

    return (
        <div
            style={{
                position: 'fixed',
                top: 0, left: 0, right: 0, bottom: 0,
                zIndex: 10000,
                background: 'rgba(0, 0, 0, 0.6)',
                backdropFilter: 'blur(8px)',
                display: 'flex',
                justifyContent: 'center',
                paddingTop: isMobile ? '5vh' : '15vh',
                animation: 'fadeIn 0.2s ease-out'
            }}
            onClick={() => setIsOpen(false)}
        >
            <div
                className="glass-panel"
                style={{
                    width: isMobile ? '95%' : '100%',
                    maxWidth: '650px',
                    height: 'fit-content',
                    maxHeight: isMobile ? '80vh' : '60vh',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    background: 'rgba(20, 20, 30, 0.95)',
                    borderRadius: '1rem'
                }}
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div style={{ padding: '1.25rem', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Search size={22} color="var(--accent-primary)" />
                    <input
                        ref={inputRef}
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        onKeyDown={onKeyDown}
                        placeholder={isMobile ? "Rechercher..." : "Rechercher un outil, un module, une page..."}
                        style={{
                            flex: 1,
                            background: 'transparent',
                            border: 'none',
                            outline: 'none',
                            color: 'white',
                            fontSize: '1.1rem',
                            fontFamily: 'inherit'
                        }}
                    />
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        {!isMobile && <span style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', opacity: 0.6 }}>ESC</span>}
                        <X size={20} style={{ cursor: 'pointer', opacity: 0.5 }} onClick={() => setIsOpen(false)} />
                    </div>
                </div>

                {/* Results */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '0.75rem' }} className="custom-scrollbar">
                    {filteredPages.length > 0 ? (
                        <>
                            {!search && favorites.length > 0 && (
                                <div style={{ padding: '0.5rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.8 }}>
                                    Favoris
                                </div>
                            )}
                            {filteredPages.map((page, idx) => {
                                const isFavorite = favorites.includes(page.id);
                                return (
                                    <div
                                        key={page.id}
                                        onClick={() => handleSelect(page)}
                                        onMouseEnter={() => setSelectedIndex(idx)}
                                        style={{
                                            padding: '0.85rem 1rem',
                                            borderRadius: '0.75rem',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '1rem',
                                            cursor: 'pointer',
                                            background: selectedIndex === idx ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                                            transition: 'all 0.15s ease',
                                            position: 'relative'
                                        }}
                                    >
                                        <div style={{
                                            padding: '0.5rem',
                                            background: selectedIndex === idx ? 'var(--accent-primary)' : 'rgba(255, 255, 255, 0.05)',
                                            borderRadius: '0.5rem',
                                            color: selectedIndex === idx ? 'white' : 'var(--text-secondary)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            {page.icon}
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontWeight: 600, color: selectedIndex === idx ? 'white' : 'var(--text-primary)' }}>{page.label}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', opacity: 0.8 }}>{page.category}</div>
                                        </div>

                                        <div
                                            onClick={(e) => toggleFavorite(page.id, e)}
                                            style={{
                                                padding: '8px',
                                                borderRadius: '50%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: isFavorite ? '#fbbf24' : 'rgba(255,255,255,0.2)',
                                                transition: 'all 0.2s ease',
                                                cursor: 'pointer'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.background = 'transparent';
                                            }}
                                        >
                                            <Star size={16} fill={isFavorite ? '#fbbf24' : 'none'} />
                                        </div>

                                        {selectedIndex === idx && !isMobile && (
                                            <ArrowRight size={16} color="var(--accent-primary)" style={{ animation: 'slideRight 0.3s ease-out' }} />
                                        )}
                                    </div>
                                );
                            })}
                        </>
                    ) : (
                        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)', opacity: 0.5 }}>
                            <Command size={48} style={{ marginBottom: '1rem', opacity: 0.2 }} />
                            <p>Aucun résultat pour "{search}"</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                {!isMobile && (
                    <div style={{ padding: '0.75rem 1.25rem', borderTop: '1px solid rgba(255, 255, 255, 0.05)', background: 'rgba(0,0,0,0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        <div style={{ display: 'flex', gap: '1.5rem' }}>
                            <span><kbd style={kbdStyle}>↵</kbd> Sélectionner</span>
                            <span><kbd style={kbdStyle}>↑↓</kbd> Naviguer</span>
                        </div>
                        <span>Ctrl + K pour ouvrir</span>
                    </div>
                )}
            </div>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: scale(0.98); }
                    to { opacity: 1; transform: scale(1); }
                }
                @keyframes slideRight {
                    from { transform: translateX(-5px); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255,255,255,0.1);
                    border-radius: 10px;
                }
            `}</style>
        </div>
    );
};

const kbdStyle = {
    padding: '2px 6px',
    background: 'rgba(255,255,255,0.1)',
    border: '1px solid rgba(255,255,255,0.2)',
    borderRadius: '4px',
    fontSize: '0.7rem',
    marginRight: '5px'
};

export default CommandPalette;
