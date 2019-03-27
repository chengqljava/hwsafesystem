$(function () {

})

function probeChart(chroval,rangemax,rangelow,high,low,unit){
	var probeChart = echarts2.init(document.getElementById('probe_charts'));
    var probeOption = {
		 tooltip : {
		        formatter: "{a} <br/>{b} : {c}%"
		    },
		    series : [
		        {
		            name:'实时数据',
		            type:'gauge',
		            splitNumber: 10,       // 分割段数，默认为5
		            axisLine: {            // 坐标轴线
		                lineStyle: {       // 属性lineStyle控制线条样式
		                    color: [[low/rangemax, '#228b22'],[high/rangemax, '#fbb324'],[1, '#ff0000']], 
		                    width: 8
		                }
		            },
		            min: rangelow,
		            max: rangemax,
		            radius:['80%','95%'],
		            axisTick: {            // 坐标轴小标记
		                splitNumber: 10,   // 每份split细分多少段
		                length :12,        // 属性length控制线长
		                lineStyle: {       // 属性lineStyle控制线条样式
		                    color: 'auto'
		                }
		            },
		            axisLabel: {           // 坐标轴文本标签，详见axis.axisLabel
		                textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
		                    color: 'auto'
		                }
		            },
		            splitLine: {           // 分隔线
		                show: true,        // 默认显示，属性show控制显示与否
		                length :20,         // 属性length控制线长
		                lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
		                    color: 'auto'
		                }
		            },
		            pointer : {
		                width : 5
		            },
		            title : {
		                show : true,
		                offsetCenter: [0, '-40%'],       // x, y，单位px
		                textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
		                    fontWeight: 'bolder'
		                }
		            },
		            detail : {
		                formatter:'{value}'+unit,
		                textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
		                    color: 'auto',
		                    fontWeight: 'bolder'
		                }
		            },
                    data: [
                        {
                            value: chroval,
                            name: '监测值'
                        }
                    ],
                    title: {
                        show: false
                    }
                }
            ]
        };	
    probeChart.setOption(probeOption);
    $(window).resize(function(){
        probeChart.resize();
    })
}

function dataChart(probeDatas,unit){
	var probename = "",
	dataX = [],
	dataY = [];
	if (probeDatas && 0 < probeDatas.length) {
		probename = probeDatas[0].PROBENAME;
		var rawDates = _.pluck(probeDatas, "CREATETIME");
		_.map(rawDates, function(tmpDate, index) {
			dataX.push(getSmpFormatDateByLong(tmpDate, true));
		});
		dataY = _.pluck(probeDatas, "CHROVAL");
	}
    var dataChart = echarts.init(document.getElementById('data_charts'));
    var dataOption = {
		tooltip : {
			trigger: 'item',
	        formatter: "{a} <br/>{b}:{c}"
	    },
        xAxis: {
            type: 'category',
            boundaryGap: false,
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
            },
            data: dataX
        },
        legend: {
            data:[unit],
            x: 'left'
        },
        yAxis: {
            type: 'value',
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
        },
        grid:{
            x:40,
            y:30,
            x2:20,
            y2:30
        },
        series: [{
            data: dataY,
            type: 'line',
            symbol:'none',
            areaStyle: {
                color:'#228b22'
            },
            lineStyle:{
                color:'#228b22'
            },
            itemStyle:{
                show:false
            }
        }]
    };
    dataChart.setOption(dataOption);
    $(window).resize(function(){
        dataChart.resize();
    })

    return dataChart;
}