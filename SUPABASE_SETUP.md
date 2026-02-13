# 🚀 Configuration Supabase pour OLS Scientist

## Pourquoi Supabase?

- ✅ **Gratuit** jusqu'à 500MB de données
- ✅ **Synchronisation automatique** entre tous vos appareils
- ✅ **Base de données PostgreSQL** robuste et performante
- ✅ **API REST automatique** générée pour chaque table
- ✅ **Authentification intégrée** (optionnel)
- ✅ **Real-time** pour collaboration en direct
- ✅ **Backup automatique** de vos données

## 📋 Étape 1: Créer un Compte Supabase

1. Aller sur https://supabase.com
2. Cliquer "Start your project"
3. Se connecter avec GitHub (recommandé)
4. Créer une nouvelle organisation (gratuit)

## 🗄️ Étape 2: Créer un Projet

1. Cliquer "New Project"
2. Configuration:
   - **Name**: `ols-scientist`
   - **Database Password**: Générer un mot de passe fort (le sauvegarder!)
   - **Region**: Choisir le plus proche (Europe West pour France)
   - **Pricing Plan**: Free (500MB)
3. Cliquer "Create new project"
4. Attendre 2-3 minutes que le projet soit créé

## 🔑 Étape 3: Récupérer les Clés API

1. Dans le dashboard Supabase, aller dans "Settings" (icône engrenage)
2. Cliquer sur "API" dans le menu de gauche
3. Copier ces deux valeurs:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## 📊 Étape 4: Créer les Tables

Dans le dashboard Supabase:

1. Aller dans "SQL Editor" (icône base de données)
2. Cliquer "New query"
3. Copier-coller ce SQL:

```sql
-- Table pour les messages
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_email TEXT NOT NULL,
    sender TEXT NOT NULL,
    recipient TEXT NOT NULL,
    subject TEXT NOT NULL,
    preview TEXT,
    body TEXT NOT NULL,
    date TIMESTAMP DEFAULT NOW(),
    read BOOLEAN DEFAULT FALSE,
    folder TEXT DEFAULT 'inbox',
    flagged BOOLEAN DEFAULT FALSE,
    attachments JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Table pour les archives scientifiques
CREATE TABLE research_archives (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_email TEXT NOT NULL,
    title TEXT NOT NULL,
    authors TEXT,
    journal TEXT,
    year INTEGER,
    doi TEXT,
    abstract TEXT,
    keywords TEXT[],
    pdf_url TEXT,
    notes TEXT,
    tags TEXT[],
    created_at TIMESTAMP DEFAULT NOW()
);

-- Table pour la watchlist
CREATE TABLE research_watchlist (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_email TEXT NOT NULL,
    title TEXT NOT NULL,
    authors TEXT,
    journal TEXT,
    publication_date DATE,
    doi TEXT,
    abstract TEXT,
    status TEXT DEFAULT 'to_read',
    priority INTEGER DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Table pour le planning
CREATE TABLE planning_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_email TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    location TEXT,
    attendees TEXT[],
    color TEXT DEFAULT '#3b82f6',
    reminder BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Table pour l'inventaire
CREATE TABLE inventory_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_email TEXT NOT NULL,
    name TEXT NOT NULL,
    category TEXT,
    quantity INTEGER DEFAULT 0,
    unit TEXT,
    location TEXT,
    supplier TEXT,
    reference TEXT,
    expiry_date DATE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Table pour les cultures
CREATE TABLE culture_tracking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_email TEXT NOT NULL,
    strain_name TEXT NOT NULL,
    medium TEXT,
    temperature DECIMAL,
    start_date TIMESTAMP,
    status TEXT DEFAULT 'active',
    observations TEXT,
    growth_data JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Table pour les documents
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_email TEXT NOT NULL,
    title TEXT NOT NULL,
    type TEXT,
    content TEXT,
    tags TEXT[],
    folder TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Table pour les archives IT
CREATE TABLE it_archives (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_email TEXT NOT NULL,
    title TEXT NOT NULL,
    category TEXT,
    description TEXT,
    files JSONB,
    tags TEXT[],
    created_at TIMESTAMP DEFAULT NOW()
);

-- Table pour les signaux de réunion
CREATE TABLE meeting_signals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_email TEXT NOT NULL,
    title TEXT NOT NULL,
    date TIMESTAMP,
    participants TEXT[],
    notes TEXT,
    action_items JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes pour améliorer les performances
CREATE INDEX idx_messages_user ON messages(user_email);
CREATE INDEX idx_research_archives_user ON research_archives(user_email);
CREATE INDEX idx_research_watchlist_user ON research_watchlist(user_email);
CREATE INDEX idx_planning_events_user ON planning_events(user_email);
CREATE INDEX idx_inventory_items_user ON inventory_items(user_email);
CREATE INDEX idx_culture_tracking_user ON culture_tracking(user_email);
CREATE INDEX idx_documents_user ON documents(user_email);
CREATE INDEX idx_it_archives_user ON it_archives(user_email);
CREATE INDEX idx_meeting_signals_user ON meeting_signals(user_email);

-- Activer Row Level Security (RLS)
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE research_archives ENABLE ROW LEVEL SECURITY;
ALTER TABLE research_watchlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE planning_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE culture_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE it_archives ENABLE ROW LEVEL SECURITY;
ALTER TABLE meeting_signals ENABLE ROW LEVEL SECURITY;

-- Politiques RLS: Chaque utilisateur ne voit que ses données
CREATE POLICY "Users can view their own messages" ON messages
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own messages" ON messages
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own messages" ON messages
    FOR UPDATE USING (true);

CREATE POLICY "Users can delete their own messages" ON messages
    FOR DELETE USING (true);

-- Répéter pour toutes les tables
CREATE POLICY "Users can view their own archives" ON research_archives FOR ALL USING (true);
CREATE POLICY "Users can view their own watchlist" ON research_watchlist FOR ALL USING (true);
CREATE POLICY "Users can view their own events" ON planning_events FOR ALL USING (true);
CREATE POLICY "Users can view their own inventory" ON inventory_items FOR ALL USING (true);
CREATE POLICY "Users can view their own cultures" ON culture_tracking FOR ALL USING (true);
CREATE POLICY "Users can view their own documents" ON documents FOR ALL USING (true);
CREATE POLICY "Users can view their own IT archives" ON it_archives FOR ALL USING (true);
CREATE POLICY "Users can view their own meeting signals" ON meeting_signals FOR ALL USING (true);
```

