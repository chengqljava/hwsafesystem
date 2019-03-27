$(document).ready(function () {
	initSeachInput();
	/**
	 * 园区公共设施-工业用水
	 */
	
	//显示操作权限按钮
	$("#tableOpers").displayOper();
    //生成任务列表分页表格
    var colname = ["id","管道编号","管道名称","供水水源","管网布置方式","处理方式","用水类型","创建时间"],
        colmodel = [
            {
                name: "waterid",
                index: "waterid",
                width: "5%",
                align: "center",
                sortable: false,
                hidden: true
            },
            {
            	name: "watercode",
            	index: "watercode",
            	width: "10%",
            	align: "center",
            	sortable: false
            },
            {
            	name: "watername",
            	index: "watername",
            	width: "10%",
            	align: "center",
            	sortable: false,
            	formatter: function (cellvalue, options, obj) {
            		return '<a href="javascript:void(0);" onclick="display(\'' + obj.waterid + '\')">' + obj.watername + '</a>';
            	}
            },
            {
            	name: "sourcewater",
            	index: "sourcewater",
            	width: "10%",
            	align: "center",
            	sortable: false
            },
            {
            	name: "pipenetwork",
            	index: "pipenetwork",
            	width: "10%",
            	align: "center",
            	sortable: false
            },
            {
            	name: "handlemethod",
            	index: "handlemethod",
            	width: "10%",
            	align: "center",
            	sortable: false
            },
            {
            	name: "usetype",
            	index: "usetype",
            	width: "10%",
            	align: "center",
            	sortable: false,
            	formatter: function(cellvalue,options,obj){
            		if(obj.usetype == "0"){
            			return "消防用水";
            		} else {
            			return "工业用水";
            		}
            	}
            },
            {
            	name: "createtime",
            	index: "createtime",
            	width: "10%",
            	align: "center",
            	sortable: false,
            	formatter: function(cellvalue,options,obj){
            		return getFormatDateByLong(obj.createtime, "yyyy-MM-dd hh:mm:ss");
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
        url: BASE_URL + "/publics/publicprocesswater/list",
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
        caption: "消防工业用水管道列表",
        autowidth: true
    });

    //查询按钮事件
    /*$("#searchbtn").off("click").on("click", function () {
        reloadGrid();
    });*/

    //重置按钮
    /*$("#resetbtn").bind("click", function () {
        $("#sourcewater").emty();
        $("#pipenetwork").emty();
        $("#handlemethod").emty();
    });*/
    $("#addBtn").off("click").on("click", function () {
    	parent.openWin(BASE_URL + "views/module/publics/processwater/processwaterAdd.html?waterid=null",
        		"新增消防工业用水", "70%", "58%");
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
        var waterid = $("#grid-table").jqGrid("getRowData", curSelRowArr[0]).waterid;
        parent.openWin(BASE_URL + "views/module/publics/processwater/processwaterAdd.html?waterid="+waterid,
        		"编辑消防工业用水", "70%", "58%");
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
        	var waterid = $("#grid-table").jqGrid("getRowData", curSelRowArr[i]).waterid;
        	curSelBadIdArr.push(waterid);
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
                url: BASE_URL + "publics/publicprocesswater/delete",
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
	$("#watercode").val("");
	$("#sourcewater").val("");
    $("#usetype").val("");
}

function seach(){
	 reloadGrid();
}

/**
 * 查看信息
 */
function display(waterid) {
	parent.openWin(BASE_URL + "views/module/publics/processwater/processwaterDisplay.html?waterid="+waterid+"&isDisplay=isDisplay",
    		"消防工业用水详情", "70%", "60%");
}

/**
 * 刷新时加载查询条件
 */
function reloadGrid() {
	var usetype = $("#usetype").val();
	if (usetype == "消防用水") {
		usetype = '0'
	}else if(usetype == "工业用水"){
		usetype = '1'
	}
    $("#grid-table").jqGrid("setGridParam", {
        page: 1,
        postData: {
        	sourcewater: $("#sourcewater").val(),
        	watercode: $("#watercode").val(),
        	usetype :usetype
        }
    }).trigger("reloadGrid");
}