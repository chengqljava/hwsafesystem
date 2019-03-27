$(document).ready(function() {
	SelectOption.loadSubjection("subjection");//单位管辖隶属关系
	
	var colname = ['主键id','企业工商id','登记id','状态','复查状态','隐患编号','巡查部门','巡查对象名称','隐患检查内容','隐患基本情况','隐患发现时间','隐患整改期限','复查部门','监管部门','状态']; 
	var colmodel = [
		{name:'REGISTRAID',index:'REGISTRAID', width:'5%',hidden: true},
		{name:'BUSINESSINFOID',index:'BUSINESSINFOID', width:'5%',hidden: true},
		{name:'INSPECTIONID',index:'INSPECTIONID', width:'5%',hidden: true},
		{name:'STATUSSTR',index:'STATUSSTR', width:'5%',hidden: true},
		{name:'REVIEWRESULTS',index:'REVIEWRESULTS', width:'5%',hidden: true},
		{name:'GOVREGISTRANUM',index:'GOVREGISTRANUM', width:'10%',
			formatter:function(cellvalue, options, obj) { 
				   return '<a href="javascript:void(0);" onclick="display(\''+obj.REGISTRAID+'\')">'+obj.GOVREGISTRANUM+'</a>';
			}
		},
		{name:'ORGNAME',index:'ORGNAME', width:'8%'},
		{name:'ENTNAME',index:'ENTNAME', width:'15%',
			formatter:function(cellvalue, options, obj) { 
				   return '<a href="javascript:void(0);" onclick="entDisplay(\''+obj.BUSINESSINFOID+'\',\''+obj.ENTNAME+'\')">'+obj.ENTNAME+'</a>';
			}
		},
		{name:'CHECKCONTENT',index:'CHECKCONTENT',width:'20%',align:'left'},
		{name:'REINFO',index:'REINFO',width:'20%',align:'left'},
		{name:'RETIME',index:'RETIME',width:'8%',align:'left',
			formatter : function(cellvalue, options, obj) {
				return getFormatDateByLong(obj.RETIME,
				"yyyy-MM-dd");
			}
		},
		{name:'ENDTIME',index:'ENDTIME',width:'8%',align:'left',
			formatter : function(cellvalue, options, obj) {
				return getFormatDateByLong(obj.ENDTIME,
				"yyyy-MM-dd");
			}
		},
		{name:'REVIEWORG',index:'REVIEWORG',width:'8%',align:'left'},
		{name:'CLCASEORG',index:'CLCASEORG',width:'8%',align:'left'},
		{name:'STATUS',index:'STATUS', width:'7%',
			formatter:function(cellvalue, options, obj) { 
				if(obj.STATUS=='2'){
					//逾期未整改
					return "逾期未整改";
				}else if(obj.STATUS=='0'){
					//未整改
					return "逾期未整改";
				}else if(obj.STATUS=='1'){
					//整改完成
					return "已整改";
				}else if(obj.STATUS=='3'){
					//已复查
					return "已复查";
				}else if(obj.STATUS=='4'){
					//已销案
					return "已销案";
				}
			}
	    }
	];
	
	var tableHeight = $(window).height() - $('.pcheck').height() - 190;
	$(window).on('resize.jqGrid', function () {
		$("#grid-table").jqGrid( 'setGridHeight', $(window).height() - $('.pcheck').height() - 190 );
		$("#grid-table").jqGrid( 'setGridWidth', $(window).width()*0.99 );
    })
    $("#grid-table").jqGrid({
    	height: tableHeight,
    	url : BASE_URL + "/hiddendanger/hdigovreceive/list",
		datatype: "json",
		cache : false,
		mtype : 'post',
		colNames:colname,
		colModel:colmodel,
		postData:{
			retimestart:$("#retimestart").val(),
			retimeend:$("#retimeend").val(),
			entname:$("#entname").val(),
			subjection:$("#subjection").val(),
			districtid:$("#districtid").val()
		},
		sortname : 'retime',
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
		caption: "隐患接收",
		autowidth: true,
		loadComplete: function() {
			if($(window).width() < 700) {
				$('.ui-jqgrid-htable').css({"width":"900"});
				$("#grid-table").css({"width":"900" });
				$("#grid-table").closest(".ui-jqgrid-bdiv").css({ "overflow-x" : "scroll"});
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
				retimestart:$("#retimestart").val(),
				retimeend:$("#retimeend").val(),
				entname:$("#entname").val(),
				subjection:$("#subjection").val(),
				districtid:$("#districtid").val()
			             }
	}).trigger("reloadGrid");
}

/*加载行政区域*/
function searchDistrict(districtid){
	$("#districtid").val(districtid);
	reloadGrid();
}

/*搜索查询*/
$("#searchBtn").bind("click",function(){
	reloadGrid();
});

/*重置*/
$("#resetBtn").bind("click",function(){
	$("#retimestart").val("");
	$("#retimeend").val("");
	$("#entname").val("");
	$("#subjection").val("");
	$("#districtid").val("");
});

/*隐患详细信息*/
function display(registraid){
	parent.openWin(BASE_URL+'/hiddendanger/hdigovregistra/display/'+registraid,'隐患详细','','85%');
}

/*企业详细信息*/
function entDisplay(businessinfoid,entname) {
	// parent.openWin(BASE_URL+'/enterprise/entsafeinfomenu/safemenuDisplay/'+businessinfoid,entname,'80%','90%');
    parent.openWin(BASE_URL+"/views/module/enterprise/entbusinessinfo/displayEntbusinessinfo.html?businessinfoid="+businessinfoid,'详细','90%','90%');
}

/*复查*/
$("#reviewBtn").on("click", function () {
	var ids = $("#grid-table").jqGrid('getGridParam','selarrrow');
	if(ids.length !=1){
		// 弹出提示信息
		parent.toast("请选择一条记录！");
		return;
	}
	var rowdata = $("#grid-table").jqGrid('getRowData',ids[0]); //选中的一条记录
	var registraid = rowdata.REGISTRAID;
	var businessinfoid = rowdata.BUSINESSINFOID;
	var statusstr = rowdata.STATUSSTR;
	if(statusstr != 1){
		// 弹出提示信息
		parent.toast("只能对已整改的隐患进行复查！");
		return;
	} 
	parent.openWin(BASE_URL+'/hiddendanger/hdigovreview/review/'+registraid+'/'+businessinfoid,'复查','60%','85%');
	
});

/*销案*/
$("#clcaseBtn").on("click", function () {
	var ids = $("#grid-table").jqGrid('getGridParam','selarrrow');
	if(ids.length !=1){
		// 弹出提示信息
		parent.toast("请选择一条记录！");
		return;
	}
	var rowdata = $("#grid-table").jqGrid('getRowData',ids[0]); //选中的一条记录
	var registraid = rowdata.REGISTRAID;
	var businessinfoid = rowdata.BUSINESSINFOID;
	var statusstr = rowdata.STATUSSTR;
	var reviewresults = rowdata.REVIEWRESULTS;
	
	if(statusstr != 3){
		// 弹出提示信息
		parent.toast("只能对已复查的隐患进行销案！");
		return;
	} 
	if(reviewresults == 0){
		// 弹出提示信息
		parent.toast("复查不合格不能进行销案！");
		return;
	}
	parent.openWin(BASE_URL+'/hiddendanger/hdigovcancelcase/closecase/'+registraid+'/'+businessinfoid,'销案','40%','40%');
	
});