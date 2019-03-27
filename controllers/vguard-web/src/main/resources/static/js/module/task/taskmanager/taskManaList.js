$(function () {
	//初始化任务类别下拉框
	SelectOption.loadTaskType("taskType");
	
	//初始化任务执行状态
	SelectOption.loadTaskStat("taskStat");
	
    //生成任务列表分页表格
    var colname = [
            "任务管理主键id", "任务名称", "待办类型", "任务类别", "被检查企业id", 
            "被检查企业名称", "主办执法人员id", "主办执法人", "协办执法人员id",
            "协办执法人", "描述", "任务执行状态", "任务开始日期", "任务结束日期", 
            "创建时间", "创建人id"
        ],
        colmodel = [
            {
                name: "TASKID",
                index: "TASKID",
                width: "15%",
                align: "center",
                sortable: false,
                hidden: true
            },
            {
            	name: "TASKNAME",
            	index: "TASKNAME",
            	width: "25%",
            	align: "left",
            	sortable: false,
	            formatter: function (cellvalue, options, obj) {
	            	return '<a href="javascript:void(0);" onclick="display(\'' + obj.TASKID + '\')">' + obj.TASKNAME + '</a>';
	            }
            },
            {
            	name: "BACKLOGTYPE",
            	index: "BACKLOGTYPE",
            	width: "15%",
            	align: "center",
            	sortable: false,
            	hidden: true
            },
            {
            	name: "TASKTYPE",
            	index: "TASKTYPE",
            	width: "15%",
            	align: "center",
            	sortable: false,
//            	formatter: function (cellvalue, options, obj) {
//            		var lastVal = null;
//            		switch (cellvalue) {
//					case "01": lastVal = "检查";
//						break;
//					case "02": lastVal = "复查";
//						break;
//					case "03": lastVal = "取证";
//						break;
//					case "04": lastVal = "告知";
//						break;
//					case "05": lastVal = "催缴";
//						break;
//					default: lastVal = "检查";
//						break;
//					}
//            		return lastVal;
//                },
                hidden: true
            },
            {
            	name: "BUSINESSINFOID",
            	index: "BUSINESSINFOID",
            	width: "15%",
            	align: "center",
            	sortable: false,
            	hidden: true
            },
            {
            	name: "ENTNAME",
            	index: "ENTNAME",
            	width: "25%",
            	align: "left",
            	sortable: false
            },
            {
            	name: "MASTER",
            	index: "MASTER",
            	width: "15%",
            	align: "center",
            	sortable: false,
            	hidden: true
            },
            {
            	name: "MASTERNAME",
            	index: "MASTERNAME",
            	width: "15%",
            	align: "left",
            	sortable: false
            },
            {
            	name: "SLAVEL",
            	index: "SLAVEL",
            	width: "15%",
            	align: "center",
            	sortable: false,
            	hidden: true
            },
            {
            	name: "SLAVELNAME",
            	index: "SLAVELNAME",
            	width: "15%",
            	align: "center",
            	sortable: false,
            	hidden: true
            },
            {
            	name: "TASKDESC",
            	index: "TASKDESC",
            	width: "15%",
            	align: "center",
            	sortable: false,
            	hidden: true
            },
            {
            	name: "TASKSTATE",
            	index: "TASKSTATE",
            	width: "15%",
            	align: "center",
            	sortable: false,
            	formatter: function (cellvalue, options, obj) {
            		if ("3" == cellvalue) {
            			return "完成";
            		} else if ("1" == cellvalue) {
            			return new Date().getTime() < obj.ENDTIME ? "未开始" : "延期";
            		} else if ("2" == cellvalue) {
            			return new Date().getTime() < obj.ENDTIME ? "进行中" : "延期";
            		} else {
            			return "未开始";
            		}
                }
            },
            {
            	name: "STARTTIME",
            	index: "STARTTIME",
            	width: "15%",
            	align: "center",
            	sortable: true,
//            	formatter: function (cellvalue, options, obj) {
//                    return getFormatDateByLong(obj.STARTTIME,
//                        "yyyy-MM-dd");
//                },
                hidden: true
            },
            {
            	name: "ENDTIME",
            	index: "ENDTIME",
            	width: "15%",
            	align: "center",
            	sortable: true,
            	formatter: function (cellvalue, options, obj) {
                    return getFormatDateByLong(obj.ENDTIME,
                        "yyyy-MM-dd");
                }
            },
            {
            	name: "CREATETIME",
            	index: "CREATETIME",
            	width: "15%",
            	align: "center",
            	sortable: false,
            	hidden: true
            },
            {
            	name: "CREATEUSERID",
            	index: "CREATEUSERID",
            	width: "15%",
            	align: "center",
            	sortable: false,
            	hidden: true
            }
        ];
    
  //分页表格响应式处理
    var tableHeight = $(window).height() - $(".pcheck").height() - 190 - 33;
    $(window).resize(function () {
        $("#grid-table").jqGrid("setGridHeight", $(window).height() - $('.pcheck').height() - 190 - 33);
        $("#grid-table").jqGrid("setGridWidth", $(window).width() * 0.99);
    });

    $("#grid-table").jqGrid({
        height: tableHeight,
        url: BASE_URL + "/task/managerlist",
        datatype: "json",
        cache: false,
        mtype: "POST",
        colNames: colname,
        colModel: colmodel,
        postData: {
        	taskName: $("#taskName").val(),
        	taskType: $("#taskType").val(),
        	taskStat: $("#taskStat").val(),
        	entName: $("#entName").val(),
        	startTime: $("#startTime").val(),
        	endTime: $("#endTime").val(),
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
        caption: "任务管理",
        autowidth: true
    });

    //查询按钮事件
    $("#searchbtn").off("click").on("click", function () {
        reloadGrid();
    });

    
    //派遣新任务
    $("#taskingBtn").off("click").on("click", function () {
        parent.openWin(BASE_URL + "/task/addManaTask",
            "派遣任务", "60%", "50%");
    });

    //编辑未开始的任务
    $("#editBtn").off("click").on("click", function (){
        //返回当前grid中复选框所选择的数据的id
        var curSelRowArr = $("#grid-table").jqGrid("getGridParam", "selarrrow");
        if (1 != curSelRowArr.length) {
            // 弹出提示信息
            parent.toast("请选择一条数据进行编辑！");
            return;
        }
        
        //未开始的任务打开编辑页面
        var taskstate = $("#grid-table").jqGrid("getRowData", curSelRowArr[0]).TASKSTATE,
        	taskid = $("#grid-table").jqGrid("getRowData", curSelRowArr[0]).TASKID;
        if ("未开始" == taskstate) {
        	parent.openWin(BASE_URL + "/task/editManaTask/" + taskid,
        			       "编辑任务", "60%", "50%");
        } else {
        	parent.toast("任务已开始，不能进行编辑操作！");
        }
    });
    
    //自主触发完成任务操作
    $("#comBtn").off("click").on("click", function () {
    	// 返回当前grid中复选框所选择的数据的id
    	var curSelRowArr = $("#grid-table").jqGrid("getGridParam", "selarrrow");
    	if (0 == curSelRowArr.length) {
    		// 弹出提示信息
    		parent.toast("请选择需要完成的任务！");
    		return;
    	}
    	
    	var curSelTaskIdArr = [];
        for (var i = 0; i < curSelRowArr.length; i++) {
        	var taskstate = $("#grid-table").jqGrid("getRowData", curSelRowArr[i]).TASKSTATE,
         		taskid = $("#grid-table").jqGrid("getRowData", curSelRowArr[i]).TASKID;
        	if ("完成" != taskstate) {
        		// 返回指定id行的数据
        		curSelTaskIdArr.push(taskid);
        	} else {
        		parent.toast("不能选择已完成的任务！");
        		return;
        	} 
        }
        
    	//执行完成任务操作
        completeTasks({"taskIds": curSelTaskIdArr.toString()});
    });
    
    /**
     * 完成任务
     */
    function completeTasks(curTaskIdsObj){
    	 //弹出提示框
        parent.confirm("确认完成任务吗?", function () {
            $.ajax({
                url: BASE_URL + "/task/comManaTask",
                type: "post",
                dataType: "json",
                data: curTaskIdsObj,
                success: function (json) {
                    if (json.success == true) {
                        parent.toast(json.msg);
                        reloadGrid();// 刷新列表
                    } else {
                        parent.toast(json.msg);
                    }
                }
            });
        });
    }
    
    //批量删除任务信息
    $("#delBtn").off("click").on("click", function () {
        // 返回当前grid中复选框所选择的数据的id
        var curSelRowArr = $("#grid-table").jqGrid("getGridParam", "selarrrow");
        if (0 == curSelRowArr.length) {
            // 弹出提示信息
            parent.toast("请选择需要删除的数据！");
            return;
        }

        var curSelTaskIdArr = [];
        for (var i = 0; i < curSelRowArr.length; i++) {
        	var taskstate = $("#grid-table").jqGrid("getRowData", curSelRowArr[i]).TASKSTATE,
     			taskid = $("#grid-table").jqGrid("getRowData", curSelRowArr[i]).TASKID;
        	if ("未开始" == taskstate) {
        		// 返回指定id行的数据
        		curSelTaskIdArr.push(taskid);
        	} else {
        		parent.toast("只允许删除未开始的任务！");
        		return;
        	}
        }
        //执行删除操作
        delTasks({"taskIds": curSelTaskIdArr.toString()});
    });
    
    /**
     * 执行删除操作
     */
    function delTasks(param) {
        //弹出提示框
        parent.confirm("确认删除吗?", function () {
            $.ajax({
                url: BASE_URL + "/task/delManaTask",
                type: "post",
                dataType: "json",
                data: param,
                success: function (json) {
                    if (json.success == true) {
                        parent.toast(json.msg);
                        reloadGrid();// 刷新列表
                    } else {
                        parent.toast(json.msg);
                    }
                }
            });
        });
    }
});

/**
 * 详细查看所派遣任务信息
 */
function display(taskId) {
	parent.openWin(BASE_URL + "/task/displayManaTask/" + taskId,
		       "查看任务详情", "60%", "50%");
}

/**
 * 刷新加载派遣任务分页表格数据
 */
function reloadGrid() {
    $("#grid-table").jqGrid("setGridParam", {
        page: 1,
        postData: {
        	taskName: $("#taskName").val(),
        	taskType: $("#taskType").val(),
        	taskStat: $("#taskStat").val(),
        	entName: $("#entName").val(),
        	startTime: $("#startTime").val(),
        	endTime: $("#endTime").val(),
        }
    }).trigger("reloadGrid");
}