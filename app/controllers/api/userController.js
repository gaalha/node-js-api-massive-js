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
        console.log(errors);
        res.send({
            success: false,
            message: res.__('api.user.fields.empty')
        });
    }else{
        let id = req.body.txtIdUser;
        let plainPassword = req.body.txtPassword;
        let created_at = new Date();

        let usuario = {
            user_name: req.body.txtUsername,
            created_at: created_at,
            is_deleted: false
        };

        if(id != null && id != 0 && id != undefined){
            usuario.user_id = id;
        }

        bcrypt.hash(plainPassword, saltRounds).then(hash => {
            usuario.password = hash;

            req.app.get('db').usuario.save(usuario).then(result => {
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
