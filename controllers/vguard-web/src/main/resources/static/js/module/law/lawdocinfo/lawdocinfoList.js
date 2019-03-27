$(document).ready(function() {
		var colname = ['主键id','文书名称','文书编码','文号前缀','是否回执','最近修改时间','最近修改人'];
		var colmodel = [
			{name:'docid',index:'docid', width:'15%',hidden: true},
			{name:'docname',index:'docname',width:'10%',align:'center',sortable : false},
			{name:'doccode',index:'doccode',width:'10%',align:'left',
				formatter:function(cellvalue, options, obj) { 
					if(obj.doccode != "" && obj.doccode != null){
						return '<a href="javascript:void(0);" onclick="display(\''+obj.docid+'\')">'+obj.doccode+'</a>';
					}else{
						return "";
					}
					
					
				}
			},
			{name:'docprenum',index:'docprenum',width:'10%',align:'center',sortable : false},
			{name:'isreceipt',index:'isreceipt',width:'5%',align:'center',sortable : false,
				formatter:function(cellvalue, options, obj) { 
					if (obj.isreceipt) {
						return SelectOption.getTureFalse(obj.isreceipt);
					} else {
						return "";
					}
				}},
			{name:'updatetime',index:'updatetime',width:'10%',align:'center',
				formatter:function(cellvalue, options, obj) { 
					if (obj.updatetime) {
						return getSmpFormatDateByLong(obj.updatetime, true);
					} else {
						return "";
					}
				}
			},
			{name:'updateperson',index:'updateperson',width:'10%',align:'center',sortable : false}
		];

		var tableHeight = $(window).height() - $('.pcheck').height() - 190;
		$(window).resize(function(){
			$("#grid-table").jqGrid( 'setGridHeight', $(window).height() - $('.pcheck').height() - 190 );
			$("#grid-table").jqGrid( 'setGridWidth', $(window).width()*0.99 );
		});

	    $("#grid-table").jqGrid({
	    	height: tableHeight,
	    	url : BASE_URL + "/law/lawdocinfo/list",
			datatype: "json",
			cache : false,
			mtype : 'POST',
			colNames:colname,
			colModel:colmodel,
			postData:{
				doccode:$('#doccode').val(),
				docname:$('#docname').val()
			},
			sortname : 'ordernum',
			sortorder : "ASC",
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
			caption: "文书模板管理",
			autowidth: true
		});
});

/*加载*/
function reloadGrid(){
	$("#grid-table").jqGrid('setGridParam',{
		page:1,postData:{
			doccode:$('#doccode').val(),
			docname:$('#docname').val()
		}
	}).trigger("reloadGrid");
}

/*搜索查询*/
$("#searchbtn").bind("click",function(){
	reloadGrid();
});

/*重置*/
$("#resetbtn").bind("click",function(){
	$('#doccode').val("");
	$('#docname').val("");
});

/*添加*/
$("#addBtn").bind("click",function(){
	parent.openWin(BASE_URL+"/law/lawdocinfo/add",'添加','60%','90%');
});



//编辑
$("#editBtn").bind("click",function(){
	//返回当前grid中复选框所选择的数据的id 
	var ids = $("#grid-table").jqGrid('getGridParam','selarrrow');
	if(ids.length==0){
		// 弹出提示信息
		parent.toast("请选择一条需要编辑的数据！");
		return;
	}
	if(ids.length>1){
		// 弹出提示信息
		parent.toast("一次只能编辑一条数据，请重新选择！");
		return;
	}
	//返回指定id行的数据 
	var rowdatas = $("#grid-table").jqGrid('getRowData',ids[0]);
	var docid = rowdatas.docid;
	parent.openWin(BASE_URL+"/law/lawdocinfo/edit/"+docid,'编辑','60%','90%');	
});

/*批量删除*/
$("#delBtn").bind("click",function(){
	//返回当前grid中复选框所选择的数据的id 
	var ids = $("#grid-table").jqGrid('getGridParam','selarrrow');
	if(ids.length==0){
		// 弹出提示信息
		parent.toast("请选择需要删除的数据！");
		return;
	}

	var docids=[];
	for(var i=0;i<ids.length;i++){
		var id = ids[i]; 
		//返回指定id行的数据 
		var rowdatas = $("#grid-table").jqGrid('getRowData',id);
		docids[i]= rowdatas.docid;
	}
	var paramJson = docids.toString();
	var param = {"ids":paramJson};
	del(param);
});

/*删除方法*/
function del(param){
	//弹出提示框
	parent.confirm('确认删除吗?',function(){
		$.ajax({ 
			url: BASE_URL+"/law/lawdocinfo/delete",
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


/*详细查询*/
function display(codid){
	parent.openWin(BASE_URL+"/law/lawdocinfo/display/"+codid,'页面','50%','90%');	
}