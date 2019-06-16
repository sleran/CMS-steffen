const db = require('../config/database')();

module.exports = function (app) {
	app.use(function(req, res, next) {
		db.query(`SELECT * FROM globals`, (err, site) => {
			if (err) return next(`${err} at db.query (${__filename}:4:5)`);
			app.locals.site = site[0];
			db.query(`SELECT * FROM menu ORDER BY position`, (err, menu) => {
				if (err) return next(`${err} at db.query (${__filename}:9:5)`);
				app.locals.menus = menu;		
				next()
			});
		});	
	})

};
