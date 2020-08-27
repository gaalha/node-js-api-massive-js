let express = require('express');
let router = express.Router();
let asyncHandler = require('../../utils/asyncHandler');
let clientService = require('../../services/clientService');
let {authJwt} = require('../../middlewares/authMiddleware');

router.get(
    '/:id',
    authJwt(),
    asyncHandler(async (req, res) => {
        const result = await clientService.getOne(req);

        if (result.length === 0) { res.send({success:false, message:res.__('api.client.get.error')}); }
        else { res.send({success: true, data: result}); }
    })
);

router.get(
    '*',
    authJwt(),
    asyncHandler(async (req, res) => {
        const page = req.body.page || req.query.page || 1;
        const pageSize = req.body.pageSize || req.query.pageSize || 10;
        const result = await clientService.getAll(req, page, pageSize);

        if (result.length === 0) {
            res.send({success:false, message:res.__('api.client.get.empty')});
        } else {
            let total = await clientService.getAllCount();
            res.send({success: true, data: result, total: total, pageSize, page: page});
        }
    })
);

router.post(
    '/save',
    authJwt(),
    asyncHandler(async (req, res) => {
        req.checkBody('id').trim();
        req.checkBody('txtFirstName').trim().notEmpty();
        req.checkBody('txtLastName').trim().notEmpty();
        req.checkBody('txtAge').trim().notEmpty();
        req.checkBody('txtGender').trim().notEmpty();
        let errors = req.validationErrors(); 

        if (errors) {
            res.send({
                success: false,
                message: res.__('api.client.fields.empty')
            });
        } else {
            const id = req.body.id;
            const result = await clientService.save(req, id);

            if (result) {
                res.send({
                    success: true,
                    message: res.__((id ? 'api.client.update.success' : 'api.client.save.success'))
                });
            } else {
                res.send({
                    success: false,
                    message: res.__((id ? 'api.client.update.error' : 'api.client.save.error'))
                });
            }
        }
    })
);

router.delete(
    '/delete/:id',
    authJwt(),
    asyncHandler(async (req, res, next) => {
        const result = await clientService.delete(req);

        if (result!==null) {
            res.send({success: true, message: res.__('api.client.delete.succes')});
        } else {
            res.send({success: false, message: res.__('api.client.delete.error')});
        }
    })
);

module.exports = router;
