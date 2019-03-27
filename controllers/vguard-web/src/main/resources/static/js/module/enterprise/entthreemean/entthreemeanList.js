$(document)
		.ready(
				function() {
					var colname = [ '三同时id', '项目名称', '建设单位', '项目类别', '项目开始时间', '项目结束时间', '总投资(万元)', '项目状态'];
					var colmodel = [
							{name : 'THREEMEANID',index : 'THREEMEANID',align : 'center',sortable : false,hidden : true},
							{name : 'PROJECTNAME',index : 'PROJECTNAME',sortable : false,align : 'left',
								formatter : function(cellvalue, options, obj) {
									return '<a href="javascript:void(0);" onclick="display(\''
											+ obj.THREEMEANID
											+ '\')">'
											+ obj.PROJECTNAME + '</a>';
								}},
							{name : 'ENTNAME',index : 'ENTNAME',sortable : false,align : 'center'},
							{name : 'PROJECTTYPE',index : 'PROJECTTYPE',sortable : false,align : 'center',
								editoptions : {
									value : "1:新建;2:改建;3:扩建"
								},
								formatter : 'select'},
							{name : 'STARTTIME',index : 'STARTTIME',sortable : false,align : 'center',
								formatter : function(cellvalue, options, obj) {
									return getFormatDateByLong(obj.STARTTIME,
											"yyyy-MM-dd");
								}},
							{name : 'ENTTIME',index : 'ENTTIME',sortable : false,align : 'center',
								formatter : function(cellvalue, options, obj) {
									return getFormatDateByLong(obj.STARTTIME,
											"yyyy-MM-dd");
								}},
							{name : 'TOTALINVEST',index : 'TOTALINVEST',sortable : false,align : 'center'},
							{name : 'PROJECTSTATE',index : 'PROJECTSTATE',sortable : false,align : 'center',
								editoptions : {
									value : "1:建设中;2:建设完成"
								},
								formatter : 'select'}
							];

					$(window).on(
							'resize.jqGrid',
							function() {
								$("#grid-table").jqGrid('setGridWidth',
										$(window).width() * 0.99);
							})
					$("#grid-table").jqGrid({
						height : 250,
						url : BASE_URL + "/enterprise/entthreemean/list",
						datatype : "json",
						cache : false,
						mtype : 'POST',
						colNames : colname,
						colModel : colmodel,
						postData : {
							danexclusiveid : $('#danexclusiveid').val()
						},
						sortname : 'THREEMEANID',
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
						caption : "三同时",
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
	var threemeanid = rowdatas.THREEMEANID;
	parent.parent.parent.openWin(BASE_URL + '/enterprise/entthreemean/edit/' + threemeanid, '编辑',"60%","75%");
});


/* 添加 */
$("#addBtn").bind("click", function() {
	var danexclusiveid = $("#danexclusiveid").val();
	parent.parent.parent.openWin(BASE_URL + '/enterprise/entthreemean/add/'+danexclusiveid, '添加',"60%","75%");
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

	var threemeanid = [];
	for (var i = 0; i < ids.length; i++) {
		var id = ids[i];
		// 返回指定id行的数据
		var rowdatas = $("#grid-table").jqGrid('getRowData', id);
		threemeanid[i] = rowdatas.THREEMEANID;
	}
	var paramJson = threemeanid.toString();
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
	  		url: BASE_URL + "/enterprise/entthreemean/delete",
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
	parent.parent.parent.openWin(BASE_URL + '/enterprise/entthreemean/display/' + id, '详细', "60%",
			"75%");
}