/*
* jqGrid  4.5.2 - jQuery Grid
* Copyright (c) 2008, Tony Tomov, tony@trirand.com
* Dual licensed under the MIT and GPL licenses
* http://www.opensource.org/licenses/mit-license.php
* http://www.gnu.org/licenses/gpl-2.0.html
* Date:2013-05-21
* Modules: grid.base.js; jquery.fmatter.js; grid.custom.js; grid.common.js; grid.formedit.js; grid.filter.js; grid.inlinedit.js; grid.celledit.js; jqModal.js; jqDnR.js; grid.subgrid.js; grid.grouping.js; grid.treegrid.js; grid.import.js; JsonXml.js; grid.tbltogrid.js; grid.jqueryui.js;
*/

(function (b) {
    b.jgrid = b.jgrid || {};
    b.extend(b.jgrid, {
        version: "4.5.2",
        htmlDecode: function (b) {
            return b && ("&nbsp;" === b || "&#160;" === b || 1 === b.length && 160 === b.charCodeAt(0))
                ? ""
                : !b
                    ? b
                    : ("" + b)
                        .replace(/&gt;/g, ">")
                        .replace(/&lt;/g, "<")
                        .replace(/&quot;/g, '"')
                        .replace(/&amp;/g, "&")
        },
        htmlEncode: function (b) {
            return !b
                ? b
                : ("" + b)
                    .replace(/&/g, "&amp;")
                    .replace(/\"/g, "&quot;")
                    .replace(/</g, "&lt;")
                    .replace(/>/g, "&gt;")
        },
        format: function (d) {
            var f = b
                .makeArray(arguments)
                .slice(1);
            null == d && (d = "");
            return d.replace(/\{(\d+)\}/g, function (b, e) {
                return f[e]
            })
        },
        msie: "Microsoft Internet Explorer" === navigator.appName,
        msiever: function () {
            var b = -1;
            null != /MSIE ([0-9]{1,}[.0-9]{0,})/.exec(navigator.userAgent) && (b = parseFloat(RegExp.$1));
            return b
        },
        getCellIndex: function (d) {
            d = b(d);
            if (d.is("tr")) 
                return -1;
            d = (!d.is("td") && !d.is("th")
                ? d.closest("td,th")
                : d)[0];
            return b.jgrid.msie
                ? b.inArray(d, d.parentNode.cells)
                : d.cellIndex
        },
        stripHtml: function (b) {
            var b = "" + b,
                f = /<("[^"]*"|'[^']*'|[^'">])*>/gi;
            return b
                ? (b = b.replace(f, "")) && "&nbsp;" !== b && "&#160;" !== b
                    ? b.replace(/\"/g, "'")
                    : ""
                : b
        },
        stripPref: function (d, f) {
            var c = b.type(d);
            if ("string" === c || "number" === c) 
                d = "" + d,
                f = "" !== d
                    ? ("" + f).replace("" + d, "")
                    : f;
            return f
        },
        parse: function (d) {
            "while(1);" === d.substr(0, 9) && (d = d.substr(9));
            "/*" === d.substr(0, 2) && (d = d.substr(2, d.length - 4));
            d || (d = "{}");
            return !0 === b.jgrid.useJSON && "object" === typeof JSON && "function" === typeof JSON.parse
                ? JSON.parse(d)
                : eval("(" + d + ")")
        },
        parseDate: function (d, f, c, e) {
            var a = /^\/Date\((([-+])?[0-9]+)(([-+])([0-9]{2})([0-9]{2}))?\)\/$/,
                j = "string" === typeof f
                    ? f.match(a)
                    : null,
                a = function (a, b) {
                    a = "" + a;
                    for (b = parseInt(b, 10) || 2; a.length < b;) 
                        a = "0" + a;
                    return a
                },
                g = {
                    m: 1,
                    d: 1,
                    y: 1970,
                    h: 0,
                    i: 0,
                    s: 0,
                    u: 0
                },
                h = 0,
                i,
                k,
                h = function (a, b) {
                    0 === a
                        ? 12 === b && (b = 0)
                        : 12 !== b && (b += 12);
                    return b
                };
            void 0 === e && (e = b.jgrid.formatter.date);
            void 0 === e.parseRe && (e.parseRe = /[Tt\\\/:_;.,\t\s-]/);
            e
                .masks
                .hasOwnProperty(d) && (d = e.masks[d]);
            if (f && null != f) 
                if (!isNaN(f - 0) && "u" === ("" + d).toLowerCase()) 
                    h = new Date(1E3 * parseFloat(f));
                else if (f.constructor === Date) 
                    h = f;
                else if (null !== j) 
                    h = new Date(parseInt(j[1], 10)),
                    j[3] && (d = 60 * Number(j[5]) + Number(j[6]), d *= "-" === j[4]
                        ? 1
                        : -1, d -= h.getTimezoneOffset(), h.setTime(Number(Number(h) + 6E4 * d)));
                else {
                    f = ("" + f)
                        .replace(/\\T/g, "T")
                        .replace(/\\t/, "t")
                        .split(e.parseRe);
                    d = d
                        .replace(/\\T/g, "T")
                        .replace(/\\t/, "t")
                        .split(e.parseRe);
                    i = 0;
                    for (k = d.length; i < k; i++) 
                        "M" === d[i] && (j = b.inArray(f[i], e.monthNames), -1 !== j && 12 > j && (f[i] = j + 1, g.m = f[i])),
                        "F" === d[i] && (j = b.inArray(f[i], e.monthNames, 12), -1 !== j && 11 < j && (f[i] = j + 1 - 12, g.m = f[i])),
                        "a" === d[i] && (j = b.inArray(f[i], e.AmPm), -1 !== j && 2 > j && f[i] === e.AmPm[j] && (f[i] = j, g.h = h(f[i], g.h))),
                        "A" === d[i] && (j = b.inArray(f[i], e.AmPm), -1 !== j && 1 < j && f[i] === e.AmPm[j] && (f[i] = j - 2, g.h = h(f[i], g.h))),
                        "g" === d[i] && (g.h = parseInt(f[i], 10)),
                        void 0 !== f[i] && (g[d[i].toLowerCase()] = parseInt(f[i], 10));
                    g.f && (g.m = g.f);
                    if (0 === g.m && 0 === g.y && 0 === g.d) 
                        return "&#160;";
                    g.m = parseInt(g.m, 10) - 1;
                    h = g.y;
                    70 <= h && 99 >= h
                        ? g.y = 1900 + g.y
                        : 0 <= h && 69 >= h && (g.y = 2E3 + g.y);
                    h = new Date(g.y, g.m, g.d, g.h, g.i, g.s, g.u)
                } else 
                    h = new Date(g.y, g.m, g.d, g.h, g.i, g.s, g.u);
        if (void 0 === c) 
                return h;
            e
                .masks
                .hasOwnProperty(c)
                ? c = e.masks[c]
                : c || (c = "Y-m-d");
            d = h.getHours();
            f = h.getMinutes();
            g = h.getDate();
            j = h.getMonth() + 1;
            i = h.getTimezoneOffset();
            k = h.getSeconds();
            var l = h.getMilliseconds(),
                o = h.getDay(),
                n = h.getFullYear(),
                m = (o + 6) % 7 + 1,
                t = (new Date(n, j - 1, g) - new Date(n, 0, 1)) / 864E5,
                A = {
                    d: a(g),
                    D: e.dayNames[o],
                    j: g,
                    l: e.dayNames[o + 7],
                    N: m,
                    S: e.S(g),
                    w: o,
                    z: t,
                    W: 5 > m
                        ? Math.floor((t + m - 1) / 7) + 1
                        : Math.floor((t + m - 1) / 7) || (4 > ((new Date(n - 1, 0, 1)).getDay() + 6) % 7
                            ? 53
                            : 52),
                    F: e.monthNames[j - 1 + 12],
                    m: a(j),
                    M: e.monthNames[j - 1],
                    n: j,
                    t: "?",
                    L: "?",
                    o: "?",
                    Y: n,
                    y: ("" + n).substring(2),
                    a: 12 > d
                        ? e.AmPm[0]
                        : e.AmPm[1],
                    A: 12 > d
                        ? e.AmPm[2]
                        : e.AmPm[3],
                    B: "?",
                    g: d % 12 || 12,
                    G: d,
                    h: a(d % 12 || 12),
                    H: a(d),
                    i: a(f),
                    s: a(k),
                    u: l,
                    e: "?",
                    I: "?",
                    O: (0 < i
                        ? "-"
                        : "+") + a(100 * Math.floor(Math.abs(i) / 60) + Math.abs(i) % 60, 4),
                    P: "?",
                    T: (("" + h).match(/\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g) || [""])
                        .pop()
                        .replace(/[^-+\dA-Z]/g, ""),
                    Z: "?",
                    c: "?",
                    r: "?",
                    U: Math.floor(h / 1E3)
                };
            return c.replace(/\\.|[dDjlNSwzWFmMntLoYyaABgGhHisueIOPTZcrU]/g, function (a) {
                return A.hasOwnProperty(a)
                    ? A[a]
                    : a.substring(1)
            })
        },
        jqID: function (b) {
            return ("" + b).replace(/[!"#$%&'()*+,.\/:; <=>?@\[\\\]\^`{|}~]/g, "\\$&")
        },
        guid: 1,
        uidPref: "jqg",
        randId: function (d) {
            return (d || b.jgrid.uidPref) + b.jgrid.guid++
        },
        getAccessor: function (b, f) {
            var c,
                e,
                a = [],
                j;
            if ("function" === typeof f) 
                return f(b);
            c = b[f];
            if (void 0 === c) 
                try {
                    if ("string" === typeof f && (a = f.split(".")), j = a.length) 
                        for (c = b; c && j--;) 
                            e = a.shift(),
                            c = c[e]
                } catch (g) {}
            return c
        },
        getXmlData: function (d, f, c) {
            var e = "string" === typeof f
                ? f.match(/^(.*)\[(\w+)\]$/)
                : null;
            if ("function" === typeof f) 
                return f(d);
            if (e && e[2]) 
                return e[1]
                    ? b(e[1], d).attr(e[2])
                    : b(d).attr(e[2]);
            d = b(f, d);
            return c
                ? d
                : 0 < d.length
                    ? b(d).text()
                    : void 0
        },
        cellWidth: function () {
            var d = b("<div class='ui-jqgrid' style='left:10000px'><table class='ui-jqgrid-btable' styl" +
                        "e='width:5px;'><tr class='jqgrow'><td style='width:5px;'></td></tr></table></div" +
                        ">"),
                f = d
                    .appendTo("body")
                    .find("td")
                    .width();
            d.remove();
            return 5 !== f
        },
        cell_width: !0,
        ajaxOptions: {},
        from: function (d) {
            return new function (d, c) {
                "string" === typeof d && (d = b.data(d));
                var e = this,
                    a = d,
                    j = !0,
                    g = !1,
                    h = c,
                    i = /[\$,%]/g,
                    k = null,
                    l = null,
                    o = 0,
                    n = !1,
                    m = "",
                    t = [],
                    A = !0;
                if ("object" === typeof d && d.push) 
                    0 < d.length && (A = "object" !== typeof d[0]
                        ? !1
                        : !0);
                else 
                    throw "data provides is not an array";
                this._hasData = function () {
                    return null === a
                        ? !1
                        : 0 === a.length
                            ? !1
                            : !0
                };
                this._getStr = function (a) {
                    var b = [];
                    g && b.push("jQuery.trim(");
                    b.push("String(" + a + ")");
                    g && b.push(")");
                    j || b.push(".toLowerCase()");
                    return b.join("")
                };
                this._strComp = function (a) {
                    return "string" === typeof a
                        ? ".toString()"
                        : ""
                };
                this._group = function (a, b) {
                    return {
                        field: a.toString(),
                        unique: b,
                        items: []
                    }
                };
                this._toStr = function (a) {
                    g && (a = b.trim(a));
                    a = a
                        .toString()
                        .replace(/\\/g, "\\\\")
                        .replace(/\"/g, '\\"');
                    return j
                        ? a
                        : a.toLowerCase()
                };
                this._funcLoop = function (e) {
                    var d = [];
                    b.each(a, function (a, b) {
                        d.push(e(b))
                    });
                    return d
                };
                this._append = function (a) {
                    var b;
                    h = null === h
                        ? ""
                        : h + ("" === m
                            ? " && "
                            : m);
                    for (b = 0; b < o; b++) 
                        h += "(";
                    n && (h += "!");
                    h += "(" + a + ")";
                    n = !1;
                    m = "";
                    o = 0
                };
                this._setCommand = function (a, b) {
                    k = a;
                    l = b
                };
                this._resetNegate = function () {
                    n = !1
                };
                this._repeatCommand = function (a, b) {
                    return null === k
                        ? e
                        : null !== a && null !== b
                            ? k(a, b)
                            : null === l || !A
                                ? k(a)
                                : k(l, a)
                };
                this._equals = function (a, b) {
                    return 0 === e._compare(a, b, 1)
                };
                this._compare = function (a, b, e) {
                    var d = Object.prototype.toString;
                    void 0 === e && (e = 1);
                    void 0 === a && (a = null);
                    void 0 === b && (b = null);
                    if (null === a && null === b) 
                        return 0;
                    if (null === a && null !== b) 
                        return 1;
                    if (null !== a && null === b) 
                        return -1;
                    if ("[object Date]" === d.call(a) && "[object Date]" === d.call(b)) 
                        return a < b
                            ? -e
                            : a > b
                                ? e
                                : 0;
                    
                    !j && "number" !== typeof a && "number" !== typeof b && (a = "" + a, b = "" + b);
                    return a < b
                        ? -e
                        : a > b
                            ? e
                            : 0
                };
                this._performSort = function () {
                    0 !== t.length && (a = e._doSort(a, 0))
                };
                this._doSort = function (a, b) {
                    var d = t[b].by,
                        g = t[b].dir,
                        j = t[b].type,
                        c = t[b].datefmt;
                    if (b === t.length - 1) 
                        return e._getOrder(a, d, g, j, c);
                    b++;
                    for (var d = e._getGroup(a, d, g, j, c), g = [], f, j = 0; j < d.length; j++) {
                        f = e._doSort(d[j].items, b);
                        for (c = 0; c < f.length; c++) 
                            g.push(f[c])
                    }
                    return g
                };
                this._getOrder = function (a, d, g, c, f) {
                    var h = [],
                        k = [],
                        l = "a" === g
                            ? 1
                            : -1,
                        o,
                        n;
                    void 0 === c && (c = "text");
                    n = "float" === c || "number" === c || "currency" === c || "numeric" === c
                        ? function (a) {
                            a = parseFloat(("" + a).replace(i, ""));
                            return isNaN(a)
                                ? 0
                                : a
                        }
                        : "int" === c || "integer" === c
                            ? function (a) {
                                return a
                                    ? parseFloat(("" + a).replace(i, ""))
                                    : 0
                            }
                            : "date" === c || "datetime" === c
                                ? function (a) {
                                    return b
                                        .jgrid
                                        .parseDate(f, a)
                                        .getTime()
                                }
                                : b.isFunction(c)
                                    ? c
                                    : function (a) {
                                        a = a
                                            ? b.trim("" + a)
                                            : "";
                                        return j
                                            ? a
                                            : a.toLowerCase()
                                    };
                    b.each(a, function (a, e) {
                        o = "" !== d
                            ? b
                                .jgrid
                                .getAccessor(e, d)
                            : e;
                        void 0 === o && (o = "");
                        o = n(o, e);
                        k.push({vSort: o, index: a})
                    });
                    k.sort(function (a, b) {
                        a = a.vSort;
                        b = b.vSort;
                        return e._compare(a, b, l)
                    });
                    for (var c = 0, m = a.length; c < m;) 
                        g = k[c].index,
                        h.push(a[g]),
                        c++;
                    return h
                };
                this._getGroup = function (a, d, g, j, c) {
                    var f = [],
                        h = null,
                        i = null,
                        k;
                    b.each(e._getOrder(a, d, g, j, c), function (a, g) {
                        k = b
                            .jgrid
                            .getAccessor(g, d);
                        null == k && (k = "");
                        e._equals(i, k) || (i = k, null !== h && f.push(h), h = e._group(d, k));
                        h
                            .items
                            .push(g)
                    });
                    null !== h && f.push(h);
                    return f
                };
                this.ignoreCase = function () {
                    j = !1;
                    return e
                };
                this.useCase = function () {
                    j = !0;
                    return e
                };
                this.trim = function () {
                    g = !0;
                    return e
                };
                this.noTrim = function () {
                    g = !1;
                    return e
                };
                this.execute = function () {
                    var d = h,
                        g = [];
                    if (null === d) 
                        return e;
                    b
                        .each(a, function () {
                            eval(d) && g.push(this)
                        });
                    a = g;
                    return e
                };
                this.data = function () {
                    return a
                };
                this.select = function (d) {
                    e._performSort();
                    if (!e._hasData()) 
                        return [];
                    e.execute();
                    if (b.isFunction(d)) {
                        var g = [];
                        b.each(a, function (a, b) {
                            g.push(d(b))
                        });
                        return g
                    }
                    return a
                };
                this.hasMatch = function () {
                    if (!e._hasData()) 
                        return !1;
                    e.execute();
                    return 0 < a.length
                };
                this.andNot = function (a, b, d) {
                    n = !n;
                    return e.and(a, b, d)
                };
                this.orNot = function (a, b, d) {
                    n = !n;
                    return e.or(a, b, d)
                };
                this.not = function (a, b, d) {
                    return e.andNot(a, b, d)
                };
                this.and = function (a, b, d) {
                    m = " && ";
                    return void 0 === a
                        ? e
                        : e._repeatCommand(a, b, d)
                };
                this.or = function (a, b, d) {
                    m = " || ";
                    return void 0 === a
                        ? e
                        : e._repeatCommand(a, b, d)
                };
                this.orBegin = function () {
                    o++;
                    return e
                };
                this.orEnd = function () {
                    null !== h && (h += ")");
                    return e
                };
                this.isNot = function (a) {
                    n = !n;
                    return e.is(a)
                };
                this.is = function (a) {
                    e._append("this." + a);
                    e._resetNegate();
                    return e
                };
                this._compareValues = function (a, d, g, j, c) {
                    var f;
                    f = A
                        ? "jQuery.jgrid.getAccessor(this,'" + d + "')"
                        : "this";
                    void 0 === g && (g = null);
                    var h = g,
                        k = void 0 === c.stype
                            ? "text"
                            : c.stype;
                    if (null !== g) 
                        switch (k) {
                            case "int":
                            case "integer":
                                h = isNaN(Number(h)) || "" === h
                                    ? "0"
                                    : h;
                                f = "parseInt(" + f + ",10)";
                                h = "parseInt(" + h + ",10)";
                                break;
                            case "float":
                            case "number":
                            case "numeric":
                                h = ("" + h).replace(i, "");
                                h = isNaN(Number(h)) || "" === h
                                    ? "0"
                                    : h;
                                f = "parseFloat(" + f + ")";
                                h = "parseFloat(" + h + ")";
                                break;
                            case "date":
                            case "datetime":
                                h = "" + b
                                    .jgrid
                                    .parseDate(c.newfmt || "Y-m-d", h)
                                    .getTime();
                                f = 'jQuery.jgrid.parseDate("' + c.srcfmt + '",' + f + ").getTime()";
                                break;
                            default:
                                f = e._getStr(f),
                                h = e._getStr('"' + e._toStr(h) + '"')
                        }
                    e._append(f + " " + j + " " + h);
                    e._setCommand(a, d);
                    e._resetNegate();
                    return e
                };
                this.equals = function (a, b, d) {
                    return e._compareValues(e.equals, a, b, "==", d)
                };
                this.notEquals = function (a, b, d) {
                    return e._compareValues(e.equals, a, b, "!==", d)
                };
                this.isNull = function (a, b, d) {
                    return e._compareValues(e.equals, a, null, "===", d)
                };
                this.greater = function (a, b, d) {
                    return e._compareValues(e.greater, a, b, ">", d)
                };
                this.less = function (a, b, d) {
                    return e._compareValues(e.less, a, b, "<", d)
                };
                this.greaterOrEquals = function (a, b, d) {
                    return e._compareValues(e.greaterOrEquals, a, b, ">=", d)
                };
                this.lessOrEquals = function (a, b, d) {
                    return e._compareValues(e.lessOrEquals, a, b, "<=", d)
                };
                this.startsWith = function (a, d) {
                    var c = null == d
                            ? a
                            : d,
                        c = g
                            ? b
                                .trim(c.toString())
                                .length
                            : c
                                .toString()
                                .length;
                    A
                        ? e._append(e._getStr("jQuery.jgrid.getAccessor(this,'" + a + "')") + ".substr(0," + c + ") == " + e._getStr('"' + e._toStr(d) + '"'))
                        : (c = g
                            ? b.trim(d.toString()).length
                            : d.toString().length, e._append(e._getStr("this") + ".substr(0," + c + ") == " + e._getStr('"' + e._toStr(a) + '"')));
                    e._setCommand(e.startsWith, a);
                    e._resetNegate();
                    return e
                };
                this.endsWith = function (a, d) {
                    var c = null == d
                            ? a
                            : d,
                        c = g
                            ? b
                                .trim(c.toString())
                                .length
                            : c
                                .toString()
                                .length;
                    A
                        ? e._append(e._getStr("jQuery.jgrid.getAccessor(this,'" + a + "')") + ".substr(" + e._getStr("jQuery.jgrid.getAccessor(this,'" + a + "')") + ".length-" + c + "," + c + ') == "' + e._toStr(d) + '"')
                        : e._append(e._getStr("this") + ".substr(" + e._getStr("this") + '.length-"' + e._toStr(a) + '".length,"' + e._toStr(a) + '".length) == "' + e._toStr(a) + '"');
                    e._setCommand(e.endsWith, a);
                    e._resetNegate();
                    return e
                };
                this.contains = function (a, b) {
                    A
                        ? e._append(e._getStr("jQuery.jgrid.getAccessor(this,'" + a + "')") + '.indexOf("' + e._toStr(b) + '",0) > -1')
                        : e._append(e._getStr("this") + '.indexOf("' + e._toStr(a) + '",0) > -1');
                    e._setCommand(e.contains, a);
                    e._resetNegate();
                    return e
                };
                this.groupBy = function (b, d, g, c) {
                    return !e._hasData()
                        ? null
                        : e._getGroup(a, b, d, g, c)
                };
                this.orderBy = function (a, d, g, c) {
                    d = null == d
                        ? "a"
                        : b.trim(d.toString().toLowerCase());
                    null == g && (g = "text");
                    null == c && (c = "Y-m-d");
                    if ("desc" === d || "descending" === d) 
                        d = "d";
                    if ("asc" === d || "ascending" === d) 
                        d = "a";
                    t.push({by: a, dir: d, type: g, datefmt: c});
                    return e
                };
                return e
            }(d, null)
        },
        getMethod: function (d) {
            return this.getAccessor(b.fn.jqGrid, d)
        },
        extend: function (d) {
            b.extend(b.fn.jqGrid, d);
            this.no_legacy_api || b
                .fn
                .extend(d)
        }
    });
    b.fn.jqGrid = function (d) {
        if ("string" === typeof d) {
            var f = b
                .jgrid
                .getMethod(d);
            if (!f) 
                throw "jqGrid - No such method: " + d;
            var c = b
                .makeArray(arguments)
                .slice(1);
            return f.apply(this, c)
        }
        return this.each(function () {
            if (!this.grid) {
                var e = b.extend(!0, {
                        url: "",
                        height: 150,
                        page: 1,
                        rowNum: 20,
                        rowTotal: null,
                        records: 0,
                        pager: "",
                        pgbuttons: !0,
                        pginput: !0,
                        colModel: [],
                        rowList: [],
                        colNames: [],
                        sortorder: "asc",
                        sortname: "",
                        datatype: "xml",
                        mtype: "GET",
                        altRows: !1,
                        selarrrow: [],
                        savedRow: [],
                        shrinkToFit: !0,
                        xmlReader: {},
                        jsonReader: {},
                        subGrid: !1,
                        subGridModel: [],
                        reccount: 0,
                        lastpage: 0,
                        lastsort: 0,
                        selrow: null,
                        beforeSelectRow: null,
                        onSelectRow: null,
                        onSortCol: null,
                        ondblClickRow: null,
                        onRightClickRow: null,
                        onPaging: null,
                        onSelectAll: null,
                        onInitGrid: null,
                        loadComplete: null,
                        gridComplete: null,
                        loadError: null,
                        loadBeforeSend: null,
                        afterInsertRow: null,
                        beforeRequest: null,
                        beforeProcessing: null,
                        onHeaderClick: null,
                        viewrecords: !1,
                        loadonce: !1,
                        multiselect: !1,
                        multikey: !1,
                        editurl: null,
                        search: !1,
                        caption: "",
                        hidegrid: !0,
                        hiddengrid: !1,
                        postData: {},
                        userData: {},
                        treeGrid: !1,
                        treeGridModel: "nested",
                        treeReader: {},
                        treeANode: -1,
                        ExpandColumn: null,
                        tree_root_level: 0,
                        prmNames: {
                            page: "page",
                            rows: "rows",
                            sort: "sidx",
                            order: "sord",
                            search: "_search",
                            nd: "nd",
                            id: "id",
                            oper: "oper",
                            editoper: "edit",
                            addoper: "add",
                            deloper: "del",
                            subgridid: "id",
                            npage: null,
                            totalrows: "totalrows"
                        },
                        forceFit: !1,
                        gridstate: "visible",
                        cellEdit: !1,
                        cellsubmit: "remote",
                        nv: 0,
                        loadui: "enable",
                        toolbar: [
                            !1,
                            ""
                        ],
                        scroll: !1,
                        multiboxonly: !1,
                        deselectAfterSort: !0,
                        scrollrows: !1,
                        autowidth: !1,
                        scrollOffset: 18,
                        cellLayout: 5,
                        subGridWidth: 20,
                        multiselectWidth: 20,
                        gridview: !1,
                        rownumWidth: 25,
                        rownumbers: !1,
                        pagerpos: "left",
                        recordpos: "right",
                        footerrow: !1,
                        userDataOnFooter: !1,
                        hoverrows: !0,
                        altclass: "ui-priority-secondary",
                        viewsortcols: [
                            !1,
                            "vertical",
                            !0
                        ],
                        resizeclass: "",
                        autoencode: !1,
                        remapColumns: [],
                        ajaxGridOptions: {},
                        direction: "ltr",
                        toppager: !1,
                        headertitles: !1,
                        scrollTimeout: 40,
                        data: [],
                        _index: {},
                        grouping: !1,
                        groupingView: {
                            groupField: [],
                            groupOrder: [],
                            groupText: [],
                            groupColumnShow: [],
                            groupSummary: [],
                            showSummaryOnHide: !1,
                            sortitems: [],
                            sortnames: [],
                            summary: [],
                            summaryval: [],
                            plusicon: "ui-icon-circlesmall-plus",
                            minusicon: "ui-icon-circlesmall-minus",
                            displayField: []
                        },
                        ignoreCase: !1,
                        cmTemplate: {},
                        idPrefix: "",
                        multiSort: !1
                    }, b.jgrid.defaults, d || {}),
                    a = this,
                    c = {
                        headers: [],
                        cols: [],
                        footers: [],
                        dragStart: function (c, d, g) {
                            this.resizing = {
                                idx: c,
                                startX: d.clientX,
                                sOL: g[0]
                            };
                            this.hDiv.style.cursor = "col-resize";
                            this.curGbox = b("#rs_m" + b.jgrid.jqID(e.id), "#gbox_" + b.jgrid.jqID(e.id));
                            this
                                .curGbox
                                .css({display: "block", left: g[0], top: g[1], height: g[2]});
                            b(a).triggerHandler("jqGridResizeStart", [d, c]);
                            b.isFunction(e.resizeStart) && e
                                .resizeStart
                                .call(a, d, c);
                            document.onselectstart = function () {
                                return !1
                            }
                        },
                        dragMove: function (a) {
                            if (this.resizing) {
                                var b = a.clientX - this.resizing.startX,
                                    a = this.headers[this.resizing.idx],
                                    c = "ltr" === e.direction
                                        ? a.width + b
                                        : a.width - b,
                                    d;
                                33 < c && (this.curGbox.css({
                                    left: this.resizing.sOL + b
                                }), !0 === e.forceFit
                                    ? (d = this.headers[this.resizing.idx + e.nv], b = "ltr" === e.direction
                                        ? d.width - b
                                        : d.width + b, 33 < b && (a.newWidth = c, d.newWidth = b))
                                    : (this.newWidth = "ltr" === e.direction
                                        ? e.tblwidth + b
                                        : e.tblwidth - b, a.newWidth = c))
                            }
                        },
                        dragEnd: function () {
                            this.hDiv.style.cursor = "default";
                            if (this.resizing) {
                                var c = this.resizing.idx,
                                    d = this.headers[c].newWidth || this.headers[c].width,
                                    d = parseInt(d, 10);
                                this.resizing = !1;
                                b("#rs_m" + b.jgrid.jqID(e.id)).css("display", "none");
                                e.colModel[c].width = d;
                                this.headers[c].width = d;
                                this.headers[c].el.style.width = d + "px";
                                this.cols[c].style.width = d + "px";
                                0 < this.footers.length && (this.footers[c].style.width = d + "px");
                                !0 === e.forceFit
                                    ? (d = this.headers[c + e.nv].newWidth || this.headers[c + e.nv].width, this.headers[c + e.nv].width = d, this.headers[c + e.nv].el.style.width = d + "px", this.cols[c + e.nv].style.width = d + "px", 0 < this.footers.length && (this.footers[c + e.nv].style.width = d + "px"), e.colModel[c + e.nv].width = d)
                                    : (e.tblwidth = this.newWidth || e.tblwidth, b("table:first", this.bDiv).css("width", e.tblwidth + "px"), b("table:first", this.hDiv).css("width", e.tblwidth + "px"), this.hDiv.scrollLeft = this.bDiv.scrollLeft, e.footerrow && (b("table:first", this.sDiv).css("width", e.tblwidth + "px"), this.sDiv.scrollLeft = this.bDiv.scrollLeft));
                                b(a).triggerHandler("jqGridResizeStop", [d, c]);
                                b.isFunction(e.resizeStop) && e
                                    .resizeStop
                                    .call(a, d, c)
                            }
                            this.curGbox = null;
                            document.onselectstart = function () {
                                return !0
                            }
                        },
                        populateVisible: function () {
                            c.timer && clearTimeout(c.timer);
                            c.timer = null;
                            var a = b(c.bDiv).height();
                            if (a) {
                                var d = b("table:first", c.bDiv),
                                    g,
                                    f;
                                if (d[0].rows.length) 
                                    try {
                                        f = (g = d[0].rows[1])
                                            ? b(g).outerHeight() || c.prevRowHeight
                                            : c.prevRowHeight
                                    } catch (ua) {
                                        f = c.prevRowHeight
                                    }
                                if (f) {
                                    c.prevRowHeight = f;
                                    var h = e.rowNum;
                                    g = c.scrollTop = c.bDiv.scrollTop;
                                    var i = Math.round(d.position().top) - g,
                                        k = i + d.height();
                                    f *= h;
                                    var z,
                                        F,
                                        y;
                                    if (k < a && 0 >= i && (void 0 === e.lastpage || parseInt((k + g + f - 1) / f, 10) <= e.lastpage)) 
                                        F = parseInt((a - k + f - 1) / f, 10),
                                        0 <= k || 2 > F || !0 === e.scroll
                                            ? (z = Math.round((k + g) / f) + 1, i = -1)
                                            : i = 1;
                                    
                                    0 < i && (z = parseInt(g / f, 10) + 1, F = parseInt((g + a) / f, 10) + 2 - z, y = !0);
                                    if (F && (!e.lastpage || !(z > e.lastpage || 1 === e.lastpage || z === e.page && z === e.lastpage))) 
                                        c.hDiv.loading
                                            ? c.timer = setTimeout(c.populateVisible, e.scrollTimeout)
                                            : (e.page = z, y && (c.selectionPreserver(d[0]), c.emptyRows.call(d[0], !1, !1)), c.populate(F))
                                    }
                            }
                        },
                        scrollGrid: function (a) {
                            if (e.scroll) {
                                var b = c.bDiv.scrollTop;
                                void 0 === c.scrollTop && (c.scrollTop = 0);
                                b !== c.scrollTop && (c.scrollTop = b, c.timer && clearTimeout(c.timer), c.timer = setTimeout(c.populateVisible, e.scrollTimeout))
                            }
                            c.hDiv.scrollLeft = c.bDiv.scrollLeft;
                            e.footerrow && (c.sDiv.scrollLeft = c.bDiv.scrollLeft);
                            a && a.stopPropagation()
                        },
                        selectionPreserver: function (a) {
                            var c = a.p,
                                d = c.selrow,
                                e = c.selarrrow
                                    ? b.makeArray(c.selarrrow)
                                    : null,
                                g = a.grid.bDiv.scrollLeft,
                                f = function () {
                                    var h;
                                    c.selrow = null;
                                    c.selarrrow = [];
                                    if (c.multiselect && e && 0 < e.length) 
                                        for (h = 0; h < e.length; h++) 
                                            e[h] !== d && b(a).jqGrid("setSelection", e[h], !1, null);
                                d && b(a).jqGrid("setSelection", d, !1, null);
                                    a.grid.bDiv.scrollLeft = g;
                                    b(a).unbind(".selectionPreserver", f)
                                };
                            b(a).bind("jqGridGridComplete.selectionPreserver", f)
                        }
                    };
                if ("TABLE" !== this.tagName.toUpperCase()) 
                    alert("Element is not a table");
                else if (void 0 !== document.documentMode && 5 >= document.documentMode) 
                    alert("Grid can not be used in this ('quirks') mode!");
                else {
                    b(this)
                        .empty()
                        .attr("tabindex", "0");
                    this.p = e;
                    this.p.useProp = !!b.fn.prop;
                    var g,
                        f;
                    if (0 === this.p.colNames.length) 
                        for (g = 0; g < this.p.colModel.length; g++) 
                            this.p.colNames[g] = this.p.colModel[g].label || this.p.colModel[g].name;
                if (this.p.colNames.length !== this.p.colModel.length) 
                        alert(b.jgrid.errors.model);
                    else {
                        var i = b("<div class='ui-jqgrid-view'></div>"),
                            k = b.jgrid.msie;
                        a.p.direction = b.trim(a.p.direction.toLowerCase());
                        -1 === b.inArray(a.p.direction, ["ltr", "rtl"]) && (a.p.direction = "ltr");
                        f = a.p.direction;
                        b(i).insertBefore(this);
                        b(this)
                            .removeClass("scroll")
                            .appendTo(i);
                        var l = b("<div class='ui-jqgrid ui-widget ui-widget-content ui-corner-all'></div>");
                        b(l)
                            .attr({
                            id: "gbox_" + this.id,
                            dir: f
                        })
                            .insertBefore(i);
                        b(i)
                            .attr("id", "gview_" + this.id)
                            .appendTo(l);
                        b("<div class='ui-widget-overlay jqgrid-overlay' id='lui_" + this.id + "'></div>").insertBefore(i);
                        b("<div class='loading ui-state-default ui-state-active' id='load_" + this.id + "'>" + this.p.loadtext + "</div>").insertBefore(i);
                        b(this).attr({
                            cellspacing: "0",
                            cellpadding: "0",
                            border: "0",
                            role: "grid",
                            "aria-multiselectable": !!this.p.multiselect,
                            "aria-labelledby": "gbox_" + this.id
                        });
                        var o = function (a, b) {
                                a = parseInt(a, 10);
                                return isNaN(a)
                                    ? b || 0
                                    : a
                            },
                            n = function (d, e, g, f, h, i) {
                                var R = a.p.colModel[d],
                                    k = R.align,
                                    z = 'style="',
                                    F = R.classes,
                                    y = R.name,
                                    G = [];
                                k && (z = z + ("text-align:" + k + ";"));
                                R.hidden === true && (z = z + "display:none;");
                                if (e === 0) 
                                    z = z + ("width: " + c.headers[d].width + "px;");
                                else if (R.cellattr && b.isFunction(R.cellattr)) 
                                    if ((d = R.cellattr.call(a, h, g, f, R, i)) && typeof d === "string") {
                                        d = d
                                            .replace(/style/i, "style")
                                            .replace(/title/i, "title");
                                        if (d.indexOf("title") > -1) 
                                            R.title = false;
                                        d.indexOf("class") > -1 && (F = void 0);
                                        G = d.split(/[^-]style/);
                                        if (G.length === 2) {
                                            G[1] = b.trim(G[1].replace("=", ""));
                                            if (G[1].indexOf("'") === 0 || G[1].indexOf('"') === 0) 
                                                G[1] = G[1].substring(1);
                                            z = z + G[1].replace(/'/gi, '"')
                                        } else 
                                            z = z + '"'
                                    }
                                if (!G.length) {
                                    G[0] = "";
                                    z = z + '"'
                                }
                                z = z + ((F !== void 0
                                    ? ' class="' + F + '"'
                                    : "") + (R.title && g
                                    ? ' title="' + b.jgrid.stripHtml(g) + '"'
                                    : ""));
                                z = z + (' aria-describedby="' + a.p.id + "_" + y + '"');
                                return z + G[0]
                            },
                            m = function (c) {
                                return c == null || c === ""
                                    ? "&#160;"
                                    : a.p.autoencode
                                        ? b
                                            .jgrid
                                            .htmlEncode(c)
                                        : "" + c
                            },
                            t = function (c, d, e, g, f) {
                                var h = a.p.colModel[e];
                                if (h.formatter !== void 0) {
                                    c = "" + a.p.idPrefix !== ""
                                        ? b
                                            .jgrid
                                            .stripPref(a.p.idPrefix, c)
                                        : c;
                                    c = {
                                        rowId: c,
                                        colModel: h,
                                        gid: a.p.id,
                                        pos: e
                                    };
                                    d = b.isFunction(h.formatter)
                                        ? h
                                            .formatter
                                            .call(a, d, c, g, f)
                                        : b.fmatter
                                            ? b
                                                .fn
                                                .fmatter
                                                .call(a, h.formatter, d, c, g, f)
                                            : m(d)
                                } else 
                                    d = m(d);
                                return d
                            },
                            A = function (a, b, c, d, e, g) {
                                b = t(a, b, c, e, "add");
                                return '<td role="gridcell" ' + n(c, d, b, e, a, g) + ">" + b + "</td>"
                            },
                            T = function (b, c, d, e) {
                                e = '<div style="width:23px;height:30px;position:relative;"><input role="checkbox" type="checkbox" id="jqg_' + a.p.id + "_" + b + '" class="cbox" name="jqg_' + a.p.id + "_" + b + '"' + (e
                                    ? 'checked="checked"'
                                    : "") + "/><label></label></div>";
                                return '<td role="gridcell" ' + n(c, d, "", null, b, true) + ">" + e + "</td>"
                            },
                            M = function (a, b, c, d) {
                                c = (parseInt(c, 10) - 1) * parseInt(d, 10) + 1 + b;
                                return '<td role="gridcell" class="ui-state-default jqgrid-rownum" ' + n(a, b, c, null, b, true) + ">" + c + "</td>"
                            },
                            $ = function (b) {
                                var c,
                                    d = [],
                                    e = 0,
                                    g;
                                for (g = 0; g < a.p.colModel.length; g++) {
                                    c = a.p.colModel[g];
                                    if (c.name !== "cb" && c.name !== "subgrid" && c.name !== "rn") {
                                        d[e] = b === "local"
                                            ? c.name
                                            : b === "xml" || b === "xmlstring"
                                                ? c.xmlmap || c.name
                                                : c.jsonmap || c.name;
                                        e++
                                    }
                                }
                                return d
                            },
                            U = function (c) {
                                var d = a.p.remapColumns;
                                if (!d || !d.length) 
                                    d = b.map(a.p.colModel, function (a, b) {
                                        return b
                                    });
                                c && (d = b.map(d, function (a) {
                                    return a < c
                                        ? null
                                        : a - c
                                }));
                                return d
                            },
                            V = function (a, c) {
                                var d;
                                if (this.p.deepempty) 
                                    b(this.rows).slice(1).remove();
                                else {
                                    d = this.rows.length > 0
                                        ? this.rows[0]
                                        : null;
                                    b(this.firstChild)
                                        .empty()
                                        .append(d)
                                }
                                if (a && this.p.scroll) {
                                    b(this.grid.bDiv.firstChild).css({height: "auto"});
                                    b(this.grid.bDiv.firstChild.firstChild).css({height: 0, display: "none"});
                                    if (this.grid.bDiv.scrollTop !== 0) 
                                        this.grid.bDiv.scrollTop = 0
                                }
                                if (c === true && this.p.treeGrid) {
                                    this.p.data = [];
                                    this.p._index = {}
                                }
                            },
                            N = function () {
                                var c = a.p.data.length,
                                    d,
                                    e,
                                    g;
                                d = a.p.rownumbers === true
                                    ? 1
                                    : 0;
                                e = a.p.multiselect === true
                                    ? 1
                                    : 0;
                                g = a.p.subGrid === true
                                    ? 1
                                    : 0;
                                d = a.p.keyIndex === false || a.p.loadonce === true
                                    ? a.p.localReader.id
                                    : a.p.colModel[a.p.keyIndex + e + g + d].name;
                                for (e = 0; e < c; e++) {
                                    g = b
                                        .jgrid
                                        .getAccessor(a.p.data[e], d);
                                    g === void 0 && (g = "" + (e + 1));
                                    a.p._index[g] = e
                                }
                            },
                            X = function (c, d, e, g, f, h) {
                                var j = "-1",
                                    i = "",
                                    k,
                                    d = d
                                        ? "display:none;"
                                        : "",
                                    e = "ui-widget-content jqgrow ui-row-" + a.p.direction + (e
                                        ? " " + e
                                        : "") + (h
                                        ? " ui-state-highlight"
                                        : ""),
                                    h = b(a).triggerHandler("jqGridRowAttr", [g, f, c]);
                                typeof h !== "object" && (h = b.isFunction(a.p.rowattr)
                                    ? a.p.rowattr.call(a, g, f, c)
                                    : {});
                                if (!b.isEmptyObject(h)) {
                                    if (h.hasOwnProperty("id")) {
                                        c = h.id;
                                        delete h.id
                                    }
                                    if (h.hasOwnProperty("tabindex")) {
                                        j = h.tabindex;
                                        delete h.tabindex
                                    }
                                    if (h.hasOwnProperty("style")) {
                                        d = d + h.style;
                                        delete h.style
                                    }
                                    if (h.hasOwnProperty("class")) {
                                        e = e + (" " + h["class"]);
                                        delete h["class"]
                                    }
                                    try {
                                        delete h.role
                                    } catch (F) {}
                                    for (k in h) 
                                        h.hasOwnProperty(k) && (i = i + (" " + k + "=" + h[k]))
                                }
                                return '<tr role="row" id="' + c + '" tabindex="' + j + '" class="' + e + '"' + (d === ""
                                    ? ""
                                    : ' style="' + d + '"') + i + ">"
                            },
                            J = function (c, d, e, g, f) {
                                var h = new Date,
                                    j = a.p.datatype !== "local" && a.p.loadonce || a.p.datatype === "xmlstring",
                                    i = a.p.xmlReader,
                                    k = a.p.datatype === "local"
                                        ? "local"
                                        : "xml";
                                if (j) {
                                    a.p.data = [];
                                    a.p._index = {};
                                    a.p.localReader.id = "_id_"
                                }
                                a.p.reccount = 0;
                                if (b.isXMLDoc(c)) {
                                    if (a.p.treeANode === -1 && !a.p.scroll) {
                                        V.call(a, false, true);
                                        e = 1
                                    } else 
                                        e = e > 1
                                            ? e
                                            : 1;
                                    var F = b(a),
                                        y,
                                        G,
                                        l = 0,
                                        o,
                                        s = a.p.multiselect === true
                                            ? 1
                                            : 0,
                                        u = 0,
                                        n,
                                        m = a.p.rownumbers === true
                                            ? 1
                                            : 0,
                                        t,
                                        p = [],
                                        E,
                                        q = {},
                                        x,
                                        D,
                                        r = [],
                                        K = a.p.altRows === true
                                            ? a.p.altclass
                                            : "",
                                        v;
                                    if (a.p.subGrid === true) {
                                        u = 1;
                                        n = b
                                            .jgrid
                                            .getMethod("addSubGridCell")
                                    }
                                    i.repeatitems || (p = $(k));
                                    t = a.p.keyIndex === false
                                        ? b.isFunction(i.id)
                                            ? i
                                                .id
                                                .call(a, c)
                                            : i.id
                                        : a.p.keyIndex;
                                    if (p.length > 0 && !isNaN(t)) {
                                        a.p.remapColumns && a.p.remapColumns.length && (t = b.inArray(t, a.p.remapColumns));
                                        t = p[t]
                                    }
                                    k = ("" + t).indexOf("[") === -1
                                        ? p.length
                                            ? function (a, c) {
                                                return b(t, a).text() || c
                                            }
                                            : function (a, c) {
                                                return b(i.cell, a)
                                                    .eq(t)
                                                    .text() || c
                                            }
                                        : function (a, b) {
                                            return a.getAttribute(t.replace(/[\[\]]/g, "")) || b
                                        };
                                    a.p.userData = {};
                                    a.p.page = b
                                        .jgrid
                                        .getXmlData(c, i.page) || a.p.page || 0;
                                    a.p.lastpage = b
                                        .jgrid
                                        .getXmlData(c, i.total);
                                    if (a.p.lastpage === void 0) 
                                        a.p.lastpage = 1;
                                    a.p.records = b
                                        .jgrid
                                        .getXmlData(c, i.records) || 0;
                                    b.isFunction(i.userdata)
                                        ? a.p.userData = i
                                            .userdata
                                            .call(a, c) || {}
                                        : b
                                            .jgrid
                                            .getXmlData(c, i.userdata, true)
                                            .each(function () {
                                                a.p.userData[this.getAttribute("name")] = b(this).text()
                                            });
                                    c = b
                                        .jgrid
                                        .getXmlData(c, i.root, true);
                                    (c = b.jgrid.getXmlData(c, i.row, true)) || (c = []);
                                    var w = c.length,
                                        L = 0,
                                        B = [],
                                        C = parseInt(a.p.rowNum, 10),
                                        H = a.p.scroll
                                            ? b
                                                .jgrid
                                                .randId()
                                            : 1;
                                    if (w > 0 && a.p.page <= 0) 
                                        a.p.page = 1;
                                    if (c && w) {
                                        f && (C = C * (f + 1));
                                        var f = b.isFunction(a.p.afterInsertRow),
                                            J = false,
                                            I;
                                        if (a.p.grouping) {
                                            J = a.p.groupingView.groupCollapse === true;
                                            I = b
                                                .jgrid
                                                .getMethod("groupingPrepare")
                                        }
                                        for (; L < w;) {
                                            x = c[L];
                                            D = k(x, H + L);
                                            D = a.p.idPrefix + D;
                                            y = e === 0
                                                ? 0
                                                : e + 1;
                                            v = (y + L) % 2 === 1
                                                ? K
                                                : "";
                                            var O = r.length;
                                            r.push("");
                                            m && r.push(M(0, L, a.p.page, a.p.rowNum));
                                            s && r.push(T(D, m, L, false));
                                            u && r.push(n.call(F, s + m, L + e));
                                            if (i.repeatitems) {
                                                E || (E = U(s + u + m));
                                                var N = b
                                                    .jgrid
                                                    .getXmlData(x, i.cell, true);
                                                b.each(E, function (b) {
                                                    var c = N[this];
                                                    if (!c) 
                                                        return false;
                                                    o = c.textContent || c.text;
                                                    q[a.p.colModel[b + s + u + m].name] = o;
                                                    r.push(A(D, o, b + s + u + m, L + e, x, q))
                                                })
                                            } else 
                                                for (y = 0; y < p.length; y++) {
                                                    o = b
                                                        .jgrid
                                                        .getXmlData(x, p[y]);
                                                    q[a.p.colModel[y + s + u + m].name] = o;
                                                    r.push(A(D, o, y + s + u + m, L + e, x, q))
                                                }
                                            r[O] = X(D, J, v, q, x, false);
                                            r.push("</tr>");
                                            if (a.p.grouping) {
                                                B = I.call(F, r, B, q, L);
                                                r = []
                                            }
                                            if (j || a.p.treeGrid === true) {
                                                q._id_ = b
                                                    .jgrid
                                                    .stripPref(a.p.idPrefix, D);
                                                a
                                                    .p
                                                    .data
                                                    .push(q);
                                                a.p._index[q._id_] = a.p.data.length - 1
                                            }
                                            if (a.p.gridview === false) {
                                                b("tbody:first", d).append(r.join(""));
                                                F.triggerHandler("jqGridAfterInsertRow", [D, q, x]);
                                                f && a
                                                    .p
                                                    .afterInsertRow
                                                    .call(a, D, q, x);
                                                r = []
                                            }
                                            q = {};
                                            l++;
                                            L++;
                                            if (l === C) 
                                                break
                                        }
                                    }
                                    if (a.p.gridview === true) {
                                        G = a.p.treeANode > -1
                                            ? a.p.treeANode
                                            : 0;
                                        if (a.p.grouping) {
                                            F.jqGrid("groupingRender", B, a.p.colModel.length);
                                            B = null
                                        } else 
                                            a.p.treeGrid === true && G > 0
                                                ? b(a.rows[G]).after(r.join(""))
                                                : b("tbody:first", d).append(r.join(""))
                                        }
                                    if (a.p.subGrid === true) 
                                        try {
                                            F.jqGrid("addSubGrid", s + m)
                                        } catch (Q) {}
                                    a.p.totaltime = new Date - h;
                                    if (l > 0 && a.p.records === 0) 
                                        a.p.records = w;
                                    r = null;
                                    if (a.p.treeGrid === true) 
                                        try {
                                            F.jqGrid("setTreeNode", G + 1, l + G + 1)
                                        } catch (S) {}
                                    if (!a.p.treeGrid && !a.p.scroll) 
                                        a.grid.bDiv.scrollTop = 0;
                                    a.p.reccount = l;
                                    a.p.treeANode = -1;
                                    a.p.userDataOnFooter && F.jqGrid("footerData", "set", a.p.userData, true);
                                    if (j) {
                                        a.p.records = w;
                                        a.p.lastpage = Math.ceil(w / C)
                                    }
                                    g || a.updatepager(false, true);
                                    if (j) 
                                        for (; l < w;) {
                                            x = c[l];
                                            D = k(x, l + H);
                                            D = a.p.idPrefix + D;
                                            if (i.repeatitems) {
                                                E || (E = U(s + u + m));
                                                var P = b
                                                    .jgrid
                                                    .getXmlData(x, i.cell, true);
                                                b.each(E, function (b) {
                                                    var c = P[this];
                                                    if (!c) 
                                                        return false;
                                                    o = c.textContent || c.text;
                                                    q[a.p.colModel[b + s + u + m].name] = o
                                                })
                                            } else 
                                                for (y = 0; y < p.length; y++) {
                                                    o = b
                                                        .jgrid
                                                        .getXmlData(x, p[y]);
                                                    q[a.p.colModel[y + s + u + m].name] = o
                                                }
                                            q._id_ = b
                                                .jgrid
                                                .stripPref(a.p.idPrefix, D);
                                            a
                                                .p
                                                .data
                                                .push(q);
                                            a.p._index[q._id_] = a.p.data.length - 1;
                                            q = {};
                                            l++
                                        }
                                    }
                            },
                            S = function (c, d, e, g, f) {
                                var h = new Date;
                                if (c) {
                                    if (a.p.treeANode === -1 && !a.p.scroll) {
                                        V.call(a, false, true);
                                        e = 1
                                    } else 
                                        e = e > 1
                                            ? e
                                            : 1;
                                    var i,
                                        j = a.p.datatype !== "local" && a.p.loadonce || a.p.datatype === "jsonstring";
                                    if (j) {
                                        a.p.data = [];
                                        a.p._index = {};
                                        a.p.localReader.id = "_id_"
                                    }
                                    a.p.reccount = 0;
                                    if (a.p.datatype === "local") {
                                        d = a.p.localReader;
                                        i = "local"
                                    } else {
                                        d = a.p.jsonReader;
                                        i = "json"
                                    }
                                    var k = b(a),
                                        l = 0,
                                        y,
                                        o,
                                        n,
                                        m = [],
                                        s = a.p.multiselect
                                            ? 1
                                            : 0,
                                        u = a.p.subGrid === true
                                            ? 1
                                            : 0,
                                        t,
                                        p = a.p.rownumbers === true
                                            ? 1
                                            : 0,
                                        w = U(s + u + p);
                                    i = $(i);
                                    var v,
                                        E,
                                        q,
                                        x = {},
                                        D,
                                        r,
                                        K = [],
                                        B = a.p.altRows === true
                                            ? a.p.altclass
                                            : "",
                                        C;
                                    a.p.page = b
                                        .jgrid
                                        .getAccessor(c, d.page) || a.p.page || 0;
                                    E = b
                                        .jgrid
                                        .getAccessor(c, d.total);
                                    u && (t = b.jgrid.getMethod("addSubGridCell"));
                                    a.p.lastpage = E === void 0
                                        ? 1
                                        : E;
                                    a.p.records = b
                                        .jgrid
                                        .getAccessor(c, d.records) || 0;
                                    a.p.userData = b
                                        .jgrid
                                        .getAccessor(c, d.userdata) || {};
                                    q = a.p.keyIndex === false
                                        ? b.isFunction(d.id)
                                            ? d
                                                .id
                                                .call(a, c)
                                            : d.id
                                        : a.p.keyIndex;
                                    if (!d.repeatitems) {
                                        m = i;
                                        if (m.length > 0 && !isNaN(q)) {
                                            a.p.remapColumns && a.p.remapColumns.length && (q = b.inArray(q, a.p.remapColumns));
                                            q = m[q]
                                        }
                                    }
                                    E = b
                                        .jgrid
                                        .getAccessor(c, d.root);
                                    E == null && b.isArray(c) && (E = c);
                                    E || (E = []);
                                    c = E.length;
                                    o = 0;
                                    if (c > 0 && a.p.page <= 0) 
                                        a.p.page = 1;
                                    var L = parseInt(a.p.rowNum, 10),
                                        H = a.p.scroll
                                            ? b
                                                .jgrid
                                                .randId()
                                            : 1,
                                        J = false,
                                        I;
                                    f && (L = L * (f + 1));
                                    a.p.datatype === "local" && !a.p.deselectAfterSort && (J = true);
                                    var O = b.isFunction(a.p.afterInsertRow),
                                        N = [],
                                        P = false,
                                        Q;
                                    if (a.p.grouping) {
                                        P = a.p.groupingView.groupCollapse === true;
                                        Q = b
                                            .jgrid
                                            .getMethod("groupingPrepare")
                                    }
                                    for (; o < c;) {
                                        f = E[o];
                                        r = b
                                            .jgrid
                                            .getAccessor(f, q);
                                        if (r === void 0) {
                                            typeof q === "number" && a.p.colModel[q + s + u + p] != null && (r = b.jgrid.getAccessor(f, a.p.colModel[q + s + u + p].name));
                                            if (r === void 0) {
                                                r = H + o;
                                                if (m.length === 0 && d.cell) {
                                                    y = b
                                                        .jgrid
                                                        .getAccessor(f, d.cell) || f;
                                                    r = y != null && y[q] !== void 0
                                                        ? y[q]
                                                        : r
                                                }
                                            }
                                        }
                                        r = a.p.idPrefix + r;
                                        y = e === 1
                                            ? 0
                                            : e;
                                        C = (y + o) % 2 === 1
                                            ? B
                                            : "";
                                        J && (I = a.p.multiselect
                                            ? b.inArray(r, a.p.selarrrow) !== -1
                                            : r === a.p.selrow);
                                        var S = K.length;
                                        K.push("");
                                        p && K.push(M(0, o, a.p.page, a.p.rowNum));
                                        s && K.push(T(r, p, o, I));
                                        u && K.push(t.call(k, s + p, o + e));
                                        v = i;
                                        if (d.repeatitems) {
                                            d.cell && (f = b.jgrid.getAccessor(f, d.cell) || f);
                                            b.isArray(f) && (v = w)
                                        }
                                        for (n = 0; n < v.length; n++) {
                                            y = b
                                                .jgrid
                                                .getAccessor(f, v[n]);
                                            x[a.p.colModel[n + s + u + p].name] = y;
                                            K.push(A(r, y, n + s + u + p, o + e, f, x))
                                        }
                                        K[S] = X(r, P, C, x, f, I);
                                        K.push("</tr>");
                                        if (a.p.grouping) {
                                            N = Q.call(k, K, N, x, o);
                                            K = []
                                        }
                                        if (j || a.p.treeGrid === true) {
                                            x._id_ = b
                                                .jgrid
                                                .stripPref(a.p.idPrefix, r);
                                            a
                                                .p
                                                .data
                                                .push(x);
                                            a.p._index[x._id_] = a.p.data.length - 1
                                        }
                                        if (a.p.gridview === false) {
                                            b("#" + b.jgrid.jqID(a.p.id) + " tbody:first").append(K.join(""));
                                            k.triggerHandler("jqGridAfterInsertRow", [r, x, f]);
                                            O && a
                                                .p
                                                .afterInsertRow
                                                .call(a, r, x, f);
                                            K = []
                                        }
                                        x = {};
                                        l++;
                                        o++;
                                        if (l === L) 
                                            break
                                    }
                                    if (a.p.gridview === true) {
                                        D = a.p.treeANode > -1
                                            ? a.p.treeANode
                                            : 0;
                                        a.p.grouping
                                            ? k.jqGrid("groupingRender", N, a.p.colModel.length)
                                            : a.p.treeGrid === true && D > 0
                                                ? b(a.rows[D]).after(K.join(""))
                                                : b("#" + b.jgrid.jqID(a.p.id) + " tbody:first").append(K.join(""))
                                    }
                                    if (a.p.subGrid === true) 
                                        try {
                                            k.jqGrid("addSubGrid", s + p)
                                        } catch (aa) {}
                                    a.p.totaltime = new Date - h;
                                    if (l > 0 && a.p.records === 0) 
                                        a.p.records = c;
                                    if (a.p.treeGrid === true) 
                                        try {
                                            k.jqGrid("setTreeNode", D + 1, l + D + 1)
                                        } catch (W) {}
                                    if (!a.p.treeGrid && !a.p.scroll) 
                                        a.grid.bDiv.scrollTop = 0;
                                    a.p.reccount = l;
                                    a.p.treeANode = -1;
                                    a.p.userDataOnFooter && k.jqGrid("footerData", "set", a.p.userData, true);
                                    if (j) {
                                        a.p.records = c;
                                        a.p.lastpage = Math.ceil(c / L)
                                    }
                                    g || a.updatepager(false, true);
                                    if (j) 
                                        for (; l < c && E[l];) {
                                            f = E[l];
                                            r = b
                                                .jgrid
                                                .getAccessor(f, q);
                                            if (r === void 0) {
                                                typeof q === "number" && a.p.colModel[q + s + u + p] != null && (r = b.jgrid.getAccessor(f, a.p.colModel[q + s + u + p].name));
                                                if (r === void 0) {
                                                    r = H + l;
                                                    if (m.length === 0 && d.cell) {
                                                        e = b
                                                            .jgrid
                                                            .getAccessor(f, d.cell) || f;
                                                        r = e != null && e[q] !== void 0
                                                            ? e[q]
                                                            : r
                                                    }
                                                }
                                            }
                                            if (f) {
                                                r = a.p.idPrefix + r;
                                                v = i;
                                                if (d.repeatitems) {
                                                    d.cell && (f = b.jgrid.getAccessor(f, d.cell) || f);
                                                    b.isArray(f) && (v = w)
                                                }
                                                for (n = 0; n < v.length; n++) 
                                                    x[a.p.colModel[n + s + u + p].name] = b.jgrid.getAccessor(f, v[n]);
                                                x._id_ = b
                                                    .jgrid
                                                    .stripPref(a.p.idPrefix, r);
                                                a
                                                    .p
                                                    .data
                                                    .push(x);
                                                a.p._index[x._id_] = a.p.data.length - 1;
                                                x = {}
                                            }
                                            l++
                                        }
                                    }
                            },
                            ja = function () {
                                function c(a) {
                                    var b = 0,
                                        d,
                                        e,
                                        g,
                                        h,
                                        i;
                                    if (a.groups != null) {
                                        (e = a.groups.length && a.groupOp.toString().toUpperCase() === "OR") && s.orBegin();
                                        for (d = 0; d < a.groups.length; d++) {
                                            b > 0 && e && s.or();
                                            try {
                                                c(a.groups[d])
                                            } catch (j) {
                                                alert(j)
                                            }
                                            b++
                                        }
                                        e && s.orEnd()
                                    }
                                    if (a.rules != null) 
                                        try {
                                            (g = a.rules.length && a.groupOp.toString().toUpperCase() === "OR") && s.orBegin();
                                            for (d = 0; d < a.rules.length; d++) {
                                                i = a.rules[d];
                                                h = a
                                                    .groupOp
                                                    .toString()
                                                    .toUpperCase();
                                                if (p[i.op] && i.field) {
                                                    b > 0 && h && h === "OR" && (s = s.or());
                                                    s = p[i.op](s, h)(i.field, i.data, f[i.field])
                                                }
                                                b++
                                            }
                                            g && s.orEnd()
                                        } catch (qa) {
                                            alert(qa)
                                        }
                                    }
                                var d = a.p.multiSort
                                        ? []
                                        : "",
                                    e = [],
                                    g = false,
                                    f = {},
                                    h = [],
                                    i = [],
                                    j,
                                    k,
                                    l;
                                if (b.isArray(a.p.data)) {
                                    var o = a.p.grouping
                                            ? a.p.groupingView
                                            : false,
                                        n,
                                        m;
                                    b.each(a.p.colModel, function () {
                                        k = this.sorttype || "text";
                                        if (k === "date" || k === "datetime") {
                                            if (this.formatter && typeof this.formatter === "string" && this.formatter === "date") {
                                                j = this.formatoptions && this.formatoptions.srcformat
                                                    ? this.formatoptions.srcformat
                                                    : b.jgrid.formatter.date.srcformat;
                                                l = this.formatoptions && this.formatoptions.newformat
                                                    ? this.formatoptions.newformat
                                                    : b.jgrid.formatter.date.newformat
                                            } else 
                                                j = l = this.datefmt || "Y-m-d";
                                            f[this.name] = {
                                                stype: k,
                                                srcfmt: j,
                                                newfmt: l
                                            }
                                        } else 
                                            f[this.name] = {
                                                stype: k,
                                                srcfmt: "",
                                                newfmt: ""
                                            };
                                        if (a.p.grouping) {
                                            m = 0;
                                            for (n = o.groupField.length; m < n; m++) 
                                                if (this.name === o.groupField[m]) {
                                                    var c = this.name;
                                                    if (this.index) 
                                                        c = this.index;
                                                    h[m] = f[c];
                                                    i[m] = c
                                                }
                                            }
                                        if (a.p.multiSort) {
                                            if (this.lso) {
                                                d.push(this.name);
                                                c = this
                                                    .lso
                                                    .split("-");
                                                e.push(c[c.length - 1])
                                            }
                                        } else if (!g && (this.index === a.p.sortname || this.name === a.p.sortname)) {
                                            d = this.name;
                                            g = true
                                        }
                                    });
                                    if (a.p.treeGrid) 
                                        b(a).jqGrid("SortTree", d, a.p.sortorder, f[d].stype, f[d].srcfmt);
                                    else {
                                        var p = {
                                                eq: function (a) {
                                                    return a.equals
                                                },
                                                ne: function (a) {
                                                    return a.notEquals
                                                },
                                                lt: function (a) {
                                                    return a.less
                                                },
                                                le: function (a) {
                                                    return a.lessOrEquals
                                                },
                                                gt: function (a) {
                                                    return a.greater
                                                },
                                                ge: function (a) {
                                                    return a.greaterOrEquals
                                                },
                                                cn: function (a) {
                                                    return a.contains
                                                },
                                                nc: function (a, b) {
                                                    return b === "OR"
                                                        ? a
                                                            .orNot()
                                                            .contains
                                                        : a
                                                            .andNot()
                                                            .contains
                                                },
                                                bw: function (a) {
                                                    return a.startsWith
                                                },
                                                bn: function (a, b) {
                                                    return b === "OR"
                                                        ? a
                                                            .orNot()
                                                            .startsWith
                                                        : a
                                                            .andNot()
                                                            .startsWith
                                                },
                                                en: function (a, b) {
                                                    return b === "OR"
                                                        ? a
                                                            .orNot()
                                                            .endsWith
                                                        : a
                                                            .andNot()
                                                            .endsWith
                                                },
                                                ew: function (a) {
                                                    return a.endsWith
                                                },
                                                ni: function (a, b) {
                                                    return b === "OR"
                                                        ? a
                                                            .orNot()
                                                            .equals
                                                        : a
                                                            .andNot()
                                                            .equals
                                                },
                                                "in": function (a) {
                                                    return a.equals
                                                },
                                                nu: function (a) {
                                                    return a.isNull
                                                },
                                                nn: function (a, b) {
                                                    return b === "OR"
                                                        ? a
                                                            .orNot()
                                                            .isNull
                                                        : a
                                                            .andNot()
                                                            .isNull
                                                }
                                            },
                                            s = b
                                                .jgrid
                                                .from(a.p.data);
                                        a.p.ignoreCase && (s = s.ignoreCase());
                                        if (a.p.search === true) {
                                            var u = a.p.postData.filters;
                                            if (u) {
                                                typeof u === "string" && (u = b.jgrid.parse(u));
                                                c(u)
                                            } else 
                                                try {
                                                    s = p[a.p.postData.searchOper](s)(a.p.postData.searchField, a.p.postData.searchString, f[a.p.postData.searchField])
                                                } catch (t) {}
                                            }
                                        if (a.p.grouping) 
                                            for (m = 0; m < n; m++) 
                                                s.orderBy(i[m], o.groupOrder[m], h[m].stype, h[m].srcfmt);
                                    a.p.multiSort
                                            ? b.each(d, function (a) {
                                                s.orderBy(this, e[a], f[this].stype, f[this].srcfmt)
                                            })
                                            : d && a.p.sortorder && g && (a.p.sortorder.toUpperCase() === "DESC"
                                                ? s.orderBy(a.p.sortname, "d", f[d].stype, f[d].srcfmt)
                                                : s.orderBy(a.p.sortname, "a", f[d].stype, f[d].srcfmt));
                                        var u = s.select(),
                                            v = parseInt(a.p.rowNum, 10),
                                            w = u.length,
                                            A = parseInt(a.p.page, 10),
                                            B = Math.ceil(w / v),
                                            q = {},
                                            u = u.slice((A - 1) * v, A * v),
                                            f = s = null;
                                        q[a.p.localReader.total] = B;
                                        q[a.p.localReader.page] = A;
                                        q[a.p.localReader.records] = w;
                                        q[a.p.localReader.root] = u;
                                        q[a.p.localReader.userdata] = a.p.userData;
                                        u = null;
                                        return q
                                    }
                                }
                            },
                            aa = function () {
                                a.grid.hDiv.loading = true;
                                if (!a.p.hiddengrid) 
                                    switch (a.p.loadui) {
                                        case "enable":
                                            b("#load_" + b.jgrid.jqID(a.p.id)).show();
                                            break;
                                        case "block":
                                            b("#lui_" + b.jgrid.jqID(a.p.id)).show();
                                            b("#load_" + b.jgrid.jqID(a.p.id)).show()
                                    }
                                },
                            P = function () {
                                a.grid.hDiv.loading = false;
                                switch (a.p.loadui) {
                                    case "enable":
                                        b("#load_" + b.jgrid.jqID(a.p.id)).hide();
                                        break;
                                    case "block":
                                        b("#lui_" + b.jgrid.jqID(a.p.id)).hide();
                                        b("#load_" + b.jgrid.jqID(a.p.id)).hide()
                                }
                            },
                            O = function (c) {
                                if (!a.grid.hDiv.loading) {
                                    var d = a.p.scroll && c === false,
                                        e = {},
                                        g,
                                        f = a.p.prmNames;
                                    if (a.p.page <= 0) 
                                        a.p.page = 1;
                                    if (f.search !== null) 
                                        e[f.search] = a.p.search;
                                    f.nd !== null && (e[f.nd] = (new Date).getTime());
                                    if (f.rows !== null) 
                                        e[f.rows] = a.p.rowNum;
                                    if (f.page !== null) 
                                        e[f.page] = a.p.page;
                                    if (f.sort !== null) 
                                        e[f.sort] = a.p.sortname;
                                    if (f.order !== null) 
                                        e[f.order] = a.p.sortorder;
                                    if (a.p.rowTotal !== null && f.totalrows !== null) 
                                        e[f.totalrows] = a.p.rowTotal;
                                    var h = b.isFunction(a.p.loadComplete),
                                        i = h
                                            ? a.p.loadComplete
                                            : null,
                                        j = 0,
                                        c = c || 1;
                                    if (c > 1) 
                                        if (f.npage !== null) {
                                            e[f.npage] = c;
                                            j = c - 1;
                                            c = 1
                                        } else 
                                            i = function (b) {
                                                a.p.page++;
                                                a.grid.hDiv.loading = false;
                                                h && a
                                                    .p
                                                    .loadComplete
                                                    .call(a, b);
                                                O(c - 1)
                                            };
                                else 
                                        f.npage !== null && delete a.p.postData[f.npage];
                                    if (a.p.grouping) {
                                        b(a).jqGrid("groupingSetup");
                                        var k = a.p.groupingView,
                                            l,
                                            o = "";
                                        for (l = 0; l < k.groupField.length; l++) {
                                            var m = k.groupField[l];
                                            b.each(a.p.colModel, function (a, b) {
                                                if (b.name === m && b.index) 
                                                    m = b.index
                                            });
                                            o = o + (m + " " + k.groupOrder[l] + ", ")
                                        }
                                        e[f.sort] = o + e[f.sort]
                                    }
                                    b.extend(a.p.postData, e);
                                    var n = !a.p.scroll
                                            ? 1
                                            : a.rows.length - 1,
                                        e = b(a).triggerHandler("jqGridBeforeRequest");
                                    if (!(e === false || e === "stop")) 
                                        if (b.isFunction(a.p.datatype)) 
                                            a.p.datatype.call(a, a.p.postData, "load_" + a.p.id);
                                        else {
                                            if (b.isFunction(a.p.beforeRequest)) {
                                                e = a
                                                    .p
                                                    .beforeRequest
                                                    .call(a);
                                                e === void 0 && (e = true);
                                                if (e === false) 
                                                    return
                                            }
                                            g = a
                                                .p
                                                .datatype
                                                .toLowerCase();
                                            switch (g) {
                                                case "json":
                                                case "jsonp":
                                                case "xml":
                                                case "script":
                                                    b.ajax(b.extend({
                                                        url: a.p.url,
                                                        type: a.p.mtype,
                                                        dataType: g,
                                                        data: b.isFunction(a.p.serializeGridData)
                                                            ? a
                                                                .p
                                                                .serializeGridData
                                                                .call(a, a.p.postData)
                                                            : a.p.postData,
                                                        success: function (e, f, h) {
                                                            if (b.isFunction(a.p.beforeProcessing) && a.p.beforeProcessing.call(a, e, f, h) === false) 
                                                                P();
                                                            else {
                                                                g === "xml"
                                                                    ? J(e, a.grid.bDiv, n, c > 1, j)
                                                                    : S(e, a.grid.bDiv, n, c > 1, j);
                                                                b(a).triggerHandler("jqGridLoadComplete", [e]);
                                                                i && i.call(a, e);
                                                                b(a).triggerHandler("jqGridAfterLoadComplete", [e]);
                                                                d && a
                                                                    .grid
                                                                    .populateVisible();
                                                                if (a.p.loadonce || a.p.treeGrid) 
                                                                    a.p.datatype = "local";
                                                                c === 1 && P()
                                                            }
                                                        },
                                                        error: function (d, e, f) {
                                                            b.isFunction(a.p.loadError) && a
                                                                .p
                                                                .loadError
                                                                .call(a, d, e, f);
                                                            c === 1 && P()
                                                        },
                                                        beforeSend: function (c, d) {
                                                            var e = true;
                                                            b.isFunction(a.p.loadBeforeSend) && (e = a.p.loadBeforeSend.call(a, c, d));
                                                            e === void 0 && (e = true);
                                                            if (e === false) 
                                                                return false;
                                                            aa()
                                                        }
                                                    }, b.jgrid.ajaxOptions, a.p.ajaxGridOptions));
                                                    break;
                                                case "xmlstring":
                                                    aa();
                                                    e = typeof a.p.datastr !== "string"
                                                        ? a.p.datastr
                                                        : b.parseXML(a.p.datastr);
                                                    J(e, a.grid.bDiv);
                                                    b(a).triggerHandler("jqGridLoadComplete", [e]);
                                                    h && a
                                                        .p
                                                        .loadComplete
                                                        .call(a, e);
                                                    b(a).triggerHandler("jqGridAfterLoadComplete", [e]);
                                                    a.p.datatype = "local";
                                                    a.p.datastr = null;
                                                    P();
                                                    break;
                                                case "jsonstring":
                                                    aa();
                                                    e = typeof a.p.datastr === "string"
                                                        ? b
                                                            .jgrid
                                                            .parse(a.p.datastr)
                                                        : a.p.datastr;
                                                    S(e, a.grid.bDiv);
                                                    b(a).triggerHandler("jqGridLoadComplete", [e]);
                                                    h && a
                                                        .p
                                                        .loadComplete
                                                        .call(a, e);
                                                    b(a).triggerHandler("jqGridAfterLoadComplete", [e]);
                                                    a.p.datatype = "local";
                                                    a.p.datastr = null;
                                                    P();
                                                    break;
                                                case "local":
                                                case "clientside":
                                                    aa();
                                                    a.p.datatype = "local";
                                                    e = ja();
                                                    S(e, a.grid.bDiv, n, c > 1, j);
                                                    b(a).triggerHandler("jqGridLoadComplete", [e]);
                                                    i && i.call(a, e);
                                                    b(a).triggerHandler("jqGridAfterLoadComplete", [e]);
                                                    d && a
                                                        .grid
                                                        .populateVisible();
                                                    P()
                                            }
                                        }
                                    }
                            },
                            ca = function (c) {
                                b("#cb_" + b.jgrid.jqID(a.p.id), a.grid.hDiv)[a.p.useProp
                                        ? "prop"
                                        : "attr"]("checked", c);
                                if (a.p.frozenColumns && a.p.id + "_frozen") 
                                    b("#cb_" + b.jgrid.jqID(a.p.id), a.grid.fhDiv)[a.p.useProp
                                            ? "prop"
                                            : "attr"]("checked", c)
                                    },
                            ka = function (c, d) {
                                var e = "",
                                    g = "<table cellspacing='0' cellpadding='0' border='0' style='table-layout:auto;' cla" +
                                            "ss='ui-pg-table'><tbody><tr>",
                                    i = "",
                                    j,
                                    k,
                                    l,
                                    m,
                                    n = function (c) {
                                        var d;
                                        b.isFunction(a.p.onPaging) && (d = a.p.onPaging.call(a, c));
                                        a.p.selrow = null;
                                        if (a.p.multiselect) {
                                            a.p.selarrrow = [];
                                            ca(false)
                                        }
                                        a.p.savedRow = [];
                                        return d === "stop"
                                            ? false
                                            : true
                                    },
                                    c = c.substr(1),
                                    d = d + ("_" + c);
                                j = "pg_" + c;
                                k = c + "_left";
                                l = c + "_center";
                                m = c + "_right";
                                b("#" + b.jgrid.jqID(c))
                                    .append("<div id='" + j + "' class='ui-pager-control' role='group'><table cellspacing='0' cellpadding='0' b" +
                                        "order='0' class='ui-pg-table' style='width:100%;table-layout:fixed;height:100%;'" +
                                        " role='row'><tbody><tr><td id='" + k + "' align='left'></td><td id='" + l + "' align='center' style='white-space:pre;'></td><td id='" + m + "' align='right'></td></tr></tbody></table></div>")
                                    .attr("dir", "ltr");
                                if (a.p.rowList.length > 0) {
                                    i = "<td dir='" + f + "'>";
                                    i = i + "<select class='ui-pg-selbox' role='listbox'>";
                                    for (k = 0; k < a.p.rowList.length; k++) 
                                        i = i + ('<option role="option" value="' + a.p.rowList[k] + '"' + (a.p.rowNum === a.p.rowList[k]
                                            ? ' selected="selected"'
                                            : "") + ">" + a.p.rowList[k] + "</option>");
                                    i = i + "</select></td>"
                                }
                                f === "rtl" && (g = g + i);
                                a.p.pginput === true && (e = "<td dir='" + f + "'>" + b.jgrid.format(a.p.pgtext || "", "<input class='ui-pg-input' type='text' size='2' maxlength='7' value='0' role='te" +
                                        "xtbox'/>",
                                "<span id='sp_1_" + b.jgrid.jqID(c) + "'></span>") + "</td>");
                                if (a.p.pgbuttons === true) {
                                    k = [
                                        "first" + d,
                                        "prev" + d,
                                        "next" + d,
                                        "last" + d
                                    ];
                                    f === "rtl" && k.reverse();
                                    g = g + ("<td id='" + k[0] + "' class='ui-pg-button ui-corner-all'>首页</td>");
                                    g = g + ("<td id='" + k[1] + "' class='ui-pg-button ui-corner-all'>上一页</td>");
                                    g = g + (e !== ""
                                        ? "<td class='ui-pg-button ui-state-disabled' style='width:4px;'><span class='ui-se" +
                                            "parator'></span></td>" + e + "<td class='ui-pg-button ui-state-disabled' style='width:4px;'><span class='ui-se" +
                                                "parator'></span></td>"
                                        : "") + ("<td id='" + k[2] + "' class='ui-pg-button ui-corner-all'>下一页</td>");
                                    g = g + ("<td id='" + k[3] + "' class='ui-pg-button ui-corner-all'>尾页</td>")
                                } else 
                                    e !== "" && (g = g + e);
                                f === "ltr" && (g = g + i);
                                g = g + "</tr></tbody></table>";
                                a.p.viewrecords === true && b("td#" + c + "_" + a.p.recordpos, "#" + j).append("<div dir='" + f + "' style='text-align:" + a.p.recordpos + "' class='ui-paging-info'></div>");
                                b("td#" + c + "_" + a.p.pagerpos, "#" + j).append(g);
                                i = b(".ui-jqgrid").css("font-size") || "11px";
                                b(document.body).append("<div id='testpg' class='ui-jqgrid ui-widget ui-widget-content' style='font-size:" + i + ";visibility:hidden;' ></div>");
                                g = b(g)
                                    .clone()
                                    .appendTo("#testpg")
                                    .width();
                                b("#testpg").remove();
                                if (g > 0) {
                                    e !== "" && (g = g + 50);
                                    b("td#" + c + "_" + a.p.pagerpos, "#" + j).width(g)
                                }
                                a.p._nvtd = [];
                                a.p._nvtd[0] = g
                                    ? Math.floor((a.p.width - g) / 2)
                                    : Math.floor(a.p.width / 3);
                                a.p._nvtd[1] = 0;
                                g = null;
                                b(".ui-pg-selbox", "#" + j).bind("change", function () {
                                    if (!n("records")) 
                                        return false;
                                    a.p.page = Math.round(a.p.rowNum * (a.p.page - 1) / this.value - 0.5) + 1;
                                    a.p.rowNum = this.value;
                                    a.p.pager && b(".ui-pg-selbox", a.p.pager).val(this.value);
                                    a.p.toppager && b(".ui-pg-selbox", a.p.toppager).val(this.value);
                                    O();
                                    return false
                                });
                                if (a.p.pgbuttons === true) {
                                    b(".ui-pg-button", "#" + j)
                                        .hover(function () {
                                            if (b(this).hasClass("ui-state-disabled")) 
                                                this.style.cursor = "default";
                                            else {
                                                b(this).addClass("ui-state-hover");
                                                this.style.cursor = "pointer"
                                            }
                                        }, function () {
                                            if (!b(this).hasClass("ui-state-disabled")) {
                                                b(this).removeClass("ui-state-hover");
                                                this.style.cursor = "default"
                                            }
                                        });
                                    b("#first" + b.jgrid.jqID(d) + ", #prev" + b.jgrid.jqID(d) + ", #next" + b.jgrid.jqID(d) + ", #last" + b.jgrid.jqID(d))
                                        .click(function () {
                                            var b = o(a.p.page, 1),
                                                c = o(a.p.lastpage, 1),
                                                e = false,
                                                g = true,
                                                f = true,
                                                h = true,
                                                i = true;
                                            if (c === 0 || c === 1) 
                                                i = h = f = g = false;
                                            else if (c > 1 && b >= 1) 
                                                if (b === 1) 
                                                    f = g = false;
                                                else {
                                                    if (b === c) 
                                                        i = h = false
                                                }
                                            else if (c > 1 && b === 0) {
                                                i = h = false;
                                                b = c - 1
                                            }
                                            if (!n(this.id)) 
                                                return false;
                                            if (this.id === "first" + d && g) {
                                                a.p.page = 1;
                                                e = true
                                            }
                                            if (this.id === "prev" + d && f) {
                                                a.p.page = b - 1;
                                                e = true
                                            }
                                            if (this.id === "next" + d && h) {
                                                a.p.page = b + 1;
                                                e = true
                                            }
                                            if (this.id === "last" + d && i) {
                                                a.p.page = c;
                                                e = true
                                            }
                                            e && O();
                                            return false
                                        })
                                }
                                a.p.pginput === true && b("input.ui-pg-input", "#" + j).keypress(function (c) {
                                    if ((c.charCode || c.keyCode || 0) === 13) {
                                        if (!n("user")) 
                                            return false;
                                        b(this).val(o(b(this).val(), 1));
                                        a.p.page = b(this).val() > 0
                                            ? b(this).val()
                                            : a.p.page;
                                        O();
                                        return false
                                    }
                                    return this
                                })
                            },
                            ra = function (c, d) {
                                var e,
                                    g = "",
                                    f = a.p.colModel,
                                    h = false,
                                    i;
                                i = a.p.frozenColumns
                                    ? d
                                    : a.grid.headers[c].el;
                                var j = "";
                                b("span.ui-grid-ico-sort", i).addClass("ui-state-disabled");
                                b(i).attr("aria-selected", "false");
                                if (f[c].lso) 
                                    if (f[c].lso === "asc") {
                                        f[c].lso = f[c].lso + "-desc";
                                        j = "desc"
                                    }
                                else if (f[c].lso === "desc") {
                                    f[c].lso = f[c].lso + "-asc";
                                    j = "asc"
                                } else {
                                    if (f[c].lso === "asc-desc" || f[c].lso === "desc-asc") 
                                        f[c].lso = ""
                                } else 
                                    f[c].lso = j = f.firstsortorder || "asc";
                                if (j) {
                                    b("span.s-ico", i).show();
                                    b("span.ui-icon-" + j, i).removeClass("ui-state-disabled");
                                    b(i).attr("aria-selected", "true")
                                } else 
                                    a.p.viewsortcols[0] || b("span.s-ico", i).hide();
                                a.p.sortorder = "";
                                b.each(f, function (b) {
                                    if (this.lso) {
                                        b > 0 && h && (g = g + ", ");
                                        e = this
                                            .lso
                                            .split("-");
                                        g = g + (f[b].index || f[b].name);
                                        g = g + (" " + e[e.length - 1]);
                                        h = true;
                                        a.p.sortorder = e[e.length - 1]
                                    }
                                });
                                i = g.lastIndexOf(a.p.sortorder);
                                g = g.substring(0, i);
                                a.p.sortname = g
                            },
                            la = function (c, d, e, g, f) {
                                if (a.p.colModel[d].sortable) {
                                    var h;
                                    if (!(a.p.savedRow.length > 0)) {
                                        if (!e) {
                                            if (a.p.lastsort === d) 
                                                if (a.p.sortorder === "asc") 
                                                    a.p.sortorder = "desc";
                                                else {
                                                    if (a.p.sortorder === "desc") 
                                                        a.p.sortorder = "asc"
                                                } else 
                                                    a.p.sortorder = a.p.colModel[d].firstsortorder || "asc";
                                        a.p.page = 1
                                        }
                                        if (a.p.multiSort) 
                                            ra(d, f);
                                        else {
                                            if (g) {
                                                if (a.p.lastsort === d && a.p.sortorder === g && !e) 
                                                    return;
                                                a.p.sortorder = g
                                            }
                                            e = a.grid.headers[a.p.lastsort].el;
                                            f = a.p.frozenColumns
                                                ? f
                                                : a.grid.headers[d].el;
                                            b("span.ui-grid-ico-sort", e).addClass("ui-state-disabled");
                                            b(e).attr("aria-selected", "false");
                                            if (a.p.frozenColumns) {
                                                a
                                                    .grid
                                                    .fhDiv
                                                    .find("span.ui-grid-ico-sort")
                                                    .addClass("ui-state-disabled");
                                                a
                                                    .grid
                                                    .fhDiv
                                                    .find("th")
                                                    .attr("aria-selected", "false")
                                            }
                                            b("span.ui-icon-" + a.p.sortorder, f).removeClass("ui-state-disabled");
                                            b(f).attr("aria-selected", "true");
                                            if (!a.p.viewsortcols[0] && a.p.lastsort !== d) {
                                                a.p.frozenColumns && a
                                                    .grid
                                                    .fhDiv
                                                    .find("span.s-ico")
                                                    .hide();
                                                b("span.s-ico", e).hide();
                                                b("span.s-ico", f).show()
                                            }
                                            c = c.substring(5 + a.p.id.length + 1);
                                            a.p.sortname = a.p.colModel[d].index || c;
                                            h = a.p.sortorder
                                        }
                                        if (b(a).triggerHandler("jqGridSortCol", [c, d, h]) === "stop") 
                                            a.p.lastsort = d;
                                        else if (b.isFunction(a.p.onSortCol) && a.p.onSortCol.call(a, c, d, h) === "stop") 
                                            a.p.lastsort = d;
                                        else {
                                            if (a.p.datatype === "local") 
                                                a.p.deselectAfterSort && b(a).jqGrid("resetSelection");
                                            else {
                                                a.p.selrow = null;
                                                a.p.multiselect && ca(false);
                                                a.p.selarrrow = [];
                                                a.p.savedRow = []
                                            }
                                            if (a.p.scroll) {
                                                f = a.grid.bDiv.scrollLeft;
                                                V.call(a, true, false);
                                                a.grid.hDiv.scrollLeft = f
                                            }
                                            a.p.subGrid && a.p.datatype === "local" && b("td.sgexpanded", "#" + b.jgrid.jqID(a.p.id)).each(function () {
                                                b(this).trigger("click")
                                            });
                                            O();
                                            a.p.lastsort = d;
                                            if (a.p.sortname !== c && d) 
                                                a.p.lastsort = d
                                        }
                                    }
                                }
                            },
                            sa = function (c) {
                                c = b(a.grid.headers[c].el);
                                c = [
                                    c
                                        .position()
                                        .left + c.outerWidth()
                                ];
                                a.p.direction === "rtl" && (c[0] = a.p.width - c[0]);
                                c[0] = c[0] - a.grid.bDiv.scrollLeft;
                                c.push(b(a.grid.hDiv).position().top);
                                c.push(b(a.grid.bDiv).offset().top - b(a.grid.hDiv).offset().top + b(a.grid.bDiv).height());
                                return c
                            },
                            ma = function (c) {
                                var d,
                                    e = a.grid.headers,
                                    g = b
                                        .jgrid
                                        .getCellIndex(c);
                                for (d = 0; d < e.length; d++) 
                                    if (c === e[d].el) {
                                        g = d;
                                        break
                                    }
                                return g
                            };
                        this.p.id = this.id;
                        -1 === b.inArray(a.p.multikey, ["shiftKey", "altKey", "ctrlKey"]) && (a.p.multikey = !1);
                        a.p.keyIndex = !1;
                        for (g = 0; g < a.p.colModel.length; g++) 
                            a.p.colModel[g] = b.extend(!0, {}, a.p.cmTemplate, a.p.colModel[g].template || {}, a.p.colModel[g]),
                            !1 === a.p.keyIndex && !0 === a.p.colModel[g].key && (a.p.keyIndex = g);
                        a.p.sortorder = a
                            .p
                            .sortorder
                            .toLowerCase();
                        b.jgrid.cell_width = b
                            .jgrid
                            .cellWidth();
                        !0 === a.p.grouping && (a.p.scroll = !1, a.p.rownumbers = !1, a.p.treeGrid = !1, a.p.gridview = !0);
                        if (!0 === this.p.treeGrid) {
                            try {
                                b(this).jqGrid("setTreeGrid")
                            } catch (va) {}"local" !== a.p.datatype && (a.p.localReader = {
                                id: "_id_"
                            })
                        }
                        if (this.p.subGrid) 
                            try {
                                b(a).jqGrid("setSubGrid")
                            } catch (wa) {}
                        this.p.multiselect && (this.p.colNames.unshift("<input role='checkbox' id='cb_" + this.p.id + "' class='cbox' type='checkbox'/><label></label>"), this.p.colModel.unshift({
                            name: "cb",
                            width: b.jgrid.cell_width
                                ? a.p.multiselectWidth + a.p.cellLayout
                                : a.p.multiselectWidth,
                            sortable: !1,
                            resizable: !1,
                            hidedlg: !0,
                            search: !1,
                            align: "center",
                            fixed: !0
                        }));
                        this.p.rownumbers && (this.p.colNames.unshift(""), this.p.colModel.unshift({
                            name: "rn",
                            width: a.p.rownumWidth,
                            sortable: !1,
                            resizable: !1,
                            hidedlg: !0,
                            search: !1,
                            align: "center",
                            fixed: !0
                        }));
                        a.p.xmlReader = b.extend(!0, {
                            root: "rows",
                            row: "row",
                            page: "rows>page",
                            total: "rows>total",
                            records: "rows>records",
                            repeatitems: !0,
                            cell: "cell",
                            id: "[id]",
                            userdata: "userdata",
                            subgrid: {
                                root: "rows",
                                row: "row",
                                repeatitems: !0,
                                cell: "cell"
                            }
                        }, a.p.xmlReader);
                        a.p.jsonReader = b.extend(!0, {
                            root: "rows",
                            page: "page",
                            total: "total",
                            records: "records",
                            repeatitems: !0,
                            cell: "cell",
                            id: "id",
                            userdata: "userdata",
                            subgrid: {
                                root: "rows",
                                repeatitems: !0,
                                cell: "cell"
                            }
                        }, a.p.jsonReader);
                        a.p.localReader = b.extend(!0, {
                            root: "rows",
                            page: "page",
                            total: "total",
                            records: "records",
                            repeatitems: !1,
                            cell: "cell",
                            id: "id",
                            userdata: "userdata",
                            subgrid: {
                                root: "rows",
                                repeatitems: !0,
                                cell: "cell"
                            }
                        }, a.p.localReader);
                        a.p.scroll && (a.p.pgbuttons = !1, a.p.pginput = !1, a.p.rowList = []);
                        a.p.data.length && N();
                        var B = "<thead><tr class='ui-jqgrid-labels' role='rowheader'>",
                            na,
                            C,
                            da,
                            ea,
                            fa,
                            v,
                            p,
                            W,
                            oa = W = "",
                            ba = [],
                            pa = [];
                        C = [];
                        if (!0 === a.p.shrinkToFit && !0 === a.p.forceFit) 
                            for (g = a.p.colModel.length - 1; 0 <= g; g--) 
                                if (!a.p.colModel[g].hidden) {
                                    a.p.colModel[g].resizable = !1;
                                    break
                                }
                            "horizontal" === a.p.viewsortcols[1] && (W = " ui-i-asc", oa = " ui-i-desc");
                        na = k
                            ? "class='ui-th-div-ie'"
                            : "";
                        W = "<span class='s-ico' style='display:none'><span sort='asc' class='ui-grid-ico-sor" +
                                "t ui-icon-asc" + W + " ui-state-disabled ui-icon ui-icon-triangle-1-n ui-sort-" + f + "'></span>" + ("<span sort='desc' class='ui-grid-ico-sort ui-icon-desc" + oa + " ui-state-disabled ui-icon ui-icon-triangle-1-s ui-sort-" + f + "'></span></span>");
                        if (a.p.multiSort) {
                            ba = a
                                .p
                                .sortname
                                .split(",");
                            for (g = 0; g < ba.length; g++) 
                                C = b.trim(ba[g]).split(" "),
                                ba[g] = b.trim(C[0]),
                                pa[g] = C[1]
                                    ? b.trim(C[1])
                                    : a.p.sortorder || "asc"
                            }
                        for (g = 0; g < this.p.colNames.length; g++) 
                            C = a.p.headertitles
                                ? ' title="' + b.jgrid.stripHtml(a.p.colNames[g]) + '"'
                                : "",
                            B += "<th id='" + a.p.id + "_" + a.p.colModel[g].name + "' role='columnheader' class='ui-state-default ui-th-column ui-th-" + f + "'" + C + ">",
                            C = a.p.colModel[g].index || a.p.colModel[g].name,
                            B += "<div id='jqgh_" + a.p.id + "_" + a.p.colModel[g].name + "' " + na + ">" + a.p.colNames[g],
                            a.p.colModel[g].width = a.p.colModel[g].width
                                ? parseInt(a.p.colModel[g].width, 10)
                                : 150,
                            "boolean" !== typeof a.p.colModel[g].title && (a.p.colModel[g].title = !0),
                            a.p.colModel[g].lso = "",
                            C === a.p.sortname && (a.p.lastsort = g),
                            a.p.multiSort && (C = b.inArray(C, ba), -1 !== C && (a.p.colModel[g].lso = pa[C])),
                            B += W + "</div></th>";
                        W = null;
                        b(this).append(B + "</tr></thead>");
                        b("thead tr:first th", this).hover(function () {
                            b(this).addClass("ui-state-hover")
                        }, function () {
                            b(this).removeClass("ui-state-hover")
                        });
                        if (this.p.multiselect) {
                            var ga = [],
                                Y;
                            b("#cb_" + b.jgrid.jqID(a.p.id), this)
                                .bind("click", function () {
                                    a.p.selarrrow = [];
                                    var c = a.p.frozenColumns === true
                                        ? a.p.id + "_frozen"
                                        : "";
                                    if (this.checked) {
                                        b(a.rows)
                                            .each(function (d) {
                                                if (d > 0 && !b(this).hasClass("ui-subgrid") && !b(this).hasClass("jqgroup") && !b(this).hasClass("ui-state-disabled")) {
                                                    b("#jqg_" + b.jgrid.jqID(a.p.id) + "_" + b.jgrid.jqID(this.id))[a.p.useProp
                                                            ? "prop"
                                                            : "attr"]("checked", true);
                                                    b(this)
                                                        .addClass("ui-state-highlight")
                                                        .attr("aria-selected", "true");
                                                    a
                                                        .p
                                                        .selarrrow
                                                        .push(this.id);
                                                    a.p.selrow = this.id;
                                                    if (c) {
                                                        b("#jqg_" + b.jgrid.jqID(a.p.id) + "_" + b.jgrid.jqID(this.id), a.grid.fbDiv)[a.p.useProp
                                                                ? "prop"
                                                                : "attr"]("checked", true);
                                                        b("#" + b.jgrid.jqID(this.id), a.grid.fbDiv).addClass("ui-state-highlight")
                                                    }
                                                }
                                            });
                                        Y = true;
                                        ga = []
                                    } else {
                                        b(a.rows)
                                            .each(function (d) {
                                                if (d > 0 && !b(this).hasClass("ui-subgrid") && !b(this).hasClass("ui-state-disabled")) {
                                                    b("#jqg_" + b.jgrid.jqID(a.p.id) + "_" + b.jgrid.jqID(this.id))[a.p.useProp
                                                            ? "prop"
                                                            : "attr"]("checked", false);
                                                    b(this)
                                                        .removeClass("ui-state-highlight")
                                                        .attr("aria-selected", "false");
                                                    ga.push(this.id);
                                                    if (c) {
                                                        b("#jqg_" + b.jgrid.jqID(a.p.id) + "_" + b.jgrid.jqID(this.id), a.grid.fbDiv)[a.p.useProp
                                                                ? "prop"
                                                                : "attr"]("checked", false);
                                                        b("#" + b.jgrid.jqID(this.id), a.grid.fbDiv).removeClass("ui-state-highlight")
                                                    }
                                                }
                                            });
                                        a.p.selrow = null;
                                        Y = false
                                    }
                                    b(a).triggerHandler("jqGridSelectAll", [
                                        Y
                                            ? a.p.selarrrow
                                            : ga,
                                        Y
                                    ]);
                                    b.isFunction(a.p.onSelectAll) && a
                                        .p
                                        .onSelectAll
                                        .call(a, Y
                                            ? a.p.selarrrow
                                            : ga, Y)
                                })
                        }
                        !0 === a.p.autowidth && (B = b(l).innerWidth(), a.p.width = 0 < B
                            ? B
                            : "nw");
                        (function () {
                            var d = 0,
                                e = b.jgrid.cell_width
                                    ? 0
                                    : o(a.p.cellLayout, 0),
                                g = 0,
                                f,
                                h = o(a.p.scrollOffset, 0),
                                i,
                                k = false,
                                l,
                                m = 0,
                                n;
                            b.each(a.p.colModel, function () {
                                if (this.hidden === void 0) 
                                    this.hidden = false;
                                if (a.p.grouping && a.p.autowidth) {
                                    var c = b.inArray(this.name, a.p.groupingView.groupField);
                                    if (c >= 0 && a.p.groupingView.groupColumnShow.length > c) 
                                        this.hidden = !a.p.groupingView.groupColumnShow[c]
                                }
                                this.widthOrg = i = o(this.width, 0);
                                if (this.hidden === false) {
                                    d = d + (i + e);
                                    this.fixed
                                        ? m = m + (i + e)
                                        : g++
                                }
                            });
                            if (isNaN(a.p.width)) 
                                a.p.width = d + (a.p.shrinkToFit === false && !isNaN(a.p.height)
                                    ? h
                                    : 0);
                            c.width = a.p.width;
                            a.p.tblwidth = d;
                            if (a.p.shrinkToFit === false && a.p.forceFit === true) 
                                a.p.forceFit = false;
                            if (a.p.shrinkToFit === true && g > 0) {
                                l = c.width - e * g - m;
                                if (!isNaN(a.p.height)) {
                                    l = l - h;
                                    k = true
                                }
                                d = 0;
                                b.each(a.p.colModel, function (b) {
                                    if (this.hidden === false && !this.fixed) {
                                        this.width = i = Math.round(l * this.width / (a.p.tblwidth - e * g - m));
                                        d = d + i;
                                        f = b
                                    }
                                });
                                n = 0;
                                k
                                    ? c.width - m - (d + e * g) !== h && (n = c.width - m - (d + e * g) - h)
                                    : !k && Math.abs(c.width - m - (d + e * g)) !== 1 && (n = c.width - m - (d + e * g));
                                a.p.colModel[f].width = a.p.colModel[f].width + n;
                                a.p.tblwidth = d + n + e * g + m;
                                if (a.p.tblwidth > a.p.width) {
                                    a.p.colModel[f].width = a.p.colModel[f].width - (a.p.tblwidth - parseInt(a.p.width, 10));
                                    a.p.tblwidth = a.p.width
                                }
                            }
                        })();
                        b(l)
                            .css("width", c.width + "px")
                            .append("<div class='ui-jqgrid-resize-mark' id='rs_m" + a.p.id + "'>&#160;</div>");
                        b(i).css("width", c.width + "px");
                        var B = b("thead:first", a).get(0),
                            Q = "";
                        a.p.footerrow && (Q += "<table role='grid' style='width:" + a.p.tblwidth + "px' class='ui-jqgrid-ftable' cellspacing='0' cellpadding='0' border='0'><tbody><" +
                                "tr role='row' class='ui-widget-content footrow footrow-" + f + "'>");
                        var i = b("tr:first", B),
                            Z = "<tr class='jqgfirstrow' role='row' style='height:auto'>";
                        a.p.disableClick = !1;
                        b("th", i).each(function (d) {
                            da = a.p.colModel[d].width;
                            if (a.p.colModel[d].resizable === void 0) 
                                a.p.colModel[d].resizable = true;
                            if (a.p.colModel[d].resizable) {
                                ea = document.createElement("span");
                                b(ea)
                                    .html("&#160;")
                                    .addClass("ui-jqgrid-resize ui-jqgrid-resize-" + f)
                                    .css("cursor", "col-resize");
                                b(this).addClass(a.p.resizeclass)
                            } else 
                                ea = "";
                            b(this)
                                .css("width", da + "px")
                                .prepend(ea);
                            var e = "";
                            if (a.p.colModel[d].hidden) {
                                b(this).css("display", "none");
                                e = "display:none;"
                            }
                            Z = Z + ("<td role='gridcell' style='height:0px;width:" + da + "px;" + e + "'></td>");
                            c.headers[d] = {
                                width: da,
                                el: this
                            };
                            fa = a.p.colModel[d].sortable;
                            if (typeof fa !== "boolean") 
                                fa = a.p.colModel[d].sortable = true;
                            e = a.p.colModel[d].name;
                            e === "cb" || e === "subgrid" || e === "rn" || a.p.viewsortcols[2] && b(">div", this).addClass("ui-jqgrid-sortable");
                            if (fa) 
                                if (a.p.multiSort) 
                                    if (a.p.viewsortcols[0]) {
                                        b("div span.s-ico", this).show();
                                        a.p.colModel[d].lso && b("div span.ui-icon-" + a.p.colModel[d].lso, this).removeClass("ui-state-disabled")
                                    }
                                else {
                                    if (a.p.colModel[d].lso) {
                                        b("div span.s-ico", this).show();
                                        b("div span.ui-icon-" + a.p.colModel[d].lso, this).removeClass("ui-state-disabled")
                                    }
                                } else if (a.p.viewsortcols[0]) {
                                b("div span.s-ico", this).show();
                                d === a.p.lastsort && b("div span.ui-icon-" + a.p.sortorder, this).removeClass("ui-state-disabled")
                            } else if (d === a.p.lastsort) {
                                b("div span.s-ico", this).show();
                                b("div span.ui-icon-" + a.p.sortorder, this).removeClass("ui-state-disabled")
                            }
                            a.p.footerrow && (Q = Q + ("<td role='gridcell' " + n(d, 0, "", null, "", false) + ">&#160;</td>"))
                        })
                            .mousedown(function (d) {
                                if (b(d.target).closest("th>span.ui-jqgrid-resize").length === 1) {
                                    var e = ma(this);
                                    if (a.p.forceFit === true) {
                                        var g = a.p,
                                            f = e,
                                            h;
                                        for (h = e + 1; h < a.p.colModel.length; h++) 
                                            if (a.p.colModel[h].hidden !== true) {
                                                f = h;
                                                break
                                            }
                                        g.nv = f - e
                                    }
                                    c.dragStart(e, d, sa(e));
                                    return false
                                }
                            })
                            .click(function (c) {
                                if (a.p.disableClick) 
                                    return a.p.disableClick = false;
                                var d = "th>div.ui-jqgrid-sortable",
                                    e,
                                    g;
                                a.p.viewsortcols[2] || (d = "th>div>span>span.ui-grid-ico-sort");
                                c = b(c.target).closest(d);
                                if (c.length === 1) {
                                    var f;
                                    if (a.p.frozenColumns) {
                                        var h = b(this)[0]
                                            .id
                                            .substring(5);
                                        b(a.p.colModel).each(function (a) {
                                            if (this.name === h) {
                                                f = a;
                                                return false
                                            }
                                        })
                                    } else 
                                        f = ma(this);
                                    if (!a.p.viewsortcols[2]) {
                                        e = true;
                                        g = c.attr("sort")
                                    }
                                    f != null && la(b("div", this)[0].id, f, e, g, this);
                                    return false
                                }
                            });
                        if (a.p.sortable && b.fn.sortable) 
                            try {
                                b(a).jqGrid("sortableColumns", i)
                            } catch (xa) {}
                        a.p.footerrow && (Q += "</tr></tbody></table>");
                        Z += "</tr>";
                        this.appendChild(document.createElement("tbody"));
                        b(this)
                            .addClass("ui-jqgrid-btable")
                            .append(Z);
                        var Z = null,
                            i = b("<table class='ui-jqgrid-htable' style='width:" + a.p.tblwidth + "px' role='grid' aria-labelledby='gbox_" + this.id + "' cellspacing='0' cellpadding='0' border='0'></table>").append(B),
                            H = a.p.caption && !0 === a.p.hiddengrid
                                ? !0
                                : !1;
                        g = b("<div class='ui-jqgrid-hbox" + ("rtl" === f
                            ? "-rtl"
                            : "") + "'></div>");
                        B = null;
                        c.hDiv = document.createElement("div");
                        b(c.hDiv)
                            .css({
                            width: c.width + "px"
                        })
                            .addClass("ui-state-default ui-jqgrid-hdiv")
                            .append(g);
                        b(g).append(i);
                        i = null;
                        H && b(c.hDiv).hide();
                        a.p.pager && ("string" === typeof a.p.pager
                            ? "#" !== a.p.pager.substr(0, 1) && (a.p.pager = "#" + a.p.pager)
                            : a.p.pager = "#" + b(a.p.pager).attr("id"), b(a.p.pager).css({
                            width: c.width + "px"
                        }).addClass("ui-state-default ui-jqgrid-pager ui-corner-bottom").appendTo(l), H && b(a.p.pager).hide(), ka(a.p.pager, ""));
                        !1 === a.p.cellEdit && !0 === a.p.hoverrows && b(a).bind("mouseover", function (a) {
                            p = b(a.target).closest("tr.jqgrow");
                            b(p).attr("class") !== "ui-subgrid" && b(p).addClass("ui-state-hover")
                        })
                            .bind("mouseout", function (a) {
                                p = b(a.target).closest("tr.jqgrow");
                                b(p).removeClass("ui-state-hover")
                            });
                        var w,
                            I,
                            ha;
                        b(a)
                            .before(c.hDiv)
                            .click(function (c) {
                                v = c.target;
                                p = b(v, a.rows).closest("tr.jqgrow");
                                if (b(p).length === 0 || p[0].className.indexOf("ui-state-disabled") > -1 || (b(v, a).closest("table.ui-jqgrid-btable").attr("id") || "").replace("_frozen", "") !== a.id) 
                                    return this;
                                var d = b(v).hasClass("cbox"),
                                    e = b(a).triggerHandler("jqGridBeforeSelectRow", [p[0].id, c]);
                                (e = e === false || e === "stop"
                                    ? false
                                    : true) && b.isFunction(a.p.beforeSelectRow) && (e = a.p.beforeSelectRow.call(a, p[0].id, c));
                                if (!(v.tagName === "A" || (v.tagName === "INPUT" || v.tagName === "TEXTAREA" || v.tagName === "OPTION" || v.tagName === "SELECT") && !d) && e === true) {
                                    w = p[0].id;
                                    I = b
                                        .jgrid
                                        .getCellIndex(v);
                                    ha = b(v)
                                        .closest("td,th")
                                        .html();
                                    b(a).triggerHandler("jqGridCellSelect", [w, I, ha, c]);
                                    b.isFunction(a.p.onCellSelect) && a
                                        .p
                                        .onCellSelect
                                        .call(a, w, I, ha, c);
                                    if (a.p.cellEdit === true) 
                                        if (a.p.multiselect && d) 
                                            b(a).jqGrid("setSelection", w, true, c);
                                        else {
                                            w = p[0].rowIndex;
                                            try {
                                                b(a).jqGrid("editCell", w, I, true)
                                            } catch (g) {}
                                        }
                                    else if (a.p.multikey) 
                                        if (c[a.p.multikey]) 
                                            b(a).jqGrid("setSelection", w, true, c);
                                        else {
                                            if (a.p.multiselect && d) {
                                                d = b("#jqg_" + b.jgrid.jqID(a.p.id) + "_" + w).is(":checked");
                                                b("#jqg_" + b.jgrid.jqID(a.p.id) + "_" + w)[a.p.useProp
                                                        ? "prop"
                                                        : "attr"]("checked", d)
                                            }
                                        }
                                    else {
                                        if (a.p.multiselect && a.p.multiboxonly && !d) {
                                            var f = a.p.frozenColumns
                                                ? a.p.id + "_frozen"
                                                : "";
                                            b(a.p.selarrrow).each(function (c, d) {
                                                var e = a
                                                    .rows
                                                    .namedItem(d);
                                                b(e).removeClass("ui-state-highlight");
                                                b("#jqg_" + b.jgrid.jqID(a.p.id) + "_" + b.jgrid.jqID(d))[a.p.useProp
                                                        ? "prop"
                                                        : "attr"]("checked", false);
                                                if (f) {
                                                    b("#" + b.jgrid.jqID(d), "#" + b.jgrid.jqID(f)).removeClass("ui-state-highlight");
                                                    b("#jqg_" + b.jgrid.jqID(a.p.id) + "_" + b.jgrid.jqID(d), "#" + b.jgrid.jqID(f))[a.p.useProp
                                                            ? "prop"
                                                            : "attr"]("checked", false)
                                                }
                                            });
                                            a.p.selarrrow = []
                                        }
                                        b(a).jqGrid("setSelection", w, true, c)
                                    }
                                }
                            })
                            .bind("reloadGrid", function (c, d) {
                                if (a.p.treeGrid === true) 
                                    a.p.datatype = a.p.treedatatype;
                                d && d.current && a
                                    .grid
                                    .selectionPreserver(a);
                                if (a.p.datatype === "local") {
                                    b(a).jqGrid("resetSelection");
                                    a.p.data.length && N()
                                } else if (!a.p.treeGrid) {
                                    a.p.selrow = null;
                                    if (a.p.multiselect) {
                                        a.p.selarrrow = [];
                                        ca(false)
                                    }
                                    a.p.savedRow = []
                                }
                                a.p.scroll && V.call(a, true, false);
                                if (d && d.page) {
                                    var e = d.page;
                                    if (e > a.p.lastpage) 
                                        e = a.p.lastpage;
                                    e < 1 && (e = 1);
                                    a.p.page = e;
                                    a.grid.bDiv.scrollTop = a.grid.prevRowHeight
                                        ? (e - 1) * a.grid.prevRowHeight * a.p.rowNum
                                        : 0
                                }
                                if (a.grid.prevRowHeight && a.p.scroll) {
                                    delete a.p.lastpage;
                                    a
                                        .grid
                                        .populateVisible()
                                } else 
                                    a
                                        .grid
                                        .populate();
                                a.p._inlinenav === true && b(a).jqGrid("showAddEditButtons");
                                return false
                            })
                            .dblclick(function (c) {
                                v = c.target;
                                p = b(v, a.rows).closest("tr.jqgrow");
                                if (b(p).length !== 0) {
                                    w = p[0].rowIndex;
                                    I = b
                                        .jgrid
                                        .getCellIndex(v);
                                    b(a).triggerHandler("jqGridDblClickRow", [
                                        b(p).attr("id"),
                                        w,
                                        I,
                                        c
                                    ]);
                                    b.isFunction(a.p.ondblClickRow) && a
                                        .p
                                        .ondblClickRow
                                        .call(a, b(p).attr("id"), w, I, c)
                                }
                            })
                            .bind("contextmenu", function (c) {
                                v = c.target;
                                p = b(v, a.rows).closest("tr.jqgrow");
                                if (b(p).length !== 0) {
                                    a.p.multiselect || b(a).jqGrid("setSelection", p[0].id, true, c);
                                    w = p[0].rowIndex;
                                    I = b
                                        .jgrid
                                        .getCellIndex(v);
                                    b(a).triggerHandler("jqGridRightClickRow", [
                                        b(p).attr("id"),
                                        w,
                                        I,
                                        c
                                    ]);
                                    b.isFunction(a.p.onRightClickRow) && a
                                        .p
                                        .onRightClickRow
                                        .call(a, b(p).attr("id"), w, I, c)
                                }
                            });
                        c.bDiv = document.createElement("div");
                        k && "auto" === ("" + a.p.height).toLowerCase() && (a.p.height = "100%");
                        b(c.bDiv).append(b('<div style="position:relative;' + (k && 8 > b.jgrid.msiever()
                            ? "height:0.01%;"
                            : "") + '"></div>').append("<div></div>").append(this))
                            .addClass("ui-jqgrid-bdiv")
                            .css({
                                height: a.p.height + (isNaN(a.p.height)
                                    ? ""
                                    : "px"),
                                width: c.width + "px"
                            })
                            .scroll(c.scrollGrid);
                        b("table:first", c.bDiv).css({
                            width: a.p.tblwidth + "px"
                        });
                        b.support.tbody || 2 === b("tbody", this).length && b("tbody:gt(0)", this).remove();
                        a.p.multikey && (b.jgrid.msie
                            ? b(c.bDiv).bind("selectstart", function () {
                                return false
                            })
                            : b(c.bDiv).bind("mousedown", function () {
                                return false
                            }));
                        H && b(c.bDiv).hide();
                        c.cDiv = document.createElement("div");
                        var ia = !0 === a.p.hidegrid
                            ? b("<a role='link' href='javascript:void(0)'/>")
                                .addClass("ui-jqgrid-titlebar-close HeaderButton")
                                .hover(function () {
                                    ia.addClass("ui-state-hover")
                                }, function () {
                                    ia.removeClass("ui-state-hover")
                                })
                                .append("<span class='ui-icon ui-icon-circle-triangle-n'></span>")
                                .css("rtl" === f
                                    ? "left"
                                    : "right", "0px")
                            : "";
                        b(c.cDiv)
                            .append(ia)
                            .append("<span class='ui-jqgrid-title" + ("rtl" === f
                                ? "-rtl"
                                : "") + "'>" + a.p.caption + "</span>")
                            .addClass("ui-jqgrid-titlebar ui-widget-header ui-corner-top ui-helper-clearfix");
                        b(c.cDiv).insertBefore(c.hDiv);
                        a.p.toolbar[0] && (c.uDiv = document.createElement("div"), "top" === a.p.toolbar[1]
                            ? b(c.uDiv).insertBefore(c.hDiv)
                            : "bottom" === a.p.toolbar[1] && b(c.uDiv).insertAfter(c.hDiv), "both" === a.p.toolbar[1]
                            ? (c.ubDiv = document.createElement("div"), b(c.uDiv).addClass("ui-userdata ui-state-default").attr("id", "t_" + this.id).insertBefore(c.hDiv), b(c.ubDiv).addClass("ui-userdata ui-state-default").attr("id", "tb_" + this.id).insertAfter(c.hDiv), H && b(c.ubDiv).hide())
                            : b(c.uDiv).width(c.width).addClass("ui-userdata ui-state-default").attr("id", "t_" + this.id), H && b(c.uDiv).hide());
                        a.p.toppager && (a.p.toppager = b.jgrid.jqID(a.p.id) + "_toppager", c.topDiv = b("<div id='" + a.p.toppager + "'></div>")[0],
                        a.p.toppager = "#" + a.p.toppager,
                        b(c.topDiv).addClass("ui-state-default ui-jqgrid-toppager").width(c.width).insertBefore(c.hDiv),
                        ka(a.p.toppager, "_t"));
                        a.p.footerrow && (c.sDiv = b("<div class='ui-jqgrid-sdiv'></div>")[0],
                        g = b("<div class='ui-jqgrid-hbox" + ("rtl" === f
                            ? "-rtl"
                            : "") + "'></div>"),
                        b(c.sDiv).append(g).width(c.width).insertAfter(c.hDiv),
                        b(g).append(Q),
                        c.footers = b(".ui-jqgrid-ftable", c.sDiv)[0].rows[0].cells,
                        a.p.rownumbers && (c.footers[0].className = "ui-state-default jqgrid-rownum"),
                        H && b(c.sDiv).hide());
                        g = null;
                        if (a.p.caption) {
                            var ta = a.p.datatype;
                            !0 === a.p.hidegrid && (b(".ui-jqgrid-titlebar-close", c.cDiv).click(function (d) {
                                var e = b.isFunction(a.p.onHeaderClick),
                                    g = ".ui-jqgrid-bdiv, .ui-jqgrid-hdiv, .ui-jqgrid-pager, .ui-jqgrid-sdiv",
                                    f,
                                    h = this;
                                if (a.p.toolbar[0] === true) {
                                    a.p.toolbar[1] === "both" && (g = g + (", #" + b(c.ubDiv).attr("id")));
                                    g = g + (", #" + b(c.uDiv).attr("id"))
                                }
                                f = b(g, "#gview_" + b.jgrid.jqID(a.p.id)).length;
                                a.p.gridstate === "visible"
                                    ? b(g, "#gbox_" + b.jgrid.jqID(a.p.id)).slideUp("fast", function () {
                                        f--;
                                        if (f === 0) {
                                            b("span", h)
                                                .removeClass("ui-icon-circle-triangle-n")
                                                .addClass("ui-icon-circle-triangle-s");
                                            a.p.gridstate = "hidden";
                                            b("#gbox_" + b.jgrid.jqID(a.p.id)).hasClass("ui-resizable") && b(".ui-resizable-handle", "#gbox_" + b.jgrid.jqID(a.p.id)).hide();
                                            b(a).triggerHandler("jqGridHeaderClick", [a.p.gridstate, d]);
                                            e && (H || a.p.onHeaderClick.call(a, a.p.gridstate, d))
                                        }
                                    })
                                    : a.p.gridstate === "hidden" && b(g, "#gbox_" + b.jgrid.jqID(a.p.id)).slideDown("fast", function () {
                                        f--;
                                        if (f === 0) {
                                            b("span", h)
                                                .removeClass("ui-icon-circle-triangle-s")
                                                .addClass("ui-icon-circle-triangle-n");
                                            if (H) {
                                                a.p.datatype = ta;
                                                O();
                                                H = false
                                            }
                                            a.p.gridstate = "visible";
                                            b("#gbox_" + b.jgrid.jqID(a.p.id)).hasClass("ui-resizable") && b(".ui-resizable-handle", "#gbox_" + b.jgrid.jqID(a.p.id)).show();
                                            b(a).triggerHandler("jqGridHeaderClick", [a.p.gridstate, d]);
                                            e && (H || a.p.onHeaderClick.call(a, a.p.gridstate, d))
                                        }
                                    });
                                return false
                            }), H && (a.p.datatype = "local", b(".ui-jqgrid-titlebar-close", c.cDiv).trigger("click")))
                        } else 
                            b(c.cDiv).hide();
                        b(c.hDiv)
                            .after(c.bDiv)
                            .mousemove(function (a) {
                                if (c.resizing) {
                                    c.dragMove(a);
                                    return false
                                }
                            });
                        b(".ui-jqgrid-labels", c.hDiv).bind("selectstart", function () {
                            return false
                        });
                        b(document).mouseup(function () {
                            if (c.resizing) {
                                c.dragEnd();
                                return false
                            }
                            return true
                        });
                        a.formatCol = n;
                        a.sortData = la;
                        a.updatepager = function (c, d) {
                            var e,
                                g,
                                f,
                                h,
                                i,
                                j,
                                k,
                                l = "",
                                m = a.p.pager
                                    ? "_" + b
                                        .jgrid
                                        .jqID(a.p.pager.substr(1))
                                    : "",
                                n = a.p.toppager
                                    ? "_" + a
                                        .p
                                        .toppager
                                        .substr(1)
                                    : "";
                            f = parseInt(a.p.page, 10) - 1;
                            f < 0 && (f = 0);
                            f = f * parseInt(a.p.rowNum, 10);
                            i = f + a.p.reccount;
                            if (a.p.scroll) {
                                e = b("tbody:first > tr:gt(0)", a.grid.bDiv);
                                f = i - e.length;
                                a.p.reccount = e.length;
                                if (e = e.outerHeight() || a.grid.prevRowHeight) {
                                    g = f * e;
                                    k = parseInt(a.p.records, 10) * e;
                                    b(">div:first", a.grid.bDiv)
                                        .css({height: k})
                                        .children("div:first")
                                        .css({
                                            height: g,
                                            display: g
                                                ? ""
                                                : "none"
                                        });
                                    if (a.grid.bDiv.scrollTop == 0 && a.p.page > 1) 
                                        a.grid.bDiv.scrollTop = a.p.rowNum * (a.p.page - 1) * e
                                }
                                a.grid.bDiv.scrollLeft = a.grid.hDiv.scrollLeft
                            }
                            l = a.p.pager || "";
                            if (l = l + (a.p.toppager
                                ? l
                                    ? "," + a.p.toppager
                                    : a.p.toppager
                                : "")) {
                                k = b.jgrid.formatter.integer || {};
                                e = o(a.p.page);
                                g = o(a.p.lastpage);
                                b(".selbox", l)[this.p.useProp
                                        ? "prop"
                                        : "attr"]("disabled", false);
                                if (a.p.pginput === true) {
                                    b(".ui-pg-input", l).val(a.p.page);
                                    h = a.p.toppager
                                        ? "#sp_1" + m + ",#sp_1" + n
                                        : "#sp_1" + m;
                                    b(h).html(b.fmatter
                                        ? b.fmatter.util.NumberFormat(a.p.lastpage, k)
                                        : a.p.lastpage)
                                }
                                if (a.p.viewrecords) 
                                    if (a.p.reccount === 0) 
                                        b(".ui-paging-info", l).html(a.p.emptyrecords);
                                    else {
                                        h = f + 1;
                                        j = a.p.records;
                                        if (b.fmatter) {
                                            h = b
                                                .fmatter
                                                .util
                                                .NumberFormat(h, k);
                                            i = b
                                                .fmatter
                                                .util
                                                .NumberFormat(i, k);
                                            j = b
                                                .fmatter
                                                .util
                                                .NumberFormat(j, k)
                                        }
                                        b(".ui-paging-info", l).html(b.jgrid.format(a.p.recordtext, h, i, j))
                                    }
                                if (a.p.pgbuttons === true) {
                                    e <= 0 && (e = g = 0);
                                    if (e === 1 || e === 0) {
                                        b("#first" + m + ", #prev" + m)
                                            .addClass("ui-state-disabled")
                                            .removeClass("ui-state-hover");
                                        a.p.toppager && b("#first_t" + n + ", #prev_t" + n)
                                            .addClass("ui-state-disabled")
                                            .removeClass("ui-state-hover")
                                    } else {
                                        b("#first" + m + ", #prev" + m).removeClass("ui-state-disabled");
                                        a.p.toppager && b("#first_t" + n + ", #prev_t" + n).removeClass("ui-state-disabled")
                                    }
                                    if (e === g || e === 0) {
                                        b("#next" + m + ", #last" + m)
                                            .addClass("ui-state-disabled")
                                            .removeClass("ui-state-hover");
                                        a.p.toppager && b("#next_t" + n + ", #last_t" + n)
                                            .addClass("ui-state-disabled")
                                            .removeClass("ui-state-hover")
                                    } else {
                                        b("#next" + m + ", #last" + m).removeClass("ui-state-disabled");
                                        a.p.toppager && b("#next_t" + n + ", #last_t" + n).removeClass("ui-state-disabled")
                                    }
                                }
                            }
                            c === true && a.p.rownumbers === true && b(">td.jqgrid-rownum", a.rows).each(function (a) {
                                b(this).html(f + 1 + a)
                            });
                            d && a.p.jqgdnd && b(a).jqGrid("gridDnD", "updateDnD");
                            b(a).triggerHandler("jqGridGridComplete");
                            b.isFunction(a.p.gridComplete) && a
                                .p
                                .gridComplete
                                .call(a);
                            b(a).triggerHandler("jqGridAfterGridComplete")
                        };
                        a.refreshIndex = N;
                        a.setHeadCheckBox = ca;
                        a.constructTr = X;
                        a.formatter = function (a, b, c, d, e) {
                            return t(a, b, c, d, e)
                        };
                        b.extend(c, {
                            populate: O,
                            emptyRows: V
                        });
                        this.grid = c;
                        a.addXmlData = function (b) {
                            J(b, a.grid.bDiv)
                        };
                        a.addJSONData = function (b) {
                            S(b, a.grid.bDiv)
                        };
                        this.grid.cols = this.rows[0].cells;
                        b(a).triggerHandler("jqGridInitGrid");
                        b.isFunction(a.p.onInitGrid) && a
                            .p
                            .onInitGrid
                            .call(a);
                        O();
                        a.p.hiddengrid = !1
                    }
                }
            }
        })
    };
    b
        .jgrid
        .extend({
            getGridParam: function (b) {
                var f = this[0];
                return !f || !f.grid
                    ? void 0
                    : !b
                        ? f.p
                        : void 0 !== f.p[b]
                            ? f.p[b]
                            : null
            },
            setGridParam: function (d) {
                return this.each(function () {
                    this.grid && "object" === typeof d && b.extend(!0, this.p, d)
                })
            },
            getDataIDs: function () {
                var d = [],
                    f = 0,
                    c,
                    e = 0;
                this.each(function () {
                    if ((c = this.rows.length) && 0 < c) 
                        for (; f < c;) 
                            b(this.rows[f]).hasClass("jqgrow") && (d[e] = this.rows[f].id, e++),
                            f++
                        }
                    );
                return d
            },
            setSelection: function (d, f, c) {
                return this.each(function () {
                    var e,
                        a,
                        j,
                        g,
                        h,
                        i;
                    if (void 0 !== d && (f = !1 === f
                        ? !1
                        : !0, (a = this.rows.namedItem("" + d)) && a.className && !(-1 < a.className.indexOf("ui-state-disabled")))) 
                        if (!0 === this.p.scrollrows && (j = this.rows.namedItem(d).rowIndex, 0 <= j && (e = b(this.grid.bDiv)[0].clientHeight,
                        g = b(this.grid.bDiv)[0].scrollTop,
                        h = b(this.rows[j]).position().top,
                        j = this.rows[j].clientHeight,
                        h + j >= e + g
                            ? b(this.grid.bDiv)[0].scrollTop = h - (e + g) + j + g
                            : h < e + g && h < g && (b(this.grid.bDiv)[0].scrollTop = h))), !0 === this.p.frozenColumns && (i = this.p.id + "_frozen"), this.p.multiselect) {
                            if (this.setHeadCheckBox(!1), this.p.selrow = a.id, g = b.inArray(this.p.selrow, this.p.selarrrow), -1 === g
                                ? ("ui-subgrid" !== a.className && b(a).addClass("ui-state-highlight").attr("aria-selected", "true"), e = !0, this.p.selarrrow.push(this.p.selrow))
                                : ("ui-subgrid" !== a.className && b(a).removeClass("ui-state-highlight").attr("aria-selected", "false"), e = !1, this.p.selarrrow.splice(g, 1), h = this.p.selarrrow[0], this.p.selrow = void 0 === h
                                    ? null
                                    : h), b("#jqg_" + b.jgrid.jqID(this.p.id) + "_" + b.jgrid.jqID(a.id))[this.p.useProp
                                    ? "prop"
                                    : "attr"]("checked", e),
                            i && (-1 === g
                                ? b("#" + b.jgrid.jqID(d), "#" + b.jgrid.jqID(i)).addClass("ui-state-highlight")
                                : b("#" + b.jgrid.jqID(d), "#" + b.jgrid.jqID(i)).removeClass("ui-state-highlight"), b("#jqg_" + b.jgrid.jqID(this.p.id) + "_" + b.jgrid.jqID(d), "#" + b.jgrid.jqID(i))[this.p.useProp
                                    ? "prop"
                                    : "attr"]("checked", e)),
                            f) 
                                b(this).triggerHandler("jqGridSelectRow", [a.id, e, c]),
                                this.p.onSelectRow && this.p.onSelectRow.call(this, a.id, e, c)
                        }
                    else if ("ui-subgrid" !== a.className && (this.p.selrow !== a.id
                        ? (b(this.rows.namedItem(this.p.selrow)).removeClass("ui-state-highlight").attr({"aria-selected": "false", tabindex: "-1"}), b(a).addClass("ui-state-highlight").attr({"aria-selected": "true", tabindex: "0"}), i && (b("#" + b.jgrid.jqID(this.p.selrow), "#" + b.jgrid.jqID(i)).removeClass("ui-state-highlight"), b("#" + b.jgrid.jqID(d), "#" + b.jgrid.jqID(i)).addClass("ui-state-highlight")), e = !0)
                        : e = !1, this.p.selrow = a.id, f)) 
                        b(this).triggerHandler("jqGridSelectRow", [a.id, e, c]),
                        this.p.onSelectRow && this.p.onSelectRow.call(this, a.id, e, c)
                })
            },
            resetSelection: function (d) {
                return this.each(function () {
                    var f = this,
                        c,
                        e,
                        a;
                    !0 === f.p.frozenColumns && (a = f.p.id + "_frozen");
                    if (void 0 !== d) {
                        e = d === f.p.selrow
                            ? f.p.selrow
                            : d;
                        b("#" + b.jgrid.jqID(f.p.id) + " tbody:first tr#" + b.jgrid.jqID(e))
                            .removeClass("ui-state-highlight")
                            .attr("aria-selected", "false");
                        a && b("#" + b.jgrid.jqID(e), "#" + b.jgrid.jqID(a)).removeClass("ui-state-highlight");
                        if (f.p.multiselect) {
                            b("#jqg_" + b.jgrid.jqID(f.p.id) + "_" + b.jgrid.jqID(e), "#" + b.jgrid.jqID(f.p.id))[f.p.useProp
                                    ? "prop"
                                    : "attr"]("checked", !1);
                            if (a) 
                                b("#jqg_" + b.jgrid.jqID(f.p.id) + "_" + b.jgrid.jqID(e), "#" + b.jgrid.jqID(a))[f.p.useProp
                                        ? "prop"
                                        : "attr"]("checked", !1);
                            f.setHeadCheckBox(!1)
                        }
                        e = null
                    } else 
                        f.p.multiselect
                            ? (b(f.p.selarrrow).each(function (d, e) {
                                c = f
                                    .rows
                                    .namedItem(e);
                                b(c)
                                    .removeClass("ui-state-highlight")
                                    .attr("aria-selected", "false");
                                b("#jqg_" + b.jgrid.jqID(f.p.id) + "_" + b.jgrid.jqID(e))[f.p.useProp
                                        ? "prop"
                                        : "attr"]("checked", !1);
                                a && (b("#" + b.jgrid.jqID(e), "#" + b.jgrid.jqID(a)).removeClass("ui-state-highlight"), b("#jqg_" + b.jgrid.jqID(f.p.id) + "_" + b.jgrid.jqID(e), "#" + b.jgrid.jqID(a))[f.p.useProp
                                        ? "prop"
                                        : "attr"]("checked", !1))
                            }), f.setHeadCheckBox(!1), f.p.selarrrow = [])
                            : f.p.selrow && (b("#" + b.jgrid.jqID(f.p.id) + " tbody:first tr#" + b.jgrid.jqID(f.p.selrow)).removeClass("ui-state-highlight").attr("aria-selected", "false"), a && b("#" + b.jgrid.jqID(f.p.selrow), "#" + b.jgrid.jqID(a)).removeClass("ui-state-highlight"), f.p.selrow = null);
                    
                    !0 === f.p.cellEdit && 0 <= parseInt(f.p.iCol, 10) && 0 <= parseInt(f.p.iRow, 10) && (b("td:eq(" + f.p.iCol + ")", f.rows[f.p.iRow]).removeClass("edit-cell ui-state-highlight"), b(f.rows[f.p.iRow]).removeClass("selected-row ui-state-hover"));
                    f.p.savedRow = []
                })
            },
            getRowData: function (d) {
                var f = {},
                    c,
                    e = !1,
                    a,
                    j = 0;
                this.each(function () {
                    var g = this,
                        h,
                        i;
                    if (void 0 === d) 
                        e = !0,
                        c = [],
                        a = g.rows.length;
                    else {
                        i = g
                            .rows
                            .namedItem(d);
                        if (!i) 
                            return f;
                        a = 2
                    }
                    for (; j < a;) 
                        e && (i = g.rows[j]),
                        b(i).hasClass("jqgrow") && (b('td[role="gridcell"]', i).each(function (a) {
                            h = g.p.colModel[a].name;
                            if ("cb" !== h && "subgrid" !== h && "rn" !== h) 
                                if (!0 === g.p.treeGrid && h === g.p.ExpandColumn) 
                                    f[h] = b.jgrid.htmlDecode(b("span:first", this).html());
                                else 
                                    try {
                                        f[h] = b
                                            .unformat
                                            .call(g, this, {
                                                rowId: i.id,
                                                colModel: g.p.colModel[a]
                                            }, a)
                                    } catch (c) {
                                        f[h] = b
                                            .jgrid
                                            .htmlDecode(b(this).html())
                                    }
                                }), e && (c.push(f), f = {})),
                        j++
                    }
                );
                return c || f
            },
            delRowData: function (d) {
                var f = !1,
                    c,
                    e;
                this.each(function () {
                    c = this
                        .rows
                        .namedItem(d);
                    if (!c) 
                        return !1;
                    b(c).remove();
                    this.p.records--;
                    this.p.reccount--;
                    this.updatepager(!0, !1);
                    f = !0;
                    this.p.multiselect && (e = b.inArray(d, this.p.selarrrow), -1 !== e && this.p.selarrrow.splice(e, 1));
                    this.p.selrow = this.p.multiselect && 0 < this.p.selarrrow.length
                        ? this.p.selarrrow[this.p.selarrrow.length - 1]
                        : null;
                    if ("local" === this.p.datatype) {
                        var a = this.p._index[
                            b
                                .jgrid
                                .stripPref(this.p.idPrefix, d)
                        ];
                        void 0 !== a && (this.p.data.splice(a, 1), this.refreshIndex())
                    }
                    if (!0 === this.p.altRows && f) {
                        var j = this.p.altclass;
                        b(this.rows).each(function (a) {
                            a % 2 === 1
                                ? b(this).addClass(j)
                                : b(this).removeClass(j)
                        })
                    }
                });
                return f
            },
            setRowData: function (d, f, c) {
                var e,
                    a = !0,
                    j;
                this.each(function () {
                    if (!this.grid) 
                        return !1;
                    var g = this,
                        h,
                        i,
                        k = typeof c,
                        l = {};
                    i = g
                        .rows
                        .namedItem(d);
                    if (!i) 
                        return !1;
                    if (f) 
                        try {
                            if (b(this.p.colModel).each(function (a) {
                                e = this.name;
                                var c = b
                                    .jgrid
                                    .getAccessor(f, e);
                                void 0 !== c && (l[e] = this.formatter && "string" === typeof this.formatter && "date" === this.formatter
                                    ? b.unformat.date.call(g, c, this)
                                    : c, h = g.formatter(d, c, a, f, "edit"), j = this.title
                                    ? {
                                        title: b
                                            .jgrid
                                            .stripHtml(h)
                                    }
                                    : {}, !0 === g.p.treeGrid && e === g.p.ExpandColumn
                                    ? b("td[role='gridcell']:eq(" + a + ") > span:first", i).html(h).attr(j)
                                    : b("td[role='gridcell']:eq(" + a + ")", i).html(h).attr(j))
                            }), "local" === g.p.datatype) {
                                var o = b
                                        .jgrid
                                        .stripPref(g.p.idPrefix, d),
                                    n = g.p._index[o],
                                    m;
                                if (g.p.treeGrid) 
                                    for (m in g.p.treeReader) 
                                        g.p.treeReader.hasOwnProperty(m) && delete l[g.p.treeReader[m]];
                            void 0 !== n && (g.p.data[n] = b.extend(!0, g.p.data[n], l));
                                l = null
                            }
                        } catch (t) {
                            a = !1
                        }
                    a && ("string" === k
                        ? b(i).addClass(c)
                        : "object" === k && b(i).css(c), b(g).triggerHandler("jqGridAfterGridComplete"))
                });
                return a
            },
            addRowData: function (d, f, c, e) {
                c || (c = "last");
                var a = !1,
                    j,
                    g,
                    h,
                    i,
                    k,
                    l,
                    o,
                    n,
                    m = "",
                    t,
                    A,
                    T,
                    M,
                    $,
                    U;
                f && (b.isArray(f)
                    ? (t = !0, c = "last", A = d)
                    : (f = [f], t = !1), this.each(function () {
                    var V = f.length;
                    k = this.p.rownumbers === true
                        ? 1
                        : 0;
                    h = this.p.multiselect === true
                        ? 1
                        : 0;
                    i = this.p.subGrid === true
                        ? 1
                        : 0;
                    if (!t) 
                        if (d !== void 0) 
                            d = "" + d;
                        else {
                            d = b
                                .jgrid
                                .randId();
                            if (this.p.keyIndex !== false) {
                                A = this.p.colModel[this.p.keyIndex + h + i + k].name;
                                f[0][A] !== void 0 && (d = f[0][A])
                            }
                        }
                    T = this.p.altclass;
                    for (var N = 0, X = "", J = {}, S = b.isFunction(this.p.afterInsertRow)
                        ? true
                        : false; N < V;) {
                        M = f[N];
                        g = [];
                        if (t) {
                            try {
                                d = M[A];
                                d === void 0 && (d = b.jgrid.randId())
                            } catch (ja) {
                                d = b
                                    .jgrid
                                    .randId()
                            }
                            X = this.p.altRows === true
                                ? (this.rows.length - 1) % 2 === 0
                                    ? T
                                    : ""
                                : ""
                        }
                        U = d;
                        d = this.p.idPrefix + d;
                        if (k) {
                            m = this.formatCol(0, 1, "", null, d, true);
                            g[g.length] = '<td role="gridcell" class="ui-state-default jqgrid-rownum" ' + m + ">0</td>"
                        }
                        if (h) {
                            n = '<div style="width:23px;height:30px;position:relative;"><input role="checkbox" type="checkbox" id="jqg_' + this.p.id + "_" + d + '" class="cbox"/><label></label></div>';
                            m = this.formatCol(k, 1, "", null, d, true);
                            g[g.length] = '<td role="gridcell" ' + m + ">" + n + "</td>"
                        }
                        i && (g[g.length] = b(this).jqGrid("addSubGridCell", h + k, 1));
                        for (o = h + i + k; o < this.p.colModel.length; o++) {
                            $ = this.p.colModel[o];
                            j = $.name;
                            J[j] = M[j];
                            n = this.formatter(d, b.jgrid.getAccessor(M, j), o, M);
                            m = this.formatCol(o, 1, n, M, d, J);
                            g[g.length] = '<td role="gridcell" ' + m + ">" + n + "</td>"
                        }
                        g.unshift(this.constructTr(d, false, X, J, M, false));
                        g[g.length] = "</tr>";
                        if (this.rows.length === 0) 
                            b("table:first", this.grid.bDiv).append(g.join(""));
                        else 
                            switch (c) {
                                case "last":
                                    b(this.rows[this.rows.length - 1]).after(g.join(""));
                                    l = this.rows.length - 1;
                                    break;
                                case "first":
                                    b(this.rows[0]).after(g.join(""));
                                    l = 1;
                                    break;
                                case "after":
                                    (l = this.rows.namedItem(e)) && (b(this.rows[l.rowIndex + 1]).hasClass("ui-subgrid")
                                        ? b(this.rows[l.rowIndex + 1]).after(g)
                                        : b(l).after(g.join("")));
                                    l++;
                                    break;
                                case "before":
                                    if (l = this.rows.namedItem(e)) {
                                        b(l).before(g.join(""));
                                        l = l.rowIndex
                                    }
                                    l--
                            }
                        this.p.subGrid === true && b(this).jqGrid("addSubGrid", h + k, l);
                        this.p.records++;
                        this.p.reccount++;
                        b(this).triggerHandler("jqGridAfterInsertRow", [d, M, M]);
                        S && this
                            .p
                            .afterInsertRow
                            .call(this, d, M, M);
                        N++;
                        if (this.p.datatype === "local") {
                            J[this.p.localReader.id] = U;
                            this.p._index[U] = this.p.data.length;
                            this
                                .p
                                .data
                                .push(J);
                            J = {}
                        }
                    }
                    this.p.altRows === true && !t && (c === "last"
                        ? (this.rows.length - 1) % 2 === 1 && b(this.rows[this.rows.length - 1]).addClass(T)
                        : b(this.rows).each(function (a) {
                            a % 2 === 1
                                ? b(this).addClass(T)
                                : b(this).removeClass(T)
                        }));
                    this.updatepager(true, true);
                    a = true
                }));
                return a
            },
            footerData: function (d, f, c) {
                function e(a) {
                    for (var b in a) 
                        if (a.hasOwnProperty(b)) 
                            return !1;
                return !0
                }
                var a,
                    j = !1,
                    g = {},
                    h;
                void 0 === d && (d = "get");
                "boolean" !== typeof c && (c = !0);
                d = d.toLowerCase();
                this.each(function () {
                    var i = this,
                        k;
                    if (!i.grid || !i.p.footerrow || "set" === d && e(f)) 
                        return !1;
                    j = !0;
                    b(this.p.colModel).each(function (e) {
                        a = this.name;
                        "set" === d
                            ? void 0 !== f[a] && (k = c
                                ? i.formatter("", f[a], e, f, "edit")
                                : f[a], h = this.title
                                ? {
                                    title: b
                                        .jgrid
                                        .stripHtml(k)
                                }
                                : {}, b("tr.footrow td:eq(" + e + ")", i.grid.sDiv).html(k).attr(h), j = !0)
                            : "get" === d && (g[a] = b("tr.footrow td:eq(" + e + ")", i.grid.sDiv).html())
                    })
                });
                return "get" === d
                    ? g
                    : j
            },
            showHideCol: function (d, f) {
                return this.each(function () {
                    var c = this,
                        e = !1,
                        a = b.jgrid.cell_width
                            ? 0
                            : c.p.cellLayout,
                        j;
                    if (c.grid) {
                        "string" === typeof d && (d = [d]);
                        f = "none" !== f
                            ? ""
                            : "none";
                        var g = "" === f
                                ? !0
                                : !1,
                            h = c.p.groupHeader && ("object" === typeof c.p.groupHeader || b.isFunction(c.p.groupHeader));
                        h && b(c).jqGrid("destroyGroupHeader", !1);
                        b(this.p.colModel).each(function (h) {
                            if (-1 !== b.inArray(this.name, d) && this.hidden === g) {
                                if (!0 === c.p.frozenColumns && !0 === this.frozen) 
                                    return !0;
                                b("tr", c.grid.hDiv)
                                    .each(function () {
                                        b(this.cells[h]).css("display", f)
                                    });
                                b(c.rows).each(function () {
                                    b(this).hasClass("jqgroup") || b(this.cells[h]).css("display", f)
                                });
                                c.p.footerrow && b("tr.footrow td:eq(" + h + ")", c.grid.sDiv).css("display", f);
                                j = parseInt(this.width, 10);
                                c.p.tblwidth = "none" === f
                                    ? c.p.tblwidth - (j + a)
                                    : c.p.tblwidth + (j + a);
                                this.hidden = !g;
                                e = !0;
                                b(c).triggerHandler("jqGridShowHideCol", [g, this.name, h])
                            }
                        });
                        !0 === e && (!0 === c.p.shrinkToFit && !isNaN(c.p.height) && (c.p.tblwidth += parseInt(c.p.scrollOffset, 10)), b(c).jqGrid("setGridWidth", !0 === c.p.shrinkToFit
                            ? c.p.tblwidth
                            : c.p.width));
                        h && b(c).jqGrid("setGroupHeaders", c.p.groupHeader)
                    }
                })
            },
            hideCol: function (d) {
                return this.each(function () {
                    b(this).jqGrid("showHideCol", d, "none")
                })
            },
            showCol: function (d) {
                return this.each(function () {
                    b(this).jqGrid("showHideCol", d, "")
                })
            },
            remapColumns: function (d, f, c) {
                function e(a) {
                    var c;
                    c = a.length
                        ? b.makeArray(a)
                        : b.extend({}, a);
                    b.each(d, function (b) {
                        a[b] = c[this]
                    })
                }
                function a(a, c) {
                    b(">tr" + (c || ""), a)
                        .each(function () {
                            var a = this,
                                c = b.makeArray(a.cells);
                            b.each(d, function () {
                                var b = c[this];
                                b && a.appendChild(b)
                            })
                        })
                }
                var j = this.get(0);
                e(j.p.colModel);
                e(j.p.colNames);
                e(j.grid.headers);
                a(b("thead:first", j.grid.hDiv), c && ":not(.ui-jqgrid-labels)");
                f && a(b("#" + b.jgrid.jqID(j.p.id) + " tbody:first"), ".jqgfirstrow, tr.jqgrow, tr.jqfoot");
                j.p.footerrow && a(b("tbody:first", j.grid.sDiv));
                j.p.remapColumns && (j.p.remapColumns.length
                    ? e(j.p.remapColumns)
                    : j.p.remapColumns = b.makeArray(d));
                j.p.lastsort = b.inArray(j.p.lastsort, d);
                j.p.treeGrid && (j.p.expColInd = b.inArray(j.p.expColInd, d));
                b(j).triggerHandler("jqGridRemapColumns", [d, f, c])
            },
            setGridWidth: function (d, f) {
                return this.each(function () {
                    if (this.grid) {
                        var c = this,
                            e,
                            a = 0,
                            j = b.jgrid.cell_width
                                ? 0
                                : c.p.cellLayout,
                            g,
                            h = 0,
                            i = !1,
                            k = c.p.scrollOffset,
                            l,
                            o = 0,
                            n;
                        "boolean" !== typeof f && (f = c.p.shrinkToFit);
                        if (!isNaN(d)) {
                            d = parseInt(d, 10);
                            c.grid.width = c.p.width = d;
                            b("#gbox_" + b.jgrid.jqID(c.p.id)).css("width", d + "px");
                            b("#gview_" + b.jgrid.jqID(c.p.id)).css("width", d + "px");
                            b(c.grid.bDiv).css("width", d + "px");
                            b(c.grid.hDiv).css("width", d + "px");
                            c.p.pager && b(c.p.pager).css("width", d + "px");
                            c.p.toppager && b(c.p.toppager).css("width", d + "px");
                            !0 === c.p.toolbar[0] && (b(c.grid.uDiv).css("width", d + "px"), "both" === c.p.toolbar[1] && b(c.grid.ubDiv).css("width", d + "px"));
                            c.p.footerrow && b(c.grid.sDiv).css("width", d + "px");
                            !1 === f && !0 === c.p.forceFit && (c.p.forceFit = !1);
                            if (!0 === f) {
                                b
                                    .each(c.p.colModel, function () {
                                        if (this.hidden === false) {
                                            e = this.widthOrg;
                                            a = a + (e + j);
                                            this.fixed
                                                ? o = o + (e + j)
                                                : h++
                                        }
                                    });
                                if (0 === h) 
                                    return;
                                c.p.tblwidth = a;
                                l = d - j * h - o;
                                if (!isNaN(c.p.height) && (b(c.grid.bDiv)[0].clientHeight < b(c.grid.bDiv)[0].scrollHeight || 1 === c.rows.length)) 
                                    i = !0,
                                    l -= k;
                                var a = 0,
                                    m = 0 < c.grid.cols.length;
                                b.each(c.p.colModel, function (b) {
                                    if (this.hidden === false && !this.fixed) {
                                        e = this.widthOrg;
                                        e = Math.round(l * e / (c.p.tblwidth - j * h - o));
                                        if (!(e < 0)) {
                                            this.width = e;
                                            a = a + e;
                                            c.grid.headers[b].width = e;
                                            c.grid.headers[b].el.style.width = e + "px";
                                            if (c.p.footerrow) 
                                                c.grid.footers[b].style.width = e + "px";
                                            if (m) 
                                                c.grid.cols[b].style.width = e + "px";
                                            g = b
                                        }
                                    }
                                });
                                if (!g) 
                                    return;
                                n = 0;
                                i
                                    ? d - o - (a + j * h) !== k && (n = d - o - (a + j * h) - k)
                                    : 1 !== Math.abs(d - o - (a + j * h)) && (n = d - o - (a + j * h));
                                c.p.colModel[g].width += n;
                                c.p.tblwidth = a + n + j * h + o;
                                c.p.tblwidth > d
                                    ? (i = c.p.tblwidth - parseInt(d, 10), c.p.tblwidth = d, e = c.p.colModel[g].width -= i)
                                    : e = c.p.colModel[g].width;
                                c.grid.headers[g].width = e;
                                c.grid.headers[g].el.style.width = e + "px";
                                m && (c.grid.cols[g].style.width = e + "px");
                                c.p.footerrow && (c.grid.footers[g].style.width = e + "px")
                            }
                            c.p.tblwidth && (b("table:first", c.grid.bDiv).css("width", c.p.tblwidth + "px"), b("table:first", c.grid.hDiv).css("width", c.p.tblwidth + "px"), c.grid.hDiv.scrollLeft = c.grid.bDiv.scrollLeft, c.p.footerrow && b("table:first", c.grid.sDiv).css("width", c.p.tblwidth + "px"))
                        }
                    }
                })
            },
            setGridHeight: function (d) {
                return this.each(function () {
                    if (this.grid) {
                        var f = b(this.grid.bDiv);
                        f.css({
                            height: d + (isNaN(d)
                                ? ""
                                : "px")
                        });
                        !0 === this.p.frozenColumns && b("#" + b.jgrid.jqID(this.p.id) + "_frozen")
                            .parent()
                            .height(f.height() - 16);
                        this.p.height = d;
                        this.p.scroll && this
                            .grid
                            .populateVisible()
                    }
                })
            },
            setCaption: function (d) {
                return this.each(function () {
                    this.p.caption = d;
                    b("span.ui-jqgrid-title, span.ui-jqgrid-title-rtl", this.grid.cDiv).html(d);
                    b(this.grid.cDiv).show()
                })
            },
            setLabel: function (d, f, c, e) {
                return this.each(function () {
                    var a = -1;
                    if (this.grid && void 0 !== d && (b(this.p.colModel).each(function (b) {
                        if (this.name === d) 
                            return a = b,
                            !1
                    }), 0 <= a)) {
                        var j = b("tr.ui-jqgrid-labels th:eq(" + a + ")", this.grid.hDiv);
                        if (f) {
                            var g = b(".s-ico", j);
                            b("[id^=jqgh_]", j)
                                .empty()
                                .html(f)
                                .append(g);
                            this.p.colNames[a] = f
                        }
                        c && ("string" === typeof c
                            ? b(j).addClass(c)
                            : b(j).css(c));
                        "object" === typeof e && b(j).attr(e)
                    }
                })
            },
            setCell: function (d, f, c, e, a, j) {
                return this.each(function () {
                    var g = -1,
                        h,
                        i;
                    if (this.grid && (isNaN(f)
                        ? b(this.p.colModel).each(function (a) {
                            if (this.name === f) 
                                return g = a,
                                !1
                        })
                        : g = parseInt(f, 10), 0 <= g && (h = this.rows.namedItem(d)))) {
                        var k = b("td:eq(" + g + ")", h);
                        if ("" !== c || !0 === j) 
                            h = this.formatter(d, c, g, h, "edit"),
                            i = this.p.colModel[g].title
                                ? {
                                    title: b
                                        .jgrid
                                        .stripHtml(h)
                                }
                        : {},
                        this.p.treeGrid && 0 < b(".tree-wrap", b(k)).length
                            ? b("span", b(k))
                                .html(h)
                                .attr(i)
                            : b(k)
                                .html(h)
                                .attr(i),
                        "local" === this.p.datatype && (h = this.p.colModel[g], c = h.formatter && "string" === typeof h.formatter && "date" === h.formatter
                            ? b.unformat.date.call(this, c, h)
                            : c, i = this.p._index[
                            b
                                .jgrid
                                .stripPref(this.p.idPrefix, d)
                        ], void 0 !== i && (this.p.data[i][h.name] = c));
                        "string" === typeof e
                            ? b(k).addClass(e)
                            : e && b(k).css(e);
                        "object" === typeof a && b(k).attr(a)
                    }
                })
            },
            getCell: function (d, f) {
                var c = !1;
                this.each(function () {
                    var e = -1;
                    if (this.grid && (isNaN(f)
                        ? b(this.p.colModel).each(function (a) {
                            if (this.name === f) 
                                return e = a,
                                !1
                        })
                        : e = parseInt(f, 10), 0 <= e)) {
                        var a = this
                            .rows
                            .namedItem(d);
                        if (a) 
                            try {
                                c = b
                                    .unformat
                                    .call(this, b("td:eq(" + e + ")", a), {
                                        rowId: a.id,
                                        colModel: this.p.colModel[e]
                                    }, e)
                            } catch (j) {
                                c = b
                                    .jgrid
                                    .htmlDecode(b("td:eq(" + e + ")", a).html())
                            }
                        }
                });
                return c
            },
            getCol: function (d, f, c) {
                var e = [],
                    a,
                    j = 0,
                    g,
                    h,
                    i,
                    f = "boolean" !== typeof f
                        ? !1
                        : f;
                void 0 === c && (c = !1);
                this.each(function () {
                    var k = -1;
                    if (this.grid && (isNaN(d)
                        ? b(this.p.colModel).each(function (a) {
                            if (this.name === d) 
                                return k = a,
                                !1
                        })
                        : k = parseInt(d, 10), 0 <= k)) {
                        var l = this.rows.length,
                            o = 0;
                        if (l && 0 < l) {
                            for (; o < l;) {
                                if (b(this.rows[o]).hasClass("jqgrow")) {
                                    try {
                                        a = b
                                            .unformat
                                            .call(this, b(this.rows[o].cells[k]), {
                                                rowId: this.rows[o].id,
                                                colModel: this.p.colModel[k]
                                            }, k)
                                    } catch (n) {
                                        a = b
                                            .jgrid
                                            .htmlDecode(this.rows[o].cells[k].innerHTML)
                                    }
                                    c
                                        ? (i = parseFloat(a), j += i, void 0 === h && (h = g = i), g = Math.min(g, i), h = Math.max(h, i))
                                        : f
                                            ? e.push({id: this.rows[o].id, value: a})
                                            : e.push(a)
                                }
                                o++
                            }
                            if (c) 
                                switch (c.toLowerCase()) {
                                    case "sum":
                                        e = j;
                                        break;
                                    case "avg":
                                        e = j / l;
                                        break;
                                    case "count":
                                        e = l;
                                        break;
                                    case "min":
                                        e = g;
                                        break;
                                    case "max":
                                        e = h
                                }
                            }
                    }
                });
                return e
            },
            clearGridData: function (d) {
                return this.each(function () {
                    if (this.grid) {
                        "boolean" !== typeof d && (d = !1);
                        if (this.p.deepempty) 
                            b("#" + b.jgrid.jqID(this.p.id) + " tbody:first tr:gt(0)").remove();
                        else {
                            var f = b("#" + b.jgrid.jqID(this.p.id) + " tbody:first tr:first")[0];
                            b("#" + b.jgrid.jqID(this.p.id) + " tbody:first")
                                .empty()
                                .append(f)
                        }
                        this.p.footerrow && d && b(".ui-jqgrid-ftable td", this.grid.sDiv).html("&#160;");
                        this.p.selrow = null;
                        this.p.selarrrow = [];
                        this.p.savedRow = [];
                        this.p.records = 0;
                        this.p.page = 1;
                        this.p.lastpage = 0;
                        this.p.reccount = 0;
                        this.p.data = [];
                        this.p._index = {};
                        this.updatepager(!0, !1)
                    }
                })
            },
            getInd: function (b, f) {
                var c = !1,
                    e;
                this.each(function () {
                    (e = this.rows.namedItem(b)) && (c = !0 === f
                        ? e
                        : e.rowIndex)
                });
                return c
            },
            bindKeys: function (d) {
                var f = b.extend({
                    onEnter: null,
                    onSpace: null,
                    onLeftKey: null,
                    onRightKey: null,
                    scrollingRows: !0
                }, d || {});
                return this.each(function () {
                    var c = this;
                    b("body").is("[role]") || b("body").attr("role", "application");
                    c.p.scrollrows = f.scrollingRows;
                    b(c).keydown(function (d) {
                        var a = b(c).find("tr[tabindex=0]")[0],
                            j,
                            g,
                            h,
                            i = c.p.treeReader.expanded_field;
                        if (a) 
                            if (h = c.p._index[
                                b
                                    .jgrid
                                    .stripPref(c.p.idPrefix, a.id)
                            ], 37 === d.keyCode || 38 === d.keyCode || 39 === d.keyCode || 40 === d.keyCode) {
                                if (38 === d.keyCode) {
                                    g = a.previousSibling;
                                    j = "";
                                    if (g) 
                                        if (b(g).is(":hidden")) 
                                            for (; g;) {
                                                if (g = g.previousSibling, !b(g).is(":hidden") && b(g).hasClass("jqgrow")) {
                                                    j = g.id;
                                                    break
                                                }
                                            }
                                        else 
                                        j = g.id;
                                    b(c).jqGrid("setSelection", j, !0, d);
                                    d.preventDefault()
                                }
                                if (40 === d.keyCode) {
                                    g = a.nextSibling;
                                    j = "";
                                    if (g) 
                                        if (b(g).is(":hidden")) 
                                            for (; g;) {
                                                if (g = g.nextSibling, !b(g).is(":hidden") && b(g).hasClass("jqgrow")) {
                                                    j = g.id;
                                                    break
                                                }
                                            }
                                        else 
                                        j = g.id;
                                    b(c).jqGrid("setSelection", j, !0, d);
                                    d.preventDefault()
                                }
                                37 === d.keyCode && (c.p.treeGrid && c.p.data[h][i] && b(a).find("div.treeclick").trigger("click"),
                                b(c).triggerHandler("jqGridKeyLeft", [c.p.selrow]),
                                b.isFunction(f.onLeftKey) && f.onLeftKey.call(c, c.p.selrow));
                                39 === d.keyCode && (c.p.treeGrid && !c.p.data[h][i] && b(a).find("div.treeclick").trigger("click"),
                                b(c).triggerHandler("jqGridKeyRight", [c.p.selrow]),
                                b.isFunction(f.onRightKey) && f.onRightKey.call(c, c.p.selrow))
                            } else 
                                13 === d.keyCode
                                    ? (b(c).triggerHandler("jqGridKeyEnter", [c.p.selrow]), b.isFunction(f.onEnter) && f.onEnter.call(c, c.p.selrow))
                                    : 32 === d.keyCode && (b(c).triggerHandler("jqGridKeySpace", [c.p.selrow]), b.isFunction(f.onSpace) && f.onSpace.call(c, c.p.selrow))
                        })
                })
            },
            unbindKeys: function () {
                return this.each(function () {
                    b(this).unbind("keydown")
                })
            },
            getLocalRow: function (d) {
                var f = !1,
                    c;
                this.each(function () {
                    void 0 !== d && (c = this.p._index[
                        b
                            .jgrid
                            .stripPref(this.p.idPrefix, d)
                    ], 0 <= c && (f = this.p.data[c]))
                });
                return f
            }
        })
})(jQuery);
(function (a) {
    a.fmatter = {};
    a.extend(a.fmatter, {
        isBoolean: function (a) {
            return "boolean" === typeof a
        },
        isObject: function (c) {
            return c && ("object" === typeof c || a.isFunction(c)) || !1
        },
        isString: function (a) {
            return "string" === typeof a
        },
        isNumber: function (a) {
            return "number" === typeof a && isFinite(a)
        },
        isValue: function (a) {
            return this.isObject(a) || this.isString(a) || this.isNumber(a) || this.isBoolean(a)
        },
        isEmpty: function (c) {
            if (!this.isString(c) && this.isValue(c)) 
                return !1;
            if (!this.isValue(c)) 
                return !0;
            c = a
                .trim(c)
                .replace(/\&nbsp\;/ig, "")
                .replace(/\&#160\;/ig, "");
            return "" === c
        }
    });
    a.fn.fmatter = function (c, b, d, e, f) {
        var g = b,
            d = a.extend({}, a.jgrid.formatter, d);
        try {
            g = a
                .fn
                .fmatter[c]
                .call(this, b, d, e, f)
        } catch (h) {}
        return g
    };
    a.fmatter.util = {
        NumberFormat: function (c, b) {
            a
                .fmatter
                .isNumber(c) || (c *= 1);
            if (a.fmatter.isNumber(c)) {
                var d = 0 > c,
                    e = "" + c,
                    f = b.decimalSeparator || ".",
                    g;
                if (a.fmatter.isNumber(b.decimalPlaces)) {
                    var h = b.decimalPlaces,
                        e = Math.pow(10, h),
                        e = "" + Math.round(c * e) / e;
                    g = e.lastIndexOf(".");
                    if (0 < h) {
                        0 > g
                            ? (e += f, g = e.length - 1)
                            : "." !== f && (e = e.replace(".", f));
                        for (; e.length - 1 - g < h;) 
                            e += "0"
                    }
                }
                if (b.thousandsSeparator) {
                    h = b.thousandsSeparator;
                    g = e.lastIndexOf(f);
                    g = -1 < g
                        ? g
                        : e.length;
                    var f = e.substring(g),
                        j = -1,
                        i;
                    for (i = g; 0 < i; i--) {
                        j++;
                        if (0 === j % 3 && i !== g && (!d || 1 < i)) 
                            f = h + f;
                        f = e.charAt(i - 1) + f
                    }
                    e = f
                }
                e = b.prefix
                    ? b.prefix + e
                    : e;
                return e = b.suffix
                    ? e + b.suffix
                    : e
            }
            return c
        }
    };
    a.fn.fmatter.defaultFormat = function (c, b) {
        return a
            .fmatter
            .isValue(c) && "" !== c
            ? c
            : b.defaultValue || "&#160;"
    };
    a.fn.fmatter.email = function (c, b) {
        return !a
            .fmatter
            .isEmpty(c)
            ? '<a href="mailto:' + c + '">' + c + "</a>"
            : a
                .fn
                .fmatter
                .defaultFormat(c, b)
    };
    a.fn.fmatter.checkbox = function (c, b) {
        var d = a.extend({}, b.checkbox),
            e;
        void 0 !== b.colModel && void 0 !== b.colModel.formatoptions && (d = a.extend({}, d, b.colModel.formatoptions));
        e = !0 === d.disabled
            ? 'disabled="disabled"'
            : "";
        if (a.fmatter.isEmpty(c) || void 0 === c) 
            c = a.fn.fmatter.defaultFormat(c, d);
        c = ("" + c).toLowerCase();
        return '<input type="checkbox" ' + (0 > c.search(/(false|f|0|no|n|off|undefined)/i)
            ? " checked='checked' "
            : "") + ' value="' + c + '" offval="no" ' + e + "/>"
    };
    a.fn.fmatter.link = function (c, b) {
        var d = {
                target: b.target
            },
            e = "";
        void 0 !== b.colModel && void 0 !== b.colModel.formatoptions && (d = a.extend({}, d, b.colModel.formatoptions));
        d.target && (e = "target=" + d.target);
        return !a
            .fmatter
            .isEmpty(c)
            ? "<a " + e + ' href="' + c + '">' + c + "</a>"
            : a
                .fn
                .fmatter
                .defaultFormat(c, b)
    };
    a.fn.fmatter.showlink = function (c, b) {
        var d = {
                baseLinkUrl: b.baseLinkUrl,
                showAction: b.showAction,
                addParam: b.addParam || "",
                target: b.target,
                idName: b.idName
            },
            e = "";
        void 0 !== b.colModel && void 0 !== b.colModel.formatoptions && (d = a.extend({}, d, b.colModel.formatoptions));
        d.target && (e = "target=" + d.target);
        d = d.baseLinkUrl + d.showAction + "?" + d.idName + "=" + b.rowId + d.addParam;
        return a
            .fmatter
            .isString(c) || a
            .fmatter
            .isNumber(c)
            ? "<a " + e + ' href="' + d + '">' + c + "</a>"
            : a
                .fn
                .fmatter
                .defaultFormat(c, b)
    };
    a.fn.fmatter.integer = function (c, b) {
        var d = a.extend({}, b.integer);
        void 0 !== b.colModel && void 0 !== b.colModel.formatoptions && (d = a.extend({}, d, b.colModel.formatoptions));
        return a
            .fmatter
            .isEmpty(c)
            ? d.defaultValue
            : a
                .fmatter
                .util
                .NumberFormat(c, d)
    };
    a.fn.fmatter.number = function (c, b) {
        var d = a.extend({}, b.number);
        void 0 !== b.colModel && void 0 !== b.colModel.formatoptions && (d = a.extend({}, d, b.colModel.formatoptions));
        return a
            .fmatter
            .isEmpty(c)
            ? d.defaultValue
            : a
                .fmatter
                .util
                .NumberFormat(c, d)
    };
    a.fn.fmatter.currency = function (c, b) {
        var d = a.extend({}, b.currency);
        void 0 !== b.colModel && void 0 !== b.colModel.formatoptions && (d = a.extend({}, d, b.colModel.formatoptions));
        return a
            .fmatter
            .isEmpty(c)
            ? d.defaultValue
            : a
                .fmatter
                .util
                .NumberFormat(c, d)
    };
    a.fn.fmatter.date = function (c, b, d, e) {
        d = a.extend({}, b.date);
        void 0 !== b.colModel && void 0 !== b.colModel.formatoptions && (d = a.extend({}, d, b.colModel.formatoptions));
        return !d.reformatAfterEdit && "edit" === e
            ? a
                .fn
                .fmatter
                .defaultFormat(c, b)
            : !a
                .fmatter
                .isEmpty(c)
                ? a
                    .jgrid
                    .parseDate(d.srcformat, c, d.newformat, d)
                : a
                    .fn
                    .fmatter
                    .defaultFormat(c, b)
    };
    a.fn.fmatter.select = function (c, b) {
        var c = "" + c,
            d = !1,
            e = [],
            f,
            g;
        void 0 !== b.colModel.formatoptions
            ? (d = b.colModel.formatoptions.value, f = void 0 === b.colModel.formatoptions.separator
                ? ":"
                : b.colModel.formatoptions.separator, g = void 0 === b.colModel.formatoptions.delimiter
                ? ";"
                : b.colModel.formatoptions.delimiter)
            : void 0 !== b.colModel.editoptions && (d = b.colModel.editoptions.value, f = void 0 === b.colModel.editoptions.separator
                ? ":"
                : b.colModel.editoptions.separator, g = void 0 === b.colModel.editoptions.delimiter
                ? ";"
                : b.colModel.editoptions.delimiter);
        if (d) {
            var h = !0 === b.colModel.editoptions.multiple
                    ? !0
                    : !1,
                j = [];
            h && (j = c.split(","), j = a.map(j, function (b) {
                return a.trim(b)
            }));
            if (a.fmatter.isString(d)) {
                var i = d.split(g),
                    k = 0,
                    l;
                for (l = 0; l < i.length; l++) 
                    if (g = i[l].split(f), 2 < g.length && (g[1] = a.map(g, function (a, b) {
                        if (b > 0) 
                            return a
                    }).join(f)), h) 
                        -1 < a.inArray(g[0], j) && (e[k] = g[1], k++);
                    else if (a.trim(g[0]) === a.trim(c)) {
                        e[0] = g[1];
                        break
                    }
                } else 
                a
                    .fmatter
                    .isObject(d) && (h
                    ? e = a.map(j, function (a) {
                        return d[a]
                    })
                    : e[0] = d[c] || "")
            }
        c = e.join(", ");
        return "" === c
            ? a
                .fn
                .fmatter
                .defaultFormat(c, b)
            : c
    };
    a.fn.fmatter.rowactions = function (c) {
        var b = a(this).closest("tr.jqgrow"),
            d = b.attr("id"),
            e = a(this)
                .closest("table.ui-jqgrid-btable")
                .attr("id")
                .replace(/_frozen([^_]*)$/, "$1"),
            e = a("#" + e),
            f = e[0],
            g = f.p,
            h = g.colModel[
                a
                    .jgrid
                    .getCellIndex(this)
            ],
            j = h.frozen
                ? a("tr#" + d + " td:eq(" + a.jgrid.getCellIndex(this) + ") > div", e)
                : a(this).parent(),
            i = {
                keys: !1,
                onEdit: null,
                onSuccess: null,
                afterSave: null,
                onError: null,
                afterRestore: null,
                extraparam: {},
                url: null,
                restoreAfterError: !0,
                mtype: "POST",
                delOptions: {},
                editOptions: {}
            },
            k = function (b) {
                a.isFunction(i.afterRestore) && i
                    .afterRestore
                    .call(f, b);
                j
                    .find("div.ui-inline-edit,div.ui-inline-del")
                    .show();
                j
                    .find("div.ui-inline-save,div.ui-inline-cancel")
                    .hide()
            };
        void 0 !== h.formatoptions && (i = a.extend(i, h.formatoptions));
        void 0 !== g.editOptions && (i.editOptions = g.editOptions);
        void 0 !== g.delOptions && (i.delOptions = g.delOptions);
        b.hasClass("jqgrid-new-row") && (i.extraparam[g.prmNames.oper] = g.prmNames.addoper);
        b = {
            keys: i.keys,
            oneditfunc: i.onEdit,
            successfunc: i.onSuccess,
            url: i.url,
            extraparam: i.extraparam,
            aftersavefunc: function (b, c) {
                a.isFunction(i.afterSave) && i
                    .afterSave
                    .call(f, b, c);
                j
                    .find("div.ui-inline-edit,div.ui-inline-del")
                    .show();
                j
                    .find("div.ui-inline-save,div.ui-inline-cancel")
                    .hide()
            },
            errorfunc: i.onError,
            afterrestorefunc: k,
            restoreAfterError: i.restoreAfterError,
            mtype: i.mtype
        };
        switch (c) {
            case "edit":
                e.jqGrid("editRow", d, b);
                j
                    .find("div.ui-inline-edit,div.ui-inline-del")
                    .hide();
                j
                    .find("div.ui-inline-save,div.ui-inline-cancel")
                    .show();
                e.triggerHandler("jqGridAfterGridComplete");
                break;
            case "save":
                e.jqGrid("saveRow", d, b) && (j.find("div.ui-inline-edit,div.ui-inline-del").show(), j.find("div.ui-inline-save,div.ui-inline-cancel").hide(), e.triggerHandler("jqGridAfterGridComplete"));
                break;
            case "cancel":
                e.jqGrid("restoreRow", d, k);
                j
                    .find("div.ui-inline-edit,div.ui-inline-del")
                    .show();
                j
                    .find("div.ui-inline-save,div.ui-inline-cancel")
                    .hide();
                e.triggerHandler("jqGridAfterGridComplete");
                break;
            case "del":
                e.jqGrid("delGridRow", d, i.delOptions);
                break;
            case "formedit":
                e.jqGrid("setSelection", d),
                e.jqGrid("editGridRow", d, i.editOptions)
        }
    };
    a.fn.fmatter.actions = function (c, b) {
        var d = {
                keys: !1,
                editbutton: !0,
                delbutton: !0,
                editformbutton: !1
            },
            e = b.rowId,
            f = "";
        void 0 !== b.colModel.formatoptions && (d = a.extend(d, b.colModel.formatoptions));
        if (void 0 === e || a.fmatter.isEmpty(e)) 
            return "";
        d.editformbutton
            ? f += "<div title='" + a.jgrid.nav.edittitle + "' style='float:left;cursor:pointer;' class='ui-pg-div ui-inline-edit' " + ("id='jEditButton_" + e + "' onclick=jQuery.fn.fmatter.rowactions.call(this,'formedit'); onmouseover=jQuery" +
                    "(this).addClass('ui-state-hover'); onmouseout=jQuery(this).removeClass('ui-state" +
                    "-hover'); ") + "><span class='ui-icon ui-icon-pencil'></span></div>"
            : d.editbutton && (f += "<div title='" + a.jgrid.nav.edittitle + "' style='float:left;cursor:pointer;' class='ui-pg-div ui-inline-edit' " + ("id='jEditButton_" + e + "' onclick=jQuery.fn.fmatter.rowactions.call(this,'edit'); onmouseover=jQuery(thi" +
                    "s).addClass('ui-state-hover'); onmouseout=jQuery(this).removeClass('ui-state-hov" +
                    "er') ") + "><span class='ui-icon ui-icon-pencil'></span></div>");
        d.delbutton && (f += "<div title='" + a.jgrid.nav.deltitle + "' style='float:left;margin-left:5px;' class='ui-pg-div ui-inline-del' " + ("id='jDeleteButton_" + e + "' onclick=jQuery.fn.fmatter.rowactions.call(this,'del'); onmouseover=jQuery(this" +
                ").addClass('ui-state-hover'); onmouseout=jQuery(this).removeClass('ui-state-hove" +
                "r'); ") + "><span class='ui-icon ui-icon-trash'></span></div>");
        f += "<div title='" + a.jgrid.edit.bSubmit + "' style='float:left;display:none' class='ui-pg-div ui-inline-save' " + ("id='jSaveButton_" + e + "' onclick=jQuery.fn.fmatter.rowactions.call(this,'save'); onmouseover=jQuery(thi" +
                "s).addClass('ui-state-hover'); onmouseout=jQuery(this).removeClass('ui-state-hov" +
                "er'); ") + "><span class='ui-icon ui-icon-disk'></span></div>";
        f += "<div title='" + a.jgrid.edit.bCancel + "' style='float:left;display:none;margin-left:5px;' class='ui-pg-div ui-inline-ca" +
                "ncel' " + ("id='jCancelButton_" + e + "' onclick=jQuery.fn.fmatter.rowactions.call(this,'cancel'); onmouseover=jQuery(t" +
                "his).addClass('ui-state-hover'); onmouseout=jQuery(this).removeClass('ui-state-h" +
                "over'); ") + "><span class='ui-icon ui-icon-cancel'></span></div>";
        return "<div style='margin-left:8px;'>" + f + "</div>"
    };
    a.unformat = function (c, b, d, e) {
        var f,
            g = b.colModel.formatter,
            h = b.colModel.formatoptions || {},
            j = /([\.\*\_\'\(\)\{\}\+\?\\])/g,
            i = b.colModel.unformat || a.fn.fmatter[g] && a.fn.fmatter[g].unformat;
        if (void 0 !== i && a.isFunction(i)) 
            f = i.call(this, a(c).text(), b, c);
        else if (void 0 !== g && a.fmatter.isString(g)) 
            switch (f = a.jgrid.formatter || {}, g) {
                case "integer":
                    h = a.extend({}, f.integer, h);
                    b = h
                        .thousandsSeparator
                        .replace(j, "\\$1");
                    f = a(c)
                        .text()
                        .replace(RegExp(b, "g"), "");
                    break;
                case "number":
                    h = a.extend({}, f.number, h);
                    b = h
                        .thousandsSeparator
                        .replace(j, "\\$1");
                    f = a(c)
                        .text()
                        .replace(RegExp(b, "g"), "")
                        .replace(h.decimalSeparator, ".");
                    break;
                case "currency":
                    h = a.extend({}, f.currency, h);
                    b = h
                        .thousandsSeparator
                        .replace(j, "\\$1");
                    b = RegExp(b, "g");
                    f = a(c).text();
                    h.prefix && h.prefix.length && (f = f.substr(h.prefix.length));
                    h.suffix && h.suffix.length && (f = f.substr(0, f.length - h.suffix.length));
                    f = f
                        .replace(b, "")
                        .replace(h.decimalSeparator, ".");
                    break;
                case "checkbox":
                    h = b.colModel.editoptions
                        ? b
                            .colModel
                            .editoptions
                            .value
                            .split(":")
                        : ["Yes", "No"];
                    f = a("input", c).is(":checked")
                        ? h[0]
                        : h[1];
                    break;
                case "select":
                    f = a
                        .unformat
                        .select(c, b, d, e);
                    break;
                case "actions":
                    return "";
                default:
                    f = a(c).text()
            }
        return void 0 !== f
            ? f
            : !0 === e
                ? a(c).text()
                : a
                    .jgrid
                    .htmlDecode(a(c).html())
    };
    a.unformat.select = function (c, b, d, e) {
        d = [];
        c = a(c).text();
        if (!0 === e) 
            return c;
        var e = a.extend({}, void 0 !== b.colModel.formatoptions
                ? b.colModel.formatoptions
                : b.colModel.editoptions),
            b = void 0 === e.separator
                ? ":"
                : e.separator,
            f = void 0 === e.delimiter
                ? ";"
                : e.delimiter;
        if (e.value) {
            var g = e.value,
                e = !0 === e.multiple
                    ? !0
                    : !1,
                h = [];
            e && (h = c.split(","), h = a.map(h, function (b) {
                return a.trim(b)
            }));
            if (a.fmatter.isString(g)) {
                var j = g.split(f),
                    i = 0,
                    k;
                for (k = 0; k < j.length; k++) 
                    if (f = j[k].split(b), 2 < f.length && (f[1] = a.map(f, function (a, b) {
                        if (b > 0) 
                            return a
                    }).join(b)), e) 
                        -1 < a.inArray(f[1], h) && (d[i] = f[0], i++);
                    else if (a.trim(f[1]) === a.trim(c)) {
                        d[0] = f[0];
                        break
                    }
                } else if (a.fmatter.isObject(g) || a.isArray(g)) 
                e || (h[0] = c),
                d = a.map(h, function (b) {
                    var c;
                    a.each(g, function (a, d) {
                        if (d === b) {
                            c = a;
                            return false
                        }
                    });
                    if (c !== void 0) 
                        return c
                });
            return d.join(", ")
        }
        return c || ""
    };
    a.unformat.date = function (c, b) {
        var d = a.jgrid.formatter.date || {};
        void 0 !== b.formatoptions && (d = a.extend({}, d, b.formatoptions));
        return !a
            .fmatter
            .isEmpty(c)
            ? a
                .jgrid
                .parseDate(d.newformat, c, d.srcformat, d)
            : a
                .fn
                .fmatter
                .defaultFormat(c, b)
    }
})(jQuery);
(function (a) {
    a
        .jgrid
        .extend({
            getColProp: function (a) {
                var c = {},
                    f = this[0];
                if (!f.grid) 
                    return !1;
                var f = f.p.colModel,
                    g;
                for (g = 0; g < f.length; g++) 
                    if (f[g].name === a) {
                        c = f[g];
                        break
                    }
                return c
            },
            setColProp: function (b, c) {
                return this.each(function () {
                    if (this.grid && c) {
                        var f = this.p.colModel,
                            g;
                        for (g = 0; g < f.length; g++) 
                            if (f[g].name === b) {
                                a.extend(!0, this.p.colModel[g], c);
                                break
                            }
                        }
                })
            },
            sortGrid: function (a, c, f) {
                return this.each(function () {
                    var g = -1,
                        j;
                    if (this.grid) {
                        a || (a = this.p.sortname);
                        for (j = 0; j < this.p.colModel.length; j++) 
                            if (this.p.colModel[j].index === a || this.p.colModel[j].name === a) {
                                g = j;
                                break
                            }
                        - 1 !== g && (j = this.p.colModel[g].sortable, "boolean" !== typeof j && (j = !0), "boolean" !== typeof c && (c = !1), j && this.sortData("jqgh_" + this.p.id + "_" + a, g, c, f))
                    }
                })
            },
            clearBeforeUnload: function () {
                return this.each(function () {
                    var b = this.grid;
                    b
                        .emptyRows
                        .call(this, !0, !0);
                    a(b.hDiv).unbind("mousemove");
                    a(this).unbind();
                    b.dragEnd = null;
                    b.dragMove = null;
                    b.dragStart = null;
                    b.emptyRows = null;
                    b.populate = null;
                    b.populateVisible = null;
                    b.scrollGrid = null;
                    b.selectionPreserver = null;
                    b.bDiv = null;
                    b.cDiv = null;
                    b.hDiv = null;
                    b.cols = null;
                    var c,
                        f = b.headers.length;
                    for (c = 0; c < f; c++) 
                        b.headers[c].el = null;
                    this.addJSONData = this.addXmlData = this.formatter = this.constructTr = this.setHeadCheckBox = this.refreshIndex = this.updatepager = this.sortData = this.formatCol = null
                })
            },
            GridDestroy: function () {
                return this.each(function () {
                    if (this.grid) {
                        this.p.pager && a(this.p.pager).remove();
                        try {
                            a(this).jqGrid("clearBeforeUnload"),
                            a("#gbox_" + a.jgrid.jqID(this.id)).remove()
                        } catch (b) {}
                    }
                })
            },
            GridUnload: function () {
                return this.each(function () {
                    if (this.grid) {
                        var b = a(this).attr("id"),
                            c = a(this).attr("class");
                        this.p.pager && a(this.p.pager)
                            .empty()
                            .removeClass("ui-state-default ui-jqgrid-pager corner-bottom");
                        var f = document.createElement("table");
                        a(f).attr({id: b});
                        f.className = c;
                        b = a
                            .jgrid
                            .jqID(this.id);
                        a(f).removeClass("ui-jqgrid-btable");
                        1 === a(this.p.pager)
                            .parents("#gbox_" + b)
                            .length
                            ? (a(f).insertBefore("#gbox_" + b).show(), a(this.p.pager).insertBefore("#gbox_" + b))
                            : a(f)
                                .insertBefore("#gbox_" + b)
                                .show();
                        a(this).jqGrid("clearBeforeUnload");
                        a("#gbox_" + b).remove()
                    }
                })
            },
            setGridState: function (b) {
                return this.each(function () {
                    this.grid && ("hidden" === b
                        ? (a(".ui-jqgrid-bdiv, .ui-jqgrid-hdiv", "#gview_" + a.jgrid.jqID(this.p.id)).slideUp("fast"), this.p.pager && a(this.p.pager).slideUp("fast"), this.p.toppager && a(this.p.toppager).slideUp("fast"), !0 === this.p.toolbar[0] && ("both" === this.p.toolbar[1] && a(this.grid.ubDiv).slideUp("fast"), a(this.grid.uDiv).slideUp("fast")), this.p.footerrow && a(".ui-jqgrid-sdiv", "#gbox_" + a.jgrid.jqID(this.p.id)).slideUp("fast"), a(".ui-jqgrid-titlebar-close span", this.grid.cDiv).removeClass("ui-icon-circle-triangle-n").addClass("ui-icon-circle-triangle-s"), this.p.gridstate = "hidden")
                        : "visible" === b && (a(".ui-jqgrid-hdiv, .ui-jqgrid-bdiv", "#gview_" + a.jgrid.jqID(this.p.id)).slideDown("fast"), this.p.pager && a(this.p.pager).slideDown("fast"), this.p.toppager && a(this.p.toppager).slideDown("fast"), !0 === this.p.toolbar[0] && ("both" === this.p.toolbar[1] && a(this.grid.ubDiv).slideDown("fast"), a(this.grid.uDiv).slideDown("fast")), this.p.footerrow && a(".ui-jqgrid-sdiv", "#gbox_" + a.jgrid.jqID(this.p.id)).slideDown("fast"), a(".ui-jqgrid-titlebar-close span", this.grid.cDiv).removeClass("ui-icon-circle-triangle-s").addClass("ui-icon-circle-triangle-n"), this.p.gridstate = "visible"))
                })
            },
            filterToolbar: function (b) {
                b = a.extend({
                    autosearch: !0,
                    searchOnEnter: !0,
                    beforeSearch: null,
                    afterSearch: null,
                    beforeClear: null,
                    afterClear: null,
                    searchurl: "",
                    stringResult: !1,
                    groupOp: "AND",
                    defaultSearch: "bw",
                    searchOperators: !1,
                    operandTitle: "Click to select search operation.",
                    operands: {
                        eq: "==",
                        ne: "!",
                        lt: "<",
                        le: "<=",
                        gt: ">",
                        ge: ">=",
                        bw: "^",
                        bn: "!^",
                        "in": "=",
                        ni: "!=",
                        ew: "|",
                        en: "!@",
                        cn: "~",
                        nc: "!~",
                        nu: "#",
                        nn: "!#"
                    }
                }, a.jgrid.search, b || {});
                return this.each(function () {
                    var c = this;
                    if (!this.ftoolbar) {
                        var f = function () {
                                var e = {},
                                    d = 0,
                                    f,
                                    l,
                                    j = {},
                                    n;
                                a.each(c.p.colModel, function () {
                                    var i = a("#gs_" + a.jgrid.jqID(this.name), !0 === this.frozen && !0 === c.p.frozenColumns
                                        ? c.grid.fhDiv
                                        : c.grid.hDiv);
                                    l = this.index || this.name;
                                    n = b.searchOperators
                                        ? i
                                            .parent()
                                            .prev()
                                            .children("a")
                                            .attr("soper") || b.defaultSearch
                                        : this.searchoptions && this.searchoptions.sopt
                                            ? this.searchoptions.sopt[0]
                                            : "select" === this.stype
                                                ? "eq"
                                                : b.defaultSearch;
                                    if ((f = "custom" === this.stype && a.isFunction(this.searchoptions.custom_value) && 0 < i.length && "SPAN" === i[0].nodeName.toUpperCase()
                                        ? this.searchoptions.custom_value.call(c, i.children(".customelement:first"), "get")
                                        : i.val()) || "nu" === n || "nn" === n) 
                                        e[l] = f,
                                        j[l] = n,
                                        d++;
                                    else 
                                        try {
                                            delete c.p.postData[l]
                                        } catch (k) {}
                                    });
                                var i = 0 < d
                                    ? !0
                                    : !1;
                                if (!0 === b.stringResult || "local" === c.p.datatype) {
                                    var k = '{"groupOp":"' + b.groupOp + '","rules":[',
                                        h = 0;
                                    a.each(e, function (a, b) {
                                        0 < h && (k += ",");
                                        k += '{"field":"' + a + '",';
                                        k += '"op":"' + j[a] + '",';
                                        k += '"data":"' + (b + "")
                                            .replace(/\\/g, "\\\\")
                                            .replace(/\"/g, '\\"') + '"}';
                                        h++
                                    });
                                    k += "]}";
                                    a.extend(c.p.postData, {filters: k});
                                    a.each([
                                        "searchField", "searchString", "searchOper"
                                    ], function (a, b) {
                                        c
                                            .p
                                            .postData
                                            .hasOwnProperty(b) && delete c.p.postData[b]
                                    })
                                } else 
                                    a.extend(c.p.postData, e);
                                var g;
                                c.p.searchurl && (g = c.p.url, a(c).jqGrid("setGridParam", {url: c.p.searchurl}));
                                var o = "stop" === a(c).triggerHandler("jqGridToolbarBeforeSearch")
                                    ? !0
                                    : !1;
                                !o && a.isFunction(b.beforeSearch) && (o = b.beforeSearch.call(c));
                                o || a(c)
                                    .jqGrid("setGridParam", {search: i})
                                    .trigger("reloadGrid", [
                                        {
                                            page: 1
                                        }
                                    ]);
                                g && a(c).jqGrid("setGridParam", {url: g});
                                a(c).triggerHandler("jqGridToolbarAfterSearch");
                                a.isFunction(b.afterSearch) && b
                                    .afterSearch
                                    .call(c)
                            },
                            g = function (e, d, j) {
                                a("#sopt_menu").remove();
                                var d = parseInt(d, 10),
                                    j = parseInt(j, 10) + 18,
                                    d = '<ul id="sopt_menu" class="ui-search-menu" role="menu" tabindex="0" style="font-s' +
                                            'ize:' + (a(".ui-jqgrid-view").css("font-size") || "11px") + ";left:" + d + "px;top:" + j + 'px;">',
                                    j = a(e).attr("soper"),
                                    l,
                                    h = [],
                                    n,
                                    i = 0,
                                    k = a(e).attr("colname");
                                for (l = c.p.colModel.length; i < l && c.p.colModel[i].name !== k;) 
                                    i++;
                                i = c.p.colModel[i];
                                k = a.extend({}, i.searchoptions);
                                k.sopt || (k.sopt = [], k.sopt[0] = "select" === i.stype
                                    ? "eq"
                                    : b.defaultSearch);
                                a.each(b.odata, function () {
                                    h.push(this.oper)
                                });
                                for (i = 0; i < k.sopt.length; i++) 
                                    n = a.inArray(k.sopt[i], h),
                                    -1 !== n && (l = j === b.odata[n].oper
                                        ? "ui-state-highlight"
                                        : "", d += '<li class="ui-menu-item ' + l + '" role="presentation"><a class="ui-corner-all g-menu-item" tabindex="0" role="me' +
                                            'nuitem" value="' + b.odata[n].oper + '" oper="' + b.operands[b.odata[n].oper] + '"><table cellspacing="0" cellpadding="0" border="0"><tr><td width="25px">' + b.operands[b.odata[n].oper] + "</td><td>" + b.odata[n].text + "</td></tr></table></a></li>");
                                a("body").append(d + "</ul>");
                                a("#sopt_menu").addClass("ui-menu ui-widget ui-widget-content ui-corner-all");
                                a("#sopt_menu > li > a").hover(function () {
                                    a(this).addClass("ui-state-hover")
                                }, function () {
                                    a(this).removeClass("ui-state-hover")
                                })
                                    .click(function () {
                                        var d = a(this).attr("value"),
                                            i = a(this).attr("oper");
                                        a(c).triggerHandler("jqGridToolbarSelectOper", [d, i, e]);
                                        a("#sopt_menu").hide();
                                        a(e)
                                            .text(i)
                                            .attr("soper", d);
                                        if (b.autosearch === true) {
                                            i = a(e)
                                                .parent()
                                                .next()
                                                .children()[0];
                                            (a(i).val() || d === "nu" || d === "nn") && f()
                                        }
                                    })
                            },
                            j = a("<tr class='ui-search-toolbar' role='rowheader'></tr>"),
                            h;
                        a.each(c.p.colModel, function () {
                            var e = this,
                                d,
                                g;
                            g = "";
                            var l = "=",
                                s,
                                n = a("<th role='columnheader' class='ui-state-default ui-th-column ui-th-" + c.p.direction + "'></th>"),
                                i = a("<div style='position:relative;height:100%;padding-right:0.3em;padding-left:0.3em" +
                                        ";'></div>"),
                                k = a("<table class='ui-search-table' cellspacing='0'><tr><td class='ui-search-oper'></" +
                                        "td><td class='ui-search-input'></td></tr></table>");
                            !0 === this.hidden && a(n).css("display", "none");
                            this.search = !1 === this.search
                                ? !1
                                : !0;
                            void 0 === this.stype && (this.stype = "text");
                            d = a.extend({}, this.searchoptions || {});
                            if (this.search) {
                                if (b.searchOperators) {
                                    g = d.sopt
                                        ? d.sopt[0]
                                        : "select" === e.stype
                                            ? "eq"
                                            : b.defaultSearch;
                                    for (s = 0; s < b.odata.length; s++) 
                                        if (b.odata[s].oper === g) {
                                            l = b.operands[g] || "";
                                            break
                                        }
                                    g = "<a title='" + (null != d.searchtitle
                                        ? d.searchtitle
                                        : b.operandTitle) + "' style='padding-right: 0.5em;' soper='" + g + "' class='soptclass' colname='" + this.name + "'>" + l + "</a>"
                                }
                                a("td:eq(0)", k).append(g);
                                switch (this.stype) {
                                    case "select":
                                        if (g = this.surl || d.dataUrl) 
                                            a.ajax(a.extend({
                                                url: g,
                                                dataType: "html",
                                                success: function (g) {
                                                    if (d.buildSelect !== void 0) {
                                                        if (g = d.buildSelect(g)) {
                                                            a("td:eq(1)", k).append(g);
                                                            a(i).append(k)
                                                        }
                                                    } else {
                                                        a("td:eq(1)", k).append(g);
                                                        a(i).append(k)
                                                    }
                                                    d.defaultValue !== void 0 && a("select", i).val(d.defaultValue);
                                                    a("select", i).attr({
                                                        name: e.index || e.name,
                                                        id: "gs_" + e.name
                                                    });
                                                    d.attr && a("select", i).attr(d.attr);
                                                    a("select", i).css({width: "100%"});
                                                    a
                                                        .jgrid
                                                        .bindEv
                                                        .call(c, a("select", i)[0], d);
                                                    b.autosearch === true && a("select", i).change(function () {
                                                        f();
                                                        return false
                                                    });
                                                    g = null
                                                }
                                            }, a.jgrid.ajaxOptions, c.p.ajaxSelectOptions || {}));
                                        else {
                                            var m,
                                                r,
                                                o;
                                            e.searchoptions
                                                ? (m = void 0 === e.searchoptions.value
                                                    ? ""
                                                    : e.searchoptions.value, r = void 0 === e.searchoptions.separator
                                                    ? ":"
                                                    : e.searchoptions.separator, o = void 0 === e.searchoptions.delimiter
                                                    ? ";"
                                                    : e.searchoptions.delimiter)
                                                : e.editoptions && (m = void 0 === e.editoptions.value
                                                    ? ""
                                                    : e.editoptions.value, r = void 0 === e.editoptions.separator
                                                    ? ":"
                                                    : e.editoptions.separator, o = void 0 === e.editoptions.delimiter
                                                    ? ";"
                                                    : e.editoptions.delimiter);
                                            if (m) {
                                                l = document.createElement("select");
                                                l.style.width = "100%";
                                                a(l).attr({
                                                    name: e.index || e.name,
                                                    id: "gs_" + e.name
                                                });
                                                var q;
                                                if ("string" === typeof m) {
                                                    g = m.split(o);
                                                    for (q = 0; q < g.length; q++) 
                                                        m = g[q].split(r),
                                                        o = document.createElement("option"),
                                                        o.value = m[0],
                                                        o.innerHTML = m[1],
                                                        l.appendChild(o)
                                                } else if ("object" === typeof m) 
                                                    for (q in m) 
                                                        m.hasOwnProperty(q) && (o = document.createElement("option"), o.value = q, o.innerHTML = m[q], l.appendChild(o));
                                            void 0 !== d.defaultValue && a(l).val(d.defaultValue);
                                                d.attr && a(l).attr(d.attr);
                                                a
                                                    .jgrid
                                                    .bindEv
                                                    .call(c, l, d);
                                                a("td:eq(1)", k).append(l);
                                                a(i).append(k);
                                                !0 === b.autosearch && a(l).change(function () {
                                                    f();
                                                    return false
                                                })
                                            }
                                        }
                                        break;
                                    case "text":
                                        r = void 0 !== d.defaultValue
                                            ? d.defaultValue
                                            : "";
                                        a("td:eq(1)", k).append("<input type='text' style='width:100%;padding:0px;' name='" + (e.index || e.name) + "' id='gs_" + e.name + "' value='" + r + "'/>");
                                        a(i).append(k);
                                        d.attr && a("input", i).attr(d.attr);
                                        a
                                            .jgrid
                                            .bindEv
                                            .call(c, a("input", i)[0], d);
                                        !0 === b.autosearch && (b.searchOnEnter
                                            ? a("input", i).keypress(function (a) {
                                                if ((a.charCode || a.keyCode || 0) === 13) {
                                                    f();
                                                    return false
                                                }
                                                return this
                                            })
                                            : a("input", i).keydown(function (a) {
                                                switch (a.which) {
                                                    case 13:
                                                        return false;
                                                    case 9:
                                                    case 16:
                                                    case 37:
                                                    case 38:
                                                    case 39:
                                                    case 40:
                                                    case 27:
                                                        break;
                                                    default:
                                                        h && clearTimeout(h);
                                                        h = setTimeout(function () {
                                                            f()
                                                        }, 500)
                                                }
                                            }));
                                        break;
                                    case "custom":
                                        a("td:eq(1)", k).append("<span style='width:95%;padding:0px;' name='" + (e.index || e.name) + "' id='gs_" + e.name + "'/>");
                                        a(i).append(k);
                                        try {
                                            if (a.isFunction(d.custom_element)) {
                                                var u = d
                                                    .custom_element
                                                    .call(c, void 0 !== d.defaultValue
                                                        ? d.defaultValue
                                                        : "", d);
                                                if (u) 
                                                    u = a(u).addClass("customelement"),
                                                    a(i).find(">span").append(u);
                                                else 
                                                    throw "e2";
                                                }
                                            else 
                                                throw "e1";
                                            }
                                        catch (t) {
                                            "e1" === t && a
                                                .jgrid
                                                .info_dialog(a.jgrid.errors.errcap, "function 'custom_element' " + a.jgrid.edit.msg.nodefined, a.jgrid.edit.bClose),
                                            "e2" === t
                                                ? a
                                                    .jgrid
                                                    .info_dialog(a.jgrid.errors.errcap, "function 'custom_element' " + a.jgrid.edit.msg.novalue, a.jgrid.edit.bClose)
                                                : a
                                                    .jgrid
                                                    .info_dialog(a.jgrid.errors.errcap, "string" === typeof t
                                                        ? t
                                                        : t.message, a.jgrid.edit.bClose)
                                        }
                                }
                            }
                            a(n).append(i);
                            a(j).append(n);
                            b.searchOperators || a("td:eq(0)", k).hide()
                        });
                        a("table thead", c.grid.hDiv).append(j);
                        b.searchOperators && (a(".soptclass").click(function (b) {
                            var c = a(this).offset();
                            g(this, c.left, c.top);
                            b.stopPropagation()
                        }), a("body").on("click", function (b) {
                            "soptclass" !== b.target.className && a("#sopt_menu").hide()
                        }));
                        this.ftoolbar = !0;
                        this.triggerToolbar = f;
                        this.clearToolbar = function (e) {
                            var d = {},
                                f = 0,
                                g,
                                e = typeof e !== "boolean"
                                    ? true
                                    : e;
                            a.each(c.p.colModel, function () {
                                var b,
                                    e = a("#gs_" + a.jgrid.jqID(this.name), this.frozen === true && c.p.frozenColumns === true
                                        ? c.grid.fhDiv
                                        : c.grid.hDiv);
                                if (this.searchoptions && this.searchoptions.defaultValue !== void 0) 
                                    b = this.searchoptions.defaultValue;
                                g = this.index || this.name;
                                switch (this.stype) {
                                    case "select":
                                        e
                                            .find("option")
                                            .each(function (c) {
                                                if (c === 0) 
                                                    this.selected = true;
                                                if (a(this).val() === b) {
                                                    this.selected = true;
                                                    return false
                                                }
                                            });
                                        if (b !== void 0) {
                                            d[g] = b;
                                            f++
                                        } else 
                                            try {
                                                delete c.p.postData[g]
                                            } catch (i) {}
                                        break;
                                    case "text":
                                        e.val(b);
                                        if (b !== void 0) {
                                            d[g] = b;
                                            f++
                                        } else 
                                            try {
                                                delete c.p.postData[g]
                                            } catch (h) {}
                                        break;
                                    case "custom":
                                        a.isFunction(this.searchoptions.custom_value) && e.length > 0 && e[0]
                                            .nodeName
                                            .toUpperCase() === "SPAN" && this
                                            .searchoptions
                                            .custom_value
                                            .call(c, e.children(".customelement:first"), "set", b)
                                }
                            });
                            var j = f > 0
                                ? true
                                : false;
                            if (b.stringResult === true || c.p.datatype === "local") {
                                var h = '{"groupOp":"' + b.groupOp + '","rules":[',
                                    i = 0;
                                a.each(d, function (a, b) {
                                    i > 0 && (h = h + ",");
                                    h = h + ('{"field":"' + a + '",');
                                    h = h + '"op":"eq",';
                                    h = h + ('"data":"' + (b + "").replace(/\\/g, "\\\\").replace(/\"/g, '\\"') + '"}');
                                    i++
                                });
                                h = h + "]}";
                                a.extend(c.p.postData, {filters: h});
                                a.each([
                                    "searchField", "searchString", "searchOper"
                                ], function (a, b) {
                                    c
                                        .p
                                        .postData
                                        .hasOwnProperty(b) && delete c.p.postData[b]
                                })
                            } else 
                                a.extend(c.p.postData, d);
                            var k;
                            if (c.p.searchurl) {
                                k = c.p.url;
                                a(c).jqGrid("setGridParam", {url: c.p.searchurl})
                            }
                            var m = a(c).triggerHandler("jqGridToolbarBeforeClear") === "stop"
                                ? true
                                : false;
                            !m && a.isFunction(b.beforeClear) && (m = b.beforeClear.call(c));
                            m || e && a(c)
                                .jqGrid("setGridParam", {search: j})
                                .trigger("reloadGrid", [
                                    {
                                        page: 1
                                    }
                                ]);
                            k && a(c).jqGrid("setGridParam", {url: k});
                            a(c).triggerHandler("jqGridToolbarAfterClear");
                            a.isFunction(b.afterClear) && b.afterClear()
                        };
                        this.toggleToolbar = function () {
                            var b = a("tr.ui-search-toolbar", c.grid.hDiv),
                                d = c.p.frozenColumns === true
                                    ? a("tr.ui-search-toolbar", c.grid.fhDiv)
                                    : false;
                            if (b.css("display") === "none") {
                                b.show();
                                d && d.show()
                            } else {
                                b.hide();
                                d && d.hide()
                            }
                        }
                    }
                })
            },
            destroyFilterToolbar: function () {
                return this.each(function () {
                    this.ftoolbar && (this.toggleToolbar = this.clearToolbar = this.triggerToolbar = null, this.ftoolbar = !1, a(this.grid.hDiv).find("table thead tr.ui-search-toolbar").remove())
                })
            },
            destroyGroupHeader: function (b) {
                void 0 === b && (b = !0);
                return this.each(function () {
                    var c,
                        f,
                        g,
                        j,
                        h,
                        e;
                    f = this.grid;
                    var d = a("table.ui-jqgrid-htable thead", f.hDiv),
                        p = this.p.colModel;
                    if (f) {
                        a(this).unbind(".setGroupHeaders");
                        c = a("<tr>", {role: "rowheader"}).addClass("ui-jqgrid-labels");
                        j = f.headers;
                        f = 0;
                        for (g = j.length; f < g; f++) {
                            h = p[f].hidden
                                ? "none"
                                : "";
                            h = a(j[f].el)
                                .width(j[f].width)
                                .css("display", h);
                            try {
                                h.removeAttr("rowSpan")
                            } catch (l) {
                                h.attr("rowSpan", 1)
                            }
                            c.append(h);
                            e = h.children("span.ui-jqgrid-resize");
                            0 < e.length && (e[0].style.height = "");
                            h.children("div")[0].style.top = ""
                        }
                        a(d)
                            .children("tr.ui-jqgrid-labels")
                            .remove();
                        a(d).prepend(c);
                        !0 === b && a(this).jqGrid("setGridParam", {groupHeader: null})
                    }
                })
            },
            setGroupHeaders: function (b) {
                b = a.extend({
                    useColSpanStyle: !1,
                    groupHeaders: []
                }, b || {});
                return this.each(function () {
                    this.p.groupHeader = b;
                    var c,
                        f,
                        g = 0,
                        j,
                        h,
                        e,
                        d,
                        p,
                        l = this.p.colModel,
                        s = l.length,
                        n = this.grid.headers,
                        i = a("table.ui-jqgrid-htable", this.grid.hDiv),
                        k = i
                            .children("thead")
                            .children("tr.ui-jqgrid-labels:last")
                            .addClass("jqg-second-row-header");
                    j = i.children("thead");
                    var m = i.find(".jqg-first-row-header");
                    void 0 === m[0]
                        ? m = a("<tr>", {
                                role: "row",
                                "aria-hidden": "true"
                            })
                            .addClass("jqg-first-row-header")
                            .css("height", "auto")
                        : m.empty();
                    var r,
                        o = function (a, b) {
                            var c = b.length,
                                d;
                            for (d = 0; d < c; d++) 
                                if (b[d].startColumnName === a) 
                                    return d;
                        return -1
                        };
                    a(this).prepend(j);
                    j = a("<tr>", {role: "rowheader"}).addClass("ui-jqgrid-labels jqg-third-row-header");
                    for (c = 0; c < s; c++) 
                        if (e = n[c].el, d = a(e), f = l[c], h = {
                            height: "0px",
                            width: n[c].width + "px",
                            display: f.hidden
                                ? "none"
                                : ""
                        }, a("<th>", {role: "gridcell"}).css(h).addClass("ui-first-th-" + this.p.direction).appendTo(m), e.style.width = "", h = o(f.name, b.groupHeaders), 0 <= h) {
                            h = b.groupHeaders[h];
                            g = h.numberOfColumns;
                            p = h.titleText;
                            for (h = f = 0; h < g && c + h < s; h++) 
                                l[c + h].hidden || f++;
                            h = a("<th>")
                                .attr({role: "columnheader"})
                                .addClass("ui-state-default ui-th-column-header ui-th-" + this.p.direction)
                                .css({height: "22px", "border-top": "0px none"})
                                .html(p);
                            0 < f && h.attr("colspan", "" + f);
                            this.p.headertitles && h.attr("title", h.text());
                            0 === f && h.hide();
                            d.before(h);
                            j.append(e);
                            g -= 1
                        }
                    else 
                        0 === g
                            ? b.useColSpanStyle
                                ? d.attr("rowspan", "2")
                                : (a("<th>", {role: "columnheader"}).addClass("ui-state-default ui-th-column-header ui-th-" + this.p.direction).css({
                                    display: f.hidden
                                        ? "none"
                                        : "",
                                    "border-top": "0px none"
                                }).insertBefore(d), j.append(e))
                            : (j.append(e), g--);
                    l = a(this).children("thead");
                    l.prepend(m);
                    j.insertAfter(k);
                    i.append(l);
                    b.useColSpanStyle && (i.find("span.ui-jqgrid-resize").each(function () {
                        var b = a(this).parent();
                        b.is(":visible") && (this.style.cssText = "height: " + b.height() + "px !important; cursor: col-resize;")
                    }), i.find("div.ui-jqgrid-sortable").each(function () {
                        var b = a(this),
                            c = b.parent();
                        c.is(":visible") && c.is(":has(span.ui-jqgrid-resize)") && b.css("top", (c.height() - b.outerHeight()) / 2 + "px")
                    }));
                    r = l.find("tr.jqg-first-row-header");
                    a(this).bind("jqGridResizeStop.setGroupHeaders", function (a, b, c) {
                        r
                            .find("th")
                            .eq(c)
                            .width(b)
                    })
                })
            },
            setFrozenColumns: function () {
                return this.each(function () {
                    if (this.grid) {
                        var b = this,
                            c = b.p.colModel,
                            f = 0,
                            g = c.length,
                            j = -1,
                            h = !1;
                        if (!(!0 === b.p.subGrid || !0 === b.p.treeGrid || !0 === b.p.cellEdit || b.p.sortable || b.p.scroll || b.p.grouping)) {
                            b.p.rownumbers && f++;
                            for (b.p.multiselect && f++; f < g;) {
                                if (!0 === c[f].frozen) 
                                    h = !0,
                                    j = f;
                                else 
                                    break;
                                f++
                            }
                            if (0 <= j && h) {
                                c = b.p.caption
                                    ? a(b.grid.cDiv).outerHeight()
                                    : 0;
                                f = a(".ui-jqgrid-htable", "#gview_" + a.jgrid.jqID(b.p.id)).height();
                                b.p.toppager && (c += a(b.grid.topDiv).outerHeight());
                                !0 === b.p.toolbar[0] && "bottom" !== b.p.toolbar[1] && (c += a(b.grid.uDiv).outerHeight());
                                b.grid.fhDiv = a('<div style="position:absolute;left:0px;top:' + c + "px;height:" + f + 'px;" class="frozen-div ui-state-default ui-jqgrid-hdiv"></div>');
                                b.grid.fbDiv = a('<div style="position:absolute;left:0px;top:' + (parseInt(c, 10) + parseInt(f, 10) + 1) + 'px;overflow-y:hidden" class="frozen-bdiv ui-jqgrid-bdiv"></div>');
                                a("#gview_" + a.jgrid.jqID(b.p.id)).append(b.grid.fhDiv);
                                c = a(".ui-jqgrid-htable", "#gview_" + a.jgrid.jqID(b.p.id)).clone(!0);
                                if (b.p.groupHeader) {
                                    a("tr.jqg-first-row-header, tr.jqg-third-row-header", c)
                                        .each(function () {
                                            a("th:gt(" + j + ")", this).remove()
                                        });
                                    var e = -1,
                                        d = -1,
                                        p,
                                        l;
                                    a("tr.jqg-second-row-header th", c).each(function () {
                                        p = parseInt(a(this).attr("colspan"), 10);
                                        if (l = parseInt(a(this).attr("rowspan"), 10)) 
                                            e++,
                                            d++;
                                        p && (e += p, d++);
                                        if (e === j) 
                                            return !1
                                    });
                                    e !== j && (d = j);
                                    a("tr.jqg-second-row-header", c).each(function () {
                                        a("th:gt(" + d + ")", this).remove()
                                    })
                                } else 
                                    a("tr", c)
                                        .each(function () {
                                            a("th:gt(" + j + ")", this).remove()
                                        });
                                a(c).width(1);
                                a(b.grid.fhDiv)
                                    .append(c)
                                    .mousemove(function (a) {
                                        if (b.grid.resizing) 
                                            return b.grid.dragMove(a),
                                            !1
                                    });
                                a(b).bind("jqGridResizeStop.setFrozenColumns", function (c, d, e) {
                                    c = a(".ui-jqgrid-htable", b.grid.fhDiv);
                                    a("th:eq(" + e + ")", c).width(d);
                                    c = a(".ui-jqgrid-btable", b.grid.fbDiv);
                                    a("tr:first td:eq(" + e + ")", c).width(d)
                                });
                                a(b).bind("jqGridOnSortCol.setFrozenColumns", function (c, d, e) {
                                    c = a("tr.ui-jqgrid-labels:last th:eq(" + b.p.lastsort + ")", b.grid.fhDiv);
                                    d = a("tr.ui-jqgrid-labels:last th:eq(" + e + ")", b.grid.fhDiv);
                                    a("span.ui-grid-ico-sort", c).addClass("ui-state-disabled");
                                    a(c).attr("aria-selected", "false");
                                    a("span.ui-icon-" + b.p.sortorder, d).removeClass("ui-state-disabled");
                                    a(d).attr("aria-selected", "true");
                                    !b.p.viewsortcols[0] && b.p.lastsort !== e && (a("span.s-ico", c).hide(), a("span.s-ico", d).show())
                                });
                                a("#gview_" + a.jgrid.jqID(b.p.id)).append(b.grid.fbDiv);
                                a(b.grid.bDiv).scroll(function () {
                                    a(b.grid.fbDiv).scrollTop(a(this).scrollTop())
                                });
                                !0 === b.p.hoverrows && a("#" + a.jgrid.jqID(b.p.id))
                                    .unbind("mouseover")
                                    .unbind("mouseout");
                                a(b).bind("jqGridAfterGridComplete.setFrozenColumns", function () {
                                    a("#" + a.jgrid.jqID(b.p.id) + "_frozen").remove();
                                    a(b.grid.fbDiv).height(a(b.grid.bDiv).height() - 16);
                                    var c = a("#" + a.jgrid.jqID(b.p.id)).clone(!0);
                                    a("tr", c).each(function () {
                                        a("td:gt(" + j + ")", this).remove()
                                    });
                                    a(c)
                                        .width(1)
                                        .attr("id", b.p.id + "_frozen");
                                    a(b.grid.fbDiv).append(c);
                                    !0 === b.p.hoverrows && (a("tr.jqgrow", c).hover(function () {
                                        a(this).addClass("ui-state-hover");
                                        a("#" + a.jgrid.jqID(this.id), "#" + a.jgrid.jqID(b.p.id)).addClass("ui-state-hover")
                                    }, function () {
                                        a(this).removeClass("ui-state-hover");
                                        a("#" + a.jgrid.jqID(this.id), "#" + a.jgrid.jqID(b.p.id)).removeClass("ui-state-hover")
                                    }), a("tr.jqgrow", "#" + a.jgrid.jqID(b.p.id)).hover(function () {
                                        a(this).addClass("ui-state-hover");
                                        a("#" + a.jgrid.jqID(this.id), "#" + a.jgrid.jqID(b.p.id) + "_frozen").addClass("ui-state-hover")
                                    }, function () {
                                        a(this).removeClass("ui-state-hover");
                                        a("#" + a.jgrid.jqID(this.id), "#" + a.jgrid.jqID(b.p.id) + "_frozen").removeClass("ui-state-hover")
                                    }));
                                    c = null
                                });
                                b.p.frozenColumns = !0
                            }
                        }
                    }
                })
            },
            destroyFrozenColumns: function () {
                return this.each(function () {
                    if (this.grid && !0 === this.p.frozenColumns) {
                        a(this.grid.fhDiv).remove();
                        a(this.grid.fbDiv).remove();
                        this.grid.fhDiv = null;
                        this.grid.fbDiv = null;
                        a(this).unbind(".setFrozenColumns");
                        if (!0 === this.p.hoverrows) {
                            var b;
                            a("#" + a.jgrid.jqID(this.p.id)).bind("mouseover", function (c) {
                                b = a(c.target).closest("tr.jqgrow");
                                "ui-subgrid" !== a(b).attr("class") && a(b).addClass("ui-state-hover")
                            })
                                .bind("mouseout", function (c) {
                                    b = a(c.target).closest("tr.jqgrow");
                                    a(b).removeClass("ui-state-hover")
                                })
                        }
                        this.p.frozenColumns = !1
                    }
                })
            }
        })
})(jQuery);
(function (a) {
    a.extend(a.jgrid, {
        showModal: function (a) {
            a
                .w
                .show()
        },
        closeModal: function (a) {
            a
                .w
                .hide()
                .attr("aria-hidden", "true");
            a.o && a
                .o
                .remove()
        },
        hideModal: function (d, b) {
            b = a.extend({
                jqm: !0,
                gb: ""
            }, b || {});
            if (b.onClose) {
                var c = b.gb && "string" === typeof b.gb && "#gbox_" === b
                    .gb
                    .substr(0, 6)
                    ? b
                        .onClose
                        .call(a("#" + b.gb.substr(6))[0], d)
                    : b.onClose(d);
                if ("boolean" === typeof c && !c) 
                    return
            }
            if (a.fn.jqm && !0 === b.jqm) 
                a(d).attr("aria-hidden", "true").jqmHide();
            else {
                if ("" !== b.gb) 
                    try {
                        a(".jqgrid-overlay:first", b.gb).hide()
                    } catch (g) {}
                a(d)
                    .hide()
                    .attr("aria-hidden", "true")
            }
        },
        findPos: function (a) {
            var b = 0,
                c = 0;
            if (a.offsetParent) {
                do 
                    b += a.offsetLeft,
                    c += a.offsetTop;
                while (a = a.offsetParent)
            }
            return [b, c]
        },
        createModal: function (d, b, c, g, e, h, f) {
            var c = a.extend(!0, {}, a.jgrid.jqModal || {}, c),
                i = document.createElement("div"),
                j,
                n = this,
                f = a.extend({}, f || {});
            j = "rtl" === a(c.gbox).attr("dir")
                ? !0
                : !1;
            i.className = "ui-widget ui-widget-content ui-corner-all ui-jqdialog";
            i.id = d.themodal;
            var k = document.createElement("div");
            k.className = "ui-jqdialog-titlebar ui-widget-header ui-corner-all ui-helper-clearfix";
            k.id = d.modalhead;
            a(k).append("<span class='ui-jqdialog-title'>" + c.caption + "</span>");
            var l = a("<a href='javascript:void(0)' class='ui-jqdialog-titlebar-close ui-corner-all'></" +
                        "a>").hover(function () {
                l.addClass("ui-state-hover")
            }, function () {
                l.removeClass("ui-state-hover")
            }).append("<span class='ui-icon ui-icon-closethick'></span>");
            a(k).append(l);
            j
                ? (i.dir = "rtl", a(".ui-jqdialog-title", k).css("float", "right"), a(".ui-jqdialog-titlebar-close", k).css("left", "0.3em"))
                : (i.dir = "ltr", a(".ui-jqdialog-title", k).css("float", "left"), a(".ui-jqdialog-titlebar-close", k).css("right", "0.3em"));
            var m = document.createElement("div");
            a(m)
                .addClass("ui-jqdialog-content ui-widget-content")
                .attr("id", d.modalcontent);
            a(m).append(b);
            i.appendChild(m);
            a(i).prepend(k);
            !0 === h
                ? a("body").append(i)
                : "string" === typeof h
                    ? a(h).append(i)
                    : a(i).insertBefore(g);
            a(i).css(f);
            void 0 === c.jqModal && (c.jqModal = !0);
            b = {};
            if (a.fn.jqm && !0 === c.jqModal) 
                0 === c.left && 0 === c.top && c.overlay && (f = [], f = a.jgrid.findPos(e), c.left = f[0] + 4, c.top = f[1] + 4),
                b.top = c.top + "px",
                b.left = c.left;
            else if (0 !== c.left || 0 !== c.top) 
                b.left = c.left,
                b.top = c.top + "px";
            a("a.ui-jqdialog-titlebar-close", k)
                .click(function () {
                    var b = a("#" + a.jgrid.jqID(d.themodal)).data("onClose") || c.onClose,
                        e = a("#" + a.jgrid.jqID(d.themodal)).data("gbox") || c.gbox;
                    n.hideModal("#" + a.jgrid.jqID(d.themodal), {
                        gb: e,
                        jqm: c.jqModal,
                        onClose: b
                    });
                    return false
                });
            if (0 === c.width || !c.width) 
                c.width = 300;
            if (0 === c.height || !c.height) 
                c.height = 200;
            c.zIndex || (g = a(g).parents("*[role=dialog]").filter(":first").css("z-index"), c.zIndex = g
                ? parseInt(g, 10) + 2
                : 950);
            g = 0;
            j && b.left && !h && (g = a(c.gbox).width() - (!isNaN(c.width)
                ? parseInt(c.width, 10)
                : 0) - 8, b.left = parseInt(b.left, 10) + parseInt(g, 10));
            b.left && (b.left += "px");
            a(i).css(a.extend({
                width: isNaN(c.width)
                    ? "auto"
                    : c.width + "px",
                height: isNaN(c.height)
                    ? "auto"
                    : c.height + "px",
                zIndex: c.zIndex,
                overflow: "hidden"
            }, b)).attr({tabIndex: "-1", role: "dialog", "aria-labelledby": d.modalhead, "aria-hidden": "true"});
            void 0 === c.drag && (c.drag = !0);
            void 0 === c.resize && (c.resize = !0);
            if (c.drag) 
                if (a(k).css("cursor", "move"), a.fn.jqDrag) 
                    a(i).jqDrag(k);
                else 
                    try {
                        a(i).draggable({
                            handle: a("#" + a.jgrid.jqID(k.id))
                        })
                    } catch (o) {}
                if (c.resize) 
                if (a.fn.jqResize) 
                    a(i).append("<div class='jqResize ui-resizable-handle ui-resizable-se ui-icon ui-icon-gripsma" +
                            "ll-diagonal-se'></div>"),
                    a("#" + a.jgrid.jqID(d.themodal)).jqResize(".jqResize", d.scrollelm
                        ? "#" + a.jgrid.jqID(d.scrollelm)
                        : !1);
                else 
                    try {
                        a(i).resizable({
                            handles: "se, sw",
                            alsoResize: d.scrollelm
                                ? "#" + a
                                    .jgrid
                                    .jqID(d.scrollelm)
                                : !1
                        })
                    } catch (p) {}
                !0 === c.closeOnEscape && a(i).keydown(function (b) {
                if (b.which == 27) {
                    b = a("#" + a.jgrid.jqID(d.themodal)).data("onClose") || c.onClose;
                    n.hideModal("#" + a.jgrid.jqID(d.themodal), {
                        gb: c.gbox,
                        jqm: c.jqModal,
                        onClose: b
                    })
                }
            })
        },
        viewModal: function (d, b) {
            b = a.extend({
                toTop: !0,
                overlay: 10,
                modal: !1,
                overlayClass: "ui-widget-overlay",
                onShow: a.jgrid.showModal,
                onHide: a.jgrid.closeModal,
                gbox: "",
                jqm: !0,
                jqM: !0
            }, b || {});
            if (a.fn.jqm && !0 === b.jqm) 
                b.jqM
                    ? a(d).attr("aria-hidden", "false").jqm(b).jqmShow()
                    : a(d).attr("aria-hidden", "false").jqmShow();
            else {
                "" !== b.gbox && (a(".jqgrid-overlay:first", b.gbox).show(), a(d).data("gbox", b.gbox));
                a(d)
                    .show()
                    .attr("aria-hidden", "false");
                try {
                    a(":input:visible", d)[0].focus()
                } catch (c) {}
            }
        },
        info_dialog: function (d, b, c, g) {
            var e = {
                width: 290,
                height: "auto",
                dataheight: "auto",
                drag: !0,
                resize: !1,
                left: 250,
                top: 170,
                zIndex: 1E3,
                jqModal: !0,
                modal: !1,
                closeOnEscape: !0,
                align: "center",
                buttonalign: "center",
                buttons: []
            };
            a.extend(!0, e, a.jgrid.jqModal || {}, {
                caption: "<b>" + d + "</b>"
            }, g || {});
            var h = e.jqModal,
                f = this;
            a.fn.jqm && !h && (h = !1);
            d = "";
            if (0 < e.buttons.length) 
                for (g = 0; g < e.buttons.length; g++) 
                    void 0 === e.buttons[g].id && (e.buttons[g].id = "info_button_" + g),
                    d += "<a href='javascript:void(0)' id='" + e.buttons[g].id + "' class='fm-button ui-state-default ui-corner-all'>" + e.buttons[g].text + "</a>";
        g = isNaN(e.dataheight)
                ? e.dataheight
                : e.dataheight + "px";
            b = "<div id='info_id'>" + ("<div id='infocnt' style='margin:0px;padding-bottom:1em;width:100%;overflow:auto;" +
                    "position:relative;height:" + g + ";" + ("text-align:" + e.align + ";") + "'>" + b + "</div>");
            b += c
                ? "<div class='ui-widget-content ui-helper-clearfix' style='text-align:" + e.buttonalign + ";padding-bottom:0.8em;padding-top:0.5em;background-image: none;border-width: 1px" +
                        " 0 0 0;'><a href='javascript:void(0)' id='closedialog' class='fm-button ui-state" +
                        "-default ui-corner-all'>" + c + "</a>" + d + "</div>"
                : "" !== d
                    ? "<div class='ui-widget-content ui-helper-clearfix' style='text-align:" + e.buttonalign + ";padding-bottom:0.8em;padding-top:0.5em;background-image: none;border-width: 1px" +
                            " 0 0 0;'>" + d + "</div>"
                    : "";
            b += "</div>";
            try {
                "false" === a("#info_dialog").attr("aria-hidden") && a
                    .jgrid
                    .hideModal("#info_dialog", {jqm: h}),
                a("#info_dialog").remove()
            } catch (i) {}
            a
                .jgrid
                .createModal({
                    themodal: "info_dialog",
                    modalhead: "info_head",
                    modalcontent: "info_content",
                    scrollelm: "infocnt"
                }, b, e, "", "", !0);
            d && a.each(e.buttons, function (d) {
                a("#" + a.jgrid.jqID(this.id), "#info_id")
                    .bind("click", function () {
                        e
                            .buttons[d]
                            .onClick
                            .call(a("#info_dialog"));
                        return !1
                    })
            });
            a("#closedialog", "#info_id").click(function () {
                f.hideModal("#info_dialog", {
                    jqm: h,
                    onClose: a("#info_dialog").data("onClose") || e.onClose,
                    gb: a("#info_dialog").data("gbox") || e.gbox
                });
                return !1
            });
            a(".fm-button", "#info_dialog").hover(function () {
                a(this).addClass("ui-state-hover")
            }, function () {
                a(this).removeClass("ui-state-hover")
            });
            a.isFunction(e.beforeOpen) && e.beforeOpen();
            a
                .jgrid
                .viewModal("#info_dialog", {
                    onHide: function (a) {
                        a
                            .w
                            .hide()
                            .remove();
                        a.o && a
                            .o
                            .remove()
                    },
                    modal: e.modal,
                    jqm: h
                });
            a.isFunction(e.afterOpen) && e.afterOpen();
            try {
                a("#info_dialog").focus()
            } catch (j) {}
        },
        bindEv: function (d, b) {
            a.isFunction(b.dataInit) && b
                .dataInit
                .call(this, d);
            b.dataEvents && a.each(b.dataEvents, function () {
                void 0 !== this.data
                    ? a(d).bind(this.type, this.data, this.fn)
                    : a(d).bind(this.type, this.fn)
            })
        },
        createEl: function (d, b, c, g, e) {
            function h(d, b, c) {
                var e = ("dataInit,dataEvents,dataUrl,buildSelect,sopt,searchhidden,defaultValue,attr,cus" +
                        "om_element,custom_value").split(",");
                void 0 !== c && a.isArray(c) && a.merge(e, c);
                a.each(b, function (b, c) {
                    -1 === a.inArray(b, e) && a(d).attr(b, c)
                });
                b.hasOwnProperty("id") || a(d).attr("id", a.jgrid.randId())
            }
            var f = "",
                i = this;
            switch (d) {
                case "textarea":
                    f = document.createElement("textarea");
                    g
                        ? b.cols || a(f).css({width: "98%"})
                        : b.cols || (b.cols = 20);
                    b.rows || (b.rows = 2);
                    if ("&nbsp;" === c || "&#160;" === c || 1 === c.length && 160 === c.charCodeAt(0)) 
                        c = "";
                    f.value = c;
                    h(f, b);
                    a(f).attr({role: "textbox", multiline: "true"});
                    break;
                case "checkbox":
                    f = document.createElement("input");
                    f.type = "checkbox";
                    b.value
                        ? (d = b.value.split(":"), c === d[0] && (f.checked = !0, f.defaultChecked = !0), f.value = d[0], a(f).attr("offval", d[1]))
                        : (d = c.toLowerCase(), 0 > d.search(/(false|f|0|no|n|off|undefined)/i) && "" !== d
                            ? (f.checked = !0, f.defaultChecked = !0, f.value = c)
                            : f.value = "on", a(f).attr("offval", "off"));
                    h(f, b, ["value"]);
                    a(f).attr("role", "checkbox");
                    break;
                case "select":
                    f = document.createElement("select");
                    f.setAttribute("role", "select");
                    g = [];
                    !0 === b.multiple
                        ? (d = !0, f.multiple = "multiple", a(f).attr("aria-multiselectable", "true"))
                        : d = !1;
                    if (void 0 !== b.dataUrl) 
                        d = b.name
                            ? ("" + b.id).substring(0, ("" + b.id).length - ("" + b.name).length - 1)
                            : "" + b.id,
                        g = b.postData || e.postData,
                        i.p && i.p.idPrefix
                            ? d = a.jgrid.stripPref(i.p.idPrefix, d)
                            : g = void 0,
                        a.ajax(a.extend({
                            url: b.dataUrl,
                            type: "GET",
                            dataType: "html",
                            data: a.isFunction(g)
                                ? g.call(i, d, c, "" + b.name)
                                : g,
                            context: {
                                elem: f,
                                options: b,
                                vl: c
                            },
                            success: function (d) {
                                var b = [],
                                    c = this.elem,
                                    e = this.vl,
                                    f = a.extend({}, this.options),
                                    g = f.multiple === true,
                                    d = a.isFunction(f.buildSelect)
                                        ? f
                                            .buildSelect
                                            .call(i, d)
                                        : d;
                                typeof d === "string" && (d = a(a.trim(d)).html());
                                if (d) {
                                    a(c).append(d);
                                    h(c, f);
                                    if (f.size === void 0) 
                                        f.size = g
                                            ? 3
                                            : 1;
                                    if (g) {
                                        b = e.split(",");
                                        b = a.map(b, function (d) {
                                            return a.trim(d)
                                        })
                                    } else 
                                        b[0] = a.trim(e);
                                    setTimeout(function () {
                                        a("option", c)
                                            .each(function (d) {
                                                if (d === 0 && c.multiple) 
                                                    this.selected = false;
                                                a(this).attr("role", "option");
                                                if (a.inArray(a.trim(a(this).text()), b) > -1 || a.inArray(a.trim(a(this).val()), b) > -1) 
                                                    this.selected = "selected"
                                            })
                                    }, 0)
                                }
                            }
                        }, e || {}));
                    else if (b.value) {
                        var j;
                        void 0 === b.size && (b.size = d
                            ? 3
                            : 1);
                        d && (g = c.split(","), g = a.map(g, function (d) {
                            return a.trim(d)
                        }));
                        "function" === typeof b.value && (b.value = b.value());
                        var n,
                            k,
                            l = void 0 === b.separator
                                ? ":"
                                : b.separator,
                            e = void 0 === b.delimiter
                                ? ";"
                                : b.delimiter;
                        if ("string" === typeof b.value) {
                            n = b
                                .value
                                .split(e);
                            for (j = 0; j < n.length; j++) {
                                k = n[j].split(l);
                                2 < k.length && (k[1] = a.map(k, function (a, d) {
                                    if (d > 0) 
                                        return a
                                }).join(l));
                                e = document.createElement("option");
                                e.setAttribute("role", "option");
                                e.value = k[0];
                                e.innerHTML = k[1];
                                f.appendChild(e);
                                if (!d && (a.trim(k[0]) === a.trim(c) || a.trim(k[1]) === a.trim(c))) 
                                    e.selected = "selected";
                                if (d && (-1 < a.inArray(a.trim(k[1]), g) || -1 < a.inArray(a.trim(k[0]), g))) 
                                    e.selected = "selected"
                            }
                        } else if ("object" === typeof b.value) 
                            for (j in l = b.value, l) 
                                if (l.hasOwnProperty(j)) {
                                    e = document.createElement("option");
                                    e.setAttribute("role", "option");
                                    e.value = j;
                                    e.innerHTML = l[j];
                                    f.appendChild(e);
                                    if (!d && (a.trim(j) === a.trim(c) || a.trim(l[j]) === a.trim(c))) 
                                        e.selected = "selected";
                                    if (d && (-1 < a.inArray(a.trim(l[j]), g) || -1 < a.inArray(a.trim(j), g))) 
                                        e.selected = "selected"
                                }
                            h(f, b, ["value"])
                    }
                    break;
                case "text":
                case "psw":
                case "button":
                    j = "button" === d
                        ? "button"
                        : "textbox";
                    f = document.createElement("input");
                    f.type = d;
                    f.value = c;
                    h(f, b);
                    "button" !== d && (g
                        ? b.size || a(f).css({width: "98%"})
                        : b.size || (b.size = 20));
                    a(f).attr("role", j);
                    break;
                case "image":
                case "file":
                    f = document.createElement("input");
                    f.type = d;
                    h(f, b);
                    break;
                case "custom":
                    f = document.createElement("span");
                    try {
                        if (a.isFunction(b.custom_element)) 
                            if (l = b.custom_element.call(i, c, b)) 
                                l = a(l).addClass("customelement").attr({id: b.id, name: b.name}),
                                a(f).empty().append(l);
                            else 
                                throw "e2";
                    else 
                            throw "e1";
                        }
                    catch (m) {
                        "e1" === m && a
                            .jgrid
                            .info_dialog(a.jgrid.errors.errcap, "function 'custom_element' " + a.jgrid.edit.msg.nodefined, a.jgrid.edit.bClose),
                        "e2" === m
                            ? a
                                .jgrid
                                .info_dialog(a.jgrid.errors.errcap, "function 'custom_element' " + a.jgrid.edit.msg.novalue, a.jgrid.edit.bClose)
                            : a
                                .jgrid
                                .info_dialog(a.jgrid.errors.errcap, "string" === typeof m
                                    ? m
                                    : m.message, a.jgrid.edit.bClose)
                    }
            }
            return f
        },
        checkDate: function (a, b) {
            var c = {},
                g,
                a = a.toLowerCase();
            g = -1 !== a.indexOf("/")
                ? "/"
                : -1 !== a.indexOf("-")
                    ? "-"
                    : -1 !== a.indexOf(".")
                        ? "."
                        : "/";
            a = a.split(g);
            b = b.split(g);
            if (3 !== b.length) 
                return !1;
            g = -1;
            var e,
                h = -1,
                f = -1,
                i;
            for (i = 0; i < a.length; i++) 
                e = isNaN(b[i])
                    ? 0
                    : parseInt(b[i], 10),
                c[a[i]] = e,
                e = a[i],
                -1 !== e.indexOf("y") && (g = i),
                -1 !== e.indexOf("m") && (f = i),
                -1 !== e.indexOf("d") && (h = i);
            e = "y" === a[g] || "yyyy" === a[g]
                ? 4
                : "yy" === a[g]
                    ? 2
                    : -1;
            i = [
                0,
                31,
                29,
                31,
                30,
                31,
                30,
                31,
                31,
                30,
                31,
                30,
                31
            ];
            var j;
            if (-1 === g) 
                return !1;
            j = c[a[g]].toString();
            2 === e && 1 === j.length && (e = 1);
            if (j.length !== e || 0 === c[a[g]] && "00" !== b[g] || -1 === f) 
                return !1;
            j = c[a[f]].toString();
            if (1 > j.length || 1 > c[a[f]] || 12 < c[a[f]] || -1 === h) 
                return !1;
            j = c[a[h]].toString();
            return 1 > j.length || 1 > c[a[h]] || 31 < c[a[h]] || 2 === c[a[f]] && c[a[h]] > (0 === c[a[g]] % 4 && (0 !== c[a[g]] % 100 || 0 === c[a[g]] % 400)
                ? 29
                : 28) || c[a[h]] > i[c[a[f]]]
                ? !1
                : !0
        },
        isEmpty: function (a) {
            return a.match(/^\s+$/) || "" === a
                ? !0
                : !1
        },
        checkTime: function (d) {
            var b = /^(\d{1,2}):(\d{2})([apAP][Mm])?$/;
            if (!a.jgrid.isEmpty(d)) 
                if (d = d.match(b)) {
                    if (d[3]) {
                        if (1 > d[1] || 12 < d[1]) 
                            return !1
                    } else if (23 < d[1]) 
                        return !1;
                    if (59 < d[2]) 
                        return !1
                } else 
                    return !1;
        return !0
        },
        checkValues: function (d, b, c, g) {
            var e,
                h,
                f;
            f = this.p.colModel;
            if (void 0 === c) 
                if ("string" === typeof b) {
                    c = 0;
                    for (g = f.length; c < g; c++) 
                        if (f[c].name === b) {
                            e = f[c].editrules;
                            b = c;
                            null != f[c].formoptions && (h = f[c].formoptions.label);
                            break
                        }
                    } else 
                    0 <= b && (e = f[b].editrules);
        else 
                e = c,
                h = void 0 === g
                    ? "_"
                    : g;
            if (e) {
                h || (h = null != this.p.colNames
                    ? this.p.colNames[b]
                    : f[b].label);
                if (!0 === e.required && a.jgrid.isEmpty(d)) 
                    return [
                        !1,
                        h + ": " + a.jgrid.edit.msg.required,
                        ""
                    ];
                c = !1 === e.required
                    ? !1
                    : !0;
                if (!0 === e.number && !(!1 === c && a.jgrid.isEmpty(d)) && isNaN(d)) 
                    return [
                        !1,
                        h + ": " + a.jgrid.edit.msg.number,
                        ""
                    ];
                if (void 0 !== e.minValue && !isNaN(e.minValue) && parseFloat(d) < parseFloat(e.minValue)) 
                    return [
                        !1,
                        h + ": " + a.jgrid.edit.msg.minValue + " " + e.minValue,
                        ""
                    ];
                if (void 0 !== e.maxValue && !isNaN(e.maxValue) && parseFloat(d) > parseFloat(e.maxValue)) 
                    return [
                        !1,
                        h + ": " + a.jgrid.edit.msg.maxValue + " " + e.maxValue,
                        ""
                    ];
                if (!0 === e.email && !(!1 === c && a.jgrid.isEmpty(d)) && (g = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i, !g.test(d))) 
                    return [
                        !1,
                        h + ": " + a.jgrid.edit.msg.email,
                        ""
                    ];
                if (!0 === e.integer && !(!1 === c && a.jgrid.isEmpty(d)) && (isNaN(d) || 0 !== d % 1 || -1 !== d.indexOf("."))) 
                    return [
                        !1,
                        h + ": " + a.jgrid.edit.msg.integer,
                        ""
                    ];
                if (!0 === e.date && !(!1 === c && a.jgrid.isEmpty(d)) && (f[b].formatoptions && f[b].formatoptions.newformat
                    ? (f = f[b].formatoptions.newformat, a.jgrid.formatter.date.masks.hasOwnProperty(f) && (f = a.jgrid.formatter.date.masks[f]))
                    : f = f[b].datefmt || "Y-m-d", !a.jgrid.checkDate(f, d))) 
                    return [
                        !1,
                        h + ": " + a.jgrid.edit.msg.date + " - " + f,
                        ""
                    ];
                if (!0 === e.time && !(!1 === c && a.jgrid.isEmpty(d)) && !a.jgrid.checkTime(d)) 
                    return [
                        !1,
                        h + ": " + a.jgrid.edit.msg.date + " - hh:mm (am/pm)",
                        ""
                    ];
                if (!0 === e.url && !(!1 === c && a.jgrid.isEmpty(d)) && (g = /^(((https?)|(ftp)):\/\/([\-\w]+\.)+\w{2,3}(\/[%\-\w]+(\.\w{2,})?)*(([\w\-\.\?\\\/+@&#;`~=%!]*)(\.\w{2,})?)*\/?)/i, !g.test(d))) 
                    return [
                        !1,
                        h + ": " + a.jgrid.edit.msg.url,
                        ""
                    ];
                if (!0 === e.custom && !(!1 === c && a.jgrid.isEmpty(d))) 
                    return a.isFunction(e.custom_func)
                        ? (d = e.custom_func.call(this, d, h, b), a.isArray(d)
                            ? d
                            : [
                                !1,
                                a.jgrid.edit.msg.customarray,
                                ""
                            ])
                        : [
                            !1,
                            a.jgrid.edit.msg.customfcheck,
                            ""
                        ]
                }
            return [
                !0,
                "",
                ""
            ]
        }
    })
})(jQuery);
(function (a) {
    var b = {};
    a
        .jgrid
        .extend({
            searchGrid: function (b) {
                b = a.extend(!0, {
                    recreateFilter: !1,
                    drag: !0,
                    sField: "searchField",
                    sValue: "searchString",
                    sOper: "searchOper",
                    sFilter: "filters",
                    loadDefaults: !0,
                    beforeShowSearch: null,
                    afterShowSearch: null,
                    onInitializeSearch: null,
                    afterRedraw: null,
                    afterChange: null,
                    closeAfterSearch: !1,
                    closeAfterReset: !1,
                    closeOnEscape: !1,
                    searchOnEnter: !1,
                    multipleSearch: !1,
                    multipleGroup: !1,
                    top: 0,
                    left: 0,
                    jqModal: !0,
                    modal: !1,
                    resize: !0,
                    width: 450,
                    height: "auto",
                    dataheight: "auto",
                    showQuery: !1,
                    errorcheck: !0,
                    sopt: null,
                    stringResult: void 0,
                    onClose: null,
                    onSearch: null,
                    onReset: null,
                    toTop: !0,
                    overlay: 30,
                    columns: [],
                    tmplNames: null,
                    tmplFilters: null,
                    tmplLabel: " Template: ",
                    showOnLoad: !1,
                    layer: null,
                    operands: {
                        eq: "=",
                        ne: "<>",
                        lt: "<",
                        le: "<=",
                        gt: ">",
                        ge: ">=",
                        bw: "LIKE",
                        bn: "NOT LIKE",
                        "in": "IN",
                        ni: "NOT IN",
                        ew: "LIKE",
                        en: "NOT LIKE",
                        cn: "LIKE",
                        nc: "NOT LIKE",
                        nu: "IS NULL",
                        nn: "ISNOT NULL"
                    }
                }, a.jgrid.search, b || {});
                return this.each(function () {
                    function c(c) {
                        t = a(e).triggerHandler("jqGridFilterBeforeShow", [c]);
                        void 0 === t && (t = !0);
                        t && a.isFunction(b.beforeShowSearch) && (t = b.beforeShowSearch.call(e, c));
                        t && (a.jgrid.viewModal("#" + a.jgrid.jqID(u.themodal), {
                            gbox: "#gbox_" + a
                                .jgrid
                                .jqID(i),
                            jqm: b.jqModal,
                            modal: b.modal,
                            overlay: b.overlay,
                            toTop: b.toTop
                        }), a(e).triggerHandler("jqGridFilterAfterShow", [c]), a.isFunction(b.afterShowSearch) && b.afterShowSearch.call(e, c))
                    }
                    var e = this;
                    if (e.grid) {
                        var i = "fbox_" + e.p.id,
                            t = !0,
                            u = {
                                themodal: "searchmod" + i,
                                modalhead: "searchhd" + i,
                                modalcontent: "searchcnt" + i,
                                scrollelm: i
                            },
                            s = e.p.postData[b.sFilter];
                        "string" === typeof s && (s = a.jgrid.parse(s));
                        !0 === b.recreateFilter && a("#" + a.jgrid.jqID(u.themodal)).remove();
                        if (void 0 !== a("#" + a.jgrid.jqID(u.themodal))[0]) 
                            c(a("#fbox_" + a.jgrid.jqID(+ e.p.id)));
                        else {
                            var m = a("<div><div id='" + i + "' class='searchFilter' style='overflow:auto'></div></div>").insertBefore("#gview_" + a.jgrid.jqID(e.p.id)),
                                h = "left",
                                g = "";
                            "rtl" === e.p.direction && (h = "right", g = " style='text-align:left'", m.attr("dir", "rtl"));
                            var n = a.extend([], e.p.colModel),
                                x = "<a href='javascript:void(0)' id='" + i + "_search' class='fm-button ui-state-default ui-corner-all fm-button-icon-right ui" +
                                        "-reset'><span class='ui-icon ui-icon-search'></span>" + b.Find + "</a>",
                                d = "<a href='javascript:void(0)' id='" + i + "_reset' class='fm-button ui-state-default ui-corner-all fm-button-icon-left ui-s" +
                                        "earch'><span class='ui-icon ui-icon-arrowreturnthick-1-w'></span>" + b.Reset + "</a>",
                                q = "",
                                f = "",
                                o,
                                k = !1,
                                p = -1;
                            b.showQuery && (q = "<a href='javascript:void(0)' id='" + i + "_query' class='fm-button ui-state-default ui-corner-all fm-button-icon-left'><sp" +
                                    "an class='ui-icon ui-icon-comment'></span>Query</a>");
                            b.columns.length
                                ? (n = b.columns, p = 0, o = n[0].index || n[0].name)
                                : a.each(n, function (a, b) {
                                    if (!b.label) 
                                        b.label = e.p.colNames[a];
                                    if (!k) {
                                        var c = b.search === void 0
                                                ? true
                                                : b.search,
                                            d = b.hidden === true;
                                        if (b.searchoptions && b.searchoptions.searchhidden === true && c || c && !d) {
                                            k = true;
                                            o = b.index || b.name;
                                            p = a
                                        }
                                    }
                                });
                            if (!s && o || !1 === b.multipleSearch) {
                                var y = "eq";
                                0 <= p && n[p].searchoptions && n[p].searchoptions.sopt
                                    ? y = n[p].searchoptions.sopt[0]
                                    : b.sopt && b.sopt.length && (y = b.sopt[0]);
                                s = {
                                    groupOp: "AND",
                                    rules: [
                                        {
                                            field: o,
                                            op: y,
                                            data: ""
                                        }
                                    ]
                                }
                            }
                            k = !1;
                            b.tmplNames && b.tmplNames.length && (k = !0, f = b.tmplLabel, f += "<select class='ui-template'>", f += "<option value='default'>Default</option>", a.each(b.tmplNames, function (a, b) {
                                f = f + ("<option value='" + a + "'>" + b + "</option>")
                            }), f += "</select>");
                            h = "<table class='EditTable' style='border:0px none;margin-top:5px' id='" + i + "_2'><tbody><tr><td colspan='2'><hr class='ui-widget-content' style='margin:1px'/" +
                                    "></td></tr><tr><td class='EditButton' style='text-align:" + h + "'>" + d + f + "</td><td class='EditButton' " + g + ">" + q + x + "</td></tr></tbody></table>";
                            i = a
                                .jgrid
                                .jqID(i);
                            a("#" + i).jqFilter({
                                columns: n,
                                filter: b.loadDefaults
                                    ? s
                                    : null,
                                showQuery: b.showQuery,
                                errorcheck: b.errorcheck,
                                sopt: b.sopt,
                                groupButton: b.multipleGroup,
                                ruleButtons: b.multipleSearch,
                                afterRedraw: b.afterRedraw,
                                ops: b.odata,
                                operands: b.operands,
                                ajaxSelectOptions: e.p.ajaxSelectOptions,
                                groupOps: b.groupOps,
                                onChange: function () {
                                    this.p.showQuery && a(".query", this).html(this.toUserFriendlyString());
                                    a.isFunction(b.afterChange) && b
                                        .afterChange
                                        .call(e, a("#" + i), b)
                                },
                                direction: e.p.direction,
                                id: e.p.id
                            });
                            m.append(h);
                            k && b.tmplFilters && b.tmplFilters.length && a(".ui-template", m).bind("change", function () {
                                var c = a(this).val();
                                c === "default"
                                    ? a("#" + i).jqFilter("addFilter", s)
                                    : a("#" + i).jqFilter("addFilter", b.tmplFilters[parseInt(c, 10)]);
                                return false
                            });
                            !0 === b.multipleGroup && (b.multipleSearch = !0);
                            a(e).triggerHandler("jqGridFilterInitialize", [a("#" + i)]);
                            a.isFunction(b.onInitializeSearch) && b
                                .onInitializeSearch
                                .call(e, a("#" + i));
                            b.gbox = "#gbox_" + i;
                            b.layer
                                ? a
                                    .jgrid
                                    .createModal(u, m, b, "#gview_" + a.jgrid.jqID(e.p.id), a("#gbox_" + a.jgrid.jqID(e.p.id))[0], "#" + a.jgrid.jqID(b.layer), {position: "relative"})
                                : a
                                    .jgrid
                                    .createModal(u, m, b, "#gview_" + a.jgrid.jqID(e.p.id), a("#gbox_" + a.jgrid.jqID(e.p.id))[0]);
                            (b.searchOnEnter || b.closeOnEscape) && a("#" + a.jgrid.jqID(u.themodal)).keydown(function (c) {
                                var d = a(c.target);
                                if (b.searchOnEnter && c.which === 13 && !d.hasClass("add-group") && !d.hasClass("add-rule") && !d.hasClass("delete-group") && !d.hasClass("delete-rule") && (!d.hasClass("fm-button") || !d.is("[id$=_query]"))) {
                                    a("#" + i + "_search")
                                        .focus()
                                        .click();
                                    return false
                                }
                                if (b.closeOnEscape && c.which === 27) {
                                    a("#" + a.jgrid.jqID(u.modalhead))
                                        .find(".ui-jqdialog-titlebar-close")
                                        .focus()
                                        .click();
                                    return false
                                }
                            });
                            q && a("#" + i + "_query").bind("click", function () {
                                a(".queryresult", m).toggle();
                                return false
                            });
                            void 0 === b.stringResult && (b.stringResult = b.multipleSearch);
                            a("#" + i + "_search").bind("click", function () {
                                var c = a("#" + i),
                                    d = {},
                                    f,
                                    l = c.jqFilter("filterData");
                                if (b.errorcheck) {
                                    c[0].hideError();
                                    b.showQuery || c.jqFilter("toSQLString");
                                    if (c[0].p.error) {
                                        c[0].showError();
                                        return false
                                    }
                                }
                                if (b.stringResult) {
                                    try {
                                        f = xmlJsonClass.toJson(l, "", "", false)
                                    } catch (g) {
                                        try {
                                            f = JSON.stringify(l)
                                        } catch (h) {}
                                    }
                                    if (typeof f === "string") {
                                        d[b.sFilter] = f;
                                        a.each([
                                            b.sField, b.sValue, b.sOper
                                        ], function () {
                                            d[this] = ""
                                        })
                                    }
                                } else if (b.multipleSearch) {
                                    d[b.sFilter] = l;
                                    a.each([
                                        b.sField, b.sValue, b.sOper
                                    ], function () {
                                        d[this] = ""
                                    })
                                } else {
                                    d[b.sField] = l.rules[0].field;
                                    d[b.sValue] = l.rules[0].data;
                                    d[b.sOper] = l.rules[0].op;
                                    d[b.sFilter] = ""
                                }
                                e.p.search = true;
                                a.extend(e.p.postData, d);
                                a(e).triggerHandler("jqGridFilterSearch");
                                a.isFunction(b.onSearch) && b
                                    .onSearch
                                    .call(e);
                                a(e).trigger("reloadGrid", [
                                    {
                                        page: 1
                                    }
                                ]);
                                b.closeAfterSearch && a
                                    .jgrid
                                    .hideModal("#" + a.jgrid.jqID(u.themodal), {
                                        gb: "#gbox_" + a
                                            .jgrid
                                            .jqID(e.p.id),
                                        jqm: b.jqModal,
                                        onClose: b.onClose
                                    });
                                return false
                            });
                            a("#" + i + "_reset").bind("click", function () {
                                var c = {},
                                    d = a("#" + i);
                                e.p.search = false;
                                b.multipleSearch === false
                                    ? c[b.sField] = c[b.sValue] = c[b.sOper] = ""
                                    : c[b.sFilter] = "";
                                d[0].resetFilter();
                                k && a(".ui-template", m).val("default");
                                a.extend(e.p.postData, c);
                                a(e).triggerHandler("jqGridFilterReset");
                                a.isFunction(b.onReset) && b
                                    .onReset
                                    .call(e);
                                a(e).trigger("reloadGrid", [
                                    {
                                        page: 1
                                    }
                                ]);
                                return false
                            });
                            c(a("#" + i));
                            a(".fm-button:not(.ui-state-disabled)", m).hover(function () {
                                a(this).addClass("ui-state-hover")
                            }, function () {
                                a(this).removeClass("ui-state-hover")
                            })
                        }
                    }
                })
            },
            editGridRow: function (r, c) {
                c = a.extend(!0, {
                    top: 0,
                    left: 0,
                    width: 300,
                    datawidth: "auto",
                    height: "auto",
                    dataheight: "auto",
                    modal: !1,
                    overlay: 30,
                    drag: !0,
                    resize: !0,
                    url: null,
                    mtype: "POST",
                    clearAfterAdd: !0,
                    closeAfterEdit: !1,
                    reloadAfterSubmit: !0,
                    onInitializeForm: null,
                    beforeInitData: null,
                    beforeShowForm: null,
                    afterShowForm: null,
                    beforeSubmit: null,
                    afterSubmit: null,
                    onclickSubmit: null,
                    afterComplete: null,
                    onclickPgButtons: null,
                    afterclickPgButtons: null,
                    editData: {},
                    recreateForm: !1,
                    jqModal: !0,
                    closeOnEscape: !1,
                    addedrow: "first",
                    topinfo: "",
                    bottominfo: "",
                    saveicon: [],
                    closeicon: [],
                    savekey: [
                        !1,
                        13
                    ],
                    navkeys: [
                        !1,
                        38,
                        40
                    ],
                    checkOnSubmit: !1,
                    checkOnUpdate: !1,
                    _savedData: {},
                    processing: !1,
                    onClose: null,
                    ajaxEditOptions: {},
                    serializeEditData: null,
                    viewPagerButtons: !0,
                    overlayClass: "ui-widget-overlay"
                }, a.jgrid.edit, c || {});
                b[a(this)[0].p.id] = c;
                return this.each(function () {
                    function e() {
                        a(k + " > tbody > tr > td > .FormElement")
                            .each(function () {
                                var c = a(".customelement", this);
                                if (c.length) {
                                    var b = a(c[0]).attr("name");
                                    a.each(d.p.colModel, function () {
                                        if (this.name === b && this.editoptions && a.isFunction(this.editoptions.custom_value)) {
                                            try {
                                                if (j[b] = this.editoptions.custom_value.call(d, a("#" + a.jgrid.jqID(b), k), "get"), void 0 === j[b]) 
                                                    throw "e1";
                                                }
                                            catch (c) {
                                                "e1" === c
                                                    ? a
                                                        .jgrid
                                                        .info_dialog(a.jgrid.errors.errcap, "function 'custom_value' " + a.jgrid.edit.msg.novalue, a.jgrid.edit.bClose)
                                                    : a
                                                        .jgrid
                                                        .info_dialog(a.jgrid.errors.errcap, c.message, a.jgrid.edit.bClose)
                                            }
                                            return !0
                                        }
                                    })
                                } else {
                                    switch (a(this).get(0).type) {
                                        case "checkbox":
                                            a(this).is(":checked")
                                                ? j[this.name] = a(this).val()
                                                : (c = a(this).attr("offval"), j[this.name] = c);
                                            break;
                                        case "select-one":
                                            j[this.name] = a("option:selected", this).val();
                                            break;
                                        case "select-multiple":
                                            j[this.name] = a(this).val();
                                            j[this.name] = j[this.name]
                                                ? j[this.name].join(",")
                                                : "";
                                            a("option:selected", this).each(function (c, b) {
                                                a(b).text()
                                            });
                                            break;
                                        case "psw":
                                        case "text":
                                        case "textarea":
                                        case "button":
                                            j[this.name] = a(this).val()
                                    }
                                    d.p.autoencode && (j[this.name] = a.jgrid.htmlEncode(j[this.name]))
                                }
                            });
                        return !0
                    }
                    function i(c, e, l, g) {
                        var h,
                            j,
                            k,
                            p = 0,
                            i,
                            m,
                            o,
                            n = [],
                            q = !1,
                            z = "",
                            r;
                        for (r = 1; r <= g; r++) 
                            z += "<td class='CaptionTD'>&#160;</td><td class='DataTD'>&#160;</td>";
                        
                        "_empty" !== c && (q = a(e).jqGrid("getInd", c));
                        a(e.p.colModel).each(function (r) {
                            h = this.name;
                            m = (j = this.editrules && !0 === this.editrules.edithidden
                                ? !1
                                : !0 === this.hidden
                                    ? !0
                                    : !1)
                                ? "style='display:none'"
                                : "";
                            if ("cb" !== h && "subgrid" !== h && !0 === this.editable && "rn" !== h) {
                                if (!1 === q) 
                                    i = "";
                                else if (h === e.p.ExpandColumn && !0 === e.p.treeGrid) 
                                    i = a("td[role='gridcell']:eq(" + r + ")", e.rows[q]).text();
                                else {
                                    try {
                                        i = a
                                            .unformat
                                            .call(e, a("td[role='gridcell']:eq(" + r + ")", e.rows[q]), {
                                                rowId: c,
                                                colModel: this
                                            }, r)
                                    } catch (t) {
                                        i = this.edittype && "textarea" === this.edittype
                                            ? a("td[role='gridcell']:eq(" + r + ")", e.rows[q]).text()
                                            : a("td[role='gridcell']:eq(" + r + ")", e.rows[q]).html()
                                    }
                                    if (!i || "&nbsp;" === i || "&#160;" === i || 1 === i.length && 160 === i.charCodeAt(0)) 
                                        i = ""
                                }
                                var v = a.extend({}, this.editoptions || {}, {
                                        id: h,
                                        name: h
                                    }),
                                    s = a.extend({}, {
                                        elmprefix: "",
                                        elmsuffix: "",
                                        rowabove: !1,
                                        rowcontent: ""
                                    }, this.formoptions || {}),
                                    w = parseInt(s.rowpos, 10) || p + 1,
                                    u = parseInt(2 * (parseInt(s.colpos, 10) || 1), 10);
                                "_empty" === c && v.defaultValue && (i = a.isFunction(v.defaultValue)
                                    ? v.defaultValue.call(d)
                                    : v.defaultValue);
                                this.edittype || (this.edittype = "text");
                                d.p.autoencode && (i = a.jgrid.htmlDecode(i));
                                o = a
                                    .jgrid
                                    .createEl
                                    .call(d, this.edittype, v, i, !1, a.extend({}, a.jgrid.ajaxOptions, e.p.ajaxSelectOptions || {}));
                                if (b[d.p.id].checkOnSubmit || b[d.p.id].checkOnUpdate) 
                                    b[d.p.id]._savedData[h] = i;
                                a(o).addClass("FormElement");
                                -1 < a.inArray(this.edittype, ["text", "textarea", "psw", "select"]) && a(o).addClass("ui-widget-content ui-corner-all");
                                k = a(l).find("tr[rowpos=" + w + "]");
                                if (s.rowabove) {
                                    var y = a("<tr><td class='contentinfo' colspan='" + 2 * g + "'>" + s.rowcontent + "</td></tr>");
                                    a(l).append(y);
                                    y[0].rp = w
                                }
                                0 === k.length && (k = a("<tr " + m + " rowpos='" + w + "'></tr>").addClass("FormData").attr("id", "tr_" + h), a(k).append(z), a(l).append(k), k[0].rp = w);
                                a("td:eq(" + (u - 2) + ")", k[0]).html(void 0 === s.label
                                    ? e.p.colNames[r]
                                    : s.label);
                                a("td:eq(" + (u - 1) + ")", k[0])
                                    .append(s.elmprefix)
                                    .append(o)
                                    .append(s.elmsuffix);
                                a.isFunction(v.custom_value) && "_empty" !== c && v
                                    .custom_value
                                    .call(d, a("#" + h, "#" + f), "set", i);
                                a
                                    .jgrid
                                    .bindEv
                                    .call(d, o, v);
                                n[p] = r;
                                p++
                            }
                        });
                        if (0 < p && (r = a("<tr class='FormData' style='display:none'><td class='CaptionTD'></td><td colspan" +
                                "='" + (2 * g - 1) + "' class='DataTD'><input class='FormElement' id='id_g' type='text' name='" + e.p.id + "_id' value='" + c + "'/></td></tr>"), r[0].rp = p + 999, a(l).append(r), b[d.p.id].checkOnSubmit || b[d.p.id].checkOnUpdate)) 
                            b[d.p.id]._savedData[e.p.id + "_id"] = c;
                        return n
                    }
                    function t(c, e, f) {
                        var l,
                            h = 0,
                            g,
                            j,
                            i,
                            p,
                            r;
                        if (b[d.p.id].checkOnSubmit || b[d.p.id].checkOnUpdate) 
                            b[d.p.id]._savedData = {}
                        ,
                        b[d.p.id]._savedData[e.p.id + "_id"] = c;
                        var m = e.p.colModel;
                        if ("_empty" === c) 
                            a(m).each(function () {
                                l = this.name;
                                i = a.extend({}, this.editoptions || {});
                                if ((j = a("#" + a.jgrid.jqID(l), "#" + f)) && j.length && null !== j[0]) 
                                    if (p = "", i.defaultValue
                                        ? (p = a.isFunction(i.defaultValue)
                                            ? i.defaultValue.call(d)
                                            : i.defaultValue, "checkbox" === j[0].type
                                            ? (r = p.toLowerCase(), 0 > r.search(/(false|f|0|no|n|off|undefined)/i) && "" !== r
                                                ? (j[0].checked = !0, j[0].defaultChecked = !0, j[0].value = p)
                                                : (j[0].checked = !1, j[0].defaultChecked = !1))
                                            : j.val(p))
                                        : "checkbox" === j[0].type
                                            ? (j[0].checked = !1, j[0].defaultChecked = !1, p = a(j).attr("offval"))
                                            : j[0].type && "select" === j[0].type.substr(0, 6)
                                                ? j[0].selectedIndex = 0
                                                : j.val(p), !0 === b[d.p.id].checkOnSubmit || b[d.p.id].checkOnUpdate) 
                                        b[d.p.id]._savedData[l] = p
                            }),
                            a("#id_g", "#" + f).val(c);
                        else {
                            var o = a(e).jqGrid("getInd", c, !0);
                            o && (a('td[role="gridcell"]', o).each(function (j) {
                                l = m[j].name;
                                if ("cb" !== l && "subgrid" !== l && "rn" !== l && !0 === m[j].editable) {
                                    if (l === e.p.ExpandColumn && !0 === e.p.treeGrid) 
                                        g = a(this).text();
                                    else 
                                        try {
                                            g = a
                                                .unformat
                                                .call(e, a(this), {
                                                    rowId: c,
                                                    colModel: m[j]
                                                }, j)
                                        } catch (i) {
                                            g = "textarea" === m[j].edittype
                                                ? a(this).text()
                                                : a(this).html()
                                        }
                                    d.p.autoencode && (g = a.jgrid.htmlDecode(g));
                                    if (!0 === b[d.p.id].checkOnSubmit || b[d.p.id].checkOnUpdate) 
                                        b[d.p.id]._savedData[l] = g;
                                    l = a
                                        .jgrid
                                        .jqID(l);
                                    switch (m[j].edittype) {
                                        case "psw":
                                        case "text":
                                        case "button":
                                        case "image":
                                        case "textarea":
                                            if ("&nbsp;" === g || "&#160;" === g || 1 === g.length && 160 === g.charCodeAt(0)) 
                                                g = "";
                                            a("#" + l, "#" + f).val(g);
                                            break;
                                        case "select":
                                            var k = g.split(","),
                                                k = a.map(k, function (c) {
                                                    return a.trim(c)
                                                });
                                            a("#" + l + " option", "#" + f).each(function () {
                                                this.selected = !m[j].editoptions.multiple && (a.trim(g) === a.trim(a(this).text()) || k[0] === a.trim(a(this).text()) || k[0] === a.trim(a(this).val()))
                                                    ? !0
                                                    : m[j].editoptions.multiple
                                                        ? -1 < a.inArray(a.trim(a(this).text()), k) || -1 < a.inArray(a.trim(a(this).val()), k)
                                                            ? !0
                                                            : !1
                                                        : !1
                                            });
                                            break;
                                        case "checkbox":
                                            g = "" + g;
                                            if (m[j].editoptions && m[j].editoptions.value) 
                                                if (m[j].editoptions.value.split(":")[0] === g) 
                                                    a("#" + l, "#" + f)[d.p.useProp
                                                            ? "prop"
                                                            : "attr"]({
                                                        checked: !0,
                                                        defaultChecked: !0
                                                    });
                                                else 
                                                    a("#" + l, "#" + f)[d.p.useProp
                                                            ? "prop"
                                                            : "attr"]({
                                                        checked: !1,
                                                        defaultChecked: !1
                                                    });
                                        else 
                                                g = g.toLowerCase(),
                                                0 > g.search(/(false|f|0|no|n|off|undefined)/i) && "" !== g
                                                    ? (a("#" + l, "#" + f)[d.p.useProp
                                                            ? "prop"
                                                            : "attr"]("checked", !0),
                                                    a("#" + l, "#" + f)[d.p.useProp
                                                            ? "prop"
                                                            : "attr"]("defaultChecked", !0))
                                                    : (a("#" + l, "#" + f)[d.p.useProp
                                                            ? "prop"
                                                            : "attr"]("checked", !1),
                                                    a("#" + l, "#" + f)[d.p.useProp
                                                            ? "prop"
                                                            : "attr"]("defaultChecked", !1));
                                            break;
                                        case "custom":
                                            try {
                                                if (m[j].editoptions && a.isFunction(m[j].editoptions.custom_value)) 
                                                    m[j].editoptions.custom_value.call(d, a("#" + l, "#" + f), "set", g);
                                                else 
                                                    throw "e1";
                                                }
                                            catch (p) {
                                                "e1" === p
                                                    ? a
                                                        .jgrid
                                                        .info_dialog(a.jgrid.errors.errcap, "function 'custom_value' " + a.jgrid.edit.msg.nodefined, a.jgrid.edit.bClose)
                                                    : a
                                                        .jgrid
                                                        .info_dialog(a.jgrid.errors.errcap, p.message, a.jgrid.edit.bClose)
                                            }
                                    }
                                    h++
                                }
                            }), 0 < h && a("#id_g", k).val(c))
                        }
                    }
                    function u() {
                        a
                            .each(d.p.colModel, function (a, c) {
                                c.editoptions && !0 === c.editoptions.NullIfEmpty && j.hasOwnProperty(c.name) && "" === j[c.name] && (j[c.name] = "null")
                            })
                    }
                    function s() {
                        var e,
                            l = [
                                !0,
                                "",
                                ""
                            ],
                            g = {},
                            h = d.p.prmNames,
                            i,
                            m,
                            r,
                            o,
                            n,
                            z = a(d).triggerHandler("jqGridAddEditBeforeCheckValues", [
                                a("#" + f),
                                v
                            ]);
                        z && "object" === typeof z && (j = z);
                        a.isFunction(b[d.p.id].beforeCheckValues) && (z = b[d.p.id].beforeCheckValues.call(d, j, a("#" + f), v)) && "object" === typeof z && (j = z);
                        for (r in j) 
                            if (j.hasOwnProperty(r) && (l = a.jgrid.checkValues.call(d, j[r], r), !1 === l[0])) 
                                break;
                    u();
                        l[0] && (g = a(d).triggerHandler("jqGridAddEditClickSubmit", [
                            b[d.p.id],
                            j,
                            v
                        ]), void 0 === g && a.isFunction(b[d.p.id].onclickSubmit) && (g = b[d.p.id].onclickSubmit.call(d, b[d.p.id], j, v) || {}), l = a(d).triggerHandler("jqGridAddEditBeforeSubmit", [
                            j,
                            a("#" + f),
                            v
                        ]), void 0 === l && (l = [
                            !0,
                            "",
                            ""
                        ]), l[0] && a.isFunction(b[d.p.id].beforeSubmit) && (l = b[d.p.id].beforeSubmit.call(d, j, a("#" + f), v)));
                        if (l[0] && !b[d.p.id].processing) {
                            b[d.p.id].processing = !0;
                            a("#sData", k + "_2").addClass("ui-state-active");
                            m = h.oper;
                            i = h.id;
                            j[m] = "_empty" === a.trim(j[d.p.id + "_id"])
                                ? h.addoper
                                : h.editoper;
                            j[m] !== h.addoper
                                ? j[i] = j[d.p.id + "_id"]
                                : void 0 === j[i] && (j[i] = j[d.p.id + "_id"]);
                            delete j[d.p.id + "_id"];
                            j = a.extend(j, b[d.p.id].editData, g);
                            if (!0 === d.p.treeGrid) 
                                for (n in j[m] === h.addoper && (o = a(d).jqGrid("getGridParam", "selrow"), j["adjacency" === d.p.treeGridModel
                                        ? d.p.treeReader.parent_id_field
                                        : "parent_id"] = o), d.p.treeReader) 
                                    d.p.treeReader.hasOwnProperty(n) && (g = d.p.treeReader[n], j.hasOwnProperty(g) && !(j[m] === h.addoper && "parent_id_field" === n) && delete j[g]);
                        j[i] = a
                                .jgrid
                                .stripPref(d.p.idPrefix, j[i]);
                            n = a.extend({
                                url: b[d.p.id].url || a(d).jqGrid("getGridParam", "editurl"),
                                type: b[d.p.id].mtype,
                                data: a.isFunction(b[d.p.id].serializeEditData)
                                    ? b[d.p.id]
                                        .serializeEditData
                                        .call(d, j)
                                    : j,
                                complete: function (g, r) {
                                    var n;
                                    j[i] = d.p.idPrefix + j[i];
                                    if (g.status >= 300 && g.status !== 304) {
                                        l[0] = false;
                                        l[1] = a(d).triggerHandler("jqGridAddEditErrorTextFormat", [g, v]);
                                        l[1] = a.isFunction(b[d.p.id].errorTextFormat)
                                            ? b[d.p.id]
                                                .errorTextFormat
                                                .call(d, g, v)
                                            : r + " Status: '" + g.statusText + "'. Error code: " + g.status
                                    } else {
                                        l = a(d).triggerHandler("jqGridAddEditAfterSubmit", [g, j, v]);
                                        l === void 0 && (l = [true, "", ""]);
                                        l[0] && a.isFunction(b[d.p.id].afterSubmit) && (l = b[d.p.id].afterSubmit.call(d, g, j, v))
                                    }
                                    if (l[0] === false) {
                                        a("#FormError>td", k).html(l[1]);
                                        a("#FormError", k).show()
                                    } else {
                                        d.p.autoencode && a.each(j, function (c, b) {
                                            j[c] = a
                                                .jgrid
                                                .htmlDecode(b)
                                        });
                                        if (j[m] === h.addoper) {
                                            l[2] || (l[2] = a.jgrid.randId());
                                            j[i] = l[2];
                                            b[d.p.id].reloadAfterSubmit
                                                ? a(d).trigger("reloadGrid")
                                                : d.p.treeGrid === true
                                                    ? a(d).jqGrid("addChildNode", l[2], o, j)
                                                    : a(d).jqGrid("addRowData", l[2], j, c.addedrow);
                                            if (b[d.p.id].closeAfterAdd) {
                                                d.p.treeGrid !== true && a(d).jqGrid("setSelection", l[2]);
                                                a
                                                    .jgrid
                                                    .hideModal("#" + a.jgrid.jqID(p.themodal), {
                                                        gb: "#gbox_" + a
                                                            .jgrid
                                                            .jqID(q),
                                                        jqm: c.jqModal,
                                                        onClose: b[d.p.id].onClose
                                                    })
                                            } else 
                                                b[d.p.id].clearAfterAdd && t("_empty", d, f)
                                        } else {
                                            if (b[d.p.id].reloadAfterSubmit) {
                                                a(d).trigger("reloadGrid");
                                                b[d.p.id].closeAfterEdit || setTimeout(function () {
                                                    a(d).jqGrid("setSelection", j[i])
                                                }, 1E3)
                                            } else 
                                                d.p.treeGrid === true
                                                    ? a(d).jqGrid("setTreeRow", j[i], j)
                                                    : a(d).jqGrid("setRowData", j[i], j);
                                            b[d.p.id].closeAfterEdit && a
                                                .jgrid
                                                .hideModal("#" + a.jgrid.jqID(p.themodal), {
                                                    gb: "#gbox_" + a
                                                        .jgrid
                                                        .jqID(q),
                                                    jqm: c.jqModal,
                                                    onClose: b[d.p.id].onClose
                                                })
                                        }
                                        if (a.isFunction(b[d.p.id].afterComplete)) {
                                            e = g;
                                            setTimeout(function () {
                                                a(d).triggerHandler("jqGridAddEditAfterComplete", [
                                                    e,
                                                    j,
                                                    a("#" + f),
                                                    v
                                                ]);
                                                b[d.p.id]
                                                    .afterComplete
                                                    .call(d, e, j, a("#" + f), v);
                                                e = null
                                            }, 500)
                                        }
                                        if (b[d.p.id].checkOnSubmit || b[d.p.id].checkOnUpdate) {
                                            a("#" + f).data("disabled", false);
                                            if (b[d.p.id]._savedData[d.p.id + "_id"] !== "_empty") 
                                                for (n in b[d.p.id]._savedData) 
                                                    b[d.p.id]._savedData.hasOwnProperty(n) && j[n] && (b[d.p.id]._savedData[n] = j[n])
                                        }
                                    }
                                    b[d.p.id].processing = false;
                                    a("#sData", k + "_2").removeClass("ui-state-active");
                                    try {
                                        a(":input:visible", "#" + f)[0].focus()
                                    } catch (z) {}
                                }
                            }, a.jgrid.ajaxOptions, b[d.p.id].ajaxEditOptions);
                            !n.url && !b[d.p.id].useDataProxy && (a.isFunction(d.p.dataProxy)
                                ? b[d.p.id].useDataProxy = !0
                                : (l[0] = !1, l[1] += " " + a.jgrid.errors.nourl));
                            l[0] && (b[d.p.id].useDataProxy
                                ? (g = d.p.dataProxy.call(d, n, "set_" + d.p.id), void 0 === g && (g = [
                                    !0,
                                    ""
                                ]), !1 === g[0]
                                    ? (l[0] = !1, l[1] = g[1] || "Error deleting the selected row!")
                                    : (n.data.oper === h.addoper && b[d.p.id].closeAfterAdd && a.jgrid.hideModal("#" + a.jgrid.jqID(p.themodal), {
                                        gb: "#gbox_" + a
                                            .jgrid
                                            .jqID(q),
                                        jqm: c.jqModal,
                                        onClose: b[d.p.id].onClose
                                    }), n.data.oper === h.editoper && b[d.p.id].closeAfterEdit && a.jgrid.hideModal("#" + a.jgrid.jqID(p.themodal), {
                                        gb: "#gbox_" + a
                                            .jgrid
                                            .jqID(q),
                                        jqm: c.jqModal,
                                        onClose: b[d.p.id].onClose
                                    })))
                                : a.ajax(n))
                        }
                        !1 === l[0] && (a("#FormError>td", k).html(l[1]), a("#FormError", k).show())
                    }
                    function m(a, c) {
                        var b = !1,
                            d;
                        for (d in a) 
                            if (a.hasOwnProperty(d) && a[d] != c[d]) {
                                b = !0;
                                break
                            }
                        return b
                    }
                    function h() {
                        var c = !0;
                        a("#FormError", k).hide();
                        if (b[d.p.id].checkOnUpdate && (j = {}, e(), K = m(j, b[d.p.id]._savedData))) 
                            a("#" + f).data("disabled", !0),
                            a(".confirm", "#" + p.themodal).show(),
                            c = !1;
                        return c
                    }
                    function g() {
                        var c;
                        if ("_empty" !== r && void 0 !== d.p.savedRow && 0 < d.p.savedRow.length && a.isFunction(a.fn.jqGrid.restoreRow)) 
                            for (c = 0; c < d.p.savedRow.length; c++) 
                                if (d.p.savedRow[c].id == r) {
                                    a(d).jqGrid("restoreRow", r);
                                    break
                                }
                            }
                    function n(c, b) {
                        var d = b[1].length - 1;
                        0 === c
                            ? a("#pData", k + "_2").addClass("ui-state-disabled")
                            : void 0 !== b[1][c - 1] && a("#" + a.jgrid.jqID(b[1][c - 1])).hasClass("ui-state-disabled")
                                ? a("#pData", k + "_2").addClass("ui-state-disabled")
                                : a("#pData", k + "_2").removeClass("ui-state-disabled");
                        c === d
                            ? a("#nData", k + "_2").addClass("ui-state-disabled")
                            : void 0 !== b[1][c + 1] && a("#" + a.jgrid.jqID(b[1][c + 1])).hasClass("ui-state-disabled")
                                ? a("#nData", k + "_2").addClass("ui-state-disabled")
                                : a("#nData", k + "_2").removeClass("ui-state-disabled")
                    }
                    function x() {
                        var c = a(d).jqGrid("getDataIDs"),
                            b = a("#id_g", k).val();
                        return [
                            a.inArray(b, c),
                            c
                        ]
                    }
                    var d = this;
                    if (d.grid && r) {
                        var q = d.p.id,
                            f = "FrmGrid_" + q,
                            o = "TblGrid_" + q,
                            k = "#" + a
                                .jgrid
                                .jqID(o),
                            p = {
                                themodal: "editmod" + q,
                                modalhead: "edithd" + q,
                                modalcontent: "editcnt" + q,
                                scrollelm: f
                            },
                            y = a.isFunction(b[d.p.id].beforeShowForm)
                                ? b[d.p.id].beforeShowForm
                                : !1,
                            A = a.isFunction(b[d.p.id].afterShowForm)
                                ? b[d.p.id].afterShowForm
                                : !1,
                            w = a.isFunction(b[d.p.id].beforeInitData)
                                ? b[d.p.id].beforeInitData
                                : !1,
                            B = a.isFunction(b[d.p.id].onInitializeForm)
                                ? b[d.p.id].onInitializeForm
                                : !1,
                            l = !0,
                            z = 1,
                            F = 0,
                            j,
                            K,
                            v,
                            f = a
                                .jgrid
                                .jqID(f);
                        "new" === r
                            ? (r = "_empty", v = "add", c.caption = b[d.p.id].addCaption)
                            : (c.caption = b[d.p.id].editCaption, v = "edit");
                        !0 === c.recreateForm && void 0 !== a("#" + a.jgrid.jqID(p.themodal))[0] && a("#" + a.jgrid.jqID(p.themodal)).remove();
                        var G = !0;
                        c.checkOnUpdate && c.jqModal && !c.modal && (G = !1);
                        if (void 0 !== a("#" + a.jgrid.jqID(p.themodal))[0]) {
                            l = a(d).triggerHandler("jqGridAddEditBeforeInitData", [
                                a("#" + a.jgrid.jqID(f)),
                                v
                            ]);
                            void 0 === l && (l = !0);
                            l && w && (l = w.call(d, a("#" + f), v));
                            if (!1 === l) 
                                return;
                            g();
                            a(".ui-jqdialog-title", "#" + a.jgrid.jqID(p.modalhead)).html(c.caption);
                            a("#FormError", k).hide();
                            b[d.p.id].topinfo
                                ? (a(".topinfo", k).html(b[d.p.id].topinfo), a(".tinfo", k).show())
                                : a(".tinfo", k).hide();
                            b[d.p.id].bottominfo
                                ? (a(".bottominfo", k + "_2").html(b[d.p.id].bottominfo), a(".binfo", k + "_2").show())
                                : a(".binfo", k + "_2").hide();
                            t(r, d, f);
                            "_empty" === r || !b[d.p.id].viewPagerButtons
                                ? a("#pData, #nData", k + "_2").hide()
                                : a("#pData, #nData", k + "_2").show();
                            !0 === b[d.p.id].processing && (b[d.p.id].processing = !1, a("#sData", k + "_2").removeClass("ui-state-active"));
                            !0 === a("#" + f).data("disabled") && (a(".confirm", "#" + a.jgrid.jqID(p.themodal)).hide(), a("#" + f).data("disabled", !1));
                            a(d).triggerHandler("jqGridAddEditBeforeShowForm", [
                                a("#" + f),
                                v
                            ]);
                            y && y.call(d, a("#" + f), v);
                            a("#" + a.jgrid.jqID(p.themodal)).data("onClose", b[d.p.id].onClose);
                            a
                                .jgrid
                                .viewModal("#" + a.jgrid.jqID(p.themodal), {
                                    gbox: "#gbox_" + a
                                        .jgrid
                                        .jqID(q),
                                    jqm: c.jqModal,
                                    jqM: !1,
                                    overlay: c.overlay,
                                    modal: c.modal,
                                    overlayClass: c.overlayClass
                                });
                            G || a("." + a.jgrid.jqID(c.overlayClass)).click(function () {
                                if (!h()) 
                                    return false;
                                a
                                    .jgrid
                                    .hideModal("#" + a.jgrid.jqID(p.themodal), {
                                        gb: "#gbox_" + a
                                            .jgrid
                                            .jqID(q),
                                        jqm: c.jqModal,
                                        onClose: b[d.p.id].onClose
                                    });
                                return false
                            });
                            a(d).triggerHandler("jqGridAddEditAfterShowForm", [
                                a("#" + f),
                                v
                            ]);
                            A && A.call(d, a("#" + f), v)
                        } else {
                            var E = isNaN(c.dataheight)
                                    ? c.dataheight
                                    : c.dataheight + "px",
                                l = isNaN(c.datawidth)
                                    ? c.datawidth
                                    : c.datawidth + "px",
                                E = a("<form name='FormPost' id='" + f + "' class='FormGrid' onSubmit='return false;' style='width:" + l + ";overflow:auto;position:relative;height:" + E + ";'></form>").data("disabled", !1),
                                C = a("<table id='" + o + "' class='EditTable' cellspacing='0' cellpadding='0' border='0'><tbody></tbody></" +
                                        "table>"),
                                l = a(d).triggerHandler("jqGridAddEditBeforeInitData", [
                                    a("#" + f),
                                    v
                                ]);
                            void 0 === l && (l = !0);
                            l && w && (l = w.call(d, a("#" + f, v)));
                            if (!1 === l) 
                                return;
                            g();
                            a(d.p.colModel).each(function () {
                                var a = this.formoptions;
                                z = Math.max(z, a
                                    ? a.colpos || 0
                                    : 0);
                                F = Math.max(F, a
                                    ? a.rowpos || 0
                                    : 0)
                            });
                            a(E).append(C);
                            w = a("<tr id='FormError' style='display:none'><td class='ui-state-error' colspan='" + 2 * z + "'></td></tr>");
                            w[0].rp = 0;
                            a(C).append(w);
                            w = a("<tr style='display:none' class='tinfo'><td class='topinfo' colspan='" + 2 * z + "'>" + b[d.p.id].topinfo + "</td></tr>");
                            w[0].rp = 0;
                            a(C).append(w);
                            var l = (w = "rtl" === d.p.direction
                                    ? !0
                                    : !1)
                                    ? "nData"
                                    : "pData",
                                D = w
                                    ? "pData"
                                    : "nData";
                            i(r, d, C, z);
                            var l = "<a href='javascript:void(0)' id='" + l + "' class='fm-button ui-state-default ui-corner-left'><span class='ui-icon ui-icon" +
                                        "-triangle-1-w'></span></a>",
                                D = "<a href='javascript:void(0)' id='" + D + "' class='fm-button ui-state-default ui-corner-right'><span class='ui-icon ui-ico" +
                                        "n-triangle-1-e'></span></a>",
                                H = "<a href='javascript:void(0)' id='sData' class='fm-button ui-state-default ui-cor" +
                                        "ner-all'>" + c.bSubmit + "</a>",
                                I = "<a href='javascript:void(0)' id='cData' class='fm-button ui-state-default ui-cor" +
                                        "ner-all'>" + c.bCancel + "</a>",
                                o = "<table border='0' cellspacing='0' cellpadding='0' class='EditTable' id='" + o + "_2'><tbody><tr><td colspan='2'><hr class='ui-widget-content' style='margin:1px'/" +
                                        "></td></tr><tr id='Act_Buttons'><td class='navButton'>" + (w
                                    ? D + l
                                    : l + D) + "</td><td class='EditButton'>" + H + I + "</td></tr>" + ("<tr style='display:none' class='binfo'><td class='bottominfo' colspan='2'>" + b[d.p.id].bottominfo + "</td></tr>"),
                                o = o + "</tbody></table>";
                            if (0 < F) {
                                var J = [];
                                a.each(a(C)[0].rows, function (a, c) {
                                    J[a] = c
                                });
                                J.sort(function (a, c) {
                                    return a.rp > c.rp
                                        ? 1
                                        : a.rp < c.rp
                                            ? -1
                                            : 0
                                });
                                a.each(J, function (c, b) {
                                    a("tbody", C).append(b)
                                })
                            }
                            c.gbox = "#gbox_" + a
                                .jgrid
                                .jqID(q);
                            var L = !1;
                            !0 === c.closeOnEscape && (c.closeOnEscape = !1, L = !0);
                            o = a("<div></div>")
                                .append(E)
                                .append(o);
                            a
                                .jgrid
                                .createModal(p, o, c, "#gview_" + a.jgrid.jqID(d.p.id), a("#gbox_" + a.jgrid.jqID(d.p.id))[0]);
                            w && (a("#pData, #nData", k + "_2").css("float", "right"), a(".EditButton", k + "_2").css("text-align", "left"));
                            b[d.p.id].topinfo && a(".tinfo", k).show();
                            b[d.p.id].bottominfo && a(".binfo", k + "_2").show();
                            o = o = null;
                            a("#" + a.jgrid.jqID(p.themodal)).keydown(function (e) {
                                var l = e.target;
                                if (a("#" + f).data("disabled") === true) 
                                    return false;
                                if (b[d.p.id].savekey[0] === true && e.which === b[d.p.id].savekey[1] && l.tagName !== "TEXTAREA") {
                                    a("#sData", k + "_2").trigger("click");
                                    return false
                                }
                                if (e.which === 27) {
                                    if (!h()) 
                                        return false;
                                    L && a
                                        .jgrid
                                        .hideModal("#" + a.jgrid.jqID(p.themodal), {
                                            gb: c.gbox,
                                            jqm: c.jqModal,
                                            onClose: b[d.p.id].onClose
                                        });
                                    return false
                                }
                                if (b[d.p.id].navkeys[0] === true) {
                                    if (a("#id_g", k).val() === "_empty") 
                                        return true;
                                    if (e.which === b[d.p.id].navkeys[1]) {
                                        a("#pData", k + "_2").trigger("click");
                                        return false
                                    }
                                    if (e.which === b[d.p.id].navkeys[2]) {
                                        a("#nData", k + "_2").trigger("click");
                                        return false
                                    }
                                }
                            });
                            c.checkOnUpdate && (a("a.ui-jqdialog-titlebar-close span", "#" + a.jgrid.jqID(p.themodal)).removeClass("jqmClose"), a("a.ui-jqdialog-titlebar-close", "#" + a.jgrid.jqID(p.themodal)).unbind("click").click(function () {
                                if (!h()) 
                                    return false;
                                a
                                    .jgrid
                                    .hideModal("#" + a.jgrid.jqID(p.themodal), {
                                        gb: "#gbox_" + a
                                            .jgrid
                                            .jqID(q),
                                        jqm: c.jqModal,
                                        onClose: b[d.p.id].onClose
                                    });
                                return false
                            }));
                            c.saveicon = a.extend([
                                !0,
                                "left",
                                "ui-icon-disk"
                            ], c.saveicon);
                            c.closeicon = a.extend([
                                !0,
                                "left",
                                "ui-icon-close"
                            ], c.closeicon);
                            !0 === c.saveicon[0] && a("#sData", k + "_2").addClass("right" === c.saveicon[1]
                                ? "fm-button-icon-right"
                                : "fm-button-icon-left").append("<span class='ui-icon " + c.saveicon[2] + "'></span>");
                            !0 === c.closeicon[0] && a("#cData", k + "_2").addClass("right" === c.closeicon[1]
                                ? "fm-button-icon-right"
                                : "fm-button-icon-left").append("<span class='ui-icon " + c.closeicon[2] + "'></span>");
                            if (b[d.p.id].checkOnSubmit || b[d.p.id].checkOnUpdate) 
                                H = "<a href='javascript:void(0)' id='sNew' class='fm-button ui-state-default ui-corn" +
                                        "er-all' style='z-index:1002'>" + c.bYes + "</a>",
                                D = "<a href='javascript:void(0)' id='nNew' class='fm-button ui-state-default ui-corn" +
                                        "er-all' style='z-index:1002'>" + c.bNo + "</a>",
                                I = "<a href='javascript:void(0)' id='cNew' class='fm-button ui-state-default ui-corn" +
                                        "er-all' style='z-index:1002'>" + c.bExit + "</a>",
                                o = c.zIndex || 999,
                                o++,
                                a("<div class='" + c.overlayClass + " jqgrid-overlay confirm' style='z-index:" + o + ";display:none;'>&#160;</div><div class='confirm ui-widget-content ui-jqconfirm' " +
                                        "style='z-index:" + (o + 1) + "'>" + c.saveData + "<br/><br/>" + H + D + I + "</div>").insertAfter("#" + f),
                                a("#sNew", "#" + a.jgrid.jqID(p.themodal)).click(function () {
                                    s();
                                    a("#" + f).data("disabled", false);
                                    a(".confirm", "#" + a.jgrid.jqID(p.themodal)).hide();
                                    return false
                                }),
                                a("#nNew", "#" + a.jgrid.jqID(p.themodal)).click(function () {
                                    a(".confirm", "#" + a.jgrid.jqID(p.themodal)).hide();
                                    a("#" + f).data("disabled", false);
                                    setTimeout(function () {
                                        a(":input:visible", "#" + f)[0].focus()
                                    }, 0);
                                    return false
                                }),
                                a("#cNew", "#" + a.jgrid.jqID(p.themodal)).click(function () {
                                    a(".confirm", "#" + a.jgrid.jqID(p.themodal)).hide();
                                    a("#" + f).data("disabled", false);
                                    a
                                        .jgrid
                                        .hideModal("#" + a.jgrid.jqID(p.themodal), {
                                            gb: "#gbox_" + a
                                                .jgrid
                                                .jqID(q),
                                            jqm: c.jqModal,
                                            onClose: b[d.p.id].onClose
                                        });
                                    return false
                                });
                            a(d).triggerHandler("jqGridAddEditInitializeForm", [
                                a("#" + f),
                                v
                            ]);
                            B && B.call(d, a("#" + f), v);
                            "_empty" === r || !b[d.p.id].viewPagerButtons
                                ? a("#pData,#nData", k + "_2").hide()
                                : a("#pData,#nData", k + "_2").show();
                            a(d).triggerHandler("jqGridAddEditBeforeShowForm", [
                                a("#" + f),
                                v
                            ]);
                            y && y.call(d, a("#" + f), v);
                            a("#" + a.jgrid.jqID(p.themodal)).data("onClose", b[d.p.id].onClose);
                            a
                                .jgrid
                                .viewModal("#" + a.jgrid.jqID(p.themodal), {
                                    gbox: "#gbox_" + a
                                        .jgrid
                                        .jqID(q),
                                    jqm: c.jqModal,
                                    overlay: c.overlay,
                                    modal: c.modal,
                                    overlayClass: c.overlayClass
                                });
                            G || a("." + a.jgrid.jqID(c.overlayClass)).click(function () {
                                if (!h()) 
                                    return false;
                                a
                                    .jgrid
                                    .hideModal("#" + a.jgrid.jqID(p.themodal), {
                                        gb: "#gbox_" + a
                                            .jgrid
                                            .jqID(q),
                                        jqm: c.jqModal,
                                        onClose: b[d.p.id].onClose
                                    });
                                return false
                            });
                            a(d).triggerHandler("jqGridAddEditAfterShowForm", [
                                a("#" + f),
                                v
                            ]);
                            A && A.call(d, a("#" + f), v);
                            a(".fm-button", "#" + a.jgrid.jqID(p.themodal)).hover(function () {
                                a(this).addClass("ui-state-hover")
                            }, function () {
                                a(this).removeClass("ui-state-hover")
                            });
                            a("#sData", k + "_2").click(function () {
                                j = {};
                                a("#FormError", k).hide();
                                e();
                                if (j[d.p.id + "_id"] === "_empty") 
                                    s();
                                else if (c.checkOnSubmit === true) 
                                    if (K = m(j, b[d.p.id]._savedData)) {
                                        a("#" + f).data("disabled", true);
                                        a(".confirm", "#" + a.jgrid.jqID(p.themodal)).show()
                                    } else 
                                        s();
                            else 
                                    s();
                                return false
                            });
                            a("#cData", k + "_2").click(function () {
                                if (!h()) 
                                    return false;
                                a
                                    .jgrid
                                    .hideModal("#" + a.jgrid.jqID(p.themodal), {
                                        gb: "#gbox_" + a
                                            .jgrid
                                            .jqID(q),
                                        jqm: c.jqModal,
                                        onClose: b[d.p.id].onClose
                                    });
                                return false
                            });
                            a("#nData", k + "_2").click(function () {
                                if (!h()) 
                                    return false;
                                a("#FormError", k).hide();
                                var b = x();
                                b[0] = parseInt(b[0], 10);
                                if (b[0] !== -1 && b[1][b[0] + 1]) {
                                    a(d).triggerHandler("jqGridAddEditClickPgButtons", [
                                        "next",
                                        a("#" + f),
                                        b[1][b[0]]
                                    ]);
                                    var e;
                                    if (a.isFunction(c.onclickPgButtons)) {
                                        e = c
                                            .onclickPgButtons
                                            .call(d, "next", a("#" + f), b[1][b[0]]);
                                        if (e !== void 0 && e === false) 
                                            return false
                                    }
                                    if (a("#" + a.jgrid.jqID(b[1][b[0] + 1])).hasClass("ui-state-disabled")) 
                                        return false;
                                    t(b[1][b[0] + 1], d, f);
                                    a(d).jqGrid("setSelection", b[1][b[0] + 1]);
                                    a(d).triggerHandler("jqGridAddEditAfterClickPgButtons", [
                                        "next",
                                        a("#" + f),
                                        b[1][b[0]]
                                    ]);
                                    a.isFunction(c.afterclickPgButtons) && c
                                        .afterclickPgButtons
                                        .call(d, "next", a("#" + f), b[1][b[0] + 1]);
                                    n(b[0] + 1, b)
                                }
                                return false
                            });
                            a("#pData", k + "_2").click(function () {
                                if (!h()) 
                                    return false;
                                a("#FormError", k).hide();
                                var b = x();
                                if (b[0] !== -1 && b[1][b[0] - 1]) {
                                    a(d).triggerHandler("jqGridAddEditClickPgButtons", [
                                        "prev",
                                        a("#" + f),
                                        b[1][b[0]]
                                    ]);
                                    var e;
                                    if (a.isFunction(c.onclickPgButtons)) {
                                        e = c
                                            .onclickPgButtons
                                            .call(d, "prev", a("#" + f), b[1][b[0]]);
                                        if (e !== void 0 && e === false) 
                                            return false
                                    }
                                    if (a("#" + a.jgrid.jqID(b[1][b[0] - 1])).hasClass("ui-state-disabled")) 
                                        return false;
                                    t(b[1][b[0] - 1], d, f);
                                    a(d).jqGrid("setSelection", b[1][b[0] - 1]);
                                    a(d).triggerHandler("jqGridAddEditAfterClickPgButtons", [
                                        "prev",
                                        a("#" + f),
                                        b[1][b[0]]
                                    ]);
                                    a.isFunction(c.afterclickPgButtons) && c
                                        .afterclickPgButtons
                                        .call(d, "prev", a("#" + f), b[1][b[0] - 1]);
                                    n(b[0] - 1, b)
                                }
                                return false
                            })
                        }
                        y = x();
                        n(y[0], y)
                    }
                })
            },
            viewGridRow: function (r, c) {
                c = a.extend(!0, {
                    top: 0,
                    left: 0,
                    width: 0,
                    datawidth: "auto",
                    height: "auto",
                    dataheight: "auto",
                    modal: !1,
                    overlay: 30,
                    drag: !0,
                    resize: !0,
                    jqModal: !0,
                    closeOnEscape: !1,
                    labelswidth: "30%",
                    closeicon: [],
                    navkeys: [
                        !1,
                        38,
                        40
                    ],
                    onClose: null,
                    beforeShowForm: null,
                    beforeInitData: null,
                    viewPagerButtons: !0,
                    recreateForm: !1
                }, a.jgrid.view, c || {});
                b[a(this)[0].p.id] = c;
                return this.each(function () {
                    function e() {
                        (!0 === b[m.p.id].closeOnEscape || !0 === b[m.p.id].navkeys[0]) && setTimeout(function () {
                            a(".ui-jqdialog-titlebar-close", "#" + a.jgrid.jqID(q.modalhead)).focus()
                        }, 0)
                    }
                    function i(b, d, e, g) {
                        var f,
                            h,
                            i,
                            k = 0,
                            p,
                            m,
                            n = [],
                            r = !1,
                            o,
                            q = "<td class='CaptionTD form-view-label ui-widget-content' width='" + c.labelswidth + "'>&#160;</td><td class='DataTD form-view-data ui-helper-reset ui-widget-content'" +
                                    ">&#160;</td>",
                            s = "",
                            t = [
                                "integer", "number", "currency"
                            ],
                            w = 0,
                            u = 0,
                            y,
                            x,
                            A;
                        for (o = 1; o <= g; o++) 
                            s += 1 === o
                                ? q
                                : "<td class='CaptionTD form-view-label ui-widget-content'>&#160;</td><td class='Da" +
                                    "taTD form-view-data ui-widget-content'>&#160;</td>";
                        a(d.p.colModel)
                            .each(function () {
                                h = this.editrules && !0 === this.editrules.edithidden
                                    ? !1
                                    : !0 === this.hidden
                                        ? !0
                                        : !1;
                                !h && "right" === this.align && (this.formatter && -1 !== a.inArray(this.formatter, t)
                                    ? w = Math.max(w, parseInt(this.width, 10))
                                    : u = Math.max(u, parseInt(this.width, 10)))
                            });
                        y = 0 !== w
                            ? w
                            : 0 !== u
                                ? u
                                : 0;
                        r = a(d).jqGrid("getInd", b);
                        a(d.p.colModel).each(function (b) {
                            f = this.name;
                            x = !1;
                            m = (h = this.editrules && !0 === this.editrules.edithidden
                                ? !1
                                : !0 === this.hidden
                                    ? !0
                                    : !1)
                                ? "style='display:none'"
                                : "";
                            A = "boolean" !== typeof this.viewable
                                ? !0
                                : this.viewable;
                            if ("cb" !== f && "subgrid" !== f && "rn" !== f && A) {
                                p = !1 === r
                                    ? ""
                                    : f === d.p.ExpandColumn && !0 === d.p.treeGrid
                                        ? a("td:eq(" + b + ")", d.rows[r]).text()
                                        : a("td:eq(" + b + ")", d.rows[r]).html();
                                x = "right" === this.align && 0 !== y
                                    ? !0
                                    : !1;
                                var c = a.extend({}, {
                                        rowabove: !1,
                                        rowcontent: ""
                                    }, this.formoptions || {}),
                                    l = parseInt(c.rowpos, 10) || k + 1,
                                    o = parseInt(2 * (parseInt(c.colpos, 10) || 1), 10);
                                if (c.rowabove) {
                                    var q = a("<tr><td class='contentinfo' colspan='" + 2 * g + "'>" + c.rowcontent + "</td></tr>");
                                    a(e).append(q);
                                    q[0].rp = l
                                }
                                i = a(e).find("tr[rowpos=" + l + "]");
                                0 === i.length && (i = a("<tr " + m + " rowpos='" + l + "'></tr>").addClass("FormData").attr("id", "trv_" + f), a(i).append(s), a(e).append(i), i[0].rp = l);
                                a("td:eq(" + (o - 2) + ")", i[0]).html("<b>" + (void 0 === c.label
                                    ? d.p.colNames[b]
                                    : c.label) + "</b>");
                                a("td:eq(" + (o - 1) + ")", i[0])
                                    .append("<span>" + p + "</span>")
                                    .attr("id", "v_" + f);
                                x && a("td:eq(" + (o - 1) + ") span", i[0]).css({
                                    "text-align": "right",
                                    width: y + "px"
                                });
                                n[k] = b;
                                k++
                            }
                        });
                        0 < k && (b = a("<tr class='FormData' style='display:none'><td class='CaptionTD'></td><td colspan" +
                                "='" + (2 * g - 1) + "' class='DataTD'><input class='FormElement' id='id_g' type='text' name='id' valu" +
                                "e='" + b + "'/></td></tr>"), b[0].rp = k + 99, a(e).append(b));
                        return n
                    }
                    function t(b, c) {
                        var d,
                            e,
                            g = 0,
                            f,
                            h;
                        if (h = a(c).jqGrid("getInd", b, !0)) 
                            a("td", h).each(function (b) {
                                d = c.p.colModel[b].name;
                                e = c.p.colModel[b].editrules && !0 === c.p.colModel[b].editrules.edithidden
                                    ? !1
                                    : !0 === c.p.colModel[b].hidden
                                        ? !0
                                        : !1;
                                "cb" !== d && "subgrid" !== d && "rn" !== d && (f = d === c.p.ExpandColumn && !0 === c.p.treeGrid
                                    ? a(this).text()
                                    : a(this).html(), d = a.jgrid.jqID("v_" + d), a("#" + d + " span", "#" + n).html(f), e && a("#" + d, "#" + n).parents("tr:first").hide(), g++)
                            }),
                            0 < g && a("#id_g", "#" + n).val(b)
                    }
                    function u(b, c) {
                        var d = c[1].length - 1;
                        0 === b
                            ? a("#pData", "#" + n + "_2").addClass("ui-state-disabled")
                            : void 0 !== c[1][b - 1] && a("#" + a.jgrid.jqID(c[1][b - 1])).hasClass("ui-state-disabled")
                                ? a("#pData", n + "_2").addClass("ui-state-disabled")
                                : a("#pData", "#" + n + "_2").removeClass("ui-state-disabled");
                        b === d
                            ? a("#nData", "#" + n + "_2").addClass("ui-state-disabled")
                            : void 0 !== c[1][b + 1] && a("#" + a.jgrid.jqID(c[1][b + 1])).hasClass("ui-state-disabled")
                                ? a("#nData", n + "_2").addClass("ui-state-disabled")
                                : a("#nData", "#" + n + "_2").removeClass("ui-state-disabled")
                    }
                    function s() {
                        var b = a(m).jqGrid("getDataIDs"),
                            c = a("#id_g", "#" + n).val();
                        return [
                            a.inArray(c, b),
                            b
                        ]
                    }
                    var m = this;
                    if (m.grid && r) {
                        var h = m.p.id,
                            g = "ViewGrid_" + a
                                .jgrid
                                .jqID(h),
                            n = "ViewTbl_" + a
                                .jgrid
                                .jqID(h),
                            x = "ViewGrid_" + h,
                            d = "ViewTbl_" + h,
                            q = {
                                themodal: "viewmod" + h,
                                modalhead: "viewhd" + h,
                                modalcontent: "viewcnt" + h,
                                scrollelm: g
                            },
                            f = a.isFunction(b[m.p.id].beforeInitData)
                                ? b[m.p.id].beforeInitData
                                : !1,
                            o = !0,
                            k = 1,
                            p = 0;
                        !0 === c.recreateForm && void 0 !== a("#" + a.jgrid.jqID(q.themodal))[0] && a("#" + a.jgrid.jqID(q.themodal)).remove();
                        if (void 0 !== a("#" + a.jgrid.jqID(q.themodal))[0]) {
                            f && (o = f.call(m, a("#" + g)), void 0 === o && (o = !0));
                            if (!1 === o) 
                                return;
                            a(".ui-jqdialog-title", "#" + a.jgrid.jqID(q.modalhead)).html(c.caption);
                            a("#FormError", "#" + n).hide();
                            t(r, m);
                            a.isFunction(b[m.p.id].beforeShowForm) && b[m.p.id]
                                .beforeShowForm
                                .call(m, a("#" + g));
                            a
                                .jgrid
                                .viewModal("#" + a.jgrid.jqID(q.themodal), {
                                    gbox: "#gbox_" + a
                                        .jgrid
                                        .jqID(h),
                                    jqm: c.jqModal,
                                    jqM: !1,
                                    overlay: c.overlay,
                                    modal: c.modal
                                });
                            e()
                        } else {
                            var y = isNaN(c.dataheight)
                                    ? c.dataheight
                                    : c.dataheight + "px",
                                A = isNaN(c.datawidth)
                                    ? c.datawidth
                                    : c.datawidth + "px",
                                x = a("<form name='FormPost' id='" + x + "' class='FormGrid' style='width:" + A + ";overflow:auto;position:relative;height:" + y + ";'></form>"),
                                w = a("<table id='" + d + "' class='EditTable' cellspacing='1' cellpadding='2' border='0' style='table-layo" +
                                        "ut:fixed'><tbody></tbody></table>");
                            f && (o = f.call(m, a("#" + g)), void 0 === o && (o = !0));
                            if (!1 === o) 
                                return;
                            a(m.p.colModel)
                                .each(function () {
                                    var a = this.formoptions;
                                    k = Math.max(k, a
                                        ? a.colpos || 0
                                        : 0);
                                    p = Math.max(p, a
                                        ? a.rowpos || 0
                                        : 0)
                                });
                            a(x).append(w);
                            i(r, m, w, k);
                            d = "rtl" === m.p.direction
                                ? !0
                                : !1;
                            f = "<a href='javascript:void(0)' id='" + (d
                                ? "nData"
                                : "pData") + "' class='fm-button ui-state-default ui-corner-left'><span class='ui-icon ui-icon" +
                                    "-triangle-1-w'></span></a>";
                            o = "<a href='javascript:void(0)' id='" + (d
                                ? "pData"
                                : "nData") + "' class='fm-button ui-state-default ui-corner-right'><span class='ui-icon ui-ico" +
                                    "n-triangle-1-e'></span></a>";
                            y = "<a href='javascript:void(0)' id='cData' class='fm-button ui-state-default ui-cor" +
                                    "ner-all'>" + c.bClose + "</a>";
                            if (0 < p) {
                                var B = [];
                                a.each(a(w)[0].rows, function (a, b) {
                                    B[a] = b
                                });
                                B.sort(function (a, b) {
                                    return a.rp > b.rp
                                        ? 1
                                        : a.rp < b.rp
                                            ? -1
                                            : 0
                                });
                                a.each(B, function (b, c) {
                                    a("tbody", w).append(c)
                                })
                            }
                            c.gbox = "#gbox_" + a
                                .jgrid
                                .jqID(h);
                            x = a("<div></div>")
                                .append(x)
                                .append("<table border='0' class='EditTable' id='" + n + "_2'><tbody><tr id='Act_Buttons'><td class='navButton' width='" + c.labelswidth + "'>" + (d
                                    ? o + f
                                    : f + o) + "</td><td class='EditButton'>" + y + "</td></tr></tbody></table>");
                            a
                                .jgrid
                                .createModal(q, x, c, "#gview_" + a.jgrid.jqID(m.p.id), a("#gview_" + a.jgrid.jqID(m.p.id))[0]);
                            d && (a("#pData, #nData", "#" + n + "_2").css("float", "right"), a(".EditButton", "#" + n + "_2").css("text-align", "left"));
                            c.viewPagerButtons || a("#pData, #nData", "#" + n + "_2").hide();
                            x = null;
                            a("#" + q.themodal).keydown(function (d) {
                                if (d.which === 27) {
                                    b[m.p.id].closeOnEscape && a
                                        .jgrid
                                        .hideModal("#" + a.jgrid.jqID(q.themodal), {
                                            gb: c.gbox,
                                            jqm: c.jqModal,
                                            onClose: c.onClose
                                        });
                                    return false
                                }
                                if (c.navkeys[0] === true) {
                                    if (d.which === c.navkeys[1]) {
                                        a("#pData", "#" + n + "_2").trigger("click");
                                        return false
                                    }
                                    if (d.which === c.navkeys[2]) {
                                        a("#nData", "#" + n + "_2").trigger("click");
                                        return false
                                    }
                                }
                            });
                            c.closeicon = a.extend([
                                !0,
                                "left",
                                "ui-icon-close"
                            ], c.closeicon);
                            !0 === c.closeicon[0] && a("#cData", "#" + n + "_2").addClass("right" === c.closeicon[1]
                                ? "fm-button-icon-right"
                                : "fm-button-icon-left").append("<span class='ui-icon " + c.closeicon[2] + "'></span>");
                            a.isFunction(c.beforeShowForm) && c
                                .beforeShowForm
                                .call(m, a("#" + g));
                            a
                                .jgrid
                                .viewModal("#" + a.jgrid.jqID(q.themodal), {
                                    gbox: "#gbox_" + a
                                        .jgrid
                                        .jqID(h),
                                    jqm: c.jqModal,
                                    overlay: c.overlay,
                                    modal: c.modal
                                });
                            a(".fm-button:not(.ui-state-disabled)", "#" + n + "_2").hover(function () {
                                a(this).addClass("ui-state-hover")
                            }, function () {
                                a(this).removeClass("ui-state-hover")
                            });
                            e();
                            a("#cData", "#" + n + "_2").click(function () {
                                a
                                    .jgrid
                                    .hideModal("#" + a.jgrid.jqID(q.themodal), {
                                        gb: "#gbox_" + a
                                            .jgrid
                                            .jqID(h),
                                        jqm: c.jqModal,
                                        onClose: c.onClose
                                    });
                                return false
                            });
                            a("#nData", "#" + n + "_2").click(function () {
                                a("#FormError", "#" + n).hide();
                                var b = s();
                                b[0] = parseInt(b[0], 10);
                                if (b[0] !== -1 && b[1][b[0] + 1]) {
                                    a.isFunction(c.onclickPgButtons) && c
                                        .onclickPgButtons
                                        .call(m, "next", a("#" + g), b[1][b[0]]);
                                    t(b[1][b[0] + 1], m);
                                    a(m).jqGrid("setSelection", b[1][b[0] + 1]);
                                    a.isFunction(c.afterclickPgButtons) && c
                                        .afterclickPgButtons
                                        .call(m, "next", a("#" + g), b[1][b[0] + 1]);
                                    u(b[0] + 1, b)
                                }
                                e();
                                return false
                            });
                            a("#pData", "#" + n + "_2").click(function () {
                                a("#FormError", "#" + n).hide();
                                var b = s();
                                if (b[0] !== -1 && b[1][b[0] - 1]) {
                                    a.isFunction(c.onclickPgButtons) && c
                                        .onclickPgButtons
                                        .call(m, "prev", a("#" + g), b[1][b[0]]);
                                    t(b[1][b[0] - 1], m);
                                    a(m).jqGrid("setSelection", b[1][b[0] - 1]);
                                    a.isFunction(c.afterclickPgButtons) && c
                                        .afterclickPgButtons
                                        .call(m, "prev", a("#" + g), b[1][b[0] - 1]);
                                    u(b[0] - 1, b)
                                }
                                e();
                                return false
                            })
                        }
                        x = s();
                        u(x[0], x)
                    }
                })
            },
            delGridRow: function (r, c) {
                c = a.extend(!0, {
                    top: 0,
                    left: 0,
                    width: 240,
                    height: "auto",
                    dataheight: "auto",
                    modal: !1,
                    overlay: 30,
                    drag: !0,
                    resize: !0,
                    url: "",
                    mtype: "POST",
                    reloadAfterSubmit: !0,
                    beforeShowForm: null,
                    beforeInitData: null,
                    afterShowForm: null,
                    beforeSubmit: null,
                    onclickSubmit: null,
                    afterSubmit: null,
                    jqModal: !0,
                    closeOnEscape: !1,
                    delData: {},
                    delicon: [],
                    cancelicon: [],
                    onClose: null,
                    ajaxDelOptions: {},
                    processing: !1,
                    serializeDelData: null,
                    useDataProxy: !1
                }, a.jgrid.del, c || {});
                b[a(this)[0].p.id] = c;
                return this.each(function () {
                    var e = this;
                    if (e.grid && r) {
                        var i = a.isFunction(b[e.p.id].beforeShowForm),
                            t = a.isFunction(b[e.p.id].afterShowForm),
                            u = a.isFunction(b[e.p.id].beforeInitData)
                                ? b[e.p.id].beforeInitData
                                : !1,
                            s = e.p.id,
                            m = {},
                            h = !0,
                            g = "DelTbl_" + a
                                .jgrid
                                .jqID(s),
                            n,
                            x,
                            d,
                            q,
                            f = "DelTbl_" + s,
                            o = {
                                themodal: "delmod" + s,
                                modalhead: "delhd" + s,
                                modalcontent: "delcnt" + s,
                                scrollelm: g
                            };
                        a.isArray(r) && (r = r.join());
                        if (void 0 !== a("#" + a.jgrid.jqID(o.themodal))[0]) {
                            u && (h = u.call(e, a("#" + g)), void 0 === h && (h = !0));
                            if (!1 === h) 
                                return;
                            a("#DelData>td", "#" + g).text(r);
                            a("#DelError", "#" + g).hide();
                            !0 === b[e.p.id].processing && (b[e.p.id].processing = !1, a("#dData", "#" + g).removeClass("ui-state-active"));
                            i && b[e.p.id]
                                .beforeShowForm
                                .call(e, a("#" + g));
                            a
                                .jgrid
                                .viewModal("#" + a.jgrid.jqID(o.themodal), {
                                    gbox: "#gbox_" + a
                                        .jgrid
                                        .jqID(s),
                                    jqm: b[e.p.id].jqModal,
                                    jqM: !1,
                                    overlay: b[e.p.id].overlay,
                                    modal: b[e.p.id].modal
                                })
                        } else {
                            var k = isNaN(b[e.p.id].dataheight)
                                    ? b[e.p.id].dataheight
                                    : b[e.p.id].dataheight + "px",
                                p = isNaN(c.datawidth)
                                    ? c.datawidth
                                    : c.datawidth + "px",
                                f = "<div id='" + f + "' class='formdata' style='width:" + p + ";overflow:auto;position:relative;height:" + k + ";'><table class='DelTable'><tbody><tr id='DelError' style='display:none'><td cla" +
                                        "ss='ui-state-error'></td></tr>" + ("<tr id='DelData' style='display:none'><td >" + r + "</td></tr>"),
                                f = f + ('<tr><td class="delmsg" style="white-space:pre;">' + b[e.p.id].msg + "</td></tr><tr><td >&#160;</td></tr>"),
                                f = f + "</tbody></table></div>" + ("<table cellspacing='0' cellpadding='0' border='0' class='EditTable' id='" + g + "_2'><tbody><tr><td><hr class='ui-widget-content' style='margin:1px'/></td></tr><" +
                                        "tr><td class='DelButton EditButton'>" + ("<a href='javascript:void(0)' id='dData' class='fm-button ui-state-default ui-cor" +
                                        "ner-all'>" + c.bSubmit + "</a>") + "&#160;" + ("<a href='javascript:void(0)' id='eData' class='fm-button ui-state-default ui-cor" +
                                        "ner-all'>" + c.bCancel + "</a>") + "</td></tr></tbody></table>");
                            c.gbox = "#gbox_" + a
                                .jgrid
                                .jqID(s);
                            a
                                .jgrid
                                .createModal(o, f, c, "#gview_" + a.jgrid.jqID(e.p.id), a("#gview_" + a.jgrid.jqID(e.p.id))[0]);
                            u && (h = u.call(e, a("#" + g)), void 0 === h && (h = !0));
                            if (!1 === h) 
                                return;
                            a(".fm-button", "#" + g + "_2")
                                .hover(function () {
                                    a(this).addClass("ui-state-hover")
                                }, function () {
                                    a(this).removeClass("ui-state-hover")
                                });
                            c.delicon = a.extend([
                                !0,
                                "left",
                                "ui-icon-scissors"
                            ], b[e.p.id].delicon);
                            c.cancelicon = a.extend([
                                !0,
                                "left",
                                "ui-icon-cancel"
                            ], b[e.p.id].cancelicon);
                            !0 === c.delicon[0] && a("#dData", "#" + g + "_2").addClass("right" === c.delicon[1]
                                ? "fm-button-icon-right"
                                : "fm-button-icon-left").append("<span class='ui-icon " + c.delicon[2] + "'></span>");
                            !0 === c.cancelicon[0] && a("#eData", "#" + g + "_2").addClass("right" === c.cancelicon[1]
                                ? "fm-button-icon-right"
                                : "fm-button-icon-left").append("<span class='ui-icon " + c.cancelicon[2] + "'></span>");
                            a("#dData", "#" + g + "_2").click(function () {
                                var f = [
                                        true, ""
                                    ],
                                    h,
                                    i = a("#DelData>td", "#" + g).text();
                                m = {};
                                a.isFunction(b[e.p.id].onclickSubmit) && (m = b[e.p.id].onclickSubmit.call(e, b[e.p.id], i) || {});
                                a.isFunction(b[e.p.id].beforeSubmit) && (f = b[e.p.id].beforeSubmit.call(e, i));
                                if (f[0] && !b[e.p.id].processing) {
                                    b[e.p.id].processing = true;
                                    d = e.p.prmNames;
                                    n = a.extend({}, b[e.p.id].delData, m);
                                    q = d.oper;
                                    n[q] = d.deloper;
                                    x = d.id;
                                    i = ("" + i).split(",");
                                    if (!i.length) 
                                        return false;
                                    for (h in i) 
                                        i.hasOwnProperty(h) && (i[h] = a.jgrid.stripPref(e.p.idPrefix, i[h]));
                                    n[x] = i.join();
                                    a(this).addClass("ui-state-active");
                                    h = a.extend({
                                        url: b[e.p.id].url || a(e).jqGrid("getGridParam", "editurl"),
                                        type: b[e.p.id].mtype,
                                        data: a.isFunction(b[e.p.id].serializeDelData)
                                            ? b[e.p.id]
                                                .serializeDelData
                                                .call(e, n)
                                            : n,
                                        complete: function (d, h) {
                                            var k;
                                            if (d.status >= 300 && d.status !== 304) {
                                                f[0] = false;
                                                f[1] = a.isFunction(b[e.p.id].errorTextFormat)
                                                    ? b[e.p.id]
                                                        .errorTextFormat
                                                        .call(e, d)
                                                    : h + " Status: '" + d.statusText + "'. Error code: " + d.status
                                            } else 
                                                a.isFunction(b[e.p.id].afterSubmit) && (f = b[e.p.id].afterSubmit.call(e, d, n));
                                            if (f[0] === false) {
                                                a("#DelError>td", "#" + g).html(f[1]);
                                                a("#DelError", "#" + g).show()
                                            } else {
                                                if (b[e.p.id].reloadAfterSubmit && e.p.datatype !== "local") 
                                                    a(e).trigger("reloadGrid");
                                                else {
                                                    if (e.p.treeGrid === true) 
                                                        try {
                                                            a(e).jqGrid("delTreeNode", e.p.idPrefix + i[0])
                                                        } catch (p) {} else 
                                                            for (k = 0; k < i.length; k++) 
                                                                a(e).jqGrid("delRowData", e.p.idPrefix + i[k]);
                                                e.p.selrow = null;
                                                    e.p.selarrrow = []
                                                }
                                                a.isFunction(b[e.p.id].afterComplete) && setTimeout(function () {
                                                    b[e.p.id]
                                                        .afterComplete
                                                        .call(e, d, i)
                                                }, 500)
                                            }
                                            b[e.p.id].processing = false;
                                            a("#dData", "#" + g + "_2").removeClass("ui-state-active");
                                            f[0] && a
                                                .jgrid
                                                .hideModal("#" + a.jgrid.jqID(o.themodal), {
                                                    gb: "#gbox_" + a
                                                        .jgrid
                                                        .jqID(s),
                                                    jqm: c.jqModal,
                                                    onClose: b[e.p.id].onClose
                                                })
                                        }
                                    }, a.jgrid.ajaxOptions, b[e.p.id].ajaxDelOptions);
                                    if (!h.url && !b[e.p.id].useDataProxy) 
                                        if (a.isFunction(e.p.dataProxy)) 
                                            b[e.p.id].useDataProxy = true;
                                        else {
                                            f[0] = false;
                                            f[1] = f[1] + (" " + a.jgrid.errors.nourl)
                                        }
                                    if (f[0]) 
                                        if (b[e.p.id].useDataProxy) {
                                            h = e
                                                .p
                                                .dataProxy
                                                .call(e, h, "del_" + e.p.id);
                                            h === void 0 && (h = [true, ""]);
                                            if (h[0] === false) {
                                                f[0] = false;
                                                f[1] = h[1] || "Error deleting the selected row!"
                                            } else 
                                                a
                                                    .jgrid
                                                    .hideModal("#" + a.jgrid.jqID(o.themodal), {
                                                        gb: "#gbox_" + a
                                                            .jgrid
                                                            .jqID(s),
                                                        jqm: c.jqModal,
                                                        onClose: b[e.p.id].onClose
                                                    })
                                            } else 
                                            a.ajax(h)
                                }
                                if (f[0] === false) {
                                    a("#DelError>td", "#" + g).html(f[1]);
                                    a("#DelError", "#" + g).show()
                                }
                                return false
                            });
                            a("#eData", "#" + g + "_2").click(function () {
                                a
                                    .jgrid
                                    .hideModal("#" + a.jgrid.jqID(o.themodal), {
                                        gb: "#gbox_" + a
                                            .jgrid
                                            .jqID(s),
                                        jqm: b[e.p.id].jqModal,
                                        onClose: b[e.p.id].onClose
                                    });
                                return false
                            });
                            i && b[e.p.id]
                                .beforeShowForm
                                .call(e, a("#" + g));
                            a
                                .jgrid
                                .viewModal("#" + a.jgrid.jqID(o.themodal), {
                                    gbox: "#gbox_" + a
                                        .jgrid
                                        .jqID(s),
                                    jqm: b[e.p.id].jqModal,
                                    overlay: b[e.p.id].overlay,
                                    modal: b[e.p.id].modal
                                })
                        }
                        t && b[e.p.id]
                            .afterShowForm
                            .call(e, a("#" + g));
                        !0 === b[e.p.id].closeOnEscape && setTimeout(function () {
                            a(".ui-jqdialog-titlebar-close", "#" + a.jgrid.jqID(o.modalhead)).focus()
                        }, 0)
                    }
                })
            },
            navGrid: function (b, c, e, i, t, u, s) {
                c = a.extend({
                    edit: !0,
                    editicon: "ui-icon-pencil",
                    add: !0,
                    addicon: "ui-icon-plus",
                    del: !0,
                    delicon: "ui-icon-trash",
                    search: !0,
                    searchicon: "ui-icon-search",
                    refresh: !0,
                    refreshicon: "ui-icon-refresh",
                    refreshstate: "firstpage",
                    view: !1,
                    viewicon: "ui-icon-document",
                    position: "left",
                    closeOnEscape: !0,
                    beforeRefresh: null,
                    afterRefresh: null,
                    cloneToTop: !1,
                    alertwidth: 200,
                    alertheight: "auto",
                    alerttop: null,
                    alertleft: null,
                    alertzIndex: null
                }, a.jgrid.nav, c || {});
                return this.each(function () {
                    if (!this.nav) {
                        var m = {
                                themodal: "alertmod_" + this.p.id,
                                modalhead: "alerthd_" + this.p.id,
                                modalcontent: "alertcnt_" + this.p.id
                            },
                            h = this,
                            g;
                        if (h.grid && "string" === typeof b) {
                            void 0 === a("#" + m.themodal)[0] && (!c.alerttop && !c.alertleft && (void 0 !== window.innerWidth
                                ? (c.alertleft = window.innerWidth, c.alerttop = window.innerHeight)
                                : void 0 !== document.documentElement && void 0 !== document.documentElement.clientWidth && 0 !== document.documentElement.clientWidth
                                    ? (c.alertleft = document.documentElement.clientWidth, c.alerttop = document.documentElement.clientHeight)
                                    : (c.alertleft = 1024, c.alerttop = 768), c.alertleft = c.alertleft / 2 - parseInt(c.alertwidth, 10) / 2, c.alerttop = c.alerttop / 2 - 25), a.jgrid.createModal(m, "<div>" + c.alerttext + "</div><span tabindex='0'><span tabindex='-1' id='jqg_alrt'></span></span>", {
                                gbox: "#gbox_" + a
                                    .jgrid
                                    .jqID(h.p.id),
                                jqModal: !0,
                                drag: !0,
                                resize: !0,
                                caption: c.alertcap,
                                top: c.alerttop,
                                left: c.alertleft,
                                width: c.alertwidth,
                                height: c.alertheight,
                                closeOnEscape: c.closeOnEscape,
                                zIndex: c.alertzIndex
                            }, "#gview_" + a.jgrid.jqID(h.p.id), a("#gbox_" + a.jgrid.jqID(h.p.id))[0], !0));
                            var n = 1,
                                x,
                                d = function () {
                                    a(this).hasClass("ui-state-disabled") || a(this).addClass("ui-state-hover")
                                },
                                q = function () {
                                    a(this).removeClass("ui-state-hover")
                                };
                            c.cloneToTop && h.p.toppager && (n = 2);
                            for (x = 0; x < n; x++) {
                                var f = a("<table cellspacing='0' cellpadding='0' border='0' class='ui-pg-table navtable' s" +
                                            "tyle='float:left;table-layout:auto;'><tbody><tr></tr></tbody></table>"),
                                    o,
                                    k;
                                0 === x
                                    ? (o = b, k = h.p.id, o === h.p.toppager && (k += "_top", n = 1))
                                    : (o = h.p.toppager, k = h.p.id + "_top");
                                "rtl" === h.p.direction && a(f)
                                    .attr("dir", "rtl")
                                    .css("float", "right");
                                c.add && (i = i || {}, g = a("<td class='ui-pg-button ui-corner-all'></td>"), a(g).append("<div class='ui-pg-div'><span class='ui-icon " + c.addicon + "'></span>" + c.addtext + "</div>"), a("tr", f).append(g), a(g, f).attr({
                                    title: c.addtitle || "",
                                    id: i.id || "add_" + k
                                }).click(function () {
                                    a(this).hasClass("ui-state-disabled") || (a.isFunction(c.addfunc)
                                        ? c.addfunc.call(h)
                                        : a(h).jqGrid("editGridRow", "new", i));
                                    return false
                                }).hover(d, q), g = null);
                                c.edit && (g = a("<td class='ui-pg-button ui-corner-all'></td>"), e = e || {}, a(g).append("<div class='ui-pg-div'><span class='ui-icon " + c.editicon + "'></span>" + c.edittext + "</div>"), a("tr", f).append(g), a(g, f).attr({
                                    title: c.edittitle || "",
                                    id: e.id || "edit_" + k
                                }).click(function () {
                                    if (!a(this).hasClass("ui-state-disabled")) {
                                        var b = h.p.selrow;
                                        if (b) 
                                            a.isFunction(c.editfunc)
                                                ? c.editfunc.call(h, b)
                                                : a(h).jqGrid("editGridRow", b, e);
                                        else {
                                            a
                                                .jgrid
                                                .viewModal("#" + m.themodal, {
                                                    gbox: "#gbox_" + a
                                                        .jgrid
                                                        .jqID(h.p.id),
                                                    jqm: true
                                                });
                                            a("#jqg_alrt").focus()
                                        }
                                    }
                                    return false
                                }).hover(d, q), g = null);
                                c.view && (g = a("<td class='ui-pg-button ui-corner-all'></td>"), s = s || {}, a(g).append("<div class='ui-pg-div'><span class='ui-icon " + c.viewicon + "'></span>" + c.viewtext + "</div>"), a("tr", f).append(g), a(g, f).attr({
                                    title: c.viewtitle || "",
                                    id: s.id || "view_" + k
                                }).click(function () {
                                    if (!a(this).hasClass("ui-state-disabled")) {
                                        var b = h.p.selrow;
                                        if (b) 
                                            a.isFunction(c.viewfunc)
                                                ? c.viewfunc.call(h, b)
                                                : a(h).jqGrid("viewGridRow", b, s);
                                        else {
                                            a
                                                .jgrid
                                                .viewModal("#" + m.themodal, {
                                                    gbox: "#gbox_" + a
                                                        .jgrid
                                                        .jqID(h.p.id),
                                                    jqm: true
                                                });
                                            a("#jqg_alrt").focus()
                                        }
                                    }
                                    return false
                                }).hover(d, q), g = null);
                                c.del && (g = a("<td class='ui-pg-button ui-corner-all'></td>"), t = t || {}, a(g).append("<div class='ui-pg-div'><span class='ui-icon " + c.delicon + "'></span>" + c.deltext + "</div>"), a("tr", f).append(g), a(g, f).attr({
                                    title: c.deltitle || "",
                                    id: t.id || "del_" + k
                                }).click(function () {
                                    if (!a(this).hasClass("ui-state-disabled")) {
                                        var b;
                                        if (h.p.multiselect) {
                                            b = h.p.selarrrow;
                                            b.length === 0 && (b = null)
                                        } else 
                                            b = h.p.selrow;
                                        if (b) 
                                            a.isFunction(c.delfunc)
                                                ? c.delfunc.call(h, b)
                                                : a(h).jqGrid("delGridRow", b, t);
                                        else {
                                            a
                                                .jgrid
                                                .viewModal("#" + m.themodal, {
                                                    gbox: "#gbox_" + a
                                                        .jgrid
                                                        .jqID(h.p.id),
                                                    jqm: true
                                                });
                                            a("#jqg_alrt").focus()
                                        }
                                    }
                                    return false
                                }).hover(d, q), g = null);
                                (c.add || c.edit || c.del || c.view) && a("tr", f).append("<td class='ui-pg-button ui-state-disabled' style='width:4px;'><span class='ui-se" +
                                        "parator'></span></td>");
                                c.search && (g = a("<td class='ui-pg-button ui-corner-all'></td>"), u = u || {}, a(g).append("<div class='ui-pg-div'><span class='ui-icon " + c.searchicon + "'></span>" + c.searchtext + "</div>"), a("tr", f).append(g), a(g, f).attr({
                                    title: c.searchtitle || "",
                                    id: u.id || "search_" + k
                                }).click(function () {
                                    a(this).hasClass("ui-state-disabled") || (a.isFunction(c.searchfunc)
                                        ? c.searchfunc.call(h, u)
                                        : a(h).jqGrid("searchGrid", u));
                                    return false
                                }).hover(d, q), u.showOnLoad && !0 === u.showOnLoad && a(g, f).click(), g = null);
                                c.refresh && (g = a("<td class='ui-pg-button ui-corner-all'></td>"), a(g).append("<div class='ui-pg-div'><span class='ui-icon " + c.refreshicon + "'></span>" + c.refreshtext + "</div>"), a("tr", f).append(g), a(g, f).attr({
                                    title: c.refreshtitle || "",
                                    id: "refresh_" + k
                                }).click(function () {
                                    if (!a(this).hasClass("ui-state-disabled")) {
                                        a.isFunction(c.beforeRefresh) && c
                                            .beforeRefresh
                                            .call(h);
                                        h.p.search = false;
                                        try {
                                            var b = h.p.id;
                                            h.p.postData.filters = "";
                                            try {
                                                a("#fbox_" + a.jgrid.jqID(b)).jqFilter("resetFilter")
                                            } catch (d) {}
                                            a.isFunction(h.clearToolbar) && h
                                                .clearToolbar
                                                .call(h, false)
                                        } catch (e) {}
                                        switch (c.refreshstate) {
                                            case "firstpage":
                                                a(h).trigger("reloadGrid", [
                                                    {
                                                        page: 1
                                                    }
                                                ]);
                                                break;
                                            case "current":
                                                a(h).trigger("reloadGrid", [
                                                    {
                                                        current: true
                                                    }
                                                ])
                                        }
                                        a.isFunction(c.afterRefresh) && c
                                            .afterRefresh
                                            .call(h)
                                    }
                                    return false
                                }).hover(d, q), g = null);
                                g = a(".ui-jqgrid").css("font-size") || "11px";
                                a("body").append("<div id='testpg2' class='ui-jqgrid ui-widget ui-widget-content' style='font-size" +
                                        ":" + g + ";visibility:hidden;' ></div>");
                                g = a(f)
                                    .clone()
                                    .appendTo("#testpg2")
                                    .width();
                                a("#testpg2").remove();
                                a(o + "_" + c.position, o).append(f);
                                h.p._nvtd && (g > h.p._nvtd[0] && (a(o + "_" + c.position, o).width(g), h.p._nvtd[0] = g), h.p._nvtd[1] = g);
                                f = g = g = null;
                                this.nav = !0
                            }
                        }
                    }
                })
            },
            navButtonAdd: function (b, c) {
                c = a.extend({
                    caption: "newButton",
                    title: "",
                    buttonicon: "ui-icon-newwin",
                    onClickButton: null,
                    position: "last",
                    cursor: "pointer"
                }, c || {});
                return this.each(function () {
                    if (this.grid) {
                        "string" === typeof b && 0 !== b.indexOf("#") && (b = "#" + a.jgrid.jqID(b));
                        var e = a(".navtable", b)[0],
                            i = this;
                        if (e && !(c.id && void 0 !== a("#" + a.jgrid.jqID(c.id), e)[0])) {
                            var t = a("<td></td>");
                            "NONE" === c
                                .buttonicon
                                .toString()
                                .toUpperCase()
                                ? a(t)
                                    .addClass("ui-pg-button ui-corner-all")
                                    .append("<div class='ui-pg-div'>" + c.caption + "</div>")
                                : a(t)
                                    .addClass("ui-pg-button ui-corner-all")
                                    .append("<div class='ui-pg-div'><span class='ui-icon " + c.buttonicon + "'></span>" + c.caption + "</div>");
                            c.id && a(t).attr("id", c.id);
                            "first" === c.position
                                ? 0 === e.rows[0].cells.length
                                    ? a("tr", e).append(t)
                                    : a("tr td:eq(0)", e).before(t)
                                : a("tr", e).append(t);
                            a(t, e)
                                .attr("title", c.title || "")
                                .click(function (b) {
                                    a(this).hasClass("ui-state-disabled") || a.isFunction(c.onClickButton) && c
                                        .onClickButton
                                        .call(i, b);
                                    return !1
                                })
                                .hover(function () {
                                    a(this).hasClass("ui-state-disabled") || a(this).addClass("ui-state-hover")
                                }, function () {
                                    a(this).removeClass("ui-state-hover")
                                })
                        }
                    }
                })
            },
            navSeparatorAdd: function (b, c) {
                c = a.extend({
                    sepclass: "ui-separator",
                    sepcontent: "",
                    position: "last"
                }, c || {});
                return this.each(function () {
                    if (this.grid) {
                        "string" === typeof b && 0 !== b.indexOf("#") && (b = "#" + a.jgrid.jqID(b));
                        var e = a(".navtable", b)[0];
                        if (e) {
                            var i = "<td class='ui-pg-button ui-state-disabled' style='width:4px;'><span class='" + c.sepclass + "'></span>" + c.sepcontent + "</td>";
                            "first" === c.position
                                ? 0 === e.rows[0].cells.length
                                    ? a("tr", e).append(i)
                                    : a("tr td:eq(0)", e).before(i)
                                : a("tr", e).append(i)
                        }
                    }
                })
            },
            GridToForm: function (b, c) {
                return this.each(function () {
                    var e = this,
                        i;
                    if (e.grid) {
                        var t = a(e).jqGrid("getRowData", b);
                        if (t) 
                            for (i in t) 
                                t.hasOwnProperty(i) && (a("[name=" + a.jgrid.jqID(i) + "]", c).is("input:radio") || a("[name=" + a.jgrid.jqID(i) + "]", c).is("input:checkbox")
                                    ? a("[name=" + a.jgrid.jqID(i) + "]", c).each(function () {
                                        if (a(this).val() == t[i]) 
                                            a(this)[e.p.useProp
                                                    ? "prop"
                                                    : "attr"]("checked", !0);
                                        else 
                                            a(this)[e.p.useProp
                                                    ? "prop"
                                                    : "attr"]("checked", !1)
                                            })
                                    : a("[name=" + a.jgrid.jqID(i) + "]", c).val(t[i]))
                        }
                })
            },
            FormToGrid: function (b, c, e, i) {
                return this.each(function () {
                    if (this.grid) {
                        e || (e = "set");
                        i || (i = "first");
                        var t = a(c).serializeArray(),
                            u = {};
                        a.each(t, function (a, b) {
                            u[b.name] = b.value
                        });
                        "add" === e
                            ? a(this).jqGrid("addRowData", b, u, i)
                            : "set" === e && a(this).jqGrid("setRowData", b, u)
                    }
                })
            }
        })
})(jQuery);
(function (a) {
    a.fn.jqFilter = function (d) {
        if ("string" === typeof d) {
            var l = a.fn.jqFilter[d];
            if (!l) 
                throw "jqFilter - No such method: " + d;
            var v = a
                .makeArray(arguments)
                .slice(1);
            return l.apply(this, v)
        }
        var n = a.extend(!0, {
            filter: null,
            columns: [],
            onChange: null,
            afterRedraw: null,
            checkValues: null,
            error: !1,
            errmsg: "",
            errorcheck: !0,
            showQuery: !0,
            sopt: null,
            ops: [],
            operands: null,
            numopts: "eq,ne,lt,le,gt,ge,nu,nn,in,ni".split(","),
            stropts: "eq,ne,bw,bn,ew,en,cn,nc,nu,nn,in,ni".split(","),
            strarr: [
                "text", "string", "blob"
            ],
            groupOps: [
                {
                    op: "AND",
                    text: "AND"
                }, {
                    op: "OR",
                    text: "OR"
                }
            ],
            groupButton: !0,
            ruleButtons: !0,
            direction: "ltr"
        }, a.jgrid.filter, d || {});
        return this.each(function () {
            if (!this.filter) {
                this.p = n;
                if (null === this.p.filter || void 0 === this.p.filter) 
                    this.p.filter = {
                        groupOp: this.p.groupOps[0].op,
                        rules: [],
                        groups: []
                    };
                var d,
                    l = this.p.columns.length,
                    f,
                    t = /msie/i.test(navigator.userAgent) && !window.opera;
                this.p.initFilter = a.extend(!0, {}, this.p.filter);
                if (l) {
                    for (d = 0; d < l; d++) 
                        if (f = this.p.columns[d], f.stype
                            ? f.inputtype = f.stype
                            : f.inputtype || (f.inputtype = "text"), f.sorttype
                            ? f.searchtype = f.sorttype
                            : f.searchtype || (f.searchtype = "string"), void 0 === f.hidden && (f.hidden = !1), f.label || (f.label = f.name), f.index && (f.name = f.index), f.hasOwnProperty("searchoptions") || (f.searchoptions = {}), !f.hasOwnProperty("searchrules")) 
                            f.searchrules = {};
                this.p.showQuery && a(this).append("<table class='queryresult ui-widget ui-widget-content' style='display:block;max-" +
                            "width:440px;border:0px none;' dir='" + this.p.direction + "'><tbody><tr><td class='query'></td></tr></tbody></table>");
                    var u = function () {
                            return a("#" + a.jgrid.jqID(n.id))[0] || null
                        },
                        r = function (g, j) {
                            var b = [
                                    !0,
                                    ""
                                ],
                                c = u();
                            if (a.isFunction(j.searchrules)) 
                                b = j.searchrules.call(c, g, j);
                            else if (a.jgrid && a.jgrid.checkValues) 
                                try {
                                    b = a
                                        .jgrid
                                        .checkValues
                                        .call(c, g, -1, j.searchrules, j.label)
                                } catch (k) {}
                            b && b.length && !1 === b[0] && (n.error = !b[0], n.errmsg = b[1])
                        };
                    this.onchange = function () {
                        this.p.error = !1;
                        this.p.errmsg = "";
                        return a.isFunction(this.p.onChange)
                            ? this
                                .p
                                .onChange
                                .call(this, this.p)
                            : !1
                    };
                    this.reDraw = function () {
                        a("table.group:first", this).remove();
                        var g = this.createTableForGroup(n.filter, null);
                        a(this).append(g);
                        a.isFunction(this.p.afterRedraw) && this
                            .p
                            .afterRedraw
                            .call(this, this.p)
                    };
                    this.createTableForGroup = function (g, j) {
                        var b = this,
                            c,
                            k = a("<table class='group ui-widget ui-widget-content' style='border:0px none;'><tbody" +
                                    "></tbody></table>"),
                            e = "left";
                        "rtl" === this.p.direction && (e = "right", k.attr("dir", "rtl"));
                        null === j && k.append("<tr class='error' style='display:none;'><th colspan='5' class='ui-state-error' a" +
                                "lign='" + e + "'></th></tr>");
                        var h = a("<tr></tr>");
                        k.append(h);
                        e = a("<th colspan='5' align='" + e + "'></th>");
                        h.append(e);
                        if (!0 === this.p.ruleButtons) {
                            var d = a("<select class='opsel'></select>");
                            e.append(d);
                            var h = "",
                                i;
                            for (c = 0; c < n.groupOps.length; c++) 
                                i = g.groupOp === b.p.groupOps[c].op
                                    ? " selected='selected'"
                                    : "",
                                h += "<option value='" + b.p.groupOps[c].op + "'" + i + ">" + b.p.groupOps[c].text + "</option>";
                            d
                                .append(h)
                                .bind("change", function () {
                                    g.groupOp = a(d).val();
                                    b.onchange()
                                })
                        }
                        h = "<span></span>";
                        this.p.groupButton && (h = a("<input type='button' value='+ {}' title='Add subgroup' class='add-group'/>"), h.bind("click", function () {
                            if (g.groups === void 0) 
                                g.groups = [];
                            g
                                .groups
                                .push({groupOp: n.groupOps[0].op, rules: [], groups: []});
                            b.reDraw();
                            b.onchange();
                            return false
                        }));
                        e.append(h);
                        if (!0 === this.p.ruleButtons) {
                            var h = a("<input type='button' value='+' title='Add rule' class='add-rule ui-add'/>"),
                                f;
                            h.bind("click", function () {
                                if (g.rules === void 0) 
                                    g.rules = [];
                                for (c = 0; c < b.p.columns.length; c++) {
                                    var e = b.p.columns[c].search === void 0
                                            ? true
                                            : b.p.columns[c].search,
                                        j = b.p.columns[c].hidden === true;
                                    if (b.p.columns[c].searchoptions.searchhidden === true && e || e && !j) {
                                        f = b.p.columns[c];
                                        break
                                    }
                                }
                                e = f.searchoptions.sopt
                                    ? f.searchoptions.sopt
                                    : b.p.sopt
                                        ? b.p.sopt
                                        : a.inArray(f.searchtype, b.p.strarr) !== -1
                                            ? b.p.stropts
                                            : b.p.numopts;
                                g
                                    .rules
                                    .push({field: f.name, op: e[0], data: ""});
                                b.reDraw();
                                return false
                            });
                            e.append(h)
                        }
                        null !== j && (h = a("<input type='button' value='-' title='Delete group' class='delete-group'/>"), e.append(h), h.bind("click", function () {
                            for (c = 0; c < j.groups.length; c++) 
                                if (j.groups[c] === g) {
                                    j
                                        .groups
                                        .splice(c, 1);
                                    break
                                }
                            b.reDraw();
                            b.onchange();
                            return false
                        }));
                        if (void 0 !== g.groups) 
                            for (c = 0; c < g.groups.length; c++) 
                                e = a("<tr></tr>"),
                                k.append(e),
                                h = a("<td class='first'></td>"),
                                e.append(h),
                                h = a("<td colspan='4'></td>"),
                                h.append(this.createTableForGroup(g.groups[c], g)),
                                e.append(h);
                    void 0 === g.groupOp && (g.groupOp = b.p.groupOps[0].op);
                        if (void 0 !== g.rules) 
                            for (c = 0; c < g.rules.length; c++) 
                                k.append(this.createTableRowForRule(g.rules[c], g));
                    return k
                    };
                    this.createTableRowForRule = function (g, j) {
                        var b = this,
                            c = u(),
                            k = a("<tr></tr>"),
                            e,
                            h,
                            f,
                            i,
                            d = "",
                            p;
                        k.append("<td class='first'></td>");
                        var m = a("<td class='columns'></td>");
                        k.append(m);
                        var l = a("<select></select>"),
                            o,
                            q = [];
                        m.append(l);
                        l.bind("change", function () {
                            g.field = a(l).val();
                            f = a(this).parents("tr:first");
                            for (e = 0; e < b.p.columns.length; e++) 
                                if (b.p.columns[e].name === g.field) {
                                    i = b.p.columns[e];
                                    break
                                }
                            if (i) {
                                i.searchoptions.id = a
                                    .jgrid
                                    .randId();
                                t && "text" === i.inputtype && !i.searchoptions.size && (i.searchoptions.size = 10);
                                var d = a
                                    .jgrid
                                    .createEl
                                    .call(c, i.inputtype, i.searchoptions, "", !0, b.p.ajaxSelectOptions, !0);
                                a(d).addClass("input-elm");
                                h = i.searchoptions.sopt
                                    ? i.searchoptions.sopt
                                    : b.p.sopt
                                        ? b.p.sopt
                                        : -1 !== a.inArray(i.searchtype, b.p.strarr)
                                            ? b.p.stropts
                                            : b.p.numopts;
                                var j = "",
                                    k = 0;
                                q = [];
                                a.each(b.p.ops, function () {
                                    q.push(this.oper)
                                });
                                for (e = 0; e < h.length; e++) 
                                    o = a.inArray(h[e], q),
                                    -1 !== o && (0 === k && (g.op = b.p.ops[o].oper), j += "<option value='" + b.p.ops[o].oper + "'>" + b.p.ops[o].text + "</option>", k++);
                                a(".selectopts", f)
                                    .empty()
                                    .append(j);
                                a(".selectopts", f)[0].selectedIndex = 0;
                                a.jgrid.msie && 9 > a
                                    .jgrid
                                    .msiever() && (j = parseInt(a("select.selectopts", f)[0].offsetWidth, 10) + 1, a(".selectopts", f).width(j), a(".selectopts", f).css("width", "auto"));
                                a(".data", f)
                                    .empty()
                                    .append(d);
                                a
                                    .jgrid
                                    .bindEv
                                    .call(c, d, i.searchoptions);
                                a(".input-elm", f).bind("change", function (e) {
                                    var d = a(this).hasClass("ui-autocomplete-input")
                                        ? 200
                                        : 0;
                                    setTimeout(function () {
                                        var d = e.target;
                                        g.data = d
                                            .nodeName
                                            .toUpperCase() === "SPAN" && i.searchoptions && a.isFunction(i.searchoptions.custom_value)
                                            ? i
                                                .searchoptions
                                                .custom_value
                                                .call(c, a(d).children(".customelement:first"), "get")
                                            : d.value;
                                        b.onchange()
                                    }, d)
                                });
                                setTimeout(function () {
                                    g.data = a(d).val();
                                    b.onchange()
                                }, 0)
                            }
                        });
                        for (e = m = 0; e < b.p.columns.length; e++) {
                            p = void 0 === b.p.columns[e].search
                                ? !0
                                : b.p.columns[e].search;
                            var r = !0 === b.p.columns[e].hidden;
                            if (!0 === b.p.columns[e].searchoptions.searchhidden && p || p && !r) 
                                p = "",
                                g.field === b.p.columns[e].name && (p = " selected='selected'", m = e),
                                d += "<option value='" + b.p.columns[e].name + "'" + p + ">" + b.p.columns[e].label + "</option>"
                        }
                        l.append(d);
                        d = a("<td class='operators'></td>");
                        k.append(d);
                        i = n.columns[m];
                        i.searchoptions.id = a
                            .jgrid
                            .randId();
                        t && "text" === i.inputtype && !i.searchoptions.size && (i.searchoptions.size = 10);
                        m = a
                            .jgrid
                            .createEl
                            .call(c, i.inputtype, i.searchoptions, g.data, !0, b.p.ajaxSelectOptions, !0);
                        if ("nu" === g.op || "nn" === g.op) 
                            a(m).attr("readonly", "true"),
                            a(m).attr("disabled", "true");
                        var s = a("<select class='selectopts'></select>");
                        d.append(s);
                        s.bind("change", function () {
                            g.op = a(s).val();
                            f = a(this).parents("tr:first");
                            var c = a(".input-elm", f)[0];
                            if (g.op === "nu" || g.op === "nn") {
                                g.data = "";
                                c.value = "";
                                c.setAttribute("readonly", "true");
                                c.setAttribute("disabled", "true")
                            } else {
                                c.removeAttribute("readonly");
                                c.removeAttribute("disabled")
                            }
                            b.onchange()
                        });
                        h = i.searchoptions.sopt
                            ? i.searchoptions.sopt
                            : b.p.sopt
                                ? b.p.sopt
                                : -1 !== a.inArray(i.searchtype, b.p.strarr)
                                    ? b.p.stropts
                                    : b.p.numopts;
                        d = "";
                        a.each(b.p.ops, function () {
                            q.push(this.oper)
                        });
                        for (e = 0; e < h.length; e++) 
                            o = a.inArray(h[e], q),
                            -1 !== o && (p = g.op === b.p.ops[o].oper
                                ? " selected='selected'"
                                : "", d += "<option value='" + b.p.ops[o].oper + "'" + p + ">" + b.p.ops[o].text + "</option>");
                        s.append(d);
                        d = a("<td class='data'></td>");
                        k.append(d);
                        d.append(m);
                        a
                            .jgrid
                            .bindEv
                            .call(c, m, i.searchoptions);
                        a(m)
                            .addClass("input-elm")
                            .bind("change", function () {
                                g.data = i.inputtype === "custom"
                                    ? i
                                        .searchoptions
                                        .custom_value
                                        .call(c, a(this).children(".customelement:first"), "get")
                                    : a(this).val();
                                b.onchange()
                            });
                        d = a("<td></td>");
                        k.append(d);
                        !0 === this.p.ruleButtons && (m = a("<input type='button' value='-' title='Delete rule' class='delete-rule ui-del'/>"), d.append(m), m.bind("click", function () {
                            for (e = 0; e < j.rules.length; e++) 
                                if (j.rules[e] === g) {
                                    j
                                        .rules
                                        .splice(e, 1);
                                    break
                                }
                            b.reDraw();
                            b.onchange();
                            return false
                        }));
                        return k
                    };
                    this.getStringForGroup = function (a) {
                        var d = "(",
                            b;
                        if (void 0 !== a.groups) 
                            for (b = 0; b < a.groups.length; b++) {
                                1 < d.length && (d += " " + a.groupOp + " ");
                                try {
                                    d += this.getStringForGroup(a.groups[b])
                                } catch (c) {
                                    alert(c)
                                }
                            }
                        if (void 0 !== a.rules) 
                            try {
                                for (b = 0; b < a.rules.length; b++) 
                                    1 < d.length && (d += " " + a.groupOp + " "),
                                    d += this.getStringForRule(a.rules[b])
                            } catch (f) {
                                alert(f)
                            }
                        d += ")";
                        return "()" === d
                            ? ""
                            : d
                    };
                    this.getStringForRule = function (d) {
                        var f = "",
                            b = "",
                            c,
                            k;
                        for (c = 0; c < this.p.ops.length; c++) 
                            if (this.p.ops[c].oper === d.op) {
                                f = this
                                    .p
                                    .operands
                                    .hasOwnProperty(d.op)
                                    ? this.p.operands[d.op]
                                    : "";
                                b = this.p.ops[c].oper;
                                break
                            }
                        for (c = 0; c < this.p.columns.length; c++) 
                            if (this.p.columns[c].name === d.field) {
                                k = this.p.columns[c];
                                break
                            }
                        if (void 0 === k) 
                            return "";
                        c = d.data;
                        if ("bw" === b || "bn" === b) 
                            c += "%";
                        if ("ew" === b || "en" === b) 
                            c = "%" + c;
                        if ("cn" === b || "nc" === b) 
                            c = "%" + c + "%";
                        if ("in" === b || "ni" === b) 
                            c = " (" + c + ")";
                        n.errorcheck && r(d.data, k);
                        return -1 !== a.inArray(k.searchtype, ["int", "integer", "float", "number", "currency"]) || "nn" === b || "nu" === b
                            ? d.field + " " + f + " " + c
                            : d.field + " " + f + ' "' + c + '"'
                    };
                    this.resetFilter = function () {
                        this.p.filter = a.extend(!0, {}, this.p.initFilter);
                        this.reDraw();
                        this.onchange()
                    };
                    this.hideError = function () {
                        a("th.ui-state-error", this).html("");
                        a("tr.error", this).hide()
                    };
                    this.showError = function () {
                        a("th.ui-state-error", this).html(this.p.errmsg);
                        a("tr.error", this).show()
                    };
                    this.toUserFriendlyString = function () {
                        return this.getStringForGroup(n.filter)
                    };
                    this.toString = function () {
                        function a(b) {
                            var c = "(",
                                f;
                            if (void 0 !== b.groups) 
                                for (f = 0; f < b.groups.length; f++) 
                                    1 < c.length && (c = "OR" === b.groupOp
                                        ? c + " || "
                                        : c + " && "),
                                    c += a(b.groups[f]);
                        if (void 0 !== b.rules) 
                                for (f = 0; f < b.rules.length; f++) {
                                    1 < c.length && (c = "OR" === b.groupOp
                                        ? c + " || "
                                        : c + " && ");
                                    var e = b.rules[f];
                                    if (d.p.errorcheck) {
                                        for (var h = void 0, l = void 0, h = 0; h < d.p.columns.length; h++) 
                                            if (d.p.columns[h].name === e.field) {
                                                l = d.p.columns[h];
                                                break
                                            }
                                        l && r(e.data, l)
                                    }
                                    c += e.op + "(item." + e.field + ",'" + e.data + "')"
                                }
                            c += ")";
                            return "()" === c
                                ? ""
                                : c
                        }
                        var d = this;
                        return a(this.p.filter)
                    };
                    this.reDraw();
                    if (this.p.showQuery) 
                        this.onchange();
                    this.filter = !0
                }
            }
        })
    };
    a.extend(a.fn.jqFilter, {
        toSQLString: function () {
            var a = "";
            this.each(function () {
                a = this.toUserFriendlyString()
            });
            return a
        },
        filterData: function () {
            var a;
            this.each(function () {
                a = this.p.filter
            });
            return a
        },
        getParameter: function (a) {
            return void 0 !== a && this
                .p
                .hasOwnProperty(a)
                ? this.p[a]
                : this.p
        },
        resetFilter: function () {
            return this.each(function () {
                this.resetFilter()
            })
        },
        addFilter: function (d) {
            "string" === typeof d && (d = a.jgrid.parse(d));
            this.each(function () {
                this.p.filter = d;
                this.reDraw();
                this.onchange()
            })
        }
    })
})(jQuery);
(function (a) {
    a.jgrid.inlineEdit = a.jgrid.inlineEdit || {};
    a
        .jgrid
        .extend({
            editRow: function (c, b, e, o, l, g, n, h, f) {
                var j = {},
                    d = a
                        .makeArray(arguments)
                        .slice(1);
                if ("object" === a.type(d[0])) 
                    j = d[0];
                else if (void 0 !== b && (j.keys = b), a.isFunction(e) && (j.oneditfunc = e), a.isFunction(o) && (j.successfunc = o), void 0 !== l && (j.url = l), void 0 !== g && (j.extraparam = g), a.isFunction(n) && (j.aftersavefunc = n), a.isFunction(h) && (j.errorfunc = h), a.isFunction(f)) 
                    j.afterrestorefunc = f;
                j = a.extend(!0, {
                    keys: !1,
                    oneditfunc: null,
                    successfunc: null,
                    url: null,
                    extraparam: {},
                    aftersavefunc: null,
                    errorfunc: null,
                    afterrestorefunc: null,
                    restoreAfterError: !0,
                    mtype: "POST"
                }, a.jgrid.inlineEdit, j);
                return this.each(function () {
                    var d = this,
                        b,
                        f,
                        e = 0,
                        h = null,
                        l = {},
                        g,
                        k;
                    if (d.grid && (g = a(d).jqGrid("getInd", c, !0), !1 !== g && "0" === (a(g).attr("editable") || "0") && !a(g).hasClass("not-editable-row"))) 
                        k = d.p.colModel,
                        a('td[role="gridcell"]', g).each(function (g) {
                            b = k[g].name;
                            var j = !0 === d.p.treeGrid && b === d.p.ExpandColumn;
                            if (j) 
                                f = a("span:first", this).html();
                            else 
                                try {
                                    f = a
                                        .unformat
                                        .call(d, this, {
                                            rowId: c,
                                            colModel: k[g]
                                        }, g)
                                } catch (o) {
                                    f = k[g].edittype && "textarea" === k[g].edittype
                                        ? a(this).text()
                                        : a(this).html()
                                }
                            if ("cb" !== b && "subgrid" !== b && "rn" !== b && (d.p.autoencode && (f = a.jgrid.htmlDecode(f)), l[b] = f, !0 === k[g].editable)) {
                                null === h && (h = g);
                                j
                                    ? a("span:first", this).html("")
                                    : a(this).html("");
                                var x = a.extend({}, k[g].editoptions || {}, {
                                    id: c + "_" + b,
                                    name: b
                                });
                                k[g].edittype || (k[g].edittype = "text");
                                if ("&nbsp;" === f || "&#160;" === f || 1 === f.length && 160 === f.charCodeAt(0)) 
                                    f = "";
                                var v = a
                                    .jgrid
                                    .createEl
                                    .call(d, k[g].edittype, x, f, !0, a.extend({}, a.jgrid.ajaxOptions, d.p.ajaxSelectOptions || {}));
                                a(v).addClass("editable");
                                j
                                    ? a("span:first", this).append(v)
                                    : a(this).append(v);
                                a
                                    .jgrid
                                    .bindEv
                                    .call(d, v, x);
                                "select" === k[g].edittype && void 0 !== k[g].editoptions && !0 === k[g].editoptions.multiple && void 0 === k[g].editoptions.dataUrl && a.jgrid.msie && a(v).width(a(v).width());
                                e++
                            }
                        }),
                        0 < e && (l.id = c, d.p.savedRow.push(l), a(g).attr("editable", "1"), a("td:eq(" + h + ") input", g).focus(), !0 === j.keys && a(g).bind("keydown", function (f) {
                            if (27 === f.keyCode) {
                                a(d).jqGrid("restoreRow", c, j.afterrestorefunc);
                                if (d.p._inlinenav) 
                                    try {
                                        a(d).jqGrid("showAddEditButtons")
                                    } catch (b) {}
                                return !1
                            }
                            if (13 === f.keyCode) {
                                if ("TEXTAREA" === f.target.tagName) 
                                    return !0;
                                if (a(d).jqGrid("saveRow", c, j) && d.p._inlinenav) 
                                    try {
                                        a(d).jqGrid("showAddEditButtons")
                                    } catch (g) {}
                                return !1
                            }
                        }), a(d).triggerHandler("jqGridInlineEditRow", [c, j]), a.isFunction(j.oneditfunc) && j.oneditfunc.call(d, c))
                })
            },
            saveRow: function (c, b, e, o, l, g, n) {
                var h = a
                        .makeArray(arguments)
                        .slice(1),
                    f = {};
                if ("object" === a.type(h[0])) 
                    f = h[0];
                else if (a.isFunction(b) && (f.successfunc = b), void 0 !== e && (f.url = e), void 0 !== o && (f.extraparam = o), a.isFunction(l) && (f.aftersavefunc = l), a.isFunction(g) && (f.errorfunc = g), a.isFunction(n)) 
                    f.afterrestorefunc = n;
                var f = a.extend(!0, {
                        successfunc: null,
                        url: null,
                        extraparam: {},
                        aftersavefunc: null,
                        errorfunc: null,
                        afterrestorefunc: null,
                        restoreAfterError: !0,
                        mtype: "POST"
                    }, a.jgrid.inlineEdit, f),
                    j = !1,
                    d = this[0],
                    m,
                    i = {},
                    w = {},
                    r = {},
                    t,
                    s,
                    q;
                if (!d.grid) 
                    return j;
                q = a(d).jqGrid("getInd", c, !0);
                if (!1 === q) 
                    return j;
                h = a(q).attr("editable");
                f.url = f.url || d.p.editurl;
                if ("1" === h) {
                    var k;
                    a('td[role="gridcell"]', q).each(function (c) {
                        k = d.p.colModel[c];
                        m = k.name;
                        if ("cb" !== m && "subgrid" !== m && !0 === k.editable && "rn" !== m && !a(this).hasClass("not-editable-cell")) {
                            switch (k.edittype) {
                                case "checkbox":
                                    var b = ["Yes", "No"];
                                    k.editoptions && (b = k.editoptions.value.split(":"));
                                    i[m] = a("input", this).is(":checked")
                                        ? b[0]
                                        : b[1];
                                    break;
                                case "text":
                                case "psw":
                                case "textarea":
                                case "button":
                                    i[m] = a("input, textarea", this).val();
                                    break;
                                case "select":
                                    if (k.editoptions.multiple) {
                                        var b = a("select", this),
                                            g = [];
                                        i[m] = a(b).val();
                                        i[m] = i[m]
                                            ? i[m].join(",")
                                            : "";
                                        a("select option:selected", this).each(function (d, c) {
                                            g[d] = a(c).text()
                                        });
                                        w[m] = g.join(",")
                                    } else 
                                        i[m] = a("select option:selected", this).val(),
                                        w[m] = a("select option:selected", this).text();
                                    k.formatter && "select" === k.formatter && (w = {});
                                    break;
                                case "custom":
                                    try {
                                        if (k.editoptions && a.isFunction(k.editoptions.custom_value)) {
                                            if (i[m] = k.editoptions.custom_value.call(d, a(".customelement", this), "get"), void 0 === i[m]) 
                                                throw "e2";
                                            }
                                        else 
                                            throw "e1";
                                        }
                                    catch (e) {
                                        "e1" === e && a
                                            .jgrid
                                            .info_dialog(a.jgrid.errors.errcap, "function 'custom_value' " + a.jgrid.edit.msg.nodefined, a.jgrid.edit.bClose),
                                        "e2" === e
                                            ? a
                                                .jgrid
                                                .info_dialog(a.jgrid.errors.errcap, "function 'custom_value' " + a.jgrid.edit.msg.novalue, a.jgrid.edit.bClose)
                                            : a
                                                .jgrid
                                                .info_dialog(a.jgrid.errors.errcap, e.message, a.jgrid.edit.bClose)
                                    }
                            }
                            s = a
                                .jgrid
                                .checkValues
                                .call(d, i[m], c);
                            if (!1 === s[0]) 
                                return s[1] = i[m] + " " + s[1],
                                !1;
                            d.p.autoencode && (i[m] = a.jgrid.htmlEncode(i[m]));
                            "clientArray" !== f.url && k.editoptions && !0 === k.editoptions.NullIfEmpty && "" === i[m] && (r[m] = "null")
                        }
                    });
                    if (!1 === s[0]) {
                        try {
                            var u = d
                                    .rows
                                    .namedItem(c),
                                p = a
                                    .jgrid
                                    .findPos(u);
                            a
                                .jgrid
                                .info_dialog(a.jgrid.errors.errcap, s[1], a.jgrid.edit.bClose, {
                                    left: p[0],
                                    top: p[1] + a(u).outerHeight()
                                })
                        } catch (y) {
                            alert(s[1])
                        }
                        return j
                    }
                    h = d.p.prmNames;
                    u = c;
                    p = !1 === d.p.keyIndex
                        ? h.id
                        : d.p.colModel[d.p.keyIndex + (!0 === d.p.rownumbers
                                ? 1
                                : 0) + (!0 === d.p.multiselect
                                ? 1
                                : 0) + (!0 === d.p.subGrid
                                ? 1
                                : 0)].name;
                    if (i) {
                        i[h.oper] = h.editoper;
                        if (void 0 === i[p] || "" === i[p]) 
                            i[p] = c;
                        else if (q.id !== d.p.idPrefix + i[p] && (h = a.jgrid.stripPref(d.p.idPrefix, c), void 0 !== d.p._index[h] && (d.p._index[i[p]] = d.p._index[h], delete d.p._index[h]), c = d.p.idPrefix + i[p], a(q).attr("id", c), d.p.selrow === u && (d.p.selrow = c), a.isArray(d.p.selarrrow) && (h = a.inArray(u, d.p.selarrrow), 0 <= h && (d.p.selarrrow[h] = c)), d.p.multiselect)) 
                            h = "jqg_" + d.p.id + "_" + c,
                            a("input.cbox", q).attr("id", h).attr("name", h);
                        void 0 === d.p.inlineData && (d.p.inlineData = {});
                        i = a.extend({}, i, d.p.inlineData, f.extraparam)
                    }
                    if ("clientArray" === f.url) {
                        i = a.extend({}, i, w);
                        d.p.autoencode && a.each(i, function (d, c) {
                            i[d] = a
                                .jgrid
                                .htmlDecode(c)
                        });
                        h = a(d).jqGrid("setRowData", c, i);
                        a(q).attr("editable", "0");
                        for (p = 0; p < d.p.savedRow.length; p++) 
                            if ("" + d.p.savedRow[p].id === "" + u) {
                                t = p;
                                break
                            }
                        0 <= t && d
                            .p
                            .savedRow
                            .splice(t, 1);
                        a(d).triggerHandler("jqGridInlineAfterSaveRow", [c, h, i, f]);
                        a.isFunction(f.aftersavefunc) && f
                            .aftersavefunc
                            .call(d, c, h, f);
                        j = !0;
                        a(q)
                            .removeClass("jqgrid-new-row")
                            .unbind("keydown")
                    } else 
                        a("#lui_" + a.jgrid.jqID(d.p.id)).show(),
                        r = a.extend({}, i, r),
                        r[p] = a
                            .jgrid
                            .stripPref(d.p.idPrefix, r[p]),
                        a.ajax(a.extend({
                            url: f.url,
                            data: a.isFunction(d.p.serializeRowData)
                                ? d
                                    .p
                                    .serializeRowData
                                    .call(d, r)
                                : r,
                            type: f.mtype,
                            async: !1,
                            complete: function (b, g) {
                                a("#lui_" + a.jgrid.jqID(d.p.id)).hide();
                                if ("success" === g) {
                                    var e = !0,
                                        h;
                                    h = a(d).triggerHandler("jqGridInlineSuccessSaveRow", [b, c, f]);
                                    a.isArray(h) || (h = [
                                        !0,
                                        i
                                    ]);
                                    h[0] && a.isFunction(f.successfunc) && (h = f.successfunc.call(d, b));
                                    a.isArray(h)
                                        ? (e = h[0], i = h[1] || i)
                                        : e = h;
                                    if (!0 === e) {
                                        d.p.autoencode && a.each(i, function (d, c) {
                                            i[d] = a
                                                .jgrid
                                                .htmlDecode(c)
                                        });
                                        i = a.extend({}, i, w);
                                        a(d).jqGrid("setRowData", c, i);
                                        a(q).attr("editable", "0");
                                        for (e = 0; e < d.p.savedRow.length; e++) 
                                            if ("" + d.p.savedRow[e].id === "" + c) {
                                                t = e;
                                                break
                                            }
                                        0 <= t && d
                                            .p
                                            .savedRow
                                            .splice(t, 1);
                                        a(d).triggerHandler("jqGridInlineAfterSaveRow", [c, b, i, f]);
                                        a.isFunction(f.aftersavefunc) && f
                                            .aftersavefunc
                                            .call(d, c, b);
                                        j = !0;
                                        a(q)
                                            .removeClass("jqgrid-new-row")
                                            .unbind("keydown")
                                    } else 
                                        a(d).triggerHandler("jqGridInlineErrorSaveRow", [c, b, g, null, f]),
                                        a.isFunction(f.errorfunc) && f
                                            .errorfunc
                                            .call(d, c, b, g, null),
                                        !0 === f.restoreAfterError && a(d).jqGrid("restoreRow", c, f.afterrestorefunc)
                                }
                            },
                            error: function (b, e, g) {
                                a("#lui_" + a.jgrid.jqID(d.p.id)).hide();
                                a(d).triggerHandler("jqGridInlineErrorSaveRow", [c, b, e, g, f]);
                                if (a.isFunction(f.errorfunc)) 
                                    f.errorfunc.call(d, c, b, e, g);
                                else {
                                    b = b.responseText || b.statusText;
                                    try {
                                        a
                                            .jgrid
                                            .info_dialog(a.jgrid.errors.errcap, '<div class="ui-state-error">' + b + "</div>", a.jgrid.edit.bClose, {buttonalign: "right"})
                                    } catch (h) {
                                        alert(b)
                                    }
                                }
                                !0 === f.restoreAfterError && a(d).jqGrid("restoreRow", c, f.afterrestorefunc)
                            }
                        }, a.jgrid.ajaxOptions, d.p.ajaxRowOptions || {}))
                }
                return j
            },
            restoreRow: function (c, b) {
                var e = a
                        .makeArray(arguments)
                        .slice(1),
                    o = {};
                "object" === a.type(e[0])
                    ? o = e[0]
                    : a.isFunction(b) && (o.afterrestorefunc = b);
                o = a.extend(!0, {}, a.jgrid.inlineEdit, o);
                return this.each(function () {
                    var b = this,
                        e,
                        n,
                        h = {},
                        f;
                    if (b.grid) {
                        n = a(b).jqGrid("getInd", c, true);
                        if (n !== false) {
                            for (f = 0; f < b.p.savedRow.length; f++) 
                                if ("" + b.p.savedRow[f].id === "" + c) {
                                    e = f;
                                    break
                                }
                            if (e >= 0) {
                                if (a.isFunction(a.fn.datepicker)) 
                                    try {
                                        a("input.hasDatepicker", "#" + a.jgrid.jqID(n.id)).datepicker("hide")
                                    } catch (j) {}
                                a
                                    .each(b.p.colModel, function () {
                                        this.editable === true && b
                                            .p
                                            .savedRow[e]
                                            .hasOwnProperty(this.name) && (h[this.name] = b.p.savedRow[e][this.name])
                                    });
                                a(b).jqGrid("setRowData", c, h);
                                a(n)
                                    .attr("editable", "0")
                                    .unbind("keydown");
                                b
                                    .p
                                    .savedRow
                                    .splice(e, 1);
                                a("#" + a.jgrid.jqID(c), "#" + a.jgrid.jqID(b.p.id)).hasClass("jqgrid-new-row") && setTimeout(function () {
                                    a(b).jqGrid("delRowData", c);
                                    a(b).jqGrid("showAddEditButtons")
                                }, 0)
                            }
                            a(b).triggerHandler("jqGridInlineAfterRestoreRow", [c]);
                            a.isFunction(o.afterrestorefunc) && o
                                .afterrestorefunc
                                .call(b, c)
                        }
                    }
                })
            },
            addRow: function (c) {
                c = a.extend(!0, {
                    rowID: null,
                    initdata: {},
                    position: "first",
                    useDefValues: !0,
                    useFormatter: !1,
                    addRowParams: {
                        extraparam: {}
                    }
                }, c || {});
                return this.each(function () {
                    if (this.grid) {
                        var b = this;
                        c.rowID = a.isFunction(c.rowID)
                            ? c
                                .rowID
                                .call(b, c)
                            : null != c.rowID
                                ? c.rowID
                                : a
                                    .jgrid
                                    .randId();
                        !0 === c.useDefValues && a(b.p.colModel).each(function () {
                            if (this.editoptions && this.editoptions.defaultValue) {
                                var e = this.editoptions.defaultValue,
                                    e = a.isFunction(e)
                                        ? e.call(b)
                                        : e;
                                c.initdata[this.name] = e
                            }
                        });
                        a(b).jqGrid("addRowData", c.rowID, c.initdata, c.position);
                        c.rowID = b.p.idPrefix + c.rowID;
                        a("#" + a.jgrid.jqID(c.rowID), "#" + a.jgrid.jqID(b.p.id)).addClass("jqgrid-new-row");
                        if (c.useFormatter) 
                            a("#" + a.jgrid.jqID(c.rowID) + " .ui-inline-edit", "#" + a.jgrid.jqID(b.p.id)).click();
                        else {
                            var e = b.p.prmNames;
                            c.addRowParams.extraparam[e.oper] = e.addoper;
                            a(b).jqGrid("editRow", c.rowID, c.addRowParams);
                            a(b).jqGrid("setSelection", c.rowID)
                        }
                    }
                })
            },
            inlineNav: function (c, b) {
                b = a.extend(!0, {
                    edit: !0,
                    editicon: "ui-icon-pencil",
                    add: !0,
                    addicon: "ui-icon-plus",
                    save: !0,
                    saveicon: "ui-icon-disk",
                    cancel: !0,
                    cancelicon: "ui-icon-cancel",
                    addParams: {
                        addRowParams: {
                            extraparam: {}
                        }
                    },
                    editParams: {},
                    restoreAfterSelect: !0
                }, a.jgrid.nav, b || {});
                return this.each(function () {
                    if (this.grid) {
                        var e = this,
                            o,
                            l = a
                                .jgrid
                                .jqID(e.p.id);
                        e.p._inlinenav = !0;
                        if (!0 === b.addParams.useFormatter) {
                            var g = e.p.colModel,
                                n;
                            for (n = 0; n < g.length; n++) 
                                if (g[n].formatter && "actions" === g[n].formatter) {
                                    g[n].formatoptions && (g = a.extend({
                                        keys: !1,
                                        onEdit: null,
                                        onSuccess: null,
                                        afterSave: null,
                                        onError: null,
                                        afterRestore: null,
                                        extraparam: {},
                                        url: null
                                    }, g[n].formatoptions), b.addParams.addRowParams = {
                                        keys: g.keys,
                                        oneditfunc: g.onEdit,
                                        successfunc: g.onSuccess,
                                        url: g.url,
                                        extraparam: g.extraparam,
                                        aftersavefunc: g.afterSave,
                                        errorfunc: g.onError,
                                        afterrestorefunc: g.afterRestore
                                    });
                                    break
                                }
                            }
                        b.add && a(e).jqGrid("navButtonAdd", c, {
                            caption: b.addtext,
                            title: b.addtitle,
                            buttonicon: b.addicon,
                            id: e.p.id + "_iladd",
                            onClickButton: function () {
                                a(e).jqGrid("addRow", b.addParams);
                                b.addParams.useFormatter || (a("#" + l + "_ilsave").removeClass("ui-state-disabled"), a("#" + l + "_ilcancel").removeClass("ui-state-disabled"), a("#" + l + "_iladd").addClass("ui-state-disabled"), a("#" + l + "_iledit").addClass("ui-state-disabled"))
                            }
                        });
                        b.edit && a(e).jqGrid("navButtonAdd", c, {
                            caption: b.edittext,
                            title: b.edittitle,
                            buttonicon: b.editicon,
                            id: e.p.id + "_iledit",
                            onClickButton: function () {
                                var c = a(e).jqGrid("getGridParam", "selrow");
                                c
                                    ? (a(e).jqGrid("editRow", c, b.editParams), a("#" + l + "_ilsave").removeClass("ui-state-disabled"), a("#" + l + "_ilcancel").removeClass("ui-state-disabled"), a("#" + l + "_iladd").addClass("ui-state-disabled"), a("#" + l + "_iledit").addClass("ui-state-disabled"))
                                    : (a.jgrid.viewModal("#alertmod", {
                                        gbox: "#gbox_" + l,
                                        jqm: !0
                                    }), a("#jqg_alrt").focus())
                            }
                        });
                        b.save && (a(e).jqGrid("navButtonAdd", c, {
                            caption: b.savetext || "",
                            title: b.savetitle || "Save row",
                            buttonicon: b.saveicon,
                            id: e.p.id + "_ilsave",
                            onClickButton: function () {
                                var c = e.p.savedRow[0].id;
                                if (c) {
                                    var f = e.p.prmNames,
                                        g = f.oper,
                                        d = {};
                                    a("#" + a.jgrid.jqID(c), "#" + l).hasClass("jqgrid-new-row")
                                        ? (b.addParams.addRowParams.extraparam[g] = f.addoper, d = b.addParams.addRowParams)
                                        : (b.editParams.extraparam || (b.editParams.extraparam = {}), b.editParams.extraparam[g] = f.editoper, d = b.editParams);
                                    a(e).jqGrid("saveRow", c, d) && a(e).jqGrid("showAddEditButtons")
                                } else 
                                    a
                                        .jgrid
                                        .viewModal("#alertmod", {
                                            gbox: "#gbox_" + l,
                                            jqm: !0
                                        }),
                                    a("#jqg_alrt").focus()
                            }
                        }), a("#" + l + "_ilsave").addClass("ui-state-disabled"));
                        b.cancel && (a(e).jqGrid("navButtonAdd", c, {
                            caption: b.canceltext || "",
                            title: b.canceltitle || "Cancel row editing",
                            buttonicon: b.cancelicon,
                            id: e.p.id + "_ilcancel",
                            onClickButton: function () {
                                var c = e.p.savedRow[0].id,
                                    f = {};
                                if (c) {
                                    f = a("#" + a.jgrid.jqID(c), "#" + l).hasClass("jqgrid-new-row")
                                        ? b.addParams.addRowParams
                                        : b.editParams;
                                    a(e).jqGrid("restoreRow", c, f);
                                    a(e).jqGrid("showAddEditButtons")
                                } else {
                                    a
                                        .jgrid
                                        .viewModal("#alertmod", {
                                            gbox: "#gbox_" + l,
                                            jqm: true
                                        });
                                    a("#jqg_alrt").focus()
                                }
                            }
                        }), a("#" + l + "_ilcancel").addClass("ui-state-disabled"));
                        !0 === b.restoreAfterSelect && (o = a.isFunction(e.p.beforeSelectRow)
                            ? e.p.beforeSelectRow
                            : !1, e.p.beforeSelectRow = function (c, f) {
                            var g = true;
                            if (e.p.savedRow.length > 0 && e.p._inlinenav === true && c !== e.p.selrow && e.p.selrow !== null) {
                                e.p.selrow === b.addParams.rowID
                                    ? a(e).jqGrid("delRowData", e.p.selrow)
                                    : a(e).jqGrid("restoreRow", e.p.selrow, b.editParams);
                                a(e).jqGrid("showAddEditButtons")
                            }
                            o && (g = o.call(e, c, f));
                            return g
                        })
                    }
                })
            },
            showAddEditButtons: function () {
                return this.each(function () {
                    if (this.grid) {
                        var c = a
                            .jgrid
                            .jqID(this.p.id);
                        a("#" + c + "_ilsave").addClass("ui-state-disabled");
                        a("#" + c + "_ilcancel").addClass("ui-state-disabled");
                        a("#" + c + "_iladd").removeClass("ui-state-disabled");
                        a("#" + c + "_iledit").removeClass("ui-state-disabled")
                    }
                })
            }
        })
})(jQuery);
(function (b) {
    b
        .jgrid
        .extend({
            editCell: function (d, f, a) {
                return this.each(function () {
                    var c = this,
                        g,
                        e,
                        h,
                        i;
                    if (c.grid && !0 === c.p.cellEdit) {
                        f = parseInt(f, 10);
                        c.p.selrow = c.rows[d].id;
                        c.p.knv || b(c).jqGrid("GridNav");
                        if (0 < c.p.savedRow.length) {
                            if (!0 === a && d == c.p.iRow && f == c.p.iCol) 
                                return;
                            b(c).jqGrid("saveCell", c.p.savedRow[0].id, c.p.savedRow[0].ic)
                        } else 
                            window
                                .setTimeout(function () {
                                    b("#" + b.jgrid.jqID(c.p.knv))
                                        .attr("tabindex", "-1")
                                        .focus()
                                }, 0);
                        i = c.p.colModel[f];
                        g = i.name;
                        if (!("subgrid" === g || "cb" === g || "rn" === g)) {
                            h = b("td:eq(" + f + ")", c.rows[d]);
                            if (!0 === i.editable && !0 === a && !h.hasClass("not-editable-cell")) {
                                0 <= parseInt(c.p.iCol, 10) && 0 <= parseInt(c.p.iRow, 10) && (b("td:eq(" + c.p.iCol + ")", c.rows[c.p.iRow]).removeClass("edit-cell ui-state-highlight"), b(c.rows[c.p.iRow]).removeClass("selected-row ui-state-hover"));
                                b(h).addClass("edit-cell ui-state-highlight");
                                b(c.rows[d]).addClass("selected-row ui-state-hover");
                                try {
                                    e = b
                                        .unformat
                                        .call(c, h, {
                                            rowId: c.rows[d].id,
                                            colModel: i
                                        }, f)
                                } catch (k) {
                                    e = i.edittype && "textarea" === i.edittype
                                        ? b(h).text()
                                        : b(h).html()
                                }
                                c.p.autoencode && (e = b.jgrid.htmlDecode(e));
                                i.edittype || (i.edittype = "text");
                                c
                                    .p
                                    .savedRow
                                    .push({id: d, ic: f, name: g, v: e});
                                if ("&nbsp;" === e || "&#160;" === e || 1 === e.length && 160 === e.charCodeAt(0)) 
                                    e = "";
                                if (b.isFunction(c.p.formatCell)) {
                                    var j = c
                                        .p
                                        .formatCell
                                        .call(c, c.rows[d].id, g, e, d, f);
                                    void 0 !== j && (e = j)
                                }
                                var j = b.extend({}, i.editoptions || {}, {
                                        id: d + "_" + g,
                                        name: g
                                    }),
                                    n = b
                                        .jgrid
                                        .createEl
                                        .call(c, i.edittype, j, e, !0, b.extend({}, b.jgrid.ajaxOptions, c.p.ajaxSelectOptions || {}));
                                b(c).triggerHandler("jqGridBeforeEditCell", [c.rows[d].id, g, e, d, f]);
                                b.isFunction(c.p.beforeEditCell) && c
                                    .p
                                    .beforeEditCell
                                    .call(c, c.rows[d].id, g, e, d, f);
                                b(h)
                                    .html("")
                                    .append(n)
                                    .attr("tabindex", "0");
                                b
                                    .jgrid
                                    .bindEv
                                    .call(c, n, j);
                                window.setTimeout(function () {
                                    b(n).focus()
                                }, 0);
                                b("input, select, textarea", h).bind("keydown", function (a) {
                                    a.keyCode === 27 && (b("input.hasDatepicker", h).length > 0
                                        ? b(".ui-datepicker").is(":hidden")
                                            ? b(c).jqGrid("restoreCell", d, f)
                                            : b("input.hasDatepicker", h).datepicker("hide")
                                        : b(c).jqGrid("restoreCell", d, f));
                                    if (a.keyCode === 13) {
                                        b(c).jqGrid("saveCell", d, f);
                                        return false
                                    }
                                    if (a.keyCode === 9) {
                                        if (c.grid.hDiv.loading) 
                                            return false;
                                        a.shiftKey
                                            ? b(c).jqGrid("prevCell", d, f)
                                            : b(c).jqGrid("nextCell", d, f)
                                    }
                                    a.stopPropagation()
                                });
                                b(c).triggerHandler("jqGridAfterEditCell", [c.rows[d].id, g, e, d, f]);
                                b.isFunction(c.p.afterEditCell) && c
                                    .p
                                    .afterEditCell
                                    .call(c, c.rows[d].id, g, e, d, f)
                            } else 
                                0 <= parseInt(c.p.iCol, 10) && 0 <= parseInt(c.p.iRow, 10) && (b("td:eq(" + c.p.iCol + ")", c.rows[c.p.iRow]).removeClass("edit-cell ui-state-highlight"), b(c.rows[c.p.iRow]).removeClass("selected-row ui-state-hover")),
                                h.addClass("edit-cell ui-state-highlight"),
                                b(c.rows[d]).addClass("selected-row ui-state-hover"),
                                e = h
                                    .html()
                                    .replace(/\&#160\;/ig, ""),
                                b(c).triggerHandler("jqGridSelectCell", [c.rows[d].id, g, e, d, f]),
                                b.isFunction(c.p.onSelectCell) && c
                                    .p
                                    .onSelectCell
                                    .call(c, c.rows[d].id, g, e, d, f);
                            c.p.iCol = f;
                            c.p.iRow = d
                        }
                    }
                })
            },
            saveCell: function (d, f) {
                return this.each(function () {
                    var a = this,
                        c;
                    if (a.grid && !0 === a.p.cellEdit) {
                        c = 1 <= a.p.savedRow.length
                            ? 0
                            : null;
                        if (null !== c) {
                            var g = b("td:eq(" + f + ")", a.rows[d]),
                                e,
                                h,
                                i = a.p.colModel[f],
                                k = i.name,
                                j = b
                                    .jgrid
                                    .jqID(k);
                            switch (i.edittype) {
                                case "select":
                                    if (i.editoptions.multiple) {
                                        var j = b("#" + d + "_" + j, a.rows[d]),
                                            n = [];
                                        (e = b(j).val())
                                            ? e.join(",")
                                            : e = "";
                                        b("option:selected", j).each(function (a, c) {
                                            n[a] = b(c).text()
                                        });
                                        h = n.join(",")
                                    } else 
                                        e = b("#" + d + "_" + j + " option:selected", a.rows[d]).val(),
                                        h = b("#" + d + "_" + j + " option:selected", a.rows[d]).text();
                                    i.formatter && (h = e);
                                    break;
                                case "checkbox":
                                    var l = ["Yes", "No"];
                                    i.editoptions && (l = i.editoptions.value.split(":"));
                                    h = e = b("#" + d + "_" + j, a.rows[d]).is(":checked")
                                        ? l[0]
                                        : l[1];
                                    break;
                                case "psw":
                                case "text":
                                case "textarea":
                                case "button":
                                    h = e = b("#" + d + "_" + j, a.rows[d]).val();
                                    break;
                                case "custom":
                                    try {
                                        if (i.editoptions && b.isFunction(i.editoptions.custom_value)) {
                                            e = i
                                                .editoptions
                                                .custom_value
                                                .call(a, b(".customelement", g), "get");
                                            if (void 0 === e) 
                                                throw "e2";
                                            h = e
                                        } else 
                                            throw "e1";
                                        }
                                    catch (o) {
                                        "e1" === o && b
                                            .jgrid
                                            .info_dialog(b.jgrid.errors.errcap, "function 'custom_value' " + b.jgrid.edit.msg.nodefined, b.jgrid.edit.bClose),
                                        "e2" === o
                                            ? b
                                                .jgrid
                                                .info_dialog(b.jgrid.errors.errcap, "function 'custom_value' " + b.jgrid.edit.msg.novalue, b.jgrid.edit.bClose)
                                            : b
                                                .jgrid
                                                .info_dialog(b.jgrid.errors.errcap, o.message, b.jgrid.edit.bClose)
                                    }
                            }
                            if (h !== a.p.savedRow[c].v) {
                                if (c = b(a).triggerHandler("jqGridBeforeSaveCell", [a.rows[d].id, k, e, d, f])) 
                                    h = e = c;
                                if (b.isFunction(a.p.beforeSaveCell) && (c = a.p.beforeSaveCell.call(a, a.rows[d].id, k, e, d, f))) 
                                    h = e = c;
                                var p = b
                                    .jgrid
                                    .checkValues
                                    .call(a, e, f);
                                if (!0 === p[0]) {
                                    c = b(a).triggerHandler("jqGridBeforeSubmitCell", [a.rows[d].id, k, e, d, f]) || {};
                                    b.isFunction(a.p.beforeSubmitCell) && ((c = a.p.beforeSubmitCell.call(a, a.rows[d].id, k, e, d, f)) || (c = {}));
                                    0 < b("input.hasDatepicker", g).length && b("input.hasDatepicker", g).datepicker("hide");
                                    if ("remote" === a.p.cellsubmit) 
                                        if (a.p.cellurl) {
                                            var m = {};
                                            a.p.autoencode && (e = b.jgrid.htmlEncode(e));
                                            m[k] = e;
                                            l = a.p.prmNames;
                                            i = l.id;
                                            j = l.oper;
                                            m[i] = b
                                                .jgrid
                                                .stripPref(a.p.idPrefix, a.rows[d].id);
                                            m[j] = l.editoper;
                                            m = b.extend(c, m);
                                            b("#lui_" + b.jgrid.jqID(a.p.id)).show();
                                            a.grid.hDiv.loading = !0;
                                            b.ajax(b.extend({
                                                url: a.p.cellurl,
                                                data: b.isFunction(a.p.serializeCellData)
                                                    ? a
                                                        .p
                                                        .serializeCellData
                                                        .call(a, m)
                                                    : m,
                                                type: "POST",
                                                complete: function (c, i) {
                                                    b("#lui_" + a.p.id).hide();
                                                    a.grid.hDiv.loading = false;
                                                    if (i === "success") {
                                                        var j = b(a).triggerHandler("jqGridAfterSubmitCell", [
                                                            a,
                                                            c,
                                                            m.id,
                                                            k,
                                                            e,
                                                            d,
                                                            f
                                                        ]) || [true, ""];
                                                        j[0] === true && b.isFunction(a.p.afterSubmitCell) && (j = a.p.afterSubmitCell.call(a, c, m.id, k, e, d, f));
                                                        if (j[0] === true) {
                                                            b(g).empty();
                                                            b(a).jqGrid("setCell", a.rows[d].id, f, h, false, false, true);
                                                            b(g).addClass("dirty-cell");
                                                            b(a.rows[d]).addClass("edited");
                                                            b(a).triggerHandler("jqGridAfterSaveCell", [a.rows[d].id, k, e, d, f]);
                                                            b.isFunction(a.p.afterSaveCell) && a
                                                                .p
                                                                .afterSaveCell
                                                                .call(a, a.rows[d].id, k, e, d, f);
                                                            a
                                                                .p
                                                                .savedRow
                                                                .splice(0, 1)
                                                        } else {
                                                            b
                                                                .jgrid
                                                                .info_dialog(b.jgrid.errors.errcap, j[1], b.jgrid.edit.bClose);
                                                            b(a).jqGrid("restoreCell", d, f)
                                                        }
                                                    }
                                                },
                                                error: function (c, e, h) {
                                                    b("#lui_" + b.jgrid.jqID(a.p.id)).hide();
                                                    a.grid.hDiv.loading = false;
                                                    b(a).triggerHandler("jqGridErrorCell", [c, e, h]);
                                                    b.isFunction(a.p.errorCell)
                                                        ? a
                                                            .p
                                                            .errorCell
                                                            .call(a, c, e, h)
                                                        : b
                                                            .jgrid
                                                            .info_dialog(b.jgrid.errors.errcap, c.status + " : " + c.statusText + "<br/>" + e, b.jgrid.edit.bClose);
                                                    b(a).jqGrid("restoreCell", d, f)
                                                }
                                            }, b.jgrid.ajaxOptions, a.p.ajaxCellOptions || {}))
                                        } else 
                                            try {
                                                b
                                                    .jgrid
                                                    .info_dialog(b.jgrid.errors.errcap, b.jgrid.errors.nourl, b.jgrid.edit.bClose),
                                                b(a).jqGrid("restoreCell", d, f)
                                            } catch (q) {}
                                        "clientArray" === a.p.cellsubmit && (b(g).empty(), b(a).jqGrid("setCell", a.rows[d].id, f, h, !1, !1, !0), b(g).addClass("dirty-cell"), b(a.rows[d]).addClass("edited"), b(a).triggerHandler("jqGridAfterSaveCell", [a.rows[d].id, k, e, d, f]), b.isFunction(a.p.afterSaveCell) && a.p.afterSaveCell.call(a, a.rows[d].id, k, e, d, f), a.p.savedRow.splice(0, 1))
                                } else 
                                    try {
                                        window
                                            .setTimeout(function () {
                                                b
                                                    .jgrid
                                                    .info_dialog(b.jgrid.errors.errcap, e + " " + p[1], b.jgrid.edit.bClose)
                                            }, 100),
                                        b(a).jqGrid("restoreCell", d, f)
                                    } catch (r) {}
                                } else 
                                b(a).jqGrid("restoreCell", d, f)
                        }
                        window
                            .setTimeout(function () {
                                b("#" + b.jgrid.jqID(a.p.knv))
                                    .attr("tabindex", "-1")
                                    .focus()
                            }, 0)
                    }
                })
            },
            restoreCell: function (d, f) {
                return this.each(function () {
                    var a = this,
                        c;
                    if (a.grid && !0 === a.p.cellEdit) {
                        c = 1 <= a.p.savedRow.length
                            ? 0
                            : null;
                        if (null !== c) {
                            var g = b("td:eq(" + f + ")", a.rows[d]);
                            if (b.isFunction(b.fn.datepicker)) 
                                try {
                                    b("input.hasDatepicker", g).datepicker("hide")
                                } catch (e) {}
                            b(g)
                                .empty()
                                .attr("tabindex", "-1");
                            b(a).jqGrid("setCell", a.rows[d].id, f, a.p.savedRow[c].v, !1, !1, !0);
                            b(a).triggerHandler("jqGridAfterRestoreCell", [a.rows[d].id, a.p.savedRow[c].v, d, f]);
                            b.isFunction(a.p.afterRestoreCell) && a
                                .p
                                .afterRestoreCell
                                .call(a, a.rows[d].id, a.p.savedRow[c].v, d, f);
                            a
                                .p
                                .savedRow
                                .splice(0, 1)
                        }
                        window
                            .setTimeout(function () {
                                b("#" + a.p.knv)
                                    .attr("tabindex", "-1")
                                    .focus()
                            }, 0)
                    }
                })
            },
            nextCell: function (d, f) {
                return this.each(function () {
                    var a = !1,
                        c;
                    if (this.grid && !0 === this.p.cellEdit) {
                        for (c = f + 1; c < this.p.colModel.length; c++) 
                            if (!0 === this.p.colModel[c].editable) {
                                a = c;
                                break
                            }
                        !1 !== a
                            ? b(this).jqGrid("editCell", d, a, !0)
                            : 0 < this.p.savedRow.length && b(this).jqGrid("saveCell", d, f)
                    }
                })
            },
            prevCell: function (d, f) {
                return this.each(function () {
                    var a = !1,
                        c;
                    if (this.grid && !0 === this.p.cellEdit) {
                        for (c = f - 1; 0 <= c; c--) 
                            if (!0 === this.p.colModel[c].editable) {
                                a = c;
                                break
                            }
                        !1 !== a
                            ? b(this).jqGrid("editCell", d, a, !0)
                            : 0 < this.p.savedRow.length && b(this).jqGrid("saveCell", d, f)
                    }
                })
            },
            GridNav: function () {
                return this.each(function () {
                    function d(c, d, e) {
                        if ("v" === e.substr(0, 1)) {
                            var f = b(a.grid.bDiv)[0].clientHeight,
                                g = b(a.grid.bDiv)[0].scrollTop,
                                l = a.rows[c].offsetTop + a.rows[c].clientHeight,
                                o = a.rows[c].offsetTop;
                            "vd" === e && l >= f && (b(a.grid.bDiv)[0].scrollTop = b(a.grid.bDiv)[0].scrollTop + a.rows[c].clientHeight);
                            "vu" === e && o < g && (b(a.grid.bDiv)[0].scrollTop = b(a.grid.bDiv)[0].scrollTop - a.rows[c].clientHeight)
                        }
                        "h" === e && (e = b(a.grid.bDiv)[0].clientWidth,
                        f = b(a.grid.bDiv)[0].scrollLeft,
                        g = a.rows[c].cells[d].offsetLeft,
                        a.rows[c].cells[d].offsetLeft + a.rows[c].cells[d].clientWidth >= e + parseInt(f, 10)
                            ? b(a.grid.bDiv)[0].scrollLeft = b(a.grid.bDiv)[0].scrollLeft + a.rows[c].cells[d].clientWidth
                            : g < f && (b(a.grid.bDiv)[0].scrollLeft = b(a.grid.bDiv)[0].scrollLeft - a.rows[c].cells[d].clientWidth))
                    }
                    function f(b, c) {
                        var d,
                            e;
                        if ("lft" === c) {
                            d = b + 1;
                            for (e = b; 0 <= e; e--) 
                                if (!0 !== a.p.colModel[e].hidden) {
                                    d = e;
                                    break
                                }
                            }
                        if ("rgt" === c) {
                            d = b - 1;
                            for (e = b; e < a.p.colModel.length; e++) 
                                if (!0 !== a.p.colModel[e].hidden) {
                                    d = e;
                                    break
                                }
                            }
                        return d
                    }
                    var a = this;
                    if (a.grid && !0 === a.p.cellEdit) {
                        a.p.knv = a.p.id + "_kn";
                        var c = b("<div style='position:fixed;top:0px;width:1px;height:1px;' tabindex='0'><div tabi" +
                                    "ndex='-1' style='width:1px;height:1px;' id='" + a.p.knv + "'></div></div>"),
                            g,
                            e;
                        b(c).insertBefore(a.grid.cDiv);
                        b("#" + a.p.knv)
                            .focus()
                            .keydown(function (c) {
                                e = c.keyCode;
                                "rtl" === a.p.direction && (37 === e
                                    ? e = 39
                                    : 39 === e && (e = 37));
                                switch (e) {
                                    case 38:
                                        0 < a.p.iRow - 1 && (d(a.p.iRow - 1, a.p.iCol, "vu"), b(a).jqGrid("editCell", a.p.iRow - 1, a.p.iCol, !1));
                                        break;
                                    case 40:
                                        a.p.iRow + 1 <= a.rows.length - 1 && (d(a.p.iRow + 1, a.p.iCol, "vd"), b(a).jqGrid("editCell", a.p.iRow + 1, a.p.iCol, !1));
                                        break;
                                    case 37:
                                        0 <= a.p.iCol - 1 && (g = f(a.p.iCol - 1, "lft"), d(a.p.iRow, g, "h"), b(a).jqGrid("editCell", a.p.iRow, g, !1));
                                        break;
                                    case 39:
                                        a.p.iCol + 1 <= a.p.colModel.length - 1 && (g = f(a.p.iCol + 1, "rgt"), d(a.p.iRow, g, "h"), b(a).jqGrid("editCell", a.p.iRow, g, !1));
                                        break;
                                    case 13:
                                        0 <= parseInt(a.p.iCol, 10) && 0 <= parseInt(a.p.iRow, 10) && b(a).jqGrid("editCell", a.p.iRow, a.p.iCol, !0);
                                        break;
                                    default:
                                        return !0
                                }
                                return !1
                            })
                    }
                })
            },
            getChangedCells: function (d) {
                var f = [];
                d || (d = "all");
                this.each(function () {
                    var a = this,
                        c;
                    a.grid && !0 === a.p.cellEdit && b(a.rows).each(function (g) {
                        var e = {};
                        b(this).hasClass("edited") && (b("td", this).each(function (f) {
                            c = a.p.colModel[f].name;
                            if ("cb" !== c && "subgrid" !== c) 
                                if ("dirty" === d) {
                                    if (b(this).hasClass("dirty-cell")) 
                                        try {
                                            e[c] = b
                                                .unformat
                                                .call(a, this, {
                                                    rowId: a.rows[g].id,
                                                    colModel: a.p.colModel[f]
                                                }, f)
                                        } catch (i) {
                                            e[c] = b
                                                .jgrid
                                                .htmlDecode(b(this).html())
                                        }
                                    } else 
                                    try {
                                        e[c] = b
                                            .unformat
                                            .call(a, this, {
                                                rowId: a.rows[g].id,
                                                colModel: a.p.colModel[f]
                                            }, f)
                                    } catch (k) {
                                        e[c] = b
                                            .jgrid
                                            .htmlDecode(b(this).html())
                                    }
                                }), e.id = this.id, f.push(e))
                    })
                });
                return f
            }
        })
})(jQuery);
(function (c) {
    c.fn.jqm = function (a) {
        var i = {
            overlay: 50,
            closeoverlay: !0,
            overlayClass: "jqmOverlay",
            closeClass: "jqmClose",
            trigger: ".jqModal",
            ajax: d,
            ajaxText: "",
            target: d,
            modal: d,
            toTop: d,
            onShow: d,
            onHide: d,
            onLoad: d
        };
        return this.each(function () {
            if (this._jqm) 
                return j[this._jqm].c = c.extend({}, j[this._jqm].c, a);
            l++;
            this._jqm = l;
            j[l] = {
                c: c.extend(i, c.jqm.params, a),
                a: d,
                w: c(this).addClass("jqmID" + l),
                s: l
            };
            i.trigger && c(this).jqmAddTrigger(i.trigger)
        })
    };
    c.fn.jqmAddClose = function (a) {
        return o(this, a, "jqmHide")
    };
    c.fn.jqmAddTrigger = function (a) {
        return o(this, a, "jqmShow")
    };
    c.fn.jqmShow = function (a) {
        return this.each(function () {
            c
                .jqm
                .open(this._jqm, a)
        })
    };
    c.fn.jqmHide = function (a) {
        return this.each(function () {
            c
                .jqm
                .close(this._jqm, a)
        })
    };
    c.jqm = {
        hash: {},
        open: function (a, i) {
            var b = j[a],
                e = b.c,
                h = "." + e.closeClass,
                f = parseInt(b.w.css("z-index")),
                f = 0 < f
                    ? f
                    : 3E3,
                g = c("<div></div>").css({
                    height: "100%",
                    width: "100%",
                    position: "fixed",
                    left: 0,
                    top: 0,
                    "z-index": f - 1,
                    opacity: e.overlay / 100
                });
            if (b.a) 
                return d;
            b.t = i;
            b.a = !0;
            b
                .w
                .css("z-index", f);
            e.modal
                ? (k[0] || setTimeout(function () {
                    p("bind")
                }, 1), k.push(a))
                : 0 < e.overlay
                    ? e.closeoverlay && b
                        .w
                        .jqmAddClose(g)
                    : g = d;
            b.o = g
                ? g
                    .addClass(e.overlayClass)
                    .prependTo("body")
                : d;
            e.ajax
                ? (f = e.target || b.w, g = e.ajax, f = "string" == typeof f
                    ? c(f, b.w)
                    : c(f), g = "@" == g.substr(0, 1)
                    ? c(i).attr(g.substring(1))
                    : g, f.html(e.ajaxText).load(g, function () {
                    e.onLoad && e
                        .onLoad
                        .call(this, b);
                    h && b
                        .w
                        .jqmAddClose(c(h, b.w));
                    m(b)
                }))
                : h && b
                    .w
                    .jqmAddClose(c(h, b.w));
            e.toTop && b.o && b
                .w
                .before('<span id="jqmP' + b.w[0]._jqm + '"></span>')
                .insertAfter(b.o);
            e.onShow
                ? e.onShow(b)
                : b
                    .w
                    .show();
            m(b);
            return d
        },
        close: function (a) {
            a = j[a];
            if (!a.a) 
                return d;
            a.a = d;
            k[0] && (k.pop(), k[0] || p("unbind"));
            a.c.toTop && a.o && c("#jqmP" + a.w[0]._jqm)
                .after(a.w)
                .remove();
            if (a.c.onHide) 
                a.c.onHide(a);
            else 
                a
                    .w
                    .hide(),
                a.o && a
                    .o
                    .remove();
            return d
        },
        params: {}
    };
    var l = 0,
        j = c.jqm.hash,
        k = [],
        d = !1,
        m = function (a) {
            try {
                c(":input:visible", a.w)[0].focus()
            } catch (d) {}
        },
        p = function (a) {
            c(document)[a]("keypress", n)[a]("keydown", n)[a]("mousedown", n)
        },
        n = function (a) {
            var d = j[k[k.length - 1]],
                b = !c(a.target).parents(".jqmID" + d.s)[0];
            b && (c(".jqmID" + d.s).each(function () {
                var d = c(this),
                    h = d.offset();
                if (h.top <= a.pageY && a.pageY <= h.top + d.height() && h.left <= a.pageX && a.pageX <= h.left + d.width()) 
                    return b = !1
            }), m(d));
            return !b
        },
        o = function (a, i, b) {
            return a.each(function () {
                var a = this._jqm;
                c(i).each(function () {
                    this[b] || (this[b] = [], c(this).click(function () {
                        for (var a in {jqmShow: 1, jqmHide: 1}) 
                            for (var b in this[a]) 
                                if (j[this[a][b]]) 
                                    j[this[a][b]].w[a](this);
                    return d
                    }));
                    this[b].push(a)
                })
            })
        }
})(jQuery);
(function (b) {
    b.fn.jqDrag = function (a) {
        return h(this, a, "d")
    };
    b.fn.jqResize = function (a, b) {
        return h(this, a, "r", b)
    };
    b.jqDnR = {
        dnr: {},
        e: 0,
        drag: function (a) {
            "d" == d.k
                ? e.css({
                    left: d.X + a.pageX - d.pX,
                    top: d.Y + a.pageY - d.pY
                })
                : (e.css({
                    width: Math.max(a.pageX - d.pX + d.W, 0),
                    height: Math.max(a.pageY - d.pY + d.H, 0)
                }), f && g.css({
                    width: Math.max(a.pageX - f.pX + f.W, 0),
                    height: Math.max(a.pageY - f.pY + f.H, 0)
                }));
            return !1
        },
        stop: function () {
            b(document)
                .unbind("mousemove", c.drag)
                .unbind("mouseup", c.stop)
        }
    };
    var c = b.jqDnR,
        d = c.dnr,
        e = c.e,
        g,
        f,
        h = function (a, c, h, l) {
            return a.each(function () {
                c = c
                    ? b(c, a)
                    : a;
                c.bind("mousedown", {
                    e: a,
                    k: h
                }, function (a) {
                    var c = a.data,
                        i = {};
                    e = c.e;
                    g = l
                        ? b(l)
                        : !1;
                    if ("relative" != e.css("position")) 
                        try {
                            e.position(i)
                        } catch (h) {}
                    d = {
                        X: i.left || j("left") || 0,
                        Y: i.top || j("top") || 0,
                        W: j("width") || e[0].scrollWidth || 0,
                        H: j("height") || e[0].scrollHeight || 0,
                        pX: a.pageX,
                        pY: a.pageY,
                        k: c.k
                    };
                    f = g && "d" != c.k
                        ? {
                            X: i.left || k("left") || 0,
                            Y: i.top || k("top") || 0,
                            W: g[0].offsetWidth || k("width") || 0,
                            H: g[0].offsetHeight || k("height") || 0,
                            pX: a.pageX,
                            pY: a.pageY,
                            k: c.k
                        }
                        : !1;
                    if (b("input.hasDatepicker", e[0])[0]) 
                        try {
                            b("input.hasDatepicker", e[0]).datepicker("hide")
                        } catch (m) {}
                    b(document)
                        .mousemove(b.jqDnR.drag)
                        .mouseup(b.jqDnR.stop);
                    return !1
                })
            })
        },
        j = function (a) {
            return parseInt(e.css(a), 10) || !1
        },
        k = function (a) {
            return parseInt(g.css(a), 10) || !1
        }
})(jQuery);
(function (b) {
    b
        .jgrid
        .extend({
            setSubGrid: function () {
                return this.each(function () {
                    var e,
                        c;
                    this.p.subGridOptions = b.extend({
                        plusicon: "ui-icon-plus",
                        minusicon: "ui-icon-minus",
                        openicon: "ui-icon-carat-1-sw",
                        expandOnLoad: !1,
                        delayOnLoad: 50,
                        selectOnExpand: !1,
                        reloadOnExpand: !0
                    }, this.p.subGridOptions || {});
                    this
                        .p
                        .colNames
                        .unshift("");
                    this
                        .p
                        .colModel
                        .unshift({
                            name: "subgrid",
                            width: b.jgrid.cell_width
                                ? this.p.subGridWidth + this.p.cellLayout
                                : this.p.subGridWidth,
                            sortable: !1,
                            resizable: !1,
                            hidedlg: !0,
                            search: !1,
                            fixed: !0
                        });
                    e = this.p.subGridModel;
                    if (e[0]) {
                        e[0].align = b.extend([], e[0].align || []);
                        for (c = 0; c < e[0].name.length; c++) 
                            e[0].align[c] = e[0].align[c] || "left"
                    }
                })
            },
            addSubGridCell: function (b, c) {
                var a = "",
                    m,
                    l;
                this.each(function () {
                    a = this.formatCol(b, c);
                    l = this.p.id;
                    m = this.p.subGridOptions.plusicon
                });
                return '<td role="gridcell" aria-describedby="' + l + '_subgrid" class="ui-sgcollapsed sgcollapsed" ' + a + "><a href='javascript:void(0);'><span class='ui-icon " + m + "'></span></a></td>"
            },
            addSubGrid: function (e, c) {
                return this.each(function () {
                    var a = this;
                    if (a.grid) {
                        var m = function (c, e, h) {
                                e = b("<td align='" + a.p.subGridModel[0].align[h] + "'></td>").html(e);
                                b(c).append(e)
                            },
                            l = function (c, e) {
                                var h,
                                    f,
                                    n,
                                    d = b("<table cellspacing='0' cellpadding='0' border='0'><tbody></tbody></table>"),
                                    i = b("<tr></tr>");
                                for (f = 0; f < a.p.subGridModel[0].name.length; f++) 
                                    h = b("<th class='ui-state-default ui-th-subgrid ui-th-column ui-th-" + a.p.direction + "'></th>"),
                                    b(h).html(a.p.subGridModel[0].name[f]),
                                    b(h).width(a.p.subGridModel[0].width[f]),
                                    b(i).append(h);
                                b(d).append(i);
                                c && (n = a.p.xmlReader.subgrid, b(n.root + " " + n.row, c).each(function () {
                                    i = b("<tr class='ui-widget-content ui-subtblcell'></tr>");
                                    if (!0 === n.repeatitems) 
                                        b(n.cell, this).each(function (a) {
                                            m(i, b(this).text() || "&#160;", a)
                                        });
                                    else {
                                        var c = a.p.subGridModel[0].mapping || a.p.subGridModel[0].name;
                                        if (c) 
                                            for (f = 0; f < c.length; f++) 
                                                m(i, b(c[f], this).text() || "&#160;", f)
                                    }
                                    b(d).append(i)
                                }));
                                h = b("table:first", a.grid.bDiv).attr("id") + "_";
                                b("#" + b.jgrid.jqID(h + e)).append(d);
                                a.grid.hDiv.loading = !1;
                                b("#load_" + b.jgrid.jqID(a.p.id)).hide();
                                return !1
                            },
                            p = function (c, e) {
                                var h,
                                    f,
                                    d,
                                    g,
                                    i,
                                    k = b("<table cellspacing='0' cellpadding='0' border='0'><tbody></tbody></table>"),
                                    j = b("<tr></tr>");
                                for (f = 0; f < a.p.subGridModel[0].name.length; f++) 
                                    h = b("<th class='ui-state-default ui-th-subgrid ui-th-column ui-th-" + a.p.direction + "'></th>"),
                                    b(h).html(a.p.subGridModel[0].name[f]),
                                    b(h).width(a.p.subGridModel[0].width[f]),
                                    b(j).append(h);
                                b(k).append(j);
                                if (c && (g = a.p.jsonReader.subgrid, h = b.jgrid.getAccessor(c, g.root), void 0 !== h)) 
                                    for (f = 0; f < h.length; f++) {
                                        d = h[f];
                                        j = b("<tr class='ui-widget-content ui-subtblcell'></tr>");
                                        if (!0 === g.repeatitems) {
                                            g.cell && (d = d[g.cell]);
                                            for (i = 0; i < d.length; i++) 
                                                m(j, d[i] || "&#160;", i)
                                        } else {
                                            var l = a.p.subGridModel[0].mapping || a.p.subGridModel[0].name;
                                            if (l.length) 
                                                for (i = 0; i < l.length; i++) 
                                                    m(j, d[l[i]] || "&#160;", i)
                                        }
                                        b(k).append(j)
                                    }
                                f = b("table:first", a.grid.bDiv).attr("id") + "_";
                                b("#" + b.jgrid.jqID(f + e)).append(k);
                                a.grid.hDiv.loading = !1;
                                b("#load_" + b.jgrid.jqID(a.p.id)).hide();
                                return !1
                            },
                            t = function (c) {
                                var e,
                                    d,
                                    f,
                                    g;
                                e = b(c).attr("id");
                                d = {
                                    nd_: (new Date).getTime()
                                };
                                d[a.p.prmNames.subgridid] = e;
                                if (!a.p.subGridModel[0]) 
                                    return !1;
                                if (a.p.subGridModel[0].params) 
                                    for (g = 0; g < a.p.subGridModel[0].params.length; g++) 
                                        for (f = 0; f < a.p.colModel.length; f++) 
                                            a.p.colModel[f].name === a.p.subGridModel[0].params[g] && (d[a.p.colModel[f].name] = b("td:eq(" + f + ")", c).text().replace(/\&#160\;/ig, ""));
                            if (!a.grid.hDiv.loading) 
                                    switch (a.grid.hDiv.loading = !0, b("#load_" + b.jgrid.jqID(a.p.id)).show(), a.p.subgridtype || (a.p.subgridtype = a.p.datatype), b.isFunction(a.p.subgridtype)
                                        ? a.p.subgridtype.call(a, d)
                                        : a.p.subgridtype = a.p.subgridtype.toLowerCase(), a.p.subgridtype) {
                                        case "xml":
                                        case "json":
                                            b.ajax(b.extend({
                                                type: a.p.mtype,
                                                url: a.p.subGridUrl,
                                                dataType: a.p.subgridtype,
                                                data: b.isFunction(a.p.serializeSubGridData)
                                                    ? a
                                                        .p
                                                        .serializeSubGridData
                                                        .call(a, d)
                                                    : d,
                                                complete: function (c) {
                                                    a.p.subgridtype === "xml"
                                                        ? l(c.responseXML, e)
                                                        : p(b.jgrid.parse(c.responseText), e)
                                                }
                                            }, b.jgrid.ajaxOptions, a.p.ajaxSubgridOptions || {}))
                                    }
                                return !1
                            },
                            d,
                            k,
                            q,
                            r = 0,
                            g,
                            j;
                        b.each(a.p.colModel, function () {
                            (!0 === this.hidden || "rn" === this.name || "cb" === this.name) && r++
                        });
                        var s = a.rows.length,
                            o = 1;
                        void 0 !== c && 0 < c && (o = c, s = c + 1);
                        for (; o < s;) 
                            b(a.rows[o]).hasClass("jqgrow") && b(a.rows[o].cells[e]).bind("click", function () {
                                var c = b(this).parent("tr")[0];
                                j = c.nextSibling;
                                if (b(this).hasClass("sgcollapsed")) {
                                    k = a.p.id;
                                    d = c.id;
                                    if (a.p.subGridOptions.reloadOnExpand === true || a.p.subGridOptions.reloadOnExpand === false && !b(j).hasClass("ui-subgrid")) {
                                        q = e >= 1
                                            ? "<td colspan='" + e + "'>&#160;</td>"
                                            : "";
                                        g = b(a).triggerHandler("jqGridSubGridBeforeExpand", [
                                            k + "_" + d,
                                            d
                                        ]);
                                        (g = g === false || g === "stop"
                                            ? false
                                            : true) && b.isFunction(a.p.subGridBeforeExpand) && (g = a.p.subGridBeforeExpand.call(a, k + "_" + d, d));
                                        if (g === false) 
                                            return false;
                                        b(c).after("<tr role='row' class='ui-subgrid'>" + q + "<td class='ui-widget-content subgrid-cell'><span class='ui-icon " + a.p.subGridOptions.openicon + "'></span></td><td colspan='" + parseInt(a.p.colNames.length - 1 - r, 10) + "' class='ui-widget-content subgrid-data'><div id=" + k + "_" + d + " class='tablediv'></div></td></tr>");
                                        b(a).triggerHandler("jqGridSubGridRowExpanded", [
                                            k + "_" + d,
                                            d
                                        ]);
                                        b.isFunction(a.p.subGridRowExpanded)
                                            ? a
                                                .p
                                                .subGridRowExpanded
                                                .call(a, k + "_" + d, d)
                                            : t(c)
                                    } else 
                                        b(j).show();
                                    b(this)
                                        .html("<a href='javascript:void(0);'><span class='ui-icon " + a.p.subGridOptions.minusicon + "'></span></a>")
                                        .removeClass("sgcollapsed")
                                        .addClass("sgexpanded");
                                    a.p.subGridOptions.selectOnExpand && b(a).jqGrid("setSelection", d)
                                } else if (b(this).hasClass("sgexpanded")) {
                                    g = b(a).triggerHandler("jqGridSubGridRowColapsed", [
                                        k + "_" + d,
                                        d
                                    ]);
                                    if ((g = g === false || g === "stop"
                                        ? false
                                        : true) && b.isFunction(a.p.subGridRowColapsed)) {
                                        d = c.id;
                                        g = a
                                            .p
                                            .subGridRowColapsed
                                            .call(a, k + "_" + d, d)
                                    }
                                    if (g === false) 
                                        return false;
                                    a.p.subGridOptions.reloadOnExpand === true
                                        ? b(j).remove(".ui-subgrid")
                                        : b(j).hasClass("ui-subgrid") && b(j).hide();
                                    b(this)
                                        .html("<a href='javascript:void(0);'><span class='ui-icon " + a.p.subGridOptions.plusicon + "'></span></a>")
                                        .removeClass("sgexpanded")
                                        .addClass("sgcollapsed")
                                }
                                return false
                            }),
                            o++;
                        
                        !0 === a.p.subGridOptions.expandOnLoad && b(a.rows)
                            .filter(".jqgrow")
                            .each(function (a, c) {
                                b(c.cells[0]).click()
                            });
                        a.subGridXml = function (a, b) {
                            l(a, b)
                        };
                        a.subGridJson = function (a, b) {
                            p(a, b)
                        }
                    }
                })
            },
            expandSubGridRow: function (e) {
                return this.each(function () {
                    if ((this.grid || e) && !0 === this.p.subGrid) {
                        var c = b(this).jqGrid("getInd", e, !0);
                        c && (c = b("td.sgcollapsed", c)[0]) && b(c).trigger("click")
                    }
                })
            },
            collapseSubGridRow: function (e) {
                return this.each(function () {
                    if ((this.grid || e) && !0 === this.p.subGrid) {
                        var c = b(this).jqGrid("getInd", e, !0);
                        c && (c = b("td.sgexpanded", c)[0]) && b(c).trigger("click")
                    }
                })
            },
            toggleSubGridRow: function (e) {
                return this.each(function () {
                    if ((this.grid || e) && !0 === this.p.subGrid) {
                        var c = b(this).jqGrid("getInd", e, !0);
                        if (c) {
                            var a = b("td.sgcollapsed", c)[0];
                            a
                                ? b(a).trigger("click")
                                : (a = b("td.sgexpanded", c)[0]) && b(a).trigger("click")
                        }
                    }
                })
            }
        })
})(jQuery);
(function (d) {
    d.extend(d.jgrid, {
        template: function (b) {
            var g = d
                    .makeArray(arguments)
                    .slice(1),
                f,
                a = g.length;
            null == b && (b = "");
            return b.replace(/\{([\w\-]+)(?:\:([\w\.]*)(?:\((.*?)?\))?)?\}/g, function (e, b) {
                if (!isNaN(parseInt(b, 10))) 
                    return g[parseInt(b, 10)];
                for (f = 0; f < a; f++) 
                    if (d.isArray(g[f])) 
                        for (var c = g[f], k = c.length; k--;) 
                            if (b === c[k].nm) 
                                return c[k].v
            })
        }
    });
    d
        .jgrid
        .extend({
            groupingSetup: function () {
                return this.each(function () {
                    var b,
                        g,
                        f = this.p.colModel,
                        a = this.p.groupingView;
                    if (null !== a && ("object" === typeof a || d.isFunction(a))) 
                        if (a.groupField.length) {
                            void 0 === a.visibiltyOnNextGrouping && (a.visibiltyOnNextGrouping = []);
                            a.lastvalues = [];
                            a.groups = [];
                            a.counters = [];
                            for (b = 0; b < a.groupField.length; b++) 
                                a.groupOrder[b] || (a.groupOrder[b] = "asc"),
                                a.groupText[b] || (a.groupText[b] = "{0}"),
                                "boolean" !== typeof a.groupColumnShow[b] && (a.groupColumnShow[b] = !0),
                                "boolean" !== typeof a.groupSummary[b] && (a.groupSummary[b] = !1),
                                !0 === a.groupColumnShow[b]
                                    ? (a.visibiltyOnNextGrouping[b] = !0, d(this).jqGrid("showCol", a.groupField[b]))
                                    : (a.visibiltyOnNextGrouping[b] = d("#" + d.jgrid.jqID(this.p.id + "_" + a.groupField[b])).is(":visible"), d(this).jqGrid("hideCol", a.groupField[b]));
                            a.summary = [];
                            b = 0;
                            for (g = f.length; b < g; b++) 
                                f[b].summaryType && a.summary.push({
                                    nm: f[b].name,
                                    st: f[b].summaryType,
                                    v: "",
                                    sr: f[b].summaryRound,
                                    srt: f[b].summaryRoundType || "round"
                                })
                        } else 
                            this.p.grouping = !1;
                else 
                        this.p.grouping = !1
                })
            },
            groupingPrepare: function (b, g, f, a) {
                this
                    .each(function () {
                        var e = this.p.groupingView,
                            h = this,
                            c,
                            k = e.groupField.length,
                            l,
                            j,
                            m,
                            q = 0;
                        for (c = 0; c < k; c++) 
                            l = e.groupField[c],
                            m = e.displayField[c],
                            j = f[l],
                            m = null == m
                                ? null
                                : f[m],
                            null == m && (m = j),
                            void 0 !== j && (0 === a
                                ? (e.groups.push({
                                    idx: c,
                                    dataIndex: l,
                                    value: j,
                                    displayValue: m,
                                    startRow: a,
                                    cnt: 1,
                                    summary: []
                                }), e.lastvalues[c] = j, e.counters[c] = {
                                    cnt: 1,
                                    pos: e.groups.length - 1,
                                    summary: d.extend(!0, [], e.summary)
                                })
                                : "object" !== typeof j && (d.isArray(e.isInTheSameGroup) && d.isFunction(e.isInTheSameGroup[c])
                                    ? !e.isInTheSameGroup[c].call(h, e.lastvalues[c], j, c, e)
                                    : e.lastvalues[c] !== j)
                                    ? (e.groups.push({
                                        idx: c,
                                        dataIndex: l,
                                        value: j,
                                        displayValue: m,
                                        startRow: a,
                                        cnt: 1,
                                        summary: []
                                    }), e.lastvalues[c] = j, q = 1, e.counters[c] = {
                                        cnt: 1,
                                        pos: e.groups.length - 1,
                                        summary: d.extend(!0, [], e.summary)
                                    })
                                    : 1 === q
                                        ? (e.groups.push({
                                            idx: c,
                                            dataIndex: l,
                                            value: j,
                                            displayValue: m,
                                            startRow: a,
                                            cnt: 1,
                                            summary: []
                                        }), e.lastvalues[c] = j, e.counters[c] = {
                                            cnt: 1,
                                            pos: e.groups.length - 1,
                                            summary: d.extend(!0, [], e.summary)
                                        })
                                        : (e.counters[c].cnt += 1, e.groups[e.counters[c].pos].cnt = e.counters[c].cnt), d.each(e.counters[c].summary, function () {
                                this.v = d.isFunction(this.st)
                                    ? this
                                        .st
                                        .call(h, this.v, this.nm, f)
                                    : d(h).jqGrid("groupingCalculations.handler", this.st, this.v, this.nm, this.sr, this.srt, f)
                            }), e.groups[e.counters[c].pos].summary = e.counters[c].summary);
                        g.push(b)
                    });
                return g
            },
            groupingToggle: function (b) {
                this
                    .each(function () {
                        var g = this.p.groupingView,
                            f = b.split("_"),
                            a = parseInt(f[f.length - 2], 10);
                        f.splice(f.length - 2, 2);
                        var f = f.join("_"),
                            e = g.minusicon,
                            h = g.plusicon,
                            c = d("#" + d.jgrid.jqID(b)),
                            c = c.length
                                ? c[0].nextSibling
                                : null,
                            k = d("#" + d.jgrid.jqID(b) + " span.tree-wrap-" + this.p.direction),
                            l = !1;
                        if (k.hasClass(e)) {
                            if (g.showSummaryOnHide) {
                                if (c) 
                                    for (; c && !(d(c).hasClass("jqfoot") && parseInt(d(c).attr("jqfootlevel"), 10) <= a);) 
                                        d(c).hide(),
                                        c = c.nextSibling
                            } else if (c) 
                                for (; c;) {
                                    g = c
                                        .className
                                        .indexOf(f);
                                    if (-1 !== g && parseInt(c.className.substring(g + f.length + 1), 10) <= a) 
                                        break;
                                    d(c).hide();
                                    c = c.nextSibling
                                }
                            k
                                .removeClass(e)
                                .addClass(h);
                            l = !0
                        } else {
                            if (c) 
                                for (; c;) {
                                    g = c
                                        .className
                                        .indexOf(f);
                                    if (-1 !== g && parseInt(c.className.substring(g + f.length + 1), 10) <= a) 
                                        break;
                                    d(c).show();
                                    (g = d(c).find("span.tree-wrap-" + this.p.direction)) && d(g).hasClass(h) && d(g)
                                        .removeClass(h)
                                        .addClass(e);
                                    c = c.nextSibling
                                }
                            k
                                .removeClass(h)
                                .addClass(e)
                        }
                        d(this).triggerHandler("jqGridGroupingClickGroup", [b, l]);
                        d.isFunction(this.p.onClickGroup) && this
                            .p
                            .onClickGroup
                            .call(this, b, l)
                    });
                return !1
            },
            groupingRender: function (b, g) {
                return this.each(function () {
                    function f(a, b, c) {
                        var e = !1;
                        if (0 === b) 
                            e = c[a];
                        else {
                            var d = c[a].idx;
                            if (0 === d) 
                                e = c[a];
                            else 
                                for (; 0 <= a; a--) 
                                    if (c[a].idx === d - b) {
                                        e = c[a];
                                        break
                                    }
                                }
                        return e
                    }
                    var a = this,
                        e = a.p.groupingView,
                        h = "",
                        c = "",
                        k,
                        l,
                        j = e.groupCollapse
                            ? e.plusicon
                            : e.minusicon,
                        m,
                        q = [],
                        w = e.groupField.length,
                        j = j + (" tree-wrap-" + a.p.direction);
                    d.each(a.p.colModel, function (a, c) {
                        var b;
                        for (b = 0; b < w; b++) 
                            if (e.groupField[b] === c.name) {
                                q[b] = a;
                                break
                            }
                        });
                    var t = 0,
                        x = d.makeArray(e.groupSummary);
                    x.reverse();
                    d.each(e.groups, function (s, i) {
                        t++;
                        l = a.p.id + "ghead_" + i.idx;
                        k = l + "_" + s;
                        c = "<span style='cursor:pointer;' class='ui-icon " + j + "' onclick=\"jQuery('#" + d
                            .jgrid
                            .jqID(a.p.id) + "').jqGrid('groupingToggle','" + k + "');return false;\"></span>";
                        try {
                            d.isArray(e.formatDisplayField) && d.isFunction(e.formatDisplayField[i.idx]) && (i.displayValue = e.formatDisplayField[i.idx].call(a, i.displayValue, i.value, a.p.colModel[q[i.idx]], i.idx, e)),
                            m = a.formatter(k, i.displayValue, q[i.idx], i.value)
                        } catch (C) {
                            m = i.displayValue
                        }
                        h += '<tr id="' + k + '" role="row" class= "ui-widget-content jqgroup ui-row-' + a.p.direction + " " + l + '"><td style="padding-left:' + 12 * i.idx + 'px;" colspan="' + g + '">' + c + d
                            .jgrid
                            .template(e.groupText[i.idx], m, i.cnt, i.summary) + "</td></tr>";
                        if (w - 1 === i.idx) {
                            var o = e.groups[s + 1],
                                p,
                                n,
                                B = void 0 !== o
                                    ? e.groups[s + 1].startRow
                                    : b.length;
                            for (n = i.startRow; n < B; n++) 
                                h += b[n].join("");
                            var r;
                            if (void 0 !== o) {
                                for (r = 0; r < e.groupField.length && o.dataIndex !== e.groupField[r]; r++) 
                                ;
                                t = e.groupField.length - r
                            }
                            for (o = 0; o < t; o++) 
                                if (x[o]) {
                                    n = "";
                                    e.groupCollapse && !e.showSummaryOnHide && (n = ' style="display:none;"');
                                    h += "<tr" + n + ' jqfootlevel="' + (i.idx - o) + '" role="row" class="ui-widget-content jqfoot ui-row-' + a.p.direction + '">';
                                    n = f(s, o, e.groups);
                                    var u = a.p.colModel,
                                        v,
                                        y = n.cnt;
                                    for (p = 0; p < g; p++) {
                                        var z = "<td " + a.formatCol(p, 1, "") + ">&#160;</td>",
                                            A = "{0}";
                                        d.each(n.summary, function () {
                                            if (this.nm === u[p].name) {
                                                u[p].summaryTpl && (A = u[p].summaryTpl);
                                                "string" === typeof this.st && "avg" === this
                                                    .st
                                                    .toLowerCase() && this.v && 0 < y && (this.v /= y);
                                                try {
                                                    v = a.formatter("", this.v, p, this)
                                                } catch (b) {
                                                    v = this.v
                                                }
                                                z = "<td " + a.formatCol(p, 1, "") + ">" + d
                                                    .jgrid
                                                    .format(A, v) + "</td>";
                                                return !1
                                            }
                                        });
                                        h += z
                                    }
                                    h += "</tr>"
                                }
                            t = r
                        }
                    });
                    d("#" + d.jgrid.jqID(a.p.id) + " tbody:first").append(h);
                    h = null
                })
            },
            groupingGroupBy: function (b, g) {
                return this.each(function () {
                    "string" === typeof b && (b = [b]);
                    var f = this.p.groupingView;
                    this.p.grouping = !0;
                    void 0 === f.visibiltyOnNextGrouping && (f.visibiltyOnNextGrouping = []);
                    var a;
                    for (a = 0; a < f.groupField.length; a++) 
                        !f.groupColumnShow[a] && f.visibiltyOnNextGrouping[a] && d(this).jqGrid("showCol", f.groupField[a]);
                    for (a = 0; a < b.length; a++) 
                        f.visibiltyOnNextGrouping[a] = d("#" + d.jgrid.jqID(this.p.id) + "_" + d.jgrid.jqID(b[a])).is(":visible");
                    this.p.groupingView = d.extend(this.p.groupingView, g || {});
                    f.groupField = b;
                    d(this).trigger("reloadGrid")
                })
            },
            groupingRemove: function (b) {
                return this.each(function () {
                    void 0 === b && (b = !0);
                    this.p.grouping = !1;
                    if (!0 === b) {
                        var g = this.p.groupingView,
                            f;
                        for (f = 0; f < g.groupField.length; f++) 
                            !g.groupColumnShow[f] && g.visibiltyOnNextGrouping[f] && d(this).jqGrid("showCol", g.groupField);
                        d("tr.jqgroup, tr.jqfoot", "#" + d.jgrid.jqID(this.p.id) + " tbody:first").remove();
                        d("tr.jqgrow:hidden", "#" + d.jgrid.jqID(this.p.id) + " tbody:first").show()
                    } else 
                        d(this).trigger("reloadGrid")
                })
            },
            groupingCalculations: {
                handler: function (b, d, f, a, e, h) {
                    var c = {
                        sum: function () {
                            return parseFloat(d || 0) + parseFloat(h[f] || 0)
                        },
                        min: function () {
                            return "" === d
                                ? parseFloat(h[f] || 0)
                                : Math.min(parseFloat(d), parseFloat(h[f] || 0))
                        },
                        max: function () {
                            return "" === d
                                ? parseFloat(h[f] || 0)
                                : Math.max(parseFloat(d), parseFloat(h[f] || 0))
                        },
                        count: function () {
                            "" === d && (d = 0);
                            return h.hasOwnProperty(f)
                                ? d + 1
                                : 0
                        },
                        avg: function () {
                            return c.sum()
                        }
                    };
                    if (!c[b]) 
                        throw "jqGrid Grouping No such method: " + b;
                    b = c[b]();
                    null != a && ("fixed" === e
                        ? b = b.toFixed(a)
                        : (a = Math.pow(10, a), b = Math.round(b * a) / a));
                    return b
                }
            }
        })
})(jQuery);
(function (d) {
    d
        .jgrid
        .extend({
            setTreeNode: function (b, c) {
                return this.each(function () {
                    var a = this;
                    if (a.grid && a.p.treeGrid) 
                        for (var h = a.p.expColInd, e = a.p.treeReader.expanded_field, i = a.p.treeReader.leaf_field, g = a.p.treeReader.level_field, f = a.p.treeReader.icon_field, l = a.p.treeReader.loaded, k, m, n, j; b < c;) 
                            j = d.jgrid.stripPref(a.p.idPrefix, a.rows[b].id),
                            j = a.p.data[a.p._index[j]],
                            "nested" === a.p.treeGridModel && !j[i] && (k = parseInt(j[a.p.treeReader.left_field], 10), m = parseInt(j[a.p.treeReader.right_field], 10), j[i] = m === k + 1
                                ? "true"
                                : "false", a.rows[b].cells[a.p._treeleafpos].innerHTML = j[i]),
                            k = parseInt(j[g], 10),
                            0 === a.p.tree_root_level
                                ? (n = k + 1, m = k)
                                : (n = k, m = k - 1),
                            n = "<div class='tree-wrap tree-wrap-" + a.p.direction + "' style='width:" + 18 * n + "px;'>",
                            n += "<div style='" + ("rtl" === a.p.direction
                                ? "right:"
                                : "left:") + 18 * m + "px;' class='ui-icon ",
                            void 0 !== j[l] && (j[l] = "true" === j[l] || !0 === j[l]
                                ? !0
                                : !1),
                            "true" === j[i] || !0 === j[i]
                                ? (n += (void 0 !== j[f] && "" !== j[f]
                                    ? j[f]
                                    : a.p.treeIcons.leaf) + " tree-leaf treeclick", j[i] = !0, m = "leaf")
                                : (j[i] = !1, m = ""),
                            j[e] = ("true" === j[e] || !0 === j[e]
                                ? !0
                                : !1) && (j[l] || void 0 === j[l]),
                            n = !1 === j[e]
                                ? n + (!0 === j[i]
                                    ? "'"
                                    : a.p.treeIcons.plus + " tree-plus treeclick'")
                                : n + (!0 === j[i]
                                    ? "'"
                                    : a.p.treeIcons.minus + " tree-minus treeclick'"),
                            n += "></div></div>",
                            d(a.rows[b].cells[h]).wrapInner("<span class='cell-wrapper" + m + "'></span>").prepend(n),
                            k !== parseInt(a.p.tree_root_level, 10) && ((j = (j = d(a).jqGrid("getNodeParent", j)) && j.hasOwnProperty(e)
                                ? j[e]
                                : !0) || d(a.rows[b]).css("display", "none")),
                            d(a.rows[b].cells[h]).find("div.treeclick").bind("click", function (b) {
                                b = d
                                    .jgrid
                                    .stripPref(a.p.idPrefix, d(b.target || b.srcElement, a.rows).closest("tr.jqgrow")[0].id);
                                b = a.p._index[b];
                                if (!a.p.data[b][i]) 
                                    if (a.p.data[b][e]) {
                                        d(a).jqGrid("collapseRow", a.p.data[b]);
                                        d(a).jqGrid("collapseNode", a.p.data[b])
                                    }
                                else {
                                    d(a).jqGrid("expandRow", a.p.data[b]);
                                    d(a).jqGrid("expandNode", a.p.data[b])
                                }
                                return false
                            }),
                            !0 === a.p.ExpandColClick && d(a.rows[b].cells[h]).find("span.cell-wrapper").css("cursor", "pointer").bind("click", function (b) {
                                var b = d
                                        .jgrid
                                        .stripPref(a.p.idPrefix, d(b.target || b.srcElement, a.rows).closest("tr.jqgrow")[0].id),
                                    c = a.p._index[b];
                                if (!a.p.data[c][i]) 
                                    if (a.p.data[c][e]) {
                                        d(a).jqGrid("collapseRow", a.p.data[c]);
                                        d(a).jqGrid("collapseNode", a.p.data[c])
                                    }
                                else {
                                    d(a).jqGrid("expandRow", a.p.data[c]);
                                    d(a).jqGrid("expandNode", a.p.data[c])
                                }
                                d(a).jqGrid("setSelection", b);
                                return false
                            }),
                            b++
                        }
                    )
            },
            setTreeGrid: function () {
                return this.each(function () {
                    var b = this,
                        c = 0,
                        a = !1,
                        h,
                        e,
                        i,
                        g = [];
                    if (b.p.treeGrid) {
                        b.p.treedatatype || d.extend(b.p, {treedatatype: b.p.datatype});
                        b.p.subGrid = !1;
                        b.p.altRows = !1;
                        b.p.pgbuttons = !1;
                        b.p.pginput = !1;
                        b.p.gridview = !0;
                        null === b.p.rowTotal && (b.p.rowNum = 1E4);
                        b.p.multiselect = !1;
                        b.p.rowList = [];
                        b.p.expColInd = 0;
                        b.p.treeIcons = d.extend({
                            plus: "ui-icon-triangle-1-" + ("rtl" === b.p.direction
                                ? "w"
                                : "e"),
                            minus: "ui-icon-triangle-1-s",
                            leaf: "ui-icon-radio-off"
                        }, b.p.treeIcons || {});
                        "nested" === b.p.treeGridModel
                            ? b.p.treeReader = d.extend({
                                level_field: "level",
                                left_field: "lft",
                                right_field: "rgt",
                                leaf_field: "isLeaf",
                                expanded_field: "expanded",
                                loaded: "loaded",
                                icon_field: "icon"
                            }, b.p.treeReader)
                            : "adjacency" === b.p.treeGridModel && (b.p.treeReader = d.extend({
                                level_field: "level",
                                parent_id_field: "parent",
                                leaf_field: "isLeaf",
                                expanded_field: "expanded",
                                loaded: "loaded",
                                icon_field: "icon"
                            }, b.p.treeReader));
                        for (e in b.p.colModel) 
                            if (b.p.colModel.hasOwnProperty(e)) 
                                for (i in h = b.p.colModel[e].name, h === b.p.ExpandColumn && !a && (a = !0, b.p.expColInd = c), c++, b.p.treeReader) 
                                    b.p.treeReader.hasOwnProperty(i) && b.p.treeReader[i] === h && g.push(h);
                    d
                            .each(b.p.treeReader, function (a, e) {
                                if (e && d.inArray(e, g) === -1) {
                                    if (a === "leaf_field") 
                                        b.p._treeleafpos = c;
                                    c++;
                                    b
                                        .p
                                        .colNames
                                        .push(e);
                                    b
                                        .p
                                        .colModel
                                        .push({
                                            name: e,
                                            width: 1,
                                            hidden: true,
                                            sortable: false,
                                            resizable: false,
                                            hidedlg: true,
                                            editable: true,
                                            search: false
                                        })
                                }
                            })
                    }
                })
            },
            expandRow: function (b) {
                this
                    .each(function () {
                        var c = this;
                        if (c.grid && c.p.treeGrid) {
                            var a = d(c).jqGrid("getNodeChildren", b),
                                h = c.p.treeReader.expanded_field,
                                e = c.rows;
                            d(a).each(function () {
                                var a = c.p.idPrefix + d
                                    .jgrid
                                    .getAccessor(this, c.p.localReader.id);
                                d(e.namedItem(a)).css("display", "");
                                this[h] && d(c).jqGrid("expandRow", this)
                            })
                        }
                    })
            },
            collapseRow: function (b) {
                this
                    .each(function () {
                        var c = this;
                        if (c.grid && c.p.treeGrid) {
                            var a = d(c).jqGrid("getNodeChildren", b),
                                h = c.p.treeReader.expanded_field,
                                e = c.rows;
                            d(a).each(function () {
                                var a = c.p.idPrefix + d
                                    .jgrid
                                    .getAccessor(this, c.p.localReader.id);
                                d(e.namedItem(a)).css("display", "none");
                                this[h] && d(c).jqGrid("collapseRow", this)
                            })
                        }
                    })
            },
            getRootNodes: function () {
                var b = [];
                this.each(function () {
                    var c = this;
                    if (c.grid && c.p.treeGrid) 
                        switch (c.p.treeGridModel) {
                            case "nested":
                                var a = c.p.treeReader.level_field;
                                d(c.p.data).each(function () {
                                    parseInt(this[a], 10) === parseInt(c.p.tree_root_level, 10) && b.push(this)
                                });
                                break;
                            case "adjacency":
                                var h = c.p.treeReader.parent_id_field;
                                d(c.p.data).each(function () {
                                    (null === this[h] || "null" === ("" + this[h]).toLowerCase()) && b.push(this)
                                })
                        }
                    });
                return b
            },
            getNodeDepth: function (b) {
                var c = null;
                this.each(function () {
                    if (this.grid && this.p.treeGrid) 
                        switch (this.p.treeGridModel) {
                            case "nested":
                                c = parseInt(b[this.p.treeReader.level_field], 10) - parseInt(this.p.tree_root_level, 10);
                                break;
                            case "adjacency":
                                c = d(this)
                                    .jqGrid("getNodeAncestors", b)
                                    .length
                        }
                    });
                return c
            },
            getNodeParent: function (b) {
                var c = null;
                this.each(function () {
                    var a = this;
                    if (a.grid && a.p.treeGrid) 
                        switch (a.p.treeGridModel) {
                            case "nested":
                                var h = a.p.treeReader.left_field,
                                    e = a.p.treeReader.right_field,
                                    i = a.p.treeReader.level_field,
                                    g = parseInt(b[h], 10),
                                    f = parseInt(b[e], 10),
                                    l = parseInt(b[i], 10);
                                d(this.p.data).each(function () {
                                    if (parseInt(this[i], 10) === l - 1 && parseInt(this[h], 10) < g && parseInt(this[e], 10) > f) 
                                        return c = this,
                                        !1
                                });
                                break;
                            case "adjacency":
                                var k = a.p.treeReader.parent_id_field,
                                    m = a.p.localReader.id;
                                d(this.p.data).each(function () {
                                    if (this[m] === d.jgrid.stripPref(a.p.idPrefix, b[k])) 
                                        return c = this,
                                        !1
                                })
                        }
                    });
                return c
            },
            getNodeChildren: function (b) {
                var c = [];
                this.each(function () {
                    var a = this;
                    if (a.grid && a.p.treeGrid) 
                        switch (a.p.treeGridModel) {
                            case "nested":
                                var h = a.p.treeReader.left_field,
                                    e = a.p.treeReader.right_field,
                                    i = a.p.treeReader.level_field,
                                    g = parseInt(b[h], 10),
                                    f = parseInt(b[e], 10),
                                    l = parseInt(b[i], 10);
                                d(this.p.data).each(function () {
                                    parseInt(this[i], 10) === l + 1 && parseInt(this[h], 10) > g && parseInt(this[e], 10) < f && c.push(this)
                                });
                                break;
                            case "adjacency":
                                var k = a.p.treeReader.parent_id_field,
                                    m = a.p.localReader.id;
                                d(this.p.data).each(function () {
                                    this[k] == d
                                        .jgrid
                                        .stripPref(a.p.idPrefix, b[m]) && c.push(this)
                                })
                        }
                    });
                return c
            },
            getFullTreeNode: function (b) {
                var c = [];
                this.each(function () {
                    var a = this,
                        h;
                    if (a.grid && a.p.treeGrid) 
                        switch (a.p.treeGridModel) {
                            case "nested":
                                var e = a.p.treeReader.left_field,
                                    i = a.p.treeReader.right_field,
                                    g = a.p.treeReader.level_field,
                                    f = parseInt(b[e], 10),
                                    l = parseInt(b[i], 10),
                                    k = parseInt(b[g], 10);
                                d(this.p.data).each(function () {
                                    parseInt(this[g], 10) >= k && parseInt(this[e], 10) >= f && parseInt(this[e], 10) <= l && c.push(this)
                                });
                                break;
                            case "adjacency":
                                if (b) {
                                    c.push(b);
                                    var m = a.p.treeReader.parent_id_field,
                                        n = a.p.localReader.id;
                                    d(this.p.data).each(function (b) {
                                        h = c.length;
                                        for (b = 0; b < h; b++) 
                                            if (d.jgrid.stripPref(a.p.idPrefix, c[b][n]) === this[m]) {
                                                c.push(this);
                                                break
                                            }
                                        })
                                }
                        }
                    });
                return c
            },
            getNodeAncestors: function (b) {
                var c = [];
                this.each(function () {
                    if (this.grid && this.p.treeGrid) 
                        for (var a = d(this).jqGrid("getNodeParent", b); a;) 
                            c.push(a),
                            a = d(this).jqGrid("getNodeParent", a)
                });
                return c
            },
            isVisibleNode: function (b) {
                var c = !0;
                this.each(function () {
                    if (this.grid && this.p.treeGrid) {
                        var a = d(this).jqGrid("getNodeAncestors", b),
                            h = this.p.treeReader.expanded_field;
                        d(a).each(function () {
                            c = c && this[h];
                            if (!c) 
                                return !1
                        })
                    }
                });
                return c
            },
            isNodeLoaded: function (b) {
                var c;
                this.each(function () {
                    if (this.grid && this.p.treeGrid) {
                        var a = this.p.treeReader.leaf_field;
                        c = void 0 !== b
                            ? void 0 !== b.loaded
                                ? b.loaded
                                : b[a] || 0 < d(this)
                                    .jqGrid("getNodeChildren", b)
                                    .length
                                    ? !0
                                    : !1
                            : !1
                    }
                });
                return c
            },
            expandNode: function (b) {
                return this.each(function () {
                    if (this.grid && this.p.treeGrid) {
                        var c = this.p.treeReader.expanded_field,
                            a = this.p.treeReader.parent_id_field,
                            h = this.p.treeReader.loaded,
                            e = this.p.treeReader.level_field,
                            i = this.p.treeReader.left_field,
                            g = this.p.treeReader.right_field;
                        if (!b[c]) {
                            var f = d
                                    .jgrid
                                    .getAccessor(b, this.p.localReader.id),
                                l = d("#" + this.p.idPrefix + d.jgrid.jqID(f), this.grid.bDiv)[0],
                                k = this.p._index[f];
                            d(this).jqGrid("isNodeLoaded", this.p.data[k])
                                ? (b[c] = !0, d("div.treeclick", l).removeClass(this.p.treeIcons.plus + " tree-plus").addClass(this.p.treeIcons.minus + " tree-minus"))
                                : this.grid.hDiv.loading || (b[c] = !0, d("div.treeclick", l).removeClass(this.p.treeIcons.plus + " tree-plus").addClass(this.p.treeIcons.minus + " tree-minus"), this.p.treeANode = l.rowIndex, this.p.datatype = this.p.treedatatype, "nested" === this.p.treeGridModel
                                    ? d(this).jqGrid("setGridParam", {
                                        postData: {
                                            nodeid: f,
                                            n_left: b[i],
                                            n_right: b[g],
                                            n_level: b[e]
                                        }
                                    })
                                    : d(this).jqGrid("setGridParam", {
                                        postData: {
                                            nodeid: f,
                                            paraid: b[a],
                                            n_level: b[e]
                                        }
                                    }), d(this).trigger("reloadGrid"), b[h] = !0, "nested" === this.p.treeGridModel
                                    ? d(this).jqGrid("setGridParam", {
                                        postData: {
                                            nodeid: "",
                                            n_left: "",
                                            n_right: "",
                                            n_level: ""
                                        }
                                    })
                                    : d(this).jqGrid("setGridParam", {
                                        postData: {
                                            nodeid: "",
                                            paraid: "",
                                            n_level: ""
                                        }
                                    }))
                        }
                    }
                })
            },
            collapseNode: function (b) {
                return this.each(function () {
                    if (this.grid && this.p.treeGrid) {
                        var c = this.p.treeReader.expanded_field;
                        b[c] && (b[c] = !1, c = d.jgrid.getAccessor(b, this.p.localReader.id), c = d("#" + this.p.idPrefix + d.jgrid.jqID(c), this.grid.bDiv)[0],
                        d("div.treeclick", c).removeClass(this.p.treeIcons.minus + " tree-minus").addClass(this.p.treeIcons.plus + " tree-plus"))
                    }
                })
            },
            SortTree: function (b, c, a, h) {
                return this.each(function () {
                    if (this.grid && this.p.treeGrid) {
                        var e,
                            i,
                            g,
                            f = [],
                            l = this,
                            k;
                        e = d(this).jqGrid("getRootNodes");
                        e = d
                            .jgrid
                            .from(e);
                        e.orderBy(b, c, a, h);
                        k = e.select();
                        e = 0;
                        for (i = k.length; e < i; e++) 
                            g = k[e],
                            f.push(g),
                            d(this).jqGrid("collectChildrenSortTree", f, g, b, c, a, h);
                        d
                            .each(f, function (a) {
                                var b = d
                                    .jgrid
                                    .getAccessor(this, l.p.localReader.id);
                                d("#" + d.jgrid.jqID(l.p.id) + " tbody tr:eq(" + a + ")").after(d("tr#" + d.jgrid.jqID(b), l.grid.bDiv))
                            });
                        f = k = e = null
                    }
                })
            },
            collectChildrenSortTree: function (b, c, a, h, e, i) {
                return this.each(function () {
                    if (this.grid && this.p.treeGrid) {
                        var g,
                            f,
                            l,
                            k;
                        g = d(this).jqGrid("getNodeChildren", c);
                        g = d
                            .jgrid
                            .from(g);
                        g.orderBy(a, h, e, i);
                        k = g.select();
                        g = 0;
                        for (f = k.length; g < f; g++) 
                            l = k[g],
                            b.push(l),
                            d(this).jqGrid("collectChildrenSortTree", b, l, a, h, e, i)
                    }
                })
            },
            setTreeRow: function (b, c) {
                var a = !1;
                this.each(function () {
                    this.grid && this.p.treeGrid && (a = d(this).jqGrid("setRowData", b, c))
                });
                return a
            },
            delTreeNode: function (b) {
                return this.each(function () {
                    var c = this.p.localReader.id,
                        a,
                        h = this.p.treeReader.left_field,
                        e = this.p.treeReader.right_field,
                        i,
                        g,
                        f;
                    if (this.grid && this.p.treeGrid && (a = this.p._index[b], void 0 !== a)) {
                        i = parseInt(this.p.data[a][e], 10);
                        g = i - parseInt(this.p.data[a][h], 10) + 1;
                        var l = d(this).jqGrid("getFullTreeNode", this.p.data[a]);
                        if (0 < l.length) 
                            for (a = 0; a < l.length; a++) 
                                d(this).jqGrid("delRowData", l[a][c]);
                    if ("nested" === this.p.treeGridModel) {
                            c = d
                                .jgrid
                                .from(this.p.data)
                                .greater(h, i, {stype: "integer"})
                                .select();
                            if (c.length) 
                                for (f in c) 
                                    c.hasOwnProperty(f) && (c[f][h] = parseInt(c[f][h], 10) - g);
                        c = d
                                .jgrid
                                .from(this.p.data)
                                .greater(e, i, {stype: "integer"})
                                .select();
                            if (c.length) 
                                for (f in c) 
                                    c.hasOwnProperty(f) && (c[f][e] = parseInt(c[f][e], 10) - g)
                        }
                    }
                })
            },
            addChildNode: function (b, c, a, h) {
                var e = this[0];
                if (a) {
                    var i = e.p.treeReader.expanded_field,
                        g = e.p.treeReader.leaf_field,
                        f = e.p.treeReader.level_field,
                        l = e.p.treeReader.parent_id_field,
                        k = e.p.treeReader.left_field,
                        m = e.p.treeReader.right_field,
                        n = e.p.treeReader.loaded,
                        j,
                        r,
                        q,
                        t,
                        p;
                    j = 0;
                    var s = c,
                        u;
                    void 0 === h && (h = !1);
                    if (void 0 === b || null === b) {
                        p = e.p.data.length - 1;
                        if (0 <= p) 
                            for (; 0 <= p;) 
                                j = Math.max(j, parseInt(e.p.data[p][e.p.localReader.id], 10)),
                                p--;
                    b = j + 1
                    }
                    var v = d(e).jqGrid("getInd", c);
                    u = !1;
                    if (void 0 === c || null === c || "" === c) 
                        s = c = null,
                        j = "last",
                        t = e.p.tree_root_level,
                        p = e.p.data.length + 1;
                    else if (j = "after", r = e.p._index[c], q = e.p.data[r], c = q[e.p.localReader.id], t = parseInt(q[f], 10) + 1, p = d(e).jqGrid("getFullTreeNode", q), p.length
                        ? (s = p = p[p.length - 1][e.p.localReader.id], p = d(e).jqGrid("getInd", s) + 1)
                        : p = d(e).jqGrid("getInd", c) + 1, q[g]) 
                        u = !0,
                        q[i] = !0,
                        d(e.rows[v]).find("span.cell-wrapperleaf").removeClass("cell-wrapperleaf").addClass("cell-wrapper").end().find("div.tree-leaf").removeClass(e.p.treeIcons.leaf + " tree-leaf").addClass(e.p.treeIcons.minus + " tree-minus"),
                        e.p.data[r][g] = !1,
                        q[n] = !0;
                    r = p + 1;
                    void 0 === a[i] && (a[i] = !1);
                    void 0 === a[n] && (a[n] = !1);
                    a[f] = t;
                    void 0 === a[g] && (a[g] = !0);
                    "adjacency" === e.p.treeGridModel && (a[l] = c);
                    if ("nested" === e.p.treeGridModel) {
                        var o;
                        if (null !== c) {
                            g = parseInt(q[m], 10);
                            f = d
                                .jgrid
                                .from(e.p.data);
                            f = f.greaterOrEquals(m, g, {stype: "integer"});
                            f = f.select();
                            if (f.length) 
                                for (o in f) 
                                    f.hasOwnProperty(o) && (f[o][k] = f[o][k] > g
                                        ? parseInt(f[o][k], 10) + 2
                                        : f[o][k],
                                    f[o][m] = f[o][m] >= g
                                        ? parseInt(f[o][m], 10) + 2
                                        : f[o][m]);
                            a[k] = g;
                            a[m] = g + 1
                        } else {
                            g = parseInt(d(e).jqGrid("getCol", m, !1, "max"), 10);
                            f = d
                                .jgrid
                                .from(e.p.data)
                                .greater(k, g, {stype: "integer"})
                                .select();
                            if (f.length) 
                                for (o in f) 
                                    f.hasOwnProperty(o) && (f[o][k] = parseInt(f[o][k], 10) + 2);
                        f = d
                                .jgrid
                                .from(e.p.data)
                                .greater(m, g, {stype: "integer"})
                                .select();
                            if (f.length) 
                                for (o in f) 
                                    f.hasOwnProperty(o) && (f[o][m] = parseInt(f[o][m], 10) + 2);
                        a[k] = g + 1;
                            a[m] = g + 2
                        }
                    }
                    if (null === c || d(e).jqGrid("isNodeLoaded", q) || u) 
                        d(e).jqGrid("addRowData", b, a, j, s),
                        d(e).jqGrid("setTreeNode", p, r);
                    q && !q[i] && h && d(e.rows[v])
                        .find("div.treeclick")
                        .click()
                }
            }
        })
})(jQuery);
(function (c) {
    c
        .jgrid
        .extend({
            jqGridImport: function (a) {
                a = c.extend({
                    imptype: "xml",
                    impstring: "",
                    impurl: "",
                    mtype: "GET",
                    impData: {},
                    xmlGrid: {
                        config: "roots>grid",
                        data: "roots>rows"
                    },
                    jsonGrid: {
                        config: "grid",
                        data: "data"
                    },
                    ajaxOptions: {}
                }, a || {});
                return this.each(function () {
                    var d = this,
                        f = function (a, b) {
                            var e = c(b.xmlGrid.config, a)[0],
                                h = c(b.xmlGrid.data, a)[0],
                                f,
                                g;
                            if (xmlJsonClass.xml2json && c.jgrid.parse) {
                                e = xmlJsonClass.xml2json(e, " ");
                                e = c
                                    .jgrid
                                    .parse(e);
                                for (g in e) 
                                    e.hasOwnProperty(g) && (f = e[g]);
                                h
                                    ? (h = e.grid.datatype, e.grid.datatype = "xmlstring", e.grid.datastr = a, c(d).jqGrid(f).jqGrid("setGridParam", {datatype: h}))
                                    : c(d).jqGrid(f)
                            } else 
                                alert("xml2json or parse are not present")
                        },
                        b = function (a, b) {
                            if (a && "string" === typeof a) {
                                var e = !1;
                                c.jgrid.useJSON && (c.jgrid.useJSON = !1, e = !0);
                                var f = c
                                    .jgrid
                                    .parse(a);
                                e && (c.jgrid.useJSON = !0);
                                e = f[b.jsonGrid.config];
                                if (f = f[b.jsonGrid.data]) {
                                    var g = e.datatype;
                                    e.datatype = "jsonstring";
                                    e.datastr = f;
                                    c(d)
                                        .jqGrid(e)
                                        .jqGrid("setGridParam", {datatype: g})
                                } else 
                                    c(d).jqGrid(e)
                            }
                        };
                    switch (a.imptype) {
                        case "xml":
                            c.ajax(c.extend({
                                url: a.impurl,
                                type: a.mtype,
                                data: a.impData,
                                dataType: "xml",
                                complete: function (b, g) {
                                    "success" === g && (f(b.responseXML, a), c(d).triggerHandler("jqGridImportComplete", [b, a]), c.isFunction(a.importComplete) && a.importComplete(b))
                                }
                            }, a.ajaxOptions));
                            break;
                        case "xmlstring":
                            if (a.impstring && "string" === typeof a.impstring) {
                                var g = c.parseXML(a.impstring);
                                g && (f(g, a), c(d).triggerHandler("jqGridImportComplete", [g, a]), c.isFunction(a.importComplete) && a.importComplete(g), a.impstring = null);
                                g = null
                            }
                            break;
                        case "json":
                            c.ajax(c.extend({
                                url: a.impurl,
                                type: a.mtype,
                                data: a.impData,
                                dataType: "json",
                                complete: function (f) {
                                    try {
                                        b(f.responseText, a),
                                        c(d).triggerHandler("jqGridImportComplete", [f, a]),
                                        c.isFunction(a.importComplete) && a.importComplete(f)
                                    } catch (g) {}
                                }
                            }, a.ajaxOptions));
                            break;
                        case "jsonstring":
                            a.impstring && "string" === typeof a.impstring && (b(a.impstring, a), c(d).triggerHandler("jqGridImportComplete", [a.impstring, a]), c.isFunction(a.importComplete) && a.importComplete(a.impstring), a.impstring = null)
                    }
                })
            },
            jqGridExport: function (a) {
                var a = c.extend({
                        exptype: "xmlstring",
                        root: "grid",
                        ident: "\t"
                    }, a || {}),
                    d = null;
                this.each(function () {
                    if (this.grid) {
                        var f,
                            b = c.extend(!0, {}, c(this).jqGrid("getGridParam"));
                        b.rownumbers && (b.colNames.splice(0, 1), b.colModel.splice(0, 1));
                        b.multiselect && (b.colNames.splice(0, 1), b.colModel.splice(0, 1));
                        b.subGrid && (b.colNames.splice(0, 1), b.colModel.splice(0, 1));
                        b.knv = null;
                        if (b.treeGrid) 
                            for (f in b.treeReader) 
                                b.treeReader.hasOwnProperty(f) && (b.colNames.splice(b.colNames.length - 1), b.colModel.splice(b.colModel.length - 1));
                    switch (a.exptype) {
                            case "xmlstring":
                                d = "<" + a.root + ">" + xmlJsonClass.json2xml(b, a.ident) + "</" + a.root + ">";
                                break;
                            case "jsonstring":
                                d = "{" + xmlJsonClass.toJson(b, a.root, a.ident, !1) + "}",
                                void 0 !== b.postData.filters && (d = d.replace(/filters":"/, 'filters":'), d = d.replace(/}]}"/, "}]}"))
                        }
                    }
                });
                return d
            },
            excelExport: function (a) {
                a = c.extend({
                    exptype: "remote",
                    url: null,
                    oper: "oper",
                    tag: "excel",
                    exportOptions: {}
                }, a || {});
                return this.each(function () {
                    if (this.grid) {
                        var d;
                        "remote" === a.exptype && (d = c.extend({}, this.p.postData), d[a.oper] = a.tag, d = jQuery.param(d), d = -1 !== a.url.indexOf("?")
                            ? a.url + "&" + d
                            : a.url + "?" + d, window.location = d)
                    }
                })
            }
        })
})(jQuery);
var xmlJsonClass = {
    xml2json: function (a, b) {
        9 === a.nodeType && (a = a.documentElement);
        var g = this.toJson(this.toObj(this.removeWhite(a)), a.nodeName, "\t");
        return "{\n" + b + (b
            ? g.replace(/\t/g, b)
            : g.replace(/\t|\n/g, "")) + "\n}"
    },
    json2xml: function (a, b) {
        var g = function (a, b, e) {
                var d = "",
                    f,
                    i;
                if (a instanceof Array) 
                    if (0 === a.length) 
                        d += e + "<" + b + ">__EMPTY_ARRAY_</" + b + ">\n";
                    else {
                        f = 0;
                        for (i = a.length; f < i; f += 1) 
                            var l = e + g(a[f], b, e + "\t") + "\n",
                            d = d + l
                    }
                else if ("object" === typeof a) {
                    f = !1;
                    d += e + "<" + b;
                    for (i in a) 
                        a.hasOwnProperty(i) && ("@" === i.charAt(0)
                            ? d += " " + i.substr(1) + '="' + a[i].toString() + '"'
                            : f = !0);
                    d += f
                        ? ">"
                        : "/>";
                    if (f) {
                        for (i in a) 
                            a.hasOwnProperty(i) && ("#text" === i
                                ? d += a[i]
                                : "#cdata" === i
                                    ? d += "<![CDATA[" + a[i] + "]]\>"
                                    : "@" !== i.charAt(0) && (d += g(a[i], i, e + "\t")));
                        d += ("\n" === d.charAt(d.length - 1)
                            ? e
                            : "") + "</" + b + ">"
                    }
                } else 
                    "function" === typeof a
                        ? d += e + "<" + b + "><![CDATA[" + a + "]]\></" + b + ">"
                        : (void 0 === a && (a = ""), d = '""' === a.toString() || 0 === a.toString().length
                            ? d + (e + "<" + b + ">__EMPTY_STRING_</" + b + ">")
                            : d + (e + "<" + b + ">" + a.toString() + "</" + b + ">"));
                return d
            },
            f = "",
            e;
        for (e in a) 
            a.hasOwnProperty(e) && (f += g(a[e], e, ""));
        return b
            ? f.replace(/\t/g, b)
            : f.replace(/\t|\n/g, "")
    },
    toObj: function (a) {
        var b = {},
            g = /function/i;
        if (1 === a.nodeType) {
            if (a.attributes.length) {
                var f;
                for (f = 0; f < a.attributes.length; f += 1) 
                    b["@" + a.attributes[f].nodeName] = (a.attributes[f].nodeValue || "").toString()
            }
            if (a.firstChild) {
                var e = f = 0,
                    h = !1,
                    c;
                for (c = a.firstChild; c; c = c.nextSibling) 
                    1 === c.nodeType
                        ? h = !0
                        : 3 === c.nodeType && c.nodeValue.match(/[^ \f\n\r\t\v]/)
                            ? f += 1
                            : 4 === c.nodeType && (e += 1);
                if (h) 
                    if (2 > f && 2 > e) {
                        this.removeWhite(a);
                        for (c = a.firstChild; c; c = c.nextSibling) 
                            3 === c.nodeType
                                ? b["#text"] = this.escape(c.nodeValue)
                                : 4 === c.nodeType
                                    ? g.test(c.nodeValue)
                                        ? b[c.nodeName] = [
                                            b[c.nodeName],
                                            c.nodeValue
                                        ]
                                        : b["#cdata"] = this.escape(c.nodeValue)
                                    : b[c.nodeName]
                                        ? b[c.nodeName]instanceof Array
                                            ? b[c.nodeName][b[c.nodeName].length] = this.toObj(c)
                                            : b[c.nodeName] = [
                                                b[c.nodeName],
                                                this.toObj(c)
                                            ]
                                        : b[c.nodeName] = this.toObj(c)
                                } else 
                        a.attributes.length
                            ? b["#text"] = this.escape(this.innerXml(a))
                            : b = this.escape(this.innerXml(a));
                else if (f) 
                    a.attributes.length
                        ? b["#text"] = this.escape(this.innerXml(a))
                        : (b = this.escape(this.innerXml(a)), "__EMPTY_ARRAY_" === b
                            ? b = "[]"
                            : "__EMPTY_STRING_" === b && (b = ""));
                else if (e) 
                    if (1 < e) 
                        b = this.escape(this.innerXml(a));
                    else 
                        for (c = a.firstChild; c; c = c.nextSibling) 
                            if (g.test(a.firstChild.nodeValue)) {
                                b = a.firstChild.nodeValue;
                                break
                            }
                        else 
                    b["#cdata"] = this.escape(c.nodeValue)
            }
            !a.attributes.length && !a.firstChild && (b = null)
        } else 
            9 === a.nodeType
                ? b = this.toObj(a.documentElement)
                : alert("unhandled node type: " + a.nodeType);
        return b
    },
    toJson: function (a, b, g, f) {
        void 0 === f && (f = !0);
        var e = b
                ? '"' + b + '"'
                : "",
            h = "\t",
            c = "\n";
        f || (c = h = "");
        if ("[]" === a) 
            e += b
                ? ":[]"
                : "[]";
        else if (a instanceof Array) {
            var j,
                d,
                k = [];
            d = 0;
            for (j = a.length; d < j; d += 1) 
                k[d] = this.toJson(a[d], "", g + h, f);
            e += (b
                ? ":["
                : "[") + (1 < k.length
                ? c + g + h + k.join("," + c + g + h) + c + g
                : k.join("")) + "]"
        } else if (null === a) 
            e += (b && ":") + "null";
        else if ("object" === typeof a) {
            j = [];
            for (d in a) 
                a.hasOwnProperty(d) && (j[j.length] = this.toJson(a[d], d, g + h, f));
            e += (b
                ? ":{"
                : "{") + (1 < j.length
                ? c + g + h + j.join("," + c + g + h) + c + g
                : j.join("")) + "}"
        } else 
            e = "string" === typeof a
                ? e + ((b && ":") + '"' + a.replace(/\\/g, "\\\\").replace(/\"/g, '\\"') + '"')
                : e + ((b && ":") + a.toString());
        return e
    },
    innerXml: function (a) {
        var b = "";
        if ("innerHTML" in a) 
            b = a.innerHTML;
        else 
            for (var g = function (a) {
                var b = "",
                    h;
                if (1 === a.nodeType) {
                    b += "<" + a.nodeName;
                    for (h = 0; h < a.attributes.length; h += 1) 
                        b += " " + a.attributes[h].nodeName + '="' + (a.attributes[h].nodeValue || "").toString() + '"';
                    if (a.firstChild) {
                        b += ">";
                        for (h = a.firstChild; h; h = h.nextSibling) 
                            b += g(h);
                        b += "</" + a.nodeName + ">"
                    } else 
                        b += "/>"
                } else 
                    3 === a.nodeType
                        ? b += a.nodeValue
                        : 4 === a.nodeType && (b += "<![CDATA[" + a.nodeValue + "]]\>");
                return b
            },
            a = a.firstChild; a; a = a.nextSibling) 
                b += g(a);
    return b
    },
    escape: function (a) {
        return a
            .replace(/[\\]/g, "\\\\")
            .replace(/[\"]/g, '\\"')
            .replace(/[\n]/g, "\\n")
            .replace(/[\r]/g, "\\r")
    },
    removeWhite: function (a) {
        a.normalize();
        var b;
        for (b = a.firstChild; b;) 
            if (3 === b.nodeType) 
                if (b.nodeValue.match(/[^ \f\n\r\t\v]/)) 
                    b = b.nextSibling;
                else {
                    var g = b.nextSibling;
                    a.removeChild(b);
                    b = g
                }
            else 
            1 === b.nodeType && this.removeWhite(b),
            b = b.nextSibling;
        return a
    }
};
function tableToGrid(j, k) {
    jQuery(j)
        .each(function () {
            if (!this.grid) {
                jQuery(this).width("99%");
                var b = jQuery(this).width(),
                    c = jQuery("tr td:first-child input[type=checkbox]:first", jQuery(this)),
                    a = jQuery("tr td:first-child input[type=radio]:first", jQuery(this)),
                    c = 0 < c.length,
                    a = !c && 0 < a.length,
                    i = c || a,
                    d = [],
                    e = [];
                jQuery("th", jQuery(this)).each(function () {
                    0 === d.length && i
                        ? (d.push({
                            name: "__selection__",
                            index: "__selection__",
                            width: 0,
                            hidden: !0
                        }), e.push("__selection__"))
                        : (d.push({
                            name: jQuery(this).attr("id") || jQuery
                                .trim(jQuery.jgrid.stripHtml(jQuery(this).html()))
                                .split(" ")
                                .join("_"),
                            index: jQuery(this).attr("id") || jQuery
                                .trim(jQuery.jgrid.stripHtml(jQuery(this).html()))
                                .split(" ")
                                .join("_"),
                            width: jQuery(this).width() || 150
                        }), e.push(jQuery(this).html()))
                });
                var f = [],
                    g = [],
                    h = [];
                jQuery("tbody > tr", jQuery(this)).each(function () {
                    var b = {},
                        a = 0;
                    jQuery("td", jQuery(this)).each(function () {
                        if (0 === a && i) {
                            var c = jQuery("input", jQuery(this)),
                                e = c.attr("value");
                            g.push(e || f.length);
                            c.is(":checked") && h.push(e);
                            b[d[a].name] = c.attr("value")
                        } else 
                            b[d[a].name] = jQuery(this).html();
                        a++
                    });
                    0 < a && f.push(b)
                });
                jQuery(this).empty();
                jQuery(this).addClass("scroll");
                jQuery(this).jqGrid(jQuery.extend({
                    datatype: "local",
                    width: b,
                    colNames: e,
                    colModel: d,
                    multiselect: c
                }, k || {}));
                for (b = 0; b < f.length; b++) 
                    a = null,
                    0 < g.length && (a = g[b]) && a.replace && (a = encodeURIComponent(a).replace(/[.\-%]/g, "_")),
                    null === a && (a = b + 1),
                    jQuery(this).jqGrid("addRowData", a, f[b]);
                for (b = 0; b < h.length; b++) 
                    jQuery(this).jqGrid("setSelection", h[b])
            }
        })
};
(function (b) {
    b.jgrid.msie && 8 === b
        .jgrid
        .msiever() && (b.expr[":"].hidden = function (b) {
        return 0 === b.offsetWidth || 0 === b.offsetHeight || "none" === b.style.display
    });
    b.jgrid._multiselect = !1;
    if (b.ui && b.ui.multiselect) {
        if (b.ui.multiselect.prototype._setSelected) {
            var o = b.ui.multiselect.prototype._setSelected;
            b.ui.multiselect.prototype._setSelected = function (a, d) {
                var c = o.call(this, a, d);
                if (d && this.selectedList) {
                    var e = this.element;
                    this
                        .selectedList
                        .find("li")
                        .each(function () {
                            b(this).data("optionLink") && b(this)
                                .data("optionLink")
                                .remove()
                                .appendTo(e)
                        })
                }
                return c
            }
        }
        b.ui.multiselect.prototype.destroy && (b.ui.multiselect.prototype.destroy = function () {
            this
                .element
                .show();
            this
                .container
                .remove();
            b.Widget === void 0
                ? b
                    .widget
                    .prototype
                    .destroy
                    .apply(this, arguments)
                : b
                    .Widget
                    .prototype
                    .destroy
                    .apply(this, arguments)
        });
        b.jgrid._multiselect = !0
    }
    b
        .jgrid
        .extend({
            sortableColumns: function (a) {
                return this.each(function () {
                    function d() {
                        c.p.disableClick = true
                    }
                    var c = this,
                        e = b
                            .jgrid
                            .jqID(c.p.id),
                        e = {
                            tolerance: "pointer",
                            axis: "x",
                            scrollSensitivity: "1",
                            items: ">th:not(:has(#jqgh_" + e + "_cb,#jqgh_" + e + "_rn,#jqgh_" + e + "_subgrid),:hidden)",
                            placeholder: {
                                element: function (a) {
                                    return b(document.createElement(a[0].nodeName))
                                        .addClass(a[0].className + " ui-sortable-placeholder ui-state-highlight")
                                        .removeClass("ui-sortable-helper")[0]
                                },
                                update: function (b, a) {
                                    a.height(b.currentItem.innerHeight() - parseInt(b.currentItem.css("paddingTop") || 0, 10) - parseInt(b.currentItem.css("paddingBottom") || 0, 10));
                                    a.width(b.currentItem.innerWidth() - parseInt(b.currentItem.css("paddingLeft") || 0, 10) - parseInt(b.currentItem.css("paddingRight") || 0, 10))
                                }
                            },
                            update: function (a, e) {
                                var d = b(e.item).parent(),
                                    d = b(">th", d),
                                    f = {},
                                    g = c.p.id + "_";
                                b.each(c.p.colModel, function (b) {
                                    f[this.name] = b
                                });
                                var j = [];
                                d.each(function () {
                                    var a = b(">div", this)
                                        .get(0)
                                        .id
                                        .replace(/^jqgh_/, "")
                                        .replace(g, "");
                                    f.hasOwnProperty(a) && j.push(f[a])
                                });
                                b(c).jqGrid("remapColumns", j, true, true);
                                b.isFunction(c.p.sortable.update) && c
                                    .p
                                    .sortable
                                    .update(j);
                                setTimeout(function () {
                                    c.p.disableClick = false
                                }, 50)
                            }
                        };
                    if (c.p.sortable.options) 
                        b.extend(e, c.p.sortable.options);
                    else if (b.isFunction(c.p.sortable)) 
                        c.p.sortable = {
                            update: c.p.sortable
                        };
                    if (e.start) {
                        var g = e.start;
                        e.start = function (b, a) {
                            d();
                            g.call(this, b, a)
                        }
                    } else 
                        e.start = d;
                    if (c.p.sortable.exclude) 
                        e.items = e.items + (":not(" + c.p.sortable.exclude + ")");
                    a
                        .sortable(e)
                        .data("sortable")
                        .floating = true
                })
            },
            columnChooser: function (a) {
                function d(a, c) {
                    a && (typeof a === "string"
                        ? b.fn[a] && b.fn[a].apply(c, b.makeArray(arguments).slice(2))
                        : b.isFunction(a) && a.apply(c, b.makeArray(arguments).slice(2)))
                }
                var c = this;
                if (!b("#colchooser_" + b.jgrid.jqID(c[0].p.id)).length) {
                    var e = b('<div id="colchooser_' + c[0].p.id + '" style="position:relative;overflow:hidden"><div><select multiple="multiple"></s' +
                                'elect></div></div>'),
                        g = b("select", e),
                        a = b.extend({
                            width: 420,
                            height: 240,
                            classname: null,
                            done: function (b) {
                                b && c.jqGrid("remapColumns", b, true)
                            },
                            msel: "multiselect",
                            dlog: "dialog",
                            dialog_opts: {
                                minWidth: 470
                            },
                            dlog_opts: function (a) {
                                var c = {};
                                c[a.bSubmit] = function () {
                                    a.apply_perm();
                                    a.cleanup(false)
                                };
                                c[a.bCancel] = function () {
                                    a.cleanup(true)
                                };
                                return b.extend(true, {
                                    buttons: c,
                                    close: function () {
                                        a.cleanup(true)
                                    },
                                    modal: a.modal || false,
                                    resizable: a.resizable || true,
                                    width: a.width + 20
                                }, a.dialog_opts || {})
                            },
                            apply_perm: function () {
                                b("option", g)
                                    .each(function () {
                                        this.selected
                                            ? c.jqGrid("showCol", i[this.value].name)
                                            : c.jqGrid("hideCol", i[this.value].name)
                                    });
                                var e = [];
                                b("option:selected", g).each(function () {
                                    e.push(parseInt(this.value, 10))
                                });
                                b.each(e, function () {
                                    delete m[i[parseInt(this, 10)].name]
                                });
                                b.each(m, function () {
                                    var b = parseInt(this, 10);
                                    var a = e,
                                        c = b;
                                    if (c >= 0) {
                                        var d = a.slice(),
                                            i = d.splice(c, Math.max(a.length - c, c));
                                        if (c > a.length) 
                                            c = a.length;
                                        d[c] = b;
                                        e = d.concat(i)
                                    } else 
                                        e = void 0
                                });
                                a.done && a
                                    .done
                                    .call(c, e)
                            },
                            cleanup: function (b) {
                                d(a.dlog, e, "destroy");
                                d(a.msel, g, "destroy");
                                e.remove();
                                b && a.done && a
                                    .done
                                    .call(c)
                            },
                            msel_opts: {}
                        }, b.jgrid.col, a || {});
                    if (b.ui && b.ui.multiselect && a.msel === "multiselect") {
                        if (!b.jgrid._multiselect) {
                            alert("Multiselect plugin loaded after jqGrid. Please load the plugin before the jqGrid" +
                                    "!");
                            return
                        }
                        a.msel_opts = b.extend(b.ui.multiselect.defaults, a.msel_opts)
                    }
                    a.caption && e.attr("title", a.caption);
                    if (a.classname) {
                        e.addClass(a.classname);
                        g.addClass(a.classname)
                    }
                    if (a.width) {
                        b(">div", e).css({width: a.width, margin: "0 auto"});
                        g.css("width", a.width)
                    }
                    if (a.height) {
                        b(">div", e).css("height", a.height);
                        g.css("height", a.height - 10)
                    }
                    var i = c.jqGrid("getGridParam", "colModel"),
                        q = c.jqGrid("getGridParam", "colNames"),
                        m = {},
                        f = [];
                    g.empty();
                    b.each(i, function (a) {
                        m[this.name] = a;
                        this.hidedlg
                            ? this.hidden || f.push(a)
                            : g.append("<option value='" + a + "' " + (this.hidden
                                ? ""
                                : "selected='selected'") + ">" + b.jgrid.stripHtml(q[a]) + "</option>")
                    });
                    var n = b.isFunction(a.dlog_opts)
                        ? a
                            .dlog_opts
                            .call(c, a)
                        : a.dlog_opts;
                    d(a.dlog, e, n);
                    n = b.isFunction(a.msel_opts)
                        ? a
                            .msel_opts
                            .call(c, a)
                        : a.msel_opts;
                    d(a.msel, g, n)
                }
            },
            sortableRows: function (a) {
                return this.each(function () {
                    var d = this;
                    if (d.grid && !d.p.treeGrid && b.fn.sortable) {
                        a = b.extend({
                            cursor: "move",
                            axis: "y",
                            items: ".jqgrow"
                        }, a || {});
                        if (a.start && b.isFunction(a.start)) {
                            a._start_ = a.start;
                            delete a.start
                        } else 
                            a._start_ = false;
                        if (a.update && b.isFunction(a.update)) {
                            a._update_ = a.update;
                            delete a.update
                        } else 
                            a._update_ = false;
                        a.start = function (c, e) {
                            b(e.item).css("border-width", "0px");
                            b("td", e.item).each(function (b) {
                                this.style.width = d.grid.cols[b].style.width
                            });
                            if (d.p.subGrid) {
                                var g = b(e.item).attr("id");
                                try {
                                    b(d).jqGrid("collapseSubGridRow", g)
                                } catch (i) {}
                            }
                            a._start_ && a
                                ._start_
                                .apply(this, [c, e])
                        };
                        a.update = function (c, e) {
                            b(e.item).css("border-width", "");
                            d.p.rownumbers === true && b("td.jqgrid-rownum", d.rows).each(function (a) {
                                b(this).html(a + 1 + (parseInt(d.p.page, 10) - 1) * parseInt(d.p.rowNum, 10))
                            });
                            a._update_ && a
                                ._update_
                                .apply(this, [c, e])
                        };
                        b("tbody:first", d).sortable(a);
                        b("tbody:first", d).disableSelection()
                    }
                })
            },
            gridDnD: function (a) {
                return this.each(function () {
                    function d() {
                        var a = b.data(c, "dnd");
                        b("tr.jqgrow:not(.ui-draggable)", c).draggable(b.isFunction(a.drag)
                            ? a.drag.call(b(c), a)
                            : a.drag)
                    }
                    var c = this,
                        e,
                        g;
                    if (c.grid && !c.p.treeGrid && b.fn.draggable && b.fn.droppable) {
                        b("#jqgrid_dnd")[0] === void 0 && b("body").append("<table id='jqgrid_dnd' class='ui-jqgrid-dnd'></table>");
                        if (typeof a === "string" && a === "updateDnD" && c.p.jqgdnd === true) 
                            d();
                        else {
                            a = b.extend({
                                drag: function (a) {
                                    return b.extend({
                                        start: function (e, d) {
                                            var f;
                                            if (c.p.subGrid) {
                                                f = b(d.helper).attr("id");
                                                try {
                                                    b(c).jqGrid("collapseSubGridRow", f)
                                                } catch (g) {}
                                            }
                                            for (f = 0; f < b.data(c, "dnd").connectWith.length; f++) 
                                                b(b.data(c, "dnd").connectWith[f]).jqGrid("getGridParam", "reccount") === 0 && b(b.data(c, "dnd").connectWith[f]).jqGrid("addRowData", "jqg_empty_row", {});
                                            d
                                                .helper
                                                .addClass("ui-state-highlight");
                                            b("td", d.helper).each(function (b) {
                                                this.style.width = c.grid.headers[b].width + "px"
                                            });
                                            a.onstart && b.isFunction(a.onstart) && a
                                                .onstart
                                                .call(b(c), e, d)
                                        },
                                        stop: function (e, d) {
                                            var f;
                                            if (d.helper.dropped && !a.dragcopy) {
                                                f = b(d.helper).attr("id");
                                                f === void 0 && (f = b(this).attr("id"));
                                                b(c).jqGrid("delRowData", f)
                                            }
                                            for (f = 0; f < b.data(c, "dnd").connectWith.length; f++) 
                                                b(b.data(c, "dnd").connectWith[f]).jqGrid("delRowData", "jqg_empty_row");
                                            a.onstop && b.isFunction(a.onstop) && a
                                                .onstop
                                                .call(b(c), e, d)
                                        }
                                    }, a.drag_opts || {})
                                },
                                drop: function (a) {
                                    return b.extend({
                                        accept: function (a) {
                                            if (!b(a).hasClass("jqgrow")) 
                                                return a;
                                            a = b(a).closest("table.ui-jqgrid-btable");
                                            if (a.length > 0 && b.data(a[0], "dnd") !== void 0) {
                                                a = b.data(a[0], "dnd").connectWith;
                                                return b.inArray("#" + b.jgrid.jqID(this.id), a) !== -1
                                                    ? true
                                                    : false
                                            }
                                            return false
                                        },
                                        drop: function (e, d) {
                                            if (b(d.draggable).hasClass("jqgrow")) {
                                                var f = b(d.draggable).attr("id"),
                                                    f = d
                                                        .draggable
                                                        .parent()
                                                        .parent()
                                                        .jqGrid("getRowData", f);
                                                if (!a.dropbyname) {
                                                    var g = 0,
                                                        j = {},
                                                        h,
                                                        l,
                                                        p = b("#" + b.jgrid.jqID(this.id)).jqGrid("getGridParam", "colModel");
                                                    try {
                                                        for (l in f) 
                                                            if (f.hasOwnProperty(l)) {
                                                                h = p[g].name;
                                                                h === "cb" || h === "rn" || h === "subgrid" || f.hasOwnProperty(l) && p[g] && (j[h] = f[l]);
                                                                g++
                                                            }
                                                        f = j
                                                    } catch (o) {}
                                                }
                                                d.helper.dropped = true;
                                                if (a.beforedrop && b.isFunction(a.beforedrop)) {
                                                    h = a
                                                        .beforedrop
                                                        .call(this, e, d, f, b("#" + b.jgrid.jqID(c.p.id)), b(this));
                                                    h !== void 0 && h !== null && typeof h === "object" && (f = h)
                                                }
                                                if (d.helper.dropped) {
                                                    var k;
                                                    if (a.autoid) 
                                                        if (b.isFunction(a.autoid)) 
                                                            k = a.autoid.call(this, f);
                                                        else {
                                                            k = Math.ceil(Math.random() * 1E3);
                                                            k = a.autoidprefix + k
                                                        }
                                                    b("#" + b.jgrid.jqID(this.id)).jqGrid("addRowData", k, f, a.droppos)
                                                }
                                                a.ondrop && b.isFunction(a.ondrop) && a
                                                    .ondrop
                                                    .call(this, e, d, f)
                                            }
                                        }
                                    }, a.drop_opts || {})
                                },
                                onstart: null,
                                onstop: null,
                                beforedrop: null,
                                ondrop: null,
                                drop_opts: {
                                    activeClass: "ui-state-active",
                                    hoverClass: "ui-state-hover"
                                },
                                drag_opts: {
                                    revert: "invalid",
                                    helper: "clone",
                                    cursor: "move",
                                    appendTo: "#jqgrid_dnd",
                                    zIndex: 5E3
                                },
                                dragcopy: false,
                                dropbyname: false,
                                droppos: "first",
                                autoid: true,
                                autoidprefix: "dnd_"
                            }, a || {});
                            if (a.connectWith) {
                                a.connectWith = a
                                    .connectWith
                                    .split(",");
                                a.connectWith = b.map(a.connectWith, function (a) {
                                    return b.trim(a)
                                });
                                b.data(c, "dnd", a);
                                c.p.reccount !== 0 && !c.p.jqgdnd && d();
                                c.p.jqgdnd = true;
                                for (e = 0; e < a.connectWith.length; e++) {
                                    g = a.connectWith[e];
                                    b(g).droppable(b.isFunction(a.drop)
                                        ? a.drop.call(b(c), a)
                                        : a.drop)
                                }
                            }
                        }
                    }
                })
            },
            gridResize: function (a) {
                return this.each(function () {
                    var d = this,
                        c = b
                            .jgrid
                            .jqID(d.p.id);
                    if (d.grid && b.fn.resizable) {
                        a = b.extend({}, a || {});
                        if (a.alsoResize) {
                            a._alsoResize_ = a.alsoResize;
                            delete a.alsoResize
                        } else 
                            a._alsoResize_ = false;
                        if (a.stop && b.isFunction(a.stop)) {
                            a._stop_ = a.stop;
                            delete a.stop
                        } else 
                            a._stop_ = false;
                        a.stop = function (e, g) {
                            b(d).jqGrid("setGridParam", {
                                height: b("#gview_" + c + " .ui-jqgrid-bdiv").height()
                            });
                            b(d).jqGrid("setGridWidth", g.size.width, a.shrinkToFit);
                            a._stop_ && a
                                ._stop_
                                .call(d, e, g)
                        };
                        a.alsoResize = a._alsoResize_
                            ? eval("(" + ("{'#gview_" + c + " .ui-jqgrid-bdiv':true,'" + a._alsoResize_ + "':true}") + ")")
                            : b(".ui-jqgrid-bdiv", "#gview_" + c);
                        delete a._alsoResize_;
                        b("#gbox_" + c).resizable(a)
                    }
                })
            }
        })
})(jQuery);
