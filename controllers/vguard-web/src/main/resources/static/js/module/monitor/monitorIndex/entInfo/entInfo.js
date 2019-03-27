/**
 * 初始化实时曲线的相关配置
 */
function initRealTime() {
    //帮助按钮点击事件
    $("#wsHelpIcon").off("click").on("click", function () {
        $("#notes").show();
    });
    
    //隐藏帮助
    $("#hideHelpBtn").off("click").on("click", function () {
        $("#notes").hide();
    });
    
    //初始化日期选择框
    var nowFormatTime = getNowFormatTime();
    $("#selGasPtDetDateInter").daterangepicker(
        {
            "locale": {
                "format": "YYYY-MM-DD HH:mm:ss",
                "separator": " - ",
                "applyLabel": "确定",
                "cancelLabel": "取消",
                "fromLabel": "From",
                "toLabel": "To",
                "customRangeLabel": "Custom",
                "weekLabel": "W",
                "daysOfWeek": [
                    "日",
                    "一",
                    "二",
                    "三",
                    "四",
                    "五",
                    "六"
                ],
                "monthNames": [
                    "一月",
                    "二月",
                    "三月",
                    "四月",
                    "五月",
                    "六月",
                    "七月",
                    "八月",
                    "九月",
                    "十月",
                    "十一月",
                    "十二月"
                ],
                "firstDay": 1
            },
            "startDate": getNowFormatDate() + "00:00:00",
            "endDate": nowFormatTime,
            "maxDate": nowFormatTime
        },
        function (start, end, label) {
            // alert("A new date range was chosen: " + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD'));
//        	var startDate = start.format("YYYY-MM-DD HH:mm:SS"),
//        		endDate = end.format("YYYY-MM-DD HH:mm:SS");
//        	$("#startDate").val(startDate);
//        	$("#endDate").val(endDate);
        	
        	//展示最新时间区间内的探头浓度折线图
            initRealTimeChart(window.dataid, "5", start.format("YYYY-MM-DD HH:mm:ss"), end.format("YYYY-MM-DD HH:mm:ss"));
        }
    );
    
    //TODO 获取监测设备总数、正常设备总数、故障设备总数、报警设备数量
    $(".dateType-select").off("click").on("click", function () {
        $(this).siblings().find("a").removeClass("current");
        $(this).find("a").addClass("current");
        
        //---------查询数据库图表展示切换---切换
        var searchType = 0;
        if ("今天" == $(this).find("a").html()) {
            searchType = 1;
        } else if ("昨天" == $(this).find("a").html()) {
            searchType = 2;
        } else if ("最近一周" == $(this).find("a").html()) {
            searchType = 3;
        }
//        else if ("最近30天" == $(this).find("a").html()) {
//            searchType = 4;
//        }
        
        var startDate = null,
		    endDate = null,
		    nowFormatTime = getNowFormatTime(),
		    maxDate = nowFormatTime,
			nowDate = new Date();
		
		if (1 == searchType) {
			//今天
			startDate = getNowFormatDate() + "00:00:00";
			endDate = nowFormatTime;
		} else if (2 == searchType) {
			//昨天
			var yesDayPrefix = getFormatDate(new Date(nowDate.getTime()- 24 * 60 * 60 * 1000), "yyyy-MM-dd");
			startDate = yesDayPrefix + "00:00:00";
			endDate = yesDayPrefix + "23:59:59";
		} else if (3 == searchType) {
			//最近一周
			var last1WekDayPrefix = getFormatDate(new Date(nowDate.getTime()- 7 * 24 * 60 * 60 * 1000), "yyyy-MM-dd");
			startDate = last1WekDayPrefix + "00:00:00";
			endDate = nowFormatTime;
		}
		
		$("#selGasPtDetDateInter").data("daterangepicker").setStartDate(startDate);
		$("#selGasPtDetDateInter").data("daterangepicker").setEndDate(endDate);
		
//		$("#startDate").val(startDate);
//		$("#endDate").val(endDate);
        
        //展示最新时间区间内的探头浓度折线图
        initRealTimeChart(window.dataid, searchType, startDate, endDate);
    });
}

