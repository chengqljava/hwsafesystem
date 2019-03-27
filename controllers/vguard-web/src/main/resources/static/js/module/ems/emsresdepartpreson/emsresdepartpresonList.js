$(document).ready(function() {
	
	var colname = ['人员id','姓名','所属机构','所属部门','职务','手机','联系电话']; 
	var colmodel = [
		{name:'ORGANPRESONID',index:'ORGANPRESONID', width:'5%',hidden: true},
		{name:'NAME',index:'NAME',width:'10%',align:'left',
			formatter:function(cellvalue, options, obj) { 
				return '<a href="javascript:void(0);" onclick="display(\''+obj.ORGANPRESONID+'\')">'+obj.NAME+'</a>';
			}
		},
		{name:'ORGNAME',index:'ORGNAME',width:'20%',align:'left'},
		{name:'DEPARTNAME',index:'DEPARTNAME',width:'20%',align:'left'},
		{name:'GROUPDUTY',index:'GROUPDUTY',width:'10%',align:'left'},
		{name:'CELLPHONE',index:'CELLPHONE',width:'10%',align:'center'},
		{name:'OFFICETEL',index:'OFFICETEL',width:'10%',align:'center'}
	];

	var tableHeight = $(window).height() - $('.pcheck').height() - 190;
	$(window).resize(function(){
		$("#grid-table").jqGrid( 'setGridHeight', $(window).height() - $('.pcheck').height() - 190 );
		$("#grid-table").jqGrid( 'setGridWidth', $(window).width()*0.99 );
	});
		
    $("#grid-table").jqGrid({
    	height: tableHeight,
    	url : BASE_URL + "/ems/emsresdepartpreson/list",
		datatype: "json",
		cache : false,
		mtype : 'post',
		colNames:colname,
		colModel:colmodel,
		postData:{
			orgid:$("#orgid").val(),
			deptid:$("#deptid").val()
		},
		sortname : 'ORGANPRESONID',
		sortorder : "asc",
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
		caption: "应急人员",
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
			orgid:$("#orgid").val(),
			deptid:$("#deptid").val()
			}
	}).trigger("reloadGrid");
}

/*搜索查询*/
$("#searchbtn").bind("click",function(){
	reloadGrid();
});

/*重置*/
$("#resetbtn").bind("click",function(){
	$("#orgid").val();
	$("#deptid").val();
});

/*添加*/
$("#addBtn").on("click", function () {
	var orgid = $("#orgid").val();
	parent.openWin(BASE_URL+"/ems/emsresdepartpreson/add/"+orgid,'添加','70%','60%');
});

/*编辑*/
$("#editBtn").on("click", function () {
	var ids = $("#grid-table").jqGrid('getGridParam','selarrrow');
	if(ids.length !=1){
		// 弹出提示信息
		parent.toast("请选择一条记录！");
		return;
	}
	var rowdata = $("#grid-table").jqGrid('getRowData',ids[0]); //选中的一条记录
	var emsuserid = rowdata.ORGANPRESONID;
	
	parent.openWin(BASE_URL+'/ems/emsresdepartpreson/edit/'+emsuserid,'编辑','70%','60%');
});

/*详细查询*/
function display(emsuserid){
	parent.openWin(BASE_URL+"/ems/emsresdepartpreson/display/"+emsuserid,'详细','70%','60%');
}


/*批量删除*/
$("#delBtn").on("click", function () {
	//返回当前grid中复选框所选择的数据的id 
	var ids = $("#grid-table").jqGrid('getGridParam','selarrrow');
	if(ids.length==0){
		// 弹出提示信息
		parent.toast("请选择需要删除的数据！");
		return;
	}

	var emsuserids=[];
	for(var i=0;i<ids.length;i++){
		var id = ids[i]; 
		//返回指定id行的数据 
		var rowdatas = $("#grid-table").jqGrid('getRowData',id);
		emsuserids[i]= rowdatas.ORGANPRESONID;
	}
	var parmJson = emsuserids.toString();
	var param = {"ids":parmJson};
	del(param);
});


/*删除方法*/
function del(param){
	//查询是否有关联引用	
	$.ajax({ 
	  		url: BASE_URL+"/ems/emsresdepartpreson/loadLinkById",
	  		type:'post',
	  		dataType:'json',
	  		data:param,
	  		success: function(json){
	  			if(json.success==false){
	  				//有关联引用
	  				parent.toast(json.msg);
	  			}else{
	  				//弹出提示框
	  				parent.confirm("确认删除吗?", function() { 
	  					 $.ajax({ 
	  						 	url: BASE_URL+"/ems/emsresdepartpreson/delete",
	  					  		type:'post',
	  					  		dataType:'json',
	  					  		data:param,
	  					  		success: function(json){
	  					  			if(json.success==true){
	  					  				parent.toast(json.msg);
	  					  				reloadGrid();//刷新列表
		  					  			var deptid = $("#deptid").val();
		  								if(deptid){
		  									var index = parent.getParentIndex();
		  									parent.frames["layui-layer-iframe"+index].reloadGrid();
		  								}
	  									parent.getActiveIFrame().reloadGrid();
	  					  			}else{
	  					  				parent.toast(json.msg);
	  					  			}
	  					  		}
	  						 });
	  			    });
	  		  }
		  }
	});
	
}

/**保存*/
function save(personIdsStr){

	$.ajax({
		type : 'post',
		url : BASE_URL+'/ems/emsplaperson/save',
		cache : false,
		dataType : 'json',
		data : {planId : $('#planId').val(), personIds : personIdsStr},
		global : false,
		success : function(json) {
			if(json.success == true){
				parent.toast(json.msg);//弹出提示信息
				var frameLen = parent.parent.frames.length;
				parent.parent.frames[frameLen - 1].frames["chemIframe"].reloadGrid();
				parent.closeWin();// 关闭弹出框
			}else{
				parent.toast(json.msg);
			}
		},
		error : function() {
			parent.toast("保存失败");
		}
	});
}

/**
 * 选择一条记录
 */
$("#submitbtn").on("click",function(){
	
	var personIds = [];
	var rowData, personId;
	
	var ids = $("#grid-table").jqGrid('getGridParam','selarrrow');
	if(ids.length < 1){
		// 弹出提示信息
		parent.toast("请选择至少一条记录！");
		return;
	}
	
	for(var i = 0; i < ids.length; i++){
		rowData = $("#grid-table").jqGrid('getRowData', ids[i]); //选中的一条记录
		personId = rowData.ORGANPRESONID;
		personIds.push(personId);
	}
	
	save(personIds + '');
	
});

 

