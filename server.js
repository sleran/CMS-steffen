const app = require('express')();
const debug = require('debug')('kodebase');
const port = process.env.PORT || 3000;
const pjson = require('./package.json');

// CONFIG
// ============================================================================
require('./config/index')(app);

// ROUTES
// ============================================================================
require('./routes/index')(app);

// SERVER INIT
// ============================================================================
app.listen(port, () => {
	debug(
		`${pjson.name} v${pjson.version} is running on http://${process.env.SITE_HOST}:${port}`
	);
});