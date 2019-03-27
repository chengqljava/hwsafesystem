$(function() {  
			/*var $box = $('.sbox')
			$box.hide();
			$('.checkbtn span').css('background','url('+BASE_URL+'/images/theme/'+$skin+'/main/pbtn.png) no-repeat 0 0');
			$('.checkbtn').click(function() {
				if($box.is(':visible')) {
					$box.hide();
					$('.checkbtn span').css('background','url('+BASE_URL+'/images/theme/'+$skin+'/main/pbtn.png) no-repeat 0 0');
				}else {
					$box.show();
					$('.checkbtn span').css('background','url('+BASE_URL+'/images/theme/'+$skin+'/main/dbtn.png) no-repeat 0 0');
				}
			});*/
			$('.tab ul li').click(function() {
				$(this).addClass('active').siblings().removeClass('active');
			});
			var pwidth = $(window).width() - 174;
			//alert(pwidth);
			$('.pRight').css('width',pwidth);
			
			$(window).resize(function() {
				var pwidth = $(window).width() - 174;
				$('.pRight').css('width',pwidth);
			});
			
		});