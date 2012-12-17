magic.Calendar = baidu.lang.createClass(function(e) {
    var t = this, n = "年份";
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
        baidu.type(e) === "string" && (e = "#" + e), t.container = baidu(e)[0], t._renderSkeleton(), t._renderTitle(), t._renderDateTable(), t._renderNavBtn(), t._bindTable(), t._bindNavBtn(), t._addkeystrokesListener(), t.fire("render");
    },
    _rerender: function() {
        var e = this;
        e._renderTitle(), e._renderDateTable(), e._bindTable();
    },
    _getId: function(e) {
        return this._eid + (e === undefined ? "tang_calendar" : "tang_calendar_" + e);
    },
    _getClass: function(e) {
        return e === undefined ? "tang-calendar" : "tang-calendar-" + e;
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
        var e = this, t = e.preBtn, n = e.nextBtn, r = e.ypreBtn, i = e.ynextBtn, s = !1, o, u, a, f, l, c, h, p, d;
        baidu(t).on("click", o = function() {
            !s && e.preMonth(), s = !1, e.fire("premonth");
        }), baidu(n).on("click", u = function() {
            !s && e.nextMonth(), s = !1, e.fire("nextmonth");
        }), baidu(r).on("click", a = function() {
            !s && e.preYear(), s = !1, e.fire("preyear");
        }), baidu(i).on("click", f = function() {
            !s && e.nextYear(), s = !1, e.fire("nextyear");
        });
        var v = null, m = function(t, n) {
            function r() {
                v = setTimeout(function() {
                    n ? t == "pre" ? e.preYear() : e.nextYear() : t == "pre" ? e.preMonth() : e.nextMonth(), s = !0, r();
                }, 500);
            }
            if (v) return;
            r();
        }, g = function() {
            clearTimeout(v), v = null;
        };
        baidu(t).on("mousedown", l = function() {
            m("pre");
        }), baidu(n).on("mousedown", c = function() {
            m("next");
        }), baidu(r).on("mousedown", h = function() {
            m("pre", !0);
        }), baidu(i).on("mousedown", p = function() {
            m("next", !0);
        }), baidu(document).on("mouseup", d = function() {
            if (e.disposed) return;
            v && g();
        }), e.on("dispose", function() {
            baidu(t).off("click", o), baidu(n).off("click", u), baidu(r).off("click", a), baidu(i).off("click", f), baidu(t).off("mousedown", l), baidu(n).off("mousedown", c), baidu(r).off("mousedown", h), baidu(i).off("mousedown", p), baidu(document).off("mouseup", d);
        });
    },
    _getTheadString: function() {
        var e = this, t = [ "mon", "tue", "wed", "thu", "fri", "sat", "sun" ], n, r = [], i = e._options.weekStart.toLowerCase(), s = baidu.array.indexOf(t, i), o = baidu.i18n.cultures[e._options.language].calendar.dayNames, u = 0;
        r.push('<thead class="' + e._getClass("weekdays") + '"><tr>');
        for (; u < 7; u++) s > 6 && (s = 0), e.dayNames.push(t[s]), n = o[t[s]], r.push("<th>" + n + "</th>"), s++;
        return r.push("</tr></thead>"), r.join("");
    },
    _getTbodyString: function() {
        var e = this, t = e.dayNames, n = [ "sun", "mon", "tue", "wed", "thu", "fri", "sat" ], r = new Date(e.currentDate), i, s = 0, o = [], u = 0, a = baidu.i18n.date.getDaysInMonth(r.getFullYear(), r.getMonth()), f = 5, l = "", c = "";
        r.setDate(1), i = r.getDay(), s = baidu.array.indexOf(t, n[i]), s + a > 35 && (f = 6), r.setDate(r.getDate() - s);
        var h = 0, p = 0, d = "";
        for (; h < f; h++) {
            o.push("<tr>");
            for (; p < 7; p++) {
                d = e._getClass("date"), l = "";
                if (r.getDay() == 0 || r.getDay() == 6) d += " " + e._getClass("weekend");
                e._datesEqual(baidu.i18n.date.toLocaleDate(new Date), r) && (d += " " + e._getClass("today")), e._datesContains(e._options.highlightDates, r) && (d += " " + e._getClass("highlight")), e._datesContains(e._options.disabledDates, r) && (d += " " + e._getClass("disable")), e._dayOfWeekInDisabled(r.getDay()) && (d += " " + e._getClass("disable")), e._datesEqual(e.selectedDate, r) && (d += " " + e._getClass("selected"), l = 'id="' + e._getId("selected") + '"');
                if (r.getMonth() < e.currentDate.getMonth() || r.getFullYear() < e.currentDate.getFullYear()) d += " " + e._getClass("premonth"); else if (r.getMonth() > e.currentDate.getMonth() || r.getFullYear() > e.currentDate.getFullYear()) d += " " + e._getClass("nextmonth");
                c = e._formatDate(new Date(r.getFullYear() + "/" + (r.getMonth() + 1) + "/" + r.getDate())), o.push("<td " + l + ' class="' + d + '" date="' + c + '" onmouseover=baiduInstance("' + e.guid + '")._mouseoverHandler(event) onmouseout=baiduInstance("' + e.guid + '")._mouseoutHandler(event)>' + r.getDate() + "</td>"), r.setDate(r.getDate() + 1);
            }
            o.push("</tr>"), p = 0;
        }
        return "<tbody>" + o.join("") + "</tbody>";
    },
    _formatDate: function(e) {
        var t = e.getFullYear(), n = e.getMonth() + 1, r = e.getDate();
        return n = n >= 10 ? n : "0" + n, r = r >= 10 ? r : "0" + r, t + "/" + n + "/" + r;
    },
    _mouseoverHandler: function(e) {
        var t = this, n;
        n = baidu.event(e).target, baidu(n).addClass(t._getClass("hover")), t.fire("mouseover", {
            target: n
        });
    },
    _mouseoutHandler: function(e) {
        var t = this, n;
        n = baidu.event(e).target, baidu(n).removeClass(t._getClass("hover")), t.fire("mouseout", {
            target: n
        });
    },
    _bindTable: function() {
        var e = this, t = baidu("#" + e._getId("table"))[0].getElementsByTagName("tbody")[0], n, r, i, s, o;
        baidu(t).on("click", o = function(t) {
            n = t.target;
            if (n.tagName.toUpperCase() != "TD") return;
            r = n.getAttribute("date"), i = new Date(r);
            var o = e.selectedDate;
            i.setHours(o.getHours()), i.setMinutes(o.getMinutes()), i.setSeconds(o.getSeconds());
            if (e._datesContains(e._options.disabledDates, i)) return;
            if (e._dayOfWeekInDisabled(i.getDay())) return;
            s = baidu("#" + e._getId("selected"))[0], s && (s.id = "", baidu(s).removeClass(e._getClass("selected"))), n.id = e._getId("selected"), baidu(n).addClass(e._getClass("selected")), r = e._formatDate(i), e.selectedDate = new Date(r), e.fire("selectdate", {
                date: new Date(r)
            });
        }), e.on("dispose", function() {
            baidu(t).off("click", o);
        });
    },
    _addkeystrokesListener: function() {
        function i(t) {
            t = t || window.event;
            var n = !0;
            switch (t.keyCode) {
              case 33:
                e.preMonth();
                break;
              case 34:
                e.nextMonth();
                break;
              case 37:
                e._preDay();
                break;
              case 38:
                e._preDay();
                break;
              case 39:
                e._nextDay();
                break;
              case 40:
                e._nextDay();
                break;
              default:
                n = !1;
            }
            n && t.preventDefault();
        }
        var e = this, t = !1, n = baidu("#" + e._getId())[0], r;
        baidu(document).on("click", r = function(r) {
            if (e.disposed) return;
            var s = r.target;
            if (!baidu.dom.contains(n, s) && s != n) baidu(document).off("keydown", i), t = !1; else {
                if (t) return;
                baidu(document).on("keydown", i), t = !0;
            }
        }), e.on("dispose", function() {
            baidu(document).off("click", r);
        });
    },
    _datesEqual: function(e, t) {
        if (baidu.type(e) != "date" || baidu.type(t) != "date") return;
        var n = e.getFullYear(), r = e.getMonth(), i = e.getDate(), s = t.getFullYear(), o = t.getMonth(), u = t.getDate();
        return n == s && r == o && i == u;
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
        var t = this._options.disabledDayOfWeek, n = this._days, r = !1, i = 0, s;
        for (; i < t.length; i++) {
            s = t[i], typeof s == "object" ? (n[s.start] || 0) <= e && e <= n[s.end] && (r = !0) : n[s] == e && (r = !0);
            if (r) break;
        }
        return r;
    },
    _datesContains: function(e, t) {
        var n = this, r = 0, i = e.length, s, o = !0;
        if (baidu.type(t) != "date") return;
        for (; r < i; r++) {
            s = e[r];
            if (baidu.lang.isDate(s)) {
                if (n._datesEqual(s, t)) return !0;
            } else {
                s.end && (s.end = new Date(baidu.date.format(s.end, "yyyy/MM/dd") + " 23:59:59"));
                if ((!s.start || t.getTime() >= s.start.getTime()) && (!s.end || t.getTime() <= s.end.getTime())) return !0;
            }
        }
        return !1;
    },
    go: function(e, t) {
        var n = this;
        n.currentDate.setFullYear(e), n.currentDate.setDate(1), t = t === undefined ? n.currentDate.getMonth() : t - 1, n.currentDate.setMonth(t), n._rerender();
    },
    getDate: function() {
        return new Date(this.selectedDate);
    },
    setDate: function(e) {
        var t = this, n = new Date(e);
        if (baidu.type(e) != "date") return !1;
        if (t._datesContains(t._options.disabledDates, n)) return;
        if (t._dayOfWeekInDisabled(n.getDay())) return;
        return t.currentDate = new Date(e), t.selectedDate = new Date(e), t._rerender(), !0;
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
        if (e.disposed) return;
        e.container.removeChild(baidu("#" + e._getId())[0]), magic.Base.prototype.$dispose.call(e);
    }
});