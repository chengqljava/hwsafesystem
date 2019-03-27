$(function () {
	var isDisplay = getQueryString("isDisplay");
	if(isDisplay == 'false'){
		$(".footer").show();
	}
	//初始化地图展示的高度
	$("#mapTag").height(window.top.innerHeight);
	var map;
	//初始化加载地图组件并加载默认点位
	map = initMap();
	initMapPts(map);

});

function initMapPts(map){
	var index = parent.parent.getParentIndex();
	var maptab = parent.parent.frames["layui-layer-iframe"+index].$("#maptab").val();
	drawoverlays = [];
	var lineTag = "";
	if(maptab != null && maptab != ''){
		lineTag = maptab.replace(/\\'/g, '"');
		var lineArrs = lineTag.split("-");
		$.each(lineArrs,function(i,line){
			if(line != null && line != ''){				
				var jsonObj = JSON.parse(line);
				var jsonArr = [];
				var lineArr = [];
				for (var i = 0; i < jsonObj.length; i++) {
					jsonArr[i] = jsonObj[i];
					var point = new BMap.Point(jsonArr[i].lng, jsonArr[i].lat);
					lineArr.push(point);
				}
				var styleOptions = {
						strokeColor: "blue",    //边线颜色。
						fillColor: "blue",      //填充颜色。当参数为空时，圆形将没有填充效果。
						strokeWeight: 3,       //边线的宽度，以像素为单位。
						strokeOpacity: 0.8,    //边线透明度，取值范围0 - 1。
						fillOpacity: 0.6,      //填充的透明度，取值范围0 - 1。
						strokeStyle: 'solid' //边线的样式，solid或dashed。
				}
				var polyline = new BMap.Polyline(lineArr ,styleOptions);
				drawoverlays.push(polyline);
				map.addOverlay(polyline);
			}
		});
	}
    $(".fdiv").on('click',function(){
    	$(".big_map_bottom").hide();
    	var styleOptions = {
                strokeColor:"red",    //边线颜色。
                fillColor:"red",      //填充颜色。当参数为空时，圆形将没有填充效果。
                strokeWeight: 3,       //边线的宽度，以像素为单位。
                strokeOpacity: 0.8,	   //边线透明度，取值范围0 - 1。
                fillOpacity: 0.6,      //填充的透明度，取值范围0 - 1。
                strokeStyle: 'solid' //边线的样式，solid或dashed。
            }
    	//实例化鼠标绘制工具
        var drawingManager = new BMapLib.DrawingManager(map, {
            isOpen: false, //是否开启绘制模式
            enableDrawingTool: false, //是否显示工具栏
            drawingToolOptions: {
                anchor: BMAP_ANCHOR_TOP_RIGHT, //位置
                offset: new BMap.Size(5, 5), //偏离值
            },
            polylineOptions: styleOptions //线的样式
        });
    	var overlaycomplete = function(e){
            drawoverlays.push(e.overlay);
            pointArray = e.overlay.getPath();
            lineTag = lineTag + '-' + JSON.stringify(pointArray);
            drawingManager.close();
            $(".big_map_bottom").show();
        };
    	if("huaxian" == $(this).attr("data-id")){
            drawingManager.addEventListener('overlaycomplete', overlaycomplete);
            drawingManager.setDrawingMode(BMAP_DRAWING_POLYLINE);
            drawingManager.open();
        }else if("qingchu"==$(this).attr("data-id")){
            if(drawoverlays){
                if(drawoverlays.length>0){
                    _.map(drawoverlays,function(item){
                       map.removeOverlay(item);
                    });
                    lineTag = "";
                }
            }
        }
    })
	
	//绑定保存按钮事件
	$(".big_map_bottom_button_red").off("click").on("click", function() {
		window.top.GEventObject.fireEvent("LOAD_BDMAPPT_EVENT", {
			"lineArray": lineTag
		});
		//弹出提示，关闭窗口
		$(".big_map_bottom").hide();
		$(".big_map_bottom_info").show().css("visibility", "visible");
		setTimeout(function() { 
			parent.closeWin(); //关闭弹出框	
	    }, 500);
	})
}

/**
 * 初始化达拉特地图
 * @returns {BMap.Map}
 */
function initMap(){
	//地图本地根据IP地址定位以及添加标尺(禁止点击地图上的地点弹出百度详情)
	var map = new BMap.Map("mapTag", {enableMapClick: false}); // 创建Map实例
	var lastLng = 116.87;
	var lastLat = 37.18;
	map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放
    $.getJSON(BASE_URL + "/config/gisDefaultLocation.json",function(data){
        if(data){
            lastLng = data.longitude;
            lastLat = data.latitude;
            map.centerAndZoom(new BMap.Point(lastLng,lastLat), 15);
        }
    });
	//默认中心位置为达拉特


	return map;
}

function getQueryString(name){
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}
