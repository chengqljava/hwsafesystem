//经纬度
var longitude,latitude
$(function () {
	
	//alert(document.getElementById("longitude"));
	//$("#longitude").val(document.getElementById("longitude").value);
	
	//初始化地图展示的高度
	$("#testMap").height($(window).height());
	
	//初始化加载地图组件
	window.map = initMap();
	window.allMesOverlays = []; //测量时所画出的覆盖物数组
	
	//加载默认点
	initMapPts(window.map)
});

/**
 * 初始化达拉特地图
 * @returns {BMap.Map}
 */
function initMap(){
	// 百度地图API功能
	function G(id) {
		return document.getElementById(id);
	}
	
	//地图本地根据IP地址定位以及添加标尺(禁止点击地图上的地点弹出百度详情)
	var map = new BMap.Map("testMap", {enableMapClick: false}); // 创建Map实例
	map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放
	
	var ac = new BMap.Autocomplete(    //建立一个自动完成的对象
			{"input" : "suggestId"
			,"location" : map
		});

	ac.addEventListener("onhighlight", function(e) {  //鼠标放在下拉列表上的事件
	var str = "";
		var _value = e.fromitem.value;
		var value = "";
		if (e.fromitem.index > -1) {
			value = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
		}    
		str = "FromItem<br />index = " + e.fromitem.index + "<br />value = " + value;
		
		value = "";
		if (e.toitem.index > -1) {
			_value = e.toitem.value;
			value = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
		}    
		str += "<br />ToItem<br />index = " + e.toitem.index + "<br />value = " + value;
		G("searchResultPanel").innerHTML = str;
	});

	var myValue;
	ac.addEventListener("onconfirm", function(e) {    //鼠标点击下拉列表后的事件
	var _value = e.item.value;
		myValue = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
		G("searchResultPanel").innerHTML ="onconfirm<br />index = " + e.item.index + "<br />myValue = " + myValue;
		
		setPlace();
	});
	
	function setPlace(){
		map.clearOverlays();    //清除地图上所有覆盖物
		function myFun(){
			var pp = local.getResults().getPoi(0).point;    //获取第一个智能搜索的结果
			longitude = pp.lng;
			latitude = pp.lat;
			map.centerAndZoom(pp, 12);
			map.addOverlay(new BMap.Marker(pp));    //添加标注
		}
		var local = new BMap.LocalSearch(map, { //智能搜索
		  onSearchComplete: myFun
		});
		local.search(myValue);
	}

	
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
	var marker = new BMap.Marker(new BMap.Point(110.032577, 40.418243));
	longitude = marker.getPosition().lng;
	latitude = marker.getPosition().lat;
	//模拟测试点位点击事件
	marker.addEventListener("mouseup", function(){
		var p = marker.getPosition();       //获取marker的位置
		//alert("marker的位置是" + p.lng + "," + p.lat); 
		longitude = p.lng;
		latitude = p.lat;
		$("#accInfoBtn").trigger("click");
	});
	map.addOverlay(marker);
	marker.enableDragging();//可拖拽
	//marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
	window.mapDicUtil = new MapUtil();
	window.mapDicUtil.put("1", marker);
}


/*
 * 保存标注
 * */
$(".testmap_bottom").click(function(){
	longitude =parseFloat(longitude).toFixed(4); //经度
	latitude = parseFloat(latitude).toFixed(4);//纬度	
	var register = $('#register', window.parent.document).val();
	try{
		if(register =="register"){
			parent.$('#longitude').val(longitude);
			parent.$('#longitude').focus();
			parent.$('#latitude').val(latitude);
			parent.$('#latitude').focus();
			parent.$('#latitude').blur();
		}else{
			
			var obj = parent.frames["layui-layer-iframe"+parent.getParentIndex()];
			if(obj.$('#longitude')==undefined||obj.$('#longitude').val()==undefined){
				obj.$("#contentIframe").contents().find("#longitude").val(longitude);
				
			}else{
				obj.$('#longitude').val(longitude);
			}
			if(obj.$('#latitude')==undefined||obj.$('#latitude').val()==undefined){
				obj.$("#contentIframe").contents().find("#latitude").val(latitude);
			}else{
				obj.$('#latitude').val(latitude);
			}
			obj.$('#longitude').focus();
			obj.$('#longitude').blur();
			obj.$('#latitude').focus();
			obj.$('#latitude').blur();
		}
		parent.toast("保存成功!");//弹出提示信息
		//$('.big_map_bottom_info').css('visibility','visible');
		setTimeout(function () { 
			parent.parent.closeWin(); //关闭弹出框	
	    }, 1000);
	}catch(err){
		parent.toast("保存失败!");//弹出提示信息
/*		$('big_map_bottom_info').hide();
		$('.big_map_bottom_drag').show();*/
		window.wxc.xcConfirm("保存失败！", window.wxc.xcConfirm.typeEnum.warning);
	}
})

