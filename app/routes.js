const authController = require('./controllers/api/authController');
const personController = require('./controllers/api/personController');
const userController = require('./controllers/api/userController');

module.exports = function (app) {
    app.use('/api/auth',               authController);
    app.use('/api/user',               userController);
    app.use('/api/prson',             personController);
}
