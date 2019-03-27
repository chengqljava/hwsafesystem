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
	EntStatusCount(); //企业数量统计
	
	EntGradeCount();//企业分级统计
	
	EntClassCount(); //企业分类统计
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
 * 根据企业数量统计
 */
function EntStatusCount(){
	$.ajax({
		type : 'post',
		url : BASE_URL+'/enterprise/entcount/entStatusCount',
		cache : false,
		data:$("#entcountform").serializeArray(),
		dataType : 'json',
		global : false,
		success : function(map) {
			if(map.success==true){
				var sumnum = 0;//纳入管理企业总数量(初始化为0)
				var yesgathernum = 0;//已采集企业数量
				var nogathernum = 0;//待采集企业数量
				var gatherrate = 0;//采集率
				
				//初始化为0
				$('#noreport').text(0);
				$('#ongoing').text(0);
				$('#updating').text(0);
				$('#yesreport').text(0);
				
				if(map.datas!=null){
					for(var i=0;i<map.datas.length;i++){
						var status = map.datas[i].STATUS; //状态
						var gathernum = map.datas[i].GATHERNUM; //数量
						if(status == 0){
							if(gathernum!=null && gathernum!=""){
								$('#noreport').html(gathernum); //未填报数量
							}else{
								$('#noreport').html(0);
							}
						}else if(status == 1){
						   if(gathernum!=null && gathernum!=""){
							   $('#ongoing').html(gathernum); //填报中数量
						   }else{
							   $('#ongoing').html(0);
						   }
						}else if(status == 2){
							if(gathernum!=null && gathernum!=""){
								$('#updating').html(gathernum); //更新中数量
							}else{
								$('#updating').html(0);
							}
						}else if(status == 3){
							if(gathernum!=null && gathernum!=""){
								$('#yesreport').html(gathernum); //已上报数量
							}else{
								$('#yesreport').html(0);
							}
						}
					}
				}
				
				var noreportnum = $('#noreport').text();
				var ongoingnum = $('#ongoing').text();
				var updatingnum = $('#updating').text();
				var yesreportnum = $('#yesreport').text();
				nogathernum = parseInt(noreportnum)+parseInt(ongoingnum);
				yesgathernum = parseInt(updatingnum)+parseInt(yesreportnum);
				sumnum= nogathernum+yesgathernum;
				$('#nogather').html(nogathernum); //待采集数量
				$('#yesgather').html(yesgathernum); //已采集数量
				$('#sumnum').html(sumnum); //总数量
				if(sumnum!=0){
					gatherrate = yesgathernum/sumnum;
				}
				$('#gatherrate').html(toPercent(gatherrate.toFixed(4))); //采集率
			}
		}
	});
}

/**
 * 显示区县行政区域下填报情况柱状图统计
 * @param xDataArray
 * @param yDataArray 
 */
