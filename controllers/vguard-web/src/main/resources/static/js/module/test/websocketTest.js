$(function() {
	//测试websocket
	var getCurUserinfoSkt = null;
    if ("WebSocket" in window) {
    	getCurUserinfoSkt = new ReconnectingWebSocket("ws://" + location.host + location.pathname.match("/[^/]*/?")[0] + 
  				  "/websocket/getSendUserInfo");
    } else if ("MozWebSocket" in window) {
    	getCurUserinfoSkt = new MozWebSocket("ws://" + location.host + location.pathname.match("/[^/]*/?")[0] + 
    				  "/websocket/getSendUserInfo");
    } else {
    	getCurUserinfoSkt = new SockJS(BASE_URL + "sockjs/websocket/getSendUserInfo");
    }

    //定义创建链接时的方法
    getCurUserinfoSkt.onopen = function (evn) {
    	console.log("getCurUserinfoSkt has Connected!");
    };

    //定义接收消息时的方法
    getCurUserinfoSkt.onmessage = function(evn) {
    	//将返回消息填充指点dom内
    	$("#testWebsocket").append(evn.data + "<br />")
    };

    //定义发生错误时的方法
    getCurUserinfoSkt.onerror = function (evn) {
    	console.log("getCurUserinfoSkt error");
    };
    
    //定义关闭连接时的方法
    getCurUserinfoSkt.onclose = function (evn) {};
    
    window.onbeforeunload = function() {
    	getCurUserinfoSkt.close()
    };
    
    //向服务端发送消息
    $("#sendMsg").off("click").on("click", function() {
    	//执行向服务端发送websocket请求
    	getCurUserinfoSkt.send("abc");
    	return false;
    });
    
    //关闭链接
    $("#closeBtn").off("click").on("click", function() {
    	getCurUserinfoSkt.close();
    	return false;
    });
    
    //打开链接
    $("#openBtn").off("click").on("click", function() {
    	getCurUserinfoSkt.open();
    	return false;
    });
});
