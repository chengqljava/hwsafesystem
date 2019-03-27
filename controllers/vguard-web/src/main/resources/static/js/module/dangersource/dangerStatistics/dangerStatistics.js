$(document).ready(function() {
	changQarter();
	onclick();
	bindOnclick();
	
	yearBindMethod();
});

function yearBindMethod(){
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
}

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
	setTimeByQarter(curYear,curQarter);
}

/**
 * 根据季度设置时间
 * @param qarter
 * @param year
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
/***********************************************************************************************/
/*加载行政区域*/
function searchDistrict(districtid,name,districtlevel){
	$("#districtid").val(districtid);
	$("#districtlevel").val(districtlevel);
	$("#districtname1").text(name);
	$("#districtname2").text(name);
	onclick();
}

/**
 * 点击事件进行查询
 */
function onclick(){
	/**列表加载项**/
	DssAreaStatusCount(); //数量统计
	DssClassCount(); //分类统计
	DssGradeCount();//分级统计
	MoreLevelCount();//多级数据
	MoreTypeCount();//多种类数据
}
/**
 * 绑定方法
 * @author lzqiang
 * @date 2016年7月12日 下午4:21:15
 */
function bindOnclick(){
	//概况中企业数点击
	$("#unitCount").on("click",function(){
		intoEntinfoList("","");
	});
	//概况中危险源数点击
	$("#dangerCount").on("click",function(){
		intoDangerList("","");
	});
	
	//危化品企业数点击
	$("#dtunit1").on("click",function(){
		intoEntinfoList(1,"");
	});
	$("#dtdanger1").on("click",function(){
		intoDangerList(1,"");
	});
	//燃气类
	$("#dtunit2").on("click",function(){
		intoEntinfoList(2,"");
	});
	$("#dtdanger2").on("click",function(){
		intoDangerList(2,"");
	});
	//港口类
	$("#dtunit3").on("click",function(){
		intoEntinfoList(3,"");
	});
	$("#dtdanger3").on("click",function(){
		intoDangerList(3,"");
	});
	
	//重大危险源等级
	$("#levalUnit1").on("click",function(){
		intoEntinfoList("",1);
	});
	$("#levalDanger1").on("click",function(){
		intoDangerList("",1);
	});
	$("#levalUnit2").on("click",function(){
		intoEntinfoList("",2);
	});
	$("#levalDanger2").on("click",function(){
		intoDangerList("",2);
	});
	$("#levalUnit3").on("click",function(){
		intoEntinfoList("",3);
	});
	$("#levalDanger3").on("click",function(){
		intoDangerList("",3);
	});
	$("#levalUnit4").on("click",function(){
		intoEntinfoList("",4);
	});
	$("#levalDanger4").on("click",function(){
		intoDangerList("",4);
	});
	
	//一家多级点击事件
	$("#moreLevelUnit").on("click",function(){
		intoDangerList("","-1");
	});
	//多种类点击
	$("#moreType").on("click",function(){
		intoDangerList("-1","");
	});
	//分类统计表
	$("#dangerTypeTJ").on("click",function(){
		dangerTypeTJ();
	});
	//分级统计表
	$("#dangerLevelTj").on("click",function(){
		dangerLevelTj();
	});
}


/**
 * 重大危险源分类统计表
 */
function dangerTypeTJ(){
	var curDistrictlevel = $("#districtlevel").val(); //点击右侧树的级别
	var districtid = $("#districtid").val(); //点击左侧树
	
	parent.openWin(BASE_URL+'/dangersource/dssStatistics/intoDangerTypeTJ?districtlevel='+curDistrictlevel+'&parentid='+districtid,'重大危险源分类统计表','70%','85%');
}
/**
 * 重大危险源分级统计表
 * @author lzqiang
 * @date 2016年7月15日 上午10:51:48
 */
function dangerLevelTj(){
	var curDistrictlevel = $("#districtlevel").val(); //点击右侧树的级别
	var districtid = $("#districtid").val(); //点击左侧树
	parent.openWin(BASE_URL+'/dangersource/dssStatistics/intoDangerLevelTJ?districtlevel='+curDistrictlevel+'&parentid='+districtid,'重大危险源分级统计表','70%','85%');
}



/**
 * 进入重大危险源列表
 * @author lzqiang
 * @date 2016年7月14日 上午9:33:30
 */
