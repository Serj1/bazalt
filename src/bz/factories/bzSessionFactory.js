define([
    'angular', 'bz/app',
    'bz/providers/bzConfig',
    'bz/helpers/diff'
], function(angular, app) {
    'use strict';

    app.factory('bzSessionFactory', ['$resource', 'bzConfig', '$q', '$log', 'jwtInterceptor', 'bzStorage', '$rootScope',
        function ($resource, config, $q, $log, jwtInterceptor, bzStorage, $rootScope) {
            var sessionObject = $resource(config.resource('/auth/session'), {}, {
                    'renew': { method: 'PUT' },
                    'changeRole': { method: 'PUT', params: {'action': 'changeRole'} },
                    '$oauthLogin': { method: 'POST', params: {'action': 'oauth'} },
                    '$login': { method: 'POST' },
                    '$logout': { method: 'DELETE' }
                }), defer = $q.defer(),
                $session,
                guestData = { is_guest: true, permissions: ['guest'] };

            sessionObject.prototype.$oauthLogin = function (data, callback, error) {
                sessionObject.$oauthLogin(data, function (result) {
                    $session.$set(result);
                    callback = callback || angular.noop;
                    callback($session);
                }, error);
            };
            sessionObject.prototype.$login = function (data, callback, error) {
                sessionObject.$login(data, function (result) {
                    $session.$set(result);
                    callback = callback || angular.noop;
                    callback($session);
                }, error);
            };
            sessionObject.prototype.$logout = function (callback, error) {
                sessionObject.$logout({}, function (data) {
                    data = angular.copy(guestData);
                    $session.$set(data);
                    //jwtInterceptor.setToken(undefined);
                    callback = callback || angular.noop;
                    callback($session);
                }, error);
            };
            sessionObject.prototype.$set = function (data) {
                var oldSession = angular.copy($session);
                angular.copy(data, this);
                defer.notify({ 'user': $session, 'old': oldSession });
                $rootScope.$emit('$user:sessionChecked');
            };
            sessionObject.prototype.$update = function (callback, error) {
                var oldSession = angular.copy($session);
                this.$renew(function ($session) {
                    defer.notify({ 'user': $session, 'old': oldSession });
                    $rootScope.$emit('$user:sessionChecked');
                    callback = callback || angular.noop;
                    callback($session);
                }, error);
            };
            sessionObject.prototype.$change = function (callback) {
                return defer.promise.then(null, null, callback);
            };
            sessionObject.prototype.$changeRole = function (roleId, callback, error) {
                var curUseLightFrontend = $session.role.use_light_frontend || 0;
                sessionObject.changeRole({'role_id': roleId}, function (result) {
                    $session.$set(result);
                    callback = callback || angular.noop;
                    callback($session);
                    if(curUseLightFrontend != result.role.use_light_frontend || 0) {
                        setTimeout(function(){
                            window.location.reload();
                        }, 200);
                    }
                }, error);
            };
            sessionObject.prototype.has = function (permission) {
                var permissions = this.permissions || [];
                if (!angular.isArray(permission)) {
                    permission = [permission];
                }
                return !permission.diff(permissions).length;
            };


            var baAuthUser = bzStorage.getItem('baAuthUser', 'cookie');

            $log.debug('Session in localStorage:', baAuthUser);

            $session = new sessionObject(baAuthUser || angular.copy(guestData));

            $session.$change(function () {
                if ($session.jwt_token) {
                    $log.info('Set JWT token: ' + $session.jwt_token);
                    jwtInterceptor.setToken($session.jwt_token);
                }
                bzStorage.setItem('baAuthUser', $session, 'cookie');
            });
            return $session;
        }]);

});
