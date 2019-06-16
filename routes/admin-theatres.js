const db = require('../config/database')();
const fs = require('fs');

const roleCheck = require('../middleware/role-check');

module.exports = function (app) {

	app.get('/admin/sale', [roleCheck.admins, roleCheck.superadmins], (req, res, next) => {
		db.query(`SELECT theatres.id, theatres.name, theatres.aisle, theatres.description, 
		(SELECT COUNT(id) FROM rows WHERE fk_theatre_id = theatres.id) AS rows_count FROM theatres`, (err, theatres) => {
			if (err) return next(`${err} at db.query (${__filename}:8:9)`);
            res.render('administration/admin-theatres', { 'title': 'Sale', 'content': 'Opret, slet og redigér', 'theatres': theatres});
        })
	});

	app.get('/admin/sale', [roleCheck.admins, roleCheck.superadmins], (req, res, next) => {
		db.query(`SELECT
		theatres.id,
		theatres.name,
		theatres.aisle,
		theatres.description,
		(SELECT COUNT(rows.id) FROM rows WHERE fk_theatre_id = theatres.id) AS rowCount,
		(SELECT COUNT(seats.id) FROM seats WHERE fk_row_id IN (SELECT rows.id FROM rows WHERE fk_theatre_id = theatres.id)) AS seatCount
	FROM theatres`, (err, theatres) => {
			if (err) return next(`${err} at db.query (${__filename}:8:9)`);
            res.render('administration/admin-theatres', { 'title': 'Sale', 'content': 'Opret, slet og redigér', 'theatres': theatres});
        })
	});

	app.post('/admin/sale', [roleCheck.admins, roleCheck.superadmins], (req, res, next) => {
		try {		
			db.query('INSERT INTO theatres (name, aisle, description) VALUES (?, ?, ?)', [req.fields.name, req.fields.aisle, req.fields.description], (err, results) => {
				res.redirect(`/admin/sale/${results.insertId}`);
			})
		} catch (err) {
			return next(`${err} in try block (${__filename}:49:9)`);
		}
	});

	app.get('/admin/sale/:id', [roleCheck.admins, roleCheck.superadmins], (req, res, next) => {
            res.render('administration/admin-theatres-create-rows', { 'title': 'Redigér salen', 'content': 'Opret rækker og pladser'});
	});

	app.post('/admin/raekker', [roleCheck.admins, roleCheck.superadmins], (req, res, next) => {
		db.query('INSERT INTO rows (name, fk_theatre_id) VALUES (?, ?)', [req.fields.name, req.fields.theatre], (err, results) => {
			if (err) return next(`${err} at db.query (${__filename}:8:9)`);
			res.send(results);
		})
	});

	app.post('/admin/pladser', [roleCheck.admins, roleCheck.superadmins], (req, res, next) => {
		db.query('INSERT INTO seats (name, fk_row_id) VALUES (?, ?)', [req.fields.seat, req.fields.rowNumber], (err, results) => {
			if (err) return next(`${err} at db.query (${__filename}:8:9)`);
			res.send(results);			
		})
	});
}