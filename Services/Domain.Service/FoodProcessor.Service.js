import { SharedService } from '../Common.Services/SharedService';
const settings = require('../../settings.json').settings;
const { SqliteDatabase, DataTypes } = require('../Common.Services/DBHandler');

export class FoodProcessorService {
    #message = null;
    #dbPath = settings.dbPath;
    #dbContext = null;

    constructor(message) {
        this.#message = message;
        this.#dbContext = new SqliteDatabase(this.#dbPath);
    }

    async generateReferralCodeCode() {
        try {
            let resObj = {};
            let random = await SharedService.generateSeededRandom(SharedService.context.lclSeqNo, 999999999, 9999999999);
            random = random.toString();

            // construct the referral code
            const referralCode = `${random.slice(0, random.length / 2)}-${random.slice(random.length / 2)}`;

            resObj.success = referralCode;
            return resObj;
        } catch (error) {
            throw error;
        }
    }

    async createFoodProcessor() {
        let resObj = {};
        try {
            this.#dbContext.open();

            const data = {
                business_Name: this.#message.data.business_Name,
                bR_Number: this.#message.data.bR_Name,
                location: this.#message.data.location,
                contact: this.#message.data.contact,
                rating: 0,
                products: '',
                referral_Code: referralCode,
            };

            const rowId = (await this.#dbContext.insertValue("Food_Processor", data)).lastId;
            resObj.success = { rowId: rowId };
            return resObj;

        } catch (error) {
            throw error;
        } finally {
            this.#dbContext.close();
        }
    }

    async getFoodProcessor() {
        let resObj = {};
        try {
            this.#dbContext.open();

            let filter = {
                public_Key: this.#message.data.public_Key,
                XRP_Address: this.#message.data.XRP_Address,
            }

            let rows = await this.#dbContext.getValues("Account", filter);

            if (rows.length > 0 && rows[0].Role == 'Food Processor') {
                let fpFilter = {
                    account_ID: rows[0].Account_ID,
                }
                let foodProcessor = await this.#dbContext.getValues("Food_Processor", fpFilter);
                resObj.success = foodProcessor;
            }
            else {
                resObj.success = [];
            }
            return resObj;
        } catch (error) {
            throw error;
        } finally {
            this.#dbContext.close();
        }
    }
    
    async getAllFoodProcessor() {
        let resObj = {};
        try {
            this.#dbContext.open();

            let foodProcessor = await this.#dbContext.getValues("Food_Processor");
            resObj.success = foodProcessor;
            return resObj;
        } catch (error) {
            throw error;
        } finally {
            this.#dbContext.close();
        }
    }
}

