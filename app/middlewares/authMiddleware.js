const passport = require('passport');
const passportJwt = require('passport-jwt');
const JwtStrategy = passportJwt.Strategy;
const { ExtractJwt } = passportJwt;
const CONSTANTS = require('../utils/constants');
let authService = require('../services/authService');

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('JWT'), // JWT x-access-token
    secretOrKey: CONSTANTS.jwtSecret
};

let init = (app) => {
    app.use(passport.initialize());
    passport.use(
        new JwtStrategy(opts, async (jwtPayload, done, error) => {
            try {
                const user = await authService.findById(jwtPayload.id);
                if (user) {
                    return done(null, user);
                }
                return done(null, false);
            } catch (error) {
                return done(error, false);
            }
        })
    );
}

let authJwt = () => {
    return passport.authenticate('jwt', { session: false });
}

module.exports = {
    init: init,
    authJwt: authJwt
};