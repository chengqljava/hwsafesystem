$(function () {
    //分别获取当前所选事件id和之前事件列表url
    var eventid = getQueryString("eventid"),
        lastPageUrl = getQueryString("lastPageUrl");

    //为事故id隐藏域赋值
    $("#eventid").val(eventid);

    //定义返回事故列表页面按钮事件
    $("#returnEvnListBtn").off("click").on("click", function () {
        location.href = lastPageUrl;
    });

    //初始化综合预测路线覆盖物
    window.allDriveRouteArr = [];
    window.allMesOverlays = []; //测量时所画出的覆盖物数组
//	window.allDriveRouteOverlays = []; //生成救援路线时所生成的覆盖物数组
    window.allMultiWinFlagArr = []; //当前所有多窗口弹窗标识数组
    window.markerList = new Array();
    window.polylineList = new Array();
    window.infoBoxList = new Array();
    window.eventPoint = new Array();
    window.resourceList = new Array();//资源评估覆盖物
    //初始化加载地图组件
    window.map = initMap();

    //初始化事故信息
    initEventInfo(eventid);

    //初始化事故相关的地图覆盖物等资源
//	initEvnMapRes();

    //初始化资源数据
    initResourceInfo();

    //默认显示区域气象
    $("#weather_inc").show();

    //默认加载避难场所
    $("#bncsGrid").show();
    $("#jydwGrid").hide();
    $("#ylzyGrid").hide();
    $("#wzzbGrid").hide();
    $("#ysbzGrid").hide();
    $("#txbzGrid").hide();
    //避难场所
    $("#bncs").click(function () {
        $("#bncsGrid").show();
        $("#jydwGrid").hide();
        $("#ylzyGrid").hide();
        $("#wzzbGrid").hide();
        $("#ysbzGrid").hide();
        $("#txbzGrid").hide();

    });
    //救援队伍
    $("#jydw").click(function () {
        $("#bncsGrid").hide();
        $("#jydwGrid").show();
        $("#ylzyGrid").hide();
        $("#wzzbGrid").hide();
        $("#ysbzGrid").hide();
        $("#txbzGrid").hide();

    });
    //医疗资源
    $("#ylzy").click(function () {
        $("#bncsGrid").hide();
        $("#jydwGrid").hide();
        $("#ylzyGrid").show();
        $("#wzzbGrid").hide();
        $("#ysbzGrid").hide();
        $("#txbzGrid").hide();

    });
    //物资装备
    $("#wzzb").click(function () {
        $("#bncsGrid").hide();
        $("#jydwGrid").hide();
        $("#ylzyGrid").hide();
        $("#wzzbGrid").show();
        $("#ysbzGrid").hide();
        $("#txbzGrid").hide();

    });
    //运输保障
    $("#ysbz").click(function () {
        $("#bncsGrid").hide();
        $("#jydwGrid").hide();
        $("#ylzyGrid").hide();
        $("#wzzbGrid").hide();
        $("#ysbzGrid").show();
        $("#txbzGrid").hide();

    });
    //通信保障
    $("#txbz").click(function () {
        $("#bncsGrid").hide();
        $("#jydwGrid").hide();
        $("#ylzyGrid").hide();
        $("#wzzbGrid").hide();
        $("#ysbzGrid").hide();
        $("#txbzGrid").show();

    });

    //初始化下方导航栏菜单点击事件-----------------------------------
    $(".navBargroup").on("click", ".navBottom", function () {
        var acClass = $(this).attr("class");
        var tgtId = $(this).attr("id");
        var acId = $(this).data("kind");
        var aClass = "";
        if (acId == "sgjb") {
            aClass = "accidentInfo";
        } else if (acId == "qxxx") {
            aClass = "weatherInfo";
        } else {
            aClass = "probeInfo";
        }
        if (acClass === "item navBottom visited2") {
            acClass = "item navBottom";
            $("#" + acId + acId).attr("class", aClass + " animated slideOutRight");


            //处理各弹窗关闭事件
            if ("sgmnBtn" == tgtId) {
                if (window.sgmnWinIndex) {
                    layer.close(window.sgmnWinIndex);
                    window.sgmnWinIndex = null;
                }
            } else if ("zypgBtn" == tgtId) {
                if (window.zypgWinIndex) {
                    layer.close(window.zypgWinIndex);
                    window.zypgWinIndex = null;
                }
            } else if ("zhycBtn" == tgtId) {
                if (window.zhycWinIndex) {
                    layer.close(window.zhycWinIndex);
                    window.zhycWinIndex = null;
                }
            } else if ("znfaBtn" == tgtId) {
                if (window.znfaWinIndex) {
                    layer.close(window.znfaWinIndex);
                    window.znfaWinIndex = null;
                }
            } else if ("cjBtn" == tgtId) {
                //清除上次由测量工具所留下的覆盖物
                clearAllMesOverlays(window.allMesOverlays);
            } else if ("bjBtn" == tgtId) {

            } else if ("htsxBtn" == tgtId) {
                if (window.htsxWinIndex) {
                    layer.close(window.htsxWinIndex);
                    window.htsxWinIndex = null;
                }
            }else if("xcxxBtn" == tgtId){
                if (window.xcxxWinIndex) {
                    layer.close(window.xcxxWinIndex);
                    window.xcxxWinIndex = null;
                }
            }
        } else {
            acClass = "item navBottom visited2";
            $("#" + acId + acId).attr("class", aClass + " animated slideInRight");

            //事故模拟弹窗打开事件
            if ("sgmnBtn" == tgtId) {
                //清除上次由测量工具所留下的覆盖物
                clearAllMesOverlays(window.allMesOverlays);

                //判断是否已关闭智能方案窗口
                if (window.allMultiWinFlagArr.contains("znfa")) {
                    parent.toast("请先关闭智能方案窗口，再进行事故模拟相关操作！");
                    return;
                }

                //打开事故模拟窗口
                // 45% 50%
                window.sgmnWinIndex = openEmsResWin(BASE_URL + "views/module/ems/map/evnanalog/evnAnalogIndex.html?" +
                    "eventid=" + $("#eventid").val() + "&eventlongitude=" + $("#eventlongitude").val() +
                    "&eventlatitude=" + $("#eventlatitude").val(), "事故模拟", "500px", "300px", "sgmn", function () {
                    //清除事故模拟相关的覆盖物
                    if (window.allEvnAnaPolyArr) {
                        if (0 < window.allEvnAnaPolyArr.length) {
                            _.map(window.allEvnAnaPolyArr, function (tmpPolyObj, index) {
                                window.map.removeOverlay(tmpPolyObj.poly);
                            });
                        }
                        window.allEvnAnaPolyArr = null;
                    }

                    //清除事故模拟相关的防护目标点位
                    if (window.evnAnaPtDic) {
                        //清空地图上所有历史防护目标点位覆盖物
                        if (0 < window.evnAnaPtDic.size()) {
                            _.map(window.evnAnaPtDic.values(), function (tmpPtMap, index) {
                                window.map.removeOverlay(tmpPtMap.marker);
                            });
                        }
                        window.evnAnaPtDic = null;
                    }

                    if (window.sgmnWinIndex) {
                        window.sgmnWinIndex = null;
                    }
                    //关闭弹窗
                    _.map(window.infoBoxList, function (infobox) {
                        infobox.close();
                    });
                    
                    //修改底部菜单样式
                    $("#sgmnBtn").removeClass("visited2");
                });
            } else if ("zypgBtn" == tgtId) {
                //资源评估弹窗打开事件
            	//达开资源评估 隐藏资源列表
            	$('.zyxq').attr('class','zyxq animated slideOutLeft')
                setTimeout(function() {
                    $('.accidentList').attr('class','accidentList animated slideOutLeft')
                    setTimeout(function() {
                        $('#open').attr('class','animated slideInLeft').css('left','-2px')
                    }, 500);
                }, 500);
            	//接触打开按钮的点击事件
            	$('#open').off("click");
            	
                //清除上次由测量工具所留下的覆盖物
                clearAllMesOverlays(window.allMesOverlays);

                //判断是否已关闭智能方案窗口
                if (window.allMultiWinFlagArr.contains("znfa")) {
                    parent.toast("请先关闭智能方案窗口，再进行资源评估相关操作！");
                    return;
                }

                //显示隐藏当前页面
//        		$('.layui-layer-title').each(function(){
//        			if($(this).text()=="资源评估"){
//        		    	var id = $(this).parent().attr("id");
//        		    	if($("#"+id).css("display")=="block"){
//        		    		$("#"+id).hide();
//        		    	}else{
//        		    		$("#"+id).show();
//        		    	}
//        		    }
//        		  });

                //打开资源评估路径地址
                //50% 65%
                window.zypgWinIndex = openEmsResWin(BASE_URL + "views/module/ems/map/resource/resourceInfoList.html?eventid=" + $("#eventid").val(),
                    "资源评估", "600px", "328px", "zypg", function () {
                        //清除资源评估点位标记
                        if (window.resourceList) {
                        	console.log(window.resourceList.length);
                            if (0 < window.resourceList.length) {
                                _.map(window.resourceList, function (tmpPolyObj, index) {
                                    window.map.removeOverlay(tmpPolyObj);
                                });
                            }
                            window.resourceList = [];
                        }

                        if (window.zypgWinIndex) {
                            window.zypgWinIndex = null;
                            
                            //关闭窗口打开资源列表
                            $('#open').attr('class','animated slideOutLeft').css('left','-100px');        
                            setTimeout(function() {
                                $('.accidentList').attr('class','accidentList animated slideInLeft')
                                setTimeout(function() {
                                    $('.zyxq').attr('class','zyxq animated slideInLeft');             
                                }, 500);
                            }, 500);
                            //绑定点击事件
                            $('#open').off("click").on("click",function(){
                                $('#open').attr('class','animated slideOutLeft').css('left','-100px');        
                                setTimeout(function() {
                                    $('.accidentList').attr('class','accidentList animated slideInLeft')
                                    setTimeout(function() {
                                        $('.zyxq').attr('class','zyxq animated slideInLeft');             
                                    }, 500);
                                }, 500);
                            })
                            //加载事故信息
                            window.map.addOverlay(window.eventPoint[0]);
                            //加载资源
                            _.map(window.allEmsResPtDic.values(), function (tmpEmsRes, index) {
                                window.map.addOverlay(tmpEmsRes.marker);
                            });
                        }
                        //关闭弹窗
                        _.map(window.infoBoxList, function (infobox) {
                            infobox.close();
                        });
                        	
                        //修改底部菜单样式
                        $("#zypgBtn").removeClass("visited2");
                    });
            } else if ("zhycBtn" == tgtId) {
                //综合预测弹窗打开事件

                //清除上次由测量工具所留下的覆盖物
                clearAllMesOverlays(window.allMesOverlays);

                //判断是否已关闭智能方案窗口
                if (window.allMultiWinFlagArr.contains("znfa")) {
                    parent.toast("请先关闭智能方案窗口，再进行综合预测相关操作！");
                    return;
                }

                //初始化综合预测
                initForecast($("#eventid").val());
            } else if ("znfaBtn" == tgtId) {
                //智能方案弹窗打开事件

                //清除上次由测量工具所留下的覆盖物
                clearAllMesOverlays(window.allMesOverlays);

                //判断是否已关闭事故模拟、资源评估、综合预测窗口
                if (window.allMultiWinFlagArr.contains("sgmn")) {
                    parent.toast("请先关闭事故模拟窗口，再进行智能方案相关操作！");
                    return;
                }
                if (window.allMultiWinFlagArr.contains("zypg")) {
                    parent.toast("请先关闭资源评估窗口，再进行智能方案相关操作！");
                    return;
                }
                if (window.allMultiWinFlagArr.contains("zhyc")) {
                    parent.toast("请先关闭综合预测窗口，再进行智能方案相关操作！");
                    return;
                }

                //判断事故模拟是否有最新的记录
                if (!isEverEvnAna($("#eventid").val())) {
                    parent.toast("请先进行完事故模拟操作再进行打开智能方案窗口！");
                    return;
                }
                //判断资源评估是否有最新记录
                if (!isEverResource($("#eventid").val())) {
                    parent.toast("请先进行完资源评估操作再进行打开智能方案窗口！");
                    return;
                }
                //判断综合预测是否有最新记录
                if (!isEverForecast($("#eventid").val())) {
                    parent.toast("请先进行完综合预测操作再进行打开智能方案窗口！");
                    return;
                }

                //打开智能方案弹窗
                //50% 55%
                window.znfaWinIndex = openEmsResWin(BASE_URL + "views/module/ems/map/aiplan/index/aiplanIndex.html?" +
                    "eventid=" + $("#eventid").val(), "智能方案", "600px", "333px", "znfa", function () {
                    $("#refBtnDetDiv, #referenceBtn, #msgBtn").hide();

                    //清除事故模拟相关的覆盖物
                    if (window.allEvnAnaPolyArr) {
                        if (0 < window.allEvnAnaPolyArr.length) {
                            _.map(window.allEvnAnaPolyArr, function (tmpPolyObj, index) {
                                window.map.removeOverlay(tmpPolyObj.poly);
                            });
                        }
                        window.allEvnAnaPolyArr = null;
                    }

                    //清除事故模拟相关的防护目标点位
                    if (window.evnAnaPtDic) {
                        //清空地图上所有历史防护目标点位覆盖物
                        if (0 < window.evnAnaPtDic.size()) {
                            _.map(window.evnAnaPtDic.values(), function (tmpPtMap, index) {
                                window.map.removeOverlay(tmpPtMap.marker);
                            });
                        }
                        window.evnAnaPtDic = null;
                    }

                    //清除综合预测的覆盖物
                    if (window.allDriveRouteArr) {
                        if (0 < window.allDriveRouteArr.length) {
                            _.map(window.allDriveRouteArr, function (tmpPolyObj, index) {
                                window.map.removeOverlay(tmpPolyObj);
                            });
                        }
                        window.allDriveRouteArr = [];
                    }

                    //清除资源评估点位标记
                    if (window.allResMarkArr) {
                        if (0 < window.allResMarkArr.length) {
                            _.map(window.allResMarkArr, function (tmpPolyObj, index) {
                                window.map.removeOverlay(tmpPolyObj);
                            });
                        }
                        window.allResMarkArr = [];
                    }

                    if (window.znfaWinIndex) {
                        window.znfaWinIndex = null;
                    }
                    //修改底部菜单样式
                    $("#znfaBtn").removeClass("visited2");
                });
            } else if ("cjBtn" == tgtId) {
                //测距打开事件
                initMesTools();
            } else if ("bjBtn" == tgtId) {
                //标记事件

            } else if ("htsxBtn" == tgtId) {
                //绘图筛选弹窗事件

                //清除上次由测量工具所留下的覆盖物
                clearAllMesOverlays(window.allMesOverlays);

                //判断是否已关闭事故模拟、资源评估、综合预测、智能方案窗口
                if (window.allMultiWinFlagArr.contains("sgmn")) {
                    parent.toast("请先关闭事故模拟窗口，再进行绘图筛选相关操作！");
                    return;
                }
                if (window.allMultiWinFlagArr.contains("zypg")) {
                    parent.toast("请先关闭资源评估窗口，再进行绘图筛选相关操作！");
                    return;
                }
                if (window.allMultiWinFlagArr.contains("zhyc")) {
                    parent.toast("请先关闭综合预测窗口，再进行绘图筛选相关操作！");
                    return;
                }
                if (window.allMultiWinFlagArr.contains("znfa")) {
                    parent.toast("请先关闭智能方案窗口，再进行绘图筛选相关操作！");
                    return;
                }

                //打开绘图筛选弹窗
                // 38% 40%
                window.htsxWinIndex = openEmsResWin(BASE_URL + "views/module/ems/map/drawFilter/drawFilterIndex.html?evnLng=" +
                    $("#eventlongitude").val() + "&evnLat=" + $("#eventlatitude").val(),
                    "资源查询", "450px", "233px", "htsx", function () {
//        							alert("触发关闭操作");
                        //清空绘制筛选所添加的地图覆盖物圆
                        if (window.drawFilterCircle) {
                            window.map.removeOverlay(window.drawFilterCircle);
                            window.drawFilterCircle = null;
                            //					alert(window.drawFilHidMarkers.length);

                            //显示圆外面之前隐藏的marker对象
                            if (window.drawFilHidMarkers) {
                                if (0 < window.drawFilHidMarkers.length) {
                                    _.map(window.drawFilHidMarkers, function (tmpMarker, index) {
                                        tmpMarker.show();
                                    });
                                }
                                window.drawFilHidMarkers = null;
                            }
                        }

                        if (window.htsxWinIndex) {
                            window.htsxWinIndex = null;
                        }

                        //修改底部菜单样式
                        $("#htsxBtn").removeClass("visited2");
                    });
                    //现场信息 55% 70%
            }else if("xcxxBtn" == tgtId){
                window.xcxxWinIndex = openEmsResWin(BASE_URL + "views/module/ems/map/liveMsg/liveMsgIndex.html?eventid=" + $("#eventid").val(),
                    "现场信息", "655px", "415px", "xcxx", function () {
                        if (window.xcxxWinIndex) {
                            window.xcxxWinIndex = null;
                        }

                        //修改底部菜单样式
                        $("#xcxxBtn").removeClass("visited2");
                    });
            }
        }
        $(this).attr("class", acClass)
    });

//	//视频监测触发事件
//	$("#spjc").off("click").on("click", function() {
//		//清除上次由测量工具所留下的覆盖物
//		clearAllMesOverlays(window.allMesOverlays);
//		
//		//打开视频监控路径地址
//		openEmsResWin(BASE_URL + "views/module/ems/map/video/videoInfoList.html?eventid="+$("#eventid").val(),
//				  "视频监控", "35%", "41%", "spjk");
//	});
});

