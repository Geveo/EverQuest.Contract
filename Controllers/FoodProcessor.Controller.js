import { FoodProcessorService } from '../Services/Domain.Service/FoodProcessor.Service';
const constants = require("../Services/Common.Services/Constants");

export class FoodProcessorController {
    #message = null;
    #service = null;

    constructor(message) {
        this.#message = message;
        this.#service = new FoodProcessorService(message);
    }

    async handleRequest() {
        try {
            switch (this.#message.action) {
                case constants.FoodProcessorRequestSubTypes.CREATE_FOOD_PROCESSOR:
                    return await this.#service.createFoodProcessor();
                    break;
                case constants.FoodProcessorRequestSubTypes.GENERATE_REFERRAL_CODE:
                    return await this.#service.generateReferralCodeCode();
                    break;
                case constants.FoodProcessorRequestSubTypes.GET_FOOD_PROCESSOR:
                    return await this.#service.getFoodProcessor();
                    break;
                case constants.FoodProcessorRequestSubTypes.GET_ALL_FOOD_PROCESSORS:
                    return await this.#service.getAllFoodProcessor();
                    break;
                default:
                    break;
            }

        } catch (error) {
            return { error: error };
        }
    }
}