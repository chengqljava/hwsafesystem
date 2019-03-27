/**
 * 应急救援GIS首页-智能方案
 * Created by Administrator on 2017/10/16.
 */
$(function() {
	//获取父级页面-当前所选事故id和最新事故模拟id
	var eventid = getQueryString("eventid");
	$("#eventid").val(eventid);
	
	//加载上次最新保存的智能方案
//	loadLastAiPlan(eventid);
	var node = 1;
	var title = "应急响应";
//    新增时左侧点击事件
    $('.leftTab ul').on('click', 'li', function () {
        var kind = $(this).data('kind');
        if (kind == 'next') {
            return 0;
        }
        $('.leftTab ul li').removeClass('active');
        $(this).addClass('active');
        $('.leftTab ul li').map(function () {
            var $kind = $(this).data('kind');
            if ($kind == 'next') {
            } else {
                $(this).find('img').attr('src', BASE_URL + '/images/ems/emsaiplan/icon_' + $kind + '2.png')
            }
        });
        $(this).find('img').attr('src', BASE_URL + '/images/ems/emsaiplan/icon_' + kind + '1.png');
        $('.topContent').show();
    	$('.bottomContent').hide();
    	$("#kindInfo").addClass('active');
    	$('#rwInfo').removeClass('active');

//    	$("#topTable").empty();
//
//        $("#topTable").append(" <table id=\"respGrid-table\"></table>\n" +
//            " <div id=\"respGrid-pager\"></div>");
        
        var schemeid = $("#schemeid").val();
        var evaluationid = $("#evaluationid").val();
        var forecastid = $("#forecastid").val();
        switch (kind) {
            case 'yjxy':
                $('#kindInfo').html('应急响应');
                node = 1;
                initYjxyInfo(eventid);
                title="应急响应";
                break;
            case 'zjzhb':
                $('#kindInfo').html('组建指挥部');
                //TODO
                node = 2;
                initZjZhbGrid(eventid);
                title="组建指挥部";
                break;
            case 'cssjjyj':
                $('#kindInfo').html('次生事件及预警');
                node = 3;
                initCsshGrid(eventid);
                title="次生事件及预警";
                break;
            case 'sjkzcl':
                $('#kindInfo').html('事件控制策略');
                node = 4;
                initStkzclInfo(forecastid);
                title="事件控制策略";
                break;
            case 'jjq':
                $('#kindInfo').html('警戒区');
                node = 5;
                initJjqInfo(forecastid);
                title="警戒区";
                break;
            case 'dlfs':
                $('#kindInfo').html('道路封锁');
                node = 6;
                initDlfsInfo(forecastid);
                title="道路封锁";
                break;
            case 'cllx':
                $('#kindInfo').html('撤离路线');
                node = 7;
                initLxInfo(forecastid,"0","撤离路线名称");
                title="撤离路线";
                break;
            case 'jylx':
                $('#kindInfo').html('救援路线');
                node = 8;
                initLxInfo(forecastid,"1","救援路线名称");
                title="救援路线";
                break;
            case 'bncs':
                $('#kindInfo').html('避难场所');
                node = 9;
                initBncsInfo(evaluationid);
                title="避难场所";
                break;
            case 'yjdw':
                $('#kindInfo').html('救援队伍');
                node = 10;
                initJydwInfo(evaluationid);
                title="救援队伍";
                break;
            case 'yljg':
                $('#kindInfo').html('医疗资源');
                node = 11;
                initYlzyInfo(evaluationid);
                title="医疗资源";
                break;
            case 'yjwz':
                $('#kindInfo').html('物资装备');
                node = 12;
                initWzzbInfo(evaluationid);
                title="物资装备";
                break;
            case 'ysbz':
                $('#kindInfo').html('运输保障');
                node = 13;
                title="运输保障";
                initYsbzInfo(evaluationid);
                break;
            case 'txbz':
                $('#kindInfo').html('通信保障');
                node = 14;
                title="通信保障";
                initTxbzInfo(evaluationid);
                break;
            case 'yjzj':
                $('#kindInfo').html('应急专家');
                node = 15;
                title="应急专家";
                initYjzjInfo(evaluationid);
                break;
            case 'yjjg':
                $('#kindInfo').html('应急机构');
                node = 16;
                title="应急机构";
                initYjjgInfo(evaluationid);
                break;
            default:
                break;
        }
        $('.table-line').hide();
        $('#taskTable').show();
        $('#topTable'+node).show();
        reloadTaskGird(schemeid, node);
    });
    scrollResize();
    $('body').on('click','.infoHeader',function(){
    	var $kind = $(this).data('kind');
    	$('.infoHeader').removeClass('active');
    	$(this).addClass('active');
    	$('.topContent').hide();
    	$('.bottomContent').hide();
    	$("#"+$kind+"Content").show();
    	tableScrollResize();
    })
	$('#backBtn').on('click',function(){
		$('#planName').hide();
		$('.historyPlan').show();
		$('#newPlanBtn').show();
		//显示所有资源
		window.parent.showAllRes();
		tableScrollResize();
		scrollResize();
	})
	$("#backTaskBtn").on('click',function(){
		$("#sueTask").hide();
		$("#planName").show();
		scrollResize();
	})
	
	//新建方案按钮
    $("#newPlanBtn").off("click").on("click", function() {
    	var curEvnAnaId = parent.addEvnAnaGisOverLays(eventid, null, true);
    	$("#simulationid").val(curEvnAnaId);
    	var paraArr = $("#addSchemaForm").serializeArray();
    	paraArr = addId(eventid,paraArr);
    	for(var k in paraArr){
			if(paraArr[k].name == "evaluationid"){
				var evaluationid = paraArr[k].value;
				
			}
			if(paraArr[k].name == "forecastid"){
				var forecastid = paraArr[k].value;
			}
		}
    	$("#evaluationid").val(evaluationid);
    	$("#forecastid").val(forecastid);
    	
    	window.top.GEventObject.die("LOAD_EMS_AiPLAN_ADD_EVENT");
    	window.top.GEventObject.on("LOAD_EMS_AiPLAN_ADD_EVENT", function(param) {
    		//显示智能方案流程图
    		$("#aiPlanFlow").show();
    		$("#planName").show();
    		$('.historyPlan').hide();
    		$("#rwInfo").hide();
    		$("#saveBtn").show();
    		scrollResize();
    		//为新增的智能方案部分字段赋值
    		$("#schemename").val(param.schemename);
    		$("#scnameTitle").text(param.schemename);
			$("#schemecode").val(param.schemecode);

			//给当前新建方案id设为0,以便在方案新增页面但未点击保存按钮之前，该方案下的各个流程节点点击的方案id取值
			$("#schemeid").val("0");
			clickYjjy(eventid,"0");
//    		tableScrollResize();
			//地图加载最新的事故模拟覆盖物
			parent.addEvnAnaGisOverLays(eventid, null);
			//根据资源评估id,地图加载相应的覆盖物
			loadResource(evaluationid);
			//根据综合预测id,地图加载相应的覆盖物
			loadForecast(forecastid);
    	});
    	var index = layer.open({
    	      type: 2,
    	      title: '添加智能方案',
    	      shadeClose: false,
    	      shade: 0.3,
    		  maxmin: false, //开启最大化最小化按钮
    	      area: ['360px',"185px"],
    	      content:BASE_URL + "views/module/ems/emsmap/aiplan/addAiPlan/addAiPlan.html",
    	      success: function(layero){
    	    	 layer.setTop(layero); //开启多窗口时可以点击title能够切换至最高层
    	      }
    	});
    	layer.dialogArr.push(index);
    	//openWin(BASE_URL + "views/module/ems/emsmap/aiplan/addAiPlan/addAiPlan.html", "添加智能方案", "360px", "185px");
    });
//    任务下发按钮
    $("#issueTask").off("click").on("click", function() {
    	$('.historyPlan').hide();
    	$("#planName").hide();
		$("#saveBtn").hide();
		$("#sueTask").show();
		scrollResize();
    	//初始化任务下发所选目标下拉框
    	SelectTree.loadAiPlanTskOrgSelect("respTaskOrg");
    	//任务下发
    	$("#disTaskForm").validate({
    		rules: {
    			taskcontent: {
    				required: true,
    				maxlength: 1000
    			},
    			respTaskOrg: {
    				required: true
    			}
    		},
    		messages: {
    			taskcontent: {
    				required: "任务内容不能为空",
    				maxlength: "任务内容不能超过1000个字符"
    			},
    			respTaskOrg: {
    				required: "下发机构不能为空"
    			}
    		},
    		submitHandler: function(form) {
    			var param = [{"name": "schemeid", "value": $("#schemeid").val()},
    			             {"name": "taskreceiver", "value": $("input[name='respTaskOrgId']").val()},
    			             {"name": "node", "value": node},
    			             {"name": "taskcontent", "value": $("#taskcontent").val()}
    			             ];
    			$.ajax({
    				type: "post",
    				url: BASE_URL + "ems/emssucisstask/save",
    				data: param,
    				success: function(data) {
    					if (data.success == true ){
    						//刷新响应任务分页表格
    						parent.toast(data.msg);//弹出提示信息
    						$('.historyPlan').hide();
    						$("#sueTask").hide();
    						$("#planName").show();
    						$("#taskcontent").val("");
    						$("#respTaskOrg").attr("selectvalue", "");
    						reloadTaskGird($("#schemeid").val(), node);
    					}
    				}
    			});
    	    }   
    	});
    });

    //保存智能方案按钮
    $("#saveBtn").off("click").on("click", function() {
    	//最新事故模拟id
//		var curEvnAnaId = parent.addEvnAnaGisOverLays($("#eventid").val(), null, true);
//
//    	var paraArr = $("#addSchemaForm").serializeArray();
//    	paraArr = addId($("#eventid").val(),paraArr);
//    	paraArr.push({"name": "curEvnAnaId", "value": curEvnAnaId});   	
    	
    	$.ajax({
    		type: "post",
    		url: BASE_URL + "ems/emssucissscheme/save",
    		cache: false,
    		dataType: "json",
    		data: $("#addSchemaForm").serializeArray(),
    		success: function(data) {
    			if ("true" == data.msg) {
    				//隐藏保存按钮区域
        			$("#saveSchemaDiv").hide();
        			$("#newPlanBtn, #historyPlanBtn").show();//显示新建|历史按钮
        			
        			//给当前新保存的方案各参数赋值，以备后续使用
        			$("#schemeid").val(data.emsSucIssScheme.schemeid);
					$("#tasknode").val(data.emsSucIssScheme.tasknode);
//					$("#simulationid").val(curEvnAnaId);
					$("#plaid").val(data.emsSucIssScheme.plaid);
//					$("#evaluationid").val(data.emsSucIssScheme.evaluationid);
//					$("#forecastid").val(data.emsSucIssScheme.forecastid);
					
//					//地图加载最新的事故模拟覆盖物
//					parent.addEvnAnaGisOverLays(eventid, null);
//					//根据资源评估id,地图加载相应的覆盖物
//					loadResource(data.emsSucIssScheme.evaluationid);
//		    		//根据综合预测id,地图加载相应的覆盖物
//					loadForecast(data.emsSucIssScheme.forecastid);
											
    				parent.toast("保存成功！");
    				$("#saveBtn").hide();
    				$("#rwInfo").show();
    				
    				clickYjjy(eventid,data.emsSucIssScheme.schemeid);
    				reloadHisGird(eventid);
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
//    $("#cancelBtn").off("click").on("click", function() {
//    	//隐藏保存新方案按钮
//		$("#saveSchemaDiv").hide();
//		
//		//重新显示新增方案|历史按钮按钮
//		$("#newPlanBtn, #historyPlanBtn").show();
//		
//    	var lastschemeid =  $("#lastschemeid").val();
//    	 
//    	//判断点击新增方案按钮前时是否已有方案已在展示,有则将上一次历史方案参数加载出来
//    	if ("0" != lastschemeid) {
//    		//显示智能方案流程图
//    		$("#aiPlanFlow").show();
//    		
//    		$.ajax({
//        		type: "post",
//        		url: BASE_URL + "ems/emssucissscheme/getSchemaById",
//        		data: {"schemaId": lastschemeid},
//        		success: function(data) {
//        			if (data.emsSucIssScheme) {
//        				//为方案各参数赋值
//        	    		$("#schemeid").val(data.emsSucIssScheme.schemeid);
//        				$("#schemename").val(data.emsSucIssScheme.schemename);
//        				$("#schemecode").val(data.emsSucIssScheme.schemecode);
//        				$("#tasknode").val(data.emsSucIssScheme.tasknode);
//        				$("#eventid").val(data.emsSucIssScheme.eventid);
//        				$("#simulationid").val(data.emsSucIssScheme.simulationid);
//        				$("#plaid").val(data.emsSucIssScheme.plaid);
//        				$("#evaluationid").val(data.emsSucIssScheme.evaluationid);
//        				$("#forecastid").val(data.emsSucIssScheme.forecastid);
//        	    		$("#scnameTitle").text(data.emsSucIssScheme.schemename);
//        	    		
//        	    		//存储新增方案取消后所需要的上一次方案id
//        	    		$("#lastschemeid").val(data.emsSucIssScheme.schemeid);
//        	    		
//        	    		//回调修改遍历所有方案节点状态
//        	    		$(".aiPTskNodeBtn").each(function() {
//        					if (parseInt($(this).attr("data-node")) <= data.emsSucIssScheme.tasknode) {
//        						if ($(this).hasClass("btn-default")) {
//        							$(this).removeClass("btn-default");
//        							$(this).addClass("btn-warning");
//        						}
//        					} else {
//        						if ($(this).hasClass("btn-warning")) {
//        							$(this).removeClass("btn-warning");
//        							$(this).addClass("btn-default");
//        						}
//        					}
//        				});
//        			}
//        		},
//        		error: function() {
//        			parent.toast("系统正忙，请稍后再试！");
//        		}
//        	});
//    	} else {
//    		//如果新建方案之前是空方案记录时隐藏各流程按钮
//    		$("#aiPlanFlow").hide();
//    	}
//    });
    
});

//触发点击应急响应
function clickYjjy(eventid,schemeid){
    $('.leftTab ul li').removeClass('active');
    $("#yjxynbsh").addClass('active');
    $('.leftTab ul li').map(function () {
        var $kind = $(this).data('kind');
        if ($kind == 'next') {
        } else {
            $(this).find('img').attr('src', BASE_URL + '/images/ems/emsaiplan/icon_' + $kind + '2.png')
        }
    });
    $("#yjxynbsh").find('img').attr('src', BASE_URL + '/images/ems/emsaiplan/icon_yjxy1.png');
    $('.topContent').show();
	$('.bottomContent').hide();
	$("#kindInfo").addClass('active');
	$('#rwInfo').removeClass('active');
	$('.table-line').hide();
    $('#taskTable').show();
    $('#topTable1').show();
//	$("#topTable").empty();
//    $("#topTable").append(" <table id=\"respGrid-table\"></table>\n" +
//        " <div id=\"respGrid-pager\"></div>");
//    
//	$("#taskTable").empty();
//    $("#taskTable").append(" <table id=\"taskGrid-table\"></table>\n" +
//        " <div id=\"taskGrid-pager\"></div>");
//    
    $('#kindInfo').html('应急响应');
    var node = '1';
    initYjxyInfo(eventid);
    initTaskGird(schemeid, node);
	tableScrollResize();
}

//应急机构
function initYjjgInfo(evaluationid) {
    var colname = ["机构主键id","机构编号","机构名称","机构职责"],
        colmodel = [
            {
                name: "ORGID",
                index: "ORGID",
                width: "10%",
                align: "center",
                sortable: false,
                hidden: true
            },
            {
                name: "ORGNO",
                index: "ORGNO",
                width: "10%",
                align: "center",
                sortable: true
            },
            {
                name: "ORGNAME",
                index: "ORGNAME",
                width: "10%",
                align: "center",
                sortable: true
            },
            {
                name: "ORGDUTIES",
                index: "ORGDUTIES",
                width: "15%",
                align: "center",
                sortable: true,
                formatter : function(cellvalue, options, obj){
                	if(cellvalue == "" || cellvalue == null){
                		return "--";
                	} else {
                		return cellvalue;
                	}
                }
            }
        ];
//分页表格响应式处理
    var tableHeight = $(window).height() -187;
    $(window).resize(function () {
        $("#respGrid16-table").jqGrid('setGridHeight', $(window).height() -187);
        $("#respGrid16-table").jqGrid('setGridWidth', $(window).width() - 180);
    });
    $("#respGrid16-table").jqGrid({
        height: tableHeight,
        url: BASE_URL + "ems/emssucissscheme/loadResourceData",
        datatype: "json",
        cache: false,
        mtype: "POST",
        colNames: colname,
        colModel: colmodel,
        postData: {
            "evaluationid":evaluationid,
            "resourceType":"yjjg"
        },
        sortname: "ORGID",
        sortorder: "desc",
        viewrecords: true,
        pager: "#respGrid16-pager",
        jsonReader: {
            root: "datas",
            total: "total",
            page: "page",
            records: "records",
            repeatitems: false
        },
        rowNum: 10,
        rowList: [10, 20, 30],
        altRows: true,
        autowidth: true,
        scrollOffset: 1,
        loadComplete: function() {
            $("#respGrid16-table").jqGrid('setGridWidth', $(window).width() - 180);
            tableScrollResize();
        }
    });
}

//应急专家
function initYjzjInfo(evaluationid) {
    var colname = ["专家id","姓名","性别","联系电话"],
        colmodel = [
            {
                name: "EXPERTID",
                index: "EXPERTID",
                width: "10%",
                align: "center",
                sortable: false,
                hidden: true
            },
            {
                name: "NAME",
                index: "NAME",
                width: "10%",
                align: "center",
                sortable: true
            },
            {
                name: "SEX",
                index: "SEX",
                width: "10%",
                align: "center",
                sortable: true,
                formatter : function(cellvalue, options, obj){
                	if(obj.SEX == "0"){
                		return "男";
                	} else {
                		return "女";
                	}
                }
            },
            {
                name: "PHONE",
                index: "PHONE",
                width: "15%",
                align: "center",
                sortable: true
            }
        ];
//分页表格响应式处理
    var tableHeight = $(window).height() -187;
    $(window).resize(function () {
        $("#respGrid15-table").jqGrid('setGridHeight', $(window).height() -187);
        $("#respGrid15-table").jqGrid('setGridWidth', $(window).width() - 180);
    });

    $("#respGrid15-table").jqGrid({
        height: tableHeight,
        url: BASE_URL + "ems/emssucissscheme/loadResourceData",
        datatype: "json",
        cache: false,
        mtype: "POST",
        colNames: colname,
        colModel: colmodel,
        postData: {
            "evaluationid":evaluationid,
            "resourceType":"yjzj"
        },
        sortname: "EXPERTID",
        sortorder: "desc",
        viewrecords: true,
        pager: "#respGrid15-pager",
        jsonReader: {
            root: "datas",
            total: "total",
            page: "page",
            records: "records",
            repeatitems: false
        },
        rowNum: 10,
        rowList: [10, 20, 30],
        altRows: true,
        autowidth: true,
        scrollOffset: 1,
        loadComplete: function() {
            $("#respGrid15-table").jqGrid('setGridWidth', $(window).width() - 180);
            tableScrollResize();
        }
    });
}

//通讯保障
function initTxbzInfo(evaluationid) {
    var colname = ["通讯保障id","团队名称","主管单位","联系人"],
        colmodel = [
            {
                name: "FIRMID",
                index: "FIRMID",
                width: "10%",
                align: "center",
                sortable: false,
                hidden: true
            },
            {
                name: "FIRMNAME",
                index: "FIRMNAME",
                width: "10%",
                align: "center",
                sortable: true
            },
            {
                name: "CHARGEDEPT",
                index: "CHARGEDEPT",
                width: "10%",
                align: "center",
                sortable: true
            },
            {
                name: "CONTACTPER",
                index: "CONTACTPER",
                width: "15%",
                align: "center",
                sortable: true
            }
        ];
//分页表格响应式处理
    var tableHeight = $(window).height() -187;
    $(window).resize(function () {
        $("#respGrid14-table").jqGrid('setGridHeight', $(window).height() -187);
        $("#respGrid14-table").jqGrid('setGridWidth', $(window).width() - 180);
    });

    $("#respGrid14-table").jqGrid({
        height: tableHeight,
        url: BASE_URL + "ems/emssucissscheme/loadResourceData",
        datatype: "json",
        cache: false,
        mtype: "POST",
        colNames: colname,
        colModel: colmodel,
        postData: {
            "evaluationid":evaluationid,
            "resourceType":"txbz"
        },
        sortname: "UPDATETIME",
        sortorder: "desc",
        viewrecords: true,
        pager: "#respGrid14-pager",
        jsonReader: {
            root: "datas",
            total: "total",
            page: "page",
            records: "records",
            repeatitems: false
        },
        rowNum: 10,
        rowList: [10, 20, 30],
        altRows: true,
        autowidth: true,
        scrollOffset: 1,
        loadComplete: function() {
            $("#respGrid14-table").jqGrid('setGridWidth', $(window).width() - 180);
            tableScrollResize();
        }
    });
}

//运输保障
function initYsbzInfo(evaluationid) {
    var colname = ["运输工具id","运输工具编号","运输工具名称","存放地点"],
        colmodel = [
            {
                name: "TRANSTOOLID",
                index: "TRANSTOOLID",
                width: "10%",
                align: "center",
                sortable: false,
                hidden: true
            },
            {
                name: "TRANSTOOLCODE",
                index: "TRANSTOOLCODE",
                width: "10%",
                align: "center",
                sortable: true
            },
            {
                name: "TRANSTOOLNAME",
                index: "TRANSTOOLNAME",
                width: "10%",
                align: "center",
                sortable: true
            },
            {
                name: "DEPOSITPLACE",
                index: "DEPOSITPLACE",
                width: "15%",
                align: "center",
                sortable: true
            }
        ];
//分页表格响应式处理
    var tableHeight = $(window).height() -187;
    $(window).resize(function () {
        $("#respGrid13-table").jqGrid('setGridHeight', $(window).height() -187);
        $("#respGrid13-table").jqGrid('setGridWidth', $(window).width() - 180);
    });

    $("#respGrid13-table").jqGrid({
        height: tableHeight,
        url: BASE_URL + "ems/emssucissscheme/loadResourceData",
        datatype: "json",
        cache: false,
        mtype: "POST",
        colNames: colname,
        colModel: colmodel,
        postData: {
            "evaluationid":evaluationid,
            "resourceType":"ysbz"
        },
        sortname: "TRANSTOOLID",
        sortorder: "desc",
        viewrecords: true,
        pager: "#respGrid13-pager",
        jsonReader: {
            root: "datas",
            total: "total",
            page: "page",
            records: "records",
            repeatitems: false
        },
        rowNum: 10,
        rowList: [10, 20, 30],
        altRows: true,
        autowidth: true,
        scrollOffset: 1,
        loadComplete: function() {
            $("#respGrid13-table").jqGrid('setGridWidth', $(window).width() - 180);
            tableScrollResize();
        }
    });
}

//救援队伍
function initJydwInfo(evaluationid) {

    var colname = ["应急id","队伍名称","队伍类型","装备描述","特长"],
        colmodel = [
            {
                name: "TEAMID",
                index: "TEAMID",
                width: "10%",
                align: "center",
                sortable: false,
                hidden: true
            },
            {
                name: "TEAMNAME",
                index: "TEAMNAME",
                width: "10%",
                align: "center",
                sortable: true
            },
            {
                name: "TEAMTYPEID",
                index: "TEAMTYPEID",
                width: "10%",
                align: "center",
                sortable: true,
                formatter : function(cellvalue, options, obj){
                    return SelectOption.getTeamType(obj.TEAMTYPEID);
                }
            },
            {
                name: "EQUIPMENTDESC",
                index: "EQUIPMENTDESC",
                width: "15%",
                align: "center",
                sortable: true
            },
            {//使用“专业描述”字段
                name: "PROFESSIONDESC",
                index: "PROFESSIONDESC",
                width: "15%",
                align: "center",
                sortable: true
            }
        ];
//分页表格响应式处理
    var tableHeight = $(window).height() -187;
    $(window).resize(function () {
        $("#respGrid10-table").jqGrid('setGridHeight', $(window).height() -187);
        $("#respGrid10-table").jqGrid('setGridWidth', $(window).width() - 180);
    });

    $("#respGrid10-table").jqGrid({
        height: tableHeight,
        url: BASE_URL + "ems/emssucissscheme/loadResourceData",
        datatype: "json",
        cache: false,
        mtype: "POST",
        colNames: colname,
        colModel: colmodel,
        postData: {
        	"evaluationid":evaluationid,
            "resourceType":"jydw"
        },
        sortname: "FILLTIME",
        sortorder: "desc",
        viewrecords: true,
        pager: "#respGrid10-pager",
        jsonReader: {
            root: "datas",
            total: "total",
            page: "page",
            records: "records",
            repeatitems: false
        },
        rowNum: 10,
        rowList: [10, 20, 30],
        altRows: true,
        autowidth: true,
        scrollOffset: 1,
        loadComplete: function() {
            $("#respGrid10-table").jqGrid('setGridWidth', $(window).width() - 180);
            tableScrollResize();
        }
    });
}

//避难场所
function initBncsInfo(evaluationid) {
    var colname = ["主键id","避难场所名称","防护目标类型","地址","可容纳人数","经度","维度"],
        colmodel = [
            {
                name: "SHELTERID",
                index: "SHELTERID",
                width: "5%",
                align: "center",
                sortable: false,
                hidden: true
            },
            {
                name: "SHELTERNAME",
                index: "SHELTERNAME",
                width: "10%",
                align: "center",
                sortable: false,
            },
            {
                name: "RESOURCETYPENAME",
                index: "RESOURCETYPENAME",
                width: "15%",
                align: "center",
                sortable: false
            },
            {
                name:'ADDRESS',
                index:'ADDRESS',
                width:'10%',
                align: "center",
                sortable: false
            },
            {
                name:'PERSONNUM',
                index:'PERSONNUM',
                width:'10%',
                align: "center",
                sortable: false
            },
            {
                name: "LONGITUDE",
                index: "LONGITUDE",
                width: "15%",
                align: "center",
                sortable: false,
                hidden: true
            },
            {
                name: "LATITUDE",
                index: "LATITUDE",
                width: "15%",
                align: "center",
                sortable: false,
                hidden: true
            }
        ];
//分页表格响应式处理
    var tableHeight = $(window).height() -187;
    $(window).resize(function () {
        $("#respGrid9-table").jqGrid('setGridHeight', $(window).height() -187);
        $("#respGrid9-table").jqGrid('setGridWidth', $(window).width() - 180);
    });

    $("#respGrid9-table").jqGrid({
        height: tableHeight,
        url: BASE_URL + "ems/emssucissscheme/loadResourceData",
        datatype: "json",
        cache: false,
        mtype: "POST",
        colNames: colname,
        colModel: colmodel,
        postData: {
            "evaluationid":evaluationid,
            "resourceType":"bncs"
        },
        sortname: "CREATETIME",
        sortorder: "desc",
        viewrecords: true,
        pager: "#respGrid9-pager",
        jsonReader: {
            root: "datas",
            total: "total",
            page: "page",
            records: "records",
            repeatitems: false
        },
        rowNum: 10,
        rowList: [10, 20, 30],
        altRows: true,
        autowidth: true,
        scrollOffset: 1,
        loadComplete: function() {
            $("#respGrid9-table").jqGrid('setGridWidth', $(window).width() - 180);
            tableScrollResize();
        }
    });
}

//医疗机构
function initYlzyInfo(evaluationid) {
    var colname = [ "主键id", "医疗机构名称", "医疗机构类型", "医疗机构等级", "经度", "维度" ], colmodel = [
        {
            name : "DEPTID",
            index : "DEPTID",
            width : "5%",
            align : "center",
            sortable : false,
            hidden : true
        }, {
            name : "DEPTNAME",
            index : "DEPTNAME",
            width : "15%",
            align : "center",
            sortable : false,

        }, {
            name : "RESOURCETYPENAME",
            index : "RESOURCETYPENAME",
            width : "15%",
            align : "center",
            sortable : false
        }, {
            name : "DEPTGRADENAME",
            index : "DEPTGRADENAME",
            width : "15%",
            align : "center",
            sortable : false
        }, {
            name : "LONGITUDE",
            index : "LONGITUDE",
            width : "15%",
            align : "center",
            sortable : false,
            hidden : true
        }, {
            name : "LATITUDE",
            index : "LATITUDE",
            width : "15%",
            align : "center",
            sortable : false,
            hidden : true
        } ];
    //分页表格响应式处理
    var tableHeight = $(window).height() -187;
    $(window).resize(function () {
        $("#respGrid11-table").jqGrid('setGridHeight', $(window).height() -187);
        $("#respGrid11-table").jqGrid('setGridWidth', $(window).width() - 180);
    });

    $("#respGrid11-table").jqGrid({
        height: tableHeight,
        url: BASE_URL + "ems/emssucissscheme/loadResourceData",
        datatype: "json",
        cache: false,
        mtype: "POST",
        colNames: colname,
        colModel: colmodel,
        postData: {
        	"evaluationid":evaluationid,
            "resourceType":"ylzy"
        },
        sortname: "CREATETIME",
        sortorder: "desc",
        viewrecords: true,
        pager: "#respGrid11-pager",
        jsonReader: {
            root: "datas",
            total: "total",
            page: "page",
            records: "records",
            repeatitems: false
        },
        rowNum: 10,
        rowList: [10, 20, 30],
        altRows: true,
        autowidth: true,
        scrollOffset: 1,
        loadComplete: function() {
            $("#respGrid11-table").jqGrid('setGridWidth', $(window).width() - 180);
            tableScrollResize();
        }
    });
}

//物资装备
function initWzzbInfo(evaluationid) {

    var colname = [ "仓库id", "资源名称", "资源类型", "主管单位", "库容"];
    colmodel = [ {
        name : 'EMSDEPOSID',
        index : 'EMSDEPOSID',
        width : '5%',
        align : "center",
        sortable : false,
        hidden : true
    }, {
        name : 'STOREHOUSE',
        index : 'STOREHOUSE',
        width : '5%',
        align : "center",
        sortable : false
    }, {
        name : 'MATERIALTYPE',
        index : 'MATERIALTYPE',
        width : '5%',
        align : "center",
        sortable : false,
        formatter : function(cellvalue, options, obj) {
            return SelectOption.getMaeMaterialtype(obj.MATERIALTYPE);
        }
    }, {
        name : 'MEASURE',
        index : 'MEASURE',
        width : '5%',
        align : "center",
        sortable : false
    }, {
        name : 'CAPACITY',
        index : 'CAPACITY',
        width : '5%',
        align : "center",
        sortable : false
    }];

    //分页表格响应式处理
    var tableHeight = $(window).height() -187;
    $(window).resize(function () {
        $("#respGrid12-table").jqGrid('setGridHeight', $(window).height() -187);
        $("#respGrid12-table").jqGrid('setGridWidth', $(window).width() - 180);
    });

    $("#respGrid12-table").jqGrid({
        height: tableHeight,
        url: BASE_URL + "ems/emssucissscheme/loadResourceData",
        datatype: "json",
        cache: false,
        mtype: "POST",
        colNames: colname,
        colModel: colmodel,
        postData: {
        	"evaluationid":evaluationid,
            "resourceType":"wzzb"
        },
        sortname: "FILLTIME",
        sortorder: "desc",
        viewrecords: true,
        pager: "#respGrid12-pager",
        jsonReader: {
            root: "datas",
            total: "total",
            page: "page",
            records: "records",
            repeatitems: false
        },
        rowNum: 10,
        rowList: [10, 20, 30],
        altRows: true,
        autowidth: true,
        scrollOffset: 1,
        loadComplete: function() {
            $("#respGrid12-table").jqGrid('setGridWidth', $(window).width() - 180);
            tableScrollResize();
        }
    });
}

//撤离路线
function initLxInfo(forecastid,lxtype,lxname) {
    //生成撤离路线列表分页表格
    var colname = ["主键",lxname,"开始经度","开始纬度"],
        colmodel = [
            {
                name: "ROUTEID",
                index: "ROUTEID",
                sortable: false,
                hidden: true
            },
            {
                name: "ROUTENAME",
                index: "ROUTENAME",
                width: "100%",
                align: "left",
                sortable: false,
                align: "center",
                formatter:function(cellvalue, options, obj) {
                    if (obj.ROUTENAME) {
                        return cellvalue;
                    } else {
                        return "";
                    }
                }
            },
            {
                name: "STARTLON",
                index: "STARTLON",
                sortable: false,
                hidden: true
            },
            {
                name: "STARTLAT",
                index: "STARTLAT",
                sortable: false,
                hidden: true
            }
        ];

    //分页表格响应式处理
    var tableHeight = $(window).height() -187;
    if(lxtype == 0){
    	$(window).resize(function () {
            $("#respGrid7-table").jqGrid('setGridHeight', $(window).height() -187);
            $("#respGrid7-table").jqGrid('setGridWidth', $(window).width() - 180);
        });
        $("#respGrid7-table").jqGrid({
            height: tableHeight,
            url: BASE_URL + "ems/emssucissscheme/loadroutelist",
            datatype: "json",
            cache: false,
            mtype: "POST",
            sortname: "ROUTEID",
            sortorder: "desc",
            colNames: colname,
            colModel: colmodel,
            postData: {
                "forecastid":forecastid,
                "routetype":lxtype//撤离路线
            },
            viewrecords: true,
            pager: "#respGrid7-pager",
            jsonReader: {
                root: "datas",
                total: "total",
                page: "page",
                records: "records",
                repeatitems: false
            },
            rowNum: 10,
            rowList: [10, 20, 30],
            altRows: true,
            autowidth: true,
            scrollOffset: 1,
            loadComplete: function() {
                $("#respGrid7-table").jqGrid('setGridWidth', $(window).width() - 180);
                tableScrollResize();
            }
        });
    }
    else{
    	$(window).resize(function () {
            $("#respGrid8-table").jqGrid('setGridHeight', $(window).height() -187);
            $("#respGrid8-table").jqGrid('setGridWidth', $(window).width() - 180);
        });
        $("#respGrid8-table").jqGrid({
            height: tableHeight,
            url: BASE_URL + "ems/emssucissscheme/loadroutelist",
            datatype: "json",
            cache: false,
            mtype: "POST",
            sortname: "ROUTEID",
            sortorder: "desc",
            colNames: colname,
            colModel: colmodel,
            postData: {
                "forecastid":forecastid,
                "routetype":lxtype//撤离路线
            },
            viewrecords: true,
            pager: "#respGrid8-pager",
            jsonReader: {
                root: "datas",
                total: "total",
                page: "page",
                records: "records",
                repeatitems: false
            },
            rowNum: 10,
            rowList: [10, 20, 30],
            altRows: true,
            autowidth: true,
            scrollOffset: 1,
            loadComplete: function() {
                $("#respGrid8-table").jqGrid('setGridWidth', $(window).width() - 180);
                tableScrollResize();
            }
        });
    }
}

//道路封锁
function initDlfsInfo(forecastid) {
    $.ajax({
        type: "post",
        url: BASE_URL + "ems/emssucissscheme/loadroadblocklist",
        dataType: "json",
        async: false,
        data: {
        	forecastid: forecastid
        },
        success: function (data) {
        	$("#topTable6").empty();
            if (data.blockList && data.blockList.length>0) {
            	console.log(data);
                $("#topTable6").append("<table id='roadTable' class='table table-bordered'><tr><td >道路名称</td><td>封锁点经度</td><td>封锁点纬度</td></tr>");
                _.each(data.blockList, function (item) {
                    $("#roadTable").append("<tr><td >" + item.roadname + "</td><td>" + item.roadlon + "</td><td>" + item.roadlat + "</td></tr>");
                });
                $("#topTable6").append("</table>");
            } else {
            	$("#topTable6").append("在事发影响范围内无道路封锁");
            }
        },
        error: function () {
            parent.toast("初始化信息加载失败");
        }
    });
}

//警戒区
function initJjqInfo(forecastid) {
    $.ajax({
        type: "post",
        url: BASE_URL + "ems/emssucissscheme/loadzonelist",
        dataType: "json",
        async: false,
        data: {
        	forecastid: forecastid
        },
        success: function (data) {
        	$("#topTable5").empty();
            if (data.zone) {
                $("#topTable5").append("在事发影响范围内设立(" + data.zone.zonename + ")警戒区，警戒区影响面积为(" + data.zone.acreage + ")平方千米。");
            } else {
            	$("#topTable5").append("在事发影响范围内未设立警戒区");
            }
        },
        error: function () {
            parent.toast("初始化信息加载失败");
        }
    });
}

//事态控制策略
function initStkzclInfo(forecastid) {
    $.ajax({
        type: "post",
        url: BASE_URL + "ems/emssucigrforecast/load",
        dataType: "json",
        async: false,
        data: {
        	forecastid: forecastid
        },
        success: function (data) {
            if (data) {
                $("#topTable4").empty();

                $("#topTable4").append(data.eventcontrol || "没有事态控制策略");
            }
        },
        error: function () {
            parent.toast("初始化信息加载失败");
        }
    });
}

//组建指挥部
function initZjZhbGrid(eventid) {
    //根据schemaId在窗口上面区域查询最新的组建指挥部内容------------------start-----------------------------------------
    var colnames = ['机构id', '编号', '名称', '行政区域', '机构职责', '内设部门', '机构成员', '地图定位', '所属单位'];
    var colmodels = [
        {name: 'ORGID', index: 'ORGID', width: '5%', hidden: true},
        {name: 'ORGNO', index: 'ORGNO', width: '7%', align: 'left'},
        {
            name: 'ORGNAME', index: 'ORGNAME', width: '15%', align: 'left'
//            	,
//            formatter: function (cellvalue, options, obj) {
//                return '<a href="javascript:void(0);" onclick="displayOrg(\'' + obj.ORGID + '\')">' + obj.ORGNAME + '</a>';
//            }
        },
        {name: 'DISTRICTNAME', index: 'DISTRICTNAME', width: '15%', align: 'left'},
        {name: 'ORGDUTIES', index: 'ORGDUTIES', width: '25%', align: 'center'},
        {
            name: 'DEPTCOUNT', index: 'DEPTCOUNT', width: '10%', align: 'center', hidden: true
            // formatter:function(cellvalue, options, obj) {
            // return '<a href="javascript:void(0);" onclick="displayDepts(\''+obj.ORGID+'\')">'+obj.DEPTCOUNT+'</a>';
            // }
        },
        {
            name: 'USERCOUNT', index: 'USERCOUNT', width: '10%', align: 'center', hidden: true
            // formatter:function(cellvalue, options, obj) {
            // return '<a href="javascript:void(0);" onclick="displayUsers(\''+obj.ORGID+'\')">'+obj.USERCOUNT+'人</a>';
            // }
        },
        {
            name: 'LONGITUDE', index: 'LONGITUDE', width: '10%', align: 'center',
            formatter: function (cellvalue, options, obj) {
                if (obj.LONGITUDE && obj.LATITUDE) {
                    return '<a href="javascript:void(0);" onclick="loactionGIS(\'' + obj.LONGITUDE + '\',\'' + obj.LATITUDE + '\',\'' + obj.DISTRICTID + '\')">已定位</a>';
                } else {
                    return '未定位';
                }
            }, hidden: true
        },
        {name: 'UNITNAME', index: 'UNITNAME', width: '15%', align: 'left'}
    ];

    var tableHeight = $(window).height() -187;
    $(window).resize(function () {
        $("#respGrid2-table").jqGrid('setGridHeight', $(window).height() -187);
        $("#respGrid2-table").jqGrid('setGridWidth', $(window).width() - 180);
    });

    $("#respGrid2-table").jqGrid({
        height: tableHeight,
        url: BASE_URL + "ems/emsplaorg/orglist",
        datatype: "json",
        cache: false,
        mtype: 'post',
        colNames: colnames,
        colModel: colmodels,
        postData: {
            "eventid": eventid
        },
        sortname: 'ORGNO',
        sortorder: "asc",
        viewrecords: true,
        pager: "#respGrid2-pager",
        jsonReader: {
            root: "datas",
            total: "total",
            page: "page",
            records: "records",
            repeatitems: false
        },
        rowNum: 10,
        rowList: [10, 20, 30],
        altRows: true,
//        multiselect: true,
        autowidth: true,
        scrollOffset: 1,
        loadComplete: function () {
            $("#respGrid2-table").jqGrid('setGridWidth', $(window).width() - 180);
            tableScrollResize();
        }
    });
    //--------------------------------end--------------------------------------------------------------------------

}

//次生事件
function initCsshGrid(eventid) {
    //根据schemaId在窗口上面区域查询最新的次生事件内容------------------start-----------------------------------------
    var colname = ['事故ID', '事故类型', '事故名称', '可能后果', '现场处理方案'];
    var colmodel = [
        {name: 'proaccid', index: 'proaccid', hidden: true},
        {name: 'eventtypeid', index: 'eventtypeid', align: 'left', hidden: true},
        {
            name: 'accidentname', index: 'accidentname', align: 'left'
//            	,
//            formatter: function (cellvalue, option, obj) {
//                return "<a href = 'javascript:void(0)' onclick='displayEmsProcc(\"" + obj.proaccid + "\")'>" + obj.accidentname + "</a>";
//            }
        },
        {name: 'probeconseq', index: 'probeconseq', align: 'left'},
        {name: 'acchandes', index: 'acchandes', align: 'left'}
    ];

    var tableHeight = $(window).height() -187;
    $(window).resize(function () {
        $("#respGrid3-table").jqGrid('setGridHeight', $(window).height() -187);
        $("#respGrid3-table").jqGrid('setGridWidth', $(window).width() - 180);
    });

    var searchParamJson = {"eventid": eventid};

    var searchParam = {"searchParamJson": JSON.stringify(searchParamJson)};

    $("#respGrid3-table").jqGrid({
        height: tableHeight,
        url: BASE_URL + "/ems/emsplaproacc/proacclist",
        datatype: "json",
        cache: false,
        mtype: 'get',
        colNames: colname,
        colModel: colmodel,
        postData: searchParam,
        sortname: 'UPDATETIME',
        sortorder: "desc",
        viewrecords: true,
        pager: "#respGrid3-pager",
        jsonReader: {
            root: "datas",
            total: "total",
            page: "page",
            records: "records",
            repeatit: false
        },
        rowNum: 10,
        rowList: [10, 20, 30],
        altRows: true,
        multiselect: true,
        autowidth: true,
        scrollOffset: 1,
        loadComplete: function () {
            $("#respGrid3-table").jqGrid('setGridWidth', $(window).width() - 180);
            tableScrollResize();
        }
    });
    //--------------------------------end--------------------------------------------------------------------------

}


/**
 * 初始化加载当前方案下的任务分页表格
 * @param schemaId
 */
function initTaskGird(schemaId, node) {
    var colname = ['主键', '方案ID', '方案节点', '接收人id', '接收人', '下发时间', '完成时间', '任务状态', '任务跟踪', '任务内容'];
    var colmodel = [
        {name: 'TASKID', index: 'TASKID', width: '5%', hidden: true},
        {name: 'SCHEMEID', index: 'SCHEMEID', width: '5%', hidden: true},
        {name: 'NODE', index: 'NODE', width: '5%', hidden: true},
        {name: 'TASKRECEIVER', align: 'center', index: 'TASKRECEIVER', width: '5%', hidden: true},
        {name: 'RECEIVERNAME', align: 'center', index: 'RECEIVERNAME', width: '20%'},
        {
            name: 'RECEIVETIME', align: 'center', index: 'RECEIVETIME', formatter: function (cellvalue, options, obj) {
                return getFormatDateByLong(cellvalue, "yyyy-MM-dd hh:mm:ss");
            }, width: '20%'
        },
        {
            name: 'FINISHTIME', align: 'center', index: 'FINISHTIME', formatter: function (cellvalue, options, obj) {
                if (cellvalue) {
                    return getFormatDateByLong(cellvalue, "yyyy-MM-dd hh:mm:ss");
                } else {
                    return "-";
                }
            }, width: '5%', hidden: true
        },
        {
            name: 'TASKSTATUS',
            align: 'center',
            index: 'TASKSTATUS',
            width: '15%',
            formatter: function (cellvalue, options, obj) {
                if ("0" == cellvalue) {
                    return "未开始";
                } else if ("1" == cellvalue) {
                    return "进行中";
                } else if ("2" == cellvalue) {
                    return "已完成";
                }
            }
        },
        {
            name: '', width: '30%', align: 'center', formatter: function (cellvalue, options, obj) {
                return '<a style="margin-right:10px;" href="javascript:void(0);" onclick="checkTask(\'' + obj.TASKID + '\')">查看</a>'+
                	'<a href="javascript:void(0);" onclick="traceTask(\'' + obj.TASKID + '\',\'' + obj.TASKRECEIVER + '\')">跟踪</a>';
            }
        },
        {name: 'TASKCONTENT', index: 'TASKCONTENT', width: '5%', hidden: true}
    ];

    var tableHeight = $(window).height() - 225;
    $(window).resize(function () {
        $("#taskGrid-table").jqGrid('setGridHeight', $(window).height() - 225);
        $("#taskGrid-table").jqGrid('setGridWidth', $(window).width() - 180);
    });

    $("#taskGrid-table").jqGrid({
        height: tableHeight,
        url: BASE_URL + "ems/emssucisstask/list",
        datatype: "json",
        cache: false,
        mtype: 'post',
        colNames: colname,
        colModel: colmodel,
        postData: {
            "schemaId": schemaId,
            "curNode": node
        },
        sortname: 'RECEIVETIME',
        sortorder: "desc",
        viewrecords: true,
        pager: "#taskGrid-pager",
        jsonReader: {
            root: "datas",
            total: "total",
            page: "page",
            records: "records",
            repeatitems: false
        },
        rowNum: 10,
        rowList: [10, 20, 30],
        altRows: true,
        rownumbers: false,
//        rownumWidth: 40,
        scroll: false,
        multiselect: false,
        //caption: "应急队伍列表",
        autowidth: true,
        scrollOffset: 1,
        loadComplete: function () {
            $("#taskGrid-table").jqGrid('setGridWidth', $(window).width() - 180);
            tableScrollResize();
        }
    });
}

//应急响应
function initYjxyInfo(eventid) {
    var colname = ['主键id', '预案id', '分级响应名称', '分级标准', '应急响应信息'];
    var colmodel = [
        {name: 'responseid', index: 'responseid', hidden: true},
        {name: 'planid', index: 'planid', hidden: true},
        {
            name: 'responsename', index: 'responsename'
//            	,
//            formatter: function (cellvalue, options, obj) {
//                return '<a href="javascript:void(0);" onclick="displayResp(\'' + obj.responseid + '\')">' + obj.responsename + '</a>';
//            }
        },
        {name: 'standard', index: 'standard'},
        {name: 'responsemsg', index: 'responsemsg'}
    ];

    var tableHeight = $(window).height() - 187;
    $(window).resize(function () {
        $("#respGrid1-table").jqGrid('setGridHeight', $(window).height() - 187);
        $("#respGrid1-table").jqGrid('setGridWidth', $(window).width() - 180);
    });

    $("#respGrid1-table").jqGrid({
        height: tableHeight,
        url: BASE_URL + "ems/emsplaresponse/resplist",
        datatype: "json",
        cache: false,
        mtype: 'post',
        colNames: colname,
        colModel: colmodel,
        postData: {
            "eventid": eventid
        },
        sortname: 'ordernum',
        sortorder: "asc",
        viewrecords: true,
        pager: "#respGrid1-pager",
        jsonReader: {
            root: "datas",
            total: "total",
            page: "page",
            records: "records",
            repeatitems: false
        },
        rowNum: 10,
        rowList: [10, 20, 30],
        altRows: true,
        multiselect: false,
        width: "100%",
        autowidth: true,
        scrollOffset: 1,
        loadComplete: function () {
            $("#respGrid1-table").jqGrid('setGridWidth', $(window).width() - 180);
            tableScrollResize();
        }
    });
    //------------------------------------end--------------------------------------------------------------------------

}

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
//function popAiPlanTskNodeWin(param) {
//	var schemaId = $("#schemeid").val(),
//		isDisTask = "0", //0:不派遣任务  1：派遣任务
//		isCallBack = "0",//0:不回调  1：需要回调来更改方案节点颜色状态
//		$clkBtn = $("#" + param.btnId);//当前点击按钮jQuery对象
//	
//	//当点击时处于非新建方案页面时
//	if ("0" != schemaId) {
//		var nextTskNode = parseInt($("#tasknode").val()) + 1,
//			curClkNode = parseInt($clkBtn.attr("data-node"));
////		alert("nextTskNode" + nextTskNode);
////		alert("curClkNode" + curClkNode);
//		if (nextTskNode == curClkNode) {
//			//当当前点击节点等于 当前方案节点值+1 时，既需要派遣任务，也需要回调更改页面节点颜色状态
//			isDisTask = "1";
//			isCallBack = "1";
//			
//			//定义回调弹出应急响应窗口关闭后的回调事件
//			window.top.GEventObject.die("EMS_AiPLAN_TASKNODECLK_EVENT");
//	    	window.top.GEventObject.on("EMS_AiPLAN_TASKNODECLK_EVENT", function(param) {
//				//更改当前方案的运行节点状态
//				$.ajax({
//		    		type: "post",
//		    		url: BASE_URL + "ems/emssucissscheme/updateByParam",
//		    		data: {"schemeid": schemaId, "tasknode": curClkNode},
//		    		success: function(data) {
//		    			if (data.success == true) {
//		    				//更改当前节点的状态为激活状态
//		    				$clkBtn.removeClass("btn-default");
//		    				$clkBtn.addClass("btn-warning");
//							
//							//更新当前方案点位状态
//							$("#tasknode").val(curClkNode);
//		    			}
//		    		}
//				});
//				
//	    	});
//		} else if (nextTskNode > curClkNode) {
//			//当当前点击节点 小于 当前方案节点值+1 时，只需要派遣任务
//			isDisTask = "1";
//		} 
//	}
//	
//	//url前缀
//	var urlPrefix = BASE_URL + param.url + "?isDisTask=" + isDisTask + "&isCallBack=" + 
//					isCallBack + "&schemaId=" + $("#schemeid").val();
//	
//	//拼接参数
//	if (param.paraArr && 0 < param.paraArr.length) {
//		_.map(param.paraArr, function(para, i) {
//			urlPrefix += ("&" + para.name + "=" + para.value);
//		});
//	} 
//	console.log(urlPrefix);
//	//打开节点弹窗
//	openWin(urlPrefix, param.title, param.width, param.height);
//}

/**
 * 根据任务id弹出相应的任务下的消息通信窗口
 *
 * @param taskId
 */
function traceTask(taskId, receiver) {
    openWin(
            BASE_URL
            + "views/module/ems/emsmap/aiplan/common/aiPlanNodeTskTrace.html?taskId="
            + taskId + "&receiver=" + receiver, "任务跟踪", "50%",
            "66%");
}

function checkTask(taskId){
	var index = layer.open({
	      type: 2,
	      title: "任务详情",
	      shadeClose: false,
	      shade: 0,
		  maxmin: true, //开启最大化最小化按钮
	      area: ["450px","270px"],
	      content:BASE_URL + "views/module/ems/emsmap/aiplan/common/checkTask.html?taskId=" + taskId,
	      success: function(layero){
	    	 layer.setTop(layero); //开启多窗口时可以点击title能够切换至最高层
	      }
	    });
	    layer.dialogArr.push(index);
//    openWin(
//            BASE_URL
//            + "views/module/ems/emsmap/aiplan/common/checkTask.html?taskId="
//            + taskId, "任务详情", "450px","250px");
}

function reloadTaskGird(schemeid, node) {
    $("#taskGrid-table").jqGrid("setGridParam", {
        page: 1,
        postData: {
        	schemaId: schemeid,
        	curNode: node
        }
    }).trigger("reloadGrid");
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
//刷新滚动条
function scrollResize() {
    $('.leftTab').niceScroll({
        cursorborder: "#4d86d6",
        cursorcolor: "#4d86d6",
        cursoropacitymax: 1,
        background: false,
        autohidemode: false
    }).resize();
}