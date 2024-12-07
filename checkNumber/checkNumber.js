require('dotenv').config();
const  { TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");
const readline = require("readline");

const apiId = process.env.API_ID;
const apiHash = process.env.API_HASH;
const stringSession = new StringSession(""); // fill this later with the value from session.save()

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

(async () => {
  console.log("Loading interactive example...");
  const client = new TelegramClient(stringSession, apiId, apiHash, {
    connectionRetries: 5,
  });
  await client.start({
    phoneNumber: async () =>
      new Promise((resolve) =>
        rl.question("Please enter your number: ", resolve)
      ),
    password: async () =>
      new Promise((resolve) =>
        rl.question("Please enter your password: ", resolve)
      ),
    phoneCode: async () =>
      new Promise((resolve) =>
        rl.question("Please enter the code you received: ", resolve)
      ),
    onError: (err) => console.log(err),
  });
  console.log("You should now be connected.");
  console.log(client.session.save()); // Save this string to avoid logging in again
  await client.sendMessage("me", { message: "Hello!" });
})();







// require('dotenv').config();
// const fs = require("fs");
// const path = require("path");
// const puppeteer = require('puppeteer');
// const { findPhoneNumbersInText } = require('libphonenumber-js');
// const rozetkaSettings = require("../siteSettings/rozetkaSettings");
// const rozetkaLinks = require("../parserLinks/rozetkaLinks");
// const rozetkaNumbers = require("../parserNumbers/rozetkaNumbers");

// // https://rozetka.com.ua/ua/seller/decormatters/
// // https://rozetka.com.ua/ua/seller/barabel/
// // https://rozetka.com.ua/ua/seller/riamon/
// // https://rozetka.com.ua/ua/seller/b-group/
// // https://rozetka.com.ua/ua/seller/superiorshop/
// // https://rozetka.com.ua/ua/seller/fono-market/
// // https://rozetka.com.ua/ua/seller/sweettex/
// // https://rozetka.com.ua/ua/seller/alferats/


// async function parser(link) {
    
//     const browser = await puppeteer.launch({
//         headless: false
//     });
//     const page = await browser.newPage();
//     await page.goto(link);
//     await page.setViewport({
//         width: 1200,
//         height: 800
//     })
//     let a = await page.evaluate(async () => {
//         let shorts = document.querySelectorAll("body");
//         let ar = shorts[0].innerHTML;
//         return ar;
//     })
//     console.log(a);
//     fs.writeFileSync(path.resolve(__dirname, "..", "hello.html"), a);

//     // let ax = findPhoneNumbersInText(a)

//     await browser.close();


//     return a;
// };
// parser("https://rozetka.com.ua/ua/seller/sweettex/").then(/* (l) => console.log(l) */);
// // module.exports = parser;