$(function () {
	initSeachInput();
	//定义所有联动echarts图标存储工具类
	window.allEchartsDic = new MapUtil();
	//初始化默认时间为上一月
	var nowDate = new Date(),
	curYear = nowDate.getFullYear(),
	lastMon = nowDate.getMonth() ;
	//如果month=0，年份为上一年。
	if(lastMon==0){
		lastMon = "12";
		curYear = curYear - 1;
	}
	if(lastMon<10){
		lastMon="0"+lastMon;
	}
	var lastEvaDate = curYear+"-"+lastMon;
	$("#noticetime").val(lastEvaDate);
	//刷新柱状图数据
	freshAllGraph(window.allEchartsDic);
	reloadGrid();
		
	//显示操作权限按钮
	$("#tableOpers").displayOper();
    //生成任务列表分页表格
    var colname = ["公告id","企业id","企业名称",'综合得分',"诚信级别","执法次数","罚款金额(元)","诚信评价","不良信用个数", "隐患数","黑名单","红名单"],
        colmodel = [
            {
                name: "NOTICEID",
                index: "NOTICEID",
                width: "10%",
                align: "center",
                sortable: false,
                hidden: true
            },
            {
                name: "BUSINESSINFOID",
                index: "BUSINESSINFOID",
                width: "10%",
                align: "center",
                sortable: false,
                hidden: true
            },
            {
            	name: "ENTNAME",
            	index: "ENTNAME",
            	width: "20%",
            	align: "center",
            	sortable: false,
            	formatter: function (cellvalue, options, obj) {
            		return '<a href="javascript:void(0);" onclick="display(\''+obj.NOTICEID+'\')">'+obj.ENTNAME+'</a>';
            	}
            },
            {
            	name: "FINASCORE",
            	index: "FINASCORE",
            	width: "10%",
            	align: "center",
            	sortable: true,
            	formatter: function (cellvalue, options, obj) {
            		if(cellvalue==null||cellvalue==""){
            			return '<a href="javascript:void(0);" onclick="addNoticeScore(\'' + obj.NOTICEID + '\')">点击打分</a>';
            		}else{
            			return cellvalue;
            		}
            		
            	}
            	
            },
            {
            	name: "HONESTYLEVEL",
            	index: "HONESTYLEVEL",
            	width: "10%",
            	align: "center",
            	sortable: true
            },
            {
            	name: "LAWENFORCECOUNT",
            	index: "LAWENFORCECOUNT",
            	width: "10%",
            	align: "center",
            	sortable: true
            },
            {
            	name: "PUNISHMENTAMOUNT",
            	index: "PUNISHMENTAMOUNT",
            	width: "10%",
            	align: "center",
            	sortable: true
            	
            },
            {
            	name: "INTEGRITYAVERAGE",
            	index: "INTEGRITYAVERAGE",
            	width: "10%",
            	align: "center",
            	sortable: false
            },
            {
            	name: "BADCREDITCOUNT",
            	index: "BADCREDITCOUNT",
            	width: "5%",
            	align: "center",
            	sortable: true
            },
            {
            	name: "HIDDENDANGERCOUNT",
            	index: "HIDDENDANGERCOUNT",
            	width: "5%",
            	align: "center",
            	sortable: true
            },
            {
            	name: "ISBLACK",
            	index: "ISBLACK",
            	width: "5%",
            	align: "center",
            	sortable: false,
            	formatter : function(cellvalue, options, obj) {
            		if(cellvalue=="0"){
            			return '是';
            		}else if(cellvalue=="1"){
            			return '否';
            		}else{
            			return '--';
            		}
        		}
            },
            {
            	name: "ISRED",
            	index: "ISRED",
            	width: "5%",
            	align: "center",
            	sortable: false,
            	formatter : function(cellvalue, options, obj) {
            		if(cellvalue=="0"){
            			return '是';
            		}else if(cellvalue=="1"){
            			return '否';
            		}else{
            			return '--';
            		}
        		}
            }
        ];
    
  //分页表格响应式处理
    var tableHeight = $(window).height() - $(".pcheck").height() - 190 - 33;
    $(window).resize(function () {
        $("#grid-table").jqGrid("setGridHeight", $(window).height() - $('.pcheck').height() - 190 - 33);
        $("#grid-table").jqGrid("setGridWidth", $(window).width() * 0.99);
    });

    $("#grid-table").jqGrid({
        height: tableHeight,
        url: BASE_URL + "ecs/ecsnotice/list",
        datatype: "json",
        cache: false,
        mtype: "POST",
        colNames: colname,
        colModel: colmodel,
        postData: {
        	"noticetime": $("#noticetime").val(),
        	"entname":$("#entname").val()
        },
        sortname: "FINASCORE",
        sortorder: "desc nulls last",
        viewrecords: true,
        pager: "#grid-pager",
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
        multiselect: true,
        caption: "诚信公告列表",
        autowidth: true
    });

  //点击查询
//    $("#searchbtn").off("click").on("click",function(){
//    	if($("#noticetime").val()==""||$("#noticetime").val()==null){
//    		parent.toast("查询时间不能为空！");
//    		return false;
//    	}
//    	//刷新柱状图数据
//		freshAllGraph(window.allEchartsDic);
//    	reloadGrid();
//    });
//    
//    /*重置*/
//    $("#resetbtn").bind("click",function(){
//    	$("#noticetime").val("");
//    });
    
});
	
