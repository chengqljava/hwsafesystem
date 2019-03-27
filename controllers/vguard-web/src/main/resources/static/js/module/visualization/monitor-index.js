var bid="";
var fid="";
$(function() {
	scrollResize();
	var selectedList = [ 'fx', 'xg', 'sp', 'ts' ];
	// getBUildInfo();
	var i =0;
	// getVideoInfo('','');
	getDangerAreaInfo('','');
	// 图片缩放拖动
	$('#factory_area').imgZoomAndDrog();
	$('body').on('click', '.yhKind li', function() {
		var $id = $(this).attr('data-id');
		$('.yhKind li').removeClass('active');
		$(this).addClass('active');
		$('.yhKindCount').removeClass('active');
		$('.yhKindCount.' + $id).addClass('active');

	});
	//  楼栋点击事件
	$('body').on('click', '.buildingMark', function() {
		var $id = $(this).data('id');
		loadFloorInfo($id);
		$('.buildContent').fadeOut(500);
		if($(this).attr('data-state') == 1){
			$(this).find('.buildContent').fadeOut(500);
			$(this).attr('data-state',0);
		}
		else{
			$(this).find('.buildContent').fadeIn(500);
			$('.buildingMark').attr('data-state',0);
			$(this).attr('data-state',1);
		}
	})
	
	// 楼层点击
	$('body').on('click','.buildInfo li',function(e){
		var bid = $(this).data('bid');
		var fid = $(this).data('fid');
		var fname = $(this).data('fname');
		$('#floorIframe').attr('src','./floor_1.html?fid='+fid+'&fname='+fname+'&bid='+bid).show();
		$(this).parent().parent().fadeOut(500).attr('data-state',0);
	});
//	楼栋选中特效
	$('body').on('mouseenter', '.buildingMark', function() {
		var $id = $(this).data('id');
		$('.build'+$id).show();
	})
	$('body').on('mouseleave', '.buildingMark', function() {
		var $id = $(this).data('id');
		$('.build'+$id).hide();
	})
// 标题滚动
  $('#nextBtn').click(function(){
    var width =parseInt( $('.headerContent').width());
    var contentwidth =parseInt( $('.contentDiv').width());
    var left =parseInt( $('.contentDiv').css('left'));
    if(left - width < -(contentwidth - width)){
      left = -(contentwidth - width)
    }
    else{
      left = left - width;
    }
    $('.contentDiv').css({'left':left});
  })
  $('#preBtn').click(function(){
    var left =parseInt( $('.contentDiv').css('left'));
    var width =parseInt( $('.headerContent').width());
    if(left + width > 0){
      left = 0;
    }
    else{
      left = left + width;
    }
    $('.contentDiv').css({'left':left});
  })
	// 折叠按钮
	$('.menu').on('click', '.close', function() {
		var $id = $(this).data('id');
		var $state = $(this).data('state');
		if ($state == '1') {
			$('.menu_' + $id).animate({
				left : -300
			});
			$('.header').css({
				width : 'calc( 100% - 32px )'
			}).animate({
				left : 16,
			});
			$(this).find('span').html('>')
			$(this).data('state', '0');
		} else {
			$('.menu_' + $id).animate({
				left : 0
			});
			$('.header').animate({
				left : 316,
			}).css({
				width : 'calc( 100% - 332px )'
			})
			$(this).find('span').html('<')
			$(this).data('state', '1');
		}
		var width =parseInt( $('.headerContent').width());
	    var Cwidth =parseInt( $('.contentDiv').width());
	    if( Cwidth < width){
	      $('#preBtn').hide();
	      $('#nextBtn').hide();
	      $('.contentDiv').css('left',0);
	    }
	    else {
	    	$('#preBtn').show();
		    $('#nextBtn').show();
		    $('.contentDiv').css('left',0);
	    }
	})

	//  
	$('body').on('click', '.Allselected .single_menu', function() {
		var isMore = $('#isMore').is(':checked');
		var $id = $(this).attr('data-id');
		if (isMore) {
			$(this).toggleClass('active');
			var $this = this;
			if ($($this).hasClass('active')) {
				selectedList.push($id);
			} else {
				selectedList.forEach(function(item, index) {
					if (item == $id) {
						selectedList.splice(index, 1);
					}
				})
			}
		} else {
			$('.Allselected .single_menu').removeClass('active');
			$(this).addClass('active');
			selectedList.splice(0, selectedList.length, $id);
		}
//		console.log(selectedList);
		// selectedList（array） 包含选中的点位类型，
		// 在这里调用加载不同点位的方法；
		$('.ts').hide();
	    $('.xg').hide();
	    $('.fx').hide();
	    $('.sp').hide();
	    selectedList.forEach(function(item){
	    	$('.'+item).show();
	    });
	});
  //视频统计图表
  	// var spChart = echarts.init(document.getElementById('sp_echarts'));
  	// loadVideoCount(spChart);
	// 加载隐患数据
	initHidDangerInfo()
	//加载隐患列表
	loadHidList();
})

