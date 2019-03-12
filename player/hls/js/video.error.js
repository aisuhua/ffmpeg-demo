;(function () {

    /**
    * count = 0;    //排队人数
    * time  = 0;    //预估排队时间
    * priority = 0;  //加速标识  2:加速转码  < 1未加速
    * status = 127;  // 转码状态   127：转码失败      1:  排队中      3：加速转码中 (显示加速)     2：转码成功(自动播放)
    */
    var __uri = function (str) {
        return str;
    }

    var ani_transcode_fengbi, ani_transcode_vip;



    var removePayBtn = false;
    var initGetM = false;
    var _getM = function(callback) {
        if(initGetM) {
            callback && callback();
            return;
        }

        $.ajax({
            url: '//my.115rc.com/?ct=ajax&ac=nav&callback=?',
            dataType: 'jsonp',
            success: function (json) {
                var data = json.data || {};
                if(data.forever || data.liang || data.global) {
                    removePayBtn = true;
                    $('#js-pay_btnm').remove();
                }
            },
            complete:function() {
                setTimeout(function() {
                    callback && callback();
                }, 50);
            }
        })
    }



    var getVideoFile = function (callback) {
        var _ = function(de) {
            if (de['file_status']) {
                callback && callback();
            }
            else {
                if (getVideoFile.timer) window.clearTimeout(getVideoFile.timer);
                getVideoFile.timer = window.setTimeout(function () {
                    getVideoFile(callback);
                }, 3000);
            }
        }
        if(location.href.indexOf('yun_url=')) {
            $.ajax({
                url: '//webapi.115.com/files/video',
                type: 'post',
                data:{
                    pickcode:PICK_CODE,
                    data:window.YUNSHADATA || ''
                },
                cache: false,
                dataType: 'json',
                success: function (de) {
                    _(de);
                }
            });
        }else {
            $.ajax({
                url: '//webapi.115.com/files/video?pickcode=' + PICK_CODE,
                type: 'get',
                cache: false,
                dataType: 'json',
                success: function (de) {
                    _(de);
                }
            });
        }

    }

    var Accel = (function () {
        var dom, priority;

        

        var getDataAccess = function (success, err) {
            $.ajax({
                url: QUEUE_URL,
                type: 'POST',
                contentType: "application/json",
                dataType: 'json',
                xhrFields:{
                    withCredentials:true
                },
                data: '{"fid": "' + FID + '"' + (priority ? ',"priority": ' + priority : '') + '}',
                success:function (r) {
                    if (r) {
                        if (r.result === 0) {
                            priority = r.priority;
                            success && success(r);
                        }
                        else {
                            priority = false;
                            err && err(r);
                        }
                    }
                }
            })
        }

        var checkHasFile = function (callback, time) {
            if (time) {
                var msgDom = dom.find('[rel="tran_msg"]');
                var listen = function () {
                    if (listen.timer) {
                        window.clearTimeout(listen.timer);
                    }
                    listen.timer = window.setTimeout(function () {
                        time--;
                        if (time < 0) {
                            time = 0;
                        }
                        if (!time) {
                            msgDom.html('');
                        }
                        else {
                            var timeStr = '';
                            var hour = 0;
                            var lessTime = parseInt(time);
                            var miu = 0;
                            if (time >= 3600) {
                                hour = Math.floor(time / 60 / 60);
                                lessTime -= hour * 60 * 60;
                                timeStr = timeStr + hour + '小时';
                            }
                            if (lessTime >= 60 && lessTime <= 3600) {
                                miu = Math.floor(lessTime / 60);
                                lessTime -= miu * 60;
                                timeStr = timeStr + miu + '分钟';
                            }
                            if (lessTime > 0) {
                                timeStr = timeStr + lessTime + '秒';
                            }
                            msgDom.html('预计<b style="color:#F60;">' + timeStr + '</b>后可预览视频');
                        }
                        listen();
                    }, 1000);
                }
                listen();
            }

            getDataAccess(function (r) {
                if (r.result == 0) {
                    if (r.status == 1 || r.status == 3) {
                        var lisStep = 1000;
                        if (time > 0) {
                            if (time > 5 * 60) {
                                lisStep = 60 * lisStep;
                            }
                            else {
                                lisStep = 8 * lisStep
                                if (time < 3 * 60) {
                                    lisStep = 5000;
                                }
                            }
                        }
                        else {
                            lisStep = 5000;
                        }
                        checkHasFile.timer = window.setTimeout(function () {
                            if (checkHasFile.timer) window.clearTimeout(checkHasFile.timer);
                            checkHasFile(callback);
                        }, lisStep);
                    }
                    else {
                        if (r.status == 127) {
                            showErr();
                        }
                        else {
                            callback && callback(true);
                        }
                    }
                }
            });

        }


        var showErr = function (err) {

            var down_url =  '//115rc.com/?ct=download&ac=video&pickcode=' + PICK_CODE;

            var location_json = oofUtil.getQueryParams(location.href);

            if(location_json && location_json['yun_url']) {
                down_url = '//yun.115.com/'+location_json['gid']+'/file/transfer?pick_code='+location_json['pickcode']+'&from='+location_json['from'];
            }
            
            dom.html('<div class="transcode-result">' +
                '<i class="icon-transcode-fail"></i>' +
                '<p class="headline">'+(err || '转码失败' )+'</p>' +
                '<p style="padding-bottom:10px;"><a style="text-decoration: none;overflow: hidden;border-radius: 3px;background: #00a8ff;color: #fff;font-weight: normal;cursor: pointer;padding: 5px 20px;" href="' + down_url + '" target="_blank" class="button">下载文件</a></p>' +
                // '<p style="font-size: 14px;color: #F60;">若枫币加速失败，所用枫币将于次日原路退回。</p>' +
                '</div>');
            return false;
            dom.html('<div class="transcode-result">' +
                '<i class="icon-transcode-fail"></i>' +
                '<p class="headline">' + (err ? err : '转码失败') + '</p>' +
                '<p>您可以反馈给我们人工处理</p>' +
                // '<p style="font-size: 14px;color: #F60;">若枫币加速失败，所用枫币将于次日原路退回。</p>' +
                '<div class="btn-row">' +
                '<a href="//115.com/115/post?cid=1456757788&fixcate=1" target="_blank" class="btn-transcode"><i class="icon-transcode it-chat"></i><span>在线反馈</span></a>' +
                '</div>' +
                '</div>');
        }

        var getData = function (notSetMsg) {
            if (getData.timer)window.clearTimeout(getData.timer);
            if (!notSetMsg) {
                dom.find('[rel=loadding_ico]').show();
                dom.find('[rel=tran_ico]').hide();
                dom.find('[rel=bottom]').hide();
                dom.find('[rel=msg]').html('正在读取转码进度...');

                // ani_transcode_vip && ani_transcode_vip.stop && ani_transcode_vip.stop();
                // ani_transcode_fengbi && ani_transcode_fengbi.stop && ani_transcode_fengbi.stop();
            }

            getDataAccess(function (r) {                
                var timeStr = '';
                if (r.time > 60 && r.time < 3600) {
                    timeStr = (r.time / 60).toFixed(0) + '分钟';
                }
                else if (r.time >= 3600) {
                    timeStr = (r.time / 60 / 60).toFixed(0) + '小时';
                }
                else {
                    timeStr = r.time + '秒';
                }

                if (r.status == 127) {
                    showErr();
                    return;
                }

                if(r.status == 2) {
                    checkHasFile(function (status) {
                        if (status) {
                            getVideoFile(function () {
                                window.location.reload();
                            });
                        }
                    }, r.time);
                }else {
                    if(r.status == 1 || r.status == 3) {
                        dom.find('[rel=head]').html('<div class="title">前方转码排队人数：<em>' + r.count + '</em>个</div>' +
                            '<div class="desc">预计转码会在 <em>' + timeStr + '后</em> 开始转码</p>');
                    }

                    dom.find('[rel=bottom]').show();
                    dom.find('[rel=loadding_ico]').hide();
                    dom.find('[rel=tran_ico]').show();

                    if(removePayBtn) {
                        ani_transcode_fengbi && ani_transcode_fengbi.play && ani_transcode_fengbi.play();
                    }else {
                        ani_transcode_vip && ani_transcode_vip.play && ani_transcode_vip.play();
                    }

                    //判断是否启用定时监控
                    var stepT = 15;
                    if (r.time < 60) {
                        stepT = 8;
                    }
                    else {
                        stepT = 15;
                    }
                    if (r.time <= 30) {
                        stepT = 4;
                    }
                    getData.timer = window.setTimeout(function () {
                        getData(true);
                    }, stepT * 1000);
                }

            }, function (r) {
                showErr(r.detail);
            });
        }

        return {
            Show: function () {
                if (!dom) {
                    dom = $('<div class="vdr-transcoding" style="display: none;">' +
                        '<div class="headline" rel="head">视频马上就来</div>' +
                        '<div class="transcode-loading" rel="loadding_ico">' +
                        '<i class="icon-transcode-loading"></i>' +
                        '<p rel="msg">正在读取转码进度...</p>' +
                        '</div>' +

                        '<div class="row-ani-transcode" rel="tran_ico" style="display: none;">'+
                            '<div class="ani-transcode-fengbi" id="js_ani_transcode_fengbi"  style="display:'+(!removePayBtn ? '' : 'none')+';"></div>'+
                            '<div class="ani-transcode-vip" id="js_ani_transcode_vip"  style="display:'+(removePayBtn ? '' : 'none')+';"></div>'+
                        '</div>'+

                        // '<div class="transcoding" rel="tran_ico" style="display: none;">'+
                        //     ($.browser.msie?
                        //     '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" style="width: 466px; height: 320px;"><param name="wmode" value="transparent" /><param name="movie" value="\/static/plug\/video_play\/v2015\/images\/transcoding.swf" /><\/object>'
                        //     :
                        //     '<object type="application\/x-shockwave-flash" data="\/static/plug\/video_play\/v2015\/images\/transcoding.swf" style="width: 466px; height: 320px;"><param name="wmode" value="transparent" /><\/object>'
                        //     )+
                        // '</div>' +
                        '<div class="row-btn-transcode" rel="bottom" style="display: none;">' +
                        '<a href="javascript:;" class="btn-transcode-vip" data-btn="vip" style="display:'+(removePayBtn ? '' : 'none')+'"><i class="icon-transcode-vip"></i><span>VIP加速转码</span></a>' +
                        '<a href="javascript:;" class="btn-transcode-fengbi" data-btn="pay" id="js-pay_btnm" style="display:'+(!removePayBtn ? '' : 'none')+';"><i class="icon-transcode-fengbi"></i><span>100枫币加速</span></a>' +
                        '</div>' +
                        '</div>');

                    //绑定事件
                    dom.on('click', '[data-btn]', function () {
                        var el = $(this);
                        switch (el.attr('data-btn')) {
                            case 'vip':
                                if (!IS_VIP) {
                                    var setting = {
                                        title:'在线预览是VIP专属特权，开通VIP即可使用',
                                        text:'',
                                        confirm_link:'//vip.115.com/?p=video',
                                        confirm_text:'马上开通',
                                        confirm_cls:'btn' //蓝按钮'btn-blue',
                                    };
                                    if(window._SHOWVIPDIALOG_){
                                        window._SHOWVIPDIALOG_.Show(setting);
                                    }else{
                                        $.getScript('//115.com/static/plug/vip_pay/vip.pay.js',function(){
                                            window._SHOWVIPDIALOG_.Show(setting);
                                        });
                                    }
                                    return false;
                                }
                                var obj = {
                                    op: 'vip_push',
                                    pickcode: PICK_CODE,
                                    sha1:FID
                                };
                           
                                $.ajax({
                                    url: '/?ct=play&ac=push',
                                    data: obj,
                                    dataType: 'json',
                                    type: 'POST',
                                    success: function (r) {
                                        if (r.state) {
                                            Core.MinMessage.Show({
                                                text: '成功加速', type: 'suc', timeout: 2000
                                            });
                                            el.hide();
                                            getData();
                                            dom.find('[rel="bottom"]').show().html('<a href="//115.com" target="_top" class="btn-transcode"><span>正在加速</span></a>');
                                        }
                                        else {
                                            Core.MinMessage.Show({
                                                text: r.msg, type: 'err', timeout: 2000
                                            });
                                        }
                                    }
                                });
                                break;
                            case 'pay':
                                Core.Message.Confirm({
                                    text: '确认要加速转码吗？',
                                    content: '确认后会扣除100枫币',
                                    type: 'inf',
                                    callback: function (res) {
                                        if (res) {
                                            var obj = {
                                                op: 'pay_push',
                                                pickcode: PICK_CODE,
                                                sha1:FID
                                            };
                                     
                                            $.ajax({
                                                url: '/?ct=play&ac=push',
                                                data: obj,
                                                dataType: 'json',
                                                type: 'POST',
                                                success: function (r) {
                                                    if (r.state) {
                                                        Core.MinMessage.Show({
                                                            text: '成功加速', type: 'suc', timeout: 2000
                                                        });
                                                        getData();
                                                        dom.find('[rel="bottom"]').show().html('<a href="//115.com" target="_top" class="btn-transcode"><span>正在加速</span></a>');
                                                    }
                                                    else {
                                                        if (r.msg_code == 101679) {
                                                            Core.Message.Confirm({
                                                                text: '枫币不足，请充值！',
                                                                type: 'war',
                                                                confirm_link: '//pay.115.com/?p=video_turn',
                                                                confirm_text: '立即充值'
                                                            });
                                                        }
                                                        else {
                                                            Core.MinMessage.Show({
                                                                text: r.msg, type: 'err', timeout: 2000
                                                            });
                                                        }
                                                    }
                                                }
                                            });
                                        }
                                    }
                                })

                                break;
                        }
                        return false;
                    });
                    $(document.body).append(dom);
                    if(window.VIDEO_PUSH_STATE) {
                        dom.find('[rel="bottom"]').show().html('<a href="//115.com" target="_top" class="btn-transcode"><span>正在加速</span></a>');
                    }

                    if(!removePayBtn) {
                        ani_transcode_fengbi = bodymovin.loadAnimation({
                            container: document.getElementById('js_ani_transcode_fengbi'),
                            path: '/static/plug/video_js_hls/lottie_json/ani_transcode_fengbi.json',
                            renderer: 'svg',
                            loop: true,
                            autoplay: false,
                            name: "枫币加速",
                        })
                    }else {
                        ani_transcode_vip = bodymovin.loadAnimation({
                            container: document.getElementById('js_ani_transcode_vip'),
                            path: '/static/plug/video_js_hls/lottie_json/ani_transcode_vip.json',
                            renderer: 'svg',
                            loop: true,
                            autoplay: false,
                            name: "VIP加速转码",
                        })
                    }
                }
                setTimeout(function() {
                    ani_transcode_vip && ani_transcode_vip.stop && ani_transcode_vip.stop();
                    ani_transcode_fengbi && ani_transcode_fengbi.stop && ani_transcode_fengbi.stop();
                    if(!removePayBtn) {
                        ani_transcode_fengbi && ani_transcode_fengbi.play && ani_transcode_fengbi.play();
                    }else {
                        ani_transcode_vip && ani_transcode_vip.play && ani_transcode_vip.play();
                    }
                }, 100);
                dom.show();
                getData();
            }
        }
    })();


    var otherError = function (json) {

        if (!json['state'] && json['errno'] == 990010) {
            $.alertTip(json['error'] || '账号请求异常')
            return;
        }

        if(!json.state && (json.errcode == 911 || json.code == 911) ){
            // $.alertTip(json['error'] || '需要中文验证码');
            // return;
            if(!window['_SHOW911_']) {
                $.getScript(__uri('//115.com/static/plug/show911/show911.js'), function () {
                    window['_SHOW911_'](function () {
                        setTimeout(function(){
                           location.reload();
                        },2000);
                    }, json.data.url || null, window);
                })
            }else {
                window['_SHOW911_'](function () {
                    setTimeout(function(){
                           location.reload();
                        },2000);
                }, json.data.url || null, window);
            }
            return;
        }

        if (json['errno'] == 605) {
            var loadDom = $('<div class="vdr-box">' +
                '<p class="headline">绑定手机后方可使用此功能!</p>' +
                '<a href="//115.com/?nav=safe&open=bind_mobile&mode=my_set" target="_blank" class="vdr-btn"><i class="vdr-icon"></i><span>立即绑定</span></a>' +
                '</div>');
            $(document.body).append(loadDom);
            return false;
        }


        if(!json.state) {
            $.alertTip(json.error || json.msg || '网络请求异常，请重新刷新');
            return false;
        }

        if(!json['file_status']) {
            _getM(function() {
                Accel.Show();
            })
        }

        // console.log(json);
    }
    window.videoError = otherError;
})();