$(document).ready(function() {
	var colname = ['主键ID','标题','文号','颁布机构','实施时间','上传附件名']; 
	
	var colmodel = [
					{name:'LAWID',index:'LAWID',hidden:true},
					{name:'LAWNAME',index:'LAWNAME',align:'left',
						formatter:function(cellvalue, options, obj) { 
							   return '<a href="javascript:void(0);" onclick="display(\''+obj.LAWID+'\',\''+obj.LAWNAME+'\')">'+obj.LAWNAME+'</a>';
						}
						},
					{name:'LAWREGCODE',index:'LAWREGCODE',align:'left'},
					{name:'LAWISSCY',index:'LAWISSCY',align:'left'},
					{name:'LAWEFFECTTIME',index:'LAWEFFECTTIME',align:'left',
						formatter : function(cellvalue, options, obj) {
							return getFormatDateByLong(obj.LAWEFFECTTIME,
									"yyyy-MM-dd");
						}
					},
					{name:'ATTACHNAME',index:'ATTACHNAME',align:'left'
					}
				];
	
	var tableHeight = $(window).height() - $('.pcheck').height() - 190 -33;
	$(window).resize(function(){
		$("#grid-table").jqGrid( 'setGridHeight', $(window).height() - $('.pcheck').height() - 190 -33 );
		$("#grid-table").jqGrid( 'setGridWidth', $(window).width() - 96 );
	});

    $("#grid-table").jqGrid({
    	height: tableHeight,
    	url : BASE_URL + "/knowledge/knolaw/list",
		datatype: "json",
		cache : false,
		mtype : 'post',
		colNames:colname,
		colModel:colmodel,
		postData:{
			datatype: $('#datatype').val(),
			lawname : $('#lawname').val(),
			lawregcode : $('#lawregcode').val(),
			//LAWEFFECTTIME: $('#LAWEFFECTTIME').val(),
			lawisscy : $('#lawisscy').val()
		},
		sortname : 'LAWEFFECTTIME',
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
		rowNum:10,
		rowList:[10,20,30],
		altRows: true,
		multiselect: true,
		caption: "信息列表",
		//autowidth: true,
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

/*加载*/
function reloadGrid(){
	$("#grid-table").jqGrid('setGridParam',{
		page:1,postData:{
			datatype: $('#datatype').val(),
			lawname : $('#lawname').val(),
			lawregcode : $('#lawregcode').val(),
			
			lawisscy : $('#lawisscy').val()
			//LAWEFFECTTIME: $('#LAWEFFECTTIME').val(),
		}
	}).trigger("reloadGrid");
}



/*搜索查询*/
$("#searchbtn").bind("click",function(){
	reloadGrid();
});

/*重置*/
$("#resetbtn").bind("click",function(){
	$("#searchForm").each(function(){
		$(this).val("");
	})
});


/*详细查询*/
function display(LAWID){
	parent.openWin(BASE_URL+"/knowledge/knolaw/display/"+LAWID,'详细','65%','65%');
}

/*批量删除*/
$("#delBtn").on("click", function () {
	//返回当前grid中复选框所选择的数据的id 
	var ids = getManyIds("请选择需要删除的数据!");
	var knosafids=[];
	var state = "";
	for(var i=0;i<ids.length;i++){
		var id = ids[i]; 
		//返回指定id行的数据 
		var rowdatas = $("#grid-table").jqGrid('getRowData',id);
		knosafids[i]= rowdatas.LAWID;
	}
	var parmJson = knosafids.toString();
	var param = {"ids":parmJson};
	del(param);
});

/**
 * 值选择一条记录
 * @returns
 * @author wangss
 * @date 
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
    //弹出提示框
	parent.confirm('确认删除吗?',function(){
		$.ajax({ 
	  		url: BASE_URL+"/knowledge/knolaw/delete",
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
	})
}