/**
 * 加载隐患数据
 */
function loadHidList(){
	$.ajax({
		type : 'post',
		url : BASE_URL + 'hidden/hidcount/getKSHHidList',
		cache : false,
		data : {},
		dataType : 'json',
		global : false,
		success : function(data) {
			$(".hiddenList").empty();
			var arr = data.hidlist;
			if (arr.length > 0) {
				$.each(arr,function(index,item){
					var stateObj = getHidStateClass(item.HIDDENDANGERSTATE);
					$(".hiddenList").append('<div class="hiddenListTitle hiddenListContent" >'+
			          	'<div>'+(index+1)+'</div>'+
			          	'<div title="'+(item.HIDDENDANGERNAME==null?'--':item.HIDDENDANGERNAME)+'">'+(item.HIDDENDANGERNAME==null?'--':item.HIDDENDANGERNAME)+'</div>'+
			          	'<div>'+(item.HIDDENDANGERLEVEL=='1'?'一般':'重大')+'</div>'+
			          	'<div class="'+stateObj.className+'">'+stateObj.hidState+'</div>'+
			          	'</div>');
				});
				$(".hiddenList").niceScroll({
					cursorborder: "#4d86d6",
					cursorcolor: "#4d86d6",
					background: false,
					horizrailenabled: false,
					autohidemode: false
				}).show().resize();
			}else{
				$(".hiddenList").append('<div class="hiddenListTitle hiddenListContent" ><span>暂无数据!</span></div>');
			}
		}
	});
}

function getHidStateClass(state){
	var obj = {
		hidState:'',
		className:''
	};
	switch (state) {
	case '2':
		obj.hidState = '待确认';
		obj.className = 'dqr';
		break;
	case '3':
		obj.hidState = '待整改';
		obj.className = 'dzg';
		break;
	case '4':
		obj.hidState = '待复查';
		obj.className = 'dfc';
		break;
	case '5':
		obj.hidState = '待核销';
		obj.className = 'dhx';
		break;
	case '6':
		obj.hidState = '已核销';
		obj.className = 'yhx';
		break;
	}
	return obj;
}

function loadVideoCount(spChart){
	$.ajax({
		type : 'post',
		url : BASE_URL + 'monitor/macvideo/loadVideoCount',
		cache : false,
		data : {
			bid:bid
		},
		dataType : 'json',
		global : false,
		success : function(data) {
			console.log(data);
			var spOption = {
			    tooltip : {
			      trigger : 'item',
			      formatter : "{a} <br/>{b} : {c} ({d}%)"
			    },
			    legend : {
			      show : false,
			      x : 'center',
			      y : 'bottom',
			    },
			    calculable : true,
			    series : [ 
			      {
			        name : '摄像头数量',
			        type : 'pie',
			        radius : [ 20, 60 ],
			        center : [ '50%', '50%' ],
			        roseType : 'radius',
			        label : {
			          normal : {
			            show : true
			          },
			          emphasis : {
			            show : true
			          }
			        },
			        lableLine : {
			          normal : {
			            show : true
			          },
			          emphasis : {
			            show : true
			          }
			        },
			        data : data.count,
			      } 
			    ],
			    color : [ '#BFD52A', '#05A848', '#059F85', '#01A2D8',
			        '#0078C7', '#1E3197', '#881F88', '#D50584',
			        '#E60355', '#E60817', '#F19704', '#FCC900',
			        '#81BE3C', '#019E5B', '#00A2AD' ]
			  };
			  spChart.setOption(spOption);
		}
	});
}

