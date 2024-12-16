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
        sellerName} = require("./siteSettings/olxSettings");


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
        await new Promise(resolve => { setTimeout(resolve, littleInterval)});
        if (button) {
            await button.click();
            await new Promise(resolve => { setTimeout(resolve, littleInterval)});
            pagesToParse--;
        } else {
            pagesToParse = 0;
        }
    }
    
    console.log(linksArray.length);
    // --------------------------------------------------
    // await browser.close();
    while(linksArray.length) {
        // let subArr = linksArray.splice(0, 13).reverse();
        // let cookies;
        // let start = 0;
        // while (subArr.length) {
            let url = await linksArray.pop();
            // let url = await subArr.pop();
            console.log(url);
            let sellerData = [];
            try {
                // if (start === 0) {
                //     start++;
                //     await page.goto(url);
                //     await new Promise(resolve => { setTimeout(resolve, forCookiesInterval)});
                //     let newCookies = await browser.cookies()
                //     fs.writeFileSync(path.resolve(__dirname, "cookies.json"), JSON.stringify(newCookies, null, 2));
                //     cookies = JSON.parse(fs.readFileSync(path.resolve(__dirname, "cookies.json"), {encoding: "utf8"}));
                // } else {
                //     cookies.forEach(async (i) => {
                //         await page.setCookie(i) 
                //     })
                    await page.goto(url);
                // }
    
                await page.waitForSelector(showPhoneButton, {timeout: 30000});
                await new Promise(resolve => { setTimeout(resolve, littleInterval)});
                let button = await page.$(showPhoneButton);
                if (button) {
                    let name = await page.$eval(sellerName, e => e.textContent);
                    name ? sellerData.push(name) : sellerData.push("No name");
                    await button.click();
                    await new Promise(resolve => { setTimeout(resolve, 2000)});
                    await button.click();
                    await page.waitForSelector(contactPhone, {timeout: 10000});
                    let rawPhone = await page.$eval(contactPhone, e => e.textContent);
                    let phoneNumber = rawPhone.split(" ").join("").split("-").join("").replace(/[\)\()]/g, "");
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
        // }
        const allCookies = await page.cookies(url);
        await page.deleteCookie(...allCookies);
        await page.evaluate(() => {
            localStorage.clear();
        });
    }
    await browser.close();
    // --------------------------------------------------
    return sellersData;
};
parsingOlxNumbers("olx", 1, "автомобиль").then((e) => console.log(e));

module.exports = parsingOlxNumbers;

// const fs = require("fs");
// const path = require("path");
// require('dotenv').config();
// const puppeteer = require('puppeteer');
// const {startPageUrl,
//         littleInterval,
//         middleInterval,
//         bigInterval,
//         forCookiesInterval,
//         hideParserWindow,
//         searchInput,
//         searchButton,
//         productCardSelector,
//         nextButtonSelector,
//         showPhoneButton,
//         contactPhone,
//         sellerName} = require("./siteSettings/olxSettings");


// async function parsingOlxNumbers(siteName, pagesToParse, searchRequest) {

//     let linksArray = [];
//     let sellersData = [];

//     let url;
//     if (siteName.toLowerCase() === "олх" || siteName.toLowerCase() === "olx") {
//         url = startPageUrl;
//     }
   
//     const browser = await puppeteer.launch({
//         headless: hideParserWindow,
//         args: [ '--proxy-server=socks5://127.0.0.1:9050' ]
//     });
//     const page = await browser.newPage();
//     await page.setViewport({width: 1200, height: 800});
  
//     try {
//         await page.goto(url);
//         await new Promise(resolve => { setTimeout(resolve, middleInterval)});
//         await page.type(searchInput, searchRequest, {delay: 120});
//         await page.click(searchButton);
//         await new Promise(resolve => { setTimeout(resolve, middleInterval)});
//     } catch (e) {
//         console.log({message: `Сonnection time exceeded. Try again. Error: ${e}`});
//         await browser.close();
//         return sellersData;
//     }

//     while(pagesToParse) {
//         await new Promise(resolve => { setTimeout(resolve, middleInterval)});
//         let arr = await page.evaluate((selector) => {
//             let arr = Array.from(document.querySelectorAll(selector), e => e.href);
//             return arr;
//         }, productCardSelector)
//         await new Promise(resolve => { setTimeout(resolve, middleInterval)});
//         linksArray = [...linksArray, ...arr];
//         let button = await page.$(nextButtonSelector);
//         if (button) {
//             await button.click();
//             pagesToParse--;
//         } else {
//             pagesToParse = 0;
//         }
//     }
    
