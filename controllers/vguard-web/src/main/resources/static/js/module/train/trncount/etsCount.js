$(document).ready(function() {
	changQarter();
	onclick();
	var currYear = new Date().getFullYear();
	var html= "<li>"+(currYear-4)+"</li>"+
	"<li>"+(currYear-3)+"</li>"+
	"<li>"+(currYear-2)+"</li>"+
	 "<li>"+(currYear-1)+"</li>"+
	 "<li class='cur'>"+currYear+"</li>";
	$(".year").html(html);
	
	$(".year").on("click","li",function(){
		$(this).addClass('cur').siblings().removeClass('cur');
		setTimeByQarter($(this).text(),$("#quarter").val());
		onclick();
		if($(this).index() == 0){
		   var year = parseInt($(this).text());
		   var html= "<li>"+(year-2)+"</li>"+
			    	 "<li>"+(year-1)+"</li>"+
			    	 "<li class='cur'>"+year+"</li>"+
			    	 "<li>"+(year+1)+"</li>"+
			    	 "<li>"+(year+2)+"</li>";
		   $(".year").html(html);
		}else if($(this).index() == 4){
			var year = parseInt($(this).text());
			var curYear = new Date().getFullYear();
			if(year != curYear){
				var html= "<li>"+(year-2)+"</li>"+
					      "<li>"+(year-1)+"</li>"+
					      "<li class='cur'>"+year+"</li>"+
					      "<li>"+(year+1)+"</li>"+
					      "<li>"+(year+2)+"</li>";
				$(".year").html(html);
			}
		}
	});
	
	$(".quarter").find("li").each(function(){
		$(this).bind("click",function(){
			$(this).addClass('cur').siblings().removeClass('cur');
			var year = $("#stime").val().substring(0,4);
			$("#quarter").val($(this).text());
			setTimeByQarter(year,$(this).text());
			onclick();
		});
	});
});



/**
 * 季度切换
 */
function changQarter(){
	var curYear = new Date().getFullYear();
	var curMonth = new Date().getMonth()+1;
	var curQarter = getQarter2Month(curMonth);
	switch(curQarter){
	case 1:
		$("#one").addClass("cur");
		break;
	case 2:
		$("#two").addClass("cur");
		break;
	case 3:
		$("#three").addClass("cur");
		break;
	case 2:
		$("#four").addClass("cur");
		break;
	}
	$("#"+curQarter).addClass("cur");
	$("#quarter").val(curQarter);
	setTimeByQarter(curYear,curQarter)
}

/**
 * 根据季度设置时间
 * @param qarter
 */
function setTimeByQarter(year,qarter){
	if(qarter == 1){
		$("#stime").val(year+"-01-01");
		$("#etime").val(year+"-03-31");
	}else if(qarter == 2){
		$("#stime").val(year+"-04-01");
		$("#etime").val(year+"-06-30");
	}else if(qarter == 3){
		$("#stime").val(year+"-07-01");
		$("#etime").val(year+"-09-30");
	}else if(qarter == 4){
		$("#stime").val(year+"-10-01");
		$("#etime").val(year+"-12-31");
	}
	$("#year").val(year);
}

/**
 * 根据月份获取季度
 * @param month
 */
function getQarter2Month(month){
	if(1<=month && month<=3){
		return 1;
	}else if(4<=month && month<=6){
		return 2;
	}else if(7<=month && month<=9){
		return 3;
	}else{
		return 4;
	}
}

/**
 * 点击事件进行查询
 */
function onclick(){
	/**政府预案统计**/
	enterApplyCount(); //企业数量统计
	/**统计图**/
//	changeCountView();
}

var govtrnarr = [];//政府培训记录
var enttrnarr = [];//企业培训记录
var govassarr = [];//政府考试记录
var entassarr = [];//企业考试记录
 
/**
 * 根据企业、预案统计
 */
