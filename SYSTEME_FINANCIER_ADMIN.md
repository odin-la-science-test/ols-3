# 💰 Système Financier - Panneau Admin

## Vue d'ensemble

Le système financier du panneau d'administration permet aux super admins de suivre les revenus, coûts et bénéfices de la plateforme OLS.

## Accès Restreint

### Super Admins Autorisés

Seuls les 3 super admins suivants peuvent voir la section financière :
- **ethan@ols.com**
- **bastien@ols.com**
- **issam@ols.com**

Les autres admins voient uniquement les statistiques utilisateurs de base.

## Gestion des Abonnements

### Conversion Annuel → Mensuel

Le système gère intelligemment les deux types d'abonnements :

#### Abonnements Mensuels
- Prix : Montant mensuel (ex: 10€/mois)
- Revenu mensuel : 10€
- Argent collecté : 10€

#### Abonnements Annuels
- Prix : Montant annuel (ex: 100€/an)
- Revenu mensuel équivalent : 100€ / 12 = 8,33€
- Argent collecté : 100€ (montant total)

### Exemple Concret

Utilisateur avec abonnement annuel à 120€ :
- **Revenu mensuel** : 120€ / 12 = 10€ (pour les calculs)
- **Argent collecté** : 120€ (montant réellement payé)

Cela permet de :
- Calculer correctement les coûts mensuels vs revenus
- Garder trace de l'argent réellement en banque
- Faire des projections précises

## Métriques Affichées

### Métriques Principales

#### 1. Revenu Mensuel
- Somme des abonnements mensuels + annuels convertis
- Utilisé pour calculer la rentabilité mensuelle
- **Formule** : `Σ(mensuels) + Σ(annuels / 12)`

#### 2. Argent Collecté
- Montant total réellement payé par les utilisateurs
- Inclut les paiements annuels complets
- **Formule** : `Σ(mensuels) + Σ(annuels)`

#### 3. Coûts Totaux
- Coûts fixes + coûts variables
- **Formule** : `1150€ + (1,30€ × nb_utilisateurs)`

#### 4. Bénéfice Brut
- Revenu mensuel - Coûts totaux
- **Formule** : `Revenu mensuel - Coûts`

#### 5. Marge Brute
- Pourcentage de bénéfice
- **Formule** : `(Bénéfice / Revenu) × 100`

### Détail des Coûts

#### Coûts Fixes (1 150€/mois)

**Infrastructure (350€)** :
- Hosting : 150€
- Database : 100€
- CDN : 50€
- Backup : 30€
- Monitoring : 20€

**Support (350€)** :
- Service client : 200€
- Maintenance : 150€

**Développement (150€)** :
- Outils : 100€
- Licences : 50€

**Marketing (300€)** :
- Publicité : 200€
- Contenu : 100€

#### Coûts Variables (1,30€/utilisateur/mois)

- Storage : 0,50€
- Bandwidth : 0,30€
- Compute : 0,40€
- Email : 0,10€

### Répartition des Revenus

Le système affiche 3 métriques :

1. **Abonnements Mensuels** : Somme des abonnements mensuels
2. **Abonnements Annuels** : Somme des paiements annuels
3. **Annuels (Équivalent Mensuel)** : Annuels / 12

### Projections Annuelles

- **Revenu Annuel** : Revenu mensuel × 12
- **Coûts Annuels** : Coûts mensuels × 12
- **Bénéfice Annuel** : Bénéfice mensuel × 12
- **Seuil de Rentabilité** : Nombre d'utilisateurs nécessaires pour être rentable

**Formule seuil** :
```
Seuil = Coûts fixes / (Revenu moyen par user - Coût variable par user)
Seuil = 1150€ / (Revenu moyen - 1,30€)
```

## Exemples de Calculs

### Exemple 1 : 50 utilisateurs

**Utilisateurs** :
- 30 mensuels à 10€ = 300€
- 20 annuels à 100€ = 2000€ collectés

**Calculs** :
- Revenu mensuel : 300€ + (2000€ / 12) = 300€ + 166,67€ = 466,67€
- Argent collecté : 300€ + 2000€ = 2300€
- Coûts : 1150€ + (50 × 1,30€) = 1215€
- Bénéfice : 466,67€ - 1215€ = -748,33€ (déficitaire)
- Marge : -160,3%

### Exemple 2 : 200 utilisateurs

**Utilisateurs** :
- 120 mensuels à 15€ = 1800€
- 80 annuels à 150€ = 12000€ collectés

**Calculs** :
- Revenu mensuel : 1800€ + (12000€ / 12) = 1800€ + 1000€ = 2800€
- Argent collecté : 1800€ + 12000€ = 13800€
- Coûts : 1150€ + (200 × 1,30€) = 1410€
- Bénéfice : 2800€ - 1410€ = 1390€ (rentable)
- Marge : 49,6%

## Interprétation des Résultats

### Indicateurs de Santé

#### Marge Brute
- **< 0%** : Déficitaire, coûts > revenus
- **0-20%** : Faible rentabilité
- **20-40%** : Rentabilité correcte
- **40-60%** : Bonne rentabilité
- **> 60%** : Excellente rentabilité

#### Seuil de Rentabilité
- Nombre d'utilisateurs minimum pour être rentable
- Si utilisateurs actuels < seuil : déficitaire
- Si utilisateurs actuels > seuil : rentable

### Actions Recommandées

**Si déficitaire** :
1. Augmenter les prix
2. Réduire les coûts fixes
3. Acquérir plus d'utilisateurs
4. Optimiser les coûts variables

**Si rentable** :
1. Maintenir la croissance
2. Investir dans le marketing
3. Améliorer le produit
4. Préparer la scalabilité

## Sécurité

- Données stockées localement (localStorage)
- Accès restreint aux 3 super admins
- Vérification email case-insensitive
- Badge "Super Admin Only" visible

## Mise à Jour des Coûts

Pour modifier les coûts, éditer `src/utils/financialAnalytics.ts` :

```typescript
const FIXED_COSTS = {
  infrastructure: { total: 350 },
  support: { total: 350 },
  development: { total: 150 },
  marketing: { total: 300 }
};

const VARIABLE_COSTS_PER_USER = {
  total: 1.30
};
```

---

**Version** : 1.0.0  
**Dernière mise à jour** : 2026-03-02
