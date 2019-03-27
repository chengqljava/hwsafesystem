$(function () {
	//初始化地图展示的高度
	$("#testMap").height($(window).height());
	
	//初始化加载地图组件
	window.map = initMap();
	window.allMesOverlays = []; //测量时所画出的覆盖物数组
	
	//分别绑导航菜单点击事件
	//事件信息
	$("#accInfoBtn").off("click").on("click", function() {
		parent.openWin(BASE_URL + "views/module/demo/map/accInfo.html", "事故详情", "50%", "36%", true, true);
	});
	
	//周边天气
	$("#surWeaBtn").off("click").on("click", function() {
		parent.openWin(BASE_URL + "views/module/demo/map/accInfo.html", "天气详情", "50%", "36%", true, true);
	});
	
	//视频监控
	$("#videoMonBtn").off("click").on("click", function() {
		//清除由测量工具所留下的覆盖物
		clearAllMesOverlays(window.allMesOverlays);
		
	});
	
	//周边监测点
	$("#surMonPtBtn").off("click").on("click", function() {
		//清除由测量工具所留下的覆盖物
		clearAllMesOverlays(window.allMesOverlays);
		
		
	});
	
	//测量
	$("#mesureBtn").off("click").on("click", function() {
		
		 	var overlayComplete = function(e) {
//		 		alert("绘制完成后公共回调返回长度或面积值 -" + e.calculate + "-米或平方米");
//		 		GeoUtils.getPolygonArea(e.overlay);
		    	window.allMesOverlays.push(e.overlay);
		    	
		    	//测试加载在自己所绘制区域的点位
		    	if (!(window.mapDicUtil.isEmpty())) {
		    		var allCurPtArr = window.mapDicUtil.values();
		    		for (var i = 0; i < allCurPtArr.length; ++i) {
		    			//根据绘制图形种类进行点位是否筛选
		    			var isInDrawOverLay = false;
		    			if (BMAP_DRAWING_CIRCLE == e.drawingMode) {
		    				if (BMapLib.GeoUtils.isPointInCircle(allCurPtArr[i].getPosition(), e.overlay)) {
		    					isInDrawOverLay = true;
			    			} 
		    			} else if (BMAP_DRAWING_POLYLINE == e.drawingMode) {
		    				if (BMapLib.GeoUtils.isPointOnPolyline(allCurPtArr[i].getPosition(), e.overlay)) {
		    					isInDrawOverLay = true;
			    			}
		    			} else if (BMAP_DRAWING_POLYGON == e.drawingMode) {
		    				if (BMapLib.GeoUtils.isPointInPolygon(allCurPtArr[i].getPosition(), e.overlay)) {
		    					isInDrawOverLay = true;
			    			}
		    			} else if (BMAP_DRAWING_RECTANGLE == e.drawingMode) {
		    				if (BMapLib.GeoUtils.isPointInRect(allCurPtArr[i].getPosition(), e.overlay.getBounds())) {
		    					isInDrawOverLay = true;
			    			}
		    			} 
//		    			else if (BMAP_DRAWING_MARKER == e.drawingMode) {
//		    				continue;
//		    			}
		    			
		    			if (isInDrawOverLay) {
		    				allCurPtArr[i].show();
		    			} else {
		    				allCurPtArr[i].hide();
		    			}
		    		}
		    	}
		    };
		    
			 //存储测量时所画出的覆盖物
			 var styleOptions = {
			        strokeColor: "red",    //边线颜色。
			        fillColor: "red",      //填充颜色。当参数为空时，圆形将没有填充效果。
			        strokeWeight: 2,       //边线的宽度，以像素为单位。
			        strokeOpacity: 0.8,	   //边线透明度，取值范围0 - 1。
			        fillOpacity: 0.2,      //填充的透明度，取值范围0 - 1。
			        strokeStyle: "solid" //边线的样式，solid或dashed。
			 };
		    
		    //实例化鼠标绘制工具
		    window.drawingManager = new BMapLib.DrawingManager(window.map, {
		        isOpen: false, //是否开启绘制模式
		        drawingType: BMAP_DRAWING_CIRCLE,
		        enableDrawingTool: true, //是否显示工具栏
		        enableCalculate: false,//是否开启计算模式，可以在绘制完图形后返回所绘制的  折线长度 或 多边形面积 或 长方形面积 或 圆面积；单位为米
		        drawingToolOptions: {
		            anchor: BMAP_ANCHOR_TOP_RIGHT, //位置
		            offset: new BMap.Size(5, 5), //偏离值
		            drawingModes : [
		                            BMAP_DRAWING_CIRCLE,
		                            BMAP_DRAWING_POLYLINE,
		                            BMAP_DRAWING_POLYGON,
		                            BMAP_DRAWING_RECTANGLE 
		                         ]
		        },
		        circleOptions: styleOptions, //圆的样式
		        polylineOptions: styleOptions, //线的样式
		        polygonOptions: styleOptions, //多边形的样式
		        rectangleOptions: styleOptions //矩形的样式
		    });  
		    
			 //绘制工具公共总监听事件，用于获取绘制结果
		    window.drawingManager.addEventListener("overlaycomplete", overlayComplete);
		    
		    //绘制工具圆监听事件，用于获取绘制结果
		    window.drawingManager.addEventListener("circlecomplete", function(circle) {
//		    	alert("圆中心点-" + JSON.stringify(circle.getCenter()));
//		    	alert("圆半径-" + circle.getRadius() + "米");
//		    	alert("圆范围-" + JSON.stringify(circle.getBounds()));
//		    	alert("圆面积" + (3.1415926 * circle.getRadius() * circle.getRadius())  + "平方米");
		    	
		    });
		   
		    //绘制工具点位监听事件，用于获取绘制结果
//		    window.drawingManager.addEventListener("markercomplete", function(marker) {
////		    	alert("点坐标-" + JSON.stringify(marker.getPosition()));
//		    });
		    
		    //绘制工具多边形监听事件，用于获取绘制结果
		    window.drawingManager.addEventListener("polygoncomplete", function(polygon) {
//		    	alert("多边形边界点经纬度-" + JSON.stringify(polygon.getPath()));
//		    	alert("多边形面积" + BMapLib.GeoUtils.getPolygonArea(polygon.getPath()));
		    	
		    });

		    //绘制工具折线监听事件，用于获取绘制结果
		    window.drawingManager.addEventListener("polylinecomplete", function(polyline) {
//		    	alert("折线边界点经纬度-" + JSON.stringify(polyline.getPath()));
//		    	alert("折线长" + BMapLib.GeoUtils.getPolylineDistance(polyline.getPath()) + "米");
		    	
		    });
		    
		    //绘制工具长方形监听事件，用于获取绘制结果
		    window.drawingManager.addEventListener("rectanglecomplete", function(polygon) {
//		    	alert("长方形边界点经纬度-" + JSON.stringify(polygon.getPath()));
//		    	alert("长方形面积" + BMapLib.GeoUtils.getPolygonArea(polygon.getPath()) + "平方米");
		    	
		    });
	});
	
	
	//加载测试点位
	initMapPts(window.map)
	
});

