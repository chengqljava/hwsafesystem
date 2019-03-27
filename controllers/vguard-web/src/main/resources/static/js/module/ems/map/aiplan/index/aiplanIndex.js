/**
 * 应急救援GIS首页-智能方案
 * Created by Administrator on 2017/10/16.
 */
$(function() {
	//获取父级页面-当前所选事故id和最新事故模拟id
	var eventid = getQueryString("eventid");
	$("#eventid").val(eventid);
	
	//加载上次最新保存的智能方案
	loadLastAiPlan(eventid);
	
	//新建方案按钮
    $("#newPlanBtn").off("click").on("click", function() {
    	window.top.GEventObject.die("LOAD_EMS_AiPLAN_ADD_EVENT");
    	window.top.GEventObject.on("LOAD_EMS_AiPLAN_ADD_EVENT", function(param) {
    		//显示智能方案流程图
    		$("#aiPlanFlow").show();
    		
    		//为新增的智能方案部分字段赋值
    		$("#schemename").val(param.schemename);
    		$("#scnameTitle").text(param.schemename);
			$("#schemecode").val(param.schemecode);
			
			//显示新建智能方案保存按钮，并切换按钮颜色状态
			if ($(".aiPTskNodeBtn").hasClass("btn-warning")) {
				$(".aiPTskNodeBtn").removeClass("btn-warning");
				$(".aiPTskNodeBtn").addClass("btn-default");
			}
			
			//显示保存新方案按钮
			$("#saveSchemaDiv").css("display", "table");
			$("#newPlanBtn, #historyPlanBtn").hide();//隐藏新建和历史按钮
			
			//给当前新建方案id设为0,以便在方案新增页面但未点击保存按钮之前，该方案下的各个流程节点点击的方案id取值
			$("#schemeid").val("0");
    	});
    	parent.openWin(BASE_URL + "views/module/ems/map/aiplan/addAiPlan/addAiPlan.html", "添加智能方案", "30%", "40%");
    });
    
    //历史方案按钮
    $("#historyPlanBtn").off("click").on("click", function() {
    	//历史方案窗口回调
    	window.top.GEventObject.die("LOAD_EMS_AiPLAN_GETHISROW_EVENT");
    	window.top.GEventObject.on("LOAD_EMS_AiPLAN_GETHISROW_EVENT", function(param) {
    		//显示智能方案流程图
    		$("#aiPlanFlow").show();
    		
//    		alert("返回" + JSON.stringify(param));
    		//为方案各参数赋值
    		$("#schemeid").val(param.SCHEMEID);
			$("#schemename").val(param.SCHEMENAME);
			$("#schemecode").val(param.SCHEMECODE);
			$("#tasknode").val(param.TASKNODE);
			$("#eventid").val(param.EVENTID);
			$("#simulationid").val(param.SIMULATIONID);
			$("#plaid").val(param.PLAID);
			$("#evaluationid").val(param.EVALUATIONID);
			$("#forecastid").val(param.FORECASTID);
    		$("#scnameTitle").text(param.SCHEMENAME);
    		
    		//存储新增方案取消后所需要的上一次方案id
    		$("#lastschemeid").val(param.SCHEMEID);
    		
    		//回调修改遍历所有方案节点状态
    		$(".aiPTskNodeBtn").each(function() {
				if (parseInt($(this).attr("data-node")) <= parseInt(param.TASKNODE)) {
					if ($(this).hasClass("btn-default")) {
						$(this).removeClass("btn-default");
						$(this).addClass("btn-warning");
					}
				} else {
					if ($(this).hasClass("btn-warning")) {
						$(this).removeClass("btn-warning");
						$(this).addClass("btn-default");
					}
				}
			});
    		
    		//根据当时历史记录中的事故模拟id，地图加载相应的覆盖物
    		parent.addEvnAnaGisOverLays(null, param.SIMULATIONID);
    		//根据当时历史记录中的资源评估id,地图加载相应的覆盖物
    		loadResource(param.EVALUATIONID);
    		//根据当时历史记录中的综合预测id,地图加载相应的覆盖物
    		loadForecast(param.FORECASTID);
			   		
    		//切换回历史方案后，如果保存区域按钮存在则隐藏之
    		if ("table" == $("#saveSchemaDiv").css("display")) {
    			$("#saveSchemaDiv").hide();
    		}
    	});
    	parent.openWin(BASE_URL + "views/module/ems/map/aiplan/aiPlanList/aiPlanList.html?eventid="+eventid, "选择智能方案历史记录", "50%", "60%");
    });
    
    //应急响应按钮
    $("#responseBtn").off("click").on("click", function() {
    	//应急响应节点弹窗
    	popAiPlanTskNodeWin({
    		btnId: "responseBtn",
    		url: "views/module/ems/map/aiplan/emsplan/resp/respIndex.html",
    		paraArr: [{"name": "eventid", "value": $("#eventid").val()}],
    		title: "应急响应",
    		width: "50%",
    		height: "65%"
    	});
//    	var schemaId = $("#schemeid").val(),
//    		isDisTask = "0", //0:不派遣任务  1：派遣任务
//    		isCallBack = "0",//0:不回调  1：需要回调来更改方案节点颜色状态
//    		$clkBtn = $(this);//当前点击按钮jQuery对象
//    	//当点击时处于非新建方案页面时
//    	if ("0" != schemaId) {
//    		var nextTskNode = parseInt($("#tasknode").val()) + 1,
//    			curClkNode = parseInt($(this).attr("data-node"));
//    		
//    		if (nextTskNode == curClkNode) {
//    			//当当前点击节点等于 当前方案节点值+1 时，既需要派遣任务，也需要回调更改页面节点颜色状态
//    			isDisTask = "1";
//    			isCallBack = "1";
//    			
//    			//定义回调弹出应急响应窗口关闭后的回调事件
//    			window.top.GEventObject.die("EMS_AiPLAN_TASKNODECLK_EVENT");
//    	    	window.top.GEventObject.on("EMS_AiPLAN_TASKNODECLK_EVENT", function(param) {
//					//更改当前方案的运行节点状态
//					$.ajax({
//			    		type: "post",
//			    		url: BASE_URL + "ems/emssucissscheme/updateByParam",
//			    		data: {"schemeid": schemaId, "tasknode": curClkNode},
//			    		success: function(data) {
//			    			if (data.success == true ){
//			    				//更改当前节点的状态为激活状态
//			    				$clkBtn.removeClass("btn-default");
//			    				$clkBtn.addClass("btn-warning");
//								
//								//更新当前方案点位状态
//								$("#tasknode").val(curClkNode);
//			    			}
//			    		}
//					});
//					
//    	    	});
//    		} else if (nextTskNode > curClkNode) {
//    			//当当前点击节点 小于 当前方案节点值+1 时，只需要派遣任务
//    			isDisTask = "1";
//    		} 
//    	}
//    	parent.openWin(BASE_URL + "views/module/ems/map/aiplan/emsplan/resp/respIndex.html?isDisTask=" + isDisTask + 
//    				   "&isCallBack=" + isCallBack + "&schemaId=" + schemaId, "应急响应","50%","85%");
    });
    
    //组建指挥部按钮
    $("#headquarterBtn").off("click").on("click", function() {
    	//组建指挥部节点弹窗
    	popAiPlanTskNodeWin({
    		btnId: "headquarterBtn",
    		url: "views/module/ems/map/aiplan/emsplan/directDept/directDeptIndex.html",
    		paraArr: [{"name": "eventid", "value": $("#eventid").val()}],
    		title: "组建指挥部",
    		width: "50%",
    		height: "65%"
    	});
    });
    
    //次生事件及预警按钮
    $("#possibleEventBtn").off("click").on("click", function() {
    	//次生事件及预警节点弹窗
    	popAiPlanTskNodeWin({
    		btnId: "possibleEventBtn",
    		url: "views/module/ems/map/aiplan/emsplan/secEvn/secEvnIndex.html",
    		paraArr: [{"name": "eventid", "value": $("#eventid").val()}],
    		title: "次生事件及预警",
    		width: "50%",
    		height: "65%"
    	});
    });
    
    //事件控制策略按钮
    $("#eventControlBtn").off("click").on("click", function() {
    	//事件控制策略节点弹窗
    	popAiPlanTskNodeWin({
    		btnId: "eventControlBtn",
    		url: "views/module/ems/map/aiplan/forecast/eventCtrlIndex.html",
    		paraArr: [{"name": "eventid", "value": $("#eventid").val()}],
    		title: "事件控制策略",
    		width: "50%",
    		height: "65%"
    	});
    });
    
    //警戒区
    $("#warningAreaBtn").off("click").on("click", function() {
    	popAiPlanTskNodeWin({
    		btnId: "warningAreaBtn",
    		url: "views/module/ems/map/aiplan/forecast/alertZoneInfo.html",
    		paraArr: null,
    		title: "警戒区",
    		width: "50%",
    		height: "55%"
    	});
    	
//    	parent.openWin(BASE_URL+"views/module/ems/map/aiplan/forecast/alertZoneInfo.html?schemeid="+$("#schemeid").val(),'警戒区','','55%');
    	
    });
    
    //道路封锁
    $("#roadClosedBtn").off("click").on("click", function() {
    	popAiPlanTskNodeWin({
    		btnId: "roadClosedBtn",
    		url: "views/module/ems/map/aiplan/forecast/roadBlockInfo.html",
    		paraArr: null,
    		title: "道路封锁",
    		width: "50%",
    		height: "55%"
    	});
//    	parent.openWin(BASE_URL+"views/module/ems/map/aiplan/forecast/roadBlockInfo.html?schemeid="+$("#schemeid").val(),'道路封锁','','55%');
    });
    
    //撤离路线按钮
    $("#leaveRouteBtn").off("click").on("click", function() {
    	popAiPlanTskNodeWin({
    		btnId: "leaveRouteBtn",
    		url: "views/module/ems/map/aiplan/forecast/leaveRouteList.html",
    		paraArr: null,
    		title: "撤离路线",
    		width: "50%",
    		height: "55%"
    	});
//    	parent.openWin(BASE_URL+"views/module/ems/map/aiplan/forecast/leaveRouteList.html?schemeid="+$("#schemeid").val(),'撤离路线','','55%');
    });
    
    //救援路线按钮
    $("#rescueRouteBtn").off("click").on("click", function() {
    	popAiPlanTskNodeWin({
    		btnId: "rescueRouteBtn",
    		url: "views/module/ems/map/aiplan/forecast/rescueRouteList.html",
    		paraArr: null,
    		title: "救援路线",
    		width: "50%",
    		height: "55%"
    	});
//    	parent.openWin(BASE_URL+"views/module/ems/map/aiplan/forecast/rescueRouteList.html?schemeid="+$("#schemeid").val(),'救援路线','','55%');
    });
    

    //应急仓库按钮
     $("#emsWarehouseBtn").off("click").on("click", function() {
     	//物资装备节点弹窗
     	popAiPlanTskNodeWin({
     		btnId: "emsWarehouseBtn",
     		url: "views/module/ems/map/aiplan/resource/equipList.html",
     		paraArr: [{"name": "eventid", "value": $("#eventid").val()}],
//     		          {"name": "schemeid", "value": $("#schemeid").val()}],
     		title: "物资装备",
     		width: "50%",
     		height: "65%"
     	});
     	
     });
     
     //救援队伍按钮
     $("#rescueTeamBtn").off("click").on("click", function() {
     	//救援队伍节点弹窗
     	popAiPlanTskNodeWin({
     		btnId: "rescueTeamBtn",
     		url: "views/module/ems/map/aiplan/resource/teamList.html",
     		paraArr: [{"name": "eventid", "value": $("#eventid").val()}],
//     		          {"name": "schemeid", "value": $("#schemeid").val()}],
     		title: "救援队伍",
     		width: "50%",
     		height: "65%"
     	}); 
     });
    //运输保障按钮
    $("#emsTransportBtn").off("click").on("click", function() {
    	parent.openWin(BASE_URL+"/enterprise/entbusinessinfo/display/C4CC8D76C94A43ACA451450FA967FEAB",'详细','','85%');
    	
    	
    });
    
    //应急医疗按钮
    $("#emsMedicalBtn").off("click").on("click", function() {
    	popAiPlanTskNodeWin({
    		btnId: "emsMedicalBtn",
    		url: "views/module/ems/map/aiplan/resource/healthdeptList.html",
    		paraArr: null,
    		title: "应急医疗",
    		width: "50%",
    		height: "55%"
    	});
    	
//    	parent.openWin(BASE_URL+"views/module/ems/map/aiplan/resource/healthdeptList.html?schemeid="+$("#schemeid").val(),'医疗资源','','55%');
    	
    	
    });
    
    //通信保障按钮
    $("#emsComBtn").off("click").on("click", function() {
    	parent.openWin(BASE_URL+"/enterprise/entbusinessinfo/display/C4CC8D76C94A43ACA451450FA967FEAB",'详细','','85%');
    	
    	
    });
    
    //避难场所按钮
    $("#refugePlaceBtn").off("click").on("click", function() {
    	popAiPlanTskNodeWin({
    		btnId: "refugePlaceBtn",
    		url: "views/module/ems/map/aiplan/resource/shelterList.html",
    		paraArr: null,
    		title: "避难场所",
    		width: "50%",
    		height: "55%"
    	});
    	
//    	parent.openWin(BASE_URL+"views/module/ems/map/aiplan/resource/shelterList.html?schemeid="+$("#schemeid").val(),'避难场所','','55%');
    	
    	
    });

    //保存智能方案按钮
    $("#saveSchemaBtn").off("click").on("click", function() {
    	//最新事故模拟id
		var curEvnAnaId = parent.addEvnAnaGisOverLays($("#eventid").val(), null, true);

    	var paraArr = $("#addSchemaForm").serializeArray();
    	paraArr = addId($("#eventid").val(),paraArr);
    	paraArr.push({"name": "curEvnAnaId", "value": curEvnAnaId});   	
    	
    	$.ajax({
    		type: "post",
    		url: BASE_URL + "ems/emssucissscheme/save",
    		cache: false,
    		dataType: "json",
    		data: paraArr,
    		success: function(data) {
    			if ("true" == data.msg) {
    				//隐藏保存按钮区域
        			$("#saveSchemaDiv").hide();
        			$("#newPlanBtn, #historyPlanBtn").show();//显示新建|历史按钮
        			
        			//给当前新保存的方案各参数赋值，以备后续使用
        			$("#schemeid").val(data.emsSucIssScheme.schemeid);
					$("#tasknode").val(data.emsSucIssScheme.tasknode);
					$("#simulationid").val(curEvnAnaId);
					$("#plaid").val(data.emsSucIssScheme.plaid);
					$("#evaluationid").val(data.emsSucIssScheme.evaluationid);
					$("#forecastid").val(data.emsSucIssScheme.forecastid);
					
					//地图加载最新的事故模拟覆盖物
					parent.addEvnAnaGisOverLays(eventid, null);
					//根据资源评估id,地图加载相应的覆盖物
					loadResource(data.emsSucIssScheme.evaluationid);
		    		//根据综合预测id,地图加载相应的覆盖物
					loadForecast(data.emsSucIssScheme.forecastid);
											
    				parent.toast("添加成功！");
    			} else {
    				parent.toast("添加失败！");
    			}
    		},
    		error: function() {
    			parent.toast("保存失败");
    		}
    	});
    });
    
    //保存生成方案文档按钮
//    $("#genSchemaDocBtn").off("click").on("click", function() {});
    
    //取消保存智能方案按钮
    $("#cancelBtn").off("click").on("click", function() {
    	//隐藏保存新方案按钮
		$("#saveSchemaDiv").hide();
		
		//重新显示新增方案|历史按钮按钮
		$("#newPlanBtn, #historyPlanBtn").show();
		
    	var lastschemeid =  $("#lastschemeid").val();
    	 
    	//判断点击新增方案按钮前时是否已有方案已在展示,有则将上一次历史方案参数加载出来
    	if ("0" != lastschemeid) {
    		//显示智能方案流程图
    		$("#aiPlanFlow").show();
    		
    		$.ajax({
        		type: "post",
        		url: BASE_URL + "ems/emssucissscheme/getSchemaById",
        		data: {"schemaId": lastschemeid},
        		success: function(data) {
        			if (data.emsSucIssScheme) {
        				//为方案各参数赋值
        	    		$("#schemeid").val(data.emsSucIssScheme.schemeid);
        				$("#schemename").val(data.emsSucIssScheme.schemename);
        				$("#schemecode").val(data.emsSucIssScheme.schemecode);
        				$("#tasknode").val(data.emsSucIssScheme.tasknode);
        				$("#eventid").val(data.emsSucIssScheme.eventid);
        				$("#simulationid").val(data.emsSucIssScheme.simulationid);
        				$("#plaid").val(data.emsSucIssScheme.plaid);
        				$("#evaluationid").val(data.emsSucIssScheme.evaluationid);
        				$("#forecastid").val(data.emsSucIssScheme.forecastid);
        	    		$("#scnameTitle").text(data.emsSucIssScheme.schemename);
        	    		
        	    		//存储新增方案取消后所需要的上一次方案id
        	    		$("#lastschemeid").val(data.emsSucIssScheme.schemeid);
        	    		
        	    		//回调修改遍历所有方案节点状态
        	    		$(".aiPTskNodeBtn").each(function() {
        					if (parseInt($(this).attr("data-node")) <= data.emsSucIssScheme.tasknode) {
        						if ($(this).hasClass("btn-default")) {
        							$(this).removeClass("btn-default");
        							$(this).addClass("btn-warning");
        						}
        					} else {
        						if ($(this).hasClass("btn-warning")) {
        							$(this).removeClass("btn-warning");
        							$(this).addClass("btn-default");
        						}
        					}
        				});
        			}
        		},
        		error: function() {
        			parent.toast("系统正忙，请稍后再试！");
        		}
        	});
    	} else {
    		//如果新建方案之前是空方案记录时隐藏各流程按钮
    		$("#aiPlanFlow").hide();
    	}
    });
    
});