function enterApplyCount(){
	$.ajax({
		type : 'post',
		url : BASE_URL+'train/count/loadcount',
		cache : false,
		data:{
			stime:$("#stime").val(),
			etime:$("#etime").val()
		},
		dataType : 'json',
		global : false,
		success : function(data) {
			if(data){
				govtrnarr = [];
				enttrnarr=[];
				govassarr = [];
				entassarr = [];
				
				govtrnarr.push(data.trnRecords.GOV == null ? 0 : data.trnRecords.GOV);
				govtrnarr.push(data.exaRecords.GOV == null ? 0 : data.exaRecords.GOV);
				enttrnarr.push(data.trnRecords.ENT == null ? 0 : data.trnRecords.ENT);
				enttrnarr.push(data.exaRecords.ENT == null ? 0 : data.exaRecords.ENT);
				
				govassarr.push(data.assCount.GOVEXC == null ? 0 : data.assCount.GOVEXC);
				govassarr.push(data.assCount.GOVFINE == null ? 0 : data.assCount.GOVFINE);
				govassarr.push(data.assCount.GOVMID == null ? 0 : data.assCount.GOVMID);
				govassarr.push(data.assCount.GOVBAD == null ? 0 : data.assCount.GOVBAD);
				govassarr.push(data.assCount.GOVWORSE == null ? 0 : data.assCount.GOVWORSE);
				
				entassarr.push(data.assCount.ENTEXC == null ? 0 : data.assCount.ENTEXC);
				entassarr.push(data.assCount.ENTFINE == null ? 0 : data.assCount.ENTFINE);
				entassarr.push(data.assCount.ENTMID == null ? 0 : data.assCount.ENTMID);
				entassarr.push(data.assCount.ENTBAD == null ? 0 : data.assCount.ENTBAD);
				entassarr.push(data.assCount.ENTWORSE == null ? 0 : data.assCount.ENTWORSE);
				
				$('#span1').html(data.trnRecords.GOV == null ? 0 : data.trnRecords.GOV);
				$('#span2').html(data.exaRecords.GOV == null ? 0 : data.exaRecords.GOV);
				$('#span3').html(data.entCount.TRNENT == null ? 0 : data.entCount.TRNENT);
				$('#span4').html(data.entCount.NOTTRNENT == null? 0 : data.entCount.NOTTRNENT);
				$('#span5').html(data.trnRecords.ENT == null ? 0 : data.trnRecords.ENT);
				$('#span6').html(data.exaRecords.ENT == null ? 0 : data.exaRecords.ENT);
				$('#govExcSpan').html(data.assCount.GOVEXC == null ? 0 : data.assCount.GOVEXC);
				$('#entExcSpan').html(data.assCount.ENTEXC == null ? 0 : data.assCount.ENTEXC);
				$('#govFineSpan').html(data.assCount.GOVFINE == null ? 0 : data.assCount.GOVFINE);
				$('#entFineSpan').html(data.assCount.ENTFINE == null? 0 : data.assCount.ENTFINE);
				$('#govMidSpan').html(data.assCount.GOVMID == null ? 0 : data.assCount.GOVMID);
				$('#entMidSpan').html(data.assCount.ENTMID == null ? 0 : data.assCount.ENTMID);
				$('#govBadSpan').html(data.assCount.GOVBAD == null ? 0 : data.assCount.GOVBAD);
				$('#entBadSpan').html(data.assCount.ENTBAD == null ? 0 : data.assCount.ENTBAD);
				$('#govWorseSpan').html(data.assCount.GOVWORSE == null ? 0 : data.assCount.GOVWORSE);
				$('#entWorseSpan').html(data.assCount.ENTWORSE == null ? 0 : data.assCount.ENTWORSE);
//				initBarChart(data);
				initBarChart();
				initPieChart();
			}
		}
	});
}

function selectEChartType(){
	initBarChart();
	initPieChart();
}


