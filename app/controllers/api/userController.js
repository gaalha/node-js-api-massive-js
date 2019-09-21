let express = require('express');
let router = express.Router();
let userService = require('../../services/userService');
let asyncHandler = require('../../utils/asyncHandler');
let {authJwt} = require('../../middlewares/authMiddleware');

router.post(
    '/save',
    //authJwt(),
    asyncHandler(async (req, res) => {
        req.checkBody('txtIdUser').trim();
        req.checkBody('txtUsername').trim().notEmpty();
        req.checkBody('txtPassword').trim().notEmpty();

        let errors = req.validationErrors();

        if (errors) {
            res.send({
                success: false,
                message: res.__('api.user.fields.empty')
            });
        } else {
            const isEditing = id != null && id != 0 && id != undefined;
            const result = await userService.save(isEditing, id, username, plainPassword);

            if (result.length === 0) {
                res.send({success:false, message:res.__('api.user.save.error')});
            } else {
                res.send({success:true, message:res.__('api.user.save.success')});
            }
        }
    })
);

module.exports = router;