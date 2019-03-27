$(document).ready(function () {
	/**
	 * 园区公共设施-公用管廊
	 */
	initSeachInput();
	//显示操作权限按钮
	$("#tableOpers").displayOper();
    //生成任务列表分页表格
    var colname = ["id","管道编号","管道名称","排水去向","管道材质","管道直径（mm）","排水类型","管理单位"],
        colmodel = [
            {
                name: "rainsewageid",
                index: "rainsewageid",
                width: "5%",
                align: "center",
                sortable: false,
                hidden: true
            },
            {
            	name: "conduitcode",
            	index: "conduitcode",
            	width: "10%",
            	align: "center",
            	sortable: false
            },
            {
            	name: "rainsewagename",
            	index: "rainsewagename",
            	width: "10%",
            	align: "center",
            	sortable: false,
            	formatter: function (cellvalue, options, obj) {
            		return '<a href="javascript:void(0);" onclick="display(\'' + obj.rainsewageid + '\')">' + obj.rainsewagename + '</a>';
            	}
            },
            {
            	name: "draingone",
            	index: "draingone",
            	width: "10%",
            	align: "center",
            	sortable: false
            },
            {
            	name: "material",
            	index: "material",
            	width: "10%",
            	align: "center",
            	sortable: false
            },
            {
            	name: "diameter",
            	index: "diameter",
            	width: "10%",
            	align: "center",
            	sortable: false
            },
            {
            	name: "draintype",
            	index: "draintype",
            	width: "10%",
            	align: "center",
            	sortable: false,
            	formatter: function (cellvalue, options, obj) {
            		if(obj.draintype == '0'){
            			return "雨水";
            		} else {
            			return "污水";
            		}
            	}
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
        url: BASE_URL + "/publics/publicrainsewage/list",
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
        caption: "雨水排污管道列表",
        autowidth: true
    });

    //查询按钮事件
//    $("#searchbtn").off("click").on("click", function () {
//        reloadGrid();
//    });
//
//    //重置按钮
//    $("#resetbtn").bind("click", function () {
//        $("#conduitcode").emty();
//        $("#draingone").emty();
//        $("#draintype").emty();
//    });
    $("#addBtn").off("click").on("click", function () {
    	parent.openWin(BASE_URL + "views/module/publics/publicrainsewage/rainsewageAdd.html?rainsewageid=null",
        		"新增公用管廊", "70%", "58%");
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
        var rainsewageid = $("#grid-table").jqGrid("getRowData", curSelRowArr[0]).rainsewageid;
        parent.openWin(BASE_URL + "views/module/publics/publicrainsewage/rainsewageAdd.html?rainsewageid="+rainsewageid,
        		"编辑公用管廊", "70%", "58%");
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
        	var rainsewageid = $("#grid-table").jqGrid("getRowData", curSelRowArr[i]).rainsewageid;
        	curSelBadIdArr.push(rainsewageid);
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
                url: BASE_URL + "publics/publicrainsewage/delete",
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
	$("#conduitcode").val("");
	$("#draingone").val("");
	$("#draintype").val("");
}

function seach(){
	 reloadGrid();
}

/**
 * 查看信息
 */
function display(rainsewageid) {
	parent.openWin(BASE_URL + "views/module/publics/publicrainsewage/rainsewageDisplay.html?rainsewageid="+rainsewageid+"&isDisplay=isDisplay",
    		"雨水排污管道详情", "70%", "58%");
}

/**
 * 刷新时加载查询条件
 */
function reloadGrid() {
	var draintype = $("#draintype").val();
	if (draintype =="雨水") {
		draintype='0';
	}else if(draintype =="污水"){
		draintype='1';
	}
    $("#grid-table").jqGrid("setGridParam", {
        page: 1,
        postData: {
        	conduitcode: $("#conduitcode").val(),
        	draingone: $("#draingone").val(),
        	draintype: draintype
        }
    }).trigger("reloadGrid");
}