function initBarChart() {
	var list = new Array();
	var radioValue = $('input:radio:checked').val();
	var typename;
	if (radioValue == 'ent') {
//		list.push(data.trnRecords.ENT);
//		list.push(data.exaRecords.ENT);
		list= enttrnarr;
		typename = '企业'
	}else{
//		list.push(data.trnRecords.GOV);
//		list.push(data.exaRecords.GOV);
		list= govtrnarr;
		typename = '政府'
	}
	var option = {
		title:{  
			    text:'培训考试情况',
			    x :"center",
			    y:"top",
			     textStyle: {
			    	 	align:"center",
//			        	fontFamily: "微软雅黑",
			        	fontSize: 14,
			        	color: "#999"
			        }
			  },  
		tooltip : {
			trigger : 'item'
		},
		grid: {
	        left: '3%',
	        right: '5%',
	        bottom: '3%',
	        containLabel: true
		},
		legend: {
	        orient : 'vertical',
	        data:[ typename+'培训总数', typename+'考试总数'],
	        itemGap: 3,
	        itemHeight: 10,
	        itemWidth: 10,
	        x: 'right',
	        y: '25px'
	    },
		calculable : true,
		xAxis : [ {
			type : 'category',
			data : [typename+'培训总数', typename+'考试总数'],
            axisLabel: {
                interval: 0,//标签设置为全部显示
            },
            axisLine: {
            	show: false
            },
            splitLine:{  
　　　　				show:false  
　　 			},
　　 			axisTick: {
　　 				show: false
　　 			}
		} ],
		yAxis : [ {
			type : 'value',
			name : "申请数量(个)",
            show: false,
            splitLine:{  
            　　　　			show:false  
            　　 		} 
		} ],
		label: {
            normal: {
                show: false,
                position: 'center'
            },
            emphasis: {
                show: true,
                textStyle: {
                    fontSize: '15',
                    fontWeight: 'bold'
                }
            }
        },
		series : [ {
			name : '培训考试情况',
			type : 'bar',
			barWidth: '30',
			itemStyle : {
				normal : {
					color : function(params) {
						var colorList = ['#53CFB3','#4990E2'];
						return colorList[params.dataIndex]
					},
                	label: {
	                	show: true,
	                	position: 'top',
	                	formatter:function(params){
	                		if(params.value==0){
	                				return '';
	                		}else {
	                			return params.value;
	                		}
	                	}
                	}
				}
			},
			data : list
		} ]
	};
    var myChart = echarts.init(document.getElementById('p2'));
    //使用制定的配置项和数据显示图表
    myChart.setOption(option);
    $(window).resize(function () {
        var width = $(window).innerWidth();
        width = (width - 80) / 3;
        $("#dangerchart").css('width', width);
        myChart.resize();
    });

}


/**
 * 占比图
 */
function initPieChart() {
	var list = new Array();
	var radioValue = $('input:radio:checked').val();
	var typename;
	if (radioValue == 'ent') {
//		list.push(data.trnRecords.ENT);
//		list.push(data.exaRecords.ENT);
		list= entassarr;
		typename = '企业'
	}else{
//		list.push(data.trnRecords.GOV);
//		list.push(data.exaRecords.GOV);
		list= govassarr;
		typename = '政府'
	}
	var biggestData = _.max(list)+2;
		var chart = document.getElementById('p1');
		var echart = echarts.init(chart);
		var option = {
			    title : {
			    	 text:'培训效果评估整体情况',
					    x :"center",
					    y:"top",
					     textStyle: {
					    	 	align:"center",
//					        	fontFamily: "微软雅黑",
					        	fontSize: 14,
					        	color: "#999"
					        },
					        lineHeight:40 
			    },
			    tooltip : {
//			    	show: true,
//			        trigger: 'axis'
			    },
			    legend: {
			    	show: false,
			        x : 'center',
			        data:[typename+'培训效果评估']
			    },
			    toolbox: {
			        show : false,
			        feature : {
			            mark : {show: true},
			            dataView : {show: true, readOnly: false},
			            restore : {show: true},
			            saveAsImage : {show: true}
			        }
			    },
			    calculable : false,
			    polar : [
			        {
			            indicator : [
			                {text : '优秀', max  : biggestData},
			                {text : '良好', max  : biggestData},
			                {text : '中等', max  : biggestData},
			                {text : '差', max  : biggestData},
			                {text : '较差', max  : biggestData}           
			            ],
			            radius : 115,
			            scale: true,
			            center: [ '50%', '60%' ], 
			        }
			    ],
			    series : [
			        {
			            name: typename+'培训效果评估',
			            type: 'radar',
			            itemStyle: {
			                normal: {
			                	color: '#1890FF',
			                    areaStyle: {
			                        type: 'default'
//			                        color: '#1890FF'
			                    },
			                    lineStyle: {
        		            	    width: 2
        		            	}
//        		            	borderColor: '#1890FF'
			                }
			            },
			            data : [
			                {
			                    value : list,
			                    name : typename+'培训效果评估'
			                }
			            ]
			        }
			    ]
			};
		echart.setOption(option, true);
		$(window).resize(function(){
				var width = $(window).innerWidth();
				width = (width-80)/3;
				$("#emsEventInfo").css('width',width);
				echart.resize();
		});
}

