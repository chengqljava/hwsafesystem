$(document).ready(function() {
	initSeachInput();
	initDateSeach("stime","etime");
	
	var colname = ['锅炉id','设备名称','型号规格','登记编号','检定日期','有效期至','工作介质','安装位置']; 
	var colmodel = [
		{name:'BOLIERID',index:'BOLIERID', width:'5%',hidden: true},
		{name:'DEVICENAME',index:'DEVICENAME',width:'15%',align:'left',
			formatter:function(cellvalue, options, obj) { 
				   return '<a href="javascript:void(0);" onclick="display(\''+obj.BOLIERID+'\')">'+obj.DEVICENAME+'</a>';
			}
		},
		{name:'SPECMODEL',index:'SPECMODEL',width:'10%',align:'left'},
		{name:'REGISTNUMBER',index:'REGISTNUMBER',width:'10%',align:'left'},
		{name:'TESTTIME',index:'TESTTIME',width:'10%',align:'left',
			formatter:function(cellvalue, options, obj) { 
				if (obj.TESTTIME) {
					return getSmpFormatDateByLong(obj.TESTTIME, false);
				} else {
					return "";
				}
			}
		},
		{name:'EFFECTIVETIME',index:'EFFECTIVETIME',width:'10%',align:'left',
			formatter:function(cellvalue, options, obj) { 
				if (obj.EFFECTIVETIME) {
					return getSmpFormatDateByLong(obj.EFFECTIVETIME, false);
				} else {
					return "";
				}
			}
		},
		{name:'WORKINGMEDIUM',index:'WORKINGMEDIUM',width:'10%',align:'left'},
		{name:'INSTALPOSITION',index:'INSTALPOSITION',width:'10%',align:'left'},
	];


	var tableHeight = $(window).height() - $('.pcheck').height() - 190 - 33;
	$(window).resize(function(){
		$("#grid-table").jqGrid( 'setGridHeight', $(window).height() - $('.pcheck').height() - 190 - 33 );
		$("#grid-table").jqGrid( 'setGridWidth', $(window).width() - 96 );
	});

    $("#grid-table").jqGrid({
    	height: tableHeight,
    	url : BASE_URL + "/enterprise/entequipbolier/list",
		datatype: "json",
		cache : false,
		mtype : 'post',
		colNames:colname,
		colModel:colmodel,
		postData:{
			entid:$("#entid").val(),
			devicename:"",
			specmodel:""
		},
		sortname : 'TESTTIME',
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
		caption: "锅炉列表",
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
			devicename:$("#devicename").val(),
			specmodel:$("#specmodel").val(),
			stime:$("#stime").val(),
			etime:$("#etime").val()
		}
	}).trigger("reloadGrid");
}

/*详细查询*/
function display(bolierid){
	parent.parent.openWin(BASE_URL+"/enterprise/entequipbolier/display/"+bolierid,'详细','60%','55%');
}