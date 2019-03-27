$(document).ready(function() {
		//SelectOption.loadTureFalse("isregister");
	
		var colname = ['主键id','立案状态','被检查企业','执法部门','执法人员','检查日期','状态'];
//		var colname = ['主键id','立案状态','被检查企业','执法部门','执法人员','检查日期','责改日期','复查日期','复查意见','状态'];
		var colmodel = [
			{name:'CHECKINFOID',index:'CHECKINFOID', width:'15%', hidden : true},
			{name:'ISREGISTER',index:'ISREGISTER', width:'15%', hidden : true},
			{name:'ENTNAME',index:'ENTNAME',width:'10%',align:'left',sortable : false,
				formatter:function(cellvalue, options, obj) { 
					   return '<a href="javascript:void(0);" onclick="display(\''+obj.BUSINESSINFOID+'\',\''+obj.ENTNAME+'\')">'+obj.ENTNAME+'</a>';
				}
			},
			{name:'DEPARTNAME',index:'DEPARTNAME',width:'10%',align:'center',sortable : false},
			{name:'USERNAME',index:'USERNAME',width:'10%',align:'center',sortable : false},
			{name:'EXAMINEDATE',index:'EXAMINEDATE',width:'10%',align:'center',
				formatter:function(cellvalue, options, obj) { 
					if (obj.EXAMINEDATE) {
						return getSmpFormatDateByLong(obj.EXAMINEDATE, false);
					} else {
						return "";
					}
				}
			},
//			{name:'DEADLINE',index:'DEADLINE',width:'10%',align:'center',
//				formatter:function(cellvalue, options, obj) { 
//					if (obj.DEADLINE) {
//						return getSmpFormatDateByLong(obj.DEADLINE, false);
//					} else {
//						return "";
//					}
//				}
//			},
//			{name:'REVIEWDATE',index:'REVIEWDATE',width:'10%',align:'center',
//				formatter:function(cellvalue, options, obj) { 
//					if (obj.REVIEWDATE) {
//						return getSmpFormatDateByLong(obj.REVIEWDATE, false);
//					} else {
//						return "";
//					}
//				}
//			},
//			{name:'OPINION',index:'OPINION',width:'10%',align:'center',sortable : false},
			
			{name:'DOCSTATE',index:'DOCSTATE',width:'10%',align:'center',sortable : false,
				formatter:function(cellvalue, options, obj) { 
					if (obj.DOCSTATE == "01") {
						return "待检查";
					} else if(obj.DOCSTATE == "02"){
						return "检查中";
					} else if(obj.DOCSTATE == "03"){
						return "完成检查";
					}
					else{
						return "待检查";
					}
				}
			}
			
//			{name:'ISREG',index:'ISREG',width:'10%',align:'center',sortable : false,
//				formatter:function(cellvalue, options, obj) { 
//					if (obj.ISREGISTER == "1") {
//						return obj.AREA+obj.YEAR+obj.NUM;
//					} else if(obj.ISREGISTER == "0"){
//						return "案件已登记";
//					} else {
//						return "";
//					}
//				}
//			}
		];

		var tableHeight = $(window).height() - $('.pcheck').height() - 190 - 33;
		$(window).resize(function(){
			$("#grid-table").jqGrid( 'setGridHeight', $(window).height() - $('.pcheck').height() - 190 - 33 );
			$("#grid-table").jqGrid( 'setGridWidth', $(window).width()*0.99 );
		});

	    $("#grid-table").jqGrid({
	    	height: tableHeight,
	    	url : BASE_URL + "/law/lawcheckinfo/list",
			datatype: "json",
			cache : false,
			mtype : 'POST',
			colNames:colname,
			colModel:colmodel,
			postData:{
				entname:$('#entname').val(),
				deptname:$('#deptname').val(),
				username:$('#username').val(),
				examinedate:$('#examinedate').val(),
				districtid:$("#districtid").val(),//执法情况汇总表使用点击具体数字弹出框需要的条件
                districtlevel:$("#districtlevel").val(),//执法情况汇总表使用点击具体数字弹出框需要的条件
                startTime:$("#startTime").val(),//执法情况汇总表使用点击具体数字弹出框需要的条件
                endTime:$("#endTime").val(),//执法情况汇总表使用点击具体数字弹出框需要的条件
                isreg:$("#isreg").val(),
                docstate:$("#docstate").val()//立案时只提供检查完成的数据列表
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

/*加载*/
function reloadGrid(){
	$("#grid-table").jqGrid('setGridParam',{
		page:1,postData:{
			entname:$('#entname').val(),
			deptname:$('#deptname').val(),
			username:$('#username').val(),
			examinedate:$('#examinedate').val(),
			districtid:$("#districtid").val(),//执法情况汇总表使用点击具体数字弹出框需要的条件
            districtlevel:$("#districtlevel").val(),//执法情况汇总表使用点击具体数字弹出框需要的条件
            startTime:$("#startTime").val(),//执法情况汇总表使用点击具体数字弹出框需要的条件
            endTime:$("#endTime").val(),//执法情况汇总表使用点击具体数字弹出框需要的条件
            isreg:$("#isreg").val(),
            docstate:$("#docstate").val()//立案时只提供检查完成的数据列表
		}
	}).trigger("reloadGrid");
}

/*加载行政区域*/
function searchDistrict(districtid){
	$("#districtid").val(districtid);
	reloadGrid();
}

/*搜索查询*/
$("#searchBtn").bind("click",function(){
	reloadGrid();
});

/*重置*/
$("#resetBtn").bind("click",function(){
	$('#entname').val("");
	$('#deptname').val("");
	$('#username').val("");
	$('#examinedate').val("");
	$('#districtid').val("");
});

/*详细查询*/
function display(businessinfoid,entname){
	// parent.openWin(BASE_URL+'/enterprise/entsafeinfomenu/safemenuDisplay/'+businessinfoid,entname,'80%','90%');
    parent.openWin(BASE_URL+"/views/module/enterprise/entbusinessinfo/displayEntbusinessinfo.html?businessinfoid="+businessinfoid,'详细','90%','90%');
}