/**
 * 初始化达拉特地图
 * @returns {BMap.Map}
 */
function initMap() {
    //初始化地图展示的高度
    $("#emResMap").height($(window).height());

    //地图本地根据IP地址定位以及添加标尺(禁止点击地图上的地点弹出百度详情)
    var map = new BMap.Map("emResMap", {enableMapClick: false, minZoom: 6, maxZoom: 18}); // 创建Map实例
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
        {
            "featureType": "land",
            "elementType": "geometry",
            "stylers": {
                "color": "#24252b"
            }
        },
        {
            "featureType": "road",
            "elementType": "geometry",
            "stylers": {
                "color": "#171717",
                "hue": "#171717",
                "weight": "0.1",
                "lightness": -6,
                "saturation": -15
            }
        },
        {
            "featureType": "building",
            "elementType": "geometry",
            "stylers": {
                "color": "#2a2b2e"
            }
        },
        {
            "featureType": "highway",
            "elementType": "all",
            "stylers": {
                "lightness": -42,
                "saturation": -91
            }
        },
        {
            "featureType": "arterial",
            "elementType": "geometry",
            "stylers": {
                "lightness": -77,
                "saturation": -94
            }
        },
        {
            "featureType": "green",
            "elementType": "geometry",
            "stylers": {
                "color": "#1b1b1b"
            }
        },
        {
            "featureType": "subway",
            "elementType": "geometry.stroke",
            "stylers": {
                "color": "#181818"
            }
        },
        {
            "featureType": "railway",
            "elementType": "geometry",
            "stylers": {
                "lightness": -52
            }
        },
        {
            "featureType": "all",
            "elementType": "labels.text.stroke",
            "stylers": {
                "color": "#313131"
            }
        },
        {
            "featureType": "all",
            "elementType": "labels.text.fill",
            "stylers": {
                "color": "#8b8787"
            }
        },
        {
            "featureType": "manmade",
            "elementType": "geometry",
            "stylers": {
                "color": "#1b1b1b"
            }
        },
        {
            "featureType": "local",
            "elementType": "geometry",
            "stylers": {
                "lightness": -75,
                "saturation": -91
            }
        },
        {
            "featureType": "subway",
            "elementType": "geometry",
            "stylers": {
                "lightness": -65
            }
        },
        {
            "featureType": "railway",
            "elementType": "all",
            "stylers": {
                "lightness": -40
            }
        },
        {
            "featureType": "road",
            "elementType": "geometry",
            "stylers": {
                "color": "#171717",
                "hue": "#041e3b",
                "weight": "1.0",
                "lightness": -12,
                "saturation": -15
            }
        },
        {
            "featureType": "water",
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
//	map.setMapStyle({styleJson : mapStyle});

    //设置地图范围为达拉特(参数为 西南点坐标、东北点坐标)
//	var dltBound = new BMap.Bounds(new BMap.Point(109.186042, 39.791787), new BMap.Point(111.238059, 40.909685));
//	try {	
//		BMapLib.AreaRestriction.setBounds(map, dltBound);
//	} catch (e) {
//		console.log("区域限定错误");
//	}
    //默认中心位置为达拉特
    map.centerAndZoom(new BMap.Point(116.8923,37.3045), 15);

    //左下角添加比例尺控件
    map.addControl(new BMap.ScaleControl({anchor: BMAP_ANCHOR_BOTTOM_LEFT}));

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
function initMapPts(event, type, radius) {
    //清除地图上所有覆盖物
    window.map.clearOverlays();
    //初始化地图
//	var map = initMap();
    //事件标题
    $("#curEventTitle").html(event.eventname);
    //事故信息maker
    var eventMarker;
    //事故坐标
    if (type == "eventInfo") {
        //事件经纬度赋值，便于以事件为中心画圆， 先清空后赋值
        $("#eventlongitude").val("");
        $("#eventlatitude").val("");
        $("#eventlongitude").val(event.longitude);
        $("#eventlatitude").val(event.latitude);
        window.evnPt = new BMap.Point(event.longitude, event.latitude);
        var evnPtMark = {};
        evnPtMark.title = event.eventname;
        evnPtMark.icon = new BMap.Icon(BASE_URL + "images/map/icon/mark_event_red.gif", new BMap.Size(50, 50), // 视窗大小
        　　　　　　　　{
  　　　　　　　　　　imageSize: new BMap.Size(50,50)// 引用图片实际大小
  　　　　　　　　});//标注图标
        eventMarker = new BMap.Marker(window.evnPt, evnPtMark);
        //测试点位点击弹窗事件
        var reasonStr = event.reason,
        	reasonFmtStr = "";
        if (50 < reasonStr.length) {
        	reasonFmtStr += "<a href='javascript:void(0)' style='text-decoration: none;color: #000;' title='" + reasonStr + "'>" +
        	reasonStr.substring(0, 25) + "<br/>";
        	reasonFmtStr += reasonStr.substring(25, 51) + "...</a>";
        } else {
        	reasonFmtStr = reasonStr;
        }
        
        var content = "<div class='infoBoxContent'><font size='3'><strong>"+event.eventname+"</strong></font><hr style='border:none;border-top: 1px solid #555555;margin-bottom:2px;margin-top:2px'/>事故原因 ：" + reasonFmtStr + "<br />" + "事故地点：" + event.address + "<br />" + "经度：" + event.longitude + "<br />" + "纬度：" + event.latitude+"</div>";
       
        var infoBox = new BMapLib.InfoBox(map, content, {
            boxStyle: {
                minWidth: "270px",
                Height: "150px",
                marginBottom: "20px",
//                background: "white",
//            	padding: "10px",
            }, 
            closeIconMargin: "4px 4px 4px 4px", 
            closeIconTop:"10px",
            closeIconUrl: BASE_URL + "images/map/icon/iw_close1d3.gif",
            enableAutoPan: true, 
            align: INFOBOX_AT_TOP
        });
        _.map(window.infoBoxList, function (infobox) {
            infobox.close();
        });
        window.infoBoxList.push(infoBox);
//        var infoWindow = new BMap.InfoWindow(content, {
//            width: 0,
//            height: 0,
//            title: "事故名称 ：" + event.eventname,
//            enableMessage: false
//        });
        eventMarker.addEventListener("click", function () {
        	infoBox.open(eventMarker);
        });

        
        window.eventPoint.push(eventMarker);
        window.map.addOverlay(eventMarker);
    }

    //视频监控定位坐标
    var videoMaker;//初始化视频maker
    var probeMarker;//初始化探头maker
    if (type == "video") {
        videoMaker = new BMap.Marker(new BMap.Point(event.longitude, event.latitude), {"title": event.videoname});
        //测试点位点击弹窗事件
        var content = "<div class='infoBoxContent'>视频名称：" + event.videoname + "<br/>" + "安装地址：" + event.address + "<br/>" + "经度：" + event.longitude + "<br/>" + "纬度：" + event.latitude+"</div>";
        
        var infoBox = new BMapLib.InfoBox(map, content, {
            boxStyle: {
                minWidth: "270px",
                Height: "150px",
                marginBottom: "20px",
//                background: "white",
//            	padding: "10px",
            }, 
            closeIconMargin: "4px 4px 4px 4px", 
            closeIconTop:"10px",
            closeIconUrl: BASE_URL + "images/map/icon/iw_close1d3.gif",
            enableAutoPan: true, 
            align: INFOBOX_AT_TOP
        });
        
//        var infoWindow = new BMap.InfoWindow(content, {
//            width: 100,
//            height: 106,
//            title: "视频编号：" + event.videonum,
//            enableMessage: false
//        });
        //显示坐标位置面板信息
//        window.map.openInfoWindow(infoWindow, videoMaker.getPosition());

        _.map(window.infoBoxList, function (infobox) {
            infobox.close();
        });
        window.infoBoxList.push(infoBox);
        eventMarker.addEventListener("click", function () {
        	infoBox.open(videoMaker);
        });
        
        window.map.addOverlay(videoMaker);

    }

    //探头定位坐标
    if (type == "probe") {
        probeMarker = new BMap.Marker(new BMap.Point(event.longitude, event.latitude), {"title": event.probename});
        //测试点位点击弹窗事件
        var content = "探头名称：" + event.probename + "<br/>" + "安装地址：" + event.address + "<br/>" + "经度：" + event.longitude + "<br/>" + "纬度：" + event.latitude;
        var infoWindow = new BMap.InfoWindow(content, {
            width: 100,
            height: 106,
            title: "探头编号：" + event.probenum,
            enableMessage: false
        });
        //显示坐标位置面板信息
        window.map.openInfoWindow(infoWindow, probeMarker.getPosition());

        window.map.addOverlay(probeMarker);

    }

    //搜索资源
    var resourceMaker;//初始化搜索资源maker
    if (type == "seacherResource") {
        resourceMaker = new BMap.Marker(new BMap.Point(event.longitude, event.latitude), {"title": event.resname});
        //测试点位点击弹窗事件
        
        
        var content = "<div class='infoBoxContent'>资源类型：" + event.restype + "<br/>" + "值班电话：" + event.resphone + "<br/>" + "详细地址：" + event.resaddress+"</div>";
        var infoBox = new BMapLib.InfoBox(map, content, {
            boxStyle: {
                minWidth: "270px",
                Height: "150px",
                marginBottom: "20px",
//                background: "white",
//            	padding: "10px",
            }, 
            closeIconMargin: "4px 4px 4px 4px", 
            closeIconTop:"10px",
            closeIconUrl: BASE_URL + "images/map/icon/iw_close1d3.gif",
            enableAutoPan: true, 
            align: INFOBOX_AT_TOP
        });
        
        _.map(window.infoBoxList, function (infobox) {
            infobox.close();
        });
        window.infoBoxList.push(infoBox);
//        var infoWindow = new BMap.InfoWindow(content, {
//            width: 100,
//            height: 106,
//            title: "<font size='3'>" + event.resname + "</font>" + '<hr style="border:none;border-top: 1px solid #555555;margin-bottom:10px;margin-top:2px" />',
//            enableMessage: false
//        });
        //显示坐标位置面板信息
        resourceMaker.addEventListener("click", function () {
        	infoBox.open(resourceMaker);
        });

        window.map.addOverlay(resourceMaker);
    }


    window.map.centerAndZoom(new BMap.Point(event.longitude, event.latitude), 14);

    window.mapDicUtil = new MapUtil();
    //应急救援-事故信息坐标添加到地图上
    if (type == "eventInfo") {
        window.mapDicUtil.put("1", eventMarker);
    }
    //应急救援-视频监控坐标添加到地图上
    if (type == "video") {
        window.mapDicUtil.put("2", videoMaker);
    }
    //应急救援-周边监测点坐标添加到地图上
    if (type == "probe") {
        window.mapDicUtil.put("3", probeMarker);
    }
    //应急救援-搜索资源添加到地图上
    if (type == "seacherResource") {
        window.mapDicUtil.put("4", resourceMaker);
    }
    //应急救援-资源评估添加到地图上
    if (type == "resourceEva") {
        for (var i = 0; i < event.length; i++) {
//            var resourceEvaMarker = new BMap.Marker(new BMap.Point(event[i].longitude, event[i].latitude), {"title": event[i].resourcename});
            //设置不同点位的图标
        	var markerIcon = null;
        	if ("bncs" == event[i].type) {
        		markerIcon = new BMap.Icon(BASE_URL + "images/map/icon/marker_bncs.png", new BMap.Size(40, 49));
        	} else if ("jydw" == event[i].type) {
        		markerIcon = new BMap.Icon(BASE_URL + "images/map/icon/marker_jydw.png", new BMap.Size(40, 49));
        	} else if ("ylzy" == event[i].type) {
        		markerIcon = new BMap.Icon(BASE_URL + "images/map/icon/marker_ylzy.png", new BMap.Size(40, 49));
        	} else if ("wzzb" == event[i].type) {
        		markerIcon = new BMap.Icon(BASE_URL + "images/map/icon/marker_wzzb.png", new BMap.Size(40, 49));
        	}
            var resourceEvaMarker = new BMap.Marker(new BMap.Point(event[i].longitude, event[i].latitude),
            		{"title": event[i].resourcename,
            		 "icon": markerIcon
            		}
            );
            window.resourceList.push(resourceEvaMarker);
            window.map.addOverlay(resourceEvaMarker);
            //给标注点添加点击事件。使用立即执行函数和闭包
            (function () {
                var thePoint = event[i];
                resourceEvaMarker.addEventListener("click", function () {
                    showInfo(this, thePoint);
                });
            })();


            //测试点位点击弹窗事件
//			var content = "资源编码："+event[i].code+"<br/>"+"地址："+event[i].address+"<br/>"+"经度："+event[i].longitude+"<br/>"+"纬度："+event[i].latitude;;
//			var infoWindow = new BMap.InfoWindow(content, {
//				width: 100,
//				height: 106,
//				title:"资源名称:"+event[i].resourcename,
//				enableMessage: false
//			});
//			resourceEvaMarker.addEventListener("click", function() {
//				map.openInfoWindow(infoWindow, resourceEvaMarker.getPosition());
//			});
//			
//			map.addOverlay(resourceEvaMarker);
            window.map.centerAndZoom(new BMap.Point(event[i].longitude, event[i].latitude), 15);
            //从第五条开始累加，避免与前面的key重复
//			window.mapDicUtil.put(i+5, resourceEvaMarker);
        }
        //以事件为中心，分析范围为半径画圆
        initMapCircle(radius);
    }

    if (type == "displayResourceEva") {
        window.allResMarkArr = [];
        displayResourceEvaMaker = new BMap.Marker(new BMap.Point(event.longitude, event.latitude), {"title": event.resname});
        window.map.addOverlay(displayResourceEvaMaker);
        //覆盖物存储到数组中
        window.allResMarkArr.push(displayResourceEvaMaker);
        (function () {
            var thePoint = event;
            displayResourceEvaMaker.addEventListener("click", function () {
                showResourceInfo(this, thePoint);
            });
        })();

        window.map.centerAndZoom(new BMap.Point(event.longitude, event.latitude), 15);
        initMapCircle(radius);
    }
}

//标记物资仓库、救援队伍位置
function initResMarks(event, radius) {
    //清除资源评估点位标记
    if (window.allResMarkArr) {
        if (0 < window.allResMarkArr.length) {
            _.map(window.allResMarkArr, function (tmpPolyObj, index) {
                window.map.removeOverlay(tmpPolyObj);
            });
        }
        window.allResMarkArr = [];
    } else {
        window.allResMarkArr = [];
    }
    for (var i = 0; i < event.length; i++) {
//        var resourceEvaMarker = new BMap.Marker(new BMap.Point(event[i].longitude, event[i].latitude), {"title": event[i].resourcename});
        
        //设置不同点位的图标
    	var markerIcon = null;
    	if ("bncs" == event[i].type) {
    		markerIcon = new BMap.Icon(BASE_URL + "images/map/icon/marker_bncs.png",  new BMap.Size(26, 32), // 视窗大小
    	    　　　　　　　　{
    	　　　　　　　　imageSize: new BMap.Size(26,32)// 引用图片实际大小
    	　　　　　　});
    	} else if ("yjdw" == event[i].type) {
    		markerIcon = new BMap.Icon(BASE_URL + "images/map/icon/marker_jydw.png",  new BMap.Size(26, 32), // 视窗大小
    	    　　　　　　　　{
    	　　　　　　　　imageSize: new BMap.Size(26,32)// 引用图片实际大小
    	　　　　　　});
    	} else if ("yljg" == event[i].type) {
    		markerIcon = new BMap.Icon(BASE_URL + "images/map/icon/marker_ylzy.png",  new BMap.Size(26, 32), // 视窗大小
    	    　　　　　　　　{
    	　　　　　　　　imageSize: new BMap.Size(26,32)// 引用图片实际大小
    	　　　　　　});
    	} else if ("yjck" == event[i].type) {
    		markerIcon = new BMap.Icon(BASE_URL + "images/map/icon/marker_wzzb.png",  new BMap.Size(26, 32), // 视窗大小
    	    　　　　　　　　{
    	　　　　　　　　imageSize: new BMap.Size(26,32)// 引用图片实际大小
    	　　　　　　});
    	}
    	
        var resourceEvaMarker = new BMap.Marker(new BMap.Point(event[i].longitude, event[i].latitude),
        		{"title": event[i].resourcename,
        		 "icon": markerIcon
        		}
        );
        window.map.addOverlay(resourceEvaMarker);
        //覆盖物存储到数组中
        window.allResMarkArr.push(resourceEvaMarker);
        //给标注点添加点击事件。使用立即执行函数和闭包
        (function () {
            var thePoint = event[i];
            resourceEvaMarker.addEventListener("click", function () {
                showInfo(this, thePoint);
            });
        })();
        window.map.centerAndZoom(new BMap.Point(event[i].longitude, event[i].latitude), 15);
    }
    initMapCircle(radius)
}
//点击单个资源时加载
function initOneResMarks(event, radius) {
    //清除资源评估点位标记
    if (window.allResMarkArr) {
        if (0 < window.allResMarkArr.length) {
            _.map(window.allResMarkArr, function (tmpPolyObj, index) {
                window.map.removeOverlay(tmpPolyObj);
            });
        }
        window.allResMarkArr = [];
    }
    //获取资源
    var tem = window.allEmsResPtDic.get(event.id);
    //触发点位点击事件
    tem.click();
    //设置为中心点
    window.map.centerAndZoom(new BMap.Point(event.longitude, event.latitude),15);
//    initMapCircle(radius);
}

//显示信息窗口，显示标注点的信息。  
function showInfo(thisMaker, point) {
    //测试点位点击弹窗事件
    var content = "<div class='infoBoxContent'>资源编码：" + point.code + "<br/>" + "地址：" + point.address + "<br/>" + "经度：" + point.longitude + "<br/>" + "纬度：" + point.latitude+"</div>";
    
    var infoBox = new BMapLib.InfoBox(map, content, {
        boxStyle: {
            minWidth: "270px",
            Height: "150px",
            marginBottom: "20px",
//            background: "white",
//        	padding: "10px",
        }, 
        closeIconMargin: "4px 4px 4px 4px", 
        closeIconTop:"10px",
        closeIconUrl: BASE_URL + "images/map/icon/iw_close1d3.gif",
        enableAutoPan: true, 
        align: INFOBOX_AT_TOP
    });
    
//    var infoWindow = new BMap.InfoWindow(content);  // 创建信息窗口对象  
    
//    thisMaker.addEventListener("click", function () {
//    	infoBox.open(thisMaker);
//    });
    _.map(window.infoBoxList, function (infobox) {
        infobox.close();
    });
    window.infoBoxList.push(infoBox);
    
    infoBox.open(thisMaker);   //图片加载完毕重绘infowindow  
}

//显示信息窗口，显示标注点的信息。  
function showResourceInfo(thisMaker, point) {
    //测试点位点击弹窗事件
    var content = "<div class='infoBoxContent'>资源名称：" + point.resourcename + "<br/>资源类型：" + point.typename + "<br/>经度：" + point.longitude + "<br/>纬度：" + point.latitude+"</div>";
    
    var infoBox = new BMapLib.InfoBox(map, content, {
        boxStyle: {
            minWidth: "270px",
            Height: "150px",
            marginBottom: "20px",
        }, 
        closeIconMargin: "4px 4px 4px 4px", 
        closeIconTop:"10px",
        closeIconUrl: BASE_URL + "images/map/icon/iw_close1d3.gif",
        enableAutoPan: true, 
        align: INFOBOX_AT_TOP
    });
    _.map(window.infoBoxList, function (infobox) {
        infobox.close();
    });
    window.infoBoxList.push(infoBox);

    infoBox.open(thisMaker);   //图片加载完毕重绘infowindow  
}

//达开防护目标弹窗
function showFHInfo(thisMaker, point,type) {
	var typename="";
	if (point.TYPEID=='1' || point.typeid=='1') {
		typename="防护目标";
	}else{
		typename="危险源";
	}
	
	if (type=='sgmn') {
		//测试点位点击弹窗事件
		var content = "<div class='infoBoxContent'>场所名称：" + point.NAME + "<br/>" + "场所类型：" + typename + "<br/>" + "人口：" + point.POPULATION + "<br/>" + "电话：" + point.TEL+"</div>";
		
	}else if (type='znfa') {
		//测试点位点击弹窗事件
		var content = "<div class='infoBoxContent'>场所名称：" + point.name + "<br/>" + "场所类型：" + typename + "<br/>" + "人口：" + point.population + "<br/>" + "电话：" + point.tel+"</div>";
	}
    var infoBox = new BMapLib.InfoBox(map, content, {
        boxStyle: {
            minWidth: "270px",
            Height: "150px",
            marginBottom: "20px"
        }
        , closeIconMargin: "4px 4px 4px 4px"
        , closeIconUrl: BASE_URL + "images/map/icon/iw_close1d3.gif"
        , enableAutoPan: true
        , align: INFOBOX_AT_TOP
    });
    
    window.infoBoxList.push(infoBox);
    
    _.map(window.infoBoxList, function (infobox) {
        infobox.close();
    });
    //点位跳动
    thisMaker.setAnimation(BMAP_ANIMATION_BOUNCE);
    infoBox.open(thisMaker);   //图片加载完毕重绘infowindow  
    //infoBox关闭时执行的操作
    infoBox.addEventListener("close", function (e) {
        //取消marker的跳动效果
    	thisMaker.setAnimation(null);
    });
}


/**
 * 事故发生区域为圆心做覆盖
 * @param map
 * @param event
 * @param radius
 */
function initMapCircle(radius) {
    //定义事故发生地为圆心
    var longitude = $("#eventlongitude").val();
    var latitude = $("#eventlatitude").val();
    var mPoint = new BMap.Point(longitude, latitude);
    var circle = new BMap.Circle(mPoint, radius * 1000, {
        strokeColor: "blue",
        strokeOpacity: 0.3,
        strokeWeight: 1,
//        fillColor: "#E2E8F1",
        fillColor: "blue",
        fillOpacity: 0.3
    });
    window.map.addOverlay(circle);
    window.resourceList.push(circle);
}


/**
 * 初始化加载GIS测量工具
 */
function initMesTools() {
    var overlayComplete = function (e) {
        //			 		alert("绘制完成后公共回调返回长度或面积值 -" + e.calculate + "-米或平方米");
        //			 		GeoUtils.getPolygonArea(e.overlay);
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
                //			    			else if (BMAP_DRAWING_MARKER == e.drawingMode) {
                //			    				continue;
                //			    			}

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
            offset: new BMap.Size(278, 65), //偏离值
            drawingModes: [
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
    window.drawingManager.addEventListener("circlecomplete", function (circle) {
        //			    	alert("圆中心点-" + JSON.stringify(circle.getCenter()));
        //			    	alert("圆半径-" + circle.getRadius() + "米");
        //			    	alert("圆范围-" + JSON.stringify(circle.getBounds()));
        //			    	alert("圆面积" + (3.1415926 * circle.getRadius() * circle.getRadius())  + "平方米");

    });

    //绘制工具点位监听事件，用于获取绘制结果
    //			    window.drawingManager.addEventListener("markercomplete", function(marker) {
    ////			    	alert("点坐标-" + JSON.stringify(marker.getPosition()));
    //			    });

    //绘制工具多边形监听事件，用于获取绘制结果
    window.drawingManager.addEventListener("polygoncomplete", function (polygon) {
        //			    	alert("多边形边界点经纬度-" + JSON.stringify(polygon.getPath()));
        //			    	alert("多边形面积" + BMapLib.GeoUtils.getPolygonArea(polygon.getPath()));

    });

    //绘制工具折线监听事件，用于获取绘制结果
    window.drawingManager.addEventListener("polylinecomplete", function (polyline) {
        //			    	alert("折线边界点经纬度-" + JSON.stringify(polyline.getPath()));
        //			    	alert("折线长" + BMapLib.GeoUtils.getPolylineDistance(polyline.getPath()) + "米");

    });

    //绘制工具长方形监听事件，用于获取绘制结果
    window.drawingManager.addEventListener("rectanglecomplete", function (polygon) {
        //			    	alert("长方形边界点经纬度-" + JSON.stringify(polygon.getPath()));
        //			    	alert("长方形面积" + BMapLib.GeoUtils.getPolygonArea(polygon.getPath()) + "平方米");

    });
}

/**
 * 清除上次由测量工具所留下的覆盖物
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

/**
 * 左上方应急救援导航子菜单弹窗
 * @param url
 * @param title
 * @param width
 * @param height
 * @param winType
 */
function openEmsResWin(url, title, width, height, winType, callback) {
    var curWinIndex = null;
    if (-1 == _.indexOf(window.allMultiWinFlagArr, winType)) {
        window.allMultiWinFlagArr.push(winType);
        curWinIndex = openWinWithCloseCallback(url, title, width, height, true, null, function () {
            //清除对左侧导航菜单的记录
            window.allMultiWinFlagArr.removeByValue(winType);

            //执行自定义回调事件
            if (callback) {
                callback();
            }
        }, true);
    }
    return curWinIndex;
}

/**
 * 数组删除制定元素
 */
Array.prototype.removeByValue = function (val) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == val) {
            this.splice(i, 1);
            break;
        }
    }
}

/**
 * 数组是否包含某元素
 */
Array.prototype.contains = function (needle) {
    for (i in this) {
        if (this[i] == needle) return true;
    }
    return false;
}

/**
 * 初始化事故简报
 * @param eventid
 */function loadSgjbInfo(eventid) {
    $.ajax({
        type: "post",
        url: BASE_URL + "ems/emssucevent/load/" + eventid,
        data: {},
        success: function (data) {
            if (data) {
                $("#sgjbInfo").html("<font size='2'>"
                    + getSmpFormatDateByLong(data.event.time, true) +
                    "在" + data.event.address + "发生"
                    + data.event.eventname + "。事因" +
                    data.event.reason + "，事故信息已上报。</font><br/><font size='2'>&nbsp;&nbsp;&nbsp;&nbsp;伤亡情况：" + data.event.casualty + "</font>");
            }
        }
    });
}

//-------------------事故信息-------------------------
/**
 * 初始化应急救援
 */
function initEventInfo(eventid) {
    //获取事故信息,按时间倒序
    $.ajax({
        type: "post",
        url: BASE_URL + "ems/emssucevent/load/" + eventid,
        data: {},
        success: function (data) {
            if (data) {
                $("#sgjbInfo").html("<font size='2'>" + getSmpFormatDateByLong(data.event.time, true) + "在" + data.event.address + "发生" + data.event.eventname + "。事因" +
                    data.event.reason + "，事故信息已上报。</font><br/><font size='2'>&nbsp;&nbsp;&nbsp;&nbsp;伤亡情况：" + data.event.casualty + "</font>");

                //初始化点位信息
                initMapPts(data.event, "eventInfo");
            }
            // 滚动条
            var areaHeight = $('#area').height();
            console.log(areaHeight);
            var infoHeight = $('#info').height();
            console.log(infoHeight);
            scrollShowOrHide(areaHeight, infoHeight);
            //根据内容控制滚动条显隐
            function scrollShowOrHide(aHeight, iHeigth) {
                if (aHeight < iHeigth) {
                    $('#scroll').hide();
                }
            }
        },
        error: function () {
            parent.toast("系统繁忙...");
        }
    });
}

//--------------------事故模拟-start---------------------------------------------------
/**
 * 初始化事故模拟地图各覆盖物加载
 * @param paraObj
 * @returns
 */
function initEvnAnaMap(paraObj) {
    //加载事故模拟结果覆盖物----------------------------------------------------------------
    //清除历史点位覆盖物和防护目标点位并定义所有事故模拟结果覆盖物
    if (window.allEvnAnaPolyArr && 0 < window.allEvnAnaPolyArr.length) {
        _.map(window.allEvnAnaPolyArr, function (tmpPolyObj, index) {
            window.map.removeOverlay(tmpPolyObj.poly);
        });
    }
    window.allEvnAnaPolyArr = [];
    var curLowPoly = null,
        curMidPoly = null,
        curHighPoly = null;

    //加载低浓度覆盖物
    if (paraObj.low.pts && 0 < paraObj.low.pts.length) {
        var lowPtArr = [];
        _.map(paraObj.low.pts, function (lowPt, i) {
            lowPtArr.push(new BMap.Point(lowPt.lng, lowPt.lat));
        });
//		alert(lowPtArr);
        var lowPoly = new BMap.Polygon(lowPtArr, {"fillColor": "#16e787"});
//		var lowPoly = new BMap.Polygon(lowPtArr, {"fillColor": paraObj.low.color.replace(/99/, "#")});
//		alert(window.map);
        curLowPoly = lowPoly;
        window.map.addOverlay(lowPoly);
    }

    //加载中等浓度覆盖物
    if (paraObj.mid.pts && 0 < paraObj.mid.pts.length) {
        var midPtArr = [];
        _.map(paraObj.mid.pts, function (midPt, i) {
            midPtArr.push(new BMap.Point(midPt.lng, midPt.lat));
        });

        var midPoly = new BMap.Polygon(midPtArr, {"fillColor": "#f0ff4a"});
//		var midPoly = new BMap.Polygon(midPtArr, {"fillColor": paraObj.mid.color.replace(/99/, "#")});
        curMidPoly = midPoly;
        window.map.addOverlay(midPoly);
    }

    //加载高浓度覆盖物
    if (paraObj.high.pts && 0 < paraObj.high.pts.length) {
        var highPtArr = [];
        _.map(paraObj.high.pts, function (highPt, i) {
            highPtArr.push(new BMap.Point(highPt.lng, highPt.lat));
        });

        var highPoly = new BMap.Polygon(highPtArr, {"fillColor": "#fc5b6a"});
//		var highPoly = new BMap.Polygon(highPtArr, {"fillColor": paraObj.high.color.replace(/99/, "#")});
        curHighPoly = highPoly;
        window.map.addOverlay(highPoly);
    }

    //按照高、中、低浓度顺序添加覆盖物
    if (curHighPoly) {
        window.allEvnAnaPolyArr.push({
            "type": "high",
            "poly": curHighPoly
        });
        curHighPoly = null;
    }

    if (curMidPoly) {
        window.allEvnAnaPolyArr.push({
            "type": "mid",
            "poly": curMidPoly
        });
        curMidPoly = null;
    }

    if (curLowPoly) {
        window.allEvnAnaPolyArr.push({
            "type": "low",
            "poly": curLowPoly
        });
        curLowPoly = null;
    }


    //加载所有在覆盖物内的保护场所点位------------------------------------------------------------
    //定义不同污染范围内的防护场所点位id数组
    var lowAreaPtIdArr = [],
        midAreaPtIdArr = [],
        highAreaPtIdArr = [];

    if (paraObj.allEmsSucPlaces && 0 < paraObj.allEmsSucPlaces.length) {
        //定义存储所有防护场所点位Map集合类
        if (window.evnAnaPtDic) {
            if (0 < window.evnAnaPtDic.size()) {
                //清空地图上所有历史防护目标点位覆盖物
                _.map(window.evnAnaPtDic.values(), function (tmpPtMap, index) {
                	
                    window.map.removeOverlay(tmpPtMap.marker);
                });
                window.evnAnaPtDic.clear();
            }
        } else {
            window.evnAnaPtDic = new MapUtil();
        }

        //判断所有防护场所是否有点位在覆盖物内
        var hasPtInPoly = false;

        //遍历所有防护场所
        _.map(paraObj.allEmsSucPlaces, function (tmpPlace, index) {
            if (0 < allEvnAnaPolyArr.length) {
//				alert(tmpPlace.NAME);
                var tmpPt = new BMap.Point(tmpPlace.LONGITUDE, tmpPlace.LATITUDE),
                    isInPoly = false;
                for (var i = 0; i < window.allEvnAnaPolyArr.length; ++i) {
                    //判断当前防护场所是否在覆盖物范围内
                    if (BMapLib.GeoUtils.isPointInPolygon(tmpPt, window.allEvnAnaPolyArr[i].poly)) {
                        if ("low" == window.allEvnAnaPolyArr[i].type) {
                            lowAreaPtIdArr.push(tmpPlace.PLACEID);
                        } else if ("mid" == window.allEvnAnaPolyArr[i].type) {
                            midAreaPtIdArr.push(tmpPlace.PLACEID);
                        } else if ("high" == window.allEvnAnaPolyArr[i].type) {
                            highAreaPtIdArr.push(tmpPlace.PLACEID);
                        }

                        var tmpMarkerOpt = {};
                    	tmpMarkerOpt.title = tmpPlace.NAME;
                    	console.log(tmpPlace.TYPEID);
                    	if(tmpPlace.TYPEID == "1"){                    		
                    		tmpMarkerOpt.icon = new BMap.Icon(BASE_URL + "images/map/icon/icon_fhmb.png", new BMap.Size(26, 32), // 视窗大小
	        	                　　　　　　　　{
	        	          　　　　　　　　　　imageSize: new BMap.Size(26,32)// 引用图片实际大小
	        	          　　　　　　　　});//标注防护目标图标
                    	} else {
                    		tmpMarkerOpt.icon = new BMap.Icon(BASE_URL + "images/map/icon/icon_wxy.png", new BMap.Size(26, 32), // 视窗大小
	        	                　　　　　　　　{
	        	          　　　　　　　　　　imageSize: new BMap.Size(26,32)// 引用图片实际大小
	        	          　　　　　　　　});//标注危险源图标
                    	}
//                    	var tmpPt = new BMap.Point(tmpPlace.longitude, tmpPlace.latitude);
                        var tmpMarker = new BMap.Marker(tmpPt, tmpMarkerOpt);
//                        var tmpMarker = new BMap.Marker(tmpPt, {"title": tmpPlace.NAME});

                        //允许清除覆盖物
                        tmpMarker.enableMassClear();

                        //定义点位弹窗内容
                        /*var tmpWindow = new BMap.InfoWindow("", {
                            width: 420,
                            height: 260,
                            title: "",
                            enableMessage: false
                        });*/

                        //清除企业物资等map工具类中的历史信息
                        if (window.evnAnaPtDic.containsKey(tmpPlace.PLACEID)) {
                            window.evnAnaPtDic.remove(tmpPlace.PLACEID);
                        }

                        //将点位存储至map集合工具类中
                        window.evnAnaPtDic.put(tmpPlace.PLACEID, {
                            "data": tmpPlace,
                            "marker": tmpMarker,
                            "click": function () {
                                window.map.panTo(tmpPt);
                                //定义点位信息窗口回调事件
//								tmpWindow.addEventListener("open", function(){});
//							   	tmpWindow.addEventListener("close", function(){});
//								tmpWindow.addEventListener("clickclose", function(){});
//								window.map.openInfoWindow(tmpWindow, tmpPt);
                            }
                        });

                        //定义点位点击触发事件
                        tmpMarker.addEventListener("click", function () {
                        	console.log(tmpPlace);
//                            window.evnAnaPtDic.get(tmpPlace.PLACEID).click();
                        	showFHInfo(this,tmpPlace,'sgmn');
                        });

                        //将点位添加至地图
                        window.map.addOverlay(tmpMarker);
                        isInPoly = true;
                        hasPtInPoly = true;
                        break;
                    }
                }

                //如果当前遍历点位不在任何覆盖物内，置空之前初始化的point对象
                if (!isInPoly) {
                    tmpPt = null;
                }
            }
        });

        //当所有防护场所点位都不在覆盖物内时，置空之前点位Map集合类对象
        if (!hasPtInPoly) {
            window.evnAnaPtDic = null;
        }
    }

    //默认当前模拟中心点居中---------------------------------------
    window.map.centerAndZoom(window.evnPt, 16);

    //返回不同污染范围内的防护场所点位id数组
    return {
        "low": lowAreaPtIdArr,
        "mid": midAreaPtIdArr,
        "high": highAreaPtIdArr
    };
}

/**
 * 激活居中事故模拟中防护资源具体点位
 * @param ptId
 */
function popEvnAnaPt(ptId) {
    //默认居中显示所选中的防护资源点位
    window.map.centerAndZoom(
        window.evnAnaPtDic.get(ptId).marker.getPosition(), 16);
}

/**
 * 查询当前事故下是否曾经进行过事故模拟
 * @param evnId 当前事故id
 */
function isEverEvnAna(evnId) {
    var everEvnAnaFlag = false;
    $.ajax({
        type: "post",
        url: BASE_URL + "ems/emssucsimulation/loadEvnAnaData",
        data: {"curEvnId": evnId, "getEvnAnaCnt": 1},
        async: false,
        success: function (retData) {
            if ("1" == retData.isEverEvnAna) {
                everEvnAnaFlag = true;
            }
        }
    });
    return everEvnAnaFlag;
}


/**
 * 查询当前事故下是否曾经进行过资源评估
 * @param evnId 当前事故id
 */
function isEverResource(evnId) {
    var everResourceFlag = false;
    $.ajax({
        type: "post",
        url: BASE_URL + "ems/emssucresourceevaluation/getLatestsucData",
        data: {"eventid": evnId, "getResourceCnt": 1},
        async: false,
        success: function (retData) {
            if ("1" == retData.isEverResource) {
                everResourceFlag = true;
            }
        }
    });
    return everResourceFlag;
}

/**
 * 查询当前事故下是否曾经进行过综合预测
 * @param evnId 当前事故id
 */
function isEverForecast(evnId) {
    var everForecastFlag = false;
    $.ajax({
        type: "post",
        url: BASE_URL + "ems/emssucigrforecast/loadbyeventid",
        data: {"eventid": evnId, "getForecastCnt": 1},
        async: false,
        success: function (retData) {
            if ("1" == retData.isEverForecast) {
                everForecastFlag = true;
            }
        }
    });
    return everForecastFlag;
}

/**
 * 加载当前事故下最新的事故模拟记录覆盖物或指定事故模拟id的覆盖物
 * @param curEvnId
 * @param tgtEvnAnaId
 */
function addEvnAnaGisOverLays(curEvnId, tgtEvnAnaId, isGetData) {
    var param = {},
        curEvnAnaId = null;
    //加载当前事故下最新的事故模拟记录覆盖物
    if (curEvnId) {
        param.curEvnId = curEvnId;
    }

    //加载当前事故下指定事故模拟id的覆盖物
    if (tgtEvnAnaId) {
        param.tgtEvnAnaId = tgtEvnAnaId;
    }

    $.ajax({
        type: "post",
        url: BASE_URL + "ems/emssucsimulation/loadEvnAnaData",
        data: param,
        async: false,
        success: function (retData) {
            if (retData) {
                if (!isGetData) {
                    //地图加载污染区覆盖物
                    if ("" != retData.lowPts &&
                        "" != retData.midPts &&
                        "" != retData.highPts) {
                        //清除历史点位覆盖物和防护目标点位并定义所有事故模拟结果覆盖物
                        if (window.allEvnAnaPolyArr && 0 < window.allEvnAnaPolyArr.length) {
                            //当事故模拟GIS处于打开状态时
                            _.map(window.allEvnAnaPolyArr, function (tmpPolyObj, index) {
                                window.map.removeOverlay(tmpPolyObj.poly);
                            });
                            window.allEvnAnaPolyArr = null;
                        }

                        addEvnAnaMapPolys(retData);
                    }

                    //地图加载防护场所点位覆盖物
                    if (0 < retData.sucPlaceList.length) {
                        if (window.evnAnaPtDic && 0 < window.evnAnaPtDic.size()) {
//						//清空地图上所有历史防护目标点位覆盖物
                            _.map(window.evnAnaPtDic.values(), function (tmpPtMap, index) {
                                window.map.removeOverlay(tmpPtMap.marker);
                            });
                            window.evnAnaPtDic = null;
                        }

                        addEvnAnaMapSncPla(retData);
                    }

                    //事故发生地居中
                    window.map.centerAndZoom(window.evnPt, 16);
                }
                curEvnAnaId = retData.curEvnAnaId;
            }
        }
    });
    return curEvnAnaId;
}

/**
 * 地图加载上一次最新的事故模拟覆盖物(暂时废弃)
 * @param evnId
 */
function loadLastEvnAnaOverLay(evnId) {
    $.ajax({
        type: "post",
        url: BASE_URL + "ems/emssucsimulation/loadLastEvnAnaData",
        data: {
            "curEvnId": evnId
        },
        success: function (retData) {
            if (retData) {
//				alert(JSON.stringify(retData));
                //是否含有污染物覆盖物
                var isHasPollPoly = false;

                //地图加载污染区覆盖物
                if ("" != retData.lowPts &&
                    "" != retData.midPts &&
                    "" != retData.highPts) {
                    //加载事故模拟结果覆盖物----------------------------------------------------------------
                    //清除历史点位覆盖物和防护目标点位并定义所有事故模拟结果覆盖物
                    if (window.allEvnAnaPolyArr && 0 < window.allEvnAnaPolyArr.length) {
//						_.map(window.allEvnAnaPolyArr, function(tmpPolyObj, index) {
//							window.map.removeOverlay(tmpPolyObj.poly);
//						});
                    } else {
                        window.allEvnAnaPolyArr = [];
                        var curLowPoly = null,
                            curMidPoly = null,
                            curHighPoly = null;

                        //加载低浓度覆盖物
                        if (retData.lowPts && 0 < retData.lowPts.length) {
                            var lowPtArr = [];
                            _.map(retData.lowPts, function (lowPt, i) {
                                lowPtArr.push(new BMap.Point(lowPt.lng, lowPt.lat));
                            });
                            var lowPoly = new BMap.Polygon(lowPtArr, {"fillColor": "#16e787"});
                            curLowPoly = lowPoly;
                            window.map.addOverlay(lowPoly);
                        }

                        //加载中等浓度覆盖物
                        if (retData.midPts && 0 < retData.midPts.length) {
                            var midPtArr = [];
                            _.map(retData.midPts, function (midPt, i) {
                                midPtArr.push(new BMap.Point(midPt.lng, midPt.lat));
                            });

                            var midPoly = new BMap.Polygon(midPtArr, {"fillColor": "#f0ff4a"});
                            curMidPoly = midPoly;
                            window.map.addOverlay(midPoly);
                        }

                        //加载高浓度覆盖物
                        if (retData.highPts && 0 < retData.highPts.length) {
                            var highPtArr = [];
                            _.map(retData.highPts, function (highPt, i) {
                                highPtArr.push(new BMap.Point(highPt.lng, highPt.lat));
                            });

                            var highPoly = new BMap.Polygon(highPtArr, {"fillColor": "#fc5b6a"});
                            curHighPoly = highPoly;
                            window.map.addOverlay(highPoly);
                        }

                        //按照高、中、低浓度顺序添加覆盖物
                        if (curHighPoly) {
                            window.allEvnAnaPolyArr.push({
                                "type": "high",
                                "poly": curHighPoly
                            });
                            curHighPoly = null;
                        }

                        if (curMidPoly) {
                            window.allEvnAnaPolyArr.push({
                                "type": "mid",
                                "poly": curMidPoly
                            });
                            curMidPoly = null;
                        }

                        if (curLowPoly) {
                            window.allEvnAnaPolyArr.push({
                                "type": "low",
                                "poly": curLowPoly
                            });
                            curLowPoly = null;
                        }
                    }

                    isHasPollPoly = true;
                } else {
                    parent.toast("请先进行事故模拟!");
                }

                //地图加载防护场所点位覆盖物
                if (0 < retData.sucPlaceList.length) {
                    //定义存储所有防护场所点位Map集合类
                    if (window.evnAnaPtDic && 0 < window.evnAnaPtDic.size()) {
//							//清空地图上所有历史防护目标点位覆盖物
//							_.map(window.evnAnaPtDic.values(), function(tmpPtMap, index) {
//								window.map.removeOverlay(tmpPtMap.marker);
//							});
//							window.evnAnaPtDic.clear();
                    } else {
                        window.evnAnaPtDic = new MapUtil();
                        _.map(retData.sucPlaceList, function (tmpPlace, index) {
                            var tmpPt = new BMap.Point(tmpPlace.longitude, tmpPlace.latitude),
                                tmpMarker = new BMap.Marker(tmpPt, {"title": tmpPlace.name});

                            //允许清除覆盖物
                            tmpMarker.enableMassClear();

                            //定义点位弹窗内容
                            var tmpWindow = new BMap.InfoWindow("", {
                                width: 420,
                                height: 260,
                                title: "",
                                enableMessage: false
                            });

                            //清除企业物资等map工具类中的历史信息
                            if (window.evnAnaPtDic.containsKey(tmpPlace.placeid)) {
                                window.evnAnaPtDic.remove(tmpPlace.placeid);
                            }

                            //将点位存储至map集合工具类中
                            window.evnAnaPtDic.put(tmpPlace.placeid, {
                                "data": tmpPlace,
                                "marker": tmpMarker,
                                "click": function () {
                                    window.map.panTo(tmpPt);
                                    //定义点位信息窗口回调事件
//									tmpWindow.addEventListener("open", function(){});
//								   	tmpWindow.addEventListener("close", function(){});
//									tmpWindow.addEventListener("clickclose", function(){});
//									window.map.openInfoWindow(tmpWindow, tmpPt);
                                }
                            });

                            //定义点位点击触发事件
                            tmpMarker.addEventListener("click", function () {
                                window.evnAnaPtDic.get(tmpPlace.placeid).click();
                            });

                            //将点位添加至地图
                            window.map.addOverlay(tmpMarker);
                        });
                    }
                } else {
                    if (!isHasPollPoly) {
                        parent.toast("请先进行事故模拟!");
                    }
                }

                //事故发生地居中
                window.map.centerAndZoom(window.evnPt, 16);
            }
        }
    });
}

/**
 * 根据事故模拟查询结果地图加载相应覆盖物
 * @param retData
 * @returns
 */
function addEvnAnaMapPolys(retData) {
//	alert(JSON.stringify(retData));
    //加载poly
    window.allEvnAnaPolyArr = [];
    var curLowPoly = null,
        curMidPoly = null,
        curHighPoly = null;

    //加载低浓度覆盖物
    if (retData.lowPts && 0 < retData.lowPts.length) {
        var lowPtArr = [];
        _.map(retData.lowPts, function (lowPt, i) {
            lowPtArr.push(new BMap.Point(lowPt.lng, lowPt.lat));
        });
        var lowPoly = new BMap.Polygon(lowPtArr, {"fillColor": "#16e787"});
        curLowPoly = lowPoly;
        window.map.addOverlay(lowPoly);
    }

    //加载中等浓度覆盖物
    if (retData.midPts && 0 < retData.midPts.length) {
        var midPtArr = [];
        _.map(retData.midPts, function (midPt, i) {
            midPtArr.push(new BMap.Point(midPt.lng, midPt.lat));
        });

        var midPoly = new BMap.Polygon(midPtArr, {"fillColor": "#f0ff4a"});
        curMidPoly = midPoly;
        window.map.addOverlay(midPoly);
    }

    //加载高浓度覆盖物
    if (retData.highPts && 0 < retData.highPts.length) {
        var highPtArr = [];
        _.map(retData.highPts, function (highPt, i) {
            highPtArr.push(new BMap.Point(highPt.lng, highPt.lat));
        });

        var highPoly = new BMap.Polygon(highPtArr, {"fillColor": "#fc5b6a"});
        curHighPoly = highPoly;
        window.map.addOverlay(highPoly);
    }

    //按照高、中、低浓度顺序添加覆盖物
    if (curHighPoly) {
        window.allEvnAnaPolyArr.push({
            "type": "high",
            "poly": curHighPoly
        });
        curHighPoly = null;
    }

    if (curMidPoly) {
        window.allEvnAnaPolyArr.push({
            "type": "mid",
            "poly": curMidPoly
        });
        curMidPoly = null;
    }

    if (curLowPoly) {
        window.allEvnAnaPolyArr.push({
            "type": "low",
            "poly": curLowPoly
        });
        curLowPoly = null;
    }
}

/**
 * 根据事故模拟查询结果地图加载相应的防护目标
 * @param retData
 * @returns
 */
function addEvnAnaMapSncPla(retData) {
    //定义存储所有防护场所点位Map集合类
    window.evnAnaPtDic = new MapUtil();
    _.map(retData.sucPlaceList, function (tmpPlace, index) {
    	console.log(tmpPlace);
    	var tmpMarkerOpt = {};
    	tmpMarkerOpt.title = tmpPlace.name;
    	if(tmpPlace.typeid == "1"){                    		
    		tmpMarkerOpt.icon = new BMap.Icon(BASE_URL + "images/map/icon/icon_fhmb.png", new BMap.Size(26, 32), // 视窗大小
                　　　　　　　　{
          　　　　　　　　　　imageSize: new BMap.Size(26,32)// 引用图片实际大小
          　　　　　　　　});//标注防护目标图标
    	} else {
    		tmpMarkerOpt.icon = new BMap.Icon(BASE_URL + "images/map/icon/icon_wxy.png", new BMap.Size(26, 32), // 视窗大小
                　　　　　　　　{
          　　　　　　　　　　imageSize: new BMap.Size(26,32)// 引用图片实际大小
          　　　　　　　　});//标注危险源图标
    	}
//    	tmpMarkerOpt.icon = new BMap.Icon(BASE_URL + "images/map/icon/icon_fhmb.png", new BMap.Size(26, 32), // 视窗大小
//        　　　　　　　　{
//  　　　　　　　　　　imageSize: new BMap.Size(26,32)// 引用图片实际大小
//  　　　　　　　　});//标注图标
        var tmpPt = new BMap.Point(tmpPlace.longitude, tmpPlace.latitude),
        tmpMarker = new BMap.Marker(tmpPt, tmpMarkerOpt);

        //允许清除覆盖物
        tmpMarker.enableMassClear();

        //定义点位弹窗内容
        var tmpWindow = new BMap.InfoWindow("", {
            width: 420,
            height: 260,
            title: "",
            enableMessage: false
        });

        //清除企业物资等map工具类中的历史信息
        if (window.evnAnaPtDic.containsKey(tmpPlace.placeid)) {
            window.evnAnaPtDic.remove(tmpPlace.placeid);
        }

        //将点位存储至map集合工具类中
        window.evnAnaPtDic.put(tmpPlace.placeid, {
            "data": tmpPlace,
            "marker": tmpMarker,
            "click": function () {
                window.map.panTo(tmpPt);
                //定义点位信息窗口回调事件
//				tmpWindow.addEventListener("open", function(){});
//			   	tmpWindow.addEventListener("close", function(){});
//				tmpWindow.addEventListener("clickclose", function(){});
//				window.map.openInfoWindow(tmpWindow, tmpPt);
            }
        });

        //定义点位点击触发事件
        tmpMarker.addEventListener("click", function () {
//            window.evnAnaPtDic.get(tmpPlace.placeid).click();
        	showFHInfo(this,tmpPlace,'znfa');
        });

        //将点位添加至地图
        window.map.addOverlay(tmpMarker);
    });
}
//--------------------事故模拟-end--------------------------------------------------


function initForecast(eventid) {
    //查询该事件是否进行过事故模拟，如果没有模拟过，则不需要弹出预测模块，并给予提示
    $.ajax({
        type: "post",
        url: BASE_URL + "ems/emssucigrforecast/simulationCheck",
        data: {
            "eventid": eventid
        },
        success: function (data) {
            if (data.data) {
                if (data.num) {
                    //打开综合预测路径地址
                    // 52%  55%
                    window.zhycWinIndex = openEmsResWin(BASE_URL + "views/module/ems/map/forecast/forecastingIndex.html?eventid=" + eventid,
                        "综合预测", "625px", "333px", "zhyc", function () {
                            //清除综合预测的覆盖物
                            if (window.allDriveRouteArr) {
                                if (0 < window.allDriveRouteArr.length) {
                                    _.map(window.allDriveRouteArr, function (tmpPolyObj, index) {
                                        window.map.removeOverlay(tmpPolyObj);
                                    });
                                }
                                window.allDriveRouteArr = [];
                            }
                            //清除事故模拟相关的覆盖物
                            if (window.allEvnAnaPolyArr) {
                                if (0 < window.allEvnAnaPolyArr.length) {
                                    _.map(window.allEvnAnaPolyArr, function (tmpPolyObj, index) {
                                        window.map.removeOverlay(tmpPolyObj.poly);
                                    });
                                }
                                window.allEvnAnaPolyArr = [];
                            }
                            //清除事故模拟相关的防护目标点位
                            if (window.evnAnaPtDic) {
                                //清空地图上所有历史防护目标点位覆盖物
                                if (0 < window.evnAnaPtDic.size()) {
                                    _.map(window.evnAnaPtDic.values(), function (tmpPtMap, index) {
                                        window.map.removeOverlay(tmpPtMap.marker);
                                    });
                                }
                                window.evnAnaPtDic = null;
                            }

                            if (window.zhycWinIndex) {
                                window.zhycWinIndex = null;
                            }
                            //修改底部菜单样式
                            $("#zhycBtn").removeClass("visited2");
                        });
                } else {
                    parent.confirm("要进行综合预测，请先进行资源评估！", function () {
                        if (!window.zypgWinIndex) {
                            $("#zypgBtn").click();
//							//打开资源评估路径地址
//							openEmsResWin(BASE_URL + "views/module/ems/map/resource/resourceInfoList.html?eventid=" + $("#eventid").val(),
//									"资源评估", "45%", "50%", "zypg");
                        }
                    });
                }
            } else {
                parent.confirm("要进行综合预测，请先进行模型分析！", function () {
                    if (!window.sgmnWinIndex) {
                        $("#sgmnBtn").click();
                    }
                    //打开事故模拟路径地址
//	    				openEmsResWin(BASE_URL + "views/module/ems/map/evnanalog/evnAnalogIndex.html?eventid=" + $("#eventid").val(),
//	    						  "事故模拟", "45%", "50%", "sgmn");
                });

            }
        }
    });
}
/**
 * 综合预测标记点位
 * @param name
 * @param lng
 * @param lat
 */
function simpleMarker(name, lng, lat) {
//	window.allDriveRouteArr = [];
	var tmpMarkerOpt = {};
	tmpMarkerOpt.title = name;
	tmpMarkerOpt.icon = new BMap.Icon(BASE_URL + "images/map/icon/icon_luzhang.png", new BMap.Size(26, 32), // 视窗大小
    　　　　　　　　{
　　　　　　　　imageSize: new BMap.Size(26,32)// 引用图片实际大小
　　　　　　});//标注图标
    var simpleMarker = new BMap.Marker(new BMap.Point(lng, lat), tmpMarkerOpt);
    window.map.addOverlay(simpleMarker);
    window.allDriveRouteArr.push(simpleMarker);
}

/**
 * 绘制警戒区
 * @returns {BMapLib.DrawingManager}
 */
function drawArea() {

    var styleOptions = {
        strokeColor: "red",    //边线颜色。
        fillColor: "red",      //填充颜色。当参数为空时，圆形将没有填充效果。
        strokeWeight: 1,       //边线的宽度，以像素为单位。
        strokeOpacity: 0.8,    //边线透明度，取值范围0 - 1。
        fillOpacity: 0.6,      //填充的透明度，取值范围0 - 1。
        strokeStyle: 'solid' //边线的样式，solid或dashed。
    }
    //实例化鼠标绘制工具
    var drawingManager = new BMapLib.DrawingManager(window.map, {
        isOpen: true, //是否开启绘制模式
        polygonOptions: styleOptions, //多边形的样式
    });
    drawingManager.setDrawingMode(BMAP_DRAWING_POLYGON);

    return drawingManager
}

/**
 *
 * @param data 加载的路线坐标集合
 */
function initDriveRoute(data, type) {
//	window.map.clearOverlays();
    //清除综合预测的覆盖物
    if (window.allDriveRouteArr) {
        if (0 < window.allDriveRouteArr.length) {
            _.map(window.allDriveRouteArr, function (tmpPolyObj, index) {
                window.map.removeOverlay(tmpPolyObj);
            });
        }
//		window.allDriveRouteArr = null;
    }
    _.map(data, function (curdata, i) {
        var driving = new BMap.DrivingRoute(window.map,
            {
                onPolylinesSet: function (routes) {
                    _.map(routes, function (route) {
                        //存储生成的路线覆盖物
                        var curDvrPolyline = route.getPolyline();
                        //覆盖物存储到数组中
                        window.allDriveRouteArr.push(curDvrPolyline);
                        if (type == "jylx") {
                            curDvrPolyline.setStrokeColor("red");
                        } else if (type == "cllx") {
                            curDvrPolyline.setStrokeColor("green");
                        }

                    });
                },
                onMarkersSet: function (pois) {
//						_.map(pois, function(poi) {
                    /*//设置图标样式
                     var icon = new BMap.Icon("http://lbsyun.baidu.com/jsdemo/img/fox.gif", new BMap.Size(300,157));
                     //存储生成的路线始终点的marker
                     poi.marker.setIcon(icon);*/
                    //覆盖物存储到数组中
                    _.map(pois, function (poi) {
                        window.allDriveRouteArr.push(poi.marker);
                        if (type == "jylx") {
                            poi.marker.setTitle(curdata.TEAMNAME + "的救援路线");
                        } else if (type == "cllx") {
                            poi.marker.setTitle(curdata.SHELTERNAME + "的撤离路线");
                        }


                    });

                },
                renderOptions: {map: window.map, panel: "r-result", autoViewport: true}
            }
        );
        //判断是救援路线还是撤离路线，出发地是不同的
        if (type == "jylx") {
            driving.search(new BMap.Point(curdata.LONGITUDE, curdata.LATITUDE), new BMap.Point($("#eventlongitude").val(), $("#eventlatitude").val()));
        }
        if (type == "cllx") {
            driving.search(new BMap.Point($("#eventlongitude").val(), $("#eventlatitude").val()), new BMap.Point(curdata.LONGITUDE, curdata.LATITUDE));
        }

    });


}

/**
 *
 * @param data 加载的路线坐标集合
 */
function initHistoryDriveRoute(data, type) {
//	window.map.clearOverlays();
    //清除综合预测的覆盖物
    if (window.allDriveRouteArr) {
        if (0 < window.allDriveRouteArr.length) {
            _.map(window.allDriveRouteArr, function (tmpPolyObj, index) {
                window.map.removeOverlay(tmpPolyObj);
            });
        }
//		window.allDriveRouteArr = null;
    }
    _.map(data, function (curdata, i) {
        var driving = new BMap.DrivingRoute(window.map,
            {
                onPolylinesSet: function (routes) {
                    _.map(routes, function (route) {
                        //存储生成的路线覆盖物
                        var curDvrPolyline = route.getPolyline();
                        //覆盖物存储到数组中
                        window.allDriveRouteArr.push(curDvrPolyline);
                        if (type == "jylx") {
                            curDvrPolyline.setStrokeColor("red");
                        } else if (type == "cllx") {
                            curDvrPolyline.setStrokeColor("green");
                        }

                    });
                },
                onMarkersSet: function (pois) {
                    //覆盖物存储到数组中
                    _.map(pois, function (poi) {
                        window.allDriveRouteArr.push(poi.marker);
                        if (type == "jylx") {
                            poi.marker.setTitle(curdata.ROUTENAME);
                        } else if (type == "cllx") {
                            poi.marker.setTitle(curdata.ROUTENAME);
                        }
                    });
                },
                renderOptions: {map: window.map, panel: "r-result", autoViewport: true}
            }
        );
        driving.search(new BMap.Point(curdata.STARTLON, curdata.STARTLAT), new BMap.Point(curdata.ENDLON, curdata.ENDLAT));
    });
}

/**
 *
 * @param data 加载的路线坐标集合
 */
function initHistorySingleRoute(data, type) {
//	window.map.clearOverlays();
    //清除综合预测的覆盖物
//	if (window.allDriveRouteArr) {
//		if (0 < window.allDriveRouteArr.length) {
//			_.map(window.allDriveRouteArr, function(tmpPolyObj, index) {
//				window.map.removeOverlay(tmpPolyObj);
//			});
//		}
//		window.allDriveRouteArr = null;
//	}
    //清除事故模拟相关的覆盖物
//	if (window.allEvnAnaPolyArr) {
//		if (0 < window.allEvnAnaPolyArr.length) {
//			_.map(window.allEvnAnaPolyArr, function(tmpPolyObj, index) {
//				window.map.removeOverlay(tmpPolyObj.poly);
//			});
//		}
//		window.allEvnAnaPolyArr = null;
//	}
    var driving = new BMap.DrivingRoute(window.map, {
        onPolylinesSet: function (routes) {
            _.map(routes, function (route) {
                //存储生成的路线覆盖物
                var curDvrPolyline = route.getPolyline();
                //覆盖物存储到数组中
                window.allDriveRouteArr.push(curDvrPolyline);
                if (type == "jylx") {
                    curDvrPolyline.setStrokeColor("red");
                } else if (type == "cllx") {
                    curDvrPolyline.setStrokeColor("green");
                }

            });
        },
        onMarkersSet: function (pois) {
            _.map(pois, function (poi) {
                window.allDriveRouteArr.push(poi.marker);
                if (type == "jylx") {
                    poi.marker.setTitle(data.ROUTENAME + "起点");
                    poi.marker.setIcon(BASE_URL + "images/gis/beginred.png");
                } else if (type == "cllx") {
                    poi.marker.setTitle(data.ROUTENAME + "终点");
                    poi.marker.setIcon(BASE_URL + "images/gis/endgreen.png");
                }
            });
        },
        renderOptions: {map: window.map, panel: "r-result", autoViewport: true}
    });
    driving.search(new BMap.Point(data.STARTLON, data.STARTLAT), new BMap.Point(data.ENDLON, data.ENDLAT));
}

/**
 *
 * @param data 加载单个路线坐标集合
 */
function initSingleDriveRoute(data, type) {
//	window.map.clearOverlays();
    var driving = new BMap.DrivingRoute(window.map, {
            onPolylinesSet: function (routes) {
                _.map(routes, function (route) {
                    //存储生成的路线覆盖物
                    var curDvrPolyline = route.getPolyline();
                    //覆盖物存储到数组中
                    window.allDriveRouteArr.push(curDvrPolyline);
                    if (type == "jylx") {
                        curDvrPolyline.setStrokeColor("red");
                    } else if (type == "cllx") {
                        curDvrPolyline.setStrokeColor("green");
                    }

                });
            },
            onMarkersSet: function (pois) {
                _.map(pois, function (poi) {
                    window.allDriveRouteArr.push(poi.marker);
                    if (type == "jylx") {
                        poi.marker.setTitle(data.TEAMNAME + "的救援路线起点");
                        poi.marker.setIcon(BASE_URL + "images/gis/beginred.png");
                    } else if (type == "cllx") {
                        poi.marker.setTitle(data.SHELTERNAME + "的撤离路线终点");
                        poi.marker.setIcon(BASE_URL + "images/gis/endgreen.png");
                    }
                });
            },
            renderOptions: {map: window.map, panel: "r-result", autoViewport: true}
        }
    );
    //判断是救援路线还是撤离路线，出发地是不同的
    if (type == "jylx") {
        driving.search(new BMap.Point(data.LONGITUDE, data.LATITUDE), new BMap.Point($("#eventlongitude").val(), $("#eventlatitude").val()));
    }
    if (type == "cllx") {
        driving.search(new BMap.Point($("#eventlongitude").val(), $("#eventlatitude").val()), new BMap.Point(data.LONGITUDE, data.LATITUDE));
    }

}

//绘制警戒区域覆盖物
function loadWarnArea(array) {
    var jsonObj = JSON.parse(array);
    var jsonStr1 = JSON.stringify(jsonObj);
    var jsonArr = [];
    var points = new Array();
    for (var i = 0; i < jsonObj.length; i++) {
        jsonArr[i] = jsonObj[i];
        var point = new BMap.Point(jsonArr[i].lng, jsonArr[i].lat);
        points.push(point);

    }
    var styleOptions = {
        strokeColor: "red",    //边线颜色。
        fillColor: "red",      //填充颜色。当参数为空时，圆形将没有填充效果。
        strokeWeight: 1,       //边线的宽度，以像素为单位。
        strokeOpacity: 0.8,    //边线透明度，取值范围0 - 1。
        fillOpacity: 0.6,      //填充的透明度，取值范围0 - 1。
        strokeStyle: 'solid' //边线的样式，solid或dashed。
    }
    var p = new BMap.Polygon(points, styleOptions);
    window.map.addOverlay(p);
    window.allDriveRouteArr.push(p);
}

/**
 * 获取参数
 * @param name
 * @returns
 */
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)return unescape(r[2]);
    return null;
}

