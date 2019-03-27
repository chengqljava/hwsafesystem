
$(document).ready(function() {
		var colname = ['日志id','操作人','模块名称','操作','IP地址','操作时间'];
		var colmodel = [
			{name:'OPERLOGID',index:'OPERLOGID', width:'10%',hidden: true},
			{name:'OPERATORNAME',index:'OPERATORNAME',width:'10%',align:'left',
				formatter:function(cellvalue, options, obj) { 
					if (obj.OPERATORNAME) {
						return '<a href="javascript:void(0);" onclick="display(\''+obj.OPERLOGID+'\')">'+obj.OPERATORNAME+'</a>';
					} else {
						return '<a href="javascript:void(0);" onclick="display(\''+obj.OPERLOGID+'\')">未登陆用户</a>';
					}
				}
			},
			{name:'MODULENAME',index:'MODULENAME',width:'10%',align:'center'},
			{name:'OPERNAME',index:'OPERNAME',width:'10%',align:'center'},
			{name:'IPADDRESS',index:'IPADDRESS',width:'10%',align:'center'},
			{name:'OPERATOTIME',index:'OPERATOTIME',width:'10%',align:'center',
				formatter:function(cellvalue, options, obj) { 
					if (obj.OPERATOTIME) {
						return getSmpFormatDateByLong(obj.OPERATOTIME, true);
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
	    	url : BASE_URL + "/system/sysoperlog/list",
			datatype: "json",
			cache : false,
			mtype : 'POST',
			colNames:colname,
			colModel:colmodel,
			postData:{
				opername:$('#opername').val(),
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
			caption: "操作日志",
			autowidth: true
		});
});

/*加载*/
function reloadGrid(){
	$("#grid-table").jqGrid('setGridParam',{
		page:1,postData:{
			opername:$('#opername').val(),
			operatorname:$('#operatorname').val()}
	}).trigger("reloadGrid");
}

/*搜索查询*/
$("#searchBtn").bind("click",function(){
	reloadGrid();
});

/*重置*/
$("#resetBtn").bind("click",function(){
	$("#opername").val("");
	$("#operatorname").val("");
});

/*详细查询*/
function display(operlogid){
	parent.openWin(BASE_URL+"/system/sysoperlog/display/"+operlogid,'详细','60%','50%');
}