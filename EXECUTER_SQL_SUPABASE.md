# 📊 Créer les Tables Supabase

## Étape 1: Ouvrir le SQL Editor

1. Aller sur https://supabase.com
2. Se connecter
3. Ouvrir votre projet **ols-scientist**
4. Cliquer sur **SQL Editor** (icône 📊 dans le menu de gauche)

## Étape 2: Créer une Nouvelle Query

1. Cliquer sur **New query** (bouton en haut à droite)
2. Une fenêtre d'édition SQL s'ouvre

## Étape 3: Copier le SQL

1. Ouvrir le fichier `supabase_tables.sql` dans votre projet
2. **Tout sélectionner** (Ctrl+A)
3. **Copier** (Ctrl+C)

## Étape 4: Coller et Exécuter

1. Dans le SQL Editor de Supabase
2. **Coller** le SQL (Ctrl+V)
3. Cliquer sur **Run** (ou appuyer sur F5)
4. Attendre quelques secondes

## ✅ Vérification

Vous devriez voir en bas:
```
Success. No rows returned
```

Ou:
```
status: "Tables créées avec succès!"
```

## 📊 Voir les Tables

1. Cliquer sur **Table Editor** (icône 📋 dans le menu de gauche)
2. Vous devriez voir toutes les tables:
   - messages
   - research_archives
   - research_watchlist
   - planning_events
   - inventory_items
   - culture_tracking
   - documents
   - it_archives
   - meeting_signals

## 🚨 En Cas d'Erreur

### Erreur: "relation already exists"

**Solution**: Les tables existent déjà, c'est bon!

### Erreur: "permission denied"

**Solution**: 
1. Vérifier que vous êtes bien connecté
2. Vérifier que c'est le bon projet
3. Réessayer

### Erreur: "syntax error"

**Solution**:
1. Vérifier que tout le SQL a été copié
2. Vérifier qu'il n'y a pas de caractères bizarres
3. Réessayer

## 🎉 Terminé!

Les tables sont créées. Vous pouvez maintenant:

1. **Tester localement**: `npm run dev`
2. **Configurer Vercel**: Voir `CONFIGURATION_VERCEL_SUPABASE.md`
3. **Utiliser l'application**: Les données seront synchronisées!

---

**Prochaine étape**: Configurer Vercel avec les variables d'environnement
