/**
 * Created by Administrator on 2017/10/16.
 */
$(function () {
    //获取当前任务id
    var forecastid = getQueryString("forecastid");
    var eventid = getQueryString("eventid");
    scrollResize();
    $('.forecastNavbar ul').on('click', 'li', function () {
        $('.forecastNavbar ul li.active').removeClass('active');

        $(this).addClass('active');
        var type = $(this).data('kind');
        window.map.clearOverlays();
        switch (type) {
            case 'fhmb':
            case 'wxy':
            case 'rkxx':
                loadFhmbList(1, type);
                break;
            case 'jjq':
            case 'dlfs':
                initJjqInfo(forecastid, type);
                break;
            case 'cssj':
                initCsxxInfo(1, eventid);
                break;
            case 'cllx':
                initDriveRoute(1, forecastid, eventid, '0');
                break;
            case 'jylx':
                initDriveRoute(1, forecastid, eventid, '1');
                break;
            case 'stkzcl':
                initstkzclInfo(forecastid, eventid);
                break;
        }

        scrollResize();
    });
    $('.foreAll').on('click', '.foreContent', function () {
        $('.foreAll .foreContent').removeClass('active');
        $(this).addClass('active');

        var id = $(this).data('id');

        _.map(window.markersMap.values(),function (item) {
            item.marker.setAnimation(null);
        });

        window.markersMap.get(id).click();




    });

    window.map = initMap();
    window.markersMap = new MapUtil();
    
    loadForecastInfo(forecastid);

    loadPlaceArr($("#eventid").val());

    loadSimulation(eventid);



});

function loadForecastInfo(forecastid) {
    $.ajax({
        type: "post",
        url: BASE_URL + "ems/emssucigrforecast/load",
        dataType: "json",
        async: false,
        data: {
            forecastid: forecastid
        },
        success: function (data) {
            if (data) {
               $("#titlename").text(data.forecasttitle);
            }
        },
        error: function () {
            parent.toast("初始化信息加载失败");
        }
    });
}


function initMap() {
    //初始化地图展示的高度
    $("#map").height($(window).height());
    //地图本地根据IP地址定位以及添加标尺(禁止点击地图上的地点弹出百度详情)
    var map = new BMap.Map("map", {enableMapClick: false, minZoom: 6, maxZoom: 18}); // 创建Map实例
    map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放
    //默认中心位置为达拉特
    map.centerAndZoom(new BMap.Point(116.8923, 37.3045), 15);
    return map;
}


function loadSimulation(eventid){
    //查询
    $.ajax({
        type: "post",
        url: BASE_URL + "ems/emssucsimulation/loadEvnAnaData",
        dataType: "json",
        data: {
            curEvnId: eventid
        },
        success: function (data) {
            if (data) {

                initAnalogMap(data);
            }
        },
        error: function () {
            parent.toast("初始化信息加载失败");
        }
    });
}

function initAnalogMap(data) {
    //地图本地根据IP地址定位以及添加标尺(禁止点击地图上的地点弹出百度详情)
    // var map = new BMap.Map("mapanalog", {enableMapClick: false, minZoom: 6, maxZoom: 18}); // 创建Map实例
    window.map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放

    //默认中心位置
    // window.map.centerAndZoom(new BMap.Point(data.emsSucSimulation.longitude, data.emsSucSimulation.latitude), 13);

    //左下角添加比例尺控件
    window.map.addControl(new BMap.ScaleControl({anchor: BMAP_ANCHOR_BOTTOM_LEFT}));

    // var tmpPt = new BMap.Point(data.emsSucSimulation.longitude, data.emsSucSimulation.latitude);

    // var tmpMarker = new BMap.Marker(tmpPt, {
    //     "title": "--",
    //     "icon": new BMap.Icon(BASE_URL + "images/portal/icon_gisEnt.png", new BMap.Size(35, 45))
    // });

    // tmpMarker.setAnimation(BMAP_ANIMATION_BOUNCE);
    //加载低浓度覆盖物
    if (data.lowPts && 0 < data.lowPts.length) {
        var lowPtArr = [];
        _.map(data.lowPts, function (lowPt, i) {
            lowPtArr.push(new BMap.Point(lowPt.lng, lowPt.lat));
        });
        var lowPoly = new BMap.Polygon(lowPtArr, {"fillColor": "#16e787"});
        lowPoly.disableMassClear();
        window.map.addOverlay(lowPoly);
    }

    //加载中等浓度覆盖物
    if (data.midPts && 0 < data.midPts.length) {
        var midPtArr = [];
        _.map(data.midPts, function (midPt, i) {
            midPtArr.push(new BMap.Point(midPt.lng, midPt.lat));
        });

        var midPoly = new BMap.Polygon(midPtArr, {"fillColor": "#f0ff4a"});
        midPoly.disableMassClear();
        window.map.addOverlay(midPoly);
    }

    //加载高浓度覆盖物
    if (data.highPts && 0 < data.highPts.length) {
        var highPtArr = [];
        _.map(data.highPts, function (highPt, i) {
            highPtArr.push(new BMap.Point(highPt.lng, highPt.lat));
        });

        var highPoly = new BMap.Polygon(highPtArr, {"fillColor": "#fc5b6a"});
        highPoly.disableMassClear();
        window.map.addOverlay(highPoly);
    }

    // window.map.addOverlay(tmpMarker);
}


