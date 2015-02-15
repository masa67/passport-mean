(function () {
    'use strict';

    /*global angular, constants*/
    angular
        .module('LoginPage', [])
        .controller('LoginPageController', [
            '$scope', '$rootScope', '$location', '$window',
            'httpLoadInterceptor', 'usSpinnerService', 'user',
            function ($scope, $rootScope, $location, $window,
                     httpLoadInterceptor, usSpinnerService, user) {

                $scope.accountType = undefined;
                $scope.constants = constants;
                $scope.ajaxOn = false;
                $scope.doReg = false;
                $scope.invalidCred = false;
                $scope.models = {
                    email: undefined,
                    password: undefined,
                    username: undefined
                };
                $scope.name = undefined;
                $scope.spinnerActive = false;
                $scope.usernameReserved = false;

                $rootScope.$on('us-spinner:spin', function () {
                    $scope.spinneractive = true;
                });

                $rootScope.$on('us-spinner:stop', function () {
                    $scope.spinneractive = false;
                });

                httpLoadInterceptor.registerObserverCallback(function (numLoadings) {
                    $scope.ajaxOn = numLoadings ? true : false;
                    if ($scope.ajaxOn) {
                        if (!$scope.spinneractive) {
                            usSpinnerService.spin('spinner-1');
                        }
                    } else {
                        if ($scope.spinneractive) {
                            usSpinnerService.stop('spinner-1');
                        }
                    }
                });

                user.immediateLogin().then(function (data) {
                    var models = $scope.models;
                    $scope.accountType = data.accountType;
                    $scope.name = data.name;
                    models.email = data.email;
                    models.username = data.username;

                    if (!data.username) {
                        $scope.doReg = true;
                    }
                });

                $scope.accSocialMedia = function () {
                    return ($scope.accountType === constants.accountType.FACEBOOK ||
                            $scope.accountType === constants.accountType.GOOGLE ||
                            $scope.accountType === constants.accountType.TWITTER);
                };

                $scope.clickFacebookLogin = function () {
                    user.resetImmediateLogin(); // enforce immediate login from server the next time it is called
                    $window.location.href = '/auth/facebook';
                };

                $scope.clickGoogleLogin = function () {
                    user.resetImmediateLogin(); // enforce immediate login from server the next time it is called
                    $window.location.href = '/auth/google';
                };

                $scope.clickTwitterLogin = function () {
                    user.resetImmediateLogin(); // enforce immediate login from server the next time it is called
                    $window.location.href = '/auth/twitter';
                };

                $scope.clickLogin = function () {
                    var models = $scope.models,
                        data = {
                            password: models.password,
                            username: models.username
                        };
                    user.login(data).then(function () {
                        $location.path('/');
                    }, function (err) {
                        if (err.status === 401) {
                            $scope.invalidCred = true;
                        }
                    });
                };

                $scope.clickLoginPage = function () {
                    $window.location.reload();
                };

                $scope.clickLogout = function () {
                    user.logout().then(function () {
                        $scope.username = undefined;
                        $window.location.reload();
                    });
                };

                $scope.clickRegister = function () {
                    var models = $scope.models,
                        data = {
                            accountType: $scope.accountType || constants.accountType.LOCAL,
                            email: $scope.accSocialMedia() ? undefined : models.email,
                            password: $scope.accSocialMedia() ? undefined : models.password,
                            username: models.username
                        };
                    user.register(data).then(function () {
                        $location.path('/');
                    }, function (err) {
                        if (err.status === 409) {
                            $scope.usernameReserved = true;
                        }
                    });
                };

                $scope.clickRegisterNow = function () {
                    $scope.doReg = true;
                };

            }]);
}());