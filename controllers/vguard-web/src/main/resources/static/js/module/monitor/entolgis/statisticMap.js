/**
 * 
 */
var StatisticMap=function(ec,element){
	this._echarts=ec.init(element);
	/*var option =this._option= {
		    tooltip: {
		        trigger: 'item',
		        formatter: "{a} <br/>{b}: {c} ({d}%)"
		    },
		    legend: {
		        orient: 'vertical',
		        x: 'right',
		        data:['探头故障','网络故障','通讯故障','高报','低报','满量程']
		    },
		    series: [
		        {
		            name:'故障报警',
		            type:'pie',
		            selectedMode: 'single',
		            radius: [0, '63%'],

		            label: {
		                normal: {
		                    position: 'inner'
		                }
		            },
		            labelLine: {
		                normal: {
		                    show: false
		                }
		            },
		            data:[
		                {value:0, name:'探头报警', selected:false},
		                {value:0, name:'故障报警'}
		            ]
		        },
		        {
		            name:'监测报警',
		            type:'pie',
		            radius: ['72%', '92%'],
		            label: {
		                normal: {
		                    position: 'inner'
		                }
		            },
		            labelLine: {
		                normal: {
		                    show: false
		                }
		            },
		            data:[
		                {value:335, name:'高报'},
		                {value:310, name:'低报'},
		                {value:234, name:'满量程'}
		            ]
		        }
		    ]
		};*/
	var option =this._option={
			    tooltip : {
			        //trigger: 'axis'
			    },
			    title: {
			        text: '探头历史状态统计图',
			        textStyle:{
			        	fontSize: 10
			        },
			        x:'center'
			    },
			    grid: {
			        left: '3%',
			        right: '1%',
			        bottom: '2%',
			        top:'15%',
			        containLabel: true
			    },
			    yAxis : [
			        {
			            type : 'value',
			          axisLabel : {
			                formatter: '{value}'
			            }
			        }
			    ],
			    xAxis : [
			        {
			            type : 'category',
			            data : ['探头故障','网络故障','通讯故障','高报','低报','满量程']
			        }
			    ],
			    series : [
			        {
			            type:'bar',
			            barGap:'25%',
			          data:[
			              {
			                value:0,
			                itemStyle:{
			                  normal:{color:'#0580b9'}
			              }
			              }, 
			              {
			                value:0,
			                itemStyle:{
			                  normal:{color:'green'}
			              }
			              },
			              {
			                value:0,
			                itemStyle:{
			                  normal:{color:'#00448a'}
			              }
			              },
			              {
			                value:0,
			                itemStyle:{
			                  normal:{color:'red'}
			              }
			              }
			              ,
			              {
			                value:0,
			                itemStyle:{
			                  normal:{color:'#84e6f1'}
			              }
			              }
			              ,
			              {
			                value:0,
			                itemStyle:{
			                  normal:{color:'#0580b9'}
			              }
			              }
			            ]
			        }
			    ]
			};
	}
		/*{
		    tooltip: {
		        trigger: 'axis',
		        axisPointer: {
		            type: 'shadow'
		        }
		    },
		    legend: {
		    	y:'bottom',
		        data: ['探头故障','网络故障','通讯故障','高报','低报','满量程']
		    },
		    grid: {
		        left: '3%',
		        right: '4%',
		        bottom: '20%',
		        containLabel: true
		    },
		    yAxis: {
		        type: 'value',
		        boundaryGap: [0, 0.01]
		    },
		    xAxis: {
		        type: 'category',
		        data: ['探头故障','网络故障','通讯故障','高报','低报','满量程']
		    },
		    series: [
		        {
		            name: '2011年',
		            type: 'bar',
		            data: [18203]
		        },
		        {
		            name: '2012年',
		            type: 'bar',
		            data: [19325]
		        },
		        {
		            name: '2013年',
		            type: 'bar',
		            data: [29034]
		        },
		        {
		            name: '2014年',
		            type: 'bar',
		            data: [121594]
		        }
		    ]
		};*/



/*StatisticMap.prototype.setOption=function(data1,data2){
	this._option.series[0].data=data1;
	this._option.series[1].data=data2;
	this._echarts.setOption(this._option);
}*/

StatisticMap.prototype.setOption=function(datas,title){
	this._option.title.text=title;
	this._option.series[0].data[0].value=datas[0];
	this._option.series[0].data[1].value=datas[1];
	this._option.series[0].data[2].value=datas[2];
	this._option.series[0].data[3].value=datas[3];
	this._option.series[0].data[4].value=datas[4];
	this._option.series[0].data[5].value=datas[5];
	this._echarts.setOption(this._option);
}