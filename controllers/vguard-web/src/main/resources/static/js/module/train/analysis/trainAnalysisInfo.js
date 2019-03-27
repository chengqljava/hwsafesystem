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

/**
 * 点击事件进行查询
 */
function onclick(){
	/**列表加载项**/
	TrainInfoCount(0); 
	
	/**单选加载项**/
	changeCountView();
}

//路径配置
require.config({
	paths : {
		echarts : BASE_URL + '/js/lib/echarts'
	}
});


/**
 * 显示分级饼状图统计
 * @param classData
 * @param classValue
 */
function showGradePie(gradeData,gradeValue){
	require([ 'echarts', 'echarts/chart/pie' //使用柱状图就加载bar模块，按需加载
	      	], function(ec) {
	      		// 基于准备好的dom，初始化echarts图表
	      		var myChart = ec.init(document.getElementById('p1'));
	      		var option = {
	      			title : {
	      				text : $("#districtname").text()+'分级图',
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
	      		        data:gradeData
	      		    },
	      		    calculable : false,//false 禁止拖动
	      		    series : [
	      		        {
	      		            name:'数量',
	      		            type:'pie',
	      		            radius : '55%',
	      		            center: ['50%', '60%'],
	      		            data:gradeValue,
	      		        }
	      		    ]
	      		};
	      		myChart.setOption(option);
	      	});
}


/**
 * 根据企业分类统计
 */
var classValue = new Array();
function TrainInfoCount(status){
	$.ajax({
		type : 'post',
		url : BASE_URL+'/train/etstrainanalysis/trainCount',
		cache : false,
		data:$("#traincountform").serializeArray(),
		dataType : 'json',
		global : false,
		success : function(map) {
			if(map.success==true){
				$('#pxjl').text(map.pxjl);
				$('#ksjl').text(map.ksjl);
				$('#kcjl').text(map.kcjl);
				
				if(status=="0"){
					var classData = ["在线视频","在线培训","会议培训"];
					var classValue = new Array();
					classValue[0] = {value:map.zxsp,name:"在线视频"};
					classValue[1] = {value:map.zxpx,name:"在线培训"};
					classValue[2] = {value:map.hypx,name:"会议培训"};
					
				}else if(status=="1"){
					var classData = ["高级","中级","初级"];
					var classValue = new Array();
					classValue[0] = {value:map.high,name:"高级"};
					classValue[1] = {value:map.middle,name:"中级"};
					classValue[2] = {value:map.low,name:"初级"};
				}
				showClassPie(classData,classValue);//分类饼状图
			}
		}
	});
}

/**
 * 显示分类饼状图统计
 * @param classData
 * @param classValue
 */
function showClassPie(classData,classValue){
	require([ 'echarts', 'echarts/chart/pie' //使用柱状图就加载bar模块，按需加载
	      	], function(ec) {
	      		// 基于准备好的dom，初始化echarts图表
	      		var myChart = ec.init(document.getElementById('p1'));
	      		var option = {
	      			title : {
	      				text : '分类图',
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
	      		        data:classData
	      		    },
	      		    calculable : false,//false 禁止拖动
	      		    series : [
	      		        {
	      		            name:'数量',
	      		            type:'pie',
	      		            radius : '55%',
	      		            center: ['50%', '60%'],
	      		            data:classValue,
	      		        }
	      		    ]
	      		};
	      		myChart.setOption(option);
	      	});
}



/**
 * 进入培训记录页面
 */
function intoTrainInfo(statustype){
	var stime = $("#stime").val();
	var etime = $("#etime").val();
	var statuses= "";
	var title="";
	var url = "";
	if(statustype == "pxjl"){
		//培训记录
		title = "培训记录";
		url = "/views/module/train/trnRecord/govTrnRecordList.html";
	}else if(statustype == "ksjl"){
		//考试记录
		title = "考试记录";
		url = "/views/module/train/exaRecord/govExaRecordList.html";
	}else if(statustype == "kcjl"){
		//课程记录
		title = "课程记录";
		url = "/views/module/train/etsciscourseinfo/ciscourseinfoList.html";
	}
	parent.openWin(BASE_URL+url+'?stime='+stime+'&etime='+etime,title,'80%','90%');
}


/**
 * 统计图的切换
 */
function changeCountView(){
	var radioValue =  $('input:radio:checked').val();
	TrainInfoCount(radioValue);
}