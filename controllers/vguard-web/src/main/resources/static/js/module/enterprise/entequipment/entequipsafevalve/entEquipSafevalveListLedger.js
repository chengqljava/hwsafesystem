$(document).ready(function() {
	initSeachInput();
	initDateSeach("stime","etime");
	
	var colname = ['安全阀id','型号规格','检验编号','整定压力（Mpa）','核准证号','工作介质','安装位置','检定日期','使用有效期']; 
	var colmodel = [
		{name:'SAFEVALVEID',index:'SAFEVALVEID', width:'5%',hidden: true},
		{name:'SPECODEL',index:'SPECODEL',width:'10%',align:'left',
			formatter:function(cellvalue, options, obj) { 
				   return '<a href="javascript:void(0);" onclick="display(\''+obj.SAFEVALVEID+'\')">'+obj.SPECODEL+'</a>';
			}
		},
		{name:'TESTCODE',index:'TESTCODE',width:'10%',align:'left'},
		{name:'SETPRESSURE',index:'SETPRESSURE',width:'10%',align:'left'},
		{name:'APPROVALCODE',index:'APPROVALCODE',width:'10%',align:'left'},
		{name:'WORKINGMEDIUM',index:'WORKINGMEDIUM',width:'10%',align:'left'},
		{name:'INSTALPOSITION',index:'INSTALPOSITION',width:'15%',align:'left'},
		{name:'APPRAISALTIME',index:'APPRAISALTIME',width:'10%',align:'left',
			formatter:function(cellvalue, options, obj) { 
				if (obj.APPRAISALTIME) {
					return getSmpFormatDateByLong(obj.APPRAISALTIME, false);
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
		}
	];


	var tableHeight = $(window).height() - $('.pcheck').height() - 190 - 33;
	$(window).resize(function(){
		$("#grid-table").jqGrid( 'setGridHeight', $(window).height() - $('.pcheck').height() - 190 - 33 );
		$("#grid-table").jqGrid( 'setGridWidth', $(window).width() - 96 );
	});

    $("#grid-table").jqGrid({
    	height: tableHeight,
    	url : BASE_URL + "/enterprise/entequipsafevalve/list",
		datatype: "json",
		cache : false,
		mtype : 'post',
		colNames:colname,
		colModel:colmodel,
		postData:{
			entid:$("#entid").val()
		},
		sortname : 'APPRAISALTIME',
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
		caption: "安全阀列表",
		autowidth: true,
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
    
    /*搜索查询*/
    $("#searchBtn").bind("click",function(){
        reloadGrid();
    });
    
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
			testcode:$("#testcode").val(),
			devicename:$("#devicename").val(),
			stime:$("#stime").val(),
			etime:$("#etime").val()
		}
	}).trigger("reloadGrid");
}



/*详细查询*/
function display(safevalveid){
	parent.parent.openWin(BASE_URL+"/enterprise/entequipsafevalve/display/"+safevalveid,'详细','68%','55%');
}