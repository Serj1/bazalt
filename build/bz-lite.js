!function(){define("bz/app",["angular","angular-resource","angular-route","angular-cookies","angular-route-segment","lz-string"],function(a){"use strict";return a.module("bz",["ngResource","ngRoute","ngCookies","ngLocale","route-segment","view-segment"])}),define("bz/factories/bzStorage",["angular","bz/app","lz-string"],function(a,b,c){"use strict";b.factory("bzStorage",["$cookieStore","$window",function(a,b){var d=function(){try{return b.localStorage.setItem("test","test"),b.localStorage.removeItem("test"),!0}catch(a){return!1}};return{setItem:function(e,f,g){d()?b.localStorage.setItem("ngStorage2-"+e,f):void 0!=g&&"cookie"==g?a.put(e,c.compressToBase64(f)):b["bzStorage"+e]=f},getItem:function(e,f){return d()?b.localStorage.getItem("ngStorage2-"+e)||null:void 0!=f&&"cookie"==f?a.get(e)?c.decompressFromBase64(decodeURIComponent(a.get(e))):null:b["bzStorage"+e]||null}}}])}),define("bz/factories/bzInterceptorBuffer",["bz/app"],function(a){"use strict";a.factory("bzInterceptorBuffer",["$injector",function(a){function b(b,d){function e(a){d.resolve(a)}function f(a){d.reject(a)}c=c||a.get("$http"),c(b).then(e,f)}var c,d=[];return{append:function(a,b){d.push({config:a,deferred:b})},retryAll:function(a){for(var c=0;c<d.length;++c)b(a(d[c].config),d[c].deferred);d=[]}}}])}),define("bz/interceptors/status403",["angular","bz/app","bz/factories/bzInterceptorBuffer"],function(a,b){"use strict";b.factory("status403interceptor",["$rootScope","$q","bzInterceptorBuffer",function(a,b,c){return a.$on("baUserLogin",function(){var a=function(a){return a};c.retryAll(a)}),{response:function(a){return a||b.when(a)},responseError:function(d){if(403===d.status&&!d.config.ignoreAuthModule){var e=b.defer();return c.append(d.config,e),a.$broadcast("$user:loginRequired"),e.promise}return b.reject(d)}}}]),b.config(["$httpProvider",function(a){a.interceptors.push("status403interceptor")}])}),define("bz/interceptors/status324",["angular","bz/app"],function(a,b){"use strict";b.factory("status324interceptor",["$injector","$q","$timeout",function(a,b,c){return{responseError:function(d){return 324===d.status?c(function(){var b=a.get("$http");return b(d.config)},200):b.reject(d)}}}]),b.config(["$httpProvider",function(a){a.interceptors.push("status324interceptor")}])}),define("bz/interceptors/jwtInterceptor",["angular","bz/app"],function(a,b){"use strict";b.factory("jwtInterceptor",["$rootScope","$q","$window","bzStorage",function(b,c,d,e){return{request:function(b){var c=e.getItem("token","cookie");return b.headers=b.headers||{},"undefined"!=c&&a.isDefined(c)&&(b.headers.Authorization="Bearer "+c),b},response:function(a){return 401===a.status,a||c.when(a)},getToken:function(){return e.getItem("token","cookie")},setToken:function(a){e.setItem("token",a,"cookie")}}}]),b.config(["$httpProvider",function(a){a.interceptors.push("jwtInterceptor")}])}),define("bz/providers/bzConfig",["angular","bz/app"],function(a,b){"use strict";b.provider("bzConfig",[function(){var b={api:"/api/v1",templatePrefix:"",languages:["en"],checkSessionOnStart:!1,errorTemplates:{403:"views/error/403.html",404:"views/error/404.html"}};this.errorResolver=function(){return{template:'<div ng-include="templateUrl"></div>',controller:["$scope","error",function(a,c){a.error=c,a.templateUrl=b.errorTemplates[c.status]}]}},this.api=function(a){return b.api=a,this},this.templatePrefix=function(a){return b.templatePrefix=a,this},this.checkSessionOnStart=function(a){return b.checkSessionOnStart=a,this},this.templateUrl=function(a){return function(){var c=b.templatePrefix+a;return c}},this.languages=function(a){return b.languages=a,this},b=a.isDefined(window.bazalt)?a.extend(b,window.bazalt):b,this.$get=["$log",function(a){a.debug("Configuration:",b);var c=this;return{templatePrefix:function(){return b.templatePrefix},templateUrl:function(a){return c.templateUrl(a)},checkSessionOnStart:function(){return b.checkSessionOnStart},api:function(){return b.api},resource:function(a){return b.api+a},languages:function(){return b.languages}}}]}])}),define("bz/providers/bzLanguage",["angular","bz/app","bz/providers/bzConfig"],function(a,b){"use strict";b.provider("bzLanguage",["$localeProvider",function(b){this.$language=b.$get().id.substring(0,2),this.id=function(a){return this.$language=a,this},this.$get=["$log","$rootScope","bzConfig",function(b,c,d){var e=this;return b.debug("Language: "+e.$language),{id:function(f){if(a.isDefined(f)){var g=e.$language;if(-1==d.languages().indexOf(f))throw new Error('Language "'+f+'" not allowed');c.$emit("$languageChangeStart",f,g),e.$language=f,b.debug("Language: "+f),c.$emit("$languageChangeSuccess",f,g)}return e.$language}}}]}])}),define("bz/helpers/filter",[],function(){"use strict";Array.prototype.filter||(Array.prototype.filter=function(a){var b=[];a=a||function(){};for(var c=0,d=this.length;d>c;c++)a(this[c])&&b.push(this[c]);return b})}),define("bz/helpers/indexOf",[],function(){"use strict";Array.prototype.indexOf||(Array.prototype.indexOf=function(a,b){null==b?b=0:0>b&&(b=Math.max(0,this.length+b));for(var c=b,d=this.length;d>c;c++)if(this[c]===a)return c;return-1})}),define("bz/helpers/diff",["bz/helpers/filter","bz/helpers/indexOf"],function(){"use strict";Array.prototype.diff||(Array.prototype.diff=function(a){return this.filter(function(b){return!(a.indexOf(b)>-1)})})}),define("bz/factories/bzSessionFactory",["angular","bz/app","bz/providers/bzConfig","bz/helpers/diff"],function(a,b){"use strict";b.factory("bzSessionFactory",["$resource","bzConfig","$q","$log","jwtInterceptor","bzStorage","$rootScope",function(b,c,d,e,f,g,h){var i,j=b(c.resource("/auth/session"),{},{renew:{method:"PUT"},changeRole:{method:"PUT",params:{action:"changeRole"}},$oauthLogin:{method:"POST",params:{action:"oauth"}},$login:{method:"POST"},$otpCheck:{method:"POST",params:{action:"otp-check"}},$logout:{method:"DELETE"}}),k=d.defer(),l={is_guest:!0,permissions:["guest"]};j.prototype.$otpCheck=function(b,c,d){j.$otpCheck(b,function(b){i.$set(b),(c=c||a.noop)(i)},d)},j.prototype.$oauthLogin=function(b,c,d){j.$oauthLogin(b,function(b){i.$set(b),(c=c||a.noop)(i)},d)},j.prototype.$login=function(b,c,d){j.$login(b,function(b){i.$set(b),(c=c||a.noop)(i)},d)},j.prototype.$logout=function(b,c){j.$logout({},function(c){c=a.copy(l),i.$set(c),(b=b||a.noop)(i)},c)},j.prototype.$set=function(b){var c=a.copy(i);a.copy(b,this),k.notify({user:i,old:c}),h.$emit("$user:sessionChecked")},j.prototype.$update=function(b,c){var d=a.copy(i);this.$renew(function(c){k.notify({user:c,old:d}),h.$emit("$user:sessionChecked"),(b=b||a.noop)(c)},c)},j.prototype.$change=function(a){return k.promise.then(null,null,a)},j.prototype.$changeRole=function(b,c,d){j.changeRole({role_id:b},function(b){i.$set(b),(c=c||a.noop)(i)},d)},j.prototype.has=function(b){var c=this.permissions||[];return a.isArray(b)||(b=[b]),!b.diff(c).length};var m=g.getItem("baAuthUser","cookie");return i=new j(m?a.fromJson(m):a.copy(l)),e.debug("Session in localStorage:",i),i.$change(function(){i.jwt_token&&(e.info("Set JWT token: "+i.jwt_token),f.setToken(i.jwt_token)),g.setItem("baAuthUser",a.toJson(i),"cookie")}),i}])}),define("bz/providers/bzUser",["angular","bz/app","bz/factories/bzSessionFactory","bz/helpers/diff"],function(a,b){"use strict";b.provider("bzUser",[function(){this.access=function(){var a=arguments;return["$q","bzUser","$log","$rootScope",function(b,c,d,e){for(var f=b.defer(),g=!1,h=0,i=[];h<a.length&&(i=a[h].diff(c.permissions||[]),!(g=!i.length));h++);return 0==a.length||g?f.resolve(a):(d.debug("User haven't permissions:",i),e.$emit("$user:pemissionDenied",i),f.reject({status:"403",message:"Permission denied",permissions:a,diff:i,user:c})),f.promise}]},this.$get=["bzSessionFactory","$cookieStore","$rootScope","bzConfig","$q",function(a,b,c,d,e){var f=a;return d.checkSessionOnStart()&&a.$update(),f}]}])}),define("bz/directives/bzLoadingContainer",["bz/app"],function(a){a.directive("bzLoadingContainer",function(){return{restrict:"A",scope:!1,link:function(a,b,c){var d=angular.element(document.createElement("div")).addClass("bz-loading ng-hide");b.addClass("bz-loading-container").append(d),a.$watch(c.bzLoadingContainer,function(a){d.toggleClass("ng-hide",!a)})}}})}),define("bz/filters/translate",["bz/app"],function(a){a.filter("translate",["$rootScope","$http",function(a,b){var c={},d={},e=function(e){var f=a.$localeBundle||{};return void 0!=window.bazalt.trackNotTranslated&&(a.$localeBundle&&void 0==f[e]&&void 0==c[e]&&(c[e]=e,d[e]=setTimeout(function(){b({url:"/api/rest.php/translates?action=save-with-translate",method:"PUT",data:{new_words:e}})},1e4)),a.$localeBundle&&void 0!=f[e]&&void 0!=c[e]&&(delete c[e],clearTimeout(d[e]))),f[e]||e};return e.$stateful=!0,e}])}),define("bz/filters/language",["bz/app","bz/providers/bzLanguage"],function(a){"use strict";a.filter("language",["bzLanguage",function(a){var b=function(b,c){return"undefined"==typeof b||null===b?b:(c=c||a.id(),!b[c]&&b.orig?b[b.orig]:b[c]||null)};return b.$stateful=!0,b}])}),define("bz",["bz/app","bz/factories/bzStorage","bz/interceptors/status403","bz/interceptors/status324","bz/interceptors/jwtInterceptor","bz/providers/bzLanguage","bz/providers/bzConfig","bz/providers/bzUser","bz/directives/bzLoadingContainer","bz/filters/translate","bz/filters/language"],function(a){return a.config(["$httpProvider",function(a){a.defaults.withCredentials=!0}]),a.run(["$rootScope","bzLanguage","bzConfig","$location","$log","$route","bzUser","$routeSegment",function(a,b,c,d,e,f,g,h){a.$language=b,a.$config=c,a.$user=g,g.$change(function(a){var b=a.old,c=a.user;!angular.isDefined(b)||b.id==c.id&&angular.equals(b.permissions,c.permissions)||(e.debug("User changed:",c,"old:",b),h.reload())}),a.$on("$locationChangeStart",function(a,g){for(var h=c.languages(),i=h.length,j=0;i>j;j++){var k,l=h[j];if((k=g.indexOf("/"+l+"/"))>0){g=g.substring(k+3),b.id()!=l&&(e.debug("Set language: ",l),b.id(l)),e.debug("Redirect to: ",g),a.preventDefault(),d.url(g,!0),f.reload();break}}})}]),a}),define("bz",["bz/run"],function(a){return a})}();
//# sourceMappingURL=bz-lite.map