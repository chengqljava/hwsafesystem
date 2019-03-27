$(document).ready(
		function() {

			var colname = [ '主键id', '企业名称', '地址', '负责人', '联系电话', '抄送部门',
					'更新时间', '录入人', '备注' ];
			var colmodel = [
					{
						name : 'ENTID',
						index : 'ENTID',
						width : '5%',
						hidden : true
					},
					{
						name : 'ENTNAME',
						index : 'ENTNAME',
						width : '20%',
						align : 'left'
					},
					{
						name : 'ENTADDRESS',
						index : 'ENTADDRESS',
						width : '20%',
						align : 'left'
					},
					{
						name : 'LEADERNAME',
						index : 'LEADERNAME',
						width : '15%',
						align : 'left'
					},
					{
						name : 'LEADERPHONE',
						index : 'LEADERPHONE',
						width : '10%',
						align : 'left'
					},
					{
						name : 'COPYOFORG',
						index : 'COPYOFORG',
						width : '10%',
						align : 'left'
					},
					{
						name : 'UPDATETIME',
						index : 'UPDATETIME',
						width : '10%',
						align : 'left',
						formatter : function(cellvalue, options, obj) {
							return getFormatDateByLong(obj.UPDATETIME,
									"yyyy-MM-dd hh:mm:ss");
						}
					}, {
						name : 'createusername',
						index : 'createusername',
						width : '10%',
						align : 'left'
					}, {
						name : 'NOTES',
						index : 'NOTES',
						width : '10%',
						align : 'left'
					} ];

			var tableHeight = $(window).height() - $('.pcheck').height() - 190;
			$(window).resize(
					function() {
						$("#grid-table").jqGrid(
								'setGridHeight',
								$(window).height() - $('.pcheck').height()
										- 190);
						$("#grid-table").jqGrid('setGridWidth',
								$(window).width() * 0.99);
					});
			$("#grid-table").jqGrid(
					{
						height : tableHeight,
						url : BASE_URL + "/enterprise/entnobusiness/list",
						datatype : "json",
						cache : false,
						mtype : 'post',
						colNames : colname,
						colModel : colmodel,
						postData : {

						},
						sortname : 'updatetime',
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
						caption : "企业信息抄送记录",
						autowidth : true,
						loadComplete : function() {
							if ($(window).width() < 700) {
								$('.ui-jqgrid-htable').css({
									"width" : "900"
								});
								$("#grid-table").css({
									"width" : "900"
								});
								$("#grid-table").closest(".ui-jqgrid-bdiv")
										.css({
											"overflow-x" : "scroll"
										});
								$(".ui-jqgrid-hdiv").css({
									"overflow-x" : "scroll"
								});
							} else {
								$("#grid-table").jqGrid('setGridWidth',
										$(window).width() * 0.99);
							}
						}
					});
		});

/* 加载行政区域 */
function searchDistrict(districtid) {
	$("#districtid").val(districtid);
	reloadGrid();
}

/* 加载 */
function reloadGrid(districtcode, districtname) {
	$("#grid-table").jqGrid('setGridParam', {
		page : 1,
		postData : {

		}
	}).trigger("reloadGrid");
}

/* 搜索查询 */
$("#searchBtn").bind("click", function() {
	reloadGrid();
});

/* 重置 */
$("#resetBtn").bind("click", function() {
	$("#entname").val("");
	$("#chemicaltype").val("");
	$("#chemicaltype_select").val("");
});

/* 添加 */
$("#addBtn").bind("click", function() {
	parent.openWin(BASE_URL + '/enterprise/entnobusiness/add', '添加');
});

/* 编辑 */
$("#editBtn").bind("click", function() {
	// 返回当前grid中复选框所选择的数据的id
	var ids = $("#grid-table").jqGrid('getGridParam', 'selarrrow');
	if (ids.length != 1) {
		// 弹出提示信息
		parent.parent.parent.toast("请选择一条数据进行编辑！");
		return;
	}
	// 返回指定id行的数据
	var rowdatas = $("#grid-table").jqGrid('getRowData', ids[0]);
	var entid = rowdatas.ENTID;
	parent.openWin(BASE_URL + '/enterprise/entnobusiness/edit/' + entid, '编辑');
});

/* 批量删除 */
$("#delBtn").on("click", function() {
	// 返回当前grid中复选框所选择的数据的id
	var ids = $("#grid-table").jqGrid('getGridParam', 'selarrrow');
	if (ids.length == 0) {
		// 弹出提示信息
		parent.toast("请选择需要删除的数据！");
		return;
	}

	var entids = [];
	for (var i = 0; i < ids.length; i++) {
		var id = ids[i];
		// 返回指定id行的数据
		var rowdatas = $("#grid-table").jqGrid('getRowData', id);
		entids[i] = rowdatas.ENTID;
	}
	var parmJson = entids.toString();
	var param = {
		"ids" : parmJson
	};
	del(param);
});

/* 删除方法 */
function del(param) {

	// 弹出提示框
	parent.confirm("确认删除吗?", function() {
		$.ajax({
			url : BASE_URL + "/enterprise/entnobusiness/delete",
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
	});
}
