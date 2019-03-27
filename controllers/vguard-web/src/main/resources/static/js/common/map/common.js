var bncsflag = true;
var jydwflag = true;
var ylzyflag = true;
var wzzbflag = true;
var ysbzflag = true;
var txbzflag = true;
$(function(){
	$("#gridData").show();
    // 事故列表
    $('.content:eq(0)').on('click','.acciden',function(){
        var acClass = $(this).attr('class');
        var acId = $(this).data('kind'); 
        //隐藏显示资源点位标记
        if (acId == "bncs") {
        	//隐藏或显示避难场所
        	$("#bncsGrid").show();
        	$("#jydwGrid").hide();
        	$("#ylzyGrid").hide();
        	$("#wzzbGrid").hide();
        	$("#ysbzGrid").hide();
        	$("#txbzGrid").hide();
			makeMarker(acId,bncsflag);
		}else if (acId == "jydw") {
			//隐藏或显示救援队伍
			$("#bncsGrid").hide();
			$("#jydwGrid").show();
			$("#ylzyGrid").hide();
			$("#wzzbGrid").hide();
			$("#ysbzGrid").hide();
			$("#txbzGrid").hide();
			makeMarker(acId,jydwflag);
			
		}else if (acId == "ylzy") {
			//隐藏或显示医疗资源
			$("#bncsGrid").hide();
			$("#jydwGrid").hide();
			$("#ylzyGrid").show();
			$("#wzzbGrid").hide();
			$("#ysbzGrid").hide();
			$("#txbzGrid").hide();
			makeMarker(acId,ylzyflag);
		}else if (acId == "wzzb") {
			//隐藏或显示物资装备
			$("#bncsGrid").hide();
			$("#jydwGrid").hide();
			$("#ylzyGrid").hide();
			$("#wzzbGrid").show();
			$("#ysbzGrid").hide();
			$("#txbzGrid").hide();
			makeMarker(acId,wzzbflag);
		}else if (acId == "ysbz") {
			$("#bncsGrid").hide();
			$("#jydwGrid").hide();
			$("#ylzyGrid").hide();
			$("#wzzbGrid").hide();
			$("#ysbzGrid").show();
			$("#txbzGrid").hide();
			makeMarker(acId,ysbzflag);
		}else if (acId == "txbz") {
			$("#bncsGrid").hide();
			$("#jydwGrid").hide();
			$("#ylzyGrid").hide();
			$("#wzzbGrid").hide();
			$("#ysbzGrid").hide();
			$("#txbzGrid").show();
			makeMarker(acId,txbzflag);
		}
        
        if(acClass === 'item acciden visited1'){
            acClass = 'item acciden';
            $('#'+acId).show();
            $(".zyxqContent").hide();
            $('.zyxq1').attr('class','zyxq1');
            $('.zyxq1').each(function(i){
                if($(this).css('display')=='inline-block'){
                    $(this).attr('class','zyxq1 active 1');
                    var gridId = $(this).attr('id');
            		$('#'+gridId+"Grid").show();
                    return false;
                }
            })
        } else {
            acClass = 'item acciden visited1';
            $('#'+acId).hide();
            $('#'+acId+"Grid").hide();
            $('.zyxq1').attr('class','zyxq1');
            $('.zyxq1').each(function(i){
                if($(this).css('display')=='inline-block'){
                    $(this).attr('class','zyxq1 active 1');
                    var gridId = $(this).attr('id');
            		$('#'+gridId+"Grid").show();
                    return false;
                }
            });
        }
        $(this).attr('class',acClass);
        
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
			/*$("#weatherInfo").html("<iframe name='weather_inc' src='http://i.tianqi.com/index.php?c=code&id=7&icon=3&py=dalate' width='210' height='90' frameborder='0' marginwidth='0' " +
					"marginheight='0' scrolling='no'></iframe>")*/
        	$("#weather_xc").hide();
			$("#weather_inc").show();
		}
        if ($(this).attr("id") == "xcqx") {
        	$("#weather_inc").hide();
        	$("#weather_xc").show();
//        	$("#weatherInfo").html("<div style=' height:105px;width:300px;line-height:105px;overflow:hidden;border:1px solid #FF0099;text-align:center ; display: table-cell; vertical-align:middle; '>暂无数据!</div>")
		}
      /*  var id = $(this).attr("id");
        alert(id);*/
    })

    $('.probeInfoTitle:eq(0)').on('click','.probe1',function(){
        $('.probe1').attr('class','probe1');
        $(this).attr('class','probe1 active');
        
        //触发当前所选二级菜单
        $(".probeInfoContentTitle .active").trigger("click");
//        if ($(this).attr("id") == "jcdw") {
//        	$("#contentData").hide();
//			$("#gridData").empty().show();
//		}
//        if ($(this).attr("id") == "spjk") {
//        	$("#contentData").hide();
//			$("#gridData").empty().show();
//		}
    })

    $('.probeInfoContentTitle:eq(0)').on('click','.probe2',function(){
        $('.probe2').attr('class','probe2');
        $(this).attr('class','probe2 active')
       if ($(this).attr("id") == "zbVideo") {
        	if ($("#jcdw").attr("class") == "probe1") {
        		$("#gridData").hide();
        		$("#contentData").show();
        		return false;
			}
//			$("#contentData").hide();
//			$("#gridData").show();
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
	        	$("#gridData").append(entGridTitle);
	        	
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
            		openEmsResWin(BASE_URL + "views/module/ems/map/probe/zbProbePopWin.html?curZbProName=" + encodeURI(encodeURI(curZbProName)),
            			   	  	  curZbProName + "监测点实时浓度", "60%", "70%", (curZbProName + "监测点位"), function() {});
            	});
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
			                                "    <a href='javascript:void(0);' style='color: #fff;' onclick='displayEntVideo(\"" + tmpEnt.BUSINESSINFOID + "\",\"" + tmpEnt.ENTNAME + "\")'>预览</a>" +
			                                "    </td>" +
			                                "</tr>");
	                    	});
	                    	gridCon += "</tbody>";
	                    	$("#gridData").append(gridCon);
	                    }
	                }
	            });
			} else {
				//企业监测--------待续--------------
				$("#contentData").show();
				
			}
		}
        if ($(this).attr("id") == "czVideo") {
//			$("#gridData").hide();
			$("#contentData").show();
			$("#gridData").empty().show();
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
    });
    $('#probeInfoClose').click(function(){
        $('.probeInfo').attr('class','probeInfo animated slideOutRight');
        $('#spjk').attr('class','item navBottom');
    });

    $('#accidentClose').click(function(){
        $('.zyxq').attr('class','zyxq animated slideOutLeft')
        setTimeout(function() {
            $('.accidentList').attr('class','accidentList animated slideOutLeft')
            setTimeout(function() {
                $('#open').attr('class','animated slideInLeft').css('left','-2px')
            }, 500);
        }, 500);
        
    })
    $('#open').on("click",function(){
        $('#open').attr('class','animated slideOutLeft').css('left','-100px');        
        setTimeout(function() {
            $('.accidentList').attr('class','accidentList animated slideInLeft')
            setTimeout(function() {
                $('.zyxq').attr('class','zyxq animated slideInLeft');             
            }, 500);
        }, 500);
    })
})

