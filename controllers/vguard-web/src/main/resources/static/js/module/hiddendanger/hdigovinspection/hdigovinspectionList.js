$(document).ready(function() {
	//初始化下拉框
	SelectOption.loadCheckResult("restate");
	
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
	
	var tableHeight = $(window).height() - $('.pcheck').height() - 190;
	$(window).on('resize.jqGrid', function () {
		$("#grid-table").jqGrid( 'setGridHeight', $(window).height() - $('.pcheck').height() - 190 );
		$("#grid-table").jqGrid( 'setGridWidth', $(window).width()*0.99 );
    })

    $("#grid-table").jqGrid({
    	height: tableHeight,
    	url : BASE_URL + "/hiddendanger/hdigovinspection/list",
		datatype: "json",
		cache : false,
		mtype : 'post',
		colNames:colname,
		colModel:colmodel,
		postData:{
			entname:$("#entname").val(),
			restate:$("#restate").val()
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
			entname:$("#entname").val(),
			restate:$("#restate").val()
		}
	}).trigger("reloadGrid");
}

/*搜索查询*/
$("#searchBtn").bind("click",function(){
	reloadGrid();
});

/*重置*/
$("#resetBtn").bind("click",function(){
	$("#entname").val("");
	$("#restate").val("");
});

/*删除方法*/
function del(param){
	$.ajax({ 
	  		url: BASE_URL+"/hiddendanger/hdigovinspection/loadLinkById",
	  		type:'post',
	  		dataType:'json',
	  		data:param,
	  		success: function(json){
	  			if(json.success==false){
	  				//有父引用
	  				parent.toast(json.msg);
	  			}else{
	  			    //弹出提示框
	  				parent.confirm('确认删除吗?',function(){
	  					$.ajax({ 
	  				  		url: BASE_URL+"/hiddendanger/hdigovinspection/delete",
	  				  		type:'post',
	  				  		dataType:'json',
	  				  		data:param,
	  				  		success: function(json){
	  				  			if(json.success==true){
	  				  				parent.toast(json.msg);
	  				  				reloadGrid();//刷新列表
	  				  				loadCheckitemTree();//刷新树
	  				  			}else{
	  				  				parent.toast(json.msg);
	  				  			}
	  				  		}
	  					 });
	  				})
	  		  }
		  }
	});
}

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
