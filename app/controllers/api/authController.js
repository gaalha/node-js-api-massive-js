let express = require('express');
let router = express.Router();
let bcrypt = require('bcrypt');
let jwt = require('jsonwebtoken');

router.post('/login', (req, res, next) => {
    req.checkBody('txtUsername').trim().notEmpty();
    req.checkBody('txtPassword').trim().notEmpty();

    let errors = req.validationErrors();

    if(errors){
        res.send({
            success: false,
            message: res.__('api.auth.fields.empty')
        });
    }else{
        const user_name = req.body.txtUsername;
        let plainPassword = req.body.txtPassword;

        req.app.get('db').usuario.find({user_name: user_name}).then(result => {
            if(result.length === 0){
                res.send({success: false, message:res.__('api.auth.login.data.error')});
            }else{
                let usuario = result[0];
                bcrypt.compare(plainPassword, usuario.password).then(isMatch => {
                    if(isMatch){
                        jwt.sign({user_name: usuario.user_name, user_id: usuario.user_id}, req.app.get('secretKey'), (err, token) => {
                            if(err){
                                res.send({success:false, message:err});
                            }else{
                                console.log(jwt.decode(token));
                                res.send({success: true, token: token});
                            }
                        });
                    }else{
                        res.send({success:false, message:res.__('api.auth.login.data.error')});
                    }
                });
            }
        });
    }
});

router.get('/logout', (req, res, next) => {
    req.decoded = null;
    res.send({success: true, message:res.__('api.auth.logout.success')});
});

module.exports = router;
