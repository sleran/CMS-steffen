const db = require('../config/database')();
const fs = require('fs');

const roleCheck = require('../middleware/role-check');

module.exports = function (app) {

//admin articles routes
	// Gets 
	app.get('/admin/artikler',[roleCheck.admins, roleCheck.superadmins], (req, res, next) => {
		db.query(`SELECT articles.id, articles.name, content, image, categories.name AS category, users.user_name AS user FROM articles
		INNER JOIN categories ON articles.fk_category = categories.id
		INNER JOIN users ON articles.fk_author = users.id`, (err, articles) => {
			if (err) return next(`${err} at db.query (${__filename}:8:9)`);
            res.render('administration/admin-articles', { 'title': 'Artikler', 'content': 'Opret, slet og redigér', 'articles': articles});
        })
	});

	app.get('/admin/rediger-artikel/:id',[roleCheck.admins, roleCheck.superadmins], (req, res, next) => {
		db.query(`SELECT articles.id, articles.name, content, image,fk_category, categories.name AS category, users.user_name AS user FROM articles 
		INNER JOIN categories ON articles.fk_category = categories.id
		INNER JOIN users ON articles.fk_author = users.id
		WHERE articles.id = ?`, [req.params.id], (err, articles) => {
			if (err) return next(`${err} at db.query (${__filename}:17:9)`);
            res.render('administration/admin-articles-edit', { 'title': articles[0].name, 'content': 'Redigér artiklen', 'article': articles[0]});
        })
	});
	app.post('/admin/artikler',[roleCheck.admins, roleCheck.superadmins], (req, res, next) => {		
		try {
		db.query('INSERT INTO articles (name, content, fk_category, fk_author, published) VALUES (?, ?, ?, ?, ?)', [req.fields.name, req.fields.content, req.fields.categoryUpdate, req.session.user, 1], async (err, results) => {
			const articleId = await results.insertId;
			if (!/image/.test(req.files.image.type)) {
				return res.send('Ikke et billede');
			} else if (!req.files || !req.files.image) {
				return next(new Error('Der var ingen fil med formularen'));
			}
			
			let timestamp = Date.now();
			const data = fs.readFileSync(req.files.image.path);
			let renamedFilename = `${timestamp}_${req.files.image.name}`;
			fs.writeFileSync(`./public/media/${renamedFilename}`, data);
			const result = await db.query('UPDATE articles SET image = ? WHERE id = ?')[renamedFilename, articleId];
			res.redirect('/admin/artikler');

			
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

	app.patch('/admin/artikler', [roleCheck.admins, roleCheck.superadmins], (req, res, next) => {
		db.query('UPDATE articles SET name = ?, content = ?, fk_category = ? WHERE id = ?', [req.fields.name, req.fields.content, req.fields.categoryUpdate, req.fields.id], (err, result) => {
			if (err) return next(`${err} at db.query (${__filename}:68:9)`);
			res.status(204);
			res.end();
		})
	});

	app.patch('/admin/article/image/:id', [roleCheck.admins, roleCheck.superadmins], (req, res, next) => {
		if (!req.files || !req.files.photo) {
			return next(`File not found (${__filename}:76:9)`);
		}
		const file = req.files.photo;
		const renamedFilename = `${Date.now()}_${file.name}`;
		fs.readFile(file.path, (err, data) => {
			if (err) return next(`${err} at fs.readFile (${__filename}:81:9)`);
			fs.writeFile(`./public/media/${renamedFilename}`, data, err => {
				if (err) return next(`${err} at fs.writeFile (${__filename}:83:13)`);
				db.query('UPDATE articles SET image = ? WHERE id = ?', [renamedFilename, req.params.id], (err, result) => {
					if (err) return next(`${err} at db.query (${__filename}:85:17)`);
					res.status(200);
					res.json({
					photo: renamedFilename
					});
				});
			});
		});
	});

	app.delete('/admin/artikler/:id', [roleCheck.admins, roleCheck.superadmins], (req, res, next) => {
		db.query(`DELETE FROM articles WHERE id = ?`, [req.params.id], (err, results) => {
			if (err) return next(`${err} at db.query (${__filename}:97:9)`);
			res.status(200);
			res.end();
		})
	});
}