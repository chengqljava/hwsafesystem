$(document).ready(function () {
	/**
	 * 不良记录信息列表
	 */
	initSeachInput();
	//显示操作权限按钮
	$("#tableOpers").displayOper();

    //生成任务列表分页表格
    var colname = ["主键id", "评分类型","权重","操作人","操作时间","备注"],
        colmodel = [
            {
                name: "OPTIONID",
                index: "OPTIONID",
                width: "5%",
                align: "center",
                sortable: false,
                hidden: true
            },
            {
            	name: "TYPE",
            	index: "TYPE",
            	width: "20%",
            	align: "center",
            	sortable: false,
            	formatter: function (cellvalue, options, obj) {
            		return '<a href="javascript:void(0);" onclick="display(\'' + obj.OPTIONID + '\')">' + obj.TYPE + '</a>';
            	}
            },
            {
            	name: "WEIGHT",
            	index: "WEIGHT",
            	width: "20%",
            	align: "center",
            	sortable: false
            },
            {
            	name: "CREATORNAME",
            	index: "CREATORNAME",
            	width: "20%",
            	align: "center",
            	sortable: false,
            },
            {
            	name: "CREATETIME",
            	index: "CREATETIME",
            	width: "20%",
            	align: "center",
            	sortable: false,
            	formatter : function(cellvalue, options, obj) {
        			return getFormatDateByLong(obj.CREATETIME, "yyyy-MM-dd");
        		}
            },{
            	name: "REMARK",
            	index: "REMARK",
            	width: "20%",
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
        url: BASE_URL + "ecs/ecshonoption/list",
        datatype: "json",
        cache: false,
        mtype: "POST",
        colNames: colname,
        colModel: colmodel,
        postData: {},
        sortname: "createtime",
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
        caption: "评价项列表",
        autowidth: true
    });

    //查询按钮事件
//    $("#searchbtn").off("click").on("click", function () {
//        reloadGrid();
//    });

    //添加-许可证吊销情况
    $("#addBtn").off("click").on("click", function (){
    	parent.openWin(BASE_URL
				+ "views/module/ecs/evaluate/editHonOptions.html?optionid=null",
				'添加评价项', '40%', '40%');
    });

    //修改-许可证吊销情况
    $("#editBtn").off("click").on("click", function (){
        //返回当前grid中复选框所选择的数据的id
        var curSelRowArr = $("#grid-table").jqGrid("getGridParam", "selarrrow");
        if (1 != curSelRowArr.length) {
            // 弹出提示信息
            parent.toast("请选择一条数据进行编辑！");
            return;
        }
        var optionid = $("#grid-table").jqGrid("getRowData", curSelRowArr[0]).OPTIONID;
        //TODO 弹出编辑框
        parent.openWin(BASE_URL
				+ "views/module/ecs/evaluate/editHonOptions.html?optionid="+optionid,
				'修改评价项', '40%', '40%');
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
        	var optionid = $("#grid-table").jqGrid("getRowData", curSelRowArr[i]).OPTIONID;
        	curSelBadIdArr.push(optionid);
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
                url: BASE_URL + "ecs/ecshonoption/delete",
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
	$("#type").val("");
}

function seach(){
	reloadGrid();
}

/**
 * 详细查看客户信息
 */
function display(optionid) {
	 //返回当前grid中复选框所选择的数据的id
	parent.openWin(BASE_URL + "views/module/ecs/evaluate/displayHonOptions.html?optionid="+optionid,
             "评价项详情", "40%", "40%");
}

/**
 * 刷新时加载查询条件
 */
function reloadGrid() {
    $("#grid-table").jqGrid("setGridParam", {
        page: 1,
        postData: {
        	type:$("#type").val(),
        }
    }).trigger("reloadGrid");
}
