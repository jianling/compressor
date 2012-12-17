magic.Calendar = baidu.lang.createClass(function(e) {
    var t = this;
    t._options = baidu.object.extend({
        weekStart: "sun",
        initDate: baidu.i18n.date.toLocaleDate(new Date),
        highlightDates: [],
        disabledDates: [],
        disabledDayOfWeek: [],
        language: "zh-CN"
    }, e || {}), t.currentDate = new Date(t._options.initDate), t.selectedDate = new Date(t._options.initDate), t.dayNames = [];
}, {
    type: "magic.Calendar",
    superClass: magic.Base
}), magic.Calendar.extend({
    tplSkeleton: '<div id="#{calendarId}" class="#{calendarClass}"><div id="#{titleId}" class="#{titleClass}"></div><div id="#{tableId}" class="#{tableClass}"></div></div>',
    tplDate: '<td id="#{id}" class="#{class}" onmouseover="#{mouseover}" onmouseout="#{mouseout}" onclick="#{click}">#{date}</td>',
    render: function(e) {
        var t = this;
        "string" === baidu.type(e) && (e = "#" + e), t.container = baidu(e)[0], t._renderSkeleton(), t._renderTitle(), t._renderDateTable(), t._renderNavBtn(), t._bindTable(), t._bindNavBtn(), t._addkeystrokesListener(), t.fire("render");
    },
    _rerender: function() {
        var e = this;
        e._renderTitle(), e._renderDateTable(), e._bindTable();
    },
    _getId: function(e) {
        return this._eid + (void 0 === e ? "tang_calendar" : "tang_calendar_" + e);
    },
    _getClass: function(e) {
        return void 0 === e ? "tang-calendar" : "tang-calendar-" + e;
    },
    _renderSkeleton: function() {
        var e = this, t = e.container;
        baidu(t).insertHTML("beforeEnd", baidu.string.format(e.tplSkeleton, {
            calendarId: e._getId(),
            calendarClass: e._getClass(),
            titleId: e._getId("title"),
            titleClass: e._getClass("title"),
            tableId: e._getId("table"),
            tableClass: e._getClass("table")
        })), e.titleEl = baidu("#" + e._getId("title"))[0], e.tableEl = baidu("#" + e._getId("table"))[0], e.$mappingDom("", baidu("#" + e._getId())[0]), e.$mappingDom("calendar", baidu("#" + e._getId())[0]), e.$mappingDom("title", e.titleEl), e.$mappingDom("table", e.tableEl);
    },
    _renderTitle: function() {
        var e = this, t = e.currentDate, n = t.getFullYear(), r = t.getMonth() + 1;
        e.titleEl.innerHTML = baidu.string.format(baidu.i18n.cultures[e._options.language].calendar.titleNames, {
            yyyy: n,
            MM: baidu.i18n.cultures[e._options.language].calendar.monthNamesShort[r - 1]
        });
    },
    _renderDateTable: function() {
        var e = this._getTheadString(), t = this._getTbodyString();
        this.tableEl.innerHTML = '<table border="0" cellpadding="0" cellspacing="0">' + e + t + "</table>";
    },
    _renderNavBtn: function() {
        var e = this, t = baidu("#" + e._getId())[0], n = document, r = n.createElement("div"), i = n.createElement("div"), s = n.createElement("div"), o = n.createElement("div");
        r.className = e._getClass("prebtn"), i.className = e._getClass("nextbtn"), s.className = e._getClass("yprebtn"), o.className = e._getClass("ynextbtn"), t.appendChild(r), t.appendChild(i), t.appendChild(s), t.appendChild(o), e.preBtn = r, e.nextBtn = i, e.ypreBtn = s, e.ynextBtn = o, e.$mappingDom("premonthbtn", r), e.$mappingDom("nextmonthbtn", i), e.$mappingDom("preyearbtn", s), e.$mappingDom("preyearhbtn", o);
    },
    _bindNavBtn: function() {
        var e, t, n, r, i, s, o, u, a, f = this, l = f.preBtn, c = f.nextBtn, h = f.ypreBtn, p = f.ynextBtn, d = !1;
        baidu(l).on("click", e = function() {
            !d && f.preMonth(), d = !1, f.fire("premonth");
        }), baidu(c).on("click", t = function() {
            !d && f.nextMonth(), d = !1, f.fire("nextmonth");
        }), baidu(h).on("click", n = function() {
            !d && f.preYear(), d = !1, f.fire("preyear");
        }), baidu(p).on("click", r = function() {
            !d && f.nextYear(), d = !1, f.fire("nextyear");
        });
        var v = null, m = function(e, t) {
            function n() {
                v = setTimeout(function() {
                    t ? "pre" == e ? f.preYear() : f.nextYear() : "pre" == e ? f.preMonth() : f.nextMonth(), d = !0, n();
                }, 500);
            }
            v || n();
        }, g = function() {
            clearTimeout(v), v = null;
        };
        baidu(l).on("mousedown", i = function() {
            m("pre");
        }), baidu(c).on("mousedown", s = function() {
            m("next");
        }), baidu(h).on("mousedown", o = function() {
            m("pre", !0);
        }), baidu(p).on("mousedown", u = function() {
            m("next", !0);
        }), baidu(document).on("mouseup", a = function() {
            f.disposed || v && g();
        }), f.on("dispose", function() {
            baidu(l).off("click", e), baidu(c).off("click", t), baidu(h).off("click", n), baidu(p).off("click", r), baidu(l).off("mousedown", i), baidu(c).off("mousedown", s), baidu(h).off("mousedown", o), baidu(p).off("mousedown", u), baidu(document).off("mouseup", a);
        });
    },
    _getTheadString: function() {
        var e, t = this, n = [ "mon", "tue", "wed", "thu", "fri", "sat", "sun" ], r = [], i = t._options.weekStart.toLowerCase(), s = baidu.array.indexOf(n, i), o = baidu.i18n.cultures[t._options.language].calendar.dayNames, u = 0;
        for (r.push('<thead class="' + t._getClass("weekdays") + '"><tr>'); 7 > u; u++) s > 6 && (s = 0), t.dayNames.push(n[s]), e = o[n[s]], r.push("<th>" + e + "</th>"), s++;
        return r.push("</tr></thead>"), r.join("");
    },
    _getTbodyString: function() {
        var e, t = this, n = t.dayNames, r = [ "sun", "mon", "tue", "wed", "thu", "fri", "sat" ], i = new Date(t.currentDate), s = 0, o = [], u = baidu.i18n.date.getDaysInMonth(i.getFullYear(), i.getMonth()), a = 5, f = "", l = "";
        i.setDate(1), e = i.getDay(), s = baidu.array.indexOf(n, r[e]), s + u > 35 && (a = 6), i.setDate(i.getDate() - s);
        for (var c = 0, h = 0, p = ""; a > c; c++) {
            for (o.push("<tr>"); 7 > h; h++) p = t._getClass("date"), f = "", (0 == i.getDay() || 6 == i.getDay()) && (p += " " + t._getClass("weekend")), t._datesEqual(baidu.i18n.date.toLocaleDate(new Date), i) && (p += " " + t._getClass("today")), t._datesContains(t._options.highlightDates, i) && (p += " " + t._getClass("highlight")), t._datesContains(t._options.disabledDates, i) && (p += " " + t._getClass("disable")), t._dayOfWeekInDisabled(i.getDay()) && (p += " " + t._getClass("disable")), t._datesEqual(t.selectedDate, i) && (p += " " + t._getClass("selected"), f = 'id="' + t._getId("selected") + '"'), i.getMonth() < t.currentDate.getMonth() || i.getFullYear() < t.currentDate.getFullYear() ? p += " " + t._getClass("premonth") : (i.getMonth() > t.currentDate.getMonth() || i.getFullYear() > t.currentDate.getFullYear()) && (p += " " + t._getClass("nextmonth")), l = t._formatDate(new Date(i.getFullYear() + "/" + (i.getMonth() + 1) + "/" + i.getDate())), o.push("<td " + f + ' class="' + p + '" date="' + l + '" onmouseover=baiduInstance("' + t.guid + '")._mouseoverHandler(event) onmouseout=baiduInstance("' + t.guid + '")._mouseoutHandler(event)>' + i.getDate() + "</td>"), i.setDate(i.getDate() + 1);
            o.push("</tr>"), h = 0;
        }
        return "<tbody>" + o.join("") + "</tbody>";
    },
    _formatDate: function(e) {
        var t = e.getFullYear(), n = e.getMonth() + 1, r = e.getDate();
        return n = n >= 10 ? n : "0" + n, r = r >= 10 ? r : "0" + r, t + "/" + n + "/" + r;
    },
    _mouseoverHandler: function(e) {
        var t, n = this;
        t = baidu.event(e).target, baidu(t).addClass(n._getClass("hover")), n.fire("mouseover", {
            target: t
        });
    },
    _mouseoutHandler: function(e) {
        var t, n = this;
        t = baidu.event(e).target, baidu(t).removeClass(n._getClass("hover")), n.fire("mouseout", {
            target: t
        });
    },
    _bindTable: function() {
        var e, t, n, r, i, s = this, o = baidu("#" + s._getId("table"))[0].getElementsByTagName("tbody")[0];
        baidu(o).on("click", i = function(i) {
            if (e = i.target, "TD" == e.tagName.toUpperCase()) {
                t = e.getAttribute("date"), n = new Date(t);
                var o = s.selectedDate;
                n.setHours(o.getHours()), n.setMinutes(o.getMinutes()), n.setSeconds(o.getSeconds()), s._datesContains(s._options.disabledDates, n) || s._dayOfWeekInDisabled(n.getDay()) || (r = baidu("#" + s._getId("selected"))[0], r && (r.id = "", baidu(r).removeClass(s._getClass("selected"))), e.id = s._getId("selected"), baidu(e).addClass(s._getClass("selected")), t = s._formatDate(n), s.selectedDate = new Date(t), s.fire("selectdate", {
                    date: new Date(t)
                }));
            }
        }), s.on("dispose", function() {
            baidu(o).off("click", i);
        });
    },
    _addkeystrokesListener: function() {
        function e(e) {
            e = e || window.event;
            var t = !0;
            switch (e.keyCode) {
              case 33:
                n.preMonth();
                break;
              case 34:
                n.nextMonth();
                break;
              case 37:
                n._preDay();
                break;
              case 38:
                n._preDay();
                break;
              case 39:
                n._nextDay();
                break;
              case 40:
                n._nextDay();
                break;
              default:
                t = !1;
            }
            t && e.preventDefault();
        }
        var t, n = this, r = !1, i = baidu("#" + n._getId())[0];
        baidu(document).on("click", t = function(t) {
            if (!n.disposed) {
                var s = t.target;
                if (baidu.dom.contains(i, s) || s == i) {
                    if (r) return;
                    baidu(document).on("keydown", e), r = !0;
                } else baidu(document).off("keydown", e), r = !1;
            }
        }), n.on("dispose", function() {
            baidu(document).off("click", t);
        });
    },
    _datesEqual: function(e, t) {
        if ("date" == baidu.type(e) && "date" == baidu.type(t)) {
            var n = e.getFullYear(), r = e.getMonth(), i = e.getDate(), s = t.getFullYear(), o = t.getMonth(), u = t.getDate();
            return n == s && r == o && i == u;
        }
    },
    _days: {
        mon: 1,
        tue: 2,
        wed: 3,
        thu: 4,
        fri: 5,
        sat: 6,
        sun: 0
    },
    _dayOfWeekInDisabled: function(e) {
        for (var t, n = this._options.disabledDayOfWeek, r = this._days, i = !1, s = 0; n.length > s && (t = n[s], "object" == typeof t ? e >= (r[t.start] || 0) && r[t.end] >= e && (i = !0) : r[t] == e && (i = !0), !i); s++) ;
        return i;
    },
    _datesContains: function(e, t) {
        var n, r = this, i = 0, s = e.length;
        if ("date" == baidu.type(t)) {
            for (; s > i; i++) if (n = e[i], baidu.lang.isDate(n)) {
                if (r._datesEqual(n, t)) return !0;
            } else if (n.end && (n.end = new Date(baidu.date.format(n.end, "yyyy/MM/dd") + " 23:59:59")), (!n.start || t.getTime() >= n.start.getTime()) && (!n.end || t.getTime() <= n.end.getTime())) return !0;
            return !1;
        }
    },
    go: function(e, t) {
        var n = this;
        n.currentDate.setFullYear(e), n.currentDate.setDate(1), t = void 0 === t ? n.currentDate.getMonth() : t - 1, n.currentDate.setMonth(t), n._rerender();
    },
    getDate: function() {
        return new Date(this.selectedDate);
    },
    setDate: function(e) {
        var t = this, n = new Date(e);
        if ("date" != baidu.type(e)) return !1;
        if (!t._datesContains(t._options.disabledDates, n) && !t._dayOfWeekInDisabled(n.getDay())) return t.currentDate = new Date(e), t.selectedDate = new Date(e), t._rerender(), !0;
    },
    preMonth: function() {
        var e = this, t = e.currentDate, n = t.getMonth() + 1, r = t.getFullYear();
        e.go(r, n - 1);
    },
    nextMonth: function() {
        var e = this, t = e.currentDate, n = t.getMonth() + 1, r = t.getFullYear();
        e.go(r, n + 1);
    },
    preYear: function() {
        var e = this, t = e.currentDate;
        e.go(t.getFullYear() - 1, t.getMonth() + 1);
    },
    nextYear: function() {
        var e = this, t = e.currentDate;
        e.go(t.getFullYear() + 1, t.getMonth() + 1);
    },
    _preDay: function() {
        var e = this, t = new Date(e.selectedDate);
        t.setDate(t.getDate() - 1), e.setDate(t), e.fire("selectdate", {
            date: t
        });
    },
    _nextDay: function() {
        var e = this, t = new Date(e.selectedDate);
        t.setDate(t.getDate() + 1), e.setDate(t), e.fire("selectdate", {
            date: t
        });
    },
    $dispose: function() {
        var e = this;
        e.disposed || (e.container.removeChild(baidu("#" + e._getId())[0]), magic.Base.prototype.$dispose.call(e));
    }
});