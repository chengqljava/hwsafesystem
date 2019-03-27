$(function(){
	var ent_baseinfo = $('#ent_baseinfo').val(); //基础信息(必填)
	var ent_safeorg = $('#ent_safeorg').val(); //安全生产管理机构(必填)
	var ent_dangerchara = $('#ent_dangerchara').val(); //危险特性(必填)
	var ent_safeperson = $('#ent_safeperson').val(); //安全生产责任人(必填)
	var ent_safemanager = $('#ent_safemanager').val(); // 安全生产管理人员(必填)
	
	var ent_operator = $('#ent_operator').val(); //特种作业人员
	var ent_equipoperator = $('#ent_equipoperator').val();  //特种设备作业人员
	var ent_permitphoto = $('#ent_permitphoto').val(); //许可证照
	var ent_saferiskinfo = $('#ent_saferiskinfo').val(); //安全风险较大作业信息	
	var ent_safeinvestinfo = $('#ent_safeinvestinfo').val(); //安全生产投入信息
	var ent_safestandard = $('#ent_safestandard').val(); //安全生产标准化建设信息
	var ent_safereward = $('#ent_safereward').val(); //安全生产获奖信息
	var ent_safepunish = $('#ent_safepunish').val();  //安全生产行政处罚信息
	var ent_safeprodata = $('#ent_safeprodata').val(); //安全生产管理资料
	var ent_danexclusive = $('#ent_danexclusive').val(); //危化品专属信息
	var ent_dangerequip = $('#ent_dangerequip').val(); //危险设备
	var ent_proharm = $('#ent_proharm').val(); //职业病危害信息
	var ent_plan = $('#ent_plan').val(); //企业平面图
	var ent_safemgrproj = $('#ent_safemgrproj').val(); //安全制度管理清单
	var ent_event = $("#ent_event").val();
	var ent_worker = $("#ent_worker").val();
	var ent_hid = $("#ent_hid").val();
	var ent_prevessel = $("#ent_prevessel").val();
	var ent_bolior = $("#ent_bolior").val();
	var ent_forkfilt = $("#ent_forkfilt").val();
	var ent_conduit = $("#ent_conduit").val();//压力管道
	var ent_safevalve = $("#ent_safevalve").val();//安全阀

	if(ent_baseinfo == "false"){
		$("#ent_baseinfo2").append("<img style='float:right;margin-right:28px;margin-top:10px;' src='"+BASE_URL+"/images/entmenu/weitian.png' title='此项未填写完毕'>")		
	}
	if(ent_safeorg == "false"){
		$("#ent_safeorg2").append("<img style='float:right;margin-right:28px;margin-top:10px;' src='"+BASE_URL+"/images/entmenu/weitian.png' title='此项未填写完毕'>")
	}
	if(ent_dangerchara == "false"){
		$("#ent_dangerchara2").append("<img style='float:right;margin-right:28px;margin-top:10px;' src='"+BASE_URL+"/images/entmenu/weitian.png' title='此项未填写完毕'>")
	}
	if(ent_safeperson == "false"){
		$("#ent_safeperson2").append("<img style='float:right;margin-right:28px;margin-top:10px;' src='"+BASE_URL+"/images/entmenu/weitian.png' title='此项未填写完毕'>")
	}
	if(ent_safemanager == "false"){
		$("#ent_safemanager2").append("<img style='float:right;margin-right:28px;margin-top:10px;' src='"+BASE_URL+"/images/entmenu/weitian.png' title='此项未填写完毕'>")
	}
	if(ent_operator == "false"){
		$("#ent_operator2").append("<img style='float:right;margin-right:28px;margin-top:10px;' src='"+BASE_URL+"/images/entmenu/weitian.png' title='此项未填写完毕'>")
	}
	if(ent_equipoperator == "false"){
		$("#ent_equipoperator2").append("<img style='float:right;margin-right:28px;margin-top:10px;' src='"+BASE_URL+"/images/entmenu/weitian.png' title='此项未填写完毕'>")
	}
	if(ent_permitphoto == "false"){
		$("#ent_permitphoto2").append("<img style='float:right;margin-right:28px;margin-top:10px;' src='"+BASE_URL+"/images/entmenu/weitian.png' title='此项未填写完毕'>")
	}
	if(ent_saferiskinfo == "false"){
		$("#ent_saferiskinfo2").append("<img style='float:right;margin-right:28px;margin-top:10px;' src='"+BASE_URL+"/images/entmenu/weitian.png' title='此项未填写完毕'>")
	}
	if(ent_safeinvestinfo == "false"){
		$("#ent_safeinvestinfo2").append("<img style='float:right;margin-right:28px;margin-top:10px;' src='"+BASE_URL+"/images/entmenu/weitian.png' title='此项未填写完毕'>")
	}
	if(ent_safestandard == "false"){
		$("#ent_safestandard2").append("<img style='float:right;margin-right:28px;margin-top:10px;' src='"+BASE_URL+"/images/entmenu/weitian.png' title='此项未填写完毕'>")
	}
	if(ent_safereward == "false"){
		$("#ent_safereward2").append("<img style='float:right;margin-right:28px;margin-top:10px;' src='"+BASE_URL+"/images/entmenu/weitian.png' title='此项未填写完毕'>")
	}
	if(ent_safepunish == "false"){
		$("#ent_safepunish2").append("<img style='float:right;margin-right:28px;margin-top:10px;' src='"+BASE_URL+"/images/entmenu/weitian.png' title='此项未填写完毕'>")
	}
	if(ent_safeprodata == "false"){
		$("#ent_safeprodata2").append("<img style='float:right;margin-right:28px;margin-top:10px;' src='"+BASE_URL+"/images/entmenu/weitian.png' title='此项未填写完毕'>")
	}
	if(ent_danexclusive == "false"){
		$("#ent_danexclusive2").append("<img style='float:right;margin-right:28px;margin-top:10px;' src='"+BASE_URL+"/images/entmenu/weitian.png' title='此项未填写完毕'>")
	}
	if(ent_dangerequip == "false"){
		$("#ent_dangerequip2").append("<img style='float:right;margin-right:28px;margin-top:10px;' src='"+BASE_URL+"/images/entmenu/weitian.png' title='此项未填写完毕'>")
	}
	if(ent_proharm == "false"){
		$("#ent_proharm2").append("<img style='float:right;margin-right:28px;margin-top:10px;' src='"+BASE_URL+"/images/entmenu/weitian.png' title='此项未填写完毕'>")
	}
	if(ent_plan == "false"){
		$("#ent_plan2").append("<img style='float:right;margin-right:28px;margin-top:10px;' src='"+BASE_URL+"/images/entmenu/weitian.png' title='此项未填写完毕'>")
	}
	if(ent_safemgrproj == "false"){
		$("#ent_safemgrproj2").append("<img style='float:right;margin-right:28px;margin-top:10px;' src='"+BASE_URL+"/images/entmenu/weitian.png' title='此项未填写完毕'>")
	}
	if(ent_event == "false"){
		$("#ent_event2").append("<img style='float:right;margin-right:28px;margin-top:10px;' src='"+BASE_URL+"/images/entmenu/weitian.png' title='此项未填写完毕'>")
	}
	if(ent_worker == "false"){
		$("#ent_worker2").append("<img style='float:right;margin-right:28px;margin-top:10px;' src='"+BASE_URL+"/images/entmenu/weitian.png' title='此项未填写完毕'>")
	}
	if(ent_hid == "false"){
		$("#ent_hid2").append("<img style='float:right;margin-right:28px;margin-top:10px;' src='"+BASE_URL+"/images/entmenu/weitian.png' title='此项未填写完毕'>")
	}
	if(ent_prevessel == "false"){
		$("#ent_prevessel2").append("<img style='float:right;margin-right:28px;margin-top:10px;' src='"+BASE_URL+"/images/entmenu/weitian.png' title='此项未填写完毕'>")
	}
	if(ent_bolior == "false"){
		$("#ent_bolior2").append("<img style='float:right;margin-right:28px;margin-top:10px;' src='"+BASE_URL+"/images/entmenu/weitian.png' title='此项未填写完毕'>")
	}
	if(ent_forkfilt == "false"){
		$("#ent_forkfilt2").append("<img style='float:right;margin-right:28px;margin-top:10px;' src='"+BASE_URL+"/images/entmenu/weitian.png' title='此项未填写完毕'>")
	}
	if(ent_conduit == "false"){
		$("#ent_conduit2").append("<img style='float:right;margin-right:28px;margin-top:10px;' src='"+BASE_URL+"/images/entmenu/weitian.png' title='此项未填写完毕'>")
	}
	if(ent_safevalve == "false"){
		$("#ent_safevalve2").append("<img style='float:right;margin-right:28px;margin-top:10px;' src='"+BASE_URL+"/images/entmenu/weitian.png' title='此项未填写完毕'>")
	}
})

