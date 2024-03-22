import { AccountsController } from "./Controllers/Accounts.Controller";
import { FoodProcessorController } from "./Controllers/FoodProcessor.Controller";
import { SupplierRequestController } from "./Controllers/SupplierRequest.Controller";

const settings = require('./settings.json').settings;
const constants = require('./Services/Common.Services/Constants');

export class Controller {
   // dbPath = settings.dbPath;
    #accountsController = null;
    #foodProcessorController = null;
    #supplierRequestController = null;

    async handleRequest(user, message, isReadOnly) {     
        this.#accountsController = new AccountsController(message);
        this.#foodProcessorController = new FoodProcessorController(message);
        this.#supplierRequestController = new SupplierRequestController(message);

        let result = {};
        // Pass to the relevant service based on the "Service" property
        if (message.service == constants.RequestTypes.ACCOUNTS) { 
            result = await this.#accountsController.handleRequest();
        }
        else if (message.service == constants.RequestTypes.FOOD_PROCESSOR) { 
            result = await this.#foodProcessorController.handleRequest();
        }
        else if (message.service == constants.RequestTypes.SUPPLIER) { 
            result = await this.#supplierRequestController.handleRequest();
        }
        if(isReadOnly){
            await this.sendOutput(user, result);
        } else {
            await this.sendOutput(user, message.promiseId ? {promiseId: message.promiseId, ...result} : result);
        }
    }

    sendOutput = async (user, response) => {
        await user.send(response);
    }
}

