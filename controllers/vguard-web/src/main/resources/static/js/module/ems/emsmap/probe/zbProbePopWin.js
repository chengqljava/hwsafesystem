$(function() {
	var	option = {
	    title: {
	        text: decodeURI(getQueryString("curZbProName")) + "监测点",
	        textStyle:{
	        	color: "#fff"
	        }
//	        subtext: '实时数据'
	    },
	    tooltip: {
	        trigger: 'axis',
	        axisPointer: {
	            type: 'cross',
	            label: {
	                backgroundColor: '#283b56'
	            }
	        },
	        textStyle: {
	        	color: "#fff",
	    		fontSize: '12px'
	        }
	    },
	    backgroundColor: '#002e6e',
		color: '#fff',
	    legend: {
	        data:['浓度值'],
	        color:"#fff",
	        textStyle: {
	        	color: "#fff",
	    		fontSize: '12px'
	        }
	    },
	    toolbox: {
	        show: false,
	        feature: {
	            dataView: {readOnly: false},
	            restore: {},
	            saveAsImage: {}
	        }
	    },
	    dataZoom: {
	        show: false,
	        start: 0,
	        end: 100
	    },
	    xAxis: [
	        {
	            type: 'category',
	            boundaryGap: true,
	            axisLabel:{
	            	textStyle:{
        				color: '#fff'
        			}
	            },
	            data: (function (){
	                var now = new Date();
	                var res = [];
	                var len = 10;
	                while (len--) {
	                    res.unshift(now.toLocaleTimeString().replace(/^\D*/,''));
	                    now = new Date(now - 2000);
	                }
	                return res;
	            })()
	        }
	    ],
	    yAxis: [
	        {
	            type: 'value',
	            scale: true,
	            name: '浓度值(PPM)',
	            min: 0,
	            nameTextStyle: {  
                    color: ['#0087ED']  
                },  
	            boundaryGap: [0.2, 0.2],
	            axisLabel: {
//	                formatter: '{value}PPM',
	                textStyle:{
        				color: '#fff'
        			}

	            }
	        }
	    ],
	    series: [
	        {
	            name:'浓度值',
	            type:'line',
	            itemStyle:{
	            	normal: {
	            		lineStyle:{
	            			color: "#fff"
	            		},
	            		label:{
	            			textStyle:{
	            				color: '#fff'
	            			}
	            		}
	            	}
	            },
	            data:(function (){
	                var res = [];
	                var len = 0;
	                while (len < 10) {
	                    res.push((Math.random()*10 + 5).toFixed(1) - 0);
	                    len++;
	                }
	                console.log(res)
	                return res;
	            })()
	        }
	    ]
	};

	var myLineChart = echarts.init(document.getElementById("zbProChart"));
	myLineChart.setOption(option);
	window.onresize = function () {
		myLineChart.resize();
	};
	setInterval(function (){
	    var axisData = (new Date()).toLocaleTimeString().replace(/^\D*/,''),
	        data0 = option.series[0].data;
	    data0.shift();
	    data0.push(Math.floor(Math.random() * (500 - 100 + 1) + 100));
	    option.xAxis[0].data.shift();
	    option.xAxis[0].data.push(axisData);
	    myLineChart.setOption(option);
	}, 1000);
});
function getQueryString(name) {
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}