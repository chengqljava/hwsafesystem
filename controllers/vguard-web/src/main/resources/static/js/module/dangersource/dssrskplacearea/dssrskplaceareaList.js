$(function () {
    //显示操作权限按钮
    $("#tableOpers").displayOper();
    //生成任务列表分页表格
    var colname = ["主键id", "场所区域编号", "场所区域名称", "负责人", "负责人电话",'操作'],
        colmodel = [
            {
                name: "PLACEAREAID",
                index: "PLACEAREAID",
                width: "5%",
                align: "center",
                sortable: false,
                hidden: true
            },
            {
                name: "PLACEAREACODE",
                index: "PLACEAREACODE",
                width: "10%",
                align: "center",
                sortable: false
            },
            {
                name: "PLACEAREANAME",
                index: "PLACEAREANAME",
                width: "10%",
                align: "center",
                sortable: true,
                formatter: function (cellvalue, options, obj) {
                    return '<a href="javascript:void(0);" onclick="display(\'' + obj.PLACEAREAID + '\')">' + obj.PLACEAREANAME + '</a>';
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
            },
    		{name:'OPERATION',index:"OPERATION",width:'80px',fixed:true,align:"left",formatter:function(cellvalue, options, obj){
    			return '<a href="javascript:void(0);" title="编辑" class="operation editInfoBtn" onclick="editInfo(\''+obj.PLACEAREAID+'\')">编辑</a><br>'
    			     + '<a href="javascript:void(0);" title="删除" class="operation delInfoBtn" onclick="delInfo(\''+obj.PLACEAREAID+'\')">删除</a>'
    		}}
        ];

    //分页表格响应式处理
    var tableHeight = $(window).height() - $(".pcheck").height() - 190 - 33;
    $(window).resize(function () {
        $("#grid-table").jqGrid("setGridHeight", $(window).height() - $('.pcheck').height() - 190 - 33);
        $("#grid-table").jqGrid("setGridWidth", $(window).width() - 96);
    });

    $("#grid-table").jqGrid({
        height: tableHeight,
        width: $(window).width() - 96,
        url: BASE_URL + "dangersource/dssrskplacearea/list",
        datatype: "json",
        cache: false,
        mtype: "POST",
        colNames: colname,
        colModel: colmodel,
        postData: {},
        sortname: "PLACEAREACODE",
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
        caption: "场所区域管理列表",
        //autowidth: true
    });

    //新增场所环境风险
    $("#addBtn").off("click").on("click", function () {
        parent.openWin(BASE_URL
            + "views/module/dangersource/dssrskplacearea/dssrskplaceareaAdd.html?placeareaid=-1",
            '新增场所区域', '50%', '35%');
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

        var placeareaid = $("#grid-table").jqGrid("getRowData", curSelRowArr[0]).PLACEAREAID;
        //TODO 弹出编辑框
        parent.openWin(BASE_URL
            + "views/module/dangersource/dssrskplacearea/dssrskplaceareaAdd.html?placeareaid=" + placeareaid,
            '编辑场所区域', '55%', '35%');

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
            var placeareaid = $("#grid-table").jqGrid("getRowData", curSelRowArr[i]).PLACEAREAID;
            curSelPlaceIdArr.push(placeareaid);
        }
        //执行删除操作
        delDssrskplaces({"ids": curSelPlaceIdArr.toString()});
    });


    $("#resetbtn").off("click").on("click", function() {
        $('#placeareacode').val("");
        $('#placeareaname').val("");
    });
});
/**
 * 执行删除操作
 */
function delDssrskplaces(param) {
	//弹出提示框
	parent.confirm("确认删除吗?", function () {
		$.ajax({
			url: BASE_URL + "dangersource/dssrskplacearea/delete",
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
/**
 * 详细查看场所环境风险
 */
function display(placeareaid) {
    parent.openWin(BASE_URL + "views/module/dangersource/dssrskplacearea/dssrskplaceareaDisplay.html?placeareaid=" + placeareaid,
        "场所区域详情", "50%", "40%");
}
function editInfo(placeareaid) {
	parent.openWin(BASE_URL
            + "views/module/dangersource/dssrskplacearea/dssrskplaceareaAdd.html?placeareaid=" + placeareaid,
            '编辑场所区域', '55%', '35%');
}

function delInfo(placeareaid) {
	//执行删除操作
    delDssrskplaces({"ids": placeareaid});
}
/**
 * 刷新加载设备设施分页表格数据
 */
function reloadGrid() {
    var placeareacode = $("#placeareacode").val();
    var placeareaname = $("#placeareaname").val();
    $("#grid-table").jqGrid("setGridParam", {
        page: 1,
        postData: {
        	placeareacode: placeareacode || "",
        	placeareaname: placeareaname || ""
        }
    }).trigger("reloadGrid");
}