//$(document).ready(function() {
//	/**
//	 * 加载安全信息树
//	 */
//	if($(window).width() < 700) {
//		$('.divClick').css({"display":"block"});
//		$('.div_left').css({"display":"none"});
//		$('.upDown').css({"display":"none"});
//		$('.div_right').css({"margin-left":"0","width":"100%"});
//	}else {
//		$('.divClick').css({"display":"none"});
//		$('.div_left').css({"display":"block"});
//		$('.upDown').css({"display":"block"});
//	}
//	SelectTree.loadBaseInfoSelect("entinfomenu", {"businessinfoid":$('#businessinfoid').val()},null,
//	function(treeNode){
//		if(treeNode.tId){
//			var ent_baseinfo = $('#ent_baseinfo').val(); //基础信息(必填)
//			var tid = treeNode.tId;
//			$("li #"+tid+" a").attr("target","contentIframe");
//			$("li #"+tid+" a").attr("href","javascript:void(0)");
//			
//			if(treeNode.id == -1){
//				return false;
//			}
//			
//			$('#menuname').html(treeNode.name); //菜单名称
//			var businessinfoid = $('#businessinfoid').val();
//			var status = $("#status").val();
//			var nodeurl = "";
//			if (treeNode.url != "undefined" && treeNode.url != null)
//				nodeurl =  treeNode.url;
//			var url = BASE_URL+ nodeurl +"/menuDisplay/"+businessinfoid; //进入编辑页面
//			if(treeNode.tablename == "ent_danexclusive")
//				url = BASE_URL+ nodeurl +"/menuDisplay/"+businessinfoid+"/entinfo"; //从企业基础信息进行危化品专属信息
//			$("#contentIframe").attr("src",url);
//		}
//	});
//	var flag = 1;
//	$('.upDown').click(function() {
//		if (flag == 1) {
//			$('.div_left').hide();
//			$('.div_right').css({'margin-left':'0px','width':'100%'});
//			$(this).css('left','0.5%');
//			$('.upDown').addClass('downUp');
//			flag=0;	
//		}else{
//			$('.div_left').show();
//			$('.div_right').css({'margin-left':'19.6%','width':'80.4%'});
//			$(this).css('left','16%');
//			$('.upDown').removeClass('downUp');
//			flag=1;	
//		}
//	});
//	
////	$('#menuname').html("企业信息(必填)");
//	$('#menuname').html("企业简介");
//	loadSafemenutree();
//});
//
//function loadSafemenutree(){
//	var setting = {
//			data : {
//				simpleData : {
//					enable : true
//				}
//			},
//			callback: {
//				onClick: treeClick
//			}
//	};	
//	var paramJson = $('#businessinfoid').val();
//	var param = {"businessinfoid":paramJson};
//	$.ajax({
//		type :'post',
//		url : BASE_URL+'/enterprise/entsafeinfomenu/safemenutree',
//		cache : false,
//		data: param,
//		dataType : 'json',
//		global : false,
//		async : false,
//		success : function(map) {
//			var tree_map = initTreeMap(map);
//			$.fn.zTree.init($("#safeinfomenu"), setting, tree_map);
//		},
//		error : function() {
//			alert("网络异常");
//		}
//	});
//	
	//树图标的初始化
