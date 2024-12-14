const parsingRozetkaNumbers = require("../parsers/rozetkaParser");
const parsingPromNumbers = require("../parsers/promParser");
const parsingOlxNumbers = require("../parsers/olxParser");

async function startParsing(siteName, numberOfPages, itemToCheck) {
    let arr = [];
    switch(siteName) {
        case "rozetka":
        case "розетка":
            arr = await parsingRozetkaNumbers(siteName, numberOfPages, itemToCheck);
            return arr;
            // let arr = [["Sinzem Shop1", "+380995308473", "+30934104512" ], ["Sinzem Shop2", "+380990458112"], ["Sinzem Shop3"]]
            // return arr;
        case "prom":
        case "пром":
            arr = await parsingPromNumbers(siteName, numberOfPages, itemToCheck);
            return arr;
        case "olx":
        case "олх":
            arr = await parsingOlxNumbers(siteName, numberOfPages, itemToCheck);
            return arr;   
        default:
            return arr;
    } 
}

module.exports = startParsing;
