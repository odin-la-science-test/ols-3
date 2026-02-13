# 🚀 Guide de Déploiement GitHub + Vercel

## Étape 1: Préparer le Projet

### 1.1 Vérifier .gitignore
Assurez-vous que `.gitignore` contient:
```
node_modules/
dist/
.env.local
.DS_Store
*.log
.vercel
```

### 1.2 Créer vercel.json
Fichier de configuration Vercel (déjà créé)

## Étape 2: Initialiser Git et Pousser sur GitHub

### 2.1 Initialiser le dépôt Git (si pas déjà fait)
```bash
git init
git add .
git commit -m "Initial commit - Odin La Science v2.0"
```

### 2.2 Créer un dépôt sur GitHub
1. Aller sur https://github.com
2. Cliquer sur "New repository"
3. Nom: `odin-la-science`
4. Description: "Plateforme scientifique complète avec Munin Atlas et Hugin Lab"
5. Visibilité: Private (recommandé) ou Public
6. NE PAS initialiser avec README (vous en avez déjà un)
7. Cliquer "Create repository"

### 2.3 Lier le dépôt local à GitHub
```bash
git remote add origin https://github.com/VOTRE_USERNAME/odin-la-science.git
git branch -M main
git push -u origin main
```

## Étape 3: Configurer Vercel

### 3.1 Créer un compte Vercel
1. Aller sur https://vercel.com
2. S'inscrire avec GitHub (recommandé)
3. Autoriser Vercel à accéder à vos dépôts

### 3.2 Importer le projet
1. Cliquer sur "Add New..." → "Project"
2. Sélectionner votre dépôt `odin-la-science`
3. Cliquer "Import"

### 3.3 Configuration du projet
**Framework Preset**: Vite
**Root Directory**: ./
**Build Command**: `npm run build`
**Output Directory**: `dist`
**Install Command**: `npm install`

### 3.4 Variables d'environnement (optionnel)
Si vous utilisez Supabase ou d'autres services:
```
VITE_SUPABASE_URL=votre_url
VITE_SUPABASE_ANON_KEY=votre_clé
```

### 3.5 Déployer
Cliquer sur "Deploy"

## Étape 4: Déploiement Automatique

### 4.1 Configuration automatique
Vercel détecte automatiquement les push sur GitHub:
- Push sur `main` → Déploiement en production
- Push sur autres branches → Déploiement de preview

### 4.2 Workflow de développement
```bash
# Développement local
npm run dev

# Tester le build
npm run build
npm run preview

# Commiter et pousser
git add .
git commit -m "Description des changements"
git push origin main
```

## Étape 5: Configuration Avancée

### 5.1 Domaine personnalisé
1. Dans Vercel → Settings → Domains
2. Ajouter votre domaine: `odin-la-science.com`
3. Configurer les DNS selon les instructions

### 5.2 En-têtes de sécurité
Déjà configurés dans `vercel.json`:
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- X-XSS-Protection: 1; mode=block
- Strict-Transport-Security
- Content-Security-Policy

### 5.3 Redirections
Configurées dans `vercel.json`:
- Toutes les routes → index.html (SPA)

## Étape 6: Monitoring et Maintenance

### 6.1 Vérifier le déploiement
1. Aller sur le dashboard Vercel
2. Vérifier les logs de build
3. Tester l'URL de production

### 6.2 Rollback si nécessaire
1. Dans Vercel → Deployments
2. Sélectionner un déploiement précédent
3. Cliquer "Promote to Production"

### 6.3 Analytics (optionnel)
1. Dans Vercel → Analytics
2. Activer Vercel Analytics
3. Ajouter le script dans index.html

## Commandes Git Utiles

### Commandes de base
```bash
# Voir le statut
git status

# Ajouter tous les fichiers
git add .

# Commiter
git commit -m "Message"

# Pousser
git push origin main

# Voir l'historique
git log --oneline

# Créer une branche
git checkout -b feature/nouvelle-fonctionnalite

# Fusionner une branche
git checkout main
git merge feature/nouvelle-fonctionnalite
```

### Annuler des changements
```bash
# Annuler les modifications non commitées
git checkout -- fichier.txt

# Annuler le dernier commit (garder les changements)
git reset --soft HEAD~1

# Annuler le dernier commit (supprimer les changements)
git reset --hard HEAD~1
```

## Résolution de Problèmes

### Erreur: "remote origin already exists"
```bash
git remote remove origin
git remote add origin https://github.com/VOTRE_USERNAME/odin-la-science.git
```

### Erreur de build sur Vercel
1. Vérifier les logs dans Vercel
2. Tester localement: `npm run build`
3. Vérifier les dépendances dans package.json

### Erreur 404 sur les routes
Vérifier que `vercel.json` contient les redirections SPA

### Build trop lent
1. Optimiser les imports
2. Utiliser le code splitting
3. Réduire la taille des assets

## Checklist de Déploiement

- [ ] .gitignore configuré
- [ ] vercel.json créé
- [ ] Variables d'environnement configurées
- [ ] Build local réussi
- [ ] Dépôt GitHub créé
- [ ] Code poussé sur GitHub
- [ ] Projet importé dans Vercel
- [ ] Premier déploiement réussi
- [ ] URL de production testée
- [ ] Domaine personnalisé configuré (optionnel)
- [ ] Analytics activé (optionnel)

## URLs Importantes

- **GitHub**: https://github.com/VOTRE_USERNAME/odin-la-science
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Production**: https://odin-la-science.vercel.app
- **Documentation Vercel**: https://vercel.com/docs

## Support

- **Vercel Support**: https://vercel.com/support
- **GitHub Docs**: https://docs.github.com
- **Vite Docs**: https://vitejs.dev

---

**Note**: Remplacez `VOTRE_USERNAME` par votre nom d'utilisateur GitHub réel.
