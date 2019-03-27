$(document).ready(function() {
	changQarter();
	onclick();
	var currYear = new Date().getFullYear();
	var html= "<li>"+(currYear-4)+"</li>"+
	"<li>"+(currYear-3)+"</li>"+
	"<li>"+(currYear-2)+"</li>"+
	 "<li>"+(currYear-1)+"</li>"+
	 "<li class='cur'>"+currYear+"</li>";
	$(".year").html(html);
	
	$(".year").on("click","li",function(){
		$(this).addClass('cur').siblings().removeClass('cur');
		setTimeByQarter($(this).text(),$("#quarter").val());
		onclick();
		if($(this).index() == 0){
		   var year = parseInt($(this).text());
		   var html= "<li>"+(year-2)+"</li>"+
			    	 "<li>"+(year-1)+"</li>"+
			    	 "<li class='cur'>"+year+"</li>"+
			    	 "<li>"+(year+1)+"</li>"+
			    	 "<li>"+(year+2)+"</li>";
		   $(".year").html(html);
		}else if($(this).index() == 4){
			var year = parseInt($(this).text());
			var curYear = new Date().getFullYear();
			if(year != curYear){
				var html= "<li>"+(year-2)+"</li>"+
					      "<li>"+(year-1)+"</li>"+
					      "<li class='cur'>"+year+"</li>"+
					      "<li>"+(year+1)+"</li>"+
					      "<li>"+(year+2)+"</li>";
				$(".year").html(html);
			}
		}
	});
	
	$(".quarter").find("li").each(function(){
		$(this).bind("click",function(){
			$(this).addClass('cur').siblings().removeClass('cur');
			var year = $("#stime").val().substring(0,4);
			$("#quarter").val($(this).text());
			setTimeByQarter(year,$(this).text());
			onclick();
		});
	});
});



/**
 * 季度切换
 */
function changQarter(){
	var curYear = new Date().getFullYear();
	var curMonth = new Date().getMonth()+1;
	var curQarter = getQarter2Month(curMonth);
	switch(curQarter){
	case 1:
		$("#one").addClass("cur");
		break;
	case 2:
		$("#two").addClass("cur");
		break;
	case 3:
		$("#three").addClass("cur");
		break;
	case 2:
		$("#four").addClass("cur");
		break;
	}
	$("#"+curQarter).addClass("cur");
	$("#quarter").val(curQarter);
	setTimeByQarter(curYear,curQarter)
}

/**
 * 根据季度设置时间
 * @param qarter
 */
function setTimeByQarter(year,qarter){
	if(qarter == 1){
		$("#stime").val(year+"-01-01");
		$("#etime").val(year+"-03-31");
	}else if(qarter == 2){
		$("#stime").val(year+"-04-01");
		$("#etime").val(year+"-06-30");
	}else if(qarter == 3){
		$("#stime").val(year+"-07-01");
		$("#etime").val(year+"-09-30");
	}else if(qarter == 4){
		$("#stime").val(year+"-10-01");
		$("#etime").val(year+"-12-31");
	}
	$("#year").val(year);
}

/**
 * 根据月份获取季度
 * @param month
 */
function getQarter2Month(month){
	if(1<=month && month<=3){
		return 1;
	}else if(4<=month && month<=6){
		return 2;
	}else if(7<=month && month<=9){
		return 3;
	}else{
		return 4;
	}
}

/*加载行政区域*/
function searchDistrict(districtid){
	$("#districtid").val(districtid);
	onclick();
}

/**
 * 点击事件进行查询
 */
function onclick(){
	/**列表加载项**/
	HdiEntCount(); //隐患排查统计
	
	/**单选加载项**/
	selectEChartType();
}

/**
 * 隐患排查统计报告
 */
