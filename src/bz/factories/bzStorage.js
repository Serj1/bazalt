define([
    'angular', 'bz/app',
    'lz-string'
], function (angular, app, LZString) {
    'use strict';

    app.factory('bzStorage', ['$cookieStore', '$localStorage',
        function ($cookieStore, $localStorage) {
            var localStorageSupported = function () {
                try {
                    localStorage.setItem("test", "test");
                    localStorage.removeItem("test");
                    return true;
                } catch(e){
                    return false;
                }
            }

            return {
                setItem: function (key, value) {
                    if (localStorageSupported()) {
                        $localStorage[key] = value;
                    } else {
                        $cookieStore.put(key, LZString.compressToEncodedURIComponent(JSON.stringify(value)));
                    }
                },
                getItem: function (key) {
                    if (localStorageSupported()) {
                        return $localStorage[key] || null;
                    } else {
                        return $cookieStore.get(key) ? JSON.parse(LZString.decompressFromEncodedURIComponent($cookieStore.get(key))) : null;
                    }
                }
            };
        }]);

});
