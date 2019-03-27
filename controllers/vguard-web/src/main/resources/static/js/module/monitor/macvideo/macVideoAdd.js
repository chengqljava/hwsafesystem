$(document).ready(function() {
	//为初次加载视频id赋值
	$("#oldVideoId").val($("#videoid").val());
	
//	alert("old:" + $("#videoid").val());
	
	SelectOption.loadVideostate("state");//视频主机状态
	SelectOption.loadMacVideoBrand("brandid");//主机品牌
	
	loadSelectTree($("#brandid").attr("selectvalue"));
	$("#brandid").on("change",function(){
		$("#videobrandtypeName").attr("selectvalue","");
		$("#videobrandtypeName_select").remove();
		loadSelectTree($("#brandid").val());
	});
	
	// 字符验证       
	jQuery.validator.addMethod("stringCheck", function(value, element) {       
	    return this.optional(element) || /^[a-zA-Z0-9_\.]+$/.test(value);       
	}, "只能包括字母、数字、点和下划线");
	
	var validateOpts = {
		rules: {
			videonum:{
				required: true,
				stringCheck:true
				/**
				,
				remote:{
				    url: BASE_URL+"/monitor/macvideo/existsVideonum",     //后台处理程序
				    type: "post",               //数据发送方式
				    dataType: "json",           //接受数据格式   
				    data: {                     //要传递的数据
				    	videoid: function(){
							return $("#videoid").val();
						},
						videonum:function(){
							return $("#videonum").val();
						}
				    }
				}
				*/
			},
			brandid:{
				required: true
			},
			videobrandtypeName:{
				required: true
			},
			videoname:{
				required: true,
				maxlength: 100
			},
			videogroup:{
				stringCheck:true,
				required: true
			},
			state:{
				required: true
			},
			macVideoHostName:{
				required: true
			},
			indexcode:{
				required: true
			},
			longitude: {
				required: true,
				validateitude: true
			},
			latitude: {
				required: true,
				validateitude: true
			},
			
			strdomaincode:{
				required: true
			},
			strdevicecode:{
				required: true
			},
			strchannelcode:{
				required: true
			},
			strstreamcode:{
				required: true
			}
		},
		messages: {
			videonum:{
				required: "通道不能为空",
				stringCheck:"只能包括字母、数字、点和下划线"
				//remote:"编号已存在",
			},
			brandid:{
				required: "品牌不能为空"
			},
			videobrandtypeName:{
				required: "型号不能为空"
			},
			videoname:{
				required: "摄像头名称不能为空",
				maxlength: "摄像头名称最大长度不能超过100"
			},
			videogroup:{
				required: "分组不能为空",
				stringCheck:"只能包括字母、数字、点和下划线"
			},
			state:{
				required: "状态不能为空"
			},
			macVideoHostName:{
				required: "主机不能为空"
			},
			indexcode:{
				required: "摄像头索引号不能为空"
			},
			longitude: {
                required: "经度不能为空",
                validateitude: "请输入小数且小数位最多4位"
            },
            latitude: {
                required: "纬度不能为空",
                validateitude: "请输入小数且小数位最多4位"
            },
            strdomaincode:{
				required: "设备所属域编号不能为空"
			},
			strdevicecode:{
				required: "设备编码不能为空"
			},
			strchannelcode:{
				required: "通道编码不能为空"
			},
			strstreamcode:{
				required: "码流编码不能为空"
			}
		},
		submitHandler:function(form){
	    	save();
	    }   
	};
	
	//获取最新经纬度限制范围
    $.getJSON(BASE_URL + "/config/gisPtAreaRange.json", function(data) {
    	if (data && 0 != data.lngStart) {
    		validateOpts.rules.longitude.range = [data.lngStart, data.lngEnd];
    		validateOpts.rules.latitude.range = [data.latStart, data.latEnd];
    		validateOpts.messages.longitude.range = "经度输入范围在 {" + data.lngStart + "} 到 {" + data.lngEnd + "} 之间的数值";
    		validateOpts.messages.latitude.range = "纬度输入范围在 {" + data.latStart + "} 到 {" + data.latEnd + "} 之间的数值";
    	}
    	$("#macvideoform").validate(validateOpts);
    });
	
	
	//选择海康8700平台视频点位
	$("#chose8700VideoPt").off("click").on("click", function() {
		window.top.GEventObject.die("LOAD_MONITOR_HIK8700VIDEO_EVENT");
        window.top.GEventObject.on("LOAD_MONITOR_HIK8700VIDEO_EVENT", function(param) {
        	
            $("#videoid").val(param.videoId);
            $("#videoname").val(param.videoName);
            
//            alert("ret:" + $("#videoid").val());
        });
		parent.openWin(BASE_URL + "/monitor/macvideo/selHik8700Video",'选择海康8700视频平台点位','65%','75%');
		return false;
	});
	
	//选择怀业平台视频点位
	$("#choseHyVideoPt").off("click").on("click", function() {
		window.top.GEventObject.die("LOAD_MONITOR_HYVIDEO_EVENT");
        window.top.GEventObject.on("LOAD_MONITOR_HYVIDEO_EVENT", function(param) {
        	$("#strdomaincode").val(param.strdomaincode);
        	$("#strdevicecode").val(param.strdevicecode);
        	$("#strchannelcode").val(param.strchannelcode);
        	$("#strstreamcode").val(param.strstreamcode);
            $("#videoname").val(param.videoname);
        });
        
        var macVideoHostIP = $("#macVideoHostIP").val(),
        	macVideoHostPort = $("#macVideoHostPort").val();
//        console.log("macVideoHostIP:" + macVideoHostIP);
//        console.log("macVideoHostPort:" + macVideoHostPort);
         
		parent.openWin(BASE_URL + "/monitor/macvideo/selHyVideo?macVideoHostIP=" + macVideoHostIP +
					   "&macVideoHostPort=" + macVideoHostPort, '选择怀业视频平台点位', '65%', '75%');
		return false;
	});
	
	//初次加载判断当前所编辑点位是否属于平台种类
	$("#curVideoType").val($("#hikplatnum").val());
	if ("8700" == $("#hikplatnum").val()) {
		$(".chosn8700VideoTr").show();
		$("#videoname").attr("readonly", "readonly");
		
		$(".videonumTd, .indexcodeTd").hide();
		
		$("#videonum, #indexcode, " +
	      "#strdomaincode, #strdevicecode, #strchannelcode, #strstreamcode").val("0");
	} else if ("8200" == $("#hikplatnum").val()) {
		$(".videonumTd").hide();
		
//		$("#videonum, #strdomaincode, #strdevicecode, " +
//		  "#strchannelcode, #strstreamcode").val("0");
		$($(".indexcodeTd").get(0)).attr("colspan", "1");
		$($(".indexcodeTd").get(1)).attr("colspan", "3");
		
		$("#videonum, #strdomaincode, #strdevicecode, " +
		"#strchannelcode, #strstreamcode").val("0");
	} else if ("HY" == $("#hikplatnum").val()) {
		$(".chosnHyVideoTr, .hyParaTr").show();
		$("#videoname").attr("readonly", "readonly");
		
		$(".videonumTd, .indexcodeTd").hide();
		$("#videonum, #indexcode").val("0");
	} else if ("NVR" == $("#hikplatnum").val()) {
		$(".indexcodeTd").hide();
		$($(".videonumTd").get(0)).attr("colspan", "1");
		$($(".videonumTd").get(1)).attr("colspan", "3");
		
		$("#indexcode, #strdomaincode, #strdevicecode, " +
		"#strchannelcode, #strstreamcode").val("0");
	} else {
		$(".videonumTd, .indexcodeTd").hide();
	}
});

