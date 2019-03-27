$(document).ready(function() {

	var colname = ['任务id','流程名称','相关企业','待签收任务','开始时间','流程图']; 
	var colmodel = [
		{name:'TASKID',index:'TASKID', width:'5%',hidden: true},
		{name:'PROCNAME',index:'PROCNAME',width:'10%',align:'left',
			formatter:function(cellvalue, options, obj) { 
				return '<a href="javascript:void(0);" onclick="displayTaskList(\''+obj.PROCINSTID+'\')">'+obj.PROCNAME+'</a>';
			}
		},
		{name:'ENTNAME',index:'ENTNAME',width:'20%',align:'left'},
		{name:'TASKNAME',index:'TASKNAME',width:'10%',align:'left'},
		{name:'CREATETIME',index:'CREATETIME',width:'10%',align:'center'},
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
    	url : BASE_URL + "/law/lawmydoc/signtasklist",
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
		caption: "未签收文书",
		autowidth: true,
		loadComplete: function() {
			if($(window).width() < 700) {
				$('.ui-jqgrid-htable').css({"width":"900"});
				$("#grid-table").css({"width":"900"});
				$("#grid-table").closest(".ui-jqgrid-bdiv").css({ "overflow-x" : "scroll","height":"350"});
				$(".ui-jqgrid-hdiv").css({ "overflow-x" : "scroll"});
			} else {
				$("#grid-table").jqGrid( 'setGridWidth', $(window).width()*0.99 );
			}
		}
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

/*签收任务*/
$("#claimBtn").on("click", function () {
	var ids = $("#grid-table").jqGrid('getGridParam','selarrrow');
	if(ids.length !=1){
		// 弹出提示信息
		parent.toast("请选择一条记录！");
		return;
	}
	var rowdata = $("#grid-table").jqGrid('getRowData',ids[0]); //选中的一条记录
	var taskid = rowdata.TASKID;
	

		//弹出提示框
		parent.confirm("确认签收该任务吗?", function() { 
			 $.ajax({ 
				 	url: BASE_URL+"/law/lawmydoc/claim",
			  		type:'post',
			  		dataType:'json',
			  		data:{"taskid":taskid},
			  		success: function(json){
			  			if(json.success==true){
			  				parent.toast(json.msg);
			  				reloadGrid();//刷新列表
			  			}else{
			  				parent.toast(json.msg);
			  			}
			  		}
				 });
	    });
});


/*流程任务列表展示*/
function displayTaskList(procinstid){
	parent.openWin(BASE_URL+"/law/lawmydoc/displayTaskList/"+procinstid,'流程任务办理日志','70%','80%');
}

/*流程图展示*/
function displayProcinst(procinstid){
	parent.openWin(BASE_URL+"/law/lawmydoc/displayProcinst/"+procinstid,'流程任务流转图','70%','80%');
}

 

