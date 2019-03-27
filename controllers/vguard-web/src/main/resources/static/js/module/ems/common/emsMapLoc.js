$(function () {
	//初始化地图展示的高度
	$("#emsLocMap").height($(window).height());
	
	try {	
		//初始化加载地图组件并加载默认点位
		initMapPts(initMap());
	} catch (e) {
		parent.toast("网络繁忙，请稍后再试！");
	}
});

/**
 * 初始化达拉特地图
 * @returns {BMap.Map}
 */
function initMap(){
	//地图本地根据IP地址定位以及添加标尺(禁止点击地图上的地点弹出百度详情)
	var map = new BMap.Map("emsLocMap", {enableMapClick: false}); // 创建Map实例
	map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放
	
	// 百度地图API功能
//	function G(id) {
//		return document.getElementById(id);
//	}
//	var ac = new BMap.Autocomplete(    //建立一个自动完成的对象
//			{"input" : "suggestId"
//			,"location" : map
//		});
//
//	ac.addEventListener("onhighlight", function(e) {  //鼠标放在下拉列表上的事件
//	var str = "";
//		var _value = e.fromitem.value;
//		var value = "";
//		if (e.fromitem.index > -1) {
//			value = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
//		}    
//		str = "FromItem<br />index = " + e.fromitem.index + "<br />value = " + value;
//		
//		value = "";
//		if (e.toitem.index > -1) {
//			_value = e.toitem.value;
//			value = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
//		}    
//		str += "<br />ToItem<br />index = " + e.toitem.index + "<br />value = " + value;
//		G("searchResultPanel").innerHTML = str;
//	});
//
//	var myValue;
//	ac.addEventListener("onconfirm", function(e) {    //鼠标点击下拉列表后的事件
//	var _value = e.item.value;
//		myValue = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
//		G("searchResultPanel").innerHTML ="onconfirm<br />index = " + e.item.index + "<br />myValue = " + myValue;
//		
//		setPlace();
//	});
//	
//	function setPlace(){
//		map.clearOverlays();    //清除地图上所有覆盖物
//		function myFun(){
//			var pp = local.getResults().getPoi(0).point;    //获取第一个智能搜索的结果
//			longitude = pp.lng;
//			latitude = pp.lat;
//			map.centerAndZoom(pp, 12);
//			map.addOverlay(new BMap.Marker(pp));    //添加标注
//		}
//		var local = new BMap.LocalSearch(map, { //智能搜索
//		  onSearchComplete: myFun
//		});
//		local.search(myValue);
//	}
	
	//修改地图显示样式
	/*var mapStyle = [
					{
					    "featureType": "poi",
					    "elementType": "all",
					    "stylers": {
					              "visibility": "off"
					    }
					},
	                {"featureType" : "land",
	                	"elementType": "geometry",
	                	"stylers": {
	                		"color": "#24252b"
	                	}
	                },
	                {"featureType": "road",
	                	"elementType": "geometry",
	                	"stylers": {
	                		"color": "#171717",
	                		"hue": "#171717",
	                		"weight": "0.1",
	                		"lightness": -6,
	                		"saturation": -15
	                	}
	                },
	                {"featureType": "building",
	                	"elementType": "geometry",
	                	"stylers": {
	                		"color": "#2a2b2e"
	                	}
	                },
	                {"featureType": "highway",
	                	"elementType": "all",
	                	"stylers": {
	                		"lightness": -42,
	                		"saturation": -91
	                	}
	                },
	                {"featureType": "arterial",
	                	"elementType": "geometry",
	                	"stylers": {
	                		"lightness": -77,
	                		"saturation": -94
	                	}
	                },
	                {"featureType": "green",
	                	"elementType": "geometry",
	                	"stylers": {
	                		"color": "#1b1b1b"
	                	}
	                },	
	                {"featureType": "subway",
	                	"elementType": "geometry.stroke",
	                	"stylers": {
	                		"color": "#181818"
	                	}
	                },
	                {"featureType": "railway",
	                	"elementType": "geometry",
	                	"stylers": {
	                		"lightness": -52
	                	}
	                },
	                {"featureType": "all",
	                	"elementType": "labels.text.stroke",
	                	"stylers": {
	                		"color": "#313131"
	                	}
	                },	
	                {"featureType": "all",
	                	"elementType": "labels.text.fill",
	                	"stylers": {
	                		"color": "#8b8787"
	                	}
	                },	
	                {"featureType": "manmade",
	                	"elementType": "geometry",
	                	"stylers": {
	                		"color": "#1b1b1b"
	                	}
	                },
	                {"featureType": "local",
	                	"elementType": "geometry",
	                	"stylers": {
	                		"lightness": -75,
	                		"saturation": -91
	                	}
	                },	
	                {"featureType": "subway",
	                	"elementType": "geometry",
	                	"stylers": {
	                		"lightness": -65
	                	}
	                },	
	                {"featureType": "railway",
	                	"elementType": "all",
	                	"stylers": {
	                		"lightness": -40
	                	}
	                },		
	                {"featureType": "road",
	                	"elementType": "geometry",
	                	"stylers": {
	                		"color": "#171717",
	                		"hue": "#041e3b",
	                		"weight": "1.0",
	                		"lightness": -12,
	                		"saturation": -15
	                	}
	                },	
	                {"featureType": "water",
	                	"elementType": "geometry",
	                	"stylers": {
	                		"color": "#041e3b",
	                		"hue": "#041e3b",
	                		"weight": "0.1",
	                		"lightness": -12,
	                		"saturation": -15
	                	}
	                }	
	                ];
	
	//设置地图样式
	map.setMapStyle({styleJson : mapStyle});*/
	
	//设置地图范围为达拉特(参数为 西南点坐标、东北点坐标)
//	var dltBound = new BMap.Bounds(new BMap.Point(109.186042, 39.791787), new BMap.Point(111.238059, 40.909685));
//	try {	
//		BMapLib.AreaRestriction.setBounds(map, dltBound);
//	} catch (e) {
//		console.log("区域限定错误");
//	}
	//默认中心位置为达拉特
	map.centerAndZoom(new BMap.Point(116.8923,37.3045), 11);
	
	//添加地图类型控件
//	map.addControl(new BMap.MapTypeControl()); 
	
//	function showInfo(e){
//		alert(e.point.lng + ", " + e.point.lat);
//	}
//	map.addEventListener("click", showInfo);
	return map;
}

