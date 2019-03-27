$(document).ready(function() {
	
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
	
	$(window).on('resize.jqGrid', function () {
		$("#grid-table").jqGrid( 'setGridWidth', $(window).width()*0.99 );
    })

    $("#grid-table").jqGrid({
    	height: 250,
    	url : BASE_URL + "/hiddendanger/hdientcount/patrolentlist",
		datatype: "json",
		cache : false,
		mtype : 'post',
		colNames:colname,
		colModel:colmodel,
		postData:{
			patrolstate:$("#patrolstate").val(),
			year:$("#year").val(),
			quarter:$("#quarter").val(),
			restate:$("#restate").val()
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

/**
 * 企业安全信息
 * @param businessinfoid
 * @param entname
 */
function display(businessinfoid,entname){
	// parent.openWin(BASE_URL+'/enterprise/entsafeinfomenu/safemenuDisplay/'+businessinfoid,entname,'80%','90%');
    parent.openWin(BASE_URL+"/views/module/enterprise/entbusinessinfo/displayEntbusinessinfo.html?businessinfoid="+businessinfoid,'详细','90%','90%');
}

