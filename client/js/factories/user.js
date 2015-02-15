(function () {
    'use strict';

    /*global angular, constants */
    angular
        .module('UserService', [])
        .factory('user', ['$resource', '$q', function ($resource, $q) {

            var accountType,
                email,
                immLoginTried = false,
                name,
                username;

            return {
                immediateLogin: function () {
                    var d = $q.defer();

                    if (immLoginTried) {
                        if (username) {
                            d.resolve({
                                accountType: accountType,
                                email: email,
                                name: name,
                                username: username
                            });
                        } else {
                            d.reject({
                                status: 401
                            });
                        }
                    } else {

                        $resource('/user').get(function (data) {
                            accountType = data.accountType;
                            email = data.email;
                            name = data.name;
                            username = data.username;
                            immLoginTried = true;
                            d.resolve(data);
                        }, function (err) {
                            immLoginTried = true;
                            d.reject(err);
                        });
                    }

                    return d.promise;
                },
                login: function (userdata) {
                    var d = $q.defer();

                    $resource('/user/login').save(userdata, function (data) {
                        accountType = data.accountType;
                        email = data.email;
                        name = data.name;
                        username = data.username;
                        d.resolve();
                    }, function (err) {
                        d.reject(err);
                    });

                    return d.promise;
                },
                logout: function () {
                    var d = $q.defer();

                    $resource('/user/logout').get(function () {
                        accountType = undefined;
                        email = undefined;
                        name = undefined;
                        username = undefined;
                        d.resolve();
                    });

                    return d.promise;
                },
                register: function (userdata) {
                    var d = $q.defer();

                    switch (userdata.accountType) {
                    case constants.accountType.LOCAL:
                        $resource('/user/register').save(userdata, function (data) {
                            accountType = data.accountType;
                            email = data.email;
                            name = data.name;
                            username = data.username;
                            d.resolve();
                        }, function (err) {
                            d.reject(err);
                        });
                        break;
                    case constants.accountType.FACEBOOK:
                        $resource('/user/register/facebook').save(userdata, function (data) {
                            username = data.username;
                            d.resolve();
                        }, function (err) {
                            d.reject(err);
                        });
                        break;
                    case constants.accountType.GOOGLE:
                        $resource('/user/register/google').save(userdata, function (data) {
                            username = data.username;
                            d.resolve();
                        }, function (err) {
                            d.reject(err);
                        });
                        break;
                    case constants.accountType.TWITTER:
                        $resource('/user/register/twitter').save(userdata, function (data) {
                            username = data.username;
                            d.resolve();
                        }, function (err) {
                            d.reject(err);
                        });
                        break;
                    default:
                        d.reject();
                    }

                    return d.promise;
                },
                resetImmediateLogin: function () {
                    immLoginTried = false;
                }
            };
        }]);
}());