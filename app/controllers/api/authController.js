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

// router.post('/login', (req, res, next) => {
//     req.checkBody('txtUsername').trim().notEmpty();
//     req.checkBody('txtPassword').trim().notEmpty();

//     let errors = req.validationErrors();

//     if (errors) {
//         res.send({
//             success: false,
//             message: res.__('api.auth.fields.empty')
//         });
//     } else {
//         const user_name = req.body.txtUsername;
//         let plainPassword = req.body.txtPassword;

//         req.app.get('db').user_app.findOne({'deleted_at IS': 'NULL', user_name: user_name}).then(result => {
//             if (result.length === 0) {
//                 res.send({success: false, message:res.__('api.auth.login.data.error')});
//             } else {
//                 //let user_app = result[0];
//                 bcrypt.compare(plainPassword, result.password).then(isMatch => {
//                     if (isMatch) {
//                         jwt.sign({user_name: result.user_name, id: result.id}, req.app.get('secretKey'), (err, token) => {
//                             if(err){
//                                 res.send({success: false, message: err});
//                             }else{
//                                 console.log(jwt.decode(token));
//                                 res.send({success: true, token: token});
//                             }
//                         });
//                     } else {
//                         res.send({success:false, message:res.__('api.auth.login.data.error')});
//                     }
//                 });
//             }
//         });
//     }
// });

router.get('/logout', (req, res, next) => {
    req.decoded = null;
    res.send({success: true, message:res.__('api.auth.logout.success')});
});

module.exports = router;
