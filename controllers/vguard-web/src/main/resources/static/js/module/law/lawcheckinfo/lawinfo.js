$(document).ready(function() {
	
		var colname = ['主键id','立案状态','被检查企业','执法部门','执法人员','检查日期'];
		var colmodel = [
			{name:'CHECKINFOID',index:'CHECKINFOID', width:'15%', hidden : true},
			{name:'ISREGISTER',index:'ISREGISTER', width:'15%', hidden : true},
			{name:'ENTNAME',index:'ENTNAME',width:'10%',align:'left',sortable : false},
			{name:'DEPTNAME',index:'DEPTNAME',width:'10%',align:'center',sortable : false},
			{name:'USERNAME',index:'USERNAME',width:'10%',align:'center',sortable : false},
			{name:'EXAMINEDATE',index:'EXAMINEDATE',width:'10%',align:'center',
				formatter:function(cellvalue, options, obj) { 
					if (obj.EXAMINEDATE) {
						return getSmpFormatDateByLong(obj.EXAMINEDATE, false);
					} else {
						return "";
					}
				}
			}
		];

		var tableHeight = $(window).height() - $('.pcheck').height() - 190;
		$(window).resize(function(){
			$("#grid-table").jqGrid( 'setGridHeight', $(window).height() - $('.pcheck').height() - 690 );
			$("#grid-table").jqGrid( 'setGridWidth', $(window).width()*0.99 );
		});

	    $("#grid-table").jqGrid({
	    	height: tableHeight,
	    	url : BASE_URL + "/law/lawcheckinfo/taskinfo",
			datatype: "json",
			cache : false,
			mtype : 'POST',
			colNames:colname,
			colModel:colmodel,
			postData:{
				businessinfoid:$('#businessinfoid').val()
			},
			sortname : 'examinedate',
			sortorder : "DESC",
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
			caption: "执法检查记录",
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

/**
 * 确定
 */
$("#conBtn").on("click", function () {
	var ids = $("#grid-table").jqGrid('getGridParam','selarrrow');
	if(ids.length !=1){
		// 弹出提示信息
		parent.toast("请选择一条记录！");
		return;
	}
	var rowdata = $("#grid-table").jqGrid('getRowData',ids[0]); //选中的一条记录
	var checkinfoid = rowdata.CHECKINFOID;
	var taskid = $("#taskid").val();
	var tasknam = $("#tasknam").val();
	var taskstate = $("#taskstate").val();
	parent.openWin(BASE_URL+"/law/lawdocinfo/handle?docid="+checkinfoid+"&doctype=2&menupagetype=menuEdit&taskid="+taskid+"&taskstate="+taskstate,"执法复查",'80%','90%');
	//parent.parent.closeWin();
});


/*加载*/
function reloadGrid(){
	$("#grid-table").jqGrid('setGridParam',{
		page:1,postData:{
			businessinfoid:$('#businessinfoid').val(),
			masterid:$('#masterid').val(),
			username:$('#slavelid').val()
		}
	}).trigger("reloadGrid");
}


/*搜索查询*/
$("#searchBtn").bind("click",function(){
	reloadGrid();
});

/*详细查询*/
function display(id){
	parent.openWin(BASE_URL+"/law/lawdocinfo/menu?id="+id+"&doctype=1&menupagetype=menuDisplay&writtype=null",'执法检查信息','80%','98%');	
}

/*返回*/
$("#backBtn").bind("click",function(){
	parent.closeWin();
});

