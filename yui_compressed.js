magic.Calendar=baidu.lang.createClass(function(a){var b=this;var c="年份";b._options=baidu.object.extend({weekStart:"sun",initDate:baidu.i18n.date.toLocaleDate(new Date()),highlightDates:[],disabledDates:[],disabledDayOfWeek:[],language:"zh-CN"},a||{});b.currentDate=new Date(b._options.initDate);b.selectedDate=new Date(b._options.initDate);b.dayNames=[]},{type:"magic.Calendar",superClass:magic.Base});magic.Calendar.extend({tplSkeleton:'<div id="#{calendarId}" class="#{calendarClass}"><div id="#{titleId}" class="#{titleClass}"></div><div id="#{tableId}" class="#{tableClass}"></div></div>',tplDate:'<td id="#{id}" class="#{class}" onmouseover="#{mouseover}" onmouseout="#{mouseout}" onclick="#{click}">#{date}</td>',render:function(a){var b=this;if(baidu.type(a)==="string"){a="#"+a}b.container=baidu(a)[0];b._renderSkeleton();b._renderTitle();b._renderDateTable();b._renderNavBtn();b._bindTable();b._bindNavBtn();b._addkeystrokesListener();b.fire("render")},_rerender:function(){var a=this;a._renderTitle();a._renderDateTable();a._bindTable()},_getId:function(a){return this._eid+(a===undefined?"tang_calendar":"tang_calendar_"+a)},_getClass:function(a){return a===undefined?"tang-calendar":"tang-calendar-"+a},_renderSkeleton:function(){var b=this,a=b.container;baidu(a).insertHTML("beforeEnd",baidu.string.format(b.tplSkeleton,{calendarId:b._getId(),calendarClass:b._getClass(),titleId:b._getId("title"),titleClass:b._getClass("title"),tableId:b._getId("table"),tableClass:b._getClass("table")}));b.titleEl=baidu("#"+b._getId("title"))[0];b.tableEl=baidu("#"+b._getId("table"))[0];b.$mappingDom("",baidu("#"+b._getId())[0]);b.$mappingDom("calendar",baidu("#"+b._getId())[0]);b.$mappingDom("title",b.titleEl);b.$mappingDom("table",b.tableEl)},_renderTitle:function(){var c=this,a=c.currentDate,b=a.getFullYear(),d=a.getMonth()+1;c.titleEl.innerHTML=baidu.string.format(baidu.i18n.cultures[c._options.language].calendar.titleNames,{yyyy:b,MM:baidu.i18n.cultures[c._options.language].calendar.monthNamesShort[d-1]})},_renderDateTable:function(){var b=this._getTheadString(),a=this._getTbodyString();this.tableEl.innerHTML='<table border="0" cellpadding="0" cellspacing="0">'+b+a+"</table>"},_renderNavBtn:function(){var c=this,b=baidu("#"+c._getId())[0],e=document,d=e.createElement("div"),a=e.createElement("div"),f=e.createElement("div"),g=e.createElement("div");d.className=c._getClass("prebtn");a.className=c._getClass("nextbtn");f.className=c._getClass("yprebtn");g.className=c._getClass("ynextbtn");b.appendChild(d);b.appendChild(a);b.appendChild(f);b.appendChild(g);c.preBtn=d;c.nextBtn=a;c.ypreBtn=f;c.ynextBtn=g;c.$mappingDom("premonthbtn",d);c.$mappingDom("nextmonthbtn",a);c.$mappingDom("preyearbtn",f);c.$mappingDom("preyearhbtn",g)},_bindNavBtn:function(){var p=this,m=p.preBtn,l=p.nextBtn,q=p.ypreBtn,e=p.ynextBtn,b=false,c,f,g,j,n,r,d,h,o;baidu(m).on("click",c=function(){!b&&p.preMonth();b=false;p.fire("premonth")});baidu(l).on("click",f=function(){!b&&p.nextMonth();b=false;p.fire("nextmonth")});baidu(q).on("click",g=function(){!b&&p.preYear();b=false;p.fire("preyear")});baidu(e).on("click",j=function(){!b&&p.nextYear();b=false;p.fire("nextyear")});var i=null;var a=function(u,t){if(i){return}function s(){i=setTimeout(function(){t?(u=="pre"?p.preYear():p.nextYear()):(u=="pre"?p.preMonth():p.nextMonth());b=true;s()},500)}s()};var k=function(){clearTimeout(i);i=null};baidu(m).on("mousedown",n=function(){a("pre")});baidu(l).on("mousedown",r=function(){a("next")});baidu(q).on("mousedown",d=function(){a("pre",true)});baidu(e).on("mousedown",h=function(){a("next",true)});baidu(document).on("mouseup",o=function(){if(p.disposed){return}i&&k()});p.on("dispose",function(){baidu(m).off("click",c);baidu(l).off("click",f);baidu(q).off("click",g);baidu(e).off("click",j);baidu(m).off("mousedown",n);baidu(l).off("mousedown",r);baidu(q).off("mousedown",d);baidu(e).off("mousedown",h);baidu(document).off("mouseup",o)})},_getTheadString:function(){var g=this,h=["mon","tue","wed","thu","fri","sat","sun"],b,a=[],c=g._options.weekStart.toLowerCase(),d=baidu.array.indexOf(h,c),f=baidu.i18n.cultures[g._options.language].calendar.dayNames,e=0;a.push('<thead class="'+g._getClass("weekdays")+'"><tr>');for(;e<7;e++){d>6&&(d=0);g.dayNames.push(h[d]);b=f[h[d]];a.push("<th>"+b+"</th>");d++}a.push("</tr></thead>");return a.join("")},_getTbodyString:function(){var n=this,d=n.dayNames,m=["sun","mon","tue","wed","thu","fri","sat"],f=new Date(n.currentDate),o,p=0,c=[],q=0,b=baidu.i18n.date.getDaysInMonth(f.getFullYear(),f.getMonth()),a=5,h="",e="";f.setDate(1);o=f.getDay();p=baidu.array.indexOf(d,m[o]);if(p+b>35){a=6}f.setDate(f.getDate()-p);var l=0,k=0,g="";for(;l<a;l++){c.push("<tr>");for(;k<7;k++){g=n._getClass("date");h="";if(f.getDay()==0||f.getDay()==6){g+=" "+n._getClass("weekend")}if(n._datesEqual(baidu.i18n.date.toLocaleDate(new Date()),f)){g+=" "+n._getClass("today")}if(n._datesContains(n._options.highlightDates,f)){g+=" "+n._getClass("highlight")}if(n._datesContains(n._options.disabledDates,f)){g+=" "+n._getClass("disable")}if(n._dayOfWeekInDisabled(f.getDay())){g+=" "+n._getClass("disable")}if(n._datesEqual(n.selectedDate,f)){g+=" "+n._getClass("selected");h='id="'+n._getId("selected")+'"'}if(f.getMonth()<n.currentDate.getMonth()||f.getFullYear()<n.currentDate.getFullYear()){g+=" "+n._getClass("premonth")}else{if(f.getMonth()>n.currentDate.getMonth()||f.getFullYear()>n.currentDate.getFullYear()){g+=" "+n._getClass("nextmonth")}}e=n._formatDate(new Date(f.getFullYear()+"/"+(f.getMonth()+1)+"/"+f.getDate()));c.push("<td "+h+' class="'+g+'" date="'+e+'" onmouseover=baiduInstance("'+n.guid+'")._mouseoverHandler(event) onmouseout=baiduInstance("'+n.guid+'")._mouseoutHandler(event)>'+f.getDate()+"</td>");f.setDate(f.getDate()+1)}c.push("</tr>");k=0}return"<tbody>"+c.join("")+"</tbody>"},_formatDate:function(e){var b=e.getFullYear(),c=e.getMonth()+1,a=e.getDate();c=c>=10?c:("0"+c);a=a>=10?a:("0"+a);return b+"/"+c+"/"+a},_mouseoverHandler:function(c){var a=this,b;b=baidu.event(c).target;baidu(b).addClass(a._getClass("hover"));a.fire("mouseover",{target:b})},_mouseoutHandler:function(c){var a=this,b;b=baidu.event(c).target;baidu(b).removeClass(a._getClass("hover"));a.fire("mouseout",{target:b})},_bindTable:function(){var e=this,a=baidu("#"+e._getId("table"))[0].getElementsByTagName("tbody")[0],f,b,c,d,g;baidu(a).on("click",g=function(i){f=i.target;if(f.tagName.toUpperCase()!="TD"){return}b=f.getAttribute("date");c=new Date(b);var h=e.selectedDate;c.setHours(h.getHours());c.setMinutes(h.getMinutes());c.setSeconds(h.getSeconds());if(e._datesContains(e._options.disabledDates,c)){return}if(e._dayOfWeekInDisabled(c.getDay())){return}d=baidu("#"+e._getId("selected"))[0];if(d){d.id="";baidu(d).removeClass(e._getClass("selected"))}f.id=e._getId("selected");baidu(f).addClass(e._getClass("selected"));b=e._formatDate(c);e.selectedDate=new Date(b);e.fire("selectdate",{date:new Date(b)})});e.on("dispose",function(){baidu(a).off("click",g)})},_addkeystrokesListener:function(){var d=this,c=false,a=baidu("#"+d._getId())[0],e;function b(g){g=g||window.event;var f=true;switch(g.keyCode){case 33:d.preMonth();break;case 34:d.nextMonth();break;case 37:d._preDay();break;case 38:d._preDay();break;case 39:d._nextDay();break;case 40:d._nextDay();break;default:f=false;break}f&&g.preventDefault()}baidu(document).on("click",e=function(g){if(d.disposed){return}var f=g.target;if(!(baidu.dom.contains(a,f)||f==a)){baidu(document).off("keydown",b);c=false}else{if(c){return}baidu(document).on("keydown",b);c=true}});d.on("dispose",function(){baidu(document).off("click",e)})},_datesEqual:function(f,d){if(baidu.type(f)!="date"||baidu.type(d)!="date"){return}var c=f.getFullYear(),a=f.getMonth(),g=f.getDate(),b=d.getFullYear(),h=d.getMonth(),e=d.getDate();return(c==b)&&(a==h)&&(g==e)},_days:{mon:1,tue:2,wed:3,thu:4,fri:5,sat:6,sun:0},_dayOfWeekInDisabled:function(b){var c=this._options.disabledDayOfWeek,f=this._days,a=false,d=0,e;for(;d<c.length;d++){e=c[d];typeof e=="object"?(f[e.start]||0)<=b&&b<=f[e.end]&&(a=true):f[e]==b&&(a=true);if(a){break}}return a},_datesContains:function(g,f){var e=this,c=0,a=g.length,d,b=true;if(baidu.type(f)!="date"){return}for(;c<a;c++){d=g[c];if(baidu.lang.isDate(d)){if(e._datesEqual(d,f)){return true}}else{if(d.end){d.end=new Date(baidu.date.format(d.end,"yyyy/MM/dd")+" 23:59:59")}if((!d.start||f.getTime()>=d.start.getTime())&&(!d.end||f.getTime()<=d.end.getTime())){return true}}}return false},go:function(a,c){var b=this;b.currentDate.setFullYear(a);b.currentDate.setDate(1);c=c===undefined?b.currentDate.getMonth():c-1;b.currentDate.setMonth(c);b._rerender()},getDate:function(){return new Date(this.selectedDate)},setDate:function(b){var c=this,a=new Date(b);if(baidu.type(b)!="date"){return false}if(c._datesContains(c._options.disabledDates,a)){return}if(c._dayOfWeekInDisabled(a.getDay())){return}c.currentDate=new Date(b);c.selectedDate=new Date(b);c._rerender();return true},preMonth:function(){var d=this,a=d.currentDate,c=a.getMonth()+1,b=a.getFullYear();d.go(b,c-1)},nextMonth:function(){var d=this,a=d.currentDate,c=a.getMonth()+1,b=a.getFullYear();d.go(b,c+1)},preYear:function(){var b=this,a=b.currentDate;b.go(a.getFullYear()-1,a.getMonth()+1)},nextYear:function(){var b=this,a=b.currentDate;b.go(a.getFullYear()+1,a.getMonth()+1)},_preDay:function(){var b=this,a=new Date(b.selectedDate);a.setDate(a.getDate()-1);b.setDate(a);b.fire("selectdate",{date:a})},_nextDay:function(){var b=this,a=new Date(b.selectedDate);a.setDate(a.getDate()+1);b.setDate(a);b.fire("selectdate",{date:a})},$dispose:function(){var a=this;if(a.disposed){return}a.container.removeChild(baidu("#"+a._getId())[0]);magic.Base.prototype.$dispose.call(a)}});