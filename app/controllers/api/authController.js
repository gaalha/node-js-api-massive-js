let express = require('express');
let router = express.Router();
let authService = require('../../services/authService');
let asyncHandler = require('../../utils/asyncHandler');

router.post(
    '/login',
    asyncHandler(async (req, res) => {
        const result = await authService.login(req, res);
        res.send({success:result.success, message:result.message, token: result.token});
    })
);

router.get('/logout', (req, res) => {
    req.decoded = null;
    res.send({success: true, message:res.__('api.auth.logout.success')});
});

module.exports = router;
