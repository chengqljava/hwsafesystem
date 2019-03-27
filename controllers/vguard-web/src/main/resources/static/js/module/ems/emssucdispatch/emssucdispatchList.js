/*$(document).ready(function() {
	var colname = ['主键','标题','调度时间']; 
	var colmodel = [{name:'DISPATCHID',index:'DISPATCHID',hidden:true},
					{name:'DISTITLE',index:'DISTITLE',
            			formatter:function(cellvalue, options, obj) { 
                            return '<a href="javascript:void(0);" onclick="dispatchDisplay(\''+obj.DISPATCHID+'\')">'+obj.DISTITLE+'</a>';
                        }
					},
					{name:'DISTIME',index:'DISTIME',
					    formatter:function(cellvalue, options, obj) { 
                            return getSmpFormatDateByLong(obj.DISTIME,true);
                        }
                    }
			       ];
	
	//var tableHeight = $(window).height() - $('.pcheck').height() - 190 -33;
	$(window).resize(function(){
		$("#grid-table-dispatch").jqGrid( 'setGridHeight', $(window).height() - $('.pcheck').height() - 190 -33 );
		$("#grid-table-dispatch").jqGrid( 'setGridWidth', $(window).width()*0.99 );
	});

    $("#grid-table-dispatch").jqGrid({
    	//height: tableHeight,
    	url : BASE_URL + "/ems/emssucdispatch/list",
		datatype: "json",
		cache : false,
		mtype : 'post',
		colNames:colname,
		colModel:colmodel,
		postData:{
			eventid:$('#eventid').val()
		},
		sortname : 'DISTIME',
		sortorder : "desc",
		viewrecords : true,
		pager : "#grid-pager-dispatch",
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
		rownumbers:true,
		rownumWidth:40,
		scroll: true,
		//multiselect: true,
		caption: "应急处置",
		autowidth: true
	});
});*/

/*加载*/
/*function reloadGridDispatch(){
	$("#grid-table-dispatch").jqGrid('setGridParam',{
		page:1,postData:{
			eventid:$('#eventid').val()
		}
	}).trigger("reloadGrid");
}*/


/*详细查询*/
/*function dispatchDisplay(dispatchid){
	parent.openWin(BASE_URL+"/ems/emssucdispatch/display/"+dispatchid,'详细','35%','45%');
}*/


//-----------------------------------20171025--------baike----------------
$(document).ready(function() {
	var colname = ['主键','事故类型编号','事故名称','发生时间','发生地址','事故类型','事故等级','事故原因','事故概述','状态']; 
	var colmodel = [{name:'EVENTID',index:'EVENTID',hidden:true,key:true},
	                {name:'EVENTTYPE',index:'EVENTTYPE',hidden:true},
					{name:'EVENTNAME',index:'EVENTNAME',
            			formatter:function(cellvalue, options, obj) { 
                            return '<a href="javascript:void(0);" onclick="displayEvent(\''+obj.EVENTID+'\')">'+obj.EVENTNAME+'</a>';
                        }
					},
					{name:'TIME',index:'TIME',
					    formatter:function(cellvalue, options, obj) { 
                            return getSmpFormatDateByLong(obj.TIME,true);
                        }
                    },
					{name:'ADDRESS',index:'ADDRESS'},
					{name:'EVENTTYPENAME',index:'EVENTTYPENAME'},
					{name:'EVENTLEVEL',index:'EVENTLEVEL',
					   formatter:function(cellvalue, options, obj) { 
                            return SelectOption.getAcclevel(obj.EVENTLEVEL);
                        }
					},
					{name:'REASON',index:'REASON'},
					{name:'CONTENT',index:'CONTENT'},
					{name:'STATE',index:'STATE',
						formatter:function(cellvalue, options, obj) { 
							return SelectOption.getEmsSucState(obj.STATE);
						}
					}
			       ];
	
	//var tableHeight = $(window).height() - $('.pcheck').height() - 190 -33;
	$(window).resize(function(){
		//$("#grid-table-event").jqGrid( 'setGridHeight', $(window).height() - $('.pcheck').height() - 190 -33 );
		$("#grid-table").jqGrid( 'setGridWidth', $(window).width()*0.99 );
	});

    $("#grid-table").jqGrid({
    	height: 150,
    	url : BASE_URL + "/ems/emssucevent/list",
		datatype: "json",
		cache : false,
		mtype : 'post',
		colNames:colname,
		colModel:colmodel,
		postData:{
			name:null,
			stime:null,
			etime:null,
			state:3
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
		hidegrid:false,//启用或者禁用控制表格显示、隐藏的按钮，只有当caption 属性不为空时起效,默认为true
		rowNum:10,
		rowList:[10,20,30],
		altRows: true,
		multiselect: true,
		multiboxonly: true, //只有当multiselect = true.起作用，当multiboxonly 为ture时只有选择checkbox才会起作用
		//multikey: 'shiftKey',
		rownumbers:true,
		rownumWidth:40,
		scroll: true,
		caption: "事故信息列表",
		autowidth: true,
		loadComplete:function(){
			/*var ids = $("#grid-table").getDataIDs();//获取列表所有id
			//默认选择第一行
			$("#grid-table").setSelection(ids[0]);
			reloadallgrid(ids[0]);*/
			
			if($(window).width() < 700) {
				$('.ui-jqgrid-htable').css({"width":"900"});
				$("#grid-table").css({"width":"900"});
				$("#grid-table").closest(".ui-jqgrid-bdiv").css({ "overflow-x" : "scroll","height":"350"});
				$(".ui-jqgrid-hdiv").css({ "overflow-x" : "scroll"});
			} else {
				$("#grid-table").jqGrid( 'setGridWidth', $(window).width()*0.99 );
			}
		},
		onSelectRow: function(rowid) { //单击选择行
			//reloadallgrid(rowid);
        }
	});
});

/*详细查询*/
function displayEvent(eventid){
	parent.openWin(BASE_URL+"/ems/emssucevent/display/"+eventid,'详细','65%','75%');
}

/**
 * 刷新时加载查询条件
 */
function reloadGrid() {
    $("#grid-table").jqGrid("setGridParam", {
        page: 1,
        postData: {
        	type:$("#type").val(),
        }
    }).trigger("reloadGrid");
}

