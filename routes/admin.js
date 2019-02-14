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
		db.query(`SELECT hero_image, header_1, header_2, header_3, text_1, text_2, text_3 FROM landdrupdb.frontpage_content`, (err, results) => {
			if (err) res.send(err);
			res.render('administration/admin', { 'title': 'Velkommen', 'results': results });
		})
	});

	
};
