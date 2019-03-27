$(document).ready(
		function() {
			changQarter();
			onclick();
			var currYear = new Date().getFullYear();
			var html = "<li>" + (currYear - 4) + "</li>" + "<li>"
					+ (currYear - 3) + "</li>" + "<li>" + (currYear - 2)
					+ "</li>" + "<li>" + (currYear - 1) + "</li>"
					+ "<li class='cur'>" + currYear + "</li>";
			$(".year").html(html);
			$(".year").on("click","li",function() {
						$(this).addClass('cur').siblings().removeClass('cur');
						setTimeByQarter($(this).text(), $("#quarter").val());
						onclick();
						if ($(this).index() == 0) {
							var year = parseInt($(this).text());
							var html = "<li>" + (year - 2) + "</li>" + "<li>"
									+ (year - 1) + "</li>" + "<li class='cur'>"
									+ year + "</li>" + "<li>" + (year + 1)
									+ "</li>" + "<li>" + (year + 2) + "</li>";
							$(".year").html(html);
						} else if ($(this).index() == 4) {
							var year = parseInt($(this).text());
							var curYear = new Date().getFullYear();
							if (year != curYear) {
								var html = "<li>" + (year - 2) + "</li>"
										+ "<li>" + (year - 1) + "</li>"
										+ "<li class='cur'>" + year + "</li>"
										+ "<li>" + (year + 1) + "</li>"
										+ "<li>" + (year + 2) + "</li>";
								$(".year").html(html);
							}
						}
					});

			$(".quarter").find("li").each(function() {
				$(this).bind("click", function() {
					$(this).addClass('cur').siblings().removeClass('cur');
					var year = $("#stime").val().substring(0, 4);
					$("#quarter").val($(this).text());
					setTimeByQarter(year, $(this).text());
					onclick();
				});
			});

			EntSelfCheckChart();
			showPieEChartSG();
		});

/**
 * 季度切换
 */
