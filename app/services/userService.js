let db = require('../../db/dataBase');
let bcrypt = require('bcrypt');
const CONSTANTS = require('../utils/constants');

class userService {
    static async save(id, user_name, email, password) {
        let user_app = {user_name, email};

        if (id) {
            user_app.id = id;
            user_app.updated_at = new Date();
        } else {
            user_app.created_at = new Date();
        }

        user_app.password = await bcrypt.hash(password, CONSTANTS.saltRounds); //.then(hash => {
        return db.pg.user_app.save(user_app);
    }

    static async getOne(req) {
        let id = req.params.id;
        const result = await db.pg.user_app.findOne({id: id});
        return result;
    }

    static async getAll(req, page, pageSize) {
        let active = req.query.active || 'id';
        const order = req.query.order || 'desc';
        let search = req.body.search || req.query.search;
        const newPage = (page -1) * pageSize;

        if (search === undefined) {search = '%%';} 

        const CRITERIA = {
            'deleted_at IS': 'NULL',
            or: [
                {'user_name ILIKE': '%' + search + '%'},
                {'email ILIKE': '%' + search + '%'}
            ]
        }

        const result = await db.pg.user_app.find(
            CRITERIA,
            {
                order: [{
                    field: active,
                    direction: order,
                }],
                offset: newPage,
                limit: pageSize
            }
        )

        return result;
    }

    static async getAllCount() {
        let result = await db.pg.user_app.count({'deleted_at IS': 'NULL',});
        return result;
    }

    static async delete(req) {
        let id = req.params.id;
        let user_app = {
            id: id,
            deleted_at: new Date()
        }

        const result = await db.pg.user_app.save(user_app);
        return result;
    }

}

module.exports = userService;
