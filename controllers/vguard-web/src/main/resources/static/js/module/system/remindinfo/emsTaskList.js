$(document).ready(function () {
	var jjrw = getQueryString("jjrw");
	var yjrw = getQueryString("yjrw");
	$("#jjrwnum").text(jjrw);
	$("#yjrwnum").text(yjrw);
	
	// 默认加载第一个grid
	$("#type").val("jjrwGrid");
	loadTaskGrid("jjrwInfo", "#grid-table1", "#grid-pager1");
	
	// 绑定tab导航菜单点击事件
	$("#rwinfo ul li").off("click").on("click", function() {
		var curmenu = $(this).attr("data-tgt");
		// 判断当前点击的tab菜单，进行隐藏显示操作
		if (curmenu == "jjrwInfo") {// 接警任务
			$("#jjrwGrid").empty();
			$("#jjrwGrid").append("<table id=\"grid-table1\"></table>\n" +
		            " <div id=\"grid-pager1\"></div>");
			$("#jjrwGrid").show();
			$("#yjrwGrid").hide();
			$("#type").val("jjrwGrid");
			loadTaskGrid("jjrwInfo", "#grid-table1", "#grid-pager1");
		} else if (curmenu == "yjrwInfo") {//应急任务
			$("#yjrwGrid").empty();
			$("#yjrwGrid").append("<table id=\"grid-table2\"></table>\n" +
		            " <div id=\"grid-pager2\"></div>");
			$("#yjrwGrid").show();
			$("#jjrwGrid").hide();
			$("#type").val("yjrwGrid");
			loadTaskGrid("yjrwInfo", "#grid-table2", "#grid-pager2");
		} 
	});
	
	//弹窗tab点击事件
	$('.xxtxpopupTab ul').on('click','li',function(){
		$('.xxtxpopupTab ul li').removeClass('active');
		$(this).addClass('active');
	})

});


function loadTaskGrid(resType, table, pager) {
	var colname, url;
	if (resType == "jjrwInfo") {
		colname = ["任务id", "任务编号", "下发单位", "下发人", "下发时间", "任务状态", "接收单位", "接收人", "接收时间","操作"];
		url = BASE_URL + "ems/emssucnormaltask/remindlist";
	} else if (resType == "yjrwInfo") {
		colname = ['主键','任务环节','方案名称','任务下发时间','任务完成时间','任务状态','查看任务','接收者','智能方案id','任务内容'];
		url = BASE_URL + "/ems/emssucisstask/remindtasklist";
	}
	// 获取列表参数
	var colmodel = loadColmodel(resType);
	// 分页表格响应式处理
	var tableHeight = $(window).height() - $(".pcheck").height() - 120 - 33;
	$(window).resize(
			function() {
				$("#grid-table").jqGrid("setGridHeight",
						$(window).height() - $('.pcheck').height() - 120 - 33);
				$("#grid-table").jqGrid("setGridWidth",
						$(window).width() * 0.99);
			});

	$("#grid-table").jqGrid("clearGridData");
	$(table).jqGrid({
			height : tableHeight,
			url : url,
			datatype : "json",
			cache : false,
			mtype : "POST",
			colNames : colname,
			colModel : colmodel,
			postData : {
			},
			sortname : "RECEIVETIME",
			sortorder : "desc",
			viewrecords : true,
			pager : pager,
			jsonReader : {
				root : "datas",
				total : "total",
				page : "page",
				records : "records",
				repeatitems : false
			},
			rowNum : 10,
			rowList : [ 10, 20, 30 ],
			altRows : true,
			autowidth : true,
	        scrollOffset: 1,
	        loadComplete:function(){
	        	$("#grid-table").jqGrid("setGridWidth", $(window).width() - 20);
	        	tableScrollResize();
	        }
	});
}

/**
 * 获取列表字段参数
 */
