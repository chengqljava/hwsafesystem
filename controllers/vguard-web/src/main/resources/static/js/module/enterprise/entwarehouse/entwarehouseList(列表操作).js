var rowid;
$(document)
		.ready(
				function() {
					var colname = [ '库区id', '危险化学品仓库名称', '位置', '面积(㎡)或容积(m3)', '存放物体形态', '主要存放物品及数量', '备注', '操作'];
					var colmodel = [
							{name : 'WAREHOUSEID',index : 'WAREHOUSEID',align : 'center',sortable : false,hidden : true,editable : true},
							{name : 'WAREHOUSENAME',index : 'WAREHOUSENAME',sortable : false,align : 'left',editable : true,editoptions : {size : "20",maxlength : "50"}},
							{name : 'LOCATION',index : 'LOCATION',sortable : false,align : 'center',editable : true},
							{name : 'AREAVOLUME',index : 'AREAVOLUME',sortable : false,align : 'center',editable : true},
							{name : 'FORM',index : 'FORM',sortable : false,align : 'center',editable : true,edittype : "select",editoptions : {value : "1:固体;2:液体;3:气体"}},
							{name : 'ARTICLEQUAN',index : 'ARTICLEQUAN',sortable : false,align : 'center',editable : true,editoptions : {size : "20",maxlength : "50"}},
							{name : 'NOTES',index : 'NOTES',width : 200,sortable : false,editable : true,edittype : "textarea",editoptions : {rows : "2",cols : "10"}} ,
							{name:'commands',index:'commands',sortable:false,align:'center'}
							];

					$(window).on(
							'resize.jqGrid',
							function() {
								$("#grid-table").jqGrid('setGridWidth',
										$(window).width() * 0.99);
							})
					var lastsel;
					$("#grid-table").jqGrid({
						height : 250,
						url : BASE_URL + "/enterprise/entwarehouse/list",
						datatype : "json",
						cache : false,
						mtype : 'POST',
						colNames : colname,
						colModel : colmodel,
						postData : {
							danexclusiveid : $('#danexclusiveid').val()
						},
						sortname : 'WAREHOUSEID',
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
						caption : "库区",
						autowidth : true,
						loadComplete : function() { 
							var ids = jQuery("#grid-table").jqGrid('getDataIDs'); 
							for(var i=0; i<ids.length; i++){
								var id = ids[i]; 
								del = "<input type='button' value='删除行' onclick='delrow("+id+")' />"
										//设置自定义按钮
								jQuery("#grid-table").jqGrid('setRowData', ids[i], { commands : del});  
							}
							
							addrow();
						},
						onSelectRow : function(id) { 
							if (id && id !== lastsel) { 
								$('#grid-table').jqGrid('saveRow', lastsel); 
								$('#grid-table').jqGrid('editRow', id, true); 
								lastsel = id; 
							}
						}
						//,editurl:BASE_URL+"/enterprise/entwarehouse/save"
					});
				});




/* 批量删除 */
$("#delBtn").bind("click", function() {
	// 返回当前grid中复选框所选择的数据的id
	var ids = $("#grid-table").jqGrid('getGridParam', 'selarrrow');
	if (ids.length == 0) {
		// 弹出提示信息
		parent.toast("请选择需要删除的数据！");
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
	parent.confirm('确认删除吗?',function(){
		$.ajax({ 
	  		url: BASE_URL + "/enterprise/entwarehouse/delete",
	  		type:'post',
	  		dataType:'json',
	  		data:param,
	  		success: function(json){
	  			if(json.success==true){
		  			parent.toast(json.msg);
					reloadGrid();// 刷新列表
	  			}else{
	  				parent.toast(json.msg);
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

/* 添加行 */
function addrow(){
	/*if (rowid) {
		rowid = rowid + 1;
	}else{
		rowid = id+1;
	}
	jQuery("#grid-table").jqGrid('addRowData', rowid, {commands : "<input type='button' value='删除行' onclick='delrow("+rowid+")' />"});
	
	*/
	var ids = jQuery("#grid-table").jqGrid('getDataIDs'); 
	console.log(ids.length);
	jQuery("#grid-table").jqGrid('addRowData', ids.length+1, 
			{commands : "<input type='button' value='增加行' onclick='delrow("+ids.length+1+")' />"});
	
}
/*删除行*/
function delrow(id){
	jQuery("#grid-table").jqGrid('delRowData', id);
}

