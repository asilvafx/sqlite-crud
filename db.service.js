const sqlite3 = require('sqlite3').verbose();
const dbName = 'myDatabase.db';

const db = new sqlite3.Database(dbName, (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('Database Connected');
        db.run('CREATE TABLE IF NOT EXISTS items (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, description TEXT)', (err) => {
            if (err) {
                console.error(err.message);
            } else {
                console.log('Table Created or already exists!');
            }
        });
    }
});

// Export the db instance
module.exports = db;