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
        const id = req.body.txtIdUser;
        const plainPassword = req.body.txtPassword;

        const isEditing = id != null && id != 0 && id != undefined;

        let user_app = {
            user_name: req.body.txtUsername
        };

        if (isEditing) {
            user_app.id = id;
            user_app.updated_at = new Date();
        } else {
            user_app.created_at = new Date();
        }

        bcrypt.hash(plainPassword, saltRounds).then(hash => {
            user_app.password = hash;

            req.app.get('db').user_app.save(user_app).then((result, error) => {
                console.log(result);
                if (result.length === 0) {
                    res.send({success:false, message:res.__('api.user.save.error')});
                } else {
                    res.send({success:true, message:res.__('api.user.save.success')});
                }
            });
        });
    }
});

module.exports = router;
