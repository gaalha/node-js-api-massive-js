const authController = require('./controllers/api/authController');
const clientController = require('./controllers/api/clientController');
const userController = require('./controllers/api/userController');

module.exports = function (app) {
    app.use('/api/auth',               authController);
    app.use('/api/user',               userController);
    app.use('/api/client',             clientController);
}
