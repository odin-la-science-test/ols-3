# 🧠 Système Prédictif OLS - Documentation

## Vue d'ensemble

Le système prédictif d'OLS utilise l'intelligence artificielle pour anticiper les besoins des utilisateurs et suggérer proactivement les outils et pages pertinents.

## Fonctionnalités

### 1. Tracking Automatique
- **Visites de pages** : Chaque page visitée est enregistrée avec timestamp
- **Utilisation d'outils** : Chaque outil utilisé est tracké
- **Recherches** : Les requêtes de recherche sont analysées
- **Actions** : Exports, sauvegardes, etc.

### 2. Analyse Prédictive

Le système analyse 4 types de patterns :

#### A. Patterns Temporels
- Analyse l'heure de la journée
- Identifie les habitudes horaires
- Suggère les outils utilisés à cette heure

**Exemple** : Si vous utilisez toujours le Lab Notebook à 9h, le système le suggérera à 9h.

#### B. Patterns de Séquence
- Détecte les enchaînements d'actions
- Prédit la prochaine étape logique

**Patterns courants** :
- Lab Notebook → Protocol Builder
- Protocol Builder → Chemical Inventory
- PCR Designer → Gel Simulator
- Experiment Planner → Equipment Booking

#### C. Patterns de Fréquence
- Identifie les outils les plus utilisés
- Suggère les favoris de l'utilisateur

#### D. Patterns Contextuels
- Détecte les workflows en cours
- Suggère les outils complémentaires

**Workflows détectés** :
- **Biologie moléculaire** : PCR Designer, Restriction Mapper, Cloning Assistant, Gel Simulator
- **Culture cellulaire** : Culture Cells, Bacterial Growth Predictor, Colony Vision, Plate Mapper

### 3. Suggestions Intelligentes

Les suggestions apparaissent automatiquement en bas à droite avec :
- **Niveau de confiance** : 0-100%
- **Raison** : Explication de la suggestion
- **Action rapide** : Bouton pour accéder directement

### 4. Dashboard Prédictif

Accessible via `/hugin/PredictiveDashboard`, il affiche :
- **Statistiques d'utilisation** : Actions totales, moyenne par jour
- **Outils les plus utilisés** : Top 5 avec pourcentages
- **Prédictions actives** : Liste des suggestions avec confiance

## Utilisation

### Pour les Développeurs

#### Intégrer le tracking dans une nouvelle page :

```typescript
import { usePredictiveTracking } from '../hooks/usePredictiveTracking';

const MyPage = () => {
  const { trackToolUse, trackSearch, trackExport, trackSave } = usePredictiveTracking();
  
  // Tracker une action
  const handleAction = () => {
    trackToolUse('MyTool', { metadata: 'optional' });
  };
  
  return <div>...</div>;
};
```

#### Ajouter les suggestions :

```typescript
import PredictiveSuggestions from '../components/PredictiveSuggestions';

const MyPage = () => {
  return (
    <div>
      {/* Votre contenu */}
      <PredictiveSuggestions />
    </div>
  );
};
```

### Pour les Utilisateurs

1. **Utilisez normalement Hugin Lab**
   - Le système apprend automatiquement de vos habitudes

2. **Consultez le Dashboard**
   - Accédez à `/hugin/PredictiveDashboard`
   - Visualisez vos statistiques d'utilisation
   - Découvrez les prédictions

3. **Suivez les suggestions**
   - Les suggestions apparaissent automatiquement
   - Cliquez pour accéder rapidement
   - Fermez si non pertinent

## Confidentialité

- **Stockage local** : Toutes les données sont stockées dans le localStorage du navigateur
- **Aucun envoi serveur** : Les données ne quittent jamais votre appareil
- **Réinitialisation** : Vous pouvez effacer les données à tout moment

## Algorithmes

### Calcul de Confiance

```typescript
confidence = min(occurrences / total_actions, 0.9)
```

### Seuils de Détection

- **Pattern temporel** : Minimum 3 actions à la même heure
- **Pattern séquence** : Minimum 2 actions récentes
- **Pattern fréquence** : Minimum 5 actions sur 7 jours
- **Pattern contextuel** : Minimum 2 outils du même workflow

### Limite de Stockage

- Maximum 100 actions stockées
- Les plus anciennes sont supprimées automatiquement

## Améliorations Futures

1. **Machine Learning avancé**
   - Modèles de prédiction plus sophistiqués
   - Apprentissage par renforcement

2. **Suggestions collaboratives**
   - Apprendre des patterns d'autres utilisateurs (anonymisé)
   - Recommandations basées sur le rôle

3. **Intégration calendrier**
   - Suggestions basées sur les événements planifiés
   - Rappels intelligents

4. **Export de données**
   - Exporter les statistiques
   - Rapports d'utilisation

## API

### `predictiveAnalytics`

```typescript
// Tracker une action
predictiveAnalytics.trackAction(type, page, metadata?)

// Obtenir les prédictions
const predictions = predictiveAnalytics.predictNextActions()

// Obtenir les statistiques
const stats = predictiveAnalytics.getUsageStats()

// Réinitialiser
predictiveAnalytics.reset()
```

### `usePredictiveTracking()`

```typescript
const {
  trackToolUse,    // (toolName, metadata?)
  trackSearch,     // (query)
  trackExport,     // (format, page)
  trackSave        // (itemType, page)
} = usePredictiveTracking();
```

## Support

Pour toute question ou suggestion d'amélioration, contactez l'équipe de développement.

---

**Version** : 1.0.0  
**Dernière mise à jour** : 2026-03-02
