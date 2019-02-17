
const db = require('../config/database')();

module.exports = function (app) {

    app.get('/', (req, res, next) => {
        db.query(`SELECT * FROM menu`, (err, menus) => {
            db.query(`SELECT * FROM articles`, (err, articles) => {
                res.render('main', { 'title': 'Forside', 'content': 'hej med dig', 'menus': menus, 'articles': articles});
            })
        })
    });

    app.get('/:site', (req, res, next) => {
        db.query(`SELECT * FROM menu`, (err, menus) => {
            let deSanitized = encodeURI(req.params.site);      
            db.query(`SELECT * FROM pages WHERE sanitized_url = ?`, [deSanitized], (err, page) => {
                if (err) return next(`${err} at db.query (${__filename}:16:5)`);              
                res.render('page', { 'title': 'Forside', 'menus': menus, 'page': page[0]});
            })
        })
    });
    
};