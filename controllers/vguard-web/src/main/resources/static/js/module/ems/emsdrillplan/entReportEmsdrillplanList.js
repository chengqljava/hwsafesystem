$(document).ready(function () {
	initSeachInput();
    $("#tableOpers").displayOper();

    var colname = ["演练计划id", "企业名称","演练计划名称", "预案名称",  "计划演练时间", "演练地点", "演练形式","状态"],
        colmodel = [
            {
                name: "PID",
                index: "PID",
                align: "center",
                sortable: false,
                hidden: true
            },
            {
                name: "ENTNAME",
                index: "ENTNAME",
                align: "center",
                width: "18%",
                sortable: false,
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
                width: "12%",
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
                width: "8%",
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
//    $("#searchbtn").off("click").on("click", function () {
//        reloadGrid();
//    });
//    
//    $("#resetbtn").off("click").on("click", function () {
//        $('#planname').val(null).trigger('change');
//
//    });
    //审核
    $("#auditBtn").off("click").on("click",function(){
    	var curSelRowArr = $("#grid-table").jqGrid("getGridParam", "selarrrow");
    	if(0 == curSelRowArr.length) {
            // 弹出提示信息
            	parent.toast("请选择需要审核的记录！");
            	return;
        	}
   	 	var curSelPidIdArr = [];
        for (var i = 0; i < curSelRowArr.length; i++) {
        	var status = $("#grid-table").jqGrid("getRowData", curSelRowArr[i]).STATUS;
         	if (status == '已保存' ) {
         		parent.toast("请选择已上报记录进行审核");
                return;
 			}
        	var pid = $("#grid-table").jqGrid("getRowData", curSelRowArr[i]).PID;
        	curSelPidIdArr.push(pid);
        }
        parent.openWin(BASE_URL
                + "views/module/ems/emsdrillplan/auditEmsDrillPlan.html?curSelPidIdArr=" + curSelPidIdArr,
                '审核计划', '30%', '35%');
   });
});

function resetData(){
	$("#drillname").val("");
    $("#plandate").val("");
    $("#drilltype").val("");
}

function seach(){
	 reloadGrid();
}

/**
 * 详细查看场所类型
 */
function display(pid) {
    // 返回当前grid中复选框所选择的数据的id
    parent.openWin(BASE_URL + "views/module/ems/emsdrillplan/entReportEmsdrillplanDisplay.html?pid=" + pid,
        "演练计划详情", '55%', '50%');
}

/**
 * 刷新时加载查询条件
 */
function reloadGrid() {
	var drillname = $("#drillname").val();
    var plandate = $("#plandate").val();
    var drilltype = $("#drilltype").val();
    if(drilltype == "现场演练"){
    	drilltype = "1"
    } else if(drilltype == "桌面演练"){
    	drilltype = "2"
    } else if(drilltype == "综合演练"){
    	drilltype = "3"
    } else if(drilltype == "专项演练"){
    	drilltype = "4"
    }
    $("#grid-table").jqGrid("setGridParam", {
        page: 1,
        postData: {
        	drillname: drillname || "",
        	plandate: plandate || "",
        	drilltype: drilltype || "",
        }
    }).trigger("reloadGrid");
}