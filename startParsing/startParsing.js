const rozetkaLinks = require("../parserLinks/rozetkaLinks");

async function startParsing(siteName, numberOfPages, itemToCheck) {
    let arr = [];
    switch(siteName) {
        case "rozetka":
        case "розетка":
            arr = rozetkaLinks(siteName, numberOfPages, itemToCheck);
            return arr;
          
        default:
            return arr;
    } 
}

module.exports = startParsing;
// rozetkaLinks(siteName, numberOfPages, itemToCheck).then((arr) => console.log(arr))