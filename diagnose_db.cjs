const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const DB_DIR = path.join(__dirname, 'databases');

async function checkDB(name) {
    const dbPath = path.join(DB_DIR, `${name}.sqlite`);
    if (!fs.existsSync(dbPath)) {
        console.log(`${name}: DB file not found at ${dbPath}`);
        return;
    }
    const db = new sqlite3.Database(dbPath);
    return new Promise((resolve) => {
        db.all("SELECT name FROM sqlite_master WHERE type='table'", (err, tables) => {
            if (err) {
                console.log(`${name}: Error listing tables:`, err.message);
                db.close();
                resolve();
            } else {
                console.log(`${name}: Tables:`, tables.map(t => t.name).join(', '));
                if (tables.some(t => t.name === 'data')) {
                    db.get("SELECT count(*) as count FROM data", (err, row) => {
                        console.log(`${name}: Data count:`, row ? row.count : 'error');
                        db.all("PRAGMA table_info(data)", (err, info) => {
                            console.log(`${name}: Data schema:`, info ? info.map(i => `${i.name} ${i.type}`).join(', ') : 'error');
                            db.close();
                            resolve();
                        });
                    });
                } else {
                    db.close();
                    resolve();
                }
            }
        });
    });
}

async function run() {
    console.log('--- Database Diagnostics ---');
    const dbs = ['messaging', 'planning', 'cultures', 'milieux', 'hugin_spreadsheets', 'hugin_it_archives'];
    for (const db of dbs) {
        await checkDB(db);
    }
    console.log('--- End Diagnostics ---');
}
run();
