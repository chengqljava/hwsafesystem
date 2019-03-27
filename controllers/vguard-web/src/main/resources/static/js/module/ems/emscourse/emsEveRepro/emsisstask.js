function initemsisstask(page) {
    $.ajax({
        type: "post",
        url: BASE_URL + "ems/emssucisstask/list",
        dataType: "json",
        data: {
            eventid: $("#eventid").val(),
            page:page||1,
            rows:4,
            sidx:'RECEIVETIME',
            sord:'asc'
        },
        success: function (data) {
            var emsisstaskTpt = _.template($("#emsisstaskTpt").html());
            data.baseUrl = BASE_URL;
            $("#emsisstaskDiv").html(emsisstaskTpt(data));
            // 事后评估分页
            Page({
                num: data.total, //页码数
                startnum: page||1, //指定页码
                elem: $('#yjrwPage'), //指定的元素
                callback: function (n) { //回调函数 n 为当前页码
                    initemsisstask(n);
                }
            })
        },
        error : function() {
            parent.toast("初始化信息加载失败!");
        }
    });
}

function showemsisstaskInfo(taskid) {
    parent.openWin(BASE_URL + "views/module/ems/emsisstask/emsisstasktrace.html?taskId="+taskid,
        "任务跟踪详情","70%", "55%");
}