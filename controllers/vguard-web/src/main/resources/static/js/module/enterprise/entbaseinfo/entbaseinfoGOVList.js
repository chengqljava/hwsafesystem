$(document).ready(function() {
	initSeachInput();
//	SelectOption.loadSubjection("subjection");//单位管辖隶属关系
	//2017-5-20 qys 去掉审核状态
	var colname = ['工商信息id','企业信息id','企业名称val','企业名称','行业主管分类','行业行政主管部门','负责人','联系电话','采集状态','更新时间']; 
//	var colname = ['工商信息id','企业信息id','企业名称val','企业名称','行业主管分类','行业行政主管部门','负责人','联系电话','采集状态','审核状态','更新时间']; 
	var colmodel = [
		{name:'BUSINESSINFOID',index:'BUSINESSINFOID', width:'5%',hidden: true},
		{name:'BASEINFOID',index:'BASEINFOID', width:'5%',hidden: true},
		{name:'ENTNAME',index:'ENTNAME',width:'20%',align:'left',hidden: true},
		{name:'ENTNAME_val',index:'ENTNAME_val',width:'20%',align:'left',
			formatter:function(cellvalue, options, obj) { 
				   return '<a href="javascript:void(0);" onclick="display(\''+obj.BUSINESSINFOID+'\',\''+obj.ENTNAME+'\')">'+obj.ENTNAME+'</a>';
			}
		},
		{name:'DIRECTORTYPENAME',index:'DIRECTORTYPENAME',width:'20%',align:'left'},
		{name:'ALLORGNAME',index:'ALLORGNAME',width:'30%',align:'left'},
		{name:'LEGALPERSON',index:'DIRECTORTYPEID',width:'6%',align:'left'},
		{name:'PHONE',index:'PHONE',width:'8%',align:'left'},
		{name:'STATUS',index:'STATUS',width:'5%',align:'left',editoptions : {value : "0:未填报;1:填报中;2:更新中;3:已上报"},formatter:'select'},
		//2017-5-20 qys 去掉审核状态
//		{name:'AUDITSTATUS',index:'AUDITSTATUS',width:'8%',align:'left',
//			formatter:function(cellvalue, options, obj) { 
//				if(obj.AUDITSTATUS == '0'){
//					return '<a href="javascript:void(0);" onclick="auditDisplay(\''+obj.BUSINESSINFOID+'\')">审核未通过</a>';
//				}else if(obj.AUDITSTATUS == '1'){
//					return '<a href="javascript:void(0);" onclick="auditDisplay(\''+obj.BUSINESSINFOID+'\')">审核通过</a>';
//				}else{
//					return '未审核';
//				}
//			}
//		},
		{name:'UPDATETIME',index:'UPDATETIME',width:'10%',align:'left',
			formatter : function(cellvalue, options, obj) {
				return getFormatDateByLong(obj.UPDATETIME,
						"yyyy-MM-dd hh:mm:ss");
			}
		}
	];
	
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
			districtid:$("#districtid").val()
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
				$('.ui-jqgrid-htable').css({"width":"500"});
				$("#grid-table").css({"width":"900" });
				$("#grid-table").closest(".ui-jqgrid-bdiv").css({ "overflow-x" : "scroll"});
				$(".ui-jqgrid-hdiv").css({ "overflow-x" : "scroll"});
				$("#grid-table").jqGrid( 'setGridHeight', 500 );
			} else {
				$("#grid-table").jqGrid( 'setGridWidth', $(window).width()*0.99 );
			}
		}
	});
});

/*加载行政区域*/
function searchDistrict(districtid){
	$("#districtid").val(districtid);
	reloadGrid();
}

/*加载*/
function reloadGrid(){
	var subjection='';
	if ($("#subjection").val() =='市属行业部门管理单位') {
		subjection ='1';
	}else if($("#subjection").val() =='区属行业部门管理单位'){
		subjection ='2';
	}else if($("#subjection").val() =='街镇行业部门管理单位'){
		subjection ='3';
	}
	$("#grid-table").jqGrid('setGridParam',{
		page:1,postData:{
					entname:$("#entname").val(),
					registernum:$("#registernum").val(),
					address:$("#address").val(),
//					subjection:$("#subjection").val(),
					subjection:subjection,
					entcode:$("#entcode").val(),
					districtid:$("#districtid").val()
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
	
	var status = rowdata.STATUS; //采集状态
	var auditstatus = rowdata.AUDITSTATUS //审核状态
	if(status != 3){
		parent.toast("只能对已上报的记录取消上报！");
		return;
	}else{
		if(auditstatus != 'null' ){
			parent.toast("只能对未审核记录取消上报！");
			return;
		}
	}
	
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
	var status = rowdata.STATUS; //采集状态
	var auditstatus = rowdata.AUDITSTATUS //审核状态
	if(status != 3){
		parent.toast("只能对已上报的记录审核！");
		return;
	}else{
		if(auditstatus != 'null' && auditstatus != "未审核"){
			parent.toast("只能对未审核记录审核！");
			return;
		}
	}
	parent.openWin(BASE_URL+'/enterprise/entbaseinfo/audit/'+businessinfoid,'审核','25%','45%');
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
	var status = rowdata.STATUS; //采集状态

	//2017-5-22 QYS 取消企业还未填报，政府端不能编辑的限制
//	if(status == 0){ //企业还未填报，政府端不能编辑
//		// 弹出提示信息
//		parent.toast("企业未填报不能编辑！");
//		return;
//	}
	
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
	// parent.openWin(BASE_URL+'/enterprise/entsafeinfomenu/safemenuDisplay/'+businessinfoid,entname,'80%','90%');
    parent.openWin(BASE_URL+"/views/module/enterprise/entbusinessinfo/displayEntbusinessinfo.html?businessinfoid="+businessinfoid,'详细','90%','90%');
};

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
};
/**
 * 弹出企业信息列表选择某一个企业时
 * 点击确定后 将选择的企业名称和企业Id传给打开这个窗口的页面
 */
$("#submitBtn").on("click",function(){
	var ids = $("#grid-table").jqGrid('getGridParam','selarrrow');
	if(ids.length !=1){
		// 弹出提示信息
		parent.toast("请选择一条记录！");
		return;
	}
	var rowdata = $("#grid-table").jqGrid('getRowData',ids[0]); //选中的一条记录
	var paramsJson="[";
	paramsJson+="{'BUSINESSINFOID':'"+rowdata.BUSINESSINFOID+"',";
	paramsJson+="'ENTNAME':'"+rowdata.ENTNAME+"',";
	paramsJson+="}";
	paramsJson+="]";
	if($("#frameIndex").val() == undefined || $("#frameIndex").val()==""){
		parent.frames[1].selectBaseinfo(paramsJson);
	}else{
		parent.frames["layui-layer-iframe"+$("#frameIndex").val()].selectBaseinfo(paramsJson);
	}
	parent.closeWin('dialogModal');// 关闭弹出框// 关闭弹出框
});