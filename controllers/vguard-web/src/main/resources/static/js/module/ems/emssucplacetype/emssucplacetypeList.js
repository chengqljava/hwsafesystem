$(document).ready(function () {
	/**
	 * 保护场所
	 */
	//显示操作权限按钮
	$("#tableOpers").displayOper();
//	SelectOption.loadCourseType("coursetype");//课程类型下拉选	
	
    //生成任务列表分页表格
    var colname = ["场所类型id","场所类型名称","备注"],
        colmodel = [
            {
                name: "TYPEID",
                index: "TYPEID",
                width: "5%",
                align: "center",
                sortable: false,
                hidden: true
            },
            {
            	name: "NAME",
            	index: "NAME",
            	width: "15%",
            	align: "center",
            	sortable: false,
            	formatter: function (cellvalue, options, obj) {
            		return '<a href="javascript:void(0);" onclick="display(\'' + obj.TYPEID + '\')">' + obj.NAME + '</a>';
            	}
            },
            {
                name: "REMARK",
                index: "REMARK",
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
        url: BASE_URL + "ems/codeemssucplacetype/list",
        datatype: "json",
        cache: false,
        mtype: "POST",
        colNames: colname,
        colModel: colmodel,
        postData: {},
        sortname: "TYPEID",
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
        caption: "场所类型管理",
        autowidth: true
    });

    //查询按钮事件
    $("#searchBtn").off("click").on("click", function () {
        reloadGrid();
    });
    
    $("#resetBtn").off("click").on("click", function () {
        $("#name").val("");
    });

    //添加场所类型
    $("#addBtn").off("click").on("click", function (){
    	parent.openWin(BASE_URL
				+ "views/module/ems/emssucplacetype/emssucplacetypeAdd.html?typeid=-1",
				'添加场所类型', '40%', '30%');
    });

    //修改场所类型
    $("#editBtn").off("click").on("click", function (){
        //返回当前grid中复选框所选择的数据的id
        var curSelRowArr = $("#grid-table").jqGrid("getGridParam", "selarrrow");
        if (1 != curSelRowArr.length) {
            // 弹出提示信息
            parent.toast("请选择一条数据进行编辑！");
            return;
        }
        var typeid = $("#grid-table").jqGrid("getRowData", curSelRowArr[0]).TYPEID;
        //TODO 弹出编辑框
        parent.openWin(BASE_URL
				+ "views/module/ems/emssucplacetype/emssucplacetypeAdd.html?typeid="+typeid,
				'修改场所类型', '40%', '30%');
        
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

        var curSelPlacetypeArr = [];
        for (var i = 0; i < curSelRowArr.length; i++) {
        	var typeid = $("#grid-table").jqGrid("getRowData", curSelRowArr[i]).TYPEID;
        	curSelPlacetypeArr.push(typeid);
        }
        //执行删除操作
        delCourses({"ids": curSelPlacetypeArr.toString()});
    });
    
    /**
     * 执行删除操作
     */
    function delCourses(param) {
        //弹出提示框
        parent.confirm("确认删除课程信息吗?", function () {
            $.ajax({
                url: BASE_URL + "ems/codeemssucplacetype/delete",
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
/**
 * 详细查看场所类型
 */
function display(typeid) {
	 //返回当前grid中复选框所选择的数据的id
	parent.openWin(BASE_URL + "views/module/ems/emssucplacetype/emssucplacetypeDisplay.html?typeid="+typeid,
             "场所类型详情", "40%", "30%");
}

/**
 * 刷新时加载查询条件
 */
function reloadGrid() {
	var name = $("#name").val();
    $("#grid-table").jqGrid("setGridParam", {
        page: 1,
        postData: {
        	name:name||""
        }
    }).trigger("reloadGrid");
}