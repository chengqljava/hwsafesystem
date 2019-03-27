$(document).ready(function () {
	/**
	 * 园区公共设施-河道
	 */
	initSeachInput();
	//显示操作权限按钮
	$("#tableOpers").displayOper();
    //生成任务列表分页表格
    var colname = ["id","河道编号","河道名称","河道等级","区域内长度（km）","河道宽度（m）","管理单位"],
        colmodel = [
            {
                name: "riverid",
                index: "riverid",
                width: "5%",
                align: "center",
                sortable: false,
                hidden: true
            },
            {
            	name: "rivercode",
            	index: "rivercode",
            	width: "10%",
            	align: "center",
            	sortable: false
            },
            {
            	name: "rivername",
            	index: "rivername",
            	width: "10%",
            	align: "center",
            	sortable: false,
            	formatter: function (cellvalue, options, obj) {
            		return '<a href="javascript:void(0);" onclick="display(\'' + obj.riverid + '\')">' + obj.rivername + '</a>';
            	}
            },
            {
            	name: "riverlevel",
            	index: "riverlevel",
            	width: "10%",
            	align: "center",
            	sortable: false,
            	formatter: function(cellvalue, options, obj) {
            		if(obj.riverlevel == '1'){
            			return "一级河道";
            		} else if(obj.riverlevel == '2'){
            			return "二级河道";
            		} else if(obj.riverlevel == '3'){
            			return "三级河道";
            		} else if(obj.riverlevel == '4'){
            			return "四级河道";
            		} else if(obj.riverlevel == '5'){
            			return "五级河道";
            		}
            	}
            },
            {
            	name: "length",
            	index: "length",
            	width: "10%",
            	align: "center",
            	sortable: false
            },
            {
            	name: "width",
            	index: "width",
            	width: "10%",
            	align: "center",
            	sortable: false
            },
            {
            	name: "management",
            	index: "management",
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
        url: BASE_URL + "/publics/publicriver/list",
        datatype: "json",
        cache: false,
        mtype: "POST",
        colNames: colname,
        colModel: colmodel,
        postData: {},
        sortname: "createdate",
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
        caption: "河道列表",
        autowidth: true
    });

    //查询按钮事件
//    $("#searchbtn").off("click").on("click", function () {
//        reloadGrid();
//    });
//
//    //重置按钮
//    $("#resetbtn").bind("click", function () {
//        $("#rivername").emty();
//        $("#rivercode").emty();
//        $("#riverlevel").emty();
//    });
    $("#addBtn").off("click").on("click", function () {
    	parent.openWin(BASE_URL + "views/module/publics/publicriver/riverAdd.html?riverid=null",
        		"新增河道", "60%", "58%");
    });
    
    //修改
    $("#editBtn").off("click").on("click", function () {
        //返回当前grid中复选框所选择的数据的id
        var curSelRowArr = $("#grid-table").jqGrid("getGridParam", "selarrrow");
        if (1 != curSelRowArr.length) {
            // 弹出提示信息
            parent.toast("请选择一条数据进行编辑！");
            return;
        }
            //打开页面
        var riverid = $("#grid-table").jqGrid("getRowData", curSelRowArr[0]).riverid;
        parent.openWin(BASE_URL + "views/module/publics/publicriver/riverAdd.html?riverid="+riverid,
        		"编辑河道", "60%", "58%");
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
        	var riverid = $("#grid-table").jqGrid("getRowData", curSelRowArr[i]).riverid;
        	curSelBadIdArr.push(riverid);
        }
        //执行删除操作
        delWater({"ids": curSelBadIdArr.toString()});
    });
    
    /**
     * 执行删除操作
     */
    function delWater(param) {
        //弹出提示框
        parent.confirm("确认删除记录?", function () {
            $.ajax({
                url: BASE_URL + "publics/publicriver/delete",
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
	$("#rivername").val("");
	$("#rivercode").val("");
	$("#riverlevel").val("");
}

function seach(){
	 reloadGrid();
}

/**
 * 查看信息
 */
function display(riverid) {
	parent.openWin(BASE_URL + "views/module/publics/publicriver/riverDisplay.html?riverid="+riverid+"&isDisplay=isDisplay",
    		"河道详情", "68%", "55%");
}

/**
 * 刷新时加载查询条件
 */
function reloadGrid() {
	 var riverlevel = $("#riverlevel").val();
	if (riverlevel =="一级河道") {
		riverlevel='1';
	}else if(riverlevel =="二级河道"){
		riverlevel='2';
	}else if(riverlevel =="三级河道"){
		riverlevel='3';
	}else if(riverlevel =="四级河道"){
		riverlevel='4';
	}else if(riverlevel =="五级河道"){
		riverlevel='5';
	}
    $("#grid-table").jqGrid("setGridParam", {
        page: 1,
        postData: {
        	rivername: $("#rivername").val(),
        	rivercode: $("#rivercode").val(),
        	riverlevel:riverlevel
        }
    }).trigger("reloadGrid");
}