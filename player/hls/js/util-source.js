if('Number' in window){
    window['OOF_NUMBER'] = window['Number'];

    window['Number'] = function(v){
        if(v && v.toString().length >= '2147483648'.length){
            if(v && v.toString().indexOf('.') != -1){
                return OOF_NUMBER(v);
            }
            return v;
        }
        else{
            return OOF_NUMBER(v);
        }
    }
}

String.format = function(str) {
    var args = arguments, re = new RegExp("%([1-" + args.length + "])", "g");
    return String(str).replace(
        re,
        function($1, $2) {
            return args[$2];
        }
        );
};

String.formatmodel = function(str,model){
    for(var k in model){
        var re = new RegExp("{"+k+"}","g");
        str = str.replace(re,model[k]);
    }
    return str;
}

var Util = {};

Util.CONFIG = {
    SQBrdColor: "#072246",
    SQBgColor: "#6bb0c9",
    SQOpacity: 15,
    SQScrollStep: 6,
	
    TextBoxDefaultColor: "#BABABA",
    TextBoxActiveColor:"#000",
    test:1
}

Util.CACHE = {};

Util.Browser = (function(){
    var userAgent = navigator.userAgent,
        rMsie = /(msie\s|trident.*rv:)([\w.]+)/,
        rFirefox = /(firefox)\/([\w.]+)/,
        rOpera = /(opera).+version\/([\w.]+)/,
        rChrome = /(chrome)\/([\w.]+)/,
        rSafari = /version\/([\w.]+).*(safari)/;
    var browser;
    var version;
    var ua = userAgent.toLowerCase();
    function uaMatch(ua) {
        var match = rMsie.exec(ua);
        if (match != null) {
            return { browser : "IE", version : match[2] || "0" };
        }
        var match = rFirefox.exec(ua);
        if (match != null) {
            return { browser : match[1] || "", version : match[2] || "0" };
        }
        var match = rOpera.exec(ua);
        if (match != null) {
            return { browser : match[1] || "", version : match[2] || "0" };
        }
        var match = rChrome.exec(ua);
        if (match != null) {
            return { browser : match[1] || "", version : match[2] || "0" };
        }
        var match = rSafari.exec(ua);
        if (match != null) {
            return { browser : match[2] || "", version : match[1] || "0" };
        }
        if (match != null) {
            return { browser : "", version : "0" };
        }
    }
    return {
        Check: function(){
            return uaMatch(userAgent.toLowerCase());
        }
    }
})();

Util.AddBookmark = function(title,url) {
    if (window.sidebar) { 
        window.sidebar.addPanel(title, url,""); 
    } else if( document.all ) {
        window.external.AddFavorite( url, title);
    } else {
        alert("您的浏览器不支持自动加入收藏夹，请使用浏览器菜单手动加入");
    }
}

Util.SetHome = function(ele){
    if( document.all ){
        ele.style.behavior='url(#default#homepage)'; 
        ele.setHomePage(window.location.href);
    }
    else{
        //var c = chrome;
        //chrome.send('setHomePage', [window.location.href, "1"]);
        alert("您的浏览器不支持自动设置主页，请使用浏览器菜单手动设置");
    }
}

function getClipboardData(){
    window.document.ff_clipboard_swf.SetVariable('str', Util.CACHE.CLIPBOARD_TEXT);
}

window["__JSCopyForFlash__"] = {
    getText:function(){
        return  Util.CACHE.CLIPBOARD_TEXT;
    },
    successHide:function(){
        hideMenu();
    }
}

function hideMenu(){
    Util.CACHE.CopyBox && Util.CACHE.CopyBox.hide();
    try{
        if(parent.window && parent.window['Core'] && parent.window['Core']['MinMessage']){
            parent.window['Core']['MinMessage'].Show({
                text: '成功复制内容', 
                type: 'suc', 
                timeout: 2000
            });
        }
    } catch(e){}
}

Util.CopyMsg = function(result){
    if(result){
        alert("内容已复制至剪贴板!");
    }
    else{
        alert("复制失败! 您使用的浏览器不支持复制功能.");
    }
}

/*
*
* 复制
*/
Util.Copy = function(pStr,hasReturn, isdo){
    var result = false;
    //IE
    if(window.clipboardData)
    {
        window.clipboardData.clearData();
        result = window.clipboardData.setData("Text", pStr);
    }
    //FireFox
    else
    {
        if(parent.window && !isdo){
            parent.window.Util.Copy(pStr,hasReturn, true);
            return;
        }
        Util.CACHE.CLIPBOARD_TEXT = pStr;
        if(!Util.CACHE.CopyBox){
            Util.CACHE.CopyBox = $('<div id="ff_clipborad_swf_box" style="z-index:99999999999;position:absolute;top:10px;left:10px;width:256px;height:106px;overflow:hidden;border:1px solid #BCBCBC;border-radius:3px;background:url(http:/static/js/copy_img/click_copy.png) no-repeat -8px -8px;box-shadow: 0 0 5px rgba(0,0,0,0.2);">'+
                '<a href="javascript:;"style="position:absolute;top:31px;left:34px;width:189px;height:40px;line-height:20;overflow:hidden;">点击复制到剪切板</a>'+
                '<a href="javascript:;" onclick="$(this).parent().hide();return false;" style="position:absolute;top:6px;right:6px;width:16px;height:16px;line-height:10;overflow:hidden;background:url(http:/static/js/copy_img/icon_dialog_handle.gif) no-repeat 0 0;"></a>'+
                '</div>');
            //创建Flash按钮
            $(document.body).append(Util.CACHE.CopyBox);
        }
        if(document.getElementById('ff_clipboard_swf')){
            $("#ff_clipboard_swf").empty().remove();
        }
        var html = [];
        html.push('<object type="application/x-shockwave-flash" data="/static/js/clipboard_new.swf?gettext=__JSCopyForFlash__.getText&success=__JSCopyForFlash__.successHide" width="190" height="42" style="position:relative;top: 30px;left: 34px;" id="ff_clipboard_swf">');
        html.push('<param name="quality" value="high" />');
        html.push('<param name="allowScriptAccess" value="sameDomain" />');
        html.push('<param name="allowFullScreen" value="true" />');
        html.push('<param name="wmode" value="transparent" />');
        html.push('</object>');
        Util.CACHE.CopyBox.append(html.join(""));
        Util.Layer.Center(Util.CACHE.CopyBox);
        Util.CACHE.CopyBox.show();
        return;
    }
    if(hasReturn){
        return result;
    }
    else{
        Util.CopyMsg(result);
    }
}

/*
* 文件
*/
Util.File = {
    /**
    * 显示文件大小
    *
    *
    */
    ShowSize:function(bytes, fix){
        bytes = parseInt(Number(bytes));
        var unit = new Array('B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB',
            'DB', 'NB');
        var extension = unit[0];
        var max = unit.length;
        for (var i = 1; ((i < max) && (bytes >= 1024)); i++) {
            bytes = bytes / 1024;
            extension = unit[i];
        }
		
        return Number(bytes).toFixed((fix == undefined)?2:fix) + extension;
    },
    GetInputFilePath: function (ele){  
        if(ele){  
            if (window.navigator.userAgent.indexOf("MSIE")>=1){  
                ele.select();  
                return document.selection.createRange().text;
            }
            else if(window.navigator.userAgent.indexOf("Firefox")>=1){  
                if(ele.files){  
                    return ele.files.item(0).getAsDataURL();  
                }  
                return ele.value;  
            }  
            return ele.value;  
        }  
    },
    FileNameCut: function(file_name){
        var lL = file_name.lastIndexOf(".");
        var pey = file_name.substring(lL);
        var name = file_name.substring(0,lL);
        var flong = Util.Validate.mb_strlen(file_name);
        var plong = Util.Validate.mb_strlen(pey);
        if(flong > 451){
            if(plong > 451){
                pey = pey.substring(0,400);
                if(Util.Validate.mb_strlen(name+pey) > 451){
                    name = name.substring(0,49);
                }
            }
            else{
                var lesslong = flong - plong;
                name = name.substring(0,lesslong - 1);
            }
        }
        return name + pey;
    }
}

