$(document)
		.ready(
				function() {
					var colname = [ '危险化工工艺目录id', '危险化工工艺名称', '反应类型', '重点监控单元', '宜采用的控制方式'];
					var colmodel = [
							{name : 'DCPCATALOGID',index : 'DCPCATALOGID',align : 'center',sortable : false,hidden : true},
							{name : 'DANCHEPRONAME',index : 'DANCHEPRONAME',sortable : false,align : 'left',
								formatter : function(cellvalue, options, obj) {
									return '<a href="javascript:void(0);" onclick="display(\''
											+ obj.DCPCATALOGID
											+ '\')">'
											+ obj.DANCHEPRONAME + '</a>';
								}},
							{name : 'REACTIONTYPE',index : 'REACTIONTYPE',sortable : false,align : 'center'},
							{name : 'MONITORINGUNIT',index : 'MONITORINGUNIT',sortable : false,align : 'center'},
							{name : 'CONTROLMODE',index : 'CONTROLMODE',sortable : false,align : 'center'}
							];

					$(window).on(
							'resize.jqGrid',
							function() {
								$("#grid-table").jqGrid('setGridWidth',
										$(window).width() * 0.99);
							})
					$("#grid-table").jqGrid({
						height : 250,
						url : BASE_URL + "/enterprise/sysdancheprocatalog/list",
						datatype : "json",
						cache : false,
						mtype : 'POST',
						colNames : colname,
						colModel : colmodel,
						postData : {
							danexclusiveid : $('#danexclusiveid').val()
						},
						sortname : 'DCPCATALOGID',
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
	parent.parent.parent.openWin(BASE_URL + '/enterprise/sysdancheprocatalog/display/' + id, '详细', "60%",
			"70%");
}

/*目录*/
$("#conBtn").on("click", function () {
	var ids = $("#grid-table").jqGrid('getGridParam','selarrrow');
	if(ids.length !=1){
		// 弹出提示信息
		parent.toast("请选择一条记录！");
		return;
	}
	var rowdata = $("#grid-table").jqGrid('getRowData',ids[0]); //选中的一条记录
	var dcpcatalogid = rowdata.DCPCATALOGID;
	
	//危化品基础信息id
	var danexclusiveid = $("#danexclusiveid").val();
	//危险化工工艺信息id
	var dancheproid = $("#dancheproid").val();

	window.location = BASE_URL + "/enterprise/entdanchepro/catalog?dcpcatalogid="+dcpcatalogid+"&danexclusiveid="+danexclusiveid+"&dancheproid="+dancheproid, '添加';
});
