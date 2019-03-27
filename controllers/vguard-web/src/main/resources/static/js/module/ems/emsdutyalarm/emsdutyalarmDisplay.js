/*新增或编辑课程管理*/
$(function () {
    var warnalarmid = getQueryString("warnalarmid");
    //查询
    $.ajax({
        type: "post",
        url: BASE_URL + "ems/emsdutyalarm/load",
        dataType: "json",
        async: false,
        data: {
            warnalarmid: warnalarmid
        },
        success: function (data) {
            if (data) {
            	var dutyalarmTpt = _.template($("#dutyalarmTpt").html());
                $("#dutyalarmForm").html(dutyalarmTpt(data));
                $("#map").height($("#dutyalarmForm").height());
                initMap(data);
                $("#closeDisplay").css('display','block');     
                if(data.emsDutyPhonerecord == null){
                	
                } else {
                	var fileUrl = data.emsDutyPhonerecord.recfile;
                	if(fileUrl != null){                		
                		$("#playPhoneRecord").css('display','block');   
                		var url = location.protocol + "//" + location.host + "/"+"zwsafe_uploadFiles"+fileUrl;
                		var arr = fileUrl.split("/");
                		var recordTitle = arr[3];
                		playRecord(recordTitle,url);
                	}
                }
            }
        },
        error: function () {
            parent.toast("初始化信息加载失败");
        }
    });
    
});


function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}
function initMap(data) {

    //地图本地根据IP地址定位以及添加标尺(禁止点击地图上的地点弹出百度详情)
    var map = new BMap.Map("map", {enableMapClick: false, minZoom: 6, maxZoom: 18}); // 创建Map实例
    map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放

    // //修改地图显示样式
    // var mapStyle = [
    //     {
    //         "featureType": "water",
    //         "elementType": "all",
    //         "stylers": {
    //             "color": "#0b395aff"
    //         }
    //     },
    //     {
    //         "featureType": "highway",
    //         "elementType": "geometry.fill",
    //         "stylers": {
    //             "color": "#21394aff"
    //         }
    //     },
    //     {
    //         "featureType": "highway",
    //         "elementType": "geometry.stroke",
    //         "stylers": {
    //             "color": "#21394aff"
    //         }
    //     },
    //     {
    //         "featureType": "arterial",
    //         "elementType": "geometry.fill",
    //         "stylers": {
    //             "color": "#314a5cff"
    //         }
    //     },
    //     {
    //         "featureType": "arterial",
    //         "elementType": "geometry.stroke",
    //         "stylers": {
    //             "color": "#314a5cff"
    //         }
    //     },
    //     {
    //         "featureType": "local",
    //         "elementType": "geometry",
    //         "stylers": {
    //             "color": "#314a5cff"
    //         }
    //     },
    //     {
    //         "featureType": "land",
    //         "elementType": "all",
    //         "stylers": {
    //             "color": "#09101dff",
    //             "visibility": "on"
    //         }
    //     },
    //     {
    //         "featureType": "railway",
    //         "elementType": "geometry.fill",
    //         "stylers": {
    //             "color": "#999999ff",
    //             "visibility": "off"
    //         }
    //     },
    //     {
    //         "featureType": "railway",
    //         "elementType": "geometry.stroke",
    //         "stylers": {
    //             "color": "#444444ff",
    //             "visibility": "off"
    //         }
    //     },
    //     {
    //         "featureType": "subway",
    //         "elementType": "geometry",
    //         "stylers": {
    //             "lightness": -70
    //         }
    //     },
    //     {
    //         "featureType": "building",
    //         "elementType": "geometry.fill",
    //         "stylers": {
    //             "color": "#000000ff"
    //         }
    //     },
    //     {
    //         "featureType": "all",
    //         "elementType": "labels.text.fill",
    //         "stylers": {}
    //     },
    //     {
    //         "featureType": "all",
    //         "elementType": "labels.text.stroke",
    //         "stylers": {
    //             "color": "#000000ff",
    //             "visibility": "on"
    //         }
    //     },
    //     {
    //         "featureType": "building",
    //         "elementType": "geometry",
    //         "stylers": {
    //             "color": "#152a38ff"
    //         }
    //     },
    //     {
    //         "featureType": "green",
    //         "elementType": "geometry",
    //         "stylers": {
    //             "color": "#042203ff"
    //         }
    //     },
    //     {
    //         "featureType": "boundary",
    //         "elementType": "all",
    //         "stylers": {
    //             "color": "#0f7880ff"
    //         }
    //     },
    //     {
    //         "featureType": "manmade",
    //         "elementType": "geometry",
    //         "stylers": {
    //             "color": "#151c2aff",
    //             "visibility": "on"
    //         }
    //     },
    //     {
    //         "featureType": "poi",
    //         "elementType": "all",
    //         "stylers": {
    //             "visibility": "on"
    //         }
    //     },
    //     {
    //         "featureType": "all",
    //         "elementType": "labels.icon",
    //         "stylers": {
    //             "visibility": "off"
    //         }
    //     },
    //     {
    //         "featureType": "all",
    //         "elementType": "labels.text.fill",
    //         "stylers": {
    //             "color": "#3d85c6ff",
    //             "visibility": "on"
    //         }
    //     }
    // ];
    //
    // //设置地图样式
    // map.setMapStyle({styleJson: mapStyle});

    //默认中心位置为达拉特
    map.centerAndZoom(new BMap.Point(data.longitude, data.latitude), 11);

    //左下角添加比例尺控件
    map.addControl(new BMap.ScaleControl({anchor: BMAP_ANCHOR_BOTTOM_LEFT}));

    var tmpPt = new BMap.Point(data.longitude, data.latitude);

    var tmpMarker = new BMap.Marker(tmpPt, {
        "title": data.ENTNAME,
        "icon": new BMap.Icon(BASE_URL + "images/portal/icon_gisEnt.png", new BMap.Size(42, 56))
    });

    tmpMarker.setAnimation(BMAP_ANIMATION_BOUNCE);
    map.addOverlay(tmpMarker);
    return map;
}

function playRecord(recordTitle,url){
	 //播放器
	var wheight = $("#phoneRecord").height()/2;
	var areaHeight = $('#jp_container_1').height()/2;
	$('#jPlayerArea').css('padding-top',wheight - areaHeight);
	$("#jquery_jplayer_1").jPlayer({
		ready: function (event) {
			$(this).jPlayer("setMedia", {
				title: recordTitle,
				mp3: url
			}).jPlayer("play");
		},
		swfPath: BASE_URL + "js/lib/jPlayer-master/dist/jplayer",
		supplied: "mp3",
		wmode: "window",
		useStateClassSkin: true,
		autoBlur: false,
		smoothPlayBar: true,
		keyEnabled: true,
		remainingDuration: true,
		toggleDuration: false,
		fullScreen: true,
		loop: false
//		sizeFull:{width:"100%",height:"100%",cssClass:"fullvideo"}
//		size: {"width": ($(window).width() * 0.9 + "px")}
	});
}