function initstkzclInfo(forecastid, eventid) {

    $.ajax({
        type: "post",
        url: BASE_URL + "ems/emssucigrforecast/load",
        dataType: "json",
        async: false,
        data: {
            forecastid: forecastid
        },
        success: function (data) {
            if (data) {
                var stkzclTpt = _.template($("#stkzclTpt").html());
                data.baseUrl = BASE_URL;
                $("#container").html(stkzclTpt(data));
            }
        },
        error: function () {
            parent.toast("初始化信息加载失败");
        }
    });
}

function initDriveRoute(page, forecastid, eventid, routetype) {
    $.ajax({
        type: "get",
        url: BASE_URL + "ems/emssucresourceevaluation/getShelterRouteData",
        dataType: "json",
        async: false,
        data: {
            eventid: eventid,
            forecastid: forecastid,
            routetype: routetype,
            page: page || 1,
            rows: 10,
            sidx: 'STARTLAT',
            sord: 'desc'
        },
        success: function (data) {
            if (data) {
                window.map.clearOverlays();
                _.map(data.datas,function (item) {
                    initDriveRouteLine(item);
                });
                if (routetype == '0') {
                    var cllxTpt = _.template($("#cllxTpt").html());
                    data.baseUrl = BASE_URL;
                    $("#container").html(cllxTpt(data));
                    // 事后评估分页
                    Page({
                        num: data.total, //页码数
                        startnum: page || 1, //指定页码
                        elem: $('#cllxPage'), //指定的元素
                        callback: function (n) { //回调函数 n 为当前页码
                            initCsxxInfo(n, eventid);
                        }
                    });
                } else {
                    var jylxTpt = _.template($("#jylxTpt").html());
                    data.baseUrl = BASE_URL;
                    $("#container").html(jylxTpt(data));

                    // 事后评估分页
                    Page({
                        num: data.total, //页码数
                        startnum: page || 1, //指定页码
                        elem: $('#jylxPage'), //指定的元素
                        callback: function (n) { //回调函数 n 为当前页码
                            initCsxxInfo(n, eventid);
                        }
                    });
                }

            } else {
                $("#container").html("暂无数据");
            }
        },
        error: function () {
            parent.toast("初始化信息加载失败");
        }
    });
}

function initDriveRouteLine(item) {
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
            },
            onSearchComplete: searchComplete,
            renderOptions: {map: window.map, panel: "r-result", autoViewport: false}
        }
    );
    var output = {};
    //判断是救援路线还是撤离路线，出发地是不同的
   driving.search(new BMap.Point(item.STARTLON,item.STARTLAT), new BMap.Point(item.ENDLON,item.ENDLAT));
}


function initCsxxInfo(page, eventid) {
    $.ajax({
        type: "get",
        url: BASE_URL + "ems/emsplaproacc/proacclist",
        dataType: "json",
        async: false,
        data: {
            eventid: eventid,
            page: page || 1,
            rows: 10,
            sidx: 'proaccid',
            sord: 'desc'
        },
        success: function (data) {
            if (data) {

                window.map.clearOverlays();
                var csxxTpt = _.template($("#csxxTpt").html());
                data.baseUrl = BASE_URL;
                $("#container").html(csxxTpt(data));

                // 事后评估分页
                Page({
                    num: data.total, //页码数
                    startnum: page || 1, //指定页码
                    elem: $('#csxxPage'), //指定的元素
                    callback: function (n) { //回调函数 n 为当前页码
                        initCsxxInfo(n, eventid);
                    }
                });

            }
        },
        error: function () {
            parent.toast("初始化信息加载失败");
        }
    });
}

