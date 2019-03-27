$(document).ready(function() {
	//加载行政区域树
	loadDistrictTree();
	
	var colname = ['行业主管分类id','企业监管类型','下级','行业主管部门']; 
	var colmodel = [ 
		{name:'DIRECTORTYPEID',index:'DIRECTORTYPEID', width:'5%',hidden: true},
		{name:'PIDNAME',index:'PIDNAME',width:'20%',align:'left',
			formatter : function(cellvalue, options, obj) {
			return obj.PIDCODE+'.'+obj.PIDNAME;
	}},
		{name:'DIRECTORTYPENAME',index:'DIRECTORTYPENAME',width:'30%',align:'left',sortable : false},
		{name:'ORGNAME',index:'ORGNAME',width:'35%',align:'left',sortable : false,
			formatter : function(cellvalue, options, obj) {
			if(obj.ORGNAME==null)
				obj.ORGNAME = "";
			return '<center><textarea rows="1"  onclick="display(\''
					+ obj.DIRECTORTYPEID
					+ '\')">'+ obj.ORGNAME+'</textarea></center>'
			}}
	];

	var tableHeight = $(window).height() - $('.pcheck').height() - 190;
	$(window).resize(function(){
		$("#grid-table").jqGrid( 'setGridHeight', $(window).height() - $('.pcheck').height() - 190 );
		$("#grid-table").jqGrid( 'setGridWidth', $(window).width()*0.86 );
	});

    $("#grid-table").jqGrid({
    	height: tableHeight,
    	url : BASE_URL + "/system/lkindustryorg/list",
		datatype: "json",
		cache : false,
		mtype : 'post',
		colNames:colname,
		colModel:colmodel,
		postData:{
			directortypename:$("#directortypename").val(),
			districtcode:$("#districtcode").val()
		},
		sortname : 'PIDCODE',
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
		caption: "行业主管部门",
		autowidth: true
	});
});


/*重新加载页面*/
function reloadGrid() {
	$("#grid-table").jqGrid('setGridParam', {
		page : 1,
		postData : {
			directortypename : $('#directortypename').val(),
			districtcode : $('#districtcode').val()
		}
	}).trigger("reloadGrid");
}

/*搜索查询*/
$("#searchBtn").bind("click",function(){
	var districtcode = $("#districtcode").val();
	if(districtcode == ""){
		parent.toast("请选择行政区域!");//弹出提示信息
		return;
	}
	reloadGrid();
});

/*重置*/
$("#resetBtn").bind("click",function(){
	$("#directortypename").val("");
	reloadGrid();
});


/*设置行业主管部门*/
function display(directortypeid){
	var districtcode = $("#districtcode").val();
	if(districtcode == ""){
		parent.toast("请选择行政区域!");//弹出提示信息
		return;
	}
	parent.openWin(BASE_URL+"/system/lkindustryorg/setdepartpage/"+directortypeid+"/"+districtcode,'行业主管部门',"50%","60%");
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
			parent.toast("网络异常");
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
	var treeObj = $.fn.zTree.getZTreeObj("districttree");
	treeObj.checkNode(treeNode, true, true);
	var districtcode = treeNode.id;
	$("#districtcode").val(districtcode); //主键
	reloadGrid();
}

/**勾选树节点*/
function treeCheck(event, treeId, treeNode, clickFlag){
	treeClick(event, treeId, treeNode, clickFlag);
}

