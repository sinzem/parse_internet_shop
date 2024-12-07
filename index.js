require('dotenv').config();
const fs = require("fs");
const path = require("path");
const puppeteer = require('puppeteer');
const { findPhoneNumbersInText } = require('libphonenumber-js');
const rozetkaSettings = require("./siteSettings/rozetkaSettings");
const rozetkaLinks = require("./parserLinks/rozetkaLinks");
const rozetkaNumbers = require("./parserNumbers/rozetkaNumbers");

// let links = [
//     'https://rozetka.com.ua/ua/451874729/p451874729/',
//     'https://rozetka.com.ua/ua/451874708/p451874708/',
//     'https://rozetka.com.ua/ua/451874720/p451874720/',
//     'https://rozetka.com.ua/ua/ergo-43gus8500/p362684409/',
//     'https://rozetka.com.ua/ua/451874741/p451874741/',

//   ]

async function parser(/* links */) {
    let arr = [];
    console.log(new Date())
    rozetkaLinks("https://rozetka.com.ua/", "детские игрушки", 15)
        .then((links) => rozetkaNumbers(links))
        .then((nums) => {
            fs.writeFileSync(path.resolve(__dirname, "sellers.json"), JSON.stringify(nums));
            arr = [...arr, ...nums];
        }).then(() => console.log(new Date())).catch((e) => console.log(e))
    
    // const browser = await puppeteer.launch({
    //     headless: false
    // });
    // const page = await browser.newPage();
    // // await page.goto(url);
    // await page.setViewport({
    //     width: 1200,
    //     height: 800
    // });
    // let sellersLinks = [];
    // let linkToSellerPageSelector = rozetkaSettings.linkToSellerPageSelector;
    // while (links.length) {
    //     try {
    //         let url = links.pop();
    //         await page.goto(url);
    //         await page.waitForSelector(linkToSellerPageSelector, {timeout: 10000});
    //         let title = await page.evaluate(async (selector) => {
    //             let b = document.querySelector(selector)
    //             return b.href;
    //         }, linkToSellerPageSelector)
    //         if (!sellersLinks.includes(title)) {
    //             sellersLinks.push(title);
    //         }
    //     } catch (e) {
    //         console.log({message: `Broken link: ${e}`});
    //     }
    // }
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


    return arr;
};

parser(/* links */).then((l) => console.log(l));
// module.exports = parser;