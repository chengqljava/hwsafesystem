$(document).ready(function() {
	var colname = ['主键','事故名称','发生时间','事故类型','事故等级']; 
	var colmodel = [{name:'EVENTID',index:'EVENTID',hidden:true},
					{name:'EVENTNAME',index:'EVENTNAME'},
					{name:'TIME',index:'TIME',
					    formatter:function(cellvalue, options, obj) { 
                            return getSmpFormatDateByLong(obj.TIME,true);
                        }
                    },
					{name:'EVENTTYPENAME',index:'EVENTTYPENAME'},
					{name:'EVENTLEVEL',index:'EVENTLEVEL',
					   formatter:function(cellvalue, options, obj) { 
                            return SelectOption.getAcclevel(obj.EVENTLEVEL);
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
    	url : BASE_URL + "/ems/emssucevent/eventList",
		datatype: "json",
		cache : false,
		mtype : 'post',
		colNames:colname,
		colModel:colmodel,
		postData:{
			name:$("#name").val(),
			stime:$("#stime").val(),
            etime:$("#etime").val(),
            state:$("#state").val()
		},
		sortname : 'UPDATETIME',
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
		caption: "事故信息列表",
		autowidth: true,
		loadComplete:function(){
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

/**
 * 选择一条站点
 */
$("#eventbtn").on("click",function(){
	var ids = $("#grid-table").jqGrid('getGridParam','selarrrow');
	if(ids.length !=1){
		// 弹出提示信息
		parent.toast("请选择一条记录！");
		return;
	}
	var eventid = $("#grid-table").jqGrid('getRowData',ids[0]).EVENTID; //选中的一条记录   	
	console.log(eventid);
	//TODO 弹出编辑框
	parent.parent.openWin(BASE_URL
			+ "views/module/ems/emssucestimate/estimaterecordAdd.html?eventid="+eventid,
			'新增事故评估', '70%', '80%');
});

/*加载*/
function reloadGrid(){
	$("#grid-table").jqGrid('setGridParam',{
		page:1,postData:{
			name:$("#name").val(),
            stime:$("#stime").val(),
            etime:$("#etime").val(),
            state:$("#state").val()
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
