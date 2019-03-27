$(function () {
    //生成任务列表分页表格
    var colname = [
            "主键id", "标题", "待办类型",  
             "提醒人员id", "提醒人",  "内容",  "创建时间"
        ],
        colmodel = [
            {
                name: "TASKID",
                index: "TASKID",
                width: "15%",
                align: "center",
                sortable: false,
                hidden: true
            },
            {
            	name: "TASKNAME",
            	index: "TASKNAME",
            	width: "30%",
            	align: "center",
            	sortable: false,
            	formatter:function(cellvalue, options, obj) { 
            		return '<a href="javascript:void(0);" onclick="display(\'' + obj.TASKID + '\')">' + obj.TASKNAME + '</a>';
            	}
            },
            {
            	name: "BACKLOGTYPE",
            	index: "BACKLOGTYPE",
            	width: "15%",
            	align: "center",
            	sortable: false,
            	hidden: true,
            	formatter:function(cellvalue, options, obj) { 
    				if(obj.BACKLOGTYPE == "01"){
    					return '日程安排';
    				}else if(obj.BACKLOGTYPE == "02"){
    					return '系统提醒';
    				}else if(obj.BACKLOGTYPE == "03"){
    					return '工作派遣';
    				}else{
    					return '';
    				}
    			}
            },
            {
            	name: "MASTER",
            	index: "MASTER",
            	width: "15%",
            	align: "center",
            	sortable: false,
            	hidden: true
            },
            {
            	name: "MASTERNAME",
            	index: "MASTERNAME",
            	width: "15%",
            	align: "center",
            	sortable: false
            },
            {
            	name: "TASKDESC",
            	index: "TASKDESC",
            	width: "15%",
            	align: "center",
            	sortable: false,
            	hidden: true
            },
            {
            	name: "CREATETIME",
            	index: "CREATETIME",
            	width: "15%",
            	align: "center",
            	sortable: false,
            	formatter: function (cellvalue, options, obj) {
                    return getFormatDateByLong(obj.CREATETIME,
                        "yyyy-MM-dd");
                }
            }
        ];
    
    //分页表格响应式处理
    var tableHeight = $(window).height() - $(".pcheck").height() - 190 - 33;
    $(window).resize(function () {
        $("#grid-table").jqGrid("setGridHeight", $(window).height() - $('.pcheck').height() - 190 -33);
        $("#grid-table").jqGrid("setGridWidth", $(window).width() * 0.99);
    });

    $("#grid-table").jqGrid({
        height: tableHeight,
        url: BASE_URL + "/remind/systemmessagelist",
        datatype: "json",
        cache: false,
        mtype: "POST",
        colNames: colname,
        colModel: colmodel,
        postData: {
            taskName: $("#taskName").val(),
            taskDesc: $("#taskDesc").val(),
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
        caption: "系统提醒",
        autowidth: true
    });

    /*搜索查询*/
    $("#searchbtn").bind("click",function(){
    	reloadGrid();
    });

});



/*加载*/
function reloadGrid(){
	$("#grid-table").jqGrid('setGridParam',{
		page:1,postData:{
					taskName:$("#taskName").val(),
					taskDesc:$("#taskDesc").val()
			             }
	}).trigger("reloadGrid");
}


/*重置*/
$("#resetBtn").bind("click",function(){
	$("#taskName").val("");
	$("#taskType").val("");
});


/**
 * 详细查看
 */
function display(taskId) {
	parent.openWin(BASE_URL + "/remind/display/" + taskId ,
		       "系统提醒详情", "60%", "40%");
}
