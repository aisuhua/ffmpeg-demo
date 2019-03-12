if(!window['PAGE_PATHS']){
    ;(function(){
        var domainStr = document.location.host.replace(/.*115/g, '115');
        window['PAGE_PATHS'] = {
            MY: "//my." + domainStr,
            MY_OS: "//my." + domainStr,
            PASSPORT_N: '//passport.' + domainStr,
            PASSPORT: "//passport." + domainStr,
            WAN: "//wan." + domainStr,
            Q: "//q." + domainStr,
            MSG:"//msg." + domainStr,
            U: "//" + domainStr,
            VIP: "//vip." + domainStr,
            UAPI: "//web.api." + domainStr,
            PAY: "//pay." + domainStr,
            STATIC: '//static.' + domainStr,
            APS: '//aps.' + domainStr
        };
        var _isHTTPS = false;
        var thisURL = window.location.href;
        if(/^https:\/\/.*$/.test(thisURL)){
            _isHTTPS = true;
        }
        if(_isHTTPS){
            window['PAGE_PATHS'].UAPI = "//webapi." + domainStr;
        }
    })();
}

var Core = window["Core"] || {};//正在活动的桌面(Web OS遗留)
Core.ACTIVE = {
    AcDesk: 0,
    GetMain: function(){
        return $(document);
    }
}

Core.Plugs = (function(){
    var _cache = {};
    
    return {
        AddButton: function(key, fun){
            if(!_cache['float_menu_btn']){
                _cache['float_menu_btn'] = {};
            }
            _cache['float_menu_btn'][key] = fun;
        },
        DoButton: function(key){
            if(_cache['float_menu_btn'] && _cache['float_menu_btn'][key]){
                var arg = arguments;
                var params = [];
                if(arg.length > 1){
                    for(var i = 1,len = arg.length; i < len; i++){
                        params.push("arg["+i+"]");
                    }
                }
                try{
                    eval("var res = _cache['float_menu_btn'][key]("+params.join(",")+")");
                    return true;
                }catch(e){
                    return false;
                }
            }
            return false;
        },
        Add: function(key, type, mod){
            if(!_cache[type]){
                _cache[type] = {};
            }
            _cache[type][key] = mod;
        },
        Check: function(key, type){
            if(_cache[type]){
                return (_cache[type][key]? true: false);
            }
            return false;
        },
        Cmd: function(key, type, funName){
            if(Core.Plugs.Check(key, type)){
                var arg = arguments;
                var params = [];
                if(arg.length > 3){
                    for(var i = 3,len = arg.length; i < len; i++){
                        params.push("arg["+i+"]");
                    }
                }
                if(_cache[type][key][funName]){
                    eval("var res = _cache[type][key]." + funName + "("+params.join(",")+")");
                }
                return res;
            }
        }
    }
})();



//Core公用函数
Core.Html = {
    GetShadow: function(){
        return '';
        return '<div class="shadow-cor cor-tl"></div><div class="shadow-cor cor-tr"></div><div class="shadow-cor cor-br"></div><div class="shadow-cor cor-bl"></div><div class="shadow-cor cor-t"></div><div class="shadow-cor cor-r"></div><div class="shadow-cor cor-b"></div><div class="shadow-cor cor-l"></div>';
    },
    StopPropagation:function(e){
        Util.Html.StopPropagation(e);
    },
    GetFullIFrame: function(){
        return "";
    //return ($.browser.msie?'<iframe width="100%" height="100%" style="z-index:-1;position:absolute;top:0;left:0;">':"");
    }
}


Util.CopyMsg = function(result){
    if(result){
        Core.MinMessage.Show({
            text: "内容已复制至剪贴板",
            type: "suc", timeout: 2000
        })
    }
    else{
        Core.MinMessage.Show({
            text: "复制失败! 您使用的浏览器不支持复制功能",
            type: "war", timeout: 2000
        })
    }
};






/**
 * 调试窗口
 */
Core.Debug = (function(){
    var _content, _model;
	
    var _class = function(content, callback){
        var _self = this;
        Core.WindowBase.call(this, {
            content: content, 
            title: "调试", 
            min_title: "调试"
        });
            
        var oldclose = _self.Close;
        this.Close = function(){
            oldclose();
                
            callback && callback();
        }
    }
	
    return {
        write: function(msg){
            if(!Core.CONFIG.TUpDebugKey){
                return;
            }
            if(!_model){
                _content = $(document.createElement('textarea'));
                _content.css({
                    width: "100%", 
                    height: "100%"
                });
                _model = new _class(_content, function(){
                    _model = false;
                });
                _model.Open();
            }
            _content.val(_content.val() + msg + "\n");
        }
    }
})();///import core.js
Core.HAS_TALK = 1;

if(!window['STATIC_DIR']){
    STATIC_DIR = PAGE_PATHS["U"] + '/static';
}

Core.Update115 = null;
Core.Update115Browser = null;
try{
    if(window['uploadInterface']) {
        var uploadVersion = uploadInterface.getVersion()+'';
        uploadVersion = uploadVersion.split('.');
        if(uploadVersion[3].length == 1) {
            uploadVersion[3] = '0'+uploadVersion[3];
        }
        uploadVersion = uploadVersion.join('')*1;


        var is_MAC = ( (navigator.platform == "Mac68K") || (navigator.platform == "MacPPC") || (navigator.platform == "Macintosh") || (navigator.platform == "MacIntel") ) ? true : false;

        var maxVersion = is_MAC ? 71018 : 71043;
        var newMaxVersion = is_MAC ? 72001 : 72007;

        if(uploadVersion >= maxVersion && uploadInterface.uploadBySelecting) {
            // Core.Update115 = uploadInterface;
            window['UPDATE115_STATE'] = function (data) {
                if(!data) {
                    Core.Update115 = uploadInterface;
                    if(uploadVersion >= newMaxVersion) {
                        Core.Update115Browser = true;
                    }
                }else {
                    Core.Update115 = false;
                }
            }
            Util.log('隐身状态');
            window['browserInterface'] && browserInterface.ChromeGetIncognitoState && browserInterface.ChromeGetIncognitoState('UPDATE115_STATE');
        }
    }
}catch(e){
    
}

//配置信息
Core.CONFIG = {
    TwinkTime: 70,	//提示框闪烁时长
    TwinkCount: 3,	//提示框闪烁次数
    MsgTimeout: 2000,	//minmessage 自动隐藏时间
    ActiveClass: "window-current",
    WindowMinWidth: 400,
    WindowMinHeight: 300,
    Path: {
        My: PAGE_PATHS["MY"],
        MyAjax: PAGE_PATHS["MY"],
        HOME: PAGE_PATHS["HOME"] + "/",
        G: PAGE_PATHS["Q"] + "/",
        GAJAX: PAGE_PATHS["Q"] + "/",
        U: PAGE_PATHS["U"] + "/",
        PASS: PAGE_PATHS["PASSPORT"] + "/",
        Msg: PAGE_PATHS["MSG"] + "/",
        OS: PAGE_PATHS["U"] + "/",
        VIP: PAGE_PATHS["VIP"],
        VIP_ORDER: PAGE_PATHS["VIP"] + "/vip",
        UAPI: PAGE_PATHS["UAPI"],
        APP: PAGE_PATHS["APP"],
        WENKU: PAGE_PATHS["WENKU"],
        APS: PAGE_PATHS["APS"]
    },
    JSPath:{
        FUp: STATIC_DIR + "/swfup/swfup_min.js?v=99",	//swfupload js URI
        JPlayer: STATIC_DIR + "/js/jquery.jplayer.min.js?v=2015",	//Jplayer js URI
        JPProxy: STATIC_DIR + "/js/jplayer_proxy.js?v=2015"	//Jplayer proxy js URI
    },
    FUpSWF: PAGE_PATHS['U'] + "/static/swfup/swfup.swf?v=5.0",	//Flash上传swf路径
    FUpDebug: false,	//Flash上传调试开关
    HTML5: (typeof(Worker) !== "undefined"), //判断浏览器是否支持HTML5
    IsWindows: true,    //需要更换被占用，判断是否是windows 改为 IsWindowNT
    IsWindowNT: (navigator.userAgent.indexOf("Windows NT")!=-1),
    IsMac: (navigator.platform == "Mac68K") || (navigator.platform == "MacPPC") || (navigator.platform == "Macintosh") || (navigator.platform == "MacIntel"),
    IsMacOOF: window['uploadInterface'],
    //IsUnix: navigator.,
    IsOOF: (function(){
        var res = {state: false};
        if($.browser.webkit){
            var nav = navigator.appVersion;
            var str = /115Chrome\/[^\s]*/.exec(nav);
            if(str){
                res.state = true;
                var arr = $.trim(str.join('')).split('/');
                if(arr.length > 1){
                    res.version = arr[1];
                    if(arr[1] == '1.0.2' || arr[1] == '1.0.3'){
                        res.is_first = true;
                    }
                }
            }
        }
        return res;
    })(),
    
    BaseDir: [1,2,3,4,5,9], //网盘基础目录
    
    WinRightPX: 12,
    DABridgeURL: PAGE_PATHS["UAPI"] + "/bridge.html",     //数据跨域访问桥文件
    DABridgeURL_NEW: PAGE_PATHS["UAPI"] + "/bridge_2.0.html",     //数据跨域访问桥文件 新接口
    DAAppBridgeURL: PAGE_PATHS["APP"] + "/bridge_new.html",     //应用数据跨域访问桥文件
    DAUserBridgeURL: PAGE_PATHS["MY"] + "/bridge.html",     //用户中心数据跨域访问桥文件
    DAMsgBridgeURL: PAGE_PATHS["MSG"] + "/api/bridge.html",     //消息中心数据跨域访问桥文件
    DAQBridgeURL: PAGE_PATHS["Q"] + "/static/bridge.html",   //圈子数据跨域访问桥文件
    DAUBridgeURL: PAGE_PATHS["U"] + "/ubridge.html",
    DASTBridgeURL: PAGE_PATHS["STATIC"] + "/bridge_2.0.html",     //数据跨域访问桥文件(static.115.com)
    APSBridgeURL: PAGE_PATHS["APS"] + "/bridge_2.0.html",
    DAPASBridgeURL: PAGE_PATHS["PASSPORT"] + "/bridge.html"
};(function(config){
    for(var k in config){
        Core.CONFIG[k] = config[k];
    }
})({ 
    DebugKey: false,	//调试开关
    TUpDebugKey: false, //上传调试开关
    TUpDebugTime: 0,
    SpaceTips: '#js_index_space_tips',
    ImterimShareKey: false,
    ImterimShareMsg: "",
    OpenMeituKey: false,
    QFileAPI: null,
    NotUpCanDo: ["delete", "q_delete", "upload", "adddir", "reupload", "fl_delete"],
    SpacilDir: [35, 36, 22, 49, 99],
    ChangeTopDir: [5],
    InDiskDir: [-4,-3, 1,2,3,4,5,9, 22, 49, 35, 36], //网盘基础目录
    IsSeaDir: [-3, -4],
    ICOType:{	//图标类型
        "1_0":"i-file",
        "2_0":"i-document",
        "3_0":"i-photo",
        "4_0":"i-music",
        "9_0":"i-video",
        "5_0":"i-file",
        "21_0":"i-folder",
        "22_0":"i-sync",
        "-2_0": "i-transfer",
        share:"i-shared-folder",
        Default:"i-folder"
    },
    FileICOMod: 0,	//操作图标默认显示模式 0 小图标 1 大图标
    FileListMod: "view",	//默认
    FileDownload: "#js_download_list_box",
    MusicPlay: "#js_jplay_box",
    CssPath:{},
    EditPath:"static_help/editor/editor.php?charset=utf-8&allowhtml=1&domain=" + encodeURIComponent(window["PAGE_DOMAIN_ROOT"]),	//描述编辑框URI
    EditTextArea: "js_ttHtmlEditor",
    IsLogin: false, //是否已经登录//
    Main: "#main",
    DefaultTitle: "",
    CenterMain: '#js_center_main_box',
    ShowHideFileKey: false,
    ShowHideFileButton: 'js_show_hide_btn_' + new Date().getTime()
});
//浮动菜单配置
Core.FloatMenuConfig = {
    "none_file_btn":{
        "upload": {
            text: '上传文件'
        },
        "add_dir": {
            text: '新建文件夹'
        }
    },
    
    //更多菜单设置
    "right_file": {
        /*"edit_movie":{
            text: '添加到我看'
        },
        "import_movie":{
            text: '添加到我看'
        },*/
        "hide_file":{
            text: '加密隐藏'
        },
        "show_file": {
            text: '解除隐藏'
        },
        "listen": {
            text: "添加到我听"
        },
        "magic": {
            text: "美化"
        },
        "cover": {
            text: "修改封面"
        },
        "del_cover": {
            text: "删除封面"
        },
        'same':{
            text: '一键排重'
        },
        "edit_name": {
            text: "重命名", 
            ico:"rename"
        },
        "edit": {
            text: "备注"
        }
    },
    //文件右键菜单设置
    "more_btn": {
        "view": {
            text: "打开"
            //ico:"preview"
        },
        "open_dir":{
            text: "打开"
        },
        /*"shareto" : {
            text: "发送",
            ico: "share"
        },*/
        "download": {
            text: "下载",
            ico: "download"
        },
        "download_dir":{
            text: "下载文件夹",
            ico: "download"
        },
        "bale_download":{
            text: "打包下载"
        },
        /*"import_movie":{
            text: '添加到我看'
        },
        "edit_movie":{
            text: '添加到我看'
        },*/
        "hide_file":{
            text: '加密隐藏'
        },
        "show_file": {
            text: '解除隐藏'
        },
        "listen": {
            text: "添加到我听"
        },
        "magic": {
            text: "美化"
        },
        "cover": {
            text: "修改封面"
        },
        "del_cover": {
            text: "删除封面"
        },
        'same': {
            text: '一键排重'
        },
        "move": {
            text: "移动",
            ico: 'move'
        },
        "edit_name": {
            text: "重命名",
            ico:"rename"
        },
        "edit": {
            text: "备注"
        },
        "delete": {
            text: "删除",
            ico: "remove"
        }
    },
    //上传线路设置
    "up_setting":{
        "flash": {
            text: "普通上传", 
            ico: "done"
        },
        "ocx1": {
            text: "电信极速上传",
            ico: "done"
        },
        "ocx2": {
            text: "联通极速上传", 
            ico: "done"
        },
        "ocx3": {
            text: "移动极速上传",
            ico: "done"
        },
        "ocx4": {
            text: "长宽极速上传",
            ico: "done"
        }
    }
}

//文件管理配置
Core.FileConfig = {
    aid: -1,
    cid: -1,
    DataAPI: false,
    //按钮权限
    OPTPermission:{
        nonefile: ['upload', 'add_dir'],
        onemusic: ["star", "gift", "edit", "listen", "add_listen", "edit_name", "download", "send", "copy", "move", "delete", "shareto"],	//选择了一个音乐文件
        onephoto: ["star", "gift",  "edit", "edit_name", "download", "send", "copy", "move", "delete", "view", "shareto", "magic"],	//选择了一张图片
        onemovie: ["star", "gift",  "edit",  "edit_name", "download", "send", "copy", "move", "delete", "view","shareto"],
        onedocument: ["star", "gift",  "edit", "edit_name", "download", "send", "copy", "move", "delete", "view", "shareto"],   //选中了一份文档
        onefile: ["star",  "gift", "edit","edit_name", "download", "send", "copy", "move", "delete", "view", "shareto"],	//选中单个文件
        onefolder: ["open_dir", "export", "same", "gift", "delete", "shareto", "send", "edit_name", "move"],	//选中单个文件夹 'download_dir',
        onefoldercover: ["cover"],
        onefolderdelcover:["del_cover"],
        cancelshare: ["shareto", "share_file"],
        fewmusic: ["star", "gift", "copy", "listen", "add_listen", "send", "move", "delete", "shareto"],	//选择了多个音乐文件
        fewphoto: ["star", "gift", "copy", "send", "move", "delete", "shareto"],	//选择了多张图片 "bale_download"
        fewmovie: ["star", "gift", "copy", "send", "move", "delete", "shareto"],
        fewfile: ["star",  "gift", "copy", "send", "move", "delete", "shareto"],
        fewfolder: ["shareto", "gift", "delete", "move"],
        fewfandfl: ["delete", "move", "gift"],	//选中了多个文件夹与文件
        rb: ["remove"],
        rbfile: ["rb_delete", "restore"],
        hide_file: ['show_file'],
        show_file: [ 'hide_file' ]
    },
    //分类显示按钮权限
    Specil: {
        "-3": {
            "edit":1,
            "edit_name":1, 
            "delete": 1, 
            "download": 1, 
            "copylink": 1, 
            "cancelshare":1,
            "renew":1, 
            "shareto": 1,
            "move":1,
            "share_one":1,
            "more_one":1,
            "download_one":1,
            "download_dir_one":1
        },
        "5": {
            "edit":1,
            "edit_name":1, 
            "delete": 1, 
            "download": 1,
            "share_one":1,
            "more_one":1,
            "download_one":1,
            "download_dir_one":1
        },
        "99": {
            "download_one":1,
            "download_dir_one":1
        }
    }
}

Core.FileConfig.OPTPermission['fewmovie'].push('import_movie');
Core.FileConfig.OPTPermission['onemovie'].push('edit_movie');
//IE下开启批量下载
if($.browser.msie || (Core.CONFIG.IsMacOOF && Core.CONFIG.IsMac)){
    Core.FileConfig.OPTPermission.fewmusic.push("download");
    Core.FileConfig.OPTPermission.fewphoto.push("download");
    Core.FileConfig.OPTPermission.fewmovie.push("download");
    Core.FileConfig.OPTPermission.fewfile.push("download");
}//网盘设置
Core.Setting = {
    Change: function(r, callback){
        var data = {}
        for(var k in r){
            data['key[' + k + ']'] = r[k];
        }
        $.ajax({
            url: "?ct=ajax_user&ac=set_user_config",
            type: "POST",
            dataType: "json",
            data: data,
            success: function(res){
                if(res.state){
                    if(Core.CONFIG.IsWindows){
                        if(r["os_file_upload_type"] != undefined){
                            if(r["os_file_upload_type"] == 0){
                                Core.CONFIG.UpEngine = 0;
                            }
                            else{
                                Core.CONFIG.UpEngine = 1;
                                if(r["os_file_upload_type"] == 1){
                                    Core.CONFIG.TUpSp = "0";
                                }
                                else{
                                    Core.CONFIG.TUpSp = "1";
                                }
                            }
                        }
                    }
                    else{
                        Core.CONFIG.UpEngine = 0;
                    }
                }
                if(callback){
                    callback(res);
                }
            }
        })
    }
}

Core.NewSetting = {
    Get: function(key){
        return USER_SETTING[key];
    },
    Change: function(setting, callback){
        for(var k in setting){
            USER_SETTING[k] = setting[k];
        }
        var setArr = [];
        
        for(var k in setting){
            setArr.push('"'+k+'":' + '"'+setting[k]+'"');
        }
        
        var saveSetting = '{'+setArr.join(',')+'}';
        
        $.ajax({
            url: '/?ct=user_setting&ac=set',
            data: {setting: saveSetting},
            type: 'POST',
            dataType: 'json',
            success: function(r){ callback && callback(r); }
        });
    }
}

//用户
Core.UserSetting = (function(){
    return {
        Change: function(params, callback){
            if(!params){
                params = {};
            }
            UA$.ajax({
                url: '/files/order',
                type: 'POST',
                data: params,
                success: function(r){
                    (Core.MinMessage) && Core.MinMessage.Hide();
                    try{
                        r = eval("("+r+")");
                        if(r.state){
                            callback && callback(r);
                        }
                        else{
                            Core.MinMessage.Show({
                                text: r.error, type: 'war', timeout: 2000
                            });
                        }
                    }catch(e){
                        callback && callback(r);
                    }
                }
            });
        }
    }
})();


//窗体历史记录
Core.WinHistory = (function(){
    var _list = {};	//窗体库
    var _random = 0;	//游标
    var _zIndex = 99;
    var _old_active;
    var _bindState = false;
    var bindEvent = function(){
        if(!_bindState){
            $(window).bind("resize", function(){
                for(var k in _list){
                    var win = _list[k];
                    var h = win.Main.height();
                    var w = win.Main.width();
                    var wH = win.warp.height();
                    var wW = win.warp.width();
                    var wT = win.warp.offset().top;
                    var wL = win.warp.offset().left;
                    var mL = win.Main.offset().left;
                    if(win.Setting.is_right){
                        win.warp.height(h - wT - 5);
                        win.warp.offset({
                            left: mL + w-wW - Core.CONFIG.WinRightPX
                            });
                    }
                    else{
                        if((wL + wW) > w){
                            var newL = w-wW - 5;
                            if(newL < 0){
                                wW = wW + newL;
                                newL = 0;
                            }
                            if(!win.Setting.is_not_resize){
                                if(wW < win.Setting.min_width){
                                    wW = win.Setting.min_width;
                                }
                                win.warp.width(wW);
                            }
                            win.warp.offset({
                                left: newL
                            });
                        }
                        if((wT + wH) > h){
                            var newT = h-wH - 5;
                            if(newT < 0){
                                wH = wH + newT;
                                newT = 0
                            }
                            if(!win.Setting.is_not_resize){
                                if(wH < win.Setting.min_height){
                                    wH = win.Setting.min_height;
                                }
                                win.warp.height(wH);
                            }
                            win.warp.offset({
                                top: newT
                            });
                        }
                    }
                }
            })
            _bindState = true;
        }
    }
    
    var windowStatusChange = function(){
        for(var k in Core.WinHistory.ChangeDelegate){
            try{
                if(Core.WinHistory.ChangeDelegate[k]){
                    Core.WinHistory.ChangeDelegate[k](_list);
                }
            }catch(e){
                Core.WinHistory.ChangeDelegate[k] = null;
                delete Core.WinHistory.ChangeDelegate[k];
            }
        }

    }
	
    return {
        ChangeDelegate: {},
        GetList: function(){
            return _list;
        },
        //增加窗口历史记录
        Add: function(win){
            bindEvent();
            win.Key = win.Type + "_" + _random;
            _random++;
            _list[win.Key] = win;
            
            windowStatusChange();
        },
        //删除窗口历史记录
        Del: function(key){
            if(_list[key]){
                _list[key] = null
                delete _list[key];
                windowStatusChange();
            }
        },
        GetIndex: function(){
            return _zIndex++;
        },
        LessIndex: function(){
            _zIndex--;
        },
        Active: function(win){
            if(_old_active && _old_active == win.Key){
                return;
            }
            _zIndex++;
			
            win.Active(_zIndex);
            win.IsActive = true;
            if(_old_active && _list[_old_active]){
                _list[_old_active].DeActive();
                _list[_old_active].IsActive = false;
            }	
            _old_active = win.Key;
            windowStatusChange();
        },
        Alarm: function(win){
        },
        DeOldActive: function(){
            if(_old_active && _list[_old_active]){
                _list[_old_active].DeActive();
                _list[_old_active].IsActive = false;
                _old_active = false;
            }
        },
        DeActiveStatus: function(win){
            Core.WinHistory.DeOldActive();
            _old_active = false;
            windowStatusChange();
        }
    }
})();


///import core.js
///import config.js

//窗体头部
Core.WinTitle = (function(){
    var _temp = '<h2 class="dialog-title" rel="base_title"><span>{title}</span><div class="dialog-handle">{button}</div></h2>';
    var _btns = [
    '<a href="javascript:;" class="diag-minimize" btn="hide">最小化</a>',
    '<a href="javascript:;" class="diag-maximize" btn="max">最大化</a>'+
    '<a href="javascript:;" class="diag-return" style="display:none" btn="revert">还原</a>',
    '<a href="javascript:;" class="diag-close" btn="close">关闭</a>'
    ]
	
    var bindEvents = function(box, win){
        box.find("[btn]").mousedown(function(e){
            Core.Html.StopPropagation(e);
            Core.WinHistory.Active(win);
        }).click(function(e){
            win.SetButtonHandler($(this).attr("btn"));
            return false;
        })
    }
	
    return {
        Get: function(win){
            var html = _btns.join("");
            var box = $(String.formatmodel(_temp,{
                title:win.Setting.title,
                button:html
            }));
            bindEvents(box,win);
            return box;
        }
    }
})();

/**
 * 窗体基类
*/
Core.WindowBase = function(setting){
    var _temp = '<div class="dialog-box" style="display:none;" id="{key}_warp">' + Core.Html.GetShadow() + '<div id="{key}_inner" style="height:100%;"></div>' + Core.Html.GetFullIFrame() + '</div>';	//窗体模板

    var _resizeTemp = '<div resize="{resize_type}" style="position: absolute; overflow: hidden; background: url('+STATIC_DIR+'/js/transparent.gif) repeat scroll 0% 0% transparent; {css}"></div>'

    var _self = this;
    var _cache = { 
        resize:{ 
            "t": "left: 0; top: -3px; width: 100%; height: 5px; z-index: 1;",
            "r": "right: -3px; top: 0; width: 5px; height: 100%; z-index: 1;",
            "b": "left: 0; bottom: -3px; width: 100%; height: 5px; z-index: 1;",
            "l": "left: -3px; top: 0; width: 5px; height: 100%; z-index: 1;",
            "rt": "right: -3px; top: -3px; width: 10px; height: 10px; z-index: 2",
            "rb": "right: -3px; bottom: -3px; width: 10px; height: 10px; z-index: 2",
            "lt": "left: -3px; top: -3px; width: 10px; height: 10px; z-index: 2",
            "lb": "left: -3px; bottom: -3px; width: 10px; height: 10px; z-index: 2"
        }
    };
	
    //配置
    if(!setting){
        setting = {};
    }
	
    if(!setting.content){
        setting.content = "";
    }
    if(!setting.title){
        setting.title = "";
    }
    if(!setting.min_title){
        setting.min_title = "窗口";
    }
	
    this.warp;	//窗口DOM
	
    this.Type = "window";
    this.IsActive = false;
	
    this.StatusType = 0;	//状态栏类型	0,基本模式 1,小图标模式
	
    if(setting.Status != undefined){
        this.StatusType = setting.Status;
    }
	
    this.Setting = setting;
    this.Main;

    //绑字自定义拉伸
    var bindResize = function(resizeType,ele){
        var rt = "";
        switch(resizeType){
            case "t":
                rt = "n-resize";
                break;
            case "r":
                rt = "e-resize";
                break;
            case "b":
                rt = "s-resize";
                break;
            case "l":
                rt = "w-resize";
                break;
            case "rt":
                rt = "ne-resize";
                break;
            case "rb":
                rt = "se-resize"
                break;
            case "lb":
                rt = "sw-resize";
                break;
            case "lt":
                rt = "nw-resize";
                break;
        }
        Util.Mouse.MoveLine(ele,rt,function(line){
            var xLess = line.eX - line.x;
            var yLess = line.eY - line.y;
			
            var w = _cache.resize_width;
            var h = _cache.resize_height;
            var t = _cache.resize_top;
            var l = _cache.resize_left;
            if(/l/.test(resizeType)){
                w = w - xLess;
                if(w < _cache.resize.min_width){
                    l = _cache.resize_maxL;
                }
                else{
                    l = l + xLess;
                }
            }
            if(/r/.test(resizeType)){
                w = w + xLess;
            }
            if(/b/.test(resizeType)){
                h = h + yLess;
            }
            if(/t/.test(resizeType)){
                h = h - yLess;
                if(h < _cache.resize.min_height){
                    t = _cache.resize_maxT;
                }
                else{
                    t = t + yLess;
                }
            }
			
            if(w < _cache.resize.min_width){
                w = _cache.resize.min_width;
            }

            if(h < _cache.resize.min_height){
                h = _cache.resize.min_height;
            }
			
            if(t < _cache.resize_mt){
                h = h - Math.abs(_cache.resize_mt - t);
                t = _cache.resize_mt;
            }
			
            if((t + h) > _cache.resize_mb){
                h =  _cache.resize_mb - t;
            }
			
            if(l < _cache.resize_ml){
                w = w - Math.abs(_cache.resize_ml - l);
                l = _cache.resize_ml;
				
            }
			
            if((l + w) > _cache.resize_mr){
                w = _cache.resize_mr + l;
            }
			
            _self.warp.css({
                width:w+"px",
                height:h + "px",
                top: t + "px",
                left:l+"px"
                });
            if(_self.Setting.is_right){
                _self.Setting.is_right = false;
            }
        },function(){
            var mainBox = _self.Main;
            _cache.resize_mt = mainBox.offset().top;
            _cache.resize_ml = mainBox.offset().left;
            _cache.resize_mr = _cache.resize_ml + mainBox.width();
            _cache.resize_mb = _cache.resize_mt + mainBox.height();
            _cache.resize_width = _self.warp.width();
            _cache.resize_height = _self.warp.height();
            _cache.resize_top = _self.warp.offset().top;
            _cache.resize_left = _self.warp.offset().left;
            _cache.resize_maxL = _cache.resize_left + _cache.resize_width - _cache.resize.min_width;
            _cache.resize_maxT = _cache.resize_top + _cache.resize_height - _cache.resize.min_height;
        });
    }
	
    //创建窗口
    var create = function(){
        if(!_cache.initState){
            _self.Main = $(document.body);
            _cache.initState = true;
            Core.WinHistory.Add(_self);
            _cache.resize.min_width = _self.Setting.min_width = _self.Setting.min_width? _self.Setting.min_width: Core.CONFIG.WindowMinWidth;
            _cache.resize.min_height = _self.Setting.min_height = _self.Setting.min_height? _self.Setting.min_height: Core.CONFIG.WindowMinHeight;
            if(!_self.warp){
                _self.warp = $(String.formatmodel(_temp,{
                    key:_self.Key
                    }));
                var inner = _self.warp.find("#" + _self.Key + "_inner");
                if(!_self.Setting.is_not_resize){
                    _cache.resize_list = [];
                    for(var k in _cache.resize){
                        var ele = $(String.formatmodel(_resizeTemp,{
                            resize_type: k, 
                            css: _cache.resize[k]
                            }));
                        bindResize(k,ele);
                        _self.warp.append(ele);
                        _cache.resize_list.push(ele);
                    }
                }
                if(!_self.Setting.is_not_title){	//判断是否需要头部
                    _cache.title = Core.WinTitle.Get(_self);	//窗体头部
                    inner.append(_cache.title);
                }
				
                inner.append(_self.Setting.content);
				
                if(_self.Setting.width != undefined){
                    _self.warp.width(_self.Setting.width);
                }
                if(_self.Setting.height != undefined){
                    _self.warp.height(_self.Setting.height);
                }
				
                var mainBox = _self.Main;
				
                //$(document.body).append(_self.warp);
                mainBox.append(_self.warp);
				
                if(_self.warp.height() > mainBox.height()){
                    _self.warp.height(mainBox.height());
                }
		
                if(_self.Setting.position){
                    _self.warp.css(_self.Setting.position);
                }
                else{
                    Util.Layer.Center(_self.warp, {
                        NoAddScrollTop: true
                    });
                    
                    if($.browser.msie && $.browser.version == 6){
                        if($.browser.msie && $.browser.version == 6){
                            _self.warp.css({
                                top: $(window).scrollTop() + ($(window).height() - _self.warp.height())/3
                            });
                        }
                    }
                    else{
                        _self.warp.css({
                            'position': 'fixed'
                        });
                    }
                }
		
                
                var st = {
                    ClickBox: _cache.title? _cache.title : _self.warp,
                    Box: _self.warp,
                    Outer: mainBox,
                    Callback: function(){
                        Core.WinHistory.Active(_self);
                    },
                    MoveCallback: function(){
                        if(_self.Setting.is_right){
                            _self.Setting.is_right = false;
                        }
                    }
                };
                
                var oh = document.documentElement.scrollHeight > document.documentElement.clientHeight ? document.documentElement.scrollHeight : document.documentElement.clientHeight
                
                if(oh <= mainBox.height()){
                    st.Outer = mainBox;
                }
                
                Util.Mouse.MoveBox(st);
                if(!_self.Setting.is_not_resize){
                    _cache.title.bind("dblclick", function(){
                        if(!_self.MaxState){
                            _self.Max();
                        }
                        else{
                            _self.Revert();
                        }
                    });
                }
                else{
                    _cache.title && _cache.title.find("[btn='max']").empty().remove();
                    _cache.title && _cache.title.find("[btn='revert']").empty().remove();
                }
				
                if(_self.Setting.is_not_min_title){
                    _cache.title && _cache.title.find(".win-minsize").empty().remove();
                }
				
				
                _self.warp.bind("mousedown",function(e){
                    Core.WinHistory.Active(_self);
                })
				
                if(_self.Setting.is_max_window){
                    _self.Max();
                }
            }
            if(_self.Initial){
                _self.Initial();
            }
        }
    }
	
    this.Max = function(){
        var mainBox = _self.Main;
        var w = mainBox.width(), h = mainBox.height();
        /*if($(document).height() <= mainBox.height()){
            h = $(document).height();
        }*/
        var oh = document.documentElement.scrollHeight > document.documentElement.clientHeight ? document.documentElement.scrollHeight : document.documentElement.clientHeight
        h = oh;
        _self.MaxState = true;
        _cache.old_sq = {
            w: _self.warp.width(),
            h: _self.warp.height(),
            t: _self.warp.offset().top,
            l: _self.warp.offset().left
        }
        _self.warp.width(w).height(h).css({
            top: 0, 
            left: 0
        });
        setTitleBtn();
        _self.Open();
    }

    this.Revert = function(){
        _self.MaxState = false;
        var w = _cache.resize.min_width, h = _cache.resize.min_height, t=0, l=0;
        if(_cache.old_sq){
            w = _cache.old_sq.w;
            h = _cache.old_sq.h;
            t = _cache.old_sq.t;
            l = _cache.old_sq.l;
        }
        _self.warp.width(w).height(h).css({
            top: t, 
            left: l
        });
        setTitleBtn();
    }
	
    this.CreateDom = function(){
        create();
    }
	
    this.Hide = function(){
        _self.warp.hide();
        _self.DeActive();
        Core.WinHistory.DeActiveStatus(_self);
        _self.IsActive = false;
    }

    //打开
    this.Open = function(){
        create();	//新建窗体
        _self.warp.show();
        Core.WinHistory.Active(_self);
    }
	
    var setTitleBtn = function(){
        if(_self.MaxState){
            _cache.title.find("[btn='max']").hide();
            _cache.title.find("[btn='revert']").show();
            if(_cache.resize_list){
                for(var i = 0, len = _cache.resize_list.length; i < len; i++){
                    _cache.resize_list[i].hide();
                }
            }
        }
        else{
            _cache.title.find("[btn='revert']").hide();
            _cache.title.find("[btn='max']").show();
            if(_cache.resize_list){
                for(var i = 0, len = _cache.resize_list.length; i < len; i++){
                    _cache.resize_list[i].show();
                }
            }
        }
    }
	
    this.SetButtonHandler = function(type){
        switch(type){
            case "hide":
                _self.Hide();
                break;
            case "max":
                _self.Max();

                break;
            case "revert":
                _self.Revert();
                break;
            case "close":
                _self.Close();
                break;
        }
		
    }
	
    this.Close = function(){
        Core.WinHistory.Del(_self.Key);
        _cache.initState = false;
        _self.warp && _self.warp.hide();
        _self.MaxState = false;
    }
	
    //激活
    this.Active = function(zIndex){
        _self.warp.css({
            zIndex:zIndex
        }).addClass(Core.CONFIG.ActiveClass);
    }
	
    //取消激活
    this.DeActive = function(){
        _self.warp.removeClass(Core.CONFIG.ActiveClass);
    }
}///import core.js
///import config.js

/*
 对话框
 */
