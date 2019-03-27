$(document).ready(function() {
	//加载树
	loadTree();

});

/**
 * 保存专用排查项
 */
function save(){
	var treeObj=$.fn.zTree.getZTreeObj("checkitemtree"),
    nodes=treeObj.getCheckedNodes(true);
	var privids = [];
	var j = 0;
    for(var i=0;i<nodes.length;i++){
    	if(nodes[i].id == "-1"){
    		continue;
    	}
    	privids[j] = nodes[i].id;
    	j++;
    }
    var businessinfoid = $("#businessinfoid").val();
    var param = {"ids":privids.toString(),
    			"businessinfoid":businessinfoid};
    $.ajax({
		type : 'post',
		url : BASE_URL+'/hiddendanger/hdientregistra/saveded',
		cache : false,
		dataType : 'json',
		data : param,
		global : false,
		success : function(json) {
		  if(json.success==true){
			  parent.toast(json.msg);//弹出提示信息
			  var index = parent.getParentIndex();
			  parent.frames["layui-layer-iframe"+index].loadCheckTree();//刷新树 
			  parent.closeWin();// 关闭弹出框
		  }else{
			  parent.toast(map.msg);
		  }
		},
		error : function() {
			parent.toast("网络异常");
		}
	});
	    
}


/** 排查项树 */
function loadTree() {
	var setting = {
		data : {
			simpleData : {
				enable : true
			}
		},
		check: {
	        enable: true,
	        chkStyle: "checkbox"
		},
		view: {
			showIcon: false
		},
		callback : {
			onClick : treeClick,
			onCheck : treeCheck
		}
	};

	$.ajax({
		type : 'post',
		url : BASE_URL + '/hiddendanger/hdicheckitem/checkitemtypetree',
		data : {
			"businessinfoid" : $('#businessinfoid').val(),
			"itemtype" : 3, //专用检查项
			"industrytype" : $('#industrytype').val()
		},
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
				var checked = false;
				if(map[i].id != -1 ){
					var orgid = map[i].id;
					open = true;
				}	
				if(map[i].checked =="true"){
					checked = true;
				}
				t_map.push(new Node(map[i].id, map[i].pId, map[i].name,
						open,checked));
			}
		} else {
			t_map = null;
		}
		return t_map;
	}

	// 树节点对象
	function Node(id, pId, name, open, checked) {
		this.id = id;
		this.pId = pId;
		this.name = name;
		this.open = open;
		this.checked = checked;
	}
	
	/** 点击树节点 */
	function treeClick(event, treeId, treeNode, clickFlag) {
		var id = treeNode.id;
	}
	/**勾选树节点*/
	function treeCheck(event, treeId, treeNode, clickFlag){
		treeClick(event, treeId, treeNode, clickFlag);
	}
}
