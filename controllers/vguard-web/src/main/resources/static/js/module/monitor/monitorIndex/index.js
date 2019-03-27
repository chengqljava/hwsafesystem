var areaData = [];
var stateUtil = new MapUtil();
$(function() {
    $(".factory_area_img").attr("src", BASE_URL + "enterprise/entplan/downloadbyentid");
	stateUtil.put("Awxy", 1);
	stateUtil.put("Aqt", 1);
	stateUtil.put("Asp", 1);
	stateUtil.put("Ayl", 1);
	stateUtil.put("Ayw", 1);
	stateUtil.put("Awd", 1);
/*
 * 调用图片缩放插件
 * maxi 最大放大倍数
 * mini 最下缩小倍数
 * callback 回调函数 ；
 * 参数1：图片真实高度； 参数2：图片真实宽度；参数3：当前图片放大的倍数；
 * 参数4：当前区域id；   参数5：当前区域名称；参数6：ifream的id；
 * */
	$('#factory_area').imgZoomAndDrog({maxi:5,mini:1,callback:function(imgRealHeight,imgRealWidth,n,placeId,placeName,id){
		console.log(imgRealHeight,imgRealWidth,n,placeId,placeName,id);
		$(".areaDiv").each(function (e) {
		   	 var dataLeft = $(this).attr("data-left");
		   	 var dataTop = $(this).attr("data-top");
	        var top = imgRealHeight*dataTop * n/100;
	        var left = imgRealWidth*dataLeft * n/100;
	        $(this).css({top: top, left: left});
	    })
	    $(".point").each(function (e) {
	        var dataTop = $(this).attr("data-top");
	        var dataLeft = $(this).attr("data-left");
	        var top = imgRealHeight*dataTop * n/100 - 48;
	        var left = imgRealWidth*dataLeft * n/100 - 26;
	        $(this).css({top: top, left: left});
	    });
	    if(n > 4.9 && placeId != ''){
			$('.allArea').addClass('fade')
			$('.all_title').addClass('fade');
			$('.tools').addClass('fade');
			$('#loading').addClass('fadeOn');
			setTimeout(function(){
				$('#loading').removeClass('fadeOn');
				$('.single_title').addClass('fadeOn');
				$('#back').addClass('fadeOn');
				$('.singleArea').addClass('fadeOn');
			}, 1000);
			$('#singleAreaIframe')
					.attr(
							'src',
							BASE_URL
									+ '/views/module/monitor/macArea/macAreaIndex.html?id='
									+ placeId);
			$('.single_title').html(placeName).attr('data-id',placeId).attr('data-name',placeName);
			return false;
		}
		if( n < 1.1 && id){
			$(".single_title", window.parent.document).removeClass('fadeOn');
			$("#back", window.parent.document).removeClass('fadeOn');
			$(".singleArea", window.parent.document).removeClass('fadeOn');
			$("#loading", window.parent.document).addClass('fadeOn');
			setTimeout(function(){
				$("#loading", window.parent.document).removeClass('fadeOn');
				$(".allArea", window.parent.document).removeClass('fade');
				$(".all_title", window.parent.document).removeClass('fade');
				$(".tools", window.parent.document).removeClass('fade');
			}, 1000);
			return false;
		}
		areaResize();
	}});
	$('.menu').on('click', '.close', function() {
		var $id = $(this).data('id');
		var $state = $(this).data('state');
		if ($state == '1') {
			$('.menu_' + $id).animate({
				left : -300
			});
			$(this).find('span').html('>')
			$(this).data('state', '0');
			reloadAreaList();
		} else {
			$('.menu_' + $id).animate({
				left : 0
			});
			$(this).find('span').html('<')
			$(this).data('state', '1');
			reloadAreaList();
		}
	})
	$('.all_title')
			.click(
					function() {
						openWin(
								BASE_URL
										+ 'views/module/monitor/monitorIndex/entbusinessInfo.html',
								'企业信息', '60%', '60%');
					})
	$('.single_title')
			.click(
					function() {
						openWin(
								BASE_URL
										+ 'views/module/monitor/macArea/areaInfo.html?id='+$(this).data('id'),
								$(this).attr('data-name'), '60%', '60%');
					})
	$('#factory_search_input')
			.on(
					'input',
					function() {
						var selectedArr = [];
						var name = $(this).val();
						if (name == '') {
							$('#seach_name').html('');
						} else {
							areaData.forEach(function(item) {
								var entName = item.name;
								if (entName.indexOf(name) != -1) {
									selectedArr.push(item);
								}
							})
						}
						var liHtml = '';
						selectedArr.forEach(function(item) {
							liHtml += "<li data-name="+item.name+">" + item.name + "</li>"
						});
						$('#seach_name').html(liHtml);
						$('#seach_name').on('click', 'li', function() {
							var $val = $(this).data('name');
							$('#factory_search_input').val($val);
							$('#seach_name').html('');
						})
						$('#factory_search_btn')
								.click(
										function() {
											var $id = '';
											var iName = $(
													'#factory_search_input')
													.val();
											areaData.forEach(function(item) {
												if (item.name == iName) {
													$id = item.id;
												}
											})
											if ($id == '') {
												toast('请输入完整的区域名称！')
											} else {
												$('.allArea').addClass('fade')
												$('.singleArea').addClass(
														'fadeOn');
												$('.all_title')
														.addClass('fade');
												$('.single_title').addClass(
														'fadeOn');
												$('#back').addClass('fadeOn');
												$('.tools').addClass('fade');
												$('#singleAreaIframe')
														.attr(
																'src',
																BASE_URL
																		+ '/views/module/monitor/macArea/macAreaIndex.html?id='
																		+ $id);
												$('.single_title').html(iName);
											}
										})
					})
	$('.menu_top').on('click', '.single_menu', function() {
		var $id = $(this).data('id');
		if ($(this).hasClass('active')) {
			$('.A' + $id).addClass('hide');
			stateUtil.put('A' + $id, 0);
		} else {
			$('.A' + $id).removeClass('hide');
			stateUtil.put('A' + $id, 1);
		}
		$(this).toggleClass('active');
	})
	$('body').on('mouseover', '.areaDiv', function() {
		$(this).addClass('hover');
	})
	$('body').on('mouseout', '.areaDiv', function() {
		$(this).removeClass('hover');
	})
	$('.menu_warning_kind_top').on('click', 'li', function() {
		$('.menu_warning_kind_top li').removeClass('active');
		$(this).addClass('active');
		var $id = $(this).data('id');
		$('.menu_warning_top').removeClass('show');
		$('.' + $id).addClass('show');
		$('.menu_bottom .bj_echarts').removeClass('show');
		$('#' + $id + '_echarts').addClass('show');
		scrollResize();
	})
	$('.menu_warning_kind_bottom').on('click', 'li', function() {
		$('.menu_warning_kind_bottom li').removeClass('active');
		$(this).addClass('active');
		var $id = $(this).data('id');
		$('.bottom_content').removeClass('show');
		$('.' + $id + "_content").addClass('show');
		if ($id == 'wxy') {
			$('#menu_title_content').html('重大危险源');
		} else if ($id == 'jc') {
			$('#menu_title_content').html('在线监测');
		} else {
			$('#menu_title_content').html('视频监控');
		}
	})
	$('body').on('click', '#back', function() {
		$(".single_title").removeClass('fadeOn');
		$("#back").removeClass('fadeOn');
		$(".singleArea").removeClass('fadeOn');
		$("#loading").addClass('fadeOn');
		setTimeout(function(){
			$("#loading").removeClass('fadeOn');
			$(".allArea").removeClass('fade');
			$(".all_title").removeClass('fade');
			$(".tools").removeClass('fade');
		}, 1000);
		return false;
	})
	// 当日报警信息
	$.ajax({
		type : "post",
		url : BASE_URL + "/dangersource/dssrskplacearea/loadStateTJV2",
		cache : false,
		data : {
			'businessinfoid' : ''
		},
		dataType : "JSON",
		global : false,
		success : function(res) {
			var jcbjChart = echarts.init(document
					.getElementById('jcbj_echarts'));
			var gzbjChart = echarts.init(document
					.getElementById('gzbj_echarts'));
			var jcbjOption;
			var gzbjOption;
			var warningCounts = res[0].CDB + res[0].DB + res[0].GB + res[0].CGB
					+ res[0].MLC;
			var WrongCounts = res[0].WLGZ + res[0].TTGZ + res[0].TXGZ;
			if (warningCounts == 0) {
				$('#jcbj_echarts').css('height', 10);
				jcbjChart.resize();
			} else {
				jcbjOption = {
					tooltip : {
						trigger : 'item',
						formatter : "{a} <br/>{b}: {c} ({d}%)"
					},
					legend : {
						orient : 'vertical',
						x : 'right',
						y : 'center',
						data : [ {
							name : '超低报',
							icon : "circle"
						}, {
							name : '低报',
							icon : "circle"
						}, {
							name : '高报',
							icon : "circle"
						}, {
							name : '超高报',
							icon : "circle"
						}, {
							name : '满量程',
							icon : "circle"
						} ],
						itemWidth : 8,
						itemHeight : 8,
						itemGap : 13
					},
					series : [ {
						name : '报警数量',
						type : 'pie',
						radius : [ '50%', '70%' ],
						center : [ '30%', '50%' ],
						avoidLabelOverlap : false,
						label : {
							normal : {
								show : false,
								position : 'center'
							},
							emphasis : {
								show : false,
								textStyle : {
									fontSize : '30',
									fontWeight : 'bold'
								}
							}
						},
						labelLine : {
							normal : {
								show : true
							}
						},
						data : [ {
							value : res[0].CDB,
							name : '超低报'
						}, {
							value : res[0].DB,
							name : '低报'
						}, {
							value : res[0].GB,
							name : '高报'
						}, {
							value : res[0].CGB,
							name : '超高报'
						}, {
							value : res[0].MLC,
							name : '满量程'
						} ]
					} ],
					color : [ '#13C2C2', '#1890FF', '#F04864', '#F5A623',
							'#8543E0' ]
				};
				jcbjChart.setOption(jcbjOption);
				$('.jcbj span:eq(1)').html(
						"<a href='javascript:void(0);' onclick='displayAlarm()'>"
								+ warningCounts + "</a>");
			}
			if (WrongCounts == 0) {
				$('#gzbj_echarts').css('height', 10);
				gzbjChart.resize();
			} else {
				gzbjOption = {
					tooltip : {
						trigger : 'item',
						formatter : "{a} <br/>{b}: {c} ({d}%)"
					},
					legend : {
						orient : 'vertical',
						x : 'right',
						y : 'center',
						data : [ {
							name : '探头故障',
							icon : "circle"
						}, {
							name : '网络故障',
							icon : "circle"
						}, {
							name : '通讯故障',
							icon : "circle"
						} ],
						itemWidth : 8,
						itemHeight : 8,
						itemGap : 13
					},
					series : [ {
						name : '报警数量',
						type : 'pie',
						radius : [ '50%', '70%' ],
						center : [ '30%', '50%' ],
						avoidLabelOverlap : false,
						label : {
							normal : {
								show : false,
								position : 'center'
							},
							emphasis : {
								show : false,
								textStyle : {
									fontSize : '30',
									fontWeight : 'bold'
								}
							}
						},
						labelLine : {
							normal : {
								show : true
							}
						},
						data : [ {
							value : res[0].TTGZ,
							name : '探头故障'
						}, {
							value : res[0].WLGZ,
							name : '网络故障'
						}, {
							value : res[0].TXGZ,
							name : '通讯故障'
						} ]
					} ],
					color : [ '#F04864', '#1890FF', '#F5A623' ]
				};
				gzbjChart.setOption(gzbjOption);
				$('.gzbj span:eq(1)').html(
						"<a href='javascript:void(0);' onclick='displayFaultAlarm()'>"
								+ WrongCounts + "</a>");
				scrollResize();
			}
		}
	});
	// 获取危险源信息
	$.ajax({
				type : "post",
				url : BASE_URL
						+ "/dangersource/dssdangerinfo/loaddangerresource",
				// url:
				// "http://192.168.111.193:8080/ahyjyth/monitor/maccontroller/loaddangerresource",
				cache : false,
				data : {
					'businessinfoid' : ''
				},
				dataType : "JSON",
				global : false,
				success : function(res) {
					var wxyChart = echarts.init(document
							.getElementById('wxy_echarts'));
					var spChart = echarts.init(document
							.getElementById('sp_echarts'));
					var wxyOption;
					var spOption;
					var wxyData = [ 0, 0, 0, 0 ];
					res.dangernum.forEach(function(item) {
						switch (item.DANGERLEVEL) {
						case '1':
							wxyData[0] = item.WXYS;
							$('#level1').html(
									"<a href='javascript:void(0);' onclick='showDssInfo(1)'>"
											+ item.WXYS + "</a>");
							break;
						case '2':
							wxyData[1] = item.WXYS;
							$('#level2').html(
									"<a href='javascript:void(0);' onclick='showDssInfo(2)'>"
											+ item.WXYS + "</a>");
							break;
						case '3':
							wxyData[2] = item.WXYS;
							$('#level3').html(
									"<a href='javascript:void(0);' onclick='showDssInfo(3)'>"
											+ item.WXYS + "</a>");
							break;
						case '4':
							wxyData[3] = item.WXYS;
							$('#level4').html(
									"<a href='javascript:void(0);' onclick='showDssInfo(4)'>"
											+ item.WXYS + "</a>");
							break;
						default:
							break;

						}
					})
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
							x : 30,
							x2 : 30,
							y : 30,
							y2 : 30
						},
						xAxis : [ {
							type : 'category',
							data : [ '一级', '二级', '三级', '四级' ],
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
								textStyle : {
									color : 'rgba(0,0,0,0.65)'
								}
							}
						} ],
						yAxis : [ {
							type : 'value',
							name : '数量（个）',
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
							name : '隐患数量',
							type : 'bar',
							barWidth : '50%',
							data : wxyData,
							itemStyle : {
								normal : {
									color : function(params) {
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
					var probeCounts = 0;
					res.probenum.forEach(function(item) {
						probeCounts += item.PROBNUM;
					});

					res.probenum.forEach(function(item) {
						switch (item.STATE) {
						case 1:
							wxyData[0] = item.WXYS;
							$('#zcs').html(
									"<a href='javascript:void(0);' onclick='displayRelatimeList(1)'>"
											+ item.PROBNUM + "</a>");
							$('#zcl').css('width',
									item.PROBNUM * 100 / probeCounts + '%');
							$('#zclNum').html(
									(item.PROBNUM * 100 / probeCounts)
											.toFixed(0)
											+ '%');
							break;
						case 2:
							wxyData[1] = item.WXYS;
							$('#gzs').html(
									"<a href='javascript:void(0);' onclick='displayRelatimeList(2)'>"
											+ item.PROBNUM + "</a>");
							$('#gzl').css('width',
									item.PROBNUM * 100 / probeCounts + '%');
							$('#gzlNum').html(
									(item.PROBNUM * 100 / probeCounts)
											.toFixed(0)
											+ '%');
							break;
						case 3:
							wxyData[2] = item.WXYS;
							$('#bjs').html(
									"<a href='javascript:void(0);' onclick='displayRelatimeList(3)'>"
											+ item.PROBNUM + "</a>");
							$('#bjl').css('width',
									item.PROBNUM * 100 / probeCounts + '%');
							$('#bjlNum').html(
									(item.PROBNUM * 100 / probeCounts)
											.toFixed(0)
											+ '%');
							break;
						case 4:
							wxyData[3] = item.WXYS;
							$('#css').html(
									"<a href='javascript:void(0);' onclick='displayRelatimeList(4)'>"
											+ item.PROBNUM + "</a>");
							$('#csl').css('width',
									item.PROBNUM * 100 / probeCounts + '%');
							$('#cslNum').html(
									(item.PROBNUM * 100 / probeCounts)
											.toFixed(0)
											+ '%');
							break;
						default:
							break;
						}
					})
					var spData = [];
					res.videonum.forEach(function(item) {
						spData.push({
							value : item.VIDEOCOUNT,
							name : item.AREANAME ? item.AREANAME : '未定义区域'
						})
					})
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
						series : [ {
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
							data : spData,
						} ],
						color : [ '#BFD52A', '#05A848', '#059F85', '#01A2D8',
								'#0078C7', '#1E3197', '#881F88', '#D50584',
								'#E60355', '#E60817', '#F19704', '#FCC900',
								'#81BE3C', '#019E5B', '#00A2AD' ]
					};
					spChart.setOption(spOption);
					scrollResize();
				}
			})

	reloadAreaList();
	/**
	 * 定时刷新列表
	 */
//	window.setInterval(function() {
//		reloadAreaList();
//	}, 5000);

	
//	区域点击跳转
	$('#factory_area')
			.on(
					'click',
					'.areaDiv',
					function() {
						var $id = $(this).data('id');
						var $name = $(this).data('name');
						$('.allArea').addClass('fade')
						$('.all_title').addClass('fade');
						$('.tools').addClass('fade');
						$('#loading').addClass('fadeOn');
						setTimeout(function(){
							$('#loading').removeClass('fadeOn');
							$('.single_title').addClass('fadeOn');
							$('#back').addClass('fadeOn');
							$('.singleArea').addClass('fadeOn');
						}, 1000);
						$('#singleAreaIframe')
								.attr(
										'src',
										BASE_URL
												+ '/views/module/monitor/macArea/macAreaIndex.html?id='
												+ $id);
						$('.single_title').html($name).attr('data-id',$id).attr('data-name',$name);
//						openWin(BASE_URL + 'views/module/enterprise/entorg/entOrgInfo.html?entorgid=' + $id, $name,
//                                '55%', '240px');
					})

	$('body').on('click', '.full span', function() {
		fullScreen();
		scrollResize()
	});
	scrollResize();
})

// 区域数据读取
function reloadAreaList() {
	$.ajax({
		type : "post",
		url : BASE_URL + "/dangersource/dssrskplacearea/loadallplace",
		// url:
		// "http://192.168.111.193:8080/ahyjyth/monitor/maccontroller/loaddangerresource",
		cache : false,
		data : {
			'businessinfoid' : ''
		},
		dataType : "JSON",
		global : false,
		success : function(res) {
			var areaHtml = '';
			areaData = [];
			res.forEach(function(item) {
				var areaObj = {
					name : item.PLACEAREANAME,
					id : item.PLACEAREAID
				}
				if(item.AREALEFT == null){
					item.AREALEFT = 50;
				}
				if(item.AREATOP == null){
					item.AREATOP = 50;
				}
				areaData.push(areaObj);
				var state = 'areaZC';
				var stateName = '正常';
				var fillColor = 'rgba(47,194,91,0.70)';
				var strokeFillColor = 'rgb(47,194,91)';
				// var qtZC = 0;
				// var qtGZ = 0;
				// var qtBJ = 0;
				// var spZC = 0;
				// var spGZ = 0;
				// var spBJ = 0;
				var qtContent = '';
				var spContent = '';
				var ylContent = '';
				var ywContent = '';
				var wdContent = '';
				var wxyContent = '';
				var gascountlist = item.gascountlist;
				var levelcountlist = item.levelcountlist;
				var presscountlist = item.presscountlist;
				var temcountlist = item.temcountlist;
				var videoList = item.videocounList;
				var dangerinfocountList = item.dangerinfocountList;
				// var videoList = item.videocounList;
				var allList = gascountlist.concat(levelcountlist);
				allList = allList.concat(presscountlist);
				allList = allList.concat(temcountlist);
				allList = allList.concat(videoList);
				allList = allList.concat(dangerinfocountList);
				allList.forEach(function(item){
					if (item.STATE == '3') {
						state = 'areaBJ';
						stateName = '报警';
						fillColor = 'rgba(255,0,0,0.70)';
						strokeFillColor = 'rgb(255,0,0)';
						return false;
					} else if (item.STATE == '2') {
						state = 'areaGZ';
						stateName = '故障';
						fillColor = 'rgba(255,204,0,0.70)';
						strokeFillColor = 'rgb(255,204,0)';
					}
				});
				if (gascountlist.length == 0) {
					if (stateUtil.get("Aqt") == 1) {
						qtContent = "<tr class='Aqt'>" + "<td>气体</td>" + "<td>"
								+ 0 + "</td>" + "<td class='ZC'>" + 0 + "</td>"
								+ "<td class='GZ'>" + 0 + "</td>"
								+ "<td class='BJ'>" + 0 + "</td>" + "</tr>";
					}
				} else {
                    var BJ = 0, GZ = 0, ZC = 0;
                    gascountlist.forEach(function(item) {
						if (item.STATE == '3') {
							BJ = item.PROBNUM ? item.PROBNUM : 0;
						} else if (item.STATE == '2') {
							GZ = item.PROBNUM ? item.PROBNUM : 0;
						} else {
							ZC = item.PROBNUM ? item.PROBNUM : 0;
						}
					});
                    if (stateUtil.get("Aqt") == 1) {
                        qtContent = "<tr class='Aqt'>" + "<td>气体</td>"
                            + "<td>" + (ZC + GZ + BJ) + "</td>"
                            + "<td class='ZC'>" + ZC + "</td>"
                            + "<td class='GZ'>" + GZ + "</td>"
                            + "<td class='BJ'>" + BJ + "</td>"
                            + "</tr>";
                    }
                }
				if (videoList.length == 0) {
					if (stateUtil.get("Asp") == 1) {
						spContent = "<tr class='Asp'>" + "<td>视频</td>" + "<td>"
								+ 0 + "</td>" + "<td class='ZC'>" + 0 + "</td>"
								+ "<td class='GZ'>" + 0 + "</td>"
								+ "<td class='BJ'>" + 0 + "</td>" + "</tr>";
					}
				} else {
                    var BJ = 0, GZ = 0, ZC = 0;
                    videoList.forEach(function(item) {
						if (item.STATE == '3') {
							BJ = item.VIDEOCOUNT ? item.VIDEOCOUNT : 0;
						} else if (item.STATE == '2') {
							GZ = item.VIDEOCOUNT ? item.VIDEOCOUNT : 0;
						} else {
							ZC = item.VIDEOCOUNT ? item.VIDEOCOUNT : 0;
						}
					})
                    if (stateUtil.get("Asp") == 1) {
                        spContent = "<tr class='Asp'>" + "<td>视频</td>"
                            + "<td>" + (ZC + GZ + BJ) + "</td>"
                            + "<td class='ZC'>" + ZC + "</td>"
                            + "<td class='GZ'>" + GZ + "</td>"
                            + "<td class='BJ'>" + BJ + "</td>"
                            + "</tr>";
                    }
                }
				if (levelcountlist.length == 0) {
					if (stateUtil.get("Ayw") == 1) {
						ywContent = "<tr class='Ayw'>" + "<td>液位</td>" + "<td>"
								+ 0 + "</td>" + "<td class='ZC'>" + 0 + "</td>"
								+ "<td class='GZ'>" + 0 + "</td>"
								+ "<td class='BJ'>" + 0 + "</td>" + "</tr>";
					}
				} else {
                    var BJ = 0, GZ = 0, ZC = 0;
                    levelcountlist.forEach(function(item) {
						if (item.STATE == '3') {
							BJ = item.PROBNUM ? item.PROBNUM : 0;
						} else if (item.STATE == '2') {
							GZ = item.PROBNUM ? item.PROBNUM : 0;
						} else {
							ZC = item.PROBNUM ? item.PROBNUM : 0;
						}
					})
                    if (stateUtil.get("Ayw") == 1) {
                        ywContent = "<tr class='Ayw'>" + "<td>液位</td>"
                            + "<td>" + (ZC + GZ + BJ) + "</td>"
                            + "<td class='ZC'>" + ZC + "</td>"
                            + "<td class='GZ'>" + GZ + "</td>"
                            + "<td class='BJ'>" + BJ + "</td>"
                            + "</tr>";
                    }
                }
				
				if (temcountlist.length == 0) {
					if (stateUtil.get("Awd") == 1) {
						wdContent = "<tr class='Awd'>" + "<td>温度</td>" + "<td>"
								+ 0 + "</td>" + "<td class='ZC'>" + 0 + "</td>"
								+ "<td class='GZ'>" + 0 + "</td>"
								+ "<td class='BJ'>" + 0 + "</td>" + "</tr>";
					}
				} else {
                    var BJ = 0, GZ = 0, ZC = 0;
                    temcountlist.forEach(function(item) {
						if (item.STATE == '3') {
							BJ = item.PROBNUM ? item.PROBNUM : 0;
						} else if (item.STATE == '2') {
							GZ = item.PROBNUM ? item.PROBNUM : 0;
						} else {
							ZC = item.PROBNUM ? item.PROBNUM : 0;
						}
					})
                    if (stateUtil.get("Awd") == 1) {
                        wdContent = "<tr class='Awd'>" + "<td>温度</td>"
                            + "<td>" + (ZC + GZ + BJ) + "</td>"
                            + "<td class='ZC'>" + ZC + "</td>"
                            + "<td class='GZ'>" + GZ + "</td>"
                            + "<td class='BJ'>" + BJ + "</td>"
                            + "</tr>";
                    }
                }
				if (presscountlist.length == 0) {
					if (stateUtil.get("Ayl") == 1) {
						ylContent = "<tr class='Ayl'>" + "<td>压力</td>" + "<td>"
								+ 0 + "</td>" + "<td class='ZC'>" + 0 + "</td>"
								+ "<td class='GZ'>" + 0 + "</td>"
								+ "<td class='BJ'>" + 0 + "</td>" + "</tr>";
					}
				} else {
                    var BJ = 0, GZ = 0, ZC = 0;
                    presscountlist.forEach(function(item) {
						if (item.STATE == '3') {
							BJ = item.PROBNUM;
						} else if (item.STATE == '2') {
							GZ = item.PROBNUM;
						} else {
							ZC = item.PROBNUM;
						}
					})
                    if (stateUtil.get("Ayl") == 1) {
                        ylContent = "<tr class='Ayl'>" + "<td>压力</td>"
                            + "<td>" + (ZC + GZ + BJ) + "</td>"
                            + "<td class='ZC'>" + ZC + "</td>"
                            + "<td class='GZ'>" + GZ + "</td>"
                            + "<td class='BJ'>" + BJ + "</td>"
                            + "</tr>";
                    }
                }
				if(dangerinfocountList.length ==0){
					if (stateUtil.get("Awxy") == 1) {
						wxyContent = "<tr class='Awxy'>" + "<td>危险源</td>" + "<td>"
								+ 0 + "</td>" + "<td class='ZC'>" + '-' + "</td>"
								+ "<td class='GZ'>" + '-' + "</td>"
								+ "<td class='BJ'>" + '-' + "</td>" + "</tr>";
					}
                }else{
                    var BJ = 0, GZ = 0, ZC = 0;
                    dangerinfocountList.forEach(function(item) {
                        ZC = item.COUNT;
                    })
                    if (stateUtil.get("Awxy") == 1) {
                        wxyContent = "<tr class='Awxy'>" + "<td>危险源</td>"
                            + "<td>" + (ZC + GZ + BJ) + "</td>"
                            + "<td class='ZC'>" + ZC + "</td>"
                            + "<td class='GZ'>" + GZ + "</td>"
                            + "<td class='BJ'>" + BJ + "</td>"
                            + "</tr>";
                    }
                }
				item.state = state;
				item.stateName = stateName;
				item.fillColor = fillColor;
				item.strokeFillColor = strokeFillColor;
				item.content = wxyContent + qtContent + spContent + ylContent
						+ wdContent + ywContent;
				// item.content = "<tr class='Aqt'>"
				// + "<td>气体</td>"
				// + "<td>"+(qtZC + qtGZ + qtBJ)+"</td>"
				// + "<td class="+(qtZC!=0?'ZC':'')+">"+qtZC+"</td>"
				// + "<td class="+(qtGZ!=0?'GZ':'')+">"+qtGZ+"</td>"
				// + "<td class="+(qtBJ!=0?'BJ':'')+">"+qtBJ+"</td>"
				// +"</tr>"
				// +"<tr class='Asp'>"
				// + "<td>视频</td>"
				// + "<td>"+(spZC + spGZ + spBJ)+"</td>"
				// + "<td class="+(spZC!=0?'ZC':'')+">"+spZC+"</td>"
				// + "<td class="+(spGZ!=0?'GZ':'')+">"+spGZ+"</td>"
				// + "<td class="+(spBJ!=0?'BJ':'')+">"+spBJ+"</td>"
				// +"</tr>"
				var FAwidth = $('#factory_area').width();
				var FAheight = $('#factory_area').height();
				var areaH = FAheight * item.AREAHEIGHT/100;
				var areaW = FAwidth * item.AREAWIDTH/100;
				item.POINTS?'':item.POINTS = '0,0 0,100 100,100 100,0';
				var allPoint = [];
				item.POINTS.split(' ').forEach(function(item){
	           	 	var arr = item.split(',');
	           	 	allPoint = allPoint.concat(arr);
	            });
	            var allpoints = [];
	            allPoint.forEach(function(item){
	            allpoints.push(parseFloat(parseFloat(item).toFixed(2)));
	            })
	            console.log(allpoints);
				item.p1X = allpoints[0];
				item.p1Y = allpoints[1];
				item.p2X = allpoints[2];
				item.p2Y = allpoints[3];
				item.p3X = allpoints[4];
				item.p3Y = allpoints[5];
				item.p4X = allpoints[6];
				item.p4Y = allpoints[7];
				areaHtml += _.template($('#area_template').html())(item);
			})
			$('#monitor_areas').html(areaHtml);
			areaResize();
		}
	})
}

// 监测报警
function displayAlarm() {
	parent.openWin(BASE_URL
			+ "views/module/system/remindinfo/alarmList.html?usertype=ENT",
			'监测报警', '60%', '60%');
}
// 故障报警
function displayFaultAlarm() {
	parent
			.openWin(
					BASE_URL
							+ "views/module/system/remindinfo/faultAlarmList.html?usertype=ENT",
					'故障报警', '60%', '60%');
}
/**
 * 进入重大危险源列表
 * 
 * @author lzqiang
 * @date 2016年7月14日 上午9:33:30
 */
function intoDangerList(dangerType, dangerLevel) {
	var districtid = "";
	parent.openWin(BASE_URL
			+ '/dangersource/dssStatistics/intoDssDangerList?districtid='
			+ districtid + "&dangerType=" + dangerType + "&dangerLevel="
			+ dangerLevel, '危险源信息', '72%', '65%');
}

// 监测报警
function displayRelatimeList(stateArr) {
	parent
			.openWin(
					BASE_URL
							+ 'views/module/monitor/macrealtime/macEntRealtimeList.html?stateArr='
							+ stateArr+'&isNew=1', '危险源信息', '70%', '65%');
}

// 全屏实现的方法
function fullScreen() {
	var width = window.parent.innerHeight;
	var height = window.parent.innerWidth;
	var fullBtn = $('.full span');
	var Jiframes = window.parent.document.getElementsByClassName('J_iframe');
	for (var i = 0; i < Jiframes.length; i++) {
		var Jsrc = Jiframes[i].getAttribute('data-id');
		var Jurl = BASE_URL.split('/')[3];
		if (Jsrc == '/'
				+ Jurl
				+ '/views/module/monitor/monitorIndex/monitorIndex.html?privcode=ENT_ZDSXYJCJK_SSJCJK_ZHJC') {
			if (Jiframes[i].style.position == 'fixed') {
				Jiframes[i].style.position = 'relative';
				$(fullBtn).removeClass('become_normal_btn');
			} else {
				Jiframes[i].style.position = 'fixed';
				Jiframes[i].style.top = 0;
				Jiframes[i].style.left = 0;
				Jiframes[i].style.zIndex = 999;
				$(fullBtn).addClass('become_normal_btn');
			}
			return false;
		}
	}
}
function getAreaId(arr, name) {
	arr.forEach(function(item) {
		if (item.name == name) {
			return item.id;
		}
	});
}
function scrollResize() {
	$('.scroll_menu').niceScroll({
		cursorborder : "#4d86d6",
		cursorcolor : "#4d86d6",
		background : false,
		horizrailenabled : false,
		autohidemode : false
	}).show().resize();
}
$(window).resize(function() {
	areaResize();
});
function areaResize(){
	$('.placeName').each(function(){
		var left = $(this).parent().width()/2 - $(this).width()/2 - 14;
		$(this).css({
			left: left
		})
		$(this).next().css({
			left: left+$(this).width()+28
		})
		$(this).next().next().css({
			left: left
		})
	})
	var FAwidth = $('#factory_area').width();
	var FAheight = $('#factory_area').height();
	$(".areaDiv svg polygon").each(function (e) {
	   var points = $(this).data('points');
       var allPoint = []; 
       points.split(' ').forEach(function(item){
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
       })
       $(this).attr('points',allpoints[0]+','+allpoints[1]+' '+allpoints[2]+','+allpoints[3]+' '+allpoints[4]+','+allpoints[5]+' '+allpoints[6]+','+allpoints[7])
   });
	$('.areaDiv section').each(function(item,index){
		var $class = $(this).attr('class');
		var $this = this;
		var $thisAreaDiv = $(this).parent('.areaDiv');
		var points = $thisAreaDiv.find('polygon').attr('data-points');
        var allPoint = [];
        points.split(' ').forEach(function(item){
        	var arr = item.split(',');
        	allPoint = allPoint.concat(arr);
        });
        var allpoints = [];
        var allpointsPercent = [];
        allPoint.forEach(function(item,index){
        	if(index%2 == 0){
        		allpoints.push(item*FAwidth/100);            		
        	}
        	else{
        		allpoints.push(item*FAheight/100);
        	}
        })
        switch ($class) {
		case 'p1':
			$($this).css({
				left:allpoints[0]-7,
				top:allpoints[1]-7
			})
			break;
		case 'p2':	
			$($this).css({
				left:allpoints[2]-7,
				top:allpoints[3]-7
			})
			break;
		case 'p3':
			$($this).css({
				left:allpoints[4]-7,
				top:allpoints[5]-7
			})
			break;
		case 'p4':
			$($this).css({
				left:allpoints[6]-7,
				top:allpoints[7]-7
			})
			break;
		default:
			break;
		}
	})
}