//	function initTreeMap(map) {
//		var ent_baseinfo = $('#ent_baseinfo').val(); //基础信息(必填)
//		var ent_safeorg = $('#ent_safeorg').val(); //安全生产管理机构(必填)
//		var ent_dangerchara = $('#ent_dangerchara').val(); //危险特性(必填)
//		var ent_safeperson = $('#ent_safeperson').val(); //安全生产责任人(必填)
//		var ent_safemanager = $('#ent_safemanager').val(); // 安全生产管理人员(必填)
//		
//		var ent_operator = $('#ent_operator').val(); //特种作业人员
//		var ent_equipoperator = $('#ent_equipoperator').val();  //特种设备作业人员
//		var ent_permitphoto = $('#ent_permitphoto').val(); //许可证照
//		var ent_saferiskinfo = $('#ent_saferiskinfo').val(); //安全风险较大作业信息
//		var ent_safeinvestinfo = $('#ent_safeinvestinfo').val(); //安全生产投入信息
//		var ent_safestandard = $('#ent_safestandard').val(); //安全生产标准化建设信息
//		var ent_safereward = $('#ent_safereward').val(); //安全生产获奖信息
//		var ent_safepunish = $('#ent_safepunish').val();  //安全生产行政处罚信息
//		var ent_safeprodata = $('#ent_safeprodata').val(); //安全生产管理资料
//		var ent_danexclusive = $('#ent_danexclusive').val(); //危化品专属信息
//		var ent_dangerequip = $('#ent_dangerequip').val(); //危险设备
//		var ent_proharm = $('#ent_proharm').val(); //职业病危害信息
//		var ent_plan = $('#ent_plan').val(); //企业平面图
//		var ent_safemgrproj = $('#ent_safemgrproj').val(); //安全制度管理清单
//		
//		var t_map = new Array();
//		//遍历子节点
//		if (map != null && map.length > 0) {
//			var open = false;
//			for ( var i = 0; i < map.length; i++) {
//				var icon = "";
//				var url = map[i].url;
//				var tablename = "";
//				if(map[i].pId == null || map[i].pId == ""){
//					//根节点
//					icon = BASE_URL+"/images/tree/d_icon_tree1.png";
//					open = true;
//				}else{
//					//业务表名称
//					tablename = map[i].tablename;
//					if(map[i].tablename == "ent_baseinfo"){
//						if(ent_baseinfo == "true"){
//							icon= BASE_URL+"/images/tree/yes.png";
//						}else{
//							icon= BASE_URL+"/images/tree/no.png";
//						}
//					}else if(map[i].tablename == "ent_safeorg"){
//						if(ent_safeorg == "true"){
//							icon= BASE_URL+"/images/tree/yes.png";
//						}else{
//							icon= BASE_URL+"/images/tree/no.png";
//						}
//					}else if(map[i].tablename == "ent_dangerchara"){
//						if(ent_dangerchara == "true"){
//							icon= BASE_URL+"/images/tree/yes.png";
//						}else{
//							icon= BASE_URL+"/images/tree/no.png";
//						}
//					}else if(map[i].tablename == "ent_safeperson"){
//						if(ent_safeperson == "true"){
//							icon= BASE_URL+"/images/tree/yes.png";
//						}else{
//							icon= BASE_URL+"/images/tree/no.png";
//						}
//					}else if(map[i].tablename == "ent_safemanager"){
//						if(ent_safemanager == "true"){
//							icon= BASE_URL+"/images/tree/yes.png";
//						}else{
//							icon= BASE_URL+"/images/tree/no.png";
//						}
//					}else if(map[i].tablename == "ent_operator"){
//						if(ent_operator == "true"){
//							icon= BASE_URL+"/images/tree/yes.png";
//						}else{
//							icon= BASE_URL+"/images/tree/no.png";
//						}
//					}else if(map[i].tablename == "ent_equipoperator"){
//						if(ent_equipoperator == "true"){
//							icon= BASE_URL+"/images/tree/yes.png";
//						}else{
//							icon= BASE_URL+"/images/tree/no.png";
//						}
//					}else if(map[i].tablename == "ent_permitphoto"){
//						if(ent_permitphoto == "true"){
//							icon= BASE_URL+"/images/tree/yes.png";
//						}else{
//							icon= BASE_URL+"/images/tree/no.png";
//						}
//					}else if(map[i].tablename == "ent_saferiskinfo"){
//						if(ent_saferiskinfo == "true"){
//							icon= BASE_URL+"/images/tree/yes.png";
//						}else{
//							icon= BASE_URL+"/images/tree/no.png";
//						}
//					}else if(map[i].tablename == "ent_safeinvestinfo"){
//						if(ent_safeinvestinfo == "true"){
//							icon= BASE_URL+"/images/tree/yes.png";
//						}else{
//							icon= BASE_URL+"/images/tree/no.png";
//						}
//					}else if(map[i].tablename == "ent_safestandard"){
//						if(ent_safestandard == "true"){
//							icon= BASE_URL+"/images/tree/yes.png";
//						}else{
//							icon= BASE_URL+"/images/tree/no.png";
//						}
//					}else if(map[i].tablename == "ent_safereward"){
//						if(ent_safereward == "true"){
//							icon= BASE_URL+"/images/tree/yes.png";
//						}else{
//							icon= BASE_URL+"/images/tree/no.png";
//						}
//					}else if(map[i].tablename == "ent_safepunish"){
//						if(ent_safepunish == "true"){
//							icon= BASE_URL+"/images/tree/yes.png";
//						}else{
//							icon= BASE_URL+"/images/tree/no.png";
//						}
//					}else if(map[i].tablename == "ent_safeprodata"){
//						if(ent_safeprodata == "true"){
//							icon= BASE_URL+"/images/tree/yes.png";
//						}else{
//							icon= BASE_URL+"/images/tree/no.png";
//						}
//					}else if(map[i].tablename == "ent_danexclusive"){
//						if(ent_danexclusive == "true"){
//							icon= BASE_URL+"/images/tree/yes.png";
//						}else{
//							icon= BASE_URL+"/images/tree/no.png";
//						}
//					}else if(map[i].tablename == "ent_dangerequip"){
//						if(ent_dangerequip == "true"){
//							icon= BASE_URL+"/images/tree/yes.png";
//						}else{
//							icon= BASE_URL+"/images/tree/no.png";
//						}
//					}else if(map[i].tablename == "ent_proharm"){
//						if(ent_proharm == "true"){
//							icon= BASE_URL+"/images/tree/yes.png";
//						}else{
//							icon= BASE_URL+"/images/tree/no.png";
//						}
//					}else if(map[i].tablename == "ent_plan"){
//						if(ent_plan == "true"){
//							icon= BASE_URL+"/images/tree/yes.png";
//						}else{
//							icon= BASE_URL+"/images/tree/no.png";
//						}
//					}else if(map[i].tablename == "ent_safemgrproj"){
//						if(ent_safemgrproj == "true"){
//							icon= BASE_URL+"/images/tree/yes.png";
//						}else{
//							icon= BASE_URL+"/images/tree/no.png";
//						}
//					}else if(map[i].tablename == "introduction"){//如果没有对应的表名，则默认为必填
//						icon= BASE_URL+"/images/tree/yes.png";
//					}else if(map[i].tablename == ""||map[i].tablename == null){//如果没有对应的表名，则默认为必填
//						open = true;
//						icon= BASE_URL+"/images/tree/no.png";
//					}
////					open = false;
//				}	
//				t_map.push(new Node(map[i].id, map[i].pId, map[i].name,
//						open,icon,url,tablename));
//			}
//		} else {
//			t_map = null;
//		}
//		return t_map;
//	}
//	
//	//树节点对象
//	function Node(id, pId, name, open, icon, url,tablename) {
//		this.id = id;
//		this.pId = pId;
//		this.name = name;
//		this.open = open;
//		this.icon = icon;
//		this.url = url; 
//		this.tablename = tablename;
//	}
//}
//
///**点击权限树节点*/
//function treeClick(event,treeId, treeNode, clickFlag){
//	var ent_baseinfo = $('#ent_baseinfo').val(); //基础信息(必填)
//	var tid = treeNode.tId;
//	$("li #"+tid+" a").attr("target","contentIframe");
//	$("li #"+tid+" a").attr("href","javascript:void(0)");
//	
//	if(treeNode.id == -1){
//		return false;
//	}
//	
//	$('#menuname').html(treeNode.name); //菜单名称
//	var businessinfoid = $('#businessinfoid').val();
//	var status = $("#status").val();
//	var nodeurl = "";
//	if (treeNode.url != "undefined" && treeNode.url != null)
//		nodeurl =  treeNode.url;
//	var url = BASE_URL+ nodeurl +"/menuDisplay/"+businessinfoid; //进入编辑页面
//	if(treeNode.tablename == "ent_danexclusive")
//		url = BASE_URL+ nodeurl +"/menuDisplay/"+businessinfoid+"/entinfo"; //从企业基础信息进行危化品专属信息
//	$("#contentIframe").attr("src",url);
//	
//}