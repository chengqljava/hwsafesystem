$(function () {
    // 记录上一次图片的宽高
    // window.lastImgWidth = window.imgRealWidth;
    // window.lastImgHeight = window.imgRealHeight;
    // 添加图片拖动事件
    $('#viewArea').on('mousedown', function (e) {
        var mouseX = e.originalEvent.x || e.originalEvent.layerX || 0;
        var mouseY = e.originalEvent.y || e.originalEvent.layerY || 0;
        var left = $('#viewArea').position().left - mouseX;
        var top = $('#viewArea').position().top - mouseY;
        $('#viewArea').on('mousemove', function (e) {
            mouseX = e.originalEvent.x || e.originalEvent.layerX || 0;
            mouseY = e.originalEvent.y || e.originalEvent.layerY || 0;
            $('#viewArea').css({
                'top': (mouseY + top) + 'px',
                'left': (mouseX + left) + 'px',
            });

            //判断边界如果top,left不能大于0
            var currenttop = $('#viewArea').css("top");
            var currentleft = $('#viewArea').css("left");
            if (parseInt(currenttop) > 0) {
                $('#viewArea').css("top", 0);
            } else if (parseInt(currenttop) < 0) {
                var h = window.leftTopDivHeight - parseInt(currenttop);
                if (h > window.lastImgHeight) {
                    $('#viewArea').css("top", window.leftTopDivHeight - window.lastImgHeight);
                }
            }

            if (parseInt(currentleft) > 0) {
                $('#viewArea').css("left", 0);
            } else if (parseInt(currentleft) < 0) {
                var w = window.leftTopDivWidth - parseInt(currentleft);
                if (w > window.lastImgWidth) {
                    $('#viewArea').css("left", window.leftTopDivWidth - window.lastImgWidth);
                }
            }

            return false;
        })
        $('body').on('mouseup', function () {
            $('#viewArea').off('mousemove');
        });


        return false;
    })

    // 图片放大系数
    var i = 1;
    // 定义鼠标滚轮事件
    var mouseScroll = function (e) {
        e.stopPropagation();
        e = e || window.event;
        if (e.wheelDelta) { //判断浏览器IE，谷歌滑轮事件    
            if (e.wheelDelta > 0) { //当滑轮向上滚动时
                i += 0.2;
                if (i > 3) {
                    i = 3;
                }
                ;
                imgBecomimg(i);
            }
            if (e.wheelDelta < 0) { //当滑轮向下滚动时  
                i -= 0.2;
                if (i < 1) {
                    i = 1;
                }
                imgBecomimg(i);
            }
        } else if (e.detail) { //Firefox滑轮事件  
            if (e.detail > 0) { //当滑轮向上滚动时 
                i += 0.2;
                if (i > 5) {
                    i = 5;
                }
                ;
                imgBecomimg(i);
            }
            if (e.detail < 0) { //当滑轮向下滚动时  
                i -= 0.2;
                if (i < 1) {
                    i = 1;
                }
                imgBecomimg(i);
            }
        }
    }
    //Firefox页面绑定滑轮滚动事件  
    if (document.addEventListener) {
        document.addEventListener('DOMMouseScroll', mouseScroll, false);
    }
    // IE 谷歌 滚动滑轮触发事件 
    window.onmousewheel = document.onmousewheel = mouseScroll;
    // i是图片放大系数
    function imgBecomimg(i) {

        var imgLeft = $('#viewArea').position().left;
        var imgTop = $('#viewArea').position().top;

        $('#viewArea').css({
            // 640 356 是图片的原始尺寸
            'width': (window.imgRealWidth * i) + 'px',
            'height': (window.imgRealHeight * i) + 'px',
        });
        var imgWidth = $('#viewArea').width();
        var imgHeight = $('#viewArea').height();


        //重新设置点位的位置

        $('#viewArea').css({
            'top': (imgTop - (imgHeight - window.lastImgHeight) / 2 ) + 'px',
            'left': (imgLeft - (imgWidth - window.lastImgWidth) / 2) + 'px'
        });
        // 把当前图片的尺寸值保存，和下次尺寸对比
        window.lastImgWidth = imgWidth;
        window.lastImgHeight = imgHeight;

        $(".realWkSpMonPt").each(function (e) {
            var dataTop = $(this).attr("data-top");
            var dataLeft = $(this).attr("data-left");
            //获取原始的高度
            var h = window.imgRealHeight * dataTop / 100 + 40 -19;
            //获取原始的宽度
            var w = window.imgRealWidth * dataLeft / 100 + 15;
            var top = h * i - 40;
            var left = w * i - 15;
            $(this).css({top: top, left: left});
        });


    }
    function clearMouseEvent(){
    	
    };
    // 在别的区域范围清除图片的滚轮事件
    // mouseenter时清除，mouseleave时添加
    $('.informationLeft:eq(0)').mouseenter(function () {
        if (document.addEventListener) {
            document.addEventListener('DOMMouseScroll', clearMouseEvent, false);
        }
        window.onmousewheel = document.onmousewheel = clearMouseEvent;
    })
    $('.informationLeft:eq(0)').mouseleave(function () {
        $('#moveImg').off('mousemove');
        if (document.addEventListener) {
            document.addEventListener('DOMMouseScroll', mouseScroll, false);
        }
        window.onmousewheel = document.onmousewheel = mouseScroll;
    })
    $('.probeInfo:eq(0)').mouseenter(function () {
        if (document.addEventListener) {
            document.addEventListener('DOMMouseScroll', clearMouseEvent, false);
        }
        window.onmousewheel = document.onmousewheel = clearMouseEvent;
        return false;
    })
    $('.probeInfo:eq(0)').mouseleave(function () {
        if (document.addEventListener) {
            document.addEventListener('DOMMouseScroll', mouseScroll, false);
        }
        window.onmousewheel = document.onmousewheel = mouseScroll;
        return false;
    })
})