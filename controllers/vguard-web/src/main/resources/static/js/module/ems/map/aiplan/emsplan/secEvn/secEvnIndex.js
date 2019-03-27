/**
 * 应急救援GIS首页-智能方案-次生方案
 * Created by Administrator on 2017/10/25
 */
$(function() {
	var isDisTask = getQueryString("isDisTask"), //当前是否显示指派任务
		isCallBack = getQueryString("isCallBack"),//当前是否需要弹窗回调
		schemaId = getQueryString("schemaId"),//当前所选方案id
		eventid = getQueryString("eventid"),//当前所选方案所处的事故id
		curNode = 3;//当前点位类别
	if ("0" != schemaId) {
//		alert("isDisTask" + isDisTask);
//		alert("isCallBack" + isCallBack);
//		alert("schemaId" + schemaId);
		
		//根据schemaId在窗口上面区域查询最新的次生事件内容------------------start-----------------------------------------
		var colname = ['事故ID', '事故类型', '事故名称', '可能后果', '现场处理方案']; 
		var colmodel = [
						{name:'proaccid',index:'proaccid',hidden:true},
						{name:'eventtypeid',index:'eventtypeid',align:'left',hidden:true},
						{name:'accidentname',index:'accidentname',align:'left',
							formatter : function(cellvalue, option, obj) {
								return "<a href = 'javascript:void(0)' onclick='displayEmsProcc(\""+obj.proaccid+"\")'>"+obj.accidentname+"</a>";
							}
						},
						{name:'probeconseq',index:'probeconseq',align:'left'},
						{name:'acchandes',index:'acchandes',align:'left'}
					];
		
		var tableHeight = $(window).height() - $('.pcheck').height() - 190 -33;
		$(window).resize(function(){
			$("#secEvnGrid-table").jqGrid( 'setGridHeight', 140 );
			$("#secEvnGrid-table").jqGrid( 'setGridWidth', $(window).width() - 30 );
		});
		
		var searchParamJson = {"eventid" : eventid};
		
		var searchParam = {"searchParamJson" : JSON.stringify(searchParamJson)};

	    $("#secEvnGrid-table").jqGrid({
	    	height: "140px",
	    	url : BASE_URL + "/ems/emsplaproacc/proacclist",
			datatype: "json",
			cache : false,
			mtype : 'get',
			colNames:colname,
			colModel:colmodel,
			postData : searchParam,
			sortname : 'UPDATETIME',
			sortorder : "desc",
			viewrecords : true,
			pager : "#secEvnGrid-pager",
			jsonReader : {
				root : "datas",
				total : "total",
				page : "page",
				records : "records",
				repeatit : false
			},
			rowNum:10,
			rowList:[10,20,30],
			altRows: true,
			multiselect: true,
			caption: "可能事故列表",
			autowidth: true,
			loadComplete: function() {
				if($(window).width() < 700) {
					$('.ui-jqgrid-htable').css({"width":"900"});
					$("#secEvnGrid-table").css({"width":"900"});
					$("#secEvnGrid-table").closest(".ui-jqgrid-bdiv").css({ "overflow-x" : "scroll"});
//					$(".ui-jqgrid-hdiv").css({ "overflow-x" : "scroll"});
					$(".table-line .tableTitle").find("button").css({"margin-right":"0px","margin-top":"7px"});
				} else {
					$("#secEvnGrid-table").jqGrid( 'setGridWidth', $(window).width() - 30 );
				}
				
				$("#secEvnGrid-table").jqGrid( 'setGridHeight', 140);
				$("#secEvnGrid-table").jqGrid( 'setGridWidth', $(window).width() - 30 );
//				if($(window).width() < 700) {
//					$('.ui-jqgrid-htable').css({"width":"900"});
//					$("#secEvnGrid-table").css({"width":"900"});
//					$("#secEvnGrid-table").closest(".ui-jqgrid-bdiv").css({ "overflow-x" : "scroll","height":"350"});
//					$(".ui-jqgrid-hdiv").css({ "overflow-x" : "scroll"});
//				} else {
//					$("#secEvnGrid-table").jqGrid( 'setGridWidth', $(window).width()*0.99 );
//				}
			}
		});
		//--------------------------------end--------------------------------------------------------------------------

	    
		//当需要下发任务时--------------------------------------------公共代码部分-------------------------------------------------
		if ("1" == isDisTask) {
			//显示任务下发div
			$("#disTaskForm").show();
			
			//初始化任务下发所选目标下拉框--默认下发给达拉特气象局用户
			SelectTree.loadAiPlanTskOrgSelect("respTaskOrg");
			
			//任务指派状态按钮
			$("#respTaskStatBtn").off("click").on("click", function() {
				if ("none" == $("#tskGrid").css("display")) {
					$("#tskGrid").show();
					if (0 == $("#tskGrid-table").children().size()) {
						initTaskGird(schemaId, curNode);
					} else {
						refreshTaskGird(schemaId, curNode);
					}
				} else {
					$("#tskGrid").hide();
				}
			});
			
			//任务下发
			$("#disTaskForm").validate({
				rules: {
					taskcontent: {
						required: true,
						maxlength: 1000
					},
					respTaskOrg: {
						required: true
					}
				},
				messages: {
					taskcontent: {
						required: "任务内容不能为空",
						maxlength: "任务内容不能超过1000个字符"
					},
					respTaskOrg: {
						required: "下发机构不能为空"
					}
				},
				submitHandler: function(form) {
					var param = [{"name": "schemeid", "value": schemaId},
					             {"name": "taskreceiver", "value": $("input[name='respTaskOrgId']").val()},
					             {"name": "node", "value": curNode},
					             {"name": "taskcontent", "value": $("#taskcontent").val()}
					             ];
					$.ajax({
						type: "post",
						url: BASE_URL + "ems/emssucisstask/save",
						data: param,
						success: function(data) {
							if (data.success == true ){
								//刷新响应任务分页表格
								if ("none" != $("#tskGrid").css("display")) {
									refreshTaskGird(schemaId, curNode);
								}
								
								//如果需要回调更改当前方案下任务节点颜色改变
								if ("1" == isCallBack) {
									window.top.GEventObject.fireEvent("EMS_AiPLAN_TASKNODECLK_EVENT", "2");
								}
							}
							parent.toast(data.msg);//弹出提示信息
						}
					});
			    }   
			});
			//任务下发按钮
//			$("#respTaskDisBtn").off("click").on("click", function() {
//				//保存所下发的应急响应任务
//				var taskreceiver = $("input[name='respTaskOrgId']").val();
//				if ("" != taskreceiver) {} else {
//					parent.toast("请选择下发机构");//弹出提示信息
//				}
//			});
		}
	}
});

