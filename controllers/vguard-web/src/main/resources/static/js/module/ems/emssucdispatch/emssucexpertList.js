$(document).ready(function() {
	
	var colname = ['主键id', '专家id', '姓名', '专家类别', '办公电话', '手机', '工作单位']; 
	
	var colmodel = [
					{name: 'PLAEXPID',index: 'PLAEXPID', width: '5%', hidden: true},
					{name: 'EXPERTID',index: 'EXPERTID', width: '5%', hidden: true},
					{name: 'NAME',index: 'NAME', formatter : function(cellvalue, options, obj) {
						return "<a href = 'javascript:void(0)' onclick='display(\""+obj.EXPERTID+"\")'>"+obj.NAME+"</a>";
					}, width: '5%'},					
					{name: 'TYPENAME',index: 'TYPENAME', width: '5%'},
					{name: 'OFFICETEL',index: 'OFFICETEL', width: '5%'},
					{name: 'PHONE',index: 'PHONE', width: '5%'},
					{name: 'ORGNAME',index: 'ORGNAME', width: '5%'}
			];
	
	$(window).resize(function(){
		$("#grid-table").jqGrid( 'setGridWidth', $(window).width()*0.99 );
	});
	
	var searchParamJson = {planid : $('#planId').val()};
	
	var searchParam = {"searchParamJson" : JSON.stringify(searchParamJson)};	

    $("#grid-table").jqGrid({
    	height: 250,
    	url : BASE_URL + "/ems/emsplaexpert/list",
		datatype: "json",
		cache : false,
		mtype : 'post',
		colNames:colname,
		colModel:colmodel,
		postData : searchParam,
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
		rownumbers:true,
		rownumWidth:40,
		scroll: true,
		//multiselect: true,
		//caption: "专家名单列表",
		autowidth: true,
		onSelectRow: function(id) { //单击选择行
            var isselected = $("#isselected").val();
            if(isselected){
                var rowdatas = $("#grid-table").jqGrid('getRowData',id);
                window.top.GEventObject.fireEvent('LOAD_ENT_EVENT',rowdatas);
                parent.closeWin();
            }
        },
        loadComplete: function() {
			if($(window).width() < 400) {
				$('.ui-jqgrid-htable').css({"width":"900"});
				$("#grid-table").css({"width":"900"});
				$("#grid-table").closest(".ui-jqgrid-bdiv").css({ "overflow-x" : "scroll","height":"350"});
				$(".ui-jqgrid-hdiv").css({ "overflow-x" : "scroll"});
			} else {
				$("#grid-table").jqGrid( 'setGridWidth', $(window).width()*0.99 );
			}
		}
	});
});

/*加载*/
function reloadGrid(){
	
	var searchParamJson = {planid : $('#planId').val()};
	
	var searchParam = {"searchParamJson" : JSON.stringify(searchParamJson)};
	
	$("#grid-table").jqGrid('setGridParam',{
		page : 1,
		postData : searchParam
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
	parent.openWin(BASE_URL + "/ems/emsresexpert/select?businessId=" + $('#planId').val(), '添加','65%','75%')
});

/*详细查询*/
function display(expertid){
	parent.openWin(BASE_URL+"/ems/emsresexpert/display/" + expertid,'详细','65%','75%');
}

/*批量删除*/
$("#delBtn").on("click", function () {
	//返回当前grid中复选框所选择的数据的id 
	var ids = getManyIds("请选择需要删除的数据!");
	var teamids=[];
	var state = "";
	for(var i=0;i<ids.length;i++){
		var id = ids[i]; 
		//返回指定id行的数据 
		var rowdatas = $("#grid-table").jqGrid('getRowData',id);
		teamids[i]= rowdatas.PLAEXPID;
	}
	var parmJson = teamids.toString();
	var param = {ids : parmJson, planId : $('#planId').val()};
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
	  		url: BASE_URL+"/ems/emsplaexpert/delete",
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

/*搜索查询*/
$("#searchBtn").bind("click",function(){
	reloadGrid();
});

/*重置*/
$("#resetBtn").bind("click",function(){
	$("#searchForm").find("input,select").each(function(){
		$(this).val("");
	});
});




