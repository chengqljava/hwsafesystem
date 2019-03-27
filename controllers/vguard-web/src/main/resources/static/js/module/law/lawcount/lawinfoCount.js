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
	
	
//	EntClassCount(); //企业分类统计
	/**统计图**/
	changeCountView();
	
	/**
	 * 绑定方法
	 */
	//点击执法部门
	$("#deptcount").off("click").on("click",function(){
		intoLawdeptList();
	});
	//点击执法人员
	$("#usercount").off("click").on("click",function(){
		intoLawuserList();
	});
	//计划执法企业数
	$("#plancount").off("click").on("click",function(){
		intoLawcheckList("0","计划执法企业");
	});
	//实际执法企业数
	$("#pracount").off("click").on("click",function(){
		intoLawcheckList("1","实际执法企业");
	});
	//案件总数
	$("#casecount").off("click").on("click",function(){
		intoLawcaseList("null","案件列表");
	});
	//办理中案件
	$("#caseingcount").off("click").on("click",function(){
		intoLawcaseList("-9","办理中");
	});
	//已结案案件
	$("#caseendcount").off("click").on("click",function(){
		intoLawcaseList("9","已结案");
	});
	/**统计表**/
	//行政处罚
	
	$("#lawpunish").off("click").on("click",function(){
		intoLawpunishList();
	});
	$("#lawdoc").off("click").on("click",function(){
		intoLawdocList();
	});
	/*$("#lawdoc").on("click",function(){
		intoLawdocList();
	});*/
}

/**
 * 进入执法部门信息列表
 */
function intoLawdeptList(){
	var districtid =  $("#districtid").val();
	parent.openWin(BASE_URL+'/law/lawcount/intoLawdeptList','执法部门','80%','90%');
}
/**
 * 进入执法人员信息列表
 */
function intoLawuserList(){
	var districtid =  $("#districtid").val();
	parent.openWin(BASE_URL+'/law/lawcount/intoLawuserList','执法人员','80%','90%');
}
/**
 * 执法企业
 */
function intoLawcheckList(state,title){
	var districtid =  $("#districtid").val();
	parent.openWin(BASE_URL+'/law/lawcount/intoLawcheckList/'+state,title,'80%','90%');
}

/**
 * 执法案件
 */
function intoLawcaseList(state,title){
	var districtid =  $("#districtid").val();
	parent.openWin(BASE_URL+'/law/lawcount/intoLawcaseList/'+state,title,'80%','90%');
}

/**
 * 行政处罚统计
 */
function intoLawpunishList(){
	var districtid =  $("#districtid").val();
	var punishtype = null
	parent.openWin(BASE_URL+'/law/lawcount/lawpunishList/'+punishtype,'行政处罚统计','80%','90%');
}

/**
 * 文书使用情况统计
 */
function intoLawdocList(){
	var districtid =  $("#districtid").val();
	parent.openWin(BASE_URL+'/law/lawcount/doclist','文书使用情况统计','80%','90%');
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
 * 根据企业数量统计
 */
function EntStatusCount(){
	$.ajax({
		type : 'post',
		url : BASE_URL+getURL('/law/lawcount/lawCount'),
		cache : false,
		data:$("#lawcountform").serializeArray(),
		dataType : 'json',
		global : false,
		success : function(map) {
			if(map.success==true){
				var deptcount = 0;//部门数量
				var usercount = 0;//已采集企业数量
				var pracount = 0;//实际执法企业数
				var plancount = 0;//计划执法企业数
				var entcount = 0;//企业数量
				var coverage = 0;//计法覆盖率
				var complete = 0;//计划完成率
				var casecount = 0;//案件总数
				var caseingcount = 0;//办理中的案件 
				var caseendcount = 0;//结案的案件 
				//初始化为0
				$('#deptcount').text(0);
				$('#usercount').text(0);
				$('#pracount').text(0);
				$('#plancount').text(0);
				$('#entcount').text(0);
				$('#coverage').text(0);
				$('#complete').text(0);
				$('#casecount').text(0);
				$('#caseingcount').text(0);
				$('#caseendcount').text(0);
				if(map.datas!=null && map.datas.length > 0){
					data = map.datas[0];
					deptcount = data.DEPTCOUNT; 
					usercount = data.USERCOUNT; 
					pracount = data.PRACOUNT;
					plancount = data.PLANCOUNT;
					entcount = data.ENTCOUNT;
					
					complete = pracount/plancount;
					casecount = data.CASECOUNT;
					caseingcount = data.CASEINGCOUNT;
					caseendcount = data.CASEENDCOUNT;
					
				}
				$('#deptcount').html(deptcount);
				$('#usercount').html(usercount);
				$('#pracount').html(pracount);
				$('#plancount').html(plancount);
				if(entcount!=0){
					coverage = plancount/entcount;
				}
				$('#coverage').html(toPercent(coverage.toFixed(4)));
				if (!isNaN(complete)) {
					$('#complete').html(toPercent(complete.toFixed(4)));
				}
				$('#casecount').html(casecount);
				$('#caseingcount').html(caseingcount);
				$('#caseendcount').html(caseendcount);
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
		//计划执法企业
		$("#state").val("0");
		LawPlanCount();
	}else if(radioValue == 2){
		//实际执法企业
		$("#state").val("1");
		LawPlanCount();
	}else if(radioValue == 3){
		//案件统计
		LawDistrictCount();
	}
}

/**
 * 行政区域统计-显示计划执法企业统计
 */
function LawPlanCount(){
	var districtData = new Array();
	var districtValue = new Array();
	$.ajax({
		type : 'post',
		url : BASE_URL+getURL('/law/lawcount/entDistrictPlanCount'),
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
						      				text : $("#districtname").text()+($("#state").val()=="0"? '计划执法企业' : '实际执法企业'),
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
		url : BASE_URL+'/law/lawcount/lawDistrictCount',
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
