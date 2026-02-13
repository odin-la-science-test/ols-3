import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, BookOpen, Grid, Activity, Dna, FlaskConical, Calculator, Users, Settings } from 'lucide-react';
import disciplinesArray from '../../data/disciplines.json';

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
        d.label.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (activeCategory === 'All' || d.category === activeCategory)
    );

    return (
        <div className="app-viewport">
            <div style={{
                padding: '1rem 1.5rem',
                borderBottom: '1px solid var(--border-color)',
                background: 'var(--bg-secondary)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <button onClick={() => navigate('/home')} style={{ background: 'none', border: 'none', color: 'var(--text-primary)', padding: '0.5rem' }}>
                        <ArrowLeft size={24} />
                    </button>
                    <img 
                        src="/logo2.png" 
                        alt="Munin" 
                        style={{ width: '40px', height: '40px', objectFit: 'contain' }} 
                    />
                    <h1 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: 'var(--accent-munin)' }}>
                        Munin Atlas
                    </h1>
                </div>

                <div style={{ position: 'relative', marginBottom: '1rem' }}>
                    <Search
                        size={18}
                        style={{ 
                            position: 'absolute', 
                            left: '1rem', 
                            top: '50%', 
                            transform: 'translateY(-50%)', 
                            color: 'var(--accent-munin)' 
                        }}
                    />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Rechercher une discipline..."
                        style={{
                            width: '100%',
                            paddingLeft: '3rem',
                            padding: '0.75rem',
                            background: 'var(--bg-primary)',
                            border: '1px solid var(--border-color)',
                            borderRadius: '0.75rem',
                            color: 'var(--text-primary)',
                            fontSize: '0.9rem'
                        }}
                    />
                </div>

                <button
                    onClick={() => setShowFilters(!showFilters)}
                    style={{
                        width: '100%',
                        padding: '0.75rem',
                        background: 'var(--bg-primary)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '0.75rem',
                        color: 'var(--text-primary)',
                        fontSize: '0.9rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer'
                    }}
                >
                    <span>Catégories</span>
                    <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', background: 'var(--accent-munin)', borderRadius: '0.5rem' }}>
                        {activeCategory === 'All' ? 'Toutes' : categories.find(c => c.name === activeCategory)?.label}
                    </span>
                </button>

                {showFilters && (
                    <div style={{ 
                        marginTop: '1rem', 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(2, 1fr)', 
                        gap: '0.75rem' 
                    }}>
                        {categories.map(cat => (
                            <button
                                key={cat.name}
                                onClick={() => {
                                    setActiveCategory(cat.name);
                                    setShowFilters(false);
                                }}
                                style={{
                                    padding: '0.75rem',
                                    borderRadius: '0.75rem',
                                    border: activeCategory === cat.name ? `2px solid ${cat.color}` : '1px solid var(--border-color)',
                                    background: activeCategory === cat.name ? `${cat.color}15` : 'var(--bg-primary)',
                                    color: activeCategory === cat.name ? cat.color : 'var(--text-primary)',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    fontSize: '0.85rem',
                                    fontWeight: activeCategory === cat.name ? 600 : 400,
                                    minHeight: '70px'
                                }}
                            >
                                {cat.icon}
                                <span style={{ textAlign: 'center', lineHeight: 1.2 }}>{cat.label}</span>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <div className="app-scrollbox" style={{ padding: '1.5rem' }}>
                {categorizedDisciplines.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-secondary)' }}>
                        <Search size={60} style={{ opacity: 0.3, marginBottom: '1rem' }} />
                        <p>Aucune discipline trouvée</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {categorizedDisciplines.map((d) => (
                            <div
                                key={d.id}
                                className="card-native"
                                style={{ 
                                    padding: '1.25rem',
                                    cursor: 'pointer'
                                }}
                                onClick={() => navigate(`/munin/${d.id}`)}
                            >
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                                    <div style={{ 
                                        padding: '0.75rem', 
                                        background: 'rgba(16, 185, 129, 0.1)', 
                                        borderRadius: '0.75rem', 
                                        color: 'var(--accent-munin)',
                                        flexShrink: 0
                                    }}>
                                        <BookOpen size={20} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                                            {d.label}
                                        </h3>
                                        <p style={{ 
                                            color: 'var(--text-secondary)', 
                                            fontSize: '0.85rem', 
                                            lineHeight: 1.5,
                                            marginBottom: '0.5rem'
                                        }}>
                                            Accédez aux protocoles et recherches concernant la {d.label.toLowerCase()}.
                                        </p>
                                        <div style={{ 
                                            display: 'inline-block',
                                            padding: '0.25rem 0.75rem',
                                            background: `${categories.find(c => c.name === d.category)?.color}15`,
                                            color: categories.find(c => c.name === d.category)?.color,
                                            borderRadius: '0.5rem',
                                            fontSize: '0.75rem',
                                            fontWeight: 600
                                        }}>
                                            {categories.find(c => c.name === d.category)?.label}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div style={{ 
                    marginTop: '2rem', 
                    padding: '1rem', 
                    background: 'rgba(16, 185, 129, 0.05)', 
                    borderRadius: '0.75rem',
                    textAlign: 'center',
                    fontSize: '0.85rem',
                    color: 'var(--text-secondary)'
                }}>
                    {categorizedDisciplines.length} discipline{categorizedDisciplines.length > 1 ? 's' : ''} disponible{categorizedDisciplines.length > 1 ? 's' : ''}
                </div>
            </div>
        </div>
    );
};

export default MobileMunin;
