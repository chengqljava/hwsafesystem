$(document).ready(function() {
    var colname = ['处罚id','文书年份','文书区域','文书编号','执法检查ID','企业名称','法定负责人','违法内容','法律条文','处罚标准','处罚结果','处罚类型 ','文书日期']; 
	var colmodel = [
					{name:'PUNISHID',index:'PUNISHID',hidden:true},
					{name:'DOCYEAR',index:'DOCYEAR'},
					{name:'DOCAREA',index:'DOCAREA'},
					{name:'DOCNUM',index:'DOCNUM'},
					{name:'CHECKINFOID',index:'CHECKINFOID',hidden:true},
					{name:'ENTNAME',index:'ENTNAME'},
					{name:'LEGALPERSON',index:'LEGALPERSON'},
					{name:'ILLEGALACT',index:'ILLEGALACT'},
					{name:'LAWARTICLE',index:'LAWARTICLE'},
					{name:'PUNISHSTANDARD',index:'PUNISHSTANDARD'},
					{name:'PUNISHRESULT',index:'PUNISHRESULT'},
					{name:'PUNISHTYPE',index:'PUNISHTYPE',
					   formatter:function(cellvalue, options, obj) { 
					       if(obj.Function == 0){
					           return "单位";
					       }else{
					           return "个人";
					       }
                        }
					},
					{name:'DOCDATE',index:'DOCDATE',
					   formatter:function(cellvalue, options, obj) { 
                          return getSmpFormatDateByLong(obj.DOCDATE, false);
                        }
                    }
			];
	
	var tableHeight = $(window).height() - $('.pcheck').height() - 190 -33;
	$(window).resize(function(){
		$("#grid-table").jqGrid( 'setGridHeight', $(window).height() - $('.pcheck').height() - 190 -33 );
		$("#grid-table").jqGrid( 'setGridWidth', $(window).width()*0.99 );
	});

    $("#grid-table").jqGrid({
    	height: tableHeight,
    	url : BASE_URL + "/law/lawpunishdecision/list",
		datatype: "json",
		cache : false,
		mtype : 'post',
		colNames:colname,
		colModel:colmodel,
		postData:{
		    districtid:$("#districtid").val(),
		    districtlevel:$("#districtlevel").val(),
		    startTime:$("#startTime").val(),
            endTime:$("#endTime").val()
		},
		sortname : 'docnum',
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
		caption: "重大危险源列表",
		autowidth: true,
		loadComplete: function() {
			if($(window).width() < 700) {
				$('.ui-jqgrid-htable').css({"width":"900"});
				$("#grid-table").css({"width":"900"});
				$("#grid-table").closest(".ui-jqgrid-bdiv").css({ "overflow-x" : "scroll","height":"350"});
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
            districtlevel:$("#districtlevel").val(),
            startTime:$("#startTime").val(),
            endTime:$("#endTime").val()
		}
	}).trigger("reloadGrid");
}

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