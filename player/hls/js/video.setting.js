;(function(){
	
	var videoSetting = function(video, video_box) {

		var video = $(video);

		var cache = {
			width: video_box.width() || 800,
			height: video_box.height() || 540,
			vWidth: video.width() || 800,
			vHeight: video.height() || 540,
			scale:0,
			rotate:0
		}

		var addClient = [];

		var screenWidth = window.screen.width;
		var screenHeight = window.screen.height;

		var video_size = [{width:1418, height:792, height_h:850, cls:'wrap-1440'}, {width:1130, height:630, height_h: 680,cls:'wrap-1280'}, {width:970, height:540, height_h:590,cls:'wrap'}];
		var video_filter = {};

		var setFilterVideo = function  () {
			var filter = [];
			for(var i in video_filter){
				filter.push(i + ('('+video_filter[i]+')') );
			}
			if(!filter.length) {
				video.css({
					'filter':'',
					'-webkit-filter':''
				})
				return;
			}
			video.css({
				'filter': filter.join(' '),
				'-webkit-filter': filter.join(' ')
			});
		}

		return {
			addClient:function(fun){
				addClient.push(fun);
			},
			setVideoWH:function (w, h, is_full) {

				var width = cache.width;
				var height = cache.height;
				if(is_full) {
					width = screenWidth;
					height = screenHeight;
				}


				var aW = w,
					aH = h;
				var nw, nh;

				if(width/height > aW/aH) {
					if(height*(aW/aH) > width) {
						nw = width;
						nh = width/aW*aH;
					}
					else {
						nh = height;
						nw = height*(aW/aH);
					}
					
				}else {
					if(width*(aW/aH) > width) {
						nw = width;
						nh = width/aW*aH;
					}
					else {
						nw = width*(aW/aH);
						nh = height;
					}
				}
				cache.vWidth = ~~nw;
				cache.vHeight = ~~nh;
			},
			setScale:function (scale, is_full) {
				var _scale = cache.scale;
				if(typeof scale != 'undefined') {
					cache.scale = scale;
					_scale = scale;
				}

				cache.width = video_box.width();
				cache.height = video_box.height();

				var width, height;
				if(is_full) {
					width = screenWidth;
					height = screenHeight;
				}else {
					width = cache.width;
					height = cache.height;
				}

				var nw, nh;
				switch(_scale){
					case 0:
						var aW = cache.vWidth,
							aH = cache.vHeight;
						var nw, nh;
						if(width/height > aW/aH) {
							if(height*(aW/aH) > width) {
								nw = width;
								nh = width/aW*aH;
							}
							else {
								nh = height;
								nw = height*(aW/aH);
							}
							
						}else {
							if(width*(aW/aH) > width) {
								nw = width;
								nh = width/aW*aH;
							}
							else {
								nw = width*(aW/aH);
								nh = height;
							}
						}
					break;
					case 1:
					case 2:
						var aW = _scale == 1 ? 4 : 16;
						var aH = _scale == 1 ? 3 : 9;
						if(width/height > aW/aH) {
							if(height*(aW/aH) > width) {
								nw = width;
								nh = width/aW*aH;
							}
							else {
								nh = height;
								nw = height*(aW/aH);
							}
							
						}else {
							if(width*(aW/aH) > width) {
								nw = width;
								nh = width/aW*aH;
							}
							else {
								nw = width*(aW/aH);
								nh = height;
							}
						}
					break;
					case 3:
						nw = width;
						nh = height;
					break;
				}

				var bi = nw / nh;
				var biUI = width / height;
				if(biUI<bi){
					nw = width;
					nh = nw / bi;
				}else{
					nh = height;
					nw = bi * nh;
				}
				video.css({width:nw, height:nh});
				return {'width':nw, 'height':nh}
			},
			/** brightness 亮度
			* contrast 对比度
			* saturate 饱合度
			**/
			setFilter:function (key,num) {
				video_filter[key] = num+'%';
				setFilterVideo();
			},
			removeFilter:function (key) {
				if(!key) {
					video_filter = {};
				}else {
					if(video_filter[key]) {
						delete video_filter[key];
					}
				}
				setFilterVideo();
			},
			getVideoBoxWH:function () {
			    var body_width = $(window).height();
			    var _video_ = video_size[2];
			    for(var i=0;i<video_size.length;i++) {
			        if(body_width >= video_size[i].height_h ) {
			            _video_ = video_size[i];
			            break;
			        }
			    }
			    return _video_;
			},
			setRotate:function (rotate, is_full) {

				var obj = {
					'transform':'',
					'-ms-transform':'',
					'-moz-transform':'',
					'-webkit-transform':'',
					'-o-transform':''
				}
				if(rotate != 0) {
					obj = {
						'transform':'translate(-50%, -50%) rotate('+rotate+'deg)',
						'-ms-transform':'translate(-50%, -50%) rotate('+rotate+'deg)',
						'-moz-transform':'translate(-50%, -50%) rotate('+rotate+'deg)',
						'-webkit-transform':'translate(-50%, -50%) rotate('+rotate+'deg)',
						'-o-transform':'translate(-50%, -50%) rotate('+rotate+'deg)'
					}
				}
				video.css(obj);
				if(rotate == 90 || rotate == 270 || rotate == -90 || rotate == -270) {
					var width, height;
					if(is_full) {
						width = screenWidth;
						height = screenHeight;
					}else {
						width = cache.width;
						height = cache.height;
					}

					var nw = video_box.height(), nh = video_box.width();
					var bi = nw / nh;
					var biUI = width / height;
					var x, y;
					if(biUI<bi){
						nw = width;
						nh = nw / bi;
					}else{
						nh = height;
						nw = bi * nh;
					}
					video.css({width:~~nh, height:~~nw});
				}else {

					var width = cache.width;
					var height = cache.height;
					if(is_full) {
						width = screenWidth;
						height = screenHeight;
					}

					var aW = cache.vWidth,
						aH = cache.vHeight;
					var nw, nh;
					if(width/height > aW/aH) {
						if(height*(aW/aH) > width) {
							nw = width;
							nh = width/aW*aH;
						}
						else {
							nh = height;
							nw = height*(aW/aH);
						}
						
					}else {
						if(width*(aW/aH) > width) {
							nw = width;
							nh = width/aW*aH;
						}
						else {
							nw = width*(aW/aH);
							nh = height;
						}
					}
					video.css({width:~~nw, height:~~nh});
				}

				cache.rotate = rotate;
			},
			getScale:function  () {
				return cache.scale;
			},
			getRotate:function () {
				return cache.rotate;
			}
		}
	}
	window.VideoSetting = videoSetting;
})();