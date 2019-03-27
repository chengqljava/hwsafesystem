$(document).ready(function() {
	initSeachInput();
	//危化品企业类型树
	SelectTree.loadChemicalEntTypeAllSelect("chemicaltype");
	//警示状态
//	SelectOption.loadPermitStatus("status");
	
	var colname = ['警示灯','企业名称','主要负责人','联系电话','许可类型','许可编号','证书有效期','发证机关']; 
	var colmodel = [
		{name:'STATUS',index:'STATUS', width:'5%',align:'center',
			formatter:function(cellvalue, options, obj) { 
				console.log(obj.STATUS);
				if(obj.STATUS=='1'){
					return "<img src='"+BASE_URL+"/images/permitlight/lightred.gif' title='超期'/>";
				}else if(obj.STATUS=='2'){
					return "<img src='"+BASE_URL+"/images/permitlight/lightyellow.gif' title='预超期'/>";
				}else{
					return "<img src='"+BASE_URL+"/images/permitlight/lightgreen.gif' title='正常'/>";
				}
			}
		},
		{name:'ENTNAME',index:'ENTNAME',width:'20%',align:'left',
			formatter:function(cellvalue, options, obj) { 
				   return '<a href="javascript:void(0);" onclick="display(\''+obj.BUSINESSINFOID+'\',\''+obj.ENTNAME+'\')">'+obj.ENTNAME+'</a>';
			}
		},
		{name:'LEGALPERSON',index:'LEGALPERSON',width:'10%',align:'left'},
		{name:'PHONE',index:'PHONE',width:'10%',align:'left'},
		{name:'CHEMICALTYPE',index:'CHEMICALTYPE',width:'15%',align:'left'},
		{name:'CERTIFICATENUM',index:'CERTIFICATENUM',width:'10%',align:'left'},
		{name:'EXPIRYDATE',index:'EXPIRYDATE',width:'10%',align:'left',
			formatter : function(cellvalue, options, obj) {
				return getFormatDateByLong(obj.EXPIRYDATE,"yyyy-MM-dd");
			}
		},
		{name:'LICENCEISSUING',index:'LICENCEISSUING',width:'10%',align:'left'}
	];


	var tableHeight = $(window).height() - $('.pcheck').height() - 190;
	$(window).resize(function(){
		$("#grid-table").jqGrid( 'setGridHeight', $(window).height() - $('.pcheck').height() - 190 );
		$("#grid-table").jqGrid( 'setGridWidth', $(window).width()*0.99 );
	});

    $("#grid-table").jqGrid({
    	height: tableHeight,
    	url : BASE_URL + "/enterprise/entpermitwarn/list",
		datatype: "json",
		cache : false,
		mtype : 'post',
		colNames:colname,
		colModel:colmodel,
		postData:{
			entname:$("#entname").val(), //企业名称
			chemicaltypeid:$("#chemicaltype_select").val(), //许可类型
			status:$("#status").val(),	//警示状态
			districtid:$("#districtid").val()
		},
		sortname : 'EXPIRYDATE',
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
		multiselect: false,
		caption: "许可预警",
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

/*加载行政区域*/
function searchDistrict(districtid){
	$("#districtid").val(districtid);
	reloadGrid();
}

/*加载*/
function reloadGrid(districtcode,districtname){
	var status = '';
	if ($("#status").val() == '超期') {
		status ='1';
	}else if($("#status").val() == '预超期'){
		status ='2';
	}else if($("#status").val() == '正常'){
		status ='3';
	}
	$("#grid-table").jqGrid('setGridParam',{
		page:1,postData:{
			entname:$("#entname").val(), //企业名称
			chemicaltypeid:$("#chemicaltype_select").val(), //许可类型
//			status:$("#status").val(),	//警示状态
			status:status,	//警示状态
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
	$("#chemicaltype").val("");
	$("#chemicaltype_select").val("");
	$("#status").val("");
});


/*企业安全信息*/
function display(businessinfoid,entname){
	// parent.openWin(BASE_URL+'/enterprise/entsafeinfomenu/safemenuDisplay/'+businessinfoid,entname,'80%','90%');
    parent.openWin(BASE_URL+"/views/module/enterprise/entbusinessinfo/displayEntbusinessinfo.html?businessinfoid="+businessinfoid,'详细','90%','90%');
}