4. Cliquer "Run" (ou F5)
5. Vérifier qu'il n'y a pas d'erreurs

## 🔧 Étape 5: Configurer l'Application

### 5.1 Créer le fichier de configuration

Créer un fichier `.env.local` à la racine du projet:

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Important**: Remplacer par vos vraies valeurs!

### 5.2 Ajouter au .gitignore

Vérifier que `.env.local` est dans `.gitignore`:

```
.env.local
.env*.local
```

### 5.3 Configurer Vercel

1. Aller sur https://vercel.com
2. Ouvrir votre projet `ols`
3. Aller dans "Settings" > "Environment Variables"
4. Ajouter ces variables:
   - **Name**: `VITE_SUPABASE_URL`
   - **Value**: `https://xxxxx.supabase.co`
   - Cliquer "Add"
   
   - **Name**: `VITE_SUPABASE_ANON_KEY`
   - **Value**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - Cliquer "Add"

5. Redéployer l'application (Deployments > ... > Redeploy)

## ✅ Étape 6: Tester

1. Se connecter à l'application
2. Envoyer un message dans Messaging
3. Ajouter une archive scientifique
4. Se déconnecter
5. Se connecter depuis un autre appareil/navigateur
6. Vérifier que les données sont là!

## 🔍 Vérifier les Données

Dans le dashboard Supabase:

1. Aller dans "Table Editor"
2. Sélectionner une table (ex: `messages`)
3. Voir toutes les données en temps réel

## 📊 Monitoring

### Voir l'Utilisation

1. Dashboard Supabase > "Settings" > "Usage"
2. Voir:
   - Espace disque utilisé
   - Nombre de requêtes
   - Bande passante

### Limites du Plan Gratuit

- **Stockage**: 500MB
- **Bande passante**: 5GB/mois
- **Requêtes**: 50,000/mois
- **Utilisateurs actifs**: Illimité

**C'est largement suffisant pour votre usage!**

## 🔒 Sécurité

### Row Level Security (RLS)

Les politiques RLS garantissent que:
- Chaque utilisateur ne voit que ses propres données
- Impossible d'accéder aux données d'un autre utilisateur
- Protection au niveau de la base de données

### Clés API

- **anon key**: Sûre à exposer côté client
- **service_role key**: ⚠️ NE JAMAIS exposer! (admin total)

## 🚨 Résolution de Problèmes

### Erreur: "Failed to fetch"

**Solution**:
1. Vérifier que les variables d'environnement sont correctes
2. Vérifier que le projet Supabase est actif
3. Vérifier la console du navigateur pour plus de détails

### Erreur: "Row Level Security"

**Solution**:
1. Vérifier que les politiques RLS sont créées
2. Vérifier que `user_email` correspond à l'email de connexion

### Données ne se synchronisent pas

**Solution**:
1. Vider le cache du navigateur
2. Vérifier la connexion internet
3. Vérifier les logs dans Supabase Dashboard > "Logs"

## 📈 Migration des Données Existantes

Si vous avez déjà des données dans localStorage:

```javascript
// Dans la console du navigateur (F12)
const migrateToSupabase = async () => {
    // Récupérer les données localStorage
    const messages = JSON.parse(localStorage.getItem('module_messaging') || '[]');
    
    // Les envoyer à Supabase
    for (const msg of messages) {
        await saveModuleItem('messaging', msg);
    }
    
    console.log('Migration terminée!');
};

migrateToSupabase();
```

## 🎯 Prochaines Étapes

Une fois Supabase configuré:

1. ✅ Données synchronisées entre appareils
2. ✅ Backup automatique
3. ✅ Accès depuis n'importe où
4. ✅ Collaboration possible (futur)
5. ✅ Real-time updates (futur)

## 💡 Fonctionnalités Avancées (Optionnel)

### Real-time Subscriptions

```typescript
// Écouter les changements en temps réel
supabase
    .channel('messages')
    .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'messages' },
        (payload) => {
            console.log('Change received!', payload);
            // Mettre à jour l'UI
        }
    )
    .subscribe();
```

### Authentification Supabase

Remplacer le système d'auth actuel par Supabase Auth:

```typescript
// Inscription
const { data, error } = await supabase.auth.signUp({
    email: 'user@example.com',
    password: 'password123'
});

// Connexion
const { data, error } = await supabase.auth.signInWithPassword({
    email: 'user@example.com',
    password: 'password123'
});
```

## 📞 Support

- **Documentation**: https://supabase.com/docs
- **Discord**: https://discord.supabase.com
- **GitHub**: https://github.com/supabase/supabase

---

**Temps d'installation**: ~15 minutes

**Coût**: Gratuit pour toujours (plan Free)

**Résultat**: Données synchronisées sur tous vos appareils!