Core.DialogBaseHandler = {};
Core.DialogBase = function(settings){
    var _temp = '<div class="dialog-box dialog-mini" style="display:none;z-index:1000000002">'+
        Core.Html.GetShadow()+
        '<div class="dialog-header" rel="title_box">'+
        '<h3 rel="base_title"></h3>'+
        '</div>'+
        '<div class="dialog-handle">'+
        '<a href="javascript:;" class="close" btn="close">关闭</a>'+
        '</div>'+
        '<div rel="base_content"></div>'+
        '</div>';
    var _box,_cover,_timer, _self = this;
    var _settings = !settings? {}: settings;
    this.Main = Core.ACTIVE.GetMain();

    var create = function(win){
        if(!_self.warp){
            _self.warp = $(settings.warpHtml||_temp);
            if(_settings.width){	//判断是否设置宽度
                _self.warp.width(_settings.width);
            }
            $(document.body).append(_self.warp);
            _self.warp.find("[btn]").mousedown(function(e){
                Core.Html.StopPropagation(e);
                return true;
            })
            _self.warp.find("[btn]").click(function(e){
                switch($(this).attr("btn")){
                    case "close":
                        _self.Close();
                        break;
                }
                return false;
            });
            if(_settings.title){
                _self.warp.find("[rel='base_title']").html(_settings.title);
            }
            if(_settings.content){
                _self.warp.find("[rel='base_content']").append(_settings.content);
            }
            
            
            if(!Core.CONFIG.DialogNotMove){
                var mset = {
                ClickBox: _self.warp.find("[rel='title_box']"),
                Box: _self.warp,
                Outer: _self.Main
                };
                Util.Mouse.MoveBox(mset);
            }
            
            
            if(_self.Initial){
                _self.Initial();
            }
            if($.browser.msie && $.browser.version == 6){

            }
            else{
                _self.warp.css({
                    'position': 'fixed'
                });
            }
        }
        if(!_cover){
            _cover = $('<div style="z-index: 1000000001; display: none;background: none repeat scroll 0 0 #000;_padding-top:40px;height: 100%;left: 0;position: absolute;top: 0;width: 100%;filter:alpha(opacity=40);-moz-opacity:0.4;opacity:0.4;"><div style="height:100%;width:100%;"></div></div>');
            $(document.body).append(_cover);
            
            if ($.browser.msie && $.browser.version == 6) {
                var doc = document.documentElement;
                _cover.css({
                    width: ((doc.scrollWidth>doc.clientWidth)?doc.scrollWidth:doc.clientWidth) + 'px',
                    height: ((doc.scrollHeight>doc.clientHeight)?doc.scrollHeight:doc.clientHeight) + 'px'
                });
            }
            else{
                _cover.css({
                    position: 'fixed'
                });
            }
            
            _cover.bind("mousedown",function(){
                if(_timer){
                    window.clearInterval(_timer);
                }
                _timer = window.setInterval(function(){
                    if(_timer_index % 2){
                        _self.warp && _self.warp.addClass(Core.CONFIG.ActiveClass);
                    }
                    else{
                        _self.warp && _self.warp.removeClass(Core.CONFIG.ActiveClass);
                    }
                    _timer_index++;
                    if(_timer_index > (Core.CONFIG.TwinkCount * 2 + 1)){
                        _timer_index = 1;
                        if(_timer){
                            window.clearInterval(_timer);
                        }
                    }
                },Core.CONFIG.TwinkTime);
            });

            $(document).on("keydown", function(e){
                if(e.keyCode == 27){
                    if(_cover){
                        _self.Close();
                        return false;
                    }
                }
            })
        }
        
        Util.Layer.Center(_self.warp,{
            Main: false,
            NoAddScrollTop: true
        });
        
        if($.browser.msie && $.browser.version == 6){
            _self.warp.css({
                top: $(window).scrollTop() + ($(window).height() - _self.warp.height())/3
            });
        }
        
    }

    var _timer_index = 1;

    this.Open = function(calback,win){
        create(win);
        if(calback){
            calback();
        }
        _cover.show();
        _self.warp.addClass(Core.CONFIG.ActiveClass).show();
        _self.warp.find('[btn="close"]').focus().blur();
        if(!Core.DialogBase.History){
            Core.DialogBase.History = 0;
        }
        Core.DialogBase.History++;
        Core.DialogBaseHandler['ShowHandler'] && Core.DialogBaseHandler['ShowHandler']();
    }

    this.Close = function(){
        _cover && _cover.hide().remove();
        _self.warp && _self.warp.hide().remove();
        _cover = false;
        _self.warp = false;
        if(Core.DialogBase.History){
            Core.DialogBase.History--;
        }
        if(Core.DialogBase.History < 0){
            Core.DialogBase.History = 0;
        }
        Core.DialogBaseHandler['CloseHandler'] && Core.DialogBaseHandler['CloseHandler']();
    }
}/**
 * 数据接口
 */
Core.DataAccess = {};Core.DataAccess.DataAPI = null;    //数据接口
Core.DataAccess.UDataAPI = null;   //网盘数据新接口
Core.DataAccess.ScurityKey = "";    //安全密钥
Core.DataAccess.DataAppAPI = null;  //应用数据接口
Core.DataAccess.DataUserAPI = null; //用户中心数据接口
Core.DataAccess.DataMsgAPI = null;  //消息中心数据接口
Core.DataAccess.DataStaicAPI = null;    //静态目录数据接口
Core.DataAccess.DataAPSAPI = null;
Core.DataAccess.DataPASAPI = null;
Core.DataAccess.DataQAPI = null;

Core.DataAccess.Bridge = (function(){
    var _doms = {},
        _callbacks = {},
        _bridge = {
            "file": Core.CONFIG.DABridgeURL,
            'file_new': Core.CONFIG.DABridgeURL_NEW,
            "app": Core.CONFIG.DAAppBridgeURL,
            "user": Core.CONFIG.DAUserBridgeURL,
            "im": Core.CONFIG.DAIMBridgeURL,
            "msg": Core.CONFIG.DAMsgBridgeURL,
            "q": Core.CONFIG.DAQBridgeURL,
            "u": Core.CONFIG.DAUBridgeURL,
            'static': Core.CONFIG.DASTBridgeURL,
            "pass": Core.CONFIG.DAPASBridgeURL,
            'aps':Core.CONFIG.APSBridgeURL
        },
        _par;
    
    return {
        ChangeBridge: function(type, url){
            _bridge[type] = url;
        },
        RemoveBridge: function(key){
            if(_doms[key]){
                $(_doms[key]).find("iframe").attr("src", "");
                $(_doms[key]).empty().remove();
                _doms[key] = null;
                delete _doms[key];
            }
        },
        Load: function(complete, key, namespace, api){
            if(!_par){
                _par = $('<div style="height:1px;overflow:hidden;position:absolute;width:1px;"></div>');
                $(document.body).append(_par);
            }
            var dom = _doms[key];
            (_callbacks[key]||(_callbacks[key] =[])).push(complete||function(){});
            if(!dom){

                dom = document.createElement("iframe");
                var onload = function(){
                    var cbs = _callbacks[key],c;
                    dom.loaded = true;
                    while(c = cbs.shift()){
                        try{
                            c(dom);
                        }catch(e){window.console&&window.console.log(e);}
                    }
                }

                $(dom).on("readystatechange",function(){
                    if(this.readyState == "complete"){
                        if(dom.doload) return;
                        dom.doload = true;
                        window.setTimeout(function(){
                            onload();
                        },10);
                    }
                });
                $(dom).on('load', function(){
                    if(dom.doload) return;
                    dom.doload = true;
                    window.setTimeout(function(){
                        onload();
                    }, 10);
                });

                dom.src = _bridge[key] + "?namespace=" + namespace + "&api=" + api + "&_t=v5";
                _par.append(dom);
                _doms[key] = dom;
            }
            else if(dom.loaded){
                _callbacks[key] =[];
                if(complete){
                    try{
                        complete( dom );
                    }catch(e){window.console&&window.console.log(e);}
                }
            }
        }
    }
})();

Core.DataAccess.Ajax = Core.DataAccess.UAjax = (function(){
    return {
        Send: function(setting){
            Core.DataAccess.Bridge.Load(function(){
                window.setTimeout(function(){
                    
                    if(setting.dataType == 'json'){
                        setting.dataType = false;
                        delete setting.dataType;
                        
                        var callback = setting.success;
                        setting.success = function(r){
                            r = eval('('+r+')');
                            callback && callback(r);
                        }
                    }
                    if(window.oofUtil&&oofUtil.autoToken){
                        setting.data = oofUtil.autoToken.setRequestToken(setting.data);
                    }
                    Core.DataAccess.UDataAPI.ajax(setting);
                }, 10);
            }, "file_new", "Core.DataAccess", "UDataAPI");
        }
    }
})();

Core.DataAccess.APSAjax = (function(){
    return {
        Send: function(setting){
            Core.DataAccess.Bridge.Load(function(){
                window.setTimeout(function(){
                    
                    if(setting.dataType == 'json'){
                        setting.dataType = false;
                        delete setting.dataType;
                        
                        var callback = setting.success;
                        setting.success = function(r){
                            r = eval('('+r+')');
                            callback && callback(r);
                        }
                    }
                    if(window.oofUtil&&oofUtil.autoToken){
                        setting.data = oofUtil.autoToken.setRequestToken(setting.data);
                    }
                    Core.DataAccess.DataAPSAPI.ajax(setting);
                }, 10);
            }, "aps", "Core.DataAccess", "DataAPSAPI");
        }
    }
})();

window['APS$'] = {
    ajax: Core.DataAccess.APSAjax.Send
}

window['UA$'] = {
    ajax: Core.DataAccess.UAjax.Send
}

Core.DataAccess.DiskAjax = (function(){
    
    return {
        Send: function(setting){
            Core.DataAccess.Bridge.Load(function(ifr){
                if(window.oofUtil&&oofUtil.autoToken){
                    setting.data = oofUtil.autoToken.setRequestToken(setting.data);
                }
                ifr.contentWindow.$.ajax(setting);
            }, "u", "Core.DataAccess", "DataDiskAPI");
        }
    }
})();

window['U$'] = {
    ajax: Core.DataAccess.DiskAjax.Send
}

Core.DataAccess.StaticAjax = (function(){
    return {
        Send: function(setting){
            Core.DataAccess.Bridge.Load(function(ifr){
                if(window.oofUtil&&oofUtil.autoToken){
                    setting.data = oofUtil.autoToken.setRequestToken(setting.data);
                }
                ifr.contentWindow.$.ajax(setting);
            }, "static", "Core.DataAccess", "DataStaticAPI");
        }
    }
})();
window['ST$'] = {
    ajax: Core.DataAccess.StaticAjax.Send
}

Core.DataAccess.QAjax = (function(){
    
    return {
        Send: function(setting){
            Core.DataAccess.Bridge.Load(function(ifr){
                if(window.oofUtil&&oofUtil.autoToken){
                    setting.data = oofUtil.autoToken.setRequestToken(setting.data);
                }
                ifr.contentWindow.$.ajax(setting);
            }, "q", "Core.DataAccess", "DataQAPI");
        }
    }
})();

window['Q$'] = {
    ajax: Core.DataAccess.QAjax.Send
}

Core.DataAccess.PassportAjax = (function(){
    return {
        Send: function(setting){
            Core.DataAccess.Bridge.Load(function(ifr){
                if(window.oofUtil&&oofUtil.autoToken){
                    setting.data = oofUtil.autoToken.setRequestToken(setting.data);
                }
                ifr.contentWindow.$.ajax(setting);
            }, "pass", "Core.DataAccess", "DataPASAPI");
        }
    }
})();
window['PAS$'] = {
    ajax: Core.DataAccess.PassportAjax.Send
}


Core.DataAccess.MsgAjax = (function(){
    return {
        Send: function(setting){
            Core.DataAccess.Bridge.Load(function(){
                if(window.oofUtil&&oofUtil.autoToken){
                    setting.data = oofUtil.autoToken.setRequestToken(setting.data);
                }
                Core.DataAccess.DataMsgAPI.ajax(setting);
            }, "msg", "Core.DataAccess", "DataMsgAPI");
        }
    }
})();

Core.DataAccess.AppAjax = (function(){
    return {
        Send: function(setting){
            Core.DataAccess.Bridge.Load(function(){
                if(window.oofUtil&&oofUtil.autoToken){
                    setting.data = oofUtil.autoToken.setRequestToken(setting.data);
                }
                Core.DataAccess.DataAppAPI && Core.DataAccess.DataAppAPI.ajax(setting);
            }, "app", "Core.DataAccess", "DataAppAPI");
        }
    }
})();

Core.DataAccess.UserAjax = (function(){

    return {
        Send: function(setting){

            Core.DataAccess.Bridge.Load(function(){
                if(window.oofUtil&&oofUtil.autoToken){
                    setting.data = oofUtil.autoToken.setRequestToken(setting.data);
                }
                Core.DataAccess.DataUserAPI.ajax(setting);
            }, "user", "Core.DataAccess", "DataUserAPI");
        }
    };
})();

Core.DataAccess.Error = (function(){
    return {
        Throw: function(e){
            (Core.MinMessage) && Core.MinMessage.Show({text: e.message, type: "war", timeout: Core.CONFIG.MsgTimeout});
        }
    }
})();//获取文件数据
Core.DataAccess.FileRead = (function(){
    
    var _errObj = {message: "网络异常，请刷新页面重试"}, _isLoadingList = false;
    
    var getList = function(url, data, callback, type){
        if(!data.offset) data.offset = 0;   //文件Offset
        if(!data.limit) data.limit = 30;    //默认每页数量

        //TODO: Source Key 密钥
        if(!data.source) data.source = "";
        if(!data.format) data.format = "json";  //默认返回的数据格式

        (Core.MinMessage) && Core.MinMessage.Show({text: "正在读取文件...", type: "load", timeout: 10000});
        Core.DataAccess.Ajax.Send({
            url: url,
            type: type?type:"GET",
            data: data,
            success: function(r){
                (Core.MinMessage) && Core.MinMessage.Hide();
                try{
                    r = eval("("+r+")");
                    if(r.state === false && r.errNo != 20130827){
                        Core.DataAccess.Error.Throw({message: r.error});
                        return;
                    }
                    callback && callback(r);
                }catch(e){
                    callback && callback(r);
                    return;
                    Core.DataAccess.Error.Throw(_errObj);
                    Core.Debug.write("msg:" + r + " error:" + e.message);
                }
            }
        })
    }
    
    
    return {
        //获取底部列表分类
        GetClassList: function(data, callback){
            getList("/lists", data, callback);
        },
        IsLoadingList: function(){
            return _isLoadingList;
        },
        GetQFileList: function(data, callback){
            _isLoadingList = true;
            getList("/qfiles", data, function(r){
                _isLoadingList = false;
                if(!r.path){
                    r.path = [{name:"圈子共享", aid:999, qid:0, cid:0}];
                }
                callback && callback(r);
            }, "POST");
        },
        SearchQFile: function(data, callback){
            _isLoadingList = true;
            getList("/files/qsearch", data, function(r){
                _isLoadingList = false;
                callback && callback(r);
            }, "POST");
            
        },
        //获取文件列表
        GetFileList: function(data, callback){
            _isLoadingList = true;
            getList("/files", data, function(r){
                if(r.state){
                    _isLoadingList = false;
                    if(!r.path){
                        r.path = [{name:'文件', aid:1, cid:0, pid:0}];
                        r.aid = 1;
                        r.cid = 0;
                        data.aid = 1;
                        data.cid = 0;
                    }
                    callback && callback(r);
                }
                else{
                    (Core.MinMessage) && Core.MinMessage.Show({text: "正在读取文件...", type: "load", timeout: 10000});
                    if(r.order != undefined) data.o = r.order;
                    if(r.is_asc != undefined) data.asc = r.is_asc;
                    APS$.ajax({
                        url: '/natsort/files.php',
                        data: data,
                        type: 'GET',
                        dataType: 'json',
                        success: function(res){
                            (Core.MinMessage) && Core.MinMessage.Hide();
                            r = res;
                            _isLoadingList = false;
                            if(r.state){
                                if(!r.path){
                                    r.path = [{name:'文件', aid:1, cid:0, pid:0}];
                                    r.aid = 1;
                                    r.cid = 0;
                                    data.aid = 1;
                                    data.cid = 0;
                                }
                                r.aps = 1;
                                callback && callback(r);
                            }
                            else{
                                Core.DataAccess.Error.Throw({message: r.error});
                            }
                        }
                    })
                }
            });
        }, 
        GetQRBList: function(data, callback){
            _isLoadingList = true;
            getList("/files/qrb", data, function(r){
                _isLoadingList = false;
                callback && callback(r);
            });
        },
        GetQFileDetail: function(file_id, qid, callback){
            Core.DataAccess.Ajax.Send({
                url: "/files/qdesc",
                type: "GET",
                data: {file_id: file_id, qid:qid, format: "json"},
                success: function(r){
                    try{
                        
                        r = eval("("+r+")");
                        if(r.state === false){
                            Core.DataAccess.Error.Throw({message: r.error});
                            return;
                        }
                        callback && callback(r);
                    }catch(e){
                        Core.DataAccess.Error.Throw(_errObj);
                        Core.Debug.write("msg:" + r + " error:" + e.message);
                    }
                }
            })
            
        },
        
        //获取文件详细信息
        GetFileDetail: function(file_id, callback){
            Core.DataAccess.Ajax.Send({
                url: "/files/desc",
                type: "GET",
                data: {file_id: file_id, format: "json"},
                success: function(r){
                    try{
                        
                        r = eval("("+r+")");
                        if(r.state === false){
                            Core.DataAccess.Error.Throw({message: r.error});
                            return;
                        }
                        callback && callback(r);
                    }catch(e){
                        Core.DataAccess.Error.Throw(_errObj);
                        Core.Debug.write("msg:" + r + " error:" + e.message);
                    }
                }
            })
        },
        GetFilePass: function(file_id, callback){
            Core.DataAccess.Ajax.Send({
                url: "/files/desc",
                type: "GET",
                data: {file_id: file_id, field: "pass", format: "json"},
                success: function(r){
                    try{
                        r = eval("("+r+")");
                        if(r.state === false){
                            Core.DataAccess.Error.Throw({message: r.error});
                            return;
                        }
                        callback && callback(r);
                    }catch(e){
                        Core.DataAccess.Error.Throw(_errObj);
                        Core.Debug.write("msg:" + r + " error:" + e.message);
                    }
                }
            })
        },
        Search: function(data, callback){
            getList("/files/search", data, callback);
        },
        CheckSame: function(data, callback){
            var s = APS$;
            var url = '/repeat/show.php';
            
            s.ajax({
                url: url,
                type: "GET",
                data: data,
                success: function(r){
                    try{
                        r = eval("("+r+")");
                        callback && callback(r);
                    }catch(e){
                        Core.DataAccess.Error.Throw(_errObj);
                        Core.Debug.write("msg:" + r + " error:" + e.message);
                    }
                }
            });
        },
        Same: function(data, callback){
            if(!data.offset) data.offset = 0;   //文件Offset
            if(!data.limit) data.limit = 30;    //默认每页数量

            if(!data.source) data.source = "";
            if(!data.format) data.format = "json";  //默认返回的数据格式

            (Core.MinMessage) && Core.MinMessage.Show({text: "正在读取文件...", type: "load", timeout: 10000});
            
            var s = APS$;
            var url = '/repeat/show.php';
            
            s.ajax({
                url: url,
                type: "GET",
                data: data,
                success: function(r){
                    (Core.MinMessage) && Core.MinMessage.Hide();
                    try{
                        r = eval("("+r+")");
                        if(r.state === false){
                            Core.DataAccess.Error.Throw({message: r.error});
                            return;
                        }
                        callback && callback(r);
                    }catch(e){
                        Core.DataAccess.Error.Throw(_errObj);
                        Core.Debug.write("msg:" + r + " error:" + e.message);
                    }
                }
            })
        },
        GetActiveDate: function(y, m, callback){
            //files/curmonth
            Core.DataAccess.Ajax.Send({
                url: "/files/curmonth",
                type: "GET",
                data: {month: y + "-" + m},
                success: function(r){
                    try{
                        r = eval("("+r+")");
                        if(r.state === false){
                            Core.DataAccess.Error.Throw({message: r.error});
                            return;
                        }
                        callback && callback(y, m, r);
                    }catch(e){
                        Core.DataAccess.Error.Throw(_errObj);
                        Core.Debug.write("msg:" + r + " error:" + e.message);
                    }
                }
            });
        },
        GetReport: function(data, callback){
            if(!data.offset) data.offset = 0;   //文件Offset
            if(!data.limit) data.limit = 30;    //默认每页数量
            (Core.MinMessage) && Core.MinMessage.Show({text: "正在读取文件...", type: "load", timeout: 10000});
            
            var s = APS$;
            var url = '/repeat/show.php';
            
            s.ajax({
                url: url,
                type: "GET",
                data: data,
                success: function(r){
                    (Core.MinMessage) && Core.MinMessage.Hide();
                    try{
                        r = eval("("+r+")");
                        if(r.state === false){
                            Core.DataAccess.Error.Throw({message: r.error});
                            return;
                        }
                        callback && callback(r);
                    }catch(e){
                        Core.DataAccess.Error.Throw(_errObj);
                        Core.Debug.write("msg:" + r + " error:" + e.message);
                    }
                }
                
            });
        },
        RB: function(data, callback){
            getList("/rb", data, callback);
        },
        GetInfoBySha1: function(sha1, callback){
            Core.DataAccess.Ajax.Send({
                url: "/files/shasearch",
                type: "GET",
                data: {sha1: sha1},
                success: function(r){
                    try{
                        r = eval("("+r+")");
                        callback && callback(r);
                    }catch(e){
                        Core.DataAccess.Error.Throw(_errObj);
                        Core.Debug.write("msg:" + r + " error:" + e.message);
                    }
                }
            });
        },
        GetQFiles: function(data, callback){
            (Core.MinMessage) && Core.MinMessage.Show({text: "正在读取文件...", type: "load", timeout: 10000});
            Core.DataAccess.Ajax.Send({
                url: "/qfiles",
                type: "POST",
                data: data,
                success: function(r){
                    (Core.MinMessage) && Core.MinMessage.Hide();
                    try{
                        r = eval("("+r+")");
                        if(r.state === false){
                            Core.DataAccess.Error.Throw({message: r.error});
                            return;
                        }
                        callback && callback(r);
                    }catch(e){
                        Core.DataAccess.Error.Throw(_errObj);
                        Core.Debug.write("msg:" + r + " error:" + e.message);
                    }
                }
            })
        },
        GetOtherImg: function(data, callback){
            (Core.MinMessage) && Core.MinMessage.Show({text: "正在读取图片...", type: "load", timeout: 10000});
            
            Core.DataAccess.Ajax.Send({
                url: "/files/imglist",
                type: "GET",
                data: data,
                success: function(r){
                    (Core.MinMessage) && Core.MinMessage.Hide();
                    try{
                        r = eval("("+r+")");
                        if(r.state === false){
                            Core.DataAccess.Error.Throw({message: r.error});
                            return;
                        }
                        callback && callback(r);
                    }catch(e){
                        callback && callback({state: false});
                        //Core.DataAccess.Error.Throw(_errObj);
                        
                        Core.Debug.write("msg:" + r + " error:" + e.message);
                    }
                }
            })
            
        }
    }
})();
//获取目录数据
Core.DataAccess.Dir = (function(){
    var _errObj = {message: "网络异常，请刷新页面重试"};
    
    return {
        GetAll: function(callback){
            Core.DataAccess.Ajax.Send({
                url: "/category",
                type: "GET",
                success: function(r){
                    try{
                        r = eval("("+r+")");
                        callback && callback(r);
                    }catch(e){
                        Core.DataAccess.Error.Throw(_errObj);
                        Core.Debug.write("msg:" + r + " error:" + e.message);
                    }
                }
            })
        },
        GetQDetail: function(aid, cid, qid, callback){
            if(Core.DataAccess.FileRead.IsLoadingList()) return;
            if(cid == undefined){
                cid = 0;
            }
            Core.DataAccess.Ajax.Send({
                url: "/category/qget",
                type: "GET",
                data: {aid: aid, cid: cid, qid: qid},
                success: function(r){
                    try{
                        r = eval("("+r+")");
                        callback && callback(r);
                    }catch(e){
                        Core.DataAccess.Error.Throw(_errObj);
                        Core.Debug.write("msg:" + r + " error:" + e.message);
                    }
                }
            })
        },
        GetDetail: function(aid, cid, callback){
            if(Core.DataAccess.FileRead.IsLoadingList()) return;
            if(cid == undefined){
                cid = 0;
            }
            Core.DataAccess.Ajax.Send({
                url: "/category/get",
                type: "GET",
                data: {aid: aid, cid: cid},
                success: function(r){
                    try{
                        r = eval("("+r+")");
                        callback && callback(r);
                    }catch(e){
                        Core.DataAccess.Error.Throw(_errObj);
                        Core.Debug.write("msg:" + r + " error:" + e.message);
                    }
                }
            })
        },
        Stat: function(callback){
            Core.DataAccess.Ajax.Send({
                url: "/stat",
                type: "GET",
                success: function(r){
                    try{
                        r = eval("("+r+")");
                        callback && callback(r);
                    }catch(e){
                        Core.DataAccess.Error.Throw(_errObj);
                        Core.Debug.write("msg:" + r + " error:" + e.message);
                    }
                }
            })
        }
        
    }
})()
//获取应用数据
Core.DataAccess.App = (function(){
    
    var _MyApps = {}, _clientList = {}, _isLoadAll = false;   //缓存对象
    
    //数据源改变触发方法
    var doChange = function(position){
        var list = _MyApps[Number(position)];
        if(list){
            for(var k in _clientList){
                try{    //过滤已失效API
                    var item = _clientList[k];
                    item && item.Change(list, position);
                }catch(e){
                    
                    _clientList[k] = false;
                }
            }
        }
    }
    
    var delUi = function(appids){
        var changeList = {};
        for(var k in _MyApps){
            var item = _MyApps[k];
            var newArr = [];
            for(var i = 0, len = item.length; i < len; i++){
                var node = item[i];
                if($.inArray(Number(node["app_id"]), appids) == -1){
                    newArr.push(node);
                }
                else{
                    changeList[k] = 1;
                }
            }
            if(changeList[k]){
                _MyApps[k] = newArr;
            }
        }

        for(var k in changeList){
            doChange(k);
        }
    }
    
    return {
        //加载推荐应用
        GetPutApp: function(callback){
            var url = "/?ct=new_app&ac=ajax_get_put_app";
            Core.DataAccess.AppAjax.Send({
                url: url,
                type: "GET",
                success: function(r){
                    r = eval("("+r+")");
                    callback && callback(r);
                }
            });
        },
        //增加监听客户端
        AddClient: function(key, delegate){
            _clientList[key] = delegate;
        },
        //搜索应用
        Search: function(v){
            var reg = new RegExp(v);
            var res = [];
            for(var k in _MyApps){
                var item = _MyApps[k];
                for(var i = 0, len = item.length; i < len; i++){
                    var node = item[i];
                    if(reg.test(node.name)){
                        res.push(node);
                    }
                }
            }
            return res;
        },
        //获取我的应用
        GetMyApps: function(position, callback, is_update){
            /*var url = "/?ct=new_app&ac=ajax_my_apps";
            if(position !== false){
                url += "&dotype=" + (position + 4);
            }
            else{
                if(_isLoadAll && !is_update){
                    for(var k in _MyApps){
                        doChange(Number(k));
                    }
                    return;
                }
                _isLoadAll = true;
            }
            if(!is_update && _MyApps[Number(position)]){
                doChange(position);
                return;
            }
            
			
            Core.DataAccess.AppAjax.Send({
                url: url,
                type: "GET",
                success: function(r){
                    try{
                        r = eval("("+r+")");
                        if(position === false){
                            //同时获取全部处理过程
                            for(var i = 0, len = r.length; i < len; i++){
                                var item = r[i];
                                var desk = Number(item["add_position"]) - 4;
                                if(!_MyApps[desk]){
                                    _MyApps[desk] = [];
                                }
                                _MyApps[desk].push(item);
                            }
                        }
                        else{
                            _MyApps[Number(position)] = r;
                            doChange(position);
                        }
                        //alert(callback);
                        callback && callback(r);
                    }catch(e){
                        Core.DataAccess.Error.Throw(e);
                    }
                }
            })*/
        },
        DeleteUI: function(appids){
            delUi(appids);
        },
        //移除应用
        DeleteApps: function(appids, callback){
            if(typeof appids != "object"){
                appids = [appids];
            }
            if(appids.length){
                var url = "/?ct=new_app&ac=ajax_remove_app&app_id=" + appids.join(",");
                Core.DataAccess.AppAjax.Send({
                    url: url,
                    type: "GET",
                    success: function(r){
                        try{
                            r = eval("("+r+")");
                            if(r.state){
                                //改变数据源
                                
                                delUi(appids);
                                
                                callback && callback(r);
                            }
                            else{
                                Core.MinMessage.Show({
                                    text:"卸载失败", 
                                    type:"err", 
                                    timeout: Core.CONFIG.MsgTimeout
                                    });
                            }
                        }catch(e){
                        //Core.DataAccess.Error.Throw(e);
                        }
                    }
                })
            }
        },
        //移动应用
        MoveApp: function(appid, old_position, new_position, callback){
            var url = "/?ct=new_app&ac=ajax_app2desktop&app_id="+appid+"&dotype="+new_position;
            Core.DataAccess.AppAjax.Send({
                url: url,
                type: "GET",
                success: function(r){
                    try{
                        r = eval("("+r+")");
                        if(r.state){
                            var oldInd = -1;
                            new_position = new_position - 4;
                            var oldData = _MyApps[Number(old_position)], newData = _MyApps[Number(new_position)];
                            if(oldData && oldData.length){
                                for(var i = 0, len  = oldData.length; i < len; i++){
                                    var item = oldData[i];
                                    if(Number(item["app_id"]) == Number(appid)){
                                        oldInd = i;
                                        break;
                                    }
                                }
                            }
                            if(oldInd != -1){
                                _MyApps[Number(new_position)].push(oldData[oldInd]);
                                _MyApps[Number(old_position)].splice(oldInd, 1);
                            }
                            doChange(Number(old_position));
                            doChange(Number(new_position));
                        }
                        callback && callback(r);
                    }catch(e){
                        Core.DataAccess.Error.Throw(e);
                    }
                }
            })
        }
    }
})();
;(function(){
Core.DataAccess.IMAPI = null;
var imif = Core.DataAccess.IMIF = (function(){
    return {
        Run: function(funName){
            var arg = arguments;
            var params = [];
            if(arg.length > 1){
                for(var i = 1,len = arg.length; i < len; i++){
                    params.push("arg["+i+"]");
                }
            }
            Core.DataAccess.Bridge.Load(function(){
                if(Core.DataAccess.IMAPI && Core.DataAccess.IMAPI[funName]){
                    if(imif.SuccessCallback) imif.SuccessCallback();
                    try{
                        eval("var res = Core.DataAccess.IMAPI." + funName + "("+params.join(",")+")");
                    }
                    catch(e){
                        var msg = "网络异常，请稍候重试";
                        if(imif.ErrorCallback){
                            imif.ErrorCallback(msg)
                        }
                        else{
                            Core.DataAccess.Error.Throw({message: msg});
                        }
                    }
                }
                else{
                    var msg = "网络异常，请稍候重试";
                    if(imif.ErrorCallback){
                        imif.ErrorCallback(msg)
                    }
                    else{
                        Core.DataAccess.Error.Throw({message: msg});
                    }
               }
            }, "im", "Core.DataAccess", "IMAPI");
        },
        Kill: function(){
            Core.DataAccess.IMAPI = null
        }
    }
})();
})();Core.API = {};;
(function(){
    var im = Core.API.IM = (function(){
        var _cache = {
            clients: {
            },
            is_connect: false,
            recon_count: 0,
            recon_times: 3
        };

        //重连
        var reconnect = function(msg){
            _cache.is_connect = false;
            Core.CONFIG.DAIMBridgeURL = false;

            if(_cache.recon_count < _cache.recon_times){
                _cache.recon_count++;
                if(_cache.is_signin_again) return;
                window.setTimeout(function(){
                    connect();
                }, 100);
            }
            else{
                if(!msg){
                    msg = "网络异常，暂无法建立通信连接";
                }
                Core.Message.Confirm({
                    text: msg,
                    type: "war",
                    confirm_text:"马上重连",
                    callback: function(r){
                        if(r){
                            _cache.recon_count = 0;
                            connect();
                        }
                    }
                });
            }
        }

        //连接重试
        var tryConnect = function(msg){

            if(_cache.recon_count < _cache.recon_times){
                _cache.recon_count++;
                if(_cache.is_signin_again) return;
                var timeOut = 1000;
                if(_cache.recon_count < 2){
                    timeOut = 3000;
                }
                window.setTimeout(function(){
                    _cache.is_connect = false;
                    Core.CONFIG.DAIMBridgeURL = false;
                    connect();
                }, timeOut);

            }
            else{
                _cache.recon_count = 0;
                Core.MinMessage.Show({
                    text: msg,
                    type: "war",
                    timeout: 2000
                });
            }
        }
        
        //连接成功
        var sucConnect = function(){
            _cache.recon_count = 0;
        }
        
        //信息处理
        var msgDeal = (function(){
            var notiStruct = {
                '2t': 'signin_again',
                '2u': 'signout',
                '5m': 'add_friend',
                '5n': 'del_friend',
                '5o': 'friend_status',
                '8e': 'group_add_friend',
                '8f': 'group_del_friend',
                '8g': 'group_friend_status',
                'dx': 'reconnect',
                'dy': 'notify'
            };
            
            var getT =  function(id){
                var spec_sign = ['Q', 'G', 'T'];
                var new_id = String(id);
                var sign = new_id.substr(0, 1);
                var ind = $.inArray(sign, spec_sign);
                if (ind != -1) {
                    return spec_sign[ind];
                }
                else{
                    return -1;
                }
            }
            
            return {
                //10转36进制
                compress_id: function(id){
                    var spec_sign = ['Q', 'G', 'T'];
                    var new_id = String(id);
                    var sign = new_id.substr(0, 1);
                    if ($.inArray(sign, spec_sign) != -1) {
                        var new_id = Number(new_id.substr(1));
                        return isNaN(new_id) ? id : sign + new_id.toString(36);
                    } else {
                        var new_id = Number(new_id);
                        return isNaN(new_id) ? id : new_id.toString(36);
                    }
                },
                //36转10进制
                decompress_id: function(id){
                    var spec_sign = ['Q', 'G', 'T'];
                    var new_id = String(id);
                    var sign = new_id.substr(0, 1);
                   
                    if ($.inArray(sign, spec_sign) != -1) {
                        var new_id = parseInt(new_id.substr(1), 36);
                        return isNaN(new_id) ? id : sign + new_id;
                    } else {
                        var new_id = parseInt(new_id, 36);
                        return isNaN(new_id) ? id : new_id;
                    }
                },
                //解析通知
                ex_noti: function(item){
                    if(item.mt =="n" && notiStruct[item["t"]]){
                        item.t = notiStruct[item["t"]];
                        
                        if(item.fr && !item.friends){
                            var arr =item.fr.split(",");
                            if(arr.length){
                                item.friends = [];
                                for(var i = 0, len = arr.length; i < len; i++){
                                    var fid = arr[i];
                                    item.friends.push(msgDeal.decompress_id(fid));
                                }
                            }
                        }
                        if(item.id){
                            if(getT(item.id) == "Q"){
                                item.qid = msgDeal.decompress_id(item.id);
                            }
                            else{
                                item.id = msgDeal.decompress_id(item.id);
                            }
                        }
                        
                    }
                }
            }
        })();
        
        //开启接收数据开关
        var recv = function(){
            if(_cache.clients){
                var item = {
                    mt: "n",
                    t: "open"
                };
                for(var k in _cache.clients){
                    try{
                        var clients = _cache.clients[k];
                        clients.Receive(item);
                    }catch(e){}
                }
            }
            Core.DataAccess.IMIF.Run("Recv", _cache.session_id, function(data){
                //suc callback
                
                for(var i = 0, len = data.length; i < len; i++){
                    var item = data[i];
                    /*
                     *{tt: 't',  (action: talk)
                         tid: 收信人id (用户或群)
                         tt:  收信人类型(1: 用户,2: 群）
                         fid: 发信人id
                         fn:  发信人姓名
                         m:   消息
                         ft:   发送时间
                         ol:  是否离线消息 [*可选]
                        }
                     **/
                    switch(item.mt){
                        case "t":
                            
                            if(item.fid && item.fid.toString().charAt(0) == "A"){
                                var fArr = item.fid.split('.');
                                item.fid = msgDeal.decompress_id(fArr[1]);
                                item.qid = msgDeal.decompress_id(fArr[0].substring(1, fArr[0].length));
                            } 
                            else{                            
                                item.fid = msgDeal.decompress_id(item.fid);
                            }
                            item.tid = msgDeal.decompress_id(item.tid);
                            item.ft = parseInt(item.ft, 36);
                            var clients = _cache.clients[item.tt];

                            if(clients){
                                try{
                                    clients.Receive(item);
                                }
                                catch(e){
                                }
                            }
                            break;
                            
                        case "n":
                            msgDeal.ex_noti(item);  //处理通知
                            switch(item.t){
                                case "signin_again":
                                    _cache.is_signin_again = true;
                                    _cache.recon_count = _cache.recon_times;
                                    try{
                                        Core.DataAccess.IMIF.Run("Kill");
                                    }catch(e){}
                                    _cache.is_connect = false;
                                    Core.CONFIG.DAIMBridgeURL = false;
                                    if(_cache.clients){
                                        for(var k in _cache.clients){
                                            try{
                                            var clients = _cache.clients[k];
                                            clients.Receive(item);
                                            }catch(e){}
                                        }
                                    }
                                    return;
                                //通知新接口
                                case "notify":
                                    item.tt = 1;
                                    var clients = _cache.clients[item.tt];
                                    if(clients){
                                        try{
                                            clients.Receive(item);
                                        }
                                        catch(e){
                                        }
                                    }
                                    break;
                                case "del_friend":
                                case "add_friend":
                                    item.tt = 1;
                                    var clients = _cache.clients[item.tt];
                                    if(clients){
                                        try{
                                            /*{
                                                mt: 'n',
                                                t:  '5m',                   // add_friend
                                                id: '3f',                   // 好友id
                                            }
                                            */
                                            clients.Receive(item);
                                        }
                                        catch(e){
                                            alert(e);
                                        }
                                    }
                                    break;
                                /*{
                                        mt: 'n',
                                        t:  'friend_status',
                                        id: '1234567',
                                        st: [0|1|2]                     // 状态，0:离线，1：在线
                                    }
                                    */
                                case "friend_status":
                                    item.tt = 1;
                                    var clients = _cache.clients[item.tt];
                                    if(clients){
                                        try{
                                            
                                            clients.Receive(item);
                                        }
                                        catch(e){
                                        }
                                    }
                                    break;
                                /*
                                     {
                                            mt: 'n',
                                            t: 'group_friend_status',   // group friend status
                                            status: [0|1|2]             // 0:离线，1：在线
                                            gid: '123',                 // 群id
                                            friends: ['2333']           // 改变状态的群友列表
                                        }
                                     **/
                                case "group_friend_status":
                                case "group_add_friend":
                                case "group_del_friend":
                                    item.tt = 2;
                                    var clients = _cache.clients[item.tt];
                                    //item.tid = msgDeal.decompress_id(item.tid);
                                    if(clients){
                                        try{
                                            clients.Receive(item);
                                        }
                                        catch(e){
                                        }
                                    }
                                    break;
                                case "reconnect":
                                    try{
                                        Core.DataAccess.IMIF.Run("Kill");
                                    }catch(e){}
                                    _cache.is_connect = false;
                                    Core.CONFIG.DAIMBridgeURL = false;
                                    connect();
                                    break;
                                default:
                                    
                                    break;
                            }
                            break


                    }
                }
            }, function(status){
                if(status == 408){

                    reconnect();
                }
                else{
                    //error callback
                    tryConnect("网络异常，暂无法建立通信连接");
                }
            });
        }
        
        var _cache_callback = [];
        //建立连接
        var connect = function(callback){
            if((!_cache.is_connect && !Core.CONFIG.DAIMBridgeURL) || _cache.is_signin_again){
                
                callback && _cache_callback.push(callback);
                
                Core.DataAccess.IMIF.ErrorCallback = tryConnect;
                Core.DataAccess.IMIF.SuccessCallback = sucConnect;
                if(_cache.is_signin_again){
                    _cache.is_signin_again = false;
                    _cache.recon_count = 0;
                    try{
                        Core.DataAccess.IMIF.Run("Kill");
                    }catch(e){}
                    _cache.is_connect = false;
                    Core.CONFIG.DAIMBridgeURL = false;
                }
                _cache.is_connect = true;

                Core.DataAccess.MsgAjax.Send({
                    url: "/proapi/im.php?ac=signin",
                    type: "GET",
                    success: function(r){
                        r = eval('('+r+')');
                        if(r.session_id){
                            window.onbeforeunload = function(){
                                Core.DataAccess.MsgAjax.Send({
                                    url: "/proapi/im.php?ac=signout",
                                    type: "GET",
                                    sync: false,
                                    success: function(r){
                                    }
                                });
                            }
                            _cache.session_id = r.session_id;
                            var url = "//" + r.server + "/chat/bridge";
                            Core.CONFIG.DAIMBridgeURL = url;
                            Core.DataAccess.Bridge.ChangeBridge("im", url);
                            Core.DataAccess.Bridge.RemoveBridge("im");
                            recv();
                            window.setTimeout(function(){
                                for(var i = 0, len = _cache_callback.length; i < len; i++){
                                    _cache_callback[i] && _cache_callback[i]();
                                }
                                _cache_callback = [];
                            //callback && callback();
                            }, 10);
                        }
                        else{
                            tryConnect("网络异常，暂无法建立通信连接");
                        }
                    },
                    error: function(){
                        try{
                            Core.DataAccess.IMIF.Run("Kill");
                        }catch(e){}
                        _cache.is_connect = false;
                        Core.CONFIG.DAIMBridgeURL = false;
                        connect();
                    }
                });
            }
            else{
                callback && callback();
            }
        }
        
        //增加客户端
        var addClient = function(type, opt){
            _cache.clients[type] = opt;
            connect(function(){
                });
        }
        
        
        return {
            /*
             * type: 类型; key: 唯一值; opt: 模型
             * 
             * opt: {  Receive: {function(msg)}  }
             * 
             **/
            Client: function(opt){
                addClient(opt.type, opt);
            },
            RemoveClient: function(type){
                if(_cache.clients[type]){
                    _cache.clients[type] = null;
                    delete _cache.clients[type];
                }
            },
            Reconnect: function(callback){
                _cache.is_signin_again = true;
                connect(callback);
            },
            GetSession: function(callback){
                connect(function(){
                    callback && callback(_cache.session_id);
                });
            },
            MsgDeal:msgDeal
        }
    })();

})();