Util.Text = {
    Cut: function(str,count){
        if(str.length > count){
            return str.substring(0,count/2) + "..." + str.substring(str.length - (count/2),str.length);
        }
        return str;
    },
    GetCount: function(str){
        var len = str.length;
        var reLen = 0;
        for (var i = 0; i < len; i++) { 
            if (/^[\u4e00-\u9fa5]{0,}$/.test(str.substring(i, i+1))) {
                // 全角    
                reLen += 2;
            }
            else {
                if(reLen == 0){
                    reLen++;
                }
                reLen++;
            }
        }
        return reLen; 	
    },
    htmlspecialchars: function(string, quote_style, charset, double_encode) {
        var optTemp = 0,
        i = 0,
        noquotes = false;
        if (typeof quote_style === 'undefined' || quote_style === null) {
            quote_style = 2;
        }
        string = string.toString();
        if (double_encode !== false) { // Put this first to avoid double-encoding
            string = string.replace(/&/g, '&amp;');
        }
        string = string.replace(/</g, '&lt;').replace(/>/g, '&gt;');
	
        var OPTS = {
            'ENT_NOQUOTES': 0,
            'ENT_HTML_QUOTE_SINGLE': 1,
            'ENT_HTML_QUOTE_DOUBLE': 2,
            'ENT_COMPAT': 2,
            'ENT_QUOTES': 3,
            'ENT_IGNORE': 4
        };
        if (quote_style === 0) {
            noquotes = true;
        }
        if (typeof quote_style !== 'number') { // Allow for a single string or an array of string flags
            quote_style = [].concat(quote_style);
            for (i = 0; i < quote_style.length; i++) {
                // Resolve string input to bitwise e.g. 'ENT_IGNORE' becomes 4
                if (OPTS[quote_style[i]] === 0) {
                    noquotes = true;
                }
                else if (OPTS[quote_style[i]]) {
                    optTemp = optTemp | OPTS[quote_style[i]];
                }
            }
            quote_style = optTemp;
        }
        if (quote_style & OPTS.ENT_HTML_QUOTE_SINGLE) {
            string = string.replace(/'/g, '&#039;');
        }
        if (!noquotes) {
            string = string.replace(/"/g, '&quot;');
        }
	
        return string;
    },
    utf8_encode: function (string) {
        string = string.replace(/\r\n/g,"\n");
            var utftext = "";
 
            for (var n = 0; n < string.length; n++) {
 
                var c = string.charCodeAt(n);
 
                if (c < 128) {
                    utftext += String.fromCharCode(c);
                }
                else if((c > 127) && (c < 2048)) {
                    utftext += String.fromCharCode((c >> 6) | 192);
                    utftext += String.fromCharCode((c & 63) | 128);
                }
                else {
                    utftext += String.fromCharCode((c >> 12) | 224);
                    utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                    utftext += String.fromCharCode((c & 63) | 128);
                }
 
            }
 
            return utftext;
    },
    sha1: function(str) {
        var rotate_left = function (n, s) {
            var t4 = (n << s) | (n >>> (32 - s));
            return t4;
        };

        var cvt_hex = function (val) {
            var str = "";
            var i;
            var v;

            for (i = 7; i >= 0; i--) {
                v = (val >>> (i * 4)) & 0x0f;
                str += v.toString(16);
            }
            return str;
        };

        var blockstart;
        var i, j;
        var W = new Array(80);
        var H0 = 0x67452301;
        var H1 = 0xEFCDAB89;
        var H2 = 0x98BADCFE;
        var H3 = 0x10325476;
        var H4 = 0xC3D2E1F0;
        var A, B, C, D, E;
        var temp;

        str = this.utf8_encode(str);
        var str_len = str.length;

        var word_array = [];
        for (i = 0; i < str_len - 3; i += 4) {
            j = str.charCodeAt(i) << 24 | str.charCodeAt(i + 1) << 16 | str.charCodeAt(i + 2) << 8 | str.charCodeAt(i + 3);
            word_array.push(j);
        }

        switch (str_len % 4) {
            case 0:
                i = 0x080000000;
                break;
            case 1:
                i = str.charCodeAt(str_len - 1) << 24 | 0x0800000;
                break;
            case 2:
                i = str.charCodeAt(str_len - 2) << 24 | str.charCodeAt(str_len - 1) << 16 | 0x08000;
                break;
            case 3:
                i = str.charCodeAt(str_len - 3) << 24 | str.charCodeAt(str_len - 2) << 16 | str.charCodeAt(str_len - 1) << 8 | 0x80;
                break;
        }

        word_array.push(i);

        while ((word_array.length % 16) != 14) {
            word_array.push(0);
        }

        word_array.push(str_len >>> 29);
        word_array.push((str_len << 3) & 0x0ffffffff);

        for (blockstart = 0; blockstart < word_array.length; blockstart += 16) {
            for (i = 0; i < 16; i++) {
                W[i] = word_array[blockstart + i];
            }
            for (i = 16; i <= 79; i++) {
                W[i] = rotate_left(W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16], 1);
            }


            A = H0;
            B = H1;
            C = H2;
            D = H3;
            E = H4;

            for (i = 0; i <= 19; i++) {
                temp = (rotate_left(A, 5) + ((B & C) | (~B & D)) + E + W[i] + 0x5A827999) & 0x0ffffffff;
                E = D;
                D = C;
                C = rotate_left(B, 30);
                B = A;
                A = temp;
            }

            for (i = 20; i <= 39; i++) {
                temp = (rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0x6ED9EBA1) & 0x0ffffffff;
                E = D;
                D = C;
                C = rotate_left(B, 30);
                B = A;
                A = temp;
            }

            for (i = 40; i <= 59; i++) {
                temp = (rotate_left(A, 5) + ((B & C) | (B & D) | (C & D)) + E + W[i] + 0x8F1BBCDC) & 0x0ffffffff;
                E = D;
                D = C;
                C = rotate_left(B, 30);
                B = A;
                A = temp;
            }

            for (i = 60; i <= 79; i++) {
                temp = (rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0xCA62C1D6) & 0x0ffffffff;
                E = D;
                D = C;
                C = rotate_left(B, 30);
                B = A;
                A = temp;
            }

            H0 = (H0 + A) & 0x0ffffffff;
            H1 = (H1 + B) & 0x0ffffffff;
            H2 = (H2 + C) & 0x0ffffffff;
            H3 = (H3 + D) & 0x0ffffffff;
            H4 = (H4 + E) & 0x0ffffffff;
        }

        temp = cvt_hex(H0) + cvt_hex(H1) + cvt_hex(H2) + cvt_hex(H3) + cvt_hex(H4);
        return temp.toLowerCase();
    }
}

Util.Date = {
    GetTimeText:function(num){
        var arr = [3600,60];
        var result = "";
        for(var i = 0,len = arr.length; i < len; i++){
            var item = arr[i];
            if(num >= item){
                var s = (num / item).toFixed(0);
                result += Util.Date._getDoubleText(s) + ":";
                num = num % item;
            }
            else{
                result += "00:";
            }
        }
        result += Util.Date._getDoubleText(num);
        return result;
    },
    GetIMText: function(h,m,s){
        var txt = [];
        if(h < 10){
            txt.push("0" + h);
        }
        else{
            txt.push(h);
        }
        if(m < 10){
            txt.push("0" + m);
        }
        else{
            txt.push(m);
        }
        if(s < 10){
            txt.push("0" + s);
        }
        else{
            txt.push(s);
        }
        return txt.join(":");
    },
    _getDoubleText: function(num){
        if(num.toString().length > 1){
            return num;
        }
        else{
            return "0" + num.toString();
        }
    }
}

/*
* Cookie控制
*/
Util.Cookie = {
    get:function(name){
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
                expire = "; expires=-1";
            }
            else{
                expire = new Date((new Date()).getTime() + hours * 3600000);
                expire = "; expires=" + expire.toUTCString();
            }
        }
        document.cookie = name + "=" + encodeURIComponent(value) + expire + '; path=/';
    }
}



