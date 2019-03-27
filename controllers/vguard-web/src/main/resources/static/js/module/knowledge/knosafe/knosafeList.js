$(document).ready(function() {
	var colname = ['主键ID','标题','文号','颁布机构','实施时间','操作']; 
	
	var colmodel = [
					{name:'KNOSAFID',index:'KNOSAFID',hidden:true},
					{name:'NAME',index:'NAME',align:'left',
						formatter:function(cellvalue, options, obj) { 
							   return '<a href="javascript:void(0);" onclick="display(\''+obj.KNOSAFID+'\',\''+obj.NAME+'\')">'+obj.NAME+'</a>';
						}
						},
					{name:'REGISTERCODE',index:'REGISTERCODE',align:'left'},
					{name:'ISSUEANENCY',index:'ISSUEANENCY',align:'left'},
					{name:'EFFECTTIME',index:'EFFECTTIME',align:'left'},
					{name:'FILETYPE',index:'FILETYPE',align:'left'}
				];
	
	var tableHeight = $(window).height() - $('.pcheck').height() - 190 -33;
	$(window).resize(function(){
		$("#grid-table").jqGrid( 'setGridHeight', $(window).height() - $('.pcheck').height() - 190 -33 );
		$("#grid-table").jqGrid( 'setGridWidth', $(window).width() - 96 );
	});

    $("#grid-table").jqGrid({
    	height: tableHeight,
    	width: $(window).width() - 96,
    	url : BASE_URL + "/knowledge/knosafe/list",
		datatype: "json",
		cache : false,
		mtype : 'post',
		colNames:colname,
		colModel:colmodel,
		postData:{
			safeType : $('#safeType').val(),
			name : $('#name').val(),
			registercode : $('#registercode').val(),
			issueanency : $('#issueanency').val()
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
		caption: "安全知识列表",
		//autowidth: true
	});
});

/*加载*/
function reloadGrid(){
	$("#grid-table").jqGrid('setGridParam',{
		page:1,postData:{
			safeType : $('#safeType').val(),
			name : $('#name').val(),
			registercode : $('#registercode').val(),
			issueanency : $('#issueanency').val()
/*			probenum:$("#probenum").val(),
			probename:$("#probename").val(),
			probegroup:$("#probegroup").val(),
			entname:$("#entname").val(),
			hostname:$("#hostname").val()*/
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

/*添加*/
$("#addBtn").on("click", function () {
	var safeType = $("#safeType").val();
	parent.openWin(BASE_URL+"/knowledge/knosafe/add/" + safeType,'添加','65%','65%');
});

/*编辑*/
$("#editBtn").on("click", function () {
	var ids = getSingleIds();
	var rowdata = $("#grid-table").jqGrid('getRowData',ids[0]); //选中的一条记录
	var PROBEID = rowdata.PROBEID;
	parent.openWin(BASE_URL+'/monitor/macprobe/edit/'+PROBEID,'编辑','65%','65%');
});

/*下载*/
$("#dowLoaBtn").on("click", function(){
	var ids = getSingleIds();
	var rowdata = $("#grid-table").jqGrid('getRowData',ids[0]); //选中的一条记录
	var KNOSAFID = rowdata.KNOSAFID;
	window.location.href = BASE_URL+"/knowledge/knosafe/download/"+KNOSAFID;
});


/*详细查询*/
function display(KNOSAFID){
	parent.openWin(BASE_URL+"/knowledge/knosafe/display/"+KNOSAFID,'详细','65%','65%');
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
		knosafids[i]= rowdatas.KNOSAFID;
	}
	var parmJson = knosafids.toString();
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
	  		url: BASE_URL+"/knowledge/knosafe/delete",
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