function intoDangerList(dangerType,dangerLevel){
	var districtid =  $("#districtid").val();
	parent.openWin(BASE_URL+'/dangersource/dssStatistics/intoDssDangerList?districtid='+districtid+"&dangerType="+dangerType+"&dangerLevel="+dangerLevel,'危险源信息','80%','65%');
}

/**
 * 进入企业信息列表
 */
function intoEntinfoList(dangerType,dangerLevel){
	var districtid =  $("#districtid").val();
	parent.openWin(BASE_URL+'/dangersource/dssStatistics/intoEntinfoList?districtid='+districtid+"&dangerType="+dangerType+"&dangerLevel="+dangerLevel,'企业信息','80%','90%');
}

//路径配置
require.config({
	paths : {
		echarts : BASE_URL + '/js/lib/echarts'
	}
});

/**
 * 显示区县行政区域下填报情况柱状图统计
 * @param xDataArray
 * @param yDataArray 
 */
var districtData = new Array();//行政区域
var noreporValue = new Array();//未填报
var ongoingValue = new Array();//填报中
function DssAreaStatusCount(){
	districtData = [];
	noreporValue = [];
	ongoingValue = [];
	$.ajax({
		type : 'post',
		url : BASE_URL+'/dangersource/dssStatistics/loadDssAreaStatusCount',
		cache : false,
		data:$("#dsscountform").serializeArray(),
		dataType : 'json',
		global : false,
		success : function(map) {
			if(map.success==true){
				//区县行政区域下填报情况统计
				if(map.datas!=null){
					var qysum = 0;
					var wxysum = 0;
					for(var i=0;i<map.datas.length;i++){
						var areaname = map.datas[i].AREANAME; //区、县名称
						var qysnum = map.datas[i].QYS; //企业数量
						var wxysnum = map.datas[i].WXYS; //危险源数量
						
						districtData.push(areaname);
						noreporValue.push(qysnum);
						ongoingValue.push(wxysnum);
						qysum+=qysnum;
						wxysum+=wxysnum;
					}
					
					$("#unitCount").html(qysum);//
					$("#dangerCount").html(wxysum);//危险源数量
				}
				/**单选加载项**/
				changeCountView();
			}
		}
	});
}
/**
 * 重大危险源分级
 */
var xGradeArrayData = new Array();//x轴数据
var wxyGradeArrayData = new Array();//危险源数组
var qyxGradeArrayData = new Array();//企业数数组
function DssGradeCount(){
	var dangSouLevelData = SelectOption.getdangSouLevelData();//重大危险源级别
	xGradeArrayData = [];
	wxyGradeArrayData = [];
	qyxGradeArrayData = [];
	$.ajax({
		type : 'post',
		url : BASE_URL+'/dangersource/dssStatistics/loadDssGradeCount',
		cache : false,
		data:$("#dsscountform").serializeArray(),
		dataType : 'json',
		global : false,
		success : function(map) {
			if(map.success==true){
				for(var j=0;j<dangSouLevelData.length;j++){
					if(map.datas.length>0){
						for(var i=0;i<map.datas.length;i++){
							var dangerlevel = map.datas[i].DANGERLEVEL; //分类
							var qys = map.datas[i].QYS; //企业数
							var wxys = map.datas[i].WXYS;//危险源数
							if(dangSouLevelData[j].code == dangerlevel){
								$("#levalDanger"+(j+1)).html(wxys);
								$("#levalUnit"+(j+1)).html(qys);
								wxyGradeArrayData[j] = wxys;
								qyxGradeArrayData[j] = qys;
								break;
							}else{
								wxyGradeArrayData[j] = 0;
								qyxGradeArrayData[j] = 0;
							}
						}
					}else{
						$("#levalDanger"+(j+1)).html("0");
						$("#levalUnit"+(j+1)).html("0");
						wxyGradeArrayData[j] = 0;
						qyxGradeArrayData[j] = 0;
					}
					xGradeArrayData.push(dangSouLevelData[j].name);
				}
				changeCountView();
			}
		}
	});
}
function MoreLevelCount(){
	$.ajax({
		type : 'post',
		url : BASE_URL+'/dangersource/dssStatistics/getMoreLevelCount',
		cache : false,
		data:$("#dsscountform").serializeArray(),
		dataType : 'json',
		global : false,
		success : function(map) {
			if(map.success==true){
				$("#sumUnit").html(map.datas[0].SUM);
				$("#sumUnit2").html(map.datas[0].SUM);
				$("#moreLevelUnit").html(map.datas[0].COU);
			}
		}
	});
}

