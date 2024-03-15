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
            await this.#runQuery(`DROP TABLE IF EXISTS Consumer;`);
            await this.#runQuery(`DROP TABLE IF EXISTS Food_Processor;`);
            await this.#runQuery(`DROP TABLE IF EXISTS Consumer_Review;`);
            await this.#runQuery(`DROP TABLE IF EXISTS Supplier_Request;`);
            await this.#runQuery(`DROP TABLE IF EXISTS Certification_Type;`);
            await this.#runQuery(`DROP TABLE IF EXISTS Certification;`);
            await this.#runQuery(`DROP TABLE IF EXISTS External_Suppliers;`);
            await this.#runQuery(`DROP TABLE IF EXISTS Funds_Transactions;`);


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

            // Create table Consumer
            await this.#runQuery(`CREATE TABLE IF NOT EXISTS Player (
                Player_ID INTEGER PRIMARY KEY,
                XRP_Address TEXT NOT NULL,
                Name TEXT NOT NULL,
                FOREIGN KEY (XRP_Address) REFERENCES Account(XRP_Address)
            );`);

            // Create table Funds_Transactions
            await this.#runQuery(`CREATE TABLE IF NOT EXISTS Funds_Transactions (
                Transaction_ID INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                Player_ID INTEGER NOT NULL,
                Game_ID INTEGER NOT NULL,
                Transaction_Date TEXT  NOT NULL,
                URI_Token_Index TEXT NOT NULL,
                Amount TEXT NOT NULL,
                FOREIGN KEY (Player_ID) REFERENCES Player(Player_ID)
            );`);

            // Create table FoodProcessor
            /*await this.#runQuery(`CREATE TABLE IF NOT EXISTS Food_Processor (
                Food_Processor_ID INTEGER PRIMARY KEY AUTOINCREMENT,
                Account_ID INTEGER NOT NULL,
                Business_Name TEXT NOT NULL,
                BR_Number TEXT NOT NULL,
                Location TEXT NOT NULL,
                Contact TEXT NOT NULL,
                Rating REAL NOT NULL,
                Products TEXT,
                Referral_Code TEXT,
                FOREIGN KEY (Account_ID) REFERENCES Account(Account_ID)
            );`);

            // Create table Consumer_Review
            await this.#runQuery(`CREATE TABLE IF NOT EXISTS Consumer_Review (
                Review_ID INTEGER PRIMARY KEY AUTOINCREMENT,
                Food_Processor_ID INTEGER NOT NULL,
                Consumer_ID INTEGER,
                Comment TEXT,
                Rating REAL,
                FOREIGN KEY (Food_Processor_ID) REFERENCES Food_Processor(Food_Processor_ID),
                FOREIGN KEY (Consumer_ID) REFERENCES Consumer(Consumer_ID)
            );`);


            // Create table Supplier_Request
            await this.#runQuery(`CREATE TABLE IF NOT EXISTS Supplier_Request (
                Request_ID INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                Food_Processor_ID INTEGER NOT NULL,
                Supplier_ID INTEGER NOT NULL,
                Admin_Approval_Status BOOLEAN DEFAULT FALSE,
                Supplier_Approval_Status BOOLEAN DEFAULT FALSE,
                Admin_Reject_Comment TEXT,
                Supplier_Reject_Comment TEXT,
                FOREIGN KEY (Food_Processor_ID) REFERENCES Food_Processor(Food_Processor_ID),
                FOREIGN KEY (Supplier_ID) REFERENCES Food_Processor(Food_Processor_ID)
            );`);

            // Create table Certification_Type
            await this.#runQuery(`CREATE TABLE IF NOT EXISTS Certification_Type (
                Type_ID INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                Name TEXT NOT NULL,
                Rating REAL NOT NULL
            );`);

            // Create table Certification
            await this.#runQuery(`CREATE TABLE IF NOT EXISTS Certification (
                Certification_ID INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                Food_Processor_ID INTEGER NOT NULL,
                Type_ID INTEGER NOT NULL,
                Weight INTEGER NOT NULL,
                Exp_Date INTEGER NOT NULL,
                FOREIGN KEY (Food_Processor_ID) REFERENCES Food_Processor(Food_Processor_ID),
                FOREIGN KEY (Type_ID) REFERENCES Certification_Type(Type_ID)
            );`);


            // Create table External_Suppliers
            await this.#runQuery(`CREATE TABLE IF NOT EXISTS External_Suppliers (
                Supplier_ID INTEGER PRIMARY KEY AUTOINCREMENT,
                BR_Number TEXT
            );`);*/

            await this.#runQuery(`
                INSERT INTO Account (Public_Key, XRP_Address, Role) VALUES
                    ('03D7638D441412B64E3510BC1A25BEC80D5C2D65322F9F4D97D98D316698120EB5', 'rm2yHK71c5PNnS8JdFbYf29H3YDEa5Y6y', 'Admin'),
                    ('02731C3664C496F1EFCF664A3C8A155471B7484B848B55E24088DAFF0FBB424533', 'rEALPVCk8pwkDLJemLQd4TN3hrphTZWdJY', 'Player'),
                    ('02F1BD525C710423382AEA14E33BC340D0445D14A1B9547D688445867BF2CEEBD8', 'rHMqT7UtJigHFGayDQPakyLFZRMaoQsvT9', 'Player'),
                    ('02B8E8771FDD4515E0F2319E4D67172A2BF0CB94C7A07426A775AE30D4A651BD1E', 'rUm7vyyTs4yNpKfFqcRhHa9edDkoDnNKnR', 'Player');
                    
            `);

            await this.#runQuery(`
                INSERT INTO Admin (Admin_ID, XRP_Address, Name) VALUES
                    (10000, 'rm2yHK71c5PNnS8JdFbYf29H3YDEa5Y6y', 'Admin1');
            `);

            await this.#runQuery(`
                INSERT INTO Player (Player_ID, XRP_Address, Name) VALUES
                    (10001, 'rEALPVCk8pwkDLJemLQd4TN3hrphTZWdJY', 'Player 1'),
                    (10002, 'rHMqT7UtJigHFGayDQPakyLFZRMaoQsvT9', 'Player 2'),
                    (10003, 'rUm7vyyTs4yNpKfFqcRhHa9edDkoDnNKnR', 'Player 3');
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