Util.TextBox = {
    BindDefaultText: function(ele,text){
        if(!ele.value){
            ele.value = text;
            ele.style.color = Util.CONFIG.TextBoxDefaultColor;
        }
        else{
            ele.style.color = Util.CONFIG.TextBoxActiveColor;
        }
        ele.onblur = function(){
            if(ele.value == ""){
                ele.value = text;
                ele.style.color = Util.CONFIG.TextBoxDefaultColor;
            }
            else{
                ele.style.color = Util.CONFIG.TextBoxActiveColor;
            }
        };
        ele.onfocus = function(){
            ele.style.color = Util.CONFIG.TextBoxActiveColor;
            if(ele.value == text){
                ele.value = "";
            }
        };
        ele.GetValue = function(){
            if(ele.value == text){
                return "";
            }
            return ele.value;
        };
        ele.Clear = function(){
            ele.value = "";
            ele.onblur();
        };
        return ele;
    },
    BindSearch: function(input, label, clean){
        var timer;
        var _state = false;
        
        var bindHover = function(dom, input){  
            dom.hover(function(){
                bindHover.timer & clearTimeout(bindHover.timer);
                bindHover.timer = setTimeout(function(){
                    input.focus();
                },200);
            },function(){
                bindHover.timer & clearTimeout(bindHover.timer);
            });
        }
        bindHover(input, input);
        bindHover(label, input);
        
        var checkVal = function(){
            if(_state) return;
            if(input.val() == ''){
                label && label.is(':hidden') && label.show();
                clean && !clean.is(':hidden') && clean.hide();
            }
            else{
                label && !label.is(':hidden') && label.hide();
                clean && clean.is(':hidden') &&clean.show();
            }
        }
        
        var listen = function(){
            if(timer) window.clearTimeout(timer);
            timer = window.setTimeout(function(){
                checkVal();
                listen();
            }, 80);
        }
        
        clean && clean.on('click', function(){
            input.val('');
            input.focus();
            return false;
        });
        checkVal();
        listen();
        
        return {
            Disabled: function(){
                _state = true;
                label.hide();
            },
            Enabled: function(){
                _state = false;
                checkVal();
            }
        }
    },
    FocusEnd: function(ele){
        window.setTimeout(function(){
            if($.browser.msie){
                var pn = ele.value.length;

                var rng = ele.createTextRange();

                rng.moveStart("character",pn);

                rng.collapse(true);

                rng.select();
            }
            else{
                ele.setSelectionRange(ele.value.length, ele.value.length);
                ele.focus();
            }
        },10);
    },
    InsertAtCaret: function(textarea, myValue){
        var $t=$(textarea)[0];
        if (document.selection) {
            textarea.focus();
            var sel = document.selection.createRange();
            sel.text = myValue;
            textarea.focus();
        }
        else if ($t.selectionStart || $t.selectionStart == '0') {
            var startPos = $t.selectionStart;
            var endPos = $t.selectionEnd;
            var scrollTop = $t.scrollTop;
            $t.value = $t.value.substring(0, startPos) + myValue + $t.value.substring(endPos, $t.value.length);
            textarea.focus();
            $t.selectionStart = startPos + myValue.length;
            $t.selectionEnd = startPos + myValue.length;
            $t.scrollTop = scrollTop;
        }
        else {
            textarea.value += myValue;
            textarea.focus();
        }
    }
}

Util.DropDown =  (function(){
    var _timeout = 200, _hide_status = "hide_status";
    return {
        Bind: function(st){
            st.Title.bind("click",{
                setting: st
            },function(e){ 
                var setting = e.data.setting;
                if(setting.overtimer) window.clearTimeout(setting.overtimer);
                setting.Title.attr(_hide_status,"0");
                setting.Content.show();
                if(setting.ShowHandler){
                    setting.ShowHandler();
                }
            }).bind("mouseover",{
                setting: st
            },function(e){
                var setting = e.data.setting;
                if(setting.overtimer) window.clearTimeout(setting.overtimer);
                if(setting.IsOverShow){
                    setting.overtimer = window.setTimeout(function(){
                        setting.Title.attr(_hide_status,"0");
                        setting.Content.show();
                        if(setting.ShowHandler){
                            setting.ShowHandler();
                        }
                    },st.Timeout||_timeout);
                }
                if(setting.Title.attr(_hide_status) == "1"){
                    setting.Title.attr(_hide_status,"0");
                }
            }).bind("mouseleave",{
                setting: st
            },function(e){
                var setting = e.data.setting;
                if(setting.timer){
                    window.clearTimeout(setting.timer);
                }
                if(setting.overtimer) window.clearTimeout(setting.overtimer);
                if(setting.Title.attr(_hide_status) == "0"){
                    setting.Title.attr(_hide_status,"1");
                    setting.timer = window.setTimeout(function(){
                        if(setting.Title.attr(_hide_status) == "1"){
                            if(setting.HideHandler){
                                setting.HideHandler();
                            }
                            setting.Content.hide();
                        }
                        window.clearTimeout(setting.timer);
                        delete setting.timer;
                    },st.Timeout||_timeout);
                }
            })
            st.Content.bind("mouseover",{
                setting: st
            },function(e){
                var setting = e.data.setting;
                if(setting.Title.attr(_hide_status) == "1"){
                    setting.Title.attr(_hide_status,"0");
                }
            }).bind("mouseleave",{
                setting: st
            },function(e){
                e.stopPropagation();
                var setting = e.data.setting;
                if(setting.timer){
                    window.clearTimeout(setting.timer);
                }
                if(setting.overtimer) window.clearTimeout(setting.overtimer);
                setting.Title.attr(_hide_status,"1");
                setting.timer = window.setTimeout(function(){
                    if(setting.Title.attr(_hide_status) == "1"){
                        if(setting.HideHandler){
                            setting.HideHandler();
                        }
                        setting.Content.hide();
                    }
                    window.clearTimeout(setting.timer);
                    delete setting.timer;
                },st.Timeout||_timeout);
            }).hide();
        }
    }
})();

