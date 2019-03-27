$(document).ready(function() {

	 //下拉树
	SelectTree.loadSelfDistrictSelect("districtname");
	
	
	var colname = ['企业id','企业名称','行政区域','企业地址','行业类型','企业负责人','联系电话']; 
	var colmodel = [
		{name:'BUSINESSINFOID',index:'BUSINESSINFOID', width:'5%',hidden: true},
		{name:'ENTNAME',index:'ENTNAME',width:'20%',align:'left'},
		{name:'DISTRICTNAME',index:'DISTRICTNAME',width:'20%',align:'left'},
		{name:'ADDRESS',index:'ADDRESS',width:'20%',align:'left'},
		{name:'DIRECTORTYPENAME',index:'DIRECTORTYPENAME',width:'10%',align:'left'},
		{name:'LEGALPERSON',index:'LEGALPERSON',width:'10%',align:'center'},
		{name:'PHONE',index:'PHONE',width:'10%',align:'center'}
	];

	var tableHeight = $(window).height() - $('.pcheck').height() - 190;
	$(window).resize(function(){
		$("#grid-table").jqGrid( 'setGridHeight', $(window).height() - $('.pcheck').height() - 190 );
		$("#grid-table").jqGrid( 'setGridWidth', $(window).width()*0.99 );
	});
		
    $("#grid-table").jqGrid({
    	height: tableHeight,
    	url : BASE_URL + "/law/lawcheckent/entlist",
		datatype: "json",
		cache : false,
		mtype : 'post',
		colNames:colname,
		colModel:colmodel,
		postData:{
			entname:$("#entname").val(),
			districtid:$("#districtname_select").val(),
			directortypeid:$("#directortypename_select").val()
		},
		sortname : 'BUSINESSINFOID',
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
			entname:$("#entname").val(),
			districtid:$("#districtname_select").val(),
			directortypeid:$("#directortypename_select").val()
			}
	}).trigger("reloadGrid");
}

/*搜索查询*/
$("#searchbtn").bind("click",function(){
	reloadGrid();
});

/*重置*/
$("#resetbtn").bind("click",function(){
	$("#entname").val();
	$("#districtname_select").val();
	$("#directortypename_select").val();
});

/*添加*/
$("#addBtn").on("click", function () {
	//返回当前grid中复选框所选择的数据的id 
	var ids = $("#grid-table").jqGrid('getGridParam','selarrrow');
	if(ids.length==0){
		// 弹出提示信息
		parent.toast("请选择需要保存的数据！");
		return;
	}

	var bids=[];
	for(var i=0;i<ids.length;i++){
		var id = ids[i]; 
		//返回指定id行的数据 
		var rowdatas = $("#grid-table").jqGrid('getRowData',id);
		bids[i]= rowdatas.BUSINESSINFOID;
	}
	var parmJson = bids.toString();
	var planid = $("#planid").val();
	var param = {"ids":parmJson,"planid":planid};
	saveEntList(param);
});


/*删除方法*/
function saveEntList(param){
	 $.ajax({ 
		 	url: BASE_URL+"/law/lawcheckent/saveEntList",
	  		type:'post',
	  		dataType:'json',
	  		data:param,
	  		success: function(json){
	  			if(json.success==true){
	  				parent.toast(json.msg);
					var index = parent.getParentIndex();
					parent.frames["layui-layer-iframe"+index].reloadGrid();//刷新父列表（待检查企业）
					parent.getActiveIFrame().reloadGrid();//刷新父列表（执法计划）
					parent.closeWin();// 关闭弹出框
	  			}else{
	  				parent.toast(json.msg);
	  			}
	  		}
		 });
}


 

