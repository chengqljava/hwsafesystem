$(function () {
    var userid = getQueryString("userid");
    var year = getQueryString("year");
    initMonitorInfo(userid, year);
});

function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)return unescape(r[2]);
    return null;
}


function showClassMonitorBar(warningValues) {
    // 基于准备好的dom，初始化echarts图表
    var myChart = echarts.init(document.getElementById('monitorBarChart'));
    var option = {
	    title: {
            text: '实时报警',
            textStyle: {
                align: "center",
                fontFamily: "微软雅黑",
                fontSize: 12,
                color: "#999"
            }, x: "center",
            y: "25px"
	    },
	    tooltip: {
	        trigger: 'axis',
	        feature: {
	            saveAsImage: {}
	        }
	    },
	    legend: {
	    	orient: 'vertical',
            data: ['低报', '高报', '超低报', '超高报']
	    },
	    grid: {
	        left: '3%',
	        right: '8%',
	        bottom: '3%',
	        containLabel: true
	    },
	    xAxis: {
	        type: 'category',
	        boundaryGap: false,
            data: ['低报', '高报', '超低报', '超高报'],
            axisLine: {
            	show: false
            },
            splitLine:{  
　　　　				show:false  
　　 			},
　　 			axisTick: {
　　 				show: false
　　 			}
	    },
	    yAxis: {
	        type: 'value',
            show: false,
            splitLine:{  
            　　　　			show:false  
            　　 		} 
	    },	
        calculable: false,//false 禁止拖动
        series: [
            {
//                name: '低报',
                type: 'line',
//                symbol:'pin',//拐点样式
                symbolSize: 12,//拐点大小
                symbolWith: 5,
//                data: [10,18,3,1],
                data: warningValues,
                itemStyle : {  
                    normal : {  
                    	color: '#F7BE4B',
                        lineStyle:{  
                        	width:4,//折线宽度
                            color:'#F7BE4B'                            
                        },
	                	label: {
		                	show: true,
		                	position: 'top'
	                	}
                    }  
                }, 
            }        
        ]
    };
    myChart.setOption(option);

    $(window).resize(function () {
        var width = $(window).innerWidth();
        width = (width - 80) / 3;
        $("#monitorBarChart").css('width', width);
        myChart.resize();
    });
}
function initMonitorBar(warningCounts) {
    var dbCount = warningCounts.DBCOUNT == null ? 0 : warningCounts.DBCOUNT;
    var gbCount = warningCounts.GBCOUNT == null ? 0 : warningCounts.GBCOUNT;
    var cdbCount = warningCounts.CDBCOUNT == null ? 0 : warningCounts.CDBCOUNT;
    var cgbCount = warningCounts.CGBCOUNT == null ? 0 : warningCounts.CGBCOUNT;

    var warningValues = [dbCount, gbCount, cdbCount, cgbCount];
    showClassMonitorBar(warningValues);
}
//进入企业列表
function intoEntList(type) {

    var stime = getFormatDate(new Date());
    var etime = getFormatDate(new Date());
    var districtid = "";

    var statuses = "";
    var title = "";
    var dangertype = "";
    var dangersource = "";
    var chemical = "";
    var notIn = "";

    switch (type) {
        case "notIn":
            //未接入的企业
            title = "未接入企业";
            notIn = "true";
            break;
        case "in":
            title = "已接入企业";
            dangertype = "1,2,3";
            break;
    }
//    parent.openWin(BASE_URL + 'views/module/monitor/monitorcondition/entInfoList.html?stime=' + stime + '&etime=' + etime + '&statuses=' + statuses + '&districtid=' + districtid + '&dangersource=' + dangersource + '&notIn=' + notIn + '&dangertype=' + dangertype, title, '80%', '90%');
    parent.openWin(BASE_URL + 'views/module/monitor/monitorcondition/entInfoListForMainPage.html?stime=' + stime + '&etime=' + etime + '&statuses=' + statuses + '&districtid=' + districtid + '&dangersource=' + dangersource + '&notIn=' + notIn + '&dangertype=' + dangertype, title, '80%', '90%');
}
//进入报警列表（全部和未处理）
function intoAlarmInfoList(type) {
    var stime = getFormatDate(new Date(), "yyyy-MM-dd");
    var etime = getFormatDate(new Date(), "yyyy-MM-dd");
    var districtid = "";

    var statuses = "";
    var title = "";
    var dangertype = "";
    var handlestatus = "";

    switch (type) {
        case "all":
            title = "今日报警列表";
            break;
        case "nohandle":
            title = "今日报警未处理列表";
            break;
    }


    parent.openWinWithCloseCallback(BASE_URL + 'views/module/monitor/monitorcondition/alarmInfoList.html?stime=' + stime + '&etime=' + etime + '&statuses=' + statuses + '&districtid=' + districtid + '&dangertype=' + dangertype + '&handlestatus=' + handlestatus, title, '80%', '90%', true, null, function () {
        initMonitorInfo("");
    });

}
/**
 * Created by Administrator on 2017/10/25.
 */
function initMonitorInfo(userid, year) {
    var notInEntCount = 0;
    var typeEntCount = 0;
    $.ajax({
        type: "post",
        url: BASE_URL + "monitor/welcome/monitorInfo",
        data: {
            etime: getFormatDate(new Date(), "yyyy-MM-dd"),
            stime: getFormatDate(new Date(), "yyyy-MM-dd"),
            userid: userid,
            year: year
        },
        success: function (data) {
            if (data) {
                var entCounts = data.entCounts;
                var totalEntCount = 0;
                $.each(entCounts, function (i, item) {
                    totalEntCount += parseInt(item.ENTCOUNT);
                    switch (item.DANGERTYPE) {
                        case "1":
                            typeEntCount += parseInt(item.ENTCOUNT);
                            break;
                        case "2":
                            typeEntCount += parseInt(item.ENTCOUNT);
                            break;
                        case "3":
                            typeEntCount += parseInt(item.ENTCOUNT);
                            break;
                    }
                });
                notInEntCount = totalEntCount - typeEntCount;
                $("#notInEntCount").html(notInEntCount);
                $("#inEntCount").html(typeEntCount);
                var warningCounts = data.warningCounts;
                if (warningCounts) {
                    $("#todayWarningCount").html(warningCounts.TOTALWARNING);
                    $("#noHandleCount").html(warningCounts.NOHANDLECOUNT == null ? '0' : warningCounts.NOHANDLECOUNT);

                    initMonitorBar(warningCounts);
                }

            }
        }
    });

    $("#notInEntCount").off("click").on("click", function () {
        intoEntList("notIn");
    });
    $("#inEntCount").off("click").on("click", function () {
        intoEntList("in");
    });
    $("#todayWarningCount").off("click").on("click", function () {
        intoAlarmInfoList("all");
    });
    $("#noHandleCount").off("click").on("click", function () {
        intoAlarmInfoList("nohandle");
    });


}