/**
 * Created by Administrator on 2017/10/9.
 */
$(function (){
	//初始化摄像头页面
    var businessinfoid = GetQueryString("businessinfoid");

    var monitorinfo = new MonitorInfo();
    monitorinfo.loadAlarmStatis(businessinfoid);

    window.state = "-1";
    var monitorData = new MonitorData(businessinfoid);
    var datas =  monitorData.updateGrid(window.state);
    monitorData.initProbePoint(datas);

     var refreshProbeList =  setInterval(function () {
        monitorData.updateGrid(window.state);
    }, 5000);
     
    //获取企业下视频信息
    var monitorVideo = new MonitorVideo(businessinfoid);
    monitorVideo.updateGrid();
    
    // 报警信息点击事件
    $('#waringInfoTitle').on('click', '.select', function () {
        $('#waringInfoTitle .select').attr('class', 'select afterWarning waring')
        $(this).attr('class', 'select afterWarning waringSelected');
        var state = $(this).attr("state");
        if (state == "1") {
            $("#dqdiv").show();
            $("#lsdiv").hide();
        } else {
            $("#dqdiv").hide();
            $("#lsdiv").show();
        }
    });
    // 探头信息点击事件
    $('#probeInfoTitle').on('click', '.select', function () {
        $('#probeInfoTitle .select').attr('class', 'select afterWarning waring')
        $(this).attr('class', 'select afterWarning waringSelected');

        var state = $(this).attr("state");
        monitorData.updateGrid(state);
        window.clearInterval(refreshProbeList);
        refreshProbeList = setInterval(function () {
            monitorData.updateGrid(state);
        }, 5000);
    })
    initRealTime();
    $("#dqdiv").show();
    $("#lsdiv").hide();
    
    //判断浏览器IE和非IE浏览器显示视频插件的区别
	window.videoFlag = true;
 	var browserAg = navigator.userAgent.toString().toLowerCase();
 	if(browserAg.indexOf("firefox") != -1 || browserAg.indexOf("chrome") != -1){
 		window.videoFlag = false;
//    	parent.toast("视频监控初始化失败!请使用IE10.0或以上版本");
    	$("#titContent").html("");
		$("#titContent").append('<font style="color: white;font-size: 15px">请使用IE10.0及其以上版本查看视频监控</font>');
		$("#titContent").addClass("ieClass");
		$("#objDiv").show();
 	}
 	
// 	var spvxOcx = document.getElementById("spvViewOCX");
// 		spvxOcx.MPV_Uninit();
// 		spvxOcx.MPV_Init(1);
//    try{
//    	init();
//    }catch (e) {
//    	videoFlag = false;
//    	$("#titContent").html("");
//		$("#titContent").append('<font style="color: white;font-size: 15px">请使用IE10.0及其以上版本查看视频监控</font>');
//		$("#titContent").addClass("ieClass");
//		$("#objDiv").show();
//	}
 	
 	//获取企业平面图
    initEntPlan(businessinfoid);
});


//获取企业平面图
function initEntPlan(businessinfoid) {
    $.ajax({
        type: "post",
        url: BASE_URL + "enterprise/entplan/getImgHAndW",
        dataType: "json",
        data: {businessinfoid: businessinfoid},
        success: function (data) {
            if (data) {
                var width = data.width;
                var height = data.height;

                //设置图片的大小
                //图片初始时的宽度为880保证右侧的信息显示完全
                var initWidth = $(window).width() -410;
                var initHeight = $(window).height() - 180;
                //计算出图片的初始化高度
                var initWidth1 = parseInt((parseFloat(width) / parseFloat(height)) * parseFloat(initHeight));
                var leftBottomDivHeight = 180;
                console.log(initWidth,initWidth1)

                $("#viewArea").css("width", initWidth);
                // $("#moveImg").css("width",initWidth);
                $("#viewArea").css("height", initHeight);
                // $("#moveImg").css("height",initHeight);
                window.imgRealWidth = initWidth;
                window.imgRealHeight = initHeight;
                window.lastImgWidth = initWidth;
                window.lastImgHeight = initHeight;

                window.leftTopDivWidth = $(window).width() -410;
                window.leftTopDivHeight = initHeight;

                //设置底部的高度
                $(".probeInfo").css("height", leftBottomDivHeight);
                initWorkShopMonPts();

            }
        },
        error: function () {
            parent.toast("初始化信息加载失败");
        }
    });


    $("#moveImg").attr("src", BASE_URL + "enterprise/entplan/downloadbyentid?businessinfoid=" + businessinfoid);
    //获取企业的点位
}
/**
 * 查询数据库初始化加载指定车间内部监测点位
 */
