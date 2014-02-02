!function(){define("bz/app",["angular","angular-resource","angular-route","angular-cookies","angular-route-segment"],function(a){"use strict";return a.module("bz",["ngResource","ngRoute","ngCookies","ngLocale","route-segment","view-segment"])}),define("bz/factories/bzInterceptorBuffer",["bz/app"],function(a){"use strict";a.factory("bzInterceptorBuffer",["$injector",function(a){function b(b,d){function e(a){d.resolve(a)}function f(a){d.reject(a)}c=c||a.get("$http"),c(b).then(e,f)}var c,d=[];return{append:function(a,b){d.push({config:a,deferred:b})},retryAll:function(a){for(var c=0;c<d.length;++c)b(a(d[c].config),d[c].deferred);d=[]}}}])}),define("bz/interceptors/status403",["angular","bz/app","bz/factories/bzInterceptorBuffer"],function(){"use strict";return["$rootScope","$q","bzInterceptorBuffer",function(a,b,c){function d(a){return a}function e(d){if(403===d.status&&!d.config.ignoreAuthModule){var e=b.defer();return c.append(d.config,e),a.$broadcast("$user:loginRequired"),e.promise}return b.reject(d)}return a.$on("baUserLogin",function(){var a=function(a){return a};c.retryAll(a)}),function(a){return a.then(d,e)}}]}),define("bz/interceptors/jwtInterceptor",["angular","bz/app"],function(a,b){"use strict";b.factory("jwtInterceptor",["$rootScope","$q","$window","$cookieStore",function(b,c,d,e){var f=d.sessionStorage?function(a,b){d.sessionStorage[a]=b}:function(a,b){e.put(a,b)},g=d.sessionStorage?function(a){return d.sessionStorage[a]||null}:function(a){return e.get(a)};return{request:function(b){var c=g("token");return b.headers=b.headers||{},"undefined"!=c&&a.isDefined(c)&&(b.headers.Authorization="Bearer "+c),b},response:function(a){return 401===a.status,a||c.when(a)},setToken:function(a){f("token",a)}}}]),b.config(["$httpProvider",function(a){a.interceptors.push("jwtInterceptor")}])}),define("bz/providers/bzConfig",["angular","bz/app"],function(a,b){"use strict";b.provider("bzConfig",[function(){var b={api:"/api/v1",templatePrefix:"",languages:["en"],checkSessionOnStart:!1,errorTemplates:{403:"views/error/403.html",404:"views/error/404.html"}};this.errorResolver=function(){return{template:'<div ng-include="templateUrl"></div>',controller:["$scope","error",function(a,c){a.error=c,a.templateUrl=b.errorTemplates[c.status]}]}},this.api=function(a){return b.api=a,this},this.templatePrefix=function(a){return b.templatePrefix=a,this},this.checkSessionOnStart=function(a){return b.checkSessionOnStart=a,this},this.templateUrl=function(a){return function(){var c=b.templatePrefix+a;return c}},this.languages=function(a){return b.languages=a,this},b=a.isDefined(window.bazalt)?a.extend(b,window.bazalt):b,this.$get=["$log",function(a){a.debug("Configuration:",b);var c=this;return{templatePrefix:function(){return b.templatePrefix},templateUrl:function(a){return c.templateUrl(a)},checkSessionOnStart:function(){return b.checkSessionOnStart},api:function(){return b.api},resource:function(a){return b.api+a},languages:function(){return b.languages}}}]}])}),define("bz/providers/bzLanguage",["angular","bz/app","bz/providers/bzConfig"],function(a,b){"use strict";b.provider("bzLanguage",["$localeProvider",function(b){this.$language=b.$get().id.substring(0,2),this.id=function(a){return this.$language=a,this},this.$get=["$log","$rootScope","bzConfig",function(b,c,d){var e=this;return b.debug("Language: "+e.$language),{id:function(f){if(a.isDefined(f)){var g=e.$language;if(-1==d.languages().indexOf(f))throw new Error('Language "'+f+'" not allowed');c.$emit("$languageChangeStart",f,g),e.$language=f,b.debug("Language: "+f),c.$emit("$languageChangeSuccess",f,g)}return e.$language}}}]}])}),define("bz/factories/bzSessionFactory",["angular","bz/app","bz/providers/bzConfig"],function(a,b){"use strict";b.factory("bzSessionFactory",["$resource","bzConfig","$cookieStore","$q","$log","jwtInterceptor",function(b,c,d,e,f,g){var h,i=b(c.resource("/auth/session"),{},{renew:{method:"PUT"},changeRole:{method:"PUT",params:{action:"changeRole"}},$login:{method:"POST"},$logout:{method:"DELETE"}}),j=e.defer(),k={is_guest:!0,permissions:["guest"]};return i.prototype.$login=function(b,c,d){i.$login(b,function(b){h.$set(b),c=c||a.noop,c(h)},d)},i.prototype.$logout=function(b,c){i.$logout({},function(c){c=a.copy(k),h.$set(c),g.setToken(void 0),b=b||a.noop,b(h)},c)},i.prototype.$set=function(b){var c=a.copy(h);a.copy(b,this),j.notify({user:h,old:c})},i.prototype.$update=function(b,c){var d=a.copy(h);this.$renew(function(c){j.notify({user:c,old:d}),b=b||a.noop,b(c)},c)},i.prototype.$change=function(a){return j.promise.then(null,null,a)},i.prototype.$changeRole=function(b,c,d){i.changeRole({role_id:b},function(b){h.$set(b),c=c||a.noop,c(h)},d)},i.prototype.has=function(b){var c=this.permissions||[];return a.isArray(b)||(b=[b]),!b.diff(c).length},f.debug("Session in cookie:",d.get("baAuthUser")),h=new i(d.get("baAuthUser")||a.copy(k)),h.$change(function(){h.jwt_token&&(f.info("Set JWT token: "+h.jwt_token),g.setToken(h.jwt_token)),f.debug("Set session cookie:",h),d.put("baAuthUser",h)}),h}])}),define("bz/helpers/filter",[],function(){"use strict";Array.prototype.filter||(Array.prototype.filter=function(a){var b=[];a=a||function(){};for(var c=0,d=this.length;d>c;c++)a(this[c])&&b.push(this[c]);return b})}),define("bz/helpers/indexOf",[],function(){"use strict";Array.prototype.indexOf||(Array.prototype.indexOf=function(a,b){null==b?b=0:0>b&&(b=Math.max(0,this.length+b));for(var c=b,d=this.length;d>c;c++)if(this[c]===a)return c;return-1})}),define("bz/helpers/diff",["bz/helpers/filter","bz/helpers/indexOf"],function(){"use strict";Array.prototype.diff||(Array.prototype.diff=function(a){return this.filter(function(b){return!(a.indexOf(b)>-1)})})}),define("bz/providers/bzUser",["angular","bz/app","bz/factories/bzSessionFactory","bz/helpers/diff"],function(a,b){"use strict";b.provider("bzUser",[function(){this.access=function(b){return["$q","bzUser","$log","$rootScope",function(c,d,e,f){a.isArray(b)||(b=[]);var g=c.defer(),h=b.diff(d.permissions||[]);return h.length?(e.debug("User haven't permissions:",h),f.$emit("$user:pemissionDenied",h),g.reject({status:"403",message:"Permission denied",permissions:b,diff:h,user:d})):g.resolve(b),g.promise}]},this.$get=["bzSessionFactory","$cookieStore","$rootScope","bzConfig","$q",function(a,b,c,d){var e=a;return d.checkSessionOnStart()&&a.$update(),e}]}])}),define("bz/directives/a",["bz/app"],function(a){return a.directive("a",["bzLanguage","$location",function(){return{restrict:"E",compile:function(){return function(a,b,c){c.href&&!angular.isDefined(c.bzLangIgnore)&&a.$on("$languageChangeSuccess",function(a,b,d){var e="/"+d+"/",f=c.href;-1!=f.indexOf(e)&&(f=f.replace(e,"/"+b+"/"),c.$set("href",f))})}}}}]),a}),define("bz/directives/bzLoadingContainer",["bz/app"],function(a){a.directive("bzLoadingContainer",function(){return{restrict:"A",scope:!1,link:function(a,b,c){var d=angular.element(document.createElement("div")).addClass("bz-loading ng-hide");b.addClass("bz-loading-container").append(d),a.$watch(c.bzLoadingContainer,function(a){d.toggleClass("ng-hide",!a)})}}})}),define("bz/directives/bzThumb",["bz/app"],function(a){return a.value("presetMediaQueries",{"default":"only screen and (min-width: 1px)",small:"only screen and (min-width: 768px)",medium:"only screen and (min-width: 1280px)",large:"only screen and (min-width: 1440px)",landscape:"only screen and (orientation: landscape)",portrait:"only screen and (orientation: portrait)",retina:"only screen and (-webkit-min-device-pixel-ratio: 2), only screen and (min--moz-device-pixel-ratio: 2), only screen and (-o-min-device-pixel-ratio: 2/1), only screen and (min-device-pixel-ratio: 2), only screen and (min-resolution: 192dpi), only screen and (min-resolution: 2dppx)"}),a.directive("bzThumb",["presetMediaQueries","$timeout","$parse",function(a,b,c){return{restrict:"A",priority:100,scope:{ngSrc:"=image",thumbnails:"=bzThumb",presets:"@"},link:function(d,e){function f(c){j||(b(function(){angular.forEach(i,function(a){a.mql.removeListener(a.listener)}),i=[];var b;angular.forEach(c,function(d,e){if(c.hasOwnProperty(e)){a.hasOwnProperty(e)&&(e=a[e]);var g=matchMedia(e);g.matches&&(b=d);var h=function(){f(c)};g.addListener(h),i.push({mql:g,listener:h})}}),b&&g.hasOwnProperty(b)&&console.info(g[b]),e.attr("src",b||d.image),j=!1},0),j=!0)}var g;if("function"!=typeof matchMedia)throw"Function 'matchMedia' does not exist";var h,i=[],j=!1;d.$watch("thumbnails",function(a){if(!angular.isObject(a))throw"Expected evaluate bz-thumb to evaluate to an object, instead got: "+a;f(a),angular.isFunction(h)&&h()}),d.$watch("presets",function(a){g=c(a)(d)})}}}]),a}),define("bz/filters/translate",["bz/app"],function(a){a.filter("translate",["$rootScope",function(a){return function(b){a.$localeBundle||{};return b}}])}),define("bz/filters/language",["bz/app","bz/providers/bzLanguage"],function(a){"use strict";a.filter("language",["bzLanguage",function(a){return function(b,c){return"undefined"==typeof b||null===b?b:(c=c||a.id(),!b[c]&&b.orig?b[b.orig]+" ("+b.orig+")":b[c]||b)}}])}),define("bz",["bz/app","bz/interceptors/status403","bz/interceptors/jwtInterceptor","bz/providers/bzLanguage","bz/providers/bzConfig","bz/providers/bzUser","bz/directives/a","bz/directives/bzLoadingContainer","bz/directives/bzThumb","bz/filters/translate","bz/filters/language"],function(a,b){return a.config(["$httpProvider",function(a){a.defaults.withCredentials=!0,a.responseInterceptors.push(b)}]),a.run(["$rootScope","bzLanguage","bzConfig","$location","$log","$route","bzUser","$routeSegment",function(a,b,c,d,e,f,g,h){e.debug("Thanks for using Bazalt CMS (http://bazalt-cms.com) by Vitalii Savchuk (esvit666@gmail.com)"),a.$language=b,a.$config=c,a.$user=g,g.$change(function(a){var b=a.old,c=a.user;!angular.isDefined(b)||b.id==c.id&&angular.equals(b.permissions,c.permissions)||(e.debug("User changed:",c,"old:",b),h.reload())}),a.$on("$locationChangeStart",function(a,g){for(var h=c.languages(),i=h.length,j=0;i>j;j++){var k,l=h[j];if((k=g.indexOf("/"+l+"/"))>0){g=g.substring(k+3),b.id()!=l&&(e.debug("Set language: ",l),b.id(l)),e.debug("Redirect to: ",g),a.preventDefault(),d.url(g,!0),f.reload();break}}})}]),a})}();
//# sourceMappingURL=bz-lite.map