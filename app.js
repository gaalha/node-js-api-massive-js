const express = require('express');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');

const i18n = require('i18n');
const expressValidator = require('express-validator');
const massive = require('massive');

const routes = require('./app/routes');
const CONSTANTS = require('./app/utils/constants');

//Set locale
i18n.configure({
    locales:['en', 'es'],
    directory: __dirname + '/locales'
});

const app = express();

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

//Set up Massive-js
massive({
    host: CONSTANTS.postgreHost,
    port: CONSTANTS.postgresPort,
    database: 'peopledb',
    user: 'postgres',
    password: ''
}).then(instance => {
    app.set('db', instance);
});

app.use(i18n.init);

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());

app.set('secretKey', 'kl-AHSfdlk-jadshkjlasdf-lkjAShdkjS');

routes(app);

app.all('*', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

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
