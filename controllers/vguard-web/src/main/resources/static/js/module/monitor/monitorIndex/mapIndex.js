$(function () {
    var app = this;
    //初始化地图展示的高度
    $("#testMap").height($(window).height());
    
    //初始化加载地图组件
    window.map = initMap();
    window.allMesOverlays = []; //测量时所画出的覆盖物数组
    window.infoBoxList = [];
    window.entType = "-1";
    //测量
    window.currentpage = 1;
    window.entInfos = [];
    loadEntInfosFromServerByType("", true);
    
    new MonitorAlarm();
    if ($(window).width() < 700) {
        var height = $(".wrapper").height() - 101;
        $(".entcontent").css("height", height);
    } else {
        var height = $(".wrapper").height() - $(".header-top").height();
        $(".entcontent").css("height", height);
    }

    $(".tr:gt(0)").click(function () {
        $('.wrapper').show()
    });
    $(".back-btn").click(function () {
        $(".wrapper").hide()
    })
    //TODO 获取获取企业总数 已接入企业总数 未接入企业总数
    //TODO 获取前十条企业信息 名称--报警个数--经纬度信息（百度坐标）

    $("#searchIcon").on("mouseenter", function () {
        $("#searchIcon").attr("src", "../../../../images/module/monitor/search-hover.png");
    });
    $("#searchIcon").on("mouseleave", function () {
        $("#searchIcon").attr("src", "../../../../images/module/monitor/search.png");
    });

    $("#navbar").on("click", ".type", function () {
        $(".type").attr("class", "type");
        $(".type").map(function () {
            var type = $(this).data('type');
            //console.log(type);
            $("#" + type).css({
                "background-image": "url(\"../../../../images/module/monitor/" + type + ".png\")",
            })
        });
        $(this).attr("class", "type selected");
        var type = $(this).data('type');
        $("#" + type).css({
            "background-image": "url(\"../../../../images/module/monitor/" + type + "-hover.png\")",
        });
        switch (type) {
            case "sylx":
                window.entType = "-1";
                break;
            case "wxhxp":
                window.entType = "1";
                break;
            case "rql":
                window.entType = "2";
                break;
            case "gk":
                window.entType = "3";
                break;
        }

        //更新显示
        clearAllMesOverlays(window.allMesOverlays);
        window.currentpage = 1;
        loadEntInfosFromServerByType(window.entType == "-1" ? "" : window.entType, true);
        $(".companyInfo").mCustomScrollbar("update");
    });

    $("#loadmore").off("click").on("click", function () {
        window.currentpage++;
        loadEntInfosFromServerByType(window.entType == "-1" ? "" : window.entType, false);
    });

    //企业名称搜索事件
    $("#searchIcon").off("click").on("click", function () {
        var entname = $("#searchBox").val();
        window.currentpage = 1;
        loadEntInfosFromServerByType(window.entType == "-1" ? "" : window.entType, true, entname);
    });

    //获取企业个数和危险源企业个数
    loadEntCount();
});

function loadEntCount() {
    var totalEntCount = 0;
    var typeEntCount = 0;
    $.ajax({
        type: "post",
        url: BASE_URL + "enterprise/entcount/loadEntCountByDangerType",
        data: {
            etime: getFormatDate(new Date(), "yyyy-MM-dd"),
            stime: getFormatDate(new Date(), "yyyy-MM-dd"),
            districtid: ""
        },
        success: function (data) {
            if (data) {
                var datas = data.datas;
                var totalEntCount = 0;
                $.each(datas, function (i, item) {
                    totalEntCount += parseInt(item.ENTCOUNT);
                    switch (item.DANGERTYPE) {
                        case "1":
                            typeEntCount += parseInt(item.ENTCOUNT);
                            break;
                        case "2":
                            typeEntCount += parseInt(item.ENTCOUNT);
                            break;
                        case "3":
                            typeEntCount += parseInt(item.ENTCOUNT);
                            break;
                        default:
                            break;
                    }
                });
                $("#totalEntCount").html(totalEntCount);
                $("#typeEntCount").html(typeEntCount);
            }
        }
    });
}

