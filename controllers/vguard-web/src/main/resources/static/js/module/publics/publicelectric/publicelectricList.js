$(function () {
	initSeachInput();
	//显示操作权限按钮
	$("#tableOpers").displayOper();
//	SelectOption.loadLoadlevel("loadlevel");
    //生成任务列表分页表格
    var colname = ["id","供电方式","负荷等级","创建时间"],
        colmodel = [
            {
                name: "ELECTRICID",
                index: "ELECTRICID",
                width: "5%",
                align: "center",
                sortable: false,
                hidden: true
            }, 
            {
            	name: "POWERSUPPLY",
            	index: "POWERSUPPLY",
            	width: "10%",
            	align: "center",
            	sortable: true,
            	formatter: function (cellvalue, options, obj) {
            		return '<a href="javascript:void(0);" onclick="display(\''+obj.ELECTRICID+'\')">'+obj.POWERSUPPLY+'</a>';
            	}
            },
            {
            	name: "LOADLEVEL",
            	index: "LOADLEVEL",
            	width: "10%",
            	align: "center",
            	sortable: false,
            	formatter: function(cellvalue,options,obj){
            		return SelectOption.getLoadlevel(obj.LOADLEVEL);
            	}
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
        url: BASE_URL + "publics/publicelectric/list",
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
        caption: "电力设施列表",
        autowidth: true
    });

    //新增
    $("#addBtn").off("click").on("click", function (){
    	parent.openWin(BASE_URL
				+ "views/module/publics/publicelectric/publicelectricAdd.html?electricid=-1",
				'新增电力设备', '70%', '65%');
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
    	var electricid = $("#grid-table").jqGrid("getRowData", curSelRowArr[0]).ELECTRICID;
    	//TODO 弹出编辑框
    	parent.openWin(BASE_URL
    			+ "views/module/publics/publicelectric/publicelectricAdd.html?electricid="+electricid,
    			'编辑电力设备', '70%', '65%');
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
        	 var electricid = $("#grid-table").jqGrid("getRowData", curSelRowArr[i]).ELECTRICID;
        	 curSelMaintainidArr.push(electricid);
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
                url: BASE_URL + "publics/publicelectric/delete",
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
	$("#powersupply").val("");
	$("#loadlevel").val("");
}

function seach(){
	 reloadGrid();
}

/**
 * 详细查看
 */
function display(electricid) {
	 parent.openWin(BASE_URL + "views/module/publics/publicelectric/publicelectricDisplay.html?electricid="+electricid+"&isDisplay=isDisplay",
             "电力设备详情","70%", "65%");
}

/**
 * 刷新加载设备设施分页表格数据
 */
function reloadGrid() {
	var powersupply = $("#powersupply").val();
	var loadlevel = $("#loadlevel").val();
	if (loadlevel == "一级") {
		loadlevel = '1'
	}else if(loadlevel == "二级"){
		loadlevel = '2'
	}else if(loadlevel == "三级"){
		loadlevel = '3'
	}
    $("#grid-table").jqGrid("setGridParam", {
        page: 1,
        postData: {
        	powersupply:powersupply||"",
        	loadlevel:loadlevel||""
        }
    }).trigger("reloadGrid");
}