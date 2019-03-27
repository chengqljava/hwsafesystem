$(function() {
	//显示操作权限按钮
	$("#riskTypeTreeOpers").displayOper();
	
	//加载风险类型树
	loadRiskTypeTree();
	
	$("#riskTypeDiv").css({
		"height": $(window).height() - $(".pcheck").height() - 190,
		"min-width": $(window).width() * 0.86
	});
	
	//树形区域响应式调整
	$(window).resize(function(){
		$("#riskTypeDiv").css({
			"height": $(window).height() - $(".pcheck").height() - 190,
			"min-width": $(window).width() * 0.86
		});
	});
	
	//下拉安全风险类型下拉树查询框（只显示一级六大分类）
	SelectOption.loadRiskTypeSelect("risktype", {"userType": "0", "srchLvlOne": "1", "selectOpt": "1"});
	
    //查询按钮事件
    $("#searchbtn").off("click").on("click", function () {
    	loadRiskTypeTree();
    });

    //新增风险类型
    $("#addBtn").off("click").on("click", function (){
    	var curSelTypeLvl = $("#curSelTypeLvl").val(); //所选节点级别
    	if ("1" == curSelTypeLvl || "2" == curSelTypeLvl) {
	    	parent.openWin(
	    			encodeURI(encodeURI(BASE_URL
	    					+ "views/module/dangersource/entRiskType/entRiskTypeEdit.html?"
	    					+ "&curSelId=" + $("#curSelId").val() + "&saveType=0&typeLvl=" + curSelTypeLvl 
	    					+ "&parentname=" + $("#curSelName").val() + "&typeCode=" + $("#curSelTypeCode").val())),
	    					"新增风险类型", "50%", "32%");
    	} else {
    		parent.toast("请选中正确的节点！");
    		return;
    	}
    });
    
    //编辑风险类型
    $("#editBtn").off("click").on("click", function (){
    	var curSelTypeLvl = $("#curSelTypeLvl").val(); //所选节点级别
    	if ("2" == curSelTypeLvl || "3" == curSelTypeLvl) {
	    	parent.openWin(
	    			encodeURI(encodeURI(BASE_URL
							+ "views/module/dangersource/entRiskType/entRiskTypeEdit.html?"
							+ "&curSelId=" + $("#curSelId").val() + "&saveType=1&typeLvl=" + curSelTypeLvl
							+ "&parentname=" + $("#curSelPName").val() + "&typeCode=" + $("#curSelTypeCode").val())),
							"编辑风险类型", "50%", "32%");
    	} else {
    		parent.toast("请选中正确的节点！");
    		return;
    	}
    });
    
    //删除风险类型
    $("#delBtn").off("click").on("click", function () {
    	if ("" == $("#curSelId").val() || 
    	    "1" == $("#curSelTypeLvl").val()
    	) {
    		parent.toast("请选中正确的节点！");
    		return;
    	} else {
//    		var delIdArr = [];
//    		delIdArr.push($("#curSelId").val());
    		parent.confirm("确认删除吗?", function() {
    			$.ajax({
    				url: BASE_URL + "dangersource/dssrsktype/delete",
    				type: "post",
    				dataType: "json",
    				data: {"curSelId": $("#curSelId").val()},
    				success: function (json) {
    					if (json.success == true) {
    						parent.toast(json.msg);
    						
    						//刷新树
    						loadRiskTypeTree();
    					} else {
    						parent.toast(json.msg);
    					}
    				}
    			});
    		});
    	}
    });
});

/**风险类型树*/
function loadRiskTypeTree() {
	$("#curSelId").val(""); //风险类型id
	$("#curSelName").val("");
	$("#curSelTypeLvl").val(""); //所选节点级别
	$("#curSelTypeCode").val(""); //所选节点编码
	//所点击的点的父级节点名
	$("#curSelPName").val("");
	
	var setting = {
		data: {
			simpleData: {
				enable: true
			}
		},
		callback: {
			onClick: treeClick,
			onCheck: treeCheck
		},
		check: {
		        enable: true,
		        chkStyle: "radio",
		        radioType: "all"
		},
		async: {
			enable: true
		}
	};	
	
	$.ajax({
		type: "post",
		url: BASE_URL + "dangersource/dssrsktype/loadRiskTypeTree",
		cache: false,
  		data: {
  			"userType": "0",
  			"tgtPId": $("#risktype").val()
  		},
		dataType: "json",
		global: false,
		async: false,
		success: function(map) {
			var tree_map = initTreeMap(map);
			$.fn.zTree.init($("#riskTypeTree"), setting, tree_map);
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
				var icon = "",
//				var privid = map[i].id;
//				var usertype= map[i].usertype;
				    typecode= map[i].typecode,
				    typelvl= map[i].typelvl,
				    ordernum= map[i].ordernum;
				if(map[i].pId ==  "-1" && map[i].typelvl == "1"){
					//(系统、企业、政府根节点)
					icon = BASE_URL+"/images/tree/d_icon_tree1.png";
					open = true;
				}else if(map[i].typelvl == "2"){
					//父节点
					icon= BASE_URL+"/images/tree/d_icon_tree2.png";
					open = true;
				}else{
					//子菜单
					icon= BASE_URL+"/images/tree/d_icon_tree3.png";
					open = true;
				}			
				t_map.push(new Node(map[i].id, map[i].pId, map[i].name,
						   open, icon, typecode, typelvl, ordernum));
			}
		} else {
			t_map = null;
		}
		return t_map;
	}
	
	//树节点对象
	function Node(id, pId, name, open, icon, typecode, typelvl, ordernum) {
		this.id = id;
		this.pId = pId;
		this.name = name;
		this.open = open;
		this.icon = icon;
		this.typecode = typecode;
		this.typelvl = typelvl;
		this.ordernum = ordernum;
	}
}

/**点击权限树节点*/
function treeClick(event, treeId, treeNode, clickFlag){
	var treeObj = $.fn.zTree.getZTreeObj("riskTypeTree");
		treeObj.checkNode(treeNode, true, true);
	$("#curSelId").val(treeNode.id); //风险类型id
	$("#curSelName").val(treeNode.name); //风险类型id
	$("#curSelTypeLvl").val(treeNode.typelvl); //所选节点级别
	$("#curSelTypeCode").val(treeNode.typecode); //所选节点级别
//	$("#curSelPId").val(treeNode.getParentNode().id); //所选节点级别
	
	//所点击的点的父级节点名
	$("#curSelPName").val(null == treeNode.getParentNode() ? "" : treeNode.getParentNode().name); //所选节点级别
}

/**勾选权限树节点*/
function treeCheck(event, treeId, treeNode, clickFlag){
	treeClick(event, treeId, treeNode, clickFlag);
}