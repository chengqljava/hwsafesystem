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

$(function() {
	var macVideoHostIP = getQueryString("macVideoHostIP"),
		macVideoHostPort = getQueryString("macVideoHostPort");
	
	//初始化表格数据
	var colname = ["通道名", "设备所属域编号", "设备编码", "通道编码", "码流编码"]; 
	var colmodel = [
					{name:'strchannelname',index:'strchannelname',align:'left'},
					{name:'strdomaincode',index:'strdomaincode',align:'left'},
					{name:'strdevicecode',index:'strdevicecode',align:'left'},
					{name:'strchannelcode',index:'strchannelcode',align:'left'},
					{name:'strstreamcode',index:'strstreamcode',align:'left'}
					];
	
	var tableHeight = $(window).height() - $('.pcheck').height() - 190 -33;
	$(window).resize(function() {
		$("#grid-table").jqGrid( 'setGridHeight', $(window).height() - $('.pcheck').height() - 190 -33 );
		$("#grid-table").jqGrid( 'setGridWidth', $(window).width()*0.99 );
	});
	
    $("#grid-table").jqGrid({
    	datatype: "local",
//    	url : BASE_URL + "/monitor/macvideohost/list",
		colNames: colname,
		colModel: colmodel,
		height: tableHeight,
		viewrecords: true,
		rowNum: 10,
		rowList: [10,20,30],
		altRows: true,
		multiselect: true,
		caption: "怀业平台视频列表",
		pager: "#grid-pager",
		autowidth: true
	});
	
//    jQuery.support.cors = true;
//    $._ajax({
//		"url": "http://123.160.220.41:9200/sie/httpjson/get_grouplist",
//		"data": {
//			"domainCode": "005056806319"
//		},
//		"success": function(hyGroups) {
//			alert(JSON.stringify(hyGroups));
//		}
//    });
//    jQuery.support.cors = true;
//    $._ajax({
//		url: "http://123.160.220.41:9200/sie/httpjson/get_domain_device_list",
//		async: false,
//		data: {
//    		"nPage": 1,
//    		"nSize": 100,
//    		"strDomainCode": "005056806319"
//    	},
//		success: function(data) {
//			alert(JSON.stringify(data));
//		},
//		fail: function(ret){
//			console.log(ret);
//		}
//	});
    
	//获取怀业平台默认域信息
    var hyDomains = null;
    jQuery.support.cors = true;
	$._ajax({
		url: "http://" + macVideoHostIP + ":" + macVideoHostPort + "/sie/httpjson/get_domain_list",
		async: false,  // 异步
		data: {
//			"strDomainCode": ""
		},
		success: function(data) {
			hyDomains = data;
		},
		fail: function(ret){
			console.log(ret);
		}
	});	
//	alert("hyDomains" + JSON.stringify(hyDomains));
	
	//加载怀业平台所有区域信息
	if (hyDomains && 0 == hyDomains.nResultCode) {
		if (0 < hyDomains.domainInfoList.length) {
			
			//取出第一次怀业平台第一默认域的域编码
			var strDomainCode = (hyDomains.domainInfoList)[0].strDomainCode;
			var hyGroups = null;
			
			//获取怀业平台默认域下的组列表
//			jQuery.support.cors = true;
			$._ajax({
				url: "http://" + macVideoHostIP + ":" + macVideoHostPort + "/sie/httpjson/get_grouplist",
				async: false,
				data: {
					"domainCode": strDomainCode
				},
				success: function(data) {
					hyGroups = data;
				},
				fail: function(ret) {
					console.log(ret);
				}
			});
//			alert("hyGroups" + JSON.stringify(hyGroups));
			
			if (hyGroups && 0 == hyGroups.nResultCode) {
				var curHyGroupList = hyGroups.sDomain.groupList;
				
				if (0 < curHyGroupList.length) {
					var selVideoRegOpt = "<option value=''>所有区域</option>";
			    	_.map(curHyGroupList, function(tmpGroup, index) {
			    		selVideoRegOpt += "<option value='" + tmpGroup.groupCode + "'>" + tmpGroup.groupName + "</option>";
			    	});
			    	
			    	$("#selVideoReg").empty().html(selVideoRegOpt);
			    	$("#selVideoReg").change(function() {
			    		var curGroupCode = $("#selVideoReg").val();
//			    			macHikVideoRegs = JSON.parse($("#macHikVideos").val());
			    		if ("" == curGroupCode) {
			    			reloadGrid(macVideoHostIP, macVideoHostPort, strDomainCode, null);
			    		} else {
			    			reloadGrid(macVideoHostIP, macVideoHostPort, strDomainCode, curGroupCode);
			    		}
			    	});
			    	
			    	//默认加载怀业平台默认域下所有视频点位信息
					reloadGrid(macVideoHostIP, macVideoHostPort, strDomainCode, null);
				}
			}
			
			
		}
	}
	
	//选择某一个视频点位
	$("#chosnVideoBtn").off("click").on("click", function() {
		var curSelIds = $("#grid-table").jqGrid("getGridParam", "selarrrow");
		if(curSelIds.length != 1){
			// 弹出提示信息
			parent.toast("请选择一条记录！");
			return;
		}
		
		var curSelRowdata = $("#grid-table").jqGrid("getRowData", curSelIds[0]);
		window.top.GEventObject.fireEvent("LOAD_MONITOR_HYVIDEO_EVENT", {
			"strdomaincode": curSelRowdata.strdomaincode,
			"strdevicecode": curSelRowdata.strdevicecode,
			"strchannelcode": curSelRowdata.strchannelcode,
			"strstreamcode": curSelRowdata.strstreamcode,
			"videoname": curSelRowdata.strchannelname
		});
		parent.closeWin();
	});
});

