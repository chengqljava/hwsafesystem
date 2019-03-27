$.fn.imgZoomAndDrog=function(options){
    var that = this;
    $('body').css({
        overflow:'hidden'
    });
    $(this).css({
        position:'absolute'
    })
    .find('img')
    .css({
        width:'100%',
        height:'100%'
    });
//    图片的真实宽度
	var imgRealWidth = $(that).width();
//  图片的真实高度
	var imgRealHeight = $(that).height();
//  上一次图片缩放后的宽度
	var lastImgWidth = $(that).width();
//  上一次图片缩放后的高度
	var lastImgHeight = $(that).height();
//鼠标相对图片的位置
	var FAmouseX = 0;
    var FAmouseY = 0;
//图片的位置
    var BimgLeft = 0;
    var BimgTop = 0;
// 上一次图片缩放后的放大系数
    var lastN = 1;
    // 图片放大系数
    var i = 1;
//    设置默认的最大和最小的放大倍数
    var defaultOption = {
        maxi: 5,
        mini: 1,
        callback: function(){}
    }
//    当前的区域id和名称
    var placeId = '';
	var placeName = '';
    var id = false;
//	获取子页面的id
    var Jiframe = window.parent.document.getElementsByTagName('iframe')[0];
    if(Jiframe){
        var id = $(Jiframe).attr('src').split('=')[1];
    }
    console.log(id);
    $.extend(defaultOption,options);
    var maxi = defaultOption.maxi;
    var mini = defaultOption.mini;
//    获取鼠标移动后的位置
    $('body').on('mousemove',function(e){
    	var bodyMouseX = e.clientX;
    	var bodyMouseY = e.clientY;
    	BimgLeft = $(that).position().left;
        BimgTop = $(that).position().top;
        FAmouseX = bodyMouseX - BimgLeft;
        FAmouseY = bodyMouseY - BimgTop;
        lastN = i;
    })
//    获取区域id和名称
    $('body').on('mouseenter','.areaDiv',function(){
    	placeId = $(this).data('id');
    	placeName = $(this).data('name');
    })
    $('body').on('mouseleave','.areaDiv',function(){
    	placeId = '';
    	placeName = '';
    })
//    缩放按钮的点击事件
    $('.become_btn').click(function () {
        if($(this).hasClass('big')){
        	$FAmouseY = FAmouseY *i;
        	$FAmouseX = FAmouseX *i;
        	 i += 0.2;
            if ( i > maxi) {
            	i = maxi;
            }
            that.imgBecomimg(imgRealHeight,imgRealWidth,i,placeId,placeName,id);
        }
        else if($(this).hasClass('small')){
        	$FAmouseY = FAmouseY *i;
        	$FAmouseX = FAmouseX *i;
            i -= 0.2;
            if (i < mini) {
            	i = mini;
            }
            that.imgBecomimg(imgRealHeight,imgRealWidth,i,placeId,placeName,id);
        }
    });
//    窗口大小变化
    $(window).resize(function(){
    	$(that).css({
    		width:'100%',
    		height:'100%',
    		left:'0',
    		top:'0'
    	})
    	imgRealWidth = $(that).width();
        imgRealHeight = $(that).height();
        lastImgWidth = $(that).width();
        lastImgHeight = $(that).height();
        i=1;
        that.imgBecomimg(imgRealHeight,imgRealWidth,i,placeId,placeName,id);
    });
    // 添加图片拖动事件
    $(that).on('mousedown', function (e) {
        var mouseX = e.originalEvent.x || e.originalEvent.layerX || 0;
        var mouseY = e.originalEvent.y || e.originalEvent.layerY || 0;
        var left = $(that).position().left - mouseX;
        var top = $(that).position().top - mouseY;
        $(that).on('mousemove', function (e) {
            mouseX = e.originalEvent.x || e.originalEvent.layerX || 0;
            mouseY = e.originalEvent.y || e.originalEvent.layerY || 0;
            $(that).css({
                'top': (mouseY + top) + 'px',
                'left': (mouseX + left) + 'px',
            });
            return false;
        })
        $('body').on('mouseup', function () {
            $(that).off('mousemove');
        });
        return false;
    })
//    鼠标滚轮滚动的事件
    this.mouseScroll = function (e) {
        e.stopPropagation();
        e = e || window.event;
        if (e.wheelDelta) { //判断浏览器IE，谷歌滑轮事件    
            if (e.wheelDelta > 0) { //当滑轮向上滚动时
            	i += 0.2;
                if ( i > maxi) {
                	 i = maxi;
                }
                that.imgBecomimg(imgRealHeight,imgRealWidth,i,placeId,placeName,id);
            }
            if (e.wheelDelta < 0) { //当滑轮向下滚动时  
            	i -= 0.2;
                if ( i < mini) {
                	 i = mini;
                }
                that.imgBecomimg(imgRealHeight,imgRealWidth,i,placeId,placeName,id);
            }
        } else if (e.detail) { //Firefox滑轮事件  
            if (e.detail > 0) { //当滑轮向上滚动时
            	i += 0.2;
                if ( i > maxi) {
                	 i = maxi;
                }
                that.imgBecomimg(imgRealHeight,imgRealWidth,i,placeId,placeName,id);
            }
            if (e.detail < 0) { //当滑轮向下滚动时  
            	i -= 0.2;
                if ( i < mini) {
                	 i = mini;
                }
                that.imgBecomimg(imgRealHeight,imgRealWidth,i,placeId,placeName,id);
            }
        }
    }
//    图片变化的事件
    this.imgBecomimg = function(imgRealHeight,imgRealWidth,n,placeId,placeName,id){
    	$(that).css({
            // 640 356 是图片的原始尺寸
            'width': (imgRealWidth * n) + 'px',
            'height': (imgRealHeight * n) + 'px',
        });
    	var imgWidth = $(that).width();
        var imgHeight = $(that).height();
        var finaltop = BimgTop - FAmouseY*(n- lastN)/lastN;
        var finalleft = BimgLeft - FAmouseX*(n- lastN)/lastN;
        $(that).css({
        	top: finaltop,
        	left: finalleft
        })
        lastImgWidth = imgWidth;
        lastImgHeight = imgHeight;
        defaultOption.callback(imgRealHeight,imgRealWidth,n,placeId,placeName,id);
//        areaBecome(imgRealHeight,imgRealWidth,n);
//        inOrOut(n,placeId,placeName,id);
//        areaResize();
    }
    //Firefox页面绑定滑轮滚动事件  
    if (document.addEventListener) {
        document.addEventListener('DOMMouseScroll', that.mouseScroll, false);
    }
    // IE 谷歌 滚动滑轮触发事件 
    window.onmousewheel = document.onmousewheel = that.mouseScroll;
}
function areaBecome(imgRealHeight,imgRealWidth,n){
	$(".areaDiv").each(function (e) {
   	 var dataLeft = $(this).attr("data-left");
   	 var dataTop = $(this).attr("data-top");
        var top = imgRealHeight*dataTop * n/100;
        var left = imgRealWidth*dataLeft * n/100;
        $(this).css({top: top, left: left});
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
        var top = imgRealHeight*dataTop * n/100 - 48;
        var left = imgRealWidth*dataLeft * n/100 - 26;
        $(this).css({top: top, left: left});
    });
}
function inOrOut(n,placeId,placeName,id){
	if(n > 4.9 && placeId != ''){
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
	if( n < 1.1 && id){
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
}