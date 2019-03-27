/*
 * 开始学习
 */
$(function() {
	var attachid = getQueryString("attachid");
	$.ajax({
		type : "post",
		url : BASE_URL + "train/etsattach/load",
		dataType : "json",
		data : {
			attachid : attachid
		},
		success : function(data) {
			if (data) {
				var name = data.attachname;// 附件名称
				var url = data.attachurl;// 路径
				initVideo('video', name, url);
			}
		},
		error : function() {
			parent.toast("初始化信息加载失败");
		}
	});
});

var sec = 0;// 学习时间

/*
 * 视频加载
 */
function initVideo(code, name, url) {
	var arr = name.split(".");
	var httpurl = location.protocol + "//" + location.host + "/";
	if (arr[1] == "mp4") {
		$('#' + code)
				.append(
						'<video id="media" width="100%" height="90%" controls ishivideo = "true" autoplay = "true" isrotate = "false" autoHide = "true">'
								+ '<source src="'
								+ httpurl
								+ 'zwsafe_uploadFiles'
								+ url
								+ '" type="video/mp4">' + '</video>')
	} else if (arr[1] == "ogg") {
		$('#' + code)
				.append(
						'<video id="media" width="100%" height="90%" controls ishivideo = "true" autoplay = "true" isrotate = "false" autoHide = "true">'
								+ '<source src="'
								+ httpurl
								+ 'zwsafe_uploadFiles'
								+ url
								+ '" type="video/ogg">' + '</video>')
	} else {
		$('#' + code)
				.append(
						'<video id="media" width="100%" height="90%" controls ishivideo = "true" autoplay = "true" isrotate = "false" autoHide = "true">'
								+ '<source src="'
								+ httpurl
								+ 'zwsafe_uploadFiles'
								+ url
								+ '" type="video/webm">' + '</video>')
	}
}

function time_fun() {
	timer = setInterval(function() {
		sec++;
		var date = new Date(0, 0)
		date.setSeconds(sec);
		var h = date.getHours(), m = date.getMinutes(), s = date.getSeconds();
		document.getElementById("learntime").innerText = two_char(h) + ":"
				+ two_char(m) + ":" + two_char(s);
	}, 1000);
}

function two_char(n) {
	return n >= 10 ? n : "0" + n;
}

/**
 * 保存
 * 
 * @returns
 */
function endLearn() {
	if (sec < 30) {
		parent.confirm("学习时间小于30秒，不计入学习时间，确认结束学习?", function() {
			parent.closeWin();// 关闭弹出框
		});
	} else {
		var attachid = getQueryString("attachid");
		$.ajax({
			type : "post",
			url : BASE_URL + "train/etscislearn/save",
			data : {
				attachid : attachid,
				time : sec
			},
			success : function(data) {
				if (data.success == true) {
					parent.toast(data.msg);// 弹出提示信息
					parent.getActiveIFrame().reloadGrid();// 重新加载
					parent.closeWin();// 关闭弹出框
				} else {
					parent.toast(data.msg);
				}
			},
			error : function() {
				parent.toast("编辑失败");
			}
		});
	}
}

function getQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if (r != null)
		return unescape(r[2]);
	return null;
}
