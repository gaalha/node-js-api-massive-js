let db = require('../../db/dataBase');

class personService {

    static async deletePerson(req) {
        let id = req.params.id;
        let person = {
        id: id,
            deleted_at: new Date()
        }

        const result = await db.pg.person.save(person);
        return result;
    }

    static async getOne(req) {
        let id = req.params.id;
        const result = await db.pg.person.findOne({id: id});
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

        const result = await db.pg.person.find(CRITERIA,
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
        let result = await db.pg.person.count({'deleted_at IS': 'NULL',});
        return result;
    }

    static async save(req, personId) {
        let person = {
            first_name: req.body.txtFirstName,
            last_name: req.body.txtLastName,
            age: req.body.txtAge,
            gender: req.body.txtGender,
        };

        if (personId) {
            person.id = personId;
            person.updated_at = new Date();
        } else {
            person.created_at = new Date();
        }

        return db.pg.person.save(person);
    }

}

module.exports = personService;