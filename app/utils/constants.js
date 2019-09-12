let domain = process.env.APIPERSONA_DOMAIN || 'http://localhost:3000/';
let postgreHost = process.env.postgre_HOST || 'localhost';
let postgrePort = process.env.postgre_PORT || '5432';

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
    httpCode: httpCode
});
