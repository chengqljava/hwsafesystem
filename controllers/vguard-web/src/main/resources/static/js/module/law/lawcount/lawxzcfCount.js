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
		setTimeByQarter($(this).text(),$("#qarter").val());
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
			$("#qarter").val($(this).text());
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
	$("#qarter").val(curQarter);
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
function searchDistrict(districtid,name){
	$("#districtid").val(districtid);
	$("#districtname").text(name);
	onclick();
}
/**
 * 点击事件进行查询
 */
function onclick(){
	/**列表加载项**/
	LawStatusCount(); // 处罚数量统计
	
	/**统计图**/
	changeCountView();
	
	/**
	 * 绑定方法
	 */
	//点击执法部门
	//现场处理
	$("#PUNISHSCE").on("click",function(){
		intoLawpunishList();
	});
	//行政处罚(个人)
	$("#PUNISHPER").on("click",function(){
		intoLawpunishList("1","行政处罚统计(个人)");
	});
	//行政处罚(单位)
	$("#PUNISHUNIT").on("click",function(){
		intoLawpunishList("0","行政处罚统计(单位)");
	});
	/**统计表**/
	//行政处罚
	$("#lawpunish").on("click",function(){
		intoLawpunishList("null","行政处罚统计");
	});
}

/**
 * 行政处罚统计
 */
function intoLawpunishList(punishtype,title){
	var districtid =  $("#districtid").val();
	parent.openWin(BASE_URL+'/law/lawcount/lawpunishList/'+punishtype,title,'80%','90%');
}

//路径配置
require.config({
	paths : {
		echarts : BASE_URL + '/js/lib/echarts'
	}
});

/**
 * 判断平台端OR移动端
 */
function getURL(url){
	if($("#appcount").val()){
		url = '/mobile'+url;
	}
	return url;
}

/**
 * 根据处罚统计
 */
function LawStatusCount(){
	$.ajax({
		type : 'post',
		url : BASE_URL+getURL('/law/lawcount/loadpunishCount'),
		cache : false,
		data:$("#lawcountform").serializeArray(),
		dataType : 'json',
		global : false,
		success : function(map) {
			if(map.success==true){
				var PUNISHSCE = 0;//现场处理
				var PUNISHPER = 0;//行政处罚(个人)
				var PUNISHUNIT = 0;//行政处罚(单位)
				//初始化为0
				$('#PUNISHSCE').text(0);
				$('#PUNISHPER').text(0);
				$('#PUNISHUNIT').text(0);
				if(map.datas!=null){
					for(var key in map.datas){
						var doc = map.datas[key]; 
						for(var i in doc){
							if(i == 'doccode'){
								//《行政处罚决定书（单位）》
								if(doc[i] == 'XZCFJDSDW'){
									PUNISHUNIT = doc['count'];
								}
								//《行政处罚决定书（个人）》
								if(doc[i] == 'XZCFJDSGR'){
									PUNISHPER = doc['count'];
								}
								//《现场处理措施决定书》
								if(doc[i] == 'XCCLCSJDS'){
									PUNISHSCE = doc['count'];
								}
							}
						}
					}
					
				}
				$('#PUNISHSCE').html(PUNISHSCE);
				$('#PUNISHPER').html(PUNISHPER);
				$('#PUNISHUNIT').html(PUNISHUNIT);
			}
		}
	});
}

//柱状图x、y轴数组数据
var categories = [];  
var values = [];

/**
 * 统计图的切换
 */
function changeCountView(){
	var radioValue =  $('input:radio:checked').val();
	if(radioValue == 2){
		//执法检查柱状图
		punishBarCount();
	}
}

/**
 * 行政区域统计-显示执法检查信息统计
 */
