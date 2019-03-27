$(function(){
    // 滚动条
    var top = 0;
    var scrollTop = 220;
    var areaHeight = $('#area').height();
    var infoHeight = $('#info').height();
    scrollShowOrHide(areaHeight,infoHeight);
    // 定义鼠标滚轮事件
    var mouseScroll = function (e) {
        e.stopPropagation();
        e = e || window.event;
        var  areaHeight = $('#area').height();
        var  infoHeight = $('#info').height();
        if (e.wheelDelta) { //判断浏览器IE，谷歌滑轮事件    
            if (e.wheelDelta > 0) { //当滑轮向上滚动时
            	if(areaHeight>infoHeight-15){
            		gundong(10);                    
                }
            }
            if (e.wheelDelta < 0) { //当滑轮向下滚动时         
            	if(areaHeight>infoHeight-15){
            		gundong(-10);                    
                }
            }
        } else if (e.detail) { //Firefox滑轮事件  
            if (e.detail > 0) { //当滑轮向上滚动时 
            	if(areaHeight>infoHeight-15){
            		gundong(10);                    
                }
            }
            if (e.detail < 0) { //当滑轮向下滚动时  
            	if(areaHeight>infoHeight-15){
            		gundong(-10);                    
                }
            }
        }
    }
    //Firefox页面绑定滑轮滚动事件  
    if (document.addEventListener) {
        document.addEventListener('DOMMouseScroll', mouseScroll, false);
    }
    // IE 谷歌 滚动滑轮触发事件 
    window.onmousewheel = document.onmousewheel = mouseScroll;
    /**
     * 
     * 鼠标滚动事件
     * @param {number} i 每次滚动移动的距离（px）
     */
    function gundong(i) {
        let areaHeight = $('#area').height();
        let infoHeight = $('#info').height();
        // 滚动系数
        let j = 50 / (areaHeight - infoHeight);
        // let top = $('#area').position().top;
        console.log(top)
        top += i;
        scrollTop -= i * j;
        if (top < (infoHeight - areaHeight -20)) {
            top = infoHeight - areaHeight - 20;
            scrollTop = (areaHeight - infoHeight - 20) * j + 220;
        } else if (top > 0) {
            top = 0;
            scrollTop = 220;
        } else {}
        console.log(top)
        $('#area').css({
            'top': top
        })
        $('#scroll').css({
            'top': scrollTop
        })
    }
//    根据内容控制滚动条显隐
    function scrollShowOrHide(aHeight,iHeigth){
        if(aHeight<iHeigth-15){
            $('#scroll').hide();
            $('#scrollBg').hide();
        }
    }
    // 滚动条拖动事件
    $('#scroll').mousedown(function(e){
        console.log('11')       
        let mouseY = e.originalEvent.y || e.originalEvent.layerY || 0;
        let sTop = $('#scroll').position().top;
        var retop = mouseY - sTop;
        console.log(retop)
        $('body').on('mousemove',function(e){
            console.log('222')
            e.stopPropagation();
            mouseY = e.originalEvent.y || e.originalEvent.layerY || 0;
            scrollTop = mouseY-retop;
            /** 滚动区域和外围区域的高度*/
            let areaHeight = $('#area').height();
            let infoHeight = $('#info').height();
            // 滚动系数
            let j = 50 / (areaHeight - infoHeight);
            let atop = $('#area').position().top;
            top = 0-(scrollTop - 220)/j;
            if(scrollTop<220){
                scrollTop = 220;
                top = 0;
            } 
            else if(scrollTop>283){
                scrollTop = 283
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
            console.log('up')
            $('body').off('mousemove')
        })
        // 阻止默认事件
        return false;
    })
})