function initWorkShopMonPts() {
    $('#viewArea').on('click', '.realWkSpMonPt', (function (e) {
        var mactype = $(this).attr("data-type");
        var id = $(this).attr("data-blg");
        //如果为探头
        if (mactype == "1") {
            var notes = $(this).attr("data-notes");
            var unit = $(this).attr("data-unit");
            var isneedhandle = $(this).attr("data-isneedhandle");
            showData(id, notes, unit, isneedhandle)
        } else {
            showVideoDiv(id, $(this).attr("data-hikType"), $(this).attr("data-ipaddr"), $(this).attr("data-hyplayport"),
            			 $(this).attr("data-strdomaincode"), $(this).attr("data-strdevicecode"),
            			 $(this).attr("data-strchannelcode"), $(this).attr("data-strstreamcode"));
        }
    }));
}

/**
 * 显示企业平面图
 */
function hideContent() {
    $("#vidCenter").hide();
    $("#dataDiv").hide();
    $(".contentArea").show();

    // if(window.cameraObj){
    //     window.cameraObj.stopPlay();
    // }
    //停止实施曲线的定时器
    window.clearInterval(window.textinfoInterval);
    window.clearInterval(window.realimeTicket);
    window.videoinfo = null;
}

function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)return unescape(r[2]);
    return null;
}
/**
 * 显示监控视频界面
 * @param videoid
 * @param rowId
 * @param entid
 */
function showVideoDiv(videoid, videoType, ipaddr, hyplayport, strdomaincode, strdevicecode, strchannelcode, strstreamcode) {
//	document.getElementById("PlayViewOCX").Destroy();
	//清除设备检测循环查询数据事件
	if (window.textinfoInterval) {
		clearInterval(window.textinfoInterval);
	}
	
    //调整大小
    $("#vidCenter").css({
        "height": window.leftTopDivHeight,
        "width": window.leftTopDivWidth
    });
    $(".header").html("<span class='headerTitle'>摄像头</span><span class='back' onclick='hideContent()'>返回</span>");
    $("#vidCenter").show();
    $("#dataDiv").hide();
    $(".contentArea").hide();
    
    //判断是否IE浏览器
    if (!(window.videoFlag)) {
//		parent.toast("监控视频播放失败,请使用IE10.0或以上版本查看!");
    	return;
    }
    
    var curClkVideoCnt = parseInt($("#clkVideoCnt").val());
    if (1 == curClkVideoCnt) {
    	//首次查看视频
    	$("#objDiv").show();
    	setTimeout(function() {
    		if (videoType) {
    			playVideoByType(videoType, videoid, ipaddr, hyplayport, strdomaincode, strdevicecode, strchannelcode, strstreamcode);
    		}
    	}, 500);
    	
    	$("#clkVideoCnt").val(++curClkVideoCnt);
    } else {
    	if (videoType) {
    		playVideoByType(videoType, videoid, ipaddr, hyplayport, strdomaincode, strdevicecode, strchannelcode, strstreamcode);
		}
    }
    window.clearInterval(window.realimeTicket);
    window.clearInterval(window.textinfoInterval);
}

