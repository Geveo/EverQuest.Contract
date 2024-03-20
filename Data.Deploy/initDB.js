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

            await this.#runQuery(`
                INSERT INTO Account (Public_Key, XRP_Address, Role) VALUES
                    ('03D7638D441412B64E3510BC1A25BEC80D5C2D65322F9F4D97D98D316698120EB5', 'rm2yHK71c5PNnS8JdFbYf29H3YDEa5Y6y', 'Admin'),
                    ('02731C3664C496F1EFCF664A3C8A155471B7484B848B55E24088DAFF0FBB424533', 'rEALPVCk8pwkDLJemLQd4TN3hrphTZWdJY', 'Player'),
                    ('02F1BD525C710423382AEA14E33BC340D0445D14A1B9547D688445867BF2CEEBD8', 'rHMqT7UtJigHFGayDQPakyLFZRMaoQsvT9', 'Player'),
                    ('02B8E8771FDD4515E0F2319E4D67172A2BF0CB94C7A07426A775AE30D4A651BD1E', 'rUm7vyyTs4yNpKfFqcRhHa9edDkoDnNKnR', 'Player'),
                    ('02B8E8771FDD4515E0F2319E4D67172A2BF0CB94C7A07426A775AE30D4A651BD1E', 'rGatWop2JKuD9seKnLjoBvJRSS81ye6NJ3', 'Player'),
                    ('02B8E8771FDD4515E0F2319E4D67172A2BF0CB94C7A07426A775AE30D4A651BD1E', 'rGKzjS2ichPAA37qAjJfkPB4KcGC8XuDo1', 'Player'),
                    ('02B8E8771FDD4515E0F2319E4D67172A2BF0CB94C7A07426A775AE30D4A651BD1E', 'rLFk3DTmGN4rSSqBkqpQyu7gXaFWVeXNFW', 'Player'),
                    ('02B8E8771FDD4515E0F2319E4D67172A2BF0CB94C7A07426A775AE30D4A651BD1E', 'rG4HDrfn5SGS4P9S5Bpu411iRjQbZdK79H', 'Player');   
            `);

            await this.#runQuery(`
                INSERT INTO Admin (Admin_ID, XRP_Address, Name) VALUES
                    (10000, 'rm2yHK71c5PNnS8JdFbYf29H3YDEa5Y6y', 'Admin1');
            `);

            await this.#runQuery(`
                INSERT INTO Player (Player_ID, XRP_Address, Name) VALUES
                    (10001, 'rEALPVCk8pwkDLJemLQd4TN3hrphTZWdJY', 'John Smith'),
                    (10002, 'rHMqT7UtJigHFGayDQPakyLFZRMaoQsvT9', 'Emily Johnson'),
                    (10003, 'rUm7vyyTs4yNpKfFqcRhHa9edDkoDnNKnR', 'Alex Rodriguez'),
                    (10004, 'rGatWop2JKuD9seKnLjoBvJRSS81ye6NJ3', 'Sarah Thompson'),
                    (10005, 'rGKzjS2ichPAA37qAjJfkPB4KcGC8XuDo1', 'David Lee'),
                    (10006, 'rLFk3DTmGN4rSSqBkqpQyu7gXaFWVeXNFW', 'Jessica Martinez'),
                    (10007, 'rG4HDrfn5SGS4P9S5Bpu411iRjQbZdK79H', 'Michael Brown');
            `);


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