function initJjqInfo(forecastid, type) {
    $.ajax({
        type: "get",
        url: BASE_URL + "ems/emssucigrforecast/otherInfo",
        dataType: "json",
        async: false,
        data: {
            forecastid: forecastid,
            urlType: type
        },
        success: function (data) {
            if (data) {
                if (type == 'jjq') {
                    var jjqTpt = _.template($("#jjqTpt").html());
                    data.baseUrl = BASE_URL;
                    $("#container").html(jjqTpt(data));
                    if(data.alertzone){                    	
                    	var zonearea = data.alertzone.zonearea;
                    	console.log(data);
                    	var zonareaArray = JSON.parse(zonearea);
                    	var points = [];
                    	_.map(zonareaArray,function (item) {
                    		var point =  new BMap.Point(item.lng,item.lat);
                    		points.push(point);
                    	});
                    	
                    	var polygon = new BMap.Polygon(points, {strokeColor:"red", strokeWeight:2, strokeOpacity:0.5});  //创建多边形
                    	window.map.addOverlay(polygon);
                    	
                    	var v = window.map.getViewport(points);
                    	console.log(v.zoom);
                    	window.map.centerAndZoom(v.center,v.zoom);
                    }

                } else {
                    var dlfsTpt = _.template($("#dlfsTpt").html());
                    data.baseUrl = BASE_URL;
                    $("#container").html(dlfsTpt(data));
                    var datas = data.roadblockList;
                    if(datas.length>0){
                        _.map(datas,function (item) {
                            var point = new BMap.Point(item.roadlon, item.roadlat);
                            var tmpMarkIcon = new BMap.Icon(BASE_URL + "images/map/icon/icon_luzhang.png", new BMap.Size(42, 56), // 视窗大小
                                {
                                    imageSize: new BMap.Size(42, 56)// 引用图片实际大小
                                });//标注防护目标图标
                            var marker = new BMap.Marker(point, {
                                "title": item.NAME,
                                "icon": tmpMarkIcon
                            });
                            console.log(marker);

                            window.markersMap.put(item.roadblockid,{
                                "marker":marker,
                                "click":function () {
                                    marker.setAnimation(BMAP_ANIMATION_BOUNCE);
                                }
                            });


                            marker.addEventListener("click", function () {
                                marker.setAnimation(BMAP_ANIMATION_BOUNCE);
                            });
                            window.map.centerAndZoom(point, 15);
                            window.map.addOverlay(marker);
                        });
                    }
                }
            }
        },
        error: function () {
            parent.toast("初始化信息加载失败");
        }
    });
}

function loadFhmbList(page, type) {
    $.ajax({
        type: "get",
        url: BASE_URL + "ems/emssucplace/list",
        dataType: "json",
        async: false,
        data: {
            type: type,
            placeIds: $('#placeids').val(),
            page: page || 1,
            rows: 10,
            sidx: 'POPULATION',
            sord: 'desc'
        },
        success: function (data) {
            if (data) {

                if (type == 'rkxx') {
                    var rkxxTpt = _.template($("#rkxxTpt").html());
                    data.baseUrl = BASE_URL;
                    $("#container").html(rkxxTpt(data));

                } else {
                    var fhmbTpt = _.template($("#fhmbTpt").html());
                    data.baseUrl = BASE_URL;
                    $("#container").html(fhmbTpt(data));
                    window.map.clearOverlays();
                    var datas = data.datas;

                    //初始化点位信息

                    if(datas.length>0){
                        _.map(datas,function (item) {
                            var point = new BMap.Point(item.LONGITUDE, item.LATITUDE);
                            var tmpMarkIcon = new BMap.Icon(BASE_URL + "images/map/icon/icon_fhmb.png", new BMap.Size(42, 56), // 视窗大小
                                {
                                    imageSize: new BMap.Size(42, 56)// 引用图片实际大小
                                });//标注防护目标图标
                            var marker = new BMap.Marker(point, {
                                "title": item.NAME,
                                "icon": tmpMarkIcon
                            });
                            console.log(marker);

                            window.markersMap.put(item.PLACEID,{
                                "marker":marker,
                                "click":function () {
                                    marker.setAnimation(BMAP_ANIMATION_BOUNCE);
                                }
                            });


                            marker.addEventListener("click", function () {
                               marker.setAnimation(BMAP_ANIMATION_BOUNCE);
                            });
                            window.map.centerAndZoom(point, 15);
                            window.map.addOverlay(marker);
                        });
                    }



                    // 事后评估分页
                    Page({
                        num: data.total, //页码数
                        startnum: page || 1, //指定页码
                        elem: $('#zhycPage'), //指定的元素
                        callback: function (n) { //回调函数 n 为当前页码
                            loadFhmbList(n, type);
                        }
                    });



                }

            }
        },
        error: function () {
            parent.toast("初始化信息加载失败");
        }
    });
}

function loadPlaceArr(eventid) {
    /* 读取 */
    $.ajax({
        type: "post",
        url: BASE_URL + "ems/emssucsimulation/loadPlaceIdArr",
        dataType: "json",
        async: false,
        data: {
            eventid: eventid
        },
        success: function (data) {
            if (data) {
                $('#placeids').val(data);
                //获取防护目标信息
                loadFhmbList(1);
            }
        },
        error: function () {
            parent.toast("初始化信息加载失败");
        }
    });
}


// 刷新滚动条
function scrollResize() {
    $('.foreAll').niceScroll({
        cursorborder: "#4d86d6",
        cursorcolor: "#4d86d6",
        background: false,
        autohidemode: false
    }).resize();
}

/**
 * 获取当前url访问路径后缀参数值
 * @param name
 * @returns
 */
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}