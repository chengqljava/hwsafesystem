$(function() {
					var colname = [ '用户id', '账号', '用户名', '用户类型', '所属机构', '最近更新时间' ];
					var colmodel = [
							{
								name : 'USERID',
								index : 'USERID',
								width : '15%',
								align : 'center',
								sortable : false,
								hidden : true
							},
							{
								name : 'USERNAME',
								index : 'USERNAME',
								width : '30%',
								sortable : false,
								align : 'left'
							},
							{
								name : 'NICKNAME',
								index : 'NICKNAME',
								width : '30%',
								sortable : false,
								align : 'center'
							},
							{
								name : 'USERTYPE',
								index : 'USERTYPE',
								width : '30%',
								sortable : false,
								align : 'center',
								editoptions : {
									value : "SYS:系统;GOV:政府;ENT:企业"
								},
								formatter : 'select'
							},
							{
								name : 'ORGNAME',
								index : 'ORGNAME',
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
								$("#grid-table").jqGrid( 'setGridWidth', $(window).width()*0.99 );
							});

					$("#grid-table").jqGrid({
						height : tableHeight,
						url : BASE_URL + "/system/govuser/list",
						datatype : "json",
						cache : false,
						mtype : 'POST',
						colNames : colname,
						colModel : colmodel,
						postData : {
							nickname : $('#nickname').val(),
							username : $('#username').val(),
							orgid : $('#orgid').val()
							//orgid : $('#organname').attr("selectvalue")
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
						caption : "用户管理",
						autowidth : true
					});
});

/* 加载 */
function reloadGrid() {
	var orgname;
	if($('#organname').attr("selectvalue")){
		orgname = $('#organname').attr("selectvalue");
	}else{
		orgname = $('#orgid').val();
	}
	$("#grid-table").jqGrid('setGridParam', {
		page : 1,
		postData : {
			nickname : $('#nickname').val(),
			username : $('#username').val(),
			orgid : orgname
		}
	}).trigger("reloadGrid");
}

/* 搜索查询 */
$("#searchbtn").bind("click", function() {
	reloadGrid();
});

/* 重置查询条件 */
$("#resetbtn").bind("click", function() {
	 
	$("#nickname").val("");
	$("#username").val("");
	$("#organname").val("");
	$('#organname').attr("selectvalue","")
});

/**
 * 选择接收人员
 */
$("#selUsernameBtn").off("click").on("click", function(){
	// 返回当前grid中复选框所选择的数据的id
    var curSelRowArr = $("#grid-table").jqGrid("getGridParam", "selarrrow");
    if (0 == curSelRowArr.length) {
        // 弹出提示信息
        parent.toast("请至少选择一个短信的接收者！");
        return;
    }
    var useridArr = [];
    var usernameArr = [];
    for (var i = 0; i < curSelRowArr.length; i++) {
    	var curRowDataObj = $("#grid-table").jqGrid("getRowData", curSelRowArr[i]);
		useridArr.push(curRowDataObj.USERID);
        usernameArr.push(curRowDataObj.USERNAME);
    }

    //给父窗口中企业赋值方法
    var index = parent.getParentIndex();
	parent.frames["layui-layer-iframe"+index].setUserNameInfo({
		"userid": useridArr.join(','),
		"userName": usernameArr.join(',')
	});
    parent.closeWin();
});