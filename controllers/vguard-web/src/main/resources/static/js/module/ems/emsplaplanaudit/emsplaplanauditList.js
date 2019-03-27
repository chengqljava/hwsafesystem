$(document).ready(function() {
	
	var colname = ['审核id','预案编号','预案名称','审核结果','审核人','审核时间']; 
	var colmodel = [
		{name:'AUDITID',index:'AUDITID', width:'5%',hidden: true},
		{name:'PLANNO',index:'PLANNO',width:'10%',align:'left'},
		{name:'PLANNAME',index:'PLANNAME',width:'20%',align:'left'},
		{name:'AUDITRESULT',index:'AUDITRESULT',width:'10%',align:'left',
			formatter:function(cellvalue, options, obj) { 
				return '<a href="javascript:void(0);" onclick="display(\''+obj.AUDITID+'\')">'+SelectOption.getEmsPlanAuditResult(obj.AUDITRESULT)+'</a>';
			}
		},
		{name:'NICKNAME',index:'NICKNAME',width:'10%',align:'left'},
		{name:'AUDITTIME',index:'AUDITTIME',width:'20%',align:'left',
			formatter:function(cellvalue, options, obj) { 
				return getFormatDateByLong(obj.AUDITTIME,"yyyy-MM-dd hh:mm:ss");
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
    	url : BASE_URL + "/ems/emsplaplanaudit/list",
		datatype: "json",
		cache : false,
		mtype : 'post',
		colNames:colname,
		colModel:colmodel,
		postData:{
			planid:$("#planid").val()
		},
		sortname : 'AUDITTIME',
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
		caption: "预案审核结果",
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
			planid:$("#planid").val()
			}
	}).trigger("reloadGrid");
}

/*详细查询*/
function display(auditid){
	parent.openWin(BASE_URL+"/ems/emsplaplanaudit/display/"+auditid,'详细','60%','45%');
}