/**
 *获取楼栋统计信息
 */
function loadFloorInfo(bid){
	$.ajax({
		type : 'post',
		url : BASE_URL + '/monitor/publicbuildingfloor/floorInfos',
		cache : false,
		data : {
			bid:bid
		},
		dataType : 'json',
		global : false,
		success : function(data) {
			if (data) {
				var emm;
				if (bid == 1) {
					emm='building1Info';
				}else if(bid == 2){
					emm='building2Info';
				}else if(bid == 3){
					emm='building3Info';
				}else if(bid == 4){
					emm='building4Info';
				}
				console.log(emm);
				$('#'+emm).empty();
				$.each(data.floorInfos,function(index,obj){
					$('#'+emm).append('<li data-fid="'+obj.FID+'" data-bid="'+bid+'" data-fname="'+obj.FLOORNUM+'">'+
							'<div>'+obj.FLOORNUM+'</div>'+
							'<div>'+obj.HIDCOUNT+'</div>'+
							'<div>'+obj.RSKCOUNT+'</div>'+
							'<div>'+obj.VIDEOCOUNT+'</div>'+
						'</li>');
				});
				
				$(".buildInfo").niceScroll({
					cursorborder: "#4d86d6",
					cursorcolor: "#4d86d6",
					background: false,
					horizrailenabled: false,
					autohidemode: false
				}).show().resize();
			}
		},
		error : function() {
			parent.toast("初始化信息加载失败!");
		}
	});
}

/**
 * 初始化隐患数据
 * 
 */
function initHidDangerInfo() {
	$.ajax({
		type : 'post',
		url : BASE_URL + 'hid/welcome/loadDangerCount',
		cache : false,
		data : {},
		dataType : 'json',
		global : false,
		success : function(data) {
			if (data) {
				$("#yhCount").text(data.YXYHCOUNT==null?0:data.YXYHCOUNT);
				$("#ybyhCount").text(data.YBYH==null?0:data.YBYH);
				$("#zdyhCount").text(data.ZDYH==null?0:data.ZDYH);
				//一般隐患
				$("#ybyhWqr").text(data.YBDQRYH==null?0:data.YBDQRYH);
				$("#ybyhWzg").text(data.YBDZGYH==null?0:data.YBDZGYH);
				$("#ybyhWfc").text(data.YBDFXYH==null?0:data.YBDFXYH);
				$("#ybyhWhx").text(data.YBDHXYH==null?0:data.YBDHXYH);
				$("#ybyhYhx").text(data.YBYHXYH==null?0:data.YBYHXYH);
				//重大隐患
				$("#zdyhWqr").text(data.ZDDQRYH==null?0:data.ZDDQRYH);
				$("#zdyhWzg").text(data.ZDDZGYH==null?0:data.ZDDZGYH);
				$("#zdyhWfc").text(data.ZDDFXYH==null?0:data.ZDDFXYH);
				$("#zdyhWhx").text(data.ZDDHXYH==null?0:data.ZDDHXYH);
				$("#zdyhYhx").text(data.ZDYHXYH==null?0:data.ZDYHXYH);
				if(data.YXYHCOUNT > 0){
					$('.yh_logo').addClass('bonce');
				}
			}
		},
		error : function() {
			parent.toast("初始化信息加载失败!");
		}
	});

}
/**
 * 显示隐患列表
 * @param hidlevel 'ybyh'一般隐患  'zdyh'重大隐患 
 */
