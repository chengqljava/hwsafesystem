var funcid="";//菜单id
var roleids = [];//角色id
$(document).ready(function() {
	//加载菜单树
	loadPrivTree("privtree");
});

function loadPrivTree(divid){
	var setting = {
		data : {
			simpleData : {
				enable : true
			}
		},check:{
            enable:true  //显示复选框
        }
	};	
	
	var roleidarr = $("#roleids").val();//角色id字符串
	roleids = roleidarr.split(",");
	var param = {"ids":roleids.toString() };
	
	$.ajax({
		type :'get',
		url : BASE_URL+'/system/govrole/loadPrivOperTree',
		cache : false,
		data : param,
		dataType : 'json',
		global : false,
		success : function(map) {
			var tree_map = initTreeMap(map);
			$.fn.zTree.init($("#"+divid), setting, tree_map);
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
			//t_map.push(new Node("-1","","权限树",true,BASE_URL+"/images/tree/d_icon_tree1.png",false));
			for ( var i = 0; i < map.length; i++) {
				var icon = "";
				var checked = false;
				if (map[i].parentid == -1) {//父菜单
					icon= BASE_URL+"/images/tree/d_icon_tree2.png";
					funcid= map[i].privid;
					open = true;
				} else if (map[i].privlevel == 1) {//一级菜单
					open = true;
					icon= BASE_URL+"/images/tree/d_icon_tree3.png";
				} else if (map[i].privlevel == 2) {//二级菜单
					open = true;
					icon= BASE_URL+"/images/tree/d_icon_tree4.png";
				} else if (map[i].privlevel == 3) {//功能模块
					open = false;
					icon= BASE_URL+"/images/tree/itemp.png";
				} else { //功能操作
					open = false;
					icon= BASE_URL+"/images/tree/u_icon.png";
				}
				if(map[i].checked){
					checked = true;
					//t_map[0] = new Node("-1","","权限树",true,BASE_URL+"/images/tree/d_icon_tree1.png",true);
				}
			
				t_map.push(new Node(map[i].privid, map[i].parentid, map[i].privname,
						open,icon,checked));
			}
		} else {
			t_map = null;
		}
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
}


function saveRolePriv(){
	var treeObj=$.fn.zTree.getZTreeObj("privtree"),
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
    var param = {"ids":privids.toString(),"roleids":roleids.toString()};
    
    $.ajax({
		type : 'post',
		url : BASE_URL+'/system/govrole/saveRolePriv',
		cache : false,
		dataType : 'json',
		data : param,
		global : false,
		async : false,
		success : function(map) {
		  if(map.success==true){
			  parent.toast(map.msg);//弹出提示信息
//			  parent.getActiveIFrame().reloadGrid();//重新加载
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
