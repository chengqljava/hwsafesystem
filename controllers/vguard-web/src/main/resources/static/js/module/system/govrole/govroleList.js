$(document).ready(function() {
	//加载机构树
	loadOrgTree("orgtree");
	
		var colname = ['角色id','角色名','角色类型','所属机构','更新时间','更新人'];
		var colmodel = [
			{name:'ROLEID',index:'ROLEID', width:'10%',hidden: true},
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
			{name:'ORGNAME',index:'ORGNAME',width:'20%',sortable:false,align:'center'},
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
			$("#grid-table").jqGrid( 'setGridWidth', $(window).width()*0.86 );
		});

	    $("#grid-table").jqGrid({
	    	height: tableHeight,
	    	url : BASE_URL + "/system/govrole/list",
			datatype: "json",
			cache : false,
			mtype : 'POST',
			colNames:colname,
			colModel:colmodel,
			postData:{
				rolename:$('#rolename').val(),
				orgid:$('#orgid').val()
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
		page:1,postData:{rolename:$('#rolename').val(),orgid:$("#orgid").val()}
	}).trigger("reloadGrid");
}

/*搜索查询*/
$("#searchBtn").bind("click",function(){
	reloadGrid();
});

/*重置*/
$("#resetBtn").bind("click",function(){
	$("#rolename").val('');
});

/*添加*/
$("#addBtn").bind("click",function(){
	parent.openWin(BASE_URL+"/system/govrole/add",'添加','60%','40%');	
});

/*添加公共角色*/
$("#addPubBtn").bind("click",function(){
	parent.openWin(BASE_URL+"/system/govrole/addpublic",'添加','60%','40%');	
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
	parent.openWin(BASE_URL+"/system/govrole/edit/"+roleid,'编辑','60%','45%');		
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
	
	parent.openWin(BASE_URL+"/system/govrole/rolePriv/"+roleid,'权限分配','60%','50%');	
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
	  		url: BASE_URL+"/system/govrole/loadLinkById",
	  		type:'post',
	  		dataType:'json',
	  		data:param,
	  		success: function(json){
	  			if(json.success==false){
	  				//有关联引用
	  				parent.toast(json.msg);
	  			}else{
	  				//弹出提示框
	  				parent.confirm("确认删除吗?", function() { 
	  					 $.ajax({ 
	  						 	url: BASE_URL+"/system/govrole/delete",
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
	parent.openWin(BASE_URL+"/system/govrole/display/"+roleid,'详细','60%','45%');
}


/**机构树*/
function loadOrgTree(){
	var setting = {
		data : {
			simpleData : {
				enable : true
			}
		},
		callback: {
			onClick: treeClick
		}
	};	
	
	$.ajax({
		type :'post',
		url : BASE_URL+'/system/sysorg/orgtreeByOrgid',
		data : {"orgid" : $("#orgid").val()},
		cache : false,
		dataType : 'json',
		global : false,
		async : false,
		success : function(map) {
			var tree_map = initTreeMap(map);
			$.fn.zTree.init($("#orgtree"), setting, tree_map);
		},
		error : function() {
			console.log("网络异常");
		}
	});
	
	//树图标的初始化
	function initTreeMap(map) {
		var t_map = new Array();
		//遍历子节点
		if (map != null && map.length > 0) {
			var open = false;
			//t_map.push(new Node("-1","","组织机构",true,BASE_URL+"/images/tree/org.png"));//根节点
			for ( var i = 0; i < map.length; i++) {
				var icon = "";
				if(map[i].id != -1 ){
					icon = BASE_URL+"/images/tree/d_icon_tree1.png";
					var orgid = map[i].id;
					open = true;
				}	
				t_map.push(new Node(map[i].id, map[i].pId, map[i].name,
						open,icon));
			}
		} else {
			t_map = null;
		}
		return t_map;
	}
	
	//树节点对象
	function Node(id, pId, name, open, icon) {
		this.id = id;
		this.pId = pId;
		this.name = name;
		this.open = open;
		this.icon = icon;
	}
}


/**点击权限树节点*/
function treeClick(event, treeId, treeNode, clickFlag){
	var orgid = treeNode.id;
	if(orgid=='-1'){
		orgid = '';
	}
	$("#orgid").val(orgid);
	reloadGrid();
}