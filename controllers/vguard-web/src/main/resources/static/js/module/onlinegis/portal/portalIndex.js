$(function() {
	//显示应急救援地图
    $("#showEmsSucGis").attr("href", BASE_URL + "views/module/ems/emsmap/emResIndex.html?isPortal=true");
	
    //赋值左上角当前日期时间
    setInterval(function () {
        var now = new Date(),
            nowHours = now.getHours(),
            nowMinutes = now.getMinutes(),
            nowSeconds = now.getSeconds();
        $("#curTime").empty().html(
            (nowHours < 10 ? ("0" + nowHours) : nowHours) + ":" +
            (nowMinutes < 10 ? ("0" + nowMinutes) : nowMinutes) + ":" +
            (nowSeconds < 10 ? ("0" + nowSeconds) : nowSeconds));
        $("#curDate").empty().html(now.getFullYear() + "年" + (now.getMonth() + 1) + "月" + now.getDate() + "日"
            + "&nbsp;&nbsp;" + ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"][now.getDay()]);
    }, 1000);

    //初始化加载地图组件
    $("#portalMap").height($(window).height());
    $(window).resize(function(){
    	$("#portalMap").height($(window).height());
    });
    
    window.map = initMap();
    window.infoBoxList = [];
    window.removeOverlays = [];

    //默认初始化展示点位及列表信息
    $("#qyjg").find("#search").off("click").on("click", function () {
        //初始化加载危险源列表及GIS点位
        initQyjgMapPts();
    }).trigger("click");

    // 初始化调用一次
    getTableHeight();

    //修改地图显示样式
    var mapStyle = [
                    {
                        "featureType": "water",
                        "elementType": "all",
                        "stylers": {
                                  "color": "#0b395aff"
                        }
              },
              {
                        "featureType": "highway",
                        "elementType": "geometry.fill",
                        "stylers": {
                                  "color": "#21394aff"
                        }
              },
              {
                        "featureType": "highway",
                        "elementType": "geometry.stroke",
                        "stylers": {
                                  "color": "#21394aff"
                        }
              },
              {
                        "featureType": "arterial",
                        "elementType": "geometry.fill",
                        "stylers": {
                                  "color": "#314a5cff"
                        }
              },
              {
                        "featureType": "arterial",
                        "elementType": "geometry.stroke",
                        "stylers": {
                                  "color": "#314a5cff"
                        }
              },
              {
                        "featureType": "local",
                        "elementType": "geometry",
                        "stylers": {
                                  "color": "#314a5cff"
                        }
              },
              {
                        "featureType": "land",
                        "elementType": "all",
                        "stylers": {
                                  "color": "#09101dff",
                                  "visibility": "on"
                        }
              },
              {
                        "featureType": "railway",
                        "elementType": "geometry.fill",
                        "stylers": {
                                  "color": "#999999ff",
                                  "visibility": "off"
                        }
              },
              {
                        "featureType": "railway",
                        "elementType": "geometry.stroke",
                        "stylers": {
                                  "color": "#444444ff",
                                  "visibility": "off"
                        }
              },
              {
                        "featureType": "subway",
                        "elementType": "geometry",
                        "stylers": {
                                  "lightness": -70
                        }
              },
              {
                        "featureType": "building",
                        "elementType": "geometry.fill",
                        "stylers": {
                                  "color": "#000000ff"
                        }
              },
              {
                        "featureType": "all",
                        "elementType": "labels.text.fill",
                        "stylers": {}
              },
              {
                        "featureType": "all",
                        "elementType": "labels.text.stroke",
                        "stylers": {
                                  "color": "#000000ff",
                                  "visibility": "on"
                        }
              },
              {
                        "featureType": "building",
                        "elementType": "geometry",
                        "stylers": {
                                  "color": "#152a38ff"
                        }
              },
              {
                        "featureType": "green",
                        "elementType": "geometry",
                        "stylers": {
                                  "color": "#042203ff"
                        }
              },
              {
                        "featureType": "boundary",
                        "elementType": "all",
                        "stylers": {
                                  "color": "#0f7880ff"
                        }
              },
              {
                        "featureType": "manmade",
                        "elementType": "geometry",
                        "stylers": {
                                  "color": "#151c2aff",
                                  "visibility": "on"
                        }
              },
              {
                        "featureType": "poi",
                        "elementType": "all",
                        "stylers": {
                                  "visibility": "on"
                        }
              },
              {
                        "featureType": "all",
                        "elementType": "labels.icon",
                        "stylers": {
                                  "visibility": "off"
                        }
              },
              {
                        "featureType": "all",
                        "elementType": "labels.text.fill",
                        "stylers": {
                                  "color": "#3d85c6ff",
                                  "visibility": "on"
                        }
              }
    ];
    //一级菜单按钮事件绑定
    $('.singleTab').on('click', 'div', function () {
        $('.singleTab div i').removeClass('active');
        // kind 获取点击的元素
        var kind = $(this).data('kind');
        $('.' + kind).addClass('active');
        $('.listPage').removeClass('block');
        $('#' + kind).addClass('block');
        $('.rb').hide();
        $('.' + kind + 'rb').show();
        if (kind == "hjjg") {
            $('#hjjgLevel').addClass('block');
        }
        else {
            $('#hjjgLevel').removeClass('block');
        }

        if ("zdwxy" == kind) {
        	map.setMapStyle({styleJson: mapStyle});
            //重大危险源一级菜单被点击
            $("#zdwxy").find("#search").off("click").on("click", function () {
                //初始化加载危险源列表及GIS点位
                initZdwxyMapPts();
            }).trigger("click");
        } else if ("qyjg" == kind) {
        	map.setMapStyle({styleJson: mapStyle});
            //企业监管一级菜单被点击
            $("#qyjg").find("#search").off("click").on("click", function () {
                //初始化加载企业监管列表及GIS点位
                initQyjgMapPts();
            }).trigger("click");
        } else if ("yhfb" == kind) {
        	map.setMapStyle({styleJson: mapStyle});
            //隐患分布一级菜单被点击

            //初始化年份筛选
            var date = new Date;
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var quarter = getQuarter(month);
            $("#yhfb").find("#searchHid").off("click").on("click", function () {
                //初始化加载隐患分布列表及GIS点位
                initYhfbMapPts(year, quarter);
            }).trigger("click");

            $("#yhfb").find("#filter").off("click").on("click", function () {
                //初始化加载隐患分布列表及GIS点位
                $("#yhfb").find("#filterDiv").toggle();
            });
            $("#yearDiv").empty();
            $("#yearDiv").append("年份:<a href='javascript:void(0);' class='yearUnSelected'>" + (year - 4) + "</a>" +
                "<a href='javascript:void(0);' class='yearUnSelected'>" + (year - 3) + "</a>" +
                "<a href='javascript:void(0);' class='yearUnSelected'>" + (year - 2) + "</a>" +
                "<a href='javascript:void(0);' class='yearUnSelected'>" + (year - 1) + "</a>" +
                "<a href='javascript:void(0);' class='yearSelected'>" + year + "</a>");

            switch (quarter) {
                case 1:
                    $("#one").addClass("yearSelected");
                    break;
                case 2:
                    $("#two").addClass("yearSelected");
                    break;
                case 3:
                    $("#three").addClass("yearSelected");
                    break;
                case 4:
                    $("#four").addClass("yearSelected");
                    break;
            }

            $("#yearDiv").find("a").each(function () {
                $(this).bind("click", function () {
                    $(this).addClass('yearSelected').siblings().attr("class", "yearUnSelected");

                    initYhfbMapPts($(this).text(), $("#monthDiv").find(".yearSelected").text());
                });
            });


            $("#monthDiv").find("a").each(function () {
                $(this).bind("click", function () {
                    $(this).addClass('yearSelected').siblings().attr("class", "yearUnSelected");
                    initYhfbMapPts($("#yearDiv").find(".yearSelected").text(), $(this).text());
                });
            });


        } else if ("aqxc" == kind) {
        	map.setMapStyle({styleJson: mapStyle});
            //安全巡查一级菜单被点击
            $("#aqxc").find("#search").off("click").on("click", function () {
                //初始化加载安全巡查列表及GIS点位
                initAqxcMapPts();
            }).trigger("click");
        } else if ("jcdw" == kind) {
        	map.setMapStyle({styleJson: mapStyle});
            //重大危险源监测点位一级菜单被点击
            $("#jcdw").find("#search").off("click").on("click", function () {
//                var browserAg = navigator.userAgent.toString().toLowerCase();
//                if (-1 < browserAg.indexOf("firefox") || -1 < browserAg.indexOf("chrome")) {
//                    parent.toast("请使用IE10及以上浏览器查看具体视频！");
//                }
                //初始化加载监测点位列表及GIS点位
                initJcdwMapPts();
            }).trigger("click");

        } else if ("zffb" == kind) {
        	map.setMapStyle({styleJson: mapStyle});
            //执法分布一级菜单被点击
            $("#zffb").find("#search").off("click").on("click", function () {
                //初始化加载执法分布列表及GIS点位
                initZffbMapPts();
            }).trigger("click");
        } else if ("aqfx" == kind) {
        	map.setMapStyle({styleJson: mapStyle});
            //安全风险一级菜单被点击
            $("#aqfx").find("#search").off("click").on("click", function () {
                //初始化加载安全风险列表及GIS点位
                initAqfxMapPts();
            }).trigger("click");

        } else if ("yjzy" == kind) {
        	map.setMapStyle({styleJson: mapStyle});
            //应急资源一级菜单被点击
            $("#yjzy").find("#search").off("click").on("click", function () {
                //初始化加载应急资源列表及GIS点位
                initYjzyMapPts();
            }).trigger("click");
        } else if ("ggqyjc" == kind) {
        	map.setMapStyle({styleJson: mapStyle});
            //公共区域一级菜单被点击
            $("#ggqyjc").find("#search").off("click").on("click", function () {
//	        	var browserAg = navigator.userAgent.toString().toLowerCase();
//	        	if (-1 < browserAg.indexOf("firefox") || -1 < browserAg.indexOf("chrome")) {
//	        		parent.toast("请使用IE10及以上浏览器查看具体视频！");
//	        	} 

	        	//初始化加载公共区域列表及GIS点位
	        	initGgqyjcMapPts();
            }).trigger("click");
        } else if ("hjjg" == kind) {
        	map.setMapStyle({styleJson: mapStyle});
        	//环境监管类一级菜单
        	var hjjgTgtKind = $("#hjjg").find(".activehjjg").parent().attr("data-kind");
        	if ("dqhj" == hjjgTgtKind) {
        		//大气环境类点击加载及联动
        		initDqhjMapPts();
        	} else if ("shj" == hjjgTgtKind) {
        		//水环境类点击加载及联动
        		initShjMapPts();
        	} else if ("wry" == hjjgTgtKind) {
        		//污染源类点击加载及联动
        		initWryMapPts();
        	}
        } else if ("yqss" == kind) {
        	//修改地图配色
        	mapStyles = [
    	       		 {
    	       		           "featureType": "water",
    	       		           "elementType": "all",
    	       		           "stylers": {
    	       		                     "color": "#0f233cff"
    	       		           }
    	       		 },
    	       		 {
    	       		           "featureType": "highway",
    	       		           "elementType": "geometry.fill",
    	       		           "stylers": {
    	       		                     "color": "#111c31ff"
    	       		           }
    	       		 },
    	       		 {
    	       		           "featureType": "highway",
    	       		           "elementType": "geometry.stroke",
    	       		           "stylers": {
    	       		                     "color": "#111c31ff"
    	       		           }
    	       		 },
    	       		 {
    	       		           "featureType": "arterial",
    	       		           "elementType": "geometry.fill",
    	       		           "stylers": {
    	       		                     "color": "#101b2fff"
    	       		           }
    	       		 },
    	       		 {
    	       		           "featureType": "arterial",
    	       		           "elementType": "geometry.stroke",
    	       		           "stylers": {
    	       		                     "color": "#111c31ff"
    	       		           }
    	       		 },
    	       		 {
    	       		           "featureType": "local",
    	       		           "elementType": "geometry",
    	       		           "stylers": {
    	       		                     "color": "#111c31ff"
    	       		           }
    	       		 },
    	       		 {
    	       		           "featureType": "land",
    	       		           "elementType": "all",
    	       		           "stylers": {
    	       		                     "color": "#09101dff",
    	       		                     "visibility": "on"
    	       		           }
    	       		 },
    	       		 {
    	       		           "featureType": "railway",
    	       		           "elementType": "geometry.fill",
    	       		           "stylers": {
    	       		                     "color": "#999999ff",
    	       		                     "visibility": "off"
    	       		           }
    	       		 },
    	       		 {
    	       		           "featureType": "railway",
    	       		           "elementType": "geometry.stroke",
    	       		           "stylers": {
    	       		                     "color": "#444444ff",
    	       		                     "visibility": "off"
    	       		           }
    	       		 },
    	       		 {
    	       		           "featureType": "subway",
    	       		           "elementType": "geometry",
    	       		           "stylers": {
    	       		                     "lightness": -70
    	       		           }
    	       		 },
    	       		 {
    	       		           "featureType": "building",
    	       		           "elementType": "geometry.fill",
    	       		           "stylers": {
    	       		                     "color": "#000000ff"
    	       		           }
    	       		 },
    	       		 {
    	       		           "featureType": "all",
    	       		           "elementType": "labels.text.fill",
    	       		           "stylers": {}
    	       		 },
    	       		 {
    	       		           "featureType": "all",
    	       		           "elementType": "labels.text.stroke",
    	       		           "stylers": {
    	       		                     "color": "#000000ff",
    	       		                     "visibility": "on"
    	       		           }
    	       		 },
    	       		 {
    	       		           "featureType": "building",
    	       		           "elementType": "geometry",
    	       		           "stylers": {
    	       		                     "color": "#152a38ff"
    	       		           }
    	       		 },
    	       		 {
    	       		           "featureType": "green",
    	       		           "elementType": "geometry",
    	       		           "stylers": {
    	       		                     "color": "#042203ff"
    	       		           }
    	       		 },
    	       		 {
    	       		           "featureType": "boundary",
    	       		           "elementType": "all",
    	       		           "stylers": {
    	       		                     "color": "#111c31ff"
    	       		           }
    	       		 },
    	       		 {
    	       		           "featureType": "manmade",
    	       		           "elementType": "geometry",
    	       		           "stylers": {
    	       		                     "color": "#151c2aff",
    	       		                     "visibility": "on"
    	       		           }
    	       		 },
    	       		 {
    	       		           "featureType": "poi",
    	       		           "elementType": "labels.text.fill",
    	       		           "stylers": {
    	       		                     "color": "#3d85c6ff",
    	       		                     "lightness": -50,
    	       		                     "visibility": "on"
    	       		           }
    	       		 },
    	       		 {
    	       		           "featureType": "all",
    	       		           "elementType": "labels.icon",
    	       		           "stylers": {
    	       		                     "visibility": "off"
    	       		           }
    	       		 },
    	       		 {
    	       		           "featureType": "all",
    	       		           "elementType": "labels.text.fill",
    	       		           "stylers": {
    	       		                     "color": "#3d85c6ff",
    	       		                     "lightness": -50,
    	       		                     "visibility": "on"
    	       		           }
    	       		 }
    	       	                ];
        	map.setMapStyle({styleJson: mapStyles});
            //园区设施一级菜单被点击
//            $("#yqss").on("click", function () {
                //初始化加载应急资源列表及GIS点位
            	initYqssMapPts();
//            }).trigger("click");
        }

        // ***************** 一级菜单点击调用这个方法
        getTableHeight();
    });

    //二三级菜单筛选
    $('.singleKind').on('click', 'div', function () {
        var kind = $(this).data('kind');
        if (kind == "dqhj" || kind == "shj" || kind == "wry") {
            $('.hjjg1 i').removeClass('activehjjg');
            $(this).children('i').addClass('activehjjg');
            $('.hjjgList').removeClass('disTable');
            $('#' + kind).addClass('disTable');
            $('.level').removeClass('block');
            $('#' + kind + 'Level').addClass('block');
        } else {
            $(this).children('i').toggleClass('active' + kind);
        }
        ;
        if ($(this).children('i').hasClass('active' + kind)) {
            // 二三级筛选选中
            //console.log(kind + '已选中')
        } else {
            // 未选中
            // console.log(kind + '未选中');
        }

        if ("whpl" == kind || "rql" == kind || "gkl" == kind ||
            "third" == kind || "three" == kind || "one" == kind ||
            "two" == kind) {
            //初始化加载重大危险源列表及GIS点位
            initZdwxyMapPts();
        } else if ("gyjhxpl" == kind || "smjfwl" == kind || "jtysl" == kind ||
            "gcjsl" == kind) {
            //初始化加载企业监管列表及GIS点位
            initQyjgMapPts();
        } else if ("zdyh" == kind || "ybyh" == kind) {
            //初始化加载隐患分布列表及GIS点位

            //初始化年份筛选
            var date = new Date;
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var quarter = getQuarter(month);
            initYhfbMapPts(year, quarter);
        } else if ("zczb" == kind || "wgxc" == kind) {
            //初始化加载安全巡查列表及GIS点位
            initAqxcMapPts();
        } else if ("ggqy" == kind || "zdwxyqy" == kind) {
            //初始化加载监测点位列表及GIS点位
            initJcdwMapPts();
        } else if ("sczyhd" == kind || "wxzyhd" == kind ||
            "gygc" == kind || "sbss" == kind ||
            "czcx" == kind || "cshj" == kind
        ) {
            //初始化加载安全风险列表及GIS点位
            initAqfxMapPts();
        } else if ("yjjg" == kind || "yjdw" == kind || "yjzj" == kind ||
            "yjck" == kind || "yljg" == kind || "bncs" == kind || "yjwz" == kind ||
            "ysbz" == kind || "txbz" == kind) {
            //初始化加载应急资源列表及GIS点位
            initYjzyMapPts();
        } else if ("dqhj" == kind) {
        	//大气环境类点击加载及联动
    		initDqhjMapPts();
        } else if ("shj" == kind) {
        	//水环境类点击加载及联动
    		initShjMapPts();
        } else if ("wry" == kind) {
        	//污染源类点击加载及联动
    		initWryMapPts();
        } else if ("yyys" == kind || "xfgy" == kind || "dlsb" == kind ||
                "zqgd" == kind || "wscl" == kind || "ljsj" == kind || "gygl" == kind ||
                "yspw" == kind || "heda" == kind) {
                //初始化加载园区设施列表及GIS点位
        	initYqssMapPts();
            }
        getTableHeight();
    });


    $('.kindHeader').on('click', 'i', function () {
        var id = $(this).data('id');
        var index = $(this).data('index');
        if (index == '1') {
            $('.' + id).css({
                height: 0
            });
            $(this).data('index', '0').attr('class', 'icon-arrow-down');
        }
        else {
            if (id == 'aqfxclose' || id == "yjzyclose") {
                $('.' + id).css({
                    height: 157
                });
            }
            else {
                $('.' + id).css({
                    height: 80
                });
            }
            ;
            $(this).data('index', '1').attr('class', 'icon-arrow-up');
        }

        //************二三级点击调用方法 */
        getTableHeight();
    });

    $('.selectHeader').on('click', 'i', function () {
        var id = $(this).data('id');
        var index = $(this).data('index');
        var i = $(this);

        // console.log('****' + id, '####' + index);
        if (index == '1') {
            // $('.' + id).animate({
            //     height: 0
            // });
            $(this).attr("class", "icon-arrow-down");
            $('.' + id).hide(1000);
            $(this).data('index', '0');
        }
        else {
            // $('.' + id).animate({
            //     height: 190
            // });
            $(this).attr("class", "icon-arrow-up");
            $('.' + id).show(1000);
            $(this).data('index', '1');
        }
    });
    // $('#biaohui11').on('mouseover',function(){
    //     $('.biaohui').fadeIn();
    // })
    // $('#biaohui11').on('mouseleave',function(){
    //     $('.biaohui').fadeOut();
    // })
    $('#tabClose').on('click', function () {
        if ($(this).children('i').attr('class') == 'icon-arrow-left') {
            $('.nav').animate({
                left: "-310px"
            })
            $(this).children('i').attr('class', 'icon-arrow-right');
        }
        else {
            $('.nav').animate({
                left: "10px"
            })
            $(this).children('i').attr('class', 'icon-arrow-left');
        }
    });

    $('.listClose').on('click', function () {
        if ($(this).children('i').attr('class') == 'icon-arrow-left') {
            $('.listPage').animate({
                left: "-310px"
            })
            $(this).children('i').attr('class', 'icon-arrow-right');
        }
        else {
            $('.listPage').animate({
                left: "10px"
            })
            $(this).children('i').attr('class', 'icon-arrow-left');
        }
    });

    $('.rightClose').on('click', function () {
        if ($(this).children('i').attr('class') == 'icon-arrow-right') {
            $('.infoRight').animate({
                right: "-310px"
            });
            $(this).children('i').attr('class', 'icon-arrow-left');
        } else {
            $('.infoRight').animate({
                right: "10px"
            });
            $(this).children('i').attr('class', 'icon-arrow-right');
        }
    });

    $('#moreTab').click(function () {
        var index = $(this).data('index');
        if (index == '1') {
            $('.yjzyclose').animate({
                "top": -70
            });
            $(this).data('index', '0');
            $(this).html('向上查看更多菜单')
        } else {
            $('.yjzyclose').animate({
                "top": 0
            });
            $(this).data('index', '1');
            $(this).html('向下查看更多菜单')
        }
    });

    $('#morezyTab').click(function () {
        var index = $(this).data('index');
        if (index == '1') {
            $('.yqssclose').animate({
                "top": -70
            });
            $(this).data('index', '0');
            $(this).html('向上查看更多菜单')
        } else {
            $('.yqssclose').animate({
                "top": 0
            });
            $(this).data('index', '1');
            $(this).html('向下查看更多菜单')
        }
        return false;
    });
    
    $('.fdiv').on('mouseover', becomeLan);
    $('.fdiv').on('mouseleave', becomeGray);
    window.drawoverlays = [];
    $('.fdiv').on('click', function () {
//        var index = $(this).data('index');
//        if(index == '0'){
//            becomeLan();
//            $(this).data('index','1');
//            $(this).off('mouseleave');
//        }
//        else{
//            becomeGray();
//            $(this).data('index','0');
//            $(this).on('mouseleave',becomeGray);
//        }

        //定义GIS放大缩小、测距逻辑
//        var disToolOverLay = [];

        var styleOptions = {
            strokeColor:"red",    //边线颜色。
            fillColor:"red",      //填充颜色。当参数为空时，圆形将没有填充效果。
            strokeWeight: 3,       //边线的宽度，以像素为单位。
            strokeOpacity: 0.8,	   //边线透明度，取值范围0 - 1。
            fillOpacity: 0.6,      //填充的透明度，取值范围0 - 1。
            strokeStyle: 'solid' //边线的样式，solid或dashed。
        }
        //实例化鼠标绘制工具
        var drawingManager = new BMapLib.DrawingManager(window.map, {
            isOpen: false, //是否开启绘制模式
            enableDrawingTool: false, //是否显示工具栏
            drawingToolOptions: {
                anchor: BMAP_ANCHOR_TOP_RIGHT, //位置
                offset: new BMap.Size(5, 5), //偏离值
            },
            circleOptions: styleOptions, //圆的样式
            polylineOptions: styleOptions, //线的样式
            polygonOptions: styleOptions, //多边形的样式
            rectangleOptions: styleOptions //矩形的样式
        });

        var overlaycomplete = function(e){
            window.drawoverlays.push(e.overlay);

            drawingManager.close();
        };
        var overlayHcq = function (e) {
            if(window.drawoverlays){
                if(window.drawoverlays.length>0){
                    _.map(window.drawoverlays,function(item){
                        window.map.removeOverlay(item);
                    });
                }
            }
            //在地图上显示被缓冲区隐藏的点位
            if(window.removeOverlays){
                if(window.removeOverlays.length>0){
                    _.map(window.removeOverlays,function(item){
                        window.map.addOverlay(item);
                    });
                }
            }


            window.drawoverlays.push(e.overlay);
          //遍历所有的应急资源
            if(window.curEntAndMatlsDic){


                _.map(window.curEntAndMatlsDic.values(),function (item) {
                    console.log(item);
                    var isIn = BMapLib.GeoUtils.isPointInCircle(item.marker.getPosition(),e.overlay);
                    if(!isIn) {
                        window.map.removeOverlay(item.marker);
                        window.removeOverlays.push(item.marker);
                    }
                });
            }
            drawingManager.close();
        };

        if ("fangda" == $(this).attr("data-id")) {
            window.map.zoomIn();
        } else if ("suoxiao" == $(this).attr("data-id")) {
            window.map.zoomOut();
        } else if ("ceju" == $(this).attr("data-id")) {
            window.disMeaTool = new BMapLib.DistanceTool(window.map);
            window.disMeaTool.open();  //开启鼠标测距
//        	if (window.disMeaTool) {
//        		window.disMeaTool.close();  //开启鼠标测距
//        		window.disMeaTool = null;
//        		if (0 < disToolOverLay.length) {
//    				_.map(disToolOverLay, function(tmpOl, index) {
//    					window.map.removeOverlay(tmpOl);
//    				});
//    			}
//        	} else {
//        		window.disMeaTool = new BMapLib.DistanceTool(window.map);
//        		window.disMeaTool.open();  //开启鼠标测距
//        		//清除测距覆盖物时回调事件
//        		window.disMeaTool.addEventListener("removepolyline", function(e) {
//        			becomeGray();
//                    $(this).data('index','0');
//                    $(this).on('mouseleave',becomeGray);
//        		});
//        		window.disMeaTool.addEventListener("addpoint", function(e) {
//        		});
//        		window.disMeaTool.addEventListener("drawend", function(e) {
//        			if (e.overlays && 0 < e.overlays.length) {
//        				_.map(e.overlays, function(tmpOl, index) {
//        					disToolOverLay.push(tmpOl);
//        				});
//        			}
//        		});
//        	}
        }else if("huayuan" == $(this).attr("data-id") ){
            drawingManager.addEventListener('overlaycomplete', overlaycomplete);
            drawingManager.setDrawingMode(BMAP_DRAWING_CIRCLE);
            drawingManager.open();
        }else if("huaxian" == $(this).attr("data-id")){
            drawingManager.addEventListener('overlaycomplete', overlaycomplete);
            drawingManager.setDrawingMode(BMAP_DRAWING_POLYLINE);
            drawingManager.open();
        }else if("huatu" == $(this).attr("data-id")){
            drawingManager.addEventListener('overlaycomplete', overlaycomplete);
            drawingManager.setDrawingMode(BMAP_DRAWING_POLYGON);
            drawingManager.open();
        }else if("huafangxing" == $(this).attr("data-id")){
            drawingManager.addEventListener('overlaycomplete', overlaycomplete);
            drawingManager.setDrawingMode(BMAP_DRAWING_RECTANGLE);
            drawingManager.open();
        }else if("qingchu"==$(this).attr("data-id")){
            if(window.drawoverlays){
                if(window.drawoverlays.length>0){
                    _.map(window.drawoverlays,function(item){
                       window.map.removeOverlay(item);
                    });
                }
            }

            //在地图上显示被缓冲区隐藏的点位
            if(window.removeOverlays){
                if(window.removeOverlays.length>0){
                    _.map(window.removeOverlays,function(item){
                       window.map.addOverlay(item);
                    });
                }
            }
        }else if("huanchongqu" == $(this).attr("data-id")){
            drawingManager.addEventListener('overlaycomplete', overlayHcq);
            drawingManager.setDrawingMode(BMAP_DRAWING_CIRCLE);
            drawingManager.open();
        }
    });

    function getTableHeight() {
        var height = 0;
        var wHeight = $(window).height();
        $('.kind').each(function () {
            height += $(this).height();
        })
        height = wHeight - height - 450;
        $('.componyList tbody').css('height', height).niceScroll({
            cursorborder: "#4d86d6",
            cursorcolor: "#4d86d6",
            background: false,
            autohidemode: false
        }).show().resize();
//        $('#zdwxyList').css('height',height).niceScroll({cursorborder:"#4d86d6",cursorcolor:"#4d86d6",background: "#c7c7c7",autohidemode: false}).show().resize();
    }

    function becomeLan() {
        var id = $(this).data('id');
        $('#' + id).attr('src', BASE_URL + '/images/portal/icon_' + id + '_lan.png');
        if (id == 'biaohui') {
            $('.' + id).fadeIn();
        }
    }

    function becomeGray() {
        var id = $(this).data('id');
        if (id == 'biaohui') {
            $('.' + id).fadeOut();
        }
        $('#' + id).attr('src', BASE_URL + '/images/portal/icon_' + id + '.png');
    }
    
    //消息提醒
    loadRemindCount();
    
//  //每隔5秒刷新提醒数目
//	setInterval(function() {		
//		//消息提醒数
//		loadRemindCount();
//	},5000)
    
    //显示应急救援地图
//    $("#showEmsSucGis").off("click").on("click", function() {
//    	window.open(BASE_URL + "views/module/ems/emsmap/emResIndex.html?isPortal=true", "_blank");
//    });
});

window.addEventListener('click',function(){
	if($('.xxtxRightTop').css('display') == 'block'){
		$(".xxtxRightTop").css('display','none');
		return 0;
	}
	else{
		return 0;
	}
	
})

/*********************消息提醒开始****************************/

$("#messageRemind").click(function() {

	$(".xxtxRightTop").toggle();
	$(".warningInfoListDiv li").removeClass('active123');
	return false;
})

//弹窗tab点击事件
$('.xxtxpopupTab').on('click','span',function(){
	$('.xxtxpopupTab span').removeClass('active12');
	$(this).addClass('active12');
	return 0;
})
//右上角tab点击事件
$('.xxtxRightTop ul').on('mouseover','.warningKind',function(){
	$('.xxtxRightTop ul li').removeClass('active11');
	$(this).addClass('active11');
	var $kind = $(this).data('kind');
	$('.warningInfoListDiv').removeClass('block');
	$('#'+$kind).addClass('block');
	return 0;
})
$('.warningInfoList').on('click','li',function(){
	$('.warningInfoList li').removeClass("active123");
	$(this).addClass('active123');
	return 0;
})
//提醒数目
function loadRemindCount(){
	$.ajax({
		type :'post',
		url : BASE_URL+'/indexalert/remindCount',
		dataType : 'json',
		global : false,
		async : false,
		success : function(data) {
			if(data.total>99){
				$("#remindCount").text("99+");
			} else {				
				$("#remindCount").text(data.total);
			}
			$("#yhtx").text(data.yhtotal);
			$("#zstx").text(data.zstotal);
			$("#usertype").val(data.userType);
			/**隐患类别*/
			$("#dzgwyq").val(data.dzgwyq);
			$("#dfc").val(data.dfc);
			$("#dhx").val(data.dhx);
			$("#dzgyq").val(data.dzgyq);
			/**证书类型*/
			$("#zgzz").val(data.zgzz);
			$("#whpxk").val(data.whpxk);
			$("#aqsczrr").val(data.aqsczrr);
			$("#aqscglr").val(data.aqscglr);
			$("#tzzyry").val(data.tzzyry);
			$("#tzsbzyry").val(data.tzsbzyry);
			/**监测、故障报警*/
			$("#gzbj").text(data.alarmFaultCount);
			$("#jcbj").text(data.alarmCount);
			$("#gzbjent").text(data.alarmFaultEntCount);
            $("#jcbjent").text(data.alarmEntCount);
			/**任务提醒*/
			$("#rwtx").text(data.rwtotal);
			$("#yjrw").val(data.yjrw);
			$("#jjrw").val(data.jjrw);
			getHuanbao();
		},
		error : function() {
			parent.toast("网络异常");
		}
	});




}

function getHuanbao() {
    $.ajax({
        type: 'post',
        url: BASE_URL + '/epi/epialaram/getHbMsg',
        global: false,
        async: false,
        data: {
            page:1,
            rows:10
        },
        success: function (data) {
//            console.log(data);

            if(data){
                if(!$("#remindCount").text()=="99+"){
                    var count = parseInt($("#remindCount").text()) + data.total;
                    if(count>99){
                        $("#remindCount").text("99+");
                    }else{
                        $("#remindCount").text(count);
                    }

                }
                $("#hbbj").text(data.total);
            }


        },
        error: function () {
            console.log("----------error--------");
        }
    });
}


$(".closeWin").click(function() {
	$(".xxtxpopup").css('display','none');
});

function closeAll(){
	$(".xxtxpopup").css('display','none');
}

//打开隐患窗口
$("#xxyh").off("click").on("click",function(){

	var dzgwyq = $("#dzgwyq").val();
	var dfc = $("#dfc").val();
	var dhx = $("#dhx").val();
	var dzgyq = $("#dzgyq").val();
	var usertype = $("#usertype").val();
	parent.openWin(BASE_URL+ "/views/module/system/remindinfo/gisHidRemindList.html?dzgwyq="+dzgwyq+"&dfc="+dfc+"&dhx="+dhx+"&dzgyq="+dzgyq+"&usertype="+usertype+"&isGis=true",
			'隐患提醒列表', '60%', '60%');
});

//打开环保窗口
$("#xxhb").off("click").on("click", function () {
    parent.openWin(BASE_URL + "/views/module/system/remindinfo/gisalarmhbList.html?isGis=true",
        '环保提醒列表', '60%', '60%');
});

//打开证书窗口
$("#xxzs").off("click").on("click",function(){
	var zgzz = $("#zgzz").val();
	var whpxk = $("#whpxk").val();
	var aqsczrr = $("#aqsczrr").val();
	var aqscglr = $("#aqscglr").val();
	var tzzyry = $("#tzzyry").val();
	var tzsbzyry = $("#tzsbzyry").val();
	parent.openWin(BASE_URL+ "/views/module/system/remindinfo/gisCertifRemindList.html?zgzz="+zgzz+"&whpxk="+whpxk+"&aqsczrr="+aqsczrr+"&aqscglr="+aqscglr+"&tzzyry="+tzzyry+"&tzsbzyry="+tzsbzyry,
			'证书提醒列表', '70%', '60%');
});

//打开任务窗口
$("#xxrw").off("click").on("click",function(){

	var yjrw = $("#yjrw").val();
	var jjrw = $("#jjrw").val();
	var usertype = $("#usertype").val();
	parent.openWin(BASE_URL+ "/views/module/system/remindinfo/gisEmsTaskList.html?yjrw="+yjrw+"&jjrw="+jjrw+"&usertype="+usertype,
			'任务提醒列表', '60%', '60%');
});



//打开故障报警窗口
$("#xxgz").off("click").on("click",function(){
	var usertype = $("#usertype").val();
	parent.openWin(BASE_URL+ "/views/module/system/remindinfo/gisFaultAlarmList.html?usertype="+usertype,
			'故障报警列表', '60%', '60%');
});


//打开监测报警窗口
$("#xxjc").off("click").on("click",function(){
	var usertype = $("#usertype").val();
	parent.openWin(BASE_URL+ "/views/module/system/remindinfo/gisAlarmList.html?usertype="+usertype,
			'监测报警列表', '60%', '60%');
//	parent.openWin(BASE_URL+ "/views/module/ems/emscallalarm/emscallalarmAdd.html?policeofficerseat=123&alarmphone=13588269635&callid=12536",
//			'监测报警列表', '60%', '60%');
	
});

/*********************消息提醒结束****************************/


function openWindowScroll() {
	$('.yqssarea').niceScroll({
        cursorborder: "#4d86d6",
        cursorcolor: "#4d86d6",
        background: false,
        horizrailenabled: false,
        autohidemode: false
    }).show().resize();
    $('.yjzyarea').niceScroll({
        cursorborder: "#4d86d6",
        cursorcolor: "#4d86d6",
        background: false,
        horizrailenabled: false,
        autohidemode: false
    }).show().resize();
    $('.peopleInfo table tbody').niceScroll({
        cursorborder: "#4d86d6",
        cursorcolor: "#4d86d6",
        background: false,
        horizrailenabled: false,
        autohidemode: false
    }).show().resize();
    $('.department').niceScroll({
        cursorborder: "#4d86d6",
        cursorcolor: "#4d86d6",
        background: false,
        horizrailenabled: false,
        autohidemode: false
    }).show().resize();
    
}

/**
 * 初始化地图
 * @returns {BMap.Map}
 */
function initMap() {
    //地图本地根据IP地址定位以及添加标尺(禁止点击地图上的地点弹出百度详情)
    var map = new BMap.Map("portalMap", {enableMapClick: false, minZoom: 6, maxZoom: 18}); // 创建Map实例
    map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放

    //修改地图显示样式
    var mapStyle = [
                    {
                        "featureType": "water",
                        "elementType": "all",
                        "stylers": {
                                  "color": "#0b395aff"
                        }
              },
              {
                        "featureType": "highway",
                        "elementType": "geometry.fill",
                        "stylers": {
                                  "color": "#21394aff"
                        }
              },
              {
                        "featureType": "highway",
                        "elementType": "geometry.stroke",
                        "stylers": {
                                  "color": "#21394aff"
                        }
              },
              {
                        "featureType": "arterial",
                        "elementType": "geometry.fill",
                        "stylers": {
                                  "color": "#314a5cff"
                        }
              },
              {
                        "featureType": "arterial",
                        "elementType": "geometry.stroke",
                        "stylers": {
                                  "color": "#314a5cff"
                        }
              },
              {
                        "featureType": "local",
                        "elementType": "geometry",
                        "stylers": {
                                  "color": "#314a5cff"
                        }
              },
              {
                        "featureType": "land",
                        "elementType": "all",
                        "stylers": {
                                  "color": "#09101dff",
                                  "visibility": "on"
                        }
              },
              {
                        "featureType": "railway",
                        "elementType": "geometry.fill",
                        "stylers": {
                                  "color": "#999999ff",
                                  "visibility": "off"
                        }
              },
              {
                        "featureType": "railway",
                        "elementType": "geometry.stroke",
                        "stylers": {
                                  "color": "#444444ff",
                                  "visibility": "off"
                        }
              },
              {
                        "featureType": "subway",
                        "elementType": "geometry",
                        "stylers": {
                                  "lightness": -70
                        }
              },
              {
                        "featureType": "building",
                        "elementType": "geometry.fill",
                        "stylers": {
                                  "color": "#000000ff"
                        }
              },
              {
                        "featureType": "all",
                        "elementType": "labels.text.fill",
                        "stylers": {}
              },
              {
                        "featureType": "all",
                        "elementType": "labels.text.stroke",
                        "stylers": {
                                  "color": "#000000ff",
                                  "visibility": "on"
                        }
              },
              {
                        "featureType": "building",
                        "elementType": "geometry",
                        "stylers": {
                                  "color": "#152a38ff"
                        }
              },
              {
                        "featureType": "green",
                        "elementType": "geometry",
                        "stylers": {
                                  "color": "#042203ff"
                        }
              },
              {
                        "featureType": "boundary",
                        "elementType": "all",
                        "stylers": {
                                  "color": "#0f7880ff"
                        }
              },
              {
                        "featureType": "manmade",
                        "elementType": "geometry",
                        "stylers": {
                                  "color": "#151c2aff",
                                  "visibility": "on"
                        }
              },
              {
                        "featureType": "poi",
                        "elementType": "all",
                        "stylers": {
                                  "visibility": "on"
                        }
              },
              {
                        "featureType": "all",
                        "elementType": "labels.icon",
                        "stylers": {
                                  "visibility": "off"
                        }
              },
              {
                        "featureType": "all",
                        "elementType": "labels.text.fill",
                        "stylers": {
                                  "color": "#3d85c6ff",
                                  "visibility": "on"
                        }
              }
    ];
//    var mapStyle = [
//        {
//            "featureType": "water",
//            "elementType": "all",
//            "stylers": {
//                "color": "#255190ff"
//            }
//        },
//        {
//            "featureType": "highway",
//            "elementType": "geometry.fill",
//            "stylers": {
//                "color": "#3d85e2ff",
//                "weight": "2"
//            }
//        },
//        {
//            "featureType": "highway",
//            "elementType": "geometry.stroke",
//            "stylers": {
//                "color": "#147a92ff"
//            }
//        },
//        {
//            "featureType": "arterial",
//            "elementType": "geometry.fill",
//            "stylers": {
//                "color": "#3d85e2ff"
//            }
//        },
//        {
//            "featureType": "arterial",
//            "elementType": "geometry.stroke",
//            "stylers": {
//                "color": "#0b3d51ff"
//            }
//        },
//        {
//            "featureType": "local",
//            "elementType": "geometry",
//            "stylers": {
//                "color": "#0b5394ff"
//            }
//        },
//        {
//            "featureType": "land",
//            "elementType": "all",
//            "stylers": {
//                "color": "#0b1b2bff",
//                "visibility": "on"
//            }
//        },
//        {
//            "featureType": "railway",
//            "elementType": "geometry.fill",
//            "stylers": {
//                "color": "#999999ff"
//            }
//        },
//        {
//            "featureType": "railway",
//            "elementType": "geometry.stroke",
//            "stylers": {
//                "color": "#444444ff"
//            }
//        },
//        {
//            "featureType": "subway",
//            "elementType": "geometry",
//            "stylers": {
//                "lightness": -70
//            }
//        },
//        {
//            "featureType": "building",
//            "elementType": "geometry.fill",
//            "stylers": {
//                "color": "#000000ff"
//            }
//        },
//        {
//            "featureType": "all",
//            "elementType": "labels.text.fill",
//            "stylers": {}
//        },
//        {
//            "featureType": "all",
//            "elementType": "labels.text.stroke",
//            "stylers": {
//                "color": "#000000ff",
//                "visibility": "on"
//            }
//        },
//        {
//            "featureType": "building",
//            "elementType": "geometry",
//            "stylers": {
//                "color": "#14375dff"
//            }
//        },
//        {
//            "featureType": "green",
//            "elementType": "geometry",
//            "stylers": {
//                "color": "#162e09ff"
//            }
//        },
//        {
//            "featureType": "boundary",
//            "elementType": "all",
//            "stylers": {
//                "color": "#00ffffff"
//            }
//        },
//        {
//            "featureType": "manmade",
//            "elementType": "geometry",
//            "stylers": {
//                "color": "#091a2cff",
//                "visibility": "on"
//            }
//        },
//        {
//            "featureType": "poi",
//            "elementType": "all",
//            "stylers": {
//                "visibility": "off"
//            }
//        },
//        {
//            "featureType": "all",
//            "elementType": "labels.icon",
//            "stylers": {
//                "visibility": "off"
//            }
//        },
//        {
//            "featureType": "all",
//            "elementType": "labels.text.fill",
//            "stylers": {
//                "color": "#3d85c6ff",
//                "visibility": "on"
//            }
//        }
//    ];

    //设置地图样式
    map.setMapStyle({styleJson: mapStyle});

    //设置地图范围为达拉特(参数为 西南点坐标、东北点坐标)
//	var dltBound = new BMap.Bounds(new BMap.Point(109.186042, 39.791787), new BMap.Point(111.238059, 40.909685));
//	try {
//		BMapLib.AreaRestriction.setBounds(map, dltBound);
//	} catch (e) {
//		console.log("区域限定错误");
//	}
    //默认中心位置为达拉特
    map.centerAndZoom(new BMap.Point(116.8923,37.3045), 15);

    //左下角添加比例尺控件
    map.addControl(new BMap.ScaleControl({anchor: BMAP_ANCHOR_BOTTOM_LEFT}));
    
    //添加地图类型控件
//	map.addControl(new BMap.MapTypeControl());

//	function showInfo(e){
//		alert(e.point.lng + ", " + e.point.lat);
//	}
//	map.addEventListener("click", showInfo);
    addCenterCityPoly(map);
    return map;
}

/**
 * 添加地图中心点覆盖物
 * @param map
 */
function addCenterCityPoly(map) {
	//获取最新区域城市限制范围
    $.getJSON(BASE_URL + "/config/gisDefaultPolyCity.json", function(data) {
    	if (data) {
    		new BMap.Boundary().get(data.curCityName, function(rs) {
    			_.map(rs.boundaries, function(tmpBond, index) {
    				map.addOverlay(new BMap.Polygon(tmpBond, {
    					strokeWeight: 6,
    					strokeColor: "#48ab5d",
    					fillOpacity: .1,
    					strokeOpacity: 1,
    					fillColor: "#48ab5d"
    				}));
    			});
    		});
    	}
    });
}


/**
 * 初始化加载重大危险源点位及其列表数据
 */
function initZdwxyMapPts() {
    $(".infoRight").show();
    
    //默认清除地图上历史覆盖物
    window.map.clearOverlays();
    clearHistorys();
    
    //隐藏应急资源饼状图
    $("#emsResCntDiv, #hidCountDiv," +
      "#hidStateCountDiv, #hidLevelCountDiv, #qyjgCntDiv, #yjzyCntDiv, #yqssCntDiv, #publicsCntDiv").hide();
    $("#entCount").text("企业：0家");
    $("#dangerCount").text("数量：0个");
    $("#entPie, #dangerPie").empty();
    $("#zdwxyCntDiv, #entCountDiv, #dangerCountDiv").show();

//	console.log("zdwxy active666");
    var $zdwxy = $("#zdwxy");

    //最新重大危险源类型参数
    var typeParaArr = [];
    var typeLegendData = [];
    if (0 < $zdwxy.find(".activewhpl").length) {
        typeParaArr.push("1");//危化品
        typeLegendData.push("危化品类")
    }
    if (0 < $zdwxy.find(".activerql").length) {
        typeParaArr.push("2");//燃气
        typeLegendData.push("燃气类")
    }
    if (0 < $zdwxy.find(".activegkl").length) {
        typeParaArr.push("3");//港口
        typeLegendData.push("港口类")
    }

    //最新重大危险源级别参数
    var lvlParaArr = [];
    var lvlLengendData = [];
    if (0 < $zdwxy.find(".activeone").length) {
        lvlParaArr.push("1");//一级
        lvlLengendData.push("一级");
    }
    if (0 < $zdwxy.find(".activetwo").length) {
        lvlParaArr.push("2");//二级
        lvlLengendData.push("二级");
    }
    if (0 < $zdwxy.find(".activethree").length) {
        lvlParaArr.push("3");//三级
        lvlLengendData.push("三级");
    }
    if (0 < $zdwxy.find(".activethird").length) {
        lvlParaArr.push("4");//四级
        lvlLengendData.push("四级");
    }

    //查询重大危险源企业列表信息并在地图上加载相应点位
    $.ajax({
        type: "post",
        url: BASE_URL + "olgis/gisOperBuss/loadDssDanInfo",
        data: {
            "type": typeParaArr.join(","),
            "lvl": lvlParaArr.join(","),
            "entname": $zdwxy.find(".searchBox").val()
        },
        success: function (retData) {
            if (retData) {
                addCenterCityPoly(window.map);

                //清空原有所有危险源列表数据
                var $tbody = $zdwxy.find("tbody");
                $tbody.empty();
//                console.log(retData);

                //遍历生成表格数据并加载GIS危险源点位
                $("#dangerCount").text("数量:  " + retData.srchDanBaseList.length + "个");
                
                //展示重大危险源图表信息
                var allEntCnt = 0,//所有单位数
                    allDanSrcCnt = 0,//所有危险源数
                    wxhxpEntCnt = 0, //危化品单位数
                    wxhxpDanCnt = 0, //危化品危险源数
                    rqlEntCnt = 0, //燃气类单位数
                    rqlDanCnt = 0, //燃气类危险源数
                    gklEntCnt = 0, //港口类单位数
                    gklDanCnt = 0, //港口类危险源数
                    lvlOneEntCnt = 0, //一级单位数
                    lvlOneDanCnt = 0, //一级危险源数
                    lvlTwoEntCnt = 0, //二级单位数
                    lvlTwoDanCnt = 0, //二级危险源数
                    lvlThreeEntCnt = 0, //三级单位数
                    lvlThreeDanCnt = 0, //三级危险源数
                    lvlFourEntCnt = 0, //四级单位数
                    lvlFourDanCnt = 0; //四级危险源数
                
                if (0 < retData.srchDanBaseList.length) {
                    //组合危险源饼状图数据
                    var entdata = [], dangerData = [];
                    if (0 < $zdwxy.find(".activewhpl").length) {
                        entdata.push({
                            value: _.where(retData.srchDanBaseList, {"DANGERTYPE": "1"}).length,
                            name: "危化品类"
                        });
                    }
                    if (0 < $zdwxy.find(".activerql").length) {
                        entdata.push({
                            value: _.where(retData.srchDanBaseList, {"DANGERTYPE": "2"}).length,
                            name: "燃气类"
                        });
                    }
                    if (0 < $zdwxy.find(".activegkl").length) {
                        entdata.push({
                            value: _.where(retData.srchDanBaseList, {"DANGERTYPE": "3"}).length,
                            name: "港口类"
                        });
                    }
                    if (0 < $zdwxy.find(".activeone").length) {
                        dangerData.push({
                            value: _.where(retData.srchDanBaseList, {"DANGERLEVEL": "1"}).length,
                            name: "一级"
                        });
                    }
                    if (0 < $zdwxy.find(".activetwo").length) {
                        dangerData.push({
                            value: _.where(retData.srchDanBaseList, {"DANGERLEVEL": "2"}).length,
                            name: "二级"
                        });
                    }
                    if (0 < $zdwxy.find(".activethree").length) {
                        dangerData.push({
                            value: _.where(retData.srchDanBaseList, {"DANGERLEVEL": "3"}).length,
                            name: "三级"
                        });
                    }
                    if (0 < $zdwxy.find(".activethird").length) {
                        dangerData.push({
                            value: _.where(retData.srchDanBaseList, {"DANGERLEVEL": "4"}).length,
                            name: "四级"
                        });
                    }

                    //记录企业个数
                    var entcount = 0;
                    _.map(retData.srchDanBaseList, function (tmpData, index) {
                        //遍历添加GIS点位
                        if (!window.curEntAndMatlsDic.containsKey(tmpData.BUSINESSINFOID)) {
                            ++entcount;

                            //企业内部危险源总个数
                            var curEntDssCnts = _.where(retData.srchDanBaseList, {"BUSINESSINFOID": tmpData.BUSINESSINFOID}).length;
                            $tbody.append("<tr>" +
                                "<td class='entName' data-entId='" + tmpData.BUSINESSINFOID + "'>" + tmpData.ENTNAME + "</td>" +
                                "<td>" + curEntDssCnts + "</td>" +
                                //                        			"<td>" + tmpData.DANGERTYPENAME + "</td>" +
                                //                        			"<td>" + tmpData.DANGERLEVELNAME + "</td>" +
                                "</tr>");
//                            switch (tmpData.DANGERTYPE) {
//                                case "1":
//                                    entdata[0].value = entdata[0].value - _.where(retData.srchDanBaseList, {
//                                            "BUSINESSINFOID": tmpData.BUSINESSINFOID,
//                                            "DANGERTYPE": "1"
//                                        }).length + 1;
//                                    break;
//                                case "2":
//                                    entdata[1].value = entdata[1].value - _.where(retData.srchDanBaseList, {
//                                            "BUSINESSINFOID": tmpData.BUSINESSINFOID,
//                                            "DANGERTYPE": "2"
//                                        }).length + 1;
//                                    break;
//                                case "3":
//                                    entdata[2].value = entdata[2].value - _.where(retData.srchDanBaseList, {
//                                            "BUSINESSINFOID": tmpData.BUSINESSINFOID,
//                                            "DANGERTYPE": "3"
//                                        }).length + 1;
//                                    break;
//                            }

                            //定义GIS各点位
                            var tmpPt = new BMap.Point(tmpData.LONGITUDE, tmpData.LATITUDE);

                            var tmpMarker = new BMap.Marker(tmpPt, {
                                "title": tmpData.ENTNAME,
                                "icon": new BMap.Icon(BASE_URL + "images/portal/icon_gisEnt.png", new BMap.Size(42, 56))
                            });

                            var defLabelStyle = {
                                color: "#fff",
                                borderStyle: "none",
                                backgroundColor: "transparent",
                                width: 60,
                                textAlign: "center",
                                fontSize: "13px",
                                left: "8px",
                                top: "9px",
                                fontStyle: "bold"
                            };

                            var labelOffSize = curEntDssCnts / 100 >= 1 ? new BMap.Size(9, 10)
                                : curEntDssCnts / 10 >= 1 ? new BMap.Size(13, 10)
                                    : new BMap.Size(15, 10);

                            var defLabel = new BMap.Label(curEntDssCnts, {offset: labelOffSize});
                            defLabel.setStyle(defLabelStyle);
                            defLabel.show();
                            tmpMarker.setLabel(defLabel);

                            //允许清除覆盖物
                            tmpMarker.enableMassClear();

                            //定义点位弹窗内容
                            var winConhead = "<div class='bb wxypopup'>" +
                                "	<div class='popupTitle'>" + tmpData.ENTNAME +
                                "	<span id='zdwxyCount'>重大危险源清单 （" + curEntDssCnts + "个）</span>" +
                                "  </div>" +
                                "	<div class='companyInfo'>" +
                                "		<i class='fa fa-user'>&nbsp;</i>" + tmpData.LEGALPERSON + "  <i class='fa fa-phone'></i>" + tmpData.PHONE +
                                "		<br /> <i class='fa fa-map-marker'>&nbsp;</i>" + tmpData.ADDRESS +
//                                "		<br /> 重大危险源共" + curEntDssCnts + "个，" +
//                                "Ⅰ级" + _.where(retData, {"DANGERLEVEL": "1", "BUSINESSINFOID": tmpData.BUSINESSINFOID}).length + "个、" +
//                                "II 级" + _.where(retData, {"DANGERLEVEL": "2", "BUSINESSINFOID": tmpData.BUSINESSINFOID}).length + "个、" +
//                                "III 级" + _.where(retData, {"DANGERLEVEL": "3", "BUSINESSINFOID": tmpData.BUSINESSINFOID}).length + "个、" +
//                                "IV 级" + _.where(retData, {"DANGERLEVEL": "4", "BUSINESSINFOID": tmpData.BUSINESSINFOID}).length + "个，备案17个、逾期0个 <br />" +
//                                " <ul class='dangerLevel'><li class='selected'>一级</li><li>二级</li><li>三级</li><li>四级</li></ul>" +
                                "		<div class='wxyList'>" +
                                "			<table class='wxyInfo'>" +
                                "				<thead>" +
                                "					<th>危险源名称</th>" +
                                "					<th>危化品物质</th>" +
                                "					<th>单元内危险化物存量</th>" +
                                "					<th>R值</th>" +
                                "					<th>类型</th>" +
                                "					<th>级别</th>" +
                                "					<th>危险源地址</th>" +
                                "					<th>备案编号</th>" +
                                "					<th>状态</th>" +
                                "				</thead>" +
                                "				<tbody>";

                            //获取当前企业下所有危险源下的所有危化品信息
                            var allChmBaseArr = _.pluck(_.where(retData.srchDanBaseList, {"BUSINESSINFOID": tmpData.BUSINESSINFOID}), "chemList"),
                                allChmDetArr = [],
                                allChmTableDom = "";
                            _.map(allChmBaseArr, function (tmpChmArr, tmpi) {
                                allChmDetArr = _.union(allChmDetArr, tmpChmArr);
                            });
                            if (0 < allChmDetArr.length) {
                                _.map(allChmDetArr, function (tmpChmDet, tmpj) {
                                    allChmTableDom += "					<tr>" +
                                        "						<td>" + tmpChmDet.DANGERNAME + "</td>" +
                                        "						<td>" + tmpChmDet.CHEMCATALNAME + "</td>" +
                                        "						<td>" + tmpChmDet.UNITNUM + "</td>" +
                                        "						<td>" + tmpChmDet.RVAL + "</td>" +
                                        "						<td>" + tmpChmDet.DANGERTYPENAME + "</td>" +
                                        "						<td>" + tmpChmDet.DANGERLEVELNAME + "</td>" +
                                        "						<td>" + tmpChmDet.DANGERADDR + "</td>" +
                                        "						<td>" + tmpChmDet.CASEAPPLYCODE + "</td>" +
                                        "						<td>" + tmpChmDet.STATENAME + "</td>" +
                                        "					</tr>";
                                });
                            }

                            var winConFoot =
                                "				</tbody>" +
                                "			</table>" +
                                "		</div>" +
                                "		<div class='ssqy'>" +
                                "			<span>所属区域：" + tmpData.AREANAME + "</span> <span>主管部门：" + tmpData.INDUSTRYORGNAME + "</span>" +
                                "		</div>" +
                                "		<div class='jcxx'>" +
                                "			<span class='fa fa-video'>&nbsp;</span><a href='javascript:void(0);' id='entMonData'>监测视频数据</a>" +
                                //										 "			<span class='fa fa-database'>&nbsp;</span><a href='javascript:void(0);' id='entMon'>监测数据</a>" +
                                "			<span class='fa fa-tasks'>&nbsp;</span><a href='javascript:void(0);' id='entPatrolRec'>巡查记录</a>" +
                                "		</div>" +
                                "		<div class='triangle'></div>" +
                                "	</div>" +
                                "</div>";
//							var tmpWindow = new BMap.InfoWindow(winCon, {
//			 					width : 420,
//			 					height : 220,
//			 					title : "",
//			 					enableMessage : false
//			 				});

                            //删除重复点
//		 					window.map.removeOverlay(window.curEntAndMatlsDic.get(tmpData.BUSINESSINFOID).marker);
//		 					window.curEntAndMatlsDic.remove(tmpData.BUSINESSINFOID);
                            //将点位存储至map集合工具类中
                            window.curEntAndMatlsDic.put(tmpData.BUSINESSINFOID, {
                                "data": tmpData,
                                "marker": tmpMarker,
                                "click": function () {
                                    //GIS上打开点位信息窗口
//			 						window.map.centerAndZoom(tmpPt, 11);
                                	
                                	//判断点位是否在当前视野内
                                    var bound=window.map.getBounds();//地图可视区域
                                    if(bound.containsPoint(tmpPt)==false){
                                    	window.map.panTo(tmpPt);
                                    }
                                	
//			 						window.map.setCenter(tmpPt);
                                    //定义点位信息窗口回调事件
//			 						tmpWindow.addEventListener("open", function(){});
//			 						tmpWindow.addEventListener("close", function(){});
//			 						tmpWindow.addEventListener("clickclose", function(){});
                                    var infoBox = new BMapLib.InfoBox(window.map, winConhead + allChmTableDom + winConFoot, {
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
                                        //绑定监测监控按钮事件
                                        $("#entMonData").off("click").on("click", function () {
                                            openWin(BASE_URL + 'views/module/monitor/monitorIndex/entInfo.html?businessinfoid=' + tmpData.BUSINESSINFOID, '监测监控', '92%', '100%');
                                        });

                                        //企业巡查记录按钮事件
                                        $("#entPatrolRec").off("click").on("click", function () {
                                            openWin(BASE_URL + 'hiddendanger/hdigovinspection/gis/' + tmpData.BUSINESSINFOID, '巡查记录', '80%', '80%');
                                        });

                                        // 滚动条加载
                                        $('.wxyInfo tbody').niceScroll({
                                            cursorborder: "#4d86d6",
                                            cursorcolor: "#4d86d6",
                                            background: false,
                                            autohidemode: false
                                        }).show().resize();
//                                      级别筛选点击事件
                                        $('.dangerLevel').on('click','li',function(){
                                        	$('.dangerLevel li').removeClass('selected');
                                        	$(this).addClass('selected');
                                        })
                                    });

                                    //infoBox关闭时执行的操作
                                    infoBox.addEventListener("close", function (e) {
                                        //取消marker的跳动效果
                                        tmpMarker.setAnimation(null);
                                    });

                                    infoBox.open(tmpMarker);   //图片加载完毕重绘infowindow
//			 						window.map.openInfoWindow(tmpWindow, tmpPt);
                                }
                            });

                            //定义点位点击触发事件
                            tmpMarker.addEventListener("click", function () {
                                window.curEntAndMatlsDic.get(tmpData.BUSINESSINFOID).click();
                            });

                            //将点位添加至地图
                            window.map.addOverlay(tmpMarker);

                            //默认选择第一个点位居中
                            0 == index &&
                            window.map.setCenter(tmpPt);
                        }
                    });

//                    console.log(dangerData);
//                    console.log(entdata);
                    //展示重大危险源图表信息
                    allEntCnt = entcount;//所有单位数
                    allDanSrcCnt = retData.srchDanBaseList.length;//所有危险源数

                    var wxhxpDan = _.where(retData.srchDanBaseList, {"DANGERTYPE": "1"});
                    if (wxhxpDan.length > 0) {
                        wxhxpEntCnt = _.uniq(_.pluck(wxhxpDan, "BUSINESSINFOID")).length;
                    }
                    wxhxpDanCnt = wxhxpDan.length;

                    var rqlDan = _.where(retData.srchDanBaseList, {"DANGERTYPE": "2"});
                    if (rqlDan.length > 0) {
                        rqlEntCnt = _.uniq(_.pluck(rqlDan, "BUSINESSINFOID")).length;
                    }
                    rqlDanCnt = rqlDan.length;

                    var gklDan = _.where(retData.srchDanBaseList, {"DANGERTYPE": "3"});
                    if (gklDan.length > 0) {
                        gklEntCnt = _.uniq(_.pluck(gklDan, "BUSINESSINFOID")).length;
                    }
                    gklDanCnt = gklDan.length;


                    var lvlOneDan = _.where(retData.srchDanBaseList, {"DANGERLEVEL": "1"});
                    if (lvlOneDan.length > 0) {
                        lvlOneEntCnt = _.uniq(_.pluck(lvlOneDan, "BUSINESSINFOID")).length;
                    }
                    lvlOneDanCnt = lvlOneDan.length;

                    var lvlTwoDan = _.where(retData.srchDanBaseList, {"DANGERLEVEL": "2"});
                    if (lvlTwoDan.length > 0) {
                        lvlTwoEntCnt = _.uniq(_.pluck(lvlTwoDan, "BUSINESSINFOID")).length;
                    }
                    lvlTwoDanCnt = lvlTwoDan.length;

                    var lvlThreeDan = _.where(retData.srchDanBaseList, {"DANGERLEVEL": "3"});
                    if (lvlThreeDan.length > 0) {
                        lvlThreeEntCnt = _.uniq(_.pluck(lvlThreeDan, "BUSINESSINFOID")).length;
                    }
                    lvlThreeDanCnt = lvlThreeDan.length;

                    var lvlFourDan = _.where(retData.srchDanBaseList, {"DANGERLEVEL": "4"});
                    if (lvlFourDan.length > 0) {
                        lvlFourEntCnt = _.uniq(_.pluck(lvlFourDan, "BUSINESSINFOID")).length;
                    }
                    lvlFourDanCnt = lvlFourDan.length;
                    
                    var dangerPie = echarts.init(document.getElementById("dangerPie")),
                        entPie = echarts.init(document.getElementById("entPie"));
                    $("#entCount").text("企业:  " + entcount + "家");
                    var dangerOption = {
                        // title : {
                        //     text: '某站点用户访问来源',
                        //     subtext: '纯属虚构',
                        //     x:'center'
                        // },
                        tooltip: {
                            trigger: 'item',
                            formatter: "{a} <br/>{b} : {c} ({d}%)"
                        },
                        legend: {
                            orient: 'horizontal',
                            bottom: 'bottom',
                            data: lvlLengendData,
                            textStyle: {
                            	color: "#Fff"
                            }
                        },
                        series: [
                            {
                                name: '等级',
                                type: 'pie',
                                radius: '43%',
                                center: ['50%', '37%'],
                                data: dangerData,
                                itemStyle: {
                                    emphasis: {
                                        shadowBlur: 10,
                                        shadowOffsetX: 0,
                                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                                    }
                                }
                            }
                        ],
                        color: ['#FF0000','#FFEC00','#FF7930','#00C5FF']
                    };
                    var entOption = {
                        // title : {
                        //     text: '某站点用户访问来源',
                        //     subtext: '纯属虚构',
                        //     x:'center'
                        // },
                        tooltip: {
                            trigger: 'item',
                            formatter: "{a} <br/>{b} : {c} ({d}%)"
                        },
                        legend: {
                            orient: 'horizontal',
                            bottom: 'bottom',
                            data: typeLegendData,
                            textStyle: {
                            	color: "#Fff"
                            }
                        },
                        series: [
                            {
                                name: '等级',
                                type: 'pie',
                                radius: '43%',
                                center: ['50%', '37%'],
                                data: entdata,
                                itemStyle: {
                                    emphasis: {
                                        shadowBlur: 10,
                                        shadowOffsetX: 0,
                                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                                    }
                                }
                            }
                        ],
                        color: ['#FF0000','#FF7930','#00C5FF']
                    };
                    dangerPie.setOption(dangerOption);
                    entPie.setOption(entOption);

                    //为危险源列表每一行绑定GIS弹窗事件
                    $tbody.find("tr").off("click").on("click", function () {
                        window.curEntAndMatlsDic.get($(this).find(".entName").attr("data-entId")).click();
                    });
                }
                
                //为重大危险源表格统计赋值
                $("#allEntCnt").text(allEntCnt + "家");
                $("#allDanSrcCnt").text(allDanSrcCnt + "个");
                $("#wxhxpEntCnt").text(wxhxpEntCnt + "家");
                $("#wxhxpDanCnt").text(wxhxpDanCnt + "个");
                $("#rqlEntCnt").text(rqlEntCnt + "家");
                $("#rqlDanCnt").text(rqlDanCnt + "个");
                $("#gklEntCnt").text(gklEntCnt + "家");
                $("#gklDanCnt").text(gklDanCnt + "个");
                $("#lvlOneEntCnt").text(lvlOneEntCnt + "家");
                $("#lvlOneDanCnt").text(lvlOneDanCnt + "个");
                $("#lvlTwoEntCnt").text(lvlTwoEntCnt + "家");
                $("#lvlTwoDanCnt").text(lvlTwoDanCnt + "个");
                $("#lvlThreeEntCnt").text(lvlThreeEntCnt + "家");
                $("#lvlThreeDanCnt").text(lvlThreeDanCnt + "个");
                $("#lvlFourEntCnt").text(lvlFourEntCnt + "家");
                $("#lvlFourDanCnt").text(lvlFourDanCnt + "个");
            }
        },
        error: function (err) {
            toast("系统繁忙!");
        }
    });
}

/**
 * 初始化加载企业监管点位及其列表数据
 */
function initQyjgMapPts() {
    $("#qyjgCntDiv").show();
    
    //默认清除地图上历史覆盖物
    window.map.clearOverlays();
    clearHistorys();
    
    //隐藏重大危险源、应急资源饼状图
    $("#hidCountDiv, #zdwxyCntDiv, #dangerCountDiv," +
      " #emsResCntDiv,#hidStateCountDiv, #yjzyCntDiv, #hidLevelCountDiv, #yqssCntDiv, #publicsCntDiv").hide();

    //隐藏应急资源饼状图
    $("#entCount").text("企业：0家");
    $("#entPie").empty();
    $("#entCountDiv").show();

    var $qyjg = $("#qyjg");

    //最新重大危险源类型参数
    var entTypeParaArr = [];
    var entTypeLegendData = [];
    if (0 < $qyjg.find(".activegyjhxpl").length) {
        entTypeParaArr.push("1");//工业及化学品类
        entTypeLegendData.push("工业及危化品类");
    }
    if (0 < $qyjg.find(".activesmjfwl").length) {
        entTypeParaArr.push("2");//商贸及服务类
        entTypeLegendData.push("商贸及服务类");
    }
    if (0 < $qyjg.find(".activejtysl").length) {
        entTypeParaArr.push("3");//交通运输类
        entTypeLegendData.push("交通运输类");
    }
    if (0 < $qyjg.find(".activegcjsl").length) {
        entTypeParaArr.push("4");//工程建设类
        entTypeLegendData.push("工程建设类");
    }

    //查询所有监管企业列表信息并在地图上加载相应点位
    $.ajax({
        type: "post",
        url: BASE_URL + "olgis/gisOperBuss/loadSupEntInfo",
        data: {
            "entType": entTypeParaArr.join(","),
            "entname": $qyjg.find(".searchBox").val()
        },
        success: function (backData) {
            if (backData) {
            	addCenterCityPoly(window.map);
//            	console.log("待分类");
            	var retData = backData.entList;
//            	console.log(retData);

                //清空原有所有危险源列表数据
                var $tbody = $qyjg.find("tbody");
                $tbody.empty();
//				console.log(retData);
                
                //查询企业监管表格统计
                var qyjgTotalCnt = 0,
                	qyjgYflTotalCnt = 0,
                	qyjgGyjwxhxplCnt = 0,
                	qyjgSmjfwlCnt = 0,
                	qyjgJtyslCnt = 0,
                	qyjgGcjslCnt = 0;
//                	qyjgDflCnt = 0;
                
                //遍历生成表格数据并加载GIS危险源点位
                if (0 < retData.length) {

                    //获取企业监管企业分类饼状图数据
                    var entData = [], entCnt = 0;
                    if (0 < $qyjg.find(".activegyjhxpl").length) {
                        entData.push({value: _.where(retData, {"ENTTYPE": "工业及危化品类"}).length, name: "工业及危化品类"});
                    }
                    if (0 < $qyjg.find(".activesmjfwl").length) {
                        entData.push({value: _.where(retData, {"ENTTYPE": "商贸及服务类"}).length, name: "商贸及服务类"});
                    }
                    if (0 < $qyjg.find(".activejtysl").length) {
                        entData.push({value: _.where(retData, {"ENTTYPE": "交通运输类"}).length, name: "交通运输类"});
                    }
                    if (0 < $qyjg.find(".activegcjsl").length) {
                        entData.push({value: _.where(retData, {"ENTTYPE": "工程建设类"}).length, name: "工程建设类"});
                    }
                    
                    qyjgTotalCnt = retData.length,
                	qyjgYflTotalCnt = _.filter(retData, function(tmpEnt){ return tmpEnt.ENTTYPE != "其它类"; }).length,
                	qyjgGyjwxhxplCnt = _.where(retData, {"ENTTYPE": "工业及危化品类"}).length,
                	qyjgSmjfwlCnt = _.where(retData, {"ENTTYPE": "商贸及服务类"}).length,
                	qyjgJtyslCnt = _.where(retData, {"ENTTYPE": "交通运输类"}).length,
                	qyjgGcjslCnt = _.where(retData, {"ENTTYPE": "工程建设类"}).length,
//                	qyjgDflCnt = _.filter(retData, function(tmpEnt){return tmpEnt.ENTTYPE == "其它类";}).length;
                    
                    _.map(retData, function (tmpData, index) {
                        ++entCnt;
                        $tbody.append("<tr>" +
                            "<td class='entName' data-entId='" + tmpData.BUSINESSINFOID + "'>" + tmpData.ENTNAME + "</td>" +
                            "<td>" + tmpData.ENTTYPE + "</td>" +
                            "</tr>");

                        //遍历添加GIS点位
//		 				if(!window.curEntAndMatlsDic.containsKey(tmpData.BUSINESSINFOID)){
                        //定义GIS各点位
                        var tmpPt = new BMap.Point(tmpData.LONGITUDE, tmpData.LATITUDE);

                        //分类各点位图标
                        var tmpMarkIcon = null;
                        if ("工业及危化品类" == tmpData.ENTTYPE) {
                            tmpMarkIcon = new BMap.Icon(BASE_URL + "images/portal/icon_gisWhp.png", new BMap.Size(42, 56));
                        } else if ("商贸及服务类" == tmpData.ENTTYPE) {
                            tmpMarkIcon = new BMap.Icon(BASE_URL + "images/portal/icon_gisShangmao.png", new BMap.Size(42, 56));
                        } else if ("交通运输类" == tmpData.ENTTYPE) {
                            tmpMarkIcon = new BMap.Icon(BASE_URL + "images/portal/icon_gisJiaotong.png", new BMap.Size(42, 56));
                        } else if ("工程建设类" == tmpData.ENTTYPE) {
                            tmpMarkIcon = new BMap.Icon(BASE_URL + "images/portal/icon_gisGongcheng.png", new BMap.Size(42, 56));
                        } else {
                            tmpMarkIcon = new BMap.Icon(BASE_URL + "images/portal/icon_gisGongcheng.png", new BMap.Size(42, 56));
                        }

                        var tmpMarker = new BMap.Marker(tmpPt, {
                            "title": tmpData.ENTNAME,
                            "icon": tmpMarkIcon
                        });

                        //允许清除覆盖物
                        tmpMarker.enableMassClear();

                        //定义点位弹窗内容
                        var winCon = "<div class='bb qypopup'>" +
                            "   <div class='popupTitle'>" + tmpData.ENTNAME +
                            "       <span id='jgfj'>监管分级：" +
                            "           <span>" + tmpData.ENTGRADE + "</span>" +
                            "       </span>" +
                            "   </div>" +
                            "   <div class='companyInfo'>" +
                            "       <i class='fa fa-user'>&nbsp;</i>" + tmpData.LEGALPERSON +
                            "       <i class='fa fa-phone'></i>" + tmpData.PHONE +
                            "       <br />" +
                            "       <i class='fa fa-map-marker'>&nbsp;</i>" + tmpData.ADDRESS +
                            "       <br />" +
                            "       <table class='qyinfo'>" +
                            "          <tr>" +
                            "               <td>经营范围</td>" +
                            "               <td class='dot' colspan='5' title='"+tmpData.MAINPRODUCT+"'>" + tmpData.MAINPRODUCT + "</td>" +
                            "           </tr>" +
                            "           <tr>" +
                            "               <td>行业分类</td>" +
                            "               <td colspan='5'>" + tmpData.DIRECTORTYPENAME + "</td>" +
                            "           </tr>" +
                            "           <tr>" +
                            "               <td>员工人数</td>" +
                            "               <td>" + tmpData.EMPQTY + "人</td>" +
                            "               <td>安全管理人员</td>" +
                            "               <td>" + tmpData.MANAGENUMBER + "人</td>" +
                            "               <td>持证人员</td>" +
                            "               <td>" + tmpData.HOLDERNUMBER + "人</td>" +
                            "           </tr>" +
                            "           <tr>" +
                            "               <td>经营场所</td>" +
                            "               <td>" + tmpData.PLACEAREA + "㎡</td>" +
                            "               <td>固定资产</td>" +
                            "               <td>" + tmpData.FIXEDMONEY + "万元</td>" +
                            "               <td>年营业收入</td>" +
                            "               <td>" + tmpData.YEARINCOME + "万元</td>" +
                            "           </tr>" +
                            "       </table>" +
                            "       <div class='ssqy'>" +
                            "           <span>所属区域：" + tmpData.AREANAME + "</span>" +
                            "           <span>主管部门：" + tmpData.INDUSTRYORGNAME + "</span>" +
                            "       </div>" +
                            "   </div>" +
                            "   <div class='triangle'></div>" +
                            "</div>";

                        //将点位存储至map集合工具类中
                        window.curEntAndMatlsDic.put(tmpData.BUSINESSINFOID, {
                            "data": tmpData,
                            "marker": tmpMarker,
                            "click": function () {
                            	
                            	//判断点位是否在当前视野内
                                var bound=window.map.getBounds();//地图可视区域
                                if(bound.containsPoint(tmpPt)==false){
                                	window.map.panTo(tmpPt);
                                }
                            	
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
                                    // 三行文本溢出隐藏
                                    $('.dot').dotdotdot();
                                });

                                //infoBox关闭时执行的操作
                                infoBox.addEventListener("close", function (e) {
                                    //取消marker的跳动效果
                                    tmpMarker.setAnimation(null);
                                });
                                infoBox.open(tmpMarker);   //图片加载完毕重绘infowindow
                            }
                        });

                        //定义点位点击触发事件
                        tmpMarker.addEventListener("click", function () {
                            window.curEntAndMatlsDic.get(tmpData.BUSINESSINFOID).click();
                        });

                        //将点位添加至地图
                        window.map.addOverlay(tmpMarker);

                        //默认选择第一个点位居中
                        0 == index &&
                        window.map.setCenter(tmpPt);
//		 				}
                    });

                    $("#entCount").text("企业：" + entCnt + "家");
                    var entOption = {
                        // title : {
                        //     text: '某站点用户访问来源',
                        //     subtext: '纯属虚构',
                        //     x:'center'
                        // },
                        tooltip: {
                            trigger: 'item',
                            formatter: "{a} <br/>{b} : {c} ({d}%)"
                        },
                        legend: {
                            orient: 'horizontal',
                            bottom: 'bottom',
                            data: entTypeLegendData,
                            textStyle: {
                            	color: "#Fff"
                            }
                        },
                        series: [
                            {
                                name: '等级',
                                type: 'pie',
                                radius: '43%',
                                center: ['50%', '37%'],
                                data: entData,
                                itemStyle: {
                                    emphasis: {
                                        shadowBlur: 10,
                                        shadowOffsetX: 0,
                                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                                    }
                                }
                            }
                        ],
                        color: ['#E200FF','#72D628','#00BFFF','#F5A623']
                    };
//                    $("#entCountDiv").show();
//                    $("#dangerCountDiv").hide();
                    var entPie = echarts.init(document.getElementById("entPie"));
                    entPie.setOption(entOption);
                    //为企业监管列表每一行绑定GIS弹窗事件
                    $tbody.find("tr").off("click").on("click", function () {
                        window.curEntAndMatlsDic.get($(this).find(".entName").attr("data-entId")).click();
                    });
                }
                
                //填充统计表格
                $("#qyjgTotalCnt").text((qyjgYflTotalCnt + backData.noClassEntCnt) + "家");
                $("#qyjgYflTotalCnt").text(qyjgYflTotalCnt + "家");
                $("#qyjgGyjwxhxplCnt").text(qyjgGyjwxhxplCnt + "家");
                $("#qyjgSmjfwlCnt").text(qyjgSmjfwlCnt + "家");
                $("#qyjgJtyslCnt").text(qyjgJtyslCnt + "家");
                $("#qyjgGcjslCnt").text(qyjgGcjslCnt + "家");
                $("#qyjgDflCnt").text(backData.noClassEntCnt + "家");
            }
        },
        error: function (err) {
            toast("系统繁忙!");
        }
    });
}

