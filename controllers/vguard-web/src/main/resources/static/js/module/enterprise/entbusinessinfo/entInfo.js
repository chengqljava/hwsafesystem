$(document).ready(function() {
	
	var colname = ['主键id','企业名称','组织机构代码','注册地址','注册类型','法定代表人','手机号码','是否三小场所']; 
	var colmodel = [
		{name:'BUSINESSINFOID',index:'BUSINESSINFOID', width:'5%',hidden: true},
		{name:'ENTNAME',index:'ENTNAME',width:'10%',align:'left'},
		{name:'ENTCODE',index:'ENTCODE',width:'10%',align:'left'},
		{name:'ADDRESS',index:'ADDRESS',width:'10%',align:'left'},
		{name:'ENTTYPE',index:'ENTTYPE',width:'10%',align:'left'},
		{name:'LEGALPERSON',index:'LEGALPERSON',width:'10%',align:'left'},
		{name:'PHONE',index:'PHONE',width:'10%',align:'left'},
		{name:'ISLITTLE',index:'ISLITTLE',width:'10%',align:'left',
			formatter : function(cellvalue, options, obj) {
				if(obj.ISLITTLE == '0'){
					return "否";
				}else{
					return "是";
				}
		}}
	];
	var tableHeight = $(window).height() - $('.pcheck').height() - 240;
	$(window).on('resize.jqGrid', function () {
		$("#grid-table").jqGrid( 'setGridWidth', $(window).width()*0.99 );
		$("#grid-table").jqGrid( 'setGridHeight', $(window).height() - $('.pcheck').height() - 240 );
   });

    $("#grid-table").jqGrid({
    	height: tableHeight,
    	url : BASE_URL + "/enterprise/entbusinessinfo/entinfo",
		datatype: "json",
		cache : false,
		mtype : 'post',
		colNames:colname,
		colModel:colmodel,
		postData:{
			entname:$("#entname").val(),
			entcode:$("#entcode").val(),
			planid:$("#planid").val()
		},
		sortname : 'BUSINESSINFOID',
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
		caption: "企业信息",
		autowidth: true
	});
	
});

/**
 * 确定
 */
$("#conBtn").on("click", function () {
	var ids = $("#grid-table").jqGrid('getGridParam','selarrrow');
	if(ids.length !=1){
		// 弹出提示信息
		parent.toast("请选择一条记录！");
		return;
	}
	var rowdata = $("#grid-table").jqGrid('getRowData',ids[0]); //选中的一条记录
	window.top.GEventObject.fireEvent('LOAD_ENT_EVENT',rowdata);
	parent.closeWin();
});

/*返回*/
$("#backBtn").bind("click",function(){
	parent.closeWin();
});


/*搜索查询*/
$("#searchBtn").bind("click",function(){
	reloadGrid();
});

/*重置*/
$("#resetBtn").bind("click",function(){
	$("#entname").val("");
	$("#entcode").val("");
});

/*加载*/
function reloadGrid(){
	$("#grid-table").jqGrid('setGridParam',{
		page:1,postData:{
			entname:$("#entname").val(),
			entcode:$("#entcode").val(),
			planid:$("#planid").val()
		}
	}).trigger("reloadGrid");
}



