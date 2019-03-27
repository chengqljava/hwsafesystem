$(document).ready(function() {
	initDateSeach("stime","etime");
	if($(window).width() < 700) {
		$('.showBtn').css({"display":"none"});
		var len = $('.dropdown-menu li').length;
		for(var i = 0; i < len; i++) {
			$('.smallShow li button')[i].onclick = function () {
    				var html = $(this).html();
    				$('.clickBtn').html(html);
    			};
    		}
	}else {
		$('#btnli').css({"display":"none"});
		$("#btnli").empty();
		$('#btnli').remove();
	}
	
	var colname = ['id','投入领域','投入时间','投入额度（万元）','取得成效']; 
	var colmodel = [
		{name:'INFOID',index:'INFOID', width:'5%',hidden: true},
		{name:'FIELDNAME',index:'FIELDNAME',width:'20%',align:'left',
			formatter:function(cellvalue, options, obj) { 
				return '<a href="javascript:void(0);" onclick="display(\''+obj.INFOID+'\')">'+obj.FIELDNAME+'</a>';
			}
		},
		{name:'INVESTTIME',index:'INVESTTIME',width:'10%',align:'left',
			formatter:function(cellvalue, options, obj) {
				if(obj.INVESTTIME){
					return getSmpFormatDateByLong(obj.INVESTTIME, false);
				} else {
					return "";
				}
			}
		},
		{name:'INVESTMONEY',index:'INVESTMONEY',width:'10%',align:'left'},
		{name:'ACHIEVEMENT',index:'ACHIEVEMENT',width:'30%',align:'left'}
	];


	var tableHeight = $(window).height() - $('.pcheck').height() - 190 - 33;
	$(window).resize(function(){
		$("#grid-table").jqGrid( 'setGridHeight', $(window).height() - $('.pcheck').height() - 190 - 33 );
		$("#grid-table").jqGrid( 'setGridWidth', $(window).width() - 96 );
	});

    $("#grid-table").jqGrid({
    	height: tableHeight,
    	url : BASE_URL + "/enterprise/entsafeinvestinfo/list",
		datatype: "json",
		cache : false,
		mtype : 'post',
		colNames:colname,
		colModel:colmodel,
		postData:{
			entid:$("#entid").val()
		},
		sortname : 'UPDATETIME',
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
		multiselect: true,
		caption: "安全生产投入信息",
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
function resetData(){
	$('#daterange-btn span').html(" 日期选择");
	$("#stime").val("");
	$("#etime").val("");
	$("#fieldname").val("");
}

/*加载*/
function reloadGrid(){
	$("#grid-table").jqGrid('setGridParam',{
		page:1,postData:{
			entid:$("#entid").val(),
			stime:$("#stime").val(),
			etime:$("#etime").val(),
			fieldname:$("#fieldname").val()
		}
	}).trigger("reloadGrid");
}



/*详细查询*/
function display(infoid){
	parent.parent.openWin(BASE_URL+"/enterprise/entsafeinvestinfo/display/"+infoid,'详细','60%','50%');
}