Core.API.Ajax = (function(){
    return {
        MoveQ: function(qid, pick_codes, is_talk , callback){
            var data = {};
            data.qid = qid;
            data.type = is_talk?is_talk:0;
            for(var i = 0, len = pick_codes.length; i < len; i++){
                data["pickcodes["+i+"]"] = pick_codes[i];
            }
            $.ajax({
                url: "?ct=q&ac=move_q",
                data: data,
                type: "POST",
                dataType: "json",
                success: function(r){
                    if(r.state){
                        callback && callback(r.data);
                    }
                    else{
                        Core.MinMessage.Show({
                            text: r.msg,
                            type: r.errtype || "err",
                            timeout: 2000
                        });
                        callback && callback(false, r.msg);
                    }
                }
            })
        },
        QCollect: function(opt){
            var data = {
                qid: opt.qid,
                cid: opt.cid,
                aid: opt.aid,
                tid: opt.tid?opt.tid: '',
                token:opt.token?opt.token:'',
                time:opt.time?opt.time:''
            }

            if(!opt.pick_codes.length){
                Core.MinMessage.Show({
                    text: "请先选择文件",
                    type: "err",
                    timeout:2000
                });
                opt.callback && opt.callback({state: false, msg: "请先选择文件"});
                return;
            }

            for(var i = 0, len = opt.pick_codes.length; i < len; i++){
                data["pickcodes["+i+"]"] = opt.pick_codes[i];
            }

            $.ajax({
                url: "?ct=ajax&ac=collect",
                type: "POST",
                data: data,
                dataType: "json",
                success: function(r){
                    if(!r.state){
                        Core.MinMessage.Show({
                            text: r.msg,
                            type: r.errtype || "err",
                            timeout:2000
                        });
                    }
                    else{
                        Core.FileResultDG.Show(r.data, {aid: data.aid, cid: data.cid});
                    }
                    opt.callback && opt.callback(r);
                }
            });
        }
    }
})();/*
	迷你信息提示
*/
Core.MinMessage = (function(){
    var _dom, _timer;
    var _temp = '<div class="popup-hint" style="z-index:9999999999;">'+
    '<i class="" rel="type"></i>'+
    '<em class="sl"><b></b></em>'+
    '<span rel="con"></span>'+
    '<em class="sr"><b></b></em>'+
    '</div>';
    var _temp = '<div class="ex-popoup-hint " style="z-index:9999999999;"><s></s><span rel="con">操作成功提示！</span></div>';
    var _cache = {
        Type:{
            "suc": "exph-suc",
            "war": "exph-war",
            "err": "exph-err",
            "load": "exph-loader",
            "inf": "exph-war"
        }
    };
	
    //创建消息DOM
    var create = function(text,type){
        if(!_dom){
            _dom = $(String.format(_temp,text));
            $(document.body).append(_dom);
            if($.browser.msie && $.browser.version == 6){
                
            }
            else{
                _dom.css({position: 'fixed'});
            }
            
        }
        _dom.find("[rel='con']").html(text);
        var icon = _dom;
        for(var k in _cache.Type){
            icon.removeClass(_cache.Type[k]);
        }
        icon.addClass(_cache.Type[type]);
    }
    
    //隐藏
    var hide = function(){
        if(_timer){
            window.clearTimeout(_timer);
        }
        if(_dom){
            _dom.hide();
        }
    }

    return {
        Show: function(obj){
            if(!obj.type){
                obj.type = "war";
            }
            create(obj.text,obj.type);
            var NoAddScrollTop = !($.browser.msie && $.browser.version == 6);
            Util.Layer.Center(_dom,{
               NoAddScrollTop: NoAddScrollTop
            });
            var st = ($(window).height() - _dom.outerHeight())/4.5;
            if(st < 50){
                st = 50;
            }
            var srt = 0;
            if(!NoAddScrollTop){
                srt = $(window).scrollTop();
            }
            if(st){
                st += srt;
            }
            _dom.css('top', st);
            _dom.show();
            if(_timer){
                window.clearTimeout(_timer);
            }
            if(obj.timeout){
                _timer = window.setTimeout(hide,obj.timeout);
            }
        },
        Hide: function(){
            hide();
        }
    }
})();///import core.js
///import config.js
///import dialog_base.js

/*
 弹窗消息
 */
Core.Message = (function() {
    var _dialog;

    /*
     弹窗消息类
     */
    var _MessageModel = function() {
        var _self = this, _initState = false, _callback, _openStatus = false, _dialog_type;

        var _content = $('<div>' +
                '<div class="dialog-msg" rel="content"></div>' +
            '<div class="dialog-action">'+
            '<a href="javascript:;" class="dgac-cancel"  style="display:none;" btn="cancel">取消</a>'+
            '<a href="javascript:;" class="dgac-confirm" btn="confirm">确定</a>'+
            '</div>');

        Core.DialogBase.call(this, {
            content: _content,
            title: '信息提示'
        });	//继承dialog

        var setTitle = function(title) {
            title && _self.warp.find("[rel='base_title']").html(title);
        }

        //初始化事件
        this.Initial = function() {
            if (!_initState) {
                $(document).bind("keyup", function(e) {
                    if (_openStatus) {
                        if (e.keyCode == 13 || e.keyCode == 32) {
                            _content.find("[btn='confirm']").click();
                        }
                        else if (e.keyCode == 27) {
                            switch (_dialog_type) {
                                case 0:
                                    _content.find("[btn='confirm']").click();
                                    break;
                                case 1:
                                    _content.find("[btn='cancel']").click();
                                    break;
                            }

                        }
                    }
                })
            }
        }

        var _closeFun = this.Close;

        this.Close = function() {
            _closeFun();
            _openStatus = false;

        }

        this.Show = function(obj) {
            _callback = false;
            _self.Open(function() {
                var cancelBtn = _content.find("[btn='cancel']");
                var confirmBtn = _content.find("[btn='confirm']");
                if (obj.confirm_link) {
                    confirmBtn.unbind("click").bind("click", function() {
                        if (_callback) {
                            _callback(true);
                        }
                        _self.Close();
                        return true;
                    });
                    confirmBtn.attr("href", obj.confirm_link).attr("target", "_blank");

                    cancelBtn.unbind("click").bind("click", function() {
                        var r = true;
                        if (_callback) {
                            r = _callback(false);
                        }
                        if (r === false) {
                            return false;
                        }
                        _self.Close();
                        return false;
                    })
                }
                else {

                    if (confirmBtn.attr("target")) {
                        confirmBtn.removeAttr("target");
                        confirmBtn.attr("href", "javascript:;");
                    }
                    _self.warp.find("[btn]").unbind("click").bind("click", function() {
                        var r = true;
                        if (_callback) {
                            r = _callback($(this).attr("btn") == "confirm");
                        }
                        if (r === false) {
                            return false;
                        }
                        _self.Close();
                        return false;
                    })
                }
                if (obj.confirm_text) {
                    confirmBtn.html(obj.confirm_text);
                }
                else {
                    confirmBtn.html("确定");
                }

                if (obj.cancel_text) {
                    cancelBtn.html(obj.cancel_text);
                }
                else {
                    cancelBtn.html("取消");
                }
                _callback = obj.callback;
                setTitle(obj.title);
                if (obj.dialog_type == undefined) {
                    obj.dialog_type = 0;
                }
                if (!obj.type) {
                    obj.type = "war"
                }
                var html_temp = '<h3 rel="text">' +
                        '<i class="hint-icon hint-{type}"></i><span>{text}</span></h3>' +
                        (obj.content ? '<div class="dialog-msg-text" rel="text_content">{content}</div>' : "");
                var con = _content.find("[rel='content']");
                con.html(String.formatmodel(html_temp, obj));
                confirmBtn.removeClass("btn-orange");
                switch (obj.dialog_type) {
                    case 0:
                        cancelBtn.hide();
                        break;
                    case 1:
                        cancelBtn.show();
                        break;
                }
                _dialog_type = obj.dialog_type;
                _openStatus = true;

                if(!obj.con_style){
                    obj.con_style = {};
                }
                var conStyle = obj.con_style;
                if(conStyle.warp){
                    conStyle.warp(con);
                }
                else{
                    var styleTxt = con.attr('style');
                    if(styleTxt){
                        var arr = styleTxt.split(';');
                        if(arr && arr.length){
                            for(var i = 0, len = arr.length; i < len; i++){
                                var item = arr[i];
                                var iitem = item.split(':');
                                if(iitem.length){
                                    con.css(iitem[0], '');
                                }
                            }
                        }
                    }
                    con.removeAttr('style');
                }
                if(conStyle.title){
                    conStyle.title(con.find('[rel="text"]'));
                }
                if(conStyle.content){
                    conStyle.content(con.find('[rel="text_content"]'));
                }



            }, obj.win);
        }
    }

    var init = function() {
        if (!_dialog) {
            _dialog = new _MessageModel();
        }
    }

    var _alertTimer;

    return {
        Confirm: function(obj) {
            init();
            obj.dialog_type = 1;
            _dialog.Show(obj);
        },
        Alert: function(obj) {
            init();
            obj.dialog_type = 0;
            _dialog.Show(obj);
            if (obj.timeout) {
                _alertTimer = window.setTimeout(function() {
                    Core.Message.Hide();
                }, obj.timeout);
            }
        },
        Hide: function() {
            if (_alertTimer) {
                window.clearTimeout(_alertTimer);
            }
            if (_dialog) {
                _dialog.Close();
            }
        }
    }
})();

;
(function() {
    Core.WriteInput = (function() {
        var activeBox;

        return {
            Open: function(callback, config) {
                if (!config) {
                    config = {};
                }
                
                var editCon = $('<div class="dialog-input">' +
                        (!config.ext?'<input type="text" rel="txt" class="text" />' :
                        '<input type="text" rel="txt" class="text" style="width:362px;" />'+
                        '<span class="file-ext-name" rel="ext_name" style="top:30px;border: 1px solid;border-color: #CECECF;box-shadow: inset 0px 0px 0px rgba(0,0,0,0.1);">'+config.ext+'</span>' )+
                        '</div>' +
                        '<div class="dialog-bottom">' +
                        '<div class="con">' +
                        '<a href="javascript:;" class="button" btn="confirm">确定</a>' +
                        '<a href="javascript:;" class="btn-link" btn="cancel">取消</a>' +
                        '</div></div>');
                
                var editBox = new Core.DialogBase({
                    title: config.title || '请输入内容',
                    content: editCon
                });
                activeBox = editBox;

                editBox.Open();
                var docallback = function() {
                    if (callback) {
                        var isClose = callback(editCon.find("[rel='txt']").val());
                        if (isClose) {
                            editBox.Close();
                            activeBox = false;
                            return;
                        }
                        else {
                            editCon.find("[rel='txt']").focus();
                        }
                    }
                }
                editCon.find("[rel='txt']").val(config.text || '');

                editCon.find("[rel='txt']").on("keydown", function(e) {
                    if (e.keyCode == 13) {
                        docallback();
                    }
                    else if (e.keyCode == 27) {
                        editBox.Close();
                        activeBox = false;
                    }
                })

                editCon.find("[btn]").on("click", function(e) {
                    switch ($(this).attr("btn")) {
                        case "confirm":
                            docallback();
                            break;
                        case "cancel":
                            editBox.Close();
                            activeBox = false;
                            break;
                    }
                    return false;
                })

                editCon.find("[rel='txt']")[0].focus();
                window.setTimeout(function() {
                    editCon.find("[rel='txt']")[0].select();
                    if(config.ext){
                        window.setTimeout(function(){
                        editCon.find("[rel='txt']").width(420 - editCon.find("[rel='ext_name']").width() - 20);
                        }, 10);
                    }
                }, 20);
            },
            Close: function() {
                activeBox.Close();
                activeBox = false;
            }
        }
    })();
})();Core.Dir = (function(){
    
    var checkHasUtil = function(){
        if(!window['Util']){
            window['Util'] = {};
        
        }
        if(!Util.Validate){
            Util.Validate = {};
        }
    
        if(!Util.Validate.CategoryName){
            Util.Validate = {
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
                        return "文件夹名称不能包含下列任意字符之一\n\ \\ / : * ? \"  < > |";
                    }
                    return true;
                }
            };
        }
    }
    
    var createNode = function(aid, pid, floderName, callback){
        checkHasUtil();
        
        
        
        var r = Util.Validate.CategoryName($.trim(floderName));
        if(r !== true){
            if(callback){
                callback({
                    state: false, 
                    message: r
                });
            }
            return;
        }
        var data = {
            pid: pid,
            cname: floderName
        }
        UA$.ajax({
            url: "/files/add",
            type: "POST",
            dataType: "json",
            data: data,
            success: function(result){
                if(callback){
                    callback(result);
                }
            }
        })
    }
    
    
    return {
        Rename: function(aid, cid, oldName){
            var editCon = $('<div class="dialog-input">'+
                '<input type="text" rel="txt" class="text" />'+
                '</div>'+
                '<div class="dialog-action">'+
                '<a href="javascript:;" class="dgac-cancel" btn="cancel">取消</a>'+
                '<a href="javascript:;" class="dgac-confirm" btn="confirm">确定</a>'+
                '</div>');
            var editBox = new Core.DialogBase({
                title: '重命名文件夹',
                content: editCon,
                width: 550
            });

            editBox.Open();
            
            editCon.find("[rel='txt']").val(oldName);

            var renameFolderFun = function(e){
                var cid = e.data.cid;
                
                var data = {
                    fid: cid,
                    file_name: editCon.find("[rel='txt']").val()
                }
                
                checkHasUtil();
                
                var r = Util.Validate.CategoryName($.trim(data.file_name));
                
                if(r !== true){
                    Core.MinMessage.Show({
                        text: r, 
                        type: "err", 
                        timeout: Core.CONFIG.MsgTimeout,
                        window: editBox
                    } );
                    editCon.find("[rel='txt']")[0].focus();
                    return;
                }
                
                UA$.ajax({
                    url: "/files/edit",
                    type: "POST",
                    dataType: "json",
                    data: data,
                    success: function(r){
                        if(r.state){
                            //改变数据列表数据
                            editBox.Close();
                            if(Core.FileConfig.DataAPI) Core.FileConfig.DataAPI.UpdateDir({
                                cid: data.fid, 
                                dir_name: data.file_name
                            });

                            Core.MinMessage.Show({
                                text: "成功重命名文件夹", 
                                type: "suc", 
                                timeout: Core.CONFIG.MsgTimeout
                            } );
                        }
                        else{
                            Core.MinMessage.Show({
                                text: r.error, 
                                type: "err", 
                                timeout: Core.CONFIG.MsgTimeout, 
                                window: editBox
                            } );
                            editCon.find("[rel='txt']")[0].focus();
                        }
                    }
                });
                
            }

            editCon.find("[rel='txt']").bind("keydown", {
                aid: aid, 
                cid: cid
            }, function(e){
                if(e.keyCode == 13){
                    renameFolderFun(e);
                }
                else if(e.keyCode == 27){
                    editBox.Close();
                }
            })

            editCon.find("[btn]").bind("click", {
                aid: aid, 
                cid: cid
            },function(e){
                switch($(this).attr("btn")){
                    case "confirm":
                        renameFolderFun(e);
                        break;
                    case "cancel":
                        editBox.Close();
                        break;
                }
                return false;
            })

            editCon.find("[rel='txt']")[0].focus();
            window.setTimeout(function(){
                editCon.find("[rel='txt']")[0].select();
            },20);
            
            
        },
        Create: function(aid, cid, callback){
            if(!callback){
                callback = function(node){
                    if(Ext.CACHE && Ext.CACHE.FileMain){
                        Core.MinMessage.Show({
                            text: '成功新建文件夹', timeout:2000, type: 'suc'
                        });
                        window.setTimeout(function(){
                            Ext.CACHE.FileMain.GotoDir(node.aid, node.cid);
                        }, 500);
                    }
                }
            }

            var addCon = $('<div class="dialog-input">'+
                '<input type="text" rel="txt" class="text" />'+
                '</div>'+
                '<div class="dialog-action">'+
                '<a href="javascript:;" class="dgac-cancel" btn="cancel">取消</a>'+
                '<a href="javascript:;" class="dgac-confirm" btn="confirm">确定</a>'+
                '</div>');
            var createBox = new Core.DialogBase({
                title: '新建文件夹',
                content: addCon,
                width: 550
            });
            
            createBox.Open(null);
            
            var addFolderFun = function(e){
                var aid = e.data.aid;
                var cid = e.data.cid;
                var value = addCon.find("[rel='txt']").val();
                checkHasUtil();
                if(top.window.Util.Validate.CategoryName(value) != true){
                    Core.MinMessage.Show({
                        text: top.window.Util.Validate.CategoryName(value), 
                        type: "war", 
                        timeout: Core.CONFIG.MsgTimeout
                    });
                    addCon.find("[rel='txt']").focus();
                    return false;
                }
                createNode(aid, cid, addCon.find("[rel='txt']").val(), function(r){
                    if(r.state){
                        Core.MinMessage.Show({
                            text: "新建成功", 
                            type: "suc", 
                            timeout: Core.CONFIG.MsgTimeout, 
                            window: createBox
                        } );
                        
                        callback && callback(r);
                        
                        createBox.Close();
                    }
                    else{
                        Core.MinMessage.Show({
                            text: r.error, 
                            type: "err", 
                            timeout: Core.CONFIG.MsgTimeout, 
                            window: createBox
                        } );
                        addCon.find("[rel='txt']")[0].focus();
                    }
                })
            }

            addCon.find("[rel='txt']").bind("keydown", {
                aid: aid, 
                cid: cid
            }, function(e){
                if(e.keyCode == 13){
                    Util.Html.StopPropagation(e);
                    addFolderFun(e);
                }
                else if(e.keyCode == 27){
                    createBox.Close();
                }
            })

            addCon.find("[btn]").bind("click", {
                aid: aid, 
                cid: cid
            },function(e){
                switch($(this).attr("btn")){
                    case "confirm":
                        //新建文件夹
                        addFolderFun(e);
                        break;
                    case "cancel":
                        createBox.Close();
                        break;
                }
                return false;
            })
            addCon.find("[rel='txt']")[0].focus();
        }
    };
})();///import core.js
///import config.js

/*空间大小管理器*/

/**
 * 空间数据控制
 */
Core.SpaceData = (function(){
    var _data;

    var _OberverData = [];	//空间大小改变后观察对象
    //改变空间数据
    var changeData = function(changeType,aid,iByte,isdel){
        var result = true;
        var key = -1;
        switch(Number(aid)){
            case 0:
                key = 0;
                break;
            default:
                key = 1;
                break;
        }
        if(!_data[key.toString()]){
            _data[key.toString()] = {};
        }
        var obj = _data[key.toString()];
        if(obj){
            switch(isdel){
                case 0:
                    obj[changeType] = Number(obj[changeType]) - Number(iByte);
                    break;
                case 1:
                    if(changeType == "used"){
                        var use = Number(obj[changeType]) + Number(iByte);
                        if(use > obj["total"]){
                            result = false;
                        }
                        else{
                            obj[changeType] = use;
                        }
                    }
                    else{
                        obj[changeType] = Number(obj[changeType]) + Number(iByte);
                    }
                    break;
                case 2:
                    obj[changeType] = Number(iByte);
                    break;
            }

            doClient();
        }
        else{
            result = false;
        }
        return result;
    }
    
    var translation = function(d){
        //{"1":{"upload_size_limit":"0","upload_validity":"0","size_used":7580642419,"size_total":68957503488,"size_remain":61376861069,"size_used_percent":10.993208912093}}
        
        //{"1":{"total":68957503488,"used":7580642419}}
        for(var k in d){
            var item = d[k];
            d[k]["total"] = item["total"]? item["total"]: item["size_total"];
            d[k]["used"] = item["used"] !=undefined? item["used"] : item["size_used"];
            d[k]["size_remain"] = Number(item["size_remain"]);
        }
    }
    
    var doClient = function(){
        if(_OberverData.length){
            var delKeys = [];
            var newList = [];
            for(var i = 0,len = _OberverData.length; i < len; i++){
                try{
                    if(_OberverData[i]){
                        _OberverData[i].Do(_data);
                        newList.push(_OberverData[i]);
                    }
                    else{
                        delKeys.push(i);
                    }
                }catch(e){
                    delKeys.push(i);
                }
            }

            if(delKeys.length){
                //过滤已丢失被观察者
                _OberverData = newList;
            }
        }
    }
    
    //同步空间占用数据
    var syncMethod = function(callback){
        var url = "/index.php?ct=ajax&ac=get_storage_info";	//修改AJAX接口
        $.ajax({
            url:url,
            method:"GET",
            dataType:"json",
            cache:false,
            success:function(result){
                translation(result);
                for(var key in result){
                    _data[key] = result[key];
                }
                doClient();
                if(callback){
                    callback();
                }
            }
        });
    }
	
    return {
        //增加观察对象
        AddClient: function(key,fun){
			
            if(fun){
                var addRes = true;
                for(var i = 0, len = _OberverData.length; i < len; i++){
                    var obj = _OberverData[i];
                    if(obj.Key == key){
                        obj.Do = fun;
                        addRes = false;
                    }
                }
                if(addRes){
                    _OberverData.push({
                        Key:key, 
                        Do:fun
                    });
                }
                doClient();
            }
        },
        //改变已使用空间大小
        ChangeUse: function(aid,iByte,isdel){
			
            if(iByte == ""){
                iByte = 0;
            }
            return changeData("used",aid,iByte,isdel);
        },
        //改变总空间大小
        ChangeTotal: function(aid,iByte,isdel){	
            if(iByte == ""){
                iByte = 0;
            }
            return changeData("total",aid,iByte,isdel);
        },
        //获取空间数据
        GetData: function(){
            return _data;
        },
        //设置数据
        SetData: function(data){
            translation(data);
            _data = data;
        },
        //是否是空间已爆满
        IsNoSpace: function(type){
            if(type == undefined){
                type = "1";
            }
            if(_data[type]){
                return (_data[type]["size_remain"] < 0);
            }
            return false;
        },
        //同步空间数据
        Sync: function(callback){
            syncMethod(callback);
        }
    };
})();


;(function(){
    Core.SpaceTips = (function(){
        var _tipsNode,_dt = 2000, _timeout = _dt, _timer;
        var check = function(){
            if(_timer) window.clearTimeout(_timer);
            _timer = window.setTimeout(function(){
                UA$.ajax({
                    url: '/rb/status',
                    type: 'GET',
                    cache: false,
                    dataType: 'json',
                    success: function(r){
                        if(r.state){
                            if(_timeout == _dt){
                                _timeout = _timeout * 5;
                            }
                            else if(_timeout == _dt * 5){
                                _timeout = _timeout * 3
                            }
                            else{
                                _timeout = _timeout * 30;
                            }
                            check();
                        }
                        else{
                            window.setTimeout(function(){
                                Core.SpaceData.Sync();
                                _tipsNode.hide();
                            }, 3000);
                        }
                    }
                });
            }, _timeout);
        }
        
        return {
            Show: function(type){
                if(!type) type = 1;
                if(!_tipsNode) _tipsNode = $(Core.CONFIG.SpaceTips);
                _tipsNode.show();
                _timeout = 2000;
                check();
                
            }
        }
    })();
})();/*
	浮动按钮
*/
Core.FloatMenu = (function(){
    var _menuData = Core.FloatMenuConfig;
	
    var _cacheDom = {};	//缓存标签对象 
	
    var _old_show_dom;
    
    
    
    var getMenu = function(obj, isFrame){
        var dom = $('<div class="context-menu" style="z-index:9999999; display:none;"></div>');
        var ul = $(document.createElement('ul'));
        for(var k in obj){
            if(obj[k]){
                if(obj[k].isline){
                    dom.append(ul);
                    ul = $(document.createElement('ul'));
                    continue;
                }

                var item = obj[k];
                var overflow = '';
                if(item.text && item.text.length >= 9){
                    overflow = ' style="overflow:hidden"';
                }
                
                var liTemp = '<li val="' + k + '"><a href="javascript:;" '+overflow+'><i class="icon {type}"></i><span>{text}</span></a></li>';
                var type;
                
                if(item['ico']){
                }
                else{
                    liTemp = '<li val="' + k + '"><a href="javascript:;" '+overflow+'>{text}</a></li>';
                }
                
                if(item["ico"] == undefined){
                    type = "icm-" + k;
                }
                else if(item["ico"] == ""){
                    liTemp = '<li val="' + k + '"><a href="javascript:;" '+overflow+'>{text}</a></li>';
                }
                else{
                    type = "icm-" + item["ico"]
                }
                var type = (item["ico"] == undefined)? ("icm-" + k) : (item["ico"] == ""? "" : "icm-" + item["ico"]);
                var li = $(String.formatmodel( liTemp, {
                    type:type, 
                    text:item.text
                } ) );
                if(item.ischild || item.childs){
                    li.find("a").append($('<b class="arrow">&raquo;</b>'));
                }
                if(item.childs){
                    var childDom = getMenu(item.childs);
                    //绑定事件
                    li.bind("mouseover",{
                        dom:li,
                        childDom:childDom
                    },function(e){
                        if(_old_show_dom){
                            _old_show_dom.hide();
                            _old_show_dom = false;
                        }
                        var childDom = e.data.childDom;
                        childDom.css({
                            left: ""
                        });
                        childDom.show();
                        var l = childDom.offset().left;
                        if((l + childDom.width()) > $(window).width()){
                            childDom.css({
                                left: -(childDom.width())
                                });
                        }
                        _old_show_dom = childDom;
                        $(this).attr("hide_state", "0");
                    }).bind("mouseout",{
                        childDom:childDom
                    },function(e){
                        var ele = $(this);
                        ele.attr("hide_state", "1");
                        var childDom = e.data.childDom;
                        window.setTimeout(function(){
                            if(ele.attr("hide_state") == "1"){
                                childDom.hide();
                            }
                        },400);
                    })

                    childDom.bind("mouseover",{
                        dom:li
                    },function(e){
                        e.data.dom.attr("hide_state", "0");
                    }).bind("mouseout",{
                        dom:li
                    },function(e){
                        var ele = e.data.dom;
                        ele.attr("hide_state", "1");
                        var childDom = $(this);
                        window.setTimeout(function(){
                            if(ele.attr("hide_state") == "1"){
                                childDom.hide();
                            }
                        },400);
                    })

                    li.append(childDom);
                }
                ul.append(li);
            }
        }
        
         if(isFrame){
            var cell = $('<div class="cell"></div>');
            dom.append(cell);
            cell.append(ul);
         }
         else{
            dom.append(ul);
        }
        dom.bind("contextmenu", function(e){
            return false;
        });
        return dom;
    }
    
    var showTimer;
    
    return {
        GetMenuHtml: function(obj, isFrame){
            var dom = getMenu(obj, isFrame);
            return '<div class="context-menu" style="z-index:9999999; display:none;">'+dom.html()+'</div>';
        },
        GetMenu: function(obj, isFrame){
            return getMenu(obj, isFrame);
        },
        Show: function(key,pos, setting){
            if(!_cacheDom[key] && _menuData[key]){
                _cacheDom[key] = getMenu(_menuData[key]);
                $(document.body).append(_cacheDom[key]);
            }
			
            if(_cacheDom[key]){
                if(pos){
                    _cacheDom[key].css(pos);
                }
                _cacheDom[key].show();
                if(setting){
                    var box = _cacheDom[key];
                    if(setting.callback){
                        box.find("[val]").bind("click", function(){
                            setting.callback($(this).attr("val"));
                            $(this).parent().find("i.i-done").hide();
                            $(this).find("i.i-done").show();
                            return false;
                        }).find("i.i-done").hide();
                    }
                    if(setting.select){
                        var li = box.find("[val='"+setting.select+"']");
                        if(li.find("i").hasClass("i-done")){
                            li.find("i").show();
                        }
                    }
                }
                return _cacheDom[key];
            }
            return false;
        },
        SetPosition: function(key,pos){
            if(_cacheDom[key]){
                if(pos){
                    _cacheDom[key].css(pos);
                }
            }
        },
        SetRightBtnPos: function(dom, type, x, y, cutX, cutY){
            if(cutX == undefined){
                cutX = 0;
            }
			
            if(cutY == undefined){
                cutY = 0;
            }
			
            var desk = Core.ACTIVE.GetMain();
            if(x + dom.width() > desk.width()){
                x = x - dom.width() + cutX;
            }
            if(y + dom.height() + 5 > $(window).height() + $(window).scrollTop()){
                y = y - dom.height() + cutY;
            }
            var pos = {
                top: y, 
                left: x
            };
            Core.FloatMenu.SetPosition(type, pos);
            if(showTimer){
                window.clearTimeout(showTimer);
            }
            showTimer = window.setTimeout(function(){
                dom.show();
            }, 100);
			
        },
        Hide: function(key){
            if(showTimer){
                window.clearTimeout(showTimer);
            }
            if(!_cacheDom[key]){
                _cacheDom[key].hide();
            }
        }
    }	
})();/*用户权限*/
Core.Permission = Core.FilePermission = (function(){
    var _per;
    
    return {
        ShowUpgrade: function(){
            Core.Message.Alert({
                text: '抱歉，请<a href="http://115.com/?nav=safe&child=user&mode=my_set" target="_blank">绑定手机</a> 或 <a style="color:#f60;" href="http://vip.115.com" target="_blank">升级VIP</a>方可使用。',
                type: 'inf'
            });
        },
        Set: function(data){
            _per = data;
        },
        Shared: function(aid){
            aid = Number(aid);
            if(!_per) return false;
            return true;
        },
        SharedDir: function(aid){
            aid = Number(aid);
            if(!_per) return false;
            var txt = aid + "|";
            return _per.share_dir.indexOf(txt) != -1;
        },
        Vip: function(){
            if(!_per) return false;
            return _per.is_vip;
        },
        VipExp: function(){
            if(!_per) return false;
            return _per.is_vip_exp;
        },
        VipExpLimit: function(){
            if(!_per) return false;
            return _per.is_vip_exp_limit;
        },
        LockFile: function(aid){
            aid = Number(aid);
            if(!_per) return false;
            return _per.lock_file;
        },
        LockDir: function(aid){
            aid = Number(aid);
            if(!_per) return false;
            return _per.lock_dir;
        },
        CanPlayer: function(arr, flag){
            switch(Number(flag)){
                case 9:
                    for(var i = 0, len = arr.length; i < len; i++){
                        var fileDom = arr[i];
                        
                        var suffix = "";
                        if(fileDom.attr('file_type') == "1"){
                            var fileName = fileDom.find("[field='file_name']").attr("title");
                            if(fileName && fileName.lastIndexOf('.') != -1){
                                suffix = fileName.substring(fileName.lastIndexOf('.'), fileName.length).replace(".", "");
                            }
                            if(UPLOAD_CONFIG && UPLOAD_CONFIG['9'] && $.inArray(suffix, UPLOAD_CONFIG['9']["upload_type_limit"]) != -1){

                            }
                            else{
                                return false;
                            }
                        }
                        else{
                            return false;
                        }
                    }
                    return true;
                    break;
                case 4:
                    var newArr = [], pcs = [];
                    for(var i = 0, len = arr.length; i < len; i++){
                        var fileDom = arr[i];
                        if(fileDom.attr('file_type') == "1"){
                            var suffix = "";
                            var fileName = fileDom.find("[field='file_name']").attr("title");
                            if(fileName.lastIndexOf('.') != -1){
                                suffix = fileName.substring(fileName.lastIndexOf('.'), fileName.length).replace(".", "");
                            }
                            var musicType = ['mp3', 'ape', 'flac', 'wav', 'm4a'], suffixType = suffix.toLowerCase();
                            if ($.inArray(suffixType, musicType) != -1) {
                                newArr.push(fileDom);
                                pcs.push(fileDom.attr("pick_code"));
                            }
                        }
                        
                    }
                    if(newArr.length){
                        return {list: newArr.length, pick_codes: pcs};
                    }
                    else{
                        return false;
                    }
                    break;
            }
            return false;
        }
    }
})();;(function(){
    var mod = function(actions){
        var _content = $('<div class="dialog-frame"><iframe frameborder=0 src=""></iframe></div>'), _self = this;
        if(!actions) actions = {};
        var _top = Util.Override(Core.DialogBase, _self, {
            Initial: function(){
                if($.browser.mozilla){
                    _content.find('iframe').on("load", function(){
                        try{
                            var win = $(this.contentWindow);
                            $(win).on("keydown", function(e){
                                if(e.keyCode == 27){
                                    return false;
                                }
                            });
                        }catch(e){}
                    });
                }
            },
            GetIframe: function(){
                return _content.find('iframe')[0];
            },
            Show: function(url){
                _top.Open(function(){
                    _content.find('iframe').off("load").on("load", function(){
                        if(actions && actions['ready']){
                            var ifr = this;
                            window.setTimeout(function(){
                                actions['ready'](ifr.contentWindow);
                            }, 10);
                        }
                    })
                });
                _content.find('iframe').attr("src", url);
            },
            Reset: function(width, height, notcenter){
                if(width){
                    _self.warp.width(width);
                }
                if(height){
                    _content.find('iframe').height(height);
                }
                if(!notcenter){
                    Util.Layer.Center(_self.warp,{
                        Main: false,
                        NoAddScrollTop: true
                    });
                }

            },
            Close: function(doHide){
                actions && actions["close"] && actions["close"](doHide);
                window.setTimeout(function(){
                    _content.find('iframe').attr("src", "");
                    _top.Close();
                },10);

            },
            ResetTitle: function(title){
                _self.warp.find('[rel="base_title"]').html(title);
            }
        }, {
            content: _content,
            title: "新窗口",
            warpHtml:actions.warpHtml
        });
    }
    
    Core.FrameBaseDG = mod;


    //多层IFrame对话框
    Core.SimpleFrameDG = (function(){
        var _cache = {}, _ready = false, _ackey,_hideBack = {},_doHandler = {},_hideBackData = {};
        return {
            Open: function(key, url, setting){
                if(!setting) {
                    setting = {};
                }
                if(setting.callback){
                    _doHandler[key] = setting.callback;
                }
                else{
                    _doHandler[key] = false;
                }

                if(!setting.width) setting.width = 320;
                _ready = false;
                if(setting){
                    _ready = setting.ready;
                }
                if(!_cache[key]){
                    _cache[key] = new mod({
                        ready: function(win){
                            _ready && _ready(win);
                        },
                        close: function(doHide){
                            if(!doHide){
                                if(_hideBack[key]){
                                    _doHandler[key] && _doHandler[key](_hideBackData[key]);
                                }
                            }
                        },
                        warpHtml:setting.warpHtml
                    });
                }
                _hideBackData[key] =  null;
                _hideBackData[key] = setting.hide_data;
                _hideBack[key] = setting.is_hide_back;

                _cache[key].Show(url);
                _ackey = key;
                if(setting){
                    _cache[key].Reset(setting.width, setting.height);
                    _cache[key].ResetTitle(setting.title? setting.title: "新窗口");
                }
                return _cache[key];
            },
            Close: function(key,data){
                if(!key){
                    key = _ackey;
                }
                if(_cache[key]){
                    if(_doHandler[key]) _doHandler[key](data);
                    _cache[key].Close(true);
                }
            },
            Reset: function(key, setting){
                if(_cache[key]){
                    _cache[key].Reset(setting.width, setting.height, setting.notcenter);
                }
            }
        }
    })();

    /*
     * IFrame 对话窗
     */
    Core.FrameDG = (function(){
        var _mod, _doHandler, _hideBack = false, _hideBackData, _ready;

        return {
            IsOpen: function(){
                if(_mod){
                    return _mod.warp.length;
                }
                return false;
            },
            GetIframe: function(){
                if(_mod){
                    return _mod.GetIframe();
                }
                else{
                    return false;
                }
            },
            Reset: function(width, height, notcenter){
                if(_mod){
                    _mod.Reset(width, height, notcenter);
                }
            },
            ResetTitle: function(title){
                if(_mod){
                    _mod.ResetTitle(title);
                }
            },
            Open: function(url, setting){
                if(setting.callback){
                    _doHandler = setting.callback;
                }
                else{
                    _doHandler = false;
                }

                if(setting.ready){
                    _ready = setting.ready;
                }
                else{
                    _ready = false;
                }

                if(!_mod){
                    _mod = new mod({
                        ready: function(win){
                            _ready && _ready(win);
                        },
                        close: function(doHide){
                            if(!doHide){
                                if(_hideBack){
                                    _doHandler && _doHandler(_hideBackData);
                                }
                            }
                        }
                    });
                }
                _hideBackData =  null;
                _hideBackData = setting.hide_data;

                _hideBack = setting.is_hide_back;
                _mod.Show(url);

                if(setting){
                    _mod.Reset(setting.width, setting.height);
                    _mod.ResetTitle(setting.title? setting.title: "新窗口");
                }
                return _mod;
            },
            Close: function(data){
                if(_mod){
                    if(_doHandler) _doHandler(data);
                    _mod.Close(true);
                }
            },
            Hide: function(){
                if(_mod){
                    _mod.Close();
                }
            }
        }
    })();
})();

