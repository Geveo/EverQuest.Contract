const HotPocket = require("hotpocket-nodejs-contract");
const { Controller } = require("./controller");
const { DBInitializer } = require("./Data.Deploy/initDB");
const bson = require("bson");
const {SharedService} = require("./Services/Common.Services/SharedService");


const everquestContract = async (ctx) => {
    console.log('Everquest contract is running.');
    SharedService.context = ctx;
    const isReadOnly = ctx.readonly;

    const controller = new Controller();

    // Initialize database
    await DBInitializer.init();

    for (const user of ctx.users.list()) {

        // Loop through inputs sent by each user.
        for (const input of user.inputs) {

            // Read the data buffer sent by user (this can be any kind of data like string, json or binary data).
            const buf = await ctx.users.read(input);

            let message = null;
            // Let's assume all data buffers for this contract are JSON,   but for contract upload, it is BSON
            try {
                message = JSON.parse(buf);
            } catch (e) {
                message = bson.deserialize(buf);
            }

            // Pass the JSON message to our application logic component.
            await controller.handleRequest(user, message, isReadOnly);
        }
    }
}

const hpc = new HotPocket.Contract();
hpc.init(everquestContract);