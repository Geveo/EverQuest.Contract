const sqlite3 = require('sqlite3').verbose();

const DataTypes = {
    TEXT: 'TEXT',
    INTEGER: 'INTEGER',
    NULL: 'NULL'
}

class SqliteDatabase {
    constructor(dbFile) {
        this.dbFile = dbFile;
        this.openConnections = 0;
    }

    open() {
        // Make sure only one connection is open at a time.
        // If a connection is already open increase the connection count.
        // This guarantees only one connection is open even if open() is called before closing the previous connections. 
        if (this.openConnections <= 0) {
            this.db = new sqlite3.Database(this.dbFile, sqlite3.OPEN_READWRITE);
            this.openConnections = 1;
        }
        else
            this.openConnections++;
    }

    close() {
        // Only close the connection for the last open connection.
        // Otherwise keep decreasing until connection count is 1.
        // This prevents closing the connection even if close() is called while db is used by another open session.
        if (this.openConnections <= 1) {
            this.db.close();
            this.db = null;
            this.openConnections = 0;
        }
        else
            this.openConnections--;
    }

    async createTableIfNotExists(tableName, columnInfo) {
        if (!this.db)
            throw 'Database connection is not open.';

        const columns = columnInfo.map(c => {
            let info = `${c.name} ${c.type}`;
            if (c.default)
                info += ` DEFAULT ${c.default}`;
            if (c.unique)
                info += ' UNIQUE';
            if (c.primary)
                info += ' PRIMARY KEY';
            if (c.notNull)
                info += ' NOT NULL';
            return info;
        }).join(', ');

        const query = `CREATE TABLE IF NOT EXISTS ${tableName}(${columns})`;
        await this.runQuery(query);
    }

    isTableExists(tableName) {
        const query = `SELECT name FROM sqlite_master WHERE type='table' AND name='${tableName}';`;
        return new Promise((resolve, reject) => {
            this.db.all(query, [], function (err, rows) {
                if (err) {
                    reject(err);
                    return;
                }

                resolve(!!(rows.length && rows.length > 0));
            });
        });
    }

    getValues(tableName, filter = null, op = '=') {
        if (!this.db)
            throw 'Database connection is not open.';

        let values = [];
        let filterStr = '1 AND '
        if (filter) {
            console.log(filter);
            const columnNames = Object.keys(filter);

            if (op === 'IN') {
                for (const columnName of columnNames) {

                    if(filter[columnName].length > 0){
                        filterStr += `${columnName} ${op} ( `;
    
                        const valArray = filter[columnName];
                        for (const v of valArray) {
                            filterStr += `?, `;
                            values.push(v);
                        }
    
                        filterStr = filterStr.slice(0, -2);
                        filterStr += `) AND `;
                    }
                }
            }
            else {
                for (const columnName of columnNames) {

                    filterStr += `${columnName} ${op} ? AND `;
                    values.push(filter[columnName] ? filter[columnName] : 'NULL');
                }
            }


        }
        filterStr = filterStr.slice(0, -5);

        const query = `SELECT * FROM ${tableName}` + (filterStr ? ` WHERE ${filterStr};` : ';');
        console.log("Query: " + query);
        return new Promise((resolve, reject) => {
            let rows = [];
            this.db.each(query, values, function (err, row) {
                if (err) {
                    reject(err);
                    return;
                }

                rows.push(row);
            }, function (err, count) {
                if (err) {
                    reject(err);
                    return;
                }

                console.log(rows)
                resolve(rows);
            });
        });
    }

    async  getLastRecord(tableName) {
        const query = `SELECT * FROM ${tableName} ORDER BY rowid DESC LIMIT 1`;
        // Execute the query and return the result
        return new Promise((resolve, reject) => {
            this.db.get(query, (err, row) => {
                if (err) {
                    console.error(err.message);
                   reject(err.message);
                } else {
                   resolve(row);
                }
            });
        });
    }