function resetData(){
	$("#noticetime").val("");
	$("#entname").val("");
}

function seach(){
	if($("#noticetime").val()==""||$("#noticetime").val()==null){
		parent.toast("查询时间不能为空！");
		return false;
	}
	//刷新柱状图数据
	freshAllGraph(window.allEchartsDic);
	reloadGrid();
}


/**
 * 获取所有默认图表信息数据
 */
function freshAllGraph(allEchartsDic) {
	loadAllGraphData(allEchartsDic, function(param, data){
		//渲染诚信公告图表展示
		renderNoticeGraph(allEchartsDic, param, data);
	});
}

/**
 * 数据库查询最新所有图标数据信息
 * @param allEchartsDic
 * @param callBack
 */
function loadAllGraphData (allEchartsDic, callBack) {
	//服务端查询最新图表所需数据
	$.ajax({
		type : "post",
		url : BASE_URL + "ecs/ecsnotice/loadnoticedata",
		data : {"noticetime":$("#noticetime").val()},
		success : function(data) {
			callBack({"noticetime":$("#noticetime").val()}, data);
		},
		error : function() {
			parent.toast("初始化信息加载失败!");
		}
	});
}


/**
 * 加载企业诚信图表数据
 * @param allEchartsDic
 * @param graphData
 * @returns
 */
