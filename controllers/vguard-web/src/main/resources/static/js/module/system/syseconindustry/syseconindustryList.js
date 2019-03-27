$(document).ready(function() {
	//加载国民经济行业分类
	loadEconindustryTree();
	
	var colname = ['国民经济行业分类id','编码','类型']; 
	var colmodel = [
		{name:'ECONINDUSTRYID',index:'ECONINDUSTRYID', width:'5%',hidden: true},
		{name:'CODE',index:'CODE',width:'30%',align:'left'},
		{name:'TYPE',index:'TYPE',width:'70%',align:'left',
			formatter:function(cellvalue, options, obj) { 
				   return '<a href="javascript:void(0);" onclick="display(\''+obj.ECONINDUSTRYID+'\')">'+obj.TYPE+'</a>';
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
    	url : BASE_URL + "/system/syseconindustry/list",
		datatype: "json",
		cache : false,
		mtype : 'post',
		colNames:colname,
		colModel:colmodel,
		postData:{
			econindustryid:$("#econindustryid").val(),
			code:$("#code").val(),
			type:$("#type").val()
		},
		sortname : 'code',
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
		caption: "国民经济行业",
		autowidth: true,
		loadComplete : function() {
			$("#grid-table").setGridWidth($(window).width()*0.99);
		} 
	});
});

/*加载*/
function reloadGrid(){
	$("#grid-table").jqGrid('setGridParam',{
		page:1,postData:{
				econindustryid:$("#econindustryid").val(),
				code:$("#code").val(),
				name:$("#name").val()
			             }
	}).trigger("reloadGrid");
}

/*搜索查询*/
$("#searchBtn").bind("click",function(){
	reloadGrid();
});

/*重置*/
$("#resetBtn").bind("click",function(){
	$("#econindustryid").val("-1");
	$("#code").val("");
	$("#type").val("");
});

/*添加*/
$("#addBtn").on("click", function () {
	parent.openWin(BASE_URL+"/system/syseconindustry/add",'添加','25%','45%');
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
	var econindustryid = rowdata.ECONINDUSTRYID;
	
	parent.openWin(BASE_URL+'/system/syseconindustry/edit/'+econindustryid,'编辑','25%','45%');
});

/*详细查询*/
function display(econindustryid){
	parent.openWin(BASE_URL+"/system/syseconindustry/display/"+econindustryid,'详细','25%','45%');
}

/*批量删除*/
$("#delBtn").on("click", function () {
	//关闭当前grid中复选框所选择的数据的id 
	var ids = $("#grid-table").jqGrid('getGridParam','selarrrow');
	if(ids.length==0){
		// 弹出提示信息
		parent.toast("请选择需要删除的数据！");
		return;
	}

	var econindustryids=[];
	for(var i=0;i<ids.length;i++){
		var id = ids[i]; 
		//关闭指定id行的数据 
		var rowdatas = $("#grid-table").jqGrid('getRowData',id);
		econindustryids[i]= rowdatas.ECONINDUSTRYID;
	}
	var parmJson = econindustryids.toString();
	var param = {"ids":parmJson};
	del(param);
});

/*删除方法*/
function del(param){
	$.ajax({ 
	  		url: BASE_URL+"/system/syseconindustry/loadLinkById",
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
	  				  		url: BASE_URL+"/system/syseconindustry/delete",
	  				  		type:'post',
	  				  		dataType:'json',
	  				  		data:param,
	  				  		success: function(json){
	  				  			if(json.success==true){
	  				  				parent.toast(json.msg);
	  				  				reloadGrid();//刷新列表
	  				  				loadEconindustryTree();//刷新树
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

 


/**国民经济行业分类树*/
function loadEconindustryTree(){
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
		url : BASE_URL+'/system/syseconindustry/econindustrytree',
		cache : false,
		dataType : 'json',
		global : false,
		async : false,
		success : function(map) {
			var tree_map = initTreeMap(map);
			$.fn.zTree.init($("#econindustrytree"), setting, tree_map);
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
				var econindustryid = map[i].id;
				if(map[i].pId == "" || map[i].pId == null || map[i].pId == undefined){
					//根节点
					icon = BASE_URL+"/images/tree/d_icon_tree1.png";
					open = true;
				}else if(map[i].pId == -1){
					//子节点
					icon = BASE_URL+"/images/tree/d_icon_tree2.png";
					open = false;
				}else{
					icon = BASE_URL+"/images/tree/d_icon_tree3.png";
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
	var treeObj = $.fn.zTree.getZTreeObj("econindustrytree");
	treeObj.checkNode(treeNode, true, true);

	var econindustryid = treeNode.id;
	$("#econindustryid").val(econindustryid); //主键
	$("#code").val(""); //编码
	$("#type").val(""); //类型
	reloadGrid();
}


/**勾选树节点*/
function treeCheck(event, treeId, treeNode, clickFlag){
	treeClick(event, treeId, treeNode, clickFlag);
}