function CheckRecordCount(){
	var districtData = new Array();
	var districtValue = new Array();
	$.ajax({
		type : 'post',
		url : BASE_URL+getURL('/law/lawcount/loadDistrictCheckRecordCount'),
		cache : false,
		data:$("#lawcountform").serializeArray(),
		dataType : 'json',
		global : false,
		success : function(map) {
			if(map.success==true){
				//分布统计
				if(map.datas!=null){
					var json = "";
					for(var i=0;i<map.datas.length;i++){
						var areaname = map.datas[i].AREANAME; //区、县分布
						var areanum = map.datas[i].AREANUM; //区、县分布数量
						districtData.push(areaname);
						districtValue.push({value:areanum,name:areaname});
					}
					require([ 'echarts', 'echarts/chart/pie' //使用柱状图就加载bar模块，按需加载
						      	], function(ec) {
						      		// 基于准备好的dom，初始化echarts图表
						      		var myChart = ec.init(document.getElementById('p1'));
						      		var option = {
						      			title : {
						      				text : $("#districtname").text()+'计划执法企业',
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
						      		        data:districtData
						      		    },
						      		    calculable : false,//false 禁止拖动
						      		    series : [
						      		        {
						      		            name:'数量',
						      		            type:'pie',
						      		            radius : '55%',
						      		            center: ['40%', '60%'],
						      		            data:districtValue,
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
 * 行政区域统计-显示分布饼状图统计
 */
function LawDistrictCount(){
	var districtData = new Array();
	var districtValue = new Array();
	$.ajax({
		type : 'post',
		url : BASE_URL+getURL('/law/lawcount/lawDistrictCount'),
		cache : false,
		data:$("#lawcountform").serializeArray(),
		dataType : 'json',
		global : false,
		success : function(map) {
			if(map.success==true){
				//分布统计
				if(map.datas!=null){
					var json = "";
					for(var i=0;i<map.datas.length;i++){
						var areaname = map.datas[i].AREANAME; //区、县分布
						var areanum = map.datas[i].AREANUM; //区、县分布数量
						districtData.push(areaname);
						districtValue.push({value:areanum,name:areaname});
					}
					require([ 'echarts', 'echarts/chart/pie' //使用柱状图就加载bar模块，按需加载
						      	], function(ec) {
						      		// 基于准备好的dom，初始化echarts图表
						      		var myChart = ec.init(document.getElementById('p1'));
						      		var option = {
						      			title : {
						      				text : $("#districtname").text()+'案件分布图',
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
						      		        data:districtData
						      		    },
						      		    calculable : false,//false 禁止拖动
						      		    series : [
						      		        {
						      		            name:'数量',
						      		            type:'pie',
						      		            radius : '55%',
						      		            center: ['40%', '60%'],
						      		            data:districtValue,
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
 * 检查信息柱状图
 * @param categories
 * @param values
 */
function punishBarCount(){
    var year = "2017";
    categories = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"];
    values = [];
    $.ajax({
		type : 'post',
		url : BASE_URL+getURL('/law/lawcount/punishbar'),
		cache : false,
		data: $("#lawcountform").serializeArray(),
		dataType : 'json',
		global : false,
		success : function(map) {  
			if(map.success==true){
				values[0] = map.data.JANUARY;
				values[1] = map.data.FEBRUARY;
				values[2] = map.data.MARCH;
				values[3] = map.data.APRIL;
				values[4] = map.data.MAY;
				values[5] = map.data.JUNE;
				values[6] = map.data.JULY;
				values[7] = map.data.AUG;
				values[8] = map.data.SEPTEMBER;
				values[9] = map.data.OCTOBER;
				values[10] = map.data.NOVEMBER;
				values[11] = map.data.DECEMBER;
				
				
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
			        		title : {
			      				text : '年度行政处罚情况统计',
			      				textStyle: {
			      					fontSize: 14,
			      					color: '#333',
			      					fontWeight: 'normal'
			      				},
			      				x : 'center',
			      				y : '10'
			      			},
			      			grid: {
				            	x: '30',
				            	x2: '20',
				            	y: '40',
				            	y2: '30'
				            },
				            tooltip: {  
				                show: true  
				            },  
				            xAxis: [  
				                {  
				                    type: 'category',  
				                    data: categories  
				                }  
				            ],  
				            yAxis: [  
				                {  
				                    type: 'value',
				                    splitNumber: '4'
				                }  
				            ],  
				            series: [  
				                {  
				                    name: '处罚次数',  
				                    type: 'bar',  
				                    data: values  
				                }  
				            ]  
				        };  
				          
				        echart.setOption(option);  
				        echart.hideLoading();  
				    }  
				);
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
	//0.0714*100 == 7.140000000000001
	//为了让js执行的更准确，在以后的js小数计算中直接将值扩大10000倍，再除以10000，就可以解决问题
    var strData = accMul(data,100);
    var ret = strData.toString()+"%";
    return ret;
}

//乘法函数，用来得到精确的乘法结果
//说明：javascript的乘法结果会有误差，在两个浮点数相乘的时候会比较明显。这个函数返回较为精确的乘法结果。
//调用：accMul(arg1,arg2)
//返回值：arg1乘以arg2的精确结果
function accMul(arg1,arg2){
  var m=0,s1=arg1.toString(),s2=arg2.toString();
  try{m+=s1.split(".")[1].length}catch(e){}
  try{m+=s2.split(".")[1].length}catch(e){}
  return Number(s1.replace(".",""))*Number(s2.replace(".",""))/Math.pow(10,m);
}
