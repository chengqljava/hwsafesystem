$(document).ready(function() {
	//加载权限树
	loadPrivTree("privtree");
	
	var colname = ['权限id','权限名称','权限编码','权限链接','权限级别','用户类型','排序']; 
	var colmodel = [
		{name:'PRIVID',index:'PRIVID', width:'5%',hidden: true},
		{name:'PRIVNAME',index:'PRIVNAME',width:'30%',align:'left',
			formatter:function(cellvalue, options, obj) { 
				   return '<a href="javascript:void(0);" onclick="display(\''+obj.PRIVID+'\')">'+obj.PRIVNAME+'</a>';
			}
		},
		{name:'PRIVCODE',index:'PRIVCODE',width:'20%',align:'left'},
		{name:'PRIVURL',index:'PRIVURL',width:'30%',align:'left'},
		{name:'PRIVLEVEL',index:'PRIVLEVEL',width:'15%',align:'left',editoptions : {value : "1:一级菜单;2:二级菜单;3:三级菜单"},formatter:'select'},
		{name:'USERTYPE',index:'USERTYPE',width:'10%',align:'left',
			formatter:function(cellvalue, options, obj) { 
				  if(obj.USERTYPE){
					  return SelectOption.getUserType(obj.USERTYPE);
				  }else{
					  return "";
				  }
			}
		},
		{name:'ORDERNUM',index:'ordernum',width:'10%',align:'left'}
	];

	var tableHeight = $(window).height() - $('.pcheck').height() - 190;
	$(window).resize(function(){
		$("#grid-table").jqGrid( 'setGridHeight', $(window).height() - $('.pcheck').height() - 190 );
		$("#grid-table").jqGrid( 'setGridWidth', $(window).width()*0.86 );
	});

    $("#grid-table").jqGrid({
    	height: tableHeight,
    	url : BASE_URL + "/system/syspriv/list",
		datatype: "json",
		cache : false,
		mtype : 'POST',
		colNames:colname,
		colModel:colmodel,
		postData:{
			privid:$("#privid").val(),
			privname:$("#privname").val()
		},
		sortname : 'ORDERNUM',
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
		caption: "权限管理",
		autowidth: true,
		gridComplete: function() {
			$("#gbox_grid-table").css("width","100%");
		    $("#gview_grid-table").css("width","100%");
		}
	});
    
    $(window).resize(function() {
    	$("#gbox_grid-table").css("width","100%");
    	$("#gview_grid-table").css("width","100%");
    })
    
});

/*加载*/
function reloadGrid(privid,privname){
	$("#grid-table").jqGrid('setGridParam',{
		page:1,postData:{privid:privid,
			             privname:privname
			             }
	}).trigger("reloadGrid");
}

/*搜索查询*/
$("#searchBtn").bind("click",function(){
	var privid = $("#privid").val();
	var privname = $("#privname").val();
	reloadGrid(privid,privname);
});

/*重置*/
$("#resetBtn").bind("click",function(){
	$("#privid").val("");
	$("#privname").val("");
});

/*添加*/
$("#addBtn").on("click", function () {
	var privid = $("#privid").val();
	var usertype = $("#usertype").val();
	var privlevel = $("#privlevel").val();
	
	if(privid =="" || privid == null){
		parent.toast("请选择左侧树节点！");
		return;
	}
	
	var windowHeight ="";
	if(privlevel==2){//上级菜单是二级菜单
		windowHeight = '75%';
	}else{
		windowHeight = '45%';
	}
	
	parent.openWin(BASE_URL+"/system/syspriv/add/"+usertype+"/"+privlevel,'添加','60%',windowHeight);
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
	var privid = rowdata.PRIVID;
	parent.openWin(BASE_URL+'/system/syspriv/edit/'+privid,'编辑','60%','45%');
});

/*业务操作*/
$("#boperBtn").on("click", function () {
	var ids = $("#grid-table").jqGrid('getGridParam','selarrrow');
	if(ids.length !=1){
		// 弹出提示信息
		parent.toast("请选择一条记录！");
		return;
	}
	
	//选中的一条记录
	var rowdata = $("#grid-table").jqGrid('getRowData',ids[0]);
	var privid = rowdata.PRIVID; //权限id
	var privlevel = rowdata.PRIVLEVEL; //菜单权限级别
	if(privlevel ==1){
		//一级菜单
		parent.toast("一级菜单不允许进行业务操作！");
		return;
	}else if(privlevel ==2){
		//二级菜单
		parent.toast("二级菜单不允许进行业务操作！");
		return;
	}else if(privlevel ==3){
		//三级菜单
		parent.openWin(BASE_URL+'/system/sysoper/'+privid,'业务操作','60%','60%');
	}
});

