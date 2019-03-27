var rowid;
$(document)
		.ready(
				function() {
					var colname = [ '库区id', '危险化学品仓库名称', '位置', '面积(㎡)或容积(m3)', '存放物体形态', '主要存放物品及数量', '备注'];
					var colmodel = [
							{name : 'WAREHOUSEID',index : 'WAREHOUSEID',align : 'center',sortable : false,hidden : true},
							{name : 'WAREHOUSENAME',index : 'WAREHOUSENAME',sortable : false,align : 'left'},
							{name : 'LOCATION',index : 'LOCATION',sortable : false,align : 'center'},
							{name : 'AREAVOLUME',index : 'AREAVOLUME',sortable : false,align : 'center'},
							{name : 'FORM',index : 'FORM',sortable : false,align : 'center',
								formatter:function(cellvalue, options, obj) { 
									  if(obj.FORM){
										  return SelectOption.getFormState(obj.FORM);
									  }else{
										  return "";
									  }
								}},
							{name : 'ARTICLEQUAN',index : 'ARTICLEQUAN',sortable : false,align : 'center'},
							{name : 'NOTES',index : 'NOTES',width : 200,sortable : false}
							];

					$(window).on(
							'resize.jqGrid',
							function() {
								$("#grid-table").jqGrid('setGridWidth',
										$(window).width() * 0.99);
							})
					var lastsel;
					$("#grid-table").jqGrid({
						height : 250,
						url : BASE_URL + "/enterprise/entwarehouse/list",
						datatype : "json",
						cache : false,
						mtype : 'POST',
						colNames : colname,
						colModel : colmodel,
						postData : {
							danexclusiveid : $('#danexclusiveid').val()
						},
						sortname : 'WAREHOUSEID',
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
						caption : "库区",
						multiselect: true,
						autowidth : true,
					});
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
	var warehouseid = rowdatas.WAREHOUSEID;
	parent.parent.parent.openWin(BASE_URL + '/enterprise/entwarehouse/edit/' + warehouseid, '编辑');
});


/* 添加 */
$("#addBtn").bind("click", function() {
	var danexclusiveid = $("#danexclusiveid").val();
	parent.parent.parent.openWin(BASE_URL + '/enterprise/entwarehouse/add/'+danexclusiveid, '添加');
});

/* 批量删除 */
$("#delBtn").bind("click", function() {
	// 返回当前grid中复选框所选择的数据的id
	var ids = $("#grid-table").jqGrid('getGridParam', 'selarrrow');
	if (ids.length == 0) {
		// 弹出提示信息
		parent.parent.parent.toast("请选择需要删除的数据！");
		return;
	}

	var warehouseid = [];
	for (var i = 0; i < ids.length; i++) {
		var id = ids[i];
		// 返回指定id行的数据
		var rowdatas = $("#grid-table").jqGrid('getRowData', id);
		warehouseid[i] = rowdatas.WAREHOUSEID;
	}
	var paramJson = warehouseid.toString();
	var param = {
		"ids" : paramJson
	};
	del(param);
});

/* 删除方法 */
function del(param) {
	//弹出提示框
	parent.parent.parent.confirm('确认删除吗?',function(){
		$.ajax({ 
	  		url: BASE_URL + "/enterprise/entwarehouse/delete",
	  		type:'post',
	  		dataType:'json',
	  		data:param,
	  		success: function(json){
	  			if(json.success==true){
	  				parent.parent.parent.toast(json.msg);
					reloadGrid();// 刷新列表
	  			}else{
	  				parent.parent.parent.toast(json.msg);
	  			}
	  		}
		 });
	})
}

/* 加载 */
function reloadGrid() {
	$("#grid-table").jqGrid('setGridParam', {
		page : 1,
		postData : {
			danexclusiveid : $('#danexclusiveid').val()
		}
	}).trigger("reloadGrid");
}

/* 详细查询 */
function display(id) {
	parent.parent.parent.openWin(BASE_URL + '/enterprise/entwarehouse/display/' + id, '详细', "60%",
			"70%");
}
