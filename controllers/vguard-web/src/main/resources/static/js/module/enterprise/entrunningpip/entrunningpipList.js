$(document)
		.ready(
				function() {
					var colname = [ '管道id', '管道名称', '产权单位', '使用单位', '运行状态', '安装竣工日期', '投用日期', '填表日期'];
					var colmodel = [
							{name : 'RUNNPIPID',index : 'RUNNPIPID',align : 'center',sortable : false,hidden : true},
							{name : 'RUNNPIPNAME',index : 'RUNNPIPNAME',sortable : false,align : 'left',
								formatter : function(cellvalue, options, obj) {
									return '<a href="javascript:void(0);" onclick="display(\''
											+ obj.RUNNPIPID
											+ '\')">'
											+ obj.RUNNPIPNAME + '</a>';
								}},
							{name : 'PROPUNIT',index : 'PROPUNIT',sortable : false,align : 'center'},
							{name : 'USEUNIT',index : 'USEUNIT',sortable : false,align : 'center'},
							{name : 'RUNSTATUS',index : 'RUNSTATUS',sortable : false,align : 'center'},
							{name : 'INSTALLDATE',index : 'INSTALLDATE',sortable : false,align : 'center',
								formatter : function(cellvalue, options, obj) {
									return getFormatDateByLong(obj.INSTALLDATE,
											"yyyy-MM-dd hh:mm:ss");
								}},
							{name : 'USEDATE',index : 'USEDATE',sortable : false,align : 'center',
								formatter : function(cellvalue, options, obj) {
									return getFormatDateByLong(obj.USEDATE,
											"yyyy-MM-dd hh:mm:ss");
								}},
							{name : 'FILLINGDATE',index : 'FILLINGDATE',sortable : false,align : 'center',
								formatter : function(cellvalue, options, obj) {
									return getFormatDateByLong(obj.FILLINGDATE,
											"yyyy-MM-dd hh:mm:ss");
								}}
							];

					$(window).on(
							'resize.jqGrid',
							function() {
								$("#grid-table").jqGrid('setGridWidth',
										$(window).width() * 0.99);
							})
					$("#grid-table").jqGrid({
						height : 250,
						url : BASE_URL + "/enterprise/entrunningpip/list",
						datatype : "json",
						cache : false,
						mtype : 'POST',
						colNames : colname,
						colModel : colmodel,
						postData : {
							danexclusiveid : $('#danexclusiveid').val()
						},
						sortname : 'RUNNPIPID',
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
						caption : "输送管道",
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
	var id = rowdatas.RUNNPIPID;
	parent.parent.parent.openWin(BASE_URL + '/enterprise/entrunningpip/edit/' + id, '编辑', "65%", "75%");
});


/* 添加 */
$("#addBtn").bind("click", function() {
	var danexclusiveid = $('#danexclusiveid').val()
	parent.parent.parent.openWin(BASE_URL + '/enterprise/entrunningpip/add/'+danexclusiveid, '添加', "65%", "75%");
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

	var runnpipid = [];
	for (var i = 0; i < ids.length; i++) {
		var id = ids[i];
		// 返回指定id行的数据
		var rowdatas = $("#grid-table").jqGrid('getRowData', id);
		runnpipid[i] = rowdatas.RUNNPIPID;
	}
	var paramJson = runnpipid.toString();
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
	  		url: BASE_URL + "/enterprise/entrunningpip/delete",
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
	parent.parent.parent.openWin(BASE_URL + '/enterprise/entrunningpip/display/' + id, '详细', "65%",
			"75%");
}