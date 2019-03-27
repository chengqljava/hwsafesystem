$(document).ready(function() {
	initSeachInput();
//	if($(window).width() < 700) {
//		$('.showBtn').css({"display":"none"});
//		var len = $('.dropdown-menu li').length;
//		for(var i = 0; i < len; i++) {
//			$('.smallShow li button')[i].onclick = function () {
//    				var html = $(this).html();
//    				$('.clickBtn').html(html);
//    			};
//    		}
//	}else {
//		$('#btnli').css({"display":"none"});
//		$("#btnli").empty();
//		$('#btnli').remove();
//	}
	
	var colname = ['管道id','设备名称','型号规格','设备品种','材质','使用压力（Map）','设计温度（℃）','工作介质','使用地点']; 
	var colmodel = [
		{name:'conduitid',index:'conduitid', width:'5%',hidden: true},
		{name:'devicename',index:'devicename',width:'10%',align:'left',
			formatter:function(cellvalue, options, obj) { 
				   return '<a href="javascript:void(0);" onclick="display(\''+obj.conduitid+'\')">'+obj.devicename+'</a>';
			}
		},
		{name:'specmodel',index:'specmodel',width:'10%',align:'left'},
		{name:'devicevariety',index:'devicevariety',width:'8%',align:'left'},
		{name:'material',index:'material',width:'8%',align:'left'},
		{name:'workingpressure',index:'workingpressure',width:'12%',align:'left'},
		{name:'designtemp',index:'designtemp',width:'10%',align:'left'},
		{name:'workingmedium',index:'workingmedium',width:'8%',align:'left'},
		{name:'instalposition',index:'instalposition',width:'15%',align:'left'},
	];


	var tableHeight = $(window).height() - $('.pcheck').height() - 190 - 33;
	$(window).resize(function(){
		$("#grid-table").jqGrid( 'setGridHeight', $(window).height() - $('.pcheck').height() - 190 - 33 );
		$("#grid-table").jqGrid( 'setGridWidth', $(window).width() - 96 );
	});

    $("#grid-table").jqGrid({
    	height: tableHeight,
    	url : BASE_URL + "/enterprise/entequipconduit/list",
		datatype: "json",
		cache : false,
		mtype : 'post',
		colNames:colname,
		colModel:colmodel,
		postData:{
			entid:$("#entid").val()
		},
		sortname : 'DEVICENAME',
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
		caption: "压力管道列表",
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
    /*搜索查询*/
    $("#searchbtn").bind("click",function(){
    	reloadGrid();
    });
    
    /*重置*/
    $("#resetbtn").bind("click",function(){
    	$("#searchForm").each(function(){
    		$(this).val("");
    	});
    });
    
});

/*加载*/
function reloadGrid(){
	$("#grid-table").jqGrid('setGridParam',{
		page:1,postData:{entid:$("#entid").val(),
            devicename:$("#devicename").val(),
            specmodel:$("#specmodel").val(),
            devicecode:$("#devicecode").val()}
	}).trigger("reloadGrid");
}



/*详细查询*/
function display(conduitid){
	parent.parent.openWin(BASE_URL+"/enterprise/entequipconduit/display/"+conduitid,'详细','60%','55%');
}