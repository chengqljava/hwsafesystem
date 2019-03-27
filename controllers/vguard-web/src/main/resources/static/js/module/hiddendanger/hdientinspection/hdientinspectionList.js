


$(document).ready(function() {
	
	//初始化下拉框
	if(!$('#type').val()){
		SelectOption.loadNowYear("nowyear");//年份
		SelectOption.loadQuarter("quarter");//季度
		SelectOption.loadReportstatus("reportstatus");//上报状态
	}
	
	
	var colname = ['主键id','全部项数','已自查项数','年度','季度','自查项数','隐患数','已整改数','上报状态','登记人','登记时间']; 
	var colmodel = [
		{name:'INSPECTIONID',index:'INSPECTIONID', width:'5%',hidden: true},
		{name:'COUNTINFO',index:'COUNTINFO', width:'5%',hidden: true},
		{name:'COUNTNUM',index:'COUNTNUM', width:'5%',hidden: true},
		{name:'NOWYEAR',index:'NOWYEAR',width:'15%',align:'left'},
		{name:'QUARTER',index:'QUARTER',width:'10%',align:'left'},
		{name:'COUNTNUMS',index:'COUNTNUMS',width:'15%',align:'left',
			formatter:function(cellvalue, options, obj) { 
				if(obj.COUNTNUM != '' && obj.COUNTNUM != null){
					return '<a href="javascript:void(0);" onclick="displayCheckList(\''+obj.BUSINESSINFOID+'\',\''+obj.ENTNAME+'\',\''+obj.INSPECTIONID+'\')">'+obj.COUNTNUM + "/" + obj.COUNTINFO+'</a>';
				}else{
					return '<a href="javascript:void(0);" onclick="displayCheckList(\''+obj.BUSINESSINFOID+'\',\''+obj.ENTNAME+'\',\''+obj.INSPECTIONID+'\')">0/' + obj.COUNTINFO+'</a>';
				}
			}
		},
		{name:'COUNTYES',index:'COUNTYES',width:'15%',align:'left',
			formatter:function(cellvalue, options, obj) { 
				if(obj.COUNTYES != '' && obj.COUNTYES != null){
					return '<a href="javascript:void(0);" onclick="displayDangerList(\''+obj.BUSINESSINFOID+'\',\''+obj.ENTNAME+'\',\''+obj.INSPECTIONID+'\')">'+obj.COUNTYES+'</a>';
				}else{
					return '<a href="javascript:void(0);" onclick="displayDangerList(\''+obj.BUSINESSINFOID+'\',\''+obj.ENTNAME+'\',\''+obj.INSPECTIONID+'\')">'+0+'</a>';
				}
			}
		},
		{name:'COUNTEAB',index:'COUNTEAB',width:'15%',align:'left',
			formatter:function(cellvalue, options, obj) { 
				if(obj.COUNTEAB != '' && obj.COUNTEAB != null){
					return '<a href="javascript:void(0);" onclick="displayNoDangerList(\''+obj.BUSINESSINFOID+'\',\''+obj.ENTNAME+'\',\''+obj.INSPECTIONID+'\')">'+obj.COUNTEAB+'</a>';
				}else{
					return '<a href="javascript:void(0);" onclick="displayNoDangerList(\''+obj.BUSINESSINFOID+'\',\''+obj.ENTNAME+'\',\''+obj.INSPECTIONID+'\')">'+0+'</a>';
				}
			}	
		},
		{name:'REPORTSTATUS',index:'REPORTSTATUS',width:'15%',align:'left',
			editoptions : {value : "0:未上报;1:已上报"},formatter : 'select'
		},
		{name:'REGISTRANT',index:'REGISTRANT',width:'15%',align:'left'},
		{name:'RECORDTIME',index:'RECORDTIME',width:'15%',align:'left',
			formatter : function(cellvalue, options, obj) {
				return getFormatDateByLong(obj.RECORDTIME,
					"yyyy-MM-dd hh:mm:ss");
		}}
	];
	
	var tableHeight = $(window).height() - $('.pcheck').height() - 190;
	$(window).on('resize.jqGrid', function () {
		$("#grid-table").jqGrid( 'setGridHeight', $(window).height() - $('.pcheck').height() - 190 );
		$("#grid-table").jqGrid( 'setGridWidth', $(window).width()*0.99 );
    })

    $("#grid-table").jqGrid({
    	height: tableHeight,
    	url : BASE_URL + "/hiddendanger/hdientinspection/list",
		datatype: "json",
		cache : false,
		mtype : 'post',
		colNames:colname,
		colModel:colmodel,
		postData:{
			businessinfoid:$("#businessinfoid").val(),
			industrytype:$("#industrytype").val(),
			nowyear:$("#nowyear").val(),
			quarter:$("#quarter").val(),
			reportstatus:$("#reportstatus").val()
		},
		sortname : 'RECORDTIME',
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
		caption: "企业自查登记",
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
	
	if($(window).width() < 700) {
		$('.showBtn').css({"display":"none"});
		var len = $('.dropdown-menu li').length;
		for(var i = 0; i < len; i++) {
			$('.smallShow li button')[i].onclick = function () {
    				var html = $(this).html();
    				$('.clickBtn').html(html);
    			};
    		}
	}else {
		$('#btnli').css({"display":"none"});
		$("#btnli").empty();
		$('#btnli').remove();
	}
	/*搜索查询*/
	$("#searchBtn").bind("click",function(){
		reloadGrid();
	});
	
	/*重置*/
	$("#resetBtn").bind("click",function(){
		$("#nowyear").val("");
		$("#quarter").val("");
		$("#reportstatus").val("");
	});
	
	/*添加*/
	$("#addBtn").on("click", function () {
		var businessinfoid = $("#businessinfoid").val();
		parent.openWin(BASE_URL+"/hiddendanger/hdientinspection/add/"+businessinfoid,'添加','55%','30%');
	});
	
	/*编辑*/
	$("#editBtn").on("click", function () {
		var ids = $("#grid-table").jqGrid('getGridParam','selarrrow');
		if(ids.length !=1){
			// 弹出提示信息
			parent.toast("请选择一条记录！");
			return;
		}
		var rowdata = $("#grid-table").jqGrid('getRowData',ids[0]); //选中的一条记录
		if(rowdata.REPORTSTATUS == '1'){
			// 弹出提示信息
			parent.toast("当前数据已上报！");
			return;
		}
		var rowdata = $("#grid-table").jqGrid('getRowData',ids[0]); //选中的一条记录
		var inspectionid = rowdata.INSPECTIONID;
		parent.openWin(BASE_URL+'/hiddendanger/hdientinspection/edit/'+inspectionid,'编辑','55%','30%');
	});
	
	/*上报*/
	$("#upBtn").on("click", function () {
		//返回当前grid中复选框所选择的数据的id 
		var ids = $("#grid-table").jqGrid('getGridParam','selarrrow');
		if(ids.length==0){
			// 弹出提示信息
			parent.toast("请选择需要上报的数据！");
			return;
		}
		var inspectionids=[];
		for(var i=0;i<ids.length;i++){
			var id = ids[i]; 
			//返回指定id行的数据 
			var rowdatas = $("#grid-table").jqGrid('getRowData',id);
			if(rowdatas.REPORTSTATUS == '1'){
				// 弹出提示信息
				parent.toast("当前数据已上报！");
				return;
			}
			
			/*var countnum =  rowdatas.COUNTNUM;//已自查项数
			var countinfo = rowdatas.COUNTINFO;//需要自查项数
			if(countnum != countinfo){
				// 弹出提示信息
				parent.toast("有未排查的检查项，请全部排查完后再上报！");
				return;
			}*/
			inspectionids[i]= rowdatas.INSPECTIONID;
		}
		
		var parmJson = inspectionids.toString();
		var businessinfoid = $("#businessinfoid").val();
		var param = {"ids":parmJson};
		upreport(param);
	});
	
	/*自查*/
	$("#checkBtn").on("click", function () {
		//返回当前grid中复选框所选择的数据的id 
		var ids = $("#grid-table").jqGrid('getGridParam','selarrrow');
		if(ids.length !=1){
			// 弹出提示信息
			parent.toast("请选择一条记录！");
			return;
		}
		var rowdata = $("#grid-table").jqGrid('getRowData',ids[0]); //选中的一条记录
		if(rowdata.REPORTSTATUS == '1'){
			// 弹出提示信息
			parent.toast("当前数据已上报！");
			return;
		}
		var inspectionid = rowdata.INSPECTIONID;
		var businessinfoid = $("#businessinfoid").val();
		parent.openWin(BASE_URL+'/hiddendanger/hdientregistra/checkpage/'+inspectionid+'/'+businessinfoid,'自查自报','90%','90%');
		
	});
	
	/*上报方法*/
	function upreport(param){
	    //弹出提示框
		parent.confirm('确认上报吗?',function(){
			$.ajax({ 
		  		url: BASE_URL+"/hiddendanger/hdientinspection/upreport",
		  		type:'post',
		  		dataType:'json',
		  		data:param,
		  		success: function(json){
		  			if(json.success==true){
		  				parent.toast(json.msg);
		  				reloadGrid();//刷新列表
		  			}else{
		  				parent.toast(json.msg);
		  			}
		  		}
			 });
		})
	} 
	
	/*批量删除*/
	$("#delBtn").on("click", function () {
		//返回当前grid中复选框所选择的数据的id 
		var ids = $("#grid-table").jqGrid('getGridParam','selarrrow');
		if(ids.length==0){
			// 弹出提示信息
			parent.toast("请选择需要删除的数据！");
			return;
		}
	
		var inspectionids=[];
		for(var i=0;i<ids.length;i++){
			var id = ids[i]; 
			//返回指定id行的数据 
			var rowdatas = $("#grid-table").jqGrid('getRowData',id);
			inspectionids[i]= rowdatas.INSPECTIONID;
		}
		var parmJson = inspectionids.toString();
		var businessinfoid = $("#businessinfoid").val();
		var param = {"ids":parmJson,"businessinfoid":businessinfoid};
		del(param);
	});
	
	/*删除方法*/
	function del(param){
		$.ajax({ 
		  		url: BASE_URL+"/hiddendanger/hdientinspection/loadLinkById",
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
		  				  		url: BASE_URL+"/hiddendanger/hdientinspection/delete",
		  				  		type:'post',
		  				  		dataType:'json',
		  				  		data:param,
		  				  		success: function(json){
		  				  			if(json.success==true){
		  				  				parent.toast(json.msg);
		  				  				reloadGrid();//刷新列表
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
	
	
});

/*加载*/
function reloadGrid(){
	$("#grid-table").jqGrid('setGridParam',{
		page:1,postData:{
			businessinfoid:$("#businessinfoid").val(),
			nowyear:$("#nowyear").val(),
			quarter:$("#quarter").val(),
			reportstatus:$("#reportstatus").val()
		}
	}).trigger("reloadGrid");
}

/**
 * 企业自查项列表
 * @param businessinfoid
 * @param entname
 */
function displayCheckList(businessinfoid,entname,inspectionid){
	var year = $("#nowyear").val();
	var quarter = $("#quarter").val();
	parent.openWin(BASE_URL+"/hiddendanger/hdigovchecklist/displayCheckList?businessinfoid="+businessinfoid+"&year="+year+"&quarter="+quarter+"&inspectionid="+inspectionid,entname+' 自查列表','70%','60%');
}

/**
 * 企业隐患列表
 * @param businessinfoid
 * @param entname
 */
function displayDangerList(businessinfoid,entname,inspectionid){
	var year = $("#nowyear").val();
	var quarter = $("#quarter").val();
	parent.openWin(BASE_URL+"/hiddendanger/hdigovchecklist/displayDangerList?businessinfoid="+businessinfoid+"&year="+year+"&quarter="+quarter+"&inspectionid="+inspectionid,entname+' 隐患列表','70%','60%');
}

/**
 * 企业已整改隐患列表
 * @param businessinfoid
 * @param entname
 */
function displayNoDangerList(businessinfoid,entname,inspectionid){
	var year = $("#nowyear").val();
	var quarter = $("#quarter").val();
	parent.openWin(BASE_URL+"/hiddendanger/hdigovchecklist/displayDangerList?businessinfoid="+businessinfoid+"&year="+year+"&quarter="+quarter+"&yesabarbeitung=1&inspectionid="+inspectionid,entname+' 已整改隐患列表','70%','60%');
}