/**
 * @param 培训情况
 */
function loadTrnRecord(status){
	parent.openWin(BASE_URL+ "views/module/train/trncount/trnRecordList.html?" +
			"status="+status+"&stime="+$("#stime").val()+"&etime="+$("#etime").val(),'培训记录', '60%', '70%');
}

/**
 * @param 考试情况
 */
function loadExaRecord(status){
	parent.openWin(BASE_URL+ "views/module/train/trncount/exaRecordList.html?" +
			"status="+status+"&stime="+$("#stime").val()+"&etime="+$("#etime").val(),
			'考试记录','60%', '70%');
}

/**
 * @param 培训企业
 */
function loadTrnEnt(status){
	var name = '';
	if ('yes' == status) {
		name = '已培训企业';
	}else if('no' == status){
		name = '未培训企业';
	}
	parent.openWin(BASE_URL+ "views/module/train/trncount/entListInfo.html?" +
			"status="+status+"&stime="+$("#stime").val()+"&etime="+$("#etime").val(),
			name, '60%', '70%');
}

/**
 * 情况
 * @param type
 * @param status
 */
function loadGovAssessCount(status){
	parent.openWin(BASE_URL+ "views/module/train/trncount/exaAssessList.html?" +
			"status="+status+"&stime="+$("#stime").val()+"&etime="+$("#etime").val()+"&unitclass=1",
			'效果评估记录', '60%', '70%');
}

function loadEntAssessCount(status){
	parent.openWin(BASE_URL+ "views/module/train/trncount/exaAssessList.html?" +
			"status="+status+"&stime="+$("#stime").val()+"&etime="+$("#etime").val()+"&unitclass=0",
			'效果评估记录', '60%', '70%');
}


/**
 * 转为百分数
 * @param data
 * @returns {String}
 */
function toPercent(data){
	//0.0714*100 == 7.140000000000001
	//为了让js执行的更准确，在以后的js小数计算中直接将值扩大10000倍，再除以10000，就可以解决问题
    var strData = accMul(data,100);
    var ret = strData.toString()+"%";
    return ret;
}

//乘法函数，用来得到精确的乘法结果
//说明：javascript的乘法结果会有误差，在两个浮点数相乘的时候会比较明显。这个函数返回较为精确的乘法结果。
//调用：accMul(arg1,arg2)
//返回值：arg1乘以arg2的精确结果
function accMul(arg1,arg2){
  var m=0,s1=arg1.toString(),s2=arg2.toString();
  try{m+=s1.split(".")[1].length}catch(e){}
  try{m+=s2.split(".")[1].length}catch(e){}
  return Number(s1.replace(".",""))*Number(s2.replace(".",""))/Math.pow(10,m);
}
