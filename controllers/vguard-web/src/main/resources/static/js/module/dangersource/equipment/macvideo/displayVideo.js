
var VideoInfo = function(){

};
	
$(document).ready(function() {
	
	showVideo();

});



function showVideo(){
	var videoid = $("#videoid").val();
    var data = monitordatas.loadVideoInfo(videoid);
	$('.videoPop').css('display','block');
	console.log(data);
	var previewXml;
	if (data) {
    	previewXml = "<?xml version='1.0' encoding='UTF-8'?>" +
			"<Message>" +
			    "<Camera>" +
			    	"<IndexCode>"+data[0].INDEXCODE+"</IndexCode>" +
			    "</Camera>" +
			    "<Dev regtype='6' devtype='"+data[0].DEVTYPE+"'></Dev>" +
			    "<Vag IP='"+data[0].VAGIP+"' Port='"+data[0].VAGPORT+"' />" +
			    	"<Media Protocol='0' Stream='0'>" +
			    		"<Vtdu IP='"+data[0].VTDUIP+"' Port='"+data[0].VTDUPORT+"' />" +
			    	"</Media>" +
			    "<Privilege Priority='1' Code='15' />" +
			    "<Option>" +
			    	"<Talk>1</Talk>" +
			    	"<PreviewType>0</PreviewType>" +
			    "</Option>" +
			"</Message>";
	}
	init();
    //预览
    StartPlayView(previewXml);

/*	VideoInfo.cameraObj = $("#plugin").loadCamera({
        "ip": data[0].IPADDR,
        "port": data[0].PORT,
        "username": data[0].USERNAME,
        "password": data[0].PASSWORD,
        "channel": data[0].VIDEONUM,
        "brand": data[0].BRAND,
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
*/}
/**
 * 初始化视频插件
 */
function init(){
	var OCXobj = document.getElementById("PlayViewOCX");
	OCXobj.SetOcxMode(0);
	OCXobj.SetWndNum(1);
}

/**
 * 实时预览
 */
function StartPlayView(previewXml){
    var OCXobj = document.getElementById("PlayViewOCX");
	var ret = OCXobj.StartTask_Preview_InWnd(previewXml,0);
}
