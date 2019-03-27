function initEntCount(data) {
    $("#totalEntCount").html(data.TOTALCOUNT);
    $("#dangerEntCount").html(data.DANGERCOUNT);
    $("#chemicalEntCount").html(data.CHEMICALCOUNT);
    $("#dangerSourceCount").html(data.WXYS);
}
function initBar(entBarChart) {

    var industrynum = 0;
    var businessnum = 0;
    var trafficnum = 0;
    var engineeringtnum = 0;
    var classData = ["工业及危化品类","商贸及服务类", "交通运输类", "工程建设类"];
    var classValue = [];
    if (entBarChart != null) {
        for (var i = 0; i < entBarChart.length; i++) {
            var industrytype = entBarChart[i].INDUSTRYTYPE; //分类
            var classnum = entBarChart[i].CLASSNUM; //分类数量
            if (industrytype == 1) {
                if (classnum != null && classnum != "") {
                    industrynum = classnum;
                } else {
                    industrynum = 0;
                }
            } else if (industrytype == 2) {
                if (classnum != null && classnum != "") {
                    businessnum = classnum;
                } else {
                    businessnum = 0;
                }
            } else if (industrytype == 3) {
                if (classnum != null && classnum != "") {
                    trafficnum = classnum;
                } else {
                    trafficnum = 0;
                }
            } else if (industrytype == 4) {
                if (classnum != null && classnum != "") {
                    engineeringtnum = classnum;
                } else {
                    engineeringtnum = 0;
                }
            }
        }
    }

    classValue[0] = industrynum;
    classValue[1] = businessnum;
    classValue[2] = trafficnum;
    classValue[3] = engineeringtnum;
    showClassBar(classData, classValue);//分类饼状图
}


/**
 * 显示分类饼状图统计
 * @param classData
 * @param classValue
 */
