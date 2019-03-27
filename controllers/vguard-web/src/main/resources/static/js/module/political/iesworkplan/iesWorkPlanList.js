	/**
	 * 隐患计划
	 */
$(document).ready(function () {
	
	initSeachInput();
	//显示操作权限按钮
	$("#tableOpers").displayOper();
    //生成任务列表分页表格
    var colname = ["计划id","计划标题","制定部门","计划负责人","联系电话","计划制定年份","关联内容"],
        colmodel = [
            {
                name: "WORKPLANID",
                index: "WORKPLANID",
                width: "5%",
                align: "center",
                sortable: false,
                hidden: true
            },
            {
                name: "PLANNAME",
                index: "PLANNAME",
                width: "10%",
                align: "center",
                sortable: false,
                formatter: function (cellvalue, options, obj) {
                    return '<a href="javascript:void(0);" onclick="display(\'' + obj.WORKPLANID + '\',\'' + obj.PLANNAME + '\')">' + obj.PLANNAME + '</a>';
                }
            },
            {
            	name: "ENACTDEPART",
            	index: "ENACTDEPART",
            	width: "10%",
            	align: "center",
            	sortable: false
            },
            {
                name: "PLANLEADER",
                index: "PLANLEADER",
                width: "15%",
                align: "center",
                sortable: false
            },
            {
            	name: "TEL",
            	index: "TEL",
            	width: "10%",
            	align: "center",
            	sortable: false
            },
            {
            	name: "ENACTTIME",
            	index: "ENACTTIME",
            	width: "10%",
            	align: "center",
            	sortable: false,
            	formatter: function (cellvalue, options, obj) {
                    return getFormatDateByLong(cellvalue, 'yyyy');
                }
            },
            {
            	name: "CONTENTCOUNT",
            	index: "CONTENTCOUNT",
            	width: "10%",
            	align: "center",
            	sortable: false,
            	hidden: true
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
        url: BASE_URL + "political/iesworkplan/list",
        datatype: "json",
        cache: false,
        mtype: "POST",
        colNames: colname,
        colModel: colmodel,
        postData: {
        	isgov:'1'//政府
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
        caption: "年度安全工作计划列表",
        autowidth: true
    });
    /**
     * 新增
     */
    $("#addBtn").off("click").on("click", function (){
    	parent.openWin(BASE_URL
				+ "views/module/political/iesworkplan/iesWorkPlanAdd.html?workplanid=-1",
				'新增年度安全工作计划', '53%', '60%');
    });
    
    /**
     * 编辑
     */
    $("#editBtn").off("click").on("click", function () {
        //返回当前grid中复选框所选择的数据的id
        var curSelRowArr = $("#grid-table").jqGrid("getGridParam", "selarrrow");
        if (1 != curSelRowArr.length) {
            // 弹出提示信息
            parent.toast("请选择一条数据进行编辑！");
            return;
        }
        //打开编辑页面
        var workplanid = $("#grid-table").jqGrid("getRowData", curSelRowArr[0]).WORKPLANID;
        parent.openWin(BASE_URL + "views/module/political/iesworkplan/iesWorkPlanAdd.html?workplanid=" + workplanid,
            "编辑年度安全工作计划", '55%', '60%');
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
        	var contentcount = $("#grid-table").jqGrid("getRowData", curSelRowArr[i]).CONTENTCOUNT;
        	console.log(contentcount);
        	if (contentcount >0) {
        		 parent.toast("记录已被引用，不可删除！");
                 return;
			}
        	var workplanid = $("#grid-table").jqGrid("getRowData", curSelRowArr[i]).WORKPLANID;
        	curSeltaskIdArr.push(workplanid);
        }
        //执行删除操作
        delCheckTask({"ids": curSeltaskIdArr.toString()});
    });
});

/**
 * 执行删除操作
 */
function delCheckTask(param) {
    //弹出提示框
    parent.confirm("确认删除记录吗?", function () {
        $.ajax({
            url: BASE_URL + "political/iesworkplan/delete",
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

function resetData(){
    $("#planname").val("");
    $("#planleader").val("");
    $("#enactdepart").val("");
    
}

function seach(){
	 reloadGrid();
}

/**
 * 周期计划
 * @param checkplanid
 * @param checkname
 */
function display(workplanid, checkname) {
    parent.openWin(BASE_URL + "views/module/political/iesworkplan/iesWorkPlanDisplay.html?workplanid=" + workplanid+"&display=display",
    		"年度安全工作计划详情",  '60%', '70%');
}

/**
 * 刷新时加载查询条件
 */
function reloadGrid() {
    $("#grid-table").jqGrid("setGridParam", {
        page: 1,
        postData: {
        	planname:$("#planname").val(),
        	planleader:$("#planleader").val(),
        	enactdepart:$("#enactdepart").val()
        }
    }).trigger("reloadGrid");
}