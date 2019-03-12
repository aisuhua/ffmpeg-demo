;(function () {
	var log = function (hls, video) {


		var $video_box = $('#js-video_box');

		var logCache = [];

	    /*if(play$) {
	        play$.ajax({
	            // url: '/api/log',
	            url:'/api/savelog',
	            type: 'POST',
	            dataType: 'json',
	            data: data,
	            success:function () {
	               Core.MinMessage.Show({type:'suc',text:'谢谢反馈,我们会尽快处理',timeout:2000});
	            }
	        })
	    }*/

		hls.addNetWorkClient(function (header, tagret, event) {
		    var url = tagret.responseURL;
		    if(logCache.length >= 30) {
				logCache.shift();
			}
		    var obj = {};
		    for(var i=0;i<logCache.length;i++) {
				var item = logCache[i];
				if(item.url == url) {
					obj = item;
					break;
				}
			}
			// obj['ua'] = navigator.userAgent;
			if(!obj['url'] && url) {
				logCache.push(obj);

			}
			obj['header'] = header || 'null';
			obj['url'] = url;
		})
		hls.addClient(function (event, data) {
			if(!data) {
				return;
			}
			var networkDetails = data.networkDetails;
			var details = data.details;
			var frag = data.frag;

			var url;
			if(networkDetails) {
				url = networkDetails['responseURL'];
			}else if(frag) {
				url = frag.url;
			}
			if(url && frag) {
				var obj = {};
				if(logCache.length >= 30) {
					logCache.shift();
				}
				var _LogKey = frag.level+'__'+frag.sn;
				for(var i=0;i<logCache.length;i++) {
					var item = logCache[i];
					if(item.url == frag.url) {
						obj = item;
						break;
					}
				}
				if(!obj['key']) {
					obj['key'] = _LogKey;
					obj['url'] = frag._url;
					obj['ready_time'] = ~~(+new Date()/1000);
					obj['start_time'] = ~~(+new Date()/1000);
					obj['seqnum'] = frag.sn || '';
					obj['level'] = frag.level || '';
					obj['video_start_time'] = frag.start || '';
					obj['duration'] = frag.duration || '';
					obj['loading_json'] = {};
					// obj['ua'] = navigator.userAgent;
					if(!obj['header']) {
						logCache.push(obj);
					}
				}
				switch (event) {
					case 'hlsFragLoadProgress':
						var _key = frag.loaded+'';
						obj['loading_json'][_key] = ~~(+new Date()/1000);
					break;
					case 'hlsFragLoaded':
						obj.loaded_time = ~~(+new Date()/1000);
						obj.cost_time = obj.loaded_time - obj.start_time;
						if(obj.cost_time < 1) {
							obj.cost_time = 1;
						}
						obj.speed = frag.loaded/obj.cost_time;
						obj.speed = obj.speed/1024;
						if(obj.speed >= 1024) {
							obj.speed = (obj.speed/1024).toFixed(2)+'MB';
						}else {
							obj.speed = obj.speed.toFixed(2)+'KB';
						}
						break;
					case 'hlsError':
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

						obj.error_time = ~~(+new Date()/1000);
						obj.error_code = response.code;
						obj.error_msg = response.code + ' ' + response.text;
						obj.cost_time = obj.error_time - obj.start_time;

						if(obj.cost_time < 1) {
							obj.cost_time = 1;
						}
						if(obj.cost_time && obj.loaded) {
							obj.speed = obj.loaded/obj.cost_time;
							obj.speed = obj.speed/1024;
							if(obj.speed >= 1024) {
								obj.speed = (obj.speed/1024).toFixed(2)+'MB';
							}else {
								obj.speed = obj.speed.toFixed(2)+'KB';
							}
						}
						// console.log(obj);
						// console.log(logCache);
						break;
				}
			}else if(url && details) {
				// console.log(details);
			}
			
			// console.log(logCache);

			if((details || frag) && networkDetails) {
				// console.log(networkDetails.responseURL);
		        // console.log(networkDetails.getAllResponseHeaders());
			}
		})
		return {
			get:function () {
				return logCache;
			}
		}
	}
	window.videoLog = log;
})();