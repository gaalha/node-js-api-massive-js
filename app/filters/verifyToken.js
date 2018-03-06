let jwt = require('jsonwebtoken');

let verifyToken = (req, res, next) => {
    const token = req.body.token || req.query.token || req.headers['x-access-token'];

    if(isOnPublicPages(req.url)){
        next();
    }else{
        if(token){
            jwt.verify(token, req.app.get('secretKey'), (err, decoded) => {
                if(err){
                    res.json({succes: false, message: 'api.auth.token.fail'});
                }else{
                    req.decoded = decoded;
                    next();
                }
            });
        }else{
            res.status(403).send({succes: false, message: 'api.auth.token.null'});
        }
    }
}

function isOnPublicPages(path){
    return (
        path.indexOf('/login') !=-1
    )
}

module.exports = verifyToken;