/*加载*/
function reloadGrid(macVideoHostIP, macVideoHostPort, domainCode, groupCode){
    var hyAjaxUrl = "", hyParam = {};
    if (groupCode) {
    	hyAjaxUrl = "http://" + macVideoHostIP + ":" + macVideoHostPort + "/sie/httpjson/get_channel_list";
    	hyParam = {
    		"nPage": 1,
    		"nSize": 10000,
    		"domainCode": domainCode,
    		"groupCode": groupCode
    	};
    } else {
    	hyAjaxUrl = "http://" + macVideoHostIP + ":" + macVideoHostPort + "/sie/httpjson/get_domain_device_list";
    	hyParam = {
    		"nPage": 1,
    		"nSize": 10000,
    		"strDomainCode": domainCode
    	};
    }
    
    var hyPtInfo = null;
    
    //获取怀业平台默认域信息
    jQuery.support.cors = true;
	$._ajax({
		url: hyAjaxUrl,
		async: false,
		data: hyParam,
		success: function(data) {
			hyPtInfo = data;
		},
		fail: function(ret){
			console.log(ret);
		}
	});
//	alert("hyPtInfo" + JSON.stringify(hyPtInfo));
	
	if (hyPtInfo && 0 == hyPtInfo.nResultCode) {
		var hyPtGridDataArr = [];
		if (groupCode) {
			//指定组视频点位
			if (hyPtInfo.lstChannel && 0 < hyPtInfo.lstChannel.length) {
				_.map(hyPtInfo.lstChannel, function(tmpChanel, index) {
					//判断当前通道下是否存在码流列表数据
					if (tmpChanel.lstStream && 0 < tmpChanel.lstStream.length) {
						var tmpGridRowData = {};
						tmpGridRowData.strchannelname = tmpChanel.channelName;
						tmpGridRowData.strdomaincode = tmpChanel.domainCode;
						tmpGridRowData.strdevicecode = tmpChanel.deviceCode;
						tmpGridRowData.strchannelcode = tmpChanel.channelCode;
						tmpGridRowData.strstreamcode = (tmpChanel.lstStream)[0].streamCode;
						hyPtGridDataArr.push(tmpGridRowData);
					}
		    	});
			}
		} else {
			//所有视频点位
			if (hyPtInfo.deviceList && 0 < hyPtInfo.deviceList.length) {
				//当前域下是否存在设备
				
				_.map(hyPtInfo.deviceList, function(tmpDevice, index1) {
					if (tmpDevice.channelList && 0 < tmpDevice.channelList.length) {
						//判断当前设备下是否存在通道列表数据
						
						_.map(tmpDevice.channelList, function(tmpChannel, index2) {
						
							if (tmpChannel.streamList && 0 < tmpChannel.streamList.length) {
								//判断当前通道下是否存在码流列表数据
								
								var tmpGridRowData = {};
								tmpGridRowData.strchannelname = tmpChannel.strChannelName;
								tmpGridRowData.strdomaincode = tmpDevice.strDomainCode;
								tmpGridRowData.strdevicecode = tmpDevice.strDeviceCode;
								tmpGridRowData.strchannelcode = tmpChannel.strChannelCode;
								tmpGridRowData.strstreamcode = (tmpChannel.streamList)[0].strStreamCode;
								hyPtGridDataArr.push(tmpGridRowData);
							}
						});
					}
		    	});
			}
		}
		
		//填充怀业平台视频点位表格数据
		$("#grid-table").clearGridData(false).jqGrid("setGridParam", {
			data: hyPtGridDataArr
		}).trigger("reloadGrid");
	}
}

/**
 * 获取url后缀参数值
 * @param name
 * @returns
 */
function getQueryString(name) {
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}