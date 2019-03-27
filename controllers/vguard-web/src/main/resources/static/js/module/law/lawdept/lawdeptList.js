$(document).ready(function() {

	 //下拉树
	SelectTree.loadSelfDistrictSelect("districtname");
	
	var colname = ['部门id','部门编号','部门名称','所在区域','负责人','案件编头','内设分组','部门人员']; 
	var colmodel = [
		{name:'DEPTID',index:'DEPTID', width:'5%',hidden: true},
		{name:'DEPTCODE',index:'DEPTCODE',width:'10%',align:'left',
			formatter:function(cellvalue, options, obj) { 
				return '<a href="javascript:void(0);" onclick="display(\''+obj.DEPTID+'\')">'+obj.DEPTCODE+'</a>';
			}
		},
		{name:'DEPTNAME',index:'DEPTNAME',width:'20%',align:'left'},
		{name:'DISTRICTNAME',index:'DISTRICTNAME',width:'10%',align:'left'},
		{name:'NICKNAME',index:'NICKNAME',width:'10%',align:'center'},
		{name:'TITLE',index:'TITLE',width:'10%',align:'center'},
		{name:'GROUPCOUNT',index:'GROUPCOUNT',width:'10%',align:'center',
			formatter:function(cellvalue, options, obj) { 
				return '<a href="javascript:void(0);" onclick="displayGroups(\''+obj.DEPTID+'\')">'+obj.GROUPCOUNT+'</a>';
			}
		},
		{name:'USERCOUNT',index:'USERCOUNT',width:'10%',align:'center',
			formatter:function(cellvalue, options, obj) { 
				return '<a href="javascript:void(0);" onclick="displayUsers(\''+obj.DEPTID+'\')">'+obj.USERCOUNT+'人</a>';
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
    	url : BASE_URL + "/law/lawdept/list",
		datatype: "json",
		cache : false,
		mtype : 'post',
		colNames:colname,
		colModel:colmodel,
		postData:{
			deptname:$("#deptname").val(),
			districtid:$("#districtname_select").val(),
			title:$("#title").val(),
			depthead:$("#depthead").val()
		},
		sortname : 'DEPTCODE',
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
		caption: "执法部门",
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

/*加载行政区域*/
function searchDistrict(districtid){
	$("#districtname_select").val(districtid);
	reloadGrid();
}

/*加载*/
function reloadGrid(){
	$("#grid-table").jqGrid('setGridParam',{
		page:1,postData:{
			deptname:$("#deptname").val(),
			districtid:$("#districtname_select").val(),
			title:$("#title").val(),
			depthead:$("#depthead").val()
			}
	}).trigger("reloadGrid");
}

/*搜索查询*/
$("#searchbtn").bind("click",function(){
	reloadGrid();
});

/*重置*/
$("#resetbtn").bind("click",function(){
	$("#deptname").val();
	$("#districtname_select").val();
	$("#title").val();
	$("#depthead").val();
});

/*添加*/
$("#addBtn").on("click", function () {
	parent.openWin(BASE_URL+"/law/lawdept/add",'添加','60%','35%');
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
	var deptid = rowdata.DEPTID;
	
	parent.openWin(BASE_URL+'/law/lawdept/edit/'+deptid,'编辑','60%','35%');
});

/*详细查询*/
function display(deptid){
	parent.openWin(BASE_URL+"/law/lawdept/display/"+deptid,'详细','60%','35%');
}

/*执法组*/
function displayGroups(deptid){
	parent.openWin(BASE_URL+"/law/lawgroup/displayGroups/"+deptid,'详细','70%','60%');
}

/*执法人员*/
function displayUsers(deptid){
	parent.openWin(BASE_URL+"/law/lawdept/intousers/"+deptid,'详细','70%','60%');
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

	var deptids=[];
	for(var i=0;i<ids.length;i++){
		var id = ids[i]; 
		//返回指定id行的数据 
		var rowdatas = $("#grid-table").jqGrid('getRowData',id);
		deptids[i]= rowdatas.DEPTID;
	}
	var parmJson = deptids.toString();
	var param = {"ids":parmJson};
	del(param);
});


/*删除方法*/
function del(param){
	//查询是否有关联引用	
	$.ajax({ 
	  		url: BASE_URL+"/law/lawdept/loadLinkById",
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
	  						 	url: BASE_URL+"/law/lawdept/delete",
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
		  }
	});
}


 

