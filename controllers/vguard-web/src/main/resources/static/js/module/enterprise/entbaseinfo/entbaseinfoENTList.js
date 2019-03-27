$(document).ready(function() {
//	SelectOption.loadSubjection("subjection");//单位管辖隶属关系
	initSeachInput();
	var colname = ['工商信息id','企业信息id','企业名称','行业主管分类','行业行政主管部门','负责人','联系电话','采集状态','更新时间']; 
	var colmodel = [
		{name:'BUSINESSINFOID',index:'BUSINESSINFOID', width:'5%',hidden: true},
		{name:'BASEINFOID',index:'BASEINFOID', width:'5%',hidden: true},
		{name:'ENTNAME',index:'ENTNAME',width:'20%',align:'left',
			formatter:function(cellvalue, options, obj) { 
				   return '<a href="javascript:void(0);" onclick="display(\''+obj.BUSINESSINFOID+'\',\''+obj.ENTNAME+'\')">'+obj.ENTNAME+'</a>';
			}
		},
		{name:'DIRECTORTYPENAME',index:'DIRECTORTYPENAME',width:'20%',align:'left'},
		{name:'ALLORGNAME',index:'ALLORGNAME',width:'30%',align:'left'},
		{name:'LEGALPERSON',index:'LEGALPERSON',width:'6%',align:'left'},
		{name:'PHONE',index:'PHONE',width:'8%',align:'left'},
		{name:'STATUS',index:'STATUS',width:'5%',align:'left',editoptions : {value : "0:未上报;1:填报中;2:更新中;3:已上报"},formatter:'select'},
		/*{name:'AUDITSTATUS',index:'AUDITSTATUS',width:'8%',align:'left',
			formatter:function(cellvalue, options, obj) { 
				if(obj.AUDITSTATUS == '0'){
					return '<a href="javascript:void(0);" onclick="auditDisplay(\''+obj.BUSINESSINFOID+'\')">审核未通过</a>';
				}else if(obj.AUDITSTATUS == '1'){
					return '<a href="javascript:void(0);" onclick="auditDisplay(\''+obj.BUSINESSINFOID+'\')">审核通过</a>';
				}else{
					return '未审核';
				}
			}	
		},*/
		{name:'UPDATETIME',index:'UPDATETIME',width:'10%',align:'left',
			formatter : function(cellvalue, options, obj) {
				return getFormatDateByLong(obj.UPDATETIME,
				"yyyy-MM-dd hh:mm:ss");
			}
		}
	];
	
	/*$(window).on('resize.jqGrid', function () {
		$("#grid-table").jqGrid( 'setGridWidth', $(window).width()*0.99 );
    })*/
	
	var tableHeight = $(window).height() - $('.pcheck').height() - 190 -33;
	$(window).resize(function(){
		$("#grid-table").jqGrid( 'setGridHeight', $(window).height() - $('.pcheck').height() - 190 -33 );
		$("#grid-table").jqGrid( 'setGridWidth', $(window).width()*0.99 );
	});

    $("#grid-table").jqGrid({
    	height: tableHeight,
    	url : BASE_URL + "/enterprise/entbaseinfo/list",
		datatype: "json",
		cache : false,
		mtype : 'post',
		colNames:colname,
		colModel:colmodel,
		postData:{
			entname:$("#entname").val(),
			registernum:$("#registernum").val(),
			address:$("#address").val(),
			subjection:$("#subjection").val(),
			entcode:$("#entcode").val(),
			districtid:null
		},
		sortname : 'updatetime',
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
		caption: "企业信息",
		autowidth: true,
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
	$("#grid-table").jqGrid('setGridParam',{
		page:1,postData:{
					entname:$("#entname").val(),
					registernum:$("#registernum").val(),
					address:$("#address").val(),
					subjection:$("#subjection").val(),
					entcode:$("#entcode").val(),
					districtid:null
			             }
	}).trigger("reloadGrid");
}

/*搜索查询*/
$("#searchBtn").bind("click",function(){
	reloadGrid();
});

/*重置*/
$("#resetBtn").bind("click",function(){
	$("#entname").val("");
	$("#registernum").val("");
	$("#subjection").val("");
	$("#entcode").val("");
	$("#address").val("");
});

/*审核信息*/
function auditDisplay(businessinfoid){
	$.ajax({ 
  		url: BASE_URL+"/enterprise/entaudit/loadEntAuditCount",
  		type:'post',
  		dataType:'json',
  		data:{"businessinfoid":businessinfoid},
  		success: function(json){
  			if(json.success==true){
  				parent.openWin(BASE_URL+'/enterprise/entaudit/intoList/'+businessinfoid,'审核信息');
  			}else{
  				parent.toast(json.msg); //无审核记录
  			}
  		}
	 });
	
}

/*上报*/
$("#addBtn").on("click", function () {
	var ids = $("#grid-table").jqGrid('getGridParam','selarrrow');
	if(ids.length !=1){
		// 弹出提示信息
		parent.toast("请选择一条记录！");
		return;
	}
	var rowdata = $("#grid-table").jqGrid('getRowData',ids[0]); //选中的一条记录
	var businessinfoid = rowdata.BUSINESSINFOID; //工商信息id
	 //弹出提示框
	parent.confirm('确认上报吗?',function(){
		$.ajax({ 
	  		url: BASE_URL+"/enterprise/entbaseinfo/report",
	  		type:'post',
	  		dataType:'json',
	  		data:{"businessinfoid":businessinfoid},
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
});

/*取消上报*/
$("#boperBtn").on("click", function () {
	var ids = $("#grid-table").jqGrid('getGridParam','selarrrow');
	if(ids.length !=1){
		// 弹出提示信息
		parent.toast("请选择一条记录！");
		return;
	}
	var rowdata = $("#grid-table").jqGrid('getRowData',ids[0]); //选中的一条记录
	var businessinfoid = rowdata.BUSINESSINFOID; //工商信息id
	 //弹出提示框
	parent.confirm('确认取消上报吗?',function(){
		$.ajax({ 
	  		url: BASE_URL+"/enterprise/entbaseinfo/cancelReport",
	  		type:'post',
	  		dataType:'json',
	  		data:{"businessinfoid":businessinfoid},
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
});

/*企业审核*/
$("#bacdtBtn").on("click", function () {
	var ids = $("#grid-table").jqGrid('getGridParam','selarrrow');
	if(ids.length !=1){
		// 弹出提示信息
		parent.toast("请选择一条记录！");
		return;
	}
	var rowdata = $("#grid-table").jqGrid('getRowData',ids[0]); //选中的一条记录
	var businessinfoid = rowdata.BUSINESSINFOID; //工商信息id
	parent.openWin(BASE_URL+'/enterprise/entbaseinfo/audit/'+businessinfoid,'审核','25%','40%');
});


/*安全信息菜单*/
$("#editBtn").on("click", function () {
	var ids = $("#grid-table").jqGrid('getGridParam','selarrrow');
	if(ids.length !=1){
		// 弹出提示信息
		parent.toast("请选择一条记录！");
		return;
	}
	var rowdata = $("#grid-table").jqGrid('getRowData',ids[0]); //选中的一条记录
	var businessinfoid = rowdata.BUSINESSINFOID; //工商信息id
	var entname = rowdata.ENTNAME; //企业名称
	parent.openWin(BASE_URL+'/enterprise/entsafeinfomenu/safemenu/'+businessinfoid,entname,'80%','90%');
});


/*修改密码*/
$("#setpwdBtn").on("click", function () {
	// 返回当前grid中复选框所选择的数据的id
	var ids = $("#grid-table").jqGrid('getGridParam', 'selarrrow');
	if (ids.length != 1) {
		// 弹出提示信息
		parent.toast("请选择一条数据进行密码修改！");
		return;
	}
	// 返回指定id行的数据
	var rowdatas = $("#grid-table").jqGrid('getRowData', ids[0]);
	var userid = rowdatas.USERID;
	parent.openWin(BASE_URL + '/system/sysuser/reset/' + userid,'密码修改', "25%", "30%");
});

/*详细查询*/
function display(businessinfoid,entname){
	parent.openWin(BASE_URL+'/enterprise/entsafeinfomenu/safemenu/'+businessinfoid,entname,'80%','90%');
}