/**
 * 初始化资源信息
 */
function initResourceInfo() {
    //获取资源数据，全部加载在地图上
    $.ajax({
        type: "post",
        url: BASE_URL + "ems/resourcecollect/reslist",
        data: {},
        success: function (data) {
            initResourceTable(data);
        },
        error: function () {
            parent.toast("系统繁忙...");
        }
    });
}

//加载资源表格数据
function initResourceTable(data) {
    if (data) {
        //初始化存储所有应急资源点位覆盖物工具类
        window.allEmsResPtDic = new MapUtil();
        scroll("resInfo","resArea","resScroll","bncsGrid");
        scroll("teanInfo","teamArea","teamScroll","jydwGrid");
        scroll("healthInfo","healthArea","healthScroll","ylzyGrid");
        scroll("deposInfo","deposArea","deposScroll","wzzbGrid");        
        //避难场所
        if (data.bncs.length > 0) {
            var csinfo = "";
            _.map(data.bncs, function (bncsinfo) {
                csinfo += "<tr data-id='" + bncsinfo.SHELTERID + "'  onclick='makePoint(" + JSON.stringify(bncsinfo.SHELTERID) + ")'><td title='"+bncsinfo.SHELTERNAME+"'>" + bncsinfo.SHELTERNAME + "</td><td>" + bncsinfo.RESOURCETYPENAME + "</td></tr>";
                //****************加载点位
                var tmpPt = new BMap.Point(bncsinfo.LONGITUDE, bncsinfo.LATITUDE);

                //定义marker的图标    --待续-------------
                var tmpMarkerOpt = {};
                tmpMarkerOpt.title = bncsinfo.SHELTERNAME;
                tmpMarkerOpt.icon = new BMap.Icon(BASE_URL + "images/map/icon/marker_bncs.png", new BMap.Size(26, 32), // 视窗大小
	                　　　　　　　　{
	          　　　　　　　　　　imageSize: new BMap.Size(26,32)// 引用图片实际大小
	          　　　　　　　　});//标注图标
                var tmpMarker = new BMap.Marker(tmpPt, tmpMarkerOpt);

                //允许清除覆盖物
//                tmpMarker.enableMassClear();

                var content = "<div class='infoBoxContent'><font size='3'><strong>"+bncsinfo.SHELTERNAME+"</strong></font><hr style='border:none;border-top: 1px solid #555555;margin-bottom:2px;margin-top:2px'/>" +
                		"资源类型：" + bncsinfo.RESOURCETYPENAME + "<br/>" + "地址：" + isNullOrBlank(bncsinfo.ADDRESS) + "<br/>" + "可容纳人数：" + isNullOrBlank(bncsinfo.PERSONNUM) + "<br/>" +
                    "面积（㎡）：" + isNullOrBlank(bncsinfo.ENGROSSAREA) + "<br/>" + "值班电话：" + isNullOrBlank(bncsinfo.DUTYTEL) + "<br/>" +
                    "<div id = 'showSession' style='display:none'><hr style='border:none;border-top: 1px solid #555555;margin-bottom:2px;margin-top:3px'/>" +
                    "<span id='route'></span></div>" +
                    "<img class='loadRoute' style='position: absolute;right: 10px;bottom: 30px;' src='" +
                    BASE_URL + "images/map/icon/路线.png'/>" +
                    "<img  style='position: absolute;right: 125px;bottom: -28px;' src='" +
                    BASE_URL + "images/map/icon/mappoint.svg'/></div>";

                var infoBox = new BMapLib.InfoBox(map, content, {
                    boxStyle: {
                        minWidth: "270px",
                        Height: "150px",
                        marginBottom: "20px"
                    }
                    , closeIconMargin: "4px 4px 4px 4px"
                    , closeIconUrl: BASE_URL + "images/map/icon/iw_close1d3.gif"
                    , enableAutoPan: true
                    , align: INFOBOX_AT_TOP
                });
                window.infoBoxList.push(infoBox);

                //清除企业物资等map工具类中的历史信息
                if (window.allEmsResPtDic.containsKey(bncsinfo.SHELTERID)) {
                    window.allEmsResPtDic.remove(bncsinfo.SHELTERID);
                }

                //将点位存储至map集合工具类中
                window.allEmsResPtDic.put(bncsinfo.SHELTERID, {
                    "type": 'bncs',
                    "data": bncsinfo,
                    "marker": tmpMarker,
                    "click": function () {
//                    	window.map.setCenter(tmpPt);
//                        window.map.centerAndZoom(tmpPt, 15);
                        //点击一个新的marker点位时关闭其他的infobox
                        _.map(window.infoBoxList, function (infobox) {
                            infobox.close();
                        });
                        //点位跳动
                        tmpMarker.setAnimation(BMAP_ANIMATION_BOUNCE);

                        //定义点位信息窗口回调事件
                        infoBox.open(tmpMarker);
                        //infoBox关闭时执行的操作
                        infoBox.addEventListener("close", function (e) {
                            //清空路线和相关marker
                            removePolyAndMarker();
                            //取消marker的跳动效果
                            tmpMarker.setAnimation(null);
                        });

                        $(".loadRoute").click(function () {
                            if ($("#showSession").css("display") == "none") {
                                initRoute(bncsinfo.LONGITUDE, bncsinfo.LATITUDE, "bncs", bncsinfo.SHELTERNAME, bncsinfo.SHELTERID, function (result) {
                                    var distance = result.distance;
                                    var time = result.duration;
                                    $("#showSession").show();
                                    $("#route").text("距离：" + distance + " 时间：" + time);

                                });
                            } else {
                                removePolyAndMarker();
                                $("#showSession").hide();
                            }

                        });
                    }
                });

                //定义点位点击触发事件
                tmpMarker.addEventListener("click", function () {
                    window.allEmsResPtDic.get(bncsinfo.SHELTERID).click();
                });

                //将点位添加至地图
                window.map.addOverlay(tmpMarker);
            });
            $("#bncstable").append(csinfo);
        }

        //应急队伍
        if (data.yjdw.length > 0) {
            var dwinfo = "";
            _.map(data.yjdw, function (yjdwinfo) {
                dwinfo += "<tr data-id='" + yjdwinfo.TEAMID + "'  onclick='makePoint(" + JSON.stringify(yjdwinfo.TEAMID) + ")'><td title='"+yjdwinfo.TEAMNAME+"'>" + yjdwinfo.TEAMNAME + "</td><td>" + SelectOption.getTeamType(yjdwinfo.TEAMTYPEID) + "</td></tr>";
                //***********加载资源
                var tmpPt = new BMap.Point(yjdwinfo.LONGITUDE, yjdwinfo.LATITUDE);

                //定义marker的图标    --待续-------------
                var tmpMarkerOpt = {};
                tmpMarkerOpt.title = yjdwinfo.TEAMNAME;
                tmpMarkerOpt.icon = new BMap.Icon(BASE_URL + "images/map/icon/marker_jydw.png", new BMap.Size(26, 32), // 视窗大小
	                　　　　　　　　{
	          　　　　　　　　　　imageSize: new BMap.Size(26,32)// 引用图片实际大小
	          　　　　　　　　});//标注图标
//				tmpMarkerOpt.offset = new BMap.Size(18, 10);//标注图标偏移量
                var tmpMarker = new BMap.Marker(tmpPt, tmpMarkerOpt);

                //允许清除覆盖物
                tmpMarker.enableMassClear();
                //清除企业物资等map工具类中的历史信息
                if (window.allEmsResPtDic.containsKey(yjdwinfo.TEAMID)) {
                    window.allEmsResPtDic.remove(yjdwinfo.TEAMID);
                }


                var content = "<div class='infoBoxContent'><font size='3'><strong>"+yjdwinfo.TEAMNAME+"</strong></font><hr style='border:none;border-top: 1px solid #555555;margin-bottom:2px;margin-top:2px'/>" +
                	"救援专业：" + isNullOrBlank(yjdwinfo.PROFESSIONDESC) + "<br/>" + "地址：" + isNullOrBlank(yjdwinfo.ENTADDRESS) + "<br/>" + "队伍人数：" + isNullOrBlank(yjdwinfo.TOTALNUM) + "<br/>" +
                    "救援车辆：" + isNullOrBlank(yjdwinfo.VEHICLENUM) + "<br/>" + "值班电话：" + isNullOrBlank(yjdwinfo.DUTYTEL) + "<br/>" +
                    "<div id = 'showSession' style='display:none'><hr style='border:none;border-top: 1px solid #555555;margin-bottom:2px;margin-top:3px'/>" +
                    "<span id='route'></span></div>" +
                    "<img class='loadRoute' style='position: absolute;right: 10px;bottom: 30px;' src='" +
                    BASE_URL + "images/map/icon/路线.png'/>" +
                    "<img  style='position: absolute;right: 125px;bottom: -28px;' src='" +
                    BASE_URL + "images/map/icon/mappoint.svg'/></div>";

                var infoBox = new BMapLib.InfoBox(map, content, {
                    boxStyle: {
                    	minWidth: "270px",
                        Height: "150px",
                        marginBottom: "20px"
                    }
                    , closeIconMargin: "4px 4px 4px 4px"
                    , closeIconUrl: BASE_URL + "images/map/icon/iw_close1d3.gif"
                    , enableAutoPan: true
                    , align: INFOBOX_AT_TOP
                });
                window.infoBoxList.push(infoBox);


                //将点位存储至map集合工具类中
                window.allEmsResPtDic.put(yjdwinfo.TEAMID, {
                    "type": "jydw",
                    "data": yjdwinfo,
                    "marker": tmpMarker,
                    "click": function () {
//                    	window.map.setCenter(tmpPt);
//                        window.map.centerAndZoom(tmpPt, 15);
                        //点击一个新的marker点位时关闭其他的infobox
                        _.map(window.infoBoxList, function (infobox) {
                            infobox.close();
                        });
                        //点位跳动
                        tmpMarker.setAnimation(BMAP_ANIMATION_BOUNCE);
                        infoBox.open(tmpMarker);
                        //infoBox关闭时执行的操作
                        infoBox.addEventListener("close", function (e) {
                            //清空路线和相关marker
                            removePolyAndMarker();
                            //取消marker的跳动效果
                            tmpMarker.setAnimation(null);
                        });
                        $(".loadRoute").click(function () {
                            if ($("#showSession").css("display") == "none") {

                                initRoute(yjdwinfo.LONGITUDE, yjdwinfo.LATITUDE, "jydw", yjdwinfo.TEAMNAME, yjdwinfo.TEAMID, function (result) {
                                    var distance = result.distance;
                                    var time = result.duration;
                                    $("#showSession").show();
                                    $("#route").text("距离：" + distance + " 时间：" + time);
                                });
                            } else {
                                $("#showSession").hide();
                                removePolyAndMarker();
                            }
                        });

                    }
                });

                //定义点位点击触发事件
                tmpMarker.addEventListener("click", function () {
                    window.allEmsResPtDic.get(yjdwinfo.TEAMID).click();
                });

                //将点位添加至地图
                window.map.addOverlay(tmpMarker);

            });
            $("#jydwtable").append(dwinfo);
        }

        //医疗资源
        if (data.ylzy.length > 0) {
            var ylinfo = "";
            _.map(data.ylzy, function (yljginfo) {
                ylinfo += "<tr data-id='" + yljginfo.DEPTID + "'  onclick='makePoint(" + JSON.stringify(yljginfo.DEPTID) + ")'><td title='"+yljginfo.DEPTNAME+"'>" + yljginfo.DEPTNAME + "</td><td>" + yljginfo.RESOURCETYPENAME + "</td></tr>";
                //**********************
                var tmpPt = new BMap.Point(yljginfo.LONGITUDE, yljginfo.LATITUDE);

                //定义marker的图标    --待续-------------
                var tmpMarkerOpt = {};
                tmpMarkerOpt.title = yljginfo.DEPTNAME;
                tmpMarkerOpt.icon = new BMap.Icon(BASE_URL + "images/map/icon/marker_ylzy.png", new BMap.Size(26, 32), // 视窗大小
	                　　　　　　　　{
	          　　　　　　　　　　imageSize: new BMap.Size(26,32)// 引用图片实际大小
	          　　　　　　　　});//标注图标
//				tmpMarkerOpt.offset = new BMap.Size(18, 10);//标注图标偏移量
                var tmpMarker = new BMap.Marker(tmpPt, tmpMarkerOpt);

                //允许清除覆盖物
                tmpMarker.enableMassClear();


                var content = "<div class='infoBoxContent'><font size='3'><strong>"+yljginfo.DEPTNAME+"</strong></font><hr style='border:none;border-top: 1px solid #555555;margin-bottom:2px;margin-top:2px'/>" +
                		"医疗机构类型：" + isNullOrBlank(yljginfo.RESCUETYPECODE) + "<br/>" + "地址：" + isNullOrBlank(yljginfo.ADDRESS) + "<br/>" + "病床数：" + isNullOrBlank(yljginfo.DEPTGRADECODE) + "<br/>" +
                    "急救车数量：" + isNullOrBlank(yljginfo.AMBULANCENUM) + "<br/>" + "值班电话：" + isNullOrBlank(yljginfo.DUTYTEL) + "<br/>" +
                    "<div id = 'showSession'  style='display:none'><hr style='border:none;border-top: 1px solid #555555;margin-bottom:2px;margin-top:3px'/>" +
                    "<span id='route'></span></div>" +
                    "<img class='loadRoute' style='position: absolute;right: 10px;bottom: 30px;' src='" +
                    BASE_URL + "images/map/icon/路线.png'/>" +
                    "<img  style='position: absolute;right: 125px;bottom: -28px;' src='" +
                    BASE_URL + "images/map/icon/mappoint.svg'/></div>";

                var infoBox = new BMapLib.InfoBox(map, content, {
                    boxStyle: {
                    	minWidth: "270px",
                        Height: "150px",
                        marginBottom: "20px"
                    }
                    , closeIconMargin: "4px 4px 4px 4px"
                    , closeIconUrl: BASE_URL + "images/map/icon/iw_close1d3.gif"
                    , enableAutoPan: true
                    , align: INFOBOX_AT_TOP
                });
                window.infoBoxList.push(infoBox);


                //清除企业物资等map工具类中的历史信息
                if (window.allEmsResPtDic.containsKey(yljginfo.DEPTID)) {
                    window.allEmsResPtDic.remove(yljginfo.DEPTID);
                }

                //将点位存储至map集合工具类中
                window.allEmsResPtDic.put(yljginfo.DEPTID, {
                    "type": "ylzy",
                    "data": yljginfo,
                    "marker": tmpMarker,
                    "click": function () {
//                    	window.map.setCenter(tmpPt);
//                        window.map.centerAndZoom(tmpPt, 15);
                        //点击一个新的marker点位时关闭其他的infobox
                        _.map(window.infoBoxList, function (infobox) {
                            infobox.close();
                        });
                        //点位跳动
                        tmpMarker.setAnimation(BMAP_ANIMATION_BOUNCE);
                        infoBox.open(tmpMarker);
                        //infoBox关闭时执行的操作
                        infoBox.addEventListener("close", function (e) {
                            //清空路线和相关marker
                            removePolyAndMarker();
                            //取消marker的跳动效果
                            tmpMarker.setAnimation(null);
                        });
                        $(".loadRoute").click(function () {
                            if ($("#showSession").css("display") == "none") {
                                initRoute(yljginfo.LONGITUDE, yljginfo.LATITUDE, "ylzy", yljginfo.DEPTNAME, yljginfo.DEPTID, function (result) {
                                    var distance = result.distance;
                                    var time = result.duration;
                                    $("#showSession").show();
                                    $("#route").text("距离：" + distance + " 时间：" + time);
                                });
                            }else{
                                $("#showSession").hide();
                                removePolyAndMarker();
                            }
                        });

                    }
                });

                //定义点位点击触发事件
                tmpMarker.addEventListener("click", function () {
                    window.allEmsResPtDic.get(yljginfo.DEPTID).click();
                });

                //将点位添加至地图
                window.map.addOverlay(tmpMarker);
            });
            $("#ylzytable").append(ylinfo);
        }

        //物资装备
        if (data.wzzb.length > 0) {
            var ckinfo = "";
            _.map(data.wzzb, function (yjckinfo) {
                ckinfo += "<tr data-id='" + yjckinfo.EMSDEPOSID + "'  onclick='makePoint(" + JSON.stringify(yjckinfo.EMSDEPOSID) + ")'><td title='"+yjckinfo.STOREHOUSE+"'>" + yjckinfo.STOREHOUSE + "</td><td>" + SelectOption.getMaeMaterialtype(yjckinfo.MATERIALTYPE) + "</td></tr>";
                //**************************************

                var tmpPt = new BMap.Point(yjckinfo.LONGITUDE, yjckinfo.LATITUDE);

                //定义marker的图标    --待续-------------
                var tmpMarkerOpt = {};
                tmpMarkerOpt.title = yjckinfo.STOREHOUSE;
                tmpMarkerOpt.icon = new BMap.Icon(BASE_URL + "images/map/icon/marker_wzzb.png", new BMap.Size(26, 32), // 视窗大小
	                　　　　　　　　{
	          　　　　　　　　　　imageSize: new BMap.Size(26,32)// 引用图片实际大小
	          　　　　　　　　});//标注图标
//				tmpMarkerOpt.offset = new BMap.Size(18, 10);//标注图标偏移量
                var tmpMarker = new BMap.Marker(tmpPt, tmpMarkerOpt);

                //允许清除覆盖物
                tmpMarker.enableMassClear();


                var content = "<div class='infoBoxContent'><font size='3'><strong>"+yjckinfo.STOREHOUSE+"</strong></font><hr style='border:none;border-top: 1px solid #555555;margin-bottom:2px;margin-top:2px'/>" +
                	"物资类型：" + yjckinfo.MATERIALTYPE + "<br/>" + "地址：" + isNullOrBlank(yjckinfo.ADDRESS) + "<br/>" + "库容：" + isNullOrBlank(yjckinfo.CAPACITY) + "<br/>" +
                    "所属单位：" + isNullOrBlank(yjckinfo.MEASURE) + "<br/>" + "值班电话：" + isNullOrBlank(yjckinfo.DUTYTEL) + "<br/>" +
                    "<div id = 'showSession'  style='display:none'><hr style='border:none;border-top: 1px solid #555555;margin-bottom:2px;margin-top:3px'/>" +
                    "<span id='route'></span></div>" +
                    "<img class='loadRoute' style='position: absolute;right: 10px;bottom: 30px;' src='" +
                    BASE_URL + "images/map/icon/路线.png'/>" +
                    "<img  style='position: absolute;right: 125px;bottom: -28px;' src='" +
                    BASE_URL + "images/map/icon/mappoint.svg'/></div>";

                var infoBox = new BMapLib.InfoBox(map, content, {
                    boxStyle: {
                        minWidth: "270px",
                        Height: "150px",
                        marginBottom: "20px"
                    }
                    , closeIconMargin: "4px 4px 4px 4px"
                    , closeIconUrl: BASE_URL + "images/map/icon/iw_close1d3.gif"
                    , enableAutoPan: true
                    , align: INFOBOX_AT_TOP
                });
                window.infoBoxList.push(infoBox);


                //清除企业物资等map工具类中的历史信息
                if (window.allEmsResPtDic.containsKey(yjckinfo.EMSDEPOSID)) {
                    window.allEmsResPtDic.remove(yjckinfo.EMSDEPOSID);
                }

                //将点位存储至map集合工具类中
                window.allEmsResPtDic.put(yjckinfo.EMSDEPOSID, {
                    "type": "wzzb",
                    "data": yjckinfo,
                    "marker": tmpMarker,
                    "click": function () {
//                    	window.map.setCenter(tmpPt);
//                        window.map.centerAndZoom(tmpPt, 15);
                        //点击一个新的marker点位时关闭其他的infobox
                        _.map(window.infoBoxList, function (infobox) {
                            infobox.close();
                        });
                        infoBox.open(tmpMarker);
                        //infoBox关闭时执行的操作
                        infoBox.addEventListener("close", function (e) {
                            //清空路线和相关marker
                            removePolyAndMarker();
                            //取消marker的跳动效果
                            tmpMarker.setAnimation(null);
                        });


                        //点位跳动
                        tmpMarker.setAnimation(BMAP_ANIMATION_BOUNCE);
                        $(".loadRoute").click(function () {
                            if ($("#showSession").css("display") == "none") {

                                initRoute(yjckinfo.LONGITUDE, yjckinfo.LATITUDE, "wzzb", yjckinfo.STOREHOUSE, yjckinfo.EMSDEPOSID, function (result) {
                                    var distance = result.distance;
                                    var time = result.duration;
                                    $("#showSession").show();
                                    $("#route").text("距离：" + distance + " 时间：" + time);
                                });
                            }else{
                                $("#showSession").hide();
                                removePolyAndMarker();
                            }
                        });
                    }
                });

                //定义点位点击触发事件
                tmpMarker.addEventListener("click", function () {
                    window.allEmsResPtDic.get(yjckinfo.EMSDEPOSID).click();
                });

                //将点位添加至地图
                window.map.addOverlay(tmpMarker);

            });
            $("#wzzbtable").append(ckinfo);
        }

		//TODO 运输保障
		data.ysbz = [{TRANSTOOLID:"4028ef7b5ed04582015ed0b934560121",TRANSTOOLNAME:"消毒车",USUALUSECODE:"卫生消毒",DEPOSITPLACE:"浦东杨高南路99号",LOADNUM:"800Kg",RESPPERTEL:"李四海",
					RESPPERTEL:"13588243957",LONGITUDE:"116.8785",LATITUDE:"37.2998"},
		             {TRANSTOOLID:"4028ef7b5ed04582015ed0b851342321",TRANSTOOLNAME:"物资运输车",USUALUSECODE:"物资输送",DEPOSITPLACE:"紫薇路10号",LOADNUM:"2.5T",RESPPERTEL:"张强",
					RESPPERTEL:"13588243957",LONGITUDE:"116.8659",LATITUDE:"37.2856"},
		             {TRANSTOOLID:"4028ef7b5ed04582015ed0b851360951",TRANSTOOLNAME:"危化品救援车",USUALUSECODE:"危化品转移",DEPOSITPLACE:"上丰路88号",LOADNUM:"1.5T",RESPPERTEL:"陈东",
					RESPPERTEL:"13588243957",LONGITUDE:"116.8671",LATITUDE:"37.2681"}]
		if(data.ysbz.length>0){
			var ysinfo = {};
			_.map(data.ysbz,function(ysbzinfo){
				ysinfo+="<tr data-id='"+ysbzinfo.TRANSTOOLID+"'  onclick='makePoint("+JSON.stringify(ysbzinfo.TRANSTOOLID)+")'><td title='"+ysbzinfo.TRANSTOOLNAME+"'>"+ysbzinfo.TRANSTOOLNAME+"</td><td>"+ysbzinfo.USUALUSECODE+"</td></tr>";
				//**************************************
				
				var tmpPt = new BMap.Point(ysbzinfo.LONGITUDE, ysbzinfo.LATITUDE);
				
				//定义marker的图标    --待续-------------
				var tmpMarkerOpt = {};
				tmpMarkerOpt.title = ysbzinfo.TRANSTOOLNAME;
				tmpMarkerOpt.icon = new BMap.Icon(BASE_URL + "images/map/icon/marker_ysbz.png", new BMap.Size(26, 32), // 视窗大小
	                　　　　　　　　{
	          　　　　　　　　　　imageSize: new BMap.Size(26,32)// 引用图片实际大小
	          　　　　　　　　});//标注图标
//				tmpMarkerOpt.offset = new BMap.Size(18, 10);//标注图标偏移量
				var tmpMarker = new BMap.Marker(tmpPt, tmpMarkerOpt);
				
				//允许清除覆盖物
				tmpMarker.enableMassClear();
				var content = "<div class='infoBoxContent'><font size='3'><strong>"+ysbzinfo.TRANSTOOLNAME+"</strong></font><hr style='border:none;border-top: 1px solid #555555;margin-bottom:2px;margin-top:2px'/>"+
						"日常用途："+ysbzinfo.USUALUSECODE+"<br/>"+"地址:"+ysbzinfo.DEPOSITPLACE+"<br/>"+"载重量："+ysbzinfo.LOADNUM+"<br/>"+
						"负责人："+ysbzinfo.RESPPERTEL+"<br/>"+"电话："+ysbzinfo.RESPPERTEL+"<br/>"+
						"<div id = 'showSession'  style='display:none'><hr style='border:none;border-top: 1px solid #555555;margin-bottom:2px;margin-top:3px'/>"+
						"<span id='route'></span></div>"+
						"<img class='loadRoute' style='position: absolute;right: 10px;bottom: 30px;' src='" +
	                    BASE_URL + "images/map/icon/路线.png'/>" +
	                    "<img  style='position: absolute;right: 125px;bottom: -28px;' src='" +
	                    BASE_URL + "images/map/icon/mappoint.svg'/></div>";
              
				var infoBox = new BMapLib.InfoBox(map, content, {
                    boxStyle: {
                        minWidth: "270px",
                        Height: "150px",
                        marginBottom: "20px"
                    }
                    , closeIconMargin: "4px 4px 4px 4px"
                    , closeIconUrl: BASE_URL + "images/map/icon/iw_close1d3.gif"
                    , enableAutoPan: true
                    , align: INFOBOX_AT_TOP
                });
                window.infoBoxList.push(infoBox);
				
				//清除企业物资等map工具类中的历史信息
				if(window.allEmsResPtDic.containsKey(ysbzinfo.TRANSTOOLID)){
					window.allEmsResPtDic.remove(ysbzinfo.TRANSTOOLID);
				}
				
				//将点位存储至map集合工具类中
				window.allEmsResPtDic.put(ysbzinfo.TRANSTOOLID, {
					"type":"ysbz",
					"data": ysbzinfo,
					"marker": tmpMarker,
					"click": function() {
//						window.map.setCenter(tmpPt);
//                        window.map.centerAndZoom(tmpPt, 15);
                        //点击一个新的marker点位时关闭其他的infobox
                        _.map(window.infoBoxList, function (infobox) {
                            infobox.close();
                        });
                        infoBox.open(tmpMarker);
                        //infoBox关闭时执行的操作
                        infoBox.addEventListener("close", function (e) {
                            //清空路线和相关marker
                            removePolyAndMarker();
                            //取消marker的跳动效果
                            tmpMarker.setAnimation(null);
                        });
						
						//点位跳动
						tmpMarker.setAnimation(BMAP_ANIMATION_BOUNCE);
                        //点击图标规划路线                
                        $(".loadRoute").click(function () {
                            if ($("#showSession").css("display") == "none") {

                                initRoute(ysbzinfo.LONGITUDE, ysbzinfo.LATITUDE, "ysbz", ysbzinfo.TRANSTOOLNAME, ysbzinfo.EMSDEPOSID, function (result) {
                                    var distance = result.distance;
                                    var time = result.duration;
                                    $("#showSession").show();
                                    $("#route").text("距离：" + distance + " 时间：" + time);
                                });
                            }else{
                                $("#showSession").hide();
                                removePolyAndMarker();
                            }
                        });
					}
				});
				
				//定义点位点击触发事件
				tmpMarker.addEventListener("click", function(){
					window.allEmsResPtDic.get(ysbzinfo.TRANSTOOLID).click();
				});
				
				//将点位添加至地图
				window.map.addOverlay(tmpMarker);
			
			});
			$("#ysbztable").append(ysinfo);
		}
//		//TODO 通信保障
		data.txbz = [{FIRMID:"4028d8f5493b23f101494f2a03073516",FIRMNAME:"川沙镇卫星通讯保障",RESOURCETYPECODE:"卫星通讯",ADDRESS:"达拉特旗众乐家超市",DUTYTEL:"021-8846921",COMMVEHNUM:"2",POWERVEHNUM:"2",LONGITUDE:"116.8539",LATITUDE:"37.2387"},
		             {FIRMID:"4028d8f5493b23f101494f2a03070125",FIRMNAME:"电信通讯保障",RESOURCETYPECODE:"电信通讯",ADDRESS:"达拉特西火车站",DUTYTEL:"021-8456121",COMMVEHNUM:"",POWERVEHNUM:"4",LONGITUDE:"4",LONGITUDE:"116.8568",LATITUDE:"37.2221"},
		             {FIRMID:"4028d8f5493b23f101494f2a03073687",FIRMNAME:"电力线路抢修工程1小队",RESOURCETYPECODE:"电力抢修",ADDRESS:"达拉特旗电力小区",DUTYTEL:"021-8458632",COMMVEHNUM:"2",POWERVEHNUM:"3",LONGITUDE:"116.8861",LATITUDE:"37.2212"}];
		if(data.txbz.length>0){
			var txinfo = "";
			_.map(data.txbz,function(txbzinfo){
				txinfo+="<tr data-id='"+txbzinfo.FIRMID+"'  onclick='makePoint("+JSON.stringify(txbzinfo.FIRMID)+")'><td title='"+txbzinfo.FIRMNAME+"'>"+txbzinfo.FIRMNAME+"</td><td>"+txbzinfo.RESOURCETYPECODE+"</td></tr>";
				//**************************************
				
				var tmpPt = new BMap.Point(txbzinfo.LONGITUDE, txbzinfo.LATITUDE);
				
				//定义marker的图标    --待续-------------
				var tmpMarkerOpt = {};
				tmpMarkerOpt.title = txbzinfo.FIRMNAME;
				tmpMarkerOpt.icon = new BMap.Icon(BASE_URL + "images/map/icon/marker_txbz.png", new BMap.Size(26, 32), // 视窗大小
	                　　　　　　　　{
	          　　　　　　　　　　imageSize: new BMap.Size(26,32)// 引用图片实际大小
	          　　　　　　　　});//标注图标
//				tmpMarkerOpt.offset = new BMap.Size(18, 10);//标注图标偏移量
				var tmpMarker = new BMap.Marker(tmpPt, tmpMarkerOpt);
				
				//允许清除覆盖物
				tmpMarker.enableMassClear();
				var content = "<div class='infoBoxContent'><font size='3'><strong>"+txbzinfo.FIRMNAME+"</strong></font><hr style='border:none;border-top: 1px solid #555555;margin-bottom:2px;margin-top:2px' />"+
						"资源类型："+txbzinfo.RESOURCETYPECODE+"<br/>"+"地址："+txbzinfo.ADDRESS+"<br/>"+"值班电话:"+txbzinfo.DUTYTEL+"<br/>"+"应急通讯车辆："+
						txbzinfo.COMMVEHNUM+"<br/>"+"应急发电车辆："+txbzinfo.POWERVEHNUM+"<br/>"+
						"<div id = 'showSession' style='display:none'><hr style='border:none;border-top: 1px solid #555555;margin-bottom:2px;margin-top:3px'/>"+
						"<span id='route'></span></div>"+
						"<img class='loadRoute' style='position: absolute;right: 10px;bottom: 30px;' src='" +
	                    BASE_URL + "images/map/icon/路线.png'/>" +
	                    "<img  style='position: absolute;right: 125px;bottom: -28px;' src='" +
	                    BASE_URL + "images/map/icon/mappoint.svg'/></div>";
				//定义点位弹窗内容-----
				var infoBox = new BMapLib.InfoBox(map, content, {
                    boxStyle: {
                        minWidth: "270px",
                        Height: "150px",
                        marginBottom: "20px"
                    }
                    , closeIconMargin: "4px 4px 4px 4px"
                    , closeIconUrl: BASE_URL + "images/map/icon/iw_close1d3.gif"
                    , enableAutoPan: true
                    , align: INFOBOX_AT_TOP
                });
				
                window.infoBoxList.push(infoBox);
				//清除企业物资等map工具类中的历史信息
				if(window.allEmsResPtDic.containsKey(txbzinfo.FIRMID)){
					window.allEmsResPtDic.remove(txbzinfo.FIRMID);
				}
				
				//将点位存储至map集合工具类中
				window.allEmsResPtDic.put(txbzinfo.FIRMID, {
					"type":"txbz",
					"data": txbzinfo,
					"marker": tmpMarker,
					"click": function() {
//						window.map.setCenter(tmpPt);
//						 window.map.centerAndZoom(tmpPt, 15);
	                        //点击一个新的marker点位时关闭其他的infobox
	                        _.map(window.infoBoxList, function (infobox) {
	                            infobox.close();
	                        });
	                        infoBox.open(tmpMarker);
	                        //infoBox关闭时执行的操作
	                        infoBox.addEventListener("close", function (e) {
	                            //清空路线和相关marker
	                            removePolyAndMarker();
	                            //取消marker的跳动效果
	                            tmpMarker.setAnimation(null);
	                        });
							
							//点位跳动
							tmpMarker.setAnimation(BMAP_ANIMATION_BOUNCE);
	                        //点击图标规划路线                
	                        $(".loadRoute").click(function () {
	                            if ($("#showSession").css("display") == "none") {

	                                initRoute(txbzinfo.LONGITUDE, txbzinfo.LATITUDE, "txbz", txbzinfo.FIRMNAME, txbzinfo.FIRMID, function (result) {
	                                    var distance = result.distance;
	                                    var time = result.duration;
	                                    $("#showSession").show();
	                                    $("#route").text("距离：" + distance + " 时间：" + time);
	                                });
	                            }else{
	                                $("#showSession").hide();
	                                removePolyAndMarker();
	                            }
	                        });
						}
				});
				
				//定义点位点击触发事件
				tmpMarker.addEventListener("click", function(){
					window.allEmsResPtDic.get(txbzinfo.FIRMID).click();
				});
				
				//将点位添加至地图
				window.map.addOverlay(tmpMarker);
			
			});
			$("#txbztable").append(txinfo);
		}
    }
}


