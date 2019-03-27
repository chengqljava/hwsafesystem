var districtcode = "";//点击行政机构查询 全局变量
$(document).ready(function() {
	var searchtime = getQueryString("searchtime");
	var handlestatus = getQueryString("handlestatus");
	var statusDataArr = [
	                     {code : 100, name : '满量程'},
	                     {code : 101, name : '低报'},
	                     {code : 102, name : '高报'},
	                     {code : 103, name : '超低报'},
	                     {code : 104, name : '超高报'}
	                     ];
	var colname = ['主键ID',/*'企业名称',*/'探头ID','监测点位名称','开始时间','结束时间','监测数值','单位','状态','负责人','联系电话','处理状态code','处理情况','处理时间'];
	
	var colmodel = [
					{name:'ALARMMONITORID',index:'ALARMMONITORID',hidden:true},
					/*{name:'ENTNAME',index:'ENTNAME',align:'left', width : '15%'},*/
					{name:'PROBEID',index:'PROBEID',hidden:true},
					{name:'PROBENAME',index:'PROBENAME',align:'left', width : '10%'},
					{name:'STARTTIME',index:'STARTTIME',align:'left',
						formatter:function(cellvalue, options, obj) {
							if(obj.STARTTIME == null)
								return "-";
							else
								return getSmpFormatDateByLong(obj.STARTTIME,true);
						} ,width : '10%'},
					{name:'ENDTIME',index:'ENDTIME',align:'left',
						formatter:function(cellvalue, options, obj) { 
							if(obj.ENDTIME == null)
								return "-";
							else
								return getSmpFormatDateByLong(obj.ENDTIME,true);
						} ,width : '10%'},
					{name:'CHROVAL',index:'CHROVAL',align:'left', hidden : true},
					{name:'UNIT',index:'UNIT',align:'left', hidden : true},
					{name:'STATUS_TEXT',index:'STATUS_TEXT',align:'left',
						formatter:function(cellvalue, options, obj) { 
							return "<span style='color:red'>"+SelectOption.getProbeState(obj.STATUS)+"</span>";
						} ,width : '6%'
					},
					{name:'LEGALPERSON',index:'LEGALPERSON',align:'left' ,width : '7%'},
					{name:'PHONE',index:'PHONE',align:'left' ,width : '10%'},
					{name:'HANDLESTATUS',index:'HANDLESTATUS',align:'left', hidden : true},
					{name:'HANDLESTATUS_TEXT',index:'HANDLESTATUS_TEXT',align:'left',
						formatter:function(cellvalue, options, obj) {
							if(obj.HANDLESTATUS == "" || obj.HANDLESTATUS==undefined || obj.HANDLESTATUS == 'null')
								obj.HANDLESTATUS = "0";
							if(obj.HANDLESTATUS == "1")
								return '<a href="javascript:void(0);" onclick="displayHandleInfo(\''+obj.ALARMMONITORID+'\')">'+SelectOption.getAlarmHandleStatus(obj.HANDLESTATUS)+'</a>';
							else
								return "<span style='color:red'>"+SelectOption.getAlarmHandleStatus(obj.HANDLESTATUS)+"</span>";
							
						} ,width : '6%'
					},
					{name:'HANDLETIME',index:'HANDLETIME',align:'left',
						formatter:function(cellvalue, options, obj) {
							if(obj.HANDLETIME == null)
								return "-";
							else
								return getSmpFormatDateByLong(obj.HANDLETIME,false);
						} ,width : '10%'}
//					,
//					{name:'showVideo',index:'showVideo',align:'left',formatter:function(cellvalue, options, obj) {
//						if(obj.VIDEONUM > 0)
//							return '<a href="javascript:void(0);" style="color:blue" onclick="showVideo(\''+obj.PROBEID+'\')">视频</a>';
//						else 
//							return '-';
//					}, width : '10%'}
				];
	
	
	var tableHeight = $(window).height() - $('.pcheck').height() - 190 - 42;
	$(window).resize(function(){
		$("#grid-table").jqGrid( 'setGridHeight', $(window).height() - $('.pcheck').height() - 190 - 42 );
		$("#grid-table").jqGrid( 'setGridWidth', $(window).width() - 48 );
	});
//	
//	var searchParamJson = {};
//	
//	$.each($("#searchForm").serializeArray(), function(){
//		searchParamJson[this.name] = this.value;
//	});
//	
//	var searchParam = {"searchParamJson" : JSON.stringify(searchParamJson)};

    $("#grid-table").jqGrid({
    	height: tableHeight,
    	width:$(window).width() - 48,
    	url : BASE_URL + "/monitor/macalarmmonitor/list",
		datatype: "json",
		cache : false,
		mtype : 'post',
		colNames:colname,
		colModel:colmodel,
//		postData : searchParam,
		postData : {
			handlestatus: handlestatus,
			searchtime:searchtime
		},
		sortname : 'PROBENAME',
		sortorder : "desc",
		viewrecords : true,
		pager : "#grid-pager",
		jsonReader : {
			root : "datas",
			total : "total",
			page : "page",
			records : "records",
			repeatitems : false
		},
		rowNum:10,
		rowList:[10,20,30],
		altRows: true,
		multiselect: true,
		caption: "监测报警列表",
		//autowidth: true,
		loadComplete: function() {
			if ($("#closeBtn").length==0) {
				$("body").append('<div id="closeBtn" class="col-sm-offset-4 col-sm-4" style="text-align: center; margin-top: 10px;">'+
						'<button type="button" class="backBtn" onclick="parent.closeWin();"><span>关闭</span></button>'+
				'</div>');
			}
//			if($(window).width() < 700) {
//				$('.ui-jqgrid-htable').css({"width":"900"});
//				$("#grid-table").css({"width":"900"});
//				$("#grid-table").closest(".ui-jqgrid-bdiv").css({ "overflow-x" : "scroll","height":"350"});
//				$(".ui-jqgrid-hdiv").css({ "overflow-x" : "scroll"});
//			} else {
//				$("#grid-table").jqGrid( 'setGridWidth', $(window).width()*0.99 );
//			}
		}
	});
    
    /*报警处理*/
    $("#handleBtn").on("click", function(){
    	var ids = getSingleIds();
    	var rowdata = $("#grid-table").jqGrid('getRowData',ids[0]); //选中的一条记录
    	var alarmMonitorId = rowdata.ALARMMONITORID;
    	var handleStatus = rowdata.HANDLESTATUS;
    	if($.trim(handleStatus) == "1"){
    		// 弹出提示信息
    		parent.toast("只能处理状态为未处理的报警");
    		return;
    	}
    	var isRemind=-1;
    	parent.openWin(BASE_URL+"/monitor/macalarmmonitor/edit/" + alarmMonitorId+"/"+isRemind , '报警处理页面','60%','50%');
    });

    /*批量报警处理*/
    $("#batHanBtn").on("click", function(){
    	var ids = getManyIds("请选择一条数据");
    	var alarmMonitorIdArr = [];
    	for(var i = 0; i < ids.length; i++){
    		var rowdata = $("#grid-table").jqGrid('getRowData',ids[i])
    		alarmMonitorIdArr.push(rowdata.ALARMMONITORID);
    	}
    	// to string
    	var alarmMonitorIdsStr = alarmMonitorIdArr + "";
    	var isRemind=-1;
    	parent.openWin(BASE_URL+"/monitor/macalarmmonitor/toBatchAlarmHandlePage/" + alarmMonitorIdsStr+"/"+isRemind , '报警处理页面','60%','50%');
    });
    
});