function HdiEntCount(){
	$.ajax({
		type : 'post',
		url : BASE_URL+'/hiddendanger/hdientcount/report',
		cache : false,
		data: $("#hdientcountform").serializeArray(),
		dataType : 'json',
		global : false,
		success : function(map) {  
			if(map.success==true){
				$("#districtname").html(map.data.districtname);
				$("#entqty").html(map.data.entqty);
				$("#entqty2").html(map.data.entqty);
				$("#selfcheckedqty").html(map.data.selfcheckedqty);
				$("#noselfcheckqty").html(map.data.noselfcheckqty);
				$("#selfcheckingqty").html(map.data.selfcheckingqty);
				$("#selfcheckrate").html(map.data.selfcheckrate);
				$("#selfhdientqty").html(map.data.selfhdientqty);
				$("#selfhdiqty").html(map.data.selfhdiqty);
				$("#selfhdirate").html(map.data.selfhdirate);
				$("#selfreformedqty").html(map.data.selfreformedqty);
				$("#noselfreformqty").html(map.data.noselfreformqty);
				$("#selfreformingqty").html(map.data.selfreformingqty);
				$("#selfreformrate").html(map.data.selfreformrate);
				$("#patroledqty").html(map.data.patroledqty);
				$("#nopatrolqty").html(map.data.nopatrolqty);
				$("#patrolrate").html(map.data.patrolrate);
				$("#patrolhdientqty").html(map.data.patrolhdientqty);
				$("#patrolhdiqty").html(map.data.patrolhdiqty);
				$("#patrolhdirate").html(map.data.patrolhdirate);
				$("#patrolreformedqty").html(map.data.patrolreformedqty);
				$("#nopatrolreformqty").html(map.data.nopatrolreformqty);
				$("#patrolreformingqty").html(map.data.patrolreformingqty);
				$("#patrolreformrate").html(map.data.patrolreformrate);
				
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
 * 企业总计列表
 */
function getEntList(){
	parent.openWin(BASE_URL+"/hiddendanger/hdientcount/dispalyentlist",'监管企业','80%','60%');
}

/**
 * 自查企业列表
 */
function getSelfCheckEntList(checkresult){
	var year = $("#year").val();
	var quarter = $("#quarter").val();
	parent.openWin(BASE_URL+"/hiddendanger/hdientcount/displayselfcheckentlist?checkresult="+checkresult+"&year="+year+"&quarter="+quarter,'自查企业列表','80%','60%');
}

/**
 * 自查隐患企业列表
 */
function getSelfCheckHdEntList(){
	var year = $("#year").val();
	var quarter = $("#quarter").val();
	parent.openWin(BASE_URL+"/hiddendanger/hdientcount/displayselfcheckentlist?restate=1&year="+year+"&quarter="+quarter,'自查隐患企业列表','80%','60%');
}

/**
 * 自查隐患列表
 */
function getSelfCheckHdList(reformstate){
	var year = $("#year").val();
	var quarter = $("#quarter").val();
	parent.openWin(BASE_URL+"/hiddendanger/hdientcount/displayselfcheckhdlist?reformstate="+reformstate+"&year="+year+"&quarter="+quarter,'自查隐患列表','80%','60%');
}

/**
 * 巡查对象列表
 */
function getPatrolEntList(patrolstate){
	var year = $("#year").val();
	var quarter = $("#quarter").val();
	parent.openWin(BASE_URL+"/hiddendanger/hdientcount/displaypatrolentlist?patrolstate="+patrolstate+"&year="+year+"&quarter="+quarter,'巡查对象列表','80%','60%');
}

/**
 * 巡查隐患企业列表
 */
function getPatrolHdEntList(){
	var year = $("#year").val();
	var quarter = $("#quarter").val();
	parent.openWin(BASE_URL+"/hiddendanger/hdientcount/displaypatrolentlist?patrolstate=&restate=1&year="+year+"&quarter="+quarter,'巡查隐患企业列表','80%','60%');
}

/**
 * 巡查隐患列表
 */
function getPatrolHdList(reformstate){
	var year = $("#year").val();
	var quarter = $("#quarter").val();
	parent.openWin(BASE_URL+"/hiddendanger/hdientcount/displaypatrolhdlist?reformstate="+reformstate+"&year="+year+"&quarter="+quarter,'巡查隐患列表','80%','60%');
}

/**
 * 安全隐患排查治理情况汇总表（块网格）
 */
function getEntDistrictCountList(){
	var year = $("#year").val();
	var quarter = $("#quarter").val();
	var districtid = $("#districtid").val();
	parent.openWin(BASE_URL+"/hiddendanger/hdientcount/displayentdistrictcountlist?year="+year+"&quarter="+quarter+"&districtid="+districtid,'安全隐患排查治理情况汇总表（块网格）','80%','60%');
}

/**
 * 安全隐患排查治理情况汇总表（条网格）
 */
function getEntOrgCountList(){
	var year = $("#year").val();
	var quarter = $("#quarter").val();
	parent.openWin(BASE_URL+"/hiddendanger/hdientcount/displayentorgcountlist?year="+year+"&quarter="+quarter+"&orgid=",'安全隐患排查治理情况汇总表（条网格）','80%','60%');
}







function selectEChartType(){
	var radioValue =  $('input:radio:checked').val();
	if(radioValue == 'selfcheck'){
		//自查自报
		EntSelfCheckChart();
	}else if(radioValue == 'patrol'){
		//网格巡查
		EntPatrolChart();
	}else if(radioValue == 'selfcheckhd'){
		//自查隐患
		EntSelfCheckHdChart();
	}else if(radioValue == 'patrolhd'){
		//巡查隐患
		EntPatrolHdChart();
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
	                data: ['上海市危化品企业许可证分布图']  
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
	      			text : '上海市危化品企业许可证分布图',
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


/**
 * 自查自报柱状图统计
 */
function EntSelfCheckChart(){
	var stautsType = ['企业数','自查数'];
	var districtData = new Array();//行政区域
	
	var entValue = new Array();//企业数
	var selfValue = new Array();//自查数
	
	$.ajax({
		type : 'post',
		url : BASE_URL+'/hiddendanger/hdientcount/selfcheckchart',
		cache : false,
		data:$("#hdientcountform").serializeArray(),
		dataType : 'json',
		global : false,
		success : function(map) {
			if(map.success==true){
				//区县行政区域下填报情况统计
				if(map.data!=null){
					var json = "";
					var districtname = map.districtname;
					for(var i=0;i<map.data.length;i++){
						var name = map.data[i].name;
						var entvalue = map.data[i].total;
						var selfvalue = map.data[i].count;
						
						districtData.push(name);
						entValue.push(entvalue);
						selfValue.push(selfvalue);
					}
					// 使用
					require([ 'echarts', 'echarts/chart/bar' // 使用柱状图就加载bar模块，按需加载
					], function(ec) {
						// 基于准备好的dom，初始化echarts图表
						var myChart = ec.init(document.getElementById('p1'));
						var option = {
							title : {
								text : districtname +' 自查自报',
								x : 'center',
								y : 'top'
							},
							tooltip : {
								show : true,
								trigger: 'axis'
							},
							 legend: {
							        data:stautsType,
							        orient : 'vertical',
							        x : 'right',
									y : 'center'
							},
							calculable : false,//false 禁止拖动
							xAxis : [{
								type : 'category',
								data : districtData,
								name:"行政区域"
							     }],
							yAxis : [ {
								type : 'value',
								name:"数量(家)"
							} ],
							dataZoom : {  
					             show : true,  
					             realtime : true,  
					             start : 20,  
					             end : 100  
					         },
							series : [ {
								name : "企业数",
								type : "bar",
								data : entValue,
//								barWidth : 10,//柱图宽度
//								markPoint : {
//					                data : [
//					                    {type : 'max', name : "最大值"},
//					                    {type : 'min', name : "最小值"}
//					                ]
//								 }
								itemStyle: {
					                 normal: {
					                     label: {
					                         show: true
					                     }
					                 }
					             }
							   }
							   ,{
						            name:'自查数',
						            type:'bar',
						            data:selfValue,
//						        	barWidth : 10,//柱图宽度
//						            markPoint : {
//						                data : [
//						                    {type : 'max', name : "最大值"},
//						                    {type : 'min', name : "最小值"}
//						                ]}
						            itemStyle: {
						                 normal: {
						                     label: {
						                         show: true
						                     }
						                 }
						             }
						        }
							]
						};
						myChart.setOption(option);
					});
					
				}
			}
		}
	});
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
	      			text : '上海市危化品企业许可证分布图',
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


/**
 * 网格巡查柱状图统计
 */
function EntPatrolChart(){
	var stautsType = ['企业数','巡查数'];
	var districtData = new Array();//行政区域
	
	var entValue = new Array();//企业数
	var selfValue = new Array();//自查数
	
	$.ajax({
		type : 'post',
		url : BASE_URL+'/hiddendanger/hdientcount/patrolchart',
		cache : false,
		data:$("#hdientcountform").serializeArray(),
		dataType : 'json',
		global : false,
		success : function(map) {
			if(map.success==true){
				//区县行政区域下填报情况统计
				if(map.data!=null){
					var json = "";
					var districtname = map.districtname;
					for(var i=0;i<map.data.length;i++){
						var name = map.data[i].name;
						var entvalue = map.data[i].total;
						var selfvalue = map.data[i].count;
						
						districtData.push(name);
						entValue.push(entvalue);
						selfValue.push(selfvalue);
					}
					// 使用
					require([ 'echarts', 'echarts/chart/bar' // 使用柱状图就加载bar模块，按需加载
					], function(ec) {
						// 基于准备好的dom，初始化echarts图表
						var myChart = ec.init(document.getElementById('p1'));
						var option = {
							title : {
								text : districtname +' 网格巡查',
								x : 'center',
								y : 'top'
							},
							tooltip : {
								show : true,
								trigger: 'axis'
							},
							 legend: {
							        data:stautsType,
							        orient : 'vertical',
							        x : 'right',
									y : 'center'
							},
							calculable : false,//false 禁止拖动
							xAxis : [{
								type : 'category',
								data : districtData,
								name:"行政区域"
							     }],
							yAxis : [ {
								type : 'value',
								name:"数量(家)"
							} ],
							dataZoom : {  
					             show : true,  
					             realtime : true,  
					             start : 20,  
					             end : 100  
					         },
							series : [ {
								name : "企业数",
								type : "bar",
								data : entValue,
//								barWidth : 10,//柱图宽度
//								markPoint : {
//					                data : [
//					                    {type : 'max', name : "最大值"},
//					                    {type : 'min', name : "最小值"}
//					                ]}
								itemStyle: {
					                 normal: {
					                     label: {
					                         show: true
					                     }
					                 }
					             }
							   }
							   ,{
						            name:'巡查数',
						            type:'bar',
						            data:selfValue,
//						        	barWidth : 10,//柱图宽度
//						            markPoint : {
//						                data : [
//						                    {type : 'max', name : "最大值"},
//						                    {type : 'min', name : "最小值"}
//						                ]}
						            itemStyle: {
						                 normal: {
						                     label: {
						                         show: true
						                     }
						                 }
						             }
						        }
							]
						};
						myChart.setOption(option);
					});
					
				}
			}
		}
	});
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
	      			text : '上海市危化品企业许可证分布图',
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


/**
 * 自查隐患柱状图统计
 */
function EntSelfCheckHdChart(){
	var stautsType = ['隐患数','整改数'];
	var districtData = new Array();	//行政区域
	
	var hdValue = new Array();		//自查隐患数
	var reformValue = new Array();	//整改数
	
	$.ajax({
		type : 'post',
		url : BASE_URL+'/hiddendanger/hdientcount/selfcheckhdchart',
		cache : false,
		data:$("#hdientcountform").serializeArray(),
		dataType : 'json',
		global : false,
		success : function(map) {
			if(map.success==true){
				//区县行政区域下填报情况统计
				if(map.data!=null){
					var json = "";
					var districtname = map.districtname;
					for(var i=0;i<map.data.length;i++){
						var name = map.data[i].name;
						var hdvalue = map.data[i].total;
						var reformvalue = map.data[i].count;
						
						districtData.push(name);
						hdValue.push(hdvalue);
						reformValue.push(reformvalue);
					}
					// 使用
					require([ 'echarts', 'echarts/chart/bar' // 使用柱状图就加载bar模块，按需加载
					], function(ec) {
						// 基于准备好的dom，初始化echarts图表
						var myChart = ec.init(document.getElementById('p1'));
						var option = {
							title : {
								text : districtname +' 自查隐患',
								x : 'center',
								y : 'top'
							},
							tooltip : {
								show : true,
								trigger: 'axis'
							},
							 legend: {
							        data:stautsType,
							        orient : 'vertical',
							        x : 'right',
									y : 'center'
							},
							calculable : false,//false 禁止拖动
							xAxis : [{
								type : 'category',
								data : districtData,
								name:"行政区域"
							     }],
							yAxis : [ {
								type : 'value',
								name:"数量(个)"
							} ],
							dataZoom : {  
					             show : true,  
					             realtime : true,  
					             start : 20,  
					             end : 100  
					         },
							series : [ {
								name : "隐患数",
								type : "bar",
								data : hdValue,
//								barWidth : 10,//柱图宽度
//								markPoint : {
//					                data : [
//					                    {type : 'max', name : "最大值"},
//					                    {type : 'min', name : "最小值"}
//					                ]}
								itemStyle: {
					                 normal: {
					                     label: {
					                         show: true
					                     }
					                 }
					             }
							   }
							   ,{
						            name:'整改数',
						            type:'bar',
						            data:reformValue,
//						        	barWidth : 10,//柱图宽度
//						            markPoint : {
//						                data : [
//						                    {type : 'max', name : "最大值"},
//						                    {type : 'min', name : "最小值"}
//						                ]}
						            itemStyle: {
						                 normal: {
						                     label: {
						                         show: true
						                     }
						                 }
						             }
						        }
							]
						};
						myChart.setOption(option);
					});
					
				}
			}
		}
	});
}


/**
 * 巡查隐患柱状图统计
 */
function EntPatrolHdChart(){
	var stautsType = ['隐患数','整改数'];
	var districtData = new Array();	//行政区域
	
	var hdValue = new Array();		//隐患数
	var reformValue = new Array();	//整改数
	
	$.ajax({
		type : 'post',
		url : BASE_URL+'/hiddendanger/hdientcount/patrolhdchart',
		cache : false,
		data:$("#hdientcountform").serializeArray(),
		dataType : 'json',
		global : false,
		success : function(map) {
			if(map.success==true){
				//区县行政区域下填报情况统计
				if(map.data!=null){
					var json = "";
					var districtname = map.districtname;
					for(var i=0;i<map.data.length;i++){
						var name = map.data[i].name;
						var hdvalue = map.data[i].total;
						var reformvalue = map.data[i].count;
						
						districtData.push(name);
						hdValue.push(hdvalue);
						reformValue.push(reformvalue);
					}
					// 使用
					require([ 'echarts', 'echarts/chart/bar' // 使用柱状图就加载bar模块，按需加载
					], function(ec) {
						// 基于准备好的dom，初始化echarts图表
						var myChart = ec.init(document.getElementById('p1'));
						var option = {
							title : {
								text : districtname +' 巡查隐患',
								x : 'center',
								y : 'top'
							},
							tooltip : {
								show : true,
								trigger: 'axis'
							},
							 legend: {
							        data:stautsType,
							        orient : 'vertical',
							        x : 'right',
									y : 'center'
							},
							calculable : false,//false 禁止拖动
							xAxis : [{
								type : 'category',
								data : districtData,
								name:"行政区域"
							     }],
							yAxis : [ {
								type : 'value',
								name:"数量(个)"
							} ],
							dataZoom : {  
					             show : true,  
					             realtime : true,  
					             start : 20,  
					             end : 100  
					         },
							series : [ {
								name : "隐患数",
								type : "bar",
								data : hdValue,
//								barWidth : 10,//柱图宽度
//								markPoint : {
//					                data : [
//					                    {type : 'max', name : "最大值"},
//					                    {type : 'min', name : "最小值"}
//					                ]}
								itemStyle: {
					                 normal: {
					                     label: {
					                         show: true
					                     }
					                 }
					             }
							   }
							   ,{
						            name:'整改数',
						            type:'bar',
						            data:reformValue,
//						        	barWidth : 10,//柱图宽度
//						            markPoint : {
//						                data : [
//						                    {type : 'max', name : "最大值"},
//						                    {type : 'min', name : "最小值"}
//						                ]}
						            itemStyle: {
						                 normal: {
						                     label: {
						                         show: true
						                     }
						                 }
						             }
						        }
							]
						};
						myChart.setOption(option);
					});
					
				}
			}
		}
	});
}





