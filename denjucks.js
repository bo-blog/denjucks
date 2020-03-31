// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.

// This is a specialised implementation of a System module loader.

// @ts-nocheck
/* eslint-disable */
let System, __instantiateAsync, __instantiate;

(() => {
  const r = new Map();

  System = {
    register(id, d, f) {
      r.set(id, { d, f, exp: {} });
    },
  };

  function gC(id, main) {
    return {
      id,
      import: async (id) => r.get(id)?.exp,
      meta: { url: id, main },
    };
  }

  function gE(exp) {
    return (id, v) => {
      v = typeof id === "string" ? { [id]: v } : id;
      for (const [id, value] of Object.entries(v)) {
        Object.defineProperty(exp, id, {
          value,
          writable: true,
          enumerable: true,
        });
      }
    };
  }

  function rF(main) {
    for (const [id, m] of r.entries()) {
      const { f, exp } = m;
      const { execute: e, setters: s } = f(gE(exp), gC(id, id === main));
      delete m.f;
      m.e = e;
      m.s = s;
    }
  }

  async function gExpA(id) {
    if (!r.has(id)) return;
    const m = r.get(id);
    if (m.s) {
      const { d, e, s } = m;
      delete m.s;
      delete m.e;
      for (let i = 0; i < s.length; i++) s[i](await gExpA(d[i]));
      const r = e();
      if (r) await r;
    }
    return m.exp;
  }

  function gExp(id) {
    if (!r.has(id)) return;
    const m = r.get(id);
    if (m.s) {
      const { d, e, s } = m;
      delete m.s;
      delete m.e;
      for (let i = 0; i < s.length; i++) s[i](gExp(d[i]));
      e();
    }
    return m.exp;
  }

  __instantiateAsync = async (m) => {
    System = __instantiateAsync = __instantiate = undefined;
    rF(m);
    return gExpA(m);
  };

  __instantiate = (m) => {
    System = __instantiateAsync = __instantiate = undefined;
    rF(m);
    return gExp(m);
  };
})();

