$(document).ready(function() {
	initSeachInput();
	//危化品企业类型树
	SelectTree.loadChemicalEntTypeAllSelect("chemicaltype");
	
	
	var colname = ['主键id','企业名称','地址','危险化学品企业类型','行业主管部门','负责人','联系电话','证照信息','更新时间','状态']; 
	var colmodel = [
		{name:'BUSINESSINFOID',index:'BUSINESSINFOID', width:'5%',hidden: true},
		{name:'ENTNAME',index:'ENTNAME',width:'20%',align:'left',
			formatter:function(cellvalue, options, obj) { 
				   return '<a href="javascript:void(0);" onclick="display(\''+obj.BUSINESSINFOID+'\',\''+obj.ENTNAME+'\')">'+obj.ENTNAME+'</a>';
			}
		},
		{name:'ADDRESS',index:'ADDRESS',width:'20%',align:'left'},
		{name:'CHEMICALTYPE',index:'CHEMICALTYPE',width:'15%',align:'left'},
		{name:'ALLORGNAME',index:'ALLORGNAME',width:'15%',align:'left'},
		{name:'LEGALPERSON',index:'DIRECTORTYPEID',width:'10%',align:'left'},
		{name:'PHONE',index:'PHONE',width:'10%',align:'left'},
		{name:'CHECKED',index:'CHECKED',width:'10%',align:'left',
			formatter : function(cellvalue, options, obj) {
				if(obj.CHECKED=="true"){
					return '<a href="javascript:void(0);" onclick="displayPhoto(\''+obj.BUSINESSINFOID+'\')">查看</a>';
				}else{
					return '无';
				}
			}
		},
		{name:'UPDATETIME',index:'UPDATETIME',width:'10%',align:'left',
			formatter : function(cellvalue, options, obj) {
				return getFormatDateByLong(obj.UPDATETIME,"yyyy-MM-dd hh:mm:ss");
			}
		},
		{name:'ENTSTATUS',index:'ENTSTATUS',width:'10%',align:'left'}
	];


	var tableHeight = $(window).height() - $('.pcheck').height() - 190;
	$(window).resize(function(){
		$("#grid-table").jqGrid( 'setGridHeight', $(window).height() - $('.pcheck').height() - 190 );
		$("#grid-table").jqGrid( 'setGridWidth', $(window).width()*0.99 );
	});
    $("#grid-table").jqGrid({
    	height: tableHeight,
    	url : BASE_URL + "/enterprise/dangerent/list",
		datatype: "json",
		cache : false,
		mtype : 'post',
		colNames:colname,
		colModel:colmodel,
		postData:{
			entname:$("#entname").val(), //企业名称
			chemicaltypeid:$("#menu_chemicaltypeid").val(), //危化品企业类型
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
		caption: "危化品企业",
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
	$("#grid-table").jqGrid('setGridParam',{
		page:1,postData:{
					entname:$("#entname").val(),
					chemicaltypeid:$("#chemicaltype_select").val(), //危化品企业类型
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
});


/*企业安全信息*/
function display(businessinfoid,entname){
	// parent.openWin(BASE_URL+'/enterprise/entsafeinfomenu/safemenuDisplay/'+businessinfoid,entname,'80%','90%');
    parent.openWin(BASE_URL+"/views/module/enterprise/entbusinessinfo/displayEntbusinessinfo.html?businessinfoid="+businessinfoid,'详细','90%','90%');
}

/*许可证照片*/
function displayPhoto(businessinfoid){
	parent.openWin(BASE_URL+'/enterprise/dangerent/permitphoto/'+businessinfoid,'许可证照信息','80%','90%');
}
