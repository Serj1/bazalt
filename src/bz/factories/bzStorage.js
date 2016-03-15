define([
    'angular', 'bz/app',
    'lz-string'
], function (angular, app, LZString) {
    'use strict';

    app.factory('bzStorage', ['$cookieStore', '$window',
        function ($cookieStore, $window) {
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
                        $window.localStorage.setItem('ngStorage2-' + key, value);
                    } else if (fallbackType != undefined && fallbackType == 'cookie') {
                        $cookieStore.put(key, LZString.compressToBase64(value));
                    } else {
                        $window['bzStorage' + key] = value;
                    }
                },
                getItem: function (key, fallbackType) {
                    if (localStorageSupported()) {
                        return $window.localStorage.getItem('ngStorage2-' + key) || null;
                    } else if (fallbackType != undefined && fallbackType == 'cookie') {
                        return $cookieStore.get(key) ? LZString.decompressFromBase64(decodeURIComponent($cookieStore.get(key))) : null;
                    } else {
                        return $window['bzStorage' + key] || null;
                    }
                }
            };
        }]);

});