function getQuarter(month) {
    if (month == 1 || month == 2 || month == 3) {
        return 1;
    }
    if (month == 4 || month == 5 || month == 6) {
        return 2;
    }
    if (month == 7 || month == 8 || month == 9) {
        return 3;
    }
    if (month == 10 || month == 11 || month == 12) {
        return 4;
    }
}


/**
 * 初始化加载隐患分布点位及其列表数据
 */
function initYhfbMapPts(year, quarter) {
    $(".infoRight").show();
    
    //隐藏重大危险源、应急资源饼状图
    $("#zdwxyCntDiv, #qyjgCntDiv," +
      " #yjzyCntDiv, #entCountDiv, #dangerCountDiv, #emsResCntDiv, #yqssCntDiv, #publicsCntDiv").hide();
    $("#hidCountDiv, #hidLevelCountDiv, #hidStateCountDiv").show();
//    $("#zdwxyCntDiv, #entCountDiv,#dangerCountDiv," +
//      " #emsResCntDiv, #qyjgCntDiv, #yjzyCntDiv").hide();
//    $("#hidLevelCountPie").empty();
//    $("#hidStateCountPie").empty();
//    $("#hidLevelCountDiv").show();
//    $("#hidCountDiv").show();
//    $("#hidStateCountPie").show();
//    $("#hidStateCountDiv").show();
    
    //默认清除地图上历史覆盖物
    window.map.clearOverlays();
    clearHistorys();

    var $yhfb = $("#yhfb");

    //----待续
    $.ajax({
        type: "post",
        url: BASE_URL + "hidden/hidhiddendanger/loadGisHidData",
        data: {
            year: year,
            quarter: quarter,
            entname: $yhfb.find(".searchBoxHid").val()
        },
        success: function (retData) {
        	if (retData) {
        		addCenterCityPoly(window.map);

                //清空原有所有危险源列表数据
                var $tbody = $yhfb.find("tbody");
                $tbody.empty();

                //遍历生成表格数据并加载GIS危险源点位
                if (0 < retData.hidDataList.length) {
                    _.map(retData.hidDataList, function (tmpData, index) {
                        $tbody.append("<tr>" +
                            "<td class='resName' data-entId='" + tmpData.ENTID + "'>" + tmpData.ENTNAME + "</td>" +
                            "<td>" + tmpData.COUNTNUM + "</td>" +
                            "</tr>");

                        var tmpPt = new BMap.Point(tmpData.LONGITUDE, tmpData.LATITUDE);
                        var tmpMarkIcon = new BMap.Icon(BASE_URL + "images/portal/icon_gisYhfb.png", new BMap.Size(42, 56));

                        var tmpMarker = new BMap.Marker(tmpPt, {
                            "title": tmpData.ENTNAME,
                            "icon": tmpMarkIcon
                        });
                        //允许清除覆盖物
                        tmpMarker.enableMassClear();

                        var winCon = tmpData.ENTNAME;

                        //将点位存储至map集合工具类中
                        window.curEntAndMatlsDic.put(tmpData.ENTID, {
                            "data": tmpData,
                            "marker": tmpMarker,
                            "click": function () {
                            	
                            	//判断点位是否在当前视野内
                                var bound=window.map.getBounds();//地图可视区域
                                if(bound.containsPoint(tmpPt)==false){
                                	window.map.panTo(tmpPt);
                                }
                            	
                                //获取企业的巡查列表
                                $.ajax({
                                    type: "post",
                                    url: BASE_URL + "hidden/hidhiddendanger/loadGisHidDataList",
                                    data: {
                                        year: year,
                                        quarter: quarter,
                                        entid: tmpData.ENTID
                                    },
                                    success: function (retData) {
//                                        console.log(retData);
                                        var businessinfo = retData.entBusinessinfo;
                                        var hidLevelCount = retData.hidLevelCount;
                                        var hidStatusCount = retData.hidStatusCount;
                                        //一般隐患数量
                                        var oneLevelCount = _.where(hidLevelCount, {"HIDDENDANGERLEVEL": "1"});
                                        var oneLevelCountNum = oneLevelCount.length == 0 ? "0" : oneLevelCount[0].COUNTNUM;
                                        //重大隐患数量
                                        var twoLevelCount = _.where(hidLevelCount, {"HIDDENDANGERLEVEL": "2"});
                                        var twoLevelCountNum = twoLevelCount.length == 0 ? "0" : twoLevelCount[0].COUNTNUM;

                                        var dzgCount = _.where(hidStatusCount, {"HIDDENDANGERSTATE": "3"});
                                        console.log(dzgCount);
                                        var dzgCountNum = dzgCount.length == 0 ? "0" : dzgCount[0].COUNTNUM;
                                        var dfcCount = _.where(hidStatusCount, {"HIDDENDANGERSTATE": "4"});
                                        var dfcCountNum = dfcCount.length == 0 ? "0" : dfcCount[0].COUNTNUM;
                                        var dhxCount = _.where(hidStatusCount, {"HIDDENDANGERSTATE": "5"});
                                        var dhxCountNum = dhxCount.length == 0 ? "0" : dhxCount[0].COUNTNUM;
                                        var yhxCount = _.where(hidStatusCount, {"HIDDENDANGERSTATE": "6"});
                                        var yhxCountNum = yhxCount.length == 0 ? "0" : yhxCount[0].COUNTNUM;


                                        var winConhead = "<div class='bb wxypopup'>" +
                                            "	<div class='popupTitle'>" + tmpData.ENTNAME +
                                            "	<span id='zdwxyCount'>隐患列表 （" + tmpData.COUNTNUM + "个）</span>" +
                                            "  </div>" +
                                            "	<div class='companyInfo'>" +
                                            "		<i class='fa fa-user'>&nbsp;</i>" + businessinfo.legalperson + "  <i class='fa fa-phone'></i>" + businessinfo.phone +
                                            "		<br /> <i class='fa fa-map-marker'>&nbsp;</i>" + businessinfo.address +
                                            // "<div><a id='oneYh' data-select='1' href='javascript:void(0)'>一般隐患(" + oneLevelCountNum + ")</a> <a data-select='1' id='twoYh' href='javascript:void(0)'>重大隐患(" + twoLevelCountNum + ")</a></div>" +
                                            "<div class='hidSelectDiv'><a id='dzgYh' data-hiddangerstate='3' class='hidSelected' data-select='1' href='javascript:void(0)'>待整改(" + dzgCountNum + ")</a>" +
                                            " <a id='dfcYh' data-hiddangerstate='4' class='hidSelected' data-select='1' href='javascript:void(0)'>待复查(" + dfcCountNum + ")</a>" +
                                            " <a id='dhxYh' data-hiddangerstate='5' class='hidSelected' data-select='1' href='javascript:void(0)'>待核销(" + dhxCountNum + ")</a>" +
                                            " <a id='yhxYh' data-hiddangerstate='6' class='hidSelected' data-select='1' href='javascript:void(0)'>已核销(" + yhxCountNum + ")</a></div>" +
                                            "		<div class='wxyList'>" +
                                            "			<table class='yhfbInfo'>" +
                                            "				<thead>" +
                                            "					<th>隐患名称</th>" +
                                            "					<th>隐患编号</th>" +
                                            "					<th>隐患内容</th>" +
                                            "					<th>发现时间</th>" +
                                            "					<th>隐患级别</th>" +
                                            "					<th>排查方式</th>" +
                                            "					<th>隐患状态</th>" +
                                            "					<th>操作</th>" +
                                            "				</thead>" +
                                            "				<tbody>";
                                        var winConContent = "";
                                        _.map(retData.hidDataList, function (hidData, index) {

                                            var action = "";
                                            switch (hidData.HIDDENDANGERSTATE) {
                                                case "4":
                                                    action = "复查";
                                                    break;
                                                case "5":
                                                    action = "核销";
                                                    break;
                                                default:
                                                    action = "查看";
                                                    break;
                                            }

                                            winConContent +=
                                                "<tr data-hiddangerstate='" + hidData.HIDDENDANGERSTATE + "' data-dangerlevel='" + hidData.HIDDENDANGERLEVEL + "'><td>" + (hidData.HIDDENDANGERNAME || "--") + "</td>" +
                                                "<td>" + (hidData.HIDDENDANGERNUM || "--") + "</td>" +
                                                "<td>" + (hidData.HIDDENDANGERCONTENT || "--") + "</td>" +
                                                "<td>" + (getFormatDateByLong(hidData.FINDTIME) || "--") + "</td>" +
                                                "<td>" + (SelectOption.getDangerlevel(hidData.HIDDENDANGERLEVEL) || "--") + "</td>" +
                                                "<td>" + (SelectOption.getIsGov(hidData.ISGOV) || "--") + "</td>" +
                                                "<td>" + (SelectOption.getHiddangerstate(hidData.HIDDENDANGERSTATE) || "--") + "</td>" +
                                                "<td data-hiddendangerid='" + hidData.HIDDENDANGERID + "' data-isgov='" + hidData.ISGOV + "' data-hiddangerstate='" + hidData.HIDDENDANGERSTATE + "' data-dangerlevel='" + hidData.HIDDENDANGERLEVEL + "' class='action'><a href='javascript:void(0)'>" + action + "</a></td>" +
                                                "</tr>"
                                        });
                                        var winConFoot =
                                            "				</tbody>" +
                                            "			</table>" +
                                            "		</div>" +
                                            "		<div class='ssqy'>" +
                                            "			<span>所属区域：" + (businessinfo.areaname || "--") + "</span> <span>主管部门：" + businessinfo.allorgname + "</span>" +
                                            "		</div>" +
                                            "		<div class='triangle'></div>" +
                                            "	</div>" +
                                            "</div>";
                                        var infoBox = new BMapLib.InfoBox(window.map, winConhead + winConContent + winConFoot, {
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
                                            // 三行文本溢出隐藏
                                            $('.dot').dotdotdot();

                                            $('.yhfbInfo tbody').niceScroll({
                                                cursorborder: "#4d86d6",
                                                cursorcolor: "#4d86d6",
                                                background: false,
                                                autohidemode: false
                                            }).show().resize();

                                            //操作功能
                                            $('.yhfbInfo tbody').find(".action").off("click").on('click', function () {
                                                var hiddangerstate = $(this).attr("data-hiddangerstate");

                                                var hiddendangerid = $(this).attr("data-hiddendangerid");

                                                switch (hiddangerstate) {
                                                    case "4":
                                                        parent.openWin(BASE_URL + "views/module/hidden/hiddendanger/hiddendangerAllHandle.html?hiddendangerid=" + hiddendangerid + "&hiddendangerstate=" + hiddangerstate + "&isFormGis=true&entid=" + tmpData.ENTID,
                                                            "隐患复查", "65%", "85%");
                                                        break;
                                                    case "5":
                                                        parent.openWin(BASE_URL + "views/module/hidden/hiddendanger/hiddendangerAllHandle.html?hiddendangerid=" + hiddendangerid + "&hiddendangerstate=" + hiddangerstate + "&isFormGis=true&entid=" + tmpData.ENTID,
                                                            "隐患核销", "65%", "85%");
                                                        break;
                                                    default:
                                                        displayHidInfo(hiddendangerid);
                                                        break;
                                                }
                                            });

                                            $("#dzgYh").off("click").on("click", function () {
                                                showSelectHidInfo($(this));
                                            });
                                            $("#dfcYh").off("click").on("click", function () {
                                                showSelectHidInfo($(this));
                                            });
                                            $("#dhxYh").off("click").on("click", function () {
                                                showSelectHidInfo($(this));
                                            });
                                            $("#yhxYh").off("click").on("click", function () {
                                                showSelectHidInfo($(this));
                                            });


                                        });

                                        //infoBox关闭时执行的操作
                                        infoBox.addEventListener("close", function (e) {
                                            //取消marker的跳动效果
                                            tmpMarker.setAnimation(null);
                                        });
                                        infoBox.open(tmpMarker);   //图片加载完毕重绘infowindow
                                    },
                                    error: function (err) {
                                        toast("系统繁忙!");
                                    }
                                });
                            }
                        });

                        //定义点位点击触发事件
                        tmpMarker.addEventListener("click", function () {
                            console.log(tmpData.ENTID);
                            window.curEntAndMatlsDic.get(tmpData.ENTID).click();
                        });

                        //将点位添加至地图
                        window.map.addOverlay(tmpMarker);

                        //默认选择第一个点位居中
                        0 == index &&
                        window.map.setCenter(tmpPt);
                    });
                    //为危险源列表每一行绑定GIS弹窗事件
                    $tbody.find("tr").off("click").on("click", function () {
                        window.curEntAndMatlsDic.get($(this).find(".resName").attr("data-entId")).click();
                    });
                }

                //生成饼图
                //生成隐患级别饼图
                var hidLevelCount = retData.hidLevelCount;
                var hidStatusCount = retData.hidStatusCount;
                var levelData= [];
                var oneData = _.where(hidLevelCount, {"HIDDENDANGERLEVEL": "1"});
                var twoData = _.where(hidLevelCount, {"HIDDENDANGERLEVEL": "2"});
                levelData.push({
                    value: oneData.length==0?0:oneData[0].COUNTNUM,
                    name: "一般隐患"
                });
                levelData.push({
                    value: twoData.length==0?0:twoData[0].COUNTNUM,
                    name: "重大隐患"
                });
                var total = (oneData.length==0?0:oneData[0].COUNTNUM) +(twoData.length==0?0:twoData[0].COUNTNUM);
                $("#hidLevelCount").text("数量："+total+"个");
                $("#hidStateCount").text("数量："+total+"个");
                var stateData= [];
                var dzgData = _.where(hidStatusCount, {"HIDDENDANGERSTATE": "3"});
                var dfcData = _.where(hidStatusCount, {"HIDDENDANGERSTATE": "4"});
                var dhxData = _.where(hidStatusCount, {"HIDDENDANGERSTATE": "5"});
                var yhxData = _.where(hidStatusCount, {"HIDDENDANGERSTATE": "6"});
                stateData.push({
                    value: dzgData.length==0?0:dzgData[0].COUNTNUM,
                    name: "待整改"
                });
                stateData.push({
                    value: dfcData.length==0?0:dfcData[0].COUNTNUM,
                    name: "待复查"
                });
                stateData.push({
                    value: dhxData.length==0?0:dhxData[0].COUNTNUM,
                    name: "待核销"
                });
                stateData.push({
                    value: yhxData.length==0?0:yhxData[0].COUNTNUM,
                    name: "已核销"
                });
                //生成隐患状态饼图
                var levelOption = {
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    legend: {
                        orient: 'horizontal',
                        bottom: 'bottom',
                        data: ["重大隐患","一般隐患"],
                        textStyle: {
                        	color: "#Fff"
                        }
                    },
                    series: [
                        {
                            name: '等级',
                            type: 'pie',
                            radius: '43%',
                            center: ['50%', '37%'],
                            data: levelData,
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                    ],
                    color: ['#FF0000','#FF7930']
                };
                var stateOption = {
                    // title : {
                    //     text: '某站点用户访问来源',
                    //     subtext: '纯属虚构',
                    //     x:'center'
                    // },
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    legend: {
                        orient: 'horizontal',
                        bottom: 'bottom',
                        data: ["待整改","待复查","待核销","已核销"],
                        textStyle: {
                        	color: "#Fff"
                        }
                    },
                    series: [
                        {
                            name: '等级',
                            type: 'pie',
                            radius: '43%',
                            center: ['50%', '37%'],
                            data: stateData,
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                    ],
                    color: ['#FF0000','#FF7930','#FFEC00','#72D628']
                };
                var levelPie = echarts.init(document.getElementById("hidLevelCountPie"));
                var statePie = echarts.init(document.getElementById("hidStateCountPie"));
                levelPie.setOption(levelOption);
                statePie.setOption(stateOption);

                //初始化表格数据
                var hidStatusLevelCount = retData.hidStatusLevelCount;
                var oneLevelDatas = _.where(hidStatusLevelCount, {"HIDDENDANGERLEVEL": "1"});
                var onedzgDatas = _.where(oneLevelDatas, {"HIDDENDANGERSTATE": "3"});
                $("#onedzgCount").text(onedzgDatas.length == 0 ?0:onedzgDatas[0].COUNTNUM);
                var onedfcDatas = _.where(oneLevelDatas, {"HIDDENDANGERSTATE": "4"});
                $("#onedfcCount").text(onedfcDatas.length == 0 ?0:onedfcDatas[0].COUNTNUM);
                var onedhxDatas = _.where(oneLevelDatas, {"HIDDENDANGERSTATE": "5"});
                $("#onedhxCount").text(onedhxDatas.length == 0 ?0:onedhxDatas[0].COUNTNUM);
                var oneyhxDatas = _.where(oneLevelDatas, {"HIDDENDANGERSTATE": "6"});
                $("#oneyhxCount").text(oneyhxDatas.length == 0 ?0:oneyhxDatas[0].COUNTNUM);
                var twoLevelDatas = _.where(hidStatusLevelCount, {"HIDDENDANGERLEVEL": "2"});
                var twodzgDatas = _.where(twoLevelDatas, {"HIDDENDANGERSTATE": "3"});
                $("#twodzgCount").text(twodzgDatas.length == 0 ?0:twodzgDatas[0].COUNTNUM);
                var twodfcDatas = _.where(twoLevelDatas, {"HIDDENDANGERSTATE": "4"});
                $("#twodfcCount").text(twodfcDatas.length == 0 ?0:twodfcDatas[0].COUNTNUM);
                var twodhxDatas = _.where(twoLevelDatas, {"HIDDENDANGERSTATE": "5"});
                $("#twodhxCount").text(twodhxDatas.length == 0 ?0:twodhxDatas[0].COUNTNUM);
                var twoyhxDatas = _.where(twoLevelDatas, {"HIDDENDANGERSTATE": "6"});
                $("#twoyhxCount").text(twoyhxDatas.length == 0 ?0:twoyhxDatas[0].COUNTNUM);
        	}
        },
        error: function (err) {
            toast("系统繁忙!");
        }
    });
}

/**
 * 重新加载隐患列表页
 */
function updateHidInfo(entid) {
    window.curEntAndMatlsDic.get(entid).click();
}

function showSelectHidInfo($select) {
    var hiddangerstate = $select.attr("data-hiddangerstate");
    var select = $select.attr("data-select");
    if (select == 1) {
        $select.attr("data-select", 0);
        $select.attr("class", "hidUnSelected");
        $('.yhfbInfo tbody tr[data-hiddangerstate=' + hiddangerstate + ']').hide();
    } else {
        $select.attr("data-select", 1);
        $select.attr("class", "hidSelected");
        $('.yhfbInfo tbody tr[data-hiddangerstate=' + hiddangerstate + ']').show();
    }
    $('.yhfbInfo tbody').niceScroll({
        cursorborder: "#4d86d6",
        cursorcolor: "#4d86d6",
        background: false,
        autohidemode: false
    }).show().resize();
}

/**
 * 查看隐患信息
 */
function displayHidInfo(hiddendangerid) {
    parent.openWin(BASE_URL + "views/module/hidden/hiddendanger/hiddendangerDisplay.html?hiddendangerid=" + hiddendangerid,
        "隐患信息详情", "65%", "60%");
}

/**
 * 初始化加载隐执法分布点位及其列表数据
 */
function initZffbMapPts() {
    //----待续
    var $zffb = $("#zffb");
    
    //默认清除地图上历史覆盖物
    window.map.clearOverlays();
    clearHistorys();

    $.ajax({
        type: "post",
        url: BASE_URL + "law/lawcount/loadGisCheckInfo",
        data: {
            "entname": $zffb.find(".searchBox").val()
        },
        success: function (retData) {
            var $tbody = $zffb.find("tbody");
            $tbody.empty();
            if (retData) {
            	addCenterCityPoly(window.map);
            	
                if (0 < retData.data.length) {
                    _.map(retData.data, function (tmpData, index) {
                        $tbody.append("<tr>" +
                            "<td>" + tmpData.ENTNAME + "</td>" +
                            "<td class='resName' data-resId='" + tmpData.BUSINESSINFOID + "'>" + tmpData.DISTRICTNAME + "</td>" +
                            "<td>" + tmpData.COUNTNAME + "</td>" +
                            "</tr>");
                        // if (!window.curEntAndMatlsDic.containsKey(tmpData.BUSINESSINFOID)) {
                        //获取该企业所有的风险总数

                        // var curEntDssCnts = _.where(retData.data, {"BUSINESSINFOID": tmpData.BUSINESSINFOID}).length;
                        var curEntDssCnts = tmpData.COUNTNAME;

                        var tmpPt = new BMap.Point(tmpData.LONGITUDE, tmpData.LATITUDE);

                        var tmpMarker = new BMap.Marker(tmpPt, {
                            "title": tmpData.ENTNAME,
                            "icon": new BMap.Icon(BASE_URL + "images/portal/icon_gisEnt.png", new BMap.Size(42, 56))
                        });

                        var defLabelStyle = {
                            color: "#fff",
                            borderStyle: "none",
                            backgroundColor: "transparent",
                            width: 60,
                            textAlign: "center",
                            fontSize: "13px",
                            left: "8px",
                            top: "9px",
                            fontStyle: "bold"
                        };

                        var labelOffSize = curEntDssCnts / 100 >= 1 ? new BMap.Size(9, 10)
                            : curEntDssCnts / 10 >= 1 ? new BMap.Size(13, 10)
                                : new BMap.Size(15, 10);

                        var defLabel = new BMap.Label(curEntDssCnts, {offset: labelOffSize});
                        defLabel.setStyle(defLabelStyle);
                        defLabel.show();
                        tmpMarker.setLabel(defLabel);

                        //允许清除覆盖物
                        tmpMarker.enableMassClear();

                        var winCon = "当前风险企业名称： " + tmpData.ENTNAME;

                        //将点位存储至map集合工具类中
                        window.curEntAndMatlsDic.put(tmpData.BUSINESSINFOID, {
                            "data": tmpData,
                            "marker": tmpMarker,
                            "click": function () {
                            	
                            	//判断点位是否在当前视野内
                                var bound=window.map.getBounds();//地图可视区域
                                if(bound.containsPoint(tmpPt)==false){
                                	window.map.panTo(tmpPt);
                                }
                            	
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
                                    //获取企业的风险信息
                                    var businessinfoid = tmpData.BUSINESSINFOID;
                                    var resTypes = resTypeParaArr;

                                    // $.ajax({
                                    //     type: "post",
                                    //     url: BASE_URL + "dangersource/dssrsk/loadDssdskInfo?businessinfoid="+businessinfoid +"&resTypes="+resTypes,
                                    //     data: {
                                    //         businessinfoid:businessinfoid,
                                    //         resTypes:resTypes
                                    //     },
                                    //     success: function (retData) {
                                    //
                                    //     },
                                    //     error: function (err) {
                                    //         infoBox.setContent("<div class='bb wxypopup'>"+tmpData.ENTNAME+"</div>");
                                    //     }
                                    // });

                                });

                                //infoBox关闭时执行的操作
                                infoBox.addEventListener("close", function (e) {
                                    //取消marker的跳动效果
                                    tmpMarker.setAnimation(null);
                                });
                                infoBox.open(tmpMarker);   //图片加载完毕重绘infowindow
                            }
                        });

                        //定义点位点击触发事件
                        tmpMarker.addEventListener("click", function () {
                            window.curEntAndMatlsDic.get(tmpData.BUSINESSINFOID).click();
                        });

                        //将点位添加至地图
                        window.map.addOverlay(tmpMarker);
                        // }


                    });
                    //为企业监管列表每一行绑定GIS弹窗事件
                    $tbody.find("tr").off("click").on("click", function () {
                        window.curEntAndMatlsDic.get($(this).find(".resName").attr("data-resId")).click();
                    });
                }
            }
        },
        error: function (err) {
            toast("系统繁忙!");
        }
    });

}


