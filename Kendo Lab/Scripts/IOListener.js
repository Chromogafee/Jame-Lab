/**
 *                                             
 *   --.-- .--. .             .                      .-.    .  
 *     |  :    :|      o     _|_                    (   ) .'|  
 *     |  |    ||      .  .--.|  .-. .--. .-. .--.    .'    |  
 *     |  :    ;|      |  `--.| (.-' |  |(.-' |      /      |  
 *   --'-- `--' '---'-' `-`--'`-'`--''  `-`--''     '---'o'---' Beluga
 *   
 * IOListener
 * Author: Ta
 * Create: Oct 2013
 * Fork: Jun 2014, base: 2.0 Alpaca
 * ver: 2.1.2 Beluga
 */

debug = false;//(new RegExp("[\\?&]" + "devport=4956")).exec(location.search) !== null;
IO_PORT = "4956";
logLevel = 1;

function llog() {
    if (!debug || objKey(arguments).length === 0)
        return false;
    arguments = Array.prototype.slice.call(arguments, 0);
    var level = arguments.shift();
    if (logLevel >= level) {
        console.log('IOListener log' + level + '/' + logLevel + ':', arguments);
        //console.log.apply(this, arguments);
    }
}

function objKey(o) {
    if (typeof Object.keys === 'function') {
        return Object.keys(o);
    }
    else {
        var c = 0;
        for (var i in o)
            c++;
        return c;
    }
}

