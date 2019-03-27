$(document).ready(function() {
	
	var colname = ['主键id','标识','隐患编号','检查日期','检查人','隐患类型','隐患内容','隐患整改期限','状态']; 
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
				   return '<a href="javascript:void(0);" onclick="display(\''+obj.REGISTRAID+'\')">'+obj.ENTREGISTRANUM+'</a>';
			}},
			
		{name:'CHECKTIME',index:'CHECKTIME',width:'5%',align:'left',
			formatter : function(cellvalue, options, obj) {
				return getFormatDateByLong(obj.CHECKTIME,
				"yyyy-MM-dd");
			}
		},
		{name:'RUMMAGER',index:'RUMMAGER',width:'5%',align:'left'},
		{name:'ALLITEMNAME',index:'ALLITEMNAME',width:'30%',align:'left'},
		{name:'CHECKCONTENT',index:'CHECKCONTENT',width:'30%',align:'left'},
		{name:'ENDTIME',index:'ENDTIME',width:'8%',align:'left',
			formatter : function(cellvalue, options, obj) {
				return getFormatDateByLong(obj.ENDTIME,
				"yyyy-MM-dd");
			}
		},
		{name:'STATUS',index:'STATUS',width:'8%',align:'left',
			formatter:function(cellvalue, options, obj) { 
				if(obj.STATUS=='0'){
					return '未整改';
				}else if(obj.STATUS=='1'){
					return '已整改';
				}else if(obj.STATUS=='2'){
					return '逾期未整改';
				}
			}	
		}
	];
	
	$(window).on('resize.jqGrid', function () {
		$("#grid-table").jqGrid( 'setGridWidth', $(window).width()*0.99);
    })

    $("#grid-table").jqGrid({
    	height: 250,
    	url : BASE_URL + "/hiddendanger/hdigovchecklist/dangerlist",
		datatype: "json",
		cache : false,
		mtype : 'post',
		colNames:colname,
		colModel:colmodel,
		postData:{
			year:$("#year").val(),
			quarter:$("#quarter").val(),
			businessinfoid:$("#businessinfoid").val(),
			yesabarbeitung:$("#yesabarbeitung").val(),
			inspectionid:$("#inspectionid").val()
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
		autowidth: true
	});
});

/*加载*/
function reloadGrid(){
	$("#grid-table").jqGrid('setGridParam',{
		page:1,postData:{
			year:$("#year").val(),
			quarter:$("#quarter").val(),
			businessinfoid:$("#businessinfoid").val(),
			yesabarbeitung:$("#yesabarbeitung").val(),
			inspectionid:$("#inspectionid").val()
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

/*隐患整改详细信息*/
function display(registraid){
	parent.openWin(BASE_URL+'/hiddendanger/hdientabarbeitung/display/'+registraid+'/ENT','隐患整改详细','','85%');
}
