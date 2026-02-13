# 🔧 Configuration Vercel avec Supabase

## ✅ Configuration Locale (Déjà Fait)

Le fichier `.env.local` a été créé avec vos clés Supabase.

## 🌐 Configuration Vercel (À Faire)

### Étape 1: Aller sur Vercel

1. Ouvrir https://vercel.com
2. Se connecter
3. Cliquer sur votre projet **ols**

### Étape 2: Ajouter les Variables d'Environnement

1. Cliquer sur **Settings** (en haut)
2. Cliquer sur **Environment Variables** (menu de gauche)
3. Ajouter la première variable:
   - **Name**: `VITE_SUPABASE_URL`
   - **Value**: `https://qogcbwndxorhcabyshne.supabase.co`
   - **Environments**: Cocher **Production**, **Preview**, et **Development**
   - Cliquer **Save**

4. Ajouter la deuxième variable:
   - **Name**: `VITE_SUPABASE_ANON_KEY`
   - **Value**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFvZ2Nid25keG9yaGNhYnlzaG5lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA5Nzk3NzYsImV4cCI6MjA4NjU1NTc3Nn0.DL4KdRwwE61sBinCCiHUmhZLa1NPa6irPTWAb3_84-w`
   - **Environments**: Cocher **Production**, **Preview**, et **Development**
   - Cliquer **Save**

### Étape 3: Redéployer

1. Aller dans **Deployments** (en haut)
2. Cliquer sur les **...** (trois points) du dernier déploiement
3. Cliquer **Redeploy**
4. Confirmer
5. Attendre 2-3 minutes

## ✅ Vérification

Une fois le redéploiement terminé:

1. Ouvrir votre site Vercel
2. Se connecter
3. Aller dans Messaging
4. Envoyer un message
5. Ouvrir la console (F12)
6. Vous devriez voir: `Using Supabase for: messaging`

## 🎉 C'est Tout!

Vos données sont maintenant synchronisées entre tous vos appareils!

## 🧪 Test de Synchronisation

1. **Sur PC**: Envoyer un message
2. **Sur téléphone**: Se connecter avec le même compte
3. **Vérifier**: Le message apparaît!

## 📊 Voir les Données

1. Aller sur https://supabase.com
2. Ouvrir votre projet
3. Cliquer sur **Table Editor**
4. Sélectionner la table **messages**
5. Voir vos données en temps réel!

---

**Note**: Les variables d'environnement ne sont appliquées qu'après un redéploiement.
