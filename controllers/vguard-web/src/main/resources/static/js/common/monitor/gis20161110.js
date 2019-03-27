$(function() {
	var flag = 1;
	$('.area2 li').click(function() {
	$('.allContent').css('display','block');
		$('.arrow').css('background-image','url(images/gis/closeBtn.png)');
		flag = 0;
	});
	$('.detectionAlarm').on('click',function() {
		if(flag == 1) {
			$('.detectionShow').css('display','block');
			flag = 0;
		}else {
			$('.detectionShow').css('display','none');
			flag = 1;
		}
	});
	$('.header-right a').click(function () {
		$(this).addClass('active').siblings().removeClass('active');
	});

});


function showDiv() {
	$('.area2').css('display','block');
}