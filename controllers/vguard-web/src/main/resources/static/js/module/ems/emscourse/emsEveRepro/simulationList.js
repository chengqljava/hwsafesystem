
function loadSimulation(page){
	var eventid = $("#eventid").val();
	$.ajax({
		type : "post",
		url : BASE_URL + "/ems/emssucsimulation/loadbyeventid",
		dataType : "json",
		data : {
			eventid: eventid,
			page:page || 1,
			rows: 5,
			sidx: "CREATETIME",
			sord: "asc"
		},
		success : function(data) {
            if (data) {
            	if(data.datas.length>0){            		
            		console.log(data);
            		var simulationTpt = _.template($("#simulationTpt").html());
            		$(".sgmnAllInfo").html(simulationTpt(data));
            		_.each(data.datas,function(item,i){
            			initSimulationMap(i,item);
            		});
            	} else {
            		var message = '<div style="margin:10px">暂无模拟信息'+
            		'</div>'
            		$(".sgmnAllInfo").html(message);
            	}
            } 
		    Page({
		        num: data.total, //页码数
		        startnum: page, //指定页码
		        elem: $('#sgmnPage'), //指定的元素
		        callback: function (n) { //回调函数 n 为当前页码        	
		        	loadSimulation(n);
		        }
		    })
		},
		error : function() {
			parent.toast("初始化信息加载失败!");
		}
	});
}

/**
 * 详细查看
 */
function displaySimulation(simulationid) {
    //返回当前grid中复选框所选择的数据的id
    parent.openWin(BASE_URL + "views/module/ems/emscourse/evnanalog.html?simulationid=" + simulationid,
        "事故模拟详情", "55%", "65%");
}

function initSimulationMap(index,item) {
	var mapOne = "mapsimulation"+index;
    //地图本地根据IP地址定位以及添加标尺(禁止点击地图上的地点弹出百度详情)
    var simmap = new BMap.Map(mapOne, {enableMapClick: false, minZoom: 6, maxZoom: 18}); // 创建Map实例
    simmap.enableScrollWheelZoom(true); //开启鼠标滚轮缩放

    //默认中心位置
    simmap.centerAndZoom(new BMap.Point(item.LONGITUDE, item.LATITUDE), 12);
    
    //左下角添加比例尺控件
    simmap.addControl(new BMap.ScaleControl({anchor: BMAP_ANCHOR_BOTTOM_LEFT}));

    var simTmpPt = new BMap.Point(item.LONGITUDE, item.LATITUDE);
    var tmpMarkIcon = new BMap.Icon(BASE_URL + "images/map/icon/shigudian.svg", new BMap.Size(60, 60),
     {
        imageSize: new BMap.Size(60, 60)// 引用图片实际大小
     });
    var tmpMarker = new BMap.Marker(simTmpPt, {
        "title": item.ENTNAME,
        "icon": tmpMarkIcon
    });

//    tmpMarker.setAnimation(BMAP_ANIMATION_BOUNCE);
    
    simmap.addOverlay(tmpMarker);
    initEvnAnaMap(item,simmap,simTmpPt);
    return simmap;
}

/**
 * 初始化事故模拟地图各覆盖物加载
 * @param paraObj
 * @returns
 */
function initEvnAnaMap(item,map,simTmpPt) {
	//加载低浓度覆盖物
	if (item.LIGHTAREA && 0 < item.LIGHTAREA.length) {
	    var lowPtArr = [];
	    _.map(item.LIGHTAREA, function (lowPt, i) {
	        lowPtArr.push(new BMap.Point(lowPt.lng, lowPt.lat));
	    });
	    var lowPoly = new BMap.Polygon(lowPtArr, {"fillColor": "#16e787"});
	    map.addOverlay(lowPoly);
	}
	
	//加载中等浓度覆盖物
	if (item.MODERATEAREA && 0 < item.MODERATEAREA.length) {
	    var midPtArr = [];
	    _.map(item.MODERATEAREA, function (midPt, i) {
	        midPtArr.push(new BMap.Point(midPt.lng, midPt.lat));
	    });
	
	    var midPoly = new BMap.Polygon(midPtArr, {"fillColor": "#f0ff4a"});
	    map.addOverlay(midPoly);
	}

	//加载高浓度覆盖物
	if (item.SEVEREAREA && 0 < item.SEVEREAREA.length) {
	    var highPtArr = [];
	    _.map(item.SEVEREAREA, function (highPt, i) {
	        highPtArr.push(new BMap.Point(highPt.lng, highPt.lat));
	    });
	
	    var highPoly = new BMap.Polygon(highPtArr, {"fillColor": "#fc5b6a"});
	    map.addOverlay(highPoly);
	}
	
    if (item.emsPlace && 0 < item.emsPlace.length) {
        //遍历所有防护场所
        _.map(item.emsPlace, function (tmpPlace, index) {
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
	        var tmpMarkers = new BMap.Marker(simTmpPt, tmpMarkerOpt);
	        //将点位存储至map集合工具类中
//	        evnAnaPtDic.put(tmpPlace.placeid, {
//	            "data": tmpPlace,
//	            "marker": tmpMarkers,
//	            "click": function () {
//	                map.panTo(tmpPt);
//	              	//点位跳动
//	                tmpMarkers.setAnimation(BMAP_ANIMATION_BOUNCE);
//	            }
//	        });
	        //将点位添加至地图
	        map.addOverlay(tmpMarkers);
        });
    }

}