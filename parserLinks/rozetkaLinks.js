require('dotenv').config();
const puppeteer = require('puppeteer');
const rozetkaSettings = require("../siteSettings/rozetkaSettings");

async function parsingRozetkaLinks(url, searchRequest, pagesToParse) {

    const littleInterval = rozetkaSettings.littleInterval;
    const middleInterval = rozetkaSettings.middleInterval;
    const bigInterval = rozetkaSettings.bigInterval;
    let searchInput = rozetkaSettings.searchInput;
    let searchButton = rozetkaSettings.searchButton;
    let productCardSelector = rozetkaSettings.productCardSelector;
    let nextButtonSelector = rozetkaSettings.nextButtonSelector;
    let anotherSellersRuButtonSelector = rozetkaSettings.anotherSellersRuButtonSelector;
    let anotherSellersUaButtonSelector = rozetkaSettings.anotherSellersUaButtonSelector;
    let linkToSellerPageSelector = rozetkaSettings.linkToSellerPageSelector;
    let linksArray = [];
    let sellersLinks = [];
   
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
    await new Promise(resolve => { setTimeout(resolve, bigInterval)});

    let anotherSellersRuButton = await page.$(anotherSellersRuButtonSelector);
    let anotherSellersUaButton = await page.$(anotherSellersUaButtonSelector);

    if (anotherSellersRuButton) {
        await anotherSellersRuButton.click();
    } else if (anotherSellersUaButton) {
        await anotherSellersUaButton.click();
    } else {
        await browser.close();
        return linksArray;
    }

    await new Promise(resolve => { setTimeout(resolve, bigInterval)});

    while(pagesToParse) {
        // await new Promise(resolve => { setTimeout(resolve, littleInterval)});
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

    if (!linksArray.length) {
        await browser.close();
        return linksArray;
    } else {
        try {
            while (linksArray.length) {
                let url = linksArray.pop();
                await page.goto(url);
                await page.waitForSelector(linkToSellerPageSelector);
                let title = await page.evaluate(async (selector) => {
                    let b = document.querySelector(selector)
                    return b.href;
                }, linkToSellerPageSelector)
                if (!sellersLinks.includes(title)) {
                    sellersLinks.push(title);
                }
            }
        } catch (e) {
            console.log({message: `Failed to get seller links: ${e}`});
        }
    }

    await browser.close();
    console.log(sellersLinks);
    return sellersLinks;
};
parsingRozetkaLinks("https://rozetka.com.ua/", "детские игрушки", 2).then((e) => console.log(e));

module.exports = parsingRozetkaLinks;
