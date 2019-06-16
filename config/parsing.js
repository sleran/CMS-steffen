//const bodyParser = require('body-parser');
const formidable = require('express-formidable');

module.exports = function (app) {

    // app.use(bodyParser.json());          // Accept JSON objects in requests

    // app.use(bodyParser.urlencoded({     
    //     'extended': true
    // }));                                // Accept extended form elements in requests

    app.use(formidable({
        multiples: true
    }));				//parsing form data   
};