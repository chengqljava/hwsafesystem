$(document).ready(function() {
	
	var colname = ['执法组id','执法组名称','执法组负责人','所属执法部门','执法人员']; 
	var colmodel = [
		{name:'GROUPID',index:'GROUPID', width:'5%',hidden: true},
		{name:'GROUPNAME',index:'GROUPNAME',width:'20%',align:'left',
			formatter:function(cellvalue, options, obj) { 
				return '<a href="javascript:void(0);" onclick="display(\''+obj.GROUPID+'\')">'+obj.GROUPNAME+'</a>';
			}
		},
		{name:'NICKNAME',index:'NICKNAME',width:'10%',align:'center'},
		{name:'DEPTNAME',index:'DEPTNAME',width:'20%',align:'left'},
		{name:'USERCOUNT',index:'USERCOUNT',width:'10%',align:'center',
			formatter:function(cellvalue, options, obj) { 
				return '<a href="javascript:void(0);" onclick="displayUsers(\''+obj.GROUPID+'\')">'+obj.USERCOUNT+'人</a>';
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
    	url : BASE_URL + "/law/lawgroup/list",
		datatype: "json",
		cache : false,
		mtype : 'post',
		colNames:colname,
		colModel:colmodel,
		postData:{
			deptid:$("#deptid").val()
		},
		sortname : 'GROUPID',
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
		caption: "执法组",
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
			deptid:$("#deptid").val()
			}
	}).trigger("reloadGrid");
}

/*添加*/
$("#addBtn").on("click", function () {
	var deptid = $("#deptid").val();
	parent.openWin(BASE_URL+"/law/lawgroup/add/"+deptid,'添加','60%','30%');
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
	var groupid = rowdata.GROUPID;
	
	parent.openWin(BASE_URL+'/law/lawgroup/edit/'+groupid,'编辑','60%','30%');
});

/*详细查询*/
function display(groupid){
	parent.openWin(BASE_URL+"/law/lawgroup/display/"+groupid,'详细','60%','30%');
}

/*执法人员*/
function displayUsers(groupid){
	parent.openWin(BASE_URL+"/law/lawgroup/intousers/"+groupid,'详细','70%','60%');
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

	var groupids=[];
	for(var i=0;i<ids.length;i++){
		var id = ids[i]; 
		//返回指定id行的数据 
		var rowdatas = $("#grid-table").jqGrid('getRowData',id);
		groupids[i]= rowdatas.GROUPID;
	}
	var parmJson = groupids.toString();
	var param = {"ids":parmJson};
	del(param);
});


/*删除方法*/
function del(param){
	//查询是否有关联引用	
	$.ajax({ 
	  		url: BASE_URL+"/law/lawgroup/loadLinkById",
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
	  						 	url: BASE_URL+"/law/lawgroup/delete",
	  					  		type:'post',
	  					  		dataType:'json',
	  					  		data:param,
	  					  		success: function(json){
	  					  			if(json.success==true){
	  					  				parent.toast(json.msg);
	  					  				reloadGrid();//刷新列表
	  									parent.getActiveIFrame().reloadGrid();//刷新父列表（执法部门）
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


 

