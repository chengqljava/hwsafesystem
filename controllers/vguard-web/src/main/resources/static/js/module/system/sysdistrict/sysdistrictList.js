$(document).ready(function() {
	//加载行政区域树
	loadDistrictTree("sysdistrict");
	
	var colname = ['区域id','区域名称','区域编码','名称简写','描述']; 
	var colmodel = [
		{name:'DISTRICTCODE',index:'DISTRICTCODE', width:'5%',hidden: true},
		{name:'DISTRICTNAME',index:'DISTRICTNAME',width:'40%',align:'left',
			formatter:function(cellvalue, options, obj) { 
				   return '<a href="javascript:void(0);" onclick="display(\''+obj.DISTRICTCODE+'\')">'+obj.DISTRICTNAME+'</a>';
			}
		},
		{name:'DISTRICTNUM',index:'DISTRICTNUM',width:'20%',align:'left'},
		{name:'SHORTNAME',index:'SHORTNAME',width:'10%',align:'left'},
		{name:'DESCRIBE',index:'DESCRIBE',width:'25%',align:'left'}
	];

	var tableHeight = $(window).height() - $('.pcheck').height() - 190;
	$(window).resize(function(){
		$("#grid-table").jqGrid( 'setGridHeight', $(window).height() - $('.pcheck').height() - 190 );
		$("#grid-table").jqGrid( 'setGridWidth', $(window).width()*0.86 );
	});

    $("#grid-table").jqGrid({
    	height: tableHeight,
    	url : BASE_URL + "/system/sysdistrict/list",
		datatype: "json",
		cache : false,
		mtype : 'post',
		colNames:colname,
		colModel:colmodel,
		postData:{
			districtcode:$("#districtcode").val(),
			districtname:$("#districtname").val()
		},
		sortname : 'districtnum',
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
		caption: "行政区域",
		autowidth: true
	});
    
    $(window).resize(function() {
    	$("#gbox_grid-table").css("width","100%");
    })
});

/*加载*/
function reloadGrid(districtcode,districtname){
	$("#grid-table").jqGrid('setGridParam',{
		page:1,postData:{
					districtcode:districtcode,
					districtname:districtname
			             }
	}).trigger("reloadGrid");
}

/*搜索查询*/
$("#searchBtn").bind("click",function(){
	var districtcode = $("#districtcode").val();
	var districtname = $("#districtname").val();
	reloadGrid(districtcode,districtname);
});

/*重置*/
$("#resetBtn").bind("click",function(){
	$("#districtcode").val("");
	$("#districtname").val("");
});

/*添加*/
$("#addBtn").on("click", function () {
	parent.openWin(BASE_URL+"/system/sysdistrict/add",'添加','25%','40%');
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
	var districtcode = rowdata.DISTRICTCODE;
	
	parent.openWin(BASE_URL+'/system/sysdistrict/edit/'+districtcode,'编辑','25%','40%');
});

/*详细查询*/
function display(districtcode){
	parent.openWin(BASE_URL+"/system/sysdistrict/display/"+districtcode,'详细','25%','45%');
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

	var districtcodes=[];
	for(var i=0;i<ids.length;i++){
		var id = ids[i]; 
		//返回指定id行的数据 
		var rowdatas = $("#grid-table").jqGrid('getRowData',id);
		districtcodes[i]= rowdatas.DISTRICTCODE;
	}
	var parmJson = districtcodes.toString();
	var param = {"ids":parmJson};
	del(param);
});

/*删除方法*/
function del(param){
	$.ajax({ 
	  		url: BASE_URL+"/system/sysdistrict/loadLinkById",
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
	  				  		url: BASE_URL+"/system/sysdistrict/delete",
	  				  		type:'post',
	  				  		dataType:'json',
	  				  		data:param,
	  				  		success: function(json){
	  				  			if(json.success==true){
	  				  				parent.toast(json.msg);
	  				  				reloadGrid("","");//刷新列表
	  				  			    loadDistrictTree();//刷新树
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

 


/**行政区划树*/
function loadDistrictTree(){
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
		url : BASE_URL+'/system/sysdistrict/districttree',
		cache : false,
		dataType : 'json',
		global : false,
		async : false,
		success : function(map) {
			var tree_map = initTreeMap(map);
			$.fn.zTree.init($("#districttree"), setting, tree_map);
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
				if(map[i].districtlevel == 0){
					//根节点(市级)
					icon = BASE_URL+"/images/tree/d_icon_tree1.png";
					var districtcode = map[i].id;
					open = true;
				}else if(map[i].districtlevel == 1){
					//(区县级)
					icon= BASE_URL+"/images/tree/d_icon_tree2.png";
					var districtcode = map[i].id;
					open = false;
				}else if(map[i].districtlevel == 2){
					//(街道办级别)
					icon= BASE_URL+"/images/tree/d_icon_tree3.png";
					var districtcode = map[i].id;
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
	var districtcode = treeNode.id;
	$("#districtcode").val(districtcode); //主键
	$("#districtname").val(""); //行政区域名称
	reloadGrid(districtcode,$("#districtname").val());
}

