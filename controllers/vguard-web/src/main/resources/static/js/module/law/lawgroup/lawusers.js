$(document).ready(function() {
	
	var colname = ['人员id','姓名','区域','执法部门','人员身份','办公室电话','手机号码','执法证号','移动终端']; 
	var colmodel = [
		{name:'LAWUSERID',index:'LAWUSERID', width:'5%',hidden: true},
		{name:'NICKNAME',index:'NICKNAME',width:'10%',align:'left',
			formatter:function(cellvalue, options, obj) { 
				return '<a href="javascript:void(0);" onclick="display(\''+obj.LAWUSERID+'\')">'+obj.NICKNAME+'</a>';
			}
		},
		{name:'DISTRICTNAME',index:'DISTRICTNAME',width:'20%',align:'left'},
		{name:'DEPTNAME',index:'DEPTNAME',width:'20%',align:'center'},
		{name:'EXECTYPE',index:'EXECTYPE',width:'10%',align:'center',
			formatter:function(cellvalue, options, obj) { 
				if(obj.EXECTYPE){
					return SelectOption.getExecType(obj.EXECTYPE);
				}else{
					return '';
				}
			}
		},
		{name:'TEL',index:'TEL',width:'10%',align:'center'},
		{name:'PHONE',index:'PHONE',width:'10%',align:'center'},
		{name:'EXECCODE',index:'EXECCODE',width:'10%',align:'center'},
		{name:'MOBILECODE',index:'MOBILECODE',width:'10%',align:'center'}
	];

	var tableHeight = $(window).height() - $('.pcheck').height() - 190;
	$(window).resize(function(){
		$("#grid-table").jqGrid( 'setGridHeight', $(window).height() - $('.pcheck').height() - 190 );
		$("#grid-table").jqGrid( 'setGridWidth', $(window).width()*0.99 );
	});
		
    $("#grid-table").jqGrid({
    	height: tableHeight,
    	url : BASE_URL + "/law/lawgroup/loadusers",
		datatype: "json",
		cache : false,
		mtype : 'post',
		colNames:colname,
		colModel:colmodel,
		postData:{
			groupid:$("#groupid").val()
		},
		sortname : 'LAWUSERID',
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
		caption: "",
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
			groupid:$("#groupid").val()
			}
	}).trigger("reloadGrid");
}

/*详细查询*/
function display(lawuserid){
	parent.openWin(BASE_URL+"/law/lawuser/display/"+lawuserid,'详细','70%','80%');
}

