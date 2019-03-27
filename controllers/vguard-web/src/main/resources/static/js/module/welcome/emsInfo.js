/**
 * Created by Administrator on 2017/10/25.
 */
function initEmsInfo() {


	var userid = getQueryString("userid");

	//加载预案信息
	initEmsPlanInfo(userid);
	//加载事故信息
	initEmsEventInfo(userid);
	//加载资源信息
	emsReourceInfo(userid);


}

/**
 * 政府预案柱状图
 */
function initEmsPlanInfo(userid){
	$.ajax({
		type : 'post',
		url : BASE_URL + 'ems/emswelconme/loadPlanInfo',
		cache : false,
		data : {userid:userid},
		dataType : 'json',
		global : false,
		success : function(data) {
			if (data) {
				//综合预案
				var comprehensivePlan = new Array();
				comprehensivePlan.push(data.govplan1);
				comprehensivePlan.push(data.entplan1);
				//专项预案
				var specialPlan = new Array();
				specialPlan.push(data.govplan2);
				specialPlan.push(data.entplan2);
				//经济处置预案
				var emergencyResPlan = new Array();
				emergencyResPlan.push(data.govplan3);
				emergencyResPlan.push(data.entplan3);
				var govCount = data.govplan1 + data.govplan2 + data.govplan3;
				var entCount = data.entplan1 + data.entplan2 + data.entplan3;
				
				$("#govPlanCount").html("<a href='javascript:void(0);' style='font-size: 24px;color: #4990E2;' onclick='displayEmsInfo(1)'>"+govCount+"</a>");
				$("#entPlanCount").html("<a href='javascript:void(0);' style='font-size: 24px;color: #7DBA3A;' onclick='displayEmsInfo(2)'>"+entCount+"</a>");
				
				var chart = document.getElementById('emsPlanInfo');
				var echart = echarts.init(chart);
				option = {
					title : {
						 text:'预案信息',
						 x :"center",
						 y:"25px",
					     textStyle: {
					    	 	align:"center",
					        	fontFamily: "微软雅黑",
					        	fontSize: 12,
					        	color: "#999"
					        }
					  },  
						/*text: '预案信息 ',
						x : 'center',
						y : 'top'
						},*/
						tooltip : {
						    trigger: 'axis',
						},
						grid: {
					        left: '3%',
					        right: '10%',
					        bottom: '3%',
					        containLabel: true
						},
						legend: {
							data:['综合','专项','应急'],
						  	orient: 'vertical',
						  	itemGap:3,
					        itemHeight:10,
					        itemWidth:10,
					        x:'83%',
					        y:'20px'
						},
						calculable : false,
						xAxis : [
						    {
						        type : 'category',
						        data : ['政府预案','企业预案'],
//						      	name:'分类',
						      	axisLabel:{
									interval :0
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
						    }
						],
						yAxis : [
						    {
						        type : 'value',
						      	name : "数量(个)",
						      	show: false,
						          splitLine:{  
						            　　　　		show:false  
						            　　 	  } 
						    }
						],
						series : [
						    {
						        name:'综合',
						        type:'bar',
//						        stack: '预案',
						        barWidth : "30",
						        data:comprehensivePlan,
						        itemStyle : {
									normal : {
										color :'#4AA3E2',
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
								}
						    },
						    {
						        name:'专项',
						        type:'bar',
//						        stack: '预案',
						       	barWidth : "30",
						        data:specialPlan,
						        itemStyle : {
									normal : {
										color :'#F7BE4B',
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
								}
						    },
						    {
						        name:'应急',
						        type:'bar',
//						        stack: '预案',
						      	barWidth : "30",
						        data:emergencyResPlan,
						        itemStyle : {
									normal : {
										color :'#ED5851',
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
								}
						    }
						]
						};
					echart.setOption(option);
					$(window).resize(function(){
				    	var width = $(window).innerWidth();
				    	width = (width-80)/3;
				    	$("#emsPlanInfo").css('width',width);
				    	echart.resize();
				    });
			}
		},
		error : function() {
			parent.toast("初始化信息加载失败!");
		}
	});
}

/**
 * 事故信息
 * 
 * @param categories
 * @param values
 */
function initEmsEventInfo(userid) {
	$.ajax({
		type : 'post',
		url : BASE_URL + '/ems/emswelconme/loadEventInfo',
		cache : false,
		data : {userid:userid},
		dataType : 'json',
		global : false,
		success : function(data) {
			if (data) {
				var eventCount = data.LEVEL1 + data.LEVEL2 + data.LEVEL3 + data.LEVEL4;
				$("#eventCount").html("<a href='javascript:void(0);' style='font-size: 24px;color: #F5834C;' onclick='displayEmsInfo(0)'>"+eventCount+"</a>");
				var chart = document.getElementById('emsEventInfo');
				var echart = echarts.init(chart);
				option = {
					title:{  
						     text:'事故信息',
						     x :"center",
							 y:"25px",
						     textStyle: {
						    	 	align:"center",
						        	fontFamily: "微软雅黑",
						        	fontSize: 15,
						        	color: "#999"
						        }
						  },  
					/*title : {
						text: '事故信息 ',
						x : 'center'
					},*/
					tooltip : {
						trigger : 'item',
						formatter : "{a} <br/>{b} : {c} ({d}%)"
					},
					legend: {
			            orient : 'vertical',
			            data:[ '特别重大事故', '重大事故', '较大事故', '一般事故' ],
			            itemGap: 3,
			            itemHeight: 10,
			            itemWidth: 10,
			            x: '70%',
			            y: '10px'
			        },
					calculable : true,
					series : [ {
						name : '事故信息',
						type : 'pie',
						radius : [ '29%', '50%' ],
						itemStyle : {
							normal : {
								label:{
									show:true,
//									formatter: '{b} : {c} \n ({d}%)'
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
							value : data.LEVEL1,
							name : '特别重大事故'
						}, {
							value : data.LEVEL2,
							name : '重大事故'
						}, {
							value : data.LEVEL3,
							name : '较大事故'
						}, {
							value : data.LEVEL4,
							name : '一般事故'
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
		}
	});
}


/**
 * 应急资源柱状图统计
 */
function emsReourceInfo(userid) {
	$.ajax({
		type : 'post',
		url : BASE_URL + '/ems/emswelconme/loadResourceInfo',
		cache : false,
		data :{userid:userid},
		dataType : 'json',
		global : false,
		success : function(data) {
			if (data) {
				var chart  = document.getElementById('emsResourceInfo')
				
				var myChart = echarts.init(chart);
				var option = {
						title:{  
						     text:'应急资源',
						     x :"center",
							 y:"25px",
						     textStyle: {
						    	 	align:"center",
						        	fontFamily: "微软雅黑",
						        	fontSize: 12,
						        	color: "#999"
						        }
						  },  
					/*title : {
						text: '应急资源 ',
						x : 'center',
						y : 'top',
					},*/
					tooltip : {
						trigger : 'item'
					},
					grid: {
				        left: '3%',
				        right: '5%',
				        bottom: '3%',
				        containLabel: true
					},
					calculable : false,
					xAxis : [ {
						type : 'category',
						data : [ '应急机构', '应急队伍', '应急专家', '应急仓库','应急物资', '医疗机构', '避难场所' ],
//						name : "分类",
		                axisLabel: {
		                    interval: 0,//标签设置为全部显示
		                    formatter: function (params) {
		                        var newParamsName = "";// 最终拼接成的字符串
		                        var paramsNameNumber = params.length;// 实际标签的个数
		                        var provideNumber = 2;// 每行能显示的字的个数
		                        var rowNumber = Math.ceil(paramsNameNumber / provideNumber);// 换行的话，需要显示几行，向上取整
		                        /**
		                         * 判断标签的个数是否大于规定的个数， 如果大于，则进行换行处理 如果不大于，即等于或小于，就返回原标签
		                         */
		                        // 条件等同于rowNumber>1
		                        if (paramsNameNumber > provideNumber) {
		                            /** 循环每一行,p表示行 */
		                            for (var p = 0; p < rowNumber; p++) {
		                                var tempStr = "";// 表示每一次截取的字符串
		                                var start = p * provideNumber;// 开始截取的位置
		                                var end = start + provideNumber;// 结束截取的位置
		                                // 此处特殊处理最后一行的索引值
		                                if (p == rowNumber - 1) {
		                                    // 最后一次不换行
		                                    tempStr = params.substring(start, paramsNameNumber);
		                                } else {
		                                    // 每一次拼接字符串并换行
		                                    tempStr = params.substring(start, end) + "\n";
		                                }
		                                newParamsName += tempStr;// 最终拼成的字符串
		                            }

		                        } else {
		                            // 将旧标签的值赋给新标签
		                            newParamsName = params;
		                        }
		                        //将最终的字符串返回
		                        return newParamsName
		                    }
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
						name : "数量(个)",
			            show: false,
			            splitLine:{  
			            　　　　			show:false  
			            　　 		} 
					} ],
					series : [ {
						name : '应急资源',
						type : 'bar',
						barWidth: '30',
						itemStyle : {
							normal : {
								color : function(params) {
									var colorList = ['#53CFB3','#4990E2','#A28EC3','#F8E81C','#F6A623','#ED5851','#7ED321', ];
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
						data : data.data
					} ]
				};
				myChart.setOption(option);
				$(window).resize(function(){
			    	var width = $(window).innerWidth();
			    	width = (width-80)/3;
			    	$("#emsResourceInfo").css('width',width);
			    	myChart.resize();
			    });

			}
		}
	});
}

/**
 * 显示详情
 * @param index
 */
function displayEmsInfo(index){
	if (index == "0") {
		//事件信息
		parent.openWin(BASE_URL + "ems/emssucevent/GOV_YJGL_YJJY_SGSB","应急事故", "80%", "80%");
	}else if (index == "1") {
		//政府预案
		parent.openWin(BASE_URL + "ems/emsplaplaninfo/1/GOV_YJGL_YJYA_ZFYA","政府预案", "80%", "80%");
	}else if (index == "2") {
		//企业预案
		parent.openWin(BASE_URL + "ems/emsplaplaninfo/2/GOV_YJGL_YJYA_QYYA","企业预案", "80%", "80%");
	}
}

function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)return unescape(r[2]);
    return null;
}
