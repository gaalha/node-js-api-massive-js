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

router.get('*', (req, res, next) => {
    req.app.get('db').Person.find().then(results => {
        if(results.length === 0){
            res.send({success:false, message:res.__('api.person.get.empty')});
        }else{
            res.send({success: true, data: results});
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
