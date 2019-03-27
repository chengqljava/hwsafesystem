$(document).ready(function() {
//	SelectOption.loadSubjection("subjection");//单位管辖隶属关系
	initSeachInput();
	var colname = ['工商信息id','分类分级id','企业名称','行业主管分类','行业行政主管部门','地址','负责人','联系电话','分级状态','分级']; 
	var colmodel = [
		{name:'BUSINESSINFOID',index:'BUSINESSINFOID', width:'5%',hidden: true},
		{name:'CLASSGRADEID',index:'CLASSGRADEID', width:'5%',hidden: true},
		{name:'ENTNAME',index:'ENTNAME',width:'20%',align:'left',
			formatter:function(cellvalue, options, obj) { 
				   return '<a href="javascript:void(0);" onclick="entDisplay(\''+obj.BUSINESSINFOID+'\')">'+obj.ENTNAME+'</a>';
			}
		},
		{name:'DIRECTORTYPENAME',index:'DIRECTORTYPENAME',width:'20%',align:'left'},
		{name:'ALLORGNAME',index:'ALLORGNAME',width:'30%',align:'left'},
		{name:'ADDRESS',index:'ADDRESS',width:'20%',align:'left'},
		{name:'LEGALPERSON',index:'DIRECTORTYPEID',width:'6%',align:'left'},
		{name:'PHONE',index:'PHONE',width:'8%',align:'left'},
		{name:'GRADENAME',index:'ALTERGRADE',width:'8%',align:'left',
			formatter:function(cellvalue, options, obj) { 
				   return '<a href="javascript:void(0);" onclick="gradeDisplay(\''+obj.BUSINESSINFOID+'\',\''+obj.CLASSGRADEID+'\',\''+obj.ALTERGRADE+'\')">'+obj.GRADENAME+'</a>';
			}
		},
		{name:'ALTERGRADE',index:'ALTERGRADE',width:'5%',align:'left',hidden: true},
		
	];
	var tableHeight = $(window).height() - $('.pcheck').height() - 190;
	$(window).on('resize.jqGrid', function () {
		$("#grid-table").jqGrid( 'setGridWidth', $(window).width()*0.99 );
		$("#grid-table").jqGrid( 'setGridHeight', $(window).height() - $('.pcheck').height() - 190 );
    })

    $("#grid-table").jqGrid({
    	height: tableHeight,
    	url : BASE_URL + "/enterprise/entclassgrade/list",
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
		caption: "分类分级",
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

/*修改分级*/
$("#editBtn").on("click", function () {
	var ids = $("#grid-table").jqGrid('getGridParam','selarrrow');
	if(ids.length !=1){
		// 弹出提示信息
		parent.toast("请选择一条记录！");
		return;
	}
	var rowdata = $("#grid-table").jqGrid('getRowData',ids[0]); //选中的一条记录
	var classgradeid = rowdata.CLASSGRADEID; //分类分级id
	var businessinfoid = rowdata.BUSINESSINFOID; //工商信息id
	var altergrade = rowdata.ALTERGRADE; //级别
	if(altergrade !=0){
		parent.toast("本年度已分级！");
		return;
	}else{
		parent.openWin(BASE_URL+'/enterprise/entclassgrade/edit/'+classgradeid+'/'+businessinfoid,'编辑','','65%');
	}
});

/*企业详细查询*/
function entDisplay(businessinfoid,entname){
	// parent.openWin(BASE_URL+'/enterprise/entsafeinfomenu/safemenuDisplay/'+businessinfoid,entname,'80%','90%');
    parent.openWin(BASE_URL+"/views/module/enterprise/entbusinessinfo/displayEntbusinessinfo.html?businessinfoid="+businessinfoid,'详细','90%','90%');
}

/*分类分级详细查询*/
function gradeDisplay(businessinfoid,classgradeid,altergrade){
	if(altergrade == 0){
		// 弹出提示信息
		parent.toast("请选择已分级记录！");
		return;
	}
	parent.openWin(BASE_URL+'/enterprise/entclassgrade/display/'+classgradeid+'/'+businessinfoid,'详细','','65%');
}

