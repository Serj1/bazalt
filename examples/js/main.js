require.config({
    baseUrl: './js',

    packages: [{
        name: 'bz',
        location: '../../build',
        main: 'bz'
    }],

    paths: {
        'angular': '../../bower_components/angular/angular',
        'angular-locale': 'http://code.angularjs.org/1.2.0-rc.3/i18n/angular-locale_uk-ua',

        'angular-resource': '../../bower_components/angular-resource/angular-resource',
        'angular-route': '../../bower_components/angular-route/angular-route',
        'angular-cookies': '../../bower_components/angular-cookies/angular-cookies',
        'ngstorage': '../../bower_components/ngstorage/ngStorage.min',
        'lz-string': '../../bower_components/lz-string/libs/lz-string.min',
        'angular-route-segment': '../../bower_components/angular-route-segment/build/angular-route-segment'
    },

    shim: {
        'angular': { exports: 'angular' },
        'angular-locale': { deps: ['angular'] },
        'angular-resource': {deps: ['angular']},
        'angular-route': {deps: ['angular']},
        'angular-cookies': {deps: ['angular']},
        'ngstorage': {deps: ['angular']},
        'lz-string': {deps: ['angular']}
    }
});
require(['app']);