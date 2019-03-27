$(document).ready(function() {
	var colname = ['主键id','执法登记id','案件编号','案件名称','被调查企业','所属辖区','执法部门','执法人员','立案日期','案件状态','最近更新时间'];
	var colmodel = [
		{name:'CASEID',index:'CASEID', width:'5%', hidden : true},
		{name:'CHECKINFOID',index:'CHECKINFOID', width:'5%', hidden : true},
		{name:'CASECODE',index:'CASECODE',width:'10%',align:'center',sortable : false,
			formatter:function(cellvalue, options, obj) { 
				if(obj.AREA){
					return obj.AREA+obj.YEAR+obj.NUM;
				}else{
					return '';
				}
			}	
		},
		{name:'CASENAME',index:'CASENAME',width:'15%',align:'center',sortable : false,
			formatter:function(cellvalue, options, obj) { 
				   return '<a href="javascript:void(0);" onclick="displayCase(\''+obj.CHECKINFOID+'\',\''+obj.CASEID+'\',\''+obj.CASENAME+'\')">'+obj.CASENAME+'</a>';
			}
		},
		{name:'ENTNAME',index:'ENTNAME',width:'10%',align:'left',sortable : false,
			formatter:function(cellvalue, options, obj) { 
				if(obj.AREA){
					return '<a href="javascript:void(0);" onclick="displayEnt(\''+obj.BUSINESSINFOID+'\',\''+obj.ENTNAME+'\')">'+obj.ENTNAME+'</a>';
				}else{
					return '';
				}
			}
		},
		{name:'DISTRICT',index:'DISTRICT',width:'10%',align:'center',sortable : false,
			formatter:function(cellvalue, options, obj) { 
				   return obj.DISAREA+obj.DISSTREET;
			}
		},
		{name:'DEPARTNAME',index:'DEPARTNAME',width:'10%',align:'center',sortable : false},
		{name:'USERNAME',index:'USERNAME',width:'10%',align:'center',sortable : false},
		{name:'FILINGDATE',index:'FILINGDATE',width:'10%',align:'center',
			formatter:function(cellvalue, options, obj) { 
				if (obj.FILINGDATE) {
					return getSmpFormatDateByLong(obj.FILINGDATE, false);
				} else {
					return "";
				}
			}
		},
		{name:'CASESTATE',index:'CASESTATE',width:'10%',align:'center',sortable : false,
			editoptions : {
				value : "0:已登记;1:已立案;2:审理中;3:执行中;4:已结案"
			},
			formatter : 'select'
		},
		{name:'UPDATETIME',index:'UPDATETIME', width:'5%', hidden : true}
	];

	var tableHeight = $(window).height() - $('.pcheck').height() - 190 - 33;
	$(window).resize(function(){
		$("#grid-table").jqGrid( 'setGridHeight', $(window).height() - $('.pcheck').height() - 190 - 33 );
		$("#grid-table").jqGrid( 'setGridWidth', $(window).width()*0.99 );
	});

	    $("#grid-table").jqGrid({
	    	height: tableHeight,
	    	url : BASE_URL + "/law/lawcase/caselist",
			datatype: "json",
			cache : false,
			mtype : 'POST',
			colNames:colname,
			colModel:colmodel,
			postData:{
				businessinfoid:$('#businessinfoid').val()
			},
			sortname : 'filingdate',
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
			caption: "案件记录",
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
	parent.openWin(BASE_URL+"/law/lawdocinfo/handle?docid="+checkinfoid+"&doctype=null&menupagetype=menuEdit&taskid="+taskid+"&taskstate="+taskstate,"案件信息",'80%','90%');
	//parent.parent.closeWin();
});


/*加载*/
function reloadGrid(){
	$("#grid-table").jqGrid('setGridParam',{
		page:1,postData:{
			businessinfoid:$('#businessinfoid').val()
		}
	}).trigger("reloadGrid");
}


/*搜索查询*/
$("#searchBtn").bind("click",function(){
	reloadGrid();
});



/*返回*/
$("#backBtn").bind("click",function(){
	parent.closeWin();
});