function showHidInfo(hidlevel,hidstate){
	parent.openWin(BASE_URL+"/views/module/visualization/HiddendangerList.html?hidlevel="+hidlevel+"&hidstate="+hidstate,'当月隐患信息','60%','60%');
}
/**
 * 风险统计
 * 
 * @param categories
 * @param values
 */
function initDssInfo() {
	$.ajax({
		type : 'post',
		url : BASE_URL + 'ent/welcome/dsscount',
		cache : false,
		data : {},
		dataType : 'json',
		global : false,
		success : function(data) {
			if (data) {
				var dssRiskCharts = data.dssRiskChart;
				var classValue1 = [];
				var n = 0;
				for ( var key in dssRiskCharts) {
//					console.log("属性：" + key + ",值：" + dssRiskCharts[key]);
					if (key == "重大风险") {
						n = 0;
						$("#zdfxcount").text(dssRiskCharts[key]);
					} else if (key == "较大风险") {
						n = 1;
						$("#jdfxcount").text(dssRiskCharts[key]);
					} else if (key == "一般风险") {
						n = 2;
						$("#ybfxcount").text(dssRiskCharts[key]);
					} else if (key == "低风险") {
						n = 3;
						$("#dfxcount").text(dssRiskCharts[key]);
					}
					classValue1[n] = {
						value : dssRiskCharts[key],
						name : key
					};
					// n = n+1;
				}
				// var dssEventCharts = data.dssEventChart;
				/*
				 * var classValue2 = []; $.each(dssEventCharts, function (i,
				 * dssEventChart) { classValue2[i] = {value:
				 * dssEventChart.RESNUM, name: dssEventChart.RSKDICVALUE}; });
				 */
				initDssRecord(classValue1);
			}
		}
	});
}
function initDssRecord(classValue1) {
//	console.log(classValue1);
	var wxyChart = echarts.init(document.getElementById('wxy_echarts'));
	wxyOption = {
		tooltip : {
			trigger : 'axis',
			axisPointer : {
				type : 'shadow'
			}
		},
		toolbox : {
			show : false,
			orient : 'vertical',
			x : 'right',
			y : 'middle'
		},
		calculable : true,
		grid : {
			x : 20,
			x2 : 20,
			y : 20,
			y2 : 20
		},
		xAxis : [ {
			type : 'category',
			data : [ '重大风险', '较大风险', '一般风险', '低风险' ],
			axisLine : {
				show : true,
				lineStyle : {
					color : [ '#ddd' ],
					width : 2
				}
			},
			axisTick : {
				show : false
			},
			splitLine : {
				show : false
			},
			axisLabel : {
				interval: '0',
				textStyle : {
					color : 'rgba(0,0,0,0.65)'
				}
			}
		} ],
		yAxis : [ {
			type : 'value',
			axisLine : {
				show : false
			},
			axisTick : {
				show : false
			},
			splitLine : {
				show : true,
				lineStyle : {
					color : [ 'rgba(0,0,0,0.10)' ],
					width : 1,
					type : 'dashed'
				}
			},
			axisLabel : {
				textStyle : {
					color : 'rgba(0,0,0,0.65)'
				}
			}
		} ],
		series : [ {
			name : '风险数量',
			type : 'bar',
			barWidth : '50%',
			data : classValue1,
			itemStyle : {
				normal : {
					color : function(params) {
						var tgtColor = "";
						if ("重大风险" == params.name) {
							tgtColor = "#F5222D";
						} else if ("较大风险" == params.name) {
							tgtColor = "#FAAD14";
						} else if ("一般风险" == params.name) {
							tgtColor = "#FFD700";
						} else if ("低风险" == params.name) {
							tgtColor = "#1890FF";
						}
						return tgtColor;
					}
				}
			},
			label : {
				normal : {
					show : true,
					position : 'top',
					formatter : '{c} '
				},
				emphasis : {
					show : true,
					textStyle : {
						color : '#666666',
						fontSize : '11',
						fontWeight : 'bold'
					}
				}
			}
		} ]
	};
	wxyChart.setOption(wxyOption);
}
function showDssInfo(riskrating) {
	parent
			.openWin(
					BASE_URL
							+ "views/module/dangersource/dssrskrecord/dssrskCountList.html?riskrating="
							+ riskrating, "风险列表", "60%", "70%");
}


