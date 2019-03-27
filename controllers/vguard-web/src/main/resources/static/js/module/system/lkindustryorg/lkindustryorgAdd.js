$(document).ready(function() {
	//加载菜单树
	loadOrgTree("orgtree");
});

function loadOrgTree(divid){
	var setting = {
		data : {
			simpleData : {
				enable : true
			}
		},
		check:{
            enable:true, //复选框
            chkStyle: "checkbox",
    		chkboxType: { "Y": "", "N": "" }
        }
	};	
	
	var directortypeid = $("#directortypeid").val();
	var districtcode = $("#districtcode").val();
	var param = {"directortypeid" : directortypeid,"districtcode" : districtcode};
	$.ajax({
		type :'POST',
		url : BASE_URL+'/system/lkindustryorg/orgtree',
		cache : false,
		dataType : 'json',
		data : param,
		global : false,
		async : false,
		success : function(map) {
			var tree_map = initTreeMap(map);
			$.fn.zTree.init($("#"+divid), setting, tree_map);
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
			//t_map.push(new Node("-1","","行业主管部门",true,BASE_URL+"/images/tree/org.png"));//根节点
			for ( var i = 0; i < map.length; i++) {
				var icon = "";
				var checked = false;
				if(map[i].id != -1 ){
					icon = BASE_URL+"/images/tree/d_icon_tree1.png";
					var orgid = map[i].id;
					open = true;
				}	
				if(map[i].checked =="true"){
					checked = true;
				}
				t_map.push(new Node(map[i].id, map[i].pId, map[i].name,
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


function saveOrg(){
	var treeObj=$.fn.zTree.getZTreeObj("orgtree"),
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
    var directortypeid = $("#directortypeid").val();
    var districtcode = $("#districtcode").val();
    var param = {"ids":privids.toString(),
    			"directortypeid":directortypeid,
    			"districtcode": districtcode};
    $.ajax({
		type : 'post',
		url : BASE_URL+'/system/lkindustryorg/save',
		cache : false,
		dataType : 'json',
		data : param,
		global : false,
		success : function(json) {
		  if(json.success==true){
			  parent.toast(json.msg);//弹出提示信息
			  parent.getActiveIFrame().reloadGrid();//重新加载
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
