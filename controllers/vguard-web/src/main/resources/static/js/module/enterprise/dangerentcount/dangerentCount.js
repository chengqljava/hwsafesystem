$(document).ready(function() {
	$(".year").on("click","li",function(){
		$(this).addClass('cur').siblings().removeClass('cur');
		var year = parseInt($(this).text());
		$("#year").val(year);
		onclick();
		if($(this).index() == 0){
			var year = parseInt($(this).text());
		   var html = 
			"<li onclick='changeYear("+(year-2)+")' id='year"+(year-2)+"'>"+(year-2)+"</li>"+
			"<li onclick='changeYear("+(year-1)+")' id='year"+(year-1)+"'>"+(year-1)+"</li>"+
			"<li class='cur' onclick='changeYear("+year+")' id='year"+year+"'>"+year+"</li>"+
			"<li onclick='changeYear("+(year+1)+")' id='year"+(year+1)+"'>"+(year+1)+"</li>"+
			"<li onclick='changeYear("+(year+2)+")' id='year"+(year+2)+"'>"+(year+2)+"</li>";
		   $(".year").html(html);
		}else if($(this).index() == 4){
			var year = parseInt($(this).text());
			var curYear = new Date().getFullYear();
			if(year != curYear){
				 var html = 
						"<li onclick='changeYear("+(year-2)+")' id='year"+(year-2)+"'>"+(year-2)+"</li>"+
						"<li onclick='changeYear("+(year-1)+")' id='year"+(year-1)+"'>"+(year-1)+"</li>"+
						"<li class='cur' onclick='changeYear("+year+")' id='year"+year+"'>"+year+"</li>"+
						"<li onclick='changeYear("+(year+1)+")' id='year"+(year+1)+"'>"+(year+1)+"</li>"+
						"<li onclick='changeYear("+(year+2)+")' id='year"+(year+2)+"'>"+(year+2)+"</li>";
				$(".year").html(html);
			}
		}
	});
	
	onclick();
});


/**
 * 年份切换
 */
function changeYear(year){
	$("#year").val(year);
	$("ul.year li").removeClass("cur");
	$("#year"+year).addClass("cur");
	onclick();
}

/**
 * 点击事件进行查询
 */
function onclick(){
	EntCount(); 
}

/*加载行政区域*/
function searchDistrict(districtid){
	$("#districtid").val(districtid);
	onclick();
}


var categories = ["生产", "经营", "其中仓储经营", "运输", "使用", "废弃处置"];  
var values = [];
var districtname;
/**
 * 危化品企业报告
 */
function EntCount(){
	$.ajax({
		type : 'post',
		url : BASE_URL+'/enterprise/dangerentcount/report',
		cache : false,
		data: $("#dangerentcountform").serializeArray(),
		dataType : 'json',
		global : false,
		success : function(map) {  
			if(map.success==true){
				$("#districtname").html(map.data.name);
				$("#entqty").html(map.data.entqty);
				$("#permitentqty").html(map.data.permitentqty);
				$("#permitqty").html(map.data.permitqty);
				$("#nopermitqty").html(map.data.nopermitqty);
				$("#producqty").html(map.data.producqty);
				$("#businessqty").html(map.data.businessqty);
				$("#storageqty").html(map.data.storageqty);
				$("#portqty").html(map.data.portqty);
				$("#portstorage").html(map.data.portstorage);
				$("#gasqty").html(map.data.gasqty);
				$("#gasstorage").html(map.data.gasstorage);
				$("#chemicalqty").html(map.data.chemicalqty);
				$("#chemicalstorage").html(map.data.chemicalstorage);
				$("#transportqty").html(map.data.transportqty);
				$("#businesstransport").html(map.data.businesstransport);
				$("#nobusinesstransport").html(map.data.nobusinesstransport);
				$("#useqty").html(map.data.useqty);
				$("#disposqty").html(map.data.disposqty);
				$("#preexpire").html(map.data.preexpire);
				$("#expire").html(map.data.expire);
				
				values[0] = map.data.producqty;
				values[1] = map.data.businessqty;
				values[2] = map.data.storageqty;
				values[3] = map.data.transportqty;
				values[4] = map.data.useqty;
				values[5] = map.data.disposqty;
				
				districtname = map.data.name;
				
				var chartype = $("input[name='echarttype']:checked").val();
				selectEChartType(chartype);
			}
		}
	});
}

/**
 * 转为百分数
 * @param data
 * @returns {String}
 */
