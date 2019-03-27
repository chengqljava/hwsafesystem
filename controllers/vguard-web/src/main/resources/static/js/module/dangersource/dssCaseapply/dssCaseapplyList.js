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
		$('#btnli').css({"display":"none"});
		$("#btnli").empty();
		$('#btnli').remove();
	}
	
	initSeachInput();
//	SelectOption.loadDangerType("dangerType");//重大危险源类别
	
	var colname = ['危险源id','备案申请ID','危险源备案状态','企业名称','重大危险源名称','重大危险源类型','重大危险源级别','备案编号','危险源备案状态']; 
	var colmodel = [
	    {name : 'DANGERID',index:'DANGERID', width:'1%',hidden: true},
		{name:'APPLYID',index:'APPLYID', width:'5%',hidden: true},
		{name : 'STATE', index : 'STATE', width : '5%', hidden : true},
		{name:'ENTNAME',index:'ENTNAME',width:'15%',align:'left',
			formatter:function(cellvalue, options, obj) { 
				   return '<a href="javascript:void(0);" onclick="companydisplay(\''+obj.BUSINESSINFOID+'\',\''+obj.ENTNAME+'\')">'+obj.ENTNAME+'</a>';
			}
		},
		{name:'DANGERNAME',index:'DANGERNAME',width:'15%',align:'left',
			formatter:function(cellvalue, options, obj) { 
				return '<a href="javascript:void(0);" onclick="display(\''+obj.DANGERID+'\')">'+obj.DANGERNAME+'</a>';
			}
		},
		{name:'DANGERTYPE',index:'DANGERTYPE',width:'15%',align:'left',
			formatter:function(cellvalue, options, obj) { 
				return SelectOption.getDangerType(obj.DANGERTYPE);
			}
		},
		{name:'DANGERLEVEL_TEXT',index:'DANGERLEVEL_TEXT',width:'8%',align:'center',
			formatter:function(cellvalue, options, obj) { 
				if(obj.DANGERLEVEL>0){
					return SelectOption.getdangSouLevel(obj.DANGERLEVEL);
				}
				return "";
			}
		},
		{name:'CASEAPPLYCODE',index:'CASEAPPLYCODE',width:'16%',align:'left'},
		{name:'state_text',index:'state_text',width:'10%',align:'center',
			formatter:function(cellvalue, options, obj) { 
//				return SelectOption.getDangerSourceState(obj.STATE);
				if("03040506".indexOf(obj.STATE) > -1)
					return '<a href="javascript:void(0);" onclick="disAudInfo(\''+obj.DANGERID+'\', \''+obj.STATE+'\')">'+SelectOption.getDangerSourceState(obj.STATE)+'</a>'
				else
					return SelectOption.getDangerSourceState(obj.STATE);
				
			}
		}
	];
	
	var tableHeight = $(window).height() - $('.pcheck').height() - 190 -33;
	$(window).resize(function(){
		$("#grid-table").jqGrid( 'setGridHeight', $(window).height() - $('.pcheck').height() - 190 -33 );
		$("#grid-table").jqGrid( 'setGridWidth', $(window).width()*0.99 );
	});
	
    $("#grid-table").jqGrid({
    	height: tableHeight,
    	url : BASE_URL + "/dangersource/dssCaseApply/getCaseApplyList",
		datatype: "json",
		cache : false,
		mtype : 'post',
		colNames:colname,
		colModel:colmodel,
		postData:{
			dangSouName:$("#dangSouName").val(),
			entname:$("#entname").val(),
			districtid:$("#districtid").val(),
			dangerType:$("#dangerType").val()
		},
		sortname : 'null',
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
		caption: "重大危险源备案管理列表",
		autowidth: true,
		loadComplete : function() {
			if($(window).width() < 700) {
				$('.ui-jqgrid-htable').css({"width":"900"});
				$("#grid-table").css({"width":"900" });
				$("#grid-table").closest(".ui-jqgrid-bdiv").css({ "overflow-x" : "scroll"});
				$(".ui-jqgrid-hdiv").css({ "overflow-x" : "scroll"});
			} else {
				$("#grid-table").jqGrid( 'setGridWidth', $(window).width()*0.99 );
			}
			//返回当前grid里所有数据的id 
			var cheids = $("#grid-table").jqGrid("getDataIDs");
			for(var i=0; i<cheids.length; i++){
				var id = cheids[i]; 
				//返回指定id行的数据 
				var rowdatas = $("#grid-table").jqGrid('getRowData',id);
				//返回所在行数据的主键
				var id = rowdatas!=null?rowdatas.APPLYID:"";
				
				/*
				//备案申请状态
				var state = rowdatas.STATE;
				
				var commandshtml;
				// 已上报状态
				if(state == '02') {
					commandshtml = 
						"<a href=javascript:void(0); onclick=operate('"+id+"','true','1') title=受理>受理</a>&nbsp" +
						"<a href=javascript:void(0); onclick=operate('"+id+"','false','1') title=不受理>不受理</a>";
				}
					
				// 同意受理状态
				else if(state == '03') {
					commandshtml = 
						"<a href=javascript:void(0); onclick=operate('"+id+"','true','2') title=同意备案>同意备案</a>&nbsp" +
						"<a href=javascript:void(0); onclick=operate('"+id+"','false','2') title=不同意备案>不同意备案</a>";
				}
						 
				//设置自定义按钮
				$("#grid-table").jqGrid('setRowData',cheids[i],{ commands: commandshtml}); 
				
				commandshtml = '';
				*/
			}
		}
	});
    
    /*受理审核btn*/
    $("#hanBtn").on("click", function(){
    	var ids = getSingleIds();
    	var rowdata = $("#grid-table").jqGrid('getRowData',ids[0]); //选中的一条记录
    	var applyid = rowdata.APPLYID;
    	var state = rowdata.STATE;
    	if(state != "02"){
    		// 弹出提示信息
    		parent.toast("只能处理已上报的信息");
    		return;
    	}
    	operate(applyid, true, "1");
    	
    });

    /*备案审核btn*/
    $("#auditBtn").on("click", function(){
    	var ids = getSingleIds();
    	var rowdata = $("#grid-table").jqGrid('getRowData',ids[0]); //选中的一条记录
    	var applyid = rowdata.APPLYID;
    	var state = rowdata.STATE;
    	if(state != "03"){
    		// 弹出提示信息
    		parent.toast("只能处理同意受理的信息");
    		return;
    	}
    	
    	operate(applyid, true, "2");
    });
    
});