function EntAreaStatusCount(){
	var stautsType = ['未填报','填报中','已上报','更新中'];
	var districtData = new Array();//行政区域
	
	var noreporValue = new Array();//未填报
	var ongoingValue = new Array();//填报中
	var yesreporValue = new Array();//已上报
	var updatingValue = new Array();//更新中
	
	$.ajax({
		type : 'post',
		url : BASE_URL+'/enterprise/entcount/entAreaStatusCount',
		cache : false,
		data:$("#entcountform").serializeArray(),
		dataType : 'json',
		global : false,
		success : function(map) {
			if(map.success==true){
				//区县行政区域下填报情况统计
				if(map.datas!=null){
					var json = "";
					for(var i=0;i<map.datas.length;i++){
						var areaname = map.datas[i].AREANAME; //区、县名称
						var noreportnum = map.datas[i].NOREPORTNUM; //未填报数量
						var ongoingnum = map.datas[i].ONGOINGNUM; //填报中数量
						var yesreportnum = map.datas[i].YESREPORTNUM; //已上报数量
						var updatingnum = map.datas[i].UPDATINGNUM; //更新中数量
						
						districtData.push(areaname);
						noreporValue.push(noreportnum);
						ongoingValue.push(ongoingnum);
						yesreporValue.push(yesreportnum);
						updatingValue.push(updatingnum);
					}
					// 使用
					require([ 'echarts', 'echarts/chart/bar' // 使用柱状图就加载bar模块，按需加载
					], function(ec) {
						// 基于准备好的dom，初始化echarts图表
						var myChart = ec.init(document.getElementById('p1'));
						var option = {
							title : {
								text : $("#districtname").text()+'填报情况图',
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
								name : "未填报",
								type : "bar",
								data : noreporValue,
								barWidth : 10,//柱图宽度
//								markPoint : {
//					                data : [
//					                    {type : 'max', name : "最大值"},
//					                    {type : 'min', name : "最小值"}
//					                ]
//								}
								itemStyle: {
					                 normal: {
					                     label: {
					                         show: true
					                     }
					                 }
					             }
							   }
							   ,{
						            name:'填报中',
						            type:'bar',
						            data:ongoingValue,
						        	barWidth : 10,//柱图宽度
//						            markPoint : {
//						                data : [
//						                    {type : 'max', name : "最大值"},
//						                    {type : 'min', name : "最小值"}
//						                ]
//						            }
						        	itemStyle: {
						                 normal: {
						                     label: {
						                         show: true
						                     }
						                 }
						             }
						        }
							   ,{
						            name:'已上报',
						            type:'bar',
						            data:yesreporValue,
						        	barWidth : 10,//柱图宽度
//						        	markPoint : {
//						                data : [
//						                    {type : 'max', name : "最大值"},
//						                    {type : 'min', name : "最小值"}
//						                ]
//						        	}
						        	itemStyle: {
						                 normal: {
						                     label: {
						                         show: true
						                     }
						                 }
						             }
						        }
							   ,{
						            name:'更新中',
						            type:'bar',
						            data:updatingValue,
						        	barWidth : 10,//柱图宽度
//						        	markPoint : {
//						                data : [
//						                    {type : 'max', name : "最大值"},
//						                    {type : 'min', name : "最小值"}
//						                ]
//						        	}
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
 * 根据企业分级统计
 */
var gradeData = ["未分级","A级","B级","C级","D级"];
var gradeValue = new Array();
function EntGradeCount(){
	$.ajax({
		type : 'post',
		url : BASE_URL+'/enterprise/entcount/entGradeCount',
		cache : false,
		data:$("#entcountform").serializeArray(),
		dataType : 'json',
		global : false,
		success : function(map) {
			if(map.success==true){
				var agradenum = 0;//A级数量
				var bgradenum = 0;//B级数量
				var cgradenum = 0;//C级数量
				var dgradenum = 0;//D级数量
				var nogradenum = 0;//未分级数量
				var yesgradenum = 0;//已分级数量
				var gradesumnum = 0;//总数量
				var graderate = 0;//分级率
				
				//没有时，初始化为0
				$('#agrade').text(0);
				$('#bgrade').text(0);
				$('#cgrade').text(0);
				$('#dgrade').text(0);
				$('#nograde').text(0);
				
				//分级统计
				if(map.datas!=null){
					for(var i=0;i<map.datas.length;i++){
						var altergrade = map.datas[i].ALTERGRADE; //修改后的分级
						var gradenum = map.datas[i].GRADENUM; //分级数量
						if(altergrade == 1){
							if(gradenum!=null && gradenum!=""){
								$('#agrade').html(gradenum); //A级
							}else{
								$('#agrade').html(0);
							}
						}else if(altergrade == 2){
						   if(gradenum!=null && gradenum!=""){
							   $('#bgrade').html(gradenum); //B级
						   }else{
							   $('#bgrade').html(0);
						   }
						}else if(altergrade == 3){
							if(gradenum!=null && gradenum!=""){
								$('#cgrade').html(gradenum); //C级
							}else{
								$('#cgrade').html(0);
							}
						}else if(altergrade == 4){
							if(gradenum!=null && gradenum!=""){
								$('#dgrade').html(gradenum); //D级
							}else{
								$('#dgrade').html(0);
							}
						}else if(altergrade == 0){
							if(gradenum!=null && gradenum!=""){
								$('#nograde').html(gradenum); //未分级
							}else{
								$('#nograde').html(0);
							}
						}
					}
				}
				
				var agradenum = $('#agrade').text();
				var bgradenum = $('#bgrade').text();
				var cgradenum = $('#cgrade').text();
				var dgradenum = $('#dgrade').text();
				var nogradenum= $('#nograde').text();
				yesgradenum = parseInt(agradenum)+parseInt(bgradenum)+parseInt(cgradenum)+parseInt(dgradenum);
				
				$('#yesgrade').html(yesgradenum); //已分级数量
				$('#nograde').html(nogradenum); //待分级数量
				gradesumnum = yesgradenum + parseInt(nogradenum);
				if(gradesumnum!=0){
					graderate = yesgradenum/gradesumnum;
				}
				
				$('#graderate').html(toPercent(graderate.toFixed(4))); //分级率
			
				gradeValue[0] = {value:nogradenum,name:"未分级"};
				gradeValue[1] = {value:agradenum,name:"A级"};
				gradeValue[2] = {value:bgradenum,name:"B级"};
				gradeValue[3] = {value:cgradenum,name:"C级"};
				gradeValue[4] = {value:dgradenum,name:"D级"};
			}
		}
	});
}

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
var classData = ["商贸及服务类","交通运输类","工程建设类","工业及危险化学品类"];
var classValue = new Array();
function EntClassCount(){
	$.ajax({
		type : 'post',
		url : BASE_URL+'/enterprise/entcount/entClassCount',
		cache : false,
		data:$("#entcountform").serializeArray(),
		dataType : 'json',
		global : false,
		success : function(map) {
			if(map.success==true){
				var yesclassnum = 0;//已分类
				var noclassrnum = 0;//待分类
				var classsumnum = 0;//分类总数量
				var classrate = 0;//分类率
				
				//初始化为0
				$('#industry').text(0);
				$('#business').text(0);
				$('#traffic').text(0);
				$('#engineering').text(0);
				
				//分类统计
				if(map.datas!=null){
					if(map.datas.length>0){					
						for(var i=0;i<map.datas.length;i++){
							var industrytype = map.datas[i].INDUSTRYTYPE; //分类
							var classnum = map.datas[i].CLASSNUM; //分类数量
							if(industrytype == 1){
								if(classnum!=null && classnum!=""){
									$('#industry').html(classnum); //工业及危险化学品类
								}else{
									$('#industry').html(0);
								}
							}else if(industrytype == 2){
								if(classnum!=null && classnum!=""){
									$('#business').html(classnum); //商贸及服务类
								}else{
									$('#business').html(0);
								}
							}else if(industrytype == 3){
								if(classnum!=null && classnum!=""){
									$('#traffic').html(classnum); //交通运输类
								}else{
									$('#traffic').html(0);
								}
							}else if(industrytype == 4){
								if(classnum!=null && classnum!=""){
									$('#engineering').html(classnum); //工程建设类
								}else{
									$('#engineering').html(0);
								}
							} else {
								console.log(classnum);
								if(classnum!=null && classnum!=""){
									$('#noclass').html(classnum); //待分类数量
								}else{
									$('#noclass').html(0);
								}
							}
						}
					}else {
						noclassrnum = parseInt(0);
						$('#noclass').html(noclassrnum); //待分类数量
					}
				} 
				
				var industrynum = $('#industry').text();
				var businessnum = $('#business').text();
				var trafficnum = $('#traffic').text();
				var engineeringtnum = $('#engineering').text();
				
				yesclassnum = parseInt(industrynum)+parseInt(businessnum)+parseInt(trafficnum)+parseInt(engineeringtnum);
				$('#yesclass').html(yesclassnum); //已分类数量
							
				classsumnum = Number($('#noclass').html()) + yesclassnum;
				console.log("已分类企业总数："+classsumnum);
				if(classsumnum!=0){
					classrate = yesclassnum/classsumnum;
				}
				$('#classrate').html(toPercent(classrate.toFixed(4))); //分类率
			
				classValue[0] = {value:industrynum,name:"工业及危险化学品类"};
				classValue[1] = {value:businessnum,name:"商贸及服务类"};
				classValue[2] = {value:trafficnum,name:"交通运输类"};
				classValue[3] = {value:engineeringtnum,name:"工程建设类"};
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
	      				text : $("#districtname").text()+'分类图',
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
 * 行政区域统计-显示分布饼状图统计
 */
function EntDistrictCount(){
	var districtData = new Array();
	var districtValue = new Array();
	$.ajax({
		type : 'post',
		url : BASE_URL+'/enterprise/entcount/entDistrictCount',
		cache : false,
		data:$("#entcountform").serializeArray(),
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
						      				text : $("#districtname").text()+'分类图',
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
 * 进入企业采集状态列表页面
 */
function intoEntStatus(statustype){
	var stime = $("#stime").val();
	var etime = $("#etime").val();
	var districtid =  $("#districtid").val();
	
	var statuses= "";
	var title="";
	if(statustype == "sumnum"){
		//企业总数量
		statuses = "0,1,2,3";
		title = "核实企业";
	}else if(statustype == "yesgather"){
		//企业已采集数量
		title = "已采集";
		statuses = "2,3";
	}else if(statustype == "yesreport"){
		//企业已上报数量
		statuses = "3";
		title = "已上报";
	}else if(statustype == "updating"){
		//企业更新中数量
		statuses = "2";
		title = "更新中";
	}else if(statustype == "nogather"){
		//企业待采集数量
		statuses = "0,1";
		title = "待采集";
	}else if(statustype == "noreport"){
		//企业未填报数量
		statuses = "0";
		title = "未填报";
	}else if(statustype == "ongoing"){
		//企业填报中数量
		statuses = "1";
		title = "填报中";
	}
	parent.openWin(BASE_URL+'/enterprise/entcount/intoEntStatus?stime='+stime+'&etime='+etime+'&statuses='+statuses+'&districtid='+districtid,title,'80%','90%');
}

/**
 * 进入企业分类列表页面
 */
function intoEntClass(classtype){
	var stime = $("#stime").val();
	var etime = $("#etime").val();
	var districtid =  $("#districtid").val();
	
	var industrytypes= "";
	var title="";
	if(classtype == "yesclass"){
		//已分级
		title = "已分级";
		industrytypes = "1,2,3,4";
	}else if(classtype == "industry"){
		//工业及危险化学品类
		industrytypes = "1";
		title = "工业及危险化学品类";
	}else if(classtype == "business"){
		//商贸及服务类
		industrytypes = "2";
		title = "商贸及服务类";
	}else if(classtype == "traffic"){
		//交通运输类
		industrytypes = "3";
		title = "交通运输类";
	}else if(classtype == "engineering"){
		//工程建设类
		industrytypes = "4";
		title = "工程建设类";
	}else if(classtype == "noclass"){
		//待分类
		industrytypes = "0";
		title = "待分类";
	}
	parent.openWin(BASE_URL+'/enterprise/entcount/intoEntClass?stime='+stime+'&etime='+etime+'&industrytypes='+industrytypes+'&districtid='+districtid,title,'80%','90%');
}

/**
 * 进入企业分级列表页面
 */
function intoEntGrade(gradetype){
	var stime = $("#stime").val();
	var etime = $("#etime").val();
	var districtid =  $("#districtid").val();
	
	var altergrades= "";
	var title="";
	if(gradetype == "yesgrade"){
		//已分级
		title = "已分级";
		altergrades = "1,2,3,4";
	}else if(gradetype == "agrade"){
		//A级
		altergrades = "1";
		title = "A级";
	}else if(gradetype == "bgrade"){
		//B级
		altergrades = "2";
		title = "B级";
	}else if(gradetype == "cgrade"){
		//C级
		altergrades = "3";
		title = "C级";
	}else if(gradetype == "dgrade"){
		//D级
		altergrades = "4";
		title = "D级";
	}else if(gradetype == "nograde"){
		//未分级
		altergrades = "0";
		title = "未分级";
	}
	parent.openWin(BASE_URL+'/enterprise/entcount/intoEntGrade?stime='+stime+'&etime='+etime+'&altergrades='+altergrades+'&districtid='+districtid,title,'80%','90%');
}

/**
 * 企业分类情况统计表
 */
function entDistrictClass(){
	var stime = $("#stime").val();
	var etime = $("#etime").val();
	var curDistrictlevel = $("#districtlevel").val(); //当前用户所在机构的区域级别
	var districtcode = $("#districtcode").val();//当前用户所在机构的区域
	
	var districtid = $("#districtid").val(); //点击左侧树
	if(curDistrictlevel == 0){
		//行政区域级别districtlevel(查询当前用户所在机构下属区县级别区域;1:标示区县级别)
		parent.openWin(BASE_URL+'/enterprise/entcount/intoEntDistrictClass?stime='+stime+'&etime='+etime+'&districtlevel=1&parentid='+districtcode+'&districtid='+districtid,'企业分类情况统计表','80%','90%');
	}else if(curDistrictlevel == 1){
		//行政区域级别districtlevel(查询当前用户所在机构下属区县级别区域;2:标示街道办级别)
		parent.openWin(BASE_URL+'/enterprise/entcount/intoEntDistrictClass?stime='+stime+'&etime='+etime+'&districtlevel=2&parentid='+districtcode+'&districtid='+districtid,'企业分类情况统计表','80%','90%');
	}else{
		//行政区域级别districtlevel(查询当前用户所在机构下属区县级别区域;3:标示社区级别)
		parent.openWin(BASE_URL+'/enterprise/entcount/intoEntDistrictClass?stime='+stime+'&etime='+etime+'&districtlevel=3&parentid='+districtcode+'&districtid='+districtid,'企业分类情况统计表','80%','90%');
	}
}

function entDistrictGrade(){
	var stime = $("#stime").val();
	var etime = $("#etime").val();
	var curDistrictlevel = $("#districtlevel").val(); //当前用户所在机构的区域级别
	var districtcode = $("#districtcode").val();//当前用户所在机构的区域
	var districtid = $("#districtid").val(); //点击左侧树
	
	if(curDistrictlevel == 0){
		//行政区域级别districtlevel(查询所属区县级别区域,1:标示区县级别)
		parent.openWin(BASE_URL+'/enterprise/entcount/intoEntDistrictGrade?stime='+stime+'&etime='+etime+'&districtlevel=1&parentid='+districtcode+'&districtid='+districtid,'企业分级情况统计表','80%','90%');
	}else if(curDistrictlevel == 1){
		parent.openWin(BASE_URL+'/enterprise/entcount/intoEntDistrictGrade?stime='+stime+'&etime='+etime+'&districtlevel=2&parentid='+districtcode+'&districtid='+districtid,'企业分级情况统计表','80%','90%');
	}else if(curDistrictlevel == 2){
		parent.openWin(BASE_URL+'/enterprise/entcount/intoEntDistrictGrade?stime='+stime+'&etime='+etime+'&districtlevel=3&parentid='+districtcode+'&districtid='+districtid,'企业分级情况统计表','80%','90%');
	}

}

/**
 * 统计图的切换
 */
function changeCountView(){
	var radioValue =  $('input:radio:checked').val();
	if(radioValue == 1){
		//分类图
		EntClassCount();
	}else if(radioValue == 2){
		//分布图
		EntDistrictCount();
	}else if(radioValue == 3){
		//分级图
		showGradePie(gradeData,gradeValue);//分级饼状图
	}else if(radioValue == 4){
		//填报情况图
		EntAreaStatusCount();
	}
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
