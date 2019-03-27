$.extend({
						/**
						 * ajax请求
						 */
						_ajax: function(opts){
							try{
								var _opts = $.extend({}, {
										async: true,  // 异步
										type: "POST",
										dataType: "JSON" // set all response data as json type
									}, opts);
								$.ajax({
									url: _opts.url,
									type: _opts.type,
									async: _opts.async,
									data: JSON2.stringify(_opts.data),
									dataType: _opts.dataType,
									beforeSend: function(xhr) {
									  xhr.setRequestHeader("Content-Type","application/json");
									}
								}).done(function(response, status, xhr) {
									if(opts.success && typeof opts.success == 'function'){
										opts.success(response);
									}
								}).fail(function(xhr) {
									if(opts.fail && typeof opts.fail == 'function'){
										opts.fail(xhr);
									}else{
									$.hy_log("ajax request [url = " + _opts.url + "] failed");
									}
								});
							}catch(e){
								
							}
						}
});

jQuery.support.cors = true;
$._ajax({
//	url : "http://123.160.220.41:9200/sie/httpjson/get_domain_list",
	url : "http://123.160.220.41:9200/sie/httpjson/get_domain_device_list",
//	url : "http://123.160.220.41:9200/sie/httpjson/get_domain_device_list",
	data : {
		"nPage": 1,
		"nSize": 10000,
		"strDomainCode": "005056806319"
	},
	success : function(ret) {
		console.log(JSON.stringify(ret));
		
	},
	fail:function(ret){
	}
});	

$(function() {
//		//默认加载政府园区视频列表
//		initVideoList(function(firstVideo) {
//			if (!warnIE()) {
//				try {
//					jQuery.support.cors = true;
//					
//					var option = {
//							id: "hyPlayer",
//							height: "100%",
//							width: "100%",
//							classid: "clsid:210468B6-80D3-4CD0-921E-1AA99B8EB5AD"
//							//codebase:"../UMP_OCX_V200R002B24(1,0,1,4).cab#version=1,0,0,4"
//					};
//					window.myOcxMsg = new initSDK(); 
//					window.myOcxMsg._init_(option);
//					
//					//临时处理用户重读登录问题-当关闭该窗口时退出登录操作
//					$(window).unload(function(){
//						if (window.myOcxMsg) {
//							window.myOcxMsg.logout({
//								SeqNo: 4,
//								success: function() {},
//								error: function() {}
//							});
//						}
//					}); 
//					
//					var ranHyName = hyRanUname(8, 2);
////					window.hasLogin = false;
//					var loginData = {
//							SeqNo:7,  
//							strUserID: "admin" + ranHyName,
//							strUserName: "admin" + ranHyName,  
//							strServerIP: window.strServerIP,
//							nServerPort: window.nServerPort,  
//							success: function(data) {
//								$.hy_log("登录成功" + JSON2.stringify(data));
//							},
//							error:function(data) {
//								$.hy_log("登录失败" + JSON2.stringify(data));
//								
//								if (data.nResultCode == "1720200002") {
////									window.hasLogin = true;
//									//如果有重复登录，就提出上次登录用户
////									window.myOcxMsg.logout({
////									    SeqNo:8,
////										success: function() {
//////											window.myOcxMsg.login(window.loginData); 
////										},
////										error: function() {}
////									});
//								}
//							},
//							EventHandle: function(eventCode, errCode, data){
//								$.hy_log(eventCode+"事件通知"+JSON2.stringify(data));
//							}
//					};
//					
//					window.myOcxMsg.login(loginData); 
//				} catch (e) {
//					warnHyOcx();
//				}
//				
//				//加载默认第一个点位视频
//				if (firstVideo) {
//					
//					setTimeout(function() {
//						//默认初始化加载第一个视频点位
//						showVideo(firstVideo.VIDEOID, firstVideo.VIDEONAME, firstVideo.HIKPLATNUM,
//								firstVideo.STRDOMAINCODE, firstVideo.STRDEVICECODE, firstVideo.STRCHANNELCODE,
//								firstVideo.STRSTREAMCODE);
//					}, 500);
//				}
//			}
//		});
});

/**
 * 初始化视频列表
 */