function loadColmodel(resType) {
	var colmodel;
	if (resType == "jjrwInfo") {
		colmodel = [
            {
                name: "NORMALTASKID",
                index: "NORMALTASKID",
                align: "center",
                sortable: false,
                hidden: true
            }, {
                name: "NORMALTASKNO",
                index: "NORMALTASKNO",
                width: "10%",
                align: "center",
                sortable: false
            }, {
                name: "SENDERORGNAME",
                index: "SENDERORGNAME",
                width: "10%",
                align: "center",
                sortable: false
            }, {
                name: "SENDERNAME",
                index: "SENDERNAME",
                width: "8%",
                align: "center",
                sortable: false
            }, {
                name: "SENDTIME",
                index: "SENDTIME",
                width: "12%",
                align: "center",
                sortable: false,
                formatter: function (cellvalue, options, obj) {
                    if (obj.SENDTIME) {
                        return getSmpFormatDateByLong(obj.SENDTIME, true);
                    } else {
                        return "";
                    }
                }
            }, {
                name: "TASKSTATUS",
                index: "TASKSTATUS",
                width: "7%",
                align: "center",
                sortable: false,
                formatter: function (cellvalue, options, obj) {
                    return SelectOption.getTaskStatusData(obj.TASKSTATUS);
                }
            }, {
                name: "RECEIVERORGNAME",
                index: "RECEIVERORGNAME",
                width: "10%",
                align: "center",
                sortable: false
            }, {
                name: "RECEIVERNAME",
                index: "RECEIVERNAME",
                width: "8%",
                align: "center",
                sortable: false
            },
            {
                name: "RECEIVETIME",
                index: "RECEIVETIME",
                width: "12%",
                align: "center",
                sortable: false,
                formatter: function (cellvalue, options, obj) {
                    if (obj.RECEIVETIME) {
                        return getSmpFormatDateByLong(obj.RECEIVETIME, true);
                    } else {
                        return "";
                    }
                }
            },{
                name: "ISCAN",
                index: "ISCAN",
                width: "5%",
                align: "center",
                sortable: false,
                formatter: function (cellvalue, options, obj) {
                    if (obj.ISCAN=='1') {
                    	return '<a style="color: #0075c7;" href="javascript:void(0);" onclick="recive(\'' + obj.NORMALTASKID + '\')">接收</a>';
                    } else if(obj.ISCAN=='2'){
                    	return '<a style="color: #0075c7;" href="javascript:void(0);" onclick="handle(\'' + obj.NORMALTASKID + '\')">办理</a>';                    	
                    } else {
                    	return "--";
                    }
                }
            }];
	} else if(resType == "yjrwInfo") {
		var colmodel = 
			[{name:'TASKID',index:'TASKID',hidden:true},
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
					case 11:
						nodename = "运输保障";
						break;
					case 12:
						nodename = "应急医疗";
						break;
					case 13:
						nodename = "通信保障";
						break;
					case 14:
						nodename = "避难场所";
						break;
                }
    				return nodename;
			}},
			{name:'SCHEMENAME',align: "center",index:'SCHEMENAME'},
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
//	                            return '<a href="javascript:void(0);" onclick="display(\''+obj.EVENTID+'\')">查看任务</a>';
					return '<a style="color: #0075c7;" href="javascript:void(0);" onclick="display(\''+obj.TASKID+'\',\''+obj.NODE+'\',\''+getSmpFormatDateByLong(obj.RECEIVETIME,true)+'\',\''+obj.TASKSTATUS+'\',\''+obj.TASKRECEIVER+'\',\''+obj.SCHEMEID+'\',\''+obj.TASKCONTENT+'\')">查看任务</a>';
                }
			},
			{name:'TASKRECEIVER',index:'TASKRECEIVER',hidden:true},
			{name:'SCHEMEID',index:'SCHEMEID',hidden:true},
			{name:'TASKCONTENT',index:'TASKCONTENT',hidden:true}
	       ];
	}
	return colmodel;
}	

//处理接警任务
function handle(normaltaskid) {
    //TODO 弹出编辑框
	var isRemind = 0;
    parent.openWin(BASE_URL
        + "views/module/ems/emssucnormaltask/emssucnormaltaskHandle.html?normaltaskid="+ normaltaskid+"&isRemind="+isRemind,
        '办理接警任务', '45%', '30%');
    reloadGrid("jjrw");
}

/**
 * 接收接警任务
 */
function recive(normaltaskid) {
    $.ajax({
        type: "post",
        url: BASE_URL + "ems/emssucnormaltask/recive",
        dataType: "json",
        data: {
            normaltaskid: normaltaskid
        },
        success: function (data) {
//        	parent.loadRemindCount();
//        	parent.closeWin();
            parent.toast(data.msg);//弹出提示信息
            reloadGrid("jjrw");
        },
        error: function () {
            parent.toast("初始化信息加载失败");
        }
    });
}

/*详细查询*/
function display(taskid,node,receivetime,taskstate,receiver,schemeid,taskcontent){
	window.top.GEventObject.die("REFERESH_EVENT");
    window.top.GEventObject.on("REFERESH_EVENT", function (json) {
        if (json.success == true) {
        	reloadGrid("yjrw");
        }
    });
    parent.taskContent = taskcontent;
    var isRemind = 0;
	parent.openWin(BASE_URL+"views/module/ems/receivemap/respTask.html?taskid="+taskid+"&node="+node+"&receivetime="+receivetime+"&taskstate="+taskstate+"&receiver="+receiver+"&schemeid="+schemeid+"&isRemind="+isRemind,"查看任务",'60%','55%');
}

/**
 * 刷新时加载查询条件
 */
function reloadGrid(selected) {
	// 遍历选中值
	if (selected == "jjrw") {
		reloadType("grid-table1");
	} else if (selected == "yjrw") {
		reloadType("grid-table2");
	} 
}

//根据类型id刷新
function reloadType(type) {
	$("#" + type).jqGrid("setGridParam", {
		page : 1,
		postData : {
		}
	}).trigger("reloadGrid");
}

function getQueryString(name){
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return  unescape(r[2]); return null;
}