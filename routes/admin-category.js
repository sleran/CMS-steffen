const db = require('../config/database')();

const roleCheck = require('../middleware/role-check');

module.exports = function (app) {
//admin users route
app.get('/admin/kategorier', [roleCheck.admins, roleCheck.superadmins], (req, res, next) => {
    db.query(`SELECT * FROM categories`, (err, categories) => {
        if (err) return next(`${err} at db.query (${__filename}:6:5)`);
        res.render('administration/admin-categories', { 'title': 'Kategorier', 'content': 'Opret, slet og redigér', 'categories': categories});
    })
});

app.post('/admin/kategorier', [roleCheck.admins, roleCheck.superadmins], (req, res, next) => {
    db.query('INSERT INTO categories (name) VALUES (?)', [req.fields.name], (err, result) => {
        if (err) return next(`${err} at db.query (${__filename}:13:5)`);
        res.status(200);
        res.redirect('/admin/kategorier');
    })
});

app.patch('/admin/kategorier', [roleCheck.admins, roleCheck.superadmins], (req, res, next) => {
    db.query('UPDATE categories SET name = ? WHERE id = ?', [req.fields.name, req.fields.id], (err, result) => {        
        if (err) return next(`${err} at db.query (${__filename}:21:5)`);
        res.status(204);
        res.end();
    })
});

app.delete('/admin/kategorier/:id', [roleCheck.admins, roleCheck.superadmins], (req, res, next) => {
    db.query(`DELETE FROM categories WHERE id = ?`, [req.params.id], (err, results) => {
        if (err) return next(`${err} at db.query (${__filename}:29:5)`);
        res.status(200);
        res.end();
    })
});
}