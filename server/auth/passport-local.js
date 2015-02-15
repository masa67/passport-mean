/*jslint node: true */
'use strict';

var LocalStrategy = require('passport-local').Strategy;
var User = require('../database').User;
var passport = require('./passport-init');
var constants = require('../../client/js/api.js');

passport.use('local-login', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: false
}, function (username, password, done) {
    User.findOne({ username: username }, function (err, user) {
        if (err) { return done(err); }
        if (!user ||
                user.accountType !== constants.accountType.LOCAL ||
                !user.validPassword(password)) {
            return done(null, false, { message: 'Invalid username or password'});
        }
        return done(null, user);
    });
}));

