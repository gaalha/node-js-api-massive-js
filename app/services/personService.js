class personService {

    static async deletePerson(req) {
        let id = req.params.id;
        let person = {
        id: id,
            deleted_at: new Date()
        }

        const result = await req.app.get('db').person.save(person);
        return result;
    }

}

module.exports = personService;