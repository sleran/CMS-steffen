const db = require('../config/database')();

module.exports = function (app) {
	db.query(`SELECT * FROM globals`, (err, results) => {
		if (err) res.send(err);
		app.locals.site = results[0];
	});

	db.query(`SELECT * FROM menu`, (err, results) => {
		if (err) res.send(err);
		app.locals.menus = results;		
	});
};
