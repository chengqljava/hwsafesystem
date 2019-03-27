$(document).ready(function() {
	initSeachInput();
	var colname = ['主键ID','标题','发送人','发送时间','发送人邮件','接收人','接收人邮件']; 
	
	var colmodel = [
					{name:'SMSID',index:'SMSID',hidden:true},
					{name:'TITLE',index:'TITLE',align:'left',
						formatter:function(cellvalue, options, obj) { 
							   return '<a href="javascript:void(0);" onclick="display(\''+obj.SMSID+'\',\''+obj.TITLE+'\')">'+obj.TITLE+'</a>';
						}
					},
					{name:'SENDER',index:'SENDER',align:'left'},
					{name:'TIME',index:'TIME',align:'left',
						formatter : function(cellvalue, options, obj) {
							return getFormatDateByLong(obj.TIME,
									"yyyy-MM-dd");
						}
					},
					{name:'SENDERNU',index:'SENDERNU',align:'left'},
					{name:'RECEIVER',index:'RECEIVER',align:'left'},
					{name:'RECEIVENU',index:'RECEIVENU',align:'left'}
					
					];
	
	var tableHeight = $(window).height() - $('.pcheck').height() - 190 -33;
	$(window).resize(function(){
		$("#grid-table").jqGrid( 'setGridHeight', $(window).height() - $('.pcheck').height() - 190 -33 );
		$("#grid-table").jqGrid( 'setGridWidth', $(window).width()*0.99 );
	});

    $("#grid-table").jqGrid({
    	height: tableHeight,
    	url : BASE_URL + "/political/iesmail/list",
		datatype: "json",
		cache : false,
		mtype : 'post',
		colNames:colname,
		colModel:colmodel,
		postData:{
			title : $('#title').val(),
			datatype : $('#datatype').val()
			
		},
		sortname : 'TIME',
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
			title : $('#title').val(),
			datatype : $('#datatype').val()
		}
	}).trigger("reloadGrid");
}

function resetData(){
    $("#title").val("");
}

function seach(){
	 reloadGrid();
}

/*搜索查询*/
/*$("#searchbtn").bind("click",function(){
	reloadGrid();
});

重置
$("#resetbtn").bind("click",function(){
	$("#searchForm").each(function(){
		$(this).val("");
	})
});*/

/*添加*/
$("#addBtn").on("click", function () {
	parent.openWin(BASE_URL+"/political/iesmail/add/" + $('#datatype').val(),'添加','65%','65%');
});

/*编辑*/
$("#editBtn").on("click", function () {
	
	var ids = getSingleIds();
	var rowdata = $("#grid-table").jqGrid('getRowData',ids[0]); //选中的一条记录
	var smsid = rowdata.SMSID;
	var datatype = $('#datatype').val();
	parent.openWin(BASE_URL+'/political/iesmail/edit/'+smsid+'/'+datatype,'编辑','65%','65%');
});


/*详细查询*/
function display(SMSID){
	parent.openWin(BASE_URL+"/political/iesmail/display/"+SMSID,'详细','65%','65%');
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
		knosafids[i]= rowdatas.SMSID;
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
	  		url: BASE_URL+"/political/iesmail/delete",
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
