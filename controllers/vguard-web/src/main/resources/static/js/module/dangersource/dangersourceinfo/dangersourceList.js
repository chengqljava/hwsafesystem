$(document).ready(function() {
//	SelectOption.loadDangerSourceState("state");//状态
//	SelectOption.loadisDangSou("isDangSou");//是否重大危险源
//	SelectOption.loaddangSouLevel("dangSouLevel");//重大危险源级别
	initSeachInput();
	var colname = ['危险源ID','备案ID','重大危险源名称','危化品物质','单元内危险化物设计存量','R值','级别val','级别','填表日期','是否构成重大危险源','备案编号','状态code','状态',"操作"]; 
	var colmodel = [
		{name:'DANGERID',index:'DANGERID', width:'5%',hidden: true},
		{name:'APPLYID',index:'APPLYID', width:'5%',hidden: true},
		{name:'DANGERNAME',index:'DANGERNAME',width:'15%',align:'left',
			formatter:function(cellvalue, options, obj) { 
				return '<a href="javascript:void(0);" onclick="display(\''+obj.DANGERID+'\')">'+obj.DANGERNAME+'</a>';
			}
		},
		{name:'CHEMCATALNAME',index:'CHEMCATALNAME',width:'20%',align:'left',
			formatter:function(cellvalue, options, obj) { 
				if(null != obj.CHEMCATALNAME)
					return '<a href="javascript:void(0);" onclick="display_chem(\''+obj.DANGERID+'\')">'+obj.CHEMCATALNAME.replace(/@/g,"<br/>")+'</a>';
				return "";
			}
		},
		{name:'UNITNUM',index:'UNITNUM',width:'15%',align:'left',
			formatter:function(cellvalue, options, obj) { 
				if(null != obj.UNITNUM)
					return obj.UNITNUM.replace(/@/g,"<br/>");
				return "";
			}
		},
		{name:'RVAL',index:'RVAL',width:'8%',align:'center'},
		{name:'DANGERLEVEL',index:'DANGERLEVEL',width:'8%',align:'center',hidden:true},
		{name:'DANGERLEVEL_TEXT',index:'DANGERLEVEL_TEXT',width:'8%',align:'center',
			formatter:function(cellvalue, options, obj) { 
				if(obj.DANGERLEVEL>0){
					return SelectOption.getdangSouLevel(obj.DANGERLEVEL);
				}
				return "";
			}
		},
		{name:'INPUTTIME',index:'INPUTTIME',width:'10%',align:'center',
			formatter:function(cellvalue, options, obj) { 
				return getSmpFormatDateByLong(obj.INPUTTIME,false);
			}
		},
		{name:'DANGERLEVEL_TEXT',index:'DANGERLEVEL_TEXT',width:'12%',align:'center',
			formatter:function(cellvalue, options, obj) { 
				if(null!=obj.DANGERLEVEL && obj.DANGERLEVEL !=undefined && obj.DANGERLEVEL>0){
					return "<img src='"+BASE_URL+"/images/tree/yes.png' title='是' alt='是'/>";
				}
				return "<img src='"+BASE_URL+"/images/tree/no.png' title='否' alt='否'/>";
			}
		},
		{name:'CASEAPPLYCODE',index:'CASEAPPLYCODE',width:'16%',hidden: true,align:'left'},
		{name:'STATE',index:'state',width:'10%',align:'left',hidden: true},
		{name:'state_text',index:'state_text',width:'8%',align:'center',hidden: true,
			formatter:function(cellvalue, options, obj) {
				//状态1.已登记2.已上报 3同意受理4不同意受理5同意备案6不同意备案7 核销申请 8核销受理9核销受理驳回
				//10已核销11核销审核驳回
				if(obj.STATE == "04" || obj.STATE == "06" || obj.STATE=="09" || obj.STATE=="11"){
					
//					return "<span style='color:red'>"+SelectOption.getDangerSourceState(obj.STATE)+"</span>";
					return '<a href="javascript:void(0);" style="color:red" onclick="disAudInfo(\''+obj.DANGERID+'\', \''+obj.STATE+'\')">'+SelectOption.getDangerSourceState(obj.STATE)+'</a>';
				}else if(obj.STATE == "03" || obj.STATE == "05" || obj.STATE == "08" || obj.STATE =="10"){
//					return "<span style='color:blue'>"+SelectOption.getDangerSourceState(obj.STATE)+"</span>";
					return '<a href="javascript:void(0);" style="color:blue" onclick="disAudInfo(\''+obj.DANGERID+'\', \''+obj.STATE+'\')">'+SelectOption.getDangerSourceState(obj.STATE)+'</a>';
				}else{
					return SelectOption.getDangerSourceState(obj.STATE);
				}
			}
		},
		{name:'OPERATION',index:"OPERATION",width:'80px',fixed:true,align:"left",formatter:function(cellvalue, options, obj){
			return '<a href="javascript:void(0);" title="编辑" class="operation editInfoBtn" onclick="editInfo(\''+obj.STATE+'\',\''+obj.DANGERID+'\')">编辑</a><br>'
			     + '<a href="javascript:void(0);" title="删除" class="operation delInfoBtn" onclick="delInfo(\''+obj.STATE+'\',\''+obj.DANGERID+'\')">删除</a><br>'
			     + '<a href="javascript:void(0);" title="辨识" class="operation addInfoBtn" onclick="handelInfo(\''+obj.STATE+'\',\''+obj.DANGERID+'\')">辨识</a>'
		}}
	];
	
    var tableHeight = $(window).height() - $('.pcheck').height() - 190 -33;
	$(window).resize(function(){
		$("#grid-table").jqGrid( 'setGridHeight', $(window).height() - $('.pcheck').height() - 190 -33 );
		$("#grid-table").jqGrid( 'setGridWidth', $(window).width() - 96 );
	});

    $("#grid-table").jqGrid({
    	height: tableHeight,
    	url : BASE_URL + "/dangersource/dssdangerinfo/list",
		datatype: "json",
		cache : false,
		mtype : 'post',
		colNames:colname,
		colModel:colmodel,
		postData:{
			dangSouName:$("#dangSouName").val(),
			state:$("#state").val(),
			isDangSou:$("#isDangSou").val(),
			dangSouLevel:$("#dangSouLevel").val(),
			businessinfoid:$("#businessinfoid").val()
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
		//autowidth: true,
		loadComplete: function() {
			if($(window).width() < 700) {
				$('.ui-jqgrid-htable').css({"width":"900"});
				$("#grid-table").css({"width":"900" });
				$("#grid-table").closest(".ui-jqgrid-bdiv").css({ "overflow-x" : "scroll"});
				$(".ui-jqgrid-hdiv").css({ "overflow-x" : "scroll"});
			} else {
				$("#grid-table").jqGrid( 'setGridWidth', $(window).width() - 96 );
			}
		}
	});
});

/*加载*/
function reloadGrid(){
	var state = $("#state").val();
	if (state == '已登记') {
		state = '01';
	}else if(state == '已上报'){
		state = '02';
	}else if(state == '同意受理'){
		state = '03';
	}else if(state == '不同意受理'){
		state = '04';
	}else if(state == '已备案'){
		state = '05';
	}else if(state == '不同意备案'){
		state = '06';
	}else if(state == '核销申请'){
		state = '07';
	}else if(state == '核销受理'){
		state = '08';
	}else if(state == '核销受理驳回'){
		state = '09';
	}else if(state == '已核销'){
		state = '10';
	}else if(state == '核销审核驳回'){
		state = '11';
	}
	var isDangSou = $("#isDangSou").val();
	if (isDangSou == '是') {
		isDangSou = '1';
	}else if(isDangSou == '否'){
		isDangSou = '0';
	}
	var dangSouLevel = $("#dangSouLevel").val();
	if (dangSouLevel == '一级') {
		dangSouLevel='1';
	}else if(dangSouLevel == '二级'){
		dangSouLevel='2';
	}else if(dangSouLevel == '三级'){
		dangSouLevel='3';
	}else if(dangSouLevel == '四级'){
		dangSouLevel='4';
	}
	
	$("#grid-table").jqGrid('setGridParam',{
		page:1,postData:{
			dangSouName:$("#dangSouName").val(),
			state:state,
			isDangSou:isDangSou,
			dangSouLevel:dangSouLevel,
			businessinfoid:$("#businessinfoid").val()
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
	});
});

function editInfo(state,dangerid) {
	if(isUpdate(state)){
		parent.openWin(BASE_URL+'/dangersource/dssdangerinfo/edit/'+dangerid,'编辑','75%','75%');
	}else{
		// 弹出提示信息
		parent.toast("不可修改");
		return;
	}
}

function handelInfo(state,dangerids) {
	if(!isUpdate(state)){
		parent.toast("辨识成功");//因为已经上报的数据数据不会变化，所以没有必要进行辨识 直接提示成功
	}else{
		var param = {"ids":dangerids};
		discern(param);
	}
}

function delInfo(state,dangerids) {
	if(state != 1){
		parent.toast("只能删除未上报的数据");
		return;
	}
	var param = {"ids":dangerids};
	del(param);
}

/*详细查询*/
function display(dangerid){
	parent.openWin(BASE_URL+"/dangersource/dssdangerinfo/pageTab/"+dangerid,'详细','75%','75%');
}
/**
 * 查询危险化学品列表
 * @param dangerid
 */
function display_chem(dangerid){
	parent.openWin(BASE_URL+"/dangersource/dsschemicalsinfo/chemicalList/"+dangerid,'详细','80%','60%');
}




/**
 * 判断是否可以修改和辨识
 * @author lzqiang
 * @date 2016年7月7日 下午4:49:16
 */
function isUpdate(state){
	if(state == "01" || state == "04" || state =="06"){//可以修改的状态
		return true;
	}else{
		return false;
	}
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
/**
 * 获取多条记录id
 * @param message
 * @returns
 * @author lzqiang
 * @date 2016年7月7日 下午4:45:13
 */
function getManyIds(message){
	var ids = $("#grid-table").jqGrid('getGridParam','selarrrow');
	if(ids.length==0){
		// 弹出提示信息
		parent.toast(message);
		return;
	}
	return ids;
}
/**
 * 上报到政府部门
 * @param param
 * @author lzqiang
 * @date 2016年7月7日 下午5:14:27
 */
function sendApproval(param){
	//弹出提示框
	$.ajax({ 
  		url: BASE_URL+"/dangersource/dssdangerinfo/sendApproval",
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
}

/**
 * 重大危险源辨识方法（自动辨识）
 * @param param
 * @author lzqiang
 * @date 2016年7月6日 上午9:13:07
 */
function discern(param){
	//弹出提示框
	$.ajax({ 
  		url: BASE_URL+"/dangersource/dssdangerinfo/discern",
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
}

/*删除方法*/
function del(param){
	    //弹出提示框
		parent.confirm('将删除重大危险源相关所有信息,确认删除吗?',function(){
			$.ajax({ 
		  		url: BASE_URL+"/dangersource/dssdangerinfo/delete",
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

function disAudInfo(dangerid, state){
//	parent.openWin(BASE_URL+"/dangersource/dssCaseaudit/pageTab/"+dangerid,'审核信息','65%','75%');
	var businesstype;
	if(state == 3 || state == 4)
		businesstype = 1;
	else if (state == 5 || state == 6)
		businesstype = 2;
	else if (state == 8 || state == 9)
		businesstype = 3;
	else if (state == 10 || state == 11)
		businesstype = 4;
	
	parent.openWin(BASE_URL+"/dangersource/dssCaseaudit/display/" + dangerid + "?businesstype=" + businesstype,'审核信息','65%','75%');
}
