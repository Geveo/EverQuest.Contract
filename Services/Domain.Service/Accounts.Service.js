import { FoodProcessorController } from '../../Controllers/FoodProcessor.Controller';
import { SharedService } from '../Common.Services/SharedService';

const settings = require('../../settings.json').settings;
const { SqliteDatabase, DataTypes } = require('../Common.Services/DBHandler');

export class AccountsService {
    #message = null;
    #dbPath = settings.dbPath;
    #dbContext = null;
    #foodProcessorController = null;

    constructor(message) {
        this.#message = message;
        this.#dbContext = new SqliteDatabase(this.#dbPath);
        this.#foodProcessorController = new FoodProcessorController(this.#message);
    }

    async createFoodProcessor() {
        let resObj = {};
        try {
            this.#dbContext.open();

            const accountsData = {
                public_Key: this.#message.data.public_Key,
                XRP_Address: this.#message.data.XRP_Address,
                role: this.#message.data.role,
            };

            let filter = {
                public_Key: this.#message.data.public_Key,
                XRP_Address: this.#message.data.XRP_Address,
            }

            let rows = await this.#dbContext.getValues("Account", filter);

            if(rows.length == 0){
                const accountRowId = (await this.#dbContext.insertValue("Account", accountsData)).lastId;
                
                let random = await SharedService.generateSeededRandom(SharedService.context.lclSeqNo, 999999999, 9999999999);
                random = random.toString();
        
                // construct the referral code
                const referralCode = `${random.slice(0, random.length / 2)}-${random.slice(random.length / 2)}`;
    
                const fpData = {
                    account_ID: accountRowId,
                    business_Name: this.#message.data.business_Name,
                    bR_Number: this.#message.data.bR_Number,
                    location: this.#message.data.location,
                    contact: this.#message.data.contact,
                    rating: 0,
                    products: "",
                    referral_Code: referralCode,
                };
    
                const fpRowId = (await this.#dbContext.insertValue("Food_Processor", fpData)).lastId;
                resObj.success = { rowId: fpRowId };
            }
            else{
                resObj.success = { rowId: 0 };
            }
            
            return resObj;

        } catch (error) {
            throw error;
        } finally {
            this.#dbContext.close();
        }
    }

    async isAccountExist() {
        let resObj = {};

        let filter = {
            XRP_Address: this.#message.data.XRP_Address,
        }
        console.log("Checking user has an account: ", filter);
        try {
            this.#dbContext.open();
            let rows = await this.#dbContext.getValues("Account", filter);

            if (rows.length > 0) {
                resObj.success = true;
            }
            else {
                resObj.success = false;
            }
            console.log("Has acount: ", resObj);
            return resObj;
        } catch (error) {
            throw error;
        } finally {
            this.#dbContext.close();
        }
    }

    async GetPlayerID() {
        let resObj = {};

        let filter = {
            XRP_Address: this.#message.data.XRP_Address,
        }
        console.log("Getting player id: ", filter);
        try {
            this.#dbContext.open();
            let rows = await this.#dbContext.getValues("Player", filter);

            if (rows.length > 0) {
                resObj.success = rows[0].Player_ID;
            }
            else {
                resObj.success = 0;
            }
            console.log("Player id: ", resObj);
            return resObj;

        } catch (error) {
            throw error;
        } finally {
            this.#dbContext.close();
        }
    }

    async GetPlayerName() {
        let resObj = {};

        let filter = {
            XRP_Address: this.#message.data.XRP_Address,
        }
        console.log("Getting player name: ", filter);
        try {
            this.#dbContext.open();
            let rows = await this.#dbContext.getValues("Player", filter);

            if (rows.length > 0) {
                resObj.success = rows[0].Name;
            }
            else {
                resObj.success = 0;
            }
            console.log("Player Name: ", resObj);
            return resObj;

        } catch (error) {
            throw error;
        } finally {
            this.#dbContext.close();
        }
    }

    async AddTransactionRecord() {
        let resObj = {};

        try {
            this.#dbContext.open();

            const fundTranferData = {
                Player_ID: this.#message.data.Player_ID,
                Game_ID: this.#message.data.Game_ID,
                Transaction_Date: this.#message.data.Transaction_Date,
                URI_Token_Index: this.#message.data.URI_Token_Index,
                Amount: this.#message.data.Amount,
                Transaction_Status: "JOINED"
            };
            console.log("Creating a transaction record: ", fundTranferData);
            var fundTranfers = [fundTranferData];
            const changes = (await this.#dbContext.insertValuesWithParams("Funds_Transactions", fundTranfers)).changes;

            if (changes > 0) {
                resObj.success = true;
            }
            else {
                resObj.success = false;
            }
            console.log("Created transaction: ", resObj);
            return resObj;
        } catch (error) {
            throw error;
        } finally {
            this.#dbContext.close();
        }
    }

    async UpdateTransactionRecord() {
        let resObj = {};

        try {
            this.#dbContext.open();

            const filter = {
                Player_ID: this.#message.data.Player_ID,
                Game_ID: this.#message.data.Game_ID,
            };

            const updateTransactionRecord = 
            { Transaction_Status: this.#message.Transaction_Status }

            console.log("Updating the transaction record: ", filter);

            const transaction_ID = (await this.#dbContext.updateValue("Funds_Transactions", updateTransactionRecord, filter)).lastId;

            if (transaction_ID > 0) {
                resObj.success = true;
            }
            else {
                resObj.success = false;
            }
            console.log("Updated transaction: ", resObj);
            return resObj;
        } catch (error) {
            throw error;
        } finally {
            this.#dbContext.close();
        }
    }

    async GetTransactionRecord() {
        let resObj = {};

        let filter = {
            Player_ID: this.#message.data.Player_ID,
            Game_ID: this.#message.data.Game_ID,
        }
        console.log("Getting transaction record: ", filter);
        try {
            this.#dbContext.open();
            let rows = await this.#dbContext.getValues("Funds_Transactions ", filter);

            if (rows.length > 0) {
                resObj.success = true;
                resObj.data = rows[0];
            }
            else {
                resObj.success = false;
            }
            console.log("Transaction record: ", resObj);
            return resObj;

        } catch (error) {
            throw error;
        } finally {
            this.#dbContext.close();
        }
    }

    async GetTransactionHistory() {
        let resObj = {};

        let filter = {
            Player_ID: this.#message.data.Player_ID,
        }
        console.log("Getting transaction record: ", filter);
        try {
            this.#dbContext.open();
            let rows = await this.#dbContext.getValues("Funds_Transactions ", filter);

            if (rows.length > 0) {
                resObj.success = true;
                resObj.data = rows;
            }
            else {
                resObj.success = false;
            }
            console.log("Transaction record: ", resObj);
            return resObj;

        } catch (error) {
            throw error;
        } finally {
            this.#dbContext.close();
        }
    }

    async GetTransactionStatus() {
        let resObj = {};

        let filter = {
            Player_ID: this.#message.data.Player_ID,
            Game_ID: this.#message.data.Game_ID,
        }
        console.log("Getting transaction status: ", filter);
        try {
            this.#dbContext.open();
            let rows = await this.#dbContext.getValues("Funds_Transactions ", filter);

            if (rows.length > 0) {
                resObj.success = true;
                resObj.data = rows[0].Transaction_Status;
            }
            else {
                resObj.success = false;
            }
            console.log("Transaction Status: ", resObj);
            return resObj;

        } catch (error) {
            throw error;
        } finally {
            this.#dbContext.close();
        }
    }

    async AddTotalWinningRecord() {
        let resObj = {};

        try {
            this.#dbContext.open();

            const fundTranferData = {
                Player_ID: this.#message.data.Player_ID,
                Game_ID: this.#message.data.Game_ID,
                Date: this.#message.data.Date,
                Winning_Amount: this.#message.data.Winning_Amount,
            };
            console.log("Creating a total winning record: ", fundTranferData);
            var fundTranfers = [fundTranferData];
            const changes = (await this.#dbContext.insertValuesWithParams("Total_Winnings", fundTranfers)).changes;

            if (changes > 0) {
                resObj.success = true;
            }
            else {
                resObj.success = false;
            }
            console.log("Added transaction: ", resObj);
            return resObj;
        } catch (error) {
            throw error;
        } finally {
            this.#dbContext.close();
        }
    }

    async GetTotalWinnings() {
        let resObj = {};

        let filter = {
            Player_ID: this.#message.data.Player_ID,
        }
        console.log("Getting total winnings: ", filter);
        try {
            this.#dbContext.open();
            let rows = await this.#dbContext.getValues("Total_Winnings ", filter);

            if (rows.length > 0) {
                resObj.success = true;
                resObj.data = rows;
            }
            else {
                resObj.success = false;
            }
            console.log("Total Winnings: ", resObj);
            return resObj;

        } catch (error) {
            throw error;
        } finally {
            this.#dbContext.close();
        }
    }

}