/**
 * 根据海康视频类型播放视频
 * @param videoType
 * @param videoid
 */
function playVideoByType(videoType, videoid, ipaddr, hyplayport, strdomaincode, strdevicecode, strchannelcode, strstreamcode) {
	if ("8200" == videoType) {
		 //82平台视频加载
		 $("#spvViewOCX, #hyPlayer").hide();
		 $("#PlayViewOCX").show();
//		 $("#spvViewOCX, .blg8700").hide();
//		 $("#PlayViewOCX, .blg8200").show();
//		$("#box").append("<object classid='clsid:D5E14042-7BF6-4E24-8B01-2F453E8154D7' id='PlayViewOCX' name='ocx'>" +
//       			"</object>");
		try {
			init();
			$("#objDiv").hide();
		} catch(e) {
			$("#titContent").html("");
			$("#titContent").append('<font style="color: white;font-size: 15px">插件没有安装,请<a href="'+BASE_URL+'/monitor/macmonitormap/downloadWebVideo?type=8200">下载</a>安装</font>');
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
		$("#videoXmlInfo").val(previewXml);
		try {
			//获取当亲空闲窗口
			var OCXobj = document.getElementById("PlayViewOCX");
			var lWndIndex = OCXobj.GetFreePreviewWnd();
//			alert("82" + lWndIndex);
			
//			alert($("#PlayViewOCX").height());
			$("#titContent").html("");
			$("#PlayViewOCX").height("100%");
			if (lWndIndex == -1) {
				StartPlayView(previewXml,0);
			}else{
				StartPlayView(previewXml,lWndIndex);
			}
		} catch(e) {
	//    	layer.confirm("插件没有安装,请下载安装", {
	//            btn: ['下载', '取消'], //按钮
	//            shade: false //不显示遮罩
	//        }, function (index) {
	//            window.location.href = BASE_URL + "/monitor/macmonitormap/downloadWebVideo";
	//            layer.close(index);
	//        });
			$("#titContent").html("");
			$("#titContent").append('<font style="color: white;font-size: 15px">插件没有安装,请<a href="'+BASE_URL+'/monitor/macmonitormap/downloadWebVideo?type=8200">下载</a>安装</font>');
			$("#titContent").addClass("noPlug");
			$("#objDiv").show();
			return;
		}
	} else if ("8700" == videoType) {
		//87平台视频加载
		$("#PlayViewOCX, #hyPlayer").hide();
		$("#spvViewOCX").show();
		
//		$("#PlayViewOCX, .blg8200").hide();
//		$("#spvViewOCX, .blg8700").show();
//		$("#box").append("<object classid='clsid:9ECD2A40-1222-432E-A4D4-154C7CAB9DE3' id='spvViewOCX' name='ocx'>" +
//		"</object>");
//		spvxOcx.MPV_Uninit();
		
		try {
			if (!window.spvxOcx) {
				window.spvxOcx = document.getElementById("spvViewOCX");
			}
			
			//初始化调用海康8700平台视频基本配置参数
			initHik8700(window.spvxOcx);
			$("#objDiv").hide();
		} catch(e) {
			$("#titContent").html("");
			$("#titContent").append('<font style="color: white;font-size: 15px">插件没有安装,请<a href="'+BASE_URL+'/monitor/macmonitormap/downloadWebVideo?type=8700">下载</a>安装</font>');
			$("#titContent").addClass("noPlug");
			$("#objDiv").show();
			return;
		}
		
		$.ajax({
			type: "post",
			url: BASE_URL + "monitor/macvideo/loadEsVideoXml",
			dataType: "json",
			data: {"videoid": videoid},
			success: function(retData) {
				if (retData) {
					if ("" != retData.esVideoXml) {
//						alert("xml" + retData.esVideoXml);
						try {
//							var spvxOcx = document.getElementById("spvViewOCX");
//							alert($("#spvViewOCX").height());
							$("#titContent").html("");
			    			$("#spvViewOCX").height("100%");
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
	} else if ("HY" == videoType) {
		//怀业平台视频访问
		$("#spvViewOCX, #PlayViewOCX").hide();
		$("#hyPlayer").show();
		
		try {
			jQuery.support.cors = true;
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
						$.hy_log("登录成功"+JSON2.stringify(data));
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
	//			 		alert(JSON.stringify(mbedeviceShowlist));
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
						$.hy_log("登录失败"+JSON2.stringify(data));
						
						if(data.nResultCode == "1720200002"){}
					},
					EventHandle:function(eventCode, errCode, data){
						$.hy_log(eventCode+"事件通知"+JSON2.stringify(data));
					}
			};
			
			window.myOcxMsg.login(loginData); 
		} catch(e) {
	 		//未安装怀业ocx插件时的警告
	 		$("#hyPlayer").hide();
	 		$("#titContent").html("");
			$("#titContent").append('<font style="color: white;font-size: 15px">插件没有安装,请<a href="'+BASE_URL+'/monitor/macmonitormap/downloadWebVideo?type=hy&filename=HYMBEClient_Setup">下载</a>安装</font>');
			$("#titContent").addClass("noPlug");
			$("#objDiv").show();
	 		return;
		}
	} else if ("NVR" == videoType) {
		//预留其它NVR访问视频接口
	} 
}


/**
 * 显示曲线图界面
 * @param dataid
 * @param notes
 * @param unit
 * @param isneedhandle
 */
function showData(dataid, notes, unit, isneedhandle) {
    // if(window.cameraObj){
    //     window.cameraObj.stopPlay();
    // }
    //调整大小
    $("#dataDiv").css({
        "height": window.leftTopDivHeight,
        "width": window.leftTopDivWidth
    });
    window.dataid = dataid;
    $(".contentArea").hide();
    $("#dataDiv").show();
    $("#vidCenter").hide();
    $(".dateType-select").siblings().find("a").removeClass("current");
    $("#todayA").addClass("current");

    //获取探头的数据信息
    $("#notes").empty();
    $("#notes").append("<button id=\"hideHelpBtn\" type=\"button\" class=\"close\">×</button>")
    if(notes == "" || notes == null || notes == "null"){
    	notes = "无";
    }
    $("#notes").append(notes);
    $("#hideHelpBtn").off("click").on("click", function () {
        $("#notes").hide();
    });
    //初始化曲线图
    initRealTimeChart(dataid);
    //显示探头实时文本信息
    var data = monitordatas.loadRealChroByProbe(dataid);
    if (data[0].STATE == "0") {
        $(".header").html("<span class='headerTitle'>设备状态</span><span class='warningInfoSpan'>正常</span><span>"+data[0].CHROVAL + unit + " " + (new Date()).format('yyyy-MM-dd hh:mm:ss')+"</span><span class='back' onclick='hideContent()'>返回</span>");
    } else {
        var statename= data[0].STATENAME || "无";
        $(".header").html("<span class='headerTitle'>设备状态</span><span class='label label-danger'>" + statename + "</span> " + data[0].CHROVAL + unit + " " + (new Date()).format("yyyy-MM-dd hh:mm:ss") +"<span class='back' onclick='hideContent()'>返回</span><span class='warningHalderBtn' id='warningHalderBtn' >警情处理</span>");
        $("#warningHalderBtn").off("click").on("click", function () {
            parent.openWin(BASE_URL + "/monitor/macalarmmonitor/edit/" + dataid, '报警处理页面', '60%', '50%');
        });

    }
    window.clearInterval(window.textinfoInterval);
    var textinfoInterval = setInterval(function () {
        var data = monitordatas.loadRealChroByProbe(dataid);
        if (data[0].STATE == "0") {
            $(".header").html("<span class='headerTitle'>设备状态</span><span class='warningInfoSpan'>正常</span><span>"+data[0].CHROVAL + unit + " " + (new Date()).format('yyyy-MM-dd hh:mm:ss')+"</span><span class='back' onclick='hideContent()'>返回</span>");
        } else {
            var statename= data[0].STATENAME || "无";
            $(".header").html("<span class='headerTitle'>设备状态</span><span class='label label-danger'>" + statename + "</span> " + data[0].CHROVAL + unit + " " + (new Date()).format("yyyy-MM-dd hh:mm:ss")+"<span class='back' onclick='hideContent()'>返回</span><span class='warningHalderBtn' id='warningHalderBtn' >警情处理</span>");

        $("#warningHalderBtn").off("click").on("click", function () {
            parent.openWin(BASE_URL + "/monitor/macalarmmonitor/edit/" + dataid, '报警处理页面', '60%', '50%');
        });
        }
    }, 5000);
    window.textinfoInterval = textinfoInterval;
    if (isneedhandle == true || isneedhandle == "true") {
        //显示处理按钮
        $("#warningHalderBtn").show();
    } else {
        $("#warningHalderBtn").hide();
    }
    window.videoinfo = null;

}
/**
 * 初始化实施曲线图
 * @param dataid
 * @param type
 * @param start
 * @param end
 */
function initRealTimeChart(dataid, type, start, end) {
    var myLineChart = echarts.init(document.getElementById('chart'));
    var data = monitordatas.loadRealChroByProbe(dataid, type, start, end);
    var chroval = "0";
    var probename = "无";
    if (data != null && data.length > 0) {
        chroval = data[0].CHROVAL;
        probename = data[0].PROBENAME;
    }


    var date = [];
    var now;

    var dataY = [chroval];
    if (type == "2" || type == "3" || type == "4" || type == "5") {
        addDataByType(start, end)
    } else {
        for (var i = 1; i < 7; i++) {
            addData();
        }
    }

    function addDataByType() {
        var data = monitordatas.loadRealChroByProbe(dataid, type, start, end);
        date = [];
        dataY = [];
        if (data != null) {
            $.each(data, function (i, item) {
                date.push(getFormatDateByLong(item.CREATETIME, "yyyy-MM-dd hh:mm:ss"));
                dataY.push(item.CHROVAL);
            });
        }

    }

    function addData(shift) {
        now = (new Date()).format("yyyy-MM-dd hh:mm:ss");

        date.push(now);

        var data = monitordatas.loadRealChroByProbe(dataid);
        var chroval = data[0].CHROVAL;
        dataY.push(chroval);

        if (shift) {
            date.shift();
            dataY.shift();
        }

        now = (new Date()).format("yyyy-MM-dd hh:mm:ss");
    }


    var option = {
        title: {
            text: '',
            subtext: ''
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            orient: 'vertical',
            x: 'center',
            data: [{
            	name:probename,
                textStyle:{
                    color:'#fff'
                }
            }]
        },
        xAxis: [
            {
                type: 'category',
                name: '时间',
                nameTextStyle:{
                    color: '#fff'
                },
                boundaryGap: false,
                data: date,
                axisLabel: {
                    // interval: 1,
                    rotate: -20,
                    textStyle: {
                        color: '#fff'
                    }
                }
            }
        ],
        yAxis: [
            {
                type: 'value',
                name: '浓度值',
                nameTextStyle:{
                    color: '#fff'
                },
                axisLabel: {
                    formatter: '{value}',
                    textStyle: {
                        color: '#fff'
                    }
                }
            }
        ],
        series: [
            {
                name: probename,
                type: 'line',
                // smooth: true,
                // itemStyle: {
                //     normal: {
                //         areaStyle: {type: 'default'}
                //     }
                // },
                data: dataY
            }
        ],
        color: ['rgb(28,220,168)']
    };
    myLineChart.setOption(option);

    window.clearInterval(window.realimeTicket);
    if (type == null || type == "1") {
        var realimeTicket = setInterval(function () {

            addData();
            myLineChart.setOption({
                xAxis: {
                    data: date
                },
                series: [{
                    data: dataY
                }]
            });

        }, 5000);
        window.realimeTicket = realimeTicket;
    }
}
