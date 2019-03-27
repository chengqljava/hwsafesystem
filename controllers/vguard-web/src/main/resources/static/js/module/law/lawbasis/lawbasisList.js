$(document).ready(function() {
	
	SelectOption.loadLawBasisType("basistypecode");
	
	var colname = ['执法依据id','类别','违法行为描述','法律规定','处罚依据','实施标准']; 
	var colmodel = [
		{name:'basisid',index:'basisid', width:'5%',hidden: true},
		{name:'basistypecode',index:'basistypecode',width:'10%',align:'left',
			formatter:function(cellvalue, options, obj) { 
				return obj.basistypename;
			}
		},
		{name:'behavior',index:'behavior',width:'30%',align:'left',
			formatter:function(cellvalue, options, obj) { 
				return '<a href="javascript:void(0);" onclick="display(\''+obj.basisid+'\')">'+cellvalue+'</a>';
			}
		},
		{name:'lawrule',index:'lawrule',width:'20%',align:'center'},
		{name:'punish',index:'punish',width:'20%',align:'center'},
		{name:'standard',index:'standard',width:'20%',align:'center'}
	];

	var tableHeight = $(window).height() - $('.pcheck').height() - 190 - 33;
	$(window).resize(function(){
		$("#grid-table").jqGrid( 'setGridHeight', $(window).height() - $('.pcheck').height() - 190 - 33);
		$("#grid-table").jqGrid( 'setGridWidth', $(window).width()*0.99 );
	});
		
    $("#grid-table").jqGrid({
    	height: tableHeight,
    	url : BASE_URL + "/law/lawbasis/list",
		datatype: "json",
		cache : false,
		mtype : 'post',
		colNames:colname,
		colModel:colmodel,
		postData:{
			basistypecode:$("#basistypecode").val(),
			behavior : $( '#behavior' ).val()
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
		caption: "执法依据",
		autowidth: true,
		loadComplete: function() {
			if($(window).width() < 700) {
				$('.ui-jqgrid-htable').css({"width":"900"});
				$("#grid-table").css({"width":"900"});
				$("#grid-table").closest(".ui-jqgrid-bdiv").css({ "overflow-x" : "scroll","height":"350"});
				$(".ui-jqgrid-hdiv").css({ "overflow-x" : "scroll"});
				$(".table-line .tableTitle").find("button").css({"margin-right":"0px","margin-top":"7px"});
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
			basistypecode:$("#basistypecode").val(),
			behavior : $( '#behavior' ).val()
			}
	}).trigger("reloadGrid");
}

/*搜索查询*/
$("#searchbtn").bind("click",function(){
	reloadGrid();
});

/*重置*/
$("#resetbtn").bind("click",function(){
	$("#basistypecode").val();
	$("#behavior").val();
});

/*添加*/
$("#addBtn").on("click", function () {
	parent.openWin(BASE_URL+"/law/lawbasis/add",'添加','70%','80%');
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
	var basisid = rowdata.basisid;
	parent.openWin(BASE_URL+'/law/lawbasis/edit/'+basisid,'编辑','70%','80%');
});
/**
 *excel导入 
 */
$("#importBtn").on("click",function(){
    parent.openWin(BASE_URL+'/law/lawbasis/importExcel','excel导入','70%','80%');
});

/*详细查询*/
function display(basisid){
	parent.openWin(BASE_URL+"/law/lawbasis/display/"+basisid,'详细','70%','80%');
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

	var basisids=[];
	for(var i=0;i<ids.length;i++){
		var id = ids[i]; 
		//返回指定id行的数据 
		var rowdatas = $("#grid-table").jqGrid('getRowData',id);
		basisids[i]= rowdatas.basisid;
	}
	var parmJson = basisids.toString();
	var param = {"ids":parmJson};
	del(param);
});


/*删除方法*/
function del(param){
		//弹出提示框
		parent.confirm("确认删除吗?", function() { 
			 $.ajax({ 
				 	url: BASE_URL+"/law/lawbasis/delete",
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


 

