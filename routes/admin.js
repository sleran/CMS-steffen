const db = require('../config/database')();

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
	app.get('/admin', (req,res) => {
		db.query(`SELECT * FROM globals`, (err, results) => {
			if (err) res.send(err);
			res.render('administration/admin', { 'title': 'Velkommen', 'results': results[0] });
		})
	});

	
};
