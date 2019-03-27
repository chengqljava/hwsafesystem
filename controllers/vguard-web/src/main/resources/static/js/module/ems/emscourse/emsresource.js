$(function(){
	var evaluationid = getQueryString("evaluationid");
	var eventid = getQueryString("eventid");
    scrollResize();
    $('.resNavbar ul').on('click','li',function(){
        $(this).toggleClass('active');
        $('.resAll .resContent').hide();
        $('.resNavbar ul li.active').map(function(){
            var kind = $(this).data('kind');
            $('.'+kind).show();
        })
        $('.resAll .resContent').removeClass('active');
        $('.resAll .resContent').each(function(){
            if($(this).css('display') == 'block'){
                $(this).addClass('active');
                return false;
            }
        });
        scrollResize();
        loadResource(evaluationid)
    })
    $('.resAll').on('click','.resContent',function(){
        $('.resAll .resContent').removeClass('active');
        $(this).addClass('active');
    })
    
    loadResource(evaluationid);
})

function loadResource(evaluationid){
	var resTypeParaArr = [];
    $('.active').each(function(){
		resTypeParaArr.push($(this).data('index'));
	})
	console.log(resTypeParaArr);
    //查询
    $.ajax({
        type: "post",
        url: BASE_URL + "ems/portalgisems/loadSucResInfo",
        dataType: "json",
        data: {
        	"resType": resTypeParaArr.join(","),
        	"evaluationid": evaluationid
        },
        success: function (data) {
            if (data) {
                initResourceMap(data);
            }
        },
        error: function () {
            parent.toast("初始化信息加载失败");
        }
    });
}

