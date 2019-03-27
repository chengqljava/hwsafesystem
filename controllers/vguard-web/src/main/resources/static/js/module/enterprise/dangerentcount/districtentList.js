$(document).ready(function() {
	
	var colname = ['区域名称','生产许可','经营许可','其中仓储经营','运输许可','使用许可','废弃处置许可','使用非许可','许可企业','总企业数']; 
	var colmodel = [
		{name:'name',index:'name',width:'20%',align:'left',
			formatter:function(cellvalue, options, obj) { 
				if(obj.districttype=='community'){
					return obj.name;
				}else{
					return '<a href="javascript:void(0);" onclick="display(\''+obj.districtid+'\',\''+obj.districttype+'\')">'+obj.name+'</a>';
				}
			}
		},
		{name:'producqty',index:'producqty',width:'10%',align:'left'},
		{name:'businessqty',index:'businessqty',width:'10%',align:'left'},
		{name:'storageqty',index:'storageqty',width:'10%',align:'left'},
		{name:'transportqty',index:'transportqty',width:'10%',align:'left'},
		{name:'useqty',index:'useqty',width:'10%',align:'left'},
		{name:'disposqty',index:'disposqty',width:'10%',align:'left'},
		{name:'nopermitqty',index:'nopermitqty',width:'10%',align:'left'},
		{name:'permitentqty',index:'permitentqty',width:'10%',align:'left'},
		{name:'entqty',index:'entqty',width:'10%',align:'left'}
	];

	var tableHeight = $(window).height() - $('.pcheck').height() - 190;
	$(window).resize(function(){
		$("#grid-table").jqGrid( 'setGridHeight', $(window).height() - $('.pcheck').height() - 190 );
		$("#grid-table").jqGrid( 'setGridWidth', $(window).width()*0.99 );
	});

    $("#grid-table").jqGrid({
    	height: tableHeight,
    	url : BASE_URL + "/enterprise/dangerentcount/districtentlist",
		datatype: "json",
		cache : false,
		mtype : 'post',
		colNames:colname,
		colModel:colmodel,
		postData:{
			year:$("#year").val(), 
			districtid:$("#districtid").val(), 
			districttype:$("#districttype").val()
		},
		sortname : 'UPDATETIME',
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
		rowNum:100,
		rowList:[10,20,30],
		altRows: true,
		multiselect: false,
		caption: "",
		autowidth: true,
		loadComplete: function() {
			if($(window).width() < 700) {
				$('.ui-jqgrid-htable').css({"width":"900"});
				$("#grid-table").css({"width":"900" });
				$("#grid-table").closest(".ui-jqgrid-bdiv").css({ "overflow-x" : "scroll"});
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
			year:$("#year").val(), 
			districtid:$("#districtid").val(), 
			districttype:$("#districttype").val()
			             }
	}).trigger("reloadGrid");
}

/*详细查询*/
function display(districtid,districttype){
	$("#districtid").val(districtid);
	$("#districttype").val(districttype);
	reloadGrid();
}

