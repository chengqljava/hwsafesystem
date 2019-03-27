$(document).ready(function() {

	var colname = ['流程id','流程名称','相关企业','待办理任务','开始时间','任务负责人','流程图']; 
	var colmodel = [
		{name:'PROCINSTID',index:'PROCINSTID', width:'5%',hidden: true},
		{name:'PROCNAME',index:'PROCNAME',width:'10%',align:'left',
			formatter:function(cellvalue, options, obj) { 
				return '<a href="javascript:void(0);" onclick="displayTaskList(\''+obj.PROCINSTID+'\')">'+obj.PROCNAME+'</a>';
			}
		},
		{name:'ENTNAME',index:'ENTNAME',width:'20%',align:'left'},
		{name:'TASKNAME',index:'TASKNAME',width:'10%',align:'left'},
		{name:'CREATETIME',index:'CREATETIME',width:'10%',align:'center'},
		{name:'NICKNAME',index:'NICKNAME',width:'10%',align:'center'},
		{name:'PROCNAME',index:'PROCNAME',width:'10%',align:'center',
			formatter:function(cellvalue, options, obj) { 
				return '<a href="javascript:void(0);" onclick="displayProcinst(\''+obj.PROCINSTID+'\')">查看</a>';
			}
		}
	];

	var tableHeight = $(window).height() - $('.pcheck').height() - 190;
	$(window).resize(function(){
		$("#grid-table").jqGrid( 'setGridHeight', $(window).height() - $('.pcheck').height() - 190 );
		$("#grid-table").jqGrid( 'setGridWidth', $(window).width()*0.99 );
	});
		
    $("#grid-table").jqGrid({
    	height: tableHeight,
    	url : BASE_URL + "/law/lawmydoc/activeproclist",
		datatype: "json",
		cache : false,
		mtype : 'post',
		colNames:colname,
		colModel:colmodel,
		postData:{
			//deptid:$("#deptid").val()
		},
		sortname : 'CREATETIME',
		sortorder : "desc",
		viewrecords : true,
		pager : "#grid-pager",
		jsonReader : {
			root : "datas",
			total : "total",
			page : "page",
			records : "records",
			repeatitems : false
		},
		rowNum:10,
		rowList:[10,20,30],
		altRows: true,
		multiselect: true,
		caption: "运行中文书",
		autowidth: true
	});
});

/*加载*/
function reloadGrid(){
	$("#grid-table").jqGrid('setGridParam',{
		page:1,postData:{
			//deptid:$("#deptid").val()
			}
	}).trigger("reloadGrid");
}


/*流程任务列表展示*/
function displayTaskList(procinstid){
	parent.openWin(BASE_URL+"/law/lawmydoc/displayTaskList/"+procinstid,'流程任务办理日志','70%','80%');
}

/*流程图展示*/
function displayProcinst(procinstid){
	parent.openWin(BASE_URL+"/law/lawmydoc/displayProcinst/"+procinstid,'流程任务流转图','70%','80%');
}




 