/**
 *
 * 加载刷新资源表格数据
 * @param datalist {list集合，集合中封装的是type:idList},形如
 * datalist:{bncs:["4028ef7b5ed04582015ed0b851360121","4028d8f45c1f5dc3015c1f5e73d60019"],jydw:["4028ef735c4254b5015c43361c7901ec"]}
 * 其中：
 * type为各个资源模块的拼音缩写，如救援队伍为jydw,医疗资源为ylzy;
 * idList为资源的主键id的数组,用于遍历时确保当前资源的唯一性
 *
 */
function reloadTable(datalist) {
    //隐藏table中的内容
//	$("#bncstable").hide();
//	$("#jydwtable").hide();
//	$("#ylzytable").hide();
//	$("#wzzbtable").hide();
//	$("#ysbztable").hide();
//	$("#txbztable").hide();
    if (datalist) {
        //避难场所
        if (datalist.bncs.length > 0) {
            _.map(datalist.bncs, function (bncsid, index) {
                //循环当前table的tr
                $("#bncstable").find("tr").each(function () {
                    if (datalist.bncs.indexOf($(this).attr("data-id")) != -1) {
                        $(this).show();
                    } else {
                        $(this).hide();
                    }
                });
            });

        }
        //救援队伍
        if (datalist.jydw.length > 0) {
            _.map(datalist.jydw, function (jydwid, index) {
                //循环当前table的tr
                $("#jydwtable").find("tr").each(function () {
                    if (datalist.jydw.indexOf($(this).attr("data-id")) != -1) {
                        $(this).show();
                    } else {
                        $(this).hide();
                    }
                });
            });

        }
        //医疗资源
        if (datalist.ylzy.length > 0) {
            _.map(datalist.ylzy, function (ylzyid, index) {
                //循环当前table的tr
                $("#ylzytable").find("tr").each(function () {
                    if (datalist.ylzy.indexOf($(this).attr("data-id")) != -1) {
                        $(this).show();
                    } else {
                        $(this).hide();
                    }
                });
            });

        }
        //物资装备
        if (datalist.wzzb.length > 0) {
            _.map(datalist.wzzb, function (wzzbid, index) {
                //循环当前table的tr
                $("#wzzbtable").find("tr").each(function () {
                    if (datalist.wzzb.indexOf($(this).attr("data-id")) != -1) {
                        $(this).show();
                    } else {
                        $(this).hide();
                    }
                });
            });

        }
        //运输保障
        if (datalist.ysbz.length > 0) {
            _.map(datalist.ysbz, function (ysbzid, index) {
                //循环当前table的tr
                $("#ysbztable").find("tr").each(function () {
                    if (datalist.ysbz.indexOf($(this).attr("data-id")) != -1) {
                        $(this).show();
                    } else {
                        $(this).hide();
                    }
                });
            });

        }
        //通信保障
        if (datalist.txbz.length > 0) {
            _.map(datalist.txbz, function (txbzid, index) {
                //循环当前table的tr
                $("#txbztable").find("tr").each(function () {
                    if (datalist.txbz.indexOf($(this).attr("data-id")) != -1) {
                        $(this).show();
                    } else {
                        $(this).hide();
                    }
                });
            });

        }

    }

}
/**
 * 点击列表标记资源
 * @param obj
 */
