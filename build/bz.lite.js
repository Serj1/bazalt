!function(){define("bz/app",["angular","angular-resource","angular-route","angular-cookies","angular-route-segment"],function(a){"use strict";return a.module("bz",["ngResource","ngRoute","ngCookies","ngLocale","route-segment","view-segment"])}),define("bz/factories/bzInterceptorBuffer",["bz/app"],function(a){"use strict";a.factory("bzInterceptorBuffer",["$injector",function(a){function b(b,d){function e(a){d.resolve(a)}function f(a){d.reject(a)}c=c||a.get("$http"),c(b).then(e,f)}var c,d=[];return{append:function(a,b){d.push({config:a,deferred:b})},retryAll:function(a){for(var c=0;c<d.length;++c)b(a(d[c].config),d[c].deferred);d=[]}}}])}),define("bz/interceptors/status403",["angular","bz/app","bz/factories/bzInterceptorBuffer"],function(){"use strict";return["$rootScope","$q","bzInterceptorBuffer",function(a,b,c){function d(a){return a}function e(d){if(403===d.status&&!d.config.ignoreAuthModule){var e=b.defer();return c.append(d.config,e),a.$broadcast("$user:loginRequired"),e.promise}return b.reject(d)}return a.$on("baUserLogin",function(){var a=function(a){return a};c.retryAll(a)}),function(a){return a.then(d,e)}}]}),define("bz/providers/bzConfig",["angular","bz/app"],function(a,b){"use strict";b.provider("bzConfig",[function(){var b={api:"/api/v1",templatePrefix:"",languages:["en"],checkSessionOnStart:!1,errorTemplates:{403:"views/error/403.html",404:"views/error/404.html"}};this.errorResolver=function(){return{template:'<div ng-include="templateUrl"></div>',controller:["$scope","error",function(a,c){a.error=c,a.templateUrl=b.errorTemplates[c.status]}]}},this.api=function(a){return b.api=a,this},this.templatePrefix=function(a){return b.templatePrefix=a,this},this.checkSessionOnStart=function(a){return b.checkSessionOnStart=a,this},this.templateUrl=function(a){return function(){var c=b.templatePrefix+a;return c}},this.languages=function(a){return b.languages=a,this},b=a.isDefined(window.bazalt)?a.extend(b,window.bazalt):b,this.$get=["$log",function(a){a.debug("Configuration:",b);var c=this;return{templatePrefix:function(){return b.templatePrefix},templateUrl:function(a){return c.templateUrl(a)},checkSessionOnStart:function(){return b.checkSessionOnStart},api:function(){return b.api},resource:function(a){return b.api+a},languages:function(){return b.languages}}}]}])}),define("bz/providers/bzLanguage",["angular","bz/app","bz/providers/bzConfig"],function(a,b){"use strict";b.provider("bzLanguage",["$localeProvider",function(b){this.$language=b.$get().id.substring(0,2),this.id=function(a){return this.$language=a,this},this.$get=["$log","$rootScope","bzConfig",function(b,c,d){var e=this;return b.debug("Language: "+e.$language),{id:function(f){if(a.isDefined(f)){var g=e.$language;if(-1==d.languages().indexOf(f))throw new Error('Language "'+f+'" not allowed');c.$emit("$languageChangeStart",f,g),e.$language=f,b.debug("Language: "+f),c.$emit("$languageChangeSuccess",f,g)}return e.$language}}}]}])}),define("bz/factories/bzSessionFactory",["angular","bz/app","bz/providers/bzConfig"],function(a,b){"use strict";b.factory("bzSessionFactory",["$resource","bzConfig","$cookieStore","$q",function(b,c,d,e){var f,g=b(c.resource("/auth/session"),{},{renew:{method:"PUT"},$login:{method:"POST"},$logout:{method:"DELETE"}}),h=e.defer();return g.prototype.$login=function(b,c,d){g.$login(b,function(b){f.$set(b),c=c||a.noop,c(f),h.notify(f)},d)},g.prototype.$logout=function(b,c){this.$$logout(function(){b=b||a.noop,b(f),h.notify(f)},c)},g.prototype.$set=function(b){a.copy(b,this),h.notify(f)},g.prototype.$update=function(b,c){this.$renew(function(c){b=b||a.noop,b(c),h.notify(c)},c)},g.prototype.$change=function(a){return h.promise.then(null,null,a)},g.prototype.has=function(a){var b=this.permissions||[];return b.indexOf(a)>=0},f=new g(d.get("baAuthUser")||{is_guest:!0}),f.$change(function(){d.put("baAuthUser",f)}),f}])}),define("bz/helpers/filter",[],function(){"use strict";Array.prototype.filter||(Array.prototype.filter=function(a){var b=[];a=a||function(){};for(var c=0,d=this.length;d>c;c++)a(this[c])&&b.push(this[c]);return b})}),define("bz/helpers/indexOf",[],function(){"use strict";Array.prototype.indexOf||(Array.prototype.indexOf=function(a,b){null==b?b=0:0>b&&(b=Math.max(0,this.length+b));for(var c=b,d=this.length;d>c;c++)if(this[c]===a)return c;return-1})}),define("bz/helpers/diff",["bz/helpers/filter","bz/helpers/indexOf"],function(){"use strict";Array.prototype.diff||(Array.prototype.diff=function(a){return this.filter(function(b){return!(a.indexOf(b)>-1)})})}),define("bz/providers/bzUser",["angular","bz/app","bz/factories/bzSessionFactory","bz/helpers/diff"],function(a,b){"use strict";b.provider("bzUser",[function(){this.access=function(b){return["$q","bzUser","$log",function(c,d,e){a.isArray(b)||(b=[]);var f=c.defer(),g=b.diff(d.permissions||[]);return g.length?(e.debug("User haven't permissions:",g),f.reject({status:"403",message:"Permission denied",permissions:b,diff:g,user:d})):f.resolve(b),f.promise}]},this.$get=["bzSessionFactory","$cookieStore","$rootScope","bzConfig","$q",function(a,b,c,d){var e=a;return d.checkSessionOnStart()&&a.$update(),e.$change(function(){}),e}]}])}),define("bz/directives/a",["bz/app"],function(a){return a.directive("a",["bzLanguage","$location",function(){return{restrict:"E",compile:function(){return function(a,b,c){c.href&&!angular.isDefined(c.bzLangIgnore)&&a.$on("$languageChangeSuccess",function(a,b,d){var e="/"+d+"/",f=c.href;-1!=f.indexOf(e)&&(f=f.replace(e,"/"+b+"/"),c.$set("href",f))})}}}}]),a}),define("bz/filters/language",["bz/app","bz/providers/bzLanguage"],function(a){"use strict";a.filter("language",["bzLanguage",function(a){return function(b,c){return"undefined"==typeof b||null===b?b:(c=c||a.id(),!b[c]&&b.orig?b[b.orig]+" ("+b.orig+")":b[c]||b)}}])}),define("bz",["bz/app","bz/interceptors/status403","bz/providers/bzLanguage","bz/providers/bzConfig","bz/providers/bzUser","bz/directives/a","bz/filters/language"],function(a,b){return a.config(["$httpProvider",function(a){a.defaults.withCredentials=!0,a.responseInterceptors.push(b)}]),a.run(["$rootScope","bzLanguage","bzConfig","$location","$log","$route","bzUser",function(a,b,c,d,e,f,g){e.debug("Thanks for using Bazalt CMS (http://bazalt-cms.com) by Vitalii Savchuk (esvit666@gmail.com)"),a.$language=b,a.$config=c,a.$user=g,a.$on("$locationChangeStart",function(a,g){for(var h=c.languages(),i=h.length,j=0;i>j;j++){var k,l=h[j];if((k=g.indexOf("/"+l+"/"))>0){g=g.substring(k+3),b.id()!=l&&(e.debug("Set language: ",l),b.id(l)),e.debug("Redirect to: ",g),a.preventDefault(),d.url(g,!0),f.reload();break}}}),g.$change(function(){f.reload()})}]),a})}();
//# sourceMappingURL=bz.lite.map