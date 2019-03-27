$(document).ready(function () {
	//显示操作权限按钮
	$("#tableOpers").displayOper();
    //生成任务列表分页表格
    var colname = ["主键id", "工商信息id","模板名称","检查周期(天)","检查项目(项)","备注"],
        colmodel = [
            {
                name: "CHECKTASKID",
                index: "CHECKTASKID",
                width: "5%",
                align: "left",
                sortable: false,
                hidden: true
            },
            {
            	name: "ENTID",
            	index: "ENTID",
            	width: "5%",
            	align: "left",
            	sortable: false,
            	hidden: true
            },
            {
            	name: "CHECKTASKNAME",
            	index: "CHECKTASKNAME",
            	width: "15%",
            	align: "left",
            	sortable: false,
            	formatter: function (cellvalue, options, obj) {
            		return '<a href="javascript:void(0);" onclick="display(\'' + obj.CHECKTASKID + '\')">' + obj.CHECKTASKNAME + '</a>';
            	}
            },
            {
            	name: "PERIOD",
            	index: "PERIOD",
            	width: "10%",
            	align: "left",
            	sortable: false,
            	hidden: true
            },
            {
            	name: "ITEMNUM",
            	index: "ITEMNUM",
            	width: "10%",
            	align: "left",
            	sortable: false,
            	formatter: function (cellvalue, options, obj) {
            		return '<a href="javascript:void(0);" onclick="displayItems(\'' + obj.CHECKTASKID + '\')">' + obj.ITEMNUM + '</a>';
            	}
            },
            {
            	name: "NOTE",
            	index: "NOTE",
            	width: "30%",
            	align: "left",
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
        url: BASE_URL + "hidden/hidchecktask/list",
        datatype: "json",
        cache: false,
        mtype: "POST",
        colNames: colname,
        colModel: colmodel,
        postData: {},
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
        caption: "任务列表",
        autowidth: true
    });

    //添加
    $("#addBtn").off("click").on("click", function (){
    	parent.openWin(BASE_URL
				+ "views/module/hidden/checkTask/editcheckTask.html?checktaskid=null",
				'新增任务', '65%', '75%');
    });
    //修改
    $("#editBtn").off("click").on("click", function (){
        //返回当前grid中复选框所选择的数据的id
        var curSelRowArr = $("#grid-table").jqGrid("getGridParam", "selarrrow");
        if (1 != curSelRowArr.length) {
            // 弹出提示信息
            parent.toast("请选择一条数据进行编辑！");
            return;
        }
        var checktaskid = $("#grid-table").jqGrid("getRowData", curSelRowArr[0]).CHECKTASKID;
        //TODO 弹出编辑框
        parent.openWin(BASE_URL
				+ "views/module/hidden/checkTask/editcheckTask.html?checktaskid="+checktaskid,
				'编辑任务', '55%', '70%');
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
        var curSeltaskIdArr = [];
        for (var i = 0; i < curSelRowArr.length; i++) {
        	var checktaskid = $("#grid-table").jqGrid("getRowData", curSelRowArr[i]).CHECKTASKID;
        	curSeltaskIdArr.push(checktaskid);
        }
        //执行删除操作
        delCheckTask({"ids": curSeltaskIdArr.toString()});
    });
});

function resetData(){
	$("#checktaskname").val("");
}

function seach(){
	 reloadGrid();
}
/**
 * 执行删除操作
 */
function delCheckTask(param) {
    //弹出提示框
    parent.confirm("确认删除任务吗?", function () {
        $.ajax({
            url: BASE_URL + "hidden/hidchecktask/delete",
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

/**
 * 详细查看任务信息详情
 */
function display(checktaskid) {
	 //返回当前grid中复选框所选择的数据的id
	parent.openWin(BASE_URL + "views/module/hidden/checkTask/displayCheckTask.html?checktaskid="+checktaskid,
             "任务详情", "55%", "70%");
}

function displayItems(checktaskid){
	parent.openWin(BASE_URL + "views/module/hidden/checkTask/checkTaskitemList.html?checktaskid="+checktaskid,
            "任务检查清单", "55%", "70%");
}
/**
 * 刷新时加载查询条件
 */
function reloadGrid() {
    $("#grid-table").jqGrid("setGridParam", {
        page: 1,
        postData: {
        	checktaskname:$("#checktaskname").val()
        }
    }).trigger("reloadGrid");
}