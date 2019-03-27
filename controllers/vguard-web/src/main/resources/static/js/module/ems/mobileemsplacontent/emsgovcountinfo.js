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
	/**政府预案统计**/
	EmsStatusCount(); //企业数量统计
	/**统计图**/
	changeCountView();
}

/**
 * 执法企业
 */
/*function intoLawcheckList(state,title){
	var districtid =  $("#districtid").val();
	parent.openWin(BASE_URL+'/law/lawcount/intoLawcheckList/'+state,title,'80%','90%');
}*/


//路径配置
require.config({
	paths : {
		echarts : BASE_URL + '/js/lib/echarts'
	}
});

/**
 * 根据企业、预案统计
 */
function EmsStatusCount(){
	$.ajax({
		type : 'post',
		url : BASE_URL+'/mobile/emscountapi/emsplantypecount',
		cache : false,
		data:$("#emscountform").serializeArray(),
		dataType : 'json',
		global : false,
		success : function(map) {
			if(map.success==true){
				var plancount = 0;//预案总数
				var plan1 = 0;//综合预案
				var plan2 = 0;//专项预案
				var plan3 = 0;//应急处置预案
				//初始化为0
				$('#plancount').text(0);
				$('#plan1').text(0);
				$('#plan2').text(0);
				$('#plan3').text(0);
				if(map.datas!=null){
					if(map.datas.PLANCOUNT)
					plancount = map.datas.PLANCOUNT;
					if(map.datas.PLAN1)
					plan1 = map.datas.PLAN1;
					if(map.datas.PLAN2)
					plan2 = map.datas.PLAN2;
					if(map.datas.PLAN3)
					plan3 = map.datas.PLAN3;
				}
				$('#plancount').html(plancount);
				$('#plan1').html(plan1);
				$('#plan2').html(plan2);
				$('#plan3').html(plan3);
			}
		}
	});
}


/**
 * 统计图的切换
 */
function changeCountView(){
	var radioValue =  $('input:radio:checked').val();
	if(radioValue == 1){
		//分类统计
		$("#state").val("0");
		EmsPlanCount();
	}
}

/**
 * 行政区域统计-显示预案
 */
function EmsPlanCount(){
	var districtData = new Array();
	var districtValue = new Array();
	$.ajax({
		type : 'post',
		url : BASE_URL+'/mobile/emscountapi/emsgovdistrictplan',
		cache : false,
		data:$("#emscountform").serializeArray(),
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
						      				text : $("#districtname").text()+'预案信息',
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
