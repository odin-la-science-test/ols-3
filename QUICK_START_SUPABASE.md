# 🚀 Démarrage Rapide Supabase (5 minutes)

## Étape 1: Créer un Compte (1 min)

1. Aller sur https://supabase.com
2. Cliquer "Start your project"
3. Se connecter avec GitHub

## Étape 2: Créer un Projet (2 min)

1. Cliquer "New Project"
2. Remplir:
   - Name: `ols-scientist`
   - Password: Générer un mot de passe (le sauvegarder!)
   - Region: Europe West
3. Cliquer "Create new project"
4. Attendre 2 minutes

## Étape 3: Créer les Tables (1 min)

1. Aller dans "SQL Editor"
2. Copier-coller le SQL depuis `SUPABASE_SETUP.md` (section "Étape 4")
3. Cliquer "Run"

## Étape 4: Configurer l'Application (1 min)

### En Local

Créer `.env.local` à la racine:

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Trouver ces valeurs dans: Settings > API

Redémarrer le serveur:
```bash
npm run dev
```

### Sur Vercel

1. Aller sur https://vercel.com
2. Ouvrir votre projet
3. Settings > Environment Variables
4. Ajouter:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Redéployer

## ✅ C'est Tout!

Vos données sont maintenant synchronisées entre tous vos appareils!

## 🧪 Tester

1. Se connecter à l'application
2. Envoyer un message
3. Ouvrir depuis un autre appareil
4. Le message est là!

## 📊 Voir les Données

Dashboard Supabase > Table Editor > messages

---

**Besoin d'aide?** Voir `SUPABASE_SETUP.md` pour le guide complet.
