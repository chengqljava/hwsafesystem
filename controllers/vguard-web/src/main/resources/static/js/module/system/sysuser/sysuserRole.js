var id = "";// 菜单id
$(document).ready(function() {
	var idArr = getidArr();
	var param = {
		"ids" : idArr.toString(),
		"usertype" : "SYS"
	};
	// 加载权限树
	loadFuncTree("privtree", param);
});

// 获取角色数组
function getidArr() {
	var idArr = [];
	$("input[name='id']:checked").each(function() {
		var id = $(this).val();
		idArr.push(id);
	});
	return idArr;
}

/** 加载权限树 */
function loadFuncTree(divid, param) {
	var setting = {
		data : {
			simpleData : {
				enable : true
			}
		},
		check : {
			enable : true
		// 复选框
		}
	};

	// 加载权限树
	$.ajax({
		type : 'get',
		url : BASE_URL + '/system/sysrole/privtree',
		cache : false,
		dataType : 'json',
		data : param,
		global : false,
		success : function(map) {
			var tree_map = initTreeMap(map);
			$.fn.zTree.init($("#" + divid), setting, tree_map);

		},
		error : function() {
			console.log("网络异常");
		}
	});
	// 树图标的初始化
	function initTreeMap(map) {
		var t_map = new Array();
		// 遍历子节点
		if (map != null && map.length > 0) {
			var open = false;
			for (var i = 0; i < map.length; i++) {
				var icon = "";
				var checked = false;

				if (map[i].pId == -1) {// 父菜单
					icon = BASE_URL + "/images/tree/d_icon_tree2.png";
					id = map[i].id;
					open = false;
				} else {// 子菜单
					open = false;
					icon = BASE_URL + "/images/tree/d_icon_tree3.png";
				}

				if (map[i].checked != "false") {
					checked = true;
				}

				t_map.push(new Node(map[i].id, map[i].pId, map[i].name, open,
						icon, checked, true));
			}

		} else {
			t_map = null;
		}

		return t_map;
	}

	// 树节点对象
	function Node(id, pId, name, open, icon, checked, chkDisabled) {
		this.id = id;
		this.pId = pId;
		this.name = name;
		this.open = open;
		this.icon = icon;
		this.checked = checked;
		this.chkDisabled = chkDisabled;
	}
}

// 勾选角色
function selectRole() {
	// 被选中的角色数组
	var idArr = getidArr();
	var param = {
		"ids" : idArr.toString(),
		"usertype" : "SYS"
	};
	loadFuncTree("privtree", param);
}

// 授权
function saveUserRole() {
	// 被选中的角色数组
	var idArr = getidArr();
	var userid = $("#userid").val();
	var param = {
		"ids" : idArr.toString(),
		"userid" : userid
	};
	$.ajax({
		type : 'post',
		url : BASE_URL + '/system/sysuser/saveUserRole',
		cache : false,
		dataType : 'json',
		data : param,
		global : false,
		success : function(json) {
			if (json.success == true) {
				parent.toast(json.msg);//弹出提示信息
//				parent.getActiveIFrame().reloadGrid();//重新加载
				parent.closeWin();// 关闭弹出框
			} else {
				parent.toast(json.msg);
			}
		},
		error : function() {
			parent.toast("网络异常");
		}
	});
}
