$(document).ready(function() {
	//初始化下拉框
	SelectOption.loadPatrolReason("reason"); //巡查缘由
	loadPatrollerTree('1'); //加载巡查人员树
	//loadPatrollerTree('2'); //加载网格管理人员树
	//设置
	var myDate = new Date();
	$("#ringdate").val(CurentTime());
	
	//加载隐患信息列表
	if($("#inspectionid").val()){
		gridtable();
	}
	
	//巡查人员不能为空
	jQuery.validator.addMethod("ztreecheck1", function(value, element) {  
		var treeObj=$.fn.zTree.getZTreeObj("patrollertree1");
	    var nodes=treeObj.getCheckedNodes(true);
	    if(nodes.length > 0){
	    	return true;
	    }else{
	    	return false;
	    }
	    return true;    
	}, "巡查人员不能为空");
	
	//巡查负责人不能为空
/*	jQuery.validator.addMethod("ztreecheck2", function(value, element) {  
		var treeObj=$.fn.zTree.getZTreeObj("patrollertree2");
	    var nodes=treeObj.getCheckedNodes(true);
	    if(nodes.length > 0){
	    	return true;
	    }else{
	    	return false;
	    }
	    return true;    
	}, "巡查负责人不能为空");*/
	
	
	$("#hdigovinspectionform").validate({
		rules: {
			reason: {
				required: true
			},
			checkdate: {
				required: true
			},
			enteringdate: {
				required: true
			},
			entname: {
				required: true
			},
			patrolpers: {
				ztreecheck1: true
			}
			/*,
			patrolprin: {
				ztreecheck2: true
			}*/
		},
		messages: {
			reason: {
				required: "巡查缘由不能为空"
			},
			checkdate: {
				required: "巡查日期不能为空"
			},
			enteringdate: {
				required: "录入日期不能为空"
			},
			entname: {
				required: "巡查对象不能为空"
			}
		},
		submitHandler:function(form){
			$('#ipaddress').removeAttr("disabled"); 
			save();
	    }   
	});
});

function gridtable(){
	var colname = ['检查内容','隐患基本情况','检查结果']; 
	var colmodel = [
		{name:'CHECKCONTENT',index:'CHECKCONTENT', width:'45%'},
		{name:'REINFO',index:'REINFO', width:'45%'},
		{name:'RESTATE',index:'RESTATE',width:'10%',align:'center',
			formatter:function(cellvalue, options, obj) { 
				if(obj.RESTATE=='1'){
					return "<img src='"+BASE_URL+"/images/permitlight/lightred.gif' title='有隐患'/>";
				}else if(obj.RESTATE=='0'){
					return "<img src='"+BASE_URL+"/images/permitlight/lightgreen.gif' title='无隐患'/>";
				}else{
					return "";
				}
			}
		}
	];
	
	$(window).on('resize.jqGrid', function () {
		$("#grid-table").jqGrid( 'setGridWidth', $(window).width()*0.92);
    })
    $("#grid-table").jqGrid({
    	height: 250,
    	url : BASE_URL + "/hiddendanger/hdigovchecklist/checkgovlist",
		datatype: "json",
		cache : false,
		mtype : 'post',
		colNames:colname,
		colModel:colmodel,
		postData:{
			inspectionid:$("#inspectionid").val()
		},
		sortname : 'CHECKTIME',
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
		autowidth: true,
		loadComplete: function() {
			if($(window).width() < 700) {
				$('.ui-jqgrid-htable').css({"width":"900"});
				$("#grid-table").css({"width":"900" });
				$("#grid-table").closest(".ui-jqgrid-bdiv").css({ "overflow-x" : "scroll"});
				$(".ui-jqgrid-hdiv").css({ "overflow-x" : "scroll"});
				$("#grid-table").jqGrid( 'setGridWidth', $(window).width()*0.99 );
			} else {
				$("#grid-table").jqGrid( 'setGridWidth', $(window).width()*0.92 );
			}
		}
	});
	
	
}

/**
 * 巡查指引
 */
function patrol(){
	if(!$('#entname').val()){
		parent.toast("请选择巡查对象");
		return;
	}
}

/**
 * 选择企业
 */
function selectent(){
	var inspectionid = $("#inspectionid").val();
	if(!inspectionid){
		//parent.openWin(BASE_URL + '/enterprise/entbusinessinfo/entlistpage/'+orgid, '企业信息',"60%","70%");
		window.location = BASE_URL + "/enterprise/entbusinessinfo/entlistpage?inspectionid="+inspectionid;
	}
}


