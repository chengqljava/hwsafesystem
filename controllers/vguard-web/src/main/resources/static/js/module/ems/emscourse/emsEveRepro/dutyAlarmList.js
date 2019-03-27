$(function() {	
//	loadDutyAlarm(1);
});

function loadDutyAlarm(page){
	var eventid = $("#eventid").val();
	$.ajax({
		type : "post",
		url : BASE_URL + "/ems/emsdutyalarm/list",
		dataType : "json",
		data : {
			eventid: eventid,
			page:page || 1,
			rows: 5,
			sidx: "alarmtime",
			sord: "asc"
		},
		success : function(data) {
            if (data) {
            	if(data.datas.length>0){            		
            		var dutyAlarmTpt = _.template($("#dutyAlarmTpt").html());
            		$(".zsjjAllInfo").html(dutyAlarmTpt(data));
            		_.each(data.datas,function(item,i){
            			initAlarmMap(i,item);
            		});
            	} else {
            		var message = '<div style="margin:10px">暂无接警信息'+
            		'</div>'
            		$(".zsjjAllInfo").html(message);
            	}
            } 
		    Page({
		        num: data.total, //页码数
		        startnum: page, //指定页码
		        elem: $('#zsjjPage'), //指定的元素
		        callback: function (n) { //回调函数 n 为当前页码        	
		        	loadDutyAlarm(n);
		        }
		    })
		},
		error : function() {
			parent.toast("初始化信息加载失败!");
		}
	});
}

/**
 * 详细查看场所类型
 */
function displayDutyAlarm(warnalarmid) {
    //返回当前grid中复选框所选择的数据的id
    parent.openWin(BASE_URL + "views/module/ems/emsdutyalarm/emsdutyalarmDisplay.html?warnalarmid=" + warnalarmid,
        "警情信息详情", "50%", "40%");
}

function initAlarmMap(index,item) {
	var mapOne = "map"+index;
    //地图本地根据IP地址定位以及添加标尺(禁止点击地图上的地点弹出百度详情)
    var map = new BMap.Map(mapOne, {enableMapClick: false, minZoom: 6, maxZoom: 18}); // 创建Map实例
    map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放

    //默认中心位置
    map.centerAndZoom(new BMap.Point(item.LONGITUDE, item.LATITUDE), 13);

    //左下角添加比例尺控件
    map.addControl(new BMap.ScaleControl({anchor: BMAP_ANCHOR_BOTTOM_LEFT}));

    var tmpPt = new BMap.Point(item.LONGITUDE, item.LATITUDE);
    var tmpMarkIcon = new BMap.Icon(BASE_URL + "images/map/icon/shigudian.svg", new BMap.Size(60, 60),
	     {
	        imageSize: new BMap.Size(60, 60)// 引用图片实际大小
	     });
    var tmpMarker = new BMap.Marker(tmpPt, {
        "title": item.ENTNAME,
        "icon": tmpMarkIcon
    });

//    tmpMarker.setAnimation(BMAP_ANIMATION_BOUNCE);
    map.addOverlay(tmpMarker);
    return map;
}