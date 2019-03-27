$(document).ready(function() {

	 //执法部门
	SelectTree.loadBaseSelect(BASE_URL+"/system/sysdepart/departtree","deptname");
	
	//计划类型
	SelectOption.loadPlanType("plantype");
	
	var colname = ['计划id','计划名称','执法部门','计划类型','开始日期','截止日期']; 
	var colmodel = [
		{name:'PLANID',index:'PLANID', width:'5%',hidden: true},
		{name:'PLANNAME',index:'PLANNAME',width:'10%',align:'left',
			formatter:function(cellvalue, options, obj) { 
				return '<a href="javascript:void(0);" onclick="display(\''+obj.PLANID+'\')">'+obj.PLANNAME+'</a>';
			}
		},
		{name:'DEPTNAME',index:'DEPTNAME',width:'20%',align:'left'},
		{name:'PLANTYPE',index:'PLANTYPE',width:'10%',align:'left',
			formatter:function(cellvalue, options, obj) { 
				return SelectOption.getPlanType(obj.PLANTYPE);
			}
		},
		{name:'BEGINDATE',index:'BEGINDATE',width:'10%',align:'center',
			formatter:function(cellvalue, options, obj) { 
				if (obj.BEGINDATE) {
					return getSmpFormatDateByLong(obj.BEGINDATE, false);
				} else {
					return "";
				}
			}
		},
		{name:'ENDDATE',index:'ENDDATE',width:'10%',align:'center',
			formatter:function(cellvalue, options, obj) { 
				if (obj.ENDDATE) {
					return getSmpFormatDateByLong(obj.ENDDATE, false);
				} else {
					return "";
				}
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
    	url : BASE_URL + "/law/lawplan/planInList",
		datatype: "json",
		cache : false,
		mtype : 'post',
		colNames:colname,
		colModel:colmodel,
		postData:{
			deptid:$("#deptname_select").val(),
			districtid:$("#districtid").val(),
			plantype:$("#plantype").val()
		},
		sortname : 'ENDDATE',
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
		caption: "计划内执法列表",
		autowidth: true
	});
});

/*加载行政区域*/
function searchDistrict(districtid){
	$("#districtid").val(districtid);
	reloadGrid();
}

/*加载*/
function reloadGrid(){
	
	var searchParamJson = {};
	
	$.each($("#searchForm").serializeArray(), function(){
		searchParamJson[this.name] = this.value;
	});
	
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
	$("#searchForm").find("input,select").each(function(){
		$(this).val("");
	});
});

/*添加*/
$("#addBtn").on("click", function () {
	parent.openWin(BASE_URL+"/law/lawplan/add",'添加','60%','45%');
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
	var planid = rowdata.PLANID;
	
	parent.openWin(BASE_URL+'/law/lawplan/edit/'+planid,'编辑','60%','45%');
});

/*详细查询*/
function display(planid){
	parent.openWin(BASE_URL+"/law/lawplan/display/"+planid,'详细','60%','50%');
}

/*待执法企业*/
function displayEntList(planid){
	parent.openWin(BASE_URL+"/law/lawcheckent/displayEntList/"+planid,'详细','70%','60%');
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

	var planids=[];
	for(var i=0;i<ids.length;i++){
		var id = ids[i]; 
		//返回指定id行的数据 
		var rowdatas = $("#grid-table").jqGrid('getRowData',id);
		planids[i]= rowdatas.PLANID;
	}
	var parmJson = planids.toString();
	var param = {"ids":parmJson};
	del(param);
});


/*删除方法*/
function del(param){
	//查询是否有关联引用	
	$.ajax({ 
	  		url: BASE_URL+"/law/lawplan/loadLinkById",
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
	  						 	url: BASE_URL+"/law/lawplan/delete",
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


 

