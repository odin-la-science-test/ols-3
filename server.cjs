const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const { getDB, run, all, get, initDBs } = require('./db_manager.cjs');

const app = express();
const PORT = 3001;
const DB_FILE = path.join(__dirname, 'db.json');

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Initialize SQLite databases and migrate data if needed
const setup = async () => {
    await initDBs();

    // Migration from db.json if it exists
    if (fs.existsSync(DB_FILE)) {
        console.log('Found legacy db.json, migrating data...');
        try {
            const legacyData = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));

            const migrateToGeneric = async (moduleName, items) => {
                if (!items || items.length === 0) return;
                const db = getDB(moduleName);
                await run(db, `CREATE TABLE IF NOT EXISTS data (id TEXT PRIMARY KEY, payload TEXT, timestamp TEXT)`);
                for (const item of items) {
                    const id = String(item.id || item.nom || Date.now() + Math.random());
                    await run(db, 'INSERT OR REPLACE INTO data (id, payload, timestamp) VALUES (?, ?, ?)', [id, JSON.stringify(item), new Date().toISOString()]);
                }
                console.log(`Migrated ${items.length} items from db.json to ${moduleName}.`);
            };

            await migrateToGeneric('messaging', legacyData.messages);
            await migrateToGeneric('planning', legacyData.planning);
            await migrateToGeneric('hugin_it_archives', legacyData.archives || legacyData.hugin_it_archives);
            await migrateToGeneric('cultures', legacyData.cultures);
            await migrateToGeneric('milieux', legacyData.milieux);

            // Rename legacy file to avoid repeated migration
            fs.renameSync(DB_FILE, path.join(__dirname, 'db.json.bak'));
            console.log('Migration complete. db.json moved to db.json.bak');
        } catch (e) {
            console.error('Migration failed:', e);
        }
    }

    // Internal migration from specific tables to generic 'data' table
    const internalMigrations = [
        { module: 'messaging', table: 'messages', idField: 'id' },
        { module: 'planning', table: 'events', idField: 'id' },
        { module: 'inventory', table: 'items', idField: 'id' },
        { module: 'archives', table: 'archives', idField: 'id' },
        { module: 'cultures', table: 'cultures', idField: 'id' },
        { module: 'milieux', table: 'milieux', idField: 'id' }
    ];

    for (const mig of internalMigrations) {
        try {
            const db = getDB(mig.module);
            // Check if source table exists
            const tableExists = await get(db, "SELECT name FROM sqlite_master WHERE type='table' AND name=?", [mig.table]);
            if (tableExists) {
                console.log(`Checking internal migration for ${mig.module}:${mig.table}...`);
                await run(db, `CREATE TABLE IF NOT EXISTS data (id TEXT PRIMARY KEY, payload TEXT, timestamp TEXT)`);
                const rows = await all(db, `SELECT * FROM ${mig.table}`);
                if (rows.length > 0) {
                    for (const row of rows) {
                        const id = String(row[mig.idField] || Date.now() + Math.random());
                        // If it's a legacy row, payload might be the whole row
                        const payload = JSON.stringify(row);
                        await run(db, 'INSERT OR REPLACE INTO data (id, payload, timestamp) VALUES (?, ?, ?)', [id, payload, new Date().toISOString()]);
                    }
                    console.log(`Internally migrated ${rows.length} items from ${mig.table} to data in ${mig.module}.`);
                    // Optionally drop the old table
                    await run(db, `DROP TABLE ${mig.table}`);
                }
            }
        } catch (e) {
            console.error(`Internal migration failed for ${mig.module}:`, e.message);
        }
    }
};

process.on('unhandledRejection', (reason, p) => {
    console.error('Unhandled Rejection at: Promise', p, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception thrown:', err);
});

setup().then(() => {
    console.log('Setup completed successfully.');
}).catch(err => {
    console.error('Setup failed:', err);
});

// API ROUTES
app.get('/api/status', (req, res) => {
    res.json({ status: 'running', timestamp: new Date().toISOString() });
});

// Most routes are now handled by the generic /api/module/:moduleName endpoint

// Generic Module Endpoint
app.get('/api/module/:moduleName', async (req, res) => {
    const { moduleName } = req.params;
    try {
        const db = getDB(moduleName);
        await run(db, `CREATE TABLE IF NOT EXISTS data (id TEXT PRIMARY KEY, payload TEXT, timestamp TEXT)`);
        const rows = await all(db, 'SELECT * FROM data ORDER BY timestamp DESC');
        res.json(rows.map(r => JSON.parse(r.payload)));
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.post('/api/module/:moduleName', async (req, res) => {
    const { moduleName } = req.params;
    const item = req.body;
    try {
        const db = getDB(moduleName);
        await run(db, `CREATE TABLE IF NOT EXISTS data (id TEXT PRIMARY KEY, payload TEXT, timestamp TEXT)`);
        const payload = JSON.stringify(item);
        await run(db, 'INSERT OR REPLACE INTO data (id, payload, timestamp) VALUES (?, ?, ?)', [String(item.id), payload, new Date().toISOString()]);
        res.status(201).json(item);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.put('/api/module/:moduleName/:id', async (req, res) => {
    const { moduleName, id } = req.params;
    const item = req.body;
    try {
        const db = getDB(moduleName);
        const payload = JSON.stringify(item);
        await run(db, 'UPDATE data SET payload = ?, timestamp = ? WHERE id = ?', [payload, new Date().toISOString(), id]);
        res.json(item);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.delete('/api/module/:moduleName/:id', async (req, res) => {
    const { moduleName, id } = req.params;
    try {
        const db = getDB(moduleName);
        await run(db, 'DELETE FROM data WHERE id = ?', [id]);
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
});
