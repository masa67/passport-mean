/*jslint node: true */
'use strict';

var config = require('../config');
var TwitterStrategy = require('passport-twitter').Strategy;
var User = require('../database').User;
var passport = require('./passport-init');
var secrets = require('./secrets');
var constants = require('../../client/js/api.js');

passport.use('twitter', new TwitterStrategy({
    consumerKey: secrets.twitter.consumerKey,
    consumerSecret: secrets.twitter.consumerSecret,
    callbackURL: config.serverUrl + '/auth/twitter/callback'
},
    function (accessToken, refreshToken, profile, done) {
        User.findOne({
            accountType: constants.accountType.TWITTER,
            accountId: profile.id
        }, function (err, user) {
            if (err) { return done(err); }

            if (!user) {
                user = new User({
                    accountType: constants.accountType.TWITTER,
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

