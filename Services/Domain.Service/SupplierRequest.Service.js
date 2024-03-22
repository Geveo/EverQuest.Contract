const settings = require('../../settings.json').settings;
const { SqliteDatabase, DataTypes } = require('../Common.Services/DBHandler');

export class SupplierRequestService {
    #message = null;
    #dbPath = settings.dbPath;
    #dbContext = null;

    constructor(message) {
        this.#message = message;
        this.#dbContext = new SqliteDatabase(this.#dbPath);
    }

    async createSupplierRequest() {
        let resObj = {};
        try {
            this.#dbContext.open();

            const data = {
                Food_Processor_ID: this.#message.data.foodProcessorId,
                Supplier_ID: this.#message.data.supplierId,
                Admin_Approval_Status: this.#message.data.adminApprovalStatus,
                Supplier_Approval_Status: this.#message.data.supplierApprovalStatus,
                Admin_Reject_Comment: this.#message.data.adminRejectComment,
                Supplier_Reject_Comment: this.#message.data.supplierRejectComment,
            }

            const rowId = (await this.#dbContext.insertValue("Supplier_Request", data)).lastId;
            resObj.success = { rowId: rowId };
            console.log(rowId);
            return resObj;

        } catch (error) {
            console.log(error);
            throw error;
        } finally {
            this.#dbContext.close();
        }
    }

    async getSupplierDetails() {
        let resObj = {};
        try {
            this.#dbContext.open();

            let filter = {
                public_Key: this.#message.data.public_Key,
                XRP_Address: this.#message.data.XRP_Address,
            }

            let rows = await this.#dbContext.getValues("Account", filter);

            if (rows.length > 0) {
                let fpFilter = {
                    account_ID: rows[0].Account_ID,
                }
                let foodProcessor = await this.#dbContext.getValues("Food_Processor", fpFilter);

                if(foodProcessor.length > 0){
                    let supplierFilter = {
                        Food_Processor_ID: foodProcessor[0].Food_Processor_ID,
                    }
                    let suppliers = await this.#dbContext.getValues("Supplier_Request", supplierFilter);
                    resObj.success = suppliers;
                }
                else{
                    resObj.success = [];
                }
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

    async updateSupplierDetails() {
        let resObj = {};

        try {
            this.#dbContext.open();
            let supplierData = this.#message.data;

            let supplierFilter = this.#message.filter;
            const filter = this.#message.filter;

            const row = (await this.#dbContext.updateValue("Supplier_Request", supplierData, supplierFilter));

            resObj.success = { row: row };
            console.log(row);
            return resObj;
        } catch (error) {
            throw error;
        } finally {
            this.#dbContext.close();
        }
    }

    async getSupplierRequests() {
        let resObj = {};
        try {
            this.#dbContext.open();

            let filter = {
                public_Key: this.#message.data.public_Key,
                XRP_Address: this.#message.data.XRP_Address,
            }

            let rows = await this.#dbContext.getValues("Account", filter);

            if (rows.length > 0) {
                let fpFilter = {
                    account_ID: rows[0].Account_ID,
                }
                let foodProcessor = await this.#dbContext.getValues("Food_Processor", fpFilter);

                if(foodProcessor.length > 0){
                    let supplierFilter = {
                        Supplier_ID: foodProcessor[0].Food_Processor_ID,
                    }
                    let suppliers = await this.#dbContext.getValues("Supplier_Request", supplierFilter);
                    resObj.success = suppliers;
                }
                else{
                    resObj.success = [];
                }
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
}
