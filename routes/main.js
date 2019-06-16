
const db = require('../config/database')();

module.exports = function (app) {

    app.get('/', (req, res, next) => {
        db.query(`SELECT * FROM articles`, (err, articles) => {
            if (err) return next(`${err} at db.query (${__filename}:7:9)`);
            res.render('main', { 'articles': articles });
        })
    });
    
};