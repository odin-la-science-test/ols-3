# 📱 Architecture Mobile/Desktop

## Vue d'Ensemble

Le site utilise maintenant une architecture séparée pour les versions desktop et mobile, garantissant une expérience optimale sur chaque type d'appareil.

## 🏗️ Structure des Dossiers

```
src/
├── pages/                    # Pages DESKTOP
│   ├── Home.tsx
│   ├── Hugin.tsx
│   ├── Munin.tsx
│   └── hugin/               # Modules Hugin desktop
│       ├── BioAnalyzer.tsx
│       ├── ImageAnalyzer.tsx
│       └── ...
│
├── pages/mobile/            # Pages MOBILE
│   ├── Home.tsx            # Version mobile de Home
│   ├── Hugin.tsx           # Version mobile de Hugin
│   └── hugin/              # Modules Hugin mobile (à créer)
│       ├── BioAnalyzer.tsx
│       └── ...
│
└── components/
    └── ResponsiveRoute.tsx  # Composant de routage intelligent
```

## 🔧 Composant ResponsiveRoute

### Utilisation

```typescript
import ResponsiveRoute from './components/ResponsiveRoute';
import DesktopPage from './pages/DesktopPage';
import MobilePage from './pages/mobile/MobilePage';

<Route path="/page" element={
  <ResponsiveRoute 
    desktopComponent={DesktopPage} 
    mobileComponent={MobilePage} 
  />
} />
```

### Fonctionnement

1. Détecte automatiquement le type d'appareil via `useDeviceDetection`
2. Charge le composant approprié (desktop ou mobile)
3. Affiche un loader pendant le chargement
4. Utilise React.lazy et Suspense pour le code splitting

## 📱 Pages Mobiles Créées

### 1. MobileHome (`src/pages/mobile/Home.tsx`)

**Différences avec Desktop:**
- Layout en grille 2 colonnes pour Munin/Hugin
- Section "Accès Rapide" avec liens directs
- Design optimisé pour le touch
- Pas de statistiques complexes
- Navigation simplifiée

**Fonctionnalités:**
- Cartes Munin et Hugin cliquables
- Accès rapide: Messages, Planning, Cultures
- Design natif mobile avec `card-native`

### 2. MobileHugin (`src/pages/mobile/Hugin.tsx`)

**Différences avec Desktop:**
- Grille 2 colonnes au lieu de 3-4
- Logo plus petit (120px vs 240px)
- Modules affichés en cartes compactes
- Recherche simplifiée
- Descriptions tronquées (2 lignes max)

**Fonctionnalités:**
- Recherche de modules
- Filtrage par accès utilisateur
- Navigation vers tous les modules
- Design optimisé touch

## 🎨 Styles Mobiles

### Classes CSS Spéciales

```css
.card-native {
  /* Carte optimisée mobile */
  background: rgba(255, 255, 255, 0.05);
  border-radius: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.app-viewport {
  /* Viewport mobile avec safe areas */
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-scrollbox {
  /* Zone scrollable mobile */
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}
```

## 📋 Créer une Nouvelle Page Mobile

### Étape 1: Créer le Fichier

```bash
src/pages/mobile/MaPage.tsx
```

### Étape 2: Structure de Base

```typescript
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';

const MobileMaPage = () => {
    const navigate = useNavigate();

    return (
        <div className="app-viewport">
            <Navbar />
            <div className="app-scrollbox" style={{ padding: '1.5rem' }}>
                {/* Contenu mobile optimisé */}
            </div>
        </div>
    );
};

export default MobileMaPage;
```

### Étape 3: Ajouter au Routing

```typescript
// Dans App.tsx
import MaPage from './pages/MaPage';
import MobileMaPage from './pages/mobile/MaPage';

<Route path="/ma-page" element={
  <ResponsiveRoute 
    desktopComponent={MaPage} 
    mobileComponent={MobileMaPage} 
  />
} />
```

## 🎯 Bonnes Pratiques Mobile

### 1. Tailles et Espacements

