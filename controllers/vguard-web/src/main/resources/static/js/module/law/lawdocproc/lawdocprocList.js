$(document).ready(function() {
	//加载执法文书树
	loadDocTree("doctree");

	var colname = ['流程id','流程名称','所属文书','流程版本','发布时间'];
		var colmodel = [
			{name:'PROCID',index:'PROCID', width:'10%',hidden: true},
			{name:'PROCNAME',index:'PROCNAME',width:'20%',align:'left',
				formatter:function(cellvalue, options, obj) { 
					   return '<a href="javascript:void(0);" onclick="display(\''+obj.PROCID+'\')">'+obj.PROCNAME+'</a>';
				}
			},
			{name:'DOCNAME',index:'DOCNAME',width:'20%',align:'left'},
			{name:'VERSION',index:'VERSION',width:'10%',align:'center'},
			{name:'TIME',index:'TIME',width:'10%',align:'center'}
		];

		var tableHeight = $(window).height() - $('.pcheck').height() - 190 + 33;
		$(window).resize(function(){
			$("#grid-table").jqGrid( 'setGridHeight', $(window).height() - $('.pcheck').height() - 190 + 33 );
			$("#grid-table").jqGrid( 'setGridWidth', $(window).width()*0.86 );
		});

	    $("#grid-table").jqGrid({
	    	height: tableHeight,
	    	url : BASE_URL + "/law/lawdocproc/list",
			datatype: "json",
			cache : false,
			mtype : 'POST',
			colNames:colname,
			colModel:colmodel,
			postData:{
				docid:$('#docid').val()
			},
			sortname : 'PROCID',
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
			caption: "文书流程管理",
			autowidth: true
		});
});

/*加载*/
function reloadGrid(){
	$("#grid-table").jqGrid('setGridParam',{
		page:1,postData:{docid:$("#docid").val()}
	}).trigger("reloadGrid");
}

/*搜索查询*/
$("#searchbtn").bind("click",function(){
	reloadGrid();
});

/*重置*/
$("#resetbtn").bind("click",function(){
	$("#rolename").val("");
});

/*添加*/
$("#addBtn").bind("click",function(){
	parent.openWin(BASE_URL+"/law/lawdocproc/add",'添加','60%','40%');	
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

	var procids=[];
	for(var i=0;i<ids.length;i++){
		var id = ids[i]; 
		//返回指定id行的数据 
		var rowdatas = $("#grid-table").jqGrid('getRowData',id);
		procids[i]= rowdatas.PROCID;
	}
	var paramJson = procids.toString();
	var param = {"ids":paramJson};
	del(param);
});

/*删除方法*/
function del(param){
	//查询是否有关联引用(角色权限、父权限关联)	
	$.ajax({ 
	  		url: BASE_URL+"/law/lawdocproc/loadLinkById",
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
	  						 	url: BASE_URL+"/law/lawdocproc/delete",
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
function display(procid){
	parent.openWin(BASE_URL+"/law/lawdocproc/display/"+procid,'详细','60%','45%');
}


/**文书树*/
function loadDocTree(){
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
		url : BASE_URL+'/law/lawdocproc/doctree',
		data : {},
		cache : false,
		dataType : 'json',
		global : false,
		async : false,
		success : function(map) {
			var tree_map = initTreeMap(map);
			$.fn.zTree.init($("#doctree"), setting, tree_map);
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
			t_map.push(new Node("-1","","文书列表",true,BASE_URL+"/images/tree/org.png"));//根节点
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
	var docid = treeNode.id;
	if(docid=='-1'){
		docid = '';
	}
	$("#docid").val(docid);
	reloadGrid();
}