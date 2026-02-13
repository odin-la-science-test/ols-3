# 📚 Tutoriel des Modifications - Odin Lab Suite

## Table des Matières
1. [Centre de Notifications](#1-centre-de-notifications)
2. [Raccourcis Clavier](#2-raccourcis-clavier)
3. [Module BioAnalyzer](#3-module-bioanalyzer)
4. [Module ImageAnalyzer](#4-module-imageanalyzer)
5. [Module StatisticsLab](#5-module-statisticslab)
6. [Comment Ajouter un Nouveau Module](#6-comment-ajouter-un-nouveau-module)

---

## 1. Centre de Notifications

### 📍 Localisation
- **Fichier**: `src/components/NotificationCenter.tsx`
- **Intégration**: `src/components/Navbar.tsx`

### 🎯 Fonctionnalités
Le centre de notifications permet d'afficher des alertes et messages importants aux utilisateurs.

### 💻 Utilisation

#### Afficher une Notification
```typescript
import { addNotification } from '../components/NotificationCenter';

// Dans n'importe quel composant
addNotification(
  'success',  // Type: 'success' | 'error' | 'info' | 'warning'
  'Titre de la notification',
  'Message détaillé de la notification'
);
```

#### Exemples Pratiques
```typescript
// Succès
addNotification('success', 'Analyse terminée', 'Vos résultats sont prêts');

// Erreur
addNotification('error', 'Échec du chargement', 'Impossible de charger le fichier');

// Info
addNotification('info', 'Mise à jour disponible', 'Une nouvelle version est disponible');

// Avertissement
addNotification('warning', 'Espace limité', 'Il reste 10% d\'espace de stockage');
```

### 🔧 Personnalisation

#### Modifier l'Apparence
Dans `NotificationCenter.tsx`, ligne 90-110:
```typescript
const getIcon = (type: string) => {
    switch (type) {
        case 'success': return <CheckCircle size={20} color="#10b981" />;
        case 'error': return <AlertCircle size={20} color="#ef4444" />;
        // Ajoutez vos propres types ici
    }
};
```

#### Changer la Limite de Notifications
Ligne 165:
```typescript
if (notifications.length > 50) {  // Changez 50 par votre limite
    notifications.splice(50);
}
```

### 📱 Intégration dans un Nouveau Composant
```typescript
import NotificationCenter from './components/NotificationCenter';

function MonComposant() {
    return (
        <div>
            <NotificationCenter />
            {/* Votre contenu */}
        </div>
    );
}
```

---

## 2. Raccourcis Clavier

### 📍 Localisation
- **Fichier**: `src/components/KeyboardShortcuts.tsx`
- **Intégration**: `src/App.tsx`

### ⌨️ Raccourcis Disponibles

| Raccourci | Action |
|-----------|--------|
| `Ctrl+K` | Afficher/masquer l'aide |
| `Ctrl+H` | Aller à l'accueil |
| `Ctrl+M` | Ouvrir Munin Atlas |
| `Ctrl+L` | Ouvrir Hugin Lab |
| `Ctrl+S` | Ouvrir les paramètres |
| `Esc` | Fermer les dialogues |

### 🔧 Ajouter un Nouveau Raccourci

#### Étape 1: Modifier le Gestionnaire d'Événements
Dans `KeyboardShortcuts.tsx`, ligne 10-35:
```typescript
const handleKeyPress = (e: KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
            // Ajoutez votre nouveau raccourci ici
            case 'n':  // Ctrl+N
                e.preventDefault();
                navigate('/nouveau-module');
                break;
            // ... autres raccourcis
        }
    }
};
```

#### Étape 2: Ajouter à la Liste d'Aide
Ligne 40-47:
```typescript
const shortcuts = [
    // Ajoutez votre raccourci à la liste
    { keys: ['Ctrl', 'N'], description: 'Ouvrir le nouveau module' },
    // ... autres raccourcis
];
```

### 💡 Exemples de Raccourcis Personnalisés

#### Raccourci avec Shift
```typescript
if (e.ctrlKey && e.shiftKey && e.key === 'S') {
    e.preventDefault();
    // Sauvegarder sous...
}
```

#### Raccourci sans Modificateur
```typescript
if (e.key === 'F1') {
    e.preventDefault();
    // Ouvrir l'aide
}
```

---

## 3. Module BioAnalyzer

### 📍 Localisation
- **Fichier**: `src/pages/hugin/BioAnalyzer.tsx`
- **Route**: `/hugin/bioanalyzer`
- **ID Module**: `bioanalyzer`

### 🧬 Fonctionnalités

1. **Analyse de Composition**
   - Comptage des nucléotides (A, T, G, C, U)
   - Calcul du contenu GC
   - Graphique en barres

2. **Profil GC**
   - Analyse par fenêtre glissante (100bp)
   - Graphique linéaire
   - Détection des régions riches/pauvres en GC

3. **Traduction Protéique**
   - Code génétique standard
   - Affichage de la séquence d'acides aminés
   - Comptage des résidus

4. **Sites de Restriction**
   - Détection de 6 enzymes courantes
   - Position exacte dans la séquence
   - Liste détaillée

### 💻 Utilisation

#### Format d'Entrée
```
ATCGATCGATCGTAGCTAGCTAGCTAGC
```
ou
```
>Ma_Sequence
ATCGATCGATCG
TAGCTAGCTAG
```

#### Exemple de Séquence Test
```
ATGGCCATTGTAATGGGCCGCTGAAAGGGTGCCCGATAG
```

### 🔧 Personnalisation

#### Ajouter une Enzyme de Restriction
Ligne 70-77:
```typescript
const restrictionSites = {
    'EcoRI': { pattern: /GAATTC/g, sequence: 'GAATTC' },
    // Ajoutez votre enzyme ici
    'BglII': { pattern: /AGATCT/g, sequence: 'AGATCT' },
};
```

#### Modifier la Taille de la Fenêtre GC
Ligne 42:
```typescript
const gcWindow = 100;  // Changez cette valeur
```

#### Personnaliser le Code Génétique
Ligne 48-65: Modifiez la table `codonTable` pour utiliser un code génétique alternatif.

---

## 4. Module ImageAnalyzer

### 📍 Localisation
- **Fichier**: `src/pages/hugin/ImageAnalyzer.tsx`
- **Route**: `/hugin/imageanalyzer`
- **ID Module**: `imageanalyzer`

### 🖼️ Fonctionnalités

1. **Ajustements de Base**
   - Luminosité (0-200%)
   - Contraste (0-200%)

2. **Filtres**
   - Niveaux de gris
   - Seuillage (binarisation)
   - Détection de contours

3. **Export**
   - Format PNG
   - Résolution originale préservée

### 💻 Utilisation

#### Formats Supportés
- PNG, JPEG, GIF, BMP, WebP
- Taille maximale: limitée par le navigateur

#### Workflow Typique
1. Charger une image
2. Ajuster luminosité/contraste
3. Appliquer un filtre
4. Cliquer sur "Appliquer"
5. Exporter le résultat

### 🔧 Ajouter un Nouveau Filtre

#### Étape 1: Ajouter le Type
Ligne 11:
```typescript
const [activeFilter, setActiveFilter] = useState<
    'none' | 'grayscale' | 'threshold' | 'edge' | 'monFiltre'  // Ajoutez ici
>('none');
```

#### Étape 2: Implémenter le Filtre
Ligne 40-90, dans `applyFilters()`:
```typescript
else if (activeFilter === 'monFiltre') {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    // Votre algorithme ici
    for (let i = 0; i < data.length; i += 4) {
        // Modifier data[i] (rouge), data[i+1] (vert), data[i+2] (bleu)
        data[i] = 255 - data[i];  // Exemple: inversion
    }
    
    ctx.putImageData(imageData, 0, 0);
}
```

#### Étape 3: Ajouter le Bouton
Ligne 180-200:
```typescript
{ id: 'monFiltre', label: 'Mon Filtre Personnalisé' }
```

### 💡 Exemples de Filtres

#### Filtre Sépia
```typescript
for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    data[i] = Math.min(255, r * 0.393 + g * 0.769 + b * 0.189);
    data[i + 1] = Math.min(255, r * 0.349 + g * 0.686 + b * 0.168);
    data[i + 2] = Math.min(255, r * 0.272 + g * 0.534 + b * 0.131);
}
```

#### Filtre Flou Simple
```typescript
// Nécessite un algorithme de convolution plus complexe
// Voir: https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Pixel_manipulation_with_canvas
```

---

## 5. Module StatisticsLab

### 📍 Localisation
- **Fichier**: `src/pages/hugin/StatisticsLab.tsx`
- **Route**: `/hugin/statistics`
- **ID Module**: `statistics`

### 📊 Fonctionnalités

1. **Statistiques Descriptives**
   - N, Moyenne, Médiane
   - Écart-type, Variance
   - Min, Max, Q1, Q3
   - Boîte à moustaches

2. **Test t de Student**
   - Statistique t
   - Degrés de liberté
   - Comparaison à une moyenne théorique

3. **Corrélation**
   - Coefficient de Pearson (r)
   - Coefficient de détermination (R²)
   - Nuage de points

### 💻 Utilisation

#### Format d'Entrée
```
12.5, 14.2, 13.8, 15.1, 14.9, 13.2
```
ou
```
12.5 14.2 13.8 15.1 14.9 13.2
```
ou
```
12.5; 14.2; 13.8; 15.1; 14.9; 13.2
```

#### Pour la Corrélation
Entrez les valeurs X puis Y:
```
10 20 30 40 50 15 25 35 45 55
```
(Les 5 premières valeurs = X, les 5 suivantes = Y)

### 🔧 Ajouter un Nouveau Test

#### Étape 1: Ajouter le Type
Ligne 11:
```typescript
const [testType, setTestType] = useState<
    'descriptive' | 'ttest' | 'anova' | 'correlation' | 'monTest'  // Ajoutez ici
>('descriptive');
```

#### Étape 2: Implémenter le Calcul
Ligne 50-80:
```typescript
const calculateMonTest = (data: number[]) => {
    // Votre algorithme statistique
    const result = /* calculs */;
    return result;
};
```

#### Étape 3: Ajouter au Switch
Ligne 85-100:
```typescript
if (testType === 'monTest') {
    setResults({ 
        type: 'monTest', 
        data: calculateMonTest(data), 
        rawData: data 
    });
}
```

#### Étape 4: Ajouter l'Affichage
Ligne 150-250:
```typescript
{results.type === 'monTest' && (
    <div>
        <h2>Mon Test Statistique</h2>
        {/* Affichage des résultats */}
    </div>
)}
```

### 💡 Exemples de Tests Supplémentaires

#### ANOVA (Analyse de Variance)
```typescript
const calculateANOVA = (groups: number[][]) => {
    // Calcul de la variance inter-groupes
    // Calcul de la variance intra-groupes
    // Calcul du F-ratio
    return { F, df1, df2, pValue };
};
```

#### Test de Normalité (Shapiro-Wilk)
```typescript
const calculateShapiroWilk = (data: number[]) => {
    // Algorithme de Shapiro-Wilk
    return { W, pValue };
};
```

---

## 6. Comment Ajouter un Nouveau Module

### 📋 Checklist Complète

#### ✅ Étape 1: Créer le Fichier du Module
```bash
src/pages/hugin/MonModule.tsx
```

#### ✅ Étape 2: Structure de Base
```typescript
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MonIcon } from 'lucide-react';
import { useToast } from '../../components/ToastContext';

const MonModule = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [data, setData] = useState<any>(null);

    return (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)' }}>
            {/* Header */}
            <div style={{
                padding: '1rem 1.5rem',
                borderBottom: '1px solid var(--border-color)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'var(--bg-secondary)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button onClick={() => navigate('/hugin')} className="btn">
                        <ArrowLeft size={18} />
                        Retour
                    </button>
                    <MonIcon size={24} color="var(--accent-hugin)" />
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>
                        Mon Module
                    </h1>
                </div>
            </div>

            {/* Contenu */}
            <div style={{ flex: 1, padding: '2rem' }}>
                {/* Votre contenu ici */}
            </div>
        </div>
    );
};

export default MonModule;
```

#### ✅ Étape 3: Ajouter la Route dans App.tsx
```typescript
// Import
import MonModule from './pages/hugin/MonModule';

// Route (vers ligne 450)
<Route path="/hugin/mon-module" element={
    <ProtectedRoute module="mon_module">
        <MonModule />
    </ProtectedRoute>
} />
```

#### ✅ Étape 4: Ajouter au Menu Hugin
Dans `src/pages/Hugin.tsx`, ligne 50-100:
```typescript
const modules = [
    // ... autres modules
    { 
        id: 'mon_module', 
        icon: <MonIcon size={24} />, 
        category: 'Analysis',  // ou 'Management', 'Communication', 'Research'
        path: '/hugin/mon-module' 
    },
];
```

#### ✅ Étape 5: Ajouter les Traductions
Dans `src/translations/index.ts`:
```typescript
// Section FR (ligne ~80)
mon_module: "Mon Module",
mon_module_desc: "Description de mon module en français",

// Section EN (ligne ~230)
mon_module: "My Module",
mon_module_desc: "Description of my module in English",
```

#### ✅ Étape 6: Tester
```bash
npm run dev
```
Naviguez vers `http://localhost:5173/hugin` et vérifiez que votre module apparaît.

### 🎨 Bonnes Pratiques

#### Structure de Dossiers
```
src/pages/hugin/
├── MonModule.tsx          # Composant principal
├── MonModule.css          # Styles spécifiques (optionnel)
└── components/            # Sous-composants (optionnel)
    └── MonSousComposant.tsx
```

#### Gestion d'État
```typescript
// État local simple
const [data, setData] = useState<any>(null);

// État complexe avec useReducer
const [state, dispatch] = useReducer(reducer, initialState);

// Persistance
import { fetchModuleData, saveModuleItem } from '../../utils/persistence';
```

#### Notifications
```typescript
import { addNotification } from '../../components/NotificationCenter';

// Succès
addNotification('success', 'Opération réussie', 'Les données ont été sauvegardées');

// Erreur
addNotification('error', 'Erreur', 'Impossible de charger les données');
```

#### Styles Cohérents
```typescript
// Utilisez les variables CSS
style={{
    background: 'var(--bg-primary)',
    color: 'var(--text-primary)',
    border: '1px solid var(--border-color)',
    borderRadius: '0.5rem'
}}
```

---

## 🔍 Débogage

### Problèmes Courants

#### Module n'Apparaît Pas dans le Menu
1. Vérifiez l'ID du module dans `Hugin.tsx`
2. Vérifiez les traductions dans `translations/index.ts`
3. Vérifiez la catégorie (doit correspondre à une catégorie existante)

#### Route ne Fonctionne Pas
1. Vérifiez l'import dans `App.tsx`
2. Vérifiez le chemin exact dans la route
3. Vérifiez le module de protection (doit correspondre à l'ID)

#### Styles ne s'Appliquent Pas
1. Utilisez les variables CSS (`var(--nom-variable)`)
2. Vérifiez l'ordre des styles inline
3. Utilisez `!important` en dernier recours

#### Notifications ne s'Affichent Pas
1. Vérifiez l'import de `addNotification`
2. Vérifiez que `NotificationCenter` est dans la Navbar
3. Vérifiez la console pour les erreurs

### Outils de Débogage

#### Console du Navigateur
```typescript
console.log('État actuel:', data);
console.error('Erreur:', error);
console.table(arrayData);
```

#### React DevTools
- Installez l'extension React DevTools
- Inspectez les composants et leur état
- Suivez les re-rendus

#### Diagnostics TypeScript
```bash
npm run build
```
Vérifiez les erreurs de compilation.

---

## 📚 Ressources Supplémentaires

### Documentation
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Lucide Icons](https://lucide.dev/)
- [Plotly.js](https://plotly.com/javascript/)

### Exemples de Code
- Voir les modules existants dans `src/pages/hugin/`
- Consultez `AMELIORATIONS.md` pour des idées

### Support
- Ouvrez une issue sur GitHub
- Consultez la documentation interne
- Contactez l'équipe de développement

---

## 🎓 Exercices Pratiques

### Exercice 1: Ajouter une Notification
Ajoutez une notification de succès dans `BioAnalyzer.tsx` après l'analyse.

### Exercice 2: Nouveau Raccourci
Ajoutez un raccourci `Ctrl+B` pour ouvrir BioAnalyzer.

### Exercice 3: Filtre d'Image
Implémentez un filtre "Inversion" dans ImageAnalyzer.

### Exercice 4: Test Statistique
Ajoutez un test de Chi-carré dans StatisticsLab.

### Exercice 5: Module Complet
Créez un module "ProteinAnalyzer" qui calcule le poids moléculaire d'une protéine.

---

## ✅ Checklist de Validation

Avant de considérer une modification comme terminée:

- [ ] Le code compile sans erreurs
- [ ] Les tests passent (si applicable)
- [ ] La documentation est à jour
- [ ] Les traductions sont complètes (FR + EN minimum)
- [ ] Le module apparaît dans le menu Hugin
- [ ] La route fonctionne correctement
- [ ] Les notifications fonctionnent
- [ ] Le design est cohérent avec le reste de l'application
- [ ] Le code est commenté (si complexe)
- [ ] Les performances sont acceptables
- [ ] Testé sur Chrome, Firefox, Safari
- [ ] Testé en mode mobile (responsive)

---

**Dernière mise à jour**: ${new Date().toLocaleDateString('fr-FR')}
**Version**: 1.0.0
**Auteur**: Équipe Odin Lab Suite
