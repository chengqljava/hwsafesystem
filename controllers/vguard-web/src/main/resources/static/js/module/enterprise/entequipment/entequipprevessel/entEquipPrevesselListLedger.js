$(document).ready(function() {
	initSeachInput();
	initDateSeach("stime","etime");
	
	var colname = ['压力容器id','设备名称','使用登记证编号','容积m3','容器类型','工作介质','安全等级','投用日期','有效期至','是否停用','检定结论']; 
	var colmodel = [
		{name:'PREVESSELID',index:'PREVESSELID', width:'5%',hidden: true},
		{name:'DEVICENAME',index:'DEVICENAME',width:'15%',align:'left',
			formatter:function(cellvalue, options, obj) { 
				   return '<a href="javascript:void(0);" onclick="display(\''+obj.PREVESSELID+'\')">'+obj.DEVICENAME+'</a>';
			}
		},
		{name:'REGISTNUMBER',index:'REGISTNUMBER',width:'10%',align:'left'},
		{name:'VOLUME',index:'VOLUME',width:'10%',align:'left'},
		{name:'VESSELTYPE',index:'VESSELTYPE',width:'10%',align:'left',
			formatter:function(cellvalue, options, obj) { 
				return SelectOption.loadVesselTypeData(obj.VESSELTYPE)
			}
		},
		{name:'WORKINGMEDIUM',index:'WORKINGMEDIUM',width:'10%',align:'left'},
		{name:'SAFETYLEVEL',index:'SAFETYLEVEL',width:'10%',align:'left',
			formatter:function(cellvalue, options, obj) { 
				return SelectOption.loadSafetylevelData(obj.SAFETYLEVEL)
			}
		},
		{name:'STARTTIME',index:'STARTTIME',width:'10%',align:'left',
			formatter:function(cellvalue, options, obj) { 
				if (obj.STARTTIME) {
					return getSmpFormatDateByLong(obj.STARTTIME, false);
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
		{name:'STATE',index:'STATE',width:'10%',align:'left',
			formatter:function(cellvalue, options, obj) { 
				return SelectOption.loadPrevesselStateData(obj.STATE)
			}
		},
		{name:'TESTRESULT',index:'TESTRESULT',width:'10%',align:'left',
			formatter:function(cellvalue, options, obj) { 
				return SelectOption.loadTestResultData(obj.TESTRESULT)
			}
		},
	];


	var tableHeight = $(window).height() - $('.pcheck').height() - 190 - 33;
	$(window).resize(function(){
		$("#grid-table").jqGrid( 'setGridHeight', $(window).height() - $('.pcheck').height() - 190 - 33 );
		$("#grid-table").jqGrid( 'setGridWidth', $(window).width() - 96 );
	});

    $("#grid-table").jqGrid({
    	height: tableHeight,
    	url : BASE_URL + "/enterprise/entequipprevessel/list",
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
		caption: "压力容器列表",
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
            registnumber:$("#registnumber").val(),
            stime:$("#stime").val(),
			etime:$("#etime").val()
		}
	}).trigger("reloadGrid");
}

/*详细查询*/
function display(prevesselid){
	parent.parent.openWin(BASE_URL+"/enterprise/entequipprevessel/display/"+prevesselid,'详细','58%','75%');
}