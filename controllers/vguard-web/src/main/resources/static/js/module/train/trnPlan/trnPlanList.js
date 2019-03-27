//综合信息中截止日期
$(function () {
	initSeachInput();
	initDateSeach("begintime","endtime");
    //显示操作权限按钮
    $("#tableOpers").displayOper();
    //投诉并立案事件列表分页表格
    var colname = [
            "计划id", "计划名称","培训主题", "负责人", "联系电话", "计划培训人数", "计划开始时间","计划结束时间","(计划/已)培训次数","已培训次数"],
        colmodel = [
            {
                name: "PLANID",
                index: "PLANID",
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
                    return '<a href="javascript:void(0);" onclick="display(\'' + obj.PLANID + '\',\'' + obj.PLANNAME + '\')">' + cellvalue + '</a>';
                }
            },
            {
                name: "PLANTITLE",
                index: "PLANTITLE",
                width: "15%",
                align: "center",
                sortable: false
            },
            {
                name: "LEADER",
                index: "LEADER",
                width: "8%",
                align: "center",
                sortable: true,
                hidden: false

            },
            {
                name: "PHONE",
                index: "PHONE",
                width: "10%",
                align: "center",
                sortable: true,
                hidden: false

            },
            {
                name: "PERNUM",
                index: "PERNUM",
                width: "10%",
                align: "center",
                sortable: true,
                hidden: false,
                formatter: function (cellvalue, options, obj) {
                    return '<a href="javascript:void(0);" onclick="loadPlanUser(\'' + obj.PLANID + '\')">' + cellvalue + '</a>';
                }
            },
            {
                name: "BEGINTIME",
                index: "BEGINTIME",
                width: "10%",
                align: "center",
                sortable: true,
                hidden: false,
                formatter: function (cellvalue, options, obj) {
                    return getFormatDateByLong(cellvalue, "yyyy-MM");
                }
            },
            {
                name: "ENDTIME",
                index: "ENDTIME",
                width: "10%",
                align: "center",
                sortable: true,
                hidden: false,
                formatter: function (cellvalue, options, obj) {
                    return getFormatDateByLong(cellvalue, "yyyy-MM");
                }
            },
            {
                name: "PLANCOUNT",
                index: "PLANCOUNT",
                width: "15%",
                align: "center",
                sortable: true,
                hidden: false,
                formatter: function (cellvalue, options, obj) {
                    return cellvalue + '/'+'<a href="javascript:void(0);" onclick="loadTrnRecord(\'' + obj.PLANID + '\')">' + obj.TRNCOUNT + '</a>';
                }
            },
            {
                name: "TRNCOUNT",
                index: "TRNCOUNT",
                width: "10%",
                align: "center",
                sortable: true,
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
        url: BASE_URL + "train/etstrnplan/list",
        datatype: "json",
        cache: false,
        mtype: "POST",
        colNames: colname,
        colModel: colmodel,
        postData: {
        	type:"gov"
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
        caption: "培训计划列表",
        autowidth: true
    });
    //显示新增页面
    $("#addBtn").off("click").on("click", function () {
        parent.openWin(BASE_URL
            + "views/module/train/trnPlan/addPlan.html?planid=-1",
            '新增培训计划', '50%', '70%');
    });

    //显示执行导出操作
    $("#importBtn").off("click").on("click", function () {
    	var curSelRowArr = $("#grid-table").jqGrid("getGridParam", "selarrrow");
        if (1 != curSelRowArr.length) {
            // 弹出提示信息
            parent.toast("请选择一条数据进行导入！");
            return;
        }
        var planid = $("#grid-table").jqGrid("getRowData", curSelRowArr[0]).PLANID;
    	parent.openWin(BASE_URL
                + "views/module/train/trnPlan/importPlanUser.html?planid="+planid,
                '导入计划培训人员', '35%', '25%');
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
        var trncount = $("#grid-table").jqGrid("getRowData", curSelRowArr[0]).TRNCOUNT;
        if (trncount > 0) {
        	parent.toast("该计划已被引用，不可编辑！");
            return;
		}
        //打开编辑页面
        var planid = $("#grid-table").jqGrid("getRowData", curSelRowArr[0]).PLANID;
        parent.openWin(BASE_URL
                + "views/module/train/trnPlan/addPlan.html?planid="+planid,
                '编辑培训计划', '50%', '70%');
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
        	var trncount = $("#grid-table").jqGrid("getRowData", curSelRecordArr[i]).TRNCOUNT;
        	console.log(trncount);
        	if (trncount > 0) {
        		parent.toast("该计划已被引用，不可删除！");
                return;
			}
            var planid = $("#grid-table").jqGrid("getRowData", curSelRecordArr[i]).PLANID;
            curSelRecordIdArr.push(planid);

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
                url: BASE_URL + "train/etstrnplan/delete",
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
	$("#begintime").val("");
	$("#endtime").val("");
    $("#planname").val("");
    $("#plantitle").val("");
    $("#leader").val("");
}

function seach(){
	 reloadGrid();
}

function loadTrnRecord(planid){
	parent.openWin(BASE_URL + "views/module/train/trnPlan/trnRecordList.html?planid=" + planid,
	        "培训记录", "50%", "60%");
}
function loadPlanUser(planid){
	parent.openWin(BASE_URL + "views/module/train/trnPlan/planUserList.html?planid=" + planid,
	        "计划培训人员", "40%", "50%");
}

function display(planid, name) {
    parent.openWin(BASE_URL + "views/module/train/trnPlan/trnPlanDisplay.html?planid=" + planid+"&isdisplay=display",
        name, "55%", "40%");
}

/**
 * 刷新加载培训记录分页表格数据
 */
function reloadGrid() {
    $("#grid-table").jqGrid("setGridParam", {
        page: 1,
        postData: {
        	planname: $("#planname").val(),
        	plantitle: $("#plantitle").val(),
        	leader: $("#leader").val(),
        	begintime:$("#begintime").val(),
        	endtime:$("#endtime").val()
        }
    }).trigger("reloadGrid");
}