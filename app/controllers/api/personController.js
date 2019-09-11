let express = require('express');
let router = express.Router();

router.get('/:id', (req, res, next) => {
    let id = req.params.id;
    req.app.get('db').person.findOne({id: id}).then(result => {
        if(result.length === 0){
            res.send({success:false, message:res.__('api.person.get.error')});
        }else{
            res.send({success: true, data: result});
        }
    });
});

/*router.get('*', (req, res, next) => {
    req.app.get('db').Person.find().then(results => {
        if(results.length === 0){
            res.send({success:false, message:res.__('api.person.get.empty')});
        }else{
            res.send({success: true, data: results});
        }
    });
});*/


router.get('*', (req, res, next) => {
    let active = req.query.active || 'first_name';
    const order = req.query.order || 'asc';
    const page = req.body.page || req.query.page || 1;
    let search = req.body.search || req.query.search;

    if (active === 'name') {active = 'first_name'}
    if (search === undefined) {search = '%%';} 
    else {search = '%' + search + '%';}

    const  pageSize = req.body.pageSize || req.query.pageSize || 10;
    const newPage = (page -1) * pageSize;

    /*req.app.get('db').query(
        'SELECT * FROM "person" WHERE first_name ILIKE ${search} or gender ILIKE ${search} ORDER BY first_name '+ order +' LIMIT ${pageSize} OFFSET ${page}',
        {pageSize: pageSize, search: search, page: newPage})*/

    /*req.app.get('db').person.find({},{
        order: order,
        offset: page,
        limit: pageSize
    })*/

    req.app.get('db').person.find({
        'deleted_at IS': 'NULL',
        or: [
            {'first_name ILIKE': search},
            {'last_name ILIKE': search},
            {'gender ILIKE': search}
        ]},
        {
            order: [{
                field: active,
                direction: order,
            }],
            offset: newPage,
            limit: pageSize
        })
    .then((results) => {
        if(results.length === 0){
            res.send({success:false, message:res.__('api.person.get.empty')});
        }else{
            req.app.get('db').person.count({
            }).then(total => {
                res.send({success: true, data: results, total: total, pageSize, page: page});
            });
            //res.send({success: true, data: results, total: results.length, pageSize, page: page});
        }
    }).catch(error => {
        next(error);
    })

});

router.post('/save', (req, res, next) => {
    req.checkBody('txtPersonId').trim();
    req.checkBody('txtName').trim().notEmpty();
    req.checkBody('txtAge').trim().notEmpty();
    req.checkBody('txtGender').trim().notEmpty();
    let errors = req.validationErrors(); 

    if(errors){
        res.send({
            success: false,
            message: res.__('api.person.fields.empty')
        });
    }else{
        let id = req.body.txtPersonId;
        let person = {
            first_name: req.body.txtName,
            age: req.body.txtAge,
            gender: req.body.txtGender,
            is_deleted: false
        };

        if(id != null && id != 0 && id != undefined){
            person.id = req.body.txtPersonId;
        }

        req.app.get('db').person.save(person).then(result => {
            if(result.length === 0){
                res.send({success:false, message:res.__('api.person.save.error')});
            }else{
                res.send({success:true, message:res.__('api.person.save.success')});
            }
        });
    }
});

router.delete('/delete/:id', (req, res, next) => {
    let id = req.params.id;
    let success = null;

    req.app.get('db').person.destroy({id: id}).then(result => {
        if(result.length === 0){
            res.send({success:false, message:res.__('api.person.delete.error')});
        }else{
            res.send({success:true, message:res.__('api.person.delete.success')});
        }
    });
});

module.exports = router;