function makePoint(resourceId) {
    window.allEmsResPtDic.get(resourceId).click();
}

/**
 * 根据半径地图上画圆并筛选显示地图上已有的应急资源等点位
 * @param radius
 * @param type 0: 触发下面导航 1：左侧导航时圆形筛选覆盖物内marker变化
 */
function initDrawFilterCircle(type, radius) {
    if ("0" == type) {
        //清空上一次的圆形覆盖物
        if (window.drawFilterCircle) {
            window.map.removeOverlay(window.drawFilterCircle);
        }
        //定义事故发生地为圆心
        var longitude = $("#eventlongitude").val();
        var latitude = $("#eventlatitude").val();
        //将事故点设为中心点位
        window.map.centerAndZoom(new BMap.Point(longitude, latitude),14);
        window.drawFilterCircle = new BMap.Circle(new BMap.Point(longitude, latitude), radius * 1000, {
            strokeColor: "blue",
            strokeOpacity: 0.3,
            strokeWeight: 1,
//	        fillColor: "#E2E8F1",
            fillColor: "blue",
            fillOpacity: 0.3
        });
        window.map.addOverlay(window.drawFilterCircle);
    }

    //定义圆外面需要隐藏的marker对象
    window.drawFilHidMarkers = [];

//	{bncs:["4028ef7b5ed04582015ed0b851360121","4028d8f45c1f5dc3015c1f5e73d60019"],jydw:["4028ef735c4254b5015c43361c7901ec"]}
//	ylzy wzzb ysbz txbz

    var emsResBncsList = [],
        emsResJydwList = [],
        emsResYlzyList = [],
        emsResWzzbList = [],
        emsResYsbzList = [],
        emsResTxbzList = [];

//	alert(window.drawFilHidMarkers);

    //遍历所有marker以隐藏圆外面的marker
    if (window.allEmsResPtDic && !window.allEmsResPtDic.isEmpty()) {
        _.map(window.allEmsResPtDic.values(), function (tmpEmsRes, index) {
            var tmpMarker = tmpEmsRes.marker;
            if (!(BMapLib.GeoUtils.isPointInCircle(tmpMarker.getPosition(), window.drawFilterCircle))) {
                if (!($(".accidentList").find("span[data-kind='" + tmpEmsRes.type + "']").hasClass("visited1"))) {
//					alert(JSON.stringify(tmpEmsRes.data));
                    tmpMarker.hide();
                    window.drawFilHidMarkers.push(tmpMarker);
                }
            } else {
                var tmpType = tmpEmsRes.type;
                if (!($(".accidentList").find("span[data-kind='" + tmpType + "']").hasClass("visited1"))) {
                    switch (tmpType) {
                        case "bncs":
                            emsResBncsList.push(tmpEmsRes.data.SHELTERID);
                            break;
                        case "jydw":
                            emsResJydwList.push(tmpEmsRes.data.TEAMID);
                            break;
                        case "ylzy":
                            emsResYlzyList.push(tmpEmsRes.data.DEPTID);
                            break;
                        case "wzzb":
                            emsResWzzbList.push(tmpEmsRes.data.EMSDEPOSID);
                            break;
                        case "ysbz":
                            emsResYsbzList.push(tmpEmsRes.data.TRANSTOOLID);
                            break;
                        case "txbz":
                            emsResTxbzList.push(tmpEmsRes.data.FIRMID);
                            break;
                        default:
                            break;
                    }
                }
            }
        });

        //刷新左侧应急资源子表数据
        reloadTable({
            "bncs": emsResBncsList,
            "jydw": emsResJydwList,
            "ylzy": emsResYlzyList,
            "wzzb": emsResWzzbList,
            "ysbz": emsResYsbzList,
            "txbz": emsResTxbzList
        });
    }
}

