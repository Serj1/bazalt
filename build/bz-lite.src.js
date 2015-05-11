(function () {define('bz/app',[
    'angular',

    'angular-resource', 'angular-route', 'angular-cookies',

    'angular-route-segment', 'ngstorage', 'lz-string'
], function(angular) {
    'use strict';

    return angular.module('bz', [
        'ngResource', 'ngRoute', 'ngCookies', 'ngLocale',

        'route-segment', 'view-segment', 'ngStorage'
    ]);
});

define('bz/factories/bzStorage',[
    'angular', 'bz/app',
    'lz-string'
], function (angular, app, LZString) {
    'use strict';

    app.factory('bzStorage', ['$cookieStore', '$localStorage', '$window',
        function ($cookieStore, $localStorage, $window) {
            var localStorageSupported = function () {
                try {
                    $localStorage.setItem("test", "test");
                    $localStorage.removeItem("test");
                    return true;
                } catch (e) {
                    return false;
                }
            }

            return {
                setItem: function (key, value, fallbackType) {
                    if (localStorageSupported()) {
                        $localStorage[key] = value;
                    } else if (fallbackType != undefined && fallbackType == 'cookie') {
                        $cookieStore.put(key, LZString.compressToEncodedURIComponent(angular.toJson(value)));
                    } else {
                        $window['bzStorage' + key] = value;
                    }
                },
                getItem: function (key, fallbackType) {
                    if (localStorageSupported()) {
                        return $localStorage[key] || null;
                    } else if (fallbackType != undefined && fallbackType == 'cookie') {
                        return $cookieStore.get(key) ? angular.fromJson(LZString.decompressFromEncodedURIComponent($cookieStore.get(key))) : null;
                    } else {
                        return $window['bzStorage' + key] || null;
                    }
                }
            };
        }]);

});

define('bz/factories/bzInterceptorBuffer',[
    'bz/app'
], function (app) {
    'use strict';

    app.factory('bzInterceptorBuffer',  ['$injector', function($injector) {
        /** Holds all the requests, so they can be re-requested in future. */
        var buffer = [];

        /** Service initialized later because of circular dependency problem. */
        var $http;

        function retryHttpRequest(config, deferred) {
            function successCallback(response) {
                deferred.resolve(response);
            }
            function errorCallback(response) {
                deferred.reject(response);
            }
            $http = $http || $injector.get('$http');
            $http(config).then(successCallback, errorCallback);
        }

        return {
            /**
             * Appends HTTP request configuration object with deferred response attached to buffer.
             */
            append: function(config, deferred) {
                buffer.push({
                    config: config,
                    deferred: deferred
                });
            },

            /**
             * Retries all the buffered requests clears the buffer.
             */
            retryAll: function(updater) {
                for (var i = 0; i < buffer.length; ++i) {
                    retryHttpRequest(updater(buffer[i].config), buffer[i].deferred);
                }
                buffer = [];
            }
        };
    }]);

});
define('bz/interceptors/status403',[
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
define('bz/interceptors/jwtInterceptor',[
    'angular',
    'bz/app'
], function (angular, app) {
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
                return bzStorage.getItem('token', 'cookie');
            },
            setToken: function(token) {
                bzStorage.setItem('token', token, 'cookie');
            }
        };
    }]);

    app.config(['$httpProvider', function ($httpProvider) {
        $httpProvider.interceptors.push('jwtInterceptor');
    }]);

});

