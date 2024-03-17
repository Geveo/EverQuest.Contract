const RequestTypes = { 
    ACCOUNTS: "Accounts", 
    ADMIN: "Admin", 
    FOOD_PROCESSOR: "FoodProcessor", 
    SUPPLIER: "SupplierRequest",
    CONSUMER: "Consumer", 
    CERTIFICATE: "Certificate",
    QR: "QR" 
} 

const AccountsRequestSubTypes = { 
    IS_ACCOUNT_EXIST: "IsAccountExist",
    GET_PLAYER_ID: "GetPlayerID",
    GET_PLAYER_NAME: "GetPlayerName",
    ADD_FUNDS_TRANSACTIONS: "AddFundsTransactions",
    GET_TRANSACTION_HISTORY: "GetTransactionHistory",
    GET_TRANSACTION_STATUS: "GetTransactionStatus",
    UPDATE_TRANSACTION_RECORD: "UpdateTransactionRecord",
    CREATE_ADMIN: "CreateAdmin", 
    DELETE_ADMIN: "DeleteAdmin", 
    UPDATE_ADMIN: "UpdateAdmin", 

    CREATE_FOOD_PROCESSOR: "CreateFoodProcessor", 
    DELETE_FOOD_PROCESSOR: "Delete FoodProcessor", 
    UPDATE_FOOD_PROCESSOR: "Update FoodProcessor", 

    CREATE_CONSUMER: "CreateConsumer", 
    DELETE_CONSUMER: "DeleteConsumer", 
    UPDATE_CONSUMER: "UpdateConsumer", 
} 

const FoodProcessorRequestSubTypes = { 
    GET_FOOD_PROCESSOR: "GetFoodProcessor", 
    GENERATE_REFERRAL_CODE: "GenerateReferralCode", 
    CREATE_FOOD_PROCESSOR: "CreateFoodProcessor", 
    DELETE_FOOD_PROCESSOR: "DeleteFoodProcessor", 
    UPDATE_FOOD_PROCESSOR: "UpdateFoodProcessor", 
    GET_ALL_FOOD_PROCESSORS: "GetAllFoodProcessors",
} 

const SupplierRequestsRequestSubTypes = { 
    CREATE_SUPPLIER_REQUEST: "CreateSupplierRequest",
    DELETE_SUPPLIER_REQUEST: "DeleteSupplierRequest",
    UPDATE_SUPPLIER_REQUEST: "UpdateSupplierRequest",
    GET_SUPPLIER_DETAILS: "GetSupplierDetails", 
    GET_SUPPLIER_REQUESTS: "GetSupplierRequests", 
} 

module.exports = {
    RequestTypes,
    AccountsRequestSubTypes,
    FoodProcessorRequestSubTypes,
    SupplierRequestsRequestSubTypes
}