/**
 * 模拟测试点位
 */
function initMapPts(map) {
	//获取父级页面传递过来的各参数
	var lastLng = getQueryString("lng"),
		lastLat = getQueryString("lat"),
		isDisplay = getQueryString("isDisplay"); 
//	alert("lastLng" + lastLng);
//	alert("lastLat" + lastLat);
	
	//如果传递来的经纬度为空时附上默认值
	if (!lastLng || null == lastLng || "null" == lastLng || "" == lastLng || 
		!lastLat || null == lastLat || "null" == lastLat || "" == lastLat) {
		//同步执行
		$.ajaxSettings.async = false;
		//默认GIS地理定位坐标
		$.getJSON(BASE_URL + "/config/gisDefaultLocation.json",function(data){
			if(data){
				lastLng = data.longitude;
				lastLat = data.latitude;
			}
		});
	} 
	
	var cenPt = new BMap.Point(lastLng, lastLat),
	marker = new BMap.Marker(cenPt);
//	alert("lastLng1" + lastLng);
//	alert("lastLat1" + lastLat);

	
	//当点位仅用于标定时
	if ("0" == isDisplay) {
		//显示可拖动提示文字
		$(".big_map_bottom_drag").show();
		
		//绑定保存按钮事件
		$(".big_map_bottom_button_red").off("click").on("click", function() {
			var newLng = $("#newLng").val(),
				newLat = $("#newLat").val();
			window.top.GEventObject.fireEvent("LOAD_BDMAPPT_EVENT", {
				"lng": (null == newLng ? lastLng : parseFloat(newLng).toFixed(4)),
				"lat": (null == newLat ? lastLat : parseFloat(newLat).toFixed(4))
			});
			
			$(".big_map_bottom").hide();
			$(".big_map_bottom_info").show().css("visibility", "visible");
			setTimeout(function() { 
				parent.closeWin(); //关闭弹出框	
		    }, 500);
		});
		
		//绑定回到原位置按钮事件
		$(".big_map_bottom_button_white").off("click").on("click", function() {
			//隐藏与显示相应按钮区域
			$(".big_map_bottom").hide();
			$(".big_map_bottom_drag").show();
			
			//将点位移动至原位置
//			map.centerAndZoom(cenPt, 12);
			marker.setPosition(cenPt);
			map.panTo(cenPt);
		});
		
		marker.enableDragging();//可拖拽
		//marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
		
		//点位拖拽回调事件
		marker.addEventListener("dragend", function() {
			$(".big_map_bottom_drag").hide();
			$(".big_map_bottom").show();
			var curPt = marker.getPosition();       //获取marker的位置
			$("#newLng").val(curPt.lng),
			$("#newLat").val(curPt.lat);
			
			//分别显示保存、返回原位置按钮
			$(".big_map_bottom_button_red, .big_map_bottom_button_white").show();
		});
	}
	
	map.addOverlay(marker);
	map.centerAndZoom(cenPt, 12);
}

/**
 * 获取当前url访问路径后缀参数值
 * @param name
 * @returns
 */
function getQueryString(name) {
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}