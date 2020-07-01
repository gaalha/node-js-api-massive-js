let db = require('../../db/dataBase');
let bcrypt = require('bcrypt');
const CONSTANTS = require('../utils/constants');

class userService {
    static async save(id, user_name, email, password) {
        let user_app = {user_name};

        if (id) {
            user_app.id = id;
            user_app.updated_at = new Date();
        } else {
            user_app.created_at = new Date();
        }
        user_app.email = email;
        user_app.password = await bcrypt.hash(password, CONSTANTS.saltRounds); //.then(hash => {
        return db.pg.user_app.save(user_app);
    }
}

module.exports = userService;
