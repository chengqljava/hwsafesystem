var flag = true;
$(function () {
	//用于区分是否第一次加载海康视频
	window.is8200FirstLoad = 1;
	window.is8700FirstLoad = 1;
	
	//默认加载政府高空聊望视频列表
	initVideoList(function(firstVideo) {
		//加载默认第一个点位视频
		if (firstVideo) {
		 	//默认初始化加载第一个视频点位
		 	showVideo(firstVideo.VIDEOID, firstVideo.VIDEONAME, firstVideo.HIKPLATNUM,
		 			  firstVideo.STRDOMAINCODE, firstVideo.STRDEVICECODE, firstVideo.STRCHANNELCODE, firstVideo.STRSTREAMCODE, firstVideo.HYPLAYPORT, firstVideo.IPADDR);
		}
	});
	
	//初始化视频列表
//	initVideoList();
//	 try{
//		 initBady();
//		/*$("#titContent").html("");
//		$("#titContent").append('<font style="color: white;font-size: 20px">请点击查看观看视频监控</font>');
//		$("#titContent").addClass("noRes");
//		$("#objDiv").show();*/
//		 
//		$("#titContent").html("");
//		$("#titContent").append('<font style="color: white;font-size: 20px">暂未接入视频</font>');
//		$("#titContent").addClass("noSource");
//		$("#objDiv").show();
//	  }catch (e) {
//		flag = false
////	    parent.toast("视频监控初始化失败!请使用IE10.0或以上版本");
//		$("#titContent").html("");
//		$("#titContent").append('<font style="color: white;font-size: 20px">请使用IE10.0及其以上版本查看视频监控</font>');
//		$("#titContent").addClass("ieClass");
//		$("#objDiv").show();
//	  }
});


function initHik8200() {
	var OCXobj = document.getElementById("PlayViewOCX");
	
	//设置窗口交互个数
	1 == window.is8200FirstLoad && OCXobj.SetWndNum(1);//窗口个数
	window.is8200FirstLoad = 0;
//	OCXobj.SetWndNum(1);//窗口个数
	OCXobj.SetOcxMode(0);
//	OCXobj.SetCapturParam("C:\\pic",0);//图片保存路径，格式
	OCXobj.SetPicDiskMinSize(1);
}
//function initBady(){
//	var OCXobj = document.getElementById("PlayViewOCX");
//	OCXobj.SetOcxMode(0);
//	OCXobj.SetWndNum(1);//窗口个数
////	OCXobj.SetCapturParam("C:\\pic",0);//图片保存路径，格式
//	OCXobj.SetPicDiskMinSize(1);
//}

/**
 * 按企业查询
 */
function seachVideo(){
	/*$("#videoCount").html(0);
	$("#videolist").append("暂无视频设备数据！")*/
//	$("#videolist").html("");
//	initVideoList();
	//默认加载政府高空聊望视频列表
	initVideoList(function(firstVideo) {
		//加载默认第一个点位视频
		if (firstVideo) {
		 	//默认初始化加载第一个视频点位
		 	showVideo(firstVideo.VIDEOID, firstVideo.VIDEONAME, firstVideo.HIKPLATNUM, 
		 			  firstVideo.STRDOMAINCODE, firstVideo.STRDEVICECODE, firstVideo.STRCHANNELCODE, firstVideo.STRSTREAMCODE, firstVideo.HYPLAYPORT, firstVideo.IPADDR);
		}
	});
}

function reset(){
	$("#orgname").val("");
}

/**
 * 初始化视频列表
 */
