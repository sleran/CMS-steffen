const db = require('../config/database')();

module.exports = function (app) {

app.get('/api/categories', (req, res) => {
    db.query(`SELECT * FROM categories`, (err, results) => {
    if (err) res.send(err);
    res.json(results);
    })
});

app.get('/api/roles', (req, res) => {
    db.query(`SELECT * FROM roles`, (err, results) => {
    if (err) res.send(err);
    res.json(results);
    })
});

app.get('/api/pages', (req, res) => {
    db.query(`SELECT * FROM pages`, (err, results) => {
    if (err) res.send(err);
    res.json(results);
    })
});

}