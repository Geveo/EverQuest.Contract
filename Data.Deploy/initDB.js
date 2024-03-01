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


            // Create table ContractVersion
            await this.#runQuery(`CREATE TABLE IF NOT EXISTS ContractVersion (
                Id INTEGER,
                Version FLOAT NOT NULL,
                Description Text,
                CreatedOn INTEGER,
                LastUpdatedOn INTEGER,
                PRIMARY KEY("Id" AUTOINCREMENT)
            )`);

            // Create table Accounts
            await this.#runQuery(`CREATE TABLE IF NOT EXISTS Account (
                XRP_Address TEXT PRIMARY KEY NOT NULL,
                Public_Key TEXT NOT NULL,
                Role TEXT NOT NULL
            )`);

            // Create table Admin
            await this.#runQuery(`CREATE TABLE IF NOT EXISTS Admin (
                Admin_ID INTEGER PRIMARY KEY AUTOINCREMENT,
                XRP_Address TEXT NOT NULL,
                Name TEXT NOT NULL,
                FOREIGN KEY (XRP_Address) REFERENCES Account(XRP_Address)
            );`);

            // Create table Consumer
            await this.#runQuery(`CREATE TABLE IF NOT EXISTS Player (
                Player_ID INTEGER PRIMARY KEY AUTOINCREMENT,
                XRP_Address TEXT NOT NULL,
                Name TEXT NOT NULL,
                FOREIGN KEY (XRP_Address) REFERENCES Account(XRP_Address)
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
                    ('EDA1347944A87E22DAD2ED8BE01C4F8F7D14F82044A6708C73164F21F9758A3E34', 'rGFTDgKKqVLochqEC9M6Zfwq9kKP586wME', 'Admin'),
                    ('EDEC15B6D03FB9F2792B04D5F42FE63AC432166C9761DE42D617BDE1476DFCF0F6', 'rhVQZNYAG42AkZ7faWuo8peQayyJPLAGHQ', 'Player'),
                    ('ED17C57889B433BFD5D6C5326EF3234BBCFBFF3192F2FD5B9F8F6EDC42EB730E27', 'rGLBFm3HUjxGNfWAGiCXQLFB9uGACZ5pd2', 'Player');
                    
            `);

            await this.#runQuery(`
                INSERT INTO Admin (XRP_Address, Name) VALUES
                    ('rGFTDgKKqVLochqEC9M6Zfwq9kKP586wME', 'Admin1');
            `);

            await this.#runQuery(`
                INSERT INTO Player (XRP_Address, Name) VALUES
                    ('rhVQZNYAG42AkZ7faWuo8peQayyJPLAGHQ', 'Player 1'),
                    ('rGLBFm3HUjxGNfWAGiCXQLFB9uGACZ5pd2', 'Player 2');
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