require('dotenv').config();
const fs = require("fs");
const path = require("path");
const puppeteer = require('puppeteer');
const { findPhoneNumbersInText } = require('libphonenumber-js');

async function parser(url) {
   
    const browser = await puppeteer.launch({
        headless: false
    });
    const page = await browser.newPage();
    await page.goto(url);
    await page.setViewport({
        width: 1200,
        height: 800
    });
    let linkToSellerPageSelector = ".seller-title > .min-w-0.ng-star-inserted > .ng-star-inserted";
    await page.waitForSelector(linkToSellerPageSelector);
    let title = await page.$(linkToSellerPageSelector);
    let a = await page.evaluate(async (x) => {
        let b = document.querySelector(x)
        return b.href;
    }, linkToSellerPageSelector)
    // let b = await page.$(linkToSellerPageSelector);
    // let a = await b.href;
    console.log(await a);

    // let a = await page.$(".title__font.ng-star-inserted")
    // await console.log(a.textContent);

    // let a = await page.evaluate(async () => {
    //     let shorts = document.querySelectorAll("body");
    //     let ar = shorts[0].innerHTML;

    //     let ids = document.querySelectorAll(".product-link.goods-tile__heading")
    //     let idsArr = []
    //     ids.forEach(i => {
    //         idsArr.push(i.href.split("/")[5])})
    //     return {ar, idsArr};
    // })

    // let arr = findPhoneNumbersInText(a.ar)
    
    // await browser.close();
    return /* arr */;
};
parser("https://rozetka.com.ua/ua/451874729/p451874729/");
// module.exports = parser;