/**
 * GIS定位
 */
function position() {
    var longitude = encodeURIComponent($('#longitude').val());
    var latitude= encodeURIComponent($('#latitude').val());
    var isDisplay = $("#isDisplay").val();
    
    //当编辑地图点位时
    if ("0" == isDisplay) {
    	window.top.GEventObject.die("LOAD_BDMAPPT_EVENT");
    	window.top.GEventObject.on("LOAD_BDMAPPT_EVENT", function(param) {
    		$('#longitude').val(param.lng);
    		$('#latitude').val(param.lat);
    	});
    }
    parent.parent.openWin(BASE_URL + "/views/module/ems/common/emsMapLoc.html?lng=" + longitude + "&lat=" + latitude + "&isDisplay="+ isDisplay, "地理定位", "50%", "50%", false);
}

$("#macVideoHostName").on("click",function(){
	openVideoHost();
});
/**
 * 加载型号树
 */
function loadSelectTree(brandid){
	if(brandid == "" || brandid == null){
		brandid = "-1";
	}
	SelectTree.loadMacVideoBrandTypeSelect("videobrandtypeName",{videobrandid:brandid,flag:"2"});//主机型号
}

/**
 * 打开选择视频主机列表
 */
function openVideoHost(){
	parent.openWin(BASE_URL+"/monitor/macvideohost/selectVideoHost/"+parent.getSelfIndex(),'选择主机','65%','75%');
}

