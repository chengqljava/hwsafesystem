$(function () {
    var wxyInfo = [];
    var qtInfo = [];
    var spInfo = [];
    var ylInfo = [];
    var ywInfo = [];
    var wdInfo = [];
    var Jiframe = window.parent.document.getElementsByTagName('iframe')[0];
    var id = $(Jiframe).attr('src').split('=')[1];
    $.ajax({
        type: "get",
        url: BASE_URL + "dangersource/dssrskplacearea/getProbesOnline",
//        url: "http://192.168.111.193:8080/ahyjyth/monitor/maccontroller/loaddangerresource",
        cache: false,
        data: {'areaid': id, 'probetype': '1,2,3,4,7,8'},
        dataType: "JSON",
        global: false,
        success: function (res) {
            res.data.forEach(function (item) {
                if (item.LEFT == null) {
                    item.LEFT = 50;
                }
                if (item.TOP == null) {
                    item.TOP = 50;
                }
                switch (item.PROBETYPE) {
                    case '1':
                    case '5':
                    case '6':
                        qtInfo.push(item);
                        break;
                    case '2':
                        wdInfo.push(item);
                        break;
                    case '3':
                        ylInfo.push(item);
                        break;
                    case '4':
                        ywInfo.push(item);
                        break;
                    case '7':
                        spInfo.push(item);
                        break;
                    case '8':
                        wxyInfo.push(item);
                        break;
                    default:
                        break;
                }
            })
            console.log('气体', qtInfo, '温度', wdInfo, 'yl', ylInfo, 'yw', ywInfo, 'sp', spInfo, 'wxy', wxyInfo);
            wxyHtml = '';
            wxyPoint = '';
            qtHtml = '';
            qtPoint = '';
            spHtml = '';
            spPoint = '';
            ylHtml = '';
            ylPoint = '';
            ywHtml = '';
            ywPoint = '';
            wdHtml = '';
            wdPoint = '';
            if (wxyInfo.length == 0) {
                wxyHtml = "<div>暂无数据！</div>"
            }
            else {
                wxyInfo.forEach(function (item, index) {
                    item.index = index + 1;
                    item.type = 'wxy';
                    item.level = getLevelName(item.DANGERLEVEL);
                    item.state = 'zc'
                    wxyPoint += _.template($('#point_template').html())(item);
                    wxyHtml += _.template($('#wxy_template').html())(item);
                })
            }
            $('#monitor_points').append(wxyPoint);
            $('.wxy_list_content').html(wxyHtml);

            if (spInfo.length == 0) {
                spHtml = "<div>暂无数据！</div>"
            }
            else {
                spInfo.forEach(function (item, index) {
                    item.index = index + 1;
                    item.stateName = getStatuName(item.STATE).name;
                    item.level = getStatuName(item.STATE).level;
                    item.type = 'sp';
                    item.state = getStatuName(item.STATE).state;
                    spPoint += _.template($('#point_template').html())(item);
                    spHtml += _.template($('#wxy_template').html())(item);
                })
            }
            $('#monitor_points').append(spPoint);
            $('.sp_list_content').html(spHtml);

            if (qtInfo.length == 0) {
                qtHtml = "<div>暂无数据！</div>"
            }
            else {
                qtInfo.forEach(function (item, index) {
                    item.index = index + 1;
                    item.stateName = getStatuName(item.STATE).name;
                    item.level = getStatuName(item.STATE).level;
                    item.type = 'qt';
                    item.state = getStatuName(item.STATE).state;
                    qtPoint += _.template($('#point_template').html())(item);
                    qtHtml += _.template($('#probe_template').html())(item);
                })
            }
            $('#monitor_points').append(qtPoint);
            $('.qt_list .probe_list_content').html(qtHtml);

            if (wdInfo.length == 0) {
                wdHtml = "<div>暂无数据！</div>"
            }
            else {
                wdInfo.forEach(function (item, index) {
                    item.index = index + 1;
                    item.stateName = getStatuName(item.STATE).name;
                    item.level = getStatuName(item.STATE).level;
                    item.type = 'wd';
                    item.state = getStatuName(item.STATE).state;
                    wdPoint += _.template($('#point_template').html())(item);
                    wdHtml += _.template($('#probe_template').html())(item);
                })
            }
            $('#monitor_points').append(wdPoint);
            $('.wd_list .probe_list_content').html(wdHtml);

            if (ylInfo.length == 0) {
                ylHtml = "<div>暂无数据！</div>"
            }
            else {
                ylInfo.forEach(function (item, index) {
                    item.index = index + 1;
                    item.stateName = getStatuName(item.STATE).name;
                    item.level = getStatuName(item.STATE).level;
                    item.type = 'yl';
                    item.state = getStatuName(item.STATE).state;
                    ylPoint += _.template($('#point_template').html())(item);
                    ylHtml += _.template($('#probe_template').html())(item);
                })
            }
            $('#monitor_points').append(ylPoint);
            $('.yl_list .probe_list_content').html(ylHtml);

            if (ywInfo.length == 0) {
                ywHtml = "<div>暂无数据！</div>"
            }
            else {
                ywInfo.forEach(function (item, index) {
                    item.index = index + 1;
                    item.stateName = getStatuName(item.STATE).name;
                    item.level = getStatuName(item.STATE).level;
                    item.type = 'yw';
                    item.state = getStatuName(item.STATE).state;
                    ywPoint += _.template($('#point_template').html())(item);
                    ywHtml += _.template($('#probe_template').html())(item);
                })
            }
            $('#monitor_points').append(ywPoint);
            $('.yw_list .probe_list_content').html(ywHtml);
        }
    })
    $('body').on('mousedown', '.point', function (e) {
        var mouseStartX = e.originalEvent.x || e.originalEvent.layerX || 0;
        var mouseStartY = e.originalEvent.y || e.originalEvent.layerY || 0;
        var AMLeft = mouseStartX - $(this).position().left;
        var AMTop = mouseStartY - $(this).position().top;
        var $this = this;
        $('body').on('mousemove', function (e) {
            var mouseX = e.originalEvent.x || e.originalEvent.layerX || 0;
            var mouseY = e.originalEvent.y || e.originalEvent.layerY || 0;
            console.log(mouseX, mouseY, AMLeft, AMTop)
            $($this).css({
                left: (mouseX - AMLeft) < 0 ? 0 : (mouseX - AMLeft),
                top: (mouseY - AMTop) < 0 ? 0 : (mouseY - AMTop)
            })
        })
        $('body').on('mouseup', '.point', function (e) {
            $('body').off('mousemove')
            var $id = $($this).data('id');
            var $type = $($this).data('type');
            var mouseX = e.originalEvent.x || e.originalEvent.layerX || 0;
            var mouseY = e.originalEvent.y || e.originalEvent.layerY || 0;
            console.log(mouseX, mouseY, mouseStartX, mouseStartY, Math.abs(mouseX - mouseStartX), Math.abs(mouseY - mouseStartY));
            if (Math.abs(mouseX - mouseStartX) > 1 || Math.abs(mouseY - mouseStartY) > 1) {
                var lefts = (($($this).position().left + 26) / $('#factory_area').width() * 100).toFixed(4);
                var tops = (($($this).position().top + 48) / $('#factory_area').height() * 100).toFixed(4);
                if ($type == 'wxy') {
                    $.ajax({
                        type: "post",
                        url: BASE_URL + "dangersource/dssdangerinfo/savePoint",
                        dataType: "json",
                        data: {
                            "id": $id,
                            "left": lefts,
                            "top": tops
                        },
                        success: function (data) {
                            if (data.success == true) {
                                toast(data.msg);//弹出提示信息
                            }
                        }
                    });
                } else if ($type == 'sp') {
                    $.ajax({
                        type: "post",
                        url: BASE_URL + "monitor/macvideo/savePoint",
                        dataType: "json",
                        data: {
                            "id": $id,
                            "left": lefts,
                            "top": tops
                        },
                        success: function (data) {
                            if (data.success == true) {
                                toast(data.msg);//弹出提示信息
                            }
                        }
                    });
                } else {
                    $.ajax({
                        type: "post",
                        url: BASE_URL + "/monitor/macprobe/savePoint",
                        dataType: "json",
                        data: {
                            "id": $id,
                            "left": lefts,
                            "top": tops
                        },
                        success: function (data) {
                            console.log(data);
                            if (data.success == true) {
                                toast(data.msg);
                            }
                            ;
                        }
                    });
                }
            }
            $('body').off('mouseup', '.point');
        })
        return false;
    })
    // 左侧顶部菜单的点击事件
    $('.menu_top').on('click', '.single_menu', function () {
        var $id = $(this).data('id');
        if ($(this).hasClass('active')) {
            $('.' + $id).removeClass('show');
            $('.P' + $id).addClass('hide');
        }
        else {
            $('.' + $id).addClass('show');
            $('.P' + $id).removeClass('hide');
        }
        $(this).toggleClass('active');
    })
});

