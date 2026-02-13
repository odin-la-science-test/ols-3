# 🔄 Synchronisation des Données - Guide Complet

## 🎯 Objectif

Avoir accès à vos données (messages, archives scientifiques, planning, etc.) depuis n'importe quel appareil, n'importe où dans le monde.

## 📊 Système Actuel

### Avant (localStorage uniquement)
- ❌ Données locales au navigateur
- ❌ Pas de synchronisation entre appareils
- ❌ Données perdues si cache vidé

### Maintenant (Système Hybride Intelligent)
- ✅ **Priorité 1**: Supabase (si configuré) → Synchronisation cloud
- ✅ **Priorité 2**: Backend server (si disponible) → SQLite local
- ✅ **Priorité 3**: localStorage → Fallback toujours fonctionnel

## 🚀 Configuration Supabase (Recommandé)

### Pourquoi Supabase?

- **Gratuit**: 500MB de données
- **Rapide**: Base de données PostgreSQL performante
- **Sécurisé**: Chiffrement et authentification intégrés
- **Synchronisé**: Accès depuis tous vos appareils
- **Backup**: Sauvegarde automatique de vos données

### Installation en 5 Minutes

Suivre le guide: **`QUICK_START_SUPABASE.md`**

Ou le guide complet: **`SUPABASE_SETUP.md`**

### Résumé des Étapes

1. **Créer un compte** sur https://supabase.com (gratuit)
2. **Créer un projet** (2 minutes d'attente)
3. **Créer les tables** (copier-coller le SQL)
4. **Configurer l'app** (ajouter 2 variables d'environnement)
5. **C'est tout!** Vos données sont synchronisées

## 🔧 Configuration

### En Local (Développement)

Créer un fichier `.env.local` à la racine du projet:

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Redémarrer le serveur:
```bash
npm run dev
```

### Sur Vercel (Production)

1. Aller sur https://vercel.com
2. Ouvrir votre projet `ols`
3. Settings > Environment Variables
4. Ajouter:
   - `VITE_SUPABASE_URL` = `https://xxxxx.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
5. Deployments > ... > Redeploy

## 📦 Modules Synchronisés

Une fois Supabase configuré, ces modules seront synchronisés:

### ✅ Actuellement Supportés
- **Messaging** - Messages et conversations
- **ScientificResearch** - Archives de revues scientifiques
- **ScientificResearch** - Watchlist de publications
- **Planning** - Événements et rendez-vous
- **Inventory** - Inventaire de laboratoire
- **CultureTracking** - Suivi des cultures
- **Documents** - Gestion documentaire
- **ITArchive** - Archives informatiques
- **Meetings** - Signaux de réunion

### 🔜 À Venir
- LabNotebook
- StockManager
- CryoKeeper
- EquipFlow
- GrantBudget
- SOPLibrary
- Bibliography
- ProjectMind

## 🔍 Vérifier le Mode Actif

Ouvrir la console du navigateur (F12) et regarder les messages:

```
Using Supabase for: messaging
→ Mode Supabase actif ✅

Using localStorage fallback for: messaging
→ Mode localStorage actif (Supabase non configuré)
```

## 🧪 Tester la Synchronisation

### Test Simple

1. **Sur PC**: Se connecter et envoyer un message
2. **Sur téléphone**: Se connecter avec le même compte
3. **Vérifier**: Le message apparaît sur le téléphone!

### Test Avancé

1. **Appareil 1**: Créer une archive scientifique
2. **Appareil 2**: Voir l'archive apparaître
3. **Appareil 1**: Modifier l'archive
4. **Appareil 2**: Voir la modification
5. **Appareil 2**: Supprimer l'archive
6. **Appareil 1**: Voir la suppression

## 🔐 Sécurité des Données

### Isolation par Utilisateur

Chaque utilisateur ne voit que ses propres données grâce à:

1. **Row Level Security (RLS)** dans Supabase
2. **Filtrage par email** dans toutes les requêtes
3. **Politiques de sécurité** au niveau de la base de données

### Exemple

```sql
-- Politique RLS: Chaque utilisateur ne voit que ses données
CREATE POLICY "Users can view their own messages" ON messages
    FOR SELECT USING (user_email = current_user_email());
```

### Clés API

- **anon key**: Sûre à exposer côté client (lecture/écriture limitée)
- **service_role key**: ⚠️ NE JAMAIS exposer (accès admin total)

## 📊 Monitoring

### Voir l'Utilisation Supabase

1. Dashboard Supabase > Settings > Usage
2. Voir:
   - Espace disque utilisé
   - Nombre de requêtes
   - Bande passante

### Limites du Plan Gratuit

- **Stockage**: 500MB (largement suffisant)
- **Bande passante**: 5GB/mois
- **Requêtes**: 50,000/mois
- **Utilisateurs**: Illimité

### Voir les Données en Temps Réel

1. Dashboard Supabase > Table Editor
2. Sélectionner une table (ex: `messages`)
3. Voir toutes les données
4. Modifier/Supprimer directement si besoin

## 🔄 Migration des Données Existantes

Si vous avez déjà des données dans localStorage:

### Option 1: Migration Manuelle (Console)

```javascript
// Dans la console du navigateur (F12)
const migrateModule = async (moduleName) => {
    const data = JSON.parse(localStorage.getItem(`module_${moduleName}`) || '[]');
    
    for (const item of data) {
        await saveModuleItem(moduleName, item);
    }
    
    console.log(`Migration de ${moduleName} terminée!`);
};

