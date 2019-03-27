$(function(){
	$('#sgjbInfo').on('mouseover',function(){
		this.stop();
	})
	$('#sgjbInfo').on('mouseout',function(){
		this.start();
	})
	$("#gridData").show();
    // 事故列表
    $('.content:eq(0)').on('click','.acciden',function(){
        var acClass = $(this).attr('class');
//        $('.acciden').addClass('visited1');
        $(this).toggleClass('visited1');
        var acId = $(this).data('kind');
        
        initYjzyMapPts();
        $("#zyxqtable").niceScroll({cursorborder: "#4d86d6",cursorcolor: "#4d86d6",background: false,horizrailenabled: false, autohidemode: false }).show().resize();
        
        //判断是否已打开绘图筛选功能
		if (window.drawFilterCircle) {
			initDrawFilterCircle("1");
		}
    });
    
    // 资源详情
    $('.zyxqTitle:eq(0)').on('click','.zyxq1',function(){
        $('.zyxq1').attr('class','zyxq1');
        $(this).attr('class','zyxq1 active');
    });
    
// 天气
    $('.weatherInfoTitle:eq(0)').on('click','.weather1',function(){
        $('.weather1').attr('class','weather1');
        $(this).attr('class','weather1 active')
        if ($(this).attr("id") == "qyqx") {
        	$("#weather_xc").hide();
			$("#weather_inc").show();
		}
        if ($(this).attr("id") == "xcqx") {
        	$("#weather_inc").hide();
        	$("#weather_xc").show();
		}
    })

    $('.probeInfoTitle:eq(0)').on('click','.probe1',function(){
        $('.probe1').attr('class','probe1');
        $(this).attr('class','probe1 active');
        
        //触发当前所选二级菜单
        $(".probeInfoContentTitle .active").trigger("click");
        if ($(this).attr("id") == "jcdw") {
        	$('.probeInfoContentTitle').hide();
		}
        if ($(this).attr("id") == "spjk") {
        	$('.probeInfoContentTitle').show();
		}
    })

    $('.probeInfoContentTitle:eq(0)').on('click','.probe2',function(){
    	
    	
    	if (window.EntMap) {
        	_.map(window.EntMap.values(),function(temData,index){
        		window.map.removeOverlay(temData.marker);
        	});
        	window.EntMap.clear();
        } else {
        	window.EntMap = new MapUtil();
        }
    	
    	/*if (window.EntMap) {
    		
            window.EntMap.clear();
        } else {
            window.EntMap = new MapUtil();
        }*/
        $('.probe2').attr('class','probe2');
        $(this).attr('class','probe2 active')
       if ($(this).attr("id") == "zbVideo") {
        	if ($("#jcdw").attr("class") == "probe1") {
        		$("#gridData").hide();
        		$("#contentData").show();
        		return false;
			}
			$("#contentData").hide();
			$("#gridData").empty().show();
			
			if ("spjk" == $(".probeInfoTitle .active").attr("id")) {
				//-----------加载GIS视频检测周边点位---待续--------
				
				
				
				
				$("#contentData").show();
			} else {
				//---------加载GIS周边监测点位-----待续----------
				

				var entGridTitle = "<thead>" + 
	            "	<tr>" + 
	            "     <th>名称</th>" + 
	            "     <th>类型</th>" + 
	            "     <th>状态</th>" + 
	            " 	</tr>" + 
	            "</thead>";
	        	$("#gridData").empty().append(entGridTitle);
	        	
	        	var gridCon = "<tbody>";
	        		gridCon += ("<tr class='zbProbeRow'>" + 
                                    "<td>01号</td>" + 
                                    "<td>氯气</td>" + 
                                    "<td>在线</td>" + 
                                "</tr>" + 
                                "<tr class='zbProbeRow'>" + 
                                "    <td>02号</td>" + 
                                "    <td>硫化氢</td>" + 
                                "    <td>在线</td>" + 
                                "</tr>" + 
                                "<tr class='zbProbeRow'>" + 
                                "    <td>03号</td>" + 
                                "   <td>乙醇</td>" + 
                                "    <td>在线</td>" + 
                                "</tr>" + 
                                "<tr class='zbProbeRow'>" + 
                                "    <td>04号</td>" + 
                                "    <td>乙醚</td>" + 
                                "    <td>在线</td>" + 
                                "</tr>" + 
                                "<tr class='zbProbeRow'>" + 
                                "    <td>05号</td>" + 
                                "   <td>甲烷</td>" + 
                                "   <td>在线</td>" + 
                                "</tr>");
	        		gridCon += "</tbody>";
	            	$("#gridData").append(gridCon);
            	
            	//绑定周边监测点位列表数据点击弹窗操作
            	$("#gridData .zbProbeRow").off("click").on("click", function() {
            		var curZbProName = $(this).find("td:eq(0)").text();
            		openEmsResWin(BASE_URL + "views/module/ems/emsmap/probe/zbProbePopWin.html?curZbProName=" + encodeURI(encodeURI(curZbProName)),
            			   	  	  curZbProName + "监测点实时浓度", "50%", "52%", (curZbProName + "监测点位"), function() {});
            	});
            	$("#contentData").hide();
			}
		}
        
        if ($(this).attr("id") == "qyVideo") {
        	$("#contentData").hide();
			$("#gridData").empty().show();
			
			if ("spjk" == $(".probeInfoTitle .active").attr("id")) {
				//视频监控
				//生成当前所有企业列表
	        	var entGridTitle = "<thead>" + 
	            "	<tr>" + 
	            "     <th>序号</th>" + 
	            "     <th>企业名</th>" + 
	            "     <th>操作</th>" + 
	            " 	</tr>" + 
	            "</thead>";
	        	$("#gridData").append(entGridTitle);
	        	
	        	//查询最新的所以企业列表
	        	$.ajax({
	                type: "post",
	                url: BASE_URL + "ems/video/loadAllEntInfo",
	                data: {},
	                success: function (data) {
	                    if (data && 0 < data.length) {
	                    	//根据企业内部视频点位个数反向排序
	                    	data = _.sortBy(data, function(tnpEnt) {return -tnpEnt.VIDEOCNT;});
	                    	
	                    	//*****加载企业点位集合
	                    	var gridCon = "<tbody>";
	                    	_.map(data, function(tmpEnt, index) {
	                    		
	                    		var entFmtName = "";
	                    		if (4 < tmpEnt.ENTNAME.length) {
	                    			entFmtName = tmpEnt.ENTNAME.substring(0, 4) + "...";
	                    		} else {
	                    			entFmtName = tmpEnt.ENTNAME;
	                    		}
	                    		
	                    		gridCon += ("<tr class='zbProbeRow'>" + 
		                                "    <td>" + (index + 1) + "</td>" +
		                                "    <td title='" + tmpEnt.ENTNAME + "'>" + entFmtName + "</td>" +
		                                "    <td>" +
//		                                "    <a href='javascript:void(0);' style='color: #fff;' onclick='displayEntVideo(\"" + tmpEnt.BUSINESSINFOID + "\",\"" + tmpEnt.ENTNAME + "\")'>预览</a>" +
		                                "    <a href='javascript:void(0);' style='color: #fff;' onclick='displayVideo(\"" + tmpEnt.BUSINESSINFOID + "\")'>预览</a>" +
		                                "    </td>" +
		                                "</tr>");
	                    		
	                    		var markIconUrl = "images/portal/icon_gisComVideo.png", winCon = "";
	                    		winCon = "<div class='zdwxypopup'>" +
                                "   <div class='popupTitle'>" + tmpEnt.ENTNAME + "</div>" +
                                /*"   <div class='zdwxypopupTab'>" +
                                "       <i id='zdwxyMonloadMore' onclick='openView(\"" + tmpEnt.BUSINESSINFOID + "\")'>查看更多</i>" +
                                "   </div>" +*/
                                /*"   <div id='spjkVideo' class='zdwxypopupNav'>" +*/
                                "       <div class='ggqyLeft'>" +
                                "           <div class='ggqyTitle ggqyContentTitle'></div>" +
                                
                                "<div class='mbe_center' id='hyPlayer'></div>" + 
//                                "           <object classid='clsid:D5E14042-7BF6-4E24-8B01-2F453E8154D7' id='PlayViewOCX' name='ocx' class='videoArea'></object>" +
//                                "           <object classid='clsid:9ECD2A40-1222-432E-A4D4-154C7CAB9DE3' id='spvViewOCX' name='ocx' class='videoArea'></object>" +
                                "           <div class='objDiv'><span class='ieClass'><font style='color: white;font-size: 14px'>视频加载中...</font><span></div>" +
                                "       </div>" +
                                "       <div class='ggqyRight'>" +
                                "           <li class='ggqyContentTitle'>监控摄像头列表</li>" +
                                "           <ul>" +
                                "           </ul>" +
                                "       </div>" +
                              /*  "   </div>" +*/
                                "   <div class='triangle'></div>" +
                                "</div>";
	                    		
	                    		
	                    		//*********企业点位
	                    		var tmpPt = new BMap.Point(tmpEnt.LONGITUDE, tmpEnt.LATITUDE);
		                        var tmpMarker = new BMap.Marker(tmpPt, {
		                               "title": tmpEnt.ENTNAME,
		                               "icon": new BMap.Icon(BASE_URL + markIconUrl, new BMap.Size(42, 56))
		                        });
		                        window.EntMap.put(tmpEnt.BUSINESSINFOID, {
	                                "data": tmpEnt,
	                                "marker": tmpMarker,
	                                "click": function () {
	                                	window.map.panTo(tmpPt);
	                                	
	                                    var infoBox = new BMapLib.InfoBox(window.map, winCon, {
	                                        boxStyle: {
	                                            minWidth: "631",
	                                            Height: "381",
	                                            marginBottom: "20px"
	                                        }
	                                        , closeIconMargin: "4px 4px 4px 4px"
	                                        , closeIconUrl: BASE_URL + "images/map/icon/iw_close1d3.gif"
	                                        , enableAutoPan: false
	                                        , align: INFOBOX_AT_TOP
	                                    });

	                                    window.infoBoxList.push(infoBox);
	                                    _.map(window.infoBoxList, function (infobox) {
	                                        infobox.close();
	                                    });
	                                    
	                                    //点位跳动
	                                    tmpMarker.setAnimation(BMAP_ANIMATION_BOUNCE);

	                                    //infobox打开时的回调事件
	                                    infoBox.addEventListener("open", function (e) {
	                                        markClkCb(tmpEnt);
	                                        //添加滚动条
	                                        $('.jcdList tbody').niceScroll({
	                                            cursorborder: "#4d86d6",
	                                            cursorcolor: "#4d86d6",
	                                            background: false,
	                                            autohidemode: false
	                                        }).show();
	                                        document.getElementById('sgjbInfo').stop();
	                                        $('#sgjbInfo').off('mouseout');
	                                        $('#sgjbInfo').off('mouseover');
	                                    });

	                                    //infoBox关闭时执行的操作
	                                    infoBox.addEventListener("close", function (e) {
	                                        //取消marker的跳动效果
	                                        tmpMarker.setAnimation(null);
	                                        document.getElementById('sgjbInfo').start();
	                                        $('#sgjbInfo').on('mouseout',function(){
	                                        	this.start();
	                                        });
	                                        $('#sgjbInfo').on('mouseover',function(){
	                                        	this.stop();
	                                        });
	                                    });
	                                    infoBox.open(tmpMarker);   //图片加载完毕重绘infowindow
	                                }
	                            });
		                        tmpMarker.enableMassClear();
			                       
			                    tmpMarker.addEventListener("click", function () {
		                           window.EntMap.get(tmpEnt.BUSINESSINFOID).click();
		                        });

		                           //将点位添加至地图
		                        window.map.addOverlay(tmpMarker);
	                    	});
	                    	gridCon += "</tbody>";
	                    	$("#gridData").append(gridCon);
	                    	$("#contentData").hide();
	                    	//绑定视频查看更多
	    	            	
	                    }
	                }
	            });
			} else {
				//企业监测--------待续--------------
				var entGridTitle = "<thead>" + 
	            "	<tr>" + 
	            "     <th>名称</th>" + 
	            "     <th>类型</th>" + 
	            "     <th>状态</th>" + 
	            " 	</tr>" + 
	            "</thead>";
	        	$("#gridData").empty().append(entGridTitle);
	        	
	        	var gridCon = "<tbody>";
	        		gridCon += ("<tr class='zbProbeRow'>" + 
                                    "<td>01号</td>" + 
                                    "<td>氯气</td>" + 
                                    "<td>在线</td>" + 
                                "</tr>" + 
                                "<tr class='zbProbeRow'>" + 
                                "    <td>02号</td>" + 
                                "    <td>硫化氢</td>" + 
                                "    <td>在线</td>" + 
                                "</tr>" + 
                                "<tr class='zbProbeRow'>" + 
                                "    <td>03号</td>" + 
                                "   <td>乙醇</td>" + 
                                "    <td>在线</td>" + 
                                "</tr>" + 
                                "<tr class='zbProbeRow'>" + 
                                "    <td>04号</td>" + 
                                "    <td>乙醚</td>" + 
                                "    <td>在线</td>" + 
                                "</tr>" + 
                                "<tr class='zbProbeRow'>" + 
                                "    <td>05号</td>" + 
                                "   <td>甲烷</td>" + 
                                "   <td>在线</td>" + 
                                "</tr>");
	        		gridCon += "</tbody>";
	            	$("#gridData").append(gridCon);
            	
            	//绑定周边监测点位列表数据点击弹窗操作
            	$("#gridData .zbProbeRow").off("click").on("click", function() {
            		var curZbProName = $(this).find("td:eq(0)").text();
            		openEmsResWin(BASE_URL + "views/module/ems/emsmap/probe/zbProbePopWin.html?curZbProName=" + encodeURI(encodeURI(curZbProName)),
            			   	  	  curZbProName + "监测点实时浓度", "50%", "52%", (curZbProName + "监测点位"), function() {});
            	});
            	$("#contentData").hide();
			}
		}
        if ($(this).attr("id") == "czVideo") {
//			$("#gridData").hide();
			if ("spjk" == $(".probeInfoTitle .active").attr("id")){
				$("#contentData").show();
				$("#gridData").empty().show();
			} else {
				var entGridTitle = "<thead>" + 
	            "	<tr>" + 
	            "     <th>名称</th>" + 
	            "     <th>类型</th>" + 
	            "     <th>状态</th>" + 
	            " 	</tr>" + 
	            "</thead>";
	        	$("#gridData").empty().append(entGridTitle);
	        	
	        	var gridCon = "<tbody>";
	        		gridCon += ("<tr class='zbProbeRow'>" + 
                                    "<td>01号</td>" + 
                                    "<td>氯气</td>" + 
                                    "<td>在线</td>" + 
                                "</tr>" + 
                                "<tr class='zbProbeRow'>" + 
                                "    <td>02号</td>" + 
                                "    <td>硫化氢</td>" + 
                                "    <td>在线</td>" + 
                                "</tr>" + 
                                "<tr class='zbProbeRow'>" + 
                                "    <td>03号</td>" + 
                                "   <td>乙醇</td>" + 
                                "    <td>在线</td>" + 
                                "</tr>" + 
                                "<tr class='zbProbeRow'>" + 
                                "    <td>04号</td>" + 
                                "    <td>乙醚</td>" + 
                                "    <td>在线</td>" + 
                                "</tr>" + 
                                "<tr class='zbProbeRow'>" + 
                                "    <td>05号</td>" + 
                                "   <td>甲烷</td>" + 
                                "   <td>在线</td>" + 
                                "</tr>");
	        		gridCon += "</tbody>";
	            	$("#gridData").append(gridCon);
            	
            	//绑定周边监测点位列表数据点击弹窗操作
            	$("#gridData .zbProbeRow").off("click").on("click", function() {
            		var curZbProName = $(this).find("td:eq(0)").text();
            		openEmsResWin(BASE_URL + "views/module/ems/emsmap/probe/zbProbePopWin.html?curZbProName=" + encodeURI(encodeURI(curZbProName)),
            			   	  	  curZbProName + "监测点实时浓度", "50%", "52%", (curZbProName + "监测点位"), function() {});
            	});
            	$("#contentData").hide();
			}
		}
    });
    
    //默认选择第一个标签
    $('.probeInfoContentTitle:eq(0) #zbVideo').trigger("click");

    // 各种关闭
    $('#accidentInfoClose').click(function(){
        $('.accidentInfo').attr('class','accidentInfo animated slideOutRight');
        $('#sgjb').attr('class','item navBottom');
    });
    $('#weatherInfoClose').click(function(){
        $('.weatherInfo').attr('class','weatherInfo animated slideOutRight');
        $('#qxxx').attr('class','item navBottom');
        setTimeout(function() {
            $('#openRight').attr('class','animated slideInRight').css('right','-2px')
        }, 500);
    });
    $('#probeInfoClose').click(function(){
    	if (window.EntMap) {
        	_.map(window.EntMap.values(),function(temData,index){
        		window.map.removeOverlay(temData.marker);
        	});
        	window.EntMap.clear();
        } else {
        	window.EntMap = new MapUtil();
        }
        $('.probeInfo').attr('class','probeInfo animated slideOutRight');
//        $('#spjk').attr('class','item navBottom');
        setTimeout(function() {
            $('#openRight').attr('class','animated slideInRight').css('right','-2px')
        }, 500);
    });

    $('#accidentClose').click(function(){
//        $('.zyxq').attr('class','zyxq animated slideOutLeft')
        setTimeout(function() {
            $('.accidentList').attr('class','accidentList animated slideOutLeft')
            setTimeout(function() {
                $('#open').attr('class','animated slideInLeft').css('left','-2px')
            }, 500);
        }, 50);
        
    })
    $('#open').on("click",function(){
        $('#open').attr('class','animated slideOutLeft').css('left','-100px');        
        setTimeout(function() {
            $('.accidentList').attr('class','accidentList animated slideInLeft')
//            setTimeout(function() {
//                $('.zyxq').attr('class','zyxq animated slideInLeft');             
//            }, 500);
        }, 500);
    })
    $('#openRight').on("click",function(){
        $('#openRight').attr('class','animated slideOutRight').css('right','-100px');        
        setTimeout(function() {
            $('#spjkspjk').attr('class','probeInfo animated slideInRight')
            setTimeout(function() {
                $('.weatherInfo').attr('class','weatherInfo animated slideInRight');             
            }, 500);
        }, 500);
    })
})