function showClassBar(classData, classValue) {
    // 基于准备好的dom，初始化echarts图表
    var myChart = echarts.init(document.getElementById('entBarChart'));
    var option = {
        title: {
            text: '企业类型分布',
            textStyle: {
                align: "center",
                fontFamily: "微软雅黑",
                fontSize: 12,
                color: "#999"
            }, x: "center", y: "25px"
        },
        color: ["#4AA3E2"],
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            orient: 'vertical',
            data: classData
        },
        xAxis: [
            {
//                name: '分类',
                type: 'category',
                data: classData,
                axisLabel: {
                    interval: 0,//标签设置为全部显示
                    formatter: function (params) {
                        var newParamsName = "";// 最终拼接成的字符串
                        var paramsNameNumber = params.length;// 实际标签的个数
                        var provideNumber = 4;// 每行能显示的字的个数
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
            }
        ],
        yAxis: [
            {
                name: '数量(家)',
                type: 'value',
                show: false,
                splitLine:{  
                　　　　			show:false  
                　　 		}                
            }
        ],
        calculable: false,//false 禁止拖动
        series: [
            {
                name: '数量',
                type: 'bar',
                barWidth: '40',
                data: classValue,
                itemStyle: {
                	normal: {
	                	label: {
		                	show: true,
		                	position: 'top',
		                	textStyle: {
		                		color: '#666666'
		                	},
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
            }
        ],
        grid: {
            left: '3%',
            right: '10%',
            bottom: '3%',
            containLabel: true
        }
    };
    myChart.setOption(option);


    $(window).resize(function () {
        var width = $(window).innerWidth();
        width = width * 0.3;
        $("#entBarChart").css('width', width);
        myChart.resize();
    });

}

function showPieChart(classValue) {
    // 基于准备好的dom，初始化echarts图表
    var myChart = echarts.init(document.getElementById('entCircleChart'));
    var option = {
        title: {
            text: '重大危险源',
            textStyle: {
                align: "center",
                fontFamily: "微软雅黑",
                fontSize: 12,
                color: "#999"
            }, x: "center", y: "25px"
        },
        tooltip : {
            trigger: '重大危险源',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
            orient : 'vertical',
            data:['一级','二级','三级','四级'],
            itemGap: 3,
            itemHeight: 10,
            itemWidth: 10,
            x: '70%',
            y: '25px'
        },
        calculable : true,
        series : [
            {
                name:'危险源数量',
                type:'pie',
                radius : ['25%', '50%'],
                itemStyle : {
                    normal : {
                        label : {
                            show : false
                        },
                        labelLine : {
                            show : false
                        },
                        color: function (params) {
                        	var color = ['#4AA3E2', '#F7BE4B', '#F5834C', '#ED5851'];
                        	return color[params.dataIndex];
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
                            fontSize: '25',
                            fontWeight: 'bold'
                        }
                    }
                },
                data:classValue
            }
        ]      
    };

    myChart.setOption(option);

    $(window).resize(function () {
        var width = $(window).innerWidth();
        width = width * 0.3;
        $("#entCircleChart").css('width', width);
        myChart.resize();
    });
}
function initPie(entCircleChart) {
    var levelOneCount = 0;
    var levelTwoCount = 0;
    var levelThreeCount = 0;
    var levelFourCount = 0;
    var classValue = [];
    $.each(entCircleChart, function (i, item) {
        switch (item.DANGERLEVEL) {
            case "1":
                levelOneCount = item.WXYS;
                break
            case "2":
                levelTwoCount = item.WXYS;
                break;
            case "3":
                levelThreeCount = item.WXYS;
                break
            case "4":
                levelFourCount = item.WXYS;
                break;
        }
    });
    classValue[0] = {value: levelOneCount, name: "一级"};
    classValue[1] = {value: levelTwoCount, name: "二级"};
    classValue[2] = {value: levelThreeCount, name: "三级"};
    classValue[3] = {value: levelFourCount, name: "四级"};
    showPieChart(classValue);
}
//手机端访问需要传userid参数，解决session问题
var userid = getQueryString("userid");
/**
 * 企业信息
 */
function initEntInfo() {


    //获取企业类型信息
    $.ajax({
        type: "post",
        url: BASE_URL + "ent/welcome/entinfo",
        data: {userid: userid},
        success: function (data) {
            if (data) {
                initEntCount(data);
                initBar(data.entBarChart);
                initPie(data.entCircleChart);
            }
        }
    });

    $("#totalEntCount").off("click").on("click", function () {
        intoEntStatus("totalEnt");
    });

    $("#chemicalEntCount").off("click").on("click", function () {
        intoEntStatus("whpEnt");
    });
    $("#dangerEntCount").off("click").on("click", function () {
        intoEntStatus("wxyEnt");
    });
    $("#dangerSourceCount").off("click").on("click", function () {
        intoDangerList("", "");
    });



}


/**
 * 进入企业采集状态列表页面
 */
function intoEntStatus(statustype) {
    var stime = getFormatDate(new Date());
    var etime = getFormatDate(new Date());
    var districtid = "";

    var statuses = "";
    var title = "";
    var dangertype = "";
    var dangersource = "";
    var chemical = "";
    switch (statustype) {
        case "totalEnt":
            title = "监测监控企业";
            break;
        case "whpEnt":
            title = "危化品类企业";
            chemical = "1";
            break;
        case "wxyEnt":
            title = "重大危险源企业";
            dangersource = "1";
            break;
    }
    parent.openWin(BASE_URL + 'views/module/monitor/monitorcondition/entInfoList.html?stime=' + stime + '&etime=' + etime + '&statuses=' + statuses + '&districtid=' + districtid + '&dangersource=' + dangersource + '&chemical=' + chemical, title, '80%', '90%');
}

/**
 * 进入重大危险源列表
 * @author lzqiang
 * @date 2016年7月14日 上午9:33:30
 */
function intoDangerList(dangerType, dangerLevel) {
    parent.openWin(BASE_URL + "/dangersource/dssStatistics/intoDssDangerList?districtid=&dangerType=" + dangerType + "&dangerLevel=" + dangerLevel, '危险源信息', '80%', '65%');
}

function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)return unescape(r[2]);
    return null;
}