/**
 * 隐藏显示点位标记
 * @param type 资源类型
 * @param flag 标记
 */
function makeMarker(type,flag){
	if (flag) {
		var list = _.where(window.allEmsResPtDic.values(),{'type':type});
		$.each(list, function(index, resourceInfo) {
			//关闭点位的跳动、信息窗口操作
			window.map.closeInfoWindow();
			resourceInfo.marker.setAnimation(null);
			resourceInfo.marker.hide();
		});
		getFlag(type,flag);
	}else{
		var list = _.where(window.allEmsResPtDic.values(),{'type':type});
		$.each(list,function(index,resourceInfo){
			resourceInfo.marker.show();
		});
		getFlag(type,flag)
	}
}

/**
 * 改变标记状态
 * @param type
 * @param flag
 */
function getFlag(type,flag){
	if (type == "bncs" && flag) {
		bncsflag = false;
	}else if(type == "bncs" && !flag){
		bncsflag = true;
	}
	if (type == "jydw" && flag) {
		jydwflag = false
	}else if(type == "jydw" && !flag){
		jydwflag = true;
	}
	if (type == "ylzy" && flag) {
		ylzyflag = false
	}else if(type == "ylzy" && !flag){
		ylzyflag = true;
	}
	if (type == "wzzb" && flag) {
		wzzbflag = false
	}else if(type == "wzzb" && !flag){
		wzzbflag = true;
	}
	if (type == "ysbz" && flag) {
		ysbzflag = false
	}else if(type == "ysbz" && !flag){
		ysbzflag = true;
	}
	if (type == "txbz" && flag) {
		txbzflag = false;
	}else if(type == "txbz" && !flag){
		txbzflag = true;
	}
}

/**
 * 根据企业id查询所选企业里面的摄像头视频
 * @param entId
 */
function displayEntVideo(entId, entName) {
//	console.log(entId + "-" + entName);
	parent.openWin(BASE_URL + "views/module/ems/map/entVideo/entVideoIndex.html?businessinfoid=" + entId, 
				  entName + "内部监控视频", "55%", "60%");
}