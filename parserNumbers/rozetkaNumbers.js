require('dotenv').config();
const puppeteer = require('puppeteer');
const { findPhoneNumbersInText } = require('libphonenumber-js');
const parsingRozetkaLinks = require("../parserLinks/rozetkaLinks");
const rozetkaSettings = require("../siteSettings/rozetkaSettings");

async function parsingRozetkaNumbers(links) {

    const sellerShopName = rozetkaSettings.sellerShopName;
    const sellersArray = [];

    if (!links.length) {
        return sellersArray;
    }

    const browser = await puppeteer.launch({
        headless: false
    });
    const page = await browser.newPage();
    await page.setViewport({
        width: 1200,
        height: 800
    });

    while (links.length) {
        let url = links.shift();
        try {
            await page.goto(url);
            let seller = [];
            let title = await page.$eval(sellerShopName, e => e.textContent.trim().split(" ").slice(1).join(" "));
            seller.push(title);
            let body = await page.$eval("body", e => e.innerHTML);
            let arr = findPhoneNumbersInText(body);
            arr.forEach(i => {
                if (i.number.number[4] !== "4") {
                    seller.push(i.number.number)
                }
            })
            sellersArray.push(seller);
        } catch (e) {
            console.log({message: `Broken link: error ${e}`});
        }
    }

    await browser.close();
    return sellersArray;
};
parsingRozetkaLinks("https://rozetka.com.ua/", "детские игрушки", 2).then((links) => parsingRozetkaNumbers(links)).then(arr => console.log(arr));
// parsingRozetkaNumbers(links).then(arr => console.log(arr));

module.exports = parsingRozetkaNumbers;
