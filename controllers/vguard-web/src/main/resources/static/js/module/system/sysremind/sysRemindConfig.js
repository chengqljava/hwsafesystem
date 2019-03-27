var funcid="";//菜单id
var oldSelected = [];//选中的人员id
var selectedMap = new MapUtil();//选中的conid集合
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
	
	
	$.ajax({
		type :'get',
		url : BASE_URL+'/system/sysremindconfig/orgusertree',
		cache : false,
		data : {"typenum":$("#typenum").val()},
		dataType : 'json',
		global : false,
		success : function(map) {
			var tree_map = initTreeMap(map.treemenu);
			var configList = map.configList;
			console.log(JSON.stringify(configList));
			if(configList.length>0){
				for(var i=0;i<configList.length;i++){
					//key:userid  value:conid
					selectedMap.put(configList[i].userid,configList[i].conid);
				}
			}
			
			
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
				if (map[i].parentid == -1||map[i].parentid == -999) {//父菜单
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
					//追加到初始化的选中数组中
					oldSelected.push(map[i].privid);
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
	//新增的人员记录
	var addIds = [];
	//删除的人员记录
	var deleteIds = [];
	//删除的人员配置id
	var delConids = [];
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
    //如果是之前的数据是空的，则新增的为当前选中的记录
    if(oldSelected.length==0){
    	addIds = privids;
    }else{
    	deleteIds = inANotInB(oldSelected,privids);
    	addIds = diffAdd(oldSelected,privids);
    	
    }
    
    if(!selectedMap.isEmpty()){
    	 for (var i = 0; i < deleteIds.length; i++) {
    		 delConids.push(selectedMap.get(deleteIds[i]));
    	 }
    }
    var param = {"addIds":addIds.toString(),"deleteIds":delConids.toString(),"typenum":$("#typenum").val()};
    
    $.ajax({
		type : 'post',
		url : BASE_URL+'/system/sysremindconfig/saveUserPriv',
		cache : false,
		dataType : 'json',
		data : param,
		global : false,
		async : false,
		success : function(map) {
		  if(map.success==true){
			  parent.toast(map.msg);//弹出提示信息
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


//两个数组不重复的部分 ,即删除的数据
function inANotInB(a,b){ 
    var obj = new Object(); 
    for(var i =0,len = a.length;i<len;i++){ 
        obj[a[i]] = 1; 
    } 
    for(var i =0,len = b.length;i<len;i++){ 
        if(obj.hasOwnProperty(b[i])){ 
            obj[b[i]] = undefined; 
        } 
    } 
    var arr = new Array(); 
    var i = 0; 
    for(var per in obj){ 
        if(obj[per]){ 
            arr[i++] = per; 
        } 
    } 
    return arr; 
} 
//两个数组新增的数据
function diffAdd(arr1, arr2) {  
	  var newArr = [];  
	  var arr3 = [];  
	  for (var i=0;i<arr2.length;i++) {  
	    if(arr1.indexOf(arr2[i]) === -1)     
	      arr3.push(arr2[i]);  
	  } 
	  return arr3;
	}  