function renderNoticeGraph(allEchartsDic, param, graphData) {
	var noticeLevelPie = allEchartsDic.get("noticeLevelPie"),
		noticeRangeBar = allEchartsDic.get("noticeRangeBar");
	
	if (!noticeLevelPie && !noticeRangeBar) {
		noticeLevelPie = echarts.init(document.getElementById("noticeLevelPie"));
		noticeRangeBar = echarts.init(document.getElementById("noticeRangeBar"));
		allEchartsDic.put("noticeLevelPie", noticeLevelPie);
		allEchartsDic.put("noticeRangeBar", noticeRangeBar);
	}
	
	//响应式调整 
	noticeLevelPie.resize();
	noticeRangeBar.resize();
	
	// 过渡---------------------
	noticeLevelPie.showLoading({
		text: "正在努力的读取数据中...",    //loading话术
	});
	noticeRangeBar.showLoading({
		text: "正在努力的读取数据中...",    //loading话术
	});
	
	if (graphData.noticeLevelPie) {
		if (graphData.noticeLevelPie.data) {
			//按诚信级别饼状统计
			var noticeLevelPieOpt = {
					title : {
				        text: "诚信级别",
				        textStyle: {
				        	fontFamily: "微软雅黑",
				        	fontSize: 20,
				        	color: "black"
				        },
				        show: true
				    },
					tooltip : {
				        trigger: 'item',
				        formatter: "{a} <br/>{b} : {c} ({d}%)"
				    },
				    legend: {
				        data: graphData.noticeLevelPie.legend
				    },
				    toolbox: {
				        show : true,
				        feature : {
				            saveAsImage : {show: true}
				        }
				    },
				    color: ['#ff7f50','#87cefa','#da70d6','#32cd32','#6495ed',
				            '#ff69b4','#ba55d3','#cd5c5c','#ffa500','#40e0d0',
				            '#1e90ff','#ff6347','#7b68ee','#00fa9a','#ffd700',
				            '#6699FF','#ff6666','#3cb371','#b8860b','#30e0e0'],
				    calculable : true,
				    series : [
				        {
				            name:'诚信级别',
				            type:'pie',
				            radius : ['20%', '35%'],
				            itemStyle : {
				                normal : {
				                    label : {
				                        show : true,
				    		            textStyle: {
				    		                baseline: "top",
				    		                fontSize: 15 
				    		            }
				                    },
				                    labelLine : {
				                        show : true
				                    }
				                },
				                emphasis : {
				                    label : {
				                        show : true,
				                        position : 'center',
				                        textStyle : {
				                            fontSize : '30',
				                            fontWeight : 'bold'
				                        }
				                    }
				                }
				            },
				            data: graphData.noticeLevelPie.data
				        }
				    ]
			};
			noticeLevelPie.hideLoading();
			noticeLevelPie.setOption(noticeLevelPieOpt, true);
		}
	}
	
	if (graphData.noticeRangeBar) {
		if (graphData.noticeRangeBar.seriesdata) {
			
			//按企业诚信排名柱状统计
			var noticeRangeBarOpt = {
		    	   	title : {
				        text: "诚信排名Top10",
				        textStyle: {
				        	fontFamily: "微软雅黑",
				        	fontSize: 20,
				        	color: "black"
				        },
				        show: true
				    },
				    tooltip : {
				        trigger: "axis"
				    },
				    legend: {
				    	show:true
				    },
				    color: ['#ff7f50','#87cefa','#da70d6','#32cd32','#6495ed',
				            '#ff69b4','#ba55d3','#cd5c5c','#ffa500','#40e0d0',
				            '#1e90ff','#ff6347','#7b68ee','#00fa9a','#ffd700',
				            '#6699FF','#ff6666','#3cb371','#b8860b','#30e0e0'],
				    toolbox: {
				                show : true,
				                feature : {
//				                    magicType : {show: true, type: ['line', 'bar']},
				                    saveAsImage : {show: true}
				                }
				    },
				    grid : {
				    	x: 100
				    },
				    xAxis : [ 
				        {
				        	type: "category",
				            boundaryGap: true,
				            axisTick: {onGap:false},
				            splitLine: {show:true},
				            data : graphData.noticeRangeBar.xdata    
				        }
				    ],
				    yAxis: [
				        {
				            type: "value",
				            axisLabel: {
				                formatter: "{value}"
				            },
				            min: 0,
				            splitArea: {show: true}
				        }
				    ],
				    series:  [
				              {
				                  name:'综合得分',
				                  type:'bar',
				                  data:graphData.noticeRangeBar.seriesdata
				              }
				          ]
			 }; 
			noticeRangeBar.hideLoading();
			noticeRangeBar.setOption(noticeRangeBarOpt, true);
		}
	}
	
	//调整窗口合同状态饼状图与柱状图展示
	$(window).resize(function() {
		noticeLevelPie.resize();
		noticeRangeBar.resize();
	});
}


/**
 * 刷新时加载查询条件
 */
function reloadGrid() {
	//获取企业id
	var noticetime = $("#noticetime").val();
	var entname = $("#entname").val();
    $("#grid-table").jqGrid("setGridParam", {
        page: 1,
        postData: {
        	noticetime:noticetime||"",
        	entname:entname||""
        }
    }).trigger("reloadGrid");
}

/**
 * 详细查看诚信公告
 */
function display(nonticeid) {
	 //返回当前grid中复选框所选择的数据的id
	parent.openWin(BASE_URL + "views/module/ecs/notice/displayNotice.html?nonticeid="+nonticeid,
             "诚信公告详情", "50%", "50%");
}

/**
 * 诚信公告打分
 */
function addNoticeScore(noticeid) {
	 //返回当前grid中复选框所选择的数据的id
	parent.openWin(BASE_URL + "views/module/ecs/notice/addNoticeScore.html?noticeid="+noticeid,
             "诚信公告详情", "50%", "35%");
}