/**
 * Created by Administrator on 2017/10/30.
 */

/**
 * 根据类型获取颜色 和 类型以及图标地址
 * @param type
 * @returns {{}}
 */
function getParamsByType(type) {
    var params = {};
    switch (type) {
        case "bncs":
            params.color = "#58C84C";
            params.type = "cllx";
            params.icon = new BMap.Icon(BASE_URL + "images/map/icon/marker_bncs.png", new BMap.Size(40, 49));
            break;
        case "jydw":
            params.color = "#BD10E0";
            params.type = "jylx";
            params.icon = new BMap.Icon(BASE_URL + "images/map/icon/marker_jydw.png", new BMap.Size(40, 49));
            break;
        case "ylzy":
            params.color = "#D0011A";
            params.type = "jylx";
            params.icon = new BMap.Icon(BASE_URL + "images/map/icon/marker_ylzy.png", new BMap.Size(40, 49));
            break;
        case "wzzb":
            params.color = "#F5A624";
            params.type = "jylx";
            params.icon = new BMap.Icon(BASE_URL + "images/map/icon/marker_wzzb.png", new BMap.Size(40, 49));
            break;
        case "ysbz":
            params.color = "#F8E71C";
            params.type = "jylx";
            params.icon = new BMap.Icon(BASE_URL + "images/map/icon/marker_ysbz.png", new BMap.Size(40, 49));
            break;
        case "txbz":
            params.color = "#23C0F5";
            params.type = "jylx";
            params.icon = new BMap.Icon(BASE_URL + "images/map/icon/marker_txbz.png", new BMap.Size(40, 49));
            break;
    }
    return params;
}