function initResourceMap(data) {
	infoBoxList = new Array();
	curEntAndMatlsDic = new MapUtil();
    //地图本地根据IP地址定位以及添加标尺(禁止点击地图上的地点弹出百度详情)
    var map = new BMap.Map("map", {enableMapClick: false, minZoom: 6, maxZoom: 18}); // 创建Map实例
    map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放

    //默认中心位置
    map.centerAndZoom(new BMap.Point(data.emsSucEvent.longitude, data.emsSucEvent.latitude), 13);
    
    //左下角添加比例尺控件
    map.addControl(new BMap.ScaleControl({anchor: BMAP_ANCHOR_BOTTOM_LEFT}));

    var logTmpPt = new BMap.Point(data.emsSucEvent.longitude, data.emsSucEvent.latitude);
    var circle = new BMap.Circle(logTmpPt, data.radius * 1000, {
        strokeColor: "blue",
        strokeOpacity: 0.3,
        strokeWeight: 1,
//        fillColor: "#E2E8F1",
        fillColor: "blue",
        fillOpacity: 0.3
    });
    map.addOverlay(circle);
    var tmpMarkIcon = new BMap.Icon(BASE_URL + "images/map/icon/shigudian.svg", new BMap.Size(60, 60),
	     {
	        imageSize: new BMap.Size(60, 60)// 引用图片实际大小
	     });
    var eventMarker = new BMap.Marker(logTmpPt, {
        "title": data.emsSucEvent.eventname,
        "icon": tmpMarkIcon
    });
	map.addOverlay(eventMarker);
	//关闭弹窗
    if (infoBoxList.length > 0) {
		_.map(infoBoxList,function(infoBox,index){
			infoBox.close();
		});
	}
    //清空资源数据
    var $tbody = $(".resAll");
    $tbody.empty();
	if(data.emsResList.length>0){
		var tbodyData = '';
		//遍历加载应急资源相关gis点位
		_.map(data.emsResList, function (tmpData, index) {
			console.log(tmpData);
            //定义GIS各点位
            var tmpPt = new BMap.Point(tmpData.resLng, tmpData.resLat);
            
            var img
            //分类各点位图标
            var tmpMarkIcon = null, tmpWinCon = "",typeCode = '';
            if ("应急机构" == tmpData.resType) {
            	img = "../../../../images/module/ems/emseverepro/yjjg.png";
                tmpMarkIcon = new BMap.Icon(BASE_URL + "images/portal/icon_gisYjjg.png", new BMap.Size(42, 56));
                var resWinTpt = _.template($("#yjjgPopWinTpt").html());
                tmpWinCon = resWinTpt(tmpData);
                typeCode = "yjjg"
//					tmpWinCon = "应急机构";
            } else if ("救援队伍" == tmpData.resType) {
            	img = "../../../../images/module/ems/emseverepro/jydw.png";
                tmpMarkIcon = new BMap.Icon(BASE_URL + "images/portal/icon_gisYjdw.png", new BMap.Size(42, 56));
                var resWinTpt = _.template($("#yjdwPopWinTpt").html());
                tmpWinCon = resWinTpt(tmpData);
                typeCode = "jydw"
            } else if ("应急专家" == tmpData.resType) {
            	img = "../../../../images/module/ems/emseverepro/yjzj.png";
//            	tmpData.baseUrl = ;
                tmpMarkIcon = new BMap.Icon(BASE_URL + "images/portal/icon_gisYjzj.png", new BMap.Size(42, 56));
                var resWinTpt = _.template($("#yjzjPopWinTpt").html());
                tmpWinCon = resWinTpt(tmpData);
                typeCode = "yjzj"
//					tmpWinCon = "应急专家";
            } else if ("物资装备" == tmpData.resType) {
            	img = "../../../../images/module/ems/emseverepro/wzzb.png";
                tmpMarkIcon = new BMap.Icon(BASE_URL + "images/portal/icon_gisYjck.png", new BMap.Size(42, 56));
                var resWinTpt = _.template($("#yjckPopWinTpt").html());
                tmpWinCon = resWinTpt(tmpData);
                typeCode = "wzzb"
//					tmpWinCon = "应急仓库";
            } else if ("医疗资源" == tmpData.resType) {
            	img = "../../../../images/module/ems/emseverepro/ylzy.png";
                tmpMarkIcon = new BMap.Icon(BASE_URL + "images/portal/icon_gisYljg.png", new BMap.Size(42, 56));
                var resWinTpt = _.template($("#yljgPopWinTpt").html());
                tmpWinCon = resWinTpt(tmpData);
                typeCode = "ylzy"
            } else if ("避难场所" == tmpData.resType) {
            	img = "../../../../images/module/ems/emseverepro/bncs.png";
                tmpMarkIcon = new BMap.Icon(BASE_URL + "images/portal/icon_gisBncs.png", new BMap.Size(42, 56));
                var resWinTpt = _.template($("#bncsPopWinTpt").html());
                tmpWinCon = resWinTpt(tmpData);
                typeCode = "bncs"
            } /*else if ("应急物资" == tmpData.resType) {
                tmpMarkIcon = new BMap.Icon(BASE_URL + "images/portal/icon_gisYjwz.png", new BMap.Size(42, 56));
                var resWinTpt = _.template($("#yjwzPopWinTpt").html());
                tmpWinCon = resWinTpt(tmpData);
            }*/ else if ("运输保障" == tmpData.resType) {
            	img = "../../../../images/module/ems/emseverepro/ysbz.png";
                tmpMarkIcon = new BMap.Icon(BASE_URL + "images/portal/icon_gisYsbz.png", new BMap.Size(42, 56));
                var resWinTpt = _.template($("#ysbzPopWinTpt").html());
                tmpWinCon = resWinTpt(tmpData);
                typeCode = "ysbz"
            } else if ("通信保障" == tmpData.resType) {
            	img = "../../../../images/module/ems/emseverepro/txbz.png";
                tmpMarkIcon = new BMap.Icon(BASE_URL + "images/portal/icon_gisTxbz.png", new BMap.Size(42, 56));
                var resWinTpt = _.template($("#txbzPopWinTpt").html());
                tmpWinCon = resWinTpt(tmpData);
                typeCode = "txbz"
            } else {
                tmpMarkIcon = new BMap.Icon(BASE_URL + "images/portal/icon_gisYjjg.png", new BMap.Size(42, 56));
                tmpWinCon = "未知点位";
            }

            tbodyData += 
				'<div class="resContent '+typeCode+'" data-resId="' + tmpData.resId + '">'+
				'<img src="'+img+'" alt="'+tmpData.resType+'">'+
				'<p>资源类型：'+tmpData.resType+'</p>'+
				'<p>资源名称：'+tmpData.resName+'</p>'+
				'</div>';
            
            var tmpMarker = new BMap.Marker(tmpPt, {
                "title": tmpData.resName,
                "icon": tmpMarkIcon
            });

            //允许清除覆盖物
            tmpMarker.enableMassClear();

            //将点位存储至map集合工具类中
            curEntAndMatlsDic.put(tmpData.resId, {
                "data": tmpData,
                "marker": tmpMarker,
                "click": function (){
                	map.panTo(tmpPt);

                    var infoBox = new BMapLib.InfoBox(map, tmpWinCon, {
                        boxStyle: {
                            minWidth: "300",
                            Height: "200",
                            marginBottom: "20px"
                        }
                        , closeIconMargin: "4px 4px 4px 4px"
                        , closeIconUrl: BASE_URL + "images/map/icon/iw_close1d3.gif"
                        , enableAutoPan: false
                        , align: INFOBOX_AT_TOP
                    });

                    infoBoxList.push(infoBox);
                    _.map(infoBoxList, function (infobox) {
                        infobox.close();
                    });

                    //点位跳动
                    tmpMarker.setAnimation(BMAP_ANIMATION_BOUNCE);

                    //infobox打开时的回调事件
                    infoBox.addEventListener("open", function (e) {
//                        openWindowScroll();
                        if ("应急机构" == tmpData.resType) {
                            //绑定应急机构弹窗内的部门切换事件
                            var $yjjgContent = $(".yjjgContent"),
                                $deptLi = $yjjgContent.find(".department11");
                            if (0 < $deptLi.length) {
                                $deptLi.off("click").on("click", function () {
                                    $(this).removeClass("visited").addClass("visited");
                                    $(this).siblings().removeClass("visited");

                                    //填充最新的部门人员信息
                                    var curDeptId = $(this).attr("data-id"),
                                        $curTbody = $("#yjjgDeptPeo").find("tbody");
                                    $curTbody.empty();
                                    var curDeptPeoArr = _.where(tmpData.deptparts, {"deptid": curDeptId});
                                    if (0 < curDeptPeoArr.length) {
                                        var deptPeoDom = "";
                                        _.map(curDeptPeoArr, function (curDeptPeo, index) {
                                            deptPeoDom += "<tr>" +
                                                "     <td>" + (null != curDeptPeo.name ? curDeptPeo.name : "-") + "</td>" +
                                                "     <td>" + (null != curDeptPeo.groupduty ? curDeptPeo.groupduty : "-") + "</td>" +
                                                "     <td>" + (null != curDeptPeo.cellphone ? curDeptPeo.cellphone : "-") + "</td>" +
                                                "     <td>" + (null != curDeptPeo.privatetel ? curDeptPeo.privatetel : "-") + "</td>" +
                                                "</tr>";
                                        });
                                        $curTbody.html(deptPeoDom);
                                    }
                                }).first().trigger("click");
                            }
                        }
                    });

                    //infoBox关闭时执行的操作
                    infoBox.addEventListener("close", function (e) {
                    	//清除路线
//                    	removePolyAndMarker();
                        //取消marker的跳动效果
                        tmpMarker.setAnimation(null);
                    });
                    infoBox.open(tmpMarker);   //图片加载完毕重绘infowindow
                },
//                "showRode":function(){
//                	if ($("#showSession").css("display") == "none") {
//                        initRoute(tmpData.resLng, tmpData.resLat, typeCode, tmpData.resName, tmpData.resId, function (result) {
//                            var distance = result.distance;
//                            var time = result.duration;
//                            $("#showSession").show();
//                            $("#route").html("距离事故点：约" + distance +"<span style='margin-left:25px;'>行车时间：约" + time+"</span>");
//                        });
//                    } else {
//                        $("#showSession").hide();
//                        removePolyAndMarker();
//                    }
//                }
            });

            //定义点位点击触发事件
            tmpMarker.addEventListener("click", function () {
                curEntAndMatlsDic.get(tmpData.resId).click();
            });

            //将点位添加至地图
            if (tmpData.resType != "应急物资") {
            	map.addOverlay(tmpMarker);
			}

        });
		$tbody.html(tbodyData);
		scrollResize();

        //为企业监管列表每一行绑定GIS弹窗事件
		$('.resContent').off("click").on("click", function () {
            curEntAndMatlsDic.get($(this).attr("data-resId")).click();
        });
	}
    return map;
}

// 刷新滚动条
function scrollResize() {
    $('.resAll').niceScroll({
        cursorborder: "#4d86d6",
        cursorcolor: "#4d86d6",
        background: false,
        autohidemode: false
    }).resize();
}

function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}