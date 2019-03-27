$(function() {
	//初始化地图展示的高度
	$("#portalMap").height($(window).height());
	//初始化综合预测路线覆盖物
//	window.allDriveRouteArr = [];
	//初始化加载地图组件
	window.map = initMap();
//	window.allMesOverlays = []; //测量时所画出的覆盖物数组
//	window.allDriveRouteOverlays = []; //生成救援路线时所生成的覆盖物数组
//	window.allMultiWinFlagArr = []; //当前所有多窗口弹窗标识数组
	
	//生成左侧导航手风琴导航
	$(".metismenu").metisMenu();
	metisMenuFmt();
	
	//左上方导航目前选中的查询标记--默认所有企业
	var curLtNavSrchFlag = "syqy";
	renderLTSubGrid("syqy", "");

	//左上方一级目录菜单触发事件
	$(".gn-menu").children("li").children("a").slice(0).on("click", function() {
		$(".subnav").css("display", "block");
		$(".inputSearch").val("");
		var text = $(this).text();
		var num = 0;
		switch (text) {
			case "所有企业":
				//判断是否已打开应急救援子菜单窗口
//				closeAllEmsResWin();
				num = renderLTSubGrid("syqy", "");
				curLtNavSrchFlag = "syqy";
				break;
			case "重大危险源":
				//判断是否已打开应急救援子菜单窗口
//				closeAllEmsResWin();
				num = renderLTSubGrid("zdwxy", "");
				curLtNavSrchFlag = "zdwxy";
				break;
			case "危化企业":
				//判断是否已打开应急救援子菜单窗口
//				closeAllEmsResWin();
				num = renderLTSubGrid("whqy", "");
				curLtNavSrchFlag = "whqy";
				break;
			case "安全隐患":
				//判断是否已打开应急救援子菜单窗口
//				closeAllEmsResWin();
				num = renderLTSubGrid("aqyh", "");
				curLtNavSrchFlag = "aqyh";
				break;
			case "应急资源":
				//判断是否已打开应急救援子菜单窗口
//				closeAllEmsResWin();
				num = renderLTSubGrid("yjzy", "");
				curLtNavSrchFlag = "yjzy";
				break;
//			case "应急救援":
////				num = renderLTSubGrid("yjjy", "");
//				//当从其它非应急救援菜单切换过来时需要清空地图的历史覆盖物
//				if ("none" == $("#curCaseTitle").css("display")) {
//					//默认清除地图上历史覆盖物
//					window.map.clearOverlays();
//					if (window.curEntAndMatlsDic) {
//						window.curEntAndMatlsDic = null;
//					}
//					//初始化事故标题的水平位置
//					$("#curCaseTitle").css("left", ($(window).width() - 500) / 2 ).show();
//					//隐藏应急救援相关标识
//					$("#curCaseTitle, #caseSwitchBtn").show();					
//				}
//				//初始化事故信息
//				initEventInfo(window.map);
//				curLtNavSrchFlag = "yjjy";
//				break;
		}
		
		$(".subTitle").html(text + "(<span style='color: red;'>" + num + "</span>)").attr("data-srchType", curLtNavSrchFlag);
	});

	//左上方二级目录菜单触发事件
	$(".gn-submenu li a").on("click", function() {
		$(".subnav").css("display", "block");
		$(".inputSearch").val("");
		var text = $(this).text();
		var num = 0;
		switch (text) {
			case "危险化学品": 
				//判断是否已打开应急救援子菜单窗口
//				closeAllEmsResWin();
				num = renderLTSubGrid("wxhxp", "");
				curLtNavSrchFlag = "wxhxp";
				break;
			case "燃气类": 
				//判断是否已打开应急救援子菜单窗口
//				closeAllEmsResWin();
				num = renderLTSubGrid("rql", "");
				curLtNavSrchFlag = "rql";
				break;
			case "港口":
				//判断是否已打开应急救援子菜单窗口
//				closeAllEmsResWin();
				num = renderLTSubGrid("gk", "");
				curLtNavSrchFlag = "gk";
				break;
			case "生产": 
				//判断是否已打开应急救援子菜单窗口
//				closeAllEmsResWin();
				num = renderLTSubGrid("sc", "");
				curLtNavSrchFlag = "sc";
				break;
			case "经营": 
				//判断是否已打开应急救援子菜单窗口
//				closeAllEmsResWin();
				num = renderLTSubGrid("jy", "");
				curLtNavSrchFlag = "jy";
				break;
			case "运输": 
				//判断是否已打开应急救援子菜单窗口
//				closeAllEmsResWin();
				num = renderLTSubGrid("ys", "");
				curLtNavSrchFlag = "ys";
				break;
			case "使用": 
				//判断是否已打开应急救援子菜单窗口
//				closeAllEmsResWin();
				num = renderLTSubGrid("sy", "");
				curLtNavSrchFlag = "sy";
				break;
			case "废弃物处置": 
				//判断是否已打开应急救援子菜单窗口
//				closeAllEmsResWin();
				num = renderLTSubGrid("fqwcz", "");
				curLtNavSrchFlag = "fqwcz";
				break;
			case "无需许可":
				//判断是否已打开应急救援子菜单窗口
//				closeAllEmsResWin();
				num = renderLTSubGrid("wxxk", "");
				curLtNavSrchFlag = "wxxk";
				break;
			case "应急机构":
				//判断是否已打开应急救援子菜单窗口
//				closeAllEmsResWin();
				num = renderLTSubGrid("yjjg", "");
				curLtNavSrchFlag = "yjjg";
				break;
			case "应急仓库":
				//判断是否已打开应急救援子菜单窗口
//				closeAllEmsResWin();
				num = renderLTSubGrid("yjck", "");
				curLtNavSrchFlag = "yjck";
				break;
			case "应急队伍":
				//判断是否已打开应急救援子菜单窗口
//				closeAllEmsResWin();
				num = renderLTSubGrid("yjdw", "");
				curLtNavSrchFlag = "yjdw";
				break;
			case "应急物资":
				//判断是否已打开应急救援子菜单窗口
//				closeAllEmsResWin();
				num = renderLTSubGrid("yjwz", "");
				curLtNavSrchFlag = "yjwz";
				break;
			case "隐患分布":
				//判断是否已打开应急救援子菜单窗口
//				closeAllEmsResWin();
				num = renderLTSubGrid("yhfb", "");
				curLtNavSrchFlag = "yhfb";
				break;
//			case "事件信息":
//				//事件信息弹窗
//				openEmsResWin(BASE_URL + "views/module/ems/map/eventInfo/eventInfo.html?eventid="+$("#eventid").val(),
//							  "事故详情", "22.5%", "36%", "sjxx");
//				curLtNavSrchFlag = "sjxx";
//				break;
//			case "周边天气":
//				//周边天气弹窗
//				openEmsResWin(BASE_URL + "views/module/ems/map/weather/weatherInfo.html",
//							  "天气详情", "22.5%", "22.5%", "zbtq");
//				curLtNavSrchFlag = "zbtq";
//				break;
//			case "视频监控":
//				//清除上次由测量工具所留下的覆盖物
//				clearAllMesOverlays(window.allMesOverlays);
//				//打开视频监控路径地址
//				openEmsResWin(BASE_URL + "views/module/ems/map/video/videoInfoList.html?eventid="+$("#eventid").val(),
//						  "视频监控", "35%", "41%", "spjk");
//				curLtNavSrchFlag = "spjk";
//				break;
//			case "周边监测点":
//				//清除上次由测量工具所留下的覆盖物
//				clearAllMesOverlays(window.allMesOverlays);
//				//打开周边监测点路径地址
//				openEmsResWin(BASE_URL + "views/module/ems/map/probe/probeInfoList.html?eventid="+$("#eventid").val(),
//						  "周边监测点", "45%", "50%", "zbjcd");
//				
//				curLtNavSrchFlag = "zbjcd";
//				break;
//			case "测量": 
//				//清除上次由测量工具所留下的覆盖物
//				clearAllMesOverlays(window.allMesOverlays);
//				initMesTools();
//				curLtNavSrchFlag = "cl";
//				break;
////			case "标绘":
////				//清除上次由测量工具所留下的覆盖物
////				clearAllMesOverlays(window.allMesOverlays);
////				
////				
////				curLtNavSrchFlag = "bh"; 
////				break;
//			case "查询":
//				//清除上次由测量工具所留下的覆盖物
//				clearAllMesOverlays(window.allMesOverlays);
//				openEmsResWin(BASE_URL + "views/module/ems/map/seacherResource/seacherResource.html",
//						  "查询", "40%", "50%", "cx");
//				curLtNavSrchFlag = "cx";
//				break;
//			case "事故模拟":
//				//清除上次由测量工具所留下的覆盖物
//				clearAllMesOverlays(window.allMesOverlays);
//				
//				//判断是否已关闭智能方案窗口
//				if (window.allMultiWinFlagArr.contains("znfa")) {
//					parent.toast("请先关闭智能方案窗口，再进行事故模拟相关操作！");
//					return;
//				}
//				
//				//打开周边监测点路径地址
//				openEmsResWin(BASE_URL + "views/module/ems/map/evnanalog/evnAnalogIndex.html?" +
//							  "eventid=" + $("#eventid").val() + "&eventlongitude=" + $("#eventlongitude").val() + 
//							  "&eventlatitude=" + $("#eventlatitude").val(), "事故模拟", "45%", "50%", "sgmn", function() {
//					//清除事故模拟相关的覆盖物
//					if (window.allEvnAnaPolyArr) {
//						if (0 < window.allEvnAnaPolyArr.length) {
//							_.map(window.allEvnAnaPolyArr, function(tmpPolyObj, index) {
//								window.map.removeOverlay(tmpPolyObj.poly);
//							});
//						}
//						window.allEvnAnaPolyArr = null;
//					}
//					
//					//清除事故模拟相关的防护目标点位
//					if (window.evnAnaPtDic) {
//						//清空地图上所有历史防护目标点位覆盖物
//						if (0 < window.evnAnaPtDic.size()) {
//							_.map(window.evnAnaPtDic.values(), function(tmpPtMap, index) {
//								window.map.removeOverlay(tmpPtMap.marker);
//							});
//						}
//						window.evnAnaPtDic = null;
//					}
//				});
//				curLtNavSrchFlag = "sgmn";
//				break;
//			case "资源评估":
//				//清除上次由测量工具所留下的覆盖物
//				clearAllMesOverlays(window.allMesOverlays);
//				
//				//判断是否已关闭智能方案窗口
//				if (window.allMultiWinFlagArr.contains("znfa")) {
//					parent.toast("请先关闭智能方案窗口，再进行资源评估相关操作！");
//					return;
//				}
//				
//				//打开资源评估路径地址
//				openEmsResWin(BASE_URL + "views/module/ems/map/resource/resourceInfoList.html?eventid="+$("#eventid").val(),
//						  "资源评估", "45%", "45%", "zypg",function() {
//					//清除资源评估点位标记
//					if (window.allResMarkArr) {
//						if (0 < window.allResMarkArr.length) {
//							_.map(window.allResMarkArr, function(tmpPolyObj, index) {
//								window.map.removeOverlay(tmpPolyObj);
//							});
//						}
//						window.allResMarkArr = [];
//					}
//				});
//				curLtNavSrchFlag = "zypg";
//				break;
//			case "综合预测":
//				//清除上次由测量工具所留下的覆盖物
//				clearAllMesOverlays(window.allMesOverlays);
//				
//				//判断是否已关闭智能方案窗口
//				if (window.allMultiWinFlagArr.contains("znfa")) {
//					parent.toast("请先关闭智能方案窗口，再进行综合预测相关操作！");
//					return;
//				}
//				
//				//初始化综合预测
//				initForecast($("#eventid").val());
//				curLtNavSrchFlag = "zhyc";
//				break;
//			case "智能方案":
//				//清除上次由测量工具所留下的覆盖物
//				clearAllMesOverlays(window.allMesOverlays);
//				
//				//判断是否已关闭事故模拟、资源评估、综合预测窗口
//				if (window.allMultiWinFlagArr.contains("sgmn")) {
//					parent.toast("请先关闭事故模拟窗口，再进行智能方案相关操作！");
//					return;
//				}
//				if (window.allMultiWinFlagArr.contains("zypg")) {
//					parent.toast("请先关闭资源评估窗口，再进行智能方案相关操作！");
//					return;
//				}
//				if (window.allMultiWinFlagArr.contains("zhyc")) {
//					parent.toast("请先关闭综合预测窗口，再进行智能方案相关操作！");
//					return;
//				}
//				
//				//判断事故模拟是否有最新的记录
//				if (!isEverEvnAna($("#eventid").val())) {
//					parent.toast("请先进行完事故模拟操作再进行打开智能方案窗口！");
//					return;
//				}
//				//判断资源评估是否有最新记录
//				if (!isEverResource($("#eventid").val())) {
//					parent.toast("请先进行完资源评估操作再进行打开智能方案窗口！");
//					return;
//				}				
//				//判断综合预测是否有最新记录
//				if (!isEverForecast($("#eventid").val())) {
//					parent.toast("请先进行完综合预测操作再进行打开智能方案窗口！");
//					return;
//				}			
//				
//				//分别绑定GIS首页右上角参考资料按钮事件
//				$("#referenceBtn").off("click").on("click", function(e) {
//					//阻止事件冒泡，只在元素本身触发
//					e.stopPropagation();
////					    var mouseX = e.originalEvent.x || e.originalEvent.layerX || 0,
////					        mouseY = e.originalEvent.y || e.originalEvent.layerY || 0;
//					if ("none" == $("#refBtnDetDiv").css("display")) {
//						$("#refBtnDetDiv").show();
//					} else {
//						$("#refBtnDetDiv").hide();
//					}
//				}).show();
//				
//				//相关预案资料子按钮事件
//				$("#refXgya").off("click").on("click", function() {
//					parent.openWin(BASE_URL+"/enterprise/entbusinessinfo/display/C4CC8D76C94A43ACA451450FA967FEAB",'详细','','85%');
//					
//					
//					$("#refBtnDetDiv").hide();
//				});
//				
//				//相关典型案例子按钮事件
//				$("#refDxal").off("click").on("click", function() {
//					parent.openWin(BASE_URL+"/enterprise/entbusinessinfo/display/C4CC8D76C94A43ACA451450FA967FEAB",'详细','','85%');
//					
//					$("#refBtnDetDiv").hide();
//				});
//				
//				//相关应急常识子按钮事件
//				$("#refYjcs").off("click").on("click", function() {
//					parent.openWin(BASE_URL+"/enterprise/entbusinessinfo/display/C4CC8D76C94A43ACA451450FA967FEAB",'详细','','85%');
//					
//					$("#refBtnDetDiv").hide();
//				});
//				
//				//相关标准规范子按钮事件
//				$("#refBzgf").off("click").on("click", function() {
//					parent.openWin(BASE_URL+"/enterprise/entbusinessinfo/display/C4CC8D76C94A43ACA451450FA967FEAB",'详细','','85%');
//					
//					$("#refBtnDetDiv").hide();
//				});
//				
//				//相关法律法规子按钮事件
//				$("#refFlfg").off("click").on("click", function() {
//					parent.openWin(BASE_URL+"/enterprise/entbusinessinfo/display/C4CC8D76C94A43ACA451450FA967FEAB",'详细','','85%');
//					
//					$("#refBtnDetDiv").hide();
//				});
//				
//				//相关政策文件子按钮事件
//				$("#refZcwj").off("click").on("click", function() {
//					parent.openWin(BASE_URL+"/enterprise/entbusinessinfo/display/C4CC8D76C94A43ACA451450FA967FEAB",'详细','','85%');
//					
//					$("#refBtnDetDiv").hide();
//				});
//				
//				//打开智能方案弹窗
//				openEmsResWin(BASE_URL + "views/module/ems/map/aiplan/index/aiplanIndex.html?" +
//							  "eventid=" + $("#eventid").val(), "智能方案", "50%", "55%", "znfa",
//							  function() {
//									$("#refBtnDetDiv, #referenceBtn, #msgBtn").hide();
//									
//									//清除事故模拟相关的覆盖物
//									if (window.allEvnAnaPolyArr) {
//										if (0 < window.allEvnAnaPolyArr.length) {
//											_.map(window.allEvnAnaPolyArr, function(tmpPolyObj, index) {
//												window.map.removeOverlay(tmpPolyObj.poly);
//											});
//										}
//										window.allEvnAnaPolyArr = null;
//									}
//									
//									//清除事故模拟相关的防护目标点位
//									if (window.evnAnaPtDic) {
//										//清空地图上所有历史防护目标点位覆盖物
//										if (0 < window.evnAnaPtDic.size()) {
//											_.map(window.evnAnaPtDic.values(), function(tmpPtMap, index) {
//												window.map.removeOverlay(tmpPtMap.marker);
//											});
//										}
//										window.evnAnaPtDic = null;
//									}
//									
//									//清除综合预测的覆盖物
//									if (window.allDriveRouteArr) {
//										if (0 < window.allDriveRouteArr.length) {
//											_.map(window.allDriveRouteArr, function(tmpPolyObj, index) {
//												window.map.removeOverlay(tmpPolyObj);
//											});
//										}
//										window.allDriveRouteArr = [];
//									}
//									
//									//清除资源评估点位标记
//									if (window.allResMarkArr) {
//										if (0 < window.allResMarkArr.length) {
//											_.map(window.allResMarkArr, function(tmpPolyObj, index) {
//												window.map.removeOverlay(tmpPolyObj);
//											});
//										}
//										window.allResMarkArr = [];
//									}
//									
//				});
//								
//				curLtNavSrchFlag = "znfa";
//				break;
		};
		
		$(".subTitle").html(text + "(<span style='color: red;'>" + num + "</span>)").attr("data-srchType", curLtNavSrchFlag);
	});

	//左上方导航查询结果框触发事件
	$(".searchBtn").off("click").on("click", function() {
		// 查询条件
		var entname = $(".inputSearch").val();
		
		// 设置DataGrid的查询条件
		var index = $(".subTitle").html().indexOf("(");
		var text = $(".subTitle").html().substr(0, index);
		var num = 0;
		num = renderLTSubGrid($(".subTitle").attr("data-srchType"), entname);
		$(".subTitle").html(text + "(<span style='color:red;'>" + num + "</span>)");
	});
	
	//右上方事故切换事件
//	$("#caseSwitchBtn").off("click").on("click", function() {
//		//事件信息弹窗
//		openEmsResWin(BASE_URL + "views/module/ems/map/eventInfo/eventInfoList.html", "当前上报事故信息", "60%", "60%", "sgqhan", function(){});
//		return false;
//	}); 
	
	//应急救援GIS首页-智能方案(方案节点一级弹窗回调事件)
//	GEventObject.dispatchEvent("EMS_AiPLAN_TASKNODECLK_EVENT");
});


