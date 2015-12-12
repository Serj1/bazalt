define([
    'angular',
    'bz/app'
], function (angular, app) {
    'use strict';

    // catch net:ERR_EMPTY_RESPONSE and retry request after 200 ms
    app.factory('status324interceptor', ['$injector', '$q', '$timeout', function($injector, $q, $timeout) {
        return {
            'responseError': function(response) {
                if (response.status === 324) {
                    return $timeout(function() {
                        var $http = $injector.get('$http');
                        return $http(response.config);
                    }, 200);
                }
                return $q.reject(response);
            }
        };
    }]);


    app.config(['$httpProvider', function ($httpProvider) {
        $httpProvider.interceptors.push('status324interceptor');
    }]);
});