$(document).ready(function() {
	var colname = ['主键id','劳动者id','姓名','离岗时检查日期','离岗时检查结论','离岗时检查机构','备注',"操作"]; 
	var colmodel = [
					{name:'AFTERCHECKID',index:'AFTERCHECKID',hidden:true},
					{name:'WORKERID',index:'WORKERID',hidden:true},
					{name:'NAME',index:'NAME',formatter:
                       function(cellvalue, options, obj) { 
                          return '<a href="javascript:void(0);" onclick="display(\''+obj.AFTERCHECKID+'\')">'+obj.NAME+'</a>';
                       }
                    },
					{name:'AFTERCHECKDATE',index:'AFTERCHECKDATE',formatter:
                       function(cellvalue, options, obj) { 
                          return getSmpFormatDateByLong(obj.AFTERCHECKDATE,false);
                       }
                    },
					{name:'AFTERCHECKCON',index:'AFTERCHECKCON'},
					{name:'AFTERCHECKORG',index:'AFTERCHECKORG'},
					{name:'NOTES',index:'NOTES'},
            		{name:'OPERATION',index:"OPERATION",width:'80px',fixed:true,align:"left",formatter:function(cellvalue, options, obj){
            			return '<a href="javascript:void(0);" title="编辑" class="operation editInfoBtn" onclick="editInfo(\''+obj.AFTERCHECKID+'\')">编辑</a><br>'
            			     + '<a href="javascript:void(0);" title="删除" class="operation delInfoBtn" onclick="delInfo(\''+obj.AFTERCHECKID+'\')">删除</a>'
            		}}
			];
	
	var tableHeight = $(window).height() - $('.pcheck').height() - 190 -33;
	$(window).resize(function(){
		$("#grid-table").jqGrid( 'setGridHeight', $(window).height() - $('.pcheck').height() - 190 -33 );
		$("#grid-table").jqGrid( 'setGridWidth', $(window).width() - 96 );
	});

    $("#grid-table").jqGrid({
    	height: tableHeight,
    	url : BASE_URL + "/health/ochaftercheck/list",
		datatype: "json",
		cache : false,
		mtype : 'post',
		colNames:colname,
		colModel:colmodel,
		postData:{
			aftercheckdateStart:$("#aftercheckdateStart").val(),
            aftercheckdateEnd:$("#aftercheckdateEnd").val(),
            aftercheckorg:$("#aftercheckorg").val(),
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
		caption: "离岗检查情况列表",
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
function editInfo(aftercheckid) {
	top.openWin(BASE_URL+'/health/ochaftercheck/edit/'+aftercheckid,'编辑','65%','75%');
}
// 删除
function delInfo(aftercheckid) {
	var param = {"ids":aftercheckid};
	del(param);
}
/*加载*/
function reloadGrid(){
	$("#grid-table").jqGrid('setGridParam',{
		page:1,postData:{
			aftercheckdateStart:$("#aftercheckdateStart").val(),
			aftercheckdateEnd:$("#aftercheckdateEnd").val(),
			aftercheckorg:$("#aftercheckorg").val(),
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
	top.openWin(BASE_URL+"/health/ochaftercheck/add/"+$("#workerid").val(),'添加','65%','75%');
});

/*编辑*/
$("#editBtn").on("click", function () {
	var ids = getSingleIds();
	var rowdata = $("#grid-table").jqGrid('getRowData',ids[0]); //选中的一条记录
	var aftercheckid = rowdata.AFTERCHECKID;
	top.openWin(BASE_URL+'/health/ochaftercheck/edit/'+aftercheckid,'编辑','65%','75%');
});

/*详细查询*/
function display(aftercheckid){
	top.openWin(BASE_URL+"/health/ochaftercheck/display/"+aftercheckid,'详细','65%','75%');
}
/*批量删除*/
$("#delBtn").on("click", function () {
	//返回当前grid中复选框所选择的数据的id 
	var ids = getManyIds("请选择需要删除的数据!");
	var aftercheckids=[];
	var state = "";
	for(var i=0;i<ids.length;i++){
		var id = ids[i]; 
		//返回指定id行的数据 
		var rowdatas = $("#grid-table").jqGrid('getRowData',id);
		aftercheckids[i]= rowdatas.AFTERCHECKID;
	}
	var parmJson = aftercheckids.toString();
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
	  		url: BASE_URL+"/health/ochaftercheck/delete",
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
