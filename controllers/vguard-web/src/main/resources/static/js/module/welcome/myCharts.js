$(function () {
    var yhzglCharts = echarts.init(document.getElementById('yhzglCharts'));
    var zxjcCharts = echarts.init(document.getElementById('zxjcCharts'));
    var sbglCharts = echarts.init(document.getElementById('sbglCharts'));
    var zclCharts = echarts2.init(document.getElementById('zclCharts'));
    var gzlCharts = echarts2.init(document.getElementById('gzlCharts'));
    var bjlCharts = echarts2.init(document.getElementById('bjlCharts'));
    var cslCharts = echarts2.init(document.getElementById('cslCharts'));
    var yhztCharts = echarts.init(document.getElementById('yhztCharts'));
    var yhjbCharts = echarts.init(document.getElementById('yhjbCharts'));
    var sbztCharts = echarts.init(document.getElementById('sbztCharts'));
    var bjfxCharts = echarts.init(document.getElementById('bjfxCharts'));
    var yhzglOpt = {
        title: {
            text: '隐患整改率',
            x: 'center',
            y: '15%',
            //正标题样式
            textStyle: {
                fontSize: 14,
                color: 'rgba(0,0,0,.45)'
            }
        },
        animation: false,
        tooltip: {
            trigger: 'axis',
            show: false, //default true
            showDelay: 0,
            hideDelay: 50,
            transitionDuration: 0,
            borderRadius: 8,
            borderWidth: 2,
            padding: 10, // [5, 10, 15, 20]
        },
        series: [
            {
                type: 'pie',
                center: [
                    '50%', '58%'
                ], //圆心坐标（div中的%比例）
                radius: [
                    20, 45
                ], //半径
                hoverAnimation: false,
                label: {
                    normal: {
                        position: 'center',
                        show: false,
                        textStyle: {
                            fontSize: '14',
                            color: 'rgba(0,0,0,.85)',
                            fontWeight: 'bold'
                        },
                        formatter: '{b}\n{c}%'
                    }
                },
                data: [
                    {
                        name: '',
                        value: CHECKRATE,
                        label: {
                            normal: {
                                show: true
                            }
                        },
                        itemStyle: {
                            normal: {
                                color: '#F5A623'
                            },
                            emphasis: {
                                color: '#F5A623'
                            }
                        }
                    }, {
                        name: '',
                        value: (100 - CHECKRATE),
                        lacbel: {},
                        itemStyle: {
                            normal: {
                                color: '#f4f6f8'
                            },
                            emphasis: {
                                color: '#f4f6f8'
                            }
                        }
                    }
                ]
            }
        ]
    }
    var zxjcOpt = {
        title: {
            text: '报警处理率',
            x: 'center',
            y: '15%',
            //正标题样式
            textStyle: {
                fontSize: 14,
                color: 'rgba(0,0,0,.45)'
            }
        },
        animation: false,
        tooltip: {
            trigger: 'axis',
            show: false, //default true
            showDelay: 0,
            hideDelay: 50,
            transitionDuration: 0,
            borderRadius: 8,
            borderWidth: 2,
            padding: 10, // [5, 10, 15, 20]
        },
        series: [
            {
                type: 'pie',
                center: [
                    '50%', '58%'
                ], //圆心坐标（div中的%比例）
                radius: [
                    20, 45
                ], //半径
                hoverAnimation: false,
                label: {
                    normal: {
                        position: 'center',
                        show: false,
                        textStyle: {
                            fontSize: '14',
                            color: 'rgba(0,0,0,.85)',
                            fontWeight: 'bold'
                        },
                        formatter: '{b}\n{c}%'
                    }
                },
                data: [
                    {
                        name: '',
                        value: HANDLERATE,
                        label: {
                            normal: {
                                show: true
                            }
                        },
                        itemStyle: {
                            normal: {
                                color: '#F04864'
                            },
                            emphasis: {
                                color: '#F04864'
                            }
                        }
                    }, {
                        name: '',
                        value: (100 - HANDLERATE),
                        lacbel: {},
                        itemStyle: {
                            normal: {
                                color: '#f4f6f8'
                            },
                            emphasis: {
                                color: '#f4f6f8'
                            }
                        }
                    }
                ]
            }
        ]
    }
    var sbglOpt = {
        title: {
            text: '设备完整率',
            x: 'center',
            y: '15%',
            //正标题样式
            textStyle: {
                fontSize: 14,
                color: 'rgba(0,0,0,.45)'
            }
        },
        animation: false,
        tooltip: {
            trigger: 'axis',
            show: false, //default true
            showDelay: 0,
            hideDelay: 50,
            transitionDuration: 0,
            borderRadius: 8,
            borderWidth: 2,
            padding: 10, // [5, 10, 15, 20]
        },
        series: [
            {
                type: 'pie',
                center: [
                    '50%', '58%'
                ], //圆心坐标（div中的%比例）
                radius: [
                    20, 45
                ], //半径
                hoverAnimation: false,
                label: {
                    normal: {
                        position: 'center',
                        show: false,
                        textStyle: {
                            fontSize: '14',
                            color: 'rgba(0,0,0,.85)',
                            fontWeight: 'bold'
                        },
                        formatter: '{b}\n{c}%'
                    }
                },
                data: [
                    {
                        name: '',
                        value: DEVICERATE,
                        label: {
                            normal: {
                                show: true
                            }
                        },
                        itemStyle: {
                            normal: {
                                color: '#2FC25B'
                            },
                            emphasis: {
                                color: '#2FC25B'
                            }
                        }
                    }, {
                        name: '',
                        value: (100 - DEVICERATE),
                        lacbel: {},
                        itemStyle: {
                            normal: {
                                color: '#f4f6f8'
                            },
                            emphasis: {
                                color: '#f4f6f8'
                            }
                        }
                    }
                ]
            }
        ]
    }
    var zclOpt = {
        tooltip: {
            formatter: "{a} <br/>{b} : {c}%"
        },
        toolbox: {
            show: false,
            feature: {
                mark: {
                    show: true
                },
                restore: {
                    show: true
                },
                saveAsImage: {
                    show: true
                }
            }
        },
        series: [
            {
                name: '正常率',
                type: 'gauge',
                startAngle: 180,
                endAngle: 0,
                center: [
                    '50%', '90%'
                ], // 默认全局居中
                radius: 77,
                axisLine: { // 坐标轴线
                    lineStyle: { // 属性lineStyle控制线条样式
                        width: 40,
                        color: '#52C41A',
                    }
                }, 
                axisLabel:{
                    show:false,
                },
                axisTick: { 
                    show:false,           // 坐标轴小标记
                    splitNumber: 10,   // 每份split细分多少段
                    length :2,        // 属性length控制线长
                },
                splitLine: {
                    show:false,
                },
                pointer: {
                    width: 10,
                    length: '90%',
                    color: 'rgba(255, 255, 255,0.8)'
                },
                title: {
                    show: true,
                    offsetCenter: [
                        0, '-70%'
                    ], // x, y，单位px
                    textStyle: { // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                        color: '#fff',
                        fontSize: 14
                    }
                },
                detail: {
                    show: true,
                    backgroundColor: 'rgba(0,0,0,0)',
                    borderWidth: 0,
                    borderColor: '#ccc',
                    width: 100,
                    height: 40,
                    offsetCenter: [
                        0, -30
                    ], // x, y，单位px
                    formatter: '{value}%',
                    textStyle: { // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                        fontSize: 20,
                        color:'rgba(0,0,0,0.85)',
                        fontWeight:"bold"
                    }
                },
                data: [
                    {
                        value: probeZCRate,
                        name: '正常率'
                    }
                ]
            }
        ]
    };
    var gzlOpt = {
        tooltip: {
            formatter: "{a} <br/>{b} : {c}%"
        },
        toolbox: {
            show: false,
            feature: {
                mark: {
                    show: true
                },
                restore: {
                    show: true
                },
                saveAsImage: {
                    show: true
                }
            }
        },
        series: [
            {
                name: '故障率',
                type: 'gauge',
                startAngle: 180,
                endAngle: 0,
                center: [
                    '50%', '90%'
                ], // 默认全局居中
                radius: 77,
                axisLine: { // 坐标轴线
                    lineStyle: { // 属性lineStyle控制线条样式
                        width: 40,
                        color: '#FAAD14',
                    }
                }, 
                axisLabel:{
                    show:false,
                },
                axisTick: { 
                    show:false,           // 坐标轴小标记
                    splitNumber: 10,   // 每份split细分多少段
                    length :2,        // 属性length控制线长
                },
                splitLine: {
                    show:false,
                },
                pointer: {
                    width: 10,
                    length: '90%',
                    color: 'rgba(255, 255, 255,0.8)'
                },
                title: {
                    show: true,
                    offsetCenter: [
                        0, '-70%'
                    ], // x, y，单位px
                    textStyle: { // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                        color: '#fff',
                        fontSize: 14
                    }
                },
                detail: {
                    show: true,
                    backgroundColor: 'rgba(0,0,0,0)',
                    borderWidth: 0,
                    borderColor: '#ccc',
                    width: 100,
                    height: 40,
                    offsetCenter: [
                        0, -30
                    ], // x, y，单位px
                    formatter: '{value}%',
                    textStyle: { // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                        fontSize: 20,
                        color:'rgba(0,0,0,0.85)',
                        fontWeight:"bold"
                    }
                },
                data: [
                    {
                        value: probeGZRate,
                        name: '故障率'
                    }
                ]
            }
        ]
    };
    var bjlOpt = {
        tooltip: {
            formatter: "{a} <br/>{b} : {c}%"
        },
        toolbox: {
            show: false,
            feature: {
                mark: {
                    show: true
                },
                restore: {
                    show: true
                },
                saveAsImage: {
                    show: true
                }
            }
        },
        series: [
            {
                name: '报警率',
                type: 'gauge',
                startAngle: 180,
                endAngle: 0,
                center: [
                    '50%', '90%'
                ], // 默认全局居中
                radius: 77,
                axisLine: { // 坐标轴线
                    lineStyle: { // 属性lineStyle控制线条样式
                        width: 40,
                        color: '#F04864',
                    }
                }, 
                axisLabel:{
                    show:false,
                },
                axisTick: { 
                    show:false,           // 坐标轴小标记
                    splitNumber: 10,   // 每份split细分多少段
                    length :2,        // 属性length控制线长
                },
                splitLine: {
                    show:false,
                },
                pointer: {
                    width: 10,
                    length: '90%',
                    color: 'rgba(255, 255, 255,0.8)'
                },
                title: {
                    show: true,
                    offsetCenter: [
                        0, '-70%'
                    ], // x, y，单位px
                    textStyle: { // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                        color: '#fff',
                        fontSize: 14
                    }
                },
                detail: {
                    show: true,
                    backgroundColor: 'rgba(0,0,0,0)',
                    borderWidth: 0,
                    borderColor: '#ccc',
                    width: 100,
                    height: 40,
                    offsetCenter: [
                        0, -30
                    ], // x, y，单位px
                    formatter: '{value}%',
                    textStyle: { // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                        fontSize: 20,
                        color:'rgba(0,0,0,0.85)',
                        fontWeight:"bold"
                    }
                },
                data: [
                    {
                        value: probeBJRate,
                        name: '报警率'
                    }
                ]
            }
        ]
    };
    var cslOpt = {
        tooltip: {
            formatter: "{a} <br/>{b} : {c}%"
        },
        toolbox: {
            show: false,
            feature: {
                mark: {
                    show: true
                },
                restore: {
                    show: true
                },
                saveAsImage: {
                    show: true
                }
            }
        },
        series: [
            {
                name: '超时率',
                type: 'gauge',
                startAngle: 180,
                endAngle: 0,
                center: [
                    '50%', '90%'
                ], // 默认全局居中
                radius: 77,
                axisLine: { // 坐标轴线
                    lineStyle: { // 属性lineStyle控制线条样式
                        width: 40,
                        color: '#1890FF',
                    }
                }, 
                axisLabel:{
                    show:false,
                },
                axisTick: { 
                    show:false,           // 坐标轴小标记
                    splitNumber: 10,   // 每份split细分多少段
                    length :2,        // 属性length控制线长
                },
                splitLine: {
                    show:false,
                },
                pointer: {
                    width: 10,
                    length: '90%',
                    color: 'rgba(255, 255, 255,0.8)'
                },
                title: {
                    show: true,
                    offsetCenter: [
                        0, '-70%'
                    ], // x, y，单位px
                    textStyle: { // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                        color: '#fff',
                        fontSize: 14
                    }
                },
                detail: {
                    show: true,
                    backgroundColor: 'rgba(0,0,0,0)',
                    borderWidth: 0,
                    borderColor: '#ccc',
                    width: 100,
                    height: 40,
                    offsetCenter: [
                        0, -30
                    ], // x, y，单位px
                    formatter: '{value}%',
                    textStyle: { // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                        fontSize: 20,
                        color:'rgba(0,0,0,0.85)',
                        fontWeight:"bold"
                    }
                },
                data: [
                    {
                        value: probeCSRate,
                        name: '超时率'
                    }
                ]
            }
        ]
    };

    var dataMap = {};
    function dataFormatter(obj) {
        // var pList = ['北京','天津','河北','山西','内蒙古','辽宁','吉林','黑龙江','上海','江苏','浙江','安徽','福建','江西','山东','河南','湖北','湖南','广东','广西','海南','重庆','四川','贵州','云南','西藏','陕西','甘肃','青海','宁夏','新疆'];
        var temp;
        for (var year = 2002; year <= 2013; year++) {
            var max = 0;
            var sum = 0;
            temp = obj[year];
            for (var i = 0, l = temp.length; i < l; i++) {
                max = Math.max(max, temp[i]);
                sum += temp[i];
                obj[year][i] = {
                    // name : pList[i],
                    value : temp[i]
                }
            }
            obj[year + 'max'] = Math.floor(max / 100) * 100;
            obj[year + 'sum'] = sum;
        }
        return obj;
    }
    
    dataMap.dataDB= dataFormatter({
        2013:[11,22,33,44,55],
        2012:[1,2,3,4,5],
        2011:[21,1,3,22,11],
        2010:[1,12,33,12,14],
        2009:[1,12,22,12,14],
        2008:[1,12,33,12,14],
        2007:[1,12,33,12,14],
        2006:[1,12,33,12,14],
        2005:[1,12,1,12,14],
        2004:[1,12,33,12,14],
        2003:[1,12,33,12,14],
        2002:[22,21,8,23,19,6,6,6]
    });
    
    dataMap.dataCDB = dataFormatter({
        2013:[11,22,53,22,31],
        2012:[17,12,23,24,51],
        2011:[21,1,3,22,11],
        2010:[1,12,33,12,14],
        2009:[1,12,33,12,14],
        2008:[1,12,33,12,14],
        2007:[1,12,33,12,14],
        2006:[1,12,33,12,14],
        2005:[1,12,33,4,14],
        2004:[1,12,33,12,14],
        2003:[1,12,33,12,14],
        2002:[1,12,33,12,14,5,5,5]
    });
    
    dataMap.dataGB = dataFormatter({
        2013:[11,22,33,44,55],
        2012:[1,2,3,4,5],
        2011:[21,1,3,22,11],
        2010:[1,12,33,12,14],
        2009:[1,12,33,12,14],
        2008:[1,12,33,12,14],
        2007:[1,12,33,12,14],
        2006:[1,12,33,55,14],
        2005:[1,12,33,12,14],
        2004:[1,12,33,12,14],
        2003:[1,2,33,12,14],
        2002:[1,12,33,12,14,2,2,2] 
    });
    
    dataMap.dataCGB = dataFormatter({
        2013:[21,32,33,34,45],
        2012:[12,23,34,14,15],
        2011:[21,1,3,22,11],
        2010:[1,12,33,12,14],
        2009:[1,12,33,12,14],
        2008:[1,12,33,12,14],
        2007:[1,12,33,12,14],
        2006:[1,12,33,3,14],
        2005:[1,12,2,12,14],
        2004:[1,12,33,12,14],
        2003:[1,12,33,12,14,12,22,33],
        2002:[1,12,33,12,14,1,2,2]
    });
    
    dataMap.dataMLC = dataFormatter({
        2013:[11,22,33,44,55],
        2012:[1,2,3,4,5],
        2011:[21,1,3,22,11],
        2010:[1,12,33,12,14],
        2009:[1,12,33,12,14],
        2008:[1,12,33,12,14],
        2007:[1,12,33,12,14],
        2006:[1,12,33,12,14],
        2005:[1,12,33,12,14],
        2004:[1,12,33,12,14],
        2003:[1,12,33,12,14],
        2002:[1,12,33,12,14,2,3,3]
    });
    
    // state{五个}
    //   时间 、 每个区域的数量 
    var bjfxOpt = {
        baseOption: {
            timeline: {
                // y: 0,
                axisType: 'category',
                // realtime: false,
                // loop: false,
                autoPlay: true,
                // currentIndex: 2,
                playInterval: 1000,
                // controlStyle: {
                //     position: 'left'
                // },
                data: [
                    '1月','2月','3月','4月','5月', '6月','7月','8月','9月','10月','11月','12月'
                    // {
                    //     value: '2011-01-01',
                    //     tooltip: {
                    //         formatter: function (params) {
                    //             return params.name + 'GDP达到又一个高度';
                    //         }
                    //     },
                    //     symbol: 'diamond',
                    //     symbolSize: 18
                    // },
                ],
                label: {
                    // formatter:value,
                    // formatter : function(s) {
                    //     return (new Date(s)).getFullYear();
                    // }
                }
            },
            tooltip: {
            },
            legend: {
                x: 'right',
                data: ['超低报', '低报', '高报', '超高报', '满量程'],
                // selected: {
                //     'GDP': false, '金融': false, '房地产': false
                // }
            },
            calculable : true,
            grid: {
                top: 30,
                left: 50,
                right: 100,
                bottom: 100,
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow',
                        label: {
                            show: true,
                            formatter: function (params) {
                                return params.value.replace('\n', '');
                            }
                        }
                    }
                }
            },
            xAxis: [
                {
                    'type':'category',
                    'axisLabel':{'interval':0},
                    'data':[
                        '厂区一','厂区二','厂区三','厂区四','厂区五','厂区六','厂区七','厂区八'
                    ],
                    splitLine: {show: false}
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    name: '报警数量（个）'
                }
            ],
            series: [
                {name: '超低报', type: 'bar', itemStyle: { normal: {color: '#1890FF'}}},
                {name: '低报', type: 'bar', itemStyle: { normal: {color: '#13C2C2'}}},
                {name: '高报', type: 'bar', itemStyle: { normal: {color: '#F04864'}}},
                {name: '超高报', type: 'bar', itemStyle: { normal: {color: '#F5A623'}}},
                {name: '满量程', type: 'bar', itemStyle: { normal: {color: '#8543E0'}}}
            ]
        },
        options: [
            {
                series: [
                    {data: dataMap.dataCDB['2002']},
                    {data: dataMap.dataDB['2002']},
                    {data: dataMap.dataGB['2002']},
                    {data: dataMap.dataCGB['2002']},
                    {data: dataMap.dataMLC['2002']}
                ]
            },
            {
                series : [
                    {data: dataMap.dataCDB['2003']},
                    {data: dataMap.dataDB['2003']},
                    {data: dataMap.dataGB['2003']},
                    {data: dataMap.dataCGB['2003']},
                    {data: dataMap.dataMLC['2003']}
                ]
            },
            {
                series : [
                    {data: dataMap.dataCDB['2004']},
                    {data: dataMap.dataDB['2004']},
                    {data: dataMap.dataGB['2004']},
                    {data: dataMap.dataCGB['2004']},
                    {data: dataMap.dataMLC['2004']}
                ]
            },
            {
                series : [
                    {data: dataMap.dataCDB['2005']},
                    {data: dataMap.dataDB['2005']},
                    {data: dataMap.dataGB['2005']},
                    {data: dataMap.dataCGB['2005']},
                    {data: dataMap.dataMLC['2005']}
                ]
            },
            {
                series : [
                    {data: dataMap.dataCDB['2006']},
                    {data: dataMap.dataDB['2006']},
                    {data: dataMap.dataGB['2006']},
                    {data: dataMap.dataCGB['2006']},
                    {data: dataMap.dataMLC['2006']}
                ]
            },
            {
                series : [
                    {data: dataMap.dataCDB['2007']},
                    {data: dataMap.dataDB['2007']},
                    {data: dataMap.dataGB['2007']},
                    {data: dataMap.dataCGB['2007']},
                    {data: dataMap.dataMLC['2007']}
                ]
            },
            {
                series : [
                    {data: dataMap.dataCDB['2008']},
                    {data: dataMap.dataDB['2008']},
                    {data: dataMap.dataGB['2008']},
                    {data: dataMap.dataCGB['2008']},
                    {data: dataMap.dataMLC['2008']}
                ]
            },
            {
                series : [
                    {data: dataMap.dataCDB['2009']},
                    {data: dataMap.dataDB['2009']},
                    {data: dataMap.dataGB['2009']},
                    {data: dataMap.dataCGB['2009']},
                    {data: dataMap.dataMLC['2009']}
                ]
            },
            {
                series : [
                    {data: dataMap.dataCDB['2010']},
                    {data: dataMap.dataDB['2010']},
                    {data: dataMap.dataGB['2010']},
                    {data: dataMap.dataCGB['2010']},
                    {data: dataMap.dataMLC['2010']}
                ]
            },
            {
                series : [
                    {data: dataMap.dataCDB['2011']},
                    {data: dataMap.dataDB['2011']},
                    {data: dataMap.dataGB['2011']},
                    {data: dataMap.dataCGB['2011']},
                    {data: dataMap.dataMLC['2011']}
                ]
            },{
                series : [
                    {data: dataMap.dataCDB['2012']},
                    {data: dataMap.dataDB['2012']},
                    {data: dataMap.dataGB['2012']},
                    {data: dataMap.dataCGB['2012']},
                    {data: dataMap.dataMLC['2012']}
                ]
            },{
                series : [
                    {data: dataMap.dataCDB['2013']},
                    {data: dataMap.dataDB['2013']},
                    {data: dataMap.dataGB['2013']},
                    {data: dataMap.dataCGB['2013']},
                    {data: dataMap.dataMLC['2013']}
                ]
            }
        ]
    };
    var yhztOpt = {
        tooltip : {
            trigger: 'axis',
            axisPointer : {           
                type : 'shadow' 
            }
        },
        toolbox: {
            show : false,
            orient: 'vertical',
            x: 'right',
            y: 'middle'
        },
        calculable : true,
        grid: {
            x: 30,
            x2: 20,
            y: 30,
            y2: 20
        },
        xAxis : [
            {
                type : 'category',
                data : ['待整改', '待验收', '待核查', '验收完成'],
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: ['#ddd'],
                        width: 2
                    }
                },
                axisTick: {
                    show: false
                },
                splitLine: {
                    show: false
                },
                axisLabel: {
                    textStyle: {
                        color: 'rgba(0,0,0,0.65)'
                    }
                }
            }
        ],
        yAxis : [
            {
                type : 'value',
                name: '数量（个）',
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: ['rgba(0,0,0,0.10)'],
                        width: 1,
                        type: 'dashed'
                    }
                },
                axisLabel: {
                    textStyle: {
                        color: 'rgba(0,0,0,0.65)'
                    }
                }
            }
        ],
        series: [
            {
                name: '隐患数量',
                type: 'bar',
                barWidth: '50%',
                data:[3,4,8,4],
                itemStyle: {
                    normal: {
                        color: function(params) {
                            console.log(params);
                            var tgtColor = "";
                            if ("待整改" == params.name) {
                                tgtColor = "#F5222D";
                            } else if ("待验收" == params.name) {
                                tgtColor = "#FAAD14";
                            } else if ("待核查" == params.name) {
                                tgtColor = "#1890FF";
                            } else if ("验收完成" == params.name) {
                                tgtColor = "#52C41A";
                            }  
                            return tgtColor;
                        }
                    }
                },
                label: {
                    normal: {
                        show: true,
                        position: 'top',
                        formatter: '{c} '
                    },
                    emphasis: {             
                        show: true,
                        textStyle: {
                            color: '#666666',
                            fontSize: '11',
                            fontWeight: 'bold'
                        }
                    }
                }
            }
        ]
    };
    var yhjbOpt = {
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        legend: {
           show:false,
        },
        series: [
            {
                name: '隐患级别',
                type: 'pie',
                radius: [
                    '50%', '70%'
                ],
                center: [
                    '50%', '50%'
                ],
                avoidLabelOverlap: false,
                label: {
                    normal: {
                        show: false,
                        position: 'center'
                    },
                    emphasis: {
                        show: false,
                        textStyle: {
                            fontSize: '30',
                            fontWeight: 'bold'
                        }
                    }
                },
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                data: [
                    {
                        value: 7,
                        name: '一级'
                    }, {
                        value: 3,
                        name: '二级'
                    }, {
                        value: 2,
                        name: '三级'
                    }, {
                        value: 1,
                        name: '四级'
                    }
                ]
            }
        ],
        color: ['#F5222D', '#FAAD14', '#ffd700', '#1890FF']
    };

    var sbztOpt = {
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        legend: {
            orient: 'vertical',
            x: 'right',
            data:[
                '','','',{
                    name:'探测器',
                    icon:'circle'
                },{
                    name:'控制器',
                    icon:'circle'
                },{
                    name:'服务器',
                    icon:'circle'
                },{
                    name:'摄像头',
                    icon:'circle'
                },{
                    name:'DCS',
                    icon:'circle'
                },{
                    name:'监测主机',
                    icon:'circle'
                },{
                    name:'视频主机',
                    icon:'circle'
                }
            ],
            itemWidth: 8,
            itemHeight: 8,
            itemGap: 26
        },
        series: [
            {
                name:'设备状态',
                type:'pie',
                selectedMode: 'single',
                radius: [0, '35%'],
                center:['30%','50%'],
                label: {
                    normal: {
                        position: 'inner',
                        textStyle:{
                        fontSize: 10,
                        }
                    }
                },
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                data:[
                    {value:335, name:'正常'},
                    {value:679, name:'维修'},
                    {value:1548, name:'报废'}
                ]
            },
            {
                name:'设备数量',
                type:'pie',
                radius: ['50%', '85%'],
                center:['30%','50%'],
                label: {
                    normal: {
                        show:false,
                    }
                },
                data:[
                    {value:335, name:'探测器'},
                    {value:310, name:'控制器'},
                    {value:234, name:'服务器'},
                    {value:135, name:'摄像头'},
                    {value:1048, name:'DCS'},
                    {value:251, name:'监测主机'},
                    {value:147, name:'视频主机'}
                ]
            },
        ],
        color:['#2FC25B','#FAAD14','#F04864','#1890FF','#13C2C2','#2FC25B','#F5A623','#E200FF','#F8E71C','#F04864'],
    };

    yhzglCharts.setOption(yhzglOpt);
    zxjcCharts.setOption(zxjcOpt);
    sbglCharts.setOption(sbglOpt);
    zclCharts.setOption(zclOpt);
    gzlCharts.setOption(gzlOpt);
    bjlCharts.setOption(bjlOpt);
    cslCharts.setOption(cslOpt);
    bjfxCharts.setOption(bjfxOpt);
    yhztCharts.setOption(yhztOpt);
    yhjbCharts.setOption(yhjbOpt);
    sbztCharts.setOption(sbztOpt);
    $(window).resize(function(){
        yhzglCharts.resize();
        zxjcCharts.resize();
        sbglCharts.resize();
        zclCharts.resize();
        gzlCharts.resize();
        bjlCharts.resize();
        cslCharts.resize();
        bjfxCharts.resize();
        yhztCharts.resize();
        yhjbCharts.resize();
        sbztCharts.resize();
    })
})