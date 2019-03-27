$(document)
		.ready(
				function() {
					var colname = [ '化工装置id', '化工装置名称', '装置产品', '建设规模', '所在企业名称', '许可证编号', '许可证有效期', '建成投用时间'];
					var colmodel = [
							{name : 'CHEENGDEVID',index : 'CHEENGDEVID',align : 'center',sortable : false,hidden : true},
							{name : 'CHEENGDEVNAME',index : 'CHEENGDEVNAME',sortable : false,align : 'left',
								formatter : function(cellvalue, options, obj) {
									return '<a href="javascript:void(0);" onclick="display(\''
											+ obj.CHEENGDEVID
											+ '\')">'
											+ obj.CHEENGDEVNAME + '</a>';
								}},
							{name : 'DEVICEPRO',index : 'DEVICEPRO',sortable : false,align : 'center'},
							{name : 'CONSTRUCSCALE',index : 'CONSTRUCSCALE',sortable : false,align : 'center'},
							{name : 'ENTNAME',index : 'ENTNAME',sortable : false,align : 'center'},
							{name : 'PERMITNO',index : 'PERMITNO',sortable : false,align : 'center'},
							{name : 'PERMITVALIDITY',index : 'PERMITVALIDITY',sortable : false,align : 'center',
								formatter : function(cellvalue, options, obj) {
									return getFormatDateByLong(obj.PERMITVALIDITY,
											"yyyy-MM-dd");
								}},
							{name : 'USETIME',index : 'USETIME',sortable : false,align : 'center',
								formatter : function(cellvalue, options, obj) {
									return getFormatDateByLong(obj.USETIME,
											"yyyy-MM-dd");
								}
							}];

					$(window).on(
							'resize.jqGrid',
							function() {
								$("#grid-table").jqGrid('setGridWidth',
										$(window).width() * 0.99);
							})
					$("#grid-table").jqGrid({
						height : 250,
						url : BASE_URL + "/enterprise/entcheengdevice/list",
						datatype : "json",
						cache : false,
						mtype : 'POST',
						colNames : colname,
						colModel : colmodel,
						postData : {
							danexclusiveid : $('#danexclusiveid').val()
						},
						sortname : 'CHEENGDEVID',
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
						caption : "化工装置",
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
	var cheengdevid = rowdatas.CHEENGDEVID;
	var danexclusiveid = $("#danexclusiveid").val();
	parent.parent.parent.openWin(BASE_URL + '/enterprise/entcheengdevice/edit/' + cheengdevid+'/'+danexclusiveid, '编辑', "60%", "75%");
});


/* 添加 */
$("#addBtn").bind("click", function() {
	var danexclusiveid = $("#danexclusiveid").val();
	parent.parent.parent.openWin(BASE_URL + '/enterprise/entcheengdevice/add/'+danexclusiveid, '添加', "60%", "75%");
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

	var cheengdevid = [];
	for (var i = 0; i < ids.length; i++) {
		var id = ids[i];
		// 返回指定id行的数据
		var rowdatas = $("#grid-table").jqGrid('getRowData', id);
		cheengdevid[i] = rowdatas.CHEENGDEVID;
	}
	var paramJson = cheengdevid.toString();
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
	  		url: BASE_URL + "/enterprise/entcheengdevice/delete",
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
	var danexclusiveid = $("#danexclusiveid").val();
	parent.parent.parent.openWin(BASE_URL + '/enterprise/entcheengdevice/display/' + id+'/'+danexclusiveid, '详细', "60%",
			"70%");
}