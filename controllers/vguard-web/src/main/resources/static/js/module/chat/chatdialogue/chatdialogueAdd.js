
/**发送案例*/
function sendLawCase(caseid) {
    $.ajax({
        type: 'post',
        url: BASE_URL + '/chat/chatdialogue/sendlawcase/' + caseid,
        cache: false,
        dataType: 'json',
        success: function (json) {
            if (json.success == true) {
                parent.toast(json.msg);//弹出提示信息
                reloadChatPage();//重新加载
            } else {
                parent.toast(json.msg);
            }
        },
        error: function () {
            parent.toast("发送案例失败");
        }
    });
}

/**发送消息*/
$("#sendMsgBtn").on("click", function() {
	sendMsg();
	$("#msgContent").val('');
});

$("#msgContent").keydown(function (e) {
	var code;
	if (!e) var e = window.event;
	if (e.keyCode) code = e.keyCode;
	else if (e.which) code = e.which;
	if(code==13 && window.event) {
		e.returnValue = false;
	} else if (code==13) {
		e.preventDefault();
		sendMsg();
        $(this).val('');
	}
//    if (e.keyCode == '13') {
//        sendMsg();
//        $(this).val('');
//    }
});

function sendMsg() {
	var msg=$("#msgContent").val();
    if (msg != '') {
    	if(msg.length<=500){
        $.ajax({
            type: 'post',
            url: BASE_URL + '/chat/chatdialogue/sendMsg/' + msg,
            cache: false,
            dataType: 'json',
            success: function (json) {
                if (json.success == true) {
                    parent.toast(json.msg);//弹出提示信息
                    reloadChatPage();//重新加载
                } else {
                    parent.toast(json.msg);
                }
            },
            error: function () {
                parent.toast("发送信息失败");
            }
        });
    	}else
    		{
    		 parent.toast("发送信息必须小于500字！");
    		}
    }
    else {
        parent.toast("请输入发送信息！");
    }
}