//     console.log(linksArray.length);
//     // --------------------------------------------------
//     // await browser.close();
//     while(linksArray.length) {
//         let subArr = linksArray.splice(0, 13).reverse();
//         // const browser = await puppeteer.launch({
//         //     headless: false,
//         //     args: [ '--proxy-server=socks5://127.0.0.1:9050' ]
//         // });
//         // const page = await browser.newPage();
//         // await page.setViewport({
//         //     width: 1200,
//         //     height: 800
//         // });

//         // let cookies;
//         // let pageLocalStorage;
//         // let start = 0;
//         while (subArr.length) {
//             let url = await subArr.pop();
//             console.log(url);
//             let sellerData = [];
//             try {
//                 // if (start === 0) {
//                 //     start++;
//                 //     await page.goto(url);
//                 //     await new Promise(resolve => { setTimeout(resolve, 6000)});
//                     // let newCookies = await browser.cookies()
//                     // fs.writeFileSync(path.resolve(__dirname, "cookies.json"), JSON.stringify(newCookies, null, 2));
//                     // cookies = JSON.parse(fs.readFileSync(path.resolve(__dirname, "cookies.json"), {encoding: "utf8"}));
//                     // await page.evaluate(() => {
//                     //     let items = {};
//                     //     for (let i = 0; i < localStorage.length; i++) {
//                     //         const key = localStorage.key(i);
//                     //         items[key] = localStorage.getItem(key);
//                     //     }
//                     //     return items;
//                     // }).then((data) => pageLocalStorage = data);
//                     // fs.writeFileSync(path.resolve(__dirname, "localStore.json"), JSON.stringify(pageLocalStorage, null, 2));
//                 // } else {
//                     await page.goto(url);
//                     // cookies.forEach(async (i) => {
//                     //     await page.setCookie(i) 
//                     // });
//                     // await page.target().createCDPSession();
//                     // await page.goto(url);
//                     // await page.evaluate(() => {
//                     //     localStorage.clear();
//                     // });
//                     // await page.evaluate((data) => {
//                     //     for (let key in data) {
//                     //         localStorage.setItem(key, data[key]);
//                     //     }
//                     // }, pageLocalStorage);
//                 // }
    
//                 // let phoneBtn = await page.waitForSelector(showPhoneButton, {timeout: 10000});
//                 await new Promise(resolve => { setTimeout(resolve, 6000)});
//                 let button = await page.$(showPhoneButton);
//                 if (button) {
//                     let name = await page.$eval(sellerName, e => e.textContent);
//                     name ? sellerData.push(name) : sellerData.push("No name");
//                     await button.click();
//                     await new Promise(resolve => { setTimeout(resolve, 1000)});
//                     await button.click();
//                     let phoneBtn = await page.waitForSelector(contactPhone, {timeout: 10000});
//                     let rawPhone = await page.$eval(contactPhone, e => e.textContent);
//                     await phoneBtn.dispose();
//                     let phoneNumber = rawPhone.split(" ").join("").split("-").join("").replace(/[\)\()]/g, "");
//                     phoneNumber.length === 10 ? phoneNumber = "+38" + phoneNumber : null;
//                     phoneNumber.length === 11 ? phoneNumber = "+3" + phoneNumber : null;
//                     phoneNumber.length === 12 ? phoneNumber = "+" + phoneNumber : null;
//                     phoneNumber ? sellerData.push(phoneNumber) : null;
//                 }
//                 // await phoneBtn.dispose();
//             } catch (e) {
//                 console.log({message: `Wrong link: ${e}`});
//             }
//             console.log(sellerData);
//             sellerData.length ? sellersData.push(sellerData) : null;
         
//         }
//         const allCookies = await page.cookies(url);
//         await page.deleteCookie(...allCookies);
//         await page.evaluate(() => {
//             localStorage.clear();
//         });
//     }
//     await browser.close();
//     // --------------------------------------------------
//     return sellersData;
// };
// parsingOlxNumbers("olx", 2, "квартира").then((e) => console.log(e));

// module.exports = parsingOlxNumbers;

// // ---------------------------------------------------
// const puppeteer = require('puppeteer');

// (async () => {
//   const browser = await puppeteer.launch({
//     headless: false,
//     args: ['--proxy-server=socks5://127.0.0.1:9050']
//   });
//   let a = 20;
//   const page = await browser.newPage();
//   while(a) {
//     await page.goto('https://check.torproject.org');
//     let ip = await page.$eval("strong", e => e.textContent)
//     console.log(ip)
//     await new Promise(resolve => { setTimeout(resolve, 60000)})
//     a--
//   }
  

//   // Rest of your code...

// //   await browser.close();
// })();

// ---------------------------------------
