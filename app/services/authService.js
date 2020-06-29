let bcrypt = require('bcrypt');
let jwt = require('jsonwebtoken');
const CONSTANTS = require('../utils/constants');
let db = require('../../db/dataBase');

function createJwtToken(userId, username) {
    return jwt.sign({ user_name: username, id: userId }, CONSTANTS.jwtSecret, { expiresIn: CONSTANTS.jwtExpiration });
}

class authService {
    static async findById(id) {
        const result = await db.pg.user_app.findOne(Number(id));
        return result;
    }

    static async login(req, res) {
        const user_name = req.body.txtUsername;
        const plainPassword = req.body.txtPassword;

        const result = await db.pg.user_app.findOne({ 'deleted_at IS': 'NULL', user_name: user_name });

        if (result) {
            const checkPassword = await bcrypt.compare(plainPassword, result.password);

            if (!checkPassword) {
                return { success: false, message: 'Password no match', token: null }
            }

            const token = createJwtToken(result.id, result.user_name);
            return { success: true, message: 'Access data', token: token };
        } else {
            return { success: false, message: res.__('api.auth.login.data.error'), token: null }
        }
    }

}

module.exports = authService;