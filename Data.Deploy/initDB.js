const fs = require('fs')
const sqlite3 = require('sqlite3').verbose();
const settings = require('./settings.json').settings;

export class DBInitializer {
    static #db = null;

    static async init() {
        if (this.#db == null && !fs.existsSync(settings.dbPath)) {
            this.#db = new sqlite3.Database(settings.dbPath);

            // Drop table if exists
            await this.#runQuery(`DROP TABLE IF EXISTS Account;`);
            await this.#runQuery(`DROP TABLE IF EXISTS Admin;`);
            await this.#runQuery(`DROP TABLE IF EXISTS Player;`);
            await this.#runQuery(`DROP TABLE IF EXISTS Funds_Transactions;`);
            await this.#runQuery(`DROP TABLE IF EXISTS Total_Winnings;`);

            // Create table ContractVersion
            await this.#runQuery(`CREATE TABLE IF NOT EXISTS ContractVersion (
                Id INTEGER,
                Version FLOAT NOT NULL,
                Description Text,
                CreatedOn INTEGER,
                LastUpdatedOn INTEGER,
                PRIMARY KEY("Id" AUTOINCREMENT)
            );`);

            // Create table Accounts
            await this.#runQuery(`CREATE TABLE IF NOT EXISTS Account (
                XRP_Address TEXT PRIMARY KEY NOT NULL,
                Public_Key TEXT NOT NULL,
                Role TEXT NOT NULL
            );`);

            // Create table Admin
            await this.#runQuery(`CREATE TABLE IF NOT EXISTS Admin (
                Admin_ID INTEGER PRIMARY KEY,
                XRP_Address TEXT NOT NULL,
                Name TEXT NOT NULL,
                FOREIGN KEY (XRP_Address) REFERENCES Account(XRP_Address)
            );`);

            // Create table Player
            await this.#runQuery(`CREATE TABLE IF NOT EXISTS Player (
                Player_ID INTEGER PRIMARY KEY,
                XRP_Address TEXT NOT NULL,
                Name TEXT NOT NULL,
                FOREIGN KEY (XRP_Address) REFERENCES Account(XRP_Address)
            );`);

            // Create table Funds_Transactions
            await this.#runQuery(`CREATE TABLE IF NOT EXISTS Funds_Transactions (
                Player_ID INTEGER NOT NULL,
                Game_ID INTEGER NOT NULL,
                Transaction_Date TEXT  NOT NULL,
                URI_Token_Index TEXT NOT NULL,
                Amount TEXT NOT NULL,
                Transaction_Status TEXT NOT NULL,
                FOREIGN KEY (Player_ID) REFERENCES Player(Player_ID)
            );`);

            // Create Total_winnings table
            await this.#runQuery(`CREATE TABLE IF NOT EXISTS Total_Winnings (
                Player_ID INTEGER NOT NULL,
                Game_ID INTEGER NOT NULL,
                Winning_Amount TEXT NOT NULL,
                Date TEXT  NOT NULL,
                FOREIGN KEY (Player_ID) REFERENCES Player(Player_ID)
            );`);

            this.#db.close();
        }
    }

    static #runQuery(query, params = null) {
        return new Promise((resolve, reject) => {
            this.#db.run(query, params ? params : [], function (err) {
                if (err) {
                    reject(err);
                    return;
                }

                resolve({ lastId: this.lastID, changes: this.changes });
            });
        });
    }
}