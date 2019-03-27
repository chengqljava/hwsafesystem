/**
 * 应急救援GIS首页-智能方案-任务发送消息
 * Created by Administrator on 2017/10/16.
 */
$(function() {
	var isRemind = getQueryString("isRemind");
	//获取当前任务id
	var taskId = getQueryString("taskid"),
		node = getQueryString("node"),
		receivetime = getQueryString("receivetime"),
		receiver = getQueryString("receiver"),
		schemeid = getQueryString("schemeid"),
		taskstate = getQueryString("taskstate");
	$("#taskstate").val(taskstate);
	if (parent.taskContentInfo != "" && typeof(parent.taskContentInfo) != "undefined") {
		contentInfo = parent.taskContentInfo;
	}else {
		contentInfo = parent.taskContent;
	}
	/*$("#receivetime").html(receivetime);
	$("#node").html(getNodeName(node));
	$("#taskcontent").html(contentInfo);
	$("#taskId").val(taskId);*/
	
	var data = {};
	data.receivetime = receivetime;
	data.node = getNodeName(node);
	data.taskId = taskId;
	data.taskcontent = contentInfo;
	data.taskstate = taskstate;
	data.receiver = receiver;
	var collectionTpt = _.template($("#taskInfoTpt").html());
	$("#collectionForm").html(collectionTpt(data));
	
	/*var resWinTpt = _.template($("#taskInfoTpt").html());
    tmpWinCon = resWinTpt(data);*/
	
	//查询任务内容
	loadContent(node,schemeid);

	//办理任务
	$("#transact").off("click").on("click", function () {
		if ($("#taskstate").val()=="0") {
			transactTask(taskId,"1",isRemind);//开始办理任务
		}else if ($("#taskstate").val() == "1") {
			parent.toast("任务正在办理!");
			return false;
		}else if($("#taskstate").val() == "2"){
			parent.toast("任务已经完结!");
			return false;
		}
	});
	//办结任务
	$("#complete").off("click").on("click", function () {
		if ($("#taskstate").val()=="0") {
			parent.toast("任务还未开始!");
			return false;
		}else if ($("#taskstate").val() == "1") {
			transactTask(taskId,"2",isRemind);//开始办理任务
		}else if($("#taskstate").val() == "2"){
			parent.toast("任务已经完结!");
			return false;
		}
	});
	//任务反馈
	$("#taskFeedBack").off("click").on("click", function () {
		//打开信息互动窗口
		parent.openWin(BASE_URL+"views/module/ems/emsmap/aiplan/common/aiPlanNodeTskTraceTask.html?&taskId="+taskId+"&receiver="+receiver,
				"任务跟踪","55%","63%");
	});
	
});

/**
 * 办理任务(或办结任务)
 * @param taskId
 * @param type 0 办理任务 1.办结任务
 */
function transactTask(taskId,type,isRemind){
	$.ajax({
	       type: "post",
	       url: BASE_URL + "ems/emssucisstask/transactTask",
	       data: {
	        	"taskid": taskId,
	        	"type":type
	        },
	       success: function(data) {
	    	   if (data.success == true){
	    		   parent.toast(data.msg);//弹出提示信息
	    		   window.top.GEventObject.fireEvent('REFERESH_EVENT', data);
	    		   if ($("#taskstate").val() == "0") {
	    			   $("#taskstate").val("1");;//已办理
	    		   }else if ($("#taskstate").val() == "1") {
	    			   $("#taskstate").val("2");//已办理
	    		   }
	    		   parent.parent.loadRemindCount();
	    		   if(type == 2){	    			   
	    			   if(isRemind == 0){
	    				   parent.closeAllWin();
	    			   }
	    		   }
//	    			   parent.closeWin();// 关闭弹出框
	    		  
	    	   } else {
	    		   parent.toast(data.msg);//弹出提示信息
	    	   }
	        },
	        error : function() {
				parent.toast("初始化信息加载失败!");
			}
	});
}

/**
 * 获取当前url访问路径后缀参数值
 * @param name
 * @returns
 */
function getQueryString(name) {
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}

/**
 * 获取ifream src
 * @param node
 */
function loadContent(node,schemeid){
//	alert(schemeid);
	var url;
	switch(node){
	case '1':
		//应急响应
		url = BASE_URL+"views/module/ems/map/aiplan/emsplan/resp/respIndex.html?schemeid="+schemeid;
		break;
	case '2':
		//组建指挥部
		url = BASE_URL+"views/module/ems/map/aiplan/emsplan/directDept/directDeptIndex.html?schemeid="+schemeid;
		break;
	case '3':
		//次生事件
		url = BASE_URL+"views/module/ems/map/aiplan/emsplan/secEvn/secEvnIndex.html?schemeid="+schemeid;
		break;
	case '4':
		//时间控制策略
		url = BASE_URL+"views/module/ems/map/aiplan/forecast/eventCtrlIndex.html?schemeid="+schemeid;
		break;
	case '5':
		//警戒区
		url = BASE_URL+"views/module/ems/map/aiplan/forecast/alertZoneInfo.html?schemeid="+schemeid;
		break;
	case '6':
		//道路封锁
		url = BASE_URL+"views/module/ems/map/aiplan/forecast/roadBlockInfo.html?schemeid="+schemeid;
		break;
	case '7':
		//撤退路线
		url = BASE_URL+"views/module/ems/map/aiplan/forecast/leaveRouteList.html?schemeid="+schemeid;
		break;
	case '8':
		//救援路线
		url = BASE_URL+"views/module/ems/map/aiplan/forecast/rescueRouteList.html?schemeid="+schemeid;
		break;
	case '9':
		//应急仓库
		url = BASE_URL+"views/module/ems/map/aiplan/resource/equipList.html?schemaId="+schemeid;
		break;
	case '10':
		//救援队伍
		url = BASE_URL+"views/module/ems/map/aiplan/resource/teamList.html?schemaId="+schemeid;
		break;
	/*case '11':
		url = "运输保障";
		break;*/
	case '11':
		//医疗资源
		url = BASE_URL+"views/module/ems/map/aiplan/resource/healthdeptList.html?schemeid="+schemeid;
		break;
	/*case '13':
		url = "通信保障";
		break;*/
	case '12':
		//避难场所
		url = BASE_URL+"views/module/ems/map/aiplan/resource/shelterList.html?schemeid="+schemeid;
		break;
	}
	$("#contentIframe").attr("src",url);
}

/**
 * 获取环节节点名称
 * @param node
 * @returns {String}
 */
function getNodeName(node){
	var nodename;
	switch(node){
	case '1':
		nodename = "应急响应";
		break;
	case '2':
		nodename = "组建指挥部";
		break;
	case '3':
		nodename = "次生事件及预警";
		break;
	case '4':
		nodename = "事件控制策略";
		break;
	case '5':
		nodename = "警戒区";
		break;
	case '6':
		nodename = "道路封锁";
		break;
	case '7':
		nodename = " 撤离路线";
		break;
	case '8':
		nodename = "救援路线";
		break;
	case '9':
		nodename = "应急仓库";
		break;
	case '10':
		nodename = "救援队伍";
		break;
	case '11':
		nodename = "运输保障";
		break;
	case '12':
		nodename = "应急医疗";
		break;
	case '13':
		nodename = "通信保障";
		break;
	case '14':
		nodename = "避难场所";
		break;
	}
	return nodename;
}