magic.Calendar = baidu.lang.createClass(function(e) {
    this._options = baidu.object.extend({
        weekStart: "sun",
        initDate: baidu.i18n.date.toLocaleDate(new Date),
        highlightDates: [],
        disabledDates: [],
        disabledDayOfWeek: [],
        language: "zh-CN"
    }, e || {}), this.currentDate = new Date(this._options.initDate), this.selectedDate = new Date(this._options.initDate), this.dayNames = [];
}, {
    type: "magic.Calendar",
    superClass: magic.Base
}), magic.Calendar.extend({
    tplSkeleton: '<div id="#{calendarId}" class="#{calendarClass}"><div id="#{titleId}" class="#{titleClass}"></div><div id="#{tableId}" class="#{tableClass}"></div></div>',
    tplDate: '<td id="#{id}" class="#{class}" onmouseover="#{mouseover}" onmouseout="#{mouseout}" onclick="#{click}">#{date}</td>',
    render: function(e) {
        "string" === baidu.type(e) && (e = "#" + e), this.container = baidu(e)[0], this._renderSkeleton(), this._renderTitle(), this._renderDateTable(), this._renderNavBtn(), this._bindTable(), this._bindNavBtn(), this._addkeystrokesListener(), this.fire("render");
    },
    _rerender: function() {
        this._renderTitle(), this._renderDateTable(), this._bindTable();
    },
    _getId: function(e) {
        return this._eid + (void 0 === e ? "tang_calendar" : "tang_calendar_" + e);
    },
    _getClass: function(e) {
        return void 0 === e ? "tang-calendar" : "tang-calendar-" + e;
    },
    _renderSkeleton: function() {
        baidu(this.container).insertHTML("beforeEnd", baidu.string.format(this.tplSkeleton, {
            calendarId: this._getId(),
            calendarClass: this._getClass(),
            titleId: this._getId("title"),
            titleClass: this._getClass("title"),
            tableId: this._getId("table"),
            tableClass: this._getClass("table")
        })), this.titleEl = baidu("#" + this._getId("title"))[0], this.tableEl = baidu("#" + this._getId("table"))[0], this.$mappingDom("", baidu("#" + this._getId())[0]), this.$mappingDom("calendar", baidu("#" + this._getId())[0]), this.$mappingDom("title", this.titleEl), this.$mappingDom("table", this.tableEl);
    },
    _renderTitle: function() {
        var e = this.currentDate, t = e.getFullYear(), e = e.getMonth() + 1;
        this.titleEl.innerHTML = baidu.string.format(baidu.i18n.cultures[this._options.language].calendar.titleNames, {
            yyyy: t,
            MM: baidu.i18n.cultures[this._options.language].calendar.monthNamesShort[e - 1]
        });
    },
    _renderDateTable: function() {
        var e = this._getTheadString(), t = this._getTbodyString();
        this.tableEl.innerHTML = '<table border="0" cellpadding="0" cellspacing="0">' + e + t + "</table>";
    },
    _renderNavBtn: function() {
        var e = baidu("#" + this._getId())[0], t = document, n = t.createElement("div"), r = t.createElement("div"), i = t.createElement("div"), t = t.createElement("div");
        n.className = this._getClass("prebtn"), r.className = this._getClass("nextbtn"), i.className = this._getClass("yprebtn"), t.className = this._getClass("ynextbtn"), e.appendChild(n), e.appendChild(r), e.appendChild(i), e.appendChild(t), this.preBtn = n, this.nextBtn = r, this.ypreBtn = i, this.ynextBtn = t, this.$mappingDom("premonthbtn", n), this.$mappingDom("nextmonthbtn", r), this.$mappingDom("preyearbtn", i), this.$mappingDom("preyearhbtn", t);
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
                    n ? "pre" == t ? e.preYear() : e.nextYear() : "pre" == t ? e.preMonth() : e.nextMonth(), s = !0, r();
                }, 500);
            }
            v || r();
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
            !e.disposed && v && (clearTimeout(v), v = null);
        }), e.on("dispose", function() {
            baidu(t).off("click", o), baidu(n).off("click", u), baidu(r).off("click", a), baidu(i).off("click", f), baidu(t).off("mousedown", l), baidu(n).off("mousedown", c), baidu(r).off("mousedown", h), baidu(i).off("mousedown", p), baidu(document).off("mouseup", d);
        });
    },
    _getTheadString: function() {
        var e = "mon tue wed thu fri sat sun".split(" "), t, n = [];
        t = this._options.weekStart.toLowerCase();
        var r = baidu.array.indexOf(e, t), i = baidu.i18n.cultures[this._options.language].calendar.dayNames, s = 0;
        for (n.push('<thead class="' + this._getClass("weekdays") + '"><tr>'); 7 > s; s++) 6 < r && (r = 0), this.dayNames.push(e[r]), t = i[e[r]], n.push("<th>" + t + "</th>"), r++;
        return n.push("</tr></thead>"), n.join("");
    },
    _getTbodyString: function() {
        var e = this.dayNames, t = new Date(this.currentDate), n;
        n = 0;
        var r = [], i = baidu.i18n.date.getDaysInMonth(t.getFullYear(), t.getMonth()), s = 5, o = n = "";
        t.setDate(1), n = t.getDay(), n = baidu.array.indexOf(e, "sun mon tue wed thu fri sat".split(" ")[n]), 35 < n + i && (s = 6), t.setDate(t.getDate() - n);
        for (var i = e = 0, u = ""; e < s; e++) {
            for (r.push("<tr>"); 7 > i; i++) {
                u = this._getClass("date"), n = "";
                if (0 == t.getDay() || 6 == t.getDay()) u += " " + this._getClass("weekend");
                this._datesEqual(baidu.i18n.date.toLocaleDate(new Date), t) && (u += " " + this._getClass("today")), this._datesContains(this._options.highlightDates, t) && (u += " " + this._getClass("highlight")), this._datesContains(this._options.disabledDates, t) && (u += " " + this._getClass("disable")), this._dayOfWeekInDisabled(t.getDay()) && (u += " " + this._getClass("disable")), this._datesEqual(this.selectedDate, t) && (u += " " + this._getClass("selected"), n = 'id="' + this._getId("selected") + '"');
                if (t.getMonth() < this.currentDate.getMonth() || t.getFullYear() < this.currentDate.getFullYear()) u += " " + this._getClass("premonth"); else if (t.getMonth() > this.currentDate.getMonth() || t.getFullYear() > this.currentDate.getFullYear()) u += " " + this._getClass("nextmonth");
                o = this._formatDate(new Date(t.getFullYear() + "/" + (t.getMonth() + 1) + "/" + t.getDate())), r.push("<td " + n + ' class="' + u + '" date="' + o + '" onmouseover=baiduInstance("' + this.guid + '")._mouseoverHandler(event) onmouseout=baiduInstance("' + this.guid + '")._mouseoutHandler(event)>' + t.getDate() + "</td>"), t.setDate(t.getDate() + 1);
            }
            r.push("</tr>"), i = 0;
        }
        return "<tbody>" + r.join("") + "</tbody>";
    },
    _formatDate: function(e) {
        var t = e.getFullYear(), n = e.getMonth() + 1;
        return e = e.getDate(), t + "/" + (10 <= n ? n : "0" + n) + "/" + (10 <= e ? e : "0" + e);
    },
    _mouseoverHandler: function(e) {
        e = baidu.event(e).target, baidu(e).addClass(this._getClass("hover")), this.fire("mouseover", {
            target: e
        });
    },
    _mouseoutHandler: function(e) {
        e = baidu.event(e).target, baidu(e).removeClass(this._getClass("hover")), this.fire("mouseout", {
            target: e
        });
    },
    _bindTable: function() {
        var e = this, t = baidu("#" + e._getId("table"))[0].getElementsByTagName("tbody")[0], n, r, i, s, o;
        baidu(t).on("click", o = function(t) {
            n = t.target;
            if ("TD" == n.tagName.toUpperCase() && (r = n.getAttribute("date"), i = new Date(r), t = e.selectedDate, i.setHours(t.getHours()), i.setMinutes(t.getMinutes()), i.setSeconds(t.getSeconds()), !e._datesContains(e._options.disabledDates, i) && !e._dayOfWeekInDisabled(i.getDay()))) {
                if (s = baidu("#" + e._getId("selected"))[0]) s.id = "", baidu(s).removeClass(e._getClass("selected"));
                n.id = e._getId("selected"), baidu(n).addClass(e._getClass("selected")), r = e._formatDate(i), e.selectedDate = new Date(r), e.fire("selectdate", {
                    date: new Date(r)
                });
            }
        }), e.on("dispose", function() {
            baidu(t).off("click", o);
        });
    },
    _addkeystrokesListener: function() {
        function e(e) {
            e = e || window.event;
            var n = !0;
            switch (e.keyCode) {
              case 33:
                t.preMonth();
                break;
              case 34:
                t.nextMonth();
                break;
              case 37:
                t._preDay();
                break;
              case 38:
                t._preDay();
                break;
              case 39:
                t._nextDay();
                break;
              case 40:
                t._nextDay();
                break;
              default:
                n = !1;
            }
            n && e.preventDefault();
        }
        var t = this, n = !1, r = baidu("#" + t._getId())[0], i;
        baidu(document).on("click", i = function(i) {
            t.disposed || (i = i.target, baidu.dom.contains(r, i) || i == r ? n || (baidu(document).on("keydown", e), n = !0) : (baidu(document).off("keydown", e), n = !1));
        }), t.on("dispose", function() {
            baidu(document).off("click", i);
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
        for (var t = this._options.disabledDayOfWeek, n = this._days, r = !1, i = 0, s; i < t.length && (s = t[i], "object" == typeof s ? (n[s.start] || 0) <= e && e <= n[s.end] && (r = !0) : n[s] == e && (r = !0), !r); i++) ;
        return r;
    },
    _datesContains: function(e, t) {
        var n = 0, r = e.length, i;
        if ("date" == baidu.type(t)) {
            for (; n < r; n++) if (i = e[n], baidu.lang.isDate(i)) {
                if (this._datesEqual(i, t)) return !0;
            } else if (i.end && (i.end = new Date(baidu.date.format(i.end, "yyyy/MM/dd") + " 23:59:59")), (!i.start || t.getTime() >= i.start.getTime()) && (!i.end || t.getTime() <= i.end.getTime())) return !0;
            return !1;
        }
    },
    go: function(e, t) {
        this.currentDate.setFullYear(e), this.currentDate.setDate(1), t = void 0 === t ? this.currentDate.getMonth() : t - 1, this.currentDate.setMonth(t), this._rerender();
    },
    getDate: function() {
        return new Date(this.selectedDate);
    },
    setDate: function(e) {
        var t = new Date(e);
        if ("date" != baidu.type(e)) return !1;
        if (!this._datesContains(this._options.disabledDates, t) && !this._dayOfWeekInDisabled(t.getDay())) return this.currentDate = new Date(e), this.selectedDate = new Date(e), this._rerender(), !0;
    },
    preMonth: function() {
        var e = this.currentDate, t = e.getMonth() + 1, e = e.getFullYear();
        this.go(e, t - 1);
    },
    nextMonth: function() {
        var e = this.currentDate, t = e.getMonth() + 1, e = e.getFullYear();
        this.go(e, t + 1);
    },
    preYear: function() {
        var e = this.currentDate;
        this.go(e.getFullYear() - 1, e.getMonth() + 1);
    },
    nextYear: function() {
        var e = this.currentDate;
        this.go(e.getFullYear() + 1, e.getMonth() + 1);
    },
    _preDay: function() {
        var e = new Date(this.selectedDate);
        e.setDate(e.getDate() - 1), this.setDate(e), this.fire("selectdate", {
            date: e
        });
    },
    _nextDay: function() {
        var e = new Date(this.selectedDate);
        e.setDate(e.getDate() + 1), this.setDate(e), this.fire("selectdate", {
            date: e
        });
    },
    $dispose: function() {
        this.disposed || (this.container.removeChild(baidu("#" + this._getId())[0]), magic.Base.prototype.$dispose.call(this));
    }
});