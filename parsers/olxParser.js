require('dotenv').config();
const puppeteer = require('puppeteer');
const {startPageUrl,
        littleInterval,
        middleInterval,
        bigInterval,
        otherSellersInterval,
        searchInput,
        searchButton,
        productCardSelector,
        nextButtonSelector,
        showPhoneButton,
        contactPhone,
        sellerName} = require("../siteSettings/olxSettings");


async function parsingOlxNumbers(siteName, pagesToParse, searchRequest) {

    let linksArray = [];
    let sellersData = [];

    let url;
    if (siteName.toLowerCase() === "олх" || siteName.toLowerCase() === "olx") {
        url = startPageUrl;
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
        await new Promise(resolve => { setTimeout(resolve, middleInterval)});
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
    
    while(linksArray.length) {
        let url = linksArray.pop();
        let sellerData = [];
        try {
            await page.goto(url);
            await page.waitForSelector(showPhoneButton, {timeout: 5000});
            await new Promise(resolve => { setTimeout(resolve, littleInterval)});
            let button = await page.$(showPhoneButton);
            let name = await page.$eval(sellerName, e => e.textContent);
            name ? sellerData.push(name) : sellerData.push("No name");
            await button.click();
            await page.waitForSelector(contactPhone, {timeout: 5000});
            let rawPhone = await page.$eval(contactPhone, e => e.textContent);
            let phoneNumber = rawPhone.split(" ").join("").split("-").join("");
            phoneNumber.length === 10 ? phoneNumber = "+38" + phoneNumber : null;
            phoneNumber ? sellerData.push(phoneNumber) : null;
        } catch (e) {
            console.log({message: `Wrong link: ${e}`});
        }
        sellerData.length ? sellersData.push(sellerData) : null;
    }
    console.log(linksArray.length);
    return sellersData;
};
// parsingOlxNumbers("olx", 1, "автомобиль").then((e) => console.log(e));

module.exports = parsingOlxNumbers;