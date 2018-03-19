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
        const username = req.body.txtUsername;
        let plainPassword = req.body.txtPassword;

        req.app.get('db').User.find({username: username}).then(result => {
            if(result.length === 0){
                res.send({success: false, message:res.__('api.auth.login.data.error')});
            }else{
                let User = result[0];
                bcrypt.compare(plainPassword, User.password).then(isMatch => {
                    if(isMatch){
                        jwt.sign({username: User.username, userid: User.userid}, req.app.get('secretKey'), (err, token) => {
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
