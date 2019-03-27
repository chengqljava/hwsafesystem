$(document).ready(function() {
	SelectOption.loadNowYear("year");
	SelectOption.loadMonth("month"); 
	
	var colname = ['主键id','标识','隐患编号','检查日期','检查人','隐患类型','隐患内容','隐患整改期限','隐患来源','整改状态','复查状态','销案状态','来源']; 
	var colmodel = [
		{name:'REGISTRAID',index:'REGISTRAID', width:'5%',hidden: true},
		{name:'BIAOSHI',index:'BIAOSHI',width:'5%',align:'left',
			formatter:function(cellvalue, options, obj) { 
				if(obj.STATUS=='2'){
					//逾期未整改
					return "<img src='"+BASE_URL+"/images/permitlight/lightred.gif' title='逾期未整改'/>";
				}else if(obj.STATUS=='0'){
					//未整改
					return "<img src='"+BASE_URL+"/images/permitlight/lightyellow.gif' title='未整改'/>";
				}else{
					return "";
				}
			}
		},
		{name:'ENTREGISTRANUM',index:'ENTREGISTRANUM', width:'8%',
			formatter:function(cellvalue, options, obj) { 
				   return '<a href="javascript:void(0);" onclick="display(\''+obj.REGISTRAID+'\',\''+obj.BEFROM+'\')">'+obj.ENTREGISTRANUM+'</a>';
			}},
			
		{name:'CHECKTIME',index:'CHECKTIME',width:'8%',align:'left',
			formatter : function(cellvalue, options, obj) {
				return getFormatDateByLong(obj.CHECKTIME,
				"yyyy-MM-dd");
			}
		},
		{name:'RUMMAGER',index:'RUMMAGER',width:'5%',align:'left'},
		{name:'ALLITEMNAME',index:'ALLITEMNAME',width:'28%',align:'left'},
		{name:'CHECKCONTENT',index:'CHECKCONTENT',width:'28%',align:'left'},
		{name:'ENDTIME',index:'ENDTIME',width:'8%',align:'left',
			formatter : function(cellvalue, options, obj) {
				return getFormatDateByLong(obj.ENDTIME,
				"yyyy-MM-dd");
			}
		},
		{name:'BEFROM',index:'BEFROM',width:'8%',align:'left',
			editoptions : {
				value : "GOV:政府巡查;ENT:企业自查"
			},formatter : 'select'
		},
		{name:'STATUS',index:'STATUS',width:'8%',align:'left',
			formatter:function(cellvalue, options, obj) { 
				if(obj.STATUS=='0'){
					return '<a href="javascript:void(0);" onclick="edit(\''+obj.REGISTRAID+'\',\''+obj.BEFROM+'\')">未整改</a>';
				}else if(obj.STATUS=='1'){
					return '已整改';
				}else if(obj.STATUS=='2'){
					return '逾期未整改';
				}else {
					return '';
				}
			}	
		},
		{name:'REVIEWRESULTS',index:'REVIEWRESULTS',width:'8%',align:'left',
			formatter:function(cellvalue, options, obj) { 
				if(obj.REVIEWRESULTS=='0'){
					return '复查未通过';
				}else if(obj.REVIEWRESULTS=='1'){
					return '复查通过';
				}else{
					return '';
				}
			}
		},
		{name:'ISCLCASE',index:'ISCLCASE',width:'8%',align:'left',
			formatter:function(cellvalue, options, obj) { 
				if(obj.ISCLCASE=='1'){
					return '已销案';
				}else {
					return '';
				}
			}
		},
		{name:'BEFROMTYPE',index:'BEFROMTYPE',width:'8%',align:'left',hidden: true,
			formatter:function(cellvalue, options, obj) { 
				return obj.BEFROM
			}	
		
		},
	];
	
	var tableHeight = $(window).height() - $('.pcheck').height() - 190;
	$(window).on('resize.jqGrid', function () {
		$("#grid-table").jqGrid( 'setGridHeight', $(window).height() - $('.pcheck').height() - 190 );
		$("#grid-table").jqGrid( 'setGridWidth', $(window).width()*0.99 );
    })


    $("#grid-table").jqGrid({
    	height: tableHeight,
    	url : BASE_URL + "/hiddendanger/hdientregistra/ent/list",
		datatype: "json",
		cache : false,
		mtype : 'post',
		colNames:colname,
		colModel:colmodel,
		postData:{
			checktimestart:$("#checktimestart").val(),
			checktimeend:$("#checktimeend").val(),
			year:$("#year").val(),
			month:$("#month").val()
		},
		sortname : 'checktime',
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
		caption: "隐患信息",
		autowidth: true,
		loadComplete: function() {
			if($(window).width() < 700) {
				$('.ui-jqgrid-htable').css({"width":"900"});
				$("#grid-table").css({"width":"900" });
				$("#grid-table").closest(".ui-jqgrid-bdiv").css({ "overflow-x" : "scroll"});
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
					checktimestart:$("#checktimestart").val(),
					checktimeend:$("#checktimeend").val(),
					year:$("#year").val(),
					month:$("#month").val()
			             }
	}).trigger("reloadGrid");
}

/*搜索查询*/
$("#searchBtn").bind("click",function(){
	reloadGrid();
});

/*重置*/
$("#resetBtn").bind("click",function(){
	$("#checktimestart").val("");
	$("#checktimeend").val("");
	$("#year").val("");
	$("#month").val("");
});

/*隐患整改信息*/
function edit(registraid,befrom){
	parent.openWin(BASE_URL+'/hiddendanger/hdientabarbeitung/edit/'+registraid+'/'+befrom,'隐患整改','','85%');
}

/* 编辑 */
$("#editBtn").bind("click", function() {
	// 返回当前grid中复选框所选择的数据的id
	var ids = $("#grid-table").jqGrid('getGridParam', 'selarrrow');
	if (ids.length != 1) {
		// 弹出提示信息
		parent.toast("请选择一条数据进行编辑！");
		return;
	}
	// 返回指定id行的数据
	var rowdatas = $("#grid-table").jqGrid('getRowData', ids[0]);
	var registraid = rowdatas.REGISTRAID;
	var befromtype = rowdatas.BEFROMTYPE;
	parent.openWin(BASE_URL+'/hiddendanger/hdientabarbeitung/edit/'+registraid+'/'+befromtype,'隐患整改','','85%');
});



/*隐患整改详细信息*/
function display(registraid,befrom){
	parent.openWin(BASE_URL+'/hiddendanger/hdientabarbeitung/display/'+registraid+'/'+befrom,'隐患整改详细','','85%');
}
