$(document).ready(function() {
	
	var colname = ['任务id','任务名称','任务开始时间','任务结束时间','任务办理人']; 
	var colmodel = [
		{name:'TASKID',index:'TASKID', width:'5%',hidden: true},
		{name:'TASKNAME',index:'TASKNAME',width:'20%',align:'left',
			formatter:function(cellvalue, options, obj) { 
				if(obj.TASKNAME){
					return '<a href="javascript:void(0);" onclick="displayDocList(\''+obj.TASKID+'\')">'+obj.TASKNAME+'</a>';
				}else if(obj.URL){
					return '<a href="javascript:void(0);" onclick="displayDoc(\''+obj.URL+'\')">文书内容</a>';
				}
			}
		},
		{name:'STARTTIME',index:'STARTTIME',width:'10%',align:'center'},
		{name:'ENDTIME',index:'ENDTIME',width:'10%',align:'center'},
		{name:'NICKNAME',index:'NICKNAME',width:'10%',align:'center'}
	];

	var tableHeight = $(window).height() - $('.pcheck').height() - 190;
	$(window).resize(function(){
		$("#grid-table").jqGrid( 'setGridHeight', $(window).height() - $('.pcheck').height() - 190 );
		$("#grid-table").jqGrid( 'setGridWidth', $(window).width()*0.99 );
	});
		
    $("#grid-table").jqGrid({
    	height: tableHeight,
    	url : BASE_URL + "/law/lawmydoc/tasklist",
		datatype: "json",
		cache : false,
		mtype : 'post',
		colNames:colname,
		colModel:colmodel,
		postData:{
			procinstid:$("#procinstid").val()
		},
		sortname : 'STARTTIME',
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
		multiselect: false,
		caption: "",
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
			procinstid:$("#procinstid").val()
			}
	}).trigger("reloadGrid");
}


/*任务文书列表展示*/
function displayDocList(taskid){
	parent.openWin(BASE_URL+"/law/lawmydoc/displayDocList/"+taskid,'任务文书','80%','98%');
}

/*展示文书内容*/
function displayDoc(url){
	parent.openWin(BASE_URL+url,'文书内容','80%','98%');
}




 

