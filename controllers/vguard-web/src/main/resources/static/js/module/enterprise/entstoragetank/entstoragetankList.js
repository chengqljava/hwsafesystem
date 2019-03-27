$(document)
		.ready(
				function() {
					var colname = [ '储罐id', '储罐名称', '投产日期', '单罐容积(m3)', '罐壁高度(m)', '储存货物', '存放物体形态', '最大储量(t)', 
					                '储罐类型', '储罐材料', '设计压力(kpa)', '设计温度(℃)'];
					var colmodel = [
							{name : 'STOTANKID',index : 'STOTANKID',align : 'center',sortable : false,hidden : true},
							{name : 'STOTANKNAME',index : 'STOTANKNAME',sortable : false,align : 'left'},
							{name:'COMMTIME',index:'COMMTIME',align:'center',
								formatter:function(cellvalue, options, obj) { 
									return getFormatDateByLong(obj.COMMTIME,"yyyy-MM-dd");
								}
							},
							{name : 'CUBAGE',index : 'CUBAGE',sortable : false,align : 'center'},
							{name : 'HEIGHT',index : 'HEIGHT',sortable : false,align : 'center'},
							{name : 'CARGO',index : 'CARGO',sortable : false,align : 'center'},
							{name : 'FORM',index : 'FORM',sortable : false,align : 'center',
								formatter:function(cellvalue, options, obj) { 
									  if(obj.FORM){
										  return SelectOption.getFormState(obj.FORM);
									  }else{
										  return "";
									  }
								}},
							{name : 'MAXRESERVES',index : 'MAXRESERVES',sortable : false,align : 'center'},
							{name : 'STOTANKTYPE',index : 'STOTANKTYPE',sortable : false,align : 'center',
								formatter:function(cellvalue, options, obj) { 
									  if(obj.STOTANKTYPE){
										  return SelectOption.getStotankType(obj.STOTANKTYPE);
									  }else{
										  return "";
									  }
								}},
							{name : 'STOTANKIDMA',index : 'STOTANKIDMA',sortable : false,align : 'center'},
							{name : 'PRESSURE',index : 'PRESSURE',sortable : false,align : 'center'},
							{name : 'TEMPERATURE',index : 'TEMPERATURE',sortable : false,align : 'center'}
							];

					$(window).on(
							'resize.jqGrid',
							function() {
								$("#grid-table").jqGrid('setGridWidth',
										$(window).width() * 0.99);
							})
					$("#grid-table").jqGrid({
						height : 250,
						url : BASE_URL + "/enterprise/entstoragetank/list",
						datatype : "json",
						cache : false,
						mtype : 'POST',
						colNames : colname,
						colModel : colmodel,
						postData : {
							danexclusiveid : $('#danexclusiveid').val()
						},
						sortname : 'STOTANKID',
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
						caption : "储罐",
						multiselect: true,
						autowidth : true,
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
	var stotankid = rowdatas.STOTANKID;
	parent.parent.parent.openWin(BASE_URL + '/enterprise/entstoragetank/edit/' + stotankid, '编辑');
});


/* 添加 */
$("#addBtn").bind("click", function() {
	var danexclusiveid = $("#danexclusiveid").val();
	parent.parent.parent.openWin(BASE_URL + '/enterprise/entstoragetank/add/'+danexclusiveid, '添加');
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

	var stotankid = [];
	for (var i = 0; i < ids.length; i++) {
		var id = ids[i];
		// 返回指定id行的数据
		var rowdatas = $("#grid-table").jqGrid('getRowData', id);
		stotankid[i] = rowdatas.STOTANKID;
	}
	var paramJson = stotankid.toString();
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
	  		url: BASE_URL + "/enterprise/entstoragetank/delete",
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
	parent.parent.parent.openWin(BASE_URL + '/enterprise/entstoragetank/display/' + id, '详细', "60%",
			"70%");
}
