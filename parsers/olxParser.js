require('dotenv').config();
const puppeteer = require('puppeteer');
const olxSettings = require("../siteSettings/olxSettings");


async function parsingOlxNumbers(siteName, pagesToParse, searchRequest) {

    const littleInterval = olxSettings.littleInterval;
    const middleInterval = olxSettings.middleInterval;
    const bigInterval = olxSettings.bigInterval;
    const otherSellersInterval = olxSettings.otherSellersInterval;
    let searchInput = olxSettings.searchInput;
    let searchButton = olxSettings.searchButton;
    let productCardSelector = olxSettings.productCardSelector;
    let nextButtonSelector = olxSettings.nextButtonSelector;

    let linksArray = [];

    let url;
    if (siteName.toLowerCase() === "олх" || siteName.toLowerCase() === "olx") {
        url = olxSettings.startPageUrl;
    }
   
    const browser = await puppeteer.launch({
        headless: false
    });
    const page = await browser.newPage();
    await page.goto(url);
    await page.setViewport({
        width: 1200,
        height: 800
    });

    await new Promise(resolve => { setTimeout(resolve, middleInterval)});
    await page.type(searchInput, searchRequest, {delay: 120});
    await page.click(searchButton);
    await new Promise(resolve => { setTimeout(resolve, middleInterval)});

    while(pagesToParse) {
        await new Promise(resolve => { setTimeout(resolve, littleInterval)});
        let arr = await page.evaluate((selector) => {
            let arr = Array.from(document.querySelectorAll(selector), e => e.href);
            return arr;
        }, productCardSelector)
        linksArray = [...linksArray, ...arr];
        let button = await page.$(nextButtonSelector);
        if (button) {
            await button.click();
            pagesToParse--;
        } else {
            pagesToParse = 0;
        }
    }
    // let body = await page.$eval("body", e => e.innerHTML);
    // let arr = findPhoneNumbersInText(body);
    return linksArray;
};
parsingOlxNumbers("olx", 2, "ножи").then((e) => console.log(e));

module.exports = parsingOlxNumbers;