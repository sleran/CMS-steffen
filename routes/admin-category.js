const db = require('../config/database')();

module.exports = function (app) {
//admin users route
app.get('/admin/kategorier', (req,res) => {
    db.query(`SELECT * FROM categories`, (err, categories) => {
        res.render('administration/admin-categories', { 'title': 'Kategorier', 'content': 'Opret, slet og redigér', 'categories': categories});
    })
});

app.post('/admin/kategorier', (req, res, next) => {
    db.query('INSERT INTO categories (name) VALUES (?)', [req.fields.name], (err, result) => {
        if (err) return next(`${err} at db.query (${__filename}:23:5)`);
        res.status(200);
        res.redirect('/admin/kategorier');
    })
});

app.delete('/admin/kategorier/:id', (req, res, next) => {
    db.query(`DELETE FROM categories WHERE id = ?`, [req.params.id], (err, results) => {
        if (err) return next(err);
        res.status(200);
        res.end();
    })
});
}