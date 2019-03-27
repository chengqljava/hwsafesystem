$(document).ready(function () {
	/**
	 * 园区公共设施-蒸汽管理
	 */
	initSeachInput();
	//显示操作权限按钮
	$("#tableOpers").displayOper();
    //生成任务列表分页表格
    var colname = ["id","设施编号","设施名称","污水排放量预测（万立方米/日）","污水处理厂", "管理单位","管理单位电话","创建时间"],
        colmodel = [
            {
                name: "sewageid",
                index: "sewageid",
                width: "5%",
                align: "center",
                sortable: false,
                hidden: true
            },
            {
            	name: "sewagcode",
            	index: "sewagcode",
            	width: "10%",
            	align: "center",
            	sortable: true
            },
            {
            	name: "sewagname",
            	index: "sewagname",
            	width: "10%",
            	align: "center",
            	sortable: true,
            	formatter: function (cellvalue, options, obj) {
            		return '<a href="javascript:void(0);" onclick="display(\'' + obj.sewageid + '\')">' + obj.sewagname + '</a>';
            	}
            },
            {
            	name: "sewageforecast",
            	index: "sewageforecast",
            	width: "25%",
            	align: "center",
            	sortable: false
            },
            {
            	name: "sewageplant",
            	index: "sewageplant",
            	width: "25%",
            	align: "center",
            	sortable: false,
            	formatter: function (cellvalue, options, obj) {
            		if (cellvalue == '0') {
						return "是";
					}else{
						return "否";
					}
            	}
            },
            {
            	name: "management",
            	index: "management",
            	width: "10%",
            	align: "center",
            	sortable: true
            },
            {
            	name: "telphone",
            	index: "telphone",
            	width: "10%",
            	align: "center",
            	sortable: true
            },
            {
            	name: "createtime",
            	index: "createtime",
            	width: "25%",
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
        url: BASE_URL + "publics/publicsewage/list",
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
        caption: "污水处理设备列表",
        autowidth: true
    });

    //查询按钮事件
    /*$("#searchbtn").off("click").on("click", function () {
        reloadGrid();
    });*/

    //重置按钮
   /* $("#resetbtn").bind("click", function () {
        $("#steamsource").emty();
        $("#pipelength").emty();
    });*/
    
    $("#addBtn").off("click").on("click", function () {
    	parent.openWin(BASE_URL + "views/module/publics/sewage/sewageAdd.html?sewageid=null",
        		"新增污水处理", "65%", "65%");
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
        var sewageid = $("#grid-table").jqGrid("getRowData", curSelRowArr[0]).sewageid;
        parent.openWin(BASE_URL + "views/module/publics/sewage/sewageAdd.html?sewageid="+sewageid,
        		"编辑污水处理",  "65%", "65%");
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
        	var sewageid = $("#grid-table").jqGrid("getRowData", curSelRowArr[i]).sewageid;
        	curSelBadIdArr.push(sewageid);
        }
        //执行删除操作
        delSwage({"ids": curSelBadIdArr.toString()});
    });
    
    /**
     * 执行删除操作
     */
    function delSwage(param) {
        //弹出提示框
        parent.confirm("确认删除记录?", function () {
            $.ajax({
                url: BASE_URL + "publics/publicsewage/delete",
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
    $("#seachDiv").validate({
        rules: {
        	sewageforecast:{
        		isNumber:true,
        		wRessureCheck:true
        	}
        },
        messages: {
        	sewageforecast:{
        		isNumber:"请输入正确的数字格式",
        		wRessureCheck:"只能输入3位整数，至多保留2位小数"
        	}
        },
        submitHandler: function (form) {
        	reloadGrid();
        }
    });

});

function resetData(){
	$("#sewageforecast").val("");
	$("#sewageplant").val("");
}

function seach(){
	 reloadGrid();
}

/**
 * 查看信息
 */
function display(sewageid) {
	parent.openWin(BASE_URL + "views/module/publics/sewage/sewageDisplay.html?sewageid="+sewageid+"&isDisplay=isDisplay",
    		"污水处理详情",  "65%", "65%");
}

/**
 * 刷新时加载查询条件
 */
function reloadGrid() {
	var sewageplant = $("#sewageplant").val();
	if (sewageplant == "是") {
		sewageplant = '0'
	}else if(sewageplant == "否"){
		sewageplant = '1'
	}
    $("#grid-table").jqGrid("setGridParam", {
        page: 1,
        postData: {
        	sewageforecast: $("#sewageforecast").val(),
        	sewageplant: sewageplant
        }
    }).trigger("reloadGrid");
}