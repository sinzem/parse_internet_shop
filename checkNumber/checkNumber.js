require('dotenv').config();
const fs = require("fs");
const path = require("path");
const  { TelegramClient, Api } = require("telegram");
const { StringSession } = require("telegram/sessions");
const readline = require("readline");

const apiId = Number(process.env.API_ID);
const apiHash = process.env.API_HASH;
const stringSession = new StringSession(process.env.TG_SESSION); 

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const checkNumber = async () => {
  
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
  await client.connect();
  const result = await client.invoke(
    new Api.contacts.ResolvePhone({
      phone: "+380990000000",
    })
  );
  console.log(result.users[0]/* .username */); 
  await client.disconnect();
};

checkNumber();



// // https://rozetka.com.ua/ua/seller/decormatters/
// // https://rozetka.com.ua/ua/seller/barabel/
// // https://rozetka.com.ua/ua/seller/riamon/
// // https://rozetka.com.ua/ua/seller/b-group/
// // https://rozetka.com.ua/ua/seller/superiorshop/
// // https://rozetka.com.ua/ua/seller/fono-market/
// // https://rozetka.com.ua/ua/seller/sweettex/
// // https://rozetka.com.ua/ua/seller/alferats/


