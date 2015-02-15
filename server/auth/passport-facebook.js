/*jslint node: true */
'use strict';

var config = require('../config');
var FacebookStrategy = require('passport-facebook').Strategy;
var User = require('../database').User;
var passport = require('./passport-init');
var secrets = require('./secrets');
var constants = require('../../client/js/api.js');

passport.use('facebook', new FacebookStrategy({
    clientID: secrets.facebook.clientID,
    clientSecret: secrets.facebook.clientSecret,
    callbackURL: config.serverUrl + '/auth/facebook/callback'
},
    function (accessToken, refreshToken, profile, done) {
        User.findOne({
            accountType: constants.accountType.FACEBOOK,
            accountId: profile.id
        }, function (err, user) {
            if (err) { return done(err); }

            if (!user) {
                user = new User({
                    accountType: constants.accountType.FACEBOOK,
                    accountId: profile.id,
                    email: profile.emails ? profile.emails[0].value : undefined,
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
