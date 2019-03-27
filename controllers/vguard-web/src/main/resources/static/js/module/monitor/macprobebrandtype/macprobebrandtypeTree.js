/**机构树*/
function loadOrgTree(treeId,callback){
	var setting = {
		view: {
			selectedMulti: false
		},
		callback: {
			onClick: treeClick,
			onAsyncSuccess:onAsyncSuccess
		},
		data : {
			simpleData : {
				enable : true
			}
		},
		async: {
			enable: true,
			url:BASE_URL+'/monitor/macprobebrandtype/loadMacProbeBrandTypeTree',
			autoParam:["id", "name=n", "level=lv"],
			otherParam:{"otherParam":"zTreeAsyncTest"},
			dataFilter: filter
		},
	};	
	
	$.ajax({
		type :'post',
		url : BASE_URL+'/monitor/macprobebrand/loadMacprobeBrandTree',
//		data : {},
		cache : false,
		dataType : 'json',
		global : false,
		async : false,
		success : function(map) {
			var tree_map = initTreeMap(map);
			$.fn.zTree.init($("#"+treeId), setting, tree_map);
		},
		error : function() {
			console.log("网络异常");
		}
	});
	
	function filter(treeId, parentNode, childNodes) {
		console.log("filter");
		return childNodes;
	}
	
	//树图标的初始化
	function initTreeMap(map) {
		var t_map = new Array();
		//遍历子节点
		t_map.push(new Node("-1","","品牌型号",true,BASE_URL+"/images/tree/d_icon_tree1.png"));//根节点
		if (map != null && map.length > 0) {
			var open = false;
			for ( var i = 0; i < map.length; i++) {
				var icon = "";
				if(map[i].id != -1 ){
//					icon = BASE_URL+"/images/tree/d_icon_tree2.png";
					open=false;
				}	
				t_map.push(new Node(map[i].id, map[i].pId, map[i].name,
						open,icon,true));
			}
		}
		return t_map;
	}
	
	//树节点对象
	function Node(id, pId, name, open, icon,isParent ) {
		this.id = id;
		this.pId = pId;
		this.name = name;
		this.open = open;
		this.icon = icon;
		this.isParent=isParent;
	}
}


/**点击权限树节点*/
function treeClick(event, treeId, treeNode, clickFlag){
	var markid = treeNode.id;
	var level = treeNode.level;
	if(level>1){
		$("#parentid").val(markid);
	}else{
		$("#parentid").val("");
	}
	$("#brandid").val(getMarkId(treeNode));
	reloadGrid();
}
/**
 * 获取当前节点的品牌ID
 * @param treeNode
 * @returns
 */
function getMarkId(treeNode){
	var node = treeNode.getParentNode();
	if(node==null || node.level == 0){
		return treeNode.id;
	}else if(node.level ==1){
		return node.id;
	}else{
		return getMarkId(node);
	}
}

function onAsyncSuccess(event, treeId, treeNode, clickFlag){
	 var zTree = $.fn.zTree.getZTreeObj(treeId);
	 if(treeNode.children.length==0 && treeNode.pId!="-1"){
		 treeNode.isParent = false;
	 }else{
		 treeNode.isParent = true;
	 }
	 treeNode.open=true;
	 zTree.updateNode(treeNode);
//	 console.log("onAsyncSuccess");
}

/** 
 * 刷新当前节点 
 */  
function refreshNode(treeId) {
    /*根据 treeId 获取 zTree 对象*/  
    var zTree = $.fn.zTree.getZTreeObj(treeId);
    type = "refresh",  
    silent = false,  //是否自动展开 isSilent = true 时，不展开父节点，其他值或缺省状态都自动展开。
    /*获取 zTree 当前被选中的节点数据集合*/  
    nodes = zTree.getSelectedNodes();
    if(nodes.length>0){
	    nodes[0].isParent = true;
	    zTree.updateNode(nodes[0]);
	    /*强行异步加载父节点的子节点。[setting.async.enable = true 时有效]*/  
	    zTree.reAsyncChildNodes(nodes[0], type, silent); 
	    zTree.selectNode(nodes[0]);
    }
    
}

/** 
 * 刷新当前选择节点的父节点 
 */  
function refreshParentNode(treeId) {  
    var zTree = $.fn.zTree.getZTreeObj(treeId),  
    type = "refresh",  
    silent = false,//是否自动展开   isSilent = true 时，不展开父节点，其他值或缺省状态都自动展开。
    nodes = zTree.getSelectedNodes();  
    
    var selectedNode = nodes[0];
    var refreshNodeId;
    if(selectedNode.isParent)
    	refreshNodeId = selectedNode.tId;
    else
    	refreshNodeId = selectedNode.parentTId;
    /*根据 zTree 的唯一标识 tId 快速获取节点 JSON 数据对象*/  
    var parentNode = zTree.getNodeByTId(refreshNodeId);  
    /*选中指定节点*/  
    zTree.selectNode(parentNode);
    if(selectedNode.level == 0)
    	loadOrgTree(treeId);
    else
    	zTree.reAsyncChildNodes(parentNode, type, silent);  
}  