/**
 * 获取楼栋信息
 * @returns
 */
function getBUildInfo(){
	$.ajax({
		type : 'post',
		url : BASE_URL + 'monitor/publicbuildinginfo/loadBuildImg',
		cache : false,
		data : {},
		dataType : 'json',
		global : false,
		success : function(data) {
			$('#factory_area').children('.buildingMark').remove();
			var appDom = '';
			data.buildings.forEach(function(item){
				appDom +='<div title="点击查看楼层信息" style="left:'+item.left+'%;top:'+item.top+'%;" class="buildingMark" id="building'+item.bid+'" data-id="'+item.bid+'">'+
					"<div class='buildContent'>"+
					  "<div style='text-align: center;color: #000;font-size: 16px;line-height: 32px;border-bottom: 1px solid rgba(0, 0, 0, 0.09);font-weight:700;letter-spacing: 1px;'>"+item.bid+"栋楼层导览</div>"+
			          "<ul>"+
			            "<li>"+
			              "<div><img src='../../../../images/module/monitor/monitor-index/icon_xiao_lc.png'></div>"+
			              "<div><img src='../../../../images/module/monitor/monitor-index/icon_xiao_yh.png'></div>"+
			              "<div><img src='../../../../images/module/monitor/monitor-index/icon_xiao_fx.png'></div>"+
			             " <div><img src='../../../../images/module/monitor/monitor-index/icon_xiao_sp.png'></div>"+
			           " </li>"+
			          "</ul>"+
			         " <ul class='buildInfo' id='building"+item.bid+"Info'>"+
			        "  </ul>"+
			        "</div>"+
		        "</div>"
			});
			$('#factory_area').append(appDom);
		}
	})
}

/**
 * 获取视频信息
 * fid 楼层id,bid 楼栋id
 * 为空获取园区外部视频
 * @returns
 */
function getVideoInfo(bid,fid){
	$.ajax({
		type : 'post',
		url : BASE_URL + 'monitor/macvideo/loadVideos',
		cache : false,
		data : {
			fid:fid,
			bid:bid
		},
		dataType : 'json',
		global : false,
		success : function(data) {
			$('#factory_area').children('.PointSp').remove();
			var appDom = '';
			console.log(data);
			data.videos.forEach(function(item){
				appDom +='<div onclick="showVideo(\''+item.videoid+'\',\''+item.videoname+'\')" style="left:calc( '+(item.left?item.left:50)+'% - 30px );top:calc( '+(item.top?item.top:50)+'% - 80px );" class="PointSp point sp" data-top="'+item.top+'" data-left="'+item.left+'">'+
		        "<div id='spName'>"+item.videoname+"</div>"+
		        "<div class='spDiv'></div>"+
		      "</div>"
			});
			console.log(appDom);
			$('#factory_area').append(appDom);
			console.log($('#factory_area').html());
		}
	})
}

function showVideo(id,name) {
	openWin(BASE_URL+'views/module/monitor/monitorpage/monitorVideo.html?videoid='+id,name,'70%','80%');
}
/**
 * 获取风险区域信息
 * fid 楼层id,bid 楼栋id
 * 为空获取园区外部区域
 * @returns
 */
