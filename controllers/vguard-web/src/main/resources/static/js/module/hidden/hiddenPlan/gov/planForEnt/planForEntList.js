var tabFlag = "com";
$(function() {
	initSeachInput();
	initDateSeach("startTime","endTime");
	$("#dateDiv,#planStateDiv").show();
	// 显示操作权限按钮
	$("#tableOpers").displayOper();
	var $tabs = $("#tabs").tabs();
	
	$("#tabs ul li").off("click").on("click",function(){
		if ($tabs.tabs('option', 'selected') == 0) {
			tabFlag = "com";
			$("#leaderDiv,#iscycleDiv").hide();
			$("#dateDiv,#planStateDiv").show();
			
			reloadGrid(tabFlag);
		}else if($tabs.tabs('option', 'selected') == 1){
			tabFlag = "cyc";
			$("#dateDiv,#planStateDiv").hide();
			$("#leaderDiv,#iscycleDiv").show();
			reloadGrid(tabFlag);
		}
	});
	// 新增检查计划
	$("#addBtn").off("click").on("click", function (){
		if (tabFlag == "cyc") {
			parent.openWin(BASE_URL
					+ "views/module/hidden/hiddenPlan/gov/planForEnt/addCyclePlan.html?checkplanid=-1&creatergflag=2&pageIndex="+tabFlag,
					'新增周期检查计划', '53%', '73%');
		}else{
			parent.openWin(BASE_URL
		            + "views/module/hidden/hiddenPlan/gov/planForEnt/govcommonplanAdd.html?checkplanid=-1&creatergflag=2&pageIndex="+tabFlag,
		            '新增安全检查计划', '50%', '75%');
		}
    });
	/**
	 * 编辑操作
	 */
	$("#editBtn").off("click").on("click", function () {
        //返回当前grid中复选框所选择的数据的id
		 if (tabFlag == "com") {
			 var curSelRowArr = $("#conmmonplan-table").jqGrid("getGridParam", "selarrrow");
		        if (1 != curSelRowArr.length) {
		            // 弹出提示信息
		            parent.toast("请选择一条数据进行编辑！");
		            return;
		        }
		        var issuedtype = $("#conmmonplan-table").jqGrid("getRowData", curSelRowArr[0]).ISSUEDTYPE;
				if (issuedtype == '已下发') {
					parent.toast("计划已下发，不可编辑！");
					return;
				}

		        //打开编辑页面
		        var checkplanid = $("#conmmonplan-table").jqGrid("getRowData", curSelRowArr[0]).CHECKPLANID;

		        parent.openWin(BASE_URL + "views/module/hidden/hiddenPlan/gov/planForEnt/govcommonplanAdd.html?checkplanid=" + checkplanid+"&pageIndex="+tabFlag,
		            "编辑安全检查计划", '50%', '75%');
		 }else{
			 var curSelRowArr = $("#cycleplcn-table").jqGrid("getGridParam", "selarrrow");
			 if (1 != curSelRowArr.length) {
            // 弹出提示信息
				 parent.toast("请选择一条数据进行编辑！");
				 return;
			 }
			 var issuedtype = $("#cycleplcn-table").jqGrid("getRowData", curSelRowArr[0]).ISSUEDTYPE;
				if (issuedtype == '已下发') {
					parent.toast("计划已下发，不可编辑！");
					return;
				}
			 //打开编辑页面
			 var checkplanid = $("#cycleplcn-table").jqGrid("getRowData", curSelRowArr[0]).CHECKPLANID;
			 parent.openWin(BASE_URL + "views/module/hidden/hiddenPlan/gov/planForEnt/addCyclePlan.html?checkplanid=" + checkplanid+"&pageIndex="+tabFlag,
        		"编辑周期检查计划", '53%', '73%');
		 }
    });
	
	// 批量删除信息
	 $("#delBtn").off("click").on("click", function () {
		 var curSelRecordIdArr = [];
	        // 返回当前grid中复选框所选择的数据的id
		 if (tabFlag == "com") {
			 var curSelRecordArr = $("#conmmonplan-table").jqGrid("getGridParam", "selarrrow");
			 if (0 == curSelRecordArr.length) {
				 // 弹出提示信息
				 parent.toast("请选择需要删除的数据！");
				 return;
			 }
			 for (var i = 0; i < curSelRecordArr.length; i++) {
				 var issuedtype = $("#conmmonplan-table").jqGrid("getRowData", curSelRecordArr[i]).ISSUEDTYPE;
				 if (issuedtype == '已下发') {
					 parent.toast("计划已下发，不可删除！");
					 return;
				 }
				 var checkplanid = $("#conmmonplan-table").jqGrid("getRowData", curSelRecordArr[i]).CHECKPLANID;
				 curSelRecordIdArr.push(checkplanid);
				 
			 }
			 //执行删除操作
			 delReps({"ids": curSelRecordIdArr.toString()});
		 }else{
			 var curSelRowArr = $("#cycleplcn-table").jqGrid("getGridParam", "selarrrow");
		     if (0 == curSelRowArr.length) {
		            // 弹出提示信息
		           parent.toast("请选择需要删除的数据！");
		           return;
		     }
		       for (var i = 0; i < curSelRowArr.length; i++) {
		    	   var issuedtype = $("#cycleplcn-table").jqGrid("getRowData", curSelRowArr[i]).ISSUEDTYPE;
					 if (issuedtype == '已下发') {
						 parent.toast("计划已下发，不可删除！");
						 return;
					 }
		    	   var checkplanid = $("#cycleplcn-table").jqGrid("getRowData", curSelRowArr[i]).CHECKPLANID;
		    	   curSelRecordIdArr.push(checkplanid);
		        }
		 	}
		 //执行删除操作
		 delReps({"ids": curSelRecordIdArr.toString()});
	    });


	 $("#importBtn").off("click").on("click",function(){
		 var tab = tabFlag == 'com' ? 'conmmonplan-table':'cycleplcn-table';
		 var curSelRowArr = $("#"+tab).jqGrid("getGridParam", "selarrrow");
		 if (0 == curSelRowArr.length) {
	            // 弹出提示信息
	           parent.toast("请选择需要下发的计划！");
	           return;
	     }
		 var curSelRecordIdArr = [];
		 for (var i = 0; i < curSelRowArr.length; i++) {
	    	   var issuedtype = $("#"+tab).jqGrid("getRowData", curSelRowArr[i]).ISSUEDTYPE;
	    	   if(issuedtype == '已下发'){
	    		   parent.toast("已下发计划不可重复下发！");
		           return;
	    	   }
	    	   var checkplanid = $("#"+tab).jqGrid("getRowData", curSelRowArr[i]).CHECKPLANID;
	    	   curSelRecordIdArr.push(checkplanid);
	      }
		 downPlan({"ids": curSelRecordIdArr.toString()});
	 });
	initCommonPLanTable();
	initCyclePlanTable();
});

