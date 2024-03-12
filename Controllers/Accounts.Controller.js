import { AccountsService } from '../Services/Domain.Service/Accounts.Service';
const constants = require("../Services/Common.Services/Constants");

export class AccountsController {
    #message = null;
    #service = null;

    constructor(message) {
        this.#message = message;
        this.#service = new AccountsService(message);
    }

    async handleRequest() {
        try {
            switch (this.#message.action) {
                case constants.AccountsRequestSubTypes.CREATE_FOOD_PROCESSOR:
                    return await this.#service.createFoodProcessor();
                    break;
                case constants.AccountsRequestSubTypes.IS_ACCOUNT_EXIST:
                    return await this.#service.isAccountExist();
                    break;
                case constants.AccountsRequestSubTypes.GET_PLAYER_ID:
                    return await this.#service.GetPlayerID();
                    break; 
                case constants.AccountsRequestSubTypes.ADD_FUNDS_TRANSACTIONS:
                    return await this.#service.AddTransactionRecord();
                    break;
                case constants.AccountsRequestSubTypes.GET_TRANSACTION_HISTORY:
                    return await this.#service.GetTransactionHistory();
                    break;
                default:
                    break;
            }

        } catch (error) {
            return { error: error };
        }
    }
}