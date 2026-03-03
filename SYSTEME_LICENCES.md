# 🎫 Système de Gestion des Licences OLS

## Vue d'ensemble

Le système de licences permet aux clients entreprise d'acheter plusieurs sièges et de créer/attribuer des comptes à leurs employés selon le nombre de licences achetées.

## Concepts Clés

### Licence (License)
- Ensemble de sièges achetés par un client
- Contient : nombre total de sièges, sièges utilisés, sièges disponibles
- Associée à un propriétaire (owner) qui gère les attributions

### Siège (Seat)
- Une licence individuelle permettant de créer un compte
- Peut être utilisé (compte créé) ou disponible (libre)
- Le propriétaire compte comme 1 siège

### Propriétaire (Owner)
- Client qui a acheté la licence
- Peut créer et attribuer des comptes
- Ne peut pas être retiré de sa propre licence

## Fonctionnement

### 1. Achat de Licences

Quand un client entreprise s'inscrit :
```typescript
// Exemple : Entreprise achète 10 sièges à 15€/siège/mois
createLicense(
  'entreprise@example.com',  // Propriétaire
  10,                         // Nombre de sièges
  'enterprise_pro',           // Type d'abonnement
  'monthly',                  // Cycle
  15                          // Prix par siège
);
```

Résultat :
- **Total sièges** : 10
- **Sièges utilisés** : 1 (le propriétaire)
- **Sièges disponibles** : 9
- **Prix total** : 150€/mois

### 2. Attribution de Comptes

Le propriétaire peut créer des comptes pour ses employés :

```typescript
// Créer un compte pour un employé
assignUserToLicense(
  licenseId,
  'employe@example.com'
);
```

Après attribution :
- **Sièges utilisés** : 2
- **Sièges disponibles** : 8

### 3. Gestion des Sièges

#### Ajouter des sièges
```typescript
updateLicenseSeats(licenseId, 15); // Passer de 10 à 15 sièges
```

#### Retirer un utilisateur
```typescript
removeUserFromLicense(licenseId, 'employe@example.com');
```

#### Vérifier la disponibilité
```typescript
const { can, message } = canCreateAccount('entreprise@example.com');
if (can) {
  // Créer le compte
}
```

## Impact Financier

### Calcul des Coûts

Les coûts sont calculés sur le **nombre de licences payées**, pas sur les utilisateurs actifs.

#### Exemple 1 : Entreprise avec 10 sièges, 6 utilisés

**Licences** :
- Sièges payés : 10
- Sièges utilisés : 6
- Sièges disponibles : 4

**Coûts** :
- Coûts fixes : 1 150€
- Coûts variables : 10 × 1,30€ = 13€
- **Total** : 1 163€

**Revenu** :
- 10 sièges × 15€ = 150€/mois

**Résultat** :
- Bénéfice : 150€ - 1 163€ = -1 013€ (déficitaire)

#### Exemple 2 : 5 entreprises, 200 sièges total, 150 utilisés

**Licences** :
- Sièges payés : 200
- Sièges utilisés : 150
- Taux d'utilisation : 75%

**Coûts** :
- Coûts fixes : 1 150€
- Coûts variables : 200 × 1,30€ = 260€
- **Total** : 1 410€

**Revenu** :
- 200 sièges × 15€ = 3 000€/mois

**Résultat** :
- Bénéfice : 3 000€ - 1 410€ = 1 590€
- Marge : 53%

### Métriques Affichées

#### Dans le Panneau Admin

**Gestion des Licences** :
- **Licences Payées** : Nombre total de sièges achetés
- **Utilisateurs Actifs** : Nombre de comptes créés
- **Taux d'Utilisation** : (Utilisateurs / Licences) × 100
- **Licences Disponibles** : Sièges non utilisés

**Coûts et Profits** :
- **Coût par utilisateur** : Coûts totaux / Utilisateurs actifs
- **Coût par licence** : Coûts totaux / Licences payées
- **Profit par utilisateur** : Bénéfice / Utilisateurs actifs
- **Profit par licence** : Bénéfice / Licences payées

## Cas d'Usage

### Cas 1 : Petite Entreprise (5 employés)

