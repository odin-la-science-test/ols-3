// Script de migration pour ajouter le champ 'seats' aux profils utilisateurs existants

export const migrateUserProfiles = () => {
  let migratedCount = 0;
  
  // Parcourir tous les items du localStorage
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    
    // Ne traiter que les profils utilisateurs
    if (key && key.startsWith('user_profile_')) {
      try {
        const profileData = localStorage.getItem(key);
        if (!profileData) continue;
        
        const profile = JSON.parse(profileData);
        
        // Vérifier si le profil a déjà le champ seats
        if (profile.subscription && typeof profile.subscription.seats === 'undefined') {
          // Ajouter le champ seats
          if (profile.accountCategory === 'enterprise' && profile.numberOfEmployees) {
            profile.subscription.seats = profile.numberOfEmployees;
          } else {
            profile.subscription.seats = 1;
          }
          
          // Sauvegarder le profil mis à jour
          localStorage.setItem(key, JSON.stringify(profile));
          migratedCount++;
          
          console.log(`✅ Migré: ${profile.email} - ${profile.subscription.seats} sièges`);
        }
      } catch (e) {
        console.error(`Erreur migration ${key}:`, e);
      }
    }
  }
  
  console.log(`🎉 Migration terminée: ${migratedCount} profils mis à jour`);
  return migratedCount;
};

// Fonction à appeler au démarrage de l'application
export const runMigrationIfNeeded = () => {
  const migrationKey = 'migration_seats_completed';
  
  // Vérifier si la migration a déjà été effectuée
  if (!localStorage.getItem(migrationKey)) {
    console.log('🔄 Démarrage de la migration des profils...');
    const count = migrateUserProfiles();
    
    // Marquer la migration comme terminée
    localStorage.setItem(migrationKey, 'true');
    localStorage.setItem('migration_seats_date', new Date().toISOString());
    
    return count;
  }
  
  return 0;
};