function loadEntInfosFromServerByType(dangertype, isRefresh, entname) {
    var param = {dangertype: dangertype, page: window.currentpage, rows: 1000, entname: entname};
    $.ajax({
        type: 'post',
        url: BASE_URL + '/olgis/gisOperBuss/businessPageByDangerType',
        cache: false,
        dataType: 'json',
        data: param,
        global: false,
//        async: false,
        success: function (retData) {
            if (retData) {
                window.entInfos.push(retData.datas);//
                var isHasMore = true;
                if (parseInt(retData.records) < 10) {
                    isHasMore = false;
                }
                initEntList(window.map, retData.datas, isRefresh, isHasMore);
            } else {
                $("#loadmore").text("没有更多数据了");
                $("#loadmore").unbind("click");
            }
        },
        error: function(){}
    });
}

/**
 *  企业总数
 * @type {number}
 */
var entInfoCount = 1,
	opts = {
	    width: 250,     // 信息窗口宽度
	    height: 80,     // 信息窗口高度
	    title: "企业信息", // 信息窗口标题
	    enableMessage: true//设置允许信息窗发送短息
	};

/**
 * 初始化列表
 * @param entInfos
 */
function initEntList(map, entInfos, isRefresh, isHasMore) {
    if (isRefresh) {
        $("#area").empty();
        map.clearOverlays();
        entInfoCount = 1;
    }

    if (isHasMore) {
        $("#loadmore").text("加载更多");
        $("#loadmore").removeAttr("disabled");
    } else {
        $("#loadmore").text("没有更多数据了");
        $("#loadmore").attr("disabled", "disabled")
    }
//    console.log("entInfos");
//    console.log(entInfos);
    if (entInfos && 0 < entInfos.length) {
    	//对各企业报警个数列表进行倒序排列
    	entInfos = _.sortBy(entInfos, function(entInfo){return -entInfo.ALARMMONITOR;});
    	
    	window.curEntAndMatlsDic = new MapUtil();
    	$.each(entInfos, function (i, entInfo) {
    		if (!window.curEntAndMatlsDic.containsKey(entInfo.BUSINESSINFOID)) {
    			var num = parseInt(i) + 1;
    			var alarmCount = parseInt(entInfo.ALARMMONITOR) + parseInt(entInfo.ALARMFAULT);
    			$("#area").append("<div id=\"entinfo" + entInfoCount + "\" class=\"singleCompany\"><span style='vertical-align: middle;' class=\"companyLeft\"><div class=\"circlePoint\">" + num + "</div> </span><span style='vertical-align: middle;' class=\"companyCenter\"><div class='companyCenterName'>" + entInfo.ENTNAME + "</div></span><span style='vertical-align: middle;margin-left: 20px;text-overflow: ellipsis;overflow:hidden;display:inline-block;width:40px;' title='" +alarmCount+"'>" + alarmCount + "</span> </div>")
    			
    			var tmpPt = new BMap.Point(entInfo.LONGITUDE, entInfo.LATITUDE);
                var tmpMarker = new BMap.Marker(tmpPt, {
                    "title": entInfo.ENTNAME
                });

                //允许清除覆盖物
                tmpMarker.enableMassClear();
                
                //定义点位弹窗内容
                var winCon = "<div class='bb qypopup'>" +
                    "   <div class='popupTitle'>" + entInfo.ENTNAME +
                    "       <span id='jgfj'>监管分级：" +
                    "           <span>" + entInfo.ENTGRADE + "</span>" +
                    "       </span>" +
                    "   </div>" +
                    "   <div class='companyInfo' style='width: 478px;'>" +
                    "       <i class='fa fa-user'>&nbsp;</i>" + entInfo.LEGALPERSON +
                    "       <i class='fa fa-phone'></i>" + entInfo.PHONE +
                    "       <br />" +
                    "       <i class='fa fa-map-marker'>&nbsp;</i>" + entInfo.ADDRESS +
                    "       <br />" +
                    "       <table class='qyinfo'>" +
                    "          <tr>" +
                    "               <td>经营范围</td>" +
                    "               <td class='dot' colspan='5'>" + entInfo.MAINPRODUCT + "</td>" +
                    "           </tr>" +
                    "           <tr>" +
                    "               <td>行业分类</td>" +
                    "               <td colspan='5'>" + entInfo.DIRECTORTYPENAME + "</td>" +
                    "           </tr>" +
                    "           <tr>" +
                    "               <td>员工人数</td>" +
                    "               <td>" + entInfo.EMPQTY + "人</td>" +
                    "               <td>安全管理人员</td>" +
                    "               <td>" + entInfo.MANAGENUMBER + "人</td>" +
                    "               <td>持证人员</td>" +
                    "               <td>" + entInfo.HOLDERNUMBER + "人</td>" +
                    "           </tr>" +
                    "           <tr>" +
                    "               <td>经营场所</td>" +
                    "               <td>" + entInfo.PLACEAREA + "㎡</td>" +
                    "               <td>固定资产</td>" +
                    "               <td>" + entInfo.FIXEDMONEY + "万元</td>" +
                    "               <td>年营业收入</td>" +
                    "               <td>" + entInfo.YEARINCOME + "万元</td>" +
                    "           </tr>" +
                    "       </table>" +
                    "       <div class='ssqy'>" +
                    "           <span>所属区域：" + entInfo.AREANAME + "</span>" +
                    "           <span>主管部门：" + entInfo.INDUSTRYORGNAME + "</span>" +
                    "       </div>" +
                    "		<div class='jcxx'>" +
                    "			<span class='fa fa-video'>&nbsp;</span><a href='javascript:void(0);' id='entMonData'>监测视频数据</a>" +
                    "		</div>" +
                    "   </div>" +
                    "   <div class='triangle'></div>" +
                    "</div>";
                //定义点位弹窗内容
// 				var tmpWindow = new BMap.InfoWindow(entInfo.ENTNAME, opts);
                
                //将点位存储至map集合工具类中
                window.curEntAndMatlsDic.put(entInfo.BUSINESSINFOID, {
                    "data": entInfo,
                    "marker": tmpMarker,
                    "click": function () {
                    	map.panTo(tmpPt);
                    	var infoBox = new BMapLib.InfoBox(map, winCon, {
                            boxStyle: {
                                minWidth: "631",
                                Height: "381",
                                marginBottom: "20px"
                            }
                            , closeIconMargin: "4px 4px 4px 4px"
                            , closeIconUrl: BASE_URL + "images/map/icon/iw_close1d3.gif"
                            , enableAutoPan: false
                            , align: INFOBOX_AT_TOP
                        });

                        window.infoBoxList.push(infoBox);
                        _.map(window.infoBoxList, function (infobox) {
                            infobox.close();
                        });
                        
                        //infobox打开时的回调事件
                        infoBox.addEventListener("open", function (e) {
                            // 三行文本溢出隐藏
                            $('.dot').dotdotdot();
                            
                            //绑定监测监控按钮事件
                            $("#entMonData").off("click").on("click", function() {
                            	openWinWithCloseCallback(BASE_URL + 'views/module/monitor/monitorIndex/entInfo.html?businessinfoid=' + entInfo.BUSINESSINFOID, '监测监控', '92%', '100%',
           						     undefined, function() {
                            		//释放8700平台视频空间内存
                            	 	if (window.spvxOcx) {
                            	 		window.spvxOcx.MPV_Uninit();
                            	 	}
//                            	 	var spvxOcx = document.getElementById("spvViewOCX");
//                            	 	if (spvxOcx) {
//                            			spvxOcx.MPV_Uninit();
//                            	 	}
    							});
                            });
                        });

                        //infoBox关闭时执行的操作
                        infoBox.addEventListener("close", function (e) {});
                        infoBox.open(tmpMarker);
                        //GIS上打开点位信息窗口
// 						window.map.centerAndZoom(tmpPt, 11);
// 						window.map.setCenter(tmpPt);
                        //定义点位信息窗口回调事件
// 						tmpWindow.addEventListener("open", function(){});
// 						tmpWindow.addEventListener("close", function(){});
// 						tmpWindow.addEventListener("clickclose", function(){});
// 						map.openInfoWindow(tmpWindow, tmpPt);
                    },
                    "dblclick": function() {
                    	map.panTo(tmpPt);
                    	openWinWithCloseCallback(BASE_URL + 'views/module/monitor/monitorIndex/entInfo.html?businessinfoid=' + entInfo.BUSINESSINFOID, '监测监控', '92%', '100%',
                    						     undefined, function() {
						                    		//释放8700平台视频空间内存
						                    	 	if (window.spvxOcx) {
						                    	 		window.spvxOcx.MPV_Uninit();
						                    	 	}
//						                    	 	var spvxOcx = document.getElementById("spvViewOCX");
//						                    	 	if (spvxOcx) {
//						                    			spvxOcx.MPV_Uninit();
//						                    	 	}
                    							});
                    }
                });

                //定义点位单击触发事件
                tmpMarker.addEventListener("click", function () {
                    window.curEntAndMatlsDic.get(entInfo.BUSINESSINFOID).click();
                });
                
                //定义点位双击触发事件
                tmpMarker.addEventListener("dblclick", function () {
                	window.curEntAndMatlsDic.get(entInfo.BUSINESSINFOID).dblclick();
                });

                //将点位添加至地图
                map.addOverlay(tmpMarker);

                //默认选择第一个点位居中
                0 == parseInt(i) && map.setCenter(tmpPt);
                
                //列表每一行单击事件
                $("#entinfo" + entInfoCount).off("click").on("click", function () {
                	//需要移动
//            openInfo(entInfo);
                	window.curEntAndMatlsDic.get(entInfo.BUSINESSINFOID).click();
//                	window.map.centerAndZoom(new BMap.Point(entInfo.LONGITUDE, entInfo.LATITUDE));
//                	openWin(BASE_URL + 'views/module/monitor/monitorIndex/entInfo.html?businessinfoid=' + entInfo.BUSINESSINFOID, '监测监控', '92%', '100%');
                	return false;
                });
                
                //列表每一行双击事件
                $("#entinfo" + entInfoCount).off("dblclick").on("dblclick", function () {
                	//需要移动
//            openInfo(entInfo);
                	window.curEntAndMatlsDic.get(entInfo.BUSINESSINFOID).dblclick();
//                	window.map.centerAndZoom(new BMap.Point(entInfo.LONGITUDE, entInfo.LATITUDE));
//                	openWin(BASE_URL + 'views/module/monitor/monitorIndex/entInfo.html?businessinfoid=' + entInfo.BUSINESSINFOID, '监测监控', '92%', '100%');
                	return false;
                });
                
                entInfoCount++;
    		}
//    		var marker = new BMap.Marker(new BMap.Point(entInfo.LONGITUDE, entInfo.LATITUDE));
//    		map.addOverlay(marker);
//    		window.mapDicUtil = new MapUtil();
//    		window.mapDicUtil.put(i, marker);
//    		addClickHandler(entInfo, marker);
    	});
    }
//    if (entInfos.length>0) {
//    	window.map.centerAndZoom(new BMap.Point(entInfos[0].LONGITUDE,entInfos[0].LATITUDE), 11);
//	}else{
//		map.centerAndZoom(new BMap.Point(116.8923,37.3045), 11);
//	}
}


