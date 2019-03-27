$(document).ready(function () {
	//显示操作权限按钮
	$("#tableOpers").displayOper();

    //生成列表分页表格
    var colname = ["主键id", "编号","分类级别","级别值","分数上限(包含)", "分数下限(不包含)","备注"],
        colmodel = [
            {
                name: "LEVELID",
                index: "LEVELID",
                width: "5%",
                align: "center",
                sortable: false,
                hidden: true
            },
            {
            	name: "CODE",
            	index: "CODE",
            	width: "10%",
            	align: "center",
            	sortable: false,
            	formatter: function (cellvalue, options, obj) {
            		return '<a href="javascript:void(0);" onclick="display(\'' + obj.LEVELID + '\')">' + obj.CODE + '</a>';
            	}
            },
            {
            	name: "TYPELEVEL",
            	index: "TYPELEVEL",
            	width: "10%",
            	align: "center",
            	sortable: false,
            },
            {
            	name: "LEVELVAL",
            	index: "LEVELVAL",
            	width: "10%",
            	align: "center",
            	sortable: false
            },
            {
            	name: "UPPERLIMIT",
            	index: "UPPERLIMIT",
            	width: "10%",
            	align: "center",
            	sortable: false
            },
            {
            	name: "LOWERLIMIT",
            	index: "LOWERLIMIT",
            	width: "10%",
            	align: "center",
            	sortable: false
            },
            {
            	name: "REMARK",
            	index: "REMARK",
            	width: "10%",
            	align: "center",
            	sortable: false
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
        url: BASE_URL + "ecs/ecslevel/list",
        datatype: "json",
        cache: false,
        mtype: "POST",
        colNames: colname,
        colModel: colmodel,
        postData: {
        	params: $('#params').val()
        },
        sortname: "CODE",
        sortorder: "asc",
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
        caption: "诚信级别管理",
        autowidth: true
    });

    //查询按钮事件
    $("#searchbtn").bind("click", function() {
    	reloadGrid();
    });
    
    /*重置*/
    $("#resetbtn").bind("click",function(){
    	//清空选择框
        $("#code").empty();
        $("#typelevel").empty();
    });

    //添加-诚信级别
    $("#addBtn").off("click").on("click", function (){
    	parent.openWin(BASE_URL
				+ "views/module/ecs/level/ecsLevelEdit.html?levelid=null",
				'添加-诚信级别', '50%', '40%');
    });

    //修改-诚信级别
    $("#editBtn").off("click").on("click", function (){
        //返回当前grid中复选框所选择的数据的id
        var curSelRowArr = $("#grid-table").jqGrid("getGridParam", "selarrrow");
        if (1 != curSelRowArr.length) {
            // 弹出提示信息
            parent.toast("请选择一条数据进行编辑！");
            return;
        }
        var levelid = $("#grid-table").jqGrid("getRowData", curSelRowArr[0]).LEVELID;
        //TODO 弹出编辑框
        parent.openWin(BASE_URL
				+ "views/module/ecs/level/ecsLevelEdit.html?levelid="+levelid,
				'修改-诚信级别', '50%', '40%');
        
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

        var curSelBadIdArr = [];
        for (var i = 0; i < curSelRowArr.length; i++) {
        	var levelid = $("#grid-table").jqGrid("getRowData", curSelRowArr[i]).LEVELID;
        	curSelBadIdArr.push(levelid);
        }
        //执行删除操作
        delBadrecords({"ids": curSelBadIdArr.toString()});
    });
    
    /**
     * 执行删除操作
     */
    function delBadrecords(param) {
        //弹出提示框
        parent.confirm("确认删除吗?", function () {
            $.ajax({
                url: BASE_URL + "ecs/ecslevel/delete",
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
 * 刷新时加载查询条件
 */
function reloadGrid() {
    $("#grid-table").jqGrid("setGridParam", {
        page: 1,
        postData: {
        	code:$("#code").val(),
        	typelevel:$("#typelevel").val(),
        }
    }).trigger("reloadGrid");
}

/**
 * 详细信息
 */
function display(levelid) {
	parent.openWin(BASE_URL + "views/module/ecs/level/ecsLevelDisplay.html?levelid="+levelid,
             "详情-诚信级别", "50%", "40%");
}