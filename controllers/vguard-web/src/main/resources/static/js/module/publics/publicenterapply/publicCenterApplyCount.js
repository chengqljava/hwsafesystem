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
		setTimeByQarter($(this).text(),$("#qarter").val());
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
			$("#qarter").val($(this).text());
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
	$("#qarter").val(curQarter);
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
//
////路径配置
//require.config({
//	paths : {
//		echarts : BASE_URL + '/js/lib/echarts'
//	}
//});

/**
 * 根据企业、预案统计
 */
function enterApplyCount(){
	$.ajax({
		type : 'post',
		url : BASE_URL+'publics/publicenterapply/loadCount',
		cache : false,
		data:{
			stime:$("#stime").val(),
			etime:$("#etime").val()
		},
		dataType : 'json',
		global : false,
		success : function(data) {
			if(data){
				$('#span1').html(data.PLAN1 == null ? 0 : data.PLAN1);
				$('#span2').html(data.PLAN2 == null ? 0 : data.PLAN2);
				$('#span3').html(data.PLAN3 == null ? 0 : data.PLAN3);
				$('#span4').html(data.PLAN4 == null ? 0 : data.PLAN4);
				$('#span5').html(data.PLAN5);
				initPieChart(data);
				initBarChart(data);
			}
		}
	});
}

function initBarChart(data) {
	var list = new Array();
	list.push(data.PLAN1);
	list.push(data.PLAN2);
	list.push(data.PLAN3);
	list.push(data.PLAN4);
	var option = {
		title:{  
			    text:'入园申请柱状图',
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
	        data:[ '已保存', '已申请', '已同意', '不同意' ],
	        itemGap: 3,
	        itemHeight: 10,
	        itemWidth: 10,
	        x: 'right',
	        y: '25px'
	    },
		calculable : true,
		xAxis : [ {
			type : 'category',
			data : [ '已保存', '已申请', '已同意', '不同意'],
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
			name : '申请数量',
			type : 'bar',
			barWidth: '30',
			itemStyle : {
				normal : {
					color : function(params) {
						var colorList = ['#53CFB3','#4990E2','#A28EC3','#FF6633'];
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
 * 饼状图
 */
function initPieChart(data) {
		var chart = document.getElementById('p1');
		var echart = echarts.init(chart);
		var option = {
			title:{  
				     text:'入园申请饼状图',
				     x :"center",
					 y:"top",
				     textStyle: {
				    	 	align:"center",
//				        	fontFamily: "微软雅黑",
				        	fontSize: 14,
				        	color: "#999"
				        }
				  }, 
			tooltip : {
				trigger : 'item',
				formatter : "{a} <br/>{b} : {c} ({d}%)"
			},
			legend: {
			        orient : 'vertical',
			        data:[ '已保存', '已申请', '已同意', '不同意' ],
			        itemGap: 3,
			        itemHeight: 10,
			        itemWidth: 10,
			        x: 'right',
			        y: '25px'
			    },
			calculable : true,
			series : [ {
				name : '申请状态',
				type : 'pie',
				radius : [ '29%', '50%' ],
				itemStyle : {
					normal : {
						label:{
							show:true,
//							formatter: '{b} : {c} \n ({d}%)'
				        },
			            labelLine:{
			            show:false
			            },
						color : function(params) {
							var colorList = ['#ED5851','#F5834C','#F7BE4B','#4AA3E2'];
							return colorList[params.dataIndex]
						}
					}
				},
				avoidLabelOverlap: false,
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
				data : [ {
					value : data.PLAN1 == null ? 0 : data.PLAN1,
					name : '已保存'
				}, {
					value : data.PLAN2 == null ? 0 : data.PLAN2,
					name : '已申请'
				}, {
					value : data.PLAN3 == null ? 0 : data.PLAN3,
					name : '已同意'
				}, {
					value : data.PLAN4 == null ? 0 : data.PLAN4,
					name : '不同意'
				}, ]
			} ]
		};
		echart.setOption(option);
		$(window).resize(function(){
				var width = $(window).innerWidth();
				width = (width-80)/3;
				$("#emsEventInfo").css('width',width);
				echart.resize();
		});
}


function loadEnterApply(status){
	parent.openWin(BASE_URL+ "views/module/publics/publicenterapply/publiCenterApplyCountList.html?" +
			"status="+status+"&begintime="+$("#stime").val()+"&endtime="+$("#etime").val(),
			'入园申请记录', '53%', '60%');
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
