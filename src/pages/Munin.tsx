import { useState } from 'react';
import {
    BookOpen, Search, Activity, Dna, FlaskConical,
    Calculator, Users, Settings, Grid, Sparkles, TrendingUp, Star
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../components/LanguageContext';
import { useDeviceDetection } from '../hooks/useDeviceDetection';
import Navbar from '../components/Navbar';
import disciplinesData from '../data/disciplines.json';

const Munin = () => {
    const navigate = useNavigate();
    const { language, t } = useLanguage();
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const [viewMode, setViewMode] = useState<'categories' | 'list'>('categories');
    const { isMobile } = useDeviceDetection();

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
        { name: 'All', icon: <Grid size={20} />, color: '#64748b', desc: 'Toutes les disciplines' },
        { name: 'Medical Sciences', icon: <Activity size={20} />, color: '#ef4444', desc: 'Médecine et santé' },
        { name: 'Life Sciences', icon: <Dna size={20} />, color: '#10b981', desc: 'Biologie et vie' },
        { name: 'Physical & Earth', icon: <FlaskConical size={20} />, color: '#3b82f6', desc: 'Physique et terre' },
        { name: 'Formal Sciences', icon: <Calculator size={20} />, color: '#8b5cf6', desc: 'Maths et info' },
        { name: 'Social Sciences', icon: <Users size={20} />, color: '#f59e0b', desc: 'Sciences sociales' },
        { name: 'Engineering & Tech', icon: <Settings size={20} />, color: '#06b6d4', desc: 'Ingénierie et tech' }
    ];

    const getDisciplineDesc = (discipline: string) => {
        const d = discipline.toLowerCase();
        if (language === 'FR') return `Accédez aux protocoles, fiches techniques et recherches concernant la ${d}.`;
        if (language === 'ES') return `Acceda a protocolos, fichas técnicas e investigaciones sobre ${d}.`;
        if (language === 'DE') return `Greifen Sie auf Protokolle, Datenblätter und Forschungsergebnisse zu ${d} zu.`;
        if (language === 'HU') return `Hozzá nem férhet a protokollokhoz, adatlapokhoz és kutatásokhoz a ${d} területén.`;
        if (language === 'ZH') return `访问有关${d}的协议、数据表和研究。`;
        return `Access protocols, data sheets, and research regarding ${d}.`;
    };

    const categorizedDisciplines = disciplinesData.map(d => ({
        ...d,
        category: getCategory(d.id)
    })).filter(d =>
        d.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (activeCategory === 'All' || d.category === activeCategory)
    );

    const activeCategories = activeCategory === 'All'
        ? categories.filter(c => c.name !== 'All')
        : categories.filter(c => c.name === activeCategory);

    return (
        <div style={{ 
            minHeight: '100vh', 
            position: 'relative', 
            paddingBottom: '4rem'
        }}>
            <Navbar />

            <div className="container" style={{ paddingTop: '2rem' }}>

                <header style={{ 
                    marginBottom: '3rem', 
                    textAlign: 'center', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center'
                }}>
                    <img 
                        src="/logo2.png" 
                        alt="Munin Atlas Logo" 
                        style={{ 
                            width: '240px', 
                            height: '240px', 
                            objectFit: 'contain', 
                            marginBottom: '1.5rem', 
                            filter: 'drop-shadow(0 0 2px #fff) drop-shadow(0 0 5px rgba(16, 185, 129, 0.3))'
                        }} 
                    />
                    
                    <h1 className="text-gradient" style={{ 
                        fontSize: '3rem', 
                        marginBottom: '1rem' 
                    }}>
                        {t('munin.title')}
                    </h1>
                    
                    <p style={{ 
                        color: 'var(--text-secondary)', 
                        fontSize: '1.2rem', 
                        marginBottom: '2rem'
                    }}>
                        {language === 'FR' ? '250+ domaines scientifiques disponibles' :
                            '250+ scientific domains available'}
                    </p>

                    <div style={{ position: 'relative', width: '100%', maxWidth: '600px', margin: '0 auto 2rem auto' }}>
                        <Search
                            size={20}
                            style={{ 
                                position: 'absolute', 
                                left: '1.25rem', 
                                top: '50%', 
                                transform: 'translateY(-50%)', 
                                color: 'var(--accent-munin)' 
                            }}
                        />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder={language === 'FR' ? 'Rechercher une discipline...' : 'Search for a discipline...'}
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

                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                        {categories.map(cat => (
                            <button
                                key={cat.name}
                                onClick={() => setActiveCategory(cat.name)}
                                style={{
                                    padding: '0.6rem 1.25rem',
                                    borderRadius: '1rem',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    background: activeCategory === cat.name ? 'var(--accent-munin)' : 'rgba(255, 255, 255, 0.05)',
                                    color: activeCategory === cat.name ? 'white' : 'var(--text-secondary)',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    fontWeight: activeCategory === cat.name ? 600 : 400,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem'
                                }}
                            >
                                {cat.icon}
                                {cat.name === 'All' ? (language === 'FR' ? 'Tout' : 'All') : cat.name}
                            </button>
                        ))}
                    </div>
                </header>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                    {activeCategories.map(cat => {
                        const catDisciplines = categorizedDisciplines.filter(d => d.category === cat.name);
                        if (catDisciplines.length === 0) return null;

                        return (
                            <div key={cat.name}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                                    <div style={{ height: '1px', flex: 1, background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.1))' }}></div>
                                    <h2 style={{ 
                                        fontSize: '1.25rem', 
                                        textTransform: 'uppercase', 
                                        letterSpacing: '0.1em', 
                                        color: 'var(--accent-munin)', 
                                        fontWeight: 700 
                                    }}>
                                        {cat.name}
                                    </h2>
                                    <div style={{ height: '1px', flex: 1, background: 'linear-gradient(to left, transparent, rgba(255,255,255,0.1))' }}></div>
                                </div>
                                <div style={{ 
                                    display: 'grid', 
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
                                    gap: '2rem' 
                                }}>
                                    {catDisciplines.map((d) => (
                                        <div
                                            key={d.id}
                                            className="card glass-panel"
                                            style={{ 
                                                cursor: 'pointer', 
                                                padding: '1.5rem'
                                            }}
                                            onClick={() => navigate(`/munin/${d.id}`)}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                                                <div style={{ 
                                                    padding: '0.75rem', 
                                                    background: 'rgba(16, 185, 129, 0.1)', 
                                                    borderRadius: '0.5rem', 
                                                    color: 'var(--accent-munin)' 
                                                }}>
                                                    <BookOpen size={20} />
                                                </div>
                                                <h3 style={{ fontSize: '1.25rem' }}>{d.name}</h3>
                                            </div>
                                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5' }}>
                                                {getDisciplineDesc(d.name)}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {categorizedDisciplines.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '5rem', opacity: 0.5 }}>
                        <Search size={48} style={{ marginBottom: '1rem' }} />
                        <p style={{ fontSize: '1.2rem' }}>
                            {language === 'FR' ? `Aucune discipline trouvée pour "${searchQuery}"` : `No disciplines found for "${searchQuery}"`}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Munin;
