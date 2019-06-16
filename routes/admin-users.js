const db = require('../config/database')();

const roleCheck = require('../middleware/role-check');

module.exports = function (app) {
//admin users route
app.get('/admin/brugere', [roleCheck.admins, roleCheck.superadmins], (req, res, next) => {
    db.query(`SELECT id, user_name, pass, fk_role FROM users`, (err, users) => {
        if (err) return next(`${err} at db.query (${__filename}:6:5)`);
        res.render('administration/admin-users', { 'title': 'Brugere', 'content': 'Opret, slet og redigér', 'users': users});
    })
});

app.post('/admin/brugere', [roleCheck.admins, roleCheck.superadmins], (req, res, next) => {
    db.query('INSERT INTO users (user_name, pass, fk_role) VALUES (?, ?, ?)', [req.fields.name, req.fields.pass, req.fields.roleUpdate], (err, result) => {
        if (err) return next(`${err} at db.query (${__filename}:13:5)`);
        res.status(200);
        res.redirect('/admin/brugere');
    })
});

app.patch('/admin/brugere', [roleCheck.admins, roleCheck.superadmins], (req, res, next) => {
    db.query(`UPDATE users SET user_name = ?, fk_role = ? WHERE id = ?`, [req.fields.name, req.fields.role, req.fields.id], (err, result) => {
        if (err) return next(`${err} at db.query (${__filename}:21:5)`);
        res.status(204);
        res.end();
    })
});

app.delete('/admin/brugere/:id', [roleCheck.admins, roleCheck.superadmins], (req, res, next) => {
    db.query(`DELETE FROM users WHERE id = ?`, [req.params.id], (err, results) => {
        if (err) return next(`${err} at db.query (${__filename}:29:5)`);
        res.status(200);
        res.end();
    })
});
}