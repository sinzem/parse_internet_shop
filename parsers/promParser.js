require('dotenv').config();
const puppeteer = require('puppeteer');
const { findPhoneNumbersInText } = require('libphonenumber-js');
const {startPageUrl, 
    littleInterval,
    middleInterval,
    bigInterval,
    searchInput,
    searchButton,
    sellerPage,
    nextButtonSelector,
    contactsButton,
    sellerName} = require("../siteSettings/promSettings");


async function parsingPromNumbers(siteName, pagesToParse, searchRequest) {

    let linksArray = [];
    let sellersData = [];

    let url;
    if (siteName.toLowerCase() === "пром" || siteName.toLowerCase() === "prom") {
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

    try {
        await new Promise(resolve => { setTimeout(resolve, bigInterval)});
        await page.type(searchInput, searchRequest, {delay: 120});
        await page.click(searchButton);
        await new Promise(resolve => { setTimeout(resolve, bigInterval)});
    } catch (e) {
        console.log({message: `Failed to start search: ${e}`});
        return sellersData;
    }
    

    while(pagesToParse) {
        await new Promise(resolve => { setTimeout(resolve, littleInterval)});
        let arr = await page.evaluate(async (selector, littleInterval) => {
            let height = 2500;
            while (height) {
                document.scrollingElement.scrollBy(0, 100);
                height -= 100;
                await new Promise(resolve => { setTimeout(resolve, 100); });
            }
            await new Promise(resolve => { setTimeout(resolve, littleInterval)});
            let arr = Array.from(document.querySelectorAll(selector), e => e.href);
            return arr;
        }, sellerPage, littleInterval)
       
        arr.forEach(e => {
            if (!linksArray.includes(e)) {
                linksArray.push(e);
            }
        })
        let button = await page.$(nextButtonSelector);
        if (button) {
            await button.click();
            pagesToParse--;
        } else {
            pagesToParse = 0;
        }
    }
    
    while (linksArray.length) {
        let link = linksArray.pop();
        let sellerData = []

        try {
            await page.goto(link);
            await page.waitForSelector(contactsButton, {timeout: 15000});
            await new Promise(resolve => { setTimeout(resolve, littleInterval)});
            let name = await page.$eval(sellerName, e => e.textContent);
            sellerData.push(name);
            await page.click(contactsButton);
            await new Promise(resolve => { setTimeout(resolve, littleInterval)});
            let body = await page.$eval("body", e => e.innerHTML);
            let arr = findPhoneNumbersInText(body);
            arr.forEach(i => {
                if (!sellerData.includes(i.number.number)) {
                    sellerData.push(i.number.number);
                }
            })
        } catch (e) {
            console.log({message: `Wrong link: ${e}`});
        }

        if (sellerData.length) {
            sellersData.push(sellerData);
        }
    }
    
    await browser.close();
    console.log(sellersData);
    return sellersData;
};
// parsingPromNumbers("пром", 2, "покрывало").then((e) => console.log(e));

module.exports = parsingPromNumbers;