function resetData(){
    $("#planname").val("");
    $("#leader").val("");
    $("#iscycleplan").val("");
    $('#daterange-btn span').html(" 日期选择");
	$("#startTime").val("");
	$("#endTime").val("");
    $("#planstate").val("");
}

function seach(){
	 reloadGrid(tabFlag);
}

/**
 * 下发计划
 */
function downPlan(param) {
	parent.confirm("下发后计划不可编辑、删除!确认下发?", function () {
		$.ajax({
			type : "POST",
			async : false,
			dataType : "JSON",
			cache : false,
			url : BASE_URL + "hidden/hidcheckplan/downPlan",
			data : param,
			success : function(json) {
				if (json.success == true) {
                	parent.toast(json.msg);
                	reloadGrid(tabFlag);// 刷新列表
            	} else {
                	parent.toast(json.msg);
            	}
			}
		});
	});
}

/**
 * 执行删除操作
 * @param param
 */
function delReps(param) {
    //弹出提示框
    parent.confirm("确认删除吗?", function () {
        $.ajax({
            url: BASE_URL + "hidden/hidcheckplan/delete",
            type: "post",
            dataType: "json",
            data: param,
            success: function (json) {
                if (json.success == true) {
                    parent.toast(json.msg);
                    reloadGrid(tabFlag);// 刷新列表
                } else {
                    parent.toast(json.msg);
                }
            }
        });
    });
}

