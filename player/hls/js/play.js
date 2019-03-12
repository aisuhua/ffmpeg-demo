;(function () {


    var isSupported = function () {
        var mediaSource = window.MediaSource = window.MediaSource || window.WebKitMediaSource;
        var sourceBuffer = window.SourceBuffer = window.SourceBuffer || window.WebKitSourceBuffer;
        var isTypeSupported = mediaSource && typeof mediaSource.isTypeSupported === 'function' && mediaSource.isTypeSupported('video/mp4; codecs="avc1.42E01E,mp4a.40.2"');


        var sourceBufferValidAPI = !sourceBuffer || sourceBuffer.prototype && typeof sourceBuffer.prototype.appendBuffer === 'function' && typeof sourceBuffer.prototype.remove === 'function';
        return isTypeSupported && sourceBufferValidAPI;
    }();

    if(!isSupported) {
        Core.Message.Confirm({
            text: "浏览器版本过低，视频不能播放。",
            confirm_text:"立即升级",
            confirm_link:'http://pc.115.com',
            type: "info"     //{'load':读取,'suc':成功,'inf':详细,'war':警告,'err':错误}
        });
        return;
    }

    window.VIDEO_PUSH_STATE = false;

    var version = window.VERSION || '11';

    var paremt = oofUtil.getQueryParams(location.href),
        pickcode = paremt['pickcode'] || 'eozkevon6kf6ezlxe',
        _parent_id;

    var $video_box = $('#js-video_box'),
        $video_list = $('#js-video_list'),
        $video_flash =$('#js-set_play_flash');

    var $sub_reload = $('<a href="javascript:;" style="left: 115px;position: absolute;top: 8px;padding: 0 11px 0 11px;line-height: 30px;border-radius: 2px;background-color: #313030;color: #999;opacity: 0.9;">刷新字幕</a>');

    if(!window.IS_VIP) {
        var setting = {
            title:'在线预览是VIP专属特权，开通VIP即可使用',
            text:'',
            confirm_link:'https://vip.115.com/?p=video',
            confirm_text:'马上开通',
            confirm_cls:'btn' //蓝按钮'btn-blue',
        };
        if(window._SHOWVIPDIALOG_){
            window._SHOWVIPDIALOG_.Show(setting);
        }else{
            Util.Load.JS(__uri('//115.com/static/plug/vip_pay/vip.pay.js?v='+version),function(){
                window._SHOWVIPDIALOG_.Show(setting);
            });
        }
        $video_box.add($('#js-video_title').parent()).hide();
        $('#js-video_container').addClass('video-container-nolist');
        return;
    }

    $video_flash.add('#js-play_old').on('click', function () {
        delete paremt['hls'];
        Util.Cookie.set('play_hls','2');
        location.href = '//115.com/?'+$.param(paremt);
        return false;
    })

    var timeC = false;
    setInterval(function(){
        $video_box.find('[rel="date"]').text( oofUtil.date.format(new Date(), 'HH'+(timeC ? ' ':':')+'mm') );
        timeC = timeC ? false : true;
    }, 1000);


    /**
    *获取初始化时间
    **/
    var video = document.getElementById('js-video');
    var saveTime = function (time, is_end) {
        var currentTime = ~~(video.currentTime||0);
            buffered = ~~(video.buffered ||0);
        var obj = {
            'op' : 'update',
            'pick_code':pickcode,
            'time':time,
            'definition':is_end ? 1 : 0,
            'category':1
        }
        $.ajax({
            url: '//webapi.115.com/files/history',
            type: 'post',
            dataType: 'json',
            xhrFields:{
                withCredentials:true
            },
            data: obj,
            success:function () {
            }
        })
    }


    /**
    *鼠标隐藏
    **/
    var moveTimerVideo;
    $video_box.on('mousemove', function () {
        $video_box.css({
            'cursor':''
        })
        moveTimerVideo && clearTimeout(moveTimerVideo);
        if(video && video.currentTime && !video.paused) {
            moveTimerVideo = setTimeout(function () {
                $video_box.css({
                    'cursor':'none'
                })
            }, 3000);
        }
    }).on('mouseleave', function () {
        $video_box.css({
            'cursor':''
        })
        moveTimerVideo && clearTimeout(moveTimerVideo);
    })


    var go_next = true;
    var go_url = '';
    window.onblur = function () {
        go_url = '';
        go_next = false;
    }
    window.onfocus = function () {
        if(go_url) {
            location.href = go_url;
        }
        go_next = true;
    }


    var saveTimeState = 0;
    var nextTimeFun;
    function nextFun(num) {
        if(num) {
            this.time = num;
        }
        $video_box.find('[rel="next_tips"]').show().html('<i class="icon-little-clock"></i>' + this.time + '秒后将预览下一个文件');
        this.time--;
        if(this.time < 0) {
            var $hover = $video_list.find('[pickcode].hover');
            go_url = '/?ct=play&pickcode='+$hover.next().attr('pickcode')+'&hls=1';
            // if(go_next) {
                location.href = go_url;
            // }
        }else {
            nextTimeFun && clearTimeout(nextTimeFun);
            nextTimeFun = setTimeout(function () {
                nextFun();
            },1000)
        }

    }
    video.addEventListener('ended', function () {
        saveTime(0, 1);
        saveTimeState = 1;
        var $hover = $video_list.find('[pickcode].hover');
        if($hover.length && $hover.next().length) {
            $video_box.find('[rel="next_tips"]').show();
            nextFun(5);
        }
    });
    video.addEventListener('play', function () {
        if(saveTimeState) {
            saveTimeState = 0;
        }
        nextTimeFun && clearTimeout(nextTimeFun);
        $video_box.find('[rel="next_tips"]').hide();
    })


    var language_obj = {
        '简': ['chs', '简体'],
        '繁': ['cht', '繁体'],
        '英': ['eng', '英文'],
        '日': ['jpn', '日文'],
        '中英': ['chs&eng', '繁体&英文', '简体&英文']
    }


    var getSubList = function (callback) {
        $.ajax({
            url: '//webapi.115.com/movies/subtitle?pickcode='+pickcode,
            type: 'get',
            dataType: 'json',
            xhrFields:{
                withCredentials:true
            },
            success:function (r) {
                if(r.state) {
                    var list = r.data.list;
                    var html = [];
                    for(var i=0;i<list.length;i++) {
                        var item = list[i];
                        item.url = item.url.replace(/http(|s):\/\//, '//');
                        html.push('<li _url="'+item.url+'" title="'+item.title+'" _title="'+(item.file_name || item.title)+'"><span>'+item.title+'</span><a href="javascript:;" btn="del">取消</a></li>');
                    }
                    var $sub_list = $video_box.find('[rel="sub_list"]');
                    $sub_list.html(html.join('')).find('[_url]').each(function (i) {
                        var $this = $(this);
                        var item = list[i];
                        if(item.file_id) {
                            $this.attr({
                                 sha1:item.sha1,
                                 file_id:item.file_id,
                                 pick_code:item.pick_code,
                                 map_id:item.caption_map_id,
                                 is_caption_map:item.is_caption_map
                            })
                        }else {
                            $this.attr('is_msub', 1);
                        }
                    })
                    callback && callback(r);
                }
            }
        })
    }


    $sub_reload.on('click', function () {
        var $sub_list = $video_box.find('[rel="sub_list"]');
        var $item = $sub_list.find('.selected');
        var sha1 = '';
        if($item.length) {
            sha1 = $item.attr('sha1');
        }
        getSubList(function (r) {
            if(sha1.length) {
                $sub_list.find('[sha1="'+sha1+'"]').trigger('click');
            }
            $video_box.find('[rel="subtitle"]').trigger('click');
        })
    })

    var getNetWorkInit = function (file_name, json) {
        /**
        *字幕列表
        **/
        var title = '';
        var subtitle_url = '';

        var _ = function (time) {
            $('#js-video_title').text(json.file_name);
            $video_box.find('[rel="title"]').text('正在播放：'+json.file_name);
            Util.Load.JS(__uri('/static/plug/video_js_hls/js/video.js?v='+version), function (r) {
                window.VideoHLS(json, time);
                window.setInterval(function () {
                    var currentTime = ~~(video.currentTime||0),
                        buffered = ~~(video.buffered ||0),
                        duration = ~~(video.duration || 0);
                    if(currentTime && duration && !saveTimeState) {
                        saveTime(currentTime);
                    }
                }, 30000);

                if(!paremt['yun_url']) {
                    getSubList(function (r) {
                        $('#js-upload_subtitle').parent().after($sub_reload);

                        if(r.data.list.length) {
                            $('#js-sub_tips').show();
                            setTimeout(function(){
                                $('#js-sub_tips').remove();
                            }, 6000);
                        }
                        if(window.GolSubTitle) {
                            var subtitle = window.GolSubTitle;
                            var $sub_list = $video_box.find('[rel="sub_list"]');
                            var _url = '';
                            try{
                                _url = r.data.autoload.url;

                                _url = _url.replace(/http(|s):\/\//, '//');

                            }catch(e){}
                            if(_url && $sub_list.find('[_url="'+_url+'"]').length) {
                                $sub_list.find('[_url="'+_url+'"]').trigger('click');
                            }
                        }
                    })
                }
            });
        }
        
        $.ajax({
            url: '//webapi.115.com/files/history?pick_code='+pickcode+'&fetch=one&category=1',
            type: 'GET',
            dataType: 'json',
            xhrFields:{
                withCredentials:true
            },
            success:function (r) {
                var time = 0;
                if(r.state) {
                    time = r.data.time;
                    if(r.data.watch_end) {
                        time = 0;
                    }
                }
                _(time);
            },
            error:function () {
                _(0);
            }
        })
    }


    //获取视频详情信息与上次播放时间
    
    var getVideoInfo = window.getVideoInfo = function () {

        var __ = function (callback) {
            if(paremt['yun_url']) {
                var obj = {pick_code: paremt.pickcode, from:paremt.from};
                if(paremt['sch_type']) {
                    obj['sch_type'] = paremt['sch_type'];
                    obj['sch_id'] = paremt['sch_id'];
                }
                if(paremt['gid']){
                    obj['gid'] = paremt['gid'];
                }

                $.ajax({
                    url: '//yun.115.com/api/1.0/web/1.0/'+obj.gid+'/file/play',
                    type: 'POST',
                    dataType: 'json',
                    data: obj,
                    xhrFields:{
                        withCredentials:true
                    },
                    success:function (r) {
                        if(r.state) {
                            callback(r.data);
                        }else {
                            Core.MinMessage.Show({text: r.msg || r.message || '获取内容失败请重刷尝试', type: "err", timeout: 2000});
                        }
                    }
                })
            }else {
                callback();
            }
        }

        __(function (data) {

            var obj = {
                url: '//webapi.115.com/files/video?pickcode='+pickcode,
                type: 'GET',
                dataType: 'json',
                xhrFields:{
                    withCredentials:true
                },
                success:function (json) {
                    _parent_id = json['parent_id']|| 0;
                    addVideoList();

                    window.VIDEO_PUSH_STATE = json.video_push_state || false;

                    if(json.state && json.file_status && json.video_url) {
                        getNetWorkInit(json.file_name, json);
                    }else {                    
                        $('#js-video_box').add($('#js-video_title').parent()).hide();
                        $('#js-video_container').addClass('video-container-nolist');
                        if(!window.videoError) {
                            Util.Load.JS(__uri('/static/plug/video_js_hls/js/video.error.js?v='+version), function () {
                                videoError(json);
                            });
                        }else {
                            videoError(json);
                        }
                    }
                }
            };
            if(data) {
                window.YUNSHADATA = data;
                obj.url = '//webapi.115.com/files/video/files/video';
                obj.type = 'post';
                obj.data = {pickcode:pickcode, data:data};
            }
            $.ajax(obj);
        })
    }();


    /***
    *视频同目录列表
    **/
    var _offset = 0,
        _speek = 115,
        _count = 0;

    var scroll_time, is_load = false;
    function addVideoList() {
        if(!_parent_id) {
            return false;
        }
        is_load = true;
        /*视频清单*/
        var obj = {
            aid: 1,
            cid: _parent_id,
            offset: _offset,
            limit: 115,
            show_dir: 0,
            nf: "",
            qid: 0,
            //stdir:1,
            type: 4,
            source: "",
            format: "json",
            star: "",
            is_q: "",
            is_share: "",
            r_all: 1,
            o: 'file_name',
            asc: 1,
            cur: 1,
            natsort: 1
        }

        var video_tpl = '<li pickcode="{pc}" style="padding:0px;">' +
                        '<a href="/?ct=play&pickcode={pc}&hls=1" style="height:auto;text-decoration:none;padding:5px 0 5px 5px;" title="{n}">' +
                        '<span style="word-break:break-all">{n}</span>' +
                        '</a>' +
                        '</li>';
        var sub = function (str, data) {
            return str.replace(/{(.*?)}/igm, function ($, $1) {
                return data[$1] ? data[$1] : "";
            });
        }

        var scuFun = function (r) {
            if(r.state) {
                var arr = [];
                _count = Number(r.count);
                for (var i = 0; i < r.data.length; i++) {
                    var d = r.data[i];
                    arr.push(sub(video_tpl, d));
                }
                $video_list.append(arr.join('')).children("li[pickcode='" + pickcode + "']").attr("class", "hover");
                _offset += _speek;
                is_load = false;
            }
        }
        $.ajax({
            url: '//webapi.115.com/files',
            type: 'get',
            dataType: 'json',
            data: obj,
            xhrFields:{
                withCredentials:true
            },
            success:function (r) {
                if(r.state){
                    scuFun(r);
                }else {
                    $.ajax({
                        url: '//aps.115.com/natsort/files.php',
                        type: 'get',
                        dataType: 'json',
                        data: obj,
                        xhrFields:{
                            withCredentials:true
                        },
                        success:function (json) {
                            scuFun(json);
                        }
                    })
                }
            }
        })
    }

    $video_list.parent().on('scroll', function(){
        var el = $(this);
        var top = (this.scrollHeight - el.height()) * 0.85;
        scroll_time && clearTimeout(scroll_time);

       scroll_time = setTimeout(function () {
           if(el.scrollTop() >= top && _count > _offset) {
                if (_offset >= _count) return;
                if(is_load) {
                    return;
                }
                addVideoList();
            }
       },50);
    })

    /***
    *视频同目录列表 end
    **/


    oofUtil.focusWindow();

    $('#js-donwload_video').on('click', function () {

        var $node = $('<div>'+
                        '<div class="dialog-msg" rel="content">'+
                            '<h3 rel="text" style="padding-left: 0;">'+
                                '<span style="word-break: break-all;word-wrap: break-word;">'+$('#js-video_title').text()+'</span>'+
                            '</h3>'+
                            '<div class="dialog-msg-text" rel="text_content">点击“立即下载”即可下载原始影片文件到电脑。</div>'+
                        '</div>'+
                        '<div class="dialog-action">'+
                            '<a href="javascript:;" class="dgac-cancel" style="" btn="cancel">取消</a>'+
                            '<a href="//115.com/?ct=download&ac=video&pickcode='+pickcode+'" class="dgac-confirm" btn="confirm" target="_blank">立即下载</a>'+
                        '</div>'+
                    '</div>');
        var con = new Core.DialogBase({
            title:'下载视频',
            content:$node
        })
        con.Open(null);
        $node.find('[btn]').on('click', function (e) {
            con.Close();
            e.stopPropagation();
        })
        return false;
    })

})();