const massive = require('massive');
const CONSTANTS = require('../app/utils/constants');

class Database {
    constructor() {
        if (Database.instance) return Database.instance;

        this.pg = "";
        Database.instance = this;
    }

    async init() {
        /*const {
        pgHost: host,
        pgPort: port,
        pgDBname: database,
        pgUserName: user,
        pgPassword: password
        } = config;*/
        this.pg = await massive({
            host: CONSTANTS.postgreHost,
            port: CONSTANTS.postgresPort,
            database: CONSTANTS.postgreDb,
            user: CONSTANTS.postgreUser,
            password: CONSTANTS.postgrePass
        });

        return this.massive;
    }

    destroy() {
        if (this.pg) this.pg.pgp.end();
    }
}

const instance = new Database();

module.exports = instance;