function initCyclePlanTable() {
	// 生成任务列表分页表格
	var colname = [ "计划id", "计划名称", "计划主题", "计划检查企业", "计划检查项目", "负责人",
			"是否开启周期", "计划是否下发","执行次数", "开启/关闭周期" ], colmodel = [
			{
				name : "CHECKPLANID",
				index : "CHECKPLANID",
				width : "5%",
				align : "center",
				sortable : false,
				hidden : true
			},
			{
				name : "PLANNAME",
				index : "PLANNAME",
				width : "20%",
				align : "center",
				sortable : false,
				formatter : function(cellvalue, options, obj) {
					return '<a href="javascript:void(0);" onclick="display(\''+ obj.CHECKPLANID + '\',\'' + obj.PLANNAME+ '\',\'cyc\')">' + obj.PLANNAME + '</a>';
				}
			},
			{
				name : "CHECKTOPIC",
				index : "CHECKTOPIC",
				width : "20%",
				align : "center",
				sortable : false,
			},
			{
				name : "PLANENTCOUNT",
				index : "PLANENTCOUNT",
				width : "15%",
				align : "center",
				sortable : false,
				formatter : function(cellvalue, options, obj) {
					return '<a href="javascript:void(0);" onclick="displayPlanEnt(\''
							+ obj.CHECKPLANID
							+ '\',\'JHJC\')">'
							+ obj.PLANENTCOUNT
							+ '</a>';
				}
			},
			{
				name : "PLANCHECKITEM",
				index : "PLANCHECKITEM",
				width : "10%",
				align : "center",
				sortable : false,
				formatter : function(cellvalue, options, obj) {
					return '<a href="javascript:void(0);" onclick="displayChecktem(\''
							+ obj.CHECKPLANID + '\')">' + cellvalue + '</a>';
				}
			},
			{
				name : "LEADER",
				index : "LEADER",
				width : "10%",
				align : "center",
				sortable : false
			},
			{
				name : "ISCYCLEPLAN",
				index : "ISCYCLEPLAN",
				width : "10%",
				align : "center",
				sortable : false,
				formatter : function(cellvalue, options, obj) {
					if (obj.ISCYCLEPLAN == 0) {
						return "否";
					} else if (obj.ISCYCLEPLAN == 1) {
						return "是";
					}
				}
			},
			{
				name : "ISSUEDTYPE",
				index : "ISSUEDTYPE",
				width : "10%",
				align : "center",
				sortable : false,
				formatter : function(cellvalue, options, obj) {
					if (cellvalue == 0) {
						return "未下发";
					} else if (cellvalue == 1) {
						return "已下发";
					}
				}
			},
			{
				name : "RUNNINGCOUNT",
				index : "RUNNINGCOUNT",
				width : "10%",
				align : "center",
				sortable : false,
				formatter : function(cellvalue, options, obj) {
					return '<a href="javascript:void(0);" onclick="displayHistory(\''
							+ obj.CHECKPLANID
							+ '\',\''
							+ obj.PLANNAME
							+ '\')">' + obj.RUNNINGCOUNT + '</a>';
				}
			},
			{
				name : "operation",
				index : "operation",
				width : "10%",
				align : "center",
				sortable : false,
				formatter : function(cellvalue, options, obj) {
					if (obj.ISCYCLEPLAN == 0) {
						return '<a href="javascript:void(0);" onclick="changeJobStatus(\''
								+ obj.CHECKPLANID + '\',\''+ obj.ISSUEDTYPE+ '\',\'start\')">开启</a>';
					} else if (obj.ISCYCLEPLAN == 1) {
						return '<a href="javascript:void(0);" onclick="changeJobStatus(\''
								+ obj.CHECKPLANID + '\',\''+ obj.ISSUEDTYPE+ '\',\'stop\')">关闭</a>';
					}
				}
			} ];
	// 分页表格响应式处理
	var tableHeight = $(window).height() - $(".pcheck").height() - 190 - 33;
	$(window).resize(
			function() {
				$("#cycleplcn-table").jqGrid("setGridHeight",
						$(window).height() - $('.pcheck').height() - 190 - 33);
				$("#cycleplcn-table").jqGrid("setGridWidth",
						$(window).width() * 0.975);
			});

	$("#cycleplcn-table").jqGrid({
		height : tableHeight,
		url : BASE_URL + "hidden/hidcheckplan/loadCyclePlanList",
		datatype : "json",
		cache : false,
		mtype : "POST",
		colNames : colname,
		colModel : colmodel,
		postData : {
			isgov:'2'//政府企业之下发计划
		},
		sortname : "CREATETIME",
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
		rowNum : 10,
		rowList : [ 10, 20, 30 ],
		altRows : true,
		multiselect : true,
//		caption : "周期检查计划列表",
		autowidth : true
	});
	$("#cycleplcn-table").jqGrid("setGridWidth", $(window).width() * 0.975);
}

