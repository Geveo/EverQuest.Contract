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
                case constants.AccountsRequestSubTypes.GET_PLAYER_NAME:
                    return await this.#service.GetPlayerName();
                    break; 
                case constants.AccountsRequestSubTypes.ADD_FUNDS_TRANSACTIONS:
                    return await this.#service.AddTransactionRecord();
                    break;
                case constants.AccountsRequestSubTypes.GET_TRANSACTION_STATUS:
                    return await this.#service.GetTransactionStatus();
                    break;
                case constants.AccountsRequestSubTypes.GET_TRANSACTION_RECORD:
                    return await this.#service.GetTransactionRecord();
                    break;
                case constants.AccountsRequestSubTypes.UPDATE_TRANSACTION_RECORD:
                    return await this.#service.UpdateTransactionRecord();
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