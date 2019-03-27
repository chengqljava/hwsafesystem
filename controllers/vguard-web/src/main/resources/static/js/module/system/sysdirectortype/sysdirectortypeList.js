$(document).ready(function() {
	//加载行政区域树
	loadDirectortypeTree();
	
	var colname = ['行业主管分类id','行业主管分类名称','行业主管分类编码','行业类型','三小类型']; 
	var colmodel = [
		{name:'DIRECTORTYPEID',index:'DIRECTORTYPEID', width:'5%',hidden: true},
		{name:'DIRECTORTYPENAME',index:'DIRECTORTYPENAME',width:'30%',align:'left',
			formatter:function(cellvalue, options, obj) { 
				   return '<a href="javascript:void(0);" onclick="display(\''+obj.DIRECTORTYPEID+'\')">'+obj.DIRECTORTYPENAME+'</a>';
			}
		},
		{name:'DIRECTORTYPECODE',index:'DIRECTORTYPECODE',width:'20%',align:'center'},
		{name:'INDUSTRYTYPE',index:'INDUSTRYTYPE',width:'10%',align:'center',
			formatter:function(cellvalue, options, obj) { 
				   return SelectOption.getIndustryType(obj.INDUSTRYTYPE);
			}
		},
		{name:'THREETYPE',index:'THREETYPE',width:'10%',align:'center',
			formatter:function(cellvalue, options, obj) { 
				   return SelectOption.getThreeType(obj.THREETYPE);
			}
		}
	];

	var tableHeight = $(window).height() - $('.pcheck').height() - 190;
	$(window).resize(function(){
		$("#grid-table").jqGrid( 'setGridHeight', $(window).height() - $('.pcheck').height() - 190 );
		$("#grid-table").jqGrid( 'setGridWidth', $(window).width()*0.86 );
	});

    $("#grid-table").jqGrid({
    	height: tableHeight,
    	url : BASE_URL + "/system/sysdirectortype/list",
		datatype: "json",
		cache : false,
		mtype : 'post',
		colNames:colname,
		colModel:colmodel,
		postData:{
			parentid:$("#parentid").val(),
			directortypename:$("#directortypename").val()
		},
		sortname : 'DIRECTORTYPECODE',
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
		caption: "行业主管分类",
		autowidth: true
	});
});

/*加载*/
function reloadGrid(){
	$("#grid-table").jqGrid('setGridParam',{
		page:1,postData:{directortypename:$('#directortypename').val(),parentid:$('#parentid').val()}
	}).trigger("reloadGrid");
}

/*搜索查询*/
$("#searchBtn").bind("click",function(){
	reloadGrid();
});

/*重置*/
$("#resetBtn").bind("click",function(){
	$("#parentid").val("");
	$("#directortypename").val("");
});

/*添加*/
$("#addBtn").on("click", function () {
	parent.openWin(BASE_URL+"/system/sysdirectortype/add",'添加','60%','50%');
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
	var directortypeid = rowdata.DIRECTORTYPEID;
	
	parent.openWin(BASE_URL+'/system/sysdirectortype/edit/'+directortypeid,'编辑','60%','45%');
});

/*详细查询*/
function display(directortypeid){
	parent.openWin(BASE_URL+"/system/sysdirectortype/display/"+directortypeid,'详细','60%','45%');
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

	var directortypeids=[];
	for(var i=0;i<ids.length;i++){
		var id = ids[i]; 
		//返回指定id行的数据 
		var rowdatas = $("#grid-table").jqGrid('getRowData',id);
		directortypeids[i]= rowdatas.DIRECTORTYPEID;
	}
	var parmJson = directortypeids.toString();
	var param = {"ids":parmJson};
	del(param);
});

/*删除方法*/
function del(param){
	$.ajax({ 
	  		url: BASE_URL+"/system/sysdirectortype/loadLinkById",
	  		type:'post',
	  		dataType:'json',
	  		data:param,
	  		success: function(json){
	  			if(json.success==false){
	  				//有父引用
	  				parent.toast(json.msg);
	  			}else{
	  			    //弹出提示框
	  				parent.confirm('确认删除吗?',function(){
	  					$.ajax({ 
	  				  		url: BASE_URL+"/system/sysdirectortype/delete",
	  				  		type:'post',
	  				  		dataType:'json',
	  				  		data:param,
	  				  		success: function(json){
	  				  			if(json.success==true){
	  				  				parent.toast(json.msg);
	  				  				reloadGrid();//刷新列表
	  				  			    loadDirectortypeTree();//刷新树
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

 


/**行业主管分类树*/
function loadDirectortypeTree(){
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
		url : BASE_URL+'/system/sysdirectortype/directortypetree',
		cache : false,
		dataType : 'json',
		global : false,
		async : false,
		success : function(map) {
			var tree_map = initTreeMap(map);
			$.fn.zTree.init($("#directortypetree"), setting, tree_map);
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
				if(map[i].id == -1){
					//根节点
					icon = BASE_URL+"/images/tree/d_icon_tree1.png";
					//var directortypeid = map[i].id;
					open = true;
				}else if(map[i].pId == -1){
					//根节点
					icon = BASE_URL+"/images/tree/d_icon_tree2.png";
					//var directortypeid = map[i].id;
					open = false;
				}else{
					icon= BASE_URL+"/images/tree/d_icon_tree3.png";
					//var directortypeid = map[i].id;
					open = false;
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
	var treeObj = $.fn.zTree.getZTreeObj("directortypetree");
	treeObj.checkNode(treeNode, true, true);

	var parentid = treeNode.id;
	$("#parentid").val(parentid);
	$("#directortypename").val("");
	reloadGrid();
}


/**勾选树节点*/
function treeCheck(event, treeId, treeNode, clickFlag){
	treeClick(event, treeId, treeNode, clickFlag);
}