//保存时加载最新资源评估id、综合预测id
 function addId(eventid,paraArr){
	$.ajax({
		type: "post",
		url: BASE_URL + "ems/emssucigrforecast/loadbyeventid",
		data: {
			"eventid": eventid
		},
		dataType: "json",
		async: false,
		success: function(data) {
			if (data.forecastList != null) {
				for(var k in paraArr){
					if(paraArr[k].name == "evaluationid"){
						paraArr[k].value = data.evaluationid;
						
					}
					if(paraArr[k].name == "forecastid"){
						paraArr[k].value = data.forecastList[0].forecastid;
					}
				}
			}
			
		},
		error : function() {
			parent.toast("初始化信息加载失败!");
		}
	}); 
	return paraArr;
}     
     
/*根据综合预测id加载道路封锁、警戒区、救援撤退路线*/
function loadForecast(forecastid){
	$.ajax({
		type : "post",
		url : BASE_URL + "ems/emssucigrforecast/getRoute",
		data : {
			"forecastid":forecastid
		},
		dataType: "json",
		success : function(data) {
			if (data.leaveList != null) {				
				//撤离路线
				window.parent.initHistoryDriveRoute(data.leaveList,"cllx");				
			}
			if(data.rescueList != null){
				//救援路线
				window.parent.initHistoryDriveRoute(data.rescueList,"jylx");
			}
			if (data.roadblockList != null ) {
				//道路封锁
				$.each(data.roadblockList,function(index,obj){
//					alert(obj.roadlon+","+obj.roadlat);
					window.parent.simpleMarker(obj.roadname,obj.roadlon,obj.roadlat);
				});
			}
			if (data.alertzone) {
				//道路封锁
				window.parent.loadWarnArea(data.alertzone.zonearea);
			}
//			parent.closeWin();
		},
		error : function() {
			parent.toast("初始化信息加载失败!");
		}
	});
}

