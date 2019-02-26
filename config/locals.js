const db = require('../config/database')();

module.exports = function (app) {
	db.query(`SELECT * FROM cms.globals`, (err, results) => {
		if (err) console.log(err);
		app.locals.site = results[0];
	});

	db.query(`SELECT * FROM cms.menu`, (err, results) => {
		if (err) console.log(err);
		app.locals.menus = results;		
	});
};
