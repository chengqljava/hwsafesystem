$(document).ready(function() {
	
	if($(window).width() < 700) {
		$('.divClick').css({"display":"block"});
		$('.div_left').css({"display":"none"});
		$('.upDown').css({"display":"none"});
		$('.div_right').css({"margin-left":"0","width":"100%"});
	}else {
		$('.divClick').css({"display":"none"});
		$('.div_left').css({"display":"block"});
		$('.upDown').css({"display":"block"});
	}
	
	/**
	 * 加载安全信息树
	 */
	SelectTree.loadDocmenuTree("lawdocmenu", {"taskid":$("#taskid").val()},null,
	function(treeNode){
		if(treeNode.tId){
			if (treeNode.url != "undefined" && treeNode.url != null){
				$('#menuname').html(treeNode.name); //菜单名称
				var checkinfoid = $('#checkinfoid').val();
				var nodeurl = treeNode.url;
				var doccode = treeNode.doccode;
				var tid = treeNode.tId;
				var menupagetype = $('#menupagetype').val();
				$("li #"+tid+"_a").attr("target","contentIframe");
				$("li #"+tid+"_a").attr("href","javascript:void(0)");
				var url = BASE_URL+ nodeurl +"?id="+checkinfoid+"&menupagetype="+menupagetype; //进入列表页面
				if(treeNode.tablename != "law_checkinfo"){
					if(doccode=="WSSDHZ"){
						url = BASE_URL+ nodeurl +"/"+menupagetype+"/"+checkinfoid+"/"+doccode+"/"+taskDocCodes; //进入列表页面
					}else{
						url = BASE_URL+ nodeurl +"/"+menupagetype+"/"+checkinfoid+"/"+doccode; //进入列表页面
					}
				}
				$("#contentIframe").attr("src",url);
				return false;
			}
		}
	});
	
	// 已完成任务文书
    $("#aFloatTools_Show").click(function(){
        $('#divFloatToolsView').animate({width:'show',opacity:'show'},100,function(){$('#divFloatToolsView').show();});
        $('#aFloatTools_Show').hide();
        $('#aFloatTools_Hide').show();
    });
    $("#aFloatTools_Hide").click(function(){
        $('#divFloatToolsView').animate({width:'hide', opacity:'hide'},100,function(){$('#divFloatToolsView').hide();});
        $('#aFloatTools_Show').show();
        $('#aFloatTools_Hide').hide();
    });
	
	
	
	
	var flag = 1;
	$('.upDown').click(function() {
		if (flag == 1) {
			$('.div_left').hide();
			$('.div_right').css({'margin-left':'0px','width':'100%'});
			$(this).css('left','0.5%');
			$('.upDown').addClass('downUp');
			flag=0;	
		}else{
			$('.div_left').show();
			$('.div_right').css({'margin-left':'19.6%','width':'80.4%'});
			$(this).css('left','16%');
			$('.upDown').removeClass('downUp');
			flag=1;	
		}
	});
	//$('#menuname').html("执法检查信息");
	//左侧文书列表树
	loadDocmenutree();
	
	//右侧历史任务文书树
	loadTaskDocTree();
});

//该步任务所有文书code
var taskDocCodes = "";

/**
 * 加载安全信息树
 */
function loadDocmenutree(){
	var setting = {
			data : {
				simpleData : {
					enable : true
				}
			},
			callback: {
				onClick: treeClick
			}
	};	
	var param = {"taskid":$("#taskid").val()};
	$.ajax({
		type :'post',
		url : BASE_URL+'/law/lawmydoc/docmenutree',
		cache : false,
		data: param,
		dataType : 'json',
		global : false,
		async : false,
		success : function(map) {
			var tree_map = initTreeMap(map);
			$.fn.zTree.init($("#docmenu"), setting, tree_map);
		},
		error : function() {
			parent.parent.toast("网络异常");
		}
	});
	
	//树图标的初始化
	function initTreeMap(map) {
		var t_map = new Array();
		//遍历子节点
		if (map != null && map.length > 0) {
			var open = false;
			for ( var i = 0; i < map.length; i++) {
				//该步任务所有文书code
				if(map[i].doccode){
					taskDocCodes += map[i].doccode + ",";
				}
				var icon = BASE_URL+"/images/tree/d_icon_tree1.png";
				var url = map[i].url;	
				t_map.push(new Node(map[i].id, map[i].pId, map[i].name,
						open,icon,url,map[i].tablename,map[i].doccode));
			}
			if(taskDocCodes!="" && taskDocCodes.indexOf(",")!=-1){
				taskDocCodes = taskDocCodes.substring(0,taskDocCodes.lastIndexOf(","));
			}
		} else {
			t_map = null;
		}
		return t_map;
	}
	
	//树节点对象
	function Node(id, pId, name, open, icon, docurl, tablename, doccode) {
		this.id = id;
		this.pId = pId;
		this.name = name;
		this.open = open;
		this.icon = icon;
		this.docurl = docurl; 
		this.tablename = tablename;
		this.doccode = doccode;
	}
}