//根据资源评估id加载点位信息
function loadResource(evaluationid){
	$.ajax({
		type : "post",
		url : BASE_URL + "ems/emssucresourceevaluation/resoucelist",
		data : {
			"evaluationid":evaluationid
		},
		success : function(data) {
			if (data.data != null) {
				window.parent.initResMarks(data.data);
			}
		}
	});
}

/**
 * 加载上次最新保存的智能方案
 * @param eventid
 */
function loadLastAiPlan(eventid) {
	$.ajax({
		type: "post",
		url: BASE_URL + "ems/emssucissscheme/loadLastAiPlan",
		data: {"eventid": eventid},
		success: function(retData) {
			if (retData) {
//				alert(JSON.stringify(retData.emsSucIssScheme));
				if (retData.emsSucIssScheme && "null" != retData.emsSucIssScheme) {
					//存在历史智能方案时
					//显示方案流程图
					$("#aiPlanFlow").show();
					
					//为当前方案各参数赋值
					$("#schemeid").val(retData.emsSucIssScheme.schemeid);
					$("#schemename").val(retData.emsSucIssScheme.schemename);
					$("#schemecode").val(retData.emsSucIssScheme.schemecode);
					$("#tasknode").val(retData.emsSucIssScheme.tasknode);
					$("#eventid").val(retData.emsSucIssScheme.eventid);
					$("#simulationid").val(retData.emsSucIssScheme.simulationid);
					$("#plaid").val(retData.emsSucIssScheme.plaid);
					$("#evaluationid").val(retData.emsSucIssScheme.evaluationid);
					$("#forecastid").val(retData.emsSucIssScheme.forecastid);
					$("#scnameTitle").text(retData.emsSucIssScheme.schemename);
					
					//存储新增方案取消后所需要的上一次方案id
					$("#lastschemeid").val(retData.emsSucIssScheme.schemeid);
					
					//回调修改遍历所有方案节点状态
					$(".aiPTskNodeBtn").each(function() {
						if (parseInt($(this).attr("data-node")) <= retData.emsSucIssScheme.tasknode) {
							if ($(this).hasClass("btn-default")) {
								$(this).removeClass("btn-default");
								$(this).addClass("btn-warning");
//								alert($(this).attr("data-node"));
							}
						} else {
							if ($(this).hasClass("btn-warning")) {
								$(this).removeClass("btn-warning");
								$(this).addClass("btn-default");
							}
						}
					});
					
					//根据当时历史记录中的事故模拟id，地图加载相应的覆盖物
					parent.addEvnAnaGisOverLays(null, retData.emsSucIssScheme.simulationid);
					//根据当时历史记录中的资源评估id,地图加载相应的覆盖物
					loadResource(retData.emsSucIssScheme.evaluationid);
		    		//根据当时历史记录中的综合预测id,地图加载相应的覆盖物
					loadForecast(retData.emsSucIssScheme.forecastid);	
					
				} else {
//					$("#schemeid").val("0");
					//存储新增方案取消后所需要的上一次方案id
					$("#lastschemeid").val("0");
				}
			}
		}
	});
}

