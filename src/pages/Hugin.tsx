import { useState, useEffect, useMemo } from 'react';
import {
    Beaker, Calendar, Mail, HardDrive, Video, Brain, Quote, Book,
    Package, Snowflake, Activity, Wallet, BookOpen, Calculator,
    Dna, Camera, Layers, ShieldAlert, Zap, Share2, Box,
    TrendingUp, Grid, UserCheck, Search, FileText, Clock, GitBranch, Bot, Edit3, GraduationCap,
    Shield, Microscope, Cloud
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '../components/ToastContext';
import { useDeviceDetection } from '../hooks/useDeviceDetection';
import { useElectron } from '../hooks/useElectron';
import Navbar from '../components/Navbar';
import { checkHasAccess, getAccessData } from '../utils/ShieldUtils';
import { LOGOS } from '../utils/logoCache';
import HuginEditMode from '../components/HuginEditMode';
import { 
    getHuginModulesOrder, 
    applySortOrder, 
    filterVisibleModules,
    getCurrentUserEmail
} from '../utils/huginCustomization';
import type { ModuleOrder } from '../utils/huginCustomization';
import { getBetaFeatures, isSuperAdmin } from '../utils/betaAccess';
import { usePredictiveTracking } from '../hooks/usePredictiveTracking';
import { shouldShowStudentView, getHuginPlatformName, getHuginPlatformDescription } from '../utils/studentModules';

const Hugin = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { showToast } = useToast();
    const { isMobile } = useDeviceDetection();
    const { isElectron } = useElectron();
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('Tout');
    const [editMode, setEditMode] = useState(false);
    const [customOrder, setCustomOrder] = useState<ModuleOrder[]>(() => getHuginModulesOrder());
    
    // Tracking prédictif
    const { trackToolUse, trackSearch } = usePredictiveTracking();

    // Subscription Check logic
    const userStr = localStorage.getItem('currentUser');
    const { sub, hiddenTools } = getAccessData(userStr);
    
    // Détection de la vue étudiante
    const profileStr = userStr ? localStorage.getItem(`user_profile_${userStr}`) : null;
    const profile = profileStr ? JSON.parse(profileStr) : null;
    const isUserStudent = profile?.isStudent || false;
    const isStudentView = shouldShowStudentView(userStr, isUserStudent);
    const platformName = getHuginPlatformName(isStudentView);
    const platformDescription = getHuginPlatformDescription(isStudentView);

    // Check for denied access message
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        if (params.get('denied')) {
            showToast('Accès refusé', "error");
            // Clean URL
            navigate('/hugin', { replace: true });
        }
    }, [location, navigate, showToast]);

    const hasAccess = (moduleId: string) => checkHasAccess(moduleId, userStr, sub || undefined, hiddenTools);

    const isUserSuperAdmin = isSuperAdmin(getCurrentUserEmail());

    const modules = [
        // Core
        { id: 'messaging', name: 'Messagerie', desc: 'Gestion des messages et communications', icon: <Mail size={24} />, category: 'Core', path: '/hugin/messaging' },
        { id: 'planning', name: 'Planning', desc: 'Planification et calendrier', icon: <Calendar size={24} />, category: 'Core', path: '/hugin/planning' },
        { id: 'documents', name: 'Documents', desc: 'Gestion documentaire', icon: <HardDrive size={24} />, category: 'Core', path: '/hugin/documents' },
        { id: 'inventory', name: 'Inventaire', desc: 'Gestion de l\'inventaire', icon: <Beaker size={24} />, category: 'Core', path: '/hugin/inventory' },
        { id: 'meetings', name: 'Réunions', desc: 'Visioconférences', icon: <Video size={24} />, category: 'Core', path: '/hugin/meetings' },
        { id: 'projects', name: 'Projets', desc: 'Gestion de projets', icon: <Layers size={24} />, category: 'Core', path: '/hugin/projects' },
        { id: 'tableur', name: 'Tableur', desc: 'Tableur scientifique', icon: <Grid size={24} />, category: 'Core', path: '/hugin/tableur' },
        { id: 'word', name: 'Traitement de texte', desc: 'Éditeur de documents', icon: <FileText size={24} />, category: 'Core', path: '/hugin/word-processor' },
        { id: 'poster', name: 'Créateur de posters', desc: 'Conception de posters scientifiques', icon: <FileText size={24} />, category: 'Core', path: '/hugin/poster-maker' },
        { id: 'it_archive', name: 'Archives IT', desc: 'Archivage automatique', icon: <HardDrive size={24} />, category: 'Core', path: '/hugin/it-archive' },

        // Lab Management
        { id: 'cryo', name: 'Cryogénie', desc: 'Gestion des échantillons cryogéniques', icon: <Snowflake size={24} />, category: 'Lab', path: '/hugin/cryo' },
        { id: 'equip', name: 'Équipements', desc: 'Gestion des équipements', icon: <Activity size={24} />, category: 'Lab', path: '/hugin/equip' },
        { id: 'budget', name: 'Budget', desc: 'Gestion budgétaire', icon: <Wallet size={24} />, category: 'Lab', path: '/hugin/budget' },
        { id: 'safety', name: 'Sécurité', desc: 'Protocoles de sécurité', icon: <ShieldAlert size={24} />, category: 'Lab', path: '/hugin/safety' },
        { id: 'sop', name: 'Procédures', desc: 'Procédures opératoires standard', icon: <BookOpen size={24} />, category: 'Lab', path: '/hugin/sop' },

        // Research
        { id: 'culture', name: 'Cultures', desc: 'Gestion des cultures microbiennes', icon: <Beaker size={24} />, category: 'Research', path: '/hugin/culture' },
        { id: 'culture_cells', name: 'Culture cellulaire', desc: 'Gestion des cultures cellulaires', icon: <Activity size={24} />, category: 'Research', path: '/hugin/culture-cells' },
        { id: 'research', name: 'Recherche', desc: 'Projets de recherche', icon: <Brain size={24} />, category: 'Research', path: '/hugin/research' },
        { id: 'bibliography', name: 'Bibliographie', desc: 'Gestion bibliographique', icon: <Quote size={24} />, category: 'Research', path: '/hugin/bibliography' },
        { id: 'notebook', name: 'Cahier de labo', desc: 'Cahier de laboratoire numérique', icon: <Book size={24} />, category: 'Research', path: '/hugin/notebook' },

        // Analysis
        { id: 'bioanalyzer', name: 'BioAnalyzer', desc: 'Analyse de données biologiques', icon: <Dna size={24} />, category: 'Analysis', path: '/hugin/bioanalyzer' },
        { id: 'imageanalyzer', name: 'Analyse d\'images', desc: 'Traitement d\'images scientifiques', icon: <Camera size={24} />, category: 'Analysis', path: '/hugin/imageanalyzer' },
        { id: 'statistics', name: 'Statistiques', desc: 'Analyses statistiques', icon: <TrendingUp size={24} />, category: 'Analysis', path: '/hugin/statistics' },
        { id: 'sequence', name: 'Séquences', desc: 'Analyse de séquences', icon: <Dna size={24} />, category: 'Analysis', path: '/hugin/sequence' },
        { id: 'flow', name: 'Cytométrie', desc: 'Analyse de cytométrie en flux', icon: <Activity size={24} />, category: 'Analysis', path: '/hugin/flow' },
        { id: 'spectrum', name: 'Spectrométrie', desc: 'Analyse spectrométrique', icon: <Zap size={24} />, category: 'Analysis', path: '/hugin/spectrum' },
        { id: 'gel', name: 'Électrophorèse', desc: 'Analyse de gels', icon: <Layers size={24} />, category: 'Analysis', path: '/hugin/gel' },
        { id: 'phylo', name: 'Phylogénie', desc: 'Arbres phylogénétiques', icon: <Share2 size={24} />, category: 'Analysis', path: '/hugin/phylo' },
        { id: 'molecules', name: 'Molécules', desc: 'Visualisation moléculaire', icon: <Box size={24} />, category: 'Analysis', path: '/hugin/molecules' },
        { id: 'kinetics', name: 'Cinétique', desc: 'Analyse cinétique', icon: <TrendingUp size={24} />, category: 'Analysis', path: '/hugin/kinetics' },
        { id: 'plates', name: 'Plaques', desc: 'Gestion de plaques', icon: <Grid size={24} />, category: 'Analysis', path: '/hugin/plates' },
        { id: 'mixer', name: 'Mélangeur', desc: 'Calcul de mélanges', icon: <Beaker size={24} />, category: 'Analysis', path: '/hugin/mixer' },
        { id: 'primers', name: 'Amorces', desc: 'Design d\'amorces PCR', icon: <Dna size={24} />, category: 'Analysis', path: '/hugin/primers' },
        { id: 'cells', name: 'Cellules', desc: 'Comptage cellulaire', icon: <UserCheck size={24} />, category: 'Analysis', path: '/hugin/cells' },
        { id: 'colony', name: 'Colonies', desc: 'Comptage de colonies', icon: <Camera size={24} />, category: 'Analysis', path: '/hugin/colony' },
        { id: 'proteinfold', name: 'Repliement protéique', desc: 'Prédiction de structure', icon: <Layers size={24} />, category: 'Analysis', path: '/hugin/protein-fold' },
        { id: 'labtimer', name: 'Chronomètre', desc: 'Minuteur de laboratoire', icon: <Clock size={24} />, category: 'Core', path: '/hugin/lab-timer' },
        { id: 'buffercalc', name: 'Calcul de tampons', desc: 'Préparation de solutions tampons', icon: <Beaker size={24} />, category: 'Analysis', path: '/hugin/buffer-calc' },
        { id: 'pcrdesigner', name: 'Design PCR', desc: 'Conception de PCR', icon: <Dna size={24} />, category: 'Analysis', path: '/hugin/pcr-designer' },
        { id: 'gelsimulator', name: 'Simulateur de gel', desc: 'Simulation d\'électrophorèse', icon: <Layers size={24} />, category: 'Analysis', path: '/hugin/gel-simulator' },
        { id: 'proteincalc', name: 'Calcul protéique', desc: 'Propriétés des protéines', icon: <Calculator size={24} />, category: 'Analysis', path: '/hugin/protein-calculator' },
        { id: 'restrictionmap', name: 'Carte de restriction', desc: 'Cartographie de restriction', icon: <Dna size={24} />, category: 'Analysis', path: '/hugin/restriction-mapper' },
        { id: 'cloningassist', name: 'Assistant de clonage', desc: 'Aide au clonage moléculaire', icon: <GitBranch size={24} />, category: 'Analysis', path: '/hugin/cloning-assistant' },
        { id: 'bacterialgrowth', name: 'Croissance bactérienne', desc: 'Prédiction de croissance', icon: <TrendingUp size={24} />, category: 'Analysis', path: '/hugin/bacterial-growth' },
        { id: 'biotools', name: 'Outils Bio', desc: 'Calculateurs et convertisseurs (dilutions, concentrations, masse moléculaire)', icon: <Calculator size={24} />, category: 'Analysis', path: '/hugin/biotools' },
        { id: 'ai-assistant', name: 'Mímir', desc: 'Assistant scientifique intelligent - Votre conseiller en sagesse scientifique', icon: <Bot size={24} />, category: 'Analysis', path: '/hugin/ai-assistant' },

        // Scholar - Modules éducatifs avancés
        { id: 'resistance-phenotypes', name: 'Phénotypes de Résistance', desc: 'Mécanismes de résistance aux antibiotiques avec schémas explicatifs', icon: <Shield size={24} />, category: 'Scholar', path: '/hugin/resistance-phenotypes' },
        { id: 'lab-equipment', name: 'Fiches Machines', desc: 'Base de données des équipements de laboratoire avec guides d\'utilisation', icon: <Microscope size={24} />, category: 'Scholar', path: '/hugin/lab-equipment' },
        { id: 'qcm-multi', name: 'QCM Multi-Disciplines', desc: '2000+ questions pour tester vos connaissances scientifiques', icon: <Brain size={24} />, category: 'Scholar', path: '/hugin/qcm-multi-disciplines' },
        { id: 'lms', name: 'Plateforme d\'Apprentissage', desc: 'Système de gestion de l\'apprentissage (LMS type Moodle)', icon: <BookOpen size={24} />, category: 'Scholar', path: '/hugin/learning-management' },
        { id: 'cloud-storage', name: 'Stockage Cloud', desc: 'Stockage et partage de fichiers sécurisé (type Nextcloud amélioré)', icon: <Cloud size={24} />, category: 'Scholar', path: '/hugin/cloud-storage' }
    ];

    // Modules autorisés pour les étudiants (Scholar uniquement)
    const studentAllowedModules = [
        'messaging',              // Messagerie
        'planning',               // Planning
        'meetings',               // Réunions
        'word',                   // Traitement de texte
        'tableur',                // Tableur
        'poster',                 // Créateur de posters
        'research',               // Recherche de revue scientifique
        'bibliography',           // Bibliographie
        'notebook',               // Cahier de labo
        'ai-assistant',           // Mímir
        // Modules Scholar - UNIQUEMENT pour étudiants
        'resistance-phenotypes',  // Phénotypes de Résistance
        'lab-equipment',          // Fiches Machines
        'qcm-multi',              // QCM Multi-Disciplines
        'lms',                    // Plateforme d'Apprentissage
        'cloud-storage'           // Stockage Cloud
    ];
    
    // Modules Scholar à exclure pour les professionnels
    const scholarOnlyModules = [
        'resistance-phenotypes',
        'lab-equipment',
        'qcm-multi',
        'lms',
        'cloud-storage'
    ];

    // Filtrer les modules selon la vue
    const baseModules = isStudentView 
        ? modules.filter(m => studentAllowedModules.includes(m.id))
        : modules.filter(m => !scholarOnlyModules.includes(m.id)); // Exclure Scholar pour les pros

    // Charger les modules beta et les fusionner avec les modules standards
    const allModules = useMemo(() => {
        const standardModules: any[] = [...baseModules];
        
        if (!isUserSuperAdmin) {
            console.log('👤 Utilisateur standard, modules:', standardModules.length);
            return standardModules;
        }
        
        const betaFeatures = getBetaFeatures();
        
        console.log('🔄 Recalcul allModules');
        console.log('📋 customOrder:', customOrder);
        console.log('🧪 betaFeatures disponibles:', betaFeatures.map(f => f.id));
        
        // Ajouter les modules beta qui sont dans customOrder
        customOrder.forEach(orderItem => {
            if (orderItem.id.startsWith('beta_')) {
                const originalId = orderItem.id.replace('beta_', '');
                const betaModule = betaFeatures.find(f => f.id === originalId);
                if (betaModule) {
                    console.log('✅ Ajout module beta:', betaModule.name, '(id:', orderItem.id, ')');
                    standardModules.push({
                        id: orderItem.id,
                        name: betaModule.name,
                        desc: betaModule.description,
                        icon: <span style={{ fontSize: '1.5rem' }}>🧪</span>,
                        category: betaModule.category,
                        path: betaModule.path,
                        isBeta: true // Marqueur pour le style
                    });
                } else {
                    console.warn('⚠️ Module beta introuvable:', originalId);
                }
            }
        });
        
        console.log('📦 Total modules (avec beta):', standardModules.length);
        return standardModules;
    }, [isUserSuperAdmin, customOrder, baseModules]);

    const categories = ['Tout', 'Core', 'Lab', 'Research', 'Analysis', 'Scholar'];

    const accessibleModules = allModules.filter(m => hasAccess(m.id));

    // Appliquer l'ordre personnalisé et filtrer les modules cachés
    let sortedModules = accessibleModules;
    if (customOrder.length > 0) {
        sortedModules = applySortOrder(accessibleModules, customOrder);
        sortedModules = filterVisibleModules(sortedModules, customOrder);
    }

    const filteredModules = sortedModules.filter(m => {
        const name = (m as any).name;
        const desc = (m as any).desc;
        const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            desc.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = activeCategory === 'Tout' || m.category === activeCategory;
        return matchesSearch && matchesCategory;
    });

    const handleSaveCustomization = () => {
        console.log('💾 Callback sauvegarde - rechargement de la page');
        // Le rechargement est géré par HuginEditMode
    };

    return (
        <div style={{ minHeight: '100vh', position: 'relative', paddingBottom: '4rem' }}>
            {!isElectron && <Navbar />}

            <div className="container" style={{ paddingTop: isElectron ? '1rem' : '2rem' }}>
                <header style={{ marginBottom: '3rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    {!isElectron && (
                        <img src={LOGOS.hugin} alt={`${platformName} Logo`} style={{ width: '400px', height: '400px', objectFit: 'contain', marginBottom: '0.5rem', filter: 'drop-shadow(0 0 2px #fff) drop-shadow(0 0 5px rgba(99, 102, 241, 0.3))' }} />
                    )}
                    <h1 className="text-gradient" style={{ fontSize: isElectron ? '2.5rem' : '3rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        {isStudentView && <GraduationCap size={48} />}
                        {platformName}
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', marginBottom: '2rem' }}>
                        {platformDescription}
                    </p>
                    
                    {isStudentView && (
                        <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.75rem 1.5rem',
                            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(5, 150, 105, 0.15))',
                            border: '2px solid #10b981',
                            borderRadius: '2rem',
                            marginBottom: '2rem',
                            fontSize: '0.95rem',
                            fontWeight: 600,
                            color: '#10b981',
                            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)'
                        }}>
                            <GraduationCap size={20} />
                            <span>Mode Étudiant - Modules adaptés à la scolarité</span>
                        </div>
                    )}

                    <div style={{ position: 'relative', width: '100%', maxWidth: '600px', margin: '0 auto 2rem auto' }}>
                        <Search
                            size={20}
                            style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--accent-hugin)' }}
                        />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => {
                                const query = e.target.value;
                                setSearchQuery(query);
                                if (query.length >= 3) {
                                    trackSearch(query);
                                }
                            }}
                            placeholder="Rechercher un module..."
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

                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '2rem', alignItems: 'center' }}>
                        {categories.filter(cat => {
                            if (cat === 'Tout') return true;
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
                                {cat === 'Tout' && <Grid size={16} />}
                                {cat === 'Core' && <Layers size={16} />}
                                {cat === 'Lab' && <Package size={16} />}
                                {cat === 'Research' && <Brain size={16} />}
                                {cat === 'Analysis' && <Activity size={16} />}
                                {cat === 'Scholar' && <GraduationCap size={16} />}
                                {cat}
                            </button>
                        ))}
                        
                        <div style={{ width: '1px', height: '24px', background: 'rgba(255, 255, 255, 0.2)', margin: '0 0.5rem' }}></div>
                        
                        <button
                            onClick={() => setEditMode(true)}
                            style={{
                                padding: '0.6rem 1.25rem',
                                borderRadius: '1rem',
                                border: '2px solid var(--accent-hugin)',
                                background: 'rgba(99, 102, 241, 0.1)',
                                color: 'var(--accent-hugin)',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                fontWeight: 600,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'var(--accent-hugin)';
                                e.currentTarget.style.color = 'white';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'rgba(99, 102, 241, 0.1)';
                                e.currentTarget.style.color = 'var(--accent-hugin)';
                            }}
                        >
                            <Edit3 size={16} />
                            Personnaliser
                        </button>
                    </div>
                </header>

                {/* Affichage des modules (identique pour étudiants et professionnels, mais filtrés) */}
                {isStudentView && (
                    <div style={{
                        maxWidth: '900px',
                        margin: '0 auto 2rem',
                        padding: '1.5rem',
                        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.05))',
                        border: '2px solid #10b981',
                        borderRadius: '1rem',
                        textAlign: 'center'
                    }}>
                        <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
                            <strong style={{ color: '#10b981' }}>🎓 Modules adaptés aux étudiants</strong> - Vous avez accès aux outils essentiels pour vos études et travaux pratiques. Les modules Scholar spécialisés (Devoirs & TP, Préparation Examens, Notes de Cours, Comptes-Rendus) arrivent bientôt !
                        </p>
                    </div>
                )}

                {categories.filter(cat => cat !== 'Tout' && (activeCategory === 'Tout' || activeCategory === cat)).map(cat => {
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
                                    const isBeta = (m as any).isBeta === true;
                                    return (
                                        <div
                                            key={m.id}
                                            className="card glass-panel"
                                            onClick={() => {
                                                trackToolUse(m.id);
                                                navigate(m.path);
                                            }}
                                            style={{
                                                cursor: 'pointer',
                                                position: 'relative',
                                                padding: '1.25rem',
                                                transition: 'all 0.2s',
                                                border: isBeta ? '2px solid rgba(245, 158, 11, 0.5)' : '1px solid rgba(255, 255, 255, 0.1)',
                                                background: isBeta ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(251, 146, 60, 0.05))' : undefined
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.transform = 'translateY(-4px)';
                                                e.currentTarget.style.boxShadow = isBeta ? '0 8px 24px rgba(245, 158, 11, 0.3)' : '0 8px 24px rgba(99, 102, 241, 0.2)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.transform = 'translateY(0)';
                                                e.currentTarget.style.boxShadow = '';
                                            }}
                                        >
                                            {isBeta && (
                                                <div style={{
                                                    position: 'absolute',
                                                    top: '0.5rem',
                                                    right: '0.5rem',
                                                    padding: '0.25rem 0.6rem',
                                                    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                                                    borderRadius: '6px',
                                                    fontSize: '0.7rem',
                                                    color: 'white',
                                                    fontWeight: 700,
                                                    boxShadow: '0 2px 8px rgba(245, 158, 11, 0.4)'
                                                }}>
                                                    🧪 BETA
                                                </div>
                                            )}
                                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                                                <div style={{ 
                                                    padding: '0.75rem', 
                                                    background: isBeta ? 'rgba(245, 158, 11, 0.2)' : 'rgba(99, 102, 241, 0.15)', 
                                                    borderRadius: '0.75rem', 
                                                    color: isBeta ? '#f59e0b' : 'var(--accent-hugin)',
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

            {/* Edit Mode Modal */}
            {editMode && (
                <HuginEditMode
                    modules={accessibleModules}
                    onClose={() => setEditMode(false)}
                    onSave={handleSaveCustomization}
                />
            )}
        </div>
    );
};

export default Hugin;