/**
 * 初始化加载安全巡查列表及GIS点位
 */
function initAqxcMapPts() {

    //默认清除地图上历史覆盖物
    window.map.clearOverlays();
    addCenterCityPoly(window.map);
    
    //----待续
}

/**
 * 初始化加重大危险源监测点位列表及GIS点位
 */
function initJcdwMapPts() {
    //隐藏重大危险源、应急资源等饼状图
    $(".infoRight").hide();

    //默认清除地图上历史覆盖物
    window.map.clearOverlays();

    //组合二级搜索条件
    var $jcdw = $("#jcdw");
//    	resTypeParaArr = [];
//    if (0 < $jcdw.find(".activeggqy").length) {
//    	//公共区域
//        resTypeParaArr.push("1");
//    }
//    if (0 < $jcdw.find(".activezdwxyqy").length) {
//        //重大危险源企业
//        resTypeParaArr.push("2");
//    }
    $.ajax({
        type: "post",
        url: BASE_URL + "monitor/macprobe/loadGisPortalJcdwProbeInfo",
        data: {
//            "resType": resTypeParaArr.join(","),
            "entname": $jcdw.find(".searchBox").val()
        },
        success: function (retData) {
//            window.map.clearOverlays();
            var $tbody = $jcdw.find("tbody");
            $tbody.empty();
            if (retData) {
            	addCenterCityPoly(window.map);
            	
//            	var hasListData = false;
//                	17012306001310011350  17031608001310010755 17031608001310016892 17031608001310015496 17031608001310011853 17110505001310014358
//            	var commonAreaData = [
//            	                      {"PTNAME": "经七纬七东向西", "LONGITUDE": "110.063605", "LATITUDE": "40.286811", "BUSINESSINFOID": "cedec7d66c7d4062b562a507c1c48696", "TYPE": "公共区域"},
//            	                      {"PTNAME": "经七纬三北向南", "LONGITUDE": "110.064288", "LATITUDE": "40.310831", "BUSINESSINFOID": "b8d2a711cf7341289a9b71b33c8ef362", "TYPE": "公共区域"},
//            	                      {"PTNAME": "经七纬七西向东", "LONGITUDE": "110.063102", "LATITUDE": "40.286866", "BUSINESSINFOID": "a76a6a73ff81405c8e86bb50e21a1955", "TYPE": "公共区域"},
//            	                      ];
                if (0 < retData.length) {
//                	if (_.contains(resTypeParaArr, "1")) {
//                		if ("" == $jcdw.find(".searchBox").val() || null == $jcdw.find(".searchBox").val()) {
//                			retData = _.union(retData, commonAreaData);
//                		}
//                	}
//                	hasListData = true;

                    clearHistorys();

                    _.map(retData, function (tmpData, index) {
                        $tbody.append("<tr>" +
                            "<td>" + (index + 1) + "</td>" +
                            "<td class='resName' data-resId='" + tmpData.BUSINESSINFOID + "'>" + tmpData.PTNAME + "</td>" +
                            "</tr>");
                        if (!window.curEntAndMatlsDic.containsKey(tmpData.BUSINESSINFOID)) {
                            //获取该企业所有的风险总数
//                        var curEntDssCnts = _.where(retData, {"BUSINESSINFOID": tmpData.BUSINESSINFOID}).length;
                            var markIconUrl = "images/portal/icon_gisEnt.png", winCon = "", markClkCb = null;
//            				if ("公共区域" == tmpData.TYPE) {
//            					//公共区域点位图标
//            					markIconUrl = "images/portal/icon_gisComVideo.png";
//
//            					//公共区域弹窗内容
//            					winCon = "<div class='ggqypopup'>" +
//            					"   <div class='popupTitle'>" + tmpData.PTNAME + "</div>" +
//            					"   <div>" +
//            					"      <div class='ggqyLeft'>" +
//            					"           <div class='ggqyTitle ggqyContentTitle'>" + tmpData.PTNAME + "</div>" +
//				            	"			<object classid='clsid:D5E14042-7BF6-4E24-8B01-2F453E8154D7' id='PlayViewOCX' name='ocx' class='videoArea'></object>" +
//            					"       </div>" +
////            					"       <div class='ggqyRight'>" +
////            					"           <ul>" +
////            					"               <li class='ggqyContentkind active'>" + tmpData.PTNAME + "</li>" +
////            					"           </ul>" +
////            					"       </div>" +
//            					"   </div>" +
//            					"   <div class='triangle'></div>" +
//            					"</div>";
//
//            					//公共区域弹窗内容回调函数
//            					markClkCb = function(tmpData) {
//            						try {
//            							var curIndexcode = "";
//                						if ("经七纬七东向西" == tmpData.PTNAME) {
//                							curIndexcode = "17031608001310010755";
//                						} else if ("经七纬三北向南" == tmpData.PTNAME) {
//                							curIndexcode = "17031608001310016892";
//                						} else if ("经七纬七西向东" == tmpData.PTNAME) {
//                							curIndexcode = "17031608001310015496";
//                						}
//
//                						if (window.OCXobj) {
//                							window.OCXobj.Destroy();
//                						}
//                						window.OCXobj = document.getElementById("PlayViewOCX");
//                						window.OCXobj.SetOcxMode(0);
//                						window.OCXobj.SetWndNum(1);//窗口个数
////		            				    window.OCXobj.SetCapturParam("C:\\pic",0);//图片保存路径，格式
//                						window.OCXobj.SetPicDiskMinSize(1);
//            					    	var previewXml = "<?xml version='1.0' encoding='UTF-8'?>" +
//				            					    	 "<Message>" +
//				            					    	 "<Camera>" +
//				            					    	 "<IndexCode>" + curIndexcode + "</IndexCode>" +
//				            					    	 "</Camera>" +
//				            					    	 "<Dev regtype='6' devtype='10001'></Dev>" +
//				            					    	 "<Vag IP='218.21.217.122' Port='7302' />" +
//				            					    	 "<Media Protocol='0' Stream='0'>" +
//				            					    	 "<Vtdu IP='218.21.217.122' Port='554' />" +
//				            					    	 "</Media>" +
//				            					    	 "<Privilege Priority='1' Code='15' />" +
//				            					    	 "<Option>" +
//				            					    	 "<Talk>1</Talk>" +
//				            					    	 "<PreviewType>0</PreviewType>" +
//				            					    	 "</Option>" +
//				            					    	 "</Message>";
//            					    	window.OCXobj.StartTask_Preview_InWnd(previewXml, 0);
//            					    } catch (e) {
//            					    	layer.confirm("插件没有安装,请下载安装", {
//            					            btn: ['下载', '取消'], //按钮
//            					            shade: false //不显示遮罩
//            					        }, function (index) {
//            					            window.location.href = BASE_URL + "/monitor/macmonitormap/downloadWebVideo";
//            					            layer.close(index);
//            					        });
//            					        return;
////            					    	parent.toast("视频监控初始化失败!请使用IE10.0或以上版本");
//            						}
//            					};
//            				} else {

                            //重大危险源企业点位图标
                            markIconUrl = "images/portal/icon_gisEntVideoData.png";
                            
                            //重大危险源企业点位弹窗内容
                            var winCon = "<div class='zdwxypopup'>" +
                                "   <div class='popupTitle'>" + tmpData.PTNAME + "</div>" +
                                "   <div class='zdwxypopupTab'>" +
                                "       <span class='active' data-kind='sssj'>实时数据</span><span data-kind='spjk'>视频监控</span><i id='zdwxyMonloadMore'>查看更多</i>" +
                                "   </div>" +
                                "   <div id='sssj' class='zdwxypopupNav'>" +
                                "       <div id='sssjpic'></div>" +
                                "       <table class='jcdList'>" +
                                "           <thead>" +
                                "               <tr>" +
                                "                   <th>编号</th>" +
                                "                   <th>监测点名称</th>" +
                                "                   <th>检测值</th>" +
                                "                   <th>状态</th>" +
                                "                   <th>更新时间</th>" +
                                "               </tr>" +
                                "           </thead>" +
                                "           <tbody>" +
                                "           </tbody>" +
                                "       </table>" +
                                "   </div>" +
                                "   <div id='spjk' class='zdwxypopupNav'>" +
                                "       <div class='ggqyLeft'>" +
                                "           <div class='ggqyTitle ggqyContentTitle'></div>" +
                                "           <object classid='clsid:D5E14042-7BF6-4E24-8B01-2F453E8154D7' id='PlayViewOCX' name='ocx' class='videoArea'></object>" +
                                "           <object classid='clsid:9ECD2A40-1222-432E-A4D4-154C7CAB9DE3' id='spvViewOCX' name='ocx' class='videoArea'></object>" +
                                "			<div class='mbe_center' id='hyPlayer'></div>" + 
                                "	        <div class='objDiv'><span class='ieClass'><font style='color: white;font-size: 14px'>视频加载中...</font><span></div>" +
                                "       </div>" +
                                "       <div class='ggqyRight'>" +
                                "           <li class='ggqyContentTitle'>监控摄像头列表</li>" +
                                "           <ul>" +
                                "           </ul>" +
                                "       </div>" +
                                "   </div>" +
                                "   <div class='triangle'></div>" +
                                "</div>";

                            //重大危险源企业弹窗内容回调函数
                            markClkCb = function (tmpData) {
                                //分别绑定视频监测点位切换
                                $(".zdwxypopupTab").find("span").off("click").on("click", function () {
                                    //添加选中状态
                                    $(this).siblings().removeClass("active");
                                    $(this).removeClass("active").addClass("active");
                                    
                                    //当选中查看实时数据时
                                    if ("sssj" == $(this).attr("data-kind")) {
                                    	//查看更详细的监测监控数据
                                    	$("#zdwxyMonloadMore").off("click").on("click", function() {
                                    		openWin(BASE_URL + 'views/module/monitor/monitorIndex/entInfo.html?businessinfoid=' + tmpData.BUSINESSINFOID, '监测监控', '92%', '100%');
                                    	});
                                    	
                                        //清空初始化历史div数据
                                        $("#spjk").hide();
                                        $("#sssj").show();
                                        $(".jcdList").find("tbody").empty();
                                        $("#sssjpic").empty();
                                        
                                        //切换时刷新滚动条
                                        $('.jcdList tbody').niceScroll({
                                            cursorborder: "#4d86d6",
                                            cursorcolor: "#4d86d6",
                                            background: false,
                                            autohidemode: false
                                        }).show();
                                        $('.ggqyRight ul').niceScroll({
                                            cursorborder: "#4d86d6",
                                            cursorcolor: "#4d86d6",
                                            background: false,
                                            autohidemode: false
                                        }).hide();
                                        
                                        //根据当前企业id获取该企业下探头信息
                                        $.ajax({
                                            type: 'post',
                                            url: BASE_URL + '/monitor/macmonitormap/loadGisPortalMacProList',
                                            cache: false,
                                            data: {"businessinfoid": tmpData.BUSINESSINFOID},
                                            success: function (datalist) {
                                                if (datalist && 0 < datalist.length) {
                                                    var jcdListDom = "";
                                                    for (var key in datalist) {
                                                        var item = datalist[key],
                                                            curStat = '正常';
                                                        switch (item.STATE) {
                                                            case "0":
                                                                curStat = '正常';
                                                                break;
                                                            case "2":
                                                                curStat = '待标定';
                                                                break;
                                                            case "3":
                                                            case "99":
                                                            case "7":
                                                                curStat = '故障报警';
                                                                break;
                                                            case "4":
                                                                curStat = '预警';
                                                                break;
                                                            case "100":
                                                            case "101":
                                                            case "102":
                                                            case "103":
                                                            case "104":
                                                                curStat = '监测报警';
                                                                break;
                                                        }

                                                        jcdListDom += "<tr dataId='" + item.PROBEID + "'>" +
                                                            " <td>" + (parseInt(key) + 1) + "</td>" +
                                                            " <td>" + item.PROBENAME + "</td>" +
                                                            " <td>" + (item.CHROVAL + "(" + item.UNIT + ")") + "</td>" +
                                                            " <td>" + curStat + "</td>" +
                                                            " <td>" + getFormatDateByLong(item.UPDATETIME, "yyyy-MM-dd hh:mm:ss") + "</td>" +
                                                            "</tr>";
//                    										arr.dataid = item.PROBEID;
//                    										arr.videoid = item.VIDEOID;
                                                    }
                                                    $(".jcdList").find("tbody").html(jcdListDom);

                                                    //绑定展示曲线图
                                                    $(".jcdList").find("tbody").find("tr").off("click").on("click", function () {
                                                        loadJcdLineCharts($(this).attr("dataId"));
                                                    }).first().trigger("click");
                                                }
                                            },
                                            error: function (err) {
                                                toast("系统繁忙!");
                                            }
                                        });
                                    } else {
                                        $("#sssj").hide();
                                        $("#spjk").show();
                                        
                                        //切换时刷新滚动条
                                        $('.jcdList tbody').niceScroll({
                                            cursorborder: "#4d86d6",
                                            cursorcolor: "#4d86d6",
                                            background: false,
                                            autohidemode: false
                                        }).hide();
                                        $('.ggqyRight ul').niceScroll({
                                            cursorborder: "#4d86d6",
                                            cursorcolor: "#4d86d6",
                                            background: false,
                                            autohidemode: false
                                        }).show();
                                        var $ggqyRightUl = $(".ggqyRight").find("ul");
                                        $ggqyRightUl.empty();
                                        //$ggqyRightUl.html("<li class='ggqyContentTitle'>监控摄像头列表</li>");
//											if (window.OCXobj) {
//                        						window.OCXobj.Destroy();
//                        					}

                                        //当选中查看实时视频时
                                        $.ajax({
                                            type: "post",
                                            url: BASE_URL + "monitor/macvideo/load",
                                            data: {"businessinfoid": tmpData.BUSINESSINFOID},
                                            success: function (data) {
                                                if (data) {
//            											console.log(data);
                                                    if (0 < data.videolist.length) {
                                                        var videoDom = "";
                                                        _.map(data.videolist, function (tmpVideo, index) {
                                                            videoDom += ("<li class='ggqyContentkind' data-videoId='" + tmpVideo.videoid + "' " +
                                                            		     "data-videoType='" + tmpVideo.videoType + "' " + "data-ipaddr='" + tmpVideo.ipaddr + "' " +
                                                            		     "data-hyplayport='" + tmpVideo.hyplayport + "' " + "data-strdomaincode='" + tmpVideo.strdomaincode + "' " +
                                                            		     "data-strdevicecode='" + tmpVideo.strdevicecode + "' " + "data-strchannelcode='" + tmpVideo.strchannelcode + "' " +
                                                            		     "data-strstreamcode='" + tmpVideo.strstreamcode + "'>" + tmpVideo.videoname + "</li>");
                                                        });
                                                        $ggqyRightUl.append(videoDom);
                                                        
                                                        //判断浏览器IE和非IE浏览器显示视频插件的区别
                                                     	var browserAg = navigator.userAgent.toString().toLowerCase();
                                                     	if (browserAg.indexOf("firefox") != -1 || browserAg.indexOf("chrome") != -1) {
//                                                     		$("object").html("");
//                                                     		$("object").removeClass("videoArea");
                                                     		$(".videoArea, #hyPlayer").hide();
                                                     		$(".objDiv").remove();
                                                     		$(".ggqyLeft").append('<div class="objDiv"><span class="ieClass"><font style="color: white;font-size: 14px">请使用IE10.0及其以上版本查看视频监控</font><span></div>');
                                                     		return;
                                                     	}
                                                        
                                                     	//用于区分是否第一次加载海康视频
                                                    	window.is8200FirstLoad = 1;
                                                    	window.is8700FirstLoad = 1;
                                                     	
                                                        //绑定视频列表点击事件
                                                        $(".ggqyContentkind").off("click").on("click", function() {
                                                            //切换被选中状态
                                                            $(this).siblings().removeClass("active");
                                                            $(this).removeClass("active").addClass("active");
                                                            $(".ggqyTitle").text($(this).text());
                                                            var curVideoId = $(this).attr("data-videoId"),
                                                            	curVideoType = $(this).attr("data-videoType"),
                                                            	curIpaddr = $(this).attr("data-ipaddr"),
                                                            	curHyplayport = $(this).attr("data-hyplayport"),
                                                            	curStrdomaincode = $(this).attr("data-strdomaincode"),
                                                            	curStrdevicecode = $(this).attr("data-strdevicecode"),
                                                            	curStrchannelcode = $(this).attr("data-strchannelcode"),
                                                            	curStrstreamcode = $(this).attr("data-strstreamcode");
                                                            
                                                            //获取摄像头信息
                                                            monitordatas.loadVideoInfo(curVideoId, function(videoData) {
//                        									    	console.log(videoData);
                                                                //拼接参数
                                                                if (videoData) {
                                                                	//8200平台视频点位
                                                                	if ("8200" == curVideoType) {
                                                                		$("#spvViewOCX, #hyPlayer").css("display", "none");
                                                                		$("#PlayViewOCX").css("display", "block");
                                                                		
                                                                		var previewXml = "<?xml version='1.0' encoding='UTF-8'?>" +
				                                                                         "<Message>" +
				                                                                         "<Camera>" +
				                                                                         "<IndexCode>" + videoData[0].INDEXCODE + "</IndexCode>" +
				                                                                         "</Camera>" +
				                                                                         "<Dev regtype='6' devtype='" + videoData[0].DEVTYPE + "'></Dev>" +
				                                                                         "<Vag IP='" + videoData[0].VAGIP + "' Port='" + videoData[0].VAGPORT + "' />" +
				                                                                         "<Media Protocol='0' Stream='0'>" +
				                                                                         "<Vtdu IP='" + videoData[0].VTDUIP + "' Port='" + videoData[0].VTDUPORT + "' />" +
				                                                                         "</Media>" +
				                                                                         "<Privilege Priority='1' Code='15' />" +
				                                                                         "<Option>" +
				                                                                         "<Talk>1</Talk>" +
				                                                                         "<PreviewType>0</PreviewType>" +
				                                                                         "</Option>" +
				                                                                         "</Message>";
	                                                                    try {
	//                        									    		
//	                                                                    	(previewXml);
	//                        	                        					if (window.OCXobj) {
	//                        	                        						window.OCXobj.Destroy();
	//                        	                        					}
	//                        									    		$(".videoArea").remove();
	//                        									    		$(".ggqyLeft").append("<object classid='clsid:D5E14042-7BF6-4E24-8B01-2F453E8154D7' id='PlayViewOCX' name='ocx' class='videoArea'></object>");
	                                                                        	var OCXobj = document.getElementById("PlayViewOCX");
	                                                                            OCXobj.SetOcxMode(0);
	                                                                            
	                                                                          //设置窗口交互个数
	                                                                        	1 == window.is8200FirstLoad && OCXobj.SetWndNum(4);//窗口个数
	                                                                        	window.is8200FirstLoad = 0;
//	                                                                            OCXobj.SetWndNum(4);//窗口个数
	                                                                            OCXobj.SetPicDiskMinSize(1);
//	                                                                			var lWndIndex = OCXobj.GetFreePreviewWnd();
//	                                                                			if (-1 == lWndIndex) {
//	                                                                				StartPlayView(previewXml, 0);
//	                                                                			} else {
//	                                                                				StartPlayView(previewXml, lWndIndex);
//	                                                                			}
	                                                                            
	                                                                            $(".objDiv").remove();
	                                                                            $("#PlayViewOCX").height("310px");
	                                                                			OCXobj.StartTask_Preview_FreeWnd(previewXml);
	                                                                    } catch(e) {
	                                                                    	$(".objDiv").remove();
	                                                                 		$(".ggqyLeft").append('<div class="objDiv"><span class="noPlug"><font style="color: white;font-size: 14px">插件没有安装,请<a href="'+BASE_URL+'/monitor/macmonitormap/downloadWebVideo?type=8200"><font color="red">下载</font></a>安装</font><span></div>');
	                                                                        return;
	                                                                    }
                                                                	} else if ("8700" == curVideoType) {
                                                                		//8700平台视频点位
                                                                		$("#PlayViewOCX, #hyPlayer").css("display", "none");
                                                                		$("#spvViewOCX").css("display", "block");
//                                                                		$("#box").append("<object classid='clsid:9ECD2A40-1222-432E-A4D4-154C7CAB9DE3' id='spvViewOCX' name='ocx'>" +
//                                                            			"</object>");
//                                                                 		spvxOcx.MPV_Uninit();
                                                                		var spvxOcx = null;
                                                                		try {
                                                                			spvxOcx = document.getElementById("spvViewOCX");
                                                                			
                                                                			//初始化调用海康8700平台视频基本配置参数
                                                                			initHik8700(spvxOcx);
                                                                			
                                                                			//设置窗口交互个数
                                                                			(1 == window.is8700FirstLoad) && (spvxOcx.MPV_SetPlayWndCount(1));//窗口个数
                                                                			window.is8700FirstLoad = 0;
//                                                                			spvxOcx.MPV_SetPlayWndCount(1);
                                                						} catch(e) {
                                                							$(".objDiv").remove();
	                                                                 		$(".ggqyLeft").append('<div class="objDiv"><span class="noPlug"><font style="color: white;font-size: 14px">插件没有安装,请<a href="'+BASE_URL+'/monitor/macmonitormap/downloadWebVideo?type=8700"><font color="red">下载</font></a>安装</font><span></div>');
                                                							return;
                                                						}
                                                                		
                                                                		$.ajax({
                                                                			type: "post",
                                                                			url: BASE_URL + "monitor/macvideo/loadEsVideoXml",
                                                                			dataType: "json",
                                                                			data: {"videoid": curVideoId},
                                                                			success: function(retData) {
                                                                				if (retData) {
                                                                					if ("" != retData.esVideoXml) {
//                                                                						alert("xml" + retData.esVideoXml);
                                                                						try {
                                                                							$(".objDiv").remove();
                                                                							$("#spvViewOCX").height("310px");
//                                                                							var spvxOcx = document.getElementById("spvViewOCX");
                                                                							var ret = spvxOcx.MPV_StartPreview(retData.esVideoXml);
//                                                                							alert("结果" + ret);
                                                                						} catch(e) {
                                                                							$(".objDiv").remove();
                	                                                                 		$(".ggqyLeft").append('<div class="objDiv"><span class="noPlug"><font style="color: white;font-size: 14px">插件没有安装,请<a href="'+BASE_URL+'/monitor/macmonitormap/downloadWebVideo?type=8700"><font color="red">下载</font></a>安装</font><span></div>');
//                                                                							$("#titContent").html("");
//                                                                							$("#titContent").append('<font style="color: white;font-size: 15px">插件没有安装,请<a href="'+BASE_URL+'/monitor/macmonitormap/downloadWebVideo?type=8700">下载</a>安装</font>');
//                                                                							$("#titContent").addClass("noPlug");
//                                                                							$("#objDiv").show();
                                                                							return;
                                                                						}
                                                                					} else {
                                                                						parent.toast("系统繁忙，请稍后再试！");
                                                                					}
                                                                				}
                                                                			},
                                                                			error: function(err) {
                                                                				parent.toast("系统繁忙，请稍后再试！");
                                                                			}
                                                                		});
                                                                		
                                                                	} else if ("HY" == curVideoType) {
                                                                		//---接入怀业平台视频
                                                                		$("#PlayViewOCX, #spvViewOCX").css("display", "none");
                                                                		$("#hyPlayer").css("display", "block");
                                                                		
                                                                		try {
                                                                			jQuery.support.cors = true;
                                                                			var option = {
                                                                					id: "hyPlayer",
                                                                					height: "100%",
                                                                					width: "100%",
                                                                					classid: "clsid:210468B6-80D3-4CD0-921E-1AA99B8EB5AD"
                                                                					//codebase:"../UMP_OCX_V200R002B24(1,0,1,4).cab#version=1,0,0,4"
                                                                			};
                                                                			
                                                                			if (!window.myOcxMsg) {
                                                                				window.myOcxMsg = new initSDK(); 
                                                                				window.myOcxMsg._init_(option);
                                                                			}
                                                                			
                                                                			var ranHyName = hyRanUname(8, 2);
                                                                			var loginData = {
                                                                					SeqNo:7,  
                                                                					strUserID: "admin" + ranHyName,
                                                                					strUserName: "admin" + ranHyName,  
                                                                					strServerIP: curIpaddr,
                                                                					nServerPort: parseInt(curHyplayport),  
                                                                					success: function(data) {
                                                                						$.hy_log("登录成功"+JSON2.stringify(data));
                                                                						$(".objDiv").remove();
                                                                						
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
                                                                				 		
                                                                				 		mbedeviceShowObj.serviceUrl.strDomainCode = curStrdomaincode;
                                                                		 				mbedeviceShowObj.serviceUrl.strDeviceCode = curStrdevicecode;
                                                                		 				mbedeviceShowObj.serviceUrl.strChannelCode = curStrchannelcode;
                                                                		 				mbedeviceShowObj.serviceUrl.strStreamCode = curStrstreamcode;
                                                                				 		mbedeviceShowlist.push(mbedeviceShowObj);
                                                                	//			 		alert(JSON.stringify(mbedeviceShowlist));
                                                                				 		//登录播放器
                                                                				 		var initParam = {
                                                                				 				id: "hyPlayer",
                                                                				 				width: "100%",
                                                                				 				height: "100%",
                                                                				 				classid: "clsid:210468B6-80D3-4CD0-921E-1AA99B8EB5AD",
                                                                				 				ShowBarFullBtn: true,
                                                                				 				ShowPlayBar: true,
                                                                				 				ShowProgressBar: true,
                                                                				 				ShowAudioBar: true,
                                                                				 				ShowPlayPauseBtn:true,	
                                                                				 				ShowStretchBtn: true,
                                                                				 				ShowLayoutBtn: true
                                                                				 		};
                                                                				 		
                                                                				 		window.lastHyPlayer = window.myOcxMsg._playinit_("hyPlayer", $.extend({}, initParam, {id: "hyPlayer"}));
                                                                				 		window.lastHyPlayer.ShowBarFullBtn(1);
                                                                				 		
                                                                				 		var playParam = {
                                                                				 		    SeqNo: 5,
                                                                				 		    play: window.lastHyPlayer,
                                                                				 		    list: mbedeviceShowlist,
                                                                				 		    success: function(res){},
                                                                				 		    error: function(data) {
                                                                				 		    	$.hy_log("失败"+JSON2.stringify(data))
                                                                				 		    }
                                                                				 		};
                                                                				 		window.myOcxMsg.playliveIpc(playParam);
                                                                					},
                                                                					error:function(data) {
                                                                						$.hy_log("登录失败"+JSON2.stringify(data));
                                                                						
                                                                						if(data.nResultCode == "1720200002"){}
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
                                                                	} else if ("NVR" == curVideoType) {
                                                                		//直接接入NVR设备视频
                                                                	}
                                                                }
                                                            });
                                                        }).first().trigger("click");
                                                    } else {
                                                		$(".videoArea, #hyPlayer").hide();
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
                                }).first().trigger("click");
                            };
//            				}
                            var tmpPt = new BMap.Point(tmpData.LONGITUDE, tmpData.LATITUDE);
                            var tmpMarker = new BMap.Marker(tmpPt, {
                                "title": tmpData.PTNAME,
                                "icon": new BMap.Icon(BASE_URL + markIconUrl, new BMap.Size(42, 56))
                            });
                            tmpMarker.enableMassClear();

                            //将点位存储至map集合工具类中
                            window.curEntAndMatlsDic.put(tmpData.BUSINESSINFOID, {
                                "data": tmpData,
                                "marker": tmpMarker,
                                "click": function () {
                                	
                                	//判断点位是否在当前视野内
                                    var bound=window.map.getBounds();//地图可视区域
                                    if(bound.containsPoint(tmpPt)==false){
                                    	window.map.panTo(tmpPt);
                                    }
                                	
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
//                                    	var browserAg = navigator.userAgent.toString().toLowerCase();
//                                        if (-1 < browserAg.indexOf("firefox") || -1 < browserAg.indexOf("chrome")) {
////                                            parent.toast("请使用IE10及以上浏览器查看具体视频！");
//                                        }
                                    	
                                        markClkCb(tmpData);
                                        // $.ajax({
                                        //     type: "post",
                                        //     url: BASE_URL + "dangersource/dssrsk/loadDssdskInfo?businessinfoid="+businessinfoid +"&resTypes="+resTypes,
                                        //     data: {
                                        //         businessinfoid:businessinfoid,
                                        //         resTypes:resTypes
                                        //     },
                                        //     success: function (retData) {
                                        //
                                        //     },
                                        //     error: function (err) {
                                        //         infoBox.setContent("<div class='bb wxypopup'>"+tmpData.ENTNAME+"</div>");
                                        //     }
                                        // });
//                                      添加滚动条
                                        $('.jcdList tbody').niceScroll({
                                            cursorborder: "#4d86d6",
                                            cursorcolor: "#4d86d6",
                                            background: false,
                                            autohidemode: false
                                        }).show();
                                    });

                                    //infoBox关闭时执行的操作
                                    infoBox.addEventListener("close", function (e) {
                                        //取消marker的跳动效果
                                        tmpMarker.setAnimation(null);
                                        //释放视频预览插件空间
//            							if (window.OCXobj && $.isFunction(window.OCXobj.Destroy)) {
//            								window.OCXobj.Destroy();
//            							}
                                    });
                                    infoBox.open(tmpMarker);   //图片加载完毕重绘infowindow
                                }
                            });

                            //定义点位点击触发事件
                            tmpMarker.addEventListener("click", function () {
                                window.curEntAndMatlsDic.get(tmpData.BUSINESSINFOID).click();
                            });

                            //将点位添加至地图
                            window.map.addOverlay(tmpMarker);
                        }
                    });

                    //为企业监管列表每一行绑定GIS弹窗事件
                    $tbody.find("tr").off("click").on("click", function () {
                        window.curEntAndMatlsDic.get($(this).find(".resName").attr("data-resId")).click();
                    });
                }
            }
        },
        error: function (err) {
            toast("系统繁忙!");
        }
    });
}

/**
 * 根据dataid查询监测点曲线图数据
 * @param dataid
 */
function loadJcdLineCharts(dataid) {
    var myLineChart = echarts.init(document.getElementById("sssjpic"));
    
    //查询该探头最近一个小时的每5分钟探头数据
    var last1HDateStr = getFormatDate(new Date(new Date().getTime() - 60 * 60 * 1000)),
    	nowDateStr = getNowFormatTime();
    var probeDatas = monitordatas.loadRealChroByProbe(dataid, "6", last1HDateStr, nowDateStr);
    var probename = "",
    	dataX = [],
    	dataY = [];
    if (probeDatas && 0 < probeDatas.length) {
    	probename = probeDatas[0].PROBENAME;
    	var rawDates = _.pluck(probeDatas, "CREATETIME");
    	_.map(rawDates, function(tmpDate, index) {
    		dataX.push(getSmpFormatDateByLong(tmpDate, true));
    	});
    	dataY = _.pluck(probeDatas, "CHROVAL");
    }
//    function addData(shift) {
//        now = getFormatDateByLong(_.now(), "hh:mm:ss");
//        date.push(now);
//        var data = monitordatas.loadRealChroByProbe(dataid);
//        var chroval = data[0].CHROVAL;
//        dataY.push(chroval);
//        if (shift) {
//            date.shift();
//            dataY.shift();
//        }
//        now = getFormatDateByLong(_.now(), "hh:mm:ss");
//    }

//    for (var i = 1; i < 7; i++) {
//        addData();
//    }
    var option = {
        title: {
            text: '',
            subtext: ''
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            orient: 'vertical',
            x: 'right',
            data: [probename],
            textStyle: {color: '#FFFFFF'}
        },
        xAxis: [
            {
                type: 'category',
                name: '时间',
                boundaryGap: false,
                data: dataX,
                axisLabel: {
                	textStyle: {
                	    color: '#FFFFFF'
                	}     
                },
                axisLine: {
                	lineStyle: {
                	    color: '#FFFFFF',
                	    width: 2,
                	    type: 'solid'
                	} 
                }
            }
        ],
        yAxis: [
            {
                type: 'value',
                name: '浓度值',
                axisLabel: {
                    formatter: '{value}'
                },
                axisLabel: {
                	textStyle: {
                	    color: '#FFFFFF'
                	}     
                },
                axisLine: {
                	lineStyle: {
                	    color: '#FFFFFF',
                	    width: 2,
                	    type: 'solid'
                	} 
                }
            }
        ],
        series: [
            {
                name: probename,
                type: 'line',
                smooth: true,
                itemStyle: {
                    normal: {
                        areaStyle: {type: 'default'}
                    }
                },
                data: dataY
            }
        ],
        color: ['rgb(28,220,168)']
    };
    myLineChart.setOption(option);
//		    var realimeTicket = setInterval(function () {
//		        addData(true);
//		        myLineChart.setOption({
//		            xAxis: {
//		                data: date
//		            },
//		            series: [{
//		                data: dataY
//		            }]
//		        });
    //
//		    }, 5000);
}

// /**
//  * 初始化加载安全风险列表及GIS点位
//  */
// function initAqfxMapPts() {
//
//     //默认清除地图上历史覆盖物
//     window.map.clearOverlays();
//
//     //----待续
//
// }

/**
 * 初始化加载安全风险列表及GIS点位
 */
function initAqfxMapPts() {
    $(".infoRight").hide();
    //隐藏重大危险源、应急资源饼状图
//	$("#dangerCountDiv, #emsResCntDiv").hide();
    window.map.clearOverlays();

    //----待续
    var $aqfx = $("#aqfx");

    var resTypeParaArr = [];

    if (0 < $aqfx.find(".activesczyhd").length) {
        //生产作业活动
        resTypeParaArr.push("1");
    }
    if (0 < $aqfx.find(".activewxzyhd").length) {
        //维修作业活动
        resTypeParaArr.push("2");
    }
    if (0 < $aqfx.find(".activegygc").length) {
        //工艺过程
        resTypeParaArr.push("3");
    }
    if (0 < $aqfx.find(".activesbss").length) {
        //设备设施
        resTypeParaArr.push("4");
    }
    if (0 < $aqfx.find(".activeczcx").length) {
        //操作程序
        resTypeParaArr.push("5");
    }
    if (0 < $aqfx.find(".activecshj").length) {
        //场所环境
        resTypeParaArr.push("6");
    }


    $.ajax({
        type: "post",
        url: BASE_URL + "dangersource/dssrsk/loadGisDssRsk",
        data: {
            "resType": resTypeParaArr.join(","),
            "entname": $aqfx.find(".searchBox").val()
        },
        success: function (retData) {
//            console.log(retData);
            addCenterCityPoly(window.map);
            
            var $tbody = $aqfx.find("tbody");
            $tbody.empty();
            if (retData) {
                if (0 < retData.data.length) {
                    //默认清除地图上历史覆盖物

                    clearHistorys();

                    _.map(retData.data, function (tmpData, index) {
                        $tbody.append("<tr>" +
                            "<td>" + tmpData.ENTNAME + "</td>" +
                            "<td class='resName' data-resId='" + tmpData.BUSINESSINFOID + "'>" + tmpData.TYPENAME + "</td>" +
                            "<td>" + tmpData.COUNTNUM + "</td>" +
                            "</tr>");
                        if (!window.curEntAndMatlsDic.containsKey(tmpData.BUSINESSINFOID)) {
                            //获取该企业所有的风险总数
                            var total = 0;
                            _.map(_.where(retData.data, {"BUSINESSINFOID": tmpData.BUSINESSINFOID}), function (data, index) {
                                total += data.COUNTNUM;
                            });

                            var tmpPt = new BMap.Point(tmpData.LONGITUDE, tmpData.LATITUDE);

                            var tmpMarker = new BMap.Marker(tmpPt, {
                                "title": tmpData.ENTNAME,
                                "icon": new BMap.Icon(BASE_URL + "images/portal/icon_gisEnt.png", new BMap.Size(42, 56))
                            });

                            var defLabelStyle = {
                                color: "#fff",
                                borderStyle: "none",
                                backgroundColor: "transparent",
                                width: 60,
                                textAlign: "center",
                                fontSize: "13px",
                                left: "8px",
                                top: "9px",
                                fontStyle: "bold"
                            };

                            var labelOffSize = total / 100 >= 1 ? new BMap.Size(9, 10)
                                : total / 10 >= 1 ? new BMap.Size(13, 10)
                                    : new BMap.Size(15, 10);

                            var defLabel = new BMap.Label(total, {offset: labelOffSize});
                            defLabel.setStyle(defLabelStyle);
                            defLabel.show();
                            tmpMarker.setLabel(defLabel);

                            //允许清除覆盖物
                            tmpMarker.enableMassClear();

                            //将点位存储至map集合工具类中
                            window.curEntAndMatlsDic.put(tmpData.BUSINESSINFOID, {
                                "data": tmpData,
                                "marker": tmpMarker,
                                "click": function () {
                                	
                                	//判断点位是否在当前视野内
                                    var bound=window.map.getBounds();//地图可视区域
                                    if(bound.containsPoint(tmpPt)==false){
                                    	window.map.panTo(tmpPt);
                                    }
                                	
                                    var businessinfoid = tmpData.BUSINESSINFOID;
                                    var resTypes = resTypeParaArr.join(",");
                                    $.ajax({
                                        type: "post",
                                        url: BASE_URL + "dangersource/dssrsk/loadDssdskInfo",
                                        data: {
                                            businessinfoid: businessinfoid,
                                            resTypes: resTypes
                                        },
                                        success: function (retData) {


                                            var winCon = "<div class='bb wxypopup'>" + retData.dssRskEqus[0].ctrlmeasure + "</div>";
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
                                                //获取企业的风险信息
                                            });

                                            //infoBox关闭时执行的操作
                                            infoBox.addEventListener("close", function (e) {
                                                //取消marker的跳动效果
                                                tmpMarker.setAnimation(null);
                                            });


                                            infoBox.open(tmpMarker);   //图片加载完毕重绘infowindow
                                        },
                                        error: function (err) {

                                        }
                                    });
                                }
                            });

                            //定义点位点击触发事件
                            tmpMarker.addEventListener("click", function () {
                                window.curEntAndMatlsDic.get(tmpData.BUSINESSINFOID).click();
                            });

                            //将点位添加至地图
                            window.map.addOverlay(tmpMarker);
                        }


                    });
                    //为企业监管列表每一行绑定GIS弹窗事件
                    $tbody.find("tr").off("click").on("click", function () {
                        window.curEntAndMatlsDic.get($(this).find(".resName").attr("data-resId")).click();
                    });
                }
            }
        },
        error: function (err) {
            toast("系统繁忙!");
        }
    });
}

/**
 * 初始化加载应急资源点位及其列表数据
 */
function initYjzyMapPts() {
	//默认清除地图上历史覆盖物
	window.map.clearOverlays();
	clearHistorys();

	$(".infoRight").show();
    
    //隐藏之前其它饼图,显示应急资源种类切图
    $("#hidCountDiv, #zdwxyCntDiv, #dangerCountDiv, #entCountDiv, " +
      "#hidLevelCountDiv, #hidStateCountDiv, #qyjgCntDiv, #yqssCntDiv, #publicsCntDiv").hide();
    $("#emsResCnt").text("数量：0个");
    $("#emsResCntPie").empty();
    $("#yjzyCntDiv, #emsResCntDiv").show();

    var $yjzy = $("#yjzy"), resTypeParaArr = [];

    //最新应急资源类型参数
    if (0 < $yjzy.find(".activeyjjg").length) {
        resTypeParaArr.push("1");//应急机构
    }
    if (0 < $yjzy.find(".activeyjdw").length) {
        resTypeParaArr.push("2");//应急队伍
    }
    if (0 < $yjzy.find(".activeyjzj").length) {
        resTypeParaArr.push("3");//应急专家
    }
    if (0 < $yjzy.find(".activeyjck").length) {
        resTypeParaArr.push("4");//应急仓库
    }
    if (0 < $yjzy.find(".activeyljg").length) {
        resTypeParaArr.push("5");//医疗机构
    }
    if (0 < $yjzy.find(".activebncs").length) {
        resTypeParaArr.push("6");//避难场所
    }
    if (0 < $yjzy.find(".activeyjwz").length) {
        resTypeParaArr.push("7");//应急物资
    }
    if (0 < $yjzy.find(".activeysbz").length) {
        resTypeParaArr.push("8");//运输保障
    }
    if (0 < $yjzy.find(".activetxbz").length) {
        resTypeParaArr.push("9");//通信保障
    }

    //查询所有应急资源列表信息并在地图上加载相应点位
    $.ajax({
        type: "post",
        url: BASE_URL + "ems/portalgisems/loadEmsResInfo",
        data: {
            "resType": resTypeParaArr.join(","),
            "entname": $yjzy.find(".searchBox").val()
        },
        success: function (retData) {
            if (retData) {
//            	console.log(retData);
                addCenterCityPoly(window.map);

                //清空原有所有危险源列表数据
                var $tbody = $yjzy.find("tbody");
                $tbody.empty();
             
                //应急资源表格统计数据
                var allEmsResCnt = 0,
                	bncsResCnt = 0,
                	yjdwResCnt = 0,
                	yljgResCnt = 0,
                	yjwzResCnt = 0,
	                ysbzResCnt = 0,
	                txbzResCnt = 0,
	                yjjgResCnt = 0,
	                yjzjResCnt = 0,
	                yjckResCnt = 0;
                
                //遍历生成表格数据并加载GIS危险源点位
                if (0 < retData.emsResList.length) {
//                	console.log(retData.emsResList);
//                	console.log(retData.emsResCntPieData);
                    $("#emsResCnt").text("数量：" + retData.emsResList.length + "个");

                    //加载应急资源饼图等图表统计
                    	allEmsResCnt = retData.emsResList.length;
                        bncsResCnt = _.where(retData.emsResList, {"resType": "避难场所"}).length;
                        yjdwResCnt = _.where(retData.emsResList, {"resType": "应急队伍"}).length;
                        yljgResCnt = _.where(retData.emsResList, {"resType": "医疗机构"}).length;
                        yjwzResCnt = _.where(retData.emsResList, {"resType": "应急物资"}).length;
                        ysbzResCnt = _.where(retData.emsResList, {"resType": "运输保障"}).length;
                        txbzResCnt = _.where(retData.emsResList, {"resType": "通信保障"}).length;
                        yjjgResCnt = _.where(retData.emsResList, {"resType": "应急机构"}).length;
                        yjzjResCnt = _.where(retData.emsResList, {"resType": "应急专家"}).length;
                        yjckResCnt = _.where(retData.emsResList, {"resType": "应急仓库"}).length;

                    if (window.mapEchartsDic) {
                        window.mapEchartsDic.clear();
                    } else {
                        window.mapEchartsDic = new MapUtil();
                    }

                    var emsResCntPie = window.mapEchartsDic.get("emsResCntPie");
                    if (!emsResCntPie) {
                        emsResCntPie = echarts.init(document.getElementById("emsResCntPie"));
                        window.mapEchartsDic.put("emsResCntPie", emsResCntPie);
                    }

                    var emsResCntOption = {
                        // title : {
                        //     text: '某站点用户访问来源',
                        //     subtext: '纯属虚构',
                        //     x:'center'
                        // },
                        tooltip: {
                            trigger: 'item',
                            formatter: "{a} <br/>{b} : {c} ({d}%)"
                        },
                        legend: {
                            orient: 'horizontal',
                            bottom: 'bottom',
                            data: _.pluck(retData.emsResCntPieData, "name"),
                            textStyle: {
                            	color: "#Fff"
                            }
                        },
                        series: [
                            {
                                name: '个数',
                                type: 'pie',
                                radius: '43%',
                                center: ['50%', '37%'],
                                data: retData.emsResCntPieData,
                                itemStyle: {
                                    emphasis: {
                                        shadowBlur: 10,
                                        shadowOffsetX: 0,
                                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                                    }
                                }
                            }
                        ],
                        color: ['#FF3726','#E200FF','#00BFFF','#F5A623','#FF3726','#72D628','#FF6600','#6600FF','#3366FF']
                    };
                    emsResCntPie.setOption(emsResCntOption);

                    //遍历加载应急资源相关gis点位
                    _.map(retData.emsResList, function (tmpData, index) {
                        $tbody.append("<tr>" +
                            "<td>" + tmpData.belOrgName + "</td>" +
                            "<td class='resName' data-resId='" + tmpData.resId + "'>" + tmpData.resName + "</td>" +
                            "<td>" + tmpData.resType + "</td>" +
                            "</tr>");

                        //遍历添加GIS点位
//		 				if(!window.curEntAndMatlsDic.containsKey(tmpData.BUSINESSINFOID)){
                        //定义GIS各点位
                        var tmpPt = new BMap.Point(tmpData.resLng, tmpData.resLat);

                        //分类各点位图标
                        var tmpMarkIcon = null, tmpWinCon = "";
                        if ("应急机构" == tmpData.resType) {
                            tmpMarkIcon = new BMap.Icon(BASE_URL + "images/portal/icon_gisYjjg.png", new BMap.Size(42, 56));
                            var resWinTpt = _.template($("#yjjgPopWinTpt").html());
                            tmpWinCon = resWinTpt(tmpData);
//								tmpWinCon = "应急机构";
                        } else if ("应急队伍" == tmpData.resType) {
                            tmpMarkIcon = new BMap.Icon(BASE_URL + "images/portal/icon_gisYjdw.png", new BMap.Size(42, 56));
                            var resWinTpt = _.template($("#yjdwPopWinTpt").html());
                            tmpWinCon = resWinTpt(tmpData);
                        } else if ("应急专家" == tmpData.resType) {
//                        	tmpData.baseUrl = ;
                            tmpMarkIcon = new BMap.Icon(BASE_URL + "images/portal/icon_gisYjzj.png", new BMap.Size(42, 56));
                            var resWinTpt = _.template($("#yjzjPopWinTpt").html());
                            tmpWinCon = resWinTpt(tmpData);
//								tmpWinCon = "应急专家";
                        } else if ("应急仓库" == tmpData.resType) {
                            tmpMarkIcon = new BMap.Icon(BASE_URL + "images/portal/icon_gisYjck.png", new BMap.Size(42, 56));
                            var resWinTpt = _.template($("#yjckPopWinTpt").html());
                            tmpWinCon = resWinTpt(tmpData);
//								tmpWinCon = "应急仓库";
                        } else if ("医疗机构" == tmpData.resType) {
                            tmpMarkIcon = new BMap.Icon(BASE_URL + "images/portal/icon_gisYljg.png", new BMap.Size(42, 56));
                            var resWinTpt = _.template($("#yljgPopWinTpt").html());
                            tmpWinCon = resWinTpt(tmpData);
                        } else if ("避难场所" == tmpData.resType) {
                            tmpMarkIcon = new BMap.Icon(BASE_URL + "images/portal/icon_gisBncs.png", new BMap.Size(42, 56));
                            var resWinTpt = _.template($("#bncsPopWinTpt").html());
                            tmpWinCon = resWinTpt(tmpData);
                        } else if ("应急物资" == tmpData.resType) {
                            tmpMarkIcon = new BMap.Icon(BASE_URL + "images/portal/icon_gisYjwz.png", new BMap.Size(42, 56));
                            var resWinTpt = _.template($("#yjwzPopWinTpt").html());
                            tmpWinCon = resWinTpt(tmpData);
                        } else if ("运输保障" == tmpData.resType) {
                            tmpMarkIcon = new BMap.Icon(BASE_URL + "images/portal/icon_gisYsbz.png", new BMap.Size(42, 56));
                            var resWinTpt = _.template($("#ysbzPopWinTpt").html());
                            tmpWinCon = resWinTpt(tmpData);
                        } else if ("通信保障" == tmpData.resType) {
                            tmpMarkIcon = new BMap.Icon(BASE_URL + "images/portal/icon_gisTxbz.png", new BMap.Size(42, 56));
                            var resWinTpt = _.template($("#txbzPopWinTpt").html());
                            tmpWinCon = resWinTpt(tmpData);
                        } else {
                            tmpMarkIcon = new BMap.Icon(BASE_URL + "images/portal/icon_gisYjjg.png", new BMap.Size(42, 56));
                            tmpWinCon = "未知点位";
                        }

                        var tmpMarker = new BMap.Marker(tmpPt, {
                            "title": tmpData.resName,
                            "icon": tmpMarkIcon
                        });

                        //允许清除覆盖物
                        tmpMarker.enableMassClear();

                        //定义点位弹窗内容
//			 				var winCon = "当前应急资源名称： " + tmpData.resName;
//                        console.log(tmpWinCon);

                        //将点位存储至map集合工具类中
                        window.curEntAndMatlsDic.put(tmpData.resId, {
                            "data": tmpData,
                            "marker": tmpMarker,
                            "click": function (){
                            	
                            	//判断点位是否在当前视野内
                                var bound=window.map.getBounds();//地图可视区域
                                if(bound.containsPoint(tmpPt)==false){
                                	window.map.panTo(tmpPt);
                                }
                            	
                                var infoBox = new BMapLib.InfoBox(window.map, tmpWinCon, {
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
                                    openWindowScroll();
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
                                    //取消marker的跳动效果
                                    tmpMarker.setAnimation(null);
                                });
                                infoBox.open(tmpMarker);   //图片加载完毕重绘infowindow
                            }
                        });

                        //定义点位点击触发事件
                        tmpMarker.addEventListener("click", function () {
                            window.curEntAndMatlsDic.get(tmpData.resId).click();
                        });

                        //将点位添加至地图
                        window.map.addOverlay(tmpMarker);

                        //默认选择第一个点位居中
                        0 == index && window.map.setCenter(tmpPt);
//		 				}
                    });

                    //为企业监管列表每一行绑定GIS弹窗事件
                    $tbody.find("tr").off("click").on("click", function () {
                        window.curEntAndMatlsDic.get($(this).find(".resName").attr("data-resId")).click();
                    });
                }
                
                //应急资源表格统计数据
                $("#yjzyTotalCnt").text(allEmsResCnt + "个");
                $("#yjzyBncsCnt").text(bncsResCnt + "个");
                $("#yjzyYjdwCnt").text(yjdwResCnt + "个");
                $("#yjzyYljgCnt").text(yljgResCnt + "个");
                $("#yjzyYjwzCnt").text(yjwzResCnt + "个");
                $("#yjzyYsbzCnt").text(ysbzResCnt + "个");
                $("#yjzyTxbzCnt").text(txbzResCnt + "个");
                $("#yjzyYjjgCnt").text(yjjgResCnt + "个");
                $("#yjzyYjzjCnt").text(yjzjResCnt + "个");
                $("#yjzyYjckCnt").text(yjckResCnt + "个");
            }
        },
        error: function (err) {
            toast("系统繁忙!");
        }
    });
}

/**
 * 公共区域监测点位加载与联动
 */
function initGgqyjcMapPts() {
    //隐藏重大危险源、应急资源等饼状图
    $(".infoRight").hide();

    //默认清除地图上历史覆盖物
    window.map.clearOverlays();
    
    var $tbody = $("#ggqyjc").find("tbody");
    $tbody.empty();
    
    $.ajax({
        type: "post",
        url: BASE_URL + "monitor/macvideo/loadGovVideos",
        data: {
            "videoName": $("#ggqyjc").find(".searchBox").val()
        },
        success: function(retData) {
        	if (retData) {
        		//添加区域覆盖物
        		addCenterCityPoly(window.map);
        		
        		 if (0 < retData.length) {
//                   if (0 < retData.length) {
                   					var commonAreaData = retData;
//                   	var commonAreaData = [
//                   	                      {
//                   	                          "PTNAME": "龙岗大街德宝路北向南",
//                   	                          "LONGITUDE": "116.874656",
//                   	                          "LATITUDE": "37.314031",
//                   	                          "BUSINESSINFOID": "cedec7d66c7d4062b562a507c1c48696",
//                   	                          "TYPE": "公共区域"
//                   	                      },
//                   	                      {
//                   	                          "PTNAME": "站前大街旭日路北向南",
//                   	                          "LONGITUDE": "116.861981",
//                   	                          "LATITUDE": "37.31779",
//                   	                          "BUSINESSINFOID": "b8d2a711cf7341289a9b71b33c8ef362",
//                   	                          "TYPE": "公共区域"
//                   	                      },
//                   	                      {
//                   	                          "PTNAME": "超凡大街旭日路北向南",
//                   	                          "LONGITUDE": "116.863009",
//                   	                          "LATITUDE": "37.308222",
//                   	                          "BUSINESSINFOID": "a76a6a73ff81405c8e86bb50e21a1955",
//                   	                          "TYPE": "公共区域"
//                   	                      }
//                   	                  ];
                   	                      //定义存储所有企业和相关应急物资集合类
                   	                      clearHistorys();

                   	                      _.map(commonAreaData, function(tmpData, index) {
                   	                          $tbody.append("<tr>" +
                   	                              "<td>" + (index + 1) + "</td>" +
                   	                              "<td class='resName' data-resId='" + tmpData.VIDEOID + "'>" + tmpData.VIDEONAME + "</td>" +
                   	                              "</tr>");
                   	                          //获取该企业所有的风险总数
//                   	                        var curEntDssCnts = _.where(retData, {"BUSINESSINFOID": tmpData.BUSINESSINFOID}).length;
                   	                          var markIconUrl = "images/portal/icon_gisComVideo.png", winCon = "", markClkCb = null;
                   	                          //公共区域弹窗内容
                   	                          winCon = "<div class='ggqypopup' style='height: 390px;'>" +
                   	                              "   <div class='popupTitle'>" + tmpData.VIDEONAME + "</div>" +
                   	                              "   <div>" +
                   	                              "      <div class='ggqyVideoCon' style='width: 100%;height: 310px;opacity: 0.9;background: #003278;'>" +
                   	                              "			<object classid='clsid:D5E14042-7BF6-4E24-8B01-2F453E8154D7' id='PlayViewOCX' name='ocx' style='position: absolute;width: 478px;height: 0;'></object>" +
                   	                              "         <object classid='clsid:9ECD2A40-1222-432E-A4D4-154C7CAB9DE3' id='spvViewOCX' name='ocx' style='position: absolute;width: 478px;height: 0;'></object>" +
                   	                              "			<div class='mbe_center' id='hyPlayer'></div>" + 
                   	                              "	        <div class='objDiv_ggqy'><span class='ieClass'><font style='color: white;font-size: 14px'>视频加载中...</font><span></div>" + 
                   	                              "      </div>" +
                   	                              //            					"       <div class='ggqyRight'>" +
                   	                              //            					"           <ul>" +
                   	                              //            					"               <li class='ggqyContentkind active'>" + tmpData.PTNAME + "</li>" +
                   	                              //            					"           </ul>" +
                   	                              //            					"       </div>" +
                   	                              "   </div>" +
                   	                              "   <div class='triangle'></div>" +
                   	                              "</div>";

                   	                          //公共区域弹窗内容回调函数
                   	                          markClkCb = function(tmpData) {
                   	                          	//判断浏览器IE和非IE浏览器显示视频插件的区别
                   	                           	var browserAg = navigator.userAgent.toString().toLowerCase();
                   	                           	if (browserAg.indexOf("firefox") != -1 || browserAg.indexOf("chrome") != -1) {
                   	                           		$(".objDiv_ggqy").remove();
                   	                           		$("#PlayViewOCX, #spvViewOCX, #hyPlayer").hide();
                   	                           		$(".ggqyVideoCon").append('<div class="objDiv_ggqy"><span class="ieClass"><font style="color: white;font-size: 14px">请使用IE10.0及其以上版本查看视频监控</font><span></div>');
                   	                           		return;
                   	                           	}
                   	                           	
                   	                           	//获取摄像头信息
                                                   monitordatas.loadVideoInfo(tmpData.VIDEOID, function(videoData) {
//               									    console.log(videoData);
                                                       //拼接参数
                                                       if (videoData) {
                                                       	//8200平台视频点位
                                                       	if ("8200" == tmpData.HIKPLATNUM) {
                                                       		$("#spvViewOCX").css("display", "none");
                                                       		$("#hyPlayer").css("display", "none");
                                                       		$("#PlayViewOCX").css("display", "block");
                                                       		
                                                       		var previewXml = "<?xml version='1.0' encoding='UTF-8'?>" +
                                                                                "<Message>" +
                                                                                "<Camera>" +
                                                                                "<IndexCode>" + videoData[0].INDEXCODE + "</IndexCode>" +
                                                                                "</Camera>" +
                                                                                "<Dev regtype='6' devtype='" + videoData[0].DEVTYPE + "'></Dev>" +
                                                                                "<Vag IP='" + videoData[0].VAGIP + "' Port='" + videoData[0].VAGPORT + "' />" +
                                                                                "<Media Protocol='0' Stream='0'>" +
                                                                                "<Vtdu IP='" + videoData[0].VTDUIP + "' Port='" + videoData[0].VTDUPORT + "' />" +
                                                                                "</Media>" +
                                                                                "<Privilege Priority='1' Code='15' />" +
                                                                                "<Option>" +
                                                                                "<Talk>1</Talk>" +
                                                                                "<PreviewType>0</PreviewType>" +
                                                                                "</Option>" +
                                                                                "</Message>";
                                                               try {
                                                               		
   	                                                            	if (!window.OCXobj) {
   	                                                    				window.OCXobj = document.getElementById("PlayViewOCX");
   	                                                    			}
                                                                   	window.OCXobj.SetOcxMode(0);
                                                                       window.OCXobj.SetWndNum(1);//窗口个数
                                                                       window.OCXobj.SetPicDiskMinSize(1);
                                                                       //隐藏插件加载进度遮罩
//                                                                       $(".hikVideoLoading").hide();
                                                                       $(".objDiv_ggqy").remove();
                                                                       $("#PlayViewOCX").css({"width": "478px", "height": "312px"});
                                                                       window.OCXobj.StartTask_Preview_InWnd(previewXml, 0);
                                                               } catch(e) {
                                                               		$(".objDiv_ggqy").remove();
                                                               		$("#PlayViewOCX").hide();
                                                               		$("#spvViewOCX").hide();
                                                               		$(".ggqyVideoCon").append('<div class="objDiv_ggqy"><span class="noPlug"><font style="color: white;font-size: 14px">插件没有安装,请<a href="' + BASE_URL + '/monitor/macmonitormap/downloadWebVideo?type=8200"><font color="red">下载</font></a>安装</font><span></div>');
                                                               		return;
                                                               }
                                                       	} else if ("8700" == tmpData.HIKPLATNUM) {
                                                       		//8700平台视频点位
                                                       		$("#PlayViewOCX").css("display", "none");
                                                       		$("#hyPlayer").css("display", "none");
                                                       		$("#spvViewOCX").css("display", "block");
                                                       		var spvxOcx = document.getElementById("spvViewOCX");
                                                       		 
                                                       		try {
                                                       			//初始化调用海康8700平台视频基本配置参数
                                                       			initHik8700(spvxOcx);
                                                       			spvxOcx.MPV_SetPlayWndCount(1);
                                       						} catch(e) {
                                       							$(".objDiv_ggqy").remove();
                                       							$("#PlayViewOCX").hide();
                               	                           		$("#spvViewOCX").hide();
                                                            	$(".ggqyVideoCon").append('<div class="objDiv_ggqy"><span class="noPlug"><font style="color: white;font-size: 14px">插件没有安装,请<a href="' + BASE_URL + '/monitor/macmonitormap/downloadWebVideo?type=8700"><font color="red">下载</font></a>安装</font><span></div>');
                                       							return;
                                       						}
                                                       		
                                                       		$.ajax({
                                                       			type: "post",
                                                       			url: BASE_URL + "monitor/macvideo/loadEsVideoXml",
                                                       			dataType: "json",
                                                       			data: {"videoid": tmpData.VIDEOID},
                                                       			success: function(retData) {
                                                       				if (retData) {
                                                       					if ("" != retData.esVideoXml) {
                                                       						try {
                                                       							//隐藏插件加载进度遮罩
//                                                       							$(".hikVideoLoading").hide();
                                                       							$(".objDiv_ggqy").remove();
                                                       							$("#spvViewOCX").css({"width": "478px", "height": "312px"});
                                                       							var ret = spvxOcx.MPV_StartPreview(retData.esVideoXml);
                                                       						} catch(e) {
                                                       							$(".objDiv_ggqy").remove();
                                                       							$("#PlayViewOCX").hide();
                                               	                           		$("#spvViewOCX").hide();
                                                                            	$(".ggqyVideoCon").append('<div class="objDiv_ggqy"><span class="noPlug"><font style="color: white;font-size: 14px">插件没有安装,请<a href="' + BASE_URL + '/monitor/macmonitormap/downloadWebVideo?type=8700"><font color="red">下载</font></a>安装</font><span></div>');
                                                       							return;
                                                       						}
                                                       					} else {
                                                       						parent.toast("系统繁忙，请稍后再试！");
                                                       					}
                                                       				}
                                                       			},
                                                       			error: function(err) {
                                                       				parent.toast("系统繁忙，请稍后再试！");
                                                       			}
                                                       		});
                                                       		
                                                       	} else if ("HY" == curVideoType) {
                                                    		//接入怀业平台视频
                                                    		$("#PlayViewOCX, #spvViewOCX").css("display", "none");
                                                    		$("#hyPlayer").css("display", "block");
                                                    		
                                                    		try {
                                                    			jQuery.support.cors = true;
                                                    			var option = {
                                                    					id: "hyPlayer",
                                                    					height: "100%",
                                                    					width: "100%",
                                                    					classid: "clsid:210468B6-80D3-4CD0-921E-1AA99B8EB5AD"
                                                    					//codebase:"../UMP_OCX_V200R002B24(1,0,1,4).cab#version=1,0,0,4"
                                                    			};
                                                    			
                                                    			if (!window.myOcxMsg) {
                                                    				window.myOcxMsg = new initSDK(); 
                                                    				window.myOcxMsg._init_(option);
                                                    			}
                                                    			
                                                    			var ranHyName = hyRanUname(8, 2);
                                                    			var loginData = {
                                                    					SeqNo:7,  
                                                    					strUserID: "admin" + ranHyName,
                                                    					strUserName: "admin" + ranHyName,  
                                                    					strServerIP: videoData[0].IPADDR,
                                                    					nServerPort: parseInt(videoData[0].HYPLAYPORT),  
                                                    					success: function(data) {
                                                    						$.hy_log("登录成功"+JSON2.stringify(data));
                                                    						$(".objDiv").remove();
                                                    						
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
                                                    				 		
                                                    				 		mbedeviceShowObj.serviceUrl.strDomainCode = videoData[0].STRDOMAINCODE;
                                                    		 				mbedeviceShowObj.serviceUrl.strDeviceCode = videoData[0].STRDEVICECODE;
                                                    		 				mbedeviceShowObj.serviceUrl.strChannelCode = videoData[0].STRCHANNELCODE;
                                                    		 				mbedeviceShowObj.serviceUrl.strStreamCode = videoData[0].STRSTREAMCODE;
                                                    				 		mbedeviceShowlist.push(mbedeviceShowObj);
                                                    	//			 		alert(JSON.stringify(mbedeviceShowlist));
                                                    				 		//登录播放器
                                                    				 		var initParam = {
                                                    				 				id: "hyPlayer",
                                                    				 				width: "100%",
                                                    				 				height: "100%",
                                                    				 				classid: "clsid:210468B6-80D3-4CD0-921E-1AA99B8EB5AD",
                                                    				 				ShowBarFullBtn: true,
                                                    				 				ShowPlayBar: true,
                                                    				 				ShowProgressBar: true,
                                                    				 				ShowAudioBar: true,
                                                    				 				ShowPlayPauseBtn:true,	
                                                    				 				ShowStretchBtn: true,
                                                    				 				ShowLayoutBtn: true
                                                    				 		};
                                                    				 		
                                                    				 		window.lastHyPlayer = window.myOcxMsg._playinit_("hyPlayer", $.extend({}, initParam, {id: "hyPlayer"}));
                                                    				 		window.lastHyPlayer.ShowBarFullBtn(1);
                                                    				 		
                                                    				 		var playParam = {
                                                    				 		    SeqNo: 5,
                                                    				 		    play: window.lastHyPlayer,
                                                    				 		    list: mbedeviceShowlist,
                                                    				 		    success: function(res){},
                                                    				 		    error: function(data) {
                                                    				 		    	$.hy_log("失败"+JSON2.stringify(data))
                                                    				 		    }
                                                    				 		};
                                                    				 		window.myOcxMsg.playliveIpc(playParam);
                                                    					},
                                                    					error:function(data) {
                                                    						$.hy_log("登录失败"+JSON2.stringify(data));
                                                    						
                                                    						if(data.nResultCode == "1720200002"){}
                                                    					},
                                                    					EventHandle:function(eventCode, errCode, data){
                                                    						$.hy_log(eventCode+"事件通知"+JSON2.stringify(data));
                                                    					}
                                                    			};
                                                    			
                                                    			window.myOcxMsg.login(loginData); 
                                                    		} catch(e) {
                                                    			//未安装怀业ocx插件时的警告
                                                    			$(".objDiv_ggqy").remove();
                               	                           		$("#hyPlayer").hide();
                                                            	$(".ggqyVideoCon").append('<div class="objDiv"><span class="noPlug"><font style="color: white;font-size: 14px">插件没有安装,请<a href="'+BASE_URL+'/monitor/macmonitormap/downloadWebVideo?type=hy&filename=HYMBEClient_Setup"><font color="red">下载</font></a>安装</font><span></div>');
                                                    	 		return;
                                                    		}
                                                    	} else if ("NVR" == curVideoType) {
                                                    		//直接接入NVR设备视频
                                                    	}
                                                       }
                                                    });
                   	                           	
//                   	                              try {
//                   	                                  var curIndexcode = "";
//                   	                                  if ("龙岗大街德宝路北向南" == tmpData.PTNAME) {
//                   	                                      curIndexcode = "17031608001310010755";
//                   	                                  } else if ("站前大街旭日路北向南" == tmpData.PTNAME) {
//                   	                                      curIndexcode = "17031608001310016892";
//                   	                                  } else if ("超凡大街旭日路北向南" == tmpData.PTNAME) {
//                   	                                      curIndexcode = "17031608001310015496";
//                   	                                  }
   //
////                   	                                  if (window.OCXobj) {
////                   	                                      window.OCXobj.Destroy();
////                   	                                  }
//                   	                                  window.OCXobj = document.getElementById("PlayViewOCX");
//                   	                                  window.OCXobj.SetOcxMode(0);
//                   	                                  window.OCXobj.SetWndNum(1);//窗口个数
////                   	              		            				    window.OCXobj.SetCapturParam("C:\\pic",0);//图片保存路径，格式
//                   	                                  window.OCXobj.SetPicDiskMinSize(1);
//                   	                                  var previewXml = "<?xml version='1.0' encoding='UTF-8'?>" +
//                   	                                      "<Message>" +
//                   	                                      "<Camera>" +
//                   	                                      "<IndexCode>" + curIndexcode + "</IndexCode>" +
//                   	                                      "</Camera>" +
//                   	                                      "<Dev regtype='6' devtype='10001'></Dev>" +
//                   	                                      "<Vag IP='218.21.217.122' Port='7302' />" +
//                   	                                      "<Media Protocol='0' Stream='0'>" +
//                   	                                      "<Vtdu IP='218.21.217.122' Port='554' />" +
//                   	                                      "</Media>" +
//                   	                                      "<Privilege Priority='1' Code='15' />" +
//                   	                                      "<Option>" +
//                   	                                      "<Talk>1</Talk>" +
//                   	                                      "<PreviewType>0</PreviewType>" +
//                   	                                      "</Option>" +
//                   	                                      "</Message>";
//                   	                                  window.OCXobj.StartTask_Preview_InWnd(previewXml, 0);
//                   	                              } catch(e) {
//                   	                              	$(".objDiv").remove();
//                   	                           		$(".ggqyVideoCon").append('<div class="objDiv"><span class="noPlug"><font style="color: white;font-size: 14px">插件没有安装,请<a href="'+BASE_URL+'/monitor/macmonitormap/downloadWebVideo?type=8200"><font color="red">下载</font></a>安装</font><span></div>');
//                   	                                  return;
//                   	                              }
                   	                          };
                   	                          var tmpPt = new BMap.Point(tmpData.LONGITUDE, tmpData.LATITUDE);
                   	                          var tmpMarker = new BMap.Marker(tmpPt, {
                   	                              "title": tmpData.VIDEONAME,
                   	                              "icon": new BMap.Icon(BASE_URL + markIconUrl, new BMap.Size(42, 56))
                   	                          });
                   	                          tmpMarker.enableMassClear();

                   	                          //将点位存储至map集合工具类中
                   	                          window.curEntAndMatlsDic.put(tmpData.VIDEOID, {
                   	                              "data": tmpData,
                   	                              "marker": tmpMarker,
                   	                              "click": function() {
                   	                            	  
                   	                            	//判断点位是否在当前视野内
                   	                                var bound=window.map.getBounds();//地图可视区域
                   	                                if(bound.containsPoint(tmpPt)==false){
                   	                                	window.map.panTo(tmpPt);
                   	                                }
                   	                              	
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
                   	                                      markClkCb(tmpData);
                   	                                  });

                   	                                  //infoBox关闭时执行的操作
                   	                                  infoBox.addEventListener("close", function (e) {
                   	                                      //取消marker的跳动效果
                   	                                      tmpMarker.setAnimation(null);
                   	                                  });
                   	                                  infoBox.open(tmpMarker);   //图片加载完毕重绘infowindow
                   	                              }
                   	                          });

                   	                          //定义点位点击触发事件
                   	                          tmpMarker.addEventListener("click", function() {
                   	                              window.curEntAndMatlsDic.get(tmpData.VIDEOID).click();
                   	                          });

                   	                          //将点位添加至地图
                   	                          window.map.addOverlay(tmpMarker);
                   	                          
                   	                          if (0 == index) {
                   	              					window.map.centerAndZoom(tmpPt, 15);
                   	              			  }
                   	                      });

                   	                      //为企业监管列表每一行绑定GIS弹窗事件
                   	                      $tbody.find("tr").off("click").on("click", function() {
                   	                          window.curEntAndMatlsDic.get($(this).find(".resName").attr("data-resId")).click();
                   	                      });
                   	                  }
        	}
        }
    });	
//              17012306001310011350  17031608001310010755 17031608001310016892 17031608001310015496 17031608001310011853 17110505001310014358
}

//大气环境类点击加载及联动
function initDqhjMapPts() {
	//隐藏重大危险源、应急资源等饼状图
	$(".infoRight").hide();

	//默认清除地图上历史覆盖物
	window.map.clearOverlays();
	
	//查询最新的空气检测站点位数据
	$.ajax({
        type: "post",
        url: BASE_URL + "epi/epistation/loadAllGasStationList",
        data: {"stationName": $("#hjjg").find(".searchBox").val()},
        success: function (retData) {
//        	console.log(retData);
        	if (retData) {
        		//添加区域覆盖物
        		addCenterCityPoly(window.map);
        		
        		if (0 < retData.reStationBaseList.length) {
            		var $tbody = $("#dqhj").find("tbody");
            	    $tbody.empty();
            	    
            	   var dqhjData = [];
            	   var staDetList = JSON.parse(retData.resultAirArrStr);
            	   _.map(retData.reStationBaseList, function(tmpSta, index) {
            		   var dqhjObj = {},
            		   	   curStaDet = (_.where(staDetList, {"siteCode": tmpSta.SITECODE}))[0];
            		   dqhjObj.ptId = tmpSta.STATIONID;
            		   dqhjObj.name = tmpSta.SITENAME;
            		   dqhjObj.lng = tmpSta.LONGITUDE;
            		   dqhjObj.lat = tmpSta.LATITUDE;
            		   dqhjObj.aqi = curStaDet.aqi || null;
            		   dqhjObj.lvl = curStaDet.aqiType || null;
            		   dqhjObj.time = curStaDet.monitorTime || null;
            		   dqhjObj.tem = curStaDet.temp || null;
            		   dqhjObj.hum = curStaDet.hum || null;
            		   dqhjObj.pm25 = curStaDet.pm2_5 || null;
            		   dqhjObj.pm10 = curStaDet.pm10 || null;
            		   dqhjObj.so2 = curStaDet.so2 || null;
            		   dqhjObj.no2 = curStaDet.no2 || null;
            		   dqhjObj.co = curStaDet.co || null;
            		   dqhjObj.o3 = curStaDet.o3 || null;
            		   dqhjObj.majorpoll = curStaDet.pollutant || null;
            		   dqhjData.push(dqhjObj);
            	   });
            	   
            	   dqhjData = _.sortBy(dqhjData, function(num){return parseInt(num.aqi);});
//            	   {"rank": "1", "ptId": "29cca4ffba9f4954a96f6cb46b0bfeb7", "name": "达拉特经五路监测站", "lng": "110.035767", "lat": "40.383964",
//    	                 "aqi": 20, "lvl": "优", "time": getFormatDateByLong(_.now(), "yyyy-MM-dd hh:mm:ss"),
//    	                 "tem": "10", "hum": "33", "pm25": "12", "pm10": "60", "so2": "120",
//    	                 "no2": "170", "co": "0.295", "o3": "490", "majorpoll": "6"}
                    clearHistorys();
            		
            		_.map(dqhjData, function(tmpData, index) {
            			$tbody.append("<tr>" +
            					"<td>" + (index + 1) + "</td>" +
            					"<td class='resName' data-resId='" + tmpData.ptId + "'>" + tmpData.name + "</td>" +
            					"<td>" + tmpData.aqi + "</td>" +
            					"</tr>");
            				//获取该企业所有的风险总数
//                        var curEntDssCnts = _.where(retData, {"BUSINESSINFOID": tmpData.BUSINESSINFOID}).length;
            			var tmpMarkIcon = null, tmpWinCon = null;
            			if (0 <= tmpData.aqi && 50 > tmpData.aqi) {
                            tmpMarkIcon = new BMap.Icon(BASE_URL + "images/portal/icon_gisDqhj_1.png", new BMap.Size(42, 56));
                        } else if (50 <= tmpData.aqi && 100 > tmpData.aqi) {
                        	tmpMarkIcon = new BMap.Icon(BASE_URL + "images/portal/icon_gisDqhj_2.png", new BMap.Size(42, 56));
                        } else if (100 <= tmpData.aqi && 150 > tmpData.aqi) {
                        	tmpMarkIcon = new BMap.Icon(BASE_URL + "images/portal/icon_gisDqhj_3.png", new BMap.Size(42, 56));
                        } else if (150 <= tmpData.aqi && 200 > tmpData.aqi) {
                        	tmpMarkIcon = new BMap.Icon(BASE_URL + "images/portal/icon_gisDqhj_4.png", new BMap.Size(42, 56));
                        } else if (200 <= tmpData.aqi && 300 > tmpData.aqi) {
                        	tmpMarkIcon = new BMap.Icon(BASE_URL + "images/portal/icon_gisDqhj_5.png", new BMap.Size(42, 56));
                        } else if (300 <= tmpData.aqi && 500 >= tmpData.aqi) {
                        	tmpMarkIcon = new BMap.Icon(BASE_URL + "images/portal/icon_gisDqhj_6.png", new BMap.Size(42, 56));
                        } else {
                        	tmpMarkIcon = new BMap.Icon(BASE_URL + "images/portal/icon_gisDqhj_0.png", new BMap.Size(42, 56));
                        }

            				var dqhjWinTpt = _.template($("#dqhjPopWinTpt").html());
            				tmpWinCon = dqhjWinTpt(tmpData);

            				var tmpPt = new BMap.Point(tmpData.lng, tmpData.lat);
            				var tmpMarker = new BMap.Marker(tmpPt, {
            					"title": tmpData.name,
            					"icon": tmpMarkIcon
            				});
            				tmpMarker.enableMassClear();

            				//将点位存储至map集合工具类中
            				window.curEntAndMatlsDic.put(tmpData.ptId, {
            					"data": tmpData,
            					"marker": tmpMarker,
            					"click": function() {
            						
            						//判断点位是否在当前视野内
                                    var bound=window.map.getBounds();//地图可视区域
                                    if(bound.containsPoint(tmpPt)==false){
                                    	window.map.panTo(tmpPt);
                                    }
            						
            						var infoBox = new BMapLib.InfoBox(window.map, tmpWinCon, {
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
            						infoBox.addEventListener("open", function(e) {});

            						//infoBox关闭时执行的操作
            						infoBox.addEventListener("close", function (e) {
            							//取消marker的跳动效果
            							tmpMarker.setAnimation(null);
            							//释放视频预览插件空间
//            							if (window.OCXobj && $.isFunction(window.OCXobj.Destroy)) {
//            								window.OCXobj.Destroy();
//            							}
            						});
            						infoBox.open(tmpMarker);   //图片加载完毕重绘infowindow
            					}
            				});

            				//定义点位点击触发事件
            				tmpMarker.addEventListener("click", function () {
            					window.curEntAndMatlsDic.get(tmpData.ptId).click();
            				});

            				//将点位添加至地图
            				window.map.addOverlay(tmpMarker);
            				
            				
            				if (0 == index) {
            					window.map.centerAndZoom(tmpPt, 15);
            				}
            		});

            		//为企业监管列表每一行绑定GIS弹窗事件
            		$tbody.find("tr").off("click").on("click", function () {
            			window.curEntAndMatlsDic.get($(this).find(".resName").attr("data-resId")).click();
            		});
            	}
        	}
        }
	});
}

//水环境类点击加载及联动
function initShjMapPts() {
	//隐藏重大危险源、应急资源等饼状图
	$(".infoRight").hide();

	//默认清除地图上历史覆盖物
	window.map.clearOverlays();
	addCenterCityPoly(window.map);
	
    var $tbody = $("#shj").find("tbody");
    $tbody.empty();

    var shjData = [
	                {"rank": "1", "ptId":"ba2a61e716d94fa0955cad36d8db77b1", "name": "临邑水质断面1", "lng":"116.872416", "lat":"37.314173",
	                 "szlvl":"I类","time":getFormatDateByLong(_.now(), "yyyy-MM-dd hh:mm:ss"),
	                 "watertemp":"20.03", "zhuodu":"11.99", "diandaolv":"581.12", "zongyoujitan":"1.76",
	                 "gmsjzhishu":"0.00", "cod": "9.34", "andan":"0.1", "zonglin":"0.011",
	                 "zongdan":"0.401", "rongjiedan":"7.12", "ph":"7.75", "majorpoll": "1"
	                },
	                {"rank": "2", "ptId":"19a4c44763b94ae3a2cb3c9d8d0b81b6", "name": "临邑水质断面2", "lng":"116.874698", "lat":"37.313871",
	                	"szlvl":"Ⅱ类","time":getFormatDateByLong(_.now(), "yyyy-MM-dd hh:mm:ss"),
	                	"watertemp":"20.03", "zhuodu":"11.99", "diandaolv":"581.12", "zongyoujitan":"1.76",
	                	"gmsjzhishu":"0.00", "cod": "9.34", "andan":"0.1", "zonglin":"0.011",
	                	"zongdan":"0.401", "rongjiedan":"7.12", "ph":"7.75", "majorpoll": "2"
	                }
//	                {"rank": "3", "ptId":"3144fa37c8414a71a665ddac0146be3c", "name": "站前大街南", "lng":"116.86169", "lat":"37.317832",
//	                	"szlvl":"Ⅲ类","time":getFormatDateByLong(_.now(), "yyyy-MM-dd hh:mm:ss"),
//	                	"watertemp":"20.03", "zhuodu":"11.99", "diandaolv":"581.12", "zongyoujitan":"1.76",
//	                	"gmsjzhishu":"0.00", "cod": "9.34", "andan":"0.1", "zonglin":"0.011",
//	                	"zongdan":"0.401", "rongjiedan":"7.12", "ph":"7.75", "majorpoll": "3"
//	                },
//	                {"rank": "4", "ptId":"1458d263ce404ebfb9b0d31938142709", "name": "朝阳路北", "lng":"116.851647", "lat":"37.316774",
//	                	"szlvl":"Ⅳ类","time":getFormatDateByLong(_.now(), "yyyy-MM-dd hh:mm:ss"),
//	                	"watertemp":"20.03", "zhuodu":"11.99", "diandaolv":"581.12", "zongyoujitan":"1.76",
//	                	"gmsjzhishu":"0.00", "cod": "9.34", "andan":"0.1", "zonglin":"0.011",
//	                	"zongdan":"0.401", "rongjiedan":"7.12", "ph":"7.75", "majorpoll": "4"
//	                },
//	                {"rank": "5", "ptId":"d2c2f686d99748ed833817643dc112d5", "name": "王超凡村", "lng":"116.866721", "lat":"37.30709",
//	                	"szlvl":"Ⅴ类","time":getFormatDateByLong(_.now(), "yyyy-MM-dd hh:mm:ss"),
//	                	"watertemp":"20.03", "zhuodu":"11.99", "diandaolv":"581.12", "zongyoujitan":"1.76",
//	                	"gmsjzhishu":"0.00", "cod": "9.34", "andan":"0.1", "zonglin":"0.011",
//	                	"zongdan":"0.401", "rongjiedan":"7.12", "ph":"7.75", "majorpoll": "5"
//	                },
//	                {"rank": "6", "ptId":"78db0b51f91746548c1215fbdc40364c", "name": "槐乡公园", "lng":"116.884538", "lat":"37.303305",
//	                	"szlvl":"劣Ⅴ类","time":getFormatDateByLong(_.now(), "yyyy-MM-dd hh:mm:ss"),
//	                	"watertemp":"20.03", "zhuodu":"11.99", "diandaolv":"581.12", "zongyoujitan":"1.76",
//	                	"gmsjzhishu":"0.00", "cod": "9.34", "andan":"0.1", "zonglin":"0.011",
//	                	"zongdan":"0.401", "rongjiedan":"7.12", "ph":"7.75", "majorpoll": "6"
//	                }
	              ];
	var srchPtName = $("#shj").find(".searchBox").val();
	if (srchPtName && "" != srchPtName) {
		shjData = _.filter(shjData, function(tmpArea){return -1 < tmpArea.name.indexOf(srchPtName);});
	}




    if (0 < shjData.length) {
    	//定义存储所有企业和相关应急物资集合类

        clearHistorys();

		_.map(shjData, function(tmpData, index) {
			$tbody.append("<tr>" +
					"<td>" + tmpData.rank + "</td>" +
					"<td class='resName' data-resId='" + tmpData.ptId + "'>" + tmpData.name + "</td>" +
					"<td>" + tmpData.szlvl + "</td>" +
					"</tr>");
				//获取该企业所有的风险总数
//            var curEntDssCnts = _.where(retData, {"BUSINESSINFOID": tmpData.BUSINESSINFOID}).length;
			var tmpMarkIcon = null, tmpWinCon = null;
			if ("I类" == tmpData.szlvl) {
                tmpMarkIcon = new BMap.Icon(BASE_URL + "images/portal/icon_gisShj_1.png", new BMap.Size(42, 56));
            } else if ("Ⅱ类" == tmpData.szlvl) {
            	tmpMarkIcon = new BMap.Icon(BASE_URL + "images/portal/icon_gisShj_2.png", new BMap.Size(42, 56));
            } else if ("Ⅲ类" == tmpData.szlvl) {
            	tmpMarkIcon = new BMap.Icon(BASE_URL + "images/portal/icon_gisShj_3.png", new BMap.Size(42, 56));
            } else if ("Ⅳ类" == tmpData.szlvl) {
            	tmpMarkIcon = new BMap.Icon(BASE_URL + "images/portal/icon_gisShj_4.png", new BMap.Size(42, 56));
            } else if ("Ⅴ类" == tmpData.szlvl) {
            	tmpMarkIcon = new BMap.Icon(BASE_URL + "images/portal/icon_gisShj_5.png", new BMap.Size(42, 56));
            } else if ("劣Ⅴ类" == tmpData.szlvl) {
            	tmpMarkIcon = new BMap.Icon(BASE_URL + "images/portal/icon_gisShj_6.png", new BMap.Size(42, 56));
            } else {
            	tmpMarkIcon = new BMap.Icon(BASE_URL + "images/portal/icon_gisShj_0.png", new BMap.Size(42, 56));
            }

				var shjWinTpt = _.template($("#shjPopWinTpt").html());
				tmpWinCon = shjWinTpt(tmpData);

				var tmpPt = new BMap.Point(tmpData.lng, tmpData.lat);
				var tmpMarker = new BMap.Marker(tmpPt, {
					"title": tmpData.name,
					"icon": tmpMarkIcon
				});
				tmpMarker.enableMassClear();

				//将点位存储至map集合工具类中
				window.curEntAndMatlsDic.put(tmpData.ptId, {
					"data": tmpData,
					"marker": tmpMarker,
					"click": function() {
						
						//判断点位是否在当前视野内
                        var bound=window.map.getBounds();//地图可视区域
                        if(bound.containsPoint(tmpPt)==false){
                        	window.map.panTo(tmpPt);
                        }
						
						var infoBox = new BMapLib.InfoBox(window.map, tmpWinCon, {
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
						infoBox.addEventListener("open", function(e) {});

						//infoBox关闭时执行的操作
						infoBox.addEventListener("close", function (e) {
							//取消marker的跳动效果
							tmpMarker.setAnimation(null);
							//释放视频预览插件空间
//							if (window.OCXobj && $.isFunction(window.OCXobj.Destroy)) {
//								window.OCXobj.Destroy();
//							}
						});
						infoBox.open(tmpMarker);   //图片加载完毕重绘infowindow
					}
				});

				//定义点位点击触发事件
				tmpMarker.addEventListener("click", function () {
					window.curEntAndMatlsDic.get(tmpData.ptId).click();
				});

				//将点位添加至地图
				window.map.addOverlay(tmpMarker);
				if (0 == index) {
					window.map.centerAndZoom(tmpPt, 15);
				}
		});

		//为企业监管列表每一行绑定GIS弹窗事件
		$tbody.find("tr").off("click").on("click", function () {
			window.curEntAndMatlsDic.get($(this).find(".resName").attr("data-resId")).click();
		});
    }
}


function clearHistorys() {
    if(window.removeOverlays){
        window.removeOverlays = [];
    }

    //定义存储所有企业和相关应急物资集合类
    if (window.curEntAndMatlsDic) {
        window.curEntAndMatlsDic.clear();
    } else {
        window.curEntAndMatlsDic = new MapUtil();
    }
}


//污染源类点击加载及联动
function initWryMapPts() {
	//隐藏重大危险源、应急资源等饼状图
	$(".infoRight").hide();

	//默认清除地图上历史覆盖物
	window.map.clearOverlays();
	
	//查询最新的污染源检测站点位数据
	$.ajax({
        type: "post",
        url: BASE_URL + "epi/epistation/loadAllWryStationList",
        data: {"stationName": $("#hjjg").find(".searchBox").val()},
        success: function (retData){
        	if (retData) {
        		//添加区域覆盖物
        		addCenterCityPoly(window.map);
        		
        		if (0 < retData.reStationBaseList.length) {
        			var $tbody = $("#wry").find("tbody");
	        		$tbody.empty();
		        	var staDetList = JSON.parse(retData.resultWryArrStr);
		        	console.log(staDetList);
	
	                clearHistorys();
		        	
		        	_.map(retData.reStationBaseList, function(tmpData, index) {
			        		var curStaDet = (_.where(staDetList, {"DEVICECODE": tmpData.SITECODE}))[0];
			    			$tbody.append("<tr>" +
			    					"<td>" + (parseInt(index) + 1) + "</td>" +
			    					"<td class='resName' data-resId='" + tmpData.STATIONID + "'>" + tmpData.SITENAME + "</td>" +
	//		    					"<td>" + curStaDet.RECTIME.substring(0, curStaDet.RECTIME.indexOf("-") + 6) + "</td>" +
			    					"</tr>");
	//		    				//获取该企业所有的风险总数
	//		//               var curEntDssCnts = _.where(retData, {"BUSINESSINFOID": tmpData.BUSINESSINFOID}).length;
	//		    			var pollFactor = tmpData.POLLUTIONFACTOR;
			    			var tmpMarkIcon = new BMap.Icon(BASE_URL + "images/portal/icon_gisWry.png", new BMap.Size(42, 56));
			    			var wryWinTpt = _.template($("#wryPopWinTpt").html());
			    			curStaDet.POLLFACTOR = tmpData.POLLUTIONFACTOR;
			    			curStaDet.SITENAME = tmpData.SITENAME;
			    			console.log(curStaDet);
		    				var tmpWinCon = wryWinTpt(curStaDet);
		    				var tmpPt = new BMap.Point(tmpData.LONGITUDE, tmpData.LATITUDE);
		    				var tmpMarker = new BMap.Marker(tmpPt, {
		    					"title": tmpData.SITENAME,
		    					"icon": tmpMarkIcon
		    				});
		    				tmpMarker.enableMassClear();
		
		    				//将点位存储至map集合工具类中
		    				window.curEntAndMatlsDic.put(tmpData.STATIONID, {
		    					"data": tmpData,
		    					"marker": tmpMarker,
		    					"click": function() {
		    						
		    						//判断点位是否在当前视野内
	                                var bound=window.map.getBounds();//地图可视区域
	                                if(bound.containsPoint(tmpPt)==false){
	                                	window.map.panTo(tmpPt);
	                                }
		    						
		    						var infoBox = new BMapLib.InfoBox(window.map, tmpWinCon, {
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
		    						infoBox.addEventListener("open", function(e) {});
		
		    						//infoBox关闭时执行的操作
		    						infoBox.addEventListener("close", function (e) {
		    							//取消marker的跳动效果
		    							tmpMarker.setAnimation(null);
		    						});
		    						infoBox.open(tmpMarker);   //图片加载完毕重绘infowindow
		    					}
		    				});
		
		    				//定义点位点击触发事件
		    				tmpMarker.addEventListener("click", function () {
		    					window.curEntAndMatlsDic.get(tmpData.STATIONID).click();
		    				});
		
		    				//将点位添加至地图
		    				window.map.addOverlay(tmpMarker);
		    				if (0 == index) {
		    					window.map.centerAndZoom(tmpPt, 15);
		    				}
		        	});
		        	
		        	//为企业监管列表每一行绑定GIS弹窗事件
		    		$tbody.find("tr").off("click").on("click", function () {
		    			window.curEntAndMatlsDic.get($(this).find(".resName").attr("data-resId")).click();
		    		});
        		}
        	}
        },
        error: function (err) {
            toast("系统繁忙!");
        }
	});
}

function initYqssMapPts(){
	//默认清除地图上历史覆盖物
	window.map.clearOverlays();
	clearHistorys();

	$(".infoRight").show();
    
    //隐藏之前其它饼图,显示应急资源种类切图
    $("#hidCountDiv, #zdwxyCntDiv, #dangerCountDiv, #entCountDiv, " +
      "#hidLevelCountDiv, #hidStateCountDiv, #qyjgCntDiv, #yjzyCntDiv, #emsResCntDiv").hide();
    $("#publicsCnt").text("数量：0个");
    $("#publicsCntPie").empty();
    $("#yqssCntDiv, #publicsCntDiv").show();
    
    var $yqss = $("#yqss"), resTypeParaArr = [];

    //园区设施类型参数
    if (0 < $yqss.find(".activeyyys").length) {
        resTypeParaArr.push("1");//饮用用水
    }
    if (0 < $yqss.find(".activexfgy").length) {
        resTypeParaArr.push("2");//消防工业用水
    }
    if (0 < $yqss.find(".activedlsb").length) {
        resTypeParaArr.push("3");//电力设备
    }
    if (0 < $yqss.find(".activezqgd").length) {
        resTypeParaArr.push("4");//蒸汽管道
    }
    if (0 < $yqss.find(".activewscl").length) {
        resTypeParaArr.push("5");//污水处理
    }
    if (0 < $yqss.find(".activeljsj").length) {
        resTypeParaArr.push("6");//垃圾收集
    }
    if (0 < $yqss.find(".activegygl").length) {
        resTypeParaArr.push("7");//公用管廊
    }
    if (0 < $yqss.find(".activeyspw").length) {
        resTypeParaArr.push("8");//雨水排污管道
    }
    if (0 < $yqss.find(".activeheda").length) {
        resTypeParaArr.push("9");//河道
    }

    //查询所有应急资源列表信息并在地图上加载相应点位
    $.ajax({
        type: "post",
        url: BASE_URL + "publics/portalgispub/loadPublicResData",
        data: {
            "pubType": resTypeParaArr.join(",")
//            "entname": $yjzy.find(".searchBox").val()
        },
        success: function (retData) {
            if (retData) {
//                addCenterCityPoly(window.map);

                //清空原有所有危险源列表数据
                var $tbody = $yqss.find("tbody");
                $tbody.empty();
             
                //应急资源表格统计数据
                var allpublicsCnt = 0,
                	yyysCnt = 0,
                	xfgyCnt = 0,
                	dlsbCnt = 0,
                	zqgdCnt = 0,
	                wsclCnt = 0,
	                ljsjCnt = 0,
	                gyglCnt = 0,
	                yspwCnt = 0,
	                hedaCnt = 0;
                
                //遍历生成表格数据并加载GIS点位
                if (0 < retData.pubResList.length) {
//                	console.log(retData.emsResList);
//                	console.log(retData.emsResCntPieData);
                    $("#yqssTotalCnt").text("数量：" + retData.pubResList.length + "个");

                    //加载应急资源饼图等图表统计
                	allpublicsCnt = retData.pubResList.length;
                	yyysCnt = _.where(retData.pubResList, {"pubType": "饮用用水"}).length;
                	xfgyCnt = _.where(retData.pubResList, {"pubType": "消防工业用水"}).length;
                	dlsbCnt = _.where(retData.pubResList, {"pubType": "电力设备"}).length;
                	zqgdCnt = _.where(retData.pubResList, {"pubType": "蒸汽管道"}).length;
                	wsclCnt = _.where(retData.pubResList, {"pubType": "污水处理"}).length;
                	ljsjCnt = _.where(retData.pubResList, {"pubType": "垃圾收集"}).length;
                	gyglCnt = _.where(retData.pubResList, {"pubType": "公用管廊"}).length;
                    yspwCnt = _.where(retData.pubResList, {"pubType": "雨水排污管道"}).length;
                    hedaCnt = _.where(retData.pubResList, {"pubType": "河道"}).length;

                    if (window.mapEchartsDic) {
                        window.mapEchartsDic.clear();
                    } else {
                        window.mapEchartsDic = new MapUtil();
                    }

                    var publicsCntPie = window.mapEchartsDic.get("publicsCntPie");
                    if (!publicsCntPie) {
                    	publicsCntPie = echarts.init(document.getElementById("publicsCntPie"));
                        window.mapEchartsDic.put("publicsCntPie", publicsCntPie);
                    }

                    var publicsCntOption = {
                        tooltip: {
                            trigger: 'item',
                            formatter: "{a} <br/>{b} : {c} ({d}%)"
                        },
                        legend: {
                            orient: 'horizontal',
                            bottom: 'bottom',
                            data: _.pluck(retData.pubResCntPieData, "name"),
                            textStyle: {
                            	color: "#Fff"
                            }
                        },
                        series: [
                            {
                                name: '个数',
                                type: 'pie',
                                radius: '43%',
                                center: ['50%', '37%'],
                                data: retData.pubResCntPieData,
                                itemStyle: {
                                    emphasis: {
                                        shadowBlur: 10,
                                        shadowOffsetX: 0,
                                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                                    }
                                }
                            }
                        ],
                        color: ['#00BFFF','#FF3726','#FBBC05','#C4C4C4','#9013FE','#816D4C','#F5834C','#909674','#34A853']
                    };
                    publicsCntPie.setOption(publicsCntOption);
                    $("#publicsCnt").text("数量：" + allpublicsCnt + "个");
                    var flag = 0;
                    //遍历加载应急资源相关gis点位
                    var lineArrys = {};
                    var pubLineArr = [];
                    if (window.curEntAndMatlsDic) {
                        window.curEntAndMatlsDic.clear();
                    } else {
                        window.curEntAndMatlsDic = new MapUtil();
                    }
                    _.map(retData.pubResList, function (tmpData, index) {
                       
                        //分类各点位图标
                        var tmpMarkIcon = null, tmpWinCon = "", tmpPt = null, pubAddress = "" ;
                        if ("饮用用水" == tmpData.pubType) {
                            var pubWinTpt = _.template($("#yyysPopWinTpt").html());
                            tmpWinCon = pubWinTpt(tmpData);
                            pubAddress = tmpData.pubAddress;
                            lineArrys[tmpData.pubId] = tmpData.pubType;
                        } else if ("消防工业用水" == tmpData.pubType) {
                            var pubWinTpt = _.template($("#xfgyPopWinTpt").html());
                            tmpWinCon = pubWinTpt(tmpData);
                            pubAddress = tmpData.pubAddress;
                            lineArrys[tmpData.pubId] = tmpData.pubType;
                        } else if ("电力设备" == tmpData.pubType) {
                            tmpMarkIcon = new BMap.Icon(BASE_URL + "images/portal/icon_dianlishebei.png", new BMap.Size(42, 56));
                            var pubWinTpt = _.template($("#dlsbPopWinTpt").html());
                            tmpWinCon = pubWinTpt(tmpData);
                            tmpPt = new BMap.Point(tmpData.pubLng, tmpData.pubLat);
                        } else if ("蒸汽管道" == tmpData.pubType) {
                            var pubWinTpt = _.template($("#zqglPopWinTpt").html());
                            tmpWinCon = pubWinTpt(tmpData);
                            pubAddress = tmpData.pubAddress;
                            lineArrys[tmpData.pubId] = tmpData.pubType;
                        } else if ("污水处理" == tmpData.pubType) {
                            tmpMarkIcon = new BMap.Icon(BASE_URL + "images/portal/icon_wushuichuli.png", new BMap.Size(42, 56));
                            var pubWinTpt = _.template($("#wsclPopWinTpt").html());
                            tmpWinCon = pubWinTpt(tmpData);
                            tmpPt = new BMap.Point(tmpData.pubLng, tmpData.pubLat);
                        } else if ("垃圾收集" == tmpData.pubType) {
                            tmpMarkIcon = new BMap.Icon(BASE_URL + "images/portal/icon_lajishouji.png", new BMap.Size(42, 56));
                            var pubWinTpt = _.template($("#ljsjPopWinTpt").html());
                            tmpWinCon = pubWinTpt(tmpData);
                            tmpPt = new BMap.Point(tmpData.pubLng, tmpData.pubLat);
                        } else if ("公用管廊" == tmpData.pubType) {
                            var pubWinTpt = _.template($("#gyglPopWinTpt").html());
                            tmpWinCon = pubWinTpt(tmpData);
                            pubAddress = tmpData.pubAddress;
                            lineArrys[tmpData.pubId] = tmpData.pubType;
                        } else if ("雨水排污管道" == tmpData.pubType) {
                            var pubWinTpt = _.template($("#yspwPopWinTpt").html());
                            tmpWinCon = pubWinTpt(tmpData);
                            pubAddress = tmpData.pubAddress;
                            lineArrys[tmpData.pubId] = tmpData.pubType;
                        } else if ("河道" == tmpData.pubType) {
                            var resWinTpt = _.template($("#hedaPopWinTpt").html());
                            tmpWinCon = resWinTpt(tmpData);
                            pubAddress = tmpData.pubAddress;
                            lineArrys[tmpData.pubId] = tmpData.pubType;
                        } else {
                            tmpMarkIcon = new BMap.Icon(BASE_URL + "images/portal/icon_gisYjjg.png", new BMap.Size(42, 56));
                            tmpWinCon = "未知点位";
                        }
                        if(tmpPt == null && pubAddress == ""){
                        	$tbody.append("<tr>" +
                        			"<td class='pubType' data-pubType='tabIsNull'>" + tmpData.pubType + "</td>" +
                        			"<td class='resName' data-pubId='" + tmpData.pubId + "'>" + tmpData.pubName + "</td>" +
                        	"</tr>");
                        }else if((tmpPt != null && tmpPt.lng == null) && pubAddress == ""){     
                        	$tbody.append("<tr>" +
                        			"<td class='pubType' data-pubType='tabIsNull'>" + tmpData.pubType + "</td>" +
                        			"<td class='resName' data-pubId='" + tmpData.pubId + "'>" + tmpData.pubName + "</td>" +
                        	"</tr>");
                        } else {
                        	$tbody.append("<tr>" +
                        			"<td class='pubType' data-pubType='"+ tmpData.pubType +"'>" + tmpData.pubType + "</td>" +
                        			"<td class='resName' data-pubId='" + tmpData.pubId + "'>" + tmpData.pubName + "</td>" +
                        	"</tr>");
                        }
                        if(tmpPt != null && tmpPt.lng != null){                       	
                        	var tmpMarker = new BMap.Marker(tmpPt, {
                        		"title": tmpData.pubName,
                        		"icon": tmpMarkIcon
                        	});
                        	
                        	//允许清除覆盖物
                        	tmpMarker.enableMassClear();
                        	
                        	//将点位存储至map集合工具类中
                        	window.curEntAndMatlsDic.put(tmpData.pubId, {
                        		"data": tmpData,
                        		"marker": tmpMarker,
                        		"click": function (){
                        			
                        			var infoBox = new BMapLib.InfoBox(window.map, tmpWinCon, {
                        				boxStyle: {
                        					minWidth: "631",
                        					Height: "250",
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
                        				window.map.setCenter(tmpPt);
                        				openWindowScroll();
                        			});
                        			
                        			//infoBox关闭时执行的操作
                        			infoBox.addEventListener("close", function (e) {
                        				//取消marker的跳动效果
                        				tmpMarker.setAnimation(null);
                        			});
                        			
                        			infoBox.open(tmpMarker);   //图片加载完毕重绘infowindow
                        		}
                        	});
                        	
                        	//定义点位点击触发事件
                        	tmpMarker.addEventListener("click", function () {
                        		window.curEntAndMatlsDic.get(tmpData.pubId).click();
                        	});
                        	
                        	//将点位添加至地图
                        	window.map.addOverlay(tmpMarker);
                        	
                        	//默认选择第一个点位居中
                        	0 == flag && window.map.setCenter(tmpPt);
                        	flag=1;
                        }
                        
                        //画管道线
                        if(pubAddress && pubAddress != ""){
                        	var styleOptions;
                        	if("饮用用水" == tmpData.pubType){
                        		styleOptions = {
                        				strokeColor: "#00BFFF",
                            			strokeWeight: 2,       //边线的宽度，以像素为单位。
                						strokeOpacity: 1,    //边线透明度，取值范围0 - 1。
                						fillOpacity: 1,      //填充的透明度，取值范围0 - 1。
                						strokeStyle: 'solid', //边线的样式，solid或dashed。
                						enableClicking: true
                            	};
                        	} else if("消防工业用水" == tmpData.pubType){
                        		styleOptions = {
                        				strokeColor: "#FF3726",
                            			strokeWeight: 2,       //边线的宽度，以像素为单位。
                						strokeOpacity: 1,    //边线透明度，取值范围0 - 1。
                						fillOpacity: 1,      //填充的透明度，取值范围0 - 1。
                						strokeStyle: 'solid', //边线的样式，solid或dashed。
                						enableClicking: true
                            	};
                        	} else if("蒸汽管道" == tmpData.pubType){
                        		styleOptions = {
                        				strokeColor: "#C4C4C4",
                            			strokeWeight: 2,       //边线的宽度，以像素为单位。
                						strokeOpacity: 1,    //边线透明度，取值范围0 - 1。
                						fillOpacity: 1,      //填充的透明度，取值范围0 - 1。
                						strokeStyle: 'solid', //边线的样式，solid或dashed。
                						enableClicking: true
                            	};
                        	} else if("公用管廊" == tmpData.pubType){
                        		styleOptions = {
                        				strokeColor: "#F5834C",
                            			strokeWeight: 2,       //边线的宽度，以像素为单位。
                						strokeOpacity: 1,    //边线透明度，取值范围0 - 1。
                						fillOpacity: 1,      //填充的透明度，取值范围0 - 1。
                						strokeStyle: 'solid', //边线的样式，solid或dashed。
                						enableClicking: true
                            	};
                        	} else if("雨水排污管道" == tmpData.pubType){
                        		styleOptions = {
                        				strokeColor: "#909674",
                            			strokeWeight: 2,       //边线的宽度，以像素为单位。
                						strokeOpacity: 1,    //边线透明度，取值范围0 - 1。
                						fillOpacity: 1,      //填充的透明度，取值范围0 - 1。
                						strokeStyle: 'solid', //边线的样式，solid或dashed。
                						enableClicking: true
                            	};
                        	} else if("河道" == tmpData.pubType){
                        		styleOptions = {
                        				strokeColor: "#34A853",
                            			strokeWeight: 2,       //边线的宽度，以像素为单位。
                						strokeOpacity: 1,    //边线透明度，取值范围0 - 1。
                						fillOpacity: 1,      //填充的透明度，取值范围0 - 1。
                						strokeStyle: 'solid', //边线的样式，solid或dashed。
                						enableClicking: true
                            	};
                        	}
                        	lineTag = pubAddress.replace(/\\'/g, '"');
                    		var lineArrs = lineTag.split("-");
                    		$.each(lineArrs,function(i,line){
                    			if(line != null && line != ''){	
                    				var tmpPt;
                    				var jsonObj = JSON.parse(line);
                    				var jsonArr = [];
                    				var lineArr = [];
                    				for (var i = 0; i < jsonObj.length; i++) {
                    					jsonArr[i] = jsonObj[i];
                    					var point = new BMap.Point(jsonArr[i].lng, jsonArr[i].lat);
                    					lineArr.push(point);
                    					if(i == 0 ){
                    						tmpPt = new BMap.Point(jsonArr[i].lng, jsonArr[i].lat);
                    					}
                    				}
                    				
                    				var polyline = new BMap.Polyline(lineArr ,styleOptions);
                    				polyline.enableMassClear();
                                	//将点位存储至map集合工具类中
                					pubLineArr.push({"publId":tmpData.pubId,
                						"data": tmpData,
                						"polyline":polyline,
                						"click": function (){
                                			var infoBox = new BMapLib.InfoBox(window.map, tmpWinCon, {
                                				boxStyle: {
                                					minWidth: "631",
                                					Height: "150",
                                					marginBottom: "0px"
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
                                			//infobox打开时的回调事件
                                			infoBox.addEventListener("open", function (e) {
                                				for(var i in pubLineArr){
                                					if(pubLineArr[i].publId == tmpData.pubId){
                                						pubLineArr[i].polyline.setStrokeWeight(7);
                                					} else {
                                						pubLineArr[i].polyline.setStrokeOpacity(0.2);
                                					}
                                				}
                                				openWindowScroll();
                                			});
                                			
                                			//infoBox关闭时执行的操作
                                			infoBox.addEventListener("close", function (e) {
                                				for(var i in pubLineArr){
                                					if(pubLineArr[i].publId == tmpData.pubId){
                                						pubLineArr[i].polyline.setStrokeWeight(2);
                                					} else {
                                						pubLineArr[i].polyline.setStrokeOpacity(1);
                                					}
                                				}
                                			});
                                			//获取点击的经纬度
                            		        var lng = $("#publicsLng").val();
                            		        var lat = $("#publicsLat").val();
                            		        if(lng != "" && lng != null && lat != "" && lat != null ){
                            		        	tmpPt = new BMap.Point(lng, lat);
                            		        }
                            		        var pubMarker = new BMap.Marker(tmpPt, {
                            		        	"title": tmpData.pubName
                            		        });
                        		        	window.map.setCenter(tmpPt);
                        		        	infoBox.open(pubMarker);   //图片加载完毕重绘infowindow
                        		        	$("#publicsLng").val("");
                            		        $("#publicsLat").val("");
                                		}
                					});
                                	//定义点位点击触发事件
                                	polyline.addEventListener("click", function (e) {
                                		var lng = e.point.lng;//单击获取点击的经纬度
                        		        var lat =  e.point.lat;
                        		        $("#publicsLng").val(lng);
                        		        $("#publicsLat").val(lat);
                        		        var flags = 0;
                                		for(var i in pubLineArr){
                        					if(pubLineArr[i].publId == tmpData.pubId){
                        						if(flags != 0){
                        							return false;
                        						}
                        						pubLineArr[i].click();
                        						flags = 1;
                        					}
                        				}
                                	});
                                	window.map.addOverlay(polyline);
                    			}
                    		});
                        }
                    });
                    //为列表每一行绑定GIS弹窗事件
                    $tbody.find("tr").off("click").on("click", function () {
                    	var pubType = $(this).find(".pubType").attr("data-pubType")
                    	if(pubType == "电力设备" || pubType == "污水处理" || pubType == "垃圾收集"){
                    		window.curEntAndMatlsDic.get($(this).find(".resName").attr("data-pubId")).click();
                    	} else if(pubType == "tabIsNull"){
                    		parent.toast("未进行地图点位标注");
                    	} else {
                    		var flags = 0;
                    		for(var i in pubLineArr){
            					if(pubLineArr[i].publId == $(this).find(".resName").attr("data-pubId")){
            						if(flags != 0){
            							return false;
            						}
            						pubLineArr[i].click();
            						flags = 1;
            					}
            				}
                    	} 
                        return false;
                    });
                }
                
                //应急资源表格统计数据
                $("#yqssTotalCnt").text(allpublicsCnt + "个");
                $("#yqssYyysCnt").text(yyysCnt + "个");
                $("#yqssXfgyCnt").text(xfgyCnt + "个");
                $("#yqssDlsbCnt").text(dlsbCnt + "个");
                $("#yqssZqgdCnt").text(zqgdCnt + "个");
                $("#yqssWsclCnt").text(wsclCnt + "个");
                $("#yqssLjsjCnt").text(ljsjCnt + "个");
                $("#yqssGyglCnt").text(gyglCnt + "个");
                $("#yqssYspwCnt").text(yspwCnt + "个");
                $("#yqssHedaoCnt").text(hedaCnt + "个");
            }
        },
        error: function (err) {
            toast("系统繁忙!");
        }
    });
}
