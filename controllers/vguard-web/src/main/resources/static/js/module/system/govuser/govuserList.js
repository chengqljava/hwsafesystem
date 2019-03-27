$(document)
		.ready(
				function() {
					// 加载机构树
					//loadOrgTree("orgtree");
					SelectTree.loadOrgByOrgidSelect("organname",{"orgid":$('#orgid').val()});

					var colname = [ '用户id', '账号', '用户名', '用户类型', '所属机构', '最近更新时间' ];
					var colmodel = [
							{
								name : 'USERID',
								index : 'USERID',
								width : '15%',
								align : 'center',
								sortable : false,
								hidden : true
							},
							{
								name : 'USERNAME',
								index : 'USERNAME',
								width : '30%',
								sortable : false,
								align : 'left',
								formatter : function(cellvalue, options, obj) {
									return '<a href="javascript:void(0);" onclick="display(\''
											+ obj.USERID
											+ '\')">'
											+ obj.USERNAME + '</a>';
								}
							},
							{
								name : 'NICKNAME',
								index : 'NICKNAME',
								width : '30%',
								sortable : false,
								align : 'center'
							},
							{
								name : 'USERTYPE',
								index : 'USERTYPE',
								width : '30%',
								sortable : false,
								align : 'center',
								editoptions : {
									value : "SYS:系统;GOV:政府;ENT:企业"
								},
								formatter : 'select'
							},
							{
								name : 'ORGNAME',
								index : 'ORGNAME',
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
								$("#grid-table").jqGrid( 'setGridWidth', $(window).width()*0.99 );
							});

					$("#grid-table").jqGrid({
						height : tableHeight,
						url : BASE_URL + "/system/govuser/list",
						datatype : "json",
						cache : false,
						mtype : 'POST',
						colNames : colname,
						colModel : colmodel,
						postData : {
							nickname : $('#nickname').val(),
							username : $('#username').val(),
							orgid : $('#orgid').val()
							//orgid : $('#organname').attr("selectvalue")
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
						caption : "用户管理",
						autowidth : true
					});
				});

/* 加载 */
function reloadGrid() {
	var orgname;
	if($('#organname').attr("selectvalue")){
		orgname = $('#organname').attr("selectvalue");
	}else{
		orgname = $('#orgid').val();
	}
	$("#grid-table").jqGrid('setGridParam', {
		page : 1,
		postData : {
			nickname : $('#nickname').val(),
			username : $('#username').val(),
			orgid : orgname
		}
	}).trigger("reloadGrid");
}

/* 搜索查询 */
$("#searchbtn").bind("click", function() {
	reloadGrid();
});

/* 重置查询条件 */
$("#resetbtn").bind("click", function() {
	 
	$("#nickname").val("");
	$("#username").val("");
	$("#organname").val("");
	$('#organname').attr("selectvalue","")
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
			var userid = rowdatas.USERID;
			parent.openWin(BASE_URL + '/system/govuser/edit/' + userid, '编辑',
					null, "65%");
		});

/* 角色分配 */
$("#roleBtn").bind(
		"click",
		function() {
			// 返回当前grid中复选框所选择的数据的id
			var ids = $("#grid-table").jqGrid('getGridParam', 'selarrrow');
			if (ids.length != 1) {
				// 弹出提示信息
				parent.toast("请选择一条数据进行角色分配！");
				return;
			}
			// 返回指定id行的数据
			var rowdatas = $("#grid-table").jqGrid('getRowData', ids[0]);
			var userid = rowdatas.USERID;
			var usertype = rowdatas.USERTYPE;
			parent.openWin(BASE_URL + "/system/govuser/userRole/" + userid
					+ "/" + usertype, '用户授权', null, "60%");
		});

/* 添加 */
$("#addBtn").bind("click", function() {
	parent.openWin(BASE_URL + '/system/govuser/add', '添加', null, "65%");
});

/* 密码重置 */
$("#rsetpwdBtn").bind("click", function() {
	// 返回当前grid中复选框所选择的数据的id
	var ids = $("#grid-table").jqGrid('getGridParam', 'selarrrow');
	if (ids.length != 1) {
		// 弹出提示信息
		parent.toast("请选择一条数据进行密码重置！");
		return;
	}
	// 返回指定id行的数据
	var rowdatas = $("#grid-table").jqGrid('getRowData', ids[0]);
	var userid = rowdatas.USERID;
	var param = {
		"userid" : userid.toString()
	};

	// 弹出提示框
	parent.confirm('确认重置密码吗?', function() {
		$.ajax({
			url : BASE_URL + "/system/govuser/resetpwd",
			type : 'post',
			dataType : 'json',
			data : param,
			success : function(json) {
				if (json.success == true) {
					parent.toast(json.msg);
//					reloadGrid();// 刷新列表
				} else {
					parent.toast(json.msg);
				}
			}
		});
	})
});

/* 密码修改 */
$("#setpwdBtn").bind(
		"click",
		function() {
			// 返回当前grid中复选框所选择的数据的id
			var ids = $("#grid-table").jqGrid('getGridParam', 'selarrrow');
			if (ids.length != 1) {
				// 弹出提示信息
				parent.toast("请选择一条数据进行密码修改！");
				return;
			}
			// 返回指定id行的数据
			var rowdatas = $("#grid-table").jqGrid('getRowData', ids[0]);
			var userid = rowdatas.USERID;
			parent.openWin(BASE_URL + '/system/govuser/reset/' + userid,
					'密码修改', "25%", "30%");
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
		userids[i] = rowdatas.USERID;
	}
	var paramJson = userids.toString();
	var param = {
		"ids" : paramJson
	};
	del(param);
});

