$(function() {
	//初始化首页所有echarts图标工具类
	window.allEchartsDic = new MapUtil();
	
	//初始化当前日期区间
	fmtCurDate();
	
	//------------各type页切换事件绑定-------------------
    // 企业分类
    titleAddClickEvent('companyNav','company');
    $(".companyNav li:first").trigger("click");
    
    //重大危险源
    titleAddClickEvent('zdwxyNav','zdwxy');
    $(".zdwxyNav li:first").trigger("click");
    
    //监测监控
//    titleAddClickEvent('jcjkNav','jcjk');
//    contentAddClickEvent('agoData1');
//    contentAddClickEvent('agoData2');
    
    //应急预案
    titleAddClickEvent('yjyaNav','yjya');
    
    
    
    //初始化加载危化品企业许可图表(默认显示)
    dangerEntCount();
    
    //企业风险管理统计
    fxglCount();
    
    //隐患管理统计
    yhglCnt();
    
    //环境指数、监测统计
    hjStatAna();
    
    //应急资源统计
    yjzyCnt();
    
    //应急预案-政府(默认显示)
//	yjyaCnt("zf");
	$(".yjyaNav li:first").trigger("click");
	
	//监测监控-趋势(默认显示)
	jcjkTrendCnt();
//	$(".jcjkNav li:first").trigger("click");
});

//标题内的tab页切换
function titleAddClickEvent(nav, company) {
    $('.' + nav).on('click', 'li', function() {
        var $id = $(this).data('id');
        $('.'+nav+' li').removeClass('active');
        $(this).addClass('active');
        $('.'+company).removeClass('active');
        $('#'+$id).addClass('active');
        
//        alert($id);
        if ("fenlei" == $id) {
        	//企业分类-分类
        	entClassCount();
        } else if ("shuliang" == $id) {
        	//企业分类-数量
        	entStatusCount();
        } else if ("fenji" == $id) {
        	//企业分类-分级
        	entGradeCount();
        } else if ("jibie" == $id) {
        	//重大危险源-级别
        	dssGradeCount("dssLvl");
        } else if ("zhonglei" == $id) {
        	//重大危险源-种类
        	dssGradeCount("dssType");
        } else if ("qushi" == $id) {
        	//监测监控-趋势
        	jcjkTrendCnt();
        } else if ("paiming" == $id) {
        	//监测监控-排名
        	jcjkRankCnt();
        } else if ("yazf" == $id) {
        	//应急预案-政府
        	yjyaCnt("zf");
        } else if ("yaqy" == $id) {
        	//应急预案-企业
        	yjyaCnt("qy");
        }
    });
}

//过去一周 三月 年的点击事件
function contentAddClickEvent(nav){
    $('.'+nav).on('click','span',function(){
        var $id = $(this).data('id');
        $('.'+nav+' span').removeClass('active');
        $(this).addClass('active');
        
        //根据指定时间区间查询企业报警最近排名
        renderEntAlarmList();
    });
}


/**
 * 初始化当前日期区间
 */
function fmtCurDate() {
	//默认区当前年、当前季度内的时间区间
	var curYear = new Date().getFullYear(),
		curMonth = (new Date().getMonth() + 1),
		curQarter = getQarter2Month(curMonth),
		stime, etime;
	if(curQarter == 1){
		stime = curYear + "-01-01";
		etime = curYear + "-03-31";
	}else if(curQarter == 2){
		stime = curYear + "-04-01";
		etime = curYear + "-06-30";
	}else if(curQarter == 3){
		stime = curYear + "-07-01";
		etime = curYear + "-09-30";
	}else if(curQarter == 4){
		stime = curYear + "-10-01";
		etime = curYear + "-12-31";
	}
	
	$("#year").val(curYear);
	$("#stime").val(stime);
	$("#etime").val(etime);
	$("#qarter").val(curQarter);
}


/**
 * 获取企业分类信息
 */