function getDangerAreaInfo(bid,fid){
	$.ajax({
		type : 'post',
		url : BASE_URL + '/dangersource/dssrskrecord/loadRskArea',
		cache : false,
		data : {
			fid:fid,
			bid:bid
		},
		dataType : 'json',
		global : false,
		success : function(data) {
			console.log(data);
			$('#factory_area').children('.areaDiv').remove();
			var appDom = '';
			console.log(data.rskplaces);
			var FAwidth = $('#factory_area').width();
			var FAheight = $('#factory_area').height();
			var ids =[];
			data.rskplaces.forEach(function(item){
				if(ids.indexOf(item.PLACEAREAID) == -1){
					ids.push(item.PLACEAREAID)
				}
			})
			var datass = [];
			data.rskplaces.forEach(function(item){
				item.RISKNUM = 1;
				switch(item.RISKRATING){
				case'重大风险':
					item.RISKNUM = 4;
					break;
				case'较大风险':
					item.RISKNUM = 3;
					break;
				case'一般风险':
					item.RISKNUM = 2;
					break;
				}
			})
			ids.forEach(function(a){
				var datas = [];
				data.rskplaces.forEach(function(b){
					if(b.PLACEAREAID ==a){
						datas.push(b);
					}
				})
				var max =1;
				datas.forEach(function(item){
					if(item.RISKNUM >max){
						max = item.RISKNUM;
					}
				})
				datas.forEach(function(c){
					if( c.RISKNUM == max){
						datass.push(c);
					};
				})
			})
			datass.forEach(function(item){
				if(item.AREALEFT == null){
					item.AREALEFT = 50;
				}
				if(item.AREATOP == null){
					item.AREATOP = 50;
				}
				var fillColor = 'rgba(24,144,255,1.2)';
				var strokeFillColor = '#1890FF';
				switch(item.RISKRATING){
				case'重大风险':
					fillColor = 'rgba(245,34,45,1.20)';
					strokeFillColor = '#F5222D';
					break;
				case'较大风险':
					fillColor = 'rgba(250,140,22,1.20)';
					strokeFillColor = '#FA8C16';
					break;
				case'一般风险':
					fillColor = 'rgba(250,219,20,1.20)';
					strokeFillColor = '#FADB14';
					break;
				}
				item.POINTS?'':item.POINTS = '0,0 0,10 10,10 10,0';
				var allPoint = [];
				item.POINTS.split(' ').forEach(function(item){
	           	 	var arr = item.split(',');
	           	 	allPoint = allPoint.concat(arr);
	            });
	            var allpoints = [];
	            allPoint.forEach(function(item,index){
	            	if(index%2 == 0){
	            		allpoints.push(item*FAwidth/100);            		
	            	}
	            	else{
	            		allpoints.push(item*FAheight/100);
	            	}
	            });
	            console.log(allpoints);
	            
				appDom += "<div onclick='loadDssList(this)' class='areaDiv fx' data-id='"+item.PLACEAREAID+"' data-name='"+item.PLACEAREANAME+"' style='left:"+item.AREALEFT+"%;top:"+item.AREATOP+"%;'>"+
				"<div style='font-weight:700;font-size: 20px;position: absolute;top:"+allpoints[1]+"px;left:"+allpoints[0]+"px;color: "+strokeFillColor+";'>"+item.PLACEAREANAME+"</div>"+
				"<svg class='areaShade'>"+
		        "  <g stroke='none' stroke-width='2' fill='none' fill-rule='evenodd' fill-opacity='0.4' stroke-linecap='round' stroke-linejoin='round'>"+
		        "    <g style='fill:"+fillColor+"' stroke='"+strokeFillColor+"' stroke-width='2'>"+
		        "      <g>"+
		        "         <polygon data-points='"+item.POINTS+"' points='"+allpoints[0]+","+allpoints[1]+" "+allpoints[2]+","+allpoints[3]+" "+allpoints[4]+","+allpoints[5]+" "+allpoints[6]+","+allpoints[7]+"' />"+
		        "       </g>"+
		        "     </g>"+
		        "   </g>"+
		        " </svg>"+
		        " </div>"

			});
			$('#factory_area').append(appDom);
		}
	})
}

/**
 * 点击风险区域，获取区域内数据
 */
function loadDssList(e){
	parent.openWin(BASE_URL+"/views/module/monitor/monitorIndex/dssRskList.html?placeareaid="+$(e).attr("data-id"),$(e).attr("data-name")+'风险信息','60%','60%');
}

// 滚动条初始化
function scrollResize(){
	$(".scroll_menu").niceScroll({
		cursorborder: "#4d86d6",
		cursorcolor: "#4d86d6",
		background: false,
		horizrailenabled: false,
		autohidemode: false
	}).show().resize();
}