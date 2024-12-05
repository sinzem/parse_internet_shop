require('dotenv').config();
const fs = require("fs");
const path = require("path");
const puppeteer = require('puppeteer');
const { findPhoneNumbersInText } = require('libphonenumber-js');
const rozetkaSettings = require("../siteSettings/rozetkaSettings");
const parsingRozetkaLinks = require("../parserLinks/rozetkaLinks");

// let links = [
//     'https://rozetka.com.ua/ua/seller/stoffelly/',
//     'https://rozetka.com.ua/ua/seller/shef-life/',
//     'https://rozetka.com.ua/ua/seller/ropsy-smart/',
//     'https://rozetka.com.ua/ua/seller/elis-shop/'
// ];

let links = [
    'https://rozetka.com.ua/ua/seller/tdm/',
    'https://rozetka.com.ua/ua/seller/bft-shop/',
    'https://rozetka.com.ua/ua/seller/vonk/',
    'https://rozetka.com.ua/ua/seller/mr-joe/',
    'https://rozetka.com.ua/ua/seller/top-hub/',
    'https://rozetka.com.ua/ua/seller/full-moon/',
    'https://rozetka.com.ua/ua/seller/bebest/',
    'https://rozetka.com.ua/ua/seller/5fox/',
    'https://rozetka.com.ua/ua/seller/murrrmolla/',
    'https://rozetka.com.ua/ua/seller/bmgot/',
    'https://rozetka.com.ua/ua/seller/nanoshop/',
    'https://rozetka.com.ua/ua/seller/trendzy-goods/',
    'https://rozetka.com.ua/ua/seller/benefito/',
    'https://rozetka.com.ua/ua/seller/buyhere/',
    'https://rozetka.com.ua/ua/seller/teplosofa/',
    'https://rozetka.com.ua/ua/seller/real-time/',
    'https://rozetka.com.ua/ua/seller/bugitoy/',
    'https://rozetka.com.ua/ua/seller/urbandreams/',
    'https://rozetka.com.ua/ua/seller/svtlo/',
    'https://rozetka.com.ua/ua/seller/akulonok/',
    'https://rozetka.com.ua/ua/seller/halium/',
    'https://rozetka.com.ua/ua/seller/vsidoma/',
    'https://rozetka.com.ua/ua/seller/tweezy/',
    'https://rozetka.com.ua/ua/seller/good-kids/',
    'https://rozetka.com.ua/ua/seller/mkr/',
    'https://rozetka.com.ua/ua/seller/pro-stories/',
    'https://rozetka.com.ua/ua/seller/tehnestshop/',
    'https://rozetka.com.ua/ua/seller/funtomas/',
    'https://rozetka.com.ua/ua/seller/en-serio/',
    'https://rozetka.com.ua/ua/seller/btsshop/',
    'https://rozetka.com.ua/ua/seller/rekord/',
    'https://rozetka.com.ua/ua/seller/ukrainianfinds/',
    'https://rozetka.com.ua/ua/seller/rstq/',
    'https://rozetka.com.ua/ua/seller/mary-princess/',
    'https://rozetka.com.ua/ua/seller/sbt-group/',
    'https://rozetka.com.ua/ua/seller/primenest/',
    'https://rozetka.com.ua/ua/seller/loukoster/',
    'https://rozetka.com.ua/ua/seller/siess/',
    'https://rozetka.com.ua/ua/seller/kiddoland/',
    'https://rozetka.com.ua/ua/seller/mercadon/',
    'https://rozetka.com.ua/ua/seller/kaydzen/',
    'https://rozetka.com.ua/ua/seller/bright-future/',
    'https://rozetka.com.ua/ua/seller/icler/',
    'https://rozetka.com.ua/ua/seller/nterhom/',
    'https://rozetka.com.ua/ua/seller/bestdealyear/'
  ]
  

async function parsingRozetkaNumbers(links) {

    const sellerShopName = rozetkaSettings.sellerShopName;
    const sellersArray = [];
   
    const browser = await puppeteer.launch({
        headless: false
    });
    const page = await browser.newPage();
    await page.setViewport({
        width: 1200,
        height: 800
    });

    // await page.goto(links[0]);
    // let title = await page.$eval(".seller__heading.ng-star-inserted", e => e.textContent.trim().split(" ").slice(1).join(" "));
    // let body = await page.$eval("body", e => e.innerHTML);
    // let arr = findPhoneNumbersInText(body);
    // console.log(title);
    // console.log(arr);

    while (links.length) {
        let url = links.shift();
        await page.goto(url);
        let seller = [];
        let title = await page.$eval(".seller__heading.ng-star-inserted", e => e.textContent.trim().split(" ").slice(1).join(" "));
        seller.push(title);
        let body = await page.$eval("body", e => e.innerHTML);
        let arr = findPhoneNumbersInText(body);
        console.log(arr);
        arr.forEach(i => {
            if (i.number.number[4] !== "4") {
                seller.push(i.number.number)
            }
        })
        sellersArray.push(seller);
    }

    await browser.close();
    return sellersArray;
};
// parsingRozetkaLinks("https://rozetka.com.ua/", "детские игрушки", 8).then((links) => parsingRozetkaNumbers(links)).then(arr => console.log(arr));
parsingRozetkaNumbers(links).then(arr => console.log(arr));

module.exports = parsingRozetkaNumbers;
