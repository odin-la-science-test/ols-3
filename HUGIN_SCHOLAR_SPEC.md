# Spécification : Hugin Scholar - Version Étudiante

## Objectif
Créer une version adaptée de Hugin pour les étudiants, appelée "Hugin Scholar", avec des modules spécifiques à la scolarité et une interface simplifiée.

## Différences Hugin Lab vs Hugin Scholar

### Hugin Lab (Professionnels)
- Nom : "Hugin Lab"
- Description : "Votre laboratoire numérique professionnel"
- Modules : Tous les modules professionnels
- Couleur thème : Bleu/Violet (actuel)

### Hugin Scholar (Étudiants)
- Nom : "Hugin Scholar"
- Description : "Votre assistant pour réussir vos études scientifiques"
- Modules : Modules de base + modules scolaires spécifiques
- Couleur thème : Vert/Bleu (académique)

## Modules Hugin Scholar

### Modules de Base (Communs)
✅ Cahier de Labo
✅ Protocoles
✅ Calculateur Tampons
✅ Calculateur Protéines
✅ PCR Designer
✅ Simulateur de Gel
✅ Statistiques

### Modules Scholar (Nouveaux - Spécifiques Étudiants)
📚 **Devoirs & TP**
- Suivi des devoirs à rendre
- Liste des TP à préparer
- Dates limites et rappels
- Notes et évaluations

🎓 **Préparation Examens**
- Fiches de révision par matière
- Planning de révisions
- Quiz et auto-évaluation
- Progression par chapitre

📖 **Notes de Cours**
- Organisation par matière/semestre
- Prise de notes structurée
- Intégration d'images et schémas
- Recherche dans les notes

📝 **Comptes-Rendus**
- Templates de CR de TP
- Structure guidée
- Export PDF
- Historique des CR

### Modules Exclus pour Étudiants
❌ Inventaire Chimique (gestion professionnelle)
❌ Réservation Équipements (géré par l'établissement)
❌ Budget & Subventions (recherche professionnelle)
❌ Gestion d'équipe
❌ Modules de gestion avancée

## Détection du Type d'Utilisateur

```typescript
// Dans le profil utilisateur
interface UserProfile {
  isStudent: boolean;
  studentCardVerified: boolean;
  institution?: string;
  level?: 'licence' | 'master' | 'doctorat';
}
```

## Interface Adaptative

### Page d'accueil Hugin
- Titre dynamique : "Hugin Lab" ou "Hugin Scholar"
- Description adaptée
- Modules filtrés selon le type d'utilisateur
- Catégories adaptées :
  - Scholar : "Cours", "TP & Devoirs", "Outils", "Révisions"
  - Lab : "Core", "Lab", "Research", "Analysis"

### Navigation
- Menu adapté avec les bons modules
- Icônes et couleurs cohérentes
- Accès rapide aux modules fréquents

## Implémentation

### Fichiers à créer
1. ✅ `src/utils/studentModules.ts` - Configuration des modules
2. `src/pages/hugin/HomeworkTracker.tsx` - Suivi devoirs
3. `src/pages/hugin/ExamPrep.tsx` - Préparation examens
4. `src/pages/hugin/CourseNotes.tsx` - Notes de cours
5. `src/pages/hugin/LabReports.tsx` - Comptes-rendus

### Fichiers à modifier
1. `src/pages/Hugin.tsx` - Adapter l'affichage selon isStudent
2. `src/pages/Register.tsx` - Déjà fait (détection étudiant)
3. `src/components/Navbar.tsx` - Adapter le menu

### Logique de filtrage
```typescript
// Vérifier si l'utilisateur est étudiant
const userProfile = JSON.parse(localStorage.getItem(`user_profile_${email}`) || '{}');
const isStudent = userProfile.isStudent || false;

// Filtrer les modules
const accessibleModules = getAccessibleModules(isStudent);

// Afficher le bon nom
const platformName = getHuginPlatformName(isStudent);
```

## Prochaines Étapes

1. ✅ Créer la configuration des modules (`studentModules.ts`)
2. Adapter la page Hugin.tsx pour afficher les bons modules
3. Créer les 4 nouveaux modules Scholar
4. Tester avec un compte étudiant
5. Ajouter des fonctionnalités spécifiques plus tard

## Notes
- Les étudiants gardent accès à Munin Atlas (gratuit)
- Réduction de 50% sur tous les tarifs
- Possibilité d'upgrade vers version professionnelle après les études