/**
 * 接收 选择视频主机 返回的值
 * @param json
 */
function selectVideoHost(json){
	var obj = eval("("+json+")");
	var videohostid = obj[0].VIDEOHOSTID;
	var macVideoHostName = obj[0].MACVIDEOHOSTNAME;
	var hikPlatNum = obj[0].HIKPLATNUM;
	var ipAddr = obj[0].IPADDR;
	var port = obj[0].PORT;
	$("#videohostid").val(videohostid);
	$("#macVideoHostName").val(macVideoHostName);
	$("#macVideoHostName").focus();
	$("#videoname").val("");
	
	if ("8700" == hikPlatNum) {
		//返回海康87平台视频
		$(".chosn8700VideoTr").show();
		$("#videoname").attr("readonly", "readonly");
		$("#curVideoType").val("8700");
		
		$(".videonumTd, .indexcodeTd, .chosnHyVideoTr, .hyParaTr").hide();
		$("#videonum, #indexcode, " +
	      "#strdomaincode, #strdevicecode, #strchannelcode, #strstreamcode").val("0");
	} else if ("8200" == hikPlatNum) {
		//返回海康82平台视频
		
		$(".chosn8700VideoTr").hide();
		$("#videoname").removeAttr("readonly");
		$("#curVideoType").val("8200");
		
		$("#indexcode").val("");
		$(".indexcodeTd").show();
		$($(".indexcodeTd").get(0)).attr("colspan", "1");
		$($(".indexcodeTd").get(1)).attr("colspan", "3");
		
		$("#videonum, #strdomaincode, #strdevicecode, " +
		"#strchannelcode, #strstreamcode").val("0");
		$(".videonumTd, .chosnHyVideoTr, .hyParaTr").hide();
	} else if ("HY" == hikPlatNum) {
		//返回怀业平台视频
		
		$(".chosn8700VideoTr").hide();
		$("#videoname").attr("readonly", "readonly");
		
//		$("#videoname").removeAttr("readonly");
		$("#curVideoType").val("HY");
		
		$(".videonumTd, .indexcodeTd").hide();
		$("#videonum, #indexcode").val("0");
		
		
		$("#macVideoHostIP").val(ipAddr);
		$("#macVideoHostPort").val(port);
		$(".chosnHyVideoTr, .hyParaTr").show();
		$("#strdomaincode, #strdevicecode, #strchannelcode, #strstreamcode").val("");
	} else if ("NVR" == hikPlatNum) {
		//返回NVR视频
		$(".chosn8700VideoTr").hide();
		$("#videoname").removeAttr("readonly");
		$("#curVideoType").val("NVR");
		
		$("#videonum").val("");
		$(".videonumTd").show();
		$($(".videonumTd").get(0)).attr("colspan", "1");
		$($(".videonumTd").get(1)).attr("colspan", "3");
		
		$("#indexcode, #strdomaincode, #strdevicecode, " +
		"#strchannelcode, #strstreamcode").val("0");
		$(".indexcodeTd, .chosnHyVideoTr, .hyParaTr").hide();
	}
}

/**保存*/
function save() {
				$.ajax({
					type : 'post',
					url : BASE_URL + '/monitor/macvideo/save',
					cache : false,
					dataType : 'json',
					data : $("#macvideoform").serializeArray(),
					global : false,
					success : function(json) {
						parent.toast(json.msg);//弹出提示信息
						if(json.success == true) {
							parent.getActiveIFrame().reloadGrid();//刷新列表
						}
						parent.closeWin();// 关闭弹出框
					},
					error: function() {
						parent.toast("保存失败");
					}
				});
}