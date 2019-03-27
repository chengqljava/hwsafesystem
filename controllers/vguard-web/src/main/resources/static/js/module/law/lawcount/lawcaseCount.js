$(document).ready(function() {
	//2017-6-2 QYS 按照bug反馈要求注释
	var colname = ['主键id','案件编号','案件名称','被调查企业','所属辖区','执法部门','执法人员','立案日期','结案时间','案件状态'];
//		var colname = ['主键id','案件编号','被调查企业','所属辖区','执法部门','执法人员','行政处罚流程','立案日期','结案时间','案件状态'];
		var colmodel = [
			{name:'CASEID',index:'CASEID', width:'5%', hidden : true},
			{name:'CASECODE',index:'CASECODE',width:'10%',align:'center',sortable : false,
				formatter:function(cellvalue, options, obj) { 
					if(obj.AREA){
						return obj.AREA+obj.YEAR+obj.NUM;
					}else{
						return '';
					}
				}
			},
			{name:'CASENAME',index:'CASENAME',width:'10%',align:'center',sortable : false,
				formatter:function(cellvalue, options, obj) { 
					   return '<a href="javascript:void(0);" onclick="display(\''+obj.CHECKINFOID+'\')">'+obj.CASENAME+'</a>';
				}
			},
			{name:'ENTNAME',index:'ENTNAME',width:'10%',align:'left',sortable : false},
			{name:'DISTRICT',index:'DISTRICT',width:'10%',align:'center',sortable : false,
				formatter:function(cellvalue, options, obj) { 
					   return obj.DISAREA+obj.DISSTREET
				}
			},
			{name:'DEPARTNAME',index:'DEPARTNAME',width:'10%',align:'center',sortable : false},
			{name:'USERNAME',index:'USERNAME',width:'10%',align:'center',sortable : false},
			//2017-6-2 QYS 按照bug反馈要求注释
//			{name:'PROCESS',index:'PROCESS',width:'10%',align:'center',
//				editoptions : {
//					value : "1:简易流程;2:一般流程;"
//				},
//				formatter : 'select'
//			},
			{name:'FILINGDATE',index:'FILINGDATE',width:'10%',align:'center',
				formatter:function(cellvalue, options, obj) { 
					if (obj.FILINGDATE) {
						return getSmpFormatDateByLong(obj.FILINGDATE, false);
					} else {
						return "";
					}
				}
			},
			{name:'CLOSEDDATE',index:'CLOSEDDATE',width:'10%',align:'center',
				formatter:function(cellvalue, options, obj) { 
					if (obj.CLOSEDDATE) {
						return getSmpFormatDateByLong(obj.CLOSEDDATE, false);
					} else {
						return "";
					}
				}
			},
			{name:'CASESTATE',index:'CASESTATE',width:'10%',align:'center',sortable : false,
				editoptions : {
					value : "1:已立案;2:审理中;3:执行中;4:已结案"
				},
				formatter : 'select'}
		];

		var tableHeight = $(window).height() - $('.pcheck').height() - 190;
		$(window).resize(function(){
			$("#grid-table").jqGrid( 'setGridHeight', $(window).height() - $('.pcheck').height() - 190 );
			$("#grid-table").jqGrid( 'setGridWidth', $(window).width()*0.99 );
		});

	    $("#grid-table").jqGrid({
	    	height: tableHeight,
	    	url : BASE_URL + "/law/lawcase/list",
			datatype: "json",
			cache : false,
			mtype : 'POST',
			colNames:colname,
			colModel:colmodel,
			postData:{
				casestate:$('#casestate').val(),
				deptid:$('#deptid').val(),
				username:$("#username").val(),
				casename:$('#casename').val(),
				filingdate1:$('#filingdate1').val(),
				filingdate2:$('#filingdate2').val(),
				districtid:$("#districtid").val(),
				districtlevel:$("#districtlevel").val(),
				startTime:$("#startTime").val(),
				endTime:$("#endTime").val()
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
			rowNum:15,
			rowList:[15,30,45],
			altRows: true,
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
			casestate:$('#casestate').val(),
			deptid:$('#deptid').val(),
			username:$("#username").val(),
			casename:$('#casename').val(),
			filingdate1:$('#filingdate1').val(),
			filingdate2:$('#filingdate2').val(),
			districtid:$("#districtid").val(),
			districtlevel:$("#districtlevel").val(),
			startTime:$("#startTime").val(),
			endTime:$("#endTime").val()
		}
	}).trigger("reloadGrid");
}



/*详细查询*/
function display(id){
	parent.openWin(BASE_URL+"/law/lawdocinfo/menu?id="+id+"&doctype=null&menupagetype=menuDisplay&writtype=null",'执法检查信息','80%','98%');	
}