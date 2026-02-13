-- Script SQL pour créer les tables Supabase
-- À exécuter dans: Dashboard Supabase > SQL Editor > New query

-- Table pour les messages
CREATE TABLE IF NOT EXISTS messages (
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
CREATE TABLE IF NOT EXISTS research_archives (
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
CREATE TABLE IF NOT EXISTS research_watchlist (
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
CREATE TABLE IF NOT EXISTS planning_events (
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
CREATE TABLE IF NOT EXISTS inventory_items (
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
CREATE TABLE IF NOT EXISTS culture_tracking (
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
CREATE TABLE IF NOT EXISTS documents (
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
CREATE TABLE IF NOT EXISTS it_archives (
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
CREATE TABLE IF NOT EXISTS meeting_signals (
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
CREATE INDEX IF NOT EXISTS idx_messages_user ON messages(user_email);
CREATE INDEX IF NOT EXISTS idx_messages_date ON messages(date DESC);
CREATE INDEX IF NOT EXISTS idx_research_archives_user ON research_archives(user_email);
CREATE INDEX IF NOT EXISTS idx_research_watchlist_user ON research_watchlist(user_email);
CREATE INDEX IF NOT EXISTS idx_planning_events_user ON planning_events(user_email);
CREATE INDEX IF NOT EXISTS idx_planning_events_date ON planning_events(start_date);
CREATE INDEX IF NOT EXISTS idx_inventory_items_user ON inventory_items(user_email);
CREATE INDEX IF NOT EXISTS idx_culture_tracking_user ON culture_tracking(user_email);
CREATE INDEX IF NOT EXISTS idx_documents_user ON documents(user_email);
CREATE INDEX IF NOT EXISTS idx_it_archives_user ON it_archives(user_email);
CREATE INDEX IF NOT EXISTS idx_meeting_signals_user ON meeting_signals(user_email);

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

-- Politiques RLS: Permettre toutes les opérations (simplifié pour démarrage rapide)
-- Note: En production, vous devriez filtrer par user_email

-- Messages
DROP POLICY IF EXISTS "Enable all for messages" ON messages;
CREATE POLICY "Enable all for messages" ON messages FOR ALL USING (true) WITH CHECK (true);

-- Research Archives
DROP POLICY IF EXISTS "Enable all for research_archives" ON research_archives;
CREATE POLICY "Enable all for research_archives" ON research_archives FOR ALL USING (true) WITH CHECK (true);

-- Research Watchlist
DROP POLICY IF EXISTS "Enable all for research_watchlist" ON research_watchlist;
CREATE POLICY "Enable all for research_watchlist" ON research_watchlist FOR ALL USING (true) WITH CHECK (true);

-- Planning Events
DROP POLICY IF EXISTS "Enable all for planning_events" ON planning_events;
CREATE POLICY "Enable all for planning_events" ON planning_events FOR ALL USING (true) WITH CHECK (true);

-- Inventory Items
DROP POLICY IF EXISTS "Enable all for inventory_items" ON inventory_items;
CREATE POLICY "Enable all for inventory_items" ON inventory_items FOR ALL USING (true) WITH CHECK (true);

-- Culture Tracking
DROP POLICY IF EXISTS "Enable all for culture_tracking" ON culture_tracking;
CREATE POLICY "Enable all for culture_tracking" ON culture_tracking FOR ALL USING (true) WITH CHECK (true);

-- Documents
DROP POLICY IF EXISTS "Enable all for documents" ON documents;
CREATE POLICY "Enable all for documents" ON documents FOR ALL USING (true) WITH CHECK (true);

-- IT Archives
DROP POLICY IF EXISTS "Enable all for it_archives" ON it_archives;
CREATE POLICY "Enable all for it_archives" ON it_archives FOR ALL USING (true) WITH CHECK (true);

-- Meeting Signals
DROP POLICY IF EXISTS "Enable all for meeting_signals" ON meeting_signals;
CREATE POLICY "Enable all for meeting_signals" ON meeting_signals FOR ALL USING (true) WITH CHECK (true);

-- Message de confirmation
SELECT 'Tables créées avec succès!' as status;
