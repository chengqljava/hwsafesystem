$(document).ready(function() {
	
	var colname = ['主键id','企业名称','发证机关','证书编号','发证日期','证书有效期','许可范围']; 
	var colmodel = [
		{name:'BUSINESSINFOID',index:'BUSINESSINFOID', width:'5%',hidden: true},
		{name:'ENTNAME',index:'ENTNAME',width:'20%',align:'left',
			formatter:function(cellvalue, options, obj) { 
				   return '<a href="javascript:void(0);" onclick="display(\''+obj.BUSINESSINFOID+'\',\''+obj.ENTNAME+'\')">'+obj.ENTNAME+'</a>';
			}
		},
		{name:'LICENCEISSUING',index:'LICENCEISSUING',width:'15%',align:'left'},
		{name:'CERTIFICATENUM',index:'CERTIFICATENUM',width:'15%',align:'left'},
		{name:'OPENDATE',index:'OPENDATE',width:'10%',align:'left',
			formatter : function(cellvalue, options, obj) {
				return getFormatDateByLong(obj.OPENDATE, "yyyy-MM-dd");
			}
		},
		{name:'EXPIRYDATE',index:'EXPIRYDATE',width:'10%',align:'left',
			formatter : function(cellvalue, options, obj) {
				return getFormatDateByLong(obj.EXPIRYDATE, "yyyy-MM-dd");
			}
		},
		{name:'TOLRANGE',index:'TOLRANGE',width:'25%',align:'left'}
	];

	var tableHeight = $(window).height() - $('.pcheck').height() - 190;
	$(window).resize(function(){
		$("#grid-table").jqGrid( 'setGridHeight', $(window).height() - $('.pcheck').height() - 190 );
		$("#grid-table").jqGrid( 'setGridWidth', $(window).width()*0.99 );
	});
    $("#grid-table").jqGrid({
    	height: tableHeight,
    	url : BASE_URL + "/enterprise/dangerentcount/chelicencelist",
		datatype: "json",
		cache : false,
		mtype : 'post',
		colNames:colname,
		colModel:colmodel,
		postData:{
			year:$("#year").val(), 
			chemicaltypeid:$("#chemicaltypeid").val(),
			districtid:$("#districtid").val()
		},
		sortname : 'OPENDATE',
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
		caption: "危化品企业证书",
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
function reloadGrid(districtcode,districtname){
	$("#grid-table").jqGrid('setGridParam',{
		page:1,postData:{
			year:$("#year").val(), 
			chemicaltypeid:$("#chemicaltypeid").val(),
			districtid:$("#districtid").val()
			             }
	}).trigger("reloadGrid");
}

/*详细查询*/
function display(businessinfoid,entname){
	// parent.openWin(BASE_URL+'/enterprise/entsafeinfomenu/safemenuDisplay/'+businessinfoid,entname,'80%','90%');
    parent.openWin(BASE_URL+"/views/module/enterprise/entbusinessinfo/displayEntbusinessinfo.html?businessinfoid="+businessinfoid,'详细','90%','90%');
}

