
/** 部门用户树 */
function loadDepartUserTree() {
	var setting = {
		data : {
			simpleData : {
				enable : true
			}
		},
		callback : {
			onClick : treeClick
		}
	};

	$.ajax({
		type : 'post',
		url : BASE_URL + '/system/sysdepart/loadDepartUserTree',
		cache : false,
		dataType : 'json',
		data : {"usertype" : "GOV"},
		global : false,
		async : true,
		success : function(map) {
			var tree_map = initTreeMap(map);
			$.fn.zTree.init($("#departUserTree"), setting, tree_map);
		},
		error : function() {
			console.log("网络异常");
		}
	});
}

// 树图标的初始化
function initTreeMap(map) {
	var t_map = new Array();
	// 遍历子节点
	if (map != null && map.length > 0) {
		var idArr=new Array();
		for (var i = 0; i < map.length; i++) {
	        var tempArr = $.grep(idArr,function(value){
	            return value ==map[i].ID;
	        });
			if(tempArr.length==0){
				createParentNode(t_map,map[i]);
				createChildrenNode(t_map,map[i]);
				idArr.push( map[i].ID);
			}
			else{
				createChildrenNode(t_map,map[i]);
			}
		}
	} else {
		t_map = null;
	}
	return t_map;
}


function createParentNode(t_map,obj)//创建父级
{
	var icon = BASE_URL + "/images/tree/d_icon_tree2.png";
	var nodeName=obj.DEPARTNAME;
	t_map.push(new Node(obj.ID, "",nodeName , true,icon));
}

function createChildrenNode(t_map,obj)//创建子级
{
	if(obj.USERID!=""&obj.USERID!=null){
		var icon = BASE_URL + "/images/tree/d_icon_tree3.png";
		var nodeName=obj.NICKNAME+"  "+obj.PHONE;
		t_map.push(new Node(obj.USERID,obj.ID,nodeName, false,icon));
	}
}

//树节点对象
function Node(id, pId, name, open, icon) {
	this.id = id;
	this.pId = pId;
	this.name = name;
	this.open = open;
	this.icon = icon;
}


/**点击权限树节点*/
function treeClick(event, treeId, treeNode, clickFlag) {
//	var departid = treeNode.id;
//	$("#departid").val(departid);
//	$("#departname").val("");//部门名称清空
//	$("#departcode").val("");//部门编码清空
//	reloadGrid();
}