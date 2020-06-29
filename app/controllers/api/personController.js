let express = require('express');
let router = express.Router();
let asyncHandler = require('../../utils/asyncHandler');
let personService = require('../../services/personService');
let {authJwt} = require('../../middlewares/authMiddleware');

router.get(
    '/:id',
    authJwt(),
    asyncHandler(async (req, res) => {
        const result = await personService.getOne(req);

        if (result.length === 0) { res.send({success:false, message:res.__('api.person.get.error')}); }
        else { res.send({success: true, data: result}); }
    })
);

router.get(
    '*',
    authJwt(),
    asyncHandler(async (req, res) => {
        const page = req.body.page || req.query.page || 1;
        const pageSize = req.body.pageSize || req.query.pageSize || 10;
        const result = await personService.getAll(req, page, pageSize);

        if (result.length === 0) {
            res.send({success:false, message:res.__('api.person.get.empty')});
        } else {
            let total = await personService.getAllCount();
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
                message: res.__('api.person.fields.empty')
            });
        } else {
            const personId = req.body.id;
            const result = await personService.save(req, personId);

            if (result) {
                res.send({
                    success:true,
                    message:res.__((personId ? 'api.person.update.success' : 'api.person.save.success'))
                });
            } else {
                res.send({
                    success:false,
                    message:res.__((personId ? 'api.person.update.error' : 'api.person.save.error'))
                });
            }
        }
    })
);

router.delete(
    '/delete/:id',
    authJwt(),
    asyncHandler(async (req, res, next) => {
        const result = await personService.deletePerson(req);

        if (result!==null) {
            res.send({success:true, message:res.__('api.person.delete.succes')});
        } else {
            res.send({success:false, message:res.__('api.person.delete.error')});
        }
    })
);

module.exports = router;
