(function () {
    'use strict';

    /*global angular */
    angular
        .module('PpApp', [
            'ngRoute',
            'ngResource',
            'angularSpinner',
            'rcForm',
            'validation.match',
            'appRoutes',
            'HttpLoadInterceptor',
            'UserService',
            'MainPage',
            'LoginPage'
        ])
        .config(['$httpProvider', function ($httpProvider) {
            $httpProvider.interceptors.push('httpLoadInterceptor');
        }]);
}());