
const db = require('../config/database')();

module.exports = function (app) {

    app.get('/', (req, res, next) => {
            db.query(`SELECT * FROM articles`, (err, articles) => {
                res.render('main', { 'articles': articles });
            })
    });
    
};