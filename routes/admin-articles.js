const db = require('../config/database')();
const fs = require('fs');

module.exports = function (app) {

//admin articles route
	app.get('/admin/artikler', (req,res) => {
		db.query(`SELECT articles.id, articles.name, content, image, categories.name AS category, users.user_name AS user FROM articles
		INNER JOIN categories ON articles.fk_category = categories.id
		INNER JOIN users ON articles.fk_author = users.id`, (err, articles) => {
            res.render('administration/admin-articles', { 'title': 'Artikler', 'content': 'Opret, slet og redigér', 'articles': articles});
        })
	});

	app.get('/admin/rediger-artikel/:id', (req,res) => {
		db.query(`SELECT articles.id, articles.name, content, image, categories.name AS category, users.user_name AS user FROM articles 
		INNER JOIN categories ON articles.fk_category = categories.id
		INNER JOIN users ON articles.fk_author = users.id
		WHERE articles.id = ?`, [req.params.id], (err, articles) => {
            res.render('administration/admin-articles-edit', { 'title': articles[0].name, 'content': 'Redigér artiklen', 'article': articles[0]});
        })
	});
	app.post('/admin/artikler', (req, res, next) => {
		console.log(req.fields);
		
		db.query('INSERT INTO articles (name, content, fk_category, fk_author, image, published) VALUES (?, ?, ?, ?, ?, ?)', [req.fields.name, req.fields.content, req.fields.categoryUpdate, req.session.user, req.files.image.name, 1], (err, result) => {
			if (err) {
				return next(err);
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
					res.redirect('/admin/artikler');
				});
			});
			
		})
	});

	app.patch('/admin/artikler', (req, res, next) => {
		db.query('UPDATE articles SET name = ?, content = ? WHERE id = ?', [req.fields.name, req.fields.content, req.fields.id], (err, result) => {
			if (err) return next(`${err} at db.query (${__filename}:23:5)`);
			res.status(204);
			res.end();
		})
	});

	app.patch('/admin/article/image/:id', (req, res, next) => {
		if (!req.files || !req.files.photo) {
			return next(`File not found (${__filename}:29:5)`);
		}
		const file = req.files.photo;
		const renamedFilename = `${Date.now()}_${file.name}`;
		fs.readFile(file.path, (err, data) => {
			if (err) return next(`${err} at fs.readFile (${__filename}:35:5)`);
			fs.writeFile(`./public/media/${renamedFilename}`, data, err => {
				if (err) return next(`${err} at fs.writeFile (${__filename}:37:7)`);
				db.query('UPDATE articles SET image = ? WHERE id = ?', [renamedFilename, req.params.id], (err, result) => {
					if (err) return next(`${err} at db.query (${__filename}:39:9)`);
					res.status(200);
					res.json({
					photo: renamedFilename
					});
				});
			});
		});
	});

	app.delete('/admin/artikler/:id', (req, res, next) => {
		db.query(`DELETE FROM articles WHERE id = ?`, [req.params.id], (err, results) => {
			if (err) return next(err);
			res.status(200);
			res.end();
		})
	});
}