/**
 * 智能方案节点点击弹窗公共方法
 * @param param
 */
function popAiPlanTskNodeWin(param) {
	var schemaId = $("#schemeid").val(),
		isDisTask = "0", //0:不派遣任务  1：派遣任务
		isCallBack = "0",//0:不回调  1：需要回调来更改方案节点颜色状态
		$clkBtn = $("#" + param.btnId);//当前点击按钮jQuery对象
	
	//当点击时处于非新建方案页面时
	if ("0" != schemaId) {
		var nextTskNode = parseInt($("#tasknode").val()) + 1,
			curClkNode = parseInt($clkBtn.attr("data-node"));
//		alert("nextTskNode" + nextTskNode);
//		alert("curClkNode" + curClkNode);
		if (nextTskNode == curClkNode) {
			//当当前点击节点等于 当前方案节点值+1 时，既需要派遣任务，也需要回调更改页面节点颜色状态
			isDisTask = "1";
			isCallBack = "1";
			
			//定义回调弹出应急响应窗口关闭后的回调事件
			window.top.GEventObject.die("EMS_AiPLAN_TASKNODECLK_EVENT");
	    	window.top.GEventObject.on("EMS_AiPLAN_TASKNODECLK_EVENT", function(param) {
				//更改当前方案的运行节点状态
				$.ajax({
		    		type: "post",
		    		url: BASE_URL + "ems/emssucissscheme/updateByParam",
		    		data: {"schemeid": schemaId, "tasknode": curClkNode},
		    		success: function(data) {
		    			if (data.success == true) {
		    				//更改当前节点的状态为激活状态
		    				$clkBtn.removeClass("btn-default");
		    				$clkBtn.addClass("btn-warning");
							
							//更新当前方案点位状态
							$("#tasknode").val(curClkNode);
		    			}
		    		}
				});
				
	    	});
		} else if (nextTskNode > curClkNode) {
			//当当前点击节点 小于 当前方案节点值+1 时，只需要派遣任务
			isDisTask = "1";
		} 
	}
	
	//url前缀
	var urlPrefix = BASE_URL + param.url + "?isDisTask=" + isDisTask + "&isCallBack=" + 
					isCallBack + "&schemaId=" + schemaId;
	
	//拼接参数
	if (param.paraArr && 0 < param.paraArr.length) {
		_.map(param.paraArr, function(para, i) {
			urlPrefix += ("&" + para.name + "=" + para.value);
		});
	} 
	console.log(urlPrefix);
	//打开节点弹窗
	parent.openWin(urlPrefix, param.title, param.width, param.height);
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