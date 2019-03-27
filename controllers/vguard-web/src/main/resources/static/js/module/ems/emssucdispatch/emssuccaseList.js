$(document).ready(function() {
	
	var colname = ['CASEID','事故标题','行业类型','事故级别','发生时间']; 
	var colmodel = [
		{name:'CASEID',index:'CASEID', width:'5%',hidden: true},
		{name:'ACCNAME',index:'ACCNAME',width:'20%',align:'center',
			formatter:function(cellvalue, options, obj) { 
				return '<a href="javascript:void(0);" onclick="displayCase(\''+obj.CASEID+'\')">'+obj.ACCNAME+'</a>';
			}
		},
		{name:'TYPE',index:'TYPE',width:'20%',align:'center'
			},
		{name:'ACCLEVEL',index:'ACCLEVEL', width:'20%', align:'center', 
			formatter : function(cellvalue, options, obj) {
				return obj.ACCLEVEL != null ? SelectOption.getAcclevel(obj.ACCLEVEL) : "";
			}
		},
		{name:'ACCTIME',index:'ACCTIME',align:'center',
			formatter:function(cellvalue, options, obj) { 
				if(obj.ACCTIME == null)
					return "-";
				else
					return getSmpFormatDateByLong(obj.ACCTIME,true);
			}, width : '10%'}
	];
	
	$(window).on('resize.jqGrid', function () {
		$("#grid-table-case").jqGrid( 'setGridWidth', $('.rightCell').width()*0.99 );
    })
   /* var caseurl = null;
	alert($('#eventtype').val());
    if($('#eventtype').val() != ""){
    	caseurl = BASE_URL + "/knowledge/knocase/list";
	}*/
    $("#grid-table-case").jqGrid({
    	//height: 250,
    	url : BASE_URL + "/knowledge/knocase/list",
		datatype: "local",
		cache : false,
		mtype : 'post',
		colNames:colname,
		colModel:colmodel,
		postData:{
			keyword:null,
			industrytype:null,
			acctype:$('#eventtype').val(),
			acclevel:null
		},
		sortname : 'CASEID',
		sortorder : "asc",
		//viewrecords : true,是否显示总记录数
		pager : "#grid-pager-case",
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
		//multiselect: true,
		rownumbers:true,
		rownumWidth:40,
		scroll: true,
		caption: "事故案例",
		autowidth: true,
		loadComplete: function() {
			if($(window).width() < 700) {
				$('.ui-jqgrid-htable').css({"width":"900"});
				$("#grid-table-case").css({"width":"900"});
				$("#grid-table-case").closest(".ui-jqgrid-bdiv").css({ "overflow-x" : "scroll","height":"350"});
				$(".ui-jqgrid-hdiv").css({ "overflow-x" : "scroll"});
			} else {
				$("#grid-table-case").jqGrid( 'setGridWidth', $(window).width()*0.99 );
			}
		}

	});
});

/*加载*/
function reloadGridCase(){
	//更改从服务器端返回的数据类型
	$("#grid-table-case").jqGrid('setGridParam',{datatype:'json'});
	$("#grid-table-case").jqGrid('setGridParam',{
		page:1,postData:{
			keyword:null,
			industrytype:null,
			acctype:$('#eventtype').val(),
			acclevel:null
		}
	}).trigger("reloadGrid");
}

/*详细查询*/
function displayCase(chemcatalid){
	parent.openWin(BASE_URL+'/knowledge/knocase/display/'+chemcatalid,'详细','60%','75%');
}




 

