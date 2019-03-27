$(function () {
	var Jiframe = window.parent.document.getElementsByTagName('iframe')[0];
    var id = $(Jiframe).attr('src').split('=')[1];
    // 记录上一次图片的宽高
	window.imgRealWidth = $('#factory_area').width();
    window.imgRealHeight = $('#factory_area').height();
    window.lastImgWidth = $('#factory_area').width();
    window.lastImgHeight = $('#factory_area').height();
    var FAmouseX = 0;
    var FAmouseY = 0;
    var $FAmouseY = 0;
    var $FAmouseX = 0;
    var BimgLeft = 0;
    var BimgTop = 0;
    var placeId = '';
    var placeName = '';
    var lastN = 1;
    // 图片放大系数
    var i = 1;
    $('body').on('mousemove',function(e){
    	var bodyMouseX = e.clientX;
    	var bodyMouseY = e.clientY;
    	BimgLeft = $('#factory_area').position().left;
        BimgTop = $('#factory_area').position().top;
        FAmouseX = bodyMouseX - BimgLeft;
        FAmouseY = bodyMouseY - BimgTop;
        lastN = i;
    })
    $('body').on('mouseenter','.areaDiv',function(){
    	placeId = $(this).data('id');
    	placeName = $(this).data('name');
    })
    $('body').on('mouseleave','.areaDiv',function(){
    	placeId = '';
    	placeName = '';
    })
    // 添加图片拖动事件
    $('#factory_area').on('mousedown', function (e) {
        var mouseX = e.originalEvent.x || e.originalEvent.layerX || 0;
        var mouseY = e.originalEvent.y || e.originalEvent.layerY || 0;
        var left = $('#factory_area').position().left - mouseX;
        var top = $('#factory_area').position().top - mouseY;
        $('#factory_area').on('mousemove', function (e) {
            mouseX = e.originalEvent.x || e.originalEvent.layerX || 0;
            mouseY = e.originalEvent.y || e.originalEvent.layerY || 0;
            $('#factory_area').css({
                'top': (mouseY + top) + 'px',
                'left': (mouseX + left) + 'px',
            });

//            //判断边界如果top,left不能大于0
//            var currenttop = $('#factory_area').css("top");
//            var currentleft = $('#factory_area').css("left");
//            if (parseInt(currenttop) > 0) {
//                $('#factory_area').css("top", 0);
//            } else if (parseInt(currenttop) < 0) {
//                var h = window.leftTopDivHeight - parseInt(currenttop);
//                if (h > window.lastImgHeight) {
//                    $('#factory_area').css("top", window.leftTopDivHeight - window.lastImgHeight);
//                }
//            }
//
//            if (parseInt(currentleft) > 0) {
//                $('#factory_area').css("left", 0);
//            } else if (parseInt(currentleft) < 0) {
//                var w = window.leftTopDivWidth - parseInt(currentleft);
//                if (w > window.lastImgWidth) {
//                    $('#factory_area').css("left", window.leftTopDivWidth - window.lastImgWidth);
//                }
//            }
//            if( (mouseX + left) < (window.imgRealWidth - window.lastImgWidth)){
//                $('#factory_area').css('left',window.imgRealWidth - window.lastImgWidth);                
//            }
//            if( (mouseY+ top) < (window.imgRealHeight - window.lastImgHeight)){
//                $('#factory_area').css('top',window.imgRealHeight - window.lastImgHeight);                
//            }
            return false;
        })
        $('body').on('mouseup', function () {
            $('#factory_area').off('mousemove');
        });
        return false;
    })
    $('.become_btn').click(function () {
        if($(this).hasClass('big')){
        	$FAmouseY = FAmouseY *i;
        	$FAmouseX = FAmouseX *i;
        	 i += 0.2;
            if ( i > maxi) {
            	i = maxi;
            }
            imgBecomimg(i);
        }
        else if($(this).hasClass('small')){
        	$FAmouseY = FAmouseY *i;
        	$FAmouseX = FAmouseX *i;
            i -= 0.2;
            if (i < mini) {
            	i = mini;
            }
            imgBecomimg(i);
        }
    });

    var maxi = 5;
    var mini = 1;
    // 定义鼠标滚轮事件
    var mouseScroll = function (e) {
        e.stopPropagation();
        e = e || window.event;
        if (e.wheelDelta) { //判断浏览器IE，谷歌滑轮事件    
            if (e.wheelDelta > 0) { //当滑轮向上滚动时
//            	$FAmouseY = FAmouseY *i;
//            	$FAmouseX = FAmouseX *i;
            	i += 0.2;
                if ( i > maxi) {
                	 i = maxi;
                }
                imgBecomimg( i);
            }
            if (e.wheelDelta < 0) { //当滑轮向下滚动时  
//            	$FAmouseY = FAmouseY *i;
//            	$FAmouseX = FAmouseX *i;
            	i -= 0.2;
                if ( i < mini) {
                	 i = mini;
                }
                imgBecomimg( i);
            }
        } else if (e.detail) { //Firefox滑轮事件  
            if (e.detail > 0) { //当滑轮向上滚动时 
//            	$FAmouseY = FAmouseY *i;
//            	$FAmouseX = FAmouseX *i;
            	i += 0.2;
                if ( i > maxi) {
                	 i = maxi;
                }
                imgBecomimg( i);
            }
            if (e.detail < 0) { //当滑轮向下滚动时  
//            	$FAmouseY = FAmouseY *i;
//            	$FAmouseX = FAmouseX *i;
            	i -= 0.2;
                if ( i < mini) {
                	 i = mini;
                }
                imgBecomimg( i);
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
    function imgBecomimg(n) {
    	if(n ==3 && placeId != ''){
    		$('.allArea').addClass('fade')
			$('.all_title').addClass('fade');
			$('.tools').addClass('fade');
			$('#loading').addClass('fadeOn');
			setTimeout(function(){
				$('#loading').removeClass('fadeOn');
				$('.single_title').addClass('fadeOn');
				$('#back').addClass('fadeOn');
				$('.singleArea').addClass('fadeOn');
			}, 1000);
			$('#singleAreaIframe')
					.attr(
							'src',
							BASE_URL
									+ '/views/module/monitor/macArea/macAreaIndex.html?id='
									+ placeId);
			$('.single_title').html(placeName).attr('data-id',placeId).attr('data-name',placeName);
			return false;
    	}
    	if( n ==1 && id){
    		$(".single_title", window.parent.document).removeClass('fadeOn');
    		$("#back", window.parent.document).removeClass('fadeOn');
    		$(".singleArea", window.parent.document).removeClass('fadeOn');
    		$("#loading", window.parent.document).addClass('fadeOn');
			setTimeout(function(){
				$("#loading", window.parent.document).removeClass('fadeOn');
				$(".allArea", window.parent.document).removeClass('fade');
				$(".all_title", window.parent.document).removeClass('fade');
				$(".tools", window.parent.document).removeClass('fade');
			}, 1000);
			return false;
    	}
        $('#factory_area').css({
            // 640 356 是图片的原始尺寸
            'width': (window.imgRealWidth * n) + 'px',
            'height': (window.imgRealHeight * n) + 'px',
        });
        areaResize();
//        $('.areaDiv').each(function(){
//        	var divH = $(this).width();
//        	var divH = $(this).height();
//        	var divLeft = $(this).position().left;
//            var divTop = $(this).position().top;
//        	$(this).css({
//        		left:divLeft * i
//        	})
//        })
        var  imgWidth = $('#factory_area').width();
        var imgHeight = $('#factory_area').height();


        //重新设置点位的位置
        
//        var finalTop = imgTop - (imgHeight - window.lastImgHeight) / 2 > 0?0:imgTop - (imgHeight - window.lastImgHeight) / 2;
//        var finalLeft = imgLeft - (imgWidth - window.lastImgWidth) / 2 > 0?0:imgLeft - (imgWidth - window.lastImgWidth) / 2;
//        if(finalLeft < window.imgRealWidth*(1-n)){
//            finalLeft = window.imgRealWidth*(1-n);
//        }
//        if(finalTop < window.imgRealHeight*(1-n)){
//            finalTop = window.imgRealHeight*(1-n);
//        }
//        $('#factory_area').css({
//            'top': finalTop + 'px',
//            'left': finalLeft + 'px'
//        });
//        var finaltop = 0;
//        var finalleft = 0;
//        if(isMove){
//        	finaltop = imgTop - FAmouseY*(n- lastN)/lastN;
//            finalleft = imgLeft - FAmouseX*(n- lastN)/lastN;
//        }
//        else{
//        }
        var finaltop = BimgTop - FAmouseY*(n- lastN)/lastN;
        var finalleft = BimgLeft - FAmouseX*(n- lastN)/lastN;
//        var finaltop = imgTop - FAmouseY*(n- lastN)/lastN;
//        var finalleft = imgLeft - FAmouseX*(n- lastN)/lastN;
        console.log(FAmouseX,FAmouseY);
        console.log(BimgLeft,BimgTop)
        console.log(n,lastN);
        console.log(finalleft,finaltop);
        $('#factory_area').css({
        	top: finaltop,
        	left: finalleft
        })
        
        // 把当前图片的尺寸值保存，和下次尺寸对比
        window.lastImgWidth = imgWidth;
        window.lastImgHeight = imgHeight;
        $(".areaDiv").each(function (e) {
//             var dataTop = $(this).attr("data-top");
//             var dataLeft = $(this).attr("data-left");
//             var top = window.imgRealHeight*dataTop * n/100 - 91;
//             var left = window.imgRealWidth*dataLeft * n/100 - 75;
//             $(this).css({top: top, left: left});
        	 var dataLeft = $(this).attr("data-left");
        	 var dataTop = $(this).attr("data-top");
//             var dataWidth = $(this).attr("data-width");
//             var dataHeight = $(this).attr("data-height");
             var top = window.imgRealHeight*dataTop * n/100;
             var left = window.imgRealWidth*dataLeft * n/100;
//             var height  = window.imgRealWidth*dataHeight * n/100;
//             var width  = window.imgRealWidth*dataWidth * n/100;
             $(this).css({top: top, left: left});
//             $(this).css({top: top, left: left,width:width,height:height});
         });
         $(".areaDiv svg polygon").each(function (e) {
      	     var points = $(this).data('points');
             var allPoint = []; 
             points.split(' ').forEach(function(item){
            	 var arr = item.split(',');
            	 allPoint = allPoint.concat(arr);
             });
             var allpoints = [];
             allPoint.forEach(function(item,index){
            	 allpoints.push(parseFloat(parseFloat(item).toFixed(2))*n);
             })
             $(this).attr('points',allpoints[0]+','+allpoints[1]+' '+allpoints[2]+','+allpoints[3]+' '+allpoints[4]+','+allpoints[5]+' '+allpoints[6]+','+allpoints[7])
         });
         
         $(".point").each(function (e) {
             var dataTop = $(this).attr("data-top");
             var dataLeft = $(this).attr("data-left");
             var top = window.imgRealHeight*dataTop * n/100 - 48;
             var left = window.imgRealWidth*dataLeft * n/100 - 26;
             $(this).css({top: top, left: left});
         });
//         lastI = i;
    }
    function clearMouseEvent(){
    	
    };
    // 在别的区域范围清除图片的滚轮事件
    // mouseenter时清除，mouseleave时添加
    // $('.informationLeft:eq(0)').mouseenter(function () {
    //     if (document.addEventListener) {
    //         document.addEventListener('DOMMouseScroll', clearMouseEvent, false);
    //     }
    //     window.onmousewheel = document.onmousewheel = clearMouseEvent;
    // })
    // $('.informationLeft:eq(0)').mouseleave(function () {
    //     $('#moveImg').off('mousemove');
    //     if (document.addEventListener) {
    //         document.addEventListener('DOMMouseScroll', mouseScroll, false);
    //     }
    //     window.onmousewheel = document.onmousewheel = mouseScroll;
    // })
    // $('.probeInfo:eq(0)').mouseenter(function () {
    //     if (document.addEventListener) {
    //         document.addEventListener('DOMMouseScroll', clearMouseEvent, false);
    //     }
    //     window.onmousewheel = document.onmousewheel = clearMouseEvent;
    //     return false;
    // })
    // $('.probeInfo:eq(0)').mouseleave(function () {
    //     if (document.addEventListener) {
    //         document.addEventListener('DOMMouseScroll', mouseScroll, false);
    //     }
    //     window.onmousewheel = document.onmousewheel = mouseScroll;
    //     return false;
    // })
})
$(window).resize(function(){
	$('#factory_area').css({
		width:'100%',
		height:'100%',
		left:'0',
		top:'0'
	})
	window.imgRealWidth = $('#factory_area').width();
    window.imgRealHeight = $('#factory_area').height();
    window.lastImgWidth = $('#factory_area').width();
    window.lastImgHeight = $('#factory_area').height();
    window.i=1;
    areaResize();
});
function areaResize(){
	$('.placeName').each(function(){
		var left = $(this).parent().width()/2 - $(this).width()/2 - 14;
		$(this).css({
			left: left
		})
		$(this).next().css({
			left: left+$(this).width()+28
		})
		$(this).next().next().css({
			left: left
		})
	})
}