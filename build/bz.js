var requirejs, require, define;
!function (global) {
    function isFunction(a) {
        return"[object Function]" === ostring.call(a)
    }

    function isArray(a) {
        return"[object Array]" === ostring.call(a)
    }

    function each(a, b) {
        if (a) {
            var c;
            for (c = 0; c < a.length && (!a[c] || !b(a[c], c, a)); c += 1);
        }
    }

    function eachReverse(a, b) {
        if (a) {
            var c;
            for (c = a.length - 1; c > -1 && (!a[c] || !b(a[c], c, a)); c -= 1);
        }
    }

    function hasProp(a, b) {
        return hasOwn.call(a, b)
    }

    function getOwn(a, b) {
        return hasProp(a, b) && a[b]
    }

    function eachProp(a, b) {
        var c;
        for (c in a)if (hasProp(a, c) && b(a[c], c))break
    }

    function mixin(a, b, c, d) {
        return b && eachProp(b, function (b, e) {
            (c || !hasProp(a, e)) && (!d || "object" != typeof b || !b || isArray(b) || isFunction(b) || b instanceof RegExp ? a[e] = b : (a[e] || (a[e] = {}), mixin(a[e], b, c, d)))
        }), a
    }

    function bind(a, b) {
        return function () {
            return b.apply(a, arguments)
        }
    }

    function scripts() {
        return document.getElementsByTagName("script")
    }

    function defaultOnError(a) {
        throw a
    }

    function getGlobal(a) {
        if (!a)return a;
        var b = global;
        return each(a.split("."), function (a) {
            b = b[a]
        }), b
    }

    function makeError(a, b, c, d) {
        var e = new Error(b + "\nhttp://requirejs.org/docs/errors.html#" + a);
        return e.requireType = a, e.requireModules = d, c && (e.originalError = c), e
    }

    function newContext(a) {
        function b(a) {
            var b, c;
            for (b = 0; b < a.length; b++)if (c = a[b], "." === c)a.splice(b, 1), b -= 1; else if (".." === c) {
                if (0 === b || 1 == b && ".." === a[2] || ".." === a[b - 1])continue;
                b > 0 && (a.splice(b - 1, 2), b -= 2)
            }
        }

        function c(a, c, d) {
            var e, f, g, h, i, j, k, l, m, n, o, p, q = c && c.split("/"), r = x.map, s = r && r["*"];
            if (a && (a = a.split("/"), k = a.length - 1, x.nodeIdCompat && jsSuffixRegExp.test(a[k]) && (a[k] = a[k].replace(jsSuffixRegExp, "")), "." === a[0].charAt(0) && q && (p = q.slice(0, q.length - 1), a = p.concat(a)), b(a), a = a.join("/")), d && r && (q || s)) {
                g = a.split("/");
                a:for (h = g.length; h > 0; h -= 1) {
                    if (j = g.slice(0, h).join("/"), q)for (i = q.length; i > 0; i -= 1)if (f = getOwn(r, q.slice(0, i).join("/")), f && (f = getOwn(f, j))) {
                        l = f, m = h;
                        break a
                    }
                    !n && s && getOwn(s, j) && (n = getOwn(s, j), o = h)
                }
                !l && n && (l = n, m = o), l && (g.splice(0, m, l), a = g.join("/"))
            }
            return e = getOwn(x.pkgs, a), e ? e : a
        }

        function d(a) {
            isBrowser && each(scripts(), function (b) {
                return b.getAttribute("data-requiremodule") === a && b.getAttribute("data-requirecontext") === u.contextName ? (b.parentNode.removeChild(b), !0) : void 0
            })
        }

        function e(a) {
            var b = getOwn(x.paths, a);
            return b && isArray(b) && b.length > 1 ? (b.shift(), u.require.undef(a), u.makeRequire(null, {skipMap: !0})([a]), !0) : void 0
        }

        function f(a) {
            var b, c = a ? a.indexOf("!") : -1;
            return c > -1 && (b = a.substring(0, c), a = a.substring(c + 1, a.length)), [b, a]
        }

        function g(a, b, d, e) {
            var g, h, i, j, k = null, l = b ? b.name : null, m = a, n = !0, o = "";
            return a || (n = !1, a = "_@r" + (F += 1)), j = f(a), k = j[0], a = j[1], k && (k = c(k, l, e), h = getOwn(C, k)), a && (k ? o = h && h.normalize ? h.normalize(a, function (a) {
                return c(a, l, e)
            }) : -1 === a.indexOf("!") ? c(a, l, e) : a : (o = c(a, l, e), j = f(o), k = j[0], o = j[1], d = !0, g = u.nameToUrl(o))), i = !k || h || d ? "" : "_unnormalized" + (G += 1), {prefix: k, name: o, parentMap: b, unnormalized: !!i, url: g, originalName: m, isDefine: n, id: (k ? k + "!" + o : o) + i}
        }

        function h(a) {
            var b = a.id, c = getOwn(y, b);
            return c || (c = y[b] = new u.Module(a)), c
        }

        function i(a, b, c) {
            var d = a.id, e = getOwn(y, d);
            !hasProp(C, d) || e && !e.defineEmitComplete ? (e = h(a), e.error && "error" === b ? c(e.error) : e.on(b, c)) : "defined" === b && c(C[d])
        }

        function j(a, b) {
            var c = a.requireModules, d = !1;
            b ? b(a) : (each(c, function (b) {
                var c = getOwn(y, b);
                c && (c.error = a, c.events.error && (d = !0, c.emit("error", a)))
            }), d || req.onError(a))
        }

        function k() {
            globalDefQueue.length && (apsp.apply(B, [B.length, 0].concat(globalDefQueue)), globalDefQueue = [])
        }

        function l(a) {
            delete y[a], delete z[a]
        }

        function m(a, b, c) {
            var d = a.map.id;
            a.error ? a.emit("error", a.error) : (b[d] = !0, each(a.depMaps, function (d, e) {
                var f = d.id, g = getOwn(y, f);
                !g || a.depMatched[e] || c[f] || (getOwn(b, f) ? (a.defineDep(e, C[f]), a.check()) : m(g, b, c))
            }), c[d] = !0)
        }

        function n() {
            var a, b, c = 1e3 * x.waitSeconds, f = c && u.startTime + c < (new Date).getTime(), g = [], h = [], i = !1, k = !0;
            if (!s) {
                if (s = !0, eachProp(z, function (a) {
                    var c = a.map, j = c.id;
                    if (a.enabled && (c.isDefine || h.push(a), !a.error))if (!a.inited && f)e(j) ? (b = !0, i = !0) : (g.push(j), d(j)); else if (!a.inited && a.fetched && c.isDefine && (i = !0, !c.prefix))return k = !1
                }), f && g.length)return a = makeError("timeout", "Load timeout for modules: " + g, null, g), a.contextName = u.contextName, j(a);
                k && each(h, function (a) {
                    m(a, {}, {})
                }), f && !b || !i || !isBrowser && !isWebWorker || w || (w = setTimeout(function () {
                    w = 0, n()
                }, 50)), s = !1
            }
        }

        function o(a) {
            hasProp(C, a[0]) || h(g(a[0], null, !0)).init(a[1], a[2])
        }

        function p(a, b, c, d) {
            a.detachEvent && !isOpera ? d && a.detachEvent(d, b) : a.removeEventListener(c, b, !1)
        }

        function q(a) {
            var b = a.currentTarget || a.srcElement;
            return p(b, u.onScriptLoad, "load", "onreadystatechange"), p(b, u.onScriptError, "error"), {node: b, id: b && b.getAttribute("data-requiremodule")}
        }

        function r() {
            var a;
            for (k(); B.length;) {
                if (a = B.shift(), null === a[0])return j(makeError("mismatch", "Mismatched anonymous define() module: " + a[a.length - 1]));
                o(a)
            }
        }

        var s, t, u, v, w, x = {waitSeconds: 7, baseUrl: "./", paths: {}, bundles: {}, pkgs: {}, shim: {}, config: {}}, y = {}, z = {}, A = {}, B = [], C = {}, D = {}, E = {}, F = 1, G = 1;
        return v = {require: function (a) {
            return a.require ? a.require : a.require = u.makeRequire(a.map)
        }, exports: function (a) {
            return a.usingExports = !0, a.map.isDefine ? a.exports ? C[a.map.id] = a.exports : a.exports = C[a.map.id] = {} : void 0
        }, module: function (a) {
            return a.module ? a.module : a.module = {id: a.map.id, uri: a.map.url, config: function () {
                return getOwn(x.config, a.map.id) || {}
            }, exports: a.exports || (a.exports = {})}
        }}, t = function (a) {
            this.events = getOwn(A, a.id) || {}, this.map = a, this.shim = getOwn(x.shim, a.id), this.depExports = [], this.depMaps = [], this.depMatched = [], this.pluginMaps = {}, this.depCount = 0
        }, t.prototype = {init: function (a, b, c, d) {
            d = d || {}, this.inited || (this.factory = b, c ? this.on("error", c) : this.events.error && (c = bind(this, function (a) {
                this.emit("error", a)
            })), this.depMaps = a && a.slice(0), this.errback = c, this.inited = !0, this.ignore = d.ignore, d.enabled || this.enabled ? this.enable() : this.check())
        }, defineDep: function (a, b) {
            this.depMatched[a] || (this.depMatched[a] = !0, this.depCount -= 1, this.depExports[a] = b)
        }, fetch: function () {
            if (!this.fetched) {
                this.fetched = !0, u.startTime = (new Date).getTime();
                var a = this.map;
                return this.shim ? void u.makeRequire(this.map, {enableBuildCallback: !0})(this.shim.deps || [], bind(this, function () {
                    return a.prefix ? this.callPlugin() : this.load()
                })) : a.prefix ? this.callPlugin() : this.load()
            }
        }, load: function () {
            var a = this.map.url;
            D[a] || (D[a] = !0, u.load(this.map.id, a))
        }, check: function () {
            if (this.enabled && !this.enabling) {
                var a, b, c = this.map.id, d = this.depExports, e = this.exports, f = this.factory;
                if (this.inited) {
                    if (this.error)this.emit("error", this.error); else if (!this.defining) {
                        if (this.defining = !0, this.depCount < 1 && !this.defined) {
                            if (isFunction(f)) {
                                if (this.events.error && this.map.isDefine || req.onError !== defaultOnError)try {
                                    e = u.execCb(c, f, d, e)
                                } catch (g) {
                                    a = g
                                } else e = u.execCb(c, f, d, e);
                                if (this.map.isDefine && void 0 === e && (b = this.module, b ? e = b.exports : this.usingExports && (e = this.exports)), a)return a.requireMap = this.map, a.requireModules = this.map.isDefine ? [this.map.id] : null, a.requireType = this.map.isDefine ? "define" : "require", j(this.error = a)
                            } else e = f;
                            this.exports = e, this.map.isDefine && !this.ignore && (C[c] = e, req.onResourceLoad && req.onResourceLoad(u, this.map, this.depMaps)), l(c), this.defined = !0
                        }
                        this.defining = !1, this.defined && !this.defineEmitted && (this.defineEmitted = !0, this.emit("defined", this.exports), this.defineEmitComplete = !0)
                    }
                } else this.fetch()
            }
        }, callPlugin: function () {
            var a = this.map, b = a.id, d = g(a.prefix);
            this.depMaps.push(d), i(d, "defined", bind(this, function (d) {
                var e, f, k, m = getOwn(E, this.map.id), n = this.map.name, o = this.map.parentMap ? this.map.parentMap.name : null, p = u.makeRequire(a.parentMap, {enableBuildCallback: !0});
                return this.map.unnormalized ? (d.normalize && (n = d.normalize(n, function (a) {
                    return c(a, o, !0)
                }) || ""), f = g(a.prefix + "!" + n, this.map.parentMap), i(f, "defined", bind(this, function (a) {
                    this.init([], function () {
                        return a
                    }, null, {enabled: !0, ignore: !0})
                })), k = getOwn(y, f.id), void(k && (this.depMaps.push(f), this.events.error && k.on("error", bind(this, function (a) {
                    this.emit("error", a)
                })), k.enable()))) : m ? (this.map.url = u.nameToUrl(m), void this.load()) : (e = bind(this, function (a) {
                    this.init([], function () {
                        return a
                    }, null, {enabled: !0})
                }), e.error = bind(this, function (a) {
                    this.inited = !0, this.error = a, a.requireModules = [b], eachProp(y, function (a) {
                        0 === a.map.id.indexOf(b + "_unnormalized") && l(a.map.id)
                    }), j(a)
                }), e.fromText = bind(this, function (c, d) {
                    var f = a.name, i = g(f), k = useInteractive;
                    d && (c = d), k && (useInteractive = !1), h(i), hasProp(x.config, b) && (x.config[f] = x.config[b]);
                    try {
                        req.exec(c)
                    } catch (l) {
                        return j(makeError("fromtexteval", "fromText eval for " + b + " failed: " + l, l, [b]))
                    }
                    k && (useInteractive = !0), this.depMaps.push(i), u.completeLoad(f), p([f], e)
                }), void d.load(a.name, p, e, x))
            })), u.enable(d, this), this.pluginMaps[d.id] = d
        }, enable: function () {
            z[this.map.id] = this, this.enabled = !0, this.enabling = !0, each(this.depMaps, bind(this, function (a, b) {
                var c, d, e;
                if ("string" == typeof a) {
                    if (a = g(a, this.map.isDefine ? this.map : this.map.parentMap, !1, !this.skipMap), this.depMaps[b] = a, e = getOwn(v, a.id))return void(this.depExports[b] = e(this));
                    this.depCount += 1, i(a, "defined", bind(this, function (a) {
                        this.defineDep(b, a), this.check()
                    })), this.errback && i(a, "error", bind(this, this.errback))
                }
                c = a.id, d = y[c], hasProp(v, c) || !d || d.enabled || u.enable(a, this)
            })), eachProp(this.pluginMaps, bind(this, function (a) {
                var b = getOwn(y, a.id);
                b && !b.enabled && u.enable(a, this)
            })), this.enabling = !1, this.check()
        }, on: function (a, b) {
            var c = this.events[a];
            c || (c = this.events[a] = []), c.push(b)
        }, emit: function (a, b) {
            each(this.events[a], function (a) {
                a(b)
            }), "error" === a && delete this.events[a]
        }}, u = {config: x, contextName: a, registry: y, defined: C, urlFetched: D, defQueue: B, Module: t, makeModuleMap: g, nextTick: req.nextTick, onError: j, configure: function (a) {
            a.baseUrl && "/" !== a.baseUrl.charAt(a.baseUrl.length - 1) && (a.baseUrl += "/");
            var b = x.shim, c = {paths: !0, bundles: !0, config: !0, map: !0};
            eachProp(a, function (a, b) {
                c[b] ? (x[b] || (x[b] = {}), mixin(x[b], a, !0, !0)) : x[b] = a
            }), a.bundles && eachProp(a.bundles, function (a, b) {
                each(a, function (a) {
                    a !== b && (E[a] = b)
                })
            }), a.shim && (eachProp(a.shim, function (a, c) {
                isArray(a) && (a = {deps: a}), !a.exports && !a.init || a.exportsFn || (a.exportsFn = u.makeShimExports(a)), b[c] = a
            }), x.shim = b), a.packages && each(a.packages, function (a) {
                var b, c;
                a = "string" == typeof a ? {name: a} : a, c = a.name, b = a.location, b && (x.paths[c] = a.location), x.pkgs[c] = a.name + "/" + (a.main || "main").replace(currDirRegExp, "").replace(jsSuffixRegExp, "")
            }), eachProp(y, function (a, b) {
                a.inited || a.map.unnormalized || (a.map = g(b))
            }), (a.deps || a.callback) && u.require(a.deps || [], a.callback)
        }, makeShimExports: function (a) {
            function b() {
                var b;
                return a.init && (b = a.init.apply(global, arguments)), b || a.exports && getGlobal(a.exports)
            }

            return b
        }, makeRequire: function (b, e) {
            function f(c, d, i) {
                var k, l, m;
                return e.enableBuildCallback && d && isFunction(d) && (d.__requireJsBuild = !0), "string" == typeof c ? isFunction(d) ? j(makeError("requireargs", "Invalid require call"), i) : b && hasProp(v, c) ? v[c](y[b.id]) : req.get ? req.get(u, c, b, f) : (l = g(c, b, !1, !0), k = l.id, hasProp(C, k) ? C[k] : j(makeError("notloaded", 'Module name "' + k + '" has not been loaded yet for context: ' + a + (b ? "" : ". Use require([])")))) : (r(), u.nextTick(function () {
                    r(), m = h(g(null, b)), m.skipMap = e.skipMap, m.init(c, d, i, {enabled: !0}), n()
                }), f)
            }

            return e = e || {}, mixin(f, {isBrowser: isBrowser, toUrl: function (a) {
                var d, e = a.lastIndexOf("."), f = a.split("/")[0], g = "." === f || ".." === f;
                return-1 !== e && (!g || e > 1) && (d = a.substring(e, a.length), a = a.substring(0, e)), u.nameToUrl(c(a, b && b.id, !0), d, !0)
            }, defined: function (a) {
                return hasProp(C, g(a, b, !1, !0).id)
            }, specified: function (a) {
                return a = g(a, b, !1, !0).id, hasProp(C, a) || hasProp(y, a)
            }}), b || (f.undef = function (a) {
                k();
                var c = g(a, b, !0), e = getOwn(y, a);
                d(a), delete C[a], delete D[c.url], delete A[a], eachReverse(B, function (b, c) {
                    b[0] === a && B.splice(c, 1)
                }), e && (e.events.defined && (A[a] = e.events), l(a))
            }), f
        }, enable: function (a) {
            var b = getOwn(y, a.id);
            b && h(a).enable()
        }, completeLoad: function (a) {
            var b, c, d, f = getOwn(x.shim, a) || {}, g = f.exports;
            for (k(); B.length;) {
                if (c = B.shift(), null === c[0]) {
                    if (c[0] = a, b)break;
                    b = !0
                } else c[0] === a && (b = !0);
                o(c)
            }
            if (d = getOwn(y, a), !b && !hasProp(C, a) && d && !d.inited) {
                if (!(!x.enforceDefine || g && getGlobal(g)))return e(a) ? void 0 : j(makeError("nodefine", "No define call for " + a, null, [a]));
                o([a, f.deps || [], f.exportsFn])
            }
            n()
        }, nameToUrl: function (a, b, c) {
            var d, e, f, g, h, i, j, k = getOwn(x.pkgs, a);
            if (k && (a = k), j = getOwn(E, a))return u.nameToUrl(j, b, c);
            if (req.jsExtRegExp.test(a))h = a + (b || ""); else {
                for (d = x.paths, e = a.split("/"), f = e.length; f > 0; f -= 1)if (g = e.slice(0, f).join("/"), i = getOwn(d, g)) {
                    isArray(i) && (i = i[0]), e.splice(0, f, i);
                    break
                }
                h = e.join("/"), h += b || (/^data\:|\?/.test(h) || c ? "" : ".js"), h = ("/" === h.charAt(0) || h.match(/^[\w\+\.\-]+:/) ? "" : x.baseUrl) + h
            }
            return x.urlArgs ? h + ((-1 === h.indexOf("?") ? "?" : "&") + x.urlArgs) : h
        }, load: function (a, b) {
            req.load(u, a, b)
        }, execCb: function (a, b, c, d) {
            return b.apply(d, c)
        }, onScriptLoad: function (a) {
            if ("load" === a.type || readyRegExp.test((a.currentTarget || a.srcElement).readyState)) {
                interactiveScript = null;
                var b = q(a);
                u.completeLoad(b.id)
            }
        }, onScriptError: function (a) {
            var b = q(a);
            return e(b.id) ? void 0 : j(makeError("scripterror", "Script error for: " + b.id, a, [b.id]))
        }}, u.require = u.makeRequire(), u
    }

    function getInteractiveScript() {
        return interactiveScript && "interactive" === interactiveScript.readyState ? interactiveScript : (eachReverse(scripts(), function (a) {
            return"interactive" === a.readyState ? interactiveScript = a : void 0
        }), interactiveScript)
    }

    var req, s, head, baseElement, dataMain, src, interactiveScript, currentlyAddingScript, mainScript, subPath, version = "2.1.14", commentRegExp = /(\/\*([\s\S]*?)\*\/|([^:]|^)\/\/(.*)$)/gm, cjsRequireRegExp = /[^.]\s*require\s*\(\s*["']([^'"\s]+)["']\s*\)/g, jsSuffixRegExp = /\.js$/, currDirRegExp = /^\.\//, op = Object.prototype, ostring = op.toString, hasOwn = op.hasOwnProperty, ap = Array.prototype, apsp = ap.splice, isBrowser = !("undefined" == typeof window || "undefined" == typeof navigator || !window.document), isWebWorker = !isBrowser && "undefined" != typeof importScripts, readyRegExp = isBrowser && "PLAYSTATION 3" === navigator.platform ? /^complete$/ : /^(complete|loaded)$/, defContextName = "_", isOpera = "undefined" != typeof opera && "[object Opera]" === opera.toString(), contexts = {}, cfg = {}, globalDefQueue = [], useInteractive = !1;
    if ("undefined" == typeof define) {
        if ("undefined" != typeof requirejs) {
            if (isFunction(requirejs))return;
            cfg = requirejs, requirejs = void 0
        }
        "undefined" == typeof require || isFunction(require) || (cfg = require, require = void 0), req = requirejs = function (a, b, c, d) {
            var e, f, g = defContextName;
            return isArray(a) || "string" == typeof a || (f = a, isArray(b) ? (a = b, b = c, c = d) : a = []), f && f.context && (g = f.context), e = getOwn(contexts, g), e || (e = contexts[g] = req.s.newContext(g)), f && e.configure(f), e.require(a, b, c)
        }, req.config = function (a) {
            return req(a)
        }, req.nextTick = "undefined" != typeof setTimeout ? function (a) {
            setTimeout(a, 4)
        } : function (a) {
            a()
        }, require || (require = req), req.version = version, req.jsExtRegExp = /^\/|:|\?|\.js$/, req.isBrowser = isBrowser, s = req.s = {contexts: contexts, newContext: newContext}, req({}), each(["toUrl", "undef", "defined", "specified"], function (a) {
            req[a] = function () {
                var b = contexts[defContextName];
                return b.require[a].apply(b, arguments)
            }
        }), isBrowser && (head = s.head = document.getElementsByTagName("head")[0], baseElement = document.getElementsByTagName("base")[0], baseElement && (head = s.head = baseElement.parentNode)), req.onError = defaultOnError, req.createNode = function (a) {
            var b = a.xhtml ? document.createElementNS("http://www.w3.org/1999/xhtml", "html:script") : document.createElement("script");
            return b.type = a.scriptType || "text/javascript", b.charset = "utf-8", b.async = !0, b
        }, req.load = function (a, b, c) {
            var d, e = a && a.config || {};
            if (isBrowser)return d = req.createNode(e, b, c), d.setAttribute("data-requirecontext", a.contextName), d.setAttribute("data-requiremodule", b), !d.attachEvent || d.attachEvent.toString && d.attachEvent.toString().indexOf("[native code") < 0 || isOpera ? (d.addEventListener("load", a.onScriptLoad, !1), d.addEventListener("error", a.onScriptError, !1)) : (useInteractive = !0, d.attachEvent("onreadystatechange", a.onScriptLoad)), d.src = c, currentlyAddingScript = d, baseElement ? head.insertBefore(d, baseElement) : head.appendChild(d), currentlyAddingScript = null, d;
            if (isWebWorker)try {
                importScripts(c), a.completeLoad(b)
            } catch (f) {
                a.onError(makeError("importscripts", "importScripts failed for " + b + " at " + c, f, [b]))
            }
        }, isBrowser && !cfg.skipDataMain && eachReverse(scripts(), function (a) {
            return head || (head = a.parentNode), dataMain = a.getAttribute("data-main"), dataMain ? (mainScript = dataMain, cfg.baseUrl || (src = mainScript.split("/"), mainScript = src.pop(), subPath = src.length ? src.join("/") + "/" : "./", cfg.baseUrl = subPath), mainScript = mainScript.replace(jsSuffixRegExp, ""), req.jsExtRegExp.test(mainScript) && (mainScript = dataMain), cfg.deps = cfg.deps ? cfg.deps.concat(mainScript) : [mainScript], !0) : void 0
        }), define = function (a, b, c) {
            var d, e;
            "string" != typeof a && (c = b, b = a, a = null), isArray(b) || (c = b, b = null), !b && isFunction(c) && (b = [], c.length && (c.toString().replace(commentRegExp, "").replace(cjsRequireRegExp, function (a, c) {
                b.push(c)
            }), b = (1 === c.length ? ["require"] : ["require", "exports", "module"]).concat(b))), useInteractive && (d = currentlyAddingScript || getInteractiveScript(), d && (a || (a = d.getAttribute("data-requiremodule")), e = contexts[d.getAttribute("data-requirecontext")])), (e ? e.defQueue : globalDefQueue).push([a, b, c])
        }, define.amd = {jQuery: !0}, req.exec = function (text) {
            return eval(text)
        }, req(cfg)
    }
}(this), function () {
    !function (a, b, c) {
        "use strict";
        function d(a) {
            return function () {
                var b, c, d = arguments[0], e = "[" + (a ? a + ":" : "") + d + "] ", f = arguments[1], g = arguments, h = function (a) {
                    return"function" == typeof a ? a.toString().replace(/ \{[\s\S]*$/, "") : "undefined" == typeof a ? "undefined" : "string" != typeof a ? JSON.stringify(a) : a
                };
                for (b = e + f.replace(/\{\d+\}/g, function (a) {
                    var b, c = +a.slice(1, -1);
                    return c + 2 < g.length ? (b = g[c + 2], "function" == typeof b ? b.toString().replace(/ ?\{[\s\S]*$/, "") : "undefined" == typeof b ? "undefined" : "string" != typeof b ? Q(b) : b) : a
                }), b = b + "\nhttp://errors.angularjs.org/1.2.3/" + (a ? a + "/" : "") + d, c = 2; c < arguments.length; c++)b = b + (2 == c ? "?" : "&") + "p" + (c - 2) + "=" + encodeURIComponent(h(arguments[c]));
                return new Error(b)
            }
        }

        function e(a) {
            if (null == a || A(a))return!1;
            var b = a.length;
            return 1 === a.nodeType && b ? !0 : u(a) || x(a) || 0 === b || "number" == typeof b && b > 0 && b - 1 in a
        }

        function f(a, b, c) {
            var d;
            if (a)if (y(a))for (d in a)"prototype" != d && "length" != d && "name" != d && a.hasOwnProperty(d) && b.call(c, a[d], d); else if (a.forEach && a.forEach !== f)a.forEach(b, c); else if (e(a))for (d = 0; d < a.length; d++)b.call(c, a[d], d); else for (d in a)a.hasOwnProperty(d) && b.call(c, a[d], d);
            return a
        }

        function g(a) {
            var b = [];
            for (var c in a)a.hasOwnProperty(c) && b.push(c);
            return b.sort()
        }

        function h(a, b, c) {
            for (var d = g(a), e = 0; e < d.length; e++)b.call(c, a[d[e]], d[e]);
            return d
        }

        function i(a) {
            return function (b, c) {
                a(c, b)
            }
        }

        function j() {
            for (var a, b = od.length; b;) {
                if (b--, a = od[b].charCodeAt(0), 57 == a)return od[b] = "A", od.join("");
                if (90 != a)return od[b] = String.fromCharCode(a + 1), od.join("");
                od[b] = "0"
            }
            return od.unshift("0"), od.join("")
        }

        function k(a, b) {
            b ? a.$$hashKey = b : delete a.$$hashKey
        }

        function l(a) {
            var b = a.$$hashKey;
            return f(arguments, function (b) {
                b !== a && f(b, function (b, c) {
                    a[c] = b
                })
            }), k(a, b), a
        }

        function m(a) {
            return parseInt(a, 10)
        }

        function n(a, b) {
            return l(new (l(function () {
            }, {prototype: a})), b)
        }

        function o() {
        }

        function p(a) {
            return a
        }

        function q(a) {
            return function () {
                return a
            }
        }

        function r(a) {
            return"undefined" == typeof a
        }

        function s(a) {
            return"undefined" != typeof a
        }

        function t(a) {
            return null != a && "object" == typeof a
        }

        function u(a) {
            return"string" == typeof a
        }

        function v(a) {
            return"number" == typeof a
        }

        function w(a) {
            return"[object Date]" == ld.apply(a)
        }

        function x(a) {
            return"[object Array]" == ld.apply(a)
        }

        function y(a) {
            return"function" == typeof a
        }

        function z(a) {
            return"[object RegExp]" == ld.apply(a)
        }

        function A(a) {
            return a && a.document && a.location && a.alert && a.setInterval
        }

        function B(a) {
            return a && a.$evalAsync && a.$watch
        }

        function C(a) {
            return"[object File]" === ld.apply(a)
        }

        function D(a) {
            return a && (a.nodeName || a.on && a.find)
        }

        function E(a, b, c) {
            var d = [];
            return f(a, function (a, e, f) {
                d.push(b.call(c, a, e, f))
            }), d
        }

        function F(a, b) {
            return-1 != G(a, b)
        }

        function G(a, b) {
            if (a.indexOf)return a.indexOf(b);
            for (var c = 0; c < a.length; c++)if (b === a[c])return c;
            return-1
        }

        function H(a, b) {
            var c = G(a, b);
            return c >= 0 && a.splice(c, 1), b
        }

        function I(a, b) {
            if (A(a) || B(a))throw md("cpws", "Can't copy! Making copies of Window or Scope instances is not supported.");
            if (b) {
                if (a === b)throw md("cpi", "Can't copy! Source and destination are identical.");
                if (x(a)) {
                    b.length = 0;
                    for (var c = 0; c < a.length; c++)b.push(I(a[c]))
                } else {
                    var d = b.$$hashKey;
                    f(b, function (a, c) {
                        delete b[c]
                    });
                    for (var e in a)b[e] = I(a[e]);
                    k(b, d)
                }
            } else b = a, a && (x(a) ? b = I(a, []) : w(a) ? b = new Date(a.getTime()) : z(a) ? b = new RegExp(a.source) : t(a) && (b = I(a, {})));
            return b
        }

        function J(a, b) {
            b = b || {};
            for (var c in a)a.hasOwnProperty(c) && "$$" !== c.substr(0, 2) && (b[c] = a[c]);
            return b
        }

        function K(a, b) {
            if (a === b)return!0;
            if (null === a || null === b)return!1;
            if (a !== a && b !== b)return!0;
            var d, e, f, g = typeof a, h = typeof b;
            if (g == h && "object" == g) {
                if (!x(a)) {
                    if (w(a))return w(b) && a.getTime() == b.getTime();
                    if (z(a) && z(b))return a.toString() == b.toString();
                    if (B(a) || B(b) || A(a) || A(b) || x(b))return!1;
                    f = {};
                    for (e in a)if ("$" !== e.charAt(0) && !y(a[e])) {
                        if (!K(a[e], b[e]))return!1;
                        f[e] = !0
                    }
                    for (e in b)if (!f.hasOwnProperty(e) && "$" !== e.charAt(0) && b[e] !== c && !y(b[e]))return!1;
                    return!0
                }
                if (!x(b))return!1;
                if ((d = a.length) == b.length) {
                    for (e = 0; d > e; e++)if (!K(a[e], b[e]))return!1;
                    return!0
                }
            }
            return!1
        }

        function L() {
            return b.securityPolicy && b.securityPolicy.isActive || b.querySelector && !(!b.querySelector("[ng-csp]") && !b.querySelector("[data-ng-csp]"))
        }

        function M(a, b, c) {
            return a.concat(jd.call(b, c))
        }

        function N(a, b) {
            return jd.call(a, b || 0)
        }

        function O(a, b) {
            var c = arguments.length > 2 ? N(arguments, 2) : [];
            return!y(b) || b instanceof RegExp ? b : c.length ? function () {
                return arguments.length ? b.apply(a, c.concat(jd.call(arguments, 0))) : b.apply(a, c)
            } : function () {
                return arguments.length ? b.apply(a, arguments) : b.call(a)
            }
        }

        function P(a, d) {
            var e = d;
            return"string" == typeof a && "$" === a.charAt(0) ? e = c : A(d) ? e = "$WINDOW" : d && b === d ? e = "$DOCUMENT" : B(d) && (e = "$SCOPE"), e
        }

        function Q(a, b) {
            return"undefined" == typeof a ? c : JSON.stringify(a, P, b ? "  " : null)
        }

        function R(a) {
            return u(a) ? JSON.parse(a) : a
        }

        function S(a) {
            if (a && 0 !== a.length) {
                var b = ad("" + a);
                a = !("f" == b || "0" == b || "false" == b || "no" == b || "n" == b || "[]" == b)
            } else a = !1;
            return a
        }

        function T(a) {
            a = fd(a).clone();
            try {
                a.html("")
            } catch (b) {
            }
            var c = 3, d = fd("<div>").append(a).html();
            try {
                return a[0].nodeType === c ? ad(d) : d.match(/^(<[^>]+>)/)[1].replace(/^<([\w\-]+)/, function (a, b) {
                    return"<" + ad(b)
                })
            } catch (b) {
                return ad(d)
            }
        }

        function U(a) {
            try {
                return decodeURIComponent(a)
            } catch (b) {
            }
        }

        function V(a) {
            var b, c, d = {};
            return f((a || "").split("&"), function (a) {
                if (a && (b = a.split("="), c = U(b[0]), s(c))) {
                    var e = s(b[1]) ? U(b[1]) : !0;
                    d[c] ? x(d[c]) ? d[c].push(e) : d[c] = [d[c], e] : d[c] = e
                }
            }), d
        }

        function W(a) {
            var b = [];
            return f(a, function (a, c) {
                x(a) ? f(a, function (a) {
                    b.push(Y(c, !0) + (a === !0 ? "" : "=" + Y(a, !0)))
                }) : b.push(Y(c, !0) + (a === !0 ? "" : "=" + Y(a, !0)))
            }), b.length ? b.join("&") : ""
        }

        function X(a) {
            return Y(a, !0).replace(/%26/gi, "&").replace(/%3D/gi, "=").replace(/%2B/gi, "+")
        }

        function Y(a, b) {
            return encodeURIComponent(a).replace(/%40/gi, "@").replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%20/g, b ? "%20" : "+")
        }

        function Z(a, c) {
            function d(a) {
                a && h.push(a)
            }

            var e, g, h = [a], i = ["ng:app", "ng-app", "x-ng-app", "data-ng-app"], j = /\sng[:\-]app(:\s*([\w\d_]+);?)?\s/;
            f(i, function (c) {
                i[c] = !0, d(b.getElementById(c)), c = c.replace(":", "\\:"), a.querySelectorAll && (f(a.querySelectorAll("." + c), d), f(a.querySelectorAll("." + c + "\\:"), d), f(a.querySelectorAll("[" + c + "]"), d))
            }), f(h, function (a) {
                if (!e) {
                    var b = " " + a.className + " ", c = j.exec(b);
                    c ? (e = a, g = (c[2] || "").replace(/\s+/g, ",")) : f(a.attributes, function (b) {
                        !e && i[b.name] && (e = a, g = b.value)
                    })
                }
            }), e && c(e, g ? [g] : [])
        }

        function $(c, d) {
            var e = function () {
                if (c = fd(c), c.injector()) {
                    var a = c[0] === b ? "document" : T(c);
                    throw md("btstrpd", "App Already Bootstrapped with this Element '{0}'", a)
                }
                d = d || [], d.unshift(["$provide", function (a) {
                    a.value("$rootElement", c)
                }]), d.unshift("ng");
                var e = Db(d);
                return e.invoke(["$rootScope", "$rootElement", "$compile", "$injector", "$animate", function (a, b, c, d) {
                    a.$apply(function () {
                        b.data("$injector", d), c(b)(a)
                    })
                }]), e
            }, g = /^NG_DEFER_BOOTSTRAP!/;
            return a && !g.test(a.name) ? e() : (a.name = a.name.replace(g, ""), void(nd.resumeBootstrap = function (a) {
                f(a, function (a) {
                    d.push(a)
                }), e()
            }))
        }

        function _(a, b) {
            return b = b || "_", a.replace(qd, function (a, c) {
                return(c ? b : "") + a.toLowerCase()
            })
        }

        function ab() {
            gd = a.jQuery, gd ? (fd = gd, l(gd.fn, {scope: Ad.scope, isolateScope: Ad.isolateScope, controller: Ad.controller, injector: Ad.injector, inheritedData: Ad.inheritedData}), kb("remove", !0, !0, !1), kb("empty", !1, !1, !1), kb("html", !1, !1, !0)) : fd = lb, nd.element = fd
        }

        function bb(a, b, c) {
            if (!a)throw md("areq", "Argument '{0}' is {1}", b || "?", c || "required");
            return a
        }

        function cb(a, b, c) {
            return c && x(a) && (a = a[a.length - 1]), bb(y(a), b, "not a function, got " + (a && "object" == typeof a ? a.constructor.name || "Object" : typeof a)), a
        }

        function db(a, b) {
            if ("hasOwnProperty" === a)throw md("badname", "hasOwnProperty is not a valid {0} name", b)
        }

        function eb(a, b, c) {
            if (!b)return a;
            for (var d, e = b.split("."), f = a, g = e.length, h = 0; g > h; h++)d = e[h], a && (a = (f = a)[d]);
            return!c && y(a) ? O(f, a) : a
        }

        function fb(a) {
            if (a.startNode === a.endNode)return fd(a.startNode);
            var b = a.startNode, c = [b];
            do {
                if (b = b.nextSibling, !b)break;
                c.push(b)
            } while (b !== a.endNode);
            return fd(c)
        }

        function gb(a) {
            function b(a, b, c) {
                return a[b] || (a[b] = c())
            }

            var c = d("$injector"), e = d("ng"), f = b(a, "angular", Object);
            return f.$$minErr = f.$$minErr || d, b(f, "module", function () {
                var a = {};
                return function (d, f, g) {
                    var h = function (a, b) {
                        if ("hasOwnProperty" === a)throw e("badname", "hasOwnProperty is not a valid {0} name", b)
                    };
                    return h(d, "module"), f && a.hasOwnProperty(d) && (a[d] = null), b(a, d, function () {
                        function a(a, c, d) {
                            return function () {
                                return b[d || "push"]([a, c, arguments]), i
                            }
                        }

                        if (!f)throw c("nomod", "Module '{0}' is not available! You either misspelled the module name or forgot to load it. If registering a module ensure that you specify the dependencies as the second argument.", d);
                        var b = [], e = [], h = a("$injector", "invoke"), i = {_invokeQueue: b, _runBlocks: e, requires: f, name: d, provider: a("$provide", "provider"), factory: a("$provide", "factory"), service: a("$provide", "service"), value: a("$provide", "value"), constant: a("$provide", "constant", "unshift"), animation: a("$animateProvider", "register"), filter: a("$filterProvider", "register"), controller: a("$controllerProvider", "register"), directive: a("$compileProvider", "directive"), config: h, run: function (a) {
                            return e.push(a), this
                        }};
                        return g && h(g), i
                    })
                }
            })
        }

        function hb(b) {
            l(b, {bootstrap: $, copy: I, extend: l, equals: K, element: fd, forEach: f, injector: Db, noop: o, bind: O, toJson: Q, fromJson: R, identity: p, isUndefined: r, isDefined: s, isString: u, isFunction: y, isObject: t, isNumber: v, isElement: D, isArray: x, version: rd, isDate: w, lowercase: ad, uppercase: bd, callbacks: {counter: 0}, $$minErr: d, $$csp: L}), hd = gb(a);
            try {
                hd("ngLocale")
            } catch (c) {
                hd("ngLocale", []).provider("$locale", Yb)
            }
            hd("ng", ["ngLocale"], ["$provide", function (a) {
                a.provider({$$sanitizeUri: uc}), a.provider("$compile", Jb).directive({a: he, input: re, textarea: re, form: le, script: Ze, select: af, style: cf, option: bf, ngBind: De, ngBindHtml: Fe, ngBindTemplate: Ee, ngClass: Ge, ngClassEven: Ie, ngClassOdd: He, ngCloak: Je, ngController: Ke, ngForm: me, ngHide: Te, ngIf: Me, ngInclude: Ne, ngInit: Oe, ngNonBindable: Pe, ngPluralize: Qe, ngRepeat: Re, ngShow: Se, ngStyle: Ue, ngSwitch: Ve, ngSwitchWhen: We, ngSwitchDefault: Xe, ngOptions: _e, ngTransclude: Ye, ngModel: xe, ngList: Ae, ngChange: ye, required: ze, ngRequired: ze, ngValue: Ce}).directive(ie).directive(Le), a.provider({$anchorScroll: Eb, $animate: Jd, $browser: Gb, $cacheFactory: Hb, $controller: Mb, $document: Nb, $exceptionHandler: Ob, $filter: Fc, $interpolate: Wb, $interval: Xb, $http: Tb, $httpBackend: Ub, $location: jc, $log: kc, $parse: qc, $rootScope: tc, $q: rc, $sce: zc, $sceDelegate: yc, $sniffer: Ac, $templateCache: Ib, $timeout: Bc, $window: Ec})
            }])
        }

        function ib() {
            return++ud
        }

        function jb(a) {
            return a.replace(xd,function (a, b, c, d) {
                return d ? c.toUpperCase() : c
            }).replace(yd, "Moz$1")
        }

        function kb(a, b, c, d) {
            function e(a) {
                var e, g, h, i, j, k, l, m = c && a ? [this.filter(a)] : [this], n = b;
                if (!d || null != a)for (; m.length;)for (e = m.shift(), g = 0, h = e.length; h > g; g++)for (i = fd(e[g]), n ? i.triggerHandler("$destroy") : n = !n, j = 0, k = (l = i.children()).length; k > j; j++)m.push(gd(l[j]));
                return f.apply(this, arguments)
            }

            var f = gd.fn[a];
            f = f.$original || f, e.$original = f, gd.fn[a] = e
        }

        function lb(a) {
            if (a instanceof lb)return a;
            if (!(this instanceof lb)) {
                if (u(a) && "<" != a.charAt(0))throw zd("nosel", "Looking up elements via selectors is not supported by jqLite! See: http://docs.angularjs.org/api/angular.element");
                return new lb(a)
            }
            if (u(a)) {
                var c = b.createElement("div");
                c.innerHTML = "<div>&#160;</div>" + a, c.removeChild(c.firstChild), vb(this, c.childNodes);
                var d = fd(b.createDocumentFragment());
                d.append(this)
            } else vb(this, a)
        }

        function mb(a) {
            return a.cloneNode(!0)
        }

        function nb(a) {
            pb(a);
            for (var b = 0, c = a.childNodes || []; b < c.length; b++)nb(c[b])
        }

        function ob(a, b, c, d) {
            if (s(d))throw zd("offargs", "jqLite#off() does not support the `selector` argument");
            var e = qb(a, "events"), g = qb(a, "handle");
            g && (r(b) ? f(e, function (b, c) {
                wd(a, c, b), delete e[c]
            }) : f(b.split(" "), function (b) {
                r(c) ? (wd(a, b, e[b]), delete e[b]) : H(e[b] || [], c)
            }))
        }

        function pb(a, b) {
            var d = a[td], e = sd[d];
            if (e) {
                if (b)return void delete sd[d].data[b];
                e.handle && (e.events.$destroy && e.handle({}, "$destroy"), ob(a)), delete sd[d], a[td] = c
            }
        }

        function qb(a, b, c) {
            var d = a[td], e = sd[d || -1];
            return s(c) ? (e || (a[td] = d = ib(), e = sd[d] = {}), void(e[b] = c)) : e && e[b]
        }

        function rb(a, b, c) {
            var d = qb(a, "data"), e = s(c), f = !e && s(b), g = f && !t(b);
            if (d || g || qb(a, "data", d = {}), e)d[b] = c; else {
                if (!f)return d;
                if (g)return d && d[b];
                l(d, b)
            }
        }

        function sb(a, b) {
            return a.getAttribute ? (" " + (a.getAttribute("class") || "") + " ").replace(/[\n\t]/g, " ").indexOf(" " + b + " ") > -1 : !1
        }

        function tb(a, b) {
            b && a.setAttribute && f(b.split(" "), function (b) {
                a.setAttribute("class", pd((" " + (a.getAttribute("class") || "") + " ").replace(/[\n\t]/g, " ").replace(" " + pd(b) + " ", " ")))
            })
        }

        function ub(a, b) {
            if (b && a.setAttribute) {
                var c = (" " + (a.getAttribute("class") || "") + " ").replace(/[\n\t]/g, " ");
                f(b.split(" "), function (a) {
                    a = pd(a), -1 === c.indexOf(" " + a + " ") && (c += a + " ")
                }), a.setAttribute("class", pd(c))
            }
        }

        function vb(a, b) {
            if (b) {
                b = b.nodeName || !s(b.length) || A(b) ? [b] : b;
                for (var c = 0; c < b.length; c++)a.push(b[c])
            }
        }

        function wb(a, b) {
            return xb(a, "$" + (b || "ngController") + "Controller")
        }

        function xb(a, b, d) {
            a = fd(a), 9 == a[0].nodeType && (a = a.find("html"));
            for (var e = x(b) ? b : [b]; a.length;) {
                for (var f = 0, g = e.length; g > f; f++)if ((d = a.data(e[f])) !== c)return d;
                a = a.parent()
            }
        }

        function yb(a, b) {
            var c = Bd[b.toLowerCase()];
            return c && Cd[a.nodeName] && c
        }

        function zb(a, c) {
            var d = function (d, e) {
                if (d.preventDefault || (d.preventDefault = function () {
                    d.returnValue = !1
                }), d.stopPropagation || (d.stopPropagation = function () {
                    d.cancelBubble = !0
                }), d.target || (d.target = d.srcElement || b), r(d.defaultPrevented)) {
                    var g = d.preventDefault;
                    d.preventDefault = function () {
                        d.defaultPrevented = !0, g.call(d)
                    }, d.defaultPrevented = !1
                }
                d.isDefaultPrevented = function () {
                    return d.defaultPrevented || d.returnValue === !1
                }, f(c[e || d.type], function (b) {
                    b.call(a, d)
                }), 8 >= ed ? (d.preventDefault = null, d.stopPropagation = null, d.isDefaultPrevented = null) : (delete d.preventDefault, delete d.stopPropagation, delete d.isDefaultPrevented)
            };
            return d.elem = a, d
        }

        function Ab(a) {
            var b, d = typeof a;
            return"object" == d && null !== a ? "function" == typeof(b = a.$$hashKey) ? b = a.$$hashKey() : b === c && (b = a.$$hashKey = j()) : b = a, d + ":" + b
        }

        function Bb(a) {
            f(a, this.put, this)
        }

        function Cb(a) {
            var b, c, d, e;
            return"function" == typeof a ? (b = a.$inject) || (b = [], a.length && (c = a.toString().replace(Gd, ""), d = c.match(Dd), f(d[1].split(Ed), function (a) {
                a.replace(Fd, function (a, c, d) {
                    b.push(d)
                })
            })), a.$inject = b) : x(a) ? (e = a.length - 1, cb(a[e], "fn"), b = a.slice(0, e)) : cb(a, "fn", !0), b
        }

        function Db(a) {
            function b(a) {
                return function (b, c) {
                    return t(b) ? void f(b, i(a)) : a(b, c)
                }
            }

            function c(a, b) {
                if (db(a, "service"), (y(b) || x(b)) && (b = v.instantiate(b)), !b.$get)throw Hd("pget", "Provider '{0}' must define $get factory method.", a);
                return s[a + n] = b
            }

            function d(a, b) {
                return c(a, {$get: b})
            }

            function e(a, b) {
                return d(a, ["$injector", function (a) {
                    return a.instantiate(b)
                }])
            }

            function g(a, b) {
                return d(a, q(b))
            }

            function h(a, b) {
                db(a, "constant"), s[a] = b, w[a] = b
            }

            function j(a, b) {
                var c = v.get(a + n), d = c.$get;
                c.$get = function () {
                    var a = z.invoke(d, c);
                    return z.invoke(b, null, {$delegate: a})
                }
            }

            function k(a) {
                var b, c, d, e, g = [];
                return f(a, function (a) {
                    if (!r.get(a)) {
                        r.put(a, !0);
                        try {
                            if (u(a))for (b = hd(a), g = g.concat(k(b.requires)).concat(b._runBlocks), c = b._invokeQueue, d = 0, e = c.length; e > d; d++) {
                                var f = c[d], h = v.get(f[0]);
                                h[f[1]].apply(h, f[2])
                            } else y(a) ? g.push(v.invoke(a)) : x(a) ? g.push(v.invoke(a)) : cb(a, "module")
                        } catch (i) {
                            throw x(a) && (a = a[a.length - 1]), i.message && i.stack && -1 == i.stack.indexOf(i.message) && (i = i.message + "\n" + i.stack), Hd("modulerr", "Failed to instantiate module {0} due to:\n{1}", a, i.stack || i.message || i)
                        }
                    }
                }), g
            }

            function l(a, b) {
                function c(c) {
                    if (a.hasOwnProperty(c)) {
                        if (a[c] === m)throw Hd("cdep", "Circular dependency found: {0}", p.join(" <- "));
                        return a[c]
                    }
                    try {
                        return p.unshift(c), a[c] = m, a[c] = b(c)
                    } finally {
                        p.shift()
                    }
                }

                function d(a, b, d) {
                    var e, f, g, h = [], i = Cb(a);
                    for (f = 0, e = i.length; e > f; f++) {
                        if (g = i[f], "string" != typeof g)throw Hd("itkn", "Incorrect injection token! Expected service name as string, got {0}", g);
                        h.push(d && d.hasOwnProperty(g) ? d[g] : c(g))
                    }
                    switch (a.$inject || (a = a[e]), b ? -1 : h.length) {
                        case 0:
                            return a();
                        case 1:
                            return a(h[0]);
                        case 2:
                            return a(h[0], h[1]);
                        case 3:
                            return a(h[0], h[1], h[2]);
                        case 4:
                            return a(h[0], h[1], h[2], h[3]);
                        case 5:
                            return a(h[0], h[1], h[2], h[3], h[4]);
                        case 6:
                            return a(h[0], h[1], h[2], h[3], h[4], h[5]);
                        case 7:
                            return a(h[0], h[1], h[2], h[3], h[4], h[5], h[6]);
                        case 8:
                            return a(h[0], h[1], h[2], h[3], h[4], h[5], h[6], h[7]);
                        case 9:
                            return a(h[0], h[1], h[2], h[3], h[4], h[5], h[6], h[7], h[8]);
                        case 10:
                            return a(h[0], h[1], h[2], h[3], h[4], h[5], h[6], h[7], h[8], h[9]);
                        default:
                            return a.apply(b, h)
                    }
                }

                function e(a, b) {
                    var c, e, f = function () {
                    };
                    return f.prototype = (x(a) ? a[a.length - 1] : a).prototype, c = new f, e = d(a, c, b), t(e) || y(e) ? e : c
                }

                return{invoke: d, instantiate: e, get: c, annotate: Cb, has: function (b) {
                    return s.hasOwnProperty(b + n) || a.hasOwnProperty(b)
                }}
            }

            var m = {}, n = "Provider", p = [], r = new Bb, s = {$provide: {provider: b(c), factory: b(d), service: b(e), value: b(g), constant: b(h), decorator: j}}, v = s.$injector = l(s, function () {
                throw Hd("unpr", "Unknown provider: {0}", p.join(" <- "))
            }), w = {}, z = w.$injector = l(w, function (a) {
                var b = v.get(a + n);
                return z.invoke(b.$get, b)
            });
            return f(k(a), function (a) {
                z.invoke(a || o)
            }), z
        }

        function Eb() {
            var a = !0;
            this.disableAutoScrolling = function () {
                a = !1
            }, this.$get = ["$window", "$location", "$rootScope", function (b, c, d) {
                function e(a) {
                    var b = null;
                    return f(a, function (a) {
                        b || "a" !== ad(a.nodeName) || (b = a)
                    }), b
                }

                function g() {
                    var a, d = c.hash();
                    d ? (a = h.getElementById(d)) ? a.scrollIntoView() : (a = e(h.getElementsByName(d))) ? a.scrollIntoView() : "top" === d && b.scrollTo(0, 0) : b.scrollTo(0, 0)
                }

                var h = b.document;
                return a && d.$watch(function () {
                    return c.hash()
                }, function () {
                    d.$evalAsync(g)
                }), g
            }]
        }

        function Fb(a, b, d, e) {
            function g(a) {
                try {
                    a.apply(null, N(arguments, 1))
                } finally {
                    if (s--, 0 === s)for (; t.length;)try {
                        t.pop()()
                    } catch (b) {
                        d.error(b)
                    }
                }
            }

            function h(a, b) {
                !function c() {
                    f(w, function (a) {
                        a()
                    }), v = b(c, a)
                }()
            }

            function i() {
                z = null, x != j.url() && (x = j.url(), f(A, function (a) {
                    a(j.url())
                }))
            }

            var j = this, k = b[0], l = a.location, m = a.history, n = a.setTimeout, p = a.clearTimeout, q = {};
            j.isMock = !1;
            var s = 0, t = [];
            j.$$completeOutstandingRequest = g, j.$$incOutstandingRequestCount = function () {
                s++
            }, j.notifyWhenNoOutstandingRequests = function (a) {
                f(w, function (a) {
                    a()
                }), 0 === s ? a() : t.push(a)
            };
            var v, w = [];
            j.addPollFn = function (a) {
                return r(v) && h(100, n), w.push(a), a
            };
            var x = l.href, y = b.find("base"), z = null;
            j.url = function (b, c) {
                if (l !== a.location && (l = a.location), b) {
                    if (x == b)return;
                    return x = b, e.history ? c ? m.replaceState(null, "", b) : (m.pushState(null, "", b), y.attr("href", y.attr("href"))) : (z = b, c ? l.replace(b) : l.href = b), j
                }
                return z || l.href.replace(/%27/g, "'")
            };
            var A = [], B = !1;
            j.onUrlChange = function (b) {
                return B || (e.history && fd(a).on("popstate", i), e.hashchange ? fd(a).on("hashchange", i) : j.addPollFn(i), B = !0), A.push(b), b
            }, j.baseHref = function () {
                var a = y.attr("href");
                return a ? a.replace(/^https?\:\/\/[^\/]*/, "") : ""
            };
            var C = {}, D = "", E = j.baseHref();
            j.cookies = function (a, b) {
                var e, f, g, h, i;
                if (!a) {
                    if (k.cookie !== D)for (D = k.cookie, f = D.split("; "), C = {}, h = 0; h < f.length; h++)g = f[h], i = g.indexOf("="), i > 0 && (a = unescape(g.substring(0, i)), C[a] === c && (C[a] = unescape(g.substring(i + 1))));
                    return C
                }
                b === c ? k.cookie = escape(a) + "=;path=" + E + ";expires=Thu, 01 Jan 1970 00:00:00 GMT" : u(b) && (e = (k.cookie = escape(a) + "=" + escape(b) + ";path=" + E).length + 1, e > 4096 && d.warn("Cookie '" + a + "' possibly not set or overflowed because it was too large (" + e + " > 4096 bytes)!"))
            }, j.defer = function (a, b) {
                var c;
                return s++, c = n(function () {
                    delete q[c], g(a)
                }, b || 0), q[c] = !0, c
            }, j.defer.cancel = function (a) {
                return q[a] ? (delete q[a], p(a), g(o), !0) : !1
            }
        }

        function Gb() {
            this.$get = ["$window", "$log", "$sniffer", "$document", function (a, b, c, d) {
                return new Fb(a, d, b, c)
            }]
        }

        function Hb() {
            this.$get = function () {
                function a(a, c) {
                    function e(a) {
                        a != m && (n ? n == a && (n = a.n) : n = a, f(a.n, a.p), f(a, m), m = a, m.n = null)
                    }

                    function f(a, b) {
                        a != b && (a && (a.p = b), b && (b.n = a))
                    }

                    if (a in b)throw d("$cacheFactory")("iid", "CacheId '{0}' is already taken!", a);
                    var g = 0, h = l({}, c, {id: a}), i = {}, j = c && c.capacity || Number.MAX_VALUE, k = {}, m = null, n = null;
                    return b[a] = {put: function (a, b) {
                        var c = k[a] || (k[a] = {key: a});
                        return e(c), r(b) ? void 0 : (a in i || g++, i[a] = b, g > j && this.remove(n.key), b)
                    }, get: function (a) {
                        var b = k[a];
                        if (b)return e(b), i[a]
                    }, remove: function (a) {
                        var b = k[a];
                        b && (b == m && (m = b.p), b == n && (n = b.n), f(b.n, b.p), delete k[a], delete i[a], g--)
                    }, removeAll: function () {
                        i = {}, g = 0, k = {}, m = n = null
                    }, destroy: function () {
                        i = null, h = null, k = null, delete b[a]
                    }, info: function () {
                        return l({}, h, {size: g})
                    }}
                }

                var b = {};
                return a.info = function () {
                    var a = {};
                    return f(b, function (b, c) {
                        a[c] = b.info()
                    }), a
                }, a.get = function (a) {
                    return b[a]
                }, a
            }
        }

        function Ib() {
            this.$get = ["$cacheFactory", function (a) {
                return a("templates")
            }]
        }

        function Jb(a, d) {
            var e = {}, g = "Directive", h = /^\s*directive\:\s*([\d\w\-_]+)\s+(.*)$/, j = /(([\d\w\-_]+)(?:\:([^;]+))?;?)/, k = /^(on[a-z]+|formaction)$/;
            this.directive = function m(b, c) {
                return db(b, "directive"), u(b) ? (bb(c, "directiveFactory"), e.hasOwnProperty(b) || (e[b] = [], a.factory(b + g, ["$injector", "$exceptionHandler", function (a, c) {
                    var d = [];
                    return f(e[b], function (e, f) {
                        try {
                            var g = a.invoke(e);
                            y(g) ? g = {compile: q(g)} : !g.compile && g.link && (g.compile = q(g.link)), g.priority = g.priority || 0, g.index = f, g.name = g.name || b, g.require = g.require || g.controller && g.name, g.restrict = g.restrict || "A", d.push(g)
                        } catch (h) {
                            c(h)
                        }
                    }), d
                }])), e[b].push(c)) : f(b, i(m)), this
            }, this.aHrefSanitizationWhitelist = function (a) {
                return s(a) ? (d.aHrefSanitizationWhitelist(a), this) : d.aHrefSanitizationWhitelist()
            }, this.imgSrcSanitizationWhitelist = function (a) {
                return s(a) ? (d.imgSrcSanitizationWhitelist(a), this) : d.imgSrcSanitizationWhitelist()
            }, this.$get = ["$injector", "$interpolate", "$exceptionHandler", "$http", "$templateCache", "$parse", "$controller", "$rootScope", "$document", "$sce", "$animate", "$$sanitizeUri", function (a, d, i, m, o, r, s, v, w, z, A, B) {
                function C(a, b, c, d, e) {
                    a instanceof fd || (a = fd(a)), f(a, function (b, c) {
                        3 == b.nodeType && b.nodeValue.match(/\S+/) && (a[c] = b = fd(b).wrap("<span></span>").parent()[0])
                    });
                    var g = E(a, b, a, c, d, e);
                    return function (b, c, d) {
                        bb(b, "scope");
                        var e = c ? Ad.clone.call(a) : a;
                        f(d, function (a, b) {
                            e.data("$" + b + "Controller", a)
                        });
                        for (var h = 0, i = e.length; i > h; h++) {
                            var j = e[h];
                            (1 == j.nodeType || 9 == j.nodeType) && e.eq(h).data("$scope", b)
                        }
                        return D(e, "ng-scope"), c && c(e, b), g && g(b, e, e), e
                    }
                }

                function D(a, b) {
                    try {
                        a.addClass(b)
                    } catch (c) {
                    }
                }

                function E(a, b, d, e, f, g) {
                    function h(a, d, e, f) {
                        var g, h, i, j, k, l, m, o, p, q = [];
                        for (m = 0, o = d.length; o > m; m++)q.push(d[m]);
                        for (m = 0, p = 0, o = n.length; o > m; p++)i = q[p], g = n[m++], h = n[m++], j = fd(i), g ? (g.scope ? (k = a.$new(), j.data("$scope", k), D(j, "ng-scope")) : k = a, l = g.transclude, l || !f && b ? g(h, k, i, e, F(a, l || b)) : g(h, k, i, c, f)) : h && h(a, i.childNodes, c, f)
                    }

                    for (var i, j, k, l, m, n = [], o = 0; o < a.length; o++)l = new Z, k = G(a[o], [], l, 0 === o ? e : c, f), i = k.length ? K(k, a[o], l, b, d, null, [], [], g) : null, j = i && i.terminal || !a[o].childNodes || !a[o].childNodes.length ? null : E(a[o].childNodes, i ? i.transclude : b), n.push(i), n.push(j), m = m || i || j, g = null;
                    return m ? h : null
                }

                function F(a, b) {
                    return function (c, d, e) {
                        var f = !1;
                        c || (c = a.$new(), c.$$transcluded = !0, f = !0);
                        var g = b(c, d, e);
                        return f && g.on("$destroy", O(c, c.$destroy)), g
                    }
                }

                function G(a, b, c, d, e) {
                    var f, g, i = a.nodeType, k = c.$attr;
                    switch (i) {
                        case 1:
                            M(b, Kb(id(a).toLowerCase()), "E", d, e);
                            for (var l, m, n, o, p, q = a.attributes, r = 0, s = q && q.length; s > r; r++) {
                                var t = !1, v = !1;
                                if (l = q[r], !ed || ed >= 8 || l.specified) {
                                    m = l.name, o = Kb(m), db.test(o) && (m = _(o.substr(6), "-"));
                                    var w = o.replace(/(Start|End)$/, "");
                                    o === w + "Start" && (t = m, v = m.substr(0, m.length - 5) + "end", m = m.substr(0, m.length - 6)), n = Kb(m.toLowerCase()), k[n] = m, c[n] = p = pd(ed && "href" == m ? decodeURIComponent(a.getAttribute(m, 2)) : l.value), yb(a, n) && (c[n] = !0), W(a, b, p, n), M(b, n, "A", d, e, t, v)
                                }
                            }
                            if (g = a.className, u(g) && "" !== g)for (; f = j.exec(g);)n = Kb(f[2]), M(b, n, "C", d, e) && (c[n] = pd(f[3])), g = g.substr(f.index + f[0].length);
                            break;
                        case 3:
                            U(b, a.nodeValue);
                            break;
                        case 8:
                            try {
                                f = h.exec(a.nodeValue), f && (n = Kb(f[1]), M(b, n, "M", d, e) && (c[n] = pd(f[2])))
                            } catch (x) {
                            }
                    }
                    return b.sort(R), b
                }

                function H(a, b, c) {
                    var d = [], e = 0;
                    if (b && a.hasAttribute && a.hasAttribute(b)) {
                        do {
                            if (!a)throw Kd("uterdir", "Unterminated attribute, found '{0}' but no matching '{1}' found.", b, c);
                            1 == a.nodeType && (a.hasAttribute(b) && e++, a.hasAttribute(c) && e--), d.push(a), a = a.nextSibling
                        } while (e > 0)
                    } else d.push(a);
                    return fd(d)
                }

                function I(a, b, c) {
                    return function (d, e, f, g, h) {
                        return e = H(e[0], b, c), a(d, e, f, g, h)
                    }
                }

                function K(a, e, g, h, j, k, l, m, n) {
                    function o(a, b, c, d) {
                        a && (c && (a = I(a, c, d)), a.require = w.require, (M === w || w.$$isolateScope) && (a = Y(a, {isolateScope: !0})), l.push(a)), b && (c && (b = I(b, c, d)), b.require = w.require, (M === w || w.$$isolateScope) && (b = Y(b, {isolateScope: !0})), m.push(b))
                    }

                    function p(a, b, c) {
                        var d, e = "data", g = !1;
                        if (u(a)) {
                            for (; "^" == (d = a.charAt(0)) || "?" == d;)a = a.substr(1), "^" == d && (e = "inheritedData"), g = g || "?" == d;
                            if (d = null, c && "data" === e && (d = c[a]), d = d || b[e]("$" + a + "Controller"), !d && !g)throw Kd("ctreq", "Controller '{0}', required by directive '{1}', can't be found!", a, z);
                            return d
                        }
                        return x(a) && (d = [], f(a, function (a) {
                            d.push(p(a, b, c))
                        })), d
                    }

                    function q(a, b, h, j, k) {
                        function n(a, b) {
                            var d;
                            return arguments.length < 2 && (b = a, a = c), V && (d = z), k(a, b, d)
                        }

                        var o, q, t, u, v, w, x, y, z = {};
                        if (o = e === h ? g : J(g, new Z(fd(h), g.$attr)), q = o.$$element, M) {
                            var A = /^\s*([@=&])(\??)\s*(\w*)\s*$/, B = fd(h);
                            x = b.$new(!0), O && O === M.$$originalDirective ? B.data("$isolateScope", x) : B.data("$isolateScopeNoTemplate", x), D(B, "ng-isolate-scope"), f(M.scope, function (a, c) {
                                var e, f, g, h = a.match(A) || [], i = h[3] || c, j = "?" == h[2], k = h[1];
                                switch (x.$$isolateBindings[c] = k + i, k) {
                                    case"@":
                                        o.$observe(i, function (a) {
                                            x[c] = a
                                        }), o.$$observers[i].$$scope = b, o[i] && (x[c] = d(o[i])(b));
                                        break;
                                    case"=":
                                        if (j && !o[i])return;
                                        f = r(o[i]), g = f.assign || function () {
                                            throw e = x[c] = f(b), Kd("nonassign", "Expression '{0}' used with directive '{1}' is non-assignable!", o[i], M.name)
                                        }, e = x[c] = f(b), x.$watch(function () {
                                            var a = f(b);
                                            return a !== x[c] && (a !== e ? e = x[c] = a : g(b, a = e = x[c])), a
                                        });
                                        break;
                                    case"&":
                                        f = r(o[i]), x[c] = function (a) {
                                            return f(b, a)
                                        };
                                        break;
                                    default:
                                        throw Kd("iscp", "Invalid isolate scope definition for directive '{0}'. Definition: {... {1}: '{2}' ...}", M.name, c, a)
                                }
                            })
                        }
                        for (y = k && n, K && f(K, function (a) {
                            var c, d = {$scope: a === M || a.$$isolateScope ? x : b, $element: q, $attrs: o, $transclude: y};
                            w = a.controller, "@" == w && (w = o[a.name]), c = s(w, d), z[a.name] = c, V || q.data("$" + a.name + "Controller", c), a.controllerAs && (d.$scope[a.controllerAs] = c)
                        }), t = 0, u = l.length; u > t; t++)try {
                            v = l[t], v(v.isolateScope ? x : b, q, o, v.require && p(v.require, q, z), y)
                        } catch (C) {
                            i(C, T(q))
                        }
                        var E = b;
                        for (M && (M.template || null === M.templateUrl) && (E = x), a && a(E, h.childNodes, c, k), t = m.length - 1; t >= 0; t--)try {
                            v = m[t], v(v.isolateScope ? x : b, q, o, v.require && p(v.require, q, z), y)
                        } catch (C) {
                            i(C, T(q))
                        }
                    }

                    n = n || {};
                    for (var v, w, z, A, B, E, F = -Number.MAX_VALUE, K = n.controllerDirectives, M = n.newIsolateScopeDirective, O = n.templateDirective, R = n.nonTlbTranscludeDirective, U = !1, V = !1, W = g.$$element = fd(e), $ = k, _ = h, ab = 0, bb = a.length; bb > ab; ab++) {
                        w = a[ab];
                        var db = w.$$start, eb = w.$$end;
                        if (db && (W = H(e, db, eb)), A = c, F > w.priority)break;
                        if ((E = w.scope) && (v = v || w, w.templateUrl || (S("new/isolated scope", M, w, W), t(E) && (M = w))), z = w.name, !w.templateUrl && w.controller && (E = w.controller, K = K || {}, S("'" + z + "' controller", K[z], w, W), K[z] = w), (E = w.transclude) && (U = !0, w.$$tlb || (S("transclusion", R, w, W), R = w), "element" == E ? (V = !0, F = w.priority, A = H(e, db, eb), W = g.$$element = fd(b.createComment(" " + z + ": " + g[z] + " ")), e = W[0], X(j, fd(N(A)), e), _ = C(A, h, F, $ && $.name, {nonTlbTranscludeDirective: R})) : (A = fd(mb(e)).contents(), W.html(""), _ = C(A, h))), w.template)if (S("template", O, w, W), O = w, E = y(w.template) ? w.template(W, g) : w.template, E = cb(E), w.replace) {
                            if ($ = w, A = fd("<div>" + pd(E) + "</div>").contents(), e = A[0], 1 != A.length || 1 !== e.nodeType)throw Kd("tplrt", "Template for directive '{0}' must have exactly one root element. {1}", z, "");
                            X(j, W, e);
                            var fb = {$attr: {}}, gb = G(e, [], fb), hb = a.splice(ab + 1, a.length - (ab + 1));
                            M && L(gb), a = a.concat(gb).concat(hb), P(g, fb), bb = a.length
                        } else W.html(E);
                        if (w.templateUrl)S("template", O, w, W), O = w, w.replace && ($ = w), q = Q(a.splice(ab, a.length - ab), W, g, j, _, l, m, {controllerDirectives: K, newIsolateScopeDirective: M, templateDirective: O, nonTlbTranscludeDirective: R}), bb = a.length; else if (w.compile)try {
                            B = w.compile(W, g, _), y(B) ? o(null, B, db, eb) : B && o(B.pre, B.post, db, eb)
                        } catch (ib) {
                            i(ib, T(W))
                        }
                        w.terminal && (q.terminal = !0, F = Math.max(F, w.priority))
                    }
                    return q.scope = v && v.scope === !0, q.transclude = U && _, q
                }

                function L(a) {
                    for (var b = 0, c = a.length; c > b; b++)a[b] = n(a[b], {$$isolateScope: !0})
                }

                function M(b, d, f, h, j, k, l) {
                    if (d === j)return null;
                    var m = null;
                    if (e.hasOwnProperty(d))for (var o, p = a.get(d + g), q = 0, r = p.length; r > q; q++)try {
                        o = p[q], (h === c || h > o.priority) && -1 != o.restrict.indexOf(f) && (k && (o = n(o, {$$start: k, $$end: l})), b.push(o), m = o)
                    } catch (s) {
                        i(s)
                    }
                    return m
                }

                function P(a, b) {
                    var c = b.$attr, d = a.$attr, e = a.$$element;
                    f(a, function (d, e) {
                        "$" != e.charAt(0) && (b[e] && (d += ("style" === e ? ";" : " ") + b[e]), a.$set(e, d, !0, c[e]))
                    }), f(b, function (b, f) {
                        "class" == f ? (D(e, b), a["class"] = (a["class"] ? a["class"] + " " : "") + b) : "style" == f ? (e.attr("style", e.attr("style") + ";" + b), a.style = (a.style ? a.style + ";" : "") + b) : "$" == f.charAt(0) || a.hasOwnProperty(f) || (a[f] = b, d[f] = c[f])
                    })
                }

                function Q(a, b, c, d, e, g, h, i) {
                    var j, k, n = [], p = b[0], q = a.shift(), r = l({}, q, {templateUrl: null, transclude: null, replace: null, $$originalDirective: q}), s = y(q.templateUrl) ? q.templateUrl(b, c) : q.templateUrl;
                    return b.html(""), m.get(z.getTrustedResourceUrl(s), {cache: o}).success(function (l) {
                        var m, o, u, v;
                        if (l = cb(l), q.replace) {
                            if (u = fd("<div>" + pd(l) + "</div>").contents(), m = u[0], 1 != u.length || 1 !== m.nodeType)throw Kd("tplrt", "Template for directive '{0}' must have exactly one root element. {1}", q.name, s);
                            o = {$attr: {}}, X(d, b, m);
                            var w = G(m, [], o);
                            t(q.scope) && L(w), a = w.concat(a), P(c, o)
                        } else m = p, b.html(l);
                        for (a.unshift(r), j = K(a, m, c, e, b, q, g, h, i), f(d, function (a, c) {
                            a == m && (d[c] = b[0])
                        }), k = E(b[0].childNodes, e); n.length;) {
                            var x = n.shift(), y = n.shift(), z = n.shift(), A = n.shift(), B = b[0];
                            y !== p && (B = mb(m), X(z, fd(y), B)), v = j.transclude ? F(x, j.transclude) : A, j(k, x, B, d, v)
                        }
                        n = null
                    }).error(function (a, b, c, d) {
                        throw Kd("tpload", "Failed to load template: {0}", d.url)
                    }), function (a, b, c, d, e) {
                        n ? (n.push(b), n.push(c), n.push(d), n.push(e)) : j(k, b, c, d, e)
                    }
                }

                function R(a, b) {
                    var c = b.priority - a.priority;
                    return 0 !== c ? c : a.name !== b.name ? a.name < b.name ? -1 : 1 : a.index - b.index
                }

                function S(a, b, c, d) {
                    if (b)throw Kd("multidir", "Multiple directives [{0}, {1}] asking for {2} on: {3}", b.name, c.name, a, T(d))
                }

                function U(a, b) {
                    var c = d(b, !0);
                    c && a.push({priority: 0, compile: q(function (a, b) {
                        var d = b.parent(), e = d.data("$binding") || [];
                        e.push(c), D(d.data("$binding", e), "ng-binding"), a.$watch(c, function (a) {
                            b[0].nodeValue = a
                        })
                    })})
                }

                function V(a, b) {
                    if ("srcdoc" == b)return z.HTML;
                    var c = id(a);
                    return"xlinkHref" == b || "FORM" == c && "action" == b || "IMG" != c && ("src" == b || "ngSrc" == b) ? z.RESOURCE_URL : void 0
                }

                function W(a, b, c, e) {
                    var f = d(c, !0);
                    if (f) {
                        if ("multiple" === e && "SELECT" === id(a))throw Kd("selmulti", "Binding to the 'multiple' attribute is not supported. Element: {0}", T(a));
                        b.push({priority: 100, compile: function () {
                            return{pre: function (b, c, g) {
                                var h = g.$$observers || (g.$$observers = {});
                                if (k.test(e))throw Kd("nodomevents", "Interpolations for HTML DOM event attributes are disallowed.  Please use the ng- versions (such as ng-click instead of onclick) instead.");
                                f = d(g[e], !0, V(a, e)), f && (g[e] = f(b), (h[e] || (h[e] = [])).$$inter = !0, (g.$$observers && g.$$observers[e].$$scope || b).$watch(f, function (a, b) {
                                    "class" === e && a != b ? g.$updateClass(a, b) : g.$set(e, a)
                                }))
                            }}
                        }})
                    }
                }

                function X(a, c, d) {
                    var e, f, g = c[0], h = c.length, i = g.parentNode;
                    if (a)for (e = 0, f = a.length; f > e; e++)if (a[e] == g) {
                        a[e++] = d;
                        for (var j = e, k = j + h - 1, l = a.length; l > j; j++, k++)l > k ? a[j] = a[k] : delete a[j];
                        a.length -= h - 1;
                        break
                    }
                    i && i.replaceChild(d, g);
                    var m = b.createDocumentFragment();
                    m.appendChild(g), d[fd.expando] = g[fd.expando];
                    for (var n = 1, o = c.length; o > n; n++) {
                        var p = c[n];
                        fd(p).remove(), m.appendChild(p), delete c[n]
                    }
                    c[0] = d, c.length = 1
                }

                function Y(a, b) {
                    return l(function () {
                        return a.apply(null, arguments)
                    }, a, b)
                }

                var Z = function (a, b) {
                    this.$$element = a, this.$attr = b || {}
                };
                Z.prototype = {$normalize: Kb, $addClass: function (a) {
                    a && a.length > 0 && A.addClass(this.$$element, a)
                }, $removeClass: function (a) {
                    a && a.length > 0 && A.removeClass(this.$$element, a)
                }, $updateClass: function (a, b) {
                    this.$removeClass(Lb(b, a)), this.$addClass(Lb(a, b))
                }, $set: function (a, b, d, e) {
                    var g, h = yb(this.$$element[0], a);
                    h && (this.$$element.prop(a, b), e = h), this[a] = b, e ? this.$attr[a] = e : (e = this.$attr[a], e || (this.$attr[a] = e = _(a, "-"))), g = id(this.$$element), ("A" === g && "href" === a || "IMG" === g && "src" === a) && (this[a] = b = B(b, "src" === a)), d !== !1 && (null === b || b === c ? this.$$element.removeAttr(e) : this.$$element.attr(e, b));
                    var j = this.$$observers;
                    j && f(j[a], function (a) {
                        try {
                            a(b)
                        } catch (c) {
                            i(c)
                        }
                    })
                }, $observe: function (a, b) {
                    var c = this, d = c.$$observers || (c.$$observers = {}), e = d[a] || (d[a] = []);
                    return e.push(b), v.$evalAsync(function () {
                        e.$$inter || b(c[a])
                    }), b
                }};
                var $ = d.startSymbol(), ab = d.endSymbol(), cb = "{{" == $ || "}}" == ab ? p : function (a) {
                    return a.replace(/\{\{/g, $).replace(/}}/g, ab)
                }, db = /^ngAttr[A-Z]/;
                return C
            }]
        }

        function Kb(a) {
            return jb(a.replace(Ld, ""))
        }

        function Lb(a, b) {
            var c = "", d = a.split(/\s+/), e = b.split(/\s+/);
            a:for (var f = 0; f < d.length; f++) {
                for (var g = d[f], h = 0; h < e.length; h++)if (g == e[h])continue a;
                c += (c.length > 0 ? " " : "") + g
            }
            return c
        }

        function Mb() {
            var a = {}, b = /^(\S+)(\s+as\s+(\w+))?$/;
            this.register = function (b, c) {
                db(b, "controller"), t(b) ? l(a, b) : a[b] = c
            }, this.$get = ["$injector", "$window", function (c, e) {
                return function (f, g) {
                    var h, i, j, k;
                    if (u(f) && (i = f.match(b), j = i[1], k = i[3], f = a.hasOwnProperty(j) ? a[j] : eb(g.$scope, j, !0) || eb(e, j, !0), cb(f, j, !0)), h = c.instantiate(f, g), k) {
                        if (!g || "object" != typeof g.$scope)throw d("$controller")("noscp", "Cannot export controller '{0}' as '{1}'! No $scope object provided via `locals`.", j || f.name, k);
                        g.$scope[k] = h
                    }
                    return h
                }
            }]
        }

        function Nb() {
            this.$get = ["$window", function (a) {
                return fd(a.document)
            }]
        }

        function Ob() {
            this.$get = ["$log", function (a) {
                return function () {
                    a.error.apply(a, arguments)
                }
            }]
        }

        function Pb(a) {
            var b, c, d, e = {};
            return a ? (f(a.split("\n"), function (a) {
                d = a.indexOf(":"), b = ad(pd(a.substr(0, d))), c = pd(a.substr(d + 1)), b && (e[b] ? e[b] += ", " + c : e[b] = c)
            }), e) : e
        }

        function Qb(a) {
            var b = t(a) ? a : c;
            return function (c) {
                return b || (b = Pb(a)), c ? b[ad(c)] || null : b
            }
        }

        function Rb(a, b, c) {
            return y(c) ? c(a, b) : (f(c, function (c) {
                a = c(a, b)
            }), a)
        }

        function Sb(a) {
            return a >= 200 && 300 > a
        }

        function Tb() {
            var a = /^\s*(\[|\{[^\{])/, b = /[\}\]]\s*$/, d = /^\)\]\}',?\n/, e = {"Content-Type": "application/json;charset=utf-8"}, g = this.defaults = {transformResponse: [function (c) {
                return u(c) && (c = c.replace(d, ""), a.test(c) && b.test(c) && (c = R(c))), c
            }], transformRequest: [function (a) {
                return t(a) && !C(a) ? Q(a) : a
            }], headers: {common: {Accept: "application/json, text/plain, */*"}, post: e, put: e, patch: e}, xsrfCookieName: "XSRF-TOKEN", xsrfHeaderName: "X-XSRF-TOKEN"}, i = this.interceptors = [], j = this.responseInterceptors = [];
            this.$get = ["$httpBackend", "$browser", "$cacheFactory", "$rootScope", "$q", "$injector", function (a, b, d, e, k, m) {
                function n(a) {
                    function d(a) {
                        var b = l({}, a, {data: Rb(a.data, a.headers, h.transformResponse)});
                        return Sb(a.status) ? b : k.reject(b)
                    }

                    function e(a) {
                        function b(a) {
                            var b;
                            f(a, function (c, d) {
                                y(c) && (b = c(), null != b ? a[d] = b : delete a[d])
                            })
                        }

                        var c, d, e, h = g.headers, i = l({}, a.headers);
                        h = l({}, h.common, h[ad(a.method)]), b(h), b(i);
                        a:for (c in h) {
                            d = ad(c);
                            for (e in i)if (ad(e) === d)continue a;
                            i[c] = h[c]
                        }
                        return i
                    }

                    var h = {transformRequest: g.transformRequest, transformResponse: g.transformResponse}, i = e(a);
                    l(h, a), h.headers = i, h.method = bd(h.method);
                    var j = Dc(h.url) ? b.cookies()[h.xsrfCookieName || g.xsrfCookieName] : c;
                    j && (i[h.xsrfHeaderName || g.xsrfHeaderName] = j);
                    var m = function (a) {
                        i = a.headers;
                        var b = Rb(a.data, Qb(i), a.transformRequest);
                        return r(a.data) && f(i, function (a, b) {
                            "content-type" === ad(b) && delete i[b]
                        }), r(a.withCredentials) && !r(g.withCredentials) && (a.withCredentials = g.withCredentials), q(a, b, i).then(d, d)
                    }, n = [m, c], o = k.when(h);
                    for (f(z, function (a) {
                        (a.request || a.requestError) && n.unshift(a.request, a.requestError), (a.response || a.responseError) && n.push(a.response, a.responseError)
                    }); n.length;) {
                        var p = n.shift(), s = n.shift();
                        o = o.then(p, s)
                    }
                    return o.success = function (a) {
                        return o.then(function (b) {
                            a(b.data, b.status, b.headers, h)
                        }), o
                    }, o.error = function (a) {
                        return o.then(null, function (b) {
                            a(b.data, b.status, b.headers, h)
                        }), o
                    }, o
                }

                function o() {
                    f(arguments, function (a) {
                        n[a] = function (b, c) {
                            return n(l(c || {}, {method: a, url: b}))
                        }
                    })
                }

                function p() {
                    f(arguments, function (a) {
                        n[a] = function (b, c, d) {
                            return n(l(d || {}, {method: a, url: b, data: c}))
                        }
                    })
                }

                function q(b, c, d) {
                    function f(a, b, c) {
                        j && (Sb(a) ? j.put(p, [a, b, Pb(c)]) : j.remove(p)), h(b, a, c), e.$$phase || e.$apply()
                    }

                    function h(a, c, d) {
                        c = Math.max(c, 0), (Sb(c) ? m.resolve : m.reject)({data: a, status: c, headers: Qb(d), config: b})
                    }

                    function i() {
                        var a = G(n.pendingRequests, b);
                        -1 !== a && n.pendingRequests.splice(a, 1)
                    }

                    var j, l, m = k.defer(), o = m.promise, p = v(b.url, b.params);
                    if (n.pendingRequests.push(b), o.then(i, i), (b.cache || g.cache) && b.cache !== !1 && "GET" == b.method && (j = t(b.cache) ? b.cache : t(g.cache) ? g.cache : w), j)if (l = j.get(p), s(l)) {
                        if (l.then)return l.then(i, i), l;
                        x(l) ? h(l[1], l[0], I(l[2])) : h(l, 200, {})
                    } else j.put(p, o);
                    return r(l) && a(b.method, p, c, f, d, b.timeout, b.withCredentials, b.responseType), o
                }

                function v(a, b) {
                    if (!b)return a;
                    var c = [];
                    return h(b, function (a, b) {
                        null === a || r(a) || (x(a) || (a = [a]), f(a, function (a) {
                            t(a) && (a = Q(a)), c.push(Y(b) + "=" + Y(a))
                        }))
                    }), a + (-1 == a.indexOf("?") ? "?" : "&") + c.join("&")
                }

                var w = d("$http"), z = [];
                return f(i, function (a) {
                    z.unshift(u(a) ? m.get(a) : m.invoke(a))
                }), f(j, function (a, b) {
                    var c = u(a) ? m.get(a) : m.invoke(a);
                    z.splice(b, 0, {response: function (a) {
                        return c(k.when(a))
                    }, responseError: function (a) {
                        return c(k.reject(a))
                    }})
                }), n.pendingRequests = [], o("get", "delete", "head", "jsonp"), p("post", "put"), n.defaults = g, n
            }]
        }

        function Ub() {
            this.$get = ["$browser", "$window", "$document", function (a, b, c) {
                return Vb(a, Md, a.defer, b.angular.callbacks, c[0])
            }]
        }

        function Vb(a, b, c, d, e) {
            function g(a, b) {
                var c = e.createElement("script"), d = function () {
                    c.onreadystatechange = c.onload = c.onerror = null, e.body.removeChild(c), b && b()
                };
                return c.type = "text/javascript", c.src = a, ed && 8 >= ed ? c.onreadystatechange = function () {
                    /loaded|complete/.test(c.readyState) && d()
                } : c.onload = c.onerror = function () {
                    d()
                }, e.body.appendChild(c), d
            }

            var h = -1;
            return function (e, i, j, k, l, m, n, p) {
                function q() {
                    t = h, v && v(), w && w.abort()
                }

                function r(b, d, e, f) {
                    var g = Cc(i).protocol;
                    x && c.cancel(x), v = w = null, d = "file" == g && 0 === d ? e ? 200 : 404 : d, d = 1223 == d ? 204 : d, b(d, e, f), a.$$completeOutstandingRequest(o)
                }

                var t;
                if (a.$$incOutstandingRequestCount(), i = i || a.url(), "jsonp" == ad(e)) {
                    var u = "_" + (d.counter++).toString(36);
                    d[u] = function (a) {
                        d[u].data = a
                    };
                    var v = g(i.replace("JSON_CALLBACK", "angular.callbacks." + u), function () {
                        d[u].data ? r(k, 200, d[u].data) : r(k, t || -2), delete d[u]
                    })
                } else {
                    var w = new b;
                    w.open(e, i, !0), f(l, function (a, b) {
                        s(a) && w.setRequestHeader(b, a)
                    }), w.onreadystatechange = function () {
                        if (4 == w.readyState) {
                            var a = null, b = null;
                            t !== h && (a = w.getAllResponseHeaders(), b = w.responseType ? w.response : w.responseText), r(k, t || w.status, b, a)
                        }
                    }, n && (w.withCredentials = !0), p && (w.responseType = p), w.send(j || null)
                }
                if (m > 0)var x = c(q, m); else m && m.then && m.then(q)
            }
        }

        function Wb() {
            var a = "{{", b = "}}";
            this.startSymbol = function (b) {
                return b ? (a = b, this) : a
            }, this.endSymbol = function (a) {
                return a ? (b = a, this) : b
            }, this.$get = ["$parse", "$exceptionHandler", "$sce", function (c, d, e) {
                function f(f, i, j) {
                    for (var k, l, m, n, o = 0, p = [], q = f.length, s = !1, t = []; q > o;)-1 != (k = f.indexOf(a, o)) && -1 != (l = f.indexOf(b, k + g)) ? (o != k && p.push(f.substring(o, k)), p.push(m = c(n = f.substring(k + g, l))), m.exp = n, o = l + h, s = !0) : (o != q && p.push(f.substring(o)), o = q);
                    if ((q = p.length) || (p.push(""), q = 1), j && p.length > 1)throw Nd("noconcat", "Error while interpolating: {0}\nStrict Contextual Escaping disallows interpolations that concatenate multiple expressions when a trusted value is required.  See http://docs.angularjs.org/api/ng.$sce", f);
                    return!i || s ? (t.length = q, m = function (a) {
                        try {
                            for (var b, c = 0, g = q; g > c; c++)"function" == typeof(b = p[c]) && (b = b(a), b = j ? e.getTrusted(j, b) : e.valueOf(b), null === b || r(b) ? b = "" : "string" != typeof b && (b = Q(b))), t[c] = b;
                            return t.join("")
                        } catch (h) {
                            var i = Nd("interr", "Can't interpolate: {0}\n{1}", f, h.toString());
                            d(i)
                        }
                    }, m.exp = f, m.parts = p, m) : void 0
                }

                var g = a.length, h = b.length;
                return f.startSymbol = function () {
                    return a
                }, f.endSymbol = function () {
                    return b
                }, f
            }]
        }

        function Xb() {
            this.$get = ["$rootScope", "$window", "$q", function (a, b, c) {
                function d(d, f, g, h) {
                    var i = b.setInterval, j = b.clearInterval, k = c.defer(), l = k.promise, m = 0, n = s(h) && !h;
                    return g = s(g) ? g : 0, l.then(null, null, d), l.$$intervalId = i(function () {
                        k.notify(m++), g > 0 && m >= g && (k.resolve(m), j(l.$$intervalId), delete e[l.$$intervalId]), n || a.$apply()
                    }, f), e[l.$$intervalId] = k, l
                }

                var e = {};
                return d.cancel = function (a) {
                    return a && a.$$intervalId in e ? (e[a.$$intervalId].reject("canceled"), clearInterval(a.$$intervalId), delete e[a.$$intervalId], !0) : !1
                }, d
            }]
        }

        function Yb() {
            this.$get = function () {
                return{id: "en-us", NUMBER_FORMATS: {DECIMAL_SEP: ".", GROUP_SEP: ",", PATTERNS: [
                    {minInt: 1, minFrac: 0, maxFrac: 3, posPre: "", posSuf: "", negPre: "-", negSuf: "", gSize: 3, lgSize: 3},
                    {minInt: 1, minFrac: 2, maxFrac: 2, posPre: "¤", posSuf: "", negPre: "(¤", negSuf: ")", gSize: 3, lgSize: 3}
                ], CURRENCY_SYM: "$"}, DATETIME_FORMATS: {MONTH: "January,February,March,April,May,June,July,August,September,October,November,December".split(","), SHORTMONTH: "Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec".split(","), DAY: "Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday".split(","), SHORTDAY: "Sun,Mon,Tue,Wed,Thu,Fri,Sat".split(","), AMPMS: ["AM", "PM"], medium: "MMM d, y h:mm:ss a", "short": "M/d/yy h:mm a", fullDate: "EEEE, MMMM d, y", longDate: "MMMM d, y", mediumDate: "MMM d, y", shortDate: "M/d/yy", mediumTime: "h:mm:ss a", shortTime: "h:mm a"}, pluralCat: function (a) {
                    return 1 === a ? "one" : "other"
                }}
            }
        }

        function Zb(a) {
            for (var b = a.split("/"), c = b.length; c--;)b[c] = X(b[c]);
            return b.join("/")
        }

        function $b(a, b, c) {
            var d = Cc(a, c);
            b.$$protocol = d.protocol, b.$$host = d.hostname, b.$$port = m(d.port) || Pd[d.protocol] || null
        }

        function _b(a, b, c) {
            var d = "/" !== a.charAt(0);
            d && (a = "/" + a);
            var e = Cc(a, c);
            b.$$path = decodeURIComponent(d && "/" === e.pathname.charAt(0) ? e.pathname.substring(1) : e.pathname), b.$$search = V(e.search), b.$$hash = decodeURIComponent(e.hash), b.$$path && "/" != b.$$path.charAt(0) && (b.$$path = "/" + b.$$path)
        }

        function ac(a, b) {
            return 0 === b.indexOf(a) ? b.substr(a.length) : void 0
        }

        function bc(a) {
            var b = a.indexOf("#");
            return-1 == b ? a : a.substr(0, b)
        }

        function cc(a) {
            return a.substr(0, bc(a).lastIndexOf("/") + 1)
        }

        function dc(a) {
            return a.substring(0, a.indexOf("/", a.indexOf("//") + 2))
        }

        function ec(a, b) {
            this.$$html5 = !0, b = b || "";
            var d = cc(a);
            $b(a, this, a), this.$$parse = function (b) {
                var c = ac(d, b);
                if (!u(c))throw Qd("ipthprfx", 'Invalid url "{0}", missing path prefix "{1}".', b, d);
                _b(c, this, a), this.$$path || (this.$$path = "/"), this.$$compose()
            }, this.$$compose = function () {
                var a = W(this.$$search), b = this.$$hash ? "#" + X(this.$$hash) : "";
                this.$$url = Zb(this.$$path) + (a ? "?" + a : "") + b, this.$$absUrl = d + this.$$url.substr(1)
            }, this.$$rewrite = function (e) {
                var f, g;
                return(f = ac(a, e)) !== c ? (g = f, (f = ac(b, f)) !== c ? d + (ac("/", f) || f) : a + g) : (f = ac(d, e)) !== c ? d + f : d == e + "/" ? d : void 0
            }
        }

        function fc(a, b) {
            var c = cc(a);
            $b(a, this, a), this.$$parse = function (d) {
                function e(a, b, c) {
                    var d, e = /^\/?.*?:(\/.*)/;
                    return 0 === b.indexOf(c) && (b = b.replace(c, "")), e.exec(b) ? a : (d = e.exec(a), d ? d[1] : a)
                }

                var f = ac(a, d) || ac(c, d), g = "#" == f.charAt(0) ? ac(b, f) : this.$$html5 ? f : "";
                if (!u(g))throw Qd("ihshprfx", 'Invalid url "{0}", missing hash prefix "{1}".', d, b);
                _b(g, this, a), this.$$path = e(this.$$path, g, a), this.$$compose()
            }, this.$$compose = function () {
                var c = W(this.$$search), d = this.$$hash ? "#" + X(this.$$hash) : "";
                this.$$url = Zb(this.$$path) + (c ? "?" + c : "") + d, this.$$absUrl = a + (this.$$url ? b + this.$$url : "")
            }, this.$$rewrite = function (b) {
                return bc(a) == bc(b) ? b : void 0
            }
        }

        function gc(a, b) {
            this.$$html5 = !0, fc.apply(this, arguments);
            var c = cc(a);
            this.$$rewrite = function (d) {
                var e;
                return a == bc(d) ? d : (e = ac(c, d)) ? a + b + e : c === d + "/" ? c : void 0
            }
        }

        function hc(a) {
            return function () {
                return this[a]
            }
        }

        function ic(a, b) {
            return function (c) {
                return r(c) ? this[a] : (this[a] = b(c), this.$$compose(), this)
            }
        }

        function jc() {
            var b = "", c = !1;
            this.hashPrefix = function (a) {
                return s(a) ? (b = a, this) : b
            }, this.html5Mode = function (a) {
                return s(a) ? (c = a, this) : c
            }, this.$get = ["$rootScope", "$browser", "$sniffer", "$rootElement", function (d, e, f, g) {
                function h(a) {
                    d.$broadcast("$locationChangeSuccess", i.absUrl(), a)
                }

                var i, j, k, l = e.baseHref(), m = e.url();
                c ? (k = dc(m) + (l || "/"), j = f.history ? ec : gc) : (k = bc(m), j = fc), i = new j(k, "#" + b), i.$$parse(i.$$rewrite(m)), g.on("click", function (b) {
                    if (!b.ctrlKey && !b.metaKey && 2 != b.which) {
                        for (var c = fd(b.target); "a" !== ad(c[0].nodeName);)if (c[0] === g[0] || !(c = c.parent())[0])return;
                        var f = c.prop("href"), h = i.$$rewrite(f);
                        f && !c.attr("target") && h && !b.isDefaultPrevented() && (b.preventDefault(), h != e.url() && (i.$$parse(h), d.$apply(), a.angular["ff-684208-preventDefault"] = !0))
                    }
                }), i.absUrl() != m && e.url(i.absUrl(), !0), e.onUrlChange(function (a) {
                    if (i.absUrl() != a) {
                        if (d.$broadcast("$locationChangeStart", a, i.absUrl()).defaultPrevented)return void e.url(i.absUrl());
                        d.$evalAsync(function () {
                            var b = i.absUrl();
                            i.$$parse(a), h(b)
                        }), d.$$phase || d.$digest()
                    }
                });
                var n = 0;
                return d.$watch(function () {
                    var a = e.url(), b = i.$$replace;
                    return n && a == i.absUrl() || (n++, d.$evalAsync(function () {
                        d.$broadcast("$locationChangeStart", i.absUrl(), a).defaultPrevented ? i.$$parse(a) : (e.url(i.absUrl(), b), h(a))
                    })), i.$$replace = !1, n
                }), i
            }]
        }

        function kc() {
            var a = !0, b = this;
            this.debugEnabled = function (b) {
                return s(b) ? (a = b, this) : a
            }, this.$get = ["$window", function (c) {
                function d(a) {
                    return a instanceof Error && (a.stack ? a = a.message && -1 === a.stack.indexOf(a.message) ? "Error: " + a.message + "\n" + a.stack : a.stack : a.sourceURL && (a = a.message + "\n" + a.sourceURL + ":" + a.line)), a
                }

                function e(a) {
                    var b = c.console || {}, e = b[a] || b.log || o;
                    return e.apply ? function () {
                        var a = [];
                        return f(arguments, function (b) {
                            a.push(d(b))
                        }), e.apply(b, a)
                    } : function (a, b) {
                        e(a, null == b ? "" : b)
                    }
                }

                return{log: e("log"), info: e("info"), warn: e("warn"), error: e("error"), debug: function () {
                    var c = e("debug");
                    return function () {
                        a && c.apply(b, arguments)
                    }
                }()}
            }]
        }

        function lc(a, b) {
            if ("constructor" === a)throw Sd("isecfld", 'Referencing "constructor" field in Angular expressions is disallowed! Expression: {0}', b);
            return a
        }

        function mc(a, b) {
            if (a && a.constructor === a)throw Sd("isecfn", "Referencing Function in Angular expressions is disallowed! Expression: {0}", b);
            if (a && a.document && a.location && a.alert && a.setInterval)throw Sd("isecwindow", "Referencing the Window in Angular expressions is disallowed! Expression: {0}", b);
            if (a && (a.nodeName || a.on && a.find))throw Sd("isecdom", "Referencing DOM nodes in Angular expressions is disallowed! Expression: {0}", b);
            return a
        }

        function nc(a, b, d, e, f) {
            f = f || {};
            for (var g, h = b.split("."), i = 0; h.length > 1; i++) {
                g = lc(h.shift(), e);
                var j = a[g];
                j || (j = {}, a[g] = j), a = j, a.then && f.unwrapPromises && (Rd(e), "$$v"in a || !function (a) {
                    a.then(function (b) {
                        a.$$v = b
                    })
                }(a), a.$$v === c && (a.$$v = {}), a = a.$$v)
            }
            return g = lc(h.shift(), e), a[g] = d, d
        }

        function oc(a, b, d, e, f, g, h) {
            return lc(a, g), lc(b, g), lc(d, g), lc(e, g), lc(f, g), h.unwrapPromises ? function (h, i) {
                var j, k = i && i.hasOwnProperty(a) ? i : h;
                return null === k || k === c ? k : (k = k[a], k && k.then && (Rd(g), "$$v"in k || (j = k, j.$$v = c, j.then(function (a) {
                    j.$$v = a
                })), k = k.$$v), b && null !== k && k !== c ? (k = k[b], k && k.then && (Rd(g), "$$v"in k || (j = k, j.$$v = c, j.then(function (a) {
                    j.$$v = a
                })), k = k.$$v), d && null !== k && k !== c ? (k = k[d], k && k.then && (Rd(g), "$$v"in k || (j = k, j.$$v = c, j.then(function (a) {
                    j.$$v = a
                })), k = k.$$v), e && null !== k && k !== c ? (k = k[e], k && k.then && (Rd(g), "$$v"in k || (j = k, j.$$v = c, j.then(function (a) {
                    j.$$v = a
                })), k = k.$$v), f && null !== k && k !== c ? (k = k[f], k && k.then && (Rd(g), "$$v"in k || (j = k, j.$$v = c, j.then(function (a) {
                    j.$$v = a
                })), k = k.$$v), k) : k) : k) : k) : k)
            } : function (g, h) {
                var i = h && h.hasOwnProperty(a) ? h : g;
                return null === i || i === c ? i : (i = i[a], b && null !== i && i !== c ? (i = i[b], d && null !== i && i !== c ? (i = i[d], e && null !== i && i !== c ? (i = i[e], f && null !== i && i !== c ? i = i[f] : i) : i) : i) : i)
            }
        }

        function pc(a, b, d) {
            if (Yd.hasOwnProperty(a))return Yd[a];
            var e, g = a.split("."), h = g.length;
            if (b.csp)e = 6 > h ? oc(g[0], g[1], g[2], g[3], g[4], d, b) : function (a, e) {
                var f, i = 0;
                do f = oc(g[i++], g[i++], g[i++], g[i++], g[i++], d, b)(a, e), e = c, a = f; while (h > i);
                return f
            }; else {
                var i = "var l, fn, p;\n";
                f(g, function (a, c) {
                    lc(a, d), i += "if(s === null || s === undefined) return s;\nl=s;\ns=" + (c ? "s" : '((k&&k.hasOwnProperty("' + a + '"))?k:s)') + '["' + a + '"];\n' + (b.unwrapPromises ? 'if (s && s.then) {\n pw("' + d.replace(/(["\r\n])/g, "\\$1") + '");\n if (!("$$v" in s)) {\n p=s;\n p.$$v = undefined;\n p.then(function(v) {p.$$v=v;});\n}\n s=s.$$v\n}\n' : "")
                }), i += "return s;";
                var j = new Function("s", "k", "pw", i);
                j.toString = function () {
                    return i
                }, e = function (a, b) {
                    return j(a, b, Rd)
                }
            }
            return"hasOwnProperty" !== a && (Yd[a] = e), e
        }

        function qc() {
            var a = {}, b = {csp: !1, unwrapPromises: !1, logPromiseWarnings: !0};
            this.unwrapPromises = function (a) {
                return s(a) ? (b.unwrapPromises = !!a, this) : b.unwrapPromises
            }, this.logPromiseWarnings = function (a) {
                return s(a) ? (b.logPromiseWarnings = a, this) : b.logPromiseWarnings
            }, this.$get = ["$filter", "$sniffer", "$log", function (c, d, e) {
                return b.csp = d.csp, Rd = function (a) {
                    b.logPromiseWarnings && !Td.hasOwnProperty(a) && (Td[a] = !0, e.warn("[$parse] Promise found in the expression `" + a + "`. Automatic unwrapping of promises in Angular expressions is deprecated."))
                }, function (d) {
                    var e;
                    switch (typeof d) {
                        case"string":
                            if (a.hasOwnProperty(d))return a[d];
                            var f = new Wd(b), g = new Xd(f, c, b);
                            return e = g.parse(d, !1), "hasOwnProperty" !== d && (a[d] = e), e;
                        case"function":
                            return d;
                        default:
                            return o
                    }
                }
            }]
        }

        function rc() {
            this.$get = ["$rootScope", "$exceptionHandler", function (a, b) {
                return sc(function (b) {
                    a.$evalAsync(b)
                }, b)
            }]
        }

        function sc(a, b) {
            function d(a) {
                return a
            }

            function e(a) {
                return j(a)
            }

            function g(a) {
                var b = h(), c = 0, d = x(a) ? [] : {};
                return f(a, function (a, e) {
                    c++, i(a).then(function (a) {
                        d.hasOwnProperty(e) || (d[e] = a, --c || b.resolve(d))
                    }, function (a) {
                        d.hasOwnProperty(e) || b.reject(a)
                    })
                }), 0 === c && b.resolve(d), b.promise
            }

            var h = function () {
                var f, g, k = [];
                return g = {resolve: function (b) {
                    if (k) {
                        var d = k;
                        k = c, f = i(b), d.length && a(function () {
                            for (var a, b = 0, c = d.length; c > b; b++)a = d[b], f.then(a[0], a[1], a[2])
                        })
                    }
                }, reject: function (a) {
                    g.resolve(j(a))
                }, notify: function (b) {
                    if (k) {
                        var c = k;
                        k.length && a(function () {
                            for (var a, d = 0, e = c.length; e > d; d++)a = c[d], a[2](b)
                        })
                    }
                }, promise: {then: function (a, c, g) {
                    var i = h(), j = function (c) {
                        try {
                            i.resolve((y(a) ? a : d)(c))
                        } catch (e) {
                            i.reject(e), b(e)
                        }
                    }, l = function (a) {
                        try {
                            i.resolve((y(c) ? c : e)(a))
                        } catch (d) {
                            i.reject(d), b(d)
                        }
                    }, m = function (a) {
                        try {
                            i.notify((y(g) ? g : d)(a))
                        } catch (c) {
                            b(c)
                        }
                    };
                    return k ? k.push([j, l, m]) : f.then(j, l, m), i.promise
                }, "catch": function (a) {
                    return this.then(null, a)
                }, "finally": function (a) {
                    function b(a, b) {
                        var c = h();
                        return b ? c.resolve(a) : c.reject(a), c.promise
                    }

                    function c(c, e) {
                        var f = null;
                        try {
                            f = (a || d)()
                        } catch (g) {
                            return b(g, !1)
                        }
                        return f && y(f.then) ? f.then(function () {
                            return b(c, e)
                        }, function (a) {
                            return b(a, !1)
                        }) : b(c, e)
                    }

                    return this.then(function (a) {
                        return c(a, !0)
                    }, function (a) {
                        return c(a, !1)
                    })
                }}}
            }, i = function (b) {
                return b && y(b.then) ? b : {then: function (c) {
                    var d = h();
                    return a(function () {
                        d.resolve(c(b))
                    }), d.promise
                }}
            }, j = function (c) {
                return{then: function (d, f) {
                    var g = h();
                    return a(function () {
                        try {
                            g.resolve((y(f) ? f : e)(c))
                        } catch (a) {
                            g.reject(a), b(a)
                        }
                    }), g.promise
                }}
            }, k = function (c, f, g, k) {
                var l, m = h(), n = function (a) {
                    try {
                        return(y(f) ? f : d)(a)
                    } catch (c) {
                        return b(c), j(c)
                    }
                }, o = function (a) {
                    try {
                        return(y(g) ? g : e)(a)
                    } catch (c) {
                        return b(c), j(c)
                    }
                }, p = function (a) {
                    try {
                        return(y(k) ? k : d)(a)
                    } catch (c) {
                        b(c)
                    }
                };
                return a(function () {
                    i(c).then(function (a) {
                        l || (l = !0, m.resolve(i(a).then(n, o, p)))
                    }, function (a) {
                        l || (l = !0, m.resolve(o(a)))
                    }, function (a) {
                        l || m.notify(p(a))
                    })
                }), m.promise
            };
            return{defer: h, reject: j, when: k, all: g}
        }

        function tc() {
            var a = 10, b = d("$rootScope");
            this.digestTtl = function (b) {
                return arguments.length && (a = b), a
            }, this.$get = ["$injector", "$exceptionHandler", "$parse", "$browser", function (c, d, f, g) {
                function h() {
                    this.$id = j(), this.$$phase = this.$parent = this.$$watchers = this.$$nextSibling = this.$$prevSibling = this.$$childHead = this.$$childTail = null, this["this"] = this.$root = this, this.$$destroyed = !1, this.$$asyncQueue = [], this.$$postDigestQueue = [], this.$$listeners = {}, this.$$isolateBindings = {}
                }

                function i(a) {
                    if (n.$$phase)throw b("inprog", "{0} already in progress", n.$$phase);
                    n.$$phase = a
                }

                function k() {
                    n.$$phase = null
                }

                function l(a, b) {
                    var c = f(a);
                    return cb(c, b), c
                }

                function m() {
                }

                h.prototype = {constructor: h, $new: function (a) {
                    var b, c;
                    return a ? (c = new h, c.$root = this.$root, c.$$asyncQueue = this.$$asyncQueue, c.$$postDigestQueue = this.$$postDigestQueue) : (b = function () {
                    }, b.prototype = this, c = new b, c.$id = j()), c["this"] = c, c.$$listeners = {}, c.$parent = this, c.$$watchers = c.$$nextSibling = c.$$childHead = c.$$childTail = null, c.$$prevSibling = this.$$childTail, this.$$childHead ? (this.$$childTail.$$nextSibling = c, this.$$childTail = c) : this.$$childHead = this.$$childTail = c, c
                }, $watch: function (a, b, c) {
                    var d = this, e = l(a, "watch"), f = d.$$watchers, g = {fn: b, last: m, get: e, exp: a, eq: !!c};
                    if (!y(b)) {
                        var h = l(b || o, "listener");
                        g.fn = function (a, b, c) {
                            h(c)
                        }
                    }
                    if ("string" == typeof a && e.constant) {
                        var i = g.fn;
                        g.fn = function (a, b, c) {
                            i.call(this, a, b, c), H(f, g)
                        }
                    }
                    return f || (f = d.$$watchers = []), f.unshift(g), function () {
                        H(f, g)
                    }
                }, $watchCollection: function (a, b) {
                    function c() {
                        h = k(i);
                        var a, b;
                        if (t(h))if (e(h)) {
                            g !== l && (g = l, n = g.length = 0, j++), a = h.length, n !== a && (j++, g.length = n = a);
                            for (var c = 0; a > c; c++)g[c] !== h[c] && (j++, g[c] = h[c])
                        } else {
                            g !== m && (g = m = {}, n = 0, j++), a = 0;
                            for (b in h)h.hasOwnProperty(b) && (a++, g.hasOwnProperty(b) ? g[b] !== h[b] && (j++, g[b] = h[b]) : (n++, g[b] = h[b], j++));
                            if (n > a) {
                                j++;
                                for (b in g)g.hasOwnProperty(b) && !h.hasOwnProperty(b) && (n--, delete g[b])
                            }
                        } else g !== h && (g = h, j++);
                        return j
                    }

                    function d() {
                        b(h, g, i)
                    }

                    var g, h, i = this, j = 0, k = f(a), l = [], m = {}, n = 0;
                    return this.$watch(c, d)
                }, $digest: function () {
                    var c, e, f, g, h, j, l, n, o, p, q, r = this.$$asyncQueue, s = this.$$postDigestQueue, t = a, u = this, v = [];
                    i("$digest");
                    do {
                        for (j = !1, n = u; r.length;)try {
                            q = r.shift(), q.scope.$eval(q.expression)
                        } catch (w) {
                            d(w)
                        }
                        do {
                            if (g = n.$$watchers)for (h = g.length; h--;)try {
                                c = g[h], c && (e = c.get(n)) !== (f = c.last) && !(c.eq ? K(e, f) : "number" == typeof e && "number" == typeof f && isNaN(e) && isNaN(f)) && (j = !0, c.last = c.eq ? I(e) : e, c.fn(e, f === m ? e : f, n), 5 > t && (o = 4 - t, v[o] || (v[o] = []), p = y(c.exp) ? "fn: " + (c.exp.name || c.exp.toString()) : c.exp, p += "; newVal: " + Q(e) + "; oldVal: " + Q(f), v[o].push(p)))
                            } catch (w) {
                                d(w)
                            }
                            if (!(l = n.$$childHead || n !== u && n.$$nextSibling))for (; n !== u && !(l = n.$$nextSibling);)n = n.$parent
                        } while (n = l);
                        if (j && !t--)throw k(), b("infdig", "{0} $digest() iterations reached. Aborting!\nWatchers fired in the last 5 iterations: {1}", a, Q(v))
                    } while (j || r.length);
                    for (k(); s.length;)try {
                        s.shift()()
                    } catch (w) {
                        d(w)
                    }
                }, $destroy: function () {
                    if (n != this && !this.$$destroyed) {
                        var a = this.$parent;
                        this.$broadcast("$destroy"), this.$$destroyed = !0, a.$$childHead == this && (a.$$childHead = this.$$nextSibling), a.$$childTail == this && (a.$$childTail = this.$$prevSibling), this.$$prevSibling && (this.$$prevSibling.$$nextSibling = this.$$nextSibling), this.$$nextSibling && (this.$$nextSibling.$$prevSibling = this.$$prevSibling), this.$parent = this.$$nextSibling = this.$$prevSibling = this.$$childHead = this.$$childTail = null
                    }
                }, $eval: function (a, b) {
                    return f(a)(this, b)
                }, $evalAsync: function (a) {
                    n.$$phase || n.$$asyncQueue.length || g.defer(function () {
                        n.$$asyncQueue.length && n.$digest()
                    }), this.$$asyncQueue.push({scope: this, expression: a})
                }, $$postDigest: function (a) {
                    this.$$postDigestQueue.push(a)
                }, $apply: function (a) {
                    try {
                        return i("$apply"), this.$eval(a)
                    } catch (b) {
                        d(b)
                    } finally {
                        k();
                        try {
                            n.$digest()
                        } catch (b) {
                            throw d(b), b
                        }
                    }
                }, $on: function (a, b) {
                    var c = this.$$listeners[a];
                    return c || (this.$$listeners[a] = c = []), c.push(b), function () {
                        c[G(c, b)] = null
                    }
                }, $emit: function (a) {
                    var b, c, e, f = [], g = this, h = !1, i = {name: a, targetScope: g, stopPropagation: function () {
                        h = !0
                    }, preventDefault: function () {
                        i.defaultPrevented = !0
                    }, defaultPrevented: !1}, j = M([i], arguments, 1);
                    do {
                        for (b = g.$$listeners[a] || f, i.currentScope = g, c = 0, e = b.length; e > c; c++)if (b[c])try {
                            b[c].apply(null, j)
                        } catch (k) {
                            d(k)
                        } else b.splice(c, 1), c--, e--;
                        if (h)return i;
                        g = g.$parent
                    } while (g);
                    return i
                }, $broadcast: function (a) {
                    var b, c, e, f = this, g = f, h = f, i = {name: a, targetScope: f, preventDefault: function () {
                        i.defaultPrevented = !0
                    }, defaultPrevented: !1}, j = M([i], arguments, 1);
                    do {
                        for (g = h, i.currentScope = g, b = g.$$listeners[a] || [], c = 0, e = b.length; e > c; c++)if (b[c])try {
                            b[c].apply(null, j)
                        } catch (k) {
                            d(k)
                        } else b.splice(c, 1), c--, e--;
                        if (!(h = g.$$childHead || g !== f && g.$$nextSibling))for (; g !== f && !(h = g.$$nextSibling);)g = g.$parent
                    } while (g = h);
                    return i
                }};
                var n = new h;
                return n
            }]
        }

        function uc() {
            var a = /^\s*(https?|ftp|mailto|tel|file):/, b = /^\s*(https?|ftp|file):|data:image\//;
            this.aHrefSanitizationWhitelist = function (b) {
                return s(b) ? (a = b, this) : a
            }, this.imgSrcSanitizationWhitelist = function (a) {
                return s(a) ? (b = a, this) : b
            }, this.$get = function () {
                return function (c, d) {
                    var e, f = d ? b : a;
                    return ed && !(ed >= 8) || (e = Cc(c).href, "" === e || e.match(f)) ? c : "unsafe:" + e
                }
            }
        }

        function vc(a) {
            return a.replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, "\\$1").replace(/\x08/g, "\\x08")
        }

        function wc(a) {
            if ("self" === a)return a;
            if (u(a)) {
                if (a.indexOf("***") > -1)throw Zd("iwcard", "Illegal sequence *** in string matcher.  String: {0}", a);
                return a = vc(a).replace("\\*\\*", ".*").replace("\\*", "[^:/.?&;]*"), new RegExp("^" + a + "$")
            }
            if (z(a))return new RegExp("^" + a.source + "$");
            throw Zd("imatcher", 'Matchers may only be "self", string patterns or RegExp objects')
        }

        function xc(a) {
            var b = [];
            return s(a) && f(a, function (a) {
                b.push(wc(a))
            }), b
        }

        function yc() {
            this.SCE_CONTEXTS = $d;
            var a = ["self"], b = [];
            this.resourceUrlWhitelist = function (b) {
                return arguments.length && (a = xc(b)), a
            }, this.resourceUrlBlacklist = function (a) {
                return arguments.length && (b = xc(a)), b
            }, this.$get = ["$injector", function (d) {
                function e(a, b) {
                    return"self" === a ? Dc(b) : !!a.exec(b.href)
                }

                function f(c) {
                    var d, f, g = Cc(c.toString()), h = !1;
                    for (d = 0, f = a.length; f > d; d++)if (e(a[d], g)) {
                        h = !0;
                        break
                    }
                    if (h)for (d = 0, f = b.length; f > d; d++)if (e(b[d], g)) {
                        h = !1;
                        break
                    }
                    return h
                }

                function g(a) {
                    var b = function (a) {
                        this.$$unwrapTrustedValue = function () {
                            return a
                        }
                    };
                    return a && (b.prototype = new a), b.prototype.valueOf = function () {
                        return this.$$unwrapTrustedValue()
                    }, b.prototype.toString = function () {
                        return this.$$unwrapTrustedValue().toString()
                    }, b
                }

                function h(a, b) {
                    var d = m.hasOwnProperty(a) ? m[a] : null;
                    if (!d)throw Zd("icontext", "Attempted to trust a value in invalid context. Context: {0}; Value: {1}", a, b);
                    if (null === b || b === c || "" === b)return b;
                    if ("string" != typeof b)throw Zd("itype", "Attempted to trust a non-string value in a content requiring a string: Context: {0}", a);
                    return new d(b)
                }

                function i(a) {
                    return a instanceof l ? a.$$unwrapTrustedValue() : a
                }

                function j(a, b) {
                    if (null === b || b === c || "" === b)return b;
                    var d = m.hasOwnProperty(a) ? m[a] : null;
                    if (d && b instanceof d)return b.$$unwrapTrustedValue();
                    if (a === $d.RESOURCE_URL) {
                        if (f(b))return b;
                        throw Zd("insecurl", "Blocked loading resource from url not allowed by $sceDelegate policy.  URL: {0}", b.toString())
                    }
                    if (a === $d.HTML)return k(b);
                    throw Zd("unsafe", "Attempting to use an unsafe value in a safe context.")
                }

                var k = function () {
                    throw Zd("unsafe", "Attempting to use an unsafe value in a safe context.")
                };
                d.has("$sanitize") && (k = d.get("$sanitize"));
                var l = g(), m = {};
                return m[$d.HTML] = g(l), m[$d.CSS] = g(l), m[$d.URL] = g(l), m[$d.JS] = g(l), m[$d.RESOURCE_URL] = g(m[$d.URL]), {trustAs: h, getTrusted: j, valueOf: i}
            }]
        }

        function zc() {
            var a = !0;
            this.enabled = function (b) {
                return arguments.length && (a = !!b), a
            }, this.$get = ["$parse", "$sniffer", "$sceDelegate", function (b, c, d) {
                if (a && c.msie && c.msieDocumentMode < 8)throw Zd("iequirks", "Strict Contextual Escaping does not support Internet Explorer version < 9 in quirks mode.  You can fix this by adding the text <!doctype html> to the top of your HTML document.  See http://docs.angularjs.org/api/ng.$sce for more information.");
                var e = I($d);
                e.isEnabled = function () {
                    return a
                }, e.trustAs = d.trustAs, e.getTrusted = d.getTrusted, e.valueOf = d.valueOf, a || (e.trustAs = e.getTrusted = function (a, b) {
                    return b
                }, e.valueOf = p), e.parseAs = function (a, c) {
                    var d = b(c);
                    return d.literal && d.constant ? d : function (b, c) {
                        return e.getTrusted(a, d(b, c))
                    }
                };
                var g = e.parseAs, h = e.getTrusted, i = e.trustAs;
                return f($d, function (a, b) {
                    var c = ad(b);
                    e[jb("parse_as_" + c)] = function (b) {
                        return g(a, b)
                    }, e[jb("get_trusted_" + c)] = function (b) {
                        return h(a, b)
                    }, e[jb("trust_as_" + c)] = function (b) {
                        return i(a, b)
                    }
                }), e
            }]
        }

        function Ac() {
            this.$get = ["$window", "$document", function (a, b) {
                var c, d, e = {}, f = m((/android (\d+)/.exec(ad((a.navigator || {}).userAgent)) || [])[1]), g = /Boxee/i.test((a.navigator || {}).userAgent), h = b[0] || {}, i = h.documentMode, j = /^(Moz|webkit|O|ms)(?=[A-Z])/, k = h.body && h.body.style, l = !1, n = !1;
                if (k) {
                    for (var o in k)if (d = j.exec(o)) {
                        c = d[0], c = c.substr(0, 1).toUpperCase() + c.substr(1);
                        break
                    }
                    c || (c = "WebkitOpacity"in k && "webkit"), l = !!("transition"in k || c + "Transition"in k), n = !!("animation"in k || c + "Animation"in k), !f || l && n || (l = u(h.body.style.webkitTransition), n = u(h.body.style.webkitAnimation))
                }
                return{history: !(!a.history || !a.history.pushState || 4 > f || g), hashchange: "onhashchange"in a && (!i || i > 7), hasEvent: function (a) {
                    if ("input" == a && 9 == ed)return!1;
                    if (r(e[a])) {
                        var b = h.createElement("div");
                        e[a] = "on" + a in b
                    }
                    return e[a]
                }, csp: L(), vendorPrefix: c, transitions: l, animations: n, msie: ed, msieDocumentMode: i}
            }]
        }

        function Bc() {
            this.$get = ["$rootScope", "$browser", "$q", "$exceptionHandler", function (a, b, c, d) {
                function e(e, g, h) {
                    var i, j = c.defer(), k = j.promise, l = s(h) && !h;
                    return i = b.defer(function () {
                        try {
                            j.resolve(e())
                        } catch (b) {
                            j.reject(b), d(b)
                        } finally {
                            delete f[k.$$timeoutId]
                        }
                        l || a.$apply()
                    }, g), k.$$timeoutId = i, f[i] = j, k
                }

                var f = {};
                return e.cancel = function (a) {
                    return a && a.$$timeoutId in f ? (f[a.$$timeoutId].reject("canceled"), delete f[a.$$timeoutId], b.defer.cancel(a.$$timeoutId)) : !1
                }, e
            }]
        }

        function Cc(a) {
            var b = a;
            return ed && (_d.setAttribute("href", b), b = _d.href), _d.setAttribute("href", b), {href: _d.href, protocol: _d.protocol ? _d.protocol.replace(/:$/, "") : "", host: _d.host, search: _d.search ? _d.search.replace(/^\?/, "") : "", hash: _d.hash ? _d.hash.replace(/^#/, "") : "", hostname: _d.hostname, port: _d.port, pathname: "/" === _d.pathname.charAt(0) ? _d.pathname : "/" + _d.pathname}
        }

        function Dc(a) {
            var b = u(a) ? Cc(a) : a;
            return b.protocol === ae.protocol && b.host === ae.host
        }

        function Ec() {
            this.$get = q(a)
        }

        function Fc(a) {
            function b(d, e) {
                if (t(d)) {
                    var g = {};
                    return f(d, function (a, c) {
                        g[c] = b(c, a)
                    }), g
                }
                return a.factory(d + c, e)
            }

            var c = "Filter";
            this.register = b, this.$get = ["$injector", function (a) {
                return function (b) {
                    return a.get(b + c)
                }
            }], b("currency", Hc), b("date", Pc), b("filter", Gc), b("json", Qc), b("limitTo", Rc), b("lowercase", fe), b("number", Ic), b("orderBy", Sc), b("uppercase", ge)
        }

        function Gc() {
            return function (a, b, c) {
                if (!x(a))return a;
                var d = typeof c, e = [];
                e.check = function (a) {
                    for (var b = 0; b < e.length; b++)if (!e[b](a))return!1;
                    return!0
                }, "function" !== d && (c = "boolean" === d && c ? function (a, b) {
                    return nd.equals(a, b)
                } : function (a, b) {
                    return b = ("" + b).toLowerCase(), ("" + a).toLowerCase().indexOf(b) > -1
                });
                var f = function (a, b) {
                    if ("string" == typeof b && "!" === b.charAt(0))return!f(a, b.substr(1));
                    switch (typeof a) {
                        case"boolean":
                        case"number":
                        case"string":
                            return c(a, b);
                        case"object":
                            switch (typeof b) {
                                case"object":
                                    return c(a, b);
                                default:
                                    for (var d in a)if ("$" !== d.charAt(0) && f(a[d], b))return!0
                            }
                            return!1;
                        case"array":
                            for (var e = 0; e < a.length; e++)if (f(a[e], b))return!0;
                            return!1;
                        default:
                            return!1
                    }
                };
                switch (typeof b) {
                    case"boolean":
                    case"number":
                    case"string":
                        b = {$: b};
                    case"object":
                        for (var g in b)"$" == g ? !function () {
                            if (b[g]) {
                                var a = g;
                                e.push(function (c) {
                                    return f(c, b[a])
                                })
                            }
                        }() : !function () {
                            if ("undefined" != typeof b[g]) {
                                var a = g;
                                e.push(function (c) {
                                    return f(eb(c, a), b[a])
                                })
                            }
                        }();
                        break;
                    case"function":
                        e.push(b);
                        break;
                    default:
                        return a
                }
                for (var h = [], i = 0; i < a.length; i++) {
                    var j = a[i];
                    e.check(j) && h.push(j)
                }
                return h
            }
        }

        function Hc(a) {
            var b = a.NUMBER_FORMATS;
            return function (a, c) {
                return r(c) && (c = b.CURRENCY_SYM), Jc(a, b.PATTERNS[1], b.GROUP_SEP, b.DECIMAL_SEP, 2).replace(/\u00A4/g, c)
            }
        }

        function Ic(a) {
            var b = a.NUMBER_FORMATS;
            return function (a, c) {
                return Jc(a, b.PATTERNS[0], b.GROUP_SEP, b.DECIMAL_SEP, c)
            }
        }

        function Jc(a, b, c, d, e) {
            if (isNaN(a) || !isFinite(a))return"";
            var f = 0 > a;
            a = Math.abs(a);
            var g = a + "", h = "", i = [], j = !1;
            if (-1 !== g.indexOf("e")) {
                var k = g.match(/([\d\.]+)e(-?)(\d+)/);
                k && "-" == k[2] && k[3] > e + 1 ? g = "0" : (h = g, j = !0)
            }
            if (j)e > 0 && a > -1 && 1 > a && (h = a.toFixed(e)); else {
                var l = (g.split(be)[1] || "").length;
                r(e) && (e = Math.min(Math.max(b.minFrac, l), b.maxFrac));
                var m = Math.pow(10, e);
                a = Math.round(a * m) / m;
                var n = ("" + a).split(be), o = n[0];
                n = n[1] || "";
                var p, q = 0, s = b.lgSize, t = b.gSize;
                if (o.length >= s + t)for (q = o.length - s, p = 0; q > p; p++)(q - p) % t === 0 && 0 !== p && (h += c), h += o.charAt(p);
                for (p = q; p < o.length; p++)(o.length - p) % s === 0 && 0 !== p && (h += c), h += o.charAt(p);
                for (; n.length < e;)n += "0";
                e && "0" !== e && (h += d + n.substr(0, e))
            }
            return i.push(f ? b.negPre : b.posPre), i.push(h), i.push(f ? b.negSuf : b.posSuf), i.join("")
        }

        function Kc(a, b, c) {
            var d = "";
            for (0 > a && (d = "-", a = -a), a = "" + a; a.length < b;)a = "0" + a;
            return c && (a = a.substr(a.length - b)), d + a
        }

        function Lc(a, b, c, d) {
            return c = c || 0, function (e) {
                var f = e["get" + a]();
                return(c > 0 || f > -c) && (f += c), 0 === f && -12 == c && (f = 12), Kc(f, b, d)
            }
        }

        function Mc(a, b) {
            return function (c, d) {
                var e = c["get" + a](), f = bd(b ? "SHORT" + a : a);
                return d[f][e]
            }
        }

        function Nc(a) {
            var b = -1 * a.getTimezoneOffset(), c = b >= 0 ? "+" : "";
            return c += Kc(Math[b > 0 ? "floor" : "ceil"](b / 60), 2) + Kc(Math.abs(b % 60), 2)
        }

        function Oc(a, b) {
            return a.getHours() < 12 ? b.AMPMS[0] : b.AMPMS[1]
        }

        function Pc(a) {
            function b(a) {
                var b;
                if (b = a.match(c)) {
                    var d = new Date(0), e = 0, f = 0, g = b[8] ? d.setUTCFullYear : d.setFullYear, h = b[8] ? d.setUTCHours : d.setHours;
                    b[9] && (e = m(b[9] + b[10]), f = m(b[9] + b[11])), g.call(d, m(b[1]), m(b[2]) - 1, m(b[3]));
                    var i = m(b[4] || 0) - e, j = m(b[5] || 0) - f, k = m(b[6] || 0), l = Math.round(1e3 * parseFloat("0." + (b[7] || 0)));
                    return h.call(d, i, j, k, l), d
                }
                return a
            }

            var c = /^(\d{4})-?(\d\d)-?(\d\d)(?:T(\d\d)(?::?(\d\d)(?::?(\d\d)(?:\.(\d+))?)?)?(Z|([+-])(\d\d):?(\d\d))?)?$/;
            return function (c, d) {
                var e, g, h = "", i = [];
                if (d = d || "mediumDate", d = a.DATETIME_FORMATS[d] || d, u(c) && (c = ee.test(c) ? m(c) : b(c)), v(c) && (c = new Date(c)), !w(c))return c;
                for (; d;)g = de.exec(d), g ? (i = M(i, g, 1), d = i.pop()) : (i.push(d), d = null);
                return f(i, function (b) {
                    e = ce[b], h += e ? e(c, a.DATETIME_FORMATS) : b.replace(/(^'|'$)/g, "").replace(/''/g, "'")
                }), h
            }
        }

        function Qc() {
            return function (a) {
                return Q(a, !0)
            }
        }

        function Rc() {
            return function (a, b) {
                if (!x(a) && !u(a))return a;
                if (b = m(b), u(a))return b ? b >= 0 ? a.slice(0, b) : a.slice(b, a.length) : "";
                var c, d, e = [];
                for (b > a.length ? b = a.length : b < -a.length && (b = -a.length), b > 0 ? (c = 0, d = b) : (c = a.length + b, d = a.length); d > c; c++)e.push(a[c]);
                return e
            }
        }

        function Sc(a) {
            return function (b, c, d) {
                function e(a, b) {
                    for (var d = 0; d < c.length; d++) {
                        var e = c[d](a, b);
                        if (0 !== e)return e
                    }
                    return 0
                }

                function f(a, b) {
                    return S(b) ? function (b, c) {
                        return a(c, b)
                    } : a
                }

                function g(a, b) {
                    var c = typeof a, d = typeof b;
                    return c == d ? ("string" == c && (a = a.toLowerCase(), b = b.toLowerCase()), a === b ? 0 : b > a ? -1 : 1) : d > c ? -1 : 1
                }

                if (!x(b))return b;
                if (!c)return b;
                c = x(c) ? c : [c], c = E(c, function (b) {
                    var c = !1, d = b || p;
                    return u(b) && (("+" == b.charAt(0) || "-" == b.charAt(0)) && (c = "-" == b.charAt(0), b = b.substring(1)), d = a(b)), f(function (a, b) {
                        return g(d(a), d(b))
                    }, c)
                });
                for (var h = [], i = 0; i < b.length; i++)h.push(b[i]);
                return h.sort(f(e, d))
            }
        }

        function Tc(a) {
            return y(a) && (a = {link: a}), a.restrict = a.restrict || "AC", q(a)
        }

        function Uc(a, b) {
            function c(b, c) {
                c = c ? "-" + _(c, "-") : "", a.removeClass((b ? te : se) + c).addClass((b ? se : te) + c)
            }

            var d = this, e = a.parent().controller("form") || je, g = 0, h = d.$error = {}, i = [];
            d.$name = b.name || b.ngForm, d.$dirty = !1, d.$pristine = !0, d.$valid = !0, d.$invalid = !1, e.$addControl(d), a.addClass(ue), c(!0), d.$addControl = function (a) {
                db(a.$name, "input"), i.push(a), a.$name && (d[a.$name] = a)
            }, d.$removeControl = function (a) {
                a.$name && d[a.$name] === a && delete d[a.$name], f(h, function (b, c) {
                    d.$setValidity(c, !0, a)
                }), H(i, a)
            }, d.$setValidity = function (a, b, f) {
                var i = h[a];
                if (b)i && (H(i, f), i.length || (g--, g || (c(b), d.$valid = !0, d.$invalid = !1), h[a] = !1, c(!0, a), e.$setValidity(a, !0, d))); else {
                    if (g || c(b), i) {
                        if (F(i, f))return
                    } else h[a] = i = [], g++, c(!1, a), e.$setValidity(a, !1, d);
                    i.push(f), d.$valid = !1, d.$invalid = !0
                }
            }, d.$setDirty = function () {
                a.removeClass(ue).addClass(ve), d.$dirty = !0, d.$pristine = !1, e.$setDirty()
            }, d.$setPristine = function () {
                a.removeClass(ve).addClass(ue), d.$dirty = !1, d.$pristine = !0, f(i, function (a) {
                    a.$setPristine()
                })
            }
        }

        function Vc(a, b, e, f, g, h) {
            var i = !1;
            b.on("compositionstart", function () {
                i = !0
            }), b.on("compositionend", function () {
                i = !1
            });
            var j = function () {
                if (!i) {
                    var c = b.val();
                    S(e.ngTrim || "T") && (c = pd(c)), f.$viewValue !== c && a.$apply(function () {
                        f.$setViewValue(c)
                    })
                }
            };
            if (g.hasEvent("input"))b.on("input", j); else {
                var k, l = function () {
                    k || (k = h.defer(function () {
                        j(), k = null
                    }))
                };
                b.on("keydown", function (a) {
                    var b = a.keyCode;
                    91 === b || b > 15 && 19 > b || b >= 37 && 40 >= b || l()
                }), g.hasEvent("paste") && b.on("paste cut", l)
            }
            b.on("change", j), f.$render = function () {
                b.val(f.$isEmpty(f.$viewValue) ? "" : f.$viewValue)
            };
            var n, o, p = e.ngPattern, q = function (a, b) {
                return f.$isEmpty(b) || a.test(b) ? (f.$setValidity("pattern", !0), b) : (f.$setValidity("pattern", !1), c)
            };
            if (p && (o = p.match(/^\/(.*)\/([gim]*)$/), o ? (p = new RegExp(o[1], o[2]), n = function (a) {
                return q(p, a)
            }) : n = function (c) {
                var e = a.$eval(p);
                if (!e || !e.test)throw d("ngPattern")("noregexp", "Expected {0} to be a RegExp but was {1}. Element: {2}", p, e, T(b));
                return q(e, c)
            }, f.$formatters.push(n), f.$parsers.push(n)), e.ngMinlength) {
                var r = m(e.ngMinlength), s = function (a) {
                    return!f.$isEmpty(a) && a.length < r ? (f.$setValidity("minlength", !1), c) : (f.$setValidity("minlength", !0), a)
                };
                f.$parsers.push(s), f.$formatters.push(s)
            }
            if (e.ngMaxlength) {
                var t = m(e.ngMaxlength), u = function (a) {
                    return!f.$isEmpty(a) && a.length > t ? (f.$setValidity("maxlength", !1), c) : (f.$setValidity("maxlength", !0), a)
                };
                f.$parsers.push(u), f.$formatters.push(u)
            }
        }

        function Wc(a, b, d, e, f, g) {
            if (Vc(a, b, d, e, f, g), e.$parsers.push(function (a) {
                var b = e.$isEmpty(a);
                return b || pe.test(a) ? (e.$setValidity("number", !0), "" === a ? null : b ? a : parseFloat(a)) : (e.$setValidity("number", !1), c)
            }), e.$formatters.push(function (a) {
                return e.$isEmpty(a) ? "" : "" + a
            }), d.min) {
                var h = function (a) {
                    var b = parseFloat(d.min);
                    return!e.$isEmpty(a) && b > a ? (e.$setValidity("min", !1), c) : (e.$setValidity("min", !0), a)
                };
                e.$parsers.push(h), e.$formatters.push(h)
            }
            if (d.max) {
                var i = function (a) {
                    var b = parseFloat(d.max);
                    return!e.$isEmpty(a) && a > b ? (e.$setValidity("max", !1), c) : (e.$setValidity("max", !0), a)
                };
                e.$parsers.push(i), e.$formatters.push(i)
            }
            e.$formatters.push(function (a) {
                return e.$isEmpty(a) || v(a) ? (e.$setValidity("number", !0), a) : (e.$setValidity("number", !1), c)
            })
        }

        function Xc(a, b, d, e, f, g) {
            Vc(a, b, d, e, f, g);
            var h = function (a) {
                return e.$isEmpty(a) || ne.test(a) ? (e.$setValidity("url", !0), a) : (e.$setValidity("url", !1), c)
            };
            e.$formatters.push(h), e.$parsers.push(h)
        }

        function Yc(a, b, d, e, f, g) {
            Vc(a, b, d, e, f, g);
            var h = function (a) {
                return e.$isEmpty(a) || oe.test(a) ? (e.$setValidity("email", !0), a) : (e.$setValidity("email", !1), c)
            };
            e.$formatters.push(h), e.$parsers.push(h)
        }

        function Zc(a, b, c, d) {
            r(c.name) && b.attr("name", j()), b.on("click", function () {
                b[0].checked && a.$apply(function () {
                    d.$setViewValue(c.value)
                })
            }), d.$render = function () {
                var a = c.value;
                b[0].checked = a == d.$viewValue
            }, c.$observe("value", d.$render)
        }

        function $c(a, b, c, d) {
            var e = c.ngTrueValue, f = c.ngFalseValue;
            u(e) || (e = !0), u(f) || (f = !1), b.on("click", function () {
                a.$apply(function () {
                    d.$setViewValue(b[0].checked)
                })
            }), d.$render = function () {
                b[0].checked = d.$viewValue
            }, d.$isEmpty = function (a) {
                return a !== e
            }, d.$formatters.push(function (a) {
                return a === e
            }), d.$parsers.push(function (a) {
                return a ? e : f
            })
        }

        function _c(a, b) {
            return a = "ngClass" + a, function () {
                return{restrict: "AC", link: function (c, d, e) {
                    function g(a) {
                        if (b === !0 || c.$index % 2 === b) {
                            var d = h(a || "");
                            i ? K(a, i) || e.$updateClass(d, h(i)) : e.$addClass(d)
                        }
                        i = I(a)
                    }

                    function h(a) {
                        if (x(a))return a.join(" ");
                        if (t(a)) {
                            var b = [];
                            return f(a, function (a, c) {
                                a && b.push(c)
                            }), b.join(" ")
                        }
                        return a
                    }

                    var i;
                    c.$watch(e[a], g, !0), e.$observe("class", function () {
                        g(c.$eval(e[a]))
                    }), "ngClass" !== a && c.$watch("$index", function (d, f) {
                        var g = 1 & d;
                        if (g !== f & 1) {
                            var i = h(c.$eval(e[a]));
                            g === b ? e.$addClass(i) : e.$removeClass(i)
                        }
                    })
                }}
            }
        }

        var ad = function (a) {
            return u(a) ? a.toLowerCase() : a
        }, bd = function (a) {
            return u(a) ? a.toUpperCase() : a
        }, cd = function (a) {
            return u(a) ? a.replace(/[A-Z]/g, function (a) {
                return String.fromCharCode(32 | a.charCodeAt(0))
            }) : a
        }, dd = function (a) {
            return u(a) ? a.replace(/[a-z]/g, function (a) {
                return String.fromCharCode(-33 & a.charCodeAt(0))
            }) : a
        };
        "i" !== "I".toLowerCase() && (ad = cd, bd = dd);
        var ed, fd, gd, hd, id, jd = [].slice, kd = [].push, ld = Object.prototype.toString, md = d("ng"), nd = (a.angular, a.angular || (a.angular = {})), od = ["0", "0", "0"];
        ed = m((/msie (\d+)/.exec(ad(navigator.userAgent)) || [])[1]), isNaN(ed) && (ed = m((/trident\/.*; rv:(\d+)/.exec(ad(navigator.userAgent)) || [])[1])), o.$inject = [], p.$inject = [];
        var pd = function () {
            return String.prototype.trim ? function (a) {
                return u(a) ? a.trim() : a
            } : function (a) {
                return u(a) ? a.replace(/^\s\s*/, "").replace(/\s\s*$/, "") : a
            }
        }();
        id = 9 > ed ? function (a) {
            return a = a.nodeName ? a : a[0], a.scopeName && "HTML" != a.scopeName ? bd(a.scopeName + ":" + a.nodeName) : a.nodeName
        } : function (a) {
            return a.nodeName ? a.nodeName : a[0].nodeName
        };
        var qd = /[A-Z]/g, rd = {full: "1.2.3", major: 1, minor: 2, dot: 3, codeName: "unicorn-zapper"}, sd = lb.cache = {}, td = lb.expando = "ng-" + (new Date).getTime(), ud = 1, vd = a.document.addEventListener ? function (a, b, c) {
            a.addEventListener(b, c, !1)
        } : function (a, b, c) {
            a.attachEvent("on" + b, c)
        }, wd = a.document.removeEventListener ? function (a, b, c) {
            a.removeEventListener(b, c, !1)
        } : function (a, b, c) {
            a.detachEvent("on" + b, c)
        }, xd = /([\:\-\_]+(.))/g, yd = /^moz([A-Z])/, zd = d("jqLite"), Ad = lb.prototype = {ready: function (c) {
            function d() {
                e || (e = !0, c())
            }

            var e = !1;
            "complete" === b.readyState ? setTimeout(d) : (this.on("DOMContentLoaded", d), lb(a).on("load", d))
        }, toString: function () {
            var a = [];
            return f(this, function (b) {
                a.push("" + b)
            }), "[" + a.join(", ") + "]"
        }, eq: function (a) {
            return fd(a >= 0 ? this[a] : this[this.length + a])
        }, length: 0, push: kd, sort: [].sort, splice: [].splice}, Bd = {};
        f("multiple,selected,checked,disabled,readOnly,required,open".split(","), function (a) {
            Bd[ad(a)] = a
        });
        var Cd = {};
        f("input,select,option,textarea,button,form,details".split(","), function (a) {
            Cd[bd(a)] = !0
        }), f({data: rb, inheritedData: xb, scope: function (a) {
            return fd(a).data("$scope") || xb(a.parentNode || a, ["$isolateScope", "$scope"])
        }, isolateScope: function (a) {
            return fd(a).data("$isolateScope") || fd(a).data("$isolateScopeNoTemplate")
        }, controller: wb, injector: function (a) {
            return xb(a, "$injector")
        }, removeAttr: function (a, b) {
            a.removeAttribute(b)
        }, hasClass: sb, css: function (a, b, d) {
            if (b = jb(b), !s(d)) {
                var e;
                return 8 >= ed && (e = a.currentStyle && a.currentStyle[b], "" === e && (e = "auto")), e = e || a.style[b], 8 >= ed && (e = "" === e ? c : e), e
            }
            a.style[b] = d
        }, attr: function (a, b, d) {
            var e = ad(b);
            if (Bd[e]) {
                if (!s(d))return a[b] || (a.attributes.getNamedItem(b) || o).specified ? e : c;
                d ? (a[b] = !0, a.setAttribute(b, e)) : (a[b] = !1, a.removeAttribute(e))
            } else if (s(d))a.setAttribute(b, d); else if (a.getAttribute) {
                var f = a.getAttribute(b, 2);
                return null === f ? c : f
            }
        }, prop: function (a, b, c) {
            return s(c) ? void(a[b] = c) : a[b]
        }, text: function () {
            function a(a, c) {
                var d = b[a.nodeType];
                return r(c) ? d ? a[d] : "" : void(a[d] = c)
            }

            var b = [];
            return 9 > ed ? (b[1] = "innerText", b[3] = "nodeValue") : b[1] = b[3] = "textContent", a.$dv = "", a
        }(), val: function (a, b) {
            if (r(b)) {
                if ("SELECT" === id(a) && a.multiple) {
                    var c = [];
                    return f(a.options, function (a) {
                        a.selected && c.push(a.value || a.text)
                    }), 0 === c.length ? null : c
                }
                return a.value
            }
            a.value = b
        }, html: function (a, b) {
            if (r(b))return a.innerHTML;
            for (var c = 0, d = a.childNodes; c < d.length; c++)nb(d[c]);
            a.innerHTML = b
        }}, function (a, b) {
            lb.prototype[b] = function (b, d) {
                var e, f;
                if ((2 == a.length && a !== sb && a !== wb ? b : d) === c) {
                    if (t(b)) {
                        for (e = 0; e < this.length; e++)if (a === rb)a(this[e], b); else for (f in b)a(this[e], f, b[f]);
                        return this
                    }
                    for (var g = a.$dv, h = g === c ? Math.min(this.length, 1) : this.length, i = 0; h > i; i++) {
                        var j = a(this[i], b, d);
                        g = g ? g + j : j
                    }
                    return g
                }
                for (e = 0; e < this.length; e++)a(this[e], b, d);
                return this
            }
        }), f({removeData: pb, dealoc: nb, on: function df(a, c, d, e) {
            if (s(e))throw zd("onargs", "jqLite#on() does not support the `selector` or `eventData` parameters");
            var g = qb(a, "events"), h = qb(a, "handle");
            g || qb(a, "events", g = {}), h || qb(a, "handle", h = zb(a, g)), f(c.split(" "), function (c) {
                var e = g[c];
                if (!e) {
                    if ("mouseenter" == c || "mouseleave" == c) {
                        var f = b.body.contains || b.body.compareDocumentPosition ? function (a, b) {
                            var c = 9 === a.nodeType ? a.documentElement : a, d = b && b.parentNode;
                            return a === d || !(!d || 1 !== d.nodeType || !(c.contains ? c.contains(d) : a.compareDocumentPosition && 16 & a.compareDocumentPosition(d)))
                        } : function (a, b) {
                            if (b)for (; b = b.parentNode;)if (b === a)return!0;
                            return!1
                        };
                        g[c] = [];
                        var i = {mouseleave: "mouseout", mouseenter: "mouseover"};
                        df(a, i[c], function (a) {
                            var b = this, d = a.relatedTarget;
                            (!d || d !== b && !f(b, d)) && h(a, c)
                        })
                    } else vd(a, c, h), g[c] = [];
                    e = g[c]
                }
                e.push(d)
            })
        }, off: ob, replaceWith: function (a, b) {
            var c, d = a.parentNode;
            nb(a), f(new lb(b), function (b) {
                c ? d.insertBefore(b, c.nextSibling) : d.replaceChild(b, a), c = b
            })
        }, children: function (a) {
            var b = [];
            return f(a.childNodes, function (a) {
                1 === a.nodeType && b.push(a)
            }), b
        }, contents: function (a) {
            return a.childNodes || []
        }, append: function (a, b) {
            f(new lb(b), function (b) {
                (1 === a.nodeType || 11 === a.nodeType) && a.appendChild(b)
            })
        }, prepend: function (a, b) {
            if (1 === a.nodeType) {
                var c = a.firstChild;
                f(new lb(b), function (b) {
                    a.insertBefore(b, c)
                })
            }
        }, wrap: function (a, b) {
            b = fd(b)[0];
            var c = a.parentNode;
            c && c.replaceChild(b, a), b.appendChild(a)
        }, remove: function (a) {
            nb(a);
            var b = a.parentNode;
            b && b.removeChild(a)
        }, after: function (a, b) {
            var c = a, d = a.parentNode;
            f(new lb(b), function (a) {
                d.insertBefore(a, c.nextSibling), c = a
            })
        }, addClass: ub, removeClass: tb, toggleClass: function (a, b, c) {
            r(c) && (c = !sb(a, b)), (c ? ub : tb)(a, b)
        }, parent: function (a) {
            var b = a.parentNode;
            return b && 11 !== b.nodeType ? b : null
        }, next: function (a) {
            if (a.nextElementSibling)return a.nextElementSibling;
            for (var b = a.nextSibling; null != b && 1 !== b.nodeType;)b = b.nextSibling;
            return b
        }, find: function (a, b) {
            return a.getElementsByTagName(b)
        }, clone: mb, triggerHandler: function (a, b, c) {
            var d = (qb(a, "events") || {})[b];
            c = c || [];
            var e = [
                {preventDefault: o, stopPropagation: o}
            ];
            f(d, function (b) {
                b.apply(a, e.concat(c))
            })
        }}, function (a, b) {
            lb.prototype[b] = function (b, c, d) {
                for (var e, f = 0; f < this.length; f++)r(e) ? (e = a(this[f], b, c, d), s(e) && (e = fd(e))) : vb(e, a(this[f], b, c, d));
                return s(e) ? e : this
            }, lb.prototype.bind = lb.prototype.on, lb.prototype.unbind = lb.prototype.off
        }), Bb.prototype = {put: function (a, b) {
            this[Ab(a)] = b
        }, get: function (a) {
            return this[Ab(a)]
        }, remove: function (a) {
            var b = this[a = Ab(a)];
            return delete this[a], b
        }};
        var Dd = /^function\s*[^\(]*\(\s*([^\)]*)\)/m, Ed = /,/, Fd = /^\s*(_?)(\S+?)\1\s*$/, Gd = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/gm, Hd = d("$injector"), Id = d("$animate"), Jd = ["$provide", function (a) {
            this.$$selectors = {}, this.register = function (b, c) {
                var d = b + "-animation";
                if (b && "." != b.charAt(0))throw Id("notcsel", "Expecting class selector starting with '.' got '{0}'.", b);
                this.$$selectors[b.substr(1)] = d, a.factory(d, c)
            }, this.$get = ["$timeout", function (a) {
                return{enter: function (b, c, d, e) {
                    d ? d.after(b) : (c && c[0] || (c = d.parent()), c.append(b)), e && a(e, 0, !1)
                }, leave: function (b, c) {
                    b.remove(), c && a(c, 0, !1)
                }, move: function (a, b, c, d) {
                    this.enter(a, b, c, d)
                }, addClass: function (b, c, d) {
                    c = u(c) ? c : x(c) ? c.join(" ") : "", f(b, function (a) {
                        ub(a, c)
                    }), d && a(d, 0, !1)
                }, removeClass: function (b, c, d) {
                    c = u(c) ? c : x(c) ? c.join(" ") : "", f(b, function (a) {
                        tb(a, c)
                    }), d && a(d, 0, !1)
                }, enabled: o}
            }]
        }], Kd = d("$compile");
        Jb.$inject = ["$provide", "$$sanitizeUriProvider"];
        var Ld = /^(x[\:\-_]|data[\:\-_])/i, Md = a.XMLHttpRequest || function () {
            try {
                return new ActiveXObject("Msxml2.XMLHTTP.6.0")
            } catch (a) {
            }
            try {
                return new ActiveXObject("Msxml2.XMLHTTP.3.0")
            } catch (b) {
            }
            try {
                return new ActiveXObject("Msxml2.XMLHTTP")
            } catch (c) {
            }
            throw d("$httpBackend")("noxhr", "This browser does not support XMLHttpRequest.")
        }, Nd = d("$interpolate"), Od = /^([^\?#]*)(\?([^#]*))?(#(.*))?$/, Pd = {http: 80, https: 443, ftp: 21}, Qd = d("$location");
        gc.prototype = fc.prototype = ec.prototype = {$$html5: !1, $$replace: !1, absUrl: hc("$$absUrl"), url: function (a, b) {
            if (r(a))return this.$$url;
            var c = Od.exec(a);
            return c[1] && this.path(decodeURIComponent(c[1])), (c[2] || c[1]) && this.search(c[3] || ""), this.hash(c[5] || "", b), this
        }, protocol: hc("$$protocol"), host: hc("$$host"), port: hc("$$port"), path: ic("$$path", function (a) {
            return"/" == a.charAt(0) ? a : "/" + a
        }), search: function (a, b) {
            switch (arguments.length) {
                case 0:
                    return this.$$search;
                case 1:
                    if (u(a))this.$$search = V(a); else {
                        if (!t(a))throw Qd("isrcharg", "The first argument of the `$location#search()` call must be a string or an object.");
                        this.$$search = a
                    }
                    break;
                default:
                    r(b) || null === b ? delete this.$$search[a] : this.$$search[a] = b
            }
            return this.$$compose(), this
        }, hash: ic("$$hash", p), replace: function () {
            return this.$$replace = !0, this
        }};
        var Rd, Sd = d("$parse"), Td = {}, Ud = {"null": function () {
            return null
        }, "true": function () {
            return!0
        }, "false": function () {
            return!1
        }, undefined: o, "+": function (a, b, d, e) {
            return d = d(a, b), e = e(a, b), s(d) ? s(e) ? d + e : d : s(e) ? e : c
        }, "-": function (a, b, c, d) {
            return c = c(a, b), d = d(a, b), (s(c) ? c : 0) - (s(d) ? d : 0)
        }, "*": function (a, b, c, d) {
            return c(a, b) * d(a, b)
        }, "/": function (a, b, c, d) {
            return c(a, b) / d(a, b)
        }, "%": function (a, b, c, d) {
            return c(a, b) % d(a, b)
        }, "^": function (a, b, c, d) {
            return c(a, b) ^ d(a, b)
        }, "=": o, "===": function (a, b, c, d) {
            return c(a, b) === d(a, b)
        }, "!==": function (a, b, c, d) {
            return c(a, b) !== d(a, b)
        }, "==": function (a, b, c, d) {
            return c(a, b) == d(a, b)
        }, "!=": function (a, b, c, d) {
            return c(a, b) != d(a, b)
        }, "<": function (a, b, c, d) {
            return c(a, b) < d(a, b)
        }, ">": function (a, b, c, d) {
            return c(a, b) > d(a, b)
        }, "<=": function (a, b, c, d) {
            return c(a, b) <= d(a, b)
        }, ">=": function (a, b, c, d) {
            return c(a, b) >= d(a, b)
        }, "&&": function (a, b, c, d) {
            return c(a, b) && d(a, b)
        }, "||": function (a, b, c, d) {
            return c(a, b) || d(a, b)
        }, "&": function (a, b, c, d) {
            return c(a, b) & d(a, b)
        }, "|": function (a, b, c, d) {
            return d(a, b)(a, b, c(a, b))
        }, "!": function (a, b, c) {
            return!c(a, b)
        }}, Vd = {n: "\n", f: "\f", r: "\r", t: "	", v: "", "'": "'", '"': '"'}, Wd = function (a) {
            this.options = a
        };
        Wd.prototype = {constructor: Wd, lex: function (a) {
            this.text = a, this.index = 0, this.ch = c, this.lastCh = ":", this.tokens = [];
            for (var b, d = []; this.index < this.text.length;) {
                if (this.ch = this.text.charAt(this.index), this.is("\"'"))this.readString(this.ch); else if (this.isNumber(this.ch) || this.is(".") && this.isNumber(this.peek()))this.readNumber(); else if (this.isIdent(this.ch))this.readIdent(), this.was("{,") && "{" === d[0] && (b = this.tokens[this.tokens.length - 1]) && (b.json = -1 === b.text.indexOf(".")); else if (this.is("(){}[].,;:?"))this.tokens.push({index: this.index, text: this.ch, json: this.was(":[,") && this.is("{[") || this.is("}]:,")}), this.is("{[") && d.unshift(this.ch), this.is("}]") && d.shift(), this.index++; else {
                    if (this.isWhitespace(this.ch)) {
                        this.index++;
                        continue
                    }
                    var e = this.ch + this.peek(), f = e + this.peek(2), g = Ud[this.ch], h = Ud[e], i = Ud[f];
                    i ? (this.tokens.push({index: this.index, text: f, fn: i}), this.index += 3) : h ? (this.tokens.push({index: this.index, text: e, fn: h}), this.index += 2) : g ? (this.tokens.push({index: this.index, text: this.ch, fn: g, json: this.was("[,:") && this.is("+-")}), this.index += 1) : this.throwError("Unexpected next character ", this.index, this.index + 1)
                }
                this.lastCh = this.ch
            }
            return this.tokens
        }, is: function (a) {
            return-1 !== a.indexOf(this.ch)
        }, was: function (a) {
            return-1 !== a.indexOf(this.lastCh)
        }, peek: function (a) {
            var b = a || 1;
            return this.index + b < this.text.length ? this.text.charAt(this.index + b) : !1
        }, isNumber: function (a) {
            return a >= "0" && "9" >= a
        }, isWhitespace: function (a) {
            return" " === a || "\r" === a || "	" === a || "\n" === a || "" === a || " " === a
        }, isIdent: function (a) {
            return a >= "a" && "z" >= a || a >= "A" && "Z" >= a || "_" === a || "$" === a
        }, isExpOperator: function (a) {
            return"-" === a || "+" === a || this.isNumber(a)
        }, throwError: function (a, b, c) {
            c = c || this.index;
            var d = s(b) ? "s " + b + "-" + this.index + " [" + this.text.substring(b, c) + "]" : " " + c;
            throw Sd("lexerr", "Lexer Error: {0} at column{1} in expression [{2}].", a, d, this.text)
        }, readNumber: function () {
            for (var a = "", b = this.index; this.index < this.text.length;) {
                var c = ad(this.text.charAt(this.index));
                if ("." == c || this.isNumber(c))a += c; else {
                    var d = this.peek();
                    if ("e" == c && this.isExpOperator(d))a += c; else if (this.isExpOperator(c) && d && this.isNumber(d) && "e" == a.charAt(a.length - 1))a += c; else {
                        if (!this.isExpOperator(c) || d && this.isNumber(d) || "e" != a.charAt(a.length - 1))break;
                        this.throwError("Invalid exponent")
                    }
                }
                this.index++
            }
            a = 1 * a, this.tokens.push({index: b, text: a, json: !0, fn: function () {
                return a
            }})
        }, readIdent: function () {
            for (var a, b, c, d, e = this, f = "", g = this.index; this.index < this.text.length && (d = this.text.charAt(this.index), "." === d || this.isIdent(d) || this.isNumber(d));)"." === d && (a = this.index), f += d, this.index++;
            if (a)for (b = this.index; b < this.text.length;) {
                if (d = this.text.charAt(b), "(" === d) {
                    c = f.substr(a - g + 1), f = f.substr(0, a - g), this.index = b;
                    break
                }
                if (!this.isWhitespace(d))break;
                b++
            }
            var h = {index: g, text: f};
            if (Ud.hasOwnProperty(f))h.fn = Ud[f], h.json = Ud[f]; else {
                var i = pc(f, this.options, this.text);
                h.fn = l(function (a, b) {
                    return i(a, b)
                }, {assign: function (a, b) {
                    return nc(a, f, b, e.text, e.options)
                }})
            }
            this.tokens.push(h), c && (this.tokens.push({index: a, text: ".", json: !1}), this.tokens.push({index: a + 1, text: c, json: !1}))
        }, readString: function (a) {
            var b = this.index;
            this.index++;
            for (var c = "", d = a, e = !1; this.index < this.text.length;) {
                var f = this.text.charAt(this.index);
                if (d += f, e) {
                    if ("u" === f) {
                        var g = this.text.substring(this.index + 1, this.index + 5);
                        g.match(/[\da-f]{4}/i) || this.throwError("Invalid unicode escape [\\u" + g + "]"), this.index += 4, c += String.fromCharCode(parseInt(g, 16))
                    } else {
                        var h = Vd[f];
                        c += h ? h : f
                    }
                    e = !1
                } else if ("\\" === f)e = !0; else {
                    if (f === a)return this.index++, void this.tokens.push({index: b, text: d, string: c, json: !0, fn: function () {
                        return c
                    }});
                    c += f
                }
                this.index++
            }
            this.throwError("Unterminated quote", b)
        }};
        var Xd = function (a, b, c) {
            this.lexer = a, this.$filter = b, this.options = c
        };
        Xd.ZERO = function () {
            return 0
        }, Xd.prototype = {constructor: Xd, parse: function (a, b) {
            this.text = a, this.json = b, this.tokens = this.lexer.lex(a), b && (this.assignment = this.logicalOR, this.functionCall = this.fieldAccess = this.objectIndex = this.filterChain = function () {
                this.throwError("is not valid json", {text: a, index: 0})
            });
            var c = b ? this.primary() : this.statements();
            return 0 !== this.tokens.length && this.throwError("is an unexpected token", this.tokens[0]), c.literal = !!c.literal, c.constant = !!c.constant, c
        }, primary: function () {
            var a;
            if (this.expect("("))a = this.filterChain(), this.consume(")"); else if (this.expect("["))a = this.arrayDeclaration(); else if (this.expect("{"))a = this.object(); else {
                var b = this.expect();
                a = b.fn, a || this.throwError("not a primary expression", b), b.json && (a.constant = !0, a.literal = !0)
            }
            for (var c, d; c = this.expect("(", "[", ".");)"(" === c.text ? (a = this.functionCall(a, d), d = null) : "[" === c.text ? (d = a, a = this.objectIndex(a)) : "." === c.text ? (d = a, a = this.fieldAccess(a)) : this.throwError("IMPOSSIBLE");
            return a
        }, throwError: function (a, b) {
            throw Sd("syntax", "Syntax Error: Token '{0}' {1} at column {2} of the expression [{3}] starting at [{4}].", b.text, a, b.index + 1, this.text, this.text.substring(b.index))
        }, peekToken: function () {
            if (0 === this.tokens.length)throw Sd("ueoe", "Unexpected end of expression: {0}", this.text);
            return this.tokens[0]
        }, peek: function (a, b, c, d) {
            if (this.tokens.length > 0) {
                var e = this.tokens[0], f = e.text;
                if (f === a || f === b || f === c || f === d || !a && !b && !c && !d)return e
            }
            return!1
        }, expect: function (a, b, c, d) {
            var e = this.peek(a, b, c, d);
            return e ? (this.json && !e.json && this.throwError("is not valid json", e), this.tokens.shift(), e) : !1
        }, consume: function (a) {
            this.expect(a) || this.throwError("is unexpected, expecting [" + a + "]", this.peek())
        }, unaryFn: function (a, b) {
            return l(function (c, d) {
                return a(c, d, b)
            }, {constant: b.constant})
        }, ternaryFn: function (a, b, c) {
            return l(function (d, e) {
                return a(d, e) ? b(d, e) : c(d, e)
            }, {constant: a.constant && b.constant && c.constant})
        }, binaryFn: function (a, b, c) {
            return l(function (d, e) {
                return b(d, e, a, c)
            }, {constant: a.constant && c.constant})
        }, statements: function () {
            for (var a = []; ;)if (this.tokens.length > 0 && !this.peek("}", ")", ";", "]") && a.push(this.filterChain()), !this.expect(";"))return 1 === a.length ? a[0] : function (b, c) {
                for (var d, e = 0; e < a.length; e++) {
                    var f = a[e];
                    f && (d = f(b, c))
                }
                return d
            }
        }, filterChain: function () {
            for (var a, b = this.expression(); ;) {
                if (!(a = this.expect("|")))return b;
                b = this.binaryFn(b, a.fn, this.filter())
            }
        }, filter: function () {
            for (var a = this.expect(), b = this.$filter(a.text), c = []; ;) {
                if (!(a = this.expect(":"))) {
                    var d = function (a, d, e) {
                        for (var f = [e], g = 0; g < c.length; g++)f.push(c[g](a, d));
                        return b.apply(a, f)
                    };
                    return function () {
                        return d
                    }
                }
                c.push(this.expression())
            }
        }, expression: function () {
            return this.assignment()
        }, assignment: function () {
            var a, b, c = this.ternary();
            return(b = this.expect("=")) ? (c.assign || this.throwError("implies assignment but [" + this.text.substring(0, b.index) + "] can not be assigned to", b), a = this.ternary(), function (b, d) {
                return c.assign(b, a(b, d), d)
            }) : c
        }, ternary: function () {
            var a, b, c = this.logicalOR();
            return(b = this.expect("?")) ? (a = this.ternary(), (b = this.expect(":")) ? this.ternaryFn(c, a, this.ternary()) : void this.throwError("expected :", b)) : c
        }, logicalOR: function () {
            for (var a, b = this.logicalAND(); ;) {
                if (!(a = this.expect("||")))return b;
                b = this.binaryFn(b, a.fn, this.logicalAND())
            }
        }, logicalAND: function () {
            var a, b = this.equality();
            return(a = this.expect("&&")) && (b = this.binaryFn(b, a.fn, this.logicalAND())), b
        }, equality: function () {
            var a, b = this.relational();
            return(a = this.expect("==", "!=", "===", "!==")) && (b = this.binaryFn(b, a.fn, this.equality())), b
        }, relational: function () {
            var a, b = this.additive();
            return(a = this.expect("<", ">", "<=", ">=")) && (b = this.binaryFn(b, a.fn, this.relational())), b
        }, additive: function () {
            for (var a, b = this.multiplicative(); a = this.expect("+", "-");)b = this.binaryFn(b, a.fn, this.multiplicative());
            return b
        }, multiplicative: function () {
            for (var a, b = this.unary(); a = this.expect("*", "/", "%");)b = this.binaryFn(b, a.fn, this.unary());
            return b
        }, unary: function () {
            var a;
            return this.expect("+") ? this.primary() : (a = this.expect("-")) ? this.binaryFn(Xd.ZERO, a.fn, this.unary()) : (a = this.expect("!")) ? this.unaryFn(a.fn, this.unary()) : this.primary()
        }, fieldAccess: function (a) {
            var b = this, c = this.expect().text, d = pc(c, this.options, this.text);
            return l(function (b, c, e) {
                return d(e || a(b, c), c)
            }, {assign: function (d, e, f) {
                return nc(a(d, f), c, e, b.text, b.options)
            }})
        }, objectIndex: function (a) {
            var b = this, d = this.expression();
            return this.consume("]"), l(function (e, f) {
                var g, h, i = a(e, f), j = d(e, f);
                return i ? (g = mc(i[j], b.text), g && g.then && b.options.unwrapPromises && (h = g, "$$v"in g || (h.$$v = c, h.then(function (a) {
                    h.$$v = a
                })), g = g.$$v), g) : c
            }, {assign: function (c, e, f) {
                var g = d(c, f), h = mc(a(c, f), b.text);
                return h[g] = e
            }})
        }, functionCall: function (a, b) {
            var c = [];
            if (")" !== this.peekToken().text)do c.push(this.expression()); while (this.expect(","));
            this.consume(")");
            var d = this;
            return function (e, f) {
                for (var g = [], h = b ? b(e, f) : e, i = 0; i < c.length; i++)g.push(c[i](e, f));
                var j = a(e, f, h) || o;
                mc(h, d.text), mc(j, d.text);
                var k = j.apply ? j.apply(h, g) : j(g[0], g[1], g[2], g[3], g[4]);
                return mc(k, d.text)
            }
        }, arrayDeclaration: function () {
            var a = [], b = !0;
            if ("]" !== this.peekToken().text)do {
                var c = this.expression();
                a.push(c), c.constant || (b = !1)
            } while (this.expect(","));
            return this.consume("]"), l(function (b, c) {
                for (var d = [], e = 0; e < a.length; e++)d.push(a[e](b, c));
                return d
            }, {literal: !0, constant: b})
        }, object: function () {
            var a = [], b = !0;
            if ("}" !== this.peekToken().text)do {
                var c = this.expect(), d = c.string || c.text;
                this.consume(":");
                var e = this.expression();
                a.push({key: d, value: e}), e.constant || (b = !1)
            } while (this.expect(","));
            return this.consume("}"), l(function (b, c) {
                for (var d = {}, e = 0; e < a.length; e++) {
                    var f = a[e];
                    d[f.key] = f.value(b, c)
                }
                return d
            }, {literal: !0, constant: b})
        }};
        var Yd = {}, Zd = d("$sce"), $d = {HTML: "html", CSS: "css", URL: "url", RESOURCE_URL: "resourceUrl", JS: "js"}, _d = b.createElement("a"), ae = Cc(a.location.href, !0);
        Fc.$inject = ["$provide"], Hc.$inject = ["$locale"], Ic.$inject = ["$locale"];
        var be = ".", ce = {yyyy: Lc("FullYear", 4), yy: Lc("FullYear", 2, 0, !0), y: Lc("FullYear", 1), MMMM: Mc("Month"), MMM: Mc("Month", !0), MM: Lc("Month", 2, 1), M: Lc("Month", 1, 1), dd: Lc("Date", 2), d: Lc("Date", 1), HH: Lc("Hours", 2), H: Lc("Hours", 1), hh: Lc("Hours", 2, -12), h: Lc("Hours", 1, -12), mm: Lc("Minutes", 2), m: Lc("Minutes", 1), ss: Lc("Seconds", 2), s: Lc("Seconds", 1), sss: Lc("Milliseconds", 3), EEEE: Mc("Day"), EEE: Mc("Day", !0), a: Oc, Z: Nc}, de = /((?:[^yMdHhmsaZE']+)|(?:'(?:[^']|'')*')|(?:E+|y+|M+|d+|H+|h+|m+|s+|a|Z))(.*)/, ee = /^\-?\d+$/;
        Pc.$inject = ["$locale"];
        var fe = q(ad), ge = q(bd);
        Sc.$inject = ["$parse"];
        var he = q({restrict: "E", compile: function (a, c) {
            return 8 >= ed && (c.href || c.name || c.$set("href", ""), a.append(b.createComment("IE fix"))), function (a, b) {
                b.on("click", function (a) {
                    b.attr("href") || a.preventDefault()
                })
            }
        }}), ie = {};
        f(Bd, function (a, b) {
            if ("multiple" != a) {
                var c = Kb("ng-" + b);
                ie[c] = function () {
                    return{priority: 100, compile: function () {
                        return function (a, d, e) {
                            a.$watch(e[c], function (a) {
                                e.$set(b, !!a)
                            })
                        }
                    }}
                }
            }
        }), f(["src", "srcset", "href"], function (a) {
            var b = Kb("ng-" + a);
            ie[b] = function () {
                return{priority: 99, link: function (c, d, e) {
                    e.$observe(b, function (b) {
                        b && (e.$set(a, b), ed && d.prop(a, e[a]))
                    })
                }}
            }
        });
        var je = {$addControl: o, $removeControl: o, $setValidity: o, $setDirty: o, $setPristine: o};
        Uc.$inject = ["$element", "$attrs", "$scope"];
        var ke = function (a) {
            return["$timeout", function (b) {
                var d = {name: "form", restrict: a ? "EAC" : "E", controller: Uc, compile: function () {
                    return{pre: function (a, d, e, f) {
                        if (!e.action) {
                            var g = function (a) {
                                a.preventDefault ? a.preventDefault() : a.returnValue = !1
                            };
                            vd(d[0], "submit", g), d.on("$destroy", function () {
                                b(function () {
                                    wd(d[0], "submit", g)
                                }, 0, !1)
                            })
                        }
                        var h = d.parent().controller("form"), i = e.name || e.ngForm;
                        i && nc(a, i, f, i), h && d.on("$destroy", function () {
                            h.$removeControl(f), i && nc(a, i, c, i), l(f, je)
                        })
                    }}
                }};
                return d
            }]
        }, le = ke(), me = ke(!0), ne = /^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/, oe = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}$/, pe = /^\s*(\-|\+)?(\d+|(\d*(\.\d*)))\s*$/, qe = {text: Vc, number: Wc, url: Xc, email: Yc, radio: Zc, checkbox: $c, hidden: o, button: o, submit: o, reset: o}, re = ["$browser", "$sniffer", function (a, b) {
            return{restrict: "E", require: "?ngModel", link: function (c, d, e, f) {
                f && (qe[ad(e.type)] || qe.text)(c, d, e, f, b, a)
            }}
        }], se = "ng-valid", te = "ng-invalid", ue = "ng-pristine", ve = "ng-dirty", we = ["$scope", "$exceptionHandler", "$attrs", "$element", "$parse", function (a, b, c, e, g) {
            function h(a, b) {
                b = b ? "-" + _(b, "-") : "", e.removeClass((a ? te : se) + b).addClass((a ? se : te) + b)
            }

            this.$viewValue = Number.NaN, this.$modelValue = Number.NaN, this.$parsers = [], this.$formatters = [], this.$viewChangeListeners = [], this.$pristine = !0, this.$dirty = !1, this.$valid = !0, this.$invalid = !1, this.$name = c.name;
            var i = g(c.ngModel), j = i.assign;
            if (!j)throw d("ngModel")("nonassign", "Expression '{0}' is non-assignable. Element: {1}", c.ngModel, T(e));
            this.$render = o, this.$isEmpty = function (a) {
                return r(a) || "" === a || null === a || a !== a
            };
            var k = e.inheritedData("$formController") || je, l = 0, m = this.$error = {};
            e.addClass(ue), h(!0), this.$setValidity = function (a, b) {
                m[a] !== !b && (b ? (m[a] && l--, l || (h(!0), this.$valid = !0, this.$invalid = !1)) : (h(!1), this.$invalid = !0, this.$valid = !1, l++), m[a] = !b, h(b, a), k.$setValidity(a, b, this))
            }, this.$setPristine = function () {
                this.$dirty = !1, this.$pristine = !0, e.removeClass(ve).addClass(ue)
            }, this.$setViewValue = function (c) {
                this.$viewValue = c, this.$pristine && (this.$dirty = !0, this.$pristine = !1, e.removeClass(ue).addClass(ve), k.$setDirty()), f(this.$parsers, function (a) {
                    c = a(c)
                }), this.$modelValue !== c && (this.$modelValue = c, j(a, c), f(this.$viewChangeListeners, function (a) {
                    try {
                        a()
                    } catch (c) {
                        b(c)
                    }
                }))
            };
            var n = this;
            a.$watch(function () {
                var b = i(a);
                if (n.$modelValue !== b) {
                    var c = n.$formatters, d = c.length;
                    for (n.$modelValue = b; d--;)b = c[d](b);
                    n.$viewValue !== b && (n.$viewValue = b, n.$render())
                }
            })
        }], xe = function () {
            return{require: ["ngModel", "^?form"], controller: we, link: function (a, b, c, d) {
                var e = d[0], f = d[1] || je;
                f.$addControl(e), a.$on("$destroy", function () {
                    f.$removeControl(e)
                })
            }}
        }, ye = q({require: "ngModel", link: function (a, b, c, d) {
            d.$viewChangeListeners.push(function () {
                a.$eval(c.ngChange)
            })
        }}), ze = function () {
            return{require: "?ngModel", link: function (a, b, c, d) {
                if (d) {
                    c.required = !0;
                    var e = function (a) {
                        return c.required && d.$isEmpty(a) ? void d.$setValidity("required", !1) : (d.$setValidity("required", !0), a)
                    };
                    d.$formatters.push(e), d.$parsers.unshift(e), c.$observe("required", function () {
                        e(d.$viewValue)
                    })
                }
            }}
        }, Ae = function () {
            return{require: "ngModel", link: function (a, b, d, e) {
                var g = /\/(.*)\//.exec(d.ngList), h = g && new RegExp(g[1]) || d.ngList || ",", i = function (a) {
                    if (!r(a)) {
                        var b = [];
                        return a && f(a.split(h), function (a) {
                            a && b.push(pd(a))
                        }), b
                    }
                };
                e.$parsers.push(i), e.$formatters.push(function (a) {
                    return x(a) ? a.join(", ") : c
                }), e.$isEmpty = function (a) {
                    return!a || !a.length
                }
            }}
        }, Be = /^(true|false|\d+)$/, Ce = function () {
            return{priority: 100, compile: function (a, b) {
                return Be.test(b.ngValue) ? function (a, b, c) {
                    c.$set("value", a.$eval(c.ngValue))
                } : function (a, b, c) {
                    a.$watch(c.ngValue, function (a) {
                        c.$set("value", a)
                    })
                }
            }}
        }, De = Tc(function (a, b, d) {
            b.addClass("ng-binding").data("$binding", d.ngBind), a.$watch(d.ngBind, function (a) {
                b.text(a == c ? "" : a)
            })
        }), Ee = ["$interpolate", function (a) {
            return function (b, c, d) {
                var e = a(c.attr(d.$attr.ngBindTemplate));
                c.addClass("ng-binding").data("$binding", e), d.$observe("ngBindTemplate", function (a) {
                    c.text(a)
                })
            }
        }], Fe = ["$sce", "$parse", function (a, b) {
            return function (c, d, e) {
                function f() {
                    return(g(c) || "").toString()
                }

                d.addClass("ng-binding").data("$binding", e.ngBindHtml);
                var g = b(e.ngBindHtml);
                c.$watch(f, function () {
                    d.html(a.getTrustedHtml(g(c)) || "")
                })
            }
        }], Ge = _c("", !0), He = _c("Odd", 0), Ie = _c("Even", 1), Je = Tc({compile: function (a, b) {
            b.$set("ngCloak", c), a.removeClass("ng-cloak")
        }}), Ke = [function () {
            return{scope: !0, controller: "@", priority: 500}
        }], Le = {};
        f("click dblclick mousedown mouseup mouseover mouseout mousemove mouseenter mouseleave keydown keyup keypress submit focus blur copy cut paste".split(" "), function (a) {
            var b = Kb("ng-" + a);
            Le[b] = ["$parse", function (c) {
                return{compile: function (d, e) {
                    var f = c(e[b]);
                    return function (b, c) {
                        c.on(ad(a), function (a) {
                            b.$apply(function () {
                                f(b, {$event: a})
                            })
                        })
                    }
                }}
            }]
        });
        var Me = ["$animate", function (a) {
            return{transclude: "element", priority: 600, terminal: !0, restrict: "A", $$tlb: !0, link: function (c, d, e, f, g) {
                var h, i;
                c.$watch(e.ngIf, function (f) {
                    S(f) ? i || (i = c.$new(), g(i, function (c) {
                        h = {startNode: c[0], endNode: c[c.length++] = b.createComment(" end ngIf: " + e.ngIf + " ")}, a.enter(c, d.parent(), d)
                    })) : (i && (i.$destroy(), i = null), h && (a.leave(fb(h)), h = null))
                })
            }}
        }], Ne = ["$http", "$templateCache", "$anchorScroll", "$compile", "$animate", "$sce", function (a, b, c, d, e, f) {
            return{restrict: "ECA", priority: 400, terminal: !0, transclude: "element", compile: function (g, h) {
                var i = h.ngInclude || h.src, j = h.onload || "", k = h.autoscroll;
                return function (g, h, l, m, n) {
                    var p, q, r = 0, t = function () {
                        p && (p.$destroy(), p = null), q && (e.leave(q), q = null)
                    };
                    g.$watch(f.parseAsResourceUrl(i), function (f) {
                        var i = function () {
                            !s(k) || k && !g.$eval(k) || c()
                        }, l = ++r;
                        f ? (a.get(f, {cache: b}).success(function (a) {
                            if (l === r) {
                                var b = g.$new(), c = n(b, o);
                                t(), p = b, q = c, q.html(a), e.enter(q, null, h, i), d(q.contents())(p), p.$emit("$includeContentLoaded"), g.$eval(j)
                            }
                        }).error(function () {
                            l === r && t()
                        }), g.$emit("$includeContentRequested")) : t()
                    })
                }
            }}
        }], Oe = Tc({compile: function () {
            return{pre: function (a, b, c) {
                a.$eval(c.ngInit)
            }}
        }}), Pe = Tc({terminal: !0, priority: 1e3}), Qe = ["$locale", "$interpolate", function (a, b) {
            var c = /{}/g;
            return{restrict: "EA", link: function (d, e, g) {
                var h = g.count, i = g.$attr.when && e.attr(g.$attr.when), j = g.offset || 0, k = d.$eval(i) || {}, l = {}, m = b.startSymbol(), n = b.endSymbol(), o = /^when(Minus)?(.+)$/;
                f(g, function (a, b) {
                    o.test(b) && (k[ad(b.replace("when", "").replace("Minus", "-"))] = e.attr(g.$attr[b]))
                }), f(k, function (a, d) {
                    l[d] = b(a.replace(c, m + h + "-" + j + n))
                }), d.$watch(function () {
                    var b = parseFloat(d.$eval(h));
                    return isNaN(b) ? "" : (b in k || (b = a.pluralCat(b - j)), l[b](d, e, !0))
                }, function (a) {
                    e.text(a)
                })
            }}
        }], Re = ["$parse", "$animate", function (a, c) {
            var g = "$$NG_REMOVED", h = d("ngRepeat");
            return{transclude: "element", priority: 1e3, terminal: !0, $$tlb: !0, link: function (d, i, j, k, l) {
                var m, n, o, p, q, r, s, t, u, v = j.ngRepeat, w = v.match(/^\s*(.+)\s+in\s+(.*?)\s*(\s+track\s+by\s+(.+)\s*)?$/), x = {$id: Ab};
                if (!w)throw h("iexp", "Expected expression in form of '_item_ in _collection_[ track by _id_]' but got '{0}'.", v);
                if (r = w[1], s = w[2], m = w[4], m ? (n = a(m), o = function (a, b, c) {
                    return u && (x[u] = a), x[t] = b, x.$index = c, n(d, x)
                }) : (p = function (a, b) {
                    return Ab(b)
                }, q = function (a) {
                    return a
                }), w = r.match(/^(?:([\$\w]+)|\(([\$\w]+)\s*,\s*([\$\w]+)\))$/), !w)throw h("iidexp", "'_item_' in '_item_ in _collection_' should be an identifier or '(_key_, _value_)' expression, but got '{0}'.", r);
                t = w[3] || w[1], u = w[2];
                var y = {};
                d.$watchCollection(s, function (a) {
                    var j, k, m, n, r, s, w, x, z, A, B, C, D = i[0], E = {}, F = [];
                    if (e(a))A = a, z = o || p; else {
                        z = o || q, A = [];
                        for (s in a)a.hasOwnProperty(s) && "$" != s.charAt(0) && A.push(s);
                        A.sort()
                    }
                    for (n = A.length, k = F.length = A.length, j = 0; k > j; j++)if (s = a === A ? j : A[j], w = a[s], x = z(s, w, j), db(x, "`track by` id"), y.hasOwnProperty(x))B = y[x], delete y[x], E[x] = B, F[j] = B; else {
                        if (E.hasOwnProperty(x))throw f(F, function (a) {
                            a && a.startNode && (y[a.id] = a)
                        }), h("dupes", "Duplicates in a repeater are not allowed. Use 'track by' expression to specify unique keys. Repeater: {0}, Duplicate key: {1}", v, x);
                        F[j] = {id: x}, E[x] = !1
                    }
                    for (s in y)y.hasOwnProperty(s) && (B = y[s], C = fb(B), c.leave(C), f(C, function (a) {
                        a[g] = !0
                    }), B.scope.$destroy());
                    for (j = 0, k = A.length; k > j; j++) {
                        if (s = a === A ? j : A[j], w = a[s], B = F[j], F[j - 1] && (D = F[j - 1].endNode), B.startNode) {
                            r = B.scope, m = D;
                            do m = m.nextSibling; while (m && m[g]);
                            B.startNode != m && c.move(fb(B), null, fd(D)), D = B.endNode
                        } else r = d.$new();
                        r[t] = w, u && (r[u] = s), r.$index = j, r.$first = 0 === j, r.$last = j === n - 1, r.$middle = !(r.$first || r.$last), r.$odd = !(r.$even = 0 === (1 & j)), B.startNode || l(r, function (a) {
                            a[a.length++] = b.createComment(" end ngRepeat: " + v + " "), c.enter(a, null, fd(D)), D = a, B.scope = r, B.startNode = D && D.endNode ? D.endNode : a[0], B.endNode = a[a.length - 1], E[B.id] = B
                        })
                    }
                    y = E
                })
            }}
        }], Se = ["$animate", function (a) {
            return function (b, c, d) {
                b.$watch(d.ngShow, function (b) {
                    a[S(b) ? "removeClass" : "addClass"](c, "ng-hide")
                })
            }
        }], Te = ["$animate", function (a) {
            return function (b, c, d) {
                b.$watch(d.ngHide, function (b) {
                    a[S(b) ? "addClass" : "removeClass"](c, "ng-hide")
                })
            }
        }], Ue = Tc(function (a, b, c) {
            a.$watch(c.ngStyle, function (a, c) {
                c && a !== c && f(c, function (a, c) {
                    b.css(c, "")
                }), a && b.css(a)
            }, !0)
        }), Ve = ["$animate", function (a) {
            return{restrict: "EA", require: "ngSwitch", controller: ["$scope", function () {
                this.cases = {}
            }], link: function (b, c, d, e) {
                var g, h, i = d.ngSwitch || d.on, j = [];
                b.$watch(i, function (c) {
                    for (var i = 0, k = j.length; k > i; i++)j[i].$destroy(), a.leave(h[i]);
                    h = [], j = [], (g = e.cases["!" + c] || e.cases["?"]) && (b.$eval(d.change), f(g, function (c) {
                        var d = b.$new();
                        j.push(d), c.transclude(d, function (b) {
                            var d = c.element;
                            h.push(b), a.enter(b, d.parent(), d)
                        })
                    }))
                })
            }}
        }], We = Tc({transclude: "element", priority: 800, require: "^ngSwitch", compile: function (a, b) {
            return function (a, c, d, e, f) {
                e.cases["!" + b.ngSwitchWhen] = e.cases["!" + b.ngSwitchWhen] || [], e.cases["!" + b.ngSwitchWhen].push({transclude: f, element: c})
            }
        }}), Xe = Tc({transclude: "element", priority: 800, require: "^ngSwitch", link: function (a, b, c, d, e) {
            d.cases["?"] = d.cases["?"] || [], d.cases["?"].push({transclude: e, element: b})
        }}), Ye = Tc({controller: ["$element", "$transclude", function (a, b) {
            if (!b)throw d("ngTransclude")("orphan", "Illegal use of ngTransclude directive in the template! No parent directive that requires a transclusion found. Element: {0}", T(a));
            this.$transclude = b
        }], link: function (a, b, c, d) {
            d.$transclude(function (a) {
                b.html(""), b.append(a)
            })
        }}), Ze = ["$templateCache", function (a) {
            return{restrict: "E", terminal: !0, compile: function (b, c) {
                if ("text/ng-template" == c.type) {
                    var d = c.id, e = b[0].text;
                    a.put(d, e)
                }
            }}
        }], $e = d("ngOptions"), _e = q({terminal: !0}), af = ["$compile", "$parse", function (a, d) {
            var e = /^\s*(.*?)(?:\s+as\s+(.*?))?(?:\s+group\s+by\s+(.*))?\s+for\s+(?:([\$\w][\$\w]*)|(?:\(\s*([\$\w][\$\w]*)\s*,\s*([\$\w][\$\w]*)\s*\)))\s+in\s+(.*?)(?:\s+track\s+by\s+(.*?))?$/, h = {$setViewValue: o};
            return{restrict: "E", require: ["select", "?ngModel"], controller: ["$element", "$scope", "$attrs", function (a, b, c) {
                var d, e, f = this, g = {}, i = h;
                f.databound = c.ngModel, f.init = function (a, b, c) {
                    i = a, d = b, e = c
                }, f.addOption = function (b) {
                    db(b, '"option value"'), g[b] = !0, i.$viewValue == b && (a.val(b), e.parent() && e.remove())
                }, f.removeOption = function (a) {
                    this.hasOption(a) && (delete g[a], i.$viewValue == a && this.renderUnknownOption(a))
                }, f.renderUnknownOption = function (b) {
                    var c = "? " + Ab(b) + " ?";
                    e.val(c), a.prepend(e), a.val(c), e.prop("selected", !0)
                }, f.hasOption = function (a) {
                    return g.hasOwnProperty(a)
                }, b.$on("$destroy", function () {
                    f.renderUnknownOption = o
                })
            }], link: function (h, i, j, k) {
                function l(a, b, c, d) {
                    c.$render = function () {
                        var a = c.$viewValue;
                        d.hasOption(a) ? (z.parent() && z.remove(), b.val(a), "" === a && o.prop("selected", !0)) : r(a) && o ? b.val("") : d.renderUnknownOption(a)
                    }, b.on("change", function () {
                        a.$apply(function () {
                            z.parent() && z.remove(), c.$setViewValue(b.val())
                        })
                    })
                }

                function m(a, b, c) {
                    var d;
                    c.$render = function () {
                        var a = new Bb(c.$viewValue);
                        f(b.find("option"), function (b) {
                            b.selected = s(a.get(b.value))
                        })
                    }, a.$watch(function () {
                        K(d, c.$viewValue) || (d = I(c.$viewValue), c.$render())
                    }), b.on("change", function () {
                        a.$apply(function () {
                            var a = [];
                            f(b.find("option"), function (b) {
                                b.selected && a.push(b.value)
                            }), c.$setViewValue(a)
                        })
                    })
                }

                function n(b, f, h) {
                    function i() {
                        var a, c, d, e, i, j, q, u, A, B, C, D, E, F, G, H = {"": []}, I = [""], J = h.$modelValue, K = p(b) || [], L = m ? g(K) : K, M = {}, N = !1;
                        if (t)if (r && x(J)) {
                            N = new Bb([]);
                            for (var O = 0; O < J.length; O++)M[l] = J[O], N.put(r(b, M), J[O])
                        } else N = new Bb(J);
                        for (C = 0; A = L.length, A > C; C++) {
                            if (q = C, m) {
                                if (q = L[C], "$" === q.charAt(0))continue;
                                M[m] = q
                            }
                            if (M[l] = K[q], a = n(b, M) || "", (c = H[a]) || (c = H[a] = [], I.push(a)), t)D = s(N.remove(r ? r(b, M) : o(b, M))); else {
                                if (r) {
                                    var P = {};
                                    P[l] = J, D = r(b, P) === r(b, M)
                                } else D = J === o(b, M);
                                N = N || D
                            }
                            G = k(b, M), G = s(G) ? G : "", c.push({id: r ? r(b, M) : m ? L[C] : C, label: G, selected: D})
                        }
                        for (t || (v || null === J ? H[""].unshift({id: "", label: "", selected: !N}) : N || H[""].unshift({id: "?", label: "", selected: !0})), B = 0, u = I.length; u > B; B++) {
                            for (a = I[B], c = H[a], z.length <= B ? (e = {element: y.clone().attr("label", a), label: c.label}, i = [e], z.push(i), f.append(e.element)) : (i = z[B], e = i[0], e.label != a && e.element.attr("label", e.label = a)), E = null, C = 0, A = c.length; A > C; C++)d = c[C], (j = i[C + 1]) ? (E = j.element, j.label !== d.label && E.text(j.label = d.label), j.id !== d.id && E.val(j.id = d.id), E[0].selected !== d.selected && E.prop("selected", j.selected = d.selected)) : ("" === d.id && v ? F = v : (F = w.clone()).val(d.id).attr("selected", d.selected).text(d.label), i.push(j = {element: F, label: d.label, id: d.id, selected: d.selected}), E ? E.after(F) : e.element.append(F), E = F);
                            for (C++; i.length > C;)i.pop().element.remove()
                        }
                        for (; z.length > B;)z.pop()[0].element.remove()
                    }

                    var j;
                    if (!(j = u.match(e)))throw $e("iexp", "Expected expression in form of '_select_ (as _label_)? for (_key_,)?_value_ in _collection_' but got '{0}'. Element: {1}", u, T(f));
                    var k = d(j[2] || j[1]), l = j[4] || j[6], m = j[5], n = d(j[3] || ""), o = d(j[2] ? j[1] : l), p = d(j[7]), q = j[8], r = q ? d(j[8]) : null, z = [
                        [
                            {element: f, label: ""}
                        ]
                    ];
                    v && (a(v)(b), v.removeClass("ng-scope"), v.remove()), f.html(""), f.on("change", function () {
                        b.$apply(function () {
                            var a, d, e, g, i, j, k, n, q, s = p(b) || [], u = {};
                            if (t) {
                                for (e = [], j = 0, n = z.length; n > j; j++)for (a = z[j], i = 1, k = a.length; k > i; i++)if ((g = a[i].element)[0].selected) {
                                    if (d = g.val(), m && (u[m] = d), r)for (q = 0; q < s.length && (u[l] = s[q], r(b, u) != d); q++); else u[l] = s[d];
                                    e.push(o(b, u))
                                }
                            } else if (d = f.val(), "?" == d)e = c; else if ("" === d)e = null; else if (r) {
                                for (q = 0; q < s.length; q++)if (u[l] = s[q], r(b, u) == d) {
                                    e = o(b, u);
                                    break
                                }
                            } else u[l] = s[d], m && (u[m] = d), e = o(b, u);
                            h.$setViewValue(e)
                        })
                    }), h.$render = i, b.$watch(i)
                }

                if (k[1]) {
                    for (var o, p = k[0], q = k[1], t = j.multiple, u = j.ngOptions, v = !1, w = fd(b.createElement("option")), y = fd(b.createElement("optgroup")), z = w.clone(), A = 0, B = i.children(), C = B.length; C > A; A++)if ("" === B[A].value) {
                        o = v = B.eq(A);
                        break
                    }
                    if (p.init(q, v, z), t && (j.required || j.ngRequired)) {
                        var D = function (a) {
                            return q.$setValidity("required", !j.required || a && a.length), a
                        };
                        q.$parsers.push(D), q.$formatters.unshift(D), j.$observe("required", function () {
                            D(q.$viewValue)
                        })
                    }
                    u ? n(h, i, q) : t ? m(h, i, q) : l(h, i, q, p)
                }
            }}
        }], bf = ["$interpolate", function (a) {
            var b = {addOption: o, removeOption: o};
            return{restrict: "E", priority: 100, compile: function (c, d) {
                if (r(d.value)) {
                    var e = a(c.text(), !0);
                    e || d.$set("value", c.text())
                }
                return function (a, c, d) {
                    var f = "$selectController", g = c.parent(), h = g.data(f) || g.parent().data(f);
                    h && h.databound ? c.prop("selected", !1) : h = b, e ? a.$watch(e, function (a, b) {
                        d.$set("value", a), a !== b && h.removeOption(b), h.addOption(a)
                    }) : h.addOption(d.value), c.on("$destroy", function () {
                        h.removeOption(d.value)
                    })
                }
            }}
        }], cf = q({restrict: "E", terminal: !0});
        ab(), hb(nd), fd(b).ready(function () {
            Z(b, $)
        })
    }(window, document), !angular.$$csp() && angular.element(document).find("head").prepend('<style type="text/css">@charset "UTF-8";[ng\\:cloak],[ng-cloak],[data-ng-cloak],[x-ng-cloak],.ng-cloak,.x-ng-cloak,.ng-hide{display:none !important;}ng\\:form{display:block;}.ng-animate-start{border-spacing:1px 1px;-ms-zoom:1.0001;}.ng-animate-active{border-spacing:0px 0px;-ms-zoom:1;}</style>'), define("angular", function (a) {
        return function () {
            var b;
            return b || a.angular
        }
    }(this)), function (a, b, c) {
        "use strict";
        function d(a) {
            return null != a && "" !== a && "hasOwnProperty" !== a && g.test("." + a)
        }

        function e(a, b) {
            if (!d(b))throw f("badmember", 'Dotted member path "@{0}" is invalid.', b);
            for (var e = b.split("."), g = 0, h = e.length; h > g && a !== c; g++) {
                var i = e[g];
                a = null !== a ? a[i] : c
            }
            return a
        }

        var f = b.$$minErr("$resource"), g = /^(\.[a-zA-Z_$][0-9a-zA-Z_$]*)+$/;
        b.module("ngResource", ["ng"]).factory("$resource", ["$http", "$q", function (a, d) {
            function g(a) {
                return h(a, !0).replace(/%26/gi, "&").replace(/%3D/gi, "=").replace(/%2B/gi, "+")
            }

            function h(a, b) {
                return encodeURIComponent(a).replace(/%40/gi, "@").replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%20/g, b ? "%20" : "+")
            }

            function i(a, b) {
                this.template = a, this.defaults = b || {}, this.urlParams = {}
            }

            function j(g, h, q) {
                function r(a, b) {
                    var c = {};
                    return b = n({}, h, b), m(b, function (b, d) {
                        p(b) && (b = b()), c[d] = b && b.charAt && "@" == b.charAt(0) ? e(a, b.substr(1)) : b
                    }), c
                }

                function s(a) {
                    return a.resource
                }

                function t(a) {
                    o(a || {}, this)
                }

                var u = new i(g);
                return q = n({}, k, q), m(q, function (e, g) {
                    var h = /^(POST|PUT|PATCH)$/i.test(e.method);
                    t[g] = function (g, i, j, k) {
                        var q, v, w, x = {};
                        switch (arguments.length) {
                            case 4:
                                w = k, v = j;
                            case 3:
                            case 2:
                                if (!p(i)) {
                                    x = g, q = i, v = j;
                                    break
                                }
                                if (p(g)) {
                                    v = g, w = i;
                                    break
                                }
                                v = i, w = j;
                            case 1:
                                p(g) ? v = g : h ? q = g : x = g;
                                break;
                            case 0:
                                break;
                            default:
                                throw f("badargs", "Expected up to 4 arguments [params, data, success, error], got {0} arguments", arguments.length)
                        }
                        var y = this instanceof t, z = y ? q : e.isArray ? [] : new t(q), A = {}, B = e.interceptor && e.interceptor.response || s, C = e.interceptor && e.interceptor.responseError || c;
                        m(e, function (a, b) {
                            "params" != b && "isArray" != b && "interceptor" != b && (A[b] = o(a))
                        }), h && (A.data = q), u.setUrlParams(A, n({}, r(q, e.params || {}), x), e.url);
                        var D = a(A).then(function (a) {
                            var c = a.data, d = z.$promise;
                            if (c) {
                                if (b.isArray(c) !== !!e.isArray)throw f("badcfg", "Error in resource configuration. Expected response to contain an {0} but got an {1}", e.isArray ? "array" : "object", b.isArray(c) ? "array" : "object");
                                e.isArray ? (z.length = 0, m(c, function (a) {
                                    z.push(new t(a))
                                })) : (o(c, z), z.$promise = d)
                            }
                            return z.$resolved = !0, a.resource = z, a
                        }, function (a) {
                            return z.$resolved = !0, (w || l)(a), d.reject(a)
                        });
                        return D = D.then(function (a) {
                            var b = B(a);
                            return(v || l)(b, a.headers), b
                        }, C), y ? D : (z.$promise = D, z.$resolved = !1, z)
                    }, t.prototype["$" + g] = function (a, b, c) {
                        p(a) && (c = b, b = a, a = {});
                        var d = t[g].call(this, a, this, b, c);
                        return d.$promise || d
                    }
                }), t.bind = function (a) {
                    return j(g, n({}, h, a), q)
                }, t
            }

            var k = {get: {method: "GET"}, save: {method: "POST"}, query: {method: "GET", isArray: !0}, remove: {method: "DELETE"}, "delete": {method: "DELETE"}}, l = b.noop, m = b.forEach, n = b.extend, o = b.copy, p = b.isFunction;
            return i.prototype = {setUrlParams: function (a, c, d) {
                var e, h, i = this, j = d || i.template, k = i.urlParams = {};
                m(j.split(/\W/), function (a) {
                    if ("hasOwnProperty" === a)throw f("badname", "hasOwnProperty is not a valid parameter name.");
                    !new RegExp("^\\d+$").test(a) && a && new RegExp("(^|[^\\\\]):" + a + "(\\W|$)").test(j) && (k[a] = !0)
                }), j = j.replace(/\\:/g, ":"), c = c || {}, m(i.urlParams, function (a, d) {
                    e = c.hasOwnProperty(d) ? c[d] : i.defaults[d], b.isDefined(e) && null !== e ? (h = g(e), j = j.replace(new RegExp(":" + d + "(\\W|$)", "g"), h + "$1")) : j = j.replace(new RegExp("(/?):" + d + "(\\W|$)", "g"), function (a, b, c) {
                        return"/" == c.charAt(0) ? c : b + c
                    })
                }), j = j.replace(/\/+$/, ""), j = j.replace(/\/\.(?=\w+($|\?))/, "."), a.url = j.replace(/\/\\\./, "/."), m(c, function (b, c) {
                    i.urlParams[c] || (a.params = a.params || {}, a.params[c] = b)
                })
            }}, j
        }])
    }(window, window.angular), define("angular-resource", ["angular"], function () {
    }), function (a, b) {
        "use strict";
        function c() {
            function a(a, c) {
                return b.extend(new (b.extend(function () {
                }, {prototype: a})), c)
            }

            function c(a, b) {
                var c = b.caseInsensitiveMatch, d = {originalPath: a, regexp: a}, e = d.keys = [];
                return a = a.replace(/([().])/g, "\\$1").replace(/(\/)?:(\w+)([\?|\*])?/g,function (a, b, c, d) {
                    var f = "?" === d ? d : null, g = "*" === d ? d : null;
                    return e.push({name: c, optional: !!f}), b = b || "", "" + (f ? "" : b) + "(?:" + (f ? b : "") + (g && "(.+?)" || "([^/]+)") + (f || "") + ")" + (f || "")
                }).replace(/([\/$\*])/g, "\\$1"), d.regexp = new RegExp("^" + a + "$", c ? "i" : ""), d
            }

            var d = {};
            this.when = function (a, e) {
                if (d[a] = b.extend({reloadOnSearch: !0}, e, a && c(a, e)), a) {
                    var f = "/" == a[a.length - 1] ? a.substr(0, a.length - 1) : a + "/";
                    d[f] = b.extend({redirectTo: a}, c(f, e))
                }
                return this
            }, this.otherwise = function (a) {
                return this.when(null, a), this
            }, this.$get = ["$rootScope", "$location", "$routeParams", "$q", "$injector", "$http", "$templateCache", "$sce", function (c, e, f, g, h, i, j, k) {
                function l(a, b) {
                    var c = b.keys, d = {};
                    if (!b.regexp)return null;
                    var e = b.regexp.exec(a);
                    if (!e)return null;
                    for (var f = 1, g = e.length; g > f; ++f) {
                        var h = c[f - 1], i = "string" == typeof e[f] ? decodeURIComponent(e[f]) : e[f];
                        h && i && (d[h.name] = i)
                    }
                    return d
                }

                function m() {
                    var a = n(), d = q.current;
                    a && d && a.$$route === d.$$route && b.equals(a.pathParams, d.pathParams) && !a.reloadOnSearch && !p ? (d.params = a.params, b.copy(d.params, f), c.$broadcast("$routeUpdate", d)) : (a || d) && (p = !1, c.$broadcast("$routeChangeStart", a, d), q.current = a, a && a.redirectTo && (b.isString(a.redirectTo) ? e.path(o(a.redirectTo, a.params)).search(a.params).replace() : e.url(a.redirectTo(a.pathParams, e.path(), e.search())).replace()), g.when(a).then(function () {
                        if (a) {
                            var c, d, e = b.extend({}, a.resolve);
                            return b.forEach(e, function (a, c) {
                                e[c] = b.isString(a) ? h.get(a) : h.invoke(a)
                            }), b.isDefined(c = a.template) ? b.isFunction(c) && (c = c(a.params)) : b.isDefined(d = a.templateUrl) && (b.isFunction(d) && (d = d(a.params)), d = k.getTrustedResourceUrl(d), b.isDefined(d) && (a.loadedTemplateUrl = d, c = i.get(d, {cache: j}).then(function (a) {
                                return a.data
                            }))), b.isDefined(c) && (e.$template = c), g.all(e)
                        }
                    }).then(function (e) {
                        a == q.current && (a && (a.locals = e, b.copy(a.params, f)), c.$broadcast("$routeChangeSuccess", a, d))
                    }, function (b) {
                        a == q.current && c.$broadcast("$routeChangeError", a, d, b)
                    }))
                }

                function n() {
                    var c, f;
                    return b.forEach(d, function (d) {
                        !f && (c = l(e.path(), d)) && (f = a(d, {params: b.extend({}, e.search(), c), pathParams: c}), f.$$route = d)
                    }), f || d[null] && a(d[null], {params: {}, pathParams: {}})
                }

                function o(a, c) {
                    var d = [];
                    return b.forEach((a || "").split(":"), function (a, b) {
                        if (0 === b)d.push(a); else {
                            var e = a.match(/(\w+)(.*)/), f = e[1];
                            d.push(c[f]), d.push(e[2] || ""), delete c[f]
                        }
                    }), d.join("")
                }

                var p = !1, q = {routes: d, reload: function () {
                    p = !0, c.$evalAsync(m)
                }};
                return c.$on("$locationChangeSuccess", m), q
            }]
        }

        function d() {
            this.$get = function () {
                return{}
            }
        }

        function e(a, c, d, e, f) {
            return{restrict: "ECA", terminal: !0, priority: 400, transclude: "element", link: function (g, h, i, j, k) {
                function l() {
                    n && (n.$destroy(), n = null), o && (f.leave(o), o = null)
                }

                function m() {
                    var i = a.current && a.current.locals, j = i && i.$template;
                    if (j) {
                        var m = g.$new(), r = k(m, b.noop);
                        r.html(j), f.enter(r, null, o || h, function () {
                            !b.isDefined(p) || p && !g.$eval(p) || c()
                        }), l();
                        var s = d(r.contents()), t = a.current;
                        if (n = t.scope = m, o = r, t.controller) {
                            i.$scope = n;
                            var u = e(t.controller, i);
                            t.controllerAs && (n[t.controllerAs] = u), r.data("$ngControllerController", u), r.children().data("$ngControllerController", u)
                        }
                        s(n), n.$emit("$viewContentLoaded"), n.$eval(q)
                    } else l()
                }

                var n, o, p = i.autoscroll, q = i.onload || "";
                g.$on("$routeChangeSuccess", m), m()
            }}
        }

        var f = b.module("ngRoute", ["ng"]).provider("$route", c);
        f.provider("$routeParams", d), f.directive("ngView", e), e.$inject = ["$route", "$anchorScroll", "$compile", "$controller", "$animate"]
    }(window, window.angular), define("angular-route", ["angular"], function () {
    }), function (a, b, c) {
        "use strict";
        b.module("ngCookies", ["ng"]).factory("$cookies", ["$rootScope", "$browser", function (a, d) {
            function e() {
                var a, e, f, i;
                for (a in h)k(g[a]) && d.cookies(a, c);
                for (a in g)e = g[a], b.isString(e) ? e !== h[a] && (d.cookies(a, e), i = !0) : b.isDefined(h[a]) ? g[a] = h[a] : delete g[a];
                if (i) {
                    i = !1, f = d.cookies();
                    for (a in g)g[a] !== f[a] && (k(f[a]) ? delete g[a] : g[a] = f[a], i = !0)
                }
            }

            var f, g = {}, h = {}, i = !1, j = b.copy, k = b.isUndefined;
            return d.addPollFn(function () {
                var b = d.cookies();
                f != b && (f = b, j(b, h), j(b, g), i && a.$apply())
            })(), i = !0, a.$watch(e), g
        }]).factory("$cookieStore", ["$cookies", function (a) {
            return{get: function (c) {
                var d = a[c];
                return d ? b.fromJson(d) : d
            }, put: function (c, d) {
                a[c] = b.toJson(d)
            }, remove: function (b) {
                delete a[b]
            }}
        }])
    }(window, window.angular), define("angular-cookies", ["angular"], function () {
    }), function (a) {
        a.module("route-segment", []).provider("$routeSegment", ["$routeProvider", function (b) {
            function c(a) {
                return a.replace(/([\:\-\_]+(.))/g, function (a, b, c, d) {
                    return d ? c.toUpperCase() : c
                })
            }

            function d(a, b) {
                if (!a)throw new Error("Invalid pointer segment");
                var e;
                return{segment: function (b, d) {
                    return a[c(b)] = {params: d}, e = b, this
                }, within: function (b) {
                    var g;
                    if (b = b || e, g = a[c(b)])"undefined" == typeof g.children && (g.children = {}); else {
                        if (f.strictMode)throw new Error("Cannot get into unknown `" + b + "` segment");
                        g = a[c(b)] = {params: {}, children: {}}
                    }
                    return d(g.children, this)
                }, up: function () {
                    return b
                }, root: function () {
                    return h
                }}
            }

            var e = this, f = e.options = {autoLoadTemplates: !1, strictMode: !1}, g = this.segments = {}, h = d(g, null);
            e.when = function (a, c) {
                return b.when(a, {segment: c}), this
            }, a.extend(e, h), this.$get = ["$rootScope", "$q", "$http", "$templateCache", "$route", "$routeParams", "$injector", function (b, d, e, h, i, j, k) {
                function l(b) {
                    var c = !1;
                    return b.params.dependencies && a.forEach(b.params.dependencies, function (b) {
                        a.equals(r.$routeParams[b], j[b]) || (c = !0)
                    }), c
                }

                function m(a, b) {
                    return r.chain[a] && r.chain[a].clearWatcher && r.chain[a].clearWatcher(), b ? (q[a] = b.name, b.params && b.params.untilResolved ? n(a, b.name, b.params.untilResolved).then(function (c) {
                        return"undefined" != typeof c.success && o(a), n(a, b.name, b.params)
                    }) : n(a, b.name, b.params)) : (q[a] = null, void o(a))
                }

                function n(c, g, i) {
                    var j = a.extend({}, i.resolve);
                    return a.forEach(j, function (b, c) {
                        j[c] = a.isString(b) ? k.get(b) : k.invoke(b)
                    }), i.template && (j.$template = i.template), f.autoLoadTemplates && i.templateUrl && (j.$template = e.get(a.isFunction(i.templateUrl) ? i.templateUrl() : i.templateUrl, {cache: h}).then(function (a) {
                        return a.data
                    })), d.all(j).then(function (e) {
                        if (q[c] != g)return d.reject();
                        if (r.chain[c] = {name: g, params: i, locals: e, reload: function () {
                            m(c, this).then(function (a) {
                                "undefined" != typeof a.success && o(c)
                            })
                        }}, i.watcher) {
                            var f = function () {
                                if (!a.isFunction(i.watcher))throw new Error("Watcher is not a function in segment `" + g + "`");
                                return k.invoke(i.watcher, {}, {segment: r.chain[c]})
                            }, h = f();
                            r.chain[c].clearWatcher = b.$watch(f, function (a) {
                                a != h && (h = a, r.chain[c].reload())
                            })
                        }
                        return{success: c}
                    }, function (b) {
                        if (i.resolveFailed) {
                            var e = {error: function () {
                                return d.when(b)
                            }};
                            return n(c, g, a.extend({resolve: e}, i.resolveFailed))
                        }
                        throw new Error("Resolving failed with a reason `" + b + "`, but no `resolveFailed` provided for segment `" + g + "`")
                    })
                }

                function o(c) {
                    r.$routeParams = a.copy(j), r.name = "";
                    for (var d = 0; d < r.chain.length; d++)r.name += r.chain[d].name + ".";
                    r.name = r.name.substr(0, r.name.length - 1), b.$broadcast("routeSegmentChange", {index: c, segment: r.chain[c] || null})
                }

                function p(a, b) {
                    if (!b)return null;
                    if (a >= b.length)return null;
                    for (var d, e = g, f = 0; a >= f; f++)d = b[f], "undefined" != typeof e[c(d)] && (e = e[c(d)]), a > f && (e = e.children);
                    return{name: d, params: e.params}
                }

                var q = {}, r = {name: "", $routeParams: a.copy(j), chain: [], startsWith: function (a) {
                    var b = new RegExp("^" + a);
                    return b.test(r.name)
                }, contains: function (a) {
                    for (var b = 0; b < this.chain.length; b++)if (this.chain[b].name == a)return!0;
                    return!1
                }, reload: function () {
                    q = {}, this.chain = [], this.name = "", i.reload()
                }};
                return b.$on("$routeChangeSuccess", function (a, b) {
                    var c = b.$route || b.$$route;
                    if (c && c.segment) {
                        for (var e = c.segment, f = e.split("."), g = [], h = 0; h < f.length; h++) {
                            var i = p(h, f);
                            (q[h] != i.name || l(i)) && (r.chain[h] && r.chain[h].name == i.name && !l(i) ? q[h] = i.name : g.push({index: h, newSegment: i}))
                        }
                        var j = d.when();
                        if (g.length > 0)for (h = 0; h < g.length; h++)!function (a) {
                            j = j.then(function () {
                                return m(g[a].index, g[a].newSegment)
                            }).then(function (a) {
                                "undefined" != typeof a.success && o(a.success)
                            })
                        }(h);
                        j.then(function () {
                            if (r.chain.length > f.length) {
                                var a = r.chain.length, b = r.chain.length - f.length;
                                r.chain.splice(-b, b);
                                for (var c = f.length; a > c; c++)m(c, null)
                            }
                        })
                    }
                }), r
            }]
        }])
    }(angular), function (a) {
        a.module("view-segment", ["route-segment"]).directive("appViewSegment", ["$route", "$compile", "$controller", "$routeParams", "$routeSegment", "$q", "$injector", function (b, c, d, e, f, g, h) {
            return{restrict: "ECA", priority: 500, compile: function (b, e) {
                var g = b.html(), i = !0, j = a.element(document.createComment(" view-segment "));
                return b.prepend(j), function (k) {
                    function l() {
                        o && (q.leave(o), o = null), n && (n.$destroy(), n = null)
                    }

                    function m(e) {
                        if (p = e, i && (i = !1, b.replaceWith(j)), !e)return l(), o = b.clone(), o.html(g), q.enter(o, null, j), void c(o, !1, 499)(k);
                        var f = a.extend({}, e.locals), h = f && f.$template;
                        l(), o = b.clone(), o.html(h ? h : g), q.enter(o, null, j);
                        var m, s = c(o, !1, 499);
                        n = k.$new(), e.params.controller && (f.$scope = n, m = d(e.params.controller, f), e.params.controllerAs && (n[e.params.controllerAs] = m), o.data("$ngControllerController", m), o.children().data("$ngControllerController", m)), s(n), n.$emit("$viewContentLoaded"), n.$eval(r)
                    }

                    var n, o, p, q, r = e.onload || "", s = parseInt(e.appViewSegment);
                    try {
                        var t = h.get("$animator");
                        q = t(k, e)
                    } catch (u) {
                    }
                    try {
                        q = h.get("$animate")
                    } catch (u) {
                    }
                    f.chain[s] && m(f.chain[s]), k.$on("routeSegmentChange", function (a, b) {
                        b.index == s && p != b.segment && m(b.segment)
                    })
                }
            }}
        }])
    }(angular), define("angular-route-segment", ["angular", "angular-route"], function () {
    }), !function () {
        function a(a) {
            return["$rootScope", "$window", function (b, c) {
                for (var d, e, f, g = c[a] || (console.warn("This browser does not support Web Storage!"), {}), h = {$default: function (a) {
                    for (var b in a)angular.isDefined(h[b]) || (h[b] = a[b]);
                    return h
                }, $reset: function (a) {
                    for (var b in h)"$" === b[0] || delete h[b];
                    return h.$default(a)
                }}, i = 0; i < g.length; i++)(f = g.key(i)) && "ngStorage-" === f.slice(0, 10) && (h[f.slice(10)] = angular.fromJson(g.getItem(f)));
                return d = angular.copy(h), b.$watch(function () {
                    e || (e = setTimeout(function () {
                        if (e = null, !angular.equals(h, d)) {
                            angular.forEach(h, function (a, b) {
                                angular.isDefined(a) && "$" !== b[0] && g.setItem("ngStorage-" + b, angular.toJson(a)), delete d[b]
                            });
                            for (var a in d)g.removeItem("ngStorage-" + a);
                            d = angular.copy(h)
                        }
                    }, 100))
                }), "localStorage" === a && c.addEventListener && c.addEventListener("storage", function (a) {
                    "ngStorage-" === a.key.slice(0, 10) && (a.newValue ? h[a.key.slice(10)] = angular.fromJson(a.newValue) : delete h[a.key.slice(10)], d = angular.copy(h), b.$apply())
                }), h
            }]
        }

        angular.module("ngStorage", []).factory("$localStorage", a("localStorage")).factory("$sessionStorage", a("sessionStorage"))
    }(), define("ngstorage", ["angular"], function () {
    }), define("bz/app", ["angular", "angular-resource", "angular-route", "angular-cookies", "angular-route-segment", "ngstorage"], function (a) {
        "use strict";
        return a.module("bz", ["ngResource", "ngRoute", "ngCookies", "ngLocale", "route-segment", "view-segment", "ngStorage"])
    }), define("bz/factories/bzInterceptorBuffer", ["bz/app"], function (a) {
        "use strict";
        a.factory("bzInterceptorBuffer", ["$injector", function (a) {
            function b(b, d) {
                function e(a) {
                    d.resolve(a)
                }

                function f(a) {
                    d.reject(a)
                }

                c = c || a.get("$http"), c(b).then(e, f)
            }

            var c, d = [];
            return{append: function (a, b) {
                d.push({config: a, deferred: b})
            }, retryAll: function (a) {
                for (var c = 0; c < d.length; ++c)b(a(d[c].config), d[c].deferred);
                d = []
            }}
        }])
    }), define("bz/interceptors/status403", ["angular", "bz/app", "bz/factories/bzInterceptorBuffer"], function () {
        "use strict";
        return["$rootScope", "$q", "bzInterceptorBuffer", function (a, b, c) {
            function d(a) {
                return a
            }

            function e(d) {
                if (403 === d.status && !d.config.ignoreAuthModule) {
                    var e = b.defer();
                    return c.append(d.config, e), a.$broadcast("$user:loginRequired"), e.promise
                }
                return b.reject(d)
            }

            return a.$on("baUserLogin", function () {
                var a = function (a) {
                    return a
                };
                c.retryAll(a)
            }), function (a) {
                return a.then(d, e)
            }
        }]
    }), define("bz/interceptors/jwtInterceptor", ["angular", "bz/app"], function (a, b) {
        "use strict";
        b.factory("jwtInterceptor", ["$rootScope", "$q", "$window", "$cookieStore", function (b, c, d, e) {
            var f = d.localStorage ? function (a, b) {
                d.localStorage[a] = b
            } : function (a, b) {
                e.put(a, b)
            }, g = d.localStorage ? function (a) {
                return d.localStorage[a] || null
            } : function (a) {
                return e.get(a)
            };
            return{request: function (b) {
                var c = g("token");
                return b.headers = b.headers || {}, "undefined" != c && a.isDefined(c) && (b.headers.Authorization = "Bearer " + c), b
            }, response: function (a) {
                return 401 === a.status, a || c.when(a)
            }, setToken: function (a) {
                f("token", a)
            }}
        }]), b.config(["$httpProvider", function (a) {
            a.interceptors.push("jwtInterceptor")
        }])
    }), define("bz/providers/bzConfig", ["angular", "bz/app"], function (a, b) {
        "use strict";
        b.provider("bzConfig", [function () {
            var b = {api: "/api/v1", templatePrefix: "", languages: ["en"], checkSessionOnStart: !1, errorTemplates: {403: "views/error/403.html", 404: "views/error/404.html"}};
            this.errorResolver = function () {
                return{template: '<div ng-include="templateUrl"></div>', controller: ["$scope", "error", function (a, c) {
                    a.error = c, a.templateUrl = b.errorTemplates[c.status]
                }]}
            }, this.api = function (a) {
                return b.api = a, this
            }, this.templatePrefix = function (a) {
                return b.templatePrefix = a, this
            }, this.checkSessionOnStart = function (a) {
                return b.checkSessionOnStart = a, this
            }, this.templateUrl = function (a) {
                return function () {
                    var c = b.templatePrefix + a;
                    return c
                }
            }, this.languages = function (a) {
                return b.languages = a, this
            }, b = a.isDefined(window.bazalt) ? a.extend(b, window.bazalt) : b, this.$get = ["$log", function (a) {
                a.debug("Configuration:", b);
                var c = this;
                return{templatePrefix: function () {
                    return b.templatePrefix
                }, templateUrl: function (a) {
                    return c.templateUrl(a)
                }, checkSessionOnStart: function () {
                    return b.checkSessionOnStart
                }, api: function () {
                    return b.api
                }, resource: function (a) {
                    return b.api + a
                }, languages: function () {
                    return b.languages
                }}
            }]
        }])
    }), define("bz/providers/bzLanguage", ["angular", "bz/app", "bz/providers/bzConfig"], function (a, b) {
        "use strict";
        b.provider("bzLanguage", ["$localeProvider", function (b) {
            this.$language = b.$get().id.substring(0, 2), this.id = function (a) {
                return this.$language = a, this
            }, this.$get = ["$log", "$rootScope", "bzConfig", function (b, c, d) {
                var e = this;
                return b.debug("Language: " + e.$language), {id: function (f) {
                    if (a.isDefined(f)) {
                        var g = e.$language;
                        if (-1 == d.languages().indexOf(f))throw new Error('Language "' + f + '" not allowed');
                        c.$emit("$languageChangeStart", f, g), e.$language = f, b.debug("Language: " + f), c.$emit("$languageChangeSuccess", f, g)
                    }
                    return e.$language
                }}
            }]
        }])
    }), define("bz/factories/bzSessionFactory", ["angular", "bz/app", "bz/providers/bzConfig"], function (a, b) {
        "use strict";
        b.factory("bzSessionFactory", ["$resource", "bzConfig", "$cookieStore", "$q", "$log", "jwtInterceptor", "$localStorage", function (b, c, d, e, f, g, h) {
            var i, j = b(c.resource("/auth/session"), {}, {renew: {method: "PUT"}, changeRole: {method: "PUT", params: {action: "changeRole"}}, $login: {method: "POST"}, $logout: {method: "DELETE"}}), k = e.defer(), l = {is_guest: !0, permissions: ["guest"]};
            return j.prototype.$login = function (b, c, d) {
                j.$login(b, function (b) {
                    i.$set(b), (c = c || a.noop)(i)
                }, d)
            }, j.prototype.$logout = function (b, c) {
                j.$logout({}, function (c) {
                    c = a.copy(l), i.$set(c), g.setToken(void 0), (b = b || a.noop)(i)
                }, c)
            }, j.prototype.$set = function (b) {
                var c = a.copy(i);
                a.copy(b, this), k.notify({user: i, old: c})
            }, j.prototype.$update = function (b, c) {
                var d = a.copy(i);
                this.$renew(function (c) {
                    k.notify({user: c, old: d}), (b = b || a.noop)(c)
                }, c)
            }, j.prototype.$change = function (a) {
                return k.promise.then(null, null, a)
            }, j.prototype.$changeRole = function (b, c, d) {
                j.changeRole({role_id: b}, function (b) {
                    i.$set(b), (c = c || a.noop)(i)
                }, d)
            }, j.prototype.has = function (b) {
                var c = this.permissions || [];
                return a.isArray(b) || (b = [b]), !b.diff(c).length
            }, f.debug("Session in localStorage:", h.baAuthUser), i = new j(h.baAuthUser || a.copy(l)), i.$change(function () {
                i.jwt_token && (f.info("Set JWT token: " + i.jwt_token), g.setToken(i.jwt_token)), h.baAuthUser = i
            }), i
        }])
    }), define("bz/helpers/filter", [], function () {
        "use strict";
        Array.prototype.filter || (Array.prototype.filter = function (a) {
            var b = [];
            a = a || function () {
            };
            for (var c = 0, d = this.length; d > c; c++)a(this[c]) && b.push(this[c]);
            return b
        })
    }), define("bz/helpers/indexOf", [], function () {
        "use strict";
        Array.prototype.indexOf || (Array.prototype.indexOf = function (a, b) {
            null == b ? b = 0 : 0 > b && (b = Math.max(0, this.length + b));
            for (var c = b, d = this.length; d > c; c++)if (this[c] === a)return c;
            return-1
        })
    }), define("bz/helpers/diff", ["bz/helpers/filter", "bz/helpers/indexOf"], function () {
        "use strict";
        Array.prototype.diff || (Array.prototype.diff = function (a) {
            return this.filter(function (b) {
                return!(a.indexOf(b) > -1)
            })
        })
    }), define("bz/providers/bzUser", ["angular", "bz/app", "bz/factories/bzSessionFactory", "bz/helpers/diff"], function (a, b) {
        "use strict";
        b.provider("bzUser", [function () {
            this.access = function () {
                var a = arguments;
                return["$q", "bzUser", "$log", "$rootScope", function (b, c, d, e) {
                    for (var f = b.defer(), g = !1, h = 0, i = []; h < a.length && (i = a[h].diff(c.permissions || []), !(g = !i.length)); h++);
                    return 0 == a.length || g ? f.resolve(a) : (d.debug("User haven't permissions:", i), e.$emit("$user:pemissionDenied", i), f.reject({status: "403", message: "Permission denied", permissions: a, diff: i, user: c})), f.promise
                }]
            }, this.$get = ["bzSessionFactory", "$cookieStore", "$rootScope", "bzConfig", "$q", function (a, b, c, d) {
                var e = a;
                return d.checkSessionOnStart() && a.$update(), e
            }]
        }])
    }), define("bz/directives/a", ["bz/app"], function (a) {
        return a.directive("a", ["bzLanguage", "$location", function () {
            return{restrict: "E", compile: function () {
                return function (a, b, c) {
                    c.href && !angular.isDefined(c.bzLangIgnore) && a.$on("$languageChangeSuccess", function (a, b, d) {
                        var e = "/" + d + "/", f = c.href;
                        -1 != f.indexOf(e) && (f = f.replace(e, "/" + b + "/"), c.$set("href", f))
                    })
                }
            }}
        }]), a
    }), define("bz/directives/bzLoadingContainer", ["bz/app"], function (a) {
        a.directive("bzLoadingContainer", function () {
            return{restrict: "A", scope: !1, link: function (a, b, c) {
                var d = angular.element(document.createElement("div")).addClass("bz-loading ng-hide");
                b.addClass("bz-loading-container").append(d), a.$watch(c.bzLoadingContainer, function (a) {
                    d.toggleClass("ng-hide", !a)
                })
            }}
        })
    }), define("bz/directives/bzThumb", ["bz/app"], function (a) {
        return a.value("presetMediaQueries", {"default": "only screen and (min-width: 1px)", small: "only screen and (min-width: 768px)", medium: "only screen and (min-width: 1280px)", large: "only screen and (min-width: 1440px)", landscape: "only screen and (orientation: landscape)", portrait: "only screen and (orientation: portrait)", retina: "only screen and (-webkit-min-device-pixel-ratio: 2), only screen and (min--moz-device-pixel-ratio: 2), only screen and (-o-min-device-pixel-ratio: 2/1), only screen and (min-device-pixel-ratio: 2), only screen and (min-resolution: 192dpi), only screen and (min-resolution: 2dppx)"}), a.directive("bzThumb", ["presetMediaQueries", "$timeout", "$parse", function (a, b, c) {
            return{restrict: "A", priority: 100, scope: {ngSrc: "=image", thumbnails: "=bzThumb", presets: "@"}, link: function (d, e) {
                function f(c) {
                    j || (b(function () {
                        angular.forEach(i, function (a) {
                            a.mql.removeListener(a.listener)
                        }), i = [];
                        var b;
                        angular.forEach(c, function (d, e) {
                            if (c.hasOwnProperty(e)) {
                                a.hasOwnProperty(e) && (e = a[e]);
                                var g = matchMedia(e);
                                g.matches && (b = d);
                                var h = function () {
                                    f(c)
                                };
                                g.addListener(h), i.push({mql: g, listener: h})
                            }
                        }), b && g.hasOwnProperty(b) && console.info(g[b]), e.attr("src", b || d.image), j = !1
                    }, 0), j = !0)
                }

                var g;
                if ("function" != typeof matchMedia)throw"Function 'matchMedia' does not exist";
                var h, i = [], j = !1;
                d.$watch("thumbnails", function (a) {
                    if (!angular.isObject(a))throw"Expected evaluate bz-thumb to evaluate to an object, instead got: " + a;
                    f(a), angular.isFunction(h) && h()
                }), d.$watch("presets", function (a) {
                    g = c(a)(d)
                })
            }}
        }]), a
    }), define("bz/filters/translate", ["bz/app"], function (a) {
        a.filter("translate", ["$rootScope", function (a) {
            return function (b) {
                var c = a.$localeBundle || {};
                return c[b] || b
            }
        }])
    }), define("bz/filters/language", ["bz/app", "bz/providers/bzLanguage"], function (a) {
        "use strict";
        a.filter("language", ["bzLanguage", function (a) {
            return function (b, c) {
                return"undefined" == typeof b || null === b ? b : (c = c || a.id(), !b[c] && b.orig ? b[b.orig] : b[c] || null)
            }
        }])
    }), define("bz", ["bz/app", "bz/interceptors/status403", "bz/interceptors/jwtInterceptor", "bz/providers/bzLanguage", "bz/providers/bzConfig", "bz/providers/bzUser", "bz/directives/a", "bz/directives/bzLoadingContainer", "bz/directives/bzThumb", "bz/filters/translate", "bz/filters/language"], function (a, b) {
        return a.config(["$httpProvider", function (a) {
            a.defaults.withCredentials = !0, a.responseInterceptors.push(b)
        }]), a.run(["$rootScope", "bzLanguage", "bzConfig", "$location", "$log", "$route", "bzUser", "$routeSegment", function (a, b, c, d, e, f, g, h) {
            e.debug("Thanks for using Bazalt CMS (http://bazalt-cms.com) by Vitalii Savchuk (esvit666@gmail.com)"), a.$language = b, a.$config = c, a.$user = g, g.$change(function (a) {
                var b = a.old, c = a.user;
                !angular.isDefined(b) || b.id == c.id && angular.equals(b.permissions, c.permissions) || (e.debug("User changed:", c, "old:", b), h.reload())
            }), a.$on("$locationChangeStart", function (a, g) {
                for (var h = c.languages(), i = h.length, j = 0; i > j; j++) {
                    var k, l = h[j];
                    if ((k = g.indexOf("/" + l + "/")) > 0) {
                        g = g.substring(k + 3), b.id() != l && (e.debug("Set language: ", l), b.id(l)), e.debug("Redirect to: ", g), a.preventDefault(), d.url(g, !0), f.reload();
                        break
                    }
                }
            })
        }]), a
    }), define("bz", ["bz/run"], function (a) {
        return a
    })
}();
//# sourceMappingURL=bz.map