function changQarter() {
	var curYear = new Date().getFullYear();
	var curMonth = new Date().getMonth() + 1;
	var curQarter = getQarter2Month(curMonth);
	switch (curQarter) {
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
	$("#" + curQarter).addClass("cur");
	$("#quarter").val(curQarter);
	setTimeByQarter(curYear, curQarter);
}

/**
 * 根据季度设置时间
 * 
 * @param qarter
 */
function setTimeByQarter(year, qarter) {
	if (qarter == 1) {
		$("#stime").val(year + "-01-01");
		$("#etime").val(year + "-03-31");
	} else if (qarter == 2) {
		$("#stime").val(year + "-04-01");
		$("#etime").val(year + "-06-30");
	} else if (qarter == 3) {
		$("#stime").val(year + "-07-01");
		$("#etime").val(year + "-09-30");
	} else if (qarter == 4) {
		$("#stime").val(year + "-10-01");
		$("#etime").val(year + "-12-31");
	}
	$("#year").val(year);
}

/**
 * 根据月份获取季度
 * 
 * @param month
 */
function getQarter2Month(month) {
	if (1 <= month && month <= 3) {
		return 1;
	} else if (4 <= month && month <= 6) {
		return 2;
	} else if (7 <= month && month <= 9) {
		return 3;
	} else {
		return 4;
	}
}

/* 加载行政区域 */
function searchDistrict(districtid) {
	$("#districtid").val(districtid);
	onclick();
}

/**
 * 点击事件进行查询
 */
function onclick() {
	/** 列表加载项* */
	HdiEntCount(); // 隐患排查统计
	/** 单选加载项* */
	selectEChartType();
	//加载事故饼图
	showPieEChartSG();
}

/**
 * 隐患排查统计报告
 */
function HdiEntCount() {
	$.ajax({
		type : 'post',
		url : BASE_URL + '/ems/managecount/report',
		cache : false,
		data : $("#hdientcountform").serializeArray(),
		dataType : 'json',
		global : false,
		success : function(map) {
			if (map.success == true) {
				$("#orgCount").html(map.data.orgCount);
				$("#teamCount").html(map.data.teamCount);
				$("#expertCount").html(map.data.expertCount);
				$("#deposCount").html(map.data.deposCount);
				$("#materialCount").html(map.data.materialCount);
				$("#healthdeptCount").html(map.data.healthdeptCount);
				$("#shelterCount").html(map.data.shelterCount);
				$("#govplan1").html(map.govplan1);
				$("#govplan2").html(map.govplan2);
				$("#govplan3").html(map.govplan3);
				$("#entplan1").html(map.ENTPLAN1);
				$("#entplan2").html(map.ENTPLAN2);
				$("#entplan3").html(map.ENTPLAN3);
				$("#succount").html(map.succount);
				$("#ysbcount").html(map.ysbcount);
				$("#yclcount").html(map.yclcount);
				$("#yjacount").html(map.yjacount);
			}
		}
	});
}

/**
 * 转为百分数
 * 
 * @param data
 * @returns {String}
 */
function toPercent(data) {
	var strData = parseFloat(data) * 100;
	var ret = strData.toString() + "%";
	return ret;
}

/**
 * 企业总计列表
 */
/*function getEntList() {
	parent.openWin(BASE_URL + "/hiddendanger/hdientcount/dispalyentlist",
			'监管企业', '80%', '60%');
}*/

/**
 * 
 */
function getEmsResource(checkresult) {
	
	if (checkresult == "1") {
		parent.openWin(BASE_URL
				+ "/ems/emsresorg/orglist?",'应急机构列表','80%', '70%');
	}else if(checkresult == "2"){
		parent.openWin(BASE_URL
				+ "/ems/emsresteam/loadTeam?",'应急队伍列表','80%', '70%');
	}else if(checkresult == "3"){
		parent.openWin(BASE_URL
				+ "/ems/emsresexpert/loadExpert?",'应急专家列表','80%', '70%');
	}else if(checkresult == "4"){
		parent.openWin(BASE_URL
				+ "/ems/emsresdepos/loadDepos?",'应急仓库列表','80%', '70%');
	}else if(checkresult == "5"){
		parent.openWin(BASE_URL
				+ "/ems/emsresmaterial/loadMaterial?",'应急物资列表','80%', '70%');
	}else if(checkresult == "6"){
		parent.openWin(BASE_URL
				+ "/views/module/ems/healthdept/healthdeptList.html?",
				'医疗机构列表', '80%', '70%');
	}else if(checkresult == "7"){
		parent.openWin(BASE_URL
				+ "/views/module/ems/shelter/shelterList.html?",
				'避难场所列表', '80%', '70%');
	}
}

/**
 * 预案信息
 * @param checkresult
 */
function getPlanInfo(checkresult){
	var begintime = $("#stime").val();
	var endtime = $("#etime").val();
	var usertype = checkresult.substring(0,3);
	var plantype = checkresult.substring(4);
	parent.openWin(BASE_URL
		+ "/ems/emsplaplaninfo/loadPlanInfo?begintime="+begintime+"&endtime="+endtime+"&usertype="+usertype+"&plantype="+plantype,'应急预案列表','80%', '70%');
}

/**
 * 事故信息概况 
 * @param checkresult
 */
function getSucEventList(checkresult){
	var begintime = $("#stime").val();
	var endtime = $("#etime").val();
	if (checkresult == "1") {
		parent.openWin(BASE_URL
				+ "/ems/emssucevent/loadSucEvent?begintime="+begintime+"&endtime="+endtime+"&state="+"",'事故信息','80%', '70%');
	}else if(checkresult == "2"){
		parent.openWin(BASE_URL
				+ "/ems/emssucevent/loadSucEvent?begintime="+begintime+"&endtime="+endtime+"&state="+"2",'事故信息','80%', '70%');
	}else if(checkresult == "3"){
		parent.openWin(BASE_URL
				+ "/ems/emssucevent/loadSucEvent?begintime="+begintime+"&endtime="+endtime+"&state="+"3",'事故信息','80%', '70%');
	}else if(checkresult == "4"){
		parent.openWin(BASE_URL
				+ "/ems/emssucevent/loadSucEvent?begintime="+begintime+"&endtime="+endtime+"&state="+"4",'事故信息','80%', '70%');
	}
}


/**
 * 应急预案饼状图默认为政府端
 */
function selectEChartType() {
	var radioValue = $('input:radio:checked').val();
	if (radioValue == 'qyyuan') {
		// 企业应急预案
		showPieEChartQYyuan();
	} else if (radioValue == 'zfyuan') {
		// 政府应急预案
		showPieEChartZFyuan();
	}
}

// 路径配置
require.config({
	paths : {
		echarts : BASE_URL + '/js/lib/echarts'
	}
});

/**
 * 应急资源柱状图统计
 */
function EntSelfCheckChart() {
	var stautsType = [ '应急机构', '应急队伍', '应急专家', '应急仓库', '应急物资', '医疗机构', '避难场所' ];
	$.ajax({
		type : 'post',
		url : BASE_URL + '/ems/managecount/emsResource',
		cache : false,
		data : $("#hdientcountform").serializeArray(),
		dataType : 'json',
		global : false,
		success : function(map) {
			if (map.success == true) {
				// 区县行政区域下填报情况统计
				if (map.data != null) {
					var json = "";
					require([ 'echarts', 'echarts/chart/bar' // 使用柱状图就加载bar模块，按需加载
					], function(ec) {
						// 基于准备好的dom，初始化echarts图表
						var myChart = ec.init(document.getElementById('p1'));
						var option = {
							title : {
								text: '应急资源概况 ',
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
								data : [ '应急机构', '应急队伍', '应急专家', '应急仓库',
										'应急物资', '医疗机构', '避难场所' ],
								name : "资源类型",
								axisLabel:{
									rotate	:45,
									interval :0
								}
							} ],
							yAxis : [ {
								type : 'value',
								name : "个数"
							} ],
							series : [ {
								name : '资源类型',
								type : 'bar',
								barWidth: '40',
								itemStyle : {
									normal : {
										color : function(params) {
											var colorList = [ '#C1232B',
													'#B5C334', '#FCCE10',
													'#E87C25', '#27727B',
													'#FE8463', '#9BCA63' ];
											return colorList[params.dataIndex]
										},
										label : {
											show : true,
											position : 'top',
										// formatter: '{b}\n{c}'
										}
									}
								},
								data : map.data,
							} ]
						};
						myChart.setOption(option);
					});

				}
			}
		}
	});
}

