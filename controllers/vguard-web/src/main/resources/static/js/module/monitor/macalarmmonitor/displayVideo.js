
var VideoInfo = function(){

};
	
$(document).ready(function() {
	
	showVideo();

});



function showVideo(){
	$.ajax({
		type : 'post',
		url : BASE_URL+'/monitor/macalarmmonitor/getVideo',
		cache : false,
		dataType : 'json',
		data : { probeForVideo : $("#probeid").val() },
		global : false,
		success : function(json) {
			VideoInfo.cameraObj = $("#plugin").loadCamera({
											"ip":json.macVideohost.ipaddr,
											"port":json.macVideohost.port,
											"username":json.macVideohost.username,
											"password":json.macVideohost.password,
											"channel":json.videonum,
											"brand":json.brandid,
											"width":($(window).width() - 205),
											"height":($(window).height()*0.6 - 40)
										});
			if(!VideoInfo.cameraObj.isInstall()){
				layer.confirm("插件没有安装,请下载安装!", {
	                btn: ['下载','取消'], //按钮
	                shade: false //不显示遮罩
	            }, function(index){
	                window.location.href = BASE_URL+"/monitor/macmonitormap/downloadWebComponentsZW";
	                layer.close(index);
	            });
	            return;
			}						
			VideoInfo.cameraObj.play();//播放
		},
		error : function() {
		}
	});
	
}


