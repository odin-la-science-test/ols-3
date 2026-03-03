// Calculs financiers pour le panneau d'administration

interface User {
  email: string;
  subscription: {
    type: string;
    cycle: string; // 'monthly' ou 'annual'
    price: number; // Prix payé (mensuel ou annuel selon cycle)
    seats?: number; // Nombre de sièges/licences achetés (pour entreprises)
  };
  accountCategory: 'personal' | 'enterprise';
  isStudent: boolean;
}

interface FinancialMetrics {
  totalRevenue: number;           // Revenu mensuel équivalent
  totalRevenueCollected: number;  // Argent réellement collecté (avec annuels)
  totalCosts: number;
  grossProfit: number;
  grossMargin: number;
  costBreakdown: {
    salaries: number;
    infrastructure: number;
    marketing: number;
    support: number;
    maintenance: number;
    total: number;
  };
  revenueByCategory: {
    personal: number;
    enterprise: number;
    student: number;
  };
  revenueByType: {
    monthly: number;
    annual: number;
    annualEquivalent: number; // Montant annuel converti en mensuel
  };
  seatsInfo: {
    totalPaidSeats: number;      // Nombre total de licences payées
    totalActiveUsers: number;     // Nombre d'utilisateurs réels
    utilizationRate: number;      // Taux d'utilisation des licences
  };
  averageRevenuePerUser: number;
  averageRevenuePerSeat: number;  // Revenu par licence payée
  costPerSeat: number;            // Coût par licence payée
  profitPerSeat: number;          // Profit par licence payée
  costPerUser: number;
  profitPerUser: number;
}

// Coûts fixes mensuels (en €)
// Basé sur les coûts d'entreprise réels (OpEx annuel: 510k-860k€)
const FIXED_COSTS = {
  // Salaires (3 dev + 1 product + 1 support)
  // Annuel: 300k-400k€ → Mensuel: ~29,167€
  salaries: {
    developers: 18750,      // 3 développeurs (225k/an)
    product: 6250,          // 1 product manager (75k/an)
    support: 4167,          // 1 support (50k/an)
    total: 29167
  },
  
  // Infrastructure cloud & IA
  // Annuel: 50k-150k€ → Mensuel: ~8,333€
  infrastructure: {
    cloudServers: 4167,     // Serveurs cloud
    aiServices: 2500,       // Services IA (API, compute)
    database: 1000,         // Base de données
    cdn: 666,               // CDN pour assets
    total: 8333
  },
  
  // Marketing & Ads
  // Annuel: 80k-150k€ → Mensuel: ~9,583€
  marketing: {
    advertising: 6250,      // Publicité en ligne
    content: 2083,          // Création de contenu
    seo: 1250,              // SEO et référencement
    total: 9583
  },
  
  // Support & Customer Success
  // Annuel: 50k-100k€ → Mensuel: ~6,250€
  support: {
    customerService: 4167,  // Support client
    tools: 2083,            // Outils de support (CRM, tickets)
    total: 6250
  },
  
  // Maintenance & licences
  // Annuel: 30k-60k€ → Mensuel: ~3,750€
  maintenance: {
    licenses: 2083,         // Licences logicielles
    tools: 1667,            // Outils de dev (IDE, CI/CD)
    total: 3750
  }
};

// Coûts variables par siège (en €/mois)
// Ces coûts augmentent avec le nombre d'utilisateurs
const VARIABLE_COSTS_PER_USER = {
  storage: 15,            // Stockage de données par utilisateur
  bandwidth: 10,          // Bande passante
  compute: 8,             // Calcul/processing
  email: 5,               // Emails transactionnels
  total: 38
};

