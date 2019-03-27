$(document).ready(function() {
		var colname = ['角色id','角色名','角色类型','更新时间','更新人'];
		var colmodel = [
			{name:'ROLEID',index:'ROLEID', width:'15%',hidden: true},
			{name:'ROLENAME',index:'ROLENAME',width:'20%',align:'left',
				formatter:function(cellvalue, options, obj) { 
					   return '<a href="javascript:void(0);" onclick="display(\''+obj.ROLEID+'\')">'+obj.ROLENAME+'</a>';
				}
			},
			{name:'USERTYPE',index:'USERTYPE',width:'10%',align:'center',
				formatter:function(cellvalue, options, obj) { 
					   return SelectOption.getUserType(obj.USERTYPE);
				}
			},
			{name:'UPDATETIME',index:'UPDATETIME',width:'10%',align:'center',
				formatter:function(cellvalue, options, obj) { 
					if (obj.UPDATETIME) {
						return getSmpFormatDateByLong(obj.UPDATETIME, true);
					} else {
						return "";
					}
				}
			},
			{name:'UPDATEPER',index:'UPDATEPER',width:'10%',align:'center'}
		];

		var tableHeight = $(window).height() - $('.pcheck').height() - 190;
		$(window).resize(function(){
			$("#grid-table").jqGrid( 'setGridHeight', $(window).height() - $('.pcheck').height() - 190 );
			$("#grid-table").jqGrid( 'setGridWidth', $(window).width()*0.99 );
		});

	    $("#grid-table").jqGrid({
	    	height: tableHeight,
	    	url : BASE_URL + "/system/sysrole/list",
			datatype: "json",
			cache : false,
			mtype : 'POST',
			colNames:colname,
			colModel:colmodel,
			postData:{
				rolename:$('#rolename').val()
			},
			sortname : 'ROLEID',
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
			caption: "角色管理",
			autowidth: true
		});
});

/*加载*/
function reloadGrid(){
	$("#grid-table").jqGrid('setGridParam',{
		page:1,postData:{rolename:$('#rolename').val()}
	}).trigger("reloadGrid");
}

/*搜索查询*/
$("#searchBtn").bind("click",function(){
	reloadGrid();
});

/*重置*/
$("#resetBtn").bind("click",function(){
	$("#rolename").val("");
});

/*添加*/
$("#addBtn").bind("click",function(){
	parent.openWin(BASE_URL+"/system/sysrole/add",'添加','60%','40%');
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
	var roleid = rowdatas.ROLEID;
	parent.openWin(BASE_URL+"/system/sysrole/edit/"+roleid,'编辑','60%','40%');	
});

//授权
$("#roleBtn").bind("click",function(){
	//返回当前grid中复选框所选择的数据的id 
	var ids = $("#grid-table").jqGrid('getGridParam','selarrrow');
	if(ids.length==0){
		// 弹出提示信息
		parent.toast("请选择需要授权的数据！");
		return;
	}
	if(ids.length>1){
		// 弹出提示信息
		parent.toast("一次只能给一个角色授权，请重新选择！");
		return;
	}
	//返回指定id行的数据 
	var rowdatas = $("#grid-table").jqGrid('getRowData',ids[0]);
	var roleid = rowdatas.ROLEID;
/*
	var roleids=[];
	for(var i=0;i<ids.length;i++){
		var id = ids[i]; 
		//返回指定id行的数据 
		var rowdatas = $("#grid-table").jqGrid('getRowData',id);
		roleids[i]= rowdatas.ROLEID;
	}
	var paramJson = roleids.toString();
	var param = {"ids":paramJson};
	*/
	parent.openWin(BASE_URL+"/system/sysrole/rolePriv/"+roleid,'权限分配','60%','50%');	
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

	var roleids=[];
	for(var i=0;i<ids.length;i++){
		var id = ids[i]; 
		//返回指定id行的数据 
		var rowdatas = $("#grid-table").jqGrid('getRowData',id);
		roleids[i]= rowdatas.ROLEID;
	}
	var paramJson = roleids.toString();
	var param = {"ids":paramJson};
	del(param);
});

/*删除方法*/
function del(param){
	//查询是否有关联引用(角色权限、父权限关联)	
	$.ajax({ 
	  		url: BASE_URL+"/system/sysrole/loadLinkById",
	  		type:'post',
	  		dataType:'json',
	  		data:param,
	  		success: function(json){
	  			if(json.success==false){
	  				//有关联引用
	  				parent.toast(json.msg);
	  			}else{
	  				parent.confirm("确认删除吗?", function() { 
	  					 $.ajax({ 
	  						 	url: BASE_URL+"/system/sysrole/delete",
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
		  }
	});
}


/*详细查询*/
function display(roleid){
	parent.openWin(BASE_URL+"/system/sysrole/display/"+roleid,'详细','60%','40%');	
}