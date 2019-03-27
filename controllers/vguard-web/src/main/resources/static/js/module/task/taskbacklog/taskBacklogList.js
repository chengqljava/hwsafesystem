$(function () {
	SelectOption.loadTaskType("taskType");//任务事项
    //生成任务列表分页表格
    var colname = [
            "任务管理主键id", "任务名称", "待办类型", "任务事项", "被检查企业id", 
            "被检查企业名称", "主办执法人员id", "主办执法人", "协办执法人员id",
            "协办执法人", "任务描述", "流转状态", "任务开始日期", "任务结束日期", 
            "创建时间", "创建人id","关联执法检查id"
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
 				   //return '<a href="javascript:void(0);" onclick="handle(\''+obj.TASKID+'\',\''+obj.TASKNAME+'\',\''+obj.TASKTYPE+'\')">'+obj.TASKNAME+'</a>';
            		return '<a href="javascript:void(0);" onclick="display(\'' + obj.TASKID + '\',\'' + obj.HANDLEID + '\')">' + obj.TASKNAME + '</a>';
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
            	name: "TASKTYPE",
            	index: "TASKTYPE",
            	width: "10%",
            	align: "center",
            	sortable: false,
            	hidden: true,
            	formatter: function (cellvalue, options, obj) {
            		var lastVal = null;
            		switch (cellvalue) {
					case "01": lastVal = "检查";
						break;
					case "02": lastVal = "复查";
						break;
					case "03": lastVal = "取证";
						break;
					case "04": lastVal = "告知";
						break;
					case "05": lastVal = "催缴";
						break;
					default: lastVal = "检查";
						break;
					}
            		return lastVal;
                }
            },
            {
            	name: "BUSINESSINFOID",
            	index: "BUSINESSINFOID",
            	width: "15%",
            	align: "center",
            	sortable: false,
            	hidden: true
            },
            {
            	name: "ENTNAME",
            	index: "ENTNAME",
            	width: "30%",
            	align: "center",
            	sortable: false
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
            	name: "SLAVEL",
            	index: "SLAVEL",
            	width: "15%",
            	align: "center",
            	sortable: false,
            	hidden: true
            },
            {
            	name: "SLAVELNAME",
            	index: "SLAVELNAME",
            	width: "15%",
            	align: "center",
            	sortable: false,
            	hidden: true
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
            	name: "TASKSTATE",
            	index: "TASKSTATE",
            	width: "15%",
            	align: "center",
            	sortable: false,
            	formatter: function (cellvalue, options, obj) {
            		//结束时间与当前时间比较，判断是否属于延期状态
            		var lastVal = null;
            		var now  = new Date();
            		var endtime = new Date(obj.ENDTIME);
            		if(formatDate(now)>formatDate(endtime)){
            			lastVal = "延期";
            		}else{
            			switch (cellvalue) {
    					case "1": lastVal = "未开始";
    						break;
    					case "2": lastVal = "进行中";
    						break;
    					case "3": lastVal = "完成";
    						break;
    					default: lastVal = "未开始";
    						break;
    					}
            		}
            		
            		return lastVal;
                }
            },
            {
            	name: "STARTTIME",
            	index: "STARTTIME",
            	width: "15%",
            	align: "center",
            	sortable: true,
            	hidden: true,
            	formatter: function (cellvalue, options, obj) {
                    return getFormatDateByLong(obj.STARTTIME,
                        "yyyy-MM-dd");
                }
            },
            {
            	name: "ENDTIME",
            	index: "ENDTIME",
            	width: "15%",
            	align: "center",
            	sortable: true,
            	formatter: function (cellvalue, options, obj) {
                    return getFormatDateByLong(obj.ENDTIME,
                        "yyyy-MM-dd");
                }
            },
            {
            	name: "CREATETIME",
            	index: "CREATETIME",
            	width: "15%",
            	align: "center",
            	sortable: false,
            	hidden: true
            },
            {
            	name: "CREATEUSERID",
            	index: "CREATEUSERID",
            	width: "15%",
            	align: "center",
            	sortable: false,
            	hidden: true
            },
            {
            	name: "HANDLEID",
            	index: "HANDLEID",
            	width: "15%",
            	align: "center",
            	sortable: false,
            	hidden: true
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
        url: BASE_URL + "/task/backloglist",
        datatype: "json",
        cache: false,
        mtype: "POST",
        colNames: colname,
        colModel: colmodel,
        postData: {
            taskName: $("#taskName").val(),
            taskType: $("#taskType").val(),
            taskstate: $("#taskstate").val()
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
        caption: "待办事项",
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
					taskType:$("#taskType").val(),
					taskstate: $("#taskstate").val()
			             }
	}).trigger("reloadGrid");
}


$("#roleBtn").bind("click", function () {
    var ids = $("#grid-table").jqGrid('getGridParam', 'selarrrow');
    if (ids.length != 1) {
        // 弹出提示信息
        parent.toast("请选择一条记录！");
        return;
    }
    var rowdata = $("#grid-table").jqGrid('getRowData', ids[0]); //选中的一条记录
    if(rowdata.HANDLEID!=""){
    	display(rowdata.TASKID,rowdata.HANDLEID);
    }
    else{
    	display(rowdata.TASKID,null);
    }
});

/*重置*/
$("#resetBtn").bind("click",function(){
	$("#taskName").val("");
	$("#taskType").val("");
});

/*时间格式化*/
function formatDate(now){
	 var year = now.getFullYear();     
     var month = now.getMonth()+1; 
     if(month<10){
    	 month="0"+month;
     }
     var date = now.getDate();  
     if(date<10){
    	 date="0"+date;
     }
     return year+"-"+month+"-"+date;  
}


/**
 * 详细查看所派遣任务信息
 */
function display(taskId,handleid) {
	parent.openWin(BASE_URL + "/task/displayBacklog/" + taskId +"/"+ handleid,
		       "处理任务", "60%", "50%");
}
