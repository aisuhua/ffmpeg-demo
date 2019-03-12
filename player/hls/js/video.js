;(function() {

	var __uri = function (str) {
		return str;
	}

	var isDownSubtitle = true;
	// var isRelationSubtitle = false;


	function fixTimeStr(tstr){
        if(tstr){
            tstr = tstr.replace(/^00:/,'') ;
            if(tstr=='00:00'){
                return '00:00';
            }
        }
        return tstr || '';
    }

    var DropDown = function() {
	    var e = 200;
	    return {
	        Bind: function(t) {
	            function o(o, n) {
	                function i() {
	                    r.last_show = +new Date,
	                    r.overtimer && window.clearTimeout(r.overtimer),
	                    r.Content.show(),
	                    r.ShowHandler && r.ShowHandler()
	                }
	                var r = o.data.setting;
	                return r.overtimer && window.clearTimeout(r.overtimer),
	                r.Content.is(":visible") ? !1 : (n && i(),
	                void (r.overtimer = window.setTimeout(function() {
	                    i()
	                }, t.Timeout || e)))
	            }
	            function n(o, n) {
	                function i() {
	                    r.overtimer && window.clearTimeout(r.overtimer),
	                    r.HideHandler && r.HideHandler(),
	                    r.Content.hide()
	                }
	                var r = o.data.setting;
	                return r.overtimer && window.clearTimeout(r.overtimer),
	                r.Content.is(":hidden") ? !1 : (n && i(),
	                void (r.overtimer = window.setTimeout(function() {
	                    i()
	                }, t.Timeout || e)))
	            }
	            t.Title.bind("click", {
	                setting: t
	            }, function(e) {
	                var t = e.data.setting;
	                return t.last_show && new Date - t.last_show < 100 ? !1 : (t.Content.is(":hidden") ? o(e, !0) : n(e, !0),
	                !1)
	            }).bind("mouseover", {
	                setting: t
	            }, function(e) {
	                o(e)
	            }).bind("mouseleave", {
	                setting: t
	            }, function(e) {
	                n(e)
	            }),
	            t.Content.bind("mouseover", {
	                setting: t
	            }, function(e) {
	                e.data.setting.overtimer && window.clearTimeout(e.data.setting.overtimer)
	            }).bind("mouseleave", {
	                setting: t
	            }, function(e) {
	                e.stopPropagation(),
	                n(e)
	            }).hide()
	        }
	    }
	}();


	;( function( $ ) {

        function Fullscreen( options ) {
            if(!this._initEvents) return new Fullscreen(options);
            this.options = $.extend( true, {
                'element'    : $( 'body' ),
                'css'        : {
                    'background' : '#000',
                    'width'      : '100%',
                    'height'     : '100%',
                    'position'   : 'fixed',
                    'top'        : 0,
                    'left'       : 0,
                    'z-index'    : 1000,
                    'overflow' : 'auto'
                },
                'callback'   : $.noop,
                'noSafari'	 : false
            }, options );

            //必须要全屏输入时，将safari排除
            if ( this.options.noSafari && this._browser.safari ) {
                this.fullscreenEnabled = false;
            }

            this._initEvents();
        }

        $.extend( Fullscreen.prototype, {

            /**
             * 执行全屏状态切换
             */
            toggleFullscreen: function() {
                if ( !this.fullscreenEnabled ) {
                    return;
                }

                if ( this.fullscreen() ) {
                    this.exitFullscreen();
                }
                else {
                    var wp = $( '<div/>' ).css( this.options.css ),
                        el = this.options.element.addClass( 'fullscreen' );

                    el.wrap( wp ); // 虽然wp包围el，但变量wp中的内容不会变，仍然是一个空的div

                    // 下面参数在chrome下用 `wp.get(0)` 是正常的，但firefox不行
                    this.requestFullscreen( el.parent().get( 0 ) );
                }
            },

            /**
             * 注册事件，监视fullscreenchange
             */
            _initEvents: function() {
                if ( !this.fullscreenEnabled ) {
                    return;
                }
                var me = this,
                    doc = $( document );

                doc.unbind( 'fullscreenchange webkitfullscreenchange mozfullscreenchange' )
                    .bind(
                        'fullscreenchange webkitfullscreenchange mozfullscreenchange',
                        function( evt ) {
                            if ( !me.fullscreen() ) {
                                if(me.options.element.is('.fullscreen')){
                                    me.options.element.removeClass( 'fullscreen' ).unwrap();
                                }

                            }
                            me.options.callback.call( me, me.fullscreen() );
                        }
                    );
            },

            /**
             * 判断浏览器类型
             */
            _browser: ( function() {
                var ua = window.navigator.userAgent.toUpperCase(),
                    v = {};

                v.chrome = /CHROME/.test( ua );
                v.safari = !v.chrome && /SAFARI/.test( ua );

                return v;
            } )(),

            /**
             * 判断当前全屏状态
             */
            fullscreen: function() {
                return document.fullscreen ||
                    document.webkitIsFullScreen ||
                    document.mozFullScreen ||
                    false;
            },

            /**
             * W3 draft
             * document.fullscreenElement
             *     Returns the element that is displayed fullscreen,
             *     or null if there is no such element.
             *
             * @return {DOM/null} 全屏显示的元素或是null
             */
            fullscreenElement: function() {
                return document.fullscreenElement ||
                    document.webkitCurrentFullScreenElement ||
                    document.mozFullScreenElement ||
                    null;
            },

            /**
             * W3 draft:
             *     document.fullscreenEnabled
             *     Returns true if document has the ability to display elements fullscreen,
             *     or false otherwise.
             */
            fullscreenEnabled: ( function() {
                var doc = document.documentElement;

                return	( 'requestFullscreen' in doc ) ||
                    ( 'webkitRequestFullScreen' in doc ) ||
                    ( 'mozRequestFullScreen' in doc && document.mozFullScreenEnabled ) ||
                    false;
            } )(),

            /**
             * W3 draft:
             *     element.requestFullscreen()
             *     Displays element fullscreen.
             *
             * @param {DOM} elem 要全屏显示的元素
             */
            requestFullscreen: function( elem ) {
                if (elem.requestFullscreen) {
                    elem.requestFullscreen();
                }
                else if (elem.webkitRequestFullScreen) {
                    if ( this._browser.chrome ) {
                        elem.webkitRequestFullScreen( Element.ALLOW_KEYBOARD_INPUT );
                    }
                    else {
                        elem.webkitRequestFullScreen();
                    }
                }
                else if (elem.mozRequestFullScreen) {
                    elem.mozRequestFullScreen();
                }
            },

            /**
             * W3 draft:
             *     document.exitFullscreen()
             *	   Stops any elements within document from being displayed fullscreen.
             */
            exitFullscreen: function() {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                }
                else if (document.webkitCancelFullScreen) {
                    document.webkitCancelFullScreen();
                }
                else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                }
            }
        } );

        $.fullscreen = Fullscreen;
    } )( jQuery );


    var getThumbXY = function (config, currentTime) {

		if(!config || $.isEmptyObject(config)){
			return;
		}



		var width = config.width,
			height = config.height,
			interval = config.interval,
			url_arr = config.url;

		// var pageTime = interval * 10 * 10;
		var numImage = ~~(currentTime/10);
		var page = ~~(numImage/100);
		var y = ~~( (numImage - page * 100)/10 )
		var x = numImage%10;



		var obj = {
			url:url_arr[page],
			y:y * height,
			x:x * width
		}
		return obj
	}

	var setUserSetting = function (obj) {

    }



    var paremt = oofUtil.getQueryParams(location.href);

	var pickcode = paremt['pickcode'] || 'eozkevon6kf6ezlxe';


	if(Hls.isSupported()) {

		var video_config = {
			last_volume: oofUtil.cookies.get('last_video_volume') ? (oofUtil.cookies.get('last_video_volume')/100) : 1,
			user_def:0,
			start_time:0,
			one_tips:true,
			showLoading:false,
			scale:0,
			is_full:0,
			sub_text:'',
			sub_list:[],
			zoom:1,
			last_level:0,
			min_par:1,
			addTime:0,
			reat:1
		}

	    var video = $('#js-video')[0];

	    var $video_box = $('#js-video_box'),
	    	$start_time = $video_box.find('[rel="start"]'),
	    	$end_time = $video_box.find('[rel="end"]'),
	    	$loaded = $video_box.find('[rel="loaded"]'),
	    	$loading = $video_box.find('[rel="loading"]'),
	    	$play = $video_box.find('[btn="play"]'),
	    	$progress = $video_box.find('[rel="progress"]'),
	    	$tips = $video_box.find('[rel="tips"]'),
	    	$tips_image = $video_box.find('[rel="tips_image"]'),
	    	$tips_image_time = $tips_image.find('[rel="time_text"]'),
	    	$tips_time = $tips.find('[rel="time_text"]'),
	    	$volume = $video_box.find('[rel="volume"]'),
	    	$volume_list = $video_box.find('[rel="volume_list"]'),
	    	$volume_in = $video_box.find('[rel="volume_in"]'),
	    	$volume_value = $video_box.find('[rel="volume_value"]'),
	    	$fullscreen = $video_box.find('[rel="fullscreen"]'),
	    	$loading_image = $video_box.find('[rel="loading_image"]'),
	    	$cover = $video_box.find('[rel="cover"]'),
	    	$level_btn = $video_box.find('[rel="level"]'),
	    	$cover_bg = $video_box.find('[rel="cover_bg"]'),
	    	$levels_list = $video_box.find('[rel="level_list"]'),
	    	$setting = $video_box.find('[rel="setting"]'),
	    	$setting_list = $video_box.find('[rel="setting_list"]'),
	    	$play_big = $video_box.find('[rel="play_big"]'),
	    	$play_reload = $video_box.find('[rel="play_reoload"]'),
	    	$subtitle = $video_box.find('[rel="subtitle"]'),
	    	$subtitle_list = $video_box.find('[rel="subtitle_list"]'),
	    	$subtitle_show = $video_box.find('[rel="subtitle_show"]'),
	    	$menu = $video_box.find('[rel="menu"]'),
	    	$full_menu = $video_box.find('[rel="full_menu"]'),
	    	$quit_full = $video_box.find('[rel="quit_full"]'),
	    	$zoom = $video_box.find('[rel="zoom"]'),
	    	$sub_size = $video_box.find('[rel="sub_size"]'),
	    	$sub_time = $video_box.find('[rel="sub_time"]'),
	    	$sub_size_input = $video_box.find('[rel="sub_size_input"]'),
	    	$sub_time_input = $video_box.find('[rel="sub_time_input"]'),
	    	$rotate = $video_box.find('[btn="rotate"]'),
	    	$min_par = $video_box.find('[rel="min_par"]'),
	    	$filter_list = $video_box.find('[rel="filter_list"]');


	    
	    var $wrap = $('.wrap');
	    var $uploadSubtitle = $('#js-upload_subtitle');

	    var $opeList = $('#js_pl_control_expand');
	    var $m3u8Error = $('#js-m3u8_error');
	    var $video_filter = $('#js-video_filter');


		var hls = new videoHLS();
	    var subTitle = new HlsSubtitle();
	    var videoSetting = new VideoSetting(video, $video_box);
	    var log;

	    window.GolSubTitle = subTitle;


	    //导入录制gif代码
	    //
		var $gifImg = $('<span style="cursor:pointer;z-index:3;padding:10px;position:absolute;right:10px;top:calc(45% - 40px);color:#fff;font-weight:700;width:20px;height:20px;background-color:rgba(0,0,0,0.5);border-radius:20px;;" title="GIF" id="js-canver_video_btn">GIF</span>');
		var gif, gifdg;
	    window.QUEUE_URL && $.getScript(__uri('/static/plug/video_js_hls/js/gif.js'), function() {
    		$video_box.append($gifImg);
    		gif = new GIF({
				workers: 2,
				workerScript: '/static/plug/video_js_hls/js/gif.worker.js',
				quality: 10
			});
			gif.on('finished', function(blob) {
				Core.MinMessage.Hide();
				if(gifdg) {
					gifdg.warp.find('[btn="confirm"]').hide();
		    		gifdg.warp.find('[open]').show();
		    		gifdg.warp.find('img').attr('src', URL.createObjectURL(blob));
		    		gifdg.warp.find('[open]').attr('href', URL.createObjectURL(blob));
				}
			});
			gif.on('progress', function(p) {
				gifdg && Core.MinMessage.Show({
					text:'生成中('+Math.round(p * 100)+'%)',
					type:'load',
					time:2000
				})
			})
	    });

	    $gifImg.on('click', function() {

	    	gif.abort();
    		gif.frames = [];


		    var min = 0, mtime = 175;
		    var cam = 1;

	    	var canvas = document.createElement("canvas");
		    canvas.width = video.videoWidth * scale/cam;
		    canvas.height = video.videoHeight * scale/cam;
		    var _width = $video_box.width();
		    if(canvas.width < _width) {
		    	_width = canvas.width;
		    }else {
		    	_width *= 0.8;
		    }
		    if(_width > 800)  {
		    	_width = 800;
		    }

		    if(!_width) {
		    	Core.MinMessage.Show({
		    		text:'视频未加载完成',
		    		type:'war',
		    		timeout:2000
		    	})
		    	return false;
		    }

		    var img = document.createElement('img');
		    img.style.width = '100%';
		    img.style.height = (_width/canvas.width * canvas.height)*cam + 'px';
		    img.style.display = 'block';
		    var div = document.createElement('div');
		    div.style.position ='relative';
		    div.style.border = '2px solid #fff';
		    div.appendChild(img);
		    var span = $('<span style="position:absolute;top:10px;right:10px;color:#fff;"></span>');
		    $(div).append(span);


		    if(canvas.width > 480) {
		    	canvas.height = (480/canvas.width * canvas.height);
		    	canvas.width = 480;
		    }


		    var mtm = setInterval(function() {
		    	if(min >= ~~(10000/mtime)) {
		    		clearInterval(mtm);
		    		gif.render();
		    		// gifdg && gifdg.warp.find('[btn="confirm"]').hide();
		    		// gifdg && gifdg.warp.find('[open]').show();
		    	}
		    	canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
		    	img.src = canvas.toDataURL("image/png");
				gif.addFrame(canvas, {copy: true,delay: mtime});
				min++;
				gifdg && gifdg.warp.find('span').text( ~~(mtime*min/1000)+'秒' );
		    },  mtime);

		   
		    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
		    img.src = canvas.toDataURL("image/png");
			gif.addFrame(canvas, {copy: true,delay: mtime});


		    gifdg = new Core.DialogBase({
		    	title:'录像',
		    	width: _width*cam,
		    	content:div
		    });
		    gifdg._Close = gifdg.Close;
		    gifdg.Close = function() {
		    	gifdg._Close();
		    	gifdg.Close = gifdg._Close;
		    	mtm && clearInterval(mtm);
				Core.MinMessage.Hide();
				gif && gif.abort();
		    }


		    gifdg.Open(function () {
		    	gifdg.warp.append('<div class="dialog-action">'+
		    						'<a href="javascript:;" class="dgac-cancel" style="" btn="cancel">取消</a>'+
		    						'<a href="javascript:;" class="dgac-confirm" btn="confirm">停止录像</a>'+
		    						'<a href="javascript:;"  download="'+($('#js-video_title').text()+'_'+(+new Date()))+'.gif" open style="display:none;" target="_blank" class="dgac-confirm">下载GIF</a>'+
		    					'</div>');
		    	gifdg.warp.find('[btn="cancel"],[btn="confirm"]').click(function () {
		    		mtm && clearInterval(mtm);
		    		if($(this).attr('btn') == 'confirm') {
		    			gif.render();
		    			
		    		}else {
		    			gifdg.Close();
		    		}
		    		return false;
		    	})
		    });
			return false;
	    })

	    //切图
	    var $creatImg = $('<span id="js-canver_video_bg" style="z-index:3;position:absolute;right:10px;top:48%;width:20px;height:20px;overflow:hidden;background:#000;border:10px solid #000;border-radius:20px;opacity:0.5"></span><a href="javascript:;" style="z-index:3;position:absolute;right:10px;top:48%;background:url(\''+__uri('images/icon_screenshots.svg')+'\') no-repeat 0px 0px;background-size:contain;width:20px;height:20px;border:10px solid transparent" title="截图" id="js-canver_video_btn"></a>');
		$video_box.append($creatImg);
		var scale = 1;

		$creatImg.on('click', function () {
			var canvas = document.createElement("canvas");
		    canvas.width = video.videoWidth * scale;
		    canvas.height = video.videoHeight * scale;

		    var _width = $video_box.width();
		    if(canvas.width < _width) {
		    	_width = canvas.width;
		    }else {
		    	_width *= 0.8;
		    }

		    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
		    var img = document.createElement('img');
		    img.src = canvas.toDataURL("image/png");
		    img.style.width = '100%';
		    img.style.height = (_width/canvas.width * canvas.height) + 'px';
		    img.style.display = 'block';
		    var div = document.createElement('div');
		    div.style.border = '2px solid #fff';
		    div.appendChild(img);
		    var dg = new Core.DialogBase({
		    	title:'截图',
		    	width: _width,
		    	content:div
		    });
		    dg.Open(function () {
		    	dg.warp.append('<div class="dialog-action">'+
		    						'<a href="javascript:;" class="dgac-cancel" style="" btn="cancel">取消</a>'+
		    						'<a href="'+img.src+'" target="_blank" download="'+($('#js-video_title').text()+'_'+(+new Date()))+'.png" class="dgac-confirm" btn="confirm">下载截图</a>'+
		    					'</div>');
		    	dg.warp.find('[btn="cancel"],[btn="confirm"]').click(function () {
		    		dg.Close();
		    	})
		    });
		    Core.MinMessage.Show({text:'截图成功',type:'suc',timeout:1000});
			return false;
		})


	    //视频倍速
	    var $playRate,
	    	$playRateList,
	    	userAgent = navigator.userAgent,
	    	reatList = ['0.5', '1.0', '1.25', '1.5', '1.75', '2.0'];
	    // if(userAgent.indexOf("Chrome") != -1 || userAgent.indexOf("Safari") != -1) {
	    	$playRate = $('<li style="display: "><a href="javascript:;" class="btn-cle"><s>1.0倍</s></a></li>');
	    	$playRateList = $('<div class="popup-menu" style="display: ;">'+
	    							'<i class="arrow"></i>'+
			                        '<div class="cell" rel="list"></div>'+
			                    '</div>');
	    	var _html = [];
	    	for(var i=reatList.length-1;i>=0;i--) {
	    		var ikey = reatList[i];
	    		_html.push('<a href="javascript:;" class="_3G" reat="'+(ikey*1)+'">'+ikey+'倍</a>');
	    	}
	    	$playRateList.find('[rel="list"]').html(_html.join(''));
	    	$playRate.append($playRateList);

	    	$playRateList.find('[reat="1"]').addClass('current');

		    $level_btn.parent().before($playRate);


		    Util.DropDown.Bind({
		    	Title:$playRate,
		    	Content:$playRateList,
		    	IsOverShow:true
		    })

		    $playRateList.on('click', '[reat]', function () {
		    	var $this = $(this),
		    		reat = $this.attr('reat')*1;
		    	$playRateList.find('.current').removeClass('current');
		    	$this.addClass('current');
		    	$playRate.find('s').text($this.text());
		    	$playRateList.hide();
		    	video.playbackRate = reat;
		    	video_config.reat = reat;
				setUserSetting({play_speed: reat});
		    	return false;
		    })
	    // }
	    //视频倍速 end;
	    //
	    //
	    try{

        }catch(e){}




		//下载字幕文件
		var parseTime = function(str) {
			var nRet = 0;
			if (str != "") {
				var arr1 = str.split(",");
				var nMs = parseInt(arr1[1]);
				var arr2 = arr1[0].split(":");
				var nH = parseInt(arr2[0]);
				var nM = parseInt(arr2[1]);
				var nS = parseInt(arr2[2]);
				nRet += nS * 1000;
				nRet += nM * 60 * 1000;
				nRet += nH * 60 * 60 * 1000;
				nRet += nMs;
			}             
			return nRet;         
		}

		var parseToTime = function (time, is_ass) {
			time = time*1;
			var l = time%1000;
			time -= l;
			time = time/1000;
			var nH = ~~(time/3600);
			var nM = ~~((time - (nH*3600))/60);
			var nS = time%60;

			if(is_ass && l*1 > 100) {
				l = ~~(l/10);
			}

			if(is_ass) {
				if(l < 10) {
					l = '0' + l;
				}
			}else {
				if(l >= 10 && l < 100) {
					l = '0'+l;
				}else if(l < 10) {
					l = '00'+l;
				}
			}

			var t = ( nH < 10 && !is_ass ? '0'+nH : nH )+':'+( nM < 10 ? '0'+nM : nM )+':'+( nS < 10 ? '0'+nS : nS )+','+l;
			return t;
		}


	    // playbackRate

	    //视频初始化
	    var VideoHLSInit = function (json, time) {

	    	if(json.video_url) {
	    		json.video_url = json.video_url.replace(/http(|s):\/\//, '//');
	    	}

	    	if(json.subtitle_info && json.subtitle_info.length) {
	    		for(var i=0;i<json.subtitle_info.length;i++) {
	    			var item = json.subtitle_info[i];
	    			item.url = item.url.replace(/http(|s):\/\//, '//');
	    		}
	    	}

	    	// time = 29;
	    	video_config.start_time = time;
	    	video_config.user_def = json.user_def;

	    	if(json.outline_info) {

	    		var outline_info = json.outline_info.url || [];
	    		for(var i=0;i<outline_info.length;i++) {
	    			var item = outline_info[i];
	    			item = item.replace(/http(|s):\/\//, '//');
	    		}

		    	video_config.outline_info = json.outline_info;
	    	}

	    	video_config.info = json;

	    	if(video_config.start_time) {
	    		hls.setConfig('startPosition', video_config.start_time);
	    		var time_text = fixTimeStr(oofUtil.date.numFormat(video_config.start_time * 1000, 'hh:mm:ss') || '00:00:00')
	    		$menu.append('<div id="js-tips_time_remove" style="position:absolute;left:0px;text-indent:10px;top:-35px;line-height:32px;color:#ccc;background:rgba(0, 0, 0, 0.3);;width:100%;border-top:1px solid #3a3a3a;height:35px;">已经从上次观看点('+time_text+')处播放 <a href="javascript:;" style="color: #008dff;" data-start-btn="1">从头开始播放</a></div>');
	    		setTimeout(function () {
	    			$('#js-tips_time_remove').fadeOut('slow', function () {
	    				$('#js-tips_time_remove').remove();
	    			})
	    		},5000);
	    	}

	    	if(json.duration) {
		        $end_time.text(fixTimeStr(oofUtil.date.numFormat(json.duration * 1000, 'hh:mm:ss') || '00:00:00'));
		    }

	    	/**
	    	*设置初始清晰度
	    	**/
	    	var definition_list = json.definition_list || [];
	    	var arr = [];
	    	for(var i in definition_list) {
	    		arr.push(i*1);
	    	}
	    	arr.sort(function (a, b) {
	    		return a - b
	    	});

	    	var def = $.inArray(video_config.user_def*1, arr);

	    	if(def == -1) {
	    		var mdef = video_config.user_def*1;
	    		if(mdef = 15000000) {
	    			def = arr.length - 1;
	    		}else {
	            	for(var i=0;i<arr.length;i++) {
	                    if(mdef >= arr[i]) {
	                        def = i;
	                    }
	                }
	    		}
	    	}
	    	def = def == -1 ? 0 : def;

	    	video_config.last_level = def;

	    	hls.setCurrentLevel(video_config.last_level);

	    	hls.load(json.video_url, video, def, json.type || false);

	    	var subtitle_info = json.subtitle_info || [];

	    	video_config.sub_list = subtitle_info;

	    	if(subtitle_info.length) {
	    		var subtitle = subtitle_info[0];
				subTitle.load(subtitle.url);
	    	}

	    	if(window.videoLog) {
	    		log = new videoLog(hls, video);
	    	}

	    }

	    var setCurrentUI = function (ind) {
	    	var levels = hls.levels(),
				currentLevel = ind;
			var level = levels[currentLevel];
			if(level) {
				video_config.last_level = level;
				var name = (level.name || '').toUpperCase();
				$level_btn.attr('class', 'btn-cle bc-'+(name == 'BD' ? 'UD' : name)).html('<s>'+(name == 'BD' ? '&nbsp;&nbsp;&nbsp;' : '')+levelsText[name]+'</s><em>'+(name == 'BD' ? 'HD' : name)+'</em>')
			}
	    }


	    video.volume = video_config.last_volume;
	    /**
	    *hls 回调
	    **/
	    var levelsText = {'3G':'标清','SD':'高清','HD':'超清','UD':'1080P','BD':'4K','YH':'原画'};
	    var errorList = {};
	    var errorNumber = 0;
	    var errorFunTime;
	    var is_reply_levels = false;
	    var $errorNextFrag = $('<div style="position:absolute;left:15px;top:10px;color:#fff;display:;"></div>')
	    var errorNextFragTimer;
	    var oldcurSn = -1;
	    var _getNextFrag = function (frag) {
	    	var levels = hls.levels(),
				currentLevel = hls.currentLevel(),
				level = levels[currentLevel];
			if(level && level.details) {
				try{
					var details = level.details;
					var fragments = details.fragments || [];
					var curSn = frag.sn - details.startSN;
					if(curSn + 1 <= frag.sn) {
						curSn += 1;
					}
					if(oldcurSn == curSn+1) {
						curSn += 1;
					}

					if(oldcurSn > curSn+1) {
						curSn = oldcurSn;
					}
					// console.log(oldcurSn, curSn);
					oldcurSn = curSn+1;
					var nextFrag = fragments[curSn + 1] || false;
					if(nextFrag) {
						$errorNextFrag.text('片断'+frag.sn+'加载失败跳过，继续加载片断'+(curSn+1)).show();
						$video_box.append($errorNextFrag);
					}
					errorNextFragTimer && clearTimeout(errorNextFragTimer);
					errorNextFragTimer = setTimeout(function () {
						$errorNextFrag.hide();
					}, 2000);
					return nextFrag;
				}catch(e){
					return false;
				}
			}
			return false;
	    }
	    hls.addClient(function(event, data){
	    	// debugger;
	    	switch(event){
	    		case 'hlsLevelSwitched':
	    			setCurrentUI(hls.currentLevel());
	    		break;
	    		case 'hlsLevelLoaded':
		    		var totalduration = ~~(data.details.totalduration||0);
		        	$end_time.text(fixTimeStr(oofUtil.date.numFormat(totalduration * 1000, 'hh:mm:ss') || '00:00:00'));
	    		break;
	    		case 'hlsLevelLoading':
	    		case 'hlsLevelUpdated':
	    		break;
	    		case 'hlsManifestParsed':

	    			var level_ind = -1;
	    			var levels = hls.levels() || [];
	    			try{
	    				if(levels[0]['width'] && levels[0]['height']) {
	    					videoSetting.setVideoWH(levels[0]['width'], levels[0]['height']);
	    				}
	    				videoSetting.setScale(0);
	    			}catch(e){
	    				// console.log(e);
	    			}
	    			if(levels.length > 1) {
	    				$level_btn.parent().show();
	    				if(!is_reply_levels) {
	    					setCurrentUI(video_config.last_level);
	    					is_reply_levels = true;
	    				}
	    			}
		    		video.play();
	    		break;
	    		case 'hlsInitPtsFound':
	    			video_config.one_tips = false;
	    			$cover_bg.hide();	    			
	    		break;
	    		case 'hlsError':
	    			var errorType = data.type;
				    var errorDetails = data.details;
				    var errorFatal = data.fatal;
	    			window.console && console.log(data);

			    	// 

	    			if(errorFatal) {
	    				if(errorType == 'networkError') {
	    					var networkDetails = data.networkDetails;
	    					if(networkDetails && networkDetails.status == 200 && networkDetails.responseType == 'text' && networkDetails.responseText) {
	    						try{
		    						var json = JSON.parse(networkDetails.responseText);
		    						if(!json.state && (json.errcode == 911 || json.code == 911) ){

		    							if(!json.data || !json.data.url) {
		    								Core.Message.Confirm({
		    									text:'切换太频繁，请刷新页面重试',
		    									confirm_text:'立即刷新',
		    									callback:function (r) {
		    										if(r) {
		    											location.reload();
		    										}
		    									}
		    								})
		    								return false;
		    							}
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
						        }catch(e){}
	    					}
	    					// hls.startLoad();
	    				}
	    			}

				    // if(errorFatal){
						switch(errorType) {
							case 'mediaError':

								var url = '';
								try{
									url = data.context.url;
								}catch(e){}
								try{
									url = data.frag.url;
								}catch(e){}
								if(url) {
									if(url.indexOf('c300') != -1 && data.frag) {
										var nextFrag = _getNextFrag(data.frag);
										if(nextFrag) {
											hls.stopLoad();
											video.currentTime = nextFrag.start;
											hls.startLoad(nextFrag.start);
											return false;
										}
									}
								}
								// if(errorFatal) {
									hls.recoverMediaError();
									try{
										video.play();
									}catch(e){}
								// }
							break;
							case 'networkError':
								var url = '';
								try{
									url = data.context.url;
								}catch(e){}
								try{
									url = data.frag.url;
								}catch(e){}

								if(url) {

									if(!errorList[url]) {
										errorList[url] = 2;
									}
									errorList[url]++;

									if(errorNumber >= 20 || errorList[url] >= 5) {

									}else {
										if(data.networkDetails && data.networkDetails.status == 403) {
						    				hls.setConfig('startPosition', video.currentTime);
	    									hls.reload();
						    				return false;
						    			}
									}


									if(url.indexOf('c300') != -1 && data.frag) {
										var nextFrag = _getNextFrag(data.frag);
										if(nextFrag) {
											hls.stopLoad();
											video.currentTime = nextFrag.start;
											hls.startLoad(nextFrag.start);
											errorNumber = 0;
											return false;
										}
									}

									var showErrorUI = false;
									if(url.indexOf('.m3u8') != -1) {
										// console.log('清单加载失败');
										if(errorList[url] < 5) {
											hls.setConfig('startPosition', video.currentTime);
											hls.reload();
											return false;
										}else {
											showErrorUI = true;
										}
									}

									// var isToGo = false;
									// if(data.networkDetails) {
									// 	if(data.networkDetails.status == 404 || data.networkDetails.status == 503) {
									// 		isToGo = true;
									// 	}
									// }
									// if(data.details == 'fragLoadTimeOut' || data.details == 'fragLoadError') {
									// 	isToGo = true;
									// }

									// if( isToGo ) {
									// 	var nextFrag = _getNextFrag(data.frag);
									// 	if(nextFrag) {
									// 		hls.startLoad(nextFrag.start);
									// 		return false;
									// 	}
									// }


									if(errorNumber >= 20 || errorList[url] >= 5) {
										showErrorUI = true;
									}

									if(showErrorUI) {
										hls.destroy();
										var response = data.response;

										if(!response) {
											response = {
												text:data.details || '',
												code:data.type || ''
											}
										}

										if(data.type) {
											response.code = data.type;
										}
										if(data.details) {
											response.text = data.details;
										}

										if(response.text) {
											if(response.text.indexOf('manifest') != -1) {
												response.text = '视频清单异常';
											}else if(response.text.indexOf('level') != -1) {
												response.text = '清晰度切换异常';
											}else if(response.text.indexOf('frag') != -1) {
												response.text = '片断加载异常';
											}else if(response.text.indexOf('buffer') != -1) {
												response.text = '缓存加载异常';
											}
											if(window.videoCode && data.details && videoCode[data.details]) {
												response.text += '('+videoCode[data.details]+')';
											}
										}
										if(response.code && window.videoType && videoType[response.code]) {
											response.code = videoType[response.code];
										}

										$m3u8Error.show();
										$m3u8Error.find('[rel="text"]').text(response.text || '网络异常，请刷新重试');
										$m3u8Error.find('[rel="code"]').attr('code',response.code).text('错误码：'+response.code);
										return false;
									}
									if(errorList[url] >= 3) {
										video.currentTime -= 10;
									}
									errorNumber++;
								}
							break;
							default:
							break;
						}
					// }
	    			// hls.hls().stopLoad();
	    		break;
	    		case 'hlsFragBuffered':
	    			video_config.showLoading = false;
	    		break;
	    		case 'hlsFragLoadProgress':
	    		break;
	    	}
	    	if(video_config.one_tips || video_config.showLoading) {
	    		if($loading_image.is(':hidden')) {
	    			$loading_image.show();
	    			video_config.errorKart && video_config.errorKart();
	    		}
	    		if($cover_bg.is(':hidden')) {
	    			// $cover_bg.show();
	    		}
	    	}
	    	// console.log('event:'+event);
	    })

		

	    /**
	    *定时获取当前播放时间与缓存
	    **/
	    window.setInterval(function () {
	    	if(video){

		    	var currentTime = ~~(video.currentTime||0),
		    		buffered = ~~(video.buffered ||0),
		    		duration = ~~(video.duration || 0);

		    	
		    	 
		        $start_time.text(fixTimeStr(oofUtil.date.numFormat(currentTime * 1000, 'hh:mm:ss') || '00:00:00'));

		        if(currentTime > 0 && duration > 0) {
	    			$loading.css({
		        		'width': ~~((currentTime/duration)*10000)/100+'%'
	    			})
		        }

		       
		        var r = video.buffered;
		        if(r && r.length) {
		        	for (var i=0, bufferLen=0; i<r.length; i++) {
		        		var start = r.start(i),
		        			end = r.end(i);
		        		if(currentTime >= start && end >= currentTime && !video.seeking) {
		        			var _width = ~~((end/duration)*10000)/100;
		        			if(_width > 100) {
		        				_width = 100;
		        			}
		        			$loaded.css({
				        		'width': _width+'%'
			    			})
		        		}
		        	}
		        }

		        var sub_text = subTitle.get(~~(video.currentTime*1000) + video_config.addTime);
		        sub_text = sub_text.replace(/\n/g, '<br>');
		        if(sub_text.length) {
		        	$subtitle_show.is(':hidden') && $subtitle_show.show();
		        	$subtitle_show.html('<p>'+sub_text+'</p>');
		        }

		        if(!sub_text.length && !$subtitle_show.is(':hidden')) {
		        	$subtitle_show.hide();
		        }

		        if(video.readyState == 0 || video.readyState == 1 || video_config.showLoading) {
		        	if($loading_image.is(':hidden')) {
		        		$loading_image.show();
	    				video_config.errorKart && video_config.errorKart();
		        	}
		        }else {
		        	if(!$loading_image.is(':hidden')) {
		        		$loading_image.hide();
		        		video_config.errorKart && video_config.errorKart(true);
		        	}
		        }
	    	}
	    },100);

	    var initWidthHeight = false;
		function handleVideoEvent(evt) {
			var data = '';
			$loading_image.hide();
			if(this.videoHeight*1 && this.videoHeight*1 && !initWidthHeight && video_config.info && video_config.info.type) {
				videoSetting.setVideoWH(this.videoWidth, this.videoHeight);
        		videoSetting.setScale();
				initWidthHeight = true;
			}
			switch(evt.type) {
				case 'play':
				case 'playing':
					$play.children('i').removeClass('iop-playing').addClass('iop-pausing');
					video_config.showLoading = false;
	    			video_config.errorKart && video_config.errorKart(true);
	    			if(!$play_big.is(':hidden')){
	    				$play_big.hide();
	    			}
				break;
				case 'pause':
	    			$play.children('i').removeClass('iop-pausing').addClass('iop-playing');
	    			video_config.errorKart && video_config.errorKart(true);
				break;
				case 'seeking':
				case 'seeked':
				case 'loadedmetadata':
				case 'durationchange':
					$loading_image.show();
	    			video_config.errorKart && video_config.errorKart();					
				break;
				case 'seeked':
					if(video.paused) {
						video.play();
					}
	    			video_config.errorKart && video_config.errorKart(true);
				break;
				case 'ended':
					$play_reload.show();
	    			video_config.errorKart && video_config.errorKart(true);
				break;
				case 'error':
					// console.log(evt);
				break;
			}

			if(video_config.reat != video.playbackRate) {
				video.playbackRate = video_config.reat;
			}

		}


		video.addEventListener('resize', handleVideoEvent);
		video.addEventListener('seeking', handleVideoEvent);
		video.addEventListener('seeked', handleVideoEvent);
		video.addEventListener('pause', handleVideoEvent);
		video.addEventListener('play', handleVideoEvent);
		video.addEventListener('canplay', handleVideoEvent);
		video.addEventListener('canplaythrough', handleVideoEvent);
		video.addEventListener('ended', handleVideoEvent);
		video.addEventListener('playing', handleVideoEvent);
		video.addEventListener('error', handleVideoEvent);
		video.addEventListener('loadedmetadata', handleVideoEvent);
		video.addEventListener('loadeddata', handleVideoEvent);
		video.addEventListener('durationchange', handleVideoEvent);


		/**
		*清晰度列表
		**/
		$level_btn.on('click', function () {

			if(video.readyState == 0) {
				return;
			}

			var levels = hls.levels(),
				currentLevel = hls.currentLevel();
			if(!$levels_list.find('[btn]').length) {
	        	var html = [];
				for(var i=0;i<levels.length;i++) {
					var level = levels[i],
						name = (level.name || '').toUpperCase(),
						text = levelsText[name] || name;
					if(text) {
						html.push('<a href="javascript:;" ind="'+i+'" btn="level" class="_'+name+ ( i == currentLevel ? ' current' : '' ) +'">'+text+'</a>');
					}
				}
				$levels_list.find('[rel="list"]').html(html.join(''));
			}
			$levels_list.show()
			$cover_bg.show();
			return false;
		})
		$levels_list.on('click', '[rel="close"]', function () {
			$levels_list.hide();
			$cover_bg.hide();
			return false;
		}).on('click', '[btn="level"]', function () {
			var $this = $(this),
				ind = $this.attr('ind');
			$loading_image.show();

			video_config.errorKart && video_config.errorKart();

			video_config.showLoading = true;
			

			$levels_list.find('.current').removeClass('current');
			$this.addClass('current');

			setTimeout(function () {
				// body...
				$levels_list.add($cover_bg).hide();
				$cover_bg.hide();
			},500);

			hls.currentLevel(ind*1);
	    	setCurrentUI(ind*1);


	    	var levels = hls.levels();

	    	var level = levels[ind];
	    	if(level) {

	    	}

			return false;
		})



		$menu.on('click', '[data-start-btn="1"]', function () {
			hls.setConfig('startPosition', -1);
			video.currentTime = 0;
			$(this).parent().remove();
			$loaded.add($loading).css({'width': '0%'});
			return false;
		})


		/**
		*播放暂停
		**/
		$play.add($play_big).add($play_reload).on('click', function () {

			hls.setConfig('startPosition', -1);
			$play_reload.hide();

			if(video.ended) {
	    		// hls.load('//115.com/api/video/m3u8/'+(paremt['pick_code'] || 'eozkevon6kf6ezlxe')+'.m3u8');
	    		hls.reload();
				$loaded.add($loading).css({'width': '0%'});
				return false;
			}

			if(video.paused) {
				video.play();
				$play_big.hide();
			}else {
				video.pause();
				$play_big.show();
			}
			return false;
		});
		$cover.on('click', function () {
			$play.trigger('click');
			return false;
		})


		/**
		*跳进
		**/
		$progress.on('click', function (e) {
			var offsetX = e.pageX - $(this).offset().left,
				width = $progress.width();
			var duration = ~~(video.duration || 0);
			if(duration) {
				if(video.paused) {
					$play.trigger('click');
				}
				var css_left = ~~(offsetX/width*10000)/100;
				var to_time = ~~(duration * (css_left/100));
				video.currentTime = to_time;
				if(css_left > 100) {
					css_left = 100;
				}
				$loaded.css({'width': css_left+'%'});
			}
			return false;
		})


		/**
		*时间tips
		**/
		var showTimeTips,
			hideTimeTips,
			TimeTipsOut = 200;

		var $node_thumb = $('<div style="margin:2px;overflow:hidden;"></div>');
		$tips_image.find('b').after('<i class="arrow"></i>');
		$tips_image.show().wrap('<div class="progress-drag"></div>');
		$tips_image = $tips_image.parent().hide();
		var _thumb_error = false;
		$progress.on('mouseenter mousemove', function (e) {
			showTimeTips && clearTimeout(showTimeTips);
			hideTimeTips && clearTimeout(hideTimeTips);
			menuTimeOut && clearTimeout(menuTimeOut);
			

			var offsetX = e.pageX - $(this).offset().left,
				duration = ~~(video.duration || 0),
				width = $progress.width();
			var _ = function () {
				if(duration) {
					var css_left = ~~(offsetX/width*10000)/100;
					var to_time = ~~(duration * (css_left/100));
					if(to_time >= duration || to_time<=0) {
						return;
					}
					$tips_time.add($tips_image_time).text(fixTimeStr(oofUtil.date.numFormat(to_time * 1000, 'hh:mm:ss') || '00:00:00'))

					if(video_config.outline_info && !_thumb_error) {
						if(video_config.outline_info.width) {
							$tips_image.find('[rel="tips_image"]').css({
								left:-video_config.outline_info.width/2+'px'
							})
						}
						if(!$tips_image.find($node_thumb).length) {
							$tips.show().css({
								left:offsetX+'px'
							})
							var time_width = $tips_time.width();
							$tips_time.parent().css({
								left:'-'+(time_width/2+6)+'px'
							})

							var thumbXY = getThumbXY(video_config.outline_info, to_time);
							if(!thumbXY) {
								return;
							}
							var img = document.createElement('img');
							img.onload = function () {
								$tips.hide();
								$tips_image.find('[rel="tips_image"]').prepend($node_thumb);
								$node_thumb.width(video_config.outline_info.width);
								$node_thumb.height(video_config.outline_info.height);
								$node_thumb.css({
									'background-image':'url('+thumbXY['url']+')',
									'background-position': (-thumbXY.x) + 'px '+ (-thumbXY.y) + 'px'
								})
								$tips_image.show().css({
									left:offsetX - ($tips_image.width() /2) +'px',
									'z-index':2
								});
							}
							img.onerror = function () {
								_thumb_error = true;
							}
							img.src = thumbXY.url;
							return;
						}
						$tips_image.show().css({
							left:offsetX - ($tips_image.width() /2) +'px',
							'z-index':2
						});
						var thumbXY = getThumbXY(video_config.outline_info, to_time);
						if(!thumbXY) {
							return;
						}
						$node_thumb.css({
							'background-image':'url('+thumbXY['url']+')',
							'background-position': (-thumbXY.x) + 'px '+ (-thumbXY.y) + 'px'
						})
					}else {
						$tips.show().css({
							left:offsetX+'px'
						})
						var time_width = $tips_time.width();
						$tips_time.parent().css({
							left:'-'+(time_width/2+6)+'px'
						})
					}
				}
			}
			if($tips.is(':hidden') && $tips_image.is(':hidden')) {
				showTimeTips = setTimeout(function () {
					_();
				},TimeTipsOut);
			}else {
				_();
			}
			return false;
		}).on('mouseleave', function () {
			showTimeTips && clearTimeout(showTimeTips);
			hideTimeTips && clearTimeout(hideTimeTips);
			hideTimeTips = setTimeout(function () {
				$tips.add($tips_image).hide();
			},TimeTipsOut);
			$menu.trigger('mouseleave');
			return false;
		})

		/**
		*菜单min
		*bar-mini
		**/
		var menuTimeOut;
		$video_box.on('mousemove', function () {

			if($menu.hasClass('bar-mini')) {
				$menu.removeClass('bar-mini');
			}

			$menu.show();
			$creatImg.show();
			$gifImg.show();

			if($full_menu.is(':hidden') && video_config.is_full) {
				$full_menu.show();
			}

			menuTimeOut && clearTimeout(menuTimeOut);
			menuTimeOut = setTimeout(function () {
				$menu.addClass('bar-mini');
				$creatImg.hide();
				$gifImg.hide();


				$full_menu.hide();

				if(!video_config.min_par) {
					$menu.hide();
				}

			},2000);
		}).on('mouseleave', function () {
			menuTimeOut && clearTimeout(menuTimeOut);
			if(!$menu.hasClass('bar-mini')) {
				menuTimeOut = setTimeout(function () {
					if(!video_config.min_par) {
						$menu.hide();
						$creatImg.hide();
						$gifImg.hide();

					}else {
						$menu.show();
						$creatImg.show();
						$gifImg.show();
					}
					$menu.addClass('bar-mini');
					video_config.is_full && $full_menu.show();
				},2000);
			}
			$progress.trigger('mouseleave');
		})
		$menu.on('mouseenter mousemove', function (e) {
			$menu.show();
			$creatImg.show();
			$gifImg.show();

			menuTimeOut && clearTimeout(menuTimeOut);
			$menu.removeClass('bar-mini');
			e.stopPropagation();
		}).on('mouseleave', function (e) {
			$video_box.trigger('mousemove');
			e.stopPropagation();
		});
		$full_menu.on('mouseenter', function (e) {
			menuTimeOut && clearTimeout(menuTimeOut);
			video_config.is_full && $full_menu.show();
			e.stopPropagation();
		}).on('mouseleave', function (e) {
			$video_box.trigger('mousemove');
			e.stopPropagation();
		});

		$min_par.on('change', function () {
			video_config.min_par = $(this).prop('checked') ? 1 : 0;
			setUserSetting({video_progress_bar: video_config.min_par});
		})

		/**
		*缩放
		**/
		$zoom.on('click', '[zoom]', function () {
			var $this = $(this),
				zoom = $this.attr('zoom');


			video_config.zoom = zoom;

			if($this.hasClass('current')) {
				return false;
			}
			$zoom.find('.current').removeClass('current');
			$this.addClass('current');
			if(zoom  == 'full') {
				zoom = 1;
				setTimeout(function () {
					videoSetting.setScale(3, video_config.is_full);
				},1);
			}


			$(video).css({'zoom':zoom*1});
			return false;
		})


		/**
		*音量设置
		**/
		var showTimeTips,
			hideTimeTips,
			TimeTipsOut = 200;
		
		video_config.last_volume = video.volume;

		$volume.on('click', function () {
			var $this = $(this);
			if(video.volume) {
				$this.find('.iop-volume').removeClass('iop-volume').addClass('iop-novolume');
				video_config.last_volume = video.volume;
				video.volume = 0;
			}else {
				$this.find('.iop-novolume').removeClass('iop-novolume').addClass('iop-volume');
				video.volume = video_config.last_volume;
			}
			return false;
		})

		DropDown.Bind({
			Title:$volume,
			Content:$volume_list,
			ShowHandler:function () {
				var value = ~~(video.volume*100)+'%';
				$volume_in.height(value);
				$volume_value.text(value);
			}
		});



		var setVolumeFun = function (value, showTips) {
			if(value > 100 || value < 0) {
				value = 0;
			}else if(value >= 95) {
				value = 100;
			}else if(value <= 5) {
				value = 0;
			}

			if(value > 0) {
				video_config.last_volume = value/100;
				oofUtil.cookies.set('last_video_volume', value, 3650);
			}

			$volume_in.height( value+'%' );
			$volume_value.text( value+'%' );
			video.volume = value/100;;

			if(value == 0) {
				$volume.find('.iop-volume').removeClass('iop-volume').addClass('iop-novolume');
			}else {
				$volume.find('.iop-novolume').removeClass('iop-novolume').addClass('iop-volume');
			}

			if(showTips) {
				window.console && console.log('音量：'+value);
			}

		}
		$volume_list.on('click', function (e) {
			var $this = $(this),
				height = $this.height(),
				offsetY = e.pageY - $volume_list.offset().top;

			var value = 100 - ~~( offsetY/height * 100 );
			setVolumeFun(value);
			return false;
		})

		/**
		*全屏
		**/
		var fullscreen = $.fullscreen({
            callback:function (isf) {
				video_config.is_full = isf;
            	if(!isf){
            		$('html').removeClass('video-fullscreen');
					$(video).css({'zoom':1});
					$full_menu.hide();
                    $opeList.parent().parent().show();
                    $video_container.css({'padding-right':''});
                    $fullscreen.find('i').removeClass('iop-exitfull');
            	}else {
            		$full_menu.show();
            		$('html').addClass('video-fullscreen');
                    $opeList.parent().parent().hide();
                    $video_container.css({'padding-right':'0px'});
            		var zoom = video_config.zoom;
            		if(zoom == 'full') {
            			zoom = 1;
            			setTimeout(function () {
            				videoSetting.setScale(3, isf);
            			},1)
            		}
            		$(video).css({'zoom':zoom});
                    $fullscreen.find('i').addClass('iop-exitfull');
            	}
            	// videoSetting.setScale(0, video_config.is_full);
				$setting_list.find('[btn="scale"][scale="'+video_config.scale+'"]').trigger('click');
            }
        })
		$fullscreen.on('click', function () {
            if(fullscreen.fullscreenEnabled){
                if(!fullscreen.fullscreen()){
                    $video_container.css({'padding-right':'0px'});
                    fullscreen.requestFullscreen(document.documentElement);
                    $opeList.parent().parent().hide();
                    $fullscreen.find('i').addClass('iop-exitfull');
                }else{
                    $video_container.css({'padding-right':''});
                    fullscreen.exitFullscreen();
                    $opeList.parent().parent().show();
                    $fullscreen.find('i').removeClass('iop-exitfull');
                }
            }else{
            	try{
                	fullscreen.options.callback(!$('html').is('.video-fullscreen'));
            	}catch(e){}
            }
            for(var i=1;i<=8;i++) {
            	;(function (timer) {
            		setTimeout(function () {
		            	$(window).trigger('resize');
		            },timer);
            	})(i*200);
            }
            return false;
        })

        $quit_full.on('click', function () {
        	fullscreen.exitFullscreen();
        	return false;
        })

		/**
		*设置
		**/
		DropDown.Bind({
			Title:$setting,
			Content:$setting_list
		});

		$setting_list.on('click', '[btn]', function () {
			var $this = $(this),
				btn = $this.attr('btn');
			switch(btn) {
				case 'scale':
					var scale = $this.attr('scale');
					/*if($this.hasClass('blue')) {
						return false;
					}else {

					}*/
					$setting_list.find('.blue').removeClass('blue');
					$this.addClass('blue');
					video_config.scale = scale*1;
					videoSetting.setRotate(0, video_config.is_full);
					videoSetting.setScale(scale*1, video_config.is_full);
				break;
			}
		})



		/**
	     * 设置视频滤镜
	     */
	    var filterTimer;
	    $video_filter.show().on('click', function () {
	    	$filter_list.show();
			$cover_bg.show();
	    	return false;
	    })
	    $filter_list.find('.bar-tips').hide();
	    $filter_list.find('[filter]').on('input', function () {
	    	var $this = $(this),
	    		$parent = $this.parent(),
	    		value = $this.val(),
	    		key = $this.attr('filter'),
	    		maxWidth = $parent.width(),
	    		width = (value/2/100)*maxWidth;

	    	var m_width = width;
	    	if(value/2/10 > 5) {
	    		m_width -= ~~(value/2/10)*1 - 5;
	    	}else if(value/2/10 < 5) {
	    		m_width += 7 - ~~(value/2/10)*1;
	    	}
	    	$parent.find('em i').css({'width': width+'px' });
	    	$parent.find('.bar-tips').show().css({'left': m_width+'px' });
	    	$parent.find('p').text( ~~(value/2) );
	    	videoSetting.setFilter(key, value);
	    	return false;
	    }).on('mousedown', function () {
	    	var $this = $(this),
	    		$parent = $this.parent();
	    	$parent.find('.bar-tips').show();
	    }).on('mouseup', function () {
	    	var $this = $(this),
	    		$parent = $this.parent();
	    	filterTimer && clearTimeout(filterTimer);
	    	filterTimer = setTimeout(function () {
	    		$parent.find('.bar-tips').hide();
	    	}, 200);
	    })
	    $filter_list.find('[rel="filter_default"]').on('click', function () {
	    	$filter_list.find('[filter]').val(100).trigger('input').each(function () {
	    		$(this).parent().find('.bar-tips').hide();
	    	})
	    	videoSetting.removeFilter();
	    	return false;
	    })
	    $filter_list.find('.btn-close').on('click', function () {
	    	$filter_list.hide();
			$cover_bg.hide();
			return false;
	    })

		/**
		*字幕
		**/
		var $sub_list = $subtitle_list.find('[rel="sub_list"]');

		var subRelation = function () {
			/*var arr = $sub_list.find('[is_msub]');
			arr.each(function (i) {
				var $this = arr.eq(arr.length-i-1);
				$sub_list.prepend($this);
			})
			arr = $sub_list.find('[state="1"]').parent();
			arr.each(function (i) {
				var $this = arr.eq(arr.length-i-1);
				$sub_list.prepend($this);
			})*/
		}

		$subtitle.on('click', function () {
			var sub_list = video_config.sub_list || [];
			var caption = video_config.info.caption || [];

			$subtitle_list.show();
			$cover_bg.show();

			var $item = $subtitle_list.find('.selected');
			if($item.length) {
				$sub_list.parent().scrollTop(0).scrollTop($item.position().top - 45);
			}


			if(isDownSubtitle) {
				$sub_list.find('[_url]').each(function () {
					if(!$(this).find('[btn="download"]').length) {
						$(this).find('span').after('<a href="javascript:;" style="display:block;" btn="download">下载</a>');
						$(this).find('[btn="download"]').css({'border-left':'none'});
						$(this).find('[btn="del"]').css({'right':60});
					}
				})
			}
			if(video_config.info.inlay_power == 1) {
				$sub_list.parent().addClass('relation').find('[file_id]').each(function (i) {
					var $this = $(this),
						is_caption_map = $this.attr('is_caption_map') == 1 ? 1 : 0;

					if(!$this.find('[btn="relation"]').length) {
						$this.find('span').after('<a href="javascript:;" state="'+is_caption_map+'" style="border-left:none;display:block;color:#'+(is_caption_map? 'ccc' : '26a702')+'" btn="relation">'+(is_caption_map?'已内嵌':'内嵌字幕')+'</a>');
						$(this).find('[btn="download"]').css({'border-left':'none','right':85});
						$(this).find('[btn="del"]').css({'right':125});
					}
				})
			}
			subRelation();
			return false;
		})


		var DownloadSubtitle = function (obj) {
			var addTime = video_config.addTime;
			if(obj.type && obj.text) {
				var txt = obj.text,
					type = obj.type,
					txtArray = [];

				if(type == 'srt') {
					txt = txt.replace(/\n\r/g, '\n\n');
					txtArray = txt.split(/\n{2,}/);
				}else if(type == 'ass' || type == 'ssa') {
					txtArray = txt.split(/\n{1,}/);
				}
				for(var i=0;i<txtArray.length;i++) {
					var item = txtArray[i];
					if(item && item.length) {
						var reg;
						if(type == 'srt') {
							var regStr = "(\\d{1,2}:\\d{1,2}:\\d{1,2}[,|.]\\d{1,3})( |)-->( |)(\\d{1,2}:\\d{1,2}:\\d{1,2}[,|.]\\d{1,3})";
							reg = new RegExp(regStr, "gi");
						}else {
							reg = new RegExp('(\\d{1,2}:\\d{1,2}:\\d{1,2}.\\d{1,2},\\d{1,2}:\\d{1,2}:\\d{1,2}.\\d{1,2}),((|[!\u4e00-\u9fa5\\w\-\\s\*\)\(]*),(|[!\u4e00-\u9fa5\\w\-\\s\*\)\(]*),\\d*,\\d*,\\d*,(|![\u4e00-\u9fa5\\w\-\\s\*\)\(]*),(.*?))', "gi");
						}
						var rst = reg.exec(item);
						if(rst) {
							if(type == 'srt') {
								item = item.replace(rst[1], parseToTime( parseTime(rst[1])+addTime));
								item = item.replace(rst[4], parseToTime( parseTime(rst[4])+addTime));
							}else {
								var j = rst[1].split(",");
								var start = parseTime(j[0].replace(".",","))
								var end = parseTime(j[1].replace(".",","));

								item = item.replace(j[0], parseToTime( start+addTime, true).replace(',','.') );
								item = item.replace(j[1], parseToTime( end+addTime, true ).replace(',','.'));

							}
							txtArray[i] = item;
						}
					}
				}
				var downloadText;
				if(type == 'srt') {
					downloadText = txtArray.join('\n\n');
				}else {
					downloadText = txtArray.join('\n');
				}

				if(downloadText) {

					obj.name = obj.name.replace('.'+type,'');

					var uri = 'data:text/'+type+';charset=utf-8,' +  encodeURIComponent(downloadText);
					var link = document.createElement("a");
					link.href = uri;
					link.download = obj.name+'.'+type;
					link.click();
					link = null;
				}
			}
		}

		var downloading = false;
		$subtitle_list.on('click', '[btn]',function () {
			var $this = $(this),
				$parent = $this.parents('[_url]'),
				btn = $this.attr('btn'),
				url = $parent.attr('_url');
			switch(btn) {
				case 'close':
					$subtitle_list.hide();
					$cover_bg.hide();
				break;
				case 'del':
					$this.parent().removeClass('selected');
					subTitle.clear();
				break;
				case 'download':
					if(downloading) {
						return;
					}
					var type = url.indexOf('srt') != -1 ? 'srt' : 'ass';
					if(url.indexOf('ssa') != -1) {
						type = 'ssa';
					}
					Core.MinMessage.Show({text:'提取字幕中...',type:'load', timeout:99999})
					var name = $parent.find('span').text();
					if(url == 'is_file') {
						type = $parent.attr('_type');
						DownloadSubtitle({
							type:type,
							text:video_config.sub_text,
							name:name,
						})
						downloading = false;
						Core.MinMessage.Hide();
					}else {
						downloading = true;
						$.ajax({
							url: url,
							type: 'get',
							success:function (r) {
								Core.MinMessage.Hide();
								downloading = false;
								if(r) {
									DownloadSubtitle({
										type:type,
										text:r,
										name:name
									})
								}
							},
							error:function () {
								Core.MinMessage.Hide();
								downloading = false;
								// body...
							}
						})
					}
				break;
				case 'relation':
					var state = $this.attr('state');
					if(state == 1) {
						$.ajax({
							url: '//webapi.115.com/movies/del_caption_map',
							type: 'post',
							dataType: 'json',
							data: {map_id: $parent.attr('map_id')},
							success:function (r) {
								if(r.state) {
									Core.MinMessage.Show({text:'取消内嵌成功',type:'suc', timeout:2000});
									$parent.attr('is_caption_map', 0);
									$this.attr('state', 0);
									$this.css({'color':'#26a702'}).text('内嵌字幕');
									subRelation();
								}else {
									Core.MinMessage.Show({text:r.message || r.msg || '网络异常，请刷新重试',type:'err', timeout:2000});
								}
							}
						})
					}else {
						$.ajax({
							url: '//webapi.115.com/movies/add_caption_map',
							type: 'post',
							dataType: 'json',
							data: {
								type: 1,
								caption:[{
									file_id: $parent.attr('file_id'),
									sha1: $parent.attr('sha1'),
									pick_code: $parent.attr('pick_code'),
									source_file_sha1: window.FID,
									file_name: $parent.attr('_title')
								}]
							},
							success:function (r) {
								if(r.state) {
									Core.MinMessage.Show({text:'内嵌成功',type:'suc', timeout:2000});
									$parent.attr('is_caption_map', 1);
									$this.attr('state', 1);
									$parent.attr('map_id', r.data['map_id']);
									$this.css({'color':'#ccc'}).text('已内嵌');
									subRelation();
								}else {
									Core.MinMessage.Show({text:r.message || r.msg || '网络异常，请刷新重试',type:'err', timeout:2000});
								}
							}
						})
					}
				break;
			}
			return false;
		}).on('click', '[_url]', function () {
			var $this = $(this),
				url = $this.attr('_url');
			if($this.hasClass('selected')) {
				return false;
			}
			$subtitle_list.find('.selected').removeClass('selected');
			$this.addClass('selected');

			if(url == 'is_file') {
				subTitle.clear();
				subTitle.set(video_config.sub_text, $this.attr('_type'));
			}else {
				subTitle.load(url);
			}

			setTimeout(function () {
				// $subtitle_list.hide();
				// $cover_bg.hide();
			}, 500);
			return false;
		})

		/**
		*解析本地字幕
		**/
		if($uploadSubtitle.length) {
			$uploadSubtitle[0].onchange = function (e) {
				var files = $uploadSubtitle[0].files;
				if(files.length) {
					var file = files[0];
					var name = file.name;
					var type = name.substring( name.lastIndexOf('.')+1, name.length );
				    var reader = new FileReader();
				    var is_rep = false;
				    reader.onload = function() {
				    	if(this.result.indexOf('�') != -1 && !is_rep) {
				    		reader.readAsText(file, 'GB2312');
				    		is_rep = true;
				    	}else {
				    		$sub_list.find('.selected [btn="del"]').trigger('click');
					    	video_config.sub_text = this.result;
					    	subTitle.clear();
					    	subTitle.set(video_config.sub_text, type);
					    	$sub_list.find('[is_file]').remove();

					    	if(isDownSubtitle) {
								$sub_list.prepend('<li _url="is_file" _type="'+type+'" is_file="1" class="selected"><span>'+file.name+'</span><a href="javascript:;" style="display:block;border-left:none;" btn="download">下载</a><a href="javascript:;" btn="del" style="right:60px;border-left:none;">取消</a></li>');
					    	}else {
								$sub_list.prepend('<li _url="is_file" _type="'+type+'" is_file="1" class="selected"><span>'+file.name+'</span><a href="javascript:;" btn="del">取消</a></li>');
							}
				    	}
				    };
				    reader.readAsText(file);
				}
			}
		}


		$sub_size_input.add($sub_time_input).on('input', function () {
			var $this = $(this),
				type = $this.attr('rel');
				value = $this.val()*1;
			if(type == 'sub_size_input') {
				$sub_size.width(~~((value - 16) * 2.5)+'%');
				$subtitle_show.css({'font-size': ~~value + 'px' });
			}else {
				$sub_time.width( ~~(value/100 + 100)/2 +'%');
				video_config.addTime = value;
				// subTitle.addTime(~~(value * 100/100))
			}
			var $parent = $this.parents('.cell:first');
			if(type == 'sub_time_input') {
				var _tips = ~~(value/100)/10;
				$parent.children('p:first').text('字幕同步'+(_tips != 0 ? '('+(_tips > 0 ? '+' : '') + _tips+'秒)' : ''));
			}else {
				$parent.children('p:first').text('字幕大小'+'('+value+'px)');
			}
			return;
		}).each(function () {
			var $this = $(this),
				type = $this.attr('rel');
			$(this).parent().find('em').on('click', function (e) {
				var num = e.pageX - $(this).offset().left;
				var width = $(this).width();

				var val;
				if(type == 'sub_time_input') {
					val = ~~(num/width*1000)/1000;
					val = val*20000 - 10000;
				}else {
					val = ~~(num/width*1000)/1000;
					val = ~~(val*40 + 16);
				}
				$this.val( val ).trigger('input');
			})
		})

		$sub_size_input.parents('.cell:first').children('p:first').text('字幕大小(32px)');

		/**
		*旋转视频
		**/
		$rotate.on('click', function () {
			var $this = $(this),
				rotate = $this.attr('rotate');
			var old_rotate = videoSetting.getRotate();
			if(rotate == 'left') {
				old_rotate -= 90
			}else {
				old_rotate += 90;
			}
			if(old_rotate >= 360 || old_rotate <= -360) {
				old_rotate = 0;
			}

			// videoSetting.setScale(0, video_config.is_full);
			$setting_list.find('[scale="0"]').trigger('click');
			videoSetting.setRotate(old_rotate);
			return false;
		})
	    


        /**
        *快捷键
        **/
        var toTimeNumber = 30,
        	toVolumeNumber = 10;
        var $tips_seek_node = $('<div style="position:absolute;left:20px;top:20px;font-size:14px;z-index:3;color:#fff;"></div>');
        var $tips_sound_node = $('<div style="position:absolute;z-index:3;right:70px;top:-30px;color:#fff;font-size:14px;width:40px;text-align:center;">100%</div>');
        var tips_seek_time;
        var tips_sound_time;
        $video_box.append($tips_seek_node.hide());
        $menu.append($tips_sound_node.hide());
        $(window).on('keyup', function (e) {
        	var key = e.keyCode;
        	var duration = ~~(video.duration || 0),
        		currentTime = ~~(video.currentTime || 0),
        		volume = ~~(video.volume*10000/100);
        	switch(key) {
        		case 32:
        			$play.trigger('click');
        		break;
        		case 37://左
        			toTimeNumber = 15;
        			if(!duration) {
        				return;
        			}
        			if(video.paused) {
						$play.trigger('click');
					}
        			if(currentTime - toTimeNumber <= toTimeNumber ){
        				video.currentTime = 0;
        			}else {
        				video.currentTime -= toTimeNumber;
        			}
        		break;
        		case 39://右
        			toTimeNumber = 30;
        			if(!duration) {
        				return;
        			}
        			if(video.paused) {
						$play.trigger('click');
					}
        			if(currentTime + 10 >= duration) {
        				video.currentTime = duration - 10;
        			}else {
	        			video.currentTime += toTimeNumber;
        			}
        		break;
        		case 38: //上
        			volume += toVolumeNumber;
        			if(volume >= 100) {
        				video.volume = 1;
        				volume = 100;
        			}
        			setVolumeFun(volume, true);
        		break;
        		case 40: //下
        			volume -= toVolumeNumber;
        			if(volume <= 0) {
        				video.volume = 0;
        				volume = 0;
        			}
        			setVolumeFun(volume, true);
        		break;
        	}

        	if(key == 37 || key == 39) {
        		var durn = (video.currentTime / video.duration)*10000;
		        $tips_seek_node.show().text(fixTimeStr(oofUtil.date.numFormat(video.currentTime * 1000, 'hh:mm:ss') || '00:00:00')+'('+(~~durn)/100+'%)');
        		tips_seek_time && clearTimeout(tips_seek_time);
        		tips_seek_time = setTimeout(function () {
        			$tips_seek_node.hide();
        		},3000);
        	}else if(key == 38 || key == 40) {
        		$tips_sound_node.show().text(volume+'%');
        		tips_sound_time && clearTimeout(tips_sound_time);
        		tips_sound_time = setTimeout(function () {
        			$tips_sound_node.hide();
        		},3000);
        	}
        })

        $(window).on('resize', function () {
        	var obj = videoSetting.getVideoBoxWH();
        	$wrap.attr('class', 'wrap');
        	$('.vdr-transcoding').attr('class', 'vdr-transcoding');
        	if(!video_config.is_full) {
	        	$wrap.addClass(obj.cls);
	        	$('.vdr-transcoding').addClass(obj.cls.replace('wrap', 'vdr-transcoding'))
        	}
        	videoSetting.setScale();
        }).trigger('resize');


        /**
        *视频列表打开
        **/
        var $video_container = $('#js-video_container');
        $opeList.on('click', function () {
        	var $this = $(this),
        		is_open = $this.hasClass('vpls-open');
        	if(is_open) {
        		$video_container.addClass('playlist-show');
        		$this.attr('class', 'vpls-close');
        	}else {
        		$video_container.removeClass('playlist-show');
        		$this.attr('class', 'vpls-open');
        	}

        	var getScale = videoSetting.getScale();
        	var getRotate = videoSetting.getRotate();

			videoSetting.setRotate(getRotate*1, video_config.is_full);
			videoSetting.setScale(0, video_config.is_full);
			videoSetting.setScale(getScale*1, video_config.is_full);

        	return false;
        })

        /**
        *反馈问题
        **/
        $m3u8Error.on('click', '[btn]', function () {
        	var $this = $(this),
        		btn = $this.attr('btn');
        	if(btn == 'reload') {
        		location.reload();
        		return false;
        	}
        	$error_node_btn.trigger('click');
        	return false;
        })


        /**
        *卡顿反馈
        **/
        var $error_node_btn = $('<a href="javascript:;" style="z-index:2000000;" class="video-prompt-btn">投诉卡顿</a>');
        $video_box.append($error_node_btn.hide());

        var errorKartTime;
	    video_config.errorKart = function(clear) {
	    	errorKartTime && clearTimeout(errorKartTime);
	    	if(!clear) {
	    		errorKartTime = setTimeout(function () {
	    			$error_node_btn.show();
	    		}, 10000);
	    	}else {
	    		$error_node_btn.hide();
	    	}
	    }

        $error_node_btn.on('click', function () {
        	$(this).hide();

        	var data = {
        		user_id:window.USER_ID || '',
                file_name:$('#js-video_title').text() || '',
                pick_code:window.PICK_CODE||'',
                errno : '-1',
        		error : '投诉卡顿',
                device_id:3,
                network:'wifi',
                device_name:'',
                device_isp:'',
                device_arch:'',
                device_os:'',
                device_rom:''
        	}

        	if(!$m3u8Error.is(':hidden')) {
        		data.errno = $m3u8Error.find('[rel="code"]').attr('code');
        		data.error = $m3u8Error.find('[rel="text"]').text();
        	}


        	var _hls = hls.hls();
        	var level = _hls.levels[_hls.loadLevel];
        	var currentTime =  video.currentTime || 0;
        	var fragments = level.details.fragments;
        	var url = '';
        	for(var i=0;i<fragments.length;i++) {
        		var item = fragments[i];
        		if(item.start >= currentTime && currentTime <= item.start + item.duration) {
        			url = item.relurl || '';
        			break;
        		}
        	}
        	data['play_domain'] = '';
        	data['play_url'] = url;
        	data['play_definition'] = levelsText[level.name] || _hls.loadLevel;
        	data['part_json'] = JSON.stringify(log.get());
        	$.ajax({
	            url:'//playlog.115.com/api/savelog',
	            xhrFields:{
		    		withCredentials:true
		    	},
	            type: 'POST',
	            dataType: 'json',
	            data: data,
	            success:function () {
	               Core.MinMessage.Show({type:'suc',text:'谢谢反馈,我们会尽快处理',timeout:2000});
	            }
	        })
        	return false;
        })


        /**
        *esc关闭弹层
        **/
        $(window).on('keyup', function (e) {
        	if(e.keyCode == 27) {
        		$video_box.find('[rel="subtitle_list"],[rel="level_list"],[rel="cover_bg"],[rel="filter_list"]').hide();
        	}
        })
        // $(window).focus();

	}

	window.VideoHLS = VideoHLSInit;

})();
