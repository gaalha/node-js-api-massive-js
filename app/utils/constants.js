let projectName = process.env.projectName || 'node-js-api-massive-js';

let domain = process.env.APIPERSONA_DOMAIN || 'http://localhost:3000/';
let postgreHost = process.env.postgre_HOST || 'localhost';
let postgrePort = process.env.postgre_PORT || '5432';

let postgreDb = process.env.postgreDb || 'angular_crud';
let postgreUser = process.env.postgreUser || 'edgarmejia';
let postgrePass = process.env.postgrePass || '123123123';

let jwtSecret = process.env.jwtSecret || 'kl-AHSfdlk-jadshkjlasdf-lkjAShdkjS';
let jwtExpiration = process.env.jwtExpiration || 3600; // --> seconds = 24h (86400)

const httpCode = {
    success: 200,
    created: 201,
    accepted: 202,
    badRequest: 400,
    unauthorized: 401,
    forbidden: 403,
    notFound: 404
}

module.exports = Object.freeze({
    domain: domain,
    postgreHost: postgreHost,
    postgrePort: postgrePort,

    postgreDb: postgreDb,
    postgreUser: postgreUser,
    postgrePass: postgrePass,

    httpCode: httpCode,
    jwtSecret: jwtSecret,
    jwtExpiration: jwtExpiration
});
