$(document).ready(function () {
	initSeachInput();
	initDateSeach("sendtimefrom","sendernameto");
	
    $("#tableOpers").displayOper();

    var colname = ["任务id", "任务编号", "任务标题", "下发单位", "下发人", "下发时间", "任务状态", "接收单位", "接收人", "接收时间","操作"],
        colmodel = [
            {
                name: "NORMALTASKID",
                index: "NORMALTASKID",
                align: "center",
                sortable: false,
                hidden: true
            }, {
                name: "NORMALTASKNO",
                index: "NORMALTASKNO",
                width: "10%",
                align: "center",
                sortable: false,
                formatter: function (cellvalue, options, obj) {
                    return '<a href="javascript:void(0);" onclick="display(\'' + obj.NORMALTASKID + '\')">' + (obj.NORMALTASKNO || "空") + '</a>';
                }
            }, 
            {
                name: "NORMALTASKTITLE",
                index: "NORMALTASKTITLE",
                width: "10%",
                align: "center",
                sortable: false,
                formatter: function (cellvalue, options, obj) {
                    return '<a href="javascript:void(0);" onclick="display(\'' + obj.NORMALTASKID + '\')">' + (obj.NORMALTASKTITLE || "空") + '</a>';
                }
            },
            {
            	name: "SENDERORGNAME",
            	index: "SENDERORGNAME",
            	width: "10%",
            	align: "center",
            	sortable: false
            },
            {
                name: "SENDERNAME",
                index: "SENDERNAME",
                width: "10%",
                align: "center",
                sortable: false
            }, {
                name: "SENDTIME",
                index: "SENDTIME",
                width: "10%",
                align: "center",
                sortable: false,
                formatter: function (cellvalue, options, obj) {
                    if (obj.SENDTIME) {
                        return getSmpFormatDateByLong(obj.SENDTIME, true);
                    } else {
                        return "";
                    }
                }
            }, {
                name: "TASKSTATUS",
                index: "TASKSTATUS",
                width: "7%",
                align: "center",
                sortable: false,
                formatter: function (cellvalue, options, obj) {
                    return SelectOption.getTaskStatusData(obj.TASKSTATUS);
                }
            }, {
                name: "RECEIVERORGNAME",
                index: "RECEIVERORGNAME",
                width: "10%",
                align: "center",
                sortable: false
            }, {
                name: "RECEIVERNAME",
                index: "RECEIVERNAME",
                width: "5%",
                align: "center",
                sortable: false
            },
            {
                name: "RECEIVETIME",
                index: "RECEIVETIME",
                width: "8%",
                align: "center",
                sortable: false,
                formatter: function (cellvalue, options, obj) {
                    if (obj.RECEIVETIME) {
                        return getSmpFormatDateByLong(obj.RECEIVETIME, true);
                    } else {
                        return "";
                    }
                }
            },{
                name: "ISCAN",
                index: "ISCAN",
                width: "5%",
                align: "center",
                sortable: false,
                formatter: function (cellvalue, options, obj) {
                    if (obj.ISCAN=='1') {
                        return '<a href="javascript:void(0);" onclick="recive(\'' + obj.NORMALTASKID + '\')">接收</a>';
                    } else {
                        return "--";
                    }
                }
            }];
    //分页表格响应式处理
    var tableHeight = $(window).height() - $(".pcheck").height() - 190 - 33;
    $(window).resize(function () {
        $("#grid-table").jqGrid("setGridHeight", $(window).height() - $('.pcheck').height() - 190 - 33);
        $("#grid-table").jqGrid("setGridWidth", $(window).width() * 0.99);
    });

    $("#grid-table").jqGrid({
        height: tableHeight,
        url: BASE_URL + "ems/emssucnormaltask/list",
        datatype: "json",
        cache: false,
        mtype: "POST",
        colNames: colname,
        colModel: colmodel,
        postData: {
        	"normaltasktitle": $("#normaltasktitle").val(),
        	"sendername": $("#sendername").val(),
        	"senderorgname": $("#senderorgname").val(),
        	"receivername": $("#receivername").val(),
        	"receiverorgname": $("#receiverorgname").val(),
        	"sendtimefrom": $("#sendtimefrom").val(),
        	"sendernameto": $("#sendernameto").val()
        },
        sortname: "NORMALTASKID",
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
        caption: "警情任务列表",
        autowidth: true
    });

    //查询按钮事件
//    $("#searchbtn").off("click").on("click", function () {
//        reloadGrid();
//    });

    //添加警情任务
    $("#addBtn").off("click").on("click", function () {
        parent.openWin(BASE_URL
            + "views/module/ems/emssucnormaltask/emssucnormaltaskAdd.html?normaltaskid=-1",
            '添加警情任务', '70%', '55%');
    });

    //修改警情任务
    $("#editBtn").off("click").on("click", function () {
        //返回当前grid中复选框所选择的数据的id
        var curSelRowArr = $("#grid-table").jqGrid("getGridParam", "selarrrow");
        if (1 != curSelRowArr.length) {
            // 弹出提示信息
            parent.toast("请选择一条数据进行编辑！");
            return;
        }
        var taskstatus = $("#grid-table").jqGrid("getRowData", curSelRowArr[0]).TASKSTATUS;
        console.log(taskstatus);
        if (taskstatus == '已完成') {
            parent.toast("任务已完成，无法修改！");
            return;
        }

        var normaltaskid = $("#grid-table").jqGrid("getRowData", curSelRowArr[0]).NORMALTASKID;
        //TODO 弹出编辑框
        parent.openWin(BASE_URL
            + "views/module/ems/emssucnormaltask/emssucnormaltaskAdd.html?normaltaskid=" + normaltaskid,
            '修改警情任务', '70%', '55%');

    });

    //处理警情任务
    $("#handleBtn").off("click").on("click", function () {
        //返回当前grid中复选框所选择的数据的id
        var curSelRowArr = $("#grid-table").jqGrid("getGridParam", "selarrrow");
        if (1 != curSelRowArr.length) {
            // 弹出提示信息
            parent.toast("请选择一条任务！");
            return;
        }
        var normaltaskid = $("#grid-table").jqGrid("getRowData", curSelRowArr[0]).NORMALTASKID;
        var taskstatus = $("#grid-table").jqGrid("getRowData", curSelRowArr[0]).TASKSTATUS;
        console.log(taskstatus);
        if (taskstatus == '已完成') {
            parent.toast("请不要重复执行任务！");
            return;
        }
        //TODO 弹出编辑框
        parent.openWin(BASE_URL
            + "views/module/ems/emssucnormaltask/emssucnormaltaskHandle.html?normaltaskid=" + normaltaskid,
            '执行警情任务', '50%', '30%');

    });
});

