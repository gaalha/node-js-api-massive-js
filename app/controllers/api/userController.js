let express = require('express');
let router = express.Router();
let userService = require('../../services/userService');
let asyncHandler = require('../../utils/asyncHandler');
let { authJwt } = require('../../middlewares/authMiddleware');

router.post(
    '/save',
    asyncHandler(async (req, res) => {
        req.checkBody('txtIdUser').trim();
        req.checkBody('txtUsername').trim().notEmpty();
        req.checkBody('txtPassword').trim().notEmpty();
        req.checkBody('txtEmail').trim().notEmpty();

        const [username, plainPassword, id, email] = [req.body.txtUsername, req.body.txtPassword, req.body.txtIdUser, req.body.txtEmail];

        let errors = req.validationErrors();
        if (errors) {
            let message;
            if (errors[0].param !== undefined && errors[0].param != null && errors[0].param.length > 0)
                message = res.__('api.user.fields.empty.with.field') + errors[0].param;
            else
                res.__('api.user.fields.empty');
            res.send({
                success: false,
                message: message
            });
        } else {
            const isEditing = id !== undefined && id && id !== 0;
            const result = await userService.save(isEditing, id, username, plainPassword, email);

            if (result.length === 0) {
                res.send({ success: false, message: res.__('api.user.save.error') });
            } else {
                res.send({ success: true, message: res.__('api.user.save.success') });
            }
        }
    })
);

module.exports = router;
