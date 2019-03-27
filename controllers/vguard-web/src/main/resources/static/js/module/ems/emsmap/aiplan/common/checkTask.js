/**
 * 任务信息
 */
$(function () {

    var taskid = getQueryString("taskId");

    $.ajax({
        type: "post",
        url: BASE_URL + "ems/emssucisstask/checktask",
        dataType: "json",
        data: {
        	taskid:taskid
    	},
        success: function (data) {
        	var checkTaskTpt = _.template($("#checkTaskTpt").html());
            $("#checkTaskForm").html(checkTaskTpt(data));
        },
        error: function () {
        	parent.parent.toast("初始化信息加载失败!");
        }
    });
    
});

function getQueryString(name)
{
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return  unescape(r[2]); return null;
}