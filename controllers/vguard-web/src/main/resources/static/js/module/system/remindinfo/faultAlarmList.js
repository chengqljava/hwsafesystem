$(document).ready(function () {
	var usertype = getQueryString("usertype");
	if(usertype == "ENT"){
		$("#btnDiv").hide();
	}
	
	var statusDataArr = [
	                     {code : 3, name : '探头故障'},
	                     {code : 4, name : '预警'},
	                     {code : 7, name : '通讯故障'},
	                     {code : 99, name : '网络故障'}
	                     ];
//	SelectOption.loadProbeStateWithParam(statusDataArr, "status");
//	SelectOption.loadBaseCode(statusDataArr, "status");
	
	var colname = ['主键ID','企业名称','监测点位名称','开始时间','结束时间','状态','负责人','联系电话','处理状态code','处理情况','处理时间'];
	
	var colmodel = [
					{name:'ALARMFAULTID',index:'ALARMFAULTID',hidden:true},
					{name:'ENTNAME',index:'ENTNAME',align: "center", width : '15%'},
					{name:'PROBENAME',index:'PROBENAME',align:'center', width : '10%'},
					{name:'STARTTIME',index:'STARTTIME',align:'center',
						formatter:function(cellvalue, options, obj) {
							if(obj.STARTTIME == null)
								return "-";
							else
								return getSmpFormatDateByLong(obj.STARTTIME,true);
						}, width : '10%'},
					{name:'ENDTIME',index:'ENDTIME',align:'center',
						formatter:function(cellvalue, options, obj) { 
							if(obj.ENDTIME == null)
								return "-";
							else
								return getSmpFormatDateByLong(obj.ENDTIME,true);
						}, width : '10%'},
					{name:'STATUS_TEXT',index:'STATUS_TEXT',align:'center',
						formatter:function(cellvalue, options, obj) { 
							return "<span style='color:red'>"+SelectOption.getProbeState(obj.STATUS)+"</span>";
						}, width : '6%'
					},
					{name:'LEGALPERSON',index:'LEGALPERSON',align:'center', width : '6%'},
					{name:'PHONE',index:'PHONE',align:'center', width : '10%'},
					{name:'HANDLESTATUS',index:'HANDLESTATUS',align:'center', hidden : true},
					{name:'HANDLESTATUS_TEXT',index:'HANDLESTATUS_TEXT',align:'center',
						formatter:function(cellvalue, options, obj) { 
							if(obj.HANDLESTATUS == "" || obj.HANDLESTATUS==undefined || obj.HANDLESTATUS == 'null'){
								obj.HANDLESTATUS = "0";
							}
							if(obj.HANDLESTATUS == "1")
								return '<a href="javascript:void(0);" onclick="displayHandleInfo(\''+obj.ALARMFAULTID+'\')">'+SelectOption.getAlarmHandleStatus(obj.HANDLESTATUS)+'</a>';
							else
								return "<span style='color:red'>"+SelectOption.getAlarmHandleStatus(obj.HANDLESTATUS)+"</span>";
						}, width : '6%'
					},
					{name:'HANDLETIME',index:'HANDLETIME',align:'center',
						formatter:function(cellvalue, options, obj) {
							if(obj.HANDLETIME == null)
								return "-";
							else
								return getSmpFormatDateByLong(obj.HANDLETIME,false);
						}, hidden : true}
				];
	
	var tableHeight = $(window).height() - $('.pcheck').height() - 110 -33;
	$(window).resize(function(){
		$("#grid-table").jqGrid( 'setGridHeight', $(window).height() - $('.pcheck').height() - 110 -33 );
		$("#grid-table").jqGrid( 'setGridWidth', $(window).width()*0.99 );
	});
	
	var searchParamJson = {};
	
	$.each($("#searchForm").serializeArray(), function(){
		searchParamJson[this.name] = this.value;
	});
	
	var searchParam = {"searchParamJson" : JSON.stringify(searchParamJson)};

    $("#grid-table").jqGrid({
    	height: tableHeight,
    	url : BASE_URL + "/monitor/macalarmfault/list",
		datatype: "json",
		cache : false,
		mtype : 'post',
		colNames:colname,
		colModel:colmodel,
		postData : {
			searchParam:searchParam,
			handleStatus:0,
			alarmtime: "true"
        },
		sortname : 'STARTTIME',
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
		caption: "故障信息列表",
		autowidth: true,
        scrollOffset: 1,
        loadComplete:function(){
//        	$("#grid-table").jqGrid("setGridWidth", $(window).width() - 20);
        	tableScrollResize();
        }
	});
    
    /*报警处理*/
    $("#handleBtn").on("click", function(){
    	var ids = getSingleIds();
    	var rowdata = $("#grid-table").jqGrid('getRowData',ids[0]); //选中的一条记录
    	var alarmFaultId = rowdata.ALARMFAULTID;
    	var handleStatus = rowdata.HANDLESTATUS;
    	if($.trim(handleStatus) == "1"){
    		// 弹出提示信息
    		parent.toast("只能处理状态为未处理的报警");
    		return;
    	}
    	var isRemind=0;
    	parent.openWin(BASE_URL+"/monitor/macalarmfault/edit/" + alarmFaultId+"/"+isRemind, '审核页面','60%','50%');
    });

    /*批量报警处理*/
    $("#editBtn").on("click", function(){
    	var ids = getManyIds("请选择一条数据");
    	var alarmFaultIdArr = [];
    	for(var i = 0; i < ids.length; i++){
    		var rowdata = $("#grid-table").jqGrid('getRowData',ids[i]);
    		alarmFaultIdArr.push(rowdata.ALARMFAULTID);
    	}
    	// to string
    	var alarmFaultIdsStr = alarmFaultIdArr + "";
    	var isRemind=0;
    	parent.openWin(BASE_URL+"/monitor/macalarmfault/toBatchAlarmHandlePage/" + alarmFaultIdsStr+"/"+isRemind , '报警处理页面','55%','30%');
    });
    
});


/*加载*/
function reloadGrid(){
	
	var searchParamJson = {};
	
	$.each($("#searchForm").serializeArray(), function(){
		searchParamJson[this.name] = this.value;
	});
//	searchParamJson["districtcode"]=districtcode;
	var searchParam = {"searchParamJson" : JSON.stringify(searchParamJson)};	
	
	$("#grid-table").jqGrid('setGridParam',{
		page : 1,
		postData :  {
			searchParam:searchParam,
			handleStatus:0,
			alarmtime: "true"
        }
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

/**
 * 显示报警处理详情 
 */
function displayHandleInfo(alarmFaultId) {
	parent.openWin(BASE_URL+"/monitor/macalarmfault/displayHandleInfo/"+alarmFaultId,'详细','65%','65%');
}

function getQueryString(name){
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return  unescape(r[2]); return null;
}
