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
	EmsStatusCount(); //企业数量统计
	
	EmsClassCount(); //企业分类统计
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
		url : BASE_URL+'/mobile/emscountapi/emsCount',
		cache : false,
		data:$("#emscountform").serializeArray(),
		dataType : 'json',
		global : false,
		success : function(map) {
			if(map.success==true){
				var entcount = 0;//企业总数
				var plancount = 0;//预案总数
				var planentY = 0;//已编制预案生产经营单位总数
				var planentN = 0;//未编制预案生产经营单位总数
				//初始化为0
				$('#entcount').text(0);
				$('#plancount').text(0);
				$('#planentY').text(0);
				$('#planentN').text(0);
				if(map.datas!=null){
					entcount = map.datas.entcount;
					plancount = map.datas.plancount;
					planentY = map.datas.planentY;
					planentN = map.datas.planentN;
				}
				$('#entcount').html(entcount);
				$('#plancount').html(plancount);
				$('#planentY').html(planentY);
				$('#planentN').html(planentN);
			}
		}
	});
}

/**
 * 根据重大危险源分类统计
 */
var xClassArrayData = new Array();//x轴数据
var entCountArrayDate = new Array();//企业总数数组
var planCountArrayData = new Array();//预案总数数组
var planYArrayDate = new Array();//已编制预案企业数
var palnNArrayDate = new Array();//未编制预案企业数

function EmsClassCount(){
	xClassArrayData = [];
	entCountArrayDate = [];
	planCountArrayData = [];
	planYArrayDate = [];
	palnNArrayDate = [];
	
	var dangerTypeData = SelectOption.getDangerTypeData();//重大危险源类别 
	$.ajax({
		type : 'post',
		url : BASE_URL+'/mobile/emscountapi/emsclasscount',
		cache : false,
		data:$("#emscountform").serializeArray(),
		dataType : 'json',
		global : false,
		success : function(map) {
			if(map.success==true){
				for(var j=0;j<dangerTypeData.length;j++){
					if(map.datas.length>0){
						for(var i=0;i<map.datas.length;i++){
							var dangertype = map.datas[i].DANGERTYPE; //分类
							
							var entcount = map.datas[i].ENTCOUNT; //企业数
							var plancount = map.datas[i].PLANCOUNT; //预案数
							var planYcount = map.datas[i].PLANYCOUNT; //已编制预案的企业数
							var planNcount = 0;
							if(entcount >0 && entcount > planYcount)
								planNcount = map.datas[i].PLANNCOUNT; //未编制预案的企业数
							
							if(dangerTypeData[j].code == dangertype){
								$("#entcount"+(j+1)).html(entcount);
								$("#planYcount"+(j+1)).html(planYcount);
								$("#planNcount"+(j+1)).html(planNcount);
								$("#plancount"+(j+1)).html(plancount);
								
								entCountArrayDate[j] = entcount;
								planCountArrayData[j] = plancount;
								planYArrayDate[j] = planYcount;
								palnNArrayDate[j] = planNcount;
								break;
							}else{
								entCountArrayDate[j] = 0;
								planCountArrayData[j] = 0;
								planYArrayDate[j] = 0;
								palnNArrayDate[j] = 0;
							}
						}
					}else{
						$("#entcount"+(j+1)).html("0");
						$("#planYcount"+(j+1)).html("0");
						$("#planNcount"+(j+1)).html("0");
						$("#plancount"+(j+1)).html("0");
						entCountArrayDate[j] = 0;
						planCountArrayData[j] = 0;
						planYArrayDate[j] = 0;
						palnNArrayDate[j] = 0;
					}
					xClassArrayData.push(dangerTypeData[j].name);
				}
				changeCountView();
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
 * 行政区域统计-显示计划执法企业统计
 */
function EmsPlanCount(){
	var districtData = new Array();
	var districtValue = new Array();
	$.ajax({
		type : 'post',
		url : BASE_URL+'/mobile/emscountapi/emsdistrictplan',
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
						      				text : $("#districtname").text()+'预案编制企业',
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
