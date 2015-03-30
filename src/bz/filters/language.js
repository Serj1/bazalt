define([
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