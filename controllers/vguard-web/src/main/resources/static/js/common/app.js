$(function() {
	$('.nav ul li, ul.subnav li').click(function() {
		$(this).addClass('active').siblings().removeClass('active');
	});
	
	//左侧点击收缩
	var flag = 1;
	$('.mbtn').click(function() {
		var $width = $(window).width();
		//alert($width);
		if (flag == 1) {
			$('.siderbar').hide();
			$('.frame').animate({marginLeft:'15px'},1);
			$('.mbtn i').css('background-image','url(images/theme/'+$skin+'/triangleLeft.png)');
			flag=0;			
		}else {
			$('.siderbar').show();
			$('.frame').animate({marginLeft:'195px'},1);
			$('.mbtn i').css('background-image','url(images/theme/'+$skin+'/triangleRight.png)');
			flag=1;		
		}
	});
	
	//左侧菜单点击上下收缩
	$('#menu').metisMenu();
	$('#menu li ul li ').click(function() {
		$(this).addClass('active').siblings().removeClass('active');
	});
	
	
	//顶部和页脚收缩自适应
	
	var $content = $(window).height() - $('.mainTop').height() - $('.subTop').height() - $('.footer').height() - 10;
	var $toplft = $('.left').width(),
		$toprgt = $('.right').width(),
		$topmdl = $('.middle').width();
	    $topmdl = $(window).width()- $toplft - $toprgt;
	    console.log($topmdl);
	$('.middle').css('width',$topmdl);

	var $footerlft = $('.footerlft').width(),
		$footerrgt = $('.footerrgt').width(),
		$footermdl = $('.footermdl').width();
		$footermdl = $(window).width() - $footerlft - $footerrgt;
	$('.footermdl').css('width',$footermdl);
	
	$('.siderbar').css('height',$content);
	$('.frame').css('height',$content);
	var $subnav = $('.subnav>li a').size();
	console.log($subnav);
	var $awidth = $('.subnav>li').width() + 2;
	console.log($awidth);
	var $liWdith = $subnav * $awidth;
	if( $liWdith > $topmdl ) {
		$('.left').addClass('toplft').removeClass('stoplft');
		$('.middle').addClass('topmdl').removeClass('stopmdl');
		$('.right').addClass('toprgt').removeClass('stoprgt');
	}else {
		$('.left').addClass('stoplft').removeClass('toplft');
		$('.middle').addClass('stopmdl').removeClass('topmdl');
		$('.right').addClass('stoprgt').removeClass('toprgt');
	}
	$('#slimScroll').slimScroll({
		height:  $content,
		railVisible: true,
		alwaysVisible: false,
		position: 'right',
		size:'8px',
		 color: '#6495ed' //滚动条颜色
	});
	$(window).resize(function() {
		var $content = $(window).height() - $('.mainTop').height() - $('.subTop').height() - $('.footer').height() - 10;
		var $toplft = $('.left').width(),
			$toprgt = $('.right').width(),
			$topmdl = $('.middle').width();
		    $topmdl = $(window).width()- $toplft - $toprgt;
		    console.log($topmdl);
		$('.middle').css('width',$topmdl);
	
		var $footerlft = $('.footerlft').width(),
			$footerrgt = $('.footerrgt').width(),
			$footermdl = $('.footermdl').width();
			$footermdl = $(window).width() - $footerlft - $footerrgt;
		$('.footermdl').css('width',$footermdl);
		
		$('.siderbar').css('height',$content);
		$('.frame').css('height',$content);
		var $subnav = $('.subnav>li a').size();
		console.log($subnav);
		var $awidth = $('.subnav>li').width() + 2;
		console.log($awidth);
		var $liWdith = $subnav * $awidth;
		if( $liWdith > $topmdl ) {
			$('.left').addClass('toplft').removeClass('stoplft');
			$('.middle').addClass('topmdl').removeClass('stopmdl');
			$('.right').addClass('toprgt').removeClass('stoprgt');
		}else {
			$('.left').addClass('stoplft').removeClass('toplft');
			$('.middle').addClass('stopmdl').removeClass('topmdl');
			$('.right').addClass('stoprgt').removeClass('toprgt');
		}
	});
	
	$('.nav ul li img').hover(function() {
		var imgName = $(this).attr('name');
		$(this).attr('name',imgName + '_click');
		$(this).attr('src','images/theme/'+$skin+'/menu/' + imgName + '_click.png');
	},function() {
		var imgName = $(this).attr('name');
		if(imgName.indexOf('_click') != -1) {
			var NewImgName = imgName.substring(0,imgName.indexOf('_click'));
			$(this).attr('name',NewImgName);
			$(this).attr('src','images/theme/'+$skin+'/menu/' + NewImgName + '.png');
		}
	});
});
function menuclick(obj) {
	$('.nav ul li img').each(function() {
		var imgName = $(this).attr('name');
		if(imgName.indexOf('_click') != -1) {
			var NewImgName = imgName.substring(0,imgName.indexOf('_click'));
			$(this).attr('name',NewImgName);
			$(this).attr('src','images/theme/'+$skin+'/menu/' + NewImgName + '.png');
		}
	});
	var imgName = $(obj).attr('name');
	$(obj).attr('name',imgName + '_click');
	$(obj).attr('src','images/theme/'+$skin+'/menu/' + imgName + '_click.png');
}

function imgurl(imgUrl) {
	var winH = $(window).height();
	var winW = $(window).width();
	var wallpaper = $('#wallpapers');
	var _this = this;
	if(imgUrl !== null) {
		var img = wallpaper.find('img');
		wallpaper.html("<img src='"+imgUrl+"'></img>");
		getImgWh(imgUrl,function(imgW,imgH) {
			if(imgW <= winW) {
				img.css('width',winW);
			}else {
				img.css({"margin-left":-(imgW-winW)/2});
			}
			if (imgH <= winH) {
				img.css('height',winH);
			}else {
				img.css({'margin-top':-(imgH-winH)/2});
			}
		});
	}
	window.onresize = function() {
		_this.imgurl(imgUrl);
	}
}
function getImgWh(url, callback) {
        var width, height, intervalId, check, div, img = new Image(),
            body = document.body;
        img.src = url;

        //从缓存中读取
        if (img.complete) {
          return callback(img.width, img.height);
        };

        //通过占位提前获取图片头部数据
        if (body) {
          div = document.createElement('div');
          div.style.cssText = 'visibility:hidden;position:absolute;left:0;top:0;width:1px;height:1px;overflow:hidden';
          div.appendChild(img)
          body.appendChild(div);
          width = img.offsetWidth;
          height = img.offsetHeight;
          check = function() {
            if (img.offsetWidth !== width || img.offsetHeight !== height) {
              clearInterval(intervalId);
              callback(img.offsetWidth, img.clientHeight);
              img.onload = null;
              div.innerHTML = '';
              div.parentNode.removeChild(div);
            };
          };
          intervalId = setInterval(check, 150);
        };
        // 加载完毕后方式获取
        img.onload = function() {
          callback(img.width, img.height);
          img.onload = img.onerror = null;
          clearInterval(intervalId);
          body && img.parentNode.removeChild(img);
        };
      }
