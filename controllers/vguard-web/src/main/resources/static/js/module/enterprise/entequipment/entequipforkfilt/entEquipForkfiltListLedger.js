$(document).ready(function() {
	initSeachInput();
	initDateSeach("stime","etime");
	
	var colname = ['叉车id','设备名称','规格型号','投用时间','证书编号','使用证号(车牌号)','检验日期','下次检验日期','注册代码']; 
	var colmodel = [
		{name:'FORKFILTID',index:'FORKFILTID', width:'5%',hidden: true},
		{name:'DEVICENAME',index:'DEVICENAME',width:'15%',align:'left',
			formatter:function(cellvalue, options, obj) { 
				   return '<a href="javascript:void(0);" onclick="display(\''+obj.FORKFILTID+'\')">'+obj.DEVICENAME+'</a>';
			}
		},
		{name:'SPECMODEL',index:'SPECMODEL',width:'10%',align:'left'},
		{name:'STARTTIME',index:'STARTTIME',width:'10%',align:'left',
			formatter:function(cellvalue, options, obj) { 
				if (obj.STARTTIME) {
					return getSmpFormatDateByLong(obj.STARTTIME, false);
				} else {
					return "";
				}
			}
		},
		{name:'REGISTNUMBER',index:'REGISTNUMBER',width:'10%',align:'left'},
		{name:'PLATENUM',index:'PLATENUM',width:'10%',align:'left'},
		{name:'CHECKTIME',index:'CHECKTIME',width:'10%',align:'left',
			formatter:function(cellvalue, options, obj) { 
				if (obj.CHECKTIME) {
					return getSmpFormatDateByLong(obj.CHECKTIME, false);
				} else {
					return "";
				}
			}
		},
		{name:'NEXTCHECKTIME',index:'NEXTCHECKTIME',width:'10%',align:'left',
			formatter:function(cellvalue, options, obj) { 
				if (obj.NEXTCHECKTIME) {
					return getSmpFormatDateByLong(obj.NEXTCHECKTIME, false);
				} else {
					return "";
				}
			}
		},
		{name:'REGISTRATIONCODE',index:'REGISTRATIONCODE',width:'10%',align:'left'},
	];


	var tableHeight = $(window).height() - $('.pcheck').height() - 190 - 33;
	$(window).resize(function(){
		$("#grid-table").jqGrid( 'setGridHeight', $(window).height() - $('.pcheck').height() - 190 - 33 );
		$("#grid-table").jqGrid( 'setGridWidth', $(window).width() - 96 );
	});

    $("#grid-table").jqGrid({
    	height: tableHeight,
    	url : BASE_URL + "/enterprise/entequipforkfilt/list",
		datatype: "json",
		cache : false,
		mtype : 'post',
		colNames:colname,
		colModel:colmodel,
		postData:{
			entid:$("#entid").val()
		},
		sortname : 'STARTTIME',
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
		caption: "叉车列表",
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
function display(forkfiltid){
	parent.parent.openWin(BASE_URL+"/enterprise/entequipforkfilt/display/"+forkfiltid,'详细','70%','55%');
}