function entClassCount() {
	var entTypeChrt = window.allEchartsDic.get("entTypeChrt");
	if (!entTypeChrt) {
		entTypeChrt = echarts.init(document.getElementById("entTypeChrt"));
		window.allEchartsDic.put("entTypeChrt", entTypeChrt);
	} 
	
	entTypeChrt.showLoading({
	    text: '正在努力的读取数据中...',    //loading话术
	});
	
	$.ajax({
		type : 'post',
		url : BASE_URL + '/enterprise/entcount/entClassCount',
		cache : false,
		data: {
			"stime": $("#stime").val(),
			"etime": $("#etime").val(),
			"qarter": $("#qarter").val(),
			"districtid": ""
		},
		dataType : 'json',
		global : false,
		success : function(map) {
			if (map.success == true) {
				var yesclassnum = 0;//已分类
				var noclassrnum = 0;//待分类
				var classsumnum = 0;//分类总数量
				var classrate = 0;//分类率
				
				var industryArr = [];
				var businessArr = [];
				var trafficArr = [];
				var engineeringtArr = [];
				var noclassArr = [];
				var industrynum = 0,
					businessnum = 0,
					trafficnum = 0,
					engineeringtnum = 0,
					noclassnum = 0;
				
				var entTypeDataArr = [];
				
				//分类统计
				if(map.datas!=null){
					if(map.datas.length > 0){		
						var curResLength = map.datas.length;
						for(var i = 0; i < curResLength; i++){
							var industrytype = map.datas[i].INDUSTRYTYPE; //分类
							var classnum = map.datas[i].CLASSNUM; //分类数量
							
							if(industrytype == 1){
								if(classnum!=null && classnum!=""){
									industrynum = parseInt(classnum);
									industryArr.push(classnum);
								} else{
									industrynum = 0;
									industryArr.push(0)
								}
								industryArr.push(0); //工业及危险化学品类
							}else if(industrytype == 2){
								if (classnum != null && classnum != "") {
									businessnum = parseInt(classnum);
									businessArr.push(classnum);//商贸及服务类
								} else {
									businessnum = 0;
									businessArr.push(0);
								}
								businessArr.push(0);
							}else if(industrytype == 3){
								if(classnum != null && classnum != ""){
									trafficnum = parseInt(classnum);
									trafficArr.push(classnum);//交通运输类
								} else {
									trafficnum = 0;
									trafficArr.push(0);
								}
								trafficArr.push(0);
							}else if(industrytype == 4){
								if(classnum != null && classnum != ""){
									engineeringtnum = parseInt(classnum);
									engineeringtArr.push(classnum);//工程建设类
								}else{
									engineeringtnum = 0;
									engineeringtArr.push(0);
								}
								engineeringtArr.push(0);
							} else {
//								console.log(classnum);
								noclassArr.push(0);
								if (classnum != null && classnum != "") {
									noclassnum = parseInt(classnum);
									
									$('#noclass').html(classnum); 
									noclassArr.push(classnum);//待分类数量
								} else {
									noclassnum = 0;
									
									$('#noclass').html(0);
									noclassArr.push(0);
								}
								
							}
						}
					}else {
						noclassrnum = parseInt(0);
						$('#noclass').html(noclassrnum); //待分类数量
					}
				} 
				
				yesclassnum = industrynum + businessnum + trafficnum + engineeringtnum;
				$('#yesclass').html(yesclassnum); //已分类数量
							
				classsumnum = Number($('#noclass').html()) + yesclassnum;
//				console.log("已分类企业总数："+classsumnum);
				if(classsumnum != 0){
					classrate = yesclassnum / classsumnum;
				}
				$('#classrate').html(toPercent(classrate.toFixed(4))); //分类率
				
				entTypeDataArr.push(industrynum);
				entTypeDataArr.push(trafficnum);
				entTypeDataArr.push(engineeringtnum);
				entTypeDataArr.push(noclassnum);
				entTypeDataArr.push(businessnum);
				
				var biggestData = _.max(entTypeDataArr) + 5;
				
				//展示企业分类柱状图
				entTypeChrt.hideLoading();
//            	var entTypeOption = {
////            			tooltip : {
////            		        trigger: 'axis',
////            		        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
////            		            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
////            		        }
////            		    },
//            		    tooltip: {
//            		    	 show: true,
//            		         trigger: 'item'
//            		    },
//            		    legend: {
//            		    	orient: 'vertical',
////            		    	x : document.getElementById('entTypeChrt').offsetWidth - (document.getElementById('entTypeChrt').offsetWidth - 140),
//             		        x: 'right',
//             		        y: 'center',
//             		        itemGap:16,
//             		        itemWidth: 8,
//             		        itemHeight: 8,
//            		        data:[
//            		              {
//            		                 "name": "工业及危险化学品类", 
//            		                 "color": "rgba(0,0,0,0.65)",
//            		                 "icon": "circle"
//            		              },
//            		              {
//            		            	  "name": "商贸及服务类", 
//               		               	  "color": "rgba(0,0,0,0.65)", 
//            		            	  "icon": "circle"
//            		              },
//            		              {
//            		            	  "name": "交通运输类", 
//               		                   "color": "rgba(0,0,0,0.65)", 
//            		            	  "icon": "circle"
//            		              },
//            		              {
//            		            	  "name": "工程建设类", 
//               		                   "color": "rgba(0,0,0,0.65)", 
//            		            	  "icon": "circle"
//            		              },
//            		              {
//            		            	  "name": "待分类", 
//               		                  "color": "rgba(0,0,0,0.65)", 
//            		            	  "icon": "circle"
//            		              }]
//            		    },
//            		    toolbox: {
//            		        show : false,
//            		        orient: 'vertical',
//            		        x: 'right',
//            		        y: 'middle'
////            		        feature : {
////            		            mark : {show: true},
////            		            dataView : {show: true, readOnly: false},
////            		            magicType : {show: true, type: ['line', 'bar', 'stack', 'tiled']},
////            		            restore : {show: true},
////            		            saveAsImage : {show: true}
////            		        }
//            		    },
//            		    calculable : false,
//            		    grid: {
//            		    	x: 30,
//            		    	x2: 160,
//            		    	y: 10,
//            		    	y2: 20
//            		    },
//            		    xAxis : [
//            		        {
//            		            type : 'category',
//            		            data : ['已分类','未分类'],
//            		            axisLine: {
//            		            	show: true,
//            		            	lineStyle: {
//            		            		color: ['#ddd'],
//            		            	    width: 2
//            		            	}
//            		            },
//            		            axisTick: {
//            		            	show: false
//            		            },
//            		            splitLine: {
//            		            	show: false
//            		            }
//            		        }
//            		    ],
//            		    yAxis : [
//            		        {
//            		            type : 'value',
//            		            axisLine: {
//            		            	show: false
//            		            },
//            		            axisTick: {
//            		            	show: false
//            		            },
//            		            splitLine: {
//            		            	show: true,
//            		            	lineStyle: {
//            		            		color: ['rgba(0,0,0,0.10)'],
//            		            	    width: 1,
//            		            	    type: 'dashed'
//            		            	}
//            		            },
//            		            axisLabel: {
//            		            	textStyle: {
//            		            		color: 'rgba(0,0,0,0.65)'
//            		            	}
//            		            }
//            		        }
//            		    ],
////            		    itemStyle: {
////    	                    normal: {
////    	                        color: function(params) {
////    	                            var colorList = [
////    	                              '#F04864', '#2FC25B', '#1890FF', '#F5A623', '#9B9B9B'
////    	                            ];
////    	                            return colorList[params.dataIndex]
////    	                        }
////    	                    }
////    		            },
//            		    series : [
//            		        {
//            		            name:'工业及危险化学品类',
//            		            type:'bar',
//            		            stack: '企业已分类',
//            		            barWidth: 40,
//            		            itemStyle: {
//            	                    normal: {
//            	                        color: function(params) {
//            	                            return '#F04864';
//            	                        }
//            	                    }
//            		            },
//            		            data:industryArr
//            		        },
//            		        {
//            		            name:'商贸及服务类',
//            		            type:'bar',
//            		            stack: '企业已分类',
//            		            barWidth: 40,
//            		            itemStyle: {
//            	                    normal: {
//            	                        color: function(params) {
//            	                            return '#2FC25B';
//            	                        }
//            	                    }
//            		            },
//            		            data:businessArr
//            		        },
//            		        {
//            		            name:'交通运输类',
//            		            type:'bar',
//            		            stack: '企业已分类',
//            		            barWidth: 40,
//            		            itemStyle: {
//            	                    normal: {
//            	                        color: function(params) {
//            	                            return '#1890FF';
//            	                        }
//            	                    }
//            		            },
//            		            data:trafficArr
//            		        },
//            		        {
//            		            name:'工程建设类',
//            		            type:'bar',
//            		            stack: '企业已分类',
//            		            barWidth: 40,
//            		            itemStyle: {
//            	                    normal: {
//            	                        color: function(params) {
//            	                            return '#F5A623';
//            	                        }
//            	                    }
//            		            },
//            		            data:engineeringtArr
//            		        },
//            		        {
//            		            name:'待分类',
//            		            type:'bar',
//            		            barWidth: 40,
//            		            itemStyle: {
//            	                    normal: {
//            	                        color: function(params) {
//            	                            return '#9B9B9B';
//            	                        }
//            	                    }
//            		            },
//            		            data:noclassArr
//            		        }
//            		    ]
//            	};
				
				var entTypeOption = {
					    title : {
					    	show: false
					    },
					    tooltip : {
//					    	show: true,
//					        trigger: 'axis'
					    },
					    legend: {
					    	show: false,
					        x : 'center',
					        data:['企业分类']
					    },
					    toolbox: {
					        show : false,
					        feature : {
					            mark : {show: true},
					            dataView : {show: true, readOnly: false},
					            restore : {show: true},
					            saveAsImage : {show: true}
					        }
					    },
					    calculable : false,
					    polar : [
					        {
					            indicator : [
					                {text : '工业及危险化学品类', max  : biggestData},
					                {text : '交通运输类', max  : biggestData},
					                {text : '工程建设类', max  : biggestData},
					                {text : '待分类', max  : biggestData},
					                {text : '商贸及服务类', max  : biggestData}           
					            ],
					            radius : 55,
//					            center : ['25%',210],
					            scale: true,
//					            axisLine: {            // 坐标轴线
//					                show: true,        // 默认显示，属性show控制显示与否
//					                lineStyle: {       // 属性lineStyle控制线条样式
//					                    color: 'green',
//					                    width: 2,
//					                    type: 'solid'
//					                }
//					            },
//					            axisLabel: {           // 坐标轴文本标签，详见axis.axisLabel
//					                show: true,
//					                // formatter: null,
//					                textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
//					                    color: '#ccc'
//					                }
//					            },
//					            splitArea : {
//					                show : true,
//					                areaStyle : {
//					                    color: ['#fff']
//					                }
//					            }
//					            splitLine : {
//					                show : true,
//					                lineStyle : {
//            		            		color: ['rgba(0,0,0,0.10)'],
//            		            	    width: 1,
//            		            	    type: 'dashed'
//					                }
//					            }
					        }
					    ],
					    series : [
					        {
					            name: '企业分类信息',
					            type: 'radar',
					            itemStyle: {
					                normal: {
					                	color: '#1890FF',
					                    areaStyle: {
					                        type: 'default'
//					                        color: '#1890FF'
					                    },
					                    lineStyle: {
	            		            	    width: 2
	            		            	}
//	            		            	borderColor: '#1890FF'
					                }
					            },
					            data : [
					                {
					                    value : entTypeDataArr,
					                    name : '企业分类'
					                }
					            ]
					        }
					    ]
					};
				
            	entTypeChrt.setOption(entTypeOption, true);
            	
            	$(window).resize(function() {
            		entTypeChrt.resize();
                });
//				classValue[0] = {value:industrynum,name:"工业及危险化学品类"};
//				classValue[1] = {value:businessnum,name:"商贸及服务类"};
//				classValue[2] = {value:trafficnum,name:"交通运输类"};
//				classValue[3] = {value:engineeringtnum,name:"工程建设类"};
//				showClassChart(classData,classValue);//分类饼状图
			}
		}
	});
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
 * 根据企业数量统计
 */
function entStatusCount(){
	var entTypeChrt = window.allEchartsDic.get("entTypeChrt");
	if (!entTypeChrt) {
		entTypeChrt = echarts.init(document.getElementById("entTypeChrt"));
		window.allEchartsDic.put("entTypeChrt", entTypeChrt);
	} 
	
	entTypeChrt.showLoading({
	    text: '正在努力的读取数据中...',    //loading话术
	});
	
	$.ajax({
		type : 'post',
		url : BASE_URL+'/enterprise/entcount/entStatusCount',
		cache : false,
		data:{
			"stime": $("#stime").val(),
			"etime": $("#etime").val(),
			"qarter": $("#qarter").val(),
			"districtid": ""
		},
		dataType : 'json',
		global : false,
		success : function(map) {
			if(map.success == true){
				var sumnum = 0;//纳入管理企业总数量(初始化为0)
				var yesgathernum = 0;//已采集企业数量
				var nogathernum = 0;//待采集企业数量
				var gatherrate = 0;//采集率
				
				var noreportnum = 0;
				var ongoingnum = 0;
				var updatingnum = 0;
				var yesreportnum = 0;
				
				var noreportArr = [];
				var ongoingArr = [];
				var updatingArr = [];
				var yesreportArr = [];
				
				//初始化为0
//				$('#noreport').text(0);
//				$('#ongoing').text(0);
//				$('#updating').text(0);
//				$('#yesreport').text(0);
				
				if(map.datas != null){
					var curMapLength = map.datas.length;
					for(var i = 0; i < curMapLength; i++){
						var status = map.datas[i].STATUS; //状态
						var gathernum = map.datas[i].GATHERNUM; //数量
						
						if(status == 0){
							if(gathernum!=null && gathernum!=""){
								noreportnum = gathernum; //未填报数量
								noreportArr.push(gathernum);
							} else {
								noreportnum = 0;
								noreportArr.push(0);
							}
							noreportArr.push(0);
						}else if (status == 1) {
						   if(gathernum!=null && gathernum!=""){
							   ongoingnum = gathernum;
							   ongoingArr.push(gathernum);
							   //填报中数量
						   } else {
							   ongoingnum = 0;
							   ongoingArr.push(0);
						   }
						   ongoingArr.push(0);
						}else if(status == 2){
							updatingArr.push(0);
							if(gathernum!=null && gathernum!=""){
								updatingnum = gathernum;
								updatingArr.push(gathernum);
								 //更新中数量
							}else{
								updatingnum = 0;
								updatingArr.push(0);
							}
						}else if(status == 3){
							yesreportArr.push(0);
							if (gathernum != null && gathernum != "") {
								yesreportnum = gathernum;
								yesreportArr.push(gathernum);
								//已上报数量
							} else {
								yesreportnum = 0;
								yesreportArr.push(0);
							}
						}
					}
				}
				
				nogathernum = parseInt(noreportnum) + parseInt(ongoingnum);
				yesgathernum = parseInt(updatingnum) + parseInt(yesreportnum);
				sumnum= nogathernum+yesgathernum;
				$('#nogather').html(nogathernum); //待采集数量
				$('#yesgather').html(yesgathernum); //已采集数量
				$('#sumnum').html(sumnum); //总数量
				if(sumnum != 0){
					gatherrate = yesgathernum / sumnum;
				}
				
				$('#gatherrate').html(toPercent(gatherrate.toFixed(4))); //采集率
				
				//展示企业数量柱状图
				entTypeChrt.hideLoading();
//            	var entTypeOption = {
//            		    tooltip : {
//           		    	 	show: true,
//           		    	 	trigger: 'item'
//            		    },
//            		    legend: {
//            		    	orient: 'vertical',
////            		    	x : document.getElementById('entTypeChrt').offsetWidth - (document.getElementById('entTypeChrt').offsetWidth - 140),
//             		        x: 'right',
//             		        y: 'center',
//             		        itemGap:16,
//             		        itemWidth: 8,
//             		        itemHeight: 8,
//            		        data:[
//            		              {
//            		                 "name": "已上报", 
//            		                 "color": "rgba(0,0,0,0.65)",
//            		                 "icon": "circle"
//            		              },
//            		              {
//            		            	  "name": "更新中", 
//               		               	  "color": "rgba(0,0,0,0.65)", 
//            		            	  "icon": "circle"
//            		              },
//            		              {
//            		            	  "name": "填报中", 
//               		                   "color": "rgba(0,0,0,0.65)", 
//            		            	  "icon": "circle"
//            		              },
//            		              {
//            		            	  "name": "未填报", 
//               		                   "color": "rgba(0,0,0,0.65)", 
//            		            	  "icon": "circle"
//            		              },
//            		              {
//            		            	  "name": "待分类", 
//               		                  "color": "rgba(0,0,0,0.65)", 
//            		            	  "icon": "circle"
//            		              }]
//            		    },
////            		    legend: {
////            		    	orient: 'vertical',
////             		        x: 'right',
////             		        y: 'center',
////            		        data:['已上报','更新中','填报中','未填报']
////            		    },
//            		    toolbox: {
//            		        show : false,
//            		        orient: 'vertical',
//            		        x: 'right',
//            		        y: 'middle'
////            		        feature : {
////            		            mark : {show: true},
////            		            dataView : {show: true, readOnly: false},
////            		            magicType : {show: true, type: ['line', 'bar', 'stack', 'tiled']},
////            		            restore : {show: true},
////            		            saveAsImage : {show: true}
////            		        }
//            		    },
//            		    grid: {
//            		    	x: 30,
//            		    	x2: 160,
//            		    	y: 10,
//            		    	y2: 20
//            		    },
//            		    calculable : true,
//            		    xAxis : [
//            		        {
//            		            type : 'category',
//            		            data : ['已采集','未采集'],
//            		            axisLine: {
//            		            	show: true,
//            		            	lineStyle: {
//            		            		color: ['#ddd'],
//            		            	    width: 2
//            		            	}
//            		            },
//            		            axisTick: {
//            		            	show: false
//            		            },
//            		            splitLine: {
//            		            	show: false
//            		            }
//            		        }
//            		    ],
//            		    yAxis : [
//            		        {
//            		            type : 'value',
//            		            axisLine: {
//            		            	show: false
//            		            },
//            		            axisTick: {
//            		            	show: false
//            		            },
//            		            splitLine: {
//            		            	show: true,
//            		            	lineStyle: {
//            		            		color: ['rgba(0,0,0,0.10)'],
//            		            	    width: 1,
//            		            	    type: 'dashed'
//            		            	}
//            		            },
//            		            axisLabel: {
//            		            	textStyle: {
//            		            		color: 'rgba(0,0,0,0.65)'
//            		            	}
//            		            }
//            		        }
//            		    ],
//            		    series : [
//            		        {
//            		            name:'已上报',
//            		            type:'bar',
//            		            stack: '企业已采集',
//            		            barWidth: 40,
//            		            itemStyle: {
//            	                    normal: {
//            	                        color: function(params) {
//            	                            return '#2FC25B';
//            	                        }
//            	                    }
//            		            },
//            		            data:yesreportArr
//            		        },
//            		        {
//            		            name:'更新中',
//            		            type:'bar',
//            		            stack: '企业已采集',
//            		            barWidth: 40,
//            		            itemStyle: {
//            	                    normal: {
//            	                        color: function(params) {
//            	                            return '#1890FF';
//            	                        }
//            	                    }
//            		            },
//            		            data:updatingArr
//            		        },
//            		        {
//            		            name:'填报中',
//            		            type:'bar',
//            		            stack: '企业未采集',
//            		            barWidth: 40,
//            		            itemStyle: {
//            	                    normal: {
//            	                        color: function(params) {
//            	                            return '#F5A623';
//            	                        }
//            	                    }
//            		            },
//            		            data:ongoingArr
//            		        },
//            		        {
//            		            name:'未填报',
//            		            type:'bar',
//            		            stack: '企业未采集',
//            		            barWidth: 40,
//            		            itemStyle: {
//            	                    normal: {
//            	                        color: function(params) {
//            	                            return '#F04864';
//            	                        }
//            	                    }
//            		            },
//            		            data:noreportArr
//            		        }
//            		    ]
//            	};
            	
            	var entTypeOption = {
            		    tooltip : {
            		        trigger: 'axis',
            		        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
            		            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            		        }
            		    },
            		    legend: {
            		        data: ['已上报', '更新中', '填报中', '未填报'],
            		        orient : 'vertical',
            		        x : 'right',
            		        y : 'center',
            		        itemGap:16,
            		        itemWidth: 8,
            		        itemHeight: 8,
            		        data:['已上报','更新中','填报中','未填报'],
            		        data:[
            		              {
            		            	  "name": "已上报", 
            		            	  "color": "rgba(0,0,0,0.65)",
            		            	  "icon": "circle"
            		              },
            		              {
            		            	  "name": "更新中", 
            		            	  "color": "rgba(0,0,0,0.65)", 
            		            	  "icon": "circle"
            		              },
            		              {
            		            	  "name": "填报中", 
            		            	  "color": "rgba(0,0,0,0.65)", 
            		            	  "icon": "circle"
            		              },
            		              {
            		            	  "name": "未填报", 
            		            	  "color": "rgba(0,0,0,0.65)", 
            		            	  "icon": "circle"
            		              }
            		         ]
            		    },
            		    grid: {
            		         x: 50,
            		         x2: 160,
            		         y: 10,
            		         y2: 20
            		    },
            		    xAxis:  {
            		        type: 'value',
            		        axisLine: {
            		            		            	show: false,
            		            		            	lineStyle: {
            		            		            		color: ['#ddd'],
            		            		            	    width: 2
            		            		            	}
            		            		            },
            		            		            axisTick: {
            		            		            	show: false
            		            		            },
            		            		            splitLine: {
            		            		            	show: true,
            		            		            	lineStyle : {
            		            		            		color: ['rgba(0,0,0,0.10)'],
            		            		            	    width: 1,
            		            		            	    type: 'dashed'
            							                }
            		            		            }
            		    },
            		    yAxis: {
            		        type: 'category',
            		        data: ['待采集','已采集'],
            		         axisLine: {
            		            		            	show: true
            		            		            },
            		            		            axisTick: {
            		            		            	show: false
            		            		            },
            		            		            splitLine: {
            		            		            	show: false,
            		            		            	lineStyle: {
            		            		            		color: ['rgba(0,0,0,0.10)'],
            		            		            	    width: 1,
            		            		            	    type: 'dashed'
            		            		            	}
            		            		            },
            		            		            axisLabel: {
            		            		            	textStyle: {
            		            		            		color: 'rgba(0,0,0,0.65)'
            		            		            	}
            		            		            }
            		    },
            		    series: [
            		        {
            		            name: '已上报',
            		            type: 'bar',
            		            stack: '总量',
            		            data: yesreportArr,
            		            barWidth: 40,
            		            		            itemStyle: {
            		            	                    normal: {
            		            	                        color: function(params) {
            		            	                            return '#2FC25B';
            		            	                        }
            		            	                    }
            		            		            },
            		        },
            		        {
            		            name: '更新中',
            		            type: 'bar',
            		            stack: '总量',
            		            data: updatingArr,
            		            barWidth: 40,
            		            		            itemStyle: {
            		            	                    normal: {
            		            	                        color: function(params) {
            		            	                            return '#1890FF';
            		            	                        }
            		            	                    }
            		            		            },
            		        },
            		         {
            		            name: '填报中',
            		            type: 'bar',
            		            stack: '总量',
            		            data: ongoingArr,
            		            barWidth: 40,
            		            		            itemStyle: {
            		            	                    normal: {
            		            	                        color: function(params) {
            		            	                            return '#F5A623';
            		            	                        }
            		            	                    }
            		            		            },
            		        },
            		         {
            		            name: '未填报',
            		            type: 'bar',
            		            stack: '总量',
            		            data: noreportArr,
            		            barWidth: 40,
            		            		            itemStyle: {
            		            	                    normal: {
            		            	                        color: function(params) {
            		            	                            return '#F04864';
            		            	                        }
            		            	                    }
            		            		            },
            		        }
            		    ]
            		};
            	
            	
            	entTypeChrt.setOption(entTypeOption, true);
            	
            	$(window).resize(function() {
            		entTypeChrt.resize();
                });
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
 * 企业分级
 */
function entGradeCount() {
	var entTypeChrt = window.allEchartsDic.get("entTypeChrt");
	if (!entTypeChrt) {
		entTypeChrt = echarts.init(document.getElementById("entTypeChrt"));
		window.allEchartsDic.put("entTypeChrt", entTypeChrt);
	} 
	
	entTypeChrt.showLoading({
	    text: '正在努力的读取数据中...',    //loading话术
	});
	
	$.ajax({
		type : 'post',
		url : BASE_URL+'/enterprise/entcount/entGradeCount',
		cache : false,
		data:{
			"stime": $("#stime").val(),
			"etime": $("#etime").val(),
			"qarter": $("#qarter").val(),
			"districtid": ""
		},
		dataType : 'json',
		global : false,
		success : function(map) {
			if(map.success == true){
				var agradenum = 0;//A级数量
				var bgradenum = 0;//B级数量
				var cgradenum = 0;//C级数量
				var dgradenum = 0;//D级数量
				var nogradenum = 0;//未分级数量
				var yesgradenum = 0;//已分级数量
				var gradesumnum = 0;//总数量
				var graderate = 0;//分级率
				
				var agradeArr = [];//A级数量
				var bgradeArr = [];//B级数量
				var cgradeArr = [];//C级数量
				var dgradeArr = [];//D级数量
				var nogradeArr = [];//未分级数量
				
				//分级统计
				if(map.datas!=null){
					for(var i=0;i<map.datas.length;i++){
						var altergrade = map.datas[i].ALTERGRADE; //修改后的分级
						var gradenum = map.datas[i].GRADENUM; //分级数量
						if(altergrade == 1){
							if(gradenum!=null && gradenum!=""){
								agradenum = gradenum;//A级
								agradeArr.push(gradenum);
							}else{
								agradenum = 0;
								agradeArr.push(0);
							}
							agradeArr.push(0);
						}else if(altergrade == 2){
						   if(gradenum!=null && gradenum!=""){
							   bgradenum = gradenum; //B级
							   bgradeArr.push(gradenum);
						   }else{
							   bgradenum = 0;
							   bgradeArr.push(0);
						   }
						   bgradeArr.push(0);
						}else if(altergrade == 3){
							if(gradenum!=null && gradenum!=""){
								cgradenum = gradenum; //C级
								cgradeArr.push(gradenum);
							} else {
								cgradenum = 0;
								cgradeArr.push(0);
							}
							cgradeArr.push(0);
						}else if(altergrade == 4){
							if(gradenum!=null && gradenum!=""){
								dgradenum = gradenum; //D级
								dgradeArr.push(gradenum);
							}else{
								dgradenum = 0;
								dgradeArr.push(0);
							}
							dgradeArr.push(0);
						}else if(altergrade == 0){
							nogradeArr.push(0);
							if (gradenum != null && gradenum !=" ") {
								nogradenum = gradenum; //未分级
								nogradeArr.push(gradenum);
							} else {
								nogradenum = 0;
								nogradeArr.push(0);
							}
						}
					}
				}
				
				yesgradenum = parseInt(agradenum)+parseInt(bgradenum)+parseInt(cgradenum)+parseInt(dgradenum);
				
				$('#yesgrade').html(yesgradenum); //已分级数量
				$('#nograde').html(nogradenum); //待分级数量
				gradesumnum = yesgradenum + parseInt(nogradenum);
				if(gradesumnum!=0){
					graderate = yesgradenum / gradesumnum;
				}
				
				$('#graderate').html(toPercent(graderate.toFixed(4))); //分级率
				
				//展示企业数量柱状图
				entTypeChrt.hideLoading();
            	var entTypeOption = {
            		    tooltip : {
           		    	 	show: true,
           		    	 	trigger: 'item'
            		    },
            		    legend: {
            		    	orient: 'vertical',
//            		    	x : document.getElementById('entTypeChrt').offsetWidth - (document.getElementById('entTypeChrt').offsetWidth - 140),
             		        x: 'right',
             		        y: 'center',
             		        itemGap:16,
             		        itemWidth: 8,
             		        itemHeight: 8,
            		        data:[
            		              {
            		                 "name": "A级", 
            		                 "color": "rgba(0,0,0,0.65)",
            		                 "icon": "circle"
            		              },
            		              {
            		            	  "name": "B级", 
               		               	  "color": "rgba(0,0,0,0.65)", 
            		            	  "icon": "circle"
            		              },
            		              {
            		            	  "name": "C级", 
               		                   "color": "rgba(0,0,0,0.65)", 
            		            	  "icon": "circle"
            		              },
            		              {
            		            	  "name": "D级", 
               		                   "color": "rgba(0,0,0,0.65)", 
            		            	  "icon": "circle"
            		              },
            		              {
            		            	  "name": "待分级", 
               		                  "color": "rgba(0,0,0,0.65)", 
            		            	  "icon": "circle"
            		              }]
            		    },
//            		    legend: {
//            		    	orient: 'vertical',
//             		        x: 'right',
//             		        y: 'center',
//            		        data:['A级', 'B级', 'C级', 'D级', '待分级']
//            		    },
            		    toolbox: {
            		        show : false,
            		        orient: 'vertical',
            		        x: 'right',
            		        y: 'middle'
//            		        feature : {
//            		            mark : {show: true},
//            		            dataView : {show: true, readOnly: false},
//            		            magicType : {show: true, type: ['line', 'bar', 'stack', 'tiled']},
//            		            restore : {show: true},
//            		            saveAsImage : {show: true}
//            		        }
            		    },
            		    grid: {
            		    	x: 30,
            		    	x2: 160,
            		    	y: 10,
            		    	y2: 20
            		    },
            		    calculable : true,
            		    xAxis : [
            		        {
            		            type : 'category',
            		            data : ['已分级','未分级'],
            		            axisLine: {
            		            	show: true,
            		            	lineStyle: {
            		            		color: ['#ddd'],
            		            	    width: 2
            		            	}
            		            },
            		            axisTick: {
            		            	show: false
            		            },
            		            splitLine: {
            		            	show: false
            		            }
            		        }
            		    ],
            		    yAxis : [
            		        {
            		            type : 'value',
            		            axisLine: {
            		            	show: false
            		            },
            		            axisTick: {
            		            	show: false
            		            },
            		            splitLine: {
            		            	show: true,
            		            	lineStyle: {
            		            		color: ['rgba(0,0,0,0.10)'],
            		            	    width: 1,
            		            	    type: 'dashed'
            		            	}
            		            },
            		            axisLabel: {
            		            	textStyle: {
            		            		color: 'rgba(0,0,0,0.65)'
            		            	}
            		            }
            		        }
            		    ],
            		    series : [
            		        {
            		            name:'A级',
            		            type:'bar',
            		            stack: '企业已分级',
            		            barWidth: 40,
            		            itemStyle: {
            	                    normal: {
            	                        color: function(params) {
            	                            return '#1890FF';
            	                        }
            	                    }
            		            },
            		            data:agradeArr
            		        },
            		        {
            		            name:'B级',
            		            type:'bar',
            		            stack: '企业已分级',
            		            barWidth: 40,
            		            itemStyle: {
            	                    normal: {
            	                        color: function(params) {
            	                            return '#F8E71C';
            	                        }
            	                    }
            		            },
            		            data:bgradeArr
            		        },
            		        {
            		            name:'C级',
            		            type:'bar',
            		            stack: '企业已分级',
            		            barWidth: 40,
            		            itemStyle: {
            	                    normal: {
            	                        color: function(params) {
            	                            return '#F5A623';
            	                        }
            	                    }
            		            },
            		            data:cgradeArr
            		        },
            		        {
            		            name:'D级',
            		            type:'bar',
            		            stack: '企业已分级',
            		            barWidth: 40,
            		            itemStyle: {
            	                    normal: {
            	                        color: function(params) {
            	                            return '#F04864';
            	                        }
            	                    }
            		            },
            		            data:dgradeArr
            		        },
            		        {
            		        	name:'待分级',
            		        	type:'bar',
            		        	stack: '企业未分级',
            		            barWidth: 40,
            		            itemStyle: {
            	                    normal: {
            	                        color: function(params) {
            	                            return '#9B9B9B';
            	                        }
            	                    }
            		            },
            		        	data:nogradeArr
            		        }
            		    ]
            	};
            	entTypeChrt.setOption(entTypeOption, true);
            	
            	$(window).resize(function() {
            		entTypeChrt.resize();
                });
			}
		}
	});
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
 * 危化品企业许可图表
 */
function dangerEntCount(){
	var dangerEntChrt = window.allEchartsDic.get("dangerEntChrt");
	if (!dangerEntChrt) {
		dangerEntChrt = echarts.init(document.getElementById("dangerEntChrt"));
		window.allEchartsDic.put("dangerEntChrt", dangerEntChrt);
	} 
	
	dangerEntChrt.showLoading({
	    text: '正在努力的读取数据中...',    //loading话术
	});
	
	$.ajax({
		type : 'post',
		url : BASE_URL + '/enterprise/dangerentcount/report',
		cache : false,
		data: {
			"districtid": "",
			"year": $("#year").val()
		},
		dataType : 'json',
		global : false,
		success : function(map) {  
			if(map.success==true){
				$("#permitentqty").html(map.data.permitentqty);//企业许可数量
				$("#preexpire").html(map.data.preexpire);//许可超期预警
				$("#expire").html(map.data.expire);//许可已超期
				
//				$("#producqty").html(map.data.producqty);//生产许可证
//				$("#businessqty").html(map.data.businessqty);//经营许可证
//				$("#transportqty").html(map.data.transportqty);//运输许可证
//				$("#useqty").html(map.data.useqty);//使用许可证
//				$("#disposqty").html(map.data.disposqty);//废弃处置许可证
				var totalDan = map.data.producqty + map.data.businessqty +
							   map.data.transportqty + map.data.useqty +
							   map.data.disposqty;
				//展示企业数量柱状图
				dangerEntChrt.hideLoading();
            	var dangerEntOption = {
            			title: {
            				show: false,
            		        text: '危化品许可',
            		        x: 90,
            		        y: 0,
            		        itemGap: 0,
            		        textStyle : {
//            		            color : 'rgba(30,144,255,0.8)',
            		            fontFamily : '微软雅黑',
            		            fontSize : 20,
            		            fontWeight : 'bolder'
            		        }
            		    },
            		    tooltip : {
            		        trigger: "item",
            		        formatter: "{a} <br/>{b} : {c} ({d}%)"
            		    },
            		    legend: {
            		    	orient : 'vertical',
            		        x : 'right',
            		        y : 'center',
            		        itemGap:16,
             		        itemWidth: 8,
             		        itemHeight: 8,
//            		    	orient: 'vertical',
//             		        x: 'right',
//             		        y: 'center',
            		        data:['生产许可证','经营许可证','运输许可证','使用许可证','废弃处置许可证'],
            		        data:[
            		              {
            		                 "name": "生产许可证", 
            		                 "color": "rgba(0,0,0,0.65)",
            		                 "icon": "circle"
            		              },
            		              {
            		            	  "name": "经营许可证", 
               		               	  "color": "rgba(0,0,0,0.65)", 
            		            	  "icon": "circle"
            		              },
            		              {
            		            	  "name": "运输许可证", 
               		                   "color": "rgba(0,0,0,0.65)", 
            		            	  "icon": "circle"
            		              },
            		              {
            		            	  "name": "使用许可证", 
               		                   "color": "rgba(0,0,0,0.65)", 
            		            	  "icon": "circle"
            		              },
            		              {
            		            	  "name": "废弃处置许可证", 
               		                  "color": "rgba(0,0,0,0.65)", 
            		            	  "icon": "circle"
            		              }
            		        ],
            		        formatter: function(name) {
            		        	var curPer = "", curCnt = "";
            		        	if (0 == totalDan) {
            		        		curPer = "0";
            		        		curCnt = "0";
            		        	} else {
            		        		if ("生产许可证" == name) {
            		        			curCnt = map.data.producqty;
            		        			curPer = ((map.data.producqty / totalDan).toFixed(2) * 100).toFixed(0);
            		        		} else if ("经营许可证" == name) {
            		        			curCnt = map.data.businessqty;
            		        			curPer = (map.data.businessqty / totalDan).toFixed(2) * 100;
            		        		} else if ("运输许可证" == name) {
            		        			curCnt = map.data.transportqty;
            		        			curPer = (map.data.transportqty / totalDan).toFixed(2) * 100;
            		        		} else if ("使用许可证" == name) {
            		        			curCnt = map.data.useqty;
            		        			curPer = (map.data.useqty / totalDan).toFixed(2) * 100;
            		        		} else if ("废弃处置许可证" == name) {
            		        			curCnt = map.data.disposqty;
            		        			curPer = (map.data.disposqty / totalDan).toFixed(2) * 100;
            		        		}
            		        	}
            		        	
            		        	return name + " " + curCnt + " | " + curPer + "%";
            		        }
            		    },
            		    toolbox: {
            		        show : false,
            		        feature : {
            		            mark : {show: true},
            		            dataView : {show: true, readOnly: false},
            		            magicType : {
            		                show: true, 
            		                type: ['pie', 'funnel'],
            		                option: {
            		                    funnel: {
            		                        x: '25%',
            		                        width: '50%',
            		                        funnelAlign: 'center',
            		                        max: 1548
            		                    }
            		                }
            		            },
            		            restore : {show: true},
            		            saveAsImage : {show: true}
            		        }
            		    },
            		    calculable : false,
            		    series : [
            		        {
            		            name:'危化品企业许可分布',
            		            type:'pie',
            		            center : ['30%', '50%'],
            		            radius : [50, 64],
            		            itemStyle : {
            		                normal : {
            		                    label : {
            		                        show : false,
            		                        formatter: '{b} : {d}%'
            		                    },
            		                    labelLine : {
            		                        show : false
            		                    },
            		                    color: function(params) {
            	                        	var tgtColor = "";
            	                        	if ("生产许可证" == params.name) {
            	                        		tgtColor = "#F5A623";
            	                        	} else if ("经营许可证" == params.name) {
            	                        		tgtColor = "#2FC25B";
            	                        	} else if ("运输许可证" == params.name) {
            	                        		tgtColor = "#13C2C2";
            	                        	} else if ("使用许可证" == params.name) {
            	                        		tgtColor = "#1890FF";
            	                        	}  else if ("废弃处置许可证" == params.name) {
            	                        		tgtColor = "#E200FF";
            	                        	}
//            	                        	alert(JSON.stringify(params));
            	                            return tgtColor;
            	                        }
            		                },
            		                emphasis : {
            		                    label : {
            		                        show : false,
//            		                        position : 'center',
            		                        textStyle : {
            		                            fontSize : '12'
//            		                            fontWeight : 'bold'
            		                        }
            		                    },
            		                    labelLine : {
            		                        show : false
            		                    }
            		                }
            		            },
            		            data:[
            		                {value:map.data.producqty, name:'生产许可证'},
            		                {value:map.data.businessqty, name:'经营许可证'},
            		                {value:map.data.transportqty, name:'运输许可证'},
            		                {value:map.data.useqty, name:'使用许可证'},
            		                {value:map.data.disposqty, name:'废弃处置许可证'}
            		            ]
            		        }
            		    ]
            	};
            	dangerEntChrt.setOption(dangerEntOption, true);
            	
            	$(window).resize(function() {
            		dangerEntChrt.resize();
				});
//				$("#districtname").html(map.data.name);
//				$("#entqty").html(map.data.entqty);
//				$("#permitqty").html(map.data.permitqty);
//				$("#nopermitqty").html(map.data.nopermitqty);
//				$("#storageqty").html(map.data.storageqty);
//				$("#portqty").html(map.data.portqty);
//				$("#portstorage").html(map.data.portstorage);
//				$("#gasqty").html(map.data.gasqty);
//				$("#gasstorage").html(map.data.gasstorage);
//				$("#chemicalqty").html(map.data.chemicalqty);
//				$("#chemicalstorage").html(map.data.chemicalstorage);
//				$("#businesstransport").html(map.data.businesstransport);
//				$("#nobusinesstransport").html(map.data.nobusinesstransport);
//				districtname = map.data.name;
//				var chartype = $("input[name='echarttype']:checked").val();
//				selectEChartType(chartype);
			}
		}
	});
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
 * 许可预警列表信息
 * @param expire	是否超期
 */
function getExpireInfo(expire){
	var year = $("#year").val();
	var districtid = $("#districtid").val();
	parent.openWin(BASE_URL+"/enterprise/dangerentcount/displaypermitwarn/"+year+"/"+expire+"?districtid="+districtid,'详细','80%','60%');
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
 * 重大危险源级别种类/级别统计
 */
function dssGradeCount(type) {
	var dssChrt = window.allEchartsDic.get("dssChrt");
	if (!dssChrt) {
		dssChrt = echarts.init(document.getElementById("dssChrt"));
		window.allEchartsDic.put("dssChrt", dssChrt);
	} 
	
	dssChrt.showLoading({
	    text: '正在努力的读取数据中...',    //loading话术
	});
	
	var curUrl = "";
	if ("dssLvl" == type) {
		//危险源级别
		curUrl = '/dangersource/dssStatistics/loadDssGradeCount';
	} else  if ("dssType" == type) {
		//危险源类别
		curUrl = '/dangersource/dssStatistics/loadDssClassCount';
	}
	
	$.ajax({
		type : 'post',
		url : BASE_URL + curUrl,
		cache : false,
		data: {
			'districtid': '',
			'districtlevel': ''
		},
		dataType : 'json',
		global : false,
		success : function(map) {
			if(map.success == true){
				var dssChrtYData = [], xData = [];
				var curLegendData = [],
					curSeries = [],
					lineStytle = {};
				
				if ("dssLvl" == type) {
					//危险源级别
					
					var dangSouLevelData = SelectOption.getdangSouLevelData();//重大危险源级别
					for(var j = 0; j < dangSouLevelData.length; j++){
						if (map.datas.length > 0) {
							for(var i = 0; i < map.datas.length; i++){
								var dangerlevel = map.datas[i].DANGERLEVEL; //分类
//								var qys = map.datas[i].QYS; //企业数
								var wxys = map.datas[i].WXYS;//危险源数
								if(dangSouLevelData[j].code == dangerlevel){
									$("#levalDanger" + (j + 1)).html(wxys);
//									$("#levalUnit"+(j+1)).html(qys);
//									wxyGradeArrayData[j] = wxys;
//									qyxGradeArrayData[j] = qys;
									break;
								} 
//								else {
//									wxyGradeArrayData[j] = 0;
//									qyxGradeArrayData[j] = 0;
//								}
							}
						} else {
							$("#levalDanger" + (j + 1)).html("0");
//							$("#levalUnit"+(j+1)).html("0");
						}
					}
					
					
					//危险源级别
					dssChrtYData.push($("#levalDanger1").text());
					dssChrtYData.push($("#levalDanger2").text());
					dssChrtYData.push($("#levalDanger3").text());
					dssChrtYData.push($("#levalDanger4").text());
					
					xData.push('一级');
					xData.push('二级');
					xData.push('三级');
					xData.push('四级');
					
					curLegendData = [
					  {
		                 "name": "重大危险源个数" 
		              },
		              {
		            	  "name": "重大危险源折线个数"
		              }
					];
					
					curSeries = [
	     		        {
	     		            name:'重大危险源个数',
	     		            type:'bar',
	     		            barWidth: 40,
	     		            itemStyle: {
	     	                    normal: {
	     	                        color: function(params) {
	     	                        	var tgtColor = "";
	     	                        	if ("一级" == params.name) {
	     	                        		tgtColor = "#F5222D";
	     	                        	} else if ("二级" == params.name) {
	     	                        		tgtColor = "#FAAD14";
	     	                        	} else if ("三级" == params.name) {
	     	                        		tgtColor = "#FFD700";
	     	                        	} else if ("四级" == params.name) {
	     	                        		tgtColor = "#1890FF";
	     	                        	}
	//     	                        	alert(JSON.stringify(params));
	     	                            return tgtColor;
	     	                        }
	     	                    }
	     		            },
	     		            data: dssChrtYData
	     		        },
	     		        {
	     		            name:'重大危险源折线个数',
	     		            type:'line',
	     		            itemStyle: {
	     	                    normal: {
	     	                    	color: "#1890FF",
	     	                    	borderWidth: 2,
	     	                    	lineStyle: {
	     	                    		color: "#1890FF"
	     	                    	}
	     	                    }
	     		            },
	     		            data: dssChrtYData
	     		        }
     		        ];
				} else if ("dssType" == type) {
					//危险源类别
					var dangerTypeData = SelectOption.getDangerTypeData();//重大危险源类别 
					
					for(var j=0;j<dangerTypeData.length;j++){
						if (map.datas.length > 0){
							for(var i=0;i<map.datas.length;i++){
								var dangertype = map.datas[i].DANGERTYPE; //分类
								var qys = map.datas[i].QYS; //企业数
								var wxys = map.datas[i].WXYS;//危险源数
								if(dangerTypeData[j].code == dangertype){
									$("#dtdanger"+(j+1)).html(wxys);
//									$("#dtunit"+(j+1)).html(qys);
//									wxyClassArrayData[j] = wxys;
//									qyxClassArrayData[j] = qys;
									break;
								}
//								else{
//									wxyClassArrayData[j] = 0;
//									qyxClassArrayData[j] = 0;
//								}
							}
						} else {
							$("#dtdanger"+(j+1)).html("0");
//							$("#dtunit"+(j+1)).html("0");
//							wxyClassArrayData[j] = 0;
//							qyxClassArrayData[j] = 0;
						}
					}
					
					//危险源类别
					dssChrtYData.push($("#dtdanger1").text());
					dssChrtYData.push($("#dtdanger2").text());
					dssChrtYData.push($("#dtdanger3").text());
					
					xData.push('危险化学品');
					xData.push('燃气类');
					xData.push('港口类');
					
					curLegendData = [
									  {
						                 "name": "重大危险源个数" 
						              }
									  ];
					
					curSeries = [
				     		        {
				     		            name:'重大危险源个数',
				     		            type:'bar',
				     		            barWidth: 40,
				     		            itemStyle: {
				     	                    normal: {
				     	                        color: function(params) {
				     	                        	var tgtColor = "";
				     	                        	if ("危险化学品" == params.name) {
				     	                        		tgtColor = "#F5222D";
				     	                        	}  else if ("燃气类" == params.name) {
				     	                        		tgtColor = "#FAAD14";
				     	                        	}  else if ("港口类" == params.name) {
				     	                        		tgtColor = "#1890FF";
				     	                        	} 
				//     	                        	alert(JSON.stringify(params));
				     	                            return tgtColor;
				     	                        }
				     	                    }
				     		            },
				     		            data: dssChrtYData
				     		        }
				     ];
				}
				
				//展示企业数量柱状图
				dssChrt.hideLoading();
				
            	var dssChrtOption = {
            		    tooltip : {
            		        trigger: 'axis',
            		        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
            		            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            		        }
            		    },
            		    legend: {
            		    	show: false,
            		    	orient: 'vertical',
             		        x: 'right',
             		        y: 'center',
             		        itemGap:16,
            		        itemWidth: 8,
            		        itemHeight: 8,
            		        data: curLegendData
            		    },
            		    toolbox: {
            		        show : false,
            		        orient: 'vertical',
            		        x: 'right',
            		        y: 'middle'
//            		        feature : {
//            		            mark : {show: true},
//            		            dataView : {show: true, readOnly: false},
//            		            magicType : {show: true, type: ['line', 'bar', 'stack', 'tiled']},
//            		            restore : {show: true},
//            		            saveAsImage : {show: true}
//            		        }
            		    },
            		    calculable : false,
            		    grid: {
            		    	x: 30,
            		    	x2: 30,
            		    	y: 10,
            		    	y2: 20
            		    },
            		    xAxis : [
            		        {
            		            type : 'category',
            		            data : xData,
            		            axisLine: {
            		            	show:  true,
            		            	lineStyle: {
            		            		color: ['#ddd'],
            		            	    width: 2
            		            	}
            		            },
            		            axisTick: {
            		            	show: false
            		            },
            		            splitLine: {
            		            	show: false
            		            }
            		        }
            		    ],
            		    yAxis : [
            		        {
            		            type : 'value',
            		            axisLine: {
            		            	show: false
            		            },
            		            axisTick: {
            		            	show: false
            		            },
            		            splitLine: {
            		            	show: true,
            		            	lineStyle: {
            		            		color: ['rgba(0,0,0,0.10)'],
            		            	    width: 1,
            		            	    type: 'dashed'
            		            	}
            		            },
            		            axisLabel: {
            		            	textStyle: {
            		            		color: 'rgba(0,0,0,0.65)'
            		            	}
            		            }
            		        }
            		    ],
            		    series: curSeries
            	};
            	dssChrt.setOption(dssChrtOption, true);
            	
            	$(window).resize(function() {
            		dssChrt.resize();
                });
			}
		}
	});
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


//------------监测监控------------------------------------------------------------
/**
 * 监测监控-趋势
 */
function jcjkTrendCnt() {
	//隐藏时间区间、显示图表dom筛选条件
	$(".agoData, .jcjkTable").hide();
	$("#jcjkChrt").show();
	
	var jcjkChrt = window.allEchartsDic.get("jcjkChrt");
	if (!jcjkChrt) {
		jcjkChrt = echarts.init(document.getElementById("jcjkChrt"));
		window.allEchartsDic.put("jcjkChrt", jcjkChrt);
	} 
	
	jcjkChrt.showLoading({
	    text: '正在努力的读取数据中...',    //loading话术
	});
	
	var notInEntCount = 0;
    var typeEntCount = 0;
    var now = new Date();
    $.ajax({
        type: "post",
        url: BASE_URL + "monitor/welcome/monitorInfo",
        data: {
            etime: getFormatDate(now, "yyyy-MM-dd"),
            stime: getFormatDate(now, "yyyy-MM-dd"),
            userid: "",
            year: ""
        },
        success: function (data) {
            if (data) {
                var entCounts = data.entCounts;
                var totalEntCount = 0;
                $.each(entCounts, function (i, item) {
                    totalEntCount += parseInt(item.ENTCOUNT);
                    switch (item.DANGERTYPE) {
                        case "1":
                            typeEntCount += parseInt(item.ENTCOUNT);
                            break;
                        case "2":
                            typeEntCount += parseInt(item.ENTCOUNT);
                            break;
                        case "3":
                            typeEntCount += parseInt(item.ENTCOUNT);
                            break;
                    }
                });
                notInEntCount = totalEntCount - typeEntCount;
                $(".notInEntCount").html(notInEntCount);
                $(".inEntCount").html(typeEntCount);
                var warningCounts = data.warningCounts;
                if (warningCounts) {
                    $(".todayWarningCount").html(warningCounts.TOTALWARNING);
                    
//                    alert(warningCounts.NOHANDLECOUNT);
                    
                    $(".noHandleCount").html(warningCounts.NOHANDLECOUNT == null ? '0' : warningCounts.NOHANDLECOUNT);
                    
                    var dbCount = warningCounts.DBCOUNT == null ? 0 : warningCounts.DBCOUNT;
                    var gbCount = warningCounts.GBCOUNT == null ? 0 : warningCounts.GBCOUNT;
                    var cdbCount = warningCounts.CDBCOUNT == null ? 0 : warningCounts.CDBCOUNT;
                    var cgbCount = warningCounts.CGBCOUNT == null ? 0 : warningCounts.CGBCOUNT;
                    var mlcCount = warningCounts.MLCCOUNT == null ? 0 : warningCounts.MLCCOUNT;
                    var warningValues = [dbCount, gbCount, cdbCount, cgbCount, mlcCount];
                    
                    jcjkChrt.hideLoading();
                    var jcjkChrtOpt = {
                	    title: {
                            text: '实时报警',
                            textStyle: {
                                align: "center",
                                fontFamily: "微软雅黑",
                                fontSize: 12,
                                color: "rgba(0,0,0,0.85)"
                            }, 
                            x: "center",
                            y: "25px"
                	    },
                	    tooltip: {
                	        trigger: 'axis',
                	        feature: {
                	            saveAsImage: {}
                	        }
                	    },
                	    legend: {
                	    	orient: 'vertical',
                            data: ['低报', '高报', '超低报', '超高报', '满量程']
                	    },
                	    grid: {
                	        left: '3%',
                	        right: '8%',
                	        bottom: '3%',
                	        containLabel: true
                	    },
                	    xAxis: {
                	        type: 'category',
                	        boundaryGap: false,
                            data: ['低报', '高报', '超低报', '超高报', '满量程'],
                            axisLine: {
                            	show: false
                            },
                            splitLine:{  
                　　　　						show:false  
			                　　 			},
			                　　 			axisTick: {
			                　　 				show: false
			                　　 			}
			            },
			            yAxis: {
			            	type: 'value',
			            	show: false,
			            	splitLine:{  
			                            　　　		show:false  
			                            　　 		} 
			            },	
			            calculable: false,//false 禁止拖动
			            series: [
			                     {
			//                   	             name: '低报',
			                    	 type: 'line',
			//                      	          symbol:'pin',//拐点样式
			                    	 symbolSize: 12,//拐点大小
			                    	 symbolWith: 5,
			//                                data: [10,18,3,1],
			                    	 data: warningValues,
			                    	 itemStyle : {  
			                    		 normal : {  
			                    			 color: '#F7BE4B',
			                    			 lineStyle:{  
			                    				 width:4,//折线宽度
			                    				 color:'#F7BE4B'                            
			                    			 },
			                    			 label: {
			                    				 show: true,
			                    				 position: 'top'
			                    			 }
			                    		 }  
			                    	 }, 
			                     }        
			             ]
                    };
                    jcjkChrt.setOption(jcjkChrtOpt, true);
                    
                    $(window).resize(function() {
                    	jcjkChrt.resize();
    				});
                }
            }
        }
    });
}

/**
 * 监测监控-排名
 */
function jcjkRankCnt() {
	//隐藏实时监控图表，显示时间区间筛选条件
	$("#jcjkChrt").hide();
	$(".agoData, .jcjkTable").show();
	
	//查询各统计个数
	var notInEntCount = 0;
    var typeEntCount = 0;
    $.ajax({
        type: "post",
        url: BASE_URL + "monitor/welcome/monitorInfo",
        data: {
            etime: getFormatDate(new Date(), "yyyy-MM-dd"),
            stime: getFormatDate(new Date(), "yyyy-MM-dd"),
            userid: "",
            year: ""
        },
        success: function (data) {
            if (data) {
                var entCounts = data.entCounts;
                var totalEntCount = 0;
                $.each(entCounts, function (i, item) {
                    totalEntCount += parseInt(item.ENTCOUNT);
                    switch (item.DANGERTYPE) {
                        case "1":
                            typeEntCount += parseInt(item.ENTCOUNT);
                            break;
                        case "2":
                            typeEntCount += parseInt(item.ENTCOUNT);
                            break;
                        case "3":
                            typeEntCount += parseInt(item.ENTCOUNT);
                            break;
                    }
                });
                notInEntCount = totalEntCount - typeEntCount;
                $(".notInEntCount").html(notInEntCount);
                $(".inEntCount").html(typeEntCount);
                var warningCounts = data.warningCounts;
                if (warningCounts) {
                    $(".todayWarningCount").html(warningCounts.TOTALWARNING);
                    $(".noHandleCount").html(warningCounts.NOHANDLECOUNT == null ? '0' : warningCounts.NOHANDLECOUNT);
                }
            }
        }
    });
    
    //根据指定时间区间查询企业报警最近排名
    renderEntAlarmList();
}

/**
 * 根据指定时间区间查询企业报警最近排名
 */
function renderEntAlarmList() {
    $.ajax({
        type: "post",
        url: BASE_URL + "monitor/welcome/loadEntAlarmRankInfo",
        data: {"type": $(".agoData").find(".active").data("time")},
        success: function (retData) {
            if (retData) {
//            	console.log(retData);
            	
            	var $tbody = $(".fxglLeft").find("tbody");
            	$tbody.empty();
            	if (0 < retData.length) {
            		//查询遍历添加企业报警排名列表
            		var entAlarmTbDom = "", totalAlarmCnt = 0;
            		for (var i in retData) {
            			//仅显示前三个企业
            			if (3 == i) {
            				break;
            			}
            			
            			//当前企业报警总数
            			var tmpAlarmTotalCnt = retData[i].DBCOUNT + retData[i].GBCOUNT + retData[i].CDBCOUNT + retData[i].CGBCOUNT + retData[i].MLCCOUNT;
            			
            			//该企业总报警数为0时，结束渲染表格
            			if (0 == tmpAlarmTotalCnt) {
            				return;
            			} else {
            				//为企业总报警数赋值
                			0 == i && (totalAlarmCnt = tmpAlarmTotalCnt);
            			}
            			
            			entAlarmTbDom += 
            					   "<tr>" + 
	                               " <td>" + 
	                               "    <span>" + (parseInt(i) + 1) + "</span>" + 
	                               " </td>" + 
	                               " <td title='" + retData[i].ENTNAME + "'>" + retData[i].ENTNAME + "</td>" + 
	                               " <td>" + 
	                               " 	<ul class='fxul'>" + 
		                           "         <li style='width: " + ((retData[i].DBCOUNT / totalAlarmCnt) * 100) + "%;'></li>" + 
		                           "         <li style='width: " + ((retData[i].GBCOUNT / totalAlarmCnt) * 100) + "%;'></li>" + 
		                           "         <li style='width: " + ((retData[i].CDBCOUNT / totalAlarmCnt) * 100) + "%;'></li>" + 
		                           "         <li style='width: " + ((retData[i].CGBCOUNT / totalAlarmCnt) * 100) + "%;'></li>" + 
		                           "         <li style='width: " + ((retData[i].MLCCOUNT / totalAlarmCnt) * 100) + "%;'></li>" + 
	                               "	 	</ul>" + 
	                               " </td>" + 
	                               "</tr>";
//            			jcjkTbDom += 
//            				"<tr>" +
//                            "	<td>" +
//                            "     <span>" + (parseInt(i) + 1) + "</span>" +
//                            "	</td>" +
//                            "	<td title='" + retData[i].ENTNAME + "'>" + retData[i].ENTNAME + "</td>" +
//                            "	<td>" + (retData[i].DBCOUNT) + "," + (retData[i].GBCOUNT) + "," + (retData[i].CDBCOUNT) + "," + (retData[i].CGBCOUNT) + "," + (retData[i].MLCCOUNT) + "</td>" +
//                            "</tr>";
            		}
            		$tbody.html(entAlarmTbDom);
            	}
            }
        }
    });
}


//进入企业列表
function intoEntList(type) {
    var stime = getFormatDate(new Date());
    var etime = getFormatDate(new Date());
    var districtid = "";

    var statuses = "";
    var title = "";
    var dangertype = "";
    var dangersource = "";
    var chemical = "";
    var notIn = "";

    switch (type) {
        case "notIn":
            //未接入的企业
            title = "未接入企业";
            notIn = "true";
            break;
        case "in":
            title = "已接入企业";
            dangertype = "1,2,3";
            break;
    }
//    parent.openWin(BASE_URL + 'views/module/monitor/monitorcondition/entInfoList.html?stime=' + stime + '&etime=' + etime + '&statuses=' + statuses + '&districtid=' + districtid + '&dangersource=' + dangersource + '&notIn=' + notIn + '&dangertype=' + dangertype, title, '80%', '90%');
    parent.openWin(BASE_URL + 'views/module/monitor/monitorcondition/entInfoListForMainPage.html?stime=' + stime + '&etime=' + etime + '&statuses=' + statuses + '&districtid=' + districtid + '&dangersource=' + dangersource + '&notIn=' + notIn + '&dangertype=' + dangertype, title, '80%', '90%');
}

//进入报警列表（全部和未处理）
function intoAlarmInfoList(type) {
    var stime = getFormatDate(new Date(), "yyyy-MM-dd");
    var etime = getFormatDate(new Date(), "yyyy-MM-dd");
    var districtid = "";
    var statuses = "";
    var title = "";
    var dangertype = "";
    var handlestatus = "";

    switch (type) {
        case "all":
            title = "今日报警列表";
            break;
        case "nohandle":
        	{
        	title = "今日报警未处理列表";
        	handlestatus = "0";
        	}
            break;
    }
    parent.openWin(BASE_URL + 'views/module/monitor/monitorcondition/alarmInfoList.html?stime=' + stime + '&etime=' + etime + '&statuses=' + statuses + '&districtid=' + districtid + '&dangertype=' + dangertype + '&handlestatus=' + handlestatus, title, '80%', '90%');
}


//--------------风险管理----------------------
function fxglCount() {
	//查询当前区域下所有企业各种风险个数
	$.ajax({
		type : 'post',
		url : BASE_URL + "/dangersource/dssrskproduct/getPortalAllDssTypeData",
		cache : false,
		data: {},
		dataType : 'json',
		global : false,
		success : function(data) {
			if (data) {
				var $body = $(".fxgl").find("tbody");
				$body.empty();
				
				var sczyhdCnt = 0,
					wxzyhdCnt = 0,
					gygcCnt = 0,
					sbssCnt = 0,
					czcxCnt = 0,
					cshjCnt = 0;
				
				if (0 < data.length) {
					sczyhdCnt = _.where(data, {"TYPECODE": "6"}).length;
					wxzyhdCnt = _.where(data, {"TYPECODE": "1"}).length;
					gygcCnt = _.where(data, {"TYPECODE": "3"}).length;
					sbssCnt = _.where(data, {"TYPECODE": "2"}).length;
					czcxCnt = _.where(data, {"TYPECODE": "4"}).length;
					cshjCnt = _.where(data, {"TYPECODE": "5"}).length;
					
					$("#sczyhdCnt").text(sczyhdCnt);
					$("#wxzyhdCnt").text(wxzyhdCnt);
					$("#gygcCnt").text(gygcCnt);
					$("#sbssCnt").text(sbssCnt);
					$("#czcxCnt").text(czcxCnt);
					$("#cshjCnt").text(cshjCnt);
					
					var allEntDssCntArr = [];
					
					var allEntNameArr = [];
					_.map(data, function(tmpData, key) {
						if (!(_.contains(allEntNameArr, tmpData.ENTNAME))) {
							allEntNameArr.push(tmpData.ENTNAME);
						}
					});
					
					_.map(allEntNameArr, function(tmpEntname, key) {
						allEntDssCntArr.push({"entName": tmpEntname, 
											  "cnt": _.where(data, {"ENTNAME": tmpEntname}).length});
					});
					
					//逆向排序
					allEntDssCntArr = _.sortBy(allEntDssCntArr, function(num){return -num.cnt;});
					
					var tmpEntDssDom = "", totalDssCnt = 0;
					for (var i in allEntDssCntArr) {
						//最多取前三个
						if (3 == i) {
							break;
						}
						
						0 == i && (totalDssCnt = allEntDssCntArr[i].cnt);
						
						tmpEntDssDom += "<tr> " + 
                               " <td>" +
                               "     <span>" + (parseInt(i) + 1) + "</span>" +
                               " </td>" +
                               " <td title='" + allEntDssCntArr[i].entName + "'>" + allEntDssCntArr[i].entName + "</td>" +
                               " <td>" +
                               "	<ul class='jcul jc" + i + "' style='width: " 
                               			+ (allEntDssCntArr[i].cnt /  totalDssCnt) * 100 + "%;'>" +
                               "     <li></li>" +
                               " 	</ul>" +
                               "</td>" +
                               "</tr>";
//						tmpEntDssDom += "<tr>" +
//				                        "	<td>" +
//				                        "    <span>" + (parseInt(i) + 1) + "</span>" +
//				                        "	</td>" +
//				                        "	<td title='" + allEntDssCntArr[i].entName + "'>" + allEntDssCntArr[i].entName + "</td>" +
//				                        "	<td>" + allEntDssCntArr[i].cnt + "</td>" +
//				                        "</tr>";
					}
					
					$body.html(tmpEntDssDom);
				}
				
			}
		}
	});
}

/**
 * 生产作业活动弹窗
 */
function showSczyhdWin() {
	parent.openWin(BASE_URL + 'views/module/dangersource/dssRskProduct/govDssRskProductList.html?privcode=SCZYHDFX_GOV','生产作业活动','80%','65%');
}

/**
 * 维修作业活动弹窗
 */
function showWxzyhdCntWin() {
	parent.openWin(BASE_URL + 'views/module/dangersource/dssRskRepair/govDssRskRepairList.html?privcode=WXZYHDFX_GOV','维修作业活动','80%','65%');
}

/**
 * 工艺过程弹窗
 */
function showGygcWin() {
	parent.openWin(BASE_URL + 'views/module/dangersource/dssRskTech/govDssRskTechList.html?privcode=GYGCFX_GOV','工艺过程','80%','65%');
}

/**
 * 设备设施弹窗
 */
function showSbssWin() {
	parent.openWin(BASE_URL + 'views/module/dangersource/dssRskEqu/govDssRskEquList.html?privcode=SBSSFX_GOV','设备设施','80%','65%');
}

/**
 * 操作程序弹窗
 */
function showCzcxWin() {
	parent.openWin(BASE_URL + 'views/module/dangersource/dssrskoper/govdssrskoperList.html?privcode=CZCXFX_GOV','操作程序','80%','65%');
}

/**
 * 场所环境弹窗
 */
function showCshjWin() {
	parent.openWin(BASE_URL + 'views/module/dangersource/dssrskplace/govdssrskplaceList.html?privcode=CSHJFX_GOV','场所环境','80%','65%');
}


//---------------隐患管理-------------------------------------------------
function yhglCnt() {
	var yhLvlPie = window.allEchartsDic.get("yhLvlPie");
	var yhFlowStatBar = window.allEchartsDic.get("yhFlowStatBar");
	if (!yhLvlPie && !yhFlowStatBar) {
		yhLvlPie = echarts.init(document.getElementById("yhLvlPie"));
		yhFlowStatBar = echarts.init(document.getElementById("yhFlowStatBar"));
		window.allEchartsDic.put("yhLvlPie", yhLvlPie);
		window.allEchartsDic.put("yhFlowStatBar", yhFlowStatBar);
	} 
	
	yhLvlPie.showLoading({
	    text: '正在努力的读取数据中...',    //loading话术
	});
	yhFlowStatBar.showLoading({
		text: '正在努力的读取数据中...',    //loading话术
	});
	
	$.ajax({
        type: "post",
        cache : false,
        url: BASE_URL + "hid/welcome/loadDangerCount",
        data: {},
        dataType : 'json',
        global : false,
        success: function (data) {
        	 yhLvlPie.hideLoading();
        	 yhFlowStatBar.hideLoading();
            if (data && data.zczbcount && data.wgxccount && data.rate 
            	&& data.hidLvlList && data.hidStateList ) {
                $("#zczbCnt").text(data.zczbcount);
                $("#wgxcCnt").text(data.wgxccount);
                $("#yhzgl").text(data.rate.toFixed(0) + "%");
                
                //加载执法状态柱状图
//                initHdidangerMap(data.hidLvlList, data.hidStateList);
                
                //展示企业数量柱状图
//                yhLvlPie.hideLoading();
            	var yhLvlPieOption = {
            			title: {
            				show: true,
            				text: '隐患级别',
            		        x: "center",
            		        y: 0,
            		        itemGap: 0,
            		        textStyle : {
            		            color : 'rgba(0,0,0,0.85)',
//            		            fontFamily : '微软雅黑',
            		            fontSize : 12
//            		            fontWeight : 'bolder'
            		        }
            		    },
            		    tooltip : {
            		        trigger: 'item',
            		        formatter: "{a} <br/>{b} : {c} ({d}%)"
            		    },
            		    legend: {
            		    	show: false,
            		    	orient : 'vertical',
            		        data:['一般隐患','重大隐患'],
            		    },
            		    toolbox: {
            		        show : false,
            		        feature : {
            		            mark : {show: true},
            		            dataView : {show: true, readOnly: false},
            		            magicType : {
            		                show: true, 
            		                type: ['pie', 'funnel'],
            		                option: {
            		                    funnel: {
            		                        x: '25%',
            		                        width: '50%',
            		                        funnelAlign: 'center',
            		                        max: 1548
            		                    }
            		                }
            		            },
            		            restore : {show: true},
            		            saveAsImage : {show: true}
            		        }
            		    },
            		    calculable : false,
            		    series : [
            		        {
            		            name:'隐患级别',
            		            type:'pie',
            		            radius : [30, 44],
//            		            radius : ['65%', '80%'],
            		            itemStyle : {
            		                normal : {
            		                    label : {
            		                        show : false,
            		                        formatter: '{b} : {d}%'
            		                    },
            		                    labelLine : {
            		                        show : false
            		                    },
            		                    color: function(params) {
            	                        	var tgtColor = "";
            	                        	if ("一般隐患" == params.name) {
            	                        		tgtColor = "#FAAD14";
            	                        	} else if ("重大隐患" == params.name) {
            	                        		tgtColor = "#F5222D";
            	                        	}
//            	                        	alert(JSON.stringify(params));
            	                            return tgtColor;
            	                        }
            		                },
            		                emphasis : {
            		                    label : {
            		                        show : false,
//            		                        position : 'center',
            		                        textStyle : {
            		                            fontSize : '12'
//            		                            fontWeight : 'bold'
            		                        }
            		                    },
            		                    labelLine : {
            		                        show : false
            		                    }
            		                }
//            		                emphasis : {
//            		                    label : {
//            		                        show : false,
//            		                        position : 'center',
//            		                        textStyle : {
//            		                            fontSize : '30',
//            		                            fontWeight : 'bold'
//            		                        }
//            		                    }
//            		                }
            		            },
            		            data:[
            		                {value: (data.hidLvlList)[0], name: '一般隐患'},
            		                {value: (data.hidLvlList)[1], name: '重大隐患'}
            		            ]
            		        }
            		    ]
            	};
            	yhLvlPie.setOption(yhLvlPieOption, true);
            	
//            	yhFlowStatBar.hideLoading();
            	var yhFlowStatBarOpt = {
            			title: {
            		        text: '隐患流转状态',
            		        x: 'center',
            		        y: 'top',
            		        itemGap: 0,
            		        textStyle : {
            		            color : 'rgba(0,0,0,0.85)',
//            		            fontFamily : '微软雅黑',
            		            fontSize : 12
//            		            fontWeight : 'bolder'
            		        }
            		    },
            		    tooltip : {
            		        trigger: 'axis',
            		        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
            		            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            		        }
            		    },
            		    legend: {
            		    	show: false,
            		    	orient: 'vertical',
             		        x: 'right',
             		        y: 'center',
             		        itemGap:16,
            		        itemWidth: 8,
            		        itemHeight: 8,
            		        data:[{
       		                 "name": "隐患流转状态", 
    		                 "color": "rgba(0,0,0,0.65)",
    		                 "icon": "circle"
            		        }]
            		    },
            		    toolbox: {
            		        show : false,
            		        orient: 'vertical',
            		        x: 'right',
            		        y: 'middle'
//            		        feature : {
//            		            mark : {show: true},
//            		            dataView : {show: true, readOnly: false},
//            		            magicType : {show: true, type: ['line', 'bar', 'stack', 'tiled']},
//            		            restore : {show: true},
//            		            saveAsImage : {show: true}
//            		        }
            		    },
            		    calculable : true,
            		    grid: {
            		    	x: 30,
            		    	x2: 20,
            		    	y: 30,
            		    	y2: 20
            		    },
            		    xAxis : [
            		        {
            		            type : 'category',
            		            data : ['待整改', '待验收', '待核销', '核销'],
            		            axisLine: {
            		            	show: true,
            		            	lineStyle: {
            		            		color: ['#ddd'],
            		            	    width: 2
            		            	}
            		            },
            		            axisTick: {
            		            	show: false
            		            },
            		            splitLine: {
            		            	show: false
            		            }
            		        }
            		    ],
            		    yAxis : [
            		        {
            		            type : 'value',
            		            axisLine: {
            		            	show: false
            		            },
            		            axisTick: {
            		            	show: false
            		            },
            		            splitLine: {
            		            	show: true,
            		            	lineStyle: {
            		            		color: ['rgba(0,0,0,0.10)'],
            		            	    width: 1,
            		            	    type: 'dashed'
            		            	}
            		            },
            		            axisLabel: {
            		            	textStyle: {
            		            		color: 'rgba(0,0,0,0.65)'
            		            	}
            		            }
            		        }
            		    ],
            		    series : [
            		        {
            		            name:'隐患流转状态',
            		            type:'bar',
            		            barWidth: 40,
            		            itemStyle: {
            	                    normal: {
            	                        color: function(params) {
            	                        	var tgtColor = "";
            	                        	if ("待整改" == params.name) {
            	                        		tgtColor = "#F5222D";
            	                        	} else if ("待验收" == params.name) {
            	                        		tgtColor = "#FAAD14";
            	                        	} else if ("待核销" == params.name) {
            	                        		tgtColor = "#1890FF";
            	                        	} else if ("核销" == params.name) {
            	                        		tgtColor = "#52C41A";
            	                        	}  
//            	                        	alert(JSON.stringify(params));
            	                            return tgtColor;
            	                        }
            	                    }
            		            },
            		            data: data.hidStateList
            		        }
            		    ]
            	};
            	yhFlowStatBar.setOption(yhFlowStatBarOpt, true);
            	
            	$(window).resize(function() {
            		yhLvlPie.resize();
            		yhFlowStatBar.resize();
				});
            }
        },
        error:function(){
        	yhLvlPie.hideLoading();
       	 	yhFlowStatBar.hideLoading();
        }
    });
}

/**
 * 隐患详细查看
 */
function displayHdi(type) {
    //返回当前选中行政执法的列表
    if (type == "0") {
        //自查自报隐患数
        parent.openWin(BASE_URL+"/views/module/hidden/hidcount/govHiddendangerList.html?isgov=0", "自查隐患列表", "80%", "80%");
    } else if (type == "1") {
        //网格巡查隐患数
        parent.openWin(BASE_URL+"/views/module/hidden/hidcount/govHiddendangerList.html?isgov=1", "巡查隐患列表", "80%", "80%");
    }
}


//--------------环境指数、监测统计--------------------------------------------------
function hjStatAna() {
	var aqiAvg = "-",
		aqiAvgLvl = "-",
		temAvg = "-",
		humAvg = "-",
		pm25Avg = "-",
		pm10Avg = "-",
		so2Avg = "-",
		coAvg = "-",
		o3Avg = "-",
		no2Avg = "-",
		recTime = "-",
		tvocsAvg = "-",
		mainPoll = "-";
	
	
	var hjzsPan = window.allEchartsDic.get("hjzsPan");
	if (!hjzsPan) {
		hjzsPan = echarts.init(document.getElementById("hjzsPan"));
		window.allEchartsDic.put("hjzsPan", hjzsPan);
	} 
	
	hjzsPan.showLoading({
	    text: '正在努力的读取数据中...',    //loading话术
	});
	
	//查询最新的空气检测站点位数据
	$.ajax({
	    type: "post",
	    url: BASE_URL + "epi/epistation/loadAllGasStationList",
	    data: {"stationName": ""},
	    success: function (retData) {
	//    	console.log(retData);
	    	if (retData) {
	    		var staDetList = JSON.parse(retData.resultAirArrStr);
	    		if (staDetList && 0 < staDetList.length) {
	    			//计算大气各参数的平均值
		      	  	var totalAqi = 0,
		      	  	  	totalTem = 0,
		      	  	  	totalHum = 0,
		      	  	  	totalPm25 = 0,
		      	  	  	totalPm10 = 0,
		      	  	  	totalSo2 = 0,
		      	  	  	totalCo = 0,
		      	  	  	totalO3 = 0,
		      	  	  	totalNo2 = 0;
		//      	  	console.log(retData.reStationBaseList);
		//      	  	console.log(staDetList);
		      	  	
		      	  	var ascStaList = _.sortBy(staDetList, function(num) {return parseInt(num.aqi);});
//		      	  	_.map(retData.ascStaList, function(tmpSta, index) {
//		      	  	});
		      	  	_.map(ascStaList, function(tmpSta, index) {
//		      	  		var curStaDet = (_.where(ascStaList, {"siteCode": tmpSta.SITECODE}))[0];
		      	  		totalAqi += parseFloat(tmpSta.aqi || 0);
		      	  		totalTem += parseFloat(tmpSta.temp || 0);
		     		  	totalHum += parseFloat(tmpSta.hum || 0);
		     		  	totalPm25 += parseFloat(tmpSta.pm2_5 || 0);
		     		  	totalPm10 += parseFloat(tmpSta.pm10 || 0);
		     		  	totalSo2 += parseFloat(tmpSta.so2 || 0);
		     		  	totalCo += parseFloat(tmpSta.co || 0);
		     		  	totalO3 += parseFloat(tmpSta.o3 || 0);
		     		  	totalNo2 += parseFloat(tmpSta.no2 || 0);
		     		  	
		     		  	$("#aqi" + (index + 1) + "Name").empty().text(tmpSta.siteName);
	     		  		$("#aqi" + (index + 1) + "Name").attr("title", tmpSta.siteName);
	     		  		$("#aqi" + (index + 1) + "Val").empty().text(tmpSta.aqi);
		      	  	});
		     	   
		      	  	var ascStaListLength = ascStaList.length;
		      	  	aqiAvg = (totalAqi/ascStaListLength).toFixed(0);
		      	  	temAvg = (totalTem/ascStaListLength).toFixed(0);
		      	  	humAvg = (totalHum/ascStaListLength).toFixed(0);
		      	  	pm25Avg = (totalPm25/ascStaListLength).toFixed(0);
		      	  	pm10Avg = (totalPm10/ascStaListLength).toFixed(0);
		      	  	so2Avg = (totalSo2/ascStaListLength).toFixed(0);
		      	  	coAvg = (totalCo/ascStaListLength).toFixed(0);
		      	  	o3Avg = (totalO3/ascStaListLength).toFixed(0);
		      	  	no2Avg = (totalNo2/ascStaListLength).toFixed(0);
		      	  	recTime = _.last(_.sortBy(ascStaList, function(staDet){return staDet.monitorTime;})).monitorTime;
		     		
		      	  	//获取AQI级别
		      	  	var aqiAvgLvlName = "-";
		      	  	if (0 <= aqiAvg && 50 > aqiAvg) {
		      	  		aqiAvgLvl = "1";
		      	  		aqiAvgLvlName = "优";
		      	  	} else if (50 <= aqiAvg && 100 > aqiAvg) {
		      	  		aqiAvgLvl = "2";
		      	  		aqiAvgLvlName = "良";
		      	  	} else if (100 <= aqiAvg && 150 > aqiAvg) {
		      	  		aqiAvgLvl = "3";
		      	  		aqiAvgLvlName = "轻度污染";
		      	  	} else if (150 <= aqiAvg && 200 > aqiAvg) {
		      	  		aqiAvgLvl = "4";
		      	  		aqiAvgLvlName = "中度污染";
		      	  	} else if (200 <= aqiAvg && 300 > aqiAvg) {
		      	  		aqiAvgLvl = "5";
		      	  		aqiAvgLvlName = "重度污染";
		      	  	} else if (300 <= aqiAvg && 500 >= aqiAvg) {
		      	  		aqiAvgLvl = "6";
		      	  		aqiAvgLvlName = "严重污染";
		      	  	} else {
		      	  		aqiAvgLvl = "1";
		      	  	}
		      	  	
//		      	  	$("#aqiAvg").empty().text(aqiAvg);
//		      	  	$("#aqiAvg").removeClass().addClass("level" + aqiAvgLvl);
		      	  	
		      	  	hjzsPan.hideLoading();
		      	  	var hjzsPanOpt = {
		      	  			tooltip : {
		      	  				formatter: "{a} <br/>{b} : {c}"
				      	    },
				      	    toolbox: {
				      	        show : false,
				      	        feature : {
				      	            mark : {show: true},
				      	            restore : {show: true},
				      	            saveAsImage : {show: true}
				      	        }
				      	    },
				      	    series : [
				      	        {
				      	            name:'环境指数',
				      	            type:'gauge',
					      	        min:0,
					      	        max:500,
					      	        center : ['40%', '50%'],
					      	        radius: '60',
						      	    axisLine: {
						      	    	lineStyle: {
						      	    		width: 10,
						      	    		color: [
						                            [0.1, '#40C057'],
						                            [0.2, '#82C91E'],
						                            [0.3, '#F76707'],
						                            [0.4, '#E03131'],
						                            [0.6, '#841C3C'],
						                            [1, '#540822']
						                    ]
						      	    	}
						      	    },
						      	    splitLine: {
						      	    	show: false,
						                length: 19
						            },
						            axisTick: {
						            	show: false,
						            	length: 15
						            },
						            axisLabel: {
						            	show: false,
						            	fontSize: 5
						            },
				      	            detail : {formatter:'{value}'},
				      	            data:[{value: aqiAvg, name: '环境指数'}],
				      	            title: {
				      	  				show: false
				      	  			}
				      	       }
				      	    ]
		      	    };
		      	  	hjzsPan.setOption(hjzsPanOpt, true);
		      	  	
		      	  	$("#aqiAvgLvlName").empty().text(aqiAvgLvlName);
		      	  	$("#aqiAvgLvlName").removeClass().addClass("level" + aqiAvgLvl);
		      	  	
		      	  	$("#temAvg").empty().text(temAvg);
		      	  	$("#humAvg").empty().text(humAvg);
		      	  	
		      	  	//pm2.5相关赋值
//		      	  	var pm25AvgLvl = "1";
//		      	  	if (0 <= pm25Avg && 35 > pm25Avg) {
//		      	  		pm25AvgLvl = "1";
//		      	  	} else if (35 <= pm25Avg && 75 > pm25Avg) {
//		      	  		pm25AvgLvl = "2";
//		      	  	} else if (75 <= pm25Avg && 115 > pm25Avg) {
//		      	  		pm25AvgLvl = "3";
//		      	  	} else if (115 <= pm25Avg && 150 > pm25Avg) {
//		      	  		pm25AvgLvl = "4";
//		      	  	} else if (150 <= pm25Avg && 250 > pm25Avg) {
//		      	  		pm25AvgLvl = "5";
//		      	  	} else if (250 <= pm25Avg && 350 > pm25Avg) {
//		      	  		pm25AvgLvl = "6";
//		      	  	} 
		      	  	$("#pm25Avg").empty().text(pm25Avg);
//		      	  	$("#pm25Img").attr("src", BASE_URL + "images/welcome/pm25_" + pm25AvgLvl + ".png");
//		      	  	$("#pm25Lvl").removeClass().addClass("level" + pm25AvgLvl);
		      	  	
		      	  	//pm10相关赋值
//		      	  	var pm10AvgLvl = "1";
//		      	  	if (0 <= pm10Avg && 50 > pm10Avg) {
//		      	  		pm10AvgLvl = "1";
//		      	  	} else if (50 <= pm10Avg && 150 > pm10Avg) {
//		      	  		pm10AvgLvl = "2";
//		      	  	} else if (150 <= pm10Avg && 250 > pm10Avg) {
//		      	  		pm10AvgLvl = "3";
//		      	  	} else if (250 <= pm10Avg && 350 > pm10Avg) {
//		      	  		pm10AvgLvl = "4";
//		      	  	} else if (350 <= pm10Avg && 420 > pm10Avg) {
//		      	  		pm10AvgLvl = "5";
//		      	  	} else if (420 <= pm10Avg && 500 > pm10Avg) {
//		      	  		pm10AvgLvl = "6";
//		      	  	} 
		      	  	$("#pm10Avg").empty().text(pm10Avg);
//		      	  	$("#pm10Img").attr("src", BASE_URL + "images/welcome/pm10_" + pm10AvgLvl + ".png");
//		      	  	$("#pm10Lvl").removeClass().addClass("level" + pm10AvgLvl);
		      	  	
		      	  	//首要污染物
		      	  	$("#majorPoll").empty().text(parseInt(pm10Avg) > parseInt(pm25Avg) ? "PM10" : "PM2.5");
		      	  	
		      	  	//分别为 so2,co,o3,no2,recTime赋值
		      	  	$("#so2Avg").empty().text(so2Avg);
		      	  	$("#coAvg").empty().text(coAvg);
//		      	  	$("#o3Avg").empty().text(o3Avg);
		      	  	$("#no2Avg").empty().text(no2Avg);
		      	  	$(".hjRecime").empty().html("&nbsp;" + recTime);
		//      	  	console.log("aqiAvg:" + aqiAvg);
		//      	  	console.log("aqiAvgLvl:" + aqiAvgLvl);
		//      	  	console.log("temAvg:" + temAvg);
		//      	  	console.log("humAvg:" + humAvg);
		//      	  	console.log("pm25Avg:" + pm25Avg);
		//      	  	console.log("pm10Avg:" + pm10Avg);
		//      	  	console.log("so2Avg:" + so2Avg);
		//      	  	console.log("coAvg:" + coAvg);
		//      	  	console.log("o3Avg:" + o3Avg);
		//      	  	console.log("no2Avg:" + no2Avg);
		//     	  	console.log("recTime:" + recTime);
	    		} else {
	    			//当返回站点数据为空时，调整首要污染物字体样式
	    			$("#majorPoll").removeClass("has");
	    		}
	    	}
	    }
	});
	
	//查询最新的污染源检测站点位数据
	var tvocsAvg = "-";
	$.ajax({
		type: "post",
		url: BASE_URL + "epi/epistation/loadAllWryStationList",
		data: {"stationName": ""},
		success: function (retData){
			if (retData) {
				var staDetList = JSON.parse(retData.resultWryArrStr);
				if (staDetList && 0 < staDetList.length) {
					var ascStaList = _.sortBy(staDetList, function(num) {return parseInt(num.TVOCs);});
					var	totalTvocs = 0;
					_.map(ascStaList, function(tmpData, index) {
//						var curStaDet = (_.where(ascStaList, {"DEVICECODE": tmpData.SITECODE}))[0];
						totalTvocs += parseFloat(tmpData.TVOCs || 0);
						
						//为voc排名列表赋值
						$("#voc" + (index + 1) + "Name").empty().text(tmpData.DEVICECODE);
	     		  		$("#voc" + (index + 1) + "Name").attr("title", tmpData.DEVICECODE);
	     		  		$("#voc" + (index + 1) + "Val").empty().text(tmpData.TVOCs);
					});
					
					tvocsAvg = (totalTvocs/ascStaList.length).toFixed(2);
				}
				
				$("#tvocsAvg").empty().text(tvocsAvg);
			}
		}
	});
}


//-------------应急资源---------------------------------------------------------------
function yjzyCnt() {
	var yjzyChrt = window.allEchartsDic.get("yjzyChrt");
	if (!yjzyChrt) {
		yjzyChrt = echarts.init(document.getElementById("yjzyChrt"));
		window.allEchartsDic.put("yjzyChrt", yjzyChrt);
	} 
	
	yjzyChrt.showLoading({
	    text: '正在努力的读取数据中...',    //loading话术
	});
	
	$.ajax({
		type : 'post',
		url : BASE_URL + '/ems/emswelconme/loadResourceInfo',
		cache : false,
		data :{},
		dataType : 'json',
		global : false,
		success : function(retData) {
			if (retData) {
//				console.log(retData);
				var totalYjzy = (retData.data)[0] + (retData.data)[1] + 
								(retData.data)[2] + (retData.data)[3] + 
								(retData.data)[4] + (retData.data)[5] + 
								(retData.data)[6] + (retData.data)[7] +
								(retData.data)[8];
				//展示应急救援饼状图
				yjzyChrt.hideLoading();
            	var yjzyChrtOption = {
            			title: {
            				show: false,
            		        text: '应急资源',
            		        x: 90,
            		        y: 0,
            		        itemGap: 0,
            		        textStyle : {
//            		            color : 'rgba(30,144,255,0.8)',
            		            fontFamily : '微软雅黑',
            		            fontSize : 20,
            		            fontWeight : 'bolder'
            		        }
            		    },
            		    tooltip : {
            		        trigger: 'item',
            		        formatter: "{a} <br/>{b} : {c} ({d}%)"
            		    },
            		    legend: {
            		    	orient : 'vertical',
            		        x : 'right',
            		        y : 'center',
            		        itemGap: 32,
             		        itemWidth: 8,
             		        itemHeight: 8,
             		       	data: [
           		              {
           		                 "name": "应急机构", 
           		                 "color": "rgba(0,0,0,0.65)",
           		                 "icon": "circle"
           		              },
           		              {
           		            	  "name": "应急队伍", 
              		               	  "color": "rgba(0,0,0,0.65)", 
           		            	  "icon": "circle"
           		              },
           		              {
           		            	  "name": "应急专家", 
              		                   "color": "rgba(0,0,0,0.65)", 
           		            	  "icon": "circle"
           		              },
           		              {
           		            	  "name": "应急仓库", 
              		                   "color": "rgba(0,0,0,0.65)", 
           		            	  "icon": "circle"
           		              },
           		              {
           		            	  "name": "应急物资", 
              		                  "color": "rgba(0,0,0,0.65)", 
           		            	  "icon": "circle"
           		              },
           		              {
           		            	  "name": "医疗机构", 
              		                  "color": "rgba(0,0,0,0.65)", 
           		            	  "icon": "circle"
           		              },
           		              {
           		            	  "name": "避难场所", 
              		                  "color": "rgba(0,0,0,0.65)", 
           		            	  "icon": "circle"
           		              },
           		              {
           		            	  "name": "运输保障", 
           		            	  "color": "rgba(0,0,0,0.65)", 
           		            	  "icon": "circle"
           		              },
           		              {
           		            	  "name": "通信保障", 
           		            	  "color": "rgba(0,0,0,0.65)", 
           		            	  "icon": "circle"
           		              }
           		            ],
            		        formatter: function(name) {
            		        	var curPer = "", curCnt = "";
            		        	if (0 == totalYjzy) {
            		        		curCnt = "0";
            		        		curPer = "0";
            		        	} else {
            		        		if ("应急机构" == name) {
            		        			curCnt = (retData.data)[0];
            		        			curPer = (((retData.data)[0] / totalYjzy) * 100).toFixed(0);
            		        		} else if ("应急队伍" == name) {
            		        			curCnt = (retData.data)[1];
            		        			curPer = (((retData.data)[1] / totalYjzy) * 100).toFixed(0);
            		        		} else if ("应急专家" == name) {
            		        			curCnt = (retData.data)[2];
            		        			curPer = (((retData.data)[2] / totalYjzy) * 100).toFixed(0);
            		        		} else if ("应急仓库" == name) {
            		        			curCnt = (retData.data)[3];
            		        			curPer = (((retData.data)[3] / totalYjzy) * 100).toFixed(0);
            		        		} else if ("应急物资" == name) {
            		        			curCnt = (retData.data)[4];
            		        			curPer = (((retData.data)[4] / totalYjzy) * 100).toFixed(0);
            		        		} else if ("医疗机构" == name) {
            		        			curCnt = (retData.data)[5];
            		        			curPer = (((retData.data)[5] / totalYjzy) * 100).toFixed(0);
            		        		} else if ("避难场所" == name) {
            		        			curCnt = (retData.data)[6];
            		        			curPer = (((retData.data)[6] / totalYjzy) * 100).toFixed(0);
            		        		}  else if ("运输保障" == name) {
            		        			curCnt = (retData.data)[7];
            		        			curPer = (((retData.data)[7] / totalYjzy) * 100).toFixed(0);
            		        		}  else if ("通信保障" == name) {
            		        			curCnt = (retData.data)[8];
            		        			curPer = (((retData.data)[8] / totalYjzy) * 100).toFixed(0);
            		        		} 
            		        	}
            		        	
            		        	return name + " " + curCnt + " | " + curPer + "%";
            		        }
            		    },
            		    toolbox: {
            		    	 show : false,
            		         feature : {
            		             mark : {show: true},
            		             dataView : {show: true, readOnly: false},
            		             magicType : {
            		                 show: true, 
            		                 type: ['pie', 'funnel']
            		             },
            		             restore : {show: true},
            		             saveAsImage : {show: true}
            		         }
            		    },
            		    calculable : true,
            		    series : [
            		        {
            		            name:'应急资源分布图',
            		            type:'pie',
            		            center : ['20%', '50%'],
            		            radius : [40, 77],
            		            roseType : 'area',
            		            itemStyle : {
            		                normal : {
            		                    label : {
            		                        show : false,
//            		                        position: 'top',
            		                        formatter: '{b} : {d}%'
            		                    },
            		                    labelLine : {
            		                        show : false
            		                    },
            		                    color: function(params) {
            	                        	var tgtColor = "";
            	                        	if ("应急机构" == params.name) {
            	                        		tgtColor = "#FF3726";
            	                        	} else if ("应急队伍" == params.name) {
            	                        		tgtColor = "#E200FF";
            	                        	} else if ("应急专家" == params.name) {
            	                        		tgtColor = "#13C2C2";
            	                        	} else if ("应急仓库" == params.name) {
            	                        		tgtColor = "#F8E71C";
            	                        	}  else if ("应急物资" == params.name) {
            	                        		tgtColor = "#F5A623";
            	                        	}  else if ("医疗机构" == params.name) {
            	                        		tgtColor = "#F04864";
            	                        	}  else if ("避难场所" == params.name) {
            	                        		tgtColor = "#2FC25B";
            	                        	}  else if ("运输保障" == params.name) {
            	                        		tgtColor = "#8543E0";
            	                        	}  else if ("通信保障" == params.name) {
            	                        		tgtColor = "#1890FF";
            	                        	}
//            	                        	alert(JSON.stringify(params));
            	                            return tgtColor;
            	                        }
            		                },
            		                emphasis : {
            		                    label : {
            		                        show : false,
//            		                        position : 'center',
            		                        textStyle : {
            		                            fontSize : '12'
//            		                            fontWeight : 'bold'
            		                        }
            		                    },
            		                    labelLine : {
            		                        show : false,
            		                        lineStyle: {
            		                        }
            		                    }
            		                }
            		            },
            		            data: [
            		                {value:(retData.data)[0] , name:'应急机构'},
            		                {value:(retData.data)[1], name:'应急队伍'},
            		                {value:(retData.data)[2], name:'应急专家'},
            		                {value:(retData.data)[3], name:'应急仓库'},
            		                {value:(retData.data)[4], name:'应急物资'},
            		                {value:(retData.data)[5], name:'医疗机构'},
            		                {value:(retData.data)[6], name:'避难场所'},
            		                {value:(retData.data)[7], name:'运输保障'},
            		                {value:(retData.data)[8], name:'通信保障'}
            		            ]
            		        }
            		    ]
            	};
            	
            	yjzyChrt.setOption(yjzyChrtOption, true);
            	
            	$(window).resize(function() {
            		yjzyChrt.resize();
				});
			}
		}
	});
}


//-------------应急政府/企业预案---------------------------------------------------------------
function yjyaCnt(type) {
	var zfyjyaChrt = null;
	if ("zf" == type) {
		//当前是政府预案时
		var zfyjyaChrt = window.allEchartsDic.get("zfyjyaChrt");
		if (!zfyjyaChrt) {
			zfyjyaChrt = echarts.init(document.getElementById("zfyjyaChrt"));
			window.allEchartsDic.put("zfyjyaChrt", zfyjyaChrt);
		} 
		
		zfyjyaChrt.showLoading({
			text: '正在努力的读取数据中...',    //loading话术
		});
	} 
	
	$.ajax({
		type : 'post',
		url : BASE_URL + 'ems/emswelconme/loadPlanInfo',
		cache : false,
		data : {},
		dataType : 'json',
		global : false,
		success : function(retData) {
			if (retData) {
				//综合预案
//				var comprehensivePlan = new Array();
//				comprehensivePlan.push(data.govplan1);
//				comprehensivePlan.push(data.entplan1);
				
				//专项预案
//				var specialPlan = new Array();
//				specialPlan.push(data.govplan2);
//				specialPlan.push(data.entplan2);
				
				//应急处置预案
//				var emergencyResPlan = new Array();
//				emergencyResPlan.push(data.govplan3);
//				emergencyResPlan.push(data.entplan3);
			
//				var govCount = data.govplan1 + data.govplan2 + data.govplan3;
//				var entCount = data.entplan1 + data.entplan2 + data.entplan3;
//				$("#govPlanCount").html("<a href='javascript:void(0);' style='font-size: 24px;color: #4990E2;' onclick='displayEmsInfo(1)'>"+govCount+"</a>");
//				$("#entPlanCount").html("<a href='javascript:void(0);' style='font-size: 24px;color: #7DBA3A;' onclick='displayEmsInfo(2)'>"+entCount+"</a>");
				if ("zf" == type) {
					$("#zfzhyaCnt").empty().text(retData.govplan1);
					$("#zfzxyaCnt").empty().text(retData.govplan2);
					$("#zfyjyaCnt").empty().text(retData.govplan3);
					
					var yaChrtXData = [];
					yaChrtXData.push(retData.govplan1);
					yaChrtXData.push(retData.govplan2);
					yaChrtXData.push(retData.govplan3);
					
					zfyjyaChrt.hideLoading();
					var zfyjyaChrtOpt = {
	            		    tooltip : {
	            		        trigger: 'axis',
	            		        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
	            		            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
	            		        }
	            		    },
	            		    legend: {
	            		    	show: false,
	            		    	orient: 'vertical',
	             		        x: 'right',
	             		        y: 'center',
	             		        itemGap:16,
	             		        itemWidth: 8,
	             		        itemHeight: 8,
	            		        data:[{
           		                 "name": "政府预案个数", 
        		                 "color": "rgba(0,0,0,0.65)",
        		                 "icon": "circle"
	            		        }]
	            		    },
	            		    toolbox: {
	            		        show : false,
	            		        orient: 'vertical',
	            		        x: 'right',
	            		        y: 'middle'
//	            		        feature : {
//	            		            mark : {show: true},
//	            		            dataView : {show: true, readOnly: false},
//	            		            magicType : {show: true, type: ['line', 'bar', 'stack', 'tiled']},
//	            		            restore : {show: true},
//	            		            saveAsImage : {show: true}
//	            		        }
	            		    },
	            		    grid: {
	            		    	x: 30,
	            		    	x2: 30,
	            		    	y: 10,
	            		    	y2: 20
	            		    },
	            		    calculable : true,
	            		    xAxis : [
	            		        {
	            		            type : 'category',
	            		            data : ['综合预案', '专项预案', '应急预案'],
	            		            axisLine: {
	            		            	show: true,
	            		            	lineStyle: {
	            		            		color: ['#ddd'],
	            		            	    width: 2
	            		            	}
	            		            },
	            		            axisTick: {
	            		            	show: false
	            		            },
	            		            splitLine: {
	            		            	show: false
	            		            }
	            		        }
	            		    ],
	            		    yAxis : [
	            		        {
	            		            type : 'value',
	            		            axisLine: {
	            		            	show: false
	            		            },
	            		            axisTick: {
	            		            	show: false
	            		            },
	            		            splitLine: {
	            		            	show: true,
	            		            	lineStyle: {
	            		            		color: ['rgba(0,0,0,0.10)'],
	            		            	    width: 1,
	            		            	    type: 'dashed'
	            		            	}
	            		            },
	            		            axisLabel: {
	            		            	textStyle: {
	            		            		color: 'rgba(0,0,0,0.65)'
	            		            	}
	            		            }
	            		        }
	            		    ],
	            		    series : [
	            		        {
	            		            name:'政府预案个数',
	            		            type:'bar',
	            		            barWidth: 40,
	            		            itemStyle: {
	            	                    normal: {
	            	                        color: function(params) {
	            	                        	var tgtColor = "";
	            	                        	if ("综合预案" == params.name) {
	            	                        		tgtColor = "#52C41A";
	            	                        	} else if ("专项预案" == params.name) {
	            	                        		tgtColor = "#1890FF";
	            	                        	} else if ("应急预案" == params.name) {
	            	                        		tgtColor = "#F5222D";
	            	                        	}
//	            	                        	alert(JSON.stringify(params));
	            	                            return tgtColor;
	            	                        }
	            	                    }
	            		            },
	            		            data: yaChrtXData
	            		        }
	            		    ]
	            	};
					zfyjyaChrt.setOption(zfyjyaChrtOpt, true);
					
					$(window).resize(function() {
						zfyjyaChrt.resize();
					});
				} else {
					$("#qyzhyaCnt").empty().text(retData.entplan1);
					$("#qyzxyaCnt").empty().text(retData.entplan2);
					$("#qyyjyaCnt").empty().text(retData.entplan3);
					
					//查询所有企业各类预案列表
					$.ajax({
						type : 'post',
						url : BASE_URL + '/ems/emswelconme/loadEntPlanList',
						cache : false,
						data :{},
						dataType : 'json',
						global : false,
						success : function(retData) {
							if (retData) {
								var retDataLen = retData.length,
									$tbody = $(".yjyaTable").find("tbody");
								$tbody.empty();
								if (0 < retDataLen) {
									var appDom = "";
									
									//遍历生成企业列表
									for(var index in retData) {
										//最多取前三个
										if (3 == index) {
											break;
										}
										
										appDom += "<tr>" + 
			                                "<td>" + 
			                                "    <span>" + (parseInt(index) + 1) + "</span>" + 
			                                "</td>" + 
			                                "<td title='" + retData[index].ENTNAME + "'>" + retData[index].ENTNAME + "</td>" + 
			                                "<td>|</td>" + 
			                                "<td>" + 
			                                "    <a href='#' onclick='showQyYaWinByParam(\"" + retData[index].BUSINESSINFOID + "\", \"1\");'>" + retData[index].ZHYACNT + "</a>" + 
			                                "</td>" + 
			                                "<td>|</td>" + 
			                                "<td>" + 
			                                "    <a href='#' onclick='showQyYaWinByParam(\"" + retData[index].BUSINESSINFOID + "\", \"2\");'>" + retData[index].ZXYACNT + "</a>" + 
			                                "</td>" + 
			                                "<td>|</td>" + 
			                                "<td>" + 
			                                "    <a href='#' onclick='showQyYaWinByParam(\"" + retData[index].BUSINESSINFOID + "\", \"3\");'>" + retData[index].YJYACNT + "</a>" + 
			                                "</td>" + 
			                                "<td>|</td>" + 
			                                "</tr>";
									}
									$tbody.html(appDom);
								}
							}
						}
					});
				}
			}
		},
		error : function() {
			parent.toast("初始化信息加载失败!");
		}
	});
}

/**
 * 政府综合预案弹窗
 */
function showZfzhyaWin() {
	//政府综合预案
	parent.openWin(BASE_URL + "ems/emsplaplaninfo/1/GOV_YJGL_YJYA_ZFYA?yaType=1","政府综合预案", "80%", "80%");
}

/**
 * 政府专项预案
 */
function showZfzxyaWin() {
	//政府专项预案
	parent.openWin(BASE_URL + "ems/emsplaplaninfo/1/GOV_YJGL_YJYA_ZFYA?yaType=2","政府专项预案", "80%", "80%");
}

/**
 * 政府应急预案
 */
function showZfyjyaWin() {
	//政府应急预案
	parent.openWin(BASE_URL + "ems/emsplaplaninfo/1/GOV_YJGL_YJYA_ZFYA?yaType=3","政府应急预案", "80%", "80%");
}

/**
 * 企业综合预案
 */
function showQyzhyaWin() {
	//企业综合预案
	parent.openWin(BASE_URL + "ems/emsplaplaninfo/2/GOV_YJGL_YJYA_QYYA?yaType=1","企业综合预案", "80%", "80%");
}

/**
 * 企业专项预案
 */
function showQyzxyaWin() {
	//企业专项预案
	parent.openWin(BASE_URL + "ems/emsplaplaninfo/2/GOV_YJGL_YJYA_QYYA?yaType=2","企业专项预案", "80%", "80%");
}

/**
 * 企业应急预案
 */
function showQyyjyaWin() {
	//企业应急预案
	parent.openWin(BASE_URL + "ems/emsplaplaninfo/2/GOV_YJGL_YJYA_QYYA?yaType=3","企业应急预案", "80%", "80%");
}

/**
 * 根据企业ID和预案类型分别查询各预案分类列表弹窗
 */
function showQyYaWinByParam(entId, yaType) {
	if ("1" == yaType) {
		parent.openWin(BASE_URL + "ems/emsplaplaninfo/2/GOV_YJGL_YJYA_QYYA?yaType=1&businessinfoId=" + entId, "企业综合预案", "80%", "80%");
	} else if ("2" == yaType) {
		parent.openWin(BASE_URL + "ems/emsplaplaninfo/2/GOV_YJGL_YJYA_QYYA?yaType=2&businessinfoId=" + entId, "企业专项预案", "80%", "80%");
	} else if ("3" == yaType) {
		parent.openWin(BASE_URL + "ems/emsplaplaninfo/2/GOV_YJGL_YJYA_QYYA?yaType=3&businessinfoId=" + entId, "企业应急预案", "80%", "80%");
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
    var strData = accMul(data,100).toFixed(0);
    var ret = strData.toString() + "%";
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