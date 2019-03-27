var count = 0;
var totalPage = 0
var currentPage = 0;
var pageSize = 10;

function reloadChatPage(){
	loadChatPage(1, 10);
}

$("#firstPage").bind("click", function () {
    loadChatPage(1, pageSize);
});
$("#prevPage").bind("click", function () {
    if (currentPage - 1 > 0) {
        loadChatPage(currentPage - 1, pageSize);
    } else {
        parent.parent.toast("已是第一页！");
    }
});
$("#nextPage").bind("click", function () {
    if (currentPage + 1 <= totalPage) {
        loadChatPage(currentPage + 1, pageSize);
    } else {
        parent.parent.toast("已是最后一页！");
    }
});
$("#lastPage").bind("click", function () {
    loadChatPage(totalPage, pageSize);
});

$('#currentPage').keydown(function (event) {
    if (event.keyCode == 13) {
        if ($("#currentPage").val() >= 1 && $("#currentPage").val() <= totalPage) {
            loadChatPage($("#currentPage").val(), pageSize);
        } else {
            parent.parent.toast("请输入正确的页数！");
        }
    }
});

$('#selectPage').on('change', function () {
    pageSize = $('#selectPage option:selected').val();
    loadChatPage(1, pageSize);
});



function loadChatPage(pageNo, pageSize) {
    $.ajax({
        type: 'post',
        url: BASE_URL + '/chat/chatdialogue/loadChatPage',
        cache: false,
        dataType: 'json',
        data: {
            "pageNo": pageNo,
            "pageSize": pageSize
        },
        global: false,
        async: true,
        success: function (map) {
            createChatPageList(map);
            initPager(pageNo, pageSize);
        },
        error: function () {
            parent.parent.toast("网络异常");
        }
    });
}

function initPager(pageNo, pageSize) {
    if (count / pageSize > parseInt(count / pageSize)) {
        totalPage = parseInt(count / pageSize) + 1;
    } else {
        totalPage = parseInt(count / pageSize);
    }
    $("#totalPage").html(totalPage);
    currentPage = pageNo;
    $("#currentPage").val(currentPage);
}

function createChatPageList(map) {
    $(".chat-log-list").html("");
    if (map != null && map.length > 0) {
        for (var i = 0; i < map.length; i++) {
            if (i == 0) {
                count = map[i].Count;
            }
            else {
                $(".chat-log-list").append(createChatInfo(map[i], i));
            }
        }
    }
}

function createChatInfo(obj) {
    var html = '<li>';
    html += '<h3>';
    html += '<span>' + obj.NICKNAME + '</span>';
    html += '<span>' + getFormatDateByLong(obj.DATELINE, "yyyy-MM-dd hh:mm:ss") + '</span>';
    html += '</h3>';
	if (obj.LAW_CASE_CASEID != "" && obj.LAW_CASE_CASEID != null) {
		html += '<div class="chat-content"><a href="javascript:void(0);" onclick="displayCase(\''+obj.CHECKINFOID+'\',\''+obj.LAW_CASE_CASEID+'\',\''+obj.CASENAME+'\')">' + obj.CASENAME
				+ '</a></div>';
	} else {
		html += '<div class="chat-content">' + obj.CONTENT + '</div>';
	}
    html += ' </li>';
    return html;
}




