let express = require('express');
let router = express.Router();
let userService = require('../../services/userService');
let asyncHandler = require('../../utils/asyncHandler');
let { authJwt } = require('../../middlewares/authMiddleware');

router.post(
    '/save',
    asyncHandler(async (req, res) => {
        req.checkBody('id').trim();
        req.checkBody('user_name').trim().notEmpty();
        req.checkBody('email').trim().notEmpty();
        req.checkBody('password').trim().notEmpty();

        const [id, user_name, email, password] = [req.body.id, req.body.user_name, req.body.email, req.body.password];

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
            const result = await userService.save(id, user_name, email, password);

            if (result) {
                res.send({
                    success: true,
                    message: id ? res.__('api.user.update.success') : res.__('api.user.save.success')
                });
            } else {
                res.send({
                    success: false,
                    message: id ? res.__('api.user.update.error') : res.__('api.user.save.error')
                });
            }
        }
    })
);

module.exports = router;
