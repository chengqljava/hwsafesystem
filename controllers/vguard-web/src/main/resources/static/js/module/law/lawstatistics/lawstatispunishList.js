$(document).ready(function() {
		//执法部门下拉框
		SelectOption.loadSysDepart("deptid",null);
		//处罚方式下拉框
		SelectOption.loadLawPunishWay("punishway");
		
		var colname = ['主键id','企业名称','违法事实','处罚依据','处罚决定书','文书日期','处罚决定 ','处罚方式','处罚类型','检查id'];
		var colmodel = [
			{name:'PUNISHID',index:'PUNISHID', width:'15%', hidden : true},
			{name:'ENTNAME',index:'ENTNAME',width:'10%',align:'left',sortable : false,
				formatter:function(cellvalue, options, obj) { 
					   return '<a href="javascript:void(0);" onclick="display(\''+obj.BUSINESSINFOID+'\',\''+obj.ENTNAME+'\')">'+obj.ENTNAME+'</a>';
				}},
			{name:'ILLEGALACT',index:'ILLEGALACT',width:'10%',align:'center',sortable : false,
				formatter:function(cellvalue, options, obj) { 
					   return '<a href="javascript:void(0);" onclick="displayPunish(\''+obj.CHECKINFOID+'\',\''+obj.PUNISHWAY+'\',\''+obj.PUNISHTYPE+'\')">'+obj.ILLEGALACT+'</a>';
				}},
			{name:'PUNISHSTANDARD',index:'PUNISHSTANDARD',width:'10%',align:'center',sortable : false},
			{name:'DOCNUM',index:'DOCNUM',width:'10%',align:'center',sortable : false,
				formatter:function(cellvalue, options, obj) { 
					return "("+obj.DOCAREA+")安监管罚当("+obj.DOCYEAR+")"+obj.DOCNUM+"号";
				}
			},
			{name:'DOCDATE',index:'DOCDATE',width:'10%',align:'center',
				formatter:function(cellvalue, options, obj) { 
					if (obj.DOCDATE) {
						return getSmpFormatDateByLong(obj.DOCDATE, false);
					} else {
						return "";
					}
				}
			},
			{name:'PUNISHRESULT',index:'PUNISHRESULT',width:'10%',align:'center',sortable : false,summaryType:'sum'},
			{name:'PUNISHWAY',index:'PUNISHWAY', width:'15%', hidden : true},
			{name:'PUNISHTYPE',index:'PUNISHTYPE', width:'15%', hidden : true},
			{name:'CHECKINFOID',index:'CHECKINFOID', width:'15%', hidden : true}
		];

		var tableHeight = $(window).height() - $('.pcheck').height() - 190;
		$(window).resize(function(){
			$("#grid-table").jqGrid( 'setGridHeight', $(window).height() - $('.pcheck').height() - 190 );
			$("#grid-table").jqGrid( 'setGridWidth', $(window).width()*0.99 );
		});

	    $("#grid-table").jqGrid({
	    	height: tableHeight,
	    	url : BASE_URL + "/law/lawpunishdecision/statis",
			datatype: "json",
			cache : false,
			mtype : 'POST',
			colNames:colname,
			colModel:colmodel,
			postData:{
				deptid:$('#deptid').val(),
				punishway:$('#punishway').val(),
				districtid:$("#districtid").val(),
				punishtype:$("#punishtype").val()
			},
			sortname : 'docdate',
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
			/* 页脚汇总
			footerrow : true,
			userDataOnFooter : true,*/
			multiselect: true,
			caption: "行政处罚统计表",
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

/*加载行政区域*/
function searchDistrict(districtid){
	$("#districtid").val(districtid);
	reloadGrid();
}

/*加载*/
function reloadGrid(){
	$("#grid-table").jqGrid('setGridParam',{
		page:1,postData:{
			deptid:$('#deptid').val(),
			punishway:$('#punishway').val(),
			districtid:$("#districtid").val(),
			punishtype:$("#punishtype").val()
		}
	}).trigger("reloadGrid");
}

/*搜索查询*/
$("#searchBtn").bind("click",function(){
	reloadGrid();
});

/*重置*/
$("#resetBtn").bind("click",function(){
	$('#deptid').val("");
	$('#punishway').val("");
});

/*详细查询*/
function display(businessinfoid,entname){
	// parent.openWin(BASE_URL+'/enterprise/entsafeinfomenu/safemenuDisplay/'+businessinfoid,entname,'80%','90%');
    parent.openWin(BASE_URL+"/views/module/enterprise/entbusinessinfo/displayEntbusinessinfo.html?businessinfoid="+businessinfoid,'详细','90%','90%');
}

/*详细查询*/
function displayPunish(checkinfoid,punishway,punishtype){
	parent.openWin(BASE_URL+'/law/lawpunishdecision/punishDisplay/'+checkinfoid+"/"+punishway+"/"+punishtype,'详情','80%','90%');
}