function getLevelName(num) {
    var name = '';
    switch (num) {
        case '0':
            name = '未分级';
            break;
        case '1':
            name = '一级';
            break;
        case '2':
            name = '二级';
            break;
        case '3':
            name = '三级';
            break;
        case '4':
            name = '四级';
            break;
    }
    return name;
}

function getStatuName(num) {
    var statusName = '';
    var stateLevel = '';
    var state = '';
    switch (num) {
        case '0':
            statusName = '探头正常';
            stateLevel = '0';
            state = 'zc';
            break;
        case '1':
            statusName = '探头正常';
            stateLevel = '0';
            state = 'zc';
            break;
        case '2':
            statusName = '探头故障';
            stateLevel = '2';
            state = 'gz';
            break;
        case '3':
            statusName = '探头故障';
            stateLevel = '2';
            state = 'gz';
            break;
        case '4':
            statusName = '预警';
            stateLevel = '1';
            state = 'bj';
            break;
        case '7':
            statusName = '通讯故障';
            stateLevel = '2';
            state = 'gz';
            break;
        case '99':
            statusName = '网络故障';
            stateLevel = '2';
            state = 'gz';
            break;
        case '100':
            statusName = '满量程';
            stateLevel = '1';
            state = 'bj';
            break;
        case '101':
            statusName = '低报';
            stateLevel = '1';
            state = 'bj';
            break;
        case '102':
            statusName = '高报';
            stateLevel = '1';
            state = 'bj';
            break;
        case '103':
            statusName = '超低报';
            stateLevel = '1';
            state = 'bj';
            break;
        case '104':
            statusName = '超高报';
            stateLevel = '1';
            state = 'bj';
            break;
        default:
            statusName = '未知故障';
            stateLevel = '2';
            state = 'gz';
            break;
    }
    return {
        'name': statusName,
        'level': stateLevel,
        'state': state,
    };
}
