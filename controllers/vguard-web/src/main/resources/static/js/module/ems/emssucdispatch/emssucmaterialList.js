$(document).ready(function() {
	
	var colname = ['主键id', '物资id', '物资设备编号', '物资设备名称', '规格型号', '物资设备类别', '所属单位', '存放场所', '数量']; 
	
	var colmodel = [
					{name: 'PLAMATID',index: 'PLAMATID', width: '5%', hidden: true},
					{name: 'EMSMATERIALID',index: 'EMSMATERIALID', width: '5%', hidden: true},
					{name: 'MATERIALNUM',index: 'MATERIALNUM', width: '5%'},
					{name: 'MATERIALNAME',index: 'MATERIALNAME', formatter : function(cellvalue, options, obj) {
						return "<a href = 'javascript:void(0)' onclick='display(\""+obj.EMSMATERIALID+"\")'>"+obj.MATERIALNAME+"</a>";
					}, width: '5%'},
					{name: 'MODEL',index: 'MODEL', width: '5%'},
					{name: 'EQUIPTYPEMINNAME',index: 'EQUIPTYPEMINNAME', width: '5%'},
					{name: 'ORGNAME',index: 'ORGNAME', width: '5%'},
					{name: 'STOADDRESS',index: 'STOADDRESS', width: '5%'},
					{name: 'NUM',index: 'NUM', width: '5%'}
			];
	
	$(window).resize(function(){
		$("#grid-table").jqGrid( 'setGridWidth', $(window).width()*0.99 );
	});
	
	var searchParamJson = {planid : $('#planId').val()};
	
	var searchParam = {"searchParamJson" : JSON.stringify(searchParamJson)};	

    $("#grid-table").jqGrid({
    	height: 250,
    	url : BASE_URL + "/ems/emsplamaterial/list",
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
		//caption: "救援设施列表",
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


/*添加*/
$("#addBtn").on("click", function () {
	parent.openWin(BASE_URL + "/ems/emsresmaterial/select?businessId=" + $('#planId').val(), '添加','95%','75%')
});

/*详细查询*/
function display(emsmaterialid){
	parent.openWin(BASE_URL+"/ems/emsresmaterial/display/" + emsmaterialid + "/null" ,'详细','65%','75%');
}

/*批量删除*/
$("#delBtn").on("click", function () {
	//返回当前grid中复选框所选择的数据的id 
	var ids = getManyIds("请选择需要删除的数据!");
	var plaMatIds = [];
	var state = "";
	for(var i = 0; i < ids.length; i++){
		var id = ids[i]; 
		//返回指定id行的数据 
		var rowdatas = $("#grid-table").jqGrid('getRowData',id);
		plaMatIds[i]= rowdatas.PLAMATID;
	}
	var param = {ids : parmJson, planId : $('#planId').val()};
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
	  		url: BASE_URL+"/ems/emsplamaterial/delete",
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