function initCommonPLanTable() {
	// 生成任务列表分页表格
	var colname = [
	               "隐患排查计划id","计划名称", "计划主题","计划检查企业", "已检查单位","计划检查项目","负责人","开始时间","计划是否下发","检查进度","检查状态"
	           ],
	           colmodel = [
	               {
	                   name: "CHECKPLANID",
	                   index: "CHECKPLANID",
	                   width: "15%",
	                   align: "center",
	                   sortable: false,
	                   hidden: true
	               },
	               {
	                   name: "PLANNAME",
	                   index: "PLANNAME",
	                   width: "18%",
	                   align: "center",
	                   sortable: false,
	                   formatter: function (cellvalue, options, obj) {
	                       return '<a href="javascript:void(0);" onclick="display(\'' + obj.CHECKPLANID + '\',\'' + obj.PLANNAME + '\',\'com\')">' + obj.PLANNAME + '</a>';
	                   }
	               },
	               {
	                   name: "CHECKTOPIC",
	                   index: "CHECKTOPIC",
	                   width: "18%",
	                   align: "center",
	                   sortable: false
	               },
	               {
	                   name: "PLANENTCOUNT",
	                   index: "PLANENTCOUNT",
	                   width: "13%",
	                   align: "center",
	                   sortable: true,
	                   hidden: false,
	                   formatter: function (cellvalue, options, obj) {
	                       return '<a href="javascript:void(0);" onclick="displayPlanEnt(\'' + obj.CHECKPLANID + '\',\'JHJC\')">' + cellvalue + '</a>';
	                   }
	               },
	               {
	                   name: "FINISHCOUNT",
	                   index: "FINISHCOUNT",
	                   width: "13%",
	                   align: "center",
	                   sortable: true,
	                   hidden: false,
	                   formatter: function (cellvalue, options, obj) {
	                       return '<a href="javascript:void(0);" onclick="displayPlanEnt(\'' + obj.CHECKPLANID + '\',\'YJC\')">' + cellvalue + '</a>';
	                   }
	               },
	               {
	                   name: "ITEMCOUNT",
	                   index: "ITEMCOUNT",
	                   width: "13%",
	                   align: "center",
	                   sortable: false,
	                   formatter: function (cellvalue, options, obj){
	                   	return '<a href="javascript:void(0);" onclick="displayChecktem(\'' + obj.CHECKPLANID + '\')">' + cellvalue + '</a>';
	                   }
	               },
	               {
	                   name: "LEADER",
	                   index: "LEADER",
	                   width: "13%",
	                   align: "center",
	                   sortable: false,
	                   hidden: false
	               },
	               {
	                   name: "PLANBEGINTIME",
	                   index: "PLANBEGINTIME",
	                   width: "12%",
	                   align: "center",
	                   sortable: false,
	                   formatter: function (cellvalue, options, obj) {
	                       return getSmpFormatDateByLong(obj.PLANBEGINTIME, false);
	                   }
	               },
	               {
	   				name : "ISSUEDTYPE",
	   				index : "ISSUEDTYPE",
	   				width : "14%",
	   				align : "center",
	   				sortable : false,
	   				formatter : function(cellvalue, options, obj) {
	   					if (obj.ISSUEDTYPE == 0) {
	   						return "未下发";
	   					} else if (obj.ISSUEDTYPE == 1) {
	   						return "已下发";
	   					}
	   				}
	   				},
	               {
	               	name : "progress",
	                   index: "progress",
	                   width: "12%",
	                   align: "center",
	                   sortable: true,
	                   formatter: function (cellvalue, options, obj) {
	                   	if(obj.PLANSTATE == "0"){
	                       	return '<img src="../../../../../../images/module/hidden/progress0.png"  style="height:10px;width: 65%;" alt="0%" />';
	                       } else if(obj.PLANSTATE == "1") {
	                       	return '<img src="../../../../../../images/module/hidden/progress50.png" style="height:10px;width: 65%;" alt="50%" />';
	                       } else if(obj.PLANSTATE == "2"){
	                       	return '<img src="../../../../../../images/module/hidden/progress100.png" style="height:10px;width: 65%;" alt="100%" />';
	                       } else {
	                       	return "";
	                       }
	                   }
	               },
	               {
	                   name: "PLANSTATE",
	                   index: "PLANSTATE",
	                   width: "15%",
	                   align: "center",
	                   sortable: false,
	                   hidden: true
	               }
	           ];

	       //分页表格响应式处理
	       var tableHeight = $(window).height() - $(".pcheck").height() - 190 - 33;
	       $(window).resize(function () {
	           $("#conmmonplan-table").jqGrid("setGridHeight", $(window).height() - $('.pcheck').height() - 190 - 33);
	           $("#conmmonplan-table").jqGrid("setGridWidth", $(window).width() * 0.975);
	       });

	       $("#conmmonplan-table").jqGrid({
	           height: tableHeight,
	           url: BASE_URL + "hidden/hidcheckplan/complanlist",
	           datatype: "json",
	           cache: false,
	           mtype: "POST",
	           colNames: colname,
	           colModel: colmodel,
	           postData: {
	        	   isgov:'2'//政府企业之下发计划
	           },
	           sortname: "CREATETIME",
	           sortorder: "desc",
	           viewrecords: true,
	           pager: "#grid-pager",
	           jsonReader: {
	               root: "datas",
	               total: "total",
	               page: "page",
	               records: "records",
	               repeatitems: false
	           },
	           rowNum: 10,
	           rowList: [10, 20, 30],
	           altRows: true,
	           multiselect: true,
//	           caption: "安全检查记录列表",
	           autowidth: true
	       });
}

