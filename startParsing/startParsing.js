const parsingRozetkaNumbers = require("../parsers/rozetkaParser");
const parsingPromNumbers = require("../parsers/promParser");

async function startParsing(siteName, numberOfPages, itemToCheck) {
    let arr = [];
    switch(siteName) {
        case "rozetka":
        case "розетка":
            arr = parsingRozetkaNumbers(siteName, numberOfPages, itemToCheck);
            return arr;
           
        case "prom":
        case "пром":
            arr = parsingPromNumbers(siteName, numberOfPages, itemToCheck);
            return arr;
        default:
            return arr;
    } 
}

module.exports = startParsing;
// rozetkaLinks(siteName, numberOfPages, itemToCheck).then((arr) => console.log(arr))