function MoreTypeCount(){
	$.ajax({
		type : 'post',
		url : BASE_URL+'/dangersource/dssStatistics/getMoreTypeCount',
		cache : false,
		data:$("#dsscountform").serializeArray(),
		dataType : 'json',
		global : false,
		success : function(map) {
			if(map.success==true){
				$("#moreType").html(map.datas[0].COU);
			}
		}
	});
}

/**
 * 根据重大危险源种类统计
 */
var xClassArrayData = new Array();//x轴数据
var wxyClassArrayData = new Array();//危险源数组
var qyxClassArrayData = new Array();//企业数数组
function DssClassCount(){
	xClassArrayData = [];
	wxyClassArrayData = [];
	qyxClassArrayData = [];
	var dangerTypeData = SelectOption.getDangerTypeData();//重大危险源类别 
	$.ajax({
		type : 'post',
		url : BASE_URL+'/dangersource/dssStatistics/loadDssClassCount',
		cache : false,
		data:$("#dsscountform").serializeArray(),
		dataType : 'json',
		global : false,
		success : function(map) {
			if(map.success==true){
				for(var j=0;j<dangerTypeData.length;j++){
					if(map.datas.length>0){
						for(var i=0;i<map.datas.length;i++){
							var dangertype = map.datas[i].DANGERTYPE; //分类
							var qys = map.datas[i].QYS; //企业数
							var wxys = map.datas[i].WXYS;//危险源数
							if(dangerTypeData[j].code == dangertype){
								$("#dtdanger"+(j+1)).html(wxys);
								$("#dtunit"+(j+1)).html(qys);
								wxyClassArrayData[j] = wxys;
								qyxClassArrayData[j] = qys;
								break;
							}else{
								wxyClassArrayData[j] = 0;
								qyxClassArrayData[j] = 0;
							}
						}
					}else{
						$("#dtdanger"+(j+1)).html("0");
						$("#dtunit"+(j+1)).html("0");
						wxyClassArrayData[j] = 0;
						qyxClassArrayData[j] = 0;
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
		//分布图
		var text = $("#districtname2").text()+'重大危险源情况';
		bar(text,districtData,'行政区域','数量',noreporValue,ongoingValue);
	}else if(radioValue == 2){
		//分类图
		var text = $("#districtname2").text()+'重大危险源分类';
		bar(text,xClassArrayData,'行政区域','数量',qyxClassArrayData,wxyClassArrayData);
	}else if(radioValue == 3){
		//分级图
		var text = $("#districtname2").text()+'重大危险源分级';
		bar(text,xGradeArrayData,'行政区域','数量',qyxGradeArrayData,wxyGradeArrayData);
	}
}

/**
 * @param text 标题
 * @param xArrayData x轴数据
 * @param xName x轴名称
 * @param yName y轴名称
 * @param qyData 企业数据
 * @param wxyData 危险源数据
 * @author lzqiang
 * @date 2016年7月13日 下午3:32:26
 */
function bar(text,xArrayData,xName,yName,qyData,wxyData){
	// 使用
	require([ 'echarts', 'echarts/chart/bar' // 使用柱状图就加载bar模块，按需加载
	], function(ec) {
		// 基于准备好的dom，初始化echarts图表
		var myChart = ec.init(document.getElementById('p1'));
		myChart.showLoading({  
            text: '正在努力加载中...'  
        });  
		var option = {
			title : {
				text : text,
				x : 'center',
				y : 'top'
			},
			tooltip : {
				show : true,
				trigger: 'axis'
			},
			legend: {
		        data:['企业数','危险源数'],
		        orient : 'vertical',
		        x : 'right',
				y : 'center'
			},
			xAxis : [{
				type : 'category',
				data : xArrayData,
				name: xName
			     }],
			yAxis : [ {
				type : 'value',
				name:yName
			} ],
			dataZoom : {  
	             show : true,  
	             realtime : true,  
	             start : 20,  
	             end : 100  
	         },
	        calculable : false,//false 禁止拖动
			series : [ {
				name : "企业数",
				type : "bar",
				data : qyData,
//				barwidth : 10,//柱图宽度
				itemStyle: {
	                 normal: {
	                     label: {
	                         show: true
	                     }
	                 }
	             }
			   },{
		            name:'危险源数',
		            type:'bar',
		            data:wxyData,
//		        	barWidth : 10,//柱图宽度
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
		myChart.hideLoading(); 
	});
}