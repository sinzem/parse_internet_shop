// const { Api, TelegramClient } = require('telegram');
// const { StringSession } = require('telegram/sessions');
require('dotenv').config();
const fs = require("fs");
const path = require("path");
const puppeteer = require('puppeteer');
const { findPhoneNumbersInText } = require('libphonenumber-js');
const rozetkaSettings = require("../siteSettings/rozetkaSettings");
const rozetkaLinks = require("../parserLinks/rozetkaLinks");
const rozetkaNumbers = require("../parserNumbers/rozetkaNumbers");

// https://rozetka.com.ua/ua/seller/decormatters/
// https://rozetka.com.ua/ua/seller/barabel/
// https://rozetka.com.ua/ua/seller/riamon/
// https://rozetka.com.ua/ua/seller/b-group/
// https://rozetka.com.ua/ua/seller/superiorshop/
// https://rozetka.com.ua/ua/seller/fono-market/
// https://rozetka.com.ua/ua/seller/sweettex/
// https://rozetka.com.ua/ua/seller/alferats/


async function parser(link) {
    
    const browser = await puppeteer.launch({
        headless: false
    });
    const page = await browser.newPage();
    await page.goto(link);
    await page.setViewport({
        width: 1200,
        height: 800
    })
    let a = await page.evaluate(async () => {
        let shorts = document.querySelectorAll("body");
        let ar = shorts[0].innerHTML;
        return ar;
    })
    console.log(a);
    fs.writeFileSync(path.resolve(__dirname, "..", "hello.html"), a);

    // let ax = findPhoneNumbersInText(a)

    await browser.close();


    return a;
};
parser("https://rozetka.com.ua/ua/seller/sweettex/").then(/* (l) => console.log(l) */);
// module.exports = parser;