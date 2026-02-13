# ⚡ Quick Start - Déploiement Vercel

Guide ultra-rapide pour déployer OLS Scientist sur Vercel en 10 minutes.

## 🎯 Objectif

Avoir votre application accessible sur Internet avec une URL type:
```
https://ols-scientist-platform.vercel.app
```

## 📝 Étapes Rapides

### 1️⃣ Installer Git (2 min)

**Windows**:
1. Télécharger: https://git-scm.com/download/win
2. Installer avec options par défaut
3. Redémarrer le terminal

**Vérifier**:
```bash
git --version
```

### 2️⃣ Créer un Compte GitHub (2 min)

1. Aller sur https://github.com
2. Cliquer "Sign up"
3. Créer un compte gratuit

### 3️⃣ Pousser le Code sur GitHub (3 min)

Ouvrir un terminal dans le dossier du projet:

```bash
# Initialiser Git
git init

# Ajouter tous les fichiers
git add .

# Créer le premier commit
git commit -m "Initial commit"

# Créer un repository sur GitHub (via l'interface web)
# Puis connecter et pousser:
git remote add origin https://github.com/VOTRE_USERNAME/ols-scientist-platform.git
git branch -M main
git push -u origin main
```

### 4️⃣ Déployer sur Vercel (3 min)

1. Aller sur https://vercel.com
2. Cliquer "Sign Up" > "Continue with GitHub"
3. Cliquer "Add New..." > "Project"
4. Sélectionner `ols-scientist-platform`
5. Cliquer "Deploy"
6. Attendre 2-3 minutes
7. ✅ C'est en ligne!

## 🎉 Terminé!

Votre application est maintenant accessible à l'URL:
```
https://ols-scientist-platform.vercel.app
```

## 📱 Tester

### Sur PC
Ouvrir l'URL dans Chrome/Firefox/Edge

### Sur Mobile
Ouvrir l'URL sur votre smartphone

### Se Connecter
Utiliser: `ethan@OLS.com` / `ethan123`

## 🔄 Faire des Mises à Jour

```bash
# Modifier le code
# Puis:
git add .
git commit -m "Mes modifications"
git push

# Vercel redéploie automatiquement!
```

## ❓ Problèmes?

### Git n'est pas reconnu
→ Redémarrer le terminal après installation

### Push refusé
→ Vérifier que le repository GitHub est créé

### Build failed sur Vercel
→ Tester `npm run build` localement d'abord

## 📚 Documentation Complète

Pour plus de détails, voir [DEPLOIEMENT_VERCEL.md](./DEPLOIEMENT_VERCEL.md)

---

**Temps total**: ~10 minutes  
**Coût**: Gratuit  
**Résultat**: Application accessible 24/7 partout dans le monde
