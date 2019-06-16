const db = require('../config/database')();
const fs = require('fs');

const roleCheck = require('../middleware/role-check');

module.exports = function (app) {
//admin users route
app.get('/admin/billeder', [roleCheck.admins, roleCheck.superadmins], async (req,res, next) => {
    db.query(`SELECT * FROM images`,(err, images) => {
        if (err) return next(`${err} at db.query (${__filename}:7:5)`);
        res.render('administration/admin-list-images', { 'title': 'Billeder', 'content': 'Opret, slet og redigér', 'images': images});
    })
});

app.post('/admin/billeder', [roleCheck.admins, roleCheck.superadmins], async (req, res, next) => {
    try {
        let imagelist = [];

        for (x in req.files.images) {
                imagelist.push(req.files.images[x]);
        };
                    
        imagelist.forEach(async (image) => {
            if (!/image/.test(image.type)) {
                return res.send('Ikke et billede');
            }
            
            let timestamp = Date.now();
            const data = fs.readFileSync(image.path);
            let renamedFilename = `${timestamp}_${image.name}`;
            fs.writeFileSync(`./public/media/${renamedFilename}`, data);
            let result = await db.query('INSERT INTO images SET name = ?', [renamedFilename]);
            res.redirect('/admin/billeder');
        });
    } catch (err) {
        return next(`${err} in try block (${__filename}:14:5)`);
    }
});

app.get('/admin/billeder/:name', [roleCheck.admins, roleCheck.superadmins], (req, res, next) => {
    if (req.query.action === 'delete') {
        return next();
    }
    res.render('administration/admin-edit-image', { image: req.params.name, 'title': 'Rediger billede'});
});

app.post('/admin/billeder/:name', [roleCheck.admins, roleCheck.superadmins], async (req, res, next) => {
    try {
        if (!/image/.test(req.files.image.type)) {
            return res.send('Ikke et billede');
        } if (!req.files || !req.files.image) {
            return next(new Error('Der var ingen fil med formularen'));
        }
        
        let timestamp = Date.now();
        const data = fs.readFileSync(req.files.image.path);
        let renamedFilename = `${timestamp}_${req.files.image.name}`;
        fs.writeFileSync(`./public/media/${renamedFilename}`, data);
        fs.unlinkSync('/public/media/req.params.name');
        let result = await db.query('UPDATE images SET name = ? WHERE name = ?', [renamedFilename, req.params.name]);
        res.redirect('/admin/billeder');

    } catch (err) {
        return next(`${err} in try block (${__filename}:46:5)`);
    }
});

app.get('/admin/billeder/:name', [roleCheck.admins, roleCheck.superadmins], (req, res, next) => {
    db.query(`DELETE FROM images WHERE name = ?`, [req.params.name], (err, results) => {
        if (err) return next(`${err} at db.query (${__filename}:67:5)`);
        fs.unlinkSync(`./public/media/${req.params.name}`);
        res.redirect('/admin/billeder');
    })   
});


}