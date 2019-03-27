var taskContent = "";
$(document).ready(function () {
	initSeachInput();
	initDateSeach("startTime","endTime");
//	SelectOption.loadTaskStatustype("taskstatus");
//	SelectOption.loadTaskNodeName("node");
    //生成任务列表分页表格
	var colname = ['主键','任务环节','方案名称','任务下发时间','任务完成时间','任务状态','查看任务','接收者','智能方案id','任务内容']; 
	var colmodel = [{name:'TASKID',index:'TASKID',hidden:true},
					{name:'NODE',index:'NODE',align: "center",
            			formatter:function(cellvalue, options, obj) { 
            				var nodename = "";
            				switch(obj.NODE){
    						case 1:
    							nodename = "应急响应";
    							break;
    						case 2:
    							nodename = "组建指挥部";
    							break;
    						case 3:
    							nodename = "次生事件及预警";
    							break;
    						case 4:
    							nodename = "事件控制策略";
    							break;
    						case 5:
    							nodename = "警戒区";
    							break;
    						case 6:
    							nodename = "道路封锁";
    							break;
    						case 7:
    							nodename = " 撤离路线";
    							break;
    						case 8:
    							nodename = "救援路线";
    							break;
    						case 9:
    							nodename = "应急仓库";
    							break;
    						case 10:
    							nodename = "救援队伍";
    							break;
    						/*case 11:
    							nodename = "运输保障";
    							break;*/
    						case 11:
    							nodename = "应急医疗";
    							break;
    						/*case 13:
    							nodename = "通信保障";
    							break;*/
    						case 12:
    							nodename = "避难场所";
    							break;
                            
                        }
            				return nodename;
					}},
					{name:'SCHEMENAME',index:'SCHEMENAME',align: "center",},
					{name:'RECEIVETIME',align: "center",index:'RECEIVETIME',
						 formatter:function(cellvalue, options, obj) { 
	                            return getSmpFormatDateByLong(obj.RECEIVETIME,true);
	                        }
                    },
					{name:'FINISHTIME',align: "center",index:'FINISHTIME',
						 formatter:function(cellvalue, options, obj) { 
	                            return getSmpFormatDateByLong(obj.FINISHTIME,true);
	                        }
                    },
					{name:'TASKSTATUS',align: "center",index:'TASKSTATUS',
					   formatter:function(cellvalue, options, obj) { 
                            if(cellvalue=="0"){
                            	return '未开始';
                            }else if(cellvalue=="1"){
                            	return "进行中";
                            }else if(cellvalue=="2"){
                            	return "已完成";
                            }else{
                            	return "";
                            }
                        }
					},
					{name:'VIEW',align: "center",index:'VIEW',
						formatter:function(cellvalue, options, obj) { 
//                            return '<a href="javascript:void(0);" onclick="display(\''+obj.EVENTID+'\')">查看任务</a>';
							return '<a href="javascript:void(0);" onclick="display(\''+obj.TASKID+'\',\''+obj.NODE+'\',\''+getSmpFormatDateByLong(obj.RECEIVETIME,true)+'\',\''+obj.TASKSTATUS+'\',\''+obj.TASKRECEIVER+'\',\''+obj.SCHEMEID+'\',\''+obj.TASKCONTENT+'\')">查看任务</a>';
                        }
					},
					{name:'TASKRECEIVER',index:'TASKRECEIVER',hidden:true},
					{name:'SCHEMEID',index:'SCHEMEID',hidden:true},
					{name:'TASKCONTENT',index:'TASKCONTENT',hidden:true}
			       ];
    
  //分页表格响应式处理
    var tableHeight = $(window).height() - $(".pcheck").height() - 190 - 33;
    $(window).resize(function () {
        $("#grid-table").jqGrid("setGridHeight", $(window).height() - $('.pcheck').height() - 190 - 33);
        $("#grid-table").jqGrid("setGridWidth", $(window).width() * 0.99);
    });

    $("#grid-table").jqGrid({
    	height: tableHeight,
    	url : BASE_URL + "/ems/emssucisstask/tasklist",
		datatype: "json",
		cache : false,
		mtype : 'post',
		colNames:colname,
		colModel:colmodel,
		postData:{
//			node:$("#node").val(),
//			taskstatus:$("#taskstatus").val(),
//			receivetime:$("#receivetime").val()
		},
		sortname : 'RECEIVETIME',
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
		caption: "任务信息列表",
		autowidth: true
	});

});

function resetData(){
	$('#daterange-btn span').html(" 日期选择");
	$("#startTime").val("");
	$("#endTime").val("");
    $("#node").val("");
    $("#taskstatus").val("");
}

function seach(){
	 reloadGrid();
}

/*详细查询*/
function display(taskid,node,receivetime,taskstate,receiver,schemeid,taskcontent){
	window.top.GEventObject.die("REFERESH_EVENT");
    window.top.GEventObject.on("REFERESH_EVENT", function (json) {
        if (json.success == true) {
        	reloadGrid();
        }
    });
    parent.taskContent = taskcontent;
	parent.openWin(BASE_URL+"views/module/ems/receivemap/respTask.html?taskid="+taskid+"&node="+node+"&receivetime="+receivetime+"&taskstate="+taskstate+"&receiver="+receiver+"&schemeid="+schemeid,getNodeName(node),'57%','62%');
}

/**
 * 刷新时加载查询条件
 */
function reloadGrid() {
	var node = getNode($("#node").val());
	var taskstatus = $("#taskstatus").val();
	if(taskstatus == "未开始"){
		taskstatus = "0";
	} else if(taskstatus == "进行中"){
		taskstatus = "1";
	} else if(taskstatus == "已完成"){
		taskstatus = "2";
	}
    $("#grid-table").jqGrid("setGridParam", {
        page: 1,
        postData: {
        	node:node,
        	taskstatus:taskstatus,
			starttime:$("#startTime").val(),
			endtime:$("#endTime").val()
        }
    }).trigger("reloadGrid");
}

/**
 * 将json数据的key值转换为小写
 * @param jsonObj
 * @returns
 */
function lowerJSONKey(jsonObj){  
    for (var key in jsonObj){  
        jsonObj[key.toLowerCase()] = jsonObj[key];  
        delete(jsonObj[key]);  
    }  
    return jsonObj;  
} 

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
	/*case '11':
		nodename = "运输保障";
		break;*/
	case '11':
		nodename = "应急医疗";
		break;
	/*case '13':
		nodename = "通信保障";
		break;*/
	case '12':
		nodename = "避难场所";
		break;
	}
	return nodename;
}

function getNode(nodename){
	var node;
	switch(nodename){
	case '应急响应':
		node = "1";
		break;
	case '组建指挥部':
		node = "2";
		break;
	case '次生事件及预警':
		node = "3";
		break;
	case '事件控制策略':
		node = "4";
		break;
	case '警戒区':
		node = "5";
		break;
	case '道路封锁':
		node = "6";
		break;
	case '撤离路线':
		node = " 7";
		break;
	case '救援路线':
		node = "8";
		break;
	case '应急仓库':
		node = "9";
		break;
	case '救援队伍':
		node = "10";
		break;
	case '运输保障':
		node = "11";
		break;
	case '应急医疗':
		node = "12";
		break;
	case '通信保障':
		node = "13";
		break;
	case '避难场所':
		node = "14";
		break;
	default	: node = "";
	}
	return node;
}