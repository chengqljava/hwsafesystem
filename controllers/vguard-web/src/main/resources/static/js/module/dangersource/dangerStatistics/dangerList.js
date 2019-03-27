$(document).ready(function() {
	var colname = [/*'企业名称','企业负责人','联系电话',*/'危险源名称','危险源种类','危险源级别','危险源地址']; 
	var colmodel = [
		/*{name:'ENTNAME',index:'ENTNAME',align:'left',
			formatter:function(cellvalue, options, obj) { 
				   return '<a href="javascript:void(0);" onclick="display_entName(\''+obj.BUSINESSINFOID+'\',\''+obj.ENTNAME+'\')">'+obj.ENTNAME+'</a>';
			}
		},
		{name:'LEGALPERSON',index:'LEGALPERSON'},
		{name:'PHONE',index:'PHONE',align:'left'},*/
		{name:'DANGERNAME',index:'DANGERNAME',align:'left',
			formatter:function(cellvalue, options, obj) { 
				return '<a href="javascript:void(0);" onclick="display(\''+obj.DANGERID+'\')">'+obj.DANGERNAME+'</a>';
			}
		},
		{name:'DANGERTYPE',index:'DANGERTYPE',align:'left',
			formatter:function(cellvalue, options, obj) { 
				return SelectOption.getDangerType(obj.DANGERTYPE);//重大危险源类别
			}
		},
		{name:'DANGERLEVEL',index:'DANGERLEVEL',align:'center',
			formatter:function(cellvalue, options, obj) { 
				if(obj.DANGERLEVEL>0){
					return SelectOption.getdangSouLevel(obj.DANGERLEVEL);
				}
				return "";
			}
		},
		{name:'DANGERADDR',index:'DANGERADDR',align:'center'},
	];
	
	var tableHeight = $(window).height() - $('.pcheck').height() - 190 -33;
	$(window).resize(function(){
		$("#grid-table").jqGrid( 'setGridHeight', $(window).height() - $('.pcheck').height() - 190 -33 );
		$("#grid-table").jqGrid( 'setGridWidth', $(window).width()*0.99 );
	});

    $("#grid-table").jqGrid({
    	height: tableHeight,
    	url : BASE_URL + "/dangersource/dssStatistics/dssDangerList",
		datatype: "json",
		cache : false,
		mtype : 'post',
		colNames:colname,
		colModel:colmodel,
		postData:{
			districtid:$("#districtid").val(),
			dangerLevel:$("#dangerLevel").val(),
			dangerType:$("#dangerType").val()
		},
		sortname : 'UPDATETIME',
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
		caption: "重大危险源列表",
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

/*详细查询*/
function display(dangerid){
	parent.openWin(BASE_URL+"/dangersource/dssdangerinfo/pageTab/"+dangerid,'详细','65%','75%');
}

/*详细查询*/
function display_entName(businessinfoid,entname){
	// parent.openWin(BASE_URL+'/enterprise/entsafeinfomenu/safemenuDisplay/'+businessinfoid,entname,'80%','90%');
    parent.openWin(BASE_URL+"/views/module/enterprise/entbusinessinfo/displayEntbusinessinfo.html?businessinfoid="+businessinfoid,'详细','90%','90%');
}