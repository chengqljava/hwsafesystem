/**
 * 
 */
var SearchEcharts=function(options){
	this._map=options.map;
	this._echarts=options.echarts;
	this._element=options.element;
	this._init();
}

SearchEcharts.prototype._init=function(){
	
	var self=this;
	
	//饼图
	self.addPieChart=function(data){
		var chart=this._echarts.init(this._element);
		if(data==null){
			return;
		}
		data=_convertCQCData(data.cCountList);
		//指定图表的配置项和数据
		var option = {
        		tooltip : {
        	        trigger: 'item',
        	        formatter: "{a} <br/>{b} : {c} ({d}%)"
        	    },
        	    legend: {
        	        /*orient: 'vertical',
        	        left: 'left',*/
        	    	orient: 'horizontal',
        	        top: 'bottom',
        	        data:data[0]
        	    },
        	    series : [
        	        {
        	            name: '企业数量（家）',
        	            type: 'pie',
        	            radius : '55%',
        	            center: ['50%', '40%'],
        	            data:data[1],
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
	};
	
	self.addBarChart=function(data){
		var chart=this._echarts.init(this._element);
		if(data==null){
			return;
		}
		data=_convertCQDData(data.dCountList);
		/*var option = {
			    color: ['#3398DB'],
			    tooltip : {
			        trigger: 'axis',
			        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
			            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
			        }
			    },
			    grid: {
			        left: '0%',
			        right: '1%',
			        bottom: '2%',
			        containLabel: true
			    },
			    xAxis : [
			        {
			            type : 'category',
			            data : data[0],
			            axisTick: {
			                alignWithLabel: false
			            }
			        }
			    ],
			    yAxis : [
			        {
			            type : 'value'
			        }
			    ],
			    series : [
			        {
			            name:'企业数量（家）',
			            type:'bar',
			            barWidth: '60%',
			            data:data[1]
			        }
			    ]
			};*/
		
		var option = {
        		tooltip : {
        	        trigger: 'item',
        	        formatter: "{a} <br/>{b} : {c} ({d}%)"
        	    },
        	    legend: {
        	        orient: 'vertical',
        	        left: 'left',
        	    	orient: 'horizontal',
        	        top: 'bottom',
        	        data:data[0]
        	    },
        	    series : [
        	        {
        	            name: '企业数量（家）',
        	            type: 'pie',
        	            radius : '55%',
        	            center: ['50%', '40%'],
        	            data:data[1],
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
	};
	_convertCQCData=function(data){
		var names=[];
		var values=[];
		for(var key in data){
			//危化企业
			var value;
			var keyValue=data[key].CQC;
			if(keyValue == "2"){
				value = "无需许可";
				
			}else if(keyValue == "3"){
				value = "生产";
				
			}else if(keyValue == "4"){
				value = "经营";
				
			}else if(keyValue == "5"){
				value = "运输";
				
			}else if(keyValue == "6"){
				value = "使用";
				
			}else if(keyValue == "7"){
				value = "废弃物";
				
			}
			names.push(value);
			values.push({name:value,value:data[key].CQCCOUNT});
		}
		return [names,values];
	};
	_convertCQDData=function(data){
		var names=[];
		var values=[];
		for(var key in data){
			//危化企业
			var value;
			var keyValue=data[key].CQD;
			if(keyValue == "1"){
				value = "危险化学品";
			}else if(keyValue == "2"){
				value = "燃气类";
			}else if(keyValue == "3"){
				value = "港口";
			}
			names.push(value);
			
			values.push({name:value,value:data[key].CQDCOUNT});
			//values.push(data[key].CQDCOUNT);
		}
		return [names,values];
	}
}