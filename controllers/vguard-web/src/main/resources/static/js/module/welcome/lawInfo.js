/**
 *
 * Created by Administrator on 2017/10/25.
 */
function initLawInfo() {
    $.ajax({
        type: "post",
        url: BASE_URL + "law/welcome/lawinfo",
        data: {},
        success: function (data) {
            if (data) {
                $("#jccount").html("<a href='javascript:void(0);' style='color:#F5834C;font-size: 24px;' onclick='displayLaw(0)'>" + data.jccount + "</a>");
                $("#fccount").html("<a href='javascript:void(0);' style='color:#4AA3E2;font-size: 24px;' onclick='displayLaw(1)'>" + data.fccount + "</a>");
                $("#ajcount").html("<a href='javascript:void(0);' style='color:#7DBB39;font-size: 24px;' onclick='displayLaw(2)'>" + data.ajcount + "</a>");
                //加载执法状态柱状图
                initLawtypeMap(data.ydata);
            }
        }

    });
}

/**
 * 详细查看
 */
function displayLaw(type) {
    //返回当前选中行政执法的列表
    if (type == "0") {
        //检查
        parent.openWin(BASE_URL + "law/lawcheckinfo/GOV_XZZF_ZFJC_ZFJC/0", "检查企业", "80%", "80%");
    } else if (type == "1") {
        //复查
        parent.openWin(BASE_URL + "law/lawcheckreview/GOV_XZZF_ZFJC_ZFFC/1", "检查企业", "80%", "80%");
    } else if (type == "2") {
        //案件总数
        parent.openWin(BASE_URL + "law/lawcount/intoLawcaseList/null", "检查企业", "80%", "80%");
    }
}

function initLawtypeMap(data) {
    //指定图标的配置和数据
    var option = {
        title: {
            text: '行政执法数量',
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
            right: '10%',
            bottom: '3%',
            containLabel: true
        },
        itemStyle: {
            normal: {
                color: function (params) {
                    //首先定义一个数组
                    var colorList = ['#4AA3E2', '#F5834C', '#7DBB39'];
                    return colorList[params.dataIndex]
                },
                label: {
                    show: false
                }
            }
        },
        //设置提示
        tooltip: {
            show: true
        },
        //设置坐标轴
        xAxis: [
            {
//		          name : '分类',
                type: 'category',
                data: ["已登记", "办理中", "已结案"],
                axisLine: {
                    show: false
                },
                splitLine: {
                    show: false
                },
                axisTick: {
                    show: false
                }
            }
        ],
        yAxis: [
            {
                name: '数量(个)',
                type: 'value',
                show: false,
                splitLine: {
                    show: false
                }
            }
        ],
        //设置数据
        series: [
            {
                "name": "数目",
                "type": "bar",
                "data": data,
                "barWidth": 40,//柱图宽度
                itemStyle: {
                    normal: {
                        label: {
                            show: true,
                            position: 'top',
                            formatter: function (params) {
                                if (params.value == 0) {
                                    return '';
                                } else {
                                    return params.value;
                                }
                            }
                        }
                    }
                },
            }
        ]
    };
    //初始化echarts实例
    var myChart = echarts.init(document.getElementById('lawchart'));
    //使用制定的配置项和数据显示图表
    myChart.setOption(option);
    $(window).resize(function () {
        var width = $(window).innerWidth();
        width = (width - 80) / 3;
        $("#lawchart").css('width', width);
        myChart.resize();
    });

}


