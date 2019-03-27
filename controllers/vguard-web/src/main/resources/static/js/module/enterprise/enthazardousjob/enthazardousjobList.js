$(document)
		.ready(
				function() {
					var colname = [ '危险作业id', '危险作业名称', '存在的风险或可能引发的事故类型', '安全防范措施', '应急救援措施'];
					var colmodel = [
							{name : 'HAZARDJOBID',index : 'HAZARDJOBID',align : 'center',sortable : false,hidden : true},
							{name : 'HAZARDJOBNAME',index : 'HAZARDJOBNAME',sortable : false,align : 'left',
								formatter : function(cellvalue, options, obj) {
									return '<a href="javascript:void(0);" onclick="display(\''
											+ obj.HAZARDJOBID
											+ '\')">'
											+ obj.HAZARDJOBNAME + '</a>';
								}},
							{name : 'RISK',index : 'RISK',sortable : false,align : 'center'},
							{name : 'PRECAUTION',index : 'PRECAUTION',sortable : false,align : 'center'},
							{name : 'MEASURE',index : 'MEASURE',sortable : false,align : 'center'}
							];

					$(window).on(
							'resize.jqGrid',
							function() {
								$("#grid-table").jqGrid('setGridWidth',
										$(window).width() * 0.99);
							})
					$("#grid-table").jqGrid({
						height : 250,
						url : BASE_URL + "/enterprise/enthazardousjob/list",
						datatype : "json",
						cache : false,
						mtype : 'POST',
						colNames : colname,
						colModel : colmodel,
						postData : {
							danexclusiveid : $('#danexclusiveid').val()
						},
						sortname : 'HAZARDJOBID',
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
						caption : "危险作业",
						autowidth : true
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
	var hazardjobid = rowdatas.HAZARDJOBID;
	parent.parent.parent.openWin(BASE_URL + '/enterprise/enthazardousjob/edit/' + hazardjobid, '编辑');
});


/* 添加 */
$("#addBtn").bind("click", function() {
	var danexclusiveid = $('#danexclusiveid').val();
	parent.parent.parent.openWin(BASE_URL + '/enterprise/enthazardousjob/add/'+danexclusiveid, '添加');
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

	var hazardjobid = [];
	for (var i = 0; i < ids.length; i++) {
		var id = ids[i];
		// 返回指定id行的数据
		var rowdatas = $("#grid-table").jqGrid('getRowData', id);
		hazardjobid[i] = rowdatas.HAZARDJOBID;
	}
	var paramJson = hazardjobid.toString();
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
	  		url: BASE_URL + "/enterprise/enthazardousjob/delete",
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
	parent.parent.parent.openWin(BASE_URL + '/enterprise/enthazardousjob/display/' + id, '详细');
}