$(document).ready(function() {
	SelectOption.loadAppType("apptype");//app类型
	var colname = ['主键id','app名称','app版本','app下载路径','app类型 ','app描述','是否发布','发布时间','备注','更新时间', ]; 
	var colmodel = [
					{name:'appid',index:'appid',hidden:true},
					{name:'appname',index:'appname',
						formatter:function(cellvalue, options, obj) { 
							   return '<a href="javascript:void(0);" onclick="display(\''+obj.appid+'\')">'+obj.appname+'</a>';
						}
					},
					{name:'appversion',index:'appversion'},
					{name:'appurl',index:'appurl'},
					{name:'apptype',index:'apptype',
						formatter:function(cellvalue, options, obj) { 
							return SelectOption.getAppType(obj.apptype);
						}
					},
					{name:'appdesc',index:'appdesc'},
					{name:'isonline',index:'isonline',
						formatter:function(cellvalue, options, obj) { 
							return SelectOption.getIsOnLine(obj.isonline);
						}
					},
					{name:'onlinetime',index:'onlinetime',
						formatter:function(cellvalue, options, obj) { 
							return getSmpFormatDateByLong(obj.onlinetime,true);
						}
					},
					{name:'note',index:'note'},
					{name:'updatetime',index:'updatetime',
						formatter:function(cellvalue, options, obj) { 
							return getSmpFormatDateByLong(obj.updatetime,true);
						}
					}
			];
	
	var tableHeight = $(window).height() - $('.pcheck').height() - 190;
	$(window).resize(function(){
		$("#grid-table").jqGrid( 'setGridHeight', $(window).height() - $('.pcheck').height() - 190 );
		$("#grid-table").jqGrid( 'setGridWidth', $(window).width()*0.99 );
	});

    $("#grid-table").jqGrid({
    	height: tableHeight,
    	url : BASE_URL + "/system/sysappversion/list",
		datatype: "json",
		cache : false,
		mtype : 'post',
		colNames:colname,
		colModel:colmodel,
		postData:{
			appversion:$("#appversion").val(),
			apptype:$("#apptype").val()
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
		rowNum:10,
		rowList:[10,20,30],
		altRows: true,
		multiselect: true,
		caption: "app历史版本列表",
		autowidth: true
	});
});

/*加载*/
function reloadGrid(){
	$("#grid-table").jqGrid('setGridParam',{
		page:1,postData:{
			appversion:$("#appversion").val(),
			apptype:$("#apptype").val()
		}
	}).trigger("reloadGrid");
}

/*搜索查询*/
$("#searchBtn").bind("click",function(){
	reloadGrid();
});

/*重置*/
$("#resetBtn").bind("click",function(){
//	$("#searchForm").each(function(){
//		$(this).val("");
//	})
	 $(':input','#searchForm')
     .not(':button,:submit,:reset,:hidden') 
     .val('')
     .removeAttr('checked')

});

/*添加*/
$("#addBtn").on("click", function () {
	parent.openWin(BASE_URL+"/system/sysappversion/add",'添加','65%','75%');
});

/*编辑*/
$("#editBtn").on("click", function () {
	var ids = getSingleIds();
	var rowdata = $("#grid-table").jqGrid('getRowData',ids[0]); //选中的一条记录
	var appid = rowdata.appid;
	parent.openWin(BASE_URL+'/system/sysappversion/edit/'+appid,'编辑','65%','75%');
});

/*详细查询*/
function display(appid){
	parent.openWin(BASE_URL+"/system/sysappversion/display/"+appid,'详细','65%','75%');
}
/*批量删除*/
$("#delBtn").on("click", function () {
	//返回当前grid中复选框所选择的数据的id 
	var ids = getManyIds("请选择需要删除的数据!");
	var appids=[];
	var state = "";
	for(var i=0;i<ids.length;i++){
		var id = ids[i]; 
		//返回指定id行的数据 
		var rowdatas = $("#grid-table").jqGrid('getRowData',id);
		appids[i]= rowdatas.appid;
	}
	var parmJson = appids.toString();
	var param = {"ids":parmJson};
	del(param);
});

/**
 * 值选择一条记录
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
    //弹出提示框
	parent.confirm('确认删除吗?',function(){
		$.ajax({ 
	  		url: BASE_URL+"/system/sysappversion/delete",
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
