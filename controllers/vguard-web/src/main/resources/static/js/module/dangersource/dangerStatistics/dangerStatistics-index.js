/**
 * 监控总览一级菜单
 * @author 刘晓斌
 * @since 2016-11-29
 */
$(function(){
	//实时监测统计分页表格
	$("#monPtCnts").jqGrid({
		url: BASE_URL + "js/module/dangersource/dangerStatistics/monPtCnts.json",
		datatype: "json",
		 colModel: [
			{label: "监控区域", name: "monArea",  defaulValue: "", align: "center", width: 150},
			{label: "点位总数", name: "allMonPtCnts",  defaulValue: "", align: "center", width: 150,
			 formatter: function(cellvalue, options, rowObject){
					 return "<font color='#00FF00' size='5px'>" + cellvalue + "</font>";
			 }, drag: true},         
			{label: "报警点位", name: "alarmMonPtCnts",  defaulValue: "", align: "center", width: 150,
			 formatter: function(cellvalue, options, rowObject){
					 return "<font color='#FF0000' size='5px'>" + cellvalue + "</font>";
		     }, drag: true},         
		    {label: "故障点位", name: "faultMonPtCnts",  defaulValue: "", align: "center", width: 150,
		     formatter: function(cellvalue, options, rowObject){
		    	 return "<font color='#FFCC00' size='5px'>" + cellvalue + "</font>";
		     }, drag: true}         
		],
		viewrecords: true, // show the current page, data rang and total records on the toolbar
		autowidth: true,
		responsive: true,
		height: 170,
		rowNum: 10,
		rowList: [10, 20, 30],
		loadonce: true, // this is just for the demo
		pager: "#monPtCntsPager",
		loadComplete: function(){
			$("#monPtCnts").setGridWidth($("#monPtCnts").parents(".table-responsive").width());
		}
	});
	
	//值班安全员统计分页表格
	$("#dutySafePerson").jqGrid({
		url: BASE_URL + "js/module/dangersource/dangerStatistics/dutySafePerson.json",
		datatype: "json",
		colModel: [
		           {label: "监控区域", name: "monArea",  defaulValue: "", align: "center", width: 150},
		           {label: "姓名", name: "dutyName",  defaulValue: "", align: "center", width: 150},         
		           {label: "电话", name: "phoneNum",  defaulValue: "", align: "center", width: 150}
		          ],
		 viewrecords: true, // show the current page, data rang and total records on the toolbar
		 autowidth: true,
		 responsive: true,
		 height: 170,
		 rowNum: 10,
		 rowList: [10, 20, 30],
		 loadonce: true, // this is just for the demo
		 pager: "#dutySafePersonPager",
		 loadComplete: function(){
			 $("#dutySafePerson").setGridWidth($("#dutySafePerson").parents(".table-responsive").width());
		 }
	});
	
	
	//巡查计划完成比例---start
	var patrolComPerChart = null;
	window.allEchartsDic = new MapUtil();
	patrolComPerChart = window.allEchartsDic.get("patrolComPerChart");
	if (!patrolComPerChart) {
		patrolComPerChart = echarts.init(document.getElementById("patrolComPerChart"));
		window.allEchartsDic.put("patrolComPerChart", patrolComPerChart);
	}
	patrolComPerChart.showLoading({
		text: "正在努力的读取数据中...",    //loading话术
	});
	
	var patrolComPerOpt = {	
			title: {
				show: false,
		        text: "巡查计划完成比例",
		        /*subtext: "纯属虚构",*/
		        x: "left"
		    },
		 	tooltip: {
		 		trigger: 'axis',
		        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
		            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
		        },
		        formatter: function (params){
		            return params[0].name + '<br/>'
		                   + params[0].seriesName + ' : ' + params[0].value + '%<br/>'
		                   + params[1].seriesName + ' : ' + (params[1].value + params[0].value) + '%';
		        }
		    },
		    toolbox: {
		        show: false,
		        feature: {
		            /*mark : {show: true},
		            dataView : {show: true, readOnly: false},
		            magicType: {show: true, type: ["line", "bar"]},
		            restore : {show: true},
		            saveAsImage : {show: true}*/
		        }
		    },
//		    calculable: true,
		    legend: {
		    	show: true,
//		    	borderWidth: 0,
		        data: ["实际完成", "计划完成"],
		        selectedMode: false
		    },
//		    axis: {
//				show: true,
//				boundaryGap: true,
//				splitArea: {
//					show: true,
//					onGap: 50
//				},
//				scale: true
//			},
		    xAxis: [
		        {
		            type: "category",
//		            boundaryGap : true,
//		            axisTick: {onGap:false},
//		            splitLine: {show:true},
//		            axisLabel: {
//						//x轴标签倾斜
//						rotate: 45
//					},
		            data: ["2017-2-6", "2017-2-7", "2017-2-8",
		                   "2017-2-9", "2017-2-10"
		                   ]
		        }
		    ],
		    yAxis: [
		        {
//		            type: "value",
		            name: "百分比",
////		            boundaryGap: true,
		            axisLabel: {
		                formatter: "{value}%"
		            },
//		            min: 0,
//		            splitArea: {show: true}
		        	type : 'value',
		            boundaryGap: [0, 0.1]
		        }
		    ],
		    series: [
				{
				    name:'实际完成',
				    type:'bar',
				    stack: 'sum',
				    barCategoryGap: '50%',
				    itemStyle: {
				        normal: {
				            color: 'tomato',
				            barBorderColor: 'tomato',
				            barBorderWidth: 6,
				            barBorderRadius:0,
				            label : {
				                show: true, position: 'insideTop',
				                formatter: function (params) {
		                            for (var i = 0, l = patrolComPerOpt.xAxis[0].data.length; i < l; i++) {
		                                if (patrolComPerOpt.xAxis[0].data[i] == params.name) {
		                                    return patrolComPerOpt.series[0].data[i] + '%';
		                                }
		                            }
		                        },
				            }
				        }
				    },
				    data:[80, 90, 100, 95, 99]
				},
				 {
		            name:'计划完成',
		            type:'bar',
		            stack: 'sum',
		            itemStyle: {
		                normal: {
		                    color: '#93B770',
		                    barBorderColor: '#93B770',
		                    barBorderWidth: 0,
		                    barBorderRadius:0,
		                    label : {
		                        show: true, 
		                        position: 'top',
		                        formatter: function (params) {
		                            for (var i = 0, l = patrolComPerOpt.xAxis[0].data.length; i < l; i++) {
		                                if (patrolComPerOpt.xAxis[0].data[i] == params.name) {
		                                    return patrolComPerOpt.series[0].data[i] + params.value + '%';
		                                }
		                            }
		                        },
		                        textStyle: {
		                            color: '#93B770'
		                        }
		                    }
		                }
		            },
		            data:[20, 10, 0, 5, 1]
		        }
		    ]
	}; 
	
	patrolComPerChart.hideLoading();
	patrolComPerChart.setOption(patrolComPerOpt, true);
//	alarmHanRecChart.setTheme("macarons");
	//巡查计划完成比例柱状图---end
	
	
	//隐患级别饼状图---start
	var hidDanLvlChart = window.allEchartsDic.get("hidDanLvlChart");
	if (!hidDanLvlChart) {
		hidDanLvlChart = echarts.init(document.getElementById("hidDanLvlChart"));
		window.allEchartsDic.put("hidDanLvlChart", hidDanLvlChart);
	}
	hidDanLvlChart.showLoading({
		text: "正在努力的读取数据中...",    //loading话术
	});
	
	//隐患级别占比配置
	var hidDanLvlOpt = {
			title: {
				text: '隐患级别',
				textStyle: {
		        	fontFamily: "微软雅黑",
		        	fontSize: 20,
		        	color: "black"
		        },
//				subtext: '纯属虚构',
				x: 'center',
				show: false
			},
			tooltip: {
				trigger: 'item',
				formatter: "{a} <br/>{b} : {c}个"
			},
			legend: {
				orient: 'horizontal',
//				orient: 'vertical',
				x: 'left',
				data: ["一般隐患", "重大隐患"],
				selectedMode: false
			},
			toolbox: {
				show: false,
				feature: {
					mark: {show: true},
					dataView : {show: true, readOnly: false},
					magicType : {
						show: true, 
						type: ['pie', 'funnel'],
						option: {
							funnel: {
								x: '25%',
								width: '50%',
								funnelAlign: 'left',
								max: 1548
							}
						}
					},
					restore : {show: true},
					saveAsImage : {show: true}
				}
			},
			calculable : false,
			series: [
			          {
			        	  name: '隐患级别',
			        	  type: 'pie',
			        	  radius: '55%',
			        	  center: ['50%', '60%'],
			        	  itemStyle: {
				      		    normal: {
				    		        label: {
				    		            formatter: function (params){
				    		            	return params.name + ":" + params.value + "个";
				    		            },
				    		            textStyle: {
				    		                baseline: "top",
				    		                fontSize: 15 
				    		            }
				    		        }
				    		    }
			        	  },
			        	  data: [
			        	        {value: "24", name: "一般隐患",  itemStyle: {
			                        normal: {
			                            color: '#f3a43b'
			                        },
			        	        }},
			        	        {value: "2", name: "重大隐患",  itemStyle: {
			                        normal: {
			                            color: '#d87a80'
			                        }
			        	        }}
			        	        ]
			          }
			         ]
	};
	
	hidDanLvlChart.hideLoading();
	hidDanLvlChart.setOption(hidDanLvlOpt, true);
//	deteMediaTypeChart.setTheme("macarons");
	//隐患级别占比饼状图---end

	
	//历史报警走势折线图---start
//	var alarmHisTrendChart = window.allEchartsDic.get("alarmHisTrendChart");
//	if (!alarmHisTrendChart) {
//		alarmHisTrendChart = echarts.init(document.getElementById("alarmHisTrendChart"));
//		window.allEchartsDic.put("alarmHisTrendChart", alarmHisTrendChart);
//	}
//	alarmHisTrendChart.showLoading({
//		text: "正在努力的读取数据中...",    //loading话术
//	});
	
	//历史报警走势配置
//	var alarmHisTrendOpt = {
//			tooltip : {
//		        trigger: 'axis',
//		        show: false
//		    },
//		    legend: {
//		        data:['历史报警个数'],
//		        selectedMode: false,
//		        show: true
//		    },
//		    toolbox: {
//		        show : false,
//		        feature : {
//		            mark : {show: true},
//		            dataView : {show: true, readOnly: false},
//		            magicType : {show: true, type: ['line', 'bar', 'stack', 'tiled']},
//		            restore : {show: true},
//		            saveAsImage : {show: true}
//		        }
//		    },
//		    calculable : true,
//		    xAxis : [
//		        {
//		            type : 'category',
//		            boundaryGap : false,
//		            data : ['2016-11-21','2016-11-22','2016-11-23','2016-11-24','2016-11-25','2016-11-26','2016-11-27']
//		        }
//		    ],
//		    yAxis : [
//		        {
//		        	name: '个数',
//		            type: 'value'
//		        }
//		    ],
//		    series : [
//		        {
//		            name:'历史报警个数',
//		            type:'line',
//		            stack: '总量',
//		            data:[120, 132, 101, 134, 90, 230, 210]
//		        }
//		    ]
//	};
//	
//	alarmHisTrendChart.hideLoading();
//	alarmHisTrendChart.setOption(alarmHisTrendOpt, true);
//	alarmHisTrendChart.setTheme("macarons");
	//历史报警走势折线图---end
	
	
	//隐患流转状态柱状图---start
	var hidDanMovStatChart = window.allEchartsDic.get("hidDanMovStatChart");
	if (!hidDanMovStatChart) {
		hidDanMovStatChart = echarts.init(document.getElementById("hidDanMovStatChart"));
		window.allEchartsDic.put("hidDanMovStatChart", hidDanMovStatChart);
	}
	hidDanMovStatChart.showLoading({
		text: "正在努力的读取数据中...",    //loading话术
	});
	
	var hidDanMovStatOpt = {	
			title: {
				show: false,
				text: "隐患流转状态",
				/*subtext: "纯属虚构",*/
				x: "left"
			},
			tooltip: {
				 trigger: 'axis',
//			        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
//			            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
//			        },
				 formatter: function(params, ticket, callback){
  			        	var str = params[0].name;
  			        	for(var i = 0, l = params.length; i < l; i++){
  			        		str += "<br/>" + params[i].seriesName + " : " + params[i].value + "个";
  			        	}
  			        	return str;
  			     }
			},
			toolbox: {
				show: false,
				feature: {
					/*mark : {show: true},
		            dataView : {show: true, readOnly: false},
		            magicType: {show: true, type: ["line", "bar"]},
		            restore : {show: true},
		            saveAsImage : {show: true}*/
				}
			},
//		    calculable: true,
			legend: {
				show: true,
				borderWidth: 0,
				data: ["待整改", "待验收", "待核查", "验收完成"],
				selectedMode: false
			},
			axis: {
				show: true,
//				boundaryGap: true,
//				splitArea: {
//					show: true,
//					onGap: 50
//				},
				scale: true
			},
			xAxis: [
			        {
			        	type: "category",
			        	boundaryGap : false,
//			        	axisTick: {onGap:false},
//			        	splitLine: {show:true},
//			        	axisLabel: {
//							//x轴标签倾斜
//							rotate: 45
//						},
			        	data: ["合成氨车间"]
			        }
			        ],
			        yAxis: [
			                {
			                	type: "value",
			                	name: "个数",
//		            boundaryGap: true,
			                	axisLabel: {
			                		formatter: "{value}"
			                	},
			                	min: 0,
//			                	splitArea: {show: true}
			                }
			                ],
			                series: [
									{
									    name: "待整改",
									    type: "bar",
//									    barWidth: 30,
//									    barCategoryGap: 90.5,
									    itemStyle: {
										    normal: {
										    	barBorderRadius: [0, 0, 0, 0]/*,
										    	label : {
									                show : true,
									                textStyle : {
									                    fontSize : "15",
									                    fontFamily : "微软雅黑",
									                    fontWeight : "bold"
									                }
										    	}*/
										    }
									    },
									    data: [10]
									},
									{
										name: "待验收",
										type: "bar",
//										barWidth: 30,
//										barCategoryGap: 90.5,
										itemStyle: {
											normal: {
												barBorderRadius: [0, 0, 0, 0]/*,
										    	label : {
									                show : true,
									                textStyle : {
									                    fontSize : "15",
									                    fontFamily : "微软雅黑",
									                    fontWeight : "bold"
									                }
										    	}*/
											}
										},
										data: [59]
									},
									{
										name: "待核查",
										type: "bar",
//										barWidth: 30,
//										barCategoryGap: 90.5,
										itemStyle: {
											normal: {
												barBorderRadius: [0, 0, 0, 0]/*,
										    	label : {
									                show : true,
									                textStyle : {
									                    fontSize : "15",
									                    fontFamily : "微软雅黑",
									                    fontWeight : "bold"
									                }
										    	}*/
											}
										},
										data: [10]
									},
									{
										name: "验收完成",
										type: "bar",
//										barWidth: 30,
//										barCategoryGap: 90.5,
										itemStyle: {
											normal: {
												barBorderRadius: [0, 0, 0, 0]/*,
										    	label : {
									                show : true,
									                textStyle : {
									                    fontSize : "15",
									                    fontFamily : "微软雅黑",
									                    fontWeight : "bold"
									                }
										    	}*/
											}
										},
										data: [50]
									}
			                         ]
	}; 
	
	hidDanMovStatChart.hideLoading();
	hidDanMovStatChart.setOption(hidDanMovStatOpt, true);
//	alarmHanRecChart.setTheme("macarons");
	//隐患流转状态柱状图---end
	
	//适应窗口大小调整
	$(window).resize(function(){
		patrolComPerChart.resize();
		patrolComPerChart.resize();
		hidDanLvlChart.resize();
		hidDanMovStatChart.resize();
	});
});