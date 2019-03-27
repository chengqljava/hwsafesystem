var writtype = $("#writtype").val();
$(document).ready(function() {
	
	if($("#doctype").val() == "null"){
		$("#checkendBtn").hide();//检查提交按钮隐藏
	}
	if(($("#doctype").val() == "1" || $("#doctype").val() == "2" || $("#doctype").val() == "1,2")&&$("#menupagetype").val()=="menuDisplay"){
		$("#checkendBtn").hide();//检查提交按钮隐藏
	}
	
	/**
	 * 加载安全信息树
	 */
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
	
	SelectTree.loadLawDocInfoSelect("lawinfomenu", {"doctype":$('#doctype').val()}, null,
	function(treeNode){
		if(treeNode.tId){
			var law_checkinfoid = $('#checkinfoid').val(); //基础信息(必填)
			var law_checkrecord = $('#checkrecordid').val(); //现场检查记录
			var tid = treeNode.tId;
			$("li #"+tid+" a").attr("target","contentIframe");
			$("li #"+tid+" a").attr("href","javascript:void(0)");
			if(treeNode.id == -1){
				return false;
			}
			if(treeNode.tablename != "law_checkinfo"){
				if(!law_checkinfoid){ 
					//必须先填写执法检查信息，才能填写下面的菜单栏
					parent.parent.toast("请先填写执法登记信息");
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
			
			$('#menuname').html(treeNode.name); //菜单名称
			var checkinfoid = $('#checkinfoid').val();
			var nodeurl = "";
			var doccode = "";
			var menupagetype = $('#menupagetype').val();
			//添加任务id
			var taskid = $('#taskid').val();
			if (treeNode.url != "undefined" && treeNode.url != null){
				nodeurl =  treeNode.url;
				doccode =  treeNode.doccode;
				var url = BASE_URL+ nodeurl +"?id="+checkinfoid+"&menupagetype="+menupagetype+"&taskid="+taskid+"&taskstate="+taskstate; //进入列表页面
				if(treeNode.tablename != "law_checkinfo")
					url = BASE_URL+ nodeurl +"/"+menupagetype+"/"+checkinfoid+"/"+doccode; //进入列表页面
				$("#contentIframe").attr("src",url);
			}
			
		}
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
	$('#menuname').html("执法检查信息");
	loadLawmenutree();
	setTimeout("initClick("+writtype+")",500);
	
	
	
});
/**
 * 初始化加载点击审批文书事件
 * @param writtype
 */
function initClick(writtype){
	if(writtype!=null&&writtype!="null"&&writtype!=""){
		if(writtype == "01"){
			$("#lawdocinfomenu").find("a").each(function(){
				if($(this).attr("title").indexOf("《立案审批表》")!=-1){
					$(this).trigger("click");
					return false;
				}
			});
		}
		else if(writtype == "02"){
			$("#lawdocinfomenu").find("a").each(function(){
				if($(this).attr("title").indexOf("案件处理呈批表")!=-1){
					$(this).trigger("click");
					return false;
				}
			});
		}else if(writtype == "03"){
			$("#lawdocinfomenu").find("a").each(function(){
				if($(this).attr("title").indexOf("案件移送审批表")!=-1){
					$(this).trigger("click");
					return false;
				}
			});
		}else if(writtype == "04"){
			$("#lawdocinfomenu").find("a").each(function(){
				if($(this).attr("title").indexOf("结案审批表")!=-1){
					$(this).trigger("click");
					return false;
				}
			});
		}else if(writtype == "05"){
			$("#lawdocinfomenu").find("a").each(function(){
				if($(this).attr("title").indexOf("延期（分期）缴纳罚款审批表")!=-1){
					$(this).trigger("click");
					return false;
				}
			});
		}
	}
	
}

/**
 * 加载安全信息树
 */
function loadLawmenutree(){
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
	$.ajax({
		type :'post',
		url : BASE_URL+'/law/lawdocinfo/lawmenutree',
		cache : false,
		dataType : 'json',
		data : {
			"doctype" : $("#doctype").val()
		},
		global : false,
		async : false,
		success : function(map) {
			var tree_map = initTreeMap(map);
			$.fn.zTree.init($("#lawdocinfomenu"), setting, tree_map);
		},
		error : function() {
			parent.parent.toast("网络异常");
		}
	});
	
	//树图标的初始化
	function initTreeMap(map) {
		var t_map = new Array();
		console.log("------------"+map);
		//遍历子节点
		if (map != null && map.length > 0) {
			var open = false;
			for ( var i = 0; i < map.length; i++) {
				open = false;
				var icon = "";
				var url = map[i].url;
				var tablename = "";
				if(map[i].pId == null || map[i].pId == ""){
					//根节点
					icon = BASE_URL+"/images/tree/d_icon_tree1.png";
				}
				//检查和复查
				if($("#doctype").val() == "1" || $("#doctype").val() == "2"){
					open = true;
				}
				var nodename = map[i].name;
				var leaf = map[i].isleaf;
				if(nodename == "二、立案查处"){
					open = true;
				}
				
				//打开待办文书定位
				if(writtype!=null&&writtype!="null"&&writtype!=""){
					if(writtype == "01"){
						if(nodename=="(一)立案"){
							open = true;
						}
					}else if(writtype == "02"){
						if(nodename=="(六)行政处罚决定"){
							open = true;
						}
					}else if(writtype == "03"){
						if(nodename=="(三)审理"){
							open = true;
						}
					}else if(writtype == "04"){
						if(nodename=="(八)结案"){
							open = true;
						}
					}else if(writtype == "05"){
						if(nodename=="(七)执行"){
							open = true;
						}
					}
				}
				
				if(map[i].isleaf == "1"){
					nodename = "("+map[i].ordernum+")"+map[i].name
				}
				
				t_map.push(new Node(map[i].id, map[i].pId, nodename,
						open,icon,url,map[i].tablename,map[i].doccode));
			}
		} else {
			t_map = null;
		}
		return t_map;
	}
	
	//树节点对象
	function Node(id, pId, name, open, icon, url, tablename, doccode) {
		this.id = id;
		this.pId = pId;
		this.name = name;
		this.open = open;
		this.icon = icon;
		this.url = url; 
		this.tablename = tablename;
		this.doccode = doccode;
	}
}


/**点击权限树节点*/
function treeClick(event,treeId, treeNode, clickFlag){
	var law_checkinfoid = $('#checkinfoid').val(); //基础信息(必填)
	var law_checkrecord = $('#checkrecordid').val(); //现场检查记录
	var tid = treeNode.tId;
	$("li #"+tid+" a").attr("target","contentIframe");
	$("li #"+tid+" a").attr("href","javascript:void(0)");
	if(treeNode.id == -1){
		return false;
	}
	if(treeNode.tablename != "law_checkinfo"){
		if(!law_checkinfoid){ 
			//必须先填写执法检查信息，才能填写下面的菜单栏
			parent.parent.toast("请先填写执法登记信息");
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
	
	$('#menuname').html(treeNode.name); //菜单名称
	var checkinfoid = $('#checkinfoid').val();
	var checkrecordid = $('#checkrecordid').val();
	var nodeurl = "";
	var doccode = "";
	var menupagetype = $('#menupagetype').val();
	var d = $("#doctype").val();
	//案件列表中现场检查类不可编辑
	if($("#doctype").val() == "null"){
		//文书送达回执目前只能查看，修改为可编辑 2017-06-2 QYS
		if(treeNode.pId == "2" ){
//		if(treeNode.pId == "2" || treeNode.pId == "62"){
			menupagetype = "menuDisplay";
		}
	}
	//添加任务id
	var taskid = $('#taskid').val();
	var checktype = $('#checktype').val();
	if (checktype == null || checktype == undefined || checktype == "") {
		checktype = "null";
	}
	if (treeNode.url != "undefined" && treeNode.url != null){
		nodeurl =  treeNode.url;
		doccode =  treeNode.doccode;
		var url = BASE_URL+ nodeurl +"?id="+checkinfoid+"&menupagetype="+menupagetype+"&taskid="+taskid+"&taskstate="+taskstate; //进入列表页面
		if(treeNode.tablename != "law_checkinfo")
			url = BASE_URL+ nodeurl +"/"+menupagetype+"/"+checkinfoid+"/"+doccode; //进入列表页面
		if(treeNode.tablename == "law_materialsubmit"||treeNode.tablename == "law_deadline"
			||treeNode.tablename == "law_inquirynotice"||treeNode.tablename == "law_checkrecord"){
			if(treeNode.tablename == "law_materialsubmit"){
				url = BASE_URL+ nodeurl +"/"+menupagetype+"/"+checkinfoid+"/"+checkrecordid+"/"+doccode+"/"+checktype; //进入列表页面
			}else if(treeNode.tablename == "law_deadline"){
				url = BASE_URL+ nodeurl +"/"+menupagetype+"/"+checkinfoid+"/"+checkrecordid+"/"+doccode; //进入列表页面
			}
			else{
				url = BASE_URL+ nodeurl +"/"+menupagetype+"/"+checkinfoid+"/"+doccode+"/"+checktype; //进入列表页面
			}
		}
			
		$("#contentIframe").attr("src",url);
	}
}


/**
 * 文书上报
 * @param id 文书id
 */
function reportBtn(id){
	openWin(BASE_URL + '/law/lawdocinfo/report/' + id, '文书上报',null,"20%","30%");
}

/**
 * 文书提交(街镇提交)
 * @param id 文书id
 */
function submitBtn(id,checktype,doctype){
	openWin(BASE_URL + '/law/lawdocinfo/submit/' + id + '/'+checktype, '文书提交',null,"20%","30%");
}

/**
 * 检查提交
 */
$("#checkendBtn").on("click", function () {
	var checktype = $('#checktype').val(); //检查：0  复查：1
	var law_checkrecord = $('#checkrecordid').val(); //现场检查记录
	var law_review = $('#reviewid').val(); //复查意见书 
	if(!law_checkrecord){ 
		//必须先填写现场检查记录息
		parent.toast("请先填写现场检查记录");
		return false;
	}
	if(checktype == '1'){
		if(!law_review){ 
			//必须填写现场检查记录息
			parent.toast("请填写整改复查意见书");
			return false;
		}
	}
	var jobtype = $("#jobtype").val();
	if(jobtype!='4'){
		var param = {"checkinfoid":$('#checkinfoid').val(),"doctype":$("#doctype").val()};
		parent.confirm("确认检查完成，提交吗?", function() { 
			 $.ajax({ 
				 	url: BASE_URL+"/law/lawcheckinfo/updatecheckdocstate",
			  		type:'post',
			  		dataType:'json',
			  		data:param,
			  		success: function(json){
			  			if(json.success==true){
							parent.toast(json.msg);//弹出提示信息
							$("#checkendBtn").hide();
			  			}else{
			  				parent.toast(json.msg);
			  			}
			  		}
			 });
	    });
	}else{
		//提交给执法人员
		submitBtn($('#checkinfoid').val(),$('#checktype').val());
	}
});

/**
 * 完成检查任务
 */
$("#completeBtn").on("click", function () {
	//任务id    登记信息id
	var law_checkrecord = $('#checkrecordid').val(); //现场检查记录
	if(!law_checkrecord){ 
		//必须先填写现场检查记录息，才能填写下面的菜单栏
		parent.parent.toast("请先填写现场检查记录");
		return false;
	}
	var param = {
			"taskid":$("#taskid").val(),
			"checkinfoid":$("#checkinfoid").val(),
			"doctype":$("#doctype").val()};
	parent.confirm("确认提交当前任务吗?", function() { 
		 $.ajax({ 
			 	url: BASE_URL+"/law/lawcheckinfo/updateTaskFinishState",
		  		type:'post',
		  		dataType:'json',
		  		data:param,
		  		success: function(json){
		  			if(json.success==true){
						parent.toast(json.msg);//弹出提示信息
						//parent.$("#contentIframe").attr("src",BASE_URL+"/law/lawcheckrecord/"+$('#menupagetype').val()+"/"+$('#checkinfoid').val()+"/"+$('#doccode').val());
						$("#completeBtn").hide();
		  			}else{
		  				parent.toast(json.msg);
		  			}
		  		}
		 });
    });
});