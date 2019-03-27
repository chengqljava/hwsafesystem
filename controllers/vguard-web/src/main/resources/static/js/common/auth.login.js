function authen(){
	var BASE_URL = location.protocol + "//" + location.host
    + location.pathname.match("/[^/]*/?")[0]
	var $username = $("#username"), $password = $("#password");
	var username = $username.val(), password = $password.val();
	if(!username || username == ""){
		showAuthenMsg("请输入用户名");
		$username.select();
		return;
	}
	if(!password || password == ""){
		showAuthenMsg("请输入密码");
		$password.select();
		return;
	}
	$.ajax({
		url: BASE_URL+ "/login/validate",
		data: {"username": username, "password": password,usertype : 'ENT'},
		type: "post",
		success : function(data){
			console.log(data);
			if(data.success != 'false'){				
				window.location=BASE_URL+"last";
			}
			else{
				showAuthenMsg(data.msg);
			}
//			if(data){
//				if(data.code == "0" || data.code == "2"){
//					showAuthenMsg(data.message);
//					$username.select();
//					return;
//				}
//				if(data.code == "1" || data.code == "3"){
//					showAuthenMsg(data.message);
//					$password.select();
//					return;
//				}
//				if(data.code == "4"){
//					redrict(data.url);
//					return;
//				}else{
//					showAuthenMsg(data.message);
//					return;
//				}
//				
//			}
		},
		error : function(data){
			showAuthenMsg(data);
		}
	});
}

function showAuthenMsg(msg){
//	$("#authenMsgDiv").text(msg);
	var box_left = ($(window).width() -  $("#login_box").width()) / 2;
	//重点在这里，通过循环控制晃动的效果，例如幅度和时间次数
	for(var i = 1; i <= 5; i++){
		$("#login_box").animate({left: box_left - (50 - 10 * i)}, 80);
		$("#login_box").animate({left: box_left + 2 * (50 - 10 * i)}, 80);
		$("#login_box").css({"left": box_left});
	}
	
	
	if (window.loginErTimer) {
		clearTimeout(window.loginErTimer);
	}
	var $errMsgDom = $(".pocket");
	$errMsgDom.fadeIn(500, function(){
		window.loginErTimer = setTimeout(function(){
			$errMsgDom.fadeOut(500);
		}, 3000);
	});
}

function redrict(url){
	var BASEURI = location.protocol + "//" + location.host
	+ location.pathname.match("/[^/]*/?")[0];
	if(!url){
		url = "views/server/frame/index.jsp";
	}
//	$.cookie("loginFrom", "local", {path : "/"});
	window.location.href = BASEURI + url;
}

$(function(){
	var box_left = ($(window).width() -  $("#login_box").width()) / 2;
	$("#login_box").css({"left": box_left});
	//错误信息计时器
	window.loginErTimer = null;
//	$("#submitBtn").off("click").on("click", authen);
	$("body").keydown(function(e){
		if(e.keyCode == "13"){
			$("#submitBtn").trigger("click");
		}
	});
	/* 轮播*/
    var next =1;
    var current =0;
    setInterval(banner,4000);
    function banner() {
        if(current>1){
            next = 0;
        }
        else{
            next = current +1;
        }
        console.log(current,next)
        $('.main_banner ul li:eq('+ current +')').fadeOut(500);
        $('.main_banner ul li:eq('+ next +')').fadeIn(500);
        current ++;
        if( current >2){
            current = 0;
        }
    }
    $('.bannerNav').on('click','span',function(){
        var $id = $(this).data('id');
        if($id == current){
            return false;
        }
        $('.main_banner ul li:eq('+ (current) +')').fadeOut(500);        
        if( $id >2){
            current = 1;
            next = 2;
        }
        else{
            current = $id -1;
            next = $id +0;
        }
        banner();
    })
});