Util.Load = {
    _download: function(type, code, complete, isremove){
        $(code).bind("load",function(){
            isremove && $(code).remove();
            if(complete) complete();
        })
        if(type != "css"){
            code.onreadystatechange = (function(){
                if(code.readyState == "complete" || code.readyState == "loaded"){
                    //document.body.removeChild(code);
                    isremove && $(code).remove();
                    if(complete) complete();
                }
            });
        }
        document.body.appendChild(code);
    },
    JS: function(url,complete, isremove){
        if(isremove == undefined){
            isremove = true;
        }
        var code = document.createElement("script");
        code.src = url;
        Util.Load._download("script", code, complete, isremove);
    },
    Css: function(url, complete){
        var code = document.createElement("link");
        code.href = url;
        code.rel = "stylesheet";
        code.type = "text/css";
        Util.Load._download("css", code, complete);
        return;
    }
}

/**
* 验证
*/
Util.Validate = {
    Url: function(pUrl){
        var str_url = pUrl;
            
        var regular = /^(http|https|ftp):\/\/[^\/]*\/.*/i;
        if(regular.test(str_url)){
            return true;
        }
        else{
            return false; 
        }
    },
    mb_strlen: function(str){
        var offset = 0;
        for(var i=0; i<str.length; i++){
            var string = str.substr(i,1);
            if(escape(string).substr(0,2)=="%u"){
                offset +=3;
            }
            else{
                offset +=1;
            }
        }
        return offset;
    },
    FileName: function(file_name) {
        if (file_name.length < 1) {
            return '文件名不能少于1个字符！';
        }
        var regular = /^[^\\/:*?<>\"]{1,}$/;
        if (!regular.test(file_name)) {
            return "命名不能包含\/:*?\"<>|。";
        }
        return true;
    },
    Desc: function(description) {
        if (description.length > 11500) {
            alert('描述长度不能超过11500字节');
            return false;
        }
        return true;
    },
    CategoryName: function(category_name) {
        category_name = category_name.replace(' ', '');
        if (category_name.length < 1) {
            return '文件夹名不能为空。';
        }
        if (category_name.length > 255) {
            return '文件夹名称不能超过255个字。';
        }
        var regular = /^[^\\/:*?<>\|\\\\\"]*$/;
        if (!regular.test(category_name)) {
            return "命名不能包含\/:*?\"<>|。";
        }
        return true;
    },
    Email: function(email) {
        var regular = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/;
        if (!regular.test(email)) {
            return false;
        } else {
            return true;
        }
    }
};

/*
	Tab切换
*/
Util.TabManager = function(pList,pActiveStyle,pDisableStyle){
    var _self = this;
    var _obj = {
        List: pList,
        ActiveStyle: pActiveStyle,
        DisableStyle: pDisableStyle
    };
    var _ChangeHandler;
    var time ;
    var _autoTimer;
    this._autoTimeOut = 3000;
    this.Animate = false
    var overObj;
    var activeIndex;
    var _autostate = false;
    function display(){
        for(var j = 0; j < _obj.List.length; j++){
            var ele = _obj.List[j].Tab;
            ele.removeClass(_obj.ActiveStyle);
            ele.addClass(_obj.DisableStyle);
            _obj.List[j].Content.hide();
        }

        overObj.Tab.addClass(_obj.ActiveStyle);
        if(_self.Animate){
            overObj.Content.fadeIn();
        }
        else{
            overObj.Content.show();
        }
        if(_ChangeHandler){
            _ChangeHandler(overObj);
        }
    }

    function autoDisplay(){
        activeIndex++;
        if(activeIndex >= _obj.List.length){
            activeIndex = 0;
        }
        overObj = _obj.List[activeIndex];
        display();
    }

    var init = function(){
        for(var i = 0; i < _obj.List.length; i++){
            var item = _obj.List[i];
            item.Tab.bind("mouseover",{
                obj:item,
                index:i
            },function(e){
                overObj = e.data.obj;
                activeIndex = e.data.index;
                time = window.setTimeout(display,300);
                _self.SetAuto(_autostate);
            }).bind("click",{
                obj:item,
                index:i
            },function(e){
                overObj = e.data.obj;
                activeIndex = e.data.index;
                if(time){
                    window.clearTimeout(time);
                }
                display();
                this.blur();
                _self.SetAuto(_autostate);
            }).bind("mouseout",function(){
                if(time){
                    window.clearTimeout(time);
                }
            });
        }

    }
	
    this.RemoveMouseOver = function(){
        for(var i = 0; i < _obj.List.length; i++){
            var item = _obj.List[i];
            item.Tab.unbind("mouseover");
            
        }
    }
	
    this.Stop = function(){
        if(_autoTimer){
            window.clearInterval(_autoTimer);
        }
    }
    
    this.Start = function(){
        _self.SetAuto(_autostate);
    }
	
    this.SetAuto = function(v){
        if(_autoTimer){
            window.clearInterval(_autoTimer);
        }
        if(v){
            _autoTimer = window.setInterval(autoDisplay,_self._autoTimeOut);
        }
        _autostate = v;
    }
    this.SetChangeHandler = function(pHandler){
        _ChangeHandler = pHandler;
    },
    this.Select = function(key){
        activeIndex = key;
        overObj = _obj.List[key];
        display();
    }
    init();
}


Util.ChatEditBox = {
    lastRange:null ,
    lastBookmark:null,
    Newline: function(isnotadd){
        if ($.browser.msie) {
            var i = document.selection.createRange();
            !isnotadd || i.pasteHTML("<br />");
            i.collapse(false);
            i.select();
        } else {
            if ($.browser.webkit) {
                var k = window.getSelection();
                var i = k.getRangeAt(0);
                var j = i.createContextualFragment("<br/>&nbsp;");
                var l = j.lastChild;
                i.insertNode(j);
                i.setEndAfter(l);
                i.setStartAfter(l);
                k = window.getSelection();
                k.removeAllRanges();
                k.addRange(i);
                var m = l.previousSibling;
                document.execCommand("Delete", false, null);
                m.scrollIntoView();
            } else {
                if ($.browser.opera) {} else {
                    if ($.browser.mozilla) {
                        var i = window.getSelection().getRangeAt(0);
                        var j = i.createContextualFragment("<br>");
                        var l = j.lastChild;
                        i.insertNode(j);
                        i.setEndAfter(l);
                        i.setStartAfter(l);
                        var k = window.getSelection();
                        k.removeAllRanges();
                        k.addRange(i);
                    } else {}
                }
            }
        }
    },
    clear: function(edit) {
        if ($.browser.msie) {
            edit.innerHTML = "";
        } else {
            if ($.browser.webkit) {
                var j = window.getSelection();
                var i = j.getRangeAt(0);
                edit.innerHTML = "<br/>";
                var j = getSelection();
                j.removeAllRanges();
                j.addRange(i);
            } else {
                edit.innerHTML = "<br/>";
            }
        }
        this.lastBookmark = null;
        this.lastRange = null;
        this.Focus(edit, true);
    },
    getSelection: function() {
        return (document.selection) ? document.selection: window.getSelection();
    },
    getRange: function() {
        var k = this.getSelection();
        if (!k) {
            return null;
        }
        try {
            var i = k.createRange ? k.createRange() : k.getRangeAt(0);
            var l = null;
            var j = this.editArea;
            if (i.commonAncestorContainer) {
                l = i.commonAncestorContainer;
            } else {
                if (i.parentElement) {
                    l = i.parentElement();
                }
            }
            if (l && (l == j || l.parentNode == j || l.parentNode.parentNode == j)) {
                return i;
            } else {
                return null;
            }
        } catch(m) {
            return null;
        }
    },
    simpleSaveRange: function() {
        try{
            var i = this.getSelection();
            this.lastRange = i.createRange ? i.createRange() : i.getRangeAt(0);
            if (this.lastRange.getBookmark) {
                this.lastBookmark = this.lastRange.getBookmark();
            }
        }catch(e){}
    },
    saveRange: function() {
        var i = this.getRange();
        if (!i) {
            return;
        }
        this.lastRange = i;
    },
    ClearHtml: function(i) {
        var j = false;
        var k = i.replace(/<!-{2,}[\s\S]*?-{2,}>/g, "");
        k = k.replace(/<([^>]+).*?>/ig,
            function(n, m) {
                var l = m.split(" ")[0].toLowerCase();
                switch (l) {
                    case "/p":
                        return "<br>";
                    case "br":
                        if (j) {
                            j = false;
                            return "";
                        }
                        return n;
                    case "img":
                        j = true;
                        if (n.toLowerCase().indexOf("mark") > 0) {
                            return n;
                        } else {
                            return "";
                        }
                    default:
                        return "";
                }
            });
        k = k.replace(/\n/g, "");
        return k;
    },
    Focus: function(edit, k) {
        if (!k && !!this.getRange()) {
            return;
        }
        edit.focus();
        if (this.lastRange && !$.browser.msie) {
            var j = window.getSelection();
            j.removeAllRanges();
            j.addRange(this.lastRange);
        }
        if ($.browser.opera) {
            edit.focus();
        }
        if (this.lastBookmark) {
            var i = document.selection.createRange();
            i.moveToBookmark(this.lastBookmark);
            i.collapse(false);
            i.select();
            this.lastBookmark = null;
        }
    },
    InsertHtml: function(o,  l, k) {
        //var o = this.editArea;
        var q = {
            editArea: o
        };
        if (document.all) {
            var m = this.getRange();
            if(this.lastRange){
                m = this.lastRange;
            }
            if (m) {
                m.collapse(false);
                m.select();
                m.pasteHTML(l);
                m.select();
            } else {
                o.innerHTML += l;
                var i = o.lastChild;
            }
            var i = o.lastChild;
            if (k) {
                while (i && i.nodeName.toLowerCase() == "br") {
                    var j = i;
                    i = i.previousSibling;
                    o.removeChild(j);
                }
            }
        } else {
            if (window.getSelection) {
                var m = this.getRange();
                if (this.lastRange) {
                    m = this.lastRange;
                }
                if (!m) {
                    o.innerHTML += l;
                    var i = o.lastChild;
                } else {
                    m.collapse(false);
                    var n = m.createContextualFragment(l);
                    var i = n.lastChild;
                    if (k) {
                        while (i && i.nodeName.toLowerCase() == "br" && i.previousSibling && i.previousSibling.nodeName.toLowerCase() == "br") {
                            var j = i;
                            i = i.previousSibling;
                            n.removeChild(j);
                        }
                    }
                    m.insertNode(n);
                    if (i) {
                        m.setEndAfter(i);
                        m.setStartAfter(i);
                    }
                    var p = getSelection();
                    p.removeAllRanges();
                    p.addRange(m);
                }
            }
        }
        setTimeout(function() {
            q.editArea.scrollTop = q.editArea.scrollHeight;
            q.editArea.scrollLeft = q.editArea.scrollWidth;
        },
        200);
    }
}

Util.Url = {
    ReplaceQueryVar:function(skey, svalue){
        var href = location.href;
        if(location.hash){
            href = href.replace(location.hash,'');
        }
        var urls = href.split('?');
        var kws  = urls[1].split('&');
        var kw = newurl = '';
        var ischange = 0;
        for(i=0; i < kws.length; i++ ){
            kw = $.trim(kws[i]);
            if( kw=='' ){
                continue;
            }
            else{
                kwss = kws[i].split('=');
                if( kwss.length < 2 ) continue;
                if( kwss[0]==skey ){
                    if( kwss[1] != svalue ){
                        kwss[1] = svalue;
                        ischange = 2;
                    } else {
                        ischange = 1;
                    }
                }
                if( kwss[1] != '' ){
                    newurl += (newurl=='' ? kwss[0] + '=' + kwss[1] : '&' + kwss[0] + '=' + kwss[1]);
                }
            }
        }
        if( ischange==0 ){
            newurl += '&'+ skey + '=' + svalue;
        }
        var url;
        if( ischange != 1){
            url = urls[0]+'?'+newurl;
        } else {
            url = location.href;
        }
        window.location.href = url;
    }
}

Util.Log = (function(){
    var _cache = {};
    return {
        write: function(msg){
            if(!_cache.box){
                _cache.box = $("<div style='position:absolute;top:0;left:0;background:#fff;'></div>");
                $(document.body).append(_cache.box);
            }
            _cache.box.html(msg);
        }
    }
})()

/*
	公共函数
*/
Util.Mouse = (function(){
    var _cache = {
        move: {
            x:0,
            y:0,
            eX:0,
            eY:0
        },	//手动层缓存对象
        line: {
            x:0,
            y:0,
            eX:0,
            eY:0
        },	//拖动线缓存对象
        sq: {
            t:0,
            l:0,
            x:0,
            y:0,
            w:0,
            h:0,
            st:0
        }	//框选缓存对象
    },Return = {};

    //获取透明遮罩层
    var GetLayOutBox = function(){
        if(!_cache.LayOutBox){
            _cache.LayOutBox = $('<div style="z-index: 1000000003; display: none;background: none repeat scroll 0 0 black;height: 100%;left: 0;position: absolute;top: 0;width: 100%;filter:alpha(opacity=0);-moz-opacity:0;opacity:0;"><div style="height:100%;width:100%;"></div></div>');
            
            $(document.body).append(_cache.LayOutBox);
        }
        if ($.browser.msie && $.browser.version == 6) {
            var doc = document.documentElement;
            _cache.LayOutBox.css({
                height: ((doc.scrollHeight>doc.clientHeight)?doc.scrollHeight:doc.clientHeight) + 'px'
            });
        }
        else{
            _cache.LayOutBox.css({
                position: 'fixed'
            });
        }
        return _cache.LayOutBox;
    }
    
    Return.GetLayOutBox = GetLayOutBox;

    //移动层，mouseover函数
    var moveBoxFun = function(e){
        //鼠标移动
        if(_cache.move.state){			
            _cache.move.eX = e.screenX;
            _cache.move.eY = e.screenY;
            var lessX = _cache.move.eX - _cache.move.x;
            var lessY = _cache.move.eY - _cache.move.y;
            if(_cache.move.box){
                var t = _cache.move.sT + lessY;
                var l = _cache.move.sL + lessX;
                
                if(t > _cache.move.maxT){
                    if(_cache.move.maxT !== false){
                        t = _cache.move.maxT;
                    }
                }
                else if(t < _cache.move.minT){
                    if(_cache.move.minT !== false){
                        t = _cache.move.minT;
                    }
                }
                if(l > _cache.move.maxL){
                    if(_cache.move.maxL !== false){
                        l = _cache.move.maxL;
                    }
                }
                else if(l < _cache.move.minL){
                    if(_cache.move.minL !== false){
                        l = _cache.move.minL;
                    }
                }
                _cache.move.box.css({
                    left: l + "px",
                    top: t + "px"
                });
            }
            if(e.data.move_callback){
                e.data.move_callback();
            }
            return false;
        }
    }

    /*
		绑定移动函数
		obj
		{
			ClickBox 	--点击的标签
			Box		--移动的层
		}
	*/
    Return.MoveBox = function(obj){
        var outer = obj.Outer;
        var box = obj.Box;
        obj.ClickBox.attr("ws_property","1");
        obj.ClickBox.bind("mousedown",{
            box:box,
            outer:outer,
            callback:obj.Callback, 
            move_callback: obj.MoveCallback
        },function(e){
            if(e.button == 2){
                return true;
            }
            if($(this).attr("stop_move")) return;
            _cache.MoveLayOut = GetLayOutBox();
            _cache.MoveLayOut.css({
                cursor:"default"
            });
            var lay = ($.browser.msie)? _cache.MoveLayOut : $(window);
            lay.unbind("mousemove").bind("mousemove",{
                move_callback:e.data.move_callback
            },function(e){
                if(_cache.move.state){
                    _cache.MoveLayOut.show();
                }
                moveBoxFun(e);
                return false;
            });
            lay.unbind("mouseup").bind("mouseup",function(e){
                //鼠标按起来
                if(_cache.move.state){
                    _cache.move.state = false;
                    _cache.MoveLayOut.hide();
                    _cache.MoveLayOut.css({
                        cursor:"default"
                    });
                    if($.browser.msie){
                        _cache.MoveLayOut[0].releaseCapture();
                    }
                //return false;
                }
                lay.unbind("mousemove");
            });
			
            if($.browser.msie){
                _cache.MoveLayOut[0].setCapture();
            }

            _cache.move.state = true;
            _cache.move.box = e.data.box;
            _cache.move.outer = e.data.outer;
            _cache.move.x = e.screenX;
            _cache.move.y = e.screenY;
            _cache.move.eX = e.screenX;
            _cache.move.eY = e.screenY;
            var of=_cache.move.box.offset();
            _cache.move.box.css({
                left:0,
                top:0
            }).offset(of);
            _cache.move.sT =  _cache.move.box.css("top")  ? parseInt(_cache.move.box.css("top")) : _cache.move.box.offset().top;
            _cache.move.sL = _cache.move.box.css("left")  ? parseInt(_cache.move.box.css("left")) : _cache.move.box.offset().left;

            if(obj.IsAddScrollTop){
                _cache.move.sT = _cache.move.sT - $(window).scrollTop();
            }
            if(_cache.move.outer){
                var oh = _cache.move.outer.height(), ow = _cache.move.outer.width(),
                bh = _cache.move.box.height(), bw = _cache.move.box.width();
                _cache.move.minT = _cache.move.outer.offset() ?_cache.move.outer.offset().top : 0;
                _cache.move.maxT = _cache.move.minT + _cache.move.outer.height() - _cache.move.box.height();
                _cache.move.minL = _cache.move.outer.offset()?_cache.move.outer.offset().left:0;
                _cache.move.maxL = _cache.move.minL + _cache.move.outer.width() - _cache.move.box.width();
            }
            else{
                _cache.move.minT = false;
                _cache.move.maxT = false;
                _cache.move.minL = false;
                _cache.move.maxL = false;
            }
            if(obj.MoveSetting){
                for(var k in obj.MoveSetting){
                    _cache.move[k] = obj.MoveSetting[k];
                }
            }
            
			
            if(e.data.callback){
                e.data.callback();
            }

            return false;
        });
        return {
            Disable: function(){
                obj.ClickBox.attr("stop_move","1");
            },
            Enable: function(){
                obj.ClickBox.removeAttr("stop_move");
            },
            ChangeSetting: function(moveSetting){
                if(moveSetting){
                    if(!obj.MoveSetting) obj.MoveSetting = {};
                    for(var k in moveSetting){
                        obj.MoveSetting[k] = moveSetting[k];
                    }
                }
            }
        }
    }
	
    /*
		绑定移动线
		line: 拖动的线条
		type: 拖动手势 (e-resize：箭头朝左右方向; n-resize：箭头朝上下方向; w-resize:箭头朝右上左下方向; ne-resize:箭头朝右下方向)
	*/
    Return.MoveLine = function(line,type,callback,mousedown){
        line.css({
            cursor:type
        });
        line.bind("mousedown",{
            type:type,
            callback:callback,
            down:mousedown
        },function(e){
            _cache.MoveLayOut = GetLayOutBox();
            _cache.MoveLayOut.css({
                cursor:e.data.type
            });
            var lay = ($.browser.msie)? _cache.MoveLayOut : $(window);
            //绑定事件
            lay.unbind("mousemove").bind("mousemove",{
                callback:e.data.callback
            },function(e){
                if(_cache.line.state){
                    _cache.line.eX = e.screenX;
                    _cache.line.eY = e.screenY;
					
                    if(e.data.callback){
                        e.data.callback(_cache.line);
                    }
                    return true;
                }
            }).unbind("mouseup").bind("mouseup",function(e){
                if(_cache.line.state){
                    _cache.line.state = false;
                    _cache.MoveLayOut.hide();
                    if($.browser.msie){
                        _cache.MoveLayOut[0].releaseCapture();
                    }
                    _cache.MoveLayOut.css({
                        cursor:"default"
                    });
                    return false;
                }
            });
            _cache.MoveLayOut.show();
            if($.browser.msie){
                _cache.MoveLayOut[0].setCapture();
            }
            _cache.line.state = true;
            _cache.line.x = e.screenX;
            _cache.line.eX = e.screenX;
            _cache.line.y = e.screenY;
            _cache.line.eY = e.screenY;
            if(e.data.down){
                e.data.down();
				
            }
			
            return false;
        })
    }

    /****选择框****/
    //选择框事件对象
    var sqEvent = {
        //鼠标移动事件
        move:function(e){
            if(_cache.sq.movestate){
                var eX = e.screenX, eY = e.screenY;
                var lessX = eX - _cache.sq.sX, lessY = eY - _cache.sq.sY;
				
                var w = Math.abs(lessX);
                var h = Math.abs(lessY);
				
                var t = lessY? _cache.sq.sT : _cache.sq.sT + lessY, l = lessX? _cache.sq.sL : _cache.sq.sL + lessX;
                var oH = _cache.sq.outer.height() - 2;
                var oW = _cache.sq.dom.width() - 2;
                var scrollTop = _cache.sq.outer.scrollTop();
                var scrollLeft = _cache.sq.outer.scrollLeft();
                if(lessY < 0){
                    t = t - h;
                }
                if(lessX < 0){
                    l = l - w;
                }
				
                if(t < 0){
                    h += t;
                    t = 0;
                }
                else if(t > 0 && (t - scrollTop + h) > oH){
                    h = oH - t + scrollTop;
                }
				
                if(l < 0){
                    w += l;
                    l = 0;
                }
                else if(l > 0 && (l - scrollLeft + w) > oW){
                    w = oW - l + scrollLeft;
                }
                _cache.sq.box.height(h).css({
                    width: w + "px", 
                    left: (l + _cache.sq.cut.left) + "px", 
                    top: (t + _cache.sq.cut.top) + "px"
                });
				
                if(_cache.events.mousemove){
                    var l = _cache.sq.box.offset().left, t = _cache.sq.box.offset().top, w = _cache.sq.box.width(), h = _cache.sq.box.height();
                    _cache.events.mousemove(l, t, l+w, t+h, e.ctrlKey, e);
                }
                if(_cache.sq.box.is(':hidden') && w && h){
                    _cache.sq.box.show();
                }
                return true;
            }
        },
        //mouseup事件
        up: function(e){
            if(_cache.sq.movestate){
                _cache.sq.box.show();
                if(_cache.events.mouseup){
                    var l = _cache.sq.box.offset().left, t = _cache.sq.box.offset().top, w = _cache.sq.box.width(), h = _cache.sq.box.height();
                    _cache.events.mouseup(l, t, l+w, t+h, e.ctrlKey, e);
                }
                _cache.sq.box.hide();
                _cache.sq.movestate = false;
                _cache.sq.x = _cache.sq.y = _cache.sq.w = _cache.sq.h = _cache.sq.t = _cache.sq.l = _cache.sq.st = 0;
                /*if($.browser.msie){
                    _cache.MoveLayOut && _cache.MoveLayOut[0].releaseCapture();
                }
                _cache.MoveLayOut && _cache.MoveLayOut.hide();*/
                return true;
            }
        }
    }

    /*
		拖动选择
	*/
    Return.Square = function(dom, outer, events, cut){
        if(!cut) {
            cut = {
                top:0, 
                left:0
            };
        
    }
    if(cut.top == undefined){
        cut.top = 0;
    }
    if(cut.left == undefined){
        cut.left = 0;
    }
    var stopStatus = false;
    //绑定所在页事件
    dom.bind("mousedown",{
        outer:outer
    },function(e){
        if(stopStatus) return true;
        if(events && events.type && e.target){
            if( events.type != e.target.tagName.toUpperCase()){
                return true;
            }
        }
        if($(e.target).attr("menu")) return true;
            
        var box = $(this);
        var lay = ($.browser.msie)?$(document) : $(window);
        lay.unbind("mousemove").bind("mousemove",sqEvent.move).unbind("mouseup").bind("mouseup",sqEvent.up);
            
        if(!_cache.sq.box){
            _cache.sq.box = $('<div style="position:absolute; display:none; top:0; left:0; border:1px solid '+Util.CONFIG.SQBrdColor+'; background:'+Util.CONFIG.SQBgColor+'; filter:Alpha(Opacity='+Util.CONFIG.SQOpacity+'); opacity:0.'+Util.CONFIG.SQOpacity+'; overflow:hidden; display:none; z-index:99999;"></div>');
            box.parent().append(_cache.sq.box);
        }
            
            
        _cache.sq.movestate = true;
        _cache.sq.outer = e.data.outer;
        var scrollTop = _cache.sq.outer.scrollTop();
        var scrollLeft = _cache.sq.outer.scrollLeft();
            
            
        if(events && events.type == 'BODY'){
            scrollTop = $(window).scrollTop();
            scrollLeft = $(window).scrollLeft();
        }
            
        _cache.sq.sX = e.screenX;
        _cache.sq.sY = e.screenY;
        _cache.sq.w = 0;
        _cache.sq.h = 0;
        _cache.sq.sT = e.clientY - _cache.sq.outer.offset().top + scrollTop;
        _cache.sq.sL = e.clientX - _cache.sq.outer.offset().left + scrollLeft;
        _cache.sq.dom = box;
        _cache.events = !events? {} : events;
        _cache.sq.cut = cut;
        var defaultLen = (!$.browser.msie)? 0 : 1;
        if(box.css("position") == "absolute" || box.css("position") == "relative"){
            _cache.sq.box.width(defaultLen).height(defaultLen).css({
                top: (_cache.sq.sT + cut.top) + "px", 
                left: (_cache.sq.sL + cut.left) + "px"
            });
        }
        else{
            _cache.sq.box.width(defaultLen).height(defaultLen).css({
                top:(_cache.sq.sT - scrollTop + cut.top) + "px", 
                left: (_cache.sq.sL + cut.left) + "px"
            });
        }
        _cache.sq.box.show();
        if(_cache.events.mousedown){
            var l = _cache.sq.box.offset().left, t = _cache.sq.box.offset().top, w = _cache.sq.box.width(), h = _cache.sq.box.height();
            _cache.events.mousedown(l, t, l+w, t+h, e.ctrlKey, e);
        }
        _cache.sq.box.hide();
        return true;
    });
        
    try{
        if(parent){
            //绑定父框架事件
            $(parent.document).bind("mousemove", sqEvent.move).bind("mouseup", sqEvent.up);
        }
    }catch(e){}
    return {
        Disable: function(){
            if(_cache.sq.movestate){
                _cache.sq.movestate = false;
                _cache.sq.box.hide();
                _cache.sq.x = _cache.sq.y = _cache.sq.w = _cache.sq.h = _cache.sq.t = _cache.sq.l = _cache.sq.st = 0;
                if($.browser.msie){
                    _cache.MoveLayOut && _cache.MoveLayOut[0].releaseCapture();
                }
                _cache.MoveLayOut && _cache.MoveLayOut.hide();
                return false;
            }
        },
        Stop: function(){
            stopStatus = true;
        },
        Start: function(){
            stopStatus = false;
        }
    }
}
/****END 选择框****/

return Return;
})();


//标签控制
Util.Layer = (function(){
    var _cache = {},Return = {};	//缓存类
	
    //最小化
    Return.Min = function(box,mBox,callback){
        if(!_cache.MinBorder){
            _cache.Minborder = $('<div style="z-index:10000000;background: none repeat scroll 0 0 #fff;filter:alpha(opacity=30);-moz-opacity:0.3;opacity:0.3;border:1px soild #ccc;position:absolute;top:0;left0;display:none;"></div>');
            $(document.body).append(_cache.Minborder);
        }
        //mBox.show();
        var w = box.width(), h = box.height(), t = box.offset().top, l = box.offset().left, eT = mBox.offset().top, eL = mBox.offset().left, eW = mBox.width(), eH = mBox.height();
        _cache.Minborder.width(w).height(h).css({
            left:l,
            top:t
        }).show();
        _cache.Minborder.animate({
            width:eW,
            height:eH,
            top:eT,
            left:eL
        },300,function(){
            _cache.Minborder.hide();
        });

        if(callback){
            callback();
        }
    }
	
    /*
	设置标签居中(左右居中，上下1:2)
	
	*/
    Return.Center = function(box,setting){
        var mainBox;
        var cut = 0, t = 0, l = 0;
        if(setting){
            if(setting.Main){
                mainBox = setting.Main;
                t = mainBox.offset().top;
                l = mainBox.offset().left;
                if(setting && setting.NoAddScrollTop){
                    t -= $(window).scrollTop();
                }
            }
            else{
                mainBox = $(window);
            }
            if(setting.Cut != undefined){
                cut = setting.Cut;
            }
            
            
            
        }
        else{
            mainBox = $(window);
        }
        var cssT = (mainBox.height() - box.outerHeight())/3 + cut + t;
        var cssL = (mainBox.width() - box.outerWidth())/2 + cut + l;
        if(cssT < 0){
            cssT = 0;
        }
        if(cssL < 0){
            cssL = 0;
        }
        var st = 0;
        if(!setting || !setting.NoAddScrollTop){
            st = mainBox.scrollTop();
        }
        if(st){
            cssT += st;
        }
        box.css({
            top: cssT, 
            left: cssL
        });
    }
		
    return Return;
})();


Util.Html = {
    StopPropagation:function(e){
        /*if($.browser.msie){
            event.cancelBubble=true;
        }else{
            e.stopPropagation();
        }	//停止冒泡*/
        e.stopPropagation();
    }
}

Util.Style = {
    IncludeCss: function(id , url){
        if(!document.getElementById(id)){
            var link = document.createElement("link");
            link.id = id;
            link.rel = "stylesheet";

            link.type = "text/css";

            link.href = url;

            document.getElementsByTagName("head")[0].appendChild(link);
        }
    },
    RemoveCss: function(id){
        var linkBox = $("#" + id);
        linkBox.remove();
    }
}

Util.Override = function(b, n, o){
    var _super = {};
    var _params = [];
    var _arg = arguments;
    if(_arg.length > 3){
        for(var i = 3, len = _arg.length; i < len; i++){
            _params.push(_arg[i]);
        }
    }
    b.apply(n, _params);
    for(var k in n){
        _super[k] = n[k];
    }
    for(var k in o){
        n[k] = o[k];
    }
    return _super;
}

Util.Image = {
    Rotate: function(img, num){
        if(num == undefined){
            num = 0;
        }
        
        var deg = num * 90;
        
        if($.browser.msie){
            if(num > 3){
                num = 0;
            }
        }
        
        img.css({
            "-webkit-transform": "rotate("+deg+"deg)",
            "-moz-transform": "rotate("+deg+"deg)",
            "-o-transform": "rotate("+deg+"deg)",
            "-ms-transform": "rotate("+deg+"deg)",
            "filter": "progid:DXImageTransform.Microsoft.BasicImage(Rotation="+num+")"
        });
        
        return num;
    }
};

/**
 * title提示
 */
(function(){
    if(navigator.platform.toString().toLowerCase() != "ipad"){

        $(document).ready(function(){
            var _popTitle, _popTitleTimer, _popTitleHideTime;

            var showTitleFun = function(el){
                try{
                    if(el && el.length){
                        el.attr('title', el.attr('data_title'));
                        el.removeAttr('data_title');
                    }
                }catch(e){}
            }

            $(document).on({
                mouseenter:function(){
                    try{
                        showTitleFun($(this));
                    }catch(e){}
                },
                mouseleave:function(){
                    try{
                        if(_popTitleTimer) window.clearTimeout(_popTitleTimer);
                        if(_popTitleHideTime) window.clearTimeout(_popTitleHideTime);
                        _popTitleHideTime = window.setTimeout(function(){
                            if(_popTitle){
                                _popTitle.hide();
                            }
                        }, 100);
                    }catch(e){}
                }
            },"[data_title]");
            $(document).on('mousemove', function(e){
                try{
                    var el = $(e.target);
                    if(el && el.length && !$(e.target).attr('data_title') && !$(e.target).parents('[data_title]').length && _popTitle){
                        !_popTitle.is(':hidden') && _popTitle.hide();
                    }
                }catch(e){}
            });
        });
    }
})();


(function(){
    var doc,defaultTitle,timer,title,timer2,ctitle,speed=300;
    function titleScroll() {
        if (ctitle.length <title.length) ctitle += " - " + title;
        ctitle = ctitle.substring(1, ctitle.length);
        doc.title = ctitle.substring(0, title.length);
        timer=setTimeout(titleScroll, speed);
    }
    Util.title={
        init:function(defTitle){
            try{
                doc=window.top.document;
                defaultTitle=defTitle||doc.title;
            }catch(e){
                doc=document;
                defaultTitle=defTitle||doc.title;
            }
        },
        start:function(tit,sp){
            if(tit==title) return;
            title=tit;
            ctitle="";
            speed=sp||speed;
            clearTimeout(timer);
            clearTimeout(timer2);
            titleScroll();
        },
        stop:function(tit){
            clearTimeout(timer);
            title="";
            timer2= setTimeout(function(){
                if(doc){
                    doc.title=tit||defaultTitle;
                }
            },1500);

        }
    }
}());

(function(){
    return;
    var focusTimer;
    
    $(document).on("mouseover", function(e){
        var el = e.target;
        var tagName = el.tagName.toUpperCase();
        if((tagName == "INPUT" && (el.type == "text" || el.type == "password")) || tagName == "TEXTAREA"){
            if(focusTimer) window.clearTimeout(focusTimer);
            focusTimer = window.setTimeout(function(){
                el.focus();
            }, 200);
        }
    }).on("mouseout", function(e){
        var el = e.target;
        var tagName = el.tagName.toUpperCase();
        if((tagName == "INPUT" && (el.type == "text" || el.type == "password")) || tagName == "TEXTAREA"){
            if(focusTimer) window.clearTimeout(focusTimer);
        }
    });
    
})();


;
(function(){
    Util.log = function(obj){
        window['console'] && console.log(obj);
    }

})();

;
(function(){
    try{
    if(window['localStorage'] && 'setItem' in window['localStorage']){
        var co = Util.Cookie;
        //本地存储
        var storage = (function(){
            var _userId = '', 
            _hour_key="api_h5_hour_key",
            _divide = ":";

            var saveHour = function(key, hour){
                var val = localStorage.getItem(_hour_key);
                var v2 = val;
                if(!val){
                    val = _divide;
                    localStorage.setItem(_hour_key, val);
                }
                var reg = new RegExp(_divide + key + "=.*?" + _divide);
                if(reg.test(val)){
                    val = val.replace(reg, function(){
                        return key + "=" + hour + _divide;
                    });
                }
                else{
                    val += key + "=" + hour + _divide;
                }
                try{
                    localStorage.setItem(_hour_key, val);
                }
                catch(e){
                }
            }

            var clearHour = function(){
                var val = localStorage.getItem(_hour_key);
                if(val && val.length > 1){
                    val = val.substring(1, val.length);
                    var arr = val.split(_divide);
                    var newArr = [];
                    if(arr && arr.length){
                        for(var i = 0, len = arr.length; i < len; i++){
                            var item = arr[i];
                            var itemArr = item.split('=');
                            if(itemArr.length == 2){
                                var key = itemArr[0];
                                var v = itemArr[1];
                                if(Number(v) == -1){
                                    storage.remove(key);
                                    continue;
                                }
                                newArr.push(item);
                            }
                        }

                    }
                    if(newArr.length){
                        localStorage.setItem(_hour_key, _divide + newArr.join(_divide));
                    }
                    else{
                        localStorage.setItem(_hour_key, _divide);
                    }

                }
            }

            return {
                init: function(userId){
                    _userId = userId;
                    _userId = '';
                    clearHour();
                },
                set: function(key, val, hour){
                    if(_userId){
                        var key = _userId + "_" + key;
                    }
                    try{
                        localStorage.setItem(key, val);
                        if(hour == undefined){
                            hour = -1;
                        }
                        saveHour(key, hour);
                    }catch(e){
                        Util.Cookie = co;
                        Util.Cookie.set(key, val, hour);
                    }
                },
                get: function(key){
                    if(_userId){
                        var key = _userId + "_" + key;
                    }
                    return localStorage.getItem(key);
                },
                remove: function(key){
                    if(_userId){
                        var key = _userId + "_" + key;
                    }
                    localStorage.removeItem(key);
                }
            }
        })();
        
        Util.Cookie =  storage;
    }
    }catch(e){}
})();
