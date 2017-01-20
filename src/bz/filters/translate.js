define(['bz/app'], function (app) {

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
                        var tmp = window.bazalt.APP_VERSION.split('.');
                        tmp.pop();
                        $http({
                            url: 'https://translates.davintoo.com/api/rest.php/translates?action=save-with-translate',
                            method: 'PUT',
                            data: {
                                version: tmp.join('.'),
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