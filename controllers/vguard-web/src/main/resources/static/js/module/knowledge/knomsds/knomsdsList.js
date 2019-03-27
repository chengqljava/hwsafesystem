$(document)
		.ready(
				function() {
					var colname = [ 'MSDSID', '品名', '别名', '英文名' , 'CAS', 'UN'];
					var colmodel = [
							{name : 'MSDSID',index : 'MSDSID',align : 'center',sortable : false,hidden : true},
							{name : 'CHNAME',index : 'CHNAME',sortable : false,align : 'left',
								formatter : function(cellvalue, options, obj) {
									return '<a href="javascript:void(0);" onclick="display(\''
											+ obj.MSDSID
											+ '\')">'
											+ obj.CHNAME + '</a>';
								}},
							{name : 'ANOTHERNAME',index : 'ANOTHERNAME',sortable : false,align : 'center'},
							{name : 'ENNAME',index : 'ENNAME',sortable : false,align : 'center'},
							{name : 'CASNO',index : 'CASNO',sortable : false,align : 'center'},
							{name : 'UNNO',index : 'UNNO',sortable : false,align : 'center'}
							];

					var tableHeight = $(window).height() - $('.pcheck').height() - 190 -33;
					$(window).resize(function(){
						$("#grid-table").jqGrid( 'setGridHeight', $(window).height() - $('.pcheck').height() - 190 -33 );
						$("#grid-table").jqGrid( 'setGridWidth', $(window).width() - 96 );
					});
					$("#grid-table").jqGrid({
						height : tableHeight,
						url : BASE_URL + "/knowledge/knomsds/list",
						datatype : "json",
						cache : false,
						mtype : 'POST',
						colNames : colname,
						colModel : colmodel,
						postData : {
							chname : $('#chname').val(),
							casno : $('#casno').val(),
							unno : $('#unno').val()
						},
						sortname : 'MSDSID',
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
						caption : "MSDS",
						//autowidth : true,
						loadComplete: function() {
							if($(window).width() < 700) {
								$('.ui-jqgrid-htable').css({"width":"900"});
								$("#grid-table").css({"width":"900"});
								$("#grid-table").closest(".ui-jqgrid-bdiv").css({ "overflow-x" : "scroll","height":"350"});
								$(".ui-jqgrid-hdiv").css({ "overflow-x" : "scroll"});
							} else {
								$("#grid-table").jqGrid( 'setGridWidth', $(window).width() - 96 );
							}
						}
					});
				});




/* 删除方法 */
function del(param) {
	//弹出提示框
	parent.parent.parent.confirm('确认删除吗?',function(){
		$.ajax({ 
	  		url: BASE_URL + "/knowledge/knomsds/delete",
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

/* 搜索查询 */
$("#searchbtn").bind("click", function() {
	reloadGrid();
});

/* 加载 */
function reloadGrid() {
	$("#grid-table").jqGrid('setGridParam', {
		page : 1,
		postData : {
			chname : $('#chname').val(),
			casno : $('#casno').val(),
			unno : $('#unno').val()
		}
	}).trigger("reloadGrid");
}

/* 详细查询 */
function display(id) {
	parent.parent.parent.openWin(BASE_URL + '/knowledge/knomsds/display/' + id, '详细', "65%",
			"75%");
}