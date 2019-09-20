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

        bcrypt.hash(plainPassword, CONSTANTS.saltRounds).then(hash => {
            user_app.password = hash;

            let result = await db.pg.user_app.save(user_app);
            return result;
        });
    }
}

module.exports = userService;