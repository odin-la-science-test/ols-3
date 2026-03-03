// Configuration des modules pour les étudiants (Hugin Scholar)

export interface ModuleConfig {
  id: string;
  name: string;
  description: string;
  icon: string;
  route: string;
  category: 'core' | 'scholar' | 'lab' | 'analysis';
  studentAccess: boolean; // Si true, accessible aux étudiants
  professionalAccess: boolean; // Si true, accessible aux professionnels
}

// Modules Hugin Scholar - Adaptés à la scolarité
export const STUDENT_MODULES: ModuleConfig[] = [
  // Modules de base (accessibles à tous)
  {
    id: 'lab-notebook',
    name: 'Cahier de Labo',
    description: 'Carnet de laboratoire numérique pour vos expériences',
    icon: 'BookOpen',
    route: '/hugin/lab-notebook',
    category: 'core',
    studentAccess: true,
    professionalAccess: true
  },
  {
    id: 'protocol-builder',
    name: 'Protocoles',
    description: 'Créer et gérer vos protocoles expérimentaux',
    icon: 'FileText',
    route: '/hugin/protocol-builder',
    category: 'core',
    studentAccess: true,
    professionalAccess: true
  },
  
  // Modules Scholar - Spécifiques étudiants (nouveaux modules avancés)
  {
    id: 'resistance-phenotypes',
    name: 'Phénotypes de Résistance',
    description: 'Mécanismes de résistance aux antibiotiques avec schémas explicatifs',
    icon: 'Shield',
    route: '/hugin/resistance-phenotypes',
    category: 'scholar',
    studentAccess: true,
    professionalAccess: true
  },
  {
    id: 'lab-equipment',
    name: 'Fiches Machines',
    description: 'Base de données des équipements de laboratoire avec guides d\'utilisation',
    icon: 'Microscope',
    route: '/hugin/lab-equipment',
    category: 'scholar',
    studentAccess: true,
    professionalAccess: true
  },
  {
    id: 'qcm-multi',
    name: 'QCM Multi-Disciplines',
    description: '2000+ questions pour tester vos connaissances scientifiques',
    icon: 'Brain',
    route: '/hugin/qcm-multi-disciplines',
    category: 'scholar',
    studentAccess: true,
    professionalAccess: true
  },
  {
    id: 'lms',
    name: 'Plateforme d\'Apprentissage',
    description: 'Système de gestion de l\'apprentissage (LMS type Moodle)',
    icon: 'BookOpen',
    route: '/hugin/learning-management',
    category: 'scholar',
    studentAccess: true,
    professionalAccess: true
  },
  {
    id: 'cloud-storage',
    name: 'Stockage Cloud',
    description: 'Stockage et partage de fichiers sécurisé (type Nextcloud amélioré)',
    icon: 'Cloud',
    route: '/hugin/cloud-storage',
    category: 'scholar',
    studentAccess: true,
    professionalAccess: true
  },
  
  // Modules Scholar - Anciens modules
  {
    id: 'homework-tracker',
    name: 'Devoirs & TP',
    description: 'Suivi de vos devoirs et travaux pratiques',
    icon: 'ClipboardList',
    route: '/hugin/homework-tracker',
    category: 'scholar',
    studentAccess: true,
    professionalAccess: false
  },
  {
    id: 'exam-prep',
    name: 'Préparation Examens',
    description: 'Fiches de révision et planning de révisions',
    icon: 'GraduationCap',
    route: '/hugin/exam-prep',
    category: 'scholar',
    studentAccess: true,
    professionalAccess: false
  },
  {
    id: 'course-notes',
    name: 'Notes de Cours',
    description: 'Organisez vos notes de cours par matière',
    icon: 'BookMarked',
    route: '/hugin/course-notes',
    category: 'scholar',
    studentAccess: true,
    professionalAccess: false
  },
  {
    id: 'lab-reports',
    name: 'Comptes-Rendus',
    description: 'Rédaction de comptes-rendus de TP',
    icon: 'FileEdit',
    route: '/hugin/lab-reports',
    category: 'scholar',
    studentAccess: true,
    professionalAccess: false
  },
  
  // Outils de calcul (accessibles à tous)
  {
    id: 'buffer-calc',
    name: 'Calculateur Tampons',
    description: 'Calculs de solutions tampons',
    icon: 'Calculator',
    route: '/hugin/buffer-calc',
    category: 'lab',
    studentAccess: true,
    professionalAccess: true
  },
  {
    id: 'protein-calculator',
    name: 'Calculateur Protéines',
    description: 'Calculs sur les protéines',
    icon: 'Dna',
    route: '/hugin/protein-calculator',
    category: 'lab',
    studentAccess: true,
    professionalAccess: true
  },
  {
    id: 'pcr-designer',
    name: 'PCR Designer',
    description: 'Conception d\'amorces PCR',
    icon: 'Dna',
    route: '/hugin/pcr-designer',
    category: 'lab',
    studentAccess: true,
    professionalAccess: true
  },
  {
    id: 'gel-simulator',
    name: 'Simulateur de Gel',
    description: 'Simulation de migration sur gel',
    icon: 'Layers',
    route: '/hugin/gel-simulator',
    category: 'lab',
    studentAccess: true,
    professionalAccess: true
  },
  
  // Modules avancés (professionnels uniquement)
  {
    id: 'chemical-inventory',
    name: 'Inventaire Chimique',
    description: 'Gestion des produits chimiques',
    icon: 'Package',
    route: '/hugin/chemical-inventory',
    category: 'lab',
    studentAccess: false,
    professionalAccess: true
  },
  {
    id: 'equipment-booking',
    name: 'Réservation Équipements',
    description: 'Réserver les équipements du laboratoire',
    icon: 'Calendar',
    route: '/hugin/equipment-booking',
    category: 'lab',
    studentAccess: false,
    professionalAccess: true
  },
  {
    id: 'grant-budget',
    name: 'Budget & Subventions',
    description: 'Gestion des budgets de recherche',
    icon: 'DollarSign',
    route: '/hugin/grant-budget',
    category: 'analysis',
    studentAccess: false,
    professionalAccess: true
  },
  {
    id: 'statistics-lab',
    name: 'Statistiques',
    description: 'Analyses statistiques avancées',
    icon: 'BarChart',
    route: '/hugin/statistics-lab',
    category: 'analysis',
    studentAccess: true,
    professionalAccess: true
  }
];

