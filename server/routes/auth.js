/*jslint node: true */
'use strict';

var express = require('express');
var passport = require('../auth/passport-init');
var router = express.Router();
var User = require('../database').User;
var constants = require('../../client/js/api');

router.get('/facebook', passport.authenticate('facebook'));
router.get('/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/login'}),
    function (req, res) {
        if (req.user.username) {
            res.redirect('/');
        } else {
            res.redirect('/login');
        }
    });

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email']}));
router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/login'}),
    function (req, res) {
        if (req.user.username) {
            res.redirect('/');
        } else {
            res.redirect('/login');
        }
    });

router.get('/twitter', passport.authenticate('twitter'));
router.get('/twitter/callback',
    passport.authenticate('twitter', { failureRedirect: '/login'}),
    function (req, res) {
        if (req.user.username) {
            res.redirect('/');
        } else {
            res.redirect('/login');
        }
    });

module.exports = router;