// Système de gestion des licences pour les comptes entreprise

export interface License {
  id: string;
  ownerEmail: string;           // Email du client qui a acheté
  totalSeats: number;            // Nombre de sièges achetés
  usedSeats: number;             // Nombre de sièges utilisés
  availableSeats: number;        // Sièges disponibles
  assignedUsers: string[];       // Emails des utilisateurs assignés
  subscriptionType: string;      // Type d'abonnement
  subscriptionCycle: string;     // monthly ou annual
  pricePerSeat: number;          // Prix par siège
  totalPrice: number;            // Prix total payé
  createdAt: string;
  expiresAt: string;
}

export interface UserLicenseInfo {
  hasLicense: boolean;
  licenseId?: string;
  ownerEmail?: string;
  isOwner: boolean;
  seatNumber?: number;
}

const STORAGE_KEY = 'ols_licenses';

// Créer une nouvelle licence
export const createLicense = (
  ownerEmail: string,
  totalSeats: number,
  subscriptionType: string,
  subscriptionCycle: string,
  pricePerSeat: number
): License => {
  const license: License = {
    id: `license_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    ownerEmail: ownerEmail.toLowerCase(),
    totalSeats,
    usedSeats: 1, // Le propriétaire compte comme 1 siège
    availableSeats: totalSeats - 1,
    assignedUsers: [ownerEmail.toLowerCase()],
    subscriptionType,
    subscriptionCycle,
    pricePerSeat,
    totalPrice: pricePerSeat * totalSeats,
    createdAt: new Date().toISOString(),
    expiresAt: subscriptionCycle === 'annual' 
      ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
      : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
  };

  saveLicense(license);
  return license;
};

// Sauvegarder une licence
const saveLicense = (license: License) => {
  const licenses = getAllLicenses();
  const index = licenses.findIndex(l => l.id === license.id);
  
  if (index >= 0) {
    licenses[index] = license;
  } else {
    licenses.push(license);
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(licenses));
};

// Obtenir toutes les licences
export const getAllLicenses = (): License[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error('Erreur chargement licences:', e);
    return [];
  }
};

// Obtenir la licence d'un propriétaire
export const getLicenseByOwner = (ownerEmail: string): License | null => {
  const licenses = getAllLicenses();
  return licenses.find(l => l.ownerEmail === ownerEmail.toLowerCase()) || null;
};

// Obtenir la licence d'un utilisateur (propriétaire ou assigné)
export const getUserLicense = (userEmail: string): UserLicenseInfo => {
  const licenses = getAllLicenses();
  const email = userEmail.toLowerCase();
  
  // Vérifier si l'utilisateur est propriétaire
  const ownedLicense = licenses.find(l => l.ownerEmail === email);
  if (ownedLicense) {
    return {
      hasLicense: true,
      licenseId: ownedLicense.id,
      ownerEmail: ownedLicense.ownerEmail,
      isOwner: true,
      seatNumber: 1
    };
  }
  
  // Vérifier si l'utilisateur est assigné
  for (const license of licenses) {
    const seatIndex = license.assignedUsers.indexOf(email);
    if (seatIndex >= 0) {
      return {
        hasLicense: true,
        licenseId: license.id,
        ownerEmail: license.ownerEmail,
        isOwner: false,
        seatNumber: seatIndex + 1
      };
    }
  }
  
  return { hasLicense: false, isOwner: false };
};

// Assigner un utilisateur à une licence
export const assignUserToLicense = (
  licenseId: string,
  userEmail: string
): { success: boolean; message: string } => {
  const licenses = getAllLicenses();
  const license = licenses.find(l => l.id === licenseId);
  
  if (!license) {
    return { success: false, message: 'Licence introuvable' };
  }
  
  const email = userEmail.toLowerCase();
  
  // Vérifier si l'utilisateur est déjà assigné
  if (license.assignedUsers.includes(email)) {
    return { success: false, message: 'Utilisateur déjà assigné' };
  }
  
  // Vérifier s'il reste des sièges
  if (license.availableSeats <= 0) {
    return { success: false, message: 'Aucun siège disponible' };
  }
  
  // Assigner l'utilisateur
  license.assignedUsers.push(email);
  license.usedSeats++;
  license.availableSeats--;
  
  saveLicense(license);
  
  return { success: true, message: 'Utilisateur assigné avec succès' };
};

// Retirer un utilisateur d'une licence
export const removeUserFromLicense = (
  licenseId: string,
  userEmail: string
): { success: boolean; message: string } => {
  const licenses = getAllLicenses();
  const license = licenses.find(l => l.id === licenseId);
  
  if (!license) {
    return { success: false, message: 'Licence introuvable' };
  }
  
  const email = userEmail.toLowerCase();
  
  // Ne pas permettre de retirer le propriétaire
  if (license.ownerEmail === email) {
    return { success: false, message: 'Impossible de retirer le propriétaire' };
  }
  
  const index = license.assignedUsers.indexOf(email);
  if (index < 0) {
    return { success: false, message: 'Utilisateur non assigné' };
  }
  
  // Retirer l'utilisateur
  license.assignedUsers.splice(index, 1);
  license.usedSeats--;
  license.availableSeats++;
  
  saveLicense(license);
  
  return { success: true, message: 'Utilisateur retiré avec succès' };
};

// Mettre à jour le nombre de sièges d'une licence
export const updateLicenseSeats = (
  licenseId: string,
  newTotalSeats: number
): { success: boolean; message: string } => {
  const licenses = getAllLicenses();
  const license = licenses.find(l => l.id === licenseId);
  
  if (!license) {
    return { success: false, message: 'Licence introuvable' };
  }
  
  // Vérifier que le nouveau nombre est suffisant pour les utilisateurs actuels
  if (newTotalSeats < license.usedSeats) {
    return { 
      success: false, 
      message: `Impossible : ${license.usedSeats} sièges sont déjà utilisés` 
    };
  }
  
  license.totalSeats = newTotalSeats;
  license.availableSeats = newTotalSeats - license.usedSeats;
  license.totalPrice = license.pricePerSeat * newTotalSeats;
  
  saveLicense(license);
  
  return { success: true, message: 'Nombre de sièges mis à jour' };
};

// Calculer le nombre total de licences payées (pour les coûts)
export const getTotalPaidSeats = (): number => {
  const licenses = getAllLicenses();
  return licenses.reduce((total, license) => total + license.totalSeats, 0);
};

// Calculer le nombre total de sièges utilisés
export const getTotalUsedSeats = (): number => {
  const licenses = getAllLicenses();
  return licenses.reduce((total, license) => total + license.usedSeats, 0);
};

// Obtenir les statistiques des licences
export const getLicenseStats = () => {
  const licenses = getAllLicenses();
  const totalPaidSeats = getTotalPaidSeats();
  const totalUsedSeats = getTotalUsedSeats();
  const totalAvailableSeats = licenses.reduce((total, l) => total + l.availableSeats, 0);
  
  return {
    totalLicenses: licenses.length,
    totalPaidSeats,
    totalUsedSeats,
    totalAvailableSeats,
    utilizationRate: totalPaidSeats > 0 ? (totalUsedSeats / totalPaidSeats) * 100 : 0,
    licenses
  };
};

// Vérifier si un utilisateur peut créer un compte
export const canCreateAccount = (ownerEmail: string): { can: boolean; message: string } => {
  const license = getLicenseByOwner(ownerEmail);
  
  if (!license) {
    return { can: false, message: 'Aucune licence trouvée' };
  }
  
  if (license.availableSeats <= 0) {
    return { 
      can: false, 
      message: `Tous les sièges sont utilisés (${license.usedSeats}/${license.totalSeats})` 
    };
  }
  
  return { 
    can: true, 
    message: `${license.availableSeats} siège(s) disponible(s)` 
  };
};

// Supprimer une licence
export const deleteLicense = (licenseId: string): { success: boolean; message: string } => {
  const licenses = getAllLicenses();
  const index = licenses.findIndex(l => l.id === licenseId);
  
  if (index < 0) {
    return { success: false, message: 'Licence introuvable' };
  }
  
  licenses.splice(index, 1);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(licenses));
  
  return { success: true, message: 'Licence supprimée' };
};
