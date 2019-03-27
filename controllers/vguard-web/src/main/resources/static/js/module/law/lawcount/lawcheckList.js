$(document).ready(function() {
	
	var colname = ['企业id','企业名称','企业地址','行业类型','企业负责人','联系电话','是否检查']; 
	var colmodel = [
		{name:'LAWENTID',index:'LAWENTID', width:'5%',hidden: true},
		{name:'ENTNAME',index:'ENTNAME',width:'20%',align:'left',
			formatter:function(cellvalue, options, obj) { 
				   return '<a href="javascript:void(0);" onclick="display(\''+obj.BUSINESSINFOID+'\',\''+obj.ENTNAME+'\')">'+obj.ENTNAME+'</a>';
			}
		},
		{name:'ADDRESS',index:'ADDRESS',width:'20%',align:'left'},
		{name:'DIRECTORTYPENAME',index:'DIRECTORTYPENAME',width:'10%',align:'left'},
		{name:'LEGALPERSON',index:'LEGALPERSON',width:'10%',align:'center'},
		{name:'PHONE',index:'PHONE',width:'10%',align:'center'},
		{name:'STATE',index:'STATE',width:'10%',align:'center',
			formatter:function(cellvalue, options, obj) { 
				return SelectOption.getLawEntState(obj.STATE);
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
    	url : BASE_URL + "/law/lawcheckent/list",
		datatype: "json",
		cache : false,
		mtype : 'post',
		colNames:colname,
		colModel:colmodel,
		postData:{
			planid:$("#planid").val(),
			state:$("#state").val()
		},
		sortname : 'LAWENTID',
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
		rowNum:15,
		rowList:[15,30,45],
		altRows: true,
		caption: $("#title").val(),
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

/*详细查询*/
function display(businessinfoid,entname){
	// parent.openWin(BASE_URL+'/enterprise/entsafeinfomenu/safemenuDisplay/'+businessinfoid,entname,'80%','90%');
    parent.openWin(BASE_URL+"/views/module/enterprise/entbusinessinfo/displayEntbusinessinfo.html?businessinfoid="+businessinfoid,'详细','90%','90%');
}

 

