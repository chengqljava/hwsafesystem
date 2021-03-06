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

    //生成服务器列表分页表格
    var colname = ["SERVERID","设备名称", "所属链路","设备类型", "设备编码", "设备存放位置", "所属企业", "所属部门", "品牌系列", "创建日期"],
        colmodel = [
            {
                name: "CONTROLLERID",
                index: "CONTROLLERID",
                width: "5%",
                align: "left",
                sortable: false,
                hidden: true
            },{
                name: "CONTROLLERNAME",
                index: "CONTROLLERNAME",
                width: "10%",
                align: "left",
                sortable: true
            },
            {
                name: "PORTNAME",
                index: "PORTNAME",
                width: "10%",
                align: "left",
                sortable: true
            },
            {
                name: "DEVICETYPENAME",
                index: "DEVICETYPENAME",
                width: "10%",
                align: "left",
                sortable: true
            },
            {
                name: "DEVICENUM",
                index: "DEVICENUM",
                width: "10%",
                align: "left",
                sortable: true
            },
            {
                name: "POSITION",
                index: "POSITION",
                width: "10%",
                align: "left",
                sortable: true
            },
            {
                name: "ENTNAME",
                index: "ENTNAME",
                width: "10%",
                align: "left",
                sortable: false
            },
            {
                name: "DEPTID",
                index: "DEPTID",
                width: "10%",
                align: "left",
                sortable: true
            },
            {
                name: "BRANDNAME",
                index: "BRANDNAME",
                width: "10%",
                align: "left",
                sortable: true
            },
            {
                name: "CREATETIME",
                index: "CREATETIME",
                width: "10%",
                align: "left",
                sortable: true,
                formatter: function (cellvalue, options, obj) {
                    return getFormatDateByLong(obj.CREATETIME, "yyyy-MM-dd hh:mm:ss");
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
        url: BASE_URL + "monitor/maccontroller/list",
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
        caption: "二次仪表列表",
        autowidth: true
    });

    //新增服务器
    $("#addBtn").off("click").on("click", function () {
        parent.openWin(BASE_URL
            + "views/module/monitor/maccontroller/maccontrollerAdd.html?controllerid=-1",
            '新增二次仪器仪表', '50%', '60%');
    });

    //编辑服务器
    $("#editBtn").off("click").on("click", function () {
        //返回当前grid中复选框所选择的数据的id
        var curSelRowArr = $("#grid-table").jqGrid("getGridParam", "selarrrow");
        if (1 != curSelRowArr.length) {
            // 弹出提示信息
            parent.toast("请选择一条数据进行编辑！");
            return;
        }

        var controllerid = $("#grid-table").jqGrid("getRowData", curSelRowArr[0]).CONTROLLERID;
        //TODO 弹出编辑框
        parent.openWin(BASE_URL
            + "views/module/monitor/maccontroller/maccontrollerAdd.html?controllerid=" + controllerid,
            '编辑二次仪器仪表', '50%', '60%');

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

        var controllerid = $("#grid-table").jqGrid("getRowData", curSelRowArr[0]).CONTROLLERID;

        $.ajax({
            url: BASE_URL + "monitor/maccontroller/havecontroller",
            type: "post",
            dataType: "json",
            data: {
                controllerid:controllerid
            },
            success: function (json) {
                if (json.success == true) {
                    //弹出提示框
                    parent.toast(json.msg);

                } else {
                    parent.confirm("确认删除该二次仪表吗?", function () {
                        $.ajax({
                            url: BASE_URL + "monitor/maccontroller/delete",
                            type: "post",
                            dataType: "json",
                            data: {
                                controllerid:controllerid
                            },
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
            }
        });

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
 * 刷新加载服务器分页表格数据
 */
function reloadGrid() {
    var servername = $("#servername").val();
    $("#grid-table").jqGrid("setGridParam", {
        page: 1,
        postData: {
            servername: servername || ""
        }
    }).trigger("reloadGrid");
}