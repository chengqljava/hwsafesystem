/**
 * 实时曲线
 */
var RealTimeCurve=function(ec,element){
	this._echarts=ec.init(element);
	var option =this._option= {
		    tooltip: {
		        trigger: 'axis'
		    },
		    title: {
		        text: '探头实时曲线图',
		        textStyle:{
		        	fontSize: 10
		        },
		        x:'center'
		    },
		    grid: {
		        left: '3%',
		        right: '4%',
		        bottom: '3%',
		        top:'15%',
		        containLabel: true
		    },
		    xAxis: [
		        {
		        	splitLine: {
		        		show: false,
		            },
		            type: 'category',
		            boundaryGap: true,
		            data: []
		        }
		    ],
		    
		    //后加
		    /*visualMap: {
		    	left:'5%',
	            orient:'horizontal',
		    	pieces: [{
	                gt: 0,
	                lte: 5,
	                label:'低报',
	                color: '#096'
	            }, {
	                gt: 5,
	                lte: 10,
	                label:'满量程1',
	                color: '#ffde33'
	            }, {
	                gt: 10,
	                lte: 15,
	                label:'满量程',
	                color: '#ff9933'
	            }, {
	                gt: 15,
	                lte: 20,
	                label:'高报1',
	                color: '#cc0033'
	            }, {
	                gt: 20,
	                lte: 30,
	                label:'高报',
	                color: '#660099'
	            }, {
	                gt: 30,
	                 label:'超限',
	                color: '#7e0023'
	            }],
	            outOfRange: {
	                color: '#999'
	            }
	        },*/
		    yAxis: [
		        {
		        	splitLine: {
		        		show: true,
		                lineStyle:{
		                	type:'dashed'
		                }
		            },
		            type: 'value',
		            scale: true,
		           // name: '浓度值',
		            //max: 30,
		            min: 0,
		            boundaryGap: [0.2, 0.2]
		        }
		    ],
		    series: []
		};
}

RealTimeCurve.prototype.setOption=function(probeId,title){
	var data=monitordatas.loadRealChroByProbe(probeId);
	if(data==null||data[0].CHROVAL==null)data=0;
	else data=data[0].CHROVAL;
	var self=this;
	clearInterval(app.realimeTicket);
	var serie={
        name:"监测数值",
        type:'line',
        data:[data]   //,
        /*markLine: {
            silent: true,
            data: [{
                yAxis: 5
            }, {
                yAxis: 10
            }, {
                yAxis: 15
            }, {
                yAxis: 20
            }, {
                yAxis: 30
            }]
        }*/
    };
	//var axisData = (new Date()).toLocaleTimeString().replace(/^\D*/,'');
	var axisData = (new Date()).format("HH:mm:ss"); 
	self._option.series.push(serie);
	self._option.title.text=title;
	self._option.xAxis[0].data.push(axisData);
	 
    self._echarts.setOption(self._option);
    
	app.realimeTicket = setInterval(function (){
		data=monitordatas.loadRealChroByProbe(probeId);
		if(data==null||data[0].CHROVAL==null)data=0;
		else data=data[0].CHROVAL;
	    //axisData = (new Date()).toLocaleTimeString().replace(/^\D*/,'');
	    axisData = (new Date()).format("HH:mm:ss"); 
	    var data0 = self._option.series[0].data;
	    if(data0.length>=5){
	    	data0.shift();
	    	self._option.xAxis[0].data.shift();
	    }
	    data0.push(data);
	    
	    self._option.xAxis[0].data.push(axisData);
	    self._echarts.setOption(self._option);
	}, 5000);
}