/**
 * Created by Administrator on 2017/10/25.
 */
function initHiddendangerInfo() {
    $.ajax({
        type: "post",
        url: BASE_URL + "hid/welcome/loadDangerCount",
        data: {},
        success: function (data) {
            if (data) {
                $("#zczb").html("<a href='javascript:void(0);' style='font-size: 24px;color: #F5834C;' onclick='displayHdi(0)'>" + data.zczbcount + "</a>");
                $("#wgxc").html("<a href='javascript:void(0);' style='font-size: 24px;color: #4990E2;' onclick='displayHdi(1)'>" + data.wgxccount + "</a>");
                $("#yhzg").html("<span style='font-size: 24px;color: #7DBA3A;'>"+data.rate.toFixed(2)+"%</span>");
                //加载执法状态柱状图
                initHdidangerMap(data.yzgList, data.wzgList);
            }
        }

    });
}

/**
 * 详细查看
 */
function displayHdi(type) {
    //返回当前选中行政执法的列表
    if (type == "0") {
        //自查自报隐患数
        parent.openWin(BASE_URL+"/views/module/hidden/hidcount/govHiddendangerList.html?isgov=0", "自查隐患列表", "80%", "80%");
    } else if (type == "1") {
        //网格巡查隐患数
        parent.openWin(BASE_URL+"/views/module/hidden/hidcount/govHiddendangerList.html?isgov=1", "巡查隐患列表", "80%", "80%");
    }
}

/**
 *
 * @param yzgdata 已整改
 * @param wzgdata 未整改
 */
function initHdidangerMap(yzgdata, wzgdata) {
    var option = {
        title: {
            text: '隐患排查数量',
            x: "center",
            y: "25px",
            textStyle: {
                align: "center",
                fontFamily: "微软雅黑",
                fontSize: 12,
                color: "#999"
            }
        },
        grid: {
            left: '3%',
            right: '12%',
            bottom: '3%',
            containLabel: true
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            orient: 'vertical',
            data: ['已整改', '未整改'],
            itemGap: 3,
            itemHeight: 10,
            itemWidth: 10,
            x: '83%',
            y: '25px'
        },
        calculable: false,
        xAxis: [{
            type: 'category',
            data: ["自查自报", "网格巡查"],
//            name: "分类",
            axisLine: {
            	show: false
            },
            splitLine:{  
　　　　				show:false  
　　 			},
　　 			axisTick: {
　　 				show: false
　　 			}
        }],
        yAxis: [{
            type: 'value',
            name: "数量(个)",
            show: false,
            splitLine:{  
            　　　　			show:false  
            　　 		}  
        }],
        series: [{
            name: '已整改',
            type: 'bar',
            barWidth: '40',
            itemStyle: {
                normal: {
                    color: '#F5834C',
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
            data: yzgdata
        },
            {
                name: '未整改',
                type: 'bar',
                barWidth: '40',
                itemStyle: {
                    normal: {
                        color: '#7DBA3A',
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
                data: wzgdata
            }
        ]
    };

    var myChart = echarts.init(document.getElementById('dangerchart'));
    //使用制定的配置项和数据显示图表
    myChart.setOption(option);
    $(window).resize(function () {
        var width = $(window).innerWidth();
        width = (width - 80) / 3;
        $("#dangerchart").css('width', width);
        myChart.resize();
    });

}
