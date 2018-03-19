let express = require('express');
let router = express.Router();

router.get('/:id', (req, res, next) => {
    let id = req.params.id;
    req.app.get('db').Person.find({personid: id}).then(result => {
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
    const order = req.query.order || 'asc';
    const page = req.body.page || req.query.page || 1;
    let search = req.body.search || req.query.search;
    
    if (search === undefined){
        search = '%%';
    }else{
        search = '%' + search + '%';
    }

    const pageSize = req.body.pageSize || req.query.pageSize || 10;
    const newPage = (page -1) * pageSize;

    req.app.get('db').query(
        'SELECT * FROM "Person" WHERE name ILIKE ${search} or gender ILIKE ${search} ORDER BY name '+ order +' LIMIT ${pageSize} OFFSET ${page}',
        {pageSize: pageSize, search: search, page: newPage})
    .then(results => {
        if(results.length === 0){
            res.send({success:false, message:res.__('api.person.get.empty')});
        }else{
            req.app.get('db').Person.count({
            }).then(total => {
                res.send({success: true, data: results, total: total, pageSize, page: page});
            });
        }
    });

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
        let Person = {
            name: req.body.txtName,
            age: req.body.txtAge,
            gender: req.body.txtGender
        };

        if(id != null && id != 0 && id != undefined){
            Person.personid = req.body.txtPersonId;
        }

        req.app.get('db').Person.save(Person).then(result => {
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

    req.app.get('db').Person.destroy({personid: id}).then(result => {
        if(result.length === 0){
            res.send({success:false, message:res.__('api.person.delete.error')});
        }else{
            res.send({success:true, message:res.__('api.person.delete.success')});
        }
    });
});

module.exports = router;
