$(function () {
    //显示操作权限按钮
    $("#tableOpers").displayOper();
    //生成任务列表分页表格
    var colname = ["主键id", "岗位/设备编号", "岗位/设备名称", "所属区域", "类型", "负责人", "负责人电话"],
        colmodel = [
            {
                name: "POSTEQUIPID",
                index: "POSTEQUIPID",
                width: "5%",
                align: "center",
                sortable: false,
                hidden: true
            },
            {
                name: "POSTEQUIPCODE",
                index: "POSTEQUIPCODE",
                width: "10%",
                align: "center",
                sortable: false
            },
            {
                name: "POSTEQUIPNAME",
                index: "POSTEQUIPNAME",
                width: "10%",
                align: "center",
                sortable: true
//                ,
//                formatter: function (cellvalue, options, obj) {
//                    return '<a href="javascript:void(0);" onclick="display(\'' + obj.POSTEQUIPID + '\')">' + obj.POSTEQUIPNAME + '</a>';
//                }
            },
            {
                name: "PLACEAREANAME",
                index: "PLACEAREANAME",
                width: "10%",
                align: "center",
                sortable: true
            },
            {
                name: "TYPE",
                index: "TYPE",
                width: "10%",
                align: "center",
                sortable: true,
                formatter: function (cellvalue, options, obj) {
                    return SelectOption.getPostequipType(obj.TYPE);
                }
            },
            {
                name: "LIABLOR",
                index: "LIABLOR",
                width: "10%",
                align: "center",
                sortable: true
            },
            {
                name: "TELEPHONE",
                index: "TELEPHONE",
                width: "10%",
                align: "center",
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
        url: BASE_URL + "dangersource/dssrskpostequip/list",
        datatype: "json",
        cache: false,
        mtype: "POST",
        colNames: colname,
        colModel: colmodel,
        postData: {},
        sortname: "POSTEQUIPCODE",
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
        caption: "岗位/设备管理列表",
        autowidth: true
    });

    //新增场所环境风险
    $("#addBtn").off("click").on("click", function () {
        parent.openWin(BASE_URL
            + "views/module/dangersource/dssrskpostequip/dssrskpostequipAdd.html?postequipid=-1",
            '新增岗位/设备', '55%', '40%');
    });

    //点击查询
    $("#searchbtn").off("click").on("click", function () {
        reloadGrid();
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

        var postequipid = $("#grid-table").jqGrid("getRowData", curSelRowArr[0]).POSTEQUIPID;
        //TODO 弹出编辑框
        parent.openWin(BASE_URL
            + "views/module/dangersource/dssrskpostequip/dssrskpostequipAdd.html?postequipid=" + postequipid,
            '编辑岗位/设备', '55%', '40%');

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

        var curSelPlaceIdArr = [];
        for (var i = 0; i < curSelRowArr.length; i++) {
            var postequipid = $("#grid-table").jqGrid("getRowData", curSelRowArr[i]).POSTEQUIPID;
            curSelPlaceIdArr.push(postequipid);
        }
        //执行删除操作
        delDssrskplaces({"ids": curSelPlaceIdArr.toString()});
    });

    /**
     * 执行删除操作
     */
    function delDssrskplaces(param) {
        //弹出提示框
        parent.confirm("确认删除吗?", function () {
            $.ajax({
                url: BASE_URL + "dangersource/dssrskpostequip/delete",
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

    $("#resetbtn").off("click").on("click", function() {
        $('#postequipname').val("");
        $('#placeareaname').val("");
    });
});
/**
 * 详细查看场所环境风险
 */
//function display(placeareaid) {
//    parent.openWin(BASE_URL + "views/module/dangersource/dssrskplacearea/dssrskplaceareaDisplay.html?placeareaid=" + placeareaid,
//        "场所区域详情", "55%", "40%");
//}

/**
 * 刷新加载设备设施分页表格数据
 */
function reloadGrid() {
    var postequipname = $("#postequipname").val();
    var placeareaname = $("#placeareaname").val();
    $("#grid-table").jqGrid("setGridParam", {
        page: 1,
        postData: {
        	postequipname: postequipname || "",
        	placeareaname: placeareaname || ""
        }
    }).trigger("reloadGrid");
}