**Achat** :
- 5 sièges à 12€/siège = 60€/mois
- Cycle : mensuel

**Utilisation** :
- Propriétaire + 4 employés = 5 sièges utilisés
- Taux d'utilisation : 100%

**Évolution** :
- Embauche de 2 personnes → Acheter 2 sièges supplémentaires
- Nouveau total : 7 sièges à 84€/mois

### Cas 2 : Grande Entreprise (50 employés)

**Achat** :
- 50 sièges à 10€/siège = 500€/mois
- Cycle : annuel (5 000€ payés d'avance)

**Utilisation** :
- 35 employés utilisent la plateforme
- Taux d'utilisation : 70%
- 15 sièges disponibles pour futurs employés

**Avantages** :
- Flexibilité pour embauches
- Pas besoin d'acheter à chaque fois
- Coûts prévisibles

### Cas 3 : Laboratoire Universitaire

**Achat** :
- 20 sièges à 8€/siège (tarif étudiant) = 160€/mois
- Cycle : annuel (1 920€)

**Utilisation** :
- Professeur (propriétaire) + 15 étudiants = 16 sièges
- Taux d'utilisation : 80%
- 4 sièges pour nouveaux étudiants

**Gestion** :
- Étudiants diplômés retirés chaque année
- Nouveaux étudiants ajoutés
- Nombre de sièges ajusté selon besoins

## API Complète

### Créer une Licence
```typescript
createLicense(
  ownerEmail: string,
  totalSeats: number,
  subscriptionType: string,
  subscriptionCycle: string,
  pricePerSeat: number
): License
```

### Obtenir une Licence
```typescript
getLicenseByOwner(ownerEmail: string): License | null
getUserLicense(userEmail: string): UserLicenseInfo
getAllLicenses(): License[]
```

### Gérer les Utilisateurs
```typescript
assignUserToLicense(licenseId: string, userEmail: string): Result
removeUserFromLicense(licenseId: string, userEmail: string): Result
canCreateAccount(ownerEmail: string): { can: boolean, message: string }
```

### Gérer les Sièges
```typescript
updateLicenseSeats(licenseId: string, newTotalSeats: number): Result
```

### Statistiques
```typescript
getTotalPaidSeats(): number
getTotalUsedSeats(): number
getLicenseStats(): LicenseStats
```

### Supprimer
```typescript
deleteLicense(licenseId: string): Result
```

## Sécurité

### Restrictions

1. **Propriétaire** :
   - Ne peut pas être retiré de sa licence
   - Seul à pouvoir gérer les attributions

2. **Sièges** :
   - Impossible de réduire sous le nombre utilisé
   - Vérification avant chaque attribution

3. **Emails** :
   - Normalisés en minuscules
   - Vérification d'unicité

### Stockage

- Données dans localStorage : `ols_licenses`
- Format JSON
- Pas de données sensibles (pas de mots de passe)

## Intégration avec le Système Financier

Le système financier utilise automatiquement les données de licences :

```typescript
// Dans financialAnalytics.ts
const totalPaidSeats = users.reduce((sum, user) => {
  return sum + (user.subscription?.seats || 1);
}, 0);

// Coûts basés sur les licences payées
const variableCosts = totalPaidSeats * COST_PER_SEAT;
```

## Prochaines Étapes

### Interface Utilisateur

1. **Page de Gestion des Licences** (pour propriétaires)
   - Voir les sièges disponibles
   - Créer des comptes pour employés
   - Retirer des utilisateurs
   - Acheter plus de sièges

2. **Tableau de Bord Admin**
   - Liste de toutes les licences
   - Statistiques d'utilisation
   - Alertes pour licences sous-utilisées

3. **Notifications**
   - Alerte quand sièges presque pleins
   - Rappel de renouvellement
   - Confirmation d'attribution

### Fonctionnalités Avancées

1. **Rôles et Permissions**
   - Admin de licence (peut gérer)
   - Utilisateur standard (ne peut pas gérer)

2. **Historique**
   - Log des attributions/retraits
   - Audit trail

3. **Facturation**
   - Génération de factures
   - Historique des paiements
   - Ajustement automatique du prix

---

**Version** : 1.0.0  
**Dernière mise à jour** : 2026-03-02
