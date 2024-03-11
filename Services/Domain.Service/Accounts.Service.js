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
            Public_Key: this.#message.data.Public_Key,
            XRP_Address: this.#message.data.XRP_Address,
        }
        try {
            this.#dbContext.open();
            let rows = await this.#dbContext.getValues("Account", filter);

            if (rows.length > 0) {
                resObj.success = true;
            }
            else {
                resObj.success = false;
            }

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
            Public_Key: this.#message.data.Public_Key,
            XRP_Address: this.#message.data.XRP_Address,
        }
        try {
            this.#dbContext.open();
            let rows = await this.#dbContext.getValues("Account", filter);

            if (rows.length > 0) {
                resObj.success = true;
                resObj.Player_ID = rows.Player_ID
            }
            else {
                resObj.success = false;
            }

            return resObj;
        } catch (error) {
            throw error;
        } finally {
            this.#dbContext.close();
        }
    }
}