// Migrer tous les modules
await migrateModule('messaging');
await migrateModule('research_archives');
await migrateModule('research_watchlist');
await migrateModule('planning');
```

### Option 2: Migration Automatique (Future)

Un bouton "Migrer vers le cloud" sera ajouté dans les paramètres.

## 🚨 Résolution de Problèmes

### Problème: "Failed to fetch"

**Causes possibles**:
- Variables d'environnement incorrectes
- Projet Supabase inactif
- Problème de réseau

**Solutions**:
1. Vérifier `.env.local` (en local)
2. Vérifier les variables Vercel (en production)
3. Vérifier que le projet Supabase est actif
4. Vérifier la console pour plus de détails

### Problème: Données ne se synchronisent pas

**Solutions**:
1. Vider le cache du navigateur
2. Se déconnecter et se reconnecter
3. Vérifier la console (F12) pour les erreurs
4. Vérifier les logs Supabase (Dashboard > Logs)

### Problème: "Row Level Security"

**Cause**: Les politiques RLS bloquent l'accès

**Solution**:
1. Vérifier que les politiques RLS sont créées (voir SQL)
2. Vérifier que `user_email` correspond à l'email de connexion
3. Temporairement désactiver RLS pour tester:
   ```sql
   ALTER TABLE messages DISABLE ROW LEVEL SECURITY;
   ```

### Problème: Données dupliquées

**Cause**: Migration multiple ou conflit localStorage/Supabase

**Solution**:
1. Aller dans Supabase > Table Editor
2. Supprimer les doublons manuellement
3. Vider localStorage:
   ```javascript
   localStorage.clear();
   ```

## 📈 Évolution Future

### Phase 1: Synchronisation de Base (Actuel)
- ✅ Supabase intégré
- ✅ Fallback localStorage
- ✅ Modules principaux supportés

### Phase 2: Real-time (Futur)
- 🔜 Mises à jour en temps réel
- 🔜 Collaboration multi-utilisateurs
- 🔜 Notifications de changements

### Phase 3: Authentification Supabase (Futur)
- 🔜 Remplacer le système d'auth actuel
- 🔜 Gestion des rôles avancée
- 🔜 OAuth (Google, GitHub, etc.)

### Phase 4: Fonctionnalités Avancées (Futur)
- 🔜 Partage de données entre utilisateurs
- 🔜 Export/Import de données
- 🔜 Historique des modifications
- 🔜 Backup manuel

## 💡 Conseils

### Pour un Usage Optimal

1. **Configurer Supabase dès maintenant** (5 minutes)
2. **Tester sur plusieurs appareils** pour vérifier
3. **Sauvegarder les clés API** dans un gestionnaire de mots de passe
4. **Monitorer l'usage** régulièrement (Dashboard Supabase)

### Pour le Développement

1. **Utiliser .env.local** pour les clés de développement
2. **Ne jamais commiter** les clés dans Git
3. **Utiliser des projets Supabase séparés** (dev/prod)

### Pour la Production

1. **Configurer les variables Vercel** correctement
2. **Activer RLS** pour la sécurité
3. **Monitorer les logs** régulièrement
4. **Faire des backups** périodiques

## 📞 Support

### Documentation
- **Supabase**: https://supabase.com/docs
- **Guide rapide**: `QUICK_START_SUPABASE.md`
- **Guide complet**: `SUPABASE_SETUP.md`

### Communauté
- **Discord Supabase**: https://discord.supabase.com
- **GitHub**: https://github.com/supabase/supabase

### Aide Directe
- Ouvrir la console (F12) et copier les erreurs
- Vérifier les logs Supabase
- Tester en navigation privée

---

## ✅ Checklist de Configuration

- [ ] Compte Supabase créé
- [ ] Projet créé et actif
- [ ] Tables créées (SQL exécuté)
- [ ] Clés API récupérées
- [ ] `.env.local` créé (en local)
- [ ] Variables Vercel configurées (en production)
- [ ] Application redémarrée/redéployée
- [ ] Test de synchronisation réussi
- [ ] Données visibles dans Table Editor
- [ ] Accès depuis plusieurs appareils testé

---

**Temps total**: 5-10 minutes

**Coût**: Gratuit pour toujours

**Résultat**: Données synchronisées partout, tout le temps!
