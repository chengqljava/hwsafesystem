$(document)
		.ready(
				function() {
					var colname = [ '危化品id', 'UN号', '品名', '别名', '类别和项别', '最大储存量'
					                , '是否重点监管危化品', '是否易制毒'
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
							{name : 'DANGERTYPENAME',index : 'DANGERTYPENAME',sortable : false,align : 'center'},
							{name : 'LARGERESERVES',index : 'LARGERESERVES',sortable : false,align : 'center'},
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
							supervision: '1' //重点监管危化品
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
						caption : "重点监管危化品",
						autowidth : true
					});
				});


/* 加载 */
function reloadGrid() {
	$("#grid-table").jqGrid('setGridParam', {
		page : 1,
		postData : {
			danexclusiveid : $('#danexclusiveid').val(),
			supervision: '1'
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