function resetData(){
	$('#daterange-btn span').html(" 日期选择");
	$("#sendtimefrom").val("");
	$("#sendernameto").val("");
    $("#normaltasktitle").val("");
    $("#sendername").val("");
    $("#receivername").val("");
    $("#receiverorgname").val("");
}

function seach(){
	 reloadGrid();
}



/**
 * 详细查看任务
 */
function display(normaltaskid) {
    //返回当前grid中复选框所选择的数据的id
    parent.openWin(BASE_URL + "views/module/ems/emssucnormaltask/emssucnormaltaskDisplay.html?normaltaskid=" + normaltaskid,
        "警情任务详情", "70%", "70%");
}

/**
 * 接收任务
 */
function recive(normaltaskid) {
    $.ajax({
        type: "post",
        url: BASE_URL + "ems/emssucnormaltask/recive",
        dataType: "json",
        data: {
            normaltaskid: normaltaskid
        },
        success: function (data) {
            parent.toast(data.msg);//弹出提示信息
            reloadGrid();
        },
        error: function () {
            parent.toast("初始化信息加载失败");
        }
    });
}

/**
 * 刷新时加载查询条件
 */
function reloadGrid() {
    $("#grid-table").jqGrid("setGridParam", {
        page: 1,
        postData: {
        	"normaltasktitle": $("#normaltasktitle").val(),
        	"sendername": $("#sendername").val(),
        	"senderorgname": $("#senderorgname").val(),
        	"receivername": $("#receivername").val(),
        	"receiverorgname": $("#receiverorgname").val(),
        	"sendtimefrom": $("#sendtimefrom").val(),
        	"sendernameto": $("#sendernameto").val()
        }
    }).trigger("reloadGrid");
}