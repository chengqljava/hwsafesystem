/**
 * 初始化实时曲线的相关配置
 */
function initRealTime() {
    /**
     * 帮助按钮点击事件
     */
    $("#wsHelpIcon").off("click").on("click", function () {
        $("#notes").show();
    });
    /**
     * 隐藏帮助
     */
    $("#hideHelpBtn").off("click").on("click", function () {
        $("#notes").hide();
    });
}
/**
 * Created by Administrator on 2017/10/9.
 */
$(function() {
	//获取当前所选企业id
//	var loadIndex = layer.load();
	var businessinfoid = getQueryString("businessinfoid");
	//初始化摄像头区域尺寸
//    $("#box").width($(window).width());
//	$("#plugin").width($(window).width() - 200);
	
    //获取企业平面图
//    var monitorinfo = new MonitorInfo();
//    monitorinfo.loadAlarmStatis(businessinfoid);
//    window.state = "-1";
//    var monitorData = new MonitorData(businessinfoid);
//    var datas =  monitorData.updateGrid(window.state);
//    monitorData.initProbePoint(datas);
//
//     var refreshProbeList =  setInterval(function () {
//        monitorData.updateGrid(window.state);
//    }, 5000);
    //初始化加载视频摄像信息
    //var monitorVideo = new MonitorVideo(businessinfoid);
    $("#vidCenter").show();
    updateGridVideo(businessinfoid);
    //monitorVideo.updateGrid();
//    layer.close(loadIndex);
//    initRealTime();
//    $("#dqdiv").show();
//    $("#lsdiv").hide();
});

/**
 * 显示监控视频界面
 * @param videoid
 * @param rowId
 * @param entid
 */
function showVideoDiv(videoid, videoname, callback) {
    $("#plugin").remove();
//    $("#box").append("<object id='plugin' type='application/x-webvideopluginzw'> </object>");
    //调整大小
//    $("#vidCenter").css({
//        "height": window.leftTopDivHeight,
//        "width": window.leftTopDivWidth
//    });
    $(".header").html("<span class='headerTitle'>" + videoname + "-摄像头</span>");
    $("#vidCenter").show();
    $("#dataDiv").hide();
    $(".contentArea").hide();
//    window.videoinfo = new MonitorVideo();
//    window.cameraObj = window.videoinfo.loadVideo(videoid);
  //获取摄像头信息
    var data =monitordatas.loadVideoInfo(videoid);
    var previewXml;
    //拼接参数
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
    console.log(previewXml);
    
    try {
    	//初始化摄像头页面
    	init();
    	//预览
    	StartPlayView(previewXml);
    } catch (e) {
		// TODO: handle exception
    	layer.confirm("插件没有安装,请下载安装", {
            btn: ['下载', '取消'], //按钮
            shade: false //不显示遮罩
        }, function (index) {
            window.location.href = BASE_URL + "/monitor/macmonitormap/downloadWebVideo";
            layer.close(index);
        });
        return;
	}
    
    
    
    //执行回调
    if (callback) {
    	callback();
    }
}

/**
 * 获取父级页面传递过来的参数
 * @param name
 * @returns
 */
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)return unescape(r[2]);
    return null;
}