# 📝 Étapes de Déploiement - À Suivre

## ✅ Étape 1: Git Installé
**Status**: ✅ TERMINÉ

Vous avez installé Git. Maintenant:
1. **Fermez** votre terminal PowerShell actuel
2. **Rouvrez** un nouveau terminal PowerShell
3. Naviguez vers le dossier du projet:
   ```powershell
   cd "C:\Users\fcb1909-user\Desktop\test antigravity"
   ```

## 🔄 Étape 2: Vérifier Git

Dans le nouveau terminal, tapez:
```powershell
git --version
```

Vous devriez voir quelque chose comme:
```
git version 2.43.0.windows.1
```

Si ça ne marche toujours pas:
- Redémarrez complètement votre ordinateur
- Ou ajoutez Git au PATH manuellement

## 📦 Étape 3: Initialiser Git

Une fois que `git --version` fonctionne:

```powershell
# Initialiser le repository
git init

# Configurer votre identité (remplacer par vos infos)
git config --global user.name "Votre Nom"
git config --global user.email "votre.email@example.com"

# Ajouter tous les fichiers
git add .

# Créer le premier commit
git commit -m "Initial commit - OLS Scientist Platform"
```

## 🌐 Étape 4: Créer Repository GitHub

1. Aller sur https://github.com
2. Se connecter (ou créer un compte si nécessaire)
3. Cliquer sur le bouton **"+"** en haut à droite
4. Sélectionner **"New repository"**
5. Remplir:
   - **Repository name**: `ols-scientist-platform`
   - **Description**: "Plateforme scientifique OLS avec Munin Atlas et Hugin Lab"
   - **Visibility**: Choisir **Private** (recommandé)
   - **NE PAS** cocher "Initialize this repository with a README"
6. Cliquer **"Create repository"**

## 🔗 Étape 5: Connecter au Repository

GitHub vous montrera des commandes. Copier et exécuter:

```powershell
# Remplacer VOTRE_USERNAME par votre nom d'utilisateur GitHub
git remote add origin https://github.com/VOTRE_USERNAME/ols-scientist-platform.git

# Renommer la branche en main
git branch -M main

# Pousser le code
git push -u origin main
```

**Note**: Si demandé, entrez vos identifiants GitHub.

## 🚀 Étape 6: Créer Compte Vercel

1. Aller sur https://vercel.com
2. Cliquer **"Sign Up"**
3. Choisir **"Continue with GitHub"**
4. Autoriser Vercel à accéder à GitHub
5. Confirmer votre email si demandé

## 📤 Étape 7: Importer le Projet

1. Sur le dashboard Vercel, cliquer **"Add New..."** (en haut à droite)
2. Sélectionner **"Project"**
3. Vous verrez la liste de vos repositories GitHub
4. Trouver **"ols-scientist-platform"**
5. Cliquer **"Import"**

## ⚙️ Étape 8: Configurer le Projet

Vercel détecte automatiquement Vite. Vérifier que ces paramètres sont corrects:

```
Framework Preset: Vite
Root Directory: ./
Build Command: npm run build
Output Directory: dist
Install Command: npm install
Node.js Version: 18.x
```

**Ne rien modifier!** Ces valeurs sont déjà correctes.

## 🎯 Étape 9: Déployer

1. Cliquer le bouton bleu **"Deploy"**
2. Attendre 2-3 minutes pendant le build
3. Vous verrez des logs défiler
4. À la fin: **"Congratulations!"** 🎉

## ✅ Étape 10: Tester

1. Cliquer sur l'URL fournie (ex: `https://ols-scientist-platform.vercel.app`)
2. Vous devriez voir la page d'accueil OLS Scientist
3. Tester la connexion avec: `ethan@OLS.com` / `ethan123`
4. Explorer Munin Atlas et Hugin Lab

## 📱 Étape 11: Tester sur Mobile

1. Ouvrir l'URL sur votre smartphone
2. La version mobile devrait s'afficher automatiquement
3. Tester la navigation et les modules

## 🎉 Terminé!

Votre application est maintenant en ligne et accessible partout!

## 🔄 Pour Faire des Mises à Jour

Chaque fois que vous modifiez le code:

```powershell
# Voir les fichiers modifiés
git status

# Ajouter les changements
git add .

# Créer un commit
git commit -m "Description de vos changements"

# Pousser sur GitHub
git push

# Vercel redéploie automatiquement!
```

## 🆘 Problèmes Courants

### Git n'est pas reconnu
**Solution**: Redémarrer le terminal ou l'ordinateur

### Push refusé
**Solution**: Vérifier que le repository GitHub est créé

### Build failed sur Vercel
**Solution**: 
```powershell
npm run build
# Corriger les erreurs affichées
```

### Page blanche après déploiement
**Solution**: 
- Vérifier la console du navigateur (F12)
- Vérifier que `vercel.json` existe
- Attendre quelques minutes et rafraîchir

## 📞 Besoin d'Aide?

- Consulter [DEPLOIEMENT_VERCEL.md](./DEPLOIEMENT_VERCEL.md) pour plus de détails
- Ouvrir une issue sur GitHub
- Consulter la documentation Vercel: https://vercel.com/docs

---

**Prochaine étape**: Redémarrer le terminal et exécuter `git --version`

**Temps restant**: ~8 minutes

**Vous êtes à**: 10% du déploiement
