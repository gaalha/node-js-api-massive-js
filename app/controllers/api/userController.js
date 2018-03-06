let express = require('express');
let router = express.Router();
let bcrypt = require('bcrypt');
const saltRounds = 10;

router.post('/save', (req, res, next) => {
    req.checkBody('txtIdUser').trim();
    req.checkBody('txtUsername').trim().notEmpty();
    req.checkBody('txtPassword').trim().notEmpty();

    let errors = req.validationErrors();

    if(errors){
        res.send({
            success: false,
            message: res.__('api.user.fields.empty')
        });
    }else{
        let id = req.body.txtIdUser;
        let plainPassword = req.body.txtPassword;
        let createdAt = new Date();

        let User = {
            username: req.body.txtUsername,
            createdAt: createdAt
        };

        if(id != null && id != 0 && id != undefined){
            User.userid = id;
        }

        bcrypt.hash(plainPassword, saltRounds).then(hash => {
            User.password = hash;

            req.app.get('db').User.save(User).then(result => {
                if(result.length === 0){
                    res.send({success:false, message:res.__('api.user.save.error')});
                }else{
                    res.send({success:true, message:res.__('api.user.save.success')});
                }
            });
        });
    }
});

module.exports = router;
