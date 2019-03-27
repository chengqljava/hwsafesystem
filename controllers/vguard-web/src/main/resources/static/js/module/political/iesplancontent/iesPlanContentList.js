	/**
	 * 隐患计划
	 */
$(document).ready(function () {
	
	initSeachInput();
	initDateSeacher("begintime","endtime");
	//显示操作权限按钮
	$("#tableOpers").displayOper();
	
	SelectTwo.initSelect2($('#workplanid'), BASE_URL + "political/iesworkplan/loadSimpleData", '请选择计划', formatRepo, formatRepoSelection);	
    //生成任务列表分页表格
    var colname = ["计划内容id","计划id","警示灯","主要工作内容","所属计划","执行负责人","计划开始时间","计划结束时间","完成情况"],
        colmodel = [
            {
                name: "PLANCONTENTID",
                index: "PLANCONTENTID",
                width: "5%",
                align: "center",
                sortable: false,
                hidden: true
            },
            {
                name: "WORKPLANID",
                index: "WORKPLANID",
                width: "5%",
                align: "center",
                sortable: false,
                hidden: true
            },
            {
            	name: "POINT",
                index: "POINT",
                width: "5%",
                align: "center",
                sortable: false,
                formatter: function (cellvalue, options, obj) {
                	if(obj.STATE=='0'){
                		return "<img src='"+BASE_URL+"/images/permitlight/lightred.gif' title='未上传附件'/>";
                	}else if(obj.STATE=='1'){
                		return "<img src='"+BASE_URL+"/images/permitlight/lightgreen.gif' title='已上传附件'/>";
                	}
                }
            },
            {
                name: "PLANCONTENT",
                index: "PLANCONTENT",
                width: "35%",
                align: "center",
                sortable: false,
                formatter: function (cellvalue, options, obj) {
                    return '<a href="javascript:void(0);" onclick="display(\'' + obj.PLANCONTENTID + '\',\'' + obj.PLANCONTENT + '\')">' + obj.PLANCONTENT + '</a>';
                }
            },
            {
            	name: "PLANNAME",
            	index: "PLANNAME",
            	width: "15%",
            	align: "center",
            	sortable: false
            },
            {
            	name: "EXELEADER",
            	index: "EXELEADER",
            	width: "8%",
            	align: "center",
            	sortable: false
            },
            {
                name: "BEGINTIME",
                index: "BEGINTIME",
                width: "8%",
                align: "center",
                sortable: false,
                formatter: function (cellvalue, options, obj) {
                    return getFormatDateByLong(cellvalue, 'yyyy-MM');
                }
            },
            {
            	name: "ENDTIME",
            	index: "ENDTIME",
            	width: "8%",
            	align: "center",
            	sortable: false,
            	formatter: function (cellvalue, options, obj) {
                    return getFormatDateByLong(cellvalue, 'yyyy-MM');
                }
            },
            {
            	name: "STATE",
            	index: "STATE",
            	width: "8%",
            	align: "center",
            	sortable: false,
            	formatter: function (cellvalue, options, obj) {
                   if (cellvalue == "0") {
                	   return "未完成";
                   }else if(cellvalue == "1"){
                	   return "已完成";
                   }
                }
            },
        ];
    //分页表格响应式处理
    var tableHeight = $(window).height() - $(".pcheck").height() - 190 - 33;
    $(window).resize(function () {
        $("#grid-table").jqGrid("setGridHeight", $(window).height() - $('.pcheck').height() - 190 - 33);
        $("#grid-table").jqGrid("setGridWidth", $(window).width() * 0.99);
    });

    $("#grid-table").jqGrid({
        height: tableHeight,
        url: BASE_URL + "political/iesworkplancontent/list",
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
        caption: "安全工作计划内容列表",
        autowidth: true
    });
    /**
     * 新增
     */
    $("#addBtn").off("click").on("click", function (){
    	parent.openWin(BASE_URL
				+ "views/module/political/iesplancontent/iesPlanContentAdd.html?plancontentid=-1",
				'新增年度安全工作计划内容', '53%', '60%');
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
        var plancontentid = $("#grid-table").jqGrid("getRowData", curSelRowArr[0]).PLANCONTENTID;
        parent.openWin(BASE_URL + "views/module/political/iesplancontent/iesPlanContentAdd.html?plancontentid=" + plancontentid,
            "编辑年度安全工作计划内容", '55%', '60%');
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
        	var plancontentid = $("#grid-table").jqGrid("getRowData", curSelRowArr[i]).PLANCONTENTID;
        	curSeltaskIdArr.push(plancontentid);
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
            url: BASE_URL + "political/iesworkplancontent/delete",
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
	$("#workplanid").val(null).trigger("change");
    $('#daterange-btn span').html(" 日期选择");
	$("#begintime").val("");
	$("#endtime").val("");
    $("#state").val("");
    
}

function seach(){
	 reloadGrid();
}

function display(plancontentid, checkname) {
    parent.openWin(BASE_URL + "views/module/political/iesplancontent/iesPlanContentDisplay.html?plancontentid=" + plancontentid+"&display=display",
    		"安全工作计划内容详情",'55%', '60%');
}


function formatRepo(repo) {
    if (repo.loading) {
        return repo.text;
    }
    var markup = "<div class='select2-result-repository clearfix'>" + repo.text + "</div>";

    return markup;
}

function formatRepoSelection(repo) {
    $("#workplanid").val(repo.id);
    return repo.text;
}


/**
 * 刷新时加载查询条件
 */
function reloadGrid() {
	var state = $("#state").val();
	if (state == "未完成") {
		state = "0";
	}else if(state == "已完成"){
		state = "1";
	}
	
    $("#grid-table").jqGrid("setGridParam", {
        page: 1,
        postData: {
        	workplanid:$("#workplanid").val(),
        	begintime:$("#begintime").val(),
        	endtime:$("#endtime").val(),
        	state:state
        }
    }).trigger("reloadGrid");
}