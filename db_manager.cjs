const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const DB_DIR = path.join(__dirname, 'databases');
if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR);
}

const connections = {};

const getDB = (moduleName) => {
    if (connections[moduleName]) return connections[moduleName];

    const dbPath = path.join(DB_DIR, `${moduleName}.sqlite`);
    const db = new sqlite3.Database(dbPath);
    connections[moduleName] = db;
    return db;
};

const run = (db, sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function (err) {
            if (err) reject(err);
            else resolve({ id: this.lastID, changes: this.changes });
        });
    });
};

const all = (db, sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
};

const get = (db, sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
};

// Initialize SQLite databases directory
const initDBs = async () => {
    // Ensuring the directory exists is handled at the top
    console.log('Database system initialized.');
};

module.exports = {
    getDB,
    run,
    all,
    get,
    initDBs
};
