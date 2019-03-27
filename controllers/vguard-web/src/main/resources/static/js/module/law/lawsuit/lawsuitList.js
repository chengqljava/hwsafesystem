$(document).ready(function() {
	
	var colname = ['诉讼诉讼id','单位名称','案件名称','诉讼主持人','申请人','申请时间','审批状态']; 
	var colmodel = [
		{name:'lawsuitid',index:'lawsuitid', width:'5%',hidden: true},
		{name:'entname',index:'entname',width:'30%',align:'left',
			formatter:function(cellvalue, options, obj) { 
				return '<a href="javascript:void(0);" onclick="display(\''
				+ obj.lawsuitid
				+ '\')">'
				+ obj.entname + '</a>';
			}
		},
		{name:'casename',index:'casename',width:'20%',align:'left'},
		{name:'emceeadv',index:'emceeadv',width:'10%',align:'center'},
		{name:'apply',index:'apply',width:'10%',align:'center'},
		{name:'applytime',index:'applytime',width:'10%',align:'center',
			formatter:function(cellvalue, options, obj) { 
				return getSmpFormatDateByLong(cellvalue,false);
			}
		},
		{name:'auditstatus',index:'auditstatus',width:'10%',align:'center',
			formatter:function(cellvalue, options, obj) { 
				return SelectOption.getLawSuitStatus(cellvalue);
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
    	url : BASE_URL + "/law/lawsuit/list",
		datatype: "json",
		cache : false,
		mtype : 'post',
		colNames:colname,
		colModel:colmodel,
		postData:{
			entname:$("#entname").val(),
			districtid:$("#districtid").val()
		},
		sortname : 'updatetime',
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
		caption: "行政诉讼",
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

/*加载行政区域*/
function searchDistrict(districtid){
	$("#districtid").val(districtid);
	reloadGrid();
}

/*加载*/
function reloadGrid(){
	$("#grid-table").jqGrid('setGridParam',{
		page:1,postData:{
			entname:$("#entname").val(),
			districtid:$("#districtid").val()
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
});

/*添加*/
$("#addBtn").on("click", function () {
	parent.openWin(BASE_URL+"/law/lawsuit/add",'添加','70%','80%');
});

/*编辑*/
$("#editBtn").on("click", function () {
	var ids = $("#grid-table").jqGrid('getGridParam','selarrrow');
	if(ids.length !=1){
		// 弹出提示信息
		parent.toast("请选择一条记录！");
		return;
	}
	var rowdata = $("#grid-table").jqGrid('getRowData',ids[0]); //选中的一条记录
	var lawsuitid = rowdata.lawsuitid;
	parent.openWin(BASE_URL+'/law/lawsuit/edit/'+lawsuitid,'编辑','70%','80%');
});

/*详细查询*/
function display(lawsuitid){
	parent.openWin(BASE_URL+"/law/lawsuit/display/"+lawsuitid,'详细','70%','80%');
}


/*批量删除*/
$("#delBtn").on("click", function () {
	//返回当前grid中复选框所选择的数据的id 
	var ids = $("#grid-table").jqGrid('getGridParam','selarrrow');
	if(ids.length==0){
		// 弹出提示信息
		parent.toast("请选择需要删除的数据！");
		return;
	}

	var lawsuitids=[];
	for(var i=0;i<ids.length;i++){
		var id = ids[i]; 
		//返回指定id行的数据 
		var rowdatas = $("#grid-table").jqGrid('getRowData',id);
		lawsuitids[i]= rowdatas.lawsuitid;
	}
	var parmJson = lawsuitids.toString();
	var param = {"ids":parmJson};
	del(param);
});


/*删除方法*/
function del(param){
		//弹出提示框
		parent.confirm("确认删除吗?", function() { 
			 $.ajax({ 
				 	url: BASE_URL+"/law/lawsuit/delete",
			  		type:'post',
			  		dataType:'json',
			  		data:param,
			  		success: function(json){
			  			if(json.success==true){
			  				parent.toast(json.msg);
			  				reloadGrid();//刷新列表
			  			}else{
			  				parent.toast(json.msg);
			  			}
			  		}
				 });
	    });
}


 

