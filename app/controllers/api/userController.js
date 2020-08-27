let express = require('express');
let router = express.Router();
let userService = require('../../services/userService');
let asyncHandler = require('../../utils/asyncHandler');
let { authJwt } = require('../../middlewares/authMiddleware');

router.post(
    '/save',
    authJwt(),
    asyncHandler(async (req, res) => {
        req.checkBody('id').trim();
        req.checkBody('user_name').trim().notEmpty();
        req.checkBody('email').trim().notEmpty();
        req.checkBody('password').trim().notEmpty();

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
            const [id, user_name, email, password] = [req.body.id, req.body.user_name, req.body.email, req.body.password];
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

router.get(
    '/:id',
    authJwt(),
    asyncHandler(async (req, res) => {
        const result = await userService.getOne(req);

        if (result.length === 0) { res.send({success:false, message:res.__('api.user.get.error')}); }
        else { res.send({success: true, data: result}); }
    })
);

router.get(
    '*',
    authJwt(),
    asyncHandler(async (req, res) => {
        const page = req.body.page || req.query.page || 1;
        const pageSize = req.body.pageSize || req.query.pageSize || 10;
        const result = await userService.getAll(req, page, pageSize);

        if (result.length === 0) {
            res.send({success:false, message:res.__('api.user.get.empty')});
        } else {
            let total = await userService.getAllCount();
            res.send({success: true, data: result, total: total, pageSize, page: page});
        }
    })
);

router.delete(
    '/delete/:id',
    authJwt(),
    asyncHandler(async (req, res, next) => {
        const result = await userService.delete(req);

        if (result!==null) {
            res.send({success: true, message: res.__('api.user.delete.succes')});
        } else {
            res.send({success: false, message: res.__('api.user.delete.error')});
        }
    })
);

module.exports = router;
