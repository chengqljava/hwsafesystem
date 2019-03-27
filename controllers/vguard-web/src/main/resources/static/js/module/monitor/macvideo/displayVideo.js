var VideoInfo = function(){};
$(function() {
	var browserAg = navigator.userAgent.toString().toLowerCase();
 	if(browserAg.indexOf("firefox") != -1 || browserAg.indexOf("chrome") != -1){
 		parent.toast("监控视频播放失败!请使用IE10.0或以上版本查看!");
 		return;
 	}
	showVideo();
});

var flag = true;
function showVideo() {
	var videoid = $("#videoid").val();
	var hikplatnum = $("#hikplatnum").val();
	var ipaddr = $("#ipaddr").val();
	var hyplayport = $("#hyplayport").val();
	var strdomaincode = $("strdomaincode").val();
	var strdevicecode = $("#strdevicecode").val();
	var strchannelcode = $("#strchannelcode").val();
	var strstreamcode = $("#strstreamcode").val();
	
	$('.videoPop').css('display','block');
	
	if ("8200" == hikplatnum) {
		 //82平台视频加载
		 $("#spvViewOCX, #hyPlayer").hide();
		 $("#PlayViewOCX").show();
//		$("#box").append("<object classid='clsid:D5E14042-7BF6-4E24-8B01-2F453E8154D7' id='PlayViewOCX' name='ocx'>" +
//       			"</object>");
		 try {
			var OCXobj = document.getElementById("PlayViewOCX");
		    	OCXobj.SetOcxMode(0);
		    	OCXobj.SetWndNum(1);//窗口个数
//		    	OCXobj.SetCapturParam("C:\\pic",0);//图片保存路径，格式
		    	OCXobj.SetPicDiskMinSize(1);
		    	
			//获取摄像头信息
			var data = monitordatas.loadVideoInfo(videoid);
//			alert(JSON.stringify(data));
			//拼接参数
			if (data) {
				var previewXml = "<?xml version='1.0' encoding='UTF-8'?>" +
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
				OCXobj.StartTask_Preview_InWnd(previewXml, 0);
			}
//			alert("previewXml" + previewXml);
		} catch(e) {
			$("body").append('<font style="color: white;font-size: 15px">插件没有安装,请<a href="' + BASE_URL + '/monitor/macmonitormap/downloadWebVideo?type=8200">下载</a>安装</font>');
			return;
		}
	} else if ("8700" == hikplatnum) {
		//87平台视频加载
		$("#PlayViewOCX, #hyPlayer").hide();
		$("#spvViewOCX").show();
		
		$.ajax({
			type: "post",
			url: BASE_URL + "/monitor/macvideo/loadEsVideoXml",
			dataType: "json",
			data: {"videoid": videoid},
			success: function(retData) {
				if (retData) {
//					alert("xml" + retData.esVideoXml);
					if ("" != retData.esVideoXml) {
							var spvxOcx = document.getElementById("spvViewOCX");
							//初始化调用海康8700平台视频基本配置参数
							spvxOcx.MPV_Init(1);
							spvxOcx.MPV_SetPlayWndCount(1);
							var localParam = "<?xml version='1.0' encoding='UTF-8'?>" + 
											 "<localParam>" +
											 " 	<picType>1</picType>" +         
											 " 	<capturePath>C:\Hikvision8700Cap</capturePath>" +   
											 " 	<recordSize>2</recordSize>" +
											 " 	<recordPath>C:\Hikvision8700Rec</recordPath>" +
											 " 	<limitPreviewTime>0</limitPreviewTime>" +
											 " 	<showMsgTip>1</showMsgTip>" +
											 "</localParam>";
							spvxOcx.MPV_SetLocalParam(localParam);
							
//							var spvxOcx = document.getElementById("spvViewOCX");
							var ret = spvxOcx.MPV_StartPreview(retData.esVideoXml);
//							alert("结果" + ret);
					} else {
						$("body").append('<font style="color: white;font-size: 15px">插件没有安装,请<a href="' + BASE_URL + '/monitor/macmonitormap/downloadWebVideo?type=8700">下载</a>安装</font>');
						return;
					}
				}
			},
			error: function(err) {
				parent.toast("系统繁忙，请稍后再试！");
			}
		});
	} else if ("HY" == hikplatnum) {
		//怀业平台视频预留点位
		$("#PlayViewOCX, #spvViewOCX").hide();
		$("#hyPlayer").show();
		
		jQuery.support.cors = true;
		
		//登录怀业系统
		try {
			var option = {
					id: "hyPlayer",
					height: "100%",
					width: "100%",
					classid: "clsid:210468B6-80D3-4CD0-921E-1AA99B8EB5AD"
					//codebase:"../UMP_OCX_V200R002B24(1,0,1,4).cab#version=1,0,0,4"
			};
			
			if (!window.myOcxMsg) {
				window.myOcxMsg = new initSDK(); 
				window.myOcxMsg._init_(option);
			}
			
			var ranHyName = hyRanUname(8, 2);
			var loginData = {
					SeqNo:7,  
					strUserID: "admin" + ranHyName,
					strUserName: "admin" + ranHyName,  
					strServerIP: ipaddr,
					nServerPort: parseInt(hyplayport),  
					success: function(data) {
						$.hy_log("登录成功" + JSON2.stringify(data));
						
						//停止上次的视频播放
				 		if (window.lastHyPlayer) {
				 			window.myOcxMsg.stopPlay({play: window.lastHyPlayer});
				 		}
				 		
				 		var mbedeviceShowlist = [];//数组变量
				 		var mbedeviceShowObj = {//声明对象
				 				serviceUrl: {
				 					strDomainCode: "",
				 					strDeviceCode:"",
				 					strChannelCode:"",
				 					strStreamCode:""
				 				},
				 				playParam: {}
				 		};
				 		
				 		mbedeviceShowObj.serviceUrl.strDomainCode = strdomaincode;
				 		mbedeviceShowObj.serviceUrl.strDeviceCode = strdevicecode;
				 		mbedeviceShowObj.serviceUrl.strChannelCode = strchannelcode;
				 		mbedeviceShowObj.serviceUrl.strStreamCode = strstreamcode;
				 		mbedeviceShowlist.push(mbedeviceShowObj);
				 		
				 		//登录播放器
				 		var initParam = {
				 				id: "hyPlayer",
				 				width: "100%",
				 				height: "100%",
				 				classid: "clsid:210468B6-80D3-4CD0-921E-1AA99B8EB5AD",
				 				ShowBarFullBtn: true,
				 				ShowPlayBar: true,
				 				ShowProgressBar: true,
				 				ShowAudioBar: true,
				 				ShowPlayPauseBtn:true,	
				 				ShowStretchBtn: true,
				 				ShowLayoutBtn: true
				 		};
				 		
				 		window.lastHyPlayer = window.myOcxMsg._playinit_("hyPlayer", $.extend({}, initParam, {id: "hyPlayer"}));
				 		window.lastHyPlayer.ShowBarFullBtn(1);
				 		
				 		var playParam = {
					 		    SeqNo: 5,
					 		    play: window.lastHyPlayer,
					 		    list: mbedeviceShowlist,
					 		    success: function(res){},
					 		    error: function(data) {
					 		    	$.hy_log("失败"+JSON2.stringify(data))
					 		    }
					 		};
					 	window.myOcxMsg.playliveIpc(playParam);
					},
					error:function(data) {
						$.hy_log("登录失败" + JSON2.stringify(data));
						if (data.nResultCode == "1720200002") {}
					},
					EventHandle: function(eventCode, errCode, data){
						$.hy_log(eventCode+"事件通知"+JSON2.stringify(data));
					}
			};
			window.myOcxMsg.login(loginData);
	 	} catch (e) {
	 		$("body").append('<font style="color: white;font-size: 15px">插件没有安装,请<a href="'+BASE_URL+'/monitor/macmonitormap/downloadWebVideo?type=hy&filename=HYMBEClient_Setup">下载</a>安装</font>');
	 		return;
		}
	} else if ("NVR" == hikplatnum) {
		//待续NVR设备
	} else {
		//待续其它接入方式
	}
//    var data = monitordatas.loadVideoInfo(videoid);
//	$('.videoPop').css('display','block');
//	console.log(data);
//	var previewXml;
//	if (data) {
//    	previewXml = "<?xml version='1.0' encoding='UTF-8'?>" +
//			"<Message>" +
//			    "<Camera>" +
//			    	"<IndexCode>"+data[0].INDEXCODE+"</IndexCode>" +
//			    "</Camera>" +
//			    "<Dev regtype='6' devtype='"+data[0].DEVTYPE+"'></Dev>" +
//			    "<Vag IP='"+data[0].VAGIP+"' Port='"+data[0].VAGPORT+"' />" +
//			    	"<Media Protocol='0' Stream='0'>" +
//			    		"<Vtdu IP='"+data[0].VTDUIP+"' Port='"+data[0].VTDUPORT+"' />" +
//			    	"</Media>" +
//			    "<Privilege Priority='1' Code='15' />" +
//			    "<Option>" +
//			    	"<Talk>1</Talk>" +
//			    	"<PreviewType>0</PreviewType>" +
//			    "</Option>" +
//			"</Message>";
//	}
//	try {
////		init();
//	} catch (e) {
//		parent.toast("监控视频播放失败!请使用IE10.0或以上版本查看!");
//		return;
//	}
    //预览
//	try {
//		StartPlayView(previewXml);
//	} catch (e) {
//		layer.confirm("插件没有安装,请下载安装", {
//            btn: ['下载', '取消'], //按钮
//            shade: false //不显示遮罩
//        }, function (index) {
//            window.location.href = BASE_URL + "/monitor/macmonitormap/downloadWebVideo";
//            layer.close(index);
//        });
//        return;
//	}

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
function init8200Plat(){
	
}

/**
 * 实时预览
 */
function Start8200PlayView(previewXml){
    
}
