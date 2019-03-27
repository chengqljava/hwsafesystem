$(function(){
    scrollResize();
    // tab的点击事件
    $('.navBar').on('click','li',function(){
        $('.navBar li').removeClass('active');
        $(this).addClass('active');
        var $id = $(this).data('id');
        $('.allDiv').hide();
        $('.'+$id+'Div').show();
        scrollResize();
    })
    // 分布区域的点击事件
    $('.areaKind').on('click','span',function(){
        var kind = $(this).data('kind');
        $('.areaKind span').removeClass('active');
        $(this).addClass('active');
        $('.allArea .all').hide();
        if(kind == 'all'){
            $('.allArea .all').show();
        }
        else{
            $('.level'+kind).show();
        }
        scrollResize();
        $('.allArea .all').removeClass('active');
        $('.allArea .all').each(function(){
            if($(this).css('display') == 'block'){
                $(this).addClass('active');
                return false;
            }
        });
    })
    var evnAnaPtDic = new MapUtil();
    $('.allArea').on('click','.all',function(){
        $('.allArea .all').removeClass('active');
        $(this).addClass('active');
        var ptId = $(this).find('input').attr('id');
        _.map(evnAnaPtDic.values(),function (item) {
            item.marker.setAnimation(null);
        });
        makePointMaker(evnAnaPtDic,ptId);
    })
    
    var simulationid = getQueryString("simulationid");
    loadSimulation(simulationid,evnAnaPtDic);
})

function loadSimulation(simulationid,evnAnaPtDic){
    //查询
    $.ajax({
        type: "post",
        url: BASE_URL + "ems/emssucsimulation/loadEvnAnaData",
        dataType: "json",
        data: {
        	tgtEvnAnaId: simulationid
        },
        success: function (data) {
            if (data) {
                console.log(data);
                var emsSucSimulation = data.emsSucSimulation;
                var paramtype;
                if(emsSucSimulation.paramtype == 1){
                	paramtype = "手工输入";
                } else if(emsSucSimulation.paramtype == 2){
                	paramtype = "联网获取";
                } else {
                	paramtype = "现场感知";
                } 
                if(emsSucSimulation.leakagetype == 1){
                	leakagetype = "瞬时泄漏";
                } else {
                	leakagetype = "连续泄漏";
                }
                $(".mncsDiv").append(
            		'<table>'+
                		'<tr><td>获取方式</td><td>'+paramtype+'</td></tr>'+
                        '<tr><td>气压(HPa)</td><td>'+emsSucSimulation.airpressure+'</td></tr>'+
                        '<tr><td>气温(℃)</td><td>'+emsSucSimulation.airtemperature+'</td></tr>'+
                        '<tr><td>风速(m/s)</td><td>'+emsSucSimulation.windspeed+'</td></tr>'+
                        '<tr><td>风向(deg)</td><td>'+emsSucSimulation.winddirection+'</td></tr>'+
                        '<tr><td>模拟时间(m)</td><td>'+emsSucSimulation.simulationtime+'</td></tr>'+
                        '<tr><td>泄漏类型</td><td>'+leakagetype+'</td></tr>'+
                        '<tr><td>危化品</td><td>'+emsSucSimulation.leakage+'</td></tr>'+
                        '<tr><td>经度(lon)</td><td>'+emsSucSimulation.longitude+'</td></tr>'+
                        '<tr><td>纬度(lat)</td><td>'+emsSucSimulation.latitude+'</td></tr>'+
                        '<tr><td>初始半径(km)</td><td>'+emsSucSimulation.radius+'</td></tr>'+
                        '<tr><td>初始浓度(ppm)</td><td>'+emsSucSimulation.concentration+'</td></tr>'+
                    '</table>'
                );
                var lkEmslists = data.lkEmslist;
                var sucPlaceLists = data.sucPlaceList;
                var level;
                _.each(lkEmslists,function(lkEmslist,i){
                	if(lkEmslist.arealevel == 1){
                		level = 1;
                    } else if(lkEmslist.arealevel == 2){
                    	level = 2;
                    } else {
                    	level = 3;
                    }
                	_.each(sucPlaceLists,function(sucPlaceList,i){
                		var type;
                		if(sucPlaceList.typeid == 0){
                    		type = "危险源";
                    	} else {
                    		type = "防护目标";
                    	}
                		if(lkEmslist.placeid == sucPlaceList.placeid){
                			$(".allArea").append(
	                    		'<div class="singleArea all level'+level+'">'+
	                    			'<input type="hidden" id="'+sucPlaceList.placeid+'">'+
	                                '<p>场所名称：'+sucPlaceList.name+'</p>'+
	                                '<p>场所类型：'+type+'</p>'+
	                                '<p>人口数：'+sucPlaceList.population+'</p>'+
	                                '<p>联系方式：'+sucPlaceList.tel+'</p>'+
	                            '</div>'	
                            );
                		}
                	});
        		});
                initAnalogMap(data,evnAnaPtDic);
            }
        },
        error: function () {
            parent.toast("初始化信息加载失败");
        }
    });
}

