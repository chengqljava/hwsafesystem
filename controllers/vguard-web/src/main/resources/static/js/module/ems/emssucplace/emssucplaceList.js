$(document).ready(function () {
	/**
	 * 保护场所
	 */
	//显示操作权限按钮
	$("#tableOpers").displayOper();
	SelectOption.loadPlaceType("typeid");//场所类型下拉选	
	
    //生成任务列表分页表格
    var colname = ["场所id","场所名称","场所类型","人口数","电话","经度","纬度"],
        colmodel = [
            {
                name: "PLACEID",
                index: "PLACEID",
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
            		return '<a href="javascript:void(0);" onclick="display(\'' + obj.PLACEID + '\')">' + obj.NAME + '</a>';
            	}
            },
            {
                name: "TYPENAME",
                index: "TYPENAME",
                width: "10%",
                align: "center",
                sortable: true
            },
            {
                name: "POPULATION",
                index: "POPULATION",
                width: "10%",
                align: "center",
                sortable: true
            },
            {
            	name: "TEL",
            	index: "TEL",
            	width: "10%",
            	align: "center",
            	sortable: false
            },
            {
            	name: "LONGITUDE",
            	index: "LONGITUDE",
            	width: "10%",
            	align: "center",
            	sortable: false
            },
            {
            	name: "LATITUDE",
            	index: "LATITUDE",
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
        url: BASE_URL + "ems/emssucplace/loadlist",
        datatype: "json",
        cache: false,
        mtype: "POST",
        colNames: colname,
        colModel: colmodel,
        postData: {
        	history:"new"
        },
        sortname: "PLACEID",
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
        caption: "保护场所管理",
        autowidth: true
    });

    //查询按钮事件
    $("#searchBtn").off("click").on("click", function () {
        reloadGrid();
    });
    
    //重置
    $("#resetBtn").off("click").on("click",function(){
    	$("#searchForm").find("input,select").each(function(){
    		$(this).val("");
    	});
    });

    //添加保护场所
    $("#addBtn").off("click").on("click", function (){
    	parent.openWin(BASE_URL
				+ "views/module/ems/emssucplace/emssucplaceAdd.html?placeid=-1",
				'添加保护场所', '45%', '55%');
    });

    //修改保护场所
    $("#editBtn").off("click").on("click", function (){
        //返回当前grid中复选框所选择的数据的id
        var curSelRowArr = $("#grid-table").jqGrid("getGridParam", "selarrrow");
        if (1 != curSelRowArr.length) {
            // 弹出提示信息
            parent.toast("请选择一条数据进行编辑！");
            return;
        }
        var placeid = $("#grid-table").jqGrid("getRowData", curSelRowArr[0]).PLACEID;
        //TODO 弹出编辑框
        parent.openWin(BASE_URL
				+ "views/module/ems/emssucplace/emssucplaceAdd.html?placeid="+placeid,
				'修改保护场所', '45%', '55%');
        
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

        var curSelPlaceArr = [];
        for (var i = 0; i < curSelRowArr.length; i++) {
        	var placeid = $("#grid-table").jqGrid("getRowData", curSelRowArr[i]).PLACEID;
        	curSelPlaceArr.push(placeid);
        }
        //执行删除操作
        delCourses({"ids": curSelPlaceArr.toString()});
    });
    
    /**
     * 执行删除操作
     */
    function delCourses(param) {
        //弹出提示框
        parent.confirm("确认删数据吗?", function () {
            $.ajax({
                url: BASE_URL + "ems/emssucplace/delete",
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
 * 详细查看保护场所
 */
function display(placeid) {
	 //返回当前grid中复选框所选择的数据的id
	parent.openWin(BASE_URL + "views/module/ems/emssucplace/emssucplaceDisplay.html?placeid="+placeid,
             "保护场所详情", "45%", "55%");
}

/**
 * 刷新时加载查询条件
 */
function reloadGrid() {
	var name = $("#name").val();
	var typeid = $("#typeid").val();
    $("#grid-table").jqGrid("setGridParam", {
        page: 1,
        postData: {
        	name:name||"",
        	typeid:typeid||""
        }
    }).trigger("reloadGrid");
}