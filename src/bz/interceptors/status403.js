define([
    'angular',
    'bz/app',
    'bz/factories/bzInterceptorBuffer'
], function (angular, app) {
    'use strict';

    // catch unauthorizate requests
    app.factory('status403interceptor', ['$rootScope', '$q', 'bzInterceptorBuffer',
        function ($rootScope, $q, httpBuffer) {


            $rootScope.$on('baUserLogin', function () {
                var updater = function (config) {
                    return config;
                };
                httpBuffer.retryAll(updater);
            });

            return {
                response: function (response) {
                    return response || $q.when(response);
                },
                responseError: function (response) {
                    if (response.status === 403 && !response.config.ignoreAuthModule) {
                        var deferred = $q.defer();
                        httpBuffer.append(response.config, deferred);
                        $rootScope.$broadcast('$user:loginRequired');
                        return deferred.promise;
                    }
                    // otherwise, default behaviour
                    return $q.reject(response);
                }
            };
        }]);


    app.config(['$httpProvider', function ($httpProvider) {
        $httpProvider.interceptors.push('status403interceptor');
    }]);
});