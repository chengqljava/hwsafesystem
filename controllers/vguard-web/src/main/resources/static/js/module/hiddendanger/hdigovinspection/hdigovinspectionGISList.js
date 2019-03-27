$(document).ready(function() {
	
	var colname = ['主键id','工商信息','已巡查对象','巡查部门','巡查人员','巡查时间','巡查项数','隐患数','巡查结果','ip地址']; 
	var colmodel = [
		{name:'INSPECTIONID',index:'INSPECTIONID', width:'5%',hidden: true},
		{name:'BUSINESSINFOID',index:'BUSINESSINFOID', width:'5%',hidden: true},
		{name:'ENTNAME',index:'ENTNAME', width:'5%',align:'left',
			formatter:function(cellvalue, options, obj) { 
				return '<a href="javascript:void(0);" onclick="display(\''+obj.BUSINESSINFOID+'\',\''+obj.ENTNAME+'\')">'+obj.ENTNAME+'</a>';
			}
		},
		{name:'ORGNAME',index:'ORGNAME', width:'5%',align:'left'},
		{name:'USERNAME',index:'USERNAME', width:'5%',align:'left'},
		{name:'CHECKDATE',index:'CHECKDATE', width:'5%',align:'left'
			,formatter : function(cellvalue, options, obj) {
				return getFormatDateByLong(obj.CHECKDATE,
					"yyyy-MM-dd");
			}
		},
		{name:'COUNTNUM',index:'COUNTNUM', width:'5%',align:'left',
			formatter:function(cellvalue, options, obj) { 
				if(obj.COUNTNUM != "" && obj.COUNTNUM !=null){
					return '<a href="javascript:void(0);" onclick="displayCheckList(\''+obj.ENTNAME+'\',\''+obj.INSPECTIONID+'\')">'+obj.COUNTNUM+'</a>';
				}else{
					return '<a href="javascript:void(0);" onclick="displayCheckList(\''+obj.ENTNAME+'\',\''+obj.INSPECTIONID+'\')">'+0+'</a>';
				}			}
		},
		{name:'COUNTYES',index:'COUNTYES', width:'5%',align:'left',
			formatter:function(cellvalue, options, obj) { 
				if(obj.COUNTYES != "" && obj.COUNTYES !=null){
					return '<a href="javascript:void(0);" onclick="displayDangerList(\''+obj.ENTNAME+'\',\''+obj.INSPECTIONID+'\')">'+obj.COUNTYES+'</a>';
				}else{
					return '<a href="javascript:void(0);" onclick="displayDangerList(\''+obj.ENTNAME+'\',\''+obj.INSPECTIONID+'\')">'+0+'</a>';
				}
			}
		},
		{name:'COUNTYES',index:'COUNTYES', width:'5%',align:'left',
			formatter : function(cellvalue, options, obj) {
				if(obj.COUNTYES>0){
					return "有隐患";
				}else{
					return "无隐患";
				}
		}},
		{name:'IPADDRESS',index:'IPADDRESS', width:'5%',align:'left'}
	];
	
	$(window).on('resize.jqGrid', function () {
		$("#grid-table").jqGrid( 'setGridWidth', $(window).width()*0.99);
    })
    
    $("#grid-table").jqGrid({
    	height: 250,
    	url : BASE_URL + "/hiddendanger/hdigovinspection/gislist",
		datatype: "json",
		cache : false,
		mtype : 'post',
		colNames:colname,
		colModel:colmodel,
		postData:{
			businessinfoid:$("#businessinfoid").val()
		},
		sortname : 'CHECKDATE',
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
		caption: "巡查登记",
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
			businessinfoid:$("#businessinfoid").val()
		}
	}).trigger("reloadGrid");
}

/*搜索查询*/
$("#searchBtn").bind("click",function(){
	reloadGrid();
});


/**
 * 企业安全信息
 * @param businessinfoid
 * @param entname
 */
function display(businessinfoid,entname){
	// parent.openWin(BASE_URL+'/enterprise/entsafeinfomenu/safemenuDisplay/'+businessinfoid,entname,'80%','90%');
    parent.openWin(BASE_URL+"/views/module/enterprise/entbusinessinfo/displayEntbusinessinfo.html?businessinfoid="+businessinfoid,'详细','90%','90%');
}

/**
 * 巡查项列表
 * @param businessinfoid
 * @param entname
 */
function displayCheckList(entname,inspectionid){
	parent.openWin(BASE_URL+"/hiddendanger/hdigovchecklist/displayGovCheckList?inspectionid="+inspectionid,entname+' 自查列表','70%','60%');
}

/**
 * 巡查隐患列表
 * @param businessinfoid
 * @param entname
 */
function displayDangerList(entname,inspectionid){
	parent.openWin(BASE_URL+"/hiddendanger/hdigovchecklist/displayGovDangerList?inspectionid="+inspectionid,entname+' 自查列表','70%','60%');
}