/**
 * 初始化达拉特地图
 * @returns {BMap.Map}
 */
function initMap(){
	//地图本地根据IP地址定位以及添加标尺(禁止点击地图上的地点弹出百度详情)
	var map = new BMap.Map("portalMap", {enableMapClick: false, minZoom: 6, maxZoom: 18}); // 创建Map实例
	map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放
	
	//修改地图显示样式
	var mapStyle = [
					{
					    "featureType": "poi",
					    "elementType": "all",
					    "stylers": {
					              "visibility": "off"
					    }
					},
	                {"featureType" : "land",
	                	"elementType": "geometry",
	                	"stylers": {
	                		"color": "#24252b"
	                	}
	                },
	                {"featureType": "road",
	                	"elementType": "geometry",
	                	"stylers": {
	                		"color": "#171717",
	                		"hue": "#171717",
	                		"weight": "0.1",
	                		"lightness": -6,
	                		"saturation": -15
	                	}
	                },
	                {"featureType": "building",
	                	"elementType": "geometry",
	                	"stylers": {
	                		"color": "#2a2b2e"
	                	}
	                },
	                {"featureType": "highway",
	                	"elementType": "all",
	                	"stylers": {
	                		"lightness": -42,
	                		"saturation": -91
	                	}
	                },
	                {"featureType": "arterial",
	                	"elementType": "geometry",
	                	"stylers": {
	                		"lightness": -77,
	                		"saturation": -94
	                	}
	                },
	                {"featureType": "green",
	                	"elementType": "geometry",
	                	"stylers": {
	                		"color": "#1b1b1b"
	                	}
	                },	
	                {"featureType": "subway",
	                	"elementType": "geometry.stroke",
	                	"stylers": {
	                		"color": "#181818"
	                	}
	                },
	                {"featureType": "railway",
	                	"elementType": "geometry",
	                	"stylers": {
	                		"lightness": -52
	                	}
	                },
	                {"featureType": "all",
	                	"elementType": "labels.text.stroke",
	                	"stylers": {
	                		"color": "#313131"
	                	}
	                },	
	                {"featureType": "all",
	                	"elementType": "labels.text.fill",
	                	"stylers": {
	                		"color": "#8b8787"
	                	}
	                },	
	                {"featureType": "manmade",
	                	"elementType": "geometry",
	                	"stylers": {
	                		"color": "#1b1b1b"
	                	}
	                },
	                {"featureType": "local",
	                	"elementType": "geometry",
	                	"stylers": {
	                		"lightness": -75,
	                		"saturation": -91
	                	}
	                },	
	                {"featureType": "subway",
	                	"elementType": "geometry",
	                	"stylers": {
	                		"lightness": -65
	                	}
	                },	
	                {"featureType": "railway",
	                	"elementType": "all",
	                	"stylers": {
	                		"lightness": -40
	                	}
	                },		
	                {"featureType": "road",
	                	"elementType": "geometry",
	                	"stylers": {
	                		"color": "#171717",
	                		"hue": "#041e3b",
	                		"weight": "1.0",
	                		"lightness": -12,
	                		"saturation": -15
	                	}
	                },	
	                {"featureType": "water",
	                	"elementType": "geometry",
	                	"stylers": {
	                		"color": "#041e3b",
	                		"hue": "#041e3b",
	                		"weight": "0.1",
	                		"lightness": -12,
	                		"saturation": -15
	                	}
	                }	
	                ];
	
	//设置地图样式
//	map.setMapStyle({styleJson : mapStyle});
	
	//设置地图范围为达拉特(参数为 西南点坐标、东北点坐标)
//	var dltBound = new BMap.Bounds(new BMap.Point(109.186042, 39.791787), new BMap.Point(111.238059, 40.909685));
//	try {	
//		BMapLib.AreaRestriction.setBounds(map, dltBound);
//	} catch (e) {
//		console.log("区域限定错误");
//	}
	//默认中心位置为达拉特
	map.centerAndZoom(new BMap.Point(110.032, 40.418), 11);
	
	//左下角添加比例尺控件
	map.addControl(new BMap.ScaleControl({anchor: BMAP_ANCHOR_BOTTOM_LEFT})); 
	
	//添加地图类型控件
//	map.addControl(new BMap.MapTypeControl()); 
	
//	function showInfo(e){
//		alert(e.point.lng + ", " + e.point.lat);
//	}
//	map.addEventListener("click", showInfo);
	return map;
}

/**
 * 模拟测试点位
 */
//function initMapPts(event,type,radius) {
	//清除地图上所有覆盖物
//	window.map.clearOverlays();
	//初始化地图
//	var map = initMap();
	//事件标题
//	$("#curCaseTitle").html(event.eventname);
	//事故信息maker
//	var eventMarker;
	//事故坐标
