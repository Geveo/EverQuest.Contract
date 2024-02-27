import { SupplierRequestService } from '../Services/Domain.Service/SupplierRequest.Service';
const constants = require("../Services/Common.Services/Constants");

export class SupplierRequestController {
    #message = null;
    #service = null;

    constructor(message) {
        this.#message = message;
        this.#service = new SupplierRequestService(message);
    }

    async handleRequest() {
        try {
            switch (this.#message.action) {
                case constants.SupplierRequestsRequestSubTypes.CREATE_SUPPLIER_REQUEST:
                    return await this.#service.createSupplierRequest();
                    break;
                case constants.SupplierRequestsRequestSubTypes.GET_SUPPLIER_DETAILS:
                    return await this.#service.getSupplierDetails();
                    break;
                case constants.SupplierRequestsRequestSubTypes.UPDATE_SUPPLIER_REQUEST:
                    return await this.#service.updateSupplierDetails();
                    break;
                case constants.SupplierRequestsRequestSubTypes.GET_SUPPLIER_REQUESTS:
                    return await this.#service.getSupplierRequests();
                    break;
                default:
                    break;
            }

        } catch (error) {
            return { error: error };
        }
    }
}