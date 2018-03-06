let domain = process.env.APIPERSONA_DOMAIN || 'http://localhost:3000/';
let postgreHost = process.env.postgre_HOST || 'localhost';
let postgrePort = process.env.postgre_PORT || '5432';

module.exports = Object.freeze({
    domain: domain,
    postgreHost: postgreHost,
    postgrePort: postgrePort
});
