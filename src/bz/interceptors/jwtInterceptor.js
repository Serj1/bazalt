define([
    'angular',
    'bz/app'
], function (angular, app) {
    'use strict';

    app.factory('jwtInterceptor', ['$rootScope', '$q', '$window', 'bzStorage', function ($rootScope, $q, $window, bzStorage) {
        return {
            request: function (config) {
                var token = bzStorage.getItem('token', 'cookie');
                config.headers = config.headers || {};
                if (token != 'undefined' && angular.isDefined(token)) {
                    config.headers.Authorization = 'Bearer ' + token;
                }
                var browserId = bzStorage.getItem('browserId', 'cookie');
                if (browserId) {
                    config.headers['X-Browser-Id'] = browserId;
                }
                return config;
            },
            response: function (response) {
                if (response.status === 401) {
                    // handle the case where the user is not authenticated
                }
                return response || $q.when(response);
            },
            getToken: function () {
                return bzStorage.getItem('token', 'cookie');
            },
            setToken: function (token) {
                bzStorage.setItem('token', token, 'cookie');
                var domain = window.bazalt.cookieDomain || window.location.hostname;
                var isSecure = window.location.protocol == 'https:';
                document.cookie = [
                    'auth_token=' + token,
                    'path=/',
                    'domain=' + domain,
                    (isSecure ? 'secure=true' : '')
                ].join('; ');
            }
        };
    }]);

    app.config(['$httpProvider', function ($httpProvider) {
        $httpProvider.interceptors.push('jwtInterceptor');
    }]);

});