/**
 * 政府应急预案饼状图
 * 
 * @param categories
 * @param values
 */
function showPieEChartQYyuan() {

	$.ajax({
		type : 'post',
		url : BASE_URL + /*'/ems/managecount/emsPlaPlaninfo'*/'/ems/emscount/emsplantypecount',
		cache : false,
		data : $("#hdientcountform").serializeArray(),
		dataType : 'json',
		global : false,
		success : function(map) {
			if (map.success == true) {
				require([ 'echarts', 'echarts/chart/pie' ], function(ec) {
					var chart = document.getElementById('p2');
					var echart = ec.init(chart);
					option = {
						title : {
							text: '应急预案概况 ',
							x : 'center'
						},
						tooltip : {
							trigger : 'item',
							formatter : "{a} <br/>{b} : {c} ({d}%)"
						},
						legend : {
							orient : 'vertical',
							x : 'left',
							data : [ '政府综合预案', '政府专项预案', '政府应急处置预案' ]
						},
						toolbox : {
							show : false,
							feature : {
								mark : {
									show : false
								},
								dataView : {
									show : true,
									readOnly : false
								},
								magicType : {
									show : false,
									type : [ 'pie', 'funnel' ],
									option : {
										funnel : {
											x : '25%',
											width : '50%',
											funnelAlign : 'left',
											max : 1548
										}
									}
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
						series : [ {
							name : '政府应急预案',
							type : 'pie',
							radius : '55%',
							center : [ '50%', '60%' ],
							data : [ {
								value : map.datas.PLAN1,
								name : '政府综合预案'
							}, {
								value : map.datas.PLAN2,
								name : '政府专项预案'
							}, {
								value : map.datas.PLAN3,
								name : '政府应急处置预案'
							}, ]
						} ]
					};
					echart.setOption(option);
				});

			}
		}
	});
}

/**
 * 企业应急预案饼状图
 * 
 * @param categories
 * @param values
 */
function showPieEChartZFyuan() {
	$.ajax({
		type : 'post',
		url : BASE_URL + '/ems/managecount/emsPlaPlaninfo'/*'/ems/emscount/emsCount'*/,
		cache : false,
		data : $("#hdientcountform").serializeArray(),
		dataType : 'json',
		global : false,
		success : function(map) {
			console.log(map);
			if (map.success == true) {
				require([ 'echarts', 'echarts/chart/pie' ], function(ec) {
					var chart = document.getElementById('p2');
					var echart = ec.init(chart);
					option = {
						title : {
							text: '应急预案概况 ',
							x : 'center'
						},
						tooltip : {
							trigger : 'item',
							formatter : "{a} <br/>{b} : {c} ({d}%)"
						},
						legend : {
							orient : 'vertical',
							x : 'left',
							data : [ '企业综合预案', '企业专项预案', '企业应急处置预案' ]
						},
						toolbox : {
							show : false,
							feature : {
								mark : {
									show : false
								},
								dataView : {
									show : true,
									readOnly : false
								},
								magicType : {
									show : false,
									type : [ 'pie', 'funnel' ],
									option : {
										funnel : {
											x : '25%',
											width : '50%',
											funnelAlign : 'left',
											max : 1548
										}
									}
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
						series : [ {
							name : '企业应急预案',
							type : 'pie',
							radius : '55%',
							center : [ '50%', '60%' ],
							data : [ {
								value : map.ENTPLAN1,
								name : '企业综合预案'
							}, {
								value : map.ENTPLAN2,
								name : '企业专项预案'
							}, {
								value : map.ENTPLAN3,
								name : '企业应急处置预案'
							}, ]
						} ]
					};
					echart.setOption(option);
				});

			}
		}
	});
}

/**
 * 事故信息
 * 
 * @param categories
 * @param values
 */
function showPieEChartSG() {
	$.ajax({
		type : 'post',
		url : BASE_URL + '/ems/managecount/emsSucEvent',
		cache : false,
		data : $("#hdientcountform").serializeArray(),
		dataType : 'json',
		global : false,
		success : function(map) {
			if (map.success == true) {
				require([ 'echarts', 'echarts/chart/pie' ], function(ec) {
					var chart = document.getElementById('p3');
					var echart = ec.init(chart);
					option = {
						title : {
							text: '事故信息概况 ',
							x : 'center'
						},
						tooltip : {
							trigger : 'item',
							formatter : "{a} <br/>{b} : {c} ({d}%)"
						},
						legend : {
							orient : 'vertical',
							x : 'left',
							data : [ '特别重大事故', '重大事故', '较大事故', '一般事故' ]
						},
						toolbox : {
							show : false,
							feature : {
								mark : {
									show : false
								},
								dataView : {
									show : true,
									readOnly : false
								},
								magicType : {
									show : false,
									type : [ 'pie', 'funnel' ],
									option : {
										funnel : {
											x : '25%',
											width : '50%',
											funnelAlign : 'left',
											max : 1548
										}
									}
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
						series : [ {
							name : '事故信息',
							type : 'pie',
							radius : '55%',
							center : [ '50%', '60%' ],
							data : [ {
								value : map.LEVEL1,
								name : '特别重大事故'
							}, {
								value : map.LEVEL2,
								name : '重大事故'
							}, {
								value : map.LEVEL3,
								name : '较大事故'
							}, {
								value : map.LEVEL4,
								name : '一般事故'
							}, ]
						} ]
					};
					echart.setOption(option);
				});

			}
		}
	});
}
