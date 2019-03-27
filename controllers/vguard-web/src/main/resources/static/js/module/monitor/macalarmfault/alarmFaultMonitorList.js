$(function(){
	initDateSeach("stime","etime");
	
	var end = new Date();
	var start = new Date(end.getTime() - 6*24*60*60*1000);
	setTime(start,end);
	$(".ranges ul li:first").click();
	
	//显示操作权限按钮
    $("#tableOpers").displayOper();
	
    $('.factoryListContent ul').niceScroll({
        cursorborder: "#4d86d6",
        cursorcolor: "#4d86d6",
        background: false,
        horizrailenabled: true,
        autohidemode: false
    }).show().resize();
    $('.factoryListContent ul').on('click','li',function(){
        $('.factoryListContent ul li').removeClass('active');
        $(this).addClass('active');
        var entid = $('.active input').val();
//        var entname = $('.active').text();
//        $('#dangerTitle').html(entname+"故障报警");
        reloadGrid(entid);
    })
    
    loadAlarmMonitor();
    loadAlarmEntList();
    
});

function setTime(start, end) {
	$("#stime").val(start.format('yyyy-MM-dd'));
	$("#etime").val(end.format('yyyy-MM-dd'));
	$('#daterange-btn span').html(start.format('yyyy/MM/dd') + '-' + end.format('yyyy/MM/dd'));
}