/**
 * 初始化达拉特地图
 * @returns {BMap.Map}
 */
function initMap() {
    //地图本地根据IP地址定位以及添加标尺(禁止点击地图上的地点弹出百度详情)
    var map = new BMap.Map("testMap", {enableMapClick: false, minZoom: 6, maxZoom: 18}); // 创建Map实例
    map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放
    
    //新的地图样式
    var mapStyle = [
                    {
                        "featureType": "water",
                        "elementType": "all",
                        "stylers": {
                                  "color": "#0b395aff"
                        }
              },
              {
                        "featureType": "highway",
                        "elementType": "geometry.fill",
                        "stylers": {
                                  "color": "#21394aff"
                        }
              },
              {
                        "featureType": "highway",
                        "elementType": "geometry.stroke",
                        "stylers": {
                                  "color": "#21394aff"
                        }
              },
              {
                        "featureType": "arterial",
                        "elementType": "geometry.fill",
                        "stylers": {
                                  "color": "#314a5cff"
                        }
              },
              {
                        "featureType": "arterial",
                        "elementType": "geometry.stroke",
                        "stylers": {
                                  "color": "#314a5cff"
                        }
              },
              {
                        "featureType": "local",
                        "elementType": "geometry",
                        "stylers": {
                                  "color": "#314a5cff"
                        }
              },
              {
                        "featureType": "land",
                        "elementType": "all",
                        "stylers": {
                                  "color": "#09101dff",
                                  "visibility": "on"
                        }
              },
              {
                        "featureType": "railway",
                        "elementType": "geometry.fill",
                        "stylers": {
                                  "color": "#999999ff",
                                  "visibility": "off"
                        }
              },
              {
                        "featureType": "railway",
                        "elementType": "geometry.stroke",
                        "stylers": {
                                  "color": "#444444ff",
                                  "visibility": "off"
                        }
              },
              {
                        "featureType": "subway",
                        "elementType": "geometry",
                        "stylers": {
                                  "lightness": -70
                        }
              },
              {
                        "featureType": "building",
                        "elementType": "geometry.fill",
                        "stylers": {
                                  "color": "#000000ff"
                        }
              },
              {
                        "featureType": "all",
                        "elementType": "labels.text.fill",
                        "stylers": {}
              },
              {
                        "featureType": "all",
                        "elementType": "labels.text.stroke",
                        "stylers": {
                                  "color": "#000000ff",
                                  "visibility": "on"
                        }
              },
              {
                        "featureType": "building",
                        "elementType": "geometry",
                        "stylers": {
                                  "color": "#152a38ff"
                        }
              },
              {
                        "featureType": "green",
                        "elementType": "geometry",
                        "stylers": {
                                  "color": "#042203ff"
                        }
              },
              {
                        "featureType": "boundary",
                        "elementType": "all",
                        "stylers": {
                                  "color": "#0f7880ff"
                        }
              },
              {
                        "featureType": "manmade",
                        "elementType": "geometry",
                        "stylers": {
                                  "color": "#151c2aff",
                                  "visibility": "on"
                        }
              },
              {
                        "featureType": "poi",
                        "elementType": "all",
                        "stylers": {
                                  "visibility": "on"
                        }
              },
              {
                        "featureType": "all",
                        "elementType": "labels.icon",
                        "stylers": {
                                  "visibility": "off"
                        }
              },
              {
                        "featureType": "all",
                        "elementType": "labels.text.fill",
                        "stylers": {
                                  "color": "#3d85c6ff",
                                  "visibility": "on"
                        }
              }
    ];
//    var mapStyle = [
//                    {
//                        "featureType": "water",
//                        "elementType": "all",
//                        "stylers": {
//                                  "color": "#255190ff"
//                        }
//                    },
//                    {
//                        "featureType": "highway",
//                        "elementType": "geometry.fill",
//                        "stylers": {
//                                  "color": "#3d85e2ff",
//                                  "weight": "2"
//                        }
//	              },
//	              {
//                        "featureType": "highway",
//                        "elementType": "geometry.stroke",
//                        "stylers": {
//                                  "color": "#147a92ff"
//                        }
//	              },
//	              {
//                        "featureType": "arterial",
//                        "elementType": "geometry.fill",
//                        "stylers": {
//                                  "color": "#3d85e2ff"
//                        }
//	              },
//	              {
//                        "featureType": "arterial",
//                        "elementType": "geometry.stroke",
//                        "stylers": {
//                                  "color": "#0b3d51ff"
//                        }
//	              },
//	              {
//                        "featureType": "local",
//                        "elementType": "geometry",
//                        "stylers": {
//                                  "color": "#0b5394ff"
//                        }
//	              },
//	              {
//                        "featureType": "land",
//                        "elementType": "all",
//                        "stylers": {
//                                  "color": "#0b1b2bff",
//                                  "visibility": "on"
//                        }
//	              },
//	              {
//                        "featureType": "railway",
//                        "elementType": "geometry.fill",
//                        "stylers": {
//                                  "color": "#999999ff"
//                        }
//	              },
//	              {
//                        "featureType": "railway",
//                        "elementType": "geometry.stroke",
//                        "stylers": {
//                                  "color": "#444444ff"
//                        }
//	              },
//	              {
//                        "featureType": "subway",
//                        "elementType": "geometry",
//                        "stylers": {
//                                  "lightness": -70
//                        }
//	              },
//	              {
//                        "featureType": "building",
//                        "elementType": "geometry.fill",
//                        "stylers": {
//                                  "color": "#000000ff"
//                        }
//	              },
//	              {
//                        "featureType": "all",
//                        "elementType": "labels.text.fill",
//                        "stylers": {}
//	              },
//	              {
//                        "featureType": "all",
//                        "elementType": "labels.text.stroke",
//                        "stylers": {
//                                  "color": "#000000ff",
//                                  "visibility": "on"
//                        }
//	              },
//	              {
//                        "featureType": "building",
//                        "elementType": "geometry",
//                        "stylers": {
//                                  "color": "#14375dff"
//                        }
//	              },
//	              {
//                        "featureType": "green",
//                        "elementType": "geometry",
//                        "stylers": {
//                                  "color": "#162e09ff"
//                        }
//	              },
//	              {
//                        "featureType": "boundary",
//                        "elementType": "all",
//                        "stylers": {
//                                  "color": "#00ffffff"
//                        }
//	              },
//	              {
//                        "featureType": "manmade",
//                        "elementType": "geometry",
//                        "stylers": {
//                                  "color": "#091a2cff",
//                                  "visibility": "on"
//                        }
//	              },
//	              {
//                        "featureType": "poi",
//                        "elementType": "all",
//                        "stylers": {
//                                  "visibility": "on"
//                        }
//	              },
//	              {
//                        "featureType": "all",
//                        "elementType": "labels.icon",
//                        "stylers": {
//                                  "visibility": "off"
//                        }
//	              },
//	              {
//                        "featureType": "all",
//                        "elementType": "labels.text.fill",
//                        "stylers": {
//                                  "color": "#3d85c6ff",
//                                  "visibility": "on"
//                        }
//	              }
//	            ];
    //设置地图样式
     map.setMapStyle({styleJson: mapStyle});

    //设置地图范围为达拉特(参数为 西南点坐标、东北点坐标)
//	var dltBound = new BMap.Bounds(new BMap.Point(109.186042, 39.791787), new BMap.Point(111.238059, 40.909685));
//	try {	
//		BMapLib.AreaRestriction.setBounds(map, dltBound);
//	} catch (e) {
//		console.log("区域限定错误");
//	}
     
    //地图中心点取默认定位
    //同步执行
	$.ajaxSettings.async = false;
 	$.getJSON(BASE_URL + "/config/gisDefaultLocation.json",function(data) {
 		if (data) {
 			map.centerAndZoom(new BMap.Point(data.longitude, data.latitude), 11);
 		}
	});
    //默认中心位置为达拉特
//    map.centerAndZoom(new BMap.Point(116.8923,37.3045), 11);

    //添加地图类型控件
//	map.addControl(new BMap.MapTypeControl()); 

//	function showInfo(e){
//		alert(e.point.lng + ", " + e.point.lat);
//	}
//	map.addEventListener("click", showInfo);
    return map;
}