(function ($, window, document, undefined) {

    if (typeof window.IOListener === 'object')
        return;

    //Fallback function
    function createObject(obj) {
        function f() {
        }
        ;
        f.prototype = obj;
        return new f();
    }

    var subdomain = window.location.hostname.match(/(?:http[s]*\:\/\/)*(.*?)\.(?=[^\/]*\..{2,5})/i);
    var ajaxByJsonp = !((subdomain || false) && (subdomain[1] === 'www' || subdomain[1] === 'wwwback'));
    var ajaxToBack = ((subdomain || false) && (subdomain[1] === 'dev' || subdomain[1] === 'wwwback' || subdomain[1] === 'myback2'));

    function preURL(path) {
        console.log(ajaxByJsonp ? ('http://' + (ajaxToBack ? 'wwwback' : 'www') + '.dek-d.com' + path) : (path));
        return ajaxByJsonp ? ('http://' + (ajaxToBack ? 'wwwback' : 'www') + '.dek-d.com' + path) : (path);
    }

    function preJSON() {
        console.log(ajaxByJsonp ? 'jsonp' : 'json');
        //return ajaxByJsonp ? 'jsonp' : 'json';
        return 'json';
    }

    //cookie manager
    cookie = {
        set: function (name, value, expires, path, domain, secure) {
            document.cookie = name + "=" + escape(value) +
                    ((expires) ? "; expires=" + expires.toGMTString() : "") +
                    ((path) ? "; path=" + path : "") +
                    ((domain) ? "; domain=" + domain : "") +
                    ((secure) ? "; secure" : "");
        },
        get: function (name) {
            var dc = document.cookie;
            var prefix = name + "=";
            var begin = dc.indexOf("; " + prefix);
            if (begin == -1) {
                begin = dc.indexOf(prefix);
                if (begin != 0)
                    return null;
            } else {
                begin += 2;
            }
            var end = document.cookie.indexOf(";", begin);
            if (end == -1) {
                end = dc.length;
            }
            return unescape(dc.substring(begin + prefix.length, end));
        },
        remove: function (name, path, domain) {
            if (this.get(name)) {
                document.cookie = name + "=" +
                        ((path) ? "; path=" + path : "") +
                        ((domain) ? "; domain=" + domain : "") +
                        "; expires=Thu, 01-Jan-70 00:00:01 GMT";
            }
        }
    };

    var SPACE_SEPARATOR = ' ';
    var CLASS_SEPARATOR = '.';

    var App = (function () {

        //temp io object, used when src socket.io script is not loaded (waiting for it finish state)
        // The deferred used on nodejs ready
        var __io = {
            temporaryEmit: {},
            emit: function (c, params) {
                if (typeof this.temporaryEmit[c] === 'undefined')
                    this.temporaryEmit[c] = [];
                this.temporaryEmit[c].push(params);
                llog(3, 'dummy temporaryEmit', c, params);
            },
            temporaryOn: {},
            on: function (o, params) {
                if (typeof this.temporaryOn[o] === 'undefined')
                    this.temporaryOn[o] = [];
                this.temporaryOn[o].push(params);
                llog(3, 'dummy temporaryOn', o, params);
            }
        };

        //store public method api
        var __core = {};

        var setIOReady = false;
        var token = null;
        var enableStatus = false;
        var lastSettingInfo = { section: null, member: null, client: null, custom: null };
        var listening_list = {};
        var interval_list = {};
        var max_interval_list = 100;

        //Event that Library provided, call through .when()
        var buildin_event = {
            connect: function (options, callback) {
                __core.on('connect', options, callback);
                return __core.when();
            },
            disconnect: function (options, callback) {
                __core.on('disconnect', options, callback);
                return __core.when();
            },
            registed: function (options, callback) {
                __core.on('sys/setting', options, callback);
                return __core.when();
            },
            nowOnline: function (options, callback) {
                __core.on('onliner/listenStateChange', options, callback);
                return __core.when();
            },
            end: function () {
                return __core;
            }
        };

        function sys_init() {
            __io.on('sys/construct', function () {
                llog(4, "__io.on('construct')");
                __core.construct();
            });

            __io.on('sys/setting', function (info) {
                llog(4, "__io.on('sys/setting')");
                token = info.token;
            });

            __io.on('sys/resetMember', function (info) {
                llog(4, "__io.on('sys/resetMember')");
                var dev = '';//http://dev.dek-d.com';
                try {
                    $.ajax({
                        url: preURL(dev + '/api/broadcast/ajax'),
                        dataType: preJSONP('json'),
                        data: { request: 'reauth' },
                        xhrFields: {
                            withCredentials: true
                        },
                        success: function (res) {
                            llog(4, "__io.emit('setMember', { cookie: cookie.get('PHPSESSID') });", res.status, lastSettingInfo.member, cookie.get('PHPSESSID'));
                            if (res.status && lastSettingInfo.member != cookie.get('PHPSESSID')) {
                                llog(4, 'setMember', cookie.get('PHPSESSID'));
                                __io.emit('setMember', { cookie: cookie.get('PHPSESSID') });
                            }
                        }
                    });
                }
                catch (e) {
                }
            });
        }

        function dummyFunction() {
            //DONOTTHING
        }

        /*
         * compile string format in case of "name.class:op1=val1,op2=val2" to readable object
         * @param string cmd
         * @returns {listen: string, Class: string, options: 
         */
        function query_compiler(str, option) {

            var CMD_SPLITER = {
                main: ':',
                each: ',',
                assign: '='
            };

            str = str.split(CMD_SPLITER.main);
            var query = str.shift(), listen, Class, split;
            function p_str(str) {
                return $.trim(str);
            }

            split = p_str(query).split(CLASS_SEPARATOR);
            listen = split[0];
            Class = split.length > 1 ? '' + split.slice(1).join(SPACE_SEPARATOR) + '' : '';

            var options = {};
            if (str.length >= 1) {
                str = str.shift().split(CMD_SPLITER.each).map(p_str);
                for (var i in str) {
                    var cur = str[i].split(CMD_SPLITER.assign).map(p_str);
                    options[cur[0]] = cur.length >= 2 ? cur[1] : null;
                }
            }

            options = $.extend({ Class: Class }, options, option);

            return {
                listen: listen,
                Class: options.Class,
                options: options,
                query: query
            };
        }

        function global_callback(emit, args) {
            if (!enableStatus)
                return;
            llog(3, 'g.c', emit, args, listening_list);
            for (var i in listening_list[emit]) {
                if (listening_list[emit][i].enable)
                    listening_list[emit][i].callback.apply(__io, [args, parseInt(i)]);
            }
        }

        function listenIO(emit, Class, callback) {

            llog(2, 'listenIO: ', listening_list, emit, arguments);

            //push to listening list
            if (typeof listening_list[emit] === 'undefined') {
                listening_list[emit] = [];
                __io.on(emit, function (args) {
                    llog(3, 'c.o', emit, args);
                    global_callback(emit, args);
                });
            }
            listening_list[emit].push({
                emit: emit,
                callback: (typeof callback === 'function') ? callback : dummyFunction,
                Class: Class,
                enable: true
            });

            //make index on nodejs server
            __io.emit('Event.subscribe', emit);
        }

        function unlistenIO(emit, Class) {

            var clearedAll = true;

            //remove from listening list
            if (typeof Class === 'undefined' || Class === false) {
                delete listening_list[emit];
            }
            else {
                var i, j, k, keys = emit === "" ? objKey(listening_list) : (typeof listening_list[emit] !== 'undefined' ? [emit] : []);
                for (j in keys) {
                    k = keys[j];
                    for (i in listening_list[k]) {
                        if (hasMatchClass(Class, listening_list[k][i].Class)) {
                            delete listening_list[k][i];
                        }
                        else {
                            clearedAll = clearedAll && false;
                        }
                    }
                }
            }

            //unmark index on nodejs server
            if (clearedAll) {
                __io.emit('Event.unsubscribe', emit);
            }
        }

        //standard trigger
        function triggerImmediately(listen, options, callback) {
            llog(3, 'triggerImmediately', listen, options, callback);
            listenIO(listen, options.Class, callback);
        }

        //hold interval queue trigger
        function triggerInorder(listen, options, callback) {
            llog(3, 'triggerInorder', listen, options, callback);

            options.interval = parseInt(options.interval);

            llog(3, 'bind listener - interval (wait queue): ', listen);

            listenIO(listen, options.Class, function () {
                var n, limit = max_interval_list;
                //push to queue
                if (typeof interval_list[listen] === 'undefined') {
                    interval_list[listen] = [];
                }
                interval_list[listen].push(arguments);
                n = interval_list[listen].length;
                llog(4, 'current interval: ', interval_list[listen], n);

                if (n > limit) {
                    interval_list[listen] = interval_list[listen].slice(n - limit, n);
                }

                if (interval_list[listen].length > 1)
                    return;

                //call
                function inverval_func() {
                    llog(4, 'interval queue: ', interval_list[listen]);
                    if (interval_list[listen].length > 0) {
                        setTimeout(function () {
                            callback.apply(__io, interval_list[listen].shift());
                            inverval_func();
                        }, options.interval);
                    }
                }
                ;
                inverval_func();
            });
        }

        //get last broadcasted n-list in the past to trigger
        function triggerFromHistory(listen, options) {
            llog(3, 'History.getLasted', listen, options.history);
            __io.emit('History.getLasted', { trigger: listen, limit: options.history });
        }

        function startIO(emit, Class) {
            var i, j, k, keys = emit === "" ? objKey(listening_list) : (typeof listening_list[emit] !== 'undefined' ? [emit] : []);
            for (j in keys) {
                k = keys[j];
                for (i in listening_list[k]) {
                    if (listening_list[k][i].enable)
                        continue;
                    else
                        listening_list[k][i].enable = Class === false ? true : hasMatchClass(Class, listening_list[k][i].Class);
                }
            }
        }

        function stopIO(emit, Class) {
            var i, j, k, keys = emit === "" ? objKey(listening_list) : (typeof listening_list[emit] !== 'undefined' ? [emit] : []);
            for (j in keys) {
                k = keys[j];
                for (i in listening_list[k]) {
                    if (!listening_list[k][i].enable)
                        continue;
                    else
                        listening_list[k][i].enable = Class === false ? false : !hasMatchClass(Class, listening_list[k][i].Class);
                }
            }
        }

        function hasMatchClass(Class_find, Class_src) {
            var find_arr = Class_find.split(SPACE_SEPARATOR);
            for (var i in find_arr) {
                if (typeof Class_src !== 'string' || Class_src.indexOf(' ' + find_arr[i] + ' ') === -1) {
                    return false;
                }
            }
            return true;
        }

        __core = {
            VERSION: '2.1.1',
            CODENAME: 'Beluga',
            setIO: function (node) {
                if (setIOReady) {
                    return true;
                }
                if (!node) {
                    this.disable();
                }
                else {
                    var temporaryEmit = __io.temporaryEmit;
                    var temporaryOn = __io.temporaryOn;
                    llog(1, 'before setIO __io', { temporaryEmit: temporaryEmit, temporaryOn: temporaryOn });

                    __io = node;

                    sys_init();

                    var c, o, i;
                    for (c in temporaryEmit) {
                        for (i in temporaryEmit[c])
                            __io.emit(c, temporaryEmit[c][i]);
                    }
                    for (o in temporaryOn) {
                        for (i in temporaryOn[o])
                            __io.on(o, temporaryOn[o][i]);
                    }

                    enableStatus = true;
                    setIOReady = true;

                    //for debug god mode
                    /*app.on('debug', function(){
                     llog(1, 'app.on("debug"', arguments);
                     });*/
                }
                return this;
            },
            status: function () {
                return enableStatus;
            },
            info: function () {
                return {
                    enable: enableStatus,
                    listeningList: listening_list,
                    token: token,
                    ready: setIOReady,
                    regis: lastSettingInfo,
                    version: __core.VERSION,
                    codename: __core.CODENAME
                };
            },
            construct: function () {
                llog(2, 'construct');
                __io.emit('setSection', lastSettingInfo.section);
                __io.emit('setCustom', lastSettingInfo.custom);
                __io.emit('setMember', { cookie: cookie.get('PHPSESSID') });
                __io.emit('setClient', { cookie: cookie.get('NODESESSID') });
                for (var trigger in listening_list) {
                    __io.emit('Event.subscribe', trigger);
                }
            },
            //customize
            setSection: function (info) {
                lastSettingInfo.section = info;
                __io.emit('setSection', info);
                return this;
            },
            setMember: function () {
                lastSettingInfo.member = cookie.get('PHPSESSID');
                __io.emit('setMember', { cookie: cookie.get('PHPSESSID') });
                return this;
            },
            setClient: function () {
                __io.emit('setClient', { cookie: cookie.get('NODESESSID') });
                return this;
            },
            setCustom: function (info) {
                lastSettingInfo.custom = info;
                __io.emit('setCustom', info);
                return this;
            },
            on: function (listen, options, callback) {

                if (typeof listen === 'object') {
                    for (var i in listen) {
                        __core.on(i, listen[i]);
                    }
                    return this;
                }

                if (typeof options === 'function')
                    callback = options;

                if (typeof options !== 'object')
                    options = {};

                if (typeof listen !== 'string')
                    return __core.when();

                if (typeof callback !== 'function')
                    return;

                try {

                    var lisc = query_compiler(listen, options);
                    var o = $.extend({
                        Class: '',
                        interval: 0,
                        history: 0,
                        override: false,
                        dup: true
                    }, lisc.options);

                    llog(2, 'IOListener.on', lisc, o);

                    //handle duplicate
                    if ((o.dup === false || o.dup === 'false') && typeof listening_list[lisc.listen] !== 'undefined') {
                        if (listening_list[lisc.listen].filter(function (l) {
                            return hasMatchClass(lisc.Class, l.Class) && lisc.Class.split(SPACE_SEPARATOR).length === l.Class.split(SPACE_SEPARATOR).length;
                        }).length > 0)
                            return this;
                    }

                    //handle override
                    if (o.override === true || o.override === 'true') {
                        __core.off(lisc.query);
                    }

                    //handle interval
                    if (parseInt(o.interval) === 0) {
                        triggerImmediately(lisc.listen, o, callback);
                    }
                        //handle basic listening
                    else {
                        triggerInorder(lisc.listen, o, callback);
                    }

                    //handle history
                    if ((isNaN(o.history) && typeof o.history == 'string') || parseInt(o.history) > 0) {
                        triggerFromHistory(lisc.listen, o, callback);
                    }
                }
                catch (e) {
                }

                return this;
            },
            off: function (listen, Class) {
                if (typeof Class === 'string') {
                    unlistenIO(listen, Class);
                }
                else {
                    var cmd = listen.split(SPACE_SEPARATOR);
                    for (var i in cmd) {
                        if (!cmd.hasOwnProperty(i))
                            continue;
                        var tmp = cmd[i].split(CLASS_SEPARATOR);
                        unlistenIO(tmp[0], tmp.length > 1 ? tmp[1] : false);
                    }
                }
                return this;
            },
            /**
             * shorthand of call .off then bind it again with .on (same as set .on's option ":override=true")
             * @param string listen
             * @param function callback
             * @returns IOListener
             */
            override: function (listen, options, callback) {
                return __core.off(listen).on(listen, options, callback);
            },
            /**
             * shorthand of call .on with no parameters
             * __io.when({connect:func,disconnect:func}) or __io.when().connect(func).disconnect(func)
             * @returns IOListener
             */
            when: function (config) {
                var handler = buildin_event;
                if (typeof config === 'object') {
                    for (var i in config) {
                        if (typeof handler[i] === 'function')
                            handler[i](config[i]);
                    }
                }
                return handler;
            },
            enable: function (listen, Class) {
                if (typeof listen === 'string') {
                    if (typeof Class === 'string') {
                        startIO(listen, Class);
                    }
                    else {
                        var cmd = listen.split(SPACE_SEPARATOR);
                        for (var i in cmd) {
                            if (!cmd.hasOwnProperty(i))
                                continue;
                            var tmp = cmd[i].split(CLASS_SEPARATOR);
                            startIO(tmp.shift(), tmp.length > 0 ? tmp.join(SPACE_SEPARATOR) : false);
                        }
                    }
                }
                else {
                    enableStatus = true;
                }
                return this;
            },
            disable: function (listen, Class) {
                if (typeof listen === 'string') {
                    if (typeof Class === 'string') {
                        stopIO(listen, Class);
                    }
                    else {
                        var cmd = listen.split(SPACE_SEPARATOR);
                        for (var i in cmd) {
                            if (!cmd.hasOwnProperty(i))
                                continue;
                            var tmp = cmd[i].split(CLASS_SEPARATOR);
                            stopIO(tmp.shift(), tmp.length > 0 ? tmp.join(SPACE_SEPARATOR) : false);
                        }
                    }
                }
                else {
                    enableStatus = false;
                }
                return this;
            },
            clear: function () {
                listening_list = {};
                interval_list = {};
                return this;
            },
            trigger: function (emit, args) {
                var cmd = emit.split(SPACE_SEPARATOR);
                for (var i in cmd) {
                    global_callback(cmd[i], args);
                }
                return this;
            },
            __god: function (cmd, params) {
                var sapp = {
                    cookie: cookie,
                    io: __io,
                    token: token,
                    subrogate: function (user_id, username, priv_class) {
                        __io.emit('subrogate', { user_id: user_id, username: username, priv_class: priv_class });
                    }
                };
                if (typeof cmd === 'string') {
                    __io.emit(cmd, params);
                }
                return sapp;
            }
        };

        var plugin = {};

        __core.plugin = function (extension) {
            switch (extension) {
                case 'shareStorage':
                    __core.shareStorage = plugin.shareStorage;
                    break;
                case 'Neuron':
                    __core.Neuron = plugin.Neuron;
                    break;
            }
            return __core;
        };

        /*
         |----------------------------------------------------------------------
         | IOListener custom extension-plugin
         |----------------------------------------------------------------------
         */

        plugin.shareStorage = function () {
            var subApp = {
                create: function (token, timeout) {

                },
                set: function (key, val) {
                },
                get: function (key) {
                },
                use: function (token) {
                }
            };
            return subApp;
        };

        plugin.Neuron = function (token) {
            var subApp = {
                reflex: function (trigger, data) {
                    if (typeof token !== 'string')
                        return false;
                    __io.on('Neuron.reflex', { token: token, trigger: trigger, data: data });
                }
            };
            return subApp;
        };

        return createObject(__core);

    })();

    //defered loading src script from socket.io
    var loadIO_deferred = new $.Deferred();
    App.onload = loadIO_deferred;
    App.onloading = false;

    App.onload = function () {
        if (!App.onloading) {
            App.onloading = true;
            llog(1, 'call : loadNodeActivateLib()');
            $.getScript('http://node.dek-d.com:' + IO_PORT + '/socket.io/socket.io.js')
                    .done(
                    function (script, textStatus) {
                        llog(1, 'callback deferred : loadIO_deferred.resolve', script, textStatus);
                        //IOListener.onloading = false;
                        loadIO_deferred.resolve();
                    })
                    .fail(
                    function (jqxhr, settings, exception) {
                        //IOListener.onloading = false;
                        llog(1, "Triggered ajaxError handler.", jqxhr, settings, exception);
                    });
        }
        return loadIO_deferred.promise();
    }();

    window.IOListener = window.__io = App;

}(jQuery, window, document));

/*
 |=========================================================
 |  connect to NodeJS Server
 |=========================================================
 */
IOListener.onload.done(function () {

    //IOListener loaded, init
    if (typeof io === 'undefined') {
        IOListener.disable();
        return;
    }

    var node = io.connect('http://node.dek-d.com:' + IO_PORT + '');
    IOListener.setIO(node);
    llog(1, 'IOListener.onload.done', 'IOListener.setIO(node);');
    //from now, IOListener ready to use

});

//http://patorjk.com/software/taag/#p=display&f=Swan&t=IOListener%202.1