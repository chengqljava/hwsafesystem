$(document).ready(function() {
	 	//排查项
		SelectTree.loadCheckitemSelect("itemname");
	    
		//加载成员单位树
		loadIsMemberTree();
		
		//小数验证
		jQuery.validator.addMethod("numval", function(value, element) { 
			var num =  /^[1-9]{1}\.\d{1}$/;
			return this.optional(element) || (num.test(value)); 
			}, "请输入例如(1.1)的小数");
		
		/**数字验证*/
		jQuery.validator.addMethod("num", function(value, element) {
			var num = /^([0-9]+)$/;
			return this.optional(element) || (num.test(value));
			}, "只能输入数字(0-9)");
		
		$("#checkstandardform").validate({
			rules: {
				itemno: {
					required: true
				},
				itemname: {
					required: true
				},
				checkcontent: {
					required: true
				},
				score: {
					required: true,
					numval: true
				},
				ordernum: {
					num: true
				}
			},
			messages: {
				itemno: {
					required: "安全检查项目不能为空"
				},
				itemname: {
					required: "排查项不能为空"
				},
				checkcontent: {
					required: "安全检查内容不能为空"
				},
				score: {
					required: "评分不能为空",
					numval: "请输入例如(1.1)的小数"
				},
				ordernum: {
					num: "只能输入数字(0-9)",
				}
			},
			submitHandler:function(form){
				 save();
		    }   
		});
});


/**安委会成员单位树*/
function loadIsMemberTree(){
	var setting = {
		data : {
			simpleData : {
				enable : true
			}
		},
		callback: {
			
		},
		check: {
	        enable: true
		}
	};	

	$.ajax({
		type :'post',
		url : BASE_URL+'/system/sysorg/isMemberTree', //是否成员单位
		cache : false,
		dataType : 'json',
		data:{ismember:'1',districtlevel:'0,1,2'}, //0表示非安委会成员单位
		global : false,
		async : false,
		success : function(map) {
			var tree_map = initTreeMap(map);
			$.fn.zTree.init($("#orgtree"), setting, tree_map);
		},
		error : function() {
			console.log("网络异常");
		}
	});
	
	//树图标的初始化
	function initTreeMap(map) {
		var directororgids = $("#directororgids").val().split(",");
		var t_map = new Array();
		//遍历子节点
		if (map != null && map.length > 0) {
			var open = false;
			for ( var i = 0; i < map.length; i++) {
				var icon = "";
				if(map[i].pId == -1 ){
					open = true;
				}else{
					open = false;
				}
				
				if($.inArray(map[i].id, directororgids) == -1){
					t_map.push(new Node(map[i].id, map[i].pId, map[i].name, open, icon, false));
				}else{
					t_map.push(new Node(map[i].id, map[i].pId, map[i].name, open, icon, true));
				}
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

/**
 * 树不可点击
 * @param disabled
 */
function treeDisabled(){
	var zTree = $.fn.zTree.getZTreeObj("orgtree");
	var nodes = zTree.getNodes();
	for (var i=0;i < nodes.length; i++) {
		zTree.setChkDisabled(nodes[i],true,true,true);
	}
}

/**保存*/
function save(){
	$.fn.serializeObject = function()    
	{    
	   var o = {};    
	   var a = this.serializeArray();    
	   $.each(a, function() {    
	       if (o[this.name]) {    
	           if (!o[this.name].push) {    
	               o[this.name] = [o[this.name]];    
	           }    
	           o[this.name].push(this.value || '');    
	       } else {    
	           o[this.name] = this.value || '';    
	       }    
	   });    
	   return o;    
	}; 
	
	//序列化对象化
    var dataobj = $('#checkstandardform').serializeObject();
	var treeObj=$.fn.zTree.getZTreeObj("orgtree");
    var nodes = treeObj.getCheckedNodes(true);
    
    var directororgids = '';
    for(var i=0; i<nodes.length; i++){
 		if (directororgids != ''){ 
 			directororgids += ',';
 		}
 		directororgids += nodes[i].id;
 	}
    dataobj.directororgids = directororgids;
    
    
	$.ajax({
		type : 'post',
		url : BASE_URL+'/hiddendanger/hdichekcstandard/save',
		cache : false,
		dataType : 'json',
		data : dataobj,
		global : false,
		success : function(json) {
			if(json.success==true){
				parent.toast(json.msg);//弹出提示信息
				parent.getActiveIFrame().reloadGrid();//刷新列表
				//parent.getActiveIFrame().loadCheckitemTree();//刷新树();
				parent.closeWin();// 关闭弹出框
			}else{
				parent.toast(json.msg);
			}
		},
		error : function() {
			parent.toast("保存失败");
		}
	});
}
