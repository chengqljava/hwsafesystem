/*
 * Copyright (c) 2018. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

$(function () {
    //显示操作权限按钮
    $("#tableOpers").displayOper();

    //生成任务列表分页表格
    var colname = ["GPRSID", "GPRS模块ID", "上线时间", "流水号", "机器参数", "CCID", "手机号", "欠费日期", "最后一次上传时间", "探头个数"],
        colmodel = [
            {
                name: "gprsid",
                index: "gprsid",
                width: "5%",
                align: "left",
                sortable: false,
                hidden: true
            },
            {
                name: "gprsmoduleid",
                index: "gprsmoduleid",
                width: "10%",
                align: "left",
                sortable: true
            },
            {
                name: "onlinetime",
                index: "onlinetime",
                width: "10%",
                align: "left",
                sortable: true,
                formatter: function (cellvalue, options, obj) {
                    return getFormatDateByLong(obj.onlinetime, "yyyy-MM-dd hh:mm:ss");
                }
            },
            {
                name: "serialnumber",
                index: "serialnumber",
                width: "10%",
                align: "left",
                sortable: true
            },
            {
                name: "machineparam",
                index: "machineparam",
                width: "10%",
                align: "left",
                sortable: false
            },
            {
                name: "ccid",
                index: "ccid",
                width: "10%",
                align: "left",
                sortable: true
            },
            {
                name: "simphone",
                index: "simphone",
                width: "10%",
                align: "left",
                sortable: true
            },
            {
                name: "arrearsdate",
                index: "arrearsdate",
                width: "10%",
                align: "left",
                sortable: true,
                formatter: function (cellvalue, options, obj) {
                    return getFormatDateByLong(obj.arrearsdate, "yyyy-MM-dd hh:mm:ss");
                }
            },
            {
                name: "lasttime",
                index: "lasttime",
                width: "10%",
                align: "left",
                sortable: true,
                formatter: function (cellvalue, options, obj) {
                    return getFormatDateByLong(obj.lasttime, "yyyy-MM-dd hh:mm:ss");
                }
            },
            {
                name: "probecount",
                index: "probecount",
                width: "10%",
                align: "left",
                sortable: true
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
        url: BASE_URL + "monitor/macgprsmodule/list",
        datatype: "json",
        cache: false,
        mtype: "POST",
        colNames: colname,
        colModel: colmodel,
        postData: {},
        sortname: "ONLINETIME",
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
        caption: "GPRS模块列表",
        autowidth: true
    });

    //新增监控监测设备维修
    $("#addBtn").off("click").on("click", function () {
        parent.openWin(BASE_URL
            + "views/module/monitor/macgprsmodule/macgprsmoduleAdd.html?gprsid=-1",
            '新增GPRS模块设备', '50%', '50%');
    });

    //编辑场所环境风险
    $("#editBtn").off("click").on("click", function () {
        //返回当前grid中复选框所选择的数据的id
        var curSelRowArr = $("#grid-table").jqGrid("getGridParam", "selarrrow");
        if (1 != curSelRowArr.length) {
            // 弹出提示信息
            parent.toast("请选择一条数据进行编辑！");
            return;
        }

        var gprsid = $("#grid-table").jqGrid("getRowData", curSelRowArr[0]).gprsid;
        //TODO 弹出编辑框
        parent.openWin(BASE_URL
            + "views/module/monitor/macgprsmodule/macgprsmoduleAdd.html?gprsid=" + gprsid,
            '编辑GPRS模块', '50%', '50%');

    });

    //编辑场所环境风险
    $("#probeBtn").off("click").on("click", function () {
        //返回当前grid中复选框所选择的数据的id
        var curSelRowArr = $("#grid-table").jqGrid("getGridParam", "selarrrow");
        if (1 != curSelRowArr.length) {
            // 弹出提示信息
            parent.toast("请选择一条数据进行编辑！");
            return;
        }

        var gprsid = $("#grid-table").jqGrid("getRowData", curSelRowArr[0]).gprsid;
        //TODO 弹出编辑框
        parent.openWin(BASE_URL
            + "views/module/monitor/macgprsmodule/macgprsmoduleAddProbe.html?gprsid=" + gprsid,
            '关联探头', '50%', '65%');

    });



    //点击查询
    $("#searchbtn").off("click").on("click", function () {
        reloadGrid();
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

    });


    $("#resetbtn").off("click").on("click", function () {
    });
});

/**
 * 详细查看
 */
function display(demarcateid, name) {
    parent.openWin(BASE_URL + "views/module/monitor/macdemarcate/macdemarcateDisplay.html?demarcateid=" + demarcateid,
        name, "50%", "45%");
}

/**
 * 刷新加载设备设施分页表格数据
 */
function reloadGrid() {
    var gprsmoduleid = $("#gprsmoduleid").val();
    $("#grid-table").jqGrid("setGridParam", {
        page: 1,
        postData: {
            gprsmoduleid: gprsmoduleid || ""
        }
    }).trigger("reloadGrid");
}