/**点击权限树节点*/
function treeClick(event,treeId, treeNode, clickFlag){
	//var law_checkinfoid = $('#checkinfoid').val(); //基础信息(必填)
	//var law_checkrecord = $('#checkrecordid').val(); //现场检查记录
	//var tid = treeNode.id;
	//$("li #"+tid+" a").attr("target","contentIframe");
	//$("li #"+tid+" a").attr("href","javascript:void(0)");
	//if(treeNode.id == -1 || treeNode.pId == '-1'){
	//	return false;
	//}
	/**
	if(treeNode.tablename != "law_checkinfo"){
		if(!law_checkinfoid){ 
			//必须先填写执法检查信息，才能填写下面的菜单栏
			parent.parent.toast("请先填写执法检查信息");
			return false;
		}
		if(treeNode.tablename != "law_checkrecord"){
			if(!law_checkrecord){ 
				//必须先填写现场检查记录息，才能填写下面的菜单栏
				parent.parent.toast("请先填写现场检查记录");
				return false;
			}
		}
	}
	*/
	if (treeNode.docurl != "undefined" && treeNode.docurl != null){
		$('#menuname').html(treeNode.name); //菜单名称
		var checkinfoid = $('#checkinfoid').val();
		var nodeurl = treeNode.docurl;
		var doccode = treeNode.doccode;
		var menupagetype = $('#menupagetype').val();
		
		var url = BASE_URL+ nodeurl +"?id="+checkinfoid+"&menupagetype="+menupagetype; //进入列表页面
		if(treeNode.tablename != "law_checkinfo"){
			if(doccode=="WSSDHZ"){
				url = BASE_URL+ nodeurl +"/"+menupagetype+"/"+checkinfoid+"/"+doccode+"/"+taskDocCodes; //进入列表页面
			}else{
				url = BASE_URL+ nodeurl +"/"+menupagetype+"/"+checkinfoid+"/"+doccode; //进入列表页面
			}
		}
		$("#contentIframe").attr("src",url);
		return false;
	}
}



/**
 * 右侧历史任务文书树
 */
function loadTaskDocTree(){
	var setting = {
			data : {
				simpleData : {
					enable : true
				}
			},
			callback: {
				onClick: taskDocTreeClick
			}
	};	
	var param = {"taskid":$("#taskid").val()};
	$.ajax({
		type :'post',
		url : BASE_URL+'/law/lawmydoc/taskdoctree',
		cache : false,
		data: param,
		dataType : 'json',
		global : false,
		async : false,
		success : function(map) {
			var tree_map = initTreeMap(map);
			$.fn.zTree.init($("#taskdoctree"), setting, tree_map);
		},
		error : function() {
			parent.parent.toast("网络异常");
		}
	});
	
	//树图标的初始化
	function initTreeMap(map) {
		var t_map = new Array();
		//遍历子节点
		if (map != null && map.length > 0) {
			var open = false;
			for ( var i = 0; i < map.length; i++) {
				var icon = BASE_URL+"/images/tree/d_icon_tree1.png";
				var url = map[i].url;
				if(map[i].pId!='-1'){
					icon = BASE_URL+"/images/tree/d_icon_tree2.png";
				}	
				t_map.push(new Node(map[i].id, map[i].pId, map[i].name,
						open,icon,url,map[i].tablename,map[i].doccode));
			}
		} else {
			t_map = null;
		}
		return t_map;
	}
	
	//树节点对象
	function Node(id, pId, name, open, icon, docurl, tablename, doccode) {
		this.id = id;
		this.pId = pId;
		this.name = name;
		this.open = open;
		this.icon = icon;
		this.docurl = docurl; 
		this.tablename = tablename;
		this.doccode = doccode;
	}
}

/**点击右侧历史任务文书树*/
function taskDocTreeClick(event,treeId, treeNode, clickFlag){
	
	if (treeNode.docurl != "undefined" && treeNode.docurl != null){
		
		$('#menuname').html(treeNode.name); //菜单名称
		var checkinfoid = $('#checkinfoid').val();
		var nodeurl = treeNode.docurl;
		var doccode = treeNode.doccode;
		var menupagetype = 'menuDisplay';
		
		var url = BASE_URL+ nodeurl +"?id="+checkinfoid+"&menupagetype="+menupagetype; //进入列表页面
		if(treeNode.tablename != "law_checkinfo"){
			if(doccode=="WSSDHZ"){
				/**
				// 该历史任务对应的文书codes
				var hTaskDocCodes = "";
				var pNode = treeNode.getParentNode();
				var cNodes = pNode.children;
				if(cNodes.length>0){
					for(var i=0;i<cNodes.length;i++){
						var cNode = cNodes[i];
						hTaskDocCodes += cNode.doccode + ",";
					}
				}
				if(hTaskDocCodes!=""){
					hTaskDocCodes = hTaskDocCodes.substring(0,hTaskDocCodes.lastIndexOf(","));
				}
				
				url = BASE_URL+ nodeurl +"/"+menupagetype+"/"+checkinfoid+"/"+doccode+"/"+hTaskDocCodes; //进入列表页面
				*/
				url = BASE_URL+ nodeurl +"/"+menupagetype+"/"+checkinfoid+"/"+doccode; //进入列表页面
			}else{
				url = BASE_URL+ nodeurl +"/"+menupagetype+"/"+checkinfoid+"/"+doccode; //进入列表页面
			}
		}
		$("#contentIframe").attr("src",url);
		return false;
	}
}
