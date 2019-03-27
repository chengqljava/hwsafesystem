$(document).ready(function() {
		var colname = ['日志id','操作人','发生异常类','IP地址','操作时间'];
		var colmodel = [
			{name:'exclogid',index:'exclogid', width:'15%',hidden: true},
			{name:'operatorname',index:'operatorname',width:'10%',align:'left',
				formatter:function(cellvalue, options, obj) { 
					if (obj.operatorname) {
						return '<a href="javascript:void(0);" onclick="display(\''+obj.exclogid+'\')">'+obj.operatorname+'</a>';
					} else {
						return '<a href="javascript:void(0);" onclick="display(\''+obj.exclogid+'\')">未登陆用户</a>';
					}
				}
			},
			{name:'exclogtype',index:'exclogtype',width:'20%',align:'center'},
			{name:'ipaddress',index:'ipaddress',width:'10%',align:'center'},
			{name:'operatotime',index:'operatotime',width:'10%',align:'center',
				formatter:function(cellvalue, options, obj) { 
					if (obj.operatotime) {
						return getSmpFormatDateByLong(obj.operatotime, true);
					} else {
						return "";
					}
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
	    	url : BASE_URL + "/system/sysexclog/list",
			datatype: "json",
			cache : false,
			mtype : 'POST',
			colNames:colname,
			colModel:colmodel,
			postData:{
				exclogtype:$('#exclogtype').val(),
				operatorname:$('#operatorname').val()
			},
			sortname : 'operatotime',
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
			caption: "异常日志",
			autowidth: true
		});
});

/*加载*/
function reloadGrid(){
	$("#grid-table").jqGrid('setGridParam',{
		page:1,postData:{
			exclogtype:$('#exclogtype').val(),
			operatorname:$('#operatorname').val()}
	}).trigger("reloadGrid");
}

/*搜索查询*/
$("#searchBtn").bind("click",function(){
	reloadGrid();
});

/*重置*/
$("#resetBtn").bind("click",function(){
	$("#exclogtype").val("");
	$("#operatorname").val("");
});

/*详细查询*/
function display(exclogid){
	parent.openWin(BASE_URL+"/system/sysexclog/display/"+exclogid,'详细','60%','60%');
}