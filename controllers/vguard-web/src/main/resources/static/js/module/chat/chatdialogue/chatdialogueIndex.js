var chatList_map = new Array();
var chatListMaxNum = 200;
$(document).ready(function() {

	reloadChatPage();
	loadProblemList();

	loadDepartUserTree();

	loadChattingList();
	 window.setInterval(
	 function(){loadChattingList();},5000);
});

/* 案件选择 */
$(".share").bind(
		"click",
		function() {
			parent.openWin(BASE_URL + "/law/lawcase/CHAT/GOV_XZZF_ZFBA_AJLB",
					'案件选择', '70%', '80%');
		});

function loadChattingList() {
	$.ajax({
		type : 'post',
		url : BASE_URL + '/chat/chatdialogue/chattinglist',
		cache : false,
		dataType : 'json',
		data : {
			"rownum" : 30
		},
		global : false,
		async : true,
		success : function(map) {
			createChattingList(map);
		},
		error : function() {
			parent.parent.toast("网络异常");
		}
	});
}

function createChattingList(map) {
	// 遍历子节点
	if (map != null && map.length > 0) {
		var t_map = new Array();

		for (var i = map.length - 1; i >= 0; i--) {
			if (chatList_map != null && chatList_map.length > 0) {
				var filterarray = $.grep(chatList_map, function(value) {
					return value == map[i].DIALOGUEID;
				});

				if (filterarray.length == 0) {
					t_map.push(map[i].DIALOGUEID);
					$("#chattingList").append(createChatMsg(map[i]));
					$('#chattingList').scrollTop(
							$('#chattingList')[0].scrollHeight);
				}
			} else {
				t_map.push(map[i].DIALOGUEID);
				$("#chattingList").append(createChatMsg(map[i]));
				$('#chattingList')
						.scrollTop($('#chattingList')[0].scrollHeight);
			}
		}

		if (t_map.length > 0) { // 更新全局记录变量
			for (var i = 0; i < t_map.length; i++) {
				chatList_map.push(t_map[i]);
			}
			t_map = [];
		}

		if (chatList_map.length > chatListMaxNum) { // 超过数量限制，删除最早记录
			$("#chattingList li:eq(0)").remove();
			chatList_map.splice(0, 1);
		}
	}
}

function createChatMsg(obj) {
	if (obj.SENDER == $("#sender").val()) {
		return createChattingRight(obj);
	} else {
		return createChattingLeft(obj);
	}
}

function createChattingLeft(obj) {
	var html = '<li class="chat-left">';
	html += '<div class="avatar">';
	html += '<img src="' + BASE_URL
			+ '/images/module/chat/avatar.png" width="30" height="30">';
	html += '</div>';
	html += '<div class="chat-detail">';
	html += '<h3>';
	html += '<span class="name">' + obj.NICKNAME + '</span>';
	html += '<span class="date">'
			+ getFormatDateByLong(obj.DATELINE, "yyyy-MM-dd hh:mm:ss")
			+ '</span>';
	html += '</h3>';
	html += '<div class="chat-content">';
	if (obj.LAW_CASE_CASEID != "" && obj.LAW_CASE_CASEID != null) {
		html += '<span><a href="javascript:void(0);" onclick="displayCase(\''+obj.CHECKINFOID+'\',\''+obj.LAW_CASE_CASEID+'\',\''+obj.CASENAME+'\')">' + obj.CASENAME
		+ '</a></span>';
	} else {
		html += '<span class="content">' + obj.CONTENT + '</span>';
	}
	html += '<span class="arrow-left">';
	html += '</span>';
	html += '</div>';
	html += '</div>';
	html += '</li>';
	return html;
}

function createChattingRight(obj) {
	var html = '<li class="chat-right">';
	html += '<div class="chat-detail">';
	html += '<h3>';
	html += '<span class="name">' + obj.NICKNAME + '</span>';
	html += '<span class="date">'
			+ getFormatDateByLong(obj.DATELINE, "yyyy-MM-dd hh:mm:ss")
			+ '</span>';
	html += '</h3>';
	html += '<div class="chat-content">';
	if (obj.LAW_CASE_CASEID != "" && obj.LAW_CASE_CASEID != null) {
		html += '<span><a href="javascript:void(0);" onclick="displayCase(\''+obj.CHECKINFOID+'\',\''+obj.LAW_CASE_CASEID+'\',\''+obj.CASENAME+'\')">' + obj.CASENAME
				+ '</a></span>';
	} else {
		html += '<span class="content">' + obj.CONTENT + '</span>';
	}
	html += '<span class="arrow-right">';
	html += '</span>';
	html += '</div>';
	html += '</div>';
	html += '<div class="avatar">';
	html += '<img src="' + BASE_URL
			+ '/images/module/chat/avatar.png" width="30" height="30">';
	html += '</div>';
	html += '</li>';
	return html;
}

/*详细查询*/
function displayCase(checkinfoid,caseid,casename){
	parent.openWin(BASE_URL+"/law/lawdocinfo/menu?id="+checkinfoid+"&doctype=null&menupagetype=menuDisplay&caseid=" + caseid +"&writtype=null",casename,'80%','98%');	
}