//	if (type == "eventInfo") {
//		//事件经纬度赋值，便于以事件为中心画圆， 先清空后赋值
//		$("#eventlongitude").val("");
//		$("#eventlatitude").val("");
//		$("#eventlongitude").val(event.longitude);
//		$("#eventlatitude").val(event.latitude);
//		window.evnPt = new BMap.Point(event.longitude, event.latitude);
//		
//		eventMarker = new BMap.Marker(window.evnPt, {"title":event.eventname });
//		//测试点位点击弹窗事件
//		var content = "事故原因："+event.reason+"<br/>"+"事故地点："+event.address+"<br/>"+"经度："+event.longitude+"<br/>"+"纬度："+event.latitude;;
//		var infoWindow = new BMap.InfoWindow(content, {
//			width: 100,
//			height: 106,
//			title:"事故名称:"+event.eventname,
//			enableMessage: false
//		});
//		eventMarker.addEventListener("click", function() {
//			window.map.openInfoWindow(infoWindow, eventMarker.getPosition());
//		});
//		
//		window.map.addOverlay(eventMarker);
//	}
	
	//视频监控定位坐标
//	var videoMaker;//初始化视频maker
//	var probeMarker;//初始化探头maker
//	if(type=="video"){
//		videoMaker = new BMap.Marker(new BMap.Point(event.longitude, event.latitude), {"title": event.videoname});
//		//测试点位点击弹窗事件
//		var content = "视频名称："+event.videoname+"<br/>"+"安装地址："+event.address+"<br/>"+"经度："+event.longitude+"<br/>"+"纬度："+event.latitude;
//		var infoWindow = new BMap.InfoWindow(content, {
//			width: 100,
//			height: 106,
//			title:"视频编号："+event.videonum,
//			enableMessage: false
//		});
//		//显示坐标位置面板信息
//		window.map.openInfoWindow(infoWindow, videoMaker.getPosition());
//		
//		window.map.addOverlay(videoMaker);
//		
//	}
	
	//探头定位坐标
//	if(type=="probe"){
//		probeMarker = new BMap.Marker(new BMap.Point(event.longitude, event.latitude), {"title": event.probename});
//		//测试点位点击弹窗事件
//		var content = "探头名称："+event.probename+"<br/>"+"安装地址："+event.address+"<br/>"+"经度："+event.longitude+"<br/>"+"纬度："+event.latitude;
//		var infoWindow = new BMap.InfoWindow(content, {
//			width: 100,
//			height: 106,
//			title:"探头编号："+event.probenum,
//			enableMessage: false
//		});
//		//显示坐标位置面板信息
//		window.map.openInfoWindow(infoWindow, probeMarker.getPosition());
//		
//		window.map.addOverlay(probeMarker);
//		
//	}
	
	//搜索资源
//	var resourceMaker;//初始化搜索资源maker
//	if (type== "seacherResource") {
//		resourceMaker = new BMap.Marker(new BMap.Point(event.longitude, event.latitude),{"title": event.resname});
//		//测试点位点击弹窗事件
//		var content = "资源类型："+event.restype+"<br/>"+"值班电话："+event.resphone+"<br/>"+"详细地址："+event.resaddress;
//		var infoWindow = new BMap.InfoWindow(content, {
//			width: 100,
//			height: 106,
//			title:"<font size='3'>"+event.resname+"</font>"+'<hr style="border:none;border-top: 1px solid #555555;margin-bottom:10px;margin-top:2px" />',
//			enableMessage: false
//		});
//		//显示坐标位置面板信息
//		resourceMaker.addEventListener("click", function() {
//			window.map.openInfoWindow(infoWindow, resourceMaker.getPosition());
//		});
//		
//		window.map.addOverlay(resourceMaker);
//	}
	
	
	
//	window.map.centerAndZoom(new BMap.Point(event.longitude, event.latitude), 11);
	
//	window.mapDicUtil = new MapUtil();
	//应急救援-事故信息坐标添加到地图上
//	if (type=="eventInfo") {
//		window.mapDicUtil.put("1", eventMarker);
//	}
//	//应急救援-视频监控坐标添加到地图上
//	if(type=="video"){
//		window.mapDicUtil.put("2", videoMaker);
//	}
//	//应急救援-周边监测点坐标添加到地图上
//	if(type=="probe"){
//		window.mapDicUtil.put("3", probeMarker);
//	}
//	//应急救援-搜索资源添加到地图上
//	if (type=="seacherResource") {
//		window.mapDicUtil.put("4", resourceMaker);
//	}
//	//应急救援-资源评估添加到地图上
//	if (type=="resourceEva") {
//		for(var i=0;i<event.length;i++){
//			var resourceEvaMarker = new BMap.Marker(new BMap.Point(event[i].longitude, event[i].latitude),{"title":event[i].resourcename });
//			window.map.addOverlay(resourceEvaMarker);
//			 //给标注点添加点击事件。使用立即执行函数和闭包  
//	        (function() {  
//	            var thePoint = event[i];  
//	            resourceEvaMarker.addEventListener("click",function(){  
//	                showInfo(this,thePoint);  
//	            });  
//	        })();  
//	  
//			
//			
//			//测试点位点击弹窗事件
////			var content = "资源编码："+event[i].code+"<br/>"+"地址："+event[i].address+"<br/>"+"经度："+event[i].longitude+"<br/>"+"纬度："+event[i].latitude;;
////			var infoWindow = new BMap.InfoWindow(content, {
////				width: 100,
////				height: 106,
////				title:"资源名称:"+event[i].resourcename,
////				enableMessage: false
////			});
////			resourceEvaMarker.addEventListener("click", function() {
////				map.openInfoWindow(infoWindow, resourceEvaMarker.getPosition());
////			});
////			
////			map.addOverlay(resourceEvaMarker);
//	        window.map.centerAndZoom(new BMap.Point(event[i].longitude, event[i].latitude), 15);
//			//从第五条开始累加，避免与前面的key重复
////			window.mapDicUtil.put(i+5, resourceEvaMarker);
//		}
//		//以事件为中心，分析范围为半径画圆
//		initMapCircle(radius);
//	}
//		
//	if (type=="displayResourceEva") {
//		window.allResMarkArr = [];
//		displayResourceEvaMaker = new BMap.Marker(new BMap.Point(event.longitude, event.latitude),{"title": event.resname});
//		window.map.addOverlay(displayResourceEvaMaker);
//		//覆盖物存储到数组中
//		window.allResMarkArr.push(displayResourceEvaMaker);
//		(function() {  
//            var thePoint = event;  
//            displayResourceEvaMaker.addEventListener("click",function(){  
//            	showResourceInfo(this,thePoint);  
//            });  
//        })(); 
//		
//		window.map.centerAndZoom(new BMap.Point(event.longitude, event.latitude), 15);
//		initMapCircle(radius);
//	}
//}

//标记物资仓库、救援队伍位置
//function initResMarks(event,radius){
//	//清除资源评估点位标记
//	if (window.allResMarkArr) {
//		if (0 < window.allResMarkArr.length) {
//			_.map(window.allResMarkArr, function(tmpPolyObj, index) {
//				window.map.removeOverlay(tmpPolyObj);
//			});
//		}
//		window.allResMarkArr = [];
//	}else{		
//		window.allResMarkArr = [];
//	}
//	for(var i=0;i<event.length;i++){
//		var resourceEvaMarker = new BMap.Marker(new BMap.Point(event[i].longitude, event[i].latitude),{"title":event[i].resourcename });
//		window.map.addOverlay(resourceEvaMarker);
//		//覆盖物存储到数组中
//		window.allResMarkArr.push(resourceEvaMarker);
//		 //给标注点添加点击事件。使用立即执行函数和闭包  
//        (function() {  
//            var thePoint = event[i];  
//            resourceEvaMarker.addEventListener("click",function(){  
//                showInfo(this,thePoint);  
//            });  
//        })(); 
//        window.map.centerAndZoom(new BMap.Point(event[i].longitude, event[i].latitude), 15);		
//	}
//	initMapCircle(radius)
//}
//点击单个资源时加载
//function initOneResMarks(event,radius) {
//	//清除资源评估点位标记
//	if (window.allResMarkArr) {
//		if (0 < window.allResMarkArr.length) {
//			_.map(window.allResMarkArr, function(tmpPolyObj, index) {
//				window.map.removeOverlay(tmpPolyObj);
//			});
//		}
//		window.allResMarkArr = [];
//	}
//	displayResourceEvaMaker = new BMap.Marker(new BMap.Point(event.longitude, event.latitude),{"title": event.resname});
//	window.map.addOverlay(displayResourceEvaMaker);
//	//覆盖物存储到数组中
//	window.allResMarkArr.push(displayResourceEvaMaker);
//	(function() {  
//        var thePoint = event;  
//        displayResourceEvaMaker.addEventListener("click",function(){  
//        	showResourceInfo(this,thePoint);  
//        });  
//    })(); 
//	
//	window.map.centerAndZoom(new BMap.Point(event.longitude, event.latitude), 15);
//	initMapCircle(radius);
//}

//显示信息窗口，显示标注点的信息。  
//function showInfo(thisMaker,point){  
//	//测试点位点击弹窗事件
//	var content = "资源编码："+point.code+"<br/>"+"地址："+point.address+"<br/>"+"经度："+point.longitude+"<br/>"+"纬度："+point.latitude;;
//    var infoWindow = new BMap.InfoWindow(content);  // 创建信息窗口对象  
//    thisMaker.openInfoWindow(infoWindow);   //图片加载完毕重绘infowindow  
//   }  

//显示信息窗口，显示标注点的信息。  
//function showResourceInfo(thisMaker,point){  
//	//测试点位点击弹窗事件
//	var content = "资源名称："+point.resourcename+"<br/>"+"资源类型:"+point.typename+"<br/>"+"经度："+point.longitude+"<br/>"+"纬度："+point.latitude;;
//    var infoWindow = new BMap.InfoWindow(content);  // 创建信息窗口对象  
//    thisMaker.openInfoWindow(infoWindow);   //图片加载完毕重绘infowindow  
//   } 

/**
 * 事故发生区域为圆心做覆盖
 * @param map
 * @param event
 * @param radius
 */
//function initMapCircle(radius) {
//	//定义事故发生地为圆心
//	var longitude = $("#eventlongitude").val();
//	var latitude = $("#eventlatitude").val();
//	var mPoint = new BMap.Point(longitude, latitude);
//	var circle =  new BMap.Circle(mPoint,radius*1000,{strokeColor: "blue",
//		strokeOpacity:0.3,
//        strokeWeight: 1,
////        fillColor: "#E2E8F1",
//        fillColor: "blue",
//        fillOpacity: 0.3});
//	window.map.addOverlay(circle);
//	window.allResMarkArr.push(circle);
//}


/**
 * 初始化加载GIS测量工具
 */
