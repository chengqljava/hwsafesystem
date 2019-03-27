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
    var colname = ["devicetypeid","类型名称", "类型编码", "备注", "更新时间"],
        colmodel = [
            {
                name: "devicetypeid",
                index: "devicetypeid",
                width: "5%",
                align: "left",
                sortable: false,
                hidden: true
            },{
                name: "devicetypename",
                index: "devicetypename",
                width: "10%",
                align: "left",
                sortable: true
            },
            {
                name: "devicetypenum",
                index: "devicetypenum",
                width: "10%",
                align: "left",
                sortable: true
            },
            {
                name: "notes",
                index: "notes",
                width: "10%",
                align: "left",
                sortable: true
            },
            {
                name: "updatetime",
                index: "updatetime",
                width: "10%",
                align: "left",
                sortable: true,
                formatter: function (cellvalue, options, obj) {
                    return getFormatDateByLong(obj.updatetime, "yyyy-MM-dd hh:mm:ss");
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
        url: BASE_URL + "monitor/macdevicetype/list",
        datatype: "json",
        cache: false,
        mtype: "POST",
        colNames: colname,
        colModel: colmodel,
        postData: {
            devicetypename:''
        },
        sortname: "UPDATETIME",
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
        caption: "设备类型列表",
        autowidth: true
    });

    //新增设备类型
    $("#addBtn").off("click").on("click", function () {
        parent.openWin(BASE_URL
            + "views/module/monitor/macdevicetype/macdevicetypeAdd.html?devicetypeid=-1",
            '新增设备类型', '50%', '227px');
    });

    //编辑设备类型
    $("#editBtn").off("click").on("click", function () {
        //返回当前grid中复选框所选择的数据的id
        var curSelRowArr = $("#grid-table").jqGrid("getGridParam", "selarrrow");
        if (1 != curSelRowArr.length) {
            // 弹出提示信息
            parent.toast("请选择一条数据进行编辑！");
            return;
        }

        var devicetypeid = $("#grid-table").jqGrid("getRowData", curSelRowArr[0]).devicetypeid;
        //TODO 弹出编辑框
        parent.openWin(BASE_URL
            + "views/module/monitor/macdevicetype/macdevicetypeAdd.html?devicetypeid=" + devicetypeid,
            '编辑设备类型', '50%', '227px');

    });

    //点击查询
    $("#searchbtn").off("click").on("click", function () {
        reloadGrid();
    });

    //删除
    $("#delBtn").off("click").on("click", function () {
        // 返回当前grid中复选框所选择的数据的id
        var curSelRowArr = $("#grid-table").jqGrid("getGridParam", "selarrrow");
        if (curSelRowArr.length!=1) {
            // 弹出提示信息
            parent.toast("请选择一条需要删除的数据！");
            return;
        }
        var devicetypeid = $("#grid-table").jqGrid("getRowData", curSelRowArr[0]).devicetypeid;

        $.ajax({
            url: BASE_URL + "monitor/macdevicetype/havedevicetype",
            type: "post",
            dataType: "json",
            data: {
                devicetypeid:devicetypeid
            },
            success: function (json) {
                if (json.success == true) {
                    //弹出提示框
                    parent.toast(json.msg);

                } else {
                    parent.confirm("确认删除该设备类型吗?", function () {
                        $.ajax({
                            url: BASE_URL + "monitor/macdevicetype/delete",
                            type: "post",
                            dataType: "json",
                            data: {
                                devicetypeid:devicetypeid
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
    var devicetypename = $("#devicetypename").val();
    $("#grid-table").jqGrid("setGridParam", {
        page: 1,
        postData: {
            devicetypename: devicetypename || ""
        }
    }).trigger("reloadGrid");
}