$(document).ready(function() {
	
	var colname = ['目录id','品名_val','品名','别名','类别','危险货物编号','CAS','UN','MSDS']; 
	var colmodel = [
		{name:'CHEMCATALID',index:'CHEMCATALID', width:'5%',hidden: true},
		{name:'CHEMCATALNAME',index:'CHEMCATALNAME', width:'5%',hidden: true},
		{name:'CHEMCATALNAME_TEXT',index:'CHEMCATALNAME_TEXT',width:'20%',align:'left',
			formatter:function(cellvalue, options, obj) { 
				return '<a href="javascript:void(0);" onclick="display(\''+obj.CHEMCATALID+'\')">'+obj.CHEMCATALNAME+'</a>';
			}
		},
		{name:'ALIAS',index:'ALIAS',width:'20%',align:'left'},
		{name:'DANGERTYPENAME',index:'DANGERTYPENAME',width:'20%',align:'left',hidden: true},
		{name:'SPECIFICATIONS',index:'SPECIFICATIONS',width:'10%',align:'left'},
		{name:'CAS',index:'CAS',width:'10%',align:'left'},
		{name:'UN',index:'UN',width:'10%',align:'left'},
		{name:'MSDS',index:'MSDS',width:'10%',align:'center',
			formatter:function(cellvalue, options, obj) { 
				if(obj.MSDS=="true"){
					return '<a href="javascript:void(0);" onclick="gotoMSDS(\''+obj.CAS+'\',\''+obj.UN+'\')">进入</a>';
				}else{
					return '';
				}
			}
		}
	];
	
	var tableHeight = $(window).height() - $('.pcheck').height() - 190 -33;
	$(window).resize(function(){
		$("#grid-table").jqGrid( 'setGridHeight', $(window).height() - $('.pcheck').height() - 190 -33 );
		$("#grid-table").jqGrid( 'setGridWidth', $(window).width()*0.99 );
	});
    $("#grid-table").jqGrid({
    	height: tableHeight,
    	url : BASE_URL + "/knowledge/knochemicalcatal/list",
		datatype: "json",
		cache : false,
		mtype : 'post',
		colNames:colname,
		colModel:colmodel,
		postData:{
			chemcatalname:$("#chemcatalname").val(),
			alias:$("#alias").val(),
			cas:$("#cas").val(),
			un:$("#un").val()
		},
		sortname : 'CHEMCATALID',
		sortorder : "asc",
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
		caption: "危险化学品名录库",
		autowidth: true
	});
});

/*加载*/
function reloadGrid(){
	$("#grid-table").jqGrid('setGridParam',{
		page:1,postData:{
			chemcatalname:$("#chemcatalname").val(),
			alias:$("#alias").val(),
			cas:$("#cas").val(),
			un:$("#un").val()}
	}).trigger("reloadGrid");
}

/*搜索查询*/
$("#searchBtn").bind("click",function(){
	reloadGrid();
});

/*重置*/
$("#resetBtn").bind("click",function(){
	$("#chemcatalname").val("");
	$("#alias").val("");
	$("#cas").val("");
	$("#un").val("");
});

/**
 * 重大危险源选择危化品相关信息
 * @author lzqiangPC
 */
$("#submitBtn").bind("click",function(){
	var ids = $("#grid-table").jqGrid('getGridParam','selarrrow');
	if(ids.length !=1){
		// 弹出提示信息
		parent.toast("请选择一条记录！");
		return;
	}
	var rowdata = $("#grid-table").jqGrid('getRowData',ids[0]); //选中的一条记录
	var chemcatalid = rowdata.CHEMCATALID;
	var paramsJson="[";
	paramsJson+="{'chemcatalname':'"+rowdata.CHEMCATALNAME+"',";
	paramsJson+="'specifications':'"+rowdata.SPECIFICATIONS+"',";
	paramsJson+="'chemcatalid':'"+rowdata.CHEMCATALID+"',";
	paramsJson+="'dangertypename':'"+rowdata.DANGERTYPENAME+"',";
	paramsJson+="'un':'"+rowdata.UN+"',";
	paramsJson+="'id':'"+$("#id").val()+"'";
	paramsJson+="}";
	paramsJson+="]";
	if($("#frameIndex").val() == undefined || $("#frameIndex").val()==""){
		parent.frames[1].selectKnochemicaltal(paramsJson);
	}else{
		parent.frames["layui-layer-iframe"+$("#frameIndex").val()].selectKnochemicaltal(paramsJson);
	}
	parent.closeWin('dialogModal');// 关闭弹出框// 关闭弹出框
});

/*确定*/
$("#conBtn").on("click", function () {
	var ids = $("#grid-table").jqGrid('getGridParam','selarrrow');
	if(ids.length !=1){
		// 弹出提示信息
		parent.toast("请选择一条记录！");
		return;
	}
	var rowdata = $("#grid-table").jqGrid('getRowData',ids[0]); //选中的一条记录
	var chemcatalid = rowdata.CHEMCATALID;
	//parent.closeWin();//关闭当前页面
	//parent.parent.openWin(BASE_URL + '/enterprise/entdanchemical/add/'+chemcatalid, '添加');
	//危化品基础信息id
	var danexclusiveid = $("#danexclusiveid").val();
	//危化品详细信息id
	var chemicalid = $("#chemicalid").val();
	window.location = BASE_URL + "/enterprise/entdanchemical/add?chemcatalid="+chemcatalid+"&danexclusiveid="+danexclusiveid+"&chemicalid="+chemicalid;
});


function gotoMSDS(cas,un){
	parent.parent.parent.openWin(BASE_URL + "/knowledge/knomsds/chemsds?casno="+cas+"&unno="+un, '详细', "65%", "75%");
}

/*详细查询*/
function display(chemcatalid){
	parent.openWin(BASE_URL+"/knowledge/knochemicalcatal/display/"+chemcatalid,'详细','60%','75%');
}
 