//function initMesTools() {
//	var overlayComplete = function(e) {
//		//			 		alert("绘制完成后公共回调返回长度或面积值 -" + e.calculate + "-米或平方米");
//		//			 		GeoUtils.getPolygonArea(e.overlay);
//					    	window.allMesOverlays.push(e.overlay);
//					    	
//					    	//测试加载在自己所绘制区域的点位
//					    	if (!(window.mapDicUtil.isEmpty())) {
//					    		var allCurPtArr = window.mapDicUtil.values();
//					    		for (var i = 0; i < allCurPtArr.length; ++i) {
//					    			//根据绘制图形种类进行点位是否筛选
//					    			var isInDrawOverLay = false;
//					    			if (BMAP_DRAWING_CIRCLE == e.drawingMode) {
//					    				if (BMapLib.GeoUtils.isPointInCircle(allCurPtArr[i].getPosition(), e.overlay)) {
//					    					isInDrawOverLay = true;
//						    			} 
//					    			} else if (BMAP_DRAWING_POLYLINE == e.drawingMode) {
//					    				if (BMapLib.GeoUtils.isPointOnPolyline(allCurPtArr[i].getPosition(), e.overlay)) {
//					    					isInDrawOverLay = true;
//						    			}
//					    			} else if (BMAP_DRAWING_POLYGON == e.drawingMode) {
//					    				if (BMapLib.GeoUtils.isPointInPolygon(allCurPtArr[i].getPosition(), e.overlay)) {
//					    					isInDrawOverLay = true;
//						    			}
//					    			} else if (BMAP_DRAWING_RECTANGLE == e.drawingMode) {
//					    				if (BMapLib.GeoUtils.isPointInRect(allCurPtArr[i].getPosition(), e.overlay.getBounds())) {
//					    					isInDrawOverLay = true;
//						    			}
//					    			} 
//		//			    			else if (BMAP_DRAWING_MARKER == e.drawingMode) {
//		//			    				continue;
//		//			    			}
//					    			
//					    			if (isInDrawOverLay) {
//					    				allCurPtArr[i].show();
//					    			} else {
//					    				allCurPtArr[i].hide();
//					    			}
//					    		}
//					    	}
//					    };
//					    
//						 //存储测量时所画出的覆盖物
//						 var styleOptions = {
//						        strokeColor: "red",    //边线颜色。
//						        fillColor: "red",      //填充颜色。当参数为空时，圆形将没有填充效果。
//						        strokeWeight: 2,       //边线的宽度，以像素为单位。
//						        strokeOpacity: 0.8,	   //边线透明度，取值范围0 - 1。
//						        fillOpacity: 0.2,      //填充的透明度，取值范围0 - 1。
//						        strokeStyle: "solid" //边线的样式，solid或dashed。
//						 };
//					    
//					    //实例化鼠标绘制工具
//					    window.drawingManager = new BMapLib.DrawingManager(window.map, {
//					        isOpen: false, //是否开启绘制模式
//					        drawingType: BMAP_DRAWING_CIRCLE,
//					        enableDrawingTool: true, //是否显示工具栏
//					        enableCalculate: false,//是否开启计算模式，可以在绘制完图形后返回所绘制的  折线长度 或 多边形面积 或 长方形面积 或 圆面积；单位为米
//					        drawingToolOptions: {
//					            anchor: BMAP_ANCHOR_TOP_RIGHT, //位置
//					            offset: new BMap.Size(20, 65), //偏离值
//					            drawingModes : [
//					                            BMAP_DRAWING_CIRCLE,
//					                            BMAP_DRAWING_POLYLINE,
//					                            BMAP_DRAWING_POLYGON,
//					                            BMAP_DRAWING_RECTANGLE 
//					                         ]
//					        },
//					        circleOptions: styleOptions, //圆的样式
//					        polylineOptions: styleOptions, //线的样式
//					        polygonOptions: styleOptions, //多边形的样式
//					        rectangleOptions: styleOptions //矩形的样式
//					    });  
//					    
//						 //绘制工具公共总监听事件，用于获取绘制结果
//					    window.drawingManager.addEventListener("overlaycomplete", overlayComplete);
//					    
//					    //绘制工具圆监听事件，用于获取绘制结果
//					    window.drawingManager.addEventListener("circlecomplete", function(circle) {
//		//			    	alert("圆中心点-" + JSON.stringify(circle.getCenter()));
//		//			    	alert("圆半径-" + circle.getRadius() + "米");
//		//			    	alert("圆范围-" + JSON.stringify(circle.getBounds()));
//		//			    	alert("圆面积" + (3.1415926 * circle.getRadius() * circle.getRadius())  + "平方米");
//					    	
//					    });
//					   
//					    //绘制工具点位监听事件，用于获取绘制结果
//		//			    window.drawingManager.addEventListener("markercomplete", function(marker) {
//		////			    	alert("点坐标-" + JSON.stringify(marker.getPosition()));
//		//			    });
//					    
//					    //绘制工具多边形监听事件，用于获取绘制结果
//					    window.drawingManager.addEventListener("polygoncomplete", function(polygon) {
//		//			    	alert("多边形边界点经纬度-" + JSON.stringify(polygon.getPath()));
//		//			    	alert("多边形面积" + BMapLib.GeoUtils.getPolygonArea(polygon.getPath()));
//					    	
//					    });
//		
//					    //绘制工具折线监听事件，用于获取绘制结果
//					    window.drawingManager.addEventListener("polylinecomplete", function(polyline) {
//		//			    	alert("折线边界点经纬度-" + JSON.stringify(polyline.getPath()));
//		//			    	alert("折线长" + BMapLib.GeoUtils.getPolylineDistance(polyline.getPath()) + "米");
//					    	
//					    });
//					    
//					    //绘制工具长方形监听事件，用于获取绘制结果
//					    window.drawingManager.addEventListener("rectanglecomplete", function(polygon) {
//		//			    	alert("长方形边界点经纬度-" + JSON.stringify(polygon.getPath()));
//		//			    	alert("长方形面积" + BMapLib.GeoUtils.getPolygonArea(polygon.getPath()) + "平方米");
//					    	
//					    });
//}

/**
 * 清除上次由测量工具所留下的覆盖物
 */
//function clearAllMesOverlays(allMesOverlays) {
//	if (window.drawingManager) {
//		//关闭地图的绘制状态
//		window.drawingManager.disableCalculate();
//		window.drawingManager.close();
//		window.drawingManager = null;
//		
//		//移除测量画图工具栏
//		$(".BMapLib_Drawing_panel").parent().remove();
//	} 
//	
//	if (allMesOverlays && 0 < allMesOverlays.length) {
//		for(var i = 0; i < allMesOverlays.length; i++){
//			map.removeOverlay(allMesOverlays[i]);
//		}
//		allMesOverlays.length = 0;
//	}
//}


/**
 * 格式化左上方手风琴导航布局
 */
function metisMenuFmt() {
	new gnMenu(document.getElementById("gn-menu"));
	
	$(".gn-menu").children("li").children("a").click(function() {
		if ("应急救援" != $(this).text()) {
			$(".subnav").show();
			$(".subnav").css("visibility", "visible");
		} else {
			$(".subnav").hide();
			$(".subnav").css("visibility", "hidden");
		}
	});

	$(".gn-submenu li").click(function() {
		$(".gn-submenu li").removeClass("active");
		$(this).addClass("active");
		$(".gn-menu-wrapper").addClass("gn-open-ok");
		
		if ("应急救援" != $(this).parent().prev().text()) {
			$(".subnav").show();
			$(".subnav").css("visibility", "visible");
		} else {
			$(".subnav").hide();
			$(".subnav").css("visibility", "hidden");
		}
	});
}

/**
 * 左侧导航菜单触发生成二级表格内容
 */