/**
 * 开启、关闭周期
 * @param jobId
 * @param cmd
 */
function changeJobStatus(jobId, issuedtype,cmd) {
	if (issuedtype == '0') {
		parent.toast("计划未下发不可开启周期");
		return;
	}
	$.ajax({
		type : "POST",
		async : false,
		dataType : "JSON",
		cache : false,
		url : BASE_URL + "hidden/hidcheckplan/changeJobStatus",
		data : {
			jobId : jobId,
			cmd : cmd
		},
		success : function(json) {
			if (json.success == true) {
                parent.toast(json.msg);
                reloadGrid(tabFlag);// 刷新列表
            } else {
                parent.toast(json.msg);
            }
		}
	});
}

/**
 * 执行次数
 * @param checkplanid
 * @param checkname
 */
function displayHistory(checkplanid, checkname) {
    parent.openWin(BASE_URL + "views/module/hidden/hiddenPlan/gov/govcycleplan/cyclePlanHistoryList.html?checkplanid=" + checkplanid,
    		checkname, "60%", "70%");
}

/**
 * 计划检查企业、已检查企业
 * @param checkplanid
 * @param flag
 */
function displayPlanEnt(checkplanid,flag){
	if (flag == "JHJC") {
		parent.openWin(BASE_URL + "views/module/hidden/hiddenPlan/gov/govcycleplan/PlanEntList.html?checkplanid=" + checkplanid,
				"计划检查企业", "65%", "60%");
	}else if(flag == "YJC"){
		parent.openWin(BASE_URL + "views/module/hidden/hiddenPlan/gov/govcommonplan/checkfinishList.html?checkplanid=" + checkplanid + "&isgov=0",
				"已检查单位", "65%", "60%");
	}
}

/*计划检查项目*/
function displayChecktem(checkplanid){
	parent.openWin(BASE_URL+"views/module/hidden/hiddenPlan/gov/govcommonplan/checkitemList.html?checkplanid=" + checkplanid,
			"检查项目",'60%','70%');
}

function display(checkplanid, checkname,flag) {
	if (flag =="com") {
		parent.openWin(BASE_URL + "views/module/hidden/hiddenPlan/gov/govcommonplan/govcommonplanDisplay.html?checkplanid=" + checkplanid,
				checkname, "60%", "70%");
	}else{
		parent.openWin(BASE_URL + "views/module/hidden/hiddenPlan/gov/govcycleplan/govCyclePlanDisplay.html?checkplanid=" + checkplanid,
	    		checkname, "60%", "70%");
	}
}

/**
 * 刷新加载分页表格数据
 */
function reloadGrid(cmd) {
	var planname = $("#planname").val();
	if (cmd == "com") {
		var planstate = $("#planstate").val();
		if (planstate == "未执行") {
	    	planstate = "0"
		}else if(planstate == "执行中"){
			planstate = "1"
		}else if(planstate == "已执行"){
			planstate = "2"
		}
		$("#conmmonplan-table").jqGrid("setGridParam", {
			page : 1,
			postData : {
				planname : planname,
				startTime : $("#startTime").val(),
				endTime : $("#endTime").val(),
				planstate : planstate,
			}
		}).trigger("reloadGrid");
	}else{
		var iscycleplan = $("#iscycleplan").val();
		if (iscycleplan == "否") {
			iscycleplan = "0"
		}else if(iscycleplan == "是"){
			iscycleplan = "1"
		}
		$("#cycleplcn-table").jqGrid("setGridParam", {
			page : 1,
			postData : {
				planname:planname,
	        	leader:$("#leader").val(),
	        	iscycleplan:iscycleplan
			}
		}).trigger("reloadGrid");
	}
}