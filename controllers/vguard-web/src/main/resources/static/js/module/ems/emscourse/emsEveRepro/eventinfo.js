
function loadEventInfo(){
	var id = $("#eventid").val();
	$.ajax({
		type : "post",
		url : BASE_URL + "/ems/emssucevent/load/"+id,
		dataType : "json",
		data : {
		},
		success : function(data) {
            if (data) {
                var eventInfoTpt = _.template($("#eventInfoTpt").html());
                $(".sgxxAllInfo").html(eventInfoTpt(data));
                initEventMap(data.event);
            }
		},
		error : function() {
			parent.toast("初始化信息加载失败!");
		}
	});
}

/**
 *下载附件
 */
function downloadEventAttach(attachid){
	var attachurl = BASE_URL + 'ems/emssucevent/download/'+attachid;
    $.ajax({
        type: 'post',
        url: attachurl,
        cache: false,
        dataType: 'json',
        success: function (data) {
            if (data.success == true) {
                window.location.href = attachurl;
            } else {
                parent.toast(data.msg);
            }
        },
        error: function () {
            parent.toast("网络异常");
        }
    });
}

function initEventMap(item) {
    //地图本地根据IP地址定位以及添加标尺(禁止点击地图上的地点弹出百度详情)
    var map = new BMap.Map("mapeventinfo", {enableMapClick: false, minZoom: 6, maxZoom: 18}); // 创建Map实例
    map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放

    //默认中心位置
    map.centerAndZoom(new BMap.Point(item.longitude, item.latitude), 14);

    //左下角添加比例尺控件
    map.addControl(new BMap.ScaleControl({anchor: BMAP_ANCHOR_BOTTOM_LEFT}));

    var eventTmpPt = new BMap.Point(item.longitude, item.latitude);
    var tmpMarkIcon = new BMap.Icon(BASE_URL + "images/map/icon/shigudian.svg", new BMap.Size(60, 60),
     {
        imageSize: new BMap.Size(60, 60)// 引用图片实际大小
     });
    var tmpMarker = new BMap.Marker(eventTmpPt, {
        "title": item.eventname,
        "icon": tmpMarkIcon
    });

//    tmpMarker.setAnimation(BMAP_ANIMATION_BOUNCE);
    map.addOverlay(tmpMarker);
    return map;
}