function loadAlarmMonitor(){
	
	var colname = ['主键ID','企业名称','监测点位名称','开始时间','结束时间','状态','负责人','联系电话','处理状态code','处理情况','处理时间'];
	
	var colmodel = [
					{name:'ALARMFAULTID',index:'ALARMFAULTID',hidden:true},
					{name:'ENTNAME',index:'ENTNAME',align:'left', width : '15%'},
					{name:'PROBENAME',index:'PROBENAME',align:'left', width : '10%'},
					{name:'STARTTIME',index:'STARTTIME',align:'left',
						formatter:function(cellvalue, options, obj) {
							if(obj.STARTTIME == null)
								return "-";
							else
								return getSmpFormatDateByLong(obj.STARTTIME,true);
						}, width : '10%'},
					{name:'ENDTIME',index:'ENDTIME',align:'left',
						formatter:function(cellvalue, options, obj) { 
							if(obj.ENDTIME == null)
								return "-";
							else
								return getSmpFormatDateByLong(obj.ENDTIME,true);
						}, width : '10%'},
					{name:'STATUS_TEXT',index:'STATUS_TEXT',align:'left',
						formatter:function(cellvalue, options, obj) { 
							return "<span style='color:red'>"+SelectOption.getProbeState(obj.STATUS)+"</span>";
						}, width : '6%'
					},
					{name:'LEGALPERSON',index:'LEGALPERSON',align:'left', width : '6%'},
					{name:'PHONE',index:'PHONE',align:'left', width : '10%'},
					{name:'HANDLESTATUS',index:'HANDLESTATUS',align:'left', hidden : true},
					{name:'HANDLESTATUS_TEXT',index:'HANDLESTATUS_TEXT',align:'left',
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
					{name:'HANDLETIME',index:'HANDLETIME',align:'left',
						formatter:function(cellvalue, options, obj) {
							if(obj.HANDLETIME == null)
								return "-";
							else
								return getSmpFormatDateByLong(obj.HANDLETIME,false);
						}, width : '10%'}
				];
	
	
	var tableHeight = $(".dangerTable").height() - $('.pcheck').height() - 120;
	$(window).resize(function(){
		$("#grid-table").jqGrid( 'setGridHeight', $(".dangerTable").height() - $('.pcheck').height() - 120 );
//		$("#grid-table").jqGrid( 'setGridWidth', $(".dangerTable").width()*0.99 );
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
		postData : searchParam,
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
		caption: "故障报警列表",
		autowidth: true
//		,
//		loadComplete: function() {
//			if($(".dangerTable").width() < 700) {
//				$('.ui-jqgrid-htable').css({"width":"900"});
//				$("#grid-table").css({"width":"900"});
//				$("#grid-table").closest(".ui-jqgrid-bdiv").css({ "overflow-x" : "scroll","height":"350"});
//				$(".ui-jqgrid-hdiv").css({ "overflow-x" : "scroll"});
//			} else {
//				$("#grid-table").jqGrid( 'setGridWidth', $(".dangerTable").width()*0.99 );
//			}
//		}
	});
    
    //报警处理
    $("#handleBtn").off("click").on("click", function() {
    	var ids = $("#grid-table").jqGrid('getGridParam', 'selarrrow');
    	if (1 != ids.length) {
    		// 弹出提示信息
    		parent.toast("请选择一条记录！");
    		return;
    	} else {
//    	var ids = getSingleIds();
    		var rowdata = $("#grid-table").jqGrid('getRowData', ids[0]); //选中的一条记录
    		var alarmFaultId = rowdata.ALARMFAULTID,
    			handleStatus = rowdata.HANDLESTATUS;
    		
    		if ("1" == $.trim(handleStatus)) {
    			// 弹出提示信息
    			parent.toast("只能处理状态为未处理的报警");
    			return;
    		}
    		var isRemind = -1;
    		parent.openWin(BASE_URL + "/monitor/macalarmfault/edit/" + alarmFaultId + "/" + isRemind, '审核页面', '30%', '210px');
    	}
    });

    //批量报警处理
    $("#batHanBtn").off("click").on("click", function() {
//    	var ids = getManyIds("请选择一条数据");
    	var ids = $("#grid-table").jqGrid('getGridParam','selarrrow');
    	if (0 == ids.length) {
    		// 弹出提示信息
    		parent.toast("请至少选择一条记录!");
    		return;
    	} else {
    		var alarmFaultIdArr = [];
    		for(var i = 0; i < ids.length; i++){
    			var rowdata = $("#grid-table").jqGrid('getRowData',ids[i]);
    			
    			var handleStatus = rowdata.HANDLESTATUS;
    			if("1" == $.trim(handleStatus)){
    				// 弹出提示信息
    				parent.toast("只能处理状态为未处理的报警,请从新选择!");
    				return;
    			}
    			alarmFaultIdArr.push(rowdata.ALARMFAULTID);
    		}
    		// to string
    		var alarmFaultIdsStr = alarmFaultIdArr + "";
    		var isRemind = -1;
    		parent.openWin(BASE_URL+"/monitor/macalarmfault/toBatchAlarmHandlePage/" + alarmFaultIdsStr+"/"+isRemind  , '报警处理页面','30%','210px');
    	}
    });
}

//查询
function searchData(){
	reloadGrid();
	loadAlarmEntList("search");
}
//重置
function resetData(){
	$('#daterange-btn span').html(" 日期选择");
	$("#stime").val("");
	$("#etime").val("");
    $("#entname").val("");
}

/*加载*/
function reloadGrid(entid){
	
	var searchParamJson = {};
	
	$.each($("#searchForm").serializeArray(), function(){
		searchParamJson[this.name] = this.value;
	});
	searchParamJson["businessinfoid"] = entid;
	var searchParam = {"searchParamJson" : JSON.stringify(searchParamJson)};
	console.log(searchParamJson);
	$("#grid-table").jqGrid('setGridParam',{
		page : 1,
		postData : searchParam
	}).trigger("reloadGrid");
}


//加载右侧企业列表
function loadAlarmEntList(type){ 
	var entname = $('#entname').val();
	var stime = $('#stime').val();
	var etime = $('#etime').val();
    $.ajax({
        type: "post",
        url: BASE_URL + "monitor/macalarmfault/entlist",
        dataType: "json",
        data: {
        	entname: entname || '',
        	stime: stime || '',
        	etime: etime || ''
        },
        async:true,
        success: function (data) {
//        	console.log(data.entList);
        	$("#entList").empty();
        	$.each(data.entList,function(i,item){
//        		console.log(data.entList);
                var entlist = '<li>'+item.ENTNAME+'<input type="hidden" name="entid" value="'+item.BUSINESSINFOID+'"/></li>'
                $("#entList").append(entlist);
                if(type=="search"){
                	if(entname != null && entname != ''){                		
                		$("#entList").find("li:first-child").addClass('active');
                		var entid = $('.active input').val();
                	}
                	reloadGrid(entid);
                }
            }) 
        },
        error: function () {
            parent.toast("初始化信息加载失败!");
        }
    });
}

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
 * 显示故障报警处理详情 
 */
function displayHandleInfo(alarmFaultId) {
	parent.openWin(BASE_URL+"/monitor/macalarmfault/displayHandleInfo/"+alarmFaultId,'详细','30%','210px');
}