Core.OnlyFrame = (function(){
    var _cache = {}, _defautWidth = 960;

    var disInstance = function(){
        if(_cache.iframe){
            _cache.iframe.attr("src", "");
            _cache.iframe.empty().remove();
            _cache.iframe = false;
        }

        if(_cache.box){
            _cache.box.empty().remove();
            _cache.box = false;
        }


        _cache.resizeCallback = false;

        if(_cache.closeCallback){
            _cache.closeCallback(_cache.hideBackData);
            _cache.closeCallback = false;
        }

    }

    var init = function(){
        if(!_cache.box){

            _cache.box = $('<div class="popup-window-wrap" is_over="1">'+
                //'<div class="popup-window-close" btn="close"><b>关闭</b></div>'+
                '<div class="popup-window"><iframe src="" frameborder=0></iframe>'+
                '<div class="popup-window-handle"><a href="javascript:;" class="close" btn="close">关闭</a></div>'+
                '</div>'+
                '</div>');

            //_cache.box = $('<div class="popup-window" style="display:none;z-index: 1000000003; "><iframe src="" frameborder=0></iframe></div>');
            $(document.body).append(_cache.box);
            _cache.iframe = _cache.box.find("iframe");
            if($.browser.mozilla){
                _cache.iframe.on("load", function(){
                    try{
                        var win = $(this.contentWindow);
                        $(win).on("keydown", function(e){
                            if(e.keyCode == 27){
                                return false;
                            }
                        });
                    }catch(e){alert(e);}
                });
            }
            _cache.box.on("mouseenter", function(){
                _cache.box.attr("is_over", "1");
            }).on("mouseleave", function(){
                    _cache.box.attr("is_over", "0");
                });
            _cache.box.find("[btn='close']").on("click", function(){
                disInstance();
                return false;
            });

        }
        if(!_cache.bind_reset){
            _cache.bind_reset = true;
            $(window).on("resize", function(){
                if(_cache.resizeCallback){
                    _cache.resizeCallback($(document).width(), $(document).height());
                }
            });
            $(document).on("keydown", function(e){
                if(e.keyCode == 27){
                    if(_cache.box && _cache.box.attr("is_over") == "1"){
                        disInstance();
                        return false;
                    }
                }
            });
        }
    }


    var _openTimer;

    return {
        Resize: function(width, height){
            if(_cache.box){
                var l = 0;
                if(width){
                    l = - width/2;
                }

                _cache.box.find(".popup-window").width(width).css("margin-left", l + "px");
            }
        },
        Open: function(url, setting){
            if(_openTimer) window.clearTimeout(_openTimer);
            init();
            if(!setting){
                setting = {};
            }
            if(!setting.width) setting.width = 960;
            if(!setting.height) setting.height = 500;

            if(setting.resizeCallback){
                _cache.resizeCallback = setting.resizeCallback;
            }
            else{
                _cache.resizeCallback = false;
            }

            _cache.hideBackData =  null;
            _cache.hideBackData = setting.hide_data;

            if(setting.hideCallback){
                _cache.closeCallback = setting.hideCallback;
            }
            else{
                _cache.closeCallback = false;
            }

            _cache.iframe.attr("src", url);
            //_cache.box.height(setting.height).width(setting.width);

            _cache.box.find(".popup-window").width(setting.width).css("margin-left",  (- setting.width/2) + "px");

            _openTimer = window.setTimeout(function(){
                try{
                    _cache.box && _cache.box.show();
                }catch(e){}
            }, 20);
        },
        Close: function(data){
            if(data != undefined){
                _cache.hideBackData = data;
            }
            disInstance();
        }
    }
})();

Core.TabFrame = (function(){
    var _tabList, _mod;

    var mod = function(){
        var _content = $('<div class="dialog-frame"><iframe style="height: 510px;" frameborder=0 src=""></iframe></div>'), _self = this, _titleTab;

        var focusLi = function(type){
            _titleTab.find('.focus').removeClass('focus');
            var el = _titleTab.find('li')[type];
            if(el){
                $(el).addClass('focus');
            }
        }

        var _top = Util.Override(Core.DialogBase, _self, {
            Initial: function(){
                var html = [];
                html.push('<ul class="dialog-tab">');
                for(var i = 0, len = _tabList.length; i < len; i++){
                    var item = _tabList[i];
                    html.push('<li key="' + i + '"><span>'+item.text+'</span></li>');
                }
                html.push('</ul>');

                _titleTab = $(html.join(''));
                _titleTab.find('li').on('click', function(){
                    var el = $(this);
                    var ind = Number(el.attr('key'));
                    _content.find('iframe').attr("src", _tabList[ind].url);
                    focusLi(ind);
                    return false;
                });

                var title = _self.warp.find('[rel="base_title"]');
                title.before(_titleTab);
                title.hide();
            },
            Reset: function(width, height, notcenter){
                if(width){
                    _self.warp.width(width);
                }
                if(height){
                    _content.find('iframe').height(height);
                }
                if(!notcenter){
                    Util.Layer.Center(_self.warp,{
                        Main: false,
                        NoAddScrollTop: true
                    });
                }
            },
            Show: function(type){
                _top.Open(function(){
                    _content.find('iframe').off("load").on("load", function(){
                        var ifr = this;
                        window.setTimeout(function(){
                            $(ifr.contentWindow.document).on('keydown', function(e){
                                if(e.keyCode == 27){
                                    _self.Close();
                                }
                            });
                        }, 100);
                    });
                    focusLi(type);
                });
                _content.find('iframe').attr("src", _tabList[type].url);
            },
            Close: function(){
                window.setTimeout(function(){
                    _content.find('iframe').attr("src", "");
                    _top.Close();
                },10);
            }
        }, {
            content: _content,
            title: "", width: 700
        });
    }

    return {
        Open: function(list, opt, setting){
            _tabList = list;
            if(!_tabList) return;

            if(!_mod) _mod = new mod();
            if(!opt) opt = {};
            if(opt.type == undefined) opt.type = 0;
            _mod.Show(opt.type);
            if(setting){
                _mod.Reset(setting.width, setting.height);
            }

        },
        Close: function(){
            if(_mod){
                _mod.Close();
            }
        }
    }
})();

Core.LineTabFrame = (function(){
    var _tabList, _mod, _title;
    var mod = function(){
        //var _content = $('<iframe style="width:100%; height: 510px; background:#fff;" frameborder=0 src=""></iframe>');
        var _self = this, _titleTab, _iframe;
        var _content = $('<div class="dg-sub-tab"></div>'+
            '<div class="dg-sub-frame">'+
            '<iframe src="setting_common.html" frameborder="0"></iframe>'+
            '</div>');
        var focusLi = function(type){
            _titleTab.find('.focus').removeClass('focus');
            var el = _titleTab.find('li')[type];
            if(el){
                $(el).find('a').addClass('focus');
            }
        }

        var _top = Util.Override(Core.DialogBase, _self, {
            Initial: function(){

                _self.warp.height(500);
                _iframe = _self.warp.find('iframe');
                var html = [];
                html.push('<ul>');
                for(var i = 0, len = _tabList.length; i < len; i++){
                    var item = _tabList[i];
                    html.push('<li key="' + i + '"><a href="javascript:;">'+item.text+'</a></li>');
                }
                html.push('</ul>');

                _titleTab = $(html.join(''));
                _titleTab.find('li').on('click', function(){
                    var el = $(this);
                    var ind = Number(el.attr('key'));
                    _iframe.attr("src", _tabList[ind].url);
                    focusLi(ind);
                    return false;
                });

                var tabBox = _self.warp.find('.dg-sub-tab');
                tabBox.html('').append(_titleTab);
            },
            Show: function(type){
                _top.Open(function(){
                    _iframe.off("load").on("load", function(){
                        var ifr = this;
                        window.setTimeout(function(){
                            $(ifr.contentWindow.document).on('keydown', function(e){
                                if(e.keyCode == 27){
                                    _self.Close();
                                }
                            });
                        }, 100);
                    });
                    focusLi(type);
                });
                _iframe.attr("src", _tabList[type].url);
            },
            Close: function(){
                window.setTimeout(function(){
                    _iframe && _iframe.attr("src", "");
                    _top.Close();
                },10);
            }
        }, {
            content: _content,
            title: _title, width: 700, height: 500
        });
    }
    return {
        Open: function(list, opt){
            _title = opt.title? opt.title: '';
            _tabList = list;
            if(!_tabList) return;

            if(!_mod) _mod = new mod();
            if(!opt) opt = {};
            if(opt.type == undefined) opt.type = 0;
            _mod.Show(opt.type);
            _mod.warp.find('[rel="base_title"]').html(_title);
        },
        Close: function(){
            if(_mod){
                _mod.Close();
            }
        }
    }
})();


/*
 * IFRMAE窗口
 */
Core.Frame = function(url,obj){
    var _self = this;
    if(!obj){
        obj = {};
    }
    if(!obj.title){
        obj.title = "新窗口";
    }
    var _content = $('<div class="window-frame"><iframe src="" frameborder="0" rel="content"></iframe>'+(obj.is_has_flash?'<div class="app-back" rel="flash_op" style="display:none;"></div>':'')+'</div>');

    var _opcBoxTemp = '<div style="z-index: 9000000;background: none repeat scroll 0 0 black;height: 100%;left: 0;position: absolute;top: 0;width: 100%;filter:alpha(opacity=0.15);-moz-opacity:0;opacity:0;"></div>';
    var _opcBox;
    obj.content = _content;
    Core.WindowBase.call(this, obj);

    var parentClose = _self.Close;
    var parentOpen = _self.Open;
    var parentHide = _self.Hide;
    var parentActive = _self.Active;
    var parentDeActive = _self.DeActive;

    var _isClose = true;

    this.FrameSetting = obj;
    this.IsHide = false;

    if(this.FrameSetting.is_has_flash != undefined && typeof this.FrameSetting.is_has_flash == "string"){
        this.FrameSetting.is_has_flash = Number(this.FrameSetting.is_has_flash);
    }

    this.Initial = function(){
        _self.warp.addClass("window-box");
    }

    this.Open = function(newUrl){
        parentOpen();
        if(_isClose){
            _content.find("[rel='content']").attr("src",newUrl?newUrl : url);
            _isClose = false;
        }
        else{
            if(newUrl){
                _content.find("[rel='content']").attr("src",newUrl);
            }
        }
        _self.IsHide = false;
    }
    this.Hide = function(){
        parentHide();
        _self.IsHide = true;
    }

    this.Close = function(){
        parentClose();
        _content.find("[rel='content']").attr("src","");
        if(_opcBox){
            _opcBox.remove();
            _opcBox = false;
        }
        _content.find("iframe").attr("src", "");
        _content.html("");
        _self.warp && _self.warp.remove();
        _self.warp = false;
        _isClose = true;
        _self.IsHide = false;
    }

    this.Active = function(zIndex){
        if(_opcBox){
            _opcBox.hide();
        }
        parentActive(zIndex);
        if(_self.FrameSetting.is_has_flash){
            _content.find("[rel='content']").css({
                height: "",
                width: ""
            });
            _content.find("[rel='flash_op']").hide();
        }
    }

    this.DeActive = function(zIndex){
        if(!_opcBox){
            _opcBox = $(_opcBoxTemp);
            _content.find("[rel='content']").before(_opcBox);
        }
        _opcBox.show();
        parentDeActive(zIndex);
        if(_self.FrameSetting.is_has_flash){
            _content.find("[rel='content']").css({
                height: "1px",
                width: "1px"
            });
            _content.find("[rel='flash_op']").show();
        }
    }
};



Core.AppFrame = function(url, obj){
    var _self = this;
    Core.Frame.call(this,url, obj);
    
    var _oldHide = _self.Hide;
    this.Hide = function(){
        if(obj.HideCallBack){
            obj.HideCallBack();
        }
        _oldHide();
    }
};
;(function(){
    var music = Core.CloudMusic = (function(){
        var _cache = {}, _ind = 0, _client;
        
        return {
            AddClient: function(api){
                if(!_client){_client = {};}
                _client['k_' + new Date().getTime() + '_' + _ind] = api;
                _ind++;
            },
            //获取专辑
            GetCate: function(callback){
                if(!_cache['cates']){
                    $.ajax({
                       url: '/?ct=umusic&ac=topics',
                       type: 'GET',
                       cache: false,
                       dataType: 'json',
                       success: function(r){
                           _cache['cates'] = {};
                           if(r.state && r.data){
                               for(var k in r.data){
                                   var item = r.data[k];
                                   _cache['cates'][item.topic_id] = item;
                               }
                           }
                           callback && callback(_cache['cates']);
                       }
                    });
                }
                else{
                    callback && callback(_cache['cates']);
                }
            },
            //删除专辑
            DelCate: function(tid, callback){
                Core.Message.Confirm({
                    text: '是否要删除该云专辑?',
                    type: 'war',
                    content: '删除后将无法恢复',
                    callback: function(r){
                        if(r){
                            $.ajax({
                                url: '/?ct=umusic&ac=delete_topic&topic_id=' + tid,
                                dataType: 'json',
                                type: 'GET',
                                cache: false,
                                success: function(r){
                                    if(r.state){
                                        if(_cache['cates'][tid]){
                                            _cache['cates'][tid] = null;
                                            delete _cache['cates'][tid];
                                        }
                                        callback && callback(true);
                                    }
                                    else{
                                        Core.MinMessage.Show({
                                            text: r.msg,
                                            type: r.errtype || 'err',
                                            timeout: 2000
                                        });
                                        callback && callback(false);
                                    }
                                }
                            });
                        }
                    }
                });
            },
            //编辑专辑
            EditCate: function(tid, callback){
                if(!_cache['cates'] || !_cache['cates'][tid]){
                    Core.MinMessage.Show({
                        text: "没有对应的云专辑",
                        type: 'war',
                        timeout: 2000
                    });
                    return false;
                }
                
                var info = _cache['cates'][tid];
                
                var editCon = $('<div class="dialog-input">'+
                    '<input type="text" rel="txt" class="text" />'+
                    '</div>'+
                    '<div class="dialog-bottom">'+
                    '<div class="con">'+
                    '<a href="javascript:;" class="button" btn="confirm">确定</a>'+
                    '<a href="javascript:;" class="btn-link" btn="cancel">取消</a>'+
                    '</div></div>');
                var editBox = new Core.DialogBase({
                    title: '重命名云专辑',
                    content: editCon
                });

                editBox.Open(null);

                editCon.find("[rel='txt']").val(info.topic_name);
                
                var renameFun = function(){
                    var cateName = $.trim(editCon.find('[rel="txt"]').val());
                    if(cateName == ''){
                        Core.MinMessage.Show({
                            text: "请输入专辑名称",
                            type: 'war',
                            timeout: 2000
                        });
                        callback && callback(false);
                        return;
                    }

                    $.ajax({
                        url: '/?ct=umusic&ac=edit_topic',
                        type: 'POST',
                        dataType: 'json',
                        data: {topic_id: tid, topic_name: cateName},
                        success: function(r){
                            if(r.state){
                                _cache['cates'][tid].topic_name = cateName;
                                
                                if(_client){
                                    for(var k in _client){
                                        var c = _client[k];
                                        if(c['RenameCate']){
                                            c['RenameCate'](_cache['cates'][tid], _cache['cates']);
                                        }
                                    }
                                }
                                callback && callback(_cache['cates'][tid]);
                                editBox.Close();
                            }
                            else{
                                Core.MinMessage.Show({
                                    text: r.msg,
                                    type: r.errtype || 'err',
                                    timeout: 2000
                                });
                                callback && callback(false);
                            }
                        }
                    });
                }
                
                editCon.find("[rel='txt']").bind("keydown", function(e){
                    if(e.keyCode == 13){
                        renameFun();
                    }
                    else if(e.keyCode == 27){
                        editBox.Close();
                    }
                })

                editCon.find("[btn]").bind("click",function(e){
                    switch($(this).attr("btn")){
                        case "confirm":
                            renameFun();
                            break;
                        case "cancel":
                            editBox.Close();
                            break;
                    }
                    return false;
                })

                editCon.find("[rel='txt']")[0].focus();
                window.setTimeout(function(){
                    editCon.find("[rel='txt']")[0].select();
                },20);
            },
            //增加专辑
            AddCate: function(callback){
                var addCon = $('<div class="dialog-input">'+
                    '<input type="text" rel="txt" class="text" />'+
                    '</div>'+
                    '<div class="dialog-bottom">'+
                    '<div class="con">'+
                    '<a href="javascript:;" class="button" btn="confirm">确定</a>'+
                    '<a href="javascript:;" class="btn-link" btn="cancel">取消</a>'+
                    '</div></div>');
                var addBox = new Core.DialogBase({
                    title: '添加云专辑',
                    content: addCon
                });

                addBox.Open(null);
                
                var addCateFun = function(){
                    var cateName = $.trim(addCon.find('[rel="txt"]').val());
                    if(cateName == ''){
                        Core.MinMessage.Show({
                            text: "请输入专辑名称",
                            type: 'war',
                            timeout: 2000
                        });
                        callback && callback(false);
                        return;
                    }
                    music.GetCate(function(data){
                        $.ajax({
                            url: '/?ct=umusic&ac=add_topic',
                            data: {topic_name: cateName},
                            type: 'POST',
                            dataType: 'json',
                            success: function(r){
                                if(r.state){
                                    _cache['cates'][r.topic_id] = {
                                        topic_id: r.topic_id,
                                        user_id: USER_ID,
                                        topic_name: r.topic_name
                                    };
                                    
                                    if(_client){
                                        for(var k in _client){
                                            var c = _client[k];
                                            if(c['AddCate']){
                                                c['AddCate'](_cache['cates'][r.topic_id], _cache['cates']);
                                            }
                                        }
                                    }
                                    
                                    callback && callback(_cache['cates'][r.topic_id]);
                                    addBox.Close();
                                }
                                else{
                                    if(r.msg_code == 88807 && !Core.FilePermission.Vip()){
                                        Core.Message.Confirm({
                                            text: '您不可以再添加云专辑了',
                                            content: '升级VIP后可添加<b>115张</b>云专辑！',
                                            confirm_text: '马上升级',
                                            confirm_link: Core.CONFIG.Path.VIP + '?p=cloud_music'
                                        });
                                    }
                                    else{
                                        Core.MinMessage.Show({
                                            text: r.msg,
                                            type: r.errtype || 'err',
                                            timeout: 2000
                                        });
                                    }
                                    callback && callback(false);
                                }
                            }
                        });
                    });
                }
                
                addCon.find("[rel='txt']").bind("keydown", function(e){
                    if(e.keyCode == 13){
                        Util.Html.StopPropagation(e);
                        addCateFun(e);
                    }
                    else if(e.keyCode == 27){
                        addBox.Close();
                    }
                })

                addCon.find("[btn]").bind("click",function(e){
                    switch($(this).attr("btn")){
                        case "confirm":
                            //新建文件夹
                            addCateFun(e);
                            break;
                        case "cancel":
                            addBox.Close();
                            break;
                    }
                    return false;
                })
                addCon.find("[rel='txt']")[0].focus();
            },
            //删除专辑音乐文件
            DelFile: function(topic_id, music_id, callback){
                $.ajax({
                    url: '/?ct=umusic&ac=delete_music&music_id=' + music_id,
                    cache: false,
                    type: 'GET',
                    dataType: 'json',
                    success: function(r){
                        if(r.state){
                            var list = _cache["list"][topic_id];
                            if(list){
                                var ind = false;
                                for(var i = 0, len  = list.length; i < len; i++){
                                    var item = list[i];
                                    if(item.id == music_id){
                                        ind = i;
                                    }
                                }
                                if(ind !== false){
                                    _cache["list"][topic_id].splice(ind, 1);
                                }
                            }
                            callback && callback(_cache["list"][topic_id]);
                        }
                        else{
                            Core.MinMessage.Show({
                                text: r.msg,
                                type: r.errtype || 'err',
                                timeout: 2000
                            });
                            callback && callback(false);
                        }
                    }
                })
            },
            //增加音乐文件
            AddFileList: function(tid, fids, callback){
                $.ajax({
                    url: '/?ct=umusic&ac=add_music',
                    data: {
                        topic_id: tid,
                        file_id: fids.join(',')
                    },
                    type:'POST',
                    dataType: 'json',
                    success: function(r){
                        if(r.state){
                            if(!_cache['list']){
                                _cache['list'] = {};
                            }
                            _cache["list"][tid] = r.data;
                            callback && callback(_cache["list"][tid]);
                        }
                        else{
                            if(r.msg_code == 88807 && !Core.FilePermission.Vip()){
                                Core.Message.Confirm({
                                    text: '该云专辑不能再添加文件了',
                                    content: '升级VIP后可添加<b>1150首</b>歌曲！',
                                    confirm_text: '马上升级',
                                    confirm_link: Core.CONFIG.Path.VIP + '?p=cloud_music'
                                });
                            }
                            else{
                                Core.MinMessage.Show({
                                    text: r.msg,
                                    type: r.errtype || 'err',
                                    timeout: 2000
                                });
                            }
                            callback && callback(false);
                        }
                    }
                })
            },
            //获取音乐文件
            GetFileList: function(topic_id, callback){
                if(!_cache['list']){
                    _cache['list'] = {};
                }
                
                if(!_cache["list"][topic_id]){
                    $.ajax({
                        url: '/?ct=umusic&ac=musics&topic_id=' + topic_id,
                        type: 'GET',
                        cache: false,
                        dataType: 'json',
                        success: function(r){
                            if(r.state){
                                _cache["list"][topic_id] = r.data;
                                callback && callback(_cache["list"][topic_id]);
                            }
                            else{
                                callback && callback(false);
                            }
                        }
                    });
                }
                else{
                    callback && callback(_cache["list"][topic_id]);
                }
            }
        }
    })();
})();/**
 * 文件操作基本API
 */

//操作AJAX接口
Core.FileAjax = (function(){
    return {
        Star: function(tid, is_star, callback){
            var data = {};
            data["fid"] = tid;
            data["is_mark"] = is_star;
            UA$.ajax({
                url: "/files/edit",
                data: data,
                dataType: "json",
                type: "POST",
                success: function(r){
                    if(r.state){
                        if(callback) callback(tid, is_star);
                    }
                    else{
                        Core.MinMessage.Show({
                            text: r.error,
                            type: "err",
                            timeout: Core.CONFIG.MsgTimeout
                        })
                    }
                }
            })
        },
        _rbPassWord: function(callback, tids){
            var rbSetting = Core.FileAjax.RBPassWordSet();
            if(rbSetting){
                if(rbSetting.HasPass){
                    var passwordCon = $('<div class="dialog-input" style="padding-bottom: 0px;">'+
                        '<input type="password" id="js_write_rb_pwd_txt" class="text" rel="txt">'+
                        '</div>'+
                        '<div style="padding: 10px 30px;text-align: right;"><a href="'+Core.CONFIG.Path.U + '/?nav=safe&child=user&mode=my_set&type=forgot_superpwd" target="_blank">找回安全密钥</a></div>'+
                        '<div class="dialog-action">'+
                        '<a href="javascript:;" class="dgac-cancel" btn="cancel">取消</a>'+
                        '<a href="javascript:;" class="dgac-confirm" btn="confirm">确定</a>'+
                        '</div>');
                    var passwordBox = new Core.DialogBase({
                        title: '请输入安全密钥',
                        content: passwordCon
                    });

                    passwordBox.Open(function(){
                        passwordBox.warp.find("[rel='goto_set_pwd']").unbind("click").bind("click",function(){
                            window.setTimeout(function(){
                                passwordBox.Close();
                            }, 10);
                        })
                    });

                    passwordCon.find("[btn]").bind("click",function(e){
                        switch($(this).attr("btn")){
                            case "confirm":
                                if(callback){
                                    callback(passwordCon.find("[rel='txt']").val(), function(){
                                        passwordBox.Close();
                                    });
                                }
                                break;
                            case "cancel":
                                passwordBox.Close();
                                break;
                        }
                        return false;
                    })
                    passwordCon.find("[rel='txt']").keydown(function(e){
                        if(e.keyCode == 13){
                            if(callback){
                                callback(passwordCon.find("[rel='txt']").val(), function(){
                                    passwordBox.Close();
                                });
                            }
                        }
                        else if(e.keyCode == 27){
                            passwordBox.Close();
                        }
                    })
                    passwordCon.find("[rel='txt']")[0].focus();
                }
                else{
                    
                    Core.Message.Confirm({
                        text: "确认要永久删除文件吗？",
                        content:'如果点击确定，文件将被彻底删除，无法恢复！', 
                        type: "inf", 
                        callback: function(r){
                            if(r){
                                if(callback){
                                    callback("");
                                }
                            }
                        }
                    });
            
                /*Core.Message.Confirm({
                        text: "您没有设置安全密钥",
                        type: "war",
                        confirm_text: "马上设置",
                        confirm_link: Core.CONFIG.Path.PASS + "/?ct=security&ac=passwd",
                        callback: function(r){
                            if(r){
                                window.setTimeout(function(){
                                    Core.Message.Confirm({
                                        text: "您已经设置了安全密钥了吗？",
                                        type:"inf",
                                        confirm_text: "我已设置了",
                                        cancel_text: "以后再设置",
                                        callback: function(r){
                                            if(r){
                                                Core.FileConfig.DataAPI && Core.FileConfig.DataAPI.Refresh();
                                            }
                                        }
                                    });
                                },100);
                            }
                        }
                    });*/
                }
            }
        },
        RBPassWordSet: false,
        //清空回收站
        ClearRB: function(aid, cid){
            Core.FileAjax._rbPassWord(function(input, hideFun){
                UA$.ajax({
                    url: '/rb/clean',
                    type: "POST",
                    dataType: "json",
                    data: {
                        "password": input
                    },
                    success: function(r){
                        if(r.state){
                            window.setTimeout(function(){
                                if(Core.FileConfig.DataAPI) Core.FileConfig.DataAPI.Reload(7, 0);
                            }, 2000);
                            if(hideFun){
                                hideFun();
                            }
                            Core.MinMessage.Show({
                                text: "成功清空回收站",
                                type:"suc",
                                timeout:Core.CONFIG.MsgTimeout
                            });
                            Core.CountSync.Sync();
                        }
                        else{
                            Core.MinMessage.Show({
                                text:r.error,
                                type:"err",
                                timeout:Core.CONFIG.MsgTimeout
                            });
                        }
                    }
                })
            });
        },
        //删除回收站文件
        DeleteRB: function(tids, win){
            Core.FileAjax._rbPassWord(function(input, hideFun){
                var data = {};
                for(var i = 0, len = tids.length; i < len; i++){
                    data['rid['+i+']'] = tids[i];
                }
                data["password"] = input;

                UA$.ajax({
                    url: '/rb/clean',
                    type: "POST",
                    dataType: "json",
                    data: data,
                    success: function(r){
                        if(r.state){
                            if(Core.FileConfig.DataAPI) Core.FileConfig.DataAPI.Reload(7,0);
                            window.setTimeout(function(){
                                Core.MinMessage.Show({
                                    text: "成功删除回收站文件",
                                    type:"suc",
                                    timeout:Core.CONFIG.MsgTimeout
                                });
                            }, 500);
                            Core.CountSync.Sync();
                            if(hideFun){
                                hideFun();
                            }
                        }
                        else{
                            Core.MinMessage.Show({
                                text:r.error,
                                type:"err",
                                timeout:Core.CONFIG.MsgTimeout
                            });
                        }
                    }
                })
            }, tids);
        },
        RestoreRB: function(tids, win){
            Core.Message.Confirm({
                text: "确认要还原选中的文件吗？",
                type: "inf",
                callback: function(r){
                    if(r){
                        var data = {};
                        for(var i = 0, len = tids.length; i < len; i++){
                            data['rid['+i+']'] = tids[i];
                        }
                        
                        UA$.ajax({
                            url: "/rb/revert",
                            type: "POST",
                            dataType: "json",
                            data: data,
                            success: function(result){
                                if(result.state){
                                    if(Core.FileConfig.DataAPI) Core.FileConfig.DataAPI.Reload(7, 0);
                                    Core.CountSync.Sync();
                                    Core.SpaceData.Sync();
                                    setTimeout(function () {
                                        Core.MinMessage.Show({
                                            text: "还原成功",
                                            type: "suc",
                                            timeout: Core.CONFIG.MsgTimeout
                                        });
                                    },500);
                                }
                                else{
                                    if(result.errno == 300001){
                                        Core.Message.Confirm({
                                            text: '抱歉，还原失败！网盘空间不足！',
                                            content: '请释放适量的空间或扩容您的网盘，以便文件顺利还原。',
                                            type: 'war',
                                            confirm_link: Core.CONFIG.Path['VIP'] + '/?p=rb_revert',
                                            confirm_text: '扩容空间'
                                        });
                                        return;
                                    }
                                    Core.MinMessage.Show({
                                        text: result.error,
                                        type: "err",
                                        timeout: Core.CONFIG.MsgTimeout
                                    });
                                }
                            }
                        })
                    }
                },
                win:win
            })
        },
        EditCover: function(aid, cid, tid, callback){
            UA$.ajax({
                url: "/files/edit",
                type: "POST",
                dataType: "json",
                data: {
                    fid: cid,
                    fid_cover: tid
                },
                success: function(result){
                    if(result.state){
                        //Core.MinMessage.Show({text: "设置成功", type: "suc", timeout: Core.CONFIG.MsgTimeout});
                        if(Core.FileConfig.DataAPI) Core.FileConfig.DataAPI.Reload();
                    }
                    if(callback){
                        callback(result);
                    }
                }
            })
        },
        DeleteCover: function(aid, cid, callback){
            UA$.ajax({
                url: "/files/edit",
                type: "POST",
                dataType: "json",
                data: {
                    fid: cid,
                    fid_cover: 0
                },
                success: function(result){
                    if(result.state){
                        if(Core.FileConfig.DataAPI) Core.FileConfig.DataAPI.Reload();
                    }
                    if(callback){
                        callback(result);
                    }
                }
            })

        }

    }
})();