export const calculateFinancialMetrics = (users: User[]): FinancialMetrics => {
  // Calcul du revenu mensuel équivalent et du revenu collecté
  let totalRevenueMonthly = 0;
  let totalRevenueCollected = 0;
  let monthlySubscriptions = 0;
  let annualSubscriptions = 0;
  let annualEquivalentRevenue = 0;
  let totalPaidSeats = 0; // Nombre total de licences payées

  users.forEach(user => {
    const price = user.subscription?.price || 0;
    const cycle = user.subscription?.cycle || 'monthly';
    const seats = user.subscription?.seats || 1; // Par défaut 1 siège

    // Compter le nombre de sièges payés
    totalPaidSeats += seats;

    if (cycle === 'annual') {
      // Pour les abonnements annuels :
      // - On garde le montant total collecté
      // - On convertit en mensuel pour les calculs (prix / 12)
      totalRevenueCollected += price;
      const monthlyEquivalent = price / 12;
      totalRevenueMonthly += monthlyEquivalent;
      annualSubscriptions += price;
      annualEquivalentRevenue += monthlyEquivalent;
    } else {
      // Pour les abonnements mensuels
      totalRevenueMonthly += price;
      totalRevenueCollected += price;
      monthlySubscriptions += price;
    }
  });

  // Calcul du revenu par catégorie (en mensuel équivalent)
  const revenueByCategory = {
    personal: users
      .filter(u => u.accountCategory === 'personal' && !u.isStudent)
      .reduce((sum, u) => {
        const price = u.subscription?.price || 0;
        const cycle = u.subscription?.cycle || 'monthly';
        return sum + (cycle === 'annual' ? price / 12 : price);
      }, 0),
    enterprise: users
      .filter(u => u.accountCategory === 'enterprise')
      .reduce((sum, u) => {
        const price = u.subscription?.price || 0;
        const cycle = u.subscription?.cycle || 'monthly';
        return sum + (cycle === 'annual' ? price / 12 : price);
      }, 0),
    student: users
      .filter(u => u.isStudent)
      .reduce((sum, u) => {
        const price = u.subscription?.price || 0;
        const cycle = u.subscription?.cycle || 'monthly';
        return sum + (cycle === 'annual' ? price / 12 : price);
      }, 0)
  };

  // Calcul du multiplicateur de coûts basé sur le nombre d'utilisateurs
  // Les coûts de marketing, support et maintenance doublent tous les 300 utilisateurs
  const userCount = users.length;
  const costMultiplier = Math.pow(2, Math.floor(userCount / 300));

  // Calcul des coûts fixes avec multiplicateur pour certaines catégories
  const salariesCost = FIXED_COSTS.salaries.total; // Salaires ne changent pas automatiquement
  const infrastructureCost = FIXED_COSTS.infrastructure.total; // Infrastructure ne change pas automatiquement
  const marketingCost = FIXED_COSTS.marketing.total * costMultiplier; // Double tous les 300 users
  const supportCost = FIXED_COSTS.support.total * costMultiplier; // Double tous les 300 users
  const maintenanceCost = FIXED_COSTS.maintenance.total * costMultiplier; // Double tous les 300 users

  const fixedCostsTotal = 
    salariesCost +
    infrastructureCost +
    marketingCost +
    supportCost +
    maintenanceCost;

  // Calcul des coûts variables (basé sur le nombre de LICENCES PAYÉES, pas les utilisateurs)
  const variableCostsTotal = totalPaidSeats * VARIABLE_COSTS_PER_USER.total;

  // Coûts totaux
  const totalCosts = fixedCostsTotal + variableCostsTotal;

  // Bénéfice brut (basé sur revenu mensuel équivalent)
  const grossProfit = totalRevenueMonthly - totalCosts;

  // Marge brute (en %)
  const grossMargin = totalRevenueMonthly > 0 ? (grossProfit / totalRevenueMonthly) * 100 : 0;

  // Taux d'utilisation des licences
  const utilizationRate = totalPaidSeats > 0 ? (users.length / totalPaidSeats) * 100 : 0;

  // Moyennes par utilisateur
  const averageRevenuePerUser = users.length > 0 ? totalRevenueMonthly / users.length : 0;
  const costPerUser = users.length > 0 ? totalCosts / users.length : 0;
  const profitPerUser = users.length > 0 ? grossProfit / users.length : 0;

  // Moyennes par siège payé
  const averageRevenuePerSeat = totalPaidSeats > 0 ? totalRevenueMonthly / totalPaidSeats : 0;
  const costPerSeat = totalPaidSeats > 0 ? totalCosts / totalPaidSeats : 0;
  const profitPerSeat = totalPaidSeats > 0 ? grossProfit / totalPaidSeats : 0;

  return {
    totalRevenue: totalRevenueMonthly,
    totalRevenueCollected,
    totalCosts,
    grossProfit,
    grossMargin,
    costBreakdown: {
      salaries: salariesCost,
      infrastructure: infrastructureCost,
      marketing: marketingCost,
      support: supportCost,
      maintenance: maintenanceCost,
      total: fixedCostsTotal
    },
    revenueByCategory,
    revenueByType: {
      monthly: monthlySubscriptions,
      annual: annualSubscriptions,
      annualEquivalent: annualEquivalentRevenue
    },
    seatsInfo: {
      totalPaidSeats,
      totalActiveUsers: users.length,
      utilizationRate
    },
    averageRevenuePerUser,
    averageRevenuePerSeat,
    costPerSeat,
    profitPerSeat,
    costPerUser,
    profitPerUser
  };
};

// Calculer les projections annuelles
export const calculateAnnualProjections = (monthlyMetrics: FinancialMetrics) => {
  const totalFixedCosts = 
    FIXED_COSTS.salaries.total +
    FIXED_COSTS.infrastructure.total +
    FIXED_COSTS.marketing.total +
    FIXED_COSTS.support.total +
    FIXED_COSTS.maintenance.total;

  return {
    annualRevenue: monthlyMetrics.totalRevenue * 12,
    annualCosts: monthlyMetrics.totalCosts * 12,
    annualProfit: monthlyMetrics.grossProfit * 12,
    breakEvenUsers: Math.ceil(
      totalFixedCosts / 
      (monthlyMetrics.averageRevenuePerUser - VARIABLE_COSTS_PER_USER.total)
    )
  };
};

// Formater les montants en euros
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

// Formater les pourcentages
export const formatPercentage = (value: number): string => {
  return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
};

// Vérifier si l'utilisateur est un super admin autorisé
export const isSuperAdminFinance = (email: string | null): boolean => {
  if (!email) return false;
  const normalizedEmail = email.toLowerCase().trim();
  const superAdmins = [
    'ethan@ols.com',
    'bastien@ols.com',
    'issam@ols.com'
  ];
  return superAdmins.includes(normalizedEmail);
};