/**
 * 初始化每个点位的导航路线
 *
 * @param lng 经度
 * @param lat 维度
 * @param color 路线的颜色
 * @param type marker的类型
 * @param name marker的名称
 * @param icon 起点的图标路径
 */

window.polylineList = new Array();
window.markerList = new Array();

function initRoute(lng, lat, type, name, id, searchCom) {

    removePolyAndMarker();
    var params = getParamsByType(type);
    var searchComplete = function (results) {
        if (driving.getStatus() != BMAP_STATUS_SUCCESS) {
            return;
        }
        var plan = results.getPlan(0);
        output.duration = plan.getDuration(true);                //获取时间
        output.distance = plan.getDistance(true);
        //获取距离
    };
    var driving = new BMap.DrivingRoute(window.map, {
            onPolylinesSet: function (routes) {
                _.map(routes, function (route) {
                    //存储生成的路线覆盖物
                    var curDvrPolyline = route.getPolyline();
                    //覆盖物存储到数组中
                    curDvrPolyline.setStrokeColor(params.color);
                    window.polylineList.push(curDvrPolyline);
                });
                // if (!window.routePolylineMap) {
                //     window.routePolylineMap = new MapUtil();
                // }
                // window.routePolylineMap.put(id, polylineList);
                searchCom(output);
            },
            onMarkersSet: function (pois) {
                console.log(pois);
                _.map(pois, function (poi) {
                    if (params.type == "jylx") {
                        poi.marker.setTitle(name + "的救援路线起点");
                        poi.marker.setIcon(BASE_URL + "images/gis/beginred.png");
                    } else if (params.type == "cllx") {
                        poi.marker.setTitle(name + "的撤离路线终点");
                        poi.marker.setIcon(BASE_URL + "images/gis/endgreen.png");
                    }
                    window.markerList.push(poi.marker);

                });

                // if (!window.routeMarkerMap) {
                //     window.routeMarkerMap = new MapUtil();
                // }
                // window.routeMarkerMap.put(id, markerList);
            },
            onSearchComplete: searchComplete,
            renderOptions: {map: window.map, panel: "r-result", autoViewport: false}
        }
    );
    var output = {};


    //判断是救援路线还是撤离路线，出发地是不同的
    if (params.type == "jylx") {
        driving.search(new BMap.Point(lng, lat), new BMap.Point($("#eventlongitude").val(), $("#eventlatitude").val()));
    }
    if (params.type == "cllx") {
        driving.search(new BMap.Point($("#eventlongitude").val(), $("#eventlatitude").val()), new BMap.Point(lng, lat));
    }
}


function removePolyAndMarker() {
    _.map(window.markerList, function (marker) {
        window.map.removeOverlay(marker);
    });
    _.map(window.polylineList, function (polyline) {
        window.map.removeOverlay(polyline);
    });

}

function removePolyAndMarkerById(id) {
    var markers = window.routeMarkerMap.get(id);
    var polylines = window.routePolylineMap.get(id);
    _.map(markers, function (marker) {
        window.map.removeOverlay(marker);
    });
    _.map(polylines, function (polyline) {
        window.map.removeOverlay(polyline);
    });

    window.routeMarkerMap.remove(id);
    window.routePolylineMap.remove(id);
}

/**
 * 判断参数是否为空，如果为空显示“”，即空字符串
 * @param params
 * @returns
 */
function isNullOrBlank(params){
	if(params){
		return params;
	}else{
		return "";
	}
}
