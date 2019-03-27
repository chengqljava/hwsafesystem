$(document).ready(function() {
	//执法部门下拉框
	if(undefined==$('#type').val()){
		SelectOption.loadSysDepart("deptid",null);
	}
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
					if(obj.ENTNAME){
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
	    	url : BASE_URL + "/law/lawcase/list",
			datatype: "json",
			cache : false,
			mtype : 'POST',
			colNames:colname,
			colModel:colmodel,
			postData:{
				casestate:$('#casestate').val(),
				deptid:$('#deptid').val(),
				casename:$('#casename').val(),
				username:$("#username").val(),
				filingdate1:$('#filingdate1').val(),
				filingdate2:$('#filingdate2').val(),
				districtid:$("#districtid").val(),
				districtlevel:$("#districtlevel").val(),
				startTime:$("#startTime").val(),
                endTime:$("#endTime").val(),
                businessinfoid:$("#businessinfoid").val()//GIS查看添加条件
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
			rowNum:10,
			rowList:[10,20,30],
			altRows: true,
			multiselect: true,
			caption: "案件列表",
			autowidth: true,
			loadComplete: function() {
				if($(window).width() < 700) {
					$('.ui-jqgrid-htable').css({"width":"900"});
					$("#grid-table").css({"width":"900"});
					$("#grid-table").closest(".ui-jqgrid-bdiv").css({ "overflow-x" : "scroll","height":"350"});
					$(".ui-jqgrid-hdiv").css({ "overflow-x" : "scroll"});
					$(".table-line .tableTitle").find("button").css({"margin-right":"0px","margin-top":"7px"});
				} else {
					$("#grid-table").jqGrid( 'setGridWidth', $(window).width()*0.99 );
				}
			}
		});
});

/*加载行政区域*/
function searchDistrict(districtid){
	$("#districtid").val(districtid);
	reloadGrid();
}

/*加载*/
function reloadGrid(){
	$("#grid-table").jqGrid('setGridParam',{
		page:1,postData:{
			casestate:$('#casestate').val(),
			deptid:$('#deptid').val(),
			casename:$('#casename').val(),
			username:$('#username').val(),
			filingdate1:$('#filingdate1').val(),
			filingdate2:$('#filingdate2').val(),
			districtid:$("#districtid").val(),
            districtlevel:$("#districtlevel").val(),
            startTime:$("#startTime").val(),
            endTime:$("#endTime").val()
		}
	}).trigger("reloadGrid");
}


/*选择案例*/
$("#selectBtn").on("click", function () {
	var ids = $("#grid-table").jqGrid('getGridParam','selarrrow');
	if(ids.length !=1){
		// 弹出提示信息
		parent.toast("请选择一条记录！");
		return;
	}
	var rowdata = $("#grid-table").jqGrid('getRowData',ids[0]); //选中的一条记录
	parent.getActiveIFrame().sendLawCase(rowdata.CASEID);
	parent.closeWin();// 关闭弹出框
});

/*搜索查询*/
$("#searchBtn").bind("click",function(){
	reloadGrid();
});

/*重置*/
$("#resetBtn").bind("click",function(){
	$('#deptid').val("");
	$('#casename').val("");
	$('#filingdate1').val("");
	$('#filingdate2').val("");
	$('#username').val("");
});

/*详细查询*/
function displayEnt(businessinfoid,entname){
	// parent.openWin(BASE_URL+'/enterprise/entsafeinfomenu/safemenuDisplay/'+businessinfoid,entname,'80%','90%');
    parent.openWin(BASE_URL+"/views/module/enterprise/entbusinessinfo/displayEntbusinessinfo.html?businessinfoid="+businessinfoid,'详细','90%','90%');
}

/*详细查询*/
function displayCase(checkinfoid,caseid,casename){
	parent.openWin(BASE_URL+"/law/lawdocinfo/menu?id="+checkinfoid+"&doctype=null&menupagetype=menuEdit&caseid=" + caseid +"&writtype=null",casename,'80%','98%');	
}

/*流程任务列表展示*/
function displayTaskList(procinstid){
	parent.openWin(BASE_URL+"/law/lawmydoc/displayTaskList/"+procinstid,'流程任务办理日志','70%','80%');
}

/*流程图展示*/
function displayProcinst(procinstid){
	parent.openWin(BASE_URL+"/law/lawmydoc/displayProcinst/"+procinstid,'流程任务流转图','70%','80%');
}

/* 添加 */
$("#addBtn").bind("click", function() {
	parent.openWin(BASE_URL + '/law/lawcase/add', '添加','40%','35%');
});

/* 编辑 */
$("#editBtn").bind("click", function() {
	// 返回当前grid中复选框所选择的数据的id
	var ids = $("#grid-table").jqGrid('getGridParam', 'selarrrow');
	if (ids.length != 1) {
		// 弹出提示信息
		parent.toast("请选择一条数据！");
		return;
	}
	// 返回指定id行的数据
	var rowdatas = $("#grid-table").jqGrid('getRowData', ids[0]);
	var checkinfoid = rowdatas.CHECKINFOID;
	var casename = rowdatas.CASENAME;
	var caseId = rowdatas.CASEID;
	/*案件列表*/
	parent.openWin(BASE_URL + "/law/lawdocinfo/menu?id=" + checkinfoid + "&doctype=null&" +
			"menupagetype=menuEdit&caseid=" + caseId + "&writtype=null", casename, "80%", "98%");	
});
