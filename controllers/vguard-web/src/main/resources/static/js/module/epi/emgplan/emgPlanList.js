$(document).ready(function () {
	/**
	 * 环保信息-环评及行政许可
	 */
	var entid = getQueryString("businessinfoid");
	var isDisplay = getQueryString("isDisplay");
	if (isDisplay == "display") {
		$("#btnDiv").hide();
	}
    //生成任务列表分页表格
    var colname = ["id","预案编号","预案名称", "预案级别","预案类型","生效日期"],
        colmodel = [
            {
                name: "emgplanid",
                index: "emgplanid",
                width: "5%",
                align: "center",
                sortable: false,
                hidden: true
            },
            {
            	name: "emgplanno",
            	index: "emgplanno",
            	width: "20%",
            	align: "center",
            	sortable: false,
            },
            {
                name: "emgplanname",
                index: "emgplanname",
                width: "20%",
                align: "center",
                sortable: false,
                formatter: function (cellvalue, options, obj) {
            		return '<a href="javascript:void(0);" onclick="display(\'' + obj.emgplanid + '\')">' + obj.emgplanname + '</a>';
            	}
            },
            {
            	name: "emgplanlevel",
            	index: "emgplanlevel",
            	width: "20%",
            	align: "center",
            	sortable: false,
            	 formatter: function (cellvalue, options, obj) {
             		return SelectOption.getEmsPlanLevel(cellvalue);
             	}
            },
            {
                name: "emgplantype",
                index: "emgplantype",
                width: "20%",
                align: "center",
                sortable: false,
                formatter: function (cellvalue, options, obj) {
            		return SelectOption.getEmsPlanType(cellvalue);
            	}
            },
            {
                name: "effectivedate",
                index: "effectivedate",
                width: "20%",
                align: "center",
                sortable: false,
                formatter: function (cellvalue, options, obj) {
            		return getFormatDateByLong(cellvalue, 'yyyy-MM-dd');
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
        url: BASE_URL + "epi/epiemgplan/list",
        datatype: "json",
        cache: false,
        mtype: "POST",
        colNames: colname,
        colModel: colmodel,
        postData: {
        	entid:entid
        },
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
        caption: "环境应急预案列表",
        autowidth: true
    });

    $("#addBtn").off("click").on("click", function () {
    	parent.parent.openWin(BASE_URL + "views/module/epi/emgplan/emgPlanAdd.html?emgplanid=null&entid="+entid+"&addPage=addPage",
        		"新增环境应急预案", "65%", "75%");
    });
    
    //修改
    $("#editBtn").off("click").on("click", function () {
        //返回当前grid中复选框所选择的数据的id
        var curSelRowArr = $("#grid-table").jqGrid("getGridParam", "selarrrow");
        if (1 != curSelRowArr.length) {
            // 弹出提示信息
        	parent.parent.toast("请选择一条数据进行编辑！");
            return;
        }
            //打开页面
        var emgplanid = $("#grid-table").jqGrid("getRowData", curSelRowArr[0]).emgplanid;
        parent.parent.openWin(BASE_URL + "views/module/epi/emgplan/emgPlanAdd.html?emgplanid="+emgplanid,
        		"编辑环境应急预案",  "65%", "75%");
    });	
    
  //批量删除任务信息
    $("#delBtn").off("click").on("click", function () {
        // 返回当前grid中复选框所选择的数据的id
        var curSelRowArr = $("#grid-table").jqGrid("getGridParam", "selarrrow");
        if (0 == curSelRowArr.length) {
            // 弹出提示信息
        	parent.parent.toast("请选择需要删除的数据！");
            return;
        }

        var curSelBadIdArr = [];
        for (var i = 0; i < curSelRowArr.length; i++) {
        	var emgplanid = $("#grid-table").jqGrid("getRowData", curSelRowArr[i]).emgplanid;
        	curSelBadIdArr.push(emgplanid);
        }
        //执行删除操作
        delContructionInfo({"ids": curSelBadIdArr.toString()});
    });
    
    /**
     * 执行删除操作
     */
    function delContructionInfo(param) {
        //弹出提示框
    	parent.parent.confirm("确认删除记录?", function () {
            $.ajax({
                url: BASE_URL + "epi/epiemgplan/delete",
                type: "post",
                dataType: "json",
                data: param,
                success: function (json) {
                    if (json.success == true) {
                    	parent.parent.toast(json.msg);
                        reloadGrid();// 刷新列表
                    } else {
                    	parent.parent.toast(json.msg);
                    }
                }
            });
        });
    }

});
/**
 * 查看信息
 */
function display(emgplanid) {
	parent.parent.openWin(BASE_URL + "views/module/epi/emgplan/emgPlanDisplay.html?emgplanid="+emgplanid+"&isDisplay=isDisplay",
    		"环境应急预案详情",  "65%", "65%");
}

function reloadGrid() {
    $("#grid-table").jqGrid("setGridParam", {
        page: 1,
        postData: {}
    }).trigger("reloadGrid");
}

function getQueryString(name)
{
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return  unescape(r[2]); return null;
}