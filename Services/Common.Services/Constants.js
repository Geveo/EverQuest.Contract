const RequestTypes = { 
    ACCOUNTS: "Accounts", 
    ADMIN: "Admin", 
} 

const AccountsRequestSubTypes = { 
    IS_ACCOUNT_EXIST: "IsAccountExist",
    GET_PLAYER_ID: "GetPlayerID",
    GET_PLAYER_NAME: "GetPlayerName",
    ADD_FUNDS_TRANSACTIONS: "AddFundsTransactions",
    GET_TRANSACTION_HISTORY: "GetTransactionHistory",
    GET_TRANSACTION_STATUS: "GetTransactionStatus",
    GET_TRANSACTION_RECORD: "GetTransactionRecord",
    UPDATE_TRANSACTION_RECORD: "UpdateTransactionRecord",
    ADD_TOTAL_WINNING_RECORD: "AddTotalWinningRecord",
    GET_TOTAL_WINNING_RECORD: "GetTotalWinnings",
    CREATE_ADMIN: "CreateAdmin", 
    DELETE_ADMIN: "DeleteAdmin", 
    UPDATE_ADMIN: "UpdateAdmin", 
} 

module.exports = {
    RequestTypes,
    AccountsRequestSubTypes,  
}