/* 删除方法 */
function del(param) {
	// 查询是否有关联引用(用户角色、系统日志关联等)
	$.ajax({
		url : BASE_URL + "/system/govuser/loadLinkById",
		type : 'post',
		dataType : 'json',
		data : param,
		success : function(json) {
			if (json.success == false) {
				// 有关联引用
				parent.toast(json.msg);
			} else {
				// 弹出提示框
				parent.confirm('确认删除吗?', function() {
					$.ajax({
						url : BASE_URL + "/system/govuser/delete",
						type : 'post',
						dataType : 'json',
						data : param,
						success : function(json) {
							if (json.success == true) {
								parent.toast(json.msg);
								reloadGrid();// 刷新列表
							} else {
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
	parent.openWin(BASE_URL + '/system/govuser/display/' + userid, '详细', null,
			"70%");
}

/** 机构树 */
function loadOrgTree() {
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
		url : BASE_URL + '/system/sysorg/orgtreeByOrgid',
		data : {
			"orgid" : $("#orgid").val()
		},
		cache : false,
		dataType : 'json',
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

	// 树图标的初始化
	function initTreeMap(map) {
		var t_map = new Array();
		// 遍历子节点
		if (map != null && map.length > 0) {
			var open = false;
			// t_map.push(new
			// Node("-1","","组织机构",true,BASE_URL+"/images/tree/org.png"));//根节点
			for (var i = 0; i < map.length; i++) {
				var icon = "";
				if (map[i].id != -1) {
					icon = BASE_URL + "/images/tree/d_icon_tree1.png";
					var orgid = map[i].id;
					open = true;
				}
				t_map.push(new Node(map[i].id, map[i].pId, map[i].name, open,
						icon));
			}
		} else {
			t_map = null;
		}
		return t_map;
	}

	// 树节点对象
	function Node(id, pId, name, open, icon) {
		this.id = id;
		this.pId = pId;
		this.name = name;
		this.open = open;
		this.icon = icon;
	}
}

/** 点击权限树节点 */
function treeClick(event, treeId, treeNode, clickFlag) {
	var orgid = treeNode.id;
	if (orgid == '-1')
		orgid = '';
	$("#orgid").val(orgid);
	reloadGrid();
}