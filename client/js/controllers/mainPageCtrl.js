(function () {
    'use strict';

    /*global angular */
    angular.module('MainPage', [])
        .controller('MainPageController', [
            '$scope', '$location', 'user', function ($scope, $location, user) {

                $scope.accountType = undefined;
                $scope.loggedIn = false;
                $scope.email = undefined;
                $scope.name = undefined;
                $scope.username = undefined;

                user.immediateLogin().then(function (data) {
                    $scope.accountType = data.accountType;
                    $scope.email = data.email;
                    $scope.name = data.name;
                    $scope.username = data.username;
                    $scope.loggedIn = true;
                }, function (err) {
                    if (err.status === 401) {
                        $location.path('/login');
                    }
                });

                $scope.clickLogout = function () {
                    user.logout().then(function () {
                        $scope.username = undefined;
                        $scope.loggedIn = false;
                        $location.path('/login');
                    });
                };

            }]);
}());