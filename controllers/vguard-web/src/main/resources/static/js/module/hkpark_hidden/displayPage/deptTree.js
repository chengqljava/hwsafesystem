$(document).ready(function() {
	//加载机构树
	loadOrgTree("orgtree");
	
});
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
		url : BASE_URL+'/enterprise/entorg/getOrgUserTree',
		cache : false,
		dataType : 'json',
		data:{},
		global : false,
		async : false,
		success : function(map) {
			console.log(map);
			var tree_map = initTreeMap(map);
			console.log(tree_map);
			$.fn.zTree.init($("#orgtree"), setting, tree_map);
		},
		error : function() {
			console.log("网络异常");
		}
	});
	
	//树图标的初始化
	function initTreeMap(map) {
		var t_map = new Array();
		if (map !=null) {
			t_map.push(new Node(map.entorgid,"-1",map.entorgname,true,BASE_URL+"/images/tree/org.png"));//根节点
			var orgs = map.orgs;
			var contacts = map.contactsList;
			//遍历子节点部门
			if (orgs.length > 0) {
				for ( var i = 0; i < orgs.length; i++) {
					var tempMap = initTreeMap(orgs[i]);
					for(var j = 0;j<tempMap.length;j++){
                        t_map.push(tempMap[j]);
					}
				}
			}
			if (contacts.length > 0) {
				for (var int = 0; int < contacts.length; int++) {
					t_map.push(new Node(contacts[int].contactsid,contacts[int].entorgid,contacts[int].contactsname,false,null));//人员树
				}
			}
		}else {
			t_map = null;
		}
		
		console.log(t_map);
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
	$("#orgid").val(orgid);
	$("#orgname").val("");//机构名称清空
//	reloadGrid();
}