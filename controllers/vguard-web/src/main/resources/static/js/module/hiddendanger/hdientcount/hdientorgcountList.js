$(document).ready(function() {
	
	var colname = ['区域','企业数','基础信息采集数','采集率','自查数','自查率','自查隐患数','自查整改数','自查整改率','巡查数','巡查率','巡查隐患数','巡查整改数','巡查整改率']; 
	var colmodel = [
		{name:'ORGNAME',index:'ORGNAME',width:'20%',align:'left',
			formatter:function(cellvalue, options, obj) { 
				return '<a href="javascript:void(0);" onclick="getEntDistrictCountList(\''+obj.ORGID+'\')">'+obj.ORGNAME+'</a>';
			}
		},
		{name:'ENTQTY',index:'ENTQTY', width:'8%',align:'center'},
		{name:'ENTCOLLECTQTY',index:'ENTCOLLECTQTY',width:'8%',align:'center'},
		{name:'COLLECTRATE',index:'COLLECTRATE',width:'8%',align:'center'},
		{name:'SELFCHECKQTY',index:'SELFCHECKQTY',width:'8%',align:'center'},
		{name:'SELFCHECKRATE',index:'SELFCHECKRATE',width:'8%',align:'center'},
		{name:'SELFCHECKHDQTY',index:'SELFCHECKHDQTY',width:'8%',align:'center'},
		{name:'SELFCHECKREFORMQTY',index:'SELFCHECKREFORMQTY',width:'8%',align:'center'},
		{name:'SELFCHECKREFORMRATE',index:'SELFCHECKREFORMRATE', width:'8%',align:'center'},
		{name:'PATROLQTY',index:'PATROLQTY',width:'8%',align:'center'},
		{name:'PATROLRATE',index:'PATROLRATE',width:'8%',align:'center'},
		{name:'PATROLHDQTY',index:'PATROLHDQTY',width:'8%',align:'center'},
		{name:'PATROLREFORMQTY',index:'PATROLREFORMQTY',width:'8%',align:'center'},
		{name:'PATROLREFORMRATE',index:'PATROLREFORMRATE',width:'8%',align:'center'}
	];
	
	$(window).on('resize.jqGrid', function () {
		$("#grid-table").jqGrid( 'setGridWidth', $(window).width()*0.99 );
    })

    $("#grid-table").jqGrid({
    	height: 250,
    	url : BASE_URL + "/hiddendanger/hdientcount/entorgcountlist",
		datatype: "json",
		cache : false,
		mtype : 'post',
		colNames:colname,
		colModel:colmodel,
		postData:{
			year:$("#year").val(),
			quarter:$("#quarter").val(),
			orgid:$("#orgid").val()
		},
		sortname : 'ORGNAME',
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


/*加载*/
function reloadGrid(){
	$("#grid-table").jqGrid('setGridParam',{
		page:1,postData:{
			year:$("#year").val(),
			quarter:$("#quarter").val(),
			orgid:$("#orgid").val()
			}
	}).trigger("reloadGrid");
}

/**
 * 
 */
function getEntDistrictCountList(orgid){
	$("#orgid").val(orgid);
	reloadGrid();
}

