/*jslint node: true */
'use strict';

var passport = require('passport');
var User = require('../database').User;

passport.serializeUser(function (user, done) {
    /*jslint nomen: true */
    done(null, user._id);
    /*jslint nomen: false */
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

module.exports = passport;
