$(document)
		.ready(
				function() {
					// 加载部门树
					//loadDepartTree("departtree");
					var colname = [ '部门id', '部门名称', '部门编码', '负责人', '最近更新时间' ];
					var colmodel = [
							{
								name : 'DEPARTID',
								index : 'DEPARTID',
								width : '15%',
								align : 'center',
								sortable : false,
								hidden : true
							},
							{
								name : 'DEPARTNAME',
								index : 'DEPARTNAME',
								width : '30%',
								sortable : false,
								align : 'left',
								formatter : function(cellvalue, options, obj) {
									return '<a href="javascript:void(0);" onclick="display(\''
											+ obj.DEPARTID
											+ '\')">'
											+ obj.DEPARTNAME + '</a>';
								}
							},
							{
								name : 'DEPARTCODE',
								index : 'DEPARTCODE',
								width : '30%',
								sortable : false,
								align : 'center'
							},
							{
								name : 'PRINCIPAL',
								index : 'PRINCIPAL',
								width : '30%',
								sortable : false,
								align : 'center'
							},
							{
								name : 'UPDATETIME',
								index : 'UPDATETIME',
								width : '30%',
								align : 'center',
								formatter : function(cellvalue, options, obj) {
									return getFormatDateByLong(obj.UPDATETIME,
											"yyyy-MM-dd hh:mm:ss");
								}
							} ];

					var tableHeight = $(window).height() - $('.pcheck').height() - 190;
					$(window).resize(function(){
						$("#grid-table").jqGrid( 'setGridHeight', $(window).height() - $('.pcheck').height() - 190 );
						$("#grid-table").jqGrid( 'setGridWidth', $(window).width()*0.86 );
					});

					$("#grid-table").jqGrid({
						height : tableHeight,
						url : BASE_URL + "/system/sysdepart/list",
						datatype : "json",
						cache : false,
						mtype : 'POST',
						colNames : colname,
						colModel : colmodel,
						postData : {
							departname : $('#departname').val(),
							departcode : $('#departcode').val(),
							departid : $('#departid').val()
						},
						sortname : 'UPDATETIME',
						sortorder : "desc",
						viewrecords : true,
						pager : "#grid-pager",
						jsonReader : {
							root : "datas",
							total : "total",
							page : "page",
							records : "records",
							repeatitems : false
						},
						rowNum : 10,
						rowList : [ 10, 20, 30 ],
						altRows : true,
						multiselect : true,
						caption : "部门 管理",
						autowidth : true
					});
				});

/* 加载 */
function reloadGrid() {
	$("#grid-table").jqGrid('setGridParam', {
		page : 1,
		postData : {
			departname : $('#departname').val(),
			departcode : $('#departcode').val(),
			departid : $('#departid').val()
		}
	}).trigger("reloadGrid");
}

/* 搜索查询 */
$("#searchBtn").bind("click", function() {
	reloadGrid();
});
/*重置*/
$("#resetBtn").bind("click",function(){
	$("#departname").val("");
	$("#departcode").val("");
});

/* 编辑 */
$("#editBtn").bind(
		"click",
		function() {
			// 返回当前grid中复选框所选择的数据的id
			var ids = $("#grid-table").jqGrid('getGridParam', 'selarrrow');
			if (ids.length != 1) {
				// 弹出提示信息
				parent.toast("请选择一条数据进行编辑！");
				return;
			}
			// 返回指定id行的数据
			var rowdatas = $("#grid-table").jqGrid('getRowData', ids[0]);
			var departid = rowdatas.DEPARTID;
			parent.openWin(BASE_URL + "/system/sysdepart/edit/" + departid,
					'编辑', null, "45%");
		});

/* 添加 */
$("#addBtn").bind("click", function() {
	parent.openWin(BASE_URL + "/system/sysdepart/add", '添加', null, "45%");
});

/* 批量删除 */
$("#delBtn").bind("click", function() {
	// 返回当前grid中复选框所选择的数据的id
	var ids = $("#grid-table").jqGrid('getGridParam', 'selarrrow');
	if (ids.length == 0) {
		// 弹出提示信息
		parent.toast("请选择需要删除的数据！");
		return;
	}

	var userids = [];
	for (var i = 0; i < ids.length; i++) {
		var id = ids[i];
		// 返回指定id行的数据
		var rowdatas = $("#grid-table").jqGrid('getRowData', id);
		userids[i] = rowdatas.DEPARTID;
	}
	var paramJson = userids.toString();
	var param = {
		"ids" : paramJson
	};
	del(param);
});

/* 删除方法 */
function del(param) {
	// 查询是否有关联引用
	$.ajax({
		url : BASE_URL + "/system/sysdepart/loadLinkById",
		type : 'post',
		dataType : 'json',
		data : param,
		success : function(json) {
			if (json.success == false) {
				// 有关联引用
				parent.toast(json.msg);
			} else {
				//弹出提示框
				parent.confirm('确认删除吗?',function(){
					$.ajax({ 
				  		url: BASE_URL + "/system/sysdepart/delete",
				  		type:'post',
				  		dataType:'json',
				  		data:param,
				  		success: function(json){
				  			if(json.success==true){
					  			parent.toast(json.msg);
								reloadGrid();// 刷新列表
								loadDepartTree();// 刷新树
				  			}else{
				  				parent.toast(json.msg);
				  			}
				  		}
					 });
				})
			}
		}
	});
}

/* 详细查询 */
function display(userid) {
	parent.openWin(BASE_URL + '/system/sysdepart/display/' + userid, '详细',
			null, "45%");
}

/** 部门树 */
function loadDepartTree() {
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
	var param = {
		"param" : "true"
	};
	$.ajax({
		type : 'post',
		url : BASE_URL + '/system/sysdepart/departtree',
		cache : false,
		dataType : 'json',
		data : param,
		global : false,
		async : false,
		success : function(map) {
			var tree_map = initTreeMap(map);
			$.fn.zTree.init($("#departtree"), setting, tree_map);
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
				if (map[i].id == -1 && map[i].pId == "") {
					// 根节点
					icon = BASE_URL + "/images/tree/d_icon_tree1.png";
					var privid = map[i].id;
					open = true;
				} else if (map[i].pId == -1) {
					//父节点
					icon = BASE_URL + "/images/tree/d_icon_tree2.png";
					var privid = map[i].id;
					open = false;
				} else {
					//子节点
					open = false;
					icon = BASE_URL + "/images/tree/d_icon_tree3.png";
				}
				t_map.push(new Node(map[i].id, map[i].pId, map[i].name, open,
						icon));
			}
		} else {
			t_map = null;
		}
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
function treeClick(event, treeId, treeNode, clickFlag) {
	var departid = treeNode.id;
	$("#departid").val(departid);
	$("#departname").val("");//部门名称清空
	$("#departcode").val("");//部门编码清空
	reloadGrid();
}