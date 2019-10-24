let db = require('../../db/dataBase');

class personService {

    static async deletePerson(req) {
        let id = req.params.id;
        let person = {
            id: id,
            deleted_at: new Date()
        };

        return db.pg.person.save(person);
    }

    static async getOne(req) {
        let id = req.params.id;
        return await db.pg.person.findOne({id: id});
    }

    static async getAll(req, page, pageSize) {
        let active = req.query.active || 'first_name';
        const order = req.query.order || 'asc';
        let search = req.body.search || req.query.search;
        const newPage = (page - 1) * pageSize;

        if (search === undefined) {
            search = '%%';
        }
        const CRITERIA = {
            'deleted_at IS': 'NULL',
            or: [
                {'first_name ILIKE': '%' + search + '%'},
                {'last_name ILIKE': '%' + search + '%'},
                {'age =': isNaN(parseInt(search)) ? 0 : parseInt(search)},
                {'gender ILIKE': '%' + search + '%'}
            ]
        };

        return await db.pg.person.find(CRITERIA,
            {
                order: [{
                    field: active,
                    direction: order,
                }],
                offset: newPage,
                limit: pageSize
            }
        );
    }

    static async getAllCount() {
        return await db.pg.person.count({'deleted_at IS': 'NULL',});
    }

    static async save(req) {
        let id = req.body.id;
        let person = {
            first_name: req.body.txtFirstName,
            last_name: req.body.txtLastName,
            age: req.body.txtAge,
            gender: req.body.txtGender,
        };
        const isEditing = id !== undefined && id != null && id !== 0;

        if (isEditing) {
            person.id = id;
            person.updated_at = new Date();
        } else {
            person.created_at = new Date();
        }
        return db.pg.person.save(person);
    }

}

module.exports = personService;
