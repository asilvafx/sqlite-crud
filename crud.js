const db = require('./db.service');

// Function to check if a column exists in a table
const columnExists = (tableName, columnName, callback) => {
    const sql = `PRAGMA table_info(${tableName})`;
    db.all(sql, [], (err, columns) => {
        if (err) return callback(err);
        const exists = columns.some(col => col.name === columnName);
        callback(null, exists);
    });
};

// Function to add a new column to a table
const addColumn = (tableName, columnName, columnType, callback) => {
    const sql = `ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${columnType}`;
    db.run(sql, callback);
};

// CREATE
const create = (tableName, data, callback) => {
    // Create table if it doesn't exist
    const createTableSQL = `CREATE TABLE IF NOT EXISTS ${tableName} (id INTEGER PRIMARY KEY AUTOINCREMENT)`;
    db.run(createTableSQL, (err) => {
        if (err) return callback(err);

        // Prepare the insert statement
        const columns = Object.keys(data);
        const placeholders = columns.map(() => '?').join(', ');
        const values = Object.values(data);

        // Check and add columns if they don't exist
        let columnChecks = columns.map(column => {
            return new Promise((resolve, reject) => {
                columnExists(tableName, column, (err, exists) => {
                    if (err) return reject(err);
                    if (!exists) {
                        // Assuming all new columns are TEXT for simplicity
                        addColumn(tableName, column, 'TEXT', (err) => {
                            if (err) return reject(err);
                            resolve();
                        });
                    } else {
                        resolve();
                    }
                });
            });
        });

        Promise.all(columnChecks)
            .then(() => {
                // Now insert the data
                const sql = `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${placeholders})`;
                db.run(sql, values, function(err) {
                    callback(err, { id: this.lastID });
                });
            })
            .catch(err => callback(err));
    });
};

// READ
const read = (tableName, callback) => {
    const sql = `SELECT * FROM ${tableName}`;
    db.all(sql, [], callback);
};

// UPDATE
const update = (tableName, id, data, callback) => {
    const updates = Object.keys(data).map(key => `${key} = ?`).join(', ');
    const sql = `UPDATE ${tableName} SET ${updates} WHERE id = ?`;
    const values = [...Object.values(data), id];

    db.run(sql, values, callback);
};

// DELETE
const erase = (tableName, id, callback) => {
    const sql = `DELETE FROM ${tableName} WHERE id = ?`;
    db.run(sql, id, callback);
};

module.exports = { create, read, update, erase };