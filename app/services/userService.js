let db = require('../../db/dataBase');
let bcrypt = require('bcrypt');
const CONSTANTS = require('../utils/constants');

class userService {
    static async save(isEditing, id, username, plainPassword) {
        let user_app = {
            user_name: username
        };

        if (isEditing) {
            user_app.id = id;
            user_app.updated_at = new Date();
        } else {
            user_app.created_at = new Date();
        }

        user_app.password = await bcrypt.hash(plainPassword, CONSTANTS.saltRounds); //.then(hash => {
        return db.pg.user_app.save(user_app);
    }
}

module.exports = userService;
