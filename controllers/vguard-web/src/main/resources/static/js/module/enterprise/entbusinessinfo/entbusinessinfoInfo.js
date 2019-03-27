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
		$("#grid-table").jqGrid( 'setGridHeight', $(window).height() - $('.pcheck').height() - 190 );
		$("#grid-table").jqGrid( 'setGridWidth', $(window).width()*0.99 );
    })

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
	var businessinfoid = rowdata.BUSINESSINFOID;
	window.location = BASE_URL + "/hiddendanger/hdigovinspection/addentinfo?businessinfoid="+businessinfoid;
});

/**
 * 返回
 */
$("#resBtn").on("click", function () {
	if($("#inspectionid").val()){
		window.location = BASE_URL + '/hiddendanger/hdigovinspection/edit/'+$("#inspectionid").val(),'编辑','65%','80%';
	}else{
		window.location = BASE_URL + "/hiddendanger/hdigovinspection/add",'添加','65%','80%';
	}
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



