/**
 * (Echarts3.0)图表公用类
 */
var chartUtils=function(echarts){
	this._echarts=echarts;
}

chartUtils.prototype={
		
		//饼图
		addMapPieChart:function(element,name,data){
			var chart=this._echarts.init(element);
			
			//指定图表的配置项和数据
			var option = {
	        		tooltip : {
	        	        trigger: 'item',
	        	        formatter: "{a} <br/>{b} : {c} ({d}%)"
	        	    },
	        	    series : [
	        	        {
	        	            name: name+':企业数量（家）',
	        	            type: 'pie',
	        	            radius : '50%',
	        	            center: ['50%', '50%'],
	        	            data:data,
	        	            label: {
	        	                normal: {
	        	                    show: false
	        	                },
	        	                emphasis: {
	        	                    show: false
	        	                }
	        	            },
	        	            itemStyle: {
	        	                emphasis: {
	        	                    shadowBlur: 10,
	        	                    shadowOffsetX: 0,
	        	                    shadowColor: 'rgba(0, 0, 0, 0.5)'
	        	                }
	        	            }
	        	        }
	        	    ]
	        };
			
			chart.setOption(option);
		},
	
		//柱状图
		addBarChart:function(element,dataOptions){
			var chart=this._echarts.init(element);
			var option = {
				    tooltip : {
				        trigger: 'axis',
				        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
				            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
				        }
				    },
				    legend: {
				    	x : 'center',
				        y : 'bottom',
				        itemHeight:7,
				        itemGap:5,
				        data: dataOptions.legend
				    },
				    grid: {
				        left: '1%',
				        right: '3%',
				        top: '3%',
				        containLabel: true
				    },
				    xAxis:  {
				        type: 'value'
				    },
				    yAxis: {
				        type: 'category',
				        data: dataOptions.yAxis
				    },
				    series:dataOptions.series
				};
			chart.setOption(option);
		},
		
		//地图上柱状图
		addMapBarChart:function(element,xdata,series){
			var chart=this._echarts.init(element);
			
			//指定图表的配置项和数据
			var option = {
				    tooltip: {
				        trigger: 'axis',
				        axisPointer: {
				            type: 'shadow'
				        }
				    },
				    grid: {
				        left: '3%',
				        right: '4%',
				        bottom: '3%',
				        containLabel: true
				    },
				    yAxis: {
				        type: 'value',
				        show:false
				    },
				    xAxis: {
				        type: 'category',
				        show:false,
				        data: [xdata]
				    },
				    series:series
			};
			chart.setOption(option);
		}
}