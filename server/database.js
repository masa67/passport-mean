/*jslint node: true */
'use strict';

var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var constants = require('../client/js/api.js');

mongoose.connect('mongodb://localhost/passport-mean', function (err, success) {
    if (err) {
        console.log(err + ', is mongodb running?');
    } else {
        console.log('Connected.');
    }
});

var Schema = mongoose.Schema;

var user = new Schema({
    accountType: String,
    accountId: String,
    email: String,
    name: String,
    password: String,
    username: String
});

user.methods.generateHash = function (password) {
    /*jslint stupid: true */
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

user.methods.validPassword = function (password) {
    /*jslint stupid: true */
    return bcrypt.compareSync(password, this.password);
};

var User = mongoose.model('User', user);

module.exports.User = User;
