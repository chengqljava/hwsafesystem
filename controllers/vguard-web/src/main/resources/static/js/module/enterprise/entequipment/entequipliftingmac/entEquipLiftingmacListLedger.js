$(document).ready(function() {
	initSeachInput();
	initDateSeach("stime","etime");
	
	var colname = ['起重机械id','设备编号','设备名称','设备类别','额定起重量（t）','投用日期','检验日期','下次检验日期','检验结论']; 
	var colmodel = [
		{name:'LIFITINGID',index:'LIFITINGID', width:'5%',hidden: true},
		{name:'EQUIPCODE',index:'EQUIPCODE',width:'10%',align:'left'},
		{name:'EQUIPNAME',index:'EQUIPNAME',width:'10%',align:'left',
			formatter:function(cellvalue, options, obj) { 
				   return '<a href="javascript:void(0);" onclick="display(\''+obj.LIFITINGID+'\')">'+obj.EQUIPNAME+'</a>';
			}
		},
		{name:'EQUIPTYPE',index:'EQUIPTYPE',width:'10%',align:'left'},
		{name:'LIFTINGWEIGHT',index:'LIFTINGWEIGHT',width:'15%',align:'left'},
		{name:'USEDATE',index:'USEDATE',width:'10%',align:'left',
			formatter:function(cellvalue, options, obj) { 
				if (obj.USEDATE) {
					return getSmpFormatDateByLong(obj.USEDATE, false);
				} else {
					return "--";
				}
			}
		},
		{name:'INSPECTDATE',index:'INSPECTDATE',width:'10%',align:'left',
			formatter:function(cellvalue, options, obj) { 
				if (obj.INSPECTDATE) {
					return getSmpFormatDateByLong(obj.INSPECTDATE, false);
				} else {
					return "--";
				}
			}
		},
		{name:'NEXTINSPECTDATE',index:'NEXTINSPECTDATE',width:'10%',align:'left',
			formatter:function(cellvalue, options, obj) { 
				if (obj.NEXTINSPECTDATE) {
					return getSmpFormatDateByLong(obj.NEXTINSPECTDATE, false);
				} else {
					return "--";
				}
			}
		},
		{name:'INSPECTRESULT',index:'INSPECTRESULT',width:'10%',align:'left',
			formatter:function(cellvalue, options, obj) { 
				if (obj.INSPECTRESULT) {
					return SelectOption.loadTestResultData(obj.INSPECTRESULT);
				} else {
					return "--";
				}
			}
		}
	];


	var tableHeight = $(window).height() - $('.pcheck').height() - 190 - 33;
	$(window).resize(function(){
		$("#grid-table").jqGrid( 'setGridHeight', $(window).height() - $('.pcheck').height() - 190 - 33 );
		$("#grid-table").jqGrid( 'setGridWidth', $(window).width() - 96 );
	});

    $("#grid-table").jqGrid({
    	height: tableHeight,
    	url : BASE_URL + "/enterprise/entequipliftingmac/list",
		datatype: "json",
		cache : false,
		mtype : 'post',
		colNames:colname,
		colModel:colmodel,
		postData:{
			entid:$("#entid").val()
		},
		sortname : 'usedate',
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
		caption: "起重机械列表",
		//autowidth: true,
		loadComplete: function() {
			if($(window).width() < 700) {
				$('.ui-jqgrid-htable').css({"width":"900"});
				$("#grid-table").css({"width":"900" });
				$("#grid-table").closest(".ui-jqgrid-bdiv").css({ "overflow-x" : "scroll"});
				$(".ui-jqgrid-hdiv").css({ "overflow-x" : "scroll"});
			} else {
				$("#grid-table").jqGrid( 'setGridWidth', $(window).width() - 96 );
			}
		}
	});
});

/*搜索查询*/
$("#searchBtn").bind("click",function(){
	reloadGrid();
});

/*重置*/
$("#resetbtn").bind("click",function(){
	$("#searchForm").each(function(){
		$(this).val("");
	});
	$("#stime").val("");
	$("#etime").val("");
	$('#daterange-btn span').html(" 日期选择");
});


/*加载*/
function reloadGrid(){
	$("#grid-table").jqGrid('setGridParam',{
		page:1,postData:{
			entid:$("#entid").val(),
			equipname:$("#equipname").val(),
			equipcode:$("#equipcode").val(),
            stime:$("#stime").val(),
			etime:$("#etime").val()
		}
	}).trigger("reloadGrid");
}



/*详细查询*/
function display(lifitingid){
	parent.parent.openWin(BASE_URL+"/enterprise/entequipliftingmac/display/"+lifitingid,'详细','65%','65%');
}