/**
 * 初始化加载当前方案下的任务分页表格
 * @param schemaId
 */
function initTaskGird(schemaId, curNode) {
	var colname = ['主键', '方案ID', '方案节点', '接收人id', '接收人','下发时间', '完成时间', '任务状态', '任务跟踪', '任务内容']; 
	var colmodel = [
					{name: 'TASKID',index: 'TASKID', width: '5%', hidden: true},
					{name: 'SCHEMEID',index: 'SCHEMEID', width: '5%', hidden: true},
					{name: 'NODE',index: 'NODE', width: '5%', hidden: true},
					{name: 'TASKRECEIVER', align: 'center', index: 'TASKRECEIVER', width: '5%', hidden: true},
					{name: 'RECEIVERNAME', align: 'center', index: 'RECEIVERNAME', width: '5%'},
					{name: 'RECEIVETIME', align: 'center', index: 'RECEIVETIME', formatter : function(cellvalue, options, obj) {
						return getFormatDateByLong(cellvalue, "yyyy-MM-dd hh:mm:ss");
					}, width: '5%'},
					{name: 'FINISHTIME', align: 'center', index: 'FINISHTIME', formatter : function(cellvalue, options, obj) {
						if (cellvalue) {
							return getFormatDateByLong(cellvalue, "yyyy-MM-dd hh:mm:ss");
						} else {
							return "-";
						}
					}, width: '5%'},
					{name: 'TASKSTATUS', align: 'center', index: 'TASKSTATUS', width: '5%', formatter : function(cellvalue, options, obj) {
						if ("0" == cellvalue) {
							return "未开始";
						} else if ("1" == cellvalue) {
							return "进行中";
						} else if ("2" == cellvalue) {
							return "已完成";
						}
					}},
					{name: '', width: '5%', align: 'center', formatter : function(cellvalue, options, obj) {
						return '<a href="javascript:void(0);" onclick="traceTask(\''+obj.TASKID+'\',\''+obj.TASKRECEIVER+'\')">跟踪</a>';
					}},
					{name: 'TASKCONTENT',index: 'TASKCONTENT', width: '5%', hidden: true}
					];
	
	$(window).resize(function(){
		$("#grid-table").jqGrid( 'setGridWidth', $(window).width()*0.99 );
	});

    $("#tskGrid-table").jqGrid({
    	height: 250,
    	url : BASE_URL + "ems/emssucisstask/list",
		datatype: "json",
		cache : false,
		mtype : 'post',
		colNames:colname,
		colModel:colmodel,
		postData : {
			"schemaId": schemaId,
			"curNode": curNode
		},
		sortname : 'RECEIVETIME',
		sortorder : "desc",
		viewrecords : true,
		pager : "#tskGrid-pager",
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
		rownumbers:true,
		rownumWidth:40,
		scroll: true,
		multiselect: false,
		//caption: "应急队伍列表",
		autowidth: true,
        loadComplete: function() {
			if($(window).width() < 400) {
				$('.ui-jqgrid-htable').css({"width":"900"});
				$("#tskGrid-table").css({"width":"900"});
				$("#tskGrid-table").closest(".ui-jqgrid-bdiv").css({ "overflow-x" : "scroll","height":"350"});
				$(".ui-jqgrid-hdiv").css({ "overflow-x" : "scroll"});
			} else {
				$("#tskGrid-table").jqGrid( 'setGridWidth', $(window).width()*0.99 );
			}
		}
	});
}

/**
 * 根据任务id弹出相应的任务下的消息通信窗口
 * @param taskId
 */
function traceTask(taskId, receiver) {
	parent.openWin(BASE_URL + "views/module/ems/map/aiplan/common/aiPlanNodeTskTrace.html?taskId=" + taskId +
				   "&receiver=" + receiver, "任务跟踪", "50%", "66%");
}

/**
 * 根据当前方案id刷新下面的任务表格
 * @param schemaId
 */
function refreshTaskGird(schemaId, curNode) {
	$("#tskGrid-table").jqGrid('setGridParam',{
		page: 1,
		postData: {
			"schemaId": schemaId,
			"curNode": curNode
		}
	}).trigger("reloadGrid");
}


/**
 * 获取当前url访问路径后缀参数值
 * @param name
 * @returns
 */
function getQueryString(name) {
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}

/*次生事件详细查询*/
function displayEmsProcc(proAccId){
	parent.openWin(BASE_URL+"/ems/emsplaproacc/display/" + proAccId, '详细','40%','24%');
}