$(document).ready(function() {
	//加载排查项树
	loadCheckitemTree();
	
	var colname = ['主键id','排查项名','描述']; 
	var colmodel = [
		{name:'ITEMID',index:'ITEMID', width:'5%',hidden: true},
		{name:'ITEMNAME',index:'ITEMNAME',width:'40%',align:'left',sortable : false,
			formatter:function(cellvalue, options, obj) { 
				   return '<a href="javascript:void(0);" onclick="display(\''+obj.ITEMID+'\')">'+obj.ITEMNAME+'</a>';
			}
		},
		{name:'NOTES',index:'NOTES',width:'25%',align:'left',sortable : false}
	];
	
	$(window).on('resize.jqGrid', function () {
		$("#grid-table").jqGrid( 'setGridWidth', $(window).width()*0.86);
    })

    $("#grid-table").jqGrid({
    	height: 250,
    	url : BASE_URL + "/hiddendanger/hdicheckitem/list",
		datatype: "json",
		cache : false,
		mtype : 'post',
		colNames:colname,
		colModel:colmodel,
		postData:{
			itemid:$("#itemid").val(),
			itemname:$("#itemname").val()
		},
		sortname : 'ordernum',
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
		caption: "排查项",
		autowidth: true
	});
});

/*加载*/
function reloadGrid(){
	$("#grid-table").jqGrid('setGridParam',{
		page:1,postData:{
					itemid:$('#itemid').val(),
					itemname:$('#itemname').val()
			             }
	}).trigger("reloadGrid");
}

/*搜索查询*/
$("#searchBtn").bind("click",function(){
	reloadGrid();
});

/*重置*/
$("#resetBtn").bind("click",function(){
	$("#itemid").val("");
	$("#itemname").val("");
});

/*添加*/
$("#addBtn").on("click", function () {
	parent.openWin(BASE_URL+"/hiddendanger/hdicheckitem/add",'添加','25%','55%');
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
	var itemid = rowdata.ITEMID;
	parent.openWin(BASE_URL+'/hiddendanger/hdicheckitem/edit/'+itemid,'编辑','25%','55%');
});

/*详细查询*/
function display(itemid){
	parent.openWin(BASE_URL+"/hiddendanger/hdicheckitem/display/"+itemid,'详细','25%','55%');
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

	var itemids=[];
	for(var i=0;i<ids.length;i++){
		var id = ids[i]; 
		//返回指定id行的数据 
		var rowdatas = $("#grid-table").jqGrid('getRowData',id);
		itemids[i]= rowdatas.ITEMID;
	}
	var parmJson = itemids.toString();
	var param = {"ids":parmJson};
	del(param);
});

/*删除方法*/
function del(param){
	$.ajax({ 
	  		url: BASE_URL+"/hiddendanger/hdicheckitem/loadLinkById",
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
	  				  		url: BASE_URL+"/hiddendanger/hdicheckitem/delete",
	  				  		type:'post',
	  				  		dataType:'json',
	  				  		data:param,
	  				  		success: function(json){
	  				  			if(json.success==true){
	  				  				parent.toast(json.msg);
	  				  				reloadGrid();//刷新列表
	  				  				loadCheckitemTree();//刷新树
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

/**排查项树*/
function loadCheckitemTree(){
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
		url : BASE_URL+'/hiddendanger/hdicheckitem/checkitemtree',
		cache : false,
		dataType : 'json',
		global : false,
		async : false,
		success : function(map) {
			var tree_map = initTreeMap(map);
			$.fn.zTree.init($("#checkitemtree"), setting, tree_map);
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
				var ordernum = map[i].ordernum;
				if(map[i].pId == "" || map[i].pId == null){
					//根节点
					icon = BASE_URL+"/images/tree/d_icon_tree1.png";
					open = true;
				}else {
					icon= BASE_URL+"/images/tree/d_icon_tree2.png";
					open = false;
				}	
				t_map.push(new Node(map[i].id, map[i].pId, map[i].name,
						open,icon,ordernum));
			}
		} else {
			t_map = null;
		}
		return t_map;
	}
	
	//树节点对象
	function Node(id, pId, name, open, icon, ordernum) {
		this.id = id;
		this.pId = pId;
		this.name = name;
		this.open = open;
		this.icon = icon;
		this.ordernum = ordernum;
	}
}

/**点击节点*/
function treeClick(event, treeId, treeNode, clickFlag){
	var itemid = treeNode.id;
	$("#itemid").val(itemid); //主键
	$("#itemname").val(""); //行政区域名称至空
	reloadGrid();
}

