$(function(){
    // 滚动条
    var top = 0;
    var scrollTop = 40;
    // 定义鼠标滚轮事件
    var mouseScroll = function (e) {
        e.stopPropagation();
        e = e || window.event;
        if (e.wheelDelta) { //判断浏览器IE，谷歌滑轮事件    
            if (e.wheelDelta > 0) { //当滑轮向上滚动时
                gundong(10);
            }
            if (e.wheelDelta < 0) { //当滑轮向下滚动时         
                gundong(-10);
            }
        } else if (e.detail) { //Firefox滑轮事件  
            if (e.detail > 0) { //当滑轮向上滚动时 
                gundong(10);
            }
            if (e.detail < 0) { //当滑轮向下滚动时  
                gundong(-10);
            }
        }
    }
    //Firefox页面绑定滑轮滚动事件  
    if (document.addEventListener) {
        document.addEventListener('DOMMouseScroll', mouseScroll, false);
    }
    // IE 谷歌 滚动滑轮触发事件 
    document.getElementById("sgjbsgjb").onmousewheel = mouseScroll;
    /**
     * 
     * 鼠标滚动事件
     * @param {number} i 每次滚动移动的距离（px）
     */
    function gundong(i) {
        var areaHeight = $('#area').height();
        var infoHeight = $('#info').height();
        // 滚动系数
        var j = 50 / (areaHeight - infoHeight);
        // var top = $('#area').position().top;
        top += i;
        scrollTop -= i * j;
        if (top < (infoHeight - areaHeight - 20)) {
            top = infoHeight - areaHeight - 20;
            scrollTop = (areaHeight - infoHeight + 20) * j + 40;
        } else if (top > 0) {
            top = 0;
            scrollTop = 40;
        } else {}
        $('#area').css({
            'top': top
        })
        $('#scroll').css({
            'top': scrollTop
        })
    }
    // 滚动条拖动事件
    $('#scroll').mousedown(function(e){    
        var mouseY = e.originalEvent.y || e.originalEvent.layerY || 0;
        var sTop = $('#scroll').position().top;
        var retop = mouseY - sTop;
        $('body').on('mousemove',function(e){
            e.stopPropagation();
            mouseY = e.originalEvent.y || e.originalEvent.layerY || 0;
            scrollTop = mouseY-retop;
            /** 滚动区域和外围区域的高度*/
            var areaHeight = $('#area').height();
            var infoHeight = $('#info').height();
            // 滚动系数
            var j = 50 / (areaHeight - infoHeight);
            var atop = $('#area').position().top;
            top = 0-(scrollTop - 40)/j;
            if(scrollTop<40){
                scrollTop = 40;
                top = 0;
            } 
            else if(scrollTop>160){
                scrollTop = 160
                top = 0 - 50/j -20;
            }
            else{}
            $("#scroll").css({
                'top':scrollTop
            })
            $('#area').css({
                'top': top
            })
        })
        $('body').mouseup(function(){
            $('body').off('mousemove')
        })
        // 阻止默认事件
        return false;
    })
})