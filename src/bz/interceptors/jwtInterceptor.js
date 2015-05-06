define([
    'angular',
    'bz/app',
    'lz-string'
], function (angular, app, LZString) {
    'use strict';

    app.factory('jwtInterceptor', ['$rootScope', '$q', '$window', 'bzStorage', function ($rootScope, $q, $window, bzStorage) {
        return {
            request: function (config) {
                var token = bzStorage.getItem('token');
                config.headers = config.headers || {};
                if (token != 'undefined' && angular.isDefined(token)) {
                    config.headers.Authorization = 'Bearer ' + token;
                }
                return config;
            },
            response: function (response) {
                if (response.status === 401) {
                    // handle the case where the user is not authenticated
                }
                return response || $q.when(response);
            },
            getToken: function() {
                return bzStorage.getItem('token');
            },
            setToken: function(token) {
                bzStorage.setItem('token', token);
            }
        };
    }]);

    app.config(['$httpProvider', function ($httpProvider) {
        $httpProvider.interceptors.push('jwtInterceptor');
    }]);

});
