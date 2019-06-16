const db = require('../config/database')();
const fs = require('fs');

const roleCheck = require('../middleware/role-check');

module.exports = function (app) {

	app.get('/admin/events', [roleCheck.admins, roleCheck.superadmins], (req, res, next) => {
		db.query(`SELECT events.id, events.name, events.description, image, price, starts, ends, categories.name AS category, theatres.name AS theatre FROM events
		INNER JOIN categories ON events.fk_category = categories.id
		INNER JOIN theatres ON events.fk_theatre_id = theatres.id`, (err, events) => {
			if (err) return next(`${err} at db.query (${__filename}:8:9)`);
            res.render('administration/admin-events', { 'title': 'Events', 'content': 'Opret, slet og redigér', 'events': events});
        })
	});

	app.get('/admin/rediger-event/:id', [roleCheck.admins, roleCheck.superadmins], (req, res, next) => {
		db.query(`SELECT events.id, events.name, events.description, image, fk_category, fk_theatre_id, price, starts, ends, categories.name AS category, theatres.name AS theatre FROM events
		INNER JOIN categories ON events.fk_category = categories.id
		INNER JOIN theatres ON events.fk_theatre_id = theatres.id
		WHERE events.id = ?`, [req.params.id], (err, events) => {
			if (err) return next(`${err} at db.query (${__filename}:17:9)`);
            res.render('administration/admin-events-edit', { 'title': events[0].name, 'content': 'Redigér artiklen', 'event': events[0]});
        })
	});
	app.post('/admin/events', [roleCheck.admins, roleCheck.superadmins], (req, res, next) => {		
		try {
		let startTime = new Date(req.fields.starts);
		let endTime = new Date(req.fields.ends);
			console.log(req.fields);
			
		db.query('INSERT INTO events (name, events.description, starts, ends, price, fk_category, fk_theatre_id, published) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [req.fields.name, req.fields.content, startTime, endTime, req.fields.price, req.fields.categoryUpdate, req.fields.theatreUpdate, 1], async (err, results) => {
			const eventId = await results.insertId;
			if (!/image/.test(req.files.image.type)) {
				return res.send('Ikke et billede');
			} else if (!req.files || !req.files.image) {
				return next(new Error('Der var ingen fil med formularen'));
			}
			
			let timestamp = Date.now();
			const data = fs.readFileSync(req.files.image.path);
			let renamedFilename = `${timestamp}_${req.files.image.name}`;
			fs.writeFileSync(`./public/media/${renamedFilename}`, data);
			console.log(renamedFilename, eventId);
			
			const result = await db.query('UPDATE events SET image = ? WHERE id = ?', [renamedFilename, eventId]);
			res.redirect('/admin/events');

			
			// fs.readFile(req.files.image.path, (err, data) => {
			// 	if (err) {
			// 		return next(new Error('Den midlertidige fil kunne ikke læses'))
			// 	}
			// 	let timestamp = Date.now();
			// 	let renamedFilename = `${timestamp}_${req.files.image.name}`
			// 	fs.writeFile(`./public/media/${renamedFilename}`, data, (err) => {
			// 		if (err) {
			// 			return next(new Error('Filen kunne ikke gemmes'));
			// 		}
			// 		db.query('INSERT INTO articles SET image = ? WHERE id = ?', [renamedFilename, results.insertId], (err, result) => {

			// 			if (err) return next(`${err} at db.query (${__filename}:39:9)`);
			// 			res.redirect('/admin/artikler');
			// 		});
			// 	});
			//});
			
		})
		} catch (err) {
			return next(`${err} in try block (${__filename}:27:9)`);
		}
	});

	app.patch('/admin/events', [roleCheck.admins, roleCheck.superadmins], (req, res, next) => {
		let startTime = new Date(req.fields.starts);
		let endTime = new Date(req.fields.ends);
		db.query('UPDATE events SET name = ?, starts = ?, ends = ?, price = ?, description = ?, fk_category = ?, fk_theatre_id = ? WHERE id = ?', 
		[req.fields.name, startTime, endTime, req.fields.price, req.fields.content, req.fields.category, req.fields.location, req.fields.id], (err, result) => {
			if (err) return next(`${err} at db.query (${__filename}:68:9)`);
			res.status(204);
			res.end();
		})
	});

	app.patch('/admin/events/image/:id', [roleCheck.admins, roleCheck.superadmins], (req, res, next) => {
		if (!req.files || !req.files.photo) {
			return next(`File not found (${__filename}:76:9)`);
		}
		const file = req.files.photo;
		const renamedFilename = `${Date.now()}_${file.name}`;
		fs.readFile(file.path, (err, data) => {
			if (err) return next(`${err} at fs.readFile (${__filename}:81:9)`);
			fs.writeFile(`./public/media/${renamedFilename}`, data, err => {
				if (err) return next(`${err} at fs.writeFile (${__filename}:83:13)`);
				db.query('UPDATE events SET image = ? WHERE id = ?', [renamedFilename, req.params.id], (err, result) => {
					if (err) return next(`${err} at db.query (${__filename}:85:17)`);
					res.status(200);
					res.json({
					photo: renamedFilename
					});
				});
			});
		});
	});

	app.delete('/admin/events/:id', [roleCheck.admins, roleCheck.superadmins], (req, res, next) => {
		db.query(`DELETE FROM events WHERE id = ?`, [req.params.id], (err, results) => {
			if (err) return next(`${err} at db.query (${__filename}:97:9)`);
			res.status(200);
			res.end();
		})
	});
}