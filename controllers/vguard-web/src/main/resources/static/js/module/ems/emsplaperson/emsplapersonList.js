$(document).ready(function() {
	
	var colname = ['主键id', '人员id', '姓名', '所属部门', '职务', '手机', '联系电话']; 
	
	var colmodel = [
					{name: 'PLAPERID',index: 'PLAPERID', width: '5%', hidden: true},
					{name: 'ORGANPRESONID',index: 'ORGANPRESONID', width: '5%', hidden: true},
					{name: 'NAME',index: 'NAME', formatter : function(cellvalue, options, obj) {
						return "<a href = 'javascript:void(0)' onclick='display(\""+obj.ORGANPRESONID+"\")'>"+obj.NAME+"</a>";
					}, width: '5%'},
					{name: 'DEPARTNAME',index: 'DEPARTNAME', width: '5%'},
					{name: 'GROUPDUTY',index: 'GROUPDUTY', width: '5%'},
					{name: 'CELLPHONE',index: 'CELLPHONE', width: '5%'},
					{name: 'PRIVATETEL',index: 'PRIVATETEL', width: '5%'}
			];
	
	var tableHeight = $(window).height() - $('.pcheck').height() - 190 -33;
	$(window).resize(function(){
		$("#grid-table").jqGrid( 'setGridHeight', $(window).height() - $('.pcheck').height() - 190 -33 );
		$("#grid-table").jqGrid( 'setGridWidth', $(window).width()*0.99 );
	});
	
	var searchParamJson = {planid : $('#planId').val()};
	
	var searchParam = {"searchParamJson" : JSON.stringify(searchParamJson)};	

    $("#grid-table").jqGrid({
    	height: tableHeight,
    	url : BASE_URL + "/ems/emsplaperson/list",
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
		multiselect: true,
		caption: "通讯簿列表",
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
			if($(window).width() < 700) {
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


/*添加*/
$("#addBtn").on("click", function () {
	parent.openWin(BASE_URL + "/ems/emsresdepartpreson/select?businessId=" + $('#planId').val(), '添加','100%','70%');
});

/*详细查询*/
function display(teamid){
	parent.openWin(BASE_URL+"/ems/emsresteam/display/" + teamid,'详细','65%','75%');
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
		teamids[i]= rowdatas.PLAPERID;
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
	  		url: BASE_URL+"/ems/emsplaperson/delete",
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
