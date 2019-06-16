const db = require('../config/database')();

module.exports = function (app) {

app.get('/api/categories', (req, res) => {
    db.query(`SELECT * FROM categories`, (err, results) => {
        if (err) return next(`${err} at db.query (${__filename}:6:5)`);
        res.json(results);
    })
});

app.get('/api/theatres', (req, res) => {
    db.query(`SELECT * FROM theatres`, (err, results) => {
        if (err) return next(`${err} at db.query (${__filename}:6:5)`);
        res.json(results);
    })
});

app.get('/api/roles', (req, res) => {
    db.query(`SELECT * FROM roles`, (err, results) => {
        if (err) return next(`${err} at db.query (${__filename}:13:5)`);
        res.json(results);
    })
});

app.get('/api/pages', (req, res) => {
    db.query(`SELECT * FROM pages`, (err, results) => {
        if (err) return next(`${err} at db.query (${__filename}:20:5)`);
        res.json(results);
    })
});

}