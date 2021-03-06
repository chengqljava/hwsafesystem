$(document).ready(function () {
    $("#tableOpers").displayOper();

    var colname = ["演练计划id", "演练计划名称", "预案名称",  "计划演练时间", "演练地点", "演练形式","状态"],
        colmodel = [
            {
                name: "PID",
                index: "PID",
                align: "center",
                sortable: false,
                hidden: true
            }, 
            {
                name: "DRILLNAME",
                index: "DRILLNAME",
                width: "14%",
                align: "center",
                sortable: false,
                formatter:function (cellvalue, options, obj) {
                    return '<a href="javascript:void(0);" onclick="display(\''+obj.PID+'\')">'+cellvalue +'</a>';
                }
            }, 
            {
                name: "PLANNAME",
                index: "PLANNAME",
                width: "14%",
                align: "center",
                sortable: false
            }, 
            {
                name: "PLANDATE",
                index: "PLANDATE",
                width: "10%",
                align: "center",
                sortable: false,
                formatter: function (cellvalue, options, obj) {
                	return getFormatDateByLong(cellvalue,"yyyy-MM");
                }
            }, 
            {
                name: "PLANADDRESS",
                index: "PLANADDRESS",
                width: "14%",
                align: "center",
                sortable: false
            }, 
            {
                name: "DRILLTYPE",
                index: "DRILLTYPE",
                width: "8%",
                align: "center",
                sortable: false,
                formatter: function (cellvalue, options, obj) {
                	return SelectOption.getDrilltype(cellvalue);
                }
            }, 
            {
                name: "STATUS",
                index: "STATUS",
                width: "10%",
                align: "center",
                sortable: false,
                formatter: function (cellvalue, options, obj) {
                	if (cellvalue == "1") {
                		return "已保存";
                	}else if(cellvalue == "2"){
                		return "已上报";
					}else if(cellvalue == "3"){
						return "审核同意";
					}else{
						return "审核不同意";
					}
				}
             }
             ];
    // 分页表格响应式处理
    var tableHeight = $(window).height() - $(".pcheck").height() - 190 - 33;
    $(window).resize(function () {
        $("#grid-table").jqGrid("setGridHeight", $(window).height() - $('.pcheck').height() - 190 - 33);
        $("#grid-table").jqGrid("setGridWidth", $(window).width() * 0.99);
    });

    $("#grid-table").jqGrid({
        height: tableHeight,
        url: BASE_URL + "ems/emsdrillplan/list",
        datatype: "json",
        cache: false,
        mtype: "POST",
        colNames: colname,
        colModel: colmodel,
        postData: {
        	isgov:$("#isgov").val()
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
        caption: "演练计划列表",
        autowidth: true
    });

    // 查询按钮事件
    $("#searchbtn").off("click").on("click", function () {
        reloadGrid();
    });
    
    $("#resetbtn").off("click").on("click", function () {
        $('#planname').val(null).trigger('change');

    });

    // 添加接警信息
    $("#addBtn").off("click").on("click", function () {
        parent.openWin(BASE_URL
            + "views/module/ems/emsdrillplan/entEmsdrillplanAdd.html?pid=-1",
            '添加演练计划', '50%', '60%');
    });

    // 修改接警信息
    $("#editBtn").off("click").on("click", function () {
        // 返回当前grid中复选框所选择的数据的id
        var curSelRowArr = $("#grid-table").jqGrid("getGridParam", "selarrrow");
        if (1 != curSelRowArr.length) {
            // 弹出提示信息
            parent.toast("请选择一条数据进行编辑！");
            return;
        }
        var status = $("#grid-table").jqGrid("getRowData", curSelRowArr[0]).STATUS;
    	if (status == '已上报') {
    		parent.toast("记录已上报，不可编辑！");
            return;
		}else if(status == '审核同意' || status == '审核不同意'){
			parent.toast("记录已上报审核，不可编辑！");
            return;
		}
        var pid = $("#grid-table").jqGrid("getRowData", curSelRowArr[0]).PID;
        // TODO 弹出编辑框
        parent.openWin(BASE_URL
            + "views/module/ems/emsdrillplan/entEmsdrillplanAdd.html?pid=" + pid,
            '修改演练计划', '50%', '60%');

    });
    
    // 批量删除
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
        	var status = $("#grid-table").jqGrid("getRowData", curSelRowArr[i]).STATUS;
        	if (status == '已上报' ) {
        		parent.toast("记录已上报，不可删除！");
                return;
			}else if(status == '审核同意' || status == '审核不同意'){
				parent.toast("记录已上报审核，不可删除！");
                return;
			}
        	var pid = $("#grid-table").jqGrid("getRowData", curSelRowArr[i]).PID;
        	curSelBadIdArr.push(pid);
        }
        // 执行删除操作
        delPlan({"ids": curSelBadIdArr.toString()});
    });
    
    //上报
    $("#reportBtn").off("click").on("click",function(){
    	var curSelRowArr = $("#grid-table").jqGrid("getGridParam", "selarrrow");
    	 if (0 == curSelRowArr.length) {
             // 弹出提示信息
             parent.toast("请选择需要上报的记录！");
             return;
         }
    	 var curSelBadIdArr = [];
         for (var i = 0; i < curSelRowArr.length; i++) {
        	var status = $("#grid-table").jqGrid("getRowData", curSelRowArr[i]).STATUS;
         	if (status == '已上报' ) {
         		parent.toast("记录已上报，不可重复上报！");
                return;
 			}else if(status == '审核同意' || status == '审核不同意'){
 				parent.toast("记录已上报审核，不可重复上报！");
                return;
 			}
         	var pid = $("#grid-table").jqGrid("getRowData", curSelRowArr[i]).PID;
         	curSelBadIdArr.push(pid);
         }
         report({"ids": curSelBadIdArr.toString()});
    });
    
    /**
	 * 执行删除操作
	 */
    function delPlan(param) {
        // 弹出提示框
        parent.confirm("确认删除记录?", function () {
            $.ajax({
                url: BASE_URL + "ems/emsdrillplan/delete",
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
 * 上报
 * @param param
 */
function report(param){
	 parent.confirm("上报后将不能进行修改和删除操作，确定上报吗？", function () {
         $.ajax({
             url: BASE_URL + "ems/emsdrillplan/report",
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
 * 详细查看场所类型
 */
function display(pid) {
    // 返回当前grid中复选框所选择的数据的id
    parent.openWin(BASE_URL + "views/module/ems/emsdrillplan/entEmsdrillplanDisplay.html?pid=" + pid,
        "演练计划详情", '55%', '50%');
}

/**
 * 刷新时加载查询条件
 */
function reloadGrid() {
	var drillname = $("#drillname").val();
    var plandate = $("#plandate").val();
    var drilltype = $("#drilltype").val();
    $("#grid-table").jqGrid("setGridParam", {
        page: 1,
        postData: {
        	drillname: drillname || "",
        	plandate: plandate || "",
        	drilltype: drilltype || "",
        }
    }).trigger("reloadGrid");
}