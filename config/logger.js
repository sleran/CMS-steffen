const logger = require('morgan');

module.exports = function (app) {
    app.use(logger('dev'));				// Setup console logging of route events
};