function initAnalogMap(data,evnAnaPtDic) {
    //地图本地根据IP地址定位以及添加标尺(禁止点击地图上的地点弹出百度详情)
    var map = new BMap.Map("mapanalog", {enableMapClick: false, minZoom: 6, maxZoom: 18}); // 创建Map实例
    map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放

    //默认中心位置
    map.centerAndZoom(new BMap.Point(data.emsSucEvent.longitude, data.emsSucEvent.latitude), 13);
    
    //左下角添加比例尺控件
    map.addControl(new BMap.ScaleControl({anchor: BMAP_ANCHOR_BOTTOM_LEFT}));

    var logTmpPt = new BMap.Point(data.emsSucEvent.longitude, data.emsSucEvent.latitude);
    var tmpMarkIcon = new BMap.Icon(BASE_URL + "images/map/icon/shigudian.svg", new BMap.Size(60, 60),
	     {
	        imageSize: new BMap.Size(60, 60)// 引用图片实际大小
	     });
    var tmpMarker = new BMap.Marker(logTmpPt, {
        "title": data.emsSucEvent.eventname,
        "icon": tmpMarkIcon
    });
	//加载低浓度覆盖物
	if (data.lowPts && 0 < data.lowPts.length) {
	    var lowPtArr = [];
	    _.map(data.lowPts, function (lowPt, i) {
	        lowPtArr.push(new BMap.Point(lowPt.lng, lowPt.lat));
	    });
	    var lowPoly = new BMap.Polygon(lowPtArr, {"fillColor": "#16e787"});
	    map.addOverlay(lowPoly);
	}
	
	//加载中等浓度覆盖物
	if (data.midPts && 0 < data.midPts.length) {
	    var midPtArr = [];
	    _.map(data.midPts, function (midPt, i) {
	        midPtArr.push(new BMap.Point(midPt.lng, midPt.lat));
	    });
	
	    var midPoly = new BMap.Polygon(midPtArr, {"fillColor": "#f0ff4a"});
	    map.addOverlay(midPoly);
	}

	//加载高浓度覆盖物
	if (data.highPts && 0 < data.highPts.length) {
	    var highPtArr = [];
	    _.map(data.highPts, function (highPt, i) {
	        highPtArr.push(new BMap.Point(highPt.lng, highPt.lat));
	    });
	
	    var highPoly = new BMap.Polygon(highPtArr, {"fillColor": "#fc5b6a"});
	    map.addOverlay(highPoly);
	}
	
    if (data.sucPlaceList && 0 < data.sucPlaceList.length) {
//    	//判断所有防护场所是否有点位在覆盖物内
//        var hasPtInPoly = false;
        //遍历所有防护场所
        _.map(data.sucPlaceList, function (tmpPlace, index) {
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
	        var tmpMarkers = new BMap.Marker(logTmpPt, tmpMarkerOpt);
	        //将点位存储至map集合工具类中
	        evnAnaPtDic.put(tmpPlace.placeid, {
	            "data": tmpPlace,
	            "marker": tmpMarkers,
	            "click": function () {
//	                map.panTo(tmpPt);
	              //点位跳动
	                tmpMarkers.setAnimation(BMAP_ANIMATION_BOUNCE);
	            }
	        });
	        //将点位添加至地图
	        map.addOverlay(tmpMarkers);
        });
    }
	map.addOverlay(tmpMarker);
    return map;
}

function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

/**
 * 点击资源方式
 * @param resId 资源id
 */
function makePointMaker(evnAnaPtDic,resId){
	evnAnaPtDic.get(resId).click();
}

// 刷新滚动条
function scrollResize() {
    $('.allArea').niceScroll({
        cursorborder: "#4d86d6",
        cursorcolor: "#4d86d6",
        background: false,
        autohidemode: false
    }).resize();
    $('.mncsDiv').niceScroll({
        cursorborder: "#4d86d6",
        cursorcolor: "#4d86d6",
        background: false,
        autohidemode: false
    }).resize();
}