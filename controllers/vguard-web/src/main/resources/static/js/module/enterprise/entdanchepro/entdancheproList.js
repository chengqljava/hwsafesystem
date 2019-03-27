$(document)
		.ready(
				function() {
					var colname = [ '危险化工工艺id', '危险化工工艺名称', '控制方式', '控制参数', '控制措施', '是否满足国家规定的控制要求'];
					var colmodel = [
							{name : 'DANCHEPROID',index : 'DANCHEPROID',align : 'center',sortable : false,hidden : true},
							{name : 'DANCHEPRONAME',index : 'DANCHEPRONAME',sortable : false,align : 'left'},
							{name : 'CONTROLMODE',index : 'CONTROLMODE',sortable : false,align : 'center'},
							{name : 'EMPHASISPARAM',index : 'EMPHASISPARAM',sortable : false,align : 'center'},
							{name : 'SECURITYCONTROL',index : 'SECURITYCONTROL',sortable : false,align : 'center'},
							{name : 'CONTROLREQUIRE',index : 'CONTROLREQUIRE',sortable : false,align : 'center',
								editoptions : {
									value : "1:是;0:否"
								},formatter : 'select'}
							];

					$(window).on(
							'resize.jqGrid',
							function() {
								$("#grid-table").jqGrid('setGridWidth',
										$(window).width() * 0.99);
							})
					$("#grid-table").jqGrid({
						height : 250,
						url : BASE_URL + "/enterprise/entdanchepro/list",
						datatype : "json",
						cache : false,
						mtype : 'POST',
						colNames : colname,
						colModel : colmodel,
						postData : {
							danexclusiveid : $('#danexclusiveid').val()
						},
						sortname : 'DANCHEPROID',
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
						caption : "危险化工工艺",
						multiselect: true,
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
	var dancheproid = rowdatas.DANCHEPROID;
	parent.parent.parent.openWin(BASE_URL + '/enterprise/entdanchepro/edit/' + dancheproid, '编辑' ,'55%','58%');
});


/* 添加 */
$("#addBtn").bind("click", function() {
	var danexclusiveid = $("#danexclusiveid").val();
	parent.parent.parent.openWin(BASE_URL + '/enterprise/entdanchepro/add/'+danexclusiveid, '添加' ,'55%','58%');
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

	var dancheproid = [];
	for (var i = 0; i < ids.length; i++) {
		var id = ids[i];
		// 返回指定id行的数据
		var rowdatas = $("#grid-table").jqGrid('getRowData', id);
		dancheproid[i] = rowdatas.DANCHEPROID;
	}
	var paramJson = dancheproid.toString();
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
	  		url: BASE_URL + "/enterprise/entdanchepro/delete",
	  		type:'post',
	  		dataType:'json',
	  		data:param,
	  		success: function(json){
	  			if(json.success==true){
	  				parent.parent.parent.toast(json.msg);
					reloadGrid();// 刷新列表
	  			}else{
	  				parent.toast(json.msg);
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
	parent.parent.parent.openWin(BASE_URL + '/enterprise/entdanchepro/display/' + id, '详细', "60%",
			"70%");
}
