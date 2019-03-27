/**
 * 隐患排查记录管理
 */
$(function () {
	
	initSeachInput();
	initDateSeach("startTime","endTime");
	
    //显示操作权限按钮
    $("#tableOpers").displayOper();
    //列表分页表格
    var colname = [
            "隐患排查计划id","计划名称", "计划主题","计划检查企业", "已检查单位","计划检查项目","负责人","开始时间","检查进度","检查状态"
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
                width: "15%",
                align: "center",
                sortable: false,
                formatter: function (cellvalue, options, obj) {
                    return '<a href="javascript:void(0);" onclick="display(\'' + obj.CHECKPLANID + '\',\'' + obj.PLANNAME + '\')">' + obj.PLANNAME + '</a>';
                }
            },
            {
                name: "CHECKTOPIC",
                index: "CHECKTOPIC",
                width: "15%",
                align: "center",
                sortable: false
            },
            {
                name: "PLANENTCOUNT",
                index: "PLANENTCOUNT",
                width: "15%",
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
                width: "15%",
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
                width: "15%",
                align: "center",
                sortable: false,
                formatter: function (cellvalue, options, obj){
                	return '<a href="javascript:void(0);" onclick="displayChecktem(\'' + obj.CHECKPLANID + '\')">' + cellvalue + '</a>';
                }
            },
            {
                name: "LEADER",
                index: "LEADER",
                width: "15%",
                align: "center",
                sortable: false,
                hidden: false
            },
            {
                name: "PLANBEGINTIME",
                index: "PLANBEGINTIME",
                width: "15%",
                align: "center",
                sortable: false,
                formatter: function (cellvalue, options, obj) {
                    return getSmpFormatDateByLong(obj.PLANBEGINTIME, false);
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
        $("#grid-table").jqGrid("setGridHeight", $(window).height() - $('.pcheck').height() - 190 - 33);
        $("#grid-table").jqGrid("setGridWidth", $(window).width() * 0.99);
    });

    $("#grid-table").jqGrid({
        height: tableHeight,
        url: BASE_URL + "hidden/hidcheckplan/complanlist",
        datatype: "json",
        cache: false,
        mtype: "POST",
        colNames: colname,
        colModel: colmodel,
        postData: {},
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
        caption: "安全检查记录列表",
        autowidth: true
    });
    //显示新增页面
    $("#addBtn").off("click").on("click", function () {
        parent.openWin(BASE_URL
            + "views/module/hidden/hiddenPlan/gov/govcommonplan/govcommonplanAdd.html?checkplanid=-1",
            '新增安全检查计划', '65%', '80%');
    });

    //显示编辑页面
    $("#editBtn").off("click").on("click", function () {
        //返回当前grid中复选框所选择的数据的id
        var curSelRowArr = $("#grid-table").jqGrid("getGridParam", "selarrrow");
        if (1 != curSelRowArr.length) {
            // 弹出提示信息
            parent.toast("请选择一条数据进行编辑！");
            return;
        }
    	var planstate = $("#grid-table").jqGrid("getRowData", curSelRowArr[0]).PLANSTATE;
    	if(planstate == "1"){
    		parent.toast("计划已开始执行，不能修改！");
            return;
    	} else if(planstate == "2"){
    		parent.toast("计划已执行完成，不能修改！");
            return;
    	}
        //打开编辑页面
        var checkplanid = $("#grid-table").jqGrid("getRowData", curSelRowArr[0]).CHECKPLANID;

        parent.openWin(BASE_URL + "views/module/hidden/hiddenPlan/gov/govcommonplan/govcommonplanAdd.html?checkplanid=" + checkplanid,
            "编辑安全检查计划", "65%", "80%");
    });

    //批量删除
    $("#delBtn").off("click").on("click", function () {
        // 返回当前grid中复选框所选择的数据的id
        var curSelRecordArr = $("#grid-table").jqGrid("getGridParam", "selarrrow");
        if (0 == curSelRecordArr.length) {
            // 弹出提示信息
            parent.toast("请选择需要删除的数据！");
            return;
        }

        var curSelRecordIdArr = [];
        for (var i = 0; i < curSelRecordArr.length; i++) {
        	var planstate = $("#grid-table").jqGrid("getRowData", curSelRecordArr[i]).PLANSTATE;
        	if(planstate == "1"){
        		parent.toast("计划已开始执行，不能删除！");
                return;
        	} else if(planstate == "2"){
        		parent.toast("计划已执行完成，不能删除！");
                return;
        	}
            var checkplanid = $("#grid-table").jqGrid("getRowData", curSelRecordArr[i]).CHECKPLANID;
            curSelRecordIdArr.push(checkplanid);

        }
        //执行删除操作
        delReps({"ids": curSelRecordIdArr.toString()});
    });

    /**
     * 执行删除操作
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
                        reloadGrid();// 刷新列表
                    } else {
                        parent.toast(json.msg);
                    }
                }
            });
        });
    }
    
});

function resetData(){
	$('#daterange-btn span').html(" 日期选择");
	$("#startTime").val("");
	$("#endTime").val("");
    $("#planname").val("");
    $("#planstate").val("");
}

function seach(){
	 reloadGrid();
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
		parent.openWin(BASE_URL + "views/module/hidden/hiddenPlan/gov/govcommonplan/checkfinishList.html?checkplanid=" + checkplanid + "&isgov=1",
				"已检查单位", "65%", "60%");
	}
}

/*计划检查项目*/
function displayChecktem(checkplanid){
	parent.openWin(BASE_URL+"views/module/hidden/hiddenPlan/gov/govcommonplan/checkitemList.html?checkplanid=" + checkplanid,
			"检查项目",'60%','70%');
}

function display(checkplanid, checkname) {
    parent.openWin(BASE_URL + "views/module/hidden/hiddenPlan/gov/govcommonplan/govcommonplanDisplay.html?checkplanid=" + checkplanid,
    		checkname, "60%", "70%");
}

/**
 * 刷新加载分页表格数据
 */
function reloadGrid() {
	var planname = $('#planname').val();
    var startTime = $('#startTime').val();
    var endTime = $('#endTime').val();
    var planstate = $("#planstate").val();
    if (planstate == "未执行") {
    	planstate = "0"
	}else if(planstate == "执行中"){
		planstate = "1"
	}else if(planstate == "已执行"){
		planstate = "2"
	}
    $("#grid-table").jqGrid("setGridParam", {
        page: 1,
        postData: {
        	planname: planname || '',
        	startTime: startTime || '',
        	endTime: endTime || '',
        	planstate: planstate || ''
        }
    }).trigger("reloadGrid");
}