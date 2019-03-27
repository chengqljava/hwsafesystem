$(function () {
	//初始化地图展示的高度
	$("#testMap").height($(window).height());
	
	//初始化加载地图组件
	window.map = initMap();
	window.allMesOverlays = []; //测量时所画出的覆盖物数组
	window.allDriveRouteOverlays = []; //生成救援路线时所生成的覆盖物数组
	
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
		
		//清除测试指定点位的驾驶路线
		clearDriveRoute(window.allDriveRouteOverlays);
		
	});
	
	//周边监测点
	$("#surMonPtBtn").off("click").on("click", function() {
		//清除由测量工具所留下的覆盖物
		clearAllMesOverlays(window.allMesOverlays);
		
		//清除测试指定点位的驾驶路线
		clearDriveRoute(window.allDriveRouteOverlays);
		
		
	});
	
	//测量
	$("#mesureBtn").off("click").on("click", function() {
		//清除测试指定点位的驾驶路线
		clearDriveRoute(window.allDriveRouteOverlays);
		
		
		
		
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
	
	//标绘
	$("#plotBtn").off("click").on("click", function() {
		//清除由测量工具所留下的覆盖物
		clearAllMesOverlays(window.allMesOverlays);
		
		//清除测试指定点位的驾驶路线
		clearDriveRoute(window.allDriveRouteOverlays);
		
		//未发现接口
	});
	
	//查询
	$("#srchBtn").off("click").on("click", function() {
		//清除由测量工具所留下的覆盖物
		clearAllMesOverlays(window.allMesOverlays);
		
		//清除测试指定点位的驾驶路线
		clearDriveRoute(window.allDriveRouteOverlays);
		
		
	});
	
	//事故模拟
	$("#accAnaBtn").off("click").on("click", function() {
		//清除由测量工具所留下的覆盖物
		clearAllMesOverlays(window.allMesOverlays);
		
		
		//清除测试指定点位的驾驶路线
		clearDriveRoute(window.allDriveRouteOverlays);
		
		
	});
	
	//资源评估
	$("#resAessBtn").off("click").on("click", function() {
		//清除由测量工具所留下的覆盖物
		clearAllMesOverlays(window.allMesOverlays);

		//清除测试指定点位的驾驶路线
		clearDriveRoute(window.allDriveRouteOverlays);
		
		
		
	});
	
	//综合预测
	$("#totalForecastBtn").off("click").on("click", function() {
		//清除由测量工具所留下的覆盖物
		clearAllMesOverlays(window.allMesOverlays);
		
		//清除测试指定点位的驾驶路线
		clearDriveRoute(window.allDriveRouteOverlays);
		
		
		
	});
	
	//智能方案菜单
	$("#smartWayBtn").off("click").on("click", function() {
		//清除由测量工具所留下的覆盖物
		clearAllMesOverlays(window.allMesOverlays);
		
		//清除测试指定点位的驾驶路线
		clearDriveRoute(window.allDriveRouteOverlays);
		
		
		
	});
	
	//模拟加载点位
//	addMapPts();
	
	
	//加载测试点位
	initMapPts(window.map)
	
	
	//测试生成驾驶路线
	$("#driveRouteBtn").off("click").on("click", function() {
		//清除由测量工具所留下的覆盖物
		clearAllMesOverlays(window.allMesOverlays);
		
		//根据始末坐标点生成驾驶路线
		initDriveRoute(window.map);
		
		
		
	});
	
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

/**
 * 模拟加载点位
 */
function addMapPts() {
	var marker = new BMap.Marker(new BMap.Point(110.004721,40.421324)); // 创建点
	var polyline = new BMap.Polyline([
		new BMap.Point(109.937169,40.315342),
		new BMap.Point(109.983737,40.338004),
		new BMap.Point(110.121717,40.329864)
	], {strokeColor:"blue", strokeWeight:2, strokeOpacity:0.5});   //创建折线

	var circle = new BMap.Circle(new BMap.Point(109.937169,40.315342), 500,{strokeColor:"blue", strokeWeight:2, strokeOpacity:0.5}); //创建圆

	var polygon = new BMap.Polygon([
		new BMap.Point(109.874215,40.38814),
		new BMap.Point(110.035479,40.348782),
		new BMap.Point(109.95959,40.290031),
		new BMap.Point(110.126891,40.30918),
		new BMap.Point(110.126028,40.361317)
	], {strokeColor:"blue", strokeWeight:2, strokeOpacity:0.5});  //创建多边形

	var pStart = new BMap.Point(109.92912,40.430331);
	var pEnd = new BMap.Point(110.128903,40.317542);
	var rectangle = new BMap.Polygon([
		new BMap.Point(pStart.lng,pStart.lat),
		new BMap.Point(pEnd.lng,pStart.lat),
		new BMap.Point(pEnd.lng,pEnd.lat),
		new BMap.Point(pStart.lng,pEnd.lat)
	], {strokeColor:"blue", strokeWeight:2, strokeOpacity:0.5});  //创建矩形

	//添加覆盖物
	function add_overlay() {
		map.addOverlay(marker);            //增加点
		map.addOverlay(polyline);          //增加折线
		map.addOverlay(circle);            //增加圆
		map.addOverlay(polygon);           //增加多边形
		map.addOverlay(rectangle);         //增加矩形
	}
	//清除覆盖物
	function remove_overlay(){
		map.clearOverlays();         
	}

	//添加覆盖物事件
	$("#addPtBtn").off("click").on("click", function() {
		add_overlay();
	});
	
	//删除覆盖物事件
	$("#removePtBtn").off("click").on("click", function() {
		remove_overlay();
	});
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
 * 测试指定点位的驾驶路线
 */
function initDriveRoute(map) {
	var driving1 = new BMap.DrivingRoute(map, 
		{
			onSearchComplete: function(results) {
//				 if (driving.getStatus() == BMAP_STATUS_SUCCESS){
//		                // 获取第一条方案
//		                var plan = results.getPlan(0);
//		                // 获取方案的驾车线路
//		                var route = plan.getRoute(0);
//		                //返回路线的地理坐标点数组。（自 1.2 新增）
//		                var points = route.getPath();
//		                polyline = new BMap.Polyline(points);
//		                //alert(points.length);
//		                map.addOverlay(polyline);          //增加折线
//		            }
//				alert(JSON.stringify(results));
//				 window.allDriveRouteOverlays.push(polyline);
			},
			onPolylinesSet: function(routes) {
				_.map(routes, function(route) {
					//存储生成的路线覆盖物
					var curDvrPolyline = route.getPolyline();
					curDvrPolyline.setStrokeColor("#EF3F22");
					
					window.allDriveRouteOverlays.push(curDvrPolyline);
				});
			},
			onMarkersSet: function(pois) {
				_.map(pois, function(poi) {
					//存储生成的路线始终点的marker
					window.allDriveRouteOverlays.push(poi.marker);
				});
			},
			renderOptions:{map: map, autoViewport: true}
		}
	);
	driving1.search(new BMap.Point(109.679577, 40.542243), new BMap.Point(110.215398, 40.266224));
	
	var driving2 = new BMap.DrivingRoute(map, 
			{
		onSearchComplete: function(results) {
//				 if (driving.getStatus() == BMAP_STATUS_SUCCESS){
//		                // 获取第一条方案
//		                var plan = results.getPlan(0);
//		                // 获取方案的驾车线路
//		                var route = plan.getRoute(0);
//		                //返回路线的地理坐标点数组。（自 1.2 新增）
//		                var points = route.getPath();
//		                polyline = new BMap.Polyline(points);
//		                //alert(points.length);
//		                map.addOverlay(polyline);          //增加折线
//		            }
//				alert(JSON.stringify(results));
//				 window.allDriveRouteOverlays.push(polyline);
		},
		onPolylinesSet: function(routes) {
			_.map(routes, function(route) {
				//存储生成的路线覆盖物
				var curDvrPolyline = route.getPolyline();
				curDvrPolyline.setStrokeColor("#D2365E");
				window.allDriveRouteOverlays.push(curDvrPolyline);
			});
		},
		onMarkersSet: function(pois) {
			_.map(pois, function(poi) {
				//存储生成的路线始终点的marker
				window.allDriveRouteOverlays.push(poi.marker);
			});
		},
		renderOptions:{map: map, autoViewport: true}
			}
	);
	driving2.search(new BMap.Point(110.088084,40.51573), new BMap.Point(110.089234,39.934011));
}

/**
 * 清除测试指定点位的驾驶路线
 */
function clearDriveRoute(allDriveRouteOverlays) {
	if (allDriveRouteOverlays && 
	    0 < allDriveRouteOverlays.length) {
		_.map(allDriveRouteOverlays, function(driveRouteOverlay) {
			map.removeOverlay(driveRouteOverlay);
		});
	}
}
