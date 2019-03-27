$(document).ready(function() {
	var colname = ['审核id','审核部门','审核时间','审核意见','审核状态']; 
	var colmodel = [
		{name:'ENTAUDITID',index:'ENTAUDITID', width:'5%',hidden: true},
		{name:'AUDITORG',index:'AUDITORG',width:'25%',align:'left'},
		{name:'AUDITTIME',index:'AUDITTIME',width:'25%',align:'left',
			formatter : function(cellvalue, options, obj) {
				return getFormatDateByLong(obj.AUDITTIME,
						"yyyy-MM-dd");
			}	
		},
		{name:'AUDITIDEA',index:'AUDITIDEA',width:'25%',align:'left'},
		{name:'AUDITSTATUS',index:'AUDITSTATUS',width:'25%',align:'left',editoptions : {value:"0:审核未通过;1:审核通过;"},formatter:'select'}
	];
	
	$(window).on('resize.jqGrid', function () {
		$("#grid-table").jqGrid( 'setGridWidth', $(window).width()*0.99);
    })
    $("#grid-table").jqGrid({
    	height: 250,
    	url : BASE_URL + "/enterprise/entaudit/list",
		datatype: "json",
		cache : false,
		mtype : 'post',
		colNames:colname,
		colModel:colmodel,
		postData:{
			businessinfoid:$("#businessinfoid").val()
		},
		sortname : 'audittime',
		sortorder : "desc",
		viewrecords : true,
		//pager : "#grid-pager",
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
		autowidth: true
	});
});

/*加载*/
function reloadGrid(districtcode,districtname){
	$("#grid-table").jqGrid('setGridParam',{
		page:1,postData:{
					districtname:districtname
			             }
	}).trigger("reloadGrid");
}