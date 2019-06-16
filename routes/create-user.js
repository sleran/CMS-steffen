const db = require('../config/database')();
const bcrypt = require('bcryptjs');

module.exports = function (app) {
    app.get('/registration', (req,res) => {
        // let hashed_kodeord = bcrypt.hashSync('87654321', 10);
        // console.log(hashed_kodeord);
        res.render('create-user', {'title': 'Registrering', 'content': 'Opret en profil'} );
    });

    app.post('/registration', (req, res) => {
        let success = true;
        let errorMessage = '';

        if (req.fields) {
            if (!req.fields.username || req.fields.username.length <= 0) {
                success = false;
                errorMessage = 'Udfyld brugernavn!';
            }
            if (!req.fields.password || req.fields.password.length <= 7) {
                success = false;
                errorMessage = 'Adgangskoden skal have mindst 8 tegn!';
            }
        } else {
            success = false;
            errorMessage = 'Alt er galt';
        }
        
        if (!success) {
            res.render('create-user', {'title': 'Registrering', 'content': 'Opret en profil', 'errorMessage': errorMessage} );
        }
        let hashed_kodeord = bcrypt.hashSync(req.fields.password, 10);
        if (success) {
            db.query(`INSERT INTO users SET user_name = ?, pass = ?, fk_role = (SELECT id FROM roles WHERE level = 1)`, [req.fields.username, hashed_kodeord], function (err, result) {
                if (err) {
                    return next(`${err} at db.query (${__filename}:34:9)`);
                }
                req.session.user = result.insertId                
                res.redirect('/admin');
            })
        }
    });
};