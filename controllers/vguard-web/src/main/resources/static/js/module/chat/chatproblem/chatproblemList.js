
function loadProblemList() {
    $.ajax({
        type: 'post',
        url: BASE_URL + '/chat/chatproblem/loadByList',
        cache: false,
        dataType: 'json',
        global: false,
        async: true,
        success: function (map) {
            createProblemList(map);
        },
        error: function () {
            parent.parent.toast("网络异常");
        }
    });
}


function createProblemList(map) {
    //遍历子节点
    if (map != null && map.length > 0) {
        for (var i = 0; i < map.length; i++) {
            $(".problems-list").append(createPrbolemInfo(map[i],i));
        }
    }
}

function createPrbolemInfo(obj,no)
{
	var html='<li class="problem-item">';
	html+='<h4 class="problem-title">问题'+(no+1)+'：'+obj.probleminfo+'</h4>';
	html+='<p class="problem-content">回答：'+obj.answer+'</p>';
	html+='</li>';
	return html;
}


/*详细显示*/
function display(problemid) {
    parent.openWin(BASE_URL + "/chat/chatproblem/display/" + problemid, '常见问题详细', '70%', '80%');
}
