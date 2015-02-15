/*jslint node: true */
'use strict';

var express = require('express');
var passport = require('../auth/passport-init');
var router = express.Router();
var User = require('../database').User;
var constants = require('../../client/js/api');

router.get('/', function (req, res) {
    if (req.user) {
        res.send({
            accountType: req.user.accountType,
            email: req.user.email,
            name: req.user.name,
            username: req.user.username
        });
    } else {
        res.sendStatus(401);
    }
});

router.post('/login', passport.authenticate('local-login'), function (req, res) {
    res.send(); // Auth ok.
});

router.get('/logout', function (req, res) {
    req.logout();
    req.session.destroy();
    req.session = undefined;
    req.user = undefined;
    res.clearCookie('user');
    res.send();
});

router.post('/register', function (req, res) {
    if (req.user) {
        res.sendStatus(401);
    } else {
        User.findOne({ username: req.body.username}, function (err, user) {
            if (err) {
                res.sendStatus(500);
            } else {
                if (user) {
                    res.sendStatus(409);
                } else {
                    user = new User({
                        accountType: constants.accountType.LOCAL,
                        accountId: undefined,
                        email: req.body.email,
                        name: undefined,
                        username: req.body.username
                    });
                    user.password = user.generateHash(req.body.password);

                    user.save(function (err) {
                        if (err) {
                            res.sendStatus(500);
                        } else {
                            res.send();
                        }
                    });
                }
            }
        });
    }
});

router.post('/register/facebook', function (req, res) {
    if (!req.user || req.user.accountType !== constants.accountType.FACEBOOK) {
        res.sendStatus(401);
    } else {
        User.findOne({ username: req.body.username}, function (err, user) {
            if (err) {
                res.sendStatus(500);
            } else {
                if (user) {
                    res.sendStatus(409);
                } else {
                    req.user.username = req.body.username;
                    req.user.save(function (err) {
                        if (err) {
                            res.sendStatus(500);
                        } else {
                            res.send();
                        }
                    });
                }
            }
        });
    }
});

router.post('/register/google', function (req, res) {
    if (!req.user || req.user.accountType !== constants.accountType.GOOGLE) {
        res.sendStatus(401);
    } else {
        User.findOne({ username: req.body.username}, function (err, user) {
            if (err) {
                res.sendStatus(500);
            } else {
                if (user) {
                    res.sendStatus(409);
                } else {
                    req.user.username = req.body.username;
                    req.user.save(function (err) {
                        if (err) {
                            res.sendStatus(500);
                        } else {
                            res.send();
                        }
                    });
                }
            }
        });
    }
});

router.post('/register/twitter', function (req, res) {
    if (!req.user || req.user.accountType !== constants.accountType.TWITTER) {
        res.sendStatus(401);
    } else {
        User.findOne({ username: req.body.username}, function (err, user) {
            if (err) {
                res.sendStatus(500);
            } else {
                if (user) {
                    res.sendStatus(409);
                } else {
                    req.user.username = req.body.username;
                    req.user.save(function (err) {
                        if (err) {
                            res.sendStatus(500);
                        } else {
                            res.send();
                        }
                    });
                }
            }
        });
    }
});

module.exports = router;
