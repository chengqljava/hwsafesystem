$(function () {
    //初始化地图
    window.map = initMap();
    //初始化事故列表
    initEventList(1);
    //初始化监听事件
    initListener();


});

//初始化监听事件
function initListener() {
    // 事故等级tab点击事件
    $('.accidentKind').on('click', 'li', function () {
        $('.accidentKind li').removeClass('selected');
        $(this).addClass('selected');
    })
    // 排序方式tab点击事件
    $('.order').on('click', 'li', function () {
        $('.order li').removeClass('selected');
        $(this).addClass('selected');
    })
    // 筛选条件展开关闭点击事件
    $('.close').on('click', function () {
        var state = $(this).data('state');
        if (state == '0') {
            $('.searchBox').css('height', 145);
            $(this).data('state', '1').css('color', '#00bfff');
            $('.accidentListInfo').css('height', 'calc( 100% - 210px )');
            scrollResize();
        }
        else {
            $('.searchBox').css('height', 40);
            $(this).data('state', '0').css('color', '#fff');
            $('.accidentListInfo').css('height', 'calc( 100% - 105px )')
            scrollResize();
        }
    });

    // 单个事故列表单击事件
    $('.accidentListInfo').on('click', '.accident', function () {
        $('.accidentListInfo .accident').removeClass('selected');
        $(this).addClass('selected');

        $('#eventListDiv').animate({left:-360},1000);
    })
    // 滚动条
    $('.accidentListInfo').niceScroll({
        cursorborder: "#4d86d6",
        cursorcolor: "#4d86d6",
        background: false,
        autohidemode: false
    }).show().resize();
    // 分页插件


    // 滚动条重新配置
    function scrollResize() {
        $('.accidentListInfo').niceScroll({
            cursorborder: "#4d86d6",
            cursorcolor: "#4d86d6",
            background: false,
            autohidemode: false
        }).resize();
    }

    $(window).resize(function() {
        $("#map").height($(window).height());
    });


}
//初始化地图
function initMap() {
    $("#map").height($(window).height());
    //地图本地根据IP地址定位以及添加标尺(禁止点击地图上的地点弹出百度详情)
    var map = new BMap.Map("map", {enableMapClick: false, minZoom: 6, maxZoom: 18}); // 创建Map实例
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

    //设置地图样式
    map.setMapStyle({styleJson: mapStyle});

    //默认中心位置为达拉特
    map.centerAndZoom(new BMap.Point(110.032, 40.418), 11);

    //左下角添加比例尺控件
    map.addControl(new BMap.ScaleControl({anchor: BMAP_ANCHOR_BOTTOM_LEFT}));

    return map;
}
//获取事故列表信息
function initEventList(currentPage) {
    $.ajax({
        type: "post",
        url: BASE_URL + "ems/emssucevent/list",
        dataType: "json",
        data: {
            page: currentPage || 1,
            rows: 10,
            name: "",
            stime: "",
            etime: ""
        },
        success: function (data) {
            if (data) {
                console.log(data);
                var accidentListInfoTpt = _.template($("#accidentListInfoTpt").html());
                $("#accidentListInfoForm").html(accidentListInfoTpt(data));

                Page({
                    num: data.total, //页码数
                    startnum: currentPage, //指定页码
                    elem: $('#page2'), //指定的元素
                    callback: function (n) { //回调函数 n 为当前页码
                        initEventList(n);
                    }
                })

            }
        },
        error: function () {
            parent.toast("初始化信息加载失败");
        }
    });
}