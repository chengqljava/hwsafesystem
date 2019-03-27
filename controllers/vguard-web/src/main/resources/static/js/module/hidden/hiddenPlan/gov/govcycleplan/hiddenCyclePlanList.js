	/**
	 * 隐患计划
	 */
$(document).ready(function () {
	
	initSeachInput();
	//显示操作权限按钮
	$("#tableOpers").displayOper();
    //生成任务列表分页表格
    var colname = ["计划id","计划名称","计划主题","计划检查企业","计划检查项目","负责人","是否开启周期","执行次数","开启/关闭周期"],
        colmodel = [
            {
                name: "CHECKPLANID",
                index: "CHECKPLANID",
                width: "5%",
                align: "center",
                sortable: false,
                hidden: true
            },
            {
                name: "PLANNAME",
                index: "PLANNAME",
                width: "10%",
                align: "center",
                sortable: false,
                formatter: function (cellvalue, options, obj) {
                    return '<a href="javascript:void(0);" onclick="display(\'' + obj.CHECKPLANID + '\',\'' + obj.PLANNAME + '\')">' + obj.PLANNAME + '</a>';
                }
            },
            {
            	name: "CHECKTOPIC",
            	index: "CHECKTOPIC",
            	width: "10%",
            	align: "center",
            	sortable: false,
            },
            {
                name: "PLANENTCOUNT",
                index: "PLANENTCOUNT",
                width: "15%",
                align: "center",
                sortable: false,
            	formatter: function (cellvalue, options, obj) {
            		return '<a href="javascript:void(0);" onclick="planEntList(\'' + obj.CHECKPLANID + '\')">' + obj.PLANENTCOUNT + '</a>';
            	}
            },
            {
            	name: "PLANCHECKITEM",
            	index: "PLANCHECKITEM",
            	width: "10%",
            	align: "center",
            	sortable: false,
            	formatter: function (cellvalue, options, obj) {
            		return '<a href="javascript:void(0);" onclick="displayChecktem(\'' + obj.CHECKPLANID + '\')">' + cellvalue + '</a>';
            	}
            },
            {
            	name: "LEADER",
            	index: "LEADER",
            	width: "10%",
            	align: "center",
            	sortable: false
            },
            {
            	name: "ISCYCLEPLAN",
            	index: "ISCYCLEPLAN",
            	width: "10%",
            	align: "center",
            	sortable: false,
            	formatter: function (cellvalue, options, obj) {
            		if (obj.ISCYCLEPLAN == 0) {
						return "否";
					}else if(obj.ISCYCLEPLAN == 1){
						return "是";
					}
            	}
            },
            {
            	name: "RUNNINGCOUNT",
            	index: "RUNNINGCOUNT",
            	width: "10%",
            	align: "center",
            	sortable: false,
            	formatter : function(cellvalue, options, obj) {
            		return '<a href="javascript:void(0);" onclick="displayHistory(\'' + obj.CHECKPLANID + '\',\'' + obj.PLANNAME + '\')">'+obj.RUNNINGCOUNT+'</a>';
        		}
            },
            {
            	name: "operation",
            	index: "operation",
            	width: "10%",
            	align: "center",
            	sortable: false,
            	formatter:function(cellvalue, options, obj) { 
            		if(obj.ISCYCLEPLAN == 0){
            			return '<a href="javascript:void(0);" onclick="changeJobStatus(\'' + obj.CHECKPLANID + '\',\'start\')">开启</a>';
            		} else if(obj.ISCYCLEPLAN == 1){
            			return '<a href="javascript:void(0);" onclick="changeJobStatus(\'' + obj.CHECKPLANID + '\',\'stop\')">关闭</a>';
            		}
    			}
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
        url: BASE_URL + "hidden/hidcheckplan/loadCyclePlanList",
        datatype: "json",
        cache: false,
        mtype: "POST",
        colNames: colname,
        colModel: colmodel,
        postData: {
        	isgov:'1'//政府
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
        caption: "周期检查计划列表",
        autowidth: true
    });
    /**
     * 新增
     */
    $("#addBtn").off("click").on("click", function (){
    	parent.openWin(BASE_URL
				+ "views/module/hidden/hiddenPlan/gov/govcycleplan/addCyclePlan.html?checkplanid=-1",
				'新增周期计划', '53%', '73%');
    });
    
    /**
     * 编辑
     */
    $("#editBtn").off("click").on("click", function () {
        //返回当前grid中复选框所选择的数据的id
        var curSelRowArr = $("#grid-table").jqGrid("getGridParam", "selarrrow");
        if (1 != curSelRowArr.length) {
            // 弹出提示信息
            parent.toast("请选择一条数据进行编辑！");
            return;
        }
        var runningcount = $("#grid-table").jqGrid("getRowData", curSelRowArr[0]).RUNNINGCOUNT;
        runningcount =  runningcount.substring(runningcount.indexOf("</a>")-1,runningcount.indexOf("</a>"));
        if(parseInt(runningcount) >0){
        	parent.toast("计划已开始执行，不可编辑！");
        	return;
        }
        //打开编辑页面
        var checkplanid = $("#grid-table").jqGrid("getRowData", curSelRowArr[0]).CHECKPLANID;
        parent.openWin(BASE_URL + "views/module/hidden/hiddenPlan/gov/govcycleplan/addCyclePlan.html?checkplanid=" + checkplanid,
            "编辑周期计划", '55%', '75%');
    });
    
    
    //批量删除任务信息
    $("#delBtn").off("click").on("click", function () {
        // 返回当前grid中复选框所选择的数据的id
    	var curSelRowArr = $("#grid-table").jqGrid("getGridParam", "selarrrow");
        if (0 == curSelRowArr.length) {
            // 弹出提示信息
            parent.toast("请选择需要删除的数据！");
            return;
        }
        var curSeltaskIdArr = [];
        for (var i = 0; i < curSelRowArr.length; i++) {
        	var runningcount = $("#grid-table").jqGrid("getRowData", curSelRowArr[i]).RUNNINGCOUNT;
        	runningcount =  runningcount.substring(runningcount.indexOf("</a>")-1,runningcount.indexOf("</a>"));
        	if(parseInt(runningcount) >0){
        		parent.toast("计划已开始执行，不可删除！");
        		return;
        	}
        	var checkplanid = $("#grid-table").jqGrid("getRowData", curSelRowArr[i]).CHECKPLANID;
        	curSeltaskIdArr.push(checkplanid);
        }
        //执行删除操作
        delCheckTask({"ids": curSeltaskIdArr.toString()});
    });
});

/**
 * 执行删除操作
 */
function delCheckTask(param) {
    //弹出提示框
    parent.confirm("确认删除任务吗?", function () {
        $.ajax({
            url: BASE_URL + "hidden/hidcheckplan/delete",
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

function resetData(){
    $("#planname").val("");
    $("#leader").val("");
    $("#iscycleplan").val("");
    
}

function seach(){
	 reloadGrid();
}

/**
 * 开启、关闭周期
 * @param jobId
 * @param cmd
 */
function changeJobStatus(jobId, cmd) {
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
				reloadGrid();// 刷新列表
			} else {
				parent.toast(json.msg);
			}
		}
	});
}

/**
 * 周期计划
 * @param checkplanid
 * @param checkname
 */
function display(checkplanid, checkname) {
    parent.openWin(BASE_URL + "views/module/hidden/hiddenPlan/gov/govcycleplan/govCyclePlanDisplay.html?checkplanid=" + checkplanid,
    		checkname, "60%", "70%");
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
 * 计划检查企业列表
 * @param checkplanid
 */
function planEntList(checkplanid){
	parent.openWin(BASE_URL+'views/module/hidden/hiddenPlan/gov/govcycleplan/PlanEntList.html?checkplanid='+checkplanid,'计划检查企业',"65%", "60%");
}

/*计划检查项目*/
function displayChecktem(checkplanid){
	parent.openWin(BASE_URL+"views/module/hidden/hiddenPlan/gov/govcommonplan/checkitemList.html?checkplanid=" + checkplanid,
			"检查项目",'70%','75%');
}

/**
 * 查看计划检查项目
 * @param checkplanid
 */
function planCheckItems(checkplanid) {
	parent.openWin(BASE_URL + "views/module/hidden/hiddenPlan/gov/govcycleplan/PlanCheckItems.html?checkplanid="+checkplanid,"计划检查检查项目", "70%", "75%");
}

/**
 * 刷新时加载查询条件
 */
function reloadGrid() {
	var iscycleplan = $("#iscycleplan").val();
	if (iscycleplan == "否") {
		iscycleplan = "0"
	}else if(iscycleplan == "是"){
		iscycleplan = "1"
	}
    $("#grid-table").jqGrid("setGridParam", {
        page: 1,
        postData: {
        	planname:$("#planname").val(),
        	leader:$("#leader").val(),
        	iscycleplan:iscycleplan
        }
    }).trigger("reloadGrid");
}