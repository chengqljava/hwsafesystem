$(function (){
	var recfile = getUrlParam("recfile");
	var warnalarmtitle = getUrlParam("warnalarmtitle");
//	var phonerecordid = getQueryString("phonerecordid");
	
	var ua = navigator.userAgent.toLowerCase();
    //firfox/chrome/safari
    if(ua.match(/firefox\/([\d.]+)/) || ua.match(/chrome\/([\d.]+)/) || ua.match(/version\/([\d.]+).*safari/)){
    	$("#playArea").empty().html('<audio id="audioplayer" src="'+recfile+'" type="audio/wav" autoplay="autoplay" controls="controls" style="width: 500px;height: 40px;margin: 10px;"></audio>');
//    	$geo("divPlayAll").innerHTML ='<audio id="audioplayer" src="'+str_rec+'" type="audio/wav" autoplay="autoplay" controls="controls"  style="width:500px;height:40px"></audio>';
    }else{
    	$("#playArea").empty().html('<embed id="audioplayer" src="'+recfile+'" type="audio/wav"  loop="false" autoplay="true" style="width: 500px;height: 40px;margin: 10px;"></embed>');
//    	$geo("divPlayAll").innerHTML ='<embed id="audioplayer" src="'+str_rec+'" type="audio/wav"  loop="false" autoplay="true" width="500px" height="40px"></embed>';
    }
	
//	var wheight = $(window).height()/2;
//	var areaHeight = $('#jp_container_1').height()/2;
//	$('#jPlayerArea').css('padding-top',wheight - areaHeight)
//	$("#jquery_jplayer_1").jPlayer({
//		ready: function (event) {
//			$("#jquery_jplayer_1").jPlayer("setMedia", {
//				title: warnalarmtitle,
//				m4a: recfile
//			}).jPlayer("play");
//		},
//		swfPath: BASE_URL + "js/lib/jPlayer-master/dist/jplayer",
//		supplied: "m4a",
//		wmode: "window",
//		useStateClassSkin: true,
//		autoBlur: false,
//		smoothPlayBar: true,
//		keyEnabled: true,
//		remainingDuration: true,
//		toggleDuration: false
////		fullScreen: true,
////		loop: false
////		sizeFull:{width:"100%",height:"100%",cssClass:"fullvideo"}
////		size: {"width": ($(window).width() * 0.9 + "px")}
//	});
	
//查询
//    $.ajax({
//        type: "post",
//        url: BASE_URL + "ems/emsdutyphonerecord/load",
//        dataType: "json",
//        data: {
//        	phonerecordid: phonerecordid
//        },
//        success: function (data) {
//            if (data) {
//            	console.log(data);
//            	var httpurl = location.protocol + "//" + location.host + "/";
//            	var fileUrl = data.recfile;
//            	var arr = fileUrl.split("/");
//            	var recordTitle = arr[3];
//            	var wheight = $(window).height()/2;
//            	var areaHeight = $('#jp_container_1').height()/2;
//            	$('#jPlayerArea').css('padding-top',wheight - areaHeight)
//            	$("#jquery_jplayer_1").jPlayer({
//            		ready: function (event) {
//            			$(this).jPlayer("setMedia", {
//            				title: recordTitle,
//            				mp3: httpurl+"zwsafe_uploadFiles"+fileUrl
//            			}).jPlayer("play");
//            		},
//            		swfPath: BASE_URL + "js/lib/jPlayer-master/dist/jplayer",
//            		supplied: "mp3",
//            		wmode: "window",
//            		useStateClassSkin: true,
//            		autoBlur: false,
//            		smoothPlayBar: true,
//            		keyEnabled: true,
//            		remainingDuration: true,
//            		toggleDuration: false,
//            		fullScreen: true,
//            		loop: false
////            		sizeFull:{width:"100%",height:"100%",cssClass:"fullvideo"}
////            		size: {"width": ($(window).width() * 0.9 + "px")}
//            	});
//            }
//        },
//        error: function () {
//            parent.toast("初始化信息加载失败");
//        }
//    });
});

//function getQueryString(name) {
//    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
//    var r = window.location.search.substr(1).match(reg);
//    if (r != null) return unescape(r[2]);
//    return null;
//}

//获取含有中文编码的url后缀参数值
function getUrlParam(name){
    // 用该属性获取页面 URL 地址从问号 (?) 开始的 URL（查询部分）
    var url = window.location.search;
    // 正则筛选地址栏
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    // 匹配目标参数
    var result = url.substr(1).match(reg);
    //返回参数值
    return result ? decodeURIComponent(result[2]) : null;
}