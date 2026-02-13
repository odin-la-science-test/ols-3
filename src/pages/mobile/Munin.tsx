import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, BookOpen, Grid, Activity, Dna, FlaskConical, Calculator, Users, Settings } from 'lucide-react';
import MobileBottomNav from '../../components/MobileBottomNav';
import disciplinesArray from '../../data/disciplines.json';
import '../../styles/mobile-app.css';

const MobileMunin = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const [showFilters, setShowFilters] = useState(false);

    const getCategory = (id: string): string => {
        const medical = ['anesthesie', 'cardiologie', 'chirurgie', 'geriatrie', 'immunologie', 'neurologie', 'odontologie', 'oncologie', 'orthophonie', 'pediatrie', 'pharmacie', 'pharmacologie', 'psychiatrie', 'radiologie', 'sante-publique', 'biomedicales', 'toxicologie', 'virologie'];
        const life = ['agronomie', 'agroecologie', 'astrobiologie', 'bacteriologie', 'bio-ingenierie', 'biochimie', 'bioinformatique', 'biologie', 'biophysique', 'biostatistique', 'biotechnologies', 'botanique', 'chronobiologie', 'ecologie', 'entomologie', 'ethologie', 'genetique', 'genomique', 'herpetologie', 'ichtyologie', 'limnologie', 'mammalogie', 'microbiologie', 'mycologie', 'neurobiologie', 'neurosciences', 'oceanographie-biologique', 'ornithologie', 'paleontologie', 'parasitologie', 'physiologie', 'proteomique', 'zoologie'];
        const physical = ['acoustique', 'astrometrie', 'astronomie', 'astrophysique', 'chimie', 'climatologie', 'cosmologie', 'cristallographie', 'geochimie', 'geologie', 'geomorphologie', 'geophysique', 'hydrogeologie', 'meteorologie', 'mineralogie', 'oceanographie', 'optique', 'petrologie', 'physique', 'planetologie', 'seismologie', 'spectroscopie', 'thermodynamique', 'volcanologie'];
        const formal = ['algorithmique', 'algebre', 'analyse-mathematique', 'apprentissage-automatique', 'cryptographie', 'cybersecurite', 'donnees', 'geometrie', 'informatique', 'intelligence-artificielle', 'logique', 'mathematiques', 'optimisation', 'probabilites', 'operationnelle', 'reseaux', 'statistique', 'theorie', 'topologie'];
        const social = ['anthropologie', 'archeologie', 'criminologie', 'demographie', 'ethnologie', 'geographie', 'histoire', 'linguistique', 'paleoanthropologie', 'prehistoire', 'psycholinguistique', 'psychologie', 'sociologie', 'politique', 'internationales'];
        const engineering = ['automatique', 'civil', 'materiaux', 'procedes', 'industriel', 'logiciel', 'mecanique', 'nucleaire', 'electrique', 'electronique', 'energetique', 'mecatronique', 'nanotechnologies', 'robotique', 'telecommunications'];

        if (medical.some(k => id.includes(k))) return 'Medical Sciences';
        if (life.some(k => id.includes(k))) return 'Life Sciences';
        if (physical.some(k => id.includes(k))) return 'Physical & Earth';
        if (formal.some(k => id.includes(k))) return 'Formal Sciences';
        if (social.some(k => id.includes(k))) return 'Social Sciences';
        if (engineering.some(k => id.includes(k))) return 'Engineering & Tech';
        return 'General Sciences';
    };

    const categories = [
        { name: 'All', icon: <Grid size={18} />, color: '#64748b', label: 'Tout' },
        { name: 'Medical Sciences', icon: <Activity size={18} />, color: '#ef4444', label: 'Médecine' },
        { name: 'Life Sciences', icon: <Dna size={18} />, color: '#10b981', label: 'Biologie' },
        { name: 'Physical & Earth', icon: <FlaskConical size={18} />, color: '#3b82f6', label: 'Physique' },
        { name: 'Formal Sciences', icon: <Calculator size={18} />, color: '#8b5cf6', label: 'Maths' },
        { name: 'Social Sciences', icon: <Users size={18} />, color: '#f59e0b', label: 'Social' },
        { name: 'Engineering & Tech', icon: <Settings size={18} />, color: '#06b6d4', label: 'Tech' }
    ];

    const categorizedDisciplines = disciplinesArray.map((d: any) => ({
        ...d,
        category: getCategory(d.id)
    })).filter((d: any) =>
        d.name?.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (activeCategory === 'All' || d.category === activeCategory)
    );

    return (
        <div className="mobile-app">
            {/* Header avec gradient */}
            <div className="mobile-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <img 
                        src="/logo2.png" 
                        alt="Munin" 
                        style={{ width: '48px', height: '48px', objectFit: 'contain' }} 
                    />
                    <div>
                        <h1 className="mobile-header-title">Munin Atlas</h1>
                        <p className="mobile-header-subtitle">
                            {categorizedDisciplines.length} disciplines scientifiques
                        </p>
                    </div>
                </div>
            </div>

            {/* Contenu */}
            <div className="mobile-content">
                {/* Barre de recherche */}
                <div className="mobile-search">
                    <Search size={18} className="mobile-search-icon" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Rechercher une discipline..."
                        className="mobile-input"
                    />
                </div>

                {/* Filtres de catégories */}
                <div className="mobile-section">
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="mobile-btn mobile-btn-secondary"
                        style={{ width: '100%', justifyContent: 'space-between' }}
                    >
                        <span>Catégories</span>
                        <span className="mobile-badge mobile-badge-primary">
                            {activeCategory === 'All' ? 'Toutes' : categories.find(c => c.name === activeCategory)?.label}
                        </span>
                    </button>

                    {showFilters && (
                        <div style={{ 
                            marginTop: '1rem', 
                            display: 'grid', 
                            gridTemplateColumns: 'repeat(2, 1fr)', 
                            gap: '0.75rem',
                            animation: 'mobile-slide-up 0.3s ease-out'
                        }}>
                            {categories.map(cat => (
                                <button
                                    key={cat.name}
                                    onClick={() => {
                                        setActiveCategory(cat.name);
                                        setShowFilters(false);
                                    }}
                                    className="mobile-card"
                                    style={{
                                        border: activeCategory === cat.name ? `2px solid ${cat.color}` : '1px solid var(--mobile-border)',
                                        background: activeCategory === cat.name ? `${cat.color}15` : 'var(--mobile-card)',
                                        color: activeCategory === cat.name ? cat.color : 'var(--mobile-text)',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        fontSize: '0.85rem',
                                        fontWeight: activeCategory === cat.name ? 600 : 400,
                                        minHeight: '80px',
                                        padding: '1rem'
                                    }}
                                >
                                    {cat.icon}
                                    <span style={{ textAlign: 'center', lineHeight: 1.2 }}>{cat.label}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Liste des disciplines */}
                {categorizedDisciplines.length === 0 ? (
                    <div className="mobile-empty">
                        <div className="mobile-empty-icon">
                            <Search size={64} />
                        </div>
                        <div className="mobile-empty-title">Aucune discipline trouvée</div>
                        <div className="mobile-empty-subtitle">Essayez une autre recherche</div>
                    </div>
                ) : (
                    <div className="mobile-list">
                        {categorizedDisciplines.map((d) => (
                            <div
                                key={d.id}
                                className="mobile-list-item"
                                onClick={() => navigate(`/munin/${d.id}`)}
                            >
                                <div 
                                    className="mobile-list-item-icon"
                                    style={{ 
                                        background: `${categories.find(c => c.name === d.category)?.color}15`,
                                        color: categories.find(c => c.name === d.category)?.color
                                    }}
                                >
                                    <BookOpen size={24} />
                                </div>
                                <div className="mobile-list-item-content">
                                    <div className="mobile-list-item-title">
                                        {d.name}
                                    </div>
                                    <div className="mobile-list-item-subtitle">
                                        {d.description}
                                    </div>
                                </div>
                                <span className="mobile-badge mobile-badge-primary">
                                    {categories.find(c => c.name === d.category)?.label}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Bottom Navigation */}
            <MobileBottomNav />
        </div>
    );
};

export default MobileMunin;
