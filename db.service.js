const sqlite3 = require('sqlite3').verbose();
const dbName = 'data.db';

const db = new sqlite3.Database(dbName, (err) => {
    if (err) {
        console.error(err.message);
    } else {
        db.run('CREATE TABLE IF NOT EXISTS items (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, description TEXT)', (err) => {
            if (err) {
                console.error(err.message);
            } 
        });
    }
});

// Export the db instance
module.exports = db;