function initVideoList(callBack){
	//清空历史数据表格
	$("#videolist").empty();
	
	$.ajax({
		type: 'post',
		url: BASE_URL + '/monitor/macmonitormap/loadMacVideoList',
		cache: false,
		dataType: 'json',
		data: {
			"orgname": $("#orgname").val(),
			"isgov": "1",
			"govvideotype": "1"
		},
		success: function (data) {
//			data.length=0;
			$("#videoCount").html("0");
			if (data.length > 0) {
				$("#videoCount").html(data.length);
				$.each(data, function(n,videoInfo) {
					$("#videolist").append("<tr>" +
							"<td title="+videoInfo.ORGNAME+">"+videoInfo.ORGNAME+"</td>" +
							"<td title="+videoInfo.VIDEONAME+">"+videoInfo.VIDEONAME+"</td>" +
							'<td><a onclick="showVideo(\'' + videoInfo.VIDEOID + '\',\'' + videoInfo.VIDEONAME +'\',\'' + videoInfo.HIKPLATNUM +'\',\'' + videoInfo.STRDOMAINCODE +'\',\'' + videoInfo.STRDEVICECODE +'\',\'' + videoInfo.STRCHANNELCODE +'\',\'' + videoInfo.STRSTREAMCODE +'\',\'' + videoInfo.HYPLAYPORT +'\',\'' + videoInfo.IPADDR + '\');"' +
							' href="javascript:void(0);">查看</a></td>' +
							//'<td><a onclick="showVideo(\'' + videoInfo.VIDEOID + '\',\'' + videoInfo.VIDEONAME +'\',\'' + videoInfo.HIKPLATNUM +'\')" href="javascript:void(0);">查看</a></td>' +
							"</tr>");
				});
				
				$('#videolist').niceScroll({
			        cursorborder: "#4d86d6",
			        cursorcolor: "#4d86d6",
			        background: "#c7c7c7",
			        horizrailenabled: false,
			        autohidemode: false
			    }).show().resize();
				
				//判断当前浏览器是否IE浏览器
				var browserAg = navigator.userAgent.toString().toLowerCase();
				if (browserAg.indexOf("firefox") != -1 || browserAg.indexOf("chrome") != -1) {
					$("#titContent").html("");
					$("#titContent").append('<font style="color: white;font-size: 20px">请使用IE10.0及其以上版本查看视频监控</font>');
					$("#titContent").addClass("ieClass");
					$("#objDiv").show();
					return;
				}
				
				//执行回调函数
				if (callBack) {
					callBack(data[0]);
				}
			} else {
				$("#titContent").html("");
				$("#titContent").append('<font style="color: white;font-size: 20px">暂未接入视频</font>');
				$("#titContent").addClass("noSource");
				$("#objDiv").show();
				return;
			}
		},
		error : function() {
			parent.toast("加载失败");
			return;
		}
	});
}

function showVideo(videoid, videoname, hikplatnum, strdomaincode, strdevicecode, strchannelcode, strstreamcode, hyplayport, ipaddr) {
	var browserAg = navigator.userAgent.toString().toLowerCase();
 	if (browserAg.indexOf("firefox") != -1 || browserAg.indexOf("chrome") != -1) {
 		$("#titContent").html("");
		$("#titContent").append('<font style="color: white;font-size: 20px">请使用IE10.0及其以上版本查看视频监控</font>');
		$("#titContent").addClass("ieClass");
		$("#objDiv").show();
		return;
 	}
	
	$("#videoname").html(videoname);
	
	//播放视频
	var curClkVideoCnt = parseInt($("#clkVideoCnt").val());
    if (1 == curClkVideoCnt) {
    	//首次查看视频
    	$("#objDiv").show();
    	setTimeout(function() {
    		if (hikplatnum) {
    			playVideoByType(hikplatnum, videoid, strdomaincode, strdevicecode, strchannelcode, strstreamcode, hyplayport, ipaddr);
    		}
    	}, 500);
    	
    	$("#clkVideoCnt").val(++curClkVideoCnt);
    } else {
    	if (hikplatnum) {
    		playVideoByType(hikplatnum, videoid, strdomaincode, strdevicecode, strchannelcode, strstreamcode, hyplayport, ipaddr);
		}
    }
}

/**
 * 根据海康视频类型播放视频
 * @param hikplatnum
 * @param videoid
 */
