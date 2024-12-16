const fs = require("fs");
const path = require("path");
require('dotenv').config();
const puppeteer = require('puppeteer');
const {startPageUrl,
        littleInterval,
        middleInterval,
        bigInterval,
        forCookiesInterval,
        hideParserWindow,
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
        headless: hideParserWindow,
        args: [ '--proxy-server=socks5://127.0.0.1:9050' ]
    });
    const page = await browser.newPage();
    await page.goto(url);
    await page.setViewport({width: 1200, height: 800});
  
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
    
    console.log(linksArray.length);
    // --------------------------------------------------
    await browser.close();
    while(linksArray.length) {
        let subArr = linksArray.splice(0, 52).reverse();
        const browser = await puppeteer.launch({
            headless: false,
            args: [ '--proxy-server=socks5://127.0.0.1:9050' ]
        });
        const page = await browser.newPage();
        await page.setViewport({
            width: 1200,
            height: 800
        });

        let cookies;
        let start = 0;
        while (subArr.length) {
            let url = await subArr.pop();
            console.log(url);
            let sellerData = [];
            try {
                if (start === 0) {
                    start++;
                    await page.goto(url);
                    await new Promise(resolve => { setTimeout(resolve, forCookiesInterval)});
                    let newCookies = await browser.cookies()
                    fs.writeFileSync(path.resolve(__dirname, "cookies.json"), JSON.stringify(newCookies, null, 2));
                    cookies = JSON.parse(fs.readFileSync(path.resolve(__dirname, "cookies.json"), {encoding: "utf8"}));
                } else {
                    cookies.forEach(async (i) => {
                        await page.setCookie(i) 
                    })
                    await page.goto(url);
                }
    
                await page.waitForSelector(showPhoneButton, {timeout: bigInterval});
                await new Promise(resolve => { setTimeout(resolve, littleInterval)});
                let button = await page.$(showPhoneButton);
                if (button) {
                    let name = await page.$eval(sellerName, e => e.textContent);
                    name ? sellerData.push(name) : sellerData.push("No name");
                    await button.click();
                    await page.waitForSelector(contactPhone, {timeout: 7000});
                    let rawPhone = await page.$eval(contactPhone, e => e.textContent);
                    let phoneNumber = rawPhone.split(" ").join("").split("-").join("");
                    phoneNumber.length === 10 ? phoneNumber = "+38" + phoneNumber : null;
                    phoneNumber.length === 11 ? phoneNumber = "+3" + phoneNumber : null;
                    phoneNumber.length === 12 ? phoneNumber = "+" + phoneNumber : null;
                    phoneNumber ? sellerData.push(phoneNumber) : null;
                }
            } catch (e) {
                console.log({message: `Wrong link: ${e}`});
            }
            console.log(sellerData);
            sellerData.length ? sellersData.push(sellerData) : null;
        }
        await browser.close();
    }
    // --------------------------------------------------
    return sellersData;
};
parsingOlxNumbers("olx", 3, "автомобиль").then((e) => console.log(e));

module.exports = parsingOlxNumbers;