/**
 * 初始化达拉特地图
 * @returns {BMap.Map}
 */
function initMap(){
	//地图本地根据IP地址定位以及添加标尺(禁止点击地图上的地点弹出百度详情)
	var map = new BMap.Map("testMap", {enableMapClick: false, minZoom: 6, maxZoom: 18}); // 创建Map实例
	map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放
	
	//修改地图显示样式
	var mapStyle = [
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
	map.setMapStyle({styleJson : mapStyle});
	
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
	var marker1 = new BMap.Marker(new BMap.Point(109.679577, 40.542243));
	
	var marker2 = new BMap.Marker(new BMap.Point(109.671528, 40.407892));
	
	var marker3 = new BMap.Marker(new BMap.Point(109.633584, 40.268866));
	
	
	var marker4 = new BMap.Marker(new BMap.Point(109.891146, 40.568555));
	
	var marker5 = new BMap.Marker(new BMap.Point(109.876198, 40.40965));
	
	var marker6 = new BMap.Marker(new BMap.Point(109.963585, 40.2856));
	
	
	var marker7 = new BMap.Marker(new BMap.Point(110.321183, 40.600115));
	
	var marker8 = new BMap.Marker(new BMap.Point(110.226896, 40.37712));
	
	var marker9 = new BMap.Marker(new BMap.Point(110.215398, 40.266224));
	
	//模拟测试点位点击事件
	marker9.addEventListener("click", function(){
		//清除由测量工具所留下的覆盖物
		clearAllMesOverlays(window.allMesOverlays);
		
		$("#accInfoBtn").trigger("click");
	});
	
	//模拟测试企业列表内容点击事件
	$("#testEnt1").off("click").on("click", function() {
		//清除由测量工具所留下的覆盖物
		clearAllMesOverlays(window.allMesOverlays);
		
		map.panTo(marker9.getPosition());
		$("#accInfoBtn").trigger("click");
	});
	
	map.addOverlay(marker1);
	map.addOverlay(marker2);
	map.addOverlay(marker3);
	map.addOverlay(marker4);
	map.addOverlay(marker5);
	map.addOverlay(marker6);
	map.addOverlay(marker7);
	map.addOverlay(marker8);
	map.addOverlay(marker9);
	
	window.mapDicUtil = new MapUtil();
	window.mapDicUtil.put("1", marker1);
	window.mapDicUtil.put("2", marker2);
	window.mapDicUtil.put("3", marker3);
	window.mapDicUtil.put("4", marker4);
	window.mapDicUtil.put("5", marker5);
	window.mapDicUtil.put("6", marker6);
	window.mapDicUtil.put("7", marker7);
	window.mapDicUtil.put("8", marker8);
	window.mapDicUtil.put("9", marker9);
}


/**
 * 清除所有测量时所画出的覆盖物
 */
function clearAllMesOverlays(allMesOverlays) {
	if (window.drawingManager) {
		//关闭地图的绘制状态
		window.drawingManager.disableCalculate();
		window.drawingManager.close();
		window.drawingManager = null;
		
		//移除测量画图工具栏
		$(".BMapLib_Drawing_panel").parent().remove();
	} 
	
	if (allMesOverlays && 0 < allMesOverlays.length) {
		for(var i = 0; i < allMesOverlays.length; i++){
			map.removeOverlay(allMesOverlays[i]);
		}
		allMesOverlays.length = 0;
	}
}