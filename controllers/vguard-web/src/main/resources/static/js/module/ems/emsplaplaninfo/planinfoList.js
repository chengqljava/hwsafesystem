$(document).ready(function() {
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
		//$('.showBtn').show({"display":"block"});
		//$('.smallShow').css({"display":"none"});
		$('#btnli').css({"display":"none"});
		$("#btnli").empty();
		$('#btnli').remove();
	}
	 //下拉树
//	SelectTree.loadSelfDistrictSelect("districtname");
//	SelectOption.loadEmsPlanType("plantype");
//	SelectOption.loadEmsPlanState("planstate");
	
	var colname = ['预案id','预案编号','预案名称','编制单位','所属区域','预案类型','发布时间','预案状态']; 
	var colmodel = [
		{name:'PLANID',index:'PLANID', width:'5%',hidden: true},
		{name:'PLANNO',index:'PLANNO',width:'10%',align:'left'},
		{name:'PLANNAME',index:'PLANNAME',width:'20%',align:'left',
			formatter:function(cellvalue, options, obj) { 
				return '<a href="javascript:void(0);" onclick="display(\''+obj.PLANID+'\')">'+obj.PLANNAME+'</a>';
			}
		},
		{name:'UNITNAME',index:'UNITNAME',width:'10%',align:'left'},
		{name:'DISTRICTNAME',index:'DISTRICTNAME',width:'10%',align:'left'},
		{name:'PLANTYPE',index:'PLANTYPE',width:'10%',align:'center',
			formatter:function(cellvalue, options, obj) { 
				if(obj.PLANTYPE){
					return SelectOption.getEmsPlanType(obj.PLANTYPE);
				}else{
					return '';
				}
			}
		},
		{name:'RELEASETIME',index:'RELEASETIME',width:'10%',align:'center',
			formatter:function(cellvalue, options, obj) { 
				if(obj.RELEASETIME){
					return getSmpFormatDateByLong(obj.RELEASETIME, false);
				}else{
					return '';
				}
			}
		},
		{name:'PLANSTATE',index:'PLANSTATE',width:'10%',align:'center',hidden: true,
			formatter:function(cellvalue, options, obj) { 
				if(obj.PLANSTATE){
					if(obj.PLANSTATE=='3'||obj.PLANSTATE=='4'){
						return '<a href="javascript:void(0);" onclick="displayAudits(\''+obj.PLANID+'\')">'+SelectOption.getEmsPlanState(obj.PLANSTATE)+'</a>';
					}else{
						return SelectOption.getEmsPlanState(obj.PLANSTATE);
					}
				}else{
					return '';
				}
			}
		}
	];

	var tableHeight = $(window).height() - $('.pcheck').height() - 190;
	$(window).resize(function(){
		$("#grid-table").jqGrid( 'setGridHeight', $(window).height() - $('.pcheck').height() - 190 );
		$("#grid-table").jqGrid( 'setGridWidth', $(window).width()*0.99 );
	});
		
    $("#grid-table").jqGrid({
    	height: tableHeight,
    	url : BASE_URL + "/ems/emsplaplaninfo/planInfoList",
		datatype: "json",
		cache : false,
		mtype : 'post',
		colNames:colname,
		colModel:colmodel,
		postData:{
			planname:$("#planname").val(),
//			plantype:$("#plantype").val(),
			planstate:$("#planstate").val(),
			planType:$("#planType").val(),
			unitclass:$("#unitclass").val(),
			begintime:$("#begintime").val(),
			endtime:$("#endtime").val()
//			districtid:$("#districtname_select").val()
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
		caption: "应急预案",
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
	/*搜索查询*/
	$("#searchbtn").bind("click",function(){
		reloadGrid();
	});
	
	/*重置*/
	$("#resetbtn").bind("click",function(){
		$("#planname").val();
//		$("#plantype").val();
		$("#planstate").val();
//		$("#districtname_select").val();
	});
	
	/*添加*/
	$("#addBtn").on("click", function () {
		parent.openWin(BASE_URL+"/ems/emsplaplaninfo/add",'添加','70%','80%');
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
		var planid = rowdata.PLANID;
		
		parent.openWin(BASE_URL+'/ems/emsplaplaninfo/labelpage/menuEdit/'+planid,'预案编辑','70%','80%');
	});
	
	/*上报*/
	$("#reportBtn").on("click", function () {
		var ids = $("#grid-table").jqGrid('getGridParam','selarrrow');
		if(ids.length !=1){
			// 弹出提示信息
			parent.toast("请选择一条记录！");
			return;
		}
		var rowdata = $("#grid-table").jqGrid('getRowData',ids[0]); //选中的一条记录
		var planstate = rowdata.PLANSTATE;
		if(planstate=='1'||planstate=='登记'){
			var planid = rowdata.PLANID;
			var param = {"id":planid};
	
				 $.ajax({ 
					 	url: BASE_URL+"/ems/emsplaplaninfo/report",
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
		}else{
			parent.toast("预案已上报，请不要重复上报！");
		}
	});
	
	
	/*批量删除*/
	$("#delBtn").on("click", function () {
		//返回当前grid中复选框所选择的数据的id 
		var ids = $("#grid-table").jqGrid('getGridParam','selarrrow');
		if(ids.length==0){
			// 弹出提示信息
			parent.toast("请选择需要删除的数据！");
			return;
		}
	
		var planids=[];
		for(var i=0;i<ids.length;i++){
			var id = ids[i]; 
			//返回指定id行的数据 
			var rowdatas = $("#grid-table").jqGrid('getRowData',id);
			planids[i]= rowdatas.PLANID;
		}
		var parmJson = planids.toString();
		var param = {"ids":parmJson};
		del(param);
	});
	
	/*审核*/
	$("#auditBtn").on("click", function () {
		var ids = $("#grid-table").jqGrid('getGridParam','selarrrow');
		if(ids.length !=1){
			// 弹出提示信息
			parent.toast("请选择一条记录！");
			return;
		}
		var rowdata = $("#grid-table").jqGrid('getRowData',ids[0]); //选中的一条记录
		var planstate = rowdata.PLANSTATE;
		if(planstate=='1'||planstate=='登记'){
			parent.toast("预案未上报，不能审核！");
		}else{
			var planid = rowdata.PLANID;
			parent.openWin(BASE_URL+'/ems/emsplaplanaudit/toAudit/'+planid,'预案审核','60%','50%');
		}
		
	});
	/*删除方法*/
	function del(param){
		//查询是否有关联引用	
		$.ajax({ 
		  		url: BASE_URL+"/ems/emsplaplaninfo/loadLinkById",
		  		type:'post',
		  		dataType:'json',
		  		data:param,
		  		success: function(json){
		  			if(json.success==false){
		  				//有关联引用
		  				parent.toast(json.msg);
		  			}else{
		  				//弹出提示框
		  				parent.confirm("确认删除吗?", function() { 
		  					 $.ajax({ 
		  						 	url: BASE_URL+"/ems/emsplaplaninfo/delete",
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
		  			    });
		  		  }
			  }
		});
	}
});

/*加载行政区域*/
function searchDistrict(districtid){
//	$("#districtname_select").val(districtid);
	reloadGrid();
}

/*加载*/
function reloadGrid(){
	$("#grid-table").jqGrid('setGridParam',{
		page:1,postData:{
			planname:$("#planname").val(),
//			plantype:$("#plantype").val(),
			planstate:$("#planstate").val(),
			planType:$("#planType").val(),
			unitclass:$("#unitclass").val(),
			begintime:$("#begintime").val(),
			endtime:$("#endtime").val()
//			districtid:$("#districtname_select").val()
			}
	}).trigger("reloadGrid");
}

/*预案审核列表*/
function displayAudits(planid){
	parent.openWin(BASE_URL+'/ems/emsplaplanaudit/index/'+planid,'预案审核列表','60%','50%');
}

/*详细查询*/
function display(planid){
	parent.openWin(BASE_URL+'/ems/emsplaplaninfo/labelpage/menuDisplay/'+planid,'预案信息','75%','80%');
}

