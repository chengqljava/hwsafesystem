$(document).ready(function() {
	//加载销案人员树
	loadPatrollerTree();
	
	//巡查人员不能为空
	jQuery.validator.addMethod("ztreecheck", function(value, element) {  
		var treeObj=$.fn.zTree.getZTreeObj("patrollertree");
	    var nodes=treeObj.getCheckedNodes(true);
	    if(nodes.length > 0){
	    	return true;
	    }else{
	    	return false;
	    }
	    return true;    
	}, "销案人员不能为空");

	$("#govclcaseform").validate({
		rules : {
			rclcasedate : {
				required : true
			},
			isclcase : {
				required : true
			},
			patrollerids: {
				ztreecheck : true
			}
		},
		messages : {
			rclcasedate : {
				required : "销案日期不能为空"
			},
			isclcase : {
				required : "请选择是否销案!"
			}
		},
		errorPlacement : function(error, element) { //指定错误信息位置
			if (element.is(':radio')) {
				var eid = element.attr('name'); //获取元素的name属性
				error.appendTo($('.' + eid + 'Div')); //将错误信息添加当前元素的父结点后面
			} else {
				error.insertAfter(element);
			}
		},
		submitHandler : function(form) {
			save();
		}
	});
});

/**销案人员树*/
function loadPatrollerTree() {
	var setting = {
		data : {
			simpleData : {
				enable : true
			}
		},
		callback : {
			onClick : treeClick,
			onCheck : treeCheck
		},
		check : {
			enable : true
		}
	};

	$.ajax({
		type : 'post',
		url : BASE_URL + '/hiddendanger/hdipatroller/patrolleTree',
		cache : false,
		dataType : 'json',
		global : false,
		async : false,
		success : function(map) {
			var tree_map = initTreeMap(map);
			$.fn.zTree.init($("#patrollertree"), setting, tree_map);
			var zTree = $.fn.zTree.getZTreeObj("patrollertree");
			var nodes = zTree.getNodes();
			for (var i = 0; i < nodes.length; i++) {
				zTree.setChkDisabled(nodes[i], true);//禁用根节点
			}
		},
		error : function() {
			console.log("网络异常");
		}
	});

	//树图标的初始化
	function initTreeMap(map) {
		var t_map = new Array();
		//遍历子节点
		var icon = "";
		if (map != null && map.length > 0) {
			t_map.push(new Node("-1", "", "销案人员", true, icon, false));
			for (var i = 0; i < map.length; i++) {
				t_map.push(new Node(map[i].id, map[i].pId, map[i].name, false,
						icon, false));
			}
		} else {
			t_map = null;
		}
		JSON.stringify(t_map);
		return t_map;
	}

	//树节点对象
	function Node(id, pId, name, open, icon, checked) {
		this.id = id;
		this.pId = pId;
		this.name = name;
		this.open = open;
		this.icon = icon;
		this.checked = checked;
	}
	
	/** 点击树节点 */
	function treeClick(event, treeId, treeNode, clickFlag) {
		var id = treeNode.id;
		$("#patrollerids").val(id);
		//去除 验证的错误信息
		var treeObj=$.fn.zTree.getZTreeObj("patrollertree");
	    var nodes=treeObj.getCheckedNodes(true);
	    if(nodes.length > 0){
	    	$("#patrollerids").attr("class","valid");
	    	$("#patrollerids-error").css("display","none");
	    }
	}
	/**勾选权限树节点*/
	function treeCheck(event, treeId, treeNode, clickFlag){
		treeClick(event, treeId, treeNode, clickFlag);
	}
}

/*保存(新增或编辑)*/
function save() {
	var treeObj = $.fn.zTree.getZTreeObj("patrollertree");
	var nodes = treeObj.getCheckedNodes(true);
	var patrollerids = '';
	for (var i = 0; i < nodes.length; i++) {
		if (patrollerids != '') {
			patrollerids += ',';
		}
		patrollerids += nodes[i].id;
	}
	$('#patrollerids').val(patrollerids);

	$.ajax({
		type : 'post',
		url : BASE_URL + '/hiddendanger/hdigovcancelcase/save',
		dataType : 'json',
		data : $("#govclcaseform").serializeArray(),
		global : false,
		success : function(json) {
			if (json.success == true) {
				parent.toast(json.msg);//弹出提示信息
				parent.getActiveIFrame().reloadGrid();//重新加载
				parent.closeWin();// 关闭弹出框
			} else {
				parent.toast(json.msg);
			}
		},
		error : function() {
			parent.toast("保存失败");
		}
	});
}
