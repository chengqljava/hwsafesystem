$(document)
		.ready(
				function() {
					var colname = [ '部门id', '部门名称', '部门编码', '负责人', '最近更新时间' ];
					var colmodel = [
							{
								name : 'DEPARTID',
								index : 'DEPARTID',
								width : '15%',
								align : 'center',
								sortable : false,
								hidden : true
							},
							{
								name : 'DEPARTNAME',
								index : 'DEPARTNAME',
								width : '30%',
								sortable : false,
								align : 'left',
								formatter : function(cellvalue, options, obj) {
									return '<a href="javascript:void(0);" onclick="display(\''
											+ obj.DEPARTID
											+ '\')">'
											+ obj.DEPARTNAME + '</a>';
								}
							},
							{
								name : 'DEPARTCODE',
								index : 'DEPARTCODE',
								width : '30%',
								sortable : false,
								align : 'center'
							},
							{
								name : 'PRINCIPAL',
								index : 'PRINCIPAL',
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
						$("#grid-table").jqGrid( 'setGridWidth', $(window).width()*0.86 );
					});

					$("#grid-table").jqGrid({
						height : tableHeight,
						url : BASE_URL + "/system/sysdepart/list",
						datatype : "json",
						cache : false,
						mtype : 'POST',
						colNames : colname,
						colModel : colmodel,
						postData : {
							departname : $('#departname').val(),
							departcode : $('#departcode').val(),
							departid : $('#departid').val()
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
						caption : "部门列表",
						autowidth : true
					});
				});

/* 加载 */
function reloadGrid() {
	$("#grid-table").jqGrid('setGridParam', {
		page : 1,
		postData : {
			departname : $('#departname').val(),
			departcode : $('#departcode').val(),
			departid : $('#departid').val()
		}
	}).trigger("reloadGrid");
}

/* 搜索查询 */
$("#searchBtn").bind("click", function() {
	reloadGrid();
});
/*重置*/
$("#resetBtn").bind("click",function(){
	$("#departname").val("");
	$("#departcode").val("");
});


/* 详细查询 */
function display(userid) {
	parent.openWin(BASE_URL + '/system/sysdepart/display/' + userid, '详细',
			null, "45%");
}
