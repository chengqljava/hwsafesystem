$(document).ready(function() {
	//加载机构树
	loadOrgTree("orgtree");
	
	var colname = ['成员单位id','成员单位名称','成员单位编码','负责人','移动电话'];
	var colmodel = [
		{name:'ORGID',index:'ORGID', width:'5%',align:'center',sortable:false,hidden: true},
		{name:'ORGNAME',index:'ORGNAME',width:'30%',sortable:false,align:'left',
			formatter:function(cellvalue, options, obj) { 
				   return '<a href="javascript:void(0);" onclick="display(\''+obj.ORGID+'\')">'+obj.ORGNAME+'</a>';
			}
		},
		{name:'ORGCODE',index:'ORGCODE',width:'20%',sortable:false,align:'left'},
		{name:'PRINCIPAL',index:'PRINCIPAL',width:'10%',sortable:false,align:'left'},
		{name:'PRINCIPALMTEL',index:'PRINCIPALMTEL',width:'10%',sortable:false,align:'left'},
	];

	var tableHeight = $(window).height() - $('.pcheck').height() - 190;
	$(window).resize(function(){
		$("#grid-table").jqGrid( 'setGridHeight', $(window).height() - $('.pcheck').height() - 190 );
		$("#grid-table").jqGrid( 'setGridWidth', $(window).width()*0.99 );
	});
	
    $("#grid-table").jqGrid({
    	height: tableHeight,
    	url : BASE_URL+"/system/sysorg/memberlist",
		datatype: "json",
		cache : false,
		mtype : 'post',
		colNames:colname,
		colModel:colmodel,
		postData:{
			orgname:$('#orgname').val(),
			parentmember:$('#parentmember').val()
		},
		sortname : 'UPDATETIME',
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
		caption: "行业部门",
		autowidth: true
	});
});

/*加载*/
function reloadGrid(){
	$("#grid-table").jqGrid('setGridParam',{
		page:1,postData:{
				orgname:$('#orgname').val(),
				parentmember:$('#parentmember').val()
			}
	}).trigger("reloadGrid");
}

/*搜索查询*/
$("#searchBtn").bind("click",function(){
	reloadGrid();
});

/*重置*/
$("#resetBtn").bind("click",function(){
	$("#orgid").val("");
	$("#orgname").val("");
});

/*编辑*/
$("#editBtn").bind("click",function(){
	//返回当前grid中复选框所选择的数据的id 
	var ids = $("#grid-table").jqGrid('getGridParam','selarrrow');
	if(ids.length!=1){
		// 弹出提示信息
		parent.toast("请选择一条数据进行编辑！");
		return;
	}
	//返回指定id行的数据 
	var rowdatas = $("#grid-table").jqGrid('getRowData',ids[0]);
	var orgid = rowdatas.ORGID;
	
	parent.openWin(BASE_URL+'/system/sysorg/editmember/'+orgid,'编辑',"55%","60%");
});

/*添加*/
$("#addBtn").bind("click",function(){
	if($("#parentmember").val()){
		parent.openWin(BASE_URL+'/system/sysorg/addmember/'+$("#parentmember").val()+"/"+$("#membername").val(),'添加',"55%","60%");
	}else{
		parent.toast("请选择左侧部门！");
	}
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

	var orgids=[];
	for(var i=0;i<ids.length;i++){
		var id = ids[i]; 
		//返回指定id行的数据 
		var rowdatas = $("#grid-table").jqGrid('getRowData',id);
		orgids[i]= rowdatas.ORGID;
	}
	var paramJson = orgids.toString();
	var param = {"ids":paramJson};
	del(param);
});

/*删除方法*/
function del(param){
    //查询是否有关联引用
	$.ajax({ 
  		url: BASE_URL+"/system/sysorg/loadLinkById",
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
				  		url: BASE_URL+"/system/sysorg/delete",
				  		type:'post',
				  		dataType:'json',
				  		data:param,
				  		success: function(json){
				  			if(json.success==true){
				  				parent.toast(json.msg);
				  				reloadGrid();//刷新列表
				  				loadOrgTree();//刷新树
				  			}
				  		}
					 });
  				})
  			}
  	   }
   });
}

/*详细查询*/
function display(orgid){
	parent.openWin(BASE_URL+'/system/sysorg/memberdisplay/'+orgid,'详细',"55%","60%");
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
		url : BASE_URL+'/system/sysorg/isMemberTree',
		cache : false,
		data:{ismember:'0'}, //0表示非安委会成员单位树
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
			t_map.push(new Node("-1","","组织机构",true,BASE_URL+"/images/tree/org.png"));//根节点
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
	var orgname = treeNode.name;
	$("#parentmember").val(orgid);
	$("#membername").val(orgname);
	$("#orgname").val("");//机构名称清空
	reloadGrid();
}