//文件处理函数
Core.FileAPI = (function(){
    
    var _giftCache = {};
    
    return {
        MoveFile: function(pcid, list, callback, is_copy){
            if(list.length){
                var data = {
                    pid: pcid
                };

                if(is_copy){
                    data.copy = 1;
                }

                var ind = 0;
                for(var i = 0, len = list.length; i < len; i++){
                    var item = list[i];
                    if(item.attr('file_type') == "1"){
                        data['fid['+ind+']'] = list[i].attr('file_id');
                    }
                    else{
                        data['fid['+ind+']'] = list[i].attr('cate_id');
                    }
                    ind++;
                }
                
                Core.MinMessage.Show({
                    text: "正在" + (!is_copy? '转移' : '复制' ) + '文件....',
                    type: "load",
                    timeout: 10000
                });
                
                UA$.ajax({
                    url: "/files/move",
                    type: "POST",
                    data: data,
                    dataType: "json",
                    success: function(r){
                        if(r.state){
                            if(!is_copy){
                                try{
                                    if(Core.FileConfig.DataAPI) Core.FileConfig.DataAPI.Del(Core.FileConfig.aid, Core.FileConfig.cid, list);
                                    window.setTimeout(function(){
                                        Core.MinMessage.Show({
                                            text: "成功转移文件",
                                            type: "suc",
                                            timeout: Core.CONFIG.MsgTimeout
                                        });
                                    }, 500);
                                }catch(e){}
                            }
                            else{
                                try{
                                    if(Core.FileConfig.DataAPI) Core.FileConfig.DataAPI.Reload(Core.FileConfig.aid, Core.FileConfig.cid);
                                    window.setTimeout(function(){
                                        Core.MinMessage.Show({
                                            text: "成功复制文件",
                                            type: "suc",
                                            timeout: Core.CONFIG.MsgTimeout
                                        });
                                    }, 500);
                                }catch(e){}
                            }
                            
                        }
                        else{
                            Core.MinMessage.Show({
                                text: r.error,
                                type: "err",
                                timeout: Core.CONFIG.MsgTimeout
                            });
                        }
                        callback && callback(r.state);
                    }
                })
            }
        },
        DeleteGift: function(list){
            if(!list.length){
                Core.MinMessage.Show({
                    text: '请选择礼包',
                    type: 'war', timeout: 2000
                });
                return true;
            }
            Core.Message.Confirm({
                text: '确认要删除选中的网盘礼包？',
                content: '请放心，删除礼包并不会删除原始文件。',
                type: 'inf',
                callback: function(r){
                    if(r){
                        var giftCodes = [];
                        for(var i = 0,len = list.length; i < len; i++){
                            var item = list[i];
                            giftCodes.push(item.attr('code'));
                        }
                        $.ajax({
                        url: '/?ct=filegift&ac=delete',
                        type: 'POST',
                        data: {gift_code:giftCodes},
                        dataType: 'json',
                        success: function(res){
                            if(res.state){
                                Ext.CACHE.FileMain && Ext.CACHE.FileMain.ReInstance();
                                window.setTimeout(function(){
                                    Core.MinMessage.Show({text:"删除成功", type: 'suc', timeout: 2000});
                                }, 500);
                            }
                            else{
                                Core.MinMessage.Show({text:res.message, type: res.errtype || 'err', timeout: 2000});
                            }
                        }
                        });
                    }
                }
            });
        },
        DeleteFile: function(list, callback){
            var delcon = false;
            delcon = "文件删除后可从回收站还原，回收站不占云空间哦。";
            if(Core.FileConfig.aid == 0){
                delcon = "";
            }
            Core.Message.Confirm({
                type: "war", 
                text: "确认要删除选中的文件到回收站？",
                content: delcon, 
                callback: function(r){
                    if(r){
                        var url = "/rb/delete";
                        var data = Core.FileAPI.GetSelFilesData(list);
                        UA$.ajax({
                            url: url,
                            type: "POST",
                            data: data,
                            dataType: "json",
                            success: function(r){
                                var arr = list;
                                var dellist = [];
                                if(r.state){
                                    dellist = arr;
                                    Core.MinMessage.Show({
                                        text: "删除成功", 
                                        timeout: Core.CONFIG.MsgTimeout, 
                                        type:"suc"
                                    });
                                    
                                    //Core.SpaceData.Sync();
                                    Core.SpaceTips.Show(1);
                                    if(Core.FileConfig.DataAPI) Core.FileConfig.DataAPI.Del(Core.FileConfig.aid, Core.FileConfig.cid, dellist);
                                    callback && callback();
                                }
                                else{
                                    Core.MinMessage.Show({
                                        text: r.error, 
                                        timeout: Core.CONFIG.MsgTimeout, 
                                        type:"err"
                                    });
                                }
                            }
                        })
                    }
                }
            }); 
        },
        ShowQCode: function(url){
            if(!_giftCache.dom){
                _giftCache.dom = $('<div class="qcode-popup" style="position: fixed;_position: absolute;z-index:9000002;"><img src="" alt="" /></div>');
                
                _giftCache.dom.find('img').on('load', function(){
                    if($(this).attr('src')){
                        Util.Layer.Center(_giftCache.dom, {
                            NoAddScrollTop: ($.browser.msie && $.browser.version == 6) || true
                        });

                        _giftCache.dom.fadeIn();
                    }
                });
                _giftCache.cover = $('<div style="z-index: 9000001;background: none repeat scroll 0 0 black;height: 100%;left: 0;position: absolute;top: 0;width: 100%;filter:alpha(opacity=0.15);-moz-opacity:0;opacity:0;" onselectstart="return false;"></div>');
                $(document.body).append(_giftCache.dom);
                _giftCache.dom.hide();
                $(document.body).append(_giftCache.cover);
                $(window).on("keyup", function (e) {
                    if(e.keyCode == 27 && !_giftCache.cover.is(':hidden')) {
                        _giftCache.dom.hide();
                        _giftCache.cover.hide();
                        return false;
                    } 
                });
                _giftCache.cover.add(_giftCache.dom).on('click', function(){
                    _giftCache.dom.hide();
                    _giftCache.cover.hide();
                    return false;
                });
            }
            var img = _giftCache.dom.find('img');
            img.attr('src', '');
            _giftCache.cover.show();
            window.setTimeout(function(){
                img.attr('src', url);
            }, 1);
            Util.Layer.Center(_giftCache.dom, {
                NoAddScrollTop: ($.browser.msie && $.browser.version == 6) || true
            });
        },
        ShowGiftCode: function(code){
            this.ShowQCode('//115.com/?ct=filegift&ac=qrcode&gift_code='+code);
        },
        OpenMusic: function(){
            Core.FileAPI._MusicWin = window.open( '/?ct=music#', 'OOF_MUSIC' ,'height=680,width=920,top=0,left=0,toolbar=no,menubar=no,scrollbars=no,resizable=no,status=no');
            
            if(Core.FileAPI._MusicWin){
                Core.FileAPI._MusicWin.focus();
            }
        },
        CheckFileType: function(fileDom){
            var type = "";
            var suffix = "";
            var fileName = fileDom.find("[field='file_name']").attr("title");
            if (fileName.lastIndexOf('.') != -1) {
                suffix = fileName.substring(fileName.lastIndexOf('.'), fileName.length).replace(".", "");
            }
            for (var k in window["UPLOAD_CONFIG"]) {
                var item = window["UPLOAD_CONFIG"][k];
                if (typeof item["upload_type_limit"] == "object" && $.inArray(suffix.toLowerCase(), item["upload_type_limit"]) != -1) {
                    type = k;
                    break;
                }
            }
            
            if ($.inArray(suffix.toLowerCase(), ['rar', 'tar', 'gz', '7z', 'zip']) != -1) {
                type = 11;
            }
            return type;
        },
        OpenRAR: function(pick_code){
            Core.FileAPI.Download(pick_code);
            return;
            var url = '/?ct=rar&pickcode=' + pick_code;
            this.OpenNewWindow(url);
        },
        OpenVideo: function(pick_code){
            var url = '/?ct=play&ac=location&pickcode=' + pick_code;
            this.OpenNewWindow(url);
        },
        OpenSWF: function(pick_code){
            var url = '/?ct=play&ac=location&ext=swf&pickcode=' + pick_code;
            this.OpenNewWindow(url);
        },
        OpenDoc: function(pick_code, ico){
            var url = '/?ct=preview&ac=location&pickcode=' + pick_code + (ico == 'txt'?'&t=1': '');
            this.OpenNewWindow(url);
        },
        DownloadDir: function(list, ele){
            ele.attr("target", "");
            ele.attr('href', 'javascript:;');
            if(list.length){
                var item = list[0];
                if(item.attr("file_type") == "0" && item.attr("pick_code")){
                    var url = Core.CONFIG.Path['U'] + '?ct=browser&ac=download_folder&pickcode=' + item.attr("pick_code");
                    ele.attr('href', url);
                }
            }
            
        },
        GetSelFilesData: function(arr){
            var data = {
                pid: Core.FileConfig.cid
            };
            for(var i = 0, len = arr.length; i < len; i++){
                var item = arr[i];
                if(item.attr("file_type") == "1"){
                    data['fid['+i+']'] = item.attr("file_id");
                }
                else if(item.attr("file_type") == "0"){
                    data['fid['+i+']'] = item.attr("cate_id");
                }
            }
            return data;
        },
        _DownloadWin: false,
        RenewAll: function(callback){
        },
        ShareTO: function(list){
            Core.ShareDG.Open(list);
        },
        //下载
        Download: function(pick_code,win){
            if(Core.FilePermission.Vip() && window['uploadInterface']){
                var _ = function () {
                    UA$.ajax({
                        url: 'files/download?pickcode=' + pick_code,
                        type: 'GET',
                        dataType: 'json',
                        cache: false,
                        success: function(r){
                            if(!r.state && (r.errcode == 911 || r.code == 911 || r.msg_code == 911) ){
                                if(!window['_SHOW911_']) {
                                    Util.Load.JS('/static/plug/show911/show911.js', function () {
                                        window['_SHOW911_'](function () {
                                            _();
                                        }, r.data.url || null);
                                    })
                                }else {
                                    window['_SHOW911_'](function () {
                                        _();
                                    }, r.data.url || null);
                                }
                                return;
                            }
                            if(r.state){
                                var page_file_info = {  //文件信息
                                    pick_code: r.pickcode,
                                    file_id: r.file_id,
                                    file_name: r.file_name,
                                    file_size: Util.File.ShowSize(r.file_size)
                                };
                                Core.DownFile.Go([$('<div file_type="1" pick_code="'+page_file_info.pick_code+'"><a href="javascript:;" field="file_name" title="'+page_file_info.file_name+'"></a></div>')]);
                            }
                            else{
                                Core.MinMessage.Show({text:r.msg, type: 'war',timeout:2000});
                            }
                        }
                    });
                }
                _();
                return;
            }

            var url = Core.CONFIG.Path.OS + "?ct=download&ac=index&pickcode=" + pick_code + "&_t=" + new Date().getTime();
            var con = $('<div class="dialog-frame" style="height:240px"><iframe style="height: 240px;" frameborder=0 src="'+url+'"></iframe></div>');
            Core.FileAPI._DownloadWin = new Core.DialogBase({
                title: '文件快速下载',
                content: con,
                width:530
            });
            Core.FileAPI._DownloadWin.Open(function(){
                Core.FileAPI._DownloadWin.warp.addClass("easy-download");
            }, win);
        },
        DownloadURI: function(url,win){
            var con = $('<div class="dialog-frame" style="height:240px"><iframe style="height: 240px;" frameborder=0 src="'+url+'"></iframe></div>');
            Core.FileAPI._DownloadWin = new Core.DialogBase({
                title: '文件快速下载',
                content: con,
                width:530
            });
            Core.FileAPI._DownloadWin.Open(function(){
                Core.FileAPI._DownloadWin.warp.addClass("easy-download");
            }, win);
        },
        OpenNewWindow: function(url){
            var form = document.createElement("form");
            form.action = url;
            form.target = "_blank";
            form.method = "post";
            document.body.appendChild(form);
            form.submit();
            window.setTimeout(function(){
                document.body.removeChild(form);
            }, 30);
        },
        GetDownPlugs: function(isWrite){
            return false;
            if(!isWrite){
                return document.getElementById('OOF_DOWN_PLUGS_EX1_0');
            }
            if(Core.CONFIG.IsWindowNT && !$.browser.msie){
                if (navigator.plugins && navigator.plugins.length > 0) {
                    var p = navigator.plugins["115 Check Plugin Ex"];
                    if (p) {
                        var object = $('<embed id="OOF_DOWN_PLUGS_EX1_0" type="application/x-115checkpluginex" width="0" height="0" style="position:absolute; top:-99999px;" />');
                        $(document.body).append(object);
                    }
                }
            }
        },
        DownloadSomeFile: function(list){
            if(!list.length){
                Core.MinMessage.Show({
                    text: '请选择文件', 
                    type: 'war', 
                    timeout: 2000
                });
                return;
            }
            if(list.length == 1 && list[0].attr('file_type') == '1'){
                Core.FileAPI.Download(list[0].attr("pick_code"));
            }
            else{
                if('DownFile' in Core){
                    Core.DownFile.Go(list);
                    return false;
                }
            }
        },
        //编辑同步盘文件名称
        EditSyncFileName: function(obj){
            if(obj.type == "f"){
                if(obj.fileName.lastIndexOf(".") == -1){
                    obj.suffix = "";
                }
                else{
                    var name = obj.fileName.substring(0,obj.fileName.lastIndexOf("."));
                    obj.suffix = obj.fileName.substring(obj.fileName.lastIndexOf("."));
                    obj.fileName = name;
                }
            }
            else{
                obj.suffix = "";
            }

            var editCon = $('<div class="dialog-input">'+
                '<input type="text" rel="txt" class="text" value="' + obj.fileName + '" />'+
                '</div>'+
                '<div class="dialog-bottom">'+
                '<div class="con">' +
                '<a href="javascript:;" class="button" btn="confirm">确定</a>'+
                '</div>' +
                '</div>');
            var editBox = new Core.DialogBase({
                title: '重命名',
                content: editCon
            });

            editBox.Open(null);

            editCon.find("[rel='txt']").val(obj.fileName);


            //Rename Function
            var renameFolderFun = function(e){
                var model = e.data.model;
                //修改名称
                var input = editCon.find("[rel='txt']");
                var vals = $.trim(input.val());
                if(vals == ""){
                    Core.MinMessage.Show({
                        text: "请输入内容",
                        timeout: Core.CONFIG.MsgTimeout,
                        type:"err"
                    });
                    input.focus();
                    return;
                }
                model.fileName = vals + model.suffix;
                var newPath = model.path + model.fileName;
                if(model.callback){
                    model.callback(model.key, newPath, function(){
                        editBox.Close();
                    });
                }
            }

            editCon.find("[rel='txt']").bind("keyup", {
                model: obj
            }, function(e){
                if(e.keyCode == 13){
                    renameFolderFun(e);
                }
                else if(e.keyCode == 27){
                    editBox.Close();
                }
            })

            editCon.find("[btn]").bind("click", {
                model: obj
            }, function(e){
                switch($(this).attr("btn")){
                    case "confirm":
                        renameFolderFun(e);
                        break;
                    case "cancel":
                        editBox.Close();
                        break;
                }
                return false;
            })

            editCon.find("[rel='txt']")[0].select();
        },
        MoveSyncFile: function(list, callback){
            var id = list.find("input:checkbox").val();
            $.ajax({
                url: "?ct=file&ac=move_box",
                data: {
                    aid: 1, 
                    cid: 0, 
                    id: id
                },
                type: "POST",
                success: function(r){

                    if(callback) callback();
                }
            })
        },
        GetCopyText: function(list){
            var strArr = [];
            for(var i = 0, len = list.length; i < len; i++){
                var item = list[i];
                var url = Core.CONFIG.Path.OS + ((item.attr("file_type") == "1")? "file/" : "folder/" ) + item.attr("pick_code");
                var file_name;

                if(item.attr("file_type") == "1"){
                    file_name = item.find('[field="file_name"]').attr("title");
                }
                else{
                    file_name = item.attr("cate_name");
                }

                strArr.push(url + "#\r\n" + file_name);
            }
            return strArr.join("\r\n");
        },
        BaleDownload:function (list) {
            if(!Core.FilePermission.Vip()){
                Core.Message.Confirm({
                    text: '升级VIP贵宾，马上享受文件打包下载服务',
                    confirm_text: "马上升级",
                    confirm_link: PAGE_PATHS['VIP'] + '/?p=batchdown'
                });
                return false;
            }
            var strArr = [];
            for(var i=0;i<list.length;i++) {
                var item = list[i];
                if(item.attr("file_type") == "0") {
                    strArr.push(item.attr("cate_id"));
                }else {
                    strArr.push(item.attr("file_id"));
                }
            }
            /*打包请求*/
            $.ajax({
                url: "?ct=batchdown&ac=create",
                data: {
                    file_ids:strArr.join(",")
                },
                dataType: 'json',
                type: "POST",
                success: function(r){
                    /*打包请坟成功*/
                    if(r.state){
                        Core.FrameDG.Open('static/plug/bale_download/unpack.html?key='+r.task_id, {
                            title:"打包下载", 
                            width:500, 
                            height:250
                        })
                    }else {
                        Core.MinMessage.Show({
                            text: r.err_msg, 
                            type: r.errtype || "err",
                            timeout:Core.CONFIG.MsgTimeout
                        });
                    }
                }
            })
        }
    }
})();


$(function(){
    Core.FileAPI.GetDownPlugs(true);
});

//同步收件箱与回收站数量
Core.CountSync = (function(){
    var _rbDom, _count = 0;
    return {
        Get: function(){
            return _count;
            
        },
        Bind: function(rbDom){
            _rbDom = rbDom;
        },
        Sync: function(){
            if(_rbDom){
                $.ajax({
                    url: "?ct=rb&ac=get_num",
                    type: "GET",
                    cache: false,
                    dataType: "json",
                    success: function(r){
                        try{
                            _count = r.count;
                            _rbDom.html(Number(r.count)? r.count : "");
                        }catch(e){}
                    }
                })
            }
        }
    }
})();/*
	设置文件描述对话框
*/
//编辑器设置内容回调
var editorCallBack = function(content){
    var box = document.getElementById(Core.CONFIG.EditTextArea);
    if(box){
        box.value = content;
    }
}

Core.FileDescDG = (function(){
    var _model = function(){
        var _self = this;
        var _cache_obj, _cache={};
		
                
        var _content = $('<div class="editor-contents">'+
                    '<textarea id="' + Core.CONFIG.EditTextArea + '" style="display: none;" name=""></textarea>'+
                    '<iframe id="js_ifrHtmlEditor" scrolling="no" style="position:relative;top:0;right:0;bottom:0;left:0;width:100%;height:100%;overflow:hidden;border-bottom:1px #eee solid;border-top:1px #eee solid;" frameborder="0" border="0" name="ifrHtmlEditor" src=""></iframe>'+
                '</div>'+
                '<div class="dialog-bottom">'+
                    '<div class="dialog-status">填写你的文件描述</div>'+
                    '<div class="con">'+
                        '<a href="javascript:;" class="button" btn="confirm">确定</a>'+
                        '<a href="javascript:;" class="btn-link" btn="cancel">取消</a>'+
                    '</div>'+
                '</div>');
		
        Core.DialogBase.call(this,{
            content: _content, 
            title: '文件备注',
            width:600
        });
		
        var _editorControl = (function(){
            var initState = false;
            var init = function(){
                if(!initState){
                    initState = true;
                    document.getElementById("js_ifrHtmlEditor").src = Core.CONFIG.EditPath + "&bind=" + Core.CONFIG.EditTextArea + "&_t=" + new Date().getTime();
                }
            }
			
            return {
                Get: function(){
                    return document.getElementById(Core.CONFIG.EditTextArea).value;
                },
                Set: function(content){
                    init();
                    document.getElementById(Core.CONFIG.EditTextArea).value = content;
                    window.setTimeout(function(){
                        document.getElementById("js_ifrHtmlEditor").src = Core.CONFIG.EditPath + "&bind=" + Core.CONFIG.EditTextArea + "&_t=" + new Date().getTime();
                    },10);
                },
                Height: function(value){
                    if(value != undefined){
                        $("#js_ifrHtmlEditor").height(value);
                    }
                    else{
                        return $("#js_ifrHtmlEditor").height();
                    }
                }
            }
        })();
		
        this.Initial = function(){
            _editorControl.Height(310);
            _editDG.warp.addClass("property-editor");
            _content.find("[btn]").unbind("click").bind("click",function(){
                switch($(this).attr("btn")){
                    case "confirm":
                        var desc = _editorControl.Get();
                        var data = {
                            fid: _cache_obj.file_id,
                            file_desc: desc
                        }
                        //文件描述修改AJAX
                        UA$.ajax({
                            url:"/files/edit",
                            data:data,
                            dataType: "json",
                            type: "POST",
                            success: function(r){
                                if(r.state){
                                    Core.MinMessage.Show({
                                        text: "编辑成功", 
                                        type: "suc", 
                                        timeout: Core.CONFIG.MsgTimeout, 
                                        window: Core.CONFIG.FileWindow
                                    });
                                    if(Core.FileConfig.DataAPI) Core.FileConfig.DataAPI.UpdateFile({
                                        file_id: data.fid,
                                        desc: data.file_desc
                                    });
                                    _successCallback && _successCallback();
                                }
                                else{
                                    Core.MinMessage.Show({
                                        text: r.error, 
                                        type: "err", 
                                        timeout: Core.CONFIG.MsgTimeout, 
                                        window: Core.CONFIG.FileWindow
                                    });
                                }
                            }
                        });
                        
                        _self.Close();
                        break;
						
                    case "cancel":
                        _self.Close();
                        break;
                }
                return false;
            })
        }
		
        var _closeEvent = _self.Close;
		
        this.Close = function(){
            $("#js_ifrHtmlEditor").attr("src","");
            _closeEvent();
            _cache_obj = false;
        }

        this.SetValue = function(obj){
            _cache_obj = obj;
            _editorControl.Set(obj.value);
        }
    }
	
    var _editDG;
    var _successCallback;
	
    return {
        Show: function(obj){
            _successCallback = obj.callback;

            if(!_editDG){
                _editDG = new _model();
            }
			
            _editDG.Open(function(){
                _editDG.SetValue(obj);
            });
        }
    }
})();/*
	重命名文件对话框
*/
Core.FileReNameDG = (function(){
    var _mod;
    var _model = function(){
        var _self = this, _cache={};
        
        var _content = $('<div class="dialog-input">'+
                '<input type="text" rel="file_name" class="text" style="width:362px;" />'+
                '<span class="file-ext-name" rel="ext_name" style="top:30px;border: 1px solid;border-color: #CECECF;box-shadow: inset 0px 0px 0px rgba(0,0,0,0.1);"></span>'+
                '</div>'+
                '<div class="dialog-action">'+
                '<a href="javascript:;" class="dgac-cancel" btn="cancel">取消</a>'+
                '<a href="javascript:;" class="dgac-confirm" btn="confirm">确定</a>'+
                '</div>');
        Core.DialogBase.call(this,{
            content: _content, 
            title: '重命名文件'
        });
        
        var renameFun = function(){
            var title = $.trim(_content.find('[rel="file_name"]').val());
            if(title == ""){
                 Core.MinMessage.Show({text: "请输入文件名", type: "war", timeout: Core.CONFIG.MsgTimeout, window:_self});
                _content.find('[rel="file_name"]').focus();
                return false;
                return;
            }

            var data = {
                fid: _cache.file_id,
                file_name: title + _cache.suffix
            }
            var r = Util.Validate.FileName($.trim(data.file_name));
            if(r !== true){
                Core.MinMessage.Show({
                    text: r, 
                    type: "err", 
                    timeout: Core.CONFIG.MsgTimeout
                } );
                _content.find('[rel="file_name"]')[0].focus();
                return;
            }
            //文件描述修改AJAX
            UA$.ajax({
                url:"/files/edit",
                data:data,
                dataType: "json",
                type: "POST",
                success: function(r){
                    if(r.state){
                        Core.MinMessage.Show({
                            text: "重命名成功", 
                            type: "suc", 
                            timeout: Core.CONFIG.MsgTimeout, 
                            window: Core.CONFIG.FileWindow
                        });
                        if(Core.FileConfig.DataAPI) {
                            Core.FileConfig.DataAPI.UpdateFile({
                                file_id: data.fid, 
                                file_name:r.data&&r.data.file_name || r.file_name
                            })
                        };
                    }
                    else{
                        Core.MinMessage.Show({
                            text: r.error, 
                            type: "err", 
                            timeout: Core.CONFIG.MsgTimeout, 
                            window: Core.CONFIG.FileWindow
                        });
                    }
                }
            })
            _self.Close();
            
        }
        
        this.Initial = function(){
            _content.find("[rel='file_name']").bind("keydown", function(e){
                if(e.keyCode == 13){
                    renameFun();
                }
                else if(e.keyCode == 27){
                    _self.Close();
                }
            })

            _content.find("[btn]").bind("click", function(e){
                switch($(this).attr("btn")){
                    case "confirm":
                        renameFun();
                        break;
                    case "cancel":
                        _self.Close();
                        break;
                }
                return false;
            })
        }
        
        this.SetValue = function(file_id, file_name){
            _cache.file_id = file_id;
            var title = file_name;
            if(title.indexOf(".") != -1){
                _cache.suffix = title.substring(title.lastIndexOf("."), title.length);
                title = title.substring(0, title.lastIndexOf("."));
            }
            else{
                _cache.suffix = "";
            }
            var fileName = _content.find('[rel="file_name"]');
            var extName = _content.find('[rel="ext_name"]');
            
            
            if(_cache.suffix){
                extName.html(_cache.suffix).show();
                //420px
                window.setTimeout(function(){
                fileName.width(420 - extName.width() - 20);
                }, 10);
            }
            else{
                extName.hide();
                window.setTimeout(function(){
                fileName.width(420);
                }, 10);
            }
            
            fileName.val(title);
            window.setTimeout(function(){
                fileName.select();
            },20);
        }
    }
    
    
    return {
        Show: function(file_id, file_name){
            if(!_mod){
                _mod = new _model();
            }
            
            _mod.Open(function(){
                _mod.SetValue(file_id, file_name);
            });
        }
    }
})();/*选择文件对话框*/
Core.FileSelectDG = (function() {
    var _dirCacheAid, _dirCacheCid, _dirCacheCname, _dirCachePath, _paths, _api = false;
    var _model = function() {
        var _self = this, _cache = {
            disClass: "btn-disabled"
        };
        var _content = $('<div>' +
                '<div class="dialog-frame">' +
                '<iframe src="" frameborder="0" rel="js_iframe" style="height: 100%;"></iframe>' +
                '</div>' +
                '<div class="dialog-bottom">' +
                '<div class="con">' +
                (Core.Dir ? '<a href="javascript:;" style="float:left;" class="btn-link" btn="add_dir">新建文件夹</a> ' : '') +
                '<input type="checkbox" id="js_selec_file_check_all" rel="check_all"><label for="js_selec_file_check_all" rel="check_all">全选</label> ' +
                '<a href="javascript:;" class="button" btn="confirm">确定</a>' +
                '</div>' +
                '</div>' +
                '</div>');


        Core.DialogBase.call(this, {
            title: '请选择文件',
            content: _content,
            width:700
        });

        var _frame = _content.find("[rel='js_iframe']");

        var changeURL = function(aid, cid, opt) {
            var select = 0, filter = "", nf = "",  select_dir = '', not_select_file = '';
            if (opt) {
                select = opt.select_one ? 1 : 0;
                filter = opt.filter ? opt.filter : "";
                nf = opt.nf ? opt.nf : "";
                select_dir = opt.select_dir ? 1 : 0;
                not_select_file = opt.not_select_file ? opt.not_select_file : '';
            }
            _api = false;
            var url = Core.CONFIG.Path.U + "/?ct=file&ac=userfile&ajax=1" +
                    "&select=" + select +
                    "&nf=" + nf +
                    "&filter=" + filter +
                    "&select_dir=" + select_dir +
                    "&aid=" + aid +
                    "&cid=" + cid +
                    "&nsf=" + not_select_file +
                    "&_t=" + new Date().getTime() + ( opt && opt.order ? '&o='+opt.order : '');
            _frame.attr("src", "");
            _frame.attr("src", url);
        }

        this.Initial = function() {
            _self.warp.addClass("file-select");
            window["DBLClick_BACK"] = function(node) {
                _cache.list = [node];
                _content.find("[btn='confirm']").click();

            }

            _self.warp.find("[rel='check_all']").on("click", function() {
                if (_api.SelectAll) {
                    $(this).attr('checked') ? _api.SelectAll() : _api.CancelSelect();
                }

            })

            _content.find("[btn]").off("click").on("click", function() {
                switch ($(this).attr("btn")) {
                    case "add_dir":
                        if (_dirCacheAid) {
                            Core.Dir.Create(_dirCacheAid, _dirCacheCid, function(r) {
                                if (r.state) {
                                    Core.MinMessage.Show({
                                        text:'成功新建文件夹', type: 'suc', timeout: 2000
                                    });
                                    window.setTimeout(function(){
                                        changeURL(_dirCacheAid, r.cid, {
                                            select_one: _cache.select_one,
                                            filter: _cache.filter,
                                            nf: _cache.nf,
                                            order:_cache.order || null
                                        });
                                    }, 500);
                                }

                            });
                        }
                        break;
                    case "confirm":
                        if (_cache.nf) {
                            if (_dirCacheAid === false) {
                                Core.MinMessage.Show({
                                    text: "请等待进入文件夹",
                                    timeout: Core.CONFIG.MsgTimeout,
                                    window: _self
                                });
                                return;
                            }
                        }
                        else {
                            if (!_cache.not_select_file) {
                                if (!_cache.list || !_cache.list.length) {
                                    Core.MinMessage.Show({
                                        text: "请选择文件",
                                        timeout: Core.CONFIG.MsgTimeout,
                                        window: _self
                                    });
                                    return;
                                }
                            }
                        }

                        switch (_cache.type) {
                            case "cover":
                                //修改封面
                                Core.FileAjax.EditCover(_cache.cover_aid, _cache.cover_cid, _cache.list[0].attr("file_id"), function(r) {
                                    if (r.state) {
                                        Core.MinMessage.Show({
                                            text: "修改成功",
                                            type: "suc",
                                            timeout: Core.CONFIG.MsgTimeout
                                        });

                                        if (Core.FileConfig.DataAPI)
                                            Core.FileConfig.DataAPI.EditCover({
                                                cate_id: _cache.cover_cid,
                                                img_url: r.img_url
                                            });
                                    }
                                    else {
                                        Core.MinMessage.Show({
                                            text: r.msg,
                                            type: r.errtype || "err",
                                            timeout: Core.CONFIG.MsgTimeout
                                        });
                                    }
                                    _self.Close();
                                });
                                break;
                            case "msg":
                                var arr = [];
                                if (_cache.nf) {
                                    arr.push({
                                        aid: _dirCacheAid,
                                        cid: _dirCacheCid,
                                        cname: _dirCacheCname,
                                        path: _dirCachePath
                                    })
                                }
                                else {
                                    if (_cache.list && _cache.list.length) {
                                        for (var i = 0, len = _cache.list.length; i < len; i++) {

                                            var item = _cache.list[i];

                                            if (item.attr("file_type") == "1") {
                                                arr.push({
                                                    file_id: item.attr("file_id"),
                                                    file_size: item.attr("file_size"),
                                                    file_name: item.find('[field="file_name"]').attr("title"),
                                                    aid: item.attr("area_id"),
                                                    cid: item.attr("p_id"),
                                                    ico: item.attr("ico"),
                                                    sha1: item.attr("sha1"),
                                                    pick_code: item.attr("pick_code"),
                                                    path: item.attr("path")
                                                });
                                            }
                                            else {
                                                if (_cache.select_dir) {
                                                    arr.push({
                                                        aid: item.attr("area_id"),
                                                        cid: item.attr("cate_id"),
                                                        cate_name: item.attr("cate_name"),
                                                        pick_code: item.attr("pick_code"),
                                                        is_dir: 1
                                                    });
                                                }
                                                else {
                                                    arr.push({
                                                        aid: item.attr("area_id"),
                                                        cid: item.attr("cate_id")
                                                    });
                                                }
                                            }

                                        }
                                    }
                                    else {
                                        arr.push({
                                            aid: _dirCacheAid,
                                            cid: _dirCacheCid,
                                            cname: _dirCacheCname,
                                            path: _dirCachePath
                                        });
                                    }
                                }

                                _self.Callback && _self.Callback(arr, false);
                                window.setTimeout(function() {
                                    _self.Close();
                                }, 10);
                                break;
                            default:
                                _self.Callback && _self.Callback(_cache.list, false);
                                window.setTimeout(function() {
                                    _self.Close();
                                }, 10);
                                break;
                        }

                        break;
                    case "cancel":
                        _self.Close();
                        break;
                }
                return false;
            });

            var oldAid = 1, oldCid = 0;

            var oldCookie = Util.Cookie.get("SEL_F_DIR");
            if (oldCookie) {
                var oldArr = oldCookie.split("|");
                if (oldArr.length == 2) {
                    oldAid = Number(oldArr[0]);
                    oldCid = Number(oldArr[1]);
                }
            }

            if (_cache.nf) {
                _self.warp.find("[btn='add_dir']").show();
            }
            else {
                _self.warp.find("[btn='add_dir']").hide();
            }

            var copyInput = _self.warp.find("input[rel='copy']");
            copyInput.attr("checked", false);
            if (_cache.show_copy) {
                _self.warp.find("[rel='copy']").show();
            }
            else {
                _self.warp.find("[rel='copy']").hide();
            }

            changeURL(oldAid, oldCid, {
                select_one: _cache.select_one,
                filter: _cache.filter,
                nf: _cache.nf,
                select_dir: _cache.select_dir,
                not_select_file: _cache.not_select_file,
                order:_cache.order || null
            });
        }

        this.Setting = function(obj) {
            _cache.list = false;
            _cache.users = obj.users;
            _cache.type = obj.type;
            _cache.cover_cid = obj.cover_cid;
            _cache.cover_aid = obj.cover_aid;
            _cache.hide_aids = obj.hide_aids;
            _cache.select_one = obj.select;
            _cache.filter = obj.filter;
            _cache.nf = obj.nf;
            _cache.select_dir = obj.select_dir;
            _cache.show_copy = obj.show_copy;
            _cache.is_talk = obj.is_talk;
            _cache.qcid = obj.qcid;
            _cache.btn_txt = obj.btn_txt;
            _cache.select_txt = obj.select_txt;
            _cache.title = obj.title;
            _cache.not_select_file = obj['not_select_file'];
            if (obj['order']) {
                _cache['order'] = obj['order'];
            };
        }

        var _closeEvent = _self.Close;
        this.Close = function() {
            _frame.attr("src", "");
            _closeEvent();
            _self.Callback = false;
        }

        var _openEvent = _self.Open;
        this.CancelCheck = function() {
            _content.find('#js_selec_file_check_all').attr('checked', false);
        }
        this.Open = function() {
            _dirCacheAid = false;
            _dirCacheCid = false;

            _openEvent();

            if (_cache.nf) {
                _self.warp.find('[rel="base_title"]').html("打开要" + _cache.select_txt + "的目标文件夹");
                _self.warp.find('[btn="confirm"]').html(_cache.btn_txt);
                _self.warp.find("[rel='check_all']").hide();
            }
            else {
                _self.warp.find("[rel='check_all']").show();
                _self.warp.find('[rel="base_title"]').html("请选择文件");
                _self.warp.find('[btn="confirm"]').html("确定");
            }

            if (_cache.title) {
                _self.warp.find('[rel="base_title"]').html(_cache.title);
            }


            if (_cache.select_one) {
                _self.warp.find("[rel='check_all']").hide();
            }
            else {
                _self.warp.find("[rel='check_all']").show();
            }

        }

        this.Set = function(arr) {
            _cache.list = arr;
        }

        this.Callback = false;
    }

    var _DG;
    return {
        OpenByMsg: function(callback, opt) {
            if (!_DG) {
                _DG = new _model();
            }
            var setting = {
                type: "msg"
            };
            if (opt) {
                setting["select"] = opt.select ? 1 : 0;
                setting["filter"] = opt.filter ? opt.filter : "";
                setting["select_dir"] = opt.select_dir ? 1 : 0;
            }
            _DG.Setting(setting);

            _DG.Open();
            _DG.Callback = callback;
        },
        Open: function(callback, opt) {
            if (!_DG) {
                _DG = new _model();
            }

            var setting = {
                type: "msg"
            };
            if (opt) {

                setting["select"] = opt.select ? 1 : 0;

                setting["filter"] = opt.filter ? opt.filter : "";

                setting["nf"] = opt.nf ? opt.nf : "";

                setting["select_dir"] = opt.select_dir ? 1 : 0;


                setting['btn_txt'] = opt.btn_txt ? opt.btn_txt : '移动到这里';
                setting['select_txt'] = opt.select_txt ? opt.select_txt : '移动';

                setting['title'] = opt.title ? opt.title : '';

                setting['not_select_file'] = opt.not_select_file ? opt.not_select_file : '';
                if(opt['order']) {
                    setting['order'] = opt['order']
                }

            }
            setting["show_copy"] = opt.show_copy;
            _DG.Setting(setting);

            _DG.Open();
            _DG.Callback = callback;
        },
        Show: function(users, callback) {
            if (!_DG) {
                _DG = new _model();
            }
            _DG.Setting({
                users: users,
                type: "send"
            });
            _DG.Open();
            _DG.Callback = callback;
        },
        EditCover: function(aid, cid) {
            if (!_DG) {
                _DG = new _model();
            }
            var setting = {
                type: "cover",
                select: 1,
                filter: 2,
                cover_aid: aid,
                cover_cid: cid
            };
            if (Number(aid) != 999) {
                Util.Cookie.set("SEL_F_DIR", aid + "|" + cid, 24);
            }
            _DG.Setting(setting);
            _DG.Open();
        },
        Select: function(arr) {
            if (_DG) {
                _DG.Set(arr);
            }
        },
        MarkDir: function(aid, cid) {
            if (Number(aid) != 999) {
                Util.Cookie.set("SEL_F_DIR", aid + "|" + cid, 24);
            }
        },
        SelectDir: function(aid, cid, cname, path) {
            _dirCacheAid = aid;
            _dirCacheCid = cid;
            _dirCacheCname = cname;
            _dirCachePath = path;
            if (_DG) {
                _DG.CancelCheck();
            }

        },
        BackPaths: function(paths) {
            _paths = paths
        },
        MainAPI: function(api) {
            _api = api;
            if (_DG) {
                _DG.warp.find("input[rel='check_all']").attr("checked", false);
            }
        },
        GetBackPaths: function() {
            return _paths;
        },
        Close: function() {
            if (_DG) {
                _DG.Close();
            }
        }
    }
})();/**
 * 浮动菜单权限控制
 */