function toPercent(data){
    var strData = parseFloat(data)*100;
    var ret = strData.toString()+"%";
    return ret;
}

/**
 * 危化品企业详细列表
 * @param chemicaltype	危化品类型
 */
function getInfo(chemicaltype){
	var year = $("#year").val();
	var districtid = $("#districtid").val();
	parent.openWin(BASE_URL+"/enterprise/dangerentcount/displaydangerent/"+year+"/"+chemicaltype+"?districtid="+districtid,'详细','80%','60%');
}

/**
 * 许可企业证书列表
 * @param chemicaltype	危化品类型
 */
function getChelicence(chemicaltype){
	var year = $("#year").val();
	var districtid = $("#districtid").val();
	parent.openWin(BASE_URL+"/enterprise/dangerentcount/displayChelienceList/"+year+"/"+chemicaltype+"?districtid="+districtid,'详细','80%','60%');
}

/**
 * 许可预警列表信息
 * @param expire	是否超期
 */
function getExpireInfo(expire){
	var year = $("#year").val();
	var districtid = $("#districtid").val();
	parent.openWin(BASE_URL+"/enterprise/dangerentcount/displaypermitwarn/"+year+"/"+expire+"?districtid="+districtid,'详细','80%','60%');
}

/**
 * 按行政区划统计各种危化品企业数量
 */
function getDistrictEntCount(){
	var year = $("#year").val();
	var districtid = $("#districtid").val();
	parent.openWin(BASE_URL+"/enterprise/dangerentcount/displaydistrictent/"+year+"?districtid="+districtid,'危险化学品许可证数量统计表','80%','60%');
}


function selectEChartType(type){
    if(values || values.length==0){  
        var year = $("#year").val();
        // 加载数据  
        $.getJSON(BASE_URL+'/enterprise/dangerentcount/echartreport?year='+year, function (json) {  
            categories = json.categories;  
            values = json.values;  
        });  
    }
    
	if(type=='pie'){
		showPieEChart(categories,values);
	}else{
		showBarEChart(categories,values);
	}
} 

//路径配置
require.config({
	paths : {
		echarts : BASE_URL + '/js/lib/echarts'
	}
});


function showBarEChart(categories,values){
	// 按需加载  
	require(  
	    [  
	        'echarts',   
	        'echarts/chart/bar'  
	    ],  
	    function (ec) {  
	        var chart = document.getElementById('p1');  
	        var echart = ec.init(chart);  
	          
	        echart.showLoading({  
	            text: '正在努力加载中...'  
	        });
	          
	        var option = {  
	            tooltip: {  
	                show: true  
	            },  
	            legend: {  
	                data: [districtname+'危化品企业许可证分布图']  
	            },  
	            xAxis: [  
	                {  
	                    type: 'category',  
	                    data: categories  
	                }  
	            ],  
	            yAxis: [  
	                {  
	                    type: 'value'  
	                }  
	            ],  
	            series: [  
	                {  
	                    'name': '许可类型',  
	                    'type': 'bar',  
	                    'data': values  
	                }  
	            ]  
	        };  
	          
	        echart.setOption(option);  
	        echart.hideLoading();  
	    }  
	);
}


function showPieEChart(categories,values){
	// 按需加载  
	require(  
	    [  
	        'echarts',   
	        'echarts/chart/pie'  
	    ],  
	    function (ec) {  
	        var chart = document.getElementById('p1');  
	        var echart = ec.init(chart);  
	          
	        echart.showLoading({  
	            text: '正在努力加载中...'  
	        });  
	          

	    	var map = new Array();
	    	for(var i=0;i<categories.length;i++){
	    		map.push({value:values[i],name:categories[i]});
	    	}
	        
	        var option = {  
	      		title : {
	      			text : districtname+'危化品企业许可证分布图',
	      			x : 'center',
	      			y : 'top'
	      		},
      		    tooltip : {
      		        trigger: 'item',
      		        formatter: "{a} <br/>{b} : {c} ({d}%)"
      		    }, 
      		    legend: {
      		        orient : 'vertical',
      		        x : 'right',
      		        y : 'bottom',
      		        data:categories
      		    }, 
      		    calculable : false,//false 禁止拖动
      		    series : [
		      		        {
		      		            name:'数量',
		      		            type:'pie',
		      		            radius : '55%',
		      		            center: ['50%', '60%'],
		      		            data:map
		      		        }
		      		    ] 
	        };  
	          
	        echart.setOption(option);  
	        echart.hideLoading();  
	    }  
	);
}


