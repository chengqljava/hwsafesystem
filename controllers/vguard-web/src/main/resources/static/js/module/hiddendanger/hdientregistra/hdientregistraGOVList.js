$(document).ready(function() {
	SelectOption.loadSubjection("subjection");//单位管辖隶属关系
	
	var colname = ['企业工商id','企业名称','整改中数','已整改数','逾期未整改数']; 
	var colmodel = [
		{name:'BUSINESSINFOID',index:'BUSINESSINFOID', width:'5%',hidden: true},
		{name:'ENTNAME',index:'ENTNAME', width:'30%',
			formatter:function(cellvalue, options, obj) { 
				   return '<a href="javascript:void(0);" onclick="display(\''+obj.BUSINESSINFOID+'\',\''+obj.ENTNAME+'\')">'+obj.ENTNAME+'</a>';
			}	
		},
		{name:'NOABARBEITUNG',index:'NOABARBEITUNG',width:'15%',align:'left',
			formatter:function(cellvalue, options, obj) { 
				   return '<a href="javascript:void(0);" onclick="listEntRegistra(\''+obj.BUSINESSINFOID+'\',0)">'+obj.NOABARBEITUNG+'</a>';
			}	
		},
		{name:'YESABARBEITUNG',index:'YESABARBEITUNG',width:'15%',align:'left',
				formatter:function(cellvalue, options, obj) { 
					   return '<a href="javascript:void(0);" onclick="listEntRegistra(\''+obj.BUSINESSINFOID+'\',1)">'+obj.YESABARBEITUNG+'</a>';
				}	
		},
		{name:'OVERABARBEITUNG',index:'OVERABARBEITUNG',width:'15%',align:'left',
				formatter:function(cellvalue, options, obj) { 
					   return '<a href="javascript:void(0);" onclick="listEntRegistra(\''+obj.BUSINESSINFOID+'\',2)">'+obj.OVERABARBEITUNG+'</a>';
				}	
		},
	];
	var tableHeight = $(window).height() - $('.pcheck').height() - 190;
	$(window).on('resize.jqGrid', function () {
		$("#grid-table").jqGrid( 'setGridHeight', $(window).height() - $('.pcheck').height() - 190 );
		$("#grid-table").jqGrid( 'setGridWidth', $(window).width()*0.99);
    })

    $("#grid-table").jqGrid({
    	height: tableHeight,
    	url : BASE_URL + "/hiddendanger/hdientregistra/gov/list",
		datatype: "json",
		cache : false,
		mtype : 'post',
		colNames:colname,
		colModel:colmodel,
		postData:{
			entname:$("#entname").val(),
			subjection:$("#subjection").val(),
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
		caption: "隐患信息",
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
					districtid:$("#districtid").val(),
					subjection:$("#subjection").val(),
					entname:$("#entname").val()
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
	$("#districtid").val("");
	$("#subjection").val("");
	$("#entname").val("");
});

/**隐患列表*/
function listEntRegistra(businessinfoid,status){
	parent.openWin(BASE_URL+'/hiddendanger/hdientregistra/intoEntRegistra/'+businessinfoid+'/'+ status,'隐患整改','','65%');
}

/*企业详细查询*/
function display(businessinfoid,entname){
	// parent.openWin(BASE_URL+'/enterprise/entsafeinfomenu/safemenuDisplay/'+businessinfoid,entname,'80%','90%');
    parent.openWin(BASE_URL+"/views/module/enterprise/entbusinessinfo/displayEntbusinessinfo.html?businessinfoid="+businessinfoid,'详细','90%','90%');
}