define('bz/providers/bzConfig',[
    'angular',
    'bz/app'
], function(angular, app) {
    'use strict';

    app.provider('bzConfig', [function() {
        var options = {
            api: '/api/v1',
            templatePrefix: '',
            languages: ['en'],
            checkSessionOnStart: false,
            errorTemplates: {
                403: 'views/error/403.html',
                404: 'views/error/404.html'
            }
        };

        this.errorResolver = function () {
            return {
                template: '<div ng-include="templateUrl"></div>',
                controller: ['$scope', 'error', function($scope, error) {
                    $scope.error = error;
                    $scope.templateUrl = options.errorTemplates[error.status];
                }]
            };
        };

        this.api = function (api) {
            options.api = api;
            return this;
        };

        this.templatePrefix = function (templatePrefix) {
            options.templatePrefix = templatePrefix;
            return this;
        };

        this.checkSessionOnStart = function (checkSessionOnStart) {
            options.checkSessionOnStart = checkSessionOnStart;
            return this;
        };

        this.templateUrl = function(templateUrl) {
            return function() {
                var url = options.templatePrefix + templateUrl;
                return url;
            };
        };

        this.languages = function(languages) {
            options.languages = languages;
            return this;
        };

        options = angular.isDefined(window.bazalt) ? angular.extend(options, window.bazalt) : options;

        this.$get = ['$log', function($log) {
            $log.debug('Configuration:', options);
            var self = this;
            return {
                templatePrefix: function() {
                    return options.templatePrefix;
                },
                templateUrl: function (templateUrl) {
                    return self.templateUrl(templateUrl);
                },
                checkSessionOnStart: function () {
                    return options.checkSessionOnStart;
                },
                api: function () {
                    return options.api;
                },
                resource: function (url) {
                    return options.api + url;
                },
                languages: function () {
                    return options.languages;
                }
            };
        }];
    }]);

});
define('bz/providers/bzLanguage',[
    'angular',
    'bz/app', 'bz/providers/bzConfig'
], function(angular, app) {
    'use strict';

    app.provider('bzLanguage', ['$localeProvider', function($locale) {
        this.$language = $locale.$get().id.substring(0, 2);

        this.id = function (id) {
            this.$language = id;
            return this;
        };

        this.$get = ['$log', '$rootScope', 'bzConfig', function($log, $rootScope, config) {
            var self = this;
            $log.debug('Language: ' + self.$language);
            return {
                id: function (id) {
                    if (angular.isDefined(id)) {
                        var oldLang = self.$language;
                        if (config.languages().indexOf(id) == -1) {
                            throw new Error('Language "' + id + '" not allowed');
                        }
                        $rootScope.$emit('$languageChangeStart', id, oldLang);
                        self.$language = id;
                        $log.debug('Language: ' + id);
                        $rootScope.$emit('$languageChangeSuccess', id, oldLang);
                    }
                    return self.$language;
                }
            };
        }];
    }]);

});
define('bz/helpers/filter',[], function() {
    'use strict';

    if (!Array.prototype.filter) {
        Array.prototype.filter = function (callback) {
            var arr = [];
            callback = callback || function() {};
            for (var i = 0, count = this.length; i < count; i++) {
                if (callback(this[i])) {
                    arr.push(this[i]);
                }
            }
            return arr;
        };
    }

});
define('bz/helpers/indexOf',[], function() {
    'use strict';

    if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function (obj, fromIndex) {
            if (fromIndex == null) {
                fromIndex = 0;
            } else if (fromIndex < 0) {
                fromIndex = Math.max(0, this.length + fromIndex);
            }
            for (var i = fromIndex, j = this.length; i < j; i++) {
                if (this[i] === obj)
                    return i;
            }
            return -1;
        };
    }

});
define('bz/helpers/diff',['bz/helpers/filter', 'bz/helpers/indexOf'], function() {
    'use strict';

    if (!Array.prototype.diff) {
        Array.prototype.diff = function (a) {
            return this.filter(function(i) {return !(a.indexOf(i) > -1);});
        };
    }

});
define('bz/factories/bzSessionFactory',[
    'angular', 'bz/app',
    'bz/providers/bzConfig',
    'bz/helpers/diff'
], function(angular, app) {
    'use strict';

    app.factory('bzSessionFactory', ['$resource', 'bzConfig', '$q', '$log', 'jwtInterceptor', 'bzStorage',
        function ($resource, config, $q, $log, jwtInterceptor, bzStorage) {
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
            };
            sessionObject.prototype.$update = function (callback, error) {
                var oldSession = angular.copy($session);
                this.$renew(function ($session) {
                    defer.notify({ 'user': $session, 'old': oldSession });
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
                    if(curUseLightFrontend != result.role.use_light_frontend || 0) {
                        window.location.reload();
                    }
                    callback = callback || angular.noop;
                    callback($session);
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

define('bz/providers/bzUser',[
    'angular',
    'bz/app',

    'bz/factories/bzSessionFactory',

    'bz/helpers/diff'
], function(angular, app) {
    'use strict';

    app.provider('bzUser', [function() {

        // @todo add tests
        this.access = function () {
            var permissionsSet = arguments;
            return ['$q', 'bzUser', '$log', '$rootScope', function ($q, $user, $log, $rootScope) {
                var deferred = $q.defer();
                var allowed = false;
                for (var i = 0, diff = []; i < permissionsSet.length; i++) {
                    diff = permissionsSet[i].diff($user.permissions || []);
                    allowed = (!diff.length);
                    if (allowed) {
                        break;
                    }
                }

                if (permissionsSet.length == 0 || allowed) {
                    deferred.resolve(permissionsSet);
                } else {
                    $log.debug('User haven\'t permissions:', diff);
                    $rootScope.$emit('$user:pemissionDenied', diff);
                    deferred.reject({
                        'status': '403',
                        'message': 'Permission denied',
                        'permissions': permissionsSet,
                        'diff': diff,
                        'user': $user
                    });
                }

                return deferred.promise;
            }];
        };

        this.$get = ['bzSessionFactory', '$cookieStore', '$rootScope', 'bzConfig', '$q',
            function($session, $cookieStore, $rootScope, $config, $q) {
                var user = $session;

            if ($config.checkSessionOnStart()) {
                $session.$update();
            }
            return user;
        }];
    }]);

});
define('bz/directives/bzLoadingContainer',[
    'bz/app'
], function(app) {

    app.directive('bzLoadingContainer', function() {
        return {
            restrict: 'A',
            scope: false,
            link: function(scope, element, attrs) {
                var loadingLayer = angular.element(document.createElement('div')).addClass('bz-loading ng-hide');
                element.addClass('bz-loading-container').append(loadingLayer);
                scope.$watch(attrs.bzLoadingContainer, function(value) {
                    loadingLayer.toggleClass('ng-hide', !value);
                });
            }
        };
    });

});
define('bz/filters/translate',['bz/app'], function (app) {

    app.filter('translate', ['$rootScope', '$http', function ($rootScope, $http) {
        var strings = {};
        var trTimers = {};

        var translateFilter = function (string) {
            var translateBundle = $rootScope.$localeBundle || {};
            if (window.bazalt.trackNotTranslated != undefined) {
                if ($rootScope.$localeBundle && translateBundle[string] == undefined && strings[string] == undefined) {
                    strings[string] = string;
                    //console.log('add', string);
                    //console.trace();
                    trTimers[string] = setTimeout(function () {
                        //console.log('send', string);
                        $http({
                            url: '/api/rest.php/translates?action=save-with-translate',
                            method: 'PUT',
                            data: {
                                new_words: string
                            }
                        });
                    }, 10000);
                }
                if ($rootScope.$localeBundle && translateBundle[string] != undefined && strings[string] != undefined) {
                    //console.log('clear', string);
                    delete strings[string];
                    clearTimeout(trTimers[string]);
                }
            }

            return translateBundle[string] || string;
        };

        translateFilter.$stateful = true;

        return translateFilter;
    }]);

});
define('bz/filters/language',[
    'bz/app',

    'bz/providers/bzLanguage'
], function (app) {
    'use strict';

    app.filter('language', ['bzLanguage', function (bzLanguage) {
        var languageFilter = function (value, language) {
            if (typeof value == 'undefined' || value === null) {
                return value;
            }
            language = language || bzLanguage.id();
            if (!value[language] && value.orig) {
                return value[value.orig];// + ' (' + value.orig + ')';
            }
            return value[language] || null;
        }

        languageFilter.$stateful = true;

        return languageFilter;
    }]);

});
define('bz',[
    'bz/app',

    'bz/factories/bzStorage',

    'bz/interceptors/status403',
    'bz/interceptors/jwtInterceptor',

    'bz/providers/bzLanguage',
    'bz/providers/bzConfig',
    'bz/providers/bzUser',

    'bz/directives/bzLoadingContainer',

    'bz/filters/translate',
    'bz/filters/language'
], function(app) {

    app.config(['$httpProvider', function($httpProvider) {
        // send cookies via CORS
        $httpProvider.defaults.withCredentials = true;
    }]);

    app.run(['$rootScope', 'bzLanguage', 'bzConfig', '$location', '$log', '$route', 'bzUser', '$routeSegment',
        function($rootScope, $language, $config, $location, $log, $route, $user, $routeSegment) {
        //$log.debug('Thanks for using Bazalt CMS (http://bazalt-cms.com) by Vitalii Savchuk (esvit666@gmail.com)');

        $rootScope.$language = $language;
        $rootScope.$config = $config;
        $rootScope.$user = $user;

        // reload route for check permissions for new user
        $user.$change(function(e) {
            var olduser = e.old,
                newuser = e.user;

            if (angular.isDefined(olduser) &&
                (olduser.id != newuser.id || !angular.equals(olduser.permissions, newuser.permissions))) {
                $log.debug('User changed:', newuser, 'old:', olduser);
                $routeSegment.reload();
            }
        });

        // track for change language url like: /en, /ru
        $rootScope.$on('$locationChangeStart', function(e, url) {
            for (var langs = $config.languages(), count = langs.length, i = 0; i < count; i++) {
                var pos, language = langs[i];
                if ((pos = url.indexOf('/' + language + '/')) > 0) {
                    url = url.substring(pos + 3);
                    if ($language.id() != language) {
                        $log.debug('Set language: ', language);
                        $language.id(language);
                    }
                    $log.debug('Redirect to: ', url);
                    e.preventDefault();
                    $location.url(url, true);
                    $route.reload();
                    break;
                }
            }
        });
    }]);

    return app;
});
define('bz', ['bz/run'], function (main) { return main; });

}());