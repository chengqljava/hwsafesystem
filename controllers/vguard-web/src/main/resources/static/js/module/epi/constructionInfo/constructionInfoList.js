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
    var colname = ["id","项目名称","建设单位", "评价单位","项目审批文号"],
        colmodel = [
            {
                name: "consid",
                index: "consid",
                width: "5%",
                align: "center",
                sortable: false,
                hidden: true
            },
            {
            	name: "projectname",
            	index: "projectname",
            	width: "12.5%",
            	align: "center",
            	sortable: false,
            	formatter: function (cellvalue, options, obj) {
            		return '<a href="javascript:void(0);" onclick="display(\'' + obj.consid + '\')">' + obj.projectname + '</a>';
            	}
            },
            {
                name: "constructionname",
                index: "constructionname",
                width: "12.5%",
                align: "center",
                sortable: false
            },
            {
            	name: "evaluationunit",
            	index: "evaluationunit",
            	width: "12.5%",
            	align: "center",
            	sortable: false
            },
            {
                name: "approvedoc",
                index: "approvedoc",
                width: "12.5%",
                align: "center",
                sortable: false,
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
        url: BASE_URL + "epi/epiconstructioninfo/list",
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
        caption: "环评及行政许可列表",
        autowidth: true
    });

    $("#addBtn").off("click").on("click", function () {
    	parent.parent.openWin(BASE_URL + "views/module/epi/constructionInfo/constructionInfoAdd.html?consid=null&entid="+entid+"&addPage=addPage",
        		"新增环评及行政许可", "75%", "75%");
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
        var consid = $("#grid-table").jqGrid("getRowData", curSelRowArr[0]).consid;
        parent.parent.openWin(BASE_URL + "views/module/epi/constructionInfo/constructionInfoAdd.html?consid="+consid,
        		"编辑环评及行政许可",  "75%", "75%");
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
        	var consid = $("#grid-table").jqGrid("getRowData", curSelRowArr[i]).consid;
        	curSelBadIdArr.push(consid);
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
                url: BASE_URL + "epi/epiconstructioninfo/delete",
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
function display(consid) {
	parent.parent.openWin(BASE_URL + "views/module/epi/constructionInfo/constructionInfoDisplay.html?consid="+consid+"&isDisplay=isDisplay",
    		"环评及行政许可详情",  "75%", "75%");
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