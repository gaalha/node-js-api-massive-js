const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const i18n = require('i18n');
const expressValidator = require('express-validator');
const massive = require('massive');
const routes = require('./app/routes');
const CONSTANTS = require('./app/utils/constants');
const cors = require('cors');
const {init} = require('./app/middlewares/authMiddleware');
let database = require('./db/dataBase');

const app = express();
app.listen(3000);
init(app);

database.init();

//Set locale
i18n.configure({
    locales:['en', 'es'],
    directory: __dirname + '/locales'
});
app.use(i18n.init);

// use it before all route definitions
app.use(cors({origin: 'http://localhost:4200'}));

//Set up Massive-js
// massive({
//     host: CONSTANTS.postgreHost,
//     port: CONSTANTS.postgresPort,
//     database: 'angular_crud',
//     user: 'edgarmejia',
//     password: '123123123'
// }).then(instance => {
//     app.set('db', instance);
// });

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());

//app.set('secretKey', 'kl-AHSfdlk-jadshkjlasdf-lkjAShdkjS');

routes(app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.send(err);
});

module.exports = app;