const db = require('../config/database')();
const bcrypt = require('bcryptjs');

module.exports = function (app) {
	app.get('/login', (req, res, next) => {
		if (req.query.status && req.query.status === 'badcredentials') {
			res.locals.status = 'ugyldigt brugernavn eller adgangskode';
		}
		res.render('login', {title: 'Log ind'});
	});

	app.post('/auth/login', (req, res, next) => {
		db.query(`SELECT users.id, users.pass, user_name, roles.name AS role FROM users 
		INNER JOIN roles ON roles.id = users.fk_role
		WHERE user_name = ?`, [req.fields.username], (err, result) => {
			if (err) return next(`${err} at db.query (${__filename}:13:9)`);
			if (result.length !== 1) {				
				res.redirect('/login?status=badcredentials');
				return;
			} else if (bcrypt.compareSync(req.fields.passphrase, result[0].pass)) {
				req.session.user = result[0].id;
				req.session.role = result[0].role;

				if (req.session.role == 'Super admin')
					res.redirect('/admin');
				else if (req.session.role == 'User')
					res.redirect('/profil');
				else
					res.redirect('/');
			} else {
				res.redirect('/login?status=badcredentials');
				return;
			}
		});
	});

	app.get('/auth/logout', (req, res, next) => {
		req.session.destroy();
		res.redirect('/');
	});
};