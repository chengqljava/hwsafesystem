$(document).ready(function() {
	
	var colname = ['主键','编号','章节','内容','最近更新时间','描述']; 
	var colmodel = [
					{name:'ELEMENTID',index:'ELEMENTID', width:'5%',hidden:true},
					{name:'ELEMENTNUM',index:'ELEMENTNUM', width:'5%',align:'center',sortable : false,
						formatter:function(cellvalue, options, obj) { 
                            return '<a href="javascript:void(0);" onclick="display(\''+obj.ELEMENTID+'\')">'+obj.ELEMENTNUM+'</a>';
                        }
					},
					{name:'ELEMENTNAME',index:'ELEMENTNAME', width:'5%', align:'left',sortable : false,
						formatter:function(cellvalue, options, obj) { 
							return obj.PARENTID == null ? obj.ELEMENTNAME : "";
                        }},
					{name:'ELEMENTNAME',index:'ELEMENTNAME', width:'5%', align:'left',sortable : false,
						formatter:function(cellvalue, options, obj) { 
							return obj.PARENTID != null ? obj.ELEMENTNAME : "";
                        }},
                    {name : 'UPDATETIME',index : 'UPDATETIME',width : '5%',align : 'center',
						formatter : function(cellvalue, options, obj) {
							return getFormatDateByLong(obj.UPDATETIME,
									"yyyy-MM-dd hh:mm:ss");
						}
					},
					{name:'NOTES',index:'NOTES', width:'5%', align:'center',sortable : false}
			     ];
	
	var tableHeight = $(window).height() - $('.pcheck').height() - 190 -33;
	$(window).resize(function(){
		$("#grid-table").jqGrid( 'setGridHeight', $(window).height() - $('.pcheck').height() - 190 -33 );
		$("#grid-table").jqGrid( 'setGridWidth', $(window).width()*0.99 );
	});

    $("#grid-table").jqGrid({
    	height: tableHeight,
    	url : BASE_URL + "/ems/emsplaelement/list",
		datatype: "json",
		cache : false,
		mtype : 'post',
		colNames:colname,
		colModel:colmodel,
		postData:{
			templateid:$("#templateid").val()
		},
		sortname : 'ELEMENTNUM',
		viewrecords : true,
		pager : "#grid-pager",
		jsonReader : {
			root : "datas",
			total : "total",
			page : "page",
			records : "records",
			repeatitems : false
		},
		rowNum:10,
		rowList:[10,20,30],
		altRows: true,
		multiselect: true,
		caption: "模板元素列表",
		autowidth: true,
		loadComplete: function() {
			if($(window).width() < 700) {
				$('.ui-jqgrid-htable').css({"width":"900"});
				$("#grid-table").css({"width":"900"});
				$("#grid-table").closest(".ui-jqgrid-bdiv").css({ "overflow-x" : "scroll","height":"350"});
				$(".ui-jqgrid-hdiv").css({ "overflow-x" : "scroll"});
				$(".table-line .tableTitle").find("button").css({"margin-right":"0px","margin-top":"7px"});
			} else {
				$("#grid-table").jqGrid( 'setGridWidth', $(window).width()*0.99 );
			}
		}
	});
});

/*加载*/
function reloadGrid(){
	$("#grid-table").jqGrid('setGridParam',{
		page:1,postData:{
			templateid:$("#templateid").val()
		}
	}).trigger("reloadGrid");
}

/*添加*/
$("#addBtn").on("click", function () {
	var templateid = $("#templateid").val();
	parent.openWin(BASE_URL+"/ems/emsplaelement/add/"+templateid,'添加','55%','45%');
});

/*编辑*/
$("#editBtn").on("click", function () {
	var ids = getSingleIds();
	var rowdata = $("#grid-table").jqGrid('getRowData',ids[0]); //选中的一条记录
	var elementid = rowdata.ELEMENTID;
	parent.openWin(BASE_URL+'/ems/emsplaelement/edit/'+elementid,'编辑','55%','45%');
});


/*详细查询*/
function display(elementid){
	parent.openWin(BASE_URL+"/ems/emsplaelement/display/"+elementid,'详细','55%','45%');
}

/*批量删除*/
$("#delBtn").on("click", function () {
	//返回当前grid中复选框所选择的数据的id 
	var ids = getManyIds("请选择需要删除的数据!");
	var elementids=[];
	var state = "";
	for (var i = 0; i < ids.length; i++) {
		var id = ids[i]; 
		//返回指定id行的数据 
		var rowdatas = $("#grid-table").jqGrid('getRowData',id);
		elementids[i]= rowdatas.ELEMENTID;
	}
	var parmJson = elementids.toString();
	var param = {"ids":parmJson};
	del(param);
});

/**
 * 只选择一条记录
 * @returns
 * @author lzqiang
 * @date 2016年7月7日 下午4:43:15
 */
function getSingleIds(){
	var ids = $("#grid-table").jqGrid('getGridParam','selarrrow');
	if(ids.length !=1){
		// 弹出提示信息
		parent.toast("请选择一条记录！");
		return;
	}
	return ids;
}
/**
 * 获取多条记录id
 * @param message
 * @returns
 * @author lzqiang
 * @date 2016年7月7日 下午4:45:13
 */
function getManyIds(message){
	var ids = $("#grid-table").jqGrid('getGridParam','selarrrow');
	if(ids.length==0){
		// 弹出提示信息
		parent.toast(message);
		return;
	}
	return ids;
}
/*删除方法*/
function del(param){
	// 查询是否有关联引用(预案元素信息等)
	$.ajax({
		url : BASE_URL + "/ems/emsplaelement/loadcontentbyid",
		type : 'post',
		dataType : 'json',
		data : param,
		success : function(json) {
			if (json.success == false) {
				// 有关联引用
				parent.toast(json.msg);
			} else {
				//弹出提示框
  				parent.confirm('确认删除吗?',function(){
					$.ajax({ 
				  		url: BASE_URL+"/ems/emsplaelement/delete",
				  		type:'post',
				  		dataType:'json',
				  		data:param,
				  		success: function(json){
				  			if(json.success==true){
				  				parent.toast(json.msg);
				  				reloadGrid();//刷新列表
				  			}else{
				  				parent.toast(json.msg);
				  			}
				  		}
					 });
  				});
			}
		}
	});
	
}


