//http://aps.115.com/transcode/1496823460/f8f32bde730265c04b01dde6c71ca306/5C7349335E7E806B3387015AD7E8A822C32D7B7A?type=.srt
;(function () {
	var subtitle = function () {


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

		var addClient = [];
		var subList = [];
		var _objSubtitle = {},
			_arrList = [],
			_cacheItem = {},
			_url = '',
			addTime = 0;
		return {
			load:function (url, type) {
				var murl = url.toLocaleLowerCase();
				if(!type) {
					type = murl.indexOf('srt') != -1 ? 'srt' : 'ass'
					if(type.indexOf('ssa') != -1) {
						type = 'ssa';
					}
				}
				type = type.toLocaleLowerCase();
				this.clear();
				_url = url;
				var _this = this;
				$.ajax({
					url: url,
					type: 'get',
					success:function (r) {
						_this.set(r, type);
					}
				})
			},
			clear:function () {
				_cacheItem = null;
				_arrList = [];
				_url = '';
				_objSubtitle = {};
			},
			addTime:function (time) {
				addTime = time;
			},
			get:function (time) {
				var _list = _arrList || [];
				var res = '';
				if(_list && _list.length){
					if(_cacheItem && _cacheItem['bt']+addTime <= time && _cacheItem['et']+addTime >= time){
						
						var key = _cacheItem['bt'] + '-' + _cacheItem['et'];
						if(_objSubtitle[key]) {
							return _objSubtitle[key];
						}
						return _cacheItem['txt'];
					}
					for(var i = 0, len = _list.length; i < len; i++){
						var item = _list[i];
						if(item['bt']+addTime <= time && item['et']+addTime >= time){
							var m = _list[i+1];
							if(m && m['bt'] == item['bt'] && m['et'] == item['et']) {
								item = m;
							}
							_cacheItem = item;
							
							var key = item['bt'] + '-' + item['et'];
							if(_objSubtitle[key]) {
								return _objSubtitle[key];
							}
							return _cacheItem['txt'];
						}
						
					}
				}
				return res;
			},
			getTimeList:function () {
				return _arrList;
			},
			addClient:function (fun) {
				addClient.push(fun);
			},
			getURL:function () {
				return _url || '';
			},
			set:function (txt, type) {
				var arrList = [];
				_objSubtitle = {};
				var old_text = {'bt':-1, 'et':-1, txt:''};
				if (txt != "") {

					var txtArray = [];
					if(type == 'srt') {
						txt = txt.replace(/\n\r/g, '\n\n');
						txtArray = txt.split(/\n{2,}/);
					}else if(type == 'ass' || type == 'ssa') {
						txtArray = txt.split(/\n{1,}/);
					}
					for(var i=0;i<txtArray.length;i++) {
						;(function (item) {
							item = item || '';
							var spReg = new RegExp("<.*?>", "gi");
							item = item.replace(/\{[^}]*\}/g,"").replace(spReg, '');
							if(item && item.length) {
								var reg;
								if(type == 'srt') {
									var regStr = "(\\d{1,2}:\\d{1,2}:\\d{1,2}[,|.]\\d{1,3})( |)-->( |)(\\d{1,2}:\\d{1,2}:\\d{1,2}[,|.]\\d{1,3})";
									reg = new RegExp(regStr, "gi");
								}else {
									reg = new RegExp('(\\d{1,2}:\\d{1,2}:\\d{1,2}.\\d{1,2},\\d{1}:\\d{1,2}:\\d{1,2}.\\d{1,2}),((|[!\u4e00-\u9fa5\\w\-\\s\*\)\(]*),(|[!\u4e00-\u9fa5\\w\-\\s\*\)\(]*),\\d*,\\d*,\\d*,(|![\u4e00-\u9fa5\\w\-\\s\*\)\(]*),(.*?))', "gi");
								}
								var rst = reg.exec(item);

								if(rst) {
									item = item.split(rst[0]);
									item = item[item.length-1];
									var txt = $.trim(item.replace(rst[0],''));

									var srtItem;

									if(type == 'srt') {
										srtItem = {"bt":parseTime(rst[1]), "et":parseTime(rst[4]), "txt": txt};
									}else {
										var j = rst[1].split(",");
										txt = txt.replace(/\\N/g,'\n');
										srtItem = {"bt":parseTime(j[0].replace(".",",")), "et":parseTime(j[1].replace(".",",")), "txt": txt};
									}

									if(srtItem['et'] - srtItem['bt'] < 1000*5*60) {
										var key = srtItem['bt']+'-'+srtItem['et'];
										if(srtItem['txt'].length) {
											if(!_objSubtitle[key]) {
												_objSubtitle[key] = srtItem['txt'];
											}else {
												_objSubtitle[key] = _objSubtitle[key].replace(/(^\n*)|(\n*$)/g,'').replace(/(^\r*)|(\r*$)/g,'');
												_objSubtitle[key] = srtItem['txt'] + '\n'+_objSubtitle[key];
											}
											arrList.push(srtItem);
										}
									}
								}
							}
						})(txtArray[i]);
					}
				}
				_arrList = arrList;
				if(!arrList.length && txt && txt.length) {
					Core.MinMessage.Show({
                        text: '字幕解析失败', type: 'err', timeout: 2000
                    });
				}
				return arrList;
			}
		}
	}
	window.HlsSubtitle = subtitle;
})();