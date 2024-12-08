require('dotenv').config();
const puppeteer = require('puppeteer');
const rozetkaSettings = require("../siteSettings/rozetkaSettings");

async function parsingRozetkaLinks(siteName, pagesToParse, searchRequest) {
 
    const littleInterval = rozetkaSettings.littleInterval;
    const middleInterval = rozetkaSettings.middleInterval;
    const bigInterval = rozetkaSettings.bigInterval;
    const otherSellersInterval = rozetkaSettings.otherSellersInterval;
    let searchInput = rozetkaSettings.searchInput;
    let searchButton = rozetkaSettings.searchButton;
    let productCardSelector = rozetkaSettings.productCardSelector;
    let nextButtonSelector = rozetkaSettings.nextButtonSelector;
    let confirmAgeButton = rozetkaSettings.confirmAge;
    let anotherSellersUaButtonSelector = rozetkaSettings.anotherSellersUaButtonSelector;
    let linkToSellerPageSelector = rozetkaSettings.linkToSellerPageSelector;
    let linksArray = [];
    let sellersLinks = [];

    let url;
    if (siteName.toLowerCase() === "розетка" || siteName.toLowerCase() === "rozetka") {
        url = rozetkaSettings.startPageUrl;
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

    await new Promise(resolve => { setTimeout(resolve, otherSellersInterval)});

    try {
        let confirmAge = await page.$(confirmAgeButton);
        await confirmAge.click();
    } catch (e) {
        console.log({message: `Age confirmation button not found: ${e}`})
    }
    try {
        await page.waitForSelector(anotherSellersUaButtonSelector, {timeout: 12000});
        let anotherSellersUaButton = await page.$(anotherSellersUaButtonSelector);
        await anotherSellersUaButton.click();
        await new Promise(resolve => { setTimeout(resolve, bigInterval)});
    } catch (e) {
        await browser.close();
        console.log(`This product is sold only by Rozetka, or there is a connection error: ${e}`);
        return {linksArray, message: `This product is sold only by Rozetka, or there is a connection error: ${e}`};
    }

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
    console.log(linksArray.length);
    if (!linksArray.length) {
        await browser.close();
        return linksArray;
    } else {
        while (linksArray.length) {
            try {
                let url = linksArray.pop();
                await page.goto(url);
                await page.waitForSelector(linkToSellerPageSelector, {timeout: 10000});
                let title = await page.evaluate(async (selector) => {
                    let b = document.querySelector(selector)
                    return b.href;
                }, linkToSellerPageSelector)
                if (!sellersLinks.includes(title)) {
                    sellersLinks.push(title);
                    console.log(title);
                }
            } catch (e) {
                console.log({message: `Broken link: ${e}`});
            }
        }
    }

    await browser.close();
    console.log(sellersLinks);
    return sellersLinks;
};
// parsingRozetkaLinks("Rozetka", 2, "ножи").then((e) => console.log(e));

module.exports = parsingRozetkaLinks;
