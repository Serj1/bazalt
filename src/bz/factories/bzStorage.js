define([
    'angular', 'bz/app',
    'lz-string'
], function (angular, app, LZString) {
    'use strict';

    app.factory('bzStorage', ['$cookieStore', '$localStorage', '$window',
        function ($cookieStore, $localStorage, $window) {
            var localStorageSupported = function () {
                try {
                    $window.localStorage.setItem("test", "test");
                    $window.localStorage.removeItem("test");
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
