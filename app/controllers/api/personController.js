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
    }).catch(error => {
        next(error);
    });
});


router.get('*', (req, res, next) => {
    let active = req.query.active || 'first_name';
    const order = req.query.order || 'asc';
    const page = req.body.page || req.query.page || 1;
    let search = req.body.search || req.query.search;
    
    if (search === undefined) {search = '%%';} 
    else {search = '%' + search + '%';}

    const  pageSize = req.body.pageSize || req.query.pageSize || 10;
    const newPage = (page -1) * pageSize;

    req.app.get('db').person.find({
        'deleted_at IS': 'NULL',
        or: [
            {'first_name ILIKE': search},
            {'last_name ILIKE': search},
            {'age =': normalizedInt(search)},
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
            req.app.get('db').person.count({'deleted_at IS': 'NULL',}).then(total => {
                res.send({success: true, data: results, total: total, pageSize, page: page});
            }).catch(error => {
                next(error);
            });
            //res.send({success: true, data: results, total: results.length, pageSize, page: page});
        }
    }).catch(error => {
        next(error);
    });
});

router.post('/save', (req, res, next) => {
    req.checkBody('id').trim();
    req.checkBody('txtFirstName').trim().notEmpty();
    req.checkBody('txtLastName').trim().notEmpty();
    req.checkBody('txtAge').trim().notEmpty();
    req.checkBody('txtGender').trim().notEmpty();
    let errors = req.validationErrors(); 

    if(errors){
        res.send({
            success: false,
            message: res.__('api.person.fields.empty')
        });
    }else{
        let id = req.body.id;
        let person = {
            first_name: req.body.txtFirstName,
            last_name: req.body.txtLastName,
            age: req.body.txtAge,
            gender: req.body.txtGender,
        };
        const isEditing = id != null && id != 0 && id != undefined;

        if (isEditing) {
            person.id = id;
            person.updated_at = new Date();
        } else {
            person.created_at = new Date();
        }

        req.app.get('db').person.save(person).then((result, error) => {
            console.log(error);
            if(result.length === 0){
                res.send({success:false, message:res.__((isEditing ? 'api.person.update.error' : 'api.person.save.error'))});
            }else{
                res.send({success:true, message:res.__((isEditing ? 'api.person.update.success' : 'api.person.save.success'))});
            }
        }).catch(error => {
            next(error);
        });
    }
});

router.delete('/delete/:id', (req, res, next) => {
    let id = req.params.id;
    let person = {
        id: id,
        deleted_at: new Date()
    }

    // req.app.get('db').person.destroy({id: id}).then(result => {
    //     if(result.length === 0){
    //         res.send({success:false, message:res.__('api.person.delete.error')});
    //     }else{
    //         res.send({success:true, message:res.__('api.person.delete.success')});
    //     }
    // });

    req.app.get('db').person.save(person).then((result, error) => {
        console.log(error);
        if (result.length === 0) {
            res.send({success:false, message:res.__('api.person.delete.error')});
        } else {
            res.send({success:true, message:res.__('api.person.delete.succes')});
        }
    }).catch(error => {
        next(error);
    });
});

let normalizedInt = (num) => {
    num = num.replace(/%/g, '');
    var i = parseInt(num);

    return (isNaN(i)) ? 0 : i;
}

module.exports = router;