function initVideoList(callBack){
	//清空历史数据表格
	$("#videolist").empty();
	
	//查询重大危险源企业视频列表数据
	$.ajax({
		type: 'post',
		url: BASE_URL + '/monitor/macmonitormap/loadMacVideoList',
		cache: false,
		dataType: 'json',
		data: {
			"entname": $("#entname").val(),
			"isgov": "0"
		},
		success: function(data) {
//			alert(JSON.stringify(data));
			//数据取怀业视频测试数据
			data = window.hyVideoList;
//			console.log(window.hyVideoList);
			
			$("#videoCount").html("0");
			if (data.length > 0) {
				$("#videoCount").html(data.length);
				$.each(data,function(n, videoInfo){
					$("#videolist").append("<tr>" +
							"<td title="+videoInfo.ENTNAME+">"+videoInfo.ENTNAME+"</td>" +
							"<td title="+videoInfo.VIDEONAME+">"+videoInfo.VIDEONAME+"</td>" +
							"<td>" + 
							'<a onclick="showVideo(\'' + videoInfo.VIDEOID + '\',\'' + videoInfo.VIDEONAME +'\',\'' + videoInfo.HIKPLATNUM +'\',\'' + videoInfo.STRDOMAINCODE +'\',\'' + videoInfo.STRDEVICECODE +'\',\'' + videoInfo.STRCHANNELCODE +'\',\'' + videoInfo.STRSTREAMCODE +'\');"' +
							' href="javascript:void(0);">查看</a></td>' +
//							'<td><a onclick="showVideo(\'' + videoInfo.VIDEOID + '\',\'' + videoInfo.VIDEONAME +'\',\'' + videoInfo.HIKPLATNUM +'\')" href="javascript:void(0);">查看</a></td>' +
							"</tr>");
				});
				
				$('#videolist').niceScroll({
			        cursorborder: "#4d86d6",
			        cursorcolor: "#4d86d6",
			        background: "#c7c7c7",
			        horizrailenabled: false,
			        autohidemode: false
			    }).show().resize();
				
				//执行回调函数
				if (callBack) {
					callBack(data[0]);
				}
			} else {
				$("#hyPlayer").hide();
				$("#titContent").html("");
				$("#titContent").append('<font style="color: white;font-size: 20px">暂未接入视频</font>');
				$("#titContent").addClass("noSource");
				$("#objDiv").show();
			}
		},
		error : function() {
			parent.toast("加载失败");
		}
	});
}


/**
 * 按企业查询
 */
function seachVideo() {
	//默认加载政府园区视频列表
	initVideoList(function(firstVideo, myOcxMsg, initParam) {
		if (!warnIE()) {
			//加载默认第一个点位视频
			if (firstVideo) {
				//默认初始化加载第一个视频点位
				showVideo(firstVideo.VIDEOID, firstVideo.VIDEONAME, firstVideo.HIKPLATNUM,
						firstVideo.STRDOMAINCODE, firstVideo.STRDEVICECODE, firstVideo.STRCHANNELCODE,
						firstVideo.STRSTREAMCODE);
			}
		}
	});
}

function reset(){
	$("#entname").val("");
}

function showVideo(videoid, videoname, hikplatnum, strdomaincode, strdevicecode, strchannelcode, strstreamcode) {
	$("#videoname").html(videoname);
	if (!warnIE()) {
		try {
	 		$("#hyPlayer").show();
	 		
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
//	 		alert(JSON.stringify(mbedeviceShowlist));
	 		//登录播放器
	 		var initParam = {
	 				id: "hyPlayer",
	 				width: "100%",
	 				height: "100%",
	 				classid: "clsid:210468B6-80D3-4CD0-921E-1AA99B8EB5AD",
	 				ShowBarFullBtn: true,
	 				showPlayBar: true,
	 				showProgressBar: true,
	 				showAudioBar: true,
	 				showPlayPauseBtn:true,	
	 				showStretchBtn: true,
	 				showLayoutBtn: true
	 		};
	 		
	 		window.lastHyPlayer = window.myOcxMsg._playinit_("hyPlayer", $.extend({}, initParam, {id: "hyPlayer"}));
//	 		window.myOcxMsg.setLayoutEx({
//	 			 play: window.lastHyPlayer,
//	 		     layout: {
//	 		        "nWidth": 8,
//	 		        "nHeight": 8,
//	 		        "listLayoutRect": [{
//	 		            "nLeft": 0,
//	 		            "nTop": 0,
//	 		            "nRight": 8,
//	 		            "nBottom": 8
//	 		        }, {
//	 		            "nLeft": 6,
//	 		            "nTop": 6,
//	 		            "nRight": 8,
//	 		            "nBottom": 8
//	 		        }]
//	 		     }
//	 		});
	 		
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
	 	} catch(e) {
	 		//未安装怀业ocx插件时的警告
	 		warnHyOcx();
		}
	}
}

/**
 * 非IE浏览时的警告
 */
function warnIE() {
	var flag = false;
	var browserAg = navigator.userAgent.toString().toLowerCase();
 	if (browserAg.indexOf("firefox") != -1 || browserAg.indexOf("chrome") != -1) {
 		$("#hyPlayer").hide();
 		$("#titContent").html("");
		$("#titContent").append('<font style="color: white;font-size: 20px">请使用IE10.0及其以上版本查看视频监控</font>');
		$("#titContent").addClass("ieClass");
		$("#objDiv").show();
		flag = true;
//		return;
 	}
 	return flag;
}

/**
 * 未安装怀业ocx插件时的警告
 */
function warnHyOcx() {
	$("#hyPlayer").hide();
	$("#titContent").html("");
	$("#titContent").append('<font style="color: white;font-size: 15px">插件没有安装,请<a href="'+BASE_URL+'/monitor/macmonitormap/downloadWebVideo?type=hy&filename=HYMBEClient_Setup">下载</a>安装</font>');
	$("#titContent").addClass("noPlug");
	$("#objDiv").show();
	return;
}