/**保存*/
function save(){
	/*********z-Tree取值****************************/
	var treeObj1=$.fn.zTree.getZTreeObj("patrollertree1");
    var nodes1=treeObj1.getCheckedNodes(true);
	var patrolpers = '';
	for(var i=0; i<nodes1.length; i++){
 		if (patrolpers != ''){ 
 			patrolpers += ',';
 		}
 		patrolpers += nodes1[i].id;
 	}
	$('#patrolpers').val(patrolpers);
	
	/*var treeObj2=$.fn.zTree.getZTreeObj("patrollertree2");
    var nodes2=treeObj2.getCheckedNodes(true);
	var patrolprin = '';
	for(var i=0; i<nodes2.length; i++){
 		if (patrolprin != ''){ 
 			patrolprin += ',';
 		}
 		patrolprin += nodes2[i].id;
 	}
	$('#patrolprin').val(patrolprin);*/
 	/***********************************/
	
	$.ajax({
		type : 'post',
		url : BASE_URL+'/hiddendanger/hdigovinspection/save',
		cache : false,
		dataType : 'json',
		data : $("#hdigovinspectionform").serializeArray(),
		global : false,
		success : function(json) {
			if(json.success==true){
				parent.toast(json.msg);//弹出提示信息
				parent.getActiveIFrame().reloadGrid();//刷新列表
				parent.closeWin();// 关闭弹出框
			}else{
				parent.toast(json.msg);
			}
		},
		error : function() {
			parent.toast("保存失败");
		}
	});
}

function CurentTime()
{ 
    var now = new Date();
    var year = now.getFullYear();       //年
    var month = now.getMonth() + 1;     //月
    var day = now.getDate();            //日
    var hh = now.getHours();            //时
    var mm = now.getMinutes();          //分
    var ss = now.getSeconds();           //秒
    var clock = year + "-";
    if(month < 10)
        clock += "0";
    clock += month + "-";
    if(day < 10)
        clock += "0";
    clock += day + "";
    
    /*if(hh < 10)
        clock += "0";
    clock += hh + ":";
    if (mm < 10) clock += '0'; 
    clock += mm + ":"; 
    if (ss < 10) clock += '0'; 
    clock += ss; */
    return(clock); 
}

/********************巡查人员树*********************/
function loadPatrollerTree(patrollertype){
	var setting = {
		data : {
			simpleData : {
				enable : true
			}
		},
		check: {
	        enable: true,
	        chkStyle: "checkbox"
		},
		view: {
			showIcon: false
		},
		callback : {
			onClick : treeClick,
			onCheck : treeCheck
		}
	};	

	$.ajax({
		type :'post',
		url : BASE_URL+'/hiddendanger/hdipatroller/patrolTree', 
		cache : false,
		dataType : 'json',
		data : {
			"inspectionid" : $("#inspectionid").val()
		},
		global : false,
		async : false,
		success : function(map) {
			var tree_map = initTreeMap(map);
			var zTree;
			if(patrollertype == '1'){
				$.fn.zTree.init($("#patrollertree1"), setting, tree_map);
				zTree = $.fn.zTree.getZTreeObj("patrollertree1");
			}
			/*if(patrollertype == '2'){
				$.fn.zTree.init($("#patrollertree2"), setting, tree_map);
				zTree = $.fn.zTree.getZTreeObj("patrollertree2");
			}*/
			 
			var nodes = zTree.getNodes();
			for (var i=0;i < nodes.length; i++) {
				zTree.setChkDisabled(nodes[i],true);//禁用根节点
			}
		},
		error : function() {
			console.log("网络异常");
		}
	});
	
	//树图标的初始化
	function initTreeMap(map) {
		var t_map = new Array();
		//遍历子节点
		var icon="";
		if(patrollertype == '1'){
			t_map.push(new Node("-1", "", "巡查人员", true, icon, false));
		}
		if(patrollertype == '2'){
			t_map.push(new Node("-1", "", "巡查负责人", true, icon, false));
		}
		if (map != null && map.length > 0) {
			for ( var i = 0; i < map.length; i++) {
				t_map.push(new Node(map[i].id, map[i].pId, map[i].name, false, icon, map[i].checked));
				if(map[i].checked == "true"){
					if(patrollertype == '1'){
						$("#patrolpers").val(map[i].id);
					}
					if(patrollertype == '2'){
						$("#patrolprin").val(map[i].id);
					}
				}
			}
		} else {
			t_map = null;
		}
		JSON.stringify(t_map);
		return t_map;
	}
	
	//树节点对象
	function Node(id, pId, name, open, icon, checked) {
		this.id = id;
		this.pId = pId;
		this.name = name;
		this.open = open;
		this.icon = icon;
		this.checked = checked;
	}
	
	/** 点击树节点 */
	function treeClick(event, treeId, treeNode, clickFlag) {
		var id = treeNode.id;
		if(patrollertype == '1'){
			$("#patrolpers").val(id);
			//去除 验证的错误信息
			var treeObj=$.fn.zTree.getZTreeObj("patrollertree1");
		    var nodes=treeObj.getCheckedNodes(true);
		    if(nodes.length > 0){
		    	$("#patrolpers").attr("class","valid");
		    	$("#patrolpers-error").css("display","none");
		    }
		}
		/*if(patrollertype == '2'){
			$("#patrolprin").val(id);
			//去除 验证的错误信息
			var treeObj=$.fn.zTree.getZTreeObj("patrollertree2");
		    var nodes=treeObj.getCheckedNodes(true);
		    if(nodes.length > 0){
		    	$("#patrolprin").attr("class","valid");
		    	$("#patrolprin-error").css("display","none");
		    }
		}*/
		
	}
	/**勾选权限树节点*/
	function treeCheck(event, treeId, treeNode, clickFlag){
		treeClick(event, treeId, treeNode, clickFlag);
	}
}

