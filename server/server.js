/*jslint node: true */
'use strict';

var bodyParser = require('body-parser');
var express = require('express');
var fs = require('fs');
var https = require('https');
var path = require('path');
var session = require('express-session');

var config = require('./config');
var auth = require('./routes/auth');
var users = require('./routes/users');

var passport = require('./auth/passport-init');
require('./auth/passport-local');
require('./auth/passport-facebook');
require('./auth/passport-google');
require('./auth/passport-twitter');

var app = express();

var sslOptions = {
    key: fs.readFileSync(config.sslKeyFile),
    cert: fs.readFileSync(config.sslCrtFile),
    ca: fs.readFileSync(config.sslCaFile)
};

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));

app.use(function (req, res, next) {
    // console.log(req);
    next();
});

app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());

app.use(require('express-force-domain')(config.serverUrl));

/*jslint nomen: true */
/*global __dirname */
app.use(express['static'](path.join(__dirname, '../client/views')));
app.use('/', express['static'](path.join(__dirname, '../client')));
app.use('/server', express['static'](path.join(__dirname, '/')));
app.use('/vendor', express['static'](path.join(__dirname, '../node_modules')));
app.use('/vendor2', express['static'](path.join(__dirname, '../bower_components')));

app.use('/auth', auth);
app.use('/user', users);

app.get('/login', function (req, res) {
    res.sendFile(path.join(__dirname, '../client/views/index.html'));
});

var server = https.createServer(sslOptions, app)
    .listen(config.serverPort, function() {
        console.log('Express server listening on port ' + config.serverPort);
    })

/*
app.listen(3002);
*/