/**
 * @param dangerId 备案申请危险源Id
 * @author lzqiang
 * @date 2016年7月6日 下午1:41:13
 */
function accept(dangerId){
	parent.openWin(BASE_URL+"/dangersource/dssdangerinfo/discernEdit/"+dangerId,'受理','60%','55%');
}

/**
 * 
 * @param operateUrl
 */
function operate(applyid, result, businesstype){
	
	parent.openWin(BASE_URL+"/dangersource/dssCaseaudit/add/" + applyid + "?audit=" + result + "&businesstype=" + businesstype, '审核页面','60%','50%');
}


/*加载行政区域*/
function searchDistrict(districtid){
	$("#districtid").val(districtid);
	reloadGrid();
}

/*加载*/
function reloadGrid(){
	var dangerType = $("#dangerType").val();
	if ('危险化学品类' == dangerType) {
		dangerType = '1';
	}else if('燃气类' == dangerType){
		dangerType = '2';
	}else if('港口类' == dangerType){
		dangerType = '3';
	}else{
		dangerType = '';
	}
	$("#grid-table").jqGrid('setGridParam',{
		page:1,postData:{
			dangSouName:$("#dangSouName").val(),
			entname:$("#entname").val(),
			districtid:$("#districtid").val(),
			dangerType:dangerType
		}
	}).trigger("reloadGrid");
}

/*搜索查询*/
$("#searchbtn").bind("click",function(){
	reloadGrid();
});

/*重置*/
$("#resetbtn").bind("click",function(){
	$("#searchForm").each(function(){
		$(this).val("");
	})
});





function display(dangerid){
	parent.openWin(BASE_URL+"/dangersource/dssdangerinfo/pageTab/"+dangerid,'详细','60%','75%');
}

/*详细查询*/
function companydisplay(businessinfoid,entname){
	// parent.openWin(BASE_URL+'/enterprise/entsafeinfomenu/safemenuDisplay/'+businessinfoid,entname,'80%','90%');
    parent.openWin(BASE_URL+"/views/module/enterprise/entbusinessinfo/displayEntbusinessinfo.html?businessinfoid="+businessinfoid,'详细','90%','90%');
}

/**
 * 值选择一条记录
 * @returns
 * @author lzqiang
 * @date 2016年7月7日 下午4:43:15
 */
function getSingleIds(){
	var ids = $("#grid-table").jqGrid('getGridParam','selarrrow');
	if(ids.length !=1){
		// 弹出提示信息
		parent.toast("请选择一条记录！");
		return;
	}
	return ids;
}

function disAudInfo(dangerid, state){
//	parent.openWin(BASE_URL+"/dangersource/dssCaseaudit/pageTab/"+dangerid,'审核信息','65%','75%');
	var businesstype;
	if(state == 3 || state == 4)
		businesstype = 1;
	else if (state == 5 || state == 6)
		businesstype = 2
	else if (state == 8 || state == 9)
		businesstype = 3
	else if (state == 10 || state == 11)
		businesstype = 4
	
	parent.openWin(BASE_URL+"/dangersource/dssCaseaudit/display/" + dangerid + "?businesstype=" + businesstype,'审核信息','65%','320px');
}