Core.FileMenu = (function(){
    var _cache = {
        specil: Core.FileConfig.Specil,
        setting: Core.FileConfig.OPTPermission
    }, _main_top = 10, _opBox;
    
    var _opcBoxTemp = '<div style="z-index: 9000000;background: none repeat scroll 0 0 black;height: 100%;left: 0;position: absolute;top: 0;width: 100%;filter:alpha(opacity=0.15);-moz-opacity:0;opacity:0;display:none;" onselectstart="return false;"></div>';
    
    var showopbox = function(hideFun){
        _cache.hideMenuFun = hideFun;
        if(!_opBox){
            _opBox = $(_opcBoxTemp);
            $(document.body).append(_opBox);
            $(window).on('scroll', function(){
                if(_opBox && !_opBox.is(':hidden')){
                    hideopbox();
                    if(_cache.hideMenuFun) _cache.hideMenuFun();
                }
            });
        }
        
        if ($.browser.msie && $.browser.version == 6) {
            var doc = document.documentElement;
            _opBox.css({
                width: ((doc.scrollWidth>doc.clientWidth)?doc.scrollWidth:doc.clientWidth) + 'px',
                height: ((doc.scrollHeight>doc.clientHeight)?doc.scrollHeight:doc.clientHeight) + 'px'
            });
        }
        else{
            _opBox.css({
                position: 'fixed'
            });
        }
        
        _opBox.show();
        _opBox.unbind("mousedown").bind("mousedown", function(e){
            hideFun && hideFun(e);
            $(this).hide();
        });
    }
    
    var hideopbox = function(){
        if(_opBox){
            _opBox.hide();
        }
    }
    
    var getSelFilesData = function(arr, opt){
        return Core.FileAPI.GetSelFilesData(arr);
    }
    
    var isTypeQ = function(arr, opt){
        var item;
        var result = {};
        
        if(arr.length == 1){
            item = arr[0];
            var file_type = item.attr("file_type");
            var per = item.attr('per');
            if(file_type == "1"){
                if(Core.FilePermission.CanPlayer(arr, 4)){
                    result["q_onemusic"] = true;
                }
                else{
                    result["q_onefile"] = true;
                }
                
                if(opt.download){
                    result["q_download"] = true;
                }
                
                if(opt.edit_file){
                    result["q_edit_file"] = true;
                }
                if(opt.del_file){
                    result["q_delete_file"] = true;
                }
                if(opt.save_file){
                    result["q_save_file"] = true;
                }
                if(opt.move_file){
                    result["q_move_file"] = true;
                }
                if(per == '1' || per == '2'){
                    result["q_edit_file"] = true;
                    result["q_delete_file"] = true;
                    result["q_move_file"] = true;
                }
            }
            else{
                /*if(opt.manager){
                    result["q_manager"] = true;
                }*/
                if(per == '1'){
                    result["q_manager"] = true;
                    result["q_edit_dir"] = true;
                    result["q_delete_folder"] = true;
                }
                else if(per == '2'){
                    result["q_edit_dir"] = true;
                    result["q_delete_folder"] = true;
                }
                //选中单个文件夹
                result["q_onefolder"] = true;
                if(opt.move_file){
                    result["q_move_file"] = true;
                }
                if(opt.save_file){
                    result["q_save_file"] = true;
                }
            }
        }
        else{
            //选择了多条文件
            var fileCount = 0, folderCount = 0, shareCount = 0;
            var musicCount = 0;
            var managerCount = 0;
            var editCount = 0;
            for(var i = 0, len = arr.length; i < len; i++){
                item = arr[i];
                file_type = item.attr("file_type");
                if(file_type == "1"){
                    if(Core.FilePermission.CanPlayer([item], 4)){
                        musicCount++;
                    }
                    fileCount++;
                    if(item.attr('per') == '1'){
                        managerCount++;
                    }
                    else if(item.attr('per') == '2'){
                        editCount++;
                    }
                }
                else if(file_type == "0"){
                    folderCount++;
                    if(item.attr('per') == '1'){
                        managerCount++;
                    }
                    else if(item.attr('per') == '2'){
                        editCount++;
                    }
                }
            }
            if(opt.manager){
                result["q_delete_file"] = true;
            }
            if(fileCount && folderCount){
                var res = false;
                if(opt.del_dir){
                    res = true;
                }
                if(opt.del_file){
                    res = true;
                }
                if(res){
                    result["q_delete_file"] = true;
                }
                if((managerCount + editCount) == (fileCount + folderCount)){
                    result["q_delete_file"] = true;
                }
                if(opt.move_file){
                    result["q_move_file"] = true;
                }
                if(opt.save_file){
                    result["q_save_file"] = true;
                }
            }
            else if(fileCount && !folderCount){
                if(opt.del_file){
                    result["q_delete_file"] = true;
                }
                if(opt.save_file){
                    result["q_save_file"] = true;
                }
                if(opt.move_file){
                    result["q_move_file"] = true;
                }
                if((managerCount + editCount) == fileCount){
                    result["q_delete_file"] = true;
                    result["q_save_file"] = true;
                    result["q_move_file"] = true;
                }
                if(musicCount == fileCount){
                    result["q_moremusic"] = true;
                }
                result['q_morefile'] = true;
            }
            else if(!fileCount && folderCount){
                /*if(opt.manager){
                    result["q_manager"] = true;
                }*/
                if(managerCount == folderCount){
                    result["q_manager"] = true;
                    result["q_delete_folder"] = true;
                }
                if(editCount == folderCount){
                    result["q_delete_folder"] = true;
                }
                if(opt.move_file){
                    result["q_move_file"] = true;
                }
                if(opt.save_file){
                    result["q_save_file"] = true;
                }
            }
        }
        return result;
    }
    
    //显示按钮逻辑判断
    var isType = function(arr, opt){
        if(opt){
            if(opt.is_special){
                if(Core.Plugs.Check(opt.check_key, "menu_type")){
                    //执行插件检查选择的文件
                    var result = Core.Plugs.Cmd(opt.check_key, "menu_type", "Check", arr, opt);
                    return result;
                }
            }
            switch(Number(opt.aid)){
                case 999:
                    var result = isTypeQ(arr, opt);
                    return result;
                    break;
            }
        }
        var result = {}, file_type , item;
        if(Core.FileConfig.aid == 7){
            if(arr.length){
                result["rbfile"] = true;
            }
            result["rb"] = true;
            return result;
        }
        
        if(arr && arr.length == 1){
            //选择了一条记录
            item = arr[0];
            file_type = item.attr("file_type");
            if(item.attr('hdf') == '1'){
                if(Number(Core.NewSetting.Get('show'))){
                    result["hide_file"] = true;
                }
            }
            else{
                result["show_file"] = true;
            }
            
            
            if(file_type == "1"){
                //选中单个文件
                var fileName = item.find("[field='file_name']").attr("title");
                var suffix = '';
                if(fileName.lastIndexOf('.') != -1){
                    suffix = fileName.substring(fileName.lastIndexOf('.'), fileName.length).replace(".", "");
                }
                suffix = suffix.toLowerCase();
                if(Core.FilePermission.CanPlayer(arr, 4)){
                    result["onemusic"] = true;
                }
                else if(UPLOAD_CONFIG && UPLOAD_CONFIG['3'] && $.inArray(suffix, UPLOAD_CONFIG['3']["upload_type_limit"]) != -1){
                    result["onephoto"] = true;
                }
                else if(UPLOAD_CONFIG && UPLOAD_CONFIG['9'] && $.inArray(suffix, UPLOAD_CONFIG['9']["upload_type_limit"]) != -1){
                    result["onemovie"] = true;
                }
                else{
                    result["onefile"] = true;
                }
                
            }
            else if(file_type == "0"){
                //选中单个文件夹
                result["onefolder"] = true;
                if($.inArray(Number(_cache.aid), Core.CONFIG.BaseDir) != -1){
                    result["onefoldercover"] = true;
                    if(arr[0].attr("img_url")){
                        result["onefolderdelcover"] = true;
                    }
                }
            }
        }
        else{
            if(arr){
                //选择了多条文件
                var fileCount = 0, folderCount = 0;
                for(var i = 0, len = arr.length; i < len; i++){
                    item = arr[i];
                    file_type = item.attr("file_type");
                    if(file_type == "1"){
                        fileCount++;
                    }
                    else if(file_type == "0"){
                        folderCount++;
                    }
                    if(item.attr('hdf') == '1'){
                        result["hide_file"] = true;
                    }
                    else{
                        result["show_file"] = true;
                    }
                }
                if(fileCount && folderCount){
                    result["fewfandfl"] = true;
                    result["cancelshare"] = true;
                }
                else if(fileCount && !folderCount){		
                    if(Core.FilePermission.CanPlayer(arr, 4)){
                        result["fewmusic"] = true;
                    }
                    if(Core.FilePermission.CanPlayer(arr, 9)){
                        result["fewmovie"] = true;
                    }
                    else{
                        result["fewfile"] = true;
                    }
                }
                else if(!fileCount && folderCount){
                    result["fewfolder"] = true;
                }
            }
            else{
                result["nonefile"] = true;
            }
        }
        
        return result;
    }
    
    var changeShareData = function(is_share, list, r, callback){
        var arr = list;
        var dellist = [];
        if(r.state){
            dellist = arr;
        }
        else{
            if(r['data']){
                for(var i = 0, len = arr.length; i < len; i++){
                    var item = arr[i]
                    if(item.attr("file_type") == "1" && r['data']['f'] && r['data']['f']["state"]){
                        dellist.push(item);
                    }
                    else if(item.attr("file_type") == "0" && r['data']['c'] && r['data']['c']["state"]){
                        dellist.push(item);
                    }
                }
            }
            Core.MinMessage.Show({
                text: '推送失败', type:'err', timeout: 2000
            })
        }

        if(dellist.length){
            if(r["state"] && Number(is_share) == 1){
                for(var i = 0, len = list.length; i < len; i++){
                    var item = list[i];
                    if(item.attr("file_type") == "0"){
                        var dc = item.attr("cate_id");
                        if(r.dir_pickcode[dc]){
                            item.attr("pick_code", r.dir_pickcode[dc]);
                        }
                    }
                }
                if(callback) callback(r);
            }
            var msg = "已推送至分享";
            switch(Number(is_share)){
                case 0:
                    msg = "成功从分享空间取出";
                    break;
                case 2:
                    msg = "续期成功";
                    break;
            }
            Core.MinMessage.Show({
                text: msg, 
                timeout: Core.CONFIG.MsgTimeout, 
                window:_cache.win, 
                type:"suc"
            });
            window['console']&&console.log([Core.FileConfig.aid, Core.FileConfig.cid, is_share, dellist]);
            if(Core.FileConfig.DataAPI) Core.FileConfig.DataAPI.Share(Core.FileConfig.aid, Core.FileConfig.cid, is_share, dellist);
            if(Core.FileConfig.DataAPI) Core.FileConfig.DataAPI.Recheck(Core.FileConfig.aid, Core.FileConfig.cid, dellist);
        }
    }
    
    var buttonAction = {
        del: function(list){
            Core.FileAPI.DeleteFile(list);
        },
        share: function(list, btnType){
            if(btnType == "share"){
                Core.SendFileDG.Open(list, "file");
            }
            else{
                buttonAction.share_dataaccess(list, btnType);
            }
        },
        share_dataaccess: function(list, btnType, sharecallback){
            var url = "?ct=file&ac=share";
            var data = getSelFilesData(list);
            data.is_share = 1;
            switch(btnType){
                case "cancelshare":
                    data.is_share = 0;
                    break;
                case "renew":
                    data.is_share = 2;
                    break;
            }
            $.ajax({
                url: url,
                type: "POST",
                data: data,
                dataType: "json",
                success: function(r){
                    changeShareData(data.is_share, list, r, sharecallback);

                }
            })	
        }
    }
    
    var doEvent = function(btnType){
        var cRes = Core.FileMenu.CheckButtonIsDo(_cache.dataList, btnType);
        if(!cRes){
            return false;
        }
        else{
            if(typeof cRes == "object"){
                _cache.dataList = cRes;
            }
        }
        switch(btnType){
            //删除文件或文件夹
            case "delete":
                buttonAction.del(_cache.dataList);
                break;
            case "move":
                
                var hasFolder = false;
                if(_cache.dataList.length){
                    for(var i = 0, len = _cache.dataList.length; i < len; i++){
                        if(_cache.dataList[i].attr("file_type") == "0"){
                            hasFolder = true;
                        }
                    }
                }
                
                Core.TreeDG.Show({
                    list: _cache.dataList, 
                    win:_cache.win,
                    has_dir: hasFolder,
                    type: "move"
                });
                
                break;
            case "copy":
                Core.TreeDG.Show({
                    list: _cache.dataList, 
                    win:_cache.win, 
                    type:"copy"
                });
                break;
           
            case "edit_name":
                if(_cache.dataList && _cache.dataList.length){
                    var node = _cache.dataList[0];
                    if(node.attr("file_type") == "1"){
                        Core.FileReNameDG.Show(node.attr("file_id"), node.find('[field="file_name"]').attr("title"));
                    }
                    else{
                        var cid = node.attr("cate_id");
                        Core.Dir.Rename(Core.FileConfig.aid, cid, node.attr("cate_name"));
                    }
                }
                break;
            case "cover":
                if(_cache.dataList && _cache.dataList.length){
                    var cid = _cache.dataList[0].attr("cate_id");
                    Core.FileSelectDG.EditCover(Core.FileConfig.aid, cid);
                }
                break;
            case "del_cover":
                if(_cache.dataList && _cache.dataList.length){
                    var cid = _cache.dataList[0].attr("cate_id");
                    Core.FileAjax.DeleteCover(Core.FileConfig.aid, cid, function(r){
                        if(r.state){
                            Core.MinMessage.Show({
                                text: "成功删除封面", 
                                type:"suc", 
                                timeout: Core.CONFIG.MsgTimeout
                            });

                            if(Core.FileConfig.DataAPI) Core.FileConfig.DataAPI.EditCover({
                                cate_id: cid,
                                img_url: ""
                            });
                        }
                        else{
                            Core.MinMessage.Show({
                                text: r. msg, 
                                type:"err", 
                                timeout: Core.CONFIG.MsgTimeout
                            });
                        }
                    });
                }
                break;
            case "shareto":
                Core.FileAPI.ShareTO(_cache.dataList, {});
                break;
            case "share_file":
            case "cancelshare":
            case "renew":
                buttonAction.share(_cache.dataList,btnType);
                break;
            case "exp_delete":
                //移除收件与发件记录
                Core.FileAjax.DeleteExpMsg(Core.FileConfig.cid, _cache.dataList, _cache.win);
                break;
            case "exp_recv":
                //接收文件
                Core.FileAPI.RecvExp(_cache.dataList, _cache.win);
                break;
            case "restore":
                //还原文件
                var tids = [];
                for(var i = 0, len = _cache.dataList.length; i < len; i++){
                    var item = _cache.dataList[i];
                    tids.push(item.attr("tid"));
                }
                Core.FileAjax.RestoreRB(tids, _cache.win);
                break;
            case "rb_delete":
                //删除回收站文件
                var tids = [];
                for(var i = 0, len = _cache.dataList.length; i < len; i++){
                    var item = _cache.dataList[i];
                    tids.push(item.attr("tid"));
                }
                Core.FileAjax.DeleteRB(tids, _cache.win);
                break;
            case "download_dir":
            case "download":
                Core.FileAPI.DownloadSomeFile(_cache.dataList);
                break;
            case "copylink":
                var str = Core.FileAPI.GetCopyText(_cache.dataList);
                Util.Copy(str);
                break;
            case "edit":
                if(_cache.dataList && _cache.dataList.length){
                    var item = _cache.dataList[0];
                    var getBack = function(callback){
                        if(item.attr("load_data") != "1"){
                            Core.MinMessage.Show({
                                text: '读取描述...', type: 'load', timeout:2000
                            });
                            Core.DataAccess.FileRead.GetFileDetail(item.attr("file_id"), function(data){
                                Core.MinMessage.Hide();
                                item.attr("load_data", "1");
                                var desc = data.state ? data.desc : "";
                                item.find("[field='desc']").val(desc?desc: "");
                                if(data.count != undefined){
                                    item.attr("dc", data.count);
                                }
                                callback && callback();
                            });
                        }
                        else{
                            callback && callback();
                        }
                        
                    }
                    
                    getBack(function(){
                        Core.FileDescDG.Show({
                            aid: Core.FileConfig.aid, 
                            file_id: item.attr("file_id"), 
                            title: item.find('[field="file_name"]').attr("title"), 
                            value: item.find("[field='desc']").val()
                        });
                    });
                }
                break;
            case "sync_delete":
                if(_cache.dataList && _cache.dataList.length){
                    if(Core.FileConfig.DataAPI && Core.FileConfig.DataAPI.DeleteSync){
                        Core.Message.Confirm({
                            text: '确认要删除选中的文件或文件夹吗？', 
                            type: "war", 
                            callback: function(r){
                                if(r){
                                    Core.FileConfig.DataAPI.DeleteSync(_cache.dataList);
                                }
                            }
                        })
                    } 
                }
                break;
            case "privacy":
                Core.PrivacyDG.File(_cache.dataList[0]);
                break;
            case "unloading":
                Core.FileAjax.AllowCollect(_cache.dataList,1);
                break;
            case "cancelunloading":
                Core.FileAjax.AllowCollect(_cache.dataList,0);
                break;
            case "read":
                //预览
                window.Main.Core.ViewFile.Run(_cache.dataList[0]);
                break;
            case "view":
                //预览图片
                window.Main.Core.ViewFile.Run(_cache.dataList[0]);
                break;
            case "listen":
            case "add_listen":
                Core.ViewFile.AddMusic(_cache.dataList, btnType == "listen");
                break;
            case "open_listen":
                Core.ViewFile.ListMusic(_cache.dataList);
                break;
            case "star":
                var tids = [];
                for(var i = 0, len = _cache.dataList.length; i < len; i++){
                    var item = _cache.dataList[i];
                    tids.push(item.attr("file_id"));
                }
                if(tids.length){
                    Core.FileAjax.Star(tids.join(","), 1, function(ids, star){
                        Core.FileConfig.DataAPI && Core.FileConfig.DataAPI.Star(Core.FileConfig.aid, Core.FileConfig.cid, _cache.dataList, star);
                    })
                }
                
                break;
            case "magic":
                var file_id = _cache.dataList[0].attr("file_id");
                var url = '?ct=meitu&file_id=' + file_id;
                //PageCTL.GOTO_URL(url);
                Core.FileAPI.OpenNewWindow(url);
                break;
            case "open_dir":
                var item = _cache.dataList[0];
                var aid = item.attr("area_id"), cid = item.attr("cate_id");
                if(Ext.CACHE && Ext.CACHE.FileMain){
                    var li = item;
                    if(li.length && li.attr('hdf') == '1' && !Number(Core.NewSetting.Get('show'))){
                        Core.HideFile.SettingStatus(1, function(){
                            Ext.CACHE.FileMain.GotoDir(aid, cid);
                        });
                    }
                    else{
                        Ext.CACHE.FileMain.GotoDir(aid, cid);
                    }
                }
                break;
            case "gift":
                Core.Gift.Add(_cache.dataList);
                break;
            default:
                if(!Core.Plugs.DoButton(btnType, _cache.dataList)){
                    Core.MinMessage.Show({
                        text:" 操作数量:" + _cache.dataList.length, 
                        type:"suc", 
                        timeout:Core.CONFIG.MsgTimeout, 
                        window:_cache.win
                    });
                }
                break;
        }
    }
    
    var hideRightMenu = function(type){
        if(_cache[type]){
            _cache[type].find("[val]").hide();
            _cache[type].hide();
        }
    }

    var showRightMenu = function(type, aid, cid, arr, x, y, opt){
        _cache.aid = aid;
        _cache.cid = cid;
        _cache.dataList = arr;
        var isShow = false;
        if(arr && arr.length){
            isShow = true;
        }
        else{
            if(aid == 1){
                isShow = true;
            }
        }
        
        if(isShow){
            if(!_cache[type]){
                _cache[type] = Core.FloatMenu.Show(type);
                _cache[type].find("[val]").each(function(i){
                    if(!_cache[type + "_btn_list"]){
                        _cache[type + "_btn_list"] = {};
                    }
                    var val = $(this).attr('val');
                    _cache[type + "_btn_list"][val] = $(this);
                    
                    $(this).bind("click", function(e){
                        Core.Html.StopPropagation(e);
                        var btnType = $(this).attr("val");
                        if($(this).find(".arrow").length){
                            return false;
                        }
                        doEvent(btnType);
                        hideopbox();
                        hideRightMenu(type);
                        return false;
                    })
                });
                Core.FileMenu.BindAlbum(_cache[type], type);
            }
            
            if(Core.CONFIG.IsOOF.state){
                var ddA = _cache[type].find('[val="download_dir"] a');
                if(ddA.length){
                    Core.FileAPI.DownloadDir(arr, ddA);
                    ddA.parent().off("click");
                }
            }
            var showCount = 0 ;
            if(_cache[type + "_btn_list"]){
                for(var k in _cache[type + "_btn_list"]){
                    _cache[type + "_btn_list"][k].hide();
                }
                if(!opt) opt = {};
                opt.aid = aid;
                var r = isType(arr, opt);
                
                var specilobj = _cache.specil[_cache.aid];

                for(var k in r){
                    if(r[k]){
                        var ablelist = _cache.setting[k];
                        if(specilobj){
                            for(var i = 0, len = ablelist.length; i < len; i++){
                                if(specilobj[ablelist[i]] && _cache[type + "_btn_list"][ablelist[i]]){
                                    _cache[type + "_btn_list"][ablelist[i]].show();
                                    showCount++;
                                }
                            }    
                        }
                        else{
                            for(var i = 0, len = ablelist.length; i < len; i++){

                                if(_cache[type + "_btn_list"][ablelist[i]]){
                                    _cache[type + "_btn_list"][ablelist[i]].show();
                                    showCount++;
                                }
                            }
                        }
                    }
                }
            }
            if(!showCount){
                _cache[type] && _cache[type].hide();
                return;
            }
            
            var l = x, t = y;
            t += _main_top;
            
            l += $(Core.CONFIG.CenterMain).offset().left;
            showopbox(function(){
                hideRightMenu(type);
            });
            Core.FloatMenu.SetRightBtnPos(_cache[type], type, l, t);
            if(!showCount){
                hideRightMenu(type);
            }
        }
    }
    
    return {
        CheckButtonIsDo: function(list, type){
            
            if($.inArray(type, Core.CONFIG.NotUpCanDo) == -1){
                if(list.length == 1){
                    if(list[0].attr("file_status") == "0"){
                        Core.MinMessage.Show({text: "文件需续传完成后再操作。", type: "war", timeout: Core.CONFIG.MsgTimeout});
                        return false;
                    }
                }
                else if(list.length > 1){
                    var arr = [], isReupload = false;

                    for(var i = 0, len = list.length; i < len; i++){
                        var node = list[i];
                        if(node.attr("file_status") == "0"){
                            isReupload = true;
                            continue;
                        }
                        arr.push(node);
                    }
                    if(arr.length == 0){
                        if(isReupload){
                            Core.MinMessage.Show({text: "文件需续传完成后再操作。", type: "war", timeout: Core.CONFIG.MsgTimeout});
                        }
                        return false;
                    }
                    else{
                        return arr;
                    }
                }
            }
            return true;
        },
        CheckType: function(aid, cid, arr, opt){
            _cache.aid = aid;
            _cache.cid = cid;
            var result = [];
            if(!opt) opt = {};
            opt.aid = aid;
            var r = isType(arr, opt);
            for(var k in r){
                if(r[k]){
                    var ablelist = _cache.setting[k];
                    for(var i = 0, len = ablelist.length; i < len; i++){
                        result.push(ablelist[i]);
                    }
                }
            }
            return result;
        },
        GetSetting: function(){
            return _cache.setting;
        },
        Action: function(type){
            return buttonAction[type];
        },
        DoEvent: function(arr, btnType){
            _cache.dataList = arr;
            doEvent(btnType);
        },
        FileRight: function(aid, cid, arr, x, y, opt){
            
            var type = "more_btn";
            if(!arr) type = "none_file_btn";
            switch(Number(aid)){
                case 999:
                    var type = "right_q_file";
                    break;
                default:
                    if(opt && opt.is_special){
                        if(opt.menu_key){
                            type = "right_" + opt.menu_key + "_file";
                        }
                    }
                    break;
                
            }
            showRightMenu(type, aid, cid, arr, x, y, opt);
        },
        HideRight: function(type){
            hideopbox();
            hideRightMenu(type);
        },
        BindAlbum: function(dom, type){
            var listenBtn = dom.find('[val="add_listen"]');
            if(listenBtn.length){
                listenBtn.find('a').append('<em>&raquo;</em>');
                var menu;
                var hideState = true;
                var timer;
                
                var getPos = function(dom, li){
                    var x = li.offset().left + li.width();
                    var y = li.offset().top;
                    if(x + dom.width() > $(document).width()){
                        x = x - dom.width() - li.width();
                    }
                    if(y + dom.height() + 5 > $(document).height()){
                        y = $(document).height() - dom.height() - 5;
                    }
                    var pos = {
                        top: y, 
                        left: x
                    };
                    return pos;
                }
                
                var isload = false;
                
                
                var hideFun = function(){
                    hideState = true;
                    timer = window.setTimeout(function(){
                        if(hideState && menu){
                            menu.hide();
                            hideState = true;
                            menu.empty().remove();
                            menu = false;
                            isload = false;
                        }
                    }, 200);
                }
                
                listenBtn.off('click').on('mouseover', function(){
                    if(isload) return;
                    if(timer) window.clearTimeout(timer);
                    hideState = false;
                    if(!menu){
                        isload = true;
                        Core.CloudMusic.GetCate(function(r){
                            if(hideState) return;
                            isload = false;
                            var arr = {};
                            for(var k in r){
                                var item = r[k];
                                arr['al_' + item.topic_id] = {text: item.topic_name};
                            }
                            arr['br1'] = {isline: true};
                            arr['create_al'] = {text: '添加专辑'};
                            menu = Core.FloatMenu.GetMenu(arr);
                            menu.hide();
                            menu.on('mouseover', function(){
                                if(timer) window.clearTimeout(timer);
                                hideState = false;
                            }).on('mouseleave', function(){
                                hideFun();
                            });
                            
                            menu.find('[val] a').on('click', function(){
                                var el = $(this).parent();
                                if(el.attr('val').indexOf('al_') != -1){
                                    var tid = el.attr('val').replace('al_', '');
                                    var list = _cache.dataList;
                                    var fids = Core.ViewFile.AddMusic(list, true, true, tid)
                                    
                                    if(fids){
                                        Core.CloudMusic.AddFileList(tid, fids, function(mlist){
                                            Util.Cookie.set('OOF_MPLAY_UPDATE_T', tid);
                                        });
                                    }
                                    
                                    hideopbox();
                                    hideRightMenu(type);
                                }
                                else if(el.attr('val') == 'create_al'){
                                    //添加专辑
                                    Core.CloudMusic.AddCate(function(r){
                                        Core.MinMessage.Show({
                                            text: '成功添加音乐专辑',
                                            type: 'suc', timeout: 2000
                                        });
                                    });
                                }
                                menu.empty().remove();
                                menu = false;
                                return false;
                            });
                            
                            $(document.body).append(menu);
                            window.setTimeout(function(){
                                menu.css(getPos(menu, listenBtn)).show();
                            }, 10);
                        });
                    }
                    else{
                        menu.css(getPos(menu, listenBtn)).show();
                    }
                }).on('mouseleave', function(){
                    hideFun();
                })
            }
        }
    }
})();/**
 * 发送文件
 */

Core.SendFileDG = (function(){
    var _mod, _api, _list, _defaultType = "friend", _permission, _share_cache;
    
    var _model = function(){
        var _self = this, _cache = { };
        var _content = $('<div><div style="width:700px; height:355px;">'+
                '<iframe src="" frameborder="0" rel="frame" style="width:700px; height:355px;"></iframe>'+
            '</div>' +
            '<div class="dialog-bottom" rel="bottom">'+
                '<div class="con">'+
                    '<a href="javascript:;" class="button" style="display:none;" btn="confirm">立即分享</a>'+
                '</div>'+
                '<div class="dialog-status" style="float:left;" rel="dialog_status"></div>'+
            '</div></div>');
        Core.DialogBase.call(this, {
            title: '分享给好友', 
            content: _content, 
            width: 700
        });
        
        this.SetDialogText = function(text){
            
        }
        
        var _closeFun = _self.Close;
        this.IsOpen = false;
        this.Close = function(){
            _content.find("[rel='frame']").attr("src","");
            _self.IsOpen = false;
            _closeFun();
            _permission = false;
        }
        
        this.IsAllShare = function(){
            var len = _list.length;
            var shareCount = 0;
            for(var k in _list){
                if(Number(_list[k].attr("is_share"))){
                    shareCount++;
                }
            }
            return (shareCount == len);
        }
        
        this.Initial = function(){
            var url, ac = "share_friend";
            _self.IsOpen = true;
            var h = 355;
            
            var params = "";
            
            if(_defaultType){
                switch(_defaultType){
                    case "q":
                    case "mail":
                    case "mobile":
                    case "friend":
                        ac = "share_friend";
                        break;
                    //快速分享结果显示
                    case "weibo":
                    case "file":
                        ac = "share_file";
                        
                        if(_self.IsAllShare()){
                            ac = "share_file";
                            params = "&is_result=1";
                            Core.SendFileDG.ClearShareCache();
                        }
                        else{
                            if(Core.CONFIG.ImterimShareKey){
                                ac = "imterim_share";
                                params = "&share_type=file";

                                break;
                            }
                        }
                        
                        //confirmBtn.hide();
                        break;
                }
            }
            url = "?ct=share&ac=" + ac + params + "&_t=" + new Date().getTime();
            
            var ifrm = _content.find("[rel='frame']");
            ifrm.attr("src", url);
            ifrm.height(h).parent().height(h);
            
            _content.find("[btn]").unbind("click").bind("click", function(){
                var btnType = $(this).attr("btn");
                switch(btnType){
                    case "confirm":
                        if(_api){
                            _api && _api.Confirm(function(){
                                window.setTimeout(function(){
                                    _self.Close();
                                },0);
                            });
                        }
                        else{
                            _self.Close();
                        }
                        break;
                    case "cancel":
                        _self.Close();
                        break;
                }
                return false;
            })
        }
        
        this.SetButtonValue = function(){
            var confirmBtn = _content.find("[btn='confirm']");
            if(_api){
                if(_api.DialogText){
                    _content.find('[rel="dialog_status"]').html(_api.DialogText);
                }
                else{
                    _content.find('[rel="dialog_status"]').html("");
                }
                
                if(_api.Type){
                    _defaultType = _api.Type;
                    Util.Cookie.set("JS_SD_KEY",_api.Type, 24 * 30 * 3);
                }
                if(_api.ButtonText){
                    confirmBtn.html(_api.ButtonText);
                }
                else{
                    confirmBtn.html("立即分享");
                }
                if(_api.Confirm){
                    confirmBtn.show();
                }
                else{
                    confirmBtn.hide();
                }
            }
        }
    }
    
    return {
        CheckPermission: function(type){
            return true;
        },
        Open: function(list, type){
            if(!_mod){
                _mod = new _model();
            }
            _api = false;
            _list = list;
            
            if(_mod.IsOpen){
                _mod.Close();
            }
            switch(Core.FileConfig.aid){
                case 1:case 2:case 3:case 4:case 5: case 9:
                    _permission = Core.FileMenu.CheckType(Core.FileConfig.aid, Core.FileConfig.cid,list);
                    if(Core.FilePermission.VipExp() && Core.SpaceData.IsNoSpace()){
                        var arr = [];
                        for(var i = 0, len = _permission.length; i < len; i++){
                            if(_permission[i] != "q" && _permission[i] != "weibo"){
                                arr.push(_permission[i]);
                            }
                        }
                        _permission = arr;
                    }
                    break;
                default:
                    _permission = [];
                    
                    if(type == "file" || type == "file_result"){
                        _permission.push("share");
                    }
                    if(Core.FilePermission.VipExp() && Core.SpaceData.IsNoSpace()){
                        _permission.push("send");
                    }
                    else{
                        _permission.push("send");
                        _permission.push("q");
                    }
                    
                    break;
            }
            
            if(Util.Cookie.get("JS_SD_KEY")){
                _defaultType = Util.Cookie.get("JS_SD_KEY");
                if(_defaultType != "file" && _defaultType != "friend"){
                    if($.inArray(_defaultType, _permission) == -1){
                        _defaultType = "file";
                    }
                }
            }
            
            if(_defaultType == "friend"){
                if(list && list.length == 1){
                    var item = list[0];
                    if(item.attr("file_type") == "0" && !Core.FilePermission.Vip()){
                        _defaultType = "file";
                    }
                }
            }
            
            _mod.Open();
        },
        Close: function(){
            if(_mod){
                _mod.Close();
            }
        },
        GetFileList: function(){
            return _list;
        },
        GetPermission: function(){
            return _permission;
        },
        SetAPI: function(api){
            _api = api;
            if(_mod){
                _mod.SetButtonValue();
            }
        },
        GetShareCache: function(){
            return _share_cache;
        },
        ClearShareCache: function(){
            _share_cache = false;
        },
        IsAllShare: function(){
            if(_mod){
                return _mod.IsAllShare();
            }
            return false;
        }
        
    }
})();


Core.SendFileResult = (function(){
    var _mod, _doHandler;
    
    var mod = function(){
        var _content = $('<div class="share-result"><dl></dl></div>'), _self = this;
        var _top = Util.Override(Core.DialogBase, _self, {
            Show: function(arr){
                _top.Open();
                
                
                var dl = _content.find("dl");
                
                dl.html("");
                
                var html = [];
                html.push('<dt><span>好友</span><em>操作结果</em></dt>');
                
                for(var i = 0, len = arr.length; i < len; i++){
                    var item = arr[i];
                    html.push('<dd><span>'+item.text+'</span>'+item.result+'</dd>')
                }
                
                dl.html(html.join(""));
                
            }
        }, {
            content: _content, 
            title: "分享结果"
        });
    }
    
    return {
        Open: function(arr){
            if(!_mod){
                _mod = new mod();
            }
            _mod.Show(arr);
        }
    }
})();
Core.FriendDG = (function(){
    
    return {
        Add: function(){
            Core.FrameDG.Open(Core.CONFIG.Path.My + '/?ct=friend&ac=search&v=2.0', {
                title: '添加好友', height: 90,
                ready: function(win){
                    win['SET_HEIGHT'] = function(h){
                        Core.FrameDG.Reset(false, h);
                    }
                }
            });
            /*Core.FrameDG.Open(
                Core.CONFIG.Path.My + '/?ct=friend&ac=search', {
                    width:700, 
                    height:500, 
                    title:'添加好友'
                }
            );*/
        }
    }
})();