/**
 * 给marker添加打开企业信息窗口的点击事件
 * @param entInfo
 * @param marker
 */
function addClickHandler(entInfo, marker) {
	
    marker.addEventListener("click", function (e) {
    	window.map.centerAndZoom(new BMap.Point(entInfo.LONGITUDE, entInfo.LATITUDE));
    	openWin(BASE_URL + 'views/module/monitor/monitorIndex/entInfo.html?businessinfoid=' + entInfo.BUSINESSINFOID, '监测监控', '92%', '100%');
//        openInfo(entInfo);
    });
}
/**
 * 打开企业窗口
 * @param entInfo
 */
function openInfo(entInfo) {
    window.map.centerAndZoom(new BMap.Point(entInfo.LONGITUDE, entInfo.LATITUDE));
    var point = new BMap.Point(entInfo.LONGITUDE, entInfo.LATITUDE);
    var infoWindow = new BMap.InfoWindow(entInfo.ENTNAME, opts);  // 创建信息窗口对象
    map.openInfoWindow(infoWindow, point); //开启信息窗口

    //
    // openWin(BASE_URL + "views/module/monitor/monitorIndex/entInfo.html?businessinfoid="+entInfo.BUSINESSINFOID, entInfo.ENTNAME, "90%", "90%");
    $(".entName").empty();
    $(".entName").append(entInfo.ENTNAME);
    $(".wrapper").show();
    $("#mapfrm").attr("src", BASE_URL + "/olgis/gispage/addjcjkAlarm/" + entInfo.BUSINESSINFOID);
    $("#alarminfo").attr("href", BASE_URL + "/olgis/gispage/addjcjkAlarm/" + entInfo.BUSINESSINFOID);
    $("#videoinfo").attr("href", BASE_URL + "/olgis/gispage/addjcjkVideoAll/" + entInfo.BUSINESSINFOID);
    $("#datainfo").attr("href", BASE_URL + "/olgis/gispage/addjcjkDataAll/" + entInfo.BUSINESSINFOID);

    $("#alarminfo").addClass("active");
    $("#videoinfo").removeClass("active");
    $("#datainfo").removeClass("active");
    $("#alarminfo").off("click").on("click", function () {
        $("#alarminfo").addClass("active");
        $("#videoinfo").removeClass("active");
        $("#datainfo").removeClass("active");
    });

    $("#videoinfo").off("click").on("click", function () {
        $("#alarminfo").removeClass("active");
        $("#videoinfo").addClass("active");
        $("#datainfo").removeClass("active");
    });

    $("#datainfo").off("click").on("click", function () {
        $("#alarminfo").removeClass("active");
        $("#videoinfo").removeClass("active");
        $("#datainfo").addClass("active");
    });


    var statistics = monitordatas.loadStateTJ(entInfo.BUSINESSINFOID);
    if (statistics != null) {
        for (var key in statistics) {
            var st = statistics[key];
            if (st.FLAG == "1") entInfo.HISTORY = st;
            else if (st.FLAG == "2") entInfo.CURRENT = st;
        }
    }
    $(this).addClass('trCur').siblings().removeClass('trCur');
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
        for (var i = 0; i < allMesOverlays.length; i++) {
            map.removeOverlay(allMesOverlays[i]);
        }
        allMesOverlays.length = 0;
    }
}