function renderLTSubGrid(srchType, entname) {
	//默认清除地图上历史覆盖物
	window.map.clearOverlays();
	
	//隐藏应急救援相关标识
//	$("#curCaseTitle, #caseSwitchBtn").hide();
	
	//定义存储所有企业和相关应急物资集合类
	if (window.curEntAndMatlsDic) {
		window.curEntAndMatlsDic.clear();
	} else {
		window.curEntAndMatlsDic = new MapUtil();
	}
	
	var srchUrl = null,
	    param = {},
	    retEntAndMatlsCnt = 0;
	if ("syqy" == srchType) {
		//所有企业
		srchUrl = "olgis/gisOperBuss/businessAllList";
	} else if ("zdwxy" == srchType) {
		//重大危险源
		srchUrl = "olgis/gisOperBuss/businessByDanger";
		param = {"danger": "1", "distCode": "310115"};
	} else if ("whqy" == srchType) {
		//危化企业
		srchUrl = "olgis/gisOperBuss/businessByChemical";
		param = {"chemical": "1"};
	} else if ("aqyh" == srchType) {
		//安全隐患暂无 --暂拟与危化企业相同
		
//		srchUrl = "olgis/gisOperBuss/businessByChemical";
//		param = {"chemical": "1"};
		srchUrl = "hiddendanger/hdientcount/hdientListGIS";
		param = {"districtid": ""};
	} else if ("yjzy" == srchType) {
		//应急资源暂无 --暂拟与危化企业相同
		
		srchUrl = "ems/emscount/loadList";
//		srchUrl = "olgis/gisOperBuss/businessByChemical";
//		param = {"chemical": "1"};
	} else if ("wxhxp" == srchType) {
		//危险化学品
		srchUrl = "olgis/gisOperBuss/businessByDangerType";
		param = {"dangertype": "1"};
	} else if ("rql" == srchType) {
		//燃气类
		srchUrl = "olgis/gisOperBuss/businessByDangerType";
		param = {"dangertype": "2"};
	} else if ("gk" == srchType) {
		//港口
		srchUrl = "olgis/gisOperBuss/businessByDangerType";
		param = {"dangertype": "3"};
	} else if ("sc" == srchType) {
		//生产
		srchUrl = "olgis/gisOperBuss/businessByChemicalType";
		param = {"chemicaltypeid": "3"};
	} else if ("jy" == srchType) {
		//经营
		srchUrl = "olgis/gisOperBuss/businessByChemicalType";
		param = {"chemicaltypeid": "4"};
	} else if ("ys" == srchType) {
		//运输
		srchUrl = "olgis/gisOperBuss/businessByChemicalType";
		param = {"chemicaltypeid": "5"};
	} else if ("sy" == srchType) {
		//使用
		srchUrl = "olgis/gisOperBuss/businessByChemicalType";
		param = {"chemicaltypeid": "6"};
	} else if ("fqwcz" == srchType) {
		//废弃物处置
		srchUrl = "olgis/gisOperBuss/businessByChemicalType";
		param = {"chemicaltypeid": "7"};
	} else if ("wxxk" == srchType) {
		//无需许可
		srchUrl = "olgis/gisOperBuss/businessByChemicalType";
		param = {"chemicaltypeid": "2"};
	} else if ("yhfb" == srchType) {
		//隐患分布
		srchUrl = "hiddendanger/hdientcount/hdientListGIS";
		param = {districtid: ""};
	} else if ("yjjg" == srchType) {
		//应急机构
		srchUrl = "ems/emsresorg/loadList";
	} else if ("yjck" == srchType) {
		//应急仓库
		srchUrl = "ems/emsresdepos/loadList";
	} else if ("yjdw" == srchType) {
		//应急队伍
		srchUrl = "ems/emsresteam/loadList";
	} else if ("yjwz" == srchType) {
		//应急物资
		srchUrl = "ems/emsresmaterial/loadList";
	}
	
	param.entname = entname;
	
	//查询相应种类下的企业数量
	$.ajax({
		type: "post",
		url: BASE_URL + srchUrl,
		data: param,
		dataType: "json",
		cache: false,
		global: false,
		async: false,
		success: function(retData) {
			$("#subGridCon").empty();
			if (retData.length == 0 || retData == null) {
				if ("yjjg" == srchType) {
					//应急机构
					toast("该类型内没有应急机构!");
				} else if ("yjck" == srchType) {
					//应急仓库
					toast("该类型内没有应急仓库!");
				} else if ("yjdw" == srchType) {
					//应急队伍
					toast("该类型内没有应急队伍!");
				} else if ("yjwz" == srchType) {
					//应急物资
					toast("该类型内没有应急物资!");
				}else if ("yjzy" == srchType) {
					//应急资源
					toast("该类型内没有应急资源!");
				} else {
					toast("该类型内没有企业!");
				}
			} else {
				var subGridDOM = "";
				retEntAndMatlsCnt = retData.length;//所有企业或应急物资个数
				if ("yjzy" == srchType) {
					var orgArr = sameData(retData[0].orgData,"yjjg");
					var deposArr = sameData(retData[0].deposData,"yjck");
					var teamArr =sameData(retData[0].teamData,"yjdw");
					var materialArr = sameData(retData[0].materialData,"yjwz");
					retEntAndMatlsCnt =retData[0].resLenght;
					retData = _.union(orgArr,deposArr,teamArr,materialArr);
				}
				
				_.map(retData, function(tmpData, index) {
					var tmpName = null,//当前点位名称
						tmpId = null,//当前点位id
						tmpPopCon = null;
	//					tmpLat = null,//当前点位GIS维度
	//					tmpLng = null,//当前点位GIS经度
					
					if ("yjjg" == srchType) {
						//应急机构
						tmpName = tmpData.ORGNAME;
						tmpId = tmpData.ORGID;
						tmpData.BASE_URL = BASE_URL;
						
						//生成弹窗模板内容
						var yjjgPopWinTpt = _.template($("#yjjgPopWinTpt").html());
						tmpPopCon = yjjgPopWinTpt(tmpData);
						
//						tmpLat = tmpData.LATITUDE;
//						tmpLng = tmpData.LONGITUDE;
					} else if ("yjck" == srchType) {
						//应急仓库
						tmpName = tmpData.STOREHOUSE;
						tmpId = tmpData.EMSDEPOSID;
						tmpData.BASE_URL = BASE_URL;
						
						//生成弹窗模板内容
						var yjckPopWinTpt = _.template($("#yjckPopWinTpt").html());
						tmpPopCon = yjckPopWinTpt(tmpData);
						
//						tmpLat = tmpData.LATITUDE;
//						tmpLng = tmpData.LONGITUDE;
					} else if ("yjdw" == srchType) {
						//应急队伍
						//队伍级别
						tmpData.TEAMRANK = SelectOption.getTeamRank(tmpData.TEAMRANK);
						//救援队伍专业
						tmpData.RESCUEPROFESSION = SelectOption.getTeamProfessional(tmpData.RESCUEPROFESSION);
						//队伍适用行业
						tmpData.TEAMINDUSTRY = SelectOption.getTeamBusiness(tmpData.TEAMINDUSTRY);
						// 擅长处置事故类型
						tmpData.DEALTYPE = SelectOption.getTeamDealtype(tmpData.DEALTYPE);
						// 队伍资质
						tmpData.TEAMQUALIFY = SelectOption.getTeamQualify(tmpData.TEAMQUALIFY);
						// 队伍等级
						tmpData.TEAMLEVEL = SelectOption.getTeamLevel(tmpData.TEAMLEVEL);
						//队伍类型
						tmpData.TEAMTYPEID = SelectOption.getTeamType(tmpData.TEAMTYPEID);
						
//						console.log("队伍级别" + TEAMRANK);
//						console.log("救援队伍专业" + RESCUEPROFESSION);
//						console.log("队伍适用行业"+TEAMINDUSTRY);
//						console.log("擅长处置事故类型" + DEALTYPE);
//						console.log("队伍资质"+TEAMQUALIFY);
//						console.log("队伍等级" +TEAMRANK);
//						console.log("队伍类型" + TEAMTYPEID);
						
						tmpName = tmpData.TEAMNAME;
						tmpId = tmpData.TEAMID;
						tmpData.BASE_URL = BASE_URL;
						//生成弹窗模板内容
						var yjdwPopWinTpt = _.template($("#yjdwPopWinTpt").html());
						tmpPopCon = yjdwPopWinTpt(tmpData);
						
//						tmpLat = tmpData.LATITUDE;
//						tmpLng = tmpData.LONGITUDE;
					} else if ("yjwz" == srchType) {
		
						//应急物资
						tmpName = tmpData.MATERIALNAME;
						tmpId = tmpData.EMSMATERIALID;
						tmpData.BASE_URL = BASE_URL;
						
						//生成弹窗模板内容
						var yjwzPopWinTpt = _.template($("#yjwzPopWinTpt").html());
						tmpPopCon = yjwzPopWinTpt(tmpData);
						
//						tmpLat = tmpData.LATITUDE;
//						tmpLng = tmpData.LONGITUDE;
					}else if("yjzy" == srchType){
						tmpName = tmpData.resName;
						tmpId = tmpData.resId;
						tmpData.BASE_URL = BASE_URL;
						if (tmpData.flag=="team") {
							//应急队伍
							//队伍级别
							tmpData.TEAMRANK = SelectOption.getTeamRank(tmpData.TEAMRANK);
							//救援队伍专业
							tmpData.RESCUEPROFESSION = SelectOption.getTeamProfessional(tmpData.RESCUEPROFESSION);
							//队伍适用行业
							tmpData.TEAMINDUSTRY = SelectOption.getTeamBusiness(tmpData.TEAMINDUSTRY);
							// 擅长处置事故类型
							tmpData.DEALTYPE = SelectOption.getTeamDealtype(tmpData.DEALTYPE);
							// 队伍资质
							tmpData.TEAMQUALIFY = SelectOption.getTeamQualify(tmpData.TEAMQUALIFY);
							// 队伍等级
							tmpData.TEAMLEVEL = SelectOption.getTeamLevel(tmpData.TEAMLEVEL);
							//队伍类型
							tmpData.TEAMTYPEID = SelectOption.getTeamType(tmpData.TEAMTYPEID);
							
							var yjdwPopWinTpt = _.template($("#yjdwPopWinTpt").html());
							tmpPopCon = yjdwPopWinTpt(tmpData);
						}else if(tmpData.flag=="org"){
							var yjjgPopWinTpt = _.template($("#yjjgPopWinTpt").html());
							tmpPopCon = yjjgPopWinTpt(tmpData);
						}else if(tmpData.flag=="depos"){
							var yjckPopWinTpt = _.template($("#yjckPopWinTpt").html());
							tmpPopCon = yjckPopWinTpt(tmpData);
						}else {
							var yjwzPopWinTpt = _.template($("#yjwzPopWinTpt").html());
							tmpPopCon = yjwzPopWinTpt(tmpData);
						}
					} else {
						//其它企业信息
						tmpName = tmpData.ENTNAME;
						tmpId = tmpData.BUSINESSINFOID;
						tmpData.BASE_URL = BASE_URL;
						//生成弹窗模板内容
						var entPopWinTpt = _.template($("#entPopWinTpt").html());
						tmpPopCon = entPopWinTpt(tmpData);
//						tmpLat = tmpData.LATITUDE;
//						tmpLng = tmpData.LONGITUDE;
					}
					
					//填充二级导航表格
					subGridDOM += "<div class='dojoxGridRow " + (0 == index % 2 ? "dojoxGridRowOdd" : "") + "' role='row' aria-selected='false' style=''> " +
								  "		<table class='dojoxGridRowTable' border='0' cellspacing='0' cellpadding='0' role='presentation' style='width: 216px;'>" + 
								  "			<tbody>" +
								  "				<tr>" +
							 	  "					<td tabindex='-1' role='gridcell' class='dojoxGridCell' idx='0' style='width:3em;'>" + (index + 1) + "</td>" +
							 	  "					<td tabindex='-1' role='gridcell' class='dojoxGridCell' idx='1' style='width:auto;' data-ptId='" + tmpId + "' >" +
							 	  "					<a href='javascript:void(0);' class='subGridPtName'>" + tmpName + "</a></td>" +
								  "				</tr>" +
								  "			</tbody>" +
								  "		</table>" +
								  "</div>";
					$("#subGridCon").html(subGridDOM);
					
					//定义GIS各点位
					var tmpPt = new BMap.Point(tmpData.LONGITUDE, tmpData.LATITUDE);
					var tmpMarker = new BMap.Marker(tmpPt, {"title": tmpName});
					
					//允许清除覆盖物
					tmpMarker.enableMassClear();
					
					//定义点位弹窗内容
	 				var tmpWindow = new BMap.InfoWindow(tmpPopCon, {
	 					width : 420,
	 					height : 220,
	 					title : "",
	 					enableMessage : false
	 				});
	 				
	 				//清除企业物资等map工具类中的历史信息
	 				if(window.curEntAndMatlsDic.containsKey(tmpId)){
	 					window.curEntAndMatlsDic.remove(tmpId);
	 				}
					
	 				//将点位存储至map集合工具类中
					window.curEntAndMatlsDic.put(tmpId, {
	 					"type": srchType,
	 					"data": tmpData,
	 					"marker": tmpMarker,
	 					"click": function() {
	 						//GIS上打开点位信息窗口
//	 						window.map.centerAndZoom(tmpPt, 11);
	 						window.map.panTo(tmpPt);
	 						
	 						//GIS点位弹窗内的type页切换
	 						if ("yjjg" != srchType && "yjwz" != srchType) {
	 							//定义点位信息窗口回调事件
		 						tmpWindow.addEventListener("open", function(){
		 							$("#tabMenu li").off("click").on("click", function() {
		 								$(this).addClass("active");
		 								$(this).siblings().removeClass("active");
		 								var $curTypeSilb = $(this).parent().parent().siblings();
		 								if ("1" == $(this).attr("data-flag")) {
		 									$curTypeSilb.find(".fstype").show();
		 									$curTypeSilb.find(".second").hide();
		 								} else {
		 									$curTypeSilb.find(".second").show();
		 									$curTypeSilb.find(".fstype").hide();
		 								}
		 							});
		 						});
	 						}
	 						
	 						tmpWindow.addEventListener("close", function(){});
	 						tmpWindow.addEventListener("clickclose", function(){});
	 						window.map.openInfoWindow(tmpWindow, tmpPt);
	 					}
					});
					
					//定义点位点击触发事件
					tmpMarker.addEventListener("click", function(){
	 					window.curEntAndMatlsDic.get(tmpId).click();
	 				});
					
					//将点位添加至地图
					window.map.addOverlay(tmpMarker);
					
					//默认选择第一个点位居中
					0 == index && 
					window.map.centerAndZoom(tmpPt, 11);
				});	
				
				//二级导航表格内容点位与与地图联动
				$(".subGridPtName").off("click").on("click", function() {
					window.curEntAndMatlsDic.get($(this).parent().attr("data-ptId"))
											.click();
				});
			}
		},
		error : function(err) {
			toast("系统繁忙!");
		}
	});
	return retEntAndMatlsCnt;
}



/**
 * 左上方应急救援导航子菜单弹窗
 * @param url
 * @param title
 * @param width
 * @param height
 * @param winType
 */
//function openEmsResWin(url, title, width, height, winType, callback) {
//	if (-1 == _.indexOf(window.allMultiWinFlagArr, winType)) {
//		window.allMultiWinFlagArr.push(winType);
//		openWinWithCloseCallback(url, title, width, height, true, null, function() {
//			//清除对左侧导航菜单的记录
//			window.allMultiWinFlagArr.removeByValue(winType);
//			
//			//执行自定义回调事件
//			if (callback) {
//				callback();
//			}
//		}, true);
//	}
//}

/**
 * 数组删除制定元素
 */
Array.prototype.removeByValue = function(val) {
	for(var i=0; i< this.length; i++) {
		if(this[i] == val) {
		   this.splice(i, 1);
	       break;
	    }
	}
}

/**
 * 数组是否包含某元素
 */
Array.prototype.contains = function ( needle ) {
	  for (i in this) {
	    if (this[i] == needle) return true;
	  }
	  return false;
}

/**
 * 统一资源名称和id
 */
function sameData(data,type){
	var resArr = new Array();
	if (type == "yjjg") {
		_.map(data,function(res,index,index){
			res.resName = res.ORGNAME;
			res.resId = res.ORGID;
			res.flag ="org";
			resArr.push(res);
		});
		return resArr;
	}else if(type == "yjck"){
		_.map(data,function(res,index){
			res.resName = res.STOREHOUSE;
			res.resId = res.EMSDEPOSID;
			res.flag ="depos";
			resArr.push(res);
		});
		return resArr;
	}else if(type == "yjdw"){
		_.map(data,function(res,index){
			res.resName = res.TEAMNAME;
			res.resId = res.TEAMID;
			res.flag ="team";
			resArr.push(res);
		});
		return resArr;
	}else{
		_.map(data,function(res,index){
			res.resName = res.MATERIALNAME;
			res.resId = res.EMSMATERIALID;
			res.flag ="material";
			resArr.push(res);
		});
		return resArr;
	}
}

/**
 * 初始化应急救援
 */
//function initEventInfo(map){
//	//获取事故信息,按时间倒序
//	$.ajax({
//		type : "post",
//		url : BASE_URL + "ems/emssucevent/loadList",
//		data : {},
//		success : function(data) {
//			if (data) {
//				//最近事件名称
//				$("#eventid").val(data.events[0].eventid);
//				//初始化点位信息
//				initMapPts(data.events[0],"eventInfo");
//			}
//		},
//		error : function() {
//			parent.toast("系统繁忙...");
//		}
//	});
//}

//--------------------事故模拟-start---------------------------------------------------
/**
 * 初始化事故模拟地图各覆盖物加载
 * @param paraObj
 * @returns
 */
