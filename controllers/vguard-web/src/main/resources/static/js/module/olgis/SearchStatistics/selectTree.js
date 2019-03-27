var SelectTree = function() {

};


/**
 * 加载危化品企业类型树(所有节点)
 * code:定义选择后的ID值
 * defValue 默认值
 */ 
SelectTree.loadChemicalEntTypeAllSelect = function loadChemicalEntTypeAllSelect(code,param,defValue) {
	//SelectTree.loadBaseSelect(BASE_URL+"/olgis/gisSearchEnt/entTypeAllTree",code,param,defValue);
	loadTree(BASE_URL+"/olgis/gisSearchEnt/entTypeAllTree",code,param,defValue);
};

//-------------------------------------

function loadTree(loadurl,code,jsonParam,defValue,fn) {
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
		url : loadurl,
		data :jsonParam,
		cache : false,
		dataType : 'json',
		global : false,
		async : false,
		success : function(map) {
			var tree_map = initTreeMap(map);
			$.fn.zTree.init($("#chemistrytypetree"), setting, tree_map);
		},
		error : function() {
			window.wxc.xcConfirm("服务出错，请与管理员联系！", window.wxc.xcConfirm.typeEnum.warning);
		}
	});

	// 树图标的初始化
	function initTreeMap(map) {
		//危险化学品类型数组
		var chemicaltype = $("#chemicaltype").val().split(",");
		var t_map = new Array();
		// 遍历子节点
		if (map != null && map.length > 0) {
			var open = false;
			for (var i = 0; i < map.length; i++) {
				if (map[i].id != -1) {
					var orgid = map[i].id;
					open = true;
				}
				if(map[i].id == 1){
					map[i].name = "危化品企业";
				}
				if(map[i].id == 2){
					map[i].pId = 1;
				}
				if($.inArray(map[i].id, chemicaltype) == -1){
					t_map.push(new Node(map[i].id, map[i].pId, map[i].name, open, false));
				}else{
					t_map.push(new Node(map[i].id, map[i].pId, map[i].name, open, true));
				}
			}
			pnum = map.length;
			var dangerArr = ['重大危险源','危险化学品','燃气类','港口类'];
			t_map.push(new Node(pnum,-1,dangerArr[0],open,false));
			t_map.push(new Node(pnum+1,pnum,dangerArr[1],open,false,1));
			t_map.push(new Node(pnum+2,pnum,dangerArr[2],open,false,2));
			t_map.push(new Node(pnum+3,pnum,dangerArr[3],open,false,3));
			
/*			pnum = map.length;
			var dangerArr = [{"id":"7","pId":"-1","name":'重大危险源',"status":"open","is":"false"},
			                 {"id":"1","pId":"7","name":'危险化学品',"status":"open","is":"false"},
			                 {"id":"2","pId":"7","name":'燃气类',"status":"open","is":"false"},
			                 {"id":"3","pId":"7","name":'港口类',"status":"open","is":"false"}];
			var dangerArr = eval(dangerArr);  
			for(var k=0;k<dangerArr.length;k++);
			{
				t_map.push(new Node(dangerArr[k].id,dangerArr[k].pId,dangerArr[k].name,dangerArr[k].status,dangerArr[k].is));
			}*/
		} else {
			t_map = null;
		}
		return t_map;
	}

	// 树节点对象
	function Node(id, pId, name, open, checked,aliasId) {
		this.id = id;
		this.pId = pId;
		this.name = name;
		this.open = open;
		this.checked = checked;
		this.aliasId = aliasId;
	}
	
	/** 点击树节点 */
	function treeClick(event, treeId, treeNode, clickFlag) {
		//var id = treeNode.id;
		//var name = treeNode.name;
		
		var zTree = $.fn.zTree.getZTreeObj("chemistrytypetree"), nodes = zTree
		.getCheckedNodes(true), v = "";
		var eventId = "";
		var vDanger = "";
		var eventIdDanger = "";
		nodes.sort(function compare(a, b) {
			return a.id - b.id;
		});
		for ( var i = 0, l = nodes.length; i < l; i++) {
			if (!nodes[i].isParent) {
				if(nodes[i].pId == 1){
					v += nodes[i].name + ",";
					eventId += nodes[i].id + ",";
				}else if(nodes[i].pId == 7){
					vDanger += nodes[i].name + ",";
					eventIdDanger += nodes[i].aliasId + ",";
				}
				
			}
		}
		v = removeComma(v);
		eventId = removeComma(eventId);
		vDanger = removeComma(vDanger);
		eventIdDanger = removeComma(eventIdDanger);
		$("#chemicaltype").val(v);
		$('#chemicaltype_select').val(eventId);
		$("#dangertype").val(vDanger);
		$('#dangertype_select').val(eventIdDanger);

	}
	/*去掉字符串尾部的逗号*/
	function removeComma(str){
		if (str.length > 0)
			return str = str.substring(0, str.length - 1);
	}
	/**勾选权限树节点*/
	function treeCheck(event, treeId, treeNode, clickFlag){
		treeClick(event, treeId, treeNode, clickFlag);
	}
}
//---------------------------------------
