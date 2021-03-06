$(document)
		.ready(
				function() {
					var colname = [ '危化品id', 'UN号', '品名', '别名', 'CAS号', '类别和项别', '最大储存量'
					                , '当前储存量', '储存场所', '储存方式', '是否重点监管危化品', '是否易制毒'
					                , '是否易制爆', '是否剧毒', 'MSDS'];
					var colmodel = [
							{name : 'CHEMICALID',index : 'CHEMICALID',align : 'center',sortable : false,hidden : true},
							{name : 'UN',index : 'UN',sortable : false,align : 'left'},
							{name : 'CHEMCATALNAME',index : 'CHEMCATALNAME',sortable : false,align : 'center',
								formatter : function(cellvalue, options, obj) {
									return '<a href="javascript:void(0);" onclick="display(\''
											+ obj.CHEMICALID
											+ '\')">'
											+ obj.CHEMCATALNAME + '</a>';
								}},
							{name : 'ALIAS',index : 'ALIAS',sortable : false,align : 'center'},
							{name : 'CAS',index : 'CAS',sortable : false,align : 'center'},
							{name : 'DANGERTYPENAME',index : 'DANGERTYPENAME',sortable : false,align : 'center'},
							{name : 'LARGERESERVES',index : 'LARGERESERVES',sortable : false,align : 'center'},
							{name : 'PRERESERVES',index : 'PRERESERVES',sortable : false,align : 'center'},
							{name : 'RESERVESITE',index : 'RESERVESITE',sortable : false,align : 'center',
								formatter : function(cellvalue, options, obj) {
									return SelectOption.getReserveSite(obj.RESERVESITE);
								}
							},
							{name : 'RESERVEWAY',index : 'RESERVEWAY',sortable : false,align : 'center',
								formatter : function(cellvalue, options, obj) {
									return SelectOption.getReserveWay(obj.RESERVEWAY);
								}
							},
							{name : 'SUPERVISION',index : 'SUPERVISION',sortable : false,align : 'center',
								editoptions : {
									value : "1:是;0:否"
								},formatter : 'select'
							},
							{name : 'EASYPOISON',index : 'EASYPOISON',sortable : false,align : 'center',
								editoptions : {
									value : "0:否;1:是;"
								},formatter : 'select'
							},
							{name : 'HIGHLYTOXIC',index : 'HIGHLYTOXIC',sortable : false,align : 'center',
								editoptions : {
									value : "0:否;1:是;"
								},formatter : 'select'
							},
							{name : 'EASYEXPLOSION',index : 'EASYEXPLOSION',sortable : false,align : 'center',
								editoptions : {
									value : "0:否;1:是;"
								},formatter : 'select'
							},
							{name : 'MSDS',index : 'MSDS',sortable : false,align : 'center',
								formatter:function(cellvalue, options, obj) { 
									if(obj.MSDS=="true"){
										return '<a href="javascript:void(0);" onclick="gotoMSDS(\''+obj.CAS+'\',\''+obj.UN+'\')">进入</a>';
									}else{
										return '';
									}
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
						url : BASE_URL + "/enterprise/entdanchemical/list",
						datatype : "json",
						cache : false,
						mtype : 'POST',
						colNames : colname,
						colModel : colmodel,
						postData : {
							danexclusiveid : $('#danexclusiveid').val(),
							supervision : ''
						},
						sortname : 'CHEMICALID',
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
						caption : "危险化学品",
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
	var chemicalid = rowdatas.CHEMICALID;
	parent.parent.parent.openWin(BASE_URL + '/enterprise/entdanchemical/edit/' + chemicalid, '编辑',"55%","65%");
});


/* 添加 */
$("#addBtn").bind("click", function() {
	var danexclusiveid = $('#danexclusiveid').val();
	parent.parent.parent.openWin(BASE_URL + '/enterprise/entdanchemical/addpage/'+danexclusiveid, '添加',"55%","65%");
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

	var userids = [];
	for (var i = 0; i < ids.length; i++) {
		var id = ids[i];
		// 返回指定id行的数据
		var rowdatas = $("#grid-table").jqGrid('getRowData', id);
		userids[i] = rowdatas.CHEMICALID;
	}
	var paramJson = userids.toString();
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
	  		url: BASE_URL + "/enterprise/entdanchemical/delete",
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
			danexclusiveid : $('#danexclusiveid').val(),
			supervision : ''
		}
	}).trigger("reloadGrid");
}

/* 详细查询 */
function display(id) {
	parent.parent.parent.openWin(BASE_URL + '/enterprise/entdanchemical/display/' + id, '详细');
}

/*MSDS*/
function gotoMSDS(cas,un){
	parent.parent.parent.openWin(BASE_URL + "/knowledge/knomsds/chemsds?casno="+cas+"&unno="+un, '详细', "65%", "75%");
}