/**
 * 点击左边行政机构
 * @param districtcode2
 * @param name
 * @param districtlevel
 */
function searchDistrict(districtcode2,name,districtlevel){
	districtcode = districtcode2;
	reloadGrid(districtcode)
}

/*加载*/
function reloadGrid(districtcode){
	var state = $("#state").val();
	if(state == "正常"){
		state = "0";
	} else if(state == "待标定"){
		state = "2";
	} else if(state == "探头故障"){
		state = "3";
	} else if(state == "预警"){
		state = "4";
	} else if(state == "通讯故障"){
		state = "7";
	} else if(state == "网络故障"){
		state = "99";
	} else if(state == "满量程"){
		state = "100";
	} else if(state == "低报"){
		state = "101";
	} else if(state == "高报"){
		state = "102";
	} else if(state == "超低报"){
		state = "103";
	} else if(state == "超高报"){
		state = "104";
	} else {
		state = "";
	}
	
	var searchParamJson = {};
	
	$.each($("#searchForm").serializeArray(), function(){
		searchParamJson[this.name] = this.value;
	});
	searchParamJson["districtcode"] = districtcode;
	searchParamJson["state"] = state;
	var searchParam = {"searchParamJson" : JSON.stringify(searchParamJson)};
	
	$("#grid-table").jqGrid('setGridParam',{
		page : 1,
		postData : searchParam
	}).trigger("reloadGrid");
}

/*搜索查询*/
$("#searchBtn").bind("click",function(){
	reloadGrid(districtcode);
});

/*重置*/
$("#resetBtn").bind("click",function(){
	$("#searchForm").find("input,select").each(function(){
		$(this).val("");
	});
});


/*详细查询*/
function display(PROBEID){
	parent.openWin(BASE_URL+"/monitor/macprobe/display/"+PROBEID,'详细','65%','65%');
}



/**
 * 值选择一条记录
 * @returns
 * @author lzqiang
 * @date 2016年7月7日 下午4:43:15
 */
function getSingleIds(){
	var ids = $("#grid-table").jqGrid('getGridParam','selarrrow');
	if(ids.length !=1){
		// 弹出提示信息
		parent.toast("请选择一条记录！");
		return;
	}
	return ids;
}
/**
 * 获取多条记录id
 * @param message
 * @returns
 * @author lzqiang
 * @date 2016年7月7日 下午4:45:13
 */
function getManyIds(message){
	var ids = $("#grid-table").jqGrid('getGridParam','selarrrow');
	if(ids.length==0){
		// 弹出提示信息
		parent.toast(message);
		return;
	}
	return ids;
}

function showVideo(probeForVideo){
	parent.openWin(BASE_URL+"/monitor/macalarmmonitor/displayVideo/"+probeForVideo,'视频','65%','65%');
}

/**
 * 显示报警处理详情 
 */
function displayHandleInfo(alarmMonitorId) {
	parent.openWin(BASE_URL+"/monitor/macalarmmonitor/displayHandleInfo/"+alarmMonitorId,'详细','30%','30%');
}
/**
 * 获取当前url访问路径后缀参数值
 * @param name
 * @returns
 */
function getQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if (r != null)
		return unescape(r[2]);
	return null;
}