/*
 * 结果显示
 **/
Core.FileResultDG = (function(){
    var _model;
    
    var showBtn = function(opt){
        var gotoBtn = _model.warp.find("[btn='goto']");
                
        if(opt["aid"]){
            gotoBtn.show();
            if(opt["cid"] == undefined){
                opt["cid"] = 0;
            }
            
            gotoBtn.off("click").on("click", function(){
                if(window['PageCTL'] && window.location.host == document.domain){
                    PageCTL.GOTO(opt["aid"], opt["cid"]);
                    window.setTimeout(function(){
                        _model.Close();
                        Core.OnlyFrame.Close();
                    },1);
                    return false;
                }
                else{
                    $(this).attr('href', PAGE_PATHS.U + '?ac=goto_dir&aid=' + opt.aid + '&cid=' + opt['cid']).attr('target', '_blank');
                    window.setTimeout(function(){
                        _model.Close();
                        Core.OnlyFrame.Close();
                    },1);
                    return true;
                }
            });
            

            window.setTimeout(function(){
                gotoBtn.focus();
                Core.FileConfig && Core.FileConfig.DataAPI && Core.FileConfig.DataAPI.Reload(opt['aid'], opt['cid']);
            }, 800);
        }
        else{
            gotoBtn.hide();
            if(opt.is_msg){
                var key = 'API_GET_MSG_ID_' + new Date().getTime();
                $.getScript(PAGE_PATHS['U'] + '/?ct=msg&ac=get_id&js_return=' + key, function(){
                    var r = window[key];
                    if(r){
                        opt["aid"] = 1;
                        opt["cid"] = r.cid;
                        showBtn(opt);
                    }
                });
            }
        }

    }
    
    return {
        Show: function(list, opt){
            if(!_model){
                var _content = $('<dl class="file-copy" rel="con"></dl>'+
                    '<div class="dialog-bottom">'+
                    '<div class="con">'+
                        '<a href="javascript:;" class="button" btn="goto" style="display:none;">打开文件目录</a>'+
                    '</div>' +
                    '</div>');
                _model = new Core.DialogBase({
                    title: '结果', 
                    content: _content
                });
            }
            
            if(!opt){
                opt = {};            
            }
            if(!opt["name"]) opt["name"] = "file_name";
            if(!opt["msg"]) opt["msg"] = "msg";
            
            _model.Open(function(){
                var closeBtn = _model.warp.find("[btn='close_btn']");
                closeBtn.off("click").on("click", function(){
                    _model.Close();
                    return false;
                });		
                var html = [];
                for(var k in list){
                    var item = list[k];
                    var fileName = item[opt["name"]];
                    var result = item.state? '<em>成功</em>' : item[opt["msg"]];
                    html.push('<dd ' + (!item.state? 'class="err" title="' + item[opt["msg"]] + '"' : "") + '><ul><li class="file-name" style="width:310px;">' + fileName + '</li><li class="file-rate" style="width:170px;">' + result + '</li></ul></dd>')
                }
                _model.warp.find("[rel='con']").html('<dt><ul><li class="file-name" style="width:310px;">文件名</li><li class="file-rate" style="width:170px;">操作结果</li></ul></dt>' + html.join(""));
                
                _model.warp.find("[btn='cancel']").off("click").on("click", function(){
                    _model.Close();
                    return false;
                })
                showBtn(opt);
            });
        }
    }
})();

Core.TreeWin = (function(){
    return {
        Show: function(callback){
            Core.FileSelectDG.Open(function(list){
                if(list.length){
                    var item = list[0];
                    var aid = item.aid, cid = item.cid;
                    callback && callback(aid, cid);
                }
            }, {
                select: 1,
                nf: 1,
                btn_txt: '接收到这里',
                select_txt: '接收'
                
            });
        },
        Hide: function(){
            Core.FileSelectDG.Close();
        }
    };
})();


/*目录选择对话框*/
Core.TreeDG = (function(){
    var _cache = {};
	
    return {
        Show: function(obj){
            if(!obj.list || !obj.list.length){
                Core.MinMessage.Show({
                    text: "请选择文件", 
                    timeout: Core.CONFIG.MsgTimeout
                });
                return;
            }
            _cache.setting = obj;
            var type = _cache.setting.type;
            var arr = obj.list;
            var isDir = obj.has_dir;
            
            var tid = [];
            var dir = [];
            for(var i = 0, len = arr.length; i < len; i++){
                if(arr[i].attr("file_type") == "1"){
                    tid.push(arr[i].attr("file_id"));
                }
                else{
                    dir.push(arr[i].attr("cate_id"));
                }
            }
            _cache.list = tid;
            _cache.dir_list = dir;
            
            _cache.doms = arr;
            Core.FileSelectDG.Open(function(list, is_copy){
                if(list.length){
                    var item = list[0];
                    var aid = item.aid, cid = item.cid;
                    _cache.aid = aid;
                    _cache.cid = cid;
                    if(is_copy == undefined){
                        is_copy = false;
                    }
                    _cache.is_copy = is_copy;
                    
                    
                    var data = {
                        pid: _cache.cid
                    };
                    
                    if(_cache.is_copy){
                        data.copy = 1;
                    }
                    
                    var ind = 0;
                    for(var i = 0, len = _cache.list.length; i < len; i++){
                        
                        data['fid['+ind+']'] = _cache.list[i];
                        ind++;
                    }
                    
                    for(var i = 0, len = _cache.dir_list.length; i < len; i++){
                        data['fid['+ind+']'] = _cache.dir_list[i];
                        ind++
                    }
                    
                    if(isDir){
                        var paths = Core.FileSelectDG.GetBackPaths();
                        if(paths){
                            var res = true;
                            for(var i = 0, len = paths.length; i < len; i++){
                                var item = paths[i];
                                for(var j = 0, jlen = _cache.doms.length; j < jlen; j++){
                                    var node = _cache.doms[j];
                                    if(node.attr("file_type") == "0"){
                                        var form_aid = node.attr("area_id");
                                        var form_cid = node.attr("cate_id");
                                        if(Number(form_aid) == Number(item.aid) && form_cid == item.cid){
                                            res = false;
                                        }
                                    }
                                }
                            }
                            if(!res){
                                Core.MinMessage.Show({ 
                                    text: "文件夹不能移动到子目录里", 
                                    type: "war",
                                    timeout: Core.CONFIG.MsgTimeout
                                });
                                return false;
                            }
                        }
                    }
                    
                    UA$.ajax({
                        url: "/files/move",
                        type: "POST",
                        data: data,
                        dataType: "json",
                        success: function(r){
                            if(r.state){
                                if(!_cache.is_copy){
                                    try{
                                        if(Core.FileConfig.DataAPI) Core.FileConfig.DataAPI.Reload(Core.FileConfig.aid, Core.FileConfig.cid);
                                        window.setTimeout(function(){
                                            Core.MinMessage.Show({
                                                text: "成功转移文件",
                                                type: "suc",
                                                timeout: Core.CONFIG.MsgTimeout
                                            });
                                        }, 500);
                                    }catch(e){}
                                }
                                else{
                                    
                                    try{
                                        if(Core.FileConfig.DataAPI) Core.FileConfig.DataAPI.Reload(Core.FileConfig.aid, Core.FileConfig.cid);
                                        window.setTimeout(function(){
                                            Core.MinMessage.Show({
                                                text: "成功复制文件",
                                                type: "suc",
                                                timeout: Core.CONFIG.MsgTimeout
                                            });
                                        }, 500);
                                    }catch(e){}
                                }
                            }
                            else{
                                Core.MinMessage.Show({
                                    text: r.error,
                                    type: "err",
                                    timeout: Core.CONFIG.MsgTimeout
                                });
                            }
                        }
                    })
                }
            }, {
                select: 1,
                nf: 1,
                show_copy: !isDir?1:0
            });
        }
    }
})();Core.RBSettingDG = (function(){
    var _mod;

    var mod = function(){
        var _self = this, _active = false;

        var _content = $('<div class="hint-box" rel="msg_box">此项功能是115公司为您的网盘数据安全做的特别保障，我们不建议您关闭！</div>' +
                            '<dl class="offline-download-link" style="width:400px;padding-top:20px;">' +
                                '<dd style="height:50px;">' +
                                    '<input type="radio" name="p" id="js_rb_set_1" value="1" checked /><label for="js_rb_set_1" style="cursor:pointer;position:static;color:#000;">高级保护</label>'+
                                    '<span style="color:#999999">(永久删除文件操作需要验证安全密钥)</span>' +
                                '</dd>' +
                                '<dd style="height:80px;">' +
                                    '<em style="display:inline-block;text-align:right;width:62px;">安全密钥：</em>'+
                                    '<input type="password" rel="pwd" class="text" style="position:static;width: 220px;" />' +
                                '</dd>' +
                            '</dl>' +
                        '<div class="dialog-bottom">'+
                            '<div class="con">'+
                                '<a href="javascript:;" class="button" btn="confirm">确定</a>'+
                                '<a href="javascript:;" class="btn-link" btn="cancel">取消</a>'+
                            '</div>'+
                        '</div>');

        this.RBSetting = false;

        this.Questions = false;

        var changeQues = function(){
            if(_active === false){
                _active = 0;
            }
            else{
                _active++;
                if(_active >= _self.Questions.length){
                    _active = 0;
                }
            }

            var ques = _self.Questions[_active];

            var txt = _self.warp.find('[rel="ques_text"]');

            txt.html(ques);

            window.setTimeout(function(){
                _self.warp.find("[rel='ques_text_box']").focus();
            },100);
        }

        var save = function(){
            var pwd = _self.warp.find('[rel="pwd"]');
            var _safe_mode = _self.RBSetting.SafeMode?0:1;
            var data = {
                recycle_pass: pwd.val(),
                safe_mode:_safe_mode
            };
            if(!data.recycle_pass){
                Core.MinMessage.Show({text: "请输入安全密钥", type: "war", timeout:2000});
                pwd.focus();
                return false;
            }
            $.ajax({
                url: "?ct=rb&ac=safe_mode",
                data: data,
                type: "POST",
                dataType: "json",
                success: function(r){
                    if(r.state){
                        pwd.val("");
                        _self.Close();
                        if(Core.FileConfig.DataAPI) Core.FileConfig.DataAPI.Refresh();
                        if(_safe_mode == 1){
                            Core.Message.Alert({
                                text: "设置成功！",
                                content: "您设置了高级保护模式，删除文件后到回收站操作均需验证安全密钥，全方位防止误删。",
                                type: "suc",
                                confirm_text: "确定"
                            });
                        }else{
                            Core.Message.Alert({
                                text: "设置成功！",
                                content: "您关闭了高级保护模式，删除文件后到回收站操作无需验证安全密钥。",
                                type: "suc",
                                confirm_text: "确定"
                            })
                        }
                    }
                    else{
                        Core.MinMessage.Show({text: r.message, type: r.errtype || "err", timeout:2000});
                        pwd.focus();
                    }
                }
            });
        }

        var _top = Util.Override(Core.DialogBase, _self, {
            Initial: function(){

                _self.warp.find('[rel="pwd"]').on("keyup", function(e){
                    if(e.keyCode == 13){
                        save();
                        return false;
                    }
                })

                _self.warp.find("[btn='confirm']").on("click", function(){
                    save();
                    return false;
                });
                
                _self.warp.find("[btn='cancel']").on("click", function(){
                    _self.Close();
                    return false;
                });

                _self.warp.find('[rel="change_link"]').on("click", function(){
                    changeQues();
                    return;
                })
            },
            Open: function(){
                if(_self.RBSetting){
                    _self.Questions = _self.RBSetting.SafeAQ;
                    _top.Open(function(){
                        var val = _self.RBSetting.SafeMode ? 1: 0;
                        var label = _self.warp.find('label[for="js_rb_set_1"]');
                        if(val){
                            label.html("关闭高级保护");
                            label.next().html("(请三思而后行：一旦关闭，今后您的回收站内容在操作删除或清空时将不再接受安全验证！)");
                        }
                        else{
                            label.html("开启高级保护");
                            label.next().html("(强烈建议开启：一旦开启，今后您的回收站内容在操作删除或清空时将要安全验证！)");
                        }

                        _content.find("#js_rb_set_1").attr("checked", val);
                    });
                }
                else{
                    Core.Minmessage.Show({text: "保护设置暂停使用", type: "war", timeout:2000});
                }
            },
            Close: function(){
                _self.RBSetting = false;
                _self.warp.find('[rel="ques_text_box"]').val("");
                _top.Close();
            }
        },{
            content: _content,
            title: '保护设置',
            width: 450
        });

    }


    return {
        Show: function(setting){
            if(!setting.HasPass){
                Core.Message.Confirm({
                    text: "您没有设置安全密钥!",
                    type: "war",
                    confirm_text: "马上设置",
                    confirm_link: Core.CONFIG.Path.U + '/?nav=safe&child=user&mode=my_set&type=superpwd'
                });
                return;
            }

            if(!_mod){
                _mod = new mod();
            }
            _mod.RBSetting = setting;
            _mod.Open();
        }
    }
})();;
(function(){
    
    
    var gift = Core.Gift = (function(){
        //修改礼包分类
        var modifyCate = function(mod, callback){
            var editCon = $('<div class="dialog-input">'+
                '<input type="text" rel="txt" class="text" maxlength="15" />'+
                '</div>'+
                '<div class="dialog-bottom">'+
                '<div class="con">'+
                '<a href="javascript:;" class="button" btn="confirm">确定</a>'+
                '<a href="javascript:;" class="btn-link" btn="cancel">取消</a>'+
                '</div></div>');
            var editBox = new Core.DialogBase({
                title: '重命名礼包分类',
                content: editCon
            });

            editBox.Open();
            
            editCon.find("[rel='txt']").val(mod.name);

            var renameFolderFun = function(){
                var val = $.trim(editCon.find('[rel="txt"]').val());
                
                if(!val){
                    Core.MinMessage.Show({
                        text: '请输入分类名称',
                        type: 'war', 
                        timeout: 2000
                    });
                    return false;
                }
                else if(val.length > 15){
                    Core.MinMessage.Show({
                        text: '分类名称不能大于15个字符',
                        type: 'war', 
                        timeout: 2000
                    });
                    return false;
                }
                $.ajax({
                    url: '/?ct=filegift&ac=category_modify',
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        name:  val,
                        cid: mod.cid
                    },
                    success: function(r){
                        if(r.state){
                            Core.MinMessage.Show({
                                text: '重命名礼包分类',
                                type: 'suc', 
                                timeout: 2000
                            });
                            callback && callback(val);
                            editBox.Close();
                        }
                        else{
                            Core.MinMessage.Show({
                                text: r.message,
                                type: r.errtype || 'err',
                                timeout: 2000
                            });
                        }
                    }
                });
            }

            editCon.find("[rel='txt']").bind("keydown",  function(e){
                if(e.keyCode == 13){
                    renameFolderFun(e);
                    return false;
                }
                else if(e.keyCode == 27){
                    editBox.Close();
                    return false;
                }
            })

            editCon.find("[btn]").bind("click", function(e){
                switch($(this).attr("btn")){
                    case "confirm":
                        renameFolderFun(e);
                        break;
                    case "cancel":
                        editBox.Close();
                        break;
                }
                return false;
            })

            editCon.find("[rel='txt']")[0].focus();
            window.setTimeout(function(){
                editCon.find("[rel='txt']")[0].select();
            },20);
        }
        
        var addCate = function(callback){
            var addCon = $('<div class="dialog-input">'+
                '<input type="text" rel="txt" class="text" maxlength="15" />'+
                '</div>'+
                '<div class="dialog-bottom">'+
                '<div class="con">'+
                '<a href="javascript:;" class="button" btn="confirm">确定</a>'+
                '<a href="javascript:;" class="btn-link" btn="cancel">取消</a>'+
                '</div></div>');
            var createBox = new Core.DialogBase({
                title: '新建礼包分类',
                content: addCon
            });
            
            createBox.Open(null);
            
            var addCateFun = function(e){
                var val = $.trim(addCon.find('[rel="txt"]').val());
                
                if(!val){
                    Core.MinMessage.Show({
                        text: '请输入分类名称',
                        type: 'war', 
                        timeout: 2000
                    });
                    return false;
                }
                else if(val.length > 15){
                    Core.MinMessage.Show({
                        text: '分类名称不能大于15个字符',
                        type: 'war', 
                        timeout: 2000
                    });
                    return false;
                }
                $.ajax({
                    url: '/?ct=filegift&ac=category_add',
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        name:  val
                    },
                    success: function(r){
                        if(r.state){
                            Core.MinMessage.Show({
                                text: '成功创建礼包分类',
                                type: 'suc', 
                                timeout: 2000
                            });
                            callback && callback(r);
                            createBox.Close();
                        }
                        else{
                            Core.MinMessage.Show({
                                text: r.message,
                                type: r.errtype || 'err',
                                timeout: 2000
                            });
                        }
                    }
                });
            }

            addCon.find("[rel='txt']").bind("keydown", function(e){
                if(e.keyCode == 13){
                    Util.Html.StopPropagation(e);
                    addCateFun(e);
                    return false;
                }
                else if(e.keyCode == 27){
                    createBox.Close();
                    return false;
                }
            })

            addCon.find("[btn]").bind("click", function(e){
                switch($(this).attr("btn")){
                    case "confirm":
                        //新建礼包分类
                        addCateFun(e);
                        break;
                    case "cancel":
                        createBox.Close();
                        break;
                }
                return false;
            })
            addCon.find("[rel='txt']")[0].focus();
        }
        
        var _cateBox, _cateList, _mcateBox;
        //获取分类列表
        var getList = function(callback, notAdd){
            if(!_cateList){
                $.ajax({
                    url: '/?ct=filegift&ac=category_ls',
                    type: 'GET',
                    dataType: 'json',
                    success: function(r){
                        _cateList = r.data;
                        if(!_cateList){
                            if(!notAdd){
                                addCate(function(){
                                    getList(callback);
                                });
                            }
                            else{
                                callback && callback(_cateList);
                            }
                        }
                        else{
                            callback && callback(_cateList);
                        }
                    }
                })
            }
            else{
                callback && callback(_cateList);
            }
        }
        
        var delCate = function(cate_id, callback){
            $.ajax({
                url: '/?ct=filegift&ac=category_delete',
                data: {
                    cids: cate_id
                },
                type: 'POST',
                dataType: 'json',
                success: function(r){
                    if(r.state){
                        if(Core.FileConfig.aid == 91){
                            Core.FileConfig.DataAPI && Core.FileConfig.DataAPI.Reload();
                        }
                        callback && callback();
                        _cateList = false;
                        getList(function(){}, true);
                    }
                    else{
                        Core.MinMessage.Show({
                            text: r.message, 
                            type: r.errtype || 'err',
                            timeout: 2000
                        })
                    }
                }
            })
        }
        
        var mcateBox = function(){
            var _self = this,
            _content = $('<div class="dg-sort">'+
                '<ul rel="list_box"></ul>'+
                '</div>'+
                '<div class="dialog-bottom">'+
                '<div class="dialog-status"><a href="javascript:;" class="dgsort-add" btn="add"><s></s><span>添加分类</span></a></div>'+
                '<div class="con">'+
                '<a href="javascript:;" class="button btn-gray" btn="cancel">关闭</a>'+
                '</div>'+
                '</div>');
            
            var showList = function(){
                var listBox = _self.warp.find('[rel="list_box"]');
                listBox.html('');
                if(_cateList && _cateList.length){
                    var html = [];
                    for(var i = 0, len = _cateList.length; i < len; i++){
                        var item = _cateList[i];
                        if($.inArray(Number(item.cid), [1, 2]) == -1){
                        html.push(String.formatmodel('<li cate_id="{cid}">'+
                            '<span>{name}</span> '+
                            '<em>'+
                            '<a btn="modify" href="javascript:;" class="icon isort-rename"></a>'+
                            '<a btn="del" href="javascript:;" class="icon isort-remove"></a>'+
                            '</em>'+
                            '</li>', item));
                        }
                    }
                    listBox.html(html.join(''));
                }
            }
            var t = Util.Override(Core.DialogBase, _self, {
                Initial: function(){
                    _self.warp.delegate('[btn]', 'click', function(){
                        var el = $(this);
                        switch(el.attr('btn')){
                            case 'add':
                                addCate(function(){
                                    //update
                                    _cateList = false;
                                    getList(function(){
                                        showList();
                                    });
                                });
                                break;
                            case 'cancel':
                                _self.Close();
                                break;
                        }
                        return false;
                    });
                    _self.warp.find('[rel="list_box"]').delegate('li', 'click', function(){
                        var el = $(this);
                        selCate(el.attr('cate_id'));
                        return false;
                    }).delegate('[btn]', 'click', function(){
                        var el = $(this);
                        switch(el.attr('btn')){
                            case 'modify':
                                var li = el.parents('[cate_id]');
                                var cid = li.attr('cate_id');
                                modifyCate({
                                    cid: cid,
                                    name: li.find('span').html()
                                }, function(val){
                                    li.find('span').html(val);
                                    _cateList = false;
                                    getList(function(){
                                        
                                        });
                                });
                                break;
                            case 'del':
                                var li = el.parents('[cate_id]');
                                var cid = li.attr('cate_id');
                                delCate(cid, function(){
                                    if(li.parent().children().length == 1){
                                        _self.Close();
                                    }
                                    else{
                                        li.empty().remove();
                                    }
                                    
                                });
                                break;
                        }
                        return false;
                    });
                },
                Show: function(){
                    getList(function(){
                        t.Open(function(){
                            showList();
                        });
                    });
                }
            },{
                content: _content,
                title: '管理礼包分类'
            });
        }
        
        //选择分类
        var cateBox = function(){
            var _self = this, _cacheList, _oldSelCid,
            _content = $('<div class="dg-sort">'+
                '<ul rel="list_box"></ul>'+
                '</div>'+
                '<div class="dialog-bottom">'+
                '<div class="dialog-status"><a href="javascript:;" class="dgsort-add" btn="add"><s></s><span>添加分类</span></a></div>'+
                '<div class="con">'+
                '<a href="javascript:;" class="button" btn="confirm">确定</a>'+
                '<a href="javascript:;" class="btn-link" btn="cancel">取消</a>'+
                '</div>'+
                '</div>');
            
            var showList = function(){
                var listBox = _self.warp.find('[rel="list_box"]');
                listBox.html('');
                if(_cateList && _cateList.length){
                    var html = [];
                    for(var i = 0, len = _cateList.length; i < len; i++){
                        var item = _cateList[i];
                        if($.inArray(Number(item.cid), [1, 2]) == -1){
                            html.push(String.formatmodel('<li cate_id="{cid}">'+
                                '<span>{name}</span> '+
                                '<em>'+
                                '<a btn="modify" href="javascript:;" class="icon isort-rename"></a>'+
                                '<a btn="del" href="javascript:;" class="icon isort-remove"></a>'+
                                '</em>'+
                                '</li>', item));
                        }
                        
                    }
                    listBox.html(html.join(''));
                }
            }
            
            var selCate = function(cid){
                _oldSelCid = cid;
                var listBox = _self.warp.find('[rel="list_box"]');
                listBox.find('.selected').removeClass('selected');
                listBox.find('[cate_id="'+cid+'"]').addClass('selected');
            }
            
            
            
            var t = Util.Override(Core.DialogBase, _self, {
                Initial: function(){
                    _self.warp.on('click', function(){
                        return false;
                    });
                    _self.warp.delegate('[btn]', 'click', function(){
                        var el = $(this);
                        switch(el.attr('btn')){
                            case 'add':
                                addCate(function(r){
                                    Util.log(r);
                                    //update
                                    _cateList = false;
                                    getList(function(){
                                        showList();
                                        if(r.state && r.cid){
                                            selCate(r.cid);
                                        }
                                    });
                                });
                                break;
                            case 'confirm':
                                var listBox = _self.warp.find('[rel="list_box"]');
                                var li = listBox.find('.selected');
                                if(li.length){
                                    var cid = li.attr('cate_id');
                                    if(_cacheList){
                                        var giftCode = [];
                                        for(var i = 0, len = _cacheList.length; i < len; i++){
                                            var item = _cacheList[i];
                                            giftCode.push(item.attr('code'));
                                        }
                                        
                                        $.ajax({
                                            url: '/?ct=filegift&ac=gift_add_category',
                                            data: {
                                                cid:cid,
                                                gift_code: giftCode.join(',')
                                            },
                                            type: 'POST',
                                            success: function(r){
                                                if(r.state){
                                                    Core.FileConfig.DataAPI && Core.FileConfig.DataAPI.Reload();
                                                    _self.Close();
                                                }
                                                else{
                                                    Core.MinMessage.Show({
                                                        text: r.message,
                                                        type: r.errtype || 'err',
                                                        timeout: 2000
                                                    });
                                                }
                                            }
                                        })
                                        
                                    }
                                    else{
                                        Core.MinMessage.Show({
                                            text: '请选择礼包',
                                            type: 'war',
                                            timeout: 2000
                                        });
                                    }
                                }
                                else{
                                    Core.MinMessage.Show({
                                        text: '请选择礼包分类',
                                        type: 'war',
                                        timeout: 2000
                                    });
                                }
                                break;
                            case 'cancel':
                                _self.Close();
                                break;
                        }
                        return false;
                    });
                    _self.warp.find('[rel="list_box"]').delegate('li', 'click', function(){
                        var el = $(this);
                        selCate(el.attr('cate_id'));
                        return false;
                    }).delegate('[btn]', 'click', function(){
                        var el = $(this);
                        switch(el.attr('btn')){
                            case 'modify':
                                var li = el.parents('[cate_id]');
                                var cid = li.attr('cate_id');
                                modifyCate({
                                    cid: cid,
                                    name: li.find('span').html()
                                }, function(val){
                                    li.find('span').html(val);
                                    _cateList = false;
                                    getList(function(){
                                        });
                                });
                                break;
                            case 'del':
                                var li = el.parents('[cate_id]');
                                var cid = li.attr('cate_id');
                                delCate(cid, function(){
                                    if(li.parent().children().length == 1){
                                        _self.Close();
                                    }
                                    else{
                                        li.empty().remove();
                                    }
                                });
                                break;
                        }
                        return false;
                    });
                },
                Show: function(list){
                    _cacheList = list;
                    getList(function(){
                        t.Open(function(){
                            showList();
                            var listBox = _self.warp.find('[rel="list_box"]');
                            selCate(_oldSelCid);
                            if(!listBox.find('.selected').length){
                                selCate(listBox.find('li:first').attr('cate_id'));
                            }
                            
                        });
                    });
                }
            },{
                content: _content,
                title: '选择礼包分类'
            });
        }
        
        
        var _detailBox;
        var detailBox = function(){
            var _self = this,
            _content = $('<div class="bt-file-list pickcode-file" style="margin-bottom:30px;">'+
                '<div class="bt-file-title">'+
                '<div class="file-name">文件名称 / 文件夹名称</div>'+
                '<div class="file-size">类型</div>'+
                '</div>'+
                '<ul rel="list"></ul>'+
                '</div>');
             
            var t = Util.Override(Core.DialogBase, _self, {
                Show: function(list){
                    t.Open(function(){
                        var html = [];
                        for(var i = 0, len = list.length; i < len; i++){
                            var item = list[i];
                            if(item.file_id){
                                item.file_size = Util.File.ShowSize(item.file_size, 1);
                                html.push(String.formatmodel('<li>'+
                                    '<div class="file-name">{file_name}</div>'+
                                    '<div class="file-size" style="width:120px;">文件 ({file_size})</div>'+
                                    '</li>', item));
                            }
                            else{
                                html.push(String.formatmodel('<li>'+
                                    '<div class="file-name">{name}</div>'+
                                    '<div class="file-size">文件夹</div>'+
                                    '</li>', item));
                            }
                        }
                        _content.find('[rel="list"]').html(html.join(''));
                    });
                }
            },{
                content: _content,
                title: '礼包内容'
            });
        }
        
        var changeDescData = function(code, desc, callback){
            $.ajax({
                url: '/?ct=filegift&ac=update_remark',
                type: 'POST', 
                dataType: 'json', 
                data: {
                    gift_code: code, 
                    remark: desc
                },
                success: function(r){    
                    callback && callback(r);
                }
            })
        }
        
        var editDesc = function(code, oldRmark, callback){
            if(!oldRmark){
                oldRmark = '';
            }
            var editCon = $('<div class="dialog-input">'+
                '<input type="text" rel="txt" class="text" maxlength="50" />'+
                '</div>'+
                '<div class="dialog-bottom">'+
                '<div class="con">'+
                '<a href="javascript:;" class="button" btn="confirm">确定</a>'+
                '<a href="javascript:;" class="btn-link" btn="cancel">取消</a>'+
                '</div></div>');
            var editBox = new Core.DialogBase({
                title: '重命名礼包',
                content: editCon
            });

            editBox.Open();
            
            var textBox = editCon.find("[rel='txt']");
            textBox.val(oldRmark);

            var renameFolderFun = function(e){
                var desc = $.trim(textBox.val());
                if(desc != ''){
                    if(desc.length > 50){
                        Core.MinMessage.Show({
                            text: '礼包备注最多只能包含50个字', 
                            type: 'war', 
                            timeout: 2000
                        });
                        textBox.focus();
                        return false;
                    }
                    
                    Core.MinMessage.Show({
                        text: '正在修改重命名礼包...', 
                        type: 'load', 
                        timeout: 10000
                    });
                    
                    changeDescData(code, desc, function(r){
                        if(r.state){
                            desc = Util.Text.htmlspecialchars(desc);
                            callback && callback(code, desc);
                            editBox.Close();
                            Core.MinMessage.Show({
                                text: '重命名成功', 
                                type: 'suc', 
                                timeout: 2000
                            });
                        }
                        else{
                            Core.MinMessage.Show({
                                text: r.message, 
                                type: r.errtype || 'err',
                                timeout: 2000
                            });
                            textBox.focus();
                        }
                    });
                }
                else{
                    callback && callback(code, desc);
                }
            }

            editCon.find("[rel='txt']").bind("keydown", function(e){
                if(e.keyCode == 13){
                    renameFolderFun(e);
                }
                else if(e.keyCode == 27){
                    editBox.Close();
                }
            })

            editCon.find("[btn]").bind("click", function(e){
                switch($(this).attr("btn")){
                    case "confirm":
                        renameFolderFun(e);
                        break;
                    case "cancel":
                        editBox.Close();
                        break;
                }
                return false;
            })

            textBox.focus();
            window.setTimeout(function(){
                textBox.select();
            },20);
        }
        
        var _cateMenuBox;
        
        return {
            EditDesc: function(code, oldRmark, callback){
                editDesc(code, oldRmark, callback);
            },
            GotoGift: function(win){
                win.location.href = "/?ct=filegift&ac=manage";
            },
            GetList: function(callback, notAdd){
                getList(callback, notAdd);
            },
            Show: function(code){
                if(code){
                    $.ajax({
                        url: '/?ct=filegift&ac=show_files&gift_code=' + code,
                        cache: false,
                        dataType: 'json',
                        type: 'GET',
                        success: function(r){
                            if(r.state && r.data && r.data.length){
                                if(!_detailBox){
                                    _detailBox = new detailBox();
                                }
                                
                                _detailBox.Show(r.data);
                            }
                            else{
                                Core.MinMessage.Show({
                                    text: '礼包内没有文件', 
                                    type: 'war', 
                                    timeout: 2000
                                });
                            }
                        }
                    });
                }
            },
            ManageCate: function(){
                if(!_mcateBox){
                    _mcateBox = new mcateBox();
                }
                _mcateBox.Show();
            },
            SelectCate: function(list){
                if(!_cateBox){
                    _cateBox = new cateBox();
                }
                _cateBox.Show(list);
            },
            BindMenu: function(ele, category){
                var timer;
                if(category){
                    getList(function(list){
                        var cateName = '全部礼包';
                        for(var k in list){
                            if(list[k]['cid'] == category){
                                cateName = list[k]['name'];
                                break;
                            }
                        }
                        ele.html('<span>' + cateName + '</span><s></s>');
                        
                    });
                }
                if(_cateMenuBox){
                    _cateMenuBox.hide();
                }
                ele.on('mouseleave', function(){
                    if(timer) window.clearTimeout(timer);
                }).on('mouseover', function(){
                    if(timer) window.clearTimeout(timer);
                    timer = window.setTimeout(function(){
                        
                        //_hide_status
                        ele.attr('hide_status', '0');
                        var st = {
                            Title: ele,
                            IsOverShow: true,
                            ShowHandler: function(){
                                var t = this.Title.offset().top + this.Title.height() + 3;
                                var l = this.Title.offset().left;
                                _cateMenuBox && _cateMenuBox.css({
                                    top: t, 
                                    left:l
                                });
                                getList(function(list){
                                    var html = [];
                                    html.push('<ul>');
                                    html.push('<li><a style="padding-left: 10px;" menu="gift_category" href="javascript:;" category=""><span>全部礼包</span></a></li>');
                                    if(list && list.length){
                                        for(var i = 0, len = list.length; i < len; i++){
                                            var item = list[i];
                                            
                                            html.push(String.formatmodel('<li><a style="padding-left: 10px;overflow:hidden;" menu="gift_category" href="javascript:;" category="{cid}" ><span>{name}</span></a></li>', item));
                                            
                                        }
                                    }
                                    html.push('</ul>');
                                    _cateMenuBox.html('');
                                    _cateMenuBox.html(html.join(''));
                                    _cateMenuBox.append('<ul><li><a style="padding-left: 10px;" menu="gift_category_manage" href="javascript:;" category=""><span>管理礼包分类</span></a></li></ul>');
                                }, true);
                                    
                            }
                        };
                        if(!_cateMenuBox){
                            _cateMenuBox = $('<div class="context-menu" style="z-index:99999;"></div>');
                            $(document.body).append(_cateMenuBox);
                            Ext.CACHE.FileMain.Events.Bind(_cateMenuBox);
                        }
                        st.ShowHandler();
                        st.Content = _cateMenuBox;
                        ele.off('mouseover');
                        ele.off('mouseleave');
                        Util.DropDown.Bind(st);
                        st.Content.show();
                        
                    }, 200);
                })
            }
        }
        
    })();
})();


