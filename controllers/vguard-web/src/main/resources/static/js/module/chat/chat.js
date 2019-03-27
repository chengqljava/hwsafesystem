$(document).ready(function() {
	$('.personnel-list-btn').on('click', function() {
		var width = $('.personnel-list').width();
		if (width === 0) {
			$('.chatting').animate({width:'70%'});
			$('.personnel-list').animate({width:'30%'});
		} else {
			$('.chatting').animate({width:'100%'});
			$('.personnel-list').animate({width:'0'});
		}
		$(this).toggleClass('active');
	});

	$('.close-btn').on('click', function() {
		$('.chatting').animate({width:'100%'});
		$('.personnel-list').animate({width:'0'});
		$('.personnel-list-btn').removeClass('active');
	});
	
	var flag = 1;
	$('.chat-log-btn').on('click', function() {
		$(this).toggleClass('active');
		if (flag == 1) {
			$(".problems").hide();
			$(".chat-log").css("z-index", "10");
			flag = 0;
		} else {
			$(".problems").show();
			$(".chat-log").css("z-index", "-1");
			flag = 1;
		}
	});

//	$('.chat-log-btn').on('click', function() {
//		$('.chat-log').toggle();
//		$(this).toggleClass('active');
//	});

});

