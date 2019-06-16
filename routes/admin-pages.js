const db = require('../config/database')();
const fs = require('fs');

const roleCheck = require('../middleware/role-check');

module.exports = function (app) {

//admin articles route
	app.get('/admin/sider', [roleCheck.admins, roleCheck.superadmins], (req, res, next) => {
		db.query(`SELECT pages.id, pages.name, pages.content, pages.image, categories.name AS category, users.user_name AS user, sanitized_url, pages.published FROM pages
		INNER JOIN categories ON pages.fk_category = categories.id
		INNER JOIN users ON pages.fk_author = users.id`, (err, pages) => {
			if (err) return next(`${err} at db.query (${__filename}:8:5)`);
            res.render('administration/admin-pages', { 'title': 'Sider', 'content': 'Opret, slet og redigér', 'pages': pages});
        })
	});

	app.get('/admin/rediger-side/:id', [roleCheck.admins, roleCheck.superadmins], (req, res, next) => {
		db.query(`SELECT pages.id, pages.name, content, image, fk_category, categories.name AS category, users.user_name AS user FROM pages 
		INNER JOIN categories ON pages.fk_category = categories.id
		INNER JOIN users ON pages.fk_author = users.id
		WHERE pages.id = ?`, [req.params.id], (err, pages) => {
			if (err) return next(`${err} at db.query (${__filename}:17:5)`);
            res.render('administration/admin-pages-edit', { 'title': pages[0].name, 'content': 'Redigér artiklen', 'page': pages[0]});
        })
	});
	app.post('/admin/sider', [roleCheck.admins, roleCheck.superadmins], (req, res, next) => {
		let sanitized = encodeURI(req.fields.name);
		db.query('INSERT INTO pages (name, content, fk_category, fk_author, image, published, sanitized_url) VALUES (?, ?, ?, ?, ?, ?, ?)', [req.fields.name, req.fields.content, req.fields.categoryUpdate, req.session.user, req.files.image.name, 1, sanitized], (err, result) => {
			if (err) {
				return next(`${err} at db.query (${__filename}:27:5)`)
			} else if (!req.files || !req.files.image) {
				return next(new Error('Der var ingen fil med formularen'));
			}
			fs.readFile(req.files.image.path, (err, data) => {
				if (err) {
					return next(new Error('Den midlertidige fil kunne ikke læses'))
				}
				let timestamp = Date.now();
				fs.writeFile(`./public/media/${timestamp}_${req.files.image.name}`, data, (err) => {
					if (err) {
						return next(new Error('Filen kunne ikke gemmes'));
					}
					res.redirect('/admin/sider');
				});
			});
			
		})
	});

	app.patch('/admin/sider', [roleCheck.admins, roleCheck.superadmins], (req, res, next) => {
		db.query('UPDATE pages SET name = ?, content = ? WHERE id = ?', [req.fields.name, req.fields.content, req.fields.id], (err, result) => {
			if (err) return next(`${err} at db.query (${__filename}:50:5)`);
			res.status(204);
			res.end();
		})
	});

	app.patch('/admin/side/image/:id', [roleCheck.admins, roleCheck.superadmins], (req, res, next) => {
		if (!req.files || !req.files.photo) {
			return next(`File not found (${__filename}:58:5)`);
		}
		const file = req.files.photo;
		const renamedFilename = `${Date.now()}_${file.name}`;
		fs.readFile(file.path, (err, data) => {
			if (err) return next(`${err} at fs.readFile (${__filename}:63:9)`);
			fs.writeFile(`./public/media/${renamedFilename}`, data, err => {
				if (err) return next(`${err} at fs.writeFile (${__filename}:65:13)`);
				db.query('UPDATE articles SET image = ? WHERE id = ?', [renamedFilename, req.params.id], (err, result) => {
					if (err) return next(`${err} at db.query (${__filename}:67:13)`);
					res.status(200);
					res.json({
					photo: renamedFilename
					});
				});
			});
		});
	});

	app.delete('/admin/sider/:id', [roleCheck.admins, roleCheck.superadmins], (req, res, next) => {
		db.query(`DELETE FROM pages WHERE id = ?`, [req.params.id], (err, results) => {
			if (err) return next(`${err} at db.query (${__filename}:79:13)`);
			res.status(200);
			res.end();
		})
	});
}