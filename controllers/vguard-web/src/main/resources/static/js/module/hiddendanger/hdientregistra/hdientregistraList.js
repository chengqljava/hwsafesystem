$(document).ready(function() {
	SelectOption.loadNowYear("year");
	SelectOption.loadQuarter("quarter"); 
	
	var colname = ['主键id','排查标准id','隐患编号','检查日期','检查人','隐患自查内容']; 
	var colmodel = [
		{name:'REGISTRAID',index:'REGISTRAID', width:'5%',hidden: true},
		{name:'STANDARDID',index:'STANDARDID', width:'5%',hidden: true},
		{name:'ENTREGISTRANUM',index:'ENTREGISTRANUM', width:'8%',
			formatter:function(cellvalue, options, obj) { 
				   return '<a href="javascript:void(0);" onclick="display(\''+obj.REGISTRAID+'\')">'+obj.ENTREGISTRANUM+'</a>';
			}
		},
		{name:'CHECKTIME',index:'CHECKTIME',width:'5%',align:'left',
			formatter : function(cellvalue, options, obj) {
				return getFormatDateByLong(obj.CHECKTIME,
				"yyyy-MM-dd");
			}
		},
		{name:'RUMMAGER',index:'RUMMAGER',width:'5%',align:'left'},
		{name:'CHECKCONTENT',index:'CHECKCONTENT',width:'30%',align:'left'}/*,
		{name:'DIRECTORORG',index:'DIRECTORORG',width:'5%',align:'left',
			formatter:function(cellvalue, options, obj) { 
				   return '<a href="javascript:void(0);" onclick="directororg(\''+obj.STANDARDID+'\')">查看</a>';
			}
		}*/
	];
	
	var tableHeight = $(window).height() - $('.pcheck').height() - 190;
	$(window).on('resize.jqGrid', function () {
		$("#grid-table").jqGrid( 'setGridHeight', $(window).height() - $('.pcheck').height() - 190 );
		$("#grid-table").jqGrid( 'setGridWidth', $(window).width()*0.99);
    })
    $("#grid-table").jqGrid({
    	height: tableHeight,
    	url : BASE_URL + "/hiddendanger/hdientregistra/listEntRegistra",
		datatype: "json",
		cache : false,
		mtype : 'post',
		colNames:colname,
		colModel:colmodel,
		postData:{
			checktimestart:$("#checktimestart").val(),
			checktimeend:$("#checktimeend").val(),
			year:$("#year").val(),
			quarter:$("#quarter").val(),
			businessinfoid:$("#businessinfoid").val(),
			status:$("#status").val()
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
					quarter:$("#quarter").val(),
					businessinfoid:$("#businessinfoid").val(),
					status:$("#status").val()
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
	$("#quarter").val("");
});

/*详细信息*/
function display(registraid){
	parent.openWin(BASE_URL+'/hiddendanger/hdientabarbeitung/display/'+registraid+"/ENT",'隐患整改详细','','85%');
}

/*主管机构*/
function directororg(standardid){
	parent.openWin(BASE_URL+'/hiddendanger/hdidirectororg/directororg/'+standardid,'主管机构','40%','55%');
}