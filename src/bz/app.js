define([
    'angular',

    'angular-resource', 'angular-route', 'angular-cookies',

    'angular-route-segment', 'ngstorage'
], function(angular) {
    'use strict';

    return angular.module('bz', [
        'ngResource', 'ngRoute', 'ngCookies', 'ngLocale',

        'route-segment', 'view-segment', 'ngStorage'
    ]);
});
