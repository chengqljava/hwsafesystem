$(function () {
	//显示操作权限按钮
	$("#tableOpers").displayOper();
	initSeachInput();
    //生成任务列表分页表格
    var colname = ["id","设备名称","监测范围","制造厂家","安装地点","创建时间"],
        colmodel = [
            {
                name: "EID",
                index: "EID",
                width: "5%",
                align: "center",
                sortable: false,
                hidden: true
            }, 
            {
            	name: "DEVICENAME",
            	index: "DEVICENAME",
            	width: "10%",
            	align: "center",
            	sortable: true,
            	formatter: function (cellvalue, options, obj) {
            		return '<a href="javascript:void(0);" onclick="display(\''+obj.EID+'\',\''+$.trim(obj.DEVICENAME)+'\')">'+obj.DEVICENAME+'</a>';
            	}
            },
            {
            	name: "RANGE",
            	index: "RANGE",
            	width: "10%",
            	align: "center",
            	sortable: false
            },
            {
            	name: "MANUFACTURER",
            	index: "MANUFACTURER",
            	width: "10%",
            	align: "center",
            	sortable: true
            },
            {
            	name: "ADDRESS",
            	index: "ADDRESS",
            	width: "10%",
            	align: "center",
            	sortable: true
            },
            {
            	name: "CREATETIME",
            	index: "CREATETIME",
            	width: "10%",
            	align: "center",
            	sortable: true,
            	formatter: function(cellvalue,options,obj){
            		return getFormatDateByLong(obj.CREATETIME, "yyyy-MM-dd hh:mm:ss");
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
        url: BASE_URL + "publics/publicenvironmental/list",
        datatype: "json",
        cache: false,
        mtype: "POST",
        colNames: colname,
        colModel: colmodel,
        postData: {

        },
        sortname: "CREATETIME",
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
        caption: "环境监测设备列表",
        autowidth: true
    });

    //新增
    $("#addBtn").off("click").on("click", function (){
    	parent.openWin(BASE_URL
				+ "views/module/publics/publicenvironmental/publicenvironmentalAdd.html?eid=-1",
				'新增环境监测设备', '65%', '50%');
    });
    
    //编辑
    $("#editBtn").off("click").on("click", function (){
        //返回当前grid中复选框所选择的数据的id
        var curSelRowArr = $("#grid-table").jqGrid("getGridParam", "selarrrow");
        if (1 != curSelRowArr.length) {
            // 弹出提示信息
            parent.toast("请选择一条数据进行编辑！");
            return;
        }         	
    	var eid = $("#grid-table").jqGrid("getRowData", curSelRowArr[0]).EID;
    	//TODO 弹出编辑框
    	parent.openWin(BASE_URL
    			+ "views/module/publics/publicenvironmental/publicenvironmentalAdd.html?eid="+eid,
    			'编辑环境监测设备', '65%', '50%');
    });

    //点击查询
    /*$("#searchbtn").off("click").on("click", function () {
        reloadGrid();
    });*/
    
    //批量删除任务信息
    $("#delBtn").off("click").on("click", function () {
        // 返回当前grid中复选框所选择的数据的id
        var curSelRowArr = $("#grid-table").jqGrid("getGridParam", "selarrrow");
        if (0 == curSelRowArr.length) {
            // 弹出提示信息
            parent.toast("请选择需要删除的数据！");
            return;
        }

        var curSelMaintainidArr = [];
        for (var i = 0; i < curSelRowArr.length; i++) {
        	 var eid = $("#grid-table").jqGrid("getRowData", curSelRowArr[i]).EID;
        	 curSelMaintainidArr.push(eid);
        }
        //执行删除操作
        delMaintains({"ids": curSelMaintainidArr.toString()});
    });
    
    /**
     * 执行删除操作
     */
    function delMaintains(param) {
        //弹出提示框
        parent.confirm("确认删除吗?", function () {
            $.ajax({
                url: BASE_URL + "publics/publicenvironmental/delete",
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

   /* $("#resetbtn").off("click").on("click", function() {
    });*/
});

function resetData(){
	$("#devicename").val("");
	$("#manufacturer").val("");
	$("#address").val("");
}

function seach(){
	 reloadGrid();
}
/**
 * 详细查看
 */
function display(eid,name) {
	 parent.openWin(BASE_URL + "views/module/publics/publicenvironmental/publicenvironmentalDisplay.html?eid="+eid,
             name,"60%", "50%");
}

/**
 * 刷新加载设备设施分页表格数据
 */
function reloadGrid() {
	var devicename = $("#devicename").val();
	var manufacturer = $("#manufacturer").val();
    var address = $("#address").val();
    $("#grid-table").jqGrid("setGridParam", {
        page: 1,
        postData: {
        	devicename:devicename||"",
        	manufacturer:manufacturer||"",
        	address:address||""
        }
    }).trigger("reloadGrid");
}