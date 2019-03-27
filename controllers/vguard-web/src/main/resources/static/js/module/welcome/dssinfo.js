/**
 * Created by Administrator on 2017/10/25.
 */
$(function () {

//	var userid = getQueryString("userid");

	//加载
	initDssInfo();

})

/**
 * 风险统计
 * 
 * @param categories
 * @param values
 */
function initDssInfo() {
	$.ajax({
		type : 'post',
		url : BASE_URL + 'ent/welcome/dsscount',
		cache : false,
		data : {},
		dataType : 'json',
		global : false,
		success : function(data) {
			if (data) {
				var dssRiskCharts = data.dssRiskChart;
				var classValue1 = [];
				var n = 0;	
				for(var key in dssRiskCharts){
					  console.log("属性：" + key + ",值：" + dssRiskCharts[key]);
					  if(key == "重大风险"){	
							$("#zdfxcount").text(dssRiskCharts[key]);
						} else if(key == "较大风险"){
							$("#jdfxcount").text(dssRiskCharts[key]);
						}  else if(key == "一般风险"){
							$("#ybfxcount").text(dssRiskCharts[key]);
						}  else if(key == "低风险"){
							$("#dfxcount").text(dssRiskCharts[key]);
						}
					  classValue1[n] = {value: dssRiskCharts[key], name: key};
					  n = n+1;
					}
//				$.each(dssRiskCharts,function(i,dssRiskChart){
//					if(dssRiskChart.RISKRATING == "重大风险"){	
//						$("#zdfxcount").text(dssRiskChart.RESNUM);
//					} else if(dssRiskChart.RISKRATING == "较大风险"){
//						$("#jdfxcount").text(dssRiskChart.RESNUM);
//					}  else if(dssRiskChart.RISKRATING == "一般风险"){
//						$("#ybfxcount").text(dssRiskChart.RESNUM);
//					}  else if(dssRiskChart.RISKRATING == "低风险"){
//						$("#dfxcount").text(dssRiskChart.RESNUM);
//					}
//				})
				var dssEventCharts = data.dssEventChart;
				var classValue2 = [];
			    $.each(dssEventCharts, function (i, dssEventChart) {
			    	classValue2[i] = {value: dssEventChart.RESNUM, name: dssEventChart.RSKDICVALUE};
			    });
			    initDssPie(classValue1,classValue2);
			}
		}
	});
}

function initDssPie(classValue1,classValue2){
	var chart = document.getElementById('dssCountChart');
	var echart = echarts.init(chart);
	option = {
		    tooltip: {
		        trigger: 'item',
		        formatter: "{a} <br/>{b}: {c} ({d}%)"
		    },
		    legend: {
		       orient: 'vertical',
		       x: 'right',
		       itemHeight: 10,
	           itemWidth: 10,
		       data:['重大风险','较大风险','一般风险','低风险']
		    },
		    series: [
		        {
		            name:'风险类别',
		            type:'pie',
		            selectedMode: 'single',
		            itemStyle: {
		                    normal: {
		                        color: function(params) {
		                            // build a color map as your need.
		                            var colorList = [
		                                 '#F5A623','#4AA3E2','#ED5851','#F8E71C'
		                            ];
		                            return colorList[params.dataIndex]
		                        }
		             }
		            },
		            radius: [0, '30%'],

		            label: {
		                normal: {
		                	show:false,
		                    position: 'inner'
		                }
		            },
		            labelLine: {
		                normal: {
		                    show: false
		                }
		            },
		            data:classValue1
		        },
		        {
		            name:'风险类别',
		            type:'pie',
		            itemStyle: {
	                    normal: {
	                        color: function(params) {
	                            var colorList = [
	                              '#53CFB3','#4990E2','#A28EC3','#F8E81C','#F6A623','#ED5851','#7ED321','#F5A623','#F8E71C','#4AA3E2',
	                              '#FF3726','#E200FF','#00BFFF','#F5A623','#FF3636','#72D628','#FF6600','#6600FF','#3366FF','#FF480C'
	                            ];
	                            return colorList[params.dataIndex]
	                        }
	                    }
		            },
	            	radius: ['45%', '70%'],

		            data:classValue2
		        }
		    ]
		};
	echart.setOption(option);
	$(window).resize(function(){
    	var width = $(window).innerWidth();
    	width = (width-80)/3;
//    	$("#dssCountChart").css('width',width);
    	echart.resize();
    });
}

function showDssInfo(riskrating){
	parent.openWin(BASE_URL + "views/module/dangersource/dssrskrecord/dssrskCountList.html?riskrating=" + riskrating,
            "风险列表", "60%", "70%");
}

function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)return unescape(r[2]);
    return null;
}
