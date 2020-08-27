let db = require('../../db/dataBase');

class clientService {

    static async delete(req) {
        let id = req.params.id;
        let client = {
        id: id,
            deleted_at: new Date()
        }

        const result = await db.pg.client.save(client);
        return result;
    }

    static async getOne(req) {
        let id = req.params.id;
        const result = await db.pg.client.findOne({id: id});
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
                {'first_name ILIKE': '%' + search + '%'},
                {'last_name ILIKE': '%' + search + '%'},
                {'age =': isNaN(parseInt(search)) ? 0 : parseInt(search)},
                {'gender ILIKE': '%' + search + '%'}
            ]
        }

        const result = await db.pg.client.find(
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
        let result = await db.pg.client.count({'deleted_at IS': 'NULL',});
        return result;
    }

    static async save(req, id) {
        let client = {
            first_name: req.body.txtFirstName,
            last_name: req.body.txtLastName,
            age: req.body.txtAge,
            gender: req.body.txtGender,
        };

        if (id) {
            client.id = id;
            client.updated_at = new Date();
        } else {
            client.created_at = new Date();
        }

        return db.pg.client.save(client);
    }

}

module.exports = clientService;