;
(function(){
    var FontCheck = function(textArea, fontCount){
        var _textArea = textArea, 
        _self = this, 
        _maxCount = 300, _fontCount = fontCount;
    
        this.GetCount = function(){
            var val = _textArea.val();
            val = val.replace(/[^\x00-\xff]/ig,"xx");

            var count = val.length;
            var lesscount = Math.floor((_maxCount - count)/2);
            return lesscount;
        }
    
        this.CheckCount = function(){
            var lesscount = _self.GetCount();
            var fontCount = _fontCount;
            if(lesscount >= 0){
                fontCount.html('还可以输入' + lesscount + '字');
                fontCount.css({
                    width:'34px'
                });
            }
            else{
                fontCount.css({
                    width:'90px'
                });
                fontCount.html("<b>已超出 " + Math.abs(lesscount) + " 字</b>");
            }
        }
    }
    
    var _list;
    
    var dipan = Core.ShareDipan = (function(){
        
        
        var mod = function(){
            /*
             
             **/
            var _content = $('<div class="dialog-input">'+
                '<label for="">发言请遵守115服务协议，<span rel="font_count">还可以输入150字</span></label>'+
                '<textarea name="" id=""></textarea>'+
                '</div>'+
                '<div class="dialog-bottom">'+
                '<div class="con"><a href="javascript:;" class="button" btn="confirm">确定</a></div>'+
                '<div class="dialog-file-info" style="display:none;">'+
                '<i class="file-type tp-folder"></i>'+
                '<span>XXXX等4个文件夹和1个文件 共15G</span>'+
                '</div>'+
                '</div>');
            
            var _self = this, _textArea, _fontCount, _check;
            
            var postFeed = function(data, callback){
                $.ajax({
                    url: '/zone/feed/?ct=feed&ac=add',
                    data: data,
                    dataType: 'json',
                    type: 'POST',
                    success: function(r){
                        callback && callback(r);
                    }
                });
            }
            
            var postData = function(){
                var textArea = _textArea;
                var msg = '';
                var data = {};
                var isPic = false;
                if(_list.length == 1){
                    var itemNode = _list[0];
                    if(itemNode.attr('file_type') == '1' && Number(Core.FileAPI.CheckFileType(itemNode) == 3)){
                        isPic = true;
                        var pics = [];
                        pics.push({
                            n: itemNode.find('[field="file_name"]').attr('title'),
                            p: itemNode.attr('pick_code'),
                            s: itemNode.attr('file_size'),
                            sh: itemNode.attr('sha1')
                        });
                        if(pics.length){
                            data.i = pics;
                        }
                        msg = '分享照片';
                    }
                }
                
                if(!isPic){
                    var files = [];
                    for(var i = 0, len = _list.length; i < len; i++){
                        var item = _list[i];
                        if(item.attr('file_type') == '1'){
                            files.push({
                                n: item.find('[field="file_name"]').attr('title'),
                                p: item.attr('pick_code'),
                                s: item.attr('file_size'),
                                is_f: 0
                            });
                        }
                        else{
                            files.push({
                                n: item.attr('cate_name'),
                                p: item.attr('pick_code'),
                                s: '',
                                is_f: 1
                            });
                        }
                        msg = '分享文件';
                    }
                    if(files.length){
                        data.f = files;
                    }
                }
                
                var val = $.trim(textArea.val());
                data.c = Util.Text.htmlspecialchars(val);
                
                
                //验证数据
                if(data.c == ''){
                    data.c = msg;
                }
                
                if(!_list || !_list.length){
                    Core.MinMessage.Show({text:  '请选择文件', type: 'war', timeout: 2000});
                    return false;
                }
                
                //发送
                postFeed(data, function(r){
                    if(r.state){
                        _textArea.val('');
                        Core.MinMessage.Show({text:  '成功分享到朋友们', type: 'suc', timeout: 2000});
                        _mod.Close();
                    }
                    else{
                        _textArea.focus();
                        Core.MinMessage.Show({text:  r.err_msg, type: 'err', timeout: 2000});
                    }
                });
            }
            
            var _top = Util.Override(Core.DialogBase, _self, {
                Initial: function(){
                    _textArea = _content.find('textarea');
                    _fontCount = _content.find('[rel="font_count"]');
                    _check = new FontCheck(_textArea, _fontCount);
                    
                    _textArea.on('keydown', function(e){
                            if(e.ctrlKey && e.keyCode == 13){
                                return false;
                            }
                    }).on("keyup", function(e){
                        _check.CheckCount();
                        if(e.ctrlKey && e.keyCode == 13){
                            //提交信息
                            postData();
                        }
                    });
                    _content.find('[btn="confirm"]').on('click', function(){
                        postData();
                    });
                },
                Show: function(list){
                    _top.Open(function(){
                        _check.CheckCount();
                    });
                }
            },{
                content: _content,
                title: '分享到朋友们'
            });
            
        }
        
        var _mod;
        return {
            Open: function(list){
                _list = list;
                if(!_mod){
                    _mod = new mod();
                }
                _mod.Show(list);
            }
        }
        
    })();
    
})();


Core.ViewFile = (function () {
    
    var changeData = function(condition, item){
        for(var k in item){
            if(condition[k]){

                if(k == 'n' && !item[k]){
                    item[k] = '';
                }

                var val = item[k];
                item[k] = null;
                delete item[k];
                if(k == "n" && typeof val == "string"){
                    val = val.replace(/`/g,"-").replace(/\$/g, "-").replace(/\^/g, "-");
                }
                item[condition[k]] = val;
            }
        }
    }
    
    var getFileAttrII = function(item){
        var main = Ext.CACHE.FileMain;
        var ac = main.Setting.GetActive();
        var str = ' rel="item" file_type="1" cid="{category_id}" file_mode="{file_mode}" user_ptime="{user_ptime}" is_share="{is_share}" pick_expire="{pick_expire}" file_size="{file_size}" file_id="{file_id}" file_status="{file_status}" area_id="{area_id}" p_id="'+ac.cid+'" ico="{ico}" pick_code="{pick_code}" is_collect="{is_collect}" has_desc="{has_desc}" is_q="{q}"';
        if(item.path){
            str += (item.path? ' path="{path}" ' : '');
        }
        str += (item.sha1? ' sha1="{sha1}"' : '');
        return str;
    }
    
    var getDom = function(item){
        changeData({
            "n": "file_name", 
            "aid": "area_id", 
            "cid": "category_id", 
            "s": "file_size", 
            "sta": "file_status", 
            "pt":"pick_time",
            "pc": "pick_code", 
            "p":"has_pass",
            "m":"is_mark", 
            "t":"user_ptime", 
            "d":"has_desc", 
            "c":"is_collect", 
            "sh":"is_share", 
            "e":"pick_expire",
            "fid":"file_id",
            "ico":"ico",
            "dp": "dir_path",
            "ns":"file_name_show",
            "u": "path",
            "sha": "sha1"
        }, item);
        return $(String.formatmodel('<li '+getFileAttrII(item)+'><span field="file_name" title="{file_name}">{file_name}</span></li>', item));
    }
    
    var setApi = function(){
        VW.Screen.Actions = {
            next: function(info, callback){
                var main = Ext.CACHE.FileMain;
                var ac = main.Setting.GetActive();
                var data = {
                    file_id: info.file_id,
                    next:1,
                    order: ac.order,
                    is_asc: ac.is_asc,
                    cid: ac.cid || ''
                }
                
                Core.DataAccess.FileRead.GetOtherImg(data, function(r){
                    var doms = [];
                    if(r.state){
                        for(var k in r.data){
                            var item = r.data[k];
                            var itemNode = getDom(item);
                            doms.push({
                                pick_code: itemNode.attr('pick_code'),
                                file_id: itemNode.attr('file_id'),
                                min_pic: itemNode.attr('path'),
                                file_size: itemNode.attr('file_size'),
                                file_name: itemNode.find("[field='file_name']").attr("title"),
                                sha1: itemNode.attr('sha1'),
                                jdom: itemNode
                            });
                        }
                    }
                    if(doms.length){
                        callback && callback(doms);
                    }
                    else{
                        callback && callback(false);
                    }
                });
            },
            star: function(info, callback){
                var file_id = info.jdom.attr("file_id");
                var star = 1;
                
                if(info.is_star){
                    star = 0;
                }
                
                Core.FileAjax.Star(file_id, star, function(ids, star){
                    Core.FileConfig.DataAPI && Core.FileConfig.DataAPI.Star(Core.FileConfig.aid, Core.FileConfig.cid, [info.jdom], star);
                    callback && callback(star);
                    
                    info.is_star = star;
                    
                    if(star){
                        Core.MinMessage.Show({
                            text: '成功设置星标',
                            type:'suc',
                            timeout: 2000
                        });
                    }
                    else{
                        Core.MinMessage.Show({
                            text: '成功取消星标',
                            type:'suc',
                            timeout: 2000
                        });
                    }
                });
            },
            download: function(info){
                if (info.jdom) {
                    var pick_code = info.jdom.attr("pick_code");
                    Core.FileAPI.Download(pick_code);
                }
                else {
                    Core.MinMessage.Show({
                        text:"文件正在进入云端，请稍候重试",
                        type:"inf",
                        timeout:2000
                    });
                }
            },
            del: function(info, callback){
                var list = [info.jdom];
                Core.FileAPI.DeleteFile(list, callback);
            },
            share: function(info){
                if (info.jdom) {
                    var list = [info.jdom];
                    Core.FileAPI.ShareTO(list);
                }
                else {
                    Core.MinMessage.Show({
                        text:"文件正在进入云端，请稍候重试",
                        type:"inf",
                        timeout:2000
                    });
                }

            },
            magic: function(info){
                if(!info || !info.file_id){
                    return false;
                }
                window.open('/?ct=meitu&file_id=' + info.file_id);
            }
        };
    }
    
    var loadJs = function(callback){
        Util.Load.JS(STATIC_DIR + '/plug/viewer/Viewer.js?v=' + VIEWER_VERSION, callback);
    }
    
    var getFileAttr = function () {
        var str = ' file_type="1" is_share="{is_share}" file_size="{file_size}" file_id="{file_id}" area_id="{area_id}" p_id="{category_id}" ico="{ico}" pick_code="{pick_code}" ';
        return str;
    }
    
    return {
        AddMusic:function (arr, isplay, is_album, tid) {
            var fids = [];
            var res = false;
            for(var i = 0, len = arr.length; i < len; i++){
                var item = arr[i];
                var fileName = item.find('[field="file_name"]').attr('title');
                var suffix = "";
                var fileName = item.find("[field='file_name']").attr("title");
                if (fileName.lastIndexOf('.') != -1) {
                    suffix = fileName.substring(fileName.lastIndexOf('.'), fileName.length).replace(".", "");
                }
                var musicType = ['mp3', 'ape', 'flac', 'wav', 'm4a'], suffixType = suffix.toLowerCase();
                if ($.inArray(suffixType, musicType) != -1) {
                    res = true;
                    var fid = item.attr('file_id');
                    if(item.attr('area_id') == 99){
                        fid = item.attr('pick_code');
                    }
                    
                    fids.push(fid);
                }
            }
            if(!res){
                Core.MinMessage.Show({
                    text: '音乐播放器只支持mp3、ape、flac、wav、m4a文件播放',
                    type: 'war',
                    timeout: 2000
                });
                return false;
            }
            if(!tid){
                Util.Cookie.set('OOF_MPLAY_LIST', fids.join(','));
                
            }
            
            Core.FileAPI.OpenMusic();
            return fids;
        },
        ListMusic:function (dataList) {
            var TOP = top.window;
            TOP.Core.CloudMusic.GetCate(function(r){
                var arr = {};
                for(var k in r){
                    var item = r[k];
                    arr['al_' + item.topic_id] = {
                        text: item.topic_name
                        };
                }
                arr['br1'] = {
                    isline: true
                };
                arr['create_al'] = {
                    text: '添加专辑'
                };
                menu = $(TOP.Core.FloatMenu.GetMenuHtml(arr));
                window.console && console.log(menu);
            });
        },
        //运行
        Run:function (fileDom) {
            
            var type = "";
            var suffix = "";
            var fileName = fileDom.find("[field='file_name']").attr("title");
            if (fileName.lastIndexOf('.') != -1) {
                suffix = fileName.substring(fileName.lastIndexOf('.'), fileName.length).replace(".", "");
            }
            for (var k in window["UPLOAD_CONFIG"]) {
                var item = window["UPLOAD_CONFIG"][k];
                if (typeof item["upload_type_limit"] == "object" && $.inArray(suffix.toLowerCase(), item["upload_type_limit"]) != -1) {
                    type = k;
                    break;
                }
            }

            var isArchive = ['rar','zip','7z','tar'];
            if($.inArray(fileDom.attr('ico'), isArchive) != -1) {
                Core.FileAPI.OpenRAR(fileDom.attr('pick_code'));
                return false;
            }

            switch(Number(type)){
                case 2:
                    Core.FileAPI.OpenDoc(fileDom.attr('pick_code'), fileDom.attr('ico'));
                break;
                case 3:
                    var info = {
                        pick_code: fileDom.attr('pick_code'),
                        file_id: fileDom.attr('file_id'),
                        min_pic: fileDom.attr('path'),
                        sha1: fileDom.attr('sha1')
                    };
                    var picList = [];
                    var listBox = fileDom.parents('[rel="list"]');
                    listBox.find('[rel="item"][path]').each(function(){
                        var itemNode = $(this);

                        var suffix = "";
                        var fileName = itemNode.find("[field='file_name']").attr("title");
                        if (fileName.lastIndexOf('.') != -1) {
                            suffix = fileName.substring(fileName.lastIndexOf('.'), fileName.length).replace(".", "");
                        }
                        var item = window["UPLOAD_CONFIG"]["3"];
                        if (typeof item["upload_type_limit"] == "object" && $.inArray(suffix.toLowerCase(), item["upload_type_limit"]) != -1) {
                            var obj = {
                                pick_code: itemNode.attr('pick_code'),
                                file_id: itemNode.attr('file_id'),
                                min_pic: itemNode.attr('path'),
                                file_size: itemNode.attr('file_size'),
                                file_name: itemNode.find("[field='file_name']").attr("title"),
                                sha1: itemNode.attr('sha1'),
                                is_star: Number(itemNode.find('[menu="star"]').attr('is_star'))? 1 : 0,
                                jdom: itemNode
                            };

                            var ind = picList.push(obj);
                            obj.ind = ind - 1;
                            
                            if(info.pick_code == obj.pick_code){
                                info = obj;
                            }
                        }
                    }); 
                    
                    if(!window['VW']){
                        loadJs(function(){
                            VW.Initial();
                            setApi();
                            
                            if(fileDom.attr('area_id') == '99'){
                                VW.Screen.Actions['star'] = false;
                                VW.Screen.Actions['share'] = false;
                                VW.Screen.Actions['magic'] = false;
                            }
                            
                            VW.Screen.Open(info, picList);
                        });
                    }
                    else{
                        setApi();
                        if(fileDom.attr('area_id') == '99'){
                            VW.Screen.Actions['star'] = false;
                            VW.Screen.Actions['share'] = false;
                            VW.Screen.Actions['magic'] = false;
                        }
                        VW.Screen.Open(info, picList);
                    }
                    break;
                case 9:
                    if(fileDom.attr('ico').toLowerCase() == 'swf'){
                        Core.FileAPI.OpenSWF(fileDom.attr('pick_code'));
                    }
                    else{
                        Core.FileAPI.OpenVideo(fileDom.attr('pick_code'));
                    }
                    break;
                default:
                    if(suffix.toLowerCase() == 'torrent'){
                    Ext.OffLine.AddTask(fileDom.attr('sha1'));
                    return false;
                    if(Core.FilePermission.Vip()){
                        Ext.OffLine.AddTask(fileDom.attr('sha1'));
                    }
                    else{
                        Core.Message.Confirm({
                            text: '升级VIP贵宾，马上享受云下载服务',
                            confirm_text: "马上升级",
                            confirm_link: PAGE_PATHS['VIP'] + '/order/buy/?p=offline_down'
                        });
                    }
                    return;
                }
                Core.FileAPI.Download(fileDom.attr('pick_code'));
                    break;
            }

            /*if(type == 3){
                
            }
            else{
                
            }*/
        },
        Show:function (type, data) {
            if (data && data.sha1) {
                Core.DataAccess.FileRead.GetInfoBySha1(data.sha1, function (r) {
                    if (r.state) {
                        //组装DOM
                        if (r.data && r.data.all_url) {
                            
                            var postData = {};
                            postData.url = r.data.img_url;
                            postData.all_url = r.data.all_url;
                            postData.source_url = r.data.url;

                            var itemNode = $(String.formatmodel('<div ' + getFileAttr() + '><span field="file_name" title="{file_name}"></span></div>', r.data));

                            var info = {
                                pick_code: itemNode.attr('pick_code'),
                                file_id: itemNode.attr('file_id'),
                                min_pic: postData.all_url && postData.all_url.length ? postData.all_url[0] : false,
                                file_size: itemNode.attr('file_size'),
                                file_name: itemNode.find("[field='file_name']").attr("title"),
                                jdom: false,
                                ind: 0,
                                source: postData
                            };
                            var picList = [info];
                            if(!window['VW']){
                                loadJs(function(){
                                    VW.Initial();
                                    VW.Screen.Actions = false;
                                    VW.Screen.Open(info, picList);
                                });
                            }
                            else{
                                VW.Screen.Actions = false;
                                VW.Screen.Open(info, picList);
                            }
                            return false;
                            
                        }
                    }
                    Core.MinMessage.Show({
                        text: '文件暂不能预览',
                        type: 'war', 
                        timeout: 2000

                    });
                });
            }
        },
        Close:function () {
        }
    }
})();
;
(function () {
    Core.ShareDG = (function () {

        var _cache = {};

        var model = function () {
            var _content = $('<iframe style="width:100%; display:block;border-radius:0 0 5px 5px; height: 237px;" frameborder=0 src=""></iframe>'), _self = this;
            var _top = Util.Override(Core.DialogBase, _self, {
                Initial: function () {
                    if ($.browser.mozilla) {
                        _content.on("load", function () {
                            try {
                                var win = $(this.contentWindow);
                                $(win).on("keydown", function (e) {
                                    if (e.keyCode == 27) {
                                        return false;
                                    }
                                });
                            } catch (e) {
                            }
                        });
                    }
                },
                Title: function (t) {
                    _self.warp.find('[rel="base_title"]').html(t ? t : '分享文件');
                },
                Open: function () {
                    _top.Open(function () {
                        _content.attr("src", '/?ct=share&ac=share_new');
                    });
                },
                Reset: function (width, height, notcenter) {
                    if (width) {
                        _self.warp.width(width);
                    }
                    if (height) {
                        _content.height(height);
                    }
                    if (!notcenter) {
                        Util.Layer.Center(_self.warp);
                    }

                },
                Close: function () {
                    window.setTimeout(function () {
                        _content.attr("src", "");
                        _top.Close();
                    }, 10);

                }
            }, {
                content: _content,
                title: "分享文件", width: 468
            });
        }


        var editDesc = function (code, oldRmark, callback) {
            if (!oldRmark) {
                oldRmark = '';
            }
            var editCon = $('<div class="dialog-input">' +
                '<input type="text" rel="txt" class="text" maxlength="50" />' +
                '</div>' +
                '<div class="dialog-bottom">' +
                '<div class="con">' +
                '<a href="javascript:;" class="button" btn="confirm">确定</a>' +
                '</div></div>');
            var editBox = new Core.DialogBase({
                title: oldRmark ? '修改礼包备注' : '添加礼包备注',
                content: editCon
            });

            editBox.Open();

            var textBox = editCon.find("[rel='txt']");
            textBox.val(oldRmark);

            var renameFolderFun = function (e) {
                var desc = $.trim(textBox.val());
                if (desc != '') {
                    if (desc.length > 50) {
                        Core.MinMessage.Show({
                            text: '礼包备注最多只能包含50个字', type: 'war', timeout: 2000
                        });
                        textBox.focus();
                        return false;
                    }

                    Core.MinMessage.Show({
                        text: '正在修改礼包备注...', type: 'load', timeout: 10000
                    });

                    changeDescData(code, desc, function (r) {
                        if (r.state) {
                            desc = Util.Text.htmlspecialchars(desc);
                            callback && callback(code, desc);
                            editBox.Close();
                            Core.MinMessage.Show({
                                text: oldRmark ? '成功修改礼包备注' : '成功添加礼包备注', type: 'suc', timeout: 2000
                            });
                        }
                        else {
                            Core.MinMessage.Show({
                                text: r.message, type: r.errtype || 'err', timeout: 2000
                            });
                            textBox.focus();
                        }
                    });
                }
                else {
                    callback && callback(code, desc);
                }
            }

            editCon.find("[rel='txt']").bind("keydown", function (e) {
                if (e.keyCode == 13) {
                    renameFolderFun(e);
                }
                else if (e.keyCode == 27) {
                    editBox.Close();
                }
            })

            editCon.find("[btn]").bind("click", function (e) {
                switch ($(this).attr("btn")) {
                    case "confirm":
                        renameFolderFun(e);
                        break;
                    case "cancel":
                        editBox.Close();
                        break;
                }
                return false;
            })

            textBox.focus();
            window.setTimeout(function () {
                textBox.select();
            }, 20);
        }

        var changeDescData = function (code, desc, callback) {
            $.ajax({
                url: '/?ct=filegift&ac=update_remark',
                type: 'POST', dataType: 'json',
                data: {
                    gift_code: code,
                    remark: desc
                },
                success: function (r) {
                    callback && callback(r);
                }
            })
        }

        return {
            ShareFriend: function (file_list) {
                if (!Core.FilePermission.Vip()) {
                    Core.Message.Confirm({
                        text: '此功能升级VIP方可使用！',
                        type: 'war',
                        confirm_link: 'https://vip.115.com/?p=do_friend',
                        confirm_text: '升级VIP'
                    });
                    return;
                }
                Core.Message.Confirm({
                    text: '',
                    type: 'war',
                    content: '<b style="color: #F55F5F;">警告！严禁上传包括反动、暴力、色情、违法及侵权内容的文件；严格遵守保密法律法规，任何危害国家秘密的行为，都必须受到法律追究。</b>',
                    confirm_text: '继续发送',
                    callback: function (res) {
                        if (res) {
                            var back = function () {
                                Core.ShareDG.Close();
                                var sending = false;
                                window['oofUtil'].memberSelector.show({
                                    max_count: 15,
                                    callback: function (data) {
                                        var user_ids = data.selectMembers;
                                        var fdata = {
                                        };
                                        for (var i = 0, len = file_list.length, tmp; i < len; i++) {
                                            var $item = file_list[i];
                                            if ($item.attr("file_type") == "0") {
                                                fdata[$item.attr("pick_code")] = {
                                                    "t": "folder",
                                                    "n": $item.attr("cate_name"),
                                                    "s": 0,
                                                    "sha1": "",
                                                    "folder": 1
                                                }
                                            } else {
                                                fdata[$item.attr("pick_code")] = {
                                                    t: $item.attr('ico'),
                                                    n: $item.find("[field='file_name']").attr("title"),
                                                    s: $item.attr("file_size"),
                                                    sha1: $item.attr("sha1")
                                                }
                                            }
                                        }
                                        function sendMsg(users, fdata) {
                                            var msg = JSON.stringify({
                                                b: '',
                                                a: fdata
                                            });

                                            function _(i, s) {
                                                var u = users[i];

                                                if (!u) {
                                                    Core.FrameDG.Close();
                                                    Core.MinMessage.Show({
                                                        text: "发送成功",
                                                        type: "suc",
                                                        timeout: 2000
                                                    });
                                                    return;
                                                }
                                                Core.MinMessage.Show({
                                                    text: "正在发送(" + (i + 1) + '/' + users.length + ")",
                                                    type: "load",
                                                    timeout: 100000
                                                });
                                                oofUtil.bridge.msg({
                                                    url: '/?ac=send_m',
                                                    data: {
                                                        fn: '',
                                                        tid: Number(u).toString(36),
                                                        tt: 1,
                                                        m: msg,
                                                        tn: null,
                                                        q_anonymous: 0
                                                    },
                                                    dataType: "json",
                                                    type: "post",
                                                    success: function (json) {
                                                        try {
                                                            if (json.state) {
                                                                setTimeout(function () {
                                                                    _(i + 1);
                                                                }, 200)
                                                            } else {
                                                                if (i == 0 || (s && s > 5)) {
                                                                    //第一个
                                                                    Core.MinMessage.Show({
                                                                        text: json.message || "网络异常",
                                                                        type: "err",
                                                                        timeout: 2000
                                                                    });
                                                                    sending = false;
                                                                } else {
                                                                    setTimeout(function () {
                                                                        _(i, (s || 0) + 1);
                                                                    }, 1000)
                                                                }

                                                            }
                                                        } catch (e) {

                                                        }
                                                    },
                                                    error: function () {
                                                        if (i == 0) {
                                                            //第一个
                                                            Core.MinMessage.Show({
                                                                text: "网络异常",
                                                                type: "err",
                                                                timeout: 2000
                                                            });
                                                            sending = false;
                                                        } else {
                                                            setTimeout(function () {
                                                                _(i);//重试
                                                            }, 1000)
                                                        }
                                                    }
                                                })
                                            }

                                            _(0);
                                        }

                                        sendMsg(user_ids, fdata);
                                    }
                                })
                            }
                            if (window['oofUtil'] && window['oofUtil'].memberSelector) {
                                back();
                            }
                            else {
                                $.getScript('//assets.115.com/??/libs/json2.min.js,ajax/bridge.min.js,oofUtil/template.min.js,plug/memberSelector/memberSelector.min.js?v=1', function () {
                                    back();
                                });
                            }
                        }
                    }
                })

            },
            SetHeight: function (h) {
                if (_cache.box) {
                    _cache.box.Reset(false, h, false);
                }
            },
            SetWidth: function (w) {
                if (_cache.box) {
                    _cache.box.Reset(w, false, false);
                }
            },
            Title: function (t) {
                if (_cache.box) {
                    _cache.box.Title(t);
                }
            },
            Open: function (list) {
                this.ShareFriend(list);
                return;

                _cache.list = list;
                if (!_cache.box) {
                    _cache.box = new model();
                }
                _cache.gift_object = false;
                _cache.box.Open();
            },
            GetFileList: function () {
                return _cache.list;
            },
            Close: function () {
                if (_cache.box) {
                    _cache.box.Close();
                }
            },
            GetGift: function () {
                return _cache.gift_object;
            },
            MarkGift: function (obj) {
                _cache.gift_object = obj;
            },
            EditGiftDesc: function (code, oldRmark, callback) {
                editDesc(code, oldRmark, callback);
            },
            ChangeGiftDescData: function (code, desc, callback) {
                changeDescData(code, desc, callback);
            }
        }
    })();
})();
;
(function () {

    Core.HideFile = (function () {

        var _selectDG;

        var saveVaildType = function (t, pwd, callback) {
            if (!pwd) pwd = '';
            $.ajax({
                url: '/?ct=hiddenfiles&ac=open',
                type: 'POST',
                data: {
                    valid_type: t,
                    pwd: pwd
                },
                dataType: "json",
                cache: false,
                success: function (r) {
                    if (r.state) {
                        USER_SETTING['valid_type'] = Number(t);
                    }
                    callback && callback(r);
                }
            })
        }

        var showSelectDG = function (callback, notCheck) {
            if (!_selectDG) {
                _selectDG = new Core.FrameBaseDG({
                    ready: function (win) {
                        win['CALL_BACK'] = function (type) {
                            if (!notCheck) {
                                check(type, callback);
                            }
                            else {
                                callback && callback(type);
                            }

                            window.setTimeout(function () {
                                _selectDG.Close();
                            }, 10);
                        }
                    }
                });
            }
            _selectDG.Show(STATIC_DIR + '/' + PLUG_PATH + '/hidefile/select.html?v=' + VIEWER_VERSION);
            _selectDG.Reset(620, 320);
            _selectDG.ResetTitle('选择校验方式');
        }

        var openCheckFrame = function (type, callback, hash) {
            function _() {
                var $dom = $('<div class="dialog-frame"><iframe frameborder="0" src="" style="height: 380px;border-radius:5px;"></iframe></div>');
                var dg = new Core.DialogBase({
                    title: '安全密钥',
                    content: $dom
                })
                dg.Open(function () {
                    dg.warp.find('[rel="title_box"],.dialog-handle').remove();
                    dg.warp.css({'border': 'none'});
                })

                $dom.find('iframe').on('load', function () {
                    var win = this.contentWindow;
                    var $body = $(win.document.body);
                    var reg = /^\d*$/, $code = $body.find('#js_old_code');

                    $body.find('[rel-btn="close"]').on('click', function () {
                        dg && dg.Close();
                        return false;
                    })

                    $code.on('keyup', function (e) {
                        var val = $(this).val();
                        if (!reg.test(val)) {
                            $(this).val(val.replace(/\D/gi, ""));
                            $.alertTip('请输入6位数字安全密钥');
                        }
                    });
                    $body.find('#js-post_submit').on('click', function () {
                        var code = $.trim($code.val());
                        if (!code.length) {
                            $.alertTip('请输入安全密钥');
                            return false;
                        }
                        callback && callback(type, code);
                        dg && dg.Close();
                        return false;
                    });

                    $(win).on('keydown', function (e) {
                        if (e.keyCode == 27) {
                            dg && dg.Close();
                            return false;
                        } else if (e.keyCode == 13) {
                            $body.find('#js-post_submit').click();
                            return false;
                        }
                    })

                    try {
                        setTimeout(function () {
                            $code.focus();
                        }, 300)
                    } catch (e) {
                    }
                })
                $dom.find('iframe').attr('src', '//q.115.com/static/static_v9.0/resource/superpwd.common.html');
            }

            oofUtil.bridge.passport({
                url: '/?ct=nav&ac=keys',
                dataType: 'json',
                success: function (json) {
                    if (json.state && json.data) {
                        if (json.data.is_new) {
                            _();
                        } else {
                            try {
                                top.$.alertTip(json.data.is_set ? '安全升级，请先重置安全密钥，再进行操作' : '请先设置安全密钥，再进行操作');
                            } catch (e) {
                            }

                            if (window.showAccountDG) {
                                window.showAccountDG(0, json.data.is_set ? 'forgot_superpwd' : 'superpwd');
                            } else {
                                $.getScript('//115.com/static/style_v9.0/js/common.accountDG.js', function () {
                                    window.showAccountDG(0, json.data.is_set ? 'forgot_superpwd' : 'superpwd');
                                })
                            }
                        }
                    } else {
                        try {
                            top.$.alertTip(json.message || json.error || '网络异常，请刷新再试')
                        } catch (e) {
                            alert(json.message || json.error || '网络异常，请刷新再试')
                        }
                    }
                }
            });
            return;


            var url = STATIC_DIR + '/' + PLUG_PATH + '/hidefile/';
            if (type == 1) {
                url += 'safe_password.html';
            }
            else if (type == 2) {
                url += 'safe_mobile.html';
            }
            url += '?v=' + VIEWER_VERSION;
            if (hash) url += '#' + hash;
            Core.FrameDG.Open(url, {
                title: '安全验证',
                width: 700,
                height: 365,
                ready: function (win) {
                    win['CALL_BACK'] = function (type, val) {
                        callback && callback(type, val);
                    }
                }
            });
        }

        //检查用户
        var checkUInfo = function (callback) {
            $.ajax({
                url: '/?ct=hiddenfiles&ac=uinfo',
                cache: false,
                dataType: 'json',
                type: 'GET',
                success: function (r) {
                    if (r.state) {
                        callback && callback(r.data);
                    }
                    else {
                        Core.MinMessage.Show({
                            text: r.error,
                            type: 'war',
                            timeout: 2000
                        })
                    }
                }
            })
        }

        var check = function (type, callback, notAlert) {
            checkUInfo(function (data) {
                if(!data.super_passwd){
                    Core.Message.Confirm({
                        text: '您还没有设置安全密钥。',
                        content: '安全密钥是账号枫币支出、回收站、空间卡等关键操作的重要操作凭证。',
                        type: 'inf',
                        confirm_link: 'http://115.com/?nav=safe&child=user&mode=my_set&type=superpwd',
                        confirm_text: '立即设置'
                    });
                }
                else{
                    openCheckFrame(type, callback);
                }
            });
        }

        var setHideList = function (val, arr) {
            var data = {}
            for (var i = 0, len = arr.length; i < len; i++) {
                var item = arr[i];
                if (item.attr("file_type") == "1") {
                    data['fid[' + i + ']'] = item.attr("file_id");
                }
                else if (item.attr("file_type") == "0") {
                    data['fid[' + i + ']'] = item.attr("cate_id");
                }
            }
            data.hidden = val;
            UA$.ajax({
                url: '/files/hiddenfiles',
                data: data,
                type: 'POST',
                dataType: 'json',
                success: function (r) {
                    if (r.state) {
                        var show_state = Number(Core.NewSetting.Get('show'));
                        if (show_state) {
                            if (Core.FileConfig.DataAPI) Core.FileConfig.DataAPI.UpdateHide(data.hidden, arr);
                        }
                        else {
                            Core.MinMessage.Show({
                                text: '成功加密隐藏文件',
                                timeout: Core.CONFIG.MsgTimeout,
                                type: "suc"
                            });
                            if (Core.FileConfig.DataAPI) Core.FileConfig.DataAPI.Del(Core.FileConfig.aid, Core.FileConfig.cid, arr);
                        }
                    }
                    else {
                        Core.MinMessage.Show({
                            text: r.error,
                            timeout: Core.CONFIG.MsgTimeout,
                            type: "err"
                        });
                    }
                }
            })

        }

        var showFirst = function (callback) {
            Core.FrameDG.Open(STATIC_DIR + '/' + PLUG_PATH + '/hidefile/first.html?v=' + VIEWER_VERSION, {
                title: '开启文件加密隐藏功能',
                width: 700,
                height: 365,
                ready: function (win) {
                    win['CALL_BACK'] = function () {
                        callback && callback();
                    }
                }
            });
        }

        var showErrMsg = function (r) {
            if (r.errno == 320005) {
                Core.Message.Confirm({
                    text: '您还没有设置安全密钥。',
                    content: '安全密钥是账号枫币支出、回收站、空间卡等关键操作的重要操作凭证。',
                    type: 'inf',
                    confirm_link: 'http://115.com/?nav=safe&child=user&mode=my_set&type=superpwd',
                    confirm_text: '立即设置'
                });
            }
            else if (r.errno == 320006) {
                Core.Message.Confirm({
                    text: '请先绑定手机。',
                    type: 'inf',
                    confirm_link: 'http://115.com/?nav=safe&child=user&mode=my_set&type=bind_mobile',
                    confirm_text: '立即绑定'
                });
            }
            else {
                Core.MinMessage.Show({
                    text: r.error,
                    type: 'err',
                    timeout: 2000
                });
            }
        }

        return {
            OpenSelectDG: function () {
                showSelectDG(function (type) {
                    var oldType = Number(Core.NewSetting.Get('valid_type'));
                    if (oldType != 0 && oldType != Number(type)) {
                        openCheckFrame(oldType, function (otype, pwd) {
                            saveVaildType(type, pwd, function (r) {
                                if (r.state) {
                                    //callback && callback(type);
                                    Core.MinMessage.Show({
                                        text: '成功修改验证方式',
                                        type: 'suc',
                                        timeout: 2000
                                    });
                                    Core.FrameDG.Close();
                                }
                                else {
                                    showErrMsg(r);
                                }
                            });
                        }, encodeURIComponent('修改验证方式需要进行' + (type == 2 ? '安全密钥验证' : '短信验证')));
                    }
                    //Core.HideFile.SettingStatus(1);
                }, true);
            },
            SetFile: function (val, list) {
                var valid_type = Number(Core.NewSetting.Get('valid_type'));
                if (val == 1 && valid_type == 0) {
                    showFirst(function (r) {
                        showSelectDG(function (type) {
                            openCheckFrame(type, function (type, pwd) {
                                saveVaildType(type, pwd, function (r) {
                                    if (r.state) {
                                        //callback && callback(type);
                                        Core.MinMessage.Show({
                                            text: '成功修改验证方式',
                                            type: 'suc',
                                            timeout: 2000
                                        });

                                        setHideList(val, list);
                                        Core.FrameDG.Close();
                                    }
                                    else {
                                        Core.MinMessage.Show({
                                            text: r.error,
                                            type: 'err',
                                            timeout: 2000
                                        });
                                    }
                                });
                            }, encodeURIComponent('修改验证方式需要进行' + (type == 2 ? '安全密钥验证' : '短信验证')))
                        }, true);
                    });
                }
                else {
                    Core.Message.Confirm({
                        text: val == 1?'确认要加密隐藏吗？':'确认要解除隐藏吗？',
                        type: 'inf',
                        callback: function(res){
                            if(res){
                                setHideList(val, list);
                            }
                        }
                    });
                }
            },
            SettingStatus: function (status, callback, notAlert) {
                var oldVal = Number(Core.NewSetting.Get('show'));
                var valid_type = Number(Core.NewSetting.Get('valid_type'));
                var val = status;
                if (oldVal == val) {
                    if (notAlert) {
                        callback && callback();
                    }
                    return;
                }
                var postFun = function (type, pwd) {
                    $.ajax({
                        url: '/?ct=hiddenfiles&ac=switching',
                        data: {
                            show: val,
                            valid_type: type,
                            safe_pwd: pwd
                        },
                        type: 'POST',
                        cache: false,
                        dataType: 'json',
                        success: function (r) {
                            if (r.state) {
                                if (callback) {
                                    callback();
                                }
                                else {
                                    if (Core.FileConfig.DataAPI) Core.FileConfig.DataAPI.Reload();
                                }

                                USER_SETTING['show'] = Number(val);
                                USER_SETTING['valid_type'] = Number(type);

                                if (Number(Core.NewSetting.Get('show')) == 1) {
                                    Core.FrameDG.Close();
                                }
                            }
                            else {
                                if (valid_type == 0 && notAlert && callback) {
                                    callback();
                                    return;
                                }
                                showErrMsg(r);
                            }
                        }
                    });
                }

                if (val == 0) {
                    postFun(valid_type, '');
                }
                else {
                    check(valid_type, function (type, pwd) {
                        postFun(type, pwd);
                    }, notAlert);
                }
            }
        }
    })();
})();