```typescript
// ✅ BON - Adapté au touch
padding: '1.5rem'
fontSize: '0.9rem'
minHeight: '44px'  // Taille minimale touch

// ❌ MAUVAIS - Trop petit
padding: '0.25rem'
fontSize: '0.6rem'
minHeight: '20px'
```

### 2. Navigation

```typescript
// ✅ BON - Navigation simple
<div onClick={() => navigate('/page')}>

// ❌ MAUVAIS - Hover effects
<div onMouseEnter={...}>
```

### 3. Layout

```typescript
// ✅ BON - Grille 2 colonnes max
gridTemplateColumns: 'repeat(2, 1fr)'

// ❌ MAUVAIS - Trop de colonnes
gridTemplateColumns: 'repeat(4, 1fr)'
```

### 4. Texte

```typescript
// ✅ BON - Texte lisible
fontSize: '0.9rem'
lineHeight: 1.4

// ❌ MAUVAIS - Texte trop petit
fontSize: '0.6rem'
lineHeight: 1.1
```

## 🔍 Détection d'Appareil

Le hook `useDeviceDetection` détecte:
- **Mobile**: < 768px de largeur
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

```typescript
const { isMobile, isTablet, isDesktop } = useDeviceDetection();
```

## 📊 Modules à Adapter

### Priorité Haute
- [x] Home
- [x] Hugin (dashboard)
- [ ] Messaging
- [ ] Planning
- [ ] Inventory

### Priorité Moyenne
- [ ] BioAnalyzer
- [ ] ImageAnalyzer
- [ ] StatisticsLab
- [ ] CultureTracking
- [ ] Notebook

### Priorité Basse
- [ ] AdvancedModule
- [ ] Documentation
- [ ] Tutorial

## 🚀 Avantages de cette Architecture

### 1. Séparation des Préoccupations
- Code desktop et mobile séparé
- Pas de conditions `if (isMobile)` partout
- Maintenance facilitée

### 2. Performance
- Code splitting automatique
- Charge uniquement la version nécessaire
- Bundle size optimisé

### 3. Expérience Utilisateur
- Interface native pour chaque plateforme
- Pas de compromis desktop/mobile
- Interactions optimisées

### 4. Développement
- Développement parallèle possible
- Tests séparés
- Évolutions indépendantes

## 🔄 Migration Progressive

### Phase 1: Pages Principales ✅
- Home
- Hugin dashboard

### Phase 2: Modules Essentiels
- Messaging
- Planning
- Inventory

### Phase 3: Modules Avancés
- BioAnalyzer
- ImageAnalyzer
- StatisticsLab

### Phase 4: Pages Secondaires
- Documentation
- Tutorial
- Settings

## 📝 Checklist Création Page Mobile

- [ ] Créer le fichier dans `src/pages/mobile/`
- [ ] Utiliser `app-viewport` et `app-scrollbox`
- [ ] Tailles touch-friendly (min 44px)
- [ ] Grille 2 colonnes maximum
- [ ] Texte lisible (min 0.85rem)
- [ ] Navigation simplifiée
- [ ] Tester sur vraie device
- [ ] Ajouter au routing avec ResponsiveRoute
- [ ] Vérifier les safe areas (notch, etc.)
- [ ] Optimiser les images

## 🐛 Débogage

### Forcer la Version Mobile sur Desktop

```typescript
// Dans useDeviceDetection.ts
return {
  isMobile: true,  // Force mobile
  isTablet: false,
  isDesktop: false
};
```

### Tester les Deux Versions

1. Desktop: Navigateur normal
2. Mobile: DevTools > Toggle device toolbar (Ctrl+Shift+M)
3. Vraie device: Accès via réseau local

## 📚 Ressources

- [React Router](https://reactrouter.com/)
- [Mobile Web Best Practices](https://web.dev/mobile/)
- [Touch Target Sizes](https://web.dev/accessible-tap-targets/)
- [Safe Area Insets](https://webkit.org/blog/7929/designing-websites-for-iphone-x/)

---

**Dernière mise à jour**: ${new Date().toLocaleDateString('fr-FR')}
**Version**: 1.0.0