// Obtenir les modules accessibles selon le type d'utilisateur
export const getAccessibleModules = (isStudent: boolean): ModuleConfig[] => {
  return STUDENT_MODULES.filter(module => 
    isStudent ? module.studentAccess : module.professionalAccess
  );
};

// Obtenir les modules par catégorie
export const getModulesByCategory = (isStudent: boolean, category: string): ModuleConfig[] => {
  return getAccessibleModules(isStudent).filter(module => module.category === category);
};

// Vérifier si un utilisateur a accès à un module
export const hasModuleAccess = (moduleId: string, isStudent: boolean): boolean => {
  const module = STUDENT_MODULES.find(m => m.id === moduleId);
  if (!module) return false;
  return isStudent ? module.studentAccess : module.professionalAccess;
};

// Obtenir le nom de la plateforme selon le type d'utilisateur
export const getHuginPlatformName = (isStudent: boolean): string => {
  return isStudent ? 'Hugin Scholar' : 'Hugin Lab';
};

// Obtenir la description de la plateforme
export const getHuginPlatformDescription = (isStudent: boolean): string => {
  return isStudent 
    ? 'Votre assistant pour réussir vos études scientifiques'
    : 'Votre laboratoire numérique professionnel';
};

// Gestion du mode de vue pour les super admins
const STUDENT_VIEW_KEY = 'superadmin_student_view';

export const toggleStudentView = (): boolean => {
  const currentView = localStorage.getItem(STUDENT_VIEW_KEY) === 'true';
  const newView = !currentView;
  localStorage.setItem(STUDENT_VIEW_KEY, String(newView));
  return newView;
};

export const isStudentViewActive = (): boolean => {
  return localStorage.getItem(STUDENT_VIEW_KEY) === 'true';
};

export const resetStudentView = (): void => {
  localStorage.removeItem(STUDENT_VIEW_KEY);
};

// Déterminer si on doit afficher la vue étudiante
export const shouldShowStudentView = (userEmail: string | null, isUserStudent: boolean): boolean => {
  // Vérifier si l'utilisateur est super admin
  const superAdmins = ['ethan@ols.com', 'bastien@ols.com', 'issam@ols.com'];
  const isSuperAdmin = userEmail && superAdmins.includes(userEmail.toLowerCase().trim());
  
  // Si super admin, vérifier le mode de vue
  if (isSuperAdmin) {
    return isStudentViewActive();
  }
  
  // Sinon, utiliser le statut étudiant réel
  return isUserStudent;
};
