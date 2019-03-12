;(function () {
    var diffArr=[["y",31536000000],["M",2592000000],["d",86400000],["h",3600000],["m",60000],["s",1000]];
	var oofUtil = window.oofUtil = {};
	oofUtil.getQueryParams = function (href) {
		var par = {};
		var url = href || location.href;
		if(!url.length) {
			return par;
		}
		url = url.split('#')[0].split('?');
		if(url && url[1]) {
			url = url[1].split('&');
			for(var i=0;i<url.length;i++) {
				var item = url[i].split('=');
				par[ $.trim(item[0]) ] = item[1];
			}
		}
		return par;

	}

	oofUtil.cookies = {
		get:function(name){
            var offset,end;
            var cookieValue = "";
            var search = name + "=";
            if (document.cookie.length > 0) {
                offset = document.cookie.indexOf(search);
                if (offset != -1) {
                    offset += search.length;
                    end = document.cookie.indexOf(";", offset);
                    if (end == -1)
                        end = document.cookie.length;
                    cookieValue = decodeURIComponent(document.cookie.substring(offset, end));
                }
            }
            return cookieValue;
        },
        set:function(name, value, hours){
            var expire = "";
            if (hours != null) {
                if(hours == -1 || value == ''){
                    expire = new Date((new Date()).getTime()-1);
                    expire = "; expires=" + expire.toUTCString();
                }
                else{
                    expire = new Date((new Date()).getTime() + hours * 3600000);
                    expire = "; expires=" + expire.toUTCString();
                }
            }
            document.cookie = name + "=" + encodeURIComponent(value) + expire + '; path=/ ; domain=.115rc.com';
        }
	}

    oofUtil.focusWindow = function(a) {
        try {
            a = a || window;
            var b = a.jQuery("#js_oof_focus_sel__");
            b.length || (b = a.jQuery('<select name="" id="js_oof_focus_sel__" style="position: absolute; left:-9999px; width: 10px;top:0"><option value=""></option></select>').appendTo(a.jQuery(a.document.body)));
            var c = Math.max((a.document.documentElement || a.document.body).scrollTop, a.document.body.scrollTop);
            b.css({
                top: 10 + c
            }),
            b.focus(),
            b.css({
                top: 0
            }),
            setTimeout(function() {
                b.blur()
            }, 10)
        } catch (d) {}
    }

	oofUtil.date = {
		/**
         * 格式化时间函数
         * @param date 要格式化的时间 默认 new Date
         * @param fmt 要格式化的格式 默认 yyyy-MM-dd HH:mm:ss
         */
        format : function (date, fmt) {
            date = date || new Date();
            var o = {
                "M+":date.getMonth() + 1, //月份
                "d+":date.getDate(), //日
                "h+":date.getHours() % 12 == 0 ? 12 : date.getHours() % 12, //小时
                "H+":date.getHours(), //小时
                "m+":date.getMinutes(), //分
                "s+":date.getSeconds(), //秒

                "S":date.getMilliseconds() //毫秒
            }, week = {
                "0":"\u65e5", "1":"\u4e00", "2":"\u4e8c", "3":"\u4e09", "4":"\u56db", "5":"\u4e94", "6":"\u516d"
            },zhou={1:'一',2:'二',3:'三',4:'四',5:'五',6:'六'};
            fmt = fmt || "yyyy-MM-dd HH:mm:ss";
            switch (fmt){
                case 'full':
                    fmt = "yyyy-MM-dd HH:mm:ss";
                    break;
                case 'full_to_minute':
                    fmt = "yyyy-MM-dd HH:mm";
                    break;
                case 'full_to_hour':
                    fmt = "yyyy-MM-dd HH";
                    break;
                case 'full_to_date':
                    fmt = "yyyy-MM-dd";
                    break;
                case 'full_to_month':
                    fmt = "yyyy-MM";
            }
            if (/(y+)/.test(fmt)) {//年特殊处理
                fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
            }
            if (/(E+)/.test(fmt)) {//星期特殊处理
                fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "\u661f\u671f" : "\u5468") : "") + week[date.getDay() + ""]);
            }
            if (/(e+)/.test(fmt)) {//第几周特殊处理
                var z = ~~(date.getDate()/7)+1;
                fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? zhou[z] :z));
            }
            if (/(q+)/.test(fmt)) {//第几季特殊处理

                var z = Math.floor((date.getMonth() + 3) / 3);
                fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? zhou[z] :z));
            }
            for (var k in o) {
                if (new RegExp("(" + k + ")").test(fmt)) {
                    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
                }
            }
            return fmt;
        },
        /**
         * 小时间戳转时间表达式，
         * @param num
         * @param fmt   yMdhms：y年M月d日，h小时，m分，s秒
         * @returns {*}
         */
        numFormat : function(num,fmt){
            var i, c, d, m,s,dif=num;
            if(dif<=0) return "";
            for(i=0,c=diffArr.length;i<c;i++){
                d=diffArr[i];
                if (new RegExp("(" + d[0] + "+)").test(fmt)) {
                    m=dif%d[1];
                    s = (dif-m)/d[1];

                    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (s) : (("00" + s).substr(("" + s).length)));

                    //fmt=fmt.replace(d[0],(dif-m)/d[1]);
                    dif=m;
                }
            }
            return fmt;
        }
	}

	$.extend($, {
	    loadTip: function(text,container,timer){
	        
	        if(window.Core&&window.Core.MinMessage){
	            window.Core.MinMessage.Show({
	                text: text,
	                type: "load",
	                window:container? { warp:container}:null,
	                timeout: timer||10000
	            });
	        }else{
	            alert(text);
	        }

	    },
	    successTip: function(text,container,timer){
	        if(window.Core&&window.Core.MinMessage){
	            window.Core.MinMessage.Show({
	                text: text,
	                type: "suc",
	                window:container? { warp:container}:null,
	                timeout: timer||2000
	            });
	        }else{
	            alert(text);
	        }

	    },
	    infoTip: function(text, container,timer){
	        if(window.Core&&window.Core.MinMessage){
	            window.Core.MinMessage.Show({
	                text: text,
	                type: "inf",
	                window:container? { warp:container}:null,
	                timeout: timer||2000
	            });
	        }else{
	            alert(text);
	        }

	    },
	    alertTip: function(text, container,timer){
	        if(window.Core&&window.Core.MinMessage){
	            window.Core.MinMessage.Show({
	                text: text,
	                type: "war",
	                window:container? { warp:container}:null,
	                timeout: timer||2000
	            });
	        }else{
	            alert(text);
	        }
	    },
	    hideTip:function(){
	        window.Core&&window.Core.MinMessage.Hide();
	    },
	    closeTip:function(){
	        window.Core&&window.Core.MinMessage.Hide();
	    }
	});

})();