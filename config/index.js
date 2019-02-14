const fs = require('fs');
const path = require('path');

//Nedestående indlæser og lister automatisk filerne i denne mappe, uden denne fil!
module.exports = function (app) {
    fs.readdirSync(__dirname, { withFileTypes: true }).forEach(file => {
        if (file.name !== path.basename(__filename)) {
            require(path.join(__dirname, file.name))(app);
        }
    });
}