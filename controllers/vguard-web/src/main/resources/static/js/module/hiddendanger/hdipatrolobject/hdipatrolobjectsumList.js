$(document).ready(function() {
	
	//是否规模企业
	SelectOption.loadTureFalse("isscale");
	//是否三小场所
	SelectOption.loadTureFalse("islittle");
	//单位隶属关系
	SelectOption.loadSubjection("subjection");
	//行政主管部门
	//SelectTree.loadOrgByOrgidSelect("orgname",{"orgid":$("#orgid").val()});
	//行业主管分类
	SelectOption.loadIndustryType("directortypeid");
	
	var colname = ['巡查对象名称','通讯地址','主要负责人','负责人电话','属地区域','行业主管分类','巡查次数','自查次数']; 
	var colmodel = [
		{name:'ENTNAME',index:'ENTNAME',width:'20%',align:'left',
			formatter:function(cellvalue, options, obj) { 
				return '<a href="javascript:void(0);" onclick="display(\''+obj.BUSINESSINFOID+'\',\''+obj.ENTNAME+'\')">'+obj.ENTNAME+'</a>';
			}
		},
		{name:'ADDRESS',index:'ADDRESS', width:'20%',align:'left'},
		{name:'LEGALPERSON',index:'LEGALPERSON',width:'10%',align:'center'},
		{name:'PHONE',index:'PHONE',width:'10%',align:'center'},
		{name:'DISTRICT',index:'DISTRICT',width:'15%',align:'left'},
		{name:'DIRECTORTYPENAME',index:'DIRECTORTYPENAME',width:'15%',align:'left'},
		{name:'XCCS',index:'XCCS',width:'5%',align:'center'},
		{name:'ZCCS',index:'ZCCS',width:'5%',align:'center'}
	];

	var tableHeight = $(window).height() - $('.pcheck').height() - 190;
	$(window).resize(function(){
		$("#grid-table").jqGrid( 'setGridHeight', $(window).height() - $('.pcheck').height() - 190 );
		$("#grid-table").jqGrid( 'setGridWidth', $(window).width()*0.99 );
	});
		
    $("#grid-table").jqGrid({
    	height: tableHeight,
    	url : BASE_URL + "/hiddendanger/hdipatrolobject/sumlist",
		datatype: "json",
		cache : false,
		mtype : 'post',
		colNames:colname,
		colModel:colmodel,
		postData:{
			entname:$("#entname").val(),
			isscale:$("#isscale").val(),
			islittle:$("#islittle").val(),
			//orgid:$("#orgname_select").val(),
			subjection:$("#subjection").val(),
			directortypeid:$("#directortypeid").val(),
			districtid:$("#districtid").val()
		},
		sortname : 'XCCS',
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
		caption: "巡查对象统计列表",
		autowidth: true,
		loadComplete: function() {
			if($(window).width() < 700) {
				$('.ui-jqgrid-htable').css({"width":"900"});
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
	$("#grid-table").jqGrid('setGridParam',{
		page:1,postData:{
			entname:$("#entname").val(),
			isscale:$("#isscale").val(),
			islittle:$("#islittle").val(),
			//orgid:$("#orgname_select").val(),
			subjection:$("#subjection").val(),
			directortypeid:$("#directortypeid").val(),
			districtid:$("#districtid").val()
			}
	}).trigger("reloadGrid");
}

/*搜索查询*/
$("#searchbtn").bind("click",function(){
	reloadGrid();
});

/*重置*/
$("#resetbtn").bind("click",function(){
	$("#entname").val();
	$("#isscale").val();
	$("#islittle").val();
	//$("#orgname_select").val();
	$("#subjection").val();
	$("#directortypeid").val();
	$("#districtid").val();
});


/**
 * 企业安全信息
 * @param businessinfoid
 * @param entname
 */
function display(businessinfoid,entname){
	// parent.openWin(BASE_URL+'/enterprise/entsafeinfomenu/safemenuDisplay/'+businessinfoid,entname,'80%','90%');
    parent.openWin(BASE_URL+"/views/module/enterprise/entbusinessinfo/displayEntbusinessinfo.html?businessinfoid="+businessinfoid,'详细','90%','90%');
}

/*导出*/
$("#exportBtn").on("click", function () {
	var entname = $("#entname").val();
	var isscale = $("#isscale").val();
	var subjection = $("#subjection").val();
	var islittle = $("#islittle").val();
	var directortypeid = $("#directortypeid").val();
	var districtid = $("#districtid").val();
	window.location.href = 	BASE_URL+"/hiddendanger/hdipatrolobject/exportsum?entname="+entname+"&isscale="+isscale+"&subjection="+subjection+"&islittle="+islittle+"&directortypeid="+directortypeid+"&districtid="+districtid;
});
 

