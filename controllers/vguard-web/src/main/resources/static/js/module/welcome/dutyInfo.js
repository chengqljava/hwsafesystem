function initDutyInfo() {
    $.ajax({
        type: "post",
        url: BASE_URL + "ems/emsdutyalarm/loadnum",
        dataType: "json",
        async: false,
        data: {
            starttime: "",
            endtime: ""
        },
        success: function (data) {
            if (data) {
                $("#zxcount").text(data.zx);
                $("#tscount").text(data.tx);
                $("#gzcount").text(data.gz);
                $("#bjcount").text(data.bj);
                var datas = [];
                datas.push(data.zx||0);
                datas.push(data.tx||0);
                datas.push(data.gz||0);
                datas.push(data.bj||0);
                console.log(datas);
                initDutyMap(datas);
            }

        },
        error: function () {
            parent.toast("初始化信息加载失败");
        }
    });
}

function showDutyInfo(type) {
    parent.openWin(BASE_URL
        + "views/module/ems/emsdutyalarm/emsdutyalarmWelList.html?warnalarmtype="+type,
        '警情列表', '70%', '55%');
}

function initDutyMap(data) {
    //指定图标的配置和数据
    var option = {
        title: {
            text: '应急值守',
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
                    var colorList = ['#4AA3E2', '#ED5851', '#7DBA3A', '#F5834C'];
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
                data: ["咨询", "投诉", "故障", "报警"],

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
    var myChart = echarts.init(document.getElementById('dutyInfoChart'));
    //使用制定的配置项和数据显示图表
    myChart.setOption(option);
    $(window).resize(function () {
        var width = $(window).innerWidth();
        width = (width - 80) / 3;
        $("#lawchart").css('width', width);
        myChart.resize();
    });

}