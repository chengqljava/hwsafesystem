$(document).ready(function() {
	var colname = ['工商信息id','企业信息id','企业名称','行业主管分类','行业行政主管部门','负责人','联系电话','采集状态',/**'审核状态',**/'更新时间']; 
	var colmodel = [
		{name:'BUSINESSINFOID',index:'BUSINESSINFOID', width:'5%',hidden: true},
		{name:'BASEINFOID',index:'BASEINFOID', width:'5%',hidden: true},
		{name:'ENTNAME',index:'ENTNAME',width:'20%',align:'left',
			formatter:function(cellvalue, options, obj) { 
				   return '<a href="javascript:void(0);" onclick="display(\''+obj.BUSINESSINFOID+'\',\''+obj.ENTNAME+'\')">'+obj.ENTNAME+'</a>';
			}
		},
		{name:'DIRECTORTYPENAME',index:'DIRECTORTYPENAME',width:'20%',align:'left'},
		{name:'ALLORGNAME',index:'ALLORGNAME',width:'30%',align:'left'},
		{name:'LEGALPERSON',index:'DIRECTORTYPEID',width:'6%',align:'left'},
		{name:'PHONE',index:'PHONE',width:'8%',align:'left'},
		{name:'STATUS',index:'STATUS',width:'5%',align:'left',editoptions : {value : "0:未填报;1:填报中;2:更新中;3:已上报"},formatter:'select'},
		/**
		{name:'AUDITSTATUS',index:'AUDITSTATUS',width:'8%',align:'left',editoptions : {value:"0:审核未通过;1:审核通过;null:未审核"},formatter:'select'},
		**/
		{name:'UPDATETIME',index:'UPDATETIME',width:'10%',align:'left',
			formatter : function(cellvalue, options, obj) {
				return getFormatDateByLong(obj.UPDATETIME,
						"yyyy-MM-dd hh:mm:ss");
			}
		}
	];
	
	$(window).on('resize.jqGrid', function () {
		if($(window).width() < 700) {
			$('.ui-jqgrid-htable').css({"width":"900"});
			$("#grid-table").css({"width":"900" });
			$("#grid-table").closest(".ui-jqgrid-bdiv").css({ "overflow-x" : "scroll"});
			$(".ui-jqgrid-hdiv").css({ "overflow-x" : "scroll"});
		} else {
			$("#grid-table").jqGrid( 'setGridWidth', $(window).width()*0.99 );
		}
    })
    $("#grid-table").jqGrid({
    	height: 500,
    	url : BASE_URL + "/enterprise/entcount/entGradeList",
		datatype: "json",
		cache : false,
		mtype : 'post',
		colNames:colname,
		colModel:colmodel,
		postData:{
			stime:$("#stime").val(),
			etime:$("#etime").val(),
			altergrades:$("#altergrades").val(),
			districtid:$("#districtid").val()
		},
		sortname : 'updatetime',
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
		rowNum:20,
		rowList:[20,40,60],
		altRows: true,
		multiselect: true,
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

/*安全信息菜单*/
$("#editBtn").on("click", function () {
	var ids = $("#grid-table").jqGrid('getGridParam','selarrrow');
	if(ids.length !=1){
		// 弹出提示信息
		parent.toast("请选择一条记录！");
		return;
	}
	
	var rowdata = $("#grid-table").jqGrid('getRowData',ids[0]); //选中的一条记录
	var businessinfoid = rowdata.BUSINESSINFOID; //工商信息id
	var entname = rowdata.ENTNAME; //企业名称
	var status = rowdata.STATUS; //采集状态

	if(status == 0){ //企业还未填报，政府端不能编辑
		// 弹出提示信息
		parent.toast("企业未填报不能编辑！");
		return;
	}
	parent.openWin(BASE_URL+'/enterprise/entsafeinfomenu/safemenu/'+businessinfoid,entname,'80%','90%');
});

/*详细查询*/
function display(businessinfoid,entname){
	// parent.openWin(BASE_URL+'/enterprise/entsafeinfomenu/safemenuDisplay/'+businessinfoid,entname,'80%','90%');
    parent.openWin(BASE_URL+"/views/module/enterprise/entbusinessinfo/displayEntbusinessinfo.html?businessinfoid="+businessinfoid,'详细','90%','90%');
}