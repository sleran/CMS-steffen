const db = require('../config/database')();

const roleCheck = require('../middleware/role-check');

module.exports = function (app) {

	app.use('/admin', (req, res, next) => {
		if (!req.session.user) {
			res.redirect('/login');
			return;
		} else {
			next();
		}
	});

	//admin route
	app.get('/admin', [roleCheck.admins, roleCheck.superadmins], (req,res) => {
		db.query(`SELECT * FROM globals`, (err, results) => {
			if (err) return next(`${err} at db.query (${__filename}:16:9)`);
			res.render('administration/admin', { 'title': 'Velkommen', 'results': results[0] });
		})
	});

	app.patch('/admin/globals', [roleCheck.admins, roleCheck.superadmins], (req, res, next) => {
		db.query('UPDATE globals SET name = ?, description = ?', [req.fields.name, req.fields.description], (err, result) => {
			if (err) return next(`${err} at db.query (${__filename}:23:9)`);
			app.locals.site.name = req.fields.name;
			res.status(204);
			res.end();
		})
	});
	
};
