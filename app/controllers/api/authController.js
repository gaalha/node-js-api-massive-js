let express = require('express');
let router = express.Router();
let authService = require('../../services/authService');
let asyncHandler = require('../../utils/asyncHandler');

router.post(
    '/login',
    asyncHandler(async (req, res) => {
        req.checkBody('txtUsername').trim().notEmpty();
        req.checkBody('txtPassword').trim().notEmpty();
        let errors = req.validationErrors();

        if (errors) {
            return { success: false, message: res.__('api.auth.fields.empty'), token: null };
        } else {
            const result = await authService.login(req, res);
            res.send({ success: result.success, message: result.message, token: result.token });
        }
    })
);

router.get('/logout', (req, res, next) => {
    req.decoded = null;
    res.send({ success: true, message: res.__('api.auth.logout.success') });
});

module.exports = router;
