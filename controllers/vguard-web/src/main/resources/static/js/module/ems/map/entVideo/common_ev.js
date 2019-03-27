/**
 *
 *
 * @param {string} area 滚动的内容的外层的id
 * @param {string} info 滚动的区域的id
 * @param {string} scroll 滚动条的ID
 * @param {string/number} top 滚动条的初始top值
 */
function scrollShowOrHide(area, info, scroll, top) {
    //
    var aHeight = $('#' + area).height();
    var iHeight = $('#' + info).height();
    if (aHeight > iHeight) {
        $('#' + scroll).show().css({
            'top': top
        })
    }
    else {
        $('#' + scroll).hide();
    }

    // $("#viewArea").css("height",$(window).height()-$("#info").height());

}

function initLayPosition() {
    var height = $(window).height();
    var width = $(window).width();
    $('#thisProbe').css({
        'margin-left': width - 710 - 460,
    })

    $('#seekBarBottom').css({
        'width': width - 410,
    })

    $('.informationLeft:eq(0)').css({
        'left': width - 410,
        'width': 450
    })
    $('.probeInfo:eq(0)').css({
        'width': width - 410,
        'height': height - 420,
    })
    $("#dataTable").setGridWidth($(".probeInfo").width());
    $('.probeInfoContentInfo:eq(0)').css({
        'height': height - 520,
    })
    $('.vidoeInfoContentInfo:eq(0)').css({
        'height': height - 520,
    })
    $('#seekBarLeft').css({
        'left': width - 410,
    })
    $('#probeScroll').css({
        'left': width - 410 - 50
    })
    $('#area').css({
        'top': 0
    })
    $('#videoArea').css({
        'top': 0
    })
}
$(function () {
    // 加载时是拖动的元素居中
    var left = $('.informationLeft:eq(0)').position().left;
    $('#moveImg').css({
        'left': left / 2 - 320,
    })
    $('#seekBarBottom').css({
        'width': left,
    })

    // 窗口大小变化时
    $(window).resize(function () {
        initLayPosition();
        scrollShowOrHide('area', 'info', 'probeScroll', 70);
        scrollShowOrHide('videoArea', 'videoInfo', 'videoScroll', 70);
    });
})

