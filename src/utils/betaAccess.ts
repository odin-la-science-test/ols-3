// Liste des super admins autorisés à accéder aux fonctionnalités beta
const SUPER_ADMIN_EMAILS = [
  'bastien@ols.com',
  'issam@ols.com',
  'ethan@ols.com'
];

export const isSuperAdmin = (email: string): boolean => {
  return SUPER_ADMIN_EMAILS.includes(email.toLowerCase());
};

export const checkBetaAccess = (): boolean => {
  const currentUser = localStorage.getItem('currentUser');
  if (!currentUser) return false;
  
  try {
    // Vérifier si currentUser est déjà un email
    if (currentUser.includes('@')) {
      return isSuperAdmin(currentUser);
    }
    
    // Sinon, essayer de parser comme objet
    const user = JSON.parse(currentUser);
    const email = user.email || user.username || currentUser;
    return isSuperAdmin(email);
  } catch {
    // Si le parse échoue, vérifier directement la string
    return isSuperAdmin(currentUser);
  }
};

export const getBetaFeatures = () => {
  return [
    {
      id: 'lab-notebook',
      name: 'Cahier de Laboratoire Digital',
      description: 'Cahier de labo avec signatures numériques, versioning, tags, et export avancé',
      path: '/beta/lab-notebook',
      status: 'stable',
      category: 'Documentation',
      features: ['Signatures numériques', 'Versioning', 'Tags', 'Export TXT/JSON', 'Recherche avancée', 'Statistiques']
    },
    {
      id: 'protocol-builder',
      name: 'Protocol Builder',
      description: 'Créateur de protocoles expérimentaux avec templates et étapes détaillées',
      path: '/beta/protocol-builder',
      status: 'stable',
      category: 'Protocoles',
      features: ['Templates PCR', 'Étapes personnalisables', 'Durée et température', 'Matériel requis', 'Notes de sécurité']
    },
    {
      id: 'chemical-inventory',
      name: 'Inventaire Chimique',
      description: 'Gestion des produits chimiques avec alertes d\'expiration et dangers',
      path: '/beta/chemical-inventory',
      status: 'stable',
      category: 'Inventaire',
      features: ['Alertes expiration', 'Numéros CAS', 'Pictogrammes danger', 'Localisation', 'Recherche avancée']
    },
    {
      id: 'backup-manager',
      name: 'Gestionnaire de Sauvegardes',
      description: 'Backup automatique et restauration des données avec historique',
      path: '/beta/backup-manager',
      status: 'stable',
      category: 'Système',
      features: ['Backup auto', 'Restauration', 'Export/Import', 'Historique', 'Taille optimisée']
    },
    {
      id: 'gel-simulator',
      name: 'Simulateur de Gel d\'Électrophorèse',
      description: 'Simulation réaliste de migration sur gel avec marqueurs et export d\'image',
      path: '/beta/gel-simulator',
      status: 'stable',
      category: 'Outils Bio',
      features: ['Marqueurs de taille', 'Paramètres avancés', 'Export PNG', 'Calculs précis', 'Visualisation 3D']
    },
    {
      id: 'equipment-booking',
      name: 'Réservation d\'Équipements',
      description: 'Système de réservation d\'équipements partagés avec calendrier',
      path: '/beta/equipment-booking',
      status: 'development',
      category: 'Gestion',
      features: ['Calendrier interactif', 'Conflits détectés', 'Notifications', 'Historique', 'Statistiques d\'usage']
    },
    {
      id: 'experiment-planner',
      name: 'Planificateur d\'Expériences',
      description: 'Timeline visuelle pour expériences complexes multi-étapes',
      path: '/beta/experiment-planner',
      status: 'development',
      category: 'Planning',
      features: ['Timeline Gantt', 'Dépendances', 'Ressources', 'Milestones', 'Export PDF']
    },
    {
      id: 'citation-manager',
      name: 'Gestionnaire de Citations',
      description: 'Import et gestion de références bibliographiques (PubMed, DOI)',
      path: '/beta/citation-manager',
      status: 'development',
      category: 'Recherche',
      features: ['Import PubMed', 'DOI lookup', 'Formats multiples', 'Bibliographie auto', 'Dossiers']
    },
    {
      id: 'data-viz-studio',
      name: 'Studio de Visualisation',
      description: 'Création de graphiques scientifiques avancés publication-ready',
      path: '/beta/data-viz-studio',
      status: 'development',
      category: 'Analyse',
      features: ['Graphiques avancés', 'Export haute résolution', 'Templates', 'Statistiques', 'Annotations']
    },
    {
      id: 'sample-tracker',
      name: 'Suivi d\'Échantillons',
      description: 'Tracking avec QR codes et localisation en temps réel',
      path: '/beta/sample-tracker',
      status: 'planning',
      category: 'Inventaire',
      features: ['QR codes', 'Localisation', 'Historique', 'Généalogie', 'Alertes']
    },
    {
      id: 'lab-safety',
      name: 'Sécurité du Laboratoire',
      description: 'Checklists et procédures de sécurité avec audit trail',
      path: '/beta/lab-safety',
      status: 'planning',
      category: 'Sécurité',
      features: ['Checklists', 'Procédures urgence', 'Formation', 'Audit', 'Rapports incidents']
    }
  ];
};

export const getBetaStats = () => {
  const features = getBetaFeatures();
  return {
    total: features.length,
    stable: features.filter(f => f.status === 'stable').length,
    development: features.filter(f => f.status === 'development').length,
    planning: features.filter(f => f.status === 'planning').length
  };
};
