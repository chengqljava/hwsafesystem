$(document).ready(function() {
	var colname = ['编号','用品名称','发放人','发放时间','发放数量','收件人','最近更新时间',"操作"]; 
	var colmodel = [
					{name:'GRANTID',index:'GRANTID', width:'5%',hidden:true},
					{name:'LABORNAME',index:'LABORNAME', width:'5%',align:'center',sortable : false,
						formatter:function(cellvalue, options, obj) { 
                            return '<a href="javascript:void(0);" onclick="display(\''+obj.GRANTID+'\')">'+obj.LABORNAME+'</a>';
                        }
					},
					{name:'GRANTNAME',index:'GRANTNAME', width:'10%', align:'center'},
					{name:'GRANTTIME',index:'GRANTTIME', width:'5%', align:'center',
						formatter : function(cellvalue, options, obj) {
							return getFormatDateByLong(obj.GRANTTIME,
									"yyyy-MM-dd");
						}
					},
					{name:'NUM',index:'NUM', width:'10%', align:'center'},
					{name:'RECIPIENT',index:'RECIPIENT', width:'10%', align:'center'},
					{name:'UPDATETIME',index:'UPDATETIME', width:'5%', align:'center',
						formatter : function(cellvalue, options, obj) {
							return getFormatDateByLong(obj.UPDATETIME,"yyyy-MM-dd hh:mm:ss");
						}
					},
            		{name:'OPERATION',index:"OPERATION",width:'80px',fixed:true,align:"left",formatter:function(cellvalue, options, obj){
            			return '<a href="javascript:void(0);" title="编辑" class="operation editInfoBtn" onclick="editInfo(\''+obj.GRANTID+'\')">编辑</a><br>'
            			     + '<a href="javascript:void(0);" title="删除" class="operation delInfoBtn" onclick="delInfo(\''+obj.GRANTID+'\')">删除</a>'
            		}}
			     ];
	
	var tableHeight = $(window).height() - $('.pcheck').height() - 190 -33 - 20;
	$(window).resize(function(){
		$("#grid-table").jqGrid( 'setGridHeight', $(window).height() - $('.pcheck').height() - 190 -33 - 20 );
		$("#grid-table").jqGrid( 'setGridWidth', $(window).width() - 96 );
	});

    $("#grid-table").jqGrid({
    	height: tableHeight,
    	url : BASE_URL + "/health/ochlaborgrant/list",
		datatype: "json",
		cache : false,
		mtype : 'post',
		colNames:colname,
		colModel:colmodel,
		postData:{
			recipient:$("#recipient").val(),
			granttime:$("#granttime").val(),
			laborid:$("#laborid").val()
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
		caption: "劳动用品发放列表",
		autowidth: true,
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
//编辑
function editInfo(grantid) {
	parent.openWin(BASE_URL+'/health/ochlaborgrant/edit/'+grantid,'编辑','50%','40%');
}
// 删除
function delInfo(grantid) {
	var param = {"ids":grantid};
	del(param);
}
/*加载*/
function reloadGrid(){
	$("#grid-table").jqGrid('setGridParam',{
		page:1,postData:{
			recipient:$("#recipient").val(),
			granttime:$("#granttime").val(),
			laborid:$("#laborid").val()
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
	});
});

/*添加*/
$("#addBtn").on("click", function () {
	var laborid = $("#laborid").val();
	parent.openWin(BASE_URL+"/health/ochlaborgrant/add/"+laborid,'添加','50%','40%');
});

/*编辑*/
$("#editBtn").on("click", function () {
	var ids = getSingleIds();
	var rowdata = $("#grid-table").jqGrid('getRowData',ids[0]); //选中的一条记录
	var grantid = rowdata.GRANTID;
	parent.openWin(BASE_URL+'/health/ochlaborgrant/edit/'+grantid,'编辑','50%','40%');
});

/*详细查询*/
function display(grantid){
	parent.openWin(BASE_URL+"/health/ochlaborgrant/display/"+grantid,'详细','50%','40%');
}

/*批量删除*/
$("#delBtn").on("click", function () {
	//返回当前grid中复选框所选择的数据的id 
	var ids = getManyIds("请选择需要删除的数据!");
	var grantids=[];
	var state = "";
	for (var i = 0; i < ids.length; i++) {
		var id = ids[i]; 
		//返回指定id行的数据 
		var rowdatas = $("#grid-table").jqGrid('getRowData',id);
		grantids[i]= rowdatas.GRANTID;
	}
	var parmJson = grantids.toString();
	var param = {"ids":parmJson};
	del(param);
});



/*删除方法*/
function del(param){
    //弹出提示框
	parent.confirm('确认删除吗?',function(){
		$.ajax({ 
	  		url: BASE_URL+"/health/ochlaborgrant/delete",
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

/**
 * 选择一条记录
 */
$("#submitbtn").on("click",function(){
	
	var expertIds = [];
	var rowData, expertId;
	
	var ids = $("#grid-table").jqGrid('getGridParam','selarrrow');
	if(ids.length < 1){
		// 弹出提示信息
		parent.toast("请选择至少一条记录！");
		return;
	}
	
	for(var i = 0; i < ids.length; i++){
		rowData = $("#grid-table").jqGrid('getRowData', ids[i]); //选中的一条记录
		expertId = rowData.EXPERTID;
		expertIds.push(expertId);
	}
	
	save(expertIds + '');
	
});

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