/*jslint node: true */
'use strict';

var config = require('../config');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var User = require('../database').User;
var passport = require('./passport-init');
var secrets = require('./secrets');
var constants = require('../../client/js/api.js');

passport.use('google', new GoogleStrategy({
    clientID: secrets.google.clientID,
    clientSecret: secrets.google.clientSecret,
    callbackURL: config.serverUrl + '/auth/google/callback'
},
    function (accessToken, refreshToken, profile, done) {
        User.findOne({
            accountType: constants.accountType.GOOGLE,
            accountId: profile.id
        }, function (err, user) {
            if (err) { return done(err); }

            if (!user) {
                user = new User({
                    accountType: constants.accountType.GOOGLE,
                    accountId: profile.id,
                    email: profile.emails[0].value,
                    name: profile.displayName,
                    password: undefined,
                    username: undefined
                });
                user.save(function (err) {
                    return done(err, user);
                });
            }
            return done(null, user);
        });
    }));
