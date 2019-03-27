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
    var colname = ["brandtypeid","型号名称", "型号编码","设备类型","所属品牌" ,"备注", "更新时间"],
        colmodel = [
            {
                name: "BRANDTYPEID",
                index: "BRANDTYPEID",
                width: "5%",
                align: "left",
                sortable: false,
                hidden: true
            },{
                name: "BRANDTYPENAME",
                index: "BRANDTYPENAME",
                width: "10%",
                align: "left",
                sortable: true
            },
            {
                name: "BRANDTYPENUM",
                index: "BRANDTYPENUM",
                width: "10%",
                align: "left",
                sortable: true
            },{
                name: "DEVICETYPENAME",
                index: "DEVICETYPENAME",
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
                name: "NOTES",
                index: "NOTES",
                width: "10%",
                align: "left",
                sortable: true
            },
            {
                name: "UPDATETIME",
                index: "UPDATETIME",
                width: "10%",
                align: "left",
                sortable: true,
                formatter: function (cellvalue, options, obj) {
                    return getFormatDateByLong(obj.UPDATETIME, "yyyy-MM-dd hh:mm:ss");
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
        url: BASE_URL + "monitor/macbrandtype/list",
        datatype: "json",
        cache: false,
        mtype: "POST",
        colNames: colname,
        colModel: colmodel,
        postData: {
            brandname:''
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
        caption: "型号类型列表",
        autowidth: true
    });

    //新增设备类型
    $("#addBtn").off("click").on("click", function () {
        parent.openWin(BASE_URL
            + "views/module/monitor/macbrandtype/macbrandtypeAdd.html?brandtypeid=-1",
            '新增型号', '50%', '286px');
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

        var brandtypeid = $("#grid-table").jqGrid("getRowData", curSelRowArr[0]).BRANDTYPEID;
        //TODO 弹出编辑框
        parent.openWin(BASE_URL
            + "views/module/monitor/macbrandtype/macbrandtypeAdd.html?brandtypeid=" + brandtypeid,
            '编辑型号', '50%', '286px');

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
        var brandtypeid = $("#grid-table").jqGrid("getRowData", curSelRowArr[0]).BRANDTYPEID;

        $.ajax({
            url: BASE_URL + "monitor/macbrandtype/havebrandtype",
            type: "post",
            dataType: "json",
            data: {
                brandtypeid:brandtypeid
            },
            success: function (json) {
                if (json.success == true) {
                    //弹出提示框
                    parent.toast(json.msg);

                } else {
                    parent.confirm("确认删除该型号吗?", function () {
                        $.ajax({
                            url: BASE_URL + "monitor/macbrandtype/delete",
                            type: "post",
                            dataType: "json",
                            data: {
                                brandtypeid:brandtypeid
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
    var brandtypename = $("#brandtypename").val();
    $("#grid-table").jqGrid("setGridParam", {
        page: 1,
        postData: {
            brandtypename: brandtypename || ""
        }
    }).trigger("reloadGrid");
}