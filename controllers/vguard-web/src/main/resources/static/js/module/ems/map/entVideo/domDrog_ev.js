$(function () {
    // 底部拖动条
    $('#seekBarBottom').on('mousedown', function () {
        var height = $(window).height();
        $('body').on('mousemove', function (e) {

            e= e || window.event;
            var mousePos = mouseCoords(e);


            var mouseY = mousePos.y;
            if ((height - mouseY) < 2) {
                mouseY = height - 5;
                $('.probeInfo:eq(0)').css({
                    'top': mouseY + 5
                })
                $('body').off('mousemove');
            }


            $('#seekBarBottom').css({
                'top': mouseY - 5
            })
            return false;
        })
    })

    $('#seekBarBottom').on('mouseup', function (e) {
        $('body').off('mousemove');
        var mousePos = mouseCoords(e);
        var mouseY = mousePos.y;
        var height = $(window).height();
        $('.probeInfo:eq(0)').css({
            'top': mouseY + 5
        });
        var top = $('.probeInfo:eq(0)').css("top");
        //作用便于让视频页面和曲线图页面的高度自动变化
        window.leftTopDivHeight = top;
        $('.probeInfo:eq(0)').css({
            'height': height - parseInt(top),
        })
        $('.probeInfoContentInfo:eq(0)').css({
            'height': height - parseInt(top) - 40,
        });
        $("#dataTable").setGridHeight(height - parseInt(top) - 80);
        // 判断探头监控的滚动条是否显示，函数在common.js中
        scrollShowOrHide('area', 'info', 'probeScroll', 70);


    });

    // 左侧拖动条
    $('#seekBarLeft').on('mousedown', function () {
        var width = $(window).width();
        $('body').on('mousemove', function (e) {

            var mousePos = mouseCoords(e);
            var mouseX = mousePos.x;
            $('#seekBarLeft').css({
                'left': mouseX - 5
            })
            if ((width - mouseX) < 2) {
                mouseX = width - 5;
                $('.informationLeft:eq(0)').css({
                    'left': mouseX - 5,
                    'width':width - mouseX + 5
                })
                $('.probeInfo:eq(0)').css({
                    'width': mouseX - 10
                })
                $('body').off('mousemove');
            }


            return false;
        });
    });
    $('#seekBarLeft').on('mouseup', function (e) {
        $('body').off('mousemove');
        var width = $(window).width();
        var mousePos = mouseCoords(e);
        var mouseX = mousePos.x;
        $('.informationLeft:eq(0)').css({
            'left': mouseX - 5,
            'width':width - mouseX + 5
        })

        $('.probeInfo:eq(0)').css({
            'width': mouseX - 5,
        })
        $('#seekBarBottom').css({
            'width': mouseX - 5,
        })
        if (mouseX < 600) {
            $('#thisProbe').hide();
        } else {
            $('#thisProbe').css({
                'margin-left': mouseX - 710,
            }).show();
        }
        $('#probeScroll').css({
            'left': mouseX - 50
        });
        $('.companyInfoContentInfo').css({
        	'min-width':120,
        	'width':width-mouseX-170,
        });
        $("#dataTable").setGridWidth($(".probeInfo").width());
        $("#videoTable").setGridWidth($(window).width() - $(".probeInfo").width() - 30);

        window.leftTopDivWidth = $(".probeInfo").width();


        //等比例缩放图片 获取图片的宽度
        // var imgHeight = parseInt((parseFloat(window.imgRealHeight) / parseFloat(window.imgRealWidth)) * parseFloat(window.leftTopDivWidth));
        // if (imgHeight > parseInt($("#viewArea").css("height"))) {
        //     $("#viewArea").css("width", window.leftTopDivWidth);
        //     $("#viewArea").css("height", imgHeight);
        //     window.lastImgWidth = $(".probeInfo").width();
        //     window.lastImgHeight = imgHeight;
        // }


    });
});


function mouseCoords(ev)
{
    if(ev.pageX || ev.pageY){
        return {x:ev.pageX, y:ev.pageY};
    }
    return {
        x:ev.clientX + document.body.scrollLeft - document.body.clientLeft,
        y:ev.clientY + document.body.scrollTop - document.body.clientTop
    };
}

function setImgWAndH(iw, ih, ow, oh) {
    var w = ow / iw;
    var h = oh / ih;
    if (w > h) {
        iw = iw * w;
        ih = ih * w;
    } else {
        iw = iw * h;
        ih = ih * h;
    }


    $("#viewArea").css("width", iw);
    $("#viewArea").css("height", ih);
    window.lastImgWidth = iw;
    window.lastImgHeight = ih;
}