//function initEvnAnaMap(paraObj) {
//	//加载事故模拟发生中心点
////	var cenPt = new BMap.Point(paraObj.cenPt.lng, paraObj.cenPt.lat);
////	window.map.addOverlay(new BMap.Marker(cenPt, {"title": "事故模拟中心点"}));
//	
//	//加载事故模拟结果覆盖物----------------------------------------------------------------
//	//清除历史点位覆盖物和防护目标点位并定义所有事故模拟结果覆盖物
//	if (window.allEvnAnaPolyArr && 0 < window.allEvnAnaPolyArr.length) {
//		_.map(window.allEvnAnaPolyArr, function(tmpPolyObj, index) {
//			window.map.removeOverlay(tmpPolyObj.poly);
//		});
//	}
//	window.allEvnAnaPolyArr = [];
//	var curLowPoly = null,
//		curMidPoly = null,
//		curHighPoly = null;
//	
//	//加载低浓度覆盖物
//	if (paraObj.low.pts && 0 < paraObj.low.pts.length) {
//		var lowPtArr = [];
//		_.map(paraObj.low.pts, function(lowPt, i) {
//			lowPtArr.push(new BMap.Point(lowPt.lng, lowPt.lat));
//		});
////		alert(lowPtArr);
//		var lowPoly = new BMap.Polygon(lowPtArr, {"fillColor": "#16e787"});
////		var lowPoly = new BMap.Polygon(lowPtArr, {"fillColor": paraObj.low.color.replace(/99/, "#")});
////		alert(window.map);
//		curLowPoly = lowPoly;
//		window.map.addOverlay(lowPoly);
//	}
//	
//	//加载中等浓度覆盖物
//	if (paraObj.mid.pts && 0 < paraObj.mid.pts.length) {
//		var midPtArr = [];
//		_.map(paraObj.mid.pts, function(midPt, i) {
//			midPtArr.push(new BMap.Point(midPt.lng, midPt.lat));
//		});
//		
//		var midPoly = new BMap.Polygon(midPtArr, {"fillColor": "#f0ff4a"});
////		var midPoly = new BMap.Polygon(midPtArr, {"fillColor": paraObj.mid.color.replace(/99/, "#")});
//		curMidPoly = midPoly;
//		window.map.addOverlay(midPoly);
//	}
//	
//	//加载高浓度覆盖物
//	if (paraObj.high.pts && 0 < paraObj.high.pts.length) {
//		var highPtArr = [];
//		_.map(paraObj.high.pts, function(highPt, i) {
//			highPtArr.push(new BMap.Point(highPt.lng, highPt.lat));
//		});
//		
//		var highPoly = new BMap.Polygon(highPtArr, {"fillColor": "#fc5b6a"});
////		var highPoly = new BMap.Polygon(highPtArr, {"fillColor": paraObj.high.color.replace(/99/, "#")});
//		curHighPoly = highPoly;
//		window.map.addOverlay(highPoly);
//	}
//	
//	//按照高、中、低浓度顺序添加覆盖物
//	if (curHighPoly) {
//		window.allEvnAnaPolyArr.push({
//			"type": "high", 
//			"poly": curHighPoly
//		});
//		curHighPoly = null;
//	}
//	
//	if (curMidPoly) {
//		window.allEvnAnaPolyArr.push({
//			"type": "mid", 
//			"poly": curMidPoly
//		});
//		curMidPoly = null;
//	}
//	
//	if (curLowPoly) {
//		window.allEvnAnaPolyArr.push({
//			"type": "low", 
//			"poly": curLowPoly
//		});
//		curLowPoly = null;
//	}
//	
//	
//	//加载所有在覆盖物内的保护场所点位------------------------------------------------------------
//	//定义不同污染范围内的防护场所点位id数组
//	var lowAreaPtIdArr = [],
//		midAreaPtIdArr = [],
//		highAreaPtIdArr = [];
//	
//	if (paraObj.allEmsSucPlaces && 0 < paraObj.allEmsSucPlaces.length) {
//		//定义存储所有防护场所点位Map集合类
//		if (window.evnAnaPtDic) {
//			if (0 < window.evnAnaPtDic.size()) {
//				//清空地图上所有历史防护目标点位覆盖物
//				_.map(window.evnAnaPtDic.values(), function(tmpPtMap, index) {
//					window.map.removeOverlay(tmpPtMap.marker);
//				});
//				window.evnAnaPtDic.clear();
//			}
//		} else {
//			window.evnAnaPtDic = new MapUtil();
//		}
//		
//		//判断所有防护场所是否有点位在覆盖物内
//		var hasPtInPoly = false;
//		   
//		//遍历所有防护场所
//		_.map(paraObj.allEmsSucPlaces, function(tmpPlace, index) {
//			if (0 < allEvnAnaPolyArr.length) {
////				alert(tmpPlace.NAME);
//				var tmpPt = new BMap.Point(tmpPlace.LONGITUDE, tmpPlace.LATITUDE),
//				    isInPoly = false;
//				for (var i = 0; i < window.allEvnAnaPolyArr.length; ++i) {
//					//判断当前防护场所是否在覆盖物范围内
//					if (BMapLib.GeoUtils.isPointInPolygon(tmpPt, window.allEvnAnaPolyArr[i].poly)) {
//						if ("low" == window.allEvnAnaPolyArr[i].type) {
//							lowAreaPtIdArr.push(tmpPlace.PLACEID);
//						} else if ("mid" == window.allEvnAnaPolyArr[i].type) {
//							midAreaPtIdArr.push(tmpPlace.PLACEID);
//						} else if ("high" == window.allEvnAnaPolyArr[i].type) {
//							highAreaPtIdArr.push(tmpPlace.PLACEID);
//						} 
//						
//						var tmpMarker = new BMap.Marker(tmpPt, {"title": tmpPlace.NAME});
//						
//						//允许清除覆盖物
//						tmpMarker.enableMassClear();
//						
//						//定义点位弹窗内容
//						var tmpWindow = new BMap.InfoWindow("", {
//							width : 420,
//							height : 260,
//							title : "",
//							enableMessage : false
//						});
//						
//						//清除企业物资等map工具类中的历史信息
//						if(window.evnAnaPtDic.containsKey(tmpPlace.PLACEID)){
//							window.evnAnaPtDic.remove(tmpPlace.PLACEID);
//						}
//						
//						//将点位存储至map集合工具类中
//						window.evnAnaPtDic.put(tmpPlace.PLACEID, {
//							"data": tmpPlace,
//							"marker": tmpMarker,
//							"click": function() {
//								window.map.panTo(tmpPt);
//								//定义点位信息窗口回调事件
////								tmpWindow.addEventListener("open", function(){});
////							   	tmpWindow.addEventListener("close", function(){});
////								tmpWindow.addEventListener("clickclose", function(){});
////								window.map.openInfoWindow(tmpWindow, tmpPt);
//							}
//						});
//						
//						//定义点位点击触发事件
//						tmpMarker.addEventListener("click", function(){
//							window.evnAnaPtDic.get(tmpPlace.PLACEID).click();
//						});
//						
//						//将点位添加至地图
//						window.map.addOverlay(tmpMarker);
//						isInPoly = true;
//						hasPtInPoly = true;
//						break;
//					}
//				}
//				
//				//如果当前遍历点位不在任何覆盖物内，置空之前初始化的point对象
//				if (!isInPoly) {
//					tmpPt = null;
//				}
//			}
//		});
//		
//		//当所有防护场所点位都不在覆盖物内时，置空之前点位Map集合类对象
//		if (!hasPtInPoly) {
//			window.evnAnaPtDic = null;
//		}
//	}
//	
//	//默认当前模拟中心点居中---------------------------------------
//	window.map.centerAndZoom(window.evnPt, 16);
//	
//	//返回不同污染范围内的防护场所点位id数组
//	return {
//		"low": lowAreaPtIdArr,
//		"mid": midAreaPtIdArr,
//		"high": highAreaPtIdArr
//	};
//}

/**
 * 激活居中事故模拟中防护资源具体点位
 * @param ptId
 */
//function popEvnAnaPt(ptId) {
//	//默认居中显示所选中的防护资源点位
//	window.map.centerAndZoom(
//		   window.evnAnaPtDic.get(ptId).marker.getPosition(), 16);
//}

/**
 * 查询当前事故下是否曾经进行过事故模拟
 * @param evnId 当前事故id
 */
//function isEverEvnAna(evnId) {
//	var everEvnAnaFlag = false;
//	$.ajax({
//		type: "post",
//		url: BASE_URL + "ems/emssucsimulation/loadEvnAnaData",
//		data: {"curEvnId": evnId, "getEvnAnaCnt": 1},
//		async: false,
//		success: function(retData) {
//			if ("1" == retData.isEverEvnAna) {
//				everEvnAnaFlag = true;
//			}
//		}
//	});
//	return everEvnAnaFlag;
//}


/**
 * 查询当前事故下是否曾经进行过资源评估
 * @param evnId 当前事故id
 */
//function isEverResource(evnId) {
//	var everResourceFlag = false;
//	$.ajax({
//		type: "post",
//		url: BASE_URL + "ems/emssucresourceevaluation/getLatestsucData",
//		data: {"eventid": evnId, "getResourceCnt": 1},
//		async: false,
//		success: function(retData) {
//			if ("1" == retData.isEverResource) {
//				everResourceFlag = true;
//			}
//		}
//	});
//	return everResourceFlag;
//}

/**
 * 查询当前事故下是否曾经进行过综合预测
 * @param evnId 当前事故id
 */
//function isEverForecast(evnId) {
//	var everForecastFlag = false;
//	$.ajax({
//		type: "post",
//		url: BASE_URL + "ems/emssucigrforecast/loadbyeventid",
//		data: {"eventid": evnId, "getForecastCnt": 1},
//		async: false,
//		success: function(retData) {
//			if ("1" == retData.isEverForecast) {
//				everForecastFlag = true;
//			}
//		}
//	});
//	return everForecastFlag;
//}

/**
 * 加载当前事故下最新的事故模拟记录覆盖物或指定事故模拟id的覆盖物
 * @param curEvnId
 * @param tgtEvnAnaId
 */
//function addEvnAnaGisOverLays(curEvnId, tgtEvnAnaId, isGetData) {
//	var param = {},
//		curEvnAnaId = null;
//	//加载当前事故下最新的事故模拟记录覆盖物
//	if (curEvnId) {
//		param.curEvnId = curEvnId;
//	}
//	
//	//加载当前事故下指定事故模拟id的覆盖物
//	if (tgtEvnAnaId) {
//		param.tgtEvnAnaId = tgtEvnAnaId;
//	}
//	
//	$.ajax({
//		type: "post",
//		url: BASE_URL + "ems/emssucsimulation/loadEvnAnaData",
//		data: param,
//		async: false,
//		success: function(retData) {
//			if (retData) {
//				if (!isGetData) {
//					//地图加载污染区覆盖物
//					if ("" != retData.lowPts &&
//							"" != retData.midPts &&
//							"" != retData.highPts) {
//						//清除历史点位覆盖物和防护目标点位并定义所有事故模拟结果覆盖物
//						if (window.allEvnAnaPolyArr && 0 < window.allEvnAnaPolyArr.length) {
//							//当事故模拟GIS处于打开状态时
//							_.map(window.allEvnAnaPolyArr, function(tmpPolyObj, index) {
//								window.map.removeOverlay(tmpPolyObj.poly);
//							});
//							window.allEvnAnaPolyArr = null;
//						}
//						
//						addEvnAnaMapPolys(retData);
//					}
//					
//					//地图加载防护场所点位覆盖物
//					if (0 < retData.sucPlaceList.length) {
//						if (window.evnAnaPtDic && 0 < window.evnAnaPtDic.size()) {
////						//清空地图上所有历史防护目标点位覆盖物
//							_.map(window.evnAnaPtDic.values(), function(tmpPtMap, index) {
//								window.map.removeOverlay(tmpPtMap.marker);
//							});
//							window.evnAnaPtDic = null;
//						}
//						
//						addEvnAnaMapSncPla(retData);
//					}
//					
//					//事故发生地居中
//					window.map.centerAndZoom(window.evnPt, 16);
//				}
//				curEvnAnaId = retData.curEvnAnaId;
//			}
//		}
//	});
//	return curEvnAnaId;
//}

/**
 * 地图加载上一次最新的事故模拟覆盖物(暂时废弃)
 * @param evnId
 */