/*详细查询*/
function display(privid){
	parent.openWin(BASE_URL+"/system/syspriv/display/"+privid,'详细','60%','45%');
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

	var privids=[];
	for(var i=0;i<ids.length;i++){
		var id = ids[i]; 
		//返回指定id行的数据 
		var rowdatas = $("#grid-table").jqGrid('getRowData',id);
		privids[i]= rowdatas.PRIVID;
	}
	var parmJson = privids.toString();
	var param = {"ids":parmJson};
	del(param);
});

/*删除方法*/
function del(param){
	//查询是否有关联引用(角色权限、父权限关联)	
	$.ajax({ 
	  		url: BASE_URL+"/system/syspriv/loadLinkById",
	  		type:'post',
	  		dataType:'json',
	  		data:param,
	  		success: function(json){
	  			if(json.success==false){
	  				//有关联引用
	  				parent.toast(json.msg);
	  			}else{
	  				//弹出提示框
	  				parent.confirm('确认删除吗?',function(){
	  					 $.ajax({ 
		  				  		url: BASE_URL+"/system/syspriv/delete",
		  				  		type:'post',
		  				  		dataType:'json',
		  				  		data:param,
		  				  		success: function(json){
		  				  			if(json.success==true){
		  				  				parent.toast(json.msg);
		  				  				reloadGrid("","");//刷新列表
		  				  				loadPrivTree();//刷新树
		  				  			}else{
		  				  				parent.toast(json.msg);
		  				  			}
		  				  		}
		  					 });
	  				})
	  		  }
		  }
	});
}

/**权限树*/
function loadPrivTree(){
	var setting = {
		data : {
			simpleData : {
				enable : true
			}
		},
		callback: {
			onClick: treeClick,
			onCheck: treeCheck
		},
		check: {
		        enable: true,
		        chkStyle: "radio",
		        radioType: "all"
		}
	};	
	
	$.ajax({
		type :'post',
		url : BASE_URL+'/system/syspriv/privtree',
		cache : false,
  		data: {'usertype':''},
		dataType : 'json',
		global : false,
		async : false,
		success : function(map) {
			var tree_map = initTreeMap(map);
			$.fn.zTree.init($("#privtree"), setting, tree_map);
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
			for ( var i = 0; i < map.length; i++) {
				var icon = "";
				var privid = map[i].id;
				var usertype= map[i].usertype;
				var privlevel= map[i].privlevel;
				if(map[i].pId ==  -1 && map[i].privlevel==0){
					//(系统、企业、政府根节点)
					icon = BASE_URL+"/images/tree/d_icon_tree1.png";
					open = true;
				}else if(map[i].privlevel == 1){
					//父节点
					icon= BASE_URL+"/images/tree/d_icon_tree2.png";
					open = false;
				}else{
					//子菜单
					icon= BASE_URL+"/images/tree/d_icon_tree3.png";
					open = false;
				}			
				t_map.push(new Node(map[i].id, map[i].pId, map[i].name,
						open,icon,usertype,privlevel));
			}
		} else {
			t_map = null;
		}
		return t_map;
	}
	
	//树节点对象
	function Node(id, pId, name, open, icon,usertype,privlevel) {
		this.id = id;
		this.pId = pId;
		this.name = name;
		this.open = open;
		this.icon = icon;
		this.usertype =usertype;
		this.privlevel = privlevel;
	}
}

/**点击权限树节点*/
function treeClick(event, treeId, treeNode, clickFlag){
	var treeObj = $.fn.zTree.getZTreeObj("privtree");
	treeObj.checkNode(treeNode, true, true);
	
	var privid = treeNode.id;
	var usertype = treeNode.usertype;
	var privlevel = treeNode.privlevel;
	
	$("#privid").val(privid); //权限id
	$("#usertype").val(usertype); //授权人类型(用户类型)
	$("#privlevel").val(privlevel); //权限级别
	
	$("#privname").val("");//权限名称至空
	reloadGrid(privid,$("#privname").val());
}

/**勾选权限树节点*/
function treeCheck(event, treeId, treeNode, clickFlag){
	treeClick(event, treeId, treeNode, clickFlag);
}