/**
 * 根据企业id查询所选企业里面的摄像头视频
 * @param entId
 */
//function displayEntVideo(entId, entName) {
////	console.log(entId + "-" + entName);
//	parent.openWin(BASE_URL + "views/module/ems/map/entVideo/entVideoIndex.html?businessinfoid=" + entId, 
//				  entName + "内部监控视频", "55%", "60%");
//}

/**
 * 查看视频
 * @param entId
 */
function displayVideo(entId){
	 window.EntMap.get(entId).click();
	 document.getElementById('sgjbInfo').stop();
	 $('#sgjbInfo').off('mouseout');
     $('#sgjbInfo').off('mouseover');
}

function openView(entId){
//	$("#zdwxyMonloadMore").off("click").on("click", function() {
		openWin(BASE_URL + 'views/module/monitor/monitorIndex/entInfo.html?businessinfoid=' + entId, '监测监控', '92%', '100%');
//	});
}
/**
 * 获取视频页面数据
 * @param tmpData
 */
function markClkCb(tmpData) {
         // 切换时刷新滚动条
            $('.ggqyRight ul').niceScroll({
                cursorborder: "#4d86d6",
                cursorcolor: "#4d86d6",
                background: false,
                autohidemode: false
            }).show();
            var $ggqyRightUl = $(".ggqyRight").find("ul");
            $ggqyRightUl.empty();
            
            //当选中查看实时视频时
            $.ajax({
                type: "post",
                url: BASE_URL + "monitor/macvideo/load",
                data: {"businessinfoid": tmpData.BUSINESSINFOID},
                success: function (data) {
                    if (data) {
//                    	alert(JSON.stringify(data));
                        if (0 < data.videolist.length) {
                            var videoDom = "";
                            _.map(data.videolist, function (tmpVideo, index) {
                                videoDom += ("<li class='ggqyContentkind' data-videoId='" + tmpVideo.videoid + "' data-videoType='" + tmpVideo.videoType + "'>" + tmpVideo.videoname + "</li>");
                            });
                            $ggqyRightUl.append(videoDom);
                            
                            //判断浏览器IE和非IE浏览器显示视频插件的区别
                         	var browserAg = navigator.userAgent.toString().toLowerCase();
                         	if (browserAg.indexOf("firefox") != -1 || browserAg.indexOf("chrome") != -1) {
                         		$("#hyPlayer").hide();
                         		
                         		$(".videoArea").hide();
                         		$(".objDiv").remove();
                         		$(".ggqyLeft").append('<div class="objDiv"><span class="ieClass"><font style="color: white;font-size: 14px">请使用IE10.0及其以上版本查看视频监控</font><span></div>');
                         		return;
                         	}
                         	
                         	try {
                         		$("#hyPlayer").show();
                         		
                    			jQuery.support.cors = true;
                    			var option = {
                    					id: "hyPlayer",
                    					height: "100%",
                    					width: "100%",
                    					classid: "clsid:210468B6-80D3-4CD0-921E-1AA99B8EB5AD"
                    					//codebase:"../UMP_OCX_V200R002B24(1,0,1,4).cab#version=1,0,0,4"
                    			};
                    			window.myOcxMsg = new initSDK(); 
                    			window.myOcxMsg._init_(option);
                    			
                    			//临时处理用户重读登录问题-当关闭该窗口时退出登录操作
            					$(window).unload(function(){
            						if (window.myOcxMsg) {
            							window.myOcxMsg.logout({
            								SeqNo: 4,
            								success: function() {},
            								error: function() {}
            							});
            						}
            					}); 
                    			
            					var ranHyName = hyRanUname(8, 2);
                    			var loginData = {
                    					SeqNo:7,  
                    					strUserID: "admin" + ranHyName,
                    					strUserName: "admin" + ranHyName,  
                    					strServerIP: window.strServerIP,
                    					nServerPort: window.nServerPort,  
                    					success: function(data) {
                    						$.hy_log("登录成功"+JSON2.stringify(data));
                    					},
                    					error:function(data) {
                    						$.hy_log("登录失败"+JSON2.stringify(data));
                    						
                    						if(data.nResultCode == "1720200002"){
                    							//如果有重复登录，就提出上次登录用户
                    							window.myOcxMsg.logout({
                    							    SeqNo:2,
                    								success:"ok",
                    								error:function() {}
                    							});
                    							window.myOcxMsg.login(loginData); 
//                    				 						$('.mbe_error').html("重复登录，如必要，请点击踢出之后再登录").show(0).delay(3000).hide(0);
//                    				 						repeatstrUserTokenID = data.strUserTokenID
                    						}
                    					},
                    					EventHandle:function(eventCode, errCode, data){
                    						$.hy_log(eventCode+"事件通知"+JSON2.stringify(data));
                    					}
                    			};

                    			window.myOcxMsg.login(loginData); 
                         	} catch(e) {
                         		//未安装怀业ocx插件时的警告
                         		$("#hyPlayer").hide();
                            	$(".objDiv").remove();
                         		$(".ggqyLeft").append('<div class="objDiv"><span class="noPlug"><font style="color: white;font-size: 14px">插件没有安装,请<a href="'+BASE_URL+'/monitor/macmonitormap/downloadWebVideo?type=hy&filename=HYMBEClient_Setup"><font color="red">下载</font></a>安装</font><span></div>');
                                return;
                        	}
                         	
                            //绑定视频列表点击事件
                            $(".ggqyContentkind").off("click").on("click", function () {
                            	$(this).siblings().removeClass("active");
                                $(this).removeClass("active").addClass("active");
                                $(".ggqyTitle").text($(this).text());
                                var curVideoId = $(this).attr("data-videoId"),
                            		curVideoType = $(this).attr("data-videoType"),
                            		curVideoName = $(this).text();
                                
                                //获取摄像头信息
                                monitordatas.loadVideoInfo($(this).attr("data-videoId"), function(videoData) {
                                    //拼接参数
                                    if (videoData) {
                                    	
                                    	//停止上次的视频播放
                            	 		if (window.lastHyPlayer) {
                            	 			window.myOcxMsg.stopPlay({play: window.lastHyPlayer});
                            	 		}
                            	 		
                            	 		var mbedeviceShowlist = [];//数组变量
                            	 		var mbedeviceShowObj = {//声明对象
                            	 				serviceUrl: {
                            	 					strDomainCode: "",
                            	 					strDeviceCode:"",
                            	 					strChannelCode:"",
                            	 					strStreamCode:""
                            	 				},
                            	 				playParam: {}
                            	 		};
                            	 		
                            	 		//加载虚拟数据
                            	 		if (window.hyVideoList) {
                            	 			var curhyVideo = _.where(window.hyVideoList, {"VIDEONAME": $.trim(curVideoName)});
                            	 			if (0 < curhyVideo.length) {
                            	 				mbedeviceShowObj.serviceUrl.strDomainCode = curhyVideo[0].STRDOMAINCODE;
                            	 				mbedeviceShowObj.serviceUrl.strDeviceCode = curhyVideo[0].STRDEVICECODE;
                            	 				mbedeviceShowObj.serviceUrl.strChannelCode = curhyVideo[0].STRCHANNELCODE;
                            	 				mbedeviceShowObj.serviceUrl.strStreamCode = curhyVideo[0].STRSTREAMCODE;
                            	 			} else {
                            	 				mbedeviceShowObj.serviceUrl.strDomainCode = (window.hyVideoList[0]).STRDOMAINCODE;
                            	 				mbedeviceShowObj.serviceUrl.strDeviceCode = (window.hyVideoList[0]).STRDEVICECODE;
                            	 				mbedeviceShowObj.serviceUrl.strChannelCode = (window.hyVideoList[0]).STRCHANNELCODE;
                            	 				mbedeviceShowObj.serviceUrl.strStreamCode = (window.hyVideoList[0]).STRSTREAMCODE;
                            	 			}
                            	 		}
                            	 		
                            	 		mbedeviceShowlist.push(mbedeviceShowObj);
                            	 		//登录播放器
                            	 		var initParam = {
                            	 				id: "hyPlayer",
                            	 				width: "100%",
                            	 				height: "100%",
                            	 				classid: "clsid:210468B6-80D3-4CD0-921E-1AA99B8EB5AD",
                            	 				ShowBarFullBtn: true,
                            	 				showPlayBar: true,
                            	 				showProgressBar: true,
                            	 				showAudioBar: true,
                            	 				showPlayPauseBtn:true,	
                            	 				showStretchBtn: true,
                            	 				showLayoutBtn: true
                            	 		};
                            	 		
                            	 		window.lastHyPlayer = window.myOcxMsg._playinit_("hyPlayer", $.extend({}, initParam, {id: "hyPlayer"}));
                            	 		var playParam = {
                            	 		    SeqNo: 5,
                            	 		    play: window.lastHyPlayer,
                            	 		    list: mbedeviceShowlist,
                            	 		    success: function(res){},
                            	 		    error: function(data) {
                            	 		    	$.hy_log("失败" + JSON2.stringify(data))
                            	 		    }
                            	 		};
                            	 		
                            	 		$(".objDiv").remove();
                            	 		
                            	 		window.myOcxMsg.playliveIpc(playParam);
                                    }
                                });
                            });
                            
                            setTimeout(function() {
                            	$(".ggqyContentkind").first().trigger("click");
                        	}, 500);
                        } else {
                         		$(".videoArea").hide();
                         		$(".objDiv").remove();
                         		$(".ggqyLeft").append('<div class="objDiv"><span class="ieClass"><font style="color: white;font-size: 14px">暂无摄像头</font><span></div>');
                         		return;
                        }
                    }
                },
                error: function (err) {
                    toast("系统繁忙!");
                }
            });
}