//function loadLastEvnAnaOverLay(evnId) {
//	$.ajax({
//		type: "post",
//		url: BASE_URL + "ems/emssucsimulation/loadLastEvnAnaData",
//		data: {
//			"curEvnId": evnId
//		},
//		success: function(retData) {
//			if (retData) {
////				alert(JSON.stringify(retData));
//				//是否含有污染物覆盖物
//				var isHasPollPoly = false;
//				
//				//地图加载污染区覆盖物
//				if ("" != retData.lowPts &&
//					"" != retData.midPts &&
//					"" != retData.highPts) {
//					//加载事故模拟结果覆盖物----------------------------------------------------------------
//					//清除历史点位覆盖物和防护目标点位并定义所有事故模拟结果覆盖物
//					if (window.allEvnAnaPolyArr && 0 < window.allEvnAnaPolyArr.length) {
////						_.map(window.allEvnAnaPolyArr, function(tmpPolyObj, index) {
////							window.map.removeOverlay(tmpPolyObj.poly);
////						});
//					} else {
//						window.allEvnAnaPolyArr = [];
//						var curLowPoly = null,
//							curMidPoly = null,
//							curHighPoly = null;
//						
//						//加载低浓度覆盖物
//						if (retData.lowPts && 0 < retData.lowPts.length) {
//							var lowPtArr = [];
//							_.map(retData.lowPts, function(lowPt, i) {
//								lowPtArr.push(new BMap.Point(lowPt.lng, lowPt.lat));
//							});
//							var lowPoly = new BMap.Polygon(lowPtArr, {"fillColor": "#16e787"});
//							curLowPoly = lowPoly;
//							window.map.addOverlay(lowPoly);
//						}
//						
//						//加载中等浓度覆盖物
//						if (retData.midPts && 0 < retData.midPts.length) {
//							var midPtArr = [];
//							_.map(retData.midPts, function(midPt, i) {
//								midPtArr.push(new BMap.Point(midPt.lng, midPt.lat));
//							});
//							
//							var midPoly = new BMap.Polygon(midPtArr, {"fillColor": "#f0ff4a"});
//							curMidPoly = midPoly;
//							window.map.addOverlay(midPoly);
//						}
//						
//						//加载高浓度覆盖物
//						if (retData.highPts && 0 < retData.highPts.length) {
//							var highPtArr = [];
//							_.map(retData.highPts, function(highPt, i) {
//								highPtArr.push(new BMap.Point(highPt.lng, highPt.lat));
//							});
//							
//							var highPoly = new BMap.Polygon(highPtArr, {"fillColor": "#fc5b6a"});
//							curHighPoly = highPoly;
//							window.map.addOverlay(highPoly);
//						}
//						
//						//按照高、中、低浓度顺序添加覆盖物
//						if (curHighPoly) {
//							window.allEvnAnaPolyArr.push({
//								"type": "high", 
//								"poly": curHighPoly
//							});
//							curHighPoly = null;
//						}
//						
//						if (curMidPoly) {
//							window.allEvnAnaPolyArr.push({
//								"type": "mid", 
//								"poly": curMidPoly
//							});
//							curMidPoly = null;
//						}
//						
//						if (curLowPoly) {
//							window.allEvnAnaPolyArr.push({
//								"type": "low", 
//								"poly": curLowPoly
//							});
//							curLowPoly = null;
//						}
//					}
//					
//					isHasPollPoly = true;
//				} else {
//					parent.toast("请先进行事故模拟!");
//				}
//				
//				//地图加载防护场所点位覆盖物
//				if (0 < retData.sucPlaceList.length) {
//					//定义存储所有防护场所点位Map集合类
//					if (window.evnAnaPtDic && 0 < window.evnAnaPtDic.size()) {
////							//清空地图上所有历史防护目标点位覆盖物
////							_.map(window.evnAnaPtDic.values(), function(tmpPtMap, index) {
////								window.map.removeOverlay(tmpPtMap.marker);
////							});
////							window.evnAnaPtDic.clear();
//					} else {
//						window.evnAnaPtDic = new MapUtil();
//						_.map(retData.sucPlaceList, function(tmpPlace, index) {
//							var tmpPt = new BMap.Point(tmpPlace.longitude, tmpPlace.latitude),
//							 	tmpMarker = new BMap.Marker(tmpPt, {"title": tmpPlace.name});
//							
//							//允许清除覆盖物
//							tmpMarker.enableMassClear();
//							
//							//定义点位弹窗内容
//							var tmpWindow = new BMap.InfoWindow("", {
//								width : 420,
//								height : 260,
//								title : "",
//								enableMessage : false
//							});
//							
//							//清除企业物资等map工具类中的历史信息
//							if(window.evnAnaPtDic.containsKey(tmpPlace.placeid)){
//								window.evnAnaPtDic.remove(tmpPlace.placeid);
//							}
//							
//							//将点位存储至map集合工具类中
//							window.evnAnaPtDic.put(tmpPlace.placeid, {
//								"data": tmpPlace,
//								"marker": tmpMarker,
//								"click": function() {
//									window.map.panTo(tmpPt);
//									//定义点位信息窗口回调事件
////									tmpWindow.addEventListener("open", function(){});
////								   	tmpWindow.addEventListener("close", function(){});
////									tmpWindow.addEventListener("clickclose", function(){});
////									window.map.openInfoWindow(tmpWindow, tmpPt);
//								}
//							});
//							
//							//定义点位点击触发事件
//							tmpMarker.addEventListener("click", function(){
//								window.evnAnaPtDic.get(tmpPlace.placeid).click();
//							});
//							
//							//将点位添加至地图
//							window.map.addOverlay(tmpMarker);
//						});
//					}
//				} else {
//					if (!isHasPollPoly) {
//						parent.toast("请先进行事故模拟!");
//					}
//				}
//				
//				//事故发生地居中
//				window.map.centerAndZoom(window.evnPt, 16);
//			}
//		}
//	});
//}

/**
 * 根据事故模拟查询结果地图加载相应覆盖物
 * @param retData
 * @returns
 */
//function addEvnAnaMapPolys(retData) {
////	alert(JSON.stringify(retData));
//	//加载poly
//	window.allEvnAnaPolyArr = [];
//	var curLowPoly = null,
//		curMidPoly = null,
//		curHighPoly = null;
//	
//	//加载低浓度覆盖物
//	if (retData.lowPts && 0 < retData.lowPts.length) {
//		var lowPtArr = [];
//		_.map(retData.lowPts, function(lowPt, i) {
//			lowPtArr.push(new BMap.Point(lowPt.lng, lowPt.lat));
//		});
//		var lowPoly = new BMap.Polygon(lowPtArr, {"fillColor": "#16e787"});
//		curLowPoly = lowPoly;
//		window.map.addOverlay(lowPoly);
//	}
//	
//	//加载中等浓度覆盖物
//	if (retData.midPts && 0 < retData.midPts.length) {
//		var midPtArr = [];
//		_.map(retData.midPts, function(midPt, i) {
//			midPtArr.push(new BMap.Point(midPt.lng, midPt.lat));
//		});
//		
//		var midPoly = new BMap.Polygon(midPtArr, {"fillColor": "#f0ff4a"});
//		curMidPoly = midPoly;
//		window.map.addOverlay(midPoly);
//	}
//	
//	//加载高浓度覆盖物
//	if (retData.highPts && 0 < retData.highPts.length) {
//		var highPtArr = [];
//		_.map(retData.highPts, function(highPt, i) {
//			highPtArr.push(new BMap.Point(highPt.lng, highPt.lat));
//		});
//		
//		var highPoly = new BMap.Polygon(highPtArr, {"fillColor": "#fc5b6a"});
//		curHighPoly = highPoly;
//		window.map.addOverlay(highPoly);
//	}
//	
//	//按照高、中、低浓度顺序添加覆盖物
//	if (curHighPoly) {
//		window.allEvnAnaPolyArr.push({
//			"type": "high", 
//			"poly": curHighPoly
//		});
//		curHighPoly = null;
//	}
//	
//	if (curMidPoly) {
//		window.allEvnAnaPolyArr.push({
//			"type": "mid", 
//			"poly": curMidPoly
//		});
//		curMidPoly = null;
//	}
//	
//	if (curLowPoly) {
//		window.allEvnAnaPolyArr.push({
//			"type": "low", 
//			"poly": curLowPoly
//		});
//		curLowPoly = null;
//	}
//}

/**
 * 根据事故模拟查询结果地图加载相应的防护目标
 * @param retData
 * @returns
 */
//function addEvnAnaMapSncPla(retData) {
//	//定义存储所有防护场所点位Map集合类
//	window.evnAnaPtDic = new MapUtil();
//	_.map(retData.sucPlaceList, function(tmpPlace, index) {
//		var tmpPt = new BMap.Point(tmpPlace.longitude, tmpPlace.latitude),
//			tmpMarker = new BMap.Marker(tmpPt, {"title": tmpPlace.name});
//		
//		//允许清除覆盖物
//		tmpMarker.enableMassClear();
//		
//		//定义点位弹窗内容
//		var tmpWindow = new BMap.InfoWindow("", {
//			width : 420,
//			height : 260,
//			title : "",
//			enableMessage : false
//		});
//		
//		//清除企业物资等map工具类中的历史信息
//		if(window.evnAnaPtDic.containsKey(tmpPlace.placeid)){
//			window.evnAnaPtDic.remove(tmpPlace.placeid);
//		}
//		
//		//将点位存储至map集合工具类中
//		window.evnAnaPtDic.put(tmpPlace.placeid, {
//			"data": tmpPlace,
//			"marker": tmpMarker,
//			"click": function() {
//				window.map.panTo(tmpPt);
//				//定义点位信息窗口回调事件
////				tmpWindow.addEventListener("open", function(){});
////			   	tmpWindow.addEventListener("close", function(){});
////				tmpWindow.addEventListener("clickclose", function(){});
////				window.map.openInfoWindow(tmpWindow, tmpPt);
//			}
//		});
//		
//		//定义点位点击触发事件
//		tmpMarker.addEventListener("click", function(){
//			window.evnAnaPtDic.get(tmpPlace.placeid).click();
//		});
//		
//		//将点位添加至地图
//		window.map.addOverlay(tmpMarker);
//	});
//}
//--------------------事故模拟-end--------------------------------------------------


//function initForecast(eventid){
//	//查询该事件是否进行过事故模拟，如果没有模拟过，则不需要弹出预测模块，并给予提示
//	$.ajax({
//		type : "post",
//		url : BASE_URL + "ems/emssucigrforecast/simulationCheck",
//		data : {
//			"eventid":eventid
//		},
//		success : function(data) {
//			if (data.data) {
//				if(data.num){					
//					//打开综合预测路径地址
//					openEmsResWin(BASE_URL + "views/module/ems/map/forecast/forecastingIndex.html?eventid="+eventid,
//							"综合预测", "45%", "55%", "zhyc",function() {
//						//清除综合预测的覆盖物
//						if (window.allDriveRouteArr) {
//							if (0 < window.allDriveRouteArr.length) {
//								_.map(window.allDriveRouteArr, function(tmpPolyObj, index) {
//									window.map.removeOverlay(tmpPolyObj);
//								});
//							}
//							window.allDriveRouteArr = [];
//						}
//						//清除事故模拟相关的覆盖物
//						if (window.allEvnAnaPolyArr) {
//							if (0 < window.allEvnAnaPolyArr.length) {
//								_.map(window.allEvnAnaPolyArr, function(tmpPolyObj, index) {
//									window.map.removeOverlay(tmpPolyObj.poly);
//								});
//							}
//							window.allEvnAnaPolyArr = [];
//						}
//						//清除事故模拟相关的防护目标点位
//						if (window.evnAnaPtDic) {
//							//清空地图上所有历史防护目标点位覆盖物
//							if (0 < window.evnAnaPtDic.size()) {
//								_.map(window.evnAnaPtDic.values(), function(tmpPtMap, index) {
//									window.map.removeOverlay(tmpPtMap.marker);
//								});
//							}
//							window.evnAnaPtDic = null;
//						}
//						
//					});
//				}else{
//					parent.confirm("要进行综合预测，请先进行资源评估！", function (){
//						//打开资源评估路径地址
//						openEmsResWin(BASE_URL + "views/module/ems/map/resource/resourceInfoList.html?eventid=" + $("#eventid").val(),
//								"资源评估", "45%", "50%", "zypg");
//					});
//				}
//			}else{
//				 parent.confirm("要进行综合预测，请先进行模型分析！", function (){
//					//打开事故模拟路径地址
//	    				openEmsResWin(BASE_URL + "views/module/ems/map/evnanalog/evnAnalogIndex.html?eventid=" + $("#eventid").val(),
//	    						  "事故模拟", "45%", "50%", "sgmn");
//		            });
//				
//			}
//		}
//	});
//}
/**
 * 综合预测标记点位
 * @param name
 * @param lng
 * @param lat
 */
