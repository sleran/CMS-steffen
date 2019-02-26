const app = require('express')();
const debug = require('debug')('kodebase');
const port = process.env.PORT || 3000;
const pjson = require('./package.json');
const db = require('./config/database')();

// CONFIG
// ============================================================================
require('./config/index')(app);

// ROUTES
// ============================================================================
require('./routes/index')(app);

app.get('/:site', (req, res, next) => {
	let deSanitized = encodeURI(req.params.site);      
	db.query(`SELECT * FROM pages WHERE sanitized_url = ?`, [deSanitized], (err, page) => {
		if (err) return next(`${err} at db.query (${__filename}:16:5)`);              
		res.render('page', { 'page': page[0] });
	})
});

// SERVER INIT
// ============================================================================
app.listen(port, () => {
	debug(
		`${pjson.name} v${pjson.version} is running on http://${process.env.SITE_HOST}:${port}`
	);
});