System.register("file:///home/main/Desktop/denjucks/v4/src/lib", [], function (exports_1, context_1) {
    'use strict';
    var ArrayProto, ObjProto, escapeMap, escapeRegex, lookupEscape, exports;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
            ArrayProto = Array.prototype;
            ObjProto = Object.prototype;
            escapeMap = {
                '&': '&amp;',
                '"': '&quot;',
                '\'': '&#39;',
                '<': '&lt;',
                '>': '&gt;'
            };
            escapeRegex = /[&"'<>]/g;
            lookupEscape = function (ch) {
                return escapeMap[ch];
            };
            exports = {};
            exports.prettifyError = function (path, withInternals, err) {
                // jshint -W022
                // http://jslinterrors.com/do-not-assign-to-the-exception-parameter
                if (!err.Update) {
                    // not one of ours, cast it
                    err = new exports.TemplateError(err);
                }
                err.Update(path);
                // Unless they marked the dev flag, show them a trace from here
                if (!withInternals) {
                    var old = err;
                    err = new Error(old.message);
                    err.name = old.name;
                }
                return err;
            };
            exports.TemplateError = function (message, lineno, colno) {
                var err = this;
                if (message instanceof Error) { // for casting regular js errors
                    err = message;
                    message = message.name + ': ' + message.message;
                    try {
                        if (err.name = '') { }
                    }
                    catch (e) {
                        // If we can't set the name of the error object in this
                        // environment, don't use it
                        err = this;
                    }
                }
                else {
                    if (Error.captureStackTrace) {
                        Error.captureStackTrace(err);
                    }
                }
                err.name = 'Template render error';
                err.message = message;
                err.lineno = lineno;
                err.colno = colno;
                err.firstUpdate = true;
                err.Update = function (path) {
                    var message = '(' + (path || 'unknown path') + ')';
                    // only show lineno + colno next to path of template
                    // where error occurred
                    if (this.firstUpdate) {
                        if (this.lineno && this.colno) {
                            message += ' [Line ' + this.lineno + ', Column ' + this.colno + ']';
                        }
                        else if (this.lineno) {
                            message += ' [Line ' + this.lineno + ']';
                        }
                    }
                    message += '\n ';
                    if (this.firstUpdate) {
                        message += ' ';
                    }
                    this.message = message + (this.message || '');
                    this.firstUpdate = false;
                    return this;
                };
                return err;
            };
            exports.TemplateError.prototype = Error.prototype;
            exports.escape = function (val) {
                return val.replace(escapeRegex, lookupEscape);
            };
            exports.isFunction = function (obj) {
                return ObjProto.toString.call(obj) === '[object Function]';
            };
            exports.isArray = Array.isArray || function (obj) {
                return ObjProto.toString.call(obj) === '[object Array]';
            };
            exports.isString = function (obj) {
                return ObjProto.toString.call(obj) === '[object String]';
            };
            exports.isObject = function (obj) {
                return ObjProto.toString.call(obj) === '[object Object]';
            };
            exports.groupBy = function (obj, val) {
                var result = {};
                var iterator = exports.isFunction(val) ? val : function (obj) { return obj[val]; };
                for (var i = 0; i < obj.length; i++) {
                    var value = obj[i];
                    var key = iterator(value, i);
                    (result[key] || (result[key] = [])).push(value);
                }
                return result;
            };
            exports.toArray = function (obj) {
                return Array.prototype.slice.call(obj);
            };
            exports.without = function (array) {
                var result = [];
                if (!array) {
                    return result;
                }
                var index = -1, length = array.length, contains = exports.toArray(arguments).slice(1);
                while (++index < length) {
                    if (exports.indexOf(contains, array[index]) === -1) {
                        result.push(array[index]);
                    }
                }
                return result;
            };
            exports.extend = function (obj, obj2) {
                for (var k in obj2) {
                    obj[k] = obj2[k];
                }
                return obj;
            };
            exports.repeat = function (char_, n) {
                var str = '';
                for (var i = 0; i < n; i++) {
                    str += char_;
                }
                return str;
            };
            exports.each = function (obj, func, context) {
                if (obj == null) {
                    return;
                }
                if (ArrayProto.each && obj.each === ArrayProto.each) {
                    obj.forEach(func, context);
                }
                else if (obj.length === +obj.length) {
                    for (var i = 0, l = obj.length; i < l; i++) {
                        func.call(context, obj[i], i, obj);
                    }
                }
            };
            exports.map = function (obj, func) {
                var results = [];
                if (obj == null) {
                    return results;
                }
                if (ArrayProto.map && obj.map === ArrayProto.map) {
                    return obj.map(func);
                }
                for (var i = 0; i < obj.length; i++) {
                    results[results.length] = func(obj[i], i);
                }
                if (obj.length === +obj.length) {
                    results.length = obj.length;
                }
                return results;
            };
            exports.asyncIter = function (arr, iter, cb) {
                var i = -1;
                function next() {
                    i++;
                    if (i < arr.length) {
                        iter(arr[i], i, next, cb);
                    }
                    else {
                        cb();
                    }
                }
                next();
            };
            exports.asyncFor = function (obj, iter, cb) {
                var keys = exports.keys(obj);
                var len = keys.length;
                var i = -1;
                function next() {
                    i++;
                    var k = keys[i];
                    if (i < len) {
                        iter(k, obj[k], i, len, next);
                    }
                    else {
                        cb();
                    }
                }
                next();
            };
            // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf#Polyfill
            exports.indexOf = Array.prototype.indexOf ?
                function (arr, searchElement, fromIndex) {
                    return Array.prototype.indexOf.call(arr, searchElement, fromIndex);
                } :
                function (arr, searchElement, fromIndex) {
                    var length = this.length >>> 0; // Hack to convert object.length to a UInt32
                    fromIndex = +fromIndex || 0;
                    if (Math.abs(fromIndex) === Infinity) {
                        fromIndex = 0;
                    }
                    if (fromIndex < 0) {
                        fromIndex += length;
                        if (fromIndex < 0) {
                            fromIndex = 0;
                        }
                    }
                    for (; fromIndex < length; fromIndex++) {
                        if (arr[fromIndex] === searchElement) {
                            return fromIndex;
                        }
                    }
                    return -1;
                };
            if (!Array.prototype.map) {
                Array.prototype.map = function () {
                    throw new Error('map is unimplemented for this js engine');
                };
            }
            exports.keys = function (obj) {
                if (Object.prototype.keys) {
                    return obj.keys();
                }
                else {
                    var keys = [];
                    for (var k in obj) {
                        if (obj.hasOwnProperty(k)) {
                            keys.push(k);
                        }
                    }
                    return keys;
                }
            };
            exports.inOperator = function (key, val) {
                if (exports.isArray(val)) {
                    return exports.indexOf(val, key) !== -1;
                }
                else if (exports.isObject(val)) {
                    return key in val;
                }
                else if (exports.isString(val)) {
                    return val.indexOf(key) !== -1;
                }
                else {
                    throw new Error('Cannot use "in" operator to search for "'
                        + key + '" in unexpected types.');
                }
            };
            exports_1("default", { ...exports });
        }
    };
});
System.register("https://deno.land/std/path/interface", [], function (exports_2, context_2) {
    "use strict";
    var __moduleName = context_2 && context_2.id;
    return {
        setters: [],
        execute: function () {
        }
    };
});
// Copyright the Browserify authors. MIT License.
// Ported from https://github.com/browserify/path-browserify/
System.register("https://deno.land/std/path/constants", [], function (exports_3, context_3) {
    "use strict";
    var build, CHAR_UPPERCASE_A, CHAR_LOWERCASE_A, CHAR_UPPERCASE_Z, CHAR_LOWERCASE_Z, CHAR_DOT, CHAR_FORWARD_SLASH, CHAR_BACKWARD_SLASH, CHAR_VERTICAL_LINE, CHAR_COLON, CHAR_QUESTION_MARK, CHAR_UNDERSCORE, CHAR_LINE_FEED, CHAR_CARRIAGE_RETURN, CHAR_TAB, CHAR_FORM_FEED, CHAR_EXCLAMATION_MARK, CHAR_HASH, CHAR_SPACE, CHAR_NO_BREAK_SPACE, CHAR_ZERO_WIDTH_NOBREAK_SPACE, CHAR_LEFT_SQUARE_BRACKET, CHAR_RIGHT_SQUARE_BRACKET, CHAR_LEFT_ANGLE_BRACKET, CHAR_RIGHT_ANGLE_BRACKET, CHAR_LEFT_CURLY_BRACKET, CHAR_RIGHT_CURLY_BRACKET, CHAR_HYPHEN_MINUS, CHAR_PLUS, CHAR_DOUBLE_QUOTE, CHAR_SINGLE_QUOTE, CHAR_PERCENT, CHAR_SEMICOLON, CHAR_CIRCUMFLEX_ACCENT, CHAR_GRAVE_ACCENT, CHAR_AT, CHAR_AMPERSAND, CHAR_EQUAL, CHAR_0, CHAR_9, isWindows, EOL, SEP, SEP_PATTERN;
    var __moduleName = context_3 && context_3.id;
    return {
        setters: [],
        execute: function () {
            build = Deno.build;
            // Alphabet chars.
            exports_3("CHAR_UPPERCASE_A", CHAR_UPPERCASE_A = 65); /* A */
            exports_3("CHAR_LOWERCASE_A", CHAR_LOWERCASE_A = 97); /* a */
            exports_3("CHAR_UPPERCASE_Z", CHAR_UPPERCASE_Z = 90); /* Z */
            exports_3("CHAR_LOWERCASE_Z", CHAR_LOWERCASE_Z = 122); /* z */
            // Non-alphabetic chars.
            exports_3("CHAR_DOT", CHAR_DOT = 46); /* . */
            exports_3("CHAR_FORWARD_SLASH", CHAR_FORWARD_SLASH = 47); /* / */
            exports_3("CHAR_BACKWARD_SLASH", CHAR_BACKWARD_SLASH = 92); /* \ */
            exports_3("CHAR_VERTICAL_LINE", CHAR_VERTICAL_LINE = 124); /* | */
            exports_3("CHAR_COLON", CHAR_COLON = 58); /* : */
            exports_3("CHAR_QUESTION_MARK", CHAR_QUESTION_MARK = 63); /* ? */
            exports_3("CHAR_UNDERSCORE", CHAR_UNDERSCORE = 95); /* _ */
            exports_3("CHAR_LINE_FEED", CHAR_LINE_FEED = 10); /* \n */
            exports_3("CHAR_CARRIAGE_RETURN", CHAR_CARRIAGE_RETURN = 13); /* \r */
            exports_3("CHAR_TAB", CHAR_TAB = 9); /* \t */
            exports_3("CHAR_FORM_FEED", CHAR_FORM_FEED = 12); /* \f */
            exports_3("CHAR_EXCLAMATION_MARK", CHAR_EXCLAMATION_MARK = 33); /* ! */
            exports_3("CHAR_HASH", CHAR_HASH = 35); /* # */
            exports_3("CHAR_SPACE", CHAR_SPACE = 32); /*   */
            exports_3("CHAR_NO_BREAK_SPACE", CHAR_NO_BREAK_SPACE = 160); /* \u00A0 */
            exports_3("CHAR_ZERO_WIDTH_NOBREAK_SPACE", CHAR_ZERO_WIDTH_NOBREAK_SPACE = 65279); /* \uFEFF */
            exports_3("CHAR_LEFT_SQUARE_BRACKET", CHAR_LEFT_SQUARE_BRACKET = 91); /* [ */
            exports_3("CHAR_RIGHT_SQUARE_BRACKET", CHAR_RIGHT_SQUARE_BRACKET = 93); /* ] */
            exports_3("CHAR_LEFT_ANGLE_BRACKET", CHAR_LEFT_ANGLE_BRACKET = 60); /* < */
            exports_3("CHAR_RIGHT_ANGLE_BRACKET", CHAR_RIGHT_ANGLE_BRACKET = 62); /* > */
            exports_3("CHAR_LEFT_CURLY_BRACKET", CHAR_LEFT_CURLY_BRACKET = 123); /* { */
            exports_3("CHAR_RIGHT_CURLY_BRACKET", CHAR_RIGHT_CURLY_BRACKET = 125); /* } */
            exports_3("CHAR_HYPHEN_MINUS", CHAR_HYPHEN_MINUS = 45); /* - */
            exports_3("CHAR_PLUS", CHAR_PLUS = 43); /* + */
            exports_3("CHAR_DOUBLE_QUOTE", CHAR_DOUBLE_QUOTE = 34); /* " */
            exports_3("CHAR_SINGLE_QUOTE", CHAR_SINGLE_QUOTE = 39); /* ' */
            exports_3("CHAR_PERCENT", CHAR_PERCENT = 37); /* % */
            exports_3("CHAR_SEMICOLON", CHAR_SEMICOLON = 59); /* ; */
            exports_3("CHAR_CIRCUMFLEX_ACCENT", CHAR_CIRCUMFLEX_ACCENT = 94); /* ^ */
            exports_3("CHAR_GRAVE_ACCENT", CHAR_GRAVE_ACCENT = 96); /* ` */
            exports_3("CHAR_AT", CHAR_AT = 64); /* @ */
            exports_3("CHAR_AMPERSAND", CHAR_AMPERSAND = 38); /* & */
            exports_3("CHAR_EQUAL", CHAR_EQUAL = 61); /* = */
            // Digits
            exports_3("CHAR_0", CHAR_0 = 48); /* 0 */
            exports_3("CHAR_9", CHAR_9 = 57); /* 9 */
            exports_3("isWindows", isWindows = build.os === "win");
            exports_3("EOL", EOL = isWindows ? "\r\n" : "\n");
            exports_3("SEP", SEP = isWindows ? "\\" : "/");
            exports_3("SEP_PATTERN", SEP_PATTERN = isWindows ? /[\\/]+/ : /\/+/);
        }
    };
});
// Copyright the Browserify authors. MIT License.
// Ported from https://github.com/browserify/path-browserify/
System.register("https://deno.land/std/path/utils", ["https://deno.land/std/path/constants"], function (exports_4, context_4) {
    "use strict";
    var constants_ts_1;
    var __moduleName = context_4 && context_4.id;
    function assertPath(path) {
        if (typeof path !== "string") {
            throw new TypeError(`Path must be a string. Received ${JSON.stringify(path)}`);
        }
    }
    exports_4("assertPath", assertPath);
    function isPosixPathSeparator(code) {
        return code === constants_ts_1.CHAR_FORWARD_SLASH;
    }
    exports_4("isPosixPathSeparator", isPosixPathSeparator);
    function isPathSeparator(code) {
        return isPosixPathSeparator(code) || code === constants_ts_1.CHAR_BACKWARD_SLASH;
    }
    exports_4("isPathSeparator", isPathSeparator);
    function isWindowsDeviceRoot(code) {
        return ((code >= constants_ts_1.CHAR_LOWERCASE_A && code <= constants_ts_1.CHAR_LOWERCASE_Z) ||
            (code >= constants_ts_1.CHAR_UPPERCASE_A && code <= constants_ts_1.CHAR_UPPERCASE_Z));
    }
    exports_4("isWindowsDeviceRoot", isWindowsDeviceRoot);
    // Resolves . and .. elements in a path with directory names
    function normalizeString(path, allowAboveRoot, separator, isPathSeparator) {
        let res = "";
        let lastSegmentLength = 0;
        let lastSlash = -1;
        let dots = 0;
        let code;
        for (let i = 0, len = path.length; i <= len; ++i) {
            if (i < len)
                code = path.charCodeAt(i);
            else if (isPathSeparator(code))
                break;
            else
                code = constants_ts_1.CHAR_FORWARD_SLASH;
            if (isPathSeparator(code)) {
                if (lastSlash === i - 1 || dots === 1) {
                    // NOOP
                }
                else if (lastSlash !== i - 1 && dots === 2) {
                    if (res.length < 2 ||
                        lastSegmentLength !== 2 ||
                        res.charCodeAt(res.length - 1) !== constants_ts_1.CHAR_DOT ||
                        res.charCodeAt(res.length - 2) !== constants_ts_1.CHAR_DOT) {
                        if (res.length > 2) {
                            const lastSlashIndex = res.lastIndexOf(separator);
                            if (lastSlashIndex === -1) {
                                res = "";
                                lastSegmentLength = 0;
                            }
                            else {
                                res = res.slice(0, lastSlashIndex);
                                lastSegmentLength = res.length - 1 - res.lastIndexOf(separator);
                            }
                            lastSlash = i;
                            dots = 0;
                            continue;
                        }
                        else if (res.length === 2 || res.length === 1) {
                            res = "";
                            lastSegmentLength = 0;
                            lastSlash = i;
                            dots = 0;
                            continue;
                        }
                    }
                    if (allowAboveRoot) {
                        if (res.length > 0)
                            res += `${separator}..`;
                        else
                            res = "..";
                        lastSegmentLength = 2;
                    }
                }
                else {
                    if (res.length > 0)
                        res += separator + path.slice(lastSlash + 1, i);
                    else
                        res = path.slice(lastSlash + 1, i);
                    lastSegmentLength = i - lastSlash - 1;
                }
                lastSlash = i;
                dots = 0;
            }
            else if (code === constants_ts_1.CHAR_DOT && dots !== -1) {
                ++dots;
            }
            else {
                dots = -1;
            }
        }
        return res;
    }
    exports_4("normalizeString", normalizeString);
    function _format(sep, pathObject) {
        const dir = pathObject.dir || pathObject.root;
        const base = pathObject.base || (pathObject.name || "") + (pathObject.ext || "");
        if (!dir)
            return base;
        if (dir === pathObject.root)
            return dir + base;
        return dir + sep + base;
    }
    exports_4("_format", _format);
    return {
        setters: [
            function (constants_ts_1_1) {
                constants_ts_1 = constants_ts_1_1;
            }
        ],
        execute: function () {
        }
    };
});
System.register("https://deno.land/std/fmt/colors", [], function (exports_5, context_5) {
    "use strict";
    var noColor, enabled;
    var __moduleName = context_5 && context_5.id;
    function setColorEnabled(value) {
        if (noColor) {
            return;
        }
        enabled = value;
    }
    exports_5("setColorEnabled", setColorEnabled);
    function getColorEnabled() {
        return enabled;
    }
    exports_5("getColorEnabled", getColorEnabled);
    function code(open, close) {
        return {
            open: `\x1b[${open}m`,
            close: `\x1b[${close}m`,
            regexp: new RegExp(`\\x1b\\[${close}m`, "g"),
        };
    }
    function run(str, code) {
        return enabled
            ? `${code.open}${str.replace(code.regexp, code.open)}${code.close}`
            : str;
    }
    function reset(str) {
        return run(str, code(0, 0));
    }
    exports_5("reset", reset);
    function bold(str) {
        return run(str, code(1, 22));
    }
    exports_5("bold", bold);
    function dim(str) {
        return run(str, code(2, 22));
    }
    exports_5("dim", dim);
    function italic(str) {
        return run(str, code(3, 23));
    }
    exports_5("italic", italic);
    function underline(str) {
        return run(str, code(4, 24));
    }
    exports_5("underline", underline);
    function inverse(str) {
        return run(str, code(7, 27));
    }
    exports_5("inverse", inverse);
    function hidden(str) {
        return run(str, code(8, 28));
    }
    exports_5("hidden", hidden);
    function strikethrough(str) {
        return run(str, code(9, 29));
    }
    exports_5("strikethrough", strikethrough);
    function black(str) {
        return run(str, code(30, 39));
    }
    exports_5("black", black);
    function red(str) {
        return run(str, code(31, 39));
    }
    exports_5("red", red);
    function green(str) {
        return run(str, code(32, 39));
    }
    exports_5("green", green);
    function yellow(str) {
        return run(str, code(33, 39));
    }
    exports_5("yellow", yellow);
    function blue(str) {
        return run(str, code(34, 39));
    }
    exports_5("blue", blue);
    function magenta(str) {
        return run(str, code(35, 39));
    }
    exports_5("magenta", magenta);
    function cyan(str) {
        return run(str, code(36, 39));
    }
    exports_5("cyan", cyan);
    function white(str) {
        return run(str, code(37, 39));
    }
    exports_5("white", white);
    function gray(str) {
        return run(str, code(90, 39));
    }
    exports_5("gray", gray);
    function bgBlack(str) {
        return run(str, code(40, 49));
    }
    exports_5("bgBlack", bgBlack);
    function bgRed(str) {
        return run(str, code(41, 49));
    }
    exports_5("bgRed", bgRed);
    function bgGreen(str) {
        return run(str, code(42, 49));
    }
    exports_5("bgGreen", bgGreen);
    function bgYellow(str) {
        return run(str, code(43, 49));
    }
    exports_5("bgYellow", bgYellow);
    function bgBlue(str) {
        return run(str, code(44, 49));
    }
    exports_5("bgBlue", bgBlue);
    function bgMagenta(str) {
        return run(str, code(45, 49));
    }
    exports_5("bgMagenta", bgMagenta);
    function bgCyan(str) {
        return run(str, code(46, 49));
    }
    exports_5("bgCyan", bgCyan);
    function bgWhite(str) {
        return run(str, code(47, 49));
    }
    exports_5("bgWhite", bgWhite);
    return {
        setters: [],
        execute: function () {
            // Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
            /**
             * A module to print ANSI terminal colors. Inspired by chalk, kleur, and colors
             * on npm.
             *
             * ```
             * import { bgBlue, red, bold } from "https://deno.land/std/fmt/colors.ts";
             * console.log(bgBlue(red(bold("Hello world!"))));
             * ```
             *
             * This module supports `NO_COLOR` environmental variable disabling any coloring
             * if `NO_COLOR` is set.
             */
            noColor = Deno.noColor;
            enabled = !noColor;
        }
    };
});
System.register("https://deno.land/std/testing/diff", [], function (exports_6, context_6) {
    "use strict";
    var DiffType, REMOVED, COMMON, ADDED;
    var __moduleName = context_6 && context_6.id;
    function createCommon(A, B, reverse) {
        const common = [];
        if (A.length === 0 || B.length === 0)
            return [];
        for (let i = 0; i < Math.min(A.length, B.length); i += 1) {
            if (A[reverse ? A.length - i - 1 : i] === B[reverse ? B.length - i - 1 : i]) {
                common.push(A[reverse ? A.length - i - 1 : i]);
            }
            else {
                return common;
            }
        }
        return common;
    }
    function diff(A, B) {
        const prefixCommon = createCommon(A, B);
        const suffixCommon = createCommon(A.slice(prefixCommon.length), B.slice(prefixCommon.length), true).reverse();
        A = suffixCommon.length
            ? A.slice(prefixCommon.length, -suffixCommon.length)
            : A.slice(prefixCommon.length);
        B = suffixCommon.length
            ? B.slice(prefixCommon.length, -suffixCommon.length)
            : B.slice(prefixCommon.length);
        const swapped = B.length > A.length;
        [A, B] = swapped ? [B, A] : [A, B];
        const M = A.length;
        const N = B.length;
        if (!M && !N && !suffixCommon.length && !prefixCommon.length)
            return [];
        if (!N) {
            return [
                ...prefixCommon.map((c) => ({ type: DiffType.common, value: c })),
                ...A.map((a) => ({
                    type: swapped ? DiffType.added : DiffType.removed,
                    value: a,
                })),
                ...suffixCommon.map((c) => ({ type: DiffType.common, value: c })),
            ];
        }
        const offset = N;
        const delta = M - N;
        const size = M + N + 1;
        const fp = new Array(size).fill({ y: -1 });
        /**
         * INFO:
         * This buffer is used to save memory and improve performance.
         * The first half is used to save route and last half is used to save diff
         * type.
         * This is because, when I kept new uint8array area to save type,performance
         * worsened.
         */
        const routes = new Uint32Array((M * N + size + 1) * 2);
        const diffTypesPtrOffset = routes.length / 2;
        let ptr = 0;
        let p = -1;
        function backTrace(A, B, current, swapped) {
            const M = A.length;
            const N = B.length;
            const result = [];
            let a = M - 1;
            let b = N - 1;
            let j = routes[current.id];
            let type = routes[current.id + diffTypesPtrOffset];
            while (true) {
                if (!j && !type)
                    break;
                const prev = j;
                if (type === REMOVED) {
                    result.unshift({
                        type: swapped ? DiffType.removed : DiffType.added,
                        value: B[b],
                    });
                    b -= 1;
                }
                else if (type === ADDED) {
                    result.unshift({
                        type: swapped ? DiffType.added : DiffType.removed,
                        value: A[a],
                    });
                    a -= 1;
                }
                else {
                    result.unshift({ type: DiffType.common, value: A[a] });
                    a -= 1;
                    b -= 1;
                }
                j = routes[prev];
                type = routes[prev + diffTypesPtrOffset];
            }
            return result;
        }
        function createFP(slide, down, k, M) {
            if (slide && slide.y === -1 && down && down.y === -1) {
                return { y: 0, id: 0 };
            }
            if ((down && down.y === -1) ||
                k === M ||
                (slide && slide.y) > (down && down.y) + 1) {
                const prev = slide.id;
                ptr++;
                routes[ptr] = prev;
                routes[ptr + diffTypesPtrOffset] = ADDED;
                return { y: slide.y, id: ptr };
            }
            else {
                const prev = down.id;
                ptr++;
                routes[ptr] = prev;
                routes[ptr + diffTypesPtrOffset] = REMOVED;
                return { y: down.y + 1, id: ptr };
            }
        }
        function snake(k, slide, down, _offset, A, B) {
            const M = A.length;
            const N = B.length;
            if (k < -N || M < k)
                return { y: -1, id: -1 };
            const fp = createFP(slide, down, k, M);
            while (fp.y + k < M && fp.y < N && A[fp.y + k] === B[fp.y]) {
                const prev = fp.id;
                ptr++;
                fp.id = ptr;
                fp.y += 1;
                routes[ptr] = prev;
                routes[ptr + diffTypesPtrOffset] = COMMON;
            }
            return fp;
        }
        while (fp[delta + offset].y < N) {
            p = p + 1;
            for (let k = -p; k < delta; ++k) {
                fp[k + offset] = snake(k, fp[k - 1 + offset], fp[k + 1 + offset], offset, A, B);
            }
            for (let k = delta + p; k > delta; --k) {
                fp[k + offset] = snake(k, fp[k - 1 + offset], fp[k + 1 + offset], offset, A, B);
            }
            fp[delta + offset] = snake(delta, fp[delta - 1 + offset], fp[delta + 1 + offset], offset, A, B);
        }
        return [
            ...prefixCommon.map((c) => ({ type: DiffType.common, value: c })),
            ...backTrace(A, B, fp[delta + offset], swapped),
            ...suffixCommon.map((c) => ({ type: DiffType.common, value: c })),
        ];
    }
    exports_6("default", diff);
    return {
        setters: [],
        execute: function () {
            (function (DiffType) {
                DiffType["removed"] = "removed";
                DiffType["common"] = "common";
                DiffType["added"] = "added";
            })(DiffType || (DiffType = {}));
            exports_6("DiffType", DiffType);
            REMOVED = 1;
            COMMON = 2;
            ADDED = 3;
        }
    };
});
System.register("https://deno.land/std/testing/format", ["https://deno.land/std/testing/asserts"], function (exports_7, context_7) {
    "use strict";
    var asserts_ts_1, toString, toISOString, errorToString, regExpToString, symbolToString, DEFAULT_OPTIONS, getConstructorName, isWindow, SYMBOL_REGEXP, getConfig;
    var __moduleName = context_7 && context_7.id;
    function isToStringedArrayType(toStringed) {
        return (toStringed === "[object Array]" ||
            toStringed === "[object ArrayBuffer]" ||
            toStringed === "[object DataView]" ||
            toStringed === "[object Float32Array]" ||
            toStringed === "[object Float64Array]" ||
            toStringed === "[object Int8Array]" ||
            toStringed === "[object Int16Array]" ||
            toStringed === "[object Int32Array]" ||
            toStringed === "[object Uint8Array]" ||
            toStringed === "[object Uint8ClampedArray]" ||
            toStringed === "[object Uint16Array]" ||
            toStringed === "[object Uint32Array]");
    }
    function printNumber(val) {
        return Object.is(val, -0) ? "-0" : String(val);
    }
    function printFunction(val, printFunctionName) {
        if (!printFunctionName) {
            return "[Function]";
        }
        return "[Function " + (val.name || "anonymous") + "]";
    }
    function printSymbol(val) {
        return symbolToString.call(val).replace(SYMBOL_REGEXP, "Symbol($1)");
    }
    function printError(val) {
        return "[" + errorToString.call(val) + "]";
    }
    /**
     * The first port of call for printing an object, handles most of the
     * data-types in JS.
     */
    function printBasicValue(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    val, { printFunctionName, escapeRegex, escapeString }) {
        if (val === true || val === false) {
            return String(val);
        }
        if (val === undefined) {
            return "undefined";
        }
        if (val === null) {
            return "null";
        }
        const typeOf = typeof val;
        if (typeOf === "number") {
            return printNumber(val);
        }
        if (typeOf === "string") {
            if (escapeString) {
                return `"${val.replace(/"|\\/g, "\\$&")}"`;
            }
            return `"${val}"`;
        }
        if (typeOf === "function") {
            return printFunction(val, printFunctionName);
        }
        if (typeOf === "symbol") {
            return printSymbol(val);
        }
        const toStringed = toString.call(val);
        if (toStringed === "[object WeakMap]") {
            return "WeakMap {}";
        }
        if (toStringed === "[object WeakSet]") {
            return "WeakSet {}";
        }
        if (toStringed === "[object Function]" ||
            toStringed === "[object GeneratorFunction]") {
            return printFunction(val, printFunctionName);
        }
        if (toStringed === "[object Symbol]") {
            return printSymbol(val);
        }
        if (toStringed === "[object Date]") {
            return isNaN(+val) ? "Date { NaN }" : toISOString.call(val);
        }
        if (toStringed === "[object Error]") {
            return printError(val);
        }
        if (toStringed === "[object RegExp]") {
            if (escapeRegex) {
                // https://github.com/benjamingr/RegExp.escape/blob/master/polyfill.js
                return regExpToString.call(val).replace(/[\\^$*+?.()|[\]{}]/g, "\\$&");
            }
            return regExpToString.call(val);
        }
        if (val instanceof Error) {
            return printError(val);
        }
        return null;
    }
    function printer(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    val, config, indentation, depth, refs, hasCalledToJSON) {
        const basicResult = printBasicValue(val, config);
        if (basicResult !== null) {
            return basicResult;
        }
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        return printComplexValue(val, config, indentation, depth, refs, hasCalledToJSON);
    }
    /**
     * Return items (for example, of an array)
     * with spacing, indentation, and comma
     * without surrounding punctuation (for example, brackets)
     */
    function printListItems(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    list, config, indentation, depth, refs, printer) {
        let result = "";
        if (list.length) {
            result += config.spacingOuter;
            const indentationNext = indentation + config.indent;
            for (let i = 0; i < list.length; i++) {
                result +=
                    indentationNext +
                        printer(list[i], config, indentationNext, depth, refs);
                if (i < list.length - 1) {
                    result += "," + config.spacingInner;
                }
                else if (!config.min) {
                    result += ",";
                }
            }
            result += config.spacingOuter + indentation;
        }
        return result;
    }
    /**
     * Return entries (for example, of a map)
     * with spacing, indentation, and comma
     * without surrounding punctuation (for example, braces)
     */
    function printIteratorEntries(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    iterator, config, indentation, depth, refs, printer, 
    // Too bad, so sad that separator for ECMAScript Map has been ' => '
    // What a distracting diff if you change a data structure to/from
    // ECMAScript Object or Immutable.Map/OrderedMap which use the default.
    separator = ": ") {
        let result = "";
        let current = iterator.next();
        if (!current.done) {
            result += config.spacingOuter;
            const indentationNext = indentation + config.indent;
            while (!current.done) {
                const name = printer(current.value[0], config, indentationNext, depth, refs);
                const value = printer(current.value[1], config, indentationNext, depth, refs);
                result += indentationNext + name + separator + value;
                current = iterator.next();
                if (!current.done) {
                    result += "," + config.spacingInner;
                }
                else if (!config.min) {
                    result += ",";
                }
            }
            result += config.spacingOuter + indentation;
        }
        return result;
    }
    /**
     * Return values (for example, of a set)
     * with spacing, indentation, and comma
     * without surrounding punctuation (braces or brackets)
     */
    function printIteratorValues(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    iterator, config, indentation, depth, refs, printer) {
        let result = "";
        let current = iterator.next();
        if (!current.done) {
            result += config.spacingOuter;
            const indentationNext = indentation + config.indent;
            while (!current.done) {
                result +=
                    indentationNext +
                        printer(current.value, config, indentationNext, depth, refs);
                current = iterator.next();
                if (!current.done) {
                    result += "," + config.spacingInner;
                }
                else if (!config.min) {
                    result += ",";
                }
            }
            result += config.spacingOuter + indentation;
        }
        return result;
    }
    function getKeysOfEnumerableProperties(object) {
        const keys = Object.keys(object).sort();
        if (Object.getOwnPropertySymbols) {
            Object.getOwnPropertySymbols(object).forEach((symbol) => {
                const d = Object.getOwnPropertyDescriptor(object, symbol);
                asserts_ts_1.assert(d != null);
                if (d.enumerable) {
                    keys.push(symbol);
                }
            });
        }
        return keys;
    }
    /**
     * Return properties of an object
     * with spacing, indentation, and comma
     * without surrounding punctuation (for example, braces)
     */
    function printObjectProperties(val, config, indentation, depth, refs, printer) {
        let result = "";
        const keys = getKeysOfEnumerableProperties(val);
        if (keys.length) {
            result += config.spacingOuter;
            const indentationNext = indentation + config.indent;
            for (let i = 0; i < keys.length; i++) {
                const key = keys[i];
                const name = printer(key, config, indentationNext, depth, refs);
                const value = printer(val[key], config, indentationNext, depth, refs);
                result += indentationNext + name + ": " + value;
                if (i < keys.length - 1) {
                    result += "," + config.spacingInner;
                }
                else if (!config.min) {
                    result += ",";
                }
            }
            result += config.spacingOuter + indentation;
        }
        return result;
    }
    /**
     * Handles more complex objects ( such as objects with circular references.
     * maps and sets etc )
     */
    function printComplexValue(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    val, config, indentation, depth, refs, hasCalledToJSON) {
        if (refs.indexOf(val) !== -1) {
            return "[Circular]";
        }
        refs = refs.slice();
        refs.push(val);
        const hitMaxDepth = ++depth > config.maxDepth;
        const { min, callToJSON } = config;
        if (callToJSON &&
            !hitMaxDepth &&
            val.toJSON &&
            typeof val.toJSON === "function" &&
            !hasCalledToJSON) {
            return printer(val.toJSON(), config, indentation, depth, refs, true);
        }
        const toStringed = toString.call(val);
        if (toStringed === "[object Arguments]") {
            return hitMaxDepth
                ? "[Arguments]"
                : (min ? "" : "Arguments ") +
                    "[" +
                    printListItems(val, config, indentation, depth, refs, printer) +
                    "]";
        }
        if (isToStringedArrayType(toStringed)) {
            return hitMaxDepth
                ? `[${val.constructor.name}]`
                : (min ? "" : `${val.constructor.name} `) +
                    "[" +
                    printListItems(val, config, indentation, depth, refs, printer) +
                    "]";
        }
        if (toStringed === "[object Map]") {
            return hitMaxDepth
                ? "[Map]"
                : "Map {" +
                    printIteratorEntries(val.entries(), config, indentation, depth, refs, printer, " => ") +
                    "}";
        }
        if (toStringed === "[object Set]") {
            return hitMaxDepth
                ? "[Set]"
                : "Set {" +
                    printIteratorValues(val.values(), config, indentation, depth, refs, printer) +
                    "}";
        }
        // Avoid failure to serialize global window object in jsdom test environment.
        // For example, not even relevant if window is prop of React element.
        return hitMaxDepth || isWindow(val)
            ? "[" + getConstructorName(val) + "]"
            : (min ? "" : getConstructorName(val) + " ") +
                "{" +
                printObjectProperties(val, config, indentation, depth, refs, printer) +
                "}";
    }
    // TODO this is better done with `.padStart()`
    function createIndent(indent) {
        return new Array(indent + 1).join(" ");
    }
    /**
     * Returns a presentation string of your `val` object
     * @param val any potential JavaScript object
     * @param options Custom settings
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function format(val, options = {}) {
        const opts = {
            ...DEFAULT_OPTIONS,
            ...options,
        };
        const basicResult = printBasicValue(val, opts);
        if (basicResult !== null) {
            return basicResult;
        }
        return printComplexValue(val, getConfig(opts), "", 0, []);
    }
    exports_7("format", format);
    return {
        setters: [
            function (asserts_ts_1_1) {
                asserts_ts_1 = asserts_ts_1_1;
            }
        ],
        execute: function () {
            toString = Object.prototype.toString;
            toISOString = Date.prototype.toISOString;
            errorToString = Error.prototype.toString;
            regExpToString = RegExp.prototype.toString;
            symbolToString = Symbol.prototype.toString;
            DEFAULT_OPTIONS = {
                callToJSON: true,
                escapeRegex: false,
                escapeString: true,
                indent: 2,
                maxDepth: Infinity,
                min: false,
                printFunctionName: true,
            };
            /**
             * Explicitly comparing typeof constructor to function avoids undefined as name
             * when mock identity-obj-proxy returns the key as the value for any key.
             */
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            getConstructorName = (val) => (typeof val.constructor === "function" && val.constructor.name) || "Object";
            /* global window */
            /** Is val is equal to global window object?
             *  Works even if it does not exist :)
             * */
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            isWindow = (val) => typeof window !== "undefined" && val === window;
            SYMBOL_REGEXP = /^Symbol\((.*)\)(.*)$/;
            getConfig = (options) => ({
                ...options,
                indent: options.min ? "" : createIndent(options.indent),
                spacingInner: options.min ? " " : "\n",
                spacingOuter: options.min ? "" : "\n",
            });
        }
    };
});
System.register("https://deno.land/std/testing/asserts", ["https://deno.land/std/fmt/colors", "https://deno.land/std/testing/diff", "https://deno.land/std/testing/format"], function (exports_8, context_8) {
    "use strict";
    var colors_ts_1, diff_ts_1, format_ts_1, CAN_NOT_DISPLAY, AssertionError;
    var __moduleName = context_8 && context_8.id;
    function createStr(v) {
        try {
            return format_ts_1.format(v);
        }
        catch (e) {
            return colors_ts_1.red(CAN_NOT_DISPLAY);
        }
    }
    function createColor(diffType) {
        switch (diffType) {
            case diff_ts_1.DiffType.added:
                return (s) => colors_ts_1.green(colors_ts_1.bold(s));
            case diff_ts_1.DiffType.removed:
                return (s) => colors_ts_1.red(colors_ts_1.bold(s));
            default:
                return colors_ts_1.white;
        }
    }
    function createSign(diffType) {
        switch (diffType) {
            case diff_ts_1.DiffType.added:
                return "+   ";
            case diff_ts_1.DiffType.removed:
                return "-   ";
            default:
                return "    ";
        }
    }
    function buildMessage(diffResult) {
        const messages = [];
        messages.push("");
        messages.push("");
        messages.push(`    ${colors_ts_1.gray(colors_ts_1.bold("[Diff]"))} ${colors_ts_1.red(colors_ts_1.bold("Left"))} / ${colors_ts_1.green(colors_ts_1.bold("Right"))}`);
        messages.push("");
        messages.push("");
        diffResult.forEach((result) => {
            const c = createColor(result.type);
            messages.push(c(`${createSign(result.type)}${result.value}`));
        });
        messages.push("");
        return messages;
    }
    function isKeyedCollection(x) {
        return [Symbol.iterator, "size"].every((k) => k in x);
    }
    function equal(c, d) {
        const seen = new Map();
        return (function compare(a, b) {
            // Have to render RegExp & Date for string comparison
            // unless it's mistreated as object
            if (a &&
                b &&
                ((a instanceof RegExp && b instanceof RegExp) ||
                    (a instanceof Date && b instanceof Date))) {
                return String(a) === String(b);
            }
            if (Object.is(a, b)) {
                return true;
            }
            if (a && typeof a === "object" && b && typeof b === "object") {
                if (seen.get(a) === b) {
                    return true;
                }
                if (Object.keys(a || {}).length !== Object.keys(b || {}).length) {
                    return false;
                }
                if (isKeyedCollection(a) && isKeyedCollection(b)) {
                    if (a.size !== b.size) {
                        return false;
                    }
                    let unmatchedEntries = a.size;
                    for (const [aKey, aValue] of a.entries()) {
                        for (const [bKey, bValue] of b.entries()) {
                            /* Given that Map keys can be references, we need
                             * to ensure that they are also deeply equal */
                            if ((aKey === aValue && bKey === bValue && compare(aKey, bKey)) ||
                                (compare(aKey, bKey) && compare(aValue, bValue))) {
                                unmatchedEntries--;
                            }
                        }
                    }
                    return unmatchedEntries === 0;
                }
                const merged = { ...a, ...b };
                for (const key in merged) {
                    if (!compare(a && a[key], b && b[key])) {
                        return false;
                    }
                }
                seen.set(a, b);
                return true;
            }
            return false;
        })(c, d);
    }
    exports_8("equal", equal);
    /** Make an assertion, if not `true`, then throw. */
    function assert(expr, msg = "") {
        if (!expr) {
            throw new AssertionError(msg);
        }
    }
    exports_8("assert", assert);
    /**
     * Make an assertion that `actual` and `expected` are equal, deeply. If not
     * deeply equal, then throw.
     */
    function assertEquals(actual, expected, msg) {
        if (equal(actual, expected)) {
            return;
        }
        let message = "";
        const actualString = createStr(actual);
        const expectedString = createStr(expected);
        try {
            const diffResult = diff_ts_1.default(actualString.split("\n"), expectedString.split("\n"));
            message = buildMessage(diffResult).join("\n");
        }
        catch (e) {
            message = `\n${colors_ts_1.red(CAN_NOT_DISPLAY)} + \n\n`;
        }
        if (msg) {
            message = msg;
        }
        throw new AssertionError(message);
    }
    exports_8("assertEquals", assertEquals);
    /**
     * Make an assertion that `actual` and `expected` are not equal, deeply.
     * If not then throw.
     */
    function assertNotEquals(actual, expected, msg) {
        if (!equal(actual, expected)) {
            return;
        }
        let actualString;
        let expectedString;
        try {
            actualString = String(actual);
        }
        catch (e) {
            actualString = "[Cannot display]";
        }
        try {
            expectedString = String(expected);
        }
        catch (e) {
            expectedString = "[Cannot display]";
        }
        if (!msg) {
            msg = `actual: ${actualString} expected: ${expectedString}`;
        }
        throw new AssertionError(msg);
    }
    exports_8("assertNotEquals", assertNotEquals);
    /**
     * Make an assertion that `actual` and `expected` are strictly equal.  If
     * not then throw.
     */
    function assertStrictEq(actual, expected, msg) {
        if (actual !== expected) {
            let actualString;
            let expectedString;
            try {
                actualString = String(actual);
            }
            catch (e) {
                actualString = "[Cannot display]";
            }
            try {
                expectedString = String(expected);
            }
            catch (e) {
                expectedString = "[Cannot display]";
            }
            if (!msg) {
                msg = `actual: ${actualString} expected: ${expectedString}`;
            }
            throw new AssertionError(msg);
        }
    }
    exports_8("assertStrictEq", assertStrictEq);
    /**
     * Make an assertion that actual contains expected. If not
     * then thrown.
     */
    function assertStrContains(actual, expected, msg) {
        if (!actual.includes(expected)) {
            if (!msg) {
                msg = `actual: "${actual}" expected to contains: "${expected}"`;
            }
            throw new AssertionError(msg);
        }
    }
    exports_8("assertStrContains", assertStrContains);
    /**
     * Make an assertion that `actual` contains the `expected` values
     * If not then thrown.
     */
    function assertArrayContains(actual, expected, msg) {
        const missing = [];
        for (let i = 0; i < expected.length; i++) {
            let found = false;
            for (let j = 0; j < actual.length; j++) {
                if (equal(expected[i], actual[j])) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                missing.push(expected[i]);
            }
        }
        if (missing.length === 0) {
            return;
        }
        if (!msg) {
            msg = `actual: "${actual}" expected to contains: "${expected}"`;
            msg += "\n";
            msg += `missing: ${missing}`;
        }
        throw new AssertionError(msg);
    }
    exports_8("assertArrayContains", assertArrayContains);
    /**
     * Make an assertion that `actual` match RegExp `expected`. If not
     * then thrown
     */
    function assertMatch(actual, expected, msg) {
        if (!expected.test(actual)) {
            if (!msg) {
                msg = `actual: "${actual}" expected to match: "${expected}"`;
            }
            throw new AssertionError(msg);
        }
    }
    exports_8("assertMatch", assertMatch);
    /**
     * Forcefully throws a failed assertion
     */
    function fail(msg) {
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        assert(false, `Failed assertion${msg ? `: ${msg}` : "."}`);
    }
    exports_8("fail", fail);
    /** Executes a function, expecting it to throw.  If it does not, then it
     * throws.  An error class and a string that should be included in the
     * error message can also be asserted.
     */
    function assertThrows(fn, ErrorClass, msgIncludes = "", msg) {
        let doesThrow = false;
        let error = null;
        try {
            fn();
        }
        catch (e) {
            if (ErrorClass && !(Object.getPrototypeOf(e) === ErrorClass.prototype)) {
                msg = `Expected error to be instance of "${ErrorClass.name}", but was "${e.constructor.name}"${msg ? `: ${msg}` : "."}`;
                throw new AssertionError(msg);
            }
            if (msgIncludes && !e.message.includes(msgIncludes)) {
                msg = `Expected error message to include "${msgIncludes}", but got "${e.message}"${msg ? `: ${msg}` : "."}`;
                throw new AssertionError(msg);
            }
            doesThrow = true;
            error = e;
        }
        if (!doesThrow) {
            msg = `Expected function to throw${msg ? `: ${msg}` : "."}`;
            throw new AssertionError(msg);
        }
        return error;
    }
    exports_8("assertThrows", assertThrows);
    async function assertThrowsAsync(fn, ErrorClass, msgIncludes = "", msg) {
        let doesThrow = false;
        let error = null;
        try {
            await fn();
        }
        catch (e) {
            if (ErrorClass && !(Object.getPrototypeOf(e) === ErrorClass.prototype)) {
                msg = `Expected error to be instance of "${ErrorClass.name}", but got "${e.name}"${msg ? `: ${msg}` : "."}`;
                throw new AssertionError(msg);
            }
            if (msgIncludes && !e.message.includes(msgIncludes)) {
                msg = `Expected error message to include "${msgIncludes}", but got "${e.message}"${msg ? `: ${msg}` : "."}`;
                throw new AssertionError(msg);
            }
            doesThrow = true;
            error = e;
        }
        if (!doesThrow) {
            msg = `Expected function to throw${msg ? `: ${msg}` : "."}`;
            throw new AssertionError(msg);
        }
        return error;
    }
    exports_8("assertThrowsAsync", assertThrowsAsync);
    /** Use this to stub out methods that will throw when invoked. */
    function unimplemented(msg) {
        throw new AssertionError(msg || "unimplemented");
    }
    exports_8("unimplemented", unimplemented);
    /** Use this to assert unreachable code. */
    function unreachable() {
        throw new AssertionError("unreachable");
    }
    exports_8("unreachable", unreachable);
    function assertNotEOF(val) {
        assertNotEquals(val, Deno.EOF);
        return val;
    }
    exports_8("assertNotEOF", assertNotEOF);
    return {
        setters: [
            function (colors_ts_1_1) {
                colors_ts_1 = colors_ts_1_1;
            },
            function (diff_ts_1_1) {
                diff_ts_1 = diff_ts_1_1;
            },
            function (format_ts_1_1) {
                format_ts_1 = format_ts_1_1;
            }
        ],
        execute: function () {
            CAN_NOT_DISPLAY = "[Cannot display]";
            AssertionError = class AssertionError extends Error {
                constructor(message) {
                    super(message);
                    this.name = "AssertionError";
                }
            };
            exports_8("AssertionError", AssertionError);
        }
    };
});
// Copyright the Browserify authors. MIT License.
// Ported from https://github.com/browserify/path-browserify/
System.register("https://deno.land/std/path/win32", ["https://deno.land/std/path/constants", "https://deno.land/std/path/utils", "https://deno.land/std/testing/asserts"], function (exports_9, context_9) {
    "use strict";
    var cwd, env, constants_ts_2, utils_ts_1, asserts_ts_2, sep, delimiter;
    var __moduleName = context_9 && context_9.id;
    function resolve(...pathSegments) {
        let resolvedDevice = "";
        let resolvedTail = "";
        let resolvedAbsolute = false;
        for (let i = pathSegments.length - 1; i >= -1; i--) {
            let path;
            if (i >= 0) {
                path = pathSegments[i];
            }
            else if (!resolvedDevice) {
                path = cwd();
            }
            else {
                // Windows has the concept of drive-specific current working
                // directories. If we've resolved a drive letter but not yet an
                // absolute path, get cwd for that drive, or the process cwd if
                // the drive cwd is not available. We're sure the device is not
                // a UNC path at this points, because UNC paths are always absolute.
                path = env()[`=${resolvedDevice}`] || cwd();
                // Verify that a cwd was found and that it actually points
                // to our drive. If not, default to the drive's root.
                if (path === undefined ||
                    path.slice(0, 3).toLowerCase() !== `${resolvedDevice.toLowerCase()}\\`) {
                    path = `${resolvedDevice}\\`;
                }
            }
            utils_ts_1.assertPath(path);
            const len = path.length;
            // Skip empty entries
            if (len === 0)
                continue;
            let rootEnd = 0;
            let device = "";
            let isAbsolute = false;
            const code = path.charCodeAt(0);
            // Try to match a root
            if (len > 1) {
                if (utils_ts_1.isPathSeparator(code)) {
                    // Possible UNC root
                    // If we started with a separator, we know we at least have an
                    // absolute path of some kind (UNC or otherwise)
                    isAbsolute = true;
                    if (utils_ts_1.isPathSeparator(path.charCodeAt(1))) {
                        // Matched double path separator at beginning
                        let j = 2;
                        let last = j;
                        // Match 1 or more non-path separators
                        for (; j < len; ++j) {
                            if (utils_ts_1.isPathSeparator(path.charCodeAt(j)))
                                break;
                        }
                        if (j < len && j !== last) {
                            const firstPart = path.slice(last, j);
                            // Matched!
                            last = j;
                            // Match 1 or more path separators
                            for (; j < len; ++j) {
                                if (!utils_ts_1.isPathSeparator(path.charCodeAt(j)))
                                    break;
                            }
                            if (j < len && j !== last) {
                                // Matched!
                                last = j;
                                // Match 1 or more non-path separators
                                for (; j < len; ++j) {
                                    if (utils_ts_1.isPathSeparator(path.charCodeAt(j)))
                                        break;
                                }
                                if (j === len) {
                                    // We matched a UNC root only
                                    device = `\\\\${firstPart}\\${path.slice(last)}`;
                                    rootEnd = j;
                                }
                                else if (j !== last) {
                                    // We matched a UNC root with leftovers
                                    device = `\\\\${firstPart}\\${path.slice(last, j)}`;
                                    rootEnd = j;
                                }
                            }
                        }
                    }
                    else {
                        rootEnd = 1;
                    }
                }
                else if (utils_ts_1.isWindowsDeviceRoot(code)) {
                    // Possible device root
                    if (path.charCodeAt(1) === constants_ts_2.CHAR_COLON) {
                        device = path.slice(0, 2);
                        rootEnd = 2;
                        if (len > 2) {
                            if (utils_ts_1.isPathSeparator(path.charCodeAt(2))) {
                                // Treat separator following drive name as an absolute path
                                // indicator
                                isAbsolute = true;
                                rootEnd = 3;
                            }
                        }
                    }
                }
            }
            else if (utils_ts_1.isPathSeparator(code)) {
                // `path` contains just a path separator
                rootEnd = 1;
                isAbsolute = true;
            }
            if (device.length > 0 &&
                resolvedDevice.length > 0 &&
                device.toLowerCase() !== resolvedDevice.toLowerCase()) {
                // This path points to another device so it is not applicable
                continue;
            }
            if (resolvedDevice.length === 0 && device.length > 0) {
                resolvedDevice = device;
            }
            if (!resolvedAbsolute) {
                resolvedTail = `${path.slice(rootEnd)}\\${resolvedTail}`;
                resolvedAbsolute = isAbsolute;
            }
            if (resolvedAbsolute && resolvedDevice.length > 0)
                break;
        }
        // At this point the path should be resolved to a full absolute path,
        // but handle relative paths to be safe (might happen when process.cwd()
        // fails)
        // Normalize the tail path
        resolvedTail = utils_ts_1.normalizeString(resolvedTail, !resolvedAbsolute, "\\", utils_ts_1.isPathSeparator);
        return resolvedDevice + (resolvedAbsolute ? "\\" : "") + resolvedTail || ".";
    }
    exports_9("resolve", resolve);
    function normalize(path) {
        utils_ts_1.assertPath(path);
        const len = path.length;
        if (len === 0)
            return ".";
        let rootEnd = 0;
        let device;
        let isAbsolute = false;
        const code = path.charCodeAt(0);
        // Try to match a root
        if (len > 1) {
            if (utils_ts_1.isPathSeparator(code)) {
                // Possible UNC root
                // If we started with a separator, we know we at least have an absolute
                // path of some kind (UNC or otherwise)
                isAbsolute = true;
                if (utils_ts_1.isPathSeparator(path.charCodeAt(1))) {
                    // Matched double path separator at beginning
                    let j = 2;
                    let last = j;
                    // Match 1 or more non-path separators
                    for (; j < len; ++j) {
                        if (utils_ts_1.isPathSeparator(path.charCodeAt(j)))
                            break;
                    }
                    if (j < len && j !== last) {
                        const firstPart = path.slice(last, j);
                        // Matched!
                        last = j;
                        // Match 1 or more path separators
                        for (; j < len; ++j) {
                            if (!utils_ts_1.isPathSeparator(path.charCodeAt(j)))
                                break;
                        }
                        if (j < len && j !== last) {
                            // Matched!
                            last = j;
                            // Match 1 or more non-path separators
                            for (; j < len; ++j) {
                                if (utils_ts_1.isPathSeparator(path.charCodeAt(j)))
                                    break;
                            }
                            if (j === len) {
                                // We matched a UNC root only
                                // Return the normalized version of the UNC root since there
                                // is nothing left to process
                                return `\\\\${firstPart}\\${path.slice(last)}\\`;
                            }
                            else if (j !== last) {
                                // We matched a UNC root with leftovers
                                device = `\\\\${firstPart}\\${path.slice(last, j)}`;
                                rootEnd = j;
                            }
                        }
                    }
                }
                else {
                    rootEnd = 1;
                }
            }
            else if (utils_ts_1.isWindowsDeviceRoot(code)) {
                // Possible device root
                if (path.charCodeAt(1) === constants_ts_2.CHAR_COLON) {
                    device = path.slice(0, 2);
                    rootEnd = 2;
                    if (len > 2) {
                        if (utils_ts_1.isPathSeparator(path.charCodeAt(2))) {
                            // Treat separator following drive name as an absolute path
                            // indicator
                            isAbsolute = true;
                            rootEnd = 3;
                        }
                    }
                }
            }
        }
        else if (utils_ts_1.isPathSeparator(code)) {
            // `path` contains just a path separator, exit early to avoid unnecessary
            // work
            return "\\";
        }
        let tail;
        if (rootEnd < len) {
            tail = utils_ts_1.normalizeString(path.slice(rootEnd), !isAbsolute, "\\", utils_ts_1.isPathSeparator);
        }
        else {
            tail = "";
        }
        if (tail.length === 0 && !isAbsolute)
            tail = ".";
        if (tail.length > 0 && utils_ts_1.isPathSeparator(path.charCodeAt(len - 1))) {
            tail += "\\";
        }
        if (device === undefined) {
            if (isAbsolute) {
                if (tail.length > 0)
                    return `\\${tail}`;
                else
                    return "\\";
            }
            else if (tail.length > 0) {
                return tail;
            }
            else {
                return "";
            }
        }
        else if (isAbsolute) {
            if (tail.length > 0)
                return `${device}\\${tail}`;
            else
                return `${device}\\`;
        }
        else if (tail.length > 0) {
            return device + tail;
        }
        else {
            return device;
        }
    }
    exports_9("normalize", normalize);
    function isAbsolute(path) {
        utils_ts_1.assertPath(path);
        const len = path.length;
        if (len === 0)
            return false;
        const code = path.charCodeAt(0);
        if (utils_ts_1.isPathSeparator(code)) {
            return true;
        }
        else if (utils_ts_1.isWindowsDeviceRoot(code)) {
            // Possible device root
            if (len > 2 && path.charCodeAt(1) === constants_ts_2.CHAR_COLON) {
                if (utils_ts_1.isPathSeparator(path.charCodeAt(2)))
                    return true;
            }
        }
        return false;
    }
    exports_9("isAbsolute", isAbsolute);
    function join(...paths) {
        const pathsCount = paths.length;
        if (pathsCount === 0)
            return ".";
        let joined;
        let firstPart = null;
        for (let i = 0; i < pathsCount; ++i) {
            const path = paths[i];
            utils_ts_1.assertPath(path);
            if (path.length > 0) {
                if (joined === undefined)
                    joined = firstPart = path;
                else
                    joined += `\\${path}`;
            }
        }
        if (joined === undefined)
            return ".";
        // Make sure that the joined path doesn't start with two slashes, because
        // normalize() will mistake it for an UNC path then.
        //
        // This step is skipped when it is very clear that the user actually
        // intended to point at an UNC path. This is assumed when the first
        // non-empty string arguments starts with exactly two slashes followed by
        // at least one more non-slash character.
        //
        // Note that for normalize() to treat a path as an UNC path it needs to
        // have at least 2 components, so we don't filter for that here.
        // This means that the user can use join to construct UNC paths from
        // a server name and a share name; for example:
        //   path.join('//server', 'share') -> '\\\\server\\share\\')
        let needsReplace = true;
        let slashCount = 0;
        asserts_ts_2.assert(firstPart != null);
        if (utils_ts_1.isPathSeparator(firstPart.charCodeAt(0))) {
            ++slashCount;
            const firstLen = firstPart.length;
            if (firstLen > 1) {
                if (utils_ts_1.isPathSeparator(firstPart.charCodeAt(1))) {
                    ++slashCount;
                    if (firstLen > 2) {
                        if (utils_ts_1.isPathSeparator(firstPart.charCodeAt(2)))
                            ++slashCount;
                        else {
                            // We matched a UNC path in the first part
                            needsReplace = false;
                        }
                    }
                }
            }
        }
        if (needsReplace) {
            // Find any more consecutive slashes we need to replace
            for (; slashCount < joined.length; ++slashCount) {
                if (!utils_ts_1.isPathSeparator(joined.charCodeAt(slashCount)))
                    break;
            }
            // Replace the slashes if needed
            if (slashCount >= 2)
                joined = `\\${joined.slice(slashCount)}`;
        }
        return normalize(joined);
    }
    exports_9("join", join);
    // It will solve the relative path from `from` to `to`, for instance:
    //  from = 'C:\\orandea\\test\\aaa'
    //  to = 'C:\\orandea\\impl\\bbb'
    // The output of the function should be: '..\\..\\impl\\bbb'
    function relative(from, to) {
        utils_ts_1.assertPath(from);
        utils_ts_1.assertPath(to);
        if (from === to)
            return "";
        const fromOrig = resolve(from);
        const toOrig = resolve(to);
        if (fromOrig === toOrig)
            return "";
        from = fromOrig.toLowerCase();
        to = toOrig.toLowerCase();
        if (from === to)
            return "";
        // Trim any leading backslashes
        let fromStart = 0;
        let fromEnd = from.length;
        for (; fromStart < fromEnd; ++fromStart) {
            if (from.charCodeAt(fromStart) !== constants_ts_2.CHAR_BACKWARD_SLASH)
                break;
        }
        // Trim trailing backslashes (applicable to UNC paths only)
        for (; fromEnd - 1 > fromStart; --fromEnd) {
            if (from.charCodeAt(fromEnd - 1) !== constants_ts_2.CHAR_BACKWARD_SLASH)
                break;
        }
        const fromLen = fromEnd - fromStart;
        // Trim any leading backslashes
        let toStart = 0;
        let toEnd = to.length;
        for (; toStart < toEnd; ++toStart) {
            if (to.charCodeAt(toStart) !== constants_ts_2.CHAR_BACKWARD_SLASH)
                break;
        }
        // Trim trailing backslashes (applicable to UNC paths only)
        for (; toEnd - 1 > toStart; --toEnd) {
            if (to.charCodeAt(toEnd - 1) !== constants_ts_2.CHAR_BACKWARD_SLASH)
                break;
        }
        const toLen = toEnd - toStart;
        // Compare paths to find the longest common path from root
        const length = fromLen < toLen ? fromLen : toLen;
        let lastCommonSep = -1;
        let i = 0;
        for (; i <= length; ++i) {
            if (i === length) {
                if (toLen > length) {
                    if (to.charCodeAt(toStart + i) === constants_ts_2.CHAR_BACKWARD_SLASH) {
                        // We get here if `from` is the exact base path for `to`.
                        // For example: from='C:\\foo\\bar'; to='C:\\foo\\bar\\baz'
                        return toOrig.slice(toStart + i + 1);
                    }
                    else if (i === 2) {
                        // We get here if `from` is the device root.
                        // For example: from='C:\\'; to='C:\\foo'
                        return toOrig.slice(toStart + i);
                    }
                }
                if (fromLen > length) {
                    if (from.charCodeAt(fromStart + i) === constants_ts_2.CHAR_BACKWARD_SLASH) {
                        // We get here if `to` is the exact base path for `from`.
                        // For example: from='C:\\foo\\bar'; to='C:\\foo'
                        lastCommonSep = i;
                    }
                    else if (i === 2) {
                        // We get here if `to` is the device root.
                        // For example: from='C:\\foo\\bar'; to='C:\\'
                        lastCommonSep = 3;
                    }
                }
                break;
            }
            const fromCode = from.charCodeAt(fromStart + i);
            const toCode = to.charCodeAt(toStart + i);
            if (fromCode !== toCode)
                break;
            else if (fromCode === constants_ts_2.CHAR_BACKWARD_SLASH)
                lastCommonSep = i;
        }
        // We found a mismatch before the first common path separator was seen, so
        // return the original `to`.
        if (i !== length && lastCommonSep === -1) {
            return toOrig;
        }
        let out = "";
        if (lastCommonSep === -1)
            lastCommonSep = 0;
        // Generate the relative path based on the path difference between `to` and
        // `from`
        for (i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i) {
            if (i === fromEnd || from.charCodeAt(i) === constants_ts_2.CHAR_BACKWARD_SLASH) {
                if (out.length === 0)
                    out += "..";
                else
                    out += "\\..";
            }
        }
        // Lastly, append the rest of the destination (`to`) path that comes after
        // the common path parts
        if (out.length > 0) {
            return out + toOrig.slice(toStart + lastCommonSep, toEnd);
        }
        else {
            toStart += lastCommonSep;
            if (toOrig.charCodeAt(toStart) === constants_ts_2.CHAR_BACKWARD_SLASH)
                ++toStart;
            return toOrig.slice(toStart, toEnd);
        }
    }
    exports_9("relative", relative);
    function toNamespacedPath(path) {
        // Note: this will *probably* throw somewhere.
        if (typeof path !== "string")
            return path;
        if (path.length === 0)
            return "";
        const resolvedPath = resolve(path);
        if (resolvedPath.length >= 3) {
            if (resolvedPath.charCodeAt(0) === constants_ts_2.CHAR_BACKWARD_SLASH) {
                // Possible UNC root
                if (resolvedPath.charCodeAt(1) === constants_ts_2.CHAR_BACKWARD_SLASH) {
                    const code = resolvedPath.charCodeAt(2);
                    if (code !== constants_ts_2.CHAR_QUESTION_MARK && code !== constants_ts_2.CHAR_DOT) {
                        // Matched non-long UNC root, convert the path to a long UNC path
                        return `\\\\?\\UNC\\${resolvedPath.slice(2)}`;
                    }
                }
            }
            else if (utils_ts_1.isWindowsDeviceRoot(resolvedPath.charCodeAt(0))) {
                // Possible device root
                if (resolvedPath.charCodeAt(1) === constants_ts_2.CHAR_COLON &&
                    resolvedPath.charCodeAt(2) === constants_ts_2.CHAR_BACKWARD_SLASH) {
                    // Matched device root, convert the path to a long UNC path
                    return `\\\\?\\${resolvedPath}`;
                }
            }
        }
        return path;
    }
    exports_9("toNamespacedPath", toNamespacedPath);
    function dirname(path) {
        utils_ts_1.assertPath(path);
        const len = path.length;
        if (len === 0)
            return ".";
        let rootEnd = -1;
        let end = -1;
        let matchedSlash = true;
        let offset = 0;
        const code = path.charCodeAt(0);
        // Try to match a root
        if (len > 1) {
            if (utils_ts_1.isPathSeparator(code)) {
                // Possible UNC root
                rootEnd = offset = 1;
                if (utils_ts_1.isPathSeparator(path.charCodeAt(1))) {
                    // Matched double path separator at beginning
                    let j = 2;
                    let last = j;
                    // Match 1 or more non-path separators
                    for (; j < len; ++j) {
                        if (utils_ts_1.isPathSeparator(path.charCodeAt(j)))
                            break;
                    }
                    if (j < len && j !== last) {
                        // Matched!
                        last = j;
                        // Match 1 or more path separators
                        for (; j < len; ++j) {
                            if (!utils_ts_1.isPathSeparator(path.charCodeAt(j)))
                                break;
                        }
                        if (j < len && j !== last) {
                            // Matched!
                            last = j;
                            // Match 1 or more non-path separators
                            for (; j < len; ++j) {
                                if (utils_ts_1.isPathSeparator(path.charCodeAt(j)))
                                    break;
                            }
                            if (j === len) {
                                // We matched a UNC root only
                                return path;
                            }
                            if (j !== last) {
                                // We matched a UNC root with leftovers
                                // Offset by 1 to include the separator after the UNC root to
                                // treat it as a "normal root" on top of a (UNC) root
                                rootEnd = offset = j + 1;
                            }
                        }
                    }
                }
            }
            else if (utils_ts_1.isWindowsDeviceRoot(code)) {
                // Possible device root
                if (path.charCodeAt(1) === constants_ts_2.CHAR_COLON) {
                    rootEnd = offset = 2;
                    if (len > 2) {
                        if (utils_ts_1.isPathSeparator(path.charCodeAt(2)))
                            rootEnd = offset = 3;
                    }
                }
            }
        }
        else if (utils_ts_1.isPathSeparator(code)) {
            // `path` contains just a path separator, exit early to avoid
            // unnecessary work
            return path;
        }
        for (let i = len - 1; i >= offset; --i) {
            if (utils_ts_1.isPathSeparator(path.charCodeAt(i))) {
                if (!matchedSlash) {
                    end = i;
                    break;
                }
            }
            else {
                // We saw the first non-path separator
                matchedSlash = false;
            }
        }
        if (end === -1) {
            if (rootEnd === -1)
                return ".";
            else
                end = rootEnd;
        }
        return path.slice(0, end);
    }
    exports_9("dirname", dirname);
    function basename(path, ext = "") {
        if (ext !== undefined && typeof ext !== "string") {
            throw new TypeError('"ext" argument must be a string');
        }
        utils_ts_1.assertPath(path);
        let start = 0;
        let end = -1;
        let matchedSlash = true;
        let i;
        // Check for a drive letter prefix so as not to mistake the following
        // path separator as an extra separator at the end of the path that can be
        // disregarded
        if (path.length >= 2) {
            const drive = path.charCodeAt(0);
            if (utils_ts_1.isWindowsDeviceRoot(drive)) {
                if (path.charCodeAt(1) === constants_ts_2.CHAR_COLON)
                    start = 2;
            }
        }
        if (ext !== undefined && ext.length > 0 && ext.length <= path.length) {
            if (ext.length === path.length && ext === path)
                return "";
            let extIdx = ext.length - 1;
            let firstNonSlashEnd = -1;
            for (i = path.length - 1; i >= start; --i) {
                const code = path.charCodeAt(i);
                if (utils_ts_1.isPathSeparator(code)) {
                    // If we reached a path separator that was not part of a set of path
                    // separators at the end of the string, stop now
                    if (!matchedSlash) {
                        start = i + 1;
                        break;
                    }
                }
                else {
                    if (firstNonSlashEnd === -1) {
                        // We saw the first non-path separator, remember this index in case
                        // we need it if the extension ends up not matching
                        matchedSlash = false;
                        firstNonSlashEnd = i + 1;
                    }
                    if (extIdx >= 0) {
                        // Try to match the explicit extension
                        if (code === ext.charCodeAt(extIdx)) {
                            if (--extIdx === -1) {
                                // We matched the extension, so mark this as the end of our path
                                // component
                                end = i;
                            }
                        }
                        else {
                            // Extension does not match, so our result is the entire path
                            // component
                            extIdx = -1;
                            end = firstNonSlashEnd;
                        }
                    }
                }
            }
            if (start === end)
                end = firstNonSlashEnd;
            else if (end === -1)
                end = path.length;
            return path.slice(start, end);
        }
        else {
            for (i = path.length - 1; i >= start; --i) {
                if (utils_ts_1.isPathSeparator(path.charCodeAt(i))) {
                    // If we reached a path separator that was not part of a set of path
                    // separators at the end of the string, stop now
                    if (!matchedSlash) {
                        start = i + 1;
                        break;
                    }
                }
                else if (end === -1) {
                    // We saw the first non-path separator, mark this as the end of our
                    // path component
                    matchedSlash = false;
                    end = i + 1;
                }
            }
            if (end === -1)
                return "";
            return path.slice(start, end);
        }
    }
    exports_9("basename", basename);
    function extname(path) {
        utils_ts_1.assertPath(path);
        let start = 0;
        let startDot = -1;
        let startPart = 0;
        let end = -1;
        let matchedSlash = true;
        // Track the state of characters (if any) we see before our first dot and
        // after any path separator we find
        let preDotState = 0;
        // Check for a drive letter prefix so as not to mistake the following
        // path separator as an extra separator at the end of the path that can be
        // disregarded
        if (path.length >= 2 &&
            path.charCodeAt(1) === constants_ts_2.CHAR_COLON &&
            utils_ts_1.isWindowsDeviceRoot(path.charCodeAt(0))) {
            start = startPart = 2;
        }
        for (let i = path.length - 1; i >= start; --i) {
            const code = path.charCodeAt(i);
            if (utils_ts_1.isPathSeparator(code)) {
                // If we reached a path separator that was not part of a set of path
                // separators at the end of the string, stop now
                if (!matchedSlash) {
                    startPart = i + 1;
                    break;
                }
                continue;
            }
            if (end === -1) {
                // We saw the first non-path separator, mark this as the end of our
                // extension
                matchedSlash = false;
                end = i + 1;
            }
            if (code === constants_ts_2.CHAR_DOT) {
                // If this is our first dot, mark it as the start of our extension
                if (startDot === -1)
                    startDot = i;
                else if (preDotState !== 1)
                    preDotState = 1;
            }
            else if (startDot !== -1) {
                // We saw a non-dot and non-path separator before our dot, so we should
                // have a good chance at having a non-empty extension
                preDotState = -1;
            }
        }
        if (startDot === -1 ||
            end === -1 ||
            // We saw a non-dot character immediately before the dot
            preDotState === 0 ||
            // The (right-most) trimmed path component is exactly '..'
            (preDotState === 1 && startDot === end - 1 && startDot === startPart + 1)) {
            return "";
        }
        return path.slice(startDot, end);
    }
    exports_9("extname", extname);
    function format(pathObject) {
        /* eslint-disable max-len */
        if (pathObject === null || typeof pathObject !== "object") {
            throw new TypeError(`The "pathObject" argument must be of type Object. Received type ${typeof pathObject}`);
        }
        return utils_ts_1._format("\\", pathObject);
    }
    exports_9("format", format);
    function parse(path) {
        utils_ts_1.assertPath(path);
        const ret = { root: "", dir: "", base: "", ext: "", name: "" };
        const len = path.length;
        if (len === 0)
            return ret;
        let rootEnd = 0;
        let code = path.charCodeAt(0);
        // Try to match a root
        if (len > 1) {
            if (utils_ts_1.isPathSeparator(code)) {
                // Possible UNC root
                rootEnd = 1;
                if (utils_ts_1.isPathSeparator(path.charCodeAt(1))) {
                    // Matched double path separator at beginning
                    let j = 2;
                    let last = j;
                    // Match 1 or more non-path separators
                    for (; j < len; ++j) {
                        if (utils_ts_1.isPathSeparator(path.charCodeAt(j)))
                            break;
                    }
                    if (j < len && j !== last) {
                        // Matched!
                        last = j;
                        // Match 1 or more path separators
                        for (; j < len; ++j) {
                            if (!utils_ts_1.isPathSeparator(path.charCodeAt(j)))
                                break;
                        }
                        if (j < len && j !== last) {
                            // Matched!
                            last = j;
                            // Match 1 or more non-path separators
                            for (; j < len; ++j) {
                                if (utils_ts_1.isPathSeparator(path.charCodeAt(j)))
                                    break;
                            }
                            if (j === len) {
                                // We matched a UNC root only
                                rootEnd = j;
                            }
                            else if (j !== last) {
                                // We matched a UNC root with leftovers
                                rootEnd = j + 1;
                            }
                        }
                    }
                }
            }
            else if (utils_ts_1.isWindowsDeviceRoot(code)) {
                // Possible device root
                if (path.charCodeAt(1) === constants_ts_2.CHAR_COLON) {
                    rootEnd = 2;
                    if (len > 2) {
                        if (utils_ts_1.isPathSeparator(path.charCodeAt(2))) {
                            if (len === 3) {
                                // `path` contains just a drive root, exit early to avoid
                                // unnecessary work
                                ret.root = ret.dir = path;
                                return ret;
                            }
                            rootEnd = 3;
                        }
                    }
                    else {
                        // `path` contains just a drive root, exit early to avoid
                        // unnecessary work
                        ret.root = ret.dir = path;
                        return ret;
                    }
                }
            }
        }
        else if (utils_ts_1.isPathSeparator(code)) {
            // `path` contains just a path separator, exit early to avoid
            // unnecessary work
            ret.root = ret.dir = path;
            return ret;
        }
        if (rootEnd > 0)
            ret.root = path.slice(0, rootEnd);
        let startDot = -1;
        let startPart = rootEnd;
        let end = -1;
        let matchedSlash = true;
        let i = path.length - 1;
        // Track the state of characters (if any) we see before our first dot and
        // after any path separator we find
        let preDotState = 0;
        // Get non-dir info
        for (; i >= rootEnd; --i) {
            code = path.charCodeAt(i);
            if (utils_ts_1.isPathSeparator(code)) {
                // If we reached a path separator that was not part of a set of path
                // separators at the end of the string, stop now
                if (!matchedSlash) {
                    startPart = i + 1;
                    break;
                }
                continue;
            }
            if (end === -1) {
                // We saw the first non-path separator, mark this as the end of our
                // extension
                matchedSlash = false;
                end = i + 1;
            }
            if (code === constants_ts_2.CHAR_DOT) {
                // If this is our first dot, mark it as the start of our extension
                if (startDot === -1)
                    startDot = i;
                else if (preDotState !== 1)
                    preDotState = 1;
            }
            else if (startDot !== -1) {
                // We saw a non-dot and non-path separator before our dot, so we should
                // have a good chance at having a non-empty extension
                preDotState = -1;
            }
        }
        if (startDot === -1 ||
            end === -1 ||
            // We saw a non-dot character immediately before the dot
            preDotState === 0 ||
            // The (right-most) trimmed path component is exactly '..'
            (preDotState === 1 && startDot === end - 1 && startDot === startPart + 1)) {
            if (end !== -1) {
                ret.base = ret.name = path.slice(startPart, end);
            }
        }
        else {
            ret.name = path.slice(startPart, startDot);
            ret.base = path.slice(startPart, end);
            ret.ext = path.slice(startDot, end);
        }
        // If the directory is the root, use the entire root as the `dir` including
        // the trailing slash if any (`C:\abc` -> `C:\`). Otherwise, strip out the
        // trailing slash (`C:\abc\def` -> `C:\abc`).
        if (startPart > 0 && startPart !== rootEnd) {
            ret.dir = path.slice(0, startPart - 1);
        }
        else
            ret.dir = ret.root;
        return ret;
    }
    exports_9("parse", parse);
    return {
        setters: [
            function (constants_ts_2_1) {
                constants_ts_2 = constants_ts_2_1;
            },
            function (utils_ts_1_1) {
                utils_ts_1 = utils_ts_1_1;
            },
            function (asserts_ts_2_1) {
                asserts_ts_2 = asserts_ts_2_1;
            }
        ],
        execute: function () {
            cwd = Deno.cwd, env = Deno.env;
            exports_9("sep", sep = "\\");
            exports_9("delimiter", delimiter = ";");
        }
    };
});
// Copyright the Browserify authors. MIT License.
// Ported from https://github.com/browserify/path-browserify/
System.register("https://deno.land/std/path/posix", ["https://deno.land/std/path/constants", "https://deno.land/std/path/utils"], function (exports_10, context_10) {
    "use strict";
    var cwd, constants_ts_3, utils_ts_2, sep, delimiter;
    var __moduleName = context_10 && context_10.id;
    // path.resolve([from ...], to)
    function resolve(...pathSegments) {
        let resolvedPath = "";
        let resolvedAbsolute = false;
        for (let i = pathSegments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
            let path;
            if (i >= 0)
                path = pathSegments[i];
            else
                path = cwd();
            utils_ts_2.assertPath(path);
            // Skip empty entries
            if (path.length === 0) {
                continue;
            }
            resolvedPath = `${path}/${resolvedPath}`;
            resolvedAbsolute = path.charCodeAt(0) === constants_ts_3.CHAR_FORWARD_SLASH;
        }
        // At this point the path should be resolved to a full absolute path, but
        // handle relative paths to be safe (might happen when process.cwd() fails)
        // Normalize the path
        resolvedPath = utils_ts_2.normalizeString(resolvedPath, !resolvedAbsolute, "/", utils_ts_2.isPosixPathSeparator);
        if (resolvedAbsolute) {
            if (resolvedPath.length > 0)
                return `/${resolvedPath}`;
            else
                return "/";
        }
        else if (resolvedPath.length > 0)
            return resolvedPath;
        else
            return ".";
    }
    exports_10("resolve", resolve);
    function normalize(path) {
        utils_ts_2.assertPath(path);
        if (path.length === 0)
            return ".";
        const isAbsolute = path.charCodeAt(0) === constants_ts_3.CHAR_FORWARD_SLASH;
        const trailingSeparator = path.charCodeAt(path.length - 1) === constants_ts_3.CHAR_FORWARD_SLASH;
        // Normalize the path
        path = utils_ts_2.normalizeString(path, !isAbsolute, "/", utils_ts_2.isPosixPathSeparator);
        if (path.length === 0 && !isAbsolute)
            path = ".";
        if (path.length > 0 && trailingSeparator)
            path += "/";
        if (isAbsolute)
            return `/${path}`;
        return path;
    }
    exports_10("normalize", normalize);
    function isAbsolute(path) {
        utils_ts_2.assertPath(path);
        return path.length > 0 && path.charCodeAt(0) === constants_ts_3.CHAR_FORWARD_SLASH;
    }
    exports_10("isAbsolute", isAbsolute);
    function join(...paths) {
        if (paths.length === 0)
            return ".";
        let joined;
        for (let i = 0, len = paths.length; i < len; ++i) {
            const path = paths[i];
            utils_ts_2.assertPath(path);
            if (path.length > 0) {
                if (!joined)
                    joined = path;
                else
                    joined += `/${path}`;
            }
        }
        if (!joined)
            return ".";
        return normalize(joined);
    }
    exports_10("join", join);
    function relative(from, to) {
        utils_ts_2.assertPath(from);
        utils_ts_2.assertPath(to);
        if (from === to)
            return "";
        from = resolve(from);
        to = resolve(to);
        if (from === to)
            return "";
        // Trim any leading backslashes
        let fromStart = 1;
        const fromEnd = from.length;
        for (; fromStart < fromEnd; ++fromStart) {
            if (from.charCodeAt(fromStart) !== constants_ts_3.CHAR_FORWARD_SLASH)
                break;
        }
        const fromLen = fromEnd - fromStart;
        // Trim any leading backslashes
        let toStart = 1;
        const toEnd = to.length;
        for (; toStart < toEnd; ++toStart) {
            if (to.charCodeAt(toStart) !== constants_ts_3.CHAR_FORWARD_SLASH)
                break;
        }
        const toLen = toEnd - toStart;
        // Compare paths to find the longest common path from root
        const length = fromLen < toLen ? fromLen : toLen;
        let lastCommonSep = -1;
        let i = 0;
        for (; i <= length; ++i) {
            if (i === length) {
                if (toLen > length) {
                    if (to.charCodeAt(toStart + i) === constants_ts_3.CHAR_FORWARD_SLASH) {
                        // We get here if `from` is the exact base path for `to`.
                        // For example: from='/foo/bar'; to='/foo/bar/baz'
                        return to.slice(toStart + i + 1);
                    }
                    else if (i === 0) {
                        // We get here if `from` is the root
                        // For example: from='/'; to='/foo'
                        return to.slice(toStart + i);
                    }
                }
                else if (fromLen > length) {
                    if (from.charCodeAt(fromStart + i) === constants_ts_3.CHAR_FORWARD_SLASH) {
                        // We get here if `to` is the exact base path for `from`.
                        // For example: from='/foo/bar/baz'; to='/foo/bar'
                        lastCommonSep = i;
                    }
                    else if (i === 0) {
                        // We get here if `to` is the root.
                        // For example: from='/foo'; to='/'
                        lastCommonSep = 0;
                    }
                }
                break;
            }
            const fromCode = from.charCodeAt(fromStart + i);
            const toCode = to.charCodeAt(toStart + i);
            if (fromCode !== toCode)
                break;
            else if (fromCode === constants_ts_3.CHAR_FORWARD_SLASH)
                lastCommonSep = i;
        }
        let out = "";
        // Generate the relative path based on the path difference between `to`
        // and `from`
        for (i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i) {
            if (i === fromEnd || from.charCodeAt(i) === constants_ts_3.CHAR_FORWARD_SLASH) {
                if (out.length === 0)
                    out += "..";
                else
                    out += "/..";
            }
        }
        // Lastly, append the rest of the destination (`to`) path that comes after
        // the common path parts
        if (out.length > 0)
            return out + to.slice(toStart + lastCommonSep);
        else {
            toStart += lastCommonSep;
            if (to.charCodeAt(toStart) === constants_ts_3.CHAR_FORWARD_SLASH)
                ++toStart;
            return to.slice(toStart);
        }
    }
    exports_10("relative", relative);
    function toNamespacedPath(path) {
        // Non-op on posix systems
        return path;
    }
    exports_10("toNamespacedPath", toNamespacedPath);
    function dirname(path) {
        utils_ts_2.assertPath(path);
        if (path.length === 0)
            return ".";
        const hasRoot = path.charCodeAt(0) === constants_ts_3.CHAR_FORWARD_SLASH;
        let end = -1;
        let matchedSlash = true;
        for (let i = path.length - 1; i >= 1; --i) {
            if (path.charCodeAt(i) === constants_ts_3.CHAR_FORWARD_SLASH) {
                if (!matchedSlash) {
                    end = i;
                    break;
                }
            }
            else {
                // We saw the first non-path separator
                matchedSlash = false;
            }
        }
        if (end === -1)
            return hasRoot ? "/" : ".";
        if (hasRoot && end === 1)
            return "//";
        return path.slice(0, end);
    }
    exports_10("dirname", dirname);
    function basename(path, ext = "") {
        if (ext !== undefined && typeof ext !== "string") {
            throw new TypeError('"ext" argument must be a string');
        }
        utils_ts_2.assertPath(path);
        let start = 0;
        let end = -1;
        let matchedSlash = true;
        let i;
        if (ext !== undefined && ext.length > 0 && ext.length <= path.length) {
            if (ext.length === path.length && ext === path)
                return "";
            let extIdx = ext.length - 1;
            let firstNonSlashEnd = -1;
            for (i = path.length - 1; i >= 0; --i) {
                const code = path.charCodeAt(i);
                if (code === constants_ts_3.CHAR_FORWARD_SLASH) {
                    // If we reached a path separator that was not part of a set of path
                    // separators at the end of the string, stop now
                    if (!matchedSlash) {
                        start = i + 1;
                        break;
                    }
                }
                else {
                    if (firstNonSlashEnd === -1) {
                        // We saw the first non-path separator, remember this index in case
                        // we need it if the extension ends up not matching
                        matchedSlash = false;
                        firstNonSlashEnd = i + 1;
                    }
                    if (extIdx >= 0) {
                        // Try to match the explicit extension
                        if (code === ext.charCodeAt(extIdx)) {
                            if (--extIdx === -1) {
                                // We matched the extension, so mark this as the end of our path
                                // component
                                end = i;
                            }
                        }
                        else {
                            // Extension does not match, so our result is the entire path
                            // component
                            extIdx = -1;
                            end = firstNonSlashEnd;
                        }
                    }
                }
            }
            if (start === end)
                end = firstNonSlashEnd;
            else if (end === -1)
                end = path.length;
            return path.slice(start, end);
        }
        else {
            for (i = path.length - 1; i >= 0; --i) {
                if (path.charCodeAt(i) === constants_ts_3.CHAR_FORWARD_SLASH) {
                    // If we reached a path separator that was not part of a set of path
                    // separators at the end of the string, stop now
                    if (!matchedSlash) {
                        start = i + 1;
                        break;
                    }
                }
                else if (end === -1) {
                    // We saw the first non-path separator, mark this as the end of our
                    // path component
                    matchedSlash = false;
                    end = i + 1;
                }
            }
            if (end === -1)
                return "";
            return path.slice(start, end);
        }
    }
    exports_10("basename", basename);
    function extname(path) {
        utils_ts_2.assertPath(path);
        let startDot = -1;
        let startPart = 0;
        let end = -1;
        let matchedSlash = true;
        // Track the state of characters (if any) we see before our first dot and
        // after any path separator we find
        let preDotState = 0;
        for (let i = path.length - 1; i >= 0; --i) {
            const code = path.charCodeAt(i);
            if (code === constants_ts_3.CHAR_FORWARD_SLASH) {
                // If we reached a path separator that was not part of a set of path
                // separators at the end of the string, stop now
                if (!matchedSlash) {
                    startPart = i + 1;
                    break;
                }
                continue;
            }
            if (end === -1) {
                // We saw the first non-path separator, mark this as the end of our
                // extension
                matchedSlash = false;
                end = i + 1;
            }
            if (code === constants_ts_3.CHAR_DOT) {
                // If this is our first dot, mark it as the start of our extension
                if (startDot === -1)
                    startDot = i;
                else if (preDotState !== 1)
                    preDotState = 1;
            }
            else if (startDot !== -1) {
                // We saw a non-dot and non-path separator before our dot, so we should
                // have a good chance at having a non-empty extension
                preDotState = -1;
            }
        }
        if (startDot === -1 ||
            end === -1 ||
            // We saw a non-dot character immediately before the dot
            preDotState === 0 ||
            // The (right-most) trimmed path component is exactly '..'
            (preDotState === 1 && startDot === end - 1 && startDot === startPart + 1)) {
            return "";
        }
        return path.slice(startDot, end);
    }
    exports_10("extname", extname);
    function format(pathObject) {
        /* eslint-disable max-len */
        if (pathObject === null || typeof pathObject !== "object") {
            throw new TypeError(`The "pathObject" argument must be of type Object. Received type ${typeof pathObject}`);
        }
        return utils_ts_2._format("/", pathObject);
    }
    exports_10("format", format);
    function parse(path) {
        utils_ts_2.assertPath(path);
        const ret = { root: "", dir: "", base: "", ext: "", name: "" };
        if (path.length === 0)
            return ret;
        const isAbsolute = path.charCodeAt(0) === constants_ts_3.CHAR_FORWARD_SLASH;
        let start;
        if (isAbsolute) {
            ret.root = "/";
            start = 1;
        }
        else {
            start = 0;
        }
        let startDot = -1;
        let startPart = 0;
        let end = -1;
        let matchedSlash = true;
        let i = path.length - 1;
        // Track the state of characters (if any) we see before our first dot and
        // after any path separator we find
        let preDotState = 0;
        // Get non-dir info
        for (; i >= start; --i) {
            const code = path.charCodeAt(i);
            if (code === constants_ts_3.CHAR_FORWARD_SLASH) {
                // If we reached a path separator that was not part of a set of path
                // separators at the end of the string, stop now
                if (!matchedSlash) {
                    startPart = i + 1;
                    break;
                }
                continue;
            }
            if (end === -1) {
                // We saw the first non-path separator, mark this as the end of our
                // extension
                matchedSlash = false;
                end = i + 1;
            }
            if (code === constants_ts_3.CHAR_DOT) {
                // If this is our first dot, mark it as the start of our extension
                if (startDot === -1)
                    startDot = i;
                else if (preDotState !== 1)
                    preDotState = 1;
            }
            else if (startDot !== -1) {
                // We saw a non-dot and non-path separator before our dot, so we should
                // have a good chance at having a non-empty extension
                preDotState = -1;
            }
        }
        if (startDot === -1 ||
            end === -1 ||
            // We saw a non-dot character immediately before the dot
            preDotState === 0 ||
            // The (right-most) trimmed path component is exactly '..'
            (preDotState === 1 && startDot === end - 1 && startDot === startPart + 1)) {
            if (end !== -1) {
                if (startPart === 0 && isAbsolute) {
                    ret.base = ret.name = path.slice(1, end);
                }
                else {
                    ret.base = ret.name = path.slice(startPart, end);
                }
            }
        }
        else {
            if (startPart === 0 && isAbsolute) {
                ret.name = path.slice(1, startDot);
                ret.base = path.slice(1, end);
            }
            else {
                ret.name = path.slice(startPart, startDot);
                ret.base = path.slice(startPart, end);
            }
            ret.ext = path.slice(startDot, end);
        }
        if (startPart > 0)
            ret.dir = path.slice(0, startPart - 1);
        else if (isAbsolute)
            ret.dir = "/";
        return ret;
    }
    exports_10("parse", parse);
    return {
        setters: [
            function (constants_ts_3_1) {
                constants_ts_3 = constants_ts_3_1;
            },
            function (utils_ts_2_1) {
                utils_ts_2 = utils_ts_2_1;
            }
        ],
        execute: function () {
            cwd = Deno.cwd;
            exports_10("sep", sep = "/");
            exports_10("delimiter", delimiter = ":");
        }
    };
});
// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
System.register("https://deno.land/std/path/common", ["https://deno.land/std/path/constants"], function (exports_11, context_11) {
    "use strict";
    var constants_ts_4;
    var __moduleName = context_11 && context_11.id;
    /** Determines the common path from a set of paths, using an optional separator,
     * which defaults to the OS default separator.
     *
     *       import { common } from "https://deno.land/std/path/mod.ts";
     *       const p = common([
     *         "./deno/std/path/mod.ts",
     *         "./deno/std/fs/mod.ts",
     *       ]);
     *       console.log(p); // "./deno/std/"
     *
     */
    function common(paths, sep = constants_ts_4.SEP) {
        const [first = "", ...remaining] = paths;
        if (first === "" || remaining.length === 0) {
            return first.substring(0, first.lastIndexOf(sep) + 1);
        }
        const parts = first.split(sep);
        let endOfPrefix = parts.length;
        for (const path of remaining) {
            const compare = path.split(sep);
            for (let i = 0; i < endOfPrefix; i++) {
                if (compare[i] !== parts[i]) {
                    endOfPrefix = i;
                }
            }
            if (endOfPrefix === 0) {
                return "";
            }
        }
        const prefix = parts.slice(0, endOfPrefix).join(sep);
        return prefix.endsWith(sep) ? prefix : `${prefix}${sep}`;
    }
    exports_11("common", common);
    return {
        setters: [
            function (constants_ts_4_1) {
                constants_ts_4 = constants_ts_4_1;
            }
        ],
        execute: function () {
        }
    };
});
// This file is ported from globrex@0.1.2
// MIT License
// Copyright (c) 2018 Terkel Gjervig Nielsen
System.register("https://deno.land/std/path/globrex", [], function (exports_12, context_12) {
    "use strict";
    var isWin, SEP, SEP_ESC, SEP_RAW, GLOBSTAR, WILDCARD, GLOBSTAR_SEGMENT, WILDCARD_SEGMENT;
    var __moduleName = context_12 && context_12.id;
    /**
     * Convert any glob pattern to a JavaScript Regexp object
     * @param glob Glob pattern to convert
     * @param opts Configuration object
     * @param [opts.extended=false] Support advanced ext globbing
     * @param [opts.globstar=false] Support globstar
     * @param [opts.strict=true] be laissez faire about mutiple slashes
     * @param [opts.filepath=""] Parse as filepath for extra path related features
     * @param [opts.flags=""] RegExp globs
     * @returns Converted object with string, segments and RegExp object
     */
    function globrex(glob, { extended = false, globstar = false, strict = false, filepath = false, flags = "", } = {}) {
        const sepPattern = new RegExp(`^${SEP}${strict ? "" : "+"}$`);
        let regex = "";
        let segment = "";
        let pathRegexStr = "";
        const pathSegments = [];
        // If we are doing extended matching, this boolean is true when we are inside
        // a group (eg {*.html,*.js}), and false otherwise.
        let inGroup = false;
        let inRange = false;
        // extglob stack. Keep track of scope
        const ext = [];
        // Helper function to build string and segments
        function add(str, options = { split: false, last: false, only: "" }) {
            const { split, last, only } = options;
            if (only !== "path")
                regex += str;
            if (filepath && only !== "regex") {
                pathRegexStr += str.match(sepPattern) ? SEP : str;
                if (split) {
                    if (last)
                        segment += str;
                    if (segment !== "") {
                        // change it 'includes'
                        if (!flags.includes("g"))
                            segment = `^${segment}$`;
                        pathSegments.push(new RegExp(segment, flags));
                    }
                    segment = "";
                }
                else {
                    segment += str;
                }
            }
        }
        let c, n;
        for (let i = 0; i < glob.length; i++) {
            c = glob[i];
            n = glob[i + 1];
            if (["\\", "$", "^", ".", "="].includes(c)) {
                add(`\\${c}`);
                continue;
            }
            if (c.match(sepPattern)) {
                add(SEP, { split: true });
                if (n != null && n.match(sepPattern) && !strict)
                    regex += "?";
                continue;
            }
            if (c === "(") {
                if (ext.length) {
                    add(`${c}?:`);
                    continue;
                }
                add(`\\${c}`);
                continue;
            }
            if (c === ")") {
                if (ext.length) {
                    add(c);
                    const type = ext.pop();
                    if (type === "@") {
                        add("{1}");
                    }
                    else if (type === "!") {
                        add(WILDCARD);
                    }
                    else {
                        add(type);
                    }
                    continue;
                }
                add(`\\${c}`);
                continue;
            }
            if (c === "|") {
                if (ext.length) {
                    add(c);
                    continue;
                }
                add(`\\${c}`);
                continue;
            }
            if (c === "+") {
                if (n === "(" && extended) {
                    ext.push(c);
                    continue;
                }
                add(`\\${c}`);
                continue;
            }
            if (c === "@" && extended) {
                if (n === "(") {
                    ext.push(c);
                    continue;
                }
            }
            if (c === "!") {
                if (extended) {
                    if (inRange) {
                        add("^");
                        continue;
                    }
                    if (n === "(") {
                        ext.push(c);
                        add("(?!");
                        i++;
                        continue;
                    }
                    add(`\\${c}`);
                    continue;
                }
                add(`\\${c}`);
                continue;
            }
            if (c === "?") {
                if (extended) {
                    if (n === "(") {
                        ext.push(c);
                    }
                    else {
                        add(".");
                    }
                    continue;
                }
                add(`\\${c}`);
                continue;
            }
            if (c === "[") {
                if (inRange && n === ":") {
                    i++; // skip [
                    let value = "";
                    while (glob[++i] !== ":")
                        value += glob[i];
                    if (value === "alnum")
                        add("(?:\\w|\\d)");
                    else if (value === "space")
                        add("\\s");
                    else if (value === "digit")
                        add("\\d");
                    i++; // skip last ]
                    continue;
                }
                if (extended) {
                    inRange = true;
                    add(c);
                    continue;
                }
                add(`\\${c}`);
                continue;
            }
            if (c === "]") {
                if (extended) {
                    inRange = false;
                    add(c);
                    continue;
                }
                add(`\\${c}`);
                continue;
            }
            if (c === "{") {
                if (extended) {
                    inGroup = true;
                    add("(?:");
                    continue;
                }
                add(`\\${c}`);
                continue;
            }
            if (c === "}") {
                if (extended) {
                    inGroup = false;
                    add(")");
                    continue;
                }
                add(`\\${c}`);
                continue;
            }
            if (c === ",") {
                if (inGroup) {
                    add("|");
                    continue;
                }
                add(`\\${c}`);
                continue;
            }
            if (c === "*") {
                if (n === "(" && extended) {
                    ext.push(c);
                    continue;
                }
                // Move over all consecutive "*"'s.
                // Also store the previous and next characters
                const prevChar = glob[i - 1];
                let starCount = 1;
                while (glob[i + 1] === "*") {
                    starCount++;
                    i++;
                }
                const nextChar = glob[i + 1];
                if (!globstar) {
                    // globstar is disabled, so treat any number of "*" as one
                    add(".*");
                }
                else {
                    // globstar is enabled, so determine if this is a globstar segment
                    const isGlobstar = starCount > 1 && // multiple "*"'s
                        // from the start of the segment
                        [SEP_RAW, "/", undefined].includes(prevChar) &&
                        // to the end of the segment
                        [SEP_RAW, "/", undefined].includes(nextChar);
                    if (isGlobstar) {
                        // it's a globstar, so match zero or more path segments
                        add(GLOBSTAR, { only: "regex" });
                        add(GLOBSTAR_SEGMENT, { only: "path", last: true, split: true });
                        i++; // move over the "/"
                    }
                    else {
                        // it's not a globstar, so only match one path segment
                        add(WILDCARD, { only: "regex" });
                        add(WILDCARD_SEGMENT, { only: "path" });
                    }
                }
                continue;
            }
            add(c);
        }
        // When regexp 'g' flag is specified don't
        // constrain the regular expression with ^ & $
        if (!flags.includes("g")) {
            regex = `^${regex}$`;
            segment = `^${segment}$`;
            if (filepath)
                pathRegexStr = `^${pathRegexStr}$`;
        }
        const result = { regex: new RegExp(regex, flags) };
        // Push the last segment
        if (filepath) {
            pathSegments.push(new RegExp(segment, flags));
            result.path = {
                regex: new RegExp(pathRegexStr, flags),
                segments: pathSegments,
                globstar: new RegExp(!flags.includes("g") ? `^${GLOBSTAR_SEGMENT}$` : GLOBSTAR_SEGMENT, flags),
            };
        }
        return result;
    }
    exports_12("globrex", globrex);
    return {
        setters: [],
        execute: function () {
            isWin = Deno.build.os === "win";
            SEP = isWin ? `(?:\\\\|\\/)` : `\\/`;
            SEP_ESC = isWin ? `\\\\` : `/`;
            SEP_RAW = isWin ? `\\` : `/`;
            GLOBSTAR = `(?:(?:[^${SEP_ESC}/]*(?:${SEP_ESC}|\/|$))*)`;
            WILDCARD = `(?:[^${SEP_ESC}/]*)`;
            GLOBSTAR_SEGMENT = `((?:[^${SEP_ESC}/]*(?:${SEP_ESC}|\/|$))*)`;
            WILDCARD_SEGMENT = `(?:[^${SEP_ESC}/]*)`;
        }
    };
});
System.register("https://deno.land/std/path/glob", ["https://deno.land/std/path/constants", "https://deno.land/std/path/globrex", "https://deno.land/std/path/mod", "https://deno.land/std/testing/asserts"], function (exports_13, context_13) {
    "use strict";
    var constants_ts_5, globrex_ts_1, mod_ts_1, asserts_ts_3;
    var __moduleName = context_13 && context_13.id;
    /**
     * Generate a regex based on glob pattern and options
     * This was meant to be using the the `fs.walk` function
     * but can be used anywhere else.
     * Examples:
     *
     *     Looking for all the `ts` files:
     *     walkSync(".", {
     *       match: [globToRegExp("*.ts")]
     *     })
     *
     *     Looking for all the `.json` files in any subfolder:
     *     walkSync(".", {
     *       match: [globToRegExp(join("a", "**", "*.json"),{
     *         flags: "g",
     *         extended: true,
     *         globstar: true
     *       })]
     *     })
     *
     * @param glob - Glob pattern to be used
     * @param options - Specific options for the glob pattern
     * @returns A RegExp for the glob pattern
     */
    function globToRegExp(glob, { extended = false, globstar = true } = {}) {
        const result = globrex_ts_1.globrex(glob, {
            extended,
            globstar,
            strict: false,
            filepath: true,
        });
        asserts_ts_3.assert(result.path != null);
        return result.path.regex;
    }
    exports_13("globToRegExp", globToRegExp);
    /** Test whether the given string is a glob */
    function isGlob(str) {
        const chars = { "{": "}", "(": ")", "[": "]" };
        /* eslint-disable-next-line max-len */
        const regex = /\\(.)|(^!|\*|[\].+)]\?|\[[^\\\]]+\]|\{[^\\}]+\}|\(\?[:!=][^\\)]+\)|\([^|]+\|[^\\)]+\))/;
        if (str === "") {
            return false;
        }
        let match;
        while ((match = regex.exec(str))) {
            if (match[2])
                return true;
            let idx = match.index + match[0].length;
            // if an open bracket/brace/paren is escaped,
            // set the index to the next closing character
            const open = match[1];
            const close = open ? chars[open] : null;
            if (open && close) {
                const n = str.indexOf(close, idx);
                if (n !== -1) {
                    idx = n + 1;
                }
            }
            str = str.slice(idx);
        }
        return false;
    }
    exports_13("isGlob", isGlob);
    /** Like normalize(), but doesn't collapse "**\/.." when `globstar` is true. */
    function normalizeGlob(glob, { globstar = false } = {}) {
        if (!!glob.match(/\0/g)) {
            throw new Error(`Glob contains invalid characters: "${glob}"`);
        }
        if (!globstar) {
            return mod_ts_1.normalize(glob);
        }
        const s = constants_ts_5.SEP_PATTERN.source;
        const badParentPattern = new RegExp(`(?<=(${s}|^)\\*\\*${s})\\.\\.(?=${s}|$)`, "g");
        return mod_ts_1.normalize(glob.replace(badParentPattern, "\0")).replace(/\0/g, "..");
    }
    exports_13("normalizeGlob", normalizeGlob);
    /** Like join(), but doesn't collapse "**\/.." when `globstar` is true. */
    function joinGlobs(globs, { extended = false, globstar = false } = {}) {
        if (!globstar || globs.length == 0) {
            return mod_ts_1.join(...globs);
        }
        if (globs.length === 0)
            return ".";
        let joined;
        for (const glob of globs) {
            const path = glob;
            if (path.length > 0) {
                if (!joined)
                    joined = path;
                else
                    joined += `${constants_ts_5.SEP}${path}`;
            }
        }
        if (!joined)
            return ".";
        return normalizeGlob(joined, { extended, globstar });
    }
    exports_13("joinGlobs", joinGlobs);
    return {
        setters: [
            function (constants_ts_5_1) {
                constants_ts_5 = constants_ts_5_1;
            },
            function (globrex_ts_1_1) {
                globrex_ts_1 = globrex_ts_1_1;
            },
            function (mod_ts_1_1) {
                mod_ts_1 = mod_ts_1_1;
            },
            function (asserts_ts_3_1) {
                asserts_ts_3 = asserts_ts_3_1;
            }
        ],
        execute: function () {
        }
    };
});
// Copyright the Browserify authors. MIT License.
// Ported mostly from https://github.com/browserify/path-browserify/
System.register("https://deno.land/std/path/mod", ["https://deno.land/std/path/win32", "https://deno.land/std/path/posix", "https://deno.land/std/path/constants", "https://deno.land/std/path/common", "https://deno.land/std/path/glob", "https://deno.land/std/path/globrex"], function (exports_14, context_14) {
    "use strict";
    var _win32, _posix, constants_ts_6, path, win32, posix, resolve, normalize, isAbsolute, join, relative, toNamespacedPath, dirname, basename, extname, format, parse, sep, delimiter;
    var __moduleName = context_14 && context_14.id;
    var exportedNames_1 = {
        "win32": true,
        "posix": true,
        "resolve": true,
        "normalize": true,
        "isAbsolute": true,
        "join": true,
        "relative": true,
        "toNamespacedPath": true,
        "dirname": true,
        "basename": true,
        "extname": true,
        "format": true,
        "parse": true,
        "sep": true,
        "delimiter": true,
        "common": true,
        "EOL": true,
        "SEP": true,
        "SEP_PATTERN": true,
        "isWindows": true
    };
    function exportStar_1(m) {
        var exports = {};
        for (var n in m) {
            if (n !== "default" && !exportedNames_1.hasOwnProperty(n)) exports[n] = m[n];
        }
        exports_14(exports);
    }
    return {
        setters: [
            function (_win32_1) {
                _win32 = _win32_1;
            },
            function (_posix_1) {
                _posix = _posix_1;
            },
            function (constants_ts_6_1) {
                constants_ts_6 = constants_ts_6_1;
                exports_14({
                    "EOL": constants_ts_6_1["EOL"],
                    "SEP": constants_ts_6_1["SEP"],
                    "SEP_PATTERN": constants_ts_6_1["SEP_PATTERN"],
                    "isWindows": constants_ts_6_1["isWindows"]
                });
            },
            function (common_ts_1_1) {
                exports_14({
                    "common": common_ts_1_1["common"]
                });
            },
            function (glob_ts_1_1) {
                exportStar_1(glob_ts_1_1);
            },
            function (globrex_ts_2_1) {
                exportStar_1(globrex_ts_2_1);
            }
        ],
        execute: function () {
            path = constants_ts_6.isWindows ? _win32 : _posix;
            exports_14("win32", win32 = _win32);
            exports_14("posix", posix = _posix);
            exports_14("resolve", resolve = path.resolve), exports_14("normalize", normalize = path.normalize), exports_14("isAbsolute", isAbsolute = path.isAbsolute), exports_14("join", join = path.join), exports_14("relative", relative = path.relative), exports_14("toNamespacedPath", toNamespacedPath = path.toNamespacedPath), exports_14("dirname", dirname = path.dirname), exports_14("basename", basename = path.basename), exports_14("extname", extname = path.extname), exports_14("format", format = path.format), exports_14("parse", parse = path.parse), exports_14("sep", sep = path.sep), exports_14("delimiter", delimiter = path.delimiter);
        }
    };
});
System.register("https://dev.jspm.io/npm:asap@2.0.6/browser-raw.dew", [], function (exports_15, context_15) {
    "use strict";
    var exports, _dewExec, _global;
    var __moduleName = context_15 && context_15.id;
    function dew() {
        if (_dewExec)
            return exports;
        _dewExec = true;
        // Use the fastest means possible to execute a task in its own turn, with
        // priority over other events including IO, animation, reflow, and redraw
        // events in browsers.
        //
        // An exception thrown by a task will permanently interrupt the processing of
        // subsequent tasks. The higher level `asap` function ensures that if an
        // exception is thrown by a task, that the task queue will continue flushing as
        // soon as possible, but if you use `rawAsap` directly, you are responsible to
        // either ensure that no exceptions are thrown from your task, or to manually
        // call `rawAsap.requestFlush` if an exception is thrown.
        exports = rawAsap;
        function rawAsap(task) {
            if (!queue.length) {
                requestFlush();
                flushing = true;
            } // Equivalent to push, but avoids a function call.
            queue[queue.length] = task;
        }
        var queue = []; // Once a flush has been requested, no further calls to `requestFlush` are
        // necessary until the next `flush` completes.
        var flushing = false; // `requestFlush` is an implementation-specific method that attempts to kick
        // off a `flush` event as quickly as possible. `flush` will attempt to exhaust
        // the event queue before yielding to the browser's own event loop.
        var requestFlush; // The position of the next task to execute in the task queue. This is
        // preserved between calls to `flush` so that it can be resumed if
        // a task throws an exception.
        var index = 0; // If a task schedules additional tasks recursively, the task queue can grow
        // unbounded. To prevent memory exhaustion, the task queue will periodically
        // truncate already-completed tasks.
        var capacity = 1024; // The flush function processes all tasks that have been scheduled with
        // `rawAsap` unless and until one of those tasks throws an exception.
        // If a task throws an exception, `flush` ensures that its state will remain
        // consistent and will resume where it left off when called again.
        // However, `flush` does not make any arrangements to be called again if an
        // exception is thrown.
        function flush() {
            while (index < queue.length) {
                var currentIndex = index; // Advance the index before calling the task. This ensures that we will
                // begin flushing on the next task the task throws an error.
                index = index + 1;
                queue[currentIndex].call(); // Prevent leaking memory for long chains of recursive calls to `asap`.
                // If we call `asap` within tasks scheduled by `asap`, the queue will
                // grow, but to avoid an O(n) walk for every task we execute, we don't
                // shift tasks off the queue after they have been executed.
                // Instead, we periodically shift 1024 tasks off the queue.
                if (index > capacity) {
                    // Manually shift all values starting at the index back to the
                    // beginning of the queue.
                    for (var scan = 0, newLength = queue.length - index; scan < newLength; scan++) {
                        queue[scan] = queue[scan + index];
                    }
                    queue.length -= index;
                    index = 0;
                }
            }
            queue.length = 0;
            index = 0;
            flushing = false;
        } // `requestFlush` is implemented using a strategy based on data collected from
        // every available SauceLabs Selenium web driver worker at time of writing.
        // https://docs.google.com/spreadsheets/d/1mG-5UYGup5qxGdEMWkhP6BWCz053NUb2E1QoUTU16uA/edit#gid=783724593
        // Safari 6 and 6.1 for desktop, iPad, and iPhone are the only browsers that
        // have WebKitMutationObserver but not un-prefixed MutationObserver.
        // Must use `global` or `self` instead of `window` to work in both frames and web
        // workers. `global` is a provision of Browserify, Mr, Mrs, or Mop.
        /* globals self */
        var scope = typeof _global !== "undefined" ? _global : self;
        var BrowserMutationObserver = scope.MutationObserver || scope.WebKitMutationObserver; // MutationObservers are desirable because they have high priority and work
        // reliably everywhere they are implemented.
        // They are implemented in all modern browsers.
        //
        // - Android 4-4.3
        // - Chrome 26-34
        // - Firefox 14-29
        // - Internet Explorer 11
        // - iPad Safari 6-7.1
        // - iPhone Safari 7-7.1
        // - Safari 6-7
        if (typeof BrowserMutationObserver === "function") {
            requestFlush = makeRequestCallFromMutationObserver(flush); // MessageChannels are desirable because they give direct access to the HTML
            // task queue, are implemented in Internet Explorer 10, Safari 5.0-1, and Opera
            // 11-12, and in web workers in many engines.
            // Although message channels yield to any queued rendering and IO tasks, they
            // would be better than imposing the 4ms delay of timers.
            // However, they do not work reliably in Internet Explorer or Safari.
            // Internet Explorer 10 is the only browser that has setImmediate but does
            // not have MutationObservers.
            // Although setImmediate yields to the browser's renderer, it would be
            // preferrable to falling back to setTimeout since it does not have
            // the minimum 4ms penalty.
            // Unfortunately there appears to be a bug in Internet Explorer 10 Mobile (and
            // Desktop to a lesser extent) that renders both setImmediate and
            // MessageChannel useless for the purposes of ASAP.
            // https://github.com/kriskowal/q/issues/396
            // Timers are implemented universally.
            // We fall back to timers in workers in most engines, and in foreground
            // contexts in the following browsers.
            // However, note that even this simple case requires nuances to operate in a
            // broad spectrum of browsers.
            //
            // - Firefox 3-13
            // - Internet Explorer 6-9
            // - iPad Safari 4.3
            // - Lynx 2.8.7
        }
        else {
            requestFlush = makeRequestCallFromTimer(flush);
        } // `requestFlush` requests that the high priority event queue be flushed as
        // soon as possible.
        // This is useful to prevent an error thrown in a task from stalling the event
        // queue if the exception handled by Node.js’s
        // `process.on("uncaughtException")` or by a domain.
        rawAsap.requestFlush = requestFlush; // To request a high priority event, we induce a mutation observer by toggling
        // the text of a text node between "1" and "-1".
        function makeRequestCallFromMutationObserver(callback) {
            var toggle = 1;
            var observer = new BrowserMutationObserver(callback);
            var node = document.createTextNode("");
            observer.observe(node, {
                characterData: true
            });
            return function requestCall() {
                toggle = -toggle;
                node.data = toggle;
            };
        } // The message channel technique was discovered by Malte Ubl and was the
        // original foundation for this library.
        // http://www.nonblocking.io/2011/06/windownexttick.html
        // Safari 6.0.5 (at least) intermittently fails to create message ports on a
        // page's first load. Thankfully, this version of Safari supports
        // MutationObservers, so we don't need to fall back in that case.
        // function makeRequestCallFromMessageChannel(callback) {
        //     var channel = new MessageChannel();
        //     channel.port1.onmessage = callback;
        //     return function requestCall() {
        //         channel.port2.postMessage(0);
        //     };
        // }
        // For reasons explained above, we are also unable to use `setImmediate`
        // under any circumstances.
        // Even if we were, there is another bug in Internet Explorer 10.
        // It is not sufficient to assign `setImmediate` to `requestFlush` because
        // `setImmediate` must be called *by name* and therefore must be wrapped in a
        // closure.
        // Never forget.
        // function makeRequestCallFromSetImmediate(callback) {
        //     return function requestCall() {
        //         setImmediate(callback);
        //     };
        // }
        // Safari 6.0 has a problem where timers will get lost while the user is
        // scrolling. This problem does not impact ASAP because Safari 6.0 supports
        // mutation observers, so that implementation is used instead.
        // However, if we ever elect to use timers in Safari, the prevalent work-around
        // is to add a scroll event listener that calls for a flush.
        // `setTimeout` does not call the passed callback if the delay is less than
        // approximately 7 in web workers in Firefox 8 through 18, and sometimes not
        // even then.
        function makeRequestCallFromTimer(callback) {
            return function requestCall() {
                // We dispatch a timeout with a specified delay of 0 for engines that
                // can reliably accommodate that request. This will usually be snapped
                // to a 4 milisecond delay, but once we're flushing, there's no delay
                // between events.
                var timeoutHandle = setTimeout(handleTimer, 0); // However, since this timer gets frequently dropped in Firefox
                // workers, we enlist an interval handle that will try to fire
                // an event 20 times per second until it succeeds.
                var intervalHandle = setInterval(handleTimer, 50);
                function handleTimer() {
                    // Whichever timer succeeds will cancel both timers and
                    // execute the callback.
                    clearTimeout(timeoutHandle);
                    clearInterval(intervalHandle);
                    callback();
                }
            };
        } // This is for `asap.js` only.
        // Its name will be periodically randomized to break any code that depends on
        // its existence.
        rawAsap.makeRequestCallFromTimer = makeRequestCallFromTimer; // ASAP was originally a nextTick shim included in Q. This was factored out
        // into this ASAP package. It was later adapted to RSVP which made further
        // amendments. These decisions, particularly to marginalize MessageChannel and
        // to capture the MutationObserver implementation in a closure, were integrated
        // back into ASAP proper.
        // https://github.com/tildeio/rsvp.js/blob/cddf7232546a9cf858524b75cde6f9edf72620a7/lib/rsvp/asap.js
        return exports;
    }
    exports_15("dew", dew);
    return {
        setters: [],
        execute: function () {
            exports = {}, _dewExec = false;
            _global = typeof self !== "undefined" ? self : global;
        }
    };
});
System.register("https://dev.jspm.io/npm:asap@2.0.6/raw.dew", ["https://dev.jspm.io/npm:asap@2.0.6/browser-raw.dew"], function (exports_16, context_16) {
    "use strict";
    var __moduleName = context_16 && context_16.id;
    return {
        setters: [
            function (browser_raw_dew_js_1_1) {
                exports_16({
                    "dew": browser_raw_dew_js_1_1["dew"]
                });
            }
        ],
        execute: function () {
        }
    };
});
System.register("https://dev.jspm.io/npm:asap@2.0.6/browser-asap.dew", ["https://dev.jspm.io/npm:asap@2.0.6/raw.dew"], function (exports_17, context_17) {
    "use strict";
    var raw_dew_js_1, exports, _dewExec;
    var __moduleName = context_17 && context_17.id;
    function dew() {
        if (_dewExec)
            return exports;
        _dewExec = true;
        // rawAsap provides everything we need except exception management.
        var rawAsap = raw_dew_js_1.dew(); // RawTasks are recycled to reduce GC churn.
        var freeTasks = []; // We queue errors to ensure they are thrown in right order (FIFO).
        // Array-as-queue is good enough here, since we are just dealing with exceptions.
        var pendingErrors = [];
        var requestErrorThrow = rawAsap.makeRequestCallFromTimer(throwFirstError);
        function throwFirstError() {
            if (pendingErrors.length) {
                throw pendingErrors.shift();
            }
        }
        /**
         * Calls a task as soon as possible after returning, in its own event, with priority
         * over other events like animation, reflow, and repaint. An error thrown from an
         * event will not interrupt, nor even substantially slow down the processing of
         * other events, but will be rather postponed to a lower priority event.
         * @param {{call}} task A callable object, typically a function that takes no
         * arguments.
         */
        exports = asap;
        function asap(task) {
            var rawTask;
            if (freeTasks.length) {
                rawTask = freeTasks.pop();
            }
            else {
                rawTask = new RawTask();
            }
            rawTask.task = task;
            rawAsap(rawTask);
        } // We wrap tasks with recyclable task objects.  A task object implements
        // `call`, just like a function.
        function RawTask() {
            this.task = null;
        } // The sole purpose of wrapping the task is to catch the exception and recycle
        // the task object after its single use.
        RawTask.prototype.call = function () {
            try {
                this.task.call();
            }
            catch (error) {
                if (asap.onerror) {
                    // This hook exists purely for testing purposes.
                    // Its name will be periodically randomized to break any code that
                    // depends on its existence.
                    asap.onerror(error);
                }
                else {
                    // In a web browser, exceptions are not fatal. However, to avoid
                    // slowing down the queue of pending tasks, we rethrow the error in a
                    // lower priority turn.
                    pendingErrors.push(error);
                    requestErrorThrow();
                }
            }
            finally {
                this.task = null;
                freeTasks[freeTasks.length] = this;
            }
        };
        return exports;
    }
    exports_17("dew", dew);
    return {
        setters: [
            function (raw_dew_js_1_1) {
                raw_dew_js_1 = raw_dew_js_1_1;
            }
        ],
        execute: function () {
            exports = {}, _dewExec = false;
        }
    };
});
System.register("https://dev.jspm.io/asap@2.0.6", ["https://dev.jspm.io/npm:asap@2.0.6/browser-asap.dew", "https://dev.jspm.io/npm:asap@2.0.6/raw.dew"], function (exports_18, context_18) {
    "use strict";
    var browser_asap_dew_js_1;
    var __moduleName = context_18 && context_18.id;
    return {
        setters: [
            function (browser_asap_dew_js_1_1) {
                browser_asap_dew_js_1 = browser_asap_dew_js_1_1;
            },
            function (_1) {
            }
        ],
        execute: function () {
            exports_18("default", browser_asap_dew_js_1.dew());
        }
    };
});
System.register("file:///home/main/Desktop/denjucks/v4/src/object", [], function (exports_19, context_19) {
    'use strict';
    var __moduleName = context_19 && context_19.id;
    // A simple class system, more documentation to come
    function extend(cls, name, props) {
        // This does that same thing as Object.create, but with support for IE8
        var F = function () { };
        F.prototype = cls.prototype;
        var prototype = new F();
        // jshint undef: false
        var fnTest = /xyz/.test(function () { xyz; }) ? /\bparent\b/ : /.*/;
        props = props || {};
        for (var k in props) {
            var src = props[k];
            var parent = prototype[k];
            if (typeof parent === 'function' &&
                typeof src === 'function' &&
                fnTest.test(src)) {
                /*jshint -W083 */
                prototype[k] = (function (src, parent) {
                    return function () {
                        // Save the current parent method
                        var tmp = this.parent;
                        // Set parent to the previous method, call, and restore
                        this.parent = parent;
                        var res = src.apply(this, arguments);
                        this.parent = tmp;
                        return res;
                    };
                })(src, parent);
            }
            else {
                prototype[k] = src;
            }
        }
        prototype.typename = name;
        var new_cls = function () {
            if (prototype.init) {
                prototype.init.apply(this, arguments);
            }
        };
        new_cls.prototype = prototype;
        new_cls.prototype.constructor = new_cls;
        new_cls.extend = function (name, props) {
            if (typeof name === 'object') {
                props = name;
                name = 'anonymous';
            }
            return extend(new_cls, name, props);
        };
        return new_cls;
    }
    return {
        setters: [],
        execute: function () {
            exports_19("default", extend(Object, 'Object', {}));
        }
    };
});
System.register("file:///home/main/Desktop/denjucks/v4/src/lexer", ["file:///home/main/Desktop/denjucks/v4/src/lib"], function (exports_20, context_20) {
    'use strict';
    var lib_js_1, whitespaceChars, delimChars, intChars, BLOCK_START, BLOCK_END, VARIABLE_START, VARIABLE_END, COMMENT_START, COMMENT_END, TOKEN_STRING, TOKEN_WHITESPACE, TOKEN_DATA, TOKEN_BLOCK_START, TOKEN_BLOCK_END, TOKEN_VARIABLE_START, TOKEN_VARIABLE_END, TOKEN_COMMENT, TOKEN_LEFT_PAREN, TOKEN_RIGHT_PAREN, TOKEN_LEFT_BRACKET, TOKEN_RIGHT_BRACKET, TOKEN_LEFT_CURLY, TOKEN_RIGHT_CURLY, TOKEN_OPERATOR, TOKEN_COMMA, TOKEN_COLON, TOKEN_TILDE, TOKEN_PIPE, TOKEN_INT, TOKEN_FLOAT, TOKEN_BOOLEAN, TOKEN_NONE, TOKEN_SYMBOL, TOKEN_SPECIAL, TOKEN_REGEX;
    var __moduleName = context_20 && context_20.id;
    function token(type, value, lineno, colno) {
        return {
            type: type,
            value: value,
            lineno: lineno,
            colno: colno
        };
    }
    function Tokenizer(str, opts) {
        this.str = str;
        this.index = 0;
        this.len = str.length;
        this.lineno = 0;
        this.colno = 0;
        this.in_code = false;
        opts = opts || {};
        var tags = opts.tags || {};
        this.tags = {
            BLOCK_START: tags.blockStart || BLOCK_START,
            BLOCK_END: tags.blockEnd || BLOCK_END,
            VARIABLE_START: tags.variableStart || VARIABLE_START,
            VARIABLE_END: tags.variableEnd || VARIABLE_END,
            COMMENT_START: tags.commentStart || COMMENT_START,
            COMMENT_END: tags.commentEnd || COMMENT_END
        };
        this.trimBlocks = !!opts.trimBlocks;
        this.lstripBlocks = !!opts.lstripBlocks;
    }
    return {
        setters: [
            function (lib_js_1_1) {
                lib_js_1 = lib_js_1_1;
            }
        ],
        execute: function () {
            whitespaceChars = ' \n\t\r\u00A0';
            delimChars = '()[]{}%*-+~/#,:|.<>=!';
            intChars = '0123456789';
            BLOCK_START = '{%';
            BLOCK_END = '%}';
            VARIABLE_START = '{{';
            VARIABLE_END = '}}';
            COMMENT_START = '{#';
            COMMENT_END = '#}';
            TOKEN_STRING = 'string';
            TOKEN_WHITESPACE = 'whitespace';
            TOKEN_DATA = 'data';
            TOKEN_BLOCK_START = 'block-start';
            TOKEN_BLOCK_END = 'block-end';
            TOKEN_VARIABLE_START = 'variable-start';
            TOKEN_VARIABLE_END = 'variable-end';
            TOKEN_COMMENT = 'comment';
            TOKEN_LEFT_PAREN = 'left-paren';
            TOKEN_RIGHT_PAREN = 'right-paren';
            TOKEN_LEFT_BRACKET = 'left-bracket';
            TOKEN_RIGHT_BRACKET = 'right-bracket';
            TOKEN_LEFT_CURLY = 'left-curly';
            TOKEN_RIGHT_CURLY = 'right-curly';
            TOKEN_OPERATOR = 'operator';
            TOKEN_COMMA = 'comma';
            TOKEN_COLON = 'colon';
            TOKEN_TILDE = 'tilde';
            TOKEN_PIPE = 'pipe';
            TOKEN_INT = 'int';
            TOKEN_FLOAT = 'float';
            TOKEN_BOOLEAN = 'boolean';
            TOKEN_NONE = 'none';
            TOKEN_SYMBOL = 'symbol';
            TOKEN_SPECIAL = 'special';
            TOKEN_REGEX = 'regex';
            Tokenizer.prototype.nextToken = function () {
                var lineno = this.lineno;
                var colno = this.colno;
                var tok;
                if (this.in_code) {
                    // Otherwise, if we are in a block parse it as code
                    var cur = this.current();
                    if (this.is_finished()) {
                        // We have nothing else to parse
                        return null;
                    }
                    else if (cur === '"' || cur === '\'') {
                        // We've hit a string
                        return token(TOKEN_STRING, this.parseString(cur), lineno, colno);
                    }
                    else if ((tok = this._extract(whitespaceChars))) {
                        // We hit some whitespace
                        return token(TOKEN_WHITESPACE, tok, lineno, colno);
                    }
                    else if ((tok = this._extractString(this.tags.BLOCK_END)) ||
                        (tok = this._extractString('-' + this.tags.BLOCK_END))) {
                        // Special check for the block end tag
                        //
                        // It is a requirement that start and end tags are composed of
                        // delimiter characters (%{}[] etc), and our code always
                        // breaks on delimiters so we can assume the token parsing
                        // doesn't consume these elsewhere
                        this.in_code = false;
                        if (this.trimBlocks) {
                            cur = this.current();
                            if (cur === '\n') {
                                // Skip newline
                                this.forward();
                            }
                            else if (cur === '\r') {
                                // Skip CRLF newline
                                this.forward();
                                cur = this.current();
                                if (cur === '\n') {
                                    this.forward();
                                }
                                else {
                                    // Was not a CRLF, so go back
                                    this.back();
                                }
                            }
                        }
                        return token(TOKEN_BLOCK_END, tok, lineno, colno);
                    }
                    else if ((tok = this._extractString(this.tags.VARIABLE_END)) ||
                        (tok = this._extractString('-' + this.tags.VARIABLE_END))) {
                        // Special check for variable end tag (see above)
                        this.in_code = false;
                        return token(TOKEN_VARIABLE_END, tok, lineno, colno);
                    }
                    else if (cur === 'r' && this.str.charAt(this.index + 1) === '/') {
                        // Skip past 'r/'.
                        this.forwardN(2);
                        // Extract until the end of the regex -- / ends it, \/ does not.
                        var regexBody = '';
                        while (!this.is_finished()) {
                            if (this.current() === '/' && this.previous() !== '\\') {
                                this.forward();
                                break;
                            }
                            else {
                                regexBody += this.current();
                                this.forward();
                            }
                        }
                        // Check for flags.
                        // The possible flags are according to https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/RegExp)
                        var POSSIBLE_FLAGS = ['g', 'i', 'm', 'y'];
                        var regexFlags = '';
                        while (!this.is_finished()) {
                            var isCurrentAFlag = POSSIBLE_FLAGS.indexOf(this.current()) !== -1;
                            if (isCurrentAFlag) {
                                regexFlags += this.current();
                                this.forward();
                            }
                            else {
                                break;
                            }
                        }
                        return token(TOKEN_REGEX, { body: regexBody, flags: regexFlags }, lineno, colno);
                    }
                    else if (delimChars.indexOf(cur) !== -1) {
                        // We've hit a delimiter (a special char like a bracket)
                        this.forward();
                        var complexOps = ['==', '===', '!=', '!==', '<=', '>=', '//', '**'];
                        var curComplex = cur + this.current();
                        var type;
                        if (lib_js_1.default.indexOf(complexOps, curComplex) !== -1) {
                            this.forward();
                            cur = curComplex;
                            // See if this is a strict equality/inequality comparator
                            if (lib_js_1.default.indexOf(complexOps, curComplex + this.current()) !== -1) {
                                cur = curComplex + this.current();
                                this.forward();
                            }
                        }
                        switch (cur) {
                            case '(':
                                type = TOKEN_LEFT_PAREN;
                                break;
                            case ')':
                                type = TOKEN_RIGHT_PAREN;
                                break;
                            case '[':
                                type = TOKEN_LEFT_BRACKET;
                                break;
                            case ']':
                                type = TOKEN_RIGHT_BRACKET;
                                break;
                            case '{':
                                type = TOKEN_LEFT_CURLY;
                                break;
                            case '}':
                                type = TOKEN_RIGHT_CURLY;
                                break;
                            case ',':
                                type = TOKEN_COMMA;
                                break;
                            case ':':
                                type = TOKEN_COLON;
                                break;
                            case '~':
                                type = TOKEN_TILDE;
                                break;
                            case '|':
                                type = TOKEN_PIPE;
                                break;
                            default: type = TOKEN_OPERATOR;
                        }
                        return token(type, cur, lineno, colno);
                    }
                    else {
                        // We are not at whitespace or a delimiter, so extract the
                        // text and parse it
                        tok = this._extractUntil(whitespaceChars + delimChars);
                        if (tok.match(/^[-+]?[0-9]+$/)) {
                            if (this.current() === '.') {
                                this.forward();
                                var dec = this._extract(intChars);
                                return token(TOKEN_FLOAT, tok + '.' + dec, lineno, colno);
                            }
                            else {
                                return token(TOKEN_INT, tok, lineno, colno);
                            }
                        }
                        else if (tok.match(/^(true|false)$/)) {
                            return token(TOKEN_BOOLEAN, tok, lineno, colno);
                        }
                        else if (tok === 'none') {
                            return token(TOKEN_NONE, tok, lineno, colno);
                        }
                        else if (tok) {
                            return token(TOKEN_SYMBOL, tok, lineno, colno);
                        }
                        else {
                            throw new Error('Unexpected value while parsing: ' + tok);
                        }
                    }
                }
                else {
                    // Parse out the template text, breaking on tag
                    // delimiters because we need to look for block/variable start
                    // tags (don't use the full delimChars for optimization)
                    var beginChars = (this.tags.BLOCK_START.charAt(0) +
                        this.tags.VARIABLE_START.charAt(0) +
                        this.tags.COMMENT_START.charAt(0) +
                        this.tags.COMMENT_END.charAt(0));
                    if (this.is_finished()) {
                        return null;
                    }
                    else if ((tok = this._extractString(this.tags.BLOCK_START + '-')) ||
                        (tok = this._extractString(this.tags.BLOCK_START))) {
                        this.in_code = true;
                        return token(TOKEN_BLOCK_START, tok, lineno, colno);
                    }
                    else if ((tok = this._extractString(this.tags.VARIABLE_START + '-')) ||
                        (tok = this._extractString(this.tags.VARIABLE_START))) {
                        this.in_code = true;
                        return token(TOKEN_VARIABLE_START, tok, lineno, colno);
                    }
                    else {
                        tok = '';
                        var data;
                        var in_comment = false;
                        if (this._matches(this.tags.COMMENT_START)) {
                            in_comment = true;
                            tok = this._extractString(this.tags.COMMENT_START);
                        }
                        // Continually consume text, breaking on the tag delimiter
                        // characters and checking to see if it's a start tag.
                        //
                        // We could hit the end of the template in the middle of
                        // our looping, so check for the null return value from
                        // _extractUntil
                        while ((data = this._extractUntil(beginChars)) !== null) {
                            tok += data;
                            if ((this._matches(this.tags.BLOCK_START) ||
                                this._matches(this.tags.VARIABLE_START) ||
                                this._matches(this.tags.COMMENT_START)) &&
                                !in_comment) {
                                if (this.lstripBlocks &&
                                    this._matches(this.tags.BLOCK_START) &&
                                    this.colno > 0 &&
                                    this.colno <= tok.length) {
                                    var lastLine = tok.slice(-this.colno);
                                    if (/^\s+$/.test(lastLine)) {
                                        // Remove block leading whitespace from beginning of the string
                                        tok = tok.slice(0, -this.colno);
                                        if (!tok.length) {
                                            // All data removed, collapse to avoid unnecessary nodes
                                            // by returning next token (block start)
                                            return this.nextToken();
                                        }
                                    }
                                }
                                // If it is a start tag, stop looping
                                break;
                            }
                            else if (this._matches(this.tags.COMMENT_END)) {
                                if (!in_comment) {
                                    throw new Error('unexpected end of comment');
                                }
                                tok += this._extractString(this.tags.COMMENT_END);
                                break;
                            }
                            else {
                                // It does not match any tag, so add the character and
                                // carry on
                                tok += this.current();
                                this.forward();
                            }
                        }
                        if (data === null && in_comment) {
                            throw new Error('expected end of comment, got end of file');
                        }
                        return token(in_comment ? TOKEN_COMMENT : TOKEN_DATA, tok, lineno, colno);
                    }
                }
                throw new Error('Could not parse text');
            };
            Tokenizer.prototype.parseString = function (delimiter) {
                this.forward();
                var str = '';
                while (!this.is_finished() && this.current() !== delimiter) {
                    var cur = this.current();
                    if (cur === '\\') {
                        this.forward();
                        switch (this.current()) {
                            case 'n':
                                str += '\n';
                                break;
                            case 't':
                                str += '\t';
                                break;
                            case 'r':
                                str += '\r';
                                break;
                            default:
                                str += this.current();
                        }
                        this.forward();
                    }
                    else {
                        str += cur;
                        this.forward();
                    }
                }
                this.forward();
                return str;
            };
            Tokenizer.prototype._matches = function (str) {
                if (this.index + str.length > this.len) {
                    return null;
                }
                var m = this.str.slice(this.index, this.index + str.length);
                return m === str;
            };
            Tokenizer.prototype._extractString = function (str) {
                if (this._matches(str)) {
                    this.index += str.length;
                    return str;
                }
                return null;
            };
            Tokenizer.prototype._extractUntil = function (charString) {
                // Extract all non-matching chars, with the default matching set
                // to everything
                return this._extractMatching(true, charString || '');
            };
            Tokenizer.prototype._extract = function (charString) {
                // Extract all matching chars (no default, so charString must be
                // explicit)
                return this._extractMatching(false, charString);
            };
            Tokenizer.prototype._extractMatching = function (breakOnMatch, charString) {
                // Pull out characters until a breaking char is hit.
                // If breakOnMatch is false, a non-matching char stops it.
                // If breakOnMatch is true, a matching char stops it.
                if (this.is_finished()) {
                    return null;
                }
                var first = charString.indexOf(this.current());
                // Only proceed if the first character doesn't meet our condition
                if ((breakOnMatch && first === -1) ||
                    (!breakOnMatch && first !== -1)) {
                    var t = this.current();
                    this.forward();
                    // And pull out all the chars one at a time until we hit a
                    // breaking char
                    var idx = charString.indexOf(this.current());
                    while (((breakOnMatch && idx === -1) ||
                        (!breakOnMatch && idx !== -1)) && !this.is_finished()) {
                        t += this.current();
                        this.forward();
                        idx = charString.indexOf(this.current());
                    }
                    return t;
                }
                return '';
            };
            Tokenizer.prototype._extractRegex = function (regex) {
                var matches = this.currentStr().match(regex);
                if (!matches) {
                    return null;
                }
                // Move forward whatever was matched
                this.forwardN(matches[0].length);
                return matches;
            };
            Tokenizer.prototype.is_finished = function () {
                return this.index >= this.len;
            };
            Tokenizer.prototype.forwardN = function (n) {
                for (var i = 0; i < n; i++) {
                    this.forward();
                }
            };
            Tokenizer.prototype.forward = function () {
                this.index++;
                if (this.previous() === '\n') {
                    this.lineno++;
                    this.colno = 0;
                }
                else {
                    this.colno++;
                }
            };
            Tokenizer.prototype.backN = function (n) {
                for (var i = 0; i < n; i++) {
                    this.back();
                }
            };
            Tokenizer.prototype.back = function () {
                this.index--;
                if (this.current() === '\n') {
                    this.lineno--;
                    var idx = this.src.lastIndexOf('\n', this.index - 1);
                    if (idx === -1) {
                        this.colno = this.index;
                    }
                    else {
                        this.colno = this.index - idx;
                    }
                }
                else {
                    this.colno--;
                }
            };
            // current returns current character
            Tokenizer.prototype.current = function () {
                if (!this.is_finished()) {
                    return this.str.charAt(this.index);
                }
                return '';
            };
            // currentStr returns what's left of the unparsed string
            Tokenizer.prototype.currentStr = function () {
                if (!this.is_finished()) {
                    return this.str.substr(this.index);
                }
                return '';
            };
            Tokenizer.prototype.previous = function () {
                return this.str.charAt(this.index - 1);
            };
            exports_20("default", {
                lex: function (src, opts) {
                    return new Tokenizer(src, opts);
                },
                TOKEN_STRING: TOKEN_STRING,
                TOKEN_WHITESPACE: TOKEN_WHITESPACE,
                TOKEN_DATA: TOKEN_DATA,
                TOKEN_BLOCK_START: TOKEN_BLOCK_START,
                TOKEN_BLOCK_END: TOKEN_BLOCK_END,
                TOKEN_VARIABLE_START: TOKEN_VARIABLE_START,
                TOKEN_VARIABLE_END: TOKEN_VARIABLE_END,
                TOKEN_COMMENT: TOKEN_COMMENT,
                TOKEN_LEFT_PAREN: TOKEN_LEFT_PAREN,
                TOKEN_RIGHT_PAREN: TOKEN_RIGHT_PAREN,
                TOKEN_LEFT_BRACKET: TOKEN_LEFT_BRACKET,
                TOKEN_RIGHT_BRACKET: TOKEN_RIGHT_BRACKET,
                TOKEN_LEFT_CURLY: TOKEN_LEFT_CURLY,
                TOKEN_RIGHT_CURLY: TOKEN_RIGHT_CURLY,
                TOKEN_OPERATOR: TOKEN_OPERATOR,
                TOKEN_COMMA: TOKEN_COMMA,
                TOKEN_COLON: TOKEN_COLON,
                TOKEN_TILDE: TOKEN_TILDE,
                TOKEN_PIPE: TOKEN_PIPE,
                TOKEN_INT: TOKEN_INT,
                TOKEN_FLOAT: TOKEN_FLOAT,
                TOKEN_BOOLEAN: TOKEN_BOOLEAN,
                TOKEN_NONE: TOKEN_NONE,
                TOKEN_SYMBOL: TOKEN_SYMBOL,
                TOKEN_SPECIAL: TOKEN_SPECIAL,
                TOKEN_REGEX: TOKEN_REGEX
            });
        }
    };
});
System.register("file:///home/main/Desktop/denjucks/v4/src/nodes", ["file:///home/main/Desktop/denjucks/v4/src/lib", "file:///home/main/Desktop/denjucks/v4/src/object"], function (exports_21, context_21) {
    'use strict';
    var lib_js_2, object_js_1, Node, Value, NodeList, Root, Literal, Symbol, Group, Array, Pair, Dict, LookupVal, If, IfAsync, InlineIf, For, AsyncEach, AsyncAll, Macro, Caller, Import, FromImport, FunCall, Filter, FilterAsync, KeywordArgs, Block, Super, TemplateRef, Extends, Include, Set, Output, Capture, TemplateData, UnaryOp, BinOp, In, Or, And, Not, Add, Concat, Sub, Mul, Div, FloorDiv, Mod, Pow, Neg, Pos, Compare, CompareOperand, CallExtension, CallExtensionAsync;
    var __moduleName = context_21 && context_21.id;
    function traverseAndCheck(obj, type, results) {
        if (obj instanceof type) {
            results.push(obj);
        }
        if (obj instanceof Node) {
            obj.findAll(type, results);
        }
    }
    // Print the AST in a nicely formatted tree format for debuggin
    function printNodes(node, indent) {
        indent = indent || 0;
        // This is hacky, but this is just a debugging function anyway
        function print(str, indent, inline) {
            var lines = str.split('\n');
            for (var i = 0; i < lines.length; i++) {
                if (lines[i]) {
                    if ((inline && i > 0) || !inline) {
                        for (var j = 0; j < indent; j++) {
                            process.stdout.write(' ');
                        }
                    }
                }
                if (i === lines.length - 1) {
                    process.stdout.write(lines[i]);
                }
                else {
                    process.stdout.write(lines[i] + '\n');
                }
            }
        }
        print(node.typename + ': ', indent);
        if (node instanceof NodeList) {
            print('\n');
            lib_js_2.default.each(node.children, function (n) {
                printNodes(n, indent + 2);
            });
        }
        else if (node instanceof CallExtension) {
            print(node.extName + '.' + node.prop);
            print('\n');
            if (node.args) {
                printNodes(node.args, indent + 2);
            }
            if (node.contentArgs) {
                lib_js_2.default.each(node.contentArgs, function (n) {
                    printNodes(n, indent + 2);
                });
            }
        }
        else {
            var nodes = null;
            var props = null;
            node.iterFields(function (val, field) {
                if (val instanceof Node) {
                    nodes = nodes || {};
                    nodes[field] = val;
                }
                else {
                    props = props || {};
                    props[field] = val;
                }
            });
            if (props) {
                print(JSON.stringify(props, null, 2) + '\n', null, true);
            }
            else {
                print('\n');
            }
            if (nodes) {
                for (var k in nodes) {
                    printNodes(nodes[k], indent + 2);
                }
            }
        }
    }
    return {
        setters: [
            function (lib_js_2_1) {
                lib_js_2 = lib_js_2_1;
            },
            function (object_js_1_1) {
                object_js_1 = object_js_1_1;
            }
        ],
        execute: function () {
            Node = object_js_1.default.extend('Node', {
                init: function (lineno, colno) {
                    this.lineno = lineno;
                    this.colno = colno;
                    var fields = this.fields;
                    for (var i = 0, l = fields.length; i < l; i++) {
                        var field = fields[i];
                        // The first two args are line/col numbers, so offset by 2
                        var val = arguments[i + 2];
                        // Fields should never be undefined, but null. It makes
                        // testing easier to normalize values.
                        if (val === undefined) {
                            val = null;
                        }
                        this[field] = val;
                    }
                },
                findAll: function (type, results) {
                    results = results || [];
                    var i, l;
                    if (this instanceof NodeList) {
                        var children = this.children;
                        for (i = 0, l = children.length; i < l; i++) {
                            traverseAndCheck(children[i], type, results);
                        }
                    }
                    else {
                        var fields = this.fields;
                        for (i = 0, l = fields.length; i < l; i++) {
                            traverseAndCheck(this[fields[i]], type, results);
                        }
                    }
                    return results;
                },
                iterFields: function (func) {
                    lib_js_2.default.each(this.fields, function (field) {
                        func(this[field], field);
                    }, this);
                }
            });
            // Abstract nodes
            Value = Node.extend('Value', { fields: ['value'] });
            // Concrete nodes
            NodeList = Node.extend('NodeList', {
                fields: ['children'],
                init: function (lineno, colno, nodes) {
                    this.parent(lineno, colno, nodes || []);
                },
                addChild: function (node) {
                    this.children.push(node);
                }
            });
            Root = NodeList.extend('Root');
            Literal = Value.extend('Literal');
            Symbol = Value.extend('Symbol');
            Group = NodeList.extend('Group');
            Array = NodeList.extend('Array');
            Pair = Node.extend('Pair', { fields: ['key', 'value'] });
            Dict = NodeList.extend('Dict');
            LookupVal = Node.extend('LookupVal', { fields: ['target', 'val'] });
            If = Node.extend('If', { fields: ['cond', 'body', 'else_'] });
            IfAsync = If.extend('IfAsync');
            InlineIf = Node.extend('InlineIf', { fields: ['cond', 'body', 'else_'] });
            For = Node.extend('For', { fields: ['arr', 'name', 'body', 'else_'] });
            AsyncEach = For.extend('AsyncEach');
            AsyncAll = For.extend('AsyncAll');
            Macro = Node.extend('Macro', { fields: ['name', 'args', 'body'] });
            Caller = Macro.extend('Caller');
            Import = Node.extend('Import', { fields: ['template', 'target', 'withContext'] });
            FromImport = Node.extend('FromImport', {
                fields: ['template', 'names', 'withContext'],
                init: function (lineno, colno, template, names, withContext) {
                    this.parent(lineno, colno, template, names || new NodeList(), withContext);
                }
            });
            FunCall = Node.extend('FunCall', { fields: ['name', 'args'] });
            Filter = FunCall.extend('Filter');
            FilterAsync = Filter.extend('FilterAsync', {
                fields: ['name', 'args', 'symbol']
            });
            KeywordArgs = Dict.extend('KeywordArgs');
            Block = Node.extend('Block', { fields: ['name', 'body'] });
            Super = Node.extend('Super', { fields: ['blockName', 'symbol'] });
            TemplateRef = Node.extend('TemplateRef', { fields: ['template'] });
            Extends = TemplateRef.extend('Extends');
            Include = Node.extend('Include', { fields: ['template', 'ignoreMissing'] });
            Set = Node.extend('Set', { fields: ['targets', 'value'] });
            Output = NodeList.extend('Output');
            Capture = Node.extend('Capture', { fields: ['body'] });
            TemplateData = Literal.extend('TemplateData');
            UnaryOp = Node.extend('UnaryOp', { fields: ['target'] });
            BinOp = Node.extend('BinOp', { fields: ['left', 'right'] });
            In = BinOp.extend('In');
            Or = BinOp.extend('Or');
            And = BinOp.extend('And');
            Not = UnaryOp.extend('Not');
            Add = BinOp.extend('Add');
            Concat = BinOp.extend('Concat');
            Sub = BinOp.extend('Sub');
            Mul = BinOp.extend('Mul');
            Div = BinOp.extend('Div');
            FloorDiv = BinOp.extend('FloorDiv');
            Mod = BinOp.extend('Mod');
            Pow = BinOp.extend('Pow');
            Neg = UnaryOp.extend('Neg');
            Pos = UnaryOp.extend('Pos');
            Compare = Node.extend('Compare', { fields: ['expr', 'ops'] });
            CompareOperand = Node.extend('CompareOperand', {
                fields: ['expr', 'type']
            });
            CallExtension = Node.extend('CallExtension', {
                fields: ['extName', 'prop', 'args', 'contentArgs'],
                init: function (ext, prop, args, contentArgs) {
                    this.extName = ext._name || ext;
                    this.prop = prop;
                    this.args = args || new NodeList();
                    this.contentArgs = contentArgs || [];
                    this.autoescape = ext.autoescape;
                }
            });
            CallExtensionAsync = CallExtension.extend('CallExtensionAsync');
            exports_21("default", {
                Node: Node,
                Root: Root,
                NodeList: NodeList,
                Value: Value,
                Literal: Literal,
                Symbol: Symbol,
                Group: Group,
                Array: Array,
                Pair: Pair,
                Dict: Dict,
                Output: Output,
                Capture: Capture,
                TemplateData: TemplateData,
                If: If,
                IfAsync: IfAsync,
                InlineIf: InlineIf,
                For: For,
                AsyncEach: AsyncEach,
                AsyncAll: AsyncAll,
                Macro: Macro,
                Caller: Caller,
                Import: Import,
                FromImport: FromImport,
                FunCall: FunCall,
                Filter: Filter,
                FilterAsync: FilterAsync,
                KeywordArgs: KeywordArgs,
                Block: Block,
                Super: Super,
                Extends: Extends,
                Include: Include,
                Set: Set,
                LookupVal: LookupVal,
                BinOp: BinOp,
                In: In,
                Or: Or,
                And: And,
                Not: Not,
                Add: Add,
                Concat: Concat,
                Sub: Sub,
                Mul: Mul,
                Div: Div,
                FloorDiv: FloorDiv,
                Mod: Mod,
                Pow: Pow,
                Neg: Neg,
                Pos: Pos,
                Compare: Compare,
                CompareOperand: CompareOperand,
                CallExtension: CallExtension,
                CallExtensionAsync: CallExtensionAsync,
                printNodes: printNodes
            });
        }
    };
});
System.register("file:///home/main/Desktop/denjucks/v4/src/parser", ["file:///home/main/Desktop/denjucks/v4/src/lexer", "file:///home/main/Desktop/denjucks/v4/src/nodes", "file:///home/main/Desktop/denjucks/v4/src/object", "file:///home/main/Desktop/denjucks/v4/src/lib"], function (exports_22, context_22) {
    'use strict';
    var lexer_js_1, nodes_js_1, object_js_2, lib_js_3, Parser;
    var __moduleName = context_22 && context_22.id;
    return {
        setters: [
            function (lexer_js_1_1) {
                lexer_js_1 = lexer_js_1_1;
            },
            function (nodes_js_1_1) {
                nodes_js_1 = nodes_js_1_1;
            },
            function (object_js_2_1) {
                object_js_2 = object_js_2_1;
            },
            function (lib_js_3_1) {
                lib_js_3 = lib_js_3_1;
            }
        ],
        execute: function () {
            Parser = object_js_2.default.extend({
                init: function (tokens) {
                    this.tokens = tokens;
                    this.peeked = null;
                    this.breakOnBlocks = null;
                    this.dropLeadingWhitespace = false;
                    this.extensions = [];
                },
                nextToken: function (withWhitespace) {
                    var tok;
                    if (this.peeked) {
                        if (!withWhitespace && this.peeked.type === lexer_js_1.default.TOKEN_WHITESPACE) {
                            this.peeked = null;
                        }
                        else {
                            tok = this.peeked;
                            this.peeked = null;
                            return tok;
                        }
                    }
                    tok = this.tokens.nextToken();
                    if (!withWhitespace) {
                        while (tok && tok.type === lexer_js_1.default.TOKEN_WHITESPACE) {
                            tok = this.tokens.nextToken();
                        }
                    }
                    return tok;
                },
                peekToken: function () {
                    this.peeked = this.peeked || this.nextToken();
                    return this.peeked;
                },
                pushToken: function (tok) {
                    if (this.peeked) {
                        throw new Error('pushToken: can only push one token on between reads');
                    }
                    this.peeked = tok;
                },
                fail: function (msg, lineno, colno) {
                    if ((lineno === undefined || colno === undefined) && this.peekToken()) {
                        var tok = this.peekToken();
                        lineno = tok.lineno;
                        colno = tok.colno;
                    }
                    if (lineno !== undefined)
                        lineno += 1;
                    if (colno !== undefined)
                        colno += 1;
                    throw new lib_js_3.default.TemplateError(msg, lineno, colno);
                },
                skip: function (type) {
                    var tok = this.nextToken();
                    if (!tok || tok.type !== type) {
                        this.pushToken(tok);
                        return false;
                    }
                    return true;
                },
                expect: function (type) {
                    var tok = this.nextToken();
                    if (tok.type !== type) {
                        this.fail('expected ' + type + ', got ' + tok.type, tok.lineno, tok.colno);
                    }
                    return tok;
                },
                skipValue: function (type, val) {
                    var tok = this.nextToken();
                    if (!tok || tok.type !== type || tok.value !== val) {
                        this.pushToken(tok);
                        return false;
                    }
                    return true;
                },
                skipSymbol: function (val) {
                    return this.skipValue(lexer_js_1.default.TOKEN_SYMBOL, val);
                },
                advanceAfterBlockEnd: function (name) {
                    var tok;
                    if (!name) {
                        tok = this.peekToken();
                        if (!tok) {
                            this.fail('unexpected end of file');
                        }
                        if (tok.type !== lexer_js_1.default.TOKEN_SYMBOL) {
                            this.fail('advanceAfterBlockEnd: expected symbol token or ' +
                                'explicit name to be passed');
                        }
                        name = this.nextToken().value;
                    }
                    tok = this.nextToken();
                    if (tok && tok.type === lexer_js_1.default.TOKEN_BLOCK_END) {
                        if (tok.value.charAt(0) === '-') {
                            this.dropLeadingWhitespace = true;
                        }
                    }
                    else {
                        this.fail('expected block end in ' + name + ' statement');
                    }
                    return tok;
                },
                advanceAfterVariableEnd: function () {
                    var tok = this.nextToken();
                    if (tok && tok.type === lexer_js_1.default.TOKEN_VARIABLE_END) {
                        this.dropLeadingWhitespace = tok.value.charAt(tok.value.length - this.tokens.tags.VARIABLE_END.length - 1) === '-';
                    }
                    else {
                        this.pushToken(tok);
                        this.fail('expected variable end');
                    }
                },
                parseFor: function () {
                    var forTok = this.peekToken();
                    var node;
                    var endBlock;
                    if (this.skipSymbol('for')) {
                        node = new nodes_js_1.default.For(forTok.lineno, forTok.colno);
                        endBlock = 'endfor';
                    }
                    else if (this.skipSymbol('asyncEach')) {
                        node = new nodes_js_1.default.AsyncEach(forTok.lineno, forTok.colno);
                        endBlock = 'endeach';
                    }
                    else if (this.skipSymbol('asyncAll')) {
                        node = new nodes_js_1.default.AsyncAll(forTok.lineno, forTok.colno);
                        endBlock = 'endall';
                    }
                    else {
                        this.fail('parseFor: expected for{Async}', forTok.lineno, forTok.colno);
                    }
                    node.name = this.parsePrimary();
                    if (!(node.name instanceof nodes_js_1.default.Symbol)) {
                        this.fail('parseFor: variable name expected for loop');
                    }
                    var type = this.peekToken().type;
                    if (type === lexer_js_1.default.TOKEN_COMMA) {
                        // key/value iteration
                        var key = node.name;
                        node.name = new nodes_js_1.default.Array(key.lineno, key.colno);
                        node.name.addChild(key);
                        while (this.skip(lexer_js_1.default.TOKEN_COMMA)) {
                            var prim = this.parsePrimary();
                            node.name.addChild(prim);
                        }
                    }
                    if (!this.skipSymbol('in')) {
                        this.fail('parseFor: expected "in" keyword for loop', forTok.lineno, forTok.colno);
                    }
                    node.arr = this.parseExpression();
                    this.advanceAfterBlockEnd(forTok.value);
                    node.body = this.parseUntilBlocks(endBlock, 'else');
                    if (this.skipSymbol('else')) {
                        this.advanceAfterBlockEnd('else');
                        node.else_ = this.parseUntilBlocks(endBlock);
                    }
                    this.advanceAfterBlockEnd();
                    return node;
                },
                parseMacro: function () {
                    var macroTok = this.peekToken();
                    if (!this.skipSymbol('macro')) {
                        this.fail('expected macro');
                    }
                    var name = this.parsePrimary(true);
                    var args = this.parseSignature();
                    var node = new nodes_js_1.default.Macro(macroTok.lineno, macroTok.colno, name, args);
                    this.advanceAfterBlockEnd(macroTok.value);
                    node.body = this.parseUntilBlocks('endmacro');
                    this.advanceAfterBlockEnd();
                    return node;
                },
                parseCall: function () {
                    // a call block is parsed as a normal FunCall, but with an added
                    // 'caller' kwarg which is a Caller node.
                    var callTok = this.peekToken();
                    if (!this.skipSymbol('call')) {
                        this.fail('expected call');
                    }
                    var callerArgs = this.parseSignature(true) || new nodes_js_1.default.NodeList();
                    var macroCall = this.parsePrimary();
                    this.advanceAfterBlockEnd(callTok.value);
                    var body = this.parseUntilBlocks('endcall');
                    this.advanceAfterBlockEnd();
                    var callerName = new nodes_js_1.default.Symbol(callTok.lineno, callTok.colno, 'caller');
                    var callerNode = new nodes_js_1.default.Caller(callTok.lineno, callTok.colno, callerName, callerArgs, body);
                    // add the additional caller kwarg, adding kwargs if necessary
                    var args = macroCall.args.children;
                    if (!(args[args.length - 1] instanceof nodes_js_1.default.KeywordArgs)) {
                        args.push(new nodes_js_1.default.KeywordArgs());
                    }
                    var kwargs = args[args.length - 1];
                    kwargs.addChild(new nodes_js_1.default.Pair(callTok.lineno, callTok.colno, callerName, callerNode));
                    return new nodes_js_1.default.Output(callTok.lineno, callTok.colno, [macroCall]);
                },
                parseWithContext: function () {
                    var tok = this.peekToken();
                    var withContext = null;
                    if (this.skipSymbol('with')) {
                        withContext = true;
                    }
                    else if (this.skipSymbol('without')) {
                        withContext = false;
                    }
                    if (withContext !== null) {
                        if (!this.skipSymbol('context')) {
                            this.fail('parseFrom: expected context after with/without', tok.lineno, tok.colno);
                        }
                    }
                    return withContext;
                },
                parseImport: function () {
                    var importTok = this.peekToken();
                    if (!this.skipSymbol('import')) {
                        this.fail('parseImport: expected import', importTok.lineno, importTok.colno);
                    }
                    var template = this.parseExpression();
                    if (!this.skipSymbol('as')) {
                        this.fail('parseImport: expected "as" keyword', importTok.lineno, importTok.colno);
                    }
                    var target = this.parseExpression();
                    var withContext = this.parseWithContext();
                    var node = new nodes_js_1.default.Import(importTok.lineno, importTok.colno, template, target, withContext);
                    this.advanceAfterBlockEnd(importTok.value);
                    return node;
                },
                parseFrom: function () {
                    var fromTok = this.peekToken();
                    if (!this.skipSymbol('from')) {
                        this.fail('parseFrom: expected from');
                    }
                    var template = this.parseExpression();
                    if (!this.skipSymbol('import')) {
                        this.fail('parseFrom: expected import', fromTok.lineno, fromTok.colno);
                    }
                    var names = new nodes_js_1.default.NodeList(), withContext;
                    while (1) {
                        var nextTok = this.peekToken();
                        if (nextTok.type === lexer_js_1.default.TOKEN_BLOCK_END) {
                            if (!names.children.length) {
                                this.fail('parseFrom: Expected at least one import name', fromTok.lineno, fromTok.colno);
                            }
                            // Since we are manually advancing past the block end,
                            // need to keep track of whitespace control (normally
                            // this is done in `advanceAfterBlockEnd`
                            if (nextTok.value.charAt(0) === '-') {
                                this.dropLeadingWhitespace = true;
                            }
                            this.nextToken();
                            break;
                        }
                        if (names.children.length > 0 && !this.skip(lexer_js_1.default.TOKEN_COMMA)) {
                            this.fail('parseFrom: expected comma', fromTok.lineno, fromTok.colno);
                        }
                        var name = this.parsePrimary();
                        if (name.value.charAt(0) === '_') {
                            this.fail('parseFrom: names starting with an underscore ' +
                                'cannot be imported', name.lineno, name.colno);
                        }
                        if (this.skipSymbol('as')) {
                            var alias = this.parsePrimary();
                            names.addChild(new nodes_js_1.default.Pair(name.lineno, name.colno, name, alias));
                        }
                        else {
                            names.addChild(name);
                        }
                        withContext = this.parseWithContext();
                    }
                    return new nodes_js_1.default.FromImport(fromTok.lineno, fromTok.colno, template, names, withContext);
                },
                parseBlock: function () {
                    var tag = this.peekToken();
                    if (!this.skipSymbol('block')) {
                        this.fail('parseBlock: expected block', tag.lineno, tag.colno);
                    }
                    var node = new nodes_js_1.default.Block(tag.lineno, tag.colno);
                    node.name = this.parsePrimary();
                    if (!(node.name instanceof nodes_js_1.default.Symbol)) {
                        this.fail('parseBlock: variable name expected', tag.lineno, tag.colno);
                    }
                    this.advanceAfterBlockEnd(tag.value);
                    node.body = this.parseUntilBlocks('endblock');
                    this.skipSymbol('endblock');
                    this.skipSymbol(node.name.value);
                    var tok = this.peekToken();
                    if (!tok) {
                        this.fail('parseBlock: expected endblock, got end of file');
                    }
                    this.advanceAfterBlockEnd(tok.value);
                    return node;
                },
                parseExtends: function () {
                    var tagName = 'extends';
                    var tag = this.peekToken();
                    if (!this.skipSymbol(tagName)) {
                        this.fail('parseTemplateRef: expected ' + tagName);
                    }
                    var node = new nodes_js_1.default.Extends(tag.lineno, tag.colno);
                    node.template = this.parseExpression();
                    this.advanceAfterBlockEnd(tag.value);
                    return node;
                },
                parseInclude: function () {
                    var tagName = 'include';
                    var tag = this.peekToken();
                    if (!this.skipSymbol(tagName)) {
                        this.fail('parseInclude: expected ' + tagName);
                    }
                    var node = new nodes_js_1.default.Include(tag.lineno, tag.colno);
                    node.template = this.parseExpression();
                    if (this.skipSymbol('ignore') && this.skipSymbol('missing')) {
                        node.ignoreMissing = true;
                    }
                    this.advanceAfterBlockEnd(tag.value);
                    return node;
                },
                parseIf: function () {
                    var tag = this.peekToken();
                    var node;
                    if (this.skipSymbol('if') || this.skipSymbol('elif') || this.skipSymbol('elseif')) {
                        node = new nodes_js_1.default.If(tag.lineno, tag.colno);
                    }
                    else if (this.skipSymbol('ifAsync')) {
                        node = new nodes_js_1.default.IfAsync(tag.lineno, tag.colno);
                    }
                    else {
                        this.fail('parseIf: expected if, elif, or elseif', tag.lineno, tag.colno);
                    }
                    node.cond = this.parseExpression();
                    this.advanceAfterBlockEnd(tag.value);
                    node.body = this.parseUntilBlocks('elif', 'elseif', 'else', 'endif');
                    var tok = this.peekToken();
                    switch (tok && tok.value) {
                        case 'elseif':
                        case 'elif':
                            node.else_ = this.parseIf();
                            break;
                        case 'else':
                            this.advanceAfterBlockEnd();
                            node.else_ = this.parseUntilBlocks('endif');
                            this.advanceAfterBlockEnd();
                            break;
                        case 'endif':
                            node.else_ = null;
                            this.advanceAfterBlockEnd();
                            break;
                        default:
                            this.fail('parseIf: expected elif, else, or endif, ' +
                                'got end of file');
                    }
                    return node;
                },
                parseSet: function () {
                    var tag = this.peekToken();
                    if (!this.skipSymbol('set')) {
                        this.fail('parseSet: expected set', tag.lineno, tag.colno);
                    }
                    var node = new nodes_js_1.default.Set(tag.lineno, tag.colno, []);
                    var target;
                    while ((target = this.parsePrimary())) {
                        node.targets.push(target);
                        if (!this.skip(lexer_js_1.default.TOKEN_COMMA)) {
                            break;
                        }
                    }
                    if (!this.skipValue(lexer_js_1.default.TOKEN_OPERATOR, '=')) {
                        if (!this.skip(lexer_js_1.default.TOKEN_BLOCK_END)) {
                            this.fail('parseSet: expected = or block end in set tag', tag.lineno, tag.colno);
                        }
                        else {
                            node.body = new nodes_js_1.default.Capture(tag.lineno, tag.colno, this.parseUntilBlocks('endset'));
                            node.value = null;
                            this.advanceAfterBlockEnd();
                        }
                    }
                    else {
                        node.value = this.parseExpression();
                        this.advanceAfterBlockEnd(tag.value);
                    }
                    return node;
                },
                parseStatement: function () {
                    var tok = this.peekToken();
                    var node;
                    if (tok.type !== lexer_js_1.default.TOKEN_SYMBOL) {
                        this.fail('tag name expected', tok.lineno, tok.colno);
                    }
                    if (this.breakOnBlocks &&
                        lib_js_3.default.indexOf(this.breakOnBlocks, tok.value) !== -1) {
                        return null;
                    }
                    switch (tok.value) {
                        case 'raw': return this.parseRaw();
                        case 'verbatim': return this.parseRaw('verbatim');
                        case 'if':
                        case 'ifAsync':
                            return this.parseIf();
                        case 'for':
                        case 'asyncEach':
                        case 'asyncAll':
                            return this.parseFor();
                        case 'block': return this.parseBlock();
                        case 'extends': return this.parseExtends();
                        case 'include': return this.parseInclude();
                        case 'set': return this.parseSet();
                        case 'macro': return this.parseMacro();
                        case 'call': return this.parseCall();
                        case 'import': return this.parseImport();
                        case 'from': return this.parseFrom();
                        case 'filter': return this.parseFilterStatement();
                        default:
                            if (this.extensions.length) {
                                for (var i = 0; i < this.extensions.length; i++) {
                                    var ext = this.extensions[i];
                                    if (lib_js_3.default.indexOf(ext.tags || [], tok.value) !== -1) {
                                        return ext.parse(this, nodes_js_1.default, lexer_js_1.default);
                                    }
                                }
                            }
                            this.fail('unknown block tag: ' + tok.value, tok.lineno, tok.colno);
                    }
                    return node;
                },
                parseRaw: function (tagName) {
                    tagName = tagName || 'raw';
                    var endTagName = 'end' + tagName;
                    // Look for upcoming raw blocks (ignore all other kinds of blocks)
                    var rawBlockRegex = new RegExp('([\\s\\S]*?){%\\s*(' + tagName + '|' + endTagName + ')\\s*(?=%})%}');
                    var rawLevel = 1;
                    var str = '';
                    var matches = null;
                    // Skip opening raw token
                    // Keep this token to track line and column numbers
                    var begun = this.advanceAfterBlockEnd();
                    // Exit when there's nothing to match
                    // or when we've found the matching "endraw" block
                    while ((matches = this.tokens._extractRegex(rawBlockRegex)) && rawLevel > 0) {
                        var all = matches[0];
                        var pre = matches[1];
                        var blockName = matches[2];
                        // Adjust rawlevel
                        if (blockName === tagName) {
                            rawLevel += 1;
                        }
                        else if (blockName === endTagName) {
                            rawLevel -= 1;
                        }
                        // Add to str
                        if (rawLevel === 0) {
                            // We want to exclude the last "endraw"
                            str += pre;
                            // Move tokenizer to beginning of endraw block
                            this.tokens.backN(all.length - pre.length);
                        }
                        else {
                            str += all;
                        }
                    }
                    return new nodes_js_1.default.Output(begun.lineno, begun.colno, [new nodes_js_1.default.TemplateData(begun.lineno, begun.colno, str)]);
                },
                parsePostfix: function (node) {
                    var lookup, tok = this.peekToken();
                    while (tok) {
                        if (tok.type === lexer_js_1.default.TOKEN_LEFT_PAREN) {
                            // Function call
                            node = new nodes_js_1.default.FunCall(tok.lineno, tok.colno, node, this.parseSignature());
                        }
                        else if (tok.type === lexer_js_1.default.TOKEN_LEFT_BRACKET) {
                            // Reference
                            lookup = this.parseAggregate();
                            if (lookup.children.length > 1) {
                                this.fail('invalid index');
                            }
                            node = new nodes_js_1.default.LookupVal(tok.lineno, tok.colno, node, lookup.children[0]);
                        }
                        else if (tok.type === lexer_js_1.default.TOKEN_OPERATOR && tok.value === '.') {
                            // Reference
                            this.nextToken();
                            var val = this.nextToken();
                            if (val.type !== lexer_js_1.default.TOKEN_SYMBOL) {
                                this.fail('expected name as lookup value, got ' + val.value, val.lineno, val.colno);
                            }
                            // Make a literal string because it's not a variable
                            // reference
                            lookup = new nodes_js_1.default.Literal(val.lineno, val.colno, val.value);
                            node = new nodes_js_1.default.LookupVal(tok.lineno, tok.colno, node, lookup);
                        }
                        else {
                            break;
                        }
                        tok = this.peekToken();
                    }
                    return node;
                },
                parseExpression: function () {
                    var node = this.parseInlineIf();
                    return node;
                },
                parseInlineIf: function () {
                    var node = this.parseOr();
                    if (this.skipSymbol('if')) {
                        var cond_node = this.parseOr();
                        var body_node = node;
                        node = new nodes_js_1.default.InlineIf(node.lineno, node.colno);
                        node.body = body_node;
                        node.cond = cond_node;
                        if (this.skipSymbol('else')) {
                            node.else_ = this.parseOr();
                        }
                        else {
                            node.else_ = null;
                        }
                    }
                    return node;
                },
                parseOr: function () {
                    var node = this.parseAnd();
                    while (this.skipSymbol('or')) {
                        var node2 = this.parseAnd();
                        node = new nodes_js_1.default.Or(node.lineno, node.colno, node, node2);
                    }
                    return node;
                },
                parseAnd: function () {
                    var node = this.parseNot();
                    while (this.skipSymbol('and')) {
                        var node2 = this.parseNot();
                        node = new nodes_js_1.default.And(node.lineno, node.colno, node, node2);
                    }
                    return node;
                },
                parseNot: function () {
                    var tok = this.peekToken();
                    if (this.skipSymbol('not')) {
                        return new nodes_js_1.default.Not(tok.lineno, tok.colno, this.parseNot());
                    }
                    return this.parseIn();
                },
                parseIn: function () {
                    var node = this.parseCompare();
                    while (1) {
                        // check if the next token is 'not'
                        var tok = this.nextToken();
                        if (!tok) {
                            break;
                        }
                        var invert = tok.type === lexer_js_1.default.TOKEN_SYMBOL && tok.value === 'not';
                        // if it wasn't 'not', put it back
                        if (!invert) {
                            this.pushToken(tok);
                        }
                        if (this.skipSymbol('in')) {
                            var node2 = this.parseCompare();
                            node = new nodes_js_1.default.In(node.lineno, node.colno, node, node2);
                            if (invert) {
                                node = new nodes_js_1.default.Not(node.lineno, node.colno, node);
                            }
                        }
                        else {
                            // if we'd found a 'not' but this wasn't an 'in', put back the 'not'
                            if (invert) {
                                this.pushToken(tok);
                            }
                            break;
                        }
                    }
                    return node;
                },
                parseCompare: function () {
                    var compareOps = ['==', '===', '!=', '!==', '<', '>', '<=', '>='];
                    var expr = this.parseConcat();
                    var ops = [];
                    while (1) {
                        var tok = this.nextToken();
                        if (!tok) {
                            break;
                        }
                        else if (lib_js_3.default.indexOf(compareOps, tok.value) !== -1) {
                            ops.push(new nodes_js_1.default.CompareOperand(tok.lineno, tok.colno, this.parseConcat(), tok.value));
                        }
                        else {
                            this.pushToken(tok);
                            break;
                        }
                    }
                    if (ops.length) {
                        return new nodes_js_1.default.Compare(ops[0].lineno, ops[0].colno, expr, ops);
                    }
                    else {
                        return expr;
                    }
                },
                // finds the '~' for string concatenation
                parseConcat: function () {
                    var node = this.parseAdd();
                    while (this.skipValue(lexer_js_1.default.TOKEN_TILDE, '~')) {
                        var node2 = this.parseAdd();
                        node = new nodes_js_1.default.Concat(node.lineno, node.colno, node, node2);
                    }
                    return node;
                },
                parseAdd: function () {
                    var node = this.parseSub();
                    while (this.skipValue(lexer_js_1.default.TOKEN_OPERATOR, '+')) {
                        var node2 = this.parseSub();
                        node = new nodes_js_1.default.Add(node.lineno, node.colno, node, node2);
                    }
                    return node;
                },
                parseSub: function () {
                    var node = this.parseMul();
                    while (this.skipValue(lexer_js_1.default.TOKEN_OPERATOR, '-')) {
                        var node2 = this.parseMul();
                        node = new nodes_js_1.default.Sub(node.lineno, node.colno, node, node2);
                    }
                    return node;
                },
                parseMul: function () {
                    var node = this.parseDiv();
                    while (this.skipValue(lexer_js_1.default.TOKEN_OPERATOR, '*')) {
                        var node2 = this.parseDiv();
                        node = new nodes_js_1.default.Mul(node.lineno, node.colno, node, node2);
                    }
                    return node;
                },
                parseDiv: function () {
                    var node = this.parseFloorDiv();
                    while (this.skipValue(lexer_js_1.default.TOKEN_OPERATOR, '/')) {
                        var node2 = this.parseFloorDiv();
                        node = new nodes_js_1.default.Div(node.lineno, node.colno, node, node2);
                    }
                    return node;
                },
                parseFloorDiv: function () {
                    var node = this.parseMod();
                    while (this.skipValue(lexer_js_1.default.TOKEN_OPERATOR, '//')) {
                        var node2 = this.parseMod();
                        node = new nodes_js_1.default.FloorDiv(node.lineno, node.colno, node, node2);
                    }
                    return node;
                },
                parseMod: function () {
                    var node = this.parsePow();
                    while (this.skipValue(lexer_js_1.default.TOKEN_OPERATOR, '%')) {
                        var node2 = this.parsePow();
                        node = new nodes_js_1.default.Mod(node.lineno, node.colno, node, node2);
                    }
                    return node;
                },
                parsePow: function () {
                    var node = this.parseUnary();
                    while (this.skipValue(lexer_js_1.default.TOKEN_OPERATOR, '**')) {
                        var node2 = this.parseUnary();
                        node = new nodes_js_1.default.Pow(node.lineno, node.colno, node, node2);
                    }
                    return node;
                },
                parseUnary: function (noFilters) {
                    var tok = this.peekToken();
                    var node;
                    if (this.skipValue(lexer_js_1.default.TOKEN_OPERATOR, '-')) {
                        node = new nodes_js_1.default.Neg(tok.lineno, tok.colno, this.parseUnary(true));
                    }
                    else if (this.skipValue(lexer_js_1.default.TOKEN_OPERATOR, '+')) {
                        node = new nodes_js_1.default.Pos(tok.lineno, tok.colno, this.parseUnary(true));
                    }
                    else {
                        node = this.parsePrimary();
                    }
                    if (!noFilters) {
                        node = this.parseFilter(node);
                    }
                    return node;
                },
                parsePrimary: function (noPostfix) {
                    var tok = this.nextToken();
                    var val;
                    var node = null;
                    if (!tok) {
                        this.fail('expected expression, got end of file');
                    }
                    else if (tok.type === lexer_js_1.default.TOKEN_STRING) {
                        val = tok.value;
                    }
                    else if (tok.type === lexer_js_1.default.TOKEN_INT) {
                        val = parseInt(tok.value, 10);
                    }
                    else if (tok.type === lexer_js_1.default.TOKEN_FLOAT) {
                        val = parseFloat(tok.value);
                    }
                    else if (tok.type === lexer_js_1.default.TOKEN_BOOLEAN) {
                        if (tok.value === 'true') {
                            val = true;
                        }
                        else if (tok.value === 'false') {
                            val = false;
                        }
                        else {
                            this.fail('invalid boolean: ' + tok.value, tok.lineno, tok.colno);
                        }
                    }
                    else if (tok.type === lexer_js_1.default.TOKEN_NONE) {
                        val = null;
                    }
                    else if (tok.type === lexer_js_1.default.TOKEN_REGEX) {
                        val = new RegExp(tok.value.body, tok.value.flags);
                    }
                    if (val !== undefined) {
                        node = new nodes_js_1.default.Literal(tok.lineno, tok.colno, val);
                    }
                    else if (tok.type === lexer_js_1.default.TOKEN_SYMBOL) {
                        node = new nodes_js_1.default.Symbol(tok.lineno, tok.colno, tok.value);
                    }
                    else {
                        // See if it's an aggregate type, we need to push the
                        // current delimiter token back on
                        this.pushToken(tok);
                        node = this.parseAggregate();
                    }
                    if (!noPostfix) {
                        node = this.parsePostfix(node);
                    }
                    if (node) {
                        return node;
                    }
                    else {
                        this.fail('unexpected token: ' + tok.value, tok.lineno, tok.colno);
                    }
                },
                parseFilterName: function () {
                    var tok = this.expect(lexer_js_1.default.TOKEN_SYMBOL);
                    var name = tok.value;
                    while (this.skipValue(lexer_js_1.default.TOKEN_OPERATOR, '.')) {
                        name += '.' + this.expect(lexer_js_1.default.TOKEN_SYMBOL).value;
                    }
                    return new nodes_js_1.default.Symbol(tok.lineno, tok.colno, name);
                },
                parseFilterArgs: function (node) {
                    if (this.peekToken().type === lexer_js_1.default.TOKEN_LEFT_PAREN) {
                        // Get a FunCall node and add the parameters to the
                        // filter
                        var call = this.parsePostfix(node);
                        return call.args.children;
                    }
                    return [];
                },
                parseFilter: function (node) {
                    while (this.skip(lexer_js_1.default.TOKEN_PIPE)) {
                        var name = this.parseFilterName();
                        node = new nodes_js_1.default.Filter(name.lineno, name.colno, name, new nodes_js_1.default.NodeList(name.lineno, name.colno, [node].concat(this.parseFilterArgs(node))));
                    }
                    return node;
                },
                parseFilterStatement: function () {
                    var filterTok = this.peekToken();
                    if (!this.skipSymbol('filter')) {
                        this.fail('parseFilterStatement: expected filter');
                    }
                    var name = this.parseFilterName();
                    var args = this.parseFilterArgs(name);
                    this.advanceAfterBlockEnd(filterTok.value);
                    var body = new nodes_js_1.default.Capture(name.lineno, name.colno, this.parseUntilBlocks('endfilter'));
                    this.advanceAfterBlockEnd();
                    var node = new nodes_js_1.default.Filter(name.lineno, name.colno, name, new nodes_js_1.default.NodeList(name.lineno, name.colno, [body].concat(args)));
                    return new nodes_js_1.default.Output(name.lineno, name.colno, [node]);
                },
                parseAggregate: function () {
                    var tok = this.nextToken();
                    var node;
                    switch (tok.type) {
                        case lexer_js_1.default.TOKEN_LEFT_PAREN:
                            node = new nodes_js_1.default.Group(tok.lineno, tok.colno);
                            break;
                        case lexer_js_1.default.TOKEN_LEFT_BRACKET:
                            node = new nodes_js_1.default.Array(tok.lineno, tok.colno);
                            break;
                        case lexer_js_1.default.TOKEN_LEFT_CURLY:
                            node = new nodes_js_1.default.Dict(tok.lineno, tok.colno);
                            break;
                        default:
                            return null;
                    }
                    while (1) {
                        var type = this.peekToken().type;
                        if (type === lexer_js_1.default.TOKEN_RIGHT_PAREN ||
                            type === lexer_js_1.default.TOKEN_RIGHT_BRACKET ||
                            type === lexer_js_1.default.TOKEN_RIGHT_CURLY) {
                            this.nextToken();
                            break;
                        }
                        if (node.children.length > 0) {
                            if (!this.skip(lexer_js_1.default.TOKEN_COMMA)) {
                                this.fail('parseAggregate: expected comma after expression', tok.lineno, tok.colno);
                            }
                        }
                        if (node instanceof nodes_js_1.default.Dict) {
                            // TODO: check for errors
                            var key = this.parsePrimary();
                            // We expect a key/value pair for dicts, separated by a
                            // colon
                            if (!this.skip(lexer_js_1.default.TOKEN_COLON)) {
                                this.fail('parseAggregate: expected colon after dict key', tok.lineno, tok.colno);
                            }
                            // TODO: check for errors
                            var value = this.parseExpression();
                            node.addChild(new nodes_js_1.default.Pair(key.lineno, key.colno, key, value));
                        }
                        else {
                            // TODO: check for errors
                            var expr = this.parseExpression();
                            node.addChild(expr);
                        }
                    }
                    return node;
                },
                parseSignature: function (tolerant, noParens) {
                    var tok = this.peekToken();
                    if (!noParens && tok.type !== lexer_js_1.default.TOKEN_LEFT_PAREN) {
                        if (tolerant) {
                            return null;
                        }
                        else {
                            this.fail('expected arguments', tok.lineno, tok.colno);
                        }
                    }
                    if (tok.type === lexer_js_1.default.TOKEN_LEFT_PAREN) {
                        tok = this.nextToken();
                    }
                    var args = new nodes_js_1.default.NodeList(tok.lineno, tok.colno);
                    var kwargs = new nodes_js_1.default.KeywordArgs(tok.lineno, tok.colno);
                    var checkComma = false;
                    while (1) {
                        tok = this.peekToken();
                        if (!noParens && tok.type === lexer_js_1.default.TOKEN_RIGHT_PAREN) {
                            this.nextToken();
                            break;
                        }
                        else if (noParens && tok.type === lexer_js_1.default.TOKEN_BLOCK_END) {
                            break;
                        }
                        if (checkComma && !this.skip(lexer_js_1.default.TOKEN_COMMA)) {
                            this.fail('parseSignature: expected comma after expression', tok.lineno, tok.colno);
                        }
                        else {
                            var arg = this.parseExpression();
                            if (this.skipValue(lexer_js_1.default.TOKEN_OPERATOR, '=')) {
                                kwargs.addChild(new nodes_js_1.default.Pair(arg.lineno, arg.colno, arg, this.parseExpression()));
                            }
                            else {
                                args.addChild(arg);
                            }
                        }
                        checkComma = true;
                    }
                    if (kwargs.children.length) {
                        args.addChild(kwargs);
                    }
                    return args;
                },
                parseUntilBlocks: function ( /* blockNames */) {
                    var prev = this.breakOnBlocks;
                    this.breakOnBlocks = lib_js_3.default.toArray(arguments);
                    var ret = this.parse();
                    this.breakOnBlocks = prev;
                    return ret;
                },
                parseNodes: function () {
                    var tok;
                    var buf = [];
                    while ((tok = this.nextToken())) {
                        if (tok.type === lexer_js_1.default.TOKEN_DATA) {
                            var data = tok.value;
                            var nextToken = this.peekToken();
                            var nextVal = nextToken && nextToken.value;
                            // If the last token has "-" we need to trim the
                            // leading whitespace of the data. This is marked with
                            // the `dropLeadingWhitespace` variable.
                            if (this.dropLeadingWhitespace) {
                                // TODO: this could be optimized (don't use regex)
                                data = data.replace(/^\s*/, '');
                                this.dropLeadingWhitespace = false;
                            }
                            // Same for the succeeding block start token
                            if (nextToken &&
                                ((nextToken.type === lexer_js_1.default.TOKEN_BLOCK_START &&
                                    nextVal.charAt(nextVal.length - 1) === '-') ||
                                    (nextToken.type === lexer_js_1.default.TOKEN_VARIABLE_START &&
                                        nextVal.charAt(this.tokens.tags.VARIABLE_START.length)
                                            === '-') ||
                                    (nextToken.type === lexer_js_1.default.TOKEN_COMMENT &&
                                        nextVal.charAt(this.tokens.tags.COMMENT_START.length)
                                            === '-'))) {
                                // TODO: this could be optimized (don't use regex)
                                data = data.replace(/\s*$/, '');
                            }
                            buf.push(new nodes_js_1.default.Output(tok.lineno, tok.colno, [new nodes_js_1.default.TemplateData(tok.lineno, tok.colno, data)]));
                        }
                        else if (tok.type === lexer_js_1.default.TOKEN_BLOCK_START) {
                            this.dropLeadingWhitespace = false;
                            var n = this.parseStatement();
                            if (!n) {
                                break;
                            }
                            buf.push(n);
                        }
                        else if (tok.type === lexer_js_1.default.TOKEN_VARIABLE_START) {
                            var e = this.parseExpression();
                            this.dropLeadingWhitespace = false;
                            this.advanceAfterVariableEnd();
                            buf.push(new nodes_js_1.default.Output(tok.lineno, tok.colno, [e]));
                        }
                        else if (tok.type === lexer_js_1.default.TOKEN_COMMENT) {
                            this.dropLeadingWhitespace = tok.value.charAt(tok.value.length - this.tokens.tags.COMMENT_END.length - 1) === '-';
                        }
                        else {
                            // Ignore comments, otherwise this should be an error
                            this.fail('Unexpected token at top-level: ' +
                                tok.type, tok.lineno, tok.colno);
                        }
                    }
                    return buf;
                },
                parse: function () {
                    return new nodes_js_1.default.NodeList(0, 0, this.parseNodes());
                },
                parseAsRoot: function () {
                    return new nodes_js_1.default.Root(0, 0, this.parseNodes());
                }
            });
            exports_22("default", {
                parse: function (src, extensions, opts) {
                    var p = new Parser(lexer_js_1.default.lex(src, opts));
                    if (extensions !== undefined) {
                        p.extensions = extensions;
                    }
                    return p.parseAsRoot();
                },
                Parser: Parser
            });
        }
    };
});
System.register("file:///home/main/Desktop/denjucks/v4/src/transformer", ["file:///home/main/Desktop/denjucks/v4/src/nodes", "file:///home/main/Desktop/denjucks/v4/src/lib"], function (exports_23, context_23) {
    'use strict';
    var nodes_js_2, lib_js_4, sym;
    var __moduleName = context_23 && context_23.id;
    function gensym() {
        return 'hole_' + sym++;
    }
    // copy-on-write version of map
    function mapCOW(arr, func) {
        var res = null;
        for (var i = 0; i < arr.length; i++) {
            var item = func(arr[i]);
            if (item !== arr[i]) {
                if (!res) {
                    res = arr.slice();
                }
                res[i] = item;
            }
        }
        return res || arr;
    }
    function walk(ast, func, depthFirst) {
        if (!(ast instanceof nodes_js_2.default.Node)) {
            return ast;
        }
        if (!depthFirst) {
            var astT = func(ast);
            if (astT && astT !== ast) {
                return astT;
            }
        }
        if (ast instanceof nodes_js_2.default.NodeList) {
            var children = mapCOW(ast.children, function (node) {
                return walk(node, func, depthFirst);
            });
            if (children !== ast.children) {
                ast = new nodes_js_2.default[ast.typename](ast.lineno, ast.colno, children);
            }
        }
        else if (ast instanceof nodes_js_2.default.CallExtension) {
            var args = walk(ast.args, func, depthFirst);
            var contentArgs = mapCOW(ast.contentArgs, function (node) {
                return walk(node, func, depthFirst);
            });
            if (args !== ast.args || contentArgs !== ast.contentArgs) {
                ast = new nodes_js_2.default[ast.typename](ast.extName, ast.prop, args, contentArgs);
            }
        }
        else {
            var props = ast.fields.map(function (field) {
                return ast[field];
            });
            var propsT = mapCOW(props, function (prop) {
                return walk(prop, func, depthFirst);
            });
            if (propsT !== props) {
                ast = new nodes_js_2.default[ast.typename](ast.lineno, ast.colno);
                propsT.forEach(function (prop, i) {
                    ast[ast.fields[i]] = prop;
                });
            }
        }
        return depthFirst ? (func(ast) || ast) : ast;
    }
    function depthWalk(ast, func) {
        return walk(ast, func, true);
    }
    function _liftFilters(node, asyncFilters, prop) {
        var children = [];
        var walked = depthWalk(prop ? node[prop] : node, function (node) {
            if (node instanceof nodes_js_2.default.Block) {
                return node;
            }
            else if ((node instanceof nodes_js_2.default.Filter &&
                lib_js_4.default.indexOf(asyncFilters, node.name.value) !== -1) ||
                node instanceof nodes_js_2.default.CallExtensionAsync) {
                var symbol = new nodes_js_2.default.Symbol(node.lineno, node.colno, gensym());
                children.push(new nodes_js_2.default.FilterAsync(node.lineno, node.colno, node.name, node.args, symbol));
                return symbol;
            }
        });
        if (prop) {
            node[prop] = walked;
        }
        else {
            node = walked;
        }
        if (children.length) {
            children.push(node);
            return new nodes_js_2.default.NodeList(node.lineno, node.colno, children);
        }
        else {
            return node;
        }
    }
    function liftFilters(ast, asyncFilters) {
        return depthWalk(ast, function (node) {
            if (node instanceof nodes_js_2.default.Output) {
                return _liftFilters(node, asyncFilters);
            }
            else if (node instanceof nodes_js_2.default.Set) {
                return _liftFilters(node, asyncFilters, 'value');
            }
            else if (node instanceof nodes_js_2.default.For) {
                return _liftFilters(node, asyncFilters, 'arr');
            }
            else if (node instanceof nodes_js_2.default.If) {
                return _liftFilters(node, asyncFilters, 'cond');
            }
            else if (node instanceof nodes_js_2.default.CallExtension) {
                return _liftFilters(node, asyncFilters, 'args');
            }
        });
    }
    function liftSuper(ast) {
        return walk(ast, function (blockNode) {
            if (!(blockNode instanceof nodes_js_2.default.Block)) {
                return;
            }
            var hasSuper = false;
            var symbol = gensym();
            blockNode.body = walk(blockNode.body, function (node) {
                if (node instanceof nodes_js_2.default.FunCall &&
                    node.name.value === 'super') {
                    hasSuper = true;
                    return new nodes_js_2.default.Symbol(node.lineno, node.colno, symbol);
                }
            });
            if (hasSuper) {
                blockNode.body.children.unshift(new nodes_js_2.default.Super(0, 0, blockNode.name, new nodes_js_2.default.Symbol(0, 0, symbol)));
            }
        });
    }
    function convertStatements(ast) {
        return depthWalk(ast, function (node) {
            if (!(node instanceof nodes_js_2.default.If) &&
                !(node instanceof nodes_js_2.default.For)) {
                return;
            }
            var async = false;
            walk(node, function (node) {
                if (node instanceof nodes_js_2.default.FilterAsync ||
                    node instanceof nodes_js_2.default.IfAsync ||
                    node instanceof nodes_js_2.default.AsyncEach ||
                    node instanceof nodes_js_2.default.AsyncAll ||
                    node instanceof nodes_js_2.default.CallExtensionAsync) {
                    async = true;
                    // Stop iterating by returning the node
                    return node;
                }
            });
            if (async) {
                if (node instanceof nodes_js_2.default.If) {
                    return new nodes_js_2.default.IfAsync(node.lineno, node.colno, node.cond, node.body, node.else_);
                }
                else if (node instanceof nodes_js_2.default.For) {
                    return new nodes_js_2.default.AsyncEach(node.lineno, node.colno, node.arr, node.name, node.body, node.else_);
                }
            }
        });
    }
    function cps(ast, asyncFilters) {
        return convertStatements(liftSuper(liftFilters(ast, asyncFilters)));
    }
    function transform(ast, asyncFilters) {
        return cps(ast, asyncFilters || []);
    }
    return {
        setters: [
            function (nodes_js_2_1) {
                nodes_js_2 = nodes_js_2_1;
            },
            function (lib_js_4_1) {
                lib_js_4 = lib_js_4_1;
            }
        ],
        execute: function () {
            sym = 0;
            exports_23("default", {
                transform: transform
            });
        }
    };
});
System.register("file:///home/main/Desktop/denjucks/v4/src/runtime", ["file:///home/main/Desktop/denjucks/v4/src/lib", "file:///home/main/Desktop/denjucks/v4/src/object"], function (exports_24, context_24) {
    'use strict';
    var lib_js_5, object_js_3, Frame;
    var __moduleName = context_24 && context_24.id;
    function makeMacro(argNames, kwargNames, func) {
        return function () {
            var argCount = numArgs(arguments);
            var args;
            var kwargs = getKeywordArgs(arguments);
            var i;
            if (argCount > argNames.length) {
                args = Array.prototype.slice.call(arguments, 0, argNames.length);
                // Positional arguments that should be passed in as
                // keyword arguments (essentially default values)
                var vals = Array.prototype.slice.call(arguments, args.length, argCount);
                for (i = 0; i < vals.length; i++) {
                    if (i < kwargNames.length) {
                        kwargs[kwargNames[i]] = vals[i];
                    }
                }
                args.push(kwargs);
            }
            else if (argCount < argNames.length) {
                args = Array.prototype.slice.call(arguments, 0, argCount);
                for (i = argCount; i < argNames.length; i++) {
                    var arg = argNames[i];
                    // Keyword arguments that should be passed as
                    // positional arguments, i.e. the caller explicitly
                    // used the name of a positional arg
                    args.push(kwargs[arg]);
                    delete kwargs[arg];
                }
                args.push(kwargs);
            }
            else {
                args = arguments;
            }
            return func.apply(this, args);
        };
    }
    function makeKeywordArgs(obj) {
        obj.__keywords = true;
        return obj;
    }
    function getKeywordArgs(args) {
        var len = args.length;
        if (len) {
            var lastArg = args[len - 1];
            if (lastArg && lastArg.hasOwnProperty('__keywords')) {
                return lastArg;
            }
        }
        return {};
    }
    function numArgs(args) {
        var len = args.length;
        if (len === 0) {
            return 0;
        }
        var lastArg = args[len - 1];
        if (lastArg && lastArg.hasOwnProperty('__keywords')) {
            return len - 1;
        }
        else {
            return len;
        }
    }
    // A SafeString object indicates that the string should not be
    // autoescaped. This happens magically because autoescaping only
    // occurs on primitive string objects.
    function SafeString(val) {
        if (typeof val !== 'string') {
            return val;
        }
        this.val = val;
        this.length = val.length;
    }
    function copySafeness(dest, target) {
        if (dest instanceof SafeString) {
            return new SafeString(target);
        }
        return target.toString();
    }
    function markSafe(val) {
        var type = typeof val;
        if (type === 'string') {
            return new SafeString(val);
        }
        else if (type !== 'function') {
            return val;
        }
        else {
            return function () {
                var ret = val.apply(this, arguments);
                if (typeof ret === 'string') {
                    return new SafeString(ret);
                }
                return ret;
            };
        }
    }
    function suppressValue(val, autoescape) {
        val = (val !== undefined && val !== null) ? val : '';
        if (autoescape && !(val instanceof SafeString)) {
            val = lib_js_5.default.escape(val.toString());
        }
        return val;
    }
    function ensureDefined(val, lineno, colno) {
        if (val === null || val === undefined) {
            throw new lib_js_5.default.TemplateError('attempted to output null or undefined value', lineno + 1, colno + 1);
        }
        return val;
    }
    function memberLookup(obj, val) {
        obj = obj || {};
        if (typeof obj[val] === 'function') {
            return function () {
                return obj[val].apply(obj, arguments);
            };
        }
        return obj[val];
    }
    function callWrap(obj, name, context, args) {
        if (!obj) {
            throw new Error('Unable to call `' + name + '`, which is undefined or falsey');
        }
        else if (typeof obj !== 'function') {
            throw new Error('Unable to call `' + name + '`, which is not a function');
        }
        // jshint validthis: true
        return obj.apply(context, args);
    }
    function contextOrFrameLookup(context, frame, name) {
        var val = frame.lookup(name);
        return (val !== undefined) ?
            val :
            context.lookup(name);
    }
    function handleError(error, lineno, colno) {
        if (error.lineno) {
            return error;
        }
        else {
            return new lib_js_5.default.TemplateError(error, lineno, colno);
        }
    }
    function asyncEach(arr, dimen, iter, cb) {
        if (lib_js_5.default.isArray(arr)) {
            var len = arr.length;
            lib_js_5.default.asyncIter(arr, function (item, i, next) {
                switch (dimen) {
                    case 1:
                        iter(item, i, len, next);
                        break;
                    case 2:
                        iter(item[0], item[1], i, len, next);
                        break;
                    case 3:
                        iter(item[0], item[1], item[2], i, len, next);
                        break;
                    default:
                        item.push(i, next);
                        iter.apply(this, item);
                }
            }, cb);
        }
        else {
            lib_js_5.default.asyncFor(arr, function (key, val, i, len, next) {
                iter(key, val, i, len, next);
            }, cb);
        }
    }
    function asyncAll(arr, dimen, func, cb) {
        var finished = 0;
        var len, i;
        var outputArr;
        function done(i, output) {
            finished++;
            outputArr[i] = output;
            if (finished === len) {
                cb(null, outputArr.join(''));
            }
        }
        if (lib_js_5.default.isArray(arr)) {
            len = arr.length;
            outputArr = new Array(len);
            if (len === 0) {
                cb(null, '');
            }
            else {
                for (i = 0; i < arr.length; i++) {
                    var item = arr[i];
                    switch (dimen) {
                        case 1:
                            func(item, i, len, done);
                            break;
                        case 2:
                            func(item[0], item[1], i, len, done);
                            break;
                        case 3:
                            func(item[0], item[1], item[2], i, len, done);
                            break;
                        default:
                            item.push(i, done);
                            // jshint validthis: true
                            func.apply(this, item);
                    }
                }
            }
        }
        else {
            var keys = lib_js_5.default.keys(arr);
            len = keys.length;
            outputArr = new Array(len);
            if (len === 0) {
                cb(null, '');
            }
            else {
                for (i = 0; i < keys.length; i++) {
                    var k = keys[i];
                    func(k, arr[k], i, len, done);
                }
            }
        }
    }
    return {
        setters: [
            function (lib_js_5_1) {
                lib_js_5 = lib_js_5_1;
            },
            function (object_js_3_1) {
                object_js_3 = object_js_3_1;
            }
        ],
        execute: function () {
            // Frames keep track of scoping both at compile-time and run-time so
            // we know how to access variables. Block tags can introduce special
            // variables, for example.
            Frame = object_js_3.default.extend({
                init: function (parent, isolateWrites) {
                    this.variables = {};
                    this.parent = parent;
                    this.topLevel = false;
                    // if this is true, writes (set) should never propagate upwards past
                    // this frame to its parent (though reads may).
                    this.isolateWrites = isolateWrites;
                },
                set: function (name, val, resolveUp) {
                    // Allow variables with dots by automatically creating the
                    // nested structure
                    var parts = name.split('.');
                    var obj = this.variables;
                    var frame = this;
                    if (resolveUp) {
                        if ((frame = this.resolve(parts[0], true))) {
                            frame.set(name, val);
                            return;
                        }
                    }
                    for (var i = 0; i < parts.length - 1; i++) {
                        var id = parts[i];
                        if (!obj[id]) {
                            obj[id] = {};
                        }
                        obj = obj[id];
                    }
                    obj[parts[parts.length - 1]] = val;
                },
                get: function (name) {
                    var val = this.variables[name];
                    if (val !== undefined) {
                        return val;
                    }
                    return null;
                },
                lookup: function (name) {
                    var p = this.parent;
                    var val = this.variables[name];
                    if (val !== undefined) {
                        return val;
                    }
                    return p && p.lookup(name);
                },
                resolve: function (name, forWrite) {
                    var p = (forWrite && this.isolateWrites) ? undefined : this.parent;
                    var val = this.variables[name];
                    if (val !== undefined) {
                        return this;
                    }
                    return p && p.resolve(name);
                },
                push: function (isolateWrites) {
                    return new Frame(this, isolateWrites);
                },
                pop: function () {
                    return this.parent;
                }
            });
            SafeString.prototype = Object.create(String.prototype, {
                length: { writable: true, configurable: true, value: 0 }
            });
            SafeString.prototype.valueOf = function () {
                return this.val;
            };
            SafeString.prototype.toString = function () {
                return this.val;
            };
            exports_24("default", {
                Frame: Frame,
                makeMacro: makeMacro,
                makeKeywordArgs: makeKeywordArgs,
                numArgs: numArgs,
                suppressValue: suppressValue,
                ensureDefined: ensureDefined,
                memberLookup: memberLookup,
                contextOrFrameLookup: contextOrFrameLookup,
                callWrap: callWrap,
                handleError: handleError,
                isArray: lib_js_5.default.isArray,
                keys: lib_js_5.default.keys,
                SafeString: SafeString,
                copySafeness: copySafeness,
                markSafe: markSafe,
                asyncEach: asyncEach,
                asyncAll: asyncAll,
                inOperator: lib_js_5.default.inOperator
            });
        }
    };
});
System.register("file:///home/main/Desktop/denjucks/v4/src/compiler", ["file:///home/main/Desktop/denjucks/v4/src/lib", "file:///home/main/Desktop/denjucks/v4/src/parser", "file:///home/main/Desktop/denjucks/v4/src/transformer", "file:///home/main/Desktop/denjucks/v4/src/nodes", "file:///home/main/Desktop/denjucks/v4/src/object", "file:///home/main/Desktop/denjucks/v4/src/runtime"], function (exports_25, context_25) {
    'use strict';
    var lib_js_6, parser_js_1, transformer_js_1, nodes_js_3, object_js_4, runtime_js_1, Frame, compareOps, Compiler;
    var __moduleName = context_25 && context_25.id;
    // A common pattern is to emit binary operators
    function binOpEmitter(str) {
        return function (node, frame) {
            this.compile(node.left, frame);
            this.emit(str);
            this.compile(node.right, frame);
        };
    }
    return {
        setters: [
            function (lib_js_6_1) {
                lib_js_6 = lib_js_6_1;
            },
            function (parser_js_1_1) {
                parser_js_1 = parser_js_1_1;
            },
            function (transformer_js_1_1) {
                transformer_js_1 = transformer_js_1_1;
            },
            function (nodes_js_3_1) {
                nodes_js_3 = nodes_js_3_1;
            },
            function (object_js_4_1) {
                object_js_4 = object_js_4_1;
            },
            function (runtime_js_1_1) {
                runtime_js_1 = runtime_js_1_1;
            }
        ],
        execute: function () {
            Frame = runtime_js_1.default.Frame;
            // These are all the same for now, but shouldn't be passed straight
            // through
            compareOps = {
                '==': '==',
                '===': '===',
                '!=': '!=',
                '!==': '!==',
                '<': '<',
                '>': '>',
                '<=': '<=',
                '>=': '>='
            };
            Compiler = object_js_4.default.extend({
                init: function (templateName, throwOnUndefined) {
                    this.templateName = templateName;
                    this.codebuf = [];
                    this.lastId = 0;
                    this.buffer = null;
                    this.bufferStack = [];
                    this.scopeClosers = '';
                    this.inBlock = false;
                    this.throwOnUndefined = throwOnUndefined;
                },
                fail: function (msg, lineno, colno) {
                    if (lineno !== undefined)
                        lineno += 1;
                    if (colno !== undefined)
                        colno += 1;
                    throw new lib_js_6.default.TemplateError(msg, lineno, colno);
                },
                pushBufferId: function (id) {
                    this.bufferStack.push(this.buffer);
                    this.buffer = id;
                    this.emit('var ' + this.buffer + ' = "";');
                },
                popBufferId: function () {
                    this.buffer = this.bufferStack.pop();
                },
                emit: function (code) {
                    this.codebuf.push(code);
                },
                emitLine: function (code) {
                    this.emit(code + '\n');
                },
                emitLines: function () {
                    lib_js_6.default.each(lib_js_6.default.toArray(arguments), function (line) {
                        this.emitLine(line);
                    }, this);
                },
                emitFuncBegin: function (name) {
                    this.buffer = 'output';
                    this.scopeClosers = '';
                    this.emitLine('function ' + name + '(env, context, frame, runtime, cb) {');
                    this.emitLine('var lineno = null;');
                    this.emitLine('var colno = null;');
                    this.emitLine('var ' + this.buffer + ' = "";');
                    this.emitLine('try {');
                },
                emitFuncEnd: function (noReturn) {
                    if (!noReturn) {
                        this.emitLine('cb(null, ' + this.buffer + ');');
                    }
                    this.closeScopeLevels();
                    this.emitLine('} catch (e) {');
                    this.emitLine('  cb(runtime.handleError(e, lineno, colno));');
                    this.emitLine('}');
                    this.emitLine('}');
                    this.buffer = null;
                },
                addScopeLevel: function () {
                    this.scopeClosers += '})';
                },
                closeScopeLevels: function () {
                    this.emitLine(this.scopeClosers + ';');
                    this.scopeClosers = '';
                },
                withScopedSyntax: function (func) {
                    var scopeClosers = this.scopeClosers;
                    this.scopeClosers = '';
                    func.call(this);
                    this.closeScopeLevels();
                    this.scopeClosers = scopeClosers;
                },
                makeCallback: function (res) {
                    var err = this.tmpid();
                    return 'function(' + err + (res ? ',' + res : '') + ') {\n' +
                        'if(' + err + ') { cb(' + err + '); return; }';
                },
                tmpid: function () {
                    this.lastId++;
                    return 't_' + this.lastId;
                },
                _templateName: function () {
                    return this.templateName == null ? 'undefined' : JSON.stringify(this.templateName);
                },
                _compileChildren: function (node, frame) {
                    var children = node.children;
                    for (var i = 0, l = children.length; i < l; i++) {
                        this.compile(children[i], frame);
                    }
                },
                _compileAggregate: function (node, frame, startChar, endChar) {
                    if (startChar) {
                        this.emit(startChar);
                    }
                    for (var i = 0; i < node.children.length; i++) {
                        if (i > 0) {
                            this.emit(',');
                        }
                        this.compile(node.children[i], frame);
                    }
                    if (endChar) {
                        this.emit(endChar);
                    }
                },
                _compileExpression: function (node, frame) {
                    // TODO: I'm not really sure if this type check is worth it or
                    // not.
                    this.assertType(node, nodes_js_3.default.Literal, nodes_js_3.default.Symbol, nodes_js_3.default.Group, nodes_js_3.default.Array, nodes_js_3.default.Dict, nodes_js_3.default.FunCall, nodes_js_3.default.Caller, nodes_js_3.default.Filter, nodes_js_3.default.LookupVal, nodes_js_3.default.Compare, nodes_js_3.default.InlineIf, nodes_js_3.default.In, nodes_js_3.default.And, nodes_js_3.default.Or, nodes_js_3.default.Not, nodes_js_3.default.Add, nodes_js_3.default.Concat, nodes_js_3.default.Sub, nodes_js_3.default.Mul, nodes_js_3.default.Div, nodes_js_3.default.FloorDiv, nodes_js_3.default.Mod, nodes_js_3.default.Pow, nodes_js_3.default.Neg, nodes_js_3.default.Pos, nodes_js_3.default.Compare, nodes_js_3.default.NodeList);
                    this.compile(node, frame);
                },
                assertType: function (node /*, types */) {
                    var types = lib_js_6.default.toArray(arguments).slice(1);
                    var success = false;
                    for (var i = 0; i < types.length; i++) {
                        if (node instanceof types[i]) {
                            success = true;
                        }
                    }
                    if (!success) {
                        this.fail('assertType: invalid type: ' + node.typename, node.lineno, node.colno);
                    }
                },
                compileCallExtension: function (node, frame, async) {
                    var args = node.args;
                    var contentArgs = node.contentArgs;
                    var autoescape = typeof node.autoescape === 'boolean' ? node.autoescape : true;
                    if (!async) {
                        this.emit(this.buffer + ' += runtime.suppressValue(');
                    }
                    this.emit('env.getExtension("' + node.extName + '")["' + node.prop + '"](');
                    this.emit('context');
                    if (args || contentArgs) {
                        this.emit(',');
                    }
                    if (args) {
                        if (!(args instanceof nodes_js_3.default.NodeList)) {
                            this.fail('compileCallExtension: arguments must be a NodeList, ' +
                                'use `parser.parseSignature`');
                        }
                        lib_js_6.default.each(args.children, function (arg, i) {
                            // Tag arguments are passed normally to the call. Note
                            // that keyword arguments are turned into a single js
                            // object as the last argument, if they exist.
                            this._compileExpression(arg, frame);
                            if (i !== args.children.length - 1 || contentArgs.length) {
                                this.emit(',');
                            }
                        }, this);
                    }
                    if (contentArgs.length) {
                        lib_js_6.default.each(contentArgs, function (arg, i) {
                            if (i > 0) {
                                this.emit(',');
                            }
                            if (arg) {
                                var id = this.tmpid();
                                this.emitLine('function(cb) {');
                                this.emitLine('if(!cb) { cb = function(err) { if(err) { throw err; }}}');
                                this.pushBufferId(id);
                                this.withScopedSyntax(function () {
                                    this.compile(arg, frame);
                                    this.emitLine('cb(null, ' + id + ');');
                                });
                                this.popBufferId();
                                this.emitLine('return ' + id + ';');
                                this.emitLine('}');
                            }
                            else {
                                this.emit('null');
                            }
                        }, this);
                    }
                    if (async) {
                        var res = this.tmpid();
                        this.emitLine(', ' + this.makeCallback(res));
                        this.emitLine(this.buffer + ' += runtime.suppressValue(' + res + ', ' + autoescape + ' && env.opts.autoescape);');
                        this.addScopeLevel();
                    }
                    else {
                        this.emit(')');
                        this.emit(', ' + autoescape + ' && env.opts.autoescape);\n');
                    }
                },
                compileCallExtensionAsync: function (node, frame) {
                    this.compileCallExtension(node, frame, true);
                },
                compileNodeList: function (node, frame) {
                    this._compileChildren(node, frame);
                },
                compileLiteral: function (node) {
                    if (typeof node.value === 'string') {
                        var val = node.value.replace(/\\/g, '\\\\');
                        val = val.replace(/"/g, '\\"');
                        val = val.replace(/\n/g, '\\n');
                        val = val.replace(/\r/g, '\\r');
                        val = val.replace(/\t/g, '\\t');
                        this.emit('"' + val + '"');
                    }
                    else if (node.value === null) {
                        this.emit('null');
                    }
                    else {
                        this.emit(node.value.toString());
                    }
                },
                compileSymbol: function (node, frame) {
                    var name = node.value;
                    var v;
                    if ((v = frame.lookup(name))) {
                        this.emit(v);
                    }
                    else {
                        this.emit('runtime.contextOrFrameLookup(' +
                            'context, frame, "' + name + '")');
                    }
                },
                compileGroup: function (node, frame) {
                    this._compileAggregate(node, frame, '(', ')');
                },
                compileArray: function (node, frame) {
                    this._compileAggregate(node, frame, '[', ']');
                },
                compileDict: function (node, frame) {
                    this._compileAggregate(node, frame, '{', '}');
                },
                compilePair: function (node, frame) {
                    var key = node.key;
                    var val = node.value;
                    if (key instanceof nodes_js_3.default.Symbol) {
                        key = new nodes_js_3.default.Literal(key.lineno, key.colno, key.value);
                    }
                    else if (!(key instanceof nodes_js_3.default.Literal &&
                        typeof key.value === 'string')) {
                        this.fail('compilePair: Dict keys must be strings or names', key.lineno, key.colno);
                    }
                    this.compile(key, frame);
                    this.emit(': ');
                    this._compileExpression(val, frame);
                },
                compileInlineIf: function (node, frame) {
                    this.emit('(');
                    this.compile(node.cond, frame);
                    this.emit('?');
                    this.compile(node.body, frame);
                    this.emit(':');
                    if (node.else_ !== null)
                        this.compile(node.else_, frame);
                    else
                        this.emit('""');
                    this.emit(')');
                },
                compileIn: function (node, frame) {
                    this.emit('runtime.inOperator(');
                    this.compile(node.left, frame);
                    this.emit(',');
                    this.compile(node.right, frame);
                    this.emit(')');
                },
                compileOr: binOpEmitter(' || '),
                compileAnd: binOpEmitter(' && '),
                compileAdd: binOpEmitter(' + '),
                // ensure concatenation instead of addition
                // by adding empty string in between
                compileConcat: binOpEmitter(' + "" + '),
                compileSub: binOpEmitter(' - '),
                compileMul: binOpEmitter(' * '),
                compileDiv: binOpEmitter(' / '),
                compileMod: binOpEmitter(' % '),
                compileNot: function (node, frame) {
                    this.emit('!');
                    this.compile(node.target, frame);
                },
                compileFloorDiv: function (node, frame) {
                    this.emit('Math.floor(');
                    this.compile(node.left, frame);
                    this.emit(' / ');
                    this.compile(node.right, frame);
                    this.emit(')');
                },
                compilePow: function (node, frame) {
                    this.emit('Math.pow(');
                    this.compile(node.left, frame);
                    this.emit(', ');
                    this.compile(node.right, frame);
                    this.emit(')');
                },
                compileNeg: function (node, frame) {
                    this.emit('-');
                    this.compile(node.target, frame);
                },
                compilePos: function (node, frame) {
                    this.emit('+');
                    this.compile(node.target, frame);
                },
                compileCompare: function (node, frame) {
                    this.compile(node.expr, frame);
                    for (var i = 0; i < node.ops.length; i++) {
                        var n = node.ops[i];
                        this.emit(' ' + compareOps[n.type] + ' ');
                        this.compile(n.expr, frame);
                    }
                },
                compileLookupVal: function (node, frame) {
                    this.emit('runtime.memberLookup((');
                    this._compileExpression(node.target, frame);
                    this.emit('),');
                    this._compileExpression(node.val, frame);
                    this.emit(')');
                },
                _getNodeName: function (node) {
                    switch (node.typename) {
                        case 'Symbol':
                            return node.value;
                        case 'FunCall':
                            return 'the return value of (' + this._getNodeName(node.name) + ')';
                        case 'LookupVal':
                            return this._getNodeName(node.target) + '["' +
                                this._getNodeName(node.val) + '"]';
                        case 'Literal':
                            return node.value.toString();
                        default:
                            return '--expression--';
                    }
                },
                compileFunCall: function (node, frame) {
                    // Keep track of line/col info at runtime by settings
                    // variables within an expression. An expression in javascript
                    // like (x, y, z) returns the last value, and x and y can be
                    // anything
                    this.emit('(lineno = ' + node.lineno +
                        ', colno = ' + node.colno + ', ');
                    this.emit('runtime.callWrap(');
                    // Compile it as normal.
                    this._compileExpression(node.name, frame);
                    // Output the name of what we're calling so we can get friendly errors
                    // if the lookup fails.
                    this.emit(', "' + this._getNodeName(node.name).replace(/"/g, '\\"') + '", context, ');
                    this._compileAggregate(node.args, frame, '[', '])');
                    this.emit(')');
                },
                compileFilter: function (node, frame) {
                    var name = node.name;
                    this.assertType(name, nodes_js_3.default.Symbol);
                    this.emit('env.getFilter("' + name.value + '").call(context, ');
                    this._compileAggregate(node.args, frame);
                    this.emit(')');
                },
                compileFilterAsync: function (node, frame) {
                    var name = node.name;
                    this.assertType(name, nodes_js_3.default.Symbol);
                    var symbol = node.symbol.value;
                    frame.set(symbol, symbol);
                    this.emit('env.getFilter("' + name.value + '").call(context, ');
                    this._compileAggregate(node.args, frame);
                    this.emitLine(', ' + this.makeCallback(symbol));
                    this.addScopeLevel();
                },
                compileKeywordArgs: function (node, frame) {
                    var names = [];
                    lib_js_6.default.each(node.children, function (pair) {
                        names.push(pair.key.value);
                    });
                    this.emit('runtime.makeKeywordArgs(');
                    this.compileDict(node, frame);
                    this.emit(')');
                },
                compileSet: function (node, frame) {
                    var ids = [];
                    // Lookup the variable names for each identifier and create
                    // new ones if necessary
                    lib_js_6.default.each(node.targets, function (target) {
                        var name = target.value;
                        var id = frame.lookup(name);
                        if (id === null || id === undefined) {
                            id = this.tmpid();
                            // Note: This relies on js allowing scope across
                            // blocks, in case this is created inside an `if`
                            this.emitLine('var ' + id + ';');
                        }
                        ids.push(id);
                    }, this);
                    if (node.value) {
                        this.emit(ids.join(' = ') + ' = ');
                        this._compileExpression(node.value, frame);
                        this.emitLine(';');
                    }
                    else {
                        this.emit(ids.join(' = ') + ' = ');
                        this.compile(node.body, frame);
                        this.emitLine(';');
                    }
                    lib_js_6.default.each(node.targets, function (target, i) {
                        var id = ids[i];
                        var name = target.value;
                        // We are running this for every var, but it's very
                        // uncommon to assign to multiple vars anyway
                        this.emitLine('frame.set("' + name + '", ' + id + ', true);');
                        this.emitLine('if(frame.topLevel) {');
                        this.emitLine('context.setVariable("' + name + '", ' + id + ');');
                        this.emitLine('}');
                        if (name.charAt(0) !== '_') {
                            this.emitLine('if(frame.topLevel) {');
                            this.emitLine('context.addExport("' + name + '", ' + id + ');');
                            this.emitLine('}');
                        }
                    }, this);
                },
                compileIf: function (node, frame, async) {
                    this.emit('if(');
                    this._compileExpression(node.cond, frame);
                    this.emitLine(') {');
                    this.withScopedSyntax(function () {
                        this.compile(node.body, frame);
                        if (async) {
                            this.emit('cb()');
                        }
                    });
                    if (node.else_) {
                        this.emitLine('}\nelse {');
                        this.withScopedSyntax(function () {
                            this.compile(node.else_, frame);
                            if (async) {
                                this.emit('cb()');
                            }
                        });
                    }
                    else if (async) {
                        this.emitLine('}\nelse {');
                        this.emit('cb()');
                    }
                    this.emitLine('}');
                },
                compileIfAsync: function (node, frame) {
                    this.emit('(function(cb) {');
                    this.compileIf(node, frame, true);
                    this.emit('})(' + this.makeCallback());
                    this.addScopeLevel();
                },
                emitLoopBindings: function (node, arr, i, len) {
                    var bindings = {
                        index: i + ' + 1',
                        index0: i,
                        revindex: len + ' - ' + i,
                        revindex0: len + ' - ' + i + ' - 1',
                        first: i + ' === 0',
                        last: i + ' === ' + len + ' - 1',
                        length: len
                    };
                    for (var name in bindings) {
                        this.emitLine('frame.set("loop.' + name + '", ' + bindings[name] + ');');
                    }
                },
                compileFor: function (node, frame) {
                    // Some of this code is ugly, but it keeps the generated code
                    // as fast as possible. ForAsync also shares some of this, but
                    // not much.
                    var v;
                    var i = this.tmpid();
                    var len = this.tmpid();
                    var arr = this.tmpid();
                    frame = frame.push();
                    this.emitLine('frame = frame.push();');
                    this.emit('var ' + arr + ' = ');
                    this._compileExpression(node.arr, frame);
                    this.emitLine(';');
                    this.emit('if(' + arr + ') {');
                    // If multiple names are passed, we need to bind them
                    // appropriately
                    if (node.name instanceof nodes_js_3.default.Array) {
                        this.emitLine('var ' + i + ';');
                        // The object could be an arroy or object. Note that the
                        // body of the loop is duplicated for each condition, but
                        // we are optimizing for speed over size.
                        this.emitLine('if(runtime.isArray(' + arr + ')) {');
                        {
                            this.emitLine('var ' + len + ' = ' + arr + '.length;');
                            this.emitLine('for(' + i + '=0; ' + i + ' < ' + arr + '.length; '
                                + i + '++) {');
                            // Bind each declared var
                            for (var u = 0; u < node.name.children.length; u++) {
                                var tid = this.tmpid();
                                this.emitLine('var ' + tid + ' = ' + arr + '[' + i + '][' + u + ']');
                                this.emitLine('frame.set("' + node.name.children[u].value
                                    + '", ' + arr + '[' + i + '][' + u + ']' + ');');
                                frame.set(node.name.children[u].value, tid);
                            }
                            this.emitLoopBindings(node, arr, i, len);
                            this.withScopedSyntax(function () {
                                this.compile(node.body, frame);
                            });
                            this.emitLine('}');
                        }
                        this.emitLine('} else {');
                        {
                            // Iterate over the key/values of an object
                            var key = node.name.children[0];
                            var val = node.name.children[1];
                            var k = this.tmpid();
                            v = this.tmpid();
                            frame.set(key.value, k);
                            frame.set(val.value, v);
                            this.emitLine(i + ' = -1;');
                            this.emitLine('var ' + len + ' = runtime.keys(' + arr + ').length;');
                            this.emitLine('for(var ' + k + ' in ' + arr + ') {');
                            this.emitLine(i + '++;');
                            this.emitLine('var ' + v + ' = ' + arr + '[' + k + '];');
                            this.emitLine('frame.set("' + key.value + '", ' + k + ');');
                            this.emitLine('frame.set("' + val.value + '", ' + v + ');');
                            this.emitLoopBindings(node, arr, i, len);
                            this.withScopedSyntax(function () {
                                this.compile(node.body, frame);
                            });
                            this.emitLine('}');
                        }
                        this.emitLine('}');
                    }
                    else {
                        // Generate a typical array iteration
                        v = this.tmpid();
                        frame.set(node.name.value, v);
                        this.emitLine('var ' + len + ' = ' + arr + '.length;');
                        this.emitLine('for(var ' + i + '=0; ' + i + ' < ' + arr + '.length; ' +
                            i + '++) {');
                        this.emitLine('var ' + v + ' = ' + arr + '[' + i + '];');
                        this.emitLine('frame.set("' + node.name.value + '", ' + v + ');');
                        this.emitLoopBindings(node, arr, i, len);
                        this.withScopedSyntax(function () {
                            this.compile(node.body, frame);
                        });
                        this.emitLine('}');
                    }
                    this.emitLine('}');
                    if (node.else_) {
                        this.emitLine('if (!' + len + ') {');
                        this.compile(node.else_, frame);
                        this.emitLine('}');
                    }
                    this.emitLine('frame = frame.pop();');
                },
                _compileAsyncLoop: function (node, frame, parallel) {
                    // This shares some code with the For tag, but not enough to
                    // worry about. This iterates across an object asynchronously,
                    // but not in parallel.
                    var i = this.tmpid();
                    var len = this.tmpid();
                    var arr = this.tmpid();
                    var asyncMethod = parallel ? 'asyncAll' : 'asyncEach';
                    frame = frame.push();
                    this.emitLine('frame = frame.push();');
                    this.emit('var ' + arr + ' = ');
                    this._compileExpression(node.arr, frame);
                    this.emitLine(';');
                    if (node.name instanceof nodes_js_3.default.Array) {
                        this.emit('runtime.' + asyncMethod + '(' + arr + ', ' +
                            node.name.children.length + ', function(');
                        lib_js_6.default.each(node.name.children, function (name) {
                            this.emit(name.value + ',');
                        }, this);
                        this.emit(i + ',' + len + ',next) {');
                        lib_js_6.default.each(node.name.children, function (name) {
                            var id = name.value;
                            frame.set(id, id);
                            this.emitLine('frame.set("' + id + '", ' + id + ');');
                        }, this);
                    }
                    else {
                        var id = node.name.value;
                        this.emitLine('runtime.' + asyncMethod + '(' + arr + ', 1, function(' + id + ', ' + i + ', ' + len + ',next) {');
                        this.emitLine('frame.set("' + id + '", ' + id + ');');
                        frame.set(id, id);
                    }
                    this.emitLoopBindings(node, arr, i, len);
                    this.withScopedSyntax(function () {
                        var buf;
                        if (parallel) {
                            buf = this.tmpid();
                            this.pushBufferId(buf);
                        }
                        this.compile(node.body, frame);
                        this.emitLine('next(' + i + (buf ? ',' + buf : '') + ');');
                        if (parallel) {
                            this.popBufferId();
                        }
                    });
                    var output = this.tmpid();
                    this.emitLine('}, ' + this.makeCallback(output));
                    this.addScopeLevel();
                    if (parallel) {
                        this.emitLine(this.buffer + ' += ' + output + ';');
                    }
                    if (node.else_) {
                        this.emitLine('if (!' + arr + '.length) {');
                        this.compile(node.else_, frame);
                        this.emitLine('}');
                    }
                    this.emitLine('frame = frame.pop();');
                },
                compileAsyncEach: function (node, frame) {
                    this._compileAsyncLoop(node, frame);
                },
                compileAsyncAll: function (node, frame) {
                    this._compileAsyncLoop(node, frame, true);
                },
                _compileMacro: function (node, frame) {
                    var args = [];
                    var kwargs = null;
                    var funcId = 'macro_' + this.tmpid();
                    var keepFrame = (frame !== undefined);
                    // Type check the definition of the args
                    lib_js_6.default.each(node.args.children, function (arg, i) {
                        if (i === node.args.children.length - 1 &&
                            arg instanceof nodes_js_3.default.Dict) {
                            kwargs = arg;
                        }
                        else {
                            this.assertType(arg, nodes_js_3.default.Symbol);
                            args.push(arg);
                        }
                    }, this);
                    var realNames = lib_js_6.default.map(args, function (n) { return 'l_' + n.value; });
                    realNames.push('kwargs');
                    // Quoted argument names
                    var argNames = lib_js_6.default.map(args, function (n) { return '"' + n.value + '"'; });
                    var kwargNames = lib_js_6.default.map((kwargs && kwargs.children) || [], function (n) { return '"' + n.key.value + '"'; });
                    // We pass a function to makeMacro which destructures the
                    // arguments so support setting positional args with keywords
                    // args and passing keyword args as positional args
                    // (essentially default values). See runtime.js.
                    if (keepFrame) {
                        frame = frame.push(true);
                    }
                    else {
                        frame = new Frame();
                    }
                    this.emitLines('var ' + funcId + ' = runtime.makeMacro(', '[' + argNames.join(', ') + '], ', '[' + kwargNames.join(', ') + '], ', 'function (' + realNames.join(', ') + ') {', 'var callerFrame = frame;', 'frame = ' + ((keepFrame) ? 'frame.push(true);' : 'new runtime.Frame();'), 'kwargs = kwargs || {};', 'if (kwargs.hasOwnProperty("caller")) {', 'frame.set("caller", kwargs.caller); }');
                    // Expose the arguments to the template. Don't need to use
                    // random names because the function
                    // will create a new run-time scope for us
                    lib_js_6.default.each(args, function (arg) {
                        this.emitLine('frame.set("' + arg.value + '", ' +
                            'l_' + arg.value + ');');
                        frame.set(arg.value, 'l_' + arg.value);
                    }, this);
                    // Expose the keyword arguments
                    if (kwargs) {
                        lib_js_6.default.each(kwargs.children, function (pair) {
                            var name = pair.key.value;
                            this.emit('frame.set("' + name + '", ' +
                                'kwargs.hasOwnProperty("' + name + '") ? ' +
                                'kwargs["' + name + '"] : ');
                            this._compileExpression(pair.value, frame);
                            this.emitLine(');');
                        }, this);
                    }
                    var bufferId = this.tmpid();
                    this.pushBufferId(bufferId);
                    this.withScopedSyntax(function () {
                        this.compile(node.body, frame);
                    });
                    this.emitLine('frame = ' + ((keepFrame) ? 'frame.pop();' : 'callerFrame;'));
                    this.emitLine('return new runtime.SafeString(' + bufferId + ');');
                    this.emitLine('});');
                    this.popBufferId();
                    return funcId;
                },
                compileMacro: function (node, frame) {
                    var funcId = this._compileMacro(node);
                    // Expose the macro to the templates
                    var name = node.name.value;
                    frame.set(name, funcId);
                    if (frame.parent) {
                        this.emitLine('frame.set("' + name + '", ' + funcId + ');');
                    }
                    else {
                        if (node.name.value.charAt(0) !== '_') {
                            this.emitLine('context.addExport("' + name + '");');
                        }
                        this.emitLine('context.setVariable("' + name + '", ' + funcId + ');');
                    }
                },
                compileCaller: function (node, frame) {
                    // basically an anonymous "macro expression"
                    this.emit('(function (){');
                    var funcId = this._compileMacro(node, frame);
                    this.emit('return ' + funcId + ';})()');
                },
                compileImport: function (node, frame) {
                    var id = this.tmpid();
                    var target = node.target.value;
                    this.emit('env.getTemplate(');
                    this._compileExpression(node.template, frame);
                    this.emitLine(', false, ' + this._templateName() + ', false, ' + this.makeCallback(id));
                    this.addScopeLevel();
                    this.emitLine(id + '.getExported(' +
                        (node.withContext ? 'context.getVariables(), frame, ' : '') +
                        this.makeCallback(id));
                    this.addScopeLevel();
                    frame.set(target, id);
                    if (frame.parent) {
                        this.emitLine('frame.set("' + target + '", ' + id + ');');
                    }
                    else {
                        this.emitLine('context.setVariable("' + target + '", ' + id + ');');
                    }
                },
                compileFromImport: function (node, frame) {
                    var importedId = this.tmpid();
                    this.emit('env.getTemplate(');
                    this._compileExpression(node.template, frame);
                    this.emitLine(', false, ' + this._templateName() + ', false, ' + this.makeCallback(importedId));
                    this.addScopeLevel();
                    this.emitLine(importedId + '.getExported(' +
                        (node.withContext ? 'context.getVariables(), frame, ' : '') +
                        this.makeCallback(importedId));
                    this.addScopeLevel();
                    lib_js_6.default.each(node.names.children, function (nameNode) {
                        var name;
                        var alias;
                        var id = this.tmpid();
                        if (nameNode instanceof nodes_js_3.default.Pair) {
                            name = nameNode.key.value;
                            alias = nameNode.value.value;
                        }
                        else {
                            name = nameNode.value;
                            alias = name;
                        }
                        this.emitLine('if(' + importedId + '.hasOwnProperty("' + name + '")) {');
                        this.emitLine('var ' + id + ' = ' + importedId + '.' + name + ';');
                        this.emitLine('} else {');
                        this.emitLine('cb(new Error("cannot import \'' + name + '\'")); return;');
                        this.emitLine('}');
                        frame.set(alias, id);
                        if (frame.parent) {
                            this.emitLine('frame.set("' + alias + '", ' + id + ');');
                        }
                        else {
                            this.emitLine('context.setVariable("' + alias + '", ' + id + ');');
                        }
                    }, this);
                },
                compileBlock: function (node) {
                    var id = this.tmpid();
                    // If we are executing outside a block (creating a top-level
                    // block), we really don't want to execute its code because it
                    // will execute twice: once when the child template runs and
                    // again when the parent template runs. Note that blocks
                    // within blocks will *always* execute immediately *and*
                    // wherever else they are invoked (like used in a parent
                    // template). This may have behavioral differences from jinja
                    // because blocks can have side effects, but it seems like a
                    // waste of performance to always execute huge top-level
                    // blocks twice
                    if (!this.inBlock) {
                        this.emit('(parentTemplate ? function(e, c, f, r, cb) { cb(""); } : ');
                    }
                    this.emit('context.getBlock("' + node.name.value + '")');
                    if (!this.inBlock) {
                        this.emit(')');
                    }
                    this.emitLine('(env, context, frame, runtime, ' + this.makeCallback(id));
                    this.emitLine(this.buffer + ' += ' + id + ';');
                    this.addScopeLevel();
                },
                compileSuper: function (node, frame) {
                    var name = node.blockName.value;
                    var id = node.symbol.value;
                    this.emitLine('context.getSuper(env, ' +
                        '"' + name + '", ' +
                        'b_' + name + ', ' +
                        'frame, runtime, ' +
                        this.makeCallback(id));
                    this.emitLine(id + ' = runtime.markSafe(' + id + ');');
                    this.addScopeLevel();
                    frame.set(id, id);
                },
                compileExtends: function (node, frame) {
                    var k = this.tmpid();
                    this.emit('env.getTemplate(');
                    this._compileExpression(node.template, frame);
                    this.emitLine(', true, ' + this._templateName() + ', false, ' + this.makeCallback('_parentTemplate'));
                    // extends is a dynamic tag and can occur within a block like
                    // `if`, so if this happens we need to capture the parent
                    // template in the top-level scope
                    this.emitLine('parentTemplate = _parentTemplate');
                    this.emitLine('for(var ' + k + ' in parentTemplate.blocks) {');
                    this.emitLine('context.addBlock(' + k +
                        ', parentTemplate.blocks[' + k + ']);');
                    this.emitLine('}');
                    this.addScopeLevel();
                },
                compileInclude: function (node, frame) {
                    var id = this.tmpid();
                    var id2 = this.tmpid();
                    this.emitLine('var tasks = [];');
                    this.emitLine('tasks.push(');
                    this.emitLine('function(callback) {');
                    this.emit('env.getTemplate(');
                    this._compileExpression(node.template, frame);
                    this.emitLine(', false, ' + this._templateName() + ', ' + node.ignoreMissing + ', ' + this.makeCallback(id));
                    this.emitLine('callback(null,' + id + ');});');
                    this.emitLine('});');
                    this.emitLine('tasks.push(');
                    this.emitLine('function(template, callback){');
                    this.emitLine('template.render(' +
                        'context.getVariables(), frame, ' + this.makeCallback(id2));
                    this.emitLine('callback(null,' + id2 + ');});');
                    this.emitLine('});');
                    this.emitLine('tasks.push(');
                    this.emitLine('function(result, callback){');
                    this.emitLine(this.buffer + ' += result;');
                    this.emitLine('callback(null);');
                    this.emitLine('});');
                    this.emitLine('env.waterfall(tasks, function(){');
                    this.addScopeLevel();
                },
                compileTemplateData: function (node, frame) {
                    this.compileLiteral(node, frame);
                },
                compileCapture: function (node, frame) {
                    // we need to temporarily override the current buffer id as 'output'
                    // so the set block writes to the capture output instead of the buffer
                    var buffer = this.buffer;
                    this.buffer = 'output';
                    this.emitLine('(function() {');
                    this.emitLine('var output = "";');
                    this.withScopedSyntax(function () {
                        this.compile(node.body, frame);
                    });
                    this.emitLine('return output;');
                    this.emitLine('})()');
                    // and of course, revert back to the old buffer id
                    this.buffer = buffer;
                },
                compileOutput: function (node, frame) {
                    var children = node.children;
                    for (var i = 0, l = children.length; i < l; i++) {
                        // TemplateData is a special case because it is never
                        // autoescaped, so simply output it for optimization
                        if (children[i] instanceof nodes_js_3.default.TemplateData) {
                            if (children[i].value) {
                                this.emit(this.buffer + ' += ');
                                this.compileLiteral(children[i], frame);
                                this.emitLine(';');
                            }
                        }
                        else {
                            this.emit(this.buffer + ' += runtime.suppressValue(');
                            if (this.throwOnUndefined) {
                                this.emit('runtime.ensureDefined(');
                            }
                            this.compile(children[i], frame);
                            if (this.throwOnUndefined) {
                                this.emit(',' + node.lineno + ',' + node.colno + ')');
                            }
                            this.emit(', env.opts.autoescape);\n');
                        }
                    }
                },
                compileRoot: function (node, frame) {
                    if (frame) {
                        this.fail('compileRoot: root node can\'t have frame');
                    }
                    frame = new Frame();
                    this.emitFuncBegin('root');
                    this.emitLine('var parentTemplate = null;');
                    this._compileChildren(node, frame);
                    this.emitLine('if(parentTemplate) {');
                    this.emitLine('parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);');
                    this.emitLine('} else {');
                    this.emitLine('cb(null, ' + this.buffer + ');');
                    this.emitLine('}');
                    this.emitFuncEnd(true);
                    this.inBlock = true;
                    var blockNames = [];
                    var i, name, block, blocks = node.findAll(nodes_js_3.default.Block);
                    for (i = 0; i < blocks.length; i++) {
                        block = blocks[i];
                        name = block.name.value;
                        if (blockNames.indexOf(name) !== -1) {
                            throw new Error('Block "' + name + '" defined more than once.');
                        }
                        blockNames.push(name);
                        this.emitFuncBegin('b_' + name);
                        var tmpFrame = new Frame();
                        this.emitLine('var frame = frame.push(true);');
                        this.compile(block.body, tmpFrame);
                        this.emitFuncEnd();
                    }
                    this.emitLine('return {');
                    for (i = 0; i < blocks.length; i++) {
                        block = blocks[i];
                        name = 'b_' + block.name.value;
                        this.emitLine(name + ': ' + name + ',');
                    }
                    this.emitLine('root: root\n};');
                },
                compile: function (node, frame) {
                    var _compile = this['compile' + node.typename];
                    if (_compile) {
                        _compile.call(this, node, frame);
                    }
                    else {
                        this.fail('compile: Cannot compile node: ' + node.typename, node.lineno, node.colno);
                    }
                },
                getCode: function () {
                    return this.codebuf.join('');
                }
            });
            exports_25("default", {
                compile: function (src, asyncFilters, extensions, name, opts) {
                    var c = new Compiler(name, opts.throwOnUndefined);
                    // Run the extension preprocessors against the source.
                    if (extensions && extensions.length) {
                        for (var i = 0; i < extensions.length; i++) {
                            if ('preprocess' in extensions[i]) {
                                src = extensions[i].preprocess(src, name);
                            }
                        }
                    }
                    c.compile(transformer_js_1.default.transform(parser_js_1.default.parse(src, extensions, opts), asyncFilters, name));
                    return c.getCode();
                },
                Compiler: Compiler
            });
        }
    };
});
System.register("file:///home/main/Desktop/denjucks/v4/src/filters", ["file:///home/main/Desktop/denjucks/v4/src/lib", "file:///home/main/Desktop/denjucks/v4/src/runtime"], function (exports_26, context_26) {
    'use strict';
    var lib_js_7, runtime_js_2, filters;
    var __moduleName = context_26 && context_26.id;
    function normalize(value, defaultValue) {
        if (value === null || value === undefined || value === false) {
            return defaultValue;
        }
        return value;
    }
    return {
        setters: [
            function (lib_js_7_1) {
                lib_js_7 = lib_js_7_1;
            },
            function (runtime_js_2_1) {
                runtime_js_2 = runtime_js_2_1;
            }
        ],
        execute: function () {
            filters = {
                abs: Math.abs,
                batch: function (arr, linecount, fill_with) {
                    var i;
                    var res = [];
                    var tmp = [];
                    for (i = 0; i < arr.length; i++) {
                        if (i % linecount === 0 && tmp.length) {
                            res.push(tmp);
                            tmp = [];
                        }
                        tmp.push(arr[i]);
                    }
                    if (tmp.length) {
                        if (fill_with) {
                            for (i = tmp.length; i < linecount; i++) {
                                tmp.push(fill_with);
                            }
                        }
                        res.push(tmp);
                    }
                    return res;
                },
                capitalize: function (str) {
                    str = normalize(str, '');
                    var ret = str.toLowerCase();
                    return runtime_js_2.default.copySafeness(str, ret.charAt(0).toUpperCase() + ret.slice(1));
                },
                center: function (str, width) {
                    str = normalize(str, '');
                    width = width || 80;
                    if (str.length >= width) {
                        return str;
                    }
                    var spaces = width - str.length;
                    var pre = lib_js_7.default.repeat(' ', spaces / 2 - spaces % 2);
                    var post = lib_js_7.default.repeat(' ', spaces / 2);
                    return runtime_js_2.default.copySafeness(str, pre + str + post);
                },
                'default': function (val, def, bool) {
                    if (bool) {
                        return val ? val : def;
                    }
                    else {
                        return (val !== undefined) ? val : def;
                    }
                },
                dictsort: function (val, case_sensitive, by) {
                    if (!lib_js_7.default.isObject(val)) {
                        throw new lib_js_7.default.TemplateError('dictsort filter: val must be an object');
                    }
                    var array = [];
                    for (var k in val) {
                        // deliberately include properties from the object's prototype
                        array.push([k, val[k]]);
                    }
                    var si;
                    if (by === undefined || by === 'key') {
                        si = 0;
                    }
                    else if (by === 'value') {
                        si = 1;
                    }
                    else {
                        throw new lib_js_7.default.TemplateError('dictsort filter: You can only sort by either key or value');
                    }
                    array.sort(function (t1, t2) {
                        var a = t1[si];
                        var b = t2[si];
                        if (!case_sensitive) {
                            if (lib_js_7.default.isString(a)) {
                                a = a.toUpperCase();
                            }
                            if (lib_js_7.default.isString(b)) {
                                b = b.toUpperCase();
                            }
                        }
                        return a > b ? 1 : (a === b ? 0 : -1);
                    });
                    return array;
                },
                dump: function (obj, spaces) {
                    return JSON.stringify(obj, null, spaces);
                },
                escape: function (str) {
                    if (str instanceof runtime_js_2.default.SafeString) {
                        return str;
                    }
                    str = (str === null || str === undefined) ? '' : str;
                    return runtime_js_2.default.markSafe(lib_js_7.default.escape(str.toString()));
                },
                safe: function (str) {
                    if (str instanceof runtime_js_2.default.SafeString) {
                        return str;
                    }
                    str = (str === null || str === undefined) ? '' : str;
                    return runtime_js_2.default.markSafe(str.toString());
                },
                first: function (arr) {
                    return arr[0];
                },
                groupby: function (arr, attr) {
                    return lib_js_7.default.groupBy(arr, attr);
                },
                indent: function (str, width, indentfirst) {
                    str = normalize(str, '');
                    if (str === '')
                        return '';
                    width = width || 4;
                    var res = '';
                    var lines = str.split('\n');
                    var sp = lib_js_7.default.repeat(' ', width);
                    for (var i = 0; i < lines.length; i++) {
                        if (i === 0 && !indentfirst) {
                            res += lines[i] + '\n';
                        }
                        else {
                            res += sp + lines[i] + '\n';
                        }
                    }
                    return runtime_js_2.default.copySafeness(str, res);
                },
                join: function (arr, del, attr) {
                    del = del || '';
                    if (attr) {
                        arr = lib_js_7.default.map(arr, function (v) {
                            return v[attr];
                        });
                    }
                    return arr.join(del);
                },
                last: function (arr) {
                    return arr[arr.length - 1];
                },
                length: function (val) {
                    var value = normalize(val, '');
                    if (value !== undefined) {
                        if ((typeof Map === 'function' && value instanceof Map) ||
                            (typeof Set === 'function' && value instanceof Set)) {
                            // ECMAScript 2015 Maps and Sets
                            return value.size;
                        }
                        if (lib_js_7.default.isObject(value) && !(value instanceof runtime_js_2.default.SafeString)) {
                            // Objects (besides SafeStrings), non-primative Arrays
                            return Object.keys(value).length;
                        }
                        return value.length;
                    }
                    return 0;
                },
                list: function (val) {
                    if (lib_js_7.default.isString(val)) {
                        return val.split('');
                    }
                    else if (lib_js_7.default.isObject(val)) {
                        var keys = [];
                        if (Object.keys) {
                            keys = Object.keys(val);
                        }
                        else {
                            for (var k in val) {
                                keys.push(k);
                            }
                        }
                        return lib_js_7.default.map(keys, function (k) {
                            return { key: k,
                                value: val[k] };
                        });
                    }
                    else if (lib_js_7.default.isArray(val)) {
                        return val;
                    }
                    else {
                        throw new lib_js_7.default.TemplateError('list filter: type not iterable');
                    }
                },
                lower: function (str) {
                    str = normalize(str, '');
                    return str.toLowerCase();
                },
                nl2br: function (str) {
                    if (str === null || str === undefined) {
                        return '';
                    }
                    return runtime_js_2.default.copySafeness(str, str.replace(/\r\n|\n/g, '<br />\n'));
                },
                random: function (arr) {
                    return arr[Math.floor(Math.random() * arr.length)];
                },
                rejectattr: function (arr, attr) {
                    return arr.filter(function (item) {
                        return !item[attr];
                    });
                },
                selectattr: function (arr, attr) {
                    return arr.filter(function (item) {
                        return !!item[attr];
                    });
                },
                replace: function (str, old, new_, maxCount) {
                    var originalStr = str;
                    if (old instanceof RegExp) {
                        return str.replace(old, new_);
                    }
                    if (typeof maxCount === 'undefined') {
                        maxCount = -1;
                    }
                    var res = ''; // Output
                    // Cast Numbers in the search term to string
                    if (typeof old === 'number') {
                        old = old + '';
                    }
                    else if (typeof old !== 'string') {
                        // If it is something other than number or string,
                        // return the original string
                        return str;
                    }
                    // Cast numbers in the replacement to string
                    if (typeof str === 'number') {
                        str = str + '';
                    }
                    // If by now, we don't have a string, throw it back
                    if (typeof str !== 'string' && !(str instanceof runtime_js_2.default.SafeString)) {
                        return str;
                    }
                    // ShortCircuits
                    if (old === '') {
                        // Mimic the python behaviour: empty string is replaced
                        // by replacement e.g. "abc"|replace("", ".") -> .a.b.c.
                        res = new_ + str.split('').join(new_) + new_;
                        return runtime_js_2.default.copySafeness(str, res);
                    }
                    var nextIndex = str.indexOf(old);
                    // if # of replacements to perform is 0, or the string to does
                    // not contain the old value, return the string
                    if (maxCount === 0 || nextIndex === -1) {
                        return str;
                    }
                    var pos = 0;
                    var count = 0; // # of replacements made
                    while (nextIndex > -1 && (maxCount === -1 || count < maxCount)) {
                        // Grab the next chunk of src string and add it with the
                        // replacement, to the result
                        res += str.substring(pos, nextIndex) + new_;
                        // Increment our pointer in the src string
                        pos = nextIndex + old.length;
                        count++;
                        // See if there are any more replacements to be made
                        nextIndex = str.indexOf(old, pos);
                    }
                    // We've either reached the end, or done the max # of
                    // replacements, tack on any remaining string
                    if (pos < str.length) {
                        res += str.substring(pos);
                    }
                    return runtime_js_2.default.copySafeness(originalStr, res);
                },
                reverse: function (val) {
                    var arr;
                    if (lib_js_7.default.isString(val)) {
                        arr = filters.list(val);
                    }
                    else {
                        // Copy it
                        arr = lib_js_7.default.map(val, function (v) { return v; });
                    }
                    arr.reverse();
                    if (lib_js_7.default.isString(val)) {
                        return runtime_js_2.default.copySafeness(val, arr.join(''));
                    }
                    return arr;
                },
                round: function (val, precision, method) {
                    precision = precision || 0;
                    var factor = Math.pow(10, precision);
                    var rounder;
                    if (method === 'ceil') {
                        rounder = Math.ceil;
                    }
                    else if (method === 'floor') {
                        rounder = Math.floor;
                    }
                    else {
                        rounder = Math.round;
                    }
                    return rounder(val * factor) / factor;
                },
                slice: function (arr, slices, fillWith) {
                    var sliceLength = Math.floor(arr.length / slices);
                    var extra = arr.length % slices;
                    var offset = 0;
                    var res = [];
                    for (var i = 0; i < slices; i++) {
                        var start = offset + i * sliceLength;
                        if (i < extra) {
                            offset++;
                        }
                        var end = offset + (i + 1) * sliceLength;
                        var slice = arr.slice(start, end);
                        if (fillWith && i >= extra) {
                            slice.push(fillWith);
                        }
                        res.push(slice);
                    }
                    return res;
                },
                sum: function (arr, attr, start) {
                    var sum = 0;
                    if (typeof start === 'number') {
                        sum += start;
                    }
                    if (attr) {
                        arr = lib_js_7.default.map(arr, function (v) {
                            return v[attr];
                        });
                    }
                    for (var i = 0; i < arr.length; i++) {
                        sum += arr[i];
                    }
                    return sum;
                },
                sort: runtime_js_2.default.makeMacro(['value', 'reverse', 'case_sensitive', 'attribute'], [], function (arr, reverse, caseSens, attr) {
                    // Copy it
                    arr = lib_js_7.default.map(arr, function (v) { return v; });
                    arr.sort(function (a, b) {
                        var x, y;
                        if (attr) {
                            x = a[attr];
                            y = b[attr];
                        }
                        else {
                            x = a;
                            y = b;
                        }
                        if (!caseSens && lib_js_7.default.isString(x) && lib_js_7.default.isString(y)) {
                            x = x.toLowerCase();
                            y = y.toLowerCase();
                        }
                        if (x < y) {
                            return reverse ? 1 : -1;
                        }
                        else if (x > y) {
                            return reverse ? -1 : 1;
                        }
                        else {
                            return 0;
                        }
                    });
                    return arr;
                }),
                string: function (obj) {
                    return runtime_js_2.default.copySafeness(obj, obj);
                },
                striptags: function (input, preserve_linebreaks) {
                    input = normalize(input, '');
                    preserve_linebreaks = preserve_linebreaks || false;
                    var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>|<!--[\s\S]*?-->/gi;
                    var trimmedInput = filters.trim(input.replace(tags, ''));
                    var res = '';
                    if (preserve_linebreaks) {
                        res = trimmedInput
                            .replace(/^ +| +$/gm, '') // remove leading and trailing spaces
                            .replace(/ +/g, ' ') // squash adjacent spaces
                            .replace(/(\r\n)/g, '\n') // normalize linebreaks (CRLF -> LF)
                            .replace(/\n\n\n+/g, '\n\n'); // squash abnormal adjacent linebreaks
                    }
                    else {
                        res = trimmedInput.replace(/\s+/gi, ' ');
                    }
                    return runtime_js_2.default.copySafeness(input, res);
                },
                title: function (str) {
                    str = normalize(str, '');
                    var words = str.split(' ');
                    for (var i = 0; i < words.length; i++) {
                        words[i] = filters.capitalize(words[i]);
                    }
                    return runtime_js_2.default.copySafeness(str, words.join(' '));
                },
                trim: function (str) {
                    return runtime_js_2.default.copySafeness(str, str.replace(/^\s*|\s*$/g, ''));
                },
                truncate: function (input, length, killwords, end) {
                    var orig = input;
                    input = normalize(input, '');
                    length = length || 255;
                    if (input.length <= length)
                        return input;
                    if (killwords) {
                        input = input.substring(0, length);
                    }
                    else {
                        var idx = input.lastIndexOf(' ', length);
                        if (idx === -1) {
                            idx = length;
                        }
                        input = input.substring(0, idx);
                    }
                    input += (end !== undefined && end !== null) ? end : '...';
                    return runtime_js_2.default.copySafeness(orig, input);
                },
                upper: function (str) {
                    str = normalize(str, '');
                    return str.toUpperCase();
                },
                urlencode: function (obj) {
                    var enc = encodeURIComponent;
                    if (lib_js_7.default.isString(obj)) {
                        return enc(obj);
                    }
                    else {
                        var parts;
                        if (lib_js_7.default.isArray(obj)) {
                            parts = obj.map(function (item) {
                                return enc(item[0]) + '=' + enc(item[1]);
                            });
                        }
                        else {
                            parts = [];
                            for (var k in obj) {
                                if (obj.hasOwnProperty(k)) {
                                    parts.push(enc(k) + '=' + enc(obj[k]));
                                }
                            }
                        }
                        return parts.join('&');
                    }
                },
                urlize: function (str, length, nofollow) {
                    if (isNaN(length))
                        length = Infinity;
                    var noFollowAttr = (nofollow === true ? ' rel="nofollow"' : '');
                    // For the jinja regexp, see
                    // https://github.com/mitsuhiko/jinja2/blob/f15b814dcba6aa12bc74d1f7d0c881d55f7126be/jinja2/utils.py#L20-L23
                    var puncRE = /^(?:\(|<|&lt;)?(.*?)(?:\.|,|\)|\n|&gt;)?$/;
                    // from http://blog.gerv.net/2011/05/html5_email_address_regexp/
                    var emailRE = /^[\w.!#$%&'*+\-\/=?\^`{|}~]+@[a-z\d\-]+(\.[a-z\d\-]+)+$/i;
                    var httpHttpsRE = /^https?:\/\/.*$/;
                    var wwwRE = /^www\./;
                    var tldRE = /\.(?:org|net|com)(?:\:|\/|$)/;
                    var words = str.split(/(\s+)/).filter(function (word) {
                        // If the word has no length, bail. This can happen for str with
                        // trailing whitespace.
                        return word && word.length;
                    }).map(function (word) {
                        var matches = word.match(puncRE);
                        var possibleUrl = matches && matches[1] || word;
                        // url that starts with http or https
                        if (httpHttpsRE.test(possibleUrl))
                            return '<a href="' + possibleUrl + '"' + noFollowAttr + '>' + possibleUrl.substr(0, length) + '</a>';
                        // url that starts with www.
                        if (wwwRE.test(possibleUrl))
                            return '<a href="http://' + possibleUrl + '"' + noFollowAttr + '>' + possibleUrl.substr(0, length) + '</a>';
                        // an email address of the form username@domain.tld
                        if (emailRE.test(possibleUrl))
                            return '<a href="mailto:' + possibleUrl + '">' + possibleUrl + '</a>';
                        // url that ends in .com, .org or .net that is not an email address
                        if (tldRE.test(possibleUrl))
                            return '<a href="http://' + possibleUrl + '"' + noFollowAttr + '>' + possibleUrl.substr(0, length) + '</a>';
                        return word;
                    });
                    return words.join('');
                },
                wordcount: function (str) {
                    str = normalize(str, '');
                    var words = (str) ? str.match(/\w+/g) : null;
                    return (words) ? words.length : null;
                },
                'float': function (val, def) {
                    var res = parseFloat(val);
                    return isNaN(res) ? def : res;
                },
                'int': function (val, def) {
                    var res = parseInt(val, 10);
                    return isNaN(res) ? def : res;
                }
            };
            // Aliases
            filters.d = filters['default'];
            filters.e = filters.escape;
            exports_26("default", filters);
        }
    };
});
System.register("file:///home/main/Desktop/denjucks/v4/src/loader", ["https://deno.land/std/path/mod", "file:///home/main/Desktop/denjucks/v4/src/object", "file:///home/main/Desktop/denjucks/v4/src/lib"], function (exports_27, context_27) {
    'use strict';
    var path, object_js_5, lib_js_8, Loader;
    var __moduleName = context_27 && context_27.id;
    return {
        setters: [
            function (path_1) {
                path = path_1;
            },
            function (object_js_5_1) {
                object_js_5 = object_js_5_1;
            },
            function (lib_js_8_1) {
                lib_js_8 = lib_js_8_1;
            }
        ],
        execute: function () {
            Loader = object_js_5.default.extend({
                on: function (name, func) {
                    this.listeners = this.listeners || {};
                    this.listeners[name] = this.listeners[name] || [];
                    this.listeners[name].push(func);
                },
                emit: function (name /*, arg1, arg2, ...*/) {
                    var args = Array.prototype.slice.call(arguments, 1);
                    if (this.listeners && this.listeners[name]) {
                        lib_js_8.default.each(this.listeners[name], function (listener) {
                            listener.apply(null, args);
                        });
                    }
                },
                resolve: function (from, to) {
                    return path.resolve(path.dirname(from), to);
                },
                isRelative: function (filename) {
                    return (filename.indexOf('./') === 0 || filename.indexOf('../') === 0);
                }
            });
            exports_27("default", Loader);
        }
    };
});
System.register("file:///home/main/Desktop/denjucks/v4/src/precompiled-loader", ["file:///home/main/Desktop/denjucks/v4/src/loader"], function (exports_28, context_28) {
    'use strict';
    var loader_js_1, PrecompiledLoader;
    var __moduleName = context_28 && context_28.id;
    return {
        setters: [
            function (loader_js_1_1) {
                loader_js_1 = loader_js_1_1;
            }
        ],
        execute: function () {
            PrecompiledLoader = loader_js_1.default.extend({
                init: function (compiledTemplates) {
                    this.precompiled = compiledTemplates || {};
                },
                getSource: function (name) {
                    if (this.precompiled[name]) {
                        return {
                            src: { type: 'code',
                                obj: this.precompiled[name] },
                            path: name
                        };
                    }
                    return null;
                }
            });
            exports_28("default", PrecompiledLoader);
        }
    };
});
System.register("file:///home/main/Desktop/denjucks/v4/src/node-loaders", ["https://deno.land/std/path/mod", "file:///home/main/Desktop/denjucks/v4/src/lib", "file:///home/main/Desktop/denjucks/v4/src/loader", "file:///home/main/Desktop/denjucks/v4/src/precompiled-loader"], function (exports_29, context_29) {
    'use strict';
    var path, lib_js_9, loader_js_2, precompiled_loader_js_1, FileSystemLoader;
    var __moduleName = context_29 && context_29.id;
    function existsSync(p) {
        try {
            Deno.statSync(p);
            return true;
        }
        catch (e) {
            return false;
        }
    }
    return {
        setters: [
            function (path_2) {
                path = path_2;
            },
            function (lib_js_9_1) {
                lib_js_9 = lib_js_9_1;
            },
            function (loader_js_2_1) {
                loader_js_2 = loader_js_2_1;
            },
            function (precompiled_loader_js_1_1) {
                precompiled_loader_js_1 = precompiled_loader_js_1_1;
            }
        ],
        execute: function () {
            FileSystemLoader = loader_js_2.default.extend({
                init: function (searchPaths, opts) {
                    if (typeof opts === 'boolean') {
                        console.log('[nunjucks] Warning: you passed a boolean as the second ' +
                            'argument to FileSystemLoader, but it now takes an options ' +
                            'object. See http://mozilla.github.io/nunjucks/api.html#filesystemloader');
                    }
                    opts = opts || {};
                    this.pathsToNames = {};
                    this.noCache = !!opts.noCache;
                    if (searchPaths) {
                        searchPaths = lib_js_9.default.isArray(searchPaths) ? searchPaths : [searchPaths];
                        // For windows, convert to forward slashes
                        this.searchPaths = searchPaths.map(path.normalize);
                    }
                    else {
                        this.searchPaths = ['.'];
                    }
                },
                getSource: function (name) {
                    var fullpath = null;
                    var paths = this.searchPaths;
                    for (var i = 0; i < paths.length; i++) {
                        var basePath = path.resolve(paths[i]);
                        var p = path.resolve(paths[i], name);
                        // Only allow the current directory and anything
                        // underneath it to be searched
                        if (p.indexOf(basePath) === 0 && existsSync(p)) {
                            fullpath = p;
                            break;
                        }
                    }
                    if (!fullpath) {
                        return null;
                    }
                    this.pathsToNames[fullpath] = name;
                    var decoder = new TextDecoder("utf-8");
                    return { src: decoder.decode(Deno.readFileSync(fullpath)),
                        path: fullpath,
                        noCache: this.noCache };
                }
            });
            exports_29("default", {
                FileSystemLoader: FileSystemLoader,
                PrecompiledLoader: precompiled_loader_js_1.default
            });
        }
    };
});
System.register("file:///home/main/Desktop/denjucks/v4/src/loaders", ["file:///home/main/Desktop/denjucks/v4/src/node-loaders"], function (exports_30, context_30) {
    "use strict";
    var node_loaders_js_1;
    var __moduleName = context_30 && context_30.id;
    return {
        setters: [
            function (node_loaders_js_1_1) {
                node_loaders_js_1 = node_loaders_js_1_1;
            }
        ],
        execute: function () {
            exports_30("default", node_loaders_js_1.default);
        }
    };
});
System.register("file:///home/main/Desktop/denjucks/v4/src/globals", [], function (exports_31, context_31) {
    'use strict';
    var __moduleName = context_31 && context_31.id;
    function cycler(items) {
        var index = -1;
        return {
            current: null,
            reset: function () {
                index = -1;
                this.current = null;
            },
            next: function () {
                index++;
                if (index >= items.length) {
                    index = 0;
                }
                this.current = items[index];
                return this.current;
            },
        };
    }
    function joiner(sep) {
        sep = sep || ',';
        var first = true;
        return function () {
            var val = first ? '' : sep;
            first = false;
            return val;
        };
    }
    // Making this a function instead so it returns a new object
    // each time it's called. That way, if something like an environment
    // uses it, they will each have their own copy.
    function globals() {
        return {
            range: function (start, stop, step) {
                if (typeof stop === 'undefined') {
                    stop = start;
                    start = 0;
                    step = 1;
                }
                else if (!step) {
                    step = 1;
                }
                var arr = [];
                var i;
                if (step > 0) {
                    for (i = start; i < stop; i += step) {
                        arr.push(i);
                    }
                }
                else {
                    for (i = start; i > stop; i += step) {
                        arr.push(i);
                    }
                }
                return arr;
            },
            // lipsum: function(n, html, min, max) {
            // },
            cycler: function () {
                return cycler(Array.prototype.slice.call(arguments));
            },
            joiner: function (sep) {
                return joiner(sep);
            }
        };
    }
    return {
        setters: [],
        execute: function () {
            exports_31("default", globals);
        }
    };
});
System.register("https://dev.jspm.io/npm:@jspm/core@1.0.4/nodelibs/process", [], function (exports_32, context_32) {
    "use strict";
    var exports, _dewExec, _global, exports$1, addListener, argv, binding, browser, chdir, cwd, emit, env, listeners, nextTick, off, on, once, prependListener, prependOnceListener, removeAllListeners, removeListener, title, umask, version, versions;
    var __moduleName = context_32 && context_32.id;
    function dew() {
        if (_dewExec)
            return exports;
        _dewExec = true;
        // shim for using process in browser
        var process = exports = {}; // cached from whatever global is present so that test runners that stub it
        // don't break things.  But we need to wrap it in a try catch in case it is
        // wrapped in strict mode code which doesn't define any globals.  It's inside a
        // function because try/catches deoptimize in certain engines.
        var cachedSetTimeout;
        var cachedClearTimeout;
        function defaultSetTimout() {
            throw new Error('setTimeout has not been defined');
        }
        function defaultClearTimeout() {
            throw new Error('clearTimeout has not been defined');
        }
        (function () {
            try {
                if (typeof setTimeout === 'function') {
                    cachedSetTimeout = setTimeout;
                }
                else {
                    cachedSetTimeout = defaultSetTimout;
                }
            }
            catch (e) {
                cachedSetTimeout = defaultSetTimout;
            }
            try {
                if (typeof clearTimeout === 'function') {
                    cachedClearTimeout = clearTimeout;
                }
                else {
                    cachedClearTimeout = defaultClearTimeout;
                }
            }
            catch (e) {
                cachedClearTimeout = defaultClearTimeout;
            }
        })();
        function runTimeout(fun) {
            if (cachedSetTimeout === setTimeout) {
                //normal enviroments in sane situations
                return setTimeout(fun, 0);
            } // if setTimeout wasn't available but was latter defined
            if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
                cachedSetTimeout = setTimeout;
                return setTimeout(fun, 0);
            }
            try {
                // when when somebody has screwed with setTimeout but no I.E. maddness
                return cachedSetTimeout(fun, 0);
            }
            catch (e) {
                try {
                    // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
                    return cachedSetTimeout.call(null, fun, 0);
                }
                catch (e) {
                    // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
                    return cachedSetTimeout.call(this || _global, fun, 0);
                }
            }
        }
        function runClearTimeout(marker) {
            if (cachedClearTimeout === clearTimeout) {
                //normal enviroments in sane situations
                return clearTimeout(marker);
            } // if clearTimeout wasn't available but was latter defined
            if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
                cachedClearTimeout = clearTimeout;
                return clearTimeout(marker);
            }
            try {
                // when when somebody has screwed with setTimeout but no I.E. maddness
                return cachedClearTimeout(marker);
            }
            catch (e) {
                try {
                    // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
                    return cachedClearTimeout.call(null, marker);
                }
                catch (e) {
                    // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
                    // Some versions of I.E. have different rules for clearTimeout vs setTimeout
                    return cachedClearTimeout.call(this || _global, marker);
                }
            }
        }
        var queue = [];
        var draining = false;
        var currentQueue;
        var queueIndex = -1;
        function cleanUpNextTick() {
            if (!draining || !currentQueue) {
                return;
            }
            draining = false;
            if (currentQueue.length) {
                queue = currentQueue.concat(queue);
            }
            else {
                queueIndex = -1;
            }
            if (queue.length) {
                drainQueue();
            }
        }
        function drainQueue() {
            if (draining) {
                return;
            }
            var timeout = runTimeout(cleanUpNextTick);
            draining = true;
            var len = queue.length;
            while (len) {
                currentQueue = queue;
                queue = [];
                while (++queueIndex < len) {
                    if (currentQueue) {
                        currentQueue[queueIndex].run();
                    }
                }
                queueIndex = -1;
                len = queue.length;
            }
            currentQueue = null;
            draining = false;
            runClearTimeout(timeout);
        }
        process.nextTick = function (fun) {
            var args = new Array(arguments.length - 1);
            if (arguments.length > 1) {
                for (var i = 1; i < arguments.length; i++) {
                    args[i - 1] = arguments[i];
                }
            }
            queue.push(new Item(fun, args));
            if (queue.length === 1 && !draining) {
                runTimeout(drainQueue);
            }
        }; // v8 likes predictible objects
        function Item(fun, array) {
            (this || _global).fun = fun;
            (this || _global).array = array;
        }
        Item.prototype.run = function () {
            (this || _global).fun.apply(null, (this || _global).array);
        };
        process.title = 'browser';
        process.browser = true;
        process.env = {};
        process.argv = [];
        process.version = ''; // empty string to avoid regexp issues
        process.versions = {};
        function noop() { }
        process.on = noop;
        process.addListener = noop;
        process.once = noop;
        process.off = noop;
        process.removeListener = noop;
        process.removeAllListeners = noop;
        process.emit = noop;
        process.prependListener = noop;
        process.prependOnceListener = noop;
        process.listeners = function (name) {
            return [];
        };
        process.binding = function (name) {
            throw new Error('process.binding is not supported');
        };
        process.cwd = function () {
            return '/';
        };
        process.chdir = function (dir) {
            throw new Error('process.chdir is not supported');
        };
        process.umask = function () {
            return 0;
        };
        return exports;
    }
    return {
        setters: [],
        execute: function () {
            exports = {}, _dewExec = false;
            _global = typeof self !== "undefined" ? self : global;
            exports$1 = dew();
            addListener = exports$1.addListener, argv = exports$1.argv, binding = exports$1.binding, browser = exports$1.browser, chdir = exports$1.chdir, cwd = exports$1.cwd, emit = exports$1.emit, env = exports$1.env, listeners = exports$1.listeners, nextTick = exports$1.nextTick, off = exports$1.off, on = exports$1.on, once = exports$1.once, prependListener = exports$1.prependListener, prependOnceListener = exports$1.prependOnceListener, removeAllListeners = exports$1.removeAllListeners, removeListener = exports$1.removeListener, title = exports$1.title, umask = exports$1.umask, version = exports$1.version, versions = exports$1.versions;
            exports_32("addListener", addListener);
            exports_32("argv", argv);
            exports_32("binding", binding);
            exports_32("browser", browser);
            exports_32("chdir", chdir);
            exports_32("cwd", cwd);
            exports_32("emit", emit);
            exports_32("env", env);
            exports_32("listeners", listeners);
            exports_32("nextTick", nextTick);
            exports_32("off", off);
            exports_32("on", on);
            exports_32("once", once);
            exports_32("prependListener", prependListener);
            exports_32("prependOnceListener", prependOnceListener);
            exports_32("removeAllListeners", removeAllListeners);
            exports_32("removeListener", removeListener);
            exports_32("title", title);
            exports_32("umask", umask);
            exports_32("version", version);
            exports_32("versions", versions);
            exports_32("default", exports$1);
        }
    };
});
System.register("https://dev.jspm.io/npm:@jspm/core@1/nodelibs/process", ["https://dev.jspm.io/npm:@jspm/core@1.0.4/nodelibs/process"], function (exports_33, context_33) {
    "use strict";
    var __moduleName = context_33 && context_33.id;
    var exportedNames_2 = {
        "default": true
    };
    function exportStar_2(m) {
        var exports = {};
        for (var n in m) {
            if (n !== "default" && !exportedNames_2.hasOwnProperty(n)) exports[n] = m[n];
        }
        exports_33(exports);
    }
    return {
        setters: [
            function (process_js_1_1) {
                exportStar_2(process_js_1_1);
                exports_33({
                    "default": process_js_1_1["default"]
                });
            }
        ],
        execute: function () {
        }
    };
});
System.register("https://dev.jspm.io/npm:a-sync-waterfall@1.0.1/index.dew", ["https://dev.jspm.io/npm:@jspm/core@1/nodelibs/process"], function (exports_34, context_34) {
    "use strict";
    var process_js_2, exports, _dewExec;
    var __moduleName = context_34 && context_34.id;
    function dew() {
        if (_dewExec)
            return exports;
        _dewExec = true;
        var process = process_js_2.default;
        // MIT license (by Elan Shanker).
        (function (globals) {
            'use strict';
            var executeSync = function () {
                var args = Array.prototype.slice.call(arguments);
                if (typeof args[0] === 'function') {
                    args[0].apply(null, args.splice(1));
                }
            };
            var executeAsync = function (fn) {
                if (typeof setImmediate === 'function') {
                    setImmediate(fn);
                }
                else if (typeof process !== 'undefined' && process.nextTick) {
                    process.nextTick(fn);
                }
                else {
                    setTimeout(fn, 0);
                }
            };
            var makeIterator = function (tasks) {
                var makeCallback = function (index) {
                    var fn = function () {
                        if (tasks.length) {
                            tasks[index].apply(null, arguments);
                        }
                        return fn.next();
                    };
                    fn.next = function () {
                        return index < tasks.length - 1 ? makeCallback(index + 1) : null;
                    };
                    return fn;
                };
                return makeCallback(0);
            };
            var _isArray = Array.isArray || function (maybeArray) {
                return Object.prototype.toString.call(maybeArray) === '[object Array]';
            };
            var waterfall = function (tasks, callback, forceAsync) {
                var nextTick = forceAsync ? executeAsync : executeSync;
                callback = callback || function () { };
                if (!_isArray(tasks)) {
                    var err = new Error('First argument to waterfall must be an array of functions');
                    return callback(err);
                }
                if (!tasks.length) {
                    return callback();
                }
                var wrapIterator = function (iterator) {
                    return function (err) {
                        if (err) {
                            callback.apply(null, arguments);
                            callback = function () { };
                        }
                        else {
                            var args = Array.prototype.slice.call(arguments, 1);
                            var next = iterator.next();
                            if (next) {
                                args.push(wrapIterator(next));
                            }
                            else {
                                args.push(callback);
                            }
                            nextTick(function () {
                                iterator.apply(null, args);
                            });
                        }
                    };
                };
                wrapIterator(makeIterator(tasks))();
            };
            if (typeof define !== 'undefined' && define.amd) {
                define([], function () {
                    return waterfall;
                }); // RequireJS
            }
            else if (exports) {
                exports = waterfall; // CommonJS
            }
            else {
                globals.waterfall = waterfall; // <script>
            }
        })(exports);
        return exports;
    }
    exports_34("dew", dew);
    return {
        setters: [
            function (process_js_2_1) {
                process_js_2 = process_js_2_1;
            }
        ],
        execute: function () {
            exports = {}, _dewExec = false;
        }
    };
});
System.register("https://dev.jspm.io/a-sync-waterfall@1.0.1", ["https://dev.jspm.io/npm:a-sync-waterfall@1.0.1/index.dew", "https://dev.jspm.io/npm:@jspm/core@1/nodelibs/process"], function (exports_35, context_35) {
    "use strict";
    var index_dew_js_1;
    var __moduleName = context_35 && context_35.id;
    return {
        setters: [
            function (index_dew_js_1_1) {
                index_dew_js_1 = index_dew_js_1_1;
            },
            function (_2) {
            }
        ],
        execute: function () {
            exports_35("default", index_dew_js_1.dew());
        }
    };
});
System.register("file:///home/main/Desktop/denjucks/v4/src/environment", ["https://deno.land/std/path/mod", "https://dev.jspm.io/asap@2.0.6", "file:///home/main/Desktop/denjucks/v4/src/lib", "file:///home/main/Desktop/denjucks/v4/src/object", "file:///home/main/Desktop/denjucks/v4/src/compiler", "file:///home/main/Desktop/denjucks/v4/src/filters", "file:///home/main/Desktop/denjucks/v4/src/loaders", "file:///home/main/Desktop/denjucks/v4/src/runtime", "file:///home/main/Desktop/denjucks/v4/src/globals", "https://dev.jspm.io/a-sync-waterfall@1.0.1", "file:///home/main/Desktop/denjucks/v4/src/precompiled-loader"], function (exports_36, context_36) {
    'use strict';
    var path, asap, lib_js_10, object_js_6, compiler_js_1, filters_js_1, loaders_js_1, runtime_js_3, globals_js_1, waterfall, Frame, Template, PrecompiledLoader__export, Environment, Context;
    var __moduleName = context_36 && context_36.id;
    // If the user is using the async API, *always* call it
    // asynchronously even if the template was synchronous.
    function callbackAsap(cb, err, res) {
        asap(function () { cb(err, res); });
    }
    return {
        setters: [
            function (path_3) {
                path = path_3;
            },
            function (asap_1) {
                asap = asap_1;
            },
            function (lib_js_10_1) {
                lib_js_10 = lib_js_10_1;
            },
            function (object_js_6_1) {
                object_js_6 = object_js_6_1;
            },
            function (compiler_js_1_1) {
                compiler_js_1 = compiler_js_1_1;
            },
            function (filters_js_1_1) {
                filters_js_1 = filters_js_1_1;
            },
            function (loaders_js_1_1) {
                loaders_js_1 = loaders_js_1_1;
            },
            function (runtime_js_3_1) {
                runtime_js_3 = runtime_js_3_1;
            },
            function (globals_js_1_1) {
                globals_js_1 = globals_js_1_1;
            },
            function (waterfall_1) {
                waterfall = waterfall_1;
            },
            function (PrecompiledLoader__export_1) {
                PrecompiledLoader__export = PrecompiledLoader__export_1;
            }
        ],
        execute: function () {
            Frame = runtime_js_3.default.Frame;
            loaders_js_1.default.PrecompiledLoader = PrecompiledLoader__export.exports;
            Environment = object_js_6.default.extend({
                init: function (loaders, opts) {
                    // The dev flag determines the trace that'll be shown on errors.
                    // If set to true, returns the full trace from the error point,
                    // otherwise will return trace starting from Template.render
                    // (the full trace from within nunjucks may confuse developers using
                    //  the library)
                    // defaults to false
                    opts = this.opts = opts || {};
                    this.opts.dev = !!opts.dev;
                    // The autoescape flag sets global autoescaping. If true,
                    // every string variable will be escaped by default.
                    // If false, strings can be manually escaped using the `escape` filter.
                    // defaults to true
                    this.opts.autoescape = opts.autoescape != null ? opts.autoescape : true;
                    // If true, this will make the system throw errors if trying
                    // to output a null or undefined value
                    this.opts.throwOnUndefined = !!opts.throwOnUndefined;
                    this.opts.trimBlocks = !!opts.trimBlocks;
                    this.opts.lstripBlocks = !!opts.lstripBlocks;
                    this.loaders = [];
                    if (!loaders) {
                        // The filesystem loader is only available server-side
                        if (loaders_js_1.default.FileSystemLoader) {
                            this.loaders = [new loaders_js_1.default.FileSystemLoader('views')];
                        }
                        else if (loaders_js_1.default.WebLoader) {
                            this.loaders = [new loaders_js_1.default.WebLoader('/views')];
                        }
                    }
                    else {
                        this.loaders = lib_js_10.default.isArray(loaders) ? loaders : [loaders];
                    }
                    // It's easy to use precompiled templates: just include them
                    // before you configure nunjucks and this will automatically
                    // pick it up and use it
                    const process = {};
                    process.env = {};
                    process.env.IS_BROWSER = false;
                    if (process.env.IS_BROWSER && window.nunjucksPrecompiled) {
                        this.loaders.unshift(new loaders_js_1.default.PrecompiledLoader(window.nunjucksPrecompiled));
                    }
                    this.initCache();
                    this.globals = globals_js_1.default();
                    this.filters = {};
                    this.asyncFilters = [];
                    this.extensions = {};
                    this.extensionsList = [];
                    for (var name in filters_js_1.default) {
                        this.addFilter(name, filters_js_1.default[name]);
                    }
                },
                initCache: function () {
                    // Caching and cache busting
                    lib_js_10.default.each(this.loaders, function (loader) {
                        loader.cache = {};
                        if (typeof loader.on === 'function') {
                            loader.on('update', function (template) {
                                loader.cache[template] = null;
                            });
                        }
                    });
                },
                addExtension: function (name, extension) {
                    extension._name = name;
                    this.extensions[name] = extension;
                    this.extensionsList.push(extension);
                    return this;
                },
                removeExtension: function (name) {
                    var extension = this.getExtension(name);
                    if (!extension)
                        return;
                    this.extensionsList = lib_js_10.default.without(this.extensionsList, extension);
                    delete this.extensions[name];
                },
                getExtension: function (name) {
                    return this.extensions[name];
                },
                hasExtension: function (name) {
                    return !!this.extensions[name];
                },
                addGlobal: function (name, value) {
                    this.globals[name] = value;
                    return this;
                },
                getGlobal: function (name) {
                    if (typeof this.globals[name] === 'undefined') {
                        throw new Error('global not found: ' + name);
                    }
                    return this.globals[name];
                },
                addFilter: function (name, func, async) {
                    var wrapped = func;
                    if (async) {
                        this.asyncFilters.push(name);
                    }
                    this.filters[name] = wrapped;
                    return this;
                },
                getFilter: function (name) {
                    if (!this.filters[name]) {
                        throw new Error('filter not found: ' + name);
                    }
                    return this.filters[name];
                },
                resolveTemplate: function (loader, parentName, filename) {
                    var isRelative = (loader.isRelative && parentName) ? loader.isRelative(filename) : false;
                    return (isRelative && loader.resolve) ? loader.resolve(parentName, filename) : filename;
                },
                getTemplate: function (name, eagerCompile, parentName, ignoreMissing, cb) {
                    var that = this;
                    var tmpl = null;
                    if (name && name.raw) {
                        // this fixes autoescape for templates referenced in symbols
                        name = name.raw;
                    }
                    if (lib_js_10.default.isFunction(parentName)) {
                        cb = parentName;
                        parentName = null;
                        eagerCompile = eagerCompile || false;
                    }
                    if (lib_js_10.default.isFunction(eagerCompile)) {
                        cb = eagerCompile;
                        eagerCompile = false;
                    }
                    if (name instanceof Template) {
                        tmpl = name;
                    }
                    else if (typeof name !== 'string') {
                        throw new Error('template names must be a string: ' + name);
                    }
                    else {
                        for (var i = 0; i < this.loaders.length; i++) {
                            var _name = this.resolveTemplate(this.loaders[i], parentName, name);
                            tmpl = this.loaders[i].cache[_name];
                            if (tmpl)
                                break;
                        }
                    }
                    if (tmpl) {
                        if (eagerCompile) {
                            tmpl.compile();
                        }
                        if (cb) {
                            cb(null, tmpl);
                        }
                        else {
                            return tmpl;
                        }
                    }
                    else {
                        var syncResult;
                        var _this = this;
                        var createTemplate = function (err, info) {
                            if (!info && !err) {
                                if (!ignoreMissing) {
                                    err = new Error('template not found: ' + name);
                                }
                            }
                            if (err) {
                                if (cb) {
                                    cb(err);
                                }
                                else {
                                    throw err;
                                }
                            }
                            else {
                                var tmpl;
                                if (info) {
                                    tmpl = new Template(info.src, _this, info.path, eagerCompile);
                                    if (!info.noCache) {
                                        info.loader.cache[name] = tmpl;
                                    }
                                }
                                else {
                                    tmpl = new Template('', _this, '', eagerCompile);
                                }
                                if (cb) {
                                    cb(null, tmpl);
                                }
                                else {
                                    syncResult = tmpl;
                                }
                            }
                        };
                        lib_js_10.default.asyncIter(this.loaders, function (loader, i, next, done) {
                            function handle(err, src) {
                                if (err) {
                                    done(err);
                                }
                                else if (src) {
                                    src.loader = loader;
                                    done(null, src);
                                }
                                else {
                                    next();
                                }
                            }
                            // Resolve name relative to parentName
                            name = that.resolveTemplate(loader, parentName, name);
                            if (loader.async) {
                                loader.getSource(name, handle);
                            }
                            else {
                                handle(null, loader.getSource(name));
                            }
                        }, createTemplate);
                        return syncResult;
                    }
                },
                express: function (app) {
                    var env = this;
                    function NunjucksView(name, opts) {
                        this.name = name;
                        this.path = name;
                        this.defaultEngine = opts.defaultEngine;
                        this.ext = path.extname(name);
                        if (!this.ext && !this.defaultEngine)
                            throw new Error('No default engine was specified and no extension was provided.');
                        if (!this.ext)
                            this.name += (this.ext = ('.' !== this.defaultEngine[0] ? '.' : '') + this.defaultEngine);
                    }
                    NunjucksView.prototype.render = function (opts, cb) {
                        env.render(this.name, opts, cb);
                    };
                    app.set('view', NunjucksView);
                    app.set('nunjucksEnv', this);
                    return this;
                },
                render: function (name, ctx, cb) {
                    if (lib_js_10.default.isFunction(ctx)) {
                        cb = ctx;
                        ctx = null;
                    }
                    // We support a synchronous API to make it easier to migrate
                    // existing code to async. This works because if you don't do
                    // anything async work, the whole thing is actually run
                    // synchronously.
                    var syncResult = null;
                    this.getTemplate(name, function (err, tmpl) {
                        if (err && cb) {
                            callbackAsap(cb, err);
                        }
                        else if (err) {
                            throw err;
                        }
                        else {
                            syncResult = tmpl.render(ctx, cb);
                        }
                    });
                    return syncResult;
                },
                renderString: function (src, ctx, opts, cb) {
                    if (lib_js_10.default.isFunction(opts)) {
                        cb = opts;
                        opts = {};
                    }
                    opts = opts || {};
                    var tmpl = new Template(src, this, opts.path);
                    return tmpl.render(ctx, cb);
                },
                waterfall: waterfall
            });
            Context = object_js_6.default.extend({
                init: function (ctx, blocks, env) {
                    // Has to be tied to an environment so we can tap into its globals.
                    this.env = env || new Environment();
                    // Make a duplicate of ctx
                    this.ctx = {};
                    for (var k in ctx) {
                        if (ctx.hasOwnProperty(k)) {
                            this.ctx[k] = ctx[k];
                        }
                    }
                    this.blocks = {};
                    this.exported = [];
                    for (var name in blocks) {
                        this.addBlock(name, blocks[name]);
                    }
                },
                lookup: function (name) {
                    // This is one of the most called functions, so optimize for
                    // the typical case where the name isn't in the globals
                    if (name in this.env.globals && !(name in this.ctx)) {
                        return this.env.globals[name];
                    }
                    else {
                        return this.ctx[name];
                    }
                },
                setVariable: function (name, val) {
                    this.ctx[name] = val;
                },
                getVariables: function () {
                    return this.ctx;
                },
                addBlock: function (name, block) {
                    this.blocks[name] = this.blocks[name] || [];
                    this.blocks[name].push(block);
                    return this;
                },
                getBlock: function (name) {
                    if (!this.blocks[name]) {
                        throw new Error('unknown block "' + name + '"');
                    }
                    return this.blocks[name][0];
                },
                getSuper: function (env, name, block, frame, runtime, cb) {
                    var idx = lib_js_10.default.indexOf(this.blocks[name] || [], block);
                    var blk = this.blocks[name][idx + 1];
                    var context = this;
                    if (idx === -1 || !blk) {
                        throw new Error('no super block available for "' + name + '"');
                    }
                    blk(env, context, frame, runtime, cb);
                },
                addExport: function (name) {
                    this.exported.push(name);
                },
                getExported: function () {
                    var exported = {};
                    for (var i = 0; i < this.exported.length; i++) {
                        var name = this.exported[i];
                        exported[name] = this.ctx[name];
                    }
                    return exported;
                }
            });
            Template = object_js_6.default.extend({
                init: function (src, env, path, eagerCompile) {
                    this.env = env || new Environment();
                    if (lib_js_10.default.isObject(src)) {
                        switch (src.type) {
                            case 'code':
                                this.tmplProps = src.obj;
                                break;
                            case 'string':
                                this.tmplStr = src.obj;
                                break;
                        }
                    }
                    else if (lib_js_10.default.isString(src)) {
                        this.tmplStr = src;
                    }
                    else {
                        throw new Error('src must be a string or an object describing ' +
                            'the source');
                    }
                    this.path = path;
                    if (eagerCompile) {
                        var _this = this;
                        try {
                            _this._compile();
                        }
                        catch (err) {
                            throw lib_js_10.default.prettifyError(this.path, this.env.opts.dev, err);
                        }
                    }
                    else {
                        this.compiled = false;
                    }
                },
                render: function (ctx, parentFrame, cb) {
                    if (typeof ctx === 'function') {
                        cb = ctx;
                        ctx = {};
                    }
                    else if (typeof parentFrame === 'function') {
                        cb = parentFrame;
                        parentFrame = null;
                    }
                    var forceAsync = true;
                    if (parentFrame) {
                        // If there is a frame, we are being called from internal
                        // code of another template, and the internal system
                        // depends on the sync/async nature of the parent template
                        // to be inherited, so force an async callback
                        forceAsync = false;
                    }
                    var _this = this;
                    // Catch compile errors for async rendering
                    try {
                        _this.compile();
                    }
                    catch (_err) {
                        var err = lib_js_10.default.prettifyError(this.path, this.env.opts.dev, _err);
                        if (cb)
                            return callbackAsap(cb, err);
                        else
                            throw err;
                    }
                    var context = new Context(ctx || {}, _this.blocks, _this.env);
                    var frame = parentFrame ? parentFrame.push(true) : new Frame();
                    frame.topLevel = true;
                    var syncResult = null;
                    _this.rootRenderFunc(_this.env, context, frame || new Frame(), runtime_js_3.default, function (err, res) {
                        if (err) {
                            err = lib_js_10.default.prettifyError(_this.path, _this.env.opts.dev, err);
                        }
                        if (cb) {
                            if (forceAsync) {
                                callbackAsap(cb, err, res);
                            }
                            else {
                                cb(err, res);
                            }
                        }
                        else {
                            if (err) {
                                throw err;
                            }
                            syncResult = res;
                        }
                    });
                    return syncResult;
                },
                getExported: function (ctx, parentFrame, cb) {
                    if (typeof ctx === 'function') {
                        cb = ctx;
                        ctx = {};
                    }
                    if (typeof parentFrame === 'function') {
                        cb = parentFrame;
                        parentFrame = null;
                    }
                    // Catch compile errors for async rendering
                    try {
                        this.compile();
                    }
                    catch (e) {
                        if (cb)
                            return cb(e);
                        else
                            throw e;
                    }
                    var frame = parentFrame ? parentFrame.push() : new Frame();
                    frame.topLevel = true;
                    // Run the rootRenderFunc to populate the context with exported vars
                    var context = new Context(ctx || {}, this.blocks, this.env);
                    this.rootRenderFunc(this.env, context, frame, runtime_js_3.default, function (err) {
                        if (err) {
                            cb(err, null);
                        }
                        else {
                            cb(null, context.getExported());
                        }
                    });
                },
                compile: function () {
                    if (!this.compiled) {
                        this._compile();
                    }
                },
                _compile: function () {
                    var props;
                    if (this.tmplProps) {
                        props = this.tmplProps;
                    }
                    else {
                        var source = compiler_js_1.default.compile(this.tmplStr, this.env.asyncFilters, this.env.extensionsList, this.path, this.env.opts);
                        /* jslint evil: true */
                        var func = new Function(source);
                        props = func();
                    }
                    this.blocks = this._getBlocks(props);
                    this.rootRenderFunc = props.root;
                    this.compiled = true;
                },
                _getBlocks: function (props) {
                    var blocks = {};
                    for (var k in props) {
                        if (k.slice(0, 2) === 'b_') {
                            blocks[k.slice(2)] = props[k];
                        }
                    }
                    return blocks;
                }
            });
            exports_36("default", {
                Environment: Environment,
                Template: Template
            });
        }
    };
});
System.register("file:///home/main/Desktop/denjucks/v4/src/precompile-global", [], function (exports_37, context_37) {
    'use strict';
    var __moduleName = context_37 && context_37.id;
    function precompileGlobal(templates, opts) {
        var out = '', name, template;
        opts = opts || {};
        for (var i = 0; i < templates.length; i++) {
            name = JSON.stringify(templates[i].name);
            template = templates[i].template;
            out += '(function() {' +
                '(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})' +
                '[' + name + '] = (function() {\n' + template + '\n})();\n';
            if (opts.asFunction) {
                out += 'return function(ctx, cb) { return nunjucks.render(' + name + ', ctx, cb); }\n';
            }
            out += '})();\n';
        }
        return out;
    }
    return {
        setters: [],
        execute: function () {
            exports_37("default", precompileGlobal);
        }
    };
});
System.register("file:///home/main/Desktop/denjucks/v4/src/precompile", ["https://deno.land/std/path/mod", "file:///home/main/Desktop/denjucks/v4/src/lib", "file:///home/main/Desktop/denjucks/v4/src/compiler", "file:///home/main/Desktop/denjucks/v4/src/environment", "file:///home/main/Desktop/denjucks/v4/src/precompile-global"], function (exports_38, context_38) {
    'use strict';
    var path, lib_js_11, compiler_js_2, environment_js_1, Environment, precompile_global_js_1;
    var __moduleName = context_38 && context_38.id;
    function readdirPathsSync(p) {
        return Deno.readdirSync(p).map(pth => pth.name).sort();
    }
    function existsSync(p) {
        try {
            Deno.statSync(p);
            return true;
        }
        catch (e) {
            return false;
        }
    }
    function match(filename, patterns) {
        if (!Array.isArray(patterns))
            return false;
        return patterns.some(function (pattern) {
            return filename.match(pattern) !== null;
        });
    }
    function precompileString(str, opts) {
        opts = opts || {};
        opts.isString = true;
        return precompile(str, opts);
    }
    function precompile(input, opts) {
        // The following options are available:
        //
        // * name: name of the template (auto-generated when compiling a directory)
        // * isString: input is a string, not a file path
        // * asFunction: generate a callable function
        // * force: keep compiling on error
        // * env: the Environment to use (gets extensions and async filters from it)
        // * include: which file/folders to include (folders are auto-included, files are auto-excluded)
        // * exclude: which file/folders to exclude (folders are auto-included, files are auto-excluded)
        // * wrapper: function(templates, opts) {...}
        //       Customize the output format to store the compiled template.
        //       By default, templates are stored in a global variable used by the runtime.
        //       A custom loader will be necessary to load your custom wrapper.
        opts = opts || {};
        var env = opts.env || new Environment([]);
        var wrapper = opts.wrapper || precompile_global_js_1.default;
        var pathStats = existsSync(input) && Deno.statSync(input);
        var precompiled = [];
        var templates = [];
        function addTemplates(dir) {
            var files = readdirPathsSync(dir);
            for (var i = 0; i < files.length; i++) {
                var filepath = path.join(dir, files[i]);
                var subpath = filepath.substr(path.join(input, '/').length);
                var stat = Deno.statSync(filepath);
                if (stat && stat.isDirectory()) {
                    subpath += '/';
                    if (!match(subpath, opts.exclude)) {
                        addTemplates(filepath);
                    }
                }
                else if (match(subpath, opts.include)) {
                    templates.push(filepath);
                }
            }
        }
        if (opts.isString) {
            if (!opts.name) {
                throw new Error('the "name" option is required when ' +
                    'compiling a string');
            }
            precompiled.push(_precompile(input, opts.name, env));
        }
        else if (pathStats.isFile()) {
            let decoder = new TextDecoder("utf-8");
            precompiled.push(_precompile(decoder.decode(Deno.readFileSync(input)), opts.name || input, env));
        }
        else if (pathStats.isDirectory()) {
            addTemplates(input);
            for (var i = 0; i < templates.length; i++) {
                var name = templates[i].replace(path.join(input, '/'), '');
                try {
                    let decoder = new TextDecoder("utf-8");
                    precompiled.push(_precompile(decoder.decode(Deno.readFileSync(templates[i])), name, env));
                }
                catch (e) {
                    if (opts.force) {
                        // Don't stop generating the output if we're
                        // forcing compilation.
                        console.error(e);
                    }
                    else {
                        throw e;
                    }
                }
            }
        }
        return wrapper(precompiled, opts);
    }
    function _precompile(str, name, env) {
        env = env || new Environment([]);
        var asyncFilters = env.asyncFilters;
        var extensions = env.extensionsList;
        var template;
        name = name.replace(/\\/g, '/');
        try {
            template = compiler_js_2.default.compile(str, asyncFilters, extensions, name, env.opts);
        }
        catch (err) {
            throw lib_js_11.default.prettifyError(name, false, err);
        }
        return { name: name, template: template };
    }
    return {
        setters: [
            function (path_4) {
                path = path_4;
            },
            function (lib_js_11_1) {
                lib_js_11 = lib_js_11_1;
            },
            function (compiler_js_2_1) {
                compiler_js_2 = compiler_js_2_1;
            },
            function (environment_js_1_1) {
                environment_js_1 = environment_js_1_1;
            },
            function (precompile_global_js_1_1) {
                precompile_global_js_1 = precompile_global_js_1_1;
            }
        ],
        execute: function () {
            Environment = environment_js_1.default.Environment;
            exports_38("default", {
                precompile: precompile,
                precompileString: precompileString
            });
        }
    };
});
System.register("file:///home/main/Desktop/denjucks/v4/src/jinja-compat", [], function (exports_39, context_39) {
    "use strict";
    var __moduleName = context_39 && context_39.id;
    function installCompat() {
        'use strict';
        // This must be called like `nunjucks.installCompat` so that `this`
        // references the nunjucks instance
        var runtime = this.runtime; // jshint ignore:line
        var lib = this.lib; // jshint ignore:line
        var Compiler = this.compiler.Compiler; // jshint ignore:line
        var Parser = this.parser.Parser; // jshint ignore:line
        var nodes = this.nodes; // jshint ignore:line
        var lexer = this.lexer; // jshint ignore:line
        var orig_contextOrFrameLookup = runtime.contextOrFrameLookup;
        var orig_Compiler_assertType = Compiler.prototype.assertType;
        var orig_Parser_parseAggregate = Parser.prototype.parseAggregate;
        var orig_memberLookup = runtime.memberLookup;
        function uninstall() {
            runtime.contextOrFrameLookup = orig_contextOrFrameLookup;
            Compiler.prototype.assertType = orig_Compiler_assertType;
            Parser.prototype.parseAggregate = orig_Parser_parseAggregate;
            runtime.memberLookup = orig_memberLookup;
        }
        runtime.contextOrFrameLookup = function (context, frame, key) {
            var val = orig_contextOrFrameLookup.apply(this, arguments);
            if (val === undefined) {
                switch (key) {
                    case 'True':
                        return true;
                    case 'False':
                        return false;
                    case 'None':
                        return null;
                }
            }
            return val;
        };
        var Slice = nodes.Node.extend('Slice', {
            fields: ['start', 'stop', 'step'],
            init: function (lineno, colno, start, stop, step) {
                start = start || new nodes.Literal(lineno, colno, null);
                stop = stop || new nodes.Literal(lineno, colno, null);
                step = step || new nodes.Literal(lineno, colno, 1);
                this.parent(lineno, colno, start, stop, step);
            }
        });
        Compiler.prototype.assertType = function (node) {
            if (node instanceof Slice) {
                return;
            }
            return orig_Compiler_assertType.apply(this, arguments);
        };
        Compiler.prototype.compileSlice = function (node, frame) {
            this.emit('(');
            this._compileExpression(node.start, frame);
            this.emit('),(');
            this._compileExpression(node.stop, frame);
            this.emit('),(');
            this._compileExpression(node.step, frame);
            this.emit(')');
        };
        function getTokensState(tokens) {
            return {
                index: tokens.index,
                lineno: tokens.lineno,
                colno: tokens.colno
            };
        }
        Parser.prototype.parseAggregate = function () {
            var self = this;
            var origState = getTokensState(this.tokens);
            // Set back one accounting for opening bracket/parens
            origState.colno--;
            origState.index--;
            try {
                return orig_Parser_parseAggregate.apply(this);
            }
            catch (e) {
                var errState = getTokensState(this.tokens);
                var rethrow = function () {
                    lib.extend(self.tokens, errState);
                    return e;
                };
                // Reset to state before original parseAggregate called
                lib.extend(this.tokens, origState);
                this.peeked = false;
                var tok = this.peekToken();
                if (tok.type !== lexer.TOKEN_LEFT_BRACKET) {
                    throw rethrow();
                }
                else {
                    this.nextToken();
                }
                var node = new Slice(tok.lineno, tok.colno);
                // If we don't encounter a colon while parsing, this is not a slice,
                // so re-raise the original exception.
                var isSlice = false;
                for (var i = 0; i <= node.fields.length; i++) {
                    if (this.skip(lexer.TOKEN_RIGHT_BRACKET)) {
                        break;
                    }
                    if (i === node.fields.length) {
                        if (isSlice) {
                            this.fail('parseSlice: too many slice components', tok.lineno, tok.colno);
                        }
                        else {
                            break;
                        }
                    }
                    if (this.skip(lexer.TOKEN_COLON)) {
                        isSlice = true;
                    }
                    else {
                        var field = node.fields[i];
                        node[field] = this.parseExpression();
                        isSlice = this.skip(lexer.TOKEN_COLON) || isSlice;
                    }
                }
                if (!isSlice) {
                    throw rethrow();
                }
                return new nodes.Array(tok.lineno, tok.colno, [node]);
            }
        };
        function sliceLookup(obj, start, stop, step) {
            obj = obj || [];
            if (start === null) {
                start = (step < 0) ? (obj.length - 1) : 0;
            }
            if (stop === null) {
                stop = (step < 0) ? -1 : obj.length;
            }
            else {
                if (stop < 0) {
                    stop += obj.length;
                }
            }
            if (start < 0) {
                start += obj.length;
            }
            var results = [];
            for (var i = start;; i += step) {
                if (i < 0 || i > obj.length) {
                    break;
                }
                if (step > 0 && i >= stop) {
                    break;
                }
                if (step < 0 && i <= stop) {
                    break;
                }
                results.push(runtime.memberLookup(obj, i));
            }
            return results;
        }
        var ARRAY_MEMBERS = {
            pop: function (index) {
                if (index === undefined) {
                    return this.pop();
                }
                if (index >= this.length || index < 0) {
                    throw new Error('KeyError');
                }
                return this.splice(index, 1);
            },
            append: function (element) {
                return this.push(element);
            },
            remove: function (element) {
                for (var i = 0; i < this.length; i++) {
                    if (this[i] === element) {
                        return this.splice(i, 1);
                    }
                }
                throw new Error('ValueError');
            },
            count: function (element) {
                var count = 0;
                for (var i = 0; i < this.length; i++) {
                    if (this[i] === element) {
                        count++;
                    }
                }
                return count;
            },
            index: function (element) {
                var i;
                if ((i = this.indexOf(element)) === -1) {
                    throw new Error('ValueError');
                }
                return i;
            },
            find: function (element) {
                return this.indexOf(element);
            },
            insert: function (index, elem) {
                return this.splice(index, 0, elem);
            }
        };
        var OBJECT_MEMBERS = {
            items: function () {
                var ret = [];
                for (var k in this) {
                    ret.push([k, this[k]]);
                }
                return ret;
            },
            values: function () {
                var ret = [];
                for (var k in this) {
                    ret.push(this[k]);
                }
                return ret;
            },
            keys: function () {
                var ret = [];
                for (var k in this) {
                    ret.push(k);
                }
                return ret;
            },
            get: function (key, def) {
                var output = this[key];
                if (output === undefined) {
                    output = def;
                }
                return output;
            },
            has_key: function (key) {
                return this.hasOwnProperty(key);
            },
            pop: function (key, def) {
                var output = this[key];
                if (output === undefined && def !== undefined) {
                    output = def;
                }
                else if (output === undefined) {
                    throw new Error('KeyError');
                }
                else {
                    delete this[key];
                }
                return output;
            },
            popitem: function () {
                for (var k in this) {
                    // Return the first object pair.
                    var val = this[k];
                    delete this[k];
                    return [k, val];
                }
                throw new Error('KeyError');
            },
            setdefault: function (key, def) {
                if (key in this) {
                    return this[key];
                }
                if (def === undefined) {
                    def = null;
                }
                return this[key] = def;
            },
            update: function (kwargs) {
                for (var k in kwargs) {
                    this[k] = kwargs[k];
                }
                return null; // Always returns None
            }
        };
        OBJECT_MEMBERS.iteritems = OBJECT_MEMBERS.items;
        OBJECT_MEMBERS.itervalues = OBJECT_MEMBERS.values;
        OBJECT_MEMBERS.iterkeys = OBJECT_MEMBERS.keys;
        runtime.memberLookup = function (obj, val, autoescape) {
            if (arguments.length === 4) {
                return sliceLookup.apply(this, arguments);
            }
            obj = obj || {};
            // If the object is an object, return any of the methods that Python would
            // otherwise provide.
            if (lib.isArray(obj) && ARRAY_MEMBERS.hasOwnProperty(val)) {
                return function () { return ARRAY_MEMBERS[val].apply(obj, arguments); };
            }
            if (lib.isObject(obj) && OBJECT_MEMBERS.hasOwnProperty(val)) {
                return function () { return OBJECT_MEMBERS[val].apply(obj, arguments); };
            }
            return orig_memberLookup.apply(this, arguments);
        };
        return uninstall;
    }
    return {
        setters: [],
        execute: function () {
            exports_39("default", installCompat);
        }
    };
});
System.register("file:///home/main/Desktop/denjucks/v4/index", ["file:///home/main/Desktop/denjucks/v4/src/lib", "file:///home/main/Desktop/denjucks/v4/src/environment", "file:///home/main/Desktop/denjucks/v4/src/loader", "file:///home/main/Desktop/denjucks/v4/src/loaders", "file:///home/main/Desktop/denjucks/v4/src/precompile", "file:///home/main/Desktop/denjucks/v4/src/jinja-compat"], function (exports_40, context_40) {
    'use strict';
    var lib_js_12, environment_js_2, loader_js_3, loaders_js_2, precompile_js_1, exports, jinja_compat_js_1, e;
    var __moduleName = context_40 && context_40.id;
    return {
        setters: [
            function (lib_js_12_1) {
                lib_js_12 = lib_js_12_1;
            },
            function (environment_js_2_1) {
                environment_js_2 = environment_js_2_1;
            },
            function (loader_js_3_1) {
                loader_js_3 = loader_js_3_1;
            },
            function (loaders_js_2_1) {
                loaders_js_2 = loaders_js_2_1;
            },
            function (precompile_js_1_1) {
                precompile_js_1 = precompile_js_1_1;
            },
            function (jinja_compat_js_1_1) {
                jinja_compat_js_1 = jinja_compat_js_1_1;
            }
        ],
        execute: function () {
            exports = {};
            exports.Environment = environment_js_2.default.Environment;
            exports.Template = environment_js_2.default.Template;
            exports.Loader = loader_js_3.default;
            exports.FileSystemLoader = loaders_js_2.default.FileSystemLoader;
            exports.PrecompiledLoader = loaders_js_2.default.PrecompiledLoader;
            exports.WebLoader = loaders_js_2.default.WebLoader;
            exports.lib = lib_js_12.default;
            exports.installJinjaCompat = jinja_compat_js_1.default;
            exports.configure = function (templatesPath, opts) {
                opts = opts || {};
                if (lib_js_12.default.isObject(templatesPath)) {
                    opts = templatesPath;
                    templatesPath = null;
                }
                var TemplateLoader;
                if (loaders_js_2.default.FileSystemLoader) {
                    TemplateLoader = new loaders_js_2.default.FileSystemLoader(templatesPath, {
                        watch: opts.watch,
                        noCache: opts.noCache
                    });
                }
                else if (loaders_js_2.default.WebLoader) {
                    TemplateLoader = new loaders_js_2.default.WebLoader(templatesPath, {
                        useCache: opts.web && opts.web.useCache,
                        async: opts.web && opts.web.async
                    });
                }
                e = new environment_js_2.default.Environment(TemplateLoader, opts);
                if (opts && opts.express) {
                    e.express(opts.express);
                }
                return e;
            };
            exports.compile = function (src, env, path, eagerCompile) {
                if (!e) {
                    exports.configure();
                }
                return new exports.Template(src, env, path, eagerCompile);
            };
            exports.render = function (name, ctx, cb) {
                if (!e) {
                    exports.configure();
                }
                return e.render(name, ctx, cb);
            };
            exports.renderString = function (src, ctx, cb) {
                if (!e) {
                    exports.configure();
                }
                return e.renderString(src, ctx, cb);
            };
            if (precompile_js_1.default) {
                exports.precompile = precompile_js_1.default.precompile;
                exports.precompileString = precompile_js_1.default.precompileString;
            }
            exports_40("default", exports);
        }
    };
});

const __exp = __instantiate("file:///home/main/Desktop/denjucks/v4/index");
export default __exp["default"];
