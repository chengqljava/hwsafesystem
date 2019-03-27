$(document).ready(function() {
	var colname = ['主键id','劳动者id','姓名','治疗日期','病情','处方','治疗机构','主治医师','备注',"操作"]; 
	var colmodel = [
					{name:'TREATMENTID',index:'TREATMENTID',hidden:true},
					{name:'WORKERID',index:'WORKERID',hidden:true},
					{name:'NAME',index:'NAME',formatter:
                       function(cellvalue, options, obj) { 
                          return '<a href="javascript:void(0);" onclick="display(\''+obj.TREATMENTID+'\')">'+obj.NAME+'</a>';
                       }
                    },
					{name:'TREATMENTDATE',index:'TREATMENTDATE',formatter:
                       function(cellvalue, options, obj) { 
                          return getSmpFormatDateByLong(obj.TREATMENTDATE,false);
                       }
                    },
					{name:'ILLNESS',index:'ILLNESS'},
					{name:'PRESCRIPTION',index:'PRESCRIPTION'},
					{name:'HOSPITAL',index:'HOSPITAL'},
					{name:'DOCTOR',index:'DOCTOR'},
					{name:'NOTES',index:'NOTES'},
            		{name:'OPERATION',index:"OPERATION",width:'80px',fixed:true,align:"left",formatter:function(cellvalue, options, obj){
            			return '<a href="javascript:void(0);" title="编辑" class="operation editInfoBtn" onclick="editInfo(\''+obj.TREATMENTID+'\')">编辑</a><br>'
            			     + '<a href="javascript:void(0);" title="删除" class="operation delInfoBtn" onclick="delInfo(\''+obj.TREATMENTID+'\')">删除</a>'
            		}}
			];
	
	var tableHeight = $(window).height() - $('.pcheck').height() - 190 -33;
	$(window).resize(function(){
		$("#grid-table").jqGrid( 'setGridHeight', $(window).height() - $('.pcheck').height() - 190 -33 );
		$("#grid-table").jqGrid( 'setGridWidth', $(window).width() - 96 );
	});

    $("#grid-table").jqGrid({
    	height: tableHeight,
    	url : BASE_URL + "/health/ochtreatment/list",
		datatype: "json",
		cache : false,
		mtype : 'post',
		colNames:colname,
		colModel:colmodel,
		postData:{
			hospital:$("#hospital").val(),
            dateStart:$("#dateStart").val(),
            dateEnd:$("#dateEnd").val(),
            workerid:$("#workerid").val()
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
		caption: "职业病治疗情况列表",
		autowidth: true,
		loadComplete: function() {
			if($(window).width() < 700) {
				$('.ui-jqgrid-htable').css({"width":"900"});
				$("#grid-table").css({"width":"900"});
				$("#grid-table").closest(".ui-jqgrid-bdiv").css({ "overflow-x" : "scroll","height":"350"});
				$(".ui-jqgrid-hdiv").css({ "overflow-x" : "scroll"});
			} else {
				$("#grid-table").jqGrid( 'setGridWidth', $(window).width() -96 );
			}
		}
	});
});
//编辑
function editInfo(treatmentid) {
	top.openWin(BASE_URL+'/health/ochtreatment/edit/'+treatmentid,'编辑','65%','75%');
}
// 删除
function delInfo(treatmentid) {
	var param = {"ids":treatmentid};
	del(param);
}
/*加载*/
function reloadGrid(){
	$("#grid-table").jqGrid('setGridParam',{
		page:1,postData:{
			hospital:$("#hospital").val(),
			dateStart:$("#dateStart").val(),
			dateEnd:$("#dateEnd").val(),
			workerid:$("#workerid").val()
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
	top.openWin(BASE_URL+"/health/ochtreatment/add/"+$("#workerid").val(),'添加','65%','75%');
});

/*编辑*/
$("#editBtn").on("click", function () {
	var ids = getSingleIds();
	var rowdata = $("#grid-table").jqGrid('getRowData',ids[0]); //选中的一条记录
	var treatmentid = rowdata.TREATMENTID;
	top.openWin(BASE_URL+'/health/ochtreatment/edit/'+treatmentid,'编辑','65%','75%');
});

/*详细查询*/
function display(treatmentid){
	top.openWin(BASE_URL+"/health/ochtreatment/display/"+treatmentid,'详细','65%','75%');
}
/*批量删除*/
$("#delBtn").on("click", function () {
	//返回当前grid中复选框所选择的数据的id 
	var ids = getManyIds("请选择需要删除的数据!");
	var treatmentids=[];
	var state = "";
	for(var i=0;i<ids.length;i++){
		var id = ids[i]; 
		//返回指定id行的数据 
		var rowdatas = $("#grid-table").jqGrid('getRowData',id);
		treatmentids[i]= rowdatas.TREATMENTID;
	}
	var parmJson = treatmentids.toString();
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
	  		url: BASE_URL+"/health/ochtreatment/delete",
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