function playVideoByType(hikplatnum, videoid, strdomaincode, strdevicecode, strchannelcode, strstreamcode, hyplayport, ipaddr) {
	if ("8200" == hikplatnum) {
		$("#spvViewOCX, #hyPlayer").hide();
 		$("#PlayViewOCX").show();
// 		$("#spvViewOCX, .blg8700").hide();
// 		$("#PlayViewOCX, .blg8200").show();
 		
 		//初始化hik8200平台视频播放器
 		try {
 			initHik8200();
 			$("#objDiv").hide();
 		} catch(e) {
 			$("#titContent").html("");
			$("#titContent").append("<font style='color: white;font-size: 20px'>插件没有安装,请<a href='" + BASE_URL + "/monitor/macmonitormap/downloadWebVideo?type=8200'>下载</a>安装</font>");
			$("#titContent").addClass("noPlug");
			$("#objDiv").show();
 			return;
 		}
		
		//获取摄像头信息
	    var data = monitordatas.loadVideoInfo(videoid);
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
//	    $("#videoXmlInfo").val(previewXml);
//	    console.log(previewXml);
	    try {
	    	//获取当亲空闲窗口
	    	var OCXobj = document.getElementById("PlayViewOCX");
//	    	var lWndIndex = OCXobj.GetFreePreviewWnd();
//	    	console.log(lWndIndex);
//	    	if (lWndIndex == -1) {
//	    		StartPlayView(previewXml,0);
//			}else{
//				StartPlayView(previewXml,lWndIndex);
//			}
	    	OCXobj.StartTask_Preview_FreeWnd(previewXml);
	    } catch (e) {
	    	$("#titContent").html("");
			$("#titContent").append("<font style='color: white;font-size: 20px'>插件没有安装,请<a href='" + BASE_URL + "/monitor/macmonitormap/downloadWebVideo?type=8200'>下载</a>安装</font>");
			$("#titContent").addClass("noPlug");
			$("#objDiv").show();
	        return;
		}
	} else if ("8700" == hikplatnum) {
		//87平台视频加载
		$("#PlayViewOCX, #hyPlayer").hide();
		$("#spvViewOCX").show();
//		$("#PlayViewOCX, .blg8200").hide();
//		$("#spvViewOCX, .blg8700").show();
//		alert("8200" + $(".blg8200").css("display"));
//		alert("8700" + $(".blg8700").css("display"));
		
		//初始化调用海康8700平台视频基本配置参数
		try {
			if (!window.spvxOcx) {
				window.spvxOcx = document.getElementById("spvViewOCX");
			}
			initHik8700(window.spvxOcx);
			$("#objDiv").hide();
			
			//设置窗口交互个数
			(1 == window.is8700FirstLoad) && (window.spvxOcx.MPV_SetPlayWndCount(1));//窗口个数
			window.is8700FirstLoad = 0;
//			window.spvxOcx.MPV_SetPlayWndCount(1);
		} catch(e) {
			$("#titContent").html("");
			$("#titContent").append('<font style="color: white;font-size: 15px">插件没有安装,请<a href="'+BASE_URL+'/monitor/macmonitormap/downloadWebVideo?type=8700">下载</a>安装</font>');
			$("#titContent").addClass("noPlug");
			$("#objDiv").show();
			return;
		}
		
		//查询海康8700平台视频点位预览报文
		$.ajax({
			type: "post",
			url: BASE_URL + "monitor/macvideo/loadEsVideoXml",
			dataType: "json",
			data: {"videoid": videoid},
			success: function(retData) {
				if (retData) {
					if ("" != retData.esVideoXml) {
//						console.log(retData.esVideoXml);
						try {
//							var spvxOcx = document.getElementById("spvViewOCX");
							var ret = window.spvxOcx.MPV_StartPreview(retData.esVideoXml);
//							alert("结果" + ret);
						} catch(e) {
							$("#titContent").html("");
							$("#titContent").append('<font style="color: white;font-size: 15px">插件没有安装,请<a href="'+BASE_URL+'/monitor/macmonitormap/downloadWebVideo?type=8700">下载</a>安装</font>');
							$("#titContent").addClass("noPlug");
							$("#objDiv").show();
							return;
						}
					} else {
						$("#titContent").html("");
						$("#titContent").append('<font style="color: white;font-size: 15px">插件没有安装,请<a href="'+BASE_URL+'/monitor/macmonitormap/downloadWebVideo?type=8700">下载</a>安装</font>');
						$("#titContent").addClass("noPlug");
						$("#objDiv").show();
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
						$("#objDiv").hide();
						
						
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
	 		$("#hyPlayer").hide();
	 		$("#titContent").html("");
	 		$("#titContent").append('<font style="color: white;font-size: 15px">插件没有安装,请<a href="'+BASE_URL+'/monitor/macmonitormap/downloadWebVideo?type=hy&filename=HYMBEClient_Setup">下载</a>安装</font>');
	 		$("#titContent").addClass("noPlug");
	 		$("#objDiv").show();
	 		return;
		}
	} else if ("NVR" == hikplatnum) {
		//待续NVR设备
		
	} else {
		//待续其它接入方式
	}
}