    async insertValue(tableName, value) {
        return (await this.insertValues(tableName, [value]));
    }

    async updateValue(tableName, value, filter = null) {
        if (!this.db)
            throw 'Database connection is not open.';

        let columnNames = Object.keys(value);

        let valueStr = '';
        let values = [];
        for (const columnName of columnNames) {
            valueStr += `${columnName} = ?,`;
            values.push(value[columnName] ? value[columnName] : 'NULL');
        }
        valueStr = valueStr.slice(0, -1);

        let filterStr = '1 AND '
        if (filter) {
            columnNames = Object.keys(filter);
            for (const columnName of columnNames) {
                filterStr += `${columnName} = ? AND `;
                values.push(filter[columnName] ? filter[columnName] : 'NULL');
            }
        }
        filterStr = filterStr.slice(0, -5);

        const query = `UPDATE ${tableName} SET ${valueStr} WHERE ${filterStr};`;
        return (await this.runQuery(query, values));
    }

    async insertValues(tableName, values) {
        console.log(values)
        if (!this.db)
            throw 'Database connection is not open.';

        if (values.length) {
            const columnNames = Object.keys(values[0]);
            console.log(columnNames)

            let rowValueStr = '';
            let rowValues = [];
            for (const val of values) {
                rowValueStr += '(';
                for (const columnName of columnNames) {
                    rowValueStr += ('?,');
                    rowValues.push(val[columnName] ?? 'NULL');
                }
                rowValueStr = rowValueStr.slice(0, -1) + '),';
            }
            rowValueStr = rowValueStr.slice(0, -1);

            const query = `INSERT INTO ${tableName}(${columnNames.join(', ')}) VALUES ${rowValueStr};`;
            console.log(query)
            console.log(rowValues)
            return (await this.runQuery(query, rowValues));
        }
    }

    async insertValuesWithParams(tableName, values) {
        console.log(values);
        if (!this.db)
            throw 'Database connection is not open.';

        if (values.length) {
            const columnNames = Object.keys(values[0]);
            console.log(columnNames)

            let rowValueStr = '';
            let rowValues = [];
            for (const val of values) {
                rowValueStr += '(';
                for (const columnName of columnNames) {
                    let value = val[columnName];
                    // Format value if it's a string or a date
                    if (typeof value === 'string' || value instanceof Date) {
                        value = `'${value}'`;
                    } else if (value === null || value === undefined) {
                        value = 'NULL';
                    }
                    rowValueStr += (`${value},`);
                }
                rowValueStr = rowValueStr.slice(0, -1) + '),';
            }
            rowValueStr = rowValueStr.slice(0, -1);

            const query = `INSERT INTO ${tableName}(${columnNames.join(', ')}) VALUES ${rowValueStr};`;
            console.log(query);
            const result = await this.runQuery(query);
            console.log("LastID: ", result.lastId)
            return (result);
        }
    }
    

    async deleteValues(tableName, filter = null) {
        if (!this.db)
            throw 'Database connection is not open.';

        let values = [];
        let filterStr = '1 AND '
        if (filter) {
            const columnNames = Object.keys(filter);
            for (const columnName of columnNames) {
                filterStr += `${columnName} = ? AND `;
                values.push(filter[columnName] ? filter[columnName] : 'NULL');
            }
        }
        filterStr = filterStr.slice(0, -5);

        const query = `DELETE FROM ${tableName} WHERE ${filterStr};`;
        return (await this.runQuery(query, values));
    }

    runQuery(query, params = null) {
        console.log("Executing query: ", query);
        console.log("DB: ", this.db);
        return new Promise((resolve, reject) => {
            this.db.run(query, params ? params : [], function (err) {
                if (err) {
                    console.log("Error: ", err);
                    reject(err);
                    return;
                }

                resolve({ lastId: this.lastID, changes: this.changes });
            });
        });
    }
}

module.exports = {
    SqliteDatabase,
    DataTypes
}