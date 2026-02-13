import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Mail, Calendar, FileText, FlaskConical, Database, BookOpen,
  Package, Snowflake, Activity, Wallet, ShieldAlert, Video, Layers,
  Brain, Quote, Book, HardDrive, Grid, Dna, Camera, TrendingUp,
  Calculator, Zap, Share2, Box, UserCheck, Beaker
} from 'lucide-react';
import MobileBottomNav from '../../components/MobileBottomNav';
import '../../styles/mobile-app.css';

const MobileHugin = () => {
  const navigate = useNavigate();

  const modules = [
    // Core
    {
      icon: Mail,
      title: 'Messagerie',
      description: 'Messages et communications',
      path: '/hugin/messaging',
      color: 'var(--mobile-primary)',
      category: 'Core'
    },
    {
      icon: Calendar,
      title: 'Planning',
      description: 'Gestion du temps',
      path: '/hugin/planning',
      color: 'var(--mobile-primary)',
      category: 'Core'
    },
    {
      icon: FileText,
      title: 'Documents',
      description: 'Fichiers et archives',
      path: '/hugin/documents',
      color: 'var(--mobile-primary)',
      category: 'Core'
    },
    {
      icon: Database,
      title: 'Inventaire',
      description: 'Gestion des stocks',
      path: '/hugin/inventory',
      color: 'var(--mobile-primary)',
      category: 'Core'
    },
    {
      icon: Video,
      title: 'Réunions',
      description: 'Gestion des réunions',
      path: '/hugin/meetings',
      color: 'var(--mobile-primary)',
      category: 'Core'
    },
    {
      icon: Layers,
      title: 'Projets',
      description: 'Gestion de projets',
      path: '/hugin/projects',
      color: 'var(--mobile-primary)',
      category: 'Core'
    },
    {
      icon: Grid,
      title: 'Tableur',
      description: 'Tableur de laboratoire',
      path: '/hugin/tableur',
      color: 'var(--mobile-primary)',
      category: 'Core'
    },
    {
      icon: HardDrive,
      title: 'Archives IT',
      description: 'Archives informatiques',
      path: '/hugin/it-archive',
      color: 'var(--mobile-primary)',
      category: 'Core'
    },
    // Lab Management
    {
      icon: Package,
      title: 'Stocks',
      description: 'Gestion des stocks',
      path: '/hugin/stock',
      color: 'var(--mobile-hugin)',
      category: 'Lab'
    },
    {
      icon: Snowflake,
      title: 'Cryoconservation',
      description: 'Gestion cryo',
      path: '/hugin/cryo',
      color: 'var(--mobile-hugin)',
      category: 'Lab'
    },
    {
      icon: Activity,
      title: 'Équipements',
      description: 'Gestion équipements',
      path: '/hugin/equip',
      color: 'var(--mobile-hugin)',
      category: 'Lab'
    },
    {
      icon: Wallet,
      title: 'Budget',
      description: 'Gestion budgétaire',
      path: '/hugin/budget',
      color: 'var(--mobile-hugin)',
      category: 'Lab'
    },
    {
      icon: ShieldAlert,
      title: 'Sécurité',
      description: 'Protocoles de sécurité',
      path: '/hugin/safety',
      color: 'var(--mobile-hugin)',
      category: 'Lab'
    },
    {
      icon: BookOpen,
      title: 'SOPs',
      description: 'Procédures opératoires',
      path: '/hugin/sop',
      color: 'var(--mobile-hugin)',
      category: 'Lab'
    },
    // Research
    {
      icon: FlaskConical,
      title: 'Cultures',
      description: 'Suivi des cultures',
      path: '/hugin/culture',
      color: '#10b981',
      category: 'Research'
    },
    {
      icon: Brain,
      title: 'Recherche',
      description: 'Projets scientifiques',
      path: '/hugin/research',
      color: '#10b981',
      category: 'Research'
    },
    {
      icon: Brain,
      title: 'Mimir',
      description: 'Assistant IA',
      path: '/hugin/mimir',
      color: '#10b981',
      category: 'Research'
    },
    {
      icon: Quote,
      title: 'Bibliographie',
      description: 'Références scientifiques',
      path: '/hugin/bibliography',
      color: '#10b981',
      category: 'Research'
    },
    {
      icon: Book,
      title: 'Cahier de labo',
      description: 'Notes de laboratoire',
      path: '/hugin/notebook',
      color: '#10b981',
      category: 'Research'
    },
    // Analysis
    {
      icon: Dna,
      title: 'BioAnalyzer',
      description: 'Analyses biologiques',
      path: '/hugin/bioanalyzer',
      color: '#8b5cf6',
      category: 'Analysis'
    },
    {
      icon: Camera,
      title: 'Image Analyzer',
      description: 'Analyse d\'images',
      path: '/hugin/imageanalyzer',
      color: '#8b5cf6',
      category: 'Analysis'
    },
    {
      icon: TrendingUp,
      title: 'Statistiques',
      description: 'Analyses statistiques',
      path: '/hugin/statistics',
      color: '#8b5cf6',
      category: 'Analysis'
    },
    {
      icon: Calculator,
      title: 'BioTools',
      description: 'Outils biologiques',
      path: '/hugin/biotools',
      color: '#8b5cf6',
      category: 'Analysis'
    },
    {
      icon: Dna,
      title: 'Séquences',
      description: 'Analyse de séquences',
      path: '/hugin/sequence',
      color: '#8b5cf6',
      category: 'Analysis'
    },
    {
      icon: Activity,
      title: 'Cytométrie',
      description: 'Analyse de flux',
      path: '/hugin/flow',
      color: '#8b5cf6',
      category: 'Analysis'
    },
    {
      icon: Zap,
      title: 'Spectres',
      description: 'Analyse spectrale',
      path: '/hugin/spectrum',
      color: '#8b5cf6',
      category: 'Analysis'
    },
    {
      icon: Layers,
      title: 'Gels',
      description: 'Analyse de gels',
      path: '/hugin/gel',
      color: '#8b5cf6',
      category: 'Analysis'
    },
    {
      icon: Share2,
      title: 'Phylogénie',
      description: 'Arbres phylogénétiques',
      path: '/hugin/phylo',
      color: '#8b5cf6',
      category: 'Analysis'
    },
    {
      icon: Box,
      title: 'Molécules',
      description: 'Structures moléculaires',
      path: '/hugin/molecules',
      color: '#8b5cf6',
      category: 'Analysis'
    },
    {
      icon: TrendingUp,
      title: 'Cinétique',
      description: 'Analyses cinétiques',
      path: '/hugin/kinetics',
      color: '#8b5cf6',
      category: 'Analysis'
    },
    {
      icon: Grid,
      title: 'Plaques',
      description: 'Gestion de plaques',
      path: '/hugin/plates',
      color: '#8b5cf6',
      category: 'Analysis'
    },
    {
      icon: Beaker,
      title: 'Solutions',
      description: 'Préparation solutions',
      path: '/hugin/mixer',
      color: '#8b5cf6',
      category: 'Analysis'
    },
    {
      icon: Dna,
      title: 'Primers',
      description: 'Design de primers',
      path: '/hugin/primers',
      color: '#8b5cf6',
      category: 'Analysis'
    },
    {
      icon: UserCheck,
      title: 'Cellules',
      description: 'Suivi cellulaire',
      path: '/hugin/cells',
      color: '#8b5cf6',
      category: 'Analysis'
    },
    {
      icon: Camera,
      title: 'Colonies',
      description: 'Comptage colonies',
      path: '/hugin/colony',
      color: '#8b5cf6',
      category: 'Analysis'
    }
  ];

  return (
    <div className="mobile-container">
      <div className="mobile-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <button
            onClick={() => navigate('/home')}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--mobile-text)',
              padding: '0.5rem',
              cursor: 'pointer'
            }}
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="mobile-title" style={{ marginBottom: 0 }}>Hugin</h1>
        </div>
        <p className="mobile-subtitle" style={{ marginBottom: 0 }}>
          Outils de laboratoire et analyses
        </p>
      </div>

      <div className="mobile-content">
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>
          Modules disponibles
        </h2>

        {modules.map((module) => {
          const Icon = module.icon;
          return (
            <div
              key={module.path}
              className="mobile-list-item"
              onClick={() => navigate(module.path)}
            >
              <div className="mobile-icon mobile-icon-hugin">
                <Icon size={24} />
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                  {module.title}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--mobile-text-secondary)' }}>
                  {module.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <MobileBottomNav />
    </div>
  );
};

export default MobileHugin;
