require('dotenv').config();
const fs = require("fs");
const path = require("path");
const readline = require("readline");
const  { TelegramClient, Api } = require("telegram");
const { StringSession } = require("telegram/sessions");
const { NewMessage } = require('telegram/events');
const startParsing = require("./startParsing/startParsing");

const apiId = Number(process.env.API_ID); /* (Сan be obtained when registering the application on https://my.telegram.org/auth) */
const apiHash = process.env.API_HASH; /* (Сan be obtained when registering the application on https://my.telegram.org/auth) */
const adminsId = (process.env.ADMINS_ID).split(","); /* (Line with telegram id of users who can start parsing) */
const checkedSites = (process.env.CHECKED_SITES).split(","); /* (String with the names of sites for parsing, for example "prom,olx,rozetka") */
const chatId = process.env.CHAT_ID; /* (ID of the chat where the data will be displayed) */

const stringSession = new StringSession(process.env.TG_SESSION); /* (Connection hash, copy from the console after the first successful connection) */

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});


const telegramClient = async () => {

    const client = new TelegramClient(stringSession, apiId, apiHash, {
        connectionRetries: 5,
    });
    // --------------------------------------
    // When you first connect, you need to enter your phone number, code and confirmation code (will come in a message), the connection hash will be displayed in the console, copy it to stringSession for further connections
    await client.start({
        phoneNumber: process.env.MY_PHONE,
        password: process.env.MY_PASSWORD,
        phoneCode: async () =>
        new Promise((resolve) =>
            rl.question("Please enter the code you received: ", resolve)
        ),
        onError: (err) => console.log(err),
    });
    console.log("You should now be connected.");
    console.log(client.session.save());  /* (when connecting for the first time, enter in stringSession) */
    // --------------------------------------
    //  Message handler will start parsing and sending. The message should consist of the name of the site, the number of pages being checked and the name of the product (example: розетка 10 детские игрушки)
    client.addEventHandler(async (event) => {
    const message = event.message;
    if(message.peerId.channelId == chatId 
        && (!message.fromId 
        || adminsId.includes(String(message.fromId.userId)))) {
        const queryArray = message.message.split(" ");
        const siteName = queryArray[0].toLowerCase();
        const numberOfPages = Number(queryArray[1]);
        const itemToCheck = queryArray.slice(2).join(" ")
        if (checkedSites.includes(siteName) && Number.isInteger(numberOfPages) && numberOfPages > 0) {
            await startParsing(siteName, numberOfPages, itemToCheck)
                .then(async (arr) => {
                    while(arr.length) {
                        let shop = arr.pop();
                        await sendMessage(client, shop)
                    }
            });
        }
        };
    }, new NewMessage({}))
};

telegramClient();



async function sendMessage(client, data) {
    let title = data.shift();
    let message = `${title} \n
                    \n`;

    while(data.length) {
        let number = data.pop();
        try {
            let sellerObject = await getSellerInfo(client, number); 
            message += `phone: ${sellerObject.phone}\n 
                        firstName: ${sellerObject.firstName} \n
                        lastName: ${sellerObject.lastName} \n
                        nickName: ${sellerObject.username} \n
                        id: ${sellerObject.id} \n
                        \n`;
        } catch (e) {
            console.log({message: `Number not found in database: ${e}`});
            message += `phone: ${number}\n
                        The number is not connected to telegram\n
                        \n`;
        }
    }
    
    try {
        const entity = await client.getEntity(process.env.CHAT_NAME);
        await client.invoke(new Api.messages.SendMessage({
            peer: entity,
            message: message
        }))
    } catch (e) {
        console.log({message: `Error sending message: ${e}`});
    }
}


async function getSellerInfo(client, number) {
    try {
        await client.connect();
        const result = await client.invoke(
          new Api.contacts.ResolvePhone({
            phone: number,
          })
        );
        let data = {
          id: Number(result.users[0].id.value),
          firstName: result.users[0].firstName,
          lastName: result.users[0].lastName,
          username: result.users[0].username,
          phone: result.users[0].phone
        }; 
        // await client.disconnect();
        return data;
    } catch (e) {
        console.log({message: `Failed to process the number. Error: ${e}`});
        return {};
    }
}
