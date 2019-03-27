$(function(){
	//获取事故信息id
	var probeid = GetQueryString("probeid");
	loadDataCurve(probeid);
});

/**
 * 加载曲线图
 * @param dataid
 * @returns
 */
 function loadDataCurve(dataid){
　　	var myLineChart = echarts.init(document.getElementById('chart'));
	var data=monitordatas.loadRealChroByProbe(dataid);
	var chroval = data[0].CHROVAL;
	var probename = data[0].PROBENAME;
	
	var date = [];
	var now;

	var dataY = [chroval];

	function addData(shift) {
	    now = (new Date()).format("hh:mm:ss");
	   
		date.push(now);
		
	    var data=monitordatas.loadRealChroByProbe(dataid);
		var chroval = data[0].CHROVAL;
	    dataY.push(chroval);

	    if (shift) {
	        date.shift();
	        dataY.shift();
	    }

	    now =(new Date()).format("hh:mm:ss");
	}

	for (var i = 1; i < 7; i++) {
	    addData();
	}
　　var option = {
	　　title : {
	　　text: '',
	　　subtext: ''
	　　},
	   backgroundColor: '#002e6e',
	   color: '#fff',
	　　tooltip : {
	　　　　trigger: 'axis'
	　　},
	　　legend: {
			orient: 'vertical',
	        x: 'right',
	　　　　data:[probename]
	　　},
	　　xAxis : [
	　　　　{
	　　　　　　type : 'category',
	        name: '时间',
	　　　　　　boundaryGap : false,
	　　　　　　data : date
	　　　　}
	　　],
	　　yAxis : [
	　　　　{
	　　　　　　type : 'value',
	      	name: '浓度值',
	　　　　　　axisLabel : {
	　　　　　　　　formatter: '{value}'
	　　　　　　}
	　　　　}
	　　],
	　　series : [
	　　　　{
	　　　　　　name:probename,
	　　　　　　type:'line',
				smooth: true,
				itemStyle: {
					normal: {
						areaStyle: {type: 'default'}
					}
				},
	　　　　　　data:dataY
	　　　　}
	　　],
	 color: ['rgb(28,220,168)']
	};
	myLineChart.setOption(option);
	var realimeTicket = setInterval(function (){
		 addData(true);
		 myLineChart.setOption({
		        xAxis: {
		            data: date
		        },
		        series: [{
		            data: dataY
		        }]
		    });
		 
	}, 5000);
}
 
 
function GetQueryString(name)
{
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}
