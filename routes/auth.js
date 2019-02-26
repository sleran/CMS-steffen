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

		db.query('SELECT id, pass, user_name FROM users WHERE user_name = ?', [req.fields.username], (err, result) => {
			if (err) return next(`${err} at db.query (${__filename}:9:5)`);
			if (result.length !== 1) {				
				res.redirect('/login?status=badcredentials');
				return;
			} else if (bcrypt.compareSync(req.fields.passphrase, result[0].pass)) {
				req.session.user = result[0].id;
				res.redirect('/admin');
				res.end();
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

// , (err, results) => {
// 	if (err) return next(`${err} at db.query (${__filename}:9:5)`);
// 	if (results) {
// 		console.log(req.session.user);
// 		req.session.user = result[0].id;
// 		res.redirect('/admin');
// 		res.end();
// 	} else {
// 		res.redirect('/login?status=badcredentials');
// 		res.end();
// 	}
// })
// } else {
// res.redirect('/login?status=badcredentials');
// return;
// 