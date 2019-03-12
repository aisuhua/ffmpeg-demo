;(function () {

	var videoErrorCode = {
		// Identifier for a manifest load error - data: { url : faulty URL, response : { code: error code, text: error text }}
		'manifestLoadError':501,
		// Identifier for a manifest load timeout - data: { url : faulty URL, response : { code: error code, text: error text }}
		'manifestLoadTimeOut':502,
		// Identifier for a manifest parsing error - data: { url : faulty URL, reason : error reason}
		'manifestParsingError':503,
		// Identifier for a manifest with only incompatible codecs error - data: { url : faulty URL, reason : error reason}
		'manifestIncompatibleCodecsError':504,
		// Identifier for a level load error - data: { url : faulty URL, response : { code: error code, text: error text }}
		'levelLoadError':505,
		// Identifier for a level load timeout - data: { url : faulty URL, response : { code: error code, text: error text }}
		'levelLoadTimeOut':506,
		// Identifier for a level switch error - data: { level : faulty level Id, event : error description}
		'levelSwitchError':507,
		// Identifier for an audio track load error - data: { url : faulty URL, response : { code: error code, text: error text }}
		'audioTrackLoadError':508,
		// Identifier for an audio track load timeout - data: { url : faulty URL, response : { code: error code, text: error text }}
		'audioTrackLoadTimeOut':509,
		// Identifier for fragment load error - data: { frag : fragment object, response : { code: error code, text: error text }}
		'fragLoadError':510,
		// Identifier for fragment loop loading error - data: { frag : fragment object}
		'fragLoopLoadingError':511,
		// Identifier for fragment load timeout error - data: { frag : fragment object}
		'fragLoadTimeOut':512,
		// Identifier for a fragment decryption error event - data: {id : demuxer Id,frag: fragment object, reason : parsing error description }
		'fragDecryptError':513,
		// Identifier for a fragment parsing error event - data: { id : demuxer Id, reason : parsing error description }
		// will be renamed DEMUX_PARSING_ERROR and switched to MUX_ERROR in the next major release
		'fragParsingError':514,
		// Identifier for a remux alloc error event - data: { id : demuxer Id, frag : fragment object, bytes : nb of bytes on which allocation failed , reason : error text }
		'remuxAllocError':515,
		// Identifier for decrypt key load error - data: { frag : fragment object, response : { code: error code, text: error text }}
		'keyLoadError':516,
		// Identifier for decrypt key load timeout error - data: { frag : fragment object}
		'keyLoadTimeOut':517,
		// Triggered when an exception occurs while adding a sourceBuffer to MediaSource - data : {  err : exception , mimeType : mimeType }
		'bufferAddCodecError':518,
		// Identifier for a buffer append error - data: append error description
		'bufferAppendError':519,
		// Identifier for a buffer appending error event - data: appending error description
		'bufferAppendingError':520,
		// Identifier for a buffer stalled error event
		'bufferStalledError':521,
		// Identifier for a buffer full event
		'bufferFullError':522,
		// Identifier for a buffer seek over hole event
		'bufferSeekOverHole':523,
		// Identifier for a buffer nudge on stall (playback is stuck although currentTime is in a buffered area)
		'bufferNudgeOnStall':524,
		// Identifier for an internal exception happening inside hls.js while handling an event
		'internalException':525,
		// Malformed WebVTT contents
		'webVTTException':526
	}

	var videoErrorType = {
	  // Identifier for a network error (loading error / timeout ...)
	  'networkError':1501,
	  // Identifier for a media Error (video/parsing/mediasource error)
	  'mediaError':1502,
	  // Identifier for a mux Error (demuxing/remuxing)
	  'muxError':1503,
	  // Identifier for all other errors
	  'otherError':1504
	}
	if(!window.Hls) {
		window.Hls = function (setting) {
			return {
				levels:[],
				config:{},
				on:function () {
					// body...
				},
				loadSource:function () {
					// body...
				},
				attachMedia:function () {
					// body...
				},
				recoverMediaError:function () {
					// body...
				},
				detachMedia:function () {
					// body...
				},
				startLoad:function () {
					// body...
				},
				stopLoad:function () {
				},
				destroy:function () {
				}
			}
		}
		Hls.isSupported = function () {
			return true;
		}
		Hls.Events = Hls.ErrorTypes = Hls.ErrorDetails = {};
	}

	var videoHLS = function (setting) {

		var m3u8Overtime,
			is_vertime = false;

        var client = [];
		var netWorkClient = [];

		var config = $.extend({},setting,{
			debug:false,
			// maxBufferLength:20,
			// maxMaxBufferLength:50,
			// maxStarvationDelay:10,
			// maxLoadingDelay:10,
			nudgeOffset:1,
			// maxBufferSize: 10 * 1024 * 1024,
			maxBufferLength:30*5,
			maxMaxBufferLength:60*5,
			maxBufferHole:10,
			// maxSeekHole:2,
			lowBufferWatchdogPeriod:5,
			highBufferWatchdogPeriod:5,
			enableWorker:true,
			enableSoftwareAES:true,
			maxFragLookUpTolerance:5,
			stretchShortVideoTrack:true,
			// liveSyncDurationCount:5,
			// liveMaxLatencyDurationCount:5,
			xhrSetup: function(xhr, url) {
		      xhr.withCredentials = true; // do send cookies
		    },
			autoStartLoad:true,

			fragLoadingMaxRetry:3,
			manifestLoadingMaxRetry:1,
			levelLoadingMaxRetry:2,
			nudgeMaxRetry:2,
			readystatechange:function (event) {
				var target = event.currentTarget;
				var headers = target.getAllResponseHeaders();
				for(var i=0;i<netWorkClient.length;i++) {
					var item = netWorkClient[i];
					if(typeof item == 'function') {
						item(headers, target, event);
					}
				}
			}

			// capLevelToPlayerSize:false
        });

		var hls = new Hls(config);

	    var _url, _video;

	    var _fragments = [];
		var getclient = function (event, data) {
			// console.log([event, data]);
			for(var i=0;i<client.length;i++) {
				var item = client[i];
				if(typeof item == 'function') {
					item(event, data, hls);
				}
			}
			switch(event){
				case 'hlsLevelLoaded':
					_fragments = data.details.fragments;
				break;
				case 'hlsFragBuffered':
					// console.log(data);
				break;
			}
			// console.log(event);
		}
		//定时器监听要不要加载下一片断
		/*setInterval(function () {
			if(_video && _fragments) {

				try{
					var _bufferedFrags = hls.streamController._bufferedFrags || [];
					for(var i=0;i<_bufferedFrags.length;i++) {
						var frag = _bufferedFrags[i],
							currentTime = _video.currentTime,
							end = ~~frag.endDTS,
							start = ~~frag.startDTS;

						if(start >= currentTime && currentTime <= end ) {
							console.log('在缓存中'+i);
							break;
						}
					}
				}catch(e){}
			}
        	// hls.trigger(Hls.Events.FRAG_LOADING, { frag: frag });
		}, 2000);*/

		var EventList = ['MEDIA_ATTACHING',
						'MEDIA_ATTACHED',
						'MEDIA_DETACHING',
						'MEDIA_DETACHED',
						'BUFFER_RESET',
						'BUFFER_CODECS',
						'BUFFER_CREATED',
						'BUFFER_APPENDING',
						'BUFFER_EOS',
						'BUFFER_FLUSHING',
						'BUFFER_FLUSHED',
						'MANIFEST_LOADING',
						'MANIFEST_PARSED',
						'LEVEL_SWITCH',
						'LEVEL_SWITCHING',
						'LEVEL_SWITCHED',
						'LEVEL_LOADING',
						'LEVEL_LOADED',
						'LEVEL_UPDATED',
						'LEVEL_PTS_UPDATED',
						'AUDIO_TRACKS_UPDATED',
						'AUDIO_TRACK_SWITCH',
						'AUDIO_TRACK_SWITCHING',
						'AUDIO_TRACK_SWITCHED',
						'AUDIO_TRACK_LOADING',
						'AUDIO_TRACK_LOADED',
						'SUBTITLE_TRACKS_UPDATED',
						'SUBTITLE_TRACK_SWITCH',
						'SUBTITLE_TRACK_LOADING',
						'SUBTITLE_TRACK_LOADED',
						'SUBTITLE_FRAG_PROCESSED',
						'INIT_PTS_FOUND',
						'FRAG_LOADING',
						'FRAG_LOAD_PROGRESS',
						'FRAG_LOAD_EMERGENCY_ABORTED',
						'FRAG_LOADED',
						'FRAG_DECRYPTED',
						'FRAG_PARSING_INIT_SEGMENT',
						'FRAG_PARSING_USERDATA',
						'FRAG_PARSING_METADATA',
						'FRAG_PARSING_DATA',
						'FRAG_PARSED',
						'FRAG_BUFFERED',
						'FPS_DROP',
						'FPS_DROP_LEVEL_CAPPING',
						'ERROR',
						'DESTROYING',
						'KEY_LOADING',
						'KEY_LOADED',
						'STREAM_STATE_TRANSITION'
						]

		for(var i=0;i<EventList.length;i++) {
	    	;(function (key) {
	    		hls.on(Hls.Events[key], function (event, data) {
			    	getclient(event, data);
	    		})
	    	})(EventList[i]);
	    }
		/*//质量切换
	    hls.on(Hls.Events.LEVEL_SWITCHING, function (event, data) {
	    	getclient(event, data);
	    })
	    hls.on(Hls.Events.LEVEL_LOADED, function (event, data) {
	    	getclient(event, data);
	    })
	    hls.on(Hls.Events.LEVEL_LOADING, function (event, data) {
	    	getclient(event, data);
	    })
	    hls.on(Hls.Events.LEVEL_LOADED, function (event, data) {
	    	getclient(event, data);
	    })

	    //清单读取
	    hls.on(Hls.Events.MEDIA_ATTACHING, function (event, data) {
	    	getclient(event, data);
	    })
	    hls.on(Hls.Events.MEDIA_ATTACHED, function (event, data) {
	    	getclient(event, data);
	    })
	    hls.on(Hls.Events.MANIFEST_LOADING, function (event,data) {
	    	getclient(event, data);
	    })

	    hls.on(Hls.Events.MANIFEST_PARSED,function(event, data) {
	    	getclient(event, data);
		});

	    //音轨
	    hls.on(Hls.Events.AUDIO_TRACK_SWITCHING, function (event,data) {
	    	getclient(event, data);
	    })
	    hls.on(Hls.Events.AUDIO_TRACK_SWITCHED, function (event,data) {
	    	getclient(event, data);
	    })

	    //字幕
	    hls.on(Hls.Events.SUBTITLE_TRACK_LOADING, function (event,data) {
	    	getclient(event, data);
	    })
	    hls.on(Hls.Events.SUBTITLE_TRACK_LOADED, function (event,data) {
	    	getclient(event, data);
	    })


		hls.on(Hls.Events.ERROR, function (event, data) {
			getclient(event, data);
		})


		// 片断
		hls.on(Hls.Events.INIT_PTS_FOUND, function (event,data) {
	    	getclient(event, data);
	    })
	    hls.on(Hls.Events.FRAG_LOADING, function (event,data) {
	    	getclient(event, data);
	    })
	    hls.on(Hls.Events.FRAG_LOAD_PROGRESS, function (event,data) {
	    	getclient(event, data);
	    })
	    hls.on(Hls.Events.FRAG_LOAD_EMERGENCY_ABORTED, function (event,data) {
	    	getclient(event, data);
	    })
	    hls.on(Hls.Events.FRAG_LOADED, function (event,data) {
	    	getclient(event, data);
	    })

	    //解密
	    hls.on(Hls.Events.KEY_LOADING, function (event,data) {
	    	getclient(event, data);
	    })
	    hls.on(Hls.Events.KEY_LOADED, function (event,data) {
	    	getclient(event, data);
	    })*/


	    /**
	    *错误
	    **/
	    hls.on(Hls.ErrorTypes.NETWORK_ERROR, function  () {
	    	getclient(event, data);
	    })
	    hls.on(Hls.ErrorTypes.MEDIA_ERROR, function  () {
	    	getclient(event, data);
	    })
	    hls.on(Hls.ErrorTypes.OTHER_ERROR, function  () {
	    	getclient(event, data);
	    })



	    var ErrorDetails = ['MANIFEST_LOAD_ERROR',
	    					'MANIFEST_LOAD_TIMEOUT',
	    					'LEVEL_LOAD_ERROR',
	    					'LEVEL_LOAD_TIMEOUT',
	    					'LEVEL_SWITCH_ERROR',
	    					'FRAG_LOAD_ERROR',
	    					'FRAG_LOOP_LOADING_ERROR',
	    					'FRAG_LOAD_TIMEOUT',
	    					'FRAG_PARSING_ERROR',
	    					'MANIFEST_INCOMPATIBLE_CODECS_ERROR',
	    					'BUFFER_ADD_CODEC_ERROR',
	    					'BUFFER_APPEND_ERROR',
	    					'BUFFER_APPENDING_ERROR',
	    					'BUFFER_STALLED_ERROR',
	    					'BUFFER_FULL_ERROR',
	    					'BUFFER_SEEK_OVER_HOLE'
	    					]
	    for(var i=0;i<ErrorDetails.length;i++) {
	    	;(function (key) {
	    		hls.on(Hls.ErrorDetails[key], function (event, data) {
			    	getclient(event, data);
	    		})
	    	})(ErrorDetails[i]);
	    }
	    var _currentLevel;
	    var isMP4 = false;
		return {
			load:function (url, video, ind, is_mp4) {
				var _this = this;
				_url = url;
				_video = video;

				if(is_mp4) {
					_video.src = url;
					isMP4 = true;
					return;
				}

				hls.loadSource(url);
			    hls.attachMedia(video);
			    hls.currentLevel = ind || 0;
			    is_vertime = false;
			    //清单有10分钟时效性
			    m3u8Overtime && clearTimeout(m3u8Overtime);
			    m3u8Overtime = setTimeout(function () {
			    	is_vertime = true;
			    }, 9 * 60 * 1000);
			    setTimeout(function () {
			    	if(!video.paused) {
			    		_this.setConfig('startPosition', -1);
			    	}
			    }, 500);
			},
			hls:function () {
				return hls;
			},
			addNetWorkClient:function (fun) {
				netWorkClient.push(fun);
			},
			addClient:function (fun) {
				client.push(fun);
			},
			reload:function () {
				hls.detachMedia();
				this.load(_url, _video, this.currentLevel(), isMP4);

				if(isMP4) {
					_video.currentTime = 0;
					_video.autoplay = true;
					_video.play();
				}

			},
			levels:function () {
				return hls.levels;
			},
			setCurrentLevel:function  (ind) {
				_currentLevel = ind;
			},
			currentLevel:function (ind) {
				if(ind == 0 || ind) {
					//清单超过时效性从新读取总清单获取最新清单列表
					/*if(!is_vertime) {
						//onBufferReset
						var currentTime  = _video.currentTime || 0;
						hls.currentLevel = ind;
						//this.setConfig('startPosition', _video.currentTime);
						//this.load(_url, _video, ind);
					}else {
						this.setConfig('startPosition', _video.currentTime);
						hls.detachMedia();
						this.load(_url, _video, ind);
					}*/
					if(_video.currentTime > 0) {
						this.setConfig('startPosition', _video.currentTime);
					}
					hls.detachMedia();
					this.load(_url, _video, ind);
					_currentLevel = ind;
				}
				return _currentLevel;
			},
			recoverMediaError:function () {
				hls.recoverMediaError();
			},
			startLoad:function (time) {
				hls.startLoad(time);
			},
			stopLoad:function () {
				hls.stopLoad();
			},
			setConfig:function (key, value) {
				hls.config[key] = value;
			},
			destroy:function () {
				hls.destroy();
			}
		}
	}

	window.videoHLS = videoHLS;
	window.videoCode = videoErrorCode;
	window.videoType = videoErrorType;

})();