//function simpleMarker(name,lng,lat){
////	window.allDriveRouteArr = [];
//	var simpleMarker = new BMap.Marker(new BMap.Point(lng,lat),{"title":name});
//	window.map.addOverlay(simpleMarker);
//	window.allDriveRouteArr.push(simpleMarker);
//}

/**
 * 绘制警戒区
 * @returns {BMapLib.DrawingManager}
 */
//function drawArea(){
//
//   var styleOptions = {  
//       strokeColor:"red",    //边线颜色。  
//       fillColor:"red",      //填充颜色。当参数为空时，圆形将没有填充效果。  
//       strokeWeight: 1,       //边线的宽度，以像素为单位。  
//       strokeOpacity: 0.8,    //边线透明度，取值范围0 - 1。  
//       fillOpacity: 0.6,      //填充的透明度，取值范围0 - 1。  
//       strokeStyle: 'solid' //边线的样式，solid或dashed。  
//   }  
//   //实例化鼠标绘制工具  
//   var drawingManager = new BMapLib.DrawingManager(window.map, {  
//       isOpen: true, //是否开启绘制模式  
//       polygonOptions: styleOptions, //多边形的样式  
//   });    
//   drawingManager.setDrawingMode(BMAP_DRAWING_POLYGON);  
//
//   return drawingManager
//}

/**
 * 
 * @param data 加载的路线坐标集合
 */
//function initDriveRoute(data,type) {
////	window.map.clearOverlays();
//	//清除综合预测的覆盖物
//	if (window.allDriveRouteArr) {
//		if (0 < window.allDriveRouteArr.length) {
//			_.map(window.allDriveRouteArr, function(tmpPolyObj, index) {
//				window.map.removeOverlay(tmpPolyObj);
//			});
//		}
////		window.allDriveRouteArr = null;
//	}
//	_.map(data,function(curdata,i){
//		var driving = new BMap.DrivingRoute(window.map,
//				{
//					onPolylinesSet: function(routes) {
//						_.map(routes, function(route) {
//							//存储生成的路线覆盖物
//							var curDvrPolyline = route.getPolyline();
//							//覆盖物存储到数组中
//							window.allDriveRouteArr.push(curDvrPolyline);
//							if(type=="jylx"){
//								curDvrPolyline.setStrokeColor("red");
//							}else if(type=="cllx"){
//								curDvrPolyline.setStrokeColor("green");
//							}
//							
//						});
//					},
//					onMarkersSet: function(pois) {
////						_.map(pois, function(poi) {
//							/*//设置图标样式
//							var icon = new BMap.Icon("http://lbsyun.baidu.com/jsdemo/img/fox.gif", new BMap.Size(300,157));
//							//存储生成的路线始终点的marker
//							poi.marker.setIcon(icon);*/
//						//覆盖物存储到数组中
//						_.map(pois, function(poi) {
//							window.allDriveRouteArr.push(poi.marker);
//							if(type=="jylx"){
//								poi.marker.setTitle(curdata.TEAMNAME+"的救援路线");
//							}else if(type=="cllx"){
//								poi.marker.setTitle(curdata.SHELTERNAME+"的撤离路线");
//							}
//							
//							
//						});
//						
//					},
//					renderOptions:{map: window.map,panel: "r-result", autoViewport: true}
//				}
//			);
//		//判断是救援路线还是撤离路线，出发地是不同的
//		if(type=="jylx"){
//			driving.search(new BMap.Point(curdata.LONGITUDE, curdata.LATITUDE),new BMap.Point($("#eventlongitude").val(), $("#eventlatitude").val()));
//		}
//		if(type=="cllx"){
//			driving.search(new BMap.Point($("#eventlongitude").val(), $("#eventlatitude").val()),new BMap.Point(curdata.LONGITUDE, curdata.LATITUDE));
//		}
//		
//	});
//	
//	
//}


//智能方案----------------------
/**
 * 获取新增智能方案名称等参数
 * @param param
 */
//function getAddedNewPlanRes(param) {
//	//为隐藏域赋值
//	$("#schemename").val(param.schemename);
//	$("#schemecode").val(param.schemecode);
//	$("#saveSchemaDiv").css("display", "table");
//}

/**
 * 
 * @param data 加载的路线坐标集合
 */
//function initHistoryDriveRoute(data,type) {
////	window.map.clearOverlays();
//	//清除综合预测的覆盖物
//	if (window.allDriveRouteArr) {
//		if (0 < window.allDriveRouteArr.length) {
//			_.map(window.allDriveRouteArr, function(tmpPolyObj, index) {
//				window.map.removeOverlay(tmpPolyObj);
//			});
//		}
////		window.allDriveRouteArr = null;
//	}
//	_.map(data,function(curdata,i){
//		var driving = new BMap.DrivingRoute(window.map,
//				{
//					onPolylinesSet: function(routes) {
//						_.map(routes, function(route) {
//							//存储生成的路线覆盖物
//							var curDvrPolyline = route.getPolyline();
//							//覆盖物存储到数组中
//							window.allDriveRouteArr.push(curDvrPolyline);
//							if(type=="jylx"){
//								curDvrPolyline.setStrokeColor("red");
//							}else if(type=="cllx"){
//								curDvrPolyline.setStrokeColor("green");
//							}
//							
//						});
//					},
//					onMarkersSet: function(pois) {
//						//覆盖物存储到数组中
//						_.map(pois, function(poi) {
//							window.allDriveRouteArr.push(poi.marker);
//							if(type=="jylx"){
//								poi.marker.setTitle(curdata.ROUTENAME);
//							}else if(type=="cllx"){
//								poi.marker.setTitle(curdata.ROUTENAME);
//							}														
//						});						
//					},
//					renderOptions:{map: window.map,panel: "r-result", autoViewport: true}
//				}
//			);
//		driving.search(new BMap.Point(curdata.STARTLON, curdata.STARTLAT),new BMap.Point(curdata.ENDLON, curdata.ENDLAT));		
//	});	
//}

/**
 * 
 * @param data 加载的路线坐标集合
 */
//function initHistorySingleRoute(data,type) {
//	window.map.clearOverlays();
	//清除综合预测的覆盖物
//	if (window.allDriveRouteArr) {
//		if (0 < window.allDriveRouteArr.length) {
//			_.map(window.allDriveRouteArr, function(tmpPolyObj, index) {
//				window.map.removeOverlay(tmpPolyObj);
//			});
//		}
//		window.allDriveRouteArr = null;
//	}
	//清除事故模拟相关的覆盖物
//	if (window.allEvnAnaPolyArr) {
//		if (0 < window.allEvnAnaPolyArr.length) {
//			_.map(window.allEvnAnaPolyArr, function(tmpPolyObj, index) {
//				window.map.removeOverlay(tmpPolyObj.poly);
//			});
//		}
//		window.allEvnAnaPolyArr = null;
//	}
//	var driving = new BMap.DrivingRoute(window.map,{
//		onPolylinesSet: function(routes) {
//			_.map(routes, function(route) {
//				//存储生成的路线覆盖物
//				var curDvrPolyline = route.getPolyline();
//				//覆盖物存储到数组中
//				window.allDriveRouteArr.push(curDvrPolyline);
//				if(type=="jylx"){
//					curDvrPolyline.setStrokeColor("red");
//				}else if(type=="cllx"){
//					curDvrPolyline.setStrokeColor("green");
//				}
//				
//			});
//		},
//		onMarkersSet: function(pois) {
//			_.map(pois, function(poi) {
//				window.allDriveRouteArr.push(poi.marker);
//				if(type=="jylx"){
//					poi.marker.setTitle(data.ROUTENAME+"起点");
//					poi.marker.setIcon(BASE_URL+"images/gis/beginred.png");
//				}else if(type=="cllx"){
//					poi.marker.setTitle(data.ROUTENAME+"终点");
//					poi.marker.setIcon(BASE_URL+"images/gis/endgreen.png");
//				}
//			});
//		},
//		renderOptions:{map: window.map,panel: "r-result", autoViewport: true}
//	});
//	driving.search(new BMap.Point(data.STARTLON, data.STARTLAT),new BMap.Point(data.ENDLON, data.ENDLAT));			
//}

/**
 * 
 * @param data 加载单个路线坐标集合
 */
//function initSingleDriveRoute(data,type) {
////	window.map.clearOverlays();
//	var driving = new BMap.DrivingRoute(window.map,{
//				onPolylinesSet: function(routes) {
//					_.map(routes, function(route) {
//						//存储生成的路线覆盖物
//						var curDvrPolyline = route.getPolyline();
//						//覆盖物存储到数组中
//						window.allDriveRouteArr.push(curDvrPolyline);
//						if(type=="jylx"){
//							curDvrPolyline.setStrokeColor("red");
//						}else if(type=="cllx"){
//							curDvrPolyline.setStrokeColor("green");
//						}
//						
//					});
//				},
//				onMarkersSet: function(pois) {
//					_.map(pois, function(poi) {
//						window.allDriveRouteArr.push(poi.marker);
//						if(type=="jylx"){
//							poi.marker.setTitle(data.TEAMNAME+"的救援路线起点");
//							poi.marker.setIcon(BASE_URL+"images/gis/beginred.png");
//						}else if(type=="cllx"){
//							poi.marker.setTitle(data.SHELTERNAME+"的撤离路线终点");
//							poi.marker.setIcon(BASE_URL+"images/gis/endgreen.png");
//						}
//					});
//				},
//				renderOptions:{map: window.map,panel: "r-result", autoViewport: true}
//			}
//		);
//	//判断是救援路线还是撤离路线，出发地是不同的
//	if(type=="jylx"){
//		driving.search(new BMap.Point(data.LONGITUDE, data.LATITUDE),new BMap.Point($("#eventlongitude").val(), $("#eventlatitude").val()));
//	}
//	if(type=="cllx"){
//		driving.search(new BMap.Point($("#eventlongitude").val(), $("#eventlatitude").val()),new BMap.Point(data.LONGITUDE, data.LATITUDE));
//	}
//		
//}

//绘制警戒区域覆盖物
//function loadWarnArea(array){
//	var jsonObj =  JSON.parse(array);
//	var jsonStr1 = JSON.stringify(jsonObj);
//	var jsonArr = [];
//	var points = new Array();
//    for(var i =0 ;i < jsonObj.length;i++){
//            jsonArr[i] = jsonObj[i];
//         var point = new BMap.Point(jsonArr[i].lng,jsonArr[i].lat);
//         points.push(point);
//         
//    }
//    var styleOptions = {  
//    	       strokeColor:"red",    //边线颜色。  
//    	       fillColor:"red",      //填充颜色。当参数为空时，圆形将没有填充效果。  
//    	       strokeWeight: 1,       //边线的宽度，以像素为单位。  
//    	       strokeOpacity: 0.8,    //边线透明度，取值范围0 - 1。  
//    	       fillOpacity: 0.6,      //填充的透明度，取值范围0 - 1。  
//    	       strokeStyle: 'solid' //边线的样式，solid或dashed。  
//    	   }  
//	var p = new BMap.Polygon(points,styleOptions);
//	window.map.addOverlay(p);
//	window.allDriveRouteArr.push(p);
//}

/**
 * 关闭目前GIS首页所有窗口
 */
//function closeAllEmsResWin() {
//	layer.closeAll();
//}  