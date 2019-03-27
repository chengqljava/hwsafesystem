$(document).ready(function() {
	HdiEntCount();
	//初始化加载图标
	showHealthData('zyb');
});

/**
 * 点击事件进行查询
 */
function onclick() {
	/** 列表加载项* */
	HdiEntCount(); // 隐患排查统计
	/** 单选加载项* */
	selectEChartType();
}

/**
 * 职业健康统计报告
 */
function HdiEntCount() {
	$.ajax({
		type : 'post',
		url : BASE_URL + '/health/ochcount/loadochcount',
		cache : false,
		data : $("#hdientcountform").serializeArray(),
		dataType : 'json',
		global : false,
		success : function(map) {
			if (map.success == true) {
				$("#cureCount").html(map.cureCount);
				$("#equipmentCount").html(map.equipmentCount);
				$("#defendCount").html(map.defendCount);
				$("#laborCount").html(map.laborCount);
				$("#gg").html(map.workerCount.GG);
				$("#jsjgg").html(map.workerCount.JSJGG);
				$("#js").html(map.workerCount.JS);
				$("#fjs").html(map.workerCount.FJS);
				$("#yz").html(map.workerCount.YZ);
				$("#yjy").html(map.workerCount.YJY);
				$("#fyjy").html(map.workerCount.FYJY);
				$("#others").html(map.workerCount.OTHERS);
			}
		}
	});
}

/**
 * 健康状况
 * @param checkresult
 */
function loadInfo(checkresult){
	if (checkresult == 'zybfz') {
		//职业病防治
		parent.openWin(BASE_URL + "/health/ochcure/GOV_ZYJK_ZYJK_ZYBFZ",'职业病防治','80%', '70%');
	}else if (checkresult == 'xfsb') {
		//消防设备
		parent.openWin(BASE_URL + "/health/ochequipment/GOV_ZYJK_ZYJK_ZYBEQ",'消防设备','80%', '70%');
	}else if (checkresult == 'fhsb') {
		//防护设备
		parent.openWin(BASE_URL + "/health/ochdefend/GOV_ZYJK_FHSB_FHSBQC",'防护设备器材','80%', '70%');
	}else if (checkresult == 'ldyp') {
		//劳动用品
		parent.openWin(BASE_URL + "/health/ochlabor/GOV_ZYJK_FHSB_LDYP",'劳动用品','80%', '70%');
	}else {
		//劳动者
		parent.openWin(BASE_URL + "/health/ochcount/workerList/"+checkresult,'劳动者信息','80%', '70%');
	}
		
}

/**
 * // 职业病 防护设备 劳动者信息
 */
function selectEChartType() {
	var radioValue = $('input:radio:checked').val();
	if (radioValue == 'zyb' || radioValue == 'fhsbqc' ) {
		// 职业病 防护设备
		showHealthData(radioValue);
	} else if (radioValue == 'ldz') {
		// 劳动者
		showWorker(radioValue);
	}
}

// 路径配置
require.config({
	paths : {
		echarts : BASE_URL + '/js/lib/echarts'
	}
});

/**
 *显示防治信息
 * 
 * @param categories
 * @param values
 */
function showHealthData(type) {
	$.ajax({
		type : 'post',
		url : BASE_URL + '/health/ochcount/loadochecharts/'+type,
		cache : false,
		data : $("#hdientcountform").serializeArray(),
		dataType : 'json',
		global : false,
		success : function(map) {
			if (map.success == true) {
				require([ 'echarts', 'echarts/chart/pie' ], function(ec) {
					var chart = document.getElementById('p2');
					var echart = ec.init(chart);
					var option = OchType(type,map);
					console.log(option);
					echart.setOption(option);
				});
			}
		}
	});
}

/**
 * 劳动者信息
 */
function showWorker(type) {
	$.ajax({
		type : 'post',
		url : BASE_URL + '/health/ochcount/loadochecharts/'+type,
		cache : false,
		data : $("#hdientcountform").serializeArray(),
		dataType : 'json',
		global : false,
		success : function(map) {
			if (map.success == true) {
				// 区县行政区域下填报情况统计
					require([ 'echarts', 'echarts/chart/bar' // 使用柱状图就加载bar模块，按需加载
					], function(ec) {
						// 基于准备好的dom，初始化echarts图表
						var myChart = ec.init(document.getElementById('p2'));
						var option = {
							title : {
								text: '劳动者信息 ',
								x : 'center',
								y : 'top'
							},
							tooltip : {
								show : true,
								trigger : 'item'
							},
							toolbox : {
								show : false,
								feature : {
									dataView : {
										show : true,
										readOnly : false
									},
									restore : {
										show : true
									},
									saveAsImage : {
										show : true
									}
								}
							},
							calculable : false,
							grid : {
								borderWidth : 0,
								y : 80,
								y2 : 60
							},
							xAxis : [ {
								type : 'category',
								data : [ '高工', '教授级高工', '教授', '副教授','院长', '研究员', '副研究员','其他' ],
								name : "类型",
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
							} ],
							yAxis : [ {
								type : 'value',
								name : "人数"
							} ],
							series : [ {
								name : '技术职称',
								type : 'bar',
								barWidth: '40',
								itemStyle : {
									normal : {
										color : function(params) {
											var colorList = [ '#C1232B',
													'#B5C334', '#FCCE10',
													'#E87C25', '#27727B',
													'#FE8463', '#9BCA63','#7ED321' ];
											return colorList[params.dataIndex]
										},
										label : {
											show : true,
											position : 'top',
										}
									}
								},
								data : map.workerList,
							} ]
						};
						myChart.setOption(option);
					});
				}
			}
	});
}

/**
 * 获取echart option设置
 * @param type
 */
function OchType(type,data){
	var option;
	if (type=='zyb'||typeof(type) == 'undefined') {
		option = {
			    title : {
			        text: '职业病',
			        x:'center'
			    },
			    tooltip : {
			        trigger: 'item',
			        formatter: "{a} <br/>{b} : {c} ({d}%)"
			    },
			    legend: {
			        orient : 'vertical',
			        x : 'left',
			        data:['预防','诊断','治疗']
			    },
			    calculable : false,
			    series : [
			        {
			            name:'防治表类型',
			            type:'pie',
			            radius : '58%',
			            center: ['50%', '50%'],
			            data:[
			                {value:data.cureCount.YF, name:'预防'},
			                {value:data.cureCount.ZD, name:'诊断'},
			                {value:data.cureCount.ZL, name:'治疗'}
			            ]
			        }
			    ]
			};
	}else if (type=='fhsbqc') {
		option = {
			    title : {
			        text: '防护设备器材',
			        x:'center'
			    },
			    tooltip : {
			        trigger: 'item',
			        formatter: "{a} <br/>{b} : {c} ({d}%)"
			    },
			    legend: {
			        orient : 'vertical',
			        x : 'left',
			        data:['正常运行','停止运行','维护中','报废']
			    },
			    calculable : false,
			    series : [
			        {
			            name:'设备使用情况',
			            type:'pie',
			            radius : '58%',
			            center: ['50%', '50%'],
			            data:[
			                {value:data.defendMap.ZCYX, name:'正常运行'},
			                {value:data.defendMap.TZYX, name:'停止运行'},
			                {value:data.defendMap.WHZ, name:'维护中'},
			                {value:data.defendMap.BF, name:'报废'}
			            ]
			        }
			    ]
			};
	}
	return option;
}