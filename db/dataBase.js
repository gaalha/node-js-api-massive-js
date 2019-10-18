const massive = require('massive');
const CONSTANTS = require('../app/utils/constants');

class Database {
    constructor() {
        if (Database.instance) return Database.instance;

        this.pg = "";
        Database.instance = this;
    }

    async init() {
        this.pg = await massive